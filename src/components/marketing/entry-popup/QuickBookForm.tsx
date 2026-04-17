"use client";
import * as React from "react";
import { useTranslations } from "next-intl";
import { LeadFieldsForm } from "./LeadFieldsForm";
import type { PopupLeadForm } from "../../../lib/popup/types";

export function QuickBookForm(props: {
  onBack: () => void;
  onSubmit: (form: PopupLeadForm) => void;
  loading: boolean;
}) {
  const t = useTranslations("popup");
  return <LeadFieldsForm {...props} submitLabel={t("stage3.bookingCta")} />;
}
