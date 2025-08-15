"use client";

import { useState, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Star,
  Gift,
  ChevronRight,
} from "lucide-react";

interface VisualizationStep {
  id: number;
  description: string;
  data: number[];
  highlights?: number[];
  comparison?: number[];
  action: string;
}

interface AlgorithmVisualizationContent {
  algorithm: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  explanation: string;
  steps: VisualizationStep[];
}

interface LearningActivity {
  id: string;
  title: string;
  description: string;
  activityType: string;
  difficulty: number;
  category: string;
  diamondReward: number;
  experienceReward: number;
  estimatedMinutes: number;
  content: AlgorithmVisualizationContent;
  settings?: any;
  tags: string[];
}

interface AlgorithmVisualizationActivityProps {
  activity: LearningActivity;
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function AlgorithmVisualizationActivity({
  activity,
  onComplete,
}: AlgorithmVisualizationActivityProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const session = await response.json();
        setIsAuthenticated(!!session?.user);
      } catch (error) {
        const userSession =
          localStorage.getItem("user") ||
          sessionStorage.getItem("user") ||
          localStorage.getItem("next-auth.session-token") ||
          document.cookie.includes("next-auth.session-token");
        setIsAuthenticated(!!userSession);
      }
    };
    checkAuth();
  }, []);

  // Normalize nested seed schema (content.algorithm.* with algorithm.steps[]) and flat schema (content.* with content.steps[])
  const contentAny: any = activity.content || {};
  const alg: any = contentAny.algorithm || {};
  const rawSteps: any[] = Array.isArray(contentAny.steps)
    ? contentAny.steps
    : Array.isArray(alg.steps)
      ? alg.steps
      : [];

  const algorithm: string =
    (typeof alg.name === "string" && alg.name) ||
    (typeof contentAny.algorithm === "string"
      ? contentAny.algorithm
      : undefined) ||
    "Algorithm";

  const description: string =
    (typeof contentAny.description === "string" && contentAny.description) ||
    (typeof contentAny.title === "string" && contentAny.title) ||
    "No description available";

  const timeComplexity: string =
    (alg?.complexity?.time as string) ||
    (alg?.complexity?.Time as string) ||
    "Unknown";

  const spaceComplexity: string =
    (alg?.complexity?.space as string) ||
    (alg?.complexity?.Space as string) ||
    "Unknown";

  const explanation: string =
    (typeof contentAny.explanation === "string" && contentAny.explanation) ||
    (typeof contentAny.description === "string" && contentAny.description) ||
    "No explanation available";

  // Map rich step objects from seeds to simple visualization steps expected by this component
  const normalizedSteps: VisualizationStep[] = Array.isArray(rawSteps)
    ? rawSteps.map((s: any, idx: number) => {
        const viz: any = s?.visualization || {};
        let data: number[] = [];

        // Prefer explicit numeric arrays
        if (
          Array.isArray(viz.data) &&
          viz.data.every((n: any) => typeof n === "number")
        ) {
          data = viz.data as number[];
        } else if (
          Array.isArray(s?.data) &&
          s.data.every((n: any) => typeof n === "number")
        ) {
          data = s.data as number[];
        } else if (Array.isArray(viz.list_data)) {
          // Derive numbers from list_data by index or length
          data = viz.list_data.map((x: any, i: number) =>
            typeof x === "number" ? x : Array.isArray(x) ? x.length : i + 1
          );
        } else if (typeof viz.data === "string") {
          // For string visualizations, derive heights by index
          data = (viz.data as string).split("").map((_, i) => i + 1);
        } else {
          // Fallback sample data
          data = [1, 2, 3, 4, 5];
        }

        // Map highlight indices commonly used in seeds
        const highlights: number[] = Array.isArray(viz.comparing)
          ? (viz.comparing as number[])
          : Array.isArray(viz.highlight)
            ? (viz.highlight as number[])
            : Array.isArray(s?.highlights)
              ? (s.highlights as number[])
              : [];

        return {
          id: typeof s?.id === "number" ? s.id : idx,
          description:
            (s?.description as string) || (s?.title as string) || "Step",
          data,
          highlights,
          comparison: [],
          action: (s?.title as string) || (s?.description as string) || "Step",
        } as VisualizationStep;
      })
    : [];

  // Auto-play functionality
  useEffect(() => {
    const safeStepsLength = Array.isArray(normalizedSteps)
      ? normalizedSteps.length
      : 1;
    if (isPlaying && currentStep < safeStepsLength - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 2000); // 2 seconds per step
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep === safeStepsLength - 1) {
      setIsPlaying(false);
      if (!isCompleted) {
        setIsCompleted(true);
        handleActivityCompletion();
      }
    }
  }, [isPlaying, currentStep, normalizedSteps, isCompleted]);

  const handleActivityCompletion = async () => {
    if (!isAuthenticated) return;

    const awardedActivities = JSON.parse(
      localStorage.getItem("awardedActivities") || "[]"
    );
    const alreadyAwarded = awardedActivities.includes(activity.id);

    if (!alreadyAwarded) {
      try {
        const response = await fetch("/api/learning-activities/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activityType: "algorithm_visualization",
            activityId: activity.id,
            activityTitle: activity.title,
            score: 85, // Good score for completing visualization
            timeSpent: 300,
            success: true,
            diamondReward: activity.diamondReward || 30,
            experienceReward: activity.experienceReward || 50,
          }),
        });

        if (response.ok) {
          setShowRewardAnimation(true);
          awardedActivities.push(activity.id);
          localStorage.setItem(
            "awardedActivities",
            JSON.stringify(awardedActivities)
          );
          setTimeout(() => setShowRewardAnimation(false), 3000);
        }
      } catch (error) {
        console.error("Error awarding rewards:", error);
      }
    }
  };

  const playPause = () => {
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setIsCompleted(false);
  };

  const nextStep = () => {
    const safeStepsLength = Array.isArray(normalizedSteps)
      ? normalizedSteps.length
      : 1;
    if (currentStep < safeStepsLength - 1) {
      setCurrentStep(currentStep + 1);
    } else if (!isCompleted) {
      setIsCompleted(true);
      handleActivityCompletion();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getBarColor = (index: number, value: number) => {
    const safeSteps =
      Array.isArray(normalizedSteps) && normalizedSteps.length > 0
        ? normalizedSteps
        : [];
    const step = safeSteps[currentStep];
    if (!step) return "bg-blue-500";

    if (
      step.highlights &&
      Array.isArray(step.highlights) &&
      step.highlights.includes(index)
    ) {
      return "bg-yellow-500";
    }
    if (
      step.comparison &&
      Array.isArray(step.comparison) &&
      step.comparison.includes(index)
    ) {
      return "bg-red-500";
    }
    return "bg-blue-500";
  };

  // Safety checks for steps and currentStepData
  const safeSteps =
    Array.isArray(normalizedSteps) && normalizedSteps.length > 0
      ? normalizedSteps
      : ([
          {
            id: 0,
            description: "No visualization data available",
            data: [1, 2, 3, 4, 5],
            action: "Sample data",
          },
        ] as VisualizationStep[]);

  const currentStepData = safeSteps[currentStep] || safeSteps[0];
  const safeData = Array.isArray(currentStepData?.data)
    ? currentStepData.data
    : [1, 2, 3, 4, 5];
  const maxValue = Math.max(...safeData);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {activity.title}
        </h2>
        <p className="text-lg text-gray-600">{activity.description}</p>
      </div>

      {/* Algorithm Info */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-purple-50 p-6">
          <h3 className="mb-4 text-xl font-semibold text-purple-900">
            {algorithm}
          </h3>
          <p className="mb-4 text-purple-800">{description}</p>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Time Complexity:</strong> {timeComplexity}
            </div>
            <div>
              <strong>Space Complexity:</strong> {spaceComplexity}
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 p-6">
          <h3 className="mb-4 text-xl font-semibold text-blue-900">
            How it Works
          </h3>
          <p className="text-blue-800">{explanation}</p>
        </div>
      </div>

      {/* Visualization */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            Algorithm Visualization
          </h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Step {currentStep + 1} of{" "}
              {Array.isArray(normalizedSteps) ? normalizedSteps.length : 1}
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={reset}
                className="rounded-lg bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={playPause}
                className="rounded-lg bg-purple-600 p-2 text-white hover:bg-purple-700"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-purple-600 transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / (Array.isArray(normalizedSteps) ? normalizedSteps.length : 1)) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Array Visualization */}
        <div className="mb-6">
          <div
            className="flex items-end justify-center space-x-2"
            style={{ height: "200px" }}
          >
            {safeData.map((value, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-12 transition-all duration-500 ${getBarColor(index, value)}`}
                  style={{
                    height: `${(value / maxValue) * 150 + 20}px`,
                  }}
                ></div>
                <div className="mt-2 text-xs text-gray-600">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Description */}
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="mb-2 font-semibold text-gray-900">
            {currentStepData?.description || "No description available"}
          </div>
          <div className="text-sm text-gray-600">
            <strong>Action:</strong>{" "}
            {currentStepData?.action || "No action available"}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <div className="flex items-center space-x-2">
            {(Array.isArray(normalizedSteps) ? normalizedSteps : [{}]).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`h-3 w-3 rounded-full transition-all ${
                    index === currentStep
                      ? "bg-purple-600"
                      : index < currentStep
                        ? "bg-purple-300"
                        : "bg-gray-200"
                  }`}
                />
              )
            )}
          </div>

          <button
            onClick={nextStep}
            className="flex items-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            <span>
              {currentStep ===
              (Array.isArray(normalizedSteps) ? normalizedSteps.length : 1) - 1
                ? "Complete"
                : "Next"}
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Completion */}
      {isCompleted && (
        <div className="text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
            <Trophy className="h-10 w-10" />
          </div>
          <h3 className="mb-4 text-2xl font-bold text-gray-900">
            Visualization Complete!
          </h3>
          <p className="mb-6 text-gray-600">
            You've successfully learned how the {algorithm} algorithm works!
          </p>
          <button
            onClick={() => onComplete(85, 100, true)}
            className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white transition-colors hover:bg-green-700"
          >
            Complete Activity
          </button>
        </div>
      )}

      {/* Reward Animation */}
      {showRewardAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative rounded-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 p-8 text-center shadow-2xl">
            <h3 className="mb-4 text-3xl font-bold text-white">
              🎉 Algorithm Mastered! 🎉
            </h3>
            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-center space-x-3 rounded-lg bg-yellow-500/20 p-3">
                <span className="text-xl font-semibold text-yellow-300">
                  +{activity.diamondReward || 30} Diamonds
                </span>
              </div>
              <div className="flex items-center justify-center space-x-3 rounded-lg bg-blue-500/20 p-3">
                <Star className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-semibold text-blue-300">
                  +{activity.experienceReward || 50} Experience
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
