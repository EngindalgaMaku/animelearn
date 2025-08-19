import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Card Shop — Buy Anime, Star, and Supercar Cards",
  description:
    "Browse and buy exclusive cards using diamonds. Filter by rarity, element, and collection categories like Anime, Stars, and Supercars.",
  alternates: {
    canonical: "/shop",
  },
  openGraph: {
    type: "website",
    url: "https://zumenzu.com/shop",
    title: "Card Shop — Buy Anime, Star, and Supercar Cards",
    description:
      "Browse and buy exclusive cards using diamonds. Filter by rarity, element, and collection categories like Anime, Stars, and Supercars.",
    siteName: "Zumenzu",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zumenzu Card Shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Card Shop — Buy Anime, Star, and Supercar Cards",
    description:
      "Browse and buy exclusive cards using diamonds. Filter by rarity, element, and collection categories like Anime, Stars, and Supercars.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
