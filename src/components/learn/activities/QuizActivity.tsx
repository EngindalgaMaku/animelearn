"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, Clock, Trophy, Brain, ArrowRight } from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizActivityProps {
  activity: {
    content: {
      instructions?: string;
      questions: QuizQuestion[];
      timeLimit?: number;
      randomizeQuestions?: boolean;
      showExplanations?: boolean;
    };
  };
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function QuizActivity({
  activity,
  onComplete,
}: QuizActivityProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(activity?.content?.timeLimit || 300);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  // Validate activity data
  if (!activity?.content) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-lg font-semibold text-red-500">
          Invalid Activity Data
        </div>
        <p className="text-gray-600">
          This quiz doesn't have the required content configuration.
        </p>
      </div>
    );
  }

  const contentQuestions = activity.content.questions || [];

  if (contentQuestions.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-lg font-semibold text-red-500">
          No Questions Available
        </div>
        <p className="text-gray-600">
          This quiz doesn't have any questions to display.
        </p>
      </div>
    );
  }

  useEffect(() => {
    try {
      const shuffledQuestions = activity?.content?.randomizeQuestions
        ? [...contentQuestions].sort(() => Math.random() - 0.5)
        : contentQuestions;
      setQuestions(shuffledQuestions);
    } catch (error) {
      console.error("Error initializing quiz:", error);
    }
  }, [activity]);

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isCompleted) {
      handleQuizComplete();
    }
  }, [timeLeft, isCompleted]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;

    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answerIndex,
    });

    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    setShowExplanation(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleQuizComplete();
    }
  };

  const handleQuizComplete = () => {
    try {
      setIsCompleted(true);

      let correctAnswers = 0;
      questions.forEach((question, index) => {
        if (
          question?.correct !== undefined &&
          selectedAnswers[index] === question.correct
        ) {
          correctAnswers++;
        }
      });

      const finalScore =
        questions.length > 0
          ? Math.round((correctAnswers / questions.length) * 100)
          : 0;
      setScore(finalScore);

      onComplete(finalScore, 100, finalScore >= 70);
    } catch (error) {
      console.error("Error completing quiz:", error);
      onComplete(0, 100, false);
    }
  };

  const resetQuiz = () => {
    try {
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowExplanation(false);
      setIsCompleted(false);
      setScore(0);
      setTimeLeft(activity?.content?.timeLimit || 300);
    } catch (error) {
      console.error("Error resetting quiz:", error);
    }
  };

  if (!currentQuestion && !isCompleted) {
    return <div className="p-8 text-center">Loading quiz...</div>;
  }

  if (isCompleted) {
    const correctCount = Object.keys(selectedAnswers).filter((qIndex) => {
      const questionIndex = parseInt(qIndex);
      const question = questions[questionIndex];
      return (
        question?.correct !== undefined &&
        selectedAnswers[questionIndex] === question.correct
      );
    }).length;

    return (
      <div className="mx-auto max-w-2xl p-6 text-center">
        <div className="mb-6">
          <Trophy className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Quiz Complete!
          </h2>
          <div className="mb-4 text-lg text-gray-600">
            You scored {score}% ({correctCount}/{questions.length} correct)
          </div>

          <div
            className={`mb-6 rounded-lg p-4 font-medium ${
              score >= 70
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {score >= 70
              ? "🎉 Excellent work! You passed the quiz!"
              : "📚 Good effort! Review the material and try again."}
          </div>
        </div>

        <button
          onClick={resetQuiz}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Take Quiz Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>
                {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
            {score > 0 && (
              <div className="flex items-center space-x-1">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span>Score: {score}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-6 text-xl font-bold text-gray-900">
          {currentQuestion?.question || "Question not available"}
        </h3>

        {/* Answer Options */}
        <div className="space-y-3">
          {(currentQuestion?.options || []).map((option, index) => {
            const isSelected = selectedAnswers[currentQuestionIndex] === index;
            const isCorrect = index === currentQuestion.correct;
            const shouldShowResult = showExplanation;

            return (
              <motion.button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                  shouldShowResult
                    ? isCorrect
                      ? "border-green-500 bg-green-50 text-green-800"
                      : isSelected
                        ? "border-red-500 bg-red-50 text-red-800"
                        : "border-gray-200 bg-gray-50 text-gray-600"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                }`}
                whileHover={!showExplanation ? { scale: 1.01 } : {}}
                whileTap={!showExplanation ? { scale: 0.99 } : {}}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        shouldShowResult
                          ? isCorrect
                            ? "bg-green-500 text-white"
                            : isSelected
                              ? "bg-red-500 text-white"
                              : "bg-gray-300 text-gray-600"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>

                  {shouldShowResult && (
                    <div className="flex-shrink-0">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : isSelected ? (
                        <X className="h-5 w-5 text-red-500" />
                      ) : null}
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {showExplanation &&
          activity?.content?.showExplanations &&
          currentQuestion?.explanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4"
            >
              <h4 className="mb-2 font-semibold text-blue-900">
                💡 Explanation:
              </h4>
              <p className="text-blue-800">{currentQuestion.explanation}</p>
            </motion.div>
          )}
      </AnimatePresence>

      {/* Next Button */}
      {showExplanation && (
        <div className="text-center">
          <button
            onClick={handleNextQuestion}
            className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <span>
              {currentQuestionIndex < questions.length - 1
                ? "Next Question"
                : "Finish Quiz"}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
