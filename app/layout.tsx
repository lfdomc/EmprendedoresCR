import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/header";
import { Toaster } from "sonner";
import { WebsiteStructuredData } from "@/components/seo/structured-data";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "Costa Rica Emprende - Marketplace de Emprendimientos",
    template: "%s | Costa Rica Emprende"
  },
  description: "Descubre y conecta con emprendimientos locales en Costa Rica. Encuentra productos únicos, servicios especializados y apoya a emprendedores costarricenses en nuestra plataforma digital.",
  keywords: [
    "emprendimientos",
    "Costa Rica",
    "marketplace",
    "productos locales",
    "servicios",
    "emprendedores",
    "negocios locales",
    "comercio electrónico",
    "pymes",
    "startups"
  ],
  authors: [{ name: "Costa Rica Emprende" }],
  creator: "Costa Rica Emprende",
  publisher: "Costa Rica Emprende",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_CR",
    url: defaultUrl,
    title: "Costa Rica Emprende - Marketplace de Emprendimientos",
    description: "Descubre y conecta con emprendimientos locales en Costa Rica. Encuentra productos únicos, servicios especializados y apoya a emprendedores costarricenses.",
    siteName: "Costa Rica Emprende",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Costa Rica Emprende - Marketplace de Emprendimientos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Costa Rica Emprende - Marketplace de Emprendimientos",
    description: "Descubre y conecta con emprendimientos locales en Costa Rica. Encuentra productos únicos y servicios especializados.",
    images: ["/twitter-image.png"],
    creator: "@costaricaemprende",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  other: {
    'google-site-verification': 'google-site-verification-code',
    'msvalidate.01': 'bing-site-verification-code',
    'yandex-verification': 'yandex-site-verification-code',
  },
  category: 'business',
  classification: 'marketplace, emprendimientos, Costa Rica',
  referrer: 'origin-when-cross-origin',
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4334054982108939"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <GoogleAnalytics />
          <WebsiteStructuredData />
          <Header />
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
