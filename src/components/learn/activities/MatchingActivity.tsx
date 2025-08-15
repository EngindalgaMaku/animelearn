"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Trophy,
  Star,
  Gift,
  Shuffle,
} from "lucide-react";

interface MatchPair {
  id: string;
  left: string;
  right: string;
}

interface MatchingContent {
  instructions: string;
  pairs: MatchPair[];
  timeLimit?: number;
  allowShuffle?: boolean;
  showProgress?: boolean;
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
  content: MatchingContent;
  settings?: any;
  tags: string[];
}

interface MatchingActivityProps {
  activity: LearningActivity;
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function MatchingActivity({
  activity,
  onComplete,
}: MatchingActivityProps) {
  const [leftItems, setLeftItems] = useState<string[]>([]);
  const [rightItems, setRightItems] = useState<string[]>([]);
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

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

  const { instructions, pairs, timeLimit, allowShuffle, showProgress } =
    activity.content;

  // Initialize game
  useEffect(() => {
    shuffleItems();
    if (timeLimit) {
      setTimeLeft(timeLimit);
    }
  }, []);

  // Timer effect (only when a valid timeLimit is provided)
  useEffect(() => {
    const hasTimer =
      typeof timeLimit === "number" &&
      !Number.isNaN(timeLimit) &&
      timeLimit > 0;
    if (!hasTimer) return; // No timer configured → never auto-submit

    if (gameStarted && timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (hasTimer && timeLeft === 0 && gameStarted && !showResults) {
      handleSubmit();
    }
  }, [timeLeft, gameStarted, showResults, timeLimit]);

  const shuffleItems = () => {
    const leftShuffled = [...pairs.map((p) => p.left)].sort(
      () => Math.random() - 0.5
    );
    const rightShuffled = [...pairs.map((p) => p.right)].sort(
      () => Math.random() - 0.5
    );
    setLeftItems(leftShuffled);
    setRightItems(rightShuffled);
  };

  const handleLeftClick = (item: string) => {
    if (selectedLeft === item) {
      setSelectedLeft(null);
    } else {
      setSelectedLeft(item);
      if (selectedRight) {
        createMatch(item, selectedRight);
      }
    }
  };

  const handleRightClick = (item: string) => {
    if (selectedRight === item) {
      setSelectedRight(null);
    } else {
      setSelectedRight(item);
      if (selectedLeft) {
        createMatch(selectedLeft, item);
      }
    }
  };

  const createMatch = (left: string, right: string) => {
    // Remove existing matches for these items
    const newMatches = { ...matches };
    Object.keys(newMatches).forEach((key) => {
      if (newMatches[key] === right) delete newMatches[key];
    });
    if (newMatches[left]) delete newMatches[left];

    // Create new match
    newMatches[left] = right;
    setMatches(newMatches);
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  const removeMatch = (left: string) => {
    const newMatches = { ...matches };
    delete newMatches[left];
    setMatches(newMatches);
  };

  const handleSubmit = () => {
    setShowResults(true);
    const correctMatches = pairs.filter(
      (pair) => matches[pair.left] === pair.right
    ).length;
    const score = Math.round((correctMatches / pairs.length) * 100);
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
            activityType: "matching",
            activityId: activity.id,
            activityTitle: activity.title,
            score: Math.max(70, score),
            timeSpent: 300,
            success: true,
            diamondReward: activity.diamondReward || 25,
            experienceReward: activity.experienceReward || 40,
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

  const restartGame = () => {
    // Reset selections and matches
    setMatches({});
    setSelectedLeft(null);
    setSelectedRight(null);
    setShowResults(false);
    // Reset timer if configured
    if (
      typeof timeLimit === "number" &&
      !Number.isNaN(timeLimit) &&
      timeLimit > 0
    ) {
      setTimeLeft(timeLimit);
    }
    // Optional: reshuffle to provide a new try feel
    shuffleItems();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!gameStarted) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            {activity.title}
          </h2>
          <p className="mb-8 text-lg text-gray-600">{activity.description}</p>

          <div className="mb-8 rounded-lg bg-green-50 p-6">
            <h3 className="mb-4 text-xl font-semibold text-green-900">
              Instructions
            </h3>
            <p className="mb-4 text-green-800">{instructions}</p>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
              <div className="flex items-center justify-center space-x-2">
                <Trophy className="h-5 w-5 text-green-600" />
                <span>{pairs.length} Pairs to Match</span>
              </div>
              {timeLimit && (
                <div className="flex items-center justify-center space-x-2">
                  <span>⏱️</span>
                  <span>{formatTime(timeLimit)} Time Limit</span>
                </div>
              )}
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>70% to Pass</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setGameStarted(true)}
            className="rounded-lg bg-green-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-green-700"
          >
            Start Matching
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const correctMatches = pairs.filter(
      (pair) => matches[pair.left] === pair.right
    ).length;
    const score = Math.round((correctMatches / pairs.length) * 100);
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
            {passed ? "Excellent Matching!" : "Keep Practicing!"}
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            You matched {correctMatches} out of {pairs.length} pairs correctly
          </p>

          <div className="mb-8 rounded-lg bg-gray-50 p-6">
            <div className="mb-2 text-4xl font-bold text-gray-900">
              {score}%
            </div>
            <div
              className={`text-lg font-semibold ${passed ? "text-green-600" : "text-red-600"}`}
            >
              {passed ? "Passed!" : "Try Again"}
            </div>
          </div>

          <div className="mb-8 space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Review Matches:
            </h3>
            {pairs.map((pair) => {
              const userMatch = matches[pair.left];
              const isCorrect = userMatch === pair.right;

              return (
                <div
                  key={pair.id}
                  className="rounded-lg border bg-white p-4 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="rounded bg-blue-50 px-3 py-2 font-medium text-blue-900">
                        {pair.left}
                      </div>
                      <div className="text-gray-400">→</div>
                      <div
                        className={`rounded px-3 py-2 font-medium ${
                          isCorrect
                            ? "bg-green-100 text-green-900"
                            : "bg-red-100 text-red-900"
                        }`}
                      >
                        {userMatch || "No match"}
                      </div>
                    </div>
                    <div
                      className={`rounded-full p-2 ${
                        isCorrect
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {isCorrect ? "✓" : "✗"}
                    </div>
                  </div>
                  {!isCorrect && (
                    <div className="mt-2 text-sm text-gray-600">
                      Correct answer:{" "}
                      <span className="font-medium text-green-600">
                        {pair.right}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {passed ? (
            <button
              onClick={() => onComplete(score, 100, true)}
              className="rounded-lg bg-green-600 px-6 py-3 font-bold text-white transition-colors hover:bg-green-700"
            >
              🎉 Finish & Claim Rewards
            </button>
          ) : (
            <button
              onClick={restartGame}
              className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-700"
            >
              Try Again
            </button>
          )}
        </div>

        {/* Reward Animation */}
        {showRewardAnimation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative rounded-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 p-8 text-center shadow-2xl">
              <h3 className="mb-4 text-3xl font-bold text-white">
                🎉 Congratulations! 🎉
              </h3>
              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-center space-x-3 rounded-lg bg-yellow-500/20 p-3">
                  <span className="text-xl font-semibold text-yellow-300">
                    +{activity.diamondReward || 25} Diamonds
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-3 rounded-lg bg-blue-500/20 p-3">
                  <Star className="h-8 w-8 text-blue-400" />
                  <span className="text-xl font-semibold text-blue-300">
                    +{activity.experienceReward || 40} Experience
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const progress = Object.keys(matches).length / pairs.length;

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{activity.title}</h2>
        <div className="flex items-center space-x-4">
          {timeLimit && timeLeft > 0 && (
            <div className="flex items-center space-x-2 text-green-600">
              <span>⏱️</span>
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          )}
          {allowShuffle && (
            <button
              onClick={shuffleItems}
              className="flex items-center space-x-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
            >
              <Shuffle className="h-4 w-4" />
              <span>Shuffle</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress */}
      {showProgress && (
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {Object.keys(matches).length}/{pairs.length} matches
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-green-600 transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Game Board */}
      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Match These:
          </h3>
          <div className="space-y-2">
            {leftItems.map((item) => (
              <button
                key={item}
                onClick={() => handleLeftClick(item)}
                className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                  selectedLeft === item
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : matches[item]
                      ? "border-green-300 bg-green-50 text-green-900"
                      : "border-gray-200 text-gray-900 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{item}</span>
                  {matches[item] && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        → {matches[item]}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMatch(item);
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✗
                      </button>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            With These:
          </h3>
          <div className="space-y-2">
            {rightItems.map((item) => {
              const isMatched = Object.values(matches).includes(item);
              return (
                <button
                  key={item}
                  onClick={() => handleRightClick(item)}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                    selectedRight === item
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : isMatched
                        ? "border-green-300 bg-green-50 text-green-900"
                        : "border-gray-200 text-gray-900 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={Object.keys(matches).length === 0}
          className="rounded-lg bg-green-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit Matches
        </button>
      </div>
    </div>
  );
}
