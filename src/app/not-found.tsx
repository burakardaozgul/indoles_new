import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-prose text-center space-y-6">
        <p className="typography-label uppercase text-ink-500">404</p>
        <h1 className="typography-display-lg">Aradığın sayfa burada değil.</h1>
        <p className="typography-body-lg text-ink-700">
          Bağlantı eski olabilir ya da yanlış yazılmış olabilir. Buradan geri
          dönebilirsin.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            href="/tr"
            className="text-brand-700 underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500"
          >
            Anasayfaya dön
          </Link>
          <Link
            href="/tr/iletisim"
            className="text-ink-500 hover:text-ink-900"
          >
            İletişim
          </Link>
        </div>
      </div>
    </main>
  );
}
