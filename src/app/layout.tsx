import type { Metadata, Viewport } from "next";
import { Lexend, Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  applicationName: "INDOLES",
  authors: [{ name: "İndoles Yazılım A.Ş." }],
  robots: {
    index: process.env.NEXT_PUBLIC_APP_STAGE === "production",
    follow: process.env.NEXT_PUBLIC_APP_STAGE === "production",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAFAF7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      className={`${lexend.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <head>
        {/* Persona merceğini ilk boyamadan ÖNCE kök elemana yazar.
            Persona-aware metinler iki varyantı da DOM'a basar ve doğrusunu
            CSS seçer (bkz. globals.css `[data-persona-variant]`). React'in
            kendisi seçemez: sunucu `industrial` render eder, istemci cookie'yi
            okuyup `commerce` render ederse hydration uyuşmazlığı olur.
            Bu yüzden seçim CSS'e, cookie okuma da bu senkron script'e ait. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var m=document.cookie.match(/(?:^|; )indoles_persona=([^;]+)/);" +
              "var v=m&&decodeURIComponent(m[1]);" +
              "if(!v){var p=document.cookie.match(/(?:^|; )indoles_popup_state=([^;]+)/);" +
              "if(p){v=(JSON.parse(decodeURIComponent(p[1]))||{}).persona}}" +
              "if(v==='buyume-pazarlar'||v==='donusum-teknoloji'){" +
              "document.documentElement.setAttribute('data-persona'," +
              "v==='buyume-pazarlar'?'commerce':'industrial')}}catch(e){}",
          }}
        />
      </head>
      <body>
        {children}
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
