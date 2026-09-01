export type DiagnooEnv = { GEMINI_API_KEY: string; FIRECRAWL_API_KEY: string; PSI_API_KEY?: string };

export type FirecrawlPage = {
  markdown: string; rawHtml: string | null; links: string[];
  screenshotUrl: string | null; title: string; description: string;
};

function safeHost(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "<geçersiz-url>";
  }
}

export class ScrapeError extends Error {
  constructor(public url: string, public status: number) {
    super(`Firecrawl scrape failed (${status}): ${safeHost(url)}`);
  }
}

export async function scrapePage(
  env: DiagnooEnv, url: string, opts: { screenshot?: boolean; rawHtml?: boolean } = {},
): Promise<FirecrawlPage> {
  const formats = ["markdown", "links", ...(opts.screenshot ? ["screenshot"] : []), ...(opts.rawHtml ? ["rawHtml"] : [])];
  const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.FIRECRAWL_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ url, formats, timeout: 30000 }),
  });
  const body = (await res.json().catch(() => null)) as {
    success?: boolean;
    data?: { markdown?: string; rawHtml?: string; links?: string[]; screenshot?: string;
      metadata?: { title?: string; description?: string } };
  } | null;
  if (!res.ok || !body?.success || !body.data) throw new ScrapeError(url, res.status);
  return {
    markdown: body.data.markdown ?? "",
    rawHtml: body.data.rawHtml ?? null,
    links: body.data.links ?? [],
    screenshotUrl: body.data.screenshot ?? null,
    title: body.data.metadata?.title ?? "",
    description: body.data.metadata?.description ?? "",
  };
}
