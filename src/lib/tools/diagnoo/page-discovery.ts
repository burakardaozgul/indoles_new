import { z } from "zod";
import { scrapePage, type DiagnooEnv, type FirecrawlPage } from "./services/firecrawl";
import { geminiJson } from "./services/gemini";
import type { PageType, ScrapedPage } from "./schema";

const ClassificationSchema = z.object({
  category: z.array(z.string().url()).max(2),
  product: z.array(z.string().url()).max(3),
  checkout: z.string().url().nullable(),
});

type Classification = z.infer<typeof ClassificationSchema>;

function filterSameOrigin(rootUrl: string, classification: Classification): Classification {
  // Gemini çıktısı güvenilmez; kod seviyesinde aynı domain kontrolü (sosyal, ödeme, CDN
  // gibi üçüncü taraf URL'leri Firecrawl bütçesini boşaltmaz).
  const rootHost = (() => {
    try {
      return new URL(rootUrl).hostname;
    } catch {
      return "";
    }
  })();

  const normalizeUrl = (u: string): string => {
    try {
      const url = new URL(u);
      return url.toString().replace(/\/$/, ""); // Trailing slash kaldır
    } catch {
      return "";
    }
  };

  const normalizedRoot = normalizeUrl(rootUrl);
  const seen = new Set<string>();

  const filterUrls = (urls: string[]): string[] => {
    return urls
      .filter((u) => {
        try {
          const host = new URL(u).hostname;
          return host === rootHost;
        } catch {
          return false;
        }
      })
      .filter((u) => normalizeUrl(u) !== normalizedRoot)
      .filter((u) => {
        const normalized = normalizeUrl(u);
        if (seen.has(normalized)) return false;
        seen.add(normalized);
        return true;
      });
  };

  return {
    category: filterUrls(classification.category),
    product: filterUrls(classification.product),
    checkout: classification.checkout
      ? (() => {
          try {
            const host = new URL(classification.checkout).hostname;
            const normalized = normalizeUrl(classification.checkout);
            if (host !== rootHost || normalized === normalizedRoot || seen.has(normalized)) {
              return null;
            }
            seen.add(normalized);
            return classification.checkout;
          } catch {
            return null;
          }
        })()
      : null,
  };
}

function headings(markdown: string): string[] {
  return markdown.split("\n").filter((l) => /^#{1,3} /.test(l)).map((l) => l.replace(/^#+ /, "").trim()).slice(0, 20);
}

function toScraped(url: string, pageType: PageType, p: FirecrawlPage): ScrapedPage {
  return {
    url, pageType, title: p.title, metaDescription: p.description,
    h1: headings(p.markdown)[0] ?? "", headings: headings(p.markdown),
    bodyText: p.markdown.slice(0, 12000),
    ...(p.rawHtml ? { rawHtml: p.rawHtml.slice(0, 300_000) } : {}), // ücretsiz plan CPU bütçesi (regex taraması)
    ...(p.screenshotUrl ? { screenshotUrl: p.screenshotUrl } : {}),
  };
}

export async function discoverAndScrapePages(env: DiagnooEnv, rootUrl: string): Promise<ScrapedPage[]> {
  // Anasayfa: screenshot (vision) + rawHtml (pixel tespiti) ile. Hata yukarı fırlar.
  const home = await scrapePage(env, rootUrl, { screenshot: true, rawHtml: true });

  const classification = await geminiJson(env, {
    system: "Bir e-ticaret sitesinin link listesinden sayfa tiplerini seçen bir sınıflandırıcısın. YALNIZCA JSON döndür.",
    user: [
      `Site: ${rootUrl}`,
      `Linkler:\n${home.links.slice(0, 150).join("\n")}`,
      'Şu şemayla seç: {"category": [en fazla 2 kategori/koleksiyon URL], "product": [en fazla 3 ürün detay URL], "checkout": sepet/checkout URL veya null}. Yalnızca aynı domaindeki linkleri seç; farklı domaindeki linkleri dışarıda bırak.',
    ].join("\n\n"),
    schema: ClassificationSchema,
  });

  // Kod seviyesinde aynı domain kontrolü (Gemini çıktısı güvenilmez).
  const filtered = filterSameOrigin(rootUrl, classification);

  const targets: { url: string; pageType: PageType; screenshot: boolean; rawHtml: boolean }[] = [
    ...filtered.category.map((u) => ({ url: u, pageType: "category" as const, screenshot: false, rawHtml: false })),
    ...filtered.product.map((u) => ({ url: u, pageType: "product" as const, screenshot: true, rawHtml: false })),
    ...(filtered.checkout
      ? [{ url: filtered.checkout, pageType: "checkout" as const, screenshot: true, rawHtml: true }]
      : []),
  ];

  const pages: ScrapedPage[] = [toScraped(rootUrl, "homepage", home)];
  for (const t of targets) {
    try {
      const p = await scrapePage(env, t.url, { screenshot: t.screenshot, rawHtml: t.rawHtml });
      pages.push(toScraped(t.url, t.pageType, p));
    } catch {
      // Tek sayfa hatası pipeline'ı durdurmaz; kısmi külliyatla devam (spec §10).
    }
  }
  return pages;
}
