import { NextResponse } from "next/server";
import { reportError } from "@/lib/observability/report";
import { metaCapiSchema } from "@/lib/schemas/meta-capi";
import { sendCapiEvent } from "@/lib/analytics/meta-capi";
import { requestMatchSignals } from "@/lib/analytics/meta-lead";

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
 * RIZA KAPISI SUNUCUDA DA VAR — AMA KİMLİK DOĞRULAMASI DEĞİL
 * ----------------------------------------------------------
 * İstemci zaten yalnız pazarlama rızası varsa çağırıyor, ama uç nokta
 * herkese açık. Çerez burada tekrar okunur: rıza yoksa olay Meta'ya hiç
 * gitmez ve 204 dönülür — istemciye "gönderilmedi" demenin bir karşılığı
 * yok, ölçüm sinyali sessizce düşmeli.
 *
 * Çerezi ziyaretçi kendisi yazabildiği için bu kapı bir RIZA KAYDI, kimlik
 * doğrulaması değil. Dolayısıyla gövdeden geçen her şey doğrudan Meta veri
 * kaynağına yazılabilecek şeydir; korumanın tamamı şemanın kapalılığında
 * durur (`lib/schemas/meta-capi.ts`). Şema kişisel veri hiç kabul etmiyor.
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
      /*
       * E-posta/telefon/ad BİLEREK yok: şema onları kabul etmiyor (gerekçe
       * `lib/schemas/meta-capi.ts`) ve bu uç nokta ViewContent taşıyor —
       * anonim yüzeyler, kimlik verisi zaten mevcut değil.
       *
       * Sinyallerin tamamı isteğin KENDİ başlıklarından ve çerezlerinden
       * okunuyor, gövdeden değil: IP, User-Agent, `_fbp`, `_fbc` (yoksa
       * `fbclid`den kurulan) ve `external_id` (kalıcı ziyaretçi kimliği).
       * `external_id` anonim ViewContent'te gönderilebilen tek eşleştirme
       * anahtarı — Meta'nın eşleştirme kalitesi tavsiyesinin bu yüzeyde
       * karşılığı olan tek maddesi (ADR-036).
       */
      userData: requestMatchSignals(req),
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
