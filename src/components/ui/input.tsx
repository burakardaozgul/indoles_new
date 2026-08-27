import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

/**
 * Form alanı yüzeyi.
 *
 * Aynı Tailwind zinciri `ContactForm` içinde üç yerde kopyalanmıştı (input,
 * select, textarea). Tek kaynak buradadır.
 *
 * Zemin `bg-pure` + kenarlık `ink-200`: şeffaf zemin + `surface-2` hairline
 * krem tuvalde kayboluyordu — nereye yazılacağı okunmuyordu (Burak,
 * 2026-08-27). Beyaz kuyu + görünür hairline alanı tuvalden ayırır; aynı
 * çift `ind-grid` hücrelerinin de dili.
 *
 * `ring-teal-500` = eski `ring-brand-500` (aynı hex, `brand-*` teal'in legacy
 * alias'ı) — yeni kod marka skalasını `teal-*` adıyla okur.
 */
export const fieldVariants = cva(
  "w-full rounded-xl border border-ink-200 bg-pure px-4 py-3 typography-body-md text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-teal-500 aria-invalid:border-danger-500",
);

/**
 * Select, placeholder option'ı ("Seç") seçiliyken dolu değer gibi ink-900
 * basıyordu — doldurulmamış alan doldurulmuş gibi okunuyordu. `:has` ile
 * boş value'lu option seçiliyken metin placeholder rengine düşer; gerçek
 * bir seçim yapılınca ink-900'a döner.
 */
const selectPlaceholderTone =
  "has-[option[value='']:checked]:text-ink-400";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldVariants(), className)} {...props} />
  ),
);
Input.displayName = "Input";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldVariants(), className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(fieldVariants(), selectPlaceholderTone, className)}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";
