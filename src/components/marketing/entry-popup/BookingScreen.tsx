"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { CalendarPicker, BOOKING_AVAILABILITY_REFRESH_EVENT } from "./CalendarPicker";
import { ConsultantCard } from "./ConsultantCard";
import { LeadFieldsForm } from "./LeadFieldsForm";
import type { PopupLeadForm } from "../../../lib/popup/types";

type Props = {
  locale: "tr" | "en";
  onBack: () => void;
  onSubmit: (form: PopupLeadForm, preferredSlot: { date: string; time: string } | null) => void;
  loading: boolean;
  turnstileSlot: React.ReactNode;
};

export function BookingScreen({ locale, onBack, onSubmit, loading, turnstileSlot }: Props) {
  const t = useTranslations("popup.booking");

  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);

  /**
   * "Bu saat az önce alındı" (409) sonrası `EntryPopup` bu olayı yayınlıyor:
   * `CalendarPicker` müsaitliği tazeliyor, biz de artık geçersiz olan seçimi
   * temizliyoruz. Ad/e-posta gibi ziyaretçi bilgileri `LeadFieldsForm`in
   * KENDİ state'inde yaşıyor — bu bileşen ona dokunmuyor, o yüzden form
   * içeriği korunuyor (spec §4, kural 3).
   */
  React.useEffect(() => {
    const clearStaleSelection = () => {
      setSelectedDate(null);
      setSelectedTime(null);
    };
    window.addEventListener(BOOKING_AVAILABILITY_REFRESH_EVENT, clearStaleSelection);
    return () => window.removeEventListener(BOOKING_AVAILABILITY_REFRESH_EVENT, clearStaleSelection);
  }, []);

  const handleSlotChange = (date: string | null, time: string | null) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const preferredSlot =
    selectedDate && selectedTime ? { date: selectedDate, time: selectedTime } : null;

  const handleFormSubmit = (form: PopupLeadForm) => {
    onSubmit(form, preferredSlot);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left column — calendar */}
      <div>
        <CalendarPicker
          locale={locale}
          onSlotChange={handleSlotChange}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />
      </div>

      {/* Right column — consultant card + form */}
      <div className="space-y-4">
        <ConsultantCard
          locale={locale}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />

        <LeadFieldsForm
          onBack={onBack}
          onSubmit={handleFormSubmit}
          loading={loading}
          submitLabel={t("submitCta")}
          extraDisabled={!preferredSlot}
        />

        {turnstileSlot}
      </div>
    </div>
  );
}
