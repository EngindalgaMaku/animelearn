import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn Python — Interactive Lessons",
  description:
    "Step-by-step Python lessons with examples, challenges, and progress tracking.",
  alternates: {
    canonical: "/learn",
  },
  openGraph: {
    type: "website",
    url: "https://zumenzu.com/learn",
    title: "Learn Python — Interactive Lessons",
    description:
      "Step-by-step Python lessons with examples, challenges, and progress tracking.",
    siteName: "Zumenzu",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zumenzu - Learn Python",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Python — Interactive Lessons",
    description:
      "Step-by-step Python lessons with examples, challenges, and progress tracking.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
