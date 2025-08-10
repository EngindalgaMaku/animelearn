"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Clock, Target, RotateCcw, Zap } from "lucide-react";

interface MemoryPair {
  id: number;
  card1: string;
  card2: string;
}

interface MemoryGameActivityProps {
  activity: {
    content: {
      instructions?: string;
      pairs: MemoryPair[];
      timeLimit?: number;
      shuffleCards?: boolean;
    };
    settings?: {
      maxFlips?: number;
      showTimer?: boolean;
    };
  };
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

interface Card {
  id: string;
  content: string;
  pairId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGameActivity({
  activity,
  onComplete,
}: MemoryGameActivityProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(activity?.content?.timeLimit || 180);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  // Validate activity data
  if (!activity?.content) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-lg font-semibold text-red-500">
          Invalid Activity Data
        </div>
        <p className="text-gray-600">
          This memory game doesn't have the required content configuration.
        </p>
      </div>
    );
  }

  const contentPairs = activity.content.pairs || [];

  if (contentPairs.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-lg font-semibold text-red-500">
          No Memory Pairs Available
        </div>
        <p className="text-gray-600">
          This memory game doesn't have any pairs to match.
        </p>
      </div>
    );
  }

  useEffect(() => {
    try {
      initializeGame();
    } catch (error) {
      console.error("Error initializing memory game:", error);
    }
  }, [activity]);

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isCompleted) {
      handleGameEnd();
    }
  }, [timeLeft, isCompleted]);

  useEffect(() => {
    if (
      matchedPairs.length === contentPairs.length &&
      matchedPairs.length > 0
    ) {
      handleGameEnd();
    }
  }, [matchedPairs]);

  const initializeGame = () => {
    try {
      const gameCards: Card[] = [];

      contentPairs.forEach((pair) => {
        if (pair?.id && pair?.card1 && pair?.card2) {
          gameCards.push(
            {
              id: `${pair.id}-1`,
              content: pair.card1,
              pairId: pair.id,
              isFlipped: false,
              isMatched: false,
            },
            {
              id: `${pair.id}-2`,
              content: pair.card2,
              pairId: pair.id,
              isFlipped: false,
              isMatched: false,
            }
          );
        }
      });

      if (activity?.content?.shuffleCards) {
        gameCards.sort(() => Math.random() - 0.5);
      }

      setCards(gameCards);
    } catch (error) {
      console.error("Error initializing game cards:", error);
    }
  };

  const handleCardClick = (cardId: string) => {
    if (isCompleted || flippedCards.length >= 2) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      setTimeout(() => checkForMatch(newFlippedCards), 1000);
    }
  };

  const checkForMatch = (flippedCardIds: string[]) => {
    const [card1Id, card2Id] = flippedCardIds;
    const card1 = cards.find((c) => c.id === card1Id);
    const card2 = cards.find((c) => c.id === card2Id);

    if (card1 && card2 && card1.pairId === card2.pairId) {
      // Match found
      setMatchedPairs((prev) => [...prev, card1.pairId]);
      setCards((prev) =>
        prev.map((c) =>
          c.pairId === card1.pairId ? { ...c, isMatched: true } : c
        )
      );
    } else {
      // No match - flip cards back
      setCards((prev) =>
        prev.map((c) =>
          flippedCardIds.includes(c.id) ? { ...c, isFlipped: false } : c
        )
      );
    }

    setFlippedCards([]);
  };

  const handleGameEnd = () => {
    try {
      setIsCompleted(true);
      const allPairsMatched = matchedPairs.length === contentPairs.length;
      const timeBonus = Math.max(0, timeLeft * 2);
      const movesPenalty = Math.max(0, moves - contentPairs.length) * 5;
      const finalScore = allPairsMatched
        ? Math.max(0, 100 + timeBonus - movesPenalty)
        : Math.round((matchedPairs.length / contentPairs.length) * 50);

      setScore(finalScore);

      if (allPairsMatched) {
        setFeedback(`🎉 Perfect! All pairs matched in ${moves} moves!`);
        onComplete(finalScore, 100, true);
      } else {
        setFeedback(
          `Good effort! You matched ${matchedPairs.length}/${contentPairs.length} pairs.`
        );
        onComplete(finalScore, 100, false);
      }
    } catch (error) {
      console.error("Error handling game end:", error);
      onComplete(0, 100, false);
    }
  };

  const resetGame = () => {
    try {
      setFlippedCards([]);
      setMatchedPairs([]);
      setMoves(0);
      setTimeLeft(activity?.content?.timeLimit || 180);
      setIsCompleted(false);
      setScore(0);
      setFeedback("");
      initializeGame();
    } catch (error) {
      console.error("Error resetting game:", error);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          {activity?.content?.instructions || "Match the pairs!"}
        </h2>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>
              {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="h-4 w-4" />
            <span>{moves} moves</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap className="h-4 w-4" />
            <span>
              {matchedPairs.length}/{contentPairs.length} pairs
            </span>
          </div>
          {score > 0 && (
            <div className="flex items-center space-x-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>Score: {score}</span>
            </div>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`mb-6 rounded-lg p-4 text-center font-medium ${
            matchedPairs.length === contentPairs.length
              ? "bg-green-100 text-green-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {feedback}
        </div>
      )}

      {/* Game Board */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        <AnimatePresence>
          {cards.map((card) => (
            <motion.div
              key={card.id}
              className={`perspective-1000 aspect-square cursor-pointer ${
                isCompleted ? "cursor-default" : ""
              }`}
              onClick={() => handleCardClick(card.id)}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={!isCompleted ? { scale: 1.05 } : {}}
              whileTap={!isCompleted ? { scale: 0.95 } : {}}
            >
              <div
                className={`transform-style-3d relative h-full w-full transition-transform duration-500 ${
                  card.isFlipped || card.isMatched ? "rotate-y-180" : ""
                }`}
              >
                {/* Card Back */}
                <div className="backface-hidden absolute inset-0 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <div className="text-2xl text-white">?</div>
                </div>

                {/* Card Front */}
                <div
                  className={`backface-hidden rotate-y-180 absolute inset-0 flex items-center justify-center rounded-lg p-2 text-center text-sm font-medium ${
                    card.isMatched
                      ? "border-2 border-green-300 bg-green-100 text-green-800"
                      : "border-2 border-gray-200 bg-white text-gray-900"
                  }`}
                >
                  {card.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        {isCompleted ? (
          <button
            onClick={resetGame}
            className="flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Play Again</span>
          </button>
        ) : (
          <div className="text-sm text-gray-500">
            Click cards to flip them and find matching pairs!
          </div>
        )}
      </div>
    </div>
  );
}
