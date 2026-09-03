"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { BookingScreen } from "./entry-popup/BookingScreen";
import { BOOKING_AVAILABILITY_REFRESH_EVENT } from "./entry-popup/CalendarPicker";
import { SuccessState } from "./entry-popup/SuccessState";
import type { PopupLeadForm } from "@/lib/popup/types";
import { usePersonaState } from "@/lib/hooks/use-persona";
import { track } from "@/lib/analytics/ga";
import { sessionId } from "@/lib/analytics/session";

/** Turnstile bayrağı (ADR-028) — `EntryPopup`/`ContactForm` ile aynı tek kaynak. */
const TURNSTILE_ENABLED = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

type BookingResult = { cancelToken: string | null; meetUrl: string | null; degraded: boolean };

/**
 * `/iletisim`in gömülü rezervasyon yüzeyi (Görev 10, spec §5).
 *
 * Popup'ta modal olarak kullanılan AYNI `BookingScreen` bileşenini modalsız,
 * doğrudan sayfa akışında render eder — ayrı bir takvim arayüzü yazılmaz.
 * `BookingScreen` zaten Dialog/modal bağlamına dokunmuyor (yalnız prop alan
 * saf bir bileşen), bu yüzden kendisinde hiçbir değişiklik gerekmedi. Bu
 * dosya `EntryPopup`in booking dalındaki orkestrasyonun (POST çağrısı,
 * Turnstile yaşam döngüsü, 409/genel hata mesajları, başarı ekranı)
 * sayfaya özel eşleniği — popup'a hiç dokunmuyor, popup'ın davranışı
 * `EntryPopup.tsx`de aynen duruyor.
 *
 * `onBack`in popup'taki anlamı ("bir önceki adıma dön") burada karşılığı
 * yok — sayfada geri dönülecek bir sihirbaz adımı yok. `LeadFieldsForm`
 * (değişmeyen bileşen) "Geri" düğmesini koşulsuz basıyor; onu ölü bırakmak
 * yerine en dürüst karşılığına bağlıyoruz: bölümün başına kaydırır.
 */
export function ContactBookingScreen({ locale }: { locale: "tr" | "en" }) {
  const t = useTranslations("popup");
  const { slug: personaSlug } = usePersonaState();

  const [stage, setStage] = React.useState<"booking" | "success">("booking");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [bookingResult, setBookingResult] = React.useState<BookingResult | null>(null);
  const [turnstileToken, setTurnstileToken] = React.useState("");

  const sectionRef = React.useRef<HTMLDivElement>(null);
  const turnstileRef = React.useRef<HTMLDivElement>(null);
  const openedAtRef = React.useRef<number>(Date.now());

  // Turnstile widget yaşam döngüsü — `EntryPopup`in booking/contact
  // aşamalarındaki aynı render/poll/remove deseni (ADR-028).
  React.useEffect(() => {
    if (!TURNSTILE_ENABLED || stage !== "booking") return;

    let cancelled = false;
    let widgetId: string | undefined;
    let attempts = 0;

    const tryRender = (): void => {
      if (cancelled) return;
      const w = window as unknown as {
        turnstile?: {
          render: (el: Element, opts: { sitekey: string | undefined; callback: (token: string) => void }) => string;
          remove: (id: string) => void;
        };
      };
      if (w.turnstile && turnstileRef.current) {
        setTurnstileToken("");
        widgetId = w.turnstile.render(turnstileRef.current, {
          sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          callback: (token: string) => setTurnstileToken(token),
        });
      } else if (attempts < 30) {
        attempts += 1;
        setTimeout(tryRender, 100);
      }
    };

    tryRender();

    return () => {
      cancelled = true;
      const w = window as unknown as { turnstile?: { remove: (id: string) => void } };
      if (widgetId && w.turnstile) {
        try {
          w.turnstile.remove(widgetId);
        } catch {
          // widget already gone
        }
      }
    };
  }, [stage]);

  const handleBack = React.useCallback(() => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleSubmit = async (
    form: PopupLeadForm,
    slot: { date: string; time: string } | null,
  ) => {
    // `BookingScreen`in `extraDisabled={!preferredSlot}` guard'ı düğmeyi
    // zaten kilitliyor; bu savunma amaçlı ikinci kapı (EntryPopup ile aynı desen).
    if (!slot) {
      setSubmitError(t("booking.genericError"));
      return;
    }
    if (TURNSTILE_ENABLED && !turnstileToken) {
      setSubmitError(
        locale === "tr"
          ? "Güvenlik doğrulaması tamamlanmadı, birkaç saniye sonra tekrar dene."
          : "The security check did not finish; try again in a few seconds.",
      );
      return;
    }
    setSubmitError(null);

    const { kvkkConsent: _kvkk, ...leadFields } = form;
    setIsSubmitting(true);

    let httpOk = false;
    let status = 0;
    let data: {
      ok?: boolean;
      reason?: string;
      cancelToken?: string;
      meetUrl?: string | null;
      degraded?: boolean;
    } = {};
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          startsAtUtc: slot.time,
          visitorTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          locale,
          lead: leadFields,
          // `/iletisim` hiçbir persona-seçim arayüzü içermiyor — `personaSlug`
          // yalnız ziyaretçi daha önce (ana sayfa/hizmetler'de) anahtarı
          // çevirdiyse ya da popup'ın Stage1'ini gördüyse dolu gelir. Boşsa
          // site genelindeki varsayılanı uydurmak yerine alanı hiç
          // GÖNDERMİYORUZ — şema (`@/lib/schemas/booking.ts`) `source:
          // "contact"` için `persona`yı opsiyonel kabul ediyor, mail/Calendar
          // tarafı da bilinmediğini dürüstçe söylüyor.
          ...(personaSlug ? { persona: personaSlug } : {}),
          // Gerçek problem seçimi (Stage1/Stage2) yalnız popup'ta var; burada
          // hiç yok. Uydurma dize basmak yerine boş dizi + `source: "contact"`
          // gönderiyoruz — şema (`@/lib/schemas/booking.ts`) bu kombinasyonu
          // `superRefine` ile açıkça kabul ediyor, mail/Calendar tarafı da
          // `source`a bakıp dürüst bir not basıyor.
          problems: [],
          source: "contact",
          kvkkConsent: true,
          elapsedMs: Date.now() - openedAtRef.current,
          ...(TURNSTILE_ENABLED ? { turnstileToken } : {}),
        }),
      });
      status = res.status;
      httpOk = res.ok;
      data = await res.json().catch(() => ({}));
    } catch {
      httpOk = false;
    }
    setIsSubmitting(false);

    if (!httpOk || !data.ok) {
      if (status === 409) {
        // "Bu saat az önce alındı" (spec §4, kural 3): mesaj gösterilir,
        // müsaitlik yeniden yüklenir, form içeriği KORUNUR — ziyaretçi
        // bilgileri `LeadFieldsForm`in kendi state'inde durur.
        setSubmitError(
          data.reason === "duplicate_email" ? t("booking.duplicateEmailError") : t("booking.slotTakenError"),
        );
        window.dispatchEvent(new Event(BOOKING_AVAILABILITY_REFRESH_EVENT));
        return;
      }
      setSubmitError(t("booking.genericError"));
      return;
    }

    setBookingResult({
      cancelToken: data.cancelToken ?? null,
      meetUrl: data.meetUrl ?? null,
      degraded: Boolean(data.degraded),
    });

    // `brief_submitted` — bkz. `EntryPopup.handleSubmitForm`daki eşdeğer not:
    // GA4 her olaya `page_location` eklediği için bu ikinci çağrı yüzeyi
    // otomatik ayrıştırılabilir kılıyor, taksonomiye yeni alan gerekmedi.
    track({ name: "brief_submitted", properties: { briefId: sessionId() } });

    setStage("success");
  };

  if (stage === "success") {
    return (
      <SuccessState
        variant="booking"
        onClose={() => {
          setStage("booking");
          setBookingResult(null);
          setSubmitError(null);
        }}
        meetUrl={bookingResult?.meetUrl ?? null}
        degraded={bookingResult?.degraded ?? false}
        cancelUrl={
          bookingResult?.cancelToken && typeof window !== "undefined"
            ? `${window.location.origin}/${locale}/rezervasyon/${bookingResult.cancelToken}`
            : null
        }
      />
    );
  }

  return (
    <div ref={sectionRef}>
      {submitError && (
        <p
          role="alert"
          className="mb-4 rounded-md border border-danger-500/40 bg-danger-50 px-3 py-2 text-sm text-danger-700"
        >
          {submitError}
        </p>
      )}
      <BookingScreen
        locale={locale}
        onBack={handleBack}
        onSubmit={handleSubmit}
        loading={isSubmitting}
        turnstileSlot={
          TURNSTILE_ENABLED ? (
            <div ref={turnstileRef} className="cf-turnstile mt-3" />
          ) : null
        }
      />
    </div>
  );
}
