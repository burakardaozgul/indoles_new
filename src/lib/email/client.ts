import { Resend } from "resend";
import type { ReactElement } from "react";

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "digital@indoles.com.tr";

type SendEmailOptions = {
  to: string;
  subject: string;
  react: ReactElement;
  idempotencyKey?: string;
};

export async function sendEmail(options: SendEmailOptions): Promise<{ id: string }> {
  if (!resend) {
    throw new Error("Resend client not initialised — RESEND_API_KEY is missing");
  }
  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to: options.to,
    subject: options.subject,
    react: options.react,
    ...(options.idempotencyKey ? { idempotencyKey: options.idempotencyKey } : {}),
  });
  if (result.error) {
    throw new Error(`Resend error: ${result.error.message ?? JSON.stringify(result.error)}`);
  }
  if (!result.data) {
    throw new Error("Resend returned no data");
  }
  return { id: result.data.id };
}
