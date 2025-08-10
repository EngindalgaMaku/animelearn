"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, RotateCcw, Trophy, Clock, Target } from "lucide-react";

interface DragDropItem {
  id: number;
  value: string;
  type: string;
}

interface DragDropCategory {
  id: string;
  name: string;
  description: string;
}

interface DragDropActivityProps {
  activity: {
    content: {
      instructions: string;
      items: DragDropItem[];
      categories: DragDropCategory[];
    };
    settings?: {
      timeLimit?: number;
      maxAttempts?: number;
      showHints?: boolean;
      shuffleItems?: boolean;
    };
  };
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function DragDropActivity({
  activity,
  onComplete,
}: DragDropActivityProps) {
  const [items, setItems] = useState<DragDropItem[]>([]);
  const [droppedItems, setDroppedItems] = useState<{
    [categoryId: string]: DragDropItem[];
  }>({});
  const [draggedItem, setDraggedItem] = useState<DragDropItem | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(
    activity?.settings?.timeLimit || 300
  );
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string>("");

  // Validate activity data
  if (!activity?.content) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-lg font-semibold text-red-500">
          Invalid Activity Data
        </div>
        <p className="text-gray-600">
          This drag and drop activity doesn't have the required content
          configuration.
        </p>
      </div>
    );
  }

  const contentItems = activity.content.items || [];
  const contentCategories = activity.content.categories || [];

  if (contentItems.length === 0 || contentCategories.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-lg font-semibold text-red-500">
          Incomplete Activity Data
        </div>
        <p className="text-gray-600">
          This activity is missing required items or categories.
        </p>
      </div>
    );
  }

  useEffect(() => {
    try {
      // Initialize items with null safety
      const shuffledItems = activity?.settings?.shuffleItems
        ? [...contentItems].sort(() => Math.random() - 0.5)
        : contentItems;
      setItems(shuffledItems);

      // Initialize categories with null safety
      const initialDropped: { [categoryId: string]: DragDropItem[] } = {};
      contentCategories.forEach((cat) => {
        if (cat?.id) {
          initialDropped[cat.id] = [];
        }
      });
      setDroppedItems(initialDropped);
    } catch (error) {
      console.error("Error initializing drag drop activity:", error);
      setFeedback("Error loading activity. Please try again.");
    }
  }, [activity]);

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isCompleted) {
      handleTimeUp();
    }
  }, [timeLeft, isCompleted]);

  const handleTimeUp = () => {
    setIsCompleted(true);
    setFeedback("⏰ Time's up! Let's see how you did.");
    checkAnswers();
  };

  const handleDragStart = (item: DragDropItem) => {
    setDraggedItem(item);
  };

  const handleDrop = (categoryId: string) => {
    if (!draggedItem) return;

    // Remove item from original location
    setItems((prev) => prev.filter((item) => item.id !== draggedItem.id));

    // Remove item from other categories
    const newDroppedItems = { ...droppedItems };
    Object.keys(newDroppedItems).forEach((catId) => {
      newDroppedItems[catId] = newDroppedItems[catId].filter(
        (item) => item.id !== draggedItem.id
      );
    });

    // Add item to new category
    newDroppedItems[categoryId] = [...newDroppedItems[categoryId], draggedItem];
    setDroppedItems(newDroppedItems);
    setDraggedItem(null);
  };

  const checkAnswers = () => {
    try {
      let correctCount = 0;
      const totalItems = contentItems.length;

      if (totalItems === 0) {
        setFeedback("No items to check!");
        return;
      }

      Object.keys(droppedItems).forEach((categoryId) => {
        const categoryItems = droppedItems[categoryId] || [];
        categoryItems.forEach((item) => {
          if (item?.type === categoryId) {
            correctCount++;
          }
        });
      });

      const finalScore = Math.round((correctCount / totalItems) * 100);
      setScore(finalScore);

      if (finalScore >= 70) {
        setFeedback(
          `🎉 Excellent! You got ${correctCount}/${totalItems} correct!`
        );
        onComplete(finalScore, 100, true);
      } else {
        setFeedback(
          `Good try! You got ${correctCount}/${totalItems} correct. Try again!`
        );
        onComplete(finalScore, 100, false);
      }
    } catch (error) {
      console.error("Error checking answers:", error);
      setFeedback("Error checking answers. Please try again.");
      onComplete(0, 100, false);
    }
  };

  const resetActivity = () => {
    try {
      setItems([...contentItems]);
      const resetDropped: { [categoryId: string]: DragDropItem[] } = {};
      contentCategories.forEach((cat) => {
        if (cat?.id) {
          resetDropped[cat.id] = [];
        }
      });
      setDroppedItems(resetDropped);
      setIsCompleted(false);
      setScore(0);
      setAttempts(attempts + 1);
      setFeedback("");
      setTimeLeft(activity?.settings?.timeLimit || 300);
    } catch (error) {
      console.error("Error resetting activity:", error);
      setFeedback("Error resetting activity. Please refresh the page.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          {activity?.content?.instructions || "Drag and Drop Activity"}
        </h2>
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>
              {Math.floor(timeLeft / 60)}:
              {(timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Target className="h-4 w-4" />
            <span>Attempt {attempts + 1}</span>
          </div>
          {score > 0 && (
            <div className="flex items-center space-x-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>Score: {score}%</span>
            </div>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`mb-6 rounded-lg p-4 text-center font-medium ${
            score >= 70
              ? "bg-green-100 text-green-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {feedback}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Items to Drag */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Items to Sort</h3>
          <div className="space-y-2">
            {items.map((item) => (
              <motion.div
                key={item.id}
                draggable={!isCompleted}
                onDragStart={() => handleDragStart(item)}
                className={`cursor-move rounded-lg border-2 border-gray-200 bg-white p-4 transition-colors hover:border-blue-300 ${
                  draggedItem?.id === item.id ? "opacity-50" : ""
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="font-medium text-gray-900">{item.value}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Drop Categories */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
          <div className="space-y-4">
            {contentCategories.map((category) => (
              <div
                key={category.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(category.id)}
                className="min-h-[120px] rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 transition-colors hover:border-blue-400 hover:bg-blue-50"
              >
                <h4 className="mb-1 font-semibold text-gray-900">
                  {category.name}
                </h4>
                <p className="mb-3 text-sm text-gray-600">
                  {category.description}
                </p>

                <div className="space-y-2">
                  {droppedItems[category.id]?.map((item) => (
                    <div
                      key={item.id}
                      className={`rounded-lg p-2 text-sm ${
                        isCompleted
                          ? item.type === category.id
                            ? "border border-green-300 bg-green-100 text-green-800"
                            : "border border-red-300 bg-red-100 text-red-800"
                          : "border border-gray-200 bg-white text-gray-900"
                      }`}
                    >
                      {item.value}
                      {isCompleted && (
                        <span className="ml-2">
                          {item.type === category.id ? (
                            <CheckCircle className="inline h-4 w-4" />
                          ) : (
                            <X className="inline h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-center space-x-4">
        {!isCompleted ? (
          <button
            onClick={checkAnswers}
            disabled={items.length > 0}
            className={`rounded-lg px-6 py-3 font-medium transition-all ${
              items.length === 0
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "cursor-not-allowed bg-gray-300 text-gray-500"
            }`}
          >
            Check Answers
          </button>
        ) : (
          <button
            onClick={resetActivity}
            className="flex items-center space-x-2 rounded-lg bg-gray-600 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-700"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
}
