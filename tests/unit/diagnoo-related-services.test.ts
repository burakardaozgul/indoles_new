import { describe, it, expect } from "vitest";
import { RELATED_SERVICES } from "@/components/tools/diagnoo-report";
import { SERVICES } from "@/lib/content/services";

/**
 * Diagnoo rapor adasındaki hizmet adları `SERVICES` ile aynı kalır.
 *
 * `diagnoo-report.tsx` bir istemci bileşeni ve üç hizmetin adını ELLE
 * kopyalar — gerekçesi bundle: içerik katmanının tamamını (`SERVICES`,
 * ~500 KB kaynak) yalnız üç ad ve üç slug için istemciye çekmek ölçülür bir
 * bedeldir. Kopyanın bedeli de kayma riski: `services/*`te bir `name`
 * değişirse rapor adası eski adı basmaya devam eder ve kimse fark etmez.
 *
 * Bu test o riski dondurur. Testin `SERVICES`i içeri alması serbesttir —
 * bileşenin bundle'ına girmez, yalnız Vitest süreci okur.
 *
 * (2026-09-19 CRO H1 kararında kopya fiilen kaydı ve elle hizalandı; test o
 * oturumda bu yüzden eklendi.)
 */
describe("Diagnoo RELATED_SERVICES ↔ SERVICES", () => {
  it.each(RELATED_SERVICES.map((s) => [s.slug, s] as const))(
    "%s kaydı SERVICES'te var ve adları birebir eşleşiyor",
    (slug, related) => {
      const service = SERVICES.find((s) => s.slug.tr === slug);
      expect(service, `hizmet bulunamadı: ${slug}`).toBeDefined();
      expect(related.name.tr).toBe(service!.name.tr);
      expect(related.name.en).toBe(service!.name.en);
    },
  );

  it("üç kayıt da benzersiz slug taşıyor", () => {
    const slugs = RELATED_SERVICES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
