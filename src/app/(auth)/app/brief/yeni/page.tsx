export default function NewBriefPage() {
  const steps = [
    { num: "01", label: "Şirket ve sektör" },
    { num: "02", label: "Problem ve hedef" },
    { num: "03", label: "Bütçe ve timeline" },
    { num: "04", label: "Ek ve gönderim" },
  ];

  return (
    <section>
      <div className="max-w-[720px]">
        <p className="typography-label uppercase text-ink-500 tracking-widest">
          Brief
        </p>
        <h1 className="typography-display-lg mt-3">Yeni brief</h1>
        <p className="typography-body-lg text-ink-700 mt-4 max-w-prose-editorial">
          4 adımda detaylı brief oluştur. Her adımda otomatik kayıt; istediğinde
          bırakıp dönebilirsin.
        </p>
      </div>

      {/* Stepper */}
      <ol className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((s, i) => (
          <li
            key={s.num}
            className={`border rounded-2xl p-6 ${
              i === 0
                ? "bg-paper border-ink-900"
                : "bg-paper/50 border-surface-2"
            }`}
          >
            <div
              className={`typography-label uppercase tracking-widest ${
                i === 0 ? "text-brand-700" : "text-ink-500"
              }`}
            >
              {s.num}
            </div>
            <div className="typography-h3 mt-2 text-ink-900">{s.label}</div>
          </li>
        ))}
      </ol>

      {/* Form (placeholder) */}
      <form className="mt-12 max-w-[720px] space-y-8">
        <Field
          label="Şirket adı"
          placeholder="İndoles Yazılım A.Ş."
          required
        />
        <Field
          label="Sektör"
          placeholder="Örn. Gıda üretimi, e-ticaret moda..."
          required
        />
        <Field
          label="Problem tanımı"
          placeholder="Hangi süreç, hangi konuda sıkışıyor? 50+ karakter."
          multiline
          required
          hint="Minimum 50, maksimum 5000 karakter."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Bütçe"
            options={[
              "Küçük (< 25.000 €)",
              "Orta (25.000 – 100.000 €)",
              "Büyük (> 100.000 €)",
            ]}
          />
          <SelectField
            label="Zamanlama"
            options={["Acil (< 1 ay)", "Normal (1-3 ay)", "Esnek (3+ ay)"]}
          />
        </div>

        <div className="pt-8 flex items-center gap-4">
          <button
            type="button"
            disabled
            className="inline-flex items-center h-11 px-5 rounded-full bg-ink-900 text-paper opacity-60 cursor-not-allowed typography-body-sm"
          >
            Devam et
          </button>
          <p className="typography-caption text-ink-500">
            Form henüz aktif değil — Sanity ve tRPC bağlandığında devreye girer.
          </p>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  placeholder,
  multiline,
  required,
  hint,
}: {
  label: string;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
  hint?: string;
}) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <label className="block">
      <div className="typography-label uppercase tracking-widest text-ink-500">
        {label}
        {required ? " *" : ""}
      </div>
      <Tag
        placeholder={placeholder}
        {...(multiline ? { rows: 5 } : { type: "text" })}
        className="mt-3 w-full bg-paper border border-surface-2 rounded-xl px-4 py-3 typography-body-md text-ink-900 placeholder:text-ink-300 focus-visible:outline-none focus-visible:border-brand-500"
      />
      {hint ? (
        <p className="typography-caption text-ink-500 mt-2">{hint}</p>
      ) : null}
    </label>
  );
}

function SelectField({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  return (
    <label className="block">
      <div className="typography-label uppercase tracking-widest text-ink-500">
        {label}
      </div>
      <select className="mt-3 w-full bg-paper border border-surface-2 rounded-xl px-4 py-3 typography-body-md text-ink-900 focus-visible:outline-none focus-visible:border-brand-500">
        <option value="">—</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
