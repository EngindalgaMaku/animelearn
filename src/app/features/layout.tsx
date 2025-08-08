import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zumenzu Platform Features - Python Learning & Anime Cards",
  description:
    "Discover Zumenzu's unique features: Interactive Python lessons, anime card collection, achievement system, daily quests and gamification hub. The world's most advanced Python learning platform.",
  keywords: [
    "zumenzu features",
    "python learning platform",
    "interactive python lessons",
    "anime card collection",
    "python gamification",
    "achievement system",
    "daily python quests",
    "python lesson platform",
    "online python education",
    "coding learning game",
    "python learning app",
    "programming education",
    "python course",
    "python learning system",
    "coding gamification",
  ],
  openGraph: {
    title: "Zumenzu Platform Features - Python Learning & Anime Cards",
    description:
      "Discover Zumenzu's unique features: Interactive Python lessons, anime card collection, achievement system, daily quests and gamification hub.",
    url: "https://zumenzu.com/features",
    type: "website",
    images: [
      {
        url: "/og-features.jpg",
        width: 1200,
        height: 630,
        alt: "Zumenzu Platform Features - Interactive Python Learning & Anime Cards",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Zumenzu Platform Features - Interactive Python Learning & Anime Cards",
    description:
      "Discover Zumenzu's unique features: Interactive Python lessons, anime card collection, achievement system, daily quests, and comprehensive gamification hub.",
    images: ["/twitter-features.jpg"],
  },
  alternates: {
    canonical: "https://zumenzu.com/features",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const featuresStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Zumenzu Platform Features",
    description: "Discover all features of Zumenzu Python learning platform",
    url: "https://zumenzu.com/features",
    mainEntity: {
      "@type": "SoftwareApplication",
      name: "Zumenzu",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "TRY",
      },
      featureList: [
        "Interactive Python Lessons",
        "Anime Card Collection",
        "Achievement and Badge System",
        "Daily Quests",
        "Gamification Hub",
        "XP and Level System",
        "Real-time Code Editor",
        "Mobile Responsive Design",
      ],
      screenshot: "https://zumenzu.com/screenshots/features.jpg",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(featuresStructuredData),
        }}
      />
      {children}
    </>
  );
}
