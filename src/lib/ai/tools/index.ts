import { tool } from "ai";
import { z } from "zod";
import { PACKAGES } from "@/lib/content/packages";
import { CONSULTANTS } from "@/lib/content/consultants";
import type { Pillar } from "@/lib/content/types";

/**
 * INDOLES AI agent tool'ları.
 * Detay: docs/07-ai-agent-spec.md §4.
 */

export const agentTools = {
  getPackages: tool({
    description:
      "INDOLES paket kataloğundan filtreye göre aktif paketleri döner.",
    parameters: z.object({
      pillar: z.enum(["growth", "transform", "build"]).optional(),
      locale: z.enum(["tr", "en"]),
    }),
    execute: async ({ pillar, locale }) => {
      const filtered = pillar
        ? PACKAGES.filter((p) => p.pillar === (pillar as Pillar))
        : PACKAGES;
      return filtered.map((p) => ({
        slug: p.slug[locale],
        pillar: p.pillar,
        pricing: p.pricing,
      }));
    },
  }),

  listConsultants: tool({
    description: "Aktif danışmanları listeler (pillar filtresi opsiyonel).",
    parameters: z.object({
      pillar: z.enum(["growth", "transform", "build"]).optional(),
    }),
    execute: async ({ pillar }) => {
      const filtered = pillar
        ? CONSULTANTS.filter((c) => c.pillars.includes(pillar as Pillar))
        : CONSULTANTS;
      return filtered.map((c) => ({
        slug: c.slug,
        pillarFocus: c.pillars,
        expertiseTags: c.expertise,
      }));
    },
  }),

  escalateToHuman: tool({
    description:
      "Agent çözemediğinde veya kullanıcı talep ettiğinde insana yönlendirir.",
    parameters: z.object({
      reason: z.enum([
        "out_of_scope",
        "sensitive_topic",
        "user_request",
        "low_confidence",
        "repeated_failure",
      ]),
      conversationSummary: z.string().min(10).max(2000),
    }),
    execute: async ({ reason }) => {
      // TODO: conversation.resolved=false + admin e-posta
      return {
        escalated: true,
        reason,
        followUp:
          "Bir insan danışman en geç 1 iş günü içinde dönecek. Bu arada indoles.com.tr/iletisim üzerinden de rezervasyon açılabilir.",
      };
    },
  }),
} as const;

export type AgentTools = typeof agentTools;
