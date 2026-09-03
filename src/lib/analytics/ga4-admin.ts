/**
 * GA4 Admin API (v1beta) + Data API (v1beta) istemcisi — Diagnoo kurulum ve
 * doğrulama script'lerinin (`scripts/ga4-setup.ts`, `scripts/ga4-verify.ts`)
 * tek çağırdığı katman.
 *
 * Tasarım: her fonksiyon saf — `ctx = { propertyId, accessToken, fetch }`
 * enjekte edilir, hiçbiri `process.env` okumaz. Bu yüzden testler gerçek
 * ağa hiç dokunmadan sahte bir `fetch` verebiliyor (bkz. `__tests__/ga4-admin.test.ts`).
 * Env ayrıştırma, CLI bayrakları ve konsola yazma yalnız `scripts/*.ts`'te.
 *
 * `ensure*` fonksiyonlarının hepsi idempotent: önce `list` ile mevcudu ara,
 * varsa POST atmadan `{ created: false, name }` dön, yoksa oluştur. Bu, aynı
 * script'in yanlışlıkla iki kez çalıştırılmasını (veya CI'da tekrar
 * çalışmasını) güvenli kılıyor — GA4 aksi halde aynı özel boyutu iki kez
 * oluşturmaya çalışıp hata verirdi.
 *
 * Not (2026-09-03 doğrulaması, context7 üzerinden resmi REST referansı):
 * `customDimensions`, `keyEvents` ve `dataStreams` kaynakları v1beta'da var,
 * ama `eventCreateRules` yalnız v1alpha'da yayınlanıyor — v1beta karşılığı
 * yok. Görev brief'i tüm Admin API çağrılarını tek bir v1beta tabanına
 * bağlıyordu; bu tek kaynak için ayrı bir taban adres (`ADMIN_BASE_ALPHA`)
 * kullanılıyor, geri kalan her şey v1beta. Google ileride bunu v1beta'ya
 * taşırsa değişecek tek satır burası.
 */

export type FetchFn = typeof fetch;

/** Admin/Data API çağrılarının ortak bağlamı. Testte sahte `fetch` enjekte edilir. */
export type GA4Ctx = {
  propertyId: string;
  accessToken: string;
  fetch: FetchFn;
};

const ADMIN_BASE = "https://analyticsadmin.googleapis.com/v1beta";
const ADMIN_BASE_ALPHA = "https://analyticsadmin.googleapis.com/v1alpha";
const DATA_BASE = "https://analyticsdata.googleapis.com/v1beta";

const OAUTH_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const OAUTH_AUTHORIZE_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const OAUTH_REDIRECT_URI = "http://localhost";
const OAUTH_SCOPES = [
  "https://www.googleapis.com/auth/analytics.edit",
  "https://www.googleapis.com/auth/analytics.readonly",
].join(" ");

// ---------------------------------------------------------------------------
// Hata yardımcıları — Google'ın döndürdüğü `error.message` dışında hiçbir şey
// (özellikle secret/token) hata mesajına sızdırılmaz.

async function googleErrorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: { message?: string } };
    if (data.error?.message) return data.error.message;
  } catch {
    // Gövde JSON değilse aşağıda statusText'e düşülür.
  }
  return res.statusText || `HTTP ${res.status}`;
}

async function assertOk(res: Response, op: string): Promise<void> {
  if (res.ok) return;
  throw new Error(`${op}: HTTP ${res.status} — ${await googleErrorMessage(res)}`);
}

function authHeaders(accessToken: string): HeadersInit {
  return { authorization: `Bearer ${accessToken}` };
}

function jsonHeaders(accessToken: string): HeadersInit {
  return { authorization: `Bearer ${accessToken}`, "content-type": "application/json" };
}

// ---------------------------------------------------------------------------
// OAuth — mevcut rezervasyon sistemi istemcisi (`GOOGLE_OAUTH_CLIENT_ID`/
// `_CLIENT_SECRET`) yeniden kullanılır; yalnız refresh token GA4'e özgüdür
// (`GOOGLE_ANALYTICS_REFRESH_TOKEN`) çünkü scope farklı.

export type GoogleOAuthCreds = {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
};

/** Refresh token'dan kısa ömürlü access token üretir. Client secret asla loglanmaz. */
export async function getAccessToken(
  creds: GoogleOAuthCreds,
  fetchImpl: FetchFn = fetch,
): Promise<string> {
  const res = await fetchImpl(OAUTH_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      refresh_token: creds.refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const data = (await res.json()) as { access_token?: string; error?: string };
  if (!res.ok || !data.access_token) {
    throw new Error(`GA4 access token alınamadı: ${data.error ?? `HTTP ${res.status}`}`);
  }
  return data.access_token;
}

/**
 * Tek seferlik consent URL'i. `access_type=offline` + `prompt=consent`
 * olmadan Google refresh token vermez (bkz. google-calendar-oauth-kurulumu.md
 * Adım 6a — aynı ders burada da geçerli).
 */
export function buildAuthUrl(clientId: string): string {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: OAUTH_REDIRECT_URI,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: OAUTH_SCOPES,
  });
  return `${OAUTH_AUTHORIZE_ENDPOINT}?${params.toString()}`;
}

/** Yetkilendirme kodunu (adres çubuğundan kopyalanan `code`) refresh token'a çevirir. */
export async function exchangeAuthCode(
  creds: { clientId: string; clientSecret: string; code: string },
  fetchImpl: FetchFn = fetch,
): Promise<{ refreshToken: string }> {
  const res = await fetchImpl(OAUTH_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: creds.clientId,
      client_secret: creds.clientSecret,
      code: creds.code,
      redirect_uri: OAUTH_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });
  const data = (await res.json()) as {
    refresh_token?: string;
    error?: string;
    error_description?: string;
  };
  if (!res.ok || !data.refresh_token) {
    const detail = data.error_description ? ` — ${data.error_description}` : "";
    throw new Error(`Kod refresh token'a çevrilemedi: ${data.error ?? `HTTP ${res.status}`}${detail}`);
  }
  return { refreshToken: data.refresh_token };
}

// ---------------------------------------------------------------------------
// Admin API — özel boyutlar

export type CustomDimensionInput = {
  parameterName: string;
  displayName: string;
  scope: "EVENT";
};

export type EnsureResult = { created: boolean; name: string };

type CustomDimensionResource = {
  name: string;
  parameterName: string;
  displayName: string;
  scope: string;
};

async function listCustomDimensions(ctx: GA4Ctx): Promise<CustomDimensionResource[]> {
  const res = await ctx.fetch(`${ADMIN_BASE}/properties/${ctx.propertyId}/customDimensions`, {
    headers: authHeaders(ctx.accessToken),
  });
  await assertOk(res, "customDimensions.list");
  const data = (await res.json()) as { customDimensions?: CustomDimensionResource[] };
  return data.customDimensions ?? [];
}

/** Yoksa oluşturur, varsa dokunmaz — eşleşme `parameterName` üzerinden. */
export async function ensureCustomDimension(
  ctx: GA4Ctx,
  input: CustomDimensionInput,
): Promise<EnsureResult> {
  const existing = await listCustomDimensions(ctx);
  const found = existing.find((d) => d.parameterName === input.parameterName);
  if (found) return { created: false, name: found.name };

  const res = await ctx.fetch(`${ADMIN_BASE}/properties/${ctx.propertyId}/customDimensions`, {
    method: "POST",
    headers: jsonHeaders(ctx.accessToken),
    body: JSON.stringify({
      parameterName: input.parameterName,
      displayName: input.displayName,
      scope: input.scope,
    }),
  });
  await assertOk(res, "customDimensions.create");
  const data = (await res.json()) as CustomDimensionResource;
  return { created: true, name: data.name };
}

// ---------------------------------------------------------------------------
// Admin API — event create rule (v1alpha, bkz. dosya başı notu)

export type EventCondition = {
  field: string;
  comparisonType: "EQUALS";
  value: string;
};

export type EventCreateRuleInput = {
  streamId: string;
  destinationEvent: string;
  sourceEvent: string;
  /** `event_name = sourceEvent` koşulu otomatik eklenir — burada yalnız EK koşullar (örn. `slug`). */
  conditions: EventCondition[];
};

type EventCreateRuleResource = {
  name: string;
  destinationEvent: string;
  eventConditions: EventCondition[];
};

function eventCreateRulesUrl(propertyId: string, streamId: string): string {
  return `${ADMIN_BASE_ALPHA}/properties/${propertyId}/dataStreams/${streamId}/eventCreateRules`;
}

async function listEventCreateRules(
  ctx: GA4Ctx,
  streamId: string,
): Promise<EventCreateRuleResource[]> {
  const res = await ctx.fetch(eventCreateRulesUrl(ctx.propertyId, streamId), {
    headers: authHeaders(ctx.accessToken),
  });
  await assertOk(res, "eventCreateRules.list");
  const data = (await res.json()) as { eventCreateRules?: EventCreateRuleResource[] };
  return data.eventCreateRules ?? [];
}

/**
 * Yoksa oluşturur, varsa dokunmaz — eşleşme `destinationEvent` üzerinden.
 * Kaynak olayı belirten koşul (`event_name = sourceEvent`) `input.conditions`'a
 * eklenmez — çağıran yalnız ek filtreyi (`slug = diagnoo`) verir, bu fonksiyon
 * ikisini birleştirip gönderir. `sourceCopyParameters: true`: hedef olay
 * kaynağın tüm parametrelerini (`band`, `locale`) devralır.
 */
export async function ensureEventCreateRule(
  ctx: GA4Ctx,
  input: EventCreateRuleInput,
): Promise<EnsureResult> {
  const existing = await listEventCreateRules(ctx, input.streamId);
  const found = existing.find((r) => r.destinationEvent === input.destinationEvent);
  if (found) return { created: false, name: found.name };

  const eventConditions: EventCondition[] = [
    { field: "event_name", comparisonType: "EQUALS", value: input.sourceEvent },
    ...input.conditions,
  ];

  const res = await ctx.fetch(eventCreateRulesUrl(ctx.propertyId, input.streamId), {
    method: "POST",
    headers: jsonHeaders(ctx.accessToken),
    body: JSON.stringify({
      destinationEvent: input.destinationEvent,
      eventConditions,
      sourceCopyParameters: true,
    }),
  });
  await assertOk(res, "eventCreateRules.create");
  const data = (await res.json()) as EventCreateRuleResource;
  return { created: true, name: data.name };
}

// ---------------------------------------------------------------------------
// Admin API — key event (önemli etkinlik / conversion)

export type KeyEventInput = {
  eventName: string;
  countingMethod: "ONCE_PER_EVENT" | "ONCE_PER_SESSION";
};

type KeyEventResource = { name: string; eventName: string; countingMethod: string };

async function listKeyEvents(ctx: GA4Ctx): Promise<KeyEventResource[]> {
  const res = await ctx.fetch(`${ADMIN_BASE}/properties/${ctx.propertyId}/keyEvents`, {
    headers: authHeaders(ctx.accessToken),
  });
  await assertOk(res, "keyEvents.list");
  const data = (await res.json()) as { keyEvents?: KeyEventResource[] };
  return data.keyEvents ?? [];
}

/** Yoksa oluşturur, varsa dokunmaz — eşleşme `eventName` üzerinden. */
export async function ensureKeyEvent(ctx: GA4Ctx, input: KeyEventInput): Promise<EnsureResult> {
  const existing = await listKeyEvents(ctx);
  const found = existing.find((k) => k.eventName === input.eventName);
  if (found) return { created: false, name: found.name };

  const res = await ctx.fetch(`${ADMIN_BASE}/properties/${ctx.propertyId}/keyEvents`, {
    method: "POST",
    headers: jsonHeaders(ctx.accessToken),
    body: JSON.stringify({
      eventName: input.eventName,
      countingMethod: input.countingMethod,
    }),
  });
  await assertOk(res, "keyEvents.create");
  const data = (await res.json()) as KeyEventResource;
  return { created: true, name: data.name };
}

// ---------------------------------------------------------------------------
// Admin API — web veri akışı keşfi (GA4_STREAM_ID verilmemişse)

type DataStreamResource = { name: string; type: string; displayName?: string };

/**
 * `GA4_STREAM_ID` ortam değişkeni yoksa property altındaki TEK web akışını
 * bulur. Property'de birden fazla web akışı varsa (nadir ama olası) hangisinin
 * kastedildiği belirsizdir — sessizce ilkini seçmek yerine açık hata fırlatır.
 */
export async function resolveWebStreamId(ctx: GA4Ctx): Promise<string> {
  const res = await ctx.fetch(`${ADMIN_BASE}/properties/${ctx.propertyId}/dataStreams`, {
    headers: authHeaders(ctx.accessToken),
  });
  await assertOk(res, "dataStreams.list");
  const data = (await res.json()) as { dataStreams?: DataStreamResource[] };
  const webStreams = (data.dataStreams ?? []).filter((s) => s.type === "WEB_DATA_STREAM");

  if (webStreams.length === 0) {
    throw new Error(`properties/${ctx.propertyId} altında web veri akışı yok`);
  }
  if (webStreams.length > 1) {
    const names = webStreams.map((s) => s.name).join(", ");
    throw new Error(
      `properties/${ctx.propertyId} altında birden fazla web veri akışı var (${names}) — ` +
        "GA4_STREAM_ID ortam değişkeniyle birini seç",
    );
  }

  const id = webStreams[0]!.name.split("/").pop();
  if (!id) throw new Error(`web veri akışı kimliği ayrıştırılamadı: ${webStreams[0]!.name}`);
  return id;
}

// ---------------------------------------------------------------------------
// Admin API — erişilebilir property'leri listele (`--list-properties`)

type AccountSummaryResource = {
  account: string;
  displayName: string;
  propertySummaries?: { property: string; displayName: string }[];
};

export type PropertySummary = { propertyId: string; displayName: string; account: string };

export async function listProperties(ctx: {
  accessToken: string;
  fetch: FetchFn;
}): Promise<PropertySummary[]> {
  const res = await ctx.fetch(`${ADMIN_BASE}/accountSummaries?pageSize=200`, {
    headers: authHeaders(ctx.accessToken),
  });
  await assertOk(res, "accountSummaries.list");
  const data = (await res.json()) as { accountSummaries?: AccountSummaryResource[] };

  const out: PropertySummary[] = [];
  for (const acc of data.accountSummaries ?? []) {
    for (const p of acc.propertySummaries ?? []) {
      const propertyId = p.property.split("/").pop();
      if (!propertyId) continue;
      out.push({ propertyId, displayName: p.displayName, account: acc.displayName });
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Dry-run planı — `ensure*` ile AYNI list/eşleşme mantığını kullanır ama
// hiçbir zaman POST atmaz. `scripts/ga4-setup.ts --dry-run` bunu çağırır.

export type PlannedResource = "customDimension" | "eventCreateRule" | "keyEvent";
export type PlannedOperation = { resource: PlannedResource; key: string; action: "create" | "skip" };

export async function planSetup(
  ctx: GA4Ctx,
  input: {
    streamId: string;
    customDimensions: CustomDimensionInput[];
    eventCreateRule: EventCreateRuleInput;
    keyEvent: KeyEventInput;
  },
): Promise<PlannedOperation[]> {
  const ops: PlannedOperation[] = [];

  const existingDims = await listCustomDimensions(ctx);
  for (const dim of input.customDimensions) {
    const exists = existingDims.some((d) => d.parameterName === dim.parameterName);
    ops.push({ resource: "customDimension", key: dim.parameterName, action: exists ? "skip" : "create" });
  }

  const existingRules = await listEventCreateRules(ctx, input.streamId);
  const ruleExists = existingRules.some((r) => r.destinationEvent === input.eventCreateRule.destinationEvent);
  ops.push({
    resource: "eventCreateRule",
    key: input.eventCreateRule.destinationEvent,
    action: ruleExists ? "skip" : "create",
  });

  const existingKeyEvents = await listKeyEvents(ctx);
  const keyEventExists = existingKeyEvents.some((k) => k.eventName === input.keyEvent.eventName);
  ops.push({
    resource: "keyEvent",
    key: input.keyEvent.eventName,
    action: keyEventExists ? "skip" : "create",
  });

  return ops;
}

// ---------------------------------------------------------------------------
// Diagnoo'ya özgü sabit yapılandırma — `ga4-setup.ts` ve testler bunu paylaşır,
// böylece "hangi boyut/kural kuruluyor" tek yerde tanımlı kalır (runbook'un
// "API yolu" bölümündeki tablo bu sabitlerin birebir karşılığıdır).

export const DIAGNOO_SLUG = "diagnoo";

export const DIAGNOO_CUSTOM_DIMENSIONS: CustomDimensionInput[] = [
  { parameterName: "slug", displayName: "Araç slug'ı", scope: "EVENT" },
  { parameterName: "band", displayName: "Sonuç bandı", scope: "EVENT" },
  { parameterName: "category", displayName: "Yol haritası kategorisi", scope: "EVENT" },
  { parameterName: "target_service", displayName: "Önerilen hizmet", scope: "EVENT" },
];

export const DIAGNOO_EVENT_CREATE_RULE_BASE: Omit<EventCreateRuleInput, "streamId"> = {
  destinationEvent: "diagnoo_report_requested",
  sourceEvent: "tool_report_requested",
  conditions: [{ field: "slug", comparisonType: "EQUALS", value: DIAGNOO_SLUG }],
};

export const DIAGNOO_KEY_EVENT: KeyEventInput = {
  eventName: "diagnoo_report_requested",
  countingMethod: "ONCE_PER_EVENT",
};

// ---------------------------------------------------------------------------
// Data API — doğrulama (`scripts/ga4-verify.ts`)

/** Görev 11/12/13'te tanımlanan araç olay taksonomisi (`src/lib/analytics/events.ts`). */
export const TOOL_EVENT_NAMES = [
  "tool_used",
  "tool_scan_completed",
  "tool_report_requested",
  "tool_roadmap_item_expanded",
  "tool_service_cta_clicked",
] as const;

type DataApiCtx = { propertyId: string; accessToken: string; fetch: FetchFn };

type RunReportResponse = {
  rows?: { dimensionValues?: { value?: string }[]; metricValues?: { value?: string }[] }[];
};

export type ToolEventRow = { eventName: string; slug: string; eventCount: number };

/** Son 7 gün, olay × slug kırılımı — iki aracın (GEO/Diagnoo) verisi `slug` ile ayrışır. */
export async function runToolEventsReport(ctx: DataApiCtx): Promise<ToolEventRow[]> {
  const res = await ctx.fetch(`${DATA_BASE}/properties/${ctx.propertyId}:runReport`, {
    method: "POST",
    headers: jsonHeaders(ctx.accessToken),
    body: JSON.stringify({
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
      dimensions: [{ name: "eventName" }, { name: "customEvent:slug" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: { fieldName: "eventName", inListFilter: { values: [...TOOL_EVENT_NAMES] } },
      },
    }),
  });
  await assertOk(res, "runReport");
  const data = (await res.json()) as RunReportResponse;
  return (data.rows ?? []).map((row) => ({
    eventName: row.dimensionValues?.[0]?.value ?? "",
    slug: row.dimensionValues?.[1]?.value ?? "",
    eventCount: Number(row.metricValues?.[0]?.value ?? 0),
  }));
}

export type ToolEventRealtimeRow = { eventName: string; eventCount: number };

/** `--realtime`: yalnız olay bazında, `customEvent:` boyutları realtime API'de desteklenmez. */
export async function runToolEventsRealtimeReport(ctx: DataApiCtx): Promise<ToolEventRealtimeRow[]> {
  const res = await ctx.fetch(`${DATA_BASE}/properties/${ctx.propertyId}:runRealtimeReport`, {
    method: "POST",
    headers: jsonHeaders(ctx.accessToken),
    body: JSON.stringify({
      dimensions: [{ name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        filter: { fieldName: "eventName", inListFilter: { values: [...TOOL_EVENT_NAMES] } },
      },
    }),
  });
  await assertOk(res, "runRealtimeReport");
  const data = (await res.json()) as RunReportResponse;
  return (data.rows ?? []).map((row) => ({
    eventName: row.dimensionValues?.[0]?.value ?? "",
    eventCount: Number(row.metricValues?.[0]?.value ?? 0),
  }));
}
