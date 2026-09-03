import { z } from "zod";
import type { FunnelResult, PageSpeed, ScrapedPage } from "../schema";
import { geminiJson } from "../services/gemini";
import { fetchCwv } from "../services/psi";
import type { DiagnooEnv } from "../services/firecrawl";

const PIXEL_PATTERNS: Record<string, RegExp> = {
  gtag: /gtag\/js|googletagmanager\.com/i,
  meta_pixel: /connect\.facebook\.net|fbq\(/i,
  session_analytics: /static\.hotjar|clarity\.ms/i,
};

const FrictionSchema = z.object({ checkoutFrictionPoints: z.array(z.string()) });

export async function analyzeFunnel(
  env: DiagnooEnv, pages: ScrapedPage[], locale: "tr" | "en",
): Promise<FunnelResult> {
  // CWV: anasayfa + ürün sayfaları (en fazla 3 PSI çağrısı — kota koruması).
  const speedTargets = pages.filter((p) => p.pageType === "homepage" || p.pageType === "product").slice(0, 3);
  const pageSpeeds: PageSpeed[] = [];
  for (const p of speedTargets) {
    const cwv = await fetchCwv(env, p.url);
    if (cwv) pageSpeeds.push({ url: p.url, ...cwv });
  }
  const avgLcpMs = pageSpeeds.length > 0
    ? Math.round(pageSpeeds.reduce((s, p) => s + p.lcpMs, 0) / pageSpeeds.length)
    : 0;

  // Pixel tespiti: rawHtml'i olan tüm sayfalarda ara.
  const html = pages.map((p) => p.rawHtml ?? "").join("\n");
  const pixelCoverage = Object.fromEntries(
    Object.entries(PIXEL_PATTERNS).map(([k, re]) => [k, re.test(html)]),
  );
  const missingTrackingEvents = Object.entries(pixelCoverage)
    .filter(([, present]) => !present).map(([k]) => k);

  // Checkout sürtünmesi: checkout sayfası varsa LLM değerlendirir.
  const checkout = pages.find((p) => p.pageType === "checkout");
  let checkoutFrictionPoints: string[] = [];
  if (checkout) {
    // Bulgular rapora doğrudan basılıyor: dil semantic/vision ajanlarıyla aynı
    // sözleşmeden gelmeli, yoksa EN raporda Türkçe cümleler görünür.
    const lang = locale === "tr" ? "Türkçe" : "İngilizce";
    const out = await geminiJson(env, {
      system: `E-ticaret checkout akışı denetçisisin. Bulguları ${lang} yaz. YALNIZCA JSON döndür.`,
      user: `Checkout sayfası içeriği:\n${checkout.bodyText.slice(0, 4000)}\n\nŞema: {"checkoutFrictionPoints": ["somut sürtünme noktaları: zorunlu üyelik, gizli kargo ücreti, fazla form alanı vb."]}`,
      schema: FrictionSchema,
    });
    checkoutFrictionPoints = out.checkoutFrictionPoints;
  }

  return { pageSpeeds, avgLcpMs, checkoutFrictionPoints, pixelCoverage, missingTrackingEvents };
}
