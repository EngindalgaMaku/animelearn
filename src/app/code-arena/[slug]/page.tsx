"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  Code,
  FileText,
  CheckCircle,
  Clock,
  Diamond,
  ArrowLeft,
  ArrowRight,
  Star,
  Play,
  PauseCircle,
  Target,
  Award,
  Zap,
  Heart,
  Sparkles,
  Trophy,
  Gift,
  Flame,
  Users,
  Volume2,
  VolumeX,
} from "lucide-react";
import CodeEditor from "@/components/learn/code-editor";
import QuizComponent from "@/components/learn/quiz";
import CodeBlock from "@/components/ui/CodeBlock";
import LessonTabSystem from "@/components/learn/LessonTabSystem";
import { useAuth } from "@/contexts/AuthContext";
import InteractiveCheckpoints from "@/components/learn/interactive/InteractiveCheckpoints";

interface CodeArenaContent {
  introduction: string;
  syntax: string;
  examples: string;
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  testCases: {
    input: string;
    expectedOutput: string;
    description: string;
  }[];
  hints: string[];
  difficulty: "easy" | "medium" | "hard";
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: {
    id: string;
    question: string;
    type: "multiple_choice" | "true_false";
    options?: string[];
    correctAnswer: string;
    explanation: string;
    points: number;
  }[];
  timeLimit: number;
  passingScore: number;
  diamondReward: number;
  experienceReward: number;
}

interface CodeArena {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  order: number;
  estimatedTime: number;
  diamondReward: number;
  experienceReward: number;
  content: CodeArenaContent;
  exercise: Exercise;
  quiz: Quiz;
  isCompleted: boolean;
  isStarted: boolean;
  progress: {
    startedAt: string | null;
    completedAt: string | null;
    lastVisit: string;
    timeSpent: number;
    isCodeCorrect: boolean;
    lastCode: string | null;
    bestCode: string | null;
    score: number | null;
  };
}

// Advanced Level & Rank System Functions
const getXPForLevel = (level: number) => {
  // Exponential XP requirement: Base 100 XP * level^1.5
  return Math.floor(100 * Math.pow(level, 1.5));
};

const getCurrentLevel = (totalXP: number) => {
  let level = 1;
  let xpNeeded = 0;

  while (xpNeeded <= totalXP) {
    level++;
    xpNeeded += getXPForLevel(level);
  }

  return level - 1;
};

const getXPForCurrentLevel = (level: number) => {
  let totalXP = 0;
  for (let i = 1; i <= level; i++) {
    totalXP += getXPForLevel(i);
  }
  return totalXP;
};

const getCurrentLevelData = (totalXP: number) => {
  const level = getCurrentLevel(totalXP);
  const xpForCurrentLevel = getXPForCurrentLevel(level);
  const xpForNextLevel = getXPForCurrentLevel(level + 1);
  const currentLevelProgress = totalXP - xpForCurrentLevel;
  const xpNeededForNext = xpForNextLevel - totalXP;
  const progressPercentage =
    (currentLevelProgress / getXPForLevel(level + 1)) * 100;

  return {
    level,
    currentLevelProgress,
    xpNeededForNext,
    progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
    totalXPForNextLevel: getXPForLevel(level + 1),
  };
};

const getRankData = (level: number) => {
  const ranks = [
    {
      minLevel: 1,
      maxLevel: 4,
      name: "Code Rookie",
      icon: "🌱",
      color: "text-green-600",
    },
    {
      minLevel: 5,
      maxLevel: 9,
      name: "Arena Fighter",
      icon: "⚔️",
      color: "text-blue-600",
    },
    {
      minLevel: 10,
      maxLevel: 19,
      name: "Code Warrior",
      icon: "💻",
      color: "text-purple-600",
    },
    {
      minLevel: 20,
      maxLevel: 34,
      name: "Battle Champion",
      icon: "⚡",
      color: "text-yellow-600",
    },
    {
      minLevel: 35,
      maxLevel: 49,
      name: "Arena Master",
      icon: "🎯",
      color: "text-orange-600",
    },
    {
      minLevel: 50,
      maxLevel: 74,
      name: "Code Gladiator",
      icon: "🔥",
      color: "text-red-600",
    },
    {
      minLevel: 75,
      maxLevel: 99,
      name: "Python Ninja",
      icon: "🥷",
      color: "text-gray-800",
    },
    {
      minLevel: 100,
      maxLevel: 149,
      name: "Code Samurai",
      icon: "⚔️",
      color: "text-indigo-600",
    },
    {
      minLevel: 150,
      maxLevel: 199,
      name: "Arena Legend",
      icon: "👑",
      color: "text-yellow-500",
    },
    {
      minLevel: 200,
      maxLevel: 999,
      name: "Programming God",
      icon: "🌟",
      color: "text-purple-500",
    },
  ];

  return (
    ranks.find((rank) => level >= rank.minLevel && level <= rank.maxLevel) ||
    ranks[0]
  );
};

export default function CodeArenaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [codeArena, setCodeArena] = useState<CodeArena | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<
    "introduction" | "syntax" | "examples" | "exercise" | "quiz"
  >("introduction");
  const [arenaStarted, setArenaStarted] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  // Gamification states
  const { user, isAuthenticated } = useAuth();
  const [currentXP, setCurrentXP] = useState(user?.experience || 0);
  const [currentLevel, setCurrentLevel] = useState(() =>
    getCurrentLevel(user?.experience || 0)
  );
  const [currentStreak, setCurrentStreak] = useState(user?.loginStreak || 0);
  const [hp, setHp] = useState(100);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(
    []
  );
  const [characterMood, setCharacterMood] = useState<
    "happy" | "excited" | "thinking" | "celebrating"
  >("happy");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentDialogue, setCurrentDialogue] = useState("");
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [timeOnContent, setTimeOnContent] = useState(0);

  // Character dialogues for different situations
  const characterDialogues = {
    welcome: [
      "⚔️ Welcome to the Code Arena, warrior!",
      "Ready to battle through programming challenges?",
      "Let's fight together and claim victory rewards!",
    ],
    encouragement: [
      "💪 You're fighting well! Keep pushing forward!",
      "🚀 Your coding prowess grows stronger!",
      "✨ Excellent battle progress! Victory awaits!",
    ],
    success: [
      "🎉 Sugoi! You conquered that challenge!",
      "⭐ Outstanding victory! You earned bonus battle points!",
      "🏆 Perfect! You're becoming a true Code Arena champion!",
    ],
    hint: [
      "🤔 Need tactical support? I believe in your strength!",
      "💡 Remember the battle strategies we studied earlier",
      "🎯 Take your time, every great warrior plans carefully!",
    ],
  };

  // Fetch code arena data
  useEffect(() => {
    const fetchCodeArena = async () => {
      try {
        const response = await fetch(`/api/code-arena/${params.slug}`);
        if (response.ok) {
          const data = await response.json();
          setCodeArena(data.codeArena);
          setArenaStarted(data.codeArena.isStarted);
        } else {
          showNotification("error", "Failed to load Code Arena");
        }
      } catch (error) {
        console.error("Error fetching Code Arena:", error);
        showNotification("error", "Failed to load Code Arena");
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchCodeArena();
    }
  }, [params.slug]);

  // Time tracking effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (arenaStarted) {
      interval = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [arenaStarted]);

  // Time on content effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (
      activeSection === "introduction" ||
      activeSection === "syntax" ||
      activeSection === "examples"
    ) {
      interval = setInterval(() => {
        setTimeOnContent((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSection]);

  // Show notification
  const showNotification = (
    type: "success" | "error" | "warning",
    message: string
  ) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Random character dialogue
  const showCharacterDialogue = (type: keyof typeof characterDialogues) => {
    const dialogues = characterDialogues[type];
    const randomDialogue =
      dialogues[Math.floor(Math.random() * dialogues.length)];
    setCurrentDialogue(randomDialogue);
    setTimeout(() => setCurrentDialogue(""), 4000);
  };

  // Calculate level data using the functions defined at the top of the file
  // Use safe fallbacks for anonymous users
  const safeLevelData = useMemo(() => {
    try {
      return getCurrentLevelData(currentXP);
    } catch (error) {
      console.warn("Level calculation error for anonymous user:", error);
      return {
        level: 1,
        currentLevelProgress: 0,
        xpNeededForNext: 1000,
        progressPercentage: 0,
        totalXPForNextLevel: 1000,
      };
    }
  }, [currentXP]);

  const safeRankData = useMemo(() => {
    try {
      return getRankData(safeLevelData.level);
    } catch (error) {
      console.warn("Rank calculation error for anonymous user:", error);
      return {
        minLevel: 1,
        maxLevel: 4,
        name: "Code Rookie",
        icon: "🌱",
        color: "text-green-600",
      };
    }
  }, [safeLevelData.level]);

  const levelData = safeLevelData;
  const rankData = safeRankData;
  const progressToNextLevel = levelData.progressPercentage;

  // Start code arena
  const startCodeArena = async () => {
    console.log("🚀 startCodeArena called for", {
      isAuthenticated,
      userExists: !!user,
      codeArenaSlug: codeArena?.slug,
    });

    if (!codeArena) {
      console.log("❌ No codeArena found");
      return;
    }

    console.log("📡 Making API call to start arena...");

    try {
      const response = await fetch(`/api/code-arena/${codeArena.slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "start" }),
      });

      console.log("📡 API Response:", {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Start arena successful:", data);

        setArenaStarted(true);
        setCodeArena((prev) => (prev ? { ...prev, isStarted: true } : null));
        showNotification(
          "success",
          "Code Arena battle started! Prepare for victory! ⚔️"
        );
      } else {
        // Handle non-ok responses
        const errorData = await response.text();
        console.log("❌ API Error Response:", errorData);

        if (response.status === 401) {
          showNotification(
            "warning",
            "Please login to save your progress, but you can still start the challenge!"
          );
          // Allow anonymous users to start anyway
          setArenaStarted(true);
          setCodeArena((prev) => (prev ? { ...prev, isStarted: true } : null));
        } else {
          showNotification(
            "error",
            `Failed to start Code Arena: ${response.statusText}`
          );
        }
      }
    } catch (error) {
      console.error("Error starting Code Arena:", error);
      showNotification("error", "Failed to start Code Arena");
    }
  };

  // Complete code arena
  const completeCodeArena = async () => {
    if (!codeArena) return;

    // Check if all sections are completed
    const isContentCompleted = true; // Assuming content is completed by reaching this stage
    const isExerciseCompleted = codeArena.progress?.isCodeCorrect;
    const isQuizCompleted =
      codeArena.progress?.score &&
      codeArena.progress.score >= codeArena.quiz.passingScore;

    if (isContentCompleted && isExerciseCompleted && isQuizCompleted) {
      try {
        const response = await fetch(`/api/code-arena/${codeArena.slug}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "complete" }),
        });

        if (response.ok) {
          const result = await response.json();
          setCodeArena((prev) =>
            prev ? { ...prev, isCompleted: true } : null
          );

          // Close the completion modal
          setIsCompletionModalOpen(false);

          // Check for new badges
          if (result.newBadges && result.newBadges.length > 0) {
            // Show badge notifications
            result.newBadges.forEach((badgeInfo: any, index: number) => {
              setTimeout(() => {
                showNotification(
                  "success",
                  `🏆 New Battle Badge Earned: ${badgeInfo.badge.name}!`
                );
              }, index * 1000);
            });

            // Enhanced celebration for badge earning
            setShowRewardAnimation(true);
            setTimeout(() => setShowRewardAnimation(false), 4000);
            setCharacterMood("celebrating");
            showCharacterDialogue("success");
          }

          // Update user stats with rewards
          if (result.rewards) {
            setCurrentXP((prev) => prev + result.rewards.experience);

            let message = `🎉 Arena conquered! +${result.rewards.diamonds} diamonds, +${result.rewards.experience} XP`;
            if (result.newBadges && result.newBadges.length > 0) {
              message += ` & ${result.newBadges.length} new badge${result.newBadges.length > 1 ? "s" : ""}!`;
            }

            showNotification("success", message);

            // Show celebration animation
            if (!result.newBadges || result.newBadges.length === 0) {
              setShowRewardAnimation(true);
              setTimeout(() => setShowRewardAnimation(false), 3000);
              setCharacterMood("celebrating");
              showCharacterDialogue("success");
            }
          } else {
            showNotification("success", "🎉 Code Arena conquered!");
          }
        }
      } catch (error) {
        console.error("Error completing Code Arena:", error);
        showNotification("error", "Failed to complete Code Arena");
      }
    } else {
      setIsCompletionModalOpen(true);
    }
  };

  // Handle code submission
  const handleCodeSubmit = async (
    code: string,
    isCorrect: boolean,
    score: number
  ) => {
    if (isCorrect && codeArena) {
      try {
        // Award XP and diamonds for code completion
        const codeReward = {
          diamonds: Math.floor(codeArena.diamondReward * 0.6), // 60% of arena diamond reward
          experience: Math.floor(codeArena.experienceReward * 0.6), // 60% of arena XP reward
        };

        // Call API to award code completion rewards
        const response = await fetch(
          `/api/code-arena/${codeArena.slug}/code-complete`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              code,
              score,
              rewards: codeReward,
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();

          // Only show reward animation and update XP if actual rewards were given
          if (
            result.newCompletion &&
            result.rewards &&
            result.rewards.diamonds > 0
          ) {
            showNotification(
              "success",
              `🎉 Battle challenge conquered! +${result.rewards.diamonds} diamonds, +${result.rewards.experience} XP (${score}% victory score)`
            );

            // Update current stats for UI
            setCurrentXP((prev) => prev + result.rewards.experience);

            // Show celebration animation
            setShowRewardAnimation(true);
            setTimeout(() => setShowRewardAnimation(false), 2000);
            setCharacterMood("celebrating");
            showCharacterDialogue("success");
          } else {
            showNotification(
              "success",
              result.message ||
                `Excellent battle performance! Challenge conquered with ${score}% victory score!`
            );
          }

          // Auto-advance to quiz section when exercise is completed
          if (!codeArena.isCompleted) {
            setTimeout(() => setActiveSection("quiz"), 1500);
          }
        } else {
          showNotification(
            "success",
            `Excellent battle performance! Challenge conquered with ${score}% victory score!`
          );
        }
      } catch (error) {
        console.error("Error awarding code completion rewards:", error);
        showNotification(
          "success",
          `Excellent battle performance! Challenge conquered with ${score}% victory score!`
        );
      }
    } else if (score > 0) {
      showNotification(
        "warning",
        `Battle challenge attempted with ${score}% score. Achieve 90%+ for full rewards!`
      );
    }
  };

  // Navigate to next/previous code arena
  const navigateCodeArena = async (direction: "next" | "prev") => {
    if (!codeArena) return;

    const nextOrder =
      direction === "next" ? codeArena.order + 1 : codeArena.order - 1;

    try {
      const response = await fetch(`/api/code-arena?order=${nextOrder}`);
      if (response.ok) {
        const data = await response.json();
        if (data.codeArenas.length > 0) {
          router.push(`/code-arena/${data.codeArenas[0].slug}`);
        } else {
          showNotification("warning", `No ${direction} arena found`);
        }
      } else {
        showNotification("error", `Failed to fetch ${direction} arena`);
      }
    } catch (error) {
      console.error(`Error fetching ${direction} arena:`, error);
      showNotification("error", `Failed to fetch ${direction} arena`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Don't show loading for auth, but show for code arena data
  const { loading: authLoading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading Code Arena...</p>
          <p className="mt-2 text-sm text-gray-500">
            Auth:{" "}
            {authLoading
              ? "Loading..."
              : isAuthenticated
                ? "Authenticated"
                : "Anonymous"}
          </p>
        </div>
      </div>
    );
  }

  if (!codeArena) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Target className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h1 className="mb-2 text-2xl font-bold text-gray-800">
            Code Arena Not Found
          </h1>
          <p className="mb-4 text-gray-600">
            The Code Arena you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/code-arena")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Code Arena
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Floating Particles Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <Star className="h-2 w-2 text-yellow-300 opacity-60" />
          </div>
        ))}
      </div>

      {/* Reward Animation */}
      {showRewardAnimation && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
          <div className="animate-pulse text-6xl">🎉</div>
        </div>
      )}

      {/* Notification with anime style */}
      {notification && (
        <div
          className={`fixed right-4 top-4 z-50 animate-bounce rounded-xl border-2 p-4 shadow-2xl ${
            notification.type === "success"
              ? "border-green-300 bg-gradient-to-r from-green-400 to-green-500 text-white"
              : notification.type === "error"
                ? "border-red-300 bg-gradient-to-r from-red-400 to-red-500 text-white"
                : "border-yellow-300 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {notification.message}
          </div>
        </div>
      )}

      {/* Gamification Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Left side - Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/code-arena")}
                className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-white/80 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Arena
              </button>
              <div className="h-6 w-px bg-white/30"></div>
              <h1 className="flex items-center gap-2 text-xl font-bold">
                <Target className="h-6 w-6" />
                {codeArena.title}
              </h1>
            </div>

            {/* Right side - Stats */}
            <div className="flex items-center gap-6">
              {/* Show stats for both authenticated and anonymous users */}
              {/* Level & XP */}
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
                <Star className="h-5 w-5 text-yellow-300" />
                <span className="font-bold">LV.{levelData?.level || 1}</span>
                <div className="h-2 w-20 rounded-full bg-white/20">
                  <div
                    className="h-2 rounded-full bg-yellow-300 transition-all duration-300"
                    style={{ width: `${progressToNextLevel || 0}%` }}
                  ></div>
                </div>
                <span className="text-xs text-white/80">
                  {levelData?.xpNeededForNext || 1000} XP
                </span>
              </div>

              {/* Rank */}
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
                <span className="text-lg">{rankData?.icon || "🌱"}</span>
                <span className="font-bold text-white">
                  {rankData?.name || "Code Rookie"}
                </span>
              </div>

              {/* HP */}
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
                <Heart className="h-5 w-5 text-red-300" />
                <span className="font-bold">{hp}/100</span>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
                <Flame className="h-5 w-5 text-orange-300" />
                <span className="font-bold">{currentStreak} days</span>
              </div>

              {/* Diamonds - Show potential reward for anonymous users */}
              <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
                <Diamond className="h-5 w-5 text-blue-300" />
                <span className="font-bold">
                  {isAuthenticated
                    ? user?.currentDiamonds || 0
                    : `+${codeArena?.diamondReward || 0}`}
                </span>
                {!isAuthenticated && (
                  <span className="text-xs text-white/60">potential</span>
                )}
              </div>

              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="rounded-lg bg-white/10 p-2 transition-colors hover:bg-white/20"
              >
                {soundEnabled ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Character & Progress Section */}
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Anime Character */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border-2 border-purple-200 bg-white p-6 shadow-xl">
              <div className="text-center">
                {/* Character Avatar */}
                <div className="relative mb-4">
                  <div className="mx-auto flex h-24 w-24 animate-bounce items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-4xl">
                    ⚔️
                  </div>
                  <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-400">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>

                <h3 className="mb-2 text-lg font-bold text-gray-800">
                  Arena Guardian
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Your Battle Companion
                </p>

                {/* Character Dialogue */}
                {currentDialogue && (
                  <div className="relative mb-4 rounded-xl border-2 border-purple-200 bg-purple-100 p-3">
                    <p className="text-sm text-purple-800">{currentDialogue}</p>
                    <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 transform border-b-2 border-r-2 border-purple-200 bg-purple-100"></div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Battle Time:</span>
                    <span className="font-bold text-purple-600">
                      {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Combo:</span>
                    <span className="font-bold text-orange-600">
                      x{comboMultiplier}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress & Navigation */}
          <div className="lg:col-span-3">
            {/* Animated Progress Bar */}
            <div className="mb-6 rounded-2xl border-2 border-blue-200 bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">
                  Arena Battle Progress
                </h2>
                <span className="text-2xl font-bold text-blue-600">
                  {codeArena.isCompleted ? "100%" : arenaStarted ? "50%" : "0%"}
                </span>
              </div>

              <div className="relative">
                <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="relative h-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000"
                    style={{
                      width: codeArena.isCompleted
                        ? "100%"
                        : arenaStarted
                          ? "50%"
                          : "0%",
                    }}
                  >
                    <div className="absolute inset-0 animate-pulse bg-white/20"></div>
                  </div>
                </div>

                {/* Progress milestones */}
                <div className="mt-2 flex justify-between">
                  <div
                    className={`flex flex-col items-center ${arenaStarted ? "text-green-600" : "text-gray-400"}`}
                  >
                    <Target className="mb-1 h-6 w-6" />
                    <span className="text-xs">Enter</span>
                  </div>
                  <div
                    className={`flex flex-col items-center ${activeSection === "exercise" ? "text-blue-600" : "text-gray-400"}`}
                  >
                    <Code className="mb-1 h-6 w-6" />
                    <span className="text-xs">Battle</span>
                  </div>
                  <div
                    className={`flex flex-col items-center ${activeSection === "quiz" ? "text-purple-600" : "text-gray-400"}`}
                  >
                    <Target className="mb-1 h-6 w-6" />
                    <span className="text-xs">Test</span>
                  </div>
                  <div
                    className={`flex flex-col items-center ${codeArena.isCompleted ? "text-yellow-600" : "text-gray-400"}`}
                  >
                    <Trophy className="mb-1 h-6 w-6" />
                    <span className="text-xs">Victory</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Section Navigation */}
            <div className="grid grid-cols-5 gap-4">
              {[
                {
                  key: "introduction",
                  icon: BookOpen,
                  label: "Learn",
                  color: "from-blue-400 to-blue-500",
                  unlocked: true,
                },
                {
                  key: "syntax",
                  icon: Code,
                  label: "Syntax",
                  color: "from-green-400 to-green-500",
                  unlocked: arenaStarted,
                },
                {
                  key: "examples",
                  icon: Target,
                  label: "Examples",
                  color: "from-purple-400 to-purple-500",
                  unlocked: arenaStarted && timeOnContent >= 120,
                },
                {
                  key: "exercise",
                  icon: Code,
                  label: "Battle",
                  color: "from-orange-400 to-orange-500",
                  unlocked:
                    arenaStarted &&
                    (timeOnContent >= 300 ||
                      codeArena.progress?.isCodeCorrect ||
                      codeArena.isCompleted),
                },
                {
                  key: "quiz",
                  icon: Trophy,
                  label: "Final Test",
                  color: "from-red-400 to-red-500",
                  unlocked:
                    arenaStarted &&
                    (timeOnContent >= 300 ||
                      codeArena.progress?.isCodeCorrect ||
                      codeArena.isCompleted),
                },
              ].map((section) => (
                <button
                  key={section.key}
                  onClick={() =>
                    section.unlocked && setActiveSection(section.key as any)
                  }
                  disabled={!section.unlocked}
                  className={`group relative rounded-xl border-2 p-4 transition-all duration-300 ${
                    activeSection === section.key
                      ? `bg-gradient-to-br ${section.color} scale-105 border-white text-white shadow-xl`
                      : section.unlocked
                        ? `bg-white hover:bg-gradient-to-br hover:${section.color} border-gray-200 shadow-lg hover:scale-105 hover:border-white hover:text-white`
                        : "cursor-not-allowed border-gray-200 bg-gray-100"
                  }`}
                >
                  <div className="text-center">
                    <section.icon className="mx-auto mb-2 h-6 w-6" />
                    <span className="text-sm font-bold">{section.label}</span>
                    {!section.unlocked && (
                      <div className="mt-1 text-xs text-gray-500">🔒</div>
                    )}
                    {activeSection === section.key && (
                      <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400">
                        <Star className="h-3 w-3 text-yellow-800" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* New Tabbed Content System */}
        <div className="mb-8">
          <LessonTabSystem
            lesson={codeArena}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            lessonStarted={arenaStarted}
            timeOnContent={timeOnContent}
            isCodeCorrect={codeArena.progress?.isCodeCorrect}
            onStartLesson={startCodeArena}
          />
        </div>

        {/* Exercise Section */}
        {activeSection === "exercise" && arenaStarted && (
          <div className="mt-8">
            {codeArena.exercise ? (
              <CodeEditor
                lessonId={codeArena.slug}
                exercise={codeArena.exercise}
                onCodeSubmit={handleCodeSubmit}
              />
            ) : (
              <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100">
                <p className="text-gray-500">Loading battle challenge...</p>
              </div>
            )}
          </div>
        )}

        {/* Quiz Section */}
        {activeSection === "quiz" && arenaStarted && (
          <div className="mt-8">
            <QuizComponent
              quiz={codeArena.quiz}
              lessonId={codeArena.slug}
              onQuizComplete={(score, passed, rewards) => {
                if (passed) {
                  // Update arena state with quiz score immediately
                  setCodeArena((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      progress: {
                        ...prev.progress,
                        score: score,
                      },
                    };
                  });

                  // Only show rewards and animation if actual rewards were given
                  if (rewards && rewards.diamonds > 0) {
                    showNotification(
                      "success",
                      `🎉 Final test conquered with ${score}%! +${rewards.diamonds} diamonds, +${rewards.experience} XP`
                    );

                    // Update current stats for UI immediately
                    setCurrentXP((prev) => prev + rewards.experience);

                    // Show celebration animation
                    setShowRewardAnimation(true);
                    setTimeout(() => setShowRewardAnimation(false), 2000);
                    setCharacterMood("celebrating");
                    showCharacterDialogue("success");
                  } else {
                    showNotification(
                      "success",
                      `🎉 Final test conquered with ${score}%! (Rewards already earned)`
                    );
                  }

                  // Update arena completion status if needed - wait a bit for state update
                  setTimeout(() => {
                    if (!codeArena.isCompleted) {
                      completeCodeArena();
                    }
                  }, 100);
                } else {
                  showNotification(
                    "warning",
                    `Final test completed with ${score}%. You need 70%+ to pass.`
                  );
                }
              }}
            />
          </div>
        )}

        {/* Complete Arena Button */}
        {arenaStarted && !codeArena.isCompleted && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setIsCompletionModalOpen(true)}
              className="mx-auto flex items-center gap-2 rounded-lg bg-purple-600 px-8 py-3 font-medium text-white hover:bg-purple-700"
            >
              <Award className="h-5 w-5" />
              Claim Arena Victory
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 flex justify-between">
          <button
            onClick={() => navigateCodeArena("prev")}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous Arena
          </button>
          <button
            onClick={() => navigateCodeArena("next")}
            className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            Next Arena
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Completion Modal */}
      {isCompletionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Claim Arena Victory?
            </h2>
            <p className="mb-6 text-gray-600">
              To conquer the Code Arena, you must complete all battle phases:
              Learn, Battle Practice, and Final Test.
            </p>
            <div className="space-y-4">
              <div
                className={`flex items-center justify-between rounded-lg p-4 ${
                  true
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Learn</span>
                </div>
                {true && <CheckCircle className="h-5 w-5" />}
              </div>
              <div
                className={`flex items-center justify-between rounded-lg p-4 ${
                  codeArena.progress?.isCodeCorrect
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  <span>Battle Practice</span>
                </div>
                {codeArena.progress?.isCodeCorrect && (
                  <CheckCircle className="h-5 w-5" />
                )}
              </div>
              <div
                className={`flex items-center justify-between rounded-lg p-4 ${
                  codeArena.progress?.score &&
                  codeArena.progress.score >= codeArena.quiz.passingScore
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  <span>Final Test</span>
                </div>
                {codeArena.progress?.score &&
                  codeArena.progress.score >= codeArena.quiz.passingScore && (
                    <CheckCircle className="h-5 w-5" />
                  )}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setIsCompletionModalOpen(false)}
                className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={completeCodeArena}
                disabled={
                  !(
                    true &&
                    codeArena.progress?.isCodeCorrect &&
                    codeArena.progress?.score &&
                    codeArena.progress.score >= codeArena.quiz.passingScore
                  )
                }
                className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Claim Victory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
