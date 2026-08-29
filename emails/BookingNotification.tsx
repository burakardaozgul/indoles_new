import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";
import { semantic } from "@/lib/design/tokens";

export interface Lead {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  title: string;
}

export interface Props {
  name: string;
  lead: Lead;
  persona: string;
  problems: string[];
  /**
   * Rezervasyonun geldiği yüzey (`@/lib/schemas/booking.ts`). `problems`
   * boşken (yalnız `source: "contact"` bunu üretebilir) bu, aşağıdaki
   * "Problemler" satırının neden boş olduğunu dürüstçe açıklamak için
   * kullanılıyor — üç uydurma dize basmak yerine.
   */
  source: "popup" | "contact";
  startsAtUtc: string;
  /** Calendar'a yazılamadıysa (degraded) Meet de üretilemez — null gelir. */
  meetUrl: string | null;
  /** Calendar'a yazma başarısız olduysa true (spec §4: "Calendar erişimi kesik"). */
  degraded: boolean;
}

export default function BookingNotification({
  name,
  lead,
  persona,
  problems,
  source,
  startsAtUtc,
  meetUrl,
  degraded,
}: Props) {
  const istanbulTime = new Intl.DateTimeFormat("tr-TR", {
    timeZone: "Europe/Istanbul",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(startsAtUtc));

  return (
    <Html lang="tr">
      <Head />
      <Preview>
        {degraded ? "DİKKAT — elle takvime işlenmeli: " : "Yeni randevu: "}
        {name} — {istanbulTime}
      </Preview>
      <Body style={{ fontFamily: "system-ui, sans-serif" }}>
        <Container style={{ padding: "32px", maxWidth: "560px" }}>
          {degraded && (
            // Bu satır olmadan takvimde görünmeyen bir randevu sessizce kaçar.
            // Renk semantic.danger[700]/[50]: token dosyasında tam bu amaç için
            // tanımlı "danger" çifti — plandaki #7D3230 zaten bu tona eşit.
            <Text
              style={{
                backgroundColor: semantic.danger[50],
                color: semantic.danger[700],
                fontWeight: 600,
                padding: "12px 16px",
                borderRadius: "4px",
              }}
            >
              DİKKAT: Bu randevu takvime YAZILAMADI. Etkinliği elle oluşturman
              gerekiyor.
            </Text>
          )}

          <Heading as="h2">Yeni randevu — {name}</Heading>
          <Text>
            <strong>{istanbulTime}</strong> (İstanbul)
          </Text>

          <Hr />

          {/* Lead bağlamı yalnız burada ve Calendar açıklamasında yaşıyor;
              veritabanı KVKK minimizasyonu gereği bu alanları tutmuyor
              (spec §2.2b). Biri düşerse geri gelmez. */}
          <Text>
            <b>E-posta:</b> {lead.email}
          </Text>
          <Text>
            <b>Telefon:</b> {lead.phone}
          </Text>
          <Text>
            <b>Şirket:</b> {lead.company}
          </Text>
          <Text>
            <b>Unvan:</b> {lead.title}
          </Text>
          <Text>
            <b>Persona:</b> {persona}
          </Text>
          {problems.length > 0 ? (
            <Text>
              <b>Problemler:</b> {problems.join(" · ")}
            </Text>
          ) : (
            // `problems` boş yalnız `source: "contact"` ile mümkün (şema
            // kısıtı) — burada üç uydurma dize basmak yerine kaynağı
            // dürüstçe söylüyoruz.
            <Text>
              <b>Problemler:</b> Seçim yok — iletişim sayfasından gelen
              rezervasyon (kaynak: {source}).
            </Text>
          )}

          {meetUrl ? (
            <Text>
              <b>Meet:</b> <Link href={meetUrl}>{meetUrl}</Link>
            </Text>
          ) : (
            <Text>Meet bağlantısı üretilemedi.</Text>
          )}
        </Container>
      </Body>
    </Html>
  );
}
