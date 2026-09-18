#!/usr/bin/env node
/**
 * GSC Pull — Search Console verisini service account ile çeker, CSV döker ve
 * G1-G5 küme özetini hesaplar.
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
 * ulkeler.csv · kumeler.csv · ozet.txt · meta.txt — hepsi UTF-8.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
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

// ------------------------------------------------------------ çıktı yazımı

const yuzde = (v) => (v === null ? "-" : `${v.toFixed(2)}%`);
const poz = (v) => (v === null ? "-" : v.toFixed(2));

/** `kumeler.csv` — G1-G5 + K-4 ayrı satırı. */
export function kumelerCsv(sorgu, ulke) {
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
  L.push(
    `  - A-4 (gösterim eğrisi): dönem toplamı ${gunluk.donem.gosterim}; eşik 8.000/ay — ${gunluk.donem.gosterim < 8000 ? "ALTINDA" : "üstünde"}.`
  );
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
 * Bir çıktı klasöründeki CSV'lerden küme hesabını yapar ve
 * `kumeler.csv` + `ozet.txt` üretir. API'ye hiç dokunmaz.
 */
export function kumeHesabi(fromDir, outDir, meta = {}) {
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

  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "kumeler.csv"), kumelerCsv(sorgu, ulke), "utf8");
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
    }),
    "utf8"
  );
  return { sorgu, ulke, eski, a3, a6, gunluk };
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

async function main() {
  const fromDir = arg("from-dir");

  // --from-dir: API'ye hiç dokunmadan mevcut CSV'lerden küme hesabı.
  if (fromDir) {
    const outDir = arg("out", fromDir);
    console.log(`GSC küme hesabı (API'siz) · kaynak ${fromDir}`);
    const { sorgu, ulke, eski, a3 } = kumeHesabi(fromDir, outDir);
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

  const { sorgu, ulke, eski, a3 } = kumeHesabi(outDir, outDir, {
    site,
    start,
    end,
  });
  console.log("Küme özeti:");
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
  console.log(`Tamam → ${outDir}`);
}

// Yalnız doğrudan çalıştırıldığında koşar; import edildiğinde yan etki yok.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
