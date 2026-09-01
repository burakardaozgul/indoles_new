import type { ZodType } from "zod";
import type { DiagnooEnv } from "./firecrawl";

const PRIMARY = "gemini-3.5-flash";
const FALLBACK = "gemini-3.1-flash-lite";

function endpoint(model: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
}

async function callOnce(env: DiagnooEnv, model: string, system: string, user: string, imagesBase64: string[]): Promise<{ ok: true; text: string } | { ok: false; status: number }> {
  const parts: unknown[] = [{ text: user }];
  for (const img of imagesBase64) parts.push({ inlineData: { mimeType: "image/png", data: img } });
  const res = await fetch(endpoint(model), {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.2 },
    }),
  });
  if (!res.ok) return { ok: false, status: res.status };
  const body = (await res.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  return { ok: true, text: body.candidates?.[0]?.content?.parts?.[0]?.text ?? "" };
}

export async function geminiJson<T>(
  env: DiagnooEnv,
  opts: { system: string; user: string; schema: ZodType<T>; imagesBase64?: string[] },
): Promise<T> {
  const images = opts.imagesBase64 ?? [];
  let result = await callOnce(env, PRIMARY, opts.system, opts.user, images);
  if (!result.ok && (result.status === 429 || result.status >= 500)) {
    result = await callOnce(env, FALLBACK, opts.system, opts.user, images);
  }
  if (!result.ok) throw new Error(`Gemini error: ${result.status}`);

  const tryParse = (text: string): T | null => {
    try {
      const parsed = opts.schema.safeParse(JSON.parse(text));
      return parsed.success ? parsed.data : null;
    } catch { return null; }
  };

  const first = tryParse(result.text);
  if (first !== null) return first;

  // Tek onarım denemesi: bozuk çıktıyı şema hatırlatmasıyla geri gönder.
  const repair = await callOnce(env, PRIMARY, opts.system,
    `${opts.user}\n\nÖnceki cevabın geçerli JSON değildi:\n${result.text}\nYALNIZCA şemaya uyan geçerli JSON döndür.`, []);
  if (repair.ok) {
    const second = tryParse(repair.text);
    if (second !== null) return second;
  }
  throw new Error("Gemini output failed schema validation after repair attempt");
}
