import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import { neutral } from "@/lib/design/tokens";

// İç bildirim — ziyaretçiye değil, INDOLES kutusuna gider (Görev 7).
// Onay maili TR+EN, ama iç kutuya giden bildirim/iptal/uyarı mailleri
// yalnız Türkçe (görev talimatı).
export interface Props {
  name: string;
  startsAtUtc: string;
}

export default function BookingCancelled({ name, startsAtUtc }: Props) {
  const istanbulTime = new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(startsAtUtc));

  return (
    <Html lang="tr">
      <Head />
      <Preview>
        Randevu iptal edildi — {name}, {istanbulTime}
      </Preview>
      <Body style={{ fontFamily: "system-ui, sans-serif" }}>
        <Container style={{ padding: "32px", maxWidth: "560px" }}>
          <Heading as="h2">Randevu iptal edildi</Heading>
          <Text>
            {name} — <strong>{istanbulTime}</strong> (İstanbul)
          </Text>
          <Text style={{ color: neutral.ink[600] }}>
            Slot yeniden satışa açıldı.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
