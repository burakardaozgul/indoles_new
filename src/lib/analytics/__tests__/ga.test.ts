/**
 * @vitest-environment jsdom
 *
 * Bu dizin varsayılan olarak node ortamında koşuyor; `ga.ts` `window` ve
 * `dataLayer` üzerinde çalıştığı için tarayıcı ortamı gerekiyor.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { gaEvent, track } from "../ga";
import { EVENT_PARAM_NAMES } from "../events";
import { loadMetaPixel } from "../meta-pixel";

type W = {
  gtag?: unknown;
  dataLayer?: unknown[];
};

const gtag = vi.fn();

beforeEach(() => {
  gtag.mockClear();
  (window as unknown as W).gtag = gtag;
  (window as unknown as W).dataLayer = [];
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete (window as unknown as W).gtag;
  delete (window as unknown as W).dataLayer;
});

function layer(): Record<string, unknown>[] {
  return ((window as unknown as W).dataLayer ?? []) as Record<string, unknown>[];
}

describe("gaEvent", () => {
  it("olayı dataLayer'a tek kayıt olarak yazar", () => {
    gaEvent("faq_opened", { surface: "service" });
    expect(layer().filter((e) => e.event === "faq_opened")).toHaveLength(1);
  });

  it("gtag('event') ÇAĞIRMAZ — çift sayımın kök nedeni buydu", () => {
    // Regresyon kilidi (ADR-034). `gtag('event',...)` dataLayer'a bir
    // `arguments` nesnesi düşürür; GTM bunu DA olay olarak tanıdığı için
    // aynı eylem iki kez ölçülüyordu — ve ilk kopya, üst düzey anahtarlar
    // henüz güncellenmediğinden parametresiz gidiyordu (canlı doğrulama
    // 2026-09-09: bir eylem → iki `/g/collect`).
    gaEvent("faq_opened", { surface: "service" });
    expect(gtag).not.toHaveBeenCalled();
  });

  it("dataLayer'a tam olarak bir kayıt ekler", () => {
    const before = layer().length;
    gaEvent("popup_shown", { trigger_source: "initial" });
    expect(layer().length - before).toBe(1);
  });

  it("parametreleri kayda düzleştirir — GTM değişkenleri okuyabilsin", () => {
    gaEvent("tool_scan_completed", { slug: "geo", band: "orta" });
    const rec = layer().find((e) => e.event === "tool_scan_completed")!;
    expect(rec.slug).toBe("geo");
    expect(rec.band).toBe("orta");
  });

  it("dataLayer henüz yokken oluşturur", () => {
    delete (window as unknown as W).dataLayer;
    gaEvent("popup_shown");
    expect(layer().some((e) => e.event === "popup_shown")).toBe(true);
  });

  it("gtag yüklenmemişken de yazar — GTM birikmiş kayıtları işler", () => {
    // Görüntüleme olayları hydration'da, açılış script'inden ÖNCE
    // tetikleniyor. Yazılan şey artık düz bir dataLayer kaydı olduğu için
    // GTM konteyneri yüklendiğinde kuyruğu işler ve olay kaybolmaz.
    delete (window as unknown as W).gtag;
    gaEvent("pillar_viewed", { pillar: "transform", locale: "tr" });
    expect(layer().some((e) => e.event === "pillar_viewed")).toBe(true);
  });

  it("sunucu tarafında çalışmaz", () => {
    vi.stubGlobal("window", undefined);
    expect(() => gaEvent("popup_shown")).not.toThrow();
  });
});

describe("gaEvent — parametre sizintisi", () => {
  it("onceki olayin parametrelerini temizler", () => {
    // Regresyon kilidi (ADR-034). GTM'in Data Layer Variable'lari push'lar
    // arasi KALICI: canli dogrulamada yalniz {event,pillar,locale} push
    // edildigi halde GA4'e `ep.slug=cro` ve `ep.surface=service` gitti —
    // ikisi de bir onceki olaydan kalmaydi (2026-09-09).
    gaEvent("service_viewed", { slug: "cro", pillar: "growth", locale: "tr" });
    gaEvent("pillar_viewed", { pillar: "build", locale: "tr" });

    const rec = layer().find((e) => e.event === "pillar_viewed")!;
    expect(rec).toHaveProperty("slug", undefined);
    expect(rec.pillar).toBe("build");
  });

  it("taksonomideki her parametre adini sifirlar", () => {
    gaEvent("popup_shown");
    const rec = layer().find((e) => e.event === "popup_shown")!;
    for (const name of EVENT_PARAM_NAMES) {
      expect(Object.prototype.hasOwnProperty.call(rec, name)).toBe(true);
    }
  });

  it("olayin kendi parametresi sifirlamayi EZER", () => {
    gaEvent("tool_used", { slug: "diagnoo", locale: "tr" });
    const rec = layer().find((e) => e.event === "tool_used")!;
    expect(rec.slug).toBe("diagnoo");
    expect(rec.locale).toBe("tr");
  });
});

describe("track", () => {
  it("tipli olayi dataLayer'a tek kayit olarak gecirir", () => {
    track({ name: "persona_axis_clicked", properties: { axis: "industrial" } });
    const recs = layer().filter((e) => e.event === "persona_axis_clicked");
    expect(recs).toHaveLength(1);
    expect(recs[0]?.axis).toBe("industrial");
  });

  it("donusum olaylarinda Meta'ya tarayicidan Lead GONDERMEZ", () => {
    // Regresyon kilidi (ADR-036). Lead artik yalniz SUNUCUDAN gidiyor
    // (`meta-lead.ts`): kimlik anahtarlari orada var, reklam engelleyici
    // sunucu cagrisini kesemiyor, ve tek gonderici oldugu icin `event_id`
    // koordinasyonu — dolayisiyla cift sayim riski — hic olusmuyor.
    loadMetaPixel("1378220013915135");
    const fbq = (window as unknown as { fbq: { queue: unknown[][] } }).fbq;
    const before = fbq.queue.filter((c) => c[1] === "Lead").length;
    gaEvent("contact_form_submitted", { subject: "x" });
    expect(fbq.queue.filter((c) => c[1] === "Lead").length).toBe(before);
  });

  it("goruntuleme olaylarinda ViewContent gonderir", () => {
    loadMetaPixel("1378220013915135");
    const fbq = (window as unknown as { fbq: { queue: unknown[][] } }).fbq;
    track({
      name: "service_viewed",
      properties: { slug: "cro", pillar: "growth", locale: "tr" },
    });
    expect(fbq.queue.some((c) => c[0] === "track" && c[1] === "ViewContent")).toBe(true);
  });

  it("gaEvent de Meta'yi arar — tek kapi orasi", () => {
    // ADR-036'nin kok duzeltmesi: Meta cagrisi `track` icindeyken
    // `gaEvent` ile atilan uc donusum Meta'ya HIC ulasmiyordu. Cagri
    // `gaEvent`e indi; burada ViewContent uzerinden dogrulaniyor cunku
    // Lead artik tarayicidan gitmiyor.
    loadMetaPixel("1378220013915135");
    const fbq = (window as unknown as { fbq: { queue: unknown[][] } }).fbq;
    const before = fbq.queue.filter((c) => c[1] === "ViewContent").length;
    gaEvent("case_study_viewed", { slug: "s", problemType: "p", pillar: "growth" });
    expect(fbq.queue.filter((c) => c[1] === "ViewContent").length).toBe(before + 1);
  });

  it("riza yokken (pixel yuklu degil) sessizce duser", () => {
    delete (window as unknown as { fbq?: unknown }).fbq;
    expect(() =>
      track({ name: "service_viewed", properties: { slug: "cro", pillar: "growth", locale: "tr" } }),
    ).not.toThrow();
  });

});

describe("gtag henuz yuklenmemisken", () => {
  it("olayi yine de dataLayer'a yazar", () => {
    // Regresyon kilidi: acilis script'i `afterInteractive` yukleniyor;
    // TrackView olaylari o ana kadar sessizce dusuyordu (2026-09-09).
    delete (window as unknown as W).gtag;
    (window as unknown as W).dataLayer = [];
    gaEvent("case_study_viewed", { slug: "soylu-avm" });
    const rec = layer().find((e) => e.event === "case_study_viewed")!;
    expect(rec.slug).toBe("soylu-avm");
  });
});
