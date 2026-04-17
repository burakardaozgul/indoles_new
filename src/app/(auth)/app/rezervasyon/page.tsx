export default function BookingPage() {
  return (
    <section>
      <div className="max-w-[720px]">
        <p className="typography-label uppercase text-ink-500 tracking-widest">
          Rezervasyon
        </p>
        <h1 className="typography-display-lg mt-3">
          30 dakika ücretsiz görüşme
        </h1>
        <p className="typography-body-lg text-ink-700 mt-4 max-w-prose-editorial">
          Uygun slot seç, takvimine otomatik davet eklenir. Danışman pillar'a
          göre atanır.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-8">
          <div className="bg-paper border border-surface-2 rounded-2xl p-10 md:p-14 min-h-[460px] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-surface-2 grid place-items-center mb-6">
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="w-8 h-8 text-ink-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </svg>
            </div>
            <p className="typography-body-md text-ink-700 max-w-prose-editorial">
              Cal.com embed burada çıkar. Launch'a kadar iletişim sayfasından
              doğrudan e-postayla yazabilirsin.
            </p>
          </div>
        </div>
        <aside className="md:col-span-4 space-y-6">
          <div className="bg-paper border border-surface-2 rounded-2xl p-6">
            <span className="typography-label uppercase tracking-widest text-ink-500">
              Süre
            </span>
            <div className="typography-h2 mt-2">30 dakika</div>
          </div>
          <div className="bg-paper border border-surface-2 rounded-2xl p-6">
            <span className="typography-label uppercase tracking-widest text-ink-500">
              Ücret
            </span>
            <div className="typography-h2 mt-2">Ücretsiz</div>
          </div>
          <div className="bg-paper border border-surface-2 rounded-2xl p-6">
            <span className="typography-label uppercase tracking-widest text-ink-500">
              Format
            </span>
            <div className="typography-body-md mt-2 text-ink-700">
              Video (Google Meet / Zoom) veya telefon.
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
