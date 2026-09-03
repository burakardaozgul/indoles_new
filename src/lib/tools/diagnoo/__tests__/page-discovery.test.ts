import { describe, it, expect, vi, beforeEach } from "vitest";
import { discoverAndScrapePages } from "../page-discovery";

vi.mock("../services/firecrawl", async (importActual) => {
  const actual = await importActual<typeof import("../services/firecrawl")>();
  return { ...actual, scrapePage: vi.fn() };
});
vi.mock("../services/gemini", () => ({ geminiJson: vi.fn() }));

import { scrapePage } from "../services/firecrawl";
import { geminiJson } from "../services/gemini";

const env = { GEMINI_API_KEY: "g", FIRECRAWL_API_KEY: "f" };
const page = (over: Record<string, unknown> = {}) => ({
  markdown: "# Başlık\nMetin", rawHtml: "<html></html>", links: [],
  screenshotUrl: "https://cdn/ss.png", title: "T", description: "D", ...over,
});

beforeEach(() => { vi.mocked(scrapePage).mockReset(); vi.mocked(geminiJson).mockReset(); });

describe("discoverAndScrapePages", () => {
  it("anasayfa + sınıflandırılan 6 sayfayı scrape eder", async () => {
    vi.mocked(scrapePage).mockResolvedValue(page({
      links: ["https://a.com/k1", "https://a.com/k2", "https://a.com/p1", "https://a.com/p2", "https://a.com/p3", "https://a.com/sepet"],
    }) as never);
    vi.mocked(geminiJson).mockResolvedValue({
      category: ["https://a.com/k1", "https://a.com/k2"],
      product: ["https://a.com/p1", "https://a.com/p2", "https://a.com/p3"],
      checkout: "https://a.com/sepet",
    } as never);
    const pages = await discoverAndScrapePages(env, "https://a.com");
    expect(pages).toHaveLength(7);
    expect(pages.filter((p) => p.pageType === "product")).toHaveLength(3);
    expect(pages[0]!.pageType).toBe("homepage");
  });

  it("checkout yoksa 6 sayfayla devam eder", async () => {
    vi.mocked(scrapePage).mockResolvedValue(page({ links: ["https://a.com/k1"] }) as never);
    vi.mocked(geminiJson).mockResolvedValue({
      category: ["https://a.com/k1", "https://a.com/k2"],
      product: ["https://a.com/p1", "https://a.com/p2", "https://a.com/p3"],
      checkout: null,
    } as never);
    const pages = await discoverAndScrapePages(env, "https://a.com");
    expect(pages.filter((p) => p.pageType === "checkout")).toHaveLength(0);
  });

  it("tek tek sayfa scrape hataları yutulur (kısmi sonuç)", async () => {
    const { ScrapeError } = await vi.importActual<typeof import("../services/firecrawl")>("../services/firecrawl");
    vi.mocked(scrapePage)
      .mockResolvedValueOnce(page({ links: ["https://a.com/k1"] }) as never)  // homepage
      .mockRejectedValueOnce(new ScrapeError("https://a.com/k1", 500))        // k1 düşer
      .mockResolvedValue(page() as never);                                     // kalanlar
    vi.mocked(geminiJson).mockResolvedValue({
      category: ["https://a.com/k1", "https://a.com/k2"],
      product: ["https://a.com/p1"], checkout: null,
    } as never);
    const pages = await discoverAndScrapePages(env, "https://a.com");
    expect(pages.some((p) => p.url === "https://a.com/k1")).toBe(false);
    expect(pages.length).toBeGreaterThanOrEqual(2);
  });

  it("farklı domaindeki URL'ler scrapePage'e geçilmez, tekilleştirme yapılır", async () => {
    vi.mocked(scrapePage).mockResolvedValue(page({ links: ["https://a.com/k1"] }) as never);
    vi.mocked(geminiJson).mockResolvedValue({
      category: ["https://a.com/k1", "https://baska.com/p9", "https://a.com/k1"],
      product: ["https://a.com/p1"],
      checkout: null,
    } as never);
    const pages = await discoverAndScrapePages(env, "https://a.com");
    const scrapedUrls = vi.mocked(scrapePage).mock.calls.map((c) => c[1]);
    expect(scrapedUrls).not.toContain("https://baska.com/p9");
    expect(scrapedUrls.filter((u) => u === "https://a.com/k1")).toHaveLength(1);
  });

  it("geminiJson çağrısında 'aynı domaindeki' metni varır", async () => {
    vi.mocked(scrapePage).mockResolvedValue(page() as never);
    vi.mocked(geminiJson).mockResolvedValue({
      category: [], product: [], checkout: null,
    } as never);
    await discoverAndScrapePages(env, "https://a.com");
    const userPrompt = vi.mocked(geminiJson).mock.calls[0]![1].user;
    expect(userPrompt).toContain("aynı domaindeki");
  });
});
