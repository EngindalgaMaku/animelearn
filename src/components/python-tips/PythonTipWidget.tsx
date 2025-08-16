"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Play,
  Copy,
  Heart,
  Share2,
  Eye,
  Trophy,
  Zap,
  ChevronRight,
  X,
  Maximize2,
  Code,
  BookOpen,
  Clock,
  Star,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Portal from "@/components/ui/Portal";

interface PythonTip {
  id: string;
  title: string;
  content: string;
  codeExample?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: {
    name: string;
    color: string;
    icon: string;
  };
  xpReward: number;
  viewCount: number;
  likeCount: number;
  estimatedMinutes: number;
}

interface UserProgress {
  hasViewed: boolean;
  hasLiked: boolean;
  hasCompleted: boolean;
  xpEarned: number;
  timeSpent: number;
}

interface Streak {
  current: number;
  longest: number;
  totalTipsViewed: number;
  totalXPEarned: number;
}

interface PythonTipWidgetProps {
  tip: PythonTip;
  userProgress?: UserProgress | null;
  streak?: Streak | null;
  compact?: boolean;
  startExpanded?: boolean;
  onInteraction: (action: string, data?: any) => void;
  className?: string;
  modalPosition?: "center" | "top";
  modalTopOffsetRem?: number;
}

const difficultyColors = {
  beginner: "bg-green-500",
  intermediate: "bg-yellow-500",
  advanced: "bg-red-500",
};

const difficultyIcons = {
  beginner: "🟢",
  intermediate: "🟡",
  advanced: "🔴",
};

export default function PythonTipWidget({
  tip,
  userProgress,
  streak,
  compact = false,
  startExpanded = false,
  onInteraction,
  modalPosition = "center",
  modalTopOffsetRem = 5,
  className = "",
}: PythonTipWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(!!(compact && startExpanded));
  const [isCodeVisible, setIsCodeVisible] = useState(true);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [copied, setCopied] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const justOpenedRef = useRef(false);

  const openModal = () => {
    try {
      // mark that we just opened, to avoid immediate close from the same click event
      justOpenedRef.current = true;
    } catch {
      // ignore
    }
    setIsExpanded(true);
  };

  // Ensure modal never exceeds viewport (handles mobile dynamic viewport and small screens)
  const modalSizingStyle = {
    // prevent vertical overflow regardless of mobile browser UI bars
    maxHeight: "85dvh",
    // keep a nice width while preventing horizontal overflow on tiny screens
    width: "min(100%, calc(100vw - 2rem))",
    maxWidth: "min(40rem, calc(100vw - 2rem))",
  };

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isExpanded]);

  // Clear "just opened" flag shortly after mount so backdrop clicks work normally
  useEffect(() => {
    if (!isExpanded) return;
    const t = setTimeout(() => {
      justOpenedRef.current = false;
    }, 80);
    return () => clearTimeout(t);
  }, [isExpanded]);

  // Allow closing with Escape key when modal is open (compact mode)
  useEffect(() => {
    if (!isExpanded) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsExpanded(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isExpanded]);

  // Early return if no tip provided
  if (!tip) {
    return (
      <div
        className={`rounded-lg border border-gray-300 bg-gray-50 p-4 ${className}`}
      >
        <div className="text-center text-gray-500">
          <Terminal className="mx-auto mb-2 h-8 w-8" />
          <p>No Python tip available today</p>
        </div>
      </div>
    );
  }

  // Ensure required tip properties exist with fallbacks
  const safeTip = {
    id: tip.id || "",
    title: tip.title || "Python Tip",
    content: tip.content || "Learn something new about Python today!",
    codeExample: tip.codeExample || "",
    difficulty: tip.difficulty || ("beginner" as const),
    category: tip.category || { name: "General", color: "blue", icon: "🐍" },
    xpReward: tip.xpReward || 10,
    viewCount: tip.viewCount || 0,
    likeCount: tip.likeCount || 0,
    estimatedMinutes: tip.estimatedMinutes || 5,
  };

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Auto-mark as viewed after 3 seconds
  useEffect(() => {
    if (!userProgress?.hasViewed && onInteraction) {
      const timer = setTimeout(() => {
        onInteraction("view", {
          timeSpent: Math.floor((Date.now() - startTime) / 1000),
          deviceType:
            typeof window !== "undefined" && window.innerWidth < 768
              ? "mobile"
              : "desktop",
          sourceType: "daily",
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [userProgress?.hasViewed, onInteraction, startTime]);

  const handleLike = () => {
    const action = userProgress?.hasLiked ? "unlike" : "like";
    onInteraction(action);
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: `Python Tip: ${safeTip.title}`,
        text: safeTip.content,
        url: typeof window !== "undefined" ? window.location.href : "",
      });
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      // Fallback to clipboard
      navigator.clipboard.writeText(
        `Check out this Python tip: ${safeTip.title}\n${safeTip.content}\n\n${typeof window !== "undefined" ? window.location.href : ""}`
      );
    }
    if (onInteraction) {
      onInteraction("share");
    }
  };

  const handleCopyCode = () => {
    if (
      safeTip.codeExample &&
      typeof navigator !== "undefined" &&
      navigator.clipboard
    ) {
      navigator.clipboard.writeText(safeTip.codeExample);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleComplete = () => {
    setIsCompleting(true);
    if (onInteraction) {
      onInteraction("complete", {
        timeSpent: Math.floor((Date.now() - startTime) / 1000),
        completionScore: 100,
      });
    }

    setTimeout(() => {
      setIsCompleting(false);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (compact) {
    return (
      <motion.div
        className={`overflow-hidden rounded-lg border border-gray-700 bg-[#1e1e1e] ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Compact Header */}
        <div className="flex items-center justify-between bg-[#2d2d30] px-3 py-2">
          <div className="flex items-center space-x-2">
            <Terminal className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-white">
              Daily Python Tip
            </span>
            <span
              className={`rounded-full px-2 py-1 text-xs text-white ${difficultyColors[safeTip.difficulty]}`}
            >
              {safeTip.difficulty}
            </span>
          </div>
          <button
            onClick={openModal}
            className="text-gray-400 transition-colors hover:text-white"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Compact Content */}
        <div className="p-3">
          <h3 className="mb-2 line-clamp-1 text-sm font-medium text-white">
            {safeTip.title}
          </h3>
          <p className="mb-3 line-clamp-2 text-xs text-gray-300">
            {safeTip.content}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 text-xs transition-colors ${
                  userProgress?.hasLiked
                    ? "text-red-400"
                    : "text-gray-400 hover:text-red-400"
                }`}
              >
                <Heart
                  className="h-3 w-3"
                  fill={userProgress?.hasLiked ? "currentColor" : "none"}
                />
                <span>{safeTip.likeCount}</span>
              </button>

              <button
                onClick={handleShare}
                className="text-gray-400 transition-colors hover:text-blue-400"
              >
                <Share2 className="h-3 w-3" />
              </button>
            </div>

            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Zap className="h-3 w-3 text-yellow-400" />
              <span>+{safeTip.xpReward} XP</span>
            </div>
          </div>
        </div>

        {/* Expanded Modal */}
        <AnimatePresence>
          {isExpanded && (
            <Portal>
              <motion.div
                role="dialog"
                aria-modal="true"
                className={`fixed inset-0 z-[2147483647] flex ${modalPosition === "top" ? "items-start" : "items-center"} justify-center overscroll-contain bg-black/60 p-4 backdrop-blur-sm`}
                style={{
                  paddingTop:
                    modalPosition === "top"
                      ? `${modalTopOffsetRem}rem`
                      : undefined,
                  paddingBottom: "1rem",
                }}
                onClick={() => {
                  if (justOpenedRef.current) return;
                  setIsExpanded(false);
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className={`relative min-h-[40vh] w-full ${modalPosition === "top" ? "" : "-translate-y-6"} overflow-auto rounded-3xl bg-[#1e1e1e] shadow-2xl ring-1 ring-white/20`}
                  style={modalSizingStyle}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <FullTipContent
                    tip={safeTip}
                    userProgress={userProgress}
                    streak={streak}
                    timeSpent={timeSpent}
                    onClose={() => setIsExpanded(false)}
                    onInteraction={onInteraction}
                  />
                </motion.div>
              </motion.div>
            </Portal>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`overflow-hidden rounded-lg border border-gray-700 bg-[#1e1e1e] shadow-2xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FullTipContent
        tip={safeTip}
        userProgress={userProgress}
        streak={streak}
        timeSpent={timeSpent}
        onInteraction={onInteraction}
      />
    </motion.div>
  );
}

// Full tip content component
function FullTipContent({
  tip,
  userProgress,
  streak,
  timeSpent,
  onClose,
  onInteraction,
}: {
  tip: PythonTip;
  userProgress?: UserProgress | null;
  streak?: Streak | null;
  timeSpent: number;
  onClose?: () => void;
  onInteraction: (action: string, data?: any) => void;
}) {
  const [isCodeVisible, setIsCodeVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [startTime] = useState(Date.now());

  const handleLike = () => {
    const action = userProgress?.hasLiked ? "unlike" : "like";
    onInteraction(action);
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: `Python Tip: ${tip.title}`,
        text: tip.content,
        url: typeof window !== "undefined" ? window.location.href : "",
      });
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        `Check out this Python tip: ${tip.title}\n${tip.content}\n\n${typeof window !== "undefined" ? window.location.href : ""}`
      );
    }
    if (onInteraction) {
      onInteraction("share");
    }
  };

  const handleCopyCode = () => {
    if (
      tip.codeExample &&
      typeof navigator !== "undefined" &&
      navigator.clipboard
    ) {
      navigator.clipboard.writeText(tip.codeExample);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleComplete = () => {
    setIsCompleting(true);
    if (onInteraction) {
      onInteraction("complete", {
        timeSpent: Math.floor((Date.now() - startTime) / 1000),
        completionScore: 100,
      });
    }

    setTimeout(() => {
      setIsCompleting(false);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* VS Code Style Window Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-700 bg-[#2d2d30]/95 px-4 py-2 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          {/* macOS Style Traffic Lights */}
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </div>

          <div className="flex items-center space-x-2">
            <Terminal className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-white">
              Python Challenge
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Streak Badge */}
          {streak && (
            <div className="flex items-center space-x-1 rounded bg-yellow-600/20 px-2 py-1 text-xs text-yellow-400">
              <Trophy className="h-3 w-3" />
              <span>{streak.current} day streak</span>
            </div>
          )}

          {/* Time Tracker */}
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            <span>{formatTime(timeSpent)}</span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-h-[calc(85dvh-120px)] overflow-y-auto p-6">
        {/* Header Info */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center space-x-3">
              <span className="text-2xl">{tip.category?.icon || "🐍"}</span>
              <h2 className="text-xl font-bold text-white">{tip.title}</h2>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium text-white ${difficultyColors[tip.difficulty || "beginner"]}`}
              >
                {difficultyIcons[tip.difficulty || "beginner"]}{" "}
                {tip.difficulty || "beginner"}
              </span>
            </div>

            <p className="mb-4 text-sm leading-relaxed text-gray-300">
              {tip.content}
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>{tip.category?.name || "General"}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{tip.estimatedMinutes || 5} min read</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{tip.viewCount || 0} views</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 rounded-lg bg-purple-600/20 px-3 py-2 text-purple-400">
            <Zap className="h-4 w-4" />
            <span className="font-bold">+{tip.xpReward || 10} XP</span>
          </div>
        </div>

        {/* Code Example */}
        {tip.codeExample && (
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-white">
                  Code Example
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsCodeVisible(!isCodeVisible)}
                  className="text-xs text-gray-400 transition-colors hover:text-white"
                >
                  {isCodeVisible ? "Hide" : "Show"} Code
                </button>

                {isCodeVisible && (
                  <button
                    onClick={handleCopyCode}
                    className={`flex items-center space-x-1 text-xs transition-colors ${
                      copied
                        ? "text-green-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Copy className="h-3 w-3" />
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence>
              {isCodeVisible && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="overflow-x-auto rounded-lg border border-gray-700">
                    <SyntaxHighlighter
                      language="python"
                      style={vscDarkPlus}
                      customStyle={{
                        margin: 0,
                        padding: "1rem",
                        background: "#0d1117",
                      }}
                      showLineNumbers
                    >
                      {tip.codeExample}
                    </SyntaxHighlighter>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Progress Indicator */}
        {userProgress && (
          <div className="mb-6 rounded-lg border border-gray-700 bg-gray-800/50 p-4">
            <h3 className="mb-3 text-sm font-medium text-white">
              Your Progress
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div
                className={`flex items-center space-x-2 ${userProgress.hasViewed ? "text-green-400" : "text-gray-400"}`}
              >
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs">Viewed</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${userProgress.hasLiked ? "text-red-400" : "text-gray-400"}`}
              >
                <Heart className="h-4 w-4" />
                <span className="text-xs">Liked</span>
              </div>
              <div
                className={`flex items-center space-x-2 ${userProgress.hasCompleted ? "text-purple-400" : "text-gray-400"}`}
              >
                <Trophy className="h-4 w-4" />
                <span className="text-xs">Completed</span>
              </div>
              <div className="flex items-center space-x-2 text-yellow-400">
                <Zap className="h-4 w-4" />
                <span className="text-xs">
                  {userProgress.xpEarned} XP earned
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="border-t border-gray-700 bg-[#2d2d30] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 rounded-lg px-3 py-2 transition-all ${
                userProgress?.hasLiked
                  ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <Heart
                className="h-4 w-4"
                fill={userProgress?.hasLiked ? "currentColor" : "none"}
              />
              <span className="text-sm">{tip.likeCount || 0}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-2 rounded-lg bg-gray-700 px-3 py-2 text-gray-300 transition-colors hover:bg-gray-600"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-sm">Share</span>
            </button>
          </div>

          {!userProgress?.hasCompleted && (
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className={`flex items-center space-x-2 rounded-lg px-4 py-2 font-medium transition-all ${
                isCompleting
                  ? "bg-green-600 text-white"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {isCompleting ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Completed! +{tip.xpReward || 10} XP</span>
                </>
              ) : (
                <>
                  <Trophy className="h-4 w-4" />
                  <span>Mark Complete</span>
                </>
              )}
            </button>
          )}

          {userProgress?.hasCompleted && (
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Completed!</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
