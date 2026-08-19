/**
 * Persona-aware metin primitifleri.
 *
 * İki varyantı da DOM'a basar; görüneni kök elemandaki `data-persona`'ya göre
 * CSS seçer (`globals.css` → "Persona merceği"). Seçimi React'in yapması
 * mümkün değil: sunucu `industrial` render eder, istemci cookie'yi okuyup
 * `commerce`'e geçerse hydration uyuşmazlığı çıkar — ya da uyuşmazlığı
 * önlemek için efekte ertelenir ve ticaret ziyaretçisi sanayi metnini bir an
 * için görür (FOIC). Cookie'yi ilk boyamadan önce okuyan senkron script
 * (`app/layout.tsx`) + CSS ikisini birden çözer ve sayfa statik kalır.
 *
 * Bu yüzden bileşenler client değildir — hook kullanmazlar.
 */

function Variant({ persona, children }: { persona: "industrial" | "commerce"; children: React.ReactNode }) {
  return <span data-persona-variant={persona}>{children}</span>;
}

export function PersonaText({
  industrial,
  commerce,
}: {
  industrial: string;
  commerce: string;
}) {
  // İki versiyon aynıysa DOM'u ikiye katlamanın anlamı yok.
  if (industrial === commerce) return <>{industrial}</>;
  return (
    <>
      <Variant persona="industrial">{industrial}</Variant>
      <Variant persona="commerce">{commerce}</Variant>
    </>
  );
}

export function PersonaListItems({
  industrial,
  commerce,
  variant,
}: {
  industrial: string[];
  commerce: string[];
  variant: "scope" | "numbered" | "bullet";
}) {
  return (
    <>
      {renderItems(industrial, variant, "industrial")}
      {renderItems(commerce, variant, "commerce")}
    </>
  );
}

function renderItems(
  items: string[],
  variant: "scope" | "numbered" | "bullet",
  persona: "industrial" | "commerce",
) {
  if (variant === "numbered") {
    return items.map((item, i) => (
      <li key={`${persona}-${item}`} data-persona-variant={persona} className="flex gap-4">
        <span className="typography-label text-ink-500 tracking-widest shrink-0">
          0{i + 1}
        </span>
        <span className="typography-body-md text-ink-700">{item}</span>
      </li>
    ));
  }

  if (variant === "scope") {
    return items.map((item) => (
      <li
        key={`${persona}-${item}`}
        data-persona-variant={persona}
        className="flex items-start gap-4 py-4 typography-body-md text-ink-700"
      >
        <span
          aria-hidden="true"
          className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0"
        />
        <span>{item}</span>
      </li>
    ));
  }

  // bullet (whoFor)
  return items.map((item) => (
    <li
      key={`${persona}-${item}`}
      data-persona-variant={persona}
      className="typography-body-md text-ink-700 flex items-start gap-4"
    >
      <span
        aria-hidden="true"
        className="mt-2 w-1.5 h-1.5 rounded-full bg-ink-500 shrink-0"
      />
      <span>{item}</span>
    </li>
  ));
}
