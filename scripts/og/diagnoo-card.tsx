import * as React from "react";
import { DIAGNOO_TOOL } from "@/lib/content/tools";
import { neutral, teal } from "@/lib/design/tokens";
import type { Locale } from "@/lib/content/types";

/**
 * Diagnoo OG kartı şablonu (ADR-031) — 1200×630, satır içi stil (Tailwind
 * yok; Playwright boş bir sayfada basar). Kalıp `geo-card.tsx` ile aynı:
 * aynı çerçeve, aynı altbilgi, aynı tipografi ölçeği. Renkler `tokens.ts`ten
 * okunur, ham hex burada da yazılmaz (docs/04 §11).
 *
 * Metnin tamamı `tools.ts`ten gelir — kart kendi copy'sini yazmaz. Taranan
 * mağaza adresi kartta YOK: kart yalnız araç sayfası içindir, rapor sayfaları
 * özel ve `noindex` (bkz. `share-meta.ts`).
 */
const W = 1200;
const H = 630;
const DISPLAY = "'Lexend', 'Inter', system-ui, sans-serif";
const BODY = "'Inter', system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

/** Ölçek çubuğunun genişliği — `geo-card.tsx`teki `BandScale` kabıyla aynı. */
const STRIP_W = 1072;
const BAR_H = 12;

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: W, height: H, background: neutral.bg, color: neutral.ink[900], fontFamily: DISPLAY, padding: 64, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
      {children}
      {/* `textTransform: uppercase` BİLİNÇLİ olarak YOK — `lang="tr"` altında
          CSS büyük harfe çevirme "indoles.com.tr"yi "İNDOLES.COM.TR" yapıyor
          (geo-card.tsx'te aynı gerekçe). Metin zaten olması gereken biçimde. */}
      <div style={{ position: "absolute", left: 64, bottom: 56, fontFamily: MONO, fontSize: 20, letterSpacing: 4, color: neutral.ink[500] }}>
        INDOLES · indoles.com.tr
      </div>
    </div>
  );
}

/**
 * Sinyal ağırlığı şeridi — dört boyutun 100 puanı nasıl paylaştığı
 * (`tools.ts` `signals[].weight`: 25/25/30/20, `computeHealthScore` ile
 * birebir). SVG DEĞİL HTML: `BandScale`in aksine buradaki etiketler sinyal
 * başlıklarının tamamı ("Arayüz yükü ve eylem çağrısı") ve sığmak için
 * sarmalanmaları gerekiyor — SVG `<text>` sarmalamaz.
 *
 * Çubuk genişliği `flexGrow: weight` ile ağırlığa oranlıdır; şerit ölçünün
 * kendisidir, süs değil. Renk iki teal basamağı arasında dönüşümlü: 25/25
 * yan yana iki eşit çubuk tek renkte tek bir 50'lik çubuk gibi okunuyordu.
 * Bant renkleri (`BAND_COLORS`) KULLANILMAZ — burada iyi/kötü yok, yalnız
 * paylaşım oranı var; kırmızı-yeşil skalası olmayan bir yargı uydururdu.
 */
function WeightStrip({ locale }: { locale: Locale }) {
  return (
    <div style={{ width: STRIP_W, marginBottom: 48, display: "flex", gap: 8 }}>
      {DIAGNOO_TOOL.signals.map((signal, i) => (
        <div key={signal.id} style={{ flexGrow: signal.weight, flexBasis: 0, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ height: BAR_H, borderRadius: BAR_H / 2, background: i % 2 === 0 ? teal[700] : teal[500] }} />
          <div style={{ display: "flex", gap: 10, alignItems: "baseline", paddingRight: 12 }}>
            <span style={{ fontFamily: MONO, fontSize: 22, fontVariantNumeric: "tabular-nums", color: neutral.ink[900] }}>
              {signal.weight}
            </span>
            <span style={{ fontFamily: BODY, fontSize: 17, lineHeight: 1.3, color: neutral.ink[500] }}>
              {signal.title[locale]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DiagnooToolCard({ locale }: { locale: Locale }) {
  const tool = DIAGNOO_TOOL;
  // Rozet metni içerik katmanından okunur — kart kendi "Ücretsiz"ini yazmaz.
  // `proof` dizisinin sırası `tools.ts`te yorumla sabit (7 sayfa · 2-4 dakika ·
  // TL aralığı · ücret) ve dört öğeli kalması `tools-content.test.ts` ile
  // korunuyor; ücret bilgisi son öğedir.
  const badge = tool.proof[tool.proof.length - 1]!;
  return (
    <Shell>
      <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 5, textTransform: "uppercase", color: teal[700] }}>
        {tool.eyebrow[locale]}
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <span style={{ fontSize: 104, fontWeight: 600, lineHeight: 1, letterSpacing: -4 }}>{tool.name[locale]}</span>
          <span style={{ padding: "10px 22px", borderRadius: 999, border: `2px solid ${teal[700]}`, fontFamily: MONO, fontSize: 24, letterSpacing: 4, textTransform: "uppercase", color: teal[700] }}>
            {badge[locale]}
          </span>
        </div>
        <div style={{ marginTop: 24, fontSize: 30, lineHeight: 1.35, color: neutral.ink[700], maxWidth: 1000, fontFamily: BODY }}>
          {tool.lede[locale]}
        </div>
      </div>
      <WeightStrip locale={locale} />
    </Shell>
  );
}
