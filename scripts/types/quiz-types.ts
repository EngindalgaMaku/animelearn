export interface QuizCategory {
  name: string;
  description?: string;
  color: string;
  icon?: string;
  sortOrder: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  category: string;
}