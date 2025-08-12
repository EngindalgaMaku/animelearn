"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  RotateCcw,
  Shuffle,
  Trophy,
  Star,
  Gift,
  Sparkles,
} from "lucide-react";

interface Pair {
  left: string;
  right: string;
  explanation: string;
}

interface MatchingContent {
  pairs: Pair[];
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

interface MatchingActivityProps {
  activity: LearningActivity;
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

interface MatchingItem {
  id: string;
  content: string;
  type: "left" | "right";
  pairIndex: number;
  isMatched: boolean;
}

export default function MatchingActivity({
  activity,
  onComplete,
}: MatchingActivityProps) {
  const [leftItems, setLeftItems] = useState<MatchingItem[]>([]);
  const [rightItems, setRightItems] = useState<MatchingItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MatchingItem | null>(null);
  const [matches, setMatches] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [rewardAwarded, setRewardAwarded] = useState(false);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on component mount
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

  const { pairs } = activity.content;

  useEffect(() => {
    initializeItems();
  }, []);

  const initializeItems = () => {
    const leftItemsArray: MatchingItem[] = pairs.map((pair, index) => ({
      id: `left-${index}`,
      content: pair.left,
      type: "left",
      pairIndex: index,
      isMatched: false,
    }));

    const rightItemsArray: MatchingItem[] = pairs.map((pair, index) => ({
      id: `right-${index}`,
      content: pair.right,
      type: "right",
      pairIndex: index,
      isMatched: false,
    }));

    // Shuffle the right items to make it challenging
    const shuffledRightItems = [...rightItemsArray].sort(
      () => Math.random() - 0.5
    );

    setLeftItems(leftItemsArray);
    setRightItems(shuffledRightItems);
  };

  const handleItemClick = (item: MatchingItem) => {
    if (item.isMatched) return;

    if (!selectedItem) {
      setSelectedItem(item);
    } else if (selectedItem.id === item.id) {
      // Deselect the same item
      setSelectedItem(null);
    } else if (selectedItem.type === item.type) {
      // Select a different item of the same type
      setSelectedItem(item);
    } else {
      // Try to match items of different types
      setAttempts((prev) => prev + 1);

      if (selectedItem.pairIndex === item.pairIndex) {
        // Correct match!
        const newMatches = {
          ...matches,
          [selectedItem.id]: item.id,
          [item.id]: selectedItem.id,
        };
        setMatches(newMatches);

        // Update items to mark as matched
        setLeftItems((prev) =>
          prev.map((leftItem) =>
            leftItem.id === selectedItem.id || leftItem.id === item.id
              ? { ...leftItem, isMatched: true }
              : leftItem
          )
        );
        setRightItems((prev) =>
          prev.map((rightItem) =>
            rightItem.id === selectedItem.id || rightItem.id === item.id
              ? { ...rightItem, isMatched: true }
              : rightItem
          )
        );

        // Check if all pairs are matched
        if (Object.keys(newMatches).length / 2 === pairs.length) {
          completeActivity();
        }
      }

      setSelectedItem(null);
    }
  };

  const completeActivity = async () => {
    setShowResults(true);
    const correctMatches = Object.keys(matches).length / 2;
    const accuracy = (correctMatches / pairs.length) * 100;
    const efficiency = Math.max(0, 100 - (attempts - pairs.length) * 5); // Penalty for extra attempts
    const finalScore = Math.round((accuracy + efficiency) / 2);
    setScore(finalScore);

    const success = finalScore >= 70;

    if (success) {
      await handleActivityCompletion();
    }

    // Don't auto-complete - let user manually complete
  };

  const handleManualComplete = () => {
    const correctMatches = Object.keys(matches).length / 2;
    const accuracy = (correctMatches / pairs.length) * 100;
    const efficiency = Math.max(0, 100 - (attempts - pairs.length) * 5);
    const finalScore = Math.round((accuracy + efficiency) / 2);
    const success = finalScore >= 70;
    onComplete(finalScore, 100, success);
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
            activityType: "matching",
            activityId: activity.id,
            activityTitle: activity.title,
            score: Math.max(70, score),
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
  };

  const handleCloseLoginMessage = () => {
    setIsCompleted(false);
  };

  const shuffleItems = () => {
    const shuffledRight = [...rightItems].sort(() => Math.random() - 0.5);
    setRightItems(shuffledRight);
    setSelectedItem(null);
  };

  const resetActivity = () => {
    setMatches({});
    setSelectedItem(null);
    setShowResults(false);
    setAttempts(0);
    setScore(0);
    initializeItems();
  };

  const isSelected = (item: MatchingItem) => selectedItem?.id === item.id;
  const isMatched = (item: MatchingItem) => item.isMatched;
  const getMatchedPartner = (item: MatchingItem) => {
    const partnerId = matches[item.id];
    return partnerId
      ? [...leftItems, ...rightItems].find((i) => i.id === partnerId)
      : null;
  };

  if (showResults) {
    const correctMatches = Object.keys(matches).length / 2;

    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="text-center">
          <div
            className={`mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full ${
              score >= 70
                ? "bg-green-100 text-green-600"
                : "bg-orange-100 text-orange-600"
            }`}
          >
            <Trophy className="h-10 w-10" />
          </div>

          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            {score >= 70 ? "Excellent Matching!" : "Good Progress!"}
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            You matched {correctMatches} out of {pairs.length} pairs correctly
          </p>

          <div className="mb-8 rounded-lg bg-gray-50 p-6">
            <div className="mb-2 text-4xl font-bold text-gray-900">
              {score}%
            </div>
            <div
              className={`text-lg font-semibold ${score >= 70 ? "text-green-600" : "text-orange-600"}`}
            >
              {score >= 70 ? "Matching Master!" : "Keep Practicing!"}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-900">
                  {correctMatches}/{pairs.length}
                </div>
                <div className="text-gray-600">Correct Matches</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">{attempts}</div>
                <div className="text-gray-600">Total Attempts</div>
              </div>
            </div>
          </div>

          {/* Show explanations for all pairs */}
          <div className="mb-8 text-left">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Review: Understanding the Matches
            </h3>
            <div className="space-y-3">
              {pairs.map((pair, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-white p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                        {pair.left}
                      </div>
                      <span className="text-gray-400">↔</span>
                      <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                        {pair.right}
                      </div>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-sm italic text-gray-600">
                    {pair.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {isCompleted && !isAuthenticated ? (
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
                    <strong>{activity.diamondReward || 50} diamonds</strong> and{" "}
                    <strong>{activity.experienceReward || 100} XP</strong> for
                    completing activities!
                  </p>
                </div>
              </div>
            ) : isCompleted ? (
              <div className="text-center">
                <div className="mb-3 rounded-lg border border-green-200 bg-green-50 p-3">
                  <div className="mb-2 flex items-center justify-center space-x-2">
                    <Trophy className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-semibold text-green-900">
                      Matching Complete!
                    </span>
                  </div>
                  <p className="mb-3 text-xs text-green-800">
                    You've successfully completed all the matches. Review the
                    explanations above and claim your rewards!
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
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {activity.title}
        </h2>
        <p className="mb-6 text-lg text-gray-600">{activity.description}</p>

        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 font-semibold text-blue-900">Instructions:</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>
              • Click items from the left and right columns to match pairs
            </li>
            <li>• Correctly matched pairs will be highlighted and locked</li>
            <li>• Try to match all pairs with the fewest attempts possible</li>
          </ul>
        </div>
      </div>

      {/* Progress and Controls */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="text-sm text-gray-600">
            Matched:{" "}
            <span className="font-semibold text-green-600">
              {Object.keys(matches).length / 2}/{pairs.length}
            </span>
          </div>
          <div className="text-sm text-gray-600">
            Attempts:{" "}
            <span className="font-semibold text-blue-600">{attempts}</span>
          </div>
        </div>
        <button
          onClick={shuffleItems}
          className="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
        >
          <Shuffle className="h-4 w-4" />
          <span>Shuffle</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-green-600 transition-all duration-300"
            style={{
              width: `${(Object.keys(matches).length / 2 / pairs.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Matching Interface */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-3">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Match these items...
          </h3>
          {leftItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                isMatched(item)
                  ? "border-green-500 bg-green-50 text-green-800"
                  : isSelected(item)
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.content}</span>
                {isMatched(item) && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            ...with these items
          </h3>
          {rightItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                isMatched(item)
                  ? "border-green-500 bg-green-50 text-green-800"
                  : isSelected(item)
                    ? "border-blue-500 bg-blue-50 text-blue-900"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{item.content}</span>
                {isMatched(item) && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hint */}
      {selectedItem && (
        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            💡 You selected: <strong>{selectedItem.content}</strong>. Now click
            an item from the {selectedItem.type === "left" ? "right" : "left"}{" "}
            column to make a match.
          </p>
        </div>
      )}
    </div>
  );
}
