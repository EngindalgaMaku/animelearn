"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import {
  Diamond,
  Star,
  Clock,
  CheckCircle,
  Trophy,
  Play,
  Rocket,
} from "lucide-react";
import { LearningActivity } from "@/types/learning-activity";

interface ActivityCardProps {
  activity: LearningActivity;
  difficultyConfig: {
    label: string;
    color: string;
    icon: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  };
  activityTypeConfig: {
    name: string;
    icon: string;
    color: string;
  };
  onLaunch: (activity: LearningActivity) => void;
  index: number;
  enableAnimations?: boolean;
  layout?: "vertical" | "horizontal";
}

const ActivityCard = memo(
  ({
    activity,
    difficultyConfig,
    activityTypeConfig,
    onLaunch,
    index,
    enableAnimations = true,
  }: ActivityCardProps) => {
    const cardContent = (
      <div className="group rounded-2xl border-2 border-transparent bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-3 transition-all duration-300 hover:scale-105 hover:border-indigo-300 hover:shadow-2xl sm:rounded-3xl sm:p-6">
        {/* Activity Header */}
        <div className="mb-2.5 flex items-start justify-between sm:mb-4">
          <div
            className={`h-10 w-10 rounded-xl sm:h-16 sm:w-16 sm:rounded-2xl ${difficultyConfig.bgColor} flex items-center justify-center text-lg shadow-xl transition-transform group-hover:scale-110 sm:text-2xl`}
          >
            {difficultyConfig.icon}
          </div>
          {activity.userProgress?.completed && (
            <div className="rounded-full bg-gradient-to-r from-green-400 to-emerald-500 p-1.5 text-white shadow-lg sm:p-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          )}
        </div>

        {/* Activity Title */}
        <h4 className="mb-2 text-base font-black leading-tight text-slate-900 transition-colors group-hover:text-indigo-600 sm:mb-3 sm:text-xl">
          {activity.title}
        </h4>

        {/* Activity Description */}
        <p className="mb-3 line-clamp-1 text-xs font-medium text-slate-600 sm:mb-5 sm:text-base">
          {activity.description}
        </p>

        {/* Activity Type and Difficulty - Mobile Stack */}
        <div className="mb-4 flex flex-col items-start justify-between space-y-2 sm:mb-5 sm:flex-row sm:items-center sm:space-y-0">
          <span
            className={`rounded-xl px-2.5 py-1 text-[11px] font-bold sm:rounded-2xl sm:px-4 sm:py-2 sm:text-sm ${activityTypeConfig.color} bg-gradient-to-r from-slate-100 to-slate-200 shadow-md`}
          >
            {activityTypeConfig.icon} {activityTypeConfig.name}
          </span>
          <span
            className={`rounded-xl px-2.5 py-1 text-[11px] font-bold sm:rounded-2xl sm:px-4 sm:py-2 sm:text-sm ${difficultyConfig.textColor} ${difficultyConfig.bgColor} ${difficultyConfig.borderColor} border-2 shadow-md`}
          >
            {difficultyConfig.label}
          </span>
        </div>

        {/* Rewards Grid - Responsive */}
        <div className="mb-3 grid grid-cols-3 gap-1.5 text-[11px] sm:mb-5 sm:gap-3 sm:text-sm">
          <div className="flex items-center justify-center space-x-1 rounded-lg bg-gradient-to-r from-yellow-100 to-orange-100 p-1.5 sm:space-x-2 sm:rounded-xl">
            <Diamond className="h-4 w-4 flex-shrink-0 text-yellow-600 sm:h-5 sm:w-5" />
            <span className="truncate font-black text-yellow-700">
              +{activity.diamondReward}
            </span>
          </div>
          <div className="flex items-center justify-center space-x-1 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 p-1.5 sm:space-x-2 sm:rounded-xl">
            <Star className="h-4 w-4 flex-shrink-0 text-purple-600 sm:h-5 sm:w-5" />
            <span className="truncate font-black text-purple-700">
              +{activity.experienceReward}
            </span>
          </div>
          <div className="flex items-center justify-center space-x-1 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 p-1.5 sm:space-x-2 sm:rounded-xl">
            <Clock className="h-4 w-4 flex-shrink-0 text-slate-600 sm:h-5 sm:w-5" />
            <span className="truncate font-black text-slate-700">
              {activity.estimatedMinutes}m
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        {activity.userProgress && (
          <div className="mb-4 sm:mb-5">
            <div className="h-2 rounded-full bg-slate-200 shadow-inner sm:h-3">
              <div
                className={`h-2 rounded-full shadow-lg transition-all duration-500 sm:h-3 ${
                  activity.userProgress.completed
                    ? "bg-gradient-to-r from-green-400 to-emerald-500"
                    : "bg-gradient-to-r from-blue-400 to-indigo-500"
                }`}
                style={{
                  width: `${activity.userProgress.percentage}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => onLaunch(activity)}
          className={`flex w-full transform items-center justify-center space-x-2 rounded-xl py-2.5 text-sm font-black transition-all hover:scale-105 sm:space-x-3 sm:rounded-2xl sm:py-4 sm:text-lg ${
            activity.userProgress?.completed
              ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-xl hover:shadow-2xl"
              : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl hover:shadow-2xl"
          }`}
        >
          {activity.userProgress?.completed ? (
            <>
              <Trophy className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
              <span>🏆 REVIEW</span>
            </>
          ) : activity.userProgress ? (
            <>
              <Play className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
              <span>⚡ CONTINUE</span>
            </>
          ) : (
            <>
              <Rocket className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">🚀 START CHALLENGE</span>
              <span className="sm:hidden">🚀 START</span>
            </>
          )}
        </button>
      </div>
    );

    if (!enableAnimations) {
      return cardContent;
    }

    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: index * 0.05 }}
      >
        {cardContent}
      </motion.div>
    );
  }
);

ActivityCard.displayName = "ActivityCard";

export default ActivityCard;
