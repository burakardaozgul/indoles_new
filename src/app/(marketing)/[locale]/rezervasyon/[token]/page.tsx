import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { ManageBooking } from "@/components/marketing/booking/ManageBooking";
import { buildMetadata } from "@/lib/seo/metadata";
import type { Locale } from "@/lib/content/types";

/** Onay mailindeki `cancel_token` — tahmin edilemez ama gizli değil (spec §3.4). */
function rezervasyonPaths(token: string) {
  return {
    tr: `/tr/rezervasyon/${token}`,
    en: `/en/rezervasyon/${token}`,
  };
}

const META = {
  tr: {
    title: "Randevunu yönet",
    description: "Randevunu görüntüle, iptal et veya yeni bir saate ertele.",
  },
  en: {
    title: "Manage your booking",
    description: "View your booking, cancel it, or move it to a new time.",
  },
} as const;

/**
 * Kişiye özel bir adres: arama motoruna girmemeli (görev talimatı). Canonical
 * ve hreflang çifti diğer sayfalarla aynı `buildMetadata` yolundan geçiyor —
 * `robots: { index: false, follow: false }` bunun üzerine biniyor, tıpkı
 * `gizlilik-kvkk` sayfasının kendi `robots` override'ı gibi.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; token: string }>;
}): Promise<Metadata> {
  const { locale, token } = await params;
  return {
    ...buildMetadata({
      title: META[locale].title,
      description: META[locale].description,
      paths: rezervasyonPaths(token),
      locale,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function RezervasyonPage({
  params,
}: {
  params: Promise<{ locale: Locale; token: string }>;
}) {
  const { locale, token } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "bookingManage" });

  return (
    <>
      <V2PageHeader eyebrow={t("pageEyebrow")} title={t("pageTitle")} />
      <main className="ds-container py-16">
        <ManageBooking locale={locale} token={token} />
      </main>
    </>
  );
}
