"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, RotateCcw, Trophy, Sparkles } from "lucide-react";

interface MatchItem {
  id: string;
  content: string;
  type: "variable" | "value" | "datatype";
  matchGroup: string;
  emoji: string;
}

const gameData: MatchItem[] = [
  // Group 1: Character Name
  {
    id: "var1",
    content: "character_name",
    type: "variable",
    matchGroup: "name",
    emoji: "👤",
  },
  {
    id: "val1",
    content: '"Naruto Uzumaki"',
    type: "value",
    matchGroup: "name",
    emoji: "🎌",
  },
  {
    id: "type1",
    content: "string",
    type: "datatype",
    matchGroup: "name",
    emoji: "📝",
  },

  // Group 2: Power Level
  {
    id: "var2",
    content: "power_level",
    type: "variable",
    matchGroup: "power",
    emoji: "⚡",
  },
  {
    id: "val2",
    content: "9001",
    type: "value",
    matchGroup: "power",
    emoji: "💥",
  },
  {
    id: "type2",
    content: "integer",
    type: "datatype",
    matchGroup: "power",
    emoji: "🔢",
  },

  // Group 3: Is Hokage
  {
    id: "var3",
    content: "is_hokage",
    type: "variable",
    matchGroup: "boolean",
    emoji: "👑",
  },
  {
    id: "val3",
    content: "True",
    type: "value",
    matchGroup: "boolean",
    emoji: "✅",
  },
  {
    id: "type3",
    content: "boolean",
    type: "datatype",
    matchGroup: "boolean",
    emoji: "🔘",
  },
];

export default function VariableMatchingGame({
  onComplete,
}: {
  onComplete?: (score: number) => void;
}) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, MatchItem[]>>({
    name: [],
    power: [],
    boolean: [],
  });
  const [availableItems, setAvailableItems] = useState<MatchItem[]>(gameData);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, group: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    const item = availableItems.find((i) => i.id === draggedItem);
    if (!item || item.matchGroup !== group) {
      // Wrong match - show error animation
      return;
    }

    // Correct match!
    setMatches((prev) => ({
      ...prev,
      [group]: [...prev[group], item],
    }));

    setAvailableItems((prev) => prev.filter((i) => i.id !== draggedItem));
    setScore((prev) => prev + 10);
    setDraggedItem(null);
  };

  const resetGame = () => {
    setMatches({ name: [], power: [], boolean: [] });
    setAvailableItems(gameData);
    setScore(0);
    setGameCompleted(false);
    setShowCelebration(false);
  };

  useEffect(() => {
    const allGroupsComplete = Object.values(matches).every(
      (group) => group.length === 3
    );
    if (allGroupsComplete && !gameCompleted) {
      setGameCompleted(true);
      setShowCelebration(true);
      onComplete?.(score);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [matches, gameCompleted, score, onComplete]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "variable":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "value":
        return "bg-green-100 border-green-300 text-green-800";
      case "datatype":
        return "bg-purple-100 border-purple-300 text-purple-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  return (
    <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-2xl font-bold text-blue-800">
          🎯 Variable Matching Game
          <Sparkles className="h-6 w-6 text-yellow-500" />
        </h3>
        <div className="flex items-center gap-4">
          <div className="rounded-lg border border-blue-200 bg-white px-3 py-1">
            <span className="font-bold text-blue-800">Score: {score}</span>
          </div>
          <button
            onClick={resetGame}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1 text-white transition-colors hover:bg-blue-700"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-2 text-gray-700">
          Drag items to their correct groups:
        </p>
        <div className="flex gap-2 text-sm">
          <span className="rounded bg-blue-100 px-2 py-1 text-blue-800">
            🔵 Variables
          </span>
          <span className="rounded bg-green-100 px-2 py-1 text-green-800">
            🟢 Values
          </span>
          <span className="rounded bg-purple-100 px-2 py-1 text-purple-800">
            🟣 Data Types
          </span>
        </div>
      </div>

      {/* Available Items */}
      <div className="mb-6">
        <h4 className="mb-3 text-lg font-semibold text-gray-800">
          Available Items:
        </h4>
        <div className="flex flex-wrap gap-3">
          {availableItems.map((item) => (
            <motion.div
              key={item.id}
              draggable
              onDragStart={(e) => handleDragStart(e as any, item.id)}
              className={`cursor-move rounded-lg border-2 px-4 py-2 transition-all hover:scale-105 ${getTypeColor(item.type)}`}
              whileHover={{ scale: 1.05 }}
              whileDrag={{ scale: 1.1, rotate: 5 }}
            >
              <span className="mr-2">{item.emoji}</span>
              {item.content}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Drop Zones */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { group: "name", title: "👤 Character Name", emoji: "🎌" },
          { group: "power", title: "⚡ Power Level", emoji: "💥" },
          { group: "boolean", title: "👑 Is Hokage", emoji: "✅" },
        ].map(({ group, title, emoji }) => (
          <div
            key={group}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, group)}
            className="min-h-[200px] rounded-xl border-2 border-dashed border-gray-300 bg-white/50 p-4 transition-colors hover:border-blue-400 hover:bg-blue-50/50"
          >
            <h5 className="mb-3 text-center text-lg font-semibold text-gray-800">
              {title}
            </h5>
            <div className="space-y-2">
              <AnimatePresence>
                {matches[group].map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-lg border-2 px-3 py-2 ${getTypeColor(item.type)} flex items-center justify-between`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.emoji}</span>
                      {item.content}
                    </span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </motion.div>
                ))}
              </AnimatePresence>
              {matches[group].length < 3 && (
                <div className="py-8 text-center text-gray-400">
                  Drop {3 - matches[group].length} more items
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Celebration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <div className="rounded-2xl bg-white p-8 text-center shadow-2xl">
              <div className="mb-4 text-6xl">🎉</div>
              <h3 className="mb-2 text-2xl font-bold text-green-600">
                Congratulations!
              </h3>
              <p className="mb-4 text-gray-700">
                You matched all variables correctly!
              </p>
              <div className="flex items-center justify-center gap-2 text-yellow-600">
                <Trophy className="h-6 w-6" />
                <span className="text-xl font-bold">Final Score: {score}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
