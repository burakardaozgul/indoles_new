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

export type OAuthEnv = {
  GOOGLE_OAUTH_CLIENT_ID: string;
  GOOGLE_OAUTH_CLIENT_SECRET: string;
  GOOGLE_OAUTH_REFRESH_TOKEN: string;
};

/**
 * 401/403 yetki kaybının sinyali; çağıran bu tipe bakıp uyarı gönderiyor.
 * Diğer HTTP hataları (500, ağ vb.) genel `Error` olarak kalır — yalnız
 * yetki kaybı ayrı işlem gerektiriyor.
 */
function throwForStatus(res: Response, op: string, detail: string): never {
  if (res.status === 401 || res.status === 403) {
    throw new CalendarAuthError(`${op}: HTTP ${res.status}`);
  }
  throw new Error(`${op} başarısız: HTTP ${res.status} ${detail}`);
}

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
  // Boş liste ayrı bir kontrolü hak ediyor: aşağıdaki `usable === 0` koruması
  // `calendarIds.length > 0` şartına bağlı, yani boş dizide hiç tetiklenmez
  // ve fonksiyon sessizce `[]` (= tam müsaitlik) döner. Bu bir çağıran hatası
  // — programlama hatası — sessizce geçilecek bir durum değil.
  if (calendarIds.length === 0) {
    throw new Error("fetchBusy: calendarIds boş — en az bir takvim kimliği gerekir");
  }
  const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ timeMin: fromUtc, timeMax: toUtc, items: calendarIds.map((id) => ({ id })) }),
  });
  if (!res.ok) throwForStatus(res, "freeBusy", await res.text());
  const data = (await res.json()) as {
    calendars?: Record<string, { busy?: { start: string; end: string }[]; errors?: unknown[] }>;
  };
  const calendars = data.calendars ?? {};
  const out: { start: string; end: string }[] = [];
  let usable = 0;

  // Sayaç İSTENEN listeden yürüyor, yanıttan değil: bir takvim yanıtta hiç
  // yer almazsa (anahtar eksik, calendars hiç gelmemiş) o da bir başarısızlık.
  // Yanıttakileri saymak, eksik girdileri görünmez kılıyordu ve koruma hiç
  // tetiklenmiyordu — boş dizi çağırana "tamamen müsait" diyor.
  for (const id of calendarIds) {
    const entry = calendars[id];
    if (!entry) continue;
    if (Array.isArray(entry.errors) && entry.errors.length > 0) continue;
    usable++;
    out.push(...(entry.busy ?? []));
  }

  // Bir takvimin erişilemez olması (paylaşım kaldırılmış) diğerlerini
  // düşürmemeli. Ama hiçbiri kullanılabilir değilse müsaitlik bilgisi YOK
  // demektir; bunu boş müsaitlikle karıştırmak dolu saatleri satmak olur.
  if (calendarIds.length > 0 && usable === 0) {
    throw new Error(
      `freeBusy: istenen ${calendarIds.length} takvimin hiçbirinden müsaitlik alınamadı`,
    );
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
  if (!res.ok) throwForStatus(res, "events.insert", await res.text());
  const data = (await res.json()) as {
    id: string;
    hangoutLink?: string;
    conferenceData?: { createRequest?: { status?: { statusCode?: string } } };
  };

  let meetUrl = data.hangoutLink ?? null;

  // Google konferansı asenkron üretebiliyor: insert yanıtı linki henüz
  // taşımayabilir. Spec §8 bu durumda tek bir events.get ile teyit istiyor —
  // aksi halde ziyaretçi Meet linki olmayan bir onay maili alır ve bunu
  // kimse fark etmez.
  const status = data.conferenceData?.createRequest?.status?.statusCode;
  if (!meetUrl && status !== "success") {
    try {
      const check = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${data.id}`,
        { headers: { authorization: `Bearer ${token}` } },
      );
      if (check.ok) {
        const confirmed = (await check.json()) as { hangoutLink?: string };
        meetUrl = confirmed.hangoutLink ?? null;
      }
    } catch {
      // Teyit çağrısı ağ hatasıyla da başarısız olabilir; etkinlik zaten
      // oluştu, link eksikliği randevuyu iptal ettirmemeli.
    }
  }
  return { eventId: data.id, meetUrl };
}

export async function deleteEvent(token: string, calendarId: string, eventId: string): Promise<void> {
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}?sendUpdates=all`,
    { method: "DELETE", headers: { authorization: `Bearer ${token}` } },
  );
  // 410 = zaten silinmiş; iptal idempotent olmalı.
  if (!res.ok && res.status !== 404 && res.status !== 410) {
    throwForStatus(res, "events.delete", await res.text());
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
  if (!res.ok) throwForStatus(res, "events.patch", await res.text());
}
