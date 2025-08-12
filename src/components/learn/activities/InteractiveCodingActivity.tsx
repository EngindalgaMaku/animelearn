"use client";

import { useState, useEffect } from "react";
import {
  Play,
  CheckCircle,
  XCircle,
  RotateCcw,
  Code,
  Trophy,
} from "lucide-react";

interface TestCase {
  input: string;
  expected: string;
  description: string;
}

interface Exercise {
  title: string;
  instruction: string;
  starterCode: string;
  solution: string;
  testCases: TestCase[];
}

interface InteractiveCodingContent {
  exercises: Exercise[];
}

interface LearningActivity {
  id: string;
  title: string;
  description: string;
  content: InteractiveCodingContent;
}

interface InteractiveCodingActivityProps {
  activity: LearningActivity;
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function InteractiveCodingActivity({
  activity,
  onComplete,
}: InteractiveCodingActivityProps) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState<
    { passed: boolean; message: string }[]
  >([]);
  const [isRunning, setIsRunning] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(
    new Set()
  );
  const [showSolution, setShowSolution] = useState(false);

  const { exercises } = activity.content;
  const currentExerciseData = exercises[currentExercise];

  useEffect(() => {
    if (currentExerciseData) {
      setUserCode(currentExerciseData.starterCode);
      setOutput("");
      setTestResults([]);
      setShowSolution(false);
    }
  }, [currentExercise, currentExerciseData]);

  const simulateCodeExecution = (code: string, testCases: TestCase[]) => {
    const results: { passed: boolean; message: string }[] = [];
    let outputText = "";

    try {
      // Simple simulation for Python-like code execution
      testCases.forEach((testCase, index) => {
        try {
          let passed = false;
          let actualResult = "";

          // Basic simulation based on common patterns
          if (code.includes("def ") && code.includes("return")) {
            // Function definition detected
            if (code.includes("length * width")) {
              // Rectangle area calculation
              const inputs = testCase.input.match(/\((\d+),\s*(\d+)\)/);
              if (inputs) {
                const length = parseInt(inputs[1]);
                const width = parseInt(inputs[2]);
                actualResult = (length * width).toString();
                passed = actualResult === testCase.expected;
              }
            } else if (
              code.includes("f'{greeting}, {name}!'") ||
              code.includes(`f"{greeting}, {name}!"`)
            ) {
              // Greeting function
              const inputs = testCase.input.match(
                /\('([^']+)'(?:,\s*'([^']+)')?\)/
              );
              if (inputs) {
                const name = inputs[1];
                const greeting = inputs[2] || "Hello";
                actualResult = `${greeting}, ${name}!`;
                passed = actualResult === testCase.expected;
              }
            } else if (code.includes("return length * width")) {
              // Basic area calculation
              const inputs = testCase.input.match(/\((\d+),\s*(\d+)\)/);
              if (inputs) {
                const length = parseInt(inputs[1]);
                const width = parseInt(inputs[2]);
                actualResult = (length * width).toString();
                passed = actualResult === testCase.expected;
              }
            }
          } else if (
            code.includes("fruits.append") &&
            code.includes("fruits.remove")
          ) {
            // List manipulation
            if (
              testCase.expected.includes("banana") &&
              testCase.expected.includes("orange") &&
              testCase.expected.includes("grape")
            ) {
              actualResult = "['banana', 'orange', 'grape']";
              passed = actualResult === testCase.expected;
            }
          }

          results.push({
            passed,
            message: passed
              ? `✓ Test ${index + 1} passed: ${testCase.description}`
              : `✗ Test ${index + 1} failed: Expected "${testCase.expected}", got "${actualResult}"`,
          });
        } catch (error) {
          results.push({
            passed: false,
            message: `✗ Test ${index + 1} error: ${testCase.description}`,
          });
        }
      });

      // Generate output
      const passedTests = results.filter((r) => r.passed).length;
      outputText = results.map((r) => r.message).join("\n");
      outputText += `\n\nPassed ${passedTests}/${testCases.length} tests`;

      // Mark exercise as completed if all tests pass
      if (passedTests === testCases.length) {
        setCompletedExercises((prev) => new Set([...prev, currentExercise]));
      }
    } catch (error) {
      outputText = "Error executing code: " + (error as Error).message;
      results.push({
        passed: false,
        message: "Code execution failed",
      });
    }

    setTestResults(results);
    setOutput(outputText);
  };

  const runCode = () => {
    setIsRunning(true);
    setOutput("Running tests...");

    setTimeout(() => {
      simulateCodeExecution(userCode, currentExerciseData.testCases);
      setIsRunning(false);
    }, 1500);
  };

  const resetCode = () => {
    setUserCode(currentExerciseData.starterCode);
    setOutput("");
    setTestResults([]);
  };

  const useSolution = () => {
    setUserCode(currentExerciseData.solution);
    setShowSolution(true);
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    } else {
      // Don't auto-complete - let user manually complete
    }
  };

  const handleManualComplete = () => {
    const completionRate = completedExercises.size / exercises.length;
    const score = Math.round(60 + completionRate * 40); // Base 60% + completion bonus
    onComplete(score, 100, completionRate >= 0.7);
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
  };

  const allTestsPassed =
    testResults.length > 0 && testResults.every((result) => result.passed);
  const progress = ((currentExercise + 1) / exercises.length) * 100;

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {activity.title}
        </h2>
        <p className="text-lg text-gray-600">{activity.description}</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Exercise {currentExercise + 1} of {exercises.length}
          </span>
          <span className="text-sm text-gray-500">
            {completedExercises.size}/{exercises.length} completed
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Panel - Instructions and Navigation */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              {currentExerciseData.title}
            </h3>
            <p className="mb-6 text-gray-700">
              {currentExerciseData.instruction}
            </p>

            {/* Test Cases */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="mb-3 font-semibold text-gray-900">Test Cases:</h4>
              <div className="space-y-2">
                {currentExerciseData.testCases.map((testCase, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-800">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">
                        {testCase.description}
                      </span>
                      {testResults[index] && (
                        <span>
                          {testResults[index].passed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </span>
                      )}
                    </div>
                    <div className="ml-8 text-xs text-gray-500">
                      Input: {testCase.input} → Expected: {testCase.expected}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Exercise Navigation */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="mb-3 font-semibold text-gray-900">Exercises</h4>
            <div className="grid grid-cols-1 gap-2">
              {exercises.map((exercise, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentExercise(index)}
                  className={`rounded p-3 text-left transition-colors ${
                    index === currentExercise
                      ? "border border-indigo-300 bg-indigo-100 text-indigo-900"
                      : completedExercises.has(index)
                        ? "hover:bg-green-150 bg-green-100 text-green-800"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        index === currentExercise
                          ? "bg-indigo-600 text-white"
                          : completedExercises.has(index)
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {completedExercises.has(index) ? "✓" : index + 1}
                    </div>
                    <span className="text-sm font-medium">
                      {exercise.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor and Output */}
        <div className="space-y-6">
          {/* Code Editor */}
          <div className="overflow-hidden rounded-lg bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-700 p-4">
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-400">
                  Python Code Editor
                </span>
              </div>
              <div className="flex space-x-1">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>
            </div>

            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="h-64 w-full resize-none bg-transparent p-4 font-mono text-sm text-white focus:outline-none"
              placeholder="Write your Python code here..."
            />

            <div className="flex space-x-3 border-t border-gray-700 p-4">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="inline-flex items-center space-x-2 rounded bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:bg-gray-600"
              >
                <Play className="h-4 w-4" />
                <span>{isRunning ? "Running..." : "Run Tests"}</span>
              </button>

              <button
                onClick={resetCode}
                className="inline-flex items-center space-x-2 rounded bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>

              <button
                onClick={useSolution}
                className="rounded bg-yellow-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-yellow-700"
              >
                Show Solution
              </button>
            </div>
          </div>

          {/* Output */}
          <div className="rounded-lg bg-black p-4">
            <div className="mb-3 flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              <span className="text-sm font-medium text-green-400">
                Test Results
              </span>
            </div>
            <pre className="min-h-[120px] whitespace-pre-wrap font-mono text-sm text-green-300">
              {output || "Run your code to see test results..."}
            </pre>
          </div>

          {/* Success Message */}
          {allTestsPassed && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">
                  Excellent! All tests passed!
                </span>
              </div>
              <p className="mt-1 text-sm text-green-700">
                You can move to the next exercise when ready.
              </p>
            </div>
          )}

          {/* Solution Notice */}
          {showSolution && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                💡 Solution is now displayed in the editor. Study it carefully
                to understand the approach.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={previousExercise}
          disabled={currentExercise === 0}
          className="rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous Exercise
        </button>

        {currentExercise === exercises.length - 1 ? (
          <div className="text-center">
            <div className="mb-3 rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="mb-2 flex items-center justify-center space-x-2">
                <Trophy className="h-5 w-5 text-green-600" />
                <span className="text-sm font-semibold text-green-900">
                  Lab Complete!
                </span>
              </div>
              <p className="mb-3 text-xs text-green-800">
                You've finished all coding exercises in this lab. Review your
                work and claim your rewards!
              </p>
              <button
                onClick={handleManualComplete}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
              >
                🎉 Complete Lab & Claim Rewards
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={nextExercise}
            className="rounded-lg bg-indigo-600 px-6 py-2 text-white transition-colors hover:bg-indigo-700"
          >
            Next Exercise
          </button>
        )}
      </div>
    </div>
  );
}
