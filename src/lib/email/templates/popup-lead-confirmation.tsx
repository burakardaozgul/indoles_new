import * as React from "react";
import { Html, Head, Body, Container, Heading, Text } from "@react-email/components";

// Email copy stays inline (bypassing next-intl) because React Email renders
// outside request scope, where next-intl's getTranslations is not available
// without additional plumbing. Keeping TR/EN strings as a local `copy` table
// keeps email content reviewable in a single diff.

type Props = {
  firstName: string;
  locale: "tr" | "en";
  variant: "booking" | "contact";
};

const copy = {
  tr: {
    greeting: (n: string) => `Merhaba ${n},`,
    booking: {
      title: "Görüşme talebin elimizde.",
      body: "Uygun saati birlikte belirleyip takvim davetini e-postayla göndereceğiz. Görüşmeden önce bir not: 3 sorunun üzerinden konuşacağız.",
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
      title: "Your call request is with us.",
      body: "We'll agree a time together and send a calendar invite by email. A quick note: we'll talk through the 3 topics you selected.",
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
          <Text style={{ marginTop: 24, color: "#666" }}>{t.signoff}</Text>
        </Container>
      </Body>
    </Html>
  );
}
