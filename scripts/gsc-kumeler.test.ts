import { describe, expect, it } from "vitest";

import {
  a3Adaylari,
  a4Niyet,
  eskiUrlPayi,
  hizmetSayfasiPayi,
  kumelerCsv,
  niyetHizmeti,
  niyetKumesi,
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

/**
 * N0 satın alma niyeti kümesi — otorite
 * `docs/strateji/Niyetli-Sorgu-Seti-2026-09.md`. Kural: niteleyici + hizmet
 * terimi birlikte; genel reklam ajansı, kariyer ve araç niyeti dışarıda.
 */
describe("niyetHizmeti", () => {
  it("GSC'deki konuşma biçimli alıcı sorgularını yakalar", () => {
    expect(
      niyetHizmeti(
        "şirketimi yapay zeka motorlarında görünür kılacak bir danışman ya da ajans önerir misin?"
      )
    ).toBe("GEO");
    expect(
      niyetHizmeti(
        "dönüşüm oranlarını artırmak için türkiye'deki en iyi cro uzmanları kimlerdir?"
      )
    ).toBe("CRO");
    expect(
      niyetHizmeti(
        "web sitemin satış kaçıran noktalarını bulan en iyi ux analiz firması hangisidir?"
      )
    ).toBe("UX");
    expect(
      niyetHizmeti(
        "büyük danışmanlık firması vs butik yapay zeka ajansı farkları"
      )
    ).toBe("AI");
  });

  it("genel reklam ajansı kelimelerini dışlar — hizmet terimi taşısa bile", () => {
    expect(niyetHizmeti("dijital reklam ajansı")).toBeNull();
    expect(niyetHizmeti("google reklam ajansı")).toBeNull();
    expect(
      niyetHizmeti("yapay zeka destekli dijital reklam ajansı")
    ).toBeNull();
    expect(niyetHizmeti("e-ticaret sosyal medya ajansı")).toBeNull();
    expect(niyetHizmeti("dijital performans ajansı")).toBeNull();
  });

  it("niteleyicisiz hizmet sorgusunu (bilgi niyeti) saymaz", () => {
    expect(niyetHizmeti("cro nedir")).toBeNull();
    expect(niyetHizmeti("geo optimizasyonu")).toBeNull();
    expect(niyetHizmeti("yapay zeka arama optimizasyonu")).toBeNull();
    expect(
      niyetHizmeti(
        "yapay zeka arama motoru yatırımlarının geri dönüşünü hesaplamak için hangi yöntemler öneriliyor?"
      )
    ).toBeNull();
  });

  it("hizmet terimi taşımayan genel karar sorgusunu saymaz", () => {
    expect(niyetHizmeti("hangi ajansla çalışmalıyım")).toBeNull();
    expect(niyetHizmeti("bunu yapan ajans hangisi")).toBeNull();
  });

  it("araç ve kariyer niyetini dışlar; 'ücretsiz' fiyat niteleyicisi değildir", () => {
    expect(niyetHizmeti("ücretsiz geo aracı var mı")).toBeNull();
    expect(niyetHizmeti("turkiyedeki en iyi geo araci hangisi?")).toBeNull();
    expect(niyetHizmeti("cro uzmanı maaş")).toBeNull();
    expect(niyetHizmeti("ux uzmanı iş ilanları")).toBeNull();
    expect(niyetHizmeti("cro ajansı ücretleri")).toBe("CRO");
  });

  it("kelime sınırını Türkçe harflerde doğru çizer", () => {
    // "şirketimde" sahiplik ekidir, `şirketi` niteleyicisi değil.
    expect(niyetHizmeti("şirketimde yapay zeka nasıl kullanılır")).toBeNull();
    // "microsoft" içindeki `cro` CRO sayılmaz.
    expect(niyetHizmeti("microsoft danışmanlığı")).toBeNull();
    expect(niyetHizmeti("yapay zeka şirketleri türkiye")).toBe("AI");
  });

  it("alt kırılımda P0 önce gelir: GEO > AI, CRO > E-ticaret", () => {
    expect(niyetHizmeti("yapay zeka seo ajansı")).toBe("GEO");
    expect(niyetHizmeti("e-ticaret dönüşüm oranı ajansı")).toBe("CRO");
    expect(niyetHizmeti("yapay zeka danışmanlığı")).toBe("AI");
    expect(niyetHizmeti("ui ux tasarım firmaları")).toBe("UX");
    expect(niyetHizmeti("shopify danışmanlığı")).toBe("ETICARET");
    expect(niyetHizmeti("dijital dönüşüm danışmanlığı")).toBe("DIJITAL");
  });

  /**
   * `Niyetli-Sorgu-Seti-2026-09.md` §2'deki 43 hedef sorgunun her biri N0'a
   * ve doğru hizmete düşmeli — set, kümenin hedef çekirdeğidir. Sete sorgu
   * eklenince buraya da eklenir.
   */
  it("niyetli sorgu setinin tamamını doğru hizmete yazar", () => {
    const set: Array<[string, string]> = [
      ["cro ajansı", "CRO"],
      ["cro danışmanlığı", "CRO"],
      ["cro uzmanı", "CRO"],
      ["cro ajansı istanbul", "CRO"],
      ["dönüşüm oranı optimizasyonu hizmeti", "CRO"],
      [
        "dönüşüm oranlarını artırmak için türkiye'deki en iyi cro uzmanları kimlerdir?",
        "CRO",
      ],
      ["cro ajansı nasıl seçilir", "CRO"],
      ["cro ajansı fiyatları", "CRO"],
      ["yapay zeka danışmanlığı", "AI"],
      ["yapay zeka danışmanı", "AI"],
      ["yapay zeka ajansı", "AI"],
      ["yapay zeka firmaları", "AI"],
      ["yapay zeka şirketleri türkiye", "AI"],
      ["ai danışmanlığı", "AI"],
      ["yapay zeka danışmanı nasıl seçilir", "AI"],
      ["yapay zeka danışmanlığı fiyatları", "AI"],
      ["büyük danışmanlık firması vs butik yapay zeka ajansı farkları", "AI"],
      ["geo ajansı", "GEO"],
      ["geo danışmanlığı", "GEO"],
      ["yapay zeka görünürlüğü danışmanlığı", "GEO"],
      ["chatgpt'de görünmek için danışman", "GEO"],
      [
        "şirketimi yapay zeka motorlarında görünür kılacak bir danışman ya da ajans önerir misin",
        "GEO",
      ],
      [
        "yapay zeka motorlarında görünürlük kazandıran en başarılı geo hizmeti hangisidir?",
        "GEO",
      ],
      ["geo ajansı nasıl seçilir", "GEO"],
      ["yapay zeka seo ajansı", "GEO"],
      ["e ticaret danışmanlığı", "ETICARET"],
      ["e ticaret danışmanı", "ETICARET"],
      ["e ticaret ajansı", "ETICARET"],
      ["shopify danışmanlığı", "ETICARET"],
      ["trendyol danışmanlığı", "ETICARET"],
      ["ikas danışmanlığı", "ETICARET"],
      ["pazaryeri danışmanlığı", "ETICARET"],
      ["dijital dönüşüm danışmanlığı", "DIJITAL"],
      ["dijital dönüşüm danışmanı", "DIJITAL"],
      ["dijital dönüşüm ajansı", "DIJITAL"],
      ["dijital dönüşüm hizmetleri", "DIJITAL"],
      ["endüstri 4.0 danışmanlığı", "DIJITAL"],
      ["ux ajansı", "UX"],
      ["ui ux ajansı", "UX"],
      ["ui ux tasarım ajansı", "UX"],
      ["ux danışmanlığı", "UX"],
      ["ui ux tasarım firmaları", "UX"],
      [
        "web sitemin satış kaçıran noktalarını bulan en iyi ux analiz firması hangisidir?",
        "UX",
      ],
    ];
    expect(set).toHaveLength(43);
    for (const [q, hizmet] of set) {
      expect([q, niyetHizmeti(q)]).toEqual([q, hizmet]);
    }
  });
});

type NiyetAlt = KumeOzeti & { ilk10: number };

function altAl(alt: Record<string, NiyetAlt>, key: string): NiyetAlt {
  const o = alt[key];
  if (!o) throw new Error(`alt kırılım bulunamadı: ${key}`);
  return o;
}

describe("niyetKumesi", () => {
  const rows = [
    sorgu("cro ajansı", 14, 1, 9.14),
    sorgu("ux ajansı", 21, 0, 10.43), // ilk 10'un hemen dışında
    sorgu("yapay zeka danışmanlığı", 5, 0, 10), // sınır dahil
    sorgu("yapay zeka seo ajansı", 10, 0, 30),
    sorgu("dijital reklam ajansı", 40, 0, 50), // dışlanır
    sorgu("cro nedir", 10, 0, 20), // niteleyicisiz
  ];
  const n = niyetKumesi(rows);

  it("toplamı, görünen sorgu payını ve ağırlıklı pozisyonu hesaplar", () => {
    expect(n.kayit).toBe(4);
    expect(n.gosterim).toBe(50);
    expect(n.tiklama).toBe(1);
    expect(n.gorunenGosterim).toBe(100);
    expect(n.pay).toBeCloseTo(50, 6);
    expect(n.pozisyon).toBeCloseTo(
      (14 * 9.14 + 21 * 10.43 + 5 * 10 + 10 * 30) / 50,
      6
    );
  });

  it("ilk 10'u ort. poz <= 10 olarak sayar", () => {
    expect(n.ilk10.map((s: { query: string }) => s.query)).toEqual([
      "cro ajansı",
      "yapay zeka danışmanlığı",
    ]);
  });

  it("hizmet alt kırılımını ve alt kırılımdaki ilk 10 sayısını üretir", () => {
    expect(altAl(n.alt, "CRO").gosterim).toBe(14);
    expect(altAl(n.alt, "CRO").ilk10).toBe(1);
    expect(altAl(n.alt, "UX").gosterim).toBe(21);
    expect(altAl(n.alt, "UX").ilk10).toBe(0);
    expect(altAl(n.alt, "AI").ilk10).toBe(1);
    expect(altAl(n.alt, "GEO").kayit).toBe(1);
    expect(altAl(n.alt, "ETICARET").kayit).toBe(0);
    expect(altAl(n.alt, "DIJITAL").pozisyon).toBeNull();
  });

  it("A-4'ü üç GSC ölçüsünün 30 Kasım hedefine göre değerlendirir", () => {
    const hs = hizmetSayfasiPayi([
      sayfa("https://www.indoles.com.tr/tr/hizmetler/cro", 20),
      sayfa("https://www.indoles.com.tr/tr/yazilar/cro-nedir", 80),
    ]);
    // ilk 10: 2 < 12 · pay %20 >= %15 · tık 1 < 20
    expect(a4Niyet(n, hs).altinda).toBe(2);
  });
});

describe("hizmetSayfasiPayi", () => {
  it("yalnız /tr/hizmetler/<slug> ve /en/services/<slug> sayfalarını sayar", () => {
    const r = hizmetSayfasiPayi([
      sayfa("https://www.indoles.com.tr/tr/hizmetler/ai-danismanlik", 13),
      sayfa("https://www.indoles.com.tr/en/services/ai-consulting", 9, 1),
      sayfa("https://www.indoles.com.tr/tr/hizmetler/transform", 3), // pillar
      sayfa("https://www.indoles.com.tr/tr/hizmetler", 5), // liste
      sayfa("https://www.indoles.com.tr/en/services", 3), // liste
      sayfa("https://www.indoles.com.tr/hizmetler", 3), // eski URL
      sayfa("https://www.indoles.com.tr/en/hizmetler/build", 5), // bozuk segment
      sayfa("https://www.indoles.com.tr/tr/yazilar/cro-nedir", 59),
    ]);
    expect(r.kayit).toBe(3);
    expect(r.gosterim).toBe(25);
    expect(r.tiklama).toBe(1);
    expect(r.toplam).toBe(100);
    expect(r.pay).toBeCloseTo(25, 6);
  });
});

describe("kumelerCsv", () => {
  it("N0 ve HS satırlarını sona ekler; G1-G5 satırları değişmez", () => {
    const sorgular = [
      sorgu("cro ajansı", 14, 0, 9.14),
      sorgu("ai dönüşümü", 10),
    ];
    const k = sorguKumeleri(sorgular);
    const u = ulkeKumeleri([
      {
        country: "tur",
        clicks: "1",
        impressions: "10",
        ctr: "10%",
        position: "5",
      },
    ]);
    const eski = kumelerCsv(k, u).trimEnd().split("\n");
    const yeni = kumelerCsv(
      k,
      u,
      niyetKumesi(sorgular),
      hizmetSayfasiPayi([
        sayfa("https://www.indoles.com.tr/tr/hizmetler/cro", 4),
      ])
    )
      .trimEnd()
      .split("\n");
    expect(yeni.slice(0, eski.length)).toEqual(eski);
    expect(yeni.slice(eski.length).map((s) => s.split(",")[0])).toEqual([
      "N0",
      "N0-GEO",
      "N0-CRO",
      "N0-AI",
      "N0-UX",
      "N0-ETICARET",
      "N0-DIJITAL",
      "HS",
    ]);
  });
});
