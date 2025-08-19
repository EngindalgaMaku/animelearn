// Fallback static lessons for /learn/[slug] when DB-lessons not yet seeded
// This ensures slug pages render instead of 404, improving SEO and UX.

export function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");
}

// Minimal preset content for known slugs (can be extended anytime)
const PRESETS: Record<
  string,
  { title: string; description: string; intro: string; category?: string }
> = {
  "python-basics-first-program": {
    title: "Python Basics & Your First Program",
    description:
      "Start your Python journey: what Python is, why it’s popular, and write your first Hello World.",
    intro: `# 🚀 Welcome to Python Programming!

Python is a beginner-friendly, powerful programming language used in web, data, AI and more.

## Your First Program

print("Hello, World!")

You’ll learn about variables, data types, and how to run code step-by-step.`,
    category: "Python Fundamentals",
  },
};

export function getFallbackLesson(slug: string): any {
  const now = new Date();
  const preset = PRESETS[slug];
  const title = preset?.title ?? slugToTitle(slug);
  const category = preset?.category ?? "General";
  const description =
    preset?.description ??
    `Auto-generated preview page for "${title}". This lesson will be available soon.`;
  const introduction =
    preset?.intro ??
    `# ${title}

This is a placeholder lesson rendered as a fallback. The full content will appear once lessons are seeded in the database.`;

  return {
    id: `fallback-${slug}`,
    title,
    slug,
    description,
    category,
    difficulty: "beginner",
    order: 1,
    estimatedTime: 20,
    diamondReward: 0,
    experienceReward: 0,
    content: {
      introduction,
      syntax: "",
      examples: "",
    },
    exercise: {
      id: `fallback-${slug}-exercise`,
      title: `${title} - Exercise`,
      description:
        "Practice area (demo). Complete content will appear once lessons are published.",
      starterCode: "# Write your code here\n",
      testCases: [],
      hints: [],
      difficulty: "easy",
    },
    quiz: {
      id: `fallback-${slug}-quiz`,
      title: `${title} - Quiz`,
      description: "Demo quiz (no questions configured for fallback).",
      questions: [],
      timeLimit: 10,
      passingScore: 50,
      diamondReward: 0,
      experienceReward: 0,
    },
    isCompleted: false,
    isStarted: false,
    progress: {
      startedAt: null,
      completedAt: null,
      lastVisit: now.toISOString(),
      timeSpent: 0,
      isCodeCorrect: false,
      lastCode: null,
      bestCode: null,
      score: null,
    },
    createdAt: now,
    updatedAt: now,
  };
}
