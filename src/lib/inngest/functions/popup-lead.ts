import { inngest } from "../client";
import { sendEmail } from "../../email/client";
import { PopupLeadNotificationEmail } from "../../email/templates/popup-lead-notification";
import { PopupLeadConfirmationEmail } from "../../email/templates/popup-lead-confirmation";
import { markEmailSentForSubmission } from "../../../server/db/mutations/popup";

type PayloadBase = {
  submissionId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  persona: "donusum-teknoloji" | "buyume-pazarlar";
  personaLabel: string;
  problems: string[];
  submissionType: "booking" | "contact";
  calComBookingUrl?: string | null;
  locale: "tr" | "en";
  utm: { source?: string | null; medium?: string | null; campaign?: string | null };
};

export async function handlePopupLeadCreated(data: PayloadBase): Promise<void> {
  const adminLink = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://indoles.com.tr"}/admin/leads/${data.submissionId}`;

  await sendEmail({
    to: "lead@indoles.com.tr",
    subject: `Yeni lead: ${data.personaLabel} — ${data.firstName} ${data.lastName} (${data.company})`,
    react: PopupLeadNotificationEmail({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      title: data.title,
      personaLabel: data.personaLabel,
      problems: data.problems,
      submissionType: data.submissionType,
      calComBookingUrl: data.calComBookingUrl ?? null,
      locale: data.locale,
      utm: {
        ...(data.utm.source != null && { source: data.utm.source }),
        ...(data.utm.medium != null && { medium: data.utm.medium }),
        ...(data.utm.campaign != null && { campaign: data.utm.campaign }),
      },
      adminLink,
    }),
  });

  await sendEmail({
    to: data.email,
    subject: data.locale === "tr" ? "INDOLES: İsteğini aldık" : "INDOLES: We've got your request",
    react: PopupLeadConfirmationEmail({
      firstName: data.firstName,
      locale: data.locale,
      variant: data.submissionType,
      calComBookingUrl: data.calComBookingUrl ?? null,
    }),
  });

  await markEmailSentForSubmission(data.submissionId);
}

export const popupLeadCreatedFn = inngest.createFunction(
  { id: "popup-lead-created", name: "Popup Lead Created" },
  { event: "popup/lead.created" },
  async ({ event, step }) => {
    await step.run("send-emails", async () => {
      await handlePopupLeadCreated(event.data as PayloadBase);
    });
  }
);
