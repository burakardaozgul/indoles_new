import { eq } from "drizzle-orm";
import { db } from "../index";
import { popupSubmissions } from "../schema";

export async function markEmailSentForSubmission(id: string): Promise<void> {
  await db
    .update(popupSubmissions)
    .set({ emailSentAt: new Date() })
    .where(eq(popupSubmissions.id, id));
}
