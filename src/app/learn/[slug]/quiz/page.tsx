"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import QuizComponent from "@/components/learn/quiz";

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: {
    id: string;
    question: string;
    type: "multiple_choice" | "true_false";
    options?: string[];
    correctAnswer: string;
    explanation: string;
    points: number;
  }[];
  timeLimit: number;
  passingScore: number;
  diamondReward: number;
  experienceReward: number;
}

interface Lesson {
  id: string;
  title: string;
  slug: string;
  quiz: Quiz;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  // Show notification
  const showNotification = (
    type: "success" | "error" | "warning",
    message: string
  ) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Fetch lesson and quiz data
  useEffect(() => {
    const fetchLessonQuiz = async () => {
      try {
        const response = await fetch(`/api/lessons/${params.slug}`);
        if (response.ok) {
          const data = await response.json();
          setLesson(data.lesson);
        } else {
          showNotification("error", "Failed to load quiz");
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
        showNotification("error", "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchLessonQuiz();
    }
  }, [params.slug]);

  const handleQuizComplete = (
    score: number,
    passed: boolean,
    rewards: { diamonds: number; experience: number }
  ) => {
    if (passed) {
      showNotification(
        "success",
        `🎉 Quiz passed with ${score}%! +${rewards.diamonds} diamonds, +${rewards.experience} XP`
      );
      // Auto-redirect to lesson after 3 seconds
      setTimeout(() => {
        router.push(`/learn/${params.slug}`);
      }, 3000);
    } else {
      showNotification(
        "warning",
        `Quiz completed with ${score}%. You need to pass to earn rewards.`
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!lesson || !lesson.quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <BookOpen className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h1 className="mb-2 text-2xl font-bold text-gray-800">
            Quiz Not Available
          </h1>
          <p className="mb-4 text-gray-600">
            This lesson doesn't have a quiz yet.
          </p>
          <button
            onClick={() => router.push(`/learn/${params.slug}`)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Lesson
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed right-4 top-4 z-50 rounded-lg p-4 shadow-lg ${
            notification.type === "success"
              ? "border border-green-200 bg-green-100 text-green-800"
              : notification.type === "error"
                ? "border border-red-200 bg-red-100 text-red-800"
                : "border border-yellow-200 bg-yellow-100 text-yellow-800"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/learn/${params.slug}`)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Lesson
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">
                {lesson.title} - Quiz
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <QuizComponent
          quiz={lesson.quiz}
          lessonId={lesson.slug}
          onQuizComplete={handleQuizComplete}
        />
      </div>
    </div>
  );
}
