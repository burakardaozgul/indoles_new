import type { DiagnooEnv } from "./firecrawl";

export async function fetchCwv(
  env: DiagnooEnv, url: string,
): Promise<{ lcpMs: number; cls: number; ttfbMs: number; inpMs: number | null } | null> {
  const key = env.PSI_API_KEY ? `&key=${env.PSI_API_KEY}` : "";
  const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=MOBILE${key}`;
  try {
    const res = await fetch(api);
    if (!res.ok) return null;
    const body = (await res.json()) as { lighthouseResult?: { audits?: Record<string, { numericValue?: number }> } };
    const audits = body.lighthouseResult?.audits;
    if (!audits) return null;
    const lcp = audits["largest-contentful-paint"]?.numericValue;
    if (lcp == null) return null;
    return {
      lcpMs: lcp,
      cls: audits["cumulative-layout-shift"]?.numericValue ?? 0,
      ttfbMs: audits["server-response-time"]?.numericValue ?? 0,
      inpMs: audits["interaction-to-next-paint"]?.numericValue ?? null,
    };
  } catch { return null; }
}
