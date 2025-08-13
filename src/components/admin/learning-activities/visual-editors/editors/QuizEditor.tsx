"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  Settings,
  HelpCircle,
} from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
  difficulty?: string;
  category?: string;
}

interface QuizContent {
  questions: QuizQuestion[];
  settings?: {
    timeLimit?: number;
    passingScore?: number;
    showExplanations?: boolean;
    randomizeQuestions?: boolean;
    allowRetake?: boolean;
  };
  feedback?: {
    excellent?: string;
    good?: string;
    needsWork?: string;
  };
}

interface QuizEditorProps {
  content: QuizContent;
  onChange: (content: QuizContent) => void;
  onValidation: (isValid: boolean) => void;
}

export default function QuizEditor({
  content,
  onChange,
  onValidation,
}: QuizEditorProps) {
  const [quizData, setQuizData] = useState<QuizContent>(() => {
    const defaultData: QuizContent = {
      questions: [],
      settings: {
        timeLimit: 300,
        passingScore: 70,
        showExplanations: true,
        randomizeQuestions: false,
        allowRetake: true,
      },
      feedback: {
        excellent: "Excellent! You have a strong understanding.",
        good: "Good work! Review the explanations for missed questions.",
        needsWork: "Keep studying! Focus on the fundamental concepts.",
      },
    };

    return {
      ...defaultData,
      ...content,
      settings: { ...defaultData.settings, ...content.settings },
      feedback: { ...defaultData.feedback, ...content.feedback },
    };
  });

  useEffect(() => {
    setQuizData({ ...quizData, ...content });
  }, [content]);

  useEffect(() => {
    const isValid = validateQuiz();
    onValidation(isValid);
    onChange(quizData);
  }, [quizData]);

  const validateQuiz = (): boolean => {
    if (!quizData.questions || quizData.questions.length === 0) return false;

    return quizData.questions.every(
      (q) =>
        q.question.trim() !== "" &&
        q.options.length >= 2 &&
        q.options.every((opt) => opt.trim() !== "") &&
        q.correct >= 0 &&
        q.correct < q.options.length
    );
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now(),
      question: "",
      options: ["", ""],
      correct: 0,
      explanation: "",
      difficulty: "medium",
      category: "general",
    };

    setQuizData({
      ...quizData,
      questions: [...quizData.questions, newQuestion],
    });
  };

  const updateQuestion = (
    index: number,
    field: keyof QuizQuestion,
    value: any
  ) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const deleteQuestion = (index: number) => {
    const updatedQuestions = quizData.questions.filter((_, i) => i !== index);
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].options.push("");
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...quizData.questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const deleteOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...quizData.questions];
    if (updatedQuestions[questionIndex].options.length > 2) {
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      // Adjust correct answer if necessary
      if (updatedQuestions[questionIndex].correct >= optionIndex) {
        updatedQuestions[questionIndex].correct = Math.max(
          0,
          updatedQuestions[questionIndex].correct - 1
        );
      }
      setQuizData({ ...quizData, questions: updatedQuestions });
    }
  };

  const updateSettings = (field: string, value: any) => {
    setQuizData({
      ...quizData,
      settings: { ...quizData.settings, [field]: value },
    });
  };

  const updateFeedback = (field: string, value: string) => {
    setQuizData({
      ...quizData,
      feedback: { ...quizData.feedback, [field]: value },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Quiz Questions
          </h3>
          <p className="text-sm text-gray-600">
            Create multiple choice questions with explanations
          </p>
        </div>
        <button
          onClick={addQuestion}
          className="flex items-center space-x-2 rounded-lg bg-indigo-100 px-4 py-2 text-indigo-700 transition-colors hover:bg-indigo-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add Question</span>
        </button>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {quizData.questions.map((question, questionIndex) => (
          <div
            key={question.id}
            className="rounded-lg border border-gray-200 bg-gray-50 p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">
                Question {questionIndex + 1}
              </h4>
              <button
                onClick={() => deleteQuestion(questionIndex)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Question Text */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Question
              </label>
              <textarea
                value={question.question}
                onChange={(e) =>
                  updateQuestion(questionIndex, "question", e.target.value)
                }
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Enter your question..."
              />
            </div>

            {/* Options */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Answer Options
                </label>
                <button
                  onClick={() => addOption(questionIndex)}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  <Plus className="inline h-3 w-3" /> Add Option
                </button>
              </div>

              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="radio"
                      name={`correct_${question.id}`}
                      checked={question.correct === optionIndex}
                      onChange={() =>
                        updateQuestion(questionIndex, "correct", optionIndex)
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        updateOption(questionIndex, optionIndex, e.target.value)
                      }
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      placeholder={`Option ${optionIndex + 1}`}
                    />
                    {question.options.length > 2 && (
                      <button
                        onClick={() => deleteOption(questionIndex, optionIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Question Settings */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Difficulty
                </label>
                <select
                  value={question.difficulty || "medium"}
                  onChange={(e) =>
                    updateQuestion(questionIndex, "difficulty", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  value={question.category || ""}
                  onChange={(e) =>
                    updateQuestion(questionIndex, "category", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="e.g., algorithms, data_structures"
                />
              </div>
            </div>

            {/* Explanation */}
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Explanation (optional)
              </label>
              <textarea
                value={question.explanation || ""}
                onChange={(e) =>
                  updateQuestion(questionIndex, "explanation", e.target.value)
                }
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Explain why this is the correct answer..."
              />
            </div>
          </div>
        ))}

        {quizData.questions.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              No questions yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first quiz question.
            </p>
            <button
              onClick={addQuestion}
              className="mt-4 inline-flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Question</span>
            </button>
          </div>
        )}
      </div>

      {/* Quiz Settings */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h4 className="mb-4 flex items-center space-x-2 text-lg font-semibold text-gray-900">
          <Settings className="h-5 w-5" />
          <span>Quiz Settings</span>
        </h4>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              <Clock className="mr-1 inline h-4 w-4" />
              Time Limit (seconds)
            </label>
            <input
              type="number"
              value={quizData.settings?.timeLimit || 300}
              onChange={(e) =>
                updateSettings("timeLimit", parseInt(e.target.value))
              }
              min="60"
              max="3600"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              <Target className="mr-1 inline h-4 w-4" />
              Passing Score (%)
            </label>
            <input
              type="number"
              value={quizData.settings?.passingScore || 70}
              onChange={(e) =>
                updateSettings("passingScore", parseInt(e.target.value))
              }
              min="1"
              max="100"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showExplanations"
              checked={quizData.settings?.showExplanations ?? true}
              onChange={(e) =>
                updateSettings("showExplanations", e.target.checked)
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="showExplanations"
              className="ml-2 text-sm text-gray-700"
            >
              Show explanations after answering
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="randomizeQuestions"
              checked={quizData.settings?.randomizeQuestions ?? false}
              onChange={(e) =>
                updateSettings("randomizeQuestions", e.target.checked)
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <label
              htmlFor="randomizeQuestions"
              className="ml-2 text-sm text-gray-700"
            >
              Randomize question order
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowRetake"
              checked={quizData.settings?.allowRetake ?? true}
              onChange={(e) => updateSettings("allowRetake", e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="allowRetake" className="ml-2 text-sm text-gray-700">
              Allow retaking the quiz
            </label>
          </div>
        </div>
      </div>

      {/* Feedback Messages */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-900">
          Feedback Messages
        </h4>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              <CheckCircle className="mr-1 inline h-4 w-4 text-green-600" />
              Excellent Performance (90%+)
            </label>
            <input
              type="text"
              value={quizData.feedback?.excellent || ""}
              onChange={(e) => updateFeedback("excellent", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Message for excellent performance..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              <CheckCircle className="mr-1 inline h-4 w-4 text-blue-600" />
              Good Performance (70-89%)
            </label>
            <input
              type="text"
              value={quizData.feedback?.good || ""}
              onChange={(e) => updateFeedback("good", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Message for good performance..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              <AlertTriangle className="mr-1 inline h-4 w-4 text-orange-600" />
              Needs Improvement (&lt;70%)
            </label>
            <input
              type="text"
              value={quizData.feedback?.needsWork || ""}
              onChange={(e) => updateFeedback("needsWork", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Message for improvement needed..."
            />
          </div>
        </div>
      </div>

      {/* Validation Status */}
      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex items-center space-x-2">
          {validateQuiz() ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          )}
          <p className="text-sm text-blue-800">
            {validateQuiz()
              ? `Quiz is valid with ${quizData.questions.length} questions`
              : "Please add at least one complete question with all options filled"}
          </p>
        </div>
      </div>
    </div>
  );
}
