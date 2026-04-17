export default function AdminUsersPage() {
  return (
    <section>
      <div>
        <p className="typography-label uppercase tracking-widest text-ink-500">
          Kullanıcılar
        </p>
        <h1 className="typography-display-lg mt-3">Clerk + Neon mirror.</h1>
        <p className="typography-body-md text-ink-700 mt-4 max-w-prose-editorial">
          Kayıtlı kullanıcılar, rolleri ve brief / booking aktivitesi.
        </p>
      </div>

      <div className="mt-12 flex gap-2">
        {["Tümü", "User", "Consultant", "Admin"].map((f, i) => (
          <button
            key={f}
            className={`typography-body-sm px-4 h-9 rounded-full border ${
              i === 0
                ? "bg-ink-900 text-paper border-ink-900"
                : "border-surface-3 text-ink-700 hover:bg-surface-2"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 bg-paper border border-surface-2 rounded-2xl overflow-hidden">
        <table className="w-full typography-body-sm">
          <thead>
            <tr className="text-left bg-surface-1 border-b border-surface-2 typography-label uppercase tracking-widest text-ink-500">
              <th className="px-6 py-4">Ad</th>
              <th className="px-6 py-4">E-posta</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4">Locale</th>
              <th className="px-6 py-4 text-right">Oluşturulma</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-6 py-16 text-center text-ink-500">
                Henüz kullanıcı yok.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
