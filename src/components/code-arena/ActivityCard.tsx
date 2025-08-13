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
      <div className="group rounded-3xl border-2 border-transparent bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-6 transition-all duration-300 hover:scale-105 hover:border-indigo-300 hover:shadow-2xl">
        {/* Activity Header */}
        <div className="mb-4 flex items-start justify-between">
          <div
            className={`h-16 w-16 rounded-2xl ${difficultyConfig.bgColor} flex items-center justify-center text-2xl shadow-xl transition-transform group-hover:scale-110`}
          >
            {difficultyConfig.icon}
          </div>
          {activity.userProgress?.completed && (
            <div className="rounded-full bg-gradient-to-r from-green-400 to-emerald-500 p-2 text-white shadow-lg">
              <CheckCircle className="h-5 w-5" />
            </div>
          )}
        </div>

        {/* Activity Title */}
        <h4 className="mb-3 text-xl font-black text-slate-900 transition-colors group-hover:text-indigo-600">
          {activity.title}
        </h4>

        {/* Activity Description */}
        <p className="mb-5 line-clamp-2 text-base font-medium text-slate-600">
          {activity.description}
        </p>

        {/* Activity Type and Difficulty */}
        <div className="mb-5 flex items-center justify-between">
          <span
            className={`rounded-2xl px-4 py-2 text-sm font-bold ${activityTypeConfig.color} bg-gradient-to-r from-slate-100 to-slate-200 shadow-md`}
          >
            {activityTypeConfig.icon} {activityTypeConfig.name}
          </span>
          <span
            className={`rounded-2xl px-4 py-2 text-sm font-bold ${difficultyConfig.textColor} ${difficultyConfig.bgColor} ${difficultyConfig.borderColor} border-2 shadow-md`}
          >
            {difficultyConfig.label}
          </span>
        </div>

        {/* Rewards Grid */}
        <div className="mb-5 grid grid-cols-3 gap-3 text-sm">
          <div className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-yellow-100 to-orange-100 p-2">
            <Diamond className="h-5 w-5 text-yellow-600" />
            <span className="font-black text-yellow-700">
              +{activity.diamondReward}
            </span>
          </div>
          <div className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 p-2">
            <Star className="h-5 w-5 text-purple-600" />
            <span className="font-black text-purple-700">
              +{activity.experienceReward} XP
            </span>
          </div>
          <div className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 p-2">
            <Clock className="h-5 w-5 text-slate-600" />
            <span className="font-black text-slate-700">
              {activity.estimatedMinutes}m
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        {activity.userProgress && (
          <div className="mb-5">
            <div className="h-3 rounded-full bg-slate-200 shadow-inner">
              <div
                className={`h-3 rounded-full shadow-lg transition-all duration-500 ${
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
          className={`flex w-full transform items-center justify-center space-x-3 rounded-2xl py-4 text-lg font-black transition-all hover:scale-105 ${
            activity.userProgress?.completed
              ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-xl hover:shadow-2xl"
              : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl hover:shadow-2xl"
          }`}
        >
          {activity.userProgress?.completed ? (
            <>
              <Trophy className="h-5 w-5" />
              <span>🏆 REVIEW</span>
            </>
          ) : activity.userProgress ? (
            <>
              <Play className="h-5 w-5" />
              <span>⚡ CONTINUE</span>
            </>
          ) : (
            <>
              <Rocket className="h-5 w-5" />
              <span>🚀 START CHALLENGE</span>
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
