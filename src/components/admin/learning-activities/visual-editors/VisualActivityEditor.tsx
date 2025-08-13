"use client";

import { useState, useEffect } from "react";
import {
  Code,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

// Import individual activity editors
import AlgorithmVisualizationEditor from "./editors/AlgorithmVisualizationEditor";
import MatchingEditor from "./editors/MatchingEditor";
import DataExplorationEditor from "./editors/DataExplorationEditor";
import InteractiveDemoEditor from "./editors/InteractiveDemoEditor";
import DragDropEditor from "./editors/DragDropEditor";
import FillBlanksEditor from "./editors/FillBlanksEditor";
import InteractiveCodingEditor from "./editors/InteractiveCodingEditor";
import CodeBuilderEditor from "./editors/CodeBuilderEditor";
import ClassBuilderEditor from "./editors/ClassBuilderEditor";
import MemoryGameEditor from "./editors/MemoryGameEditor";
import QuizEditor from "./editors/QuizEditor";

interface VisualActivityEditorProps {
  activityType: string;
  initialContent: any;
  onChange: (content: any) => void;
  onJsonChange: (json: string) => void;
}

const activityTypeConfig = {
  algorithm_visualization: {
    name: "Algorithm Visualization",
    icon: "🔄",
    color: "from-purple-500 to-violet-600",
    editor: AlgorithmVisualizationEditor,
  },
  matching: {
    name: "Matching",
    icon: "🔗",
    color: "from-blue-500 to-cyan-600",
    editor: MatchingEditor,
  },
  data_exploration: {
    name: "Data Explorer",
    icon: "🔍",
    color: "from-green-500 to-emerald-600",
    editor: DataExplorationEditor,
  },
  interactive_demo: {
    name: "Interactive Demo",
    icon: "🎪",
    color: "from-orange-500 to-red-600",
    editor: InteractiveDemoEditor,
  },
  drag_drop: {
    name: "Drag & Drop",
    icon: "🎯",
    color: "from-indigo-500 to-blue-600",
    editor: DragDropEditor,
  },
  fill_blanks: {
    name: "Fill Blanks",
    icon: "✏️",
    color: "from-yellow-500 to-orange-600",
    editor: FillBlanksEditor,
  },
  interactive_coding: {
    name: "Code Lab",
    icon: "💻",
    color: "from-cyan-500 to-blue-600",
    editor: InteractiveCodingEditor,
  },
  code_builder: {
    name: "Code Builder",
    icon: "🏗️",
    color: "from-teal-500 to-green-600",
    editor: CodeBuilderEditor,
  },
  class_builder: {
    name: "Class Builder",
    icon: "🏛️",
    color: "from-purple-500 to-pink-600",
    editor: ClassBuilderEditor,
  },
  memory_game: {
    name: "Memory Game",
    icon: "🧠",
    color: "from-pink-500 to-rose-600",
    editor: MemoryGameEditor,
  },
  quiz: {
    name: "Quiz",
    icon: "❓",
    color: "from-emerald-500 to-teal-600",
    editor: QuizEditor,
  },
};

export default function VisualActivityEditor({
  activityType,
  initialContent,
  onChange,
  onJsonChange,
}: VisualActivityEditorProps) {
  const [content, setContent] = useState(initialContent || {});
  const [showJsonView, setShowJsonView] = useState(false);
  const [jsonString, setJsonString] = useState(
    JSON.stringify(initialContent || {}, null, 2)
  );
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setContent(initialContent || {});
    setJsonString(JSON.stringify(initialContent || {}, null, 2));
  }, [initialContent]);

  useEffect(() => {
    if (!showJsonView) {
      setJsonString(JSON.stringify(content, null, 2));
      onJsonChange(JSON.stringify(content, null, 2));
    }
  }, [content, showJsonView, onJsonChange]);

  const handleContentChange = (newContent: any) => {
    setContent(newContent);
    onChange(newContent);
    if (!showJsonView) {
      setJsonString(JSON.stringify(newContent, null, 2));
      onJsonChange(JSON.stringify(newContent, null, 2));
    }
  };

  const handleJsonChange = (newJson: string) => {
    setJsonString(newJson);
    try {
      const parsed = JSON.parse(newJson);
      setJsonError(null);
      setContent(parsed);
      onChange(parsed);
      onJsonChange(newJson);
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : "Invalid JSON");
    }
  };

  const validateContent = () => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  };

  const handleValidation = (valid: boolean) => {
    setIsValid(valid);
  };

  const typeConfig =
    activityTypeConfig[activityType as keyof typeof activityTypeConfig];
  const EditorComponent = typeConfig?.editor;

  if (!typeConfig || !EditorComponent) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800">
            No visual editor available for activity type: {activityType}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center space-x-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r ${typeConfig.color} text-white shadow-md`}
          >
            <span className="text-lg">{typeConfig.icon}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{typeConfig.name}</h3>
            <p className="text-sm text-gray-600">Visual Content Editor</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Validation Status */}
          <div className="flex items-center space-x-1">
            {isValid ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span
              className={`text-sm font-medium ${
                isValid ? "text-green-600" : "text-red-600"
              }`}
            >
              {isValid ? "Valid" : "Invalid"}
            </span>
          </div>

          {/* View Toggle */}
          <button
            onClick={() => setShowJsonView(!showJsonView)}
            className="flex items-center space-x-2 rounded-lg bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            {showJsonView ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span>{showJsonView ? "Visual Editor" : "JSON View"}</span>
          </button>
        </div>
      </div>

      {/* Editor Content */}
      {showJsonView ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">JSON Editor</h4>
            <button
              onClick={() => handleJsonChange(jsonString)}
              className="flex items-center space-x-1 rounded-lg bg-indigo-100 px-3 py-2 text-sm text-indigo-700 transition-colors hover:bg-indigo-200"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Validate</span>
            </button>
          </div>

          {jsonError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-800">{jsonError}</p>
              </div>
            </div>
          )}

          <textarea
            value={jsonString}
            onChange={(e) => handleJsonChange(e.target.value)}
            rows={20}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 font-mono text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            placeholder="Enter activity content JSON..."
          />
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <EditorComponent
            content={content}
            onChange={handleContentChange}
            onValidation={handleValidation}
          />
        </div>
      )}

      {/* Footer Info */}
      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex items-start space-x-2">
          <Code className="mt-0.5 h-5 w-5 text-blue-600" />
          <div>
            <h4 className="font-semibold text-blue-900">Editor Features</h4>
            <ul className="mt-1 list-inside list-disc space-y-1 text-sm text-blue-800">
              <li>Visual form-based editing with validation</li>
              <li>Real-time JSON generation and preview</li>
              <li>Switch between visual and JSON modes</li>
              <li>Activity-specific field validation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
