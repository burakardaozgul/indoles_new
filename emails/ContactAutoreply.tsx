import { Body, Container, Head, Html, Preview, Text } from '@react-email/components';

export interface Props {
  firstName: string;
  locale: 'tr' | 'en';
}

export default function ContactAutoreply({ firstName, locale }: Props) {
  const t = locale === 'tr'
    ? { open: `Merhaba ${firstName},`, body: 'Mesajını aldık. 1 iş günü içinde döneceğiz.', close: 'Sabırla okuyoruz, elle hazırlıyoruz.' }
    : { open: `Hi ${firstName},`, body: 'We received your message. We will reply within one business day.', close: 'Prepared thoughtfully, sent from a human.' };
  return (
    <Html>
      <Head />
      <Preview>{t.body}</Preview>
      <Body style={{ fontFamily: 'system-ui, sans-serif' }}>
        <Container>
          <Text>{t.open}</Text>
          <Text>{t.body}</Text>
          <Text>{t.close}</Text>
          <Text>INDOLES</Text>
        </Container>
      </Body>
    </Html>
  );
}
