import Link from "next/link";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { V2PageHeader } from "@/components/v2/chrome/V2PageHeader";
import { ContactCallout } from "@/components/marketing/contact-callout";
import { PersonaText } from "@/components/marketing/persona-text";
import { PersonaSwitch } from "@/components/marketing/persona-switch";
import { PackageDiagram } from "@/components/marketing/package-diagram";
import { PACKAGES } from "@/lib/content/packages";
import { getPillar } from "@/lib/content/pillars";

/**
 * Paketler — taahhüt ekseni.
 *
 * Liste `durationWeeks`'e göre sıralanır. Sıra bir argümandır: teşhis → sprint
 * → pilot → inşa. Kaynak veride zaten monoton (3 · 4 · 6 · 8 hafta,
 * 180 · 240 · 480 · 720 bin) ama dosya sırası bunu izlemiyordu, dolayısıyla
 * sayfa dört paketi "aynı türden dört şey" gibi gösteriyordu.
 *
 * Ayrım renkle değil geometriyle kurulur (ADR-015 tek accent): her paketin
 * taahhüdünün şeklini anlatan bir şeması var. Fiyat puntosu da taahhütle
 * kademelenir — 2.7 katlık fark okunmadan hissedilsin.
 */
export default async function PackagesIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as "tr" | "en";
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tPage = await getTranslations({ locale, namespace: "pages.packages" });
  const isTr = loc === "tr";

  const ordered = [...PACKAGES].sort(
    (a, b) => a.durationWeeks - b.durationWeeks,
  );
  const maxWeeks = Math.max(...ordered.map((p) => p.durationWeeks));

  const money = (p: (typeof PACKAGES)[number]) =>
    isTr
      ? `₺ ${p.pricing.TRY.toLocaleString("tr-TR")}`
      : `€ ${p.pricing.EUR.toLocaleString("en-US")}`;

  return (
    <>
      <V2PageHeader
        crumbs={[
          { label: "INDOLES", href: "/" },
          { label: tCommon("nav.packages") },
        ]}
        eyebrow={isTr ? "Paketler" : "Packages"}
        title={
          <PersonaText
            industrial={tPage("industrial.title")}
            commerce={tPage("commerce.title")}
          />
        }
        lede={
          <PersonaText
            industrial={tPage("industrial.lede")}
            commerce={tPage("commerce.lede")}
          />
        }
        aside={
          <div className="flex flex-col gap-5 md:items-end">
            <p className="typography-label uppercase text-ink-500">
              {isTr
                ? `${ordered.length} paket · ${ordered[0]!.durationWeeks}–${maxWeeks} hafta`
                : `${ordered.length} packages · ${ordered[0]!.durationWeeks}–${maxWeeks} weeks`}
            </p>
            <PersonaSwitch locale={loc} />
          </div>
        }
      />

      {/* Taahhüt ekseni — listenin sırasını açıkça söyler */}
      <section>
        <div className="ds-container">
          <p className="typography-body-md text-ink-600 max-w-[62ch]">
            {isTr
              ? "Sıra taahhüde göre: en kısa teşhisten en uzun inşaya. Nereden başlanacağı belli değilse, listenin başındaki paket tam olarak bu soruyu cevaplıyor."
              : "Ordered by commitment: from the shortest diagnostic to the longest build. When the starting point isn't obvious, the first package answers exactly that question."}
          </p>
        </div>
      </section>

      <section>
        <div className="ds-container py-12 md:py-16">
          <ol className="border-t border-surface-2">
            {ordered.map((pkg, idx) => {
              const pillar = getPillar(pkg.pillar);
              // Fiyat puntosu taahhütle büyür: 4 adımda step-2 → step-5.
              // Kademe h3 → h2 aralığında kalır. h1 (3.43rem) denendi:
              // "₺ 720.000" kolona sığmayıp iki satıra kırılıyordu.
              const priceClass = [
                "typography-h3",
                "typography-h3",
                "typography-h2",
                "typography-h2",
              ][idx];
              // Fark yalnız puntodan değil, mürekkep yoğunluğundan da gelsin.
              const priceWeight = [400, 500, 500, 600][idx];

              return (
                <li key={pkg.slug[loc]} className="border-b border-surface-2">
                  <Link
                    href={`/${locale}/paketler/${pkg.slug[loc]}`}
                    className="group grid grid-cols-1 md:grid-cols-12 items-start gap-6 md:gap-8 py-12 md:py-14 px-0 md:px-4 mx-0 md:-mx-4 rounded-lg hover:v2-surface transition-colors"
                  >
                    {/* Şema — taahhüdün şekli */}
                    <div className="md:col-span-2">
                      <PackageDiagram
                        kind={pkg.kind}
                        className="w-[110px] h-auto md:w-full max-w-[140px] opacity-80 transition-opacity group-hover:opacity-100"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <div className="typography-label uppercase tracking-widest text-ink-400">
                        0{idx + 1}
                      </div>
                      <h2 className="typography-h2 mt-2 text-ink-900 group-hover:text-brand-800 transition-colors">
                        {pkg.name[loc]}
                      </h2>
                      {/* Ad opak olabilir ("MVP Build", "AI Pilot") — karşılığı
                          adın hemen altında dursun, detay sayfasında değil. */}
                      <p className="typography-body-sm text-ink-500 mt-2 max-w-[34ch]">
                        {pkg.descriptor[loc]}
                      </p>

                      <div className="mt-4 flex items-center gap-3 typography-caption">
                        <span className="text-brand-700">{pillar?.name[loc]}</span>
                        <span className="w-px h-3 v2-surface-3" aria-hidden />
                        <span className="text-ink-500">
                          {pkg.durationWeeks} {isTr ? "hafta" : "weeks"}
                        </span>
                      </div>

                      {/* Süre ölçeği — dört satır arasında karşılaştırılabilir */}
                      {/* 1px denendi: iz (`v2-surface-3`, %6 opaklık) ekranda
                          görünmüyordu, dolayısıyla ölçek okunmuyordu. */}
                      <div
                        className="mt-3 h-0.5 w-full max-w-[180px] rounded-full bg-ink-100"
                        aria-hidden="true"
                      >
                        <div
                          className="h-0.5 rounded-full bg-brand-700"
                          style={{
                            width: `${(pkg.durationWeeks / maxWeeks) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-4">
                      <p className="typography-body-md text-ink-700 max-w-prose-editorial">
                        <PersonaText
                          industrial={pkg.outcome.industrial[loc]}
                          commerce={pkg.outcome.commerce[loc]}
                        />
                      </p>
                      {/* "Hangisi bana uygun?" cevabı içerikte zaten yazılıydı
                          ama yalnız detay sayfasında duruyordu. */}
                      <p className="mt-4 typography-caption text-ink-500">
                        <span className="text-ink-400">
                          {isTr ? "Kimin için: " : "Who it's for: "}
                        </span>
                        <PersonaText
                          industrial={pkg.whoFor.industrial[loc][0] ?? ""}
                          commerce={pkg.whoFor.commerce[loc][0] ?? ""}
                        />
                      </p>
                    </div>

                    <div className="md:col-span-3 md:text-right">
                      <div
                        className={`${priceClass} text-ink-900 whitespace-nowrap`}
                        style={{
                          fontVariationSettings: '"opsz" 9',
                          fontWeight: priceWeight,
                        }}
                      >
                        {money(pkg)}
                      </div>
                      <div className="typography-caption text-ink-500 mt-1">
                        {isTr ? "başlangıç" : "starting"}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Karşılaştırma — dört paket tek ekranda */}
      <section>
        <div className="ds-container pb-20 md:pb-28">
          <h2 className="typography-h2 text-ink-900">
            {isTr ? "Yan yana." : "Side by side."}
          </h2>
          <p className="typography-body-md mt-4 mb-10 text-ink-600 max-w-[54ch]">
            {isTr
              ? "Dördü de sabit kapsamlı. Fark, ne kadar ileri gittiğinde."
              : "All four are fixed-scope. The difference is how far each one goes."}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <caption className="sr-only">
                {isTr
                  ? "Paketlerin süre, disiplin, çıktı ve fiyat karşılaştırması"
                  : "Comparison of packages by duration, pillar, deliverable and price"}
              </caption>
              <thead>
                <tr className="border-b border-ink-200">
                  {[
                    isTr ? "Paket" : "Package",
                    isTr ? "Süre" : "Duration",
                    isTr ? "Disiplin" : "Pillar",
                    isTr ? "Ana çıktı" : "Key deliverable",
                    isTr ? "Başlangıç" : "Starting",
                  ].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="typography-label uppercase tracking-widest text-ink-500 py-4 pr-6 font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ordered.map((pkg) => (
                  <tr key={pkg.slug[loc]} className="border-b border-surface-2">
                    <th scope="row" className="py-5 pr-6 font-normal align-top">
                      <Link
                        href={`/${locale}/paketler/${pkg.slug[loc]}`}
                        className="typography-body-lg text-ink-900 hover:text-brand-800 transition-colors"
                      >
                        {pkg.name[loc]}
                      </Link>
                    </th>
                    <td className="py-5 pr-6 typography-body-sm text-ink-700 align-top whitespace-nowrap">
                      {pkg.durationWeeks} {isTr ? "hafta" : "weeks"}
                    </td>
                    <td className="py-5 pr-6 typography-body-sm text-brand-700 align-top">
                      {getPillar(pkg.pillar)?.name[loc]}
                    </td>
                    <td className="py-5 pr-6 typography-body-sm text-ink-700 align-top">
                      <PersonaText
                        industrial={pkg.deliverables.industrial[loc][0] ?? ""}
                        commerce={pkg.deliverables.commerce[loc][0] ?? ""}
                      />
                    </td>
                    <td className="py-5 typography-body-sm text-ink-900 align-top whitespace-nowrap tabular">
                      {money(pkg)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ContactCallout locale={loc} />
    </>
  );
}
