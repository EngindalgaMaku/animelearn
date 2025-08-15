"use client";

import { useState, useEffect, useMemo } from "react";
import {
  CheckCircle,
  XCircle,
  Trophy,
  Star,
  Gift,
  RefreshCw,
} from "lucide-react";

type BlankId = string | number;

interface Blank {
  id: BlankId;
  answer: string;
  hint?: string;
  alternatives?: string[];
  position?: number; // some seeds provide ordering for replacement
}

interface Exercise {
  id: string | number;
  description?: string;
  template?: string;
  blanks: Blank[];
  expectedOutput?: string;
}

interface FillBlanksContentSingle {
  instructions?: string;
  codeTemplate?: string;
  template?: string;
  code?: string;
  blanks?: Blank[];
  explanation?: string;
}

interface FillBlanksContentMulti {
  instructions?: string;
  exercises: Exercise[];
  explanation?: string;
}

type FillBlanksContent = FillBlanksContentSingle | FillBlanksContentMulti;

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
  content: FillBlanksContent;
  settings?: any;
  tags: string[];
}

interface FillBlanksActivityProps {
  activity: LearningActivity;
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function FillBlanksActivity({
  activity,
  onComplete,
}: FillBlanksActivityProps) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  // Normalize content for both single-template and multi-exercise schemas
  const raw: any = activity?.content ?? {};

  const instructions: string =
    typeof raw.instructions === "string" && raw.instructions.trim() !== ""
      ? raw.instructions
      : "Fill in the blanks to complete the code";

  const explanation: string | undefined =
    typeof raw.explanation === "string" ? raw.explanation : undefined;

  // Build exercises[] in a normalized form
  const exercises: Exercise[] = useMemo(() => {
    // Multi-exercise schema: content.exercises[]
    if (Array.isArray(raw.exercises)) {
      return (
        raw.exercises
          .map((ex: any, idx: number) => {
            const id = ex?.id ?? idx + 1;
            const template: string | undefined =
              typeof ex?.template === "string" ? ex.template : undefined;

            const blanks: Blank[] = Array.isArray(ex?.blanks)
              ? ex.blanks
                  .map((b: any, bi: number) => {
                    const bid: BlankId =
                      b?.id !== undefined ? String(b.id) : String(bi + 1);
                    const answerStr = String(
                      b?.answer ?? b?.correctAnswer ?? ""
                    ).trim();
                    return {
                      id: bid,
                      answer: answerStr,
                      hint: typeof b?.hint === "string" ? b.hint : undefined,
                      alternatives: Array.isArray(b?.alternatives)
                        ? b.alternatives.map((a: any) => String(a))
                        : [],
                      position:
                        typeof b?.position === "number" &&
                        !Number.isNaN(b.position)
                          ? b.position
                          : undefined,
                    } as Blank;
                  })
                  // Sort by position if provided
                  .sort((a: Blank, b: Blank) => {
                    const ap = a.position ?? 1e9;
                    const bp = b.position ?? 1e9;
                    return ap - bp;
                  })
              : [];

            return {
              id,
              description:
                typeof ex?.description === "string"
                  ? ex.description
                  : undefined,
              template,
              blanks,
              expectedOutput:
                typeof ex?.expectedOutput === "string"
                  ? ex.expectedOutput
                  : undefined,
            } as Exercise;
          })
          // Filter out exercises with no blanks and no template to avoid empty renders
          .filter(
            (ex: Exercise) =>
              (ex.template && ex.template.trim()) || ex.blanks.length > 0
          )
      );
    }

    // Single-template schema: content.{codeTemplate|template|code} + content.blanks[]
    const singleTemplate: string = (raw.codeTemplate ??
      raw.template ??
      raw.code ??
      "") as string;

    const singleBlanks: Blank[] = Array.isArray(raw.blanks)
      ? raw.blanks.map((b: any, bi: number) => {
          const bid: BlankId =
            b?.id !== undefined
              ? typeof b.id === "string"
                ? b.id
                : Number(b.id)
              : bi + 1;
          const answerStr = String(b?.answer ?? b?.correctAnswer ?? "").trim();
          return {
            id: bid,
            answer: answerStr,
            hint: typeof b?.hint === "string" ? b.hint : undefined,
            alternatives: Array.isArray(b?.alternatives)
              ? b.alternatives.map((a: any) => String(a))
              : [],
            position:
              typeof b?.position === "number" && !Number.isNaN(b.position)
                ? b.position
                : undefined,
          } as Blank;
        })
      : [];

    if (!singleTemplate && singleBlanks.length === 0) {
      // Nothing usable
      return [];
    }

    return [
      {
        id: 1,
        description: activity.description,
        template: singleTemplate,
        blanks: singleBlanks,
      } as Exercise,
    ];
  }, [raw, activity.description]);

  // Flat answers map: key = `${exerciseIndex}::${blankId}`
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);

  const totalBlanks = useMemo(
    () => exercises.reduce((sum, ex) => sum + ex.blanks.length, 0),
    [exercises]
  );

  const handleAnswerChange = (
    exIdx: number,
    blankId: BlankId,
    value: string
  ) => {
    const key = `${exIdx}::${String(blankId)}`;
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Replace placeholders in the template and render inputs
  // Supports:
  //  - Numbered placeholders: __1__, {{1}}
  //  - Generic placeholders: any run of underscores (___, ____, ______, etc.)
  const renderTemplateWithInputs = (
    exIdx: number,
    template: string,
    blanks: Blank[]
  ) => {
    if (!template || !template.trim()) return null;

    let t = template;

    // 1) Numbered placeholders by blank id (string/number)
    blanks.forEach((blank) => {
      const idStr = String(blank.id).replace(/\s+/g, "");
      const numberedPatterns = [
        new RegExp(`__${idStr}__`, "g"), // __1__
        new RegExp(`\\{\\{\\s*${idStr}\\s*\\}\\}`, "g"), // {{1}}
      ];
      const inputField = `<input-${exIdx}-${idStr}>`;
      numberedPatterns.forEach((rx) => {
        t = t.replace(rx, inputField);
      });
    });

    // 2) Generic underscores placeholders (replace remaining, in order of blanks.position or order)
    const sortedBlanks = [...blanks].sort((a: Blank, b: Blank) => {
      const ap = a.position ?? 1e9;
      const bp = b.position ?? 1e9;
      return ap - bp;
    });

    let genericIndex = 0;
    // Replace runs of underscores (3 or more) with remaining blanks
    t = t.replace(/_{3,}/g, () => {
      if (genericIndex >= sortedBlanks.length) return "___"; // leave as is if no more blanks
      const b = sortedBlanks[genericIndex++];
      return `<input-${exIdx}-${String(b.id)}>`;
    });

    // Final split by injected markers
    const parts = t.split(/(<input-\d+-[^>]+>)/);

    return parts.map((part, i) => {
      const m = part.match(/<input-(\d+)-([^>]+)>/);
      if (m) {
        const blankIdStr = m[2]; // id as string
        // locate the blank metadata
        const blank = blanks.find((b) => String(b.id) === blankIdStr);
        const key = `${exIdx}::${String(blank?.id ?? blankIdStr)}`;
        return (
          <input
            key={`inp-${exIdx}-${i}`}
            type="text"
            value={answers[key] ?? ""}
            onChange={(e) =>
              handleAnswerChange(exIdx, blank?.id ?? blankIdStr, e.target.value)
            }
            className="mx-1 rounded border border-blue-300 bg-blue-50 px-2 py-1 font-mono text-sm text-blue-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={blank?.hint || "..."}
            style={{
              width: `${Math.max(80, ((blank?.answer?.length ?? 5) as number) * 8)}px`,
            }}
          />
        );
      }
      return <span key={`txt-${exIdx}-${i}`}>{part}</span>;
    });
  };

  const allFilled = useMemo(() => {
    // Every blank across all exercises must have an answer
    for (let exIdx = 0; exIdx < exercises.length; exIdx++) {
      const ex = exercises[exIdx];
      for (const b of ex.blanks) {
        const key = `${exIdx}::${String(b.id)}`;
        if (!answers[key] || !answers[key].trim()) return false;
      }
    }
    return exercises.length > 0;
  }, [answers, exercises]);

  const computeScore = () => {
    let correctCount = 0;
    let total = 0;
    for (let exIdx = 0; exIdx < exercises.length; exIdx++) {
      const ex = exercises[exIdx];
      for (const b of ex.blanks) {
        total += 1;
        const key = `${exIdx}::${String(b.id)}`;
        const user = (answers[key] ?? "").trim().toLowerCase();
        const correct = (b.answer ?? "").trim().toLowerCase();
        const alts = (b.alternatives ?? []).map((a) => a.trim().toLowerCase());
        if (user === correct || alts.includes(user)) correctCount += 1;
      }
    }
    const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    return { correctCount, total, score };
  };

  const checkAnswers = () => {
    setShowResults(true);
    const { score } = computeScore();
    const success = score >= 70;
    if (success) {
      handleActivityCompletion(score);
    }
  };

  const handleActivityCompletion = async (score: number) => {
    // For authenticated users, we also hit API; for anonymous, parent handles onComplete for reward flow.
    if (!isAuthenticated) return;
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
            activityType: "fill_blanks",
            activityId: activity.id,
            activityTitle: activity.title,
            score: Math.max(70, score),
            timeSpent: 300,
            success: true,
            diamondReward: activity.diamondReward || 35,
            experienceReward: activity.experienceReward || 50,
          }),
        });

        if (response.ok) {
          setShowRewardAnimation(true);
          awardedActivities.push(activity.id);
          localStorage.setItem(
            "awardedActivities",
            JSON.stringify(awardedActivities)
          );
          setTimeout(() => setShowRewardAnimation(false), 3000);
        }
      } catch (error) {
        console.error("Error awarding rewards:", error);
      }
    }
  };

  const restart = () => {
    setAnswers({});
    setShowResults(false);
    setShowRewardAnimation(false);
  };

  if (exercises.length === 0) {
    // Nothing useful found in content
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
          <h2 className="mb-2 text-2xl font-bold text-yellow-900">
            No Content Available
          </h2>
          <p className="text-yellow-800">
            This activity doesn't contain any exercises or blanks to fill.
          </p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const { correctCount, total, score } = computeScore();
    const passed = score >= 70;

    return (
      <div className="mx-auto max-w-4xl p-6">
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

          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            {passed ? "Well Done!" : "Keep Practicing!"}
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            You answered {correctCount} out of {total} blanks correctly
          </p>

          <div className="mb-8 rounded-lg bg-gray-50 p-6">
            <div className="mb-2 text-4xl font-bold text-gray-900">
              {score}%
            </div>
            <div
              className={`text-lg font-semibold ${passed ? "text-green-600" : "text-red-600"}`}
            >
              {passed ? "Passed!" : "Try Again"}
            </div>
          </div>

          {explanation && (
            <div className="mx-auto mb-8 max-w-2xl rounded-lg bg-blue-50 p-6 text-left">
              <h3 className="mb-4 text-xl font-semibold text-blue-900">
                Explanation
              </h3>
              <p className="text-blue-800">{explanation}</p>
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => onComplete(score, 100, passed)}
              className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-700"
            >
              {passed
                ? "🎉 Complete Activity & Claim Rewards"
                : "Complete Activity"}
            </button>
            {!passed && (
              <button
                onClick={restart}
                className="inline-flex items-center space-x-2 rounded-lg bg-slate-200 px-6 py-3 font-bold text-slate-800 transition-colors hover:bg-slate-300"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Try Again</span>
              </button>
            )}
          </div>
        </div>

        {/* Reward Animation */}
        {showRewardAnimation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative rounded-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 p-8 text-center shadow-2xl">
              <h3 className="mb-4 text-3xl font-bold text-white">
                🎉 Congratulations! 🎉
              </h3>
              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-center space-x-3 rounded-lg bg-yellow-500/20 p-3">
                  <span className="text-xl font-semibold text-yellow-300">
                    +{activity.diamondReward || 35} Diamonds
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-3 rounded-lg bg-blue-500/20 p-3">
                  <Star className="h-8 w-8 text-blue-400" />
                  <span className="text-xl font-semibold text-blue-300">
                    +{activity.experienceReward || 50} Experience
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {activity.title}
        </h2>
        <p className="text-lg text-gray-600">{activity.description}</p>
      </div>

      {/* Instructions */}
      <div className="mb-8 rounded-lg bg-blue-50 p-6">
        <h3 className="mb-4 text-xl font-semibold text-blue-900">
          Instructions
        </h3>
        <p className="text-blue-800">{instructions}</p>
      </div>

      {/* Exercises */}
      <div className="space-y-8">
        {exercises.map((ex, exIdx) => {
          const hasTemplate = !!(ex.template && ex.template.trim());
          const hasPlaceholders =
            (hasTemplate && /_{3,}/.test(ex.template!)) || // ___ or longer
            /__\d+__/.test(ex.template!) || // __1__
            /\{\{\s*\d+\s*\}\}/.test(ex.template!); // {{1}}

          return (
            <div
              key={`ex-${exIdx}`}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              {ex.description && (
                <div className="mb-3 text-sm font-semibold text-slate-800">
                  Exercise {exIdx + 1}: {ex.description}
                </div>
              )}

              {/* Template section if provided */}
              {hasTemplate && (
                <div className="mb-4 rounded-lg bg-gray-900 p-4">
                  <h4 className="mb-3 text-sm font-semibold text-white">
                    Complete the code:
                  </h4>
                  <pre className="overflow-x-auto text-sm leading-relaxed text-gray-100">
                    <code>
                      {renderTemplateWithInputs(
                        exIdx,
                        ex.template!,
                        ex.blanks
                      ) ?? ex.template}
                    </code>
                  </pre>
                </div>
              )}

              {/* Fallback Inputs when no template or no detectable placeholders */}
              {(!hasTemplate || !hasPlaceholders) && ex.blanks.length > 0 && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h4 className="mb-3 text-sm font-semibold text-slate-900">
                    Fill in the blanks
                  </h4>
                  <div className="space-y-2">
                    {ex.blanks.map((b) => {
                      const key = `${exIdx}::${String(b.id)}`;
                      return (
                        <div
                          key={`in-${exIdx}-${String(b.id)}`}
                          className="flex items-center gap-3"
                        >
                          <label className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                            {String(b.id)}
                          </label>
                          <input
                            type="text"
                            value={answers[key] ?? ""}
                            onChange={(e) =>
                              handleAnswerChange(exIdx, b.id, e.target.value)
                            }
                            className="w-full rounded border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder={b.hint || "Type your answer"}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Hints per exercise */}
              {ex.blanks.length > 0 && (
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {ex.blanks.map((b) => (
                    <div
                      key={`hint-${exIdx}-${String(b.id)}`}
                      className="rounded-lg bg-yellow-50 p-3"
                    >
                      <div className="text-xs font-bold text-yellow-900">
                        Blank {String(b.id)}
                      </div>
                      {b.hint && (
                        <div className="text-xs text-yellow-800">
                          Hint: {b.hint}
                        </div>
                      )}
                      {b.alternatives && b.alternatives.length > 0 && (
                        <div className="mt-1 text-[11px] text-yellow-700">
                          Alternatives: {b.alternatives.join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="mt-8 text-center">
        <button
          onClick={checkAnswers}
          disabled={!allFilled}
          className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Check Answers
        </button>
      </div>
    </div>
  );
}
