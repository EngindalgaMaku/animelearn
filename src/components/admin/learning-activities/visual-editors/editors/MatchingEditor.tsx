"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Shuffle,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface MatchingPair {
  id: number;
  left: string;
  right: string;
}

interface MatchingContent {
  pairs: MatchingPair[];
  instructions: string;
  timeLimit?: number;
  shuffleOptions?: boolean;
  showFeedback?: boolean;
  feedback?: {
    correct?: string;
    incorrect?: string;
    completed?: string;
  };
}

interface MatchingEditorProps {
  content: MatchingContent;
  onChange: (content: MatchingContent) => void;
  onValidation: (isValid: boolean) => void;
}

export default function MatchingEditor({
  content,
  onChange,
  onValidation,
}: MatchingEditorProps) {
  const [matchingData, setMatchingData] = useState<MatchingContent>(() => {
    const defaultData: MatchingContent = {
      pairs: [],
      instructions:
        "Match the items from the left column with their corresponding items on the right.",
      timeLimit: 300,
      shuffleOptions: true,
      showFeedback: true,
      feedback: {
        correct: "Correct! Well done.",
        incorrect: "Not quite right. Try again.",
        completed: "Great job! You've completed all matches correctly.",
      },
    };

    return {
      ...defaultData,
      ...content,
      feedback: { ...defaultData.feedback, ...content.feedback },
    };
  });

  useEffect(() => {
    if (content && JSON.stringify(content) !== JSON.stringify(matchingData)) {
      setMatchingData((prevData) => ({
        ...prevData,
        ...content,
        feedback: { ...prevData.feedback, ...content.feedback },
      }));
    }
  }, [content]);

  useEffect(() => {
    const isValid = validateMatching();
    onValidation(isValid);
  }, [matchingData, onValidation]);

  // Only call onChange when data changes from user interaction, not prop updates
  useEffect(() => {
    if (content && JSON.stringify(content) !== JSON.stringify(matchingData)) {
      onChange(matchingData);
    }
  }, [matchingData]);

  const validateMatching = (): boolean => {
    if (!matchingData.pairs || matchingData.pairs.length < 2) return false;
    if (!matchingData.instructions.trim()) return false;

    return matchingData.pairs.every(
      (pair) => pair.left.trim() !== "" && pair.right.trim() !== ""
    );
  };

  const addPair = () => {
    const newPair: MatchingPair = {
      id: Date.now(),
      left: "",
      right: "",
    };

    setMatchingData({
      ...matchingData,
      pairs: [...matchingData.pairs, newPair],
    });
  };

  const updatePair = (
    index: number,
    field: "left" | "right",
    value: string
  ) => {
    const updatedPairs = [...matchingData.pairs];
    updatedPairs[index] = { ...updatedPairs[index], [field]: value };
    setMatchingData({ ...matchingData, pairs: updatedPairs });
  };

  const deletePair = (index: number) => {
    const updatedPairs = matchingData.pairs.filter((_, i) => i !== index);
    setMatchingData({ ...matchingData, pairs: updatedPairs });
  };

  const movePair = (fromIndex: number, toIndex: number) => {
    const updatedPairs = [...matchingData.pairs];
    const [movedPair] = updatedPairs.splice(fromIndex, 1);
    updatedPairs.splice(toIndex, 0, movedPair);
    setMatchingData({ ...matchingData, pairs: updatedPairs });
  };

  const updateSettings = (field: string, value: any) => {
    setMatchingData({
      ...matchingData,
      [field]: value,
    });
  };

  const updateFeedback = (field: string, value: string) => {
    setMatchingData({
      ...matchingData,
      feedback: { ...matchingData.feedback, [field]: value },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Matching Activity
          </h3>
          <p className="text-sm text-gray-600">
            Create pairs for students to match together
          </p>
        </div>
        <button
          onClick={addPair}
          className="flex items-center space-x-2 rounded-lg bg-blue-100 px-4 py-2 text-blue-700 transition-colors hover:bg-blue-200"
        >
          <Plus className="h-4 w-4" />
          <span>Add Pair</span>
        </button>
      </div>

      {/* Instructions */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-900">
          Instructions
        </h4>
        <textarea
          value={matchingData.instructions}
          onChange={(e) => updateSettings("instructions", e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          placeholder="Enter instructions for the matching activity..."
        />
      </div>

      {/* Matching Pairs */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-900">
          Matching Pairs
        </h4>

        <div className="space-y-4">
          {matchingData.pairs.map((pair, index) => (
            <div
              key={pair.id}
              className="flex items-center space-x-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex cursor-move items-center text-gray-400">
                <GripVertical className="h-5 w-5" />
              </div>

              <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Left Item
                  </label>
                  <input
                    type="text"
                    value={pair.left}
                    onChange={(e) => updatePair(index, "left", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter left item..."
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Right Item (Match)
                  </label>
                  <input
                    type="text"
                    value={pair.right}
                    onChange={(e) => updatePair(index, "right", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Enter matching item..."
                  />
                </div>
              </div>

              <button
                onClick={() => deletePair(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {matchingData.pairs.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <Shuffle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No matching pairs yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first matching pair.
              </p>
              <button
                onClick={addPair}
                className="mt-4 inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Add Pair</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-900">
          Activity Settings
        </h4>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              <Clock className="mr-1 inline h-4 w-4" />
              Time Limit (seconds)
            </label>
            <input
              type="number"
              value={matchingData.timeLimit || 300}
              onChange={(e) =>
                updateSettings("timeLimit", parseInt(e.target.value))
              }
              min="30"
              max="1800"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex flex-col items-center space-y-3">
            <div className="flex w-full items-center">
              <input
                type="checkbox"
                id="shuffleOptions"
                checked={matchingData.shuffleOptions ?? true}
                onChange={(e) =>
                  updateSettings("shuffleOptions", e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="shuffleOptions"
                className="ml-2 text-sm text-gray-700"
              >
                Shuffle options for each attempt
              </label>
            </div>

            <div className="flex w-full items-center">
              <input
                type="checkbox"
                id="showFeedback"
                checked={matchingData.showFeedback ?? true}
                onChange={(e) =>
                  updateSettings("showFeedback", e.target.checked)
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="showFeedback"
                className="ml-2 text-sm text-gray-700"
              >
                Show immediate feedback
              </label>
            </div>
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
              Correct Match
            </label>
            <input
              type="text"
              value={matchingData.feedback?.correct || ""}
              onChange={(e) => updateFeedback("correct", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Message for correct matches..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              <AlertTriangle className="mr-1 inline h-4 w-4 text-red-600" />
              Incorrect Match
            </label>
            <input
              type="text"
              value={matchingData.feedback?.incorrect || ""}
              onChange={(e) => updateFeedback("incorrect", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Message for incorrect matches..."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              <CheckCircle className="mr-1 inline h-4 w-4 text-blue-600" />
              Activity Completed
            </label>
            <input
              type="text"
              value={matchingData.feedback?.completed || ""}
              onChange={(e) => updateFeedback("completed", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Message when all matches are correct..."
            />
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-900">Preview</h4>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="mb-4 text-sm text-gray-700">
            {matchingData.instructions}
          </p>

          {matchingData.pairs.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h5 className="mb-2 font-semibold text-gray-900">Left Items</h5>
                <div className="space-y-2">
                  {matchingData.pairs.map((pair, index) => (
                    <div
                      key={`left-${pair.id}`}
                      className="rounded-md bg-white p-2 text-sm shadow-sm"
                    >
                      {pair.left || `Left item ${index + 1}`}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="mb-2 font-semibold text-gray-900">
                  Right Items
                </h5>
                <div className="space-y-2">
                  {matchingData.pairs.map((pair, index) => (
                    <div
                      key={`right-${pair.id}`}
                      className="rounded-md bg-white p-2 text-sm shadow-sm"
                    >
                      {pair.right || `Right item ${index + 1}`}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Validation Status */}
      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex items-center space-x-2">
          {validateMatching() ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          )}
          <p className="text-sm text-blue-800">
            {validateMatching()
              ? `Matching activity is valid with ${matchingData.pairs.length} pairs`
              : "Please add at least 2 complete matching pairs and fill in the instructions"}
          </p>
        </div>
      </div>
    </div>
  );
}
