/**
 * Google Calendar REST istemcisi (spec §8).
 *
 * `googleapis` paketi kullanılmıyor: Node'a bağlı ve Worker paketini
 * şişirir. Yetkilendirme OAuth + kalıcı refresh token; servis hesabı
 * değil (gerekçe spec §8'de).
 */

/** Yetki koptu — çağıran bunu yakalayıp uyarı maili gönderir. */
export class CalendarAuthError extends Error {
  constructor(detail: string) {
    super(`Calendar yetkisi geçersiz: ${detail}`);
    this.name = "CalendarAuthError";
  }
}

type OAuthEnv = {
  GOOGLE_OAUTH_CLIENT_ID: string;
  GOOGLE_OAUTH_CLIENT_SECRET: string;
  GOOGLE_OAUTH_REFRESH_TOKEN: string;
};

export async function getAccessToken(env: OAuthEnv): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: env.GOOGLE_OAUTH_CLIENT_SECRET,
      refresh_token: env.GOOGLE_OAUTH_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  const data = (await res.json()) as { access_token?: string; error?: string };
  if (!res.ok || !data.access_token) {
    // invalid_grant sessiz bozulmanın tek sinyali; ayrı tiple fırlatıyoruz.
    throw new CalendarAuthError(data.error ?? `HTTP ${res.status}`);
  }
  return data.access_token;
}

export async function fetchBusy(
  token: string, calendarIds: string[], fromUtc: string, toUtc: string,
): Promise<{ start: string; end: string }[]> {
  const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ timeMin: fromUtc, timeMax: toUtc, items: calendarIds.map((id) => ({ id })) }),
  });
  if (!res.ok) throw new Error(`freeBusy başarısız: HTTP ${res.status}`);
  const data = (await res.json()) as {
    calendars?: Record<string, { busy?: { start: string; end: string }[]; errors?: unknown[] }>;
  };
  const out: { start: string; end: string }[] = [];
  for (const entry of Object.values(data.calendars ?? {})) {
    // Erişilemeyen bir takvim (paylaşım kaldırılmış olabilir) tüm sorguyu
    // düşürmemeli; o takvim yok sayılır, diğerleri korunur.
    if (entry.errors) continue;
    out.push(...(entry.busy ?? []));
  }
  return out;
}

export async function createEvent(
  token: string,
  calendarId: string,
  input: { summary: string; description: string; startUtc: string; endUtc: string; attendeeEmail: string },
): Promise<{ eventId: string; meetUrl: string | null }> {
  const url =
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events` +
    `?conferenceDataVersion=1&sendUpdates=all`;
  const res = await fetch(url, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({
      summary: input.summary,
      description: input.description,
      start: { dateTime: input.startUtc, timeZone: "UTC" },
      end: { dateTime: input.endUtc, timeZone: "UTC" },
      attendees: [{ email: input.attendeeEmail }],
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID(),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    }),
  });
  if (!res.ok) throw new Error(`events.insert başarısız: HTTP ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { id: string; hangoutLink?: string };
  return { eventId: data.id, meetUrl: data.hangoutLink ?? null };
}

export async function deleteEvent(token: string, calendarId: string, eventId: string): Promise<void> {
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}?sendUpdates=all`,
    { method: "DELETE", headers: { authorization: `Bearer ${token}` } },
  );
  // 410 = zaten silinmiş; iptal idempotent olmalı.
  if (!res.ok && res.status !== 404 && res.status !== 410) {
    throw new Error(`events.delete başarısız: HTTP ${res.status}`);
  }
}

export async function patchEventTime(
  token: string, calendarId: string, eventId: string, startUtc: string, endUtc: string,
): Promise<void> {
  // `conferenceData` gönderilmiyor ve `conferenceDataVersion` YOK: böylece
  // Google mevcut Meet bağlantısını koruyor, yenisini üretmiyor (spec §8).
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}?sendUpdates=all`,
    {
      method: "PATCH",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({
        start: { dateTime: startUtc, timeZone: "UTC" },
        end: { dateTime: endUtc, timeZone: "UTC" },
      }),
    },
  );
  if (!res.ok) throw new Error(`events.patch başarısız: HTTP ${res.status}`);
}
