import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils/cn";

describe("cn", () => {
  it("birden fazla class'ı birleştirir", () => {
    expect(cn("a", "b")).toBe("a b");
  });
  it("falsy değerleri atar", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });
  it("çakışan Tailwind class'larında sonuncuyu bırakır", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});
