"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Trophy, Star, Gift, Move } from "lucide-react";

interface CodeBlock {
  id: number;
  code: string;
  type: string;
}

interface CodeBuilderContent {
  instructions: string;
  codeBlocks: CodeBlock[];
  correctOrder: number[];
  explanation?: string;
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
  content: CodeBuilderContent;
  settings?: any;
  tags: string[];
}

interface CodeBuilderActivityProps {
  activity: LearningActivity;
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function CodeBuilderActivity({
  activity,
  onComplete,
}: CodeBuilderActivityProps) {
  const [blocks, setBlocks] = useState<CodeBlock[]>([]);
  const [arrangedBlocks, setArrangedBlocks] = useState<CodeBlock[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<CodeBlock | null>(null);
  const [showResults, setShowResults] = useState(false);
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

  const { instructions, codeBlocks, correctOrder, explanation } =
    activity.content;

  // Initialize blocks in random order
  useEffect(() => {
    const shuffledBlocks = [...codeBlocks].sort(() => Math.random() - 0.5);
    setBlocks(shuffledBlocks);
  }, [codeBlocks]);

  const handleDragStart = (block: CodeBlock) => {
    setDraggedBlock(block);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropToArranged = (e: React.DragEvent, insertIndex?: number) => {
    e.preventDefault();
    if (!draggedBlock) return;

    // Remove from blocks
    setBlocks(blocks.filter((b) => b.id !== draggedBlock.id));

    // Add to arranged blocks at specified position
    if (insertIndex !== undefined) {
      const newArranged = [...arrangedBlocks];
      newArranged.splice(insertIndex, 0, draggedBlock);
      setArrangedBlocks(newArranged);
    } else {
      setArrangedBlocks([...arrangedBlocks, draggedBlock]);
    }

    setDraggedBlock(null);
  };

  const handleDropToBlocks = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedBlock) return;

    // Remove from arranged blocks
    setArrangedBlocks(arrangedBlocks.filter((b) => b.id !== draggedBlock.id));

    // Add back to blocks
    setBlocks([...blocks, draggedBlock]);

    setDraggedBlock(null);
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newArranged = [...arrangedBlocks];
    const [movedBlock] = newArranged.splice(fromIndex, 1);
    newArranged.splice(toIndex, 0, movedBlock);
    setArrangedBlocks(newArranged);
  };

  const checkOrder = () => {
    setShowResults(true);
    const userOrder = arrangedBlocks.map((block) => block.id);
    const correctMatches = userOrder.filter(
      (id, index) => id === correctOrder[index]
    ).length;
    const score = Math.round((correctMatches / correctOrder.length) * 100);
    const success = score >= 70;

    if (success) {
      handleActivityCompletion(score);
    }
  };

  const handleActivityCompletion = async (score: number) => {
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
            activityType: "code_builder",
            activityId: activity.id,
            activityTitle: activity.title,
            score: Math.max(70, score),
            timeSpent: 400,
            success: true,
            diamondReward: activity.diamondReward || 50,
            experienceReward: activity.experienceReward || 75,
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

  const reset = () => {
    const shuffledBlocks = [...codeBlocks].sort(() => Math.random() - 0.5);
    setBlocks(shuffledBlocks);
    setArrangedBlocks([]);
    setShowResults(false);
  };

  if (showResults) {
    const userOrder = arrangedBlocks.map((block) => block.id);
    const correctMatches = userOrder.filter(
      (id, index) => id === correctOrder[index]
    ).length;
    const score = Math.round((correctMatches / correctOrder.length) * 100);
    const passed = score >= 70;

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
            {passed ? "Code Built Successfully!" : "Keep Building!"}
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            You got {correctMatches} out of {correctOrder.length} blocks in the
            correct order
          </p>

          <div className="mb-8 rounded-lg bg-gray-50 p-6">
            <div className="mb-2 text-4xl font-bold text-gray-900">
              {score}%
            </div>
            <div
              className={`text-lg font-semibold ${passed ? "text-green-600" : "text-red-600"}`}
            >
              {passed ? "Perfect Structure!" : "Review the Code Structure"}
            </div>
          </div>

          {explanation && (
            <div className="mb-8 rounded-lg bg-blue-50 p-6 text-left">
              <h3 className="mb-4 text-xl font-semibold text-blue-900">
                Code Explanation
              </h3>
              <p className="text-blue-800">{explanation}</p>
            </div>
          )}

          <div className="mb-8 space-y-4 text-left">
            <h3 className="text-xl font-semibold text-gray-900">
              Correct Order:
            </h3>
            <div className="rounded-lg bg-gray-900 p-4">
              {correctOrder.map((id, index) => {
                const block = codeBlocks.find((b) => b.id === id);
                const isCorrect = userOrder[index] === id;
                return (
                  <div
                    key={id}
                    className={`mb-2 rounded bg-gray-800 p-3 font-mono text-sm ${
                      isCorrect
                        ? "border-l-4 border-green-500"
                        : "border-l-4 border-red-500"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-green-400">{block?.code}</span>
                      <span
                        className={`text-xs ${isCorrect ? "text-green-400" : "text-red-400"}`}
                      >
                        {isCorrect ? "✓" : "✗"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={reset}
              className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
            >
              Try Again
            </button>
            <button
              onClick={() => onComplete(score, 100, passed)}
              className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-700"
            >
              Complete Activity
            </button>
          </div>
        </div>

        {/* Reward Animation */}
        {showRewardAnimation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative rounded-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 p-8 text-center shadow-2xl">
              <h3 className="mb-4 text-3xl font-bold text-white">
                🎉 Code Master! 🎉
              </h3>
              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-center space-x-3 rounded-lg bg-yellow-500/20 p-3">
                  <span className="text-xl font-semibold text-yellow-300">
                    +{activity.diamondReward || 50} Diamonds
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-3 rounded-lg bg-blue-500/20 p-3">
                  <Star className="h-8 w-8 text-blue-400" />
                  <span className="text-xl font-semibold text-blue-300">
                    +{activity.experienceReward || 75} Experience
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {activity.title}
        </h2>
        <p className="text-lg text-gray-600">{activity.description}</p>
      </div>

      <div className="mb-8 rounded-lg bg-blue-50 p-6">
        <h3 className="mb-4 text-xl font-semibold text-blue-900">
          Instructions
        </h3>
        <p className="text-blue-800">{instructions}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Available Blocks */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Available Code Blocks
          </h3>
          <div
            className="min-h-40 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4"
            onDragOver={handleDragOver}
            onDrop={handleDropToBlocks}
          >
            {blocks.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-gray-500">
                All blocks used! Drop here to return blocks.
              </div>
            ) : (
              <div className="space-y-2">
                {blocks.map((block) => (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={() => handleDragStart(block)}
                    className="cursor-move rounded-lg bg-white p-3 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex items-center space-x-3">
                      <Move className="h-4 w-4 text-gray-400" />
                      <code className="text-sm text-gray-800">
                        {block.code}
                      </code>
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {block.type}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Code Construction Area */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Build Your Code
          </h3>
          <div
            className="min-h-40 rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDropToArranged(e)}
          >
            {arrangedBlocks.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-blue-600">
                Drag code blocks here to build your program
              </div>
            ) : (
              <div className="rounded-lg bg-gray-900 p-4">
                {arrangedBlocks.map((block, index) => (
                  <div key={`${block.id}-${index}`} className="group relative">
                    <div
                      draggable
                      onDragStart={() => handleDragStart(block)}
                      className="mb-2 cursor-move rounded bg-gray-800 p-3 transition-all hover:bg-gray-700"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-gray-400">
                          {index + 1}.
                        </span>
                        <code className="text-sm text-green-400">
                          {block.code}
                        </code>
                      </div>
                    </div>

                    {/* Drop zone between blocks */}
                    <div
                      className="absolute -bottom-1 left-0 right-0 h-2 opacity-0 hover:opacity-100"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropToArranged(e, index + 1)}
                    >
                      <div className="h-1 rounded bg-blue-400"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="mb-4 text-sm text-gray-600">
          Progress: {arrangedBlocks.length}/{codeBlocks.length} blocks placed
        </div>
        <button
          onClick={checkOrder}
          disabled={arrangedBlocks.length !== codeBlocks.length}
          className="mr-4 rounded-lg bg-green-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Check Code Structure
        </button>
        <button
          onClick={reset}
          className="rounded-lg border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
