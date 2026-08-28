import { ARTICLES } from "./src/lib/content/articles";
const TARGET = (process.env.SLUGS ?? "").split(",").filter(Boolean);
const firstSent = (s: string) => {
  const m = s.match(/^[\s\S]{0,320}?[.?!:](\s|$)/);
  return (m ? m[0] : s.slice(0, 260)).trim();
};
for (const a of ARTICLES) {
  if (!TARGET.includes(a.slug.tr)) continue;
  console.log("=".repeat(70));
  console.log(a.slug.tr);
  const b = a.blocks;
  for (let i = 0; i < b.length; i++) {
    const blk = b[i]!;
    if (blk.type !== "h2") continue;
    console.log(`\n--- H2 #${blk.id}`);
    console.log(`  TR: ${blk.text.tr}`);
    console.log(`  EN: ${blk.text.en}`);
    for (let j = i + 1; j < Math.min(i + 3, b.length); j++) {
      const n = b[j]!;
      if (n.type === "h2") break;
      if (n.type === "list") {
        console.log(`  next(list): TR ${firstSent(n.items[0]!.tr)}`);
        continue;
      }
      const t = (n as { text: { tr: string; en: string } }).text;
      console.log(`  next(${n.type}) TR: ${firstSent(t.tr)}`);
      console.log(`  next(${n.type}) EN: ${firstSent(t.en)}`);
      if (n.type === "p") break;
    }
  }
}
