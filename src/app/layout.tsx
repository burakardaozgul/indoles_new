import type { Metadata, Viewport } from "next";
import { getLocale } from "next-intl/server";
import { Lexend, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { SITE_URL } from "@/lib/seo/site";
import { buildGaBootstrap } from "@/lib/analytics/ga-bootstrap";
import { buildVerification } from "@/lib/seo/verification";
import "@/styles/globals.css";
import "@/styles/sections.css";

const lexend = Lexend({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono-code",
  display: "swap",
});

/**
 * Doğrulama kodları Vercel'de tanımlanır, repoya yazılmaz: bir doğrulama
 * kodu o mülkün kontrolünü kanıtlar. Kod yoksa alan hiç basılmaz.
 */
const verification = buildVerification({
  google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "INDOLES",
  authors: [{ name: "İndoles Yazılım A.Ş." }],
  robots: {
    index: process.env.NEXT_PUBLIC_APP_STAGE === "production",
    follow: process.env.NEXT_PUBLIC_APP_STAGE === "production",
  },
  ...(verification ? { verification } : {}),
};

export const viewport: Viewport = {
  themeColor: "#FAFAF7",
  width: "device-width",
  initialScale: 1,
};

/**
 * Persona merceğini ilk boyamadan ÖNCE kök elemana yazar.
 * Persona-aware metinler iki varyantı da DOM'a basar ve doğrusunu CSS seçer
 * (bkz. globals.css `[data-persona-variant]`). React'in kendisi seçemez:
 * sunucu `industrial` render eder, istemci cookie'yi okuyup `commerce`
 * render ederse hydration uyuşmazlığı olur. Bu yüzden seçim CSS'e,
 * cookie okuma da bu senkron script'e ait.
 */
const PERSONA_BOOTSTRAP =
  "try{var m=document.cookie.match(/(?:^|; )indoles_persona=([^;]+)/);" +
  "var v=m&&decodeURIComponent(m[1]);" +
  "if(!v){var p=document.cookie.match(/(?:^|; )indoles_popup_state=([^;]+)/);" +
  "if(p){v=(JSON.parse(decodeURIComponent(p[1]))||{}).persona}}" +
  "if(v==='buyume-pazarlar'||v==='donusum-teknoloji'){" +
  "document.documentElement.setAttribute('data-persona'," +
  "v==='buyume-pazarlar'?'commerce':'industrial')}}catch(e){}";

/**
 * GA4 yalnızca production'da ve ölçüm kimliği tanımlıyken yüklenir.
 * Preview/lokal trafiği property'yi kirletmesin diye iki koşul da aranır;
 * `NEXT_PUBLIC_*` build-time inline edildiği için koşul modül seviyesinde
 * çözülür ve id yokken hiçbir script etiketi render edilmez.
 *
 * Açılış dizgesi `buildGaBootstrap`ta: Consent Mode v2 varsayılanları
 * `config`ten önce basılmak zorunda ve bu sıra ancak testle korunabilir
 * (`lib/analytics/__tests__/ga-bootstrap.test.ts`).
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const GA_ENABLED =
  Boolean(GA_ID) && process.env.NEXT_PUBLIC_APP_STAGE === "production";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   * `lang` kök layout'ta basılmak zorunda ve önceden hiç basılmıyordu.
   * Sonucu: CSS `text-transform: uppercase` Türkçe kural bilmeden çalışıyor,
   * "Hizmet" → "HIZMET", "Eğitim" → "EĞITIM" oluyordu (İ/ı ayrımı kayıp).
   * Locale, [locale] segmentinin üstündeki bu layout'a middleware'den gelir.
   */
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${lexend.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      {/*
        Elle `<head>` render EDİLMEZ; head'i React/Next yönetir. Persona
        bootstrap'i bu yüzden `<body>`nin ilk çocuğu: hâlâ senkron ve ilk
        boyamadan önce çalışıyor.

        Not (ölçülmüş): "canonical/title `<body>` içinde basılıyor" bulgusunun
        sebebi bu manuel `<head>` DEĞİLDİ. A/B build'i ile doğrulandı — manuel
        `<head>` varken de bot UA'sında etiketler `<head>`teydi. Gerçek sebep
        Next 15.5'in varsayılan streaming metadata davranışı: etiketler shell
        akışından sonra basılır, React istemcide head'e taşır. Yalnız
        `htmlLimitedBots` listesindeki botlara bloklayan (head'e basan) sürüm
        gider ve bu listede Googlebot ile AI crawler'ları YOKTUR. Kapatmanın
        tek yolu `next.config.ts` içinde `htmlLimitedBots` seçeneğini tüm
        user-agent'ları kapsayan bir RegExp'e ayarlamaktır.
      */}
      <body>
        <script dangerouslySetInnerHTML={{ __html: PERSONA_BOOTSTRAP }} />
        {children}
        {/* Turnstile bayrakla devre dışıyken script hiç yüklenmez (ADR-028).
            `?render=explicit`: TÜM tüketiciler (`use-turnstile.ts` — GEO/
            Diagnoo formları, `ContactForm.tsx`) widget'ı `turnstile.render()`
            ile İMPERATİF çağırıyor; bu parametre olmadan script yüklenir
            yüklenmez sayfadaki `.cf-turnstile` konteynerlerini (henüz
            `data-sitekey` taşımıyorlar — sitekey yalnız `.render()` çağrısına
            parametre olarak gider) otomatik render etmeye çalışıp
            `Uncaught TurnstileError` fırlatıyordu (Görev 17.4, E2E'de
            gözlendi). `render=explicit` bu otomatik taramayı kapatır; hiçbir
            tüketici kodu değişmez. */}
        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
          />
        ) : null}
        {GA_ENABLED ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {buildGaBootstrap(GA_ID!)}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
