import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "@/styles/globals.css";
import { TRPCProvider } from "@/lib/trpc/react";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-heading-serif",
  display: "swap",
  axes: ["opsz"],
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
  themeColor: "#FBFAF7",
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
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
