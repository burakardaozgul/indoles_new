import { describe, it, expect } from "vitest";
import { bandFor, statusFor } from "@/lib/tools/geo/types";

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
