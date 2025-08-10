"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Filter,
  Search,
  Clock,
  Trophy,
  Download,
  Eye,
  Database,
} from "lucide-react";

interface DataPoint {
  id: string;
  [key: string]: any;
}

interface DataExplorationActivityProps {
  activity: {
    content: {
      title: string;
      instructions?: string;
      dataset: DataPoint[];
      questions: Array<{
        id: string;
        question: string;
        type: "filter" | "analyze" | "visualize" | "calculate";
        answer: any;
        hint?: string;
      }>;
      timeLimit?: number;
      allowExport?: boolean;
    };
  };
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function DataExplorationActivity({
  activity,
  onComplete,
}: DataExplorationActivityProps) {
  // Validate activity data
  if (!activity?.content) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-lg font-semibold text-red-500">
          Invalid Activity Data
        </div>
        <p className="text-gray-600">
          This data exploration activity doesn't have the required content
          configuration.
        </p>
      </div>
    );
  }

  const contentData = activity.content;
  const dataset = contentData.dataset || [];
  const questions = contentData.questions || [];
  const activityTitle = contentData.title || "Data Exploration";

  if (dataset.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-lg font-semibold text-red-500">
          No Dataset Available
        </div>
        <p className="text-gray-600">
          This activity doesn't have any data to explore.
        </p>
      </div>
    );
  }

  const [currentData, setCurrentData] = useState<DataPoint[]>(dataset);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [showVisualization, setShowVisualization] = useState(false);
  const [timeLeft, setTimeLeft] = useState(contentData.timeLimit || 1200);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [filters, searchTerm, sortField, sortDirection]);

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isCompleted) {
      handleComplete();
    }
  }, [timeLeft, isCompleted]);

  const applyFiltersAndSearch = () => {
    try {
      let filteredData = [...dataset];

      // Apply search
      if (searchTerm) {
        filteredData = filteredData.filter((item) =>
          Object.values(item || {}).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }

      // Apply filters
      Object.keys(filters).forEach((field) => {
        if (filters[field]) {
          filteredData = filteredData.filter((item) =>
            String(item?.[field] || "")
              .toLowerCase()
              .includes(filters[field].toLowerCase())
          );
        }
      });

      // Apply sorting
      if (sortField) {
        filteredData.sort((a, b) => {
          const aVal = a?.[sortField];
          const bVal = b?.[sortField];

          if (typeof aVal === "number" && typeof bVal === "number") {
            return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
          } else {
            const comparison = String(aVal || "").localeCompare(
              String(bVal || "")
            );
            return sortDirection === "asc" ? comparison : -comparison;
          }
        });
      }

      setCurrentData(filteredData);
    } catch (error) {
      console.error("Error applying filters and search:", error);
    }
  };

  const getColumns = () => {
    if (dataset.length === 0) return [];
    return Object.keys(dataset[0] || {}).filter((key) => key !== "id");
  };

  const getUniqueValues = (field: string) => {
    try {
      const values = dataset
        .map((item) => item?.[field])
        .filter((val) => val !== undefined && val !== null);
      return [...new Set(values)].sort();
    } catch (error) {
      console.error("Error getting unique values:", error);
      return [];
    }
  };

  const calculateStats = (field: string) => {
    const values = currentData
      .map((item) => item[field])
      .filter((val) => typeof val === "number");
    if (values.length === 0) return null;

    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return {
      sum,
      avg: Math.round(avg * 100) / 100,
      min,
      max,
      count: values.length,
    };
  };

  const handleQuestionAnswer = (questionId: string, answer: any) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const checkAnswer = (question: any, userAnswer: any) => {
    if (question.type === "calculate") {
      return (
        Math.abs(parseFloat(userAnswer) - parseFloat(question.answer)) < 0.01
      );
    } else if (question.type === "filter") {
      return parseInt(userAnswer) === parseInt(question.answer);
    } else {
      return (
        String(userAnswer).toLowerCase() ===
        String(question.answer).toLowerCase()
      );
    }
  };

  const handleComplete = () => {
    try {
      setIsCompleted(true);

      let correctAnswers = 0;
      questions.forEach((question) => {
        if (
          answers[question?.id] &&
          checkAnswer(question, answers[question.id])
        ) {
          correctAnswers++;
        }
      });

      const accuracyScore =
        questions.length > 0
          ? Math.round((correctAnswers / questions.length) * 100)
          : 100;

      const timeBonus =
        timeLeft > 0
          ? Math.round((timeLeft / (contentData.timeLimit || 1200)) * 10)
          : 0;
      const finalScore = Math.min(100, accuracyScore + timeBonus);

      setScore(finalScore);
      onComplete(finalScore, 100, correctAnswers === questions.length);
    } catch (error) {
      console.error("Error completing data exploration activity:", error);
      onComplete(0, 100, false);
    }
  };

  const exportData = () => {
    const csvContent = [
      getColumns().join(","),
      ...currentData.map((row) =>
        getColumns()
          .map((col) => row[col])
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "filtered_data.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setFilters({});
    setSearchTerm("");
    setSortField("");
    setSortDirection("asc");
  };

  if (isCompleted) {
    const correctAnswers = questions.filter(
      (question) =>
        answers[question?.id] && checkAnswer(question, answers[question.id])
    ).length;

    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <div className="mb-6">
          <Trophy className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Data Exploration Complete!
          </h2>
          <div className="mb-4 text-lg text-gray-600">
            You scored {score}% ({correctAnswers}/{questions.length} correct)
          </div>

          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="text-2xl font-bold text-blue-600">
                {dataset.length}
              </div>
              <div className="text-sm text-blue-800">Total Records</div>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="text-2xl font-bold text-green-600">
                {getColumns().length}
              </div>
              <div className="text-sm text-green-800">Data Fields</div>
            </div>
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
              <div className="text-2xl font-bold text-purple-600">
                {Math.floor(((contentData.timeLimit || 1200) - timeLeft) / 60)}m
              </div>
              <div className="text-sm text-purple-800">Time Used</div>
            </div>
          </div>

          <div
            className={`mb-6 rounded-lg p-4 font-medium ${
              score >= 70
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {score >= 70
              ? "🎉 Excellent data exploration skills! You can analyze and interpret data effectively!"
              : "📊 Good start! Keep practicing data analysis to improve your insights."}
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Explore More Data
        </button>
      </div>
    );
  }

  const columns = getColumns();

  return (
    <div className="mx-auto max-w-7xl p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">
              Data Exploration: {activityTitle}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>
                {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
            <div className="text-sm">
              Records: {currentData.length}/{dataset.length}
            </div>
          </div>
        </div>

        {contentData.instructions && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-blue-800">{contentData.instructions}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        {/* Data Controls */}
        <div className="space-y-4 xl:col-span-1">
          {/* Search */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-3 flex items-center font-semibold text-gray-900">
              <Search className="mr-2 h-4 w-4" />
              Search
            </h3>
            <input
              type="text"
              placeholder="Search all fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          {/* Filters */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-3 flex items-center font-semibold text-gray-900">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </h3>
            <div className="space-y-3">
              {columns.slice(0, 3).map((column) => (
                <div key={column}>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    {column}
                  </label>
                  <select
                    value={filters[column] || ""}
                    onChange={(e) =>
                      setFilters({ ...filters, [column]: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">All values</option>
                    {getUniqueValues(column)
                      .slice(0, 10)
                      .map((value) => (
                        <option key={value} value={value}>
                          {String(value)}
                        </option>
                      ))}
                  </select>
                </div>
              ))}
              <button
                onClick={resetFilters}
                className="w-full rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Sorting */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-3 flex items-center font-semibold text-gray-900">
              <TrendingUp className="mr-2 h-4 w-4" />
              Sort
            </h3>
            <div className="space-y-2">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">No sorting</option>
                {columns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
              {sortField && (
                <select
                  value={sortDirection}
                  onChange={(e) =>
                    setSortDirection(e.target.value as "asc" | "desc")
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-3 flex items-center font-semibold text-gray-900">
              <BarChart3 className="mr-2 h-4 w-4" />
              Statistics
            </h3>
            <div className="space-y-2 text-sm">
              {columns
                .filter((col) => {
                  const sampleValue = currentData[0]?.[col];
                  return typeof sampleValue === "number";
                })
                .slice(0, 2)
                .map((column) => {
                  const stats = calculateStats(column);
                  if (!stats) return null;

                  return (
                    <div key={column} className="rounded bg-gray-50 p-2">
                      <div className="font-medium text-gray-700">{column}</div>
                      <div className="text-xs text-gray-600">
                        Avg: {stats.avg} | Min: {stats.min} | Max: {stats.max}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-3 font-semibold text-gray-900">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowVisualization(!showVisualization)}
                className="flex w-full items-center justify-center space-x-2 rounded-md bg-blue-100 px-3 py-2 text-sm text-blue-700 transition-colors hover:bg-blue-200"
              >
                <Eye className="h-4 w-4" />
                <span>{showVisualization ? "Hide" : "Show"} Chart</span>
              </button>
              {contentData.allowExport && (
                <button
                  onClick={exportData}
                  className="flex w-full items-center justify-center space-x-2 rounded-md bg-green-100 px-3 py-2 text-sm text-green-700 transition-colors hover:bg-green-200"
                >
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 xl:col-span-3">
          {/* Visualization */}
          <AnimatePresence>
            {showVisualization && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-lg border border-gray-200 bg-white p-6"
              >
                <h3 className="mb-4 flex items-center font-semibold text-gray-900">
                  <PieChart className="mr-2 h-5 w-5" />
                  Data Visualization
                </h3>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                  <BarChart3 className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                  <p className="text-gray-500">
                    Interactive chart would appear here showing current data
                  </p>
                  <p className="mt-2 text-sm text-gray-400">
                    Showing {currentData.length} records across {columns.length}{" "}
                    fields
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Questions */}
          {questions.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h3 className="mb-4 font-semibold text-gray-900">
                Analysis Questions ({currentQuestion + 1}/{questions.length})
              </h3>

              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div
                    key={question?.id || index}
                    className={`rounded-lg border p-4 ${
                      index === currentQuestion
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <h4 className="mb-2 font-medium text-gray-900">
                      Q{index + 1}:{" "}
                      {question?.question || "Question not available"}
                    </h4>

                    {question?.hint && (
                      <p className="mb-3 text-sm italic text-gray-600">
                        💡 {question.hint}
                      </p>
                    )}

                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Your answer..."
                        value={answers[question?.id || String(index)] || ""}
                        onChange={(e) =>
                          handleQuestionAnswer(
                            question?.id || String(index),
                            e.target.value
                          )
                        }
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                      />
                      {answers[question?.id || String(index)] && (
                        <div
                          className={`rounded px-2 py-1 text-xs font-medium ${
                            checkAnswer(
                              question,
                              answers[question?.id || String(index)]
                            )
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {checkAnswer(
                            question,
                            answers[question?.id || String(index)]
                          )
                            ? "Correct"
                            : "Incorrect"}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={() =>
                      setCurrentQuestion(Math.max(0, currentQuestion - 1))
                    }
                    disabled={currentQuestion === 0}
                    className="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {currentQuestion === questions.length - 1 ? (
                    <button
                      onClick={handleComplete}
                      className="rounded-md bg-green-600 px-6 py-2 text-white hover:bg-green-700"
                    >
                      Complete Analysis
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        setCurrentQuestion(
                          Math.min(questions.length - 1, currentQuestion + 1)
                        )
                      }
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Data Table */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-gray-900">Data Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    {columns.map((column) => (
                      <th
                        key={column}
                        className="p-3 text-left font-medium text-gray-700"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentData.slice(0, 50).map((row, index) => (
                    <tr
                      key={row.id || index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      {columns.map((column) => (
                        <td key={column} className="p-3 text-gray-900">
                          {String(row[column])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {currentData.length > 50 && (
                <div className="py-4 text-center text-sm text-gray-500">
                  Showing first 50 of {currentData.length} records
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
