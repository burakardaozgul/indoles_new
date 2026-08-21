import * as React from "react";
import Image from "next/image";
import {
  siGoogleads,
  siGoogle,
  siGoogleanalytics,
  siGoogletagmanager,
  siMeta,
  siTiktok,
  siShopify,
  siWoocommerce,
  siWordpress,
  siHotjar,
  siMatomo,
  siPosthog,
  siHubspot,
  siSap,
  siVercel,
  siFigma,
} from "simple-icons";

/** simple-icons girdisi: tek yollu glif + marka rengi. */
type GlyphIcon = { kind: "glyph"; path: string; hex: string };
/** Yerel dosya: `simple-icons`ta olmayan markalar (ör. Türk platformları). */
type AssetIcon = { kind: "asset"; src: string };
type PlatformIcon = GlyphIcon | AssetIcon;

const glyph = (i: { path: string; hex: string }): GlyphIcon => ({
  kind: "glyph",
  path: i.path,
  hex: i.hex,
});

/**
 * LinkedIn, hukuki taleple `simple-icons`tan çıkarıldı; yol burada gömülü —
 * kütüphanenin CC0 döneminde dağıttığı standart 24x24 glif.
 */
const LINKEDIN: GlyphIcon = {
  kind: "glyph",
  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  hex: "0A66C2",
};

/**
 * Mecra, platform ve araç logoları.
 *
 * İçerik katmanı yalnız ADI tutar; logo burada çözülür. Bu ayrım bilinçli:
 * bir marka kütüphaneden çıkarsa (LinkedIn'de olduğu gibi) 12 içerik
 * dosyasına dokunulmaz, yalnız bu kayıt değişir.
 *
 * Logolar ORİJİNAL marka renkleriyle basılır (Burak, 2026-08-20). ADR-015'in
 * tek accent disiplininin bilinçli ve tek istisnası: üçüncü taraf marka
 * işareti kendi rengiyle tanınır. Bu renkler INDOLES paletine girmez.
 *
 * Kaydı olmayan isim logo YERİNE yalnız metinle görünür — marka logosu elle
 * çizilmez veya yaklaşık üretilmez (yanlış logo, logosuz olmaktan kötüdür).
 */
const REGISTRY: Record<string, PlatformIcon> = {
  // Reklam ve mecra
  "Google Ads": glyph(siGoogleads),
  Google: glyph(siGoogle),
  Meta: glyph(siMeta),
  TikTok: glyph(siTiktok),
  LinkedIn: LINKEDIN,

  // E-ticaret altyapıları
  Shopify: glyph(siShopify),
  WooCommerce: glyph(siWoocommerce),
  WordPress: glyph(siWordpress),
  // Türk e-ticaret platformları — `simple-icons`ta yok, yerel varlık.
  // Kaynak: eski site medya arşivi (`indoles_eski/medya`), işareti kırpılmış.
  İKAS: { kind: "asset", src: "/brand/platforms/ikas.png" },

  // Ölçüm ve analiz
  "Google Analytics": glyph(siGoogleanalytics),
  "Google Tag Manager": glyph(siGoogletagmanager),
  Hotjar: glyph(siHotjar),
  Matomo: glyph(siMatomo),
  PostHog: glyph(siPosthog),

  // Diğer
  HubSpot: glyph(siHubspot),
  SAP: glyph(siSap),
  Vercel: glyph(siVercel),
  Figma: glyph(siFigma),
};

export function hasPlatformIcon(name: string): boolean {
  return name in REGISTRY;
}

/** Tek platform rozeti: marka renkli logo + isim. */
export function PlatformBadge({ name }: { name: string }) {
  const icon = REGISTRY[name];

  return (
    <span className="inline-flex items-center gap-2 h-9 px-3.5 rounded-full border border-surface-3 text-ink-700 typography-body-sm whitespace-nowrap">
      {icon?.kind === "glyph" ? (
        <svg
          viewBox="0 0 24 24"
          width="15"
          height="15"
          aria-hidden="true"
          className="shrink-0"
        >
          <path d={icon.path} fill={`#${icon.hex}`} />
        </svg>
      ) : null}
      {icon?.kind === "asset" ? (
        <Image
          src={icon.src}
          alt=""
          width={15}
          height={15}
          aria-hidden="true"
          className="shrink-0"
        />
      ) : null}
      {name}
    </span>
  );
}
