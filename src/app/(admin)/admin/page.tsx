import Link from "next/link";

export default function AdminHome() {
  const tiles = [
    { href: "/admin/briefs", label: "Brief'ler", count: "—", hint: "Gelen / triage / aktif" },
    { href: "/admin/bookings", label: "Rezervasyonlar", count: "—", hint: "Bu hafta" },
    { href: "/admin/users", label: "Kullanıcılar", count: "—", hint: "Toplam / aktif" },
  ];

  return (
    <section>
      <div>
        <p className="typography-label uppercase tracking-widest text-ink-500">
          Admin
        </p>
        <h1 className="typography-display-lg mt-3">Özet.</h1>
        <p className="typography-body-lg text-ink-700 mt-4 max-w-prose-editorial">
          Bu hafta neler oldu, kimin dokunması gerekiyor. Daha fazla detay için
          üstteki bölümlere git.
        </p>
      </div>

      <dl className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiles.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group bg-paper border border-surface-2 rounded-2xl p-8 hover:bg-surface-2/60 transition-colors"
          >
            <dt className="typography-label uppercase tracking-widest text-ink-500">
              {t.label}
            </dt>
            <dd
              className="typography-display-lg mt-3 text-ink-900"
              style={{ fontVariationSettings: '"opsz" 9' }}
            >
              {t.count}
            </dd>
            <p className="typography-caption text-ink-500 mt-3">{t.hint}</p>
          </Link>
        ))}
      </dl>

      <section className="mt-16 bg-paper border border-surface-2 rounded-2xl p-8">
        <span className="typography-label uppercase tracking-widest text-ink-500">
          Entegrasyon durumu
        </span>
        <ul className="mt-6 divide-y divide-surface-2">
          {[
            ["Clerk auth", "✓ Hazır"],
            ["Neon Postgres", "○ Bekliyor"],
            ["Sanity CMS", "○ Bekliyor"],
            ["Cal.com", "○ Bekliyor"],
            ["Stripe + iyzico", "○ Bekliyor"],
          ].map(([name, status]) => (
            <li
              key={name}
              className="py-4 flex items-center justify-between typography-body-md"
            >
              <span className="text-ink-900">{name}</span>
              <span
                className={
                  status?.startsWith("✓")
                    ? "text-success-700 typography-body-sm"
                    : "text-ink-500 typography-body-sm"
                }
              >
                {status}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
