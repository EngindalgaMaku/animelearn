"use client";

import { useState, useEffect } from "react";
import { CheckCircle, RotateCcw, Target, Lightbulb } from "lucide-react";

interface Block {
  id: number;
  code: string;
  type: string;
}

interface DragDropContent {
  target: string;
  blocks: Block[];
  correctOrder: number[];
  hints: string[];
}

interface LearningActivity {
  id: string;
  title: string;
  description: string;
  content: DragDropContent;
}

interface DragDropActivityProps {
  activity: LearningActivity;
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

interface DraggedBlock extends Block {
  isPlaced: boolean;
  isDragging: boolean;
}

export default function DragDropActivity({
  activity,
  onComplete,
}: DragDropActivityProps) {
  const [availableBlocks, setAvailableBlocks] = useState<DraggedBlock[]>([]);
  const [droppedBlocks, setDroppedBlocks] = useState<DraggedBlock[]>([]);
  const [draggedItem, setDraggedItem] = useState<DraggedBlock | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const { target, blocks, correctOrder, hints } = activity.content;

  useEffect(() => {
    // Shuffle blocks initially
    const shuffledBlocks: DraggedBlock[] = [...blocks]
      .sort(() => Math.random() - 0.5)
      .map((block) => ({
        ...block,
        isPlaced: false,
        isDragging: false,
      }));
    setAvailableBlocks(shuffledBlocks);
  }, [blocks]);

  const handleDragStart = (e: React.DragEvent, block: DraggedBlock) => {
    setDraggedItem(block);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    e: React.DragEvent,
    dropZone: "available" | "dropped",
    index?: number
  ) => {
    e.preventDefault();

    if (!draggedItem) return;

    if (dropZone === "dropped") {
      // Move to dropped zone
      const newDroppedBlocks = [...droppedBlocks];

      if (typeof index === "number") {
        newDroppedBlocks.splice(index, 0, { ...draggedItem, isPlaced: true });
      } else {
        newDroppedBlocks.push({ ...draggedItem, isPlaced: true });
      }

      setDroppedBlocks(newDroppedBlocks);
      setAvailableBlocks((prev) =>
        prev.filter((block) => block.id !== draggedItem.id)
      );
    } else {
      // Move back to available zone
      if (draggedItem.isPlaced) {
        setAvailableBlocks((prev) => [
          ...prev,
          { ...draggedItem, isPlaced: false },
        ]);
        setDroppedBlocks((prev) =>
          prev.filter((block) => block.id !== draggedItem.id)
        );
      }
    }

    setDraggedItem(null);
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newDroppedBlocks = [...droppedBlocks];
    const [movedBlock] = newDroppedBlocks.splice(fromIndex, 1);
    newDroppedBlocks.splice(toIndex, 0, movedBlock);
    setDroppedBlocks(newDroppedBlocks);
  };

  const removeBlock = (block: DraggedBlock) => {
    setDroppedBlocks((prev) => prev.filter((b) => b.id !== block.id));
    setAvailableBlocks((prev) => [...prev, { ...block, isPlaced: false }]);
  };

  const checkOrder = () => {
    setSubmitted(true);
    setAttempts((prev) => prev + 1);

    const userOrder = droppedBlocks.map((block) => block.id);
    let correctCount = 0;

    // Check how many blocks are in correct positions
    for (let i = 0; i < Math.min(userOrder.length, correctOrder.length); i++) {
      if (userOrder[i] === correctOrder[i]) {
        correctCount++;
      }
    }

    const accuracy = (correctCount / correctOrder.length) * 100;
    const completeness = (droppedBlocks.length / correctOrder.length) * 100;
    const efficiency = Math.max(0, 100 - (attempts - 1) * 10); // Penalty for multiple attempts

    const finalScore = Math.round(
      accuracy * 0.6 + completeness * 0.3 + efficiency * 0.1
    );
    setScore(finalScore);

    const success = finalScore >= 70 && correctCount === correctOrder.length;
    onComplete(finalScore, 100, success);
  };

  const resetActivity = () => {
    const shuffledBlocks: DraggedBlock[] = [...blocks]
      .sort(() => Math.random() - 0.5)
      .map((block) => ({
        ...block,
        isPlaced: false,
        isDragging: false,
      }));
    setAvailableBlocks(shuffledBlocks);
    setDroppedBlocks([]);
    setSubmitted(false);
    setScore(0);
    setShowHints(false);
  };

  const getBlockTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      comment: "bg-gray-100 border-gray-300 text-gray-700",
      input: "bg-blue-100 border-blue-300 text-blue-800",
      calculation: "bg-green-100 border-green-300 text-green-800",
      output: "bg-purple-100 border-purple-300 text-purple-800",
      control: "bg-orange-100 border-orange-300 text-orange-800",
      default: "bg-slate-100 border-slate-300 text-slate-800",
    };
    return colors[type] || colors["default"];
  };

  const isCorrectOrder =
    submitted &&
    JSON.stringify(droppedBlocks.map((b) => b.id)) ===
      JSON.stringify(correctOrder);

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {activity.title}
        </h2>
        <p className="mb-6 text-lg text-gray-600">{activity.description}</p>

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Target:</span>
          </div>
          <p className="text-blue-800">{target}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">
            {droppedBlocks.length}/{correctOrder.length} blocks placed
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all duration-300"
            style={{
              width: `${(droppedBlocks.length / correctOrder.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Available Blocks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Available Code Blocks
            </h3>
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center space-x-2 rounded bg-yellow-100 px-3 py-1 text-sm text-yellow-800 transition-colors hover:bg-yellow-200"
            >
              <Lightbulb className="h-4 w-4" />
              <span>{showHints ? "Hide" : "Show"} Hints</span>
            </button>
          </div>

          <div
            className="min-h-40 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "available")}
          >
            <div className="space-y-3">
              {availableBlocks.map((block) => (
                <div
                  key={block.id}
                  draggable={!submitted}
                  onDragStart={(e) => handleDragStart(e, block)}
                  className={`cursor-move rounded-lg border-2 p-3 transition-all hover:shadow-md ${getBlockTypeColor(
                    block.type
                  )} ${submitted ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <pre className="whitespace-pre-wrap font-mono text-sm">
                      {block.code}
                    </pre>
                    <span className="rounded bg-white px-2 py-1 text-xs font-medium">
                      {block.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {availableBlocks.length === 0 && (
              <p className="py-8 text-center text-gray-500">
                All blocks have been used
              </p>
            )}
          </div>

          {/* Hints */}
          {showHints && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <h4 className="mb-2 font-semibold text-yellow-900">💡 Hints:</h4>
              <ul className="space-y-1 text-sm text-yellow-800">
                {hints.map((hint, index) => (
                  <li key={index}>• {hint}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Drop Zone */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Program Structure
          </h3>

          <div
            className={`min-h-96 rounded-lg border-2 border-dashed p-4 transition-colors ${
              isCorrectOrder
                ? "border-green-500 bg-green-50"
                : submitted && droppedBlocks.length > 0
                  ? "border-red-500 bg-red-50"
                  : "border-blue-300 bg-blue-50"
            }`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "dropped")}
          >
            <div className="space-y-3">
              {droppedBlocks.map((block, index) => (
                <div key={`${block.id}-${index}`} className="relative">
                  <div
                    draggable={!submitted}
                    onDragStart={(e) => handleDragStart(e, block)}
                    className={`rounded-lg border-2 p-3 transition-all ${getBlockTypeColor(
                      block.type
                    )} ${
                      submitted
                        ? correctOrder[index] === block.id
                          ? "border-green-500 bg-green-100"
                          : "border-red-500 bg-red-100"
                        : "cursor-move hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="rounded bg-white px-2 py-1 text-xs font-bold">
                          {index + 1}
                        </span>
                        <pre className="whitespace-pre-wrap font-mono text-sm">
                          {block.code}
                        </pre>
                      </div>
                      <div className="flex items-center space-x-2">
                        {submitted && (
                          <span>
                            {correctOrder[index] === block.id ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <span className="text-xs text-red-500">
                                Wrong position
                              </span>
                            )}
                          </span>
                        )}
                        {!submitted && (
                          <button
                            onClick={() => removeBlock(block)}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Drop zone between blocks */}
                  {!submitted && index < droppedBlocks.length && (
                    <div
                      className="-my-1 h-2 bg-blue-200 opacity-0 transition-opacity hover:opacity-100"
                      onDragOver={handleDragOver}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedItem && !draggedItem.isPlaced) {
                          const newDroppedBlocks = [...droppedBlocks];
                          newDroppedBlocks.splice(index + 1, 0, {
                            ...draggedItem,
                            isPlaced: true,
                          });
                          setDroppedBlocks(newDroppedBlocks);
                          setAvailableBlocks((prev) =>
                            prev.filter((block) => block.id !== draggedItem.id)
                          );
                          setDraggedItem(null);
                        }
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {droppedBlocks.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-500">
                  Drag code blocks here to build your program
                </p>
                <p className="mt-2 text-sm text-gray-400">Order matters!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {submitted && (
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
          <div className="text-center">
            <div
              className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full ${
                isCorrectOrder
                  ? "bg-green-100 text-green-600"
                  : "bg-orange-100 text-orange-600"
              }`}
            >
              <CheckCircle className="h-8 w-8" />
            </div>

            <h3 className="mb-2 text-2xl font-bold text-gray-900">
              {isCorrectOrder ? "Perfect Structure!" : "Good Attempt!"}
            </h3>
            <p className="mb-4 text-gray-600">
              {isCorrectOrder
                ? "You built the program structure correctly!"
                : "Some blocks are in the wrong order. Review the hints and try again."}
            </p>
            <div className="mb-4 text-4xl font-bold text-gray-900">
              {score}%
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex justify-center space-x-4">
        {!submitted ? (
          <button
            onClick={checkOrder}
            disabled={droppedBlocks.length === 0}
            className="rounded-lg bg-blue-600 px-8 py-3 font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            Check Structure
          </button>
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
