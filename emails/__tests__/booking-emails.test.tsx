import { describe, expect, it } from "vitest";
import { render } from "@react-email/render";
import BookingConfirmation from "../BookingConfirmation";
import BookingNotification from "../BookingNotification";
import BookingCancelled from "../BookingCancelled";
import CalendarAuthAlert from "../CalendarAuthAlert";

// react-email render() bir ReactElement bekliyor; sendMailWithRetry de aynı
// şekilde çağırıyor (`render(input.react)`, src/lib/mail/client.ts). Mevcut
// emails/__tests__/templates.test.tsx JSX deseni kullandığı için burada da
// aynı desen izleniyor — test gerçek kullanımı yansıtsın diye.

// ICU sürümüne göre saat/tarih biçiminde dar bölünmez boşluk (U+202F)
// görülebiliyor. Ampirik doğrulama (bu ortam, Node v22.18.0): çıktı düz ASCII
// boşluk kullanıyor, dar boşluk çıkmıyor — ama testi ICU sürümünden bağımsız
// kılmak için normalize ediyoruz.
const plain = (html: string) => html.replace(/\u202f/g, " ");

describe("BookingConfirmation", () => {
  const props = {
    firstName: "Ayşe",
    locale: "tr" as const,
    startsAtUtc: "2026-09-07T10:00:00.000Z",
    visitorTimezone: "Europe/Berlin",
    meetUrl: "https://meet.google.com/abc",
    cancelUrl: "https://www.indoles.com.tr/tr/rezervasyon/tok123",
  };

  it("saati HEM ziyaretçinin dilimiyle HEM İstanbul saatiyle yazar", async () => {
    // Yurt dışı görüşmede "10:00" kimin saati tartışması çıkmasın (spec §3.3).
    const html = plain(await render(<BookingConfirmation {...props} />));
    expect(html).toContain("12:00"); // Berlin (UTC+2, yaz saati)
    expect(html).toContain("13:00"); // İstanbul (UTC+3)
    expect(html).toContain("Europe/Berlin");
    expect(html).toContain("İstanbul");
  });

  it("dilim İstanbul ile aynıysa ikinci saat satırını basmaz", async () => {
    const html = plain(
      await render(
        <BookingConfirmation {...props} visitorTimezone="Europe/Istanbul" />
      )
    );
    expect(html).not.toMatch(/İstanbul saatiyle|Istanbul time/);
  });

  it("Meet bağlantısını ve iptal linkini içerir", async () => {
    const html = await render(<BookingConfirmation {...props} />);
    expect(html).toContain("https://meet.google.com/abc");
    expect(html).toContain("https://www.indoles.com.tr/tr/rezervasyon/tok123");
  });

  it("Meet üretilememişse dürüst mesaj verir, boş bağlantı basmaz", async () => {
    const html = await render(
      <BookingConfirmation {...props} meetUrl={null} />
    );
    expect(html).not.toContain("meet.google.com");
    expect(html).toMatch(/bağlantıyı ayrıca|ayrıca ileteceğiz/i);
  });

  it("EN sürümü İngilizce basar", async () => {
    const html = await render(<BookingConfirmation {...props} locale="en" />);
    expect(html).toMatch(/your booking/i);
  });

  it("Preview metni onay bağlamını özetler", async () => {
    const html = await render(<BookingConfirmation {...props} />);
    expect(html).toMatch(/Randevun onaylandı/);
  });
});

describe("BookingNotification", () => {
  const props = {
    name: "Ayşe Yılmaz",
    lead: {
      firstName: "Ayşe",
      lastName: "Yılmaz",
      phone: "+905550001122",
      email: "ayse@example.com",
      company: "Acme",
      title: "CTO",
    },
    persona: "donusum-teknoloji",
    problems: ["p1", "p2", "p3"],
    startsAtUtc: "2026-09-07T10:00:00.000Z",
    meetUrl: "https://meet.google.com/abc",
    degraded: false,
  };

  it("lead bağlamının tamamını taşır — veritabanında tutulmayan alanlar dahil", async () => {
    const html = await render(<BookingNotification {...props} />);
    for (const v of [
      "+905550001122",
      "Acme",
      "CTO",
      "donusum-teknoloji",
      "p1",
      "p2",
      "p3",
    ]) {
      expect(html).toContain(v);
    }
  });

  it("degraded false ise elle oluşturma uyarısı basmaz", async () => {
    const html = await render(<BookingNotification {...props} />);
    expect(html).not.toMatch(/YAZILAMADI/);
  });

  it("Calendar düştüyse uyarı basar", async () => {
    const html = await render(
      <BookingNotification {...props} degraded={true} meetUrl={null} />
    );
    expect(html).toMatch(/takvime YAZILAMADI|elle/i);
  });
});

describe("BookingCancelled", () => {
  const props = {
    name: "Ayşe Yılmaz",
    startsAtUtc: "2026-09-07T10:00:00.000Z",
  };

  it("randevu sahibini ve İstanbul saatini basar", async () => {
    const html = plain(await render(<BookingCancelled {...props} />));
    expect(html).toContain("Ayşe Yılmaz");
    expect(html).toContain("13:00");
    expect(html).toMatch(/iptal/i);
  });

  it("Preview metni içerir", async () => {
    const html = await render(<BookingCancelled {...props} />);
    expect(html).toMatch(/Randevu iptal edildi/);
  });
});

describe("CalendarAuthAlert", () => {
  const props = {
    errorCode: "invalid_grant",
    detectedAtUtc: "2026-09-07T10:00:00.000Z",
  };

  it("neyin koptuğunu, ne zaman fark edildiğini ve ne yapılması gerektiğini taşır", async () => {
    const html = plain(await render(<CalendarAuthAlert {...props} />));
    expect(html).toContain("invalid_grant"); // neyin koptuğu
    expect(html).toContain("13:00"); // ne zaman fark edildi (İstanbul saati)
    expect(html).toMatch(
      /yeniden yetkilendirme|google-calendar-oauth-kurulumu/i
    ); // ne yapılmalı
  });

  it("o ana kadar müsaitlik takviminin kapalı göründüğünü belirtir", async () => {
    const html = await render(<CalendarAuthAlert {...props} />);
    expect(html).toMatch(/müsaitlik takvimi.*kapalı|kapalı görünüyor/i);
  });
});
