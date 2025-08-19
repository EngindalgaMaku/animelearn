import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Wiki — Python Concepts & Guides",
  description:
    "Browse concise Python explanations, best practices, and examples. A quick reference for core concepts and patterns.",
  alternates: {
    canonical: "/wiki",
  },
  openGraph: {
    type: "website",
    url: "https://zumenzu.com/wiki",
    title: "Learning Wiki — Python Concepts & Guides",
    description:
      "Browse concise Python explanations, best practices, and examples. A quick reference for core concepts and patterns.",
    siteName: "Zumenzu",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zumenzu Learning Wiki",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Learning Wiki — Python Concepts & Guides",
    description:
      "Browse concise Python explanations, best practices, and examples. A quick reference for core concepts and patterns.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function WikiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
