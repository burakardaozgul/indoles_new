#!/usr/bin/env node
/**
 * GA4 Pull — GA4 Data API'den haftalık ölçüm verisini servis hesabıyla çeker,
 * CSV döker ve `ozet.txt` üretir: haftalık toplam, kaynak dağılımı, AI
 * yönlendirmeleri, form/brief (lead) olayları, açılış sayfaları, anahtar olay
 * denetimi ve kapsam notu.
 *
 * GSC rutininin (`gsc-pull.mjs`) kardeşi; aynı servis hesabı anahtarı, aynı
 * CSV yardımcıları, aynı klasör düzeni (`GA4-Data/haftalik-<tarih>/`). Sıfır
 * bağımlılık: Node 22+ (fetch + crypto); `googleapis`/`@google-analytics/data`
 * bilinçli olarak eklenmedi (CLAUDE.md: yeni dependency gerekçe ister; iki uç
 * nokta için fetch yeter).
 *
 * YALNIZ OKUR. Kapsam `analytics.readonly`; Admin API'ye yalnız GET atılır
 * (anahtar olay ve veri akışı listesi). GA4 yapılandırması bu script'ten
 * değiştirilmez — o iş `pnpm ga4:setup`'ındır.
 *
 * Kullanım:
 *   node scripts/ga4-pull.mjs [--property 553152492] [--start 2026-09-10] \
 *     [--end 2026-10-07] [--ai-start 2026-08-29] [--key "/yol/anahtar.json"] \
 *     [--out "/yol/cikti-klasoru"]
 *
 * Varsayılanlar: bitiş bugün-2 (GA4 işleme gecikmesi 24-48 s) · başlangıç
 * bitiş-27 (28 gün) · AI serisi cutover'dan (2026-08-29) bitişe · anahtar
 * Marketing klasöründeki JSON · çıktı `GA4-Data/haftalik-<bugün>/`.
 *
 * Çıktılar: gunluk.csv · kaynaklar.csv · kanallar.csv · kampanyalar.csv ·
 * ai-yonlendirme.csv · sayfalar.csv · goruntuleme.csv · olaylar.csv ·
 * lead.csv · ozet.txt · meta.txt — hepsi UTF-8.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  arg,
  bugun,
  getAccessToken,
  num,
  resolveGa4DataBase,
  resolveKeyPath,
  toCsv,
} from "./gsc-ortak.mjs";

/** www.indoles.com.tr mülkü — `docs/12` §1, ADR-038. */
export const DEFAULT_PROPERTY = "553152492";

/** Cutover günü — AI yönlendirme serisinin varsayılan başlangıcı. */
export const AI_START_DEFAULT = "2026-08-29";

/** GA4 işleme gecikmesi: bitiş varsayılanı bugün-2. */
export const GA4_GECIKME_GUN = 2;

/** Varsayılan pencere: 28 gün (GSC rutiniyle aynı uzunluk). */
export const PENCERE_GUN = 28;

/**
 * Küçük hacim eşiği: iki penceredeki değer de bunun altındaysa delta yalnız
 * bağlamdır, trend okunmaz (runbook "Bilinmesi gerekenler").
 */
export const KUCUK_HACIM_ESIK = 10;

/** Yol haritası §5: form / brief, ayda 5+ nitelikli. */
export const FORM_HEDEF_AYLIK = 5;

const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const DATA_BASE = "https://analyticsdata.googleapis.com/v1beta";
const ADMIN_BASE = "https://analyticsadmin.googleapis.com/v1beta";

// ------------------------------------------------------------------ tarih

const ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Takvimde var olan `YYYY-MM-DD` mi? Biçim tek başına yetmez: `2026-13-01`
 * geçersiz, `2026-02-30` ise Date'te sessizce 2 Mart'a kayar.
 */
export function gecerliTarih(iso) {
  const s = String(iso ?? "");
  if (!ISO_RE.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

/** `YYYY-MM-DD` + n gün → `YYYY-MM-DD` (UTC takvim aritmetiği, saat yok). */
export function gunEkle(iso, n) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Bugünden varsayılan aralık: bitiş bugün-2, başlangıç bitiş-27. */
export function varsayilanAralik(bugunIso) {
  const end = gunEkle(bugunIso, -GA4_GECIKME_GUN);
  return { start: gunEkle(end, -(PENCERE_GUN - 1)), end };
}

/** `start`…`end` dahil her takvim günü. */
export function gunListesi(start, end) {
  const out = [];
  for (let d = start; d <= end; d = gunEkle(d, 1)) out.push(d);
  return out;
}

/** GA4 `date` boyutu `20261007` → `2026-10-07`. Zaten ISO ise dokunmaz. */
export function ga4Tarih(v) {
  const s = String(v ?? "");
  return /^\d{8}$/.test(s)
    ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}`
    : s;
}

/**
 * Haftalık pencereler bitiş gününden TAKVİMLE kurulur, satır sayısından değil:
 * GA4 sıfır oturumlu günü hiç döndürmeyebilir, satır dilimlemek (GSC'deki
 * `slice(-7)`) o durumda pencereyi sessizce kaydırırdı.
 */
export function pencereler(end) {
  return {
    son7: { ilk: gunEkle(end, -6), son: end },
    onceki7: { ilk: gunEkle(end, -13), son: gunEkle(end, -7) },
  };
}

/** Haftanın Pazartesi'si (ISO hafta başı). */
export function haftaBasi(iso) {
  const d = new Date(`${iso}T00:00:00Z`);
  const gun = (d.getUTCDay() + 6) % 7; // Pzt=0 … Paz=6
  return gunEkle(iso, -gun);
}

// ------------------------------------------------------- AI yönlendirmesi

/**
 * AI asistanı kaynakları — `sessionSource` değeri (host ya da utm_source)
 * küçük harfe çevrilip bu desenlerle eşleştirilir. İLK eşleşen motor kazanır.
 *
 * Kapsam kuralları (test `ga4-ozet.test.ts` kilitliyor):
 *  - `sessionSource` bir host'tur, yol taşımaz. `bing.com/chat` gibi yol
 *    bazlı ayrım bu boyutta mümkün değil; `bing.com` ve `duckduckgo.com`
 *    arama motorudur, sayılmaz. Copilot ve Duck.ai'nin kendi host'ları var.
 *  - `google.com` sayılmaz; yalnız `gemini.google.com` / `bard.google.com`.
 *  - Çıplak marka adı (`chatgpt`, `perplexity` …) utm_source olarak gelirse
 *    sayılır — ChatGPT bağlantılara `utm_source=chatgpt.com` ekliyor, başka
 *    motorlar da benzerini yapabilir.
 *
 * Liste ayrıca GA4'ün kendi "AI Assistant" kanal grubuyla birleştirilir
 * (`aiSiniflandir`): liste kaçırırsa kanal yakalar, kanal kaçırırsa liste.
 */
export const AI_KAYNAKLARI = [
  {
    motor: "ChatGPT",
    re: /(^|\.)(chatgpt\.com|chat\.openai\.com|openai\.com)$|^(chatgpt|openai)$/,
  },
  { motor: "Perplexity", re: /(^|\.)perplexity\.ai$|^perplexity$/ },
  { motor: "Gemini", re: /^(gemini|bard)\.google\.com$|^(gemini|bard)$/ },
  {
    motor: "Copilot",
    re: /^copilot\.microsoft\.com$|^copilot\.cloud\.microsoft$|^edgeservices\.bing\.com$|^copilot$/,
  },
  { motor: "Claude", re: /(^|\.)claude\.ai$|^claude$/ },
  { motor: "You.com", re: /(^|\.)you\.com$/ },
  { motor: "Poe", re: /(^|\.)poe\.com$/ },
  { motor: "Mistral", re: /(^|\.)mistral\.ai$|^mistral$/ },
  { motor: "DeepSeek", re: /(^|\.)deepseek\.com$|^deepseek$/ },
  { motor: "Duck.ai", re: /^duck\.ai$/ },
  { motor: "Grok", re: /(^|\.)grok\.com$|^grok$/ },
  { motor: "Meta AI", re: /(^|\.)meta\.ai$/ },
];

/** GA4'ün varsayılan kanal grubundaki AI kanalı ve ortamı. */
export const GA4_AI_KANAL = "AI Assistant";
export const GA4_AI_ORTAM = "ai-assistant";

/** Kaynağın AI motoru (`"ChatGPT"` …); AI değilse `null`. */
export function aiMotoru(source) {
  const s = String(source ?? "")
    .trim()
    .toLowerCase();
  if (!s) return null;
  return AI_KAYNAKLARI.find((k) => k.re.test(s))?.motor ?? null;
}

/**
 * Bir kaynak satırının AI sınıfı. `liste`: `AI_KAYNAKLARI` eşleşti;
 * `kanal`: GA4 kendisi "AI Assistant" kanalına ya da `ai-assistant`
 * ortamına koydu. İkisinden biri yeter. Yalnız kanal yakaladıysa motor adı
 * kaynağın kendisidir — liste güncellemesi gerektiğinin işareti.
 *
 * @param {{ sessionSource?: unknown, sessionMedium?: unknown, sessionDefaultChannelGroup?: unknown }} r
 * @returns {{ ai: boolean, motor: string | null, liste: boolean, kanal: boolean }}
 */
export function aiSiniflandir(r) {
  const listeMotoru = aiMotoru(r.sessionSource);
  const kanal =
    String(r.sessionDefaultChannelGroup ?? "") === GA4_AI_KANAL ||
    String(r.sessionMedium ?? "").toLowerCase() === GA4_AI_ORTAM;
  const liste = listeMotoru !== null;
  const motor =
    listeMotoru ?? (kanal ? `Diğer · ${String(r.sessionSource ?? "")}` : null);
  return { ai: liste || kanal, motor, liste, kanal };
}

// ----------------------------------------------- olay parametresi sızıntısı

/**
 * Olay parametresi `source`'un aldığı değerler: `BookingCtaSource`
 * (`src/lib/analytics/events.ts`) + GTM tıklama olaylarının `tel-link` /
 * `mailto-link`'i (`docs/12` §2.0). GA4 `source` adlı olay parametresini
 * trafik kaynağı olarak da okuyabiliyor; bu değerlerden biri `sessionSource`
 * olarak görünürse oturum kaynağı olaydan kirlenmiş demektir.
 */
export const OLAY_SOURCE_DEGERLERI = [
  "nav",
  "nav-mobile",
  "contact-callout",
  "service-detail",
  "package-detail",
  "consultant-detail",
  "tool-geo-report",
  "tool-diagnoo-report",
  "tel-link",
  "mailto-link",
];

/** Kaynak satırlarından olay `source`'u ile kirlenmiş oturumları toplar. */
export function kaynakSizintisi(rows) {
  const acc = new Map();
  for (const r of rows) {
    const s = String(r.sessionSource ?? "");
    if (!OLAY_SOURCE_DEGERLERI.includes(s)) continue;
    acc.set(s, (acc.get(s) ?? 0) + num(r.sessions));
  }
  return [...acc.entries()]
    .map(([kaynak, oturum]) => ({ kaynak, oturum }))
    .sort((a, b) => b.oturum - a.oturum);
}

// ------------------------------------------------------------ lead olayları

/**
 * Lead olayları — otorite `docs/12` §2.0 (Meta `Lead` tablosu) ve §2.8
 * (`SITE_KEY_EVENTS`). Sıra `lead.csv` kolon sırasıdır.
 *
 *  - `form`: Meta'ya `Lead` giden beş olay (`LEAD_EVENTS`, ADR-036) —
 *    iletişim bilgisi bırakılan an. Yol haritası §5'in "form / brief"
 *    ölçüsü bunların toplamıdır.
 *  - `tiklama`: GTM'in `tel:` / `mailto:` olayları — anahtar olay ama form
 *    değil.
 *  - `huni`: görüşme CTA'sı. Bilinçli olarak anahtar olay DEĞİL (huni adımı).
 *
 * `anahtar: true` olanların kümesi `SITE_KEY_EVENTS` ile, `form` olanların
 * kümesi `LEAD_EVENTS` ile birebir aynı olmalı — test ikisini de kilitliyor;
 * kod tarafında liste değişir de burası unutulursa test kırılır.
 */
export const LEAD_OLAYLARI = [
  {
    ad: "contact_form_submitted",
    tur: "form",
    anahtar: true,
    etiket: "İletişim formu",
  },
  {
    ad: "contact_booking_submitted",
    tur: "form",
    anahtar: true,
    etiket: "İletişim randevusu (yüzey 2026-09-22'de kaldırıldı)",
  },
  {
    ad: "popup_booking_submitted",
    tur: "form",
    anahtar: true,
    etiket: "Popup — randevu",
  },
  {
    ad: "popup_contact_submitted",
    tur: "form",
    anahtar: true,
    etiket: "Popup — mesaj",
  },
  {
    ad: "tool_report_requested",
    tur: "form",
    anahtar: true,
    etiket: "Araç raporu (GEO / Diagnoo, e-posta)",
  },
  {
    ad: "phone_clicked",
    tur: "tiklama",
    anahtar: true,
    etiket: "Telefon tıklaması",
  },
  {
    ad: "email_clicked",
    tur: "tiklama",
    anahtar: true,
    etiket: "E-posta tıklaması",
  },
  {
    ad: "booking_cta_clicked",
    tur: "huni",
    anahtar: false,
    etiket: "Görüşme CTA'sı (huni adımı)",
  },
];

export const LEAD_ADLARI = LEAD_OLAYLARI.map((o) => o.ad);

/**
 * @typedef {{ olay: number, anahtar: number, son7: number }} LeadToplam
 * @typedef {{
 *   gunler: Array<{ date: string, sayilar: Record<string, number> }>,
 *   toplam: Record<string, LeadToplam>,
 *   formToplam: number,
 *   formSon7: number,
 *   gunSayisi: number,
 *   start: string,
 *   end: string,
 * }} LeadOzeti
 */

/**
 * `date × eventName` satırlarından lead tablosu. Takvimdeki her gün ve her
 * lead olayı için satır/kolon üretir — hiç gelmeyen olay 0 yazılır
 * (`contact_form_submitted` 0 ise "ölçülmedi" değil "0" görünmeli).
 *
 * @param {Array<Record<string, unknown>>} rows
 * @param {{ start: string, end: string }} aralik
 * @returns {LeadOzeti}
 */
export function leadOzeti(rows, { start, end }) {
  const { son7 } = pencereler(end);
  const gunler = gunListesi(start, end).map((date) => ({
    date,
    sayilar: Object.fromEntries(LEAD_ADLARI.map((ad) => [ad, 0])),
  }));
  const gunIndex = new Map(gunler.map((g, i) => [g.date, i]));
  /** @type {Record<string, LeadToplam>} */
  const toplam = Object.fromEntries(
    LEAD_ADLARI.map((ad) => [ad, { olay: 0, anahtar: 0, son7: 0 }])
  );
  for (const r of rows) {
    const ad = String(r.eventName ?? "");
    const t = toplam[ad];
    if (!t) continue;
    const date = ga4Tarih(r.date);
    const i = gunIndex.get(date);
    if (i === undefined) continue;
    const olay = num(r.eventCount);
    const g = gunler[i];
    if (g) g.sayilar[ad] = (g.sayilar[ad] ?? 0) + olay;
    t.olay += olay;
    t.anahtar += num(r.keyEvents);
    if (date >= son7.ilk && date <= son7.son) t.son7 += olay;
  }
  const formAdlari = LEAD_OLAYLARI.filter((o) => o.tur === "form").map(
    (o) => o.ad
  );
  const topla = (alan) =>
    formAdlari.reduce((s, ad) => s + (toplam[ad]?.[alan] ?? 0), 0);
  return {
    gunler,
    toplam,
    formToplam: topla("olay"),
    formSon7: topla("son7"),
    gunSayisi: gunler.length,
    start,
    end,
  };
}

/** `lead.csv` — geniş biçim: gün satırları + `toplam` + `anahtar_olay`. */
export function leadCsv(lead) {
  const formAdlari = LEAD_OLAYLARI.filter((o) => o.tur === "form").map(
    (o) => o.ad
  );
  const formTop = (sayilar) =>
    formAdlari.reduce((s, ad) => s + (sayilar[ad] ?? 0), 0);
  const satirlar = [["date", ...LEAD_ADLARI, "form_brief_toplam"]];
  for (const g of lead.gunler) {
    satirlar.push([
      g.date,
      ...LEAD_ADLARI.map((ad) => g.sayilar[ad] ?? 0),
      formTop(g.sayilar),
    ]);
  }
  const olay = Object.fromEntries(
    LEAD_ADLARI.map((ad) => [ad, lead.toplam[ad]?.olay ?? 0])
  );
  const anahtar = Object.fromEntries(
    LEAD_ADLARI.map((ad) => [ad, lead.toplam[ad]?.anahtar ?? 0])
  );
  satirlar.push([
    "toplam",
    ...LEAD_ADLARI.map((ad) => olay[ad]),
    formTop(olay),
  ]);
  satirlar.push([
    "anahtar_olay",
    ...LEAD_ADLARI.map((ad) => anahtar[ad]),
    formTop(anahtar),
  ]);
  return toCsv(satirlar);
}

// --------------------------------------------------------- açılış sayfaları

/** `landingPagePlusQueryString` → yol (sorgu dizesi ve parça atılır). */
export function yolAl(landing) {
  const s = String(landing ?? "");
  if (s.startsWith("(")) return s; // (not set)
  return s.split(/[?#]/)[0] || "/";
}

/**
 * Hizmet sayfası — GSC rutinindeki tanımın aynısı (`gsc-pull.mjs`
 * `HIZMET_SAYFASI_RE`): `/tr/hizmetler/<slug>`, `/en/services/<slug>`;
 * pillar'lar dahil, liste sayfaları ve eski URL'ler hariç.
 */
const HIZMET_SAYFASI_RE = /^\/(tr\/hizmetler|en\/services)\/[^/]+\/?$/;

/**
 * Karar içeriği — yol haritası §3'ün "nasıl seçilir / neye mal olur / ajans
 * mı danışmanlık mı / platform danışmanlığı" yazıları. Slug parçalarıyla
 * eşlenir; yeni karar yazısı bu kalıplardan birini taşımıyorsa buraya eklenir.
 */
export const KARAR_ICERIGI_RE =
  /fiyatlari|nasil-secilir|pricing|how-to-choose|buyuk-danismanlik|big-consultancy|platform-danismanligi|platform-consulting/;

/** Yolun niyetli içerik türü: `"hizmet"`, `"karar"` ya da `null`. */
export function niyetliSayfaTuru(path) {
  const p = yolAl(path);
  if (HIZMET_SAYFASI_RE.test(p)) return "hizmet";
  if (KARAR_ICERIGI_RE.test(p)) return "karar";
  return null;
}

/**
 * @typedef {{ yol: string, tur: string | null, oturum: number, etkilesimli: number,
 *   sureToplam: number, anahtar: number }} AcilisSayfasi
 */

/**
 * `sayfalar.csv` satırlarını yola göre toplar (e-posta UTM'leri aynı sayfayı
 * onlarca satıra bölüyor). Ortalama süre oturumla ağırlıklandırılır.
 *
 * @param {Array<Record<string, unknown>>} rows
 * @returns {AcilisSayfasi[]}
 */
export function acilisSayfalari(rows) {
  /** @type {Map<string, AcilisSayfasi>} */
  const acc = new Map();
  for (const r of rows) {
    const yol = yolAl(r.landingPagePlusQueryString);
    const o = acc.get(yol) ?? {
      yol,
      tur: niyetliSayfaTuru(yol),
      oturum: 0,
      etkilesimli: 0,
      sureToplam: 0,
      anahtar: 0,
    };
    const s = num(r.sessions);
    o.oturum += s;
    o.etkilesimli += num(r.engagedSessions);
    o.sureToplam += num(r.averageSessionDuration) * s;
    o.anahtar += num(r.keyEvents);
    acc.set(yol, o);
  }
  return [...acc.values()].sort(
    (a, b) => b.oturum - a.oturum || a.yol.localeCompare(b.yol)
  );
}

// ---------------------------------------------------------- haftalık toplam

/**
 * @typedef {{ oturum: number, kullanici: number, yeni: number, etkilesimli: number,
 *   anahtar: number, ilk: string, son: string }} PencereToplam
 */

const METRIK_ALAN = {
  sessions: "oturum",
  totalUsers: "kullanici",
  newUsers: "yeni",
  engagedSessions: "etkilesimli",
  keyEvents: "anahtar",
};

/**
 * Çok `dateRange`li sorgunun satırlarını `{ son7, onceki7, donem }`e çevirir.
 * Kullanıcı sayısı günler arası toplanamaz (aynı kişi iki gün gelirse iki
 * sayılırdı) — bu yüzden haftalık toplam günlük satırlardan değil, GA4'ün
 * pencere başına tekilleştirdiği sorgudan gelir.
 *
 * @param {Array<Record<string, unknown>>} rows `dateRange` boyutlu satırlar
 * @param {Record<string, { ilk: string, son: string }>} araliklar
 * @returns {Record<string, PencereToplam>}
 */
export function haftalikToplam(rows, araliklar) {
  /** @type {Record<string, PencereToplam>} */
  const out = {};
  for (const [ad, a] of Object.entries(araliklar)) {
    out[ad] = {
      oturum: 0,
      kullanici: 0,
      yeni: 0,
      etkilesimli: 0,
      anahtar: 0,
      ilk: a.ilk,
      son: a.son,
    };
  }
  for (const r of rows) {
    const o = out[String(r.dateRange ?? "")];
    if (!o) continue;
    for (const [m, alan] of Object.entries(METRIK_ALAN)) o[alan] = num(r[m]);
  }
  return out;
}

/** Delta metni; iki değer de küçük hacimdeyse işaretlenir. */
export function deltaMetni(a, b) {
  const d = a - b;
  const s = `${d >= 0 ? "+" : ""}${d}`;
  return Math.max(a, b) < KUCUK_HACIM_ESIK ? `${s} (küçük hacim)` : s;
}

// ------------------------------------------------------------ AI özeti

/**
 * @typedef {{ motor: string, oturum: number, donemOturum: number, etkilesimli: number,
 *   anahtar: number, kaynaklar: string[] }} AiMotorOzeti
 * @typedef {{ yol: string, motorlar: string[], oturum: number, etkilesimli: number,
 *   anahtar: number }} AiSayfaOzeti
 * @typedef {{ hafta: string, ilk: string, son: string, ai: number, toplam: number }} AiHafta
 * @typedef {{
 *   satirlar: Array<Record<string, unknown> & { motor: string }>,
 *   motorlar: AiMotorOzeti[],
 *   sayfalar: AiSayfaOzeti[],
 *   haftalar: AiHafta[],
 *   toplam: { oturum: number, donemOturum: number, etkilesimli: number, anahtar: number },
 *   tumOturum: number,
 *   donemTumOturum: number,
 *   ilkVeriGunu: string | null,
 *   uyum: { listeOturum: number, kanalOturum: number, yalnizListe: string[], yalnizKanal: string[] },
 * }} AiOzeti
 */

/**
 * AI yönlendirme özeti.
 *
 * @param {{
 *   aiRows: Array<Record<string, unknown>>,
 *   toplamGunluk: Array<Record<string, unknown>>,
 *   aiStart: string,
 *   donemStart: string,
 *   end: string,
 * }} girdi `aiRows`: date × kaynak × ortam × kanal × açılış sayfası
 *   satırları (filtresiz); `toplamGunluk`: aynı aralığın date × sessions'ı.
 * @returns {AiOzeti}
 */
export function aiOzeti({ aiRows, toplamGunluk, aiStart, donemStart, end }) {
  const satirlar = [];
  /** @type {Map<string, AiMotorOzeti>} */
  const motorlar = new Map();
  /** @type {Map<string, AiSayfaOzeti & { motorSet: Set<string> }>} */
  const sayfalar = new Map();
  const haftaAi = new Map();
  const toplam = { oturum: 0, donemOturum: 0, etkilesimli: 0, anahtar: 0 };
  const yalnizListe = new Set();
  const yalnizKanal = new Set();
  let listeOturum = 0;
  let kanalOturum = 0;

  for (const r of aiRows) {
    const date = ga4Tarih(r.date);
    if (date < aiStart || date > end) continue;
    const sinif = aiSiniflandir(r);
    if (!sinif.ai || !sinif.motor) continue;
    const s = num(r.sessions);
    const e = num(r.engagedSessions);
    const k = num(r.keyEvents);
    const kaynak = String(r.sessionSource ?? "");
    const donemde = date >= donemStart;
    satirlar.push({ ...r, date, motor: sinif.motor });

    if (sinif.liste) listeOturum += s;
    if (sinif.kanal) kanalOturum += s;
    if (sinif.liste && !sinif.kanal) yalnizListe.add(kaynak);
    if (sinif.kanal && !sinif.liste) yalnizKanal.add(kaynak);

    const m = motorlar.get(sinif.motor) ?? {
      motor: sinif.motor,
      oturum: 0,
      donemOturum: 0,
      etkilesimli: 0,
      anahtar: 0,
      kaynaklar: [],
    };
    m.oturum += s;
    if (donemde) m.donemOturum += s;
    m.etkilesimli += e;
    m.anahtar += k;
    if (!m.kaynaklar.includes(kaynak)) m.kaynaklar.push(kaynak);
    motorlar.set(sinif.motor, m);

    const yol = yolAl(r.landingPagePlusQueryString);
    const p = sayfalar.get(yol) ?? {
      yol,
      motorlar: [],
      motorSet: new Set(),
      oturum: 0,
      etkilesimli: 0,
      anahtar: 0,
    };
    p.oturum += s;
    p.etkilesimli += e;
    p.anahtar += k;
    p.motorSet.add(sinif.motor);
    sayfalar.set(yol, p);

    const h = haftaBasi(date);
    haftaAi.set(h, (haftaAi.get(h) ?? 0) + s);

    toplam.oturum += s;
    if (donemde) toplam.donemOturum += s;
    toplam.etkilesimli += e;
    toplam.anahtar += k;
  }

  const haftaToplam = new Map();
  let tumOturum = 0;
  let donemTumOturum = 0;
  let ilkVeriGunu = null;
  for (const r of toplamGunluk) {
    const date = ga4Tarih(r.date);
    if (date < aiStart || date > end) continue;
    const s = num(r.sessions);
    if (s > 0 && (ilkVeriGunu === null || date < ilkVeriGunu))
      ilkVeriGunu = date;
    tumOturum += s;
    if (date >= donemStart) donemTumOturum += s;
    const h = haftaBasi(date);
    haftaToplam.set(h, (haftaToplam.get(h) ?? 0) + s);
  }

  /** @type {AiHafta[]} */
  const haftalar = [];
  for (let h = haftaBasi(aiStart); h <= end; h = gunEkle(h, 7)) {
    const ilk = h < aiStart ? aiStart : h;
    const sonAday = gunEkle(h, 6);
    haftalar.push({
      hafta: h,
      ilk,
      son: sonAday > end ? end : sonAday,
      ai: haftaAi.get(h) ?? 0,
      toplam: haftaToplam.get(h) ?? 0,
    });
  }

  satirlar.sort(
    (a, b) =>
      String(a.date).localeCompare(String(b.date)) ||
      num(b.sessions) - num(a.sessions)
  );

  return {
    satirlar,
    motorlar: [...motorlar.values()].sort((a, b) => b.oturum - a.oturum),
    sayfalar: [...sayfalar.values()]
      .map(({ motorSet, ...p }) => ({ ...p, motorlar: [...motorSet].sort() }))
      .sort((a, b) => b.oturum - a.oturum || a.yol.localeCompare(b.yol)),
    haftalar,
    toplam,
    tumOturum,
    donemTumOturum,
    ilkVeriGunu,
    uyum: {
      listeOturum,
      kanalOturum,
      yalnizListe: [...yalnizListe].sort(),
      yalnizKanal: [...yalnizKanal].sort(),
    },
  };
}

// ---------------------------------------------------- anahtar olay denetimi

/** GA4'ün silinemeyen varsayılan anahtar olayı — `docs/12` §2.8. */
const BILINEN_FAZLA = {
  purchase:
    "GA4'ün silinemeyen varsayılanı; sitede emit edilmiyor (docs/12 §2.8)",
};

/**
 * @typedef {{
 *   kaynak: "admin" | "veri",
 *   isaretli: Array<{ ad: string, sayim: string }>,
 *   eksik: string[],
 *   fazla: Array<{ ad: string, not: string }>,
 *   sessiz: string[],
 *   bilincliIsaretsiz: string[],
 * }} AnahtarDenetim
 */

/**
 * İşaretli anahtar olayları beklenen listeyle (`LEAD_OLAYLARI` içinde
 * `anahtar: true`, yani `SITE_KEY_EVENTS`) kıyaslar.
 *
 * `admin` null ise (Admin API okunamadı) liste veriden kurulur
 * (`isKeyEvent = true`); bu durumda dönemde hiç tetiklenmeyen olayın
 * işaretli olup olmadığı BİLİNEMEZ, `eksik` boş döner ve özet bunu söyler.
 *
 * @param {{
 *   admin: Array<{ eventName?: string, countingMethod?: string }> | null,
 *   olaylar: Array<Record<string, unknown>>,
 * }} girdi
 * @returns {AnahtarDenetim}
 */
export function anahtarOlayDenetimi({ admin, olaylar }) {
  const beklenen = LEAD_OLAYLARI.filter((o) => o.anahtar).map((o) => o.ad);
  const sayim = new Map(
    olaylar.map((r) => [String(r.eventName ?? ""), num(r.eventCount)])
  );
  const isaretli = admin
    ? admin.map((k) => ({
        ad: String(k.eventName ?? ""),
        sayim: String(k.countingMethod ?? "-"),
      }))
    : olaylar
        .filter((r) => String(r.isKeyEvent) === "true" || r.isKeyEvent === "E")
        .map((r) => ({ ad: String(r.eventName ?? ""), sayim: "-" }));
  const adlar = new Set(isaretli.map((k) => k.ad));
  return {
    kaynak: admin ? "admin" : "veri",
    isaretli,
    eksik: admin ? beklenen.filter((ad) => !adlar.has(ad)) : [],
    fazla: isaretli
      .filter((k) => !beklenen.includes(k.ad))
      .map((k) => ({
        ad: k.ad,
        not: BILINEN_FAZLA[k.ad] ?? "beklenen listede yok — kontrol et",
      })),
    sessiz: beklenen.filter(
      (ad) => adlar.has(ad) && (sayim.get(ad) ?? 0) === 0
    ),
    bilincliIsaretsiz: LEAD_OLAYLARI.filter((o) => !o.anahtar).map((o) => o.ad),
  };
}

// ------------------------------------------------------------ kapsam notu

/**
 * Bilinen veri kusurları — kaynak ADR'ler. Pencere bunlarla kesişirse özet
 * uyarır; karşılaştırmada bu günler dışlanmalı.
 */
export const KIRLI_ARALIKLAR = [
  {
    ilk: "2026-09-08",
    son: "2026-09-09",
    not: "Olay sayıları şişkin (çift sayım), özel boyut kırılımlarının yarısı (not set) — ADR-034.",
  },
  {
    ilk: "2026-09-09",
    son: "2026-09-10",
    not: "page_view eksik (09-09 12:00 UTC → 09-10 13:00 UTC); açılış sayfası raporu o aralıkta boş — ADR-037/038.",
  },
  {
    ilk: "2026-09-08",
    son: "2026-09-10",
    not: "Gelişmiş ölçüm (scroll, outbound click, form_start/form_submit …) hiç yok — ADR-038.",
  },
];

/** Pencereyle kesişen bilinen kusurlar. */
export function kirliKesisim(start, end) {
  return KIRLI_ARALIKLAR.filter((k) => k.ilk <= end && k.son >= start);
}

// ------------------------------------------------------------- ozet.txt

const yuzde = (pay, payda) =>
  payda > 0 ? `${((pay / payda) * 100).toFixed(1)}%` : "-";
const sn = (v) => (Number.isFinite(v) ? v.toFixed(1) : "-");

/**
 * Kaynak satırlarını `kaynak / ortam` bazında toplar (kampanya kırılımı aynı
 * kaynağı birden çok satıra bölebilir). Kullanıcı satır toplamıdır, tekil
 * değildir.
 */
export function kaynakOzeti(rows) {
  const acc = new Map();
  for (const r of rows) {
    const anahtar = `${String(r.sessionSource ?? "")} / ${String(r.sessionMedium ?? "")}`;
    const o = acc.get(anahtar) ?? {
      ad: anahtar,
      kampanyalar: [],
      oturum: 0,
      kullanici: 0,
      etkilesimli: 0,
      anahtar: 0,
      ai: false,
    };
    o.oturum += num(r.sessions);
    o.kullanici += num(r.totalUsers);
    o.etkilesimli += num(r.engagedSessions);
    o.anahtar += num(r.keyEvents);
    const k = String(r.sessionCampaignName ?? "");
    if (k && !k.startsWith("(") && !o.kampanyalar.includes(k))
      o.kampanyalar.push(k);
    if (aiSiniflandir(r).ai) o.ai = true;
    acc.set(anahtar, o);
  }
  return [...acc.values()].sort(
    (a, b) => b.oturum - a.oturum || a.ad.localeCompare(b.ad)
  );
}

/** Düşük etkileşim kontrolü: en az bu kadar oturum … */
export const DUSUK_ETKILESIM_MIN_OTURUM = 20;
/** … ve etkileşim oranı bunun altında (yüzde). */
export const DUSUK_ETKILESIM_ORAN = 10;

/**
 * Hacmi olan ama neredeyse hiç etkileşim üretmeyen kaynaklar. E-posta
 * güvenlik tarayıcıları bülten bağlantılarının hepsini (logo, alt bilgi
 * dahil) önden tıklar; oturum sayar, etkileşim üretmez. Bu kontrol o imzayı
 * görünür kılar — sayıyı düzeltmez, "insan ziyareti" diye okunmasını önler.
 *
 * @param {ReturnType<typeof kaynakOzeti>} kaynaklar
 */
export function dusukEtkilesim(kaynaklar) {
  return kaynaklar.filter(
    (k) =>
      k.oturum >= DUSUK_ETKILESIM_MIN_OTURUM &&
      (k.etkilesimli / k.oturum) * 100 < DUSUK_ETKILESIM_ORAN
  );
}

/**
 * `ozet.txt` — `GSC-Data/haftalik-log.md`'deki "GA4" alt bölümüne doğrudan
 * kopyalanabilir. Saf: her şey parametreden gelir.
 *
 * @param {{
 *   property: string, start: string, end: string, aiStart: string,
 *   hafta: Record<string, PencereToplam>,
 *   kanallar: Array<Record<string, unknown>>,
 *   kaynaklar: Array<Record<string, unknown>>,
 *   kampanyalar: Array<Record<string, unknown>>,
 *   ai: AiOzeti,
 *   lead: LeadOzeti,
 *   sayfalar: AcilisSayfasi[],
 *   denetim: AnahtarDenetim,
 *   akislar?: Array<{ olcumKimligi: string, ad: string }>,
 *   uyarilar?: string[],
 * }} v
 */
export function ozetMetni(v) {
  const L = [];
  const { son7, onceki7, donem } = v.hafta;
  L.push(`# GA4 haftalık özet — mülk ${v.property} (www.indoles.com.tr)`);
  L.push(
    `Çekim aralığı: ${v.start} → ${v.end} · GA4 (gecikme 24-48 s) · AI serisi ${v.aiStart} → ${v.end}`
  );
  L.push(
    "Otorite: docs/12-analytics-measurement.md (olay sözlüğü §2.0, anahtar olaylar §2.8) · kapsam ADR-034/035/038 · hedef docs/strateji/Yol-Haritasi-Satin-Alma-Niyeti-2026-09.md §5."
  );
  L.push("");

  // (a) haftalık toplam
  L.push("## Haftalık toplam");
  L.push("");
  if (son7 && onceki7) {
    L.push("| Metrik | Son 7 gün | Önceki 7 gün | Delta |");
    L.push("|---|---|---|---|");
    L.push(
      `| Pencere | ${son7.ilk}→${son7.son} | ${onceki7.ilk}→${onceki7.son} | — |`
    );
    const satir = (etiket, alan) =>
      L.push(
        `| ${etiket} | ${son7[alan]} | ${onceki7[alan]} | ${deltaMetni(son7[alan], onceki7[alan])} |`
      );
    satir("Oturum", "oturum");
    satir("Kullanıcı", "kullanici");
    satir("Yeni kullanıcı", "yeni");
    satir("Etkileşimli oturum", "etkilesimli");
    L.push(
      `| Etkileşim oranı | ${yuzde(son7.etkilesimli, son7.oturum)} | ${yuzde(onceki7.etkilesimli, onceki7.oturum)} | — |`
    );
    satir("Anahtar olay", "anahtar");
    L.push("");
  }
  if (donem) {
    L.push(
      `Dönem toplamı (${donem.ilk}→${donem.son}): ${donem.oturum} oturum / ${donem.kullanici} kullanıcı / ${donem.etkilesimli} etkileşimli oturum (${yuzde(donem.etkilesimli, donem.oturum)}) / ${donem.anahtar} anahtar olay.`
    );
  }
  L.push(
    `Küçük hacim kuralı: iki pencerede de ${KUCUK_HACIM_ESIK}'un altındaki sayılardan trend çıkarılmaz; "(küçük hacim)" işaretli delta yalnız bağlamdır.`
  );
  L.push("");

  // (b) kaynak dağılımı
  const toplamOturum = donem?.oturum ?? 0;
  L.push("## Kaynak dağılımı");
  L.push("");
  L.push("Kanal grubu (GA4 varsayılan kanal grubu):");
  L.push("");
  L.push("| Kanal | Oturum | Pay | Kullanıcı | Etkileşimli | Anahtar olay |");
  L.push("|---|---|---|---|---|---|");
  for (const r of v.kanallar) {
    L.push(
      `| ${String(r.sessionDefaultChannelGroup)} | ${num(r.sessions)} | ${yuzde(num(r.sessions), toplamOturum)} | ${num(r.totalUsers)} | ${num(r.engagedSessions)} | ${num(r.keyEvents)} |`
    );
  }
  L.push("");
  const kaynaklar = kaynakOzeti(v.kaynaklar);
  L.push(
    `İlk 10 kaynak / ortam (${Math.min(10, kaynaklar.length)} / ${kaynaklar.length}):`
  );
  L.push("");
  L.push(
    "| Kaynak / ortam | Kampanya | Oturum | Kullanıcı* | Etkileşimli | Anahtar olay | AI |"
  );
  L.push("|---|---|---|---|---|---|---|");
  for (const k of kaynaklar.slice(0, 10)) {
    L.push(
      `| ${k.ad} | ${k.kampanyalar.join(", ") || "—"} | ${k.oturum} | ${k.kullanici} | ${k.etkilesimli} | ${k.anahtar} | ${k.ai ? "E" : "H"} |`
    );
  }
  L.push("");
  L.push("*Kampanya satırlarının toplamı; tekil kullanıcı değildir.");
  L.push("");
  if (v.kampanyalar.length > 0) {
    L.push("Kampanya kırılımı (utm_campaign × utm_content × utm_term):");
    L.push("");
    L.push(
      "| Kampanya | Kaynak / ortam | İçerik | Terim | Oturum | Etkileşimli | Anahtar olay |"
    );
    L.push("|---|---|---|---|---|---|---|");
    for (const r of v.kampanyalar) {
      L.push(
        `| ${String(r.sessionCampaignName)} | ${String(r.sessionSource)} / ${String(r.sessionMedium)} | ${String(r.sessionManualAdContent)} | ${String(r.sessionManualTerm)} | ${num(r.sessions)} | ${num(r.engagedSessions)} | ${num(r.keyEvents)} |`
      );
    }
    L.push("");
  }
  const sizinti = kaynakSizintisi(v.kaynaklar);
  if (sizinti.length > 0) {
    L.push(
      `Uyarı — olay parametresi \`source\` oturum kaynağına sızmış görünüyor: ${sizinti.map((s) => `${s.kaynak} (${s.oturum} oturum)`).join(", ")}. Bu değerler trafik kaynağı değil, olayın \`source\` parametresi (BookingCtaSource / tel-link / mailto-link).`
    );
    L.push("");
  }
  for (const k of dusukEtkilesim(kaynaklar)) {
    L.push(
      `Uyarı — düşük etkileşim: ${k.ad} ${k.oturum} oturum, ${k.etkilesimli} etkileşimli (${yuzde(k.etkilesimli, k.oturum)}). E-posta güvenlik tarayıcılarının bağlantı ön-tıklaması bu imzayı üretir (her bağlantıya eşit tık, oturum = kullanıcı, etkileşim yok); insan ziyareti sayısı olarak okunmamalı — etkileşimli oturum daha doğru ölçüdür.`
    );
    L.push("");
  }

  // (c) AI yönlendirmeleri
  const ai = v.ai;
  L.push("## AI yönlendirmeleri");
  L.push("");
  L.push(
    'Tanım: oturum kaynağı AI_KAYNAKLARI listesine (ga4-pull.mjs) uyan ya da GA4\'ün kendi "AI Assistant" kanalına düşen oturumlar. GEO turunun (docs/strateji/GEO-Olcum-Rutini.md) tamamlayıcısıdır: tur, motorun cevabında görünüp görünmediğimizi ölçer; bu bölüm cevaptan tıklayıp siteye geleni.'
  );
  L.push("");
  if (ai.ilkVeriGunu && ai.ilkVeriGunu > v.aiStart) {
    L.push(
      `Not: mülkte ilk veri günü ${ai.ilkVeriGunu}; ${v.aiStart} → ${gunEkle(ai.ilkVeriGunu, -1)} arası GA4'te veri yok. "Cutover'dan beri" fiilen ${ai.ilkVeriGunu} tarihinden beri.`
    );
    L.push("");
  }
  L.push(
    `| Motor | Dönem oturum (${v.start}→${v.end}) | ${v.aiStart} tarihinden beri oturum | Etkileşimli | Anahtar olay | Kaynak değeri |`
  );
  L.push("|---|---|---|---|---|---|");
  if (ai.motorlar.length === 0) L.push("| — | 0 | 0 | 0 | 0 | — |");
  for (const m of ai.motorlar) {
    L.push(
      `| ${m.motor} | ${m.donemOturum} | ${m.oturum} | ${m.etkilesimli} | ${m.anahtar} | ${m.kaynaklar.join(", ")} |`
    );
  }
  L.push(
    `| **Toplam** | **${ai.toplam.donemOturum}** (${yuzde(ai.toplam.donemOturum, ai.donemTumOturum)} / ${ai.donemTumOturum}) | **${ai.toplam.oturum}** (${yuzde(ai.toplam.oturum, ai.tumOturum)} / ${ai.tumOturum}) | ${ai.toplam.etkilesimli} | ${ai.toplam.anahtar} | — |`
  );
  L.push("");
  L.push(
    `Liste ↔ GA4 kanalı: listeyle ${ai.uyum.listeOturum} oturum, GA4 "AI Assistant" kanalıyla ${ai.uyum.kanalOturum} oturum.${ai.uyum.yalnizListe.length ? ` Yalnız listede: ${ai.uyum.yalnizListe.join(", ")}.` : ""}${ai.uyum.yalnizKanal.length ? ` Yalnız GA4 kanalında (listeye eklenmeli mi?): ${ai.uyum.yalnizKanal.join(", ")}.` : ""}`
  );
  L.push("");
  L.push(`Açılış sayfaları (${v.aiStart} tarihinden beri, yol bazında):`);
  if (ai.sayfalar.length === 0) L.push("  - yok");
  for (const p of ai.sayfalar) {
    L.push(
      `  - ${p.yol} — ${p.oturum} oturum · ${p.etkilesimli} etkileşimli · ${p.anahtar} anahtar olay · ${p.motorlar.join(", ")}`
    );
  }
  L.push("");
  L.push(
    "Haftalık seri (Pazartesi başlangıçlı; ilk ve son hafta kısmi olabilir):"
  );
  L.push("");
  L.push("| Hafta | Aralık | AI oturum | Tüm oturum | AI payı |");
  L.push("|---|---|---|---|---|");
  for (const h of ai.haftalar) {
    L.push(
      `| ${h.hafta} | ${h.ilk}→${h.son} | ${h.ai} | ${h.toplam} | ${yuzde(h.ai, h.toplam)} |`
    );
  }
  L.push("");

  // (d) form / brief
  const lead = v.lead;
  const ayKiyasi = lead.gunSayisi >= 28 && lead.gunSayisi <= 31;
  L.push("## Form / brief — yol haritası ölçüsü");
  L.push("");
  L.push(
    `Hedef: ayda ${FORM_HEDEF_AYLIK}+ nitelikli form/brief (Yol-Haritasi-Satin-Alma-Niyeti-2026-09.md §5). GA4 gönderimi sayar, niteliği bilmez — nitelik e-posta kutusundan elle teyit edilir. "Form" = Meta'ya Lead giden beş olay (docs/12 §2.0, ADR-036).`
  );
  L.push("");
  L.push(
    `| Olay | Tür | Anahtar olay | Dönem olay (${lead.gunSayisi} gün) | Dönem anahtar olay | Son 7 gün |`
  );
  L.push("|---|---|---|---|---|---|");
  for (const o of LEAD_OLAYLARI) {
    const t = lead.toplam[o.ad] ?? { olay: 0, anahtar: 0, son7: 0 };
    L.push(
      `| ${o.ad} — ${o.etiket} | ${o.tur} | ${o.anahtar ? "beklenir" : "hayır (bilinçli)"} | ${t.olay} | ${t.anahtar} | ${t.son7} |`
    );
  }
  L.push("");
  L.push(
    `**Form/brief toplamı: ${lead.formToplam}** (${lead.start}→${lead.end}, ${lead.gunSayisi} gün; son 7 gün ${lead.formSon7}) — hedef ${FORM_HEDEF_AYLIK}+/ay: ${ayKiyasi ? (lead.formToplam >= FORM_HEDEF_AYLIK ? "hedefte" : "ALTINDA") : "kıyas yalnız 28-31 günlük pencerede"}.`
  );
  L.push("");
  L.push("Lead olayı görülen günler:");
  const doluGunler = lead.gunler.filter((g) =>
    Object.values(g.sayilar).some((n) => n > 0)
  );
  if (doluGunler.length === 0) L.push("  - yok");
  for (const g of doluGunler) {
    const parca = Object.entries(g.sayilar)
      .filter(([, n]) => n > 0)
      .map(([ad, n]) => `${ad} ${n}`)
      .join(", ");
    L.push(`  - ${g.date}: ${parca}`);
  }
  L.push("");

  // (e) açılış sayfaları
  L.push("## Açılış sayfaları");
  L.push("");
  L.push(
    `İlk 15 (yol bazında, sorgu dizesi atılmış; ${Math.min(15, v.sayfalar.length)} / ${v.sayfalar.length}):`
  );
  L.push("");
  const sayfaBaslik =
    "| Sayfa | Oturum | Etkileşimli | Etk. oranı | Ort. süre (sn) | Anahtar olay |";
  const sayfaSatir = (s) =>
    `| ${s.yol} | ${s.oturum} | ${s.etkilesimli} | ${yuzde(s.etkilesimli, s.oturum)} | ${sn(s.oturum > 0 ? s.sureToplam / s.oturum : NaN)} | ${s.anahtar} |`;
  L.push(sayfaBaslik);
  L.push("|---|---|---|---|---|---|");
  for (const s of v.sayfalar.slice(0, 15)) L.push(sayfaSatir(s));
  L.push("");
  const niyetli = v.sayfalar.filter((s) => s.tur);
  const niyetliOturum = niyetli.reduce((t, s) => t + s.oturum, 0);
  const niyetliEtk = niyetli.reduce((t, s) => t + s.etkilesimli, 0);
  L.push(
    "Niyetli karar içeriği — hizmet sayfaları (/tr/hizmetler/*, /en/services/*) + karar yazıları (fiyatlari, nasil-secilir, pricing, how-to-choose, buyuk-danismanlik, big-consultancy, platform-danismanligi, platform-consulting):"
  );
  L.push("");
  L.push(
    "| Sayfa | Tür | Oturum | Etkileşimli | Etk. oranı | Ort. süre (sn) | Anahtar olay |"
  );
  L.push("|---|---|---|---|---|---|---|");
  if (niyetli.length === 0) L.push("| — | — | 0 | 0 | - | - | 0 |");
  for (const s of niyetli) {
    L.push(
      `| ${s.yol} | ${s.tur} | ${s.oturum} | ${s.etkilesimli} | ${yuzde(s.etkilesimli, s.oturum)} | ${sn(s.oturum > 0 ? s.sureToplam / s.oturum : NaN)} | ${s.anahtar} |`
    );
  }
  L.push("");
  L.push(
    `Niyetli içerik toplamı: ${niyetliOturum} oturum (${yuzde(niyetliOturum, toplamOturum)} / ${toplamOturum}), ${niyetliEtk} etkileşimli — hizmet ${niyetli.filter((s) => s.tur === "hizmet").reduce((t, s) => t + s.oturum, 0)}, karar ${niyetli.filter((s) => s.tur === "karar").reduce((t, s) => t + s.oturum, 0)}.`
  );
  L.push("");

  // (f) anahtar olaylar
  const d = v.denetim;
  L.push("## Anahtar olaylar");
  L.push("");
  L.push(
    d.kaynak === "admin"
      ? "Kaynak: GA4 Admin API (keyEvents, salt okuma)."
      : "Kaynak: Data API `isKeyEvent` — Admin API okunamadı; dönemde hiç tetiklenmeyen olayın işaretli olup olmadığı bu yoldan görülemez."
  );
  L.push("");
  L.push(
    `İşaretli (${d.isaretli.length}): ${d.isaretli.map((k) => `${k.ad} [${k.sayim}]`).join(", ") || "—"}`
  );
  L.push("");
  L.push(
    d.eksik.length
      ? `UYARI — beklenen ama işaretsiz lead olayları (SITE_KEY_EVENTS): ${d.eksik.join(", ")}. Dönüşüm sayılmıyor; Google Ads içe aktarımı da görmüyor.`
      : d.kaynak === "admin"
        ? "Beklenen yedi lead olayının (SITE_KEY_EVENTS) hepsi işaretli."
        : "Beklenen listeyle kıyas yapılamadı (Admin API yok)."
  );
  for (const f of d.fazla)
    L.push(`  - Beklenen dışı işaretli: ${f.ad} — ${f.not}`);
  if (d.sessiz.length) {
    L.push(`  - İşaretli ama dönemde 0 olay: ${d.sessiz.join(", ")}.`);
  }
  L.push(
    `  - Bilinçli işaretsiz (huni adımı): ${d.bilincliIsaretsiz.join(", ")}.`
  );
  L.push("");

  // (g) kapsam notu
  L.push("## Kapsam notu — GA4 neyi görmüyor");
  L.push("");
  L.push(
    "  - ADR-035: Türkiye'de (ve EEA/UK dışındaki tüm bölgelerde) dört onay sinyali varsayılan `granted` — TR trafiği şerit kararını beklemeden ölçülür. EEA/UK'de varsayılan `denied`: onay vermeyen ziyaretçinin oturumu raporda yok ve bu hacimde Google'ın davranış modellemesi devreye girmez. Yani EEA/UK trafiği eksik yönde sayılır."
  );
  L.push(
    "  - ADR-034: GA4 GTM'den yüklenir; reklam engelleyici GTM'i keserse oturum hiç ölçülmez (hata yönü: az ölçüm). Lead'in Meta tarafı yalnız sunucudan gider (ADR-036) — GA4 ile Meta lead sayıları birebir tutmak zorunda değil."
  );
  if (son7 && son7.oturum < 100) {
    L.push(
      `  - Hacim: son 7 günde ${son7.oturum} oturum; tek bir ziyaret yüzdeleri oynatır. Oranlar bağlamdır, alarm değildir.`
    );
  }
  const kirli = kirliKesisim(v.start, v.end);
  for (const k of kirli) {
    L.push(
      `  - Pencere bilinen kusurla kesişiyor (${k.ilk}→${k.son}): ${k.not}`
    );
  }
  const aiKirli = kirliKesisim(v.aiStart, v.end).filter(
    (k) => !kirli.includes(k)
  );
  for (const k of aiKirli) {
    L.push(
      `  - AI serisi bilinen kusurla kesişiyor (${k.ilk}→${k.son}): ${k.not}`
    );
  }
  if (v.akislar && v.akislar.length) {
    L.push(
      `  - Veri akışları (mülk toplamı raporlanır): ${v.akislar.map((a) => `${a.olcumKimligi} "${a.ad}"`).join(" · ")}.`
    );
  }
  for (const u of v.uyarilar ?? []) L.push(`  - ${u}`);
  L.push("");
  return L.join("\n");
}

// ------------------------------------------------------------------- API

/**
 * Google hata gövdesinden okunur bir mesaj çıkarır. Yalnız `error.message`
 * ve durum kodu yazılır — istek başlığı / token asla.
 */
export function apiHataMesaji(islem, status, govde) {
  let mesaj = String(govde ?? "").slice(0, 300);
  try {
    const j = JSON.parse(String(govde));
    if (j?.error?.message)
      mesaj = `${j.error.status ?? ""} ${j.error.message}`.trim();
  } catch {
    // Gövde JSON değil — ham metnin başı yeter.
  }
  if (status === 401 || status === 403) {
    return `Yetki hatası (${islem}, HTTP ${status}): ${mesaj}\nKontrol: servis hesabı mülkte en az Görüntüleyici mi? Google Analytics Data API (ve Admin API) servis hesabının projesinde etkin mi?`;
  }
  if (status === 429) {
    return `Kota aşıldı (${islem}, HTTP 429): ${mesaj}\nGA4 Data API saatlik/günlük token kotası doldu; bir saat sonra yeniden dene.`;
  }
  return `API hatası (${islem}, HTTP ${status}): ${mesaj}`;
}

async function apiCagri(token, url, body, islem) {
  const res = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok)
    throw new Error(apiHataMesaji(islem, res.status, await res.text()));
  return res.json();
}

/** Örnekleme / eşikleme / "(other)" satırı — sorgular arası birikir. */
const veriUyarilari = new Set();

/**
 * `runReport` — sayfalı. Satırlar `{ boyut: string, metrik: number }`
 * nesnelerine çevrilir; `date` ISO'ya.
 */
async function runReport(token, property, ad, body) {
  const out = [];
  const LIMIT = 100000;
  let offset = 0;
  for (;;) {
    const data = await apiCagri(
      token,
      `${DATA_BASE}/properties/${property}:runReport`,
      { ...body, limit: LIMIT, offset },
      `runReport ${ad}`
    );
    const boyutAdlari = (data.dimensionHeaders ?? []).map((h) => h.name);
    const metrikAdlari = (data.metricHeaders ?? []).map((h) => h.name);
    const md = data.metadata ?? {};
    if (md.subjectToThresholding)
      veriUyarilari.add(
        `${ad}: GA4 eşikleme uyguladı (küçük sayılar gizlenmiş olabilir).`
      );
    if (md.samplingMetadatas?.length)
      veriUyarilari.add(`${ad}: örneklenmiş veri.`);
    if (md.dataLossFromOtherRow)
      veriUyarilari.add(
        `${ad}: satırların bir kısmı "(other)" altında toplandı.`
      );
    const batch = data.rows ?? [];
    for (const r of batch) {
      const o = {};
      boyutAdlari.forEach((d, i) => {
        const val = r.dimensionValues?.[i]?.value ?? "";
        o[d] = d === "date" ? ga4Tarih(val) : val;
      });
      metrikAdlari.forEach((m, i) => {
        o[m] = Number(r.metricValues?.[i]?.value ?? 0);
      });
      out.push(o);
    }
    offset += batch.length;
    if (batch.length === 0 || offset >= (data.rowCount ?? 0)) break;
  }
  return out;
}

const dims = (...n) => n.map((name) => ({ name }));
const mets = (...n) => n.map((name) => ({ name }));
const azalanOturum = [{ metric: { metricName: "sessions" }, desc: true }];

function yaz(outDir, dosya, metin, satir) {
  writeFileSync(join(outDir, dosya), metin, "utf8");
  console.log(`  ${dosya}: ${satir} satır`);
}

const oran = (v) => `${(num(v) * 100).toFixed(2)}%`;

async function main() {
  const property = arg("property", DEFAULT_PROPERTY);
  const vars = varsayilanAralik(bugun());
  const start = arg("start", vars.start);
  const end = arg("end", vars.end);
  const aiStart = arg("ai-start", AI_START_DEFAULT);
  for (const [ad, deger] of [
    ["start", start],
    ["end", end],
    ["ai-start", aiStart],
  ]) {
    if (!gecerliTarih(deger))
      throw new Error(`--${ad} geçerli bir YYYY-MM-DD tarihi olmalı: ${deger}`);
  }
  if (start > end)
    throw new Error(`--start (${start}) --end'den (${end}) sonra olamaz.`);
  if (aiStart > end)
    throw new Error(`--ai-start (${aiStart}) --end'den (${end}) sonra olamaz.`);
  if (!/^\d+$/.test(property))
    throw new Error(`--property sayısal mülk kimliği olmalı: ${property}`);

  const keyPath = resolveKeyPath();
  const outDir = arg("out", join(resolveGa4DataBase(), `haftalik-${bugun()}`));

  console.log(
    `GA4 Pull · mülk ${property} · ${start} → ${end} · AI serisi ${aiStart} → ${end}`
  );
  console.log(`Anahtar: ${keyPath}`);
  const token = await getAccessToken(keyPath, SCOPE);

  // conversions metriği (eski ad) mülkte varsa gunluk.csv'ye eklenir.
  let conversionsVar = false;
  try {
    const meta = await apiCagri(
      token,
      `${DATA_BASE}/properties/${property}/metadata`,
      null,
      "metadata"
    );
    conversionsVar = (meta.metrics ?? []).some(
      (m) => m.apiName === "conversions"
    );
  } catch (e) {
    console.warn(
      `Uyarı: metadata okunamadı, conversions atlanıyor — ${e.message.split("\n")[0]}`
    );
  }

  // Admin API — yalnız GET; okunamazsa özet veriden kurulur.
  let adminKeyEvents = null;
  let akislar = [];
  try {
    const ke = await apiCagri(
      token,
      `${ADMIN_BASE}/properties/${property}/keyEvents?pageSize=200`,
      null,
      "keyEvents.list"
    );
    adminKeyEvents = ke.keyEvents ?? [];
  } catch (e) {
    console.warn(
      `Uyarı: anahtar olay listesi okunamadı — ${e.message.split("\n")[0]}`
    );
  }
  try {
    const ds = await apiCagri(
      token,
      `${ADMIN_BASE}/properties/${property}/dataStreams?pageSize=200`,
      null,
      "dataStreams.list"
    );
    akislar = (ds.dataStreams ?? []).map((s) => ({
      olcumKimligi: s.webStreamData?.measurementId ?? s.name ?? "-",
      ad: s.displayName ?? "-",
    }));
  } catch (e) {
    console.warn(
      `Uyarı: veri akışı listesi okunamadı — ${e.message.split("\n")[0]}`
    );
  }

  const donemAraligi = [{ startDate: start, endDate: end }];
  const pen = pencereler(end);
  const araliklar = {
    son7: pen.son7,
    onceki7: pen.onceki7,
    donem: { ilk: start, son: end },
  };

  const gunlukMet = [
    "sessions",
    "totalUsers",
    "newUsers",
    "engagedSessions",
    "engagementRate",
    "keyEvents",
  ];
  if (conversionsVar) gunlukMet.push("conversions");

  const gunlukRows = await runReport(token, property, "gunluk", {
    dateRanges: donemAraligi,
    dimensions: dims("date"),
    metrics: mets(...gunlukMet),
    keepEmptyRows: true,
  });
  const haftaRows = await runReport(token, property, "hafta", {
    dateRanges: Object.entries(araliklar).map(([name, a]) => ({
      startDate: a.ilk,
      endDate: a.son,
      name,
    })),
    metrics: mets(
      "sessions",
      "totalUsers",
      "newUsers",
      "engagedSessions",
      "keyEvents"
    ),
  });
  const kanalRows = await runReport(token, property, "kanallar", {
    dateRanges: donemAraligi,
    dimensions: dims("sessionDefaultChannelGroup"),
    metrics: mets("sessions", "totalUsers", "engagedSessions", "keyEvents"),
    orderBys: azalanOturum,
  });
  const kaynakRows = await runReport(token, property, "kaynaklar", {
    dateRanges: donemAraligi,
    dimensions: dims(
      "sessionSource",
      "sessionMedium",
      "sessionDefaultChannelGroup",
      "sessionCampaignName"
    ),
    metrics: mets("sessions", "totalUsers", "engagedSessions", "keyEvents"),
    orderBys: azalanOturum,
  });
  const kampanyaRows = (
    await runReport(token, property, "kampanyalar", {
      dateRanges: donemAraligi,
      dimensions: dims(
        "sessionCampaignName",
        "sessionSource",
        "sessionMedium",
        "sessionManualAdContent",
        "sessionManualTerm"
      ),
      metrics: mets("sessions", "engagedSessions", "keyEvents"),
      orderBys: azalanOturum,
    })
  ).filter((r) => !String(r.sessionCampaignName).startsWith("("));
  const aiAraligi = [{ startDate: aiStart, endDate: end }];
  const aiHamRows = await runReport(token, property, "ai-yonlendirme", {
    dateRanges: aiAraligi,
    dimensions: dims(
      "date",
      "sessionSource",
      "sessionMedium",
      "sessionDefaultChannelGroup",
      "landingPagePlusQueryString"
    ),
    metrics: mets("sessions", "engagedSessions", "keyEvents"),
  });
  const aiToplamRows = await runReport(token, property, "ai-toplam", {
    dateRanges: aiAraligi,
    dimensions: dims("date"),
    metrics: mets("sessions"),
  });
  const sayfaRows = await runReport(token, property, "sayfalar", {
    dateRanges: donemAraligi,
    dimensions: dims("landingPagePlusQueryString"),
    metrics: mets(
      "sessions",
      "engagedSessions",
      "averageSessionDuration",
      "keyEvents",
      "totalUsers"
    ),
    orderBys: azalanOturum,
  });
  const goruntulemeRows = await runReport(token, property, "goruntuleme", {
    dateRanges: donemAraligi,
    dimensions: dims("pagePath"),
    metrics: mets("screenPageViews", "totalUsers"),
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
  });
  const olayRows = await runReport(token, property, "olaylar", {
    dateRanges: donemAraligi,
    dimensions: dims("eventName", "isKeyEvent"),
    metrics: mets("eventCount", "sessions", "totalUsers"),
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
  });
  const leadRows = await runReport(token, property, "lead", {
    dateRanges: donemAraligi,
    dimensions: dims("date", "eventName"),
    metrics: mets("eventCount", "keyEvents"),
    dimensionFilter: {
      filter: { fieldName: "eventName", inListFilter: { values: LEAD_ADLARI } },
    },
  });

  // ---------------------------------------------------------- hesap
  const hafta = haftalikToplam(haftaRows, araliklar);
  const ai = aiOzeti({
    aiRows: aiHamRows,
    toplamGunluk: aiToplamRows,
    aiStart,
    donemStart: start,
    end,
  });
  const lead = leadOzeti(leadRows, { start, end });
  const sayfalar = acilisSayfalari(sayfaRows);
  const denetim = anahtarOlayDenetimi({
    admin: adminKeyEvents,
    olaylar: olayRows,
  });
  const donemOturum = hafta.donem?.oturum ?? 0;

  // ---------------------------------------------------------- yazım
  mkdirSync(outDir, { recursive: true });

  const gunlukMap = new Map(gunlukRows.map((r) => [String(r.date), r]));
  const gunlukSatir = [["date", ...gunlukMet]];
  for (const date of gunListesi(start, end)) {
    const r = gunlukMap.get(date) ?? {};
    gunlukSatir.push([
      date,
      ...gunlukMet.map((m) =>
        m === "engagementRate" ? oran(r[m]) : num(r[m])
      ),
    ]);
  }
  yaz(outDir, "gunluk.csv", toCsv(gunlukSatir), gunlukSatir.length - 1);

  const kaynakSatir = [
    [
      "sessionSource",
      "sessionMedium",
      "sessionDefaultChannelGroup",
      "sessionCampaignName",
      "sessions",
      "totalUsers",
      "engagedSessions",
      "keyEvents",
      "aiReferral",
      "aiMotor",
    ],
  ];
  for (const r of kaynakRows) {
    const s = aiSiniflandir(r);
    kaynakSatir.push([
      r.sessionSource,
      r.sessionMedium,
      r.sessionDefaultChannelGroup,
      r.sessionCampaignName,
      r.sessions,
      r.totalUsers,
      r.engagedSessions,
      r.keyEvents,
      s.ai ? "E" : "H",
      s.motor ?? "",
    ]);
  }
  yaz(outDir, "kaynaklar.csv", toCsv(kaynakSatir), kaynakRows.length);

  yaz(
    outDir,
    "kanallar.csv",
    toCsv([
      [
        "sessionDefaultChannelGroup",
        "sessions",
        "totalUsers",
        "engagedSessions",
        "keyEvents",
      ],
      ...kanalRows.map((r) => [
        r.sessionDefaultChannelGroup,
        r.sessions,
        r.totalUsers,
        r.engagedSessions,
        r.keyEvents,
      ]),
    ]),
    kanalRows.length
  );

  yaz(
    outDir,
    "kampanyalar.csv",
    toCsv([
      [
        "sessionCampaignName",
        "sessionSource",
        "sessionMedium",
        "sessionManualAdContent",
        "sessionManualTerm",
        "sessions",
        "engagedSessions",
        "keyEvents",
      ],
      ...kampanyaRows.map((r) => [
        r.sessionCampaignName,
        r.sessionSource,
        r.sessionMedium,
        r.sessionManualAdContent,
        r.sessionManualTerm,
        r.sessions,
        r.engagedSessions,
        r.keyEvents,
      ]),
    ]),
    kampanyaRows.length
  );

  yaz(
    outDir,
    "ai-yonlendirme.csv",
    toCsv([
      [
        "date",
        "sessionSource",
        "sessionMedium",
        "aiMotor",
        "landingPagePlusQueryString",
        "sessions",
        "engagedSessions",
        "keyEvents",
      ],
      ...ai.satirlar.map((r) => [
        r.date,
        r.sessionSource,
        r.sessionMedium,
        r.motor,
        r.landingPagePlusQueryString,
        r.sessions,
        r.engagedSessions,
        r.keyEvents,
      ]),
    ]),
    ai.satirlar.length
  );

  yaz(
    outDir,
    "sayfalar.csv",
    toCsv([
      [
        "landingPagePlusQueryString",
        "niyetliTur",
        "sessions",
        "engagedSessions",
        "averageSessionDuration",
        "keyEvents",
        "totalUsers",
      ],
      ...sayfaRows.map((r) => [
        r.landingPagePlusQueryString,
        niyetliSayfaTuru(r.landingPagePlusQueryString) ?? "",
        r.sessions,
        r.engagedSessions,
        num(r.averageSessionDuration).toFixed(1),
        r.keyEvents,
        r.totalUsers,
      ]),
    ]),
    sayfaRows.length
  );

  yaz(
    outDir,
    "goruntuleme.csv",
    toCsv([
      ["pagePath", "screenPageViews", "totalUsers"],
      ...goruntulemeRows.map((r) => [
        r.pagePath,
        r.screenPageViews,
        r.totalUsers,
      ]),
    ]),
    goruntulemeRows.length
  );

  yaz(
    outDir,
    "olaylar.csv",
    toCsv([
      [
        "eventName",
        "isKeyEvent",
        "eventCount",
        "olayliOturum",
        "totalUsers",
        "olayPerOturum",
      ],
      ...olayRows.map((r) => [
        r.eventName,
        String(r.isKeyEvent) === "true" ? "E" : "H",
        r.eventCount,
        r.sessions,
        r.totalUsers,
        donemOturum > 0 ? (num(r.eventCount) / donemOturum).toFixed(3) : "",
      ]),
    ]),
    olayRows.length
  );

  yaz(outDir, "lead.csv", leadCsv(lead), lead.gunler.length + 2);

  const uyarilar = [...veriUyarilari];
  writeFileSync(
    join(outDir, "ozet.txt"),
    ozetMetni({
      property,
      start,
      end,
      aiStart,
      hafta,
      kanallar: kanalRows,
      kaynaklar: kaynakRows,
      kampanyalar: kampanyaRows,
      ai,
      lead,
      sayfalar,
      denetim,
      akislar,
      uyarilar,
    }),
    "utf8"
  );
  console.log("  ozet.txt");

  writeFileSync(
    join(outDir, "meta.txt"),
    [
      `property: ${property}`,
      `start: ${start}`,
      `end: ${end}`,
      `aiStart: ${aiStart}`,
      "dataState: GA4 (gecikme 24-48 s)",
      `akislar: ${akislar.map((a) => `${a.olcumKimligi} (${a.ad})`).join(" · ") || "-"}`,
      `anahtarOlayKaynagi: ${denetim.kaynak}`,
      `veriUyarilari: ${uyarilar.join(" | ") || "yok"}`,
      `olusturma: ${new Date().toISOString()}`,
      "",
    ].join("\n"),
    "utf8"
  );
  console.log("  meta.txt");

  // ---------------------------------------------------------- konsol
  const s7 = hafta.son7;
  const o7 = hafta.onceki7;
  console.log("Özet:");
  if (s7 && o7) {
    console.log(
      `  Oturum son 7 / önceki 7: ${s7.oturum} / ${o7.oturum} (${deltaMetni(s7.oturum, o7.oturum)}) · kullanıcı ${s7.kullanici} / ${o7.kullanici}`
    );
  }
  console.log(
    `  AI yönlendirme: dönem ${ai.toplam.donemOturum} oturum · ${aiStart} tarihinden beri ${ai.toplam.oturum} (${ai.motorlar.map((m) => `${m.motor} ${m.oturum}`).join(", ") || "yok"})`
  );
  console.log(
    `  Form/brief (${lead.gunSayisi} gün): ${lead.formToplam} · hedef ${FORM_HEDEF_AYLIK}+/ay`
  );
  console.log(
    `  Anahtar olay denetimi (${denetim.kaynak}): ${denetim.eksik.length ? `işaretsiz ${denetim.eksik.join(", ")}` : "eksik yok"}`
  );
  console.log(`Tamam → ${outDir}`);
}

// Yalnız doğrudan çalıştırıldığında koşar; import edildiğinde yan etki yok.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
