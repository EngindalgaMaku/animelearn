"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Trophy, Star, Gift } from "lucide-react";

interface Blank {
  id: number;
  answer: string;
  hint?: string;
  alternatives?: string[];
}

interface FillBlanksContent {
  instructions: string;
  codeTemplate: string;
  blanks: Blank[];
  explanation?: string;
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
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
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

  const { instructions, codeTemplate, blanks, explanation } = activity.content;

  const handleAnswerChange = (blankId: number, value: string) => {
    setAnswers({
      ...answers,
      [blankId]: value,
    });
  };

  const checkAnswers = () => {
    setShowResults(true);
    const correctCount = blanks.filter((blank) => {
      const userAnswer = answers[blank.id]?.trim().toLowerCase();
      const correctAnswer = blank.answer.toLowerCase();
      const alternatives =
        blank.alternatives?.map((alt) => alt.toLowerCase()) || [];

      return userAnswer === correctAnswer || alternatives.includes(userAnswer);
    }).length;

    const score = Math.round((correctCount / blanks.length) * 100);
    const success = score >= 70;

    if (success) {
      handleActivityCompletion(score);
    }
  };

  const handleActivityCompletion = async (score: number) => {
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

  const renderCodeWithBlanks = () => {
    let template = codeTemplate;
    blanks.forEach((blank) => {
      const placeholder = `___`;
      const inputField = `<input-${blank.id}>`;
      template = template.replace(placeholder, inputField);
    });

    const parts = template.split(/(<input-\d+>)/);

    return parts.map((part, index) => {
      const inputMatch = part.match(/<input-(\d+)>/);
      if (inputMatch) {
        const blankId = parseInt(inputMatch[1]);
        const blank = blanks.find((b) => b.id === blankId);
        return (
          <input
            key={index}
            type="text"
            value={answers[blankId] || ""}
            onChange={(e) => handleAnswerChange(blankId, e.target.value)}
            className="mx-1 rounded border border-blue-300 bg-blue-50 px-2 py-1 font-mono text-sm text-blue-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder={blank?.hint || "..."}
            style={{
              width: `${Math.max(80, (blank?.answer.length || 5) * 8)}px`,
            }}
          />
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  if (showResults) {
    const correctCount = blanks.filter((blank) => {
      const userAnswer = answers[blank.id]?.trim().toLowerCase();
      const correctAnswer = blank.answer.toLowerCase();
      const alternatives =
        blank.alternatives?.map((alt) => alt.toLowerCase()) || [];
      return userAnswer === correctAnswer || alternatives.includes(userAnswer);
    }).length;

    const score = Math.round((correctCount / blanks.length) * 100);
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
            You got {correctCount} out of {blanks.length} blanks correct
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
            <div className="mb-8 rounded-lg bg-blue-50 p-6 text-left">
              <h3 className="mb-4 text-xl font-semibold text-blue-900">
                Explanation
              </h3>
              <p className="text-blue-800">{explanation}</p>
            </div>
          )}

          <button
            onClick={() => onComplete(score, 100, passed)}
            className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-700"
          >
            Complete Activity
          </button>
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
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {activity.title}
        </h2>
        <p className="text-lg text-gray-600">{activity.description}</p>
      </div>

      <div className="mb-8 rounded-lg bg-blue-50 p-6">
        <h3 className="mb-4 text-xl font-semibold text-blue-900">
          Instructions
        </h3>
        <p className="text-blue-800">{instructions}</p>
      </div>

      <div className="mb-8 rounded-lg bg-gray-900 p-6">
        <h3 className="mb-4 text-lg font-semibold text-white">
          Complete the code:
        </h3>
        <pre className="overflow-x-auto text-sm leading-relaxed text-gray-100">
          <code>{renderCodeWithBlanks()}</code>
        </pre>
      </div>

      <div className="mb-8 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Hints:</h3>
        {blanks.map((blank) => (
          <div key={blank.id} className="rounded-lg bg-yellow-50 p-4">
            <div className="font-medium text-yellow-900">
              Blank #{blank.id}:
            </div>
            <div className="text-yellow-800">{blank.hint}</div>
            {blank.alternatives && (
              <div className="mt-2 text-sm text-yellow-700">
                Alternative answers: {blank.alternatives.join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={checkAnswers}
          disabled={Object.keys(answers).length < blanks.length}
          className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Check Answers
        </button>
      </div>
    </div>
  );
}
