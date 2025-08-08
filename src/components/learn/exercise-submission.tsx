"use client";

import { useState, useEffect } from "react";
import {
  Send,
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  Target,
  Code,
  ArrowRight,
} from "lucide-react";

interface SubmissionHistory {
  id: string;
  code: string;
  score: number | null;
  isCorrect: boolean;
  testResults: string | null;
  errorMessage: string | null;
  feedback: string | null;
  submittedAt: string;
  executionTime: number | null;
}

interface ExerciseSubmissionProps {
  lessonId: string;
  exerciseId: string;
  onSubmissionComplete?: (submission: SubmissionHistory) => void;
}

export default function ExerciseSubmission({
  lessonId,
  exerciseId,
  onSubmissionComplete,
}: ExerciseSubmissionProps) {
  const [submissions, setSubmissions] = useState<SubmissionHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch submission history
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(
          `/api/exercises/submissions?lessonId=${lessonId}&exerciseId=${exerciseId}`
        );
        if (response.ok) {
          const data = await response.json();
          setSubmissions(data.submissions || []);
        }
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [lessonId, exerciseId]);

  // Submit code for validation
  const submitCode = async (code: string) => {
    setSubmitting(true);

    try {
      const response = await fetch("/api/exercises/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          lessonId: lessonId,
          exerciseId: exerciseId,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Add new submission to history
        const newSubmission: SubmissionHistory = {
          id: Date.now().toString(),
          code: code,
          score: result.score,
          isCorrect: result.isCorrect,
          testResults: JSON.stringify(result.testResults),
          errorMessage: result.errorMessage,
          feedback: result.feedback,
          submittedAt: new Date().toISOString(),
          executionTime: result.executionTime,
        };

        setSubmissions((prev) => [newSubmission, ...prev]);
        onSubmissionComplete?.(newSubmission);

        return result;
      }
    } catch (error) {
      console.error("Error submitting code:", error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get submission stats
  const stats = {
    total: submissions.length,
    successful: submissions.filter((s) => s.isCorrect).length,
    averageScore:
      submissions.length > 0
        ? Math.round(
            submissions.reduce((sum, s) => sum + (s.score || 0), 0) /
              submissions.length
          )
        : 0,
    bestScore:
      submissions.length > 0
        ? Math.max(...submissions.map((s) => s.score || 0))
        : 0,
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Submission Stats */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Submission Statistics
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-sm text-gray-500">Total Attempts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.successful}
            </div>
            <div className="text-sm text-gray-500">Successful</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.averageScore}%
            </div>
            <div className="text-sm text-gray-500">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.bestScore}%
            </div>
            <div className="text-sm text-gray-500">Best Score</div>
          </div>
        </div>
      </div>

      {/* Submission History */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Submission History
        </h3>

        {submissions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Code className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No submissions yet</p>
            <p className="text-sm">Submit your code to see the history here</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {submissions.map((submission, index) => (
              <div key={submission.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {submission.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className="font-medium">
                        Attempt {submissions.length - index}
                      </span>
                    </div>
                    {submission.score !== null && (
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          submission.isCorrect
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {submission.score}%
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(submission.submittedAt)}
                  </div>
                </div>

                {/* Code Preview */}
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-600 mb-1">
                    Code:
                  </div>
                  <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto max-h-32 overflow-y-auto">
                    <code>{submission.code}</code>
                  </pre>
                </div>

                {/* Results */}
                {submission.testResults && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Test Results:
                    </div>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      {JSON.parse(submission.testResults).map(
                        (result: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 mb-1"
                          >
                            {result.passed ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-xs">
                              {result.description}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {submission.errorMessage && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Error:
                    </div>
                    <div className="bg-red-50 border border-red-200 p-3 rounded text-sm text-red-700">
                      {submission.errorMessage}
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {submission.feedback && (
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Feedback:
                    </div>
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm text-blue-700">
                      {submission.feedback}
                    </div>
                  </div>
                )}

                {/* Execution Time */}
                {submission.executionTime !== null && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    Executed in {submission.executionTime}ms
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Success Achievement */}
      {stats.successful > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <Trophy className="w-12 h-12 text-yellow-500" />
            <div>
              <h4 className="text-lg font-semibold text-green-800">
                Great Progress!
              </h4>
              <p className="text-green-700">
                You've successfully completed {stats.successful} exercise
                {stats.successful > 1 ? "s" : ""}
                with an average score of {stats.averageScore}%
              </p>
              {stats.successful >= 3 && (
                <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                  <ArrowRight className="w-4 h-4" />
                  You're ready for the next challenge!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
