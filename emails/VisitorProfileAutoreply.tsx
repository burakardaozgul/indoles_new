import { Body, Container, Head, Html, Preview, Text } from '@react-email/components';

export interface Props {
  persona: 'donusum-teknoloji' | 'buyume-pazarlar';
  firstName: string;
  submissionType: 'booking' | 'contact';
  locale: 'tr' | 'en';
}

const copy = {
  'donusum-teknoloji': {
    tr: {
      open: 'Merhaba {first},',
      body: 'Seçimlerini aldık. Dönüşüm ve teknoloji tarafında birlikte hangi adımı atacağımızı, 1 iş günü içinde bir öneriyle döneceğiz.',
      close: 'Sabırla okuyoruz, elle hazırlıyoruz.',
    },
    en: {
      open: 'Hi {first},',
      body: 'Noted. We will follow up within one business day with concrete next steps on the transformation side.',
      close: 'Prepared thoughtfully, sent from a human.',
    },
  },
  'buyume-pazarlar': {
    tr: {
      open: 'Merhaba {first},',
      body: 'Seçimlerini aldık. Büyüme tarafında birlikte neyi test edebileceğimizi 1 iş günü içinde netleştireceğiz.',
      close: 'Acele etmiyoruz ama hızlı hareket ediyoruz.',
    },
    en: {
      open: 'Hi {first},',
      body: 'Noted. We will follow up within one business day with a concrete growth experiment to consider.',
      close: 'Moving fast, not rushed.',
    },
  },
};

export default function VisitorProfileAutoreply({ persona, firstName, submissionType, locale }: Props) {
  const t = copy[persona][locale];
  return (
    <Html>
      <Head />
      <Preview>{t.body}</Preview>
      <Body style={{ fontFamily: 'system-ui, sans-serif' }}>
        <Container>
          <Text>{t.open.replace('{first}', firstName)}</Text>
          <Text>{t.body}</Text>
          {submissionType === 'booking' && (
            <Text>{locale === 'tr'
              ? 'Bir sonraki ekranda müsait olduğun saati seçebilirsin; onay otomatik gider.'
              : 'On the next screen you can pick a time that works for you; confirmation will be sent automatically.'}
            </Text>
          )}
          <Text>{t.close}</Text>
          <Text>INDOLES</Text>
        </Container>
      </Body>
    </Html>
  );
}
