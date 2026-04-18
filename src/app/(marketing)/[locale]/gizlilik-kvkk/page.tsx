import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageHeader } from '@/components/marketing/page-header';
import { ContactCallout } from '@/components/marketing/contact-callout';

const KVKK_TR = `# Gizlilik ve KVKK Aydınlatma Metni

**Veri sorumlusu:** İndoles Yazılım A.Ş.

## Toplanan Veriler
- Ad, soyad, telefon, e-posta, şirket, unvan
- Popup'ta seçilen persona ve 3 sorun
- Iletişim formunda verilen mesaj, bütçe aralığı, zaman bilgisi

## İşleme Amacı
- İletişim kurma, rezervasyon, lead takibi, persona-based personalization

## Saklama
- Mail arşivinde: inbox policy gereği (24 ay sonra manuel inceleme)
- PostHog analitik: PostHog retention policy gereği (varsayılan 7 yıl, ayarlanabilir)

## Paylaşım
- Cal.com (rezervasyon için)
- Resend (e-posta için)
- PostHog (analytics)

## Haklar
- Erişim, düzeltme, silme, itiraz haklarınızı kullanmak için: privacy@indoles.com.tr`;

const KVKK_EN = `# Privacy & KVKK Notice

**Data controller:** İndoles Yazılım A.Ş.

## Collected Data
- First name, last name, phone, email, company, job title
- Persona and 3 problems selected in popup
- Message, budget range, timeline provided in contact form

## Processing Purpose
- Communication, booking, lead tracking, persona-based personalization

## Retention
- Email archive: per inbox policy (manual review after 24 months)
- PostHog analytics: per PostHog retention policy (default 7 years, adjustable)

## Sharing
- Cal.com (for booking)
- Resend (for email)
- PostHog (analytics)

## Your Rights
- To exercise access, correction, deletion, or objection rights: privacy@indoles.com.tr`;

function parseMarkdown(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line) continue;

    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="typography-display-lg mt-0 mb-8 text-ink-900">
          {line.replace(/^# /, '')}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="typography-h2 mt-8 mb-4 text-ink-900">
          {line.replace(/^## /, '')}
        </h2>
      );
    } else if (line.startsWith('- ')) {
      // Collect consecutive list items
      const listItems: string[] = [];
      let j = i;
      while (j < lines.length && lines[j]?.startsWith('- ')) {
        listItems.push(lines[j]!.replace(/^- /, ''));
        j++;
      }
      elements.push(
        <ul key={i} className="list-disc list-inside space-y-2 mb-6 text-ink-900 typography-body-md">
          {listItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
      i = j - 1;
    } else if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
      elements.push(
        <p key={i} className="mb-4 text-ink-900 typography-body-md font-semibold">
          {line.replace(/\*\*/g, '')}
        </p>
      );
    } else if (line.trim()) {
      // Handle inline links like [email](mailto:...)
      const text = line.replace(/\[([^\]]+)\]\(mailto:([^)]+)\)/g, '$1');
      const emailMatch = line.match(/\[([^\]]+)\]\(mailto:([^)]+)\)/);
      const email = emailMatch ? emailMatch[2] : undefined;

      if (email) {
        elements.push(
          <p key={i} className="mb-4 text-ink-900 typography-body-md">
            {line.replace(/\[([^\]]+)\]\(mailto:[^)]+\)/, '')}
            <a
              href={`mailto:${email!}`}
              className="text-brand-700 underline underline-offset-4 decoration-brand-300 hover:decoration-brand-500"
            >
              {text}
            </a>
          </p>
        );
      } else {
        elements.push(
          <p key={i} className="mb-4 text-ink-900 typography-body-md">
            {line}
          </p>
        );
      }
    }
  }

  return elements;
}

export default async function KvkkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as 'tr' | 'en';
  const tCommon = await getTranslations({ locale, namespace: 'common' });

  const content = loc === 'tr' ? KVKK_TR : KVKK_EN;

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: 'INDOLES', href: `/${locale}` },
          { label: loc === 'tr' ? 'Gizlilik' : 'Privacy' },
        ]}
        eyebrow={loc === 'tr' ? 'Yasal' : 'Legal'}
        title={loc === 'tr' ? 'Gizlilik ve KVKK' : 'Privacy & KVKK'}
        lede={
          loc === 'tr'
            ? 'Verileriniz nasıl toplandığı, işlendiği ve korunduğu hakkında tam açıklık.'
            : 'Full transparency about how your data is collected, processed, and protected.'
        }
      />

      <article className="bg-paper">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12 py-16 md:py-24">
          <div className="mx-auto max-w-[680px]">
            {parseMarkdown(content)}
          </div>
        </div>
      </article>

      <ContactCallout locale={loc} />
    </>
  );
}
