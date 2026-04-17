import type { Config } from "tailwindcss";

// Tailwind v4 — ana konfigürasyon src/styles/globals.css içindeki @theme block'tadır.
// Bu dosya yalnızca content path'leri ve plugin'ler içindir.

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
    "./sanity/**/*.{ts,tsx}",
  ],
};

export default config;
