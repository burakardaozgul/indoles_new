import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from '@react-email/components';

export interface Props {
  firstName: string; lastName: string; email: string; phone: string;
  company: string; subject: string; message: string;
  budgetRange: string; timeline: string; locale: 'tr' | 'en';
}

export default function ContactNotification(props: Props) {
  return (
    <Html>
      <Head />
      <Preview>İletişim formu — {props.subject}</Preview>
      <Body style={{ fontFamily: 'system-ui, sans-serif' }}>
        <Container>
          <Heading as="h2">Yeni iletişim formu</Heading>
          <Section>
            <Text><b>{props.firstName} {props.lastName}</b> ({props.company})</Text>
            <Text>{props.email} · {props.phone}</Text>
            <Hr />
            <Text><b>Konu:</b> {props.subject}</Text>
            <Text><b>Bütçe:</b> {props.budgetRange} · <b>Zaman:</b> {props.timeline}</Text>
            <Hr />
            <Text style={{ whiteSpace: 'pre-wrap' }}>{props.message}</Text>
            <Hr />
            <Text><b>Locale:</b> {props.locale}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
