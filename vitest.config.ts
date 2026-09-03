import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    /**
     * Varsayılan `node`, jsdom yalnız gerçekten DOM'a dokunan dosyalarda.
     *
     * Niçin: eskiden `environment: "jsdom"` global'di ve 91 test dosyasının
     * hepsi — şema, depo, slot, SMTP gibi saf Node testleri dahil — birer
     * jsdom örneği kuruyordu. Vitest işçileri dosyalar arasında yeniden
     * kullandığı için jsdom sızıntıları birikiyor ve 2 çekirdekli GitHub
     * runner'ında iki işçi sonda OOM ile ölüyordu ("Worker exited
     * unexpectedly", 41 test hiç koşmadan). Yerelde bellek baskısı olmadığı
     * için görünmüyordu. 91 dosyanın 52'si DOM'a hiç dokunmuyor.
     */
    environment: "node",
    environmentMatchGlobs: [
      ["**/*.{test,spec}.tsx", "jsdom"],
      // DOM'a dokunan .ts testleri — ölçülerek çıkarıldı, tahmin değil.
      ["tests/unit/root-layout-head.test.ts", "jsdom"],
      ["tests/unit/page-metadata.test.ts", "jsdom"],
      ["src/lib/popup/__tests__/cookie.test.ts", "jsdom"],
      ["src/lib/popup/__tests__/analytics.test.ts", "jsdom"],
      ["src/lib/consent/__tests__/cookie.test.ts", "jsdom"],
      ["src/lib/consent/__tests__/apply.test.ts", "jsdom"],
      ["src/lib/consent/__tests__/gate.test.ts", "jsdom"],
      ["src/lib/analytics/__tests__/session.test.ts", "jsdom"],
      ["src/lib/analytics/__tests__/ga-bootstrap.test.ts", "jsdom"],
      // Diagnoo yoklama hook'u — renderHook DOM ister (Görev 15).
      ["src/components/tools/__tests__/use-diagnoo-status.test.ts", "jsdom"],
    ],
    globals: true,
    include: [
      "tests/unit/**/*.{test,spec}.{ts,tsx}",
      "tests/integration/**/*.{test,spec}.{ts,tsx}",
      "src/**/__tests__/**/*.{test,spec}.{ts,tsx}",
      "emails/**/__tests__/**/*.{test,spec}.{ts,tsx}",
      "scripts/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
