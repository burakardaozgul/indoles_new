import { describe, it, expect, vi } from "vitest";
import { trackPopupEvent } from "../analytics";

const mockCapture = vi.fn();
vi.mock("../../analytics/posthog", () => ({
  posthog: { capture: (...args: unknown[]) => mockCapture(...args) },
}));

describe("trackPopupEvent", () => {
  it("popup_shown event'i capture eder", () => {
    trackPopupEvent("popup_shown", { trigger_source: "initial" });
    expect(mockCapture).toHaveBeenCalledWith("popup_shown", { trigger_source: "initial" });
  });

  it("popup_stage1_selected event'i capture eder", () => {
    trackPopupEvent("popup_stage1_selected", { persona: "donusum-teknoloji", time_on_stage_ms: 5000 });
    expect(mockCapture).toHaveBeenCalledWith("popup_stage1_selected", {
      persona: "donusum-teknoloji",
      time_on_stage_ms: 5000,
    });
  });

  it("server-side (window undefined) capture yapmaz", () => {
    vi.stubGlobal("window", undefined);
    mockCapture.mockClear();
    trackPopupEvent("popup_shown", { trigger_source: "initial" });
    expect(mockCapture).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });
});
