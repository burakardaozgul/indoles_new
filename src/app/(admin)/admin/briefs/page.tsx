export default function AdminBriefsPage() {
  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <p className="typography-label uppercase tracking-widest text-ink-500">
            Brief'ler
          </p>
          <h1 className="typography-display-lg mt-3">Triage kuyruğu.</h1>
          <p className="typography-body-md text-ink-700 mt-4 max-w-prose-editorial">
            Gelen brief'ler statü bazında listelenir. Bir brief'e tıklayarak
            detayını gör, consultant ata veya durumu değiştir.
          </p>
        </div>
        <div className="flex gap-2">
          {["Tümü", "Pending", "Triaged", "Aktif"].map((f, i) => (
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
      </div>

      <div className="mt-12 bg-paper border border-surface-2 rounded-2xl overflow-hidden">
        <table className="w-full typography-body-sm">
          <thead>
            <tr className="text-left bg-surface-1 border-b border-surface-2 typography-label uppercase tracking-widest text-ink-500">
              <th className="px-6 py-4">Şirket</th>
              <th className="px-6 py-4">Pillar</th>
              <th className="px-6 py-4">Bütçe</th>
              <th className="px-6 py-4">Statü</th>
              <th className="px-6 py-4">Atanmış</th>
              <th className="px-6 py-4 text-right">Tarih</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="px-6 py-16 text-center text-ink-500">
                Henüz brief yok. Neon + tRPC bağlandığında burada görünür.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
