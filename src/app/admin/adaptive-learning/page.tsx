"use client";

import React, { useEffect, useState, useMemo } from "react";

type RecommendationItem = {
  activityId: string;
  score: number;
  reasons: string[];
  category?: string;
  difficulty?: number;
  estimatedMinutes?: number;
  activity?: {
    id: string;
    title: string;
    category?: string | null;
    difficulty?: number | null;
    estimatedMinutes?: number | null;
  } | null;
};

type Analytics = {
  categoryPerformance: Record<
    string,
    {
      completedLessons: number;
      totalLessons: number;
      averageScore: number;
      averageTime: number;
      strugglingTopics: string[];
      masteredTopics: string[];
    }
  >;
  learningPattern: {
    preferredDifficulty: "beginner" | "intermediate" | "advanced";
    averageSessionTime: number;
    mostActiveTimeOfDay: string;
    learningStreak: number;
    consistencyScore: number;
  };
  recommendations: {
    nextLesson: any;
    reviewLessons: any[];
    focusAreas: string[];
    difficultyAdjustment: "increase" | "maintain" | "decrease";
    estimatedCompletionTime: number;
  };
};

type AdaptiveGetResponse = {
  success: boolean;
  analytics: Analytics;
  recommendationsQueue: RecommendationItem[];
  lastUpdated: string;
};

function formatDate(s?: string | null) {
  if (!s) return "-";
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s || "-";
  }
}

function difficultyLabel(d?: number | null) {
  const n = d ?? 1;
  if (n <= 1) return "Beginner";
  if (n === 2) return "Intermediate";
  return "Advanced";
}

function pct(n: number) {
  const p = Math.round(Math.max(0, Math.min(1, n)) * 100);
  return `${p}%`;
}

export default function AdminAdaptiveLearningPage() {
  const [data, setData] = useState<AdaptiveGetResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/adaptive-learning", { cache: "no-store" });
      const j = (await res.json()) as AdaptiveGetResponse;
      if (!res.ok)
        throw new Error((j as any)?.error || `Request failed (${res.status})`);
      setData(j);
    } catch (e: any) {
      setError(e?.message || "Failed to fetch adaptive analytics");
    } finally {
      setLoading(false);
    }
  }

  async function refreshQueue(limit = 8, ttlHours = 6) {
    setRefreshing(true);
    setError(null);
    try {
      const res = await fetch("/api/adaptive-learning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "refresh_recommendations",
          data: { limit, ttlHours },
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error || `POST failed (${res.status})`);
      await load();
    } catch (e: any) {
      setError(e?.message || "Failed to refresh recommendations");
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const queue = data?.recommendationsQueue ?? [];
  const analytics = data?.analytics;

  const categoryPerfRows = useMemo(() => {
    if (!analytics?.categoryPerformance) return [];
    return Object.entries(analytics.categoryPerformance).map(([cat, perf]) => ({
      category: cat,
      ...perf,
    }));
  }, [analytics]);

  return (
    <div className="space-y-6 p-6 text-slate-900">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          Adaptive Recommendations
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => refreshQueue(8, 6)}
            disabled={refreshing}
            className={`rounded px-3 py-1 text-white ${
              refreshing ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {refreshing ? "Refreshing..." : "Refresh Queue"}
          </button>
          <button
            onClick={load}
            disabled={loading}
            className={`rounded border px-3 py-1 ${
              loading
                ? "border-slate-300 text-gray-400"
                : "border-slate-300 text-slate-900 hover:bg-slate-100"
            }`}
          >
            {loading ? "Loading..." : "Reload"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded border bg-white p-4">
          <div className="text-sm text-slate-900">Last Updated</div>
          <div className="text-lg font-semibold">
            {data?.lastUpdated ? formatDate(data.lastUpdated) : "-"}
          </div>
        </div>

        <div className="rounded border bg-white p-4">
          <div className="text-sm text-slate-900">Preferred Difficulty</div>
          <div className="text-lg font-semibold capitalize">
            {analytics?.learningPattern?.preferredDifficulty || "-"}
          </div>
        </div>

        <div className="rounded border bg-white p-4">
          <div className="text-sm text-slate-900">Consistency Score</div>
          <div className="text-lg font-semibold">
            {analytics?.learningPattern?.consistencyScore ?? "-"}
          </div>
        </div>
      </div>

      <div className="rounded border bg-white">
        <div className="grid grid-cols-12 border-b bg-white p-2 text-xs font-semibold text-slate-900">
          <div className="col-span-4 p-2">Category</div>
          <div className="col-span-2 p-2 text-right">Completed / Total</div>
          <div className="col-span-2 p-2 text-right">Avg Score</div>
          <div className="col-span-2 p-2 text-right">Avg Time (s)</div>
          <div className="col-span-2 p-2">Struggling / Mastered Topics</div>
        </div>
        {categoryPerfRows.length === 0 ? (
          <div className="p-4 text-slate-900">
            No category performance data.
          </div>
        ) : (
          <div className="divide-y">
            {categoryPerfRows.map((row) => (
              <div key={row.category} className="grid grid-cols-12 text-sm">
                <div className="col-span-4 p-2">{row.category}</div>
                <div className="col-span-2 p-2 text-right">
                  {row.completedLessons} / {row.totalLessons}
                </div>
                <div className="col-span-2 p-2 text-right">
                  {row.averageScore}
                </div>
                <div className="col-span-2 p-2 text-right">
                  {row.averageTime}
                </div>
                <div className="col-span-2 p-2 text-xs text-slate-900">
                  <div>
                    Struggling:{" "}
                    {row.strugglingTopics.slice(0, 3).join(", ") || "-"}
                  </div>
                  <div>
                    Mastered: {row.masteredTopics.slice(0, 3).join(", ") || "-"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            Recommendation Queue
          </h2>
          <div className="text-sm text-slate-900">
            Total: <b>{queue.length}</b>
          </div>
        </div>

        <div className="rounded border bg-white">
          <div className="grid grid-cols-12 border-b bg-white p-2 text-xs font-semibold text-slate-900">
            <div className="col-span-5 p-2">Activity</div>
            <div className="col-span-2 p-2">Category</div>
            <div className="col-span-1 p-2">Diff.</div>
            <div className="col-span-1 p-2 text-right">Est. Min</div>
            <div className="col-span-1 p-2 text-right">Score</div>
            <div className="col-span-2 p-2">Reasons</div>
          </div>

          {queue.length === 0 ? (
            <div className="p-4 text-slate-900">
              No recommendations yet. Try Refresh Queue.
            </div>
          ) : (
            <div className="divide-y">
              {queue.map((item) => {
                const a = item.activity;
                return (
                  <div
                    key={`${item.activityId}-${item.score}`}
                    className="grid grid-cols-12 text-sm"
                  >
                    <div className="col-span-5 p-2">
                      <div className="font-medium">
                        {a?.title || item.activityId}
                      </div>
                      <div className="text-xs text-slate-900">
                        ID: {item.activityId}
                      </div>
                    </div>
                    <div className="col-span-2 p-2">
                      {a?.category || item.category || "-"}
                    </div>
                    <div className="col-span-1 p-2">
                      {difficultyLabel(a?.difficulty ?? item.difficulty)}
                    </div>
                    <div className="col-span-1 p-2 text-right">
                      {a?.estimatedMinutes ?? item.estimatedMinutes ?? "-"}
                    </div>
                    <div className="col-span-1 p-2 text-right">
                      {pct(item.score)}
                    </div>
                    <div className="col-span-2 p-2 text-xs text-slate-900">
                      {item.reasons?.length
                        ? item.reasons.slice(0, 3).join(", ")
                        : "-"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-slate-900">
        Tip: Queue uses mastery gaps, difficulty alignment, diversity, and
        recency. Click Refresh Queue to regenerate from latest mastery state.
        Queue is cached for a few hours to improve performance.
      </div>
    </div>
  );
}
