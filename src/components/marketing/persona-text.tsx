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

/**
 * İki varyant arasına giren, tarayıcıda hiçbir koşulda görünmeyen satır sonu.
 *
 * SORUN — CSS çalıştırmayan istemciler iki cümleyi bitişik okuyor:
 * `…rekabet edemez olmak demek.Bedava büyüme dönemi bitti…`. Bu istemciler
 * (GPTBot, ClaudeBot, PerplexityBot — GEO stratejisinin hedef kitlesi)
 * `display:none`ı uygulamadıkları için iki varyantı da metne alıyor, ve
 * aradaki eleman sınırı ham metinde kayboluyor.
 *
 * ÇÖZÜM — mimari aynı kalıyor: iki varyant hâlâ DOM'da, seçimi hâlâ CSS
 * yapıyor, bileşen hâlâ server-only. Tek eklenen, iki varyantın arasına
 * düşen bir `\n`. Ayırıcı **mevcut persona seçicisinin kendisiyle** gizlenir,
 * yeni CSS kuralı yazılmaz:
 *
 *   - Ayırıcı `commerce` varyantının İÇİNDE durur ama `industrial` işareti
 *     taşır. Persona `commerce` iken dış kap görünür, ayırıcı kendi işareti
 *     yüzünden gizlenir; persona `industrial` iken dış kap zaten gizlidir ve
 *     ayırıcı onunla birlikte gider. Yani her iki durumda da görünmez.
 *   - Gizleme kanalı, sorunu üreten kanalın aynısı: stil sayfasını işleyen
 *     istemci ayırıcıyı görmez, işlemeyen istemci hem iki varyantı hem
 *     ayırıcıyı görür. İkisi tanım gereği birlikte hareket eder.
 *
 * Inline `style="display:none"` bilinçli olarak seçilmedi: metin çıkaran
 * basit ayrıştırıcıların bir kısmı harici stil sayfasını hiç okumaz ama
 * `style` özniteliğine bakar — ayırıcıyı tam da onu görmesi gereken istemci
 * atlardı. `hidden` özniteliği de aynı sebeple elendi.
 *
 * Ayırıcı boşluk karakteridir; tarayıcı tarafında görünür bir metin
 * eklemez, dolayısıyla `display:none` mekanizması bozulsa bile en kötü
 * ihtimalle bir boşluk basılır — yanlış persona metni değil.
 */
export function PersonaSeparator() {
  return (
    <span data-persona-variant="industrial" data-persona-sep aria-hidden="true">
      {"\n"}
    </span>
  );
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
      <Variant persona="commerce">
        <PersonaSeparator />
        {commerce}
      </Variant>
    </>
  );
}

/**
 * Liste varyantlarına ayırıcı eklenmez: her madde kendi `<li>`si içindedir,
 * metin çıkaran istemciler liste öğelerini zaten ayrı satır sayar. Boş bir
 * ayırıcı `<li>` eklemek liste semantiğini kirletirdi.
 */
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
