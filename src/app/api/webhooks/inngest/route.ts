import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { briefTriage, popupLeadCreatedFn } from "@/lib/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [briefTriage, popupLeadCreatedFn],
});
