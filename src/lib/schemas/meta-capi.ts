import { z } from "zod";

/**
 * `/api/meta/capi` gövdesi.
 *
 * Olay adı serbest metin değil kapalı bir küme: uç nokta herkese açık ve
 * doğrulanmazsa Meta veri kaynağına keyfi olay adları yazılabilirdi.
 * Liste `meta-events.ts`teki eşlemenin ürettiği adlarla sınırlı.
 */
export const metaCapiSchema = z.object({
  eventName: z.enum(["Lead", "ViewContent"]),
  eventId: z.string().min(8).max(100),
  eventSourceUrl: z.string().url().max(500).optional(),
  customData: z.record(z.string(), z.unknown()).optional(),
  email: z.string().email().max(200).optional(),
  phone: z.string().min(6).max(30).optional(),
});

export type MetaCapiInput = z.infer<typeof metaCapiSchema>;
