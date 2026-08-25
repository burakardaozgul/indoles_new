/**
 * Site geneli SEO + GEO denetimi.
 *
 *   pnpm seo:audit                                  # sitemap'teki her URL
 *   pnpm seo:audit --base http://localhost:3100
 *   pnpm seo:audit --profile service,pillar         # alt küme (CI hızlı koşu)
 *   pnpm seo:audit --only /tr/hizmetler/cro
 *   pnpm seo:audit --list                           # yalnız URL + profil dökümü
 *
 * Kapsam `/sitemap.xml`ten okunur. Böylece araç `src/lib/content/**` şemasına
 * bağlı kalmaz ve indekslenmesini istediğimiz URL kümesiyle denetlediğimiz
 * küme tanım gereği aynı olur — sitemap'e girmemiş bir sayfa denetlenmez,
 * denetlenmeyen bir sayfa da sitemap'te olmaz.
 *
 * Profil URL kalıbından çıkar (`profileFor`); kurallar `src/lib/seo/audit.ts`
 * içindeki profil matrisinden gelir ve fixture testleriyle ayrıca doğrulanır.
 * Bu dosya yalnız ağ ve raporlama yapar.
 *
 * Bir FAIL varsa çıkış kodu 1 — CI'a bağlanır. WARN çıkış kodunu etkilemez.
 */
import {
  auditHtml,
  profileFor,
  PROFILE_RULES,
  type Expectations,
  type Finding,
  type PageProfile,
} from "../src/lib/seo/audit";

// ---------------------------------------------------------------------------
// Argümanlar

const USAGE = `Kullanım: pnpm seo:audit [seçenekler]

  --base <url>          Denetlenecek sunucu (varsayılan http://localhost:3000)
  --only <parça>        Yalnız path'inde bu parça geçen URL'ler (tekrarlanabilir)
  --profile <p[,p...]>  Yalnız bu profiller: ${Object.keys(PROFILE_RULES).join(", ")}
  --limit <n>           İlk n URL ile sınırla
  --concurrency <n>     Eşzamanlı istek (varsayılan 6)
  --allow-noindex       meta robots noindex'i ihlal sayma (preview denetimi)
  --no-entities         İçerik katmanından varlık listesi yükleme
  --list                URL + profil dökümü bas, denetim yapma
  --help                Bu metin`;

const argv = process.argv.slice(2);

function flagValue(name: string): string | undefined {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
}

function flagValues(name: string): string[] {
  const out: string[] = [];
  argv.forEach((a, i) => {
    if (a === `--${name}` && argv[i + 1]) out.push(argv[i + 1]!);
  });
  return out;
}

if (argv.includes("--help") || argv.includes("-h")) {
  console.log(USAGE);
  process.exit(0);
}

const KNOWN_FLAGS = new Set([
  "--base",
  "--only",
  "--profile",
  "--limit",
  "--concurrency",
  "--allow-noindex",
  "--no-entities",
  "--list",
  "--help",
  "-h",
  // Eski arayüz: kapsam artık varsayılan olarak tüm site, bayrak sessizce kabul
  // edilir ki eski komut satırları ve dokümanlar kırılmasın.
  "--all",
]);

const unknown = argv.filter((a) => a.startsWith("--") && !KNOWN_FLAGS.has(a));
if (unknown.length > 0) {
  console.error(`Bilinmeyen seçenek: ${unknown.join(", ")}\n\n${USAGE}`);
  process.exit(2);
}

const BASE = (flagValue("base") ?? "http://localhost:3000").replace(/\/+$/, "");
const ONLY = flagValues("only");
const LIMIT = Number(flagValue("limit") ?? 0) || 0;
const CONCURRENCY = Number(flagValue("concurrency") ?? 6) || 6;
const ALLOW_NOINDEX = argv.includes("--allow-noindex");
const WITH_ENTITIES = !argv.includes("--no-entities");
const LIST_ONLY = argv.includes("--list");

const PROFILE_FILTER = new Set(
  (flagValue("profile") ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean),
);
const badProfiles = [...PROFILE_FILTER].filter((p) => !(p in PROFILE_RULES));
if (badProfiles.length > 0) {
  console.error(`Bilinmeyen profil: ${badProfiles.join(", ")}\n\n${USAGE}`);
  process.exit(2);
}

// Konumsal argüman (eski `pnpm seo:audit cro` biçimi) `--only` gibi davranır.
const positional = argv.filter((a, i) => {
  if (a.startsWith("-")) return false;
  const prev = argv[i - 1];
  return !(
    prev === "--base" ||
    prev === "--only" ||
    prev === "--profile" ||
    prev === "--limit" ||
    prev === "--concurrency"
  );
});
ONLY.push(...positional);

// ---------------------------------------------------------------------------
// Kapsam: sitemap → path listesi → profil

type Target = { path: string; profile: PageProfile; locale: "tr" | "en" };

async function loadSitemap(): Promise<string[]> {
  const url = `${BASE}/sitemap.xml`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${url} → HTTP ${res.status}. Sunucu ayakta mı?`);
  }
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!.trim());
  if (locs.length === 0) {
    throw new Error(`${url} içinde <loc> yok — sitemap boş mu?`);
  }
  // Sitemap mutlak ve production host'lu; denetim lokal sunucuya gider.
  const paths = locs.map((loc) => {
    try {
      return new URL(loc).pathname;
    } catch {
      return loc;
    }
  });
  return [...new Set(paths)].sort();
}

// ---------------------------------------------------------------------------
// Beklentiler

/**
 * Hizmet sayfalarının varlık (entity) listesi yalnız içerik katmanında var;
 * sitemap'ten türetilemez. İçe aktarma **isteğe bağlıdır**: modül okunamazsa
 * denetim varlık kuralı olmadan devam eder, çünkü aracın kapsamı bir içerik
 * dosyasının o anki durumuna rehin olmamalı.
 */
async function loadServiceEntities(): Promise<{
  byPath: Map<string, string[]>;
  note: string | null;
}> {
  const byPath = new Map<string, string[]>();
  if (!WITH_ENTITIES) {
    return { byPath, note: "--no-entities: varlık kuralı kapalı" };
  }
  try {
    const mod = await import("../src/lib/content/services");
    for (const s of mod.SERVICES) {
      byPath.set(`/tr/hizmetler/${s.slug.tr}`, s.seo.entities.tr);
      byPath.set(`/en/services/${s.slug.en}`, s.seo.entities.en);
    }
    return { byPath, note: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      byPath,
      note: `içerik katmanı okunamadı, varlık kuralı atlandı — ${msg}`,
    };
  }
}

/**
 * Komşu hizmet linkleri sitemap'ten türetilir: aynı dildeki diğer hizmet
 * detayları. Elle yazılan bir liste, portföy değiştiğinde sessizce eski
 * komşuları arardı.
 */
function buildSiblingIndex(targets: Target[]): Map<"tr" | "en", string[]> {
  const index = new Map<"tr" | "en", string[]>([
    ["tr", []],
    ["en", []],
  ]);
  for (const t of targets) {
    if (t.profile === "service") index.get(t.locale)!.push(t.path);
  }
  return index;
}

function expectationsFor(
  target: Target,
  siblings: Map<"tr" | "en", string[]>,
  entities: Map<string, string[]>,
): Expectations {
  const base: Expectations = {
    profile: target.profile,
    pageUrl: target.path,
    locale: target.locale,
    allowNoindex: ALLOW_NOINDEX,
  };

  if (target.profile !== "service") return base;

  const siblingHrefs = (siblings.get(target.locale) ?? []).filter(
    (p) => p !== target.path,
  );
  return {
    ...base,
    entities: entities.get(target.path) ?? [],
    siblingHrefs,
    // Komşuların hepsi henüz yazılmamış olabilir; var olanların üçü beklenir.
    minSiblingLinks: Math.min(3, siblingHrefs.length),
  };
}

// ---------------------------------------------------------------------------
// Denetim

type Result = {
  target: Target;
  status: "pass" | "warn" | "fail";
  findings: Finding[];
};

async function auditTarget(
  target: Target,
  siblings: Map<"tr" | "en", string[]>,
  entities: Map<string, string[]>,
): Promise<Result> {
  const url = `${BASE}${target.path}`;
  let res: Response;
  try {
    // `manual`: 3xx'i takip etmek iç link zincirlerini görünmez kılıyordu —
    // EN ana sayfasındaki 307 zinciri `res.ok` kontrolünden geçiyordu.
    res = await fetch(url, { redirect: "manual" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      target,
      status: "fail",
      findings: [{ rule: "http", level: "fail", detail: msg }],
    };
  }

  if (res.status >= 300 && res.status < 400) {
    return {
      target,
      status: "fail",
      findings: [
        {
          rule: "redirect",
          level: "fail",
          detail: `${res.status} → ${res.headers.get("location") ?? "?"} (sitemap'teki URL yönlendirmemeli)`,
        },
      ],
    };
  }
  if (!res.ok) {
    return {
      target,
      status: "fail",
      findings: [{ rule: "http", level: "fail", detail: String(res.status) }],
    };
  }

  const html = await res.text();
  const findings = auditHtml(html, expectationsFor(target, siblings, entities));
  const status = findings.some((f) => f.level === "fail")
    ? "fail"
    : findings.length > 0
      ? "warn"
      : "pass";
  return { target, status, findings };
}

async function mapPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  const workers = Array.from(
    { length: Math.max(1, Math.min(limit, items.length)) },
    async () => {
      for (;;) {
        const i = next++;
        if (i >= items.length) return;
        out[i] = await fn(items[i]!);
      }
    },
  );
  await Promise.all(workers);
  return out;
}

// ---------------------------------------------------------------------------
// Raporlama

const PAD = (s: string, n: number) => s.padEnd(n);
const RPAD = (s: string | number, n: number) => String(s).padStart(n);

function printSummary(results: Result[]): void {
  const order = Object.keys(PROFILE_RULES) as PageProfile[];
  const rows = order
    .map((profile) => {
      const of = results.filter((r) => r.target.profile === profile);
      return {
        profile,
        total: of.length,
        pass: of.filter((r) => r.status === "pass").length,
        warn: of.filter((r) => r.status === "warn").length,
        fail: of.filter((r) => r.status === "fail").length,
      };
    })
    .filter((r) => r.total > 0);

  const line = "-".repeat(44);
  console.log("");
  console.log(
    `${PAD("Profil", 14)}${RPAD("URL", 6)}${RPAD("PASS", 8)}${RPAD("WARN", 8)}${RPAD("FAIL", 8)}`,
  );
  console.log(line);
  for (const r of rows) {
    console.log(
      `${PAD(r.profile, 14)}${RPAD(r.total, 6)}${RPAD(r.pass, 8)}${RPAD(r.warn, 8)}${RPAD(r.fail, 8)}`,
    );
  }
  console.log(line);
  console.log(
    `${PAD("TOPLAM", 14)}${RPAD(results.length, 6)}${RPAD(
      results.filter((r) => r.status === "pass").length,
      8,
    )}${RPAD(results.filter((r) => r.status === "warn").length, 8)}${RPAD(
      results.filter((r) => r.status === "fail").length,
      8,
    )}`,
  );

  // En sık ihlal edilen kurallar — 124 sayfada tek tek satır okumak yerine
  // hangi kuralın sistemik olduğunu gösterir.
  const byRule = new Map<string, number>();
  for (const r of results) {
    for (const f of r.findings) {
      byRule.set(f.rule, (byRule.get(f.rule) ?? 0) + 1);
    }
  }
  if (byRule.size > 0) {
    console.log("\nKural bazında bulgu:");
    for (const [rule, count] of [...byRule].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${PAD(rule, 22)}${RPAD(count, 4)}`);
    }
  }
}

// ---------------------------------------------------------------------------

async function main() {
  const paths = await loadSitemap();

  let targets: Target[] = paths.map((path) => ({
    path,
    profile: profileFor(path),
    locale: path.startsWith("/en") ? "en" : "tr",
  }));

  // Komşu indeksi filtrelemeden ÖNCE kurulur: `--only` ile tek hizmet
  // denetlenirken de tam komşu listesi beklenmeli.
  const siblings = buildSiblingIndex(targets);

  const total = targets.length;
  if (PROFILE_FILTER.size > 0) {
    targets = targets.filter((t) => PROFILE_FILTER.has(t.profile));
  }
  if (ONLY.length > 0) {
    targets = targets.filter((t) => ONLY.some((o) => t.path.includes(o)));
  }
  if (LIMIT > 0) targets = targets.slice(0, LIMIT);

  if (targets.length === 0) {
    console.error(
      `Filtre hiçbir URL ile eşleşmedi (sitemap'te ${total} URL var).\n\n${USAGE}`,
    );
    process.exit(2);
  }

  if (LIST_ONLY) {
    for (const t of targets) console.log(`${PAD(t.profile, 12)}${t.path}`);
    console.log(`\n${targets.length} URL (sitemap toplamı ${total})`);
    process.exit(0);
  }

  const { byPath: entities, note } = await loadServiceEntities();

  console.log(
    `Denetim: ${BASE} · sitemap ${total} URL · ${targets.length} denetlenecek`,
  );
  if (note) console.log(`NOT   ${note}`);
  console.log("");

  const results = await mapPool(targets, CONCURRENCY, (t) =>
    auditTarget(t, siblings, entities),
  );

  for (const r of results) {
    if (r.status === "pass") {
      console.log(`PASS  ${r.target.path}`);
      continue;
    }
    console.log(`${r.status === "fail" ? "FAIL" : "WARN"}  ${r.target.path}`);
    for (const f of r.findings) {
      console.log(`        [${f.rule}] ${f.detail}`);
    }
  }

  printSummary(results);

  const failed = results.filter((r) => r.status === "fail").length;
  console.log(
    failed === 0
      ? `\n${results.length} sayfa denetlendi — FAIL yok`
      : `\n${results.length} sayfa denetlendi — ${failed} sayfada FAIL`,
  );
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
