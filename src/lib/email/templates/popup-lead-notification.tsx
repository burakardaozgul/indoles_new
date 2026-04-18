import * as React from "react";
import { Html, Head, Body, Container, Section, Heading, Text, Link, Hr } from "@react-email/components";

// See popup-lead-confirmation.tsx for email i18n design note.

type Props = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  personaLabel: string;
  problems: string[];
  submissionType: "booking" | "contact";
  calComBookingUrl?: string | null;
  locale: "tr" | "en";
  utm?: { source?: string; medium?: string; campaign?: string };
  adminLink: string;
};

const row: React.CSSProperties = { margin: "4px 0" };
const label: React.CSSProperties = { color: "#666", display: "inline-block", width: 90 };

export function PopupLeadNotificationEmail(p: Props) {
  const subject = `Yeni lead: ${p.personaLabel} — ${p.firstName} ${p.lastName} (${p.company})`;

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "ui-sans-serif, system-ui", background: "#fafafa", padding: 24 }}>
        <Container style={{ background: "#fff", maxWidth: 600, padding: 24, borderRadius: 8 }}>
          <Heading style={{ fontSize: 18, marginBottom: 16 }}>{subject}</Heading>
          <Section>
            <Text style={row}><span style={label}>Kişi:</span> {p.firstName} {p.lastName}</Text>
            <Text style={row}><span style={label}>Unvan:</span> {p.title}</Text>
            <Text style={row}><span style={label}>Şirket:</span> {p.company}</Text>
            <Text style={row}><span style={label}>Telefon:</span> {p.phone}</Text>
            <Text style={row}><span style={label}>E-posta:</span> {p.email}</Text>
          </Section>
          <Hr />
          <Section>
            <Text style={row}><span style={label}>Persona:</span> {p.personaLabel}</Text>
            <Text style={row}><span style={label}>Sorunlar:</span></Text>
            <ol style={{ paddingLeft: 20, color: "#333" }}>
              {p.problems.map((pr, i) => (<li key={i}>{pr}</li>))}
            </ol>
          </Section>
          <Hr />
          <Section>
            <Text style={row}><span style={label}>Tür:</span> {p.submissionType}</Text>
            {p.submissionType === "booking" && p.calComBookingUrl ? (
              <Text style={row}>
                <span style={label}>Cal.com:</span> <Link href={p.calComBookingUrl}>{p.calComBookingUrl}</Link>
              </Text>
            ) : null}
            <Text style={row}><span style={label}>Locale:</span> {p.locale}</Text>
            {p.utm ? (
              <Text style={row}>
                <span style={label}>UTM:</span> {p.utm.source ?? "-"} / {p.utm.medium ?? "-"} / {p.utm.campaign ?? "-"}
              </Text>
            ) : null}
          </Section>
          <Hr />
          <Text><Link href={p.adminLink}>Admin&apos;de aç</Link></Text>
        </Container>
      </Body>
    </Html>
  );
}
