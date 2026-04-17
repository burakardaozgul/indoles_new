import { z } from "zod";
import { PERSONAS } from "./personas";
import { getAllProblemSlugs } from "./problems";

const personaEnum = z.enum(PERSONAS.map((p) => p.slug) as [string, ...string[]]);
const problemEnum = z.enum(getAllProblemSlugs() as [string, ...string[]]);

export const leadFormSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  phone: z.string().min(7).max(30).regex(/^[+0-9\s()-]+$/, "invalid phone"),
  email: z.string().email(),
  company: z.string().min(2).max(200),
  title: z.string().min(2).max(100),
  kvkkConsent: z.literal(true, {
    errorMap: () => ({ message: "KVKK consent is required" }),
  }),
});

export type LeadFormInput = z.infer<typeof leadFormSchema>;

const baseSubmit = z.object({
  sessionId: z.string().min(1),
  persona: personaEnum,
  problems: z.array(problemEnum).length(3),
  locale: z.enum(["tr", "en"]),
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

export const popupSubmitSchema = z.discriminatedUnion("submissionType", [
  baseSubmit.extend({ submissionType: z.literal("booking"), lead: leadFormSchema }),
  baseSubmit.extend({ submissionType: z.literal("contact"), lead: leadFormSchema }),
  baseSubmit.extend({ submissionType: z.literal("dismissed"), lead: leadFormSchema.optional() }),
  baseSubmit.extend({ submissionType: z.literal("skipped"), lead: leadFormSchema.optional() }),
]);

export type PopupSubmitInput = z.infer<typeof popupSubmitSchema>;
