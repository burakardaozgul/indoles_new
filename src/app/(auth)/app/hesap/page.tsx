import { hasClerk } from "@/lib/auth/has-clerk";

export default async function AccountPage() {
  const clerk = hasClerk();
  const user = clerk
    ? await (await import("@clerk/nextjs/server")).currentUser()
    : null;

  return (
    <section>
      <div className="max-w-[720px]">
        <p className="typography-label uppercase text-ink-500 tracking-widest">
          Hesap
        </p>
        <h1 className="typography-display-lg mt-3">
          {user?.firstName ?? "Hoş geldin"}
        </h1>
        <p className="typography-body-lg text-ink-700 mt-4">
          Profil, tercihler, veri yönetimi.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-paper border border-surface-2 rounded-2xl p-8">
          <span className="typography-label uppercase tracking-widest text-ink-500">
            Profil
          </span>
          <dl className="mt-6 space-y-4 typography-body-md">
            <div>
              <dt className="typography-caption text-ink-500">Ad</dt>
              <dd className="mt-1 text-ink-900">
                {user
                  ? [user.firstName, user.lastName].filter(Boolean).join(" ") ||
                    "—"
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="typography-caption text-ink-500">E-posta</dt>
              <dd className="mt-1 text-ink-900">
                {user?.primaryEmailAddress?.emailAddress ?? "—"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="bg-paper border border-surface-2 rounded-2xl p-8">
          <span className="typography-label uppercase tracking-widest text-ink-500">
            Tercihler
          </span>
          <dl className="mt-6 space-y-4 typography-body-md">
            <div className="flex items-center justify-between">
              <div>
                <dt className="text-ink-900">E-posta bildirimleri</dt>
                <dd className="typography-caption text-ink-500 mt-1">
                  Brief, booking ve hatırlatmalar
                </dd>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 accent-brand-700"
                aria-label="E-posta bildirimleri"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <dt className="text-ink-900">Pazarlama e-postaları</dt>
                <dd className="typography-caption text-ink-500 mt-1">
                  Opsiyonel — launch + yeni yazılar
                </dd>
              </div>
              <input
                type="checkbox"
                className="w-5 h-5 accent-brand-700"
                aria-label="Pazarlama e-postaları"
              />
            </div>
          </dl>
        </section>
      </div>

      <section className="mt-10 bg-surface-2/40 border border-surface-2 rounded-2xl p-8 max-w-[720px]">
        <span className="typography-label uppercase tracking-widest text-ink-500">
          Veri yönetimi
        </span>
        <p className="typography-body-md text-ink-700 mt-4 max-w-prose-editorial">
          KVKK ve GDPR kapsamında verilerini indirebilir veya hesabını silebilirsin.
          Hesap silme talebi sonrası 30 gün içinde PII anonymize edilir.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex items-center h-10 px-4 rounded-full border border-surface-3 text-ink-900 hover:bg-surface-1 typography-body-sm"
          >
            Verilerimi indir
          </button>
          <button
            type="button"
            className="inline-flex items-center h-10 px-4 rounded-full border border-danger-500 text-danger-700 hover:bg-danger-50 typography-body-sm"
          >
            Hesabımı sil
          </button>
        </div>
      </section>
    </section>
  );
}
