"use client";

import React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "default" | "compact" | "dropdown";
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({
  variant = "default",
  className,
  showLabel = true,
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  if (variant === "dropdown") {
    return (
      <div className={cn("relative inline-block", className)}>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as any)}
          className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Select theme"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className={cn(
          "relative inline-flex items-center justify-center w-10 h-10 rounded-lg",
          "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700",
          "border border-gray-300 dark:border-gray-600",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
          className
        )}
        aria-label={`Switch to ${
          resolvedTheme === "dark" ? "light" : "dark"
        } mode`}
      >
        {resolvedTheme === "dark" ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        )}
      </button>
    );
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Theme:
        </span>
      )}
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-300 dark:border-gray-600">
        <button
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            theme === "light"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          )}
          aria-label="Light mode"
        >
          <Sun className="w-4 h-4" />
          <span>Light</span>
        </button>

        <button
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            theme === "dark"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          )}
          aria-label="Dark mode"
        >
          <Moon className="w-4 h-4" />
          <span>Dark</span>
        </button>

        <button
          onClick={() => setTheme("system")}
          className={cn(
            "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            theme === "system"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          )}
          aria-label="System mode"
        >
          <Monitor className="w-4 h-4" />
          <span>System</span>
        </button>
      </div>
    </div>
  );
}

export function AnimatedThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "relative inline-flex items-center justify-center w-12 h-12",
        "bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-blue-600 dark:to-purple-600",
        "rounded-full shadow-lg hover:shadow-xl",
        "transform hover:scale-105 active:scale-95",
        "transition-all duration-300 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
        className
      )}
      aria-label={`Switch to ${
        resolvedTheme === "dark" ? "light" : "dark"
      } mode`}
    >
      <div className="relative overflow-hidden w-6 h-6">
        <Sun
          className={cn(
            "absolute inset-0 w-6 h-6 text-white transition-transform duration-500",
            resolvedTheme === "dark"
              ? "rotate-90 scale-0"
              : "rotate-0 scale-100"
          )}
        />
        <Moon
          className={cn(
            "absolute inset-0 w-6 h-6 text-white transition-transform duration-500",
            resolvedTheme === "dark"
              ? "rotate-0 scale-100"
              : "-rotate-90 scale-0"
          )}
        />
      </div>
    </button>
  );
}
