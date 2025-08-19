import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Code Arena — Interactive Coding Challenges",
  description:
    "Practice Python with interactive, gamified challenges. Earn diamonds and XP as you solve algorithm problems and activities.",
  alternates: {
    canonical: "/code-arena",
  },
  openGraph: {
    type: "website",
    url: "https://zumenzu.com/code-arena",
    title: "Code Arena — Interactive Coding Challenges",
    description:
      "Practice Python with interactive, gamified challenges. Earn diamonds and XP as you solve algorithm problems and activities.",
    siteName: "Zumenzu",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zumenzu Code Arena",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Code Arena — Interactive Coding Challenges",
    description:
      "Practice Python with interactive, gamified challenges. Earn diamonds and XP as you solve algorithm problems and activities.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CodeArenaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
