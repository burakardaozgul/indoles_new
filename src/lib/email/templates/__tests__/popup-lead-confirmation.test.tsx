import { describe, it, expect } from "vitest";
import { render } from "@react-email/render";
import { PopupLeadConfirmationEmail } from "../popup-lead-confirmation";
import { decodeEntities } from "./test-utils";

describe("PopupLeadConfirmationEmail", () => {
  const base = { firstName: "Ali", locale: "tr" as const };

  it("booking variant Cal.com bilgisini içerir", async () => {
    const html = decodeEntities(await render(
      <PopupLeadConfirmationEmail {...base} variant="booking" calComBookingUrl="https://cal.com/x" />
    ));
    expect(html).toContain("cal.com/x");
    expect(html).toContain("Ali");
  });

  it("contact variant 1 iş günü mesajını içerir", async () => {
    const html = decodeEntities(await render(
      <PopupLeadConfirmationEmail {...base} variant="contact" />
    ));
    expect(html).toMatch(/1 iş günü/);
  });

  it("EN locale doğru string'leri kullanır", async () => {
    const html = decodeEntities(await render(
      <PopupLeadConfirmationEmail {...base} variant="contact" locale="en" />
    ));
    expect(html).toMatch(/business day/i);
  });

  it("booking variant calComBookingUrl=null ise Cal.com link bölümünü atlar", async () => {
    const html = decodeEntities(await render(
      <PopupLeadConfirmationEmail {...base} variant="booking" calComBookingUrl={null} />
    ));
    expect(html).not.toContain("cal.com");
    expect(html).not.toContain("Seçim bağlantısı");
  });
});
