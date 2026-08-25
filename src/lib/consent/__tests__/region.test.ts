import { describe, it, expect } from "vitest";
import { CONSENT_REGIONS, isConsentRequired } from "../region";

describe("isConsentRequired", () => {
  it("EEA ülkesinde onay ister", () => {
    expect(isConsentRequired("DE")).toBe(true);
    expect(isConsentRequired("IE")).toBe(true);
  });

  it("EEA dışı Avrupa Ekonomik Alanı üyelerinde de onay ister", () => {
    // Norveç, İzlanda, Lihtenştayn AB üyesi değil ama EEA üyesi.
    expect(isConsentRequired("NO")).toBe(true);
    expect(isConsentRequired("IS")).toBe(true);
    expect(isConsentRequired("LI")).toBe(true);
  });

  it("Birleşik Krallık'ta onay ister (UK GDPR)", () => {
    expect(isConsentRequired("GB")).toBe(true);
  });

  it("Türkiye'de onay istemez", () => {
    expect(isConsentRequired("TR")).toBe(false);
  });

  it("küçük harfli ülke kodunu da tanır", () => {
    expect(isConsentRequired("de")).toBe(true);
  });

  it("ülke bilinmiyorsa onay istemez", () => {
    // Vercel geo başlığı yoksa (lokal, self-host) TR varsayılanına düşülür;
    // docs/14 §3 kararı bölgesel — bilinmeyeni EEA saymak TR ölçümünü kapatırdı.
    expect(isConsentRequired(null)).toBe(false);
    expect(isConsentRequired("")).toBe(false);
  });
});

describe("CONSENT_REGIONS", () => {
  it("gtag region parametresi için 31 ülke taşır (EEA 30 + GB)", () => {
    expect(CONSENT_REGIONS).toHaveLength(31);
  });

  it("tümü ISO 3166-1 alpha-2 büyük harf kodudur", () => {
    for (const code of CONSENT_REGIONS) {
      expect(code).toMatch(/^[A-Z]{2}$/);
    }
  });

  it("tekrar eden kod içermez", () => {
    expect(new Set(CONSENT_REGIONS).size).toBe(CONSENT_REGIONS.length);
  });

  it("isConsentRequired ile aynı kaynaktan beslenir", () => {
    for (const code of CONSENT_REGIONS) {
      expect(isConsentRequired(code)).toBe(true);
    }
  });
});
