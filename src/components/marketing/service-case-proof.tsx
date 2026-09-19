import Link from "next/link";
import { ChartNoAxesColumn } from "lucide-react";

/**
 * Hizmet detay sayfasının rakamlı kanıt şeridi (denetim bulgusu K-02).
 *
 * Hizmet sayfaları vakaya yalnız metin bağlantısı veriyordu; ölçülmüş sonuç
 * sayfanın gövdesinde hiç geçmiyordu. Bu blok, ilgili vakaların her birinin
 * en fazla üç metriğini hizmet sayfasının içine taşır.
 *
 * Şerit 2026-09-18'de iki vakaya çıktı (Burak kararı): tek müşteri bir
 * referans, iki müşteri tekrar eden bir sonuçtur. İki kart masaüstünde
 * (`lg`) yan yana, dikey ayraçla; altında alt alta, yatay ayraçla durur.
 * Tek kart geldiğinde ızgara hiç bölünmez — düzen eski tek-vaka hâline
 * birebir döner (`transform` pillar'ında bugün tek vaka var).
 *
 * Atıf zorunludur (ADR-018, docs/04 §10 — doğrulanamayan metrik yok):
 * her rakam `context` alanıyla ölçüm çerçevesini söyler, şeridin altındaki
 * künye rakamın hangi müşteriye ve hangi vakaya ait olduğunu yazar, künye
 * vakaya bağlanır. Kaynaksız rakam basılmaz — çağıran taraf metrik dizisi
 * boşsa bu bloğu hiç render etmez, metin bağlantılı hâle düşer.
 *
 * `case-metric-band.tsx` ile aynı bilgiyi taşır ama onun koyu bölüm + sayaç
 * malzemesini kullanmaz: orası vaka sayfasının tek vurgu anıdır (ADR-019),
 * burası "Devamı" bölümünün içindeki krem tuval üstü bir banttır. Sayaç yok,
 * dolayısıyla client component'e de gerek yok.
 *
 * Yerleşim: "Devamı" ızgarasının iki sütununu birden kaplar (`md:col-span-2`)
 * — 375'te metrikler alt alta, 640'tan sonra üç sütun.
 */
export function ServiceCaseProof({
  heading,
  sourceLabel,
  cases,
}: {
  heading: string;
  /** Künye öneki — mono etiket ("Kaynak" / "Source"). */
  sourceLabel: string;
  /** 1-2 vaka beklenir; sıra çağıran tarafta belirlenir. */
  cases: Array<{
    lead: string;
    clientName: string;
    caseTitle: string;
    href: string;
    /** En fazla 3 metrik beklenir; çağıran taraf dilimler. */
    metrics: Array<{ value: string; label: string; context?: string }>;
  }>;
}) {
  const twoUp = cases.length > 1;

  return (
    <div className="md:col-span-2 border-b border-surface-2 pb-10 md:pb-12">
      <h3 className="typography-h3 text-ink-900 flex items-center gap-2.5">
        <ChartNoAxesColumn
          aria-hidden="true"
          size={18}
          strokeWidth={1.5}
          className="text-teal-700 shrink-0"
        />
        {heading}
      </h3>

      {/*
        Izgara yalnız iki kart varken bölünür; tek kartta sütun hiç açılmaz ve
        kart tam genişlikte kalır. Kartlar arası boşluk gap ile değil ayraç
        kenarının kendi padding'iyle veriliyor — aynı desen metrik satırında
        da kullanılıyor, iki ölçü birbirine eklenmesin.
      */}
      <div className={`mt-6 grid grid-cols-1 ${twoUp ? "lg:grid-cols-2" : ""}`}>
        {cases.map((c, ci) => (
          <div
            key={c.href}
            className={`flex flex-col ${
              ci === 0
                ? "lg:pr-10"
                : "mt-10 pt-10 border-t border-surface-2 lg:mt-0 lg:pt-0 lg:pl-10 lg:border-t-0 lg:border-l lg:border-surface-3"
            }`}
          >
            <p className="typography-body-md text-ink-700 max-w-prose-editorial">
              {c.lead}
            </p>

            {/*
              DOM sırası dt → dd (geçerli dl); görsel sıra CSS `order` ile
              değer → etiket → bağlam. Ayraç yalnız 640 üstünde: altında
              satırlar alt alta dizilir ve dikey ayraç anlamsızlaşır.
            */}
            <dl className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-y-8">
              {c.metrics.map((m, i) => (
                <div
                  key={m.label}
                  className={`flex flex-col sm:px-6 sm:first:pl-0 sm:last:pr-0 ${
                    i > 0 ? "sm:border-l sm:border-surface-3" : ""
                  }`}
                >
                  <dt className="typography-label order-2 mt-3 text-ink-500">
                    {m.label}
                  </dt>
                  <dd className="typography-h2 tabular order-1 text-ink-900">
                    {m.value}
                  </dd>
                  {m.context ? (
                    <dd className="typography-caption order-3 mt-1.5 text-ink-500">
                      {m.context}
                    </dd>
                  ) : null}
                </div>
              ))}
            </dl>

            {/* Künye satırı iki kartta aynı hizada bitsin: `lg`de kart
                yüksekliği ızgaradan geliyor, `mt-auto` satırı tabana iter. */}
            <p className="typography-body-sm text-ink-500 mt-8 lg:mt-auto lg:pt-8">
              <span className="typography-label text-ink-500">
                {sourceLabel}
              </span>{" "}
              <Link
                href={c.href}
                className="text-teal-700 underline underline-offset-4 decoration-teal-300 hover:decoration-teal-700"
              >
                {c.clientName} — {c.caseTitle}
              </Link>{" "}
              <span aria-hidden="true" className="text-teal-700">
                →
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
