import { describe, it, expect } from "vitest";
import { render } from "@react-email/render";
import { PopupLeadConfirmationEmail } from "../popup-lead-confirmation";
import { decodeEntities } from "./test-utils";

describe("PopupLeadConfirmationEmail", () => {
  const base = { firstName: "Ali", locale: "tr" as const };

  it("booking variant talep onayını basar, Cal.com izi içermez (ADR-025)", async () => {
    const html = decodeEntities(await render(
      <PopupLeadConfirmationEmail {...base} variant="booking" />
    ));
    expect(html).toContain("Ali");
    expect(html).toContain("takvim davetini");
    expect(html).not.toContain("cal.com");
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
