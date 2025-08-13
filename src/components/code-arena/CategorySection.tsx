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
      <section className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-4 shadow-2xl sm:rounded-3xl sm:p-6 lg:p-8">
        {/* Category Header */}
        <div
          className="group mb-4 flex cursor-pointer items-center justify-between sm:mb-6"
          onClick={onToggleExpanded}
        >
          <div className="flex min-w-0 flex-1 items-center space-x-3 sm:space-x-4 lg:space-x-6">
            <div
              className={`h-14 w-14 rounded-2xl sm:h-16 sm:w-16 sm:rounded-3xl lg:h-20 lg:w-20 ${configData.iconBg} flex flex-shrink-0 items-center justify-center text-2xl text-white shadow-2xl transition-transform duration-300 group-hover:scale-110 sm:text-3xl`}
            >
              {configData.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-black leading-tight text-slate-900 transition-colors group-hover:text-indigo-600 sm:text-2xl lg:text-3xl">
                {configData.title}
              </h3>
              <p className="line-clamp-2 text-sm font-medium text-slate-600 sm:text-base lg:text-lg">
                {configData.description}
              </p>
              <div className="mt-2 flex flex-col space-y-2 sm:mt-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0 lg:space-x-6">
                <span className="inline-block w-fit rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700 sm:px-3 sm:text-sm">
                  {progress.completed}/{progress.total} completed
                </span>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="h-2.5 w-24 rounded-full bg-slate-200 shadow-inner sm:h-3 sm:w-32 lg:w-40">
                    <div
                      className={`h-2.5 rounded-full bg-gradient-to-r sm:h-3 ${configData.gradient} shadow-lg transition-all duration-500`}
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-sm font-black text-slate-900 text-transparent sm:text-base lg:text-lg">
                    {progress.percentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="ml-2 flex-shrink-0 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 p-2 sm:p-3">
            <ChevronDown
              className={`h-5 w-5 text-indigo-600 transition-transform sm:h-6 sm:w-6 ${
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
              className="space-y-3 sm:space-y-4"
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
