import { describe, it, expect } from "vitest";
import { render } from "@react-email/render";
import { PopupLeadNotificationEmail } from "../popup-lead-notification";
import { decodeEntities } from "./test-utils";

describe("PopupLeadNotificationEmail", () => {
  const props = {
    firstName: "Ali",
    lastName: "Veli",
    email: "ali@ornek.com",
    phone: "+905551234567",
    company: "Test AŞ",
    title: "CTO",
    personaLabel: "Dönüşüm ve Teknoloji",
    problems: [
      "Manuel süreçler ekibimi yavaşlatıyor.",
      "Verimsizlik nerede, kesin bilemiyorum.",
      "AI'ın şirketime nasıl uygulanacağını göremiyorum.",
    ],
    submissionType: "booking" as const,
    locale: "tr" as const,
    utm: { source: "google", medium: "cpc", campaign: "spring" },
    adminLink: "https://indoles.com.tr/admin/leads/xyz",
  };

  it("lead bilgilerini içerir", async () => {
    const html = decodeEntities(await render(<PopupLeadNotificationEmail {...props} />));
    expect(html).toContain("Ali Veli");
    expect(html).toContain("ali@ornek.com");
    expect(html).toContain("Test AŞ");
    expect(html).toContain("Dönüşüm ve Teknoloji");
  });

  it("3 sorunu listeler", async () => {
    const html = decodeEntities(await render(<PopupLeadNotificationEmail {...props} />));
    for (const p of props.problems) expect(html).toContain(p);
  });

  it("Cal.com izi içermez (ADR-025)", async () => {
    const html = decodeEntities(await render(<PopupLeadNotificationEmail {...props} />));
    expect(html).not.toContain("cal.com");
  });
});
