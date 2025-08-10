"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  X,
  Clock,
  Trophy,
  Target,
  RotateCcw,
  Shuffle,
} from "lucide-react";

interface MatchPair {
  id: string;
  left?: string;
  right?: string;
  code?: string;
  complexity?: string;
  category?: string;
  explanation?: string;
}

interface MatchingActivityProps {
  activity: {
    content: {
      instructions?: string;
      pairs?: MatchPair[];
      timeLimit?: number;
      allowShuffle?: boolean;
      showProgress?: boolean;
      categories?: string[];
    };
  };
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function MatchingActivity({
  activity,
  onComplete,
}: MatchingActivityProps) {
  const [leftItems, setLeftItems] = useState<
    Array<{ id: string; content: string; matched: boolean }>
  >([]);
  const [rightItems, setRightItems] = useState<
    Array<{ id: string; content: string; matched: boolean }>
  >([]);
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(activity.content?.timeLimit || 300);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [correctMatches, setCorrectMatches] = useState(0);

  // Handle missing or invalid data
  const pairs = activity.content?.pairs || [];

  if (pairs.length === 0) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-8">
          <div className="mb-4 text-yellow-600">⚠️</div>
          <h3 className="mb-2 text-lg font-semibold text-yellow-900">
            No Matching Pairs Available
          </h3>
          <p className="text-yellow-800">
            This matching activity doesn't have any pairs configured.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    initializeItems();
  }, [activity]);

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isCompleted) {
      handleComplete();
    }
  }, [timeLeft, isCompleted]);

  const initializeItems = () => {
    const shuffledPairs = [...pairs];
    if (activity.content?.allowShuffle) {
      shuffledPairs.sort(() => Math.random() - 0.5);
    }

    const leftList = shuffledPairs.map((pair) => ({
      id: pair.id || String(Math.random()),
      content: pair.left || pair.code || "Left Item",
      matched: false,
    }));

    const rightList = [...shuffledPairs].map((pair) => ({
      id: pair.id || String(Math.random()),
      content: pair.right || pair.complexity || "Right Item",
      matched: false,
    }));

    if (activity.content?.allowShuffle) {
      rightList.sort(() => Math.random() - 0.5);
    }

    setLeftItems(leftList);
    setRightItems(rightList);
  };

  const handleLeftClick = (id: string) => {
    if (leftItems.find((item) => item.id === id)?.matched) return;

    setSelectedLeft(selectedLeft === id ? null : id);
    setSelectedRight(null);
  };

  const handleRightClick = (id: string) => {
    if (rightItems.find((item) => item.id === id)?.matched) return;

    setSelectedRight(selectedRight === id ? null : id);

    if (selectedLeft && selectedLeft !== id) {
      attemptMatch(selectedLeft, id);
    }
  };

  const attemptMatch = (leftId: string, rightId: string) => {
    setAttempts(attempts + 1);

    const isCorrectMatch = leftId === rightId;

    if (isCorrectMatch) {
      // Correct match
      setMatches({
        ...matches,
        [leftId]: rightId,
      });

      setLeftItems((prev) =>
        prev.map((item) =>
          item.id === leftId ? { ...item, matched: true } : item
        )
      );

      setRightItems((prev) =>
        prev.map((item) =>
          item.id === rightId ? { ...item, matched: true } : item
        )
      );

      setCorrectMatches(correctMatches + 1);

      // Check if all matches are completed
      if (correctMatches + 1 === pairs.length) {
        setTimeout(() => handleComplete(), 500);
      }
    }

    // Reset selections
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const handleComplete = () => {
    setIsCompleted(true);

    const accuracyScore =
      attempts > 0 ? Math.round((correctMatches / attempts) * 100) : 0;
    const timeBonus =
      timeLeft > 0
        ? Math.round((timeLeft / (activity.content?.timeLimit || 300)) * 20)
        : 0;
    const finalScore = Math.min(100, accuracyScore + timeBonus);

    setScore(finalScore);
    onComplete(finalScore, 100, correctMatches === pairs.length);
  };

  const resetActivity = () => {
    setMatches({});
    setSelectedLeft(null);
    setSelectedRight(null);
    setIsCompleted(false);
    setScore(0);
    setAttempts(0);
    setCorrectMatches(0);
    setTimeLeft(activity.content?.timeLimit || 300);
    initializeItems();
  };

  const shuffleItems = () => {
    if (!activity.content?.allowShuffle) return;

    setLeftItems((prev) => [...prev].sort(() => Math.random() - 0.5));
    setRightItems((prev) => [...prev].sort(() => Math.random() - 0.5));
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  if (isCompleted) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <div className="mb-6">
          <Trophy className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Matching Complete!
          </h2>
          <div className="mb-4 text-lg text-gray-600">
            You scored {score}% with {correctMatches}/{pairs.length} correct
            matches
          </div>

          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="text-2xl font-bold text-blue-600">
                {correctMatches}
              </div>
              <div className="text-sm text-blue-800">Correct Matches</div>
            </div>
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
              <div className="text-2xl font-bold text-purple-600">
                {attempts}
              </div>
              <div className="text-sm text-purple-800">Total Attempts</div>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="text-2xl font-bold text-green-600">
                {attempts > 0
                  ? Math.round((correctMatches / attempts) * 100)
                  : 0}
                %
              </div>
              <div className="text-sm text-green-800">Accuracy</div>
            </div>
          </div>

          <div
            className={`mb-6 rounded-lg p-4 font-medium ${
              score >= 70
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {score >= 70
              ? "🎉 Excellent matching! You have great pattern recognition skills!"
              : "💪 Good effort! Practice more to improve your matching accuracy."}
          </div>
        </div>

        <button
          onClick={resetActivity}
          className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Try Again</span>
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
            <Target className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">
              Matching Activity
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
                Progress: {correctMatches}/{pairs.length}
              </div>
            )}
          </div>
        </div>

        {activity.content?.instructions && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-blue-800">{activity.content.instructions}</p>
          </div>
        )}

        {/* Controls */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div>Attempts: {attempts}</div>
            <div>Correct: {correctMatches}</div>
            <div>
              Accuracy:{" "}
              {attempts > 0 ? Math.round((correctMatches / attempts) * 100) : 0}
              %
            </div>
          </div>

          {activity.content?.allowShuffle && (
            <button
              onClick={shuffleItems}
              className="inline-flex items-center space-x-1 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200"
            >
              <Shuffle className="h-4 w-4" />
              <span>Shuffle</span>
            </button>
          )}
        </div>
      </div>

      {/* Matching Interface */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-3">
          <h3 className="mb-4 text-center text-lg font-semibold text-gray-900">
            Select from here
          </h3>
          {leftItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => handleLeftClick(item.id)}
              disabled={item.matched}
              className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                item.matched
                  ? "cursor-not-allowed border-green-300 bg-green-50 text-green-800"
                  : selectedLeft === item.id
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
              }`}
              whileHover={!item.matched ? { scale: 1.02 } : {}}
              whileTap={!item.matched ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.content}</span>
                {item.matched && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                {selectedLeft === item.id && !item.matched && (
                  <div className="h-3 w-3 animate-pulse rounded-full bg-blue-500"></div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Center Connector */}
        <div className="hidden items-center justify-center md:flex">
          <div className="text-6xl text-gray-300">⟷</div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <h3 className="mb-4 text-center text-lg font-semibold text-gray-900">
            Match with these
          </h3>
          {rightItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => handleRightClick(item.id)}
              disabled={item.matched}
              className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                item.matched
                  ? "cursor-not-allowed border-green-300 bg-green-50 text-green-800"
                  : selectedRight === item.id
                    ? "border-purple-500 bg-purple-50 text-purple-900"
                    : selectedLeft
                      ? "bg-purple-25 border-purple-200 text-gray-700 hover:border-purple-400 hover:bg-purple-100"
                      : "cursor-not-allowed border-gray-300 bg-gray-50 text-gray-500"
              }`}
              whileHover={!item.matched && selectedLeft ? { scale: 1.02 } : {}}
              whileTap={!item.matched && selectedLeft ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.content}</span>
                {item.matched && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                {selectedRight === item.id && !item.matched && (
                  <div className="h-3 w-3 animate-pulse rounded-full bg-purple-500"></div>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          💡 Click an item on the left, then click its match on the right.
          {activity.content?.allowShuffle &&
            " Use the shuffle button to rearrange items."}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6">
        <div className="h-3 w-full rounded-full bg-gray-200">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
            style={{ width: `${(correctMatches / pairs.length) * 100}%` }}
          />
        </div>
        <div className="mt-2 text-center text-sm text-gray-600">
          {correctMatches} of {pairs.length} matches completed
        </div>
      </div>
    </div>
  );
}
