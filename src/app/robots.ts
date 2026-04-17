import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.NEXT_PUBLIC_APP_STAGE === "production";
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://indoles.com.tr";

  if (!isProd) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/app/", "/admin/", "/studio/", "/api/", "/*?draft=true"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
