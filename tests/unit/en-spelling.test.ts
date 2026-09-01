import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { SERVICES } from "@/lib/content/services";
import { PILLARS } from "@/lib/content/pillars";
import { PACKAGES } from "@/lib/content/packages";
import { CASES } from "@/lib/content/cases";
import { ARTICLES } from "@/lib/content/articles";
import { TOOLS } from "@/lib/content/tools";

/**
 * İngilizce imla tekilliği (Karar 4, 2026-08-24).
 *
 * Denetim öncesi durum karışıktı: 77 İngiliz / 112 Amerikan biçim, hatta
 * aynı sayfada ikisi birden (CRO `name.en` "optimization", `lede.en`
 * "optimisation"). Hedef pazar UK/Avrupa olduğu için İngiliz imlası seçildi.
 *
 * ÜÇ İSTİSNA SINIFI — hepsi bilinçli:
 *
 * 1. **Kanonik terim adları.** "Generative Engine Optimization" ve "answer
 *    engine optimization" alanın kendi adıdır ve `-z` ile yazılır; ayrıca
 *    `generative engine optimization` 500/ay hedef kelimemiz. Terimi
 *    Britanyalaştırmak birebir eşleşmeyi kaybettirirdi.
 * 2. **Marka adları.** "Happy Center" bir perakende zinciri; süpürüm onu
 *    "Happy Centre" yapmıştı. Marka adı imla kuralına tabi değildir.
 * 3. **schema.org `@type` adları.** GEO motoru ve araç sayfası metinlerinde
 *    "Organization" bir cümle kelimesi değil, JSON-LD sözlüğündeki sabit
 *    `@type` adı (`json-ld.ts` `RECOGNIZED_TYPES`, `tools.ts` sinyal
 *    açıklaması) — "Organisation" yazmak @type ile eşleşmeyen, yanlış bir
 *    referans üretirdi. Yalnız BÜYÜK-O ile başlayan biçim korunur; küçük
 *    harfli "organization" kelimesi hâlâ kural kapsamındadır.
 *
 * KAPSAM GENİŞLEMESİ (Görev 13 carry-notes, G4 + G10 ruling'i): bu korpus
 * önceden `src/lib/content/tools.ts` (TOOLS) içeriğini ve
 * `src/lib/tools/geo/*` GEO motorunun İngilizce yüzeyini (kullanıcıya görünen
 * `summary`/`findings`/hata metinleri) taramıyordu — regresyon koruması
 * yoktu. İkisi de aşağıda eklendi (bkz. `geoEngineEnCorpus()`).
 */

function enCorpus(): string {
  return [
    ...SERVICES.flatMap((s) => [
      s.name.en, s.lede.en, s.seo.title.en, s.seo.description.en,
      ...s.signals.en, ...s.scope.excludes.en, ...s.seo.entities.en,
      ...s.scope.includes.flatMap((i) => [i.title.en, i.description.en]),
      ...s.method.flatMap((m) => [m.title.en, m.description.en, m.output.en]),
      ...s.deliverables.flatMap((d) => [d.title.en, d.description.en]),
      ...s.faq.flatMap((f) => [f.question.en, f.answer.en]),
    ]),
    ...PILLARS.flatMap((p) => [
      p.name.en, p.heroLede.en,
      ...(p.faq ?? []).flatMap((f) => [f.question.en, f.answer.en]),
    ]),
    ...PACKAGES.flatMap((p) => [
      p.name.en, p.descriptor.en,
      ...p.faq.flatMap((f) => [f.question.en, f.answer.en]),
    ]),
    ...CASES.flatMap((c) => [
      c.title.en, c.lead.en, ...c.challenge.en, ...c.approach.en, ...c.outcome.en,
      ...(c.faq ?? []).flatMap((f) => [f.question.en, f.answer.en]),
    ]),
    ...ARTICLES.flatMap((a) => [
      a.title.en, a.excerpt.en,
      ...a.blocks.map((b) =>
        b.type === "list" ? b.items.map((i) => i.en).join(" ") : (b as { text: { en: string } }).text.en
      ),
      ...(a.faq ?? []).flatMap((f) => [f.question.en, f.answer.en]),
    ]),
    ...TOOLS.flatMap((t) => [
      t.name.en, t.eyebrow.en, t.lede.en, t.footnote.en,
      t.seo.title.en, t.seo.description.en,
      ...t.steps.flatMap((s) => [s.title.en, s.description.en]),
      ...t.signals.flatMap((s) => [s.title.en, s.description.en]),
      ...t.faq.flatMap((f) => [f.question.en, f.answer.en]),
    ]),
    geoEngineEnCorpus(),
  ].join("\n");
}

/**
 * `src/lib/tools/geo/*` GEO motorunun İngilizce `summary`/`findings`/hata
 * metinlerini KAYNAK DOSYADAN tarar — fonksiyonları çağırıp çıktı üretmek
 * yerine. Sebep: her kontrol fonksiyonu dallı (robots.txt var/yok, JSON-LD
 * bloğu bozuk/geçerli vb.); tüm dalları tetiklemek için birden çok girdi
 * kurgulamak bu testin kapsamını gereksiz büyütürdü. Kaynaktaki her `en:`
 * property'sinin literal metni, o metni üreten dal HİÇ çalıştırılmasa bile
 * kaynak dosyada zaten mevcuttur — bu yüzden statik tarama, imla kontrolü
 * amacıyla dalların hepsini tetiklemeye eşdeğer kapsam sağlar.
 *
 * ÇIKARIM TypeScript AST'İYLE YAPILIR, regex'le DEĞİL (fix — code review
 * bulgusu): ilk sürüm `en:\s*(["'\`])((?:\\.|(?!\1)[\s\S])*)\1` gibi bir
 * backreference regex'i kullanıyordu ve `json-ld.ts`'teki
 * `` en: `...${typeList ? `; recognised types: ${typeList}` : ""}...` ``
 * satırında İÇ İÇE template literal'in iç backtick'ini dış backtick'le
 * karıştırıp metni "; recognised types..." noktasında SESSİZCE kesiyordu —
 * kesilen kısımdaki bir Amerikan yazımı hiç görülmeden PASS alırdı. Gerçek
 * bir parser (TS derleyicisinin kendi AST'si) bu sınıfın tamamını kapatır:
 * template literal ne kadar derin iç içe geçerse geçsin doğru ayrıştırılır.
 */
const GEO_ENGINE_DIR = path.join(process.cwd(), "src/lib/tools/geo");
const GEO_ENGINE_FILES = [
  "ai-access.ts",
  "llms-txt.ts",
  "json-ld.ts",
  "lang-signals.ts",
  "question-h2.ts",
  "safe-fetch.ts",
];

/**
 * Bir alt-ağaçtaki TÜM string ve template literal metin parçalarını toplar
 * — iç içe geçmiş template literal'ler dahil (`TemplateHead`/`Middle`/`Tail`
 * ayrı düğümler olduğu için `forEachChild` her derinlikte doğru iner).
 */
function collectLiteralText(node: ts.Node, out: string[]): void {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    out.push(node.text);
  } else if (
    node.kind === ts.SyntaxKind.TemplateHead ||
    node.kind === ts.SyntaxKind.TemplateMiddle ||
    node.kind === ts.SyntaxKind.TemplateTail
  ) {
    out.push((node as ts.LiteralLikeNode).text);
  }
  node.forEachChild((child) => collectLiteralText(child, out));
}

/** `en: <ifade>` biçimindeki her property assignment'ın değer ağacını bulur. */
function findEnPropertyLiterals(node: ts.Node, out: string[]): void {
  if (
    ts.isPropertyAssignment(node) &&
    ts.isIdentifier(node.name) &&
    node.name.text === "en"
  ) {
    collectLiteralText(node.initializer, out);
  }
  node.forEachChild((child) => findEnPropertyLiterals(child, out));
}

function geoEngineEnCorpus(): string {
  return GEO_ENGINE_FILES.map((file) => {
    const filePath = path.join(GEO_ENGINE_DIR, file);
    const src = readFileSync(filePath, "utf8");
    const sourceFile = ts.createSourceFile(
      filePath,
      src,
      ts.ScriptTarget.Latest,
      true,
    );
    const out: string[] = [];
    findEnPropertyLiterals(sourceFile, out);
    return out.join("\n");
  }).join("\n");
}

/** Kanonik terim adları — imla kuralının dışında. */
const PROTECTED_TERMS = [
  /generative engine optimization/gi,
  /answer engine optimization/gi,
  /\bai search optimization\b/gi,
  /search engine optimization/gi,
  /\bllm optimization\b/gi,
];

/** İmla kuralına tabi olmayan özel isimler. */
const BRAND_NAMES = [/Happy Center/g, /MacroCenter/g];

/**
 * schema.org `@type` adları — sabit JSON-LD sözlüğü, imla kuralına tabi
 * değil (istisna sınıfı 3). Yalnız BÜYÜK-O ile eşleşir (`g`, `i` bayrağı
 * YOK): küçük harfli "organization" kelimesi hâlâ kural kapsamında kalır.
 */
const SCHEMA_TYPE_NAMES = [/\bOrganization\b/g];

function strippedCorpus(): string {
  let s = enCorpus();
  for (const re of [...PROTECTED_TERMS, ...BRAND_NAMES, ...SCHEMA_TYPE_NAMES]) {
    s = s.replace(re, " ");
  }
  return s;
}

/** Amerikan biçim → beklenen İngiliz karşılığı. */
const AMERICAN: Array<[string, string]> = [
  ["behavior", "behaviour"],
  ["behavioral", "behavioural"],
  ["organization", "organisation"],
  ["organized", "organised"],
  ["personalization", "personalisation"],
  ["personalized", "personalised"],
  ["prioritized", "prioritised"],
  ["analyze", "analyse"],
  ["realize", "realise"],
  ["recognize", "recognise"],
  ["optimization", "optimisation"],
  ["optimize", "optimise"],
  ["optimized", "optimised"],
  ["optimizing", "optimising"],
  ["catalog", "catalogue"],
  ["center", "centre"],
  ["favor", "favour"],
  ["labor", "labour"],
];

describe("İngilizce imla — İngiliz biçimi (Karar 4)", () => {
  const corpus = strippedCorpus();

  it.each(AMERICAN)("'%s' geçmiyor (yerine '%s')", (american, british) => {
    const hits = corpus.match(new RegExp(`\\b${american}\\b`, "gi")) ?? [];
    expect(
      hits.length,
      `${hits.length} kez geçiyor; "${british}" kullanılmalı`
    ).toBe(0);
  });

  it("kanonik GEO terimi -z biçiminde korunuyor", () => {
    // 500/ay hedef kelime; Britanyalaştırmak birebir eşleşmeyi kaybettirir.
    expect(enCorpus()).toMatch(/generative engine optimization/i);
  });

  it("marka adları imla süpürümünden etkilenmiyor", () => {
    // "Happy Center" bir perakende zinciri. Süpürüm bunu bir kez
    // "Happy Centre" yapmıştı; test o hatanın tekrarını engelliyor.
    const all = enCorpus();
    expect(all).not.toMatch(/Happy Centre/);
    expect(all).toMatch(/Happy Center/);
  });

  it("iç içe template literal'deki İngilizce metin taramaya dahil (json-ld.ts nested-backtick regresyonu)", () => {
    // json-ld.ts: `en: \`...${typeList ? \`; recognised types: ${typeList}\` : ""}...\``
    // Eski regex tabanlı çıkarım bu iç içe backtick'te sessizce kesiliyor,
    // "; recognised types" ve sonrası hiç taranmıyordu (code review bulgusu).
    // AST tabanlı çıkarım bu metni artık korpusa dahil ediyor.
    expect(geoEngineEnCorpus()).toContain("recognised types");
  });
});
