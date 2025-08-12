"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Lightbulb, RotateCcw, Code } from "lucide-react";

interface Blank {
  position: number;
  answer: string;
  hint: string;
}

interface FillBlanksContent {
  code: string;
  blanks: Blank[];
  explanation: string;
}

interface LearningActivity {
  id: string;
  title: string;
  description: string;
  content: FillBlanksContent;
}

interface FillBlanksActivityProps {
  activity: LearningActivity;
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function FillBlanksActivity({
  activity,
  onComplete,
}: FillBlanksActivityProps) {
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [showHints, setShowHints] = useState<{ [key: number]: boolean }>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<{ [key: number]: boolean }>({});
  const [score, setScore] = useState(0);

  const { code, blanks, explanation } = activity.content;

  useEffect(() => {
    // Initialize user answers
    const initialAnswers: { [key: number]: string } = {};
    blanks.forEach((blank) => {
      initialAnswers[blank.position] = "";
    });
    setUserAnswers(initialAnswers);
  }, [blanks]);

  const handleAnswerChange = (position: number, value: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [position]: value,
    }));
  };

  const toggleHint = (position: number) => {
    setShowHints((prev) => ({
      ...prev,
      [position]: !prev[position],
    }));
  };

  const checkAnswers = () => {
    const newResults: { [key: number]: boolean } = {};
    let correctCount = 0;

    blanks.forEach((blank) => {
      const userAnswer = userAnswers[blank.position]?.trim().toLowerCase();
      const correctAnswer = blank.answer.toLowerCase();
      const isCorrect = userAnswer === correctAnswer;
      newResults[blank.position] = isCorrect;
      if (isCorrect) correctCount++;
    });

    setResults(newResults);
    setSubmitted(true);

    const finalScore = Math.round((correctCount / blanks.length) * 100);
    setScore(finalScore);

    // Don't auto-complete - let user manually complete
  };

  const handleManualComplete = () => {
    const finalScore = Math.round(
      (Object.values(results).filter(Boolean).length / blanks.length) * 100
    );
    const success = finalScore >= 70;
    onComplete(finalScore, 100, success);
  };

  const resetActivity = () => {
    const initialAnswers: { [key: number]: string } = {};
    blanks.forEach((blank) => {
      initialAnswers[blank.position] = "";
    });
    setUserAnswers(initialAnswers);
    setShowHints({});
    setSubmitted(false);
    setResults({});
    setScore(0);
  };

  const renderCodeWithBlanks = () => {
    const lines = code.split("\n");
    return lines.map((line, lineIndex) => {
      let processedLine = line;
      const lineNumber = lineIndex + 1;

      // Replace blanks with input fields
      blanks.forEach((blank) => {
        const blankPattern = new RegExp(`___`, "g");
        let matchCount = 0;
        processedLine = processedLine.replace(blankPattern, () => {
          matchCount++;
          if (
            matchCount === blank.position ||
            (lineIndex === 0 && blank.position === matchCount)
          ) {
            return `{{BLANK_${blank.position}}}`;
          }
          return "___";
        });
      });

      return (
        <div key={lineIndex} className="flex items-start">
          <span className="mr-4 w-8 text-right font-mono text-sm text-gray-400">
            {lineNumber}
          </span>
          <div className="flex-1 font-mono text-sm">
            {processedLine
              .split(/(\{\{BLANK_\d+\}\})/)
              .map((part, partIndex) => {
                const blankMatch = part.match(/\{\{BLANK_(\d+)\}\}/);
                if (blankMatch) {
                  const blankPosition = parseInt(blankMatch[1]);
                  const blank = blanks.find(
                    (b) => b.position === blankPosition
                  );
                  if (!blank) return part;

                  const isCorrect = results[blankPosition];
                  const hasResult =
                    submitted && results.hasOwnProperty(blankPosition);

                  return (
                    <span key={partIndex} className="relative inline-block">
                      <input
                        type="text"
                        value={userAnswers[blankPosition] || ""}
                        onChange={(e) =>
                          handleAnswerChange(blankPosition, e.target.value)
                        }
                        disabled={submitted}
                        className={`inline-block min-w-20 rounded border px-2 py-1 text-center font-mono text-sm ${
                          hasResult
                            ? isCorrect
                              ? "border-green-500 bg-green-50 text-green-800"
                              : "border-red-500 bg-red-50 text-red-800"
                            : "border-blue-300 bg-blue-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        }`}
                        placeholder={`___`}
                      />
                      <button
                        onClick={() => toggleHint(blankPosition)}
                        className="ml-2 p-1 text-blue-500 transition-colors hover:text-blue-700"
                        title="Show hint"
                      >
                        <Lightbulb className="h-4 w-4" />
                      </button>
                      {showHints[blankPosition] && (
                        <div className="absolute left-0 top-full z-10 mt-1 whitespace-nowrap rounded border border-yellow-300 bg-yellow-100 p-2 text-xs text-yellow-800 shadow-lg">
                          💡 {blank.hint}
                        </div>
                      )}
                      {hasResult && (
                        <span className="ml-2">
                          {isCorrect ? (
                            <CheckCircle className="inline h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="inline h-4 w-4 text-red-500" />
                          )}
                        </span>
                      )}
                    </span>
                  );
                }
                return (
                  <span
                    key={partIndex}
                    className={
                      part.includes("#") ? "text-gray-500" : "text-gray-900"
                    }
                  >
                    {part}
                  </span>
                );
              })}
          </div>
        </div>
      );
    });
  };

  const correctCount = Object.values(results).filter(Boolean).length;
  const allAnswered = blanks.every(
    (blank) => userAnswers[blank.position]?.trim().length > 0
  );

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {activity.title}
        </h2>
        <p className="mb-6 text-lg text-gray-600">{activity.description}</p>

        {!submitted && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-900">Instructions:</h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Fill in the blanks with the correct code</li>
              <li>• Click the 💡 button next to each blank for hints</li>
              <li>
                • Complete all blanks and click "Check Answers" when ready
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Code Editor */}
      <div className="mb-6 overflow-x-auto rounded-lg bg-gray-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-400">
              Python Code
            </span>
          </div>
          <div className="flex space-x-1">
            <div className="h-3 w-3 rounded-full bg-red-400"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
            <div className="h-3 w-3 rounded-full bg-green-400"></div>
          </div>
        </div>
        <div className="space-y-1 text-white">{renderCodeWithBlanks()}</div>
      </div>

      {/* Progress */}
      {!submitted && (
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">
              {
                Object.values(userAnswers).filter(
                  (answer) => answer.trim().length > 0
                ).length
              }
              /{blanks.length} completed
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${(Object.values(userAnswers).filter((answer) => answer.trim().length > 0).length / blanks.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Results */}
      {submitted && (
        <div className="mb-6 rounded-lg bg-gray-50 p-6">
          <div className="mb-4 text-center">
            <div
              className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full ${
                score >= 70
                  ? "bg-green-100 text-green-600"
                  : "bg-orange-100 text-orange-600"
              }`}
            >
              {score >= 70 ? (
                <CheckCircle className="h-8 w-8" />
              ) : (
                <XCircle className="h-8 w-8" />
              )}
            </div>
            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              {score >= 70 ? "Well Done!" : "Keep Practicing!"}
            </h3>
            <p className="mb-4 text-gray-600">
              You got {correctCount} out of {blanks.length} blanks correct
            </p>
            <div className="text-4xl font-bold text-gray-900">{score}%</div>
          </div>

          {/* Show incorrect answers */}
          {correctCount < blanks.length && (
            <div className="mt-6">
              <h4 className="mb-3 font-semibold text-gray-900">
                Review incorrect answers:
              </h4>
              <div className="space-y-2">
                {blanks
                  .filter((blank) => !results[blank.position])
                  .map((blank) => (
                    <div
                      key={blank.position}
                      className="rounded border border-red-200 bg-white p-3"
                    >
                      <div className="text-sm">
                        <span className="text-gray-600">
                          Blank {blank.position}:
                        </span>
                        <span className="ml-2 font-mono text-red-600">
                          Your answer: "{userAnswers[blank.position]}"
                        </span>
                        <span className="ml-2 font-mono text-green-600">
                          Correct: "{blank.answer}"
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        💡 {blank.hint}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Explanation */}
      <div className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
        <h3 className="mb-2 font-semibold text-indigo-900">Explanation:</h3>
        <p className="text-indigo-800">{explanation}</p>
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        {!submitted ? (
          <button
            onClick={checkAnswers}
            disabled={!allAnswered}
            className="rounded-lg bg-blue-600 px-8 py-3 font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Check Answers
          </button>
        ) : score >= 70 ? (
          <div className="text-center">
            <div className="mb-3 rounded-lg border border-green-200 bg-green-50 p-3">
              <div className="mb-2 flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-semibold text-green-900">
                  Exercise Complete!
                </span>
              </div>
              <p className="mb-3 text-xs text-green-800">
                You've successfully completed the fill-in-the-blanks exercise.
                Review your results above and claim your rewards!
              </p>
              <button
                onClick={handleManualComplete}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
              >
                🎉 Complete Exercise & Claim Rewards
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={resetActivity}
            className="inline-flex items-center space-x-2 rounded-lg bg-indigo-600 px-6 py-3 font-bold text-white transition-colors hover:bg-indigo-700"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
}
