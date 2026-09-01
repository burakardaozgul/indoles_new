import { describe, it, expect } from 'vitest';
import { render } from '@react-email/render';
import GeoReportEmail from '../GeoReportEmail';
import type { GeoCheckResult } from '@/lib/tools/geo/types';
import type { ToolSignal } from '@/lib/content/tools';

const checks: GeoCheckResult[] = [
  {
    id: 'ai-access',
    score: 5,
    max: 20,
    status: 'fail',
    summary: { tr: 'AI erişimi özeti', en: 'AI access summary' },
    findings: [
      { tr: 'GPTBot robots.txt ile engellenmiş.', en: 'GPTBot is blocked in robots.txt.' },
    ],
  },
  {
    id: 'llms-txt',
    score: 20,
    max: 20,
    status: 'pass',
    summary: { tr: 'llms.txt özeti', en: 'llms.txt summary' },
    findings: [{ tr: 'llms.txt mevcut.', en: 'llms.txt is present.' }],
  },
  {
    id: 'json-ld',
    score: 8,
    max: 20,
    status: 'partial',
    summary: { tr: 'JSON-LD özeti', en: 'JSON-LD summary' },
    findings: [{ tr: 'Organization şeması eksik.', en: 'Organization schema is missing.' }],
  },
  {
    id: 'lang-signals',
    score: 12,
    max: 20,
    status: 'partial',
    summary: { tr: 'Dil sinyalleri özeti', en: 'Language signals summary' },
    findings: [{ tr: 'hreflang eksik.', en: 'hreflang is missing.' }],
  },
  {
    id: 'question-h2',
    score: 20,
    max: 20,
    status: 'pass',
    summary: { tr: 'Soru başlığı özeti', en: 'Question heading summary' },
    findings: [],
  },
];

const signals: ToolSignal[] = [
  { id: 'ai-access', weight: 20, title: { tr: 'AI erişimi', en: 'AI access' }, description: { tr: '', en: '' } },
  { id: 'llms-txt', weight: 20, title: { tr: 'llms.txt', en: 'llms.txt' }, description: { tr: '', en: '' } },
  { id: 'json-ld', weight: 20, title: { tr: 'JSON-LD', en: 'JSON-LD' }, description: { tr: '', en: '' } },
  { id: 'lang-signals', weight: 20, title: { tr: 'Dil sinyalleri', en: 'Language signals' }, description: { tr: '', en: '' } },
  { id: 'question-h2', weight: 20, title: { tr: 'Soru başlıkları', en: 'Question headings' }, description: { tr: '', en: '' } },
];

const guideLinks = [
  { label: 'GEO rehberi', href: 'https://www.indoles.com.tr/tr/yazilar/geo-rehberi' },
  { label: 'llms.txt nedir', href: 'https://www.indoles.com.tr/tr/yazilar/llms-txt-nedir' },
];

const baseProps = {
  locale: 'tr' as const,
  url: 'https://ornek.com.tr/',
  totalScore: 65,
  band: 'gelismeye-acik' as const,
  checks,
  signals,
  guideLinks,
  bookingUrl: 'https://www.indoles.com.tr/tr/iletisim',
};

describe('GeoReportEmail', () => {
  it('skor, bant ve en az bir bulgu satırı render olur', async () => {
    const html = await render(<GeoReportEmail {...baseProps} />);
    expect(html).toContain('65');
    expect(html).toContain('Gelişmeye açık');
    // Ayrıntılı bulgu (kilidin açtığı içerik) e-postada görünür.
    expect(html).toContain('GPTBot robots.txt ile engellenmiş.');
  });

  it('öncelikli aksiyonlar en düşük puanlı kalemlerin bulgusunu taşır', async () => {
    const html = await render(<GeoReportEmail {...baseProps} />);
    // En düşük skorlu kalem (ai-access, 5 puan) öncelikli aksiyonlarda.
    expect(html).toContain('Öncelikli üç aksiyon');
    expect(html).toContain('GPTBot robots.txt ile engellenmiş.');
  });

  it('rehber linki ve rezervasyon CTA adresi bulunur', async () => {
    const html = await render(<GeoReportEmail {...baseProps} />);
    expect(html).toContain('https://www.indoles.com.tr/tr/yazilar/llms-txt-nedir');
    expect(html).toContain('https://www.indoles.com.tr/tr/iletisim');
  });

  it('satış varyantı lead e-postasını gösterir', async () => {
    const html = await render(
      <GeoReportEmail {...baseProps} audience="sales" leadEmail="lead@ornek.com.tr" />,
    );
    expect(html).toContain('lead@ornek.com.tr');
    expect(html).toContain('Yeni GEO rapor talebi');
  });

  it('EN locale İngilizce metin ve etiket üretir', async () => {
    const html = await render(<GeoReportEmail {...baseProps} locale="en" band="iyi" />);
    expect(html).toContain('Good');
    expect(html).toContain('GPTBot is blocked in robots.txt.');
  });
});
