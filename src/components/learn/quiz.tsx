"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Award,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple_choice" | "true_false";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  diamondReward: number;
  experienceReward: number;
}

interface QuizComponentProps {
  quiz: Quiz;
  lessonId: string;
  onQuizComplete: (
    score: number,
    passed: boolean,
    rewards: { diamonds: number; experience: number }
  ) => void;
}

export default function QuizComponent({
  quiz,
  lessonId,
  onQuizComplete,
}: QuizComponentProps) {
  // All hooks must be called before any conditional logic or early returns
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const normalizeTimeLimit = (limit?: number) => {
    const raw = typeof limit === "number" && !Number.isNaN(limit) ? limit : 600; // default 600s (10 min)
    // Heuristic: values > 120 are seconds; small numbers are minutes
    return raw > 120 ? raw : raw * 60;
  };

  const [timeLeft, setTimeLeft] = useState(normalizeTimeLimit(quiz?.timeLimit));
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
  const [results, setResults] = useState<{
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    passed: boolean;
    timeSpent: number;
  } | null>(null);

  const quizStorageKey = `quiz_${quiz?.id || "default"}_${lessonId}`;

  // Load quiz state from localStorage on component mount
  useEffect(() => {
    if (!quiz || !quiz.questions) return;

    const savedQuizState = localStorage.getItem(quizStorageKey);
    if (savedQuizState) {
      try {
        const parsedState = JSON.parse(savedQuizState);
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - parsedState.startTime) / 1000);
        const totalSeconds = normalizeTimeLimit(quiz.timeLimit);
        const remainingTime = Math.max(0, totalSeconds - elapsedSeconds);

        if (remainingTime > 0 && !parsedState.completed) {
          setQuizStarted(true);
          setCurrentQuestion(parsedState.currentQuestion || 0);
          setAnswers(parsedState.answers || {});
          setTimeLeft(remainingTime);
          setQuizStartTime(parsedState.startTime);
          setQuizCompleted(false);
          setShowResults(false);
        } else if (parsedState.completed) {
          // Quiz was already completed
          setQuizCompleted(true);
          setShowResults(true);
          if (parsedState.results) {
            setResults(parsedState.results);
          }
        } else {
          // Time expired, clean up
          localStorage.removeItem(quizStorageKey);
        }
      } catch (error) {
        console.error("Error loading quiz state:", error);
        localStorage.removeItem(quizStorageKey);
      }
    }
  }, [quiz?.id, lessonId, quiz?.timeLimit, quizStorageKey]);

  // Save quiz state to localStorage whenever it changes
  useEffect(() => {
    if (quizStarted && quizStartTime && !quizCompleted) {
      const quizState = {
        startTime: quizStartTime,
        currentQuestion,
        answers,
        timeLeft,
        completed: false,
      };
      localStorage.setItem(quizStorageKey, JSON.stringify(quizState));
    }
  }, [
    quizStarted,
    quizStartTime,
    currentQuestion,
    answers,
    timeLeft,
    quizCompleted,
    quizStorageKey,
  ]);

  // Define handleSubmitQuiz with useCallback to avoid React Hooks dependency issues
  const handleSubmitQuiz = useCallback(async () => {
    if (!quiz || !quiz.questions) return;

    const actualTimeSpent = quizStartTime
      ? Math.floor((Date.now() - quizStartTime) / 1000)
      : (quiz.timeLimit || 10) * 60 - timeLeft;

    // Calculate score
    let correctAnswers = 0;
    quiz.questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const passed = score >= (quiz.passingScore || 50);

    const quizResults = {
      score,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      passed,
      timeSpent: actualTimeSpent,
    };

    setResults(quizResults);
    setQuizCompleted(true);
    setShowResults(true);

    // Save completed quiz state
    const completedState = {
      startTime: quizStartTime,
      currentQuestion,
      answers,
      timeLeft: 0,
      completed: true,
      results: quizResults,
    };
    localStorage.setItem(quizStorageKey, JSON.stringify(completedState));

    // Submit to API (server computes rewards and ensures idempotency)
    try {
      const response = await fetch(`/api/lessons/${lessonId}/quiz-complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          score,
          passingScore: quiz.passingScore,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        onQuizComplete(
          score,
          typeof result.passed === "boolean" ? result.passed : passed,
          result.rewards || { diamonds: 0, experience: 0 }
        );
      } else {
        // Fallback: no rewards on failure
        onQuizComplete(score, passed, { diamonds: 0, experience: 0 });
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      onQuizComplete(score, passed, { diamonds: 0, experience: 0 });
    }
  }, [
    quiz,
    quizStartTime,
    timeLeft,
    answers,
    currentQuestion,
    quizStorageKey,
    lessonId,
    onQuizComplete,
  ]);

  // Handle page visibility changes (tab switching)
  useEffect(() => {
    if (!quiz) return;

    const handleVisibilityChange = () => {
      if (quizStarted && !quizCompleted && quizStartTime) {
        if (document.visibilityState === "visible") {
          // Tab became visible, recalculate time
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - quizStartTime) / 1000);
          const totalSeconds = normalizeTimeLimit(quiz.timeLimit);
          const remainingTime = Math.max(0, totalSeconds - elapsedSeconds);
          setTimeLeft(remainingTime);

          if (remainingTime === 0) {
            handleSubmitQuiz();
          }
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    quizStarted,
    quizCompleted,
    quizStartTime,
    quiz?.timeLimit,
    handleSubmitQuiz,
  ]);

  // Timer countdown - now uses real elapsed time
  useEffect(() => {
    if (
      !quiz ||
      !quizStarted ||
      quizCompleted ||
      !quizStartTime ||
      timeLeft <= 0
    )
      return;

    const timer = setTimeout(() => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - quizStartTime) / 1000);
      const totalSeconds = normalizeTimeLimit(quiz.timeLimit);
      const remainingTime = Math.max(0, totalSeconds - elapsedSeconds);
      setTimeLeft(remainingTime);

      if (remainingTime === 0) {
        handleSubmitQuiz();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [
    timeLeft,
    quizStarted,
    quizCompleted,
    quizStartTime,
    quiz?.timeLimit,
    handleSubmitQuiz,
  ]);

  // Safety check for quiz object and questions - now after all hooks
  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Award className="h-8 w-8 text-gray-500" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-600">
            Quiz Not Available
          </h2>
          <p className="text-gray-500">
            This lesson doesn't have a quiz yet. Please check back later!
          </p>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startQuiz = () => {
    if (!quiz || !quiz.questions) return;

    const now = Date.now();
    const timeLimitSeconds = normalizeTimeLimit(quiz.timeLimit);
    setQuizStarted(true);
    setAnswers({});
    setCurrentQuestion(0);
    setTimeLeft(timeLimitSeconds);
    setQuizCompleted(false);
    setShowResults(false);
    setResults(null);
    setQuizStartTime(now);

    // Save initial quiz state
    const initialState = {
      startTime: now,
      currentQuestion: 0,
      answers: {},
      timeLeft: timeLimitSeconds,
      completed: false,
    };
    localStorage.setItem(quizStorageKey, JSON.stringify(initialState));
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const goToNextQuestion = () => {
    if (quiz && quiz.questions && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQ = quiz?.questions?.[currentQuestion];
  const progress = quiz?.questions
    ? ((currentQuestion + 1) / quiz.questions.length) * 100
    : 0;

  // Safety check for currentQ
  if (!currentQ) {
    return (
      <div className="rounded-lg border bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Award className="h-8 w-8 text-gray-500" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-600">
            Question Not Found
          </h2>
          <p className="text-gray-500">
            There seems to be an issue with this question. Please try again
            later.
          </p>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="rounded-lg border bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
            <Award className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold">{quiz?.title || "Quiz"}</h2>
          <p className="mb-6 text-gray-600">
            {quiz?.description || "Test your knowledge!"}
          </p>

          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="text-2xl font-bold text-blue-600">
                {quiz?.questions?.length || 0}
              </div>
              <div className="text-sm text-blue-600">Questions</div>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(normalizeTimeLimit(quiz?.timeLimit) / 60)}
              </div>
              <div className="text-sm text-green-600">Minutes</div>
            </div>
            <div className="rounded-lg bg-purple-50 p-4">
              <div className="text-2xl font-bold text-purple-600">
                {quiz?.passingScore || 50}%
              </div>
              <div className="text-sm text-purple-600">Pass Score</div>
            </div>
            <div className="rounded-lg bg-yellow-50 p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {quiz?.diamondReward || 0}
              </div>
              <div className="text-sm text-yellow-600">Diamonds</div>
            </div>
          </div>

          <button
            onClick={startQuiz}
            className="mx-auto flex items-center gap-2 rounded-lg bg-yellow-600 px-8 py-3 font-medium text-white hover:bg-yellow-700"
          >
            <Award className="h-5 w-5" />
            <span>Start Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="rounded-lg border bg-white p-8 shadow-sm">
        <div className="text-center">
          <div
            className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${
              results.passed ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {results.passed ? (
              <CheckCircle className="h-10 w-10 text-green-600" />
            ) : (
              <XCircle className="h-10 w-10 text-red-600" />
            )}
          </div>

          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            {results.passed ? "🎉 Quiz Passed!" : "Quiz Completed"}
          </h2>

          <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="text-2xl font-bold text-blue-600">
                {results.score}%
              </div>
              <div className="text-sm text-blue-600">Score</div>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <div className="text-2xl font-bold text-green-600">
                {results.correctAnswers}/{results.totalQuestions}
              </div>
              <div className="text-sm text-green-600">Correct</div>
            </div>
            <div className="rounded-lg bg-purple-50 p-4">
              <div className="text-2xl font-bold text-purple-600">
                {Math.floor(results.timeSpent / 60)}m {results.timeSpent % 60}s
              </div>
              <div className="text-sm text-purple-600">Time</div>
            </div>
            <div className="rounded-lg bg-yellow-50 p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {results.passed ? quiz?.diamondReward || 0 : 0}
              </div>
              <div className="text-sm text-yellow-600">Diamonds</div>
            </div>
          </div>

          {!results.passed && (
            <div className="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-4">
              <p className="text-orange-800">
                You need {quiz?.passingScore || 50}% to pass. Keep studying and
                try again!
              </p>
            </div>
          )}

          <button
            onClick={() => {
              // Clear stored quiz state for retake
              localStorage.removeItem(quizStorageKey);
              startQuiz();
            }}
            className="mx-auto flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
          >
            <RotateCcw className="h-5 w-5" />
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      {/* Quiz Header */}
      <div className="border-b bg-gray-50 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {quiz?.title || "Quiz"}
          </h2>
          <div className="flex items-center gap-2 font-mono text-lg">
            <Clock className="h-5 w-5 text-red-500" />
            <span className={timeLeft < 60 ? "text-red-500" : "text-gray-700"}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="mb-1 flex justify-between text-sm text-gray-600">
            <span>
              Question {currentQuestion + 1} of {quiz?.questions?.length || 0}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="p-6">
        <div className="mb-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            {currentQ?.question || "Question not available"}
          </h3>

          <div className="space-y-3">
            {currentQ?.type === "multiple_choice" && currentQ?.options ? (
              currentQ.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex cursor-pointer items-center rounded-lg border bg-white p-4 transition-colors ${
                    answers[currentQ.id] === option
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-300"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  } text-gray-900`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={option}
                    checked={answers[currentQ.id] === option}
                    onChange={(e) =>
                      handleAnswerSelect(currentQ.id, e.target.value)
                    }
                    className="mr-3"
                  />
                  <span className="text-gray-900">{option}</span>
                </label>
              ))
            ) : (
              // True/False questions
              <div className="space-y-3">
                <label
                  className={`flex cursor-pointer items-center rounded-lg border bg-white p-4 transition-colors ${
                    answers[currentQ.id] === "true"
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-300"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  } text-gray-900`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value="true"
                    checked={answers[currentQ.id] === "true"}
                    onChange={(e) =>
                      handleAnswerSelect(currentQ.id, e.target.value)
                    }
                    className="mr-3"
                  />
                  <span className="text-gray-900">True</span>
                </label>
                <label
                  className={`flex cursor-pointer items-center rounded-lg border bg-white p-4 transition-colors ${
                    answers[currentQ.id] === "false"
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-300"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  } text-gray-900`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value="false"
                    checked={answers[currentQ.id] === "false"}
                    onChange={(e) =>
                      handleAnswerSelect(currentQ.id, e.target.value)
                    }
                    className="mr-3"
                  />
                  <span className="text-gray-900">False</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestion === 0}
            className="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <div className="flex gap-2">
            {currentQuestion === (quiz?.questions?.length || 1) - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={!answers[currentQ?.id || ""]}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit Quiz
                <CheckCircle className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={goToNextQuestion}
                disabled={!answers[currentQ?.id || ""]}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
