import { createTRPCRouter, publicProcedure } from "../trpc";
import { popupSubmitSchema } from "../../lib/popup/schemas";
import { db } from "../db";
import { popupSubmissions } from "../db/schema";
import { inngest } from "../../lib/inngest/client";
import { resolveProblemText } from "../../lib/popup/problems";
import { POPUP_LEAD_CREATED_EVENT } from "../../lib/inngest/events/popup-lead";

function personaLabel(persona: "donusum-teknoloji" | "buyume-pazarlar", locale: "tr" | "en"): string {
  if (persona === "donusum-teknoloji") {
    return locale === "tr" ? "Dönüşüm ve Teknoloji" : "Transformation & Technology";
  }
  return locale === "tr" ? "Büyüme ve Yeni Pazarlar" : "Growth & New Markets";
}

export const popupRouter = createTRPCRouter({
  submit: publicProcedure
    .input(popupSubmitSchema)
    .mutation(async ({ input }) => {
      const now = new Date();

      // NOTE: Cal.com quick-book integration deferred. Booking path currently
      // saves submission + triggers lead email, same as contact path.
      // Future: call createQuickBooking() when CAL_COM_API_KEY is configured.
      const calComBookingId: string | null = null;
      const bookingUrl: string | null = null;

      const [row] = await db
        .insert(popupSubmissions)
        .values({
          sessionId: input.sessionId,
          persona: input.persona,
          problems: input.problems,
          firstName: input.lead?.firstName ?? null,
          lastName: input.lead?.lastName ?? null,
          phone: input.lead?.phone ?? null,
          email: input.lead?.email ?? null,
          company: input.lead?.company ?? null,
          title: input.lead?.title ?? null,
          submissionType: input.submissionType,
          kvkkConsentAt: input.lead?.kvkkConsent ? now : null,
          locale: input.locale,
          calComBookingId,
          userAgent: input.userAgent ?? null,
          referrer: input.referrer ?? null,
          utmSource: input.utmSource ?? null,
          utmMedium: input.utmMedium ?? null,
          utmCampaign: input.utmCampaign ?? null,
        })
        .returning({ id: popupSubmissions.id });

      if (!row) {
        throw new Error("DB insert returned no row");
      }

      if ((input.submissionType === "booking" || input.submissionType === "contact") && input.lead) {
        const problemTexts = input.problems.map((slug) => resolveProblemText(slug, input.locale));

        await inngest.send({
          name: POPUP_LEAD_CREATED_EVENT,
          data: {
            submissionId: row.id,
            firstName: input.lead.firstName,
            lastName: input.lead.lastName,
            email: input.lead.email,
            phone: input.lead.phone,
            company: input.lead.company,
            title: input.lead.title,
            persona: input.persona,
            personaLabel: personaLabel(input.persona, input.locale),
            problems: problemTexts,
            submissionType: input.submissionType,
            calComBookingUrl: bookingUrl,
            locale: input.locale,
            utm: {
              source: input.utmSource ?? null,
              medium: input.utmMedium ?? null,
              campaign: input.utmCampaign ?? null,
            },
          },
        });
      }

      return { submissionId: row.id, bookingUrl };
    }),
});
