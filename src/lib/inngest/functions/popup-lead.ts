import { inngest } from "../client";
import { sendEmail } from "../../email/client";
import { PopupLeadNotificationEmail } from "../../email/templates/popup-lead-notification";
import { PopupLeadConfirmationEmail } from "../../email/templates/popup-lead-confirmation";
import {
  type PopupLeadEventData,
  POPUP_LEAD_CREATED_EVENT,
} from "../events/popup-lead";

function adminSubject(data: PopupLeadEventData): string {
  return `Yeni lead: ${data.personaLabel} — ${data.firstName} ${data.lastName} (${data.company})`;
}

function userSubject(data: PopupLeadEventData): string {
  return data.locale === "tr"
    ? "INDOLES: İsteğini aldık"
    : "INDOLES: We've got your request";
}

export async function handlePopupLeadCreated(data: PopupLeadEventData): Promise<void> {
  const adminLink = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://indoles.com.tr"}/admin/leads/${data.submissionId}`;

  await sendEmail({
    to: "lead@indoles.com.tr",
    subject: adminSubject(data),
    idempotencyKey: `${data.submissionId}:admin`,
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
    subject: userSubject(data),
    idempotencyKey: `${data.submissionId}:user`,
    react: PopupLeadConfirmationEmail({
      firstName: data.firstName,
      locale: data.locale,
      variant: data.submissionType,
      calComBookingUrl: data.calComBookingUrl ?? null,
    }),
  });

}

export const popupLeadCreatedFn = inngest.createFunction(
  { id: "popup-lead-created", name: "Popup Lead Created" },
  { event: POPUP_LEAD_CREATED_EVENT },
  async ({ event, step }) => {
    const data = event.data as PopupLeadEventData;

    const adminLink = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://indoles.com.tr"}/admin/leads/${data.submissionId}`;

    await step.run("send-admin-notification", async () => {
      await sendEmail({
        to: "lead@indoles.com.tr",
        subject: adminSubject(data),
        idempotencyKey: `${data.submissionId}:admin`,
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
    });

    await step.run("send-user-confirmation", async () => {
      await sendEmail({
        to: data.email,
        subject: userSubject(data),
        idempotencyKey: `${data.submissionId}:user`,
        react: PopupLeadConfirmationEmail({
          firstName: data.firstName,
          locale: data.locale,
          variant: data.submissionType,
          calComBookingUrl: data.calComBookingUrl ?? null,
        }),
      });
    });

  }
);
