import Link from "next/link";

/**
 * Kök 404 — locale segmenti hiç çözülmemiş istekler için.
 *
 * İki ayrı yerde görünür:
 *
 * 1. **Locale dışı yollar.** Pratikte nadir: `src/middleware.ts` eşleşmeyen
 *    yolları `/tr/...`'ye 307'liyor ve orada `[locale]/not-found.tsx` devreye
 *    giriyor. Buraya yalnız middleware'in muaf tuttuğu yollar düşer.
 *
 * 2. **`notFound()` sentetik kabuğunun içinde.** Next.js 15.5, render
 *    sırasında `notFound()` fırlatıldığında kök `layout.tsx`'i render etmiyor;
 *    kendi `<html id="__next_error__">` kabuğunu kuruyor ve bu dosyayı onun
 *    içine basıyor (`app-render.js` `getErrorRSCPayload`). Locale'e özgü 404
 *    gövdesi bunun ardından akıyor — yani `/en/...` bir 404'te ham HTML hem
 *    bu metni hem `[locale]/not-found.tsx`'inkini taşıyor.
 *
 * (2) yüzünden bu metin **tek dilli olamaz**: Türkçe yazıldığında JS
 * çalıştırmayan bir crawler `/en/*` 404'lerinde İngilizce gövdenin yanında
 * Türkçe bir başlık okuyordu (denetim T-08b). İki dilli tutmak bu karışıklığı
 * ortadan kaldırır; dil belli olmadığı için ikisini de göstermek dürüst olan.
 *
 * `<html lang>` burada kapatılamıyor — sentetik kabuğun özniteliğini Next
 * belirliyor. Deneysel `experimental.globalNotFound` bunu çözmüyor: o özellik
 * yalnız yönlendirme düzeyinde eşleşmeyen URL'leri kapsıyor, `notFound()`
 * çağrısını değil (denendi ve doğrulandı — bkz. `[locale]/not-found.tsx`).
 */
export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-bg px-6 py-40">
      <div className="max-w-[60ch] space-y-6 text-center">
        <span className="eyebrow eyebrow-bare mono">404</span>
        <h1 className="typography-display-lg">
          Bu adreste bir sayfa yok.
          <span className="mt-2 block text-ink-600">
            There is no page at this address.
          </span>
        </h1>
        <p className="typography-body-lg mx-auto max-w-[52ch] text-ink-600">
          Bağlantı eski olabilir ya da yanlış yazılmış olabilir. Buradan geri
          dönebilirsiniz. · The link may be outdated or mistyped. You can head
          back from here.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link href="/tr" className="btn btn-primary">
            Anasayfa
            <svg className="arrow" viewBox="0 0 14 14" aria-hidden="true">
              <path
                d="M3 11 L11 3 M5 3 H11 V9"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
              />
            </svg>
          </Link>
          <Link href="/en" className="btn btn-ghost">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
