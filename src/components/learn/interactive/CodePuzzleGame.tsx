"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  X,
  RotateCcw,
  Trophy,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Play,
} from "lucide-react";

interface CodeBlock {
  id: string;
  code: string;
  correctOrder: number;
  description: string;
  emoji: string;
}

const codeBlocks: CodeBlock[] = [
  {
    id: "block1",
    code: 'character_name = "Vegeta"',
    correctOrder: 1,
    description: "Define character name variable",
    emoji: "👤",
  },
  {
    id: "block2",
    code: "power_level = 8500",
    correctOrder: 2,
    description: "Set power level",
    emoji: "⚡",
  },
  {
    id: "block3",
    code: 'print(f"Character: {character_name}")',
    correctOrder: 3,
    description: "Display character name",
    emoji: "📺",
  },
  {
    id: "block4",
    code: 'print(f"Power: {power_level}")',
    correctOrder: 4,
    description: "Display power level",
    emoji: "💥",
  },
];

const expectedOutput = `Character: Vegeta
Power: 8500`;

export default function CodePuzzleGame({
  onComplete,
}: {
  onComplete?: (score: number) => void;
}) {
  const [blocks, setBlocks] = useState<CodeBlock[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Shuffle blocks on component mount
  useEffect(() => {
    const shuffled = [...codeBlocks].sort(() => Math.random() - 0.5);
    setBlocks(shuffled);
  }, []);

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newBlocks.length) {
      [newBlocks[index], newBlocks[targetIndex]] = [
        newBlocks[targetIndex],
        newBlocks[index],
      ];
      setBlocks(newBlocks);
    }
  };

  const checkOrder = () => {
    setAttempts((prev) => prev + 1);
    const correct = blocks.every(
      (block, index) => block.correctOrder === index + 1
    );
    setIsCorrect(correct);

    if (correct) {
      const baseScore = 100;
      const attemptPenalty = Math.max(0, attempts * 10);
      const finalScore = Math.max(10, baseScore - attemptPenalty);
      setScore(finalScore);
      setShowOutput(true);
      setGameCompleted(true);
      setShowCelebration(true);
      onComplete?.(finalScore);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const runCode = () => {
    if (isCorrect) {
      setShowOutput(true);
    }
  };

  const resetGame = () => {
    const shuffled = [...codeBlocks].sort(() => Math.random() - 0.5);
    setBlocks(shuffled);
    setIsCorrect(false);
    setShowOutput(false);
    setScore(0);
    setAttempts(0);
    setGameCompleted(false);
    setShowCelebration(false);
  };

  return (
    <div className="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-2xl font-bold text-green-800">
          🧩 Code Puzzle Challenge
          <Sparkles className="h-6 w-6 text-yellow-500" />
        </h3>
        <div className="flex items-center gap-4">
          <div className="rounded-lg border border-green-200 bg-white px-3 py-1">
            <span className="font-bold text-green-800">
              Attempts: {attempts}
            </span>
          </div>
          {score > 0 && (
            <div className="rounded-lg border border-green-200 bg-white px-3 py-1">
              <span className="font-bold text-green-800">Score: {score}</span>
            </div>
          )}
          <button
            onClick={resetGame}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-1 text-white transition-colors hover:bg-green-700"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="mb-6">
        <p className="mb-2 text-gray-700">
          Arrange the code blocks in the correct order to create a working
          program:
        </p>
        <div className="rounded-lg border border-yellow-300 bg-yellow-100 p-3 text-yellow-800">
          <span className="font-semibold">Goal:</span> Create a program that
          displays character information
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Code Blocks */}
        <div>
          <h4 className="mb-4 text-lg font-semibold text-gray-800">
            Code Blocks:
          </h4>
          <div className="space-y-3">
            {blocks.map((block, index) => (
              <motion.div
                key={block.id}
                layout
                className="rounded-lg border-2 border-gray-200 bg-white p-4 transition-colors hover:border-blue-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xl">{block.emoji}</span>
                      <span className="text-sm text-gray-600">
                        {block.description}
                      </span>
                    </div>
                    <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-blue-800">
                      {block.code}
                    </code>
                  </div>
                  <div className="ml-4 flex flex-col gap-1">
                    <button
                      onClick={() => moveBlock(index, "up")}
                      disabled={index === 0}
                      className="rounded bg-blue-500 p-1 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveBlock(index, "down")}
                      disabled={index === blocks.length - 1}
                      className="rounded bg-blue-500 p-1 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={checkOrder}
              disabled={gameCompleted}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <CheckCircle className="h-5 w-5" />
              Check Order
            </button>

            {isCorrect && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={runCode}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700"
              >
                <Play className="h-5 w-5" />
                Run Code
              </motion.button>
            )}
          </div>
        </div>

        {/* Output Panel */}
        <div>
          <h4 className="mb-4 text-lg font-semibold text-gray-800">Output:</h4>
          <div className="min-h-[300px] rounded-lg bg-black p-4 font-mono text-sm text-green-400">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-gray-400">Python Terminal</span>
            </div>
            <div className="border-t border-gray-600 pt-2">
              <AnimatePresence>
                {showOutput && isCorrect && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="text-gray-300">
                      $ python character_info.py
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="whitespace-pre-line text-green-400"
                    >
                      {expectedOutput}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                      className="mt-2 text-yellow-400"
                    >
                      ✅ Code executed successfully!
                    </motion.div>
                  </motion.div>
                )}
                {!isCorrect && attempts > 0 && (
                  <div className="text-red-400">
                    ❌ Code blocks are not in the correct order. Try again!
                  </div>
                )}
                {attempts === 0 && (
                  <div className="text-gray-400">
                    Arrange the code blocks and click "Check Order" to see the
                    output.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {isCorrect && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-lg border border-green-300 bg-green-100 p-4"
            >
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">
                  Perfect! Code is correctly ordered.
                </span>
              </div>
              <p className="mt-1 text-sm text-green-700">
                Variables are defined before they're used in print statements.
              </p>
            </motion.div>
          )}
        </div>
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
                Puzzle Solved!
              </h3>
              <p className="mb-4 text-gray-700">
                You arranged the code blocks perfectly!
              </p>
              <div className="flex items-center justify-center gap-2 text-yellow-600">
                <Trophy className="h-6 w-6" />
                <span className="text-xl font-bold">Score: {score}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {attempts === 1
                  ? "Perfect on first try!"
                  : `Completed in ${attempts} attempts`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
