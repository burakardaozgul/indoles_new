"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { EntryPopup } from "@/components/marketing/entry-popup/EntryPopup";
import { shouldShowPopup, readPopupCookie } from "./cookie";
import { whenConsentResolved } from "@/lib/consent/gate";
import { track } from "@/lib/analytics/ga";
import { routing } from "@/lib/i18n/routing";
import type { BookingCtaSource, Pillar } from "@/lib/analytics/events";
import type { PopupStage, PersonaSlug, ProblemSlug } from "./types";

const TRIGGER_DELAY_MS = 4000;

/**
 * `/iletisim` artık kendi gömülü rezervasyon yüzeyine sahip (Görev 10);
 * global popup'ın otomatik tetiği o sayfada ikinci, çakışan bir rezervasyon
 * arayüzü açar (denetim bulgusu). Yol burada sabit yazılmıyor —
 * `routing.pathnames["/iletisim"]` ve `routing.locales`ten türetiliyor;
 * aksi halde EN karşılığı (`/en/contact`) burada ayrı elle yazılır ve
 * gelecekte rota adı değişirse sessizce senkronsuz kalırdı.
 */
const CONTACT_PATHNAMES: readonly string[] = (() => {
  const entry = routing.pathnames["/iletisim"];
  return routing.locales.map((locale) => {
    const segment = typeof entry === "string" ? entry : entry[locale];
    return `/${locale}${segment}`;
  });
})();

/**
 * Araç rotaları (spec 2026-09-02 §7, Burak kararı): araç kendi lead kapısını
 * taşır (e-posta + KVKK); URL yazan ziyaretçinin önüne popup çıkmaz. Önek
 * eşleşmesi: dizin, araç sayfası ve paylaşım sayfası birlikte kapsanır.
 */
const TOOL_PATHNAME_PREFIXES: readonly string[] = (() => {
  const entry = routing.pathnames["/araclar"];
  return routing.locales.map((locale) => {
    const segment = typeof entry === "string" ? entry : entry[locale];
    return `/${locale}${segment}`;
  });
})();

export function isAutoPopupSuppressed(pathname: string): boolean {
  if (CONTACT_PATHNAMES.includes(pathname)) return true;
  return TOOL_PATHNAME_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

type PopupInitial = {
  stage: PopupStage;
  persona: PersonaSlug | null;
  problems: ProblemSlug[];
  bookingSlot?: { date: string; time: string };
};

const DEFAULT_INITIAL: PopupInitial = { stage: "stage1", persona: null, problems: [] };

type PopupContextValue = {
  open: boolean;
  /**
   * Görüşme CTA'sını açar ve `booking_cta_clicked` olayını yazar.
   *
   * `source` zorunlu: popup'ı açan tek yol bu fonksiyon olduğu için olay
   * burada yazılınca atlanması imkânsız, ama hangi yüzeyin dönüştürdüğünü
   * ancak çağıran söyleyebilir. Kapalı birleşim yeni bir CTA'nın adsız
   * eklenmesini derleme zamanında engelliyor.
   *
   * `pillar` yalnız bilindiği yerde verilir (hizmet/paket detayı).
   */
  openPopup: (source: BookingCtaSource, pillar?: Pillar) => void;
  closePopup: () => void;
};

const PopupContext = React.createContext<PopupContextValue | null>(null);

export function PopupProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [key, setKey] = React.useState(0);
  const [initial, setInitial] = React.useState<PopupInitial>(DEFAULT_INITIAL);
  const pathname = usePathname();

  React.useEffect(() => {
    const isIframe = typeof window !== "undefined" &&
      (window.self !== window.top || new URLSearchParams(window.location.search).get("iframe") === "true");
    if (isIframe) return;

    // Sayfa zaten kendi rezervasyon akışını gösteriyor — üstüne ikinci bir
    // modal açmak sürtünme üretir (denetim bulgusu). Yalnız OTOMATİK tetik
    // bastırılıyor: `openPopup()`un elle çağrıları (nav CTA'sı gibi) bu
    // rotada da olduğu gibi çalışmaya devam eder.
    if (pathname && isAutoPopupSuppressed(pathname)) return;

    if (!shouldShowPopup()) return;

    /**
     * Çerez şeridi karar bekliyorsa zamanlayıcı hiç başlamaz: iki katmanlı
     * engel gören ziyaretçi ikisini birden kapatır ve hem onay hem lead
     * kaybedilir. Karar verilince (`indoles:consent-resolved`) gecikme
     * baştan işlemeye başlar.
     */
    let timer: ReturnType<typeof setTimeout> | undefined;
    const stopWaiting = whenConsentResolved(() => {
      timer = setTimeout(() => setOpen(true), TRIGGER_DELAY_MS);
    });
    return () => {
      stopWaiting();
      if (timer) clearTimeout(timer);
    };
  }, [pathname]);

  const openPopup = React.useCallback((source: BookingCtaSource, pillar?: Pillar) => {
    track({
      name: "booking_cta_clicked",
      // `pillar` tanımsızken alan hiç basılmaz: GA4 tanımsız değeri boş
      // dizeye çevirir ve "pillar'sız CTA" ile "pillar'ı boş CTA" ayrımı
      // kaybolur.
      properties: pillar ? { source, pillar } : { source },
    });

    const cookie = readPopupCookie();
    let next: PopupInitial = DEFAULT_INITIAL;
    if (cookie) {
      if (cookie.outcome === "completed" && cookie.submissionType === "booking") {
        next = {
          stage: "existing-booking",
          persona: cookie.persona,
          problems: cookie.problems,
          ...(cookie.bookingSlot ? { bookingSlot: cookie.bookingSlot } : {}),
        };
      } else if (cookie.persona && cookie.problems.length === 3) {
        next = { stage: "stage3", persona: cookie.persona, problems: cookie.problems };
      }
    }
    setInitial(next);
    setKey((k) => k + 1);
    setOpen(true);
  }, []);

  const closePopup = React.useCallback(() => setOpen(false), []);

  return (
    <PopupContext.Provider value={{ open, openPopup, closePopup }}>
      {children}
      <EntryPopup
        key={key}
        open={open}
        onClose={closePopup}
        initialStage={initial.stage}
        initialPersona={initial.persona}
        initialProblems={initial.problems}
        {...(initial.bookingSlot ? { initialBookingSlot: initial.bookingSlot } : {})}
      />
    </PopupContext.Provider>
  );
}

export function usePopup(): PopupContextValue {
  const ctx = React.useContext(PopupContext);
  if (!ctx) throw new Error("usePopup must be used within PopupProvider");
  return ctx;
}
