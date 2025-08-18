import { Trophy, Crown, Diamond, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";

// Server Component
export default async function LeaderboardPage() {
  // Fetch top users by totalDiamonds
  const topByDiamonds = await db.user.findMany({
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      avatar: true,
      totalDiamonds: true,
      currentDiamonds: true,
      level: true,
      experience: true,
      loginStreak: true,
    },
    orderBy: [
      { totalDiamonds: "desc" },
      { level: "desc" },
      { experience: "desc" },
    ],
    take: 50,
  });

  // Fetch top users by level (experience as tiebreaker)
  const topByLevel = await db.user.findMany({
    select: {
      id: true,
      username: true,
      firstName: true,
      lastName: true,
      avatar: true,
      level: true,
      experience: true,
      totalDiamonds: true,
      currentDiamonds: true,
      loginStreak: true,
    },
    orderBy: [
      { level: "desc" },
      { experience: "desc" },
      { totalDiamonds: "desc" },
    ],
    take: 50,
  });

  type Row = (typeof topByDiamonds)[number];

  const renderRow = (user: Row, index: number, mode: "diamonds" | "level") => {
    const rank = index + 1;
    const isTop3 = rank <= 3;
    const displayName =
      user.firstName || user.lastName
        ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
        : user.username;

    return (
      <div
        key={`${mode}-${user.id}`}
        className={`flex items-center justify-between rounded-xl border p-3 md:p-4 ${
          isTop3
            ? "border-yellow-200 bg-yellow-50/60"
            : "border-gray-200 bg-white/70"
        }`}
      >
        <div className="flex items-center gap-3 md:gap-4">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold md:h-12 md:w-12 md:text-base ${
              rank === 1
                ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
                : rank === 2
                  ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                  : rank === 3
                    ? "bg-gradient-to-br from-amber-300 to-amber-500 text-white"
                    : "bg-gray-100 text-gray-700"
            }`}
            aria-label={`Rank ${rank}`}
          >
            {rank}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-gray-900 md:text-base">
                {displayName}
              </p>
              {rank === 1 && <Crown className="h-4 w-4 text-yellow-500" />}
            </div>

            <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-gray-600 md:text-sm">
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-indigo-500 md:h-4 md:w-4" />
                Lv {user.level}
              </span>
              <span className="inline-flex items-center gap-1">
                <Diamond className="h-3.5 w-3.5 text-emerald-500 md:h-4 md:w-4" />
                {mode === "diamonds"
                  ? (user.totalDiamonds ?? 0)
                  : (user.totalDiamonds ?? 0)}{" "}
                total
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          {mode === "diamonds" ? (
            <div className="text-sm font-bold text-emerald-600 md:text-base">
              {(user.totalDiamonds ?? 0).toLocaleString()} 💎
            </div>
          ) : (
            <div className="text-sm font-bold text-indigo-600 md:text-base">
              Lv {user.level} &middot; {user.experience.toLocaleString()} XP
            </div>
          )}
          {typeof user.loginStreak === "number" && user.loginStreak > 0 && (
            <div className="text-xs text-gray-500">
              🔥 {user.loginStreak} day streak
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-[0.02]" />

      <div className="relative py-6 md:py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between md:mb-10">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 p-2.5 shadow-lg md:p-3.5">
                <Trophy className="h-6 w-6 text-white md:h-8 md:w-8" />
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-2xl font-extrabold text-transparent md:text-3xl">
                  Global Leaderboard
                </h1>
                <p className="text-sm text-gray-600 md:text-base">
                  Climb the ranks by earning diamonds and leveling up
                </p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center rounded-xl border-2 border-blue-200 bg-white/70 px-3 py-2 text-sm font-medium text-blue-700 transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-800 md:px-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-xl backdrop-blur-sm md:p-6">
              <header className="mb-4 flex items-center justify-between md:mb-6">
                <h2 className="flex items-center text-lg font-bold text-gray-900 md:text-xl">
                  <Diamond className="mr-2 h-5 w-5 text-emerald-600 md:h-6 md:w-6" />
                  Top by Diamonds
                </h2>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800">
                  {topByDiamonds.length} players
                </span>
              </header>

              <div className="space-y-2 md:space-y-3">
                {topByDiamonds.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                    No players yet
                  </div>
                ) : (
                  topByDiamonds.map((u, i) => renderRow(u, i, "diamonds"))
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-white/60 bg-white/80 p-4 shadow-xl backdrop-blur-sm md:p-6">
              <header className="mb-4 flex items-center justify-between md:mb-6">
                <h2 className="flex items-center text-lg font-bold text-gray-900 md:text-xl">
                  <Star className="mr-2 h-5 w-5 text-indigo-600 md:h-6 md:w-6" />
                  Top by Level
                </h2>
                <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800">
                  {topByLevel.length} players
                </span>
              </header>

              <div className="space-y-2 md:space-y-3">
                {topByLevel.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                    No players yet
                  </div>
                ) : (
                  topByLevel.map((u, i) => renderRow(u, i, "level"))
                )}
              </div>
            </section>
          </div>

          <footer className="mt-8 text-center text-xs text-gray-500 md:mt-10 md:text-sm">
            Rankings update when user stats change. Keep learning and
            collecting!
          </footer>
        </div>
      </div>
    </div>
  );
}
