import { ARTICLES } from "./src/lib/content/articles";

const SKIP = new Set([
  "yapay-zeka-aramalarinda-nasil-one-cikarsiniz",
  "ai-donusumu-nedir",
  "ai-danismani-secerken-sorulacak-12-soru",
  "google-ai-overviews-da-yer-almak",
  "llms-txt-nedir",
  "cro-nedir",
  "cro-ajansi-nasil-secilir",
  "is-gelistirme-studyosu-nedir",
]);

const isQ = (s: string) => s.trim().endsWith("?");

let totH2 = 0,
  totQ = 0;
let oldH2 = 0,
  oldQ = 0;

for (const a of ARTICLES) {
  const skip = SKIP.has(a.slug.tr);
  const h2 = a.blocks.filter((b) => b.type === "h2") as Array<{
    id: string;
    text: { tr: string; en: string };
  }>;
  totH2 += h2.length;
  totQ += h2.filter((h) => isQ(h.text.tr)).length;
  if (!skip) {
    oldH2 += h2.length;
    oldQ += h2.filter((h) => isQ(h.text.tr)).length;
  }
  if (process.env.ONLY_TOTALS) continue;
  if (skip) continue;
  const links: string[] = [];
  for (const b of a.blocks) {
    const texts: string[] = [];
    const wt = b as { text?: Record<string, string> };
    if (wt.text) texts.push(wt.text.tr, wt.text.en);
    const wi = b as { items?: Array<Record<string, string>> };
    if (wi.items) for (const i of wi.items) texts.push(i.tr, i.en);
    for (const t of texts) {
      for (const m of t.matchAll(/\[([^\]]+)\]\((\/[^)]+)\)/g)) links.push(m[2]!);
    }
  }
  console.log("=".repeat(80));
  console.log(`SLUG: ${a.slug.tr}  |  topic=${a.topic} cat=${a.category}`);
  console.log(`TITLE TR: ${a.title.tr}`);
  console.log(`TITLE EN: ${a.title.en}`);
  console.log(`SEO TR  : ${a.seo?.title?.tr}`);
  console.log(`SEO EN  : ${a.seo?.title?.en}`);
  console.log(
    `updatedAt=${a.updatedAt ?? "-"} updateNote=${a.updateNote ? "VAR" : "YOK"}`
  );
  console.log(`LINKS(${links.length}): ${[...new Set(links)].join(" , ")}`);
  console.log(`H2 (${h2.length}, soru: ${h2.filter((h) => isQ(h.text.tr)).length}):`);
  for (const h of h2) {
    console.log(`  [${isQ(h.text.tr) ? "Q" : " "}] #${h.id}`);
    console.log(`      TR: ${h.text.tr}`);
    console.log(`      EN: ${h.text.en}`);
  }
  const h3 = a.blocks.filter((b) => b.type === "h3") as Array<{
    text: { tr: string; en: string };
  }>;
  if (h3.length) {
    console.log(`H3 (${h3.length}):`);
    for (const h of h3) console.log(`      TR: ${h.text.tr} || EN: ${h.text.en}`);
  }
  console.log(`FAQ (${a.faq?.length ?? 0}):`);
  for (const f of a.faq ?? []) {
    console.log(`   Q-TR: ${f.question.tr}`);
    console.log(`   Q-EN: ${f.question.en}`);
  }
}

console.log("#".repeat(80));
console.log(`KÜLLİYAT: ${ARTICLES.length} yazı`);
console.log(
  `TOPLAM H2=${totH2} soru=${totQ} oran=${((totQ / totH2) * 100).toFixed(1)}%`
);
console.log(
  `ESKİ 15 H2=${oldH2} soru=${oldQ} oran=${((oldQ / oldH2) * 100).toFixed(1)}%`
);
