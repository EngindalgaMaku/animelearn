"use client";

import { useState, useEffect } from "react";
import {
  RotateCcw,
  Trophy,
  Clock,
  Star,
  Gift,
  Sparkles,
  Play,
} from "lucide-react";

interface Card {
  id: number;
  front: string;
  back: string;
}

interface MemoryContent {
  cards: Card[];
  rules: string;
  timeLimit: number;
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
  content: MemoryContent;
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

interface MemoryGameActivityProps {
  activity: LearningActivity;
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

interface GameCard extends Card {
  isFlipped: boolean;
  isMatched: boolean;
  gameId: string;
  type: "front" | "back";
}

export default function MemoryGameActivity({
  activity,
  onComplete,
}: MemoryGameActivityProps) {
  const [gameCards, setGameCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<GameCard[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(activity.content.timeLimit);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
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

  const { cards, rules, timeLimit } = activity.content;

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameCompleted) {
      endGame(false);
    }
  }, [timeLeft, gameStarted, gameCompleted]);

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(moves + 1);
      const [card1, card2] = flippedCards;

      // Check if cards form a matching pair
      const isMatch =
        (card1.type === "front" &&
          card2.type === "back" &&
          card1.id === card2.id) ||
        (card1.type === "back" &&
          card2.type === "front" &&
          card1.id === card2.id);

      if (isMatch) {
        // Match found
        setTimeout(() => {
          setGameCards((prev) =>
            prev.map((card) =>
              card.gameId === card1.gameId || card.gameId === card2.gameId
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatchedPairs((prev) => prev + 1);
          setFlippedCards([]);
        }, 1000);
      } else {
        // No match, flip cards back
        setTimeout(() => {
          setGameCards((prev) =>
            prev.map((card) =>
              card.gameId === card1.gameId || card.gameId === card2.gameId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1500);
      }
    }
  }, [flippedCards, moves]);

  // Check for game completion
  useEffect(() => {
    if (matchedPairs === cards.length && gameStarted) {
      endGame(true);
    }
  }, [matchedPairs, cards.length, gameStarted]);

  const initializeGame = () => {
    // Create pairs of cards (front and back for each original card)
    const gameCardPairs: GameCard[] = [];

    cards.forEach((card) => {
      gameCardPairs.push({
        ...card,
        gameId: `${card.id}-front`,
        type: "front",
        isFlipped: false,
        isMatched: false,
      });
      gameCardPairs.push({
        ...card,
        gameId: `${card.id}-back`,
        type: "back",
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle the cards
    const shuffledCards = [...gameCardPairs].sort(() => Math.random() - 0.5);
    setGameCards(shuffledCards);
  };

  const handleCardClick = (clickedCard: GameCard) => {
    if (
      !gameStarted ||
      clickedCard.isFlipped ||
      clickedCard.isMatched ||
      flippedCards.length === 2
    ) {
      return;
    }

    const updatedCards = gameCards.map((card) =>
      card.gameId === clickedCard.gameId ? { ...card, isFlipped: true } : card
    );

    setGameCards(updatedCards);
    setFlippedCards([...flippedCards, clickedCard]);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const endGame = async (won: boolean) => {
    setGameCompleted(true);
    setGameWon(won);

    // Calculate score based on performance
    let score = 0;
    if (won) {
      const timeBonus = Math.max(0, (timeLeft / timeLimit) * 30);
      const movesPenalty = Math.max(0, (moves - cards.length * 1.5) * 2);
      score = Math.min(100, Math.max(50, 70 + timeBonus - movesPenalty));
    } else {
      score = Math.min(49, (matchedPairs / cards.length) * 40);
    }

    if (won) {
      await handleActivityCompletion(Math.round(score));
    }

    // Don't auto-complete - let user manually complete
  };

  const handleManualComplete = () => {
    let score = 0;
    if (gameWon) {
      const timeBonus = Math.max(0, (timeLeft / timeLimit) * 30);
      const movesPenalty = Math.max(0, (moves - cards.length * 1.5) * 2);
      score = Math.min(100, Math.max(50, 70 + timeBonus - movesPenalty));
    } else {
      score = Math.min(49, (matchedPairs / cards.length) * 40);
    }
    onComplete(Math.round(score), 100, gameWon);
  };

  const handleActivityCompletion = async (score: number) => {
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
            activityType: "memory_game",
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

  const restartGame = () => {
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTimeLeft(timeLimit);
    setGameStarted(false);
    setGameCompleted(false);
    setGameWon(false);
    initializeGame();
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
          <p className="mb-8 text-lg text-black">{activity.description}</p>

          <div className="mb-8 rounded-lg bg-purple-50 p-6">
            <h3 className="mb-4 text-xl font-semibold text-purple-900">
              Game Rules
            </h3>
            <p className="mb-4 text-black">{rules}</p>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
              <div className="flex items-center justify-center space-x-2">
                <Star className="h-5 w-5 text-purple-600" />
                <span className="text-black">
                  {cards.length} Pairs to Match
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span className="text-black">
                  {formatTime(timeLimit)} Time Limit
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Trophy className="h-5 w-5 text-purple-600" />
                <span className="text-black">Score: Speed + Accuracy</span>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="inline-flex transform items-center space-x-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-10 py-4 text-xl font-bold text-white shadow-xl transition-all hover:scale-105 hover:from-purple-700 hover:to-pink-700 hover:shadow-2xl"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <Play className="h-5 w-5" />
            </div>
            <span>🎮 START GAME</span>
          </button>
        </div>
      </div>
    );
  }

  if (gameCompleted) {
    const score = gameWon
      ? Math.min(
          100,
          Math.max(
            50,
            70 +
              (timeLeft / timeLimit) * 30 -
              Math.max(0, (moves - cards.length * 1.5) * 2)
          )
        )
      : Math.min(49, (matchedPairs / cards.length) * 40);

    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="text-center">
          <div
            className={`mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full ${
              gameWon
                ? "bg-green-100 text-green-600"
                : "bg-orange-100 text-orange-600"
            }`}
          >
            <Trophy className="h-10 w-10" />
          </div>

          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            {gameWon ? "Excellent Memory!" : "Good Effort!"}
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            You matched {matchedPairs} out of {cards.length} pairs in {moves}{" "}
            moves
          </p>

          <div className="mb-8 rounded-lg bg-gray-50 p-6">
            <div className="mb-2 text-4xl font-bold text-gray-900">
              {Math.round(score)}%
            </div>
            <div
              className={`text-lg font-semibold ${gameWon ? "text-green-600" : "text-orange-600"}`}
            >
              {gameWon ? "Memory Master!" : "Keep Practicing!"}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold text-gray-900">
                  {matchedPairs}
                </div>
                <div className="text-gray-600">Pairs Matched</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">{moves}</div>
                <div className="text-gray-600">Total Moves</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {formatTime(timeLimit - timeLeft)}
                </div>
                <div className="text-gray-600">Time Used</div>
              </div>
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
                      Memory Game Complete!
                    </span>
                  </div>
                  <p className="mb-3 text-xs text-green-800">
                    You've successfully completed the memory challenge. Check
                    your performance above and claim your rewards!
                  </p>
                  <button
                    onClick={handleManualComplete}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                  >
                    🎉 Complete Game & Claim Rewards
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={restartGame}
                className="inline-flex items-center space-x-2 rounded-lg bg-purple-600 px-6 py-3 font-bold text-white transition-colors hover:bg-purple-700"
              >
                <RotateCcw className="h-5 w-5" />
                <span>Play Again</span>
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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{activity.title}</h2>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-purple-600">
            <Clock className="h-5 w-5" />
            <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
          </div>
          <div className="text-sm text-gray-600">
            Moves: <span className="font-semibold">{moves}</span>
          </div>
          <div className="text-sm text-gray-600">
            Matched:{" "}
            <span className="font-semibold">
              {matchedPairs}/{cards.length}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">
            {Math.round((matchedPairs / cards.length) * 100)}% Complete
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-purple-600 transition-all duration-300"
            style={{ width: `${(matchedPairs / cards.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Game Board */}
      <div
        className={`grid gap-4 ${
          gameCards.length <= 8
            ? "grid-cols-4"
            : gameCards.length <= 12
              ? "grid-cols-4 md:grid-cols-6"
              : "grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
        }`}
      >
        {gameCards.map((card) => (
          <div
            key={card.gameId}
            onClick={() => handleCardClick(card)}
            className={`relative h-24 transform cursor-pointer transition-all duration-300 hover:scale-105 ${
              card.isMatched ? "opacity-50" : ""
            }`}
          >
            <div
              className={`h-full w-full transform-gpu rounded-lg border-2 transition-all duration-500 ${
                card.isFlipped || card.isMatched
                  ? "border-purple-300 bg-white shadow-md"
                  : "border-purple-700 bg-purple-600 shadow-lg hover:bg-purple-700"
              } ${card.isFlipped || card.isMatched ? "rotate-y-180" : ""}`}
            >
              {card.isFlipped || card.isMatched ? (
                <div className="flex h-full w-full items-center justify-center p-2">
                  <span className="text-center text-sm font-semibold leading-tight text-gray-900">
                    {card.type === "front" ? card.front : card.back}
                  </span>
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-purple-400 opacity-50"></div>
                </div>
              )}
            </div>

            {card.isMatched && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-green-500 p-1 text-white">
                  <Trophy className="h-4 w-4" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Hint */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          💡 Tip: Remember the positions of cards you've seen to make matches
          faster!
        </p>
      </div>
    </div>
  );
}
