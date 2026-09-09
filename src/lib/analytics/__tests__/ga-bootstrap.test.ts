import { describe, it, expect, beforeEach } from "vitest";
import { buildGaBootstrap, buildGtmSnippet, buildMarketingConsentEvent } from "../ga-bootstrap";
import { CONSENT_REGIONS } from "../../consent/region";

type Command = unknown[];

/**
 * Script'i gerçekten çalıştırıp `dataLayer`e düşen komutları okur.
 *
 * Dizge eşleştirmesi burada yetmez: bu testin yakalaması gereken hata
 * "consent default `config`ten sonra basıldı" ve o hata dizgede değil
 * çalışma sırasında görünür.
 *
 * `new Function` yalnız test içinde ve yalnız `buildGaBootstrap`ın kendi
 * ürettiği dizge üzerinde çalışır — dışarıdan gelen girdi değerlendirilmez.
 */
function runBootstrap(): Command[] {
  (window as unknown as { dataLayer?: unknown[] }).dataLayer = [];
  new Function(buildGaBootstrap())();
  const layer = (window as unknown as { dataLayer: unknown[] }).dataLayer;
  return layer.map((entry) => Array.from(entry as ArrayLike<unknown>));
}

let commands: Command[];

beforeEach(() => {
  commands = runBootstrap();
});

function indexOf(predicate: (c: Command) => boolean): number {
  return commands.findIndex(predicate);
}

const isConsentDefault = (c: Command) => c[0] === "consent" && c[1] === "default";
const isConfig = (c: Command) => c[0] === "config";

describe("buildGaBootstrap — komut sırası", () => {
  it("consent default komutlarını GTM yükleyicisinden ÖNCE basar", () => {
    // Sıra sözleşmesi: GTM yüklenir yüklenmez etiketlerini değerlendirir;
    // rıza komutları o ana kadar dataLayer'da olmalı, yoksa ilk değerlendirme
    // "belirtilmemiş" durumda yapılır ve reklam etiketleri rıza gelmeden bir
    // kez ateşlenebilir.
    const combined = buildGaBootstrap() + buildGtmSnippet("GTM-TEST123");
    const lastDefault = combined.lastIndexOf("'consent','default'");
    expect(lastDefault).toBeGreaterThanOrEqual(0);
    expect(lastDefault).toBeLessThan(combined.indexOf("gtm.js"));
  });

  it("gtag('config') BASMAZ — GA4'ü GTM'deki Google etiketi yapılandırır", () => {
    // Regresyon kilidi (ADR-034). Hem burada hem GTM'de yapılandırılırsa aynı
    // ölçüm kimliği iki kez kurulur ve her sayfa iki `page_view` üretir.
    expect(commands.some(isConfig)).toBe(false);
  });

  it("gtag('js') BASMAZ — config olmadan karşılığı yok", () => {
    expect(commands.some((c) => c[0] === "js")).toBe(false);
  });

  it("gtag kuyruklayıcısını ve dataLayer'ı yine de kurar", () => {
    // Rıza komutları bu kuyruğa yazılıyor; GTM geldiğinde işliyor.
    const s2 = buildGaBootstrap();
    expect(s2).toContain("window.dataLayer=window.dataLayer||[]");
    expect(s2).toContain("function gtag()");
  });
});

describe("buildGaBootstrap — bölgesel varsayılan", () => {
  function defaults() {
    return commands
      .filter(isConsentDefault)
      .map((c) => c[2] as Record<string, unknown>);
  }

  it("EEA+UK için analytics_storage'ı reddeder", () => {
    const regional = defaults().find((d) => d.region !== undefined);
    expect(regional?.analytics_storage).toBe("denied");
  });

  it("bölgesel varsayılan tam olarak CONSENT_REGIONS listesini taşır", () => {
    const regional = defaults().find((d) => d.region !== undefined);
    expect(regional?.region).toEqual([...CONSENT_REGIONS]);
  });

  it("bölge dışında analytics_storage varsayılan olarak açıktır", () => {
    const global = defaults().find((d) => d.region === undefined);
    expect(global?.analytics_storage).toBe("granted");
  });

  it("Consent Mode v2'nin dört sinyalini de her varsayılanda bildirir", () => {
    // Dördü birden bildirilmezse Google eksik sinyali "belirtilmemiş" sayar
    // ve modelleme devreye girmez.
    for (const d of defaults()) {
      expect(d).toHaveProperty("analytics_storage");
      expect(d).toHaveProperty("ad_storage");
      expect(d).toHaveProperty("ad_user_data");
      expect(d).toHaveProperty("ad_personalization");
    }
  });

  it("EEA+UK'de reklam sinyalleri de reddedilir — opt-in", () => {
    const regional = defaults().find((d) => d.region !== undefined);
    expect(regional?.ad_storage).toBe("denied");
    expect(regional?.ad_user_data).toBe("denied");
    expect(regional?.ad_personalization).toBe("denied");
  });

  it("bölge dışında reklam sinyalleri VARSAYILAN açık (ADR-035)", () => {
    // Türkiye'de şerit soru sormaz, bilgilendirir; dolayısıyla varsayılan
    // dört sinyalde de açık. Bu ADR-033'ün kararını TR için tersine çevirir.
    const global = defaults().find((d) => d.region === undefined);
    expect(global?.ad_storage).toBe("granted");
    expect(global?.ad_user_data).toBe("granted");
    expect(global?.ad_personalization).toBe("granted");
    expect(global?.analytics_storage).toBe("granted");
  });

  it("bölgesel varsayılan bölgesiz olandan ÖNCE basılır", () => {
    // Google'da daha özgül bölge kazanıyor, ama sıra da bozulmamalı:
    // bölgesiz `granted` önce gelseydi bir ara katman sırayı koruyamadığında
    // EEA ziyaretçisi onaysız ölçülebilirdi.
    const idxRegional = commands.findIndex((c) => isConsentDefault(c) && (c[2] as Record<string, unknown>).region !== undefined);
    const idxGlobal = commands.findIndex((c) => isConsentDefault(c) && (c[2] as Record<string, unknown>).region === undefined);
    expect(idxRegional).toBeGreaterThanOrEqual(0);
    expect(idxGlobal).toBeGreaterThan(idxRegional);
  });

  it("bölgesel ve genel olmak üzere tam iki varsayılan basar", () => {
    expect(defaults()).toHaveLength(2);
  });
});

describe("buildGtmSnippet", () => {
  it("konteyner kimliğini yükleyiciye geçirir", () => {
    expect(buildGtmSnippet("GTM-TFKLN9V")).toContain('"GTM-TFKLN9V"');
  });

  it("gtm.js kaynağını dataLayer üzerinden yükler", () => {
    const out = buildGtmSnippet("GTM-TEST123");
    expect(out).toContain("googletagmanager.com/gtm.js");
    expect(out).toContain("dataLayer");
  });

  it("kimliği kaçırır — tırnak taşıyan değer script'i kırmaz", () => {
    expect(buildGtmSnippet('GTM-"X')).toContain('"GTM-\\"X"');
  });

  it("consent varsayılanlarından SONRA çalışacak biçimde birleştirilebilir", () => {
    // Sıra sözleşmesi: GTM yüklenir yüklenmez etiketlerini değerlendirir,
    // consent komutları o ana kadar dataLayer'da olmalı. İki parça tek
    // dizgede birleştirildiği için sıra dilin çalışma sırasına bağlıdır.
    const combined = buildGaBootstrap() + buildGtmSnippet("GTM-TEST123");
    expect(combined.indexOf("consent")).toBeLessThan(combined.indexOf("gtm.js"));
  });
});

describe("buildGaBootstrap — kayitli onayin yeniden bildirilmesi", () => {
  const out = () => buildGaBootstrap();

  it("cerezden okunan karari update olarak bildirir", () => {
    // Regresyon kilidi: `update` yalnizca serit tiklamasinda gonderiliyordu,
    // bu yuzden onay vermis ziyaretcide ikinci sayfadan itibaren tum
    // sinyaller `denied` varsayilanina dusuyordu (canli dogrulama 2026-09-08).
    expect(out()).toContain("indoles_consent");
    expect(out()).toContain("'consent','update'");
  });

  it("onay tekrari varsayilanlardan SONRA gelir", () => {
    // `update` varsayilandan once gelirse Google onu yok sayar.
    const s = out();
    expect(s.indexOf("'consent','default'")).toBeLessThan(s.indexOf("'consent','update'"));
  });

  it("onay tekrari GTM yukleyicisinden ONCE gelir", () => {
    // GTM konteyneri etiketlerini degerlendirmeye basladiginda guncel riza
    // durumu yerinde olmali.
    const s = buildGaBootstrap() + buildGtmSnippet("GTM-TEST123");
    expect(s.indexOf("'consent','update'")).toBeLessThan(s.indexOf("gtm.js"));
  });

  it("ADR-033 oncesi tek kelimelik cerezi de tanir", () => {
    expect(out()).toContain("granted");
    expect(out()).toContain("denied");
  });

  it("uc reklam sinyalini tek karardan turetir", () => {
    const s = out();
    for (const k of ["ad_storage", "ad_user_data", "ad_personalization"]) {
      expect(s).toContain(k);
    }
  });
});

describe("buildMarketingConsentEvent", () => {
  it("riza olayini basar", () => {
    expect(buildMarketingConsentEvent()).toContain("consent_marketing_granted");
  });

  it("bootstrap'ta DEGIL — GTM yukleyicisinden sonra basilmali", () => {
    // Konteyner yuklenmemisken basilan olay, tetikleyici hic kurulmadigi
    // icin kaybolur (canli dogrulama 2026-09-08).
    expect(buildGaBootstrap()).not.toContain("consent_marketing_granted");
  });

  it("dogru sira: consent update -> gtm.js -> riza olayi", () => {
    const s =
      buildGaBootstrap() + buildGtmSnippet("GTM-TEST123") + buildMarketingConsentEvent();
    expect(s.indexOf("'consent','update'")).toBeLessThan(s.indexOf("gtm.js"));
    expect(s.indexOf("gtm.js")).toBeLessThan(s.indexOf("consent_marketing_granted"));
  });

  it("pazarlama reddedilmisse olay basmaz — ikinci hane kontrol edilir", () => {
    expect(buildMarketingConsentEvent()).toContain("charAt(1)!=='g'");
  });
});

