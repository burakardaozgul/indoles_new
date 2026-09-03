import type { DiagnooEnv } from "./firecrawl";

export async function fetchCwv(
  env: DiagnooEnv, url: string,
): Promise<{ lcpMs: number; cls: number; ttfbMs: number; inpMs: number | null } | null> {
  const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=MOBILE`;
  const headers = env.PSI_API_KEY ? { "x-goog-api-key": env.PSI_API_KEY } : undefined;
  try {
    const res = await fetch(api, headers ? { headers } : {});
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
