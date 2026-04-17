import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import type { Plugin } from "vite";

// Vite plugin: post-processes @react-email/render so that `render()` decodes
// HTML entities that React 19's streaming renderer encodes (e.g. ' → &#x27;).
// This only affects the test environment; production usage is unaffected.
const reactEmailRenderDecodePlugin: Plugin = {
  name: "react-email-render-decode",
  enforce: "post",
  transform(code, id) {
    if (!id.includes("@react-email/render") || id.includes("__mocks__")) return;
    // Wrap the exported `render` function by replacing its return call
    // with a version that decodes HTML entities before returning.
    const decode = `
;(function __patchRenderForTests() {
  const __origRender = exports.render;
  exports.render = async function render(node, options) {
    const html = await __origRender(node, options);
    if (typeof html !== "string") return html;
    return html.replace(/&#x27;/g, "'").replace(/&quot;/g, '"');
  };
})();
`;
    return { code: code + decode, map: null };
  },
};

export default defineConfig({
  plugins: [react(), reactEmailRenderDecodePlugin],
  test: {
    environment: "jsdom",
    globals: true,
    include: [
      "tests/unit/**/*.{test,spec}.{ts,tsx}",
      "tests/integration/**/*.{test,spec}.{ts,tsx}",
      "src/**/__tests__/**/*.{test,spec}.{ts,tsx}",
    ],
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
    setupFiles: ["./tests/setup.ts"],
    server: {
      deps: {
        // Inline @react-email/render so the transform plugin can patch it
        inline: ["@react-email/render"],
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
