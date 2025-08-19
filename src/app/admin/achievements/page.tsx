"use client";

import React, { useEffect, useMemo, useState } from "react";

/* ============================
   Types
============================ */

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

type Badge = {
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
  rewardDiamonds: number;
  rewardXp: number;
  rewardCardPack?: string | null;
  isActive: boolean;
  isHidden: boolean;
  sortOrder: number;
  totalEarned?: number;
};

type BadgeForm = Omit<Badge, "id" | "totalEarned">;

/* ============================
   Helpers
============================ */

function formatDate(s?: string | null) {
  if (!s) return "-";
  try {
    const d = new Date(s);
    return d.toLocaleString();
  } catch {
    return s || "-";
  }
}

const initialBadgeForm: BadgeForm = {
  name: "",
  title: "",
  description: "",
  icon: "🏆",
  category: "general",
  rarity: "common",
  color: "#3B82F6",
  conditionType: "count",
  targetValue: 1,
  rewardDiamonds: 25,
  rewardXp: 50,
  rewardCardPack: "",
  isActive: true,
  isHidden: false,
  sortOrder: 0,
};

/* ============================
   Page
============================ */

export default function AdminAchievementsPage() {
  const [activeTab, setActiveTab] = useState<"manage" | "progress">("manage");

  // User Progress (read-only inspector)
  const [targetUserId, setTargetUserId] = useState<string>("");
  const [pendingUserId, setPendingUserId] = useState<string>("");
  const [data, setData] = useState<AchievementsResponse | null>(null);
  const [achLoading, setAchLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "in_progress" | "locked"
  >("all");
  const [catFilter, setCatFilter] = useState("all");
  const [achError, setAchError] = useState<string | null>(null);
  const [recomputing, setRecomputing] = useState(false);

  // Manage Badges (CRUD)
  const [badges, setBadges] = useState<Badge[]>([]);
  const [badgesLoading, setBadgesLoading] = useState(false);
  const [badgesError, setBadgesError] = useState<string | null>(null);

  const [form, setForm] = useState<BadgeForm>(initialBadgeForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Pagination state for Manage Badges table
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  /* ========== PROGRESS TAB LOGIC ========== */

  async function loadAchievements(forUserId: string) {
    if (!forUserId) return;
    setAchLoading(true);
    setAchError(null);
    try {
      const params = new URLSearchParams();
      params.set("status", statusFilter);
      params.set("category", catFilter);
      params.set("userId", forUserId.trim());
      const res = await fetch(`/api/achievements?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `Request failed (${res.status})`);
      }
      const j = (await res.json()) as AchievementsResponse;
      setData(j);
    } catch (e: any) {
      setAchError(e?.message || "Unknown error");
    } finally {
      setAchLoading(false);
    }
  }

  useEffect(() => {
    if (targetUserId) void loadAchievements(targetUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, catFilter, targetUserId]);

  const categories = useMemo(() => {
    if (!data?.stats?.categories) return ["all"];
    return ["all", ...Object.keys(data.stats.categories)];
  }, [data]);

  async function recomputeProgress() {
    if (!targetUserId) return;
    setRecomputing(true);
    setAchError(null);
    try {
      await loadAchievements(targetUserId);
      alert("Recomputed achievements progress for selected user");
    } catch (e: any) {
      setAchError(e?.message || "Recompute failed");
    } finally {
      setRecomputing(false);
    }
  }

  /* ========== MANAGE TAB LOGIC ========== */

  async function fetchBadges() {
    setBadgesLoading(true);
    setBadgesError(null);
    try {
      const url = `/api/admin/badges?page=${page}&limit=${pageSize}`;
      const res = await fetch(url, { cache: "no-store" });
      const j = await res.json();
      if (!res.ok || !j?.success) {
        throw new Error(j?.error || `Failed (${res.status})`);
      }
      setBadges(j.badges || []);
      setTotal(typeof j.total === "number" ? j.total : j.badges?.length || 0);
      setTotalPages(typeof j.totalPages === "number" ? j.totalPages : 1);
    } catch (e: any) {
      setBadgesError(e?.message || "Failed to load badges");
    } finally {
      setBadgesLoading(false);
    }
  }

  useEffect(() => {
    if (activeTab === "manage") fetchBadges();
  }, [activeTab, page, pageSize]);

  function resetForm() {
    setForm(initialBadgeForm);
    setEditingId(null);
  }

  async function saveBadge(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setBadgesError(null);
    try {
      const payload = {
        ...form,
        rewardCardPack: form.rewardCardPack || null,
      };
      const res = await fetch(
        editingId ? `/api/admin/badges/${editingId}` : "/api/admin/badges",
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const j = await res.json().catch(() => ({}));
      if (!res.ok || j?.error) throw new Error(j?.error || "Save failed");
      resetForm();
      await fetchBadges();
      alert(editingId ? "Badge updated" : "Badge created");
    } catch (err: any) {
      setBadgesError(err?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function onEdit(b: Badge) {
    setEditingId(b.id);
    setForm({
      name: b.name,
      title: b.title,
      description: b.description,
      icon: b.icon,
      category: b.category,
      rarity: b.rarity,
      color: b.color,
      conditionType: b.conditionType,
      targetValue: b.targetValue,
      rewardDiamonds: b.rewardDiamonds,
      rewardXp: b.rewardXp,
      rewardCardPack: b.rewardCardPack || "",
      isActive: b.isActive,
      isHidden: b.isHidden,
      sortOrder: b.sortOrder,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onDelete(b: Badge) {
    if (!confirm(`Delete badge "${b.title}"? This cannot be undone.`)) return;
    setBadgesError(null);
    try {
      const res = await fetch(`/api/admin/badges/${b.id}`, {
        method: "DELETE",
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || j?.error) throw new Error(j?.error || "Delete failed");
      await fetchBadges();
    } catch (err: any) {
      setBadgesError(
        err?.message || "Delete failed (If rules exist, remove them first)"
      );
    }
  }

  /* ========== UI ========== */

  return (
    <div className="p-6 text-gray-900">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Achievements Manager
        </h1>

        {/* Tabs */}
        <div className="inline-flex rounded-lg border border-gray-200 bg-white">
          <button
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === "manage"
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-gray-50"
            } rounded-l-lg`}
            onClick={() => setActiveTab("manage")}
          >
            Manage Badges
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === "progress"
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-gray-50"
            } rounded-r-lg`}
            onClick={() => setActiveTab("progress")}
          >
            User Progress
          </button>
        </div>
      </div>

      {/* MANAGE TAB */}
      {activeTab === "manage" && (
        <div className="space-y-6">
          {/* Badge Form */}
          <form
            onSubmit={saveBadge}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? "Edit Badge" : "Create New Badge"}
              </h2>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {badgesError && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {badgesError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                  required
                  placeholder="unique_name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Title *
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                  required
                  placeholder="Visible title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Icon *
                </label>
                <input
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                  required
                  placeholder="🏆"
                />
              </div>

              <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                  required
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Category *
                </label>
                <input
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                  required
                  placeholder="general, learning, quiz, ..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Rarity *
                </label>
                <select
                  value={form.rarity}
                  onChange={(e) => setForm({ ...form, rarity: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="common">common</option>
                  <option value="rare">rare</option>
                  <option value="epic">epic</option>
                  <option value="legendary">legendary</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Color *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) =>
                      setForm({ ...form, color: e.target.value })
                    }
                    className="h-10 w-12 rounded-md border border-gray-300"
                  />
                  <input
                    value={form.color}
                    onChange={(e) =>
                      setForm({ ...form, color: e.target.value })
                    }
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Condition Type *
                </label>
                <select
                  value={form.conditionType}
                  onChange={(e) =>
                    setForm({ ...form, conditionType: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="count">count</option>
                  <option value="streak">streak</option>
                  <option value="milestone">milestone</option>
                  <option value="time_based">time_based</option>
                  <option value="combo">combo</option>
                  <option value="skill_mastery">skill_mastery</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Target Value *
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.targetValue}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      targetValue: parseInt(e.target.value || "0", 10),
                    })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sortOrder: parseInt(e.target.value || "0", 10),
                    })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Reward Diamonds
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.rewardDiamonds}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      rewardDiamonds: parseInt(e.target.value || "0", 10),
                    })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Reward XP
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.rewardXp}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      rewardXp: parseInt(e.target.value || "0", 10),
                    })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Reward Card Pack (optional)
                </label>
                <input
                  value={form.rewardCardPack || ""}
                  onChange={(e) =>
                    setForm({ ...form, rewardCardPack: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., starter_pack"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-800">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm({ ...form, isActive: e.target.checked })
                    }
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-800">
                  <input
                    type="checkbox"
                    checked={form.isHidden}
                    onChange={(e) =>
                      setForm({ ...form, isHidden: e.target.checked })
                    }
                  />
                  Hidden
                </label>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`rounded-md px-5 py-2 text-sm font-medium text-white ${
                  saving ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Badge"
                    : "Create Badge"}
              </button>
            </div>
          </form>

          {/* Badges List */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Existing Badges
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>
                  Page {page} / {totalPages}
                </span>
                <span>•</span>
                <span>Total: {total}</span>
              </div>
            </div>

            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span>Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const v = parseInt(e.target.value || "10", 10);
                    setPage(1);
                    setPageSize(Number.isFinite(v) ? v : 10);
                  }}
                  className="rounded border border-gray-300 px-2 py-1 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className={`rounded border px-3 py-1 text-sm ${
                    page <= 1
                      ? "cursor-not-allowed border-gray-200 text-gray-400"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className={`rounded border px-3 py-1 text-sm ${
                    page >= totalPages
                      ? "cursor-not-allowed border-gray-200 text-gray-400"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>

            {badgesLoading ? (
              <div className="py-8 text-center text-gray-600">
                Loading badges...
              </div>
            ) : badges?.length === 0 ? (
              <div className="py-8 text-center text-gray-600">
                No badges found. Create the first one above.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 text-gray-700">
                      <th className="px-3 py-2">Icon</th>
                      <th className="px-3 py-2">Title</th>
                      <th className="px-3 py-2">Category</th>
                      <th className="px-3 py-2">Rarity</th>
                      <th className="px-3 py-2">Target</th>
                      <th className="px-3 py-2">Rewards</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {badges.map((b) => (
                      <tr
                        key={b.id}
                        className="border-b last:border-b-0 hover:bg-gray-50"
                      >
                        <td className="px-3 py-2 text-base">{b.icon}</td>
                        <td className="px-3 py-2">
                          <div className="font-medium text-gray-900">
                            {b.title}
                          </div>
                          <div className="text-xs text-gray-500">{b.name}</div>
                        </td>
                        <td className="px-3 py-2 text-gray-800">
                          {b.category}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className="rounded-full border px-2 py-0.5 text-xs"
                            style={{ borderColor: b.color, color: b.color }}
                          >
                            {b.rarity}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-gray-800">
                          {b.conditionType} • {b.targetValue}
                        </td>
                        <td className="px-3 py-2 text-gray-800">
                          💎 {b.rewardDiamonds} / XP {b.rewardXp}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded px-2 py-0.5 text-xs ${b.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                            >
                              {b.isActive ? "Active" : "Inactive"}
                            </span>
                            {b.isHidden && (
                              <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs text-yellow-700">
                                Hidden
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onEdit(b)}
                              className="rounded-md border border-gray-300 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => onDelete(b)}
                              className="rounded-md border border-gray-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PROGRESS TAB */}
      {activeTab === "progress" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <input
                value={pendingUserId}
                onChange={(e) => setPendingUserId(e.target.value)}
                placeholder="Enter target userId"
                className="w-72 rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
              />
              <button
                className={`rounded-md px-3 py-2 text-sm ${
                  pendingUserId.trim()
                    ? "border border-gray-300 text-gray-800 hover:bg-gray-50"
                    : "cursor-not-allowed border border-gray-200 text-gray-400"
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
                className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <select
                className="rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
                <option value="locked">Locked</option>
              </select>

              <button
                onClick={recomputing ? undefined : recomputeProgress}
                disabled={recomputing || !targetUserId}
                className={`rounded-md px-4 py-2 text-sm text-white ${
                  recomputing || !targetUserId
                    ? "bg-indigo-400"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
              >
                {recomputing ? "Recomputing..." : "Recompute Progress"}
              </button>
            </div>

            {!targetUserId && (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                Enter a target userId and click “Load User” to inspect
                achievements. This panel does not show the current admin’s own
                progress by default.
              </div>
            )}

            {achError && (
              <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {achError}
              </div>
            )}
          </div>

          {data && (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded border border-gray-200 bg-white p-4">
                  <div className="font-medium text-gray-700">Total</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {data?.stats.total ?? "-"}
                  </div>
                </div>
                <div className="rounded border border-gray-200 bg-white p-4">
                  <div className="font-medium text-gray-700">Completed</div>
                  <div className="text-2xl font-bold text-green-600">
                    {data?.stats.completed ?? "-"}
                  </div>
                </div>
                <div className="rounded border border-gray-200 bg-white p-4">
                  <div className="font-medium text-gray-700">In Progress</div>
                  <div className="text-2xl font-bold text-amber-600">
                    {data?.stats.inProgress ?? "-"}
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-800">
                Target User:{" "}
                <code className="rounded bg-gray-100 px-1 py-0.5">
                  {targetUserId}
                </code>{" "}
                • Level: {data?.userLevel ?? "-"} • XP: {data?.userXp ?? "-"} •
                Updated:{" "}
                {data?.generatedAt ? formatDate(data.generatedAt) : "-"}
              </div>

              <div className="mt-4">
                {achLoading ? (
                  <div className="py-6 text-center text-gray-600">
                    Loading achievements...
                  </div>
                ) : !data?.achievements?.length ? (
                  <div className="py-6 text-center text-gray-600">
                    No achievements found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {data.achievements.map((a) => {
                      const p = a.userProgress;
                      return (
                        <div
                          key={a.id}
                          className="flex items-start gap-4 rounded border border-gray-200 bg-white p-4"
                        >
                          <div className="text-3xl">{a.icon || "🏆"}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="font-semibold text-gray-900">
                                {a.title}
                              </div>
                              <span
                                className="rounded-full border px-2 py-0.5 text-xs"
                                style={{ borderColor: a.color, color: a.color }}
                              >
                                {a.rarity}
                              </span>
                              {a.isHidden && (
                                <span className="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-700">
                                  hidden
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-700">
                              {a.description}
                            </div>

                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-gray-700">
                                <span>Progress</span>
                                <span>{p.progress}%</span>
                              </div>
                              <div className="h-2 rounded bg-gray-200">
                                <div
                                  className={`h-2 rounded ${
                                    p.isCompleted
                                      ? "bg-green-500"
                                      : "bg-indigo-600"
                                  }`}
                                  style={{
                                    width: `${Math.min(100, Math.max(0, p.progress))}%`,
                                  }}
                                />
                              </div>
                            </div>

                            <div className="mt-2 text-xs text-gray-800">
                              Status:{" "}
                              {p.isCompleted
                                ? "Completed"
                                : p.isUnlocked
                                  ? "In Progress"
                                  : "Locked"}
                              {" • "}Earned: {formatDate(p.earnedAt)} •
                              Unlocked: {formatDate(p.unlockedAt)}
                            </div>
                            <div className="mt-1 text-xs text-gray-800">
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
      )}
    </div>
  );
}
