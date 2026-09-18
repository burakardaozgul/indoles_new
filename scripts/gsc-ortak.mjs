#!/usr/bin/env node
/**
 * GSC script'lerinin ortak altyapısı — yol çözümü, JWT/token, CSV.
 *
 * Sıfır bağımlılık: Node 22+ (fetch + crypto). `googleapis` paketi bilinçli
 * olarak eklenmedi (CLAUDE.md: yeni dependency gerekçe ister; JWT imzalama
 * Node crypto ile 20 satır).
 *
 * Bu dosya import edildiğinde hiçbir yan etki üretmez: yol çözümü ve ağ
 * çağrıları yalnız çağrıldıklarında çalışır. Test'ten import edilebilir.
 */

import { createSign } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const HOME = process.env.HOME ?? "";

/** Servis hesabı anahtarının dosya adı — dört mülke de erişimi var. */
export const KEY_FILE = "indoles-web-calendar-5aecb00ad3ac.json";

/**
 * Marketing klasörünün bilinen iki konumu.
 *
 * Mac'te Desktop altında duruyor; Claude oturumlarında aynı klasör
 * `~/mnt/Marketing/` altına bağlanıyor. Script hangi kabukta koşarsa
 * koşsun çalışsın diye ikisi de denenir.
 */
export const MARKETING_DIRS = [
  join(HOME, "Desktop/AA - INDOLES Creative & Marketing/Marketing"),
  join(HOME, "mnt/Marketing"),
];

/** `--ad deger` biçimindeki CLI argümanını okur. */
export function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

/** `--bayrak` var mı? */
export function flag(name) {
  return process.argv.includes(`--${name}`);
}

/**
 * Servis hesabı anahtarını sırayla arar:
 * CLI `--key` → Desktop/Marketing → ~/mnt/Marketing → `GSC_KEY_PATH` env.
 *
 * `--key` açıkça verilmişse ve dosya yoksa sessizce fallback'e düşmez —
 * yanlış mülkten veri çekmenin sebebi tam olarak bu tür sessiz varsayımdı.
 */
export function resolveKeyPath(cliArg = arg("key")) {
  if (cliArg) {
    if (existsSync(cliArg)) return cliArg;
    throw new Error(`--key ile verilen dosya yok: ${cliArg}`);
  }
  const adaylar = [
    ...MARKETING_DIRS.map((d) => join(d, KEY_FILE)),
    process.env.GSC_KEY_PATH,
  ].filter(Boolean);
  const bulunan = adaylar.find((p) => existsSync(p));
  if (bulunan) return bulunan;
  throw new Error(
    `Servis hesabı anahtarı bulunamadı. Denenen yollar:\n  ${adaylar.join("\n  ")}\n` +
      "Çözüm: --key ile yol ver veya GSC_KEY_PATH env'ini ayarla."
  );
}

/**
 * `GSC-Data` kök klasörünü sırayla arar: Desktop/Marketing → ~/mnt/Marketing.
 *
 * Hiçbiri yoksa ilk adayı döner (çağıran `mkdir -p` ile oluşturur).
 */
export function resolveGscDataBase() {
  const adaylar = MARKETING_DIRS.map((d) => join(d, "GSC-Data"));
  return adaylar.find((p) => existsSync(p)) ?? adaylar[0];
}

/** Bugünün tarihi, `YYYY-MM-DD`. */
export function bugun() {
  return new Date().toISOString().slice(0, 10);
}

const b64url = (input) => Buffer.from(input).toString("base64url");

/**
 * Servis hesabı JWT'siyle OAuth access token alır.
 *
 * @param {string} keyPath servis hesabı JSON'unun yolu
 * @param {string} scope tam scope URL'i
 */
export async function getAccessToken(keyPath, scope) {
  const key = JSON.parse(readFileSync(keyPath, "utf8"));
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(
    JSON.stringify({
      iss: key.client_email,
      scope,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const jwt = `${header}.${claims}.${signer.sign(key.private_key, "base64url")}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  if (!res.ok) {
    throw new Error(`Token alınamadı: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  if (!data.access_token) {
    throw new Error(
      `Token yanıtında access_token yok: ${JSON.stringify(data)}`
    );
  }
  return data.access_token;
}

/** Tek hücreyi CSV'ye uygun kaçışlar. */
export function csvCell(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

/** Satır dizilerini CSV metnine çevirir (sonda newline ile). */
export function toCsv(rows) {
  return rows.map((r) => r.map(csvCell).join(",")).join("\n") + "\n";
}

/**
 * RFC4180 tarzı CSV ayrıştırıcı — tırnaklı alan, gömülü virgül ve çift
 * tırnak kaçışını doğru okur. GSC sorguları ikisini de içeriyor.
 */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        cur += ch;
      }
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(cur);
      cur = "";
    } else if (ch === "\n") {
      row.push(cur);
      rows.push(row);
      row = [];
      cur = "";
    } else if (ch !== "\r") cur += ch;
  }
  if (cur !== "" || row.length > 0) {
    row.push(cur);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || r[0] !== "");
}

/** CSV metnini başlık satırına göre nesne dizisine çevirir. */
export function csvToObjects(text) {
  const rows = parseCsv(text);
  if (rows.length === 0) return [];
  const head = rows[0];
  return rows
    .slice(1)
    .map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}

/** `gsc-pull.mjs` çıktısındaki bir CSV'yi okur. */
export function readCsvFile(path) {
  return csvToObjects(readFileSync(path, "utf8"));
}

/** `"12,34%"` / `"12.34"` → sayı. Boş/bozuk değer 0 döner. */
export function num(v) {
  const n = Number(
    String(v ?? "")
      .replace("%", "")
      .trim()
  );
  return Number.isFinite(n) ? n : 0;
}
