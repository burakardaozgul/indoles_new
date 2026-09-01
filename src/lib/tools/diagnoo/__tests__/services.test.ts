import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { z } from "zod";
import { scrapePage, ScrapeError } from "../services/firecrawl";
import { geminiJson } from "../services/gemini";
import { fetchCwv } from "../services/psi";

const env = { GEMINI_API_KEY: "g-key", FIRECRAWL_API_KEY: "f-key", PSI_API_KEY: "p-key" };
const fetchMock = vi.fn();
beforeEach(() => { vi.stubGlobal("fetch", fetchMock); fetchMock.mockReset(); });
afterEach(() => { vi.unstubAllGlobals(); });

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

describe("scrapePage", () => {
  it("markdown/links/screenshot döndürür", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({
      success: true,
      data: { markdown: "# Mağaza", links: ["https://a.com/urun"], screenshot: "https://cdn/ss.png",
        metadata: { title: "Mağaza", description: "Açıklama" } },
    }));
    const page = await scrapePage(env, "https://a.com", { screenshot: true });
    expect(page.markdown).toContain("Mağaza");
    expect(page.links).toHaveLength(1);
    expect(page.screenshotUrl).toBe("https://cdn/ss.png");
    const [reqUrl, init] = fetchMock.mock.calls[0]!;
    expect(String(reqUrl)).toContain("firecrawl");
    expect((init as RequestInit).headers).toMatchObject({ Authorization: "Bearer f-key" });
  });
  it("hata durumunda ScrapeError fırlatır", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ success: false }, 402));
    await expect(scrapePage(env, "https://a.com")).rejects.toBeInstanceOf(ScrapeError);
  });
});

describe("geminiJson", () => {
  const schema = z.object({ score: z.number() });
  const geminiBody = (text: string) => ({ candidates: [{ content: { parts: [{ text }] } }] });

  it("geçerli JSON'u Zod'dan geçirip döndürür", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(geminiBody('{"score": 0.7}')));
    const out = await geminiJson(env, { system: "s", user: "u", schema });
    expect(out.score).toBe(0.7);
    expect(String(fetchMock.mock.calls[0]![0])).toContain("gemini-3.5-flash");
  });
  it("bozuk JSON'da bir onarım denemesi yapar", async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(geminiBody("skor: yüksek")))
      .mockResolvedValueOnce(jsonResponse(geminiBody('{"score": 0.5}')));
    const out = await geminiJson(env, { system: "s", user: "u", schema });
    expect(out.score).toBe(0.5);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it("429'da fallback modele düşer", async () => {
    fetchMock
      .mockResolvedValueOnce(new Response("rate limited", { status: 429 }))
      .mockResolvedValueOnce(jsonResponse(geminiBody('{"score": 0.9}')));
    const out = await geminiJson(env, { system: "s", user: "u", schema });
    expect(out.score).toBe(0.9);
    expect(String(fetchMock.mock.calls[1]![0])).toContain("gemini-3.1-flash-lite");
  });
});

describe("fetchCwv", () => {
  it("PSI cevabından metrikleri çıkarır", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({
      lighthouseResult: { audits: {
        "largest-contentful-paint": { numericValue: 4123 },
        "cumulative-layout-shift": { numericValue: 0.15 },
        "server-response-time": { numericValue: 820 },
        "interaction-to-next-paint": { numericValue: 240 },
      } },
    }));
    const cwv = await fetchCwv(env, "https://a.com");
    expect(cwv).toEqual({ lcpMs: 4123, cls: 0.15, ttfbMs: 820, inpMs: 240 });
  });
  it("PSI hatasında null döner (fırlatmaz)", async () => {
    fetchMock.mockResolvedValueOnce(new Response("err", { status: 500 }));
    expect(await fetchCwv(env, "https://a.com")).toBeNull();
  });
});
