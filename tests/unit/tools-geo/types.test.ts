import { describe, it, expect } from "vitest";
import { bandFor, statusFor, BAND_ORDER, BAND_THRESHOLDS } from "@/lib/tools/geo/types";

describe("bandFor", () => {
  it.each([[0,"zayif"],[39,"zayif"],[40,"gelismeye-acik"],[69,"gelismeye-acik"],[70,"iyi"],[89,"iyi"],[90,"oncu"],[100,"oncu"]] as const)(
    "%i → %s", (n, band) => expect(bandFor(n)).toBe(band)
  );
});
describe("statusFor", () => {
  it("0 → fail, tavan → pass, arası → partial", () => {
    expect(statusFor(0, 25)).toBe("fail");
    expect(statusFor(25, 25)).toBe("pass");
    expect(statusFor(10, 25)).toBe("partial");
  });
});

describe("BAND_THRESHOLDS — bandFor ile tek kaynak", () => {
  it("eşikler sıralı ve bandFor ile tutarlı", () => {
    expect(BAND_ORDER).toEqual(["zayif", "gelismeye-acik", "iyi", "oncu"]);
    expect(bandFor(BAND_THRESHOLDS["gelismeye-acik"] - 1)).toBe("zayif");
    expect(bandFor(BAND_THRESHOLDS["gelismeye-acik"])).toBe("gelismeye-acik");
    expect(bandFor(BAND_THRESHOLDS.iyi - 1)).toBe("gelismeye-acik");
    expect(bandFor(BAND_THRESHOLDS.iyi)).toBe("iyi");
    expect(bandFor(BAND_THRESHOLDS.oncu - 1)).toBe("iyi");
    expect(bandFor(BAND_THRESHOLDS.oncu)).toBe("oncu");
    expect(bandFor(100)).toBe("oncu");
  });
});
