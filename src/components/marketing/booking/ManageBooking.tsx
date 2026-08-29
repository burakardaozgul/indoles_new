"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { CalendarPicker } from "../entry-popup/CalendarPicker";
import type { Locale } from "@/lib/content/types";

// ADR-029 sonrası "failed" statüsü POST /api/booking yolunda hiç
// üretilmiyor (Calendar kesintisinde satır `confirmed` kalır, işaret
// `calendar_event_id IS NULL`) — arayüzün bilmesi gereken tek ayrım
// "cancelled" olup olmadığı, tip buna göre daraltıldı.
type BookingStatus = "confirmed" | "cancelled";

type Booking = {
  startsAtUtc: string;
  endsAtUtc: string;
  status: BookingStatus;
  meetUrl: string | null;
  locale: Locale;
};

type LoadState =
  | { kind: "loading" }
  | { kind: "not_found" }
  | { kind: "loaded"; booking: Booking };

type Props = {
  locale: Locale;
  token: string;
};

/**
 * Onay mailindeki bağlantının açtığı sayfa: oturum açma gerektirmez, yalnız
 * `cancel_token` sahibinin randevusunu açar (spec §3.4). Üç eylem: görüntüle,
 * iptal et, ertele. Erteleme AYNI `CalendarPicker`'ı kullanır — burada yeni
 * bir takvim arayüzü çizilmiyor (spec §3.4: "Yeni arayüz çizilmez").
 */
export function ManageBooking({ locale, token }: Props) {
  const t = useTranslations("bookingManage");
  const [state, setState] = React.useState<LoadState>({ kind: "loading" });

  const [cancelConfirming, setCancelConfirming] = React.useState(false);
  const [cancelling, setCancelling] = React.useState(false);
  const [cancelError, setCancelError] = React.useState<string | null>(null);

  const [rescheduling, setRescheduling] = React.useState(false);
  const [reschedulingSubmitting, setReschedulingSubmitting] = React.useState(false);
  const [rescheduleError, setRescheduleError] = React.useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = React.useState<string | null>(null);
  const [rescheduleTime, setRescheduleTime] = React.useState<string | null>(null);
  // Erteleme paneli başarıyla kapanınca üstteki yeni saat zaten görünür
  // oluyor, ama bunun BİLİNÇLİ bir sonuç olduğunu (yanlışlıkla değişmiş bir
  // randevu değil) doğrulayan ayrı bir onay yoktu — `rescheduleSuccess`
  // anahtarı tanımlıydı ama hiç okunmuyordu. Yeni bir erteleme denemesi
  // başlayınca (panel yeniden açılınca) temizleniyor.
  const [rescheduleSuccessVisible, setRescheduleSuccessVisible] = React.useState(false);
  // `CalendarPicker`i tazelemek için: 409/422 sonrası bayat müsaitlik
  // listesiyle kalmasın diye bileşeni yeniden monte ediyoruz. Burada,
  // `EntryPopup`in aksine, korunması gereken ayrı bir lead formu yok —
  // sade bir `key` artışı yeterli.
  const [calendarKey, setCalendarKey] = React.useState(0);

  const load = React.useCallback(() => {
    fetch(`/api/booking/${token}`)
      .then((r) => r.json())
      .then((d: { ok: boolean; booking?: Booking }) => {
        if (d.ok && d.booking) setState({ kind: "loaded", booking: d.booking });
        else setState({ kind: "not_found" });
      })
      .catch(() => setState({ kind: "not_found" }));
  }, [token]);

  React.useEffect(() => {
    load();
  }, [load]);

  const visitorTimeZone = React.useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  );

  const formatDateTime = React.useCallback(
    (iso: string) => {
      const intlLocale = locale === "tr" ? "tr-TR" : "en-GB";
      const local = new Intl.DateTimeFormat(intlLocale, {
        dateStyle: "full",
        timeStyle: "short",
      }).format(new Date(iso));
      if (visitorTimeZone === "Europe/Istanbul") return { local, istanbul: null as string | null };
      const istanbul = new Intl.DateTimeFormat(intlLocale, {
        timeZone: "Europe/Istanbul",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(iso));
      return { local, istanbul };
    },
    [locale, visitorTimeZone],
  );

  const handleCancel = async () => {
    setCancelling(true);
    setCancelError(null);
    try {
      const res = await fetch(`/api/booking/${token}`, { method: "DELETE" });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || !data.ok) {
        setCancelError(t("cancelError"));
        setCancelling(false);
        return;
      }
      // İdempotent (spec §4, kural 7): `alreadyCancelled` de aynı "iptal
      // edildi" görünümüne düşer — ikinci tıklama hata değil.
      setState((prev) =>
        prev.kind === "loaded" ? { kind: "loaded", booking: { ...prev.booking, status: "cancelled" } } : prev,
      );
      setCancelConfirming(false);
      setCancelling(false);
    } catch {
      setCancelError(t("cancelError"));
      setCancelling(false);
    }
  };

  const handleReschedule = async () => {
    if (!rescheduleTime) return;
    setReschedulingSubmitting(true);
    setRescheduleError(null);
    try {
      const res = await fetch(`/api/booking/${token}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ startsAtUtc: rescheduleTime }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        reason?: string;
        startsAtUtc?: string;
        endsAtUtc?: string;
      };
      setReschedulingSubmitting(false);

      if (!res.ok || !data.ok) {
        if (res.status === 409) {
          setRescheduleError(t("rescheduleTakenError"));
        } else if (res.status === 422) {
          setRescheduleError(t("rescheduleInvalidError"));
        } else {
          setRescheduleError(t("rescheduleGenericError"));
        }
        // Bayat listeyle kalınmıyor: takvim tazeleniyor, seçim temizleniyor.
        setRescheduleDate(null);
        setRescheduleTime(null);
        setCalendarKey((k) => k + 1);
        return;
      }

      setState((prev) =>
        prev.kind === "loaded" && data.startsAtUtc && data.endsAtUtc
          ? { kind: "loaded", booking: { ...prev.booking, startsAtUtc: data.startsAtUtc, endsAtUtc: data.endsAtUtc } }
          : prev,
      );
      setRescheduling(false);
      setRescheduleDate(null);
      setRescheduleTime(null);
      setRescheduleSuccessVisible(true);
    } catch {
      setReschedulingSubmitting(false);
      setRescheduleError(t("rescheduleGenericError"));
    }
  };

  if (state.kind === "loading") {
    return (
      <p role="status" className="typography-body-md text-ink-500">
        {t("loading")}
      </p>
    );
  }

  if (state.kind === "not_found") {
    // Sessiz boş kutu yok (spec §4): dürüst mesaj + iletişim yolu.
    return (
      <div role="status" className="max-w-popup">
        <h1 className="typography-h1 text-ink-900">{t("notFoundTitle")}</h1>
        <p className="typography-body-md text-ink-500 mt-3">{t("notFoundBody")}</p>
      </div>
    );
  }

  const { booking } = state;

  if (booking.status === "cancelled") {
    return (
      <div className="max-w-popup">
        <h1 className="typography-h1 text-ink-900">{t("cancelledTitle")}</h1>
        <p className="typography-body-md text-ink-500 mt-3">{t("cancelledBody")}</p>
      </div>
    );
  }

  const { local, istanbul } = formatDateTime(booking.startsAtUtc);

  return (
    <div className="max-w-160">
      <h1 className="typography-h1 text-ink-900">{t("activeTitle")}</h1>
      <p className="typography-body-md text-ink-900 mt-3">
        {local}
        {istanbul && (
          <span className="block typography-body-sm text-ink-500 mt-1">
            {t("istanbulTimeLabel", { time: istanbul })}
          </span>
        )}
      </p>

      {booking.meetUrl ? (
        <p className="mt-4">
          <a
            href={booking.meetUrl}
            className="typography-body-md text-teal-700 underline underline-offset-4 hover:text-teal-800"
          >
            {t("meetLink")}
          </a>
        </p>
      ) : (
        <p className="typography-body-sm text-ink-500 mt-4">{t("noMeetYet")}</p>
      )}

      {rescheduleSuccessVisible && (
        <p role="status" className="mt-4 rounded-md border border-success-500/40 bg-success-50 px-3 py-2 text-sm text-success-700">
          {t("rescheduleSuccess")}
        </p>
      )}

      {cancelError && (
        <p role="alert" className="mt-4 rounded-md border border-danger-500/40 bg-danger-50 px-3 py-2 text-sm text-danger-700">
          {cancelError}
        </p>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        {!cancelConfirming && (
          <button
            type="button"
            onClick={() => {
              setRescheduling((v) => !v);
              setRescheduleSuccessVisible(false);
            }}
            className="btn btn-ghost"
          >
            {t("rescheduleCta")}
          </button>
        )}

        {!cancelConfirming && (
          <button
            type="button"
            onClick={() => setCancelConfirming(true)}
            className="typography-body-sm text-danger-700 hover:text-danger-500 underline underline-offset-4 transition-colors"
          >
            {t("cancelCta")}
          </button>
        )}

        {cancelConfirming && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="typography-body-sm text-ink-700">{t("cancelConfirmPrompt")}</span>
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="btn bg-danger-700 text-paper hover:bg-danger-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelling ? t("cancelling") : t("cancelConfirmYes")}
            </button>
            <button
              type="button"
              onClick={() => setCancelConfirming(false)}
              disabled={cancelling}
              className="typography-body-sm text-ink-500 hover:text-ink-900 underline underline-offset-4 transition-colors"
            >
              {t("cancelConfirmNo")}
            </button>
          </div>
        )}
      </div>

      {rescheduling && (
        <div className="mt-8 pt-8 border-t border-surface-2">
          <p className="typography-body-sm font-medium text-ink-900 mb-4">{t("reschedulePrompt")}</p>

          <div className="max-w-90">
            <CalendarPicker
              key={calendarKey}
              locale={locale}
              selectedDate={rescheduleDate}
              selectedTime={rescheduleTime}
              onSlotChange={(d, tm) => {
                setRescheduleDate(d);
                setRescheduleTime(tm);
              }}
            />
          </div>

          {rescheduleError && (
            <p role="alert" className="mt-4 rounded-md border border-danger-500/40 bg-danger-50 px-3 py-2 text-sm text-danger-700">
              {rescheduleError}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleReschedule}
              disabled={!rescheduleTime || reschedulingSubmitting}
              className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {reschedulingSubmitting ? t("rescheduling") : t("rescheduleConfirmCta")}
            </button>
            <button
              type="button"
              onClick={() => {
                setRescheduling(false);
                setRescheduleDate(null);
                setRescheduleTime(null);
                setRescheduleError(null);
              }}
              disabled={reschedulingSubmitting}
              className="typography-body-sm text-ink-500 hover:text-ink-900 underline underline-offset-4 transition-colors"
            >
              {t("rescheduleCancelCta")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
