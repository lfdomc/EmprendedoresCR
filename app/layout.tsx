// Polyfill para self en el servidor - debe ejecutarse primero
if (typeof window === 'undefined' && typeof self === 'undefined') {
  if (typeof global !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).self = global;
  } else if (typeof globalThis !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).self = globalThis;
  }
}

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/layout/header";
import { ClientProviders } from "@/components/providers/client-providers";
import { siteConfig } from "@/lib/config";
import dynamic from "next/dynamic";
import "./globals.css";

// Lazy loading de componentes no críticos
const Footer = dynamic(() => import("@/components/layout/footer"), {
  ssr: true,
});
const WebsiteStructuredData = dynamic(() => import("@/components/seo/structured-data").then(mod => ({ default: mod.WebsiteStructuredData })), {
  ssr: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: "%s | Costa Rica Emprende"
  },
  description: siteConfig.description,
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
  authors: [{ name: "Costa Rica Emprende", url: siteConfig.url }],
  creator: "Costa Rica Emprende",
  publisher: "Costa Rica Emprende",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_CR',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  verification: {
    google: "google-site-verification-code",
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        type: 'image/x-icon',
      },
    ],
    shortcut: '/favicon.ico',
    apple: {
      url: '/favicon.ico',
      sizes: '32x32',
      type: 'image/x-icon',
    },
  },
  other: {
    'google-site-verification': 'google-site-verification-code',
    'msvalidate.01': 'bing-site-verification-code',
    'yandex-verification': 'yandex-site-verification-code',
    // Metadatos específicos para WhatsApp
    'og:image:secure_url': siteConfig.ogImage,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/jpeg',
    'og:image:alt': siteConfig.title,
    'whatsapp:image': siteConfig.ogImage,
    'telegram:image': siteConfig.ogImage,
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
          dangerouslySetInnerHTML={{
            __html: `
              // Polyfill para self en el cliente
              if (typeof self === 'undefined') {
                if (typeof globalThis !== 'undefined') {
                  globalThis.self = globalThis;
                } else if (typeof window !== 'undefined') {
                  window.self = window;
                } else if (typeof global !== 'undefined') {
                  global.self = global;
                }
              }
            `,
          }}
        />
      </head>
      <body className={`${geistSans.className} antialiased flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <WebsiteStructuredData />
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <ClientProviders />
        </ThemeProvider>
      </body>
    </html>
  );
}
