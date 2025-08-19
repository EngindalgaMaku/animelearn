"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  RefreshCw,
  Star,
  Gift,
  Sparkles,
  Play,
} from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizContent {
  questions: Question[];
  passingScore: number;
  timeLimit: number;
}

interface LearningActivity {
  id: string;
  title: string;
  description: string;
  activityType: string;
  difficulty: number;
  category: string;
  diamondReward: number;
  experienceReward: number;
  estimatedMinutes: number;
  content: QuizContent;
  settings?: any;
  tags: string[];
  userProgress?: {
    score: number;
    maxScore: number;
    completed: boolean;
    timeSpent: number;
    hintsUsed: number;
    mistakes: number;
    startedAt: string;
    completedAt?: string;
    percentage: number;
  };
}

interface QuizActivityProps {
  activity: LearningActivity;
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

// Simple i18n shim
const t = (s: string) => s;

const ATTEMPTS_FLAG =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_QUIZ_ATTEMPTS_ENABLED === "true";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Fisher–Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// No-op analytics
function track(event: string, payload?: Record<string, any>) {
  try {
    // eslint-disable-next-line no-console
    console.debug("[quiz-analytics]", event, payload || {});
  } catch {}
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

type SavedAttempt = {
  startTime: number;
  currentQuestion: number;
  // Selected answer index relative to the displayed (randomized) options order for each position
  selectedAnswers: number[];
  timeLimit: number;
  quizStarted: boolean;
  // Randomized mapping from position -> original question index
  questionOrder: number[];
  // For each position, mapping from displayed option index -> original option index
  optionsOrders: number[][];
  completed?: boolean;
};

export default function QuizActivity({
  activity,
  onComplete,
}: QuizActivityProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [rewardAwarded, setRewardAwarded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const storageKey = useMemo(
    () => `quiz_attempt_${activity.id}`,
    [activity.id]
  );

  // Time tracking
  const {
    questions = [],
    passingScore: rawPassingScore,
    timeLimit: rawTimeLimit,
  } = activity.content || {};
  const passingScore =
    typeof rawPassingScore === "number" && !Number.isNaN(rawPassingScore)
      ? rawPassingScore
      : 70;
  const timeLimit =
    typeof rawTimeLimit === "number" && !Number.isNaN(rawTimeLimit)
      ? rawTimeLimit
      : 600;

  const startRef = useRef<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [questionOrder, setQuestionOrder] = useState<number[]>([]);
  const [optionsOrders, setOptionsOrders] = useState<number[][]>([]);

  // Resume
  const [resumeAvailable, setResumeAvailable] = useState(false);
  const savedAttemptRef = useRef<SavedAttempt | null>(null);

  // Live region messages (time warnings, result summary)
  const [liveRegionMessage, setLiveRegionMessage] = useState("");
  const warned60 = useRef(false);
  const warned30 = useRef(false);
  const warned10 = useRef(false);

  // Focus target for results
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const session = await response.json();
        setIsAuthenticated(!!session?.user);
      } catch (error) {
        const userSession =
          localStorage.getItem("user") ||
          sessionStorage.getItem("user") ||
          localStorage.getItem("next-auth.session-token") ||
          document.cookie.includes("next-auth.session-token");
        setIsAuthenticated(!!userSession);
      }
    };
    checkAuth();
  }, []);

  // Load saved attempt (resume)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const parsed: SavedAttempt = JSON.parse(raw);
      if (!parsed?.startTime || parsed.completed) return;
      const elapsed = Math.floor((Date.now() - parsed.startTime) / 1000);
      const remaining = parsed.timeLimit
        ? clamp(parsed.timeLimit - elapsed, 0, parsed.timeLimit)
        : 0;
      if (remaining > 0) {
        savedAttemptRef.current = parsed;
        setResumeAvailable(true);
      } else {
        localStorage.removeItem(storageKey);
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  const persistAttempt = useCallback(() => {
    if (!quizStarted || !startRef.current || showResults) return;
    const payload: SavedAttempt = {
      startTime: startRef.current,
      currentQuestion,
      selectedAnswers,
      timeLimit,
      quizStarted: true,
      questionOrder,
      optionsOrders,
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {}
  }, [
    quizStarted,
    currentQuestion,
    selectedAnswers,
    timeLimit,
    showResults,
    storageKey,
    questionOrder,
    optionsOrders,
  ]);

  // Timer: epoch-based
  useEffect(() => {
    if (!quizStarted || showResults || !startRef.current) return;
    let cancelled = false;
    const tick = () => {
      if (cancelled || !startRef.current) return;
      const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
      const remaining = clamp(timeLimit - elapsed, 0, timeLimit);
      setTimeLeft(remaining);
      if (remaining === 0) {
        // Auto-submit only once
        if (!submitting) {
          handleSubmitQuiz();
        }
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [quizStarted, showResults, timeLimit]); // submitting intentionally omitted to avoid interval resets

  // Recompute on visibility change
  useEffect(() => {
    const onVis = () => {
      if (
        document.visibilityState === "visible" &&
        quizStarted &&
        !showResults &&
        startRef.current
      ) {
        const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
        const remaining = clamp(timeLimit - elapsed, 0, timeLimit);
        setTimeLeft(remaining);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [quizStarted, showResults, timeLimit]);

  // Persist attempt when critical state changes
  useEffect(() => {
    persistAttempt();
  }, [persistAttempt]);

  // Time warnings
  useEffect(() => {
    if (!quizStarted || showResults) return;
    if (timeLeft === 60 && !warned60.current) {
      setLiveRegionMessage(t("1 minute remaining"));
      warned60.current = true;
    } else if (timeLeft === 30 && !warned30.current) {
      setLiveRegionMessage(t("30 seconds remaining"));
      warned30.current = true;
    } else if (timeLeft === 10 && !warned10.current) {
      setLiveRegionMessage(t("10 seconds remaining"));
      warned10.current = true;
    }
  }, [timeLeft, quizStarted, showResults]);

  const clearSavedAttempt = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  }, [storageKey]);

  // Attempt lifecycle stubs
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const startAttempt = useCallback(async () => {
    if (!ATTEMPTS_FLAG) return null;
    try {
      const res = await fetch("/api/quiz-attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId: activity.id,
          type: "quiz",
          startedAt: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAttemptId(data.id || null);
        return data.id || null;
      }
    } catch {}
    return null;
  }, [activity.id]);

  const syncProgress = useCallback(
    async (partial?: Record<string, any>) => {
      if (!ATTEMPTS_FLAG || !attemptId) return;
      try {
        await fetch(`/api/quiz-attempts/${attemptId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentQuestion,
            selectedAnswers,
            ...partial,
          }),
        });
      } catch {}
    },
    [attemptId, currentQuestion, selectedAnswers]
  );

  const submitAttempt = useCallback(
    async (payload: { selectedAnswers: number[]; timeSpent: number }) => {
      if (!ATTEMPTS_FLAG || !attemptId) return null;
      try {
        const res = await fetch(`/api/quiz-attempts/${attemptId}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) return await res.json();
      } catch {}
      return null;
    },
    [attemptId]
  );

  // Answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers((prev) => {
      const next = [...prev];
      next[currentQuestion] = answerIndex;
      return next;
    });
    track("answer_select", {
      activityId: activity.id,
      questionIndex: currentQuestion,
      answerIndex,
      attemptId,
    });
    syncProgress({ event: "answer_select" });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      const nextIndex = currentQuestion + 1;
      setCurrentQuestion(nextIndex);
      track("question_view", {
        activityId: activity.id,
        questionIndex: nextIndex,
        attemptId,
      });
      syncProgress({ event: "navigate_next" });
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const prevIndex = currentQuestion - 1;
      setCurrentQuestion(prevIndex);
      track("question_view", {
        activityId: activity.id,
        questionIndex: prevIndex,
        attemptId,
      });
      syncProgress({ event: "navigate_prev" });
    }
  };

  const computeResults = () => {
    const total = questions.length;
    if (total === 0) {
      return { correct: 0, score: 0, passed: false };
    }

    let correct = 0;
    for (let i = 0; i < total; i++) {
      const pos = i;
      const qIdx = questionOrder.length === total ? questionOrder[pos] : pos;
      const q = questions[qIdx];
      if (!q) continue;

      const optOrder =
        optionsOrders[pos] &&
        optionsOrders[pos].length === (q.options?.length ?? 0)
          ? optionsOrders[pos]
          : Array.from({ length: q.options?.length ?? 0 }, (_, k) => k);

      const ansDisp = selectedAnswers[pos];
      if (
        typeof ansDisp === "number" &&
        ansDisp >= 0 &&
        ansDisp < optOrder.length
      ) {
        const ansOriginal = optOrder[ansDisp];
        if (ansOriginal === q.correct) correct++;
      }
    }

    const score = Math.round((correct / total) * 100);
    const passed = score >= passingScore;
    return { correct, score, passed };
  };

  const handleSubmitQuiz = async () => {
    if (submitting || showResults) return;
    setSubmitting(true);
    setShowResults(true); // ensure results view renders swiftly

    // Compute time spent from start timestamp
    const timeSpent = startRef.current
      ? clamp(Math.floor((Date.now() - startRef.current) / 1000), 0, timeLimit)
      : clamp(timeLimit - timeLeft, 0, timeLimit);

    const { correct, score, passed } = computeResults();
    track("quiz_submit", {
      activityId: activity.id,
      attemptId,
      score,
      passed,
      timeSpent,
    });

    // Feature-flagged submitAttempt (no-op without backend)
    submitAttempt({ selectedAnswers, timeSpent }).catch(() => {});

    if (passed) {
      await handleActivityCompletion(Math.max(70, score));
    }

    // Focus results heading for a11y
    setTimeout(() => {
      resultsHeadingRef.current?.focus();
      setLiveRegionMessage(
        passed
          ? t("Quiz passed. Results available below.")
          : t("Quiz completed. Results available below.")
      );
    }, 0);

    // Mark saved attempt as completed and clear storage
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        parsed.completed = true;
        localStorage.setItem(storageKey, JSON.stringify(parsed));
      }
    } catch {}
    clearSavedAttempt();
    setSubmitting(false);
  };

  const handleManualComplete = () => {
    const { score } = computeResults();
    const success = score >= passingScore;
    onComplete(score, 100, success);
  };

  const handleActivityCompletion = async (score: number) => {
    setIsCompleted(true);
    if (!isAuthenticated) {
      // Incentivize login; rewards after login-managed flow
      return;
    }

    // Check if already awarded in this browser
    const awardedActivities = JSON.parse(
      localStorage.getItem("awardedActivities") || "[]"
    );
    const alreadyAwarded = awardedActivities.includes(activity.id);

    if (!alreadyAwarded) {
      try {
        const response = await fetch("/api/learning-activities/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activityType: "quiz",
            activityId: activity.id,
            activityTitle: activity.title,
            score,
            timeSpent: Math.max(60, Math.min(timeLimit, 300)), // best-effort
            success: true,
            diamondReward: activity.diamondReward || 50,
            experienceReward: activity.experienceReward || 100,
          }),
        });
        if (response.ok) {
          if (!prefersReducedMotion) {
            setShowRewardAnimation(true);
            setTimeout(() => setShowRewardAnimation(false), 3000);
          }
          awardedActivities.push(activity.id);
          localStorage.setItem(
            "awardedActivities",
            JSON.stringify(awardedActivities)
          );
          setRewardAwarded(true);
        } else {
          // eslint-disable-next-line no-console
          console.error("Failed to award rewards:", response.statusText);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error awarding rewards:", error);
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizStarted(false);
    setSubmitting(false);
    setTimeLeft(timeLimit);
    startRef.current = null;
    warned60.current = false;
    warned30.current = false;
    warned10.current = false;
    clearSavedAttempt();
  };

  // Start or resume handlers
  const startFresh = async () => {
    setQuizStarted(true);
    setShowResults(false);
    setSelectedAnswers([]);
    setCurrentQuestion(0);
    setTimeLeft(timeLimit);
    startRef.current = Date.now();

    // Randomize question order and per-question option orders
    const qOrder = shuffleArray(
      Array.from({ length: questions.length }, (_, i) => i)
    );
    const optOrders = qOrder.map((qIdx) =>
      shuffleArray(
        Array.from(
          { length: questions[qIdx]?.options?.length || 0 },
          (_, i) => i
        )
      )
    );
    setQuestionOrder(qOrder);
    setOptionsOrders(optOrders);

    track("quiz_start", { activityId: activity.id });
    const id = await startAttempt();
    if (id) setAttemptId(id);
    persistAttempt();
    // Prime first question view
    track("question_view", {
      activityId: activity.id,
      questionIndex: 0,
      attemptId: id || attemptId,
    });
  };

  const resumeSaved = async () => {
    const saved = savedAttemptRef.current;
    if (!saved) return startFresh();

    setQuizStarted(true);
    setShowResults(false);
    setCurrentQuestion(saved.currentQuestion || 0);
    setSelectedAnswers(saved.selectedAnswers || []);

    // Restore start time and remaining
    startRef.current = saved.startTime;
    const elapsed = Math.floor((Date.now() - saved.startTime) / 1000);
    const remaining = clamp(saved.timeLimit - elapsed, 0, saved.timeLimit);
    setTimeLeft(remaining);
    setResumeAvailable(false);

    // Restore orderings or build identity if missing
    const fallbackOrder = Array.from({ length: questions.length }, (_, i) => i);
    const qOrder =
      Array.isArray(saved.questionOrder) &&
      saved.questionOrder.length === questions.length
        ? saved.questionOrder
        : fallbackOrder;
    setQuestionOrder(qOrder);

    const builtIdentityOptOrders = qOrder.map((qIdx) =>
      Array.from({ length: questions[qIdx]?.options?.length || 0 }, (_, i) => i)
    );

    const optOrders =
      Array.isArray(saved.optionsOrders) &&
      saved.optionsOrders.length === qOrder.length
        ? saved.optionsOrders
        : builtIdentityOptOrders;
    setOptionsOrders(optOrders);

    track("quiz_start", { activityId: activity.id, resumed: true });
    const id = await startAttempt();
    if (id) setAttemptId(id);
    persistAttempt();
    track("question_view", {
      activityId: activity.id,
      questionIndex: saved.currentQuestion || 0,
      attemptId: id || attemptId,
    });
  };

  // Early guard: no questions
  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-lg border bg-white p-6 text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            {t("Quiz not available")}
          </h2>
          <p className="text-gray-600">
            {t("This activity doesn't have any questions yet.")}
          </p>
        </div>
      </div>
    );
  }

  // Pre-quiz screen
  if (!quizStarted) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            {activity.title}
          </h2>
          <p className="mb-8 text-lg text-gray-600">{activity.description}</p>

          {resumeAvailable && (
            <div className="mx-auto mb-6 max-w-lg rounded-lg border border-amber-200 bg-amber-50 p-4 text-left">
              <h3 className="mb-2 font-semibold text-amber-900">
                {t("Resume your previous attempt?")}
              </h3>
              <p className="mb-3 text-sm text-amber-800">
                {t(
                  "We found a previous quiz in progress. You can resume where you left off or start a new attempt."
                )}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={resumeSaved}
                  className="rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
                >
                  {t("Resume")}
                </button>
                <button
                  onClick={startFresh}
                  className="rounded-lg border border-amber-300 px-4 py-2 text-amber-800 hover:bg-amber-100"
                >
                  {t("Start New")}
                </button>
              </div>
            </div>
          )}

          <div className="mb-8 rounded-lg bg-blue-50 p-6">
            <h3 className="mb-4 text-xl font-semibold text-blue-900">
              {t("Quiz Information")}
            </h3>
            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
              <div className="flex items-center justify-center space-x-2">
                <Trophy className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-black">
                  {questions.length} {t("Questions")}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-black">
                  {formatTime(timeLimit)} {t("Time Limit")}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-black">
                  {passingScore}% {t("to Pass")}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={startFresh}
            className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-blue-700"
          >
            <Play className="h-6 w-6" />
            <span>{t("Start Quiz")}</span>
          </button>
        </div>
      </div>
    );
  }

  // Results view
  if (showResults) {
    const { correct, score } = computeResults();
    const passed = score >= passingScore;

    return (
      <div className="mx-auto max-w-4xl p-6">
        {/* ARIA live region for screen readers */}
        <div className="sr-only" aria-live="polite">
          {liveRegionMessage}
        </div>

        <div className="text-center">
          <div
            className={`mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full ${
              passed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
            {passed ? (
              <Trophy className="h-10 w-10" />
            ) : (
              <XCircle className="h-10 w-10" />
            )}
          </div>

          <h2
            ref={resultsHeadingRef}
            tabIndex={-1}
            className="mb-2 text-3xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
          >
            {passed ? t("Congratulations!") : t("Keep Trying!")}
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            {t("You scored")} {correct} {t("out of")} {questions.length}{" "}
            {t("questions correctly")}
          </p>

          <div className="mb-8 rounded-lg bg-gray-50 p-6">
            <div className="mb-2 text-4xl font-bold text-gray-900">
              {score}%
            </div>
            <div
              className={`text-lg font-semibold ${
                passed ? "text-green-600" : "text-red-600"
              }`}
            >
              {passed
                ? `${t("Passed")} (${passingScore}% ${t("required")})`
                : `${t("Failed")} (${passingScore}% ${t("required")})`}
            </div>
          </div>

          {/* Detailed review */}
          <div className="mb-8 space-y-4">
            {(questionOrder.length
              ? questionOrder
              : Array.from({ length: questions.length }, (_, i) => i)
            ).map((qIdx, pos) => {
              const q = questions[qIdx];

              const optOrder =
                optionsOrders[pos] &&
                optionsOrders[pos].length === (q.options?.length ?? 0)
                  ? optionsOrders[pos]
                  : Array.from({ length: q.options?.length ?? 0 }, (_, i) => i);

              const userDisp = selectedAnswers[pos];
              const userOrig =
                typeof userDisp === "number" &&
                userDisp >= 0 &&
                userDisp < optOrder.length
                  ? optOrder[userDisp]
                  : undefined;

              const isCorrectPos = userOrig === q.correct;

              return (
                <div
                  key={pos}
                  className="rounded-lg border bg-white p-4 text-left"
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                        isCorrectPos
                          ? "bg-green-500"
                          : typeof userDisp === "number"
                            ? "bg-red-500"
                            : "bg-gray-400"
                      }`}
                    >
                      {pos + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-semibold text-gray-900">
                        {q.question}
                      </h4>
                      <div className="mb-2 space-y-1">
                        {optOrder.map((origIdx, displayIdx) => (
                          <div
                            key={displayIdx}
                            className={`rounded p-2 text-sm ${
                              origIdx === q.correct
                                ? "bg-green-100 font-semibold text-green-800"
                                : displayIdx === userDisp &&
                                    userOrig !== q.correct
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            {q.options[origIdx]}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm italic text-gray-600">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative text-center">
            {passed ? (
              <>
                {!isAuthenticated && (
                  <div className="relative mx-auto mb-3 max-w-lg rounded-lg border border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-3 text-left">
                    <div className="mb-1 flex items-center space-x-1">
                      <Gift className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-semibold text-yellow-800">
                        {t("Login Benefits Available!")}
                      </span>
                    </div>
                    <p className="text-xs text-yellow-700">
                      {t("Login users earn")}{" "}
                      <strong>
                        {activity.diamondReward || 50} {t("diamonds")}
                      </strong>{" "}
                      {t("and")}{" "}
                      <strong>{activity.experienceReward || 100} XP</strong>{" "}
                      {t("for completing activities!")}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleManualComplete}
                  disabled={rewardAwarded}
                  className={`rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors ${
                    rewardAwarded
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {rewardAwarded
                    ? t("Rewards claimed")
                    : isAuthenticated
                      ? t("Finish & Claim Rewards")
                      : t("Login to claim rewards")}
                </button>
              </>
            ) : (
              <button
                onClick={restartQuiz}
                className="inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-700"
              >
                <RefreshCw className="h-5 w-5" />
                <span>{t("Restart Quiz")}</span>
              </button>
            )}

            {/* Reward Animation Overlay */}
            {showRewardAnimation && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <div className="relative rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 p-8 text-center shadow-2xl">
                  {!prefersReducedMotion && (
                    <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20"></div>
                  )}

                  <div className="relative z-10">
                    <div className="mb-6 flex justify-center">
                      <div
                        className={
                          prefersReducedMotion
                            ? "rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 p-4"
                            : "animate-bounce rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 p-4"
                        }
                      >
                        <Trophy className="h-12 w-12 text-white" />
                      </div>
                    </div>

                    <h3 className="mb-4 text-3xl font-bold text-white">
                      🎉 {t("Congratulations!")} 🎉
                    </h3>

                    <div className="mb-6 space-y-3">
                      <div className="flex items-center justify-center space-x-3 rounded-lg bg-yellow-500/20 p-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500">
                          <span className="font-bold text-white">💎</span>
                        </div>
                        <span className="text-xl font-semibold text-yellow-300">
                          +{activity.diamondReward || 50} {t("Diamonds")}
                        </span>
                      </div>

                      <div className="flex items-center justify-center space-x-3 rounded-lg bg-blue-500/20 p-3">
                        <Star className="h-8 w-8 text-blue-400" />
                        <span className="text-xl font-semibold text-blue-300">
                          +{activity.experienceReward || 100} {t("Experience")}
                        </span>
                      </div>
                    </div>

                    <p className="text-purple-200">
                      {t("Activity completed successfully!")}
                    </p>
                  </div>

                  {/* Floating particles animation */}
                  {!prefersReducedMotion && (
                    <div className="absolute inset-0 overflow-hidden rounded-2xl">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute animate-ping"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${2 + Math.random() * 2}s`,
                          }}
                        >
                          <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active quiz view
  const position = currentQuestion;
  const qIndex = questionOrder.length ? questionOrder[position] : position;
  const question = questions[qIndex];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const unanswered = selectedAnswers[currentQuestion] === undefined;

  return (
    <div className="mx-auto max-w-4xl p-6 pb-24 md:pb-6">
      {/* ARIA live region */}
      <div className="sr-only" aria-live="polite">
        {liveRegionMessage}
      </div>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{activity.title}</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-blue-600">
            <Clock className="h-5 w-5" />
            <span
              className={`font-mono text-lg ${timeLeft < 10 ? "text-red-600" : ""}`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {t("Question")} {currentQuestion + 1} {t("of")} {questions.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progress)}% {t("Complete")}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <fieldset>
          <legend className="mb-6 text-xl font-semibold text-gray-900">
            {question.question}
          </legend>
          <div
            role="radiogroup"
            aria-label={t("Answer choices")}
            className="space-y-3"
          >
            {(optionsOrders[position] && optionsOrders[position].length
              ? optionsOrders[position]
              : Array.from({ length: question.options.length }, (_, i) => i)
            ).map((origOptIdx, displayIndex) => {
              const checked = selectedAnswers[currentQuestion] === displayIndex;
              const inputId = `q${currentQuestion}-opt${displayIndex}`;
              return (
                <div key={displayIndex} className="w-full">
                  <input
                    id={inputId}
                    type="radio"
                    name={`question-${currentQuestion}`}
                    value={String(displayIndex)}
                    checked={checked}
                    onChange={() => handleAnswerSelect(displayIndex)}
                    className="sr-only"
                  />
                  <label
                    htmlFor={inputId}
                    className={`flex w-full cursor-pointer items-center rounded-lg border-2 p-4 text-left transition-all ${
                      checked
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`mr-3 flex h-6 w-6 items-center justify-center rounded-full border-2 text-sm font-bold ${
                        checked
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-gray-400 bg-white text-gray-700"
                      }`}
                    >
                      {String.fromCharCode(65 + displayIndex)}
                    </div>
                    <span className="font-medium text-black">
                      {question.options[origOptIdx]}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>
        </fieldset>
        {unanswered && (
          <p className="mt-4 text-sm text-gray-500">
            {t("Select one option to continue")}
          </p>
        )}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden items-center justify-between md:flex">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("Previous")}
        </button>

        <button
          onClick={handleNext}
          disabled={unanswered || submitting}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {currentQuestion === questions.length - 1
            ? t("Submit Quiz")
            : t("Next Question")}
        </button>
      </div>

      {/* Mobile Sticky Navigation */}
      <div className="lg:hidden">
        <div
          className="sticky inset-x-0 bottom-0 z-[60] border-t bg-white/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-white/80"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="mx-auto flex max-w-4xl items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="min-h-[44px] flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("Previous")}
            </button>
            <div className="w-2" />
            <button
              onClick={handleNext}
              disabled={unanswered || submitting}
              className="min-h-[44px] flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {currentQuestion === questions.length - 1
                ? t("Submit Quiz")
                : t("Next Question")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
