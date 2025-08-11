"use client";

import { useState, useEffect } from "react";
import { RotateCcw, Trophy, Clock, Star } from "lucide-react";

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
  content: MemoryContent;
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

  const endGame = (won: boolean) => {
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

    onComplete(Math.round(score), 100, won);
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
          <p className="mb-8 text-lg text-gray-600">{activity.description}</p>

          <div className="mb-8 rounded-lg bg-purple-50 p-6">
            <h3 className="mb-4 text-xl font-semibold text-purple-900">
              Game Rules
            </h3>
            <p className="mb-4 text-purple-800">{rules}</p>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
              <div className="flex items-center justify-center space-x-2">
                <Star className="h-5 w-5 text-purple-600" />
                <span>{cards.length} Pairs to Match</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span>{formatTime(timeLimit)} Time Limit</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Trophy className="h-5 w-5 text-purple-600" />
                <span>Score: Speed + Accuracy</span>
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="rounded-lg bg-purple-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-purple-700"
          >
            Start Memory Game
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

          <button
            onClick={restartGame}
            className="inline-flex items-center space-x-2 rounded-lg bg-purple-600 px-6 py-3 font-bold text-white transition-colors hover:bg-purple-700"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Play Again</span>
          </button>
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
