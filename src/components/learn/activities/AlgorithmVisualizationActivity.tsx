"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  ChevronRight,
  Trophy,
  Clock,
  Zap,
} from "lucide-react";

interface Step {
  id: number;
  description: string;
  data: any[];
  highlights?: number[];
  comparison?: [number, number];
  action?: string;
}

interface AlgorithmVisualizationActivityProps {
  activity: {
    content: {
      algorithmType: string;
      title: string;
      description: string;
      initialArray: number[];
      speed?: string;
      showCode?: boolean;
      showComplexity?: boolean;
      allowUserInput?: boolean;
      codeSnippet?: string;
      complexity?: {
        time: string;
        space: string;
      };
      steps?: Step[];
      initialData?: any[];
      algorithm?: string;
      timeComplexity?: string;
      spaceComplexity?: string;
      explanation?: string;
    };
  };
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function AlgorithmVisualizationActivity({
  activity,
  onComplete,
}: AlgorithmVisualizationActivityProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [isCompleted, setIsCompleted] = useState(false);
  const [watchTime, setWatchTime] = useState(0);

  // Generate algorithm steps dynamically
  const generateSteps = (
    algorithmType: string,
    initialArray: number[]
  ): Step[] => {
    switch (algorithmType) {
      case "bubble_sort":
        return generateBubbleSortSteps(initialArray);
      case "quick_sort":
        return generateQuickSortSteps(initialArray);
      case "binary_search":
        return generateBinarySearchSteps(
          initialArray,
          initialArray[Math.floor(initialArray.length / 2)]
        );
      default:
        return [];
    }
  };

  const generateBubbleSortSteps = (arr: number[]): Step[] => {
    const steps: Step[] = [];
    const array = [...arr];
    let stepId = 0;

    steps.push({
      id: stepId++,
      description: "Starting Bubble Sort algorithm with the initial array",
      data: [...array],
      action: "initialize",
    });

    for (let i = 0; i < array.length - 1; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        // Compare step
        steps.push({
          id: stepId++,
          description: `Comparing elements at positions ${j} and ${j + 1}: ${array[j]} and ${array[j + 1]}`,
          data: [...array],
          comparison: [j, j + 1],
          action: "compare",
        });

        // Swap if needed
        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          steps.push({
            id: stepId++,
            description: `Swapping ${array[j + 1]} and ${array[j]} because ${array[j + 1]} > ${array[j]}`,
            data: [...array],
            highlights: [j, j + 1],
            action: "swap",
          });
        } else {
          steps.push({
            id: stepId++,
            description: `No swap needed: ${array[j]} ≤ ${array[j + 1]}`,
            data: [...array],
            highlights: [j, j + 1],
            action: "no_swap",
          });
        }
      }

      steps.push({
        id: stepId++,
        description: `Pass ${i + 1} complete. Largest element ${array[array.length - 1 - i]} is now in position ${array.length - 1 - i}`,
        data: [...array],
        highlights: [array.length - 1 - i],
        action: "pass_complete",
      });
    }

    steps.push({
      id: stepId++,
      description: "Bubble Sort complete! Array is now sorted.",
      data: [...array],
      action: "complete",
    });

    return steps;
  };

  const generateQuickSortSteps = (arr: number[]): Step[] => {
    const steps: Step[] = [];
    const array = [...arr];
    let stepId = 0;

    const quickSortHelper = (arr: number[], low: number, high: number) => {
      if (low < high) {
        steps.push({
          id: stepId++,
          description: `Partitioning array from index ${low} to ${high}`,
          data: [...arr],
          highlights: [low, high],
          action: "partition_start",
        });

        const pi = partition(arr, low, high);

        steps.push({
          id: stepId++,
          description: `Pivot ${arr[pi]} is now in correct position at index ${pi}`,
          data: [...arr],
          highlights: [pi],
          action: "pivot_placed",
        });

        quickSortHelper(arr, low, pi - 1);
        quickSortHelper(arr, pi + 1, high);
      }
    };

    const partition = (arr: number[], low: number, high: number): number => {
      const pivot = arr[high];
      let i = low - 1;

      steps.push({
        id: stepId++,
        description: `Using ${pivot} as pivot (last element)`,
        data: [...arr],
        highlights: [high],
        action: "select_pivot",
      });

      for (let j = low; j <= high - 1; j++) {
        steps.push({
          id: stepId++,
          description: `Comparing ${arr[j]} with pivot ${pivot}`,
          data: [...arr],
          comparison: [j, high],
          action: "compare_with_pivot",
        });

        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({
            id: stepId++,
            description: `${arr[j]} < ${pivot}, swapping with element at index ${i}`,
            data: [...arr],
            highlights: [i, j],
            action: "swap_with_pivot",
          });
        }
      }

      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      return i + 1;
    };

    steps.push({
      id: stepId++,
      description: "Starting Quick Sort algorithm",
      data: [...array],
      action: "initialize",
    });

    quickSortHelper(array, 0, array.length - 1);

    steps.push({
      id: stepId++,
      description: "Quick Sort complete! Array is now sorted.",
      data: [...array],
      action: "complete",
    });

    return steps;
  };

  const generateBinarySearchSteps = (arr: number[], target: number): Step[] => {
    const steps: Step[] = [];
    const sortedArray = [...arr].sort((a, b) => a - b);
    let stepId = 0;
    let left = 0;
    let right = sortedArray.length - 1;

    steps.push({
      id: stepId++,
      description: `Starting Binary Search for target value: ${target}`,
      data: [...sortedArray],
      highlights: [],
      action: "initialize",
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      steps.push({
        id: stepId++,
        description: `Checking middle element at index ${mid}: ${sortedArray[mid]}`,
        data: [...sortedArray],
        highlights: [mid],
        comparison: [left, right],
        action: "check_middle",
      });

      if (sortedArray[mid] === target) {
        steps.push({
          id: stepId++,
          description: `Found target ${target} at index ${mid}!`,
          data: [...sortedArray],
          highlights: [mid],
          action: "found",
        });
        break;
      } else if (sortedArray[mid] < target) {
        steps.push({
          id: stepId++,
          description: `${sortedArray[mid]} < ${target}, searching right half`,
          data: [...sortedArray],
          highlights: [mid],
          action: "search_right",
        });
        left = mid + 1;
      } else {
        steps.push({
          id: stepId++,
          description: `${sortedArray[mid]} > ${target}, searching left half`,
          data: [...sortedArray],
          highlights: [mid],
          action: "search_left",
        });
        right = mid - 1;
      }
    }

    if (left > right) {
      steps.push({
        id: stepId++,
        description: `Target ${target} not found in the array`,
        data: [...sortedArray],
        action: "not_found",
      });
    }

    return steps;
  };

  // Get algorithm data
  const algorithmType = activity.content?.algorithmType || "bubble_sort";
  const initialArray = activity.content?.initialArray || [];
  const steps =
    activity.content?.steps || generateSteps(algorithmType, initialArray);
  const algorithm =
    activity.content?.title || activity.content?.algorithm || "Algorithm";
  const description =
    activity.content?.description || "Algorithm demonstration";

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && steps.length > 0 && currentStep < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            if (!isCompleted) {
              handleComplete();
            }
            return prev;
          }
        });
      }, speed);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, speed, steps.length, isCompleted]);

  useEffect(() => {
    if (!isCompleted) {
      const timer = setInterval(() => {
        setWatchTime((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCompleted]);

  const handleComplete = () => {
    setIsCompleted(true);
    // Score based on completion and engagement
    const engagementScore = Math.min(100, Math.max(50, 100 - watchTime / 10)); // Bonus for watching efficiently
    onComplete(engagementScore, 100, true);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setIsCompleted(false);
    setWatchTime(0);
  };

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (!isCompleted) {
      handleComplete();
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle case where steps might be empty or undefined
  if (!steps || steps.length === 0) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-8">
          <div className="mb-4 text-yellow-600">⚠️</div>
          <h3 className="mb-2 text-lg font-semibold text-yellow-900">
            No Algorithm Steps Available
          </h3>
          <p className="mb-4 text-yellow-800">
            Unable to generate visualization steps for this algorithm.
          </p>
          <div className="rounded bg-yellow-100 p-4 text-left text-sm text-yellow-700">
            <p className="mb-2 font-semibold">Debug Information:</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Algorithm Type: {algorithmType}</li>
              <li>Initial Array: {JSON.stringify(initialArray)}</li>
              <li>Array Length: {initialArray.length}</li>
              <li>
                Has Steps in Content: {activity.content?.steps ? "Yes" : "No"}
              </li>
            </ul>
            <p className="mt-3 text-xs">
              Supported algorithms: bubble_sort, quick_sort, binary_search
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentStepData = steps[currentStep];

  if (isCompleted) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <div className="mb-6">
          <Trophy className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Visualization Complete!
          </h2>
          <div className="mb-4 text-lg text-gray-600">
            You've successfully explored the {algorithm} algorithm!
          </div>

          <div className="mb-6 rounded-lg border border-green-200 bg-green-100 p-4">
            <p className="font-medium text-green-800">
              🎉 Great job! You've completed the algorithm visualization and
              learned how {algorithm} works step by step.
            </p>
          </div>

          {activity.content?.explanation && (
            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-6 text-left">
              <h3 className="mb-3 font-semibold text-blue-900">
                Key Takeaways:
              </h3>
              <p className="text-blue-800">{activity.content.explanation}</p>
            </div>
          )}
        </div>

        <button
          onClick={handleReset}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Watch Again
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
            <Zap className="h-6 w-6 text-purple-600" />
            <span className="text-lg font-semibold text-gray-900">
              {algorithm} Visualization
            </span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>
                {Math.floor(watchTime / 60)}:
                {(watchTime % 60).toString().padStart(2, "0")}
              </span>
            </div>
            <div className="text-sm">
              Step: {currentStep + 1}/{steps.length}
            </div>
          </div>
        </div>

        {/* Algorithm Info */}
        <div className="mb-4 rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="mb-2 font-semibold text-purple-900">
                {algorithm}
              </h3>
              <p className="text-sm text-purple-800">{description}</p>
            </div>
            <div className="text-right text-xs text-purple-700">
              {activity.content?.timeComplexity && (
                <div>Time: {activity.content.timeComplexity}</div>
              )}
              {activity.content?.spaceComplexity && (
                <div>Space: {activity.content.spaceComplexity}</div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-purple-600 transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Main Visualization */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Visualization Area */}
        <div className="lg:col-span-2">
          <div className="h-80 rounded-lg border border-gray-200 bg-white p-6">
            <h4 className="mb-4 font-semibold text-gray-900">
              Algorithm Visualization
            </h4>

            {/* Data Array Visualization */}
            <div className="mb-6 flex items-center justify-center space-x-2">
              {(currentStepData?.data || []).map((value, index) => (
                <motion.div
                  key={index}
                  className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 text-sm font-bold ${
                    currentStepData.highlights?.includes(index)
                      ? "border-yellow-400 bg-yellow-100 text-yellow-800"
                      : currentStepData.comparison?.includes(index)
                        ? "border-red-400 bg-red-100 text-red-800"
                        : "border-gray-300 bg-gray-50 text-gray-700"
                  }`}
                  animate={{
                    scale: currentStepData.highlights?.includes(index)
                      ? 1.1
                      : 1,
                    y: currentStepData.comparison?.includes(index) ? -5 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {value}
                </motion.div>
              ))}
            </div>

            {/* Array Indices */}
            <div className="mb-4 flex items-center justify-center space-x-2">
              {(currentStepData?.data || []).map((_, index) => (
                <div
                  key={index}
                  className="flex w-12 items-center justify-center text-xs text-gray-500"
                >
                  {index}
                </div>
              ))}
            </div>

            {/* Action Indicator */}
            {currentStepData.action && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="inline-block rounded-lg border border-blue-200 bg-blue-100 px-4 py-2">
                  <span className="font-medium text-blue-800">
                    {currentStepData.action}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Step Description */}
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h4 className="mb-3 font-semibold text-gray-900">Current Step</h4>
            <div className="mb-4 rounded-lg bg-gray-50 p-4">
              <div className="mb-2 text-2xl font-bold text-purple-600">
                Step {currentStep + 1}
              </div>
              <p className="text-sm leading-relaxed text-gray-700">
                {currentStepData?.description || "No description available"}
              </p>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded border border-yellow-400 bg-yellow-100"></div>
                <span className="text-gray-600">Currently processing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded border border-red-400 bg-red-100"></div>
                <span className="text-gray-600">Being compared</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded border border-gray-300 bg-gray-50"></div>
                <span className="text-gray-600">Unchanged</span>
              </div>
            </div>
          </div>

          {/* All Steps Overview */}
          <div className="max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-6">
            <h4 className="mb-3 font-semibold text-gray-900">All Steps</h4>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <button
                  key={step.id || index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-full rounded p-2 text-left text-xs transition-colors ${
                    index === currentStep
                      ? "border border-purple-200 bg-purple-100 text-purple-800"
                      : index < currentStep
                        ? "bg-green-50 text-green-700 hover:bg-green-100"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{index + 1}.</span>
                    <span className="flex-1 truncate">
                      {step.description || `Step ${index + 1}`}
                    </span>
                    {index === currentStep && (
                      <ChevronRight className="h-3 w-3" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleReset}
              className="p-2 text-gray-600 transition-colors hover:text-gray-800"
              title="Reset"
            >
              <RotateCcw className="h-5 w-5" />
            </button>

            <button
              onClick={handleStepBackward}
              disabled={currentStep === 0}
              className="p-2 text-gray-600 transition-colors hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              title="Previous step"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
            </button>

            <button
              onClick={isPlaying ? handlePause : handlePlay}
              disabled={currentStep === steps.length - 1}
              className="flex items-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              <span>{isPlaying ? "Pause" : "Play"}</span>
            </button>

            <button
              onClick={handleStepForward}
              disabled={currentStep === steps.length - 1}
              className="p-2 text-gray-600 transition-colors hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              title="Next step"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Speed Control */}
          <div className="flex items-center space-x-2">
            <FastForward className="h-4 w-4 text-gray-600" />
            <label htmlFor="speed" className="text-sm text-gray-600">
              Speed:
            </label>
            <select
              id="speed"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="rounded border border-gray-300 px-2 py-1 text-sm"
            >
              <option value={2000}>0.5x</option>
              <option value={1000}>1x</option>
              <option value={500}>2x</option>
              <option value={250}>4x</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
