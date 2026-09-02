import { describe, it, expect, vi, beforeEach } from "vitest";
import { analyzeSemantic } from "../agents/semantic";
import { analyzeVision } from "../agents/vision";
import { analyzeFunnel } from "../agents/funnel";
import type { ScrapedPage } from "../schema";

vi.mock("../services/gemini", () => ({ geminiJson: vi.fn() }));
vi.mock("../services/psi", () => ({ fetchCwv: vi.fn() }));
import { geminiJson } from "../services/gemini";
import { fetchCwv } from "../services/psi";

const env = { GEMINI_API_KEY: "g", FIRECRAWL_API_KEY: "f" };
const mkPage = (over: Partial<ScrapedPage>): ScrapedPage => ({
  url: "https://a.com", pageType: "homepage", title: "T", metaDescription: "D",
  h1: "H", headings: ["H"], bodyText: "içerik", ...over,
});

beforeEach(() => { vi.mocked(geminiJson).mockReset(); vi.mocked(fetchCwv).mockReset(); });

describe("analyzeSemantic", () => {
  it("Gemini çıktısını SemanticResult olarak döndürür ve prompt tüm sayfa tiplerini içerir", async () => {
    vi.mocked(geminiJson).mockResolvedValue({
      uvpDetected: "u", toneOfVoice: "t", messageCohesionScore: 0.5,
      alignmentIssues: [], seoKeywordIssues: [],
    } as never);
    const out = await analyzeSemantic(env, [mkPage({}), mkPage({ pageType: "product", url: "https://a.com/p" })], "tr");
    expect(out.messageCohesionScore).toBe(0.5);
    const call = vi.mocked(geminiJson).mock.calls[0]![1];
    expect(call.user).toContain("homepage");
    expect(call.user).toContain("product");
  });
});

describe("analyzeVision", () => {
  it("screenshot'ları base64 olarak Gemini'ye iletir", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(new Uint8Array([1, 2, 3]))));
    vi.mocked(geminiJson).mockResolvedValue({
      cognitiveLoadScore: 0.3, ctaVisibilityScore: 0.8,
      mobileIssues: [], desktopIssues: [], aboveFoldAssessment: "ok",
    } as never);
    const out = await analyzeVision(env, [mkPage({ screenshotUrl: "https://cdn/ss.png" })], "tr");
    expect(out.ctaVisibilityScore).toBe(0.8);
    expect(vi.mocked(geminiJson).mock.calls[0]![1].imagesBase64?.length).toBe(1);
    vi.unstubAllGlobals();
  });
  it("content-length 1,5 MB üstündeyse görsel indirilmeden atlanır", async () => {
    // Sınırsız görsel, adım bütçesini (bellek + CPU) aşabilir; metin yolu
    // zaten var, atlanan görsel analizi durdurmaz (I5).
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(new Uint8Array([1, 2, 3]), { headers: { "content-length": "2000000" } }),
    ));
    vi.mocked(geminiJson).mockResolvedValue({
      cognitiveLoadScore: 0.5, ctaVisibilityScore: 0.5,
      mobileIssues: [], desktopIssues: [], aboveFoldAssessment: "metin bazlı",
    } as never);
    await analyzeVision(env, [mkPage({ screenshotUrl: "https://cdn/buyuk.png" })], "tr");
    expect(vi.mocked(geminiJson).mock.calls[0]![1].imagesBase64).toEqual([]);
    vi.unstubAllGlobals();
  });

  it("content-length yoksa gövde boyutu ölçülür ve büyük görsel atlanır", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(new Uint8Array(1_600_000))));
    vi.mocked(geminiJson).mockResolvedValue({
      cognitiveLoadScore: 0.5, ctaVisibilityScore: 0.5,
      mobileIssues: [], desktopIssues: [], aboveFoldAssessment: "metin bazlı",
    } as never);
    await analyzeVision(env, [mkPage({ screenshotUrl: "https://cdn/buyuk.png" })], "tr");
    expect(vi.mocked(geminiJson).mock.calls[0]![1].imagesBase64).toEqual([]);
    vi.unstubAllGlobals();
  });

  it("sınırı aşan akış okunmayı durdurur ve istek iptal edilir", async () => {
    // Sınırın AKIŞTA uygulandığının kanıtı: gövde sonsuza kadar 1 MB'lık
    // parça üretiyor. Ölçüm `arrayBuffer()` sonrasında yapılsaydı bu test
    // ya sonsuza kadar koşar ya belleği doldururdu.
    let pulls = 0;
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulls += 1;
        controller.enqueue(new Uint8Array(1_000_000));
      },
    });
    let signal: AbortSignal | undefined;
    vi.stubGlobal("fetch", vi.fn((_url: string, init?: { signal?: AbortSignal }) => {
      signal = init?.signal;
      return Promise.resolve({ ok: true, headers: new Headers(), body: stream });
    }));
    vi.mocked(geminiJson).mockResolvedValue({
      cognitiveLoadScore: 0.5, ctaVisibilityScore: 0.5,
      mobileIssues: [], desktopIssues: [], aboveFoldAssessment: "metin bazlı",
    } as never);

    await analyzeVision(env, [mkPage({ screenshotUrl: "https://cdn/sonsuz.png" })], "tr");

    expect(vi.mocked(geminiJson).mock.calls[0]![1].imagesBase64).toEqual([]);
    // 1,5 MB sınırı ikinci parçada aşılır; okuma orada durur.
    expect(pulls).toBeLessThanOrEqual(3);
    expect(signal?.aborted).toBe(true);
    vi.unstubAllGlobals();
  });

  it("sınırın altındaki görsel geçer", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(
      new Response(new Uint8Array(1000), { headers: { "content-length": "1000" } }),
    ));
    vi.mocked(geminiJson).mockResolvedValue({
      cognitiveLoadScore: 0.3, ctaVisibilityScore: 0.8,
      mobileIssues: [], desktopIssues: [], aboveFoldAssessment: "ok",
    } as never);
    await analyzeVision(env, [mkPage({ screenshotUrl: "https://cdn/kucuk.png" })], "tr");
    expect(vi.mocked(geminiJson).mock.calls[0]![1].imagesBase64?.length).toBe(1);
    vi.unstubAllGlobals();
  });

  it("screenshot yoksa görselsiz devam eder", async () => {
    vi.mocked(geminiJson).mockResolvedValue({
      cognitiveLoadScore: 0.5, ctaVisibilityScore: 0.5,
      mobileIssues: [], desktopIssues: [], aboveFoldAssessment: "metin bazlı",
    } as never);
    const out = await analyzeVision(env, [mkPage({})], "tr");
    expect(out.aboveFoldAssessment).toBe("metin bazlı");
  });
});

describe("analyzeFunnel", () => {
  it("CWV toplar, pixel'leri rawHtml'den tespit eder, checkout sürtünmesini LLM'e sorar", async () => {
    vi.mocked(fetchCwv).mockResolvedValue({ lcpMs: 4000, cls: 0.1, ttfbMs: 800, inpMs: 200 });
    vi.mocked(geminiJson).mockResolvedValue({ checkoutFrictionPoints: ["Zorunlu üyelik"] } as never);
    const pages = [
      mkPage({ rawHtml: '<script src="https://www.googletagmanager.com/gtag/js"></script>' }),
      mkPage({ pageType: "checkout", url: "https://a.com/c", rawHtml: "<html></html>", bodyText: "checkout" }),
    ];
    const out = await analyzeFunnel(env, pages, "tr");
    expect(out.avgLcpMs).toBe(4000);
    expect(out.pixelCoverage.gtag).toBe(true);
    expect(out.pixelCoverage.meta_pixel).toBe(false);
    expect(out.checkoutFrictionPoints).toContain("Zorunlu üyelik");
    expect(out.missingTrackingEvents).toContain("meta_pixel");
  });
  it("checkout sürtünme prompt'u rapor diliyle yazılır", async () => {
    // Diğer iki ajan locale alıyordu, funnel almıyordu: EN raporda checkout
    // bulguları Türkçe dönüyordu (Görev 9 eksiği).
    vi.mocked(fetchCwv).mockResolvedValue(null);
    vi.mocked(geminiJson).mockResolvedValue({ checkoutFrictionPoints: [] } as never);
    const pages = [mkPage({ pageType: "checkout", url: "https://a.com/c", bodyText: "checkout" })];

    await analyzeFunnel(env, pages, "en");
    expect(vi.mocked(geminiJson).mock.calls[0]![1].system).toContain("İngilizce");

    vi.mocked(geminiJson).mockClear();
    await analyzeFunnel(env, pages, "tr");
    expect(vi.mocked(geminiJson).mock.calls[0]![1].system).toContain("Türkçe");
  });

  it("tüm PSI çağrıları null ise boş pageSpeeds ve avgLcpMs 0", async () => {
    vi.mocked(fetchCwv).mockResolvedValue(null);
    const out = await analyzeFunnel(env, [mkPage({ rawHtml: "<html></html>" })], "tr");
    expect(out.pageSpeeds).toHaveLength(0);
    expect(out.avgLcpMs).toBe(0);
  });
});
