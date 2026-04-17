import { streamText, type CoreMessage } from "ai";
import { google } from "@ai-sdk/google";
import { buildSystemPrompt, type Persona } from "@/lib/ai/prompts/indoles-agent";
import { agentTools } from "@/lib/ai/tools";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = (await req.json()) as {
    messages: CoreMessage[];
    persona?: Persona;
  };

  const result = streamText({
    model: google("gemini-1.5-flash"),
    system: buildSystemPrompt(body.persona ?? "unknown"),
    messages: body.messages,
    tools: agentTools,
    temperature: 0.3,
    maxTokens: 1024,
  });

  return result.toDataStreamResponse();
}
