import { tool } from "ai";
import { z } from "zod";
import { db } from "@/server/db";
import { packages, consultants } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

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
    execute: async ({ pillar }) => {
      const conditions = [eq(packages.active, true)];
      if (pillar) conditions.push(eq(packages.pillar, pillar));
      const rows = await db
        .select()
        .from(packages)
        .where(and(...conditions));
      return rows.map((r) => ({
        slug: r.slug,
        pillar: r.pillar,
        pricing: r.pricing,
      }));
    },
  }),

  listConsultants: tool({
    description: "Aktif danışmanları listeler (pillar filtresi opsiyonel).",
    parameters: z.object({
      pillar: z.enum(["growth", "transform", "build"]).optional(),
    }),
    execute: async () => {
      const rows = await db
        .select({
          slug: consultants.slug,
          pillarFocus: consultants.pillarFocus,
          expertiseTags: consultants.expertiseTags,
        })
        .from(consultants)
        .where(eq(consultants.active, true));
      return rows;
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
