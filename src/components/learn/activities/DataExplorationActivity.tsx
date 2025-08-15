"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  CheckCircle,
  XCircle,
  Trophy,
  Star,
  Gift,
  TrendingUp,
} from "lucide-react";

interface Task {
  id: number;
  task: string;
  points: number;
}

interface Dataset {
  name: string;
  columns: string[];
  data: any[][];
}

interface DataExplorationContent {
  instructions: string;
  dataset: Dataset;
  tasks: Task[];
  hints?: string[];
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
  content: DataExplorationContent;
  settings?: any;
  tags: string[];
}

interface DataExplorationActivityProps {
  activity: LearningActivity;
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function DataExplorationActivity({
  activity,
  onComplete,
}: DataExplorationActivityProps) {
  // Safety check for activity prop
  if (!activity || typeof activity !== "object") {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="text-center">
          <div className="mb-4 text-lg font-semibold text-red-500">
            Activity Loading Error
          </div>
          <p className="text-gray-600">
            Activity data is not available. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [taskAnswers, setTaskAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
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

  // Normalize content to support BOTH schemas:
  // 1) Structured schema: { dataset: { name, columns: string[], data: any[][] }, tasks: Task[] }
  // 2) Seed schema: { title?, instructions, dataset: Array<object>, questions: Array<{question, ...}> }
  const raw: any = activity?.content ?? {};

  const instructions: string =
    typeof raw.instructions === "string" && raw.instructions.trim() !== ""
      ? raw.instructions
      : "Explore the dataset below and complete the analysis tasks.";

  const safeHints = Array.isArray(raw.hints)
    ? (raw.hints as any[]).filter((h) => typeof h === "string")
    : [];

  // Determine seed vs structured
  const isSeedDataset = Array.isArray(raw?.dataset);
  let datasetName: string =
    typeof raw?.title === "string"
      ? raw.title
      : typeof raw?.dataset?.name === "string"
        ? raw.dataset.name
        : "Dataset";

  // Normalized columns, rows, and tasks
  let columns: string[] = [];
  let dataRows: any[][] = [];
  let tasksList: Task[] = [];

  if (isSeedDataset) {
    // Seed variant: dataset is an array of objects
    const records: any[] = Array.isArray(raw.dataset) ? raw.dataset : [];
    const colSet = new Set<string>();
    for (const rec of records) {
      if (rec && typeof rec === "object") {
        Object.keys(rec).forEach((k) => colSet.add(k));
      }
    }
    columns = Array.from(colSet);
    dataRows = records.map((rec) =>
      columns.map((c) => (rec ? rec[c] : undefined))
    );
    // Map "questions" into tasks (free-form answer + points)
    const qs: any[] = Array.isArray(raw.questions) ? raw.questions : [];
    tasksList = qs.map((q, i) => ({
      id: i + 1,
      task: String(q?.question ?? `Question ${i + 1}`),
      points: Number.isFinite(q?.points) ? Number(q.points) : 10,
    }));
  } else {
    // Structured variant
    const ds = raw?.dataset ?? {};
    columns = Array.isArray(ds?.columns) ? ds.columns : [];
    dataRows = Array.isArray(ds?.data) ? ds.data : [];
    datasetName =
      typeof ds?.name === "string" && ds.name.trim() !== ""
        ? ds.name
        : datasetName;

    const ts: any[] = Array.isArray(raw?.tasks) ? raw.tasks : [];
    tasksList = ts.filter(
      (t) => t && typeof t.task === "string" && t.points !== undefined
    );
  }

  // Validation guard
  if (columns.length === 0 || dataRows.length === 0 || tasksList.length === 0) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="text-center">
          <div className="mb-4 text-lg font-semibold text-red-500">
            Data Exploration Activity Error
          </div>
          <p className="text-gray-600">
            This activity doesn't have the required dataset or tasks configured
            properly.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Dataset columns: {columns.length}, Dataset rows: {dataRows.length},
            Tasks: {tasksList.length}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Reload Activity
          </button>
        </div>
      </div>
    );
  }

  const handleTaskAnswer = (taskId: number, answer: string) => {
    setTaskAnswers({
      ...taskAnswers,
      [taskId]: answer,
    });
  };

  const completeTask = (taskId: number) => {
    const newCompleted = new Set(completedTasks);
    newCompleted.add(taskId);
    setCompletedTasks(newCompleted);
  };

  const submitExploration = () => {
    setShowResults(true);
    const completedPoints = Array.from(completedTasks).reduce(
      (total, taskId) => {
        const task = tasksList.find((t) => t && t.id === taskId);
        return total + (task?.points || 0);
      },
      0
    );

    const totalPoints = tasksList.reduce(
      (total, task) => total + (task?.points || 0),
      0
    );
    const score = Math.round((completedPoints / totalPoints) * 100);
    const success = score >= 70;

    if (success) {
      handleActivityCompletion(score);
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
            activityType: "data_exploration",
            activityId: activity.id,
            activityTitle: activity.title,
            score: Math.max(70, score),
            timeSpent: 600, // 10 minutes estimated
            success: true,
            diamondReward: activity.diamondReward || 60,
            experienceReward: activity.experienceReward || 90,
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

  // Calculate basic statistics for the dataset (numeric columns only)
  const getColumnStats = (columnIndex: number) => {
    try {
      if (!Array.isArray(dataRows) || columnIndex >= columns.length)
        return null;

      const values = dataRows
        .filter((row) => Array.isArray(row) && row.length > columnIndex)
        .map((row) => row[columnIndex])
        .filter(
          (val) => typeof val === "number" && !Number.isNaN(val as number)
        ) as number[];

      if (values.length === 0) return null;

      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);

      return { sum, avg: avg.toFixed(2), min, max, count: values.length };
    } catch (error) {
      console.error("Error calculating column stats:", error);
      return null;
    }
  };

  if (showResults) {
    const completedPoints = Array.from(completedTasks).reduce(
      (total, taskId) => {
        const task = tasksList.find((t) => t && t.id === taskId);
        return total + (task?.points || 0);
      },
      0
    );

    const totalPoints = tasksList.reduce(
      (total, task) => total + (task?.points || 0),
      0
    );
    const score = Math.round((completedPoints / totalPoints) * 100);
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
            {passed ? "Data Analysis Complete!" : "Keep Exploring!"}
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            You completed {completedTasks.size} out of {tasksList.length}{" "}
            analysis tasks
          </p>

          <div className="mb-8 rounded-lg bg-gray-50 p-6">
            <div className="mb-2 text-4xl font-bold text-gray-900">
              {score}%
            </div>
            <div
              className={`text-lg font-semibold ${passed ? "text-green-600" : "text-red-600"}`}
            >
              {passed ? "Data Scientist!" : "More Analysis Needed"}
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Points Earned: {completedPoints} / {totalPoints}
            </div>
          </div>

          <div className="mb-8 space-y-4 text-left">
            <h3 className="text-xl font-semibold text-gray-900">
              Task Results:
            </h3>
            {tasksList.map((task) => (
              <div key={task.id} className="rounded-lg border bg-white p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{task.task}</div>
                    <div className="text-sm text-gray-600">
                      Points: {task.points}
                    </div>
                    {taskAnswers[task.id] && (
                      <div className="mt-2 text-sm text-blue-600">
                        Your answer: {taskAnswers[task.id]}
                      </div>
                    )}
                  </div>
                  <div
                    className={`rounded-full p-2 ${
                      completedTasks.has(task.id)
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {completedTasks.has(task.id) ? "✓" : "○"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onComplete(score, 100, passed)}
            className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-700"
          >
            Complete Data Exploration
          </button>
        </div>

        {/* Reward Animation */}
        {showRewardAnimation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative rounded-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 p-8 text-center shadow-2xl">
              <h3 className="mb-4 text-3xl font-bold text-white">
                🎉 Data Scientist! 🎉
              </h3>
              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-center space-x-3 rounded-lg bg-yellow-500/20 p-3">
                  <span className="text-xl font-semibold text-yellow-300">
                    +{activity.diamondReward || 60} Diamonds
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-3 rounded-lg bg-blue-500/20 p-3">
                  <Star className="h-8 w-8 text-blue-400" />
                  <span className="text-xl font-semibold text-blue-300">
                    +{activity.experienceReward || 90} Experience
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
        {safeHints && safeHints.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowHints(!showHints)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              💡 {showHints ? "Hide" : "Show"} Hints
            </button>
            {showHints && (
              <div className="mt-2 space-y-1">
                {safeHints.map((hint, index) => (
                  <div key={index} className="text-sm text-blue-700">
                    • {hint}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Dataset View */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            📊 Dataset: {datasetName}
          </h3>

          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((column, index) => (
                      <th
                        key={index}
                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {dataRows.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="whitespace-nowrap px-4 py-2 text-sm text-gray-900"
                        >
                          {typeof cell === "object" && cell !== null
                            ? Array.isArray(cell)
                              ? JSON.stringify(cell)
                              : JSON.stringify(cell)
                            : String(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Basic Statistics */}
          <div className="mt-4 rounded-lg bg-gray-50 p-4">
            <h4 className="mb-2 font-semibold text-gray-900">📈 Quick Stats</h4>
            <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
              <div>Rows: {dataRows.length}</div>
              <div>Columns: {columns.length}</div>
              {columns.map((column, index) => {
                const stats = getColumnStats(index);
                if (stats) {
                  return (
                    <div key={index} className="col-span-2">
                      <strong>{column}:</strong> Avg: {stats.avg}, Min:{" "}
                      {stats.min}, Max: {stats.max}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>

        {/* Tasks Panel */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            🎯 Analysis Tasks
          </h3>

          <div className="space-y-4">
            {tasksList.map((task) => (
              <div
                key={task.id}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{task.task}</div>
                    <div className="text-sm text-gray-600">
                      Worth {task.points} points
                    </div>
                  </div>
                  <div
                    className={`rounded-full p-1 ${
                      completedTasks.has(task.id)
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {completedTasks.has(task.id) ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <TrendingUp className="h-5 w-5" />
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter your answer..."
                    value={taskAnswers[task.id] || ""}
                    onChange={(e) => handleTaskAnswer(task.id, e.target.value)}
                    className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm text-black placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => completeTask(task.id)}
                    disabled={
                      !taskAnswers[task.id] || completedTasks.has(task.id)
                    }
                    className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {completedTasks.has(task.id) ? "✓" : "Submit"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="mt-6 rounded-lg bg-blue-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                Progress
              </span>
              <span className="text-sm text-blue-700">
                {completedTasks.size}/{tasksList.length} tasks completed
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-blue-200">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                style={{
                  width: `${tasksList.length > 0 ? (completedTasks.size / tasksList.length) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={submitExploration}
          disabled={completedTasks.size === 0}
          className="rounded-lg bg-green-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit Data Analysis
        </button>
      </div>
    </div>
  );
}
