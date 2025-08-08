"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Database,
  Monitor,
  Sparkles,
} from "lucide-react";

interface MemorySlot {
  id: string;
  variable: string;
  value: string;
  type: string;
  color: string;
  emoji: string;
  isActive: boolean;
}

interface CodeStep {
  id: number;
  code: string;
  description: string;
  memoryChanges: MemorySlot[];
  highlight: string[];
}

const codeSteps: CodeStep[] = [
  {
    id: 1,
    code: "# Starting our anime character creator",
    description: "Initialize the program - memory is empty",
    memoryChanges: [],
    highlight: [],
  },
  {
    id: 2,
    code: 'character_name = "Goku"',
    description: "Create string variable in memory",
    memoryChanges: [
      {
        id: "var1",
        variable: "character_name",
        value: '"Goku"',
        type: "string",
        color: "bg-blue-500",
        emoji: "👤",
        isActive: true,
      },
    ],
    highlight: ["character_name"],
  },
  {
    id: 3,
    code: "power_level = 9001",
    description: "Add integer variable to memory",
    memoryChanges: [
      {
        id: "var1",
        variable: "character_name",
        value: '"Goku"',
        type: "string",
        color: "bg-blue-500",
        emoji: "👤",
        isActive: false,
      },
      {
        id: "var2",
        variable: "power_level",
        value: "9001",
        type: "integer",
        color: "bg-green-500",
        emoji: "⚡",
        isActive: true,
      },
    ],
    highlight: ["power_level"],
  },
  {
    id: 4,
    code: "is_saiyan = True",
    description: "Add boolean variable to memory",
    memoryChanges: [
      {
        id: "var1",
        variable: "character_name",
        value: '"Goku"',
        type: "string",
        color: "bg-blue-500",
        emoji: "👤",
        isActive: false,
      },
      {
        id: "var2",
        variable: "power_level",
        value: "9001",
        type: "integer",
        color: "bg-green-500",
        emoji: "⚡",
        isActive: false,
      },
      {
        id: "var3",
        variable: "is_saiyan",
        value: "True",
        type: "boolean",
        color: "bg-purple-500",
        emoji: "🔥",
        isActive: true,
      },
    ],
    highlight: ["is_saiyan"],
  },
  {
    id: 5,
    code: "power_level = 9500",
    description: "Update existing variable value",
    memoryChanges: [
      {
        id: "var1",
        variable: "character_name",
        value: '"Goku"',
        type: "string",
        color: "bg-blue-500",
        emoji: "👤",
        isActive: false,
      },
      {
        id: "var2",
        variable: "power_level",
        value: "9500",
        type: "integer",
        color: "bg-green-500",
        emoji: "⚡",
        isActive: true,
      },
      {
        id: "var3",
        variable: "is_saiyan",
        value: "True",
        type: "boolean",
        color: "bg-purple-500",
        emoji: "🔥",
        isActive: false,
      },
    ],
    highlight: ["power_level"],
  },
  {
    id: 6,
    code: 'print(f"Character: {character_name}, Power: {power_level}")',
    description: "Access variables to display output",
    memoryChanges: [
      {
        id: "var1",
        variable: "character_name",
        value: '"Goku"',
        type: "string",
        color: "bg-blue-500",
        emoji: "👤",
        isActive: true,
      },
      {
        id: "var2",
        variable: "power_level",
        value: "9500",
        type: "integer",
        color: "bg-green-500",
        emoji: "⚡",
        isActive: true,
      },
      {
        id: "var3",
        variable: "is_saiyan",
        value: "True",
        type: "boolean",
        color: "bg-purple-500",
        emoji: "🔥",
        isActive: false,
      },
    ],
    highlight: ["character_name", "power_level"],
  },
];

export default function MemoryVisualizer({
  onComplete,
}: {
  onComplete?: (score: number) => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [memory, setMemory] = useState<MemorySlot[]>([]);
  const [output, setOutput] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const nextStep = useCallback(() => {
    if (currentStep < codeSteps.length - 1) {
      const nextStepData = codeSteps[currentStep + 1];
      setCurrentStep(currentStep + 1);
      setMemory(nextStepData.memoryChanges);

      if (nextStepData.code.includes("print")) {
        setOutput((prev) => [...prev, "Character: Goku, Power: 9500"]);
      }

      setScore((prev) => prev + 15);
    } else {
      setIsPlaying(false);
      onComplete?.(score + 25); // Bonus for completion
    }
  }, [currentStep, score, onComplete]);

  const play = () => {
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setMemory([]);
    setOutput([]);
    setScore(0);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < codeSteps.length - 1) {
      interval = setInterval(() => {
        nextStep();
      }, 2000);
    } else if (currentStep >= codeSteps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, nextStep]);

  const currentStepData = codeSteps[currentStep];

  return (
    <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-2xl font-bold text-purple-800">
          🔬 Memory Visualizer
          <Sparkles className="h-6 w-6 text-yellow-500" />
        </h3>
        <div className="flex items-center gap-4">
          <div className="rounded-lg border border-purple-200 bg-white px-3 py-1">
            <span className="font-bold text-purple-800">Score: {score}</span>
          </div>
          <div className="flex gap-2">
            {!isPlaying ? (
              <button
                onClick={play}
                disabled={currentStep >= codeSteps.length - 1}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-3 py-1 text-white transition-colors hover:bg-green-700 disabled:bg-gray-400"
              >
                <Play className="h-4 w-4" />
                Play
              </button>
            ) : (
              <button
                onClick={pause}
                className="flex items-center gap-2 rounded-lg bg-yellow-600 px-3 py-1 text-white transition-colors hover:bg-yellow-700"
              >
                <Pause className="h-4 w-4" />
                Pause
              </button>
            )}
            <button
              onClick={nextStep}
              disabled={isPlaying || currentStep >= codeSteps.length - 1}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
            >
              <Zap className="h-4 w-4" />
              Step
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-1 text-white transition-colors hover:bg-purple-700"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Code Panel */}
        <div>
          <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Monitor className="h-5 w-5" />
            Code Execution:
          </h4>
          <div className="rounded-lg bg-gray-900 p-4 font-mono text-sm text-green-400">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-gray-400">
                Python - Memory Visualizer
              </span>
            </div>

            <div className="space-y-2">
              {codeSteps.slice(0, currentStep + 1).map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`${index === currentStep ? "border-l-4 border-blue-400 bg-blue-900/50 pl-3" : ""}`}
                >
                  <span className="text-gray-500">{">>> "}</span>
                  <span
                    className={
                      index === currentStep
                        ? "text-yellow-300"
                        : "text-green-400"
                    }
                  >
                    {step.code}
                  </span>
                </motion.div>
              ))}
              {currentStep < codeSteps.length - 1 && (
                <div className="animate-pulse text-gray-500">{">>> _"}</div>
              )}
            </div>

            {output.length > 0 && (
              <div className="mt-4 border-t border-gray-600 pt-2">
                <div className="mb-1 text-xs text-gray-400">OUTPUT:</div>
                {output.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-cyan-300"
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 rounded-lg border border-purple-200 bg-white p-3">
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Step {currentStep + 1}:</span>{" "}
              {currentStepData.description}
            </div>
          </div>
        </div>

        {/* Memory Panel */}
        <div>
          <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Database className="h-5 w-5" />
            Memory State:
          </h4>

          <div className="min-h-[400px] rounded-lg border-2 border-gray-200 bg-white p-4">
            <div className="mb-4 text-center text-gray-600">
              <div className="mb-2 text-2xl">🧠</div>
              <div className="font-semibold">Python Memory</div>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {memory.map((slot) => (
                  <motion.div
                    key={slot.id}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{
                      opacity: 1,
                      scale: slot.isActive ? 1.05 : 1,
                      y: 0,
                      boxShadow: slot.isActive
                        ? "0 0 20px rgba(59, 130, 246, 0.5)"
                        : "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    className={`${slot.color} rounded-lg border-2 p-4 text-white ${slot.isActive ? "border-yellow-300" : "border-transparent"}`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-xl">{slot.emoji}</span>
                          <span className="font-mono text-sm opacity-90">
                            {slot.type}
                          </span>
                        </div>
                        <div className="font-semibold">{slot.variable}</div>
                        <div className="font-mono text-lg">{slot.value}</div>
                      </div>
                      {slot.isActive && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="text-yellow-300"
                        >
                          <Zap className="h-6 w-6" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {memory.length === 0 && (
                <div className="py-8 text-center text-gray-400">
                  <div className="mb-2 text-4xl">📭</div>
                  <div>Memory is empty</div>
                  <div className="text-sm">
                    Variables will appear here when created
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1 rounded bg-blue-100 p-2">
              <div className="h-3 w-3 rounded bg-blue-500"></div>
              <span>String</span>
            </div>
            <div className="flex items-center gap-1 rounded bg-green-100 p-2">
              <div className="h-3 w-3 rounded bg-green-500"></div>
              <span>Integer</span>
            </div>
            <div className="flex items-center gap-1 rounded bg-purple-100 p-2">
              <div className="h-3 w-3 rounded bg-purple-500"></div>
              <span>Boolean</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">
            {currentStep + 1} / {codeSteps.length}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <motion.div
            className="h-2 rounded-full bg-purple-600"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentStep + 1) / codeSteps.length) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}
