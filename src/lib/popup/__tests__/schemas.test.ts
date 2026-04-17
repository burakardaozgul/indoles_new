import { describe, it, expect } from "vitest";
import { popupSubmitSchema, leadFormSchema } from "../schemas";

describe("popupSubmitSchema", () => {
  const validPayload = {
    sessionId: "sess_abc123",
    persona: "donusum-teknoloji" as const,
    problems: ["manuel-surec-yavaslatiyor", "verimsizlik-goremiyorum", "ai-uygulama-bilmiyorum"],
    submissionType: "booking" as const,
    locale: "tr" as const,
    lead: {
      firstName: "Ali",
      lastName: "Veli",
      phone: "+905551234567",
      email: "ali@ornek.com",
      company: "Test AŞ",
      title: "CTO",
      kvkkConsent: true,
    },
  };

  it("geçerli payload'u kabul eder", () => {
    expect(() => popupSubmitSchema.parse(validPayload)).not.toThrow();
  });

  it("tam 3 problem zorunludur", () => {
    expect(() => popupSubmitSchema.parse({ ...validPayload, problems: ["a", "b"] })).toThrow();
    expect(() => popupSubmitSchema.parse({ ...validPayload, problems: ["a", "b", "c", "d"] })).toThrow();
  });

  it("booking/contact için lead zorunlu", () => {
    const { lead, ...withoutLead } = validPayload;
    expect(() => popupSubmitSchema.parse(withoutLead)).toThrow();
  });

  it("skipped için lead opsiyonel", () => {
    const { lead, ...withoutLead } = validPayload;
    expect(() => popupSubmitSchema.parse({ ...withoutLead, submissionType: "skipped" as const })).not.toThrow();
  });

  it("KVKK false reddeder", () => {
    expect(() =>
      popupSubmitSchema.parse({ ...validPayload, lead: { ...validPayload.lead, kvkkConsent: false } })
    ).toThrow();
  });

  it("invalid email reddeder", () => {
    expect(() => leadFormSchema.parse({ ...validPayload.lead, email: "not-email" })).toThrow();
  });

  it("invalid persona reddeder", () => {
    expect(() => popupSubmitSchema.parse({ ...validPayload, persona: "other" })).toThrow();
  });
});
