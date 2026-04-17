import { Inngest } from "inngest";

const inngestOptions: { id: string; eventKey?: string } = {
  id: "indoles-web",
};
if (process.env.INNGEST_EVENT_KEY) {
  inngestOptions.eventKey = process.env.INNGEST_EVENT_KEY;
}

export const inngest = new Inngest(inngestOptions);

// Event taksonomisi — docs/11-funnel-customer-flows.md
export type InngestEvents = {
  "brief/created": { data: { briefId: string; userId: string } };
  "booking/created": { data: { bookingId: string; userId: string } };
  "payment/completed": { data: { paymentId: string } };
};
