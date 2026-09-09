/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { loadMetaPixel, trackMetaStandardEvent } from "../meta-pixel";

type W = { fbq?: unknown; _fbq?: unknown };

function reset() {
  delete (window as unknown as W).fbq;
  delete (window as unknown as W)._fbq;
  document.head.querySelectorAll('script[src*="fbevents"]').forEach((s) => s.remove());
}

beforeEach(reset);
afterEach(() => {
  vi.unstubAllGlobals();
  reset();
});

function scripts() {
  return document.head.querySelectorAll('script[src*="fbevents.js"]');
}

describe("loadMetaPixel", () => {
  it("fbq'yu tanimlar ve script'i ekler", () => {
    loadMetaPixel("1378220013915135");
    expect(typeof (window as unknown as W).fbq).toBe("function");
    expect(scripts()).toHaveLength(1);
  });

  it("init ve PageView cagrilarini kuyruga alir", () => {
    // Script henuz yuklenmedigi icin cagrilar kuyrukta bekler; gercek
    // uygulama yuklendiginde kuyrugu bosaltir. Meta'nin resmi kalibi.
    loadMetaPixel("1378220013915135");
    const fbq = (window as unknown as { fbq: { queue: unknown[][] } }).fbq;
    const flat = fbq.queue.map((c) => c[0]);
    expect(flat).toContain("init");
    expect(flat).toContain("track");
  });

  it("iki kez cagrilinca ikinci kez hicbir sey yapmaz", () => {
    // Sayfa yuklemesi ve serit tiklamasi ayni sayfada ust uste gelebilir;
    // ikinci yukleme PageView'i cift sayardi.
    loadMetaPixel("1378220013915135");
    loadMetaPixel("1378220013915135");
    expect(scripts()).toHaveLength(1);
  });

  it("pixel kimligi bossa hicbir sey yapmaz", () => {
    // Env tanimsizken (lokal, preview) sessizce devre disi kalir.
    loadMetaPixel("");
    expect((window as unknown as W).fbq).toBeUndefined();
    expect(scripts()).toHaveLength(0);
  });

  it("sunucu tarafinda calismaz", () => {
    vi.stubGlobal("window", undefined);
    expect(() => loadMetaPixel("1378220013915135")).not.toThrow();
  });
});

describe("trackMetaStandardEvent", () => {
  it("pixel yukluyken olayi gonderir", () => {
    loadMetaPixel("1378220013915135");
    trackMetaStandardEvent("Lead");
    const fbq = (window as unknown as { fbq: { queue: unknown[][] } }).fbq;
    expect(fbq.queue.some((c) => c[0] === "track" && c[1] === "Lead")).toBe(true);
  });

  it("parametreleri birlikte gonderir", () => {
    loadMetaPixel("1378220013915135");
    trackMetaStandardEvent("ViewContent", { content_type: "service", content_ids: ["seo"] });
    const fbq = (window as unknown as { fbq: { queue: unknown[][] } }).fbq;
    const call = fbq.queue.find((c) => c[1] === "ViewContent");
    expect(call?.[2]).toEqual({ content_type: "service", content_ids: ["seo"] });
  });

  it("pixel yuklu degilken sessizce duser — riza yoksa durum budur", () => {
    expect(() => trackMetaStandardEvent("Lead")).not.toThrow();
    expect((window as unknown as W).fbq).toBeUndefined();
  });

});

describe("bekleyen olay kuyrugu", () => {
  it("pixel hazir degilken olayi kuyruga alir, riza cerezden gelince gonderir", () => {
    // Yaris durumu: ConsentBanner Pixel'i bir useEffect'te yukluyor,
    // TrackView olayi baska bir useEffect'te basiyor; React sirayi
    // garanti etmiyor. Canli dogrulamada ViewContent boyle kaybolmustu.
    trackMetaStandardEvent("ViewContent", { content_type: "service" });
    expect((window as unknown as W).fbq).toBeUndefined();

    loadMetaPixel("1378220013915135", { flushPending: true });
    const fbq = (window as unknown as { fbq: { queue: unknown[][] } }).fbq;
    expect(fbq.queue.some((c) => c[1] === "ViewContent")).toBe(true);
  });

  it("yeni riza verildiginde gecmis olaylari GONDERMEZ", () => {
    // O olaylar riza verilmeden once gerceklesti; geriye donuk
    // gonderilmeleri rizanin anlamini bozardi.
    trackMetaStandardEvent("ViewContent", { content_type: "service" });
    loadMetaPixel("1378220013915135");
    const fbq = (window as unknown as { fbq: { queue: unknown[][] } }).fbq;
    expect(fbq.queue.some((c) => c[1] === "ViewContent")).toBe(false);
    expect(fbq.queue.some((c) => c[1] === "PageView")).toBe(true);
  });

  it("kuyruk sinirsiz buyumez", () => {
    for (let i = 0; i < 60; i++) trackMetaStandardEvent("ViewContent");
    loadMetaPixel("1378220013915135", { flushPending: true });
    const fbq = (window as unknown as { fbq: { queue: unknown[][] } }).fbq;
    expect(fbq.queue.filter((c) => c[1] === "ViewContent").length).toBeLessThanOrEqual(20);
  });
});
