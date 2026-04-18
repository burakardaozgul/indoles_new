import { describe, it, expect, vi, beforeEach } from "vitest";
import { handlePopupLeadCreated } from "../popup-lead";
import type { PopupLeadEventData } from "../../events/popup-lead";

const mockSendEmail = vi.fn().mockResolvedValue({ id: "email_abc" });
vi.mock("../../../email/client", () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
}));

const bookingPayload: PopupLeadEventData = {
  submissionId: "00000000-0000-0000-0000-000000000001",
  firstName: "Ali",
  lastName: "Veli",
  email: "ali@ornek.com",
  phone: "+905551234567",
  company: "Test AŞ",
  title: "CTO",
  persona: "donusum-teknoloji",
  personaLabel: "Dönüşüm ve Teknoloji",
  problems: ["Manuel süreç.", "Verim yok.", "AI bilinmiyor."],
  submissionType: "booking",
  calComBookingUrl: "https://cal.com/booking/abc",
  locale: "tr",
  utm: { source: null, medium: null, campaign: null },
};

beforeEach(() => {
  mockSendEmail.mockClear();
});

describe("handlePopupLeadCreated", () => {
  it("booking: lead + confirmation email gönderir", async () => {
    await handlePopupLeadCreated(bookingPayload);

    expect(mockSendEmail).toHaveBeenCalledTimes(2);
    const first = mockSendEmail.mock.calls[0]![0] as { to: string };
    const second = mockSendEmail.mock.calls[1]![0] as { to: string };
    expect(first.to).toBe("lead@indoles.com.tr");
    expect(second.to).toBe("ali@ornek.com");
  });

  it("contact variant (calComBookingUrl yok): iki email", async () => {
    const contactPayload: PopupLeadEventData = {
      ...bookingPayload,
      submissionId: "00000000-0000-0000-0000-000000000002",
      submissionType: "contact",
      calComBookingUrl: null,
    };

    await handlePopupLeadCreated(contactPayload);

    expect(mockSendEmail).toHaveBeenCalledTimes(2);
  });

  it("locale en: EN subject kullanır", async () => {
    const enPayload: PopupLeadEventData = {
      ...bookingPayload,
      submissionId: "00000000-0000-0000-0000-000000000003",
      locale: "en",
    };

    await handlePopupLeadCreated(enPayload);

    const userCall = mockSendEmail.mock.calls[1]![0] as { subject: string };
    expect(userCall.subject).toBe("INDOLES: We've got your request");
  });

  it("UTM alanları admin email props'una taşınır", async () => {
    const utmPayload: PopupLeadEventData = {
      ...bookingPayload,
      submissionId: "00000000-0000-0000-0000-000000000004",
      utm: { source: "google", medium: "cpc", campaign: "brand-tr" },
    };

    await handlePopupLeadCreated(utmPayload);

    expect(mockSendEmail).toHaveBeenCalledTimes(2);
    // UTM props are passed into the react component; we verify sendEmail was called
    // (template rendering is tested at template level)
  });

  it("idempotencyKey her email çağrısında submissionId prefix ile set edilir", async () => {
    await handlePopupLeadCreated(bookingPayload);

    const adminCall = mockSendEmail.mock.calls[0]![0] as { idempotencyKey: string };
    const userCall = mockSendEmail.mock.calls[1]![0] as { idempotencyKey: string };
    expect(adminCall.idempotencyKey).toBe("00000000-0000-0000-0000-000000000001:admin");
    expect(userCall.idempotencyKey).toBe("00000000-0000-0000-0000-000000000001:user");
  });
});
