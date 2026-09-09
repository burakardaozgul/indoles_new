"use client";

import * as React from "react";
import {
  readConsentCookie,
  readRegionCookie,
  writeConsentCookie,
  type ConsentState,
} from "@/lib/consent/cookie";
import { applyConsent } from "@/lib/consent/apply";
import { CONSENT_RESOLVED_EVENT } from "@/lib/consent/gate";
import { loadMetaPixel } from "@/lib/analytics/meta-pixel";

export type ConsentBannerProps = {
  /** EEA/UK başlığı — bir tercih soruluyor. */
  title: string;
  /** Diğer bölgelerin başlığı — tercih değil, bilgilendirme. */
  titleNotice: string;
  /** EEA/UK metni — analitik ve pazarlama birlikte SORULUR (opt-in). */
  body: string;
  /** Diğer bölgelerin metni — çerezler varsayılan açık, şerit BİLDİRİR (ADR-035). */
  bodyNotice: string;
  accept: string;
  /** Yalnız EEA/UK'de görünür: onayı reddeder. */
  reject: string;
  /** Yalnız diğer bölgelerde görünür: bildirimi kapatır, varsayılanı korur. */
  close: string;
  policyLabel: string;
  policyHref: string;
  /** Şeridin erişilebilir adı — ekran okuyucu bölgeyi böyle duyurur. */
  regionLabel: string;
};

/**
 * Çerez onay şeridi.
 *
 * METİN PROP OLARAK GELİR
 * -----------------------
 * `useTranslations` yerine prop: metin `messages/{tr,en}.json`'da yaşar ve
 * mevcut parite testi onu kapsar, ama bileşen saf kalır — testte gerçek
 * kopya ile doğrulanır, çeviri anahtarıyla değil. Repodaki diğer testler
 * `next-intl`i mock'ladığı için metnin kendisini değil anahtarını
 * doğruluyor; bu şerit hukuki bir yüzey, metnin kendisi test edilmeli.
 *
 * NEDEN MODAL DEĞİL ŞERİT
 * -----------------------
 * Modal içeriği engeller, focus trap gerektirir ve giriş popup'ıyla iki
 * katmanlı bir duvar kurar. Şerit sayfayı okunur bırakır; EDPB de onayın
 * "engelleyici" olmasını şart koşmuyor, **eşit kolaylıkta** olmasını
 * şart koşuyor — iki düğme de gerçek buton, aynı ağırlıkta.
 *
 * NEDEN İSTEMCİDE KARAR
 * ---------------------
 * Sayfalar SSG; bölge ve onay bilgisi çerezde. Sunucu HTML'i her ziyaretçi
 * için aynı olmak zorunda, bu yüzden şerit ilk render'da hiç basılmaz ve
 * karar `useEffect` sonrası verilir. Şerit sayfa akışının dışında sabit
 * konumda durduğu için geç görünmesi düzen kaymasına yol açmaz (CLS 0).
 *
 * İKİ AYRI YÜZEY, TEK BİLEŞEN (ADR-035)
 * -------------------------------------
 * Bölge şeridin görünürlüğünü değil **ne olduğunu** belirliyor:
 *
 *   EEA/UK  — SORU. Hiçbir çerez sorulmadan açılmaz; "Kabul et" / "Reddet".
 *   Diğer   — BİLDİRİM. Analitik ve pazarlama varsayılan açık (`ga-bootstrap`
 *             bölgesiz `default`u `granted` bildirir); "Kabul et" / "Kapat".
 *             İkisi de aynı sonucu yazar — kapatmak varsayılanı geri almaz,
 *             çünkü geri alınacak bir soru sorulmadı. Ayrıntı ve iletişim
 *             yolu aydınlatma metninde.
 *
 * Bu ADR-033'ün kararını Türkiye için tersine çevirir; gerekçe ve hukuki
 * değerlendirme ADR-035'te.
 *
 * PIXEL VARSAYILANDAN DA YÜKLENİR
 * -------------------------------
 * Diğer bölgelerde pazarlama varsayılan açık olduğu için Pixel şeride
 * tıklanmasını beklemez — beklerse "varsayılan açık" kararı yalnız Google
 * sinyallerinde geçerli olur, Meta'da olmazdı ve ikisi ayrışırdı.
 */
export function ConsentBanner({
  title,
  titleNotice,
  body,
  bodyNotice,
  accept,
  reject,
  close,
  policyLabel,
  policyHref,
  regionLabel,
}: ConsentBannerProps) {
  const [visible, setVisible] = React.useState(false);
  const [isEea, setIsEea] = React.useState(false);

  React.useEffect(() => {
    const eea = readRegionCookie() === "eea";
    setIsEea(eea);
    const stored = readConsentCookie();
    setVisible(stored === null);

    // Pazarlama izni: çerezde bir karar varsa o, yoksa bölge varsayılanı.
    // EEA'da varsayılan kapalı, diğer bölgelerde açık (ADR-035) — Google
    // sinyalleriyle Meta'nın ayrışmaması için ikisi aynı kaynaktan okunur.
    const marketingAllowed = stored ? stored.marketing === "granted" : !eea;
    if (marketingAllowed) {
      // İzin şeritteki tıklamadan önce de geçerli: bu sayfada Pixel hazır
      // olmadan tetiklenmiş olaylar da gönderilir.
      loadMetaPixel(process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "", { flushPending: true });
    }
  }, []);

  function decide(marketing: "granted" | "denied") {
    // Analitik yalnız EEA'da rıza bekler. Diğer bölgelerde varsayılan açık
    // olduğu için kapatmak onu geri almaz — geri alınacak bir soru sorulmadı.
    const analytics = marketing === "granted" || !isEea ? "granted" : "denied";
    const state: ConsentState = { analytics, marketing };
    writeConsentCookie(state);
    applyConsent(state);
    setVisible(false);
    // Giriş popup'ı bu olayı bekliyor: banner açıkken tetiklenmiyor,
    // karar verilince serbest kalıyor (bkz. use-entry-popup.ts).
    window.dispatchEvent(new CustomEvent(CONSENT_RESOLVED_EVENT));
  }

  if (!visible) return null;

  return (
    <section
      role="region"
      aria-label={regionLabel}
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-ink-200 bg-bg-pure/95 backdrop-blur-sm"
    >
      <div className="ds-container flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="max-w-2xl">
          <p className="typography-body-md font-medium text-ink-900">
            {isEea ? title : titleNotice}
          </p>
          <p className="typography-body-sm mt-1 text-ink-700">
            {isEea ? body : bodyNotice}{" "}
            <a href={policyHref} className="underline underline-offset-2">
              {policyLabel}
            </a>
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button type="button" className="btn btn-primary" onClick={() => decide("granted")}>
            {accept}
          </button>
          {/*
            EEA'da ikinci düğme gerçek bir RET; diğer bölgelerde yalnız
            bildirimi kapatır ve varsayılanı ("granted") yazar. EDPB'nin
            "eşit kolaylık" şartı ret düğmesinin bulunduğu yerde geçerli,
            yani EEA yüzeyinde — orada iki düğme de aynı ağırlıkta.
          */}
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => decide(isEea ? "denied" : "granted")}
          >
            {isEea ? reject : close}
          </button>
        </div>
      </div>
    </section>
  );
}
