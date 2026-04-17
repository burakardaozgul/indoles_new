import { inngest } from "../client";

export const briefTriage = inngest.createFunction(
  { id: "brief-triage" },
  { event: "brief/created" },
  async ({ event, step }) => {
    await step.run("log", async () => {
      console.log("Brief triage:", event.data.briefId);
    });

    // TODO: Resend ile kullanıcıya + admin'e email
    // TODO: Cal.com ile uygun slot'ları çek
    // TODO: briefs.status = 'triaged' update
    return { ok: true };
  }
);
