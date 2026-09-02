import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { containers, controls, shadow } from "@/lib/design/tokens";
import { TOOL_SCAN, TOOL_SCORE } from "@/lib/v2/anim-config";

/**
 * Araç yüzeyi token'ları — `tokens.ts` ↔ `globals.css` @theme senkronu.
 * Değişiklik sırası docs/04 §11: docs → tokens.ts → globals.css → bileşen.
 */
const css = readFileSync(path.join(process.cwd(), "src/styles/globals.css"), "utf8");

describe("araç yüzeyi token'ları", () => {
  it("container ve size token'ları globals.css'te aynı değerle var", () => {
    expect(css).toContain(`--container-tool: ${containers.tool};`);
    expect(css).toContain(`--size-scanbar: ${controls.scanBar};`);
    expect(css).toContain(`--size-scanbar-mobile: ${controls.scanBarMobile};`);
  });

  it("shadow-float çok katmanlı ve teal tonlu", () => {
    expect(css).toContain("--shadow-float:");
    expect(shadow.float.split(",").length).toBeGreaterThanOrEqual(3);
    expect(shadow.float).toContain("44,85,102");
  });

  it("tarama ve skor süreleri anim-config'te", () => {
    expect(TOOL_SCAN).toEqual({ enterStaggerMs: 400, resolveStaggerMs: 150, morphMs: 500 });
    expect(TOOL_SCORE).toEqual({ countMs: 800 });
  });
});
