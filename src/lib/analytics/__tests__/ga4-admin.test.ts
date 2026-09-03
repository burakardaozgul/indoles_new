import { describe, expect, it, vi } from "vitest";
import {
  DIAGNOO_CUSTOM_DIMENSIONS,
  DIAGNOO_EVENT_CREATE_RULE_BASE,
  DIAGNOO_KEY_EVENT,
  DIAGNOO_SLUG,
  TOOL_EVENT_NAMES,
  buildAuthUrl,
  ensureCustomDimension,
  ensureEventCreateRule,
  ensureKeyEvent,
  exchangeAuthCode,
  getAccessToken,
  listProperties,
  planSetup,
  resolveWebStreamId,
  runToolEventsRealtimeReport,
  runToolEventsReport,
  type GA4Ctx,
} from "../ga4-admin";
import { EVENT_NAMES } from "../events";

const CREDS = { clientId: "cid", clientSecret: "csec", refreshToken: "rtok" };

function jsonResponse(body: unknown, ok = true, status = ok ? 200 : 400): Response {
  return {
    ok,
    status,
    statusText: ok ? "OK" : "Bad Request",
    json: async () => body,
  } as unknown as Response;
}

/** Sıradaki her çağrıda listeden bir yanıt döner — GET/POST sırasını izlemek için. */
function sequenceFetch(responses: Response[]): ReturnType<typeof vi.fn> {
  let i = 0;
  return vi.fn(async () => {
    const res = responses[i];
    i++;
    if (!res) throw new Error(`beklenmeyen ${i}. fetch çağrısı — mock'ta yanıt kalmadı`);
    return res;
  });
}

function baseCtx(fetchImpl: GA4Ctx["fetch"]): GA4Ctx {
  return { propertyId: "123456", accessToken: "ya29.test", fetch: fetchImpl };
}

describe("getAccessToken", () => {
  it("refresh_token gövdesiyle token uç noktasına POST atar", async () => {
    const f = sequenceFetch([jsonResponse({ access_token: "ya29.abc" })]);
    const token = await getAccessToken(CREDS, f as unknown as typeof fetch);
    expect(token).toBe("ya29.abc");

    const [url, init] = f.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://oauth2.googleapis.com/token");
    expect(init.method).toBe("POST");
    const body = new URLSearchParams(String(init.body));
    expect(body.get("client_id")).toBe("cid");
    expect(body.get("client_secret")).toBe("csec");
    expect(body.get("refresh_token")).toBe("rtok");
    expect(body.get("grant_type")).toBe("refresh_token");
  });

  it("access_token yoksa hata fırlatır, gövdeyi sızdırmaz", async () => {
    const f = sequenceFetch([jsonResponse({ error: "invalid_grant" }, false, 400)]);
    await expect(getAccessToken(CREDS, f as unknown as typeof fetch)).rejects.toThrow("invalid_grant");
  });
});

describe("buildAuthUrl", () => {
  it("consent URL'i doğru scope ve parametrelerle üretir", () => {
    const url = buildAuthUrl("my-client-id");
    const parsed = new URL(url);
    expect(parsed.origin + parsed.pathname).toBe("https://accounts.google.com/o/oauth2/v2/auth");
    expect(parsed.searchParams.get("client_id")).toBe("my-client-id");
    expect(parsed.searchParams.get("redirect_uri")).toBe("http://localhost");
    expect(parsed.searchParams.get("response_type")).toBe("code");
    expect(parsed.searchParams.get("access_type")).toBe("offline");
    expect(parsed.searchParams.get("prompt")).toBe("consent");
    expect(parsed.searchParams.get("scope")).toBe(
      "https://www.googleapis.com/auth/analytics.edit https://www.googleapis.com/auth/analytics.readonly",
    );
  });
});

describe("exchangeAuthCode", () => {
  it("authorization_code gövdesiyle POST atar ve yalnız refresh token döner", async () => {
    const f = sequenceFetch([
      jsonResponse({ access_token: "ya29.short-lived", refresh_token: "1//refresh-abc" }),
    ]);
    const result = await exchangeAuthCode(
      { clientId: "cid", clientSecret: "csec", code: "4/0Acode" },
      f as unknown as typeof fetch,
    );
    expect(result).toEqual({ refreshToken: "1//refresh-abc" });

    const [url, init] = f.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://oauth2.googleapis.com/token");
    const body = new URLSearchParams(String(init.body));
    expect(body.get("grant_type")).toBe("authorization_code");
    expect(body.get("redirect_uri")).toBe("http://localhost");
    expect(body.get("code")).toBe("4/0Acode");
    expect(body.get("client_secret")).toBe("csec");
  });

  it("refresh_token yoksa hata fırlatır", async () => {
    const f = sequenceFetch([jsonResponse({ error: "invalid_grant" }, false, 400)]);
    await expect(
      exchangeAuthCode({ clientId: "cid", clientSecret: "csec", code: "bad" }, f as unknown as typeof fetch),
    ).rejects.toThrow("invalid_grant");
  });
});

describe("ensureCustomDimension", () => {
  const input = { parameterName: "slug", displayName: "Araç slug'ı", scope: "EVENT" as const };

  it("zaten varsa POST atmaz", async () => {
    const f = sequenceFetch([
      jsonResponse({
        customDimensions: [
          { name: "properties/123456/customDimensions/1", parameterName: "slug", displayName: "x", scope: "EVENT" },
        ],
      }),
    ]);
    const result = await ensureCustomDimension(baseCtx(f as unknown as typeof fetch), input);
    expect(result).toEqual({ created: false, name: "properties/123456/customDimensions/1" });
    expect(f).toHaveBeenCalledTimes(1);
    const [, listInit] = f.mock.calls[0] as [string, RequestInit | undefined];
    expect(listInit?.method ?? "GET").not.toBe("POST");
  });

  it("yoksa tam olarak beklenen gövdeyle POST atar", async () => {
    const f = sequenceFetch([
      jsonResponse({ customDimensions: [] }),
      jsonResponse({ name: "properties/123456/customDimensions/9", parameterName: "slug", displayName: "Araç slug'ı", scope: "EVENT" }),
    ]);
    const result = await ensureCustomDimension(baseCtx(f as unknown as typeof fetch), input);
    expect(result).toEqual({ created: true, name: "properties/123456/customDimensions/9" });

    const [url, init] = f.mock.calls[1] as [string, RequestInit];
    expect(url).toBe("https://analyticsadmin.googleapis.com/v1beta/properties/123456/customDimensions");
    expect(init.method).toBe("POST");
    expect(JSON.parse(String(init.body))).toEqual({
      parameterName: "slug",
      displayName: "Araç slug'ı",
      scope: "EVENT",
    });
  });

  it("Google 4xx dönerse status + error.message ile fırlatır", async () => {
    const f = sequenceFetch([
      jsonResponse({ customDimensions: [] }),
      jsonResponse({ error: { message: "Maximum number of custom dimensions reached" } }, false, 429),
    ]);
    await expect(ensureCustomDimension(baseCtx(f as unknown as typeof fetch), input)).rejects.toThrow(
      /429.*Maximum number of custom dimensions reached/,
    );
  });

  it("F7 final review: ikinci sayfadaki kaydı bulur, POST atmaz", async () => {
    // GA4 varsayılan sayfa boyutu 50 — olay kapsamlı özel boyutlar dolu bir
    // mülkte 50'de sınırlı olabilir, var olan kaynak ikinci sayfada kalırsa
    // `nextPageToken` yok sayan bir liste onu hiç görmez ve idempotent koşu
    // başarısız bir `create`e döner.
    const f = sequenceFetch([
      jsonResponse({
        customDimensions: [
          { name: "properties/123456/customDimensions/1", parameterName: "band", displayName: "x", scope: "EVENT" },
        ],
        nextPageToken: "page-2",
      }),
      jsonResponse({
        customDimensions: [
          { name: "properties/123456/customDimensions/2", parameterName: "slug", displayName: "y", scope: "EVENT" },
        ],
      }),
    ]);
    const result = await ensureCustomDimension(baseCtx(f as unknown as typeof fetch), input);
    expect(result).toEqual({ created: false, name: "properties/123456/customDimensions/2" });
    expect(f).toHaveBeenCalledTimes(2);

    const [firstUrl] = f.mock.calls[0] as [string];
    const [secondUrl] = f.mock.calls[1] as [string];
    expect(firstUrl).toBe(
      "https://analyticsadmin.googleapis.com/v1beta/properties/123456/customDimensions?pageSize=200",
    );
    expect(secondUrl).toBe(
      "https://analyticsadmin.googleapis.com/v1beta/properties/123456/customDimensions?pageSize=200&pageToken=page-2",
    );
    for (const [, init] of f.mock.calls as [string, RequestInit | undefined][]) {
      expect(init?.method ?? "GET").not.toBe("POST");
    }
  });
});

describe("ensureEventCreateRule", () => {
  const input = {
    streamId: "999",
    destinationEvent: "diagnoo_report_requested",
    sourceEvent: "tool_report_requested",
    conditions: [{ field: "slug", comparisonType: "EQUALS" as const, value: "diagnoo" }],
  };

  it("zaten varsa POST atmaz", async () => {
    const f = sequenceFetch([
      jsonResponse({
        eventCreateRules: [
          { name: "properties/123456/dataStreams/999/eventCreateRules/1", destinationEvent: "diagnoo_report_requested" },
        ],
      }),
    ]);
    const result = await ensureEventCreateRule(baseCtx(f as unknown as typeof fetch), input);
    expect(result.created).toBe(false);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it("yoksa v1alpha uç noktasına event_name + slug koşuluyla POST atar", async () => {
    const f = sequenceFetch([
      jsonResponse({ eventCreateRules: [] }),
      jsonResponse({ name: "properties/123456/dataStreams/999/eventCreateRules/2", destinationEvent: "diagnoo_report_requested" }),
    ]);
    const result = await ensureEventCreateRule(baseCtx(f as unknown as typeof fetch), input);
    expect(result.created).toBe(true);

    const [listUrl] = f.mock.calls[0] as [string];
    expect(listUrl).toBe(
      "https://analyticsadmin.googleapis.com/v1alpha/properties/123456/dataStreams/999/eventCreateRules?pageSize=200",
    );

    const [createUrl, init] = f.mock.calls[1] as [string, RequestInit];
    expect(createUrl).toBe(
      "https://analyticsadmin.googleapis.com/v1alpha/properties/123456/dataStreams/999/eventCreateRules",
    );
    expect(JSON.parse(String(init.body))).toEqual({
      destinationEvent: "diagnoo_report_requested",
      eventConditions: [
        { field: "event_name", comparisonType: "EQUALS", value: "tool_report_requested" },
        { field: "slug", comparisonType: "EQUALS", value: "diagnoo" },
      ],
      sourceCopyParameters: true,
    });
  });

  it("F7 final review: ikinci sayfadaki kuralı bulur, POST atmaz", async () => {
    const f = sequenceFetch([
      jsonResponse({
        eventCreateRules: [
          { name: "properties/123456/dataStreams/999/eventCreateRules/1", destinationEvent: "geo_report_requested" },
        ],
        nextPageToken: "page-2",
      }),
      jsonResponse({
        eventCreateRules: [
          { name: "properties/123456/dataStreams/999/eventCreateRules/2", destinationEvent: "diagnoo_report_requested" },
        ],
      }),
    ]);
    const result = await ensureEventCreateRule(baseCtx(f as unknown as typeof fetch), input);
    expect(result).toEqual({ created: false, name: "properties/123456/dataStreams/999/eventCreateRules/2" });
    expect(f).toHaveBeenCalledTimes(2);
    for (const [, init] of f.mock.calls as [string, RequestInit | undefined][]) {
      expect(init?.method ?? "GET").not.toBe("POST");
    }
  });
});

describe("ensureKeyEvent", () => {
  const input = { eventName: "diagnoo_report_requested", countingMethod: "ONCE_PER_EVENT" as const };

  it("zaten varsa POST atmaz", async () => {
    const f = sequenceFetch([
      jsonResponse({ keyEvents: [{ name: "properties/123456/keyEvents/1", eventName: "diagnoo_report_requested" }] }),
    ]);
    const result = await ensureKeyEvent(baseCtx(f as unknown as typeof fetch), input);
    expect(result.created).toBe(false);
    expect(f).toHaveBeenCalledTimes(1);
  });

  it("yoksa eventName + countingMethod gövdesiyle POST atar", async () => {
    const f = sequenceFetch([
      jsonResponse({ keyEvents: [] }),
      jsonResponse({ name: "properties/123456/keyEvents/2", eventName: "diagnoo_report_requested" }),
    ]);
    const result = await ensureKeyEvent(baseCtx(f as unknown as typeof fetch), input);
    expect(result.created).toBe(true);

    const [url, init] = f.mock.calls[1] as [string, RequestInit];
    expect(url).toBe("https://analyticsadmin.googleapis.com/v1beta/properties/123456/keyEvents");
    expect(JSON.parse(String(init.body))).toEqual({
      eventName: "diagnoo_report_requested",
      countingMethod: "ONCE_PER_EVENT",
    });
  });

  it("F7 final review: ikinci sayfadaki önemli etkinliği bulur, POST atmaz", async () => {
    const f = sequenceFetch([
      jsonResponse({
        keyEvents: [{ name: "properties/123456/keyEvents/1", eventName: "geo_report_requested" }],
        nextPageToken: "page-2",
      }),
      jsonResponse({
        keyEvents: [{ name: "properties/123456/keyEvents/2", eventName: "diagnoo_report_requested" }],
      }),
    ]);
    const result = await ensureKeyEvent(baseCtx(f as unknown as typeof fetch), input);
    expect(result).toEqual({ created: false, name: "properties/123456/keyEvents/2" });
    expect(f).toHaveBeenCalledTimes(2);
    for (const [, init] of f.mock.calls as [string, RequestInit | undefined][]) {
      expect(init?.method ?? "GET").not.toBe("POST");
    }
  });
});

describe("resolveWebStreamId", () => {
  it("tek web akışı varsa kimliğini döner", async () => {
    const f = sequenceFetch([
      jsonResponse({
        dataStreams: [
          { name: "properties/123456/dataStreams/777", type: "WEB_DATA_STREAM" },
          { name: "properties/123456/dataStreams/888", type: "IOS_APP_DATA_STREAM" },
        ],
      }),
    ]);
    const id = await resolveWebStreamId(baseCtx(f as unknown as typeof fetch));
    expect(id).toBe("777");
  });

  it("web akışı yoksa hata fırlatır", async () => {
    const f = sequenceFetch([jsonResponse({ dataStreams: [] })]);
    await expect(resolveWebStreamId(baseCtx(f as unknown as typeof fetch))).rejects.toThrow(/web veri akışı yok/);
  });

  it("birden fazla web akışı varsa belirsizliği hataya çevirir", async () => {
    const f = sequenceFetch([
      jsonResponse({
        dataStreams: [
          { name: "properties/123456/dataStreams/777", type: "WEB_DATA_STREAM" },
          { name: "properties/123456/dataStreams/778", type: "WEB_DATA_STREAM" },
        ],
      }),
    ]);
    await expect(resolveWebStreamId(baseCtx(f as unknown as typeof fetch))).rejects.toThrow(
      /birden fazla web veri akışı/,
    );
  });
});

describe("listProperties", () => {
  it("accountSummaries yanıtını düz property listesine çevirir", async () => {
    const f = sequenceFetch([
      jsonResponse({
        accountSummaries: [
          {
            account: "accounts/1",
            displayName: "INDOLES",
            propertySummaries: [{ property: "properties/123456", displayName: "indoles-web" }],
          },
        ],
      }),
    ]);
    const properties = await listProperties({ accessToken: "tok", fetch: f as unknown as typeof fetch });
    expect(properties).toEqual([{ propertyId: "123456", displayName: "indoles-web", account: "INDOLES" }]);
  });
});

describe("planSetup — dry-run", () => {
  it("hiçbir POST atmadan mevcut/eksik durumunu raporlar", async () => {
    const f = sequenceFetch([
      // customDimensions.list: slug var, band/category/target_service yok
      jsonResponse({
        customDimensions: [{ name: "properties/123456/customDimensions/1", parameterName: "slug", displayName: "x", scope: "EVENT" }],
      }),
      // eventCreateRules.list: boş
      jsonResponse({ eventCreateRules: [] }),
      // keyEvents.list: zaten var
      jsonResponse({ keyEvents: [{ name: "properties/123456/keyEvents/1", eventName: "diagnoo_report_requested" }] }),
    ]);

    const ops = await planSetup(baseCtx(f as unknown as typeof fetch), {
      streamId: "999",
      customDimensions: DIAGNOO_CUSTOM_DIMENSIONS,
      eventCreateRule: { ...DIAGNOO_EVENT_CREATE_RULE_BASE, streamId: "999" },
      keyEvent: DIAGNOO_KEY_EVENT,
    });

    expect(ops).toEqual([
      { resource: "customDimension", key: "slug", action: "skip" },
      { resource: "customDimension", key: "band", action: "create" },
      { resource: "customDimension", key: "category", action: "create" },
      { resource: "customDimension", key: "target_service", action: "create" },
      { resource: "eventCreateRule", key: "diagnoo_report_requested", action: "create" },
      { resource: "keyEvent", key: "diagnoo_report_requested", action: "skip" },
    ]);

    // Yalnızca GET (list) çağrıları — hiçbir çağrı POST değil.
    for (const [, init] of f.mock.calls as [string, RequestInit | undefined][]) {
      expect(init?.method ?? "GET").not.toBe("POST");
    }
    expect(f).toHaveBeenCalledTimes(3);
  });
});

describe("runToolEventsReport", () => {
  it("son 7 gün için eventName + customEvent:slug boyutlarıyla runReport çağırır", async () => {
    const f = sequenceFetch([
      jsonResponse({
        rows: [
          {
            dimensionValues: [{ value: "tool_used" }, { value: "diagnoo" }],
            metricValues: [{ value: "42" }],
          },
        ],
      }),
    ]);
    const rows = await runToolEventsReport({ propertyId: "123456", accessToken: "tok", fetch: f as unknown as typeof fetch });
    expect(rows).toEqual([{ eventName: "tool_used", slug: "diagnoo", eventCount: 42 }]);

    const [url, init] = f.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://analyticsdata.googleapis.com/v1beta/properties/123456:runReport");
    const body = JSON.parse(String(init.body));
    expect(body.dateRanges).toEqual([{ startDate: "7daysAgo", endDate: "today" }]);
    expect(body.dimensions).toEqual([{ name: "eventName" }, { name: "customEvent:slug" }]);
    expect(body.metrics).toEqual([{ name: "eventCount" }]);
    expect(body.dimensionFilter.filter.inListFilter.values).toContain("tool_report_requested");
  });
});

describe("runToolEventsRealtimeReport", () => {
  it("runRealtimeReport'u eventName boyutuyla çağırır", async () => {
    const f = sequenceFetch([
      jsonResponse({ rows: [{ dimensionValues: [{ value: "tool_used" }], metricValues: [{ value: "3" }] }] }),
    ]);
    const rows = await runToolEventsRealtimeReport({ propertyId: "123456", accessToken: "tok", fetch: f as unknown as typeof fetch });
    expect(rows).toEqual([{ eventName: "tool_used", eventCount: 3 }]);

    const [url] = f.mock.calls[0] as [string];
    expect(url).toBe("https://analyticsdata.googleapis.com/v1beta/properties/123456:runRealtimeReport");
  });
});

describe("TOOL_EVENT_NAMES / DIAGNOO_SLUG — taksonomi tek kaynak (F8 final review)", () => {
  it("TOOL_EVENT_NAMES tam olarak beş tool_ olayını içerir, hiçbiri events.ts dışından gelmez", () => {
    // Elle kopyalanmış liste sessizce kayabiliyordu (`events.ts`e yeni bir
    // `tool_*` olayı eklenip burası unutulursa `ga4:verify` "veri yok" gibi
    // görünen boş bir tabloya düşerdi). Türetme bu kaymayı derleme zamanına
    // taşımaz ama en azından testte yakalanır hale getirir.
    expect(TOOL_EVENT_NAMES).toHaveLength(5);
    for (const name of TOOL_EVENT_NAMES) {
      expect(EVENT_NAMES).toContain(name);
      expect(name.startsWith("tool_")).toBe(true);
    }
    // Ters yön: events.ts'teki HER tool_ öneki TOOL_EVENT_NAMES'te de olmalı
    // — liste dar kalıp yeni bir araç olayını sessizce dışarıda bırakmasın.
    const toolPrefixed = EVENT_NAMES.filter((n) => n.startsWith("tool_"));
    expect([...TOOL_EVENT_NAMES].sort()).toEqual([...toolPrefixed].sort());
  });

  it("DIAGNOO_SLUG signals.ts'teki tek kaynaktan gelir", () => {
    expect(DIAGNOO_SLUG).toBe("diagnoo");
  });
});
