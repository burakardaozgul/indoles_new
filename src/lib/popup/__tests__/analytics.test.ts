import { describe, it, expect, vi } from "vitest";
import { trackPopupEvent } from "../analytics";

const mockEvent = vi.fn();
vi.mock("../../analytics/ga", () => ({
  gaEvent: (...args: unknown[]) => mockEvent(...args),
}));

describe("trackPopupEvent", () => {
  it("popup_shown olayını GA4'e yazar", () => {
    trackPopupEvent("popup_shown", { trigger_source: "initial" });
    expect(mockEvent).toHaveBeenCalledWith("popup_shown", { trigger_source: "initial" });
  });

  it("popup_stage1_selected olayını GA4'e yazar", () => {
    trackPopupEvent("popup_stage1_selected", { persona: "donusum-teknoloji", time_on_stage_ms: 5000 });
    expect(mockEvent).toHaveBeenCalledWith("popup_stage1_selected", {
      persona: "donusum-teknoloji",
      time_on_stage_ms: 5000,
    });
  });

  it("dizi taşıyan alanları düzleştirir, boş alanları düşürür", () => {
    mockEvent.mockClear();
    trackPopupEvent("popup_stage2_submitted", {
      persona: "donusum-teknoloji",
      problems: ["verimlilik", "gorunurluk"],
      time_on_stage_ms: 1200,
    });
    expect(mockEvent).toHaveBeenCalledWith("popup_stage2_submitted", {
      persona: "donusum-teknoloji",
      problems: "verimlilik,gorunurluk",
      time_on_stage_ms: 1200,
    });
  });

  it("sunucu tarafında (window undefined) olay yazmaz", () => {
    vi.stubGlobal("window", undefined);
    mockEvent.mockClear();
    trackPopupEvent("popup_shown", { trigger_source: "initial" });
    expect(mockEvent).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
