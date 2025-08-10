"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  X,
  Clock,
  Trophy,
  Code,
  ArrowRight,
  HelpCircle,
  RefreshCw,
} from "lucide-react";

interface BlankItem {
  id: string;
  text: string;
  answer: string;
  hints?: string[];
  caseSensitive?: boolean;
}

interface Exercise {
  id: number;
  description: string;
  code: string;
  blanks: string[];
  expectedOutput?: string;
}

interface FillBlanksActivityProps {
  activity: {
    content: {
      instructions?: string;
      template?: string;
      blanks?: BlankItem[];
      exercises?: Exercise[];
      timeLimit?: number;
      allowHints?: boolean;
      showProgress?: boolean;
      codeLanguage?: string;
    };
  };
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function FillBlanksActivity({
  activity,
  onComplete,
}: FillBlanksActivityProps) {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(activity.content?.timeLimit || 600);
  const [showHints, setShowHints] = useState<{ [key: string]: boolean }>({});
  const [currentHintIndex, setCurrentHintIndex] = useState<{
    [key: string]: number;
  }>({});
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Handle both new and legacy data structures
  const exercises = activity.content?.exercises || [];
  const blanks = activity.content?.blanks || [];
  const template = activity.content?.template || "";

  // If we don't have the expected data structure, show error
  if (exercises.length === 0 && blanks.length === 0 && !template) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-8">
          <div className="mb-4 text-yellow-600">⚠️</div>
          <h3 className="mb-2 text-lg font-semibold text-yellow-900">
            Activity Data Not Available
          </h3>
          <p className="text-yellow-800">
            This fill-in-the-blanks activity doesn't have the required exercises
            configured.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isCompleted) {
      handleSubmit();
    }
  }, [timeLeft, isCompleted]);

  const checkAnswer = (blankId: string, userAnswer: string): boolean => {
    // Handle exercises-based structure
    if (exercises.length > 0) {
      const exerciseIndex = parseInt(blankId.split("_")[0]);
      const blankIndex = parseInt(blankId.split("_")[1]);
      const exercise = exercises[exerciseIndex];
      if (!exercise || !exercise.blanks[blankIndex]) return false;

      const correctAnswer = exercise.blanks[blankIndex];
      const answer = userAnswer.toLowerCase();
      const correct = correctAnswer.toLowerCase();

      return answer.trim() === correct.trim();
    }

    // Handle blanks-based structure
    const blank = blanks.find((b) => b.id === blankId);
    if (!blank) return false;

    const correctAnswer = blank.answer;
    const answer = blank.caseSensitive ? userAnswer : userAnswer.toLowerCase();
    const correct = blank.caseSensitive
      ? correctAnswer
      : correctAnswer.toLowerCase();

    return answer.trim() === correct.trim();
  };

  const handleAnswerChange = (blankId: string, value: string) => {
    setAnswers({
      ...answers,
      [blankId]: value,
    });
  };

  const toggleHint = (blankId: string) => {
    if (exercises.length > 0) return; // No hints for exercises structure

    const blank = blanks.find((b) => b.id === blankId);
    if (!blank?.hints || blank.hints.length === 0) return;

    if (!showHints[blankId]) {
      setShowHints({
        ...showHints,
        [blankId]: true,
      });
      setCurrentHintIndex({
        ...currentHintIndex,
        [blankId]: 0,
      });
    } else {
      const currentIndex = currentHintIndex[blankId] || 0;
      if (currentIndex < blank.hints.length - 1) {
        setCurrentHintIndex({
          ...currentHintIndex,
          [blankId]: currentIndex + 1,
        });
      } else {
        setShowHints({
          ...showHints,
          [blankId]: false,
        });
        setCurrentHintIndex({
          ...currentHintIndex,
          [blankId]: 0,
        });
      }
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setIsCompleted(true);

    let correctAnswers = 0;
    let totalBlanks = 0;

    if (exercises.length > 0) {
      exercises.forEach((exercise, exerciseIndex) => {
        exercise.blanks.forEach((blank, blankIndex) => {
          const blankId = `${exerciseIndex}_${blankIndex}`;
          if (checkAnswer(blankId, answers[blankId] || "")) {
            correctAnswers++;
          }
          totalBlanks++;
        });
      });
    } else {
      blanks.forEach((blank) => {
        if (checkAnswer(blank.id, answers[blank.id] || "")) {
          correctAnswers++;
        }
        totalBlanks++;
      });
    }

    const finalScore =
      totalBlanks > 0 ? Math.round((correctAnswers / totalBlanks) * 100) : 0;
    setScore(finalScore);

    onComplete(finalScore, 100, finalScore >= 70);
  };

  const resetActivity = () => {
    setAnswers({});
    setSubmitted(false);
    setIsCompleted(false);
    setShowHints({});
    setCurrentHintIndex({});
    setScore(0);
    setTimeLeft(activity.content?.timeLimit || 600);
  };

  const renderTemplate = () => {
    if (!template || blanks.length === 0) return "";

    let templateStr = template;

    blanks.forEach((blank) => {
      const placeholder = `{{${blank.id}}}`;
      const userAnswer = answers[blank.id] || "";
      const isCorrect = submitted ? checkAnswer(blank.id, userAnswer) : null;

      templateStr = templateStr.replace(placeholder, `__INPUT_${blank.id}__`);
    });

    // Split template and insert inputs
    const parts = templateStr.split(/(__INPUT_\w+__)/);
    return parts.map((part, index) => {
      const inputMatch = part.match(/__INPUT_(\w+)__/);
      if (inputMatch) {
        const blankId = inputMatch[1];
        const userAnswer = answers[blankId] || "";
        const isCorrect = submitted ? checkAnswer(blankId, userAnswer) : null;

        return (
          <span key={index} className="mx-1 inline-block">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => handleAnswerChange(blankId, e.target.value)}
              disabled={submitted}
              className={`inline-block min-w-[100px] rounded border-2 px-3 py-1 text-center font-mono ${
                submitted
                  ? isCorrect
                    ? "border-green-500 bg-green-50 text-green-800"
                    : "border-red-500 bg-red-50 text-red-800"
                  : "border-gray-300 focus:border-blue-500 focus:outline-none"
              }`}
              placeholder="fill here"
            />
            {activity.content?.allowHints && !submitted && (
              <button
                onClick={() => toggleHint(blankId)}
                className="ml-2 p-1 text-blue-500 transition-colors hover:text-blue-700"
                title="Get hint"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            )}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (isCompleted && submitted) {
    let correctCount = 0;
    let totalCount = 0;

    if (exercises.length > 0) {
      exercises.forEach((exercise, exerciseIndex) => {
        exercise.blanks.forEach((blank, blankIndex) => {
          const blankId = `${exerciseIndex}_${blankIndex}`;
          if (checkAnswer(blankId, answers[blankId] || "")) {
            correctCount++;
          }
          totalCount++;
        });
      });
    } else {
      blanks.forEach((blank) => {
        if (checkAnswer(blank.id, answers[blank.id] || "")) {
          correctCount++;
        }
        totalCount++;
      });
    }

    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <div className="mb-6">
          <Trophy className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Exercise Complete!
          </h2>
          <div className="mb-4 text-lg text-gray-600">
            You scored {score}% ({correctCount}/{totalCount} correct)
          </div>

          <div
            className={`mb-6 rounded-lg p-4 font-medium ${
              score >= 70
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {score >= 70
              ? "🎉 Excellent! You filled in the blanks correctly!"
              : "📚 Good try! Review the correct answers below."}
          </div>

          {/* Show correct answers */}
          <div className="mb-6 rounded-lg bg-gray-50 p-6 text-left">
            <h3 className="mb-4 text-lg font-semibold">Correct Answers:</h3>
            <div className="space-y-2">
              {exercises.length > 0
                ? exercises.map((exercise, exerciseIndex) => (
                    <div key={exerciseIndex} className="mb-4">
                      <h4 className="mb-2 font-medium text-gray-800">
                        {exercise.description}
                      </h4>
                      {exercise.blanks.map((blank, blankIndex) => (
                        <div
                          key={`${exerciseIndex}_${blankIndex}`}
                          className="ml-4 flex items-center justify-between"
                        >
                          <span className="font-mono text-sm">
                            Blank {blankIndex + 1}:
                          </span>
                          <span className="font-mono text-sm font-semibold text-green-600">
                            {blank}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))
                : blanks.map((blank) => (
                    <div
                      key={blank.id}
                      className="flex items-center justify-between"
                    >
                      <span className="font-mono text-sm">
                        Blank {blank.id}:
                      </span>
                      <span className="font-mono text-sm font-semibold text-green-600">
                        {blank.answer}
                      </span>
                    </div>
                  ))}
            </div>
          </div>
        </div>

        <button
          onClick={resetActivity}
          className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">
              Fill in the Blanks
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
            {activity.content?.showProgress && (
              <div className="text-sm">
                Progress:{" "}
                {
                  Object.keys(answers).filter(
                    (key) => answers[key].trim() !== ""
                  ).length
                }
                /
                {exercises.length > 0
                  ? exercises.reduce((sum, ex) => sum + ex.blanks.length, 0)
                  : blanks.length}
              </div>
            )}
          </div>
        </div>

        {activity.content?.instructions && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-blue-800">{activity.content.instructions}</p>
          </div>
        )}
      </div>

      {/* Exercises */}
      <div className="mb-6 space-y-6">
        {exercises.length > 0 ? (
          exercises.map((exercise, exerciseIndex) => (
            <div
              key={exerciseIndex}
              className="rounded-lg border border-gray-200 bg-white p-6"
            >
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                {exercise.description}
              </h3>

              <div className="mb-4 rounded-lg bg-gray-900 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex space-x-1">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm text-gray-400">Python</span>
                </div>

                <pre className="font-mono text-sm leading-relaxed text-green-400">
                  {exercise.code.split("____").map((part, partIndex) => (
                    <span key={partIndex}>
                      {part}
                      {partIndex < exercise.blanks.length && (
                        <input
                          type="text"
                          value={answers[`${exerciseIndex}_${partIndex}`] || ""}
                          onChange={(e) =>
                            handleAnswerChange(
                              `${exerciseIndex}_${partIndex}`,
                              e.target.value
                            )
                          }
                          disabled={submitted}
                          className={`mx-1 inline-block rounded border-2 px-2 py-1 text-center font-mono text-sm ${
                            submitted
                              ? checkAnswer(
                                  `${exerciseIndex}_${partIndex}`,
                                  answers[`${exerciseIndex}_${partIndex}`] || ""
                                )
                                ? "border-green-500 bg-green-100 text-green-800"
                                : "border-red-500 bg-red-100 text-red-800"
                              : "border-yellow-400 bg-yellow-100 text-gray-900 focus:border-yellow-500 focus:outline-none"
                          }`}
                          placeholder="?"
                          style={{ minWidth: "80px" }}
                        />
                      )}
                    </span>
                  ))}
                </pre>
              </div>

              {exercise.expectedOutput && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <span className="text-sm text-blue-800">
                    <strong>Expected Output:</strong> {exercise.expectedOutput}
                  </span>
                </div>
              )}
            </div>
          ))
        ) : template ? (
          <div className="mb-6 overflow-x-auto rounded-lg bg-gray-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex space-x-1">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              {activity.content?.codeLanguage && (
                <span className="text-sm font-medium text-gray-400">
                  {activity.content.codeLanguage}
                </span>
              )}
            </div>

            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-green-400">
              {renderTemplate()}
            </pre>
          </div>
        ) : null}
      </div>

      {/* Hints Display */}
      <AnimatePresence>
        {Object.keys(showHints).some((key) => showHints[key]) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            {Object.keys(showHints)
              .filter((key) => showHints[key])
              .map((blankId) => {
                const blank = blanks.find((b) => b.id === blankId);
                const hintIndex = currentHintIndex[blankId] || 0;
                if (!blank?.hints || blank.hints.length === 0) return null;

                return (
                  <div
                    key={blankId}
                    className="mb-2 rounded-lg border border-yellow-200 bg-yellow-50 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="mb-1 font-semibold text-yellow-900">
                          💡 Hint for Blank {blankId}:
                        </h4>
                        <p className="text-yellow-800">
                          {blank.hints[hintIndex]}
                        </p>
                      </div>
                      <div className="text-xs text-yellow-700">
                        {hintIndex + 1} of {blank.hints.length}
                      </div>
                    </div>
                  </div>
                );
              })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      {!submitted && (
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length === 0}
            className="inline-flex items-center space-x-2 rounded-lg bg-green-600 px-8 py-3 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            <CheckCircle className="h-5 w-5" />
            <span>Check Answers</span>
          </button>
        </div>
      )}
    </div>
  );
}
