"use client";

import { useState, useEffect } from "react";
import {
  Play,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Star,
  Gift,
  Code,
} from "lucide-react";

interface DemoStep {
  title: string;
  content: string;
  code?: string;
  explanation?: string;
}

interface InteractiveDemoContent {
  title: string;
  description: string;
  steps: DemoStep[];
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
  content: InteractiveDemoContent;
  settings?: any;
  tags: string[];
}

interface InteractiveDemoActivityProps {
  activity: LearningActivity;
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function InteractiveDemoActivity({
  activity,
  onComplete,
}: InteractiveDemoActivityProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [codeOutput, setCodeOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);

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

  const { title, description, steps } = activity.content;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
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

  const runCode = async () => {
    const currentStepData = steps[currentStep];
    if (!currentStepData.code) return;

    setIsRunning(true);
    setCodeOutput("");

    try {
      // Simulate code execution
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock output based on code content
      let mockOutput = "";
      if (currentStepData.code.includes("print")) {
        // Extract print statements and simulate output
        const printMatches = currentStepData.code.match(/print\([^)]*\)/g);
        if (printMatches) {
          printMatches.forEach((printStatement) => {
            const content = printStatement.match(/print\((.+)\)/)?.[1] || "";
            // Simple evaluation for demo purposes
            if (content.includes('"') || content.includes("'")) {
              mockOutput += content.replace(/['"]/g, "") + "\n";
            } else if (content.includes("fruits")) {
              mockOutput += "['apple', 'banana', 'orange', 'grape']\n";
            } else if (content.includes("len(")) {
              mockOutput += "4\n";
            } else {
              mockOutput += "Output: " + content + "\n";
            }
          });
        }
      } else {
        mockOutput = "Code executed successfully!";
      }

      setCodeOutput(mockOutput.trim());
    } catch (error) {
      setCodeOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

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
            activityType: "interactive_demo",
            activityId: activity.id,
            activityTitle: activity.title,
            score: 85, // Good score for completing demo
            timeSpent: 400,
            success: true,
            diamondReward: activity.diamondReward || 30,
            experienceReward: activity.experienceReward || 45,
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

  if (isCompleted) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
            <Trophy className="h-10 w-10" />
          </div>

          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Demo Complete!
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            You've successfully explored {title} through our interactive
            demonstration!
          </p>

          <div className="mb-8 rounded-lg bg-gray-50 p-6">
            <div className="mb-2 text-4xl font-bold text-gray-900">85%</div>
            <div className="text-lg font-semibold text-green-600">
              Knowledge Acquired!
            </div>
          </div>

          <button
            onClick={() => onComplete(85, 100, true)}
            className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white transition-colors hover:bg-green-700"
          >
            Complete Demo
          </button>
        </div>

        {/* Reward Animation */}
        {showRewardAnimation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative rounded-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 p-8 text-center shadow-2xl">
              <h3 className="mb-4 text-3xl font-bold text-white">
                🎉 Demo Mastered! 🎉
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
                    +{activity.experienceReward || 45} Experience
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {activity.title}
        </h2>
        <p className="text-lg text-gray-600">{activity.description}</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep + 1} of {steps.length}
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

      {/* Demo Content */}
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Content Panel */}
        <div>
          <div className="rounded-lg bg-blue-50 p-6">
            <h3 className="mb-4 text-2xl font-semibold text-blue-900">
              {currentStepData.title}
            </h3>
            <div className="prose prose-blue max-w-none text-blue-800">
              {currentStepData.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {currentStepData.explanation && (
              <div className="mt-6 rounded-lg bg-blue-100 p-4">
                <h4 className="mb-2 font-semibold text-blue-900">
                  💡 Explanation:
                </h4>
                <p className="text-blue-800">{currentStepData.explanation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Code Panel */}
        <div>
          {currentStepData.code ? (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Interactive Code
                </h3>
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  <Play className="h-4 w-4" />
                  <span>{isRunning ? "Running..." : "Run Code"}</span>
                </button>
              </div>

              <div className="mb-4 rounded-lg bg-gray-900 p-4">
                <pre className="overflow-x-auto text-sm text-green-400">
                  <code>{currentStepData.code}</code>
                </pre>
              </div>

              {/* Output */}
              <div>
                <h4 className="mb-2 text-sm font-semibold text-gray-700">
                  Output:
                </h4>
                <div className="min-h-20 rounded-lg bg-black p-4 font-mono text-sm text-green-400">
                  {isRunning ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-400 border-t-transparent"></div>
                      <span>Executing code...</span>
                    </div>
                  ) : codeOutput ? (
                    <pre className="whitespace-pre-wrap">{codeOutput}</pre>
                  ) : (
                    <div className="text-gray-500">
                      Click "Run Code" to see output...
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-gray-50 p-6">
              <div className="flex h-64 items-center justify-center text-gray-500">
                <div className="text-center">
                  <Code className="mx-auto mb-4 h-12 w-12" />
                  <p>No code example for this step</p>
                  <p className="text-sm">Focus on the concept explanation</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center space-x-2 rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        {/* Step Indicators */}
        <div className="flex items-center space-x-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                index === currentStep
                  ? "bg-blue-600"
                  : index < currentStep
                    ? "bg-blue-300"
                    : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextStep}
          className="flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          <span>
            {currentStep === steps.length - 1 ? "Complete Demo" : "Next Step"}
          </span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
