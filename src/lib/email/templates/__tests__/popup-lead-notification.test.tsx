import { describe, it, expect } from "vitest";
import { render } from "@react-email/render";
import { PopupLeadNotificationEmail } from "../popup-lead-notification";

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
    calComBookingUrl: "https://cal.com/booking/abc",
    locale: "tr" as const,
    utm: { source: "google", medium: "cpc", campaign: "spring" },
    adminLink: "https://indoles.com.tr/admin/leads/xyz",
  };

  it("lead bilgilerini içerir", async () => {
    const html = await render(<PopupLeadNotificationEmail {...props} />);
    expect(html).toContain("Ali Veli");
    expect(html).toContain("ali@ornek.com");
    expect(html).toContain("Test AŞ");
    expect(html).toContain("Dönüşüm ve Teknoloji");
  });

  it("3 sorunu listeler", async () => {
    const html = await render(<PopupLeadNotificationEmail {...props} />);
    for (const p of props.problems) expect(html).toContain(p);
  });

  it("Cal.com linkini içerir (booking)", async () => {
    const html = await render(<PopupLeadNotificationEmail {...props} />);
    expect(html).toContain("cal.com/booking/abc");
  });

  it("contact path'te Cal.com bölümünü atlar", async () => {
    const html = await render(
      <PopupLeadNotificationEmail {...props} submissionType="contact" calComBookingUrl={null} />
    );
    expect(html).not.toContain("cal.com/booking");
  });
});
