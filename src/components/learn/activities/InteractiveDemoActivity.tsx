"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Clock,
  Trophy,
  Eye,
  Lightbulb,
  BookOpen,
} from "lucide-react";

interface DemoStep {
  id: number;
  title: string;
  description: string;
  code?: string;
  visualization?: any;
  explanation: string;
  interactive?: boolean;
  questions?: Array<{
    question: string;
    options: string[];
    correct: number;
  }>;
}

interface InteractiveDemoActivityProps {
  activity: {
    content: {
      title: string;
      description: string;
      steps: DemoStep[];
      timeLimit?: number;
      language?: string;
      category: string;
    };
  };
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function InteractiveDemoActivity({
  activity,
  onComplete,
}: InteractiveDemoActivityProps) {
  // Validate activity data
  if (!activity?.content) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-lg font-semibold text-red-500">
          Invalid Activity Data
        </div>
        <p className="text-gray-600">
          This interactive demo doesn't have the required content configuration.
        </p>
      </div>
    );
  }

  const contentData = activity.content;
  const demoSteps = contentData.steps || [];
  const demoTitle = contentData.title || "Interactive Demo";
  const demoDescription = contentData.description || "";

  if (demoSteps.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-lg font-semibold text-red-500">
          No Demo Steps Available
        </div>
        <p className="text-gray-600">
          This demo doesn't have any steps to display.
        </p>
      </div>
    );
  }

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [watchTime, setWatchTime] = useState(0);
  const [stepAnswers, setStepAnswers] = useState<{ [key: number]: number }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(3000);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && autoAdvance && currentStep < demoSteps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < demoSteps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            if (!isCompleted) {
              handleComplete();
            }
            return prev;
          }
        });
      }, speed);
    }

    return () => clearInterval(interval);
  }, [
    isPlaying,
    autoAdvance,
    currentStep,
    speed,
    demoSteps.length,
    isCompleted,
  ]);

  useEffect(() => {
    if (!isCompleted) {
      const timer = setInterval(() => {
        setWatchTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCompleted]);

  const handleComplete = () => {
    try {
      setIsCompleted(true);

      // Calculate score based on engagement and interaction
      let baseScore = 70; // Base score for completion

      // Bonus for answering questions correctly
      const questionsAnswered = Object.keys(stepAnswers).length;
      const correctAnswers = Object.keys(stepAnswers).filter((stepId) => {
        const step = demoSteps.find((s) => s?.id === parseInt(stepId));
        if (!step?.questions?.[0]) return false;
        return stepAnswers[parseInt(stepId)] === step.questions[0].correct;
      }).length;

      const interactionBonus =
        questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 30 : 0;

      // Time engagement bonus (max 10 points)
      const engagementBonus = Math.min(10, (watchTime / 60) * 5);

      const finalScore = Math.min(
        100,
        Math.round(baseScore + interactionBonus + engagementBonus)
      );
      setScore(finalScore);

      onComplete(finalScore, 100, true);
    } catch (error) {
      console.error("Error completing interactive demo:", error);
      onComplete(70, 100, true);
    }
  };

  const nextStep = () => {
    try {
      if (currentStep < demoSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else if (!isCompleted) {
        handleComplete();
      }
    } catch (error) {
      console.error("Error advancing to next step:", error);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleQuestionAnswer = (stepId: number, answerIndex: number) => {
    setStepAnswers({
      ...stepAnswers,
      [stepId]: answerIndex,
    });
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setWatchTime(0);
    setStepAnswers({});
    setIsCompleted(false);
    setScore(0);
  };

  const currentStepData = demoSteps[currentStep];

  if (isCompleted) {
    const totalQuestions = demoSteps.reduce(
      (acc, step) => acc + (step?.questions?.length || 0),
      0
    );
    const correctAnswers = Object.keys(stepAnswers).filter((stepId) => {
      const step = demoSteps.find((s) => s?.id === parseInt(stepId));
      if (!step?.questions?.[0]) return false;
      return stepAnswers[parseInt(stepId)] === step.questions[0].correct;
    }).length;

    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <div className="mb-6">
          <Trophy className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Demo Complete!
          </h2>
          <div className="mb-4 text-lg text-gray-600">
            You scored {score}% and learned about {activity.content.title}
          </div>

          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="text-2xl font-bold text-blue-600">
                {demoSteps.length}
              </div>
              <div className="text-sm text-blue-800">Steps Completed</div>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="text-2xl font-bold text-green-600">
                {totalQuestions > 0
                  ? `${correctAnswers}/${totalQuestions}`
                  : "N/A"}
              </div>
              <div className="text-sm text-green-800">Questions Correct</div>
            </div>
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
              <div className="text-2xl font-bold text-purple-600">
                {Math.floor(watchTime / 60)}:
                {(watchTime % 60).toString().padStart(2, "0")}
              </div>
              <div className="text-sm text-purple-800">Time Spent</div>
            </div>
          </div>

          <div className="mb-6 rounded-lg border border-green-200 bg-green-100 p-4">
            <p className="font-medium text-green-800">
              🎉 Congratulations! You've completed the interactive demo and
              gained valuable insights about {demoTitle}.
            </p>
          </div>
        </div>

        <button
          onClick={resetDemo}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Watch Demo Again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">
              Interactive Demo: {demoTitle}
            </span>
            {contentData.language && (
              <span className="rounded bg-gray-100 px-2 py-1 text-sm">
                {contentData.language}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>
                {Math.floor(watchTime / 60)}:
                {(watchTime % 60).toString().padStart(2, "0")}
              </span>
            </div>
            <div className="text-sm">
              Step: {currentStep + 1}/{demoSteps.length}
            </div>
          </div>
        </div>

        {/* Demo Description */}
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="text-blue-800">{demoDescription}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / demoSteps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Current Step Content */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4">
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Step {currentStep + 1}: {currentStepData?.title || "Demo Step"}
              </h3>
              <p className="mb-4 text-gray-700">
                {currentStepData?.description ||
                  "Step description not available"}
              </p>
            </div>

            {/* Code Display */}
            {currentStepData?.code && (
              <div className="mb-6">
                <h4 className="mb-2 font-semibold text-gray-900">
                  Code Example:
                </h4>
                <div className="rounded-lg bg-gray-900 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex space-x-1">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    {contentData.language && (
                      <span className="text-sm text-gray-400">
                        {contentData.language}
                      </span>
                    )}
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-green-400">
                    {currentStepData.code}
                  </pre>
                </div>
              </div>
            )}

            {/* Visualization Area */}
            {currentStepData?.visualization && (
              <div className="mb-6">
                <h4 className="mb-2 font-semibold text-gray-900">
                  Visualization:
                </h4>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                  {/* Placeholder for visualization - in a real implementation, this would render the actual visualization */}
                  <div className="text-gray-500">
                    <Eye className="mx-auto mb-4 h-16 w-16" />
                    <p>Interactive visualization would appear here</p>
                  </div>
                </div>
              </div>
            )}

            {/* Explanation */}
            <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-start space-x-2">
                <Lightbulb className="mt-0.5 h-5 w-5 text-yellow-600" />
                <div>
                  <h4 className="mb-2 font-semibold text-yellow-900">
                    Explanation:
                  </h4>
                  <p className="text-sm text-yellow-800">
                    {currentStepData?.explanation || "No explanation available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Questions */}
            {currentStepData?.questions &&
              currentStepData.questions.length > 0 && (
                <div className="space-y-4">
                  {currentStepData.questions.map((question, qIndex) => (
                    <div
                      key={qIndex}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                    >
                      <h4 className="mb-3 font-semibold text-gray-900">
                        {question?.question || "Question not available"}
                      </h4>
                      <div className="space-y-2">
                        {(question?.options || []).map((option, oIndex) => {
                          const isSelected =
                            stepAnswers[currentStepData?.id || 0] === oIndex;
                          const isCorrect = oIndex === question?.correct;
                          const hasAnswered =
                            stepAnswers[currentStepData?.id || 0] !== undefined;

                          return (
                            <button
                              key={oIndex}
                              onClick={() =>
                                handleQuestionAnswer(
                                  currentStepData?.id || 0,
                                  oIndex
                                )
                              }
                              disabled={hasAnswered}
                              className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                                hasAnswered
                                  ? isCorrect
                                    ? "border-green-500 bg-green-50 text-green-800"
                                    : isSelected
                                      ? "border-red-500 bg-red-50 text-red-800"
                                      : "border-gray-200 bg-gray-50 text-gray-600"
                                  : "border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{option}</span>
                                {hasAnswered && isCorrect && (
                                  <span className="text-green-600">✓</span>
                                )}
                                {hasAnswered && isSelected && !isCorrect && (
                                  <span className="text-red-600">✗</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>

        {/* Step Navigation and Controls */}
        <div className="space-y-4">
          {/* Controls */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h4 className="mb-4 font-semibold text-gray-900">Demo Controls</h4>

            <div className="mb-4 flex items-center justify-center space-x-2">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="p-2 text-gray-600 transition-colors hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                title="Previous step"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={
                  isPlaying
                    ? () => setIsPlaying(false)
                    : () => setIsPlaying(true)
                }
                disabled={currentStep === demoSteps.length - 1}
                className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                <span>{isPlaying ? "Pause" : "Play"}</span>
              </button>

              <button
                onClick={nextStep}
                disabled={currentStep === demoSteps.length - 1}
                className="p-2 text-gray-600 transition-colors hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                title="Next step"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Auto-advance:</label>
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={(e) => setAutoAdvance(e.target.checked)}
                  className="rounded"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-700">
                  Speed:
                </label>
                <select
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                >
                  <option value={5000}>Slow (5s)</option>
                  <option value={3000}>Normal (3s)</option>
                  <option value={1500}>Fast (1.5s)</option>
                  <option value={1000}>Very Fast (1s)</option>
                </select>
              </div>

              <button
                onClick={resetDemo}
                className="flex w-full items-center justify-center space-x-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset Demo</span>
              </button>
            </div>
          </div>

          {/* Steps Overview */}
          <div className="max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-white p-6">
            <h4 className="mb-4 font-semibold text-gray-900">All Steps</h4>
            <div className="space-y-2">
              {demoSteps.map((step, index) => (
                <button
                  key={step?.id || index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-full rounded-lg p-3 text-left text-sm transition-colors ${
                    index === currentStep
                      ? "border border-blue-200 bg-blue-100 text-blue-800"
                      : index < currentStep
                        ? "bg-green-50 text-green-700 hover:bg-green-100"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">
                        {index + 1}. {step?.title || "Step"}
                      </span>
                      {step?.questions && step.questions.length > 0 && (
                        <div className="mt-1 text-xs">
                          {stepAnswers[step?.id || 0] !== undefined
                            ? "✓ Answered"
                            : "❓ Has Question"}
                        </div>
                      )}
                    </div>
                    {index === currentStep && (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
