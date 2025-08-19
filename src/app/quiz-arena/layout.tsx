import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz Arena — Python Quiz Challenges",
  description:
    "Compete in time-based Python quizzes, build streaks, and earn diamonds and XP. Instant feedback with explanations.",
  alternates: {
    canonical: "/quiz-arena",
  },
  openGraph: {
    type: "website",
    url: "https://zumenzu.com/quiz-arena",
    title: "Quiz Arena — Python Quiz Challenges",
    description:
      "Compete in time-based Python quizzes, build streaks, and earn diamonds and XP. Instant feedback with explanations.",
    siteName: "Zumenzu",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zumenzu Quiz Arena",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quiz Arena — Python Quiz Challenges",
    description:
      "Compete in time-based Python quizzes, build streaks, and earn diamonds and XP. Instant feedback with explanations.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function QuizArenaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
