import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { briefTriage } from "@/lib/inngest/functions/brief-triage";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [briefTriage],
});
