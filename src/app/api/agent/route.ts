import { cookies } from "next/headers";
import { streamText, type CoreMessage } from "ai";
import { google } from "@ai-sdk/google";
import {
  buildSystemPrompt,
  buildPopupContextBlock,
  type Persona,
  type PopupAgentContext,
} from "@/lib/ai/prompts/indoles-agent";
import { agentTools } from "@/lib/ai/tools";
import { POPUP_COOKIE_NAME } from "@/lib/popup/cookie";
import { resolveProblemText } from "@/lib/popup/problems";

export const maxDuration = 30;

async function readPopupContext(locale: "tr" | "en"): Promise<PopupAgentContext> {
  const jar = await cookies();
  const c = jar.get(POPUP_COOKIE_NAME);
  if (!c?.value) return null;
  try {
    const state = JSON.parse(decodeURIComponent(c.value));
    if (state.outcome !== "completed") return null;
    if (!state.persona || !Array.isArray(state.problems)) return null;
    const problems = (state.problems as string[])
      .slice(0, 3)
      .map((slug) => resolveProblemText(slug, locale));
    return { persona: state.persona, problems };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    messages: CoreMessage[];
    persona?: Persona;
    locale?: "tr" | "en";
  };

  const locale: "tr" | "en" = body.locale === "en" ? "en" : "tr";
  const popupCtx = await readPopupContext(locale);
  const popupBlock = buildPopupContextBlock(popupCtx, locale);
  const baseSystem = buildSystemPrompt(body.persona ?? "unknown");
  const system = popupBlock ? `${baseSystem}\n\n${popupBlock}` : baseSystem;

  const result = streamText({
    model: google("gemini-1.5-flash"),
    system,
    messages: body.messages,
    tools: agentTools,
    temperature: 0.3,
    maxTokens: 1024,
  });

  return result.toDataStreamResponse();
}
