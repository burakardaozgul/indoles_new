export default function AdminBookingsPage() {
  return (
    <section>
      <div>
        <p className="typography-label uppercase tracking-widest text-ink-500">
          Rezervasyonlar
        </p>
        <h1 className="typography-display-lg mt-3">Bu hafta.</h1>
        <p className="typography-body-md text-ink-700 mt-4 max-w-prose-editorial">
          Cal.com webhook ile gelen rezervasyonların özeti. Reschedule / cancel
          için Cal.com dashboard'a git.
        </p>
      </div>

      <div className="mt-12 bg-paper border border-surface-2 rounded-2xl overflow-hidden">
        <table className="w-full typography-body-sm">
          <thead>
            <tr className="text-left bg-surface-1 border-b border-surface-2 typography-label uppercase tracking-widest text-ink-500">
              <th className="px-6 py-4">Tarih / Saat</th>
              <th className="px-6 py-4">Kullanıcı</th>
              <th className="px-6 py-4">Danışman</th>
              <th className="px-6 py-4">Statü</th>
              <th className="px-6 py-4 text-right">Link</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={5} className="px-6 py-16 text-center text-ink-500">
                Henüz rezervasyon yok.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
