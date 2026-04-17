import { z } from "zod";

export const popupLeadEventDataSchema = z.object({
  submissionId: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  company: z.string(),
  title: z.string(),
  persona: z.enum(["donusum-teknoloji", "buyume-pazarlar"]),
  personaLabel: z.string(),
  problems: z.array(z.string()),
  submissionType: z.enum(["booking", "contact"]),
  calComBookingUrl: z.string().nullable().optional(),
  locale: z.enum(["tr", "en"]),
  utm: z.object({
    source: z.string().nullable().optional(),
    medium: z.string().nullable().optional(),
    campaign: z.string().nullable().optional(),
  }),
});

export type PopupLeadEventData = z.infer<typeof popupLeadEventDataSchema>;

export const POPUP_LEAD_CREATED_EVENT = "popup/lead.created" as const;
