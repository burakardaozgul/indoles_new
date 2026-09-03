/**
 * GA4 doğrulama script'i — Data API üzerinden Diagnoo/GEO araç olaylarının
 * son 7 gündeki (veya `--realtime` ile şu anki) sayımını okur. Kurulumun
 * (`pnpm ga4:setup`) gerçekten veri ürettiğini doğrulamak için — özellikle
 * `slug` filtresinin GEO ile Diagnoo'yu karıştırmadığını görmek (bkz.
 * docs/runbooks/diagnoo-ga4-kurulum.md "Arka plan" bölümü).
 *
 *   pnpm ga4:verify              # son 7 gün, olay × slug tablosu
 *   pnpm ga4:verify --realtime   # gerçek zamanlı, yalnız olay bazında
 *
 * Yalnız okur — `analytics.readonly` kapsamı yeter; `ga4:setup`'ın ürettiği
 * refresh token `analytics.edit`'i de taşıdığı için aynı token çalışır.
 */
import { getAccessToken, runToolEventsRealtimeReport, runToolEventsReport } from "../src/lib/analytics/ga4-admin";

const REALTIME = process.argv.slice(2).includes("--realtime");

/**
 * `<const K>`: dönüş tipi çağrılan diziye göre daralır (`{ GA4_PROPERTY_ID: string }`
 * gibi), `Record<string, string>` değil — `noUncheckedIndexedAccess` altında
 * index imzalı bir tipten destructuring her alanı `string | undefined` yapardı.
 */
function requireEnv<const K extends readonly string[]>(names: K): { [P in K[number]]: string } {
  const missing = names.filter((n) => !process.env[n]);
  if (missing.length > 0) {
    console.error(`Eksik ortam değişkeni: ${missing.join(", ")}`);
    console.error("Değerleri .env.local dosyasına ekleyip tekrar çalıştır (bkz. docs/runbooks/diagnoo-ga4-kurulum.md).");
    process.exit(1);
  }
  const out = {} as { [P in K[number]]: string };
  for (const n of names) (out as Record<string, string>)[n] = process.env[n]!;
  return out;
}

async function main(): Promise<void> {
  const { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_ANALYTICS_REFRESH_TOKEN, GA4_PROPERTY_ID } =
    requireEnv([
      "GOOGLE_OAUTH_CLIENT_ID",
      "GOOGLE_OAUTH_CLIENT_SECRET",
      "GOOGLE_ANALYTICS_REFRESH_TOKEN",
      "GA4_PROPERTY_ID",
    ]);

  const accessToken = await getAccessToken({
    clientId: GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
    refreshToken: GOOGLE_ANALYTICS_REFRESH_TOKEN,
  });
  const ctx = { propertyId: GA4_PROPERTY_ID, accessToken, fetch };

  if (REALTIME) {
    const rows = await runToolEventsRealtimeReport(ctx);
    console.log(`Gerçek zamanlı — property ${GA4_PROPERTY_ID}\n`);
    if (rows.length === 0) {
      console.log("Şu an aktif oturumda araç olayı yok.");
      return;
    }
    console.log("Olay".padEnd(32) + "Sayım");
    console.log("-".repeat(40));
    for (const r of rows) console.log(r.eventName.padEnd(32) + String(r.eventCount));
    return;
  }

  const rows = await runToolEventsReport(ctx);
  console.log(`Son 7 gün — property ${GA4_PROPERTY_ID}\n`);
  if (rows.length === 0) {
    console.log("Bu aralıkta araç olayı yok — kurulum yeni yapıldıysa veri henüz işlenmemiş olabilir (24-48 saat).");
    return;
  }
  console.log("Olay".padEnd(32) + "Slug".padEnd(28) + "Sayım");
  console.log("-".repeat(64));
  for (const r of rows) {
    console.log(r.eventName.padEnd(32) + r.slug.padEnd(28) + String(r.eventCount));
  }
}

main().catch((err) => {
  console.error(`[ga4:verify] ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
