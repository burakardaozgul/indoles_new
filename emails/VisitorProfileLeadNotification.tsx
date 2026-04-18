import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from '@react-email/components';

type Lead = {
  firstName: string; lastName: string; email: string;
  phone: string; company: string; title: string;
};

export interface Props {
  persona: 'donusum-teknoloji' | 'buyume-pazarlar';
  problems: string[];
  lead: Lead;
  submissionType: 'booking' | 'contact';
  locale: 'tr' | 'en';
  utm: { source?: string | undefined; medium?: string | undefined; campaign?: string | undefined } | undefined;
  preferredSlot?: { date: string; time: string } | undefined;
}

const personaLabel = {
  'donusum-teknoloji': 'Sanayici — Dönüşüm ve Teknoloji',
  'buyume-pazarlar': 'Ticaret — Büyüme ve Yeni Pazarlar',
};

export default function VisitorProfileLeadNotification(props: Props) {
  const { persona, problems, lead, submissionType, locale, utm, preferredSlot } = props;
  return (
    <Html>
      <Head />
      <Preview>Yeni popup lead — {lead.firstName} {lead.lastName} ({lead.company})</Preview>
      <Body style={{ fontFamily: 'system-ui, sans-serif' }}>
        <Container>
          <Heading as="h2">Yeni Popup Lead</Heading>
          <Section>
            <Text><b>Kişi:</b> {lead.firstName} {lead.lastName}</Text>
            <Text><b>Unvan:</b> {lead.title}</Text>
            <Text><b>Şirket:</b> {lead.company}</Text>
            <Text><b>Email:</b> {lead.email}</Text>
            <Text><b>Telefon:</b> {lead.phone}</Text>
          </Section>
          <Hr />
          <Section>
            <Text><b>Persona:</b> {personaLabel[persona]}</Text>
            <Text><b>Seçtiği 3 sorun:</b></Text>
            <ul>
              {problems.map((p) => <li key={p}>{p}</li>)}
            </ul>
            <Text><b>Submission tipi:</b> {submissionType}</Text>
            <Text><b>Locale:</b> {locale}</Text>
            {preferredSlot && (
              <Text><b>Tercih edilen saat:</b> {preferredSlot.date} · {preferredSlot.time}</Text>
            )}
            {utm && (
              <Text><b>UTM:</b> {utm.source ?? '—'} / {utm.medium ?? '—'} / {utm.campaign ?? '—'}</Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
