import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-bg px-6 py-40">
      <div className="max-w-[60ch] space-y-6 text-center">
        <span className="eyebrow eyebrow-bare mono">404</span>
        <h1 className="typography-display-lg">Aradığın sayfa burada değil.</h1>
        <p className="typography-body-lg mx-auto max-w-[52ch] text-ink-600">
          Bağlantı eski olabilir ya da yanlış yazılmış olabilir. Buradan geri
          dönebilirsin.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link href="/tr" className="btn btn-primary">
            Anasayfaya dön
            <svg className="arrow" viewBox="0 0 14 14" aria-hidden="true">
              <path d="M3 11 L11 3 M5 3 H11 V9" stroke="currentColor" strokeWidth="1.4" fill="none" />
            </svg>
          </Link>
          <Link href="/tr/iletisim" className="btn btn-ghost">
            İletişim
          </Link>
        </div>
      </div>
    </main>
  );
}
