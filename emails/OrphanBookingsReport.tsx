import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import { semantic } from "@/lib/design/tokens";

// Görev 9, Ek 2 — denetimlerden geldi, plandaki ilk halinde yoktu.
// ADR-029'dan sonra Calendar'a yazılamayan bir randevu satırı 'confirmed'
// kalıp calendar_event_id NULL bırakıyor; anlık bildirim maili
// (BookingNotification, degraded=true) bunu bir kez söylüyor ama o mail
// kaçırılabilir veya elle oluşturma unutulabilir. Bu, cron'un her gün
// tekrar hatırlattığı ikinci ve son uyarı — iç kutuya gider, ziyaretçi hiç
// görmez. Sonuç boşsa bu mail HİÇ gönderilmez (cron-job.ts) — her gün gelen
// bir "her şey yolunda" maili gerçek uyarıyı gömerdi.
export interface OrphanBookingItem {
  name: string;
  email: string;
  startsAtUtc: string;
}

export interface Props {
  bookings: OrphanBookingItem[];
}

export default function OrphanBookingsReport({ bookings }: Props) {
  return (
    <Html lang="tr">
      <Head />
      <Preview>{`${bookings.length} randevu hâlâ takvime işlenmedi — elle tamamla`}</Preview>
      <Body style={{ fontFamily: "system-ui, sans-serif" }}>
        <Container style={{ padding: "32px", maxWidth: "560px" }}>
          <Heading as="h2" style={{ color: semantic.warning[700] }}>
            Takvime düşmemiş randevular
          </Heading>

          {/* Renk semantic.warning[700]/[50]: "Minor" seviyeli bir uyarı —
              CalendarAuthAlert'in kullandığı danger çiftinden bilinçli
              olarak farklı, çünkü bu durum sistemik bir kesinti değil, tek
              tek randevuların elle tamamlanması gereken bir iş listesi. */}
          <Text
            style={{
              backgroundColor: semantic.warning[50],
              color: semantic.warning[700],
              fontWeight: 600,
              padding: "12px 16px",
              borderRadius: "4px",
            }}
          >
            Aşağıdaki {bookings.length} randevu hâlâ geçerli ama Google
            Calendar&apos;a hiç yazılamadı. Etkinlikleri elle oluşturman
            gerekiyor.
          </Text>

          <Hr />

          {bookings.map((b, i) => {
            const istanbulTime = new Intl.DateTimeFormat("tr-TR", {
              timeZone: "Europe/Istanbul",
              dateStyle: "full",
              timeStyle: "short",
            }).format(new Date(b.startsAtUtc));
            return (
              <Text key={i}>
                <strong>{b.name}</strong> — {b.email} — {istanbulTime}{" "}
                (İstanbul)
              </Text>
            );
          })}
        </Container>
      </Body>
    </Html>
  );
}
