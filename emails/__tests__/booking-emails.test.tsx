import { describe, expect, it } from "vitest";
import { render } from "@react-email/render";
import BookingConfirmation from "../BookingConfirmation";
import BookingNotification from "../BookingNotification";
import BookingCancelled from "../BookingCancelled";
import CalendarAuthAlert from "../CalendarAuthAlert";
import OrphanBookingsReport from "../OrphanBookingsReport";

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
    source: "popup" as const,
    startsAtUtc: "2026-09-07T10:00:00.000Z",
    meetUrl: "https://meet.google.com/abc",
    degraded: false,
  };

  it("lead bağlamının tamamını taşır — veritabanında tutulmayan alanlar dahil", async () => {
    const html = await render(<BookingNotification {...props} />);
    for (const v of [
      // lead.email KVKK gereği veritabanında tutulmuyor (spec §2.2b) — bu
      // satır düşerse ziyaretçiye ulaşmanın tek yolu bu mail olur.
      "ayse@example.com",
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
    // İsim doğrudan lead'den değil üst seviye `name` prop'undan geliyor
    // (tasarım gereği) — ama çıktıda göründüğü ayrıca doğrulanmalı.
    expect(html).toContain(props.name);
  });

  it("degraded false ise elle oluşturma uyarısı basmaz", async () => {
    const html = await render(<BookingNotification {...props} />);
    expect(html).not.toMatch(/YAZILAMADI/);
  });

  it("meetUrl null ama degraded false ise dürüst mesaj basar, Meet linki sızdırmaz", async () => {
    // Bu guard'ı `degraded: true` testinden ayrı tutuyoruz: ikisi birlikte
    // test edilirse `meetUrl: null` dalının degraded'dan bağımsız çalıştığı
    // hiç doğrulanmamış olur.
    const html = await render(
      <BookingNotification {...props} meetUrl={null} degraded={false} />
    );
    expect(html).not.toContain("meet.google.com");
    expect(html).toContain("Meet bağlantısı üretilemedi.");
    expect(html).not.toMatch(/YAZILAMADI/);
  });

  it("Calendar düştüyse uyarı basar", async () => {
    const html = await render(
      <BookingNotification {...props} degraded={true} meetUrl={null} />
    );
    expect(html).toMatch(/takvime YAZILAMADI|elle/i);
  });

  it("degraded uyarısı lead detaylarının ÜSTÜNDE görünür (konum, sadece varlık değil)", async () => {
    // toMatch/not.toMatch yalnız metnin var olduğunu kanıtlar, nerede
    // olduğunu değil — uyarı bloğu lead detaylarının altına kayarsa bu
    // testler olmadan CI yeşil kalır ve takvime yazılamamış randevu
    // sessizce kaçar. Bu yüzden indeks karşılaştırması şart.
    const html = await render(
      <BookingNotification {...props} degraded={true} meetUrl={null} />
    );
    const warningIndex = html.indexOf("YAZILAMADI");
    const leadDetailIndex = html.indexOf("E-posta:");
    // -1 durumunda `-1 < leadDetailIndex` yanlış nedenle geçebilir; ikisinin
    // de gerçekten bulunduğunu ayrıca iddia ediyoruz.
    expect(warningIndex).toBeGreaterThanOrEqual(0);
    expect(leadDetailIndex).toBeGreaterThanOrEqual(0);
    expect(warningIndex).toBeLessThan(leadDetailIndex);
  });

  it("problems boşsa (source: contact) uydurma dize basmaz, kaynağı dürüstçe söyler", async () => {
    // `bookingSchema` yalnız `source: "contact"` için `problems: []`e izin
    // verir (superRefine, @/lib/schemas/booking.ts) — önceden bu durum üç
    // uydurma dize basıyordu (`["İletişim sayfası", ...]`), artık kaynağı
    // söyleyen dürüst bir cümle basıyor.
    const html = await render(
      <BookingNotification {...props} problems={[]} source="contact" />
    );
    expect(html).not.toContain("p1");
    expect(html).not.toContain("İletişim sayfası");
    expect(html).not.toContain("doğrudan rezervasyon");
    expect(html).not.toContain("problem seçimi yapılmadı");
    expect(html).toMatch(/Seçim yok/);
    expect(html).toContain("contact");
  });

  it("problems doluysa (source: popup) mevcut davranış aynen kalır", async () => {
    const html = await render(<BookingNotification {...props} />);
    expect(html).toContain("p1 · p2 · p3");
    expect(html).not.toMatch(/Seçim yok/);
  });

  it("persona bilinmiyorsa (source: contact) site varsayılanını uydurmaz, kaynağı dürüstçe söyler", async () => {
    // `bookingSchema` yalnız `source: "contact"` için `persona`yı opsiyonel
    // bırakıyor (superRefine, @/lib/schemas/booking.ts) — önceden çağıran
    // taraf (`ContactBookingScreen`) bu durumda site varsayılanı
    // (`donusum-teknoloji`) gönderiyordu, mail bunu gerçek bir seçimmiş gibi
    // basıyordu.
    const html = await render(
      <BookingNotification {...props} persona={null} problems={[]} source="contact" />
    );
    expect(html).not.toContain("donusum-teknoloji");
    expect(html).not.toContain("buyume-pazarlar");
    expect(html).toMatch(/Belirtilmedi/);
    expect(html).toContain("contact");
  });

  it("persona biliniyorsa mevcut davranış aynen kalır", async () => {
    const html = await render(<BookingNotification {...props} />);
    expect(html).toContain("donusum-teknoloji");
    expect(html).not.toMatch(/Belirtilmedi/);
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

describe("OrphanBookingsReport — Görev 9 Ek 2", () => {
  const bookings = [
    {
      name: "Ayşe Yılmaz",
      email: "ayse@example.com",
      startsAtUtc: "2026-09-07T10:00:00.000Z",
    },
    {
      name: "Mehmet Kaya",
      email: "mehmet@example.com",
      startsAtUtc: "2026-09-08T11:45:00.000Z",
    },
  ];

  it("her randevunun ad, e-posta ve İstanbul saatini basar", async () => {
    const html = plain(
      await render(<OrphanBookingsReport bookings={bookings} />)
    );
    for (const b of bookings) {
      expect(html).toContain(b.name);
      expect(html).toContain(b.email);
    }
    expect(html).toContain("13:00"); // ilk randevu, İstanbul
  });

  it("Preview ve başlık kaç randevu olduğunu söyler", async () => {
    const html = await render(<OrphanBookingsReport bookings={bookings} />);
    expect(html).toMatch(/2 randevu/);
  });

  it("elle tamamlama talimatı içerir", async () => {
    const html = await render(<OrphanBookingsReport bookings={bookings} />);
    expect(html).toMatch(/elle (oluştur|tamamla)/i);
  });
});
