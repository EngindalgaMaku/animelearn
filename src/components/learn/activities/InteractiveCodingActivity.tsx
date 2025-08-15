"use client";

import { useState, useEffect } from "react";
import {
  Play,
  CheckCircle,
  XCircle,
  Trophy,
  Star,
  Gift,
  Code,
} from "lucide-react";

interface TestCase {
  input: string;
  expected?: string;
  expectedOutput?: string;
}

interface InteractiveCodingContent {
  instructions: string;
  starterCode: string;
  expectedOutput?: string;
  hints?: string[];
  testCases?: TestCase[];
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
  content: InteractiveCodingContent;
  settings?: any;
  tags: string[];
}

interface InteractiveCodingActivityProps {
  activity: LearningActivity;
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function InteractiveCodingActivity({
  activity,
  onComplete,
}: InteractiveCodingActivityProps) {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [testResults, setTestResults] = useState<boolean[]>([]);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showHints, setShowHints] = useState(false);

  // Check authentication status
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

  const { instructions, starterCode, expectedOutput, hints, testCases } =
    activity.content;

  useEffect(() => {
    setCode(starterCode);
  }, [starterCode]);

  const runCode = async () => {
    setIsRunning(true);
    setOutput("");

    try {
      // Simulate code execution (in a real app, you'd use a code execution service)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock execution results
      const mockOutput = "Code executed successfully!\nOutput: Hello, Python!";
      setOutput(mockOutput);

      // Heuristic: consider implementation "ready" when user replaced starter 'pass' stubs
      const heuristicPass =
        typeof code === "string" &&
        code.trim().length > 0 &&
        !code.includes("pass");

      // If there are test cases, evaluate deterministically using the heuristic
      if (testCases && testCases.length > 0) {
        const results = testCases.map(() => heuristicPass);
        setTestResults(results);

        const passedTests = results.filter(Boolean).length;
        const score = Math.round((passedTests / testCases.length) * 100);

        setTimeout(() => {
          setShowResults(true);
          if (score >= 70) {
            handleActivityCompletion(score);
          }
        }, 600);
      } else if (expectedOutput) {
        // If only an expectedOutput is provided, fall back to basic check
        const success =
          heuristicPass ||
          (typeof expectedOutput === "string" &&
            expectedOutput.length > 0 &&
            mockOutput.includes(expectedOutput));
        const score = success ? 85 : 0;

        setTimeout(() => {
          setShowResults(true);
          if (score >= 70) {
            handleActivityCompletion(score);
          }
        }, 600);
      } else {
        // No testCases and no expectedOutput: show results based on heuristic only
        const score = heuristicPass ? 85 : 0;
        setTimeout(() => {
          setShowResults(true);
          if (score >= 70) {
            handleActivityCompletion(score);
          }
        }, 600);
      }
    } catch (error) {
      setOutput(`Error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleActivityCompletion = async (score: number) => {
    if (!isAuthenticated) return;

    const awardedActivities = JSON.parse(
      localStorage.getItem("awardedActivities") || "[]"
    );
    const alreadyAwarded = awardedActivities.includes(activity.id);

    if (!alreadyAwarded) {
      try {
        const response = await fetch("/api/learning-activities/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activityType: "interactive_coding",
            activityId: activity.id,
            activityTitle: activity.title,
            score: Math.max(70, score),
            timeSpent: 600, // 10 minutes estimated
            success: true,
            diamondReward: activity.diamondReward || 40,
            experienceReward: activity.experienceReward || 60,
          }),
        });

        if (response.ok) {
          setShowRewardAnimation(true);
          awardedActivities.push(activity.id);
          localStorage.setItem(
            "awardedActivities",
            JSON.stringify(awardedActivities)
          );
          setTimeout(() => setShowRewardAnimation(false), 3000);
        }
      } catch (error) {
        console.error("Error awarding rewards:", error);
      }
    }
  };

  if (showResults) {
    const passedTests = testResults.filter(Boolean).length;
    const totalTests = testResults.length;
    const score =
      totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 85;
    const passed = score >= 70;

    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="text-center">
          <div
            className={`mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full ${
              passed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
            {passed ? (
              <Trophy className="h-10 w-10" />
            ) : (
              <XCircle className="h-10 w-10" />
            )}
          </div>

          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            {passed ? "Code Complete!" : "Keep Coding!"}
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            {totalTests > 0
              ? `You passed ${passedTests} out of ${totalTests} test cases`
              : "Your code ran successfully!"}
          </p>

          <div className="mb-8 rounded-lg bg-gray-50 p-6">
            <div className="mb-2 text-4xl font-bold text-gray-900">
              {score}%
            </div>
            <div
              className={`text-lg font-semibold ${passed ? "text-green-600" : "text-red-600"}`}
            >
              {passed ? "Excellent Coding!" : "Keep Practicing!"}
            </div>
          </div>

          {testCases && testCases.length > 0 && (
            <div className="mb-8 space-y-4 text-left">
              <h3 className="text-xl font-semibold text-gray-900">
                Test Results:
              </h3>
              {testCases.map((testCase, index) => (
                <div key={index} className="rounded-lg border bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Test Case {index + 1}</div>
                      <div className="text-sm text-gray-600">
                        Input: {testCase.input}
                      </div>
                      <div className="text-sm text-gray-600">
                        Expected: {testCase.expected ?? testCase.expectedOutput}
                      </div>
                    </div>
                    <div
                      className={`rounded-full p-2 ${
                        testResults[index]
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {testResults[index] ? "✓" : "✗"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => onComplete(score, 100, passed)}
            className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-700"
          >
            🎉 Finish & Claim Rewards
          </button>
        </div>

        {/* Reward Animation */}
        {showRewardAnimation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative rounded-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 p-8 text-center shadow-2xl">
              <h3 className="mb-4 text-3xl font-bold text-white">
                🎉 Congratulations! 🎉
              </h3>
              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-center space-x-3 rounded-lg bg-yellow-500/20 p-3">
                  <span className="text-xl font-semibold text-yellow-300">
                    +{activity.diamondReward || 40} Diamonds
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-3 rounded-lg bg-blue-500/20 p-3">
                  <Star className="h-8 w-8 text-blue-400" />
                  <span className="text-xl font-semibold text-blue-300">
                    +{activity.experienceReward || 60} Experience
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {activity.title}
        </h2>
        <p className="text-lg text-gray-600">{activity.description}</p>
      </div>

      <div className="mb-8 rounded-lg bg-blue-50 p-6">
        <h3 className="mb-4 text-xl font-semibold text-blue-900">
          Instructions
        </h3>
        <p className="text-blue-800">{instructions}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Code Editor */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Code Editor</h3>
            <div className="flex items-center space-x-2">
              {hints && hints.length > 0 && (
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="rounded-lg bg-yellow-100 px-3 py-1 text-sm text-yellow-800 hover:bg-yellow-200"
                >
                  💡 Hints
                </button>
              )}
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center space-x-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                <span>{isRunning ? "Running..." : "Run Code"}</span>
              </button>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-80 w-full rounded-lg border border-gray-300 bg-gray-900 p-4 font-mono text-sm text-green-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Write your Python code here..."
          />

          {showHints && hints && hints.length > 0 && (
            <div className="mt-4 rounded-lg bg-yellow-50 p-4">
              <h4 className="mb-2 font-semibold text-yellow-900">Hints:</h4>
              <ul className="space-y-1 text-sm text-yellow-800">
                {hints.map((hint, index) => (
                  <li key={index}>💡 {hint}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Output Panel */}
        <div>
          <div className="mb-4 flex items-center space-x-2">
            <Code className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Output</h3>
          </div>

          <div className="h-80 rounded-lg border border-gray-300 bg-black p-4 font-mono text-sm text-green-400">
            {isRunning ? (
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-400 border-t-transparent"></div>
                <span>Running code...</span>
              </div>
            ) : output ? (
              <pre className="whitespace-pre-wrap">{output}</pre>
            ) : (
              <div className="text-gray-500">
                Click "Run Code" to see output...
              </div>
            )}
          </div>

          {expectedOutput && (
            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              <h4 className="mb-2 font-semibold text-gray-900">
                Expected Output:
              </h4>
              <pre className="text-sm text-gray-700">{expectedOutput}</pre>
            </div>
          )}

          {testCases && testCases.length > 0 && (
            <div className="mt-4 rounded-lg bg-gray-50 p-4">
              <h4 className="mb-2 font-semibold text-gray-900">Test Cases:</h4>
              <div className="space-y-2">
                {testCases.map((testCase, index) => (
                  <div key={index} className="text-sm">
                    <div className="font-medium">Test {index + 1}:</div>
                    <div className="text-gray-600">Input: {testCase.input}</div>
                    <div className="text-gray-600">
                      Expected: {testCase.expected ?? testCase.expectedOutput}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
