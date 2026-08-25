import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.NEXT_PUBLIC_APP_STAGE === "production";
  if (!isProd) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  /**
   * Aynı kısıt her kural için tekrar edilir: robots.txt'te en özgül
   * user-agent bloğu kazanır, yani adı geçen bot `*` bloğunu hiç okumaz.
   * Tekrar etmezsek adlandırdığımız crawler'lar daha geniş erişim alırdı.
   */
  const disallow = ["/app/", "/admin/", "/studio/", "/api/", "/*?draft=true"];

  /**
   * AI crawler'ları açıkça `Allow` ile listelenir. Erişim `*` altında zaten
   * açıktı; buradaki amaç niyeti okunur kılmak — docs/08 §5 "opak değil,
   * şeffaf" duruşu. GEO stratejisi (docs/strateji/) bu motorlarda
   * alıntılanmayı ana kaldıraç sayıyor, erişimi tesadüfe bırakmıyoruz.
   */
  const aiAgents = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
    "CCBot",
  ];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...aiAgents.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
