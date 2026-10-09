#!/usr/bin/env node
/**
 * GSC Pull — Search Console verisini service account ile çeker, CSV döker,
 * G1-G5 küme özetini, N0 satın alma niyeti kümesini (strateji v1.18'in
 * birincil ölçüleri) ve İlk 3 programının para setini hesaplar.
 *
 * Sıfır bağımlılık: Node 22+ (fetch + crypto). Ortak altyapı
 * `scripts/gsc-ortak.mjs`'te; `googleapis` paketi bilinçli olarak eklenmedi
 * (CLAUDE.md: yeni dependency gerekçe ister).
 *
 * Kullanım:
 *   node scripts/gsc-pull.mjs [--start 2026-08-18] [--end 2026-09-15] \
 *     [--key "/path/to/service-account.json"] [--site "sc-domain:indoles.com.tr"] \
 *     [--out "/path/to/cikti-klasoru"]
 *
 *   # API'ye hiç dokunmadan, mevcut CSV'lerden küme hesabı:
 *   node scripts/gsc-pull.mjs --from-dir "<GSC-Data/haftalik-2026-09-18>" [--out /tmp/x]
 *
 *   # Para setinde Δ poz ve türetilmiş son hafta için önceki çekim (iki kipte de):
 *   node scripts/gsc-pull.mjs --from-dir "<…/haftalik-2026-10-09>" --prev "<…/haftalik-2026-10-02>"
 *
 * Varsayılanlar: son 28 gün (bitiş bugün-3, GSC gecikmesi) · anahtar Marketing
 * klasöründeki JSON · çıktı `GSC-Data/haftalik-<bugün>/` · mülk
 * `https://www.indoles.com.tr/`.
 *
 * Mülk seçimi: varsayılan SABİT indoles mülküdür. `sites.list` yalnız bilgi
 * amaçlı loglanır. Otomatik seçim yalnız `--site auto` ile devreye girer —
 * 18 Eylül'de otomatik seçim listenin ilk mülkünü (meccanotecnica) alıp
 * yanlış veriyi klasöre yazdı, bu yüzden varsayılan olmaktan çıkarıldı.
 *
 * Çıktılar: gunluk.csv · sorgular.csv · sayfalar.csv · sorgu-sayfa.csv ·
 * ulkeler.csv · kumeler.csv · para-seti.csv · ozet.txt · meta.txt — hepsi
 * UTF-8.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  arg,
  bugun,
  csvCell,
  getAccessToken,
  num,
  readCsvFile,
  resolveGscDataBase,
  resolveKeyPath,
  toCsv,
} from "./gsc-ortak.mjs";
import {
  IZLEME_SATIRLARI,
  PARA_SAYFALARI,
  PARA_SETI,
  PARA_SETI_BAZ,
} from "./para-seti.mjs";

/** Varsayılan mülk — `--site auto` denmedikçe otomatik seçim yapılmaz. */
export const DEFAULT_SITE = "https://www.indoles.com.tr/";

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

// ---------------------------------------------------------------- kümeler

/**
 * G1-G5 küme tanımları — otorite:
 * `docs/strateji/Keyword-Onceliklendirme-2026-08-27.md` §4 "GSC'de izlenecek
 * beş grup" tablosu. Tablo düz kelime listesi verir; aşağıdaki üç kural
 * tablodan türetilmedi, 18 Eylül'de elle yapılan hesabı birebir yeniden
 * üretmek için eklendi ve sebebi tek tek yazıldı:
 *
 *  1. G3'e `ai optimizasyon` eklendi — "ai optimizasyonu" GEO sorgusudur,
 *     tablodaki `ai seo`/`ai overview` varyantlarının Türkçe karşılığı.
 *  2. G2, G3 ile kesişen sorguları saymaz. "yapay zeka arama optimizasyonu"
 *     hem `yapay zeka` hem `arama optimizasyonu` ile eşleşiyor; GEO kümesine
 *     yazılır, AI kümesinde tekrar sayılmaz.
 *  3. G2, `arama motoru` geçen sorguları saymaz — bunlar arama motoru
 *     optimizasyonu niyetlidir, AI dönüşümü talebi değil.
 *
 * G1 ve G4 bağımsız hesaplanır (G1-G2 kesişimi bilerek çift sayılır:
 * "ai dönüşümü" hem CRO hem AI raporunda görünür).
 * G4'e `business building` eklendi — tablodaki `iş inşası`nın İngilizce
 * karşılığı ve kümenin bugünkü tek gerçek kaynağı.
 */
const G3_RE = /geo|ai seo|ai overview|llms|arama optimizasyonu|ai optimizasyon/;
const G2_RE = /yapay zeka|ai /;
const G2_HARIC_RE = /arama motoru/;
const G1_RE = /dönüşüm|cro|a\/b test|sepet terk/;
const G4_RE = /iş geliştirme|iş inşası|iş modeli|business building/;

/** K-4 kararı: kariyer niyetli hacim KPI'ya sayılmaz, ayrı satırda izlenir. */
const K4_RE = /iş zekası|işletme mühendisliği/;

// ------------------------------------------------ N0 — satın alma niyeti

/**
 * N0 satın alma niyeti kümesi — otorite:
 * `docs/strateji/Niyetli-Sorgu-Seti-2026-09.md` (Burak kararı, 2026-09-25:
 * SEO/GEO'nun ana amacı satın alma niyetli görünürlük). G1-G4'ten bağımsız
 * hesaplanır; onların sayılarını değiştirmez.
 *
 * Bir sorgu N0'a girer ⇔ (1) bir niteleyici taşır, (2) altı hizmetten birinin
 * terimini taşır, (3) hiçbir dışlama deseni tutmaz. Niteleyicisiz hizmet
 * sorgusu ("cro nedir", "geo optimizasyonu") bilgi niyetidir, sayılmaz;
 * hizmet terimi taşımayan karar sorgusu ("hangi ajansla çalışmalıyım") genel
 * ajans havuzudur, sayılmaz.
 *
 * Sınır: `\b` Türkçe harflerde çalışmadığı için kelime sınırı Unicode harf
 * sınıfıyla (`\p{L}`) yazıldı — "şirketimi" `şirketi` sayılmasın, "microsoft"
 * `cro` sayılmasın.
 *
 * Kapsam TR niteleyicilerdir. EN sorgular bilerek dışarıda: EN'e F2'ye kadar
 * yatırım yok ve G5 onları ayrıca izliyor (strateji v1.18).
 */
const NIYET_NITELEYICI_RE =
  /ajans|danışman|firma|şirket(i|leri|ler)(?!\p{L})|uzman|hizmet|fiyat|ücret(?!siz)|maliyet|nasıl seç|(?<!\p{L})öner(ir|irsin|irsiniz)?(?!\p{L})|tavsiye|kim yapar|en (iyi|başarılı|güvenilir) .*(kim|hangi)/u;

/**
 * Hizmet alt kırılımı — İLK EŞLEŞEN kazanır, sıra bilinçli:
 *  - GEO, AI'dan önce: "yapay zeka motorlarında görünür kılacak ajans" GEO
 *    talebidir (G3'ün G2'ye önceliğiyle aynı mantık).
 *  - CRO, E-ticaret'ten önce: "e-ticaret dönüşüm oranı ajansı" CRO talebidir.
 *  - P0 hizmetler (GEO, CRO, AI) P1'lerden (UX, E-ticaret, Dijital dönüşüm)
 *    önce; iki hizmet terimi birden taşıyan sorgu P0'a yazılır.
 * Sırası `kumeler.csv` ve `ozet.txt`'teki alt satır sırasıdır.
 */
export const NIYET_HIZMETLERI = [
  {
    key: "GEO",
    label: "GEO",
    re: /(?<!\p{L})geo(?!\p{L})|görün(ür|mek|me)|(yapay zeka|ai) (arama )?motor|(ai|yapay zeka|chatgpt) seo|arama optimizasyon|ai overview|generative engine|answer engine|llms|(chatgpt|gemini|perplexity)['’]?\s?(d[ae]|t[ae])(?!\p{L})/u,
  },
  {
    key: "CRO",
    label: "CRO",
    re: /(?<!\p{L})cro(?!\p{L})|dönüşüm oran|dönüşüm optimizasyon|dönüşüm artır|a\/b test|(?<!\p{L})ab test|sepet terk/u,
  },
  {
    key: "AI",
    label: "Yapay zeka",
    re: /yapay zek[aâ]|(?<!\p{L})ai(?!\p{L})|(?<!\p{L})llm/u,
  },
  {
    key: "UX",
    label: "UX",
    re: /(?<!\p{L})(ux|ui)(?!\p{L})|kullanıcı deneyimi|arayüz|kullanılabilirlik/u,
  },
  {
    key: "ETICARET",
    label: "E-ticaret",
    re: /(?<!\p{L})e[- ]?ticaret|shopify|trendyol|(?<!\p{L})ikas(?!\p{L})|pazar ?yeri|e[- ]?ihracat/u,
  },
  {
    key: "DIJITAL",
    label: "Dijital dönüşüm",
    re: /dijital dönüşüm|dijitalleş|endüstri [0-9]/u,
  },
];

/**
 * Dışlamalar — niteleyici ve hizmet terimi tutsa bile N0'a girmez:
 *  - Genel reklam/pazarlama ajansı havuzu (Burak kararı: "dijital reklam
 *    ajansı", "google reklam ajansı" gibi rekabetli kelimelerde güç
 *    harcanmaz). "yapay zeka destekli dijital reklam ajansı" da dışarıda.
 *  - Kariyer/öğrenci niyeti: "uzmanı" bir iş unvanıdır da ("cro uzmanı maaş").
 *  - Araç niyeti: "en iyi geo aracı hangisi" hizmet değil araç arar; araç
 *    sayfaları kendi kelimelerini taşır (strateji v1.11, A-6 disiplini).
 */
const NIYET_HARIC_RE = [
  /reklam|pazarlama ajans|dijital ajans|performans (pazarlama )?ajans|dijital performans|sosyal medya|google ads|meta ads|growth hacking/u,
  /maaş|ilan|kariyer|staj|nasıl olunur|olmak için|kurs|sertifika|bootcamp|üniversite/u,
  /(?<!\p{L})ara[çc](ı|i|lar|ları|lari)?(?!\p{L})|(?<!\p{L})tool/u,
];

/**
 * Sorgunun N0 hizmet anahtarını döner (`"CRO"`, `"GEO"` …); niyetli değilse
 * `null`.
 */
export function niyetHizmeti(query) {
  const q = norm(query);
  if (!NIYET_NITELEYICI_RE.test(q)) return null;
  if (NIYET_HARIC_RE.some((re) => re.test(q))) return null;
  return NIYET_HIZMETLERI.find((h) => h.re.test(q))?.key ?? null;
}

/** "İlk 10": ağırlıklı ortalama pozisyon 10,0 veya daha iyi. */
export const ILK10_ESIK = 10;

/** Sorgu bazlı kümeler — sırası `kumeler.csv`'deki satır sırasıdır. */
export const SORGU_KUMELERI = [
  { key: "G1", label: "CRO", test: (q) => G1_RE.test(q) },
  {
    key: "G2",
    label: "AI",
    test: (q) => G2_RE.test(q) && !G3_RE.test(q) && !G2_HARIC_RE.test(q),
  },
  { key: "G3", label: "GEO", test: (q) => G3_RE.test(q) },
  { key: "G4", label: "Kategori", test: (q) => G4_RE.test(q) },
];

/**
 * GSC sorguları zaten küçük harfli gelir; yine de normalize edilir.
 * Türkçe locale'i BİLEREK kullanılmıyor: `toLocaleLowerCase("tr")` "AI"yı
 * "aı" yapar ve G2 deseni tutmaz.
 */
const norm = (s) => String(s ?? "").toLowerCase();

function bosOzet() {
  return { kayit: 0, gosterim: 0, tiklama: 0, pozAgirlik: 0 };
}

function ekle(o, gosterim, tiklama, pozisyon) {
  o.kayit += 1;
  o.gosterim += gosterim;
  o.tiklama += tiklama;
  o.pozAgirlik += pozisyon * gosterim;
}

function kapat(o) {
  return {
    kayit: o.kayit,
    gosterim: o.gosterim,
    tiklama: o.tiklama,
    ctr: o.gosterim > 0 ? (o.tiklama / o.gosterim) * 100 : 0,
    pozisyon: o.gosterim > 0 ? o.pozAgirlik / o.gosterim : null,
  };
}

/**
 * `sorgular.csv` satırlarından G1-G4 + K-4 özetini üretir.
 * Pozisyon gösterimle ağırlıklandırılır (GSC'nin kendi yöntemi).
 */
export function sorguKumeleri(rows) {
  const acc = Object.fromEntries(
    [...SORGU_KUMELERI.map((k) => k.key), "K4"].map((k) => [k, bosOzet()])
  );
  for (const r of rows) {
    const q = norm(r.query);
    const g = num(r.impressions);
    const t = num(r.clicks);
    const p = num(r.position);
    for (const kume of SORGU_KUMELERI) {
      if (kume.test(q)) ekle(acc[kume.key], g, t, p);
    }
    if (K4_RE.test(q)) ekle(acc.K4, g, t, p);
  }
  return Object.fromEntries(Object.entries(acc).map(([k, v]) => [k, kapat(v)]));
}

/**
 * `sorgular.csv` satırlarından N0 satın alma niyeti özetini üretir.
 *
 * Döner: N0 toplamı (kayıt/gösterim/tık/ağırlıklı poz), görünen sorgu
 * gösterimi (payda), niyetli pay, ilk 10'daki niyetli sorgular, hizmet alt
 * kırılımı ve gösterime göre sıralı niyetli sorgu listesi.
 */
export function niyetKumesi(rows) {
  const gorunen = bosOzet();
  const toplam = bosOzet();
  const alt = Object.fromEntries(
    NIYET_HIZMETLERI.map((h) => [h.key, bosOzet()])
  );
  const sorgular = [];
  for (const r of rows) {
    const g = num(r.impressions);
    const t = num(r.clicks);
    const p = num(r.position);
    ekle(gorunen, g, t, p);
    const hizmet = niyetHizmeti(r.query);
    if (!hizmet) continue;
    ekle(toplam, g, t, p);
    ekle(alt[hizmet], g, t, p);
    sorgular.push({
      query: String(r.query ?? ""),
      hizmet,
      gosterim: g,
      tiklama: t,
      pozisyon: p,
    });
  }
  sorgular.sort((a, b) => b.gosterim - a.gosterim || a.pozisyon - b.pozisyon);
  const ilk10 = sorgular.filter((s) => s.pozisyon <= ILK10_ESIK);
  return {
    ...kapat(toplam),
    gorunenGosterim: gorunen.gosterim,
    pay: gorunen.gosterim > 0 ? (toplam.gosterim / gorunen.gosterim) * 100 : 0,
    ilk10,
    alt: Object.fromEntries(
      NIYET_HIZMETLERI.map((h) => [
        h.key,
        {
          ...kapat(alt[h.key]),
          ilk10: ilk10.filter((s) => s.hizmet === h.key).length,
        },
      ])
    ),
    sorgular,
  };
}

/**
 * Hizmet sayfası = `/tr/hizmetler/<slug>` veya `/en/services/<slug>`.
 * Liste sayfaları (`/tr/hizmetler`, `/en/services`) ve eski URL'ler
 * (`/hizmetler`, locale segmenti bozuk `/en/hizmetler/*`) sayılmaz. Pillar
 * sayfaları (growth/transform/build) aynı önek altında olduğu için sayılır.
 */
const HIZMET_SAYFASI_RE = /^\/(tr\/hizmetler|en\/services)\/[^/]+\/?$/;

/** `sayfalar.csv`'den hizmet sayfalarının toplam gösterim payı. */
export function hizmetSayfasiPayi(rows) {
  let toplam = 0;
  const hizmet = bosOzet();
  const sayfalar = [];
  for (const r of rows) {
    const g = num(r.impressions);
    toplam += g;
    let path;
    try {
      path = new URL(r.page).pathname;
    } catch {
      path = String(r.page ?? "");
    }
    if (HIZMET_SAYFASI_RE.test(path)) {
      ekle(hizmet, g, num(r.clicks), num(r.position));
      sayfalar.push({ path, gosterim: g, tiklama: num(r.clicks) });
    }
  }
  sayfalar.sort((a, b) => b.gosterim - a.gosterim);
  return {
    ...kapat(hizmet),
    toplam,
    pay: toplam > 0 ? (hizmet.gosterim / toplam) * 100 : 0,
    sayfalar,
  };
}

/** `ulkeler.csv`'den G5 (TR dışı) ve referans TR satırını üretir. */
export function ulkeKumeleri(rows) {
  const trDisi = bosOzet();
  const tr = bosOzet();
  for (const r of rows) {
    const hedef = String(r.country ?? "").toLowerCase() === "tur" ? tr : trDisi;
    ekle(hedef, num(r.impressions), num(r.clicks), num(r.position));
  }
  return { G5: kapat(trDisi), TR: kapat(tr) };
}

/**
 * Konsolidasyon takibi: eski URL payı.
 *
 * Eski URL = yolu `/tr` veya `/en` ile BAŞLAMAYAN sayfa. Locale kökleri
 * (`/tr`, `/en` — uzantısız) yeni yapıdır, eski sayılmaz; ana sayfa (`/`)
 * locale öneki taşımadığı için eski sayılır — 18 Eylül'ün elle hesabı da
 * böyle yapıyor (667 / 2.136, 47 sayfa).
 */
export function eskiUrlPayi(rows) {
  let toplam = 0;
  let eski = 0;
  const eskiSayfalar = [];
  for (const r of rows) {
    const g = num(r.impressions);
    toplam += g;
    let path;
    try {
      path = new URL(r.page).pathname;
    } catch {
      path = String(r.page ?? "");
    }
    if (!/^\/(tr|en)(\/|$)/.test(path)) {
      eski += g;
      eskiSayfalar.push({ path, gosterim: g });
    }
  }
  eskiSayfalar.sort((a, b) => b.gosterim - a.gosterim);
  return {
    toplam,
    eski,
    pay: toplam > 0 ? (eski / toplam) * 100 : 0,
    sayfa: eskiSayfalar.length,
    eskiSayfalar,
  };
}

/** A-3 alarmı: poz < 10 ve CTR < %1 ve gösterim >= 20 olan sayfalar. */
export function a3Adaylari(rows) {
  return rows
    .filter(
      (r) => num(r.position) < 10 && num(r.ctr) < 1 && num(r.impressions) >= 20
    )
    .map((r) => {
      let path;
      try {
        path = new URL(r.page).pathname;
      } catch {
        path = String(r.page ?? "");
      }
      return {
        path,
        gosterim: num(r.impressions),
        pozisyon: num(r.position),
        ctr: num(r.ctr),
      };
    })
    .sort((a, b) => b.gosterim - a.gosterim);
}

/** A-6 alarmı: aynı sorguda birden fazla INDOLES sayfası. */
export function a6Kanibalizasyon(rows) {
  const sayac = new Map();
  for (const r of rows) {
    const q = String(r.query ?? "");
    const kayit = sayac.get(q) ?? { sayfa: new Set(), gosterim: 0 };
    kayit.sayfa.add(String(r.page ?? ""));
    kayit.gosterim += num(r.impressions);
    sayac.set(q, kayit);
  }
  return [...sayac.entries()]
    .filter(([, v]) => v.sayfa.size > 1)
    .map(([query, v]) => ({ query, sayfa: v.sayfa.size, gosterim: v.gosterim }))
    .sort((a, b) => b.gosterim - a.gosterim);
}

/** `gunluk.csv`'den son 7 gün / önceki 7 gün / dönem toplamı. */
export function gunlukOzet(rows) {
  const gunler = rows
    .map((r) => ({
      date: String(r.date ?? ""),
      gosterim: num(r.impressions),
      tiklama: num(r.clicks),
      pozisyon: num(r.position),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
  const topla = (dilim) => {
    const o = bosOzet();
    for (const g of dilim) ekle(o, g.gosterim, g.tiklama, g.pozisyon);
    return {
      ...kapat(o),
      ilk: dilim[0]?.date ?? "-",
      son: dilim[dilim.length - 1]?.date ?? "-",
    };
  };
  return {
    donem: topla(gunler),
    son7: topla(gunler.slice(-7)),
    onceki7: topla(gunler.slice(-14, -7)),
  };
}

// ------------------------------------- Para seti — İlk 3 programı (§E.5)

/**
 * Para seti hesabı — otorite: `docs/strateji/Ilk-3-Programi-2026-10.md`
 * §A.2 (set), §0 (bant ve türetilmiş son hafta), §E.1 (log biçimi), §E.5
 * (tasarım). Set verisi `scripts/para-seti.mjs`'te; burada yalnız mantık.
 *
 * Bant sınırları ağırlıklı ortalama pozisyonun İKİ HANEYE yuvarlanmış
 * değerine uygulanır — rapordaki sayı neyse bant da odur (birleşik
 * pozisyon 10,000000001 çıkıp 11-20'ye düşmesin).
 */
export const BANTLAR = [
  { key: "ilk3", label: "ilk 3", ust: 3 },
  { key: "4-10", label: "4-10", ust: 10 },
  { key: "11-20", label: "11-20", ust: 20 },
  { key: "20+", label: "20+", ust: Infinity },
];

/** Pozisyonun bandı (`"ilk3"`, `"4-10"` …); gösterim yoksa `null`. */
export function bant(pozisyon) {
  if (pozisyon === null || pozisyon === undefined) return null;
  const p = Math.round(pozisyon * 100) / 100;
  return BANTLAR.find((b) => p <= b.ust)?.key ?? null;
}

/**
 * Para seti eşleme anahtarı: küçük harf, sadeleşmiş boşluk, sondaki `?.!`
 * atılmış. Soru işaretli ve işaretsiz yazım tek sorgudur (§A.2 #4); başka
 * yazım farkı (ör. "yapay zekâ") birleşmez.
 */
export function paraAnahtari(query) {
  return norm(query)
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[?.!]+$/u, "")
    .trim();
}

/** GSC `page` değerinin yolu; URL değilse olduğu gibi. */
function sayfaYolu(page) {
  try {
    return new URL(page).pathname;
  } catch {
    return String(page ?? "");
  }
}

/** Yol kıyası için sondaki `/` atılır (kök hariç). */
const yolAnahtari = (yol) => yol.replace(/\/+$/, "") || "/";

/**
 * `PARA_SETI`'ndeki her kaydın eşleme anahtarlarından kayıt numarasına
 * sözlük. Aynı anahtar iki kayda düşerse hata — sessiz çift sayım olmasın.
 */
function paraIndeksi(set) {
  const indeks = new Map();
  for (const kayit of set) {
    for (const q of [kayit.sorgu, ...kayit.varyantlar]) {
      const k = paraAnahtari(q);
      const mevcut = indeks.get(k);
      if (mevcut !== undefined && mevcut !== kayit.no) {
        throw new Error(
          `para seti: "${q}" iki kayda düşüyor (#${mevcut}, #${kayit.no})`
        );
      }
      indeks.set(k, kayit.no);
    }
  }
  return indeks;
}

/** Sorgu satırlarını kayıt numarasına göre toplar (varyantlar birleşik). */
function paraTopla(rows, indeks) {
  const acc = new Map();
  for (const r of rows ?? []) {
    const no = indeks.get(paraAnahtari(r.query));
    if (no === undefined) continue;
    const o = acc.get(no) ?? bosOzet();
    ekle(o, num(r.impressions), num(r.clicks), num(r.position));
    acc.set(no, o);
  }
  return acc;
}

/**
 * Türetilmiş son hafta (§0): ardışık iki çekimin farkı
 * `P_son = (G·P − G₀·P₀) / (G − G₀)`, `n = G − G₀`. Sonuç yalnız önceki
 * çekimin kendine ait günleri (~0 gösterim) temizse doğrudur; script bunu
 * denetleyemez, `n` ile birlikte yazar.
 *
 * Döner: `null` (önceki çekim yok) ya da
 * `{ durum, n, pozisyon }` — durum `"turetildi"` · `"yeni"` (önceki çekimde
 * 0 gösterim: tüm gösterim yeni pencerede) · `"yok"` (n <= 0) ·
 * `"temiz-degil"` (sonuç 1'in altında — önceki çekimin kendine ait
 * günlerinde gösterim vardı).
 */
export function sonHaftaTuret(simdi, onceki) {
  if (!onceki) return null;
  if (simdi.gosterim === 0) return { durum: "yok", n: 0, pozisyon: null };
  if (onceki.gosterim === 0) {
    return {
      durum: "yeni",
      n: simdi.gosterim,
      pozisyon: simdi.pozAgirlik / simdi.gosterim,
    };
  }
  const n = simdi.gosterim - onceki.gosterim;
  if (n <= 0) return { durum: "yok", n, pozisyon: null };
  const p = (simdi.pozAgirlik - onceki.pozAgirlik) / n;
  if (p < 1) return { durum: "temiz-degil", n, pozisyon: null };
  return { durum: "turetildi", n, pozisyon: p };
}

function bantSayilari(kayitlar) {
  const say = Object.fromEntries([
    ...BANTLAR.map((b) => [b.key, 0]),
    ["gorunmuyor", 0],
  ]);
  for (const k of kayitlar) say[k.bant ?? "gorunmuyor"] += 1;
  return say;
}

/**
 * Para seti — §E.5'in `paraSeti(sorguRows, sorguSayfaRows, onceki?)`'i.
 *
 * Her kayıt için: varyantlarla birleşik gösterim / tık / gösterim ağırlıklı
 * pozisyon (`sorgular.csv`), bant, sıralanan sayfalar (`sorgu-sayfa.csv`,
 * göst / poz), kazanan sayfanın sıralanıp sıralanmadığı ve kendi pozisyonu,
 * kanibalizasyon işareti (kazanan dışında bir sayfa sıralanıyorsa) ve
 * `onceki` (önceki çekimin `sorgular.csv` satırları) verilirse Δ poz ile
 * türetilmiş son hafta.
 *
 * @param {Record<string, string>[]} sorguRows
 * @param {Record<string, string>[]} sorguSayfaRows
 * @param {Record<string, string>[] | null} [onceki]
 * @param {{ sonHafta?: boolean }} [secenek] `sonHafta: false` — pencereler
 *   örtüşmüyorsa türetme yapılmaz, yalnız Δ.
 * @param {typeof PARA_SETI} [set] test için; varsayılan `PARA_SETI`
 * @param {typeof IZLEME_SATIRLARI} [izleme] test için; varsayılan `IZLEME_SATIRLARI`
 */
export function paraSeti(
  sorguRows,
  sorguSayfaRows,
  onceki = null,
  secenek = {},
  set = PARA_SETI,
  izleme = IZLEME_SATIRLARI
) {
  const sonHafta = secenek.sonHafta ?? true;
  const indeks = paraIndeksi(set);
  const simdi = paraTopla(sorguRows, indeks);
  const once = onceki ? paraTopla(onceki, indeks) : null;

  const sayfaAcc = new Map();
  for (const r of sorguSayfaRows ?? []) {
    const no = indeks.get(paraAnahtari(r.query));
    if (no === undefined) continue;
    const yol = sayfaYolu(r.page);
    const anahtar = `${no}\u0000${yolAnahtari(yol)}`;
    const o = sayfaAcc.get(anahtar) ?? { no, yol, ...bosOzet() };
    ekle(o, num(r.impressions), num(r.clicks), num(r.position));
    sayfaAcc.set(anahtar, o);
  }

  const kayitlar = set.map((k) => {
    const o = simdi.get(k.no) ?? bosOzet();
    const kapali = kapat(o);
    const kazananYol = yolAnahtari(k.kazananSayfa);
    const sayfalar = [...sayfaAcc.values()]
      .filter((s) => s.no === k.no)
      .map((s) => ({
        yol: s.yol,
        gosterim: s.gosterim,
        tiklama: s.tiklama,
        pozisyon: kapat(s).pozisyon,
        kazanan: yolAnahtari(s.yol) === kazananYol,
      }))
      .sort((a, b) => b.gosterim - a.gosterim || a.yol.localeCompare(b.yol));
    const kazanan = sayfalar.find((s) => s.kazanan) ?? null;
    const oncekiOzet = once ? (once.get(k.no) ?? bosOzet()) : null;
    const oncekiPoz = oncekiOzet ? kapat(oncekiOzet).pozisyon : null;
    return {
      no: k.no,
      sorgu: k.sorgu,
      hizmet: k.hizmet,
      niyet: k.niyet,
      konusma: Boolean(k.konusma),
      kazananSayfa: k.kazananSayfa,
      gosterim: kapali.gosterim,
      tiklama: kapali.tiklama,
      pozisyon: kapali.pozisyon,
      bant: bant(kapali.pozisyon),
      sayfalar,
      kazananSiralaniyor: kazanan !== null,
      kazananGosterim: kazanan?.gosterim ?? 0,
      kazananPozisyon: kazanan?.pozisyon ?? null,
      kanibalizasyon: sayfalar.some((s) => !s.kazanan),
      onceki: oncekiOzet
        ? { gosterim: oncekiOzet.gosterim, pozisyon: oncekiPoz }
        : null,
      deltaPoz:
        kapali.pozisyon !== null && oncekiPoz !== null
          ? kapali.pozisyon - oncekiPoz
          : null,
      sonHafta: oncekiOzet && sonHafta ? sonHaftaTuret(o, oncekiOzet) : null,
    };
  });

  const izlemeIndeks = new Map(
    izleme.map((s, i) => [paraAnahtari(s.sorgu), i])
  );
  const izlemeAcc = izleme.map(() => ({ ...bosOzet(), sayfalar: new Map() }));
  for (const r of sorguRows ?? []) {
    const i = izlemeIndeks.get(paraAnahtari(r.query));
    if (i === undefined) continue;
    const o = izlemeAcc[i];
    if (o) ekle(o, num(r.impressions), num(r.clicks), num(r.position));
  }
  for (const r of sorguSayfaRows ?? []) {
    const i = izlemeIndeks.get(paraAnahtari(r.query));
    if (i === undefined) continue;
    const yol = sayfaYolu(r.page);
    const m = izlemeAcc[i]?.sayfalar;
    if (m) m.set(yol, (m.get(yol) ?? 0) + num(r.impressions));
  }

  return {
    kayitlar,
    bant: bantSayilari(kayitlar),
    konusmaHaricBant: bantSayilari(kayitlar.filter((k) => !k.konusma)),
    gosterim: kayitlar.reduce((t, k) => t + k.gosterim, 0),
    tiklama: kayitlar.reduce((t, k) => t + k.tiklama, 0),
    kanibalizasyon: kayitlar.filter((k) => k.kanibalizasyon),
    oncekiVar: Boolean(onceki),
    izleme: izleme.map((s, i) => {
      const o = izlemeAcc[i] ?? { ...bosOzet(), sayfalar: new Map() };
      return {
        sorgu: s.sorgu,
        bagli: s.bagli,
        not: s.not ?? "",
        ...kapat(o),
        sayfalar: [...o.sayfalar.entries()]
          .map(([yol, gosterim]) => ({ yol, gosterim }))
          .sort((a, b) => b.gosterim - a.gosterim),
      };
    }),
  };
}

/**
 * Para sayfalarının sayfa düzeyi gösterim / tık (`sayfalar.csv`, anonim
 * sorgular dahil) — §E.2'nin tık ölçüsü. Satırı olmayan sayfa `eksik`te.
 *
 * @param {Record<string, string>[]} sayfaRows
 * @param {string[]} [liste] test için; varsayılan `PARA_SAYFALARI`
 */
export function paraSayfalari(sayfaRows, liste = PARA_SAYFALARI) {
  const hedef = new Map(liste.map((y) => [yolAnahtari(y), y]));
  const bulunan = new Map();
  for (const r of sayfaRows ?? []) {
    const yol = yolAnahtari(sayfaYolu(r.page));
    if (!hedef.has(yol)) continue;
    const o = bulunan.get(yol) ?? bosOzet();
    ekle(o, num(r.impressions), num(r.clicks), num(r.position));
    bulunan.set(yol, o);
  }
  const sayfalar = [...bulunan.entries()]
    .map(([yol, o]) => ({ yol: hedef.get(yol) ?? yol, ...kapat(o) }))
    .sort((a, b) => b.gosterim - a.gosterim || a.yol.localeCompare(b.yol));
  return {
    url: liste.length,
    gosterim: sayfalar.reduce((t, s) => t + s.gosterim, 0),
    tiklama: sayfalar.reduce((t, s) => t + s.tiklama, 0),
    sayfalar,
    eksik: liste.filter((y) => !bulunan.has(yolAnahtari(y))),
  };
}

// ------------------------------------------------------------ çıktı yazımı

const yuzde = (v) => (v === null ? "-" : `${v.toFixed(2)}%`);
const poz = (v) => (v === null ? "-" : v.toFixed(2));

/**
 * v1.18 birincil ölçülerin 30 Kasım hedefleri — otorite: strateji §9 ve
 * `docs/strateji/Yol-Haritasi-Satin-Alma-Niyeti-2026-09.md` §5. Tık hedefi
 * aylıktır; çekim penceresi 28 gün olduğu için doğrudan kıyaslanır. Form
 * (GA4) ve GEO turu (elle) bu script'in dışında ölçülür.
 */
export const NIYET_HEDEF = { ilk10: 12, hizmetSayfasiPay: 15, tiklama: 20 };

/**
 * `kumeler.csv` — G1-G5 + K-4 ayrı satırı; `niyet` ve `hs` verilirse N0
 * satırları ve hizmet sayfası satırı EN SONA eklenir (önceki satırların sırası
 * ve değeri değişmez, haftalık log kıyaslanabilir kalır).
 *
 * @param {ReturnType<typeof sorguKumeleri>} sorgu
 * @param {ReturnType<typeof ulkeKumeleri>} ulke
 * @param {ReturnType<typeof niyetKumesi> | null} [niyet]
 * @param {ReturnType<typeof hizmetSayfasiPayi> | null} [hs]
 */
export function kumelerCsv(sorgu, ulke, niyet = null, hs = null) {
  const satirlar = [
    [
      "kume",
      "etiket",
      "olcum_birimi",
      "kayit",
      "gosterim",
      "tiklama",
      "ctr",
      "agirlikli_pozisyon",
    ],
  ];
  const yaz = (key, etiket, birim, o) =>
    satirlar.push([
      key,
      etiket,
      birim,
      o.kayit,
      o.gosterim,
      o.tiklama,
      yuzde(o.ctr),
      poz(o.pozisyon),
    ]);
  for (const kume of SORGU_KUMELERI) {
    yaz(kume.key, kume.label, "sorgu", sorgu[kume.key]);
  }
  yaz("G5", "TR dışı", "ülke", ulke.G5);
  yaz("TR", "TR içi (referans)", "ülke", ulke.TR);
  yaz("K4", "Kariyer niyetli (KPI dışı)", "sorgu", sorgu.K4);
  if (niyet) {
    yaz("N0", "Satın alma niyeti", "sorgu", niyet);
    for (const h of NIYET_HIZMETLERI) {
      yaz(`N0-${h.key}`, `Niyet · ${h.label}`, "sorgu", niyet.alt[h.key]);
    }
  }
  if (hs) {
    yaz(
      "HS",
      "Hizmet sayfaları (/tr/hizmetler/*, /en/services/*)",
      "sayfa",
      hs
    );
  }
  return toCsv(satirlar);
}

/**
 * A-4 (v1.18): üç GSC ölçüsünün 30 Kasım hedefine göre durumu. Form (GA4) ve
 * GEO turu bu hesaba girmez — script onları göremez.
 */
export function a4Niyet(niyet, hs) {
  const ilk10 = niyet.ilk10.length;
  const olcu = [
    ilk10 < NIYET_HEDEF.ilk10,
    hs.pay < NIYET_HEDEF.hizmetSayfasiPay,
    niyet.tiklama < NIYET_HEDEF.tiklama,
  ];
  return {
    ilk10,
    pay: hs.pay,
    tiklama: niyet.tiklama,
    altinda: olcu.filter(Boolean).length,
  };
}

/** `ozet.txt`'in "Satın alma niyeti" bölümü — satır dizisi döner. */
export function niyetBolumu({ niyet, hs, toplamGosterim }) {
  const L = [];
  const toplamPay =
    toplamGosterim > 0 ? (niyet.gosterim / toplamGosterim) * 100 : 0;
  const etiket = Object.fromEntries(
    NIYET_HIZMETLERI.map((h) => [h.key, h.label])
  );
  L.push("## Satın alma niyeti (N0) — v1.18 birincil ölçüler");
  L.push("");
  L.push(
    "Tanım: TR niteleyici (ajansı, danışmanlığı, firması, uzmanı, hizmeti, fiyat, nasıl seçilir, önerir misin, en iyi … kimlerdir) + altı hizmetten birinin terimi (GEO, CRO, yapay zeka, UX, e-ticaret, dijital dönüşüm). Genel reklam/pazarlama ajansı, kariyer ve araç niyeti dışarıda. Otorite: docs/strateji/Niyetli-Sorgu-Seti-2026-09.md."
  );
  L.push("");
  L.push("| Ölçü | Bu çekim | 30 Kasım hedefi |");
  L.push("|---|---|---|");
  L.push(
    `| Niyetli sorgu | ${niyet.kayit} sorgu / ${niyet.gosterim} gösterim / ${niyet.tiklama} tık / ort. poz ${poz(niyet.pozisyon)} | — |`
  );
  L.push(
    `| Görünen sorgu gösterimindeki payı | ${yuzde(niyet.pay)} (${niyet.gosterim} / ${niyet.gorunenGosterim}) | — |`
  );
  L.push(
    `| Toplam gösterimdeki payı (anonim dahil) | ${yuzde(toplamPay)} (${niyet.gosterim} / ${toplamGosterim}) | — |`
  );
  L.push(
    `| İlk 10'daki niyetli sorgu (ort. poz <= ${ILK10_ESIK}) | ${niyet.ilk10.length} | ${NIYET_HEDEF.ilk10}+ |`
  );
  L.push(
    `| Niyetli sorgulardan tık | ${niyet.tiklama} | ${NIYET_HEDEF.tiklama}+/ay |`
  );
  L.push(
    `| Hizmet sayfalarının gösterim payı (/tr/hizmetler/*, /en/services/*) | ${yuzde(hs.pay)} (${hs.gosterim} / ${hs.toplam}, ${hs.kayit} sayfa) | %${NIYET_HEDEF.hizmetSayfasiPay} |`
  );
  L.push("");
  L.push(
    "Form/brief (GA4, hedef ayda 5+ nitelikli) ve GEO turu (30 sorgu, hedef 5/30) bu raporun dışında ölçülür; haftalık kayda elle eklenir."
  );
  L.push("");
  L.push("| Hizmet | Kayıt | Gösterim | Tıklama | Ort. poz | İlk 10 |");
  L.push("|---|---|---|---|---|---|");
  for (const h of NIYET_HIZMETLERI) {
    const o = niyet.alt[h.key];
    L.push(
      `| ${h.label} | ${o.kayit} sorgu | ${o.gosterim} | ${o.tiklama} | ${poz(o.pozisyon)} | ${o.ilk10} |`
    );
  }
  L.push("");
  const satir = (s) =>
    `  - ${s.query} — ${etiket[s.hizmet]} · ${s.gosterim} gösterim · ${s.tiklama} tık · poz ${s.pozisyon.toFixed(2)}`;
  L.push(`İlk 10'daki niyetli sorgular (${niyet.ilk10.length}):`);
  if (niyet.ilk10.length === 0) L.push("  - yok");
  for (const s of niyet.ilk10) L.push(satir(s));
  L.push("");
  L.push(
    `Niyetli sorgular, gösterime göre (${Math.min(20, niyet.sorgular.length)} / ${niyet.sorgular.length}):`
  );
  for (const s of niyet.sorgular.slice(0, 20)) L.push(satir(s));
  L.push("");
  L.push("En yüksek gösterimli 5 hizmet sayfası:");
  for (const s of hs.sayfalar.slice(0, 5)) {
    L.push(`  - ${s.path} — ${s.gosterim} gösterim · ${s.tiklama} tık`);
  }
  L.push("");
  return L;
}

/** `YYYY-MM-DD` + n gün; tarih geçersizse `null`. */
function gunKaydir(iso, n) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso ?? ""))) return null;
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return null;
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/**
 * Şimdiki ve önceki çekimin pencerelerinden türetmenin pencerelerini kurar:
 * `son` = önceki çekimin bitişinden sonraki günler → şimdiki bitiş;
 * `oncekiYalniz` = önceki çekimin başlangıcı → şimdiki başlangıçtan önceki
 * gün (temizlik koşulu bu günlerde ~0 gösterimdir, §0). Pencereler
 * örtüşmüyorsa `ortusuyor: false` — türetme yapılmaz.
 */
export function turetmePenceresi({ start, end, oncekiStart, oncekiEnd }) {
  const sonIlk = gunKaydir(oncekiEnd, 1);
  const yalnizSon = gunKaydir(start, -1);
  if (!sonIlk || !yalnizSon || !end || !oncekiStart || !start) {
    return { ortusuyor: true, son: null, oncekiYalniz: null };
  }
  return {
    ortusuyor: oncekiEnd >= start && oncekiEnd < end,
    son: `${sonIlk}→${end}`,
    oncekiYalniz: `${oncekiStart}→${yalnizSon}`,
  };
}

const bantMetni = (say) => {
  const L = BANTLAR.map((b) => `${b.label} ${say[b.key]}`);
  if (say.gorunmuyor > 0) L.push(`görünmüyor ${say.gorunmuyor}`);
  return L.join(" · ");
};

const bazBant = (say) => BANTLAR.map((b) => say[b.key]).join(" · ");

function deltaPozMetni(k, oncekiVar) {
  if (!oncekiVar) return "—";
  if (k.deltaPoz !== null) {
    return `${k.deltaPoz > 0 ? "+" : ""}${k.deltaPoz.toFixed(2)}`;
  }
  if (k.pozisyon !== null) return "yeni";
  if (k.onceki?.pozisyon != null) return "kayboldu";
  return "—";
}

function sonHaftaMetni(s) {
  if (!s) return "—";
  if (s.durum === "yeni") return `yeni ≈${poz(s.pozisyon)} (n=${s.n})`;
  if (s.durum === "temiz-degil") return `türetilemez (n=${s.n})`;
  if (s.durum !== "turetildi") return "—";
  return `≈${poz(s.pozisyon)} (n=${s.n}${s.n < 10 ? ", bağlam" : ""})`;
}

const sayfaMetni = (s) => `${s.yol} (${s.gosterim} / ${poz(s.pozisyon)})`;

/**
 * Tablonun "Not" sütunu — kanibalizasyon, kazanan durumu, okuma kuralları.
 * Eski URL: yolu `/tr` ya da `/en` ile başlamayan sayfa (`eskiUrlPayi` ile
 * aynı tanım).
 */
function paraNotu(k) {
  const notlar = [];
  const eskiVar = k.sayfalar.some((s) => !/^\/(tr|en)(\/|$)/.test(s.yol));
  if (k.gosterim === 0) notlar.push("görünmüyor");
  else if (k.sayfalar.length === 0) notlar.push("sayfa satırı yok");
  else if (!k.kazananSiralaniyor) {
    notlar.push(
      `kazanan sıralanmıyor${eskiVar ? " (eski URL sıralanıyor)" : ""}`
    );
  } else if (k.kanibalizasyon) {
    notlar.push(
      `bölünmüş (A-6) — kazanan ${k.kazananGosterim} / ${poz(k.kazananPozisyon)}`
    );
  }
  if (k.konusma) notlar.push("konuşma biçimli");
  if (k.gosterim > 0 && k.gosterim <= 5) notlar.push("≤5 göst, yalnız izlenir");
  return notlar.join("; ");
}

/**
 * `ozet.txt`'in "Para seti (İlk 3 programı)" bölümü — plan §E.1 biçimi;
 * haftalık log'a "### Para seti …" başlığıyla kopyalanır. Satır dizisi döner.
 *
 * @param {{ para: ReturnType<typeof paraSeti>, sayfa: ReturnType<typeof paraSayfalari>, pencere?: { onceki?: string | null, ortusuyor?: boolean, son?: string | null, oncekiYalniz?: string | null } }} p
 */
export function paraSetiBolumu({ para, sayfa, pencere = {} }) {
  const L = [];
  const baz = PARA_SETI_BAZ;
  const bazAd = `${baz.etiket} baz`;
  L.push("## Para seti (İlk 3 programı)");
  L.push("");
  L.push(`Bant: ${bantMetni(para.bant)}   (${bazAd}: ${bazBant(baz.bant)})`);
  L.push(
    `Para seti: ${para.gosterim} göst / ${para.tiklama} tık   (${bazAd}: ${baz.gosterim} / ${baz.tiklama})`
  );
  L.push(
    `Para sayfaları sayfa düzeyi (${sayfa.url} URL): ${sayfa.gosterim} / ${sayfa.tiklama}   (${bazAd}: ${baz.paraSayfalari.gosterim} / ${baz.paraSayfalari.tiklama})`
  );
  L.push(
    `Konuşma biçimli 2 sorgu hariç bant: ${bantMetni(para.konusmaHaricBant)}   (${bazAd}: ${bazBant(baz.konusmaHaricBant)})`
  );
  L.push(
    `Kanibalizasyon (kazanan dışı sayfa sıralanıyor): ${para.kanibalizasyon.length} sorgu${para.kanibalizasyon.length ? ` — ${para.kanibalizasyon.map((k) => `#${k.no}`).join(", ")}` : ""}`
  );
  L.push("");
  L.push(
    "| # | Sorgu | Kazanan sayfa | Göst | Poz | Tık | Bant | Δ poz (önceki) | Son hafta (türetilmiş) | Sıralanan sayfa(lar) | Not |"
  );
  L.push("|---|---|---|---|---|---|---|---|---|---|---|");
  const bantEtiketi = Object.fromEntries(BANTLAR.map((b) => [b.key, b.label]));
  for (const k of para.kayitlar) {
    L.push(
      `| ${k.no} | ${k.sorgu} | ${k.kazananSayfa} | ${k.gosterim} | ${poz(k.pozisyon)} | ${k.tiklama} | ${k.bant ? bantEtiketi[k.bant] : "—"} | ${deltaPozMetni(k, para.oncekiVar)} | ${sonHaftaMetni(k.sonHafta)} | ${k.sayfalar.map(sayfaMetni).join(" · ") || "—"} | ${paraNotu(k) || "—"} |`
    );
  }
  L.push("");
  L.push(
    "Tanım: docs/strateji/Ilk-3-Programi-2026-10.md §A.2 (15 sorgu), §A.3/§B.3 (kazanan sayfa), §0 (bant ve türetme); veri scripts/para-seti.mjs. Pozisyon gösterim ağırlıklı; soru işaretli/işaretsiz yazım tek sorgu. Bant: ilk 3 ≤ 3,0 · 4-10 ≤ 10,0 · 11-20 ≤ 20,0 · 20+. ≤5 gösterimli sorgudan karar çıkmaz (§E.6)."
  );
  if (para.oncekiVar && pencere.ortusuyor === false) {
    L.push(
      `Önceki çekim: ${pencere.onceki ?? "-"}. Pencereler örtüşmüyor — yalnız Δ poz; son hafta türetilmedi (§0).`
    );
  } else if (para.oncekiVar) {
    const son = pencere.son ? ` · son pencere ${pencere.son}` : "";
    const temiz = pencere.oncekiYalniz
      ? `önceki çekimin kendine ait günlerinde (${pencere.oncekiYalniz}) ~0 gösterim`
      : "önceki çekimin kendine ait günlerinde ~0 gösterim";
    L.push(
      `Önceki çekim: ${pencere.onceki ?? "-"}${son}. Son hafta = (G·P − G₀·P₀) / (G − G₀), n = G − G₀; doğruluk koşulu ${temiz} — script denetlemez. Karar girdisi yalnız n ≥ 10 ve temizken (§0, §E.6).`
    );
  } else {
    L.push("Önceki çekim verilmedi (--prev): Δ poz ve son hafta yok.");
  }
  L.push("");
  L.push("Varyantlar ve izleme satırları (puanlanmaz, §A.4):");
  const setAd = Object.fromEntries(para.kayitlar.map((k) => [k.no, k.sorgu]));
  for (const s of para.izleme) {
    const bag =
      s.bagli !== null ? `→ #${s.bagli} ${setAd[s.bagli] ?? ""}` : s.not;
    const veri =
      s.gosterim > 0
        ? `${s.gosterim} göst · ${s.tiklama} tık · poz ${poz(s.pozisyon)}${s.sayfalar.length ? ` · ${s.sayfalar.map((x) => x.yol).join(", ")}` : ""}`
        : "görünmüyor";
    L.push(`  - ${s.sorgu} (${bag}) — ${veri}`);
  }
  L.push("");
  L.push(
    `Para sayfaları, sayfa düzeyi (göst / tık / poz; ${sayfa.sayfalar.length} / ${sayfa.url} URL satırlı):`
  );
  for (const s of sayfa.sayfalar) {
    L.push(`  - ${s.yol} — ${s.gosterim} / ${s.tiklama} / ${poz(s.pozisyon)}`);
  }
  if (sayfa.eksik.length) L.push(`  - satırsız: ${sayfa.eksik.join(", ")}`);
  L.push("");
  return L;
}

/** `para-seti.csv` — tablonun makine okunur hali (`csvCell` kaçışıyla). */
export function paraSetiCsv(para) {
  const yuvarla = (v) => (v === null ? "-" : Number(v.toFixed(2)));
  const satirlar = [
    [
      "no",
      "sorgu",
      "hizmet",
      "niyet",
      "konusma",
      "kazanan_sayfa",
      "gosterim",
      "tiklama",
      "pozisyon",
      "bant",
      "kazanan_siralaniyor",
      "kazanan_gosterim",
      "kazanan_pozisyon",
      "kanibalizasyon",
      "siralanan_sayfalar",
      "onceki_gosterim",
      "onceki_pozisyon",
      "delta_poz",
      "son_hafta_durum",
      "son_hafta_n",
      "son_hafta_pozisyon",
      "not",
    ],
  ];
  for (const k of para.kayitlar) {
    satirlar.push([
      k.no,
      k.sorgu,
      k.hizmet,
      k.niyet,
      k.konusma ? 1 : 0,
      k.kazananSayfa,
      k.gosterim,
      k.tiklama,
      poz(k.pozisyon),
      k.bant ?? "-",
      k.kazananSiralaniyor ? 1 : 0,
      k.kazananGosterim,
      poz(k.kazananPozisyon),
      k.kanibalizasyon ? 1 : 0,
      k.sayfalar.map(sayfaMetni).join("; ") || "-",
      k.onceki ? k.onceki.gosterim : "-",
      k.onceki ? poz(k.onceki.pozisyon) : "-",
      yuvarla(k.deltaPoz),
      k.sonHafta?.durum ?? "-",
      k.sonHafta ? k.sonHafta.n : "-",
      k.sonHafta ? poz(k.sonHafta.pozisyon) : "-",
      paraNotu(k) || "-",
    ]);
  }
  return toCsv(satirlar);
}

/** `ozet.txt` — `GSC-Data/haftalik-log.md` kaydına doğrudan kopyalanabilir. */
export function ozetMetni({
  site,
  start,
  end,
  gunluk,
  sorgu,
  ulke,
  eski,
  a3,
  a6,
  niyet = null,
  hs = null,
  para = null,
}) {
  const delta = (a, b) => {
    const d = a - b;
    return `${d >= 0 ? "+" : ""}${d}`;
  };
  const L = [];
  L.push(`# GSC haftalık özet — ${site}`);
  L.push(`Çekim aralığı: ${start} → ${end} · dataState=final`);
  L.push(
    "Otorite: docs/strateji/Keyword-Onceliklendirme-2026-08-27.md §4 (kümeler ve alarm eşikleri)."
  );
  L.push("");
  L.push("## Haftalık toplam");
  L.push("");
  L.push("| Metrik | Son 7 gün | Önceki 7 gün | Delta |");
  L.push("|---|---|---|---|");
  L.push(
    `| Pencere | ${gunluk.son7.ilk}→${gunluk.son7.son} | ${gunluk.onceki7.ilk}→${gunluk.onceki7.son} | — |`
  );
  L.push(
    `| Gösterim | ${gunluk.son7.gosterim} | ${gunluk.onceki7.gosterim} | ${delta(gunluk.son7.gosterim, gunluk.onceki7.gosterim)} |`
  );
  L.push(
    `| Tıklama | ${gunluk.son7.tiklama} | ${gunluk.onceki7.tiklama} | ${delta(gunluk.son7.tiklama, gunluk.onceki7.tiklama)} |`
  );
  L.push(
    `| Ort. pozisyon | ${poz(gunluk.son7.pozisyon)} | ${poz(gunluk.onceki7.pozisyon)} | — |`
  );
  L.push(
    `| CTR | ${yuzde(gunluk.son7.ctr)} | ${yuzde(gunluk.onceki7.ctr)} | — |`
  );
  L.push("");
  L.push(
    `Dönem toplamı (${gunluk.donem.ilk}→${gunluk.donem.son}): ${gunluk.donem.gosterim} gösterim / ${gunluk.donem.tiklama} tıklama / CTR ${yuzde(gunluk.donem.ctr)}.`
  );
  L.push("");
  L.push("## G1-G5 küme taraması");
  L.push("");
  L.push("| Küme | Kayıt | Gösterim | Tıklama | Ort. poz |");
  L.push("|---|---|---|---|---|");
  for (const kume of SORGU_KUMELERI) {
    const o = sorgu[kume.key];
    L.push(
      `| ${kume.key} ${kume.label} | ${o.kayit} sorgu | ${o.gosterim} | ${o.tiklama} | ${poz(o.pozisyon)} |`
    );
  }
  L.push(
    `| G5 TR dışı | ${ulke.G5.kayit} ülke | ${ulke.G5.gosterim} | ${ulke.G5.tiklama} | — |`
  );
  L.push(
    `| TR içi (referans) | — | ${ulke.TR.gosterim} | ${ulke.TR.tiklama} | ${poz(ulke.TR.pozisyon)} |`
  );
  L.push("");
  L.push(
    `Ayrı satır (KPI'ya sayılmaz, K-4 kararı): "iş zekası" + "işletme mühendisliği" — ${sorgu.K4.gosterim} gösterim / ${sorgu.K4.kayit} sorgu.`
  );
  L.push("");
  if (niyet && hs) {
    L.push(
      ...niyetBolumu({ niyet, hs, toplamGosterim: gunluk.donem.gosterim })
    );
  }
  if (para) L.push(...paraSetiBolumu(para));
  L.push(
    `## A-3 adayları (poz<10 & CTR<%1 & gösterim>=20) — ${a3.length} sayfa`
  );
  L.push("");
  if (a3.length === 0) {
    L.push("Aday yok.");
  } else {
    L.push("| Sayfa | Gösterim | Poz | CTR |");
    L.push("|---|---|---|---|");
    for (const s of a3) {
      L.push(
        `| ${s.path} | ${s.gosterim} | ${s.pozisyon.toFixed(2)} | ${s.ctr.toFixed(2)}% |`
      );
    }
  }
  L.push("");
  L.push("## Konsolidasyon takibi");
  L.push("");
  L.push(
    `Eski URL payı (yolu /tr veya /en ile başlamayan sayfalar): **${eski.pay.toFixed(1)}%** (${eski.eski} / ${eski.toplam}, ${eski.sayfa} sayfa).`
  );
  L.push("");
  L.push("En yüksek gösterimli 10 eski URL:");
  for (const s of eski.eskiSayfalar.slice(0, 10)) {
    L.push(`  - ${s.path} — ${s.gosterim}`);
  }
  L.push("");
  L.push(`## A-6 kanibalizasyon — ${a6.length} sorguda birden fazla sayfa`);
  L.push("");
  for (const s of a6.slice(0, 10)) {
    L.push(`  - ${s.query} — ${s.sayfa} sayfa / ${s.gosterim} gösterim`);
  }
  L.push("");
  L.push("## Alarm durumu (mekanik kontroller)");
  L.push("");
  L.push(
    `  - A-3 (CTR): ${a3.length} sayfa eşiği aşıyor — title/description revizyonu.`
  );
  if (niyet && hs) {
    const a4 = a4Niyet(niyet, hs);
    L.push(
      `  - A-4 (niyetli görünürlük, v1.18): 30 Kasım hedefinin altında ${a4.altinda}/3 ölçü — ilk 10'da niyetli sorgu ${a4.ilk10}/${NIYET_HEDEF.ilk10} · hizmet sayfası payı ${yuzde(a4.pay)}/%${NIYET_HEDEF.hizmetSayfasiPay} · niyetli tık ${a4.tiklama}/${NIYET_HEDEF.tiklama}. Alarm 30 Kasım kaydında değerlendirilir: 3 ölçüden 2'si hedefin altındaysa strateji revizyonu. Toplam gösterim bağlamdır, eşik değil: ${gunluk.donem.gosterim}.`
    );
  } else {
    L.push(
      `  - A-4 (gösterim eğrisi): dönem toplamı ${gunluk.donem.gosterim}; eşik 8.000/ay — ${gunluk.donem.gosterim < 8000 ? "ALTINDA" : "üstünde"}.`
    );
  }
  L.push(`  - A-6 (kanibalizasyon): ${a6.length} sorgu.`);
  L.push(
    "  - A-1 / A-2 / A-5: elle değerlendirilir (301 haritası, indeks taraması, GEO prompt turu)."
  );
  L.push("");
  return L.join("\n");
}

/**
 * Varsa `meta.txt`'ten `site` / `start` / `end` okur — `--from-dir` ile eski
 * bir klasör verildiğinde özetin başlığı doğru mülkü ve aralığı göstersin.
 */
function metaOku(dir) {
  try {
    const satirlar = readFileSync(join(dir, "meta.txt"), "utf8").split("\n");
    const out = {};
    for (const satir of satirlar) {
      const m = /^(site|start|end):\s*(.+)$/.exec(satir.trim());
      if (m) out[m[1]] = m[2];
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * Önceki çekim klasörünün para seti girdisi: `sorgular.csv` ve pencere.
 * Klasör verilip CSV yoksa hata — Δ'nın sessizce boş kalmasından iyidir.
 */
function oncekiCekim(prevDir) {
  if (!prevDir) return null;
  const dosya = join(prevDir, "sorgular.csv");
  if (!existsSync(dosya)) {
    throw new Error(`--prev klasöründe sorgular.csv yok: ${prevDir}`);
  }
  return {
    ad: basename(prevDir),
    meta: metaOku(prevDir),
    sorgular: readCsvFile(dosya),
  };
}

/**
 * Bir çıktı klasöründeki CSV'lerden küme hesabını yapar ve
 * `kumeler.csv` + `para-seti.csv` + `ozet.txt` üretir. API'ye hiç dokunmaz.
 * `prevDir` verilirse para setinde Δ poz ve türetilmiş son hafta hesaplanır.
 *
 * @param {string} fromDir
 * @param {string} outDir
 * @param {{ site?: string, start?: string, end?: string }} [meta]
 * @param {string | null} [prevDir] önceki çekim klasörü (`--prev`)
 */
export function kumeHesabi(fromDir, outDir, meta = {}, prevDir = null) {
  const bilgi = { ...metaOku(fromDir), ...meta };
  const sorgular = readCsvFile(join(fromDir, "sorgular.csv"));
  const sayfalar = readCsvFile(join(fromDir, "sayfalar.csv"));
  const ulkeler = readCsvFile(join(fromDir, "ulkeler.csv"));
  const gunlukRows = readCsvFile(join(fromDir, "gunluk.csv"));
  const sorguSayfa = readCsvFile(join(fromDir, "sorgu-sayfa.csv"));

  const sorgu = sorguKumeleri(sorgular);
  const ulke = ulkeKumeleri(ulkeler);
  const eski = eskiUrlPayi(sayfalar);
  const a3 = a3Adaylari(sayfalar);
  const a6 = a6Kanibalizasyon(sorguSayfa);
  const gunluk = gunlukOzet(gunlukRows);
  const niyet = niyetKumesi(sorgular);
  const hs = hizmetSayfasiPayi(sayfalar);

  const onceki = oncekiCekim(prevDir);
  const pencere = onceki
    ? turetmePenceresi({
        start: bilgi.start,
        end: bilgi.end,
        oncekiStart: onceki.meta.start,
        oncekiEnd: onceki.meta.end,
      })
    : null;
  const para = {
    para: paraSeti(sorgular, sorguSayfa, onceki?.sorgular ?? null, {
      sonHafta: pencere?.ortusuyor ?? true,
    }),
    sayfa: paraSayfalari(sayfalar),
    pencere: {
      onceki: onceki
        ? `${onceki.ad} (${onceki.meta.start ?? "-"} → ${onceki.meta.end ?? "-"})`
        : null,
      ortusuyor: pencere?.ortusuyor ?? true,
      son: pencere?.son ?? null,
      oncekiYalniz: pencere?.oncekiYalniz ?? null,
    },
  };

  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    join(outDir, "kumeler.csv"),
    kumelerCsv(sorgu, ulke, niyet, hs),
    "utf8"
  );
  writeFileSync(join(outDir, "para-seti.csv"), paraSetiCsv(para.para), "utf8");
  writeFileSync(
    join(outDir, "ozet.txt"),
    ozetMetni({
      site: bilgi.site ?? "-",
      start: bilgi.start ?? gunluk.donem.ilk,
      end: bilgi.end ?? gunluk.donem.son,
      gunluk,
      sorgu,
      ulke,
      eski,
      a3,
      a6,
      niyet,
      hs,
      para,
    }),
    "utf8"
  );
  return { sorgu, ulke, eski, a3, a6, gunluk, niyet, hs, para };
}

// ------------------------------------------------------------------- API

async function api(token, path, body) {
  const res = await fetch(`https://www.googleapis.com/webmasters/v3${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`API hatası ${path}: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

async function queryAll(token, site, dimensions, start, end) {
  const rows = [];
  let startRow = 0;
  const ROW_LIMIT = 25000;
  for (;;) {
    const data = await api(
      token,
      `/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
      {
        startDate: start,
        endDate: end,
        dimensions,
        rowLimit: ROW_LIMIT,
        startRow,
        dataState: "final",
      }
    );
    const batch = data.rows ?? [];
    rows.push(...batch);
    if (batch.length < ROW_LIMIT) break;
    startRow += ROW_LIMIT;
  }
  return rows;
}

function writeSetCsv(outDir, file, dimensions, rows) {
  const header = [...dimensions, "clicks", "impressions", "ctr", "position"];
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [
        ...(r.keys ?? []).map(csvCell),
        r.clicks,
        r.impressions,
        (r.ctr * 100).toFixed(2) + "%",
        r.position.toFixed(2),
      ].join(",")
    );
  }
  writeFileSync(join(outDir, file), lines.join("\n") + "\n", "utf8");
  console.log(`  ${file}: ${rows.length} satır`);
}

function isoDaysAgo(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

/** Küme hesabının konsol özeti — iki çalışma kipinde de aynı satırlar. */
function konsolOzeti({ sorgu, ulke, eski, a3, niyet, hs, para }) {
  for (const kume of SORGU_KUMELERI) {
    const o = sorgu[kume.key];
    console.log(
      `  ${kume.key} ${kume.label}: ${o.kayit} sorgu / ${o.gosterim} gösterim / ${o.tiklama} tık / poz ${poz(o.pozisyon)}`
    );
  }
  console.log(
    `  G5 TR dışı: ${ulke.G5.kayit} ülke / ${ulke.G5.gosterim} gösterim / ${ulke.G5.tiklama} tık`
  );
  console.log(
    `  Eski URL payı: ${eski.pay.toFixed(1)}% (${eski.eski} / ${eski.toplam}, ${eski.sayfa} sayfa)`
  );
  console.log(`  A-3 adayı: ${a3.length} sayfa`);
  console.log(
    `  N0 Satın alma niyeti: ${niyet.kayit} sorgu / ${niyet.gosterim} gösterim / ${niyet.tiklama} tık / poz ${poz(niyet.pozisyon)} · ilk 10'da ${niyet.ilk10.length} · görünen sorgu payı ${yuzde(niyet.pay)}`
  );
  console.log(
    `  Hizmet sayfası payı: ${yuzde(hs.pay)} (${hs.gosterim} / ${hs.toplam}, ${hs.kayit} sayfa)`
  );
  const b = para.para.bant;
  console.log(
    `  Para seti: bant ${BANTLAR.map((x) => b[x.key]).join(" / ")}${b.gorunmuyor ? ` (+${b.gorunmuyor} görünmüyor)` : ""} · ${para.para.gosterim} göst / ${para.para.tiklama} tık · para sayfaları ${para.sayfa.gosterim} / ${para.sayfa.tiklama}${para.pencere.onceki ? ` · önceki ${para.pencere.onceki}` : ""}`
  );
}

async function main() {
  const fromDir = arg("from-dir");
  // --prev: para setinde Δ poz ve türetilmiş son hafta için önceki çekim.
  // API çekiminden önce doğrulanır — çekim bittikten sonra patlamasın.
  const prevDir = arg("prev");
  if (prevDir) oncekiCekim(prevDir);

  // --from-dir: API'ye hiç dokunmadan mevcut CSV'lerden küme hesabı.
  if (fromDir) {
    const outDir = arg("out", fromDir);
    console.log(`GSC küme hesabı (API'siz) · kaynak ${fromDir}`);
    konsolOzeti(kumeHesabi(fromDir, outDir, {}, prevDir));
    console.log(`Tamam → ${outDir}`);
    return;
  }

  // GSC verisi ~2-3 gün gecikmeli gelir; end varsayılanı bugün-3.
  const start = arg("start", isoDaysAgo(31));
  const end = arg("end", isoDaysAgo(3));
  const keyPath = resolveKeyPath();
  const siteArg = arg("site", DEFAULT_SITE);
  const outDir = arg("out", join(resolveGscDataBase(), `haftalik-${bugun()}`));

  console.log(`GSC Pull · ${start} → ${end}`);
  console.log(`Anahtar: ${keyPath}`);
  const token = await getAccessToken(keyPath, SCOPE);

  // Erişilebilir mülkler her koşuda loglanır — seçim buna göre DEĞİŞMEZ.
  let entries = [];
  try {
    entries = (await api(token, "/sites")).siteEntry ?? [];
    console.log(
      `Erişilebilir mülkler (${entries.length}): ${entries.map((e) => e.siteUrl).join(", ")}`
    );
  } catch (e) {
    console.warn(`Uyarı: mülk listesi alınamadı — ${e.message}`);
  }

  let site = siteArg;
  if (siteArg === "auto") {
    if (entries.length === 0) {
      throw new Error(
        "--site auto istendi ama mülk listesi boş — servis hesabı GSC > Ayarlar > Kullanıcılar'a eklenmiş mi?"
      );
    }
    site =
      entries.find((e) => e.siteUrl.startsWith("sc-domain:"))?.siteUrl ??
      entries[0].siteUrl;
    console.warn(`Uyarı: --site auto seçildi → ${site}`);
  } else if (entries.length > 0 && !entries.some((e) => e.siteUrl === site)) {
    console.warn(
      `Uyarı: ${site} erişilebilir mülk listesinde yok — çekim muhtemelen 403 dönecek.`
    );
  }
  console.log(`Mülk: ${site}`);

  mkdirSync(outDir, { recursive: true });

  const sets = [
    ["gunluk.csv", ["date"]],
    ["sorgular.csv", ["query"]],
    ["sayfalar.csv", ["page"]],
    ["sorgu-sayfa.csv", ["query", "page"]],
    ["ulkeler.csv", ["country"]],
  ];
  for (const [file, dims] of sets) {
    writeSetCsv(
      outDir,
      file,
      dims,
      await queryAll(token, site, dims, start, end)
    );
  }

  writeFileSync(
    join(outDir, "meta.txt"),
    `site: ${site}\nstart: ${start}\nend: ${end}\ndataState: final\nolusturma: ${new Date().toISOString()}\n`,
    "utf8"
  );

  console.log("Küme özeti:");
  konsolOzeti(kumeHesabi(outDir, outDir, { site, start, end }, prevDir));
  console.log(`Tamam → ${outDir}`);
}

// Yalnız doğrudan çalıştırıldığında koşar; import edildiğinde yan etki yok.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
