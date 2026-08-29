import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Text,
} from "@react-email/components";
import { semantic } from "@/lib/design/tokens";

// Planda yoktu; ledger ruling'iyle eklendi (Görev 6 talimatı). Görev 9'un
// cron'u OAuth refresh token'ı öldüğünde (invalid_grant) bunu INDOLES
// kutusuna atacak. Yalnız Türkçe — iç bildirim, ziyaretçi hiç görmüyor.
export interface Props {
  /** Google'ın döndürdüğü ham hata kodu — "neyin koptuğu" (örn. "invalid_grant"). */
  errorCode: string;
  /** Cron'un hatayı yakaladığı an, ISO UTC — "ne zaman fark edildiği". */
  detectedAtUtc: string;
}

export default function CalendarAuthAlert({ errorCode, detectedAtUtc }: Props) {
  const detectedIstanbul = new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(detectedAtUtc));

  return (
    <Html lang="tr">
      <Head />
      <Preview>
        DİKKAT: Google Calendar yetkisi koptu — yeniden yetkilendirme gerekiyor
      </Preview>
      <Body style={{ fontFamily: "system-ui, sans-serif" }}>
        <Container style={{ padding: "32px", maxWidth: "560px" }}>
          <Heading as="h2" style={{ color: semantic.danger[700] }}>
            Google Calendar yetkisi koptu
          </Heading>

          {/* Renk semantic.danger[700]/[50]: token dosyasındaki tek "danger" çifti,
              plandaki #7D3230'a zaten eşit. Ayrı bir "uyarı kutusu" alanı yok, en
              yakın anlamlı token bu. */}
          <Text
            style={{
              backgroundColor: semantic.danger[50],
              color: semantic.danger[700],
              padding: "12px 16px",
              borderRadius: "4px",
            }}
          >
            Hata kodu: <strong>{errorCode}</strong>
            <br />
            Fark edilme anı: <strong>{detectedIstanbul}</strong> (İstanbul)
          </Text>

          <Hr />

          <Text>
            Refresh token artık geçersiz; sunucu Calendar&apos;a erişemiyor.{" "}
            <strong>
              Bu düzelene kadar müsaitlik takvimi ziyaretçilere kapalı görünüyor
            </strong>{" "}
            — hiç saat gösterilmiyor, site otomatik olarak iletişim formuna
            düşüyor (spec §4).
          </Text>

          <Text>
            <strong>Ne yapman gerekiyor:</strong>{" "}
            <code>digital@indoles.com.tr</code> hesabıyla tarayıcıdan yeniden
            yetkilendirme akışını çalıştır — adımlar{" "}
            <code>docs/runbooks/google-calendar-oauth-kurulumu.md</code>{" "}
            dosyasında. Yetkilendirme, Cloud projesinde &quot;Publish app&quot;
            adımından SONRA yapılmalı; aksi halde yeni token da 7 günde ölür
            (spec §8).
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
