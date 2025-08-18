"use client";

import React, { useEffect, useMemo, useState } from "react";

type UserProgress = {
  progress: number; // 0..100
  isUnlocked: boolean;
  isCompleted: boolean;
  earnedAt?: string | null;
  unlockedAt?: string | null;
  progressData?: string | null;
};

type Achievement = {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  rarity: string;
  color: string;
  conditionType: string;
  targetValue: number;
  rewardDiamonds?: number | null;
  rewardXp?: number | null;
  rewardCardPack?: string | null;
  isActive: boolean;
  isHidden: boolean;
  totalEarned: number;
  userProgress: UserProgress;
};

type AchievementsResponse = {
  achievements: Achievement[];
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    locked: number;
    totalRewardsEarned: {
      diamonds: number;
      xp: number;
    };
    categories: Record<string, number>;
  };
  userLevel: number;
  userXp: number;
  generatedAt: string;
};

function formatDate(s?: string | null) {
  if (!s) return "-";
  try {
    const d = new Date(s);
    return d.toLocaleString();
  } catch {
    return s || "-";
  }
}

export default function AdminAchievementsPage() {
  // Admin selects a target user; by default DO NOT show current user's data
  const [targetUserId, setTargetUserId] = useState<string>("");
  const [pendingUserId, setPendingUserId] = useState<string>("");

  const [data, setData] = useState<AchievementsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<
    "all" | "completed" | "in_progress" | "locked"
  >("all");
  const [category, setCategory] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [recomputing, setRecomputing] = useState(false);

  async function load(forUserId: string) {
    if (!forUserId) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("status", filter);
      params.set("category", category);
      params.set("userId", forUserId.trim()); // admin override target user

      const url = `/api/achievements?${params.toString()}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `Request failed (${res.status})`);
      }
      const j = (await res.json()) as AchievementsResponse;
      setData(j);
    } catch (e: any) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // Reload when filter/category/targetUserId changes
  useEffect(() => {
    if (targetUserId) {
      void load(targetUserId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, category, targetUserId]);

  const categories = useMemo(() => {
    if (!data?.stats?.categories) return ["all"];
    const keys = Object.keys(data.stats.categories);
    return ["all", ...keys];
  }, [data]);

  // Achievements GET recomputes and persists progress, so a reload is enough
  async function recomputeProgress() {
    if (!targetUserId) return;
    setRecomputing(true);
    setError(null);
    try {
      await load(targetUserId);
      alert("Recomputed achievements progress for selected user");
    } catch (e: any) {
      setError(e?.message || "Recompute failed");
    } finally {
      setRecomputing(false);
    }
  }

  const disabled = !targetUserId;

  return (
    <div className="space-y-6 p-6 text-slate-900">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          Achievements Manager
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={pendingUserId}
            onChange={(e) => setPendingUserId(e.target.value)}
            placeholder="Enter target userId"
            className="w-64 rounded border px-2 py-1"
          />
          <button
            className={`rounded border px-3 py-1 ${
              pendingUserId.trim()
                ? "border-slate-300 text-slate-900 hover:bg-slate-100"
                : "cursor-not-allowed border-slate-200 text-slate-400"
            }`}
            disabled={!pendingUserId.trim()}
            onClick={() => {
              setTargetUserId(pendingUserId.trim());
              setData(null);
            }}
          >
            Load User
          </button>

          <select
            className="rounded border px-2 py-1"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            className="rounded border px-2 py-1"
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value as "all" | "completed" | "in_progress" | "locked"
              )
            }
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="locked">Locked</option>
          </select>

          <button
            onClick={recomputeProgress}
            disabled={recomputing || disabled}
            className={`rounded px-3 py-1 text-white ${
              recomputing || disabled
                ? "bg-slate-400"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {recomputing ? "Recomputing..." : "Recompute Progress"}
          </button>
        </div>
      </div>

      {!targetUserId && (
        <div className="rounded border border-amber-200 bg-amber-50 p-3 text-amber-800">
          Enter a target userId and click “Load User” to inspect achievements.
          The admin panel does not show the current admin’s own progress by
          default.
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded border bg-white p-4">
              <div className="font-medium">Total</div>
              <div className="text-2xl font-bold">
                {data?.stats.total ?? "-"}
              </div>
            </div>
            <div className="rounded border bg-white p-4">
              <div className="font-medium">Completed</div>
              <div className="text-2xl font-bold text-green-600">
                {data?.stats.completed ?? "-"}
              </div>
            </div>
            <div className="rounded border bg-white p-4">
              <div className="font-medium">In Progress</div>
              <div className="text-2xl font-bold text-amber-600">
                {data?.stats.inProgress ?? "-"}
              </div>
            </div>
          </div>

          <div className="text-sm">
            Target User:{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5">
              {targetUserId}
            </code>{" "}
            • Level: {data?.userLevel ?? "-"} • XP: {data?.userXp ?? "-"} •
            Updated: {data?.generatedAt ? formatDate(data.generatedAt) : "-"}
          </div>

          <div className="mt-4">
            {loading ? (
              <div>Loading achievements...</div>
            ) : !data?.achievements?.length ? (
              <div>No achievements found.</div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {data.achievements.map((a) => {
                  const p = a.userProgress;
                  return (
                    <div
                      key={a.id}
                      className="flex items-start gap-4 rounded border bg-white p-4"
                      style={{ borderColor: a.color || "#e5e7eb" }}
                    >
                      <div className="text-3xl">{a.icon || "🏆"}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold">{a.title}</div>
                          <span
                            className="rounded-full border px-2 py-0.5 text-xs"
                            style={{
                              borderColor: a.color || "#e5e7eb",
                              color: a.color || "#111827",
                            }}
                          >
                            {a.rarity}
                          </span>
                          {a.isHidden && (
                            <span className="rounded-full border border-slate-300 px-2 py-0.5 text-xs">
                              hidden
                            </span>
                          )}
                        </div>
                        <div className="text-sm">{a.description}</div>
                        <div className="mt-2">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{p.progress}%</span>
                          </div>
                          <div className="h-2 rounded bg-slate-200">
                            <div
                              className={`h-2 rounded ${
                                p.isCompleted ? "bg-green-500" : "bg-indigo-500"
                              }`}
                              style={{
                                width: `${Math.min(100, Math.max(0, p.progress))}%`,
                              }}
                            />
                          </div>
                        </div>
                        <div className="mt-2 text-xs">
                          Status:{" "}
                          {p.isCompleted
                            ? "Completed"
                            : p.isUnlocked
                              ? "In Progress"
                              : "Locked"}
                          {" • "}Earned: {formatDate(p.earnedAt)} • Unlocked:{" "}
                          {formatDate(p.unlockedAt)}
                        </div>
                        <div className="mt-1 text-xs">
                          Rewards: 💎 {a.rewardDiamonds ?? 0} / XP{" "}
                          {a.rewardXp ?? 0}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
