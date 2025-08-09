"use client";

import { useState, useEffect } from "react";
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
  RotateCcw
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

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
  onInteraction: (action: string, data?: any) => void;
  className?: string;
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
  onInteraction,
  className = "",
}: PythonTipWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCodeVisible, setIsCodeVisible] = useState(true);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [copied, setCopied] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Auto-mark as viewed after 3 seconds
  useEffect(() => {
    if (!userProgress?.hasViewed) {
      const timer = setTimeout(() => {
        onInteraction("view", {
          timeSpent: Math.floor((Date.now() - startTime) / 1000),
          deviceType: window.innerWidth < 768 ? "mobile" : "desktop",
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
    if (navigator.share) {
      navigator.share({
        title: `Python Tip: ${tip.title}`,
        text: tip.content,
        url: window.location.href,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(
        `Check out this Python tip: ${tip.title}\n${tip.content}\n\n${window.location.href}`
      );
    }
    onInteraction("share");
  };

  const handleCopyCode = () => {
    if (tip.codeExample) {
      navigator.clipboard.writeText(tip.codeExample);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleComplete = () => {
    setIsCompleting(true);
    onInteraction("complete", {
      timeSpent: Math.floor((Date.now() - startTime) / 1000),
      completionScore: 100,
    });
    
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
        className={`bg-[#1e1e1e] border border-gray-700 rounded-lg overflow-hidden ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Compact Header */}
        <div className="bg-[#2d2d30] px-3 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="h-4 w-4 text-blue-400" />
            <span className="text-white text-sm font-medium">Daily Python Tip</span>
            <span className={`text-xs px-2 py-1 rounded-full text-white ${difficultyColors[tip.difficulty]}`}>
              {tip.difficulty}
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(true)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Compact Content */}
        <div className="p-3">
          <h3 className="text-white text-sm font-medium mb-2 line-clamp-1">
            {tip.title}
          </h3>
          <p className="text-gray-300 text-xs line-clamp-2 mb-3">
            {tip.content}
          </p>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 text-xs transition-colors ${
                  userProgress?.hasLiked ? "text-red-400" : "text-gray-400 hover:text-red-400"
                }`}
              >
                <Heart className="h-3 w-3" fill={userProgress?.hasLiked ? "currentColor" : "none"} />
                <span>{tip.likeCount}</span>
              </button>
              
              <button
                onClick={handleShare}
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Share2 className="h-3 w-3" />
              </button>
            </div>
            
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <Zap className="h-3 w-3 text-yellow-400" />
              <span>+{tip.xpReward} XP</span>
            </div>
          </div>
        </div>

        {/* Expanded Modal */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
            >
              <motion.div
                className="bg-[#1e1e1e] rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <FullTipContent
                  tip={tip}
                  userProgress={userProgress}
                  streak={streak}
                  timeSpent={timeSpent}
                  onClose={() => setIsExpanded(false)}
                  onInteraction={onInteraction}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`bg-[#1e1e1e] border border-gray-700 rounded-lg overflow-hidden shadow-2xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FullTipContent
        tip={tip}
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
    if (navigator.share) {
      navigator.share({
        title: `Python Tip: ${tip.title}`,
        text: tip.content,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(
        `Check out this Python tip: ${tip.title}\n${tip.content}\n\n${window.location.href}`
      );
    }
    onInteraction("share");
  };

  const handleCopyCode = () => {
    if (tip.codeExample) {
      navigator.clipboard.writeText(tip.codeExample);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleComplete = () => {
    setIsCompleting(true);
    onInteraction("complete", {
      timeSpent: Math.floor((Date.now() - startTime) / 1000),
      completionScore: 100,
    });
    
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
      <div className="bg-[#2d2d30] px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-3">
          {/* macOS Style Traffic Lights */}
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Terminal className="h-4 w-4 text-blue-400" />
            <span className="text-white text-sm font-medium">Python Challenge</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Streak Badge */}
          {streak && (
            <div className="flex items-center space-x-1 bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded text-xs">
              <Trophy className="h-3 w-3" />
              <span>{streak.current} day streak</span>
            </div>
          )}

          {/* Time Tracker */}
          <div className="flex items-center space-x-1 text-gray-400 text-xs">
            <Clock className="h-3 w-3" />
            <span>{formatTime(timeSpent)}</span>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
        {/* Header Info */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">{tip.category.icon}</span>
              <h2 className="text-white text-xl font-bold">{tip.title}</h2>
              <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${difficultyColors[tip.difficulty]}`}>
                {difficultyIcons[tip.difficulty]} {tip.difficulty}
              </span>
            </div>
            
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              {tip.content}
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <BookOpen className="h-4 w-4" />
                <span>{tip.category.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{tip.estimatedMinutes} min read</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{tip.viewCount} views</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1 bg-purple-600/20 text-purple-400 px-3 py-2 rounded-lg">
            <Zap className="h-4 w-4" />
            <span className="font-bold">+{tip.xpReward} XP</span>
          </div>
        </div>

        {/* Code Example */}
        {tip.codeExample && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4 text-blue-400" />
                <span className="text-white text-sm font-medium">Code Example</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsCodeVisible(!isCodeVisible)}
                  className="text-gray-400 hover:text-white text-xs transition-colors"
                >
                  {isCodeVisible ? "Hide" : "Show"} Code
                </button>
                
                {isCodeVisible && (
                  <button
                    onClick={handleCopyCode}
                    className={`flex items-center space-x-1 text-xs transition-colors ${
                      copied ? "text-green-400" : "text-gray-400 hover:text-white"
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
                  <div className="rounded-lg overflow-hidden border border-gray-700">
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
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <h3 className="text-white text-sm font-medium mb-3">Your Progress</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`flex items-center space-x-2 ${userProgress.hasViewed ? "text-green-400" : "text-gray-400"}`}>
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs">Viewed</span>
              </div>
              <div className={`flex items-center space-x-2 ${userProgress.hasLiked ? "text-red-400" : "text-gray-400"}`}>
                <Heart className="h-4 w-4" />
                <span className="text-xs">Liked</span>
              </div>
              <div className={`flex items-center space-x-2 ${userProgress.hasCompleted ? "text-purple-400" : "text-gray-400"}`}>
                <Trophy className="h-4 w-4" />
                <span className="text-xs">Completed</span>
              </div>
              <div className="flex items-center space-x-2 text-yellow-400">
                <Zap className="h-4 w-4" />
                <span className="text-xs">{userProgress.xpEarned} XP earned</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="bg-[#2d2d30] px-6 py-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                userProgress?.hasLiked
                  ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <Heart className="h-4 w-4" fill={userProgress?.hasLiked ? "currentColor" : "none"} />
              <span className="text-sm">{tip.likeCount}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-sm">Share</span>
            </button>
          </div>

          {!userProgress?.hasCompleted && (
            <button
              onClick={handleComplete}
              disabled={isCompleting}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isCompleting
                  ? "bg-green-600 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {isCompleting ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Completed! +{tip.xpReward} XP</span>
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