import { describe, it, expect } from "vitest";
import { resolveFbc, requestMatchSignals, hasMarketingConsent } from "../meta-lead";

/**
 * Sunucu tarafı Lead göndericisinin saf parçaları (ADR-036).
 *
 * `sendMetaLead`in kendisi ağa çıkıyor ve env okuyor; testlenen şey onun
 * girdisini üreten saf fonksiyonlar — eşleştirme sinyallerinin doğru
 * çözülmesi ve rıza kapısı. Asıl regresyon riski burada: sinyal sessizce
 * düşerse eşleştirme kalitesi düşer ve hiçbir yer hata vermez.
 */

function req(cookie: string, headers: Record<string, string> = {}): Request {
  return new Request("https://www.indoles.com.tr/api/contact", {
    method: "POST",
    headers: { cookie, ...headers },
  });
}

describe("resolveFbc — reklam tiklama kimligi", () => {
  it("Pixel'in yazdigi _fbc varsa onu kullanir", () => {
    expect(resolveFbc("_fbc=fb.1.1700000000000.ABC123")).toBe("fb.1.1700000000000.ABC123");
  });

  it("_fbc yoksa kendi yakaladigimiz fbclid'den kurar — alt alan indeksi 2", () => {
    // Bu yol iki bosluk kapatiyor: Pixel yuklenmeden once gerceklesen
    // donusumler ve reklam engelleyicinin Pixel'i hic yuklemedigi durumlar.
    // Indeks 2, cunku canlida Pixel'in kendisi de 2 yaziyor (www.indoles.com.tr,
    // com.tr public suffix) — olculdu, tahmin edilmedi.
    expect(resolveFbc("indoles_fbclid=1700000000000.ABC123")).toBe("fb.2.1700000000000.ABC123");
  });

  it("_fbc oncelikli — ikisi de varsa Pixel'inki kazanir", () => {
    const out = resolveFbc("_fbc=fb.1.111.PIXEL; indoles_fbclid=222.BIZIM");
    expect(out).toBe("fb.1.111.PIXEL");
  });

  it("hicbiri yoksa undefined", () => {
    expect(resolveFbc("_fbp=fb.1.1.2")).toBeUndefined();
  });

  it("bozuk fbclid cerezinde undefined — uydurma deger gondermez", () => {
    expect(resolveFbc("indoles_fbclid=zamansiz")).toBeUndefined();
    expect(resolveFbc("indoles_fbclid=.ABC")).toBeUndefined();
    expect(resolveFbc("indoles_fbclid=1700000000000.")).toBeUndefined();
  });

  it("URL-encoded fbclid cozulur", () => {
    expect(resolveFbc("indoles_fbclid=" + encodeURIComponent("1700000000000.A_B-C"))).toBe(
      "fb.2.1700000000000.A_B-C",
    );
  });
});

describe("requestMatchSignals — istegin kendi basliklarindan", () => {
  it("IP, UA, fbp, fbc ve external_id'yi toplar", () => {
    const r = req("_fbp=fb.1.99.88; _fbc=fb.1.77.CLICK; indoles_vid=v1.abc-123", {
      "cf-connecting-ip": "203.0.113.7",
      "user-agent": "Mozilla/5.0 test",
    });
    expect(requestMatchSignals(r)).toEqual({
      clientIpAddress: "203.0.113.7",
      clientUserAgent: "Mozilla/5.0 test",
      fbp: "fb.1.99.88",
      fbc: "fb.1.77.CLICK",
      externalId: "v1.abc-123",
    });
  });

  it("olmayan sinyali ALAN OLARAK HIC KOYMAZ", () => {
    // `exactOptionalPropertyTypes` disinda bir gerekce daha var: Meta bos
    // dizgeyi gecerli bir eslestirme anahtari sayip kalitesini dusurebilir.
    expect(requestMatchSignals(req(""))).toEqual({});
  });

  it("yalniz external_id varken de calisir — anonim ViewContent yolu", () => {
    // ViewContent anonim yuzeylerde tetikleniyor; external_id orada
    // gonderilebilen tek eslestirme anahtari.
    expect(requestMatchSignals(req("indoles_vid=v1.tek"))).toEqual({ externalId: "v1.tek" });
  });
});

describe("hasMarketingConsent — sunucudaki ikinci kapi", () => {
  it("gg -> izin var", () => {
    expect(hasMarketingConsent(req("indoles_consent=gg"))).toBe(true);
  });

  it("gd -> pazarlama reddedilmis", () => {
    // Ilk hane analitik, ikinci hane pazarlama (lib/consent/cookie.ts).
    expect(hasMarketingConsent(req("indoles_consent=gd"))).toBe(false);
  });

  it("dg -> pazarlama var (analitik yok)", () => {
    expect(hasMarketingConsent(req("indoles_consent=dg"))).toBe(true);
  });

  it("cerez yoksa izin yok", () => {
    expect(hasMarketingConsent(req(""))).toBe(false);
  });

  it("ADR-033 oncesi tek kelimelik cerez pazarlama izni SAYILMAZ", () => {
    // O ziyaretcilere pazarlama hic sorulmamisti.
    expect(hasMarketingConsent(req("indoles_consent=granted"))).toBe(false);
  });
});
