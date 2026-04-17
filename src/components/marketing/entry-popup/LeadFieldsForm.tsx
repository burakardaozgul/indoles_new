"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import type { PopupLeadForm } from "../../../lib/popup/types";

type Props = {
  onBack: () => void;
  onSubmit: (form: PopupLeadForm) => void;
  loading: boolean;
  submitLabel: string;
};

export function LeadFieldsForm({ onBack, onSubmit, loading, submitLabel }: Props) {
  const t = useTranslations("popup");
  const [form, setForm] = React.useState<PopupLeadForm>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    company: "",
    title: "",
    kvkkConsent: false,
  });

  const update = (k: keyof PopupLeadForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [k]: k === "kvkkConsent" ? e.target.checked : e.target.value }));

  const filled =
    form.firstName.length >= 2 &&
    form.lastName.length >= 2 &&
    form.phone.length >= 7 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.company.length >= 2 &&
    form.title.length >= 2 &&
    form.kvkkConsent;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!filled || loading) return;
        onSubmit(form);
      }}
      className="space-y-3"
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label={t("form.firstName")} id="firstName" value={form.firstName} onChange={update("firstName")} />
        <Field label={t("form.lastName")} id="lastName" value={form.lastName} onChange={update("lastName")} />
      </div>
      <Field label={t("form.phone")} id="phone" type="tel" value={form.phone} onChange={update("phone")} />
      <Field label={t("form.email")} id="email" type="email" value={form.email} onChange={update("email")} />
      <Field label={t("form.company")} id="company" value={form.company} onChange={update("company")} />
      <Field label={t("form.title")} id="title" value={form.title} onChange={update("title")} />

      <label className="flex items-start gap-2 text-xs text-neutral-700 mt-4">
        <input
          type="checkbox"
          aria-label={t("meta.kvkkConsent")}
          checked={form.kvkkConsent}
          onChange={update("kvkkConsent")}
          className="mt-0.5"
        />
        <span>
          {t("meta.kvkkConsent")}{" "}
          <a
            href={t("meta.kvkkLinkHref")}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {t("meta.kvkkLink")}
          </a>
        </span>
      </label>

      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-neutral-600 hover:text-neutral-900 underline"
        >
          ← {t("meta.back")}
        </button>
        <button
          type="submit"
          disabled={!filled || loading}
          className="px-4 py-2 bg-neutral-900 text-white rounded-md text-sm disabled:opacity-40"
        >
          {loading ? t("meta.loading") : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs text-neutral-700 block mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full px-3 py-2 border border-neutral-200 rounded-md text-sm focus:outline-none focus:border-neutral-900"
      />
    </div>
  );
}
