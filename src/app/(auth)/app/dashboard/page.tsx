import Link from "next/link";

export default function DashboardPage() {
  const actions = [
    {
      href: "/app/brief/yeni",
      eyebrow: "01",
      label: "Yeni brief gönder",
      description: "Şirket, problem, bütçe — 4 adım, 15 dakika. 1 iş günü geri dönüş.",
    },
    {
      href: "/app/rezervasyon",
      eyebrow: "02",
      label: "Rezervasyon al",
      description: "30 dakikalık ücretsiz ön görüşme. Danışman otomatik atanır.",
      primary: true,
    },
    {
      href: "/app/hesap",
      eyebrow: "03",
      label: "Hesabım",
      description: "Profil, tercihler, KVKK / GDPR talepleri.",
    },
  ];

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="typography-label uppercase text-ink-500 tracking-widest">
            Panel
          </p>
          <h1 className="typography-display-lg mt-3">Hoş geldin.</h1>
          <p className="typography-body-lg text-ink-700 mt-4 max-w-prose-editorial">
            Buradan yeni brief gönderebilir, randevu alabilir ve geçmiş
            engagement'larını takip edebilirsin.
          </p>
        </div>
      </div>

      {/* Status cards (placeholder) */}
      <dl className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Aktif brief", value: "0" },
          { label: "Yaklaşan görüşme", value: "—" },
          { label: "Son aktivite", value: "—" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-paper border border-surface-2 rounded-2xl p-8"
          >
            <dt className="typography-label uppercase tracking-widest text-ink-500">
              {s.label}
            </dt>
            <dd
              className="typography-display-lg mt-3 text-ink-900"
              style={{ fontVariationSettings: '"opsz" 9' }}
            >
              {s.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Next actions */}
      <div className="mt-16">
        <span className="typography-label uppercase tracking-widest text-ink-500">
          Sıradaki adım
        </span>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {actions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={`group flex flex-col justify-between rounded-2xl p-10 min-h-[260px] border transition-colors ${
                a.primary
                  ? "bg-ink-900 text-paper border-ink-900 hover:bg-ink-700"
                  : "bg-paper text-ink-900 border-surface-2 hover:bg-surface-2/60"
              }`}
            >
              <span
                className={`typography-label uppercase tracking-widest ${
                  a.primary ? "text-paper/70" : "text-ink-500"
                }`}
              >
                {a.eyebrow}
              </span>
              <div className="mt-auto">
                <h2
                  className={`typography-h1 ${
                    a.primary ? "text-paper" : "text-ink-900"
                  }`}
                >
                  {a.label}
                </h2>
                <p
                  className={`typography-body-sm mt-3 ${
                    a.primary ? "text-paper/80" : "text-ink-700"
                  }`}
                >
                  {a.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
