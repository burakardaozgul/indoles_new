import { NextResponse } from "next/server";
import { reportError } from "@/lib/observability/report";
import { metaCapiSchema } from "@/lib/schemas/meta-capi";
import { sendCapiEvent } from "@/lib/analytics/meta-capi";

// OpenNext edge runtime'ı ayrı bir fonksiyon olarak paketlemek istiyor ve
// bu projede öyle bir yapı yok (ADR-024); diğer route'lar gibi nodejs.
// `crypto.subtle` Workers'ın nodejs uyumluluk katmanında da mevcut.
export const runtime = "nodejs";

/**
 * Meta Conversions API köprüsü (ADR-033).
 *
 * Tarayıcı Pixel'i tek başına eksik ölçüyor (ITP, reklam engelleyiciler);
 * aynı olay buradan sunucu tarafında bir kez daha bildirilir. Meta iki
 * kaydı `event_id` ile birleştirir — `meta-capi.ts` başlığındaki not.
 *
 * RIZA KAPISI SUNUCUDA DA VAR
 * ---------------------------
 * İstemci zaten yalnız pazarlama rızası varsa çağırıyor, ama uç nokta
 * herkese açık. Çerez burada tekrar okunur: rıza yoksa olay Meta'ya hiç
 * gitmez ve 204 dönülür — istemciye "gönderilmedi" demenin bir karşılığı
 * yok, ölçüm sinyali sessizce düşmeli.
 */
export async function POST(req: Request): Promise<Response> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_TOKEN;
  if (!pixelId || !accessToken) {
    // Yapılandırma eksikse sessizce devre dışı — lokal ve önizlemede normal.
    return new Response(null, { status: 204 });
  }

  const consent = req.headers
    .get("cookie")
    ?.match(/(?:^|;\s*)indoles_consent=([gd]{2})/)?.[1];
  if (!consent || consent.charAt(1) !== "g") {
    return new Response(null, { status: 204 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = metaCapiSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }
  const data = parsed.data;

  const cookies = req.headers.get("cookie") ?? "";
  const ip = req.headers.get("cf-connecting-ip");
  const ua = req.headers.get("user-agent");
  const fbp = cookies.match(/(?:^|;\s*)_fbp=([^;]+)/)?.[1];
  const fbc = cookies.match(/(?:^|;\s*)_fbc=([^;]+)/)?.[1];
  const result = await sendCapiEvent(
    {
      pixelId,
      accessToken,
      // `exactOptionalPropertyTypes` altında `undefined` atanamıyor:
      // alan ya değeriyle var olur ya hiç olmaz.
      ...(process.env.META_CAPI_TEST_CODE
        ? { testEventCode: process.env.META_CAPI_TEST_CODE }
        : {}),
    },
    {
      eventName: data.eventName,
      eventId: data.eventId,
      ...(data.eventSourceUrl ? { eventSourceUrl: data.eventSourceUrl } : {}),
      ...(data.customData ? { customData: data.customData } : {}),
      userData: {
        ...(data.email ? { email: data.email } : {}),
        ...(data.phone ? { phone: data.phone } : {}),
        // Cloudflare gerçek ziyaretçi IP'sini bu başlıkta veriyor.
        ...(ip ? { clientIpAddress: ip } : {}),
        ...(ua ? { clientUserAgent: ua } : {}),
        ...(fbp ? { fbp } : {}),
        ...(fbc ? { fbc } : {}),
      },
    },
  );

  if (!result.ok) {
    // Ölçüm hatası ziyaretçinin akışını bozmamalı: loglanır, 204 dönülür.
    reportError(new Error(`meta_capi: ${result.error}`), {
      route: "api/meta/capi",
      step: "send",
    });
    return new Response(null, { status: 204 });
  }

  return NextResponse.json({ ok: true, received: result.received });
}
