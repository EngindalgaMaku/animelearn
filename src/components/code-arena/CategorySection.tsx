"use client";

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ActivityCard from "./ActivityCard";
import { LearningActivity } from "@/types/learning-activity";

interface CategorySectionProps {
  category: string;
  activities: LearningActivity[];
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  configData: {
    title: string;
    description: string;
    icon: string;
    gradient: string;
    bgGradient: string;
    iconBg: string;
  };
  difficultyConfigs: any;
  activityTypeConfigs: any;
  onLaunchActivity: (activity: LearningActivity) => void;
  categoryIndex: number;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  enableAnimations?: boolean;
}

const CategorySection = memo(
  ({
    category,
    activities,
    progress,
    configData,
    difficultyConfigs,
    activityTypeConfigs,
    onLaunchActivity,
    categoryIndex,
    isExpanded,
    onToggleExpanded,
    enableAnimations = true,
  }: CategorySectionProps) => {
    const sectionContent = (
      <section className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-8 shadow-2xl">
        {/* Category Header */}
        <div
          className="group mb-6 flex cursor-pointer items-center justify-between"
          onClick={onToggleExpanded}
        >
          <div className="flex items-center space-x-6">
            <div
              className={`h-20 w-20 rounded-3xl ${configData.iconBg} flex items-center justify-center text-3xl text-white shadow-2xl transition-transform duration-300 group-hover:scale-110`}
            >
              {configData.icon}
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 transition-colors group-hover:text-indigo-600">
                {configData.title}
              </h3>
              <p className="text-lg font-medium text-slate-600">
                {configData.description}
              </p>
              <div className="mt-3 flex items-center space-x-6">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                  {progress.completed}/{progress.total} completed
                </span>
                <div className="h-3 w-40 rounded-full bg-slate-200 shadow-inner">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${configData.gradient} shadow-lg transition-all duration-500`}
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-lg font-black text-slate-900 text-transparent">
                  {progress.percentage}%
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 p-3">
            <ChevronDown
              className={`h-6 w-6 text-indigo-600 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* Activities Grid */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4"
            >
              {activities.map((activity, index) => {
                const difficultyConfig =
                  difficultyConfigs[activity.difficulty] ||
                  difficultyConfigs[1];
                const activityTypeConfig =
                  activityTypeConfigs[activity.activityType] ||
                  activityTypeConfigs.quiz;

                return (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    difficultyConfig={difficultyConfig}
                    activityTypeConfig={activityTypeConfig}
                    onLaunch={onLaunchActivity}
                    index={index}
                    enableAnimations={enableAnimations}
                    layout="horizontal"
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    );

    if (!enableAnimations) {
      return sectionContent;
    }

    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: categoryIndex * 0.1 }}
      >
        {sectionContent}
      </motion.div>
    );
  }
);

CategorySection.displayName = "CategorySection";

export default CategorySection;
