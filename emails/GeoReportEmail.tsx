import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import type { GeoBand, GeoCheckResult } from '@/lib/tools/geo/types';
import type { ToolSignal } from '@/lib/content/tools';
import type { Locale } from '@/lib/content/types';

/**
 * GEO Görünürlük Denetleyicisi — detaylı rapor e-postası (Görev 12, spec §3).
 *
 * Kilidi açan e-posta: ücretsiz ekran (Görev 11 `GeoResult`) yalnız skor + bant +
 * kalem özetini gösterir; `findings` (kalem başına ayrıntılı bulgular) bilinçli
 * gizlidir ve MOFU lead karşılığında BU e-postayla açılır.
 *
 * Görsel dil mevcut React Email şablonlarını (ContactAutoreply / ContactNotification)
 * izler: `system-ui` gövde, `Container`, `Section`, `Hr` ayraçları — ek stil sistemi
 * yok, e-posta istemcilerinde güvenli sade HTML.
 *
 * `audience`: aynı şablon iki alıcıya hizmet eder. `user` → ziyaretçiye giden rapor
 * (selamlama + tam bulgular + rehber + rezervasyon CTA'sı). `sales` → satış kutusuna
 * giden lead bildirimi (başta lead e-postası, ardından ziyaretçinin GÖRDÜĞÜ aynı
 * rapor gövdesi, böylece satış konuşmaya bağlamla girer). Tek şablon: rapor
 * içeriği iki yerde ayrışmaz.
 */

export interface GeoReportEmailProps {
  locale: Locale;
  url: string;
  totalScore: number;
  band: GeoBand;
  checks: GeoCheckResult[];
  /** Kalem başlıkları — motor kontrol kimliğiyle (`id`) eşleşen tanıtım kartı. */
  signals: ToolSignal[];
  /** İlgili rehber yazıları — route locale'e göre mutlak URL'lerle kurar. */
  guideLinks: Array<{ label: string; href: string }>;
  /** Rezervasyon sayfasının mutlak adresi (locale'e göre). */
  bookingUrl: string;
  audience?: 'user' | 'sales';
  /** Satış varyantında lead'in e-postası; `user` varyantında verilmez. */
  leadEmail?: string;
}

const BAND_LABELS: Record<GeoBand, Record<Locale, string>> = {
  zayif: { tr: 'Zayıf', en: 'Weak' },
  'gelismeye-acik': { tr: 'Gelişmeye açık', en: 'Developing' },
  iyi: { tr: 'İyi', en: 'Good' },
  oncu: { tr: 'Öncü', en: 'Leading' },
};

const COPY = {
  tr: {
    preview: (score: number) => `GEO hazırlık skorunuz: ${score}/100`,
    heading: 'GEO görünürlük raporunuz',
    intro:
      'Girdiğiniz adres için ölçtüğümüz ayrıntılı bulgular aşağıda. Her kalem, yapay zeka yanıt motorlarının sitenizi ne kadar rahat okuyup alıntıladığını gösteren bir sinyaldir.',
    scannedLabel: 'Taranan adres',
    scoreLabel: 'GEO hazırlık skoru',
    priorityTitle: 'Öncelikli üç aksiyon',
    priorityLede: 'En düşük puan alan üç kalem — buradan başlayın.',
    findingsTitle: 'Kalem kalem bulgular',
    noFindings: 'Bu kalemde ek bir bulgu yok.',
    guidesTitle: 'Skorunuzu yükselten rehberler',
    ctaTitle: 'Bu raporu birlikte uygulayalım',
    ctaBody:
      'Bulguları önceliklendirip sitenize uyarlamak için bir uzmanımızla bir saatlik görüşme planlayın.',
    ctaButton: 'Görüşme planlayın',
    salesTitle: 'Yeni GEO rapor talebi',
    salesLeadLabel: 'Lead e-postası',
    close: 'INDOLES',
  },
  en: {
    preview: (score: number) => `Your GEO readiness score: ${score}/100`,
    heading: 'Your GEO visibility report',
    intro:
      'Below are the detailed findings we measured for the address you entered. Each item is a signal for how easily AI answer engines can read and cite your site.',
    scannedLabel: 'Scanned address',
    scoreLabel: 'GEO readiness score',
    priorityTitle: 'Your top three actions',
    priorityLede: 'The three lowest-scoring items — start here.',
    findingsTitle: 'Findings, item by item',
    noFindings: 'No additional findings for this item.',
    guidesTitle: 'Guides to lift your score',
    ctaTitle: 'Let us apply this report together',
    ctaBody:
      'Book a one-hour call with one of our specialists to prioritise the findings and adapt them to your site.',
    ctaButton: 'Book a call',
    salesTitle: 'New GEO report request',
    salesLeadLabel: 'Lead email',
    close: 'INDOLES',
  },
} as const;

/** En düşük puanlı üç kalemin ilk bulgusu — sıfır bulgulu kalem atlanır. */
function priorityActions(checks: GeoCheckResult[], locale: Locale): string[] {
  return [...checks]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((c) => c.findings[0]?.[locale])
    .filter((f): f is string => Boolean(f));
}

export default function GeoReportEmail({
  locale,
  url,
  totalScore,
  band,
  checks,
  signals,
  guideLinks,
  bookingUrl,
  audience = 'user',
  leadEmail,
}: GeoReportEmailProps) {
  const t = COPY[locale];
  const actions = priorityActions(checks, locale);
  const titleFor = (id: string): string =>
    signals.find((s) => s.id === id)?.title[locale] ?? id;

  return (
    <Html>
      <Head />
      <Preview>{t.preview(totalScore)}</Preview>
      <Body style={{ fontFamily: 'system-ui, sans-serif' }}>
        <Container>
          {audience === 'sales' ? (
            <Section>
              <Heading as="h2">{t.salesTitle}</Heading>
              <Text>
                <b>{t.salesLeadLabel}:</b> {leadEmail}
              </Text>
              <Hr />
            </Section>
          ) : null}

          <Heading as="h1">{t.heading}</Heading>
          {audience === 'user' ? <Text>{t.intro}</Text> : null}

          <Section>
            <Text>
              <b>{t.scannedLabel}:</b> {url}
            </Text>
            <Text>
              <b>{totalScore}</b> / 100 — {BAND_LABELS[band][locale]}
            </Text>
            <Text>{t.scoreLabel}</Text>
          </Section>

          <Hr />

          {actions.length > 0 ? (
            <Section>
              <Heading as="h2">{t.priorityTitle}</Heading>
              <Text>{t.priorityLede}</Text>
              {actions.map((action, i) => (
                <Text key={i}>
                  {i + 1}. {action}
                </Text>
              ))}
              <Hr />
            </Section>
          ) : null}

          <Section>
            <Heading as="h2">{t.findingsTitle}</Heading>
            {checks.map((check) => (
              <Section key={check.id}>
                <Text>
                  <b>{titleFor(check.id)}</b> — {check.score}/{check.max}
                </Text>
                {check.findings.length > 0 ? (
                  check.findings.map((finding, i) => (
                    <Text key={i}>• {finding[locale]}</Text>
                  ))
                ) : (
                  <Text>{t.noFindings}</Text>
                )}
              </Section>
            ))}
          </Section>

          <Hr />

          {guideLinks.length > 0 ? (
            <Section>
              <Heading as="h2">{t.guidesTitle}</Heading>
              {guideLinks.map((link) => (
                <Text key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </Text>
              ))}
              <Hr />
            </Section>
          ) : null}

          <Section>
            <Heading as="h2">{t.ctaTitle}</Heading>
            <Text>{t.ctaBody}</Text>
            <Text>
              <Link href={bookingUrl}>{t.ctaButton}</Link>
            </Text>
          </Section>

          <Text>{t.close}</Text>
        </Container>
      </Body>
    </Html>
  );
}
