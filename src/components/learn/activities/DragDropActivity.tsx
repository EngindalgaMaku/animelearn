"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  CheckCircle,
  RotateCcw,
  Target,
  Lightbulb,
  Trophy,
  Star,
  Gift,
  Sparkles,
  LogIn,
} from "lucide-react";

interface Block {
  id: number;
  code: string;
  type: string;
}

interface DragDropContent {
  target: string;
  blocks: Block[];
  correctOrder: number[];
  hints: string[];
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
  content: DragDropContent;
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

interface DragDropActivityProps {
  activity: LearningActivity;
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

interface DraggedBlock extends Block {
  isPlaced: boolean;
  isDragging: boolean;
}

export default function DragDropActivity({
  activity,
  onComplete,
}: DragDropActivityProps) {
  // Early validation with safe returns
  if (!activity) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-800">
            Activity Loading Error
          </h2>
          <p className="text-red-600">Activity data is missing.</p>
        </div>
      </div>
    );
  }

  if (!activity.content || typeof activity.content !== "object") {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-800">
            Configuration Error
          </h2>
          <p className="text-red-600">
            Activity content is missing or invalid.
          </p>
        </div>
      </div>
    );
  }

  const { target, blocks, correctOrder, hints } = activity.content || {};

  if (
    !blocks ||
    !correctOrder ||
    !Array.isArray(blocks) ||
    !Array.isArray(correctOrder)
  ) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-800">
            Configuration Error
          </h2>
          <p className="text-red-600">
            This learning activity is missing required configuration data.
          </p>
          <div className="mt-4 text-sm text-red-500">
            Expected: blocks array and correctOrder array in activity.content
          </div>
        </div>
      </div>
    );
  }

  const [availableBlocks, setAvailableBlocks] = useState<DraggedBlock[]>([]);
  const [droppedBlocks, setDroppedBlocks] = useState<DraggedBlock[]>([]);
  const [draggedItem, setDraggedItem] = useState<DraggedBlock | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [rewardAwarded, setRewardAwarded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const session = await response.json();
        setIsAuthenticated(!!session?.user);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    try {
      if (blocks && Array.isArray(blocks) && blocks.length > 0) {
        const validBlocks = blocks.filter(
          (block) =>
            block && typeof block === "object" && block.id !== undefined
        );
        const shuffledBlocks: DraggedBlock[] = validBlocks
          .map((block) => ({
            ...block,
            isPlaced: false,
            isDragging: false,
          }))
          .sort(() => Math.random() - 0.5);

        setAvailableBlocks(shuffledBlocks);
      }
    } catch (error) {
      console.error("Error initializing blocks:", error);
      setAvailableBlocks([]);
    }
  }, [blocks]);

  const handleDragStart = (e: React.DragEvent, block: DraggedBlock) => {
    try {
      setDraggedItem(block);
      e.dataTransfer.effectAllowed = "move";
    } catch (error) {
      console.error("Drag start error:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: React.DragEvent,
    dropZone: "available" | "dropped",
    index?: number
  ) => {
    try {
      e.preventDefault();
      if (!draggedItem) return;

      if (dropZone === "dropped") {
        const newDroppedBlocks = [...(droppedBlocks || [])];
        if (typeof index === "number") {
          newDroppedBlocks.splice(index, 0, { ...draggedItem, isPlaced: true });
        } else {
          newDroppedBlocks.push({ ...draggedItem, isPlaced: true });
        }
        setDroppedBlocks(newDroppedBlocks);
        setAvailableBlocks((prev) =>
          prev.filter((block) => block.id !== draggedItem.id)
        );
      } else {
        if (draggedItem.isPlaced) {
          setAvailableBlocks((prev) => [
            ...prev,
            { ...draggedItem, isPlaced: false },
          ]);
          setDroppedBlocks((prev) =>
            prev.filter((block) => block.id !== draggedItem.id)
          );
        }
      }
      setDraggedItem(null);
    } catch (error) {
      console.error("Drop error:", error);
    }
  };

  const removeBlock = (block: DraggedBlock) => {
    try {
      setDroppedBlocks((prev) => prev.filter((b) => b.id !== block.id));
      setAvailableBlocks((prev) => [...prev, { ...block, isPlaced: false }]);
    } catch (error) {
      console.error("Remove block error:", error);
    }
  };

  const checkOrder = async () => {
    try {
      setSubmitted(true);
      setAttempts((prev) => prev + 1);

      const safeDroppedBlocks = droppedBlocks || [];
      const safeCorrectOrder = correctOrder || [];

      const userOrder = safeDroppedBlocks
        .filter((block) => block && block.id !== undefined)
        .map((block) => block.id);
      let correctCount = 0;

      const orderLength = safeCorrectOrder.length || 0;
      for (let i = 0; i < Math.min(userOrder.length, orderLength); i++) {
        if (userOrder[i] === safeCorrectOrder[i]) {
          correctCount++;
        }
      }

      const accuracy = orderLength > 0 ? (correctCount / orderLength) * 100 : 0;
      const completeness =
        orderLength > 0 ? (safeDroppedBlocks.length / orderLength) * 100 : 0;
      const efficiency = Math.max(0, 100 - (attempts - 1) * 10);

      const finalScore = Math.round(
        accuracy * 0.6 + completeness * 0.3 + efficiency * 0.1
      );
      setScore(finalScore);

      const success = finalScore >= 70 && correctCount === orderLength;
      if (success) {
        await handleActivityCompletion();
      }
    } catch (error) {
      console.error("Check order error:", error);
    }
  };

  const handleManualComplete = () => {
    try {
      const safeDroppedBlocks = droppedBlocks || [];
      const safeCorrectOrder = correctOrder || [];
      const userOrder = safeDroppedBlocks.map((block) => block.id);
      let correctCount = 0;

      const orderLength = safeCorrectOrder.length || 0;
      for (let i = 0; i < Math.min(userOrder.length, orderLength); i++) {
        if (userOrder[i] === safeCorrectOrder[i]) {
          correctCount++;
        }
      }

      const accuracy = orderLength > 0 ? (correctCount / orderLength) * 100 : 0;
      const completeness =
        orderLength > 0 ? (safeDroppedBlocks.length / orderLength) * 100 : 0;
      const efficiency = Math.max(0, 100 - (attempts - 1) * 10);

      const finalScore = Math.round(
        accuracy * 0.6 + completeness * 0.3 + efficiency * 0.1
      );
      const success = finalScore >= 70 && correctCount === orderLength;
      onComplete(finalScore, 100, success);
    } catch (error) {
      console.error("Manual complete error:", error);
    }
  };

  const handleActivityCompletion = async () => {
    try {
      setIsCompleted(true);
      if (!isAuthenticated || !activity?.id) return;

      let awardedActivities = [];
      try {
        awardedActivities = JSON.parse(
          localStorage.getItem("awardedActivities") || "[]"
        );
      } catch (error) {
        console.error("Error parsing awarded activities:", error);
        awardedActivities = [];
      }

      if (!awardedActivities.includes(activity.id)) {
        try {
          const response = await fetch("/api/learning-activities/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              activityType: "drag_drop",
              activityId: activity.id,
              activityTitle: activity.title || "Drag Drop Activity",
              score: Math.max(70, score || 0),
              timeSpent: 300,
              success: true,
              diamondReward: activity.diamondReward || 50,
              experienceReward: activity.experienceReward || 100,
            }),
          });

          if (response.ok) {
            setShowRewardAnimation(true);
            try {
              awardedActivities.push(activity.id);
              localStorage.setItem(
                "awardedActivities",
                JSON.stringify(awardedActivities)
              );
            } catch (error) {
              console.error("Error saving awarded activities:", error);
            }
            setRewardAwarded(true);
            setTimeout(() => setShowRewardAnimation(false), 3000);
          }
        } catch (error) {
          console.error("Error awarding rewards:", error);
        }
      }
    } catch (error) {
      console.error("Error in handleActivityCompletion:", error);
    }
  };

  const resetActivity = () => {
    try {
      const safeBlocks = blocks || [];
      if (safeBlocks.length > 0) {
        const validBlocks = safeBlocks.filter(
          (block) =>
            block && typeof block === "object" && block.id !== undefined
        );
        const shuffledBlocks: DraggedBlock[] = validBlocks
          .map((block) => ({
            ...block,
            isPlaced: false,
            isDragging: false,
          }))
          .sort(() => Math.random() - 0.5);
        setAvailableBlocks(shuffledBlocks);
      } else {
        setAvailableBlocks([]);
      }

      setDroppedBlocks([]);
      setSubmitted(false);
      setScore(0);
      setShowHints(false);
      setIsCompleted(false);
      setRewardAwarded(false);
      setShowRewardAnimation(false);
      setAttempts(0);
    } catch (error) {
      console.error("Reset activity error:", error);
    }
  };

  const getBlockTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      comment: "bg-gray-100 border-gray-300 text-gray-700",
      input: "bg-blue-100 border-blue-300 text-blue-800",
      calculation: "bg-green-100 border-green-300 text-green-800",
      output: "bg-purple-100 border-purple-300 text-purple-800",
      control: "bg-orange-100 border-orange-300 text-orange-800",
      default: "bg-slate-100 border-slate-300 text-slate-800",
    };
    return colors[type] || colors["default"];
  };

  const isCorrectOrder = useMemo(() => {
    try {
      const safeDroppedBlocks = droppedBlocks || [];
      const safeCorrectOrder = correctOrder || [];
      return (
        submitted &&
        Array.isArray(safeCorrectOrder) &&
        Array.isArray(safeDroppedBlocks) &&
        JSON.stringify(safeDroppedBlocks.map((b) => b.id)) ===
          JSON.stringify(safeCorrectOrder)
      );
    } catch (error) {
      console.error("Error in isCorrectOrder calculation:", error);
      return false;
    }
  }, [submitted, correctOrder, droppedBlocks]);

  // Safe render with try-catch
  try {
    const safeDroppedBlocks = droppedBlocks || [];
    const safeAvailableBlocks = availableBlocks || [];
    const safeCorrectOrder = correctOrder || [];
    const safeHints = hints || [];

    return (
      <div className="mx-auto max-w-6xl p-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            {activity.title || "Drag & Drop Activity"}
          </h2>
          <p className="mb-6 text-lg text-gray-600">
            {activity.description || "Complete this drag and drop activity."}
          </p>
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="mb-2 flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-900">Target:</span>
            </div>
            <p className="text-blue-800">{target || "Complete the activity"}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {safeDroppedBlocks.length}/{safeCorrectOrder.length || 0} blocks
              placed
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${
                  safeCorrectOrder.length > 0
                    ? (safeDroppedBlocks.length / safeCorrectOrder.length) * 100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Available Blocks */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Available Code Blocks
              </h3>
              <button
                onClick={() => setShowHints(!showHints)}
                className="flex items-center space-x-2 rounded bg-yellow-100 px-3 py-1 text-sm text-yellow-800 transition-colors hover:bg-yellow-200"
              >
                <Lightbulb className="h-4 w-4" />
                <span>{showHints ? "Hide" : "Show"} Hints</span>
              </button>
            </div>

            <div
              className="min-h-40 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "available")}
            >
              <div className="space-y-3">
                {safeAvailableBlocks.filter(Boolean).map((block) => (
                  <div
                    key={block.id}
                    draggable={!submitted}
                    onDragStart={(e) => handleDragStart(e, block)}
                    className={`cursor-move rounded-lg border-2 p-3 transition-all hover:shadow-md ${getBlockTypeColor(
                      block.type
                    )} ${submitted ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <pre className="whitespace-pre-wrap font-mono text-sm">
                        {block.code || ""}
                      </pre>
                      <span className="rounded bg-white px-2 py-1 text-xs font-medium">
                        {block.type || "block"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {safeAvailableBlocks.length === 0 && (
                <p className="py-8 text-center text-gray-500">
                  All blocks have been used
                </p>
              )}
            </div>

            {/* Hints */}
            {showHints && safeHints.length > 0 && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <h4 className="mb-2 font-semibold text-yellow-900">
                  💡 Hints:
                </h4>
                <ul className="space-y-1 text-sm text-yellow-800">
                  {safeHints.filter(Boolean).map((hint, index) => (
                    <li key={index}>• {hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Drop Zone */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Program Structure
            </h3>
            <div
              className={`min-h-96 rounded-lg border-2 border-dashed p-4 transition-colors ${
                isCorrectOrder
                  ? "border-green-500 bg-green-50"
                  : submitted && safeDroppedBlocks.length > 0
                    ? "border-red-500 bg-red-50"
                    : "border-blue-300 bg-blue-50"
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "dropped")}
            >
              <div className="space-y-3">
                {safeDroppedBlocks.filter(Boolean).map((block, index) => (
                  <div key={`${block.id}-${index}`} className="relative">
                    <div
                      draggable={!submitted}
                      onDragStart={(e) => handleDragStart(e, block)}
                      className={`rounded-lg border-2 p-3 transition-all ${getBlockTypeColor(
                        block.type
                      )} ${
                        submitted && safeCorrectOrder.length > 0
                          ? safeCorrectOrder[index] === block.id
                            ? "border-green-500 bg-green-100"
                            : "border-red-500 bg-red-100"
                          : "cursor-move hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="rounded bg-white px-2 py-1 text-xs font-bold">
                            {index + 1}
                          </span>
                          <pre className="whitespace-pre-wrap font-mono text-sm">
                            {block.code || ""}
                          </pre>
                        </div>
                        <div className="flex items-center space-x-2">
                          {submitted && safeCorrectOrder.length > 0 && (
                            <span>
                              {safeCorrectOrder[index] === block.id ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <span className="text-xs text-red-500">
                                  Wrong position
                                </span>
                              )}
                            </span>
                          )}
                          {!submitted && (
                            <button
                              onClick={() => removeBlock(block)}
                              className="text-xs text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {safeDroppedBlocks.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-gray-500">
                    Drag code blocks here to build your program
                  </p>
                  <p className="mt-2 text-sm text-gray-400">Order matters!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {submitted && (
          <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
            <div className="text-center">
              <div
                className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full ${
                  isCorrectOrder
                    ? "bg-green-100 text-green-600"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                {isCorrectOrder ? "Perfect Structure!" : "Good Attempt!"}
              </h3>
              <p className="mb-4 text-gray-600">
                {isCorrectOrder
                  ? "You built the program structure correctly!"
                  : "Some blocks are in the wrong order. Review the hints and try again."}
              </p>
              <div className="mb-4 text-4xl font-bold text-gray-900">
                {score}%
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          {!submitted ? (
            <button
              onClick={checkOrder}
              disabled={safeDroppedBlocks.length === 0}
              className="rounded-lg bg-blue-600 px-8 py-3 font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Check Structure
            </button>
          ) : isCorrectOrder ? (
            isCompleted && !isAuthenticated ? (
              <div className="relative text-center">
                <div className="relative mb-2 rounded-lg border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-3">
                  <button
                    onClick={() => setIsCompleted(false)}
                    className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-200 text-xs font-bold text-yellow-800"
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
                    <strong>{activity.diamondReward || 50} diamonds</strong> and{" "}
                    <strong>{activity.experienceReward || 100} XP</strong> for
                    completing activities!
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                {rewardAwarded ? (
                  <button
                    onClick={resetActivity}
                    className="group relative transform cursor-default overflow-hidden rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
                  >
                    <div className="relative flex items-center space-x-1">
                      <Trophy className="h-4 w-4" />
                      <span>Completed!</span>
                    </div>
                  </button>
                ) : isCompleted ? (
                  <div className="text-center">
                    <div className="mb-3 rounded-lg border border-green-200 bg-green-50 p-3">
                      <div className="mb-2 flex items-center justify-center space-x-2">
                        <Trophy className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-semibold text-green-900">
                          Perfect Structure!
                        </span>
                      </div>
                      <p className="mb-3 text-xs text-green-800">
                        You've successfully built the correct program structure.
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
                  <button
                    onClick={resetActivity}
                    className="inline-flex items-center space-x-2 rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white transition-colors hover:bg-indigo-700"
                  >
                    <RotateCcw className="h-5 w-5" />
                    <span>Try Again</span>
                  </button>
                )}

                {/* Reward Animation */}
                {showRewardAnimation && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="relative rounded-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 p-8 text-center">
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
                            <span className="text-xl font-semibold text-yellow-300">
                              +{activity.diamondReward || 50} Diamonds
                            </span>
                          </div>
                          <div className="flex items-center justify-center space-x-3 rounded-lg bg-blue-500/20 p-3">
                            <span className="text-xl font-semibold text-blue-300">
                              +{activity.experienceReward || 100} Experience
                            </span>
                          </div>
                        </div>
                        <p className="text-purple-200">
                          Activity completed successfully!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          ) : (
            <button
              onClick={resetActivity}
              className="inline-flex items-center space-x-2 rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white transition-colors hover:bg-indigo-700"
            >
              <RotateCcw className="h-5 w-5" />
              <span>Try Again</span>
            </button>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("DragDropActivity render error:", error);
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-800">
            Activity Render Error
          </h2>
          <p className="text-red-600">
            There was an error displaying this activity. Please try refreshing
            the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}
