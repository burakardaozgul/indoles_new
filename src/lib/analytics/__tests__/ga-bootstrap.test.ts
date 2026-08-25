import { describe, it, expect, beforeEach } from "vitest";
import { buildGaBootstrap } from "../ga-bootstrap";
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
function runBootstrap(gaId: string): Command[] {
  (window as unknown as { dataLayer?: unknown[] }).dataLayer = [];
  new Function(buildGaBootstrap(gaId))();
  const layer = (window as unknown as { dataLayer: unknown[] }).dataLayer;
  return layer.map((entry) => Array.from(entry as ArrayLike<unknown>));
}

const GA_ID = "G-TEST12345";
let commands: Command[];

beforeEach(() => {
  commands = runBootstrap(GA_ID);
});

function indexOf(predicate: (c: Command) => boolean): number {
  return commands.findIndex(predicate);
}

const isConsentDefault = (c: Command) => c[0] === "consent" && c[1] === "default";
const isConfig = (c: Command) => c[0] === "config";

describe("buildGaBootstrap — komut sırası", () => {
  it("consent default komutlarını config'ten ÖNCE basar", () => {
    const lastDefault = commands.map(isConsentDefault).lastIndexOf(true);
    const configAt = indexOf(isConfig);

    expect(lastDefault).toBeGreaterThanOrEqual(0);
    expect(configAt).toBeGreaterThanOrEqual(0);
    expect(lastDefault).toBeLessThan(configAt);
  });

  it("gtag('config') hedef ölçüm kimliğiyle çağrılır", () => {
    const config = commands.find(isConfig);
    expect(config?.[1]).toBe(GA_ID);
  });

  it("gtag('js') çağrısı yapılır", () => {
    expect(commands.some((c) => c[0] === "js")).toBe(true);
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

  it("reklam sinyalleri her bölgede reddedilir — reklam ürünü kullanılmıyor", () => {
    for (const d of defaults()) {
      expect(d.ad_storage).toBe("denied");
      expect(d.ad_user_data).toBe("denied");
      expect(d.ad_personalization).toBe("denied");
    }
  });

  it("bölgesel ve genel olmak üzere tam iki varsayılan basar", () => {
    expect(defaults()).toHaveLength(2);
  });
});

describe("buildGaBootstrap — kimlik enjeksiyonu", () => {
  it("tırnak taşıyan ölçüm kimliği script'i kırmaz", () => {
    // `NEXT_PUBLIC_GA_ID` env'den gelir; bozuk bir değer sayfayı
    // çalışmaz hâle getirmemeli.
    expect(() => runBootstrap("G-X'\";alert(1)//")).not.toThrow();
  });
});
