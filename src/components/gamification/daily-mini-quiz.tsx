"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Diamond,
  Star,
  Trophy,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer?: number;
  explanation?: string;
  userAnswer?: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  date: string;
  diamondReward: number;
  experienceReward: number;
  questions: Question[];
  totalQuestions: number;
}

interface QuizAttempt {
  id: string;
  score: number;
  timeSpent: number;
  diamondsEarned: number;
  experienceEarned: number;
  completedAt: string;
}

interface DailyMiniQuizProps {
  className?: string;
}

const DailyMiniQuiz: React.FC<DailyMiniQuizProps> = ({ className = "" }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [userAttempt, setUserAttempt] = useState<QuizAttempt | null>(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quiz çözme durumu
  const [isActive, setIsActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeStarted, setTimeStarted] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const QUIZ_TIME_LIMIT = 300; // 5 dakika

  useEffect(() => {
    fetchTodayQuiz();
  }, []);

  // Timer effect
  useEffect(() => {
    if (isActive && timeStarted && !showResults) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - timeStarted) / 1000);
        const remaining = Math.max(0, QUIZ_TIME_LIMIT - elapsed);
        setTimeLeft(remaining);

        if (remaining === 0) {
          handleSubmitQuiz();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isActive, timeStarted, showResults]);

  const fetchTodayQuiz = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/daily-mini-quiz");
      const data = await response.json();

      if (data.success) {
        setQuiz(data.quiz);
        setCompleted(data.completed);
        if (data.completed && data.userAttempt) {
          setUserAttempt(data.userAttempt);
          setShowResults(true);
        }
      } else {
        setError(data.error || "Error loading quiz");
      }
    } catch (err) {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setIsActive(true);
    setTimeStarted(Date.now());
    setTimeLeft(QUIZ_TIME_LIMIT);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const selectAnswer = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;

    try {
      const timeSpent = timeStarted
        ? Math.floor((Date.now() - timeStarted) / 1000)
        : 0;

      const response = await fetch("/api/daily-mini-quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
          answers,
          timeSpent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.results);
        setUserAttempt(data.attempt);
        setShowResults(true);
        setIsActive(false);
      } else {
        setError(data.error || "Quiz gönderilirken hata oluştu");
      }
    } catch (err) {
      setError("Bağlantı hatası");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return "text-green-600";
    if (difficulty <= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 2) return "Kolay";
    if (difficulty <= 3) return "Orta";
    return "Zor";
  };

  if (loading) {
    return (
      <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
        <div className="animate-pulse">
          <div className="mb-4 h-4 w-3/4 rounded bg-gray-200"></div>
          <div className="mb-6 h-3 w-1/2 rounded bg-gray-200"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 rounded bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
        <div className="text-center">
          <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Hata</h3>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={fetchTodayQuiz}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
        <div className="text-center">
          <Clock className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            Quiz Bulunamadı
          </h3>
          <p className="text-gray-600">Bugün için aktif quiz bulunmuyor.</p>
        </div>
      </div>
    );
  }

  // Quiz tamamlanmışsa sonuçları göster
  if (completed && showResults) {
    return (
      <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
        <div className="mb-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
          >
            <CheckCircle className="h-8 w-8 text-green-600" />
          </motion.div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Quiz Tamamlandı!
          </h2>
          <p className="text-gray-600">{quiz.title}</p>
        </div>

        {userAttempt && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4"
          >
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {userAttempt.score}%
                </div>
                <div className="text-sm text-gray-600">Skor</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatTime(userAttempt.timeSpent)}
                </div>
                <div className="text-sm text-gray-600">Süre</div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-amber-50 p-4 text-center">
            <Diamond className="mx-auto mb-2 h-6 w-6 text-amber-600" />
            <div className="text-lg font-semibold text-amber-700">
              +{userAttempt?.diamondsEarned || 0}
            </div>
            <div className="text-sm text-amber-600">Diamond</div>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <Star className="mx-auto mb-2 h-6 w-6 text-blue-600" />
            <div className="text-lg font-semibold text-blue-700">
              +{userAttempt?.experienceEarned || 0}
            </div>
            <div className="text-sm text-blue-600">XP</div>
          </div>
        </div>

        {results && (
          <div className="space-y-4">
            <h3 className="mb-3 font-semibold text-gray-900">
              Soru Detayları:
            </h3>
            {results.map((result, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-lg border-l-4 p-4 ${
                  result.isCorrect
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50"
                }`}
              >
                <div className="mb-2 flex items-start justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {result.question}
                  </p>
                  {result.isCorrect ? (
                    <CheckCircle className="ml-2 h-5 w-5 flex-shrink-0 text-green-600" />
                  ) : (
                    <XCircle className="ml-2 h-5 w-5 flex-shrink-0 text-red-600" />
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Doğru cevap:</span>{" "}
                  {result.correctAnswer}
                </div>
                {result.explanation && (
                  <div className="mt-2 text-sm text-gray-500">
                    <span className="font-medium">Açıklama:</span>{" "}
                    {result.explanation}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Quiz başlamadan önce
  if (!isActive) {
    return (
      <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <Trophy className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Günlük Mini Quiz
          </h2>
          <p className="text-gray-600">{quiz.title}</p>
        </div>

        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Kategori:</span>
              <span className="ml-2 font-medium">{quiz.category}</span>
            </div>
            <div>
              <span className="text-gray-600">Zorluk:</span>
              <span
                className={`ml-2 font-medium ${getDifficultyColor(quiz.difficulty)}`}
              >
                {getDifficultyLabel(quiz.difficulty)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Soru Sayısı:</span>
              <span className="ml-2 font-medium">{quiz.totalQuestions}</span>
            </div>
            <div>
              <span className="text-gray-600">Süre:</span>
              <span className="ml-2 font-medium">
                {formatTime(QUIZ_TIME_LIMIT)}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-amber-50 p-4 text-center">
            <Diamond className="mx-auto mb-2 h-6 w-6 text-amber-600" />
            <div className="text-lg font-semibold text-amber-700">
              +{quiz.diamondReward}
            </div>
            <div className="text-sm text-amber-600">Diamond</div>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 text-center">
            <Star className="mx-auto mb-2 h-6 w-6 text-blue-600" />
            <div className="text-lg font-semibold text-blue-700">
              +{quiz.experienceReward}
            </div>
            <div className="text-sm text-blue-600">XP</div>
          </div>
        </div>

        <button
          onClick={startQuiz}
          className="w-full transform rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:from-blue-700 hover:to-purple-700"
        >
          Quiz'i Başlat
        </button>
      </div>
    );
  }

  // Quiz aktifken
  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Soru {currentQuestion + 1} / {quiz.questions.length}
          </h2>
          <p className="text-sm text-gray-600">{quiz.title}</p>
        </div>
        <div className="text-right">
          <div
            className={`text-lg font-bold ${timeLeft < 60 ? "text-red-600" : "text-blue-600"}`}
          >
            <Clock className="mr-1 inline h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 h-2 w-full rounded-full bg-gray-200">
        <motion.div
          className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              {currentQ.question}
            </h3>

            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => selectAnswer(currentQ.id, index)}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                    answers[currentQ.id] === index
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center">
                    <div
                      className={`mr-3 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                        answers[currentQ.id] === index
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {answers[currentQ.id] === index && (
                        <div className="h-3 w-3 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-gray-900">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          className={`rounded-lg px-4 py-2 font-medium transition-colors ${
            currentQuestion === 0
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Önceki
        </button>

        <div className="text-sm text-gray-600">
          {Object.keys(answers).length} / {quiz.questions.length} cevaplandı
        </div>

        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmitQuiz}
            disabled={Object.keys(answers).length < quiz.questions.length}
            className={`rounded-lg px-6 py-2 font-medium transition-colors ${
              Object.keys(answers).length < quiz.questions.length
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Quiz'i Bitir
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Sonraki
          </button>
        )}
      </div>
    </div>
  );
};

export default DailyMiniQuiz;
