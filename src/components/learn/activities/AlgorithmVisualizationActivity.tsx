"use client";

import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, SkipForward, Code, Eye } from "lucide-react";

interface VisualizationStep {
  step: number;
  left: number;
  right: number;
  mid: number;
  value: number;
  action: string;
  decision: string;
}

interface Visualization {
  operation: string;
  setA: number[];
  setB: number[];
  result: number[];
  code: string;
  explanation: string;
  visual: string;
}

interface AlgorithmVisualizationContent {
  algorithm?: string;
  array?: number[];
  target?: number;
  steps?: VisualizationStep[];
  code?: string;
  visualizations?: Visualization[];
}

interface LearningActivity {
  id: string;
  title: string;
  description: string;
  content: AlgorithmVisualizationContent;
}

interface AlgorithmVisualizationActivityProps {
  activity: LearningActivity;
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function AlgorithmVisualizationActivity({
  activity,
  onComplete,
}: AlgorithmVisualizationActivityProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [completedVisualization, setCompletedVisualization] = useState(false);
  const [activeVisualization, setActiveVisualization] = useState(0);

  const {
    algorithm,
    array = [],
    target,
    steps = [],
    code,
    visualizations = [],
  } = activity.content;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && currentStep < steps.length - 1) {
      interval = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, playbackSpeed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      if (!completedVisualization) {
        setCompletedVisualization(true);
        const score = 85; // Good score for completing visualization
        onComplete(score, 100, true);
      }
    }

    return () => {
      if (interval) clearTimeout(interval);
    };
  }, [
    isPlaying,
    currentStep,
    steps.length,
    playbackSpeed,
    completedVisualization,
    onComplete,
  ]);

  const playPause = () => {
    setIsPlaying(!isPlaying);
  };

  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderBinarySearchVisualization = () => {
    if (steps.length === 0) return null;

    const currentStepData = steps[currentStep];

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Binary Search Visualization
        </h3>

        {/* Array Visualization */}
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-center space-x-2">
            {array.map((value, index) => (
              <div
                key={index}
                className={`flex h-12 w-12 items-center justify-center rounded border-2 text-sm font-bold transition-all ${
                  index >= currentStepData.left &&
                  index <= currentStepData.right
                    ? index === currentStepData.mid
                      ? "border-red-500 bg-red-100 text-red-800"
                      : "border-blue-500 bg-blue-100 text-blue-800"
                    : "border-gray-300 bg-gray-50 text-gray-500"
                }`}
              >
                {value}
              </div>
            ))}
          </div>

          {/* Pointers */}
          <div className="flex items-center justify-center space-x-2">
            {array.map((_, index) => (
              <div
                key={index}
                className="flex h-6 w-12 flex-col items-center justify-center text-xs"
              >
                {index === currentStepData.left && (
                  <span className="font-bold text-blue-600">L</span>
                )}
                {index === currentStepData.mid && (
                  <span className="font-bold text-red-600">M</span>
                )}
                {index === currentStepData.right && (
                  <span className="font-bold text-green-600">R</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Information */}
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold">Step:</span>{" "}
              {currentStepData.step}
            </div>
            <div>
              <span className="font-semibold">Target:</span> {target}
            </div>
            <div>
              <span className="font-semibold">Left:</span>{" "}
              {currentStepData.left}
            </div>
            <div>
              <span className="font-semibold">Right:</span>{" "}
              {currentStepData.right}
            </div>
            <div>
              <span className="font-semibold">Mid:</span> {currentStepData.mid}
            </div>
            <div>
              <span className="font-semibold">Value:</span>{" "}
              {currentStepData.value}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="text-sm">
              <span className="font-semibold">Action:</span>{" "}
              {currentStepData.action}
            </div>
            <div className="text-sm">
              <span className="font-semibold">Decision:</span>{" "}
              {currentStepData.decision}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSetOperationsVisualization = () => {
    if (visualizations.length === 0) return null;

    const currentViz = visualizations[activeVisualization];

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Set Operations Visualization
        </h3>

        {/* Visualization Tabs */}
        <div className="mb-6">
          <div className="mb-4 flex space-x-2">
            {visualizations.map((viz, index) => (
              <button
                key={index}
                onClick={() => setActiveVisualization(index)}
                className={`rounded px-4 py-2 text-sm font-medium transition-colors ${
                  index === activeVisualization
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {viz.operation}
              </button>
            ))}
          </div>
        </div>

        {/* Venn Diagram Simulation */}
        <div className="mb-6 text-center">
          <div className="relative inline-block">
            <svg width="300" height="200" className="rounded border">
              {/* Set A Circle */}
              <circle
                cx="100"
                cy="100"
                r="60"
                fill="rgba(59, 130, 246, 0.3)"
                stroke="rgb(59, 130, 246)"
                strokeWidth="2"
              />
              <text
                x="60"
                y="60"
                className="fill-blue-700 text-sm font-semibold"
              >
                Set A
              </text>

              {/* Set B Circle */}
              <circle
                cx="200"
                cy="100"
                r="60"
                fill="rgba(16, 185, 129, 0.3)"
                stroke="rgb(16, 185, 129)"
                strokeWidth="2"
              />
              <text
                x="220"
                y="60"
                className="fill-green-700 text-sm font-semibold"
              >
                Set B
              </text>

              {/* Labels */}
              <text
                x="150"
                y="180"
                className="text-center text-xs font-semibold"
              >
                {currentViz.operation}: {currentViz.result.join(", ")}
              </text>
            </svg>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div className="rounded bg-blue-50 p-3">
              <div className="font-semibold text-blue-900">Set A</div>
              <div className="text-blue-700">{currentViz.setA.join(", ")}</div>
            </div>
            <div className="rounded bg-green-50 p-3">
              <div className="font-semibold text-green-900">Set B</div>
              <div className="text-green-700">{currentViz.setB.join(", ")}</div>
            </div>
            <div className="rounded bg-purple-50 p-3">
              <div className="font-semibold text-purple-900">Result</div>
              <div className="text-purple-700">
                {currentViz.result.join(", ")}
              </div>
            </div>
          </div>
        </div>

        {/* Code and Explanation */}
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-900 p-4">
            <pre className="font-mono text-sm text-green-300">
              {currentViz.code}
            </pre>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-blue-800">{currentViz.explanation}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {activity.title}
        </h2>
        <p className="text-lg text-gray-600">{activity.description}</p>
      </div>

      {/* Controls */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {steps.length > 0 && (
            <>
              <button
                onClick={() => stepBackward()}
                disabled={currentStep === 0}
                className="rounded border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <SkipForward className="h-4 w-4 rotate-180" />
              </button>

              <button
                onClick={playPause}
                className="flex items-center space-x-2 rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                <span>{isPlaying ? "Pause" : "Play"}</span>
              </button>

              <button
                onClick={() => stepForward()}
                disabled={currentStep >= steps.length - 1}
                className="rounded border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <SkipForward className="h-4 w-4" />
              </button>

              <button
                onClick={reset}
                className="flex items-center space-x-2 rounded bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
            </>
          )}
        </div>

        {steps.length > 0 && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Speed:</span>
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="rounded border border-gray-300 px-2 py-1 text-sm"
            >
              <option value={2000}>Slow</option>
              <option value={1000}>Normal</option>
              <option value={500}>Fast</option>
            </select>
          </div>
        )}
      </div>

      {/* Progress Bar for Steps */}
      {steps.length > 0 && (
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Algorithm Progress
            </span>
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Visualization Content */}
      <div className="space-y-8">
        {/* Binary Search Visualization */}
        {algorithm === "binary_search" &&
          steps.length > 0 &&
          renderBinarySearchVisualization()}

        {/* Set Operations Visualization */}
        {visualizations.length > 0 && renderSetOperationsVisualization()}

        {/* Algorithm Code */}
        {code && (
          <div className="overflow-hidden rounded-lg bg-gray-900">
            <div className="flex items-center space-x-2 border-b border-gray-700 p-4">
              <Code className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-400">
                Algorithm Implementation
              </span>
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap p-4 font-mono text-sm text-green-300">
              {code}
            </pre>
          </div>
        )}
      </div>

      {/* Completion Message */}
      {completedVisualization && (
        <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6 text-center">
          <div className="mb-2 flex items-center justify-center space-x-2">
            <Eye className="h-6 w-6 text-green-600" />
            <span className="text-lg font-semibold text-green-900">
              Visualization Complete!
            </span>
          </div>
          <p className="text-green-800">
            You've successfully explored the algorithm visualization.
            Understanding how algorithms work step-by-step is key to mastering
            programming!
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-2 font-semibold text-gray-900">🎯 How to Use:</h3>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>• Use Play/Pause to control the automatic visualization</li>
          <li>• Step forward/backward to manually explore each step</li>
          <li>• Adjust speed to match your learning pace</li>
          <li>• Study the code implementation to understand the algorithm</li>
          {visualizations.length > 0 && (
            <li>��� Switch between different operations using the tabs</li>
          )}
        </ul>
      </div>
    </div>
  );
}
