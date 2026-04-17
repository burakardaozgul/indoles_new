import { describe, it, expect, vi, beforeEach } from "vitest";
import { popupRouter } from "../popup";
import type { PopupSubmitInput } from "../../../lib/popup/schemas";

const mockReturning = vi.fn().mockResolvedValue([{ id: "sub_123" }]);
vi.mock("../../db", () => ({
  db: {
    insert: () => ({ values: () => ({ returning: mockReturning }) }),
  },
}));

const mockInngest = vi.fn().mockResolvedValue(undefined);
vi.mock("../../../lib/inngest/client", () => ({
  inngest: { send: (...args: unknown[]) => mockInngest(...args) },
}));

const bookingPayload: PopupSubmitInput = {
  sessionId: "sess_1",
  persona: "donusum-teknoloji",
  problems: ["manuel-surec-yavaslatiyor", "verimsizlik-goremiyorum", "ai-uygulama-bilmiyorum"],
  submissionType: "booking",
  locale: "tr",
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

const caller = popupRouter.createCaller({ locale: "tr" } as any);

describe("popupRouter.submit", () => {
  beforeEach(() => {
    mockReturning.mockClear();
    mockInngest.mockClear();
  });

  it("booking path — DB insert + Inngest event tetikler (Cal.com YOK)", async () => {
    const res = await caller.submit(bookingPayload);
    expect(mockReturning).toHaveBeenCalled();
    expect(mockInngest).toHaveBeenCalledWith(expect.objectContaining({ name: "popup/lead.created" }));
    expect(res.submissionId).toBe("sub_123");
    expect(res.bookingUrl).toBeNull(); // Cal.com skipped — bookingUrl always null for now
  });

  it("contact path — DB + Inngest, booking path ile aynı davranış", async () => {
    await caller.submit({ ...bookingPayload, submissionType: "contact" });
    expect(mockReturning).toHaveBeenCalled();
    expect(mockInngest).toHaveBeenCalledWith(expect.objectContaining({ name: "popup/lead.created" }));
  });

  it("skipped — DB write, Inngest YOK", async () => {
    const { lead, ...rest } = bookingPayload;
    await caller.submit({ ...rest, submissionType: "skipped" } as PopupSubmitInput);
    expect(mockReturning).toHaveBeenCalled();
    expect(mockInngest).not.toHaveBeenCalled();
  });

  it("Inngest event PopupLeadEventData shape'ine uyar", async () => {
    await caller.submit(bookingPayload);
    const eventCall = mockInngest.mock.calls[0]![0] as { name: string; data: Record<string, unknown> };
    expect(eventCall.name).toBe("popup/lead.created");
    expect(eventCall.data.submissionId).toBe("sub_123");
    expect(eventCall.data.persona).toBe("donusum-teknoloji");
    expect(eventCall.data.personaLabel).toBe("Dönüşüm ve Teknoloji");
    expect(eventCall.data.problems).toEqual([
      "Manuel süreçler ekibimi yavaşlatıyor.",
      "Verimsizlik nerede, kesin bilemiyorum.",
      "AI'ın şirketime nasıl uygulanacağını göremiyorum.",
    ]);
    expect(eventCall.data.calComBookingUrl).toBeNull();
  });
});
