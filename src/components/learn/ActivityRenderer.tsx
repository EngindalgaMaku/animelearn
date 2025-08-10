"use client";

import { useState, Suspense, lazy } from "react";

// Dynamic imports to handle missing components gracefully
const DragDropActivity = lazy(() =>
  import("./activities/DragDropActivity").catch(() => ({
    default: () => <ErrorComponent type="DragDrop" />,
  }))
);
const MemoryGameActivity = lazy(() =>
  import("./activities/MemoryGameActivity").catch(() => ({
    default: () => <ErrorComponent type="MemoryGame" />,
  }))
);
const QuizActivity = lazy(() =>
  import("./activities/QuizActivity").catch(() => ({
    default: () => <ErrorComponent type="Quiz" />,
  }))
);
const FillBlanksActivity = lazy(() =>
  import("./activities/FillBlanksActivity").catch(() => ({
    default: () => <ErrorComponent type="FillBlanks" />,
  }))
);
const InteractiveCodingActivity = lazy(() =>
  import("./activities/InteractiveCodingActivity").catch(() => ({
    default: () => <ErrorComponent type="InteractiveCoding" />,
  }))
);
const AlgorithmVisualizationActivity = lazy(() =>
  import("./activities/AlgorithmVisualizationActivity").catch(() => ({
    default: () => <ErrorComponent type="AlgorithmVisualization" />,
  }))
);
const MatchingActivity = lazy(() =>
  import("./activities/MatchingActivity").catch(() => ({
    default: () => <ErrorComponent type="Matching" />,
  }))
);
const CodeBuilderActivity = lazy(() =>
  import("./activities/CodeBuilderActivity").catch(() => ({
    default: () => <ErrorComponent type="CodeBuilder" />,
  }))
);
const ClassBuilderActivity = lazy(() =>
  import("./activities/ClassBuilderActivity").catch(() => ({
    default: () => <ErrorComponent type="ClassBuilder" />,
  }))
);
const InteractiveDemoActivity = lazy(() =>
  import("./activities/InteractiveDemoActivity").catch(() => ({
    default: () => <ErrorComponent type="InteractiveDemo" />,
  }))
);
const DataExplorationActivity = lazy(() =>
  import("./activities/DataExplorationActivity").catch(() => ({
    default: () => <ErrorComponent type="DataExploration" />,
  }))
);

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
  content: any;
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

interface ActivityRendererProps {
  activity: LearningActivity;
  onComplete: (score: number, timeSpent: number, success: boolean) => void;
}

function ErrorComponent({ type }: { type: string }) {
  return (
    <div className="py-16 text-center">
      <div className="mb-4 text-lg font-semibold text-red-500">
        {type} Activity Not Available
      </div>
      <p className="text-gray-600">
        This activity component is not yet implemented.
      </p>
    </div>
  );
}

function LoadingComponent() {
  return (
    <div className="py-16 text-center">
      <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      <p className="mt-4 text-lg text-gray-600">Loading activity...</p>
    </div>
  );
}

export default function ActivityRenderer({
  activity,
  onComplete,
}: ActivityRendererProps) {
  const [startTime] = useState(Date.now());

  const handleActivityComplete = (
    score: number,
    maxScore: number,
    success: boolean
  ) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000); // seconds
    onComplete(score, timeSpent, success);
  };

  // Validate activity data
  if (!activity || !activity.content) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-lg font-semibold text-red-500">
          Invalid Activity Data
        </div>
        <p className="text-gray-600">
          This activity doesn't have the required content configuration.
        </p>
      </div>
    );
  }

  const commonProps = {
    activity,
    onComplete: handleActivityComplete,
  };

  // Render the appropriate activity component with error handling
  const renderActivity = () => {
    try {
      switch (activity.activityType) {
        case "drag_drop":
          return <DragDropActivity {...commonProps} />;
        case "memory_game":
          return <MemoryGameActivity {...commonProps} />;
        case "quiz":
          return <QuizActivity {...commonProps} />;
        case "fill_blanks":
          return <FillBlanksActivity {...commonProps} />;
        case "interactive_coding":
          return <InteractiveCodingActivity {...commonProps} />;
        case "algorithm_visualization":
          return <AlgorithmVisualizationActivity {...commonProps} />;
        case "matching":
          return <MatchingActivity {...commonProps} />;
        case "code_builder":
          return <CodeBuilderActivity {...commonProps} />;
        case "class_builder":
          return <ClassBuilderActivity {...commonProps} />;
        case "interactive_demo":
          return <InteractiveDemoActivity {...commonProps} />;
        case "data_exploration":
          return <DataExplorationActivity {...commonProps} />;
        default:
          return (
            <div className="py-16 text-center">
              <div className="mb-4 text-lg font-semibold text-red-500">
                Unknown activity type: {activity.activityType}
              </div>
              <p className="text-gray-600">
                This activity type is not yet implemented.
              </p>
            </div>
          );
      }
    } catch (error) {
      console.error("Error rendering activity:", error);
      return (
        <div className="py-16 text-center">
          <div className="mb-4 text-lg font-semibold text-red-500">
            Activity Loading Error
          </div>
          <p className="text-gray-600">
            There was an error loading this activity. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      );
    }
  };

  return (
    <Suspense fallback={<LoadingComponent />}>{renderActivity()}</Suspense>
  );
}
