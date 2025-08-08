"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Lock,
  Play,
  Trophy,
  Star,
  Zap,
  Target,
  BookOpen,
} from "lucide-react";
import VariableMatchingGame from "./VariableMatchingGame";
import CodePuzzleGame from "./CodePuzzleGame";
import MemoryVisualizer from "./MemoryVisualizer";

interface Checkpoint {
  id: string;
  title: string;
  description: string;
  emoji: string;
  component: "theory" | "matching" | "puzzle" | "visualizer";
  unlocked: boolean;
  completed: boolean;
  score: number;
  requiredScore: number;
}

const initialCheckpoints: Checkpoint[] = [
  {
    id: "checkpoint1",
    title: "Variable Basics",
    description: "Learn what variables are and how they work",
    emoji: "📚",
    component: "theory",
    unlocked: true,
    completed: false,
    score: 0,
    requiredScore: 1,
  },
  {
    id: "checkpoint2",
    title: "Variable Matching",
    description: "Match variables with their types and values",
    emoji: "🎯",
    component: "matching",
    unlocked: false,
    completed: false,
    score: 0,
    requiredScore: 60,
  },
  {
    id: "checkpoint3",
    title: "Code Puzzle",
    description: "Arrange code blocks in correct order",
    emoji: "🧩",
    component: "puzzle",
    unlocked: false,
    completed: false,
    score: 0,
    requiredScore: 80,
  },
  {
    id: "checkpoint4",
    title: "Memory Visualizer",
    description: "Watch variables in action",
    emoji: "🔬",
    component: "visualizer",
    unlocked: false,
    completed: false,
    score: 0,
    requiredScore: 100,
  },
];

export default function InteractiveCheckpoints({
  onAllComplete,
}: {
  onAllComplete?: () => void;
}) {
  const [checkpoints, setCheckpoints] =
    useState<Checkpoint[]>(initialCheckpoints);
  const [activeCheckpoint, setActiveCheckpoint] =
    useState<string>("checkpoint1");
  const [totalScore, setTotalScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleCheckpointComplete = (checkpointId: string, score: number) => {
    setCheckpoints((prev) =>
      prev.map((checkpoint) => {
        if (checkpoint.id === checkpointId) {
          const completed = score >= checkpoint.requiredScore;
          return { ...checkpoint, completed, score };
        }
        return checkpoint;
      })
    );

    // Unlock next checkpoint
    const currentIndex = checkpoints.findIndex((c) => c.id === checkpointId);
    if (
      currentIndex < checkpoints.length - 1 &&
      score >= checkpoints[currentIndex].requiredScore
    ) {
      setCheckpoints((prev) =>
        prev.map((checkpoint, index) => {
          if (index === currentIndex + 1) {
            return { ...checkpoint, unlocked: true };
          }
          return checkpoint;
        })
      );
    }
  };

  const handleTheoryComplete = () => {
    handleCheckpointComplete("checkpoint1", 1);
  };

  useEffect(() => {
    const newTotalScore = checkpoints.reduce(
      (sum, checkpoint) => sum + checkpoint.score,
      0
    );
    setTotalScore(newTotalScore);

    const allCompleted = checkpoints.every((c) => c.completed);
    if (allCompleted && !showCelebration) {
      setShowCelebration(true);
      onAllComplete?.();
      setTimeout(() => setShowCelebration(false), 4000);
    }
  }, [checkpoints, showCelebration, onAllComplete]);

  const renderCheckpointContent = (checkpoint: Checkpoint) => {
    switch (checkpoint.component) {
      case "theory":
        return (
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
            <h3 className="mb-4 flex items-center gap-2 text-2xl font-bold text-blue-800">
              <BookOpen className="h-8 w-8" />
              Variable Fundamentals
            </h3>
            <div className="space-y-4 text-gray-700">
              <div className="rounded-lg border border-blue-200 bg-white p-4">
                <h4 className="mb-2 font-semibold text-blue-800">
                  📦 What is a Variable?
                </h4>
                <p>
                  Variables are like labeled storage boxes in your computer's
                  memory. They hold data that your program can use and modify.
                </p>
              </div>

              <div className="rounded-lg border border-blue-200 bg-white p-4">
                <h4 className="mb-2 font-semibold text-blue-800">
                  🎯 Variable Rules
                </h4>
                <ul className="ml-5 list-disc space-y-1">
                  <li>Must start with a letter (a-z, A-Z) or underscore (_)</li>
                  <li>Can contain letters, numbers, and underscores</li>
                  <li>Case sensitive (Name ≠ name)</li>
                  <li>No spaces or special characters</li>
                </ul>
              </div>

              <div className="rounded-lg border border-blue-200 bg-white p-4">
                <h4 className="mb-2 font-semibold text-blue-800">
                  🔢 Data Types
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded bg-blue-100 p-2 text-center">
                    <div className="text-lg">📝</div>
                    <div className="font-semibold">String</div>
                    <div className="text-sm">"Text"</div>
                  </div>
                  <div className="rounded bg-green-100 p-2 text-center">
                    <div className="text-lg">🔢</div>
                    <div className="font-semibold">Integer</div>
                    <div className="text-sm">42</div>
                  </div>
                  <div className="rounded bg-purple-100 p-2 text-center">
                    <div className="text-lg">🔘</div>
                    <div className="font-semibold">Boolean</div>
                    <div className="text-sm">True/False</div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleTheoryComplete}
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                I understand variables! ✅
              </button>
            </div>
          </div>
        );

      case "matching":
        return (
          <VariableMatchingGame
            onComplete={(score) =>
              handleCheckpointComplete("checkpoint2", score)
            }
          />
        );

      case "puzzle":
        return (
          <CodePuzzleGame
            onComplete={(score) =>
              handleCheckpointComplete("checkpoint3", score)
            }
          />
        );

      case "visualizer":
        return (
          <MemoryVisualizer
            onComplete={(score) =>
              handleCheckpointComplete("checkpoint4", score)
            }
          />
        );

      default:
        return <div>Unknown checkpoint type</div>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="mb-2 text-3xl font-bold text-gray-800">
          🎮 Interactive Learning Journey
        </h2>
        <p className="text-gray-600">
          Complete checkpoints to unlock new challenges!
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-2">
            <span className="font-bold text-gray-800">
              Total Score: {totalScore}
            </span>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-2">
            <span className="font-bold text-gray-800">
              Progress: {checkpoints.filter((c) => c.completed).length}/
              {checkpoints.length}
            </span>
          </div>
        </div>
      </div>

      {/* Checkpoint Progress */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {checkpoints.map((checkpoint, index) => (
          <motion.div
            key={checkpoint.id}
            className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
              activeCheckpoint === checkpoint.id
                ? "scale-105 border-blue-500 bg-blue-50"
                : checkpoint.unlocked
                  ? "border-gray-300 bg-white hover:border-blue-300"
                  : "border-gray-200 bg-gray-50 opacity-60"
            }`}
            onClick={() =>
              checkpoint.unlocked && setActiveCheckpoint(checkpoint.id)
            }
            whileHover={checkpoint.unlocked ? { scale: 1.02 } : {}}
          >
            <div className="text-center">
              <div className="mb-2 text-3xl">{checkpoint.emoji}</div>
              <h3 className="mb-1 font-bold text-gray-800">
                {checkpoint.title}
              </h3>
              <p className="mb-3 text-sm text-gray-600">
                {checkpoint.description}
              </p>

              <div className="flex items-center justify-center gap-2">
                {checkpoint.completed && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                {!checkpoint.unlocked && (
                  <Lock className="h-5 w-5 text-gray-400" />
                )}
                {checkpoint.unlocked && !checkpoint.completed && (
                  <Play className="h-5 w-5 text-blue-600" />
                )}
              </div>

              {checkpoint.score > 0 && (
                <div className="mt-1 text-sm font-bold text-yellow-600">
                  {checkpoint.score} points
                </div>
              )}
            </div>

            {activeCheckpoint === checkpoint.id && (
              <motion.div
                className="absolute -right-1 -top-1"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Star className="h-6 w-6 text-yellow-500" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Active Checkpoint Content */}
      <AnimatePresence mode="wait">
        {checkpoints.map(
          (checkpoint) =>
            activeCheckpoint === checkpoint.id && (
              <motion.div
                key={checkpoint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderCheckpointContent(checkpoint)}
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Celebration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
              <div className="mb-4 text-6xl">🎉</div>
              <h3 className="mb-2 text-3xl font-bold text-green-600">
                All Checkpoints Complete!
              </h3>
              <p className="mb-4 text-gray-700">
                You've mastered all the interactive challenges!
              </p>
              <div className="mb-4 flex items-center justify-center gap-2 text-yellow-600">
                <Trophy className="h-8 w-8" />
                <span className="text-2xl font-bold">
                  Total Score: {totalScore}
                </span>
              </div>
              <div className="text-lg font-semibold text-purple-600">
                🏆 Variables Master Achieved! 🏆
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
