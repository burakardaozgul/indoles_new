"use client";

import * as React from "react";
import { track } from "@/lib/analytics/ga";
import { truncateParam, type FaqSurface } from "@/lib/analytics/events";

/**
 * Tüm SSS yüzeylerinin tek render'ı.
 *
 * NEDEN TEK BİLEŞEN
 * -----------------
 * SSS beş şablonda (hizmet, pillar, vaka, makale, paket) ayrı ayrı yazılmıştı
 * ve üç farklı biçime ayrışmıştı: hizmet `<details>`, diğerleri açık `<dl>`,
 * paket bir ara `<details>`ten `<dl>`ye çevrilmişti. Aynı sorunun beş kopyası
 * beş farklı karara evrildi. Tek kaynak bunu bitiriyor.
 *
 * NEDEN NATIVE `<details>`
 * ------------------------
 * Önceki açık-`<dl>` kararının gerekçesi "yapay zeka motorları ve ekran
 * okuyucular kapalı içeriği atlayabiliyor" idi. Bu, içeriği tıklamadan DOM'a
 * hiç koymayan JS akordiyonları için doğru; native `<details>` için değil:
 * metin ham HTML'in içinde durur, JS çalıştırmayan crawler'lar (GPTBot,
 * ClaudeBot, PerplexityBot) okumaya devam eder. Google mobile-first'ten beri
 * akordiyon içeriğini normal indeksler. Ekran okuyucularda `<details>` native
 * bir disclosure widget'ı olarak anons edilir. Üstelik `FAQPage` JSON-LD
 * soruları görsel durumdan bağımsız, ayrı bir kanaldan taşımaya devam eder.
 *
 * Kararı asıl zorunlu kılan şey ölçek: SSS'ler sayfa başına 4-5'ten 10-12'ye
 * çıktı ve cevaplar en az 40 kelime. Hepsi açıkken SSS bloğu sayfanın asıl
 * anlatısından uzun kalıyordu — vaka sayfalarında gövde ~450 kelimeyken SSS
 * ~500 kelimeye ulaşıyordu.
 *
 * NEDEN İSTEMCİ BİLEŞENİ — VE BEDELİ
 * ----------------------------------
 * Bu bileşen sunucuda kalıyordu; `faq_opened` olayı için istemciye taşındı.
 * Bedeli gerçek: `answer` alanı sunucuda render edilmiş React elemanı olarak
 * geçtiği için, cevap metinleri HTML'e ek olarak RSC akış yükünde de yer alır
 * (sayfa başına kabaca 6-10 KB). Karşılığında ~700 soru-cevaplık GEO
 * yatırımının gerçekten okunup okunmadığı ölçülebilir hâle geliyor —
 * bugüne kadar bunun hiçbir göstergesi yoktu.
 *
 * Bu takas ölçülebilir: yük sorun olursa çözüm, `<summary>` satırını ayrı
 * bir istemci adasına çıkarıp cevapları sunucuda bırakmaktır. Şimdilik
 * ölçülmemiş bir maliyet için mimari karmaşıklık eklenmiyor.
 */
export type FaqItem = {
  question: string;
  /** Paket sayfası persona-aware `<PersonaText>` geçiriyor; düz metin değil. */
  answer: React.ReactNode;
};

export function FaqAccordion({
  items,
  className,
  surface,
}: {
  items: readonly FaqItem[];
  /** Bölüm sarmalayıcısı çağırana ait; burada yalnız liste kabı. */
  className?: string;
  /**
   * Bloğun bulunduğu sayfa tipi — zorunlu. Beş yüzeyde görünüyor ve
   * hangisinin okunduğu ancak çağıran tarafından bilinir.
   */
  surface: FaqSurface;
}) {
  if (items.length === 0) return null;

  return (
    <div className={["border-t border-surface-2", className].filter(Boolean).join(" ")}>
      {items.map((item) => (
        <details
          key={item.question}
          className="group border-b border-surface-2 py-6"
          onToggle={(e) => {
            // Yalnız açılış sayılır: kapanış bir ilgi sinyali değil ve
            // sayılırsa açılma oranı iki katına çıkar.
            if (!e.currentTarget.open) return;
            track({
              name: "faq_opened",
              properties: { surface, question: truncateParam(item.question) },
            });
          }}
        >
          {/* `list-none` + `::-webkit-details-marker` gizleme globals.css'te;
              varsayılan üçgen yerine `+` işareti group-open ile döner. */}
          <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
            <h3 className="typography-h3 text-ink-900">{item.question}</h3>
            <span
              aria-hidden="true"
              className="text-ink-500 typography-body-md transition-transform duration-200 group-open:rotate-45 shrink-0 motion-reduce:transition-none"
            >
              +
            </span>
          </summary>
          <div className="typography-body-md text-ink-700 mt-4 max-w-prose-editorial">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}
