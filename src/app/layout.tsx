import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { SessionProvider } from "@/components/SessionProvider";
import MainNavigation from "@/components/navigation/MainNavigation";
import Footer from "@/components/navigation/Footer";
import {
  WebSiteSchema,
  EducationalOrganizationSchema,
} from "@/components/seo/SchemaMarkup";
import {
  initWebVitals,
  addResourceHints,
} from "@/lib/performance/core-web-vitals";
import "@/lib/automation-init";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ],
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Monaco", "Menlo", "Consolas", "Courier New", "monospace"],
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Zumenzu - Learn Python with Anime Cards & Gamification",
    template: "%s | Zumenzu - Interactive Python Learning",
  },
  description:
    "Learn Python programming while collecting anime cards, earning badges, and completing daily quests. The world's most engaging gamified Python learning platform with interactive lessons and achievements system.",
  keywords: [
    "learn python",
    "python programming",
    "python course",
    "interactive coding",
    "programming education",
    "coding bootcamp",
    "gamification learning",
    "anime cards collection",
    "python lessons",
    "online python education",
    "python tutorial",
    "coding gamification",
    "programming gamification",
    "python beginner",
    "python fundamentals",
    "interactive python",
    "python game",
    "python badges",
    "python achievements",
    "coding challenges",
    "python certification",
    "learn to code",
    "programming course",
    "python developer",
    "coding education",
  ],
  authors: [{ name: "Zumenzu Team" }],
  creator: "Zumenzu",
  publisher: "Zumenzu",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://zumenzu.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "tr-TR": "/tr",
      "es-ES": "/es",
      "fr-FR": "/fr",
      "de-DE": "/de",
      "ja-JP": "/ja",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zumenzu.com",
    title: "Zumenzu - Learn Python with Anime Cards & Gamification",
    description:
      "Learn Python programming while collecting anime cards, earning badges, and completing daily quests. The world's most engaging gamified Python learning platform.",
    siteName: "Zumenzu",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zumenzu - Interactive Python Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zumenzu - Learn Python with Anime Cards & Gamification",
    description:
      "Learn Python programming while collecting anime cards, earning badges, and completing daily quests. The world's most engaging gamified Python learning platform.",
    site: "@zumenzu",
    creator: "@zumenzu",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "education",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get session on server side to avoid hydration issues
  const session = await getServerSession(authOptions);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Zumenzu",
    description:
      "Learn Python programming while collecting anime cards, earning badges, and completing daily quests. The world's most engaging gamified Python learning platform.",
    url: "https://zumenzu.com",
    logo: "https://zumenzu.com/logo.png",
    image: "https://zumenzu.com/og-image.jpg",
    sameAs: [
      "https://twitter.com/zumenzu",
      "https://instagram.com/zumenzu",
      "https://linkedin.com/company/zumenzu",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "Global",
      addressLocality: "Worldwide",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "support@zumenzu.com",
    },
    offers: {
      "@type": "Offer",
      category: "Educational Course",
      name: "Python Programming with Gamification",
      description:
        "Learn Python programming with anime card collection and gamification",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    educationalCredentialAwarded: "Certificate of Completion",
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Programming Certificate",
      name: "Python Programming Certificate",
    },
  };

  return (
    <html lang="tr">
      <head>
        {/* Performance optimizations */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                    custom_map: {
                      'custom_dimension_1': 'user_type',
                      'custom_dimension_2': 'learning_level',
                      'custom_dimension_3': 'gamification_tier'
                    }
                  });
                  
                  // Initialize Web Vitals monitoring
                  window.addEventListener('load', function() {
                    if (typeof initWebVitals === 'function') {
                      initWebVitals();
                    }
                    
                    // Register Service Worker
                    if ('serviceWorker' in navigator) {
                      navigator.serviceWorker.register('/sw.js')
                        .then(function(registration) {
                          console.log('SW registered:', registration.scope);
                        })
                        .catch(function(error) {
                          console.log('SW registration failed:', error);
                        });
                    }
                  });
                `,
              }}
            />
          </>
        )}

        {/* Schema.org structured data */}
        <EducationalOrganizationSchema />
        <WebSiteSchema />

        {/* SEO Meta Tags */}
        <link rel="canonical" href="https://zumenzu.com" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Zumenzu" />

        {/* Icons and Manifest */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* CSS Cache Control - Development Mode */}
        {process.env.NODE_ENV === "development" && (
          <>
            <meta
              httpEquiv="Cache-Control"
              content="no-cache, no-store, must-revalidate"
            />
            <meta httpEquiv="Pragma" content="no-cache" />
            <meta httpEquiv="Expires" content="0" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, viewport-fit=cover"
            />
          </>
        )}

        {/* Critical CSS for better performance */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* Critical CSS for above-the-fold content */
            body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
            .loading-skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: loading 1.5s infinite; }
            @keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
            /* Force style refresh in dev mode */
            ${process.env.NODE_ENV === "development" ? "html { --dev-cache-buster: " + Date.now() + "; }" : ""}
          `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-white text-slate-900 antialiased transition-colors duration-300 dark:bg-slate-900 dark:text-slate-100`}
      >
        <SessionProvider session={session}>
          <ThemeProvider defaultTheme="system" enableSystem>
            <AuthProvider>
              <MainNavigation />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </AuthProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
