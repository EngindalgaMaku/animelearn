"use client";

import {
  useState,
  Suspense,
  lazy,
  Component,
  ErrorInfo,
  ReactNode,
} from "react";

// Error Boundary Component
class ActivityErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Activity Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="py-16 text-center">
          <div className="mb-4 text-lg font-semibold text-red-500">
            Activity Rendering Error
          </div>
          <p className="text-gray-600">
            There was an error loading this activity component.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Error: {this.state.error?.message || "Unknown error"}
          </div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

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

  // Enhanced validation for all activity types
  const validateActivityContent = () => {
    try {
      const { content } = activity;

      if (!content || typeof content !== "object") {
        return "Activity content is missing or invalid";
      }

      switch (activity.activityType) {
        case "drag_drop":
          const {
            target,
            blocks,
            correctOrder: dragCorrectOrder,
            hints,
          } = content || {};
          if (
            !blocks ||
            !dragCorrectOrder ||
            !Array.isArray(blocks) ||
            !Array.isArray(dragCorrectOrder)
          ) {
            return "Drag & Drop activity missing blocks or correctOrder arrays";
          }
          if (blocks.length === 0 || dragCorrectOrder.length === 0) {
            return "Drag & Drop activity has empty blocks or correctOrder";
          }
          // Validate block structure
          for (const block of blocks) {
            if (!block || block.id === undefined || !block.code) {
              return "Drag & Drop blocks missing required fields (id, code)";
            }
          }
          break;

        case "quiz":
          const { questions } = content || {};
          if (!questions || !Array.isArray(questions)) {
            return "Quiz activity missing questions array";
          }
          if (questions.length === 0) {
            return "Quiz activity has no questions";
          }
          for (const q of questions) {
            if (!q || !q.question || !q.options || !Array.isArray(q.options)) {
              return "Quiz question missing required fields (question, options)";
            }
            if (q.options.length === 0) {
              return "Quiz question has no answer options";
            }
          }
          break;

        case "memory_game":
          const { cards } = content || {};
          if (!cards || !Array.isArray(cards)) {
            return "Memory game missing cards array";
          }
          if (cards.length === 0) {
            return "Memory game has no cards";
          }
          for (const card of cards) {
            if (!card || (!card.content && !card.text)) {
              return "Memory game cards missing content";
            }
          }
          break;

        case "matching":
          const { pairs } = content || {};
          if (!pairs || !Array.isArray(pairs)) {
            return "Matching activity missing pairs array";
          }
          if (pairs.length === 0) {
            return "Matching activity has no pairs";
          }
          for (const pair of pairs) {
            if (!pair || !pair.left || !pair.right) {
              return "Matching pairs missing left or right values";
            }
          }
          break;

        case "fill_blanks":
          const { blanks, codeTemplate } = content || {};
          if (!blanks || !Array.isArray(blanks) || !codeTemplate) {
            return "Fill blanks activity missing blanks array or code template";
          }
          if (blanks.length === 0) {
            return "Fill blanks activity has no blanks";
          }
          for (const blank of blanks) {
            if (!blank || blank.id === undefined || !blank.correctAnswer) {
              return "Fill blanks missing required fields (id, correctAnswer)";
            }
          }
          break;

        case "interactive_coding":
          const { starterCode, instructions, testCases } = content || {};
          if (!starterCode || !instructions) {
            return "Interactive coding activity missing starter code or instructions";
          }
          if (testCases && !Array.isArray(testCases)) {
            return "Interactive coding testCases must be an array";
          }
          break;

        case "algorithm_visualization":
          const { steps, algorithm } = content || {};
          if (!steps || !Array.isArray(steps) || !algorithm) {
            return "Algorithm visualization missing steps or algorithm name";
          }
          if (steps.length === 0) {
            return "Algorithm visualization has no steps";
          }
          for (const step of steps) {
            if (!step || !step.data || !Array.isArray(step.data)) {
              return "Algorithm visualization step missing data array";
            }
          }
          break;

        case "code_builder":
          const { codeBlocks, correctOrder: builderCorrectOrder } =
            content || {};
          if (
            !codeBlocks ||
            !builderCorrectOrder ||
            !Array.isArray(codeBlocks) ||
            !Array.isArray(builderCorrectOrder)
          ) {
            return "Code builder missing code blocks or correct order";
          }
          if (codeBlocks.length === 0 || builderCorrectOrder.length === 0) {
            return "Code builder has empty code blocks or correct order";
          }
          for (const block of codeBlocks) {
            if (!block || block.id === undefined || !block.code) {
              return "Code builder blocks missing required fields (id, code)";
            }
          }
          break;

        case "class_builder":
          const { classTemplate } = content || {};
          if (
            !classTemplate ||
            !classTemplate.attributes ||
            !classTemplate.methods ||
            !Array.isArray(classTemplate.attributes) ||
            !Array.isArray(classTemplate.methods)
          ) {
            return "Class builder missing class template or attributes/methods arrays";
          }
          break;

        case "interactive_demo":
          const { steps: demoSteps } = content || {};
          if (!demoSteps || !Array.isArray(demoSteps)) {
            return "Interactive demo missing steps array";
          }
          if (demoSteps.length === 0) {
            return "Interactive demo has no steps";
          }
          for (const step of demoSteps) {
            if (!step || !step.content) {
              return "Interactive demo step missing content";
            }
          }
          break;

        case "data_exploration":
          const { dataset, tasks } = content || {};
          if (!dataset || !tasks || !Array.isArray(tasks)) {
            return "Data exploration missing dataset or tasks";
          }
          if (!dataset.data || !Array.isArray(dataset.data)) {
            return "Data exploration dataset missing data array";
          }
          if (!dataset.columns || !Array.isArray(dataset.columns)) {
            return "Data exploration dataset missing columns array";
          }
          if (tasks.length === 0) {
            return "Data exploration has no tasks";
          }
          if (dataset.data.length === 0) {
            return "Data exploration dataset is empty";
          }
          if (dataset.columns.length === 0) {
            return "Data exploration dataset has no columns";
          }
          for (const task of tasks) {
            if (!task || !task.task || task.points === undefined) {
              return "Data exploration task missing required fields (task, points)";
            }
          }
          break;

        default:
          return null; // Unknown activity type, let it be handled by the component
      }

      return null; // Valid
    } catch (error) {
      console.error("Error validating activity content:", error);
      return `Activity validation error: ${error instanceof Error ? error.message : String(error)}`;
    }
  };

  const validationError = validateActivityContent();
  if (validationError) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-lg font-semibold text-red-500">
          Activity Configuration Error
        </div>
        <p className="text-gray-600">{validationError}</p>
        <div className="mt-4 text-sm text-gray-500">
          Activity ID: {activity.id} | Type: {activity.activityType}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Reload Page
        </button>
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
          // Extra safety check before rendering DragDropActivity
          try {
            return <DragDropActivity {...commonProps} />;
          } catch (dragDropError) {
            console.error("DragDropActivity error:", dragDropError);
            return (
              <div className="py-16 text-center">
                <div className="mb-4 text-lg font-semibold text-red-500">
                  Drag & Drop Activity Error
                </div>
                <p className="text-gray-600">
                  There was an error loading the drag & drop activity. The
                  activity data may be incomplete.
                </p>
                <div className="mt-4 text-sm text-gray-500">
                  Activity ID: {activity.id} | Type: {activity.activityType}
                </div>
              </div>
            );
          }
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
    <ActivityErrorBoundary>
      <Suspense fallback={<LoadingComponent />}>{renderActivity()}</Suspense>
    </ActivityErrorBoundary>
  );
}
