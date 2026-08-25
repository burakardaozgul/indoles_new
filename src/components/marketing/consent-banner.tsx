"use client";

import * as React from "react";
import {
  readConsentCookie,
  readRegionCookie,
  writeConsentCookie,
  type ConsentValue,
} from "@/lib/consent/cookie";
import { applyConsent } from "@/lib/consent/apply";
import { CONSENT_RESOLVED_EVENT } from "@/lib/consent/gate";

export type ConsentBannerProps = {
  title: string;
  body: string;
  accept: string;
  reject: string;
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
 */
export function ConsentBanner({
  title,
  body,
  accept,
  reject,
  policyLabel,
  policyHref,
  regionLabel,
}: ConsentBannerProps) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    setVisible(readRegionCookie() === "eea" && readConsentCookie() === null);
  }, []);

  function decide(value: ConsentValue) {
    writeConsentCookie(value);
    applyConsent(value);
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
          <p className="typography-body-md font-medium text-ink-900">{title}</p>
          <p className="typography-body-sm mt-1 text-ink-700">
            {body}{" "}
            <a href={policyHref} className="underline underline-offset-2">
              {policyLabel}
            </a>
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button type="button" className="btn btn-primary" onClick={() => decide("granted")}>
            {accept}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => decide("denied")}>
            {reject}
          </button>
        </div>
      </div>
    </section>
  );
}
