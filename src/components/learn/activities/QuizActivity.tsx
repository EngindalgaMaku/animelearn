"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Trophy, RefreshCw } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizContent {
  questions: Question[];
  passingScore: number;
  timeLimit: number;
}

interface LearningActivity {
  id: string;
  title: string;
  description: string;
  content: QuizContent;
}

interface QuizActivityProps {
  activity: LearningActivity;
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function QuizActivity({
  activity,
  onComplete,
}: QuizActivityProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(activity.content.timeLimit);
  const [quizStarted, setQuizStarted] = useState(false);

  const { questions, passingScore, timeLimit } = activity.content;

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleSubmitQuiz();
    }
  }, [timeLeft, quizStarted, showResults]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    const correctAnswers = selectedAnswers.filter(
      (answer, index) => answer === questions[index]?.correct
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const success = score >= passingScore;
    onComplete(score, 100, success);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setTimeLeft(timeLimit);
    setQuizStarted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!quizStarted) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            {activity.title}
          </h2>
          <p className="mb-8 text-lg text-gray-600">{activity.description}</p>

          <div className="mb-8 rounded-lg bg-blue-50 p-6">
            <h3 className="mb-4 text-xl font-semibold text-blue-900">
              Quiz Information
            </h3>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
              <div className="flex items-center justify-center space-x-2">
                <Trophy className="h-5 w-5 text-blue-600" />
                <span>{questions.length} Questions</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>{formatTime(timeLimit)} Time Limit</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span>{passingScore}% to Pass</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setQuizStarted(true)}
            className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-blue-700"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const correctAnswers = selectedAnswers.filter(
      (answer, index) => answer === questions[index]?.correct
    ).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const passed = score >= passingScore;

    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="text-center">
          <div
            className={`mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full ${
              passed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
            {passed ? (
              <Trophy className="h-10 w-10" />
            ) : (
              <XCircle className="h-10 w-10" />
            )}
          </div>

          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            {passed ? "Congratulations!" : "Keep Trying!"}
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            You scored {correctAnswers} out of {questions.length} questions
            correctly
          </p>

          <div className="mb-8 rounded-lg bg-gray-50 p-6">
            <div className="mb-2 text-4xl font-bold text-gray-900">
              {score}%
            </div>
            <div
              className={`text-lg font-semibold ${passed ? "text-green-600" : "text-red-600"}`}
            >
              {passed
                ? `Passed (${passingScore}% required)`
                : `Failed (${passingScore}% required)`}
            </div>
          </div>

          <div className="mb-8 space-y-4">
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correct;

              return (
                <div
                  key={index}
                  className="rounded-lg border bg-white p-4 text-left"
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                        isCorrect ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-semibold text-gray-900">
                        {question.question}
                      </h4>
                      <div className="mb-2 space-y-1">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`rounded p-2 text-sm ${
                              optionIndex === question.correct
                                ? "bg-green-100 font-semibold text-green-800"
                                : optionIndex === userAnswer && !isCorrect
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm italic text-gray-600">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={restartQuiz}
            className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-700"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Restart Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{activity.title}</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-blue-600">
            <Clock className="h-5 w-5" />
            <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-6 text-xl font-semibold text-gray-900">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                selectedAnswers[currentQuestion] === index
                  ? "border-blue-500 bg-blue-50 text-blue-900"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-sm font-bold ${
                    selectedAnswers[currentQuestion] === index
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-300"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestion] === undefined}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {currentQuestion === questions.length - 1
            ? "Submit Quiz"
            : "Next Question"}
        </button>
      </div>
    </div>
  );
}
