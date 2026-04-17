import * as React from "react";
import { Html, Head, Body, Container, Heading, Text, Link } from "@react-email/components";

// Email copy stays inline (bypassing next-intl) because React Email renders
// outside request scope, where next-intl's getTranslations is not available
// without additional plumbing. Keeping TR/EN strings as a local `copy` table
// keeps email content reviewable in a single diff.

type Props = {
  firstName: string;
  locale: "tr" | "en";
  variant: "booking" | "contact";
  calComBookingUrl?: string | null;
};

const copy = {
  tr: {
    greeting: (n: string) => `Merhaba ${n},`,
    booking: {
      title: "Görüşme için takvimindeyiz.",
      body: "Seçtiğin slot için davet e-postası ayrı gelecek. Görüşmeden önce bir not: 3 sorunun üzerinden konuşacağız.",
      link: "Seçim bağlantısı:",
    },
    contact: {
      title: "Teşekkürler.",
      body: "1 iş günü içinde telefon veya e-posta ile ulaşacağız.",
    },
    signoff: "INDOLES ekibi",
  },
  en: {
    greeting: (n: string) => `Hi ${n},`,
    booking: {
      title: "You're on our calendar.",
      body: "You'll receive a separate calendar invite. A quick note: we'll talk through the 3 topics you selected.",
      link: "Selection link:",
    },
    contact: {
      title: "Thanks.",
      body: "We'll reach out by phone or email within 1 business day.",
    },
    signoff: "The INDOLES team",
  },
} as const;

export function PopupLeadConfirmationEmail(p: Props) {
  const t = copy[p.locale];
  const v = t[p.variant];

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "ui-sans-serif, system-ui", background: "#fafafa", padding: 24 }}>
        <Container style={{ background: "#fff", maxWidth: 560, padding: 24, borderRadius: 8 }}>
          <Text>{t.greeting(p.firstName)}</Text>
          <Heading style={{ fontSize: 20, margin: "16px 0" }}>{v.title}</Heading>
          <Text>{v.body}</Text>
          {p.variant === "booking" && p.calComBookingUrl ? (
            <Text>
              {t.booking.link} <Link href={p.calComBookingUrl}>{p.calComBookingUrl}</Link>
            </Text>
          ) : null}
          <Text style={{ marginTop: 24, color: "#666" }}>{t.signoff}</Text>
        </Container>
      </Body>
    </Html>
  );
}
