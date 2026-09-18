import { describe, expect, it } from "vitest";

import {
  a3Adaylari,
  eskiUrlPayi,
  sorguKumeleri,
  ulkeKumeleri,
} from "./gsc-pull.mjs";

/**
 * Küme kurallarının regresyon testi.
 *
 * Kurallar `docs/strateji/Keyword-Onceliklendirme-2026-08-27.md` §4'ten gelir;
 * tablodan türetilmeyen dört kural (G3'e `ai optimizasyon`, G2'nin G3 ile
 * kesişmemesi, G2'nin `arama motoru` sorgularını saymaması, G4'e
 * `business building`) 18 Eylül'de elle yapılan hesabı birebir yeniden
 * üretmek için eklendi. Bu test o kuralları sabitler — biri sessizce
 * değişirse haftalık log önceki kayıtlarla kıyaslanamaz hale gelir.
 */

type Satir = Record<string, string>;

type KumeOzeti = {
  kayit: number;
  gosterim: number;
  tiklama: number;
  ctr: number;
  pozisyon: number | null;
};

/**
 * `sorguKumeleri` sözlük döner; `noUncheckedIndexedAccess` altında her erişim
 * `undefined` olabilir. Eksik anahtar testi patlatsın diye burada açılır.
 */
function al(kumeler: Record<string, KumeOzeti>, key: string): KumeOzeti {
  const o = kumeler[key];
  if (!o) throw new Error(`küme bulunamadı: ${key}`);
  return o;
}

function sorgu(
  query: string,
  impressions: number,
  clicks = 0,
  position = 10
): Satir {
  return {
    query,
    clicks: String(clicks),
    impressions: String(impressions),
    ctr: `${((clicks / impressions) * 100).toFixed(2)}%`,
    position: position.toFixed(2),
  };
}

function sayfa(
  page: string,
  impressions: number,
  clicks = 0,
  position = 10
): Satir {
  return {
    page,
    clicks: String(clicks),
    impressions: String(impressions),
    ctr: `${((clicks / impressions) * 100).toFixed(2)}%`,
    position: position.toFixed(2),
  };
}

describe("sorguKumeleri", () => {
  it("G3 ile kesişen sorguyu G2'de tekrar saymaz", () => {
    const k = sorguKumeleri([sorgu("yapay zeka arama optimizasyonu", 88)]);
    expect(al(k, "G3").gosterim).toBe(88);
    expect(al(k, "G2").gosterim).toBe(0);
  });

  it("`ai optimizasyonu` sorgusunu G3'e yazar", () => {
    const k = sorguKumeleri([sorgu("ai optimizasyonu", 4)]);
    expect(al(k, "G3").kayit).toBe(1);
    expect(al(k, "G2").kayit).toBe(0);
  });

  it("`arama motoru` geçen sorguyu G2'ye saymaz", () => {
    const k = sorguKumeleri([
      sorgu("yapay zeka arama motoru optimizasyonu", 4),
      sorgu("yapay zeka arama motoru yatırımlarının geri dönüşü", 9),
    ]);
    expect(al(k, "G2").gosterim).toBe(0);
    expect(al(k, "G3").gosterim).toBe(0);
  });

  it("`ai dönüşümü` hem G1 hem G2'de sayılır — kesişim bilinçli", () => {
    const k = sorguKumeleri([sorgu("ai dönüşümü", 10)]);
    expect(al(k, "G1").gosterim).toBe(10);
    expect(al(k, "G2").gosterim).toBe(10);
  });

  it("G4 `business building` varyantlarını yakalar, `building business`i almaz", () => {
    const k = sorguKumeleri([
      sorgu("business building", 17),
      sorgu("what is business building", 1),
      sorgu("building business meaning", 2),
      sorgu("studio meaning in business", 6),
    ]);
    expect(al(k, "G4").kayit).toBe(2);
    expect(al(k, "G4").gosterim).toBe(18);
  });

  it("pozisyonu gösterimle ağırlıklandırır", () => {
    const k = sorguKumeleri([
      sorgu("cro ajansı", 90, 0, 10),
      sorgu("cro nedir", 10, 0, 20),
    ]);
    expect(al(k, "G1").pozisyon).toBeCloseTo(11, 6);
  });

  it("K-4 kariyer niyetli sorguları ayrı satırda tutar", () => {
    const k = sorguKumeleri([sorgu("iş zekası", 5), sorgu("cro nedir", 7)]);
    expect(al(k, "K4").gosterim).toBe(5);
    expect(al(k, "G1").gosterim).toBe(7);
  });
});

describe("ulkeKumeleri", () => {
  it("TR'yi G5'ten ayırır", () => {
    const k = ulkeKumeleri([
      {
        country: "tur",
        clicks: "34",
        impressions: "1352",
        ctr: "2.51%",
        position: "13.75",
      },
      {
        country: "usa",
        clicks: "2",
        impressions: "166",
        ctr: "1.20%",
        position: "20.00",
      },
      {
        country: "gbr",
        clicks: "1",
        impressions: "78",
        ctr: "1.28%",
        position: "18.00",
      },
    ]);
    expect(al(k, "TR").gosterim).toBe(1352);
    expect(al(k, "G5").gosterim).toBe(244);
    expect(al(k, "G5").kayit).toBe(2);
  });
});

describe("eskiUrlPayi", () => {
  it("locale köklerini (/tr, /en) yeni sayar, ana sayfayı eski sayar", () => {
    const r = eskiUrlPayi([
      sayfa("https://www.indoles.com.tr/tr", 19),
      sayfa("https://www.indoles.com.tr/en", 6),
      sayfa("https://www.indoles.com.tr/tr/yazilar/cro-nedir", 62),
      sayfa("https://www.indoles.com.tr/", 38),
      sayfa("https://www.indoles.com.tr/cro-donusum-orani-optimizasyonu/", 18),
    ]);
    expect(r.toplam).toBe(143);
    expect(r.eski).toBe(56);
    expect(r.sayfa).toBe(2);
    expect(r.pay).toBeCloseTo((56 / 143) * 100, 6);
  });
});

describe("a3Adaylari", () => {
  it("poz<10 & CTR<%1 & gösterim>=20 eşiğini uygular", () => {
    const r = a3Adaylari([
      sayfa("https://www.indoles.com.tr/tr/yazilar/a", 110, 0, 7.23),
      sayfa("https://www.indoles.com.tr/tr/yazilar/b", 19, 0, 5), // gösterim düşük
      sayfa("https://www.indoles.com.tr/tr/yazilar/c", 50, 0, 12), // pozisyon zayıf
      sayfa("https://www.indoles.com.tr/tr/yazilar/d", 100, 5, 4), // CTR yeterli
    ]);
    expect(r.map((s: { path: string }) => s.path)).toEqual(["/tr/yazilar/a"]);
  });
});
