import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterAll, describe, expect, it } from "vitest";

import { csvToObjects, readCsvFile } from "./gsc-ortak.mjs";
import {
  bant,
  kumeHesabi,
  NIYET_HIZMETLERI,
  niyetHizmeti,
  paraAnahtari,
  paraSayfalari,
  paraSeti,
  paraSetiBolumu,
  paraSetiCsv,
  sonHaftaTuret,
  turetmePenceresi,
} from "./gsc-pull.mjs";
import {
  IZLEME_SATIRLARI,
  PARA_SAYFALARI,
  PARA_SETI,
  PARA_SETI_BAZ,
} from "./para-seti.mjs";

/**
 * İlk 3 programının para seti — `docs/strateji/Ilk-3-Programi-2026-10.md`
 * §A.2, §0, §E.1, §E.5.
 *
 * Fikstür `scripts/fixtures/gsc-para-seti/` gerçek çekimlerden küçültüldü
 * (`GSC-Data/haftalik-2026-10-09` ve `-10-02`; satırlar birebir): para
 * setinin 15 sorgusu ve yazımları, §A.4 izleme satırları, eşleşmemesi
 * gereken komşu sorgular ("ux ajans", "yapay zeka danışmanlığı nedir"),
 * 17 para sayfası. Neyi kilitliyor: 9 Eki bazı (bant 0 / 6 / 5 / 4,
 * 286 göst / 1 tık), §0'ın türetilmiş son hafta hesabı (plan Ek'teki
 * örnekler), kanibalizasyon işareti ve `ozet.txt`'in öteki bölümlerine
 * dokunulmaması.
 */

const FIKSTUR = join(__dirname, "fixtures/gsc-para-seti");
const D09 = join(FIKSTUR, "haftalik-2026-10-09");
const D02 = join(FIKSTUR, "haftalik-2026-10-02");

const q09 = readCsvFile(join(D09, "sorgular.csv"));
const qp09 = readCsvFile(join(D09, "sorgu-sayfa.csv"));
const p09 = readCsvFile(join(D09, "sayfalar.csv"));
const q02 = readCsvFile(join(D02, "sorgular.csv"));

type Satir = Record<string, string>;

function sorgu(query: string, impressions: number, position: number): Satir {
  return {
    query,
    clicks: "0",
    impressions: String(impressions),
    ctr: "0.00%",
    position: position.toFixed(2),
  };
}

function sorguSayfa(
  query: string,
  page: string,
  impressions: number,
  position: number
): Satir {
  return { ...sorgu(query, impressions, position), page };
}

type Sonuc = ReturnType<typeof paraSeti>;

/** `noUncheckedIndexedAccess` altında kaydı numarasıyla açar. */
function kayit(p: Sonuc, no: number) {
  const k = p.kayitlar.find((x) => x.no === no);
  if (!k) throw new Error(`kayıt yok: #${no}`);
  return k;
}

const temp: string[] = [];
afterAll(() => {
  for (const d of temp) rmSync(d, { recursive: true, force: true });
});

describe("para seti verisi (scripts/para-seti.mjs)", () => {
  it("15 sorgu, 1..15 sırasıyla; her biri N0'a ve kendi hizmetine düşer", () => {
    expect(PARA_SETI.map((k) => k.no)).toEqual(
      Array.from({ length: 15 }, (_, i) => i + 1)
    );
    const anahtarlar = new Set(NIYET_HIZMETLERI.map((h) => h.key));
    for (const k of PARA_SETI) {
      expect(anahtarlar.has(k.hizmet)).toBe(true);
      expect(niyetHizmeti(k.sorgu)).toBe(k.hizmet);
    }
  });

  it("kazanan sayfaların hepsi para sayfası listesinde; liste 17 tekil URL", () => {
    expect(PARA_SAYFALARI).toHaveLength(17);
    expect(new Set(PARA_SAYFALARI).size).toBe(17);
    for (const k of PARA_SETI) {
      expect(PARA_SAYFALARI).toContain(k.kazananSayfa);
    }
  });

  it("konuşma biçimli tam iki sorgu var: #4 ve #12 (§E.6)", () => {
    expect(PARA_SETI.filter((k) => k.konusma).map((k) => k.no)).toEqual([
      4, 12,
    ]);
  });

  it("izleme satırları set sorgularıyla çakışmaz ve bağlı oldukları kayıt var", () => {
    const setAnahtar = new Set(
      PARA_SETI.flatMap((k) => [k.sorgu, ...k.varyantlar]).map(paraAnahtari)
    );
    for (const s of IZLEME_SATIRLARI) {
      expect(setAnahtar.has(paraAnahtari(s.sorgu))).toBe(false);
      if (s.bagli !== null) {
        expect(PARA_SETI.some((k) => k.no === s.bagli)).toBe(true);
      }
    }
  });
});

describe("paraAnahtari", () => {
  it("soru işaretini, sondaki noktalamayı ve fazla boşluğu yok sayar", () => {
    expect(paraAnahtari("ai danışmanlığı?")).toBe("ai danışmanlığı");
    expect(paraAnahtari("  ai   danışmanlığı ?! ")).toBe("ai danışmanlığı");
    expect(paraAnahtari("CRO Ajansı")).toBe("cro ajansı");
  });

  it("başka yazım farkını birleştirmez (şapka, ek, bitişik yazım)", () => {
    expect(paraAnahtari("yapay zekâ danışmanlığı")).not.toBe(
      paraAnahtari("yapay zeka danışmanlığı")
    );
    expect(paraAnahtari("geo danışmanlık")).not.toBe(
      paraAnahtari("geo danışmanlığı")
    );
    expect(paraAnahtari("eticaret ajansı")).not.toBe(
      paraAnahtari("e ticaret ajansı")
    );
  });
});

describe("bant — sınırlar (§0: ≤3,0 · ≤10,0 · ≤20,0)", () => {
  it("sınır değerleri alt banda dahildir", () => {
    expect(bant(1)).toBe("ilk3");
    expect(bant(3)).toBe("ilk3");
    expect(bant(3.01)).toBe("4-10");
    expect(bant(10)).toBe("4-10");
    expect(bant(10.01)).toBe("11-20");
    expect(bant(20)).toBe("11-20");
    expect(bant(20.01)).toBe("20+");
    expect(bant(61)).toBe("20+");
  });

  it("iki haneye yuvarlanmış değere uygulanır — kayan nokta artığı bant değiştirmez", () => {
    // (3 × 10 + 7 × 10) / 10 gibi birleşik hesaplar 10.000000000000002 verebilir.
    expect(bant(10.000000000000002)).toBe("4-10");
    expect(bant(3.004)).toBe("ilk3");
    expect(bant(3.006)).toBe("4-10");
  });

  it("gösterim yoksa bant yok", () => {
    expect(bant(null)).toBeNull();
  });
});

describe("paraSeti — 9 Eki fikstürü (plan §A.2)", () => {
  const p = paraSeti(q09, qp09);

  it("bant 0 / 6 / 5 / 4; set 286 göst / 1 tık", () => {
    expect(p.bant).toEqual({
      ilk3: 0,
      "4-10": 6,
      "11-20": 5,
      "20+": 4,
      gorunmuyor: 0,
    });
    expect(p.gosterim).toBe(286);
    expect(p.tiklama).toBe(1);
  });

  it("konuşma biçimli iki sorgu hariç bant 0 / 5 / 5 / 3", () => {
    expect(p.konusmaHaricBant).toEqual({
      ilk3: 0,
      "4-10": 5,
      "11-20": 5,
      "20+": 3,
      gorunmuyor: 0,
    });
  });

  it("satır satır plan §A.2 ile aynı: göst / poz / bant", () => {
    const beklenen: [number, number, string, string][] = [
      [66, 27.36, "20+", "geo danışmanlığı"],
      [31, 10.29, "11-20", "yapay zeka danışmanlığı"],
      [31, 14.9, "11-20", "geo ajansı"],
      [30, 5.8, "4-10", "şirketimi … önerir misin"],
      [28, 10.46, "11-20", "ux ajansı"],
      [26, 7.0, "4-10", "ai danışmanlığı"],
      [18, 9.0, "4-10", "cro ajansı"],
      [18, 9.28, "4-10", "yapay zeka görünürlük danışmanlığı"],
      [13, 6.69, "4-10", "cro danışmanlığı"],
      [5, 8.0, "4-10", "… fiyat farkı var mı?"],
      [5, 15.4, "11-20", "yapay zeka danışmanı"],
      [10, 35.6, "20+", "… en iyi cro uzmanları kimlerdir?"],
      [3, 16.67, "11-20", "e ticaret ajansı"],
      [1, 48.0, "20+", "e ticaret danışmanlığı"],
      [1, 61.0, "20+", "dijital dönüşüm firmaları"],
    ];
    expect(
      p.kayitlar.map((k) => [
        k.gosterim,
        Number((k.pozisyon ?? 0).toFixed(2)),
        k.bant,
      ])
    ).toEqual(beklenen.map(([g, poz, b]) => [g, poz, b]));
  });

  it("varyantları gösterim ağırlıklı birleştirir: şirketimi … (21 × 5,14 + 9 × 7,33) / 30", () => {
    const k = kayit(p, 4);
    expect(k.gosterim).toBe(30);
    expect(k.pozisyon).toBeCloseTo((21 * 5.14 + 9 * 7.33) / 30, 6);
    // Sıralanan sayfa da iki yazımın birleşiği — tek satır.
    expect(k.sayfalar).toHaveLength(1);
    expect(k.sayfalar[0]?.gosterim).toBe(30);
  });

  it("§A.4 izleme satırları toplama ve bantlara girmez, ayrı raporlanır", () => {
    // "yapay zekâ danışmanlığı" 3 göst — #2'ye eklenmez.
    expect(kayit(p, 2).gosterim).toBe(31);
    expect(kayit(p, 1).gosterim).toBe(66); // "geo danışmanlık" 12 hariç
    const izleme = Object.fromEntries(
      p.izleme.map((s) => [s.sorgu, s.gosterim])
    );
    expect(izleme["geo danışmanlık"]).toBe(12);
    expect(izleme["yapay zekâ danışmanlığı"]).toBe(3);
    expect(izleme["chatgpt gemini görünürlüğü ajans türkiye"]).toBe(2);
  });

  it("komşu sorguları saymaz ('ux ajans', 'yapay zeka danışmanlığı nedir')", () => {
    expect(kayit(p, 5).gosterim).toBe(28);
    expect(kayit(p, 2).sayfalar.map((s) => s.gosterim)).toEqual([31]);
  });
});

describe("paraSeti — kazanan sayfa ve kanibalizasyon (§B.3)", () => {
  const p = paraSeti(q09, qp09);

  it("kazanan dışında sayfa sıralanırsa işaretler; kazananın kendi pozisyonunu verir", () => {
    const cro = kayit(p, 7);
    expect(cro.kanibalizasyon).toBe(true);
    expect(cro.kazananSiralaniyor).toBe(true);
    expect(cro.kazananGosterim).toBe(15);
    expect(cro.kazananPozisyon).toBeCloseTo(6.8, 6);
    expect(cro.sayfalar.map((s) => [s.yol, s.gosterim])).toEqual([
      ["/tr/yazilar/cro-ajansi-nasil-secilir", 15],
      ["/tr/hizmetler/cro", 3],
    ]);
  });

  it("yalnız kazanan sıralanıyorsa işaret yok", () => {
    const geo = kayit(p, 3);
    expect(geo.kanibalizasyon).toBe(false);
    expect(geo.kazananSiralaniyor).toBe(true);
  });

  it("kazanan hiç sıralanmıyorsa da işaretler (ux ajansı eski adreste)", () => {
    const ux = kayit(p, 5);
    expect(ux.kazananSiralaniyor).toBe(false);
    expect(ux.kazananPozisyon).toBeNull();
    expect(ux.kanibalizasyon).toBe(true);
    expect(ux.sayfalar.map((s) => s.yol)).toEqual([
      "/web-tasarim-ui-ux-tasarimi/",
    ]);
  });

  it("9 Eki'de beş sorgu işaretli: #5, #7, #9, #11, #12", () => {
    expect(p.kanibalizasyon.map((k) => k.no)).toEqual([5, 7, 9, 11, 12]);
  });

  it("kazanan yolu sondaki '/' farkını yok sayarak eşler", () => {
    const set = [
      {
        no: 1,
        sorgu: "ux ajansı",
        varyantlar: [],
        hizmet: "UX" as const,
        kazananSayfa: "/web-tasarim-ui-ux-tasarimi",
        niyet: 3 as const,
      },
    ];
    const r = paraSeti(
      [sorgu("ux ajansı", 5, 9)],
      [
        sorguSayfa(
          "ux ajansı",
          "https://www.indoles.com.tr/web-tasarim-ui-ux-tasarimi/",
          5,
          9
        ),
      ],
      null,
      {},
      set,
      []
    );
    expect(kayit(r, 1).kazananSiralaniyor).toBe(true);
    expect(kayit(r, 1).kanibalizasyon).toBe(false);
  });

  it("aynı sorgu iki kayda düşerse hata verir — sessiz çift sayım yok", () => {
    const set = [
      {
        no: 1,
        sorgu: "cro ajansı",
        varyantlar: [],
        hizmet: "CRO" as const,
        kazananSayfa: "/tr/hizmetler/cro",
        niyet: 3 as const,
      },
      {
        no: 2,
        sorgu: "cro danışmanlığı",
        varyantlar: ["cro ajansı?"],
        hizmet: "CRO" as const,
        kazananSayfa: "/tr/hizmetler/cro",
        niyet: 3 as const,
      },
    ];
    expect(() => paraSeti([], [], null, {}, set, [])).toThrow(/iki kayda/);
  });
});

describe("paraSeti --prev — Δ poz ve türetilmiş son hafta (§0, plan Ek)", () => {
  const p = paraSeti(q09, qp09, q02);

  it("Δ poz = bu çekim − önceki çekim (birleşik pozisyonla)", () => {
    expect(kayit(p, 3).deltaPoz).toBeCloseTo(14.9 - 21.56, 6);
    expect(kayit(p, 6).deltaPoz).toBeCloseTo(7.0 - 4.08, 6);
    expect(kayit(p, 4).deltaPoz).toBeCloseTo(
      (21 * 5.14 + 9 * 7.33) / 30 - (21 * 5.71 + 9 * 7.33) / 30,
      6
    );
    expect(kayit(p, 4).onceki?.pozisyon).toBeCloseTo(6.2, 2);
  });

  it("son hafta plan Ek'teki dört örneği verir", () => {
    const sh = (no: number) => kayit(p, no).sonHafta;
    expect(sh(3)).toMatchObject({ durum: "turetildi", n: 13 });
    expect(sh(3)?.pozisyon).toBeCloseTo(5.68, 2);
    expect(sh(6)).toMatchObject({ durum: "turetildi", n: 13 });
    expect(sh(6)?.pozisyon).toBeCloseTo(9.92, 2);
    expect(sh(1)).toMatchObject({ durum: "turetildi", n: 50 });
    expect(sh(1)?.pozisyon).toBeCloseTo(27.14, 2);
    expect(sh(2)).toMatchObject({ durum: "turetildi", n: 17 });
    expect(sh(2)?.pozisyon).toBeCloseTo(10.17, 2);
  });

  it("gösterim artmadıysa türetmez; önceki çekimde yoksa 'yeni'", () => {
    expect(kayit(p, 4).sonHafta).toEqual({
      durum: "yok",
      n: 0,
      pozisyon: null,
    });
    const eticaret = kayit(p, 13);
    expect(eticaret.onceki).toEqual({ gosterim: 0, pozisyon: null });
    expect(eticaret.deltaPoz).toBeNull();
    expect(eticaret.sonHafta?.durum).toBe("yeni");
    expect(eticaret.sonHafta?.pozisyon).toBeCloseTo(16.67, 2);
  });

  it("önceki çekim verilmezse Δ ve son hafta yok", () => {
    const tek = paraSeti(q09, qp09);
    expect(tek.oncekiVar).toBe(false);
    expect(kayit(tek, 3).deltaPoz).toBeNull();
    expect(kayit(tek, 3).sonHafta).toBeNull();
  });

  it("pencereler örtüşmüyorsa (sonHafta: false) yalnız Δ hesaplanır", () => {
    const r = paraSeti(q09, qp09, q02, { sonHafta: false });
    expect(kayit(r, 3).deltaPoz).toBeCloseTo(14.9 - 21.56, 6);
    expect(kayit(r, 3).sonHafta).toBeNull();
  });
});

describe("sonHaftaTuret ve turetmePenceresi", () => {
  const o = (gosterim: number, poz: number) => ({
    kayit: 1,
    gosterim,
    tiklama: 0,
    pozAgirlik: gosterim * poz,
  });

  it("önceki çekimin kendine ait günlerinde gösterim varsa 1'in altına düşen sonucu reddeder", () => {
    // 10 göst / poz 2 → 12 göst / poz 1: (12 − 20) / 2 = −4.
    expect(sonHaftaTuret(o(12, 1), o(10, 2))).toEqual({
      durum: "temiz-degil",
      n: 2,
      pozisyon: null,
    });
  });

  it("önceki çekim yoksa null", () => {
    expect(sonHaftaTuret(o(5, 3), null)).toBeNull();
  });

  it("9 Eki / 2 Eki pencereleri: son 30 Eyl–6 Eki, temizlik 1–7 Eyl", () => {
    expect(
      turetmePenceresi({
        start: "2026-09-08",
        end: "2026-10-06",
        oncekiStart: "2026-09-01",
        oncekiEnd: "2026-09-29",
      })
    ).toEqual({
      ortusuyor: true,
      son: "2026-09-30→2026-10-06",
      oncekiYalniz: "2026-09-01→2026-09-07",
    });
  });

  it("örtüşmeyen pencerede türetme kapanır", () => {
    expect(
      turetmePenceresi({
        start: "2026-10-08",
        end: "2026-11-05",
        oncekiStart: "2026-09-01",
        oncekiEnd: "2026-09-29",
      }).ortusuyor
    ).toBe(false);
  });
});

describe("paraSayfalari — sayfa düzeyi (§E.2)", () => {
  it("17 URL'den satırı olan 15'i toplar: 574 göst / 1 tık; eksikleri listeler", () => {
    const s = paraSayfalari(p09);
    expect(s.url).toBe(17);
    expect(s.gosterim).toBe(574);
    expect(s.tiklama).toBe(1);
    expect(s.sayfalar).toHaveLength(15);
    expect(s.eksik).toEqual([
      "/tr/hizmetler/ui-ux-tasarim",
      "/tr/yazilar/e-ticaret-danismanligi-fiyatlari",
    ]);
  });

  it("baz sabiti fikstürden yeniden hesaplanan değerle aynı", () => {
    const p = paraSeti(q09, qp09);
    const s = paraSayfalari(p09);
    const { gorunmuyor: _g1, ...bant4 } = p.bant;
    const { gorunmuyor: _g2, ...konusma4 } = p.konusmaHaricBant;
    expect(bant4).toEqual(PARA_SETI_BAZ.bant);
    expect(konusma4).toEqual(PARA_SETI_BAZ.konusmaHaricBant);
    expect([p.gosterim, p.tiklama]).toEqual([
      PARA_SETI_BAZ.gosterim,
      PARA_SETI_BAZ.tiklama,
    ]);
    expect({ gosterim: s.gosterim, tiklama: s.tiklama }).toEqual(
      PARA_SETI_BAZ.paraSayfalari
    );
  });
});

describe("çıktı — ozet.txt bölümü ve para-seti.csv", () => {
  it("bölüm E.1 satırlarını ve 15 satırlık tabloyu üretir", () => {
    const L = paraSetiBolumu({
      para: paraSeti(q09, qp09, q02),
      sayfa: paraSayfalari(p09),
      pencere: { onceki: "haftalik-2026-10-02", son: "2026-09-30→2026-10-06" },
    });
    expect(L[0]).toBe("## Para seti (İlk 3 programı)");
    expect(L).toContain(
      "Bant: ilk 3 0 · 4-10 6 · 11-20 5 · 20+ 4   (9 Eki baz: 0 · 6 · 5 · 4)"
    );
    expect(L).toContain("Para seti: 286 göst / 1 tık   (9 Eki baz: 286 / 1)");
    const tablo = L.filter((s) => /^\| \d+ \|/.test(s));
    expect(tablo).toHaveLength(15);
    expect(tablo[2]).toContain("| -6.66 | ≈5.68 (n=13) |");
    expect(tablo[6]).toContain("bölünmüş (A-6) — kazanan 15 / 6.80");
    expect(tablo[4]).toContain("kazanan sıralanmıyor (eski URL sıralanıyor)");
  });

  it("para-seti.csv: 15 satır, negatif Δ sayı olarak (formül kaçışı almaz)", () => {
    const csv = paraSetiCsv(paraSeti(q09, qp09, q02));
    const satirlar = csvToObjects(csv);
    expect(satirlar).toHaveLength(15);
    const geoAjansi = satirlar.find((r) => r.sorgu === "geo ajansı");
    expect(geoAjansi?.delta_poz).toBe("-6.66");
    expect(geoAjansi?.son_hafta_pozisyon).toBe("5.68");
    expect(satirlar.find((r) => r.no === "7")?.kanibalizasyon).toBe("1");
  });
});

describe("kumeHesabi --from-dir + --prev — uçtan uca", () => {
  it("para-seti.csv yazar; ozet.txt'e bölümü N0'dan sonra, A-3'ten önce ekler, öteki bölümler değişmez", () => {
    const tek = mkdtempSync(join(tmpdir(), "para-seti-"));
    const cift = mkdtempSync(join(tmpdir(), "para-seti-"));
    temp.push(tek, cift);
    kumeHesabi(D09, tek);
    kumeHesabi(D09, cift, {}, D02);

    const ozet = readFileSync(join(cift, "ozet.txt"), "utf8");
    const n0 = ozet.indexOf("## Satın alma niyeti (N0)");
    const para = ozet.indexOf("## Para seti (İlk 3 programı)");
    const a3 = ozet.indexOf("## A-3 adayları");
    expect(n0).toBeGreaterThan(-1);
    expect(para).toBeGreaterThan(n0);
    expect(a3).toBeGreaterThan(para);
    expect(ozet).toContain(
      "Önceki çekim: haftalik-2026-10-02 (2026-09-01 → 2026-09-29) · son pencere 2026-09-30→2026-10-06."
    );

    // Para bölümü çıkarılınca iki çıktı da aynı metne iner.
    const bolumsuz = (s: string) =>
      s.replace(
        /## Para seti \(İlk 3 programı\)[\s\S]*?(?=## A-3 adayları)/,
        ""
      );
    const tekOzet = readFileSync(join(tek, "ozet.txt"), "utf8");
    expect(tekOzet).toContain("Önceki çekim verilmedi (--prev)");
    expect(bolumsuz(ozet)).toBe(bolumsuz(tekOzet));

    const csv = readCsvFile(join(cift, "para-seti.csv"));
    expect(csv).toHaveLength(15);
    expect(csv.find((r) => r.no === "3")?.son_hafta_n).toBe("13");
  });

  it("--prev klasöründe sorgular.csv yoksa hata verir", () => {
    const out = mkdtempSync(join(tmpdir(), "para-seti-"));
    temp.push(out);
    expect(() => kumeHesabi(D09, out, {}, join(FIKSTUR, "yok"))).toThrow(
      /sorgular\.csv yok/
    );
  });
});
