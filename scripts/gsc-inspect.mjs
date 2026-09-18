#!/usr/bin/env node
/**
 * GSC URL Inspection — kilit URL'lerin indeks durumunu toplu sorgular.
 *
 * Sıfır bağımlılık: Node 22+ (fetch + crypto). Ortak altyapı
 * `scripts/gsc-ortak.mjs`'te.
 *
 * Kullanım:
 *   node scripts/gsc-inspect.mjs                          # kilit liste
 *   node scripts/gsc-inspect.mjs --urls-file liste.txt    # başka liste
 *   node scripts/gsc-inspect.mjs https://.../a https://.../b
 *   node scripts/gsc-inspect.mjs --out /tmp/gsc-test [--key ...] [--site ...]
 *
 * Varsayılanlar: liste `scripts/gsc-kilit-urller.txt` · mülk
 * `https://www.indoles.com.tr/` · çıktı `GSC-Data/indeks-<bugün>.csv`.
 *
 * Kota: URL Inspection günde 2.000, dakikada 600 istek. Her URL ayrı istek ve
 * ~2-4 sn sürüyor; eşzamanlılık 3'te tutuldu — 52 URL ~1 dakika, dakikalık
 * kotanın çok altında.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  arg,
  bugun,
  getAccessToken,
  resolveGscDataBase,
  resolveKeyPath,
  toCsv,
} from "./gsc-ortak.mjs";

const SITE_DEFAULT = "https://www.indoles.com.tr/";
const SCOPE = "https://www.googleapis.com/auth/webmasters";
const ESZAMANLILIK = 3;

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const VARSAYILAN_LISTE = join(SCRIPT_DIR, "gsc-kilit-urller.txt");

/** Değer bekleyen bayraklar — pozitional URL ayıklamasında atlanır. */
const DEGERLI_BAYRAKLAR = new Set(["--key", "--site", "--out", "--urls-file"]);

/** CLI'da doğrudan verilen URL'ler (bayrak ve bayrak değerleri hariç). */
function positionalUrls() {
  const out = [];
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      if (DEGERLI_BAYRAKLAR.has(a)) i++;
      continue;
    }
    out.push(a);
  }
  return out;
}

/** Liste dosyasını okur; `#` yorum satırları ve boş satırlar atlanır. */
export function urlleriOku(path) {
  return readFileSync(path, "utf8")
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("#"));
}

async function inspectOne(token, site, url) {
  const res = await fetch(
    "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inspectionUrl: url,
        siteUrl: site,
        languageCode: "tr",
      }),
    }
  );
  const json = await res.json();
  const i = json.inspectionResult?.indexStatusResult;
  if (!i) {
    return {
      url,
      verdict: "HATA",
      coverageState: JSON.stringify(json).slice(0, 200),
      lastCrawlTime: "",
      googleCanonical: "",
      robotsTxtState: "",
      indexingState: "",
    };
  }
  return {
    url,
    verdict: i.verdict ?? "",
    coverageState: i.coverageState ?? "",
    lastCrawlTime: i.lastCrawlTime ?? "",
    googleCanonical: i.googleCanonical ?? "",
    robotsTxtState: i.robotsTxtState ?? "",
    indexingState: i.indexingState ?? "",
  };
}

/**
 * URL'leri `limit` kadar eşzamanlı sorgular; sonuç sırası girdi sırasıdır.
 * Tek bir URL'in hatası taramayı düşürmez — satır `HATA` ile yazılır.
 */
export async function inspectAll(token, site, urls, limit = ESZAMANLILIK) {
  const sonuc = new Array(urls.length);
  let siradaki = 0;
  const isci = async () => {
    for (;;) {
      const i = siradaki++;
      if (i >= urls.length) return;
      const url = urls[i];
      try {
        sonuc[i] = await inspectOne(token, site, url);
      } catch (e) {
        sonuc[i] = {
          url,
          verdict: "HATA",
          coverageState: e.message,
          lastCrawlTime: "",
          googleCanonical: "",
          robotsTxtState: "",
          indexingState: "",
        };
      }
      const r = sonuc[i];
      console.log(
        `${r.url.replace(site, "/")}\n   ${r.verdict} | ${r.coverageState} | son tarama: ${r.lastCrawlTime || "-"} | canonical(google): ${r.googleCanonical || "-"} | robots: ${r.robotsTxtState || "-"} | indexing: ${r.indexingState || "-"}`
      );
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(limit, urls.length) }, () => isci())
  );
  return sonuc;
}

/** Spec'teki beş kolon: url, verdict, coverageState, lastCrawlTime, googleCanonical. */
export function indeksCsv(sonuclar) {
  return toCsv([
    ["url", "verdict", "coverageState", "lastCrawlTime", "googleCanonical"],
    ...sonuclar.map((r) => [
      r.url,
      r.verdict,
      r.coverageState,
      r.lastCrawlTime,
      r.googleCanonical,
    ]),
  ]);
}

async function main() {
  const site = arg("site", SITE_DEFAULT);
  const keyPath = resolveKeyPath();
  const listePath = resolve(arg("urls-file", VARSAYILAN_LISTE));
  const outDir = arg("out", resolveGscDataBase());

  const cliUrls = positionalUrls();
  let urls;
  if (cliUrls.length > 0) {
    urls = cliUrls;
  } else {
    if (!existsSync(listePath)) {
      throw new Error(`URL listesi bulunamadı: ${listePath}`);
    }
    urls = urlleriOku(listePath);
  }
  if (urls.length === 0) throw new Error("Taranacak URL yok.");

  console.log(`GSC URL Inspection · ${urls.length} URL · mülk ${site}`);
  console.log(`Anahtar: ${keyPath}`);
  if (cliUrls.length === 0) console.log(`Liste: ${listePath}`);

  const token = await getAccessToken(keyPath, SCOPE);
  const sonuclar = await inspectAll(token, site, urls);

  mkdirSync(outDir, { recursive: true });
  const csvPath = join(outDir, `indeks-${bugun()}.csv`);
  writeFileSync(csvPath, indeksCsv(sonuclar), "utf8");

  const indeksli = sonuclar.filter((r) => r.verdict === "PASS").length;
  const hatali = sonuclar.filter((r) => r.verdict === "HATA").length;
  console.log(
    `\nÖzet: ${indeksli}/${sonuclar.length} indeksli (PASS)${hatali > 0 ? ` · ${hatali} hata` : ""}`
  );
  const sorunlu = sonuclar.filter((r) => r.verdict !== "PASS");
  if (sorunlu.length > 0) {
    console.log("İndeksli olmayanlar:");
    for (const r of sorunlu) {
      console.log(`  ${r.url} → ${r.verdict} | ${r.coverageState}`);
    }
  }
  console.log(`Tamam → ${csvPath}`);
}

// Yalnız doğrudan çalıştırıldığında koşar; import edildiğinde yan etki yok.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
