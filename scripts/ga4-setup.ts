/**
 * GA4 kurulum script'i — Admin API üzerinden Diagnoo'ya özel özel boyutları,
 * event create rule'u ve key event'i idempotent şekilde kurar. Detaylı akış
 * ve manuel fallback: `docs/runbooks/diagnoo-ga4-kurulum.md`.
 *
 *   pnpm ga4:setup --auth-url            # consent URL'i üretir (tek seferlik)
 *   pnpm ga4:setup --exchange <code>     # kodu refresh token'a çevirir, EKRANA BASAR
 *   pnpm ga4:setup --list-properties     # erişilebilir property'leri listeler
 *   pnpm ga4:setup --dry-run             # yalnız planı yazar — hiçbir POST atmaz
 *   pnpm ga4:setup                       # planı uygular (idempotent)
 *
 * Sırlar hiçbir zaman konsola basılmaz — yalnız `--exchange` çıktısı olan
 * refresh token istisna, o da bilerek `.env.local`'e yapıştırılmak üzere
 * basılıyor (client secret ve access token asla).
 */
import {
  DIAGNOO_CUSTOM_DIMENSIONS,
  DIAGNOO_EVENT_CREATE_RULE_BASE,
  DIAGNOO_KEY_EVENT,
  buildAuthUrl,
  ensureCustomDimension,
  ensureEventCreateRule,
  ensureKeyEvent,
  exchangeAuthCode,
  getAccessToken,
  listProperties,
  planSetup,
  resolveWebStreamId,
  type GA4Ctx,
} from "../src/lib/analytics/ga4-admin";

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes("--dry-run");
const AUTH_URL = argv.includes("--auth-url");
const LIST_PROPERTIES = argv.includes("--list-properties");
const exchangeIndex = argv.indexOf("--exchange");
const EXCHANGE_CODE = exchangeIndex >= 0 ? argv[exchangeIndex + 1] : undefined;

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

function printOps(ops: { resource: string; key: string; action: "create" | "skip" }[]): void {
  for (const op of ops) {
    console.log(`  [${op.action === "create" ? "OLUŞTUR" : "ATLA   "}] ${op.resource}: ${op.key}`);
  }
}

async function main(): Promise<void> {
  if (AUTH_URL) {
    const { GOOGLE_OAUTH_CLIENT_ID } = requireEnv(["GOOGLE_OAUTH_CLIENT_ID"]);
    console.log("Bu bağlantıyı tarayıcıda aç, burak@indoles.com.tr ile giriş yap:\n");
    console.log(buildAuthUrl(GOOGLE_OAUTH_CLIENT_ID));
    console.log(
      "\nİzin verdikten sonra http://localhost/?code=... adresine yönlendirileceksin " +
        "(\"bağlanılamıyor\" hatası normal — orada sunucu yok). Adres çubuğundaki `code` " +
        "değerini kopyala (%2F → /) ve şununla devam et:\n\n  pnpm ga4:setup --exchange <code>",
    );
    return;
  }

  if (EXCHANGE_CODE) {
    const { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET } = requireEnv([
      "GOOGLE_OAUTH_CLIENT_ID",
      "GOOGLE_OAUTH_CLIENT_SECRET",
    ]);
    const { refreshToken } = await exchangeAuthCode({
      clientId: GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
      code: EXCHANGE_CODE,
    });
    console.log("Refresh token alındı. Aşağıdaki satırı .env.local dosyasına ekle:\n");
    console.log(`GOOGLE_ANALYTICS_REFRESH_TOKEN=${refreshToken}`);
    console.log("\nBu değer bir daha basılmayacak — şimdi kaydet.");
    return;
  }

  if (LIST_PROPERTIES) {
    const { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_ANALYTICS_REFRESH_TOKEN } = requireEnv([
      "GOOGLE_OAUTH_CLIENT_ID",
      "GOOGLE_OAUTH_CLIENT_SECRET",
      "GOOGLE_ANALYTICS_REFRESH_TOKEN",
    ]);
    const accessToken = await getAccessToken({
      clientId: GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: GOOGLE_OAUTH_CLIENT_SECRET,
      refreshToken: GOOGLE_ANALYTICS_REFRESH_TOKEN,
    });
    const properties = await listProperties({ accessToken, fetch });
    if (properties.length === 0) {
      console.log("Erişilebilir property yok.");
      return;
    }
    console.log("Hesap".padEnd(28) + "Property".padEnd(32) + "GA4_PROPERTY_ID");
    console.log("-".repeat(80));
    for (const p of properties) {
      console.log(p.account.padEnd(28) + p.displayName.padEnd(32) + p.propertyId);
    }
    return;
  }

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
  const ctx: GA4Ctx = { propertyId: GA4_PROPERTY_ID, accessToken, fetch };

  const streamId = process.env.GA4_STREAM_ID || (await resolveWebStreamId(ctx));
  const eventCreateRule = { ...DIAGNOO_EVENT_CREATE_RULE_BASE, streamId };

  if (DRY_RUN) {
    const ops = await planSetup(ctx, {
      streamId,
      customDimensions: DIAGNOO_CUSTOM_DIMENSIONS,
      eventCreateRule,
      keyEvent: DIAGNOO_KEY_EVENT,
    });
    console.log(`Plan — property ${GA4_PROPERTY_ID}, stream ${streamId} (hiçbir yazma yapılmadı):\n`);
    printOps(ops);
    return;
  }

  console.log(`GA4 kurulumu uygulanıyor — property ${GA4_PROPERTY_ID}, stream ${streamId}\n`);

  const ops: { resource: string; key: string; action: "create" | "skip" }[] = [];

  for (const dim of DIAGNOO_CUSTOM_DIMENSIONS) {
    const r = await ensureCustomDimension(ctx, dim);
    ops.push({ resource: "customDimension", key: dim.parameterName, action: r.created ? "create" : "skip" });
  }

  const ruleResult = await ensureEventCreateRule(ctx, eventCreateRule);
  ops.push({
    resource: "eventCreateRule",
    key: eventCreateRule.destinationEvent,
    action: ruleResult.created ? "create" : "skip",
  });

  const keyEventResult = await ensureKeyEvent(ctx, DIAGNOO_KEY_EVENT);
  ops.push({
    resource: "keyEvent",
    key: DIAGNOO_KEY_EVENT.eventName,
    action: keyEventResult.created ? "create" : "skip",
  });

  console.log("Özet (OLUŞTUR = az önce oluşturuldu, ATLA = zaten vardı):\n");
  printOps(ops);
  console.log(
    "\nSıradaki adım: docs/runbooks/diagnoo-ga4-kurulum.md Adım 4 (huni araştırması, yalnız GA4 " +
      "arayüzünden) ve Adım 5 (`pnpm ga4:verify`).",
  );
}

main().catch((err) => {
  console.error(`[ga4:setup] ${err instanceof Error ? err.message : err}`);
  process.exit(1);
});
