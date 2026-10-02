import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { CASES } from "@/lib/content/cases";
import { BOOKABLE_CONSULTANTS, CONSULTANTS } from "@/lib/content/consultants";
import { COMPANY } from "@/lib/content/company";
import { SERVICES } from "@/lib/content/services";
import { PACKAGES } from "@/lib/content/packages";
import { ARTICLES } from "@/lib/content/articles";

/**
 * Sayfada ve SERP'te görünen sayısal iddiaların içerikle uyumu.
 *
 * Hata sınıfı: `/vakalar` açıklaması "On iş" diyordu — gerçek sayı 9.
 * `/danismanlar` "On kişilik iç ekip" diyordu; kadroda 9 insan ve bir ofis
 * köpeği var. Bu tür iddialar elle yazıldıkları için içerik değiştikçe
 * sessizce eskiyor ve `docs/04` §10'un içerik dürüstlüğü kuralını ihlal
 * ediyor. Sayı artık içerikten türetiliyor; bu testler türetmenin
 * sökülmediğini garanti eder.
 */

function source(...segments: string[]): string {
  return readFileSync(
    path.join(process.cwd(), "src", "app", "(marketing)", "[locale]", ...segments),
    "utf8",
  );
}

/**
 * Yalnız `description:` satırları.
 *
 * Ham kaynağın tamamına bakmak yanlış pozitif üretiyor: düzeltmeyi açıklayan
 * kod yorumu, düzeltilen ifadeyi zorunlu olarak alıntılıyor. Test SERP'e
 * giden dizgeyi denetlemeli, onun hakkındaki yorumu değil.
 */
function descriptionLines(src: string): string {
  return src
    .split("\n")
    .filter((line) => line.trimStart().startsWith("description:"))
    .join("\n");
}

describe("Vaka sayısı iddiası", () => {
  const src = source("vakalar", "page.tsx");

  it("meta açıklaması sayıyı elle yazmaz", () => {
    expect(descriptionLines(src)).not.toMatch(/On iş|Ten engagements/);
  });

  it("sayı CASES uzunluğundan türetilir", () => {
    expect(src).toContain("CASES.length");
  });
});

describe("Kadro sayısı iddiası", () => {
  const src = source("danismanlar", "page.tsx");

  it("meta açıklaması sayıyı elle yazmaz", () => {
    expect(descriptionLines(src)).not.toMatch(/On kişilik|ten-person/i);
  });

  it("sayı sayfası olan danışmanlardan türetilir", () => {
    // `CONSULTANTS` ofis köpeğini de içeriyor (`hipnoz`, pillar'ı yok ve
    // detay sayfası üretmiyor). Kurumsal kadro iddiası insanları sayar.
    expect(src).toContain("BOOKABLE_CONSULTANTS.length");
  });

  it("iki liste gerçekten ayrışıyor — test kendini doğruluyor", () => {
    expect(CONSULTANTS.length).toBeGreaterThan(BOOKABLE_CONSULTANTS.length);
  });
});

describe("Kadro künyesi", () => {
  // Künye satırı `team-slider.tsx`teydi; slider kaldırıldı ve satır
  // hakkımızda sayfasındaki tek ekip bölümünün altına taşındı. Denetlenen
  // iddia aynı, yeri değişti.
  const src = source("hakkimizda", "page.tsx");

  it("kişi sayısını görünen liste uzunluğundan değil kadro sayısından alır", () => {
    // Grid Hipnoz'u da gösteriyor ama künye satırındaki sayı kurumsal
    // iddiadır; listenin uzunluğu (10) yerine kadro sayısı (9) basılmalı.
    expect(src).not.toMatch(/\{CONSULTANTS(_ORDERED)?\.length\}/);
    expect(src).toContain("BOOKABLE_CONSULTANTS.length");
  });

  it("ekip tek bölümde — slider geri gelmez", () => {
    expect(src).not.toContain("TeamSlider");
  });
});

describe("Lokasyon künyesi", () => {
  it("yalnız doğrulanmış lokasyonu taşır", () => {
    // Londra ve Dubai teyit edilemedi (Burak, 2026-08-24). Doğrulanmamış
    // lokasyon hem yanlış veri hem Google'ın yerel spam politikasına aykırı.
    expect(COMPANY.locations).toEqual(["Levent, İstanbul"]);
  });

  it("künyede doğrulanmamış lokasyon TODO'su kalmaz", () => {
    const src = readFileSync(
      path.join(process.cwd(), "src", "lib", "content", "company.ts"),
      "utf8",
    );
    expect(src).not.toMatch(/TODO.*Londra|TODO.*Dubai/i);
  });

  it("hiçbir danışman biyografisi doğrulanmamış ofis iddiası taşımaz", () => {
    for (const c of CONSULTANTS) {
      for (const bio of [...c.longBio.tr, ...c.longBio.en, c.shortBio.tr, c.shortBio.en]) {
        expect(bio).not.toMatch(/Londra ofis|London office|Dubai ofis|Dubai office/i);
      }
    }
  });
});

describe("Vaka sayısı — kaynak veri", () => {
  it("dokuz vaka yayında", () => {
    // Test sabitleri değil, sayının değiştiğinde yukarıdaki türetmelerin
    // hâlâ çalıştığını görmek için burada duruyor.
    expect(CASES.length).toBe(9);
  });
});

describe("Telefon numarası", () => {
  it("placeholder deseni taşımaz", () => {
    // `+90 212 111 22 33` tasarım dosyasından gelmiş bir yer tutucuydu ve
    // her sayfanın topbar'ında `tel:` linki olarak canlıydı.
    expect(COMPANY.phone).not.toMatch(/111\s*22\s*33/);
  });

  it("uluslararası biçimde ve yalnız rakam, boşluk ve + içerir", () => {
    expect(COMPANY.phone).toMatch(/^\+90[\d ]+$/);
  });

  it("on haneli abone numarası taşır", () => {
    const digits = COMPANY.phone.replace(/\D/g, "");
    expect(digits).toHaveLength(12); // 90 + 10 hane
  });

  it("tel: bağlantısı boşluksuz üretilebilir", () => {
    // Bileşenler `COMPANY.phone.replace(/\s/g, "")` ile link kuruyor;
    // sonucun geçerli bir tel: hedefi olması gerekir.
    expect(COMPANY.phone.replace(/\s/g, "")).toMatch(/^\+90\d{10}$/);
  });
});

/**
 * Bağımsızlık iddiası ile İKAS bayiliğinin uyumu (2026-10-02).
 *
 * Hata sınıfı: site "INDOLES'in hiçbir yazılım sağlayıcısıyla iş ortaklığı
 * veya komisyon ilişkisi yoktur" diyordu; Burak'ın teyidiyle INDOLES İKAS
 * e-ticaret altyapısının bayisi. Kural: INDOLES'in sağlayıcıdan bağımsızlığını
 * söyleyen her pasaj İKAS istisnasını aynı pasajda taşır — cümle bağlamından
 * koparılıp alıntılandığında (FAQPage, AI motoru) yanıltmasın. Pasaj birimi
 * tek bir yerelleştirilmiş metindir (paragraf, liste maddesi, SSS cevabı).
 */
describe("Bağımsızlık iddiası — İKAS bayiliği", () => {
  type Unit = { where: string; text: string };

  function collect(node: unknown, where: string, out: Unit[]): void {
    if (Array.isArray(node)) {
      node.forEach((n, i) => collect(n, `${where}[${i}]`, out));
      return;
    }
    if (!node || typeof node !== "object") return;
    for (const [k, v] of Object.entries(node)) {
      const loc = k === "tr" || k === "en";
      if (loc && typeof v === "string") {
        out.push({ where: `${where}.${k}`, text: v });
      } else if (loc && Array.isArray(v) && v.every((x) => typeof x === "string")) {
        v.forEach((t: string, i) => out.push({ where: `${where}.${k}[${i}]`, text: t }));
      } else {
        collect(v, `${where}.${k}`, out);
      }
    }
  }

  const units: Unit[] = [];
  for (const s of SERVICES) collect(s, `hizmet:${s.slug.tr}`, units);
  for (const p of PACKAGES) collect(p, `paket:${p.slug.tr}`, units);
  for (const c of CASES) collect(c, `vaka:${c.slug.tr}`, units);
  for (const a of ARTICLES) collect(a, `yazi:${a.slug.tr}`, units);

  const noTie =
    /hiçbir [^.;]{0,60}(sağlayıcısıyla|tedarikçiden)|(commission|partnership)[^.;]{0,80}\bany\b[^.;]{0,60}(supplier|provider|vendor)/i;

  it("INDOLES'in sağlayıcı bağımsızlığı cümlesi İKAS istisnasını aynı pasajda taşır", () => {
    const claims = units.filter(
      (u) => u.text.includes("INDOLES") && noTie.test(u.text),
    );
    // Test kendini doğruluyor: iddia gerçekten var (paket SSS, iki hizmet,
    // iki yapay zeka yazısı, TR + EN).
    expect(claims.length).toBeGreaterThanOrEqual(10);
    for (const u of claims) expect(u.text, u.where).toContain("İKAS");
  });

  it("eski ortaklık ve 'satıcı değildir' ifadeleri kalmadı", () => {
    const stale =
      /İKAS ortaklığı|partnership with İKAS|With İKAS we|INDOLES satıcı değildir|INDOLES is not a (vendor|reseller)\b/;
    for (const u of units) {
      expect(u.text.match(stale)?.[0] ?? null, u.where).toBeNull();
    }
  });

  it("platform ve bağımsızlık konuşulan sayfalar bayiliği iki dilde açıklar", () => {
    const required = [
      "hizmet:e-ticaret",
      "hizmet:ai-danismanlik",
      "hizmet:dijital-donusum",
      "paket:dijital-donusum-teshisi",
      "vaka:odorgo-kategori-yaratma",
      "yazi:buyuk-danismanlik-mi-butik-yapay-zeka-ajansi-mi",
      "yazi:yapay-zeka-danismanligi-fiyatlari",
      "yazi:e-ticaret-danismani-nasil-secilir",
      "yazi:e-ticaret-danismanligi-fiyatlari",
      "yazi:e-ticaret-platform-danismanligi",
      // Yayındaki eski yazı: SSS'i İKAS'ı platform olarak öneriyor.
      "yazi:gercek-e-ticaret-ajansinin-etkisi",
    ];
    for (const prefix of required) {
      const own = units.filter((u) => u.where.startsWith(`${prefix}.`));
      const tr = own.some(
        (u) => /\.tr(\[\d+\])?$/.test(u.where) && /İKAS/.test(u.text) && /bayisi/.test(u.text),
      );
      const en = own.some(
        (u) => /\.en(\[\d+\])?$/.test(u.where) && /İKAS/.test(u.text) && /resell/.test(u.text),
      );
      expect(tr, `${prefix} TR`).toBe(true);
      expect(en, `${prefix} EN`).toBe(true);
    }
  });
});
