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
import { absoluteUrl } from '@/lib/seo/site';
import type { RangeValue } from '@/lib/tools/diagnoo/schema';

/**
 * Diagnoo GAP analizi — kilit açma (unlock) satış lead bildirimi. Spec §10,
 * Görev 12.
 *
 * Yalnız satış kutusuna gider — bu fazda ziyaretçiye ayrı bir kopya YOK
 * (unlock akışı zaten tam raporu API yanıtında döner, `DiagnooReport`
 * ekranda render edilir). Görsel dil `GeoReportEmail`'in `audience:"sales"`
 * bloğunu izler: sade `Container`/`Section`/`Hr`, ek stil sistemi yok.
 */

export interface DiagnooLeadNotificationProps {
  email: string;
  company: string;
  fullName: string | null;
  url: string;
  healthScore: number;
  totalRecoverable: RangeValue;
  /** Ziyaretçi unlock formunda gerçek metrik girdiyse true — finansal projeksiyon
   * o zaman tahminden değil ölçülen veriden türetilmiştir (`recomputeWithKnownMetrics`). */
  hasRealMetrics: boolean;
  /** Tam raporun göreli yolu (`/tr/araclar/diagnoo/rapor/${id}`). */
  reportPath: string;
}

const formatTl = (n: number): string => `${n.toLocaleString('tr-TR')} TL`;

export default function DiagnooLeadNotification({
  email,
  company,
  fullName,
  url,
  healthScore,
  totalRecoverable,
  hasRealMetrics,
  reportPath,
}: DiagnooLeadNotificationProps) {
  const reportUrl = absoluteUrl(reportPath);

  return (
    <Html>
      <Head />
      <Preview>{`Diagnoo lead — ${company} — ${healthScore}/100`}</Preview>
      <Body style={{ fontFamily: 'system-ui, sans-serif' }}>
        <Container>
          <Heading as="h2">Yeni Diagnoo lead</Heading>

          <Section>
            <Text>
              <b>{company}</b>
              {fullName ? <> — {fullName}</> : null}
            </Text>
            <Text>{email}</Text>
            <Hr />
            <Text>
              <b>Taranan adres:</b> {url}
            </Text>
            <Text>
              <b>Sağlık skoru:</b> {healthScore}/100
            </Text>
            <Text>
              <b>Aylık kurtarılabilir gelir (tahmini):</b>{' '}
              {formatTl(totalRecoverable.low)} – {formatTl(totalRecoverable.high)}
              {' '}(beklenen {formatTl(totalRecoverable.expected)})
            </Text>
            <Text>
              {hasRealMetrics
                ? 'Bu projeksiyon ziyaretçinin unlock formunda girdiği gerçek veriyle yeniden hesaplandı.'
                : 'Bu projeksiyon sektör ortalamalarından tahmin edilmiştir; ziyaretçi finansal girdi paylaşmadı.'}
            </Text>
          </Section>

          <Hr />

          <Section>
            <Text>
              <Link href={reportUrl}>Tam raporu görüntüle</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
