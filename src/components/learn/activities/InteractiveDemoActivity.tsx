"use client";

import { useState, useEffect } from "react";
import {
  Play,
  RotateCcw,
  Code,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Star,
  Gift,
  LogIn,
  Sparkles,
} from "lucide-react";

interface Step {
  title: string;
  explanation: string;
  code: string;
  interactive: boolean;
  hint: string;
}

interface InteractiveDemoContent {
  steps: Step[];
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
  userProgress?: {
    score: number;
    maxScore: number;
    completed: boolean;
    timeSpent: number;
    hintsUsed: number;
    mistakes: number;
    startedAt: string;
    completedAt?: string;
    percentage: number;
  };
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
  const [codeOutput, setCodeOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [editableCode, setEditableCode] = useState<string>("");
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [rewardAwarded, setRewardAwarded] = useState(false);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    // Check for NextAuth session or other authentication indicators
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const session = await response.json();
        setIsAuthenticated(!!session?.user);
      } catch (error) {
        // Fallback: check localStorage/sessionStorage
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

  const { steps } = activity.content;
  const currentStepData = steps[currentStep];

  const simulateCodeExecution = (code: string) => {
    setIsRunning(true);
    setCodeOutput("Running code...");

    // Simulate code execution with realistic output
    setTimeout(() => {
      let output = "";

      try {
        // Simple simulation for common Python patterns
        if (code.includes("print(")) {
          const printMatches = code.match(/print\((.*?)\)/g);
          if (printMatches) {
            printMatches.forEach((match) => {
              const content = match.match(/print\((.*?)\)/)?.[1] || "";
              // Remove quotes and evaluate simple expressions
              let result = content.replace(/['"]/g, "");

              // Handle f-strings
              if (content.includes("f'") || content.includes('f"')) {
                result = content.replace(/f['"](.*)['"]/, "$1");
                // Simple variable substitution
                if (code.includes("name = ")) {
                  const nameMatch = code.match(/name = ['"](.*)['"]/);
                  if (nameMatch) {
                    result = result.replace(/{name}|{.*name.*}/g, nameMatch[1]);
                  }
                }
                if (code.includes("age = ")) {
                  const ageMatch = code.match(/age = (\d+)/);
                  if (ageMatch) {
                    result = result.replace(/{age}|{.*age.*}/g, ageMatch[1]);
                  }
                }
              }

              // Handle type() function
              if (content.includes("type(")) {
                if (content.includes("type(name)")) result = "<class 'str'>";
                else if (content.includes("type(age)"))
                  result = "<class 'int'>";
                else if (content.includes("type(height)"))
                  result = "<class 'float'>";
                else if (content.includes("type(is_student)"))
                  result = "<class 'bool'>";
              }

              output += result + "\n";
            });
          }
        }

        // Handle variable assignments and simple expressions
        if (code.includes("=") && !code.includes("print")) {
          output = "Variables assigned successfully\n";
        }

        // Handle if statements
        if (code.includes("if ") && code.includes("print")) {
          const lines = code.split("\n");
          for (const line of lines) {
            if (line.trim().startsWith("print(") && line.includes("'")) {
              const printContent = line.match(/print\(['"](.*)['"]/);
              if (printContent) {
                output += printContent[1] + "\n";
              }
            }
          }
        }

        if (!output.trim()) {
          output = "Code executed successfully (no output)";
        }
      } catch (error) {
        output = "Error executing code";
      }

      setCodeOutput(output.trim());
      setIsRunning(false);

      // Mark step as completed
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
    }, 1500);
  };

  const runCode = () => {
    const codeToRun = editableCode || currentStepData.code;
    simulateCodeExecution(codeToRun);
  };

  const resetCode = () => {
    setEditableCode(currentStepData.code);
    setCodeOutput("");
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setEditableCode(steps[currentStep + 1].code);
      setCodeOutput("");
    } else {
      handleActivityCompletion();
    }
  };

  const handleActivityCompletion = async () => {
    setIsCompleted(true);

    if (!isAuthenticated) {
      // Show login incentive
      return;
    }

    // Check if reward already awarded for this activity
    const awardedActivities = JSON.parse(
      localStorage.getItem("awardedActivities") || "[]"
    );
    const alreadyAwarded = awardedActivities.includes(activity.id);

    if (!alreadyAwarded) {
      try {
        // Call API to award rewards to user account
        const response = await fetch("/api/learning-activities/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            activityType: "interactive_demo",
            activityId: activity.id,
            activityTitle: activity.title,
            score: Math.max(70, (completedSteps.size / steps.length) * 100),
            timeSpent: 300, // Estimated 5 minutes for completion
            success: true,
            diamondReward: activity.diamondReward || 50,
            experienceReward: activity.experienceReward || 100,
          }),
        });

        if (response.ok) {
          // Show reward animation only after successful API call
          setShowRewardAnimation(true);

          // Mark reward as awarded
          awardedActivities.push(activity.id);
          localStorage.setItem(
            "awardedActivities",
            JSON.stringify(awardedActivities)
          );
          setRewardAwarded(true);

          // Auto-hide animation after 3 seconds
          setTimeout(() => {
            setShowRewardAnimation(false);
          }, 3000);
        } else {
          console.error("Failed to award rewards:", response.statusText);
        }
      } catch (error) {
        console.error("Error awarding rewards:", error);
      }
    }

    // Don't auto-complete - let user manually complete
  };

  const handleManualComplete = () => {
    const completionPercentage = (completedSteps.size / steps.length) * 100;
    const score = Math.max(70, completionPercentage); // Minimum 70% for completion
    onComplete(score, 100, true);
  };

  const handleCloseLoginMessage = () => {
    setIsCompleted(false);
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setEditableCode(steps[currentStep - 1].code);
      setCodeOutput("");
    }
  };

  // Initialize editable code when component mounts or step changes
  useState(() => {
    if (currentStepData) {
      setEditableCode(currentStepData.code);
    }
  });

  return (
    <div className="mx-auto flex h-screen max-w-7xl flex-col p-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          {activity.title}
        </h2>
        <p className="text-base text-gray-600">{activity.description}</p>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-gray-500">
            {completedSteps.size}/{steps.length} completed
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left Panel - Explanation */}
        <div className="flex min-h-0 flex-col space-y-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="mb-3 flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {currentStepData.title}
              </h3>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-gray-700">
              {currentStepData.explanation}
            </p>

            {currentStepData.hint && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-2">
                <p className="text-xs text-yellow-800">
                  💡 <strong>Hint:</strong> {currentStepData.hint}
                </p>
              </div>
            )}
          </div>

          {/* Step Navigation */}
          <div className="min-h-0 flex-1 rounded-lg bg-gray-50 p-3">
            <h4 className="mb-2 text-sm font-semibold text-gray-900">
              Learning Steps
            </h4>
            <div className="max-h-32 space-y-1 overflow-y-auto">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex cursor-pointer items-center space-x-2 rounded p-1.5 transition-colors ${
                    index === currentStep
                      ? "bg-indigo-100 text-indigo-900"
                      : completedSteps.has(index)
                        ? "hover:bg-green-150 bg-green-100 text-green-800"
                        : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setCurrentStep(index);
                    setEditableCode(steps[index].code);
                    setCodeOutput("");
                  }}
                >
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                      index === currentStep
                        ? "bg-indigo-600 text-white"
                        : completedSteps.has(index)
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="truncate text-xs font-medium">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Code and Output */}
        <div className="flex min-h-0 flex-col space-y-3">
          {/* Code Editor */}
          <div className="overflow-hidden rounded-lg bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-700 p-2">
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-400">
                  Python Code
                </span>
              </div>
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-red-400"></div>
                <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
              </div>
            </div>

            <div className="p-2">
              {currentStepData.interactive ? (
                <textarea
                  value={editableCode}
                  onChange={(e) => setEditableCode(e.target.value)}
                  className="h-28 w-full resize-none bg-transparent font-mono text-xs text-white focus:outline-none"
                  placeholder="Write your Python code here..."
                />
              ) : (
                <pre className="h-28 overflow-y-auto whitespace-pre-wrap font-mono text-xs text-white">
                  {currentStepData.code}
                </pre>
              )}
            </div>

            <div className="flex space-x-2 border-t border-gray-700 p-2">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="inline-flex items-center space-x-1 rounded bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:bg-gray-600"
              >
                <Play className="h-3 w-3" />
                <span>{isRunning ? "Running..." : "Run Code"}</span>
              </button>

              {currentStepData.interactive && (
                <button
                  onClick={resetCode}
                  className="inline-flex items-center space-x-1 rounded bg-gray-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-gray-700"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Output */}
          <div className="rounded-lg bg-black p-2">
            <div className="mb-1 flex items-center space-x-1">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400"></div>
              <span className="text-xs font-medium text-green-400">Output</span>
            </div>
            <pre className="h-12 overflow-y-auto whitespace-pre-wrap font-mono text-xs text-green-300">
              {codeOutput || "Run the code to see output..."}
            </pre>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-2">
            <button
              onClick={previousStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-3 w-3" />
              <span>Previous</span>
            </button>

            {currentStep === steps.length - 1 ? (
              isCompleted && !isAuthenticated ? (
                <div className="relative text-center">
                  <div className="relative mb-2 rounded-lg border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-3">
                    <button
                      onClick={handleCloseLoginMessage}
                      className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-200 text-xs font-bold text-yellow-800 transition-colors hover:bg-yellow-300 hover:text-yellow-900"
                      title="Close"
                    >
                      ✕
                    </button>
                    <div className="mb-1 flex items-center justify-center space-x-1 pr-6">
                      <Gift className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-semibold text-yellow-800">
                        Login Benefits Available!
                      </span>
                    </div>
                    <p className="pr-6 text-xs text-yellow-700">
                      Login users earn{" "}
                      <strong>{activity.diamondReward || 50} diamonds</strong>{" "}
                      and <strong>{activity.experienceReward || 100} XP</strong>{" "}
                      for completing activities!
                    </p>
                  </div>
                </div>
              ) : isCompleted ? (
                <div className="text-center">
                  <div className="mb-3 rounded-lg border border-green-200 bg-green-50 p-3">
                    <div className="mb-2 flex items-center justify-center space-x-2">
                      <Trophy className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-semibold text-green-900">
                        Demo Complete!
                      </span>
                    </div>
                    <p className="mb-3 text-xs text-green-800">
                      You've successfully completed all the interactive demo
                      steps. Great job learning Python programming!
                    </p>
                    <button
                      onClick={handleManualComplete}
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                    >
                      🎉 Complete Activity & Claim Rewards
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={nextStep}
                    className="group relative transform overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    <div className="absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></div>
                    <div className="relative flex items-center space-x-1">
                      <Gift className="h-4 w-4" />
                      <span>Finish Demo</span>
                      <Sparkles className="h-3 w-3 animate-pulse" />
                    </div>
                  </button>

                  {/* Reward Animation Overlay */}
                  {showRewardAnimation && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                      <div className="relative rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 p-8 text-center shadow-2xl">
                        <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20"></div>

                        <div className="relative z-10">
                          <div className="mb-6 flex justify-center">
                            <div className="animate-bounce rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 p-4">
                              <Trophy className="h-12 w-12 text-white" />
                            </div>
                          </div>

                          <h3 className="mb-4 text-3xl font-bold text-white">
                            🎉 Congratulations! 🎉
                          </h3>

                          <div className="mb-6 space-y-3">
                            <div className="flex items-center justify-center space-x-3 rounded-lg bg-yellow-500/20 p-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500">
                                <span className="font-bold text-white">💎</span>
                              </div>
                              <span className="text-xl font-semibold text-yellow-300">
                                +{activity.diamondReward || 50} Diamonds
                              </span>
                            </div>

                            <div className="flex items-center justify-center space-x-3 rounded-lg bg-blue-500/20 p-3">
                              <Star className="h-8 w-8 text-blue-400" />
                              <span className="text-xl font-semibold text-blue-300">
                                +{activity.experienceReward || 100} Experience
                              </span>
                            </div>
                          </div>

                          <p className="text-purple-200">
                            Activity completed successfully!
                          </p>
                        </div>

                        {/* Floating particles animation */}
                        <div className="absolute inset-0 overflow-hidden rounded-2xl">
                          {[...Array(20)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute animate-ping"
                              style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 2}s`,
                              }}
                            >
                              <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center space-x-1 rounded-lg bg-indigo-600 px-4 py-1.5 text-sm text-white transition-colors hover:bg-indigo-700"
              >
                <span>Next Step</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
