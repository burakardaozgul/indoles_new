import { describe, it, expect } from "vitest";
import { SERVICES } from "@/lib/content/services";
import type { ServiceContent } from "@/lib/content/types";

/**
 * Dar kapsamlı ticari kelimelerin hedef sayfasında geçtiğini garanti eder.
 *
 * Bağlam: 2026-08-24 denetimi, keyword haritasındaki 245 kelimenin yalnız
 * %20'sinin hedef sayfasında geçtiğini ölçtü. Karar 2 (dar kapsam) yalnız
 * stratejide adıyla geçen kelimeleri sayfalara aldı ve bir yerleşim kuralı
 * koydu: `ajansı`/`firmaları` ailesi kendimizi adlandırmak için değil,
 * **ayrıştığımız şeyi adlandırmak için** kullanılır — yani karşı-konumlandırma
 * SSS'inde. `danışmanlığı`/`tasarımı` ailesi başlık ve açıklamaya girebilir.
 *
 * Bu test o yerleşimin sökülmemesini sağlar. Bir kelime kaybolursa sessizce
 * değil, kırmızı testle fark edilir.
 */

/** Türkçe-güvenli normalize: İ/I/ı ayrımını katlar, noktalamayı boşluğa çevirir. */
function norm(s: string): string {
  return s
    .replace(/[İIı]/g, "i")
    .toLowerCase()
    .replace(/â/g, "a")
    .replace(/î/g, "i")
    .replace(/û/g, "u")
    .replace(/[^0-9a-zçğıöşü]+/g, " ")
    .trim();
}

function searchSurface(s: ServiceContent): string {
  return norm(
    [
      s.name.tr,
      s.seo.title.tr,
      s.seo.description.tr,
      s.lede.tr,
      ...s.signals.tr,
      ...s.scope.includes.flatMap((i) => [i.title.tr, i.description.tr]),
      ...s.scope.excludes.tr,
      ...s.method.flatMap((m) => [m.title.tr, m.description.tr, m.output.tr]),
      ...s.deliverables.flatMap((d) => [d.title.tr, d.description.tr]),
      ...s.faq.flatMap((f) => [f.question.tr, f.answer.tr]),
    ].join(" ")
  );
}

/** Strateji §2'de adıyla geçen ticari kelimeler → hedef hizmet (TR slug). */
const TARGETS: Array<[slug: string, keyword: string]> = [
  ["cro", "cro ajansı"],
  ["cro", "dönüşüm oranı optimizasyonu"],
  ["e-ticaret", "e ticaret danışmanlığı"],
  ["e-ticaret", "e ticaret danışmanı"],
  ["e-ticaret", "e ticaret ajansı"],
  ["performans-pazarlama", "performans pazarlama ajansı"],
  ["ui-ux-tasarim", "ui ux tasarım ajansı"],
  ["ui-ux-tasarim", "ux ajansı"],
  ["ui-ux-tasarim", "ux tasarımı"],
  ["ui-ux-tasarim", "ui tasarımı"],
  ["ai-danismanlik", "yapay zeka danışmanlığı"],
  ["ai-danismanlik", "yapay zeka ajansı"],
  ["ai-danismanlik", "yapay zeka danışmanı"],
  ["ai-danismanlik", "yapay zeka firmaları"],
];

describe("Dar kapsam keyword yerleşimi (strateji §2, Karar 2)", () => {
  it.each(TARGETS)("%s sayfası '%s' kelimesini taşıyor", (slug, keyword) => {
    const service = SERVICES.find((s) => s.slug.tr === slug);
    expect(service, `hizmet bulunamadı: ${slug}`).toBeDefined();
    expect(searchSurface(service!)).toContain(norm(keyword));
  });

  it("'ajansı' ve 'firmaları' kelimeleri H1'e girmiyor", () => {
    // Yerleşim kuralı: kendimizi "ajans" diye adlandırmıyoruz. Görünen
    // başlık (`name`) ve arama başlığı (`seo.title`) bu kelimeleri taşımaz;
    // yalnız karşı-konumlandırma SSS'i taşır.
    //
    // `\b` KULLANILMAZ: JavaScript'in kelime sınırı `\w` = [A-Za-z0-9_]
    // tanımına dayanıyor ve `ı`, `ş`, `ğ` bu kümede değil. `/\bajansı\b/`
    // hiçbir zaman eşleşmiyor — bu test önce sessizce geçiyordu.
    for (const s of SERVICES) {
      for (const surface of [s.name.tr, s.seo.title.tr]) {
        const n = norm(surface);
        expect(n.includes("ajansi"), `${s.slug.tr}: "${surface}"`).toBe(false);
        expect(n.includes("firmalari"), `${s.slug.tr}: "${surface}"`).toBe(false);
      }
    }
  });

  it("her karşı-konumlandırma sorusu bir farkı tanımlıyor", () => {
    // Kelimeyi soruya sıkıştırıp cevabı boş bırakmak, kelime doldurmadır.
    // Cevap gerçekten bir ayrım kurmalı; en ucuz ölçüt INDOLES'in adının
    // geçmesi — yani cevabın kendi konumumuzu tarif etmesi.
    const counterPositioning = SERVICES.flatMap((s) =>
      s.faq
        .filter((f) => {
          const q = norm(f.question.tr);
          return q.includes("ajansi") || q.includes("firmalari");
        })
        .map((f) => ({ slug: s.slug.tr, f }))
    );

    expect(counterPositioning.length).toBeGreaterThanOrEqual(5);
    for (const { slug, f } of counterPositioning) {
      expect(f.answer.tr, `${slug}: "${f.question.tr}"`).toContain("INDOLES");
    }
  });
});
