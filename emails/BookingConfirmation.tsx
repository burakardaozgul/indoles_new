import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import { neutral } from "@/lib/design/tokens";

export interface Props {
  firstName: string;
  locale: "tr" | "en";
  startsAtUtc: string;
  visitorTimezone: string;
  /** Calendar etkinliği Meet olmadan açıldıysa null — boş bağlantı basılmaz. */
  meetUrl: string | null;
  cancelUrl: string;
}

/** Saati verilen dilimde okunur biçime çevirir (spec §3.3: depoda her şey UTC, gösterim dilime göre). */
function formatInZone(
  iso: string,
  timeZone: string,
  locale: "tr" | "en"
): string {
  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en-GB", {
    timeZone,
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(iso));
}

export default function BookingConfirmation({
  firstName,
  locale,
  startsAtUtc,
  visitorTimezone,
  meetUrl,
  cancelUrl,
}: Props) {
  const tr = locale === "tr";
  const visitorTime = formatInZone(startsAtUtc, visitorTimezone, locale);
  const istanbulTime = formatInZone(startsAtUtc, "Europe/Istanbul", locale);
  // Saat iki dilim birden yazılıyor: yurt dışı bir görüşmede "10:00"
  // ifadesinin kimin saati olduğu tartışılmasın (spec §3.3). Ziyaretçi zaten
  // İstanbul dilimindeyse ikinci satır tekrar aynı şeyi söyler, basılmaz.
  const sameZone = visitorTimezone === "Europe/Istanbul";

  return (
    <Html lang={locale}>
      <Head />
      <Preview>
        {tr
          ? `Randevun onaylandı — ${visitorTime}`
          : `Your booking is confirmed — ${visitorTime}`}
      </Preview>
      <Body
        style={{
          fontFamily: "system-ui, sans-serif",
          backgroundColor: neutral.bg,
        }}
      >
        <Container style={{ padding: "32px", maxWidth: "560px" }}>
          <Heading as="h2">
            {tr
              ? `${firstName}, randevun onaylandı.`
              : `${firstName}, your booking is confirmed.`}
          </Heading>

          <Text>
            <strong>{visitorTime}</strong> ({visitorTimezone})
          </Text>
          {!sameZone && (
            // Muted ikinci satır: neutral.ink[600] — nötr gri skalasında #555/#666'ya
            // en yakın basamak (bkz. commit mesajı / rapor: token dosyasında ayrı bir
            // "muted text" alanı yok).
            <Text style={{ color: neutral.ink[600] }}>
              {tr ? "İstanbul saatiyle: " : "Istanbul time: "}
              {istanbulTime}
            </Text>
          )}

          <Hr />

          {meetUrl ? (
            <Text>
              {tr ? "Görüşme bağlantısı: " : "Meeting link: "}
              <Link href={meetUrl}>{meetUrl}</Link>
            </Text>
          ) : (
            // Meet üretilemediyse boş <a> veya href={null} basılmaz; dürüst cümle yazılır.
            <Text>
              {tr
                ? "Görüşme bağlantısını ayrıca ileteceğiz."
                : "We will send the meeting link separately."}
            </Text>
          )}

          <Text style={{ fontSize: "13px", color: neutral.ink[600] }}>
            {tr
              ? "Saati değiştirmen veya iptal etmen gerekirse: "
              : "To reschedule or cancel: "}
            <Link href={cancelUrl}>{cancelUrl}</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
