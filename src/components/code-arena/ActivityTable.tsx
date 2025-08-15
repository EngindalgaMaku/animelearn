"use client";

import { memo, useState } from "react";
import { motion } from "framer-motion";
import {
  Diamond,
  Star,
  Clock,
  CheckCircle,
  Trophy,
  Play,
  Rocket,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { LearningActivity } from "@/types/learning-activity";

interface ActivityTableProps {
  activities: LearningActivity[];
  difficultyConfigs: {
    [key: number]: {
      label: string;
      color: string;
      icon: string;
      bgColor: string;
      textColor: string;
      borderColor: string;
    };
  };
  activityTypeConfigs: {
    [key: string]: {
      name: string;
      icon: string;
      color: string;
    };
  };
  onLaunch: (activity: LearningActivity) => void;
  enableAnimations?: boolean;
  // Server-side pagination props
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  // Filter props
  selectedActivityType?: string;
  onActivityTypeChange?: (type: string) => void;
  // Search highlight
  searchTerm?: string;
}

const ActivityTable = memo(
  ({
    activities,
    difficultyConfigs,
    activityTypeConfigs,
    onLaunch,
    enableAnimations = true,
    // Server-side pagination props
    totalCount = 0,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    // Filter props
    selectedActivityType = "",
    onActivityTypeChange,
    // Search highlight
    searchTerm = "",
  }: ActivityTableProps) => {
    const goToPage = (page: number) => {
      if (onPageChange) {
        const newPage = Math.max(1, Math.min(page, totalPages));
        onPageChange(newPage);
      }
    };

    // For server-side pagination, we show all activities as they're already filtered/paginated
    const currentActivities = activities;
    const startIndex = (currentPage - 1) * 10 + 1; // Assuming 10 items per page
    const endIndex = Math.min(startIndex + activities.length - 1, totalCount);

    const getDifficultyConfig = (difficulty: number) => {
      return difficultyConfigs[difficulty] || difficultyConfigs[1];
    };

    const getActivityTypeConfig = (activityType: string) => {
      return activityTypeConfigs[activityType] || activityTypeConfigs.quiz;
    };

    // Highlight helper for search term
    const escapeRegExp = (s: string) =>
      s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const highlight = (text: string) => {
      if (!searchTerm?.trim()) return text;
      try {
        const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, "gi");
        const parts = text.split(regex);
        return parts.map((part, i) =>
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <mark
              key={i}
              className="rounded bg-yellow-200 px-0.5 text-slate-900"
            >
              {part}
            </mark>
          ) : (
            part
          )
        );
      } catch {
        return text;
      }
    };

    const tableContent = (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                🎯 Interactive Challenges
              </h2>
              <p className="text-indigo-100">
                Master programming concepts through gamified learning
              </p>
            </div>

            {/* Type Selector (always visible if configs provided) */}
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-white">
                Filter by Type:
              </label>
              <select
                value={selectedActivityType}
                onChange={(e) => onActivityTypeChange?.(e.target.value)}
                disabled={!onActivityTypeChange}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-xl transition-all hover:bg-white/20 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="" className="bg-slate-800 text-white">
                  All Types
                </option>
                {Object.entries(activityTypeConfigs).map(([key, config]) => (
                  <option
                    key={key}
                    value={key}
                    className="bg-slate-800 text-white"
                  >
                    {config.icon} {config.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Desktop & Tablet Table */}
        <div className="hidden md:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                <tr>
                  <th className="w-1/4 px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                    Challenge
                  </th>
                  <th className="w-1/8 px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                    Type
                  </th>
                  <th className="w-1/8 px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                    Difficulty
                  </th>
                  <th className="w-1/6 px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                    Rewards
                  </th>
                  <th className="w-1/12 px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-700">
                    Time
                  </th>
                  <th className="w-1/8 px-4 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {currentActivities.map((activity, index) => {
                  const difficultyConfig = getDifficultyConfig(
                    activity.difficulty
                  );
                  const activityTypeConfig = getActivityTypeConfig(
                    activity.activityType
                  );

                  return (
                    <motion.tr
                      key={activity.id}
                      initial={enableAnimations ? { opacity: 0, y: 20 } : false}
                      animate={enableAnimations ? { opacity: 1, y: 0 } : false}
                      transition={{ delay: index * 0.05 }}
                      className="transition-colors hover:bg-slate-50"
                    >
                      {/* Challenge Column */}
                      <td className="px-6 py-4">
                        <div className="group relative">
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="truncate text-sm font-bold text-slate-900">
                                {highlight(activity.title)}
                              </p>
                              {activity.userProgress?.completed && (
                                <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                              )}
                            </div>
                            <div className="relative">
                              <p className="cursor-help truncate text-xs text-slate-500">
                                {highlight(
                                  activity.description.length > 25
                                    ? `${activity.description.slice(0, 25)}...`
                                    : activity.description
                                )}
                              </p>
                              {/* Tooltip */}
                              {activity.description.length > 25 && (
                                <div className="absolute bottom-full left-0 z-50 mb-2 hidden w-80 max-w-sm group-hover:block">
                                  <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white shadow-xl">
                                    <div className="mb-1 font-semibold">
                                      {highlight(activity.title)}
                                    </div>
                                    <div className="leading-relaxed">
                                      {highlight(activity.description)}
                                    </div>
                                    {/* Tooltip Arrow */}
                                    <div className="absolute left-4 top-full h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Type Column */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center space-x-1 rounded-lg px-3 py-1 text-xs font-bold ${activityTypeConfig.color} bg-slate-100`}
                        >
                          <span>{activityTypeConfig.icon}</span>
                          <span>{activityTypeConfig.name}</span>
                        </span>
                      </td>

                      {/* Difficulty Column */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold ${difficultyConfig.textColor} ${difficultyConfig.bgColor} border-2 ${difficultyConfig.borderColor}`}
                        >
                          {difficultyConfig.label}
                        </span>
                      </td>

                      {/* Rewards Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1 rounded-lg bg-gradient-to-r from-yellow-100 to-orange-100 px-2 py-1">
                            <Diamond className="h-3 w-3 text-yellow-600" />
                            <span className="text-xs font-bold text-yellow-700">
                              +{activity.diamondReward}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 px-2 py-1">
                            <Star className="h-3 w-3 text-purple-600" />
                            <span className="text-xs font-bold text-purple-700">
                              +{activity.experienceReward}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Time Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700">
                            {activity.estimatedMinutes}m
                          </span>
                        </div>
                      </td>

                      {/* Action Column */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => onLaunch(activity)}
                          className={`inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-bold transition-all hover:scale-105 ${
                            activity.userProgress?.completed
                              ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg hover:shadow-xl"
                              : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-xl"
                          }`}
                        >
                          {activity.userProgress?.completed ? (
                            <Trophy className="h-4 w-4" />
                          ) : activity.userProgress ? (
                            <Play className="h-4 w-4" />
                          ) : (
                            <Rocket className="h-4 w-4" />
                          )}
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          <div className="space-y-4 p-4">
            {currentActivities.map((activity, index) => {
              const difficultyConfig = getDifficultyConfig(activity.difficulty);
              const activityTypeConfig = getActivityTypeConfig(
                activity.activityType
              );

              return (
                <motion.div
                  key={activity.id}
                  initial={enableAnimations ? { opacity: 0, y: 20 } : false}
                  animate={enableAnimations ? { opacity: 1, y: 0 } : false}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-md"
                >
                  {/* Mobile Header */}
                  <div className="mb-3 flex items-start justify-between">
                    <div className="group relative min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="truncate text-sm font-bold text-slate-900">
                          {highlight(activity.title)}
                        </h3>
                        {activity.userProgress?.completed && (
                          <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                        )}
                      </div>
                      <div className="relative">
                        <p className="cursor-help truncate text-xs text-slate-500">
                          {highlight(
                            activity.description.length > 35
                              ? `${activity.description.slice(0, 35)}...`
                              : activity.description
                          )}
                        </p>
                        {/* Mobile Tooltip */}
                        {activity.description.length > 35 && (
                          <div className="absolute bottom-full left-0 z-50 mb-2 hidden w-72 max-w-sm group-hover:block">
                            <div className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white shadow-xl">
                              <div className="mb-1 font-semibold">
                                {highlight(activity.title)}
                              </div>
                              <div className="leading-relaxed">
                                {highlight(activity.description)}
                              </div>
                              {/* Tooltip Arrow */}
                              <div className="absolute left-4 top-full h-0 w-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Mobile Info Row */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`rounded-lg px-2 py-1 text-xs font-bold ${activityTypeConfig.color} bg-slate-100`}
                      >
                        {activityTypeConfig.icon}
                      </span>
                      <span
                        className={`rounded-lg px-2 py-1 text-xs font-bold ${difficultyConfig.textColor} ${difficultyConfig.bgColor}`}
                      >
                        {difficultyConfig.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-slate-500" />
                      <span className="text-xs text-slate-600">
                        {activity.estimatedMinutes}m
                      </span>
                    </div>
                  </div>

                  {/* Mobile Rewards */}
                  <div className="mb-3 flex items-center justify-center space-x-2">
                    <div className="flex items-center space-x-1 rounded-lg bg-gradient-to-r from-yellow-100 to-orange-100 px-2 py-1">
                      <Diamond className="h-3 w-3 text-yellow-600" />
                      <span className="text-xs font-bold text-yellow-700">
                        +{activity.diamondReward}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 px-2 py-1">
                      <Star className="h-3 w-3 text-purple-600" />
                      <span className="text-xs font-bold text-purple-700">
                        +{activity.experienceReward}
                      </span>
                    </div>
                  </div>

                  {/* Mobile Action Button */}
                  <button
                    onClick={() => onLaunch(activity)}
                    className={`w-full rounded-xl py-3 text-sm font-bold transition-all ${
                      activity.userProgress?.completed
                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                        : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                    }`}
                  >
                    <span className="flex items-center justify-center">
                      {activity.userProgress?.completed ? (
                        <Trophy className="h-5 w-5" />
                      ) : activity.userProgress ? (
                        <Play className="h-5 w-5" />
                      ) : (
                        <Rocket className="h-5 w-5" />
                      )}
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-700">
              Showing <span className="font-bold">{startIndex}</span> to{" "}
              <span className="font-bold">{endIndex}</span> of{" "}
              <span className="font-bold">{totalCount}</span> challenges
            </div>

            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-1 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          page === currentPage
                            ? "bg-indigo-600 text-white"
                            : "bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-1 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );

    return tableContent;
  }
);

ActivityTable.displayName = "ActivityTable";

export default ActivityTable;
