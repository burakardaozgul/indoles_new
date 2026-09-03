import { describe, it, expect } from "vitest";
import { diagnooFailureMessage, DIAGNOO_FAIL_COPY } from "../fail-copy";

/**
 * Görev 17.3 — paylaşılan başarısız-durum kopyası. İstemci (`diagnoo-tool.
 * tsx`) ve sunucu (rapor sayfası) AYNI bu modülden okur; testler eşlemenin
 * her iki dilde de doğru çözüldüğünü doğrular.
 */
describe("diagnooFailureMessage", () => {
  it("scrape_failed → site alınamadı kopyası (TR/EN)", () => {
    expect(diagnooFailureMessage("scrape_failed", "tr")).toBe(DIAGNOO_FAIL_COPY.tr.scrapeFailed);
    expect(diagnooFailureMessage("scrape_failed", "en")).toBe(DIAGNOO_FAIL_COPY.en.scrapeFailed);
  });

  it("not_found → teşhis bulunamadı kopyası", () => {
    expect(diagnooFailureMessage("not_found", "tr")).toBe(DIAGNOO_FAIL_COPY.tr.notFound);
  });

  it("network_error → yoklama ağ hatası kopyası", () => {
    expect(diagnooFailureMessage("network_error", "en")).toBe(DIAGNOO_FAIL_COPY.en.networkError);
  });

  it("pipeline_error ve tanımsız her şey → genel kopya", () => {
    expect(diagnooFailureMessage("pipeline_error", "tr")).toBe(DIAGNOO_FAIL_COPY.tr.generic);
    expect(diagnooFailureMessage(null, "tr")).toBe(DIAGNOO_FAIL_COPY.tr.generic);
    expect(diagnooFailureMessage("baska-bir-sey", "en")).toBe(DIAGNOO_FAIL_COPY.en.generic);
  });
});
