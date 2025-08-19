import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diamond Store — Buy Diamonds & Upgrades",
  description:
    "Purchase diamonds securely to unlock cards, features, and upgrades. Transparent pricing and instant balance updates.",
  alternates: {
    canonical: "/store",
  },
  openGraph: {
    type: "website",
    url: "https://zumenzu.com/store",
    title: "Diamond Store — Buy Diamonds & Upgrades",
    description:
      "Purchase diamonds securely to unlock cards, features, and upgrades. Transparent pricing and instant balance updates.",
    siteName: "Zumenzu",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zumenzu Diamond Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Diamond Store — Buy Diamonds & Upgrades",
    description:
      "Purchase diamonds securely to unlock cards, features, and upgrades. Transparent pricing and instant balance updates.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
