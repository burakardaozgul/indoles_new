import { describe, it, expect } from "vitest";
import { hashClientIp } from "../ip-hash";

describe("hashClientIp", () => {
  it("64 karakter hex üretir ve deterministiktir", async () => {
    const a = await hashClientIp("1.2.3.4", "tuz");
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(await hashClientIp("1.2.3.4", "tuz")).toBe(a);
  });
  it("tuz değişince hash değişir", async () => {
    expect(await hashClientIp("1.2.3.4", "a")).not.toBe(await hashClientIp("1.2.3.4", "b"));
  });
});
