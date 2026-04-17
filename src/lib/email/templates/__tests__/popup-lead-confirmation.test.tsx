import { describe, it, expect } from "vitest";
import { render } from "@react-email/render";
import { PopupLeadConfirmationEmail } from "../popup-lead-confirmation";

// Decode HTML entities (React 19 encodes apostrophes and some chars in text nodes)
function decodeEntities(html: string): string {
  return html
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

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
});
