import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/lib/seo/JsonLd';
import { breadcrumbLd, organizationLd, webPageLd } from '@/lib/seo/json-ld';
import type { Locale } from '@/lib/content/types';
import { V2PageHeader } from '@/components/v2/chrome/V2PageHeader';
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
- Google Analytics 4: GA4 saklama ayarı gereği (hesapta 14 ay olarak sınırlandırılmıştır)

## Paylaşım
- Resend (e-posta için)
- Google Analytics 4 (Google Ireland Ltd. — ölçümleme)

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
- Google Analytics 4: per GA4 retention setting (capped at 14 months on this property)

## Sharing
- Resend (for email)
- Google Analytics 4 (Google Ireland Ltd. — measurement)

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
        // `h1` değil: sayfanın tek `h1`'i V2PageHeader'da. Belgedeki her
        // bölüm başlığı `h2` olmalı, aksi hâlde sayfada dokuz `h1` oluyor.
        <h2 key={i} className="typography-h2 mt-0 mb-8 text-ink-900">
          {line.replace(/^# /, '')}
        </h2>
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


const PATHS = { tr: '/tr/gizlilik-kvkk', en: '/en/privacy' };

const META = {
  tr: {
    title: 'Gizlilik ve KVKK aydınlatma metni',
    description:
      'İndoles Yazılım A.Ş. hangi verileri topluyor, hangi amaçla işliyor, ne kadar saklıyor, kimlerle paylaşıyor. Erişim, düzeltme ve silme haklarının kullanımı.',
  },
  en: {
    title: 'Privacy and KVKK notice',
    description:
      'Which data İndoles Yazılım A.Ş. collects, why it processes them, how long it retains them and who it shares them with — plus how to exercise your rights.',
  },
} as const;

/**
 * Yasal metin arama sonucunda yer tutmasın: `noindex, follow` ile dizinden
 * çıkar ama sayfadaki bağlantılar taranmaya devam eder. Canonical yine
 * kendini gösterir — Search Console'da "yanlış kanonik" uyarısı çıkmasın.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc = locale as Locale;
  return {
    ...buildMetadata({
      title: META[loc].title,
      description: META[loc].description,
      paths: PATHS,
      locale: loc,
    }),
    robots: { index: false, follow: true },
  };
}

export default async function KvkkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const loc = locale as 'tr' | 'en';
  const _tCommon = await getTranslations({ locale, namespace: 'common' });

  const content = loc === 'tr' ? KVKK_TR : KVKK_EN;
  const crumbLabel = loc === 'tr' ? 'Gizlilik' : 'Privacy';

  return (
    <>
      {/* `noindex` şemayı gereksiz kılmaz: sayfa dizine girmese de veri
          sorumlusunu adlandıran bir Organization düğümü grafiği tamamlıyor ve
          `follow` sayesinde tarayıcı buraya kadar geliyor. Diğer statik
          sayfalarla aynı üçlü (hakkimizda/page.tsx). */}
      <JsonLd
        graph={[
          organizationLd(),
          webPageLd({
            name: META[loc].title,
            description: META[loc].description,
            path: PATHS[loc],
            locale: loc,
          }),
          breadcrumbLd([
            { name: 'INDOLES', path: `/${loc}` },
            { name: crumbLabel },
          ]),
        ]}
      />

      <V2PageHeader
        crumbs={[
          { label: 'INDOLES', href: "/" },
          { label: crumbLabel },
        ]}
        eyebrow={loc === 'tr' ? 'Yasal' : 'Legal'}
        title={loc === 'tr' ? 'Gizlilik ve KVKK' : 'Privacy & KVKK'}
        lede={
          loc === 'tr'
            ? 'Verileriniz nasıl toplandığı, işlendiği ve korunduğu hakkında tam açıklık.'
            : 'Full transparency about how your data is collected, processed, and protected.'
        }
      />

      <article >
        <div className="ds-container py-16 md:py-24">
          <div className="mx-auto max-w-[680px]">
            {parseMarkdown(content)}
          </div>
        </div>
      </article>

      <ContactCallout locale={loc} />
    </>
  );
}
