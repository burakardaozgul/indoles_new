/**
 * Hizmet detay sayfalarının SEO + GEO denetimi.
 *
 *   pnpm seo:audit <tr-slug> [--base http://localhost:3000]
 *   pnpm seo:audit --all
 *
 * Sayfayı çeker, `auditHtml`e verir, PASS/FAIL basar. Kurallar
 * `src/lib/seo/audit.ts`te ve fixture'larla ayrıca test ediliyor; bu dosya
 * yalnız ağ ve raporlama yapar.
 *
 * Bir FAIL varsa çıkış kodu 1 — CI'a bağlanabilir.
 */
import { auditHtml, type Expectations, type Finding } from "../src/lib/seo/audit";
import { SERVICES, getService } from "../src/lib/content/services";
import type { Locale, ServiceContent } from "../src/lib/content/types";

const args = process.argv.slice(2);
const baseIndex = args.indexOf("--base");
const BASE =
  baseIndex >= 0 ? args[baseIndex + 1]! : "http://localhost:3000";
const auditAll = args.includes("--all");
const slugArg = args.find((a) => !a.startsWith("--") && a !== BASE);

const ROOT: Record<Locale, string> = { tr: "hizmetler", en: "services" };

function urlFor(service: ServiceContent, locale: Locale): string {
  return `${BASE}/${locale}/${ROOT[locale]}/${service.slug[locale]}`;
}

/**
 * Beklentiler içerik verisinden türetilir.
 *
 * Elle yazılsaydı bir hizmetin `relatedServices`i değiştiğinde audit sessizce
 * eski komşuları arardı.
 */
function expectationsFor(
  service: ServiceContent,
  locale: Locale,
): Expectations {
  const siblingHrefs = service.relatedServices
    .map((slug) => getService(slug, "tr"))
    .filter((s): s is ServiceContent => s !== null)
    .map((s) => `/${locale}/${ROOT[locale]}/${s.slug[locale]}`);

  return {
    entities: service.seo.entities[locale],
    minInternalLinks: 6,
    // Komşuların hepsi henüz yazılmamış olabilir; var olanların tamamı beklenir.
    minSiblingLinks: Math.min(3, siblingHrefs.length),
    siblingHrefs,
  };
}

function report(url: string, findings: Finding[]): boolean {
  if (findings.length === 0) {
    console.log(`PASS  ${url}`);
    return true;
  }
  console.log(`FAIL  ${url}`);
  for (const f of findings) {
    console.log(`        [${f.rule}] ${f.detail}`);
  }
  return false;
}

async function auditService(service: ServiceContent): Promise<boolean> {
  let ok = true;
  for (const locale of ["tr", "en"] as const) {
    const url = urlFor(service, locale);
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`FAIL  ${url}`);
      console.log(`        [http] ${res.status}`);
      ok = false;
      continue;
    }
    const html = await res.text();
    ok = report(url, auditHtml(html, expectationsFor(service, locale))) && ok;
  }
  return ok;
}

async function main() {
  const targets = auditAll
    ? SERVICES
    : SERVICES.filter((s) => s.slug.tr === slugArg);

  if (targets.length === 0) {
    console.error(
      slugArg
        ? `Bilinmeyen hizmet: ${slugArg}`
        : "Kullanım: pnpm seo:audit <tr-slug> | --all",
    );
    console.error(`Mevcut: ${SERVICES.map((s) => s.slug.tr).join(", ")}`);
    process.exit(2);
  }

  let allOk = true;
  for (const service of targets) {
    allOk = (await auditService(service)) && allOk;
  }

  console.log(
    `\n${targets.length} hizmet, ${targets.length * 2} sayfa denetlendi — ${
      allOk ? "hepsi PASS" : "FAIL var"
    }`,
  );
  process.exit(allOk ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
