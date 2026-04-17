import { describe, it, expect, vi } from "vitest";
import { handlePopupLeadCreated } from "../popup-lead";

const mockSendEmail = vi.fn().mockResolvedValue({ id: "email_abc" });
vi.mock("../../../email/client", () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
}));

const mockDbUpdate = vi.fn().mockResolvedValue(undefined);
vi.mock("../../../../server/db/mutations/popup", () => ({
  markEmailSentForSubmission: (...args: unknown[]) => mockDbUpdate(...args),
}));

describe("handlePopupLeadCreated", () => {
  it("lead + confirmation email gönderir", async () => {
    await handlePopupLeadCreated({
      submissionId: "sub_123",
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
    });

    expect(mockSendEmail).toHaveBeenCalledTimes(2);
    const first = mockSendEmail.mock.calls[0]![0] as { to: string };
    const second = mockSendEmail.mock.calls[1]![0] as { to: string };
    expect(first.to).toBe("lead@indoles.com.tr");
    expect(second.to).toBe("ali@ornek.com");
    expect(mockDbUpdate).toHaveBeenCalledWith("sub_123");
  });
});
