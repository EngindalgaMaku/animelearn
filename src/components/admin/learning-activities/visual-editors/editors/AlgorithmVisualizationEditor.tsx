"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Play,
  Code,
  CheckCircle,
  AlertTriangle,
  Settings,
  Eye,
} from "lucide-react";

interface AlgorithmStep {
  id: number;
  title: string;
  description: string;
  code: string;
  visualization: string;
}

interface AlgorithmVisualizationContent {
  steps: AlgorithmStep[];
  visualizations: string[];
  algorithm: string;
  complexity?: {
    time?: string;
    space?: string;
  };
  settings?: {
    showCode?: boolean;
    autoPlay?: boolean;
    stepDelay?: number;
  };
}

interface AlgorithmVisualizationEditorProps {
  content: AlgorithmVisualizationContent;
  onChange: (content: AlgorithmVisualizationContent) => void;
  onValidation: (isValid: boolean) => void;
}

export default function AlgorithmVisualizationEditor({
  content,
  onChange,
  onValidation,
}: AlgorithmVisualizationEditorProps) {
  const [algoData, setAlgoData] = useState<AlgorithmVisualizationContent>(
    () => {
      const defaultData: AlgorithmVisualizationContent = {
        steps: [],
        visualizations: [],
        algorithm: "",
        complexity: {
          time: "",
          space: "",
        },
        settings: {
          showCode: true,
          autoPlay: false,
          stepDelay: 1000,
        },
      };

      return {
        ...defaultData,
        ...content,
        complexity: { ...defaultData.complexity, ...content.complexity },
        settings: { ...defaultData.settings, ...content.settings },
      };
    }
  );

  useEffect(() => {
    setAlgoData((prevData) => ({
      ...prevData,
      ...content,
      complexity: { ...prevData.complexity, ...content.complexity },
      settings: { ...prevData.settings, ...content.settings },
    }));
  }, [content]);

  useEffect(() => {
    const isValid = validateAlgorithm();
    onValidation(isValid);
    onChange(algoData);
  }, [algoData]);

  const validateAlgorithm = (): boolean => {
    if (!algoData.algorithm.trim()) return false;
    if (algoData.steps.length === 0) return false;

    return algoData.steps.every(
      (step) => step.title.trim() !== "" && step.description.trim() !== ""
    );
  };

  const updateField = (
    field: keyof AlgorithmVisualizationContent,
    value: any
  ) => {
    setAlgoData({ ...algoData, [field]: value });
  };

  const updateComplexity = (field: string, value: string) => {
    setAlgoData({
      ...algoData,
      complexity: { ...algoData.complexity, [field]: value },
    });
  };

  const updateSettings = (field: string, value: any) => {
    setAlgoData({
      ...algoData,
      settings: { ...algoData.settings, [field]: value },
    });
  };

  const addStep = () => {
    const newStep: AlgorithmStep = {
      id: Date.now(),
      title: "",
      description: "",
      code: "",
      visualization: "",
    };

    setAlgoData({
      ...algoData,
      steps: [...algoData.steps, newStep],
    });
  };

  const updateStep = (
    index: number,
    field: keyof AlgorithmStep,
    value: any
  ) => {
    const updatedSteps = [...algoData.steps];
    updatedSteps[index] = { ...updatedSteps[index], [field]: value };
    setAlgoData({ ...algoData, steps: updatedSteps });
  };

  const deleteStep = (index: number) => {
    const updatedSteps = algoData.steps.filter((_, i) => i !== index);
    setAlgoData({ ...algoData, steps: updatedSteps });
  };

  const updateVisualizations = (visualizations: string) => {
    const vizArray = visualizations
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v);
    setAlgoData({ ...algoData, visualizations: vizArray });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Algorithm Visualization
          </h3>
          <p className="text-sm text-gray-600">
            Create step-by-step algorithm learning with visual components
          </p>
        </div>
      </div>

      {/* Basic Information */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-900">
          Algorithm Information
        </h4>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Algorithm Name *
            </label>
            <input
              type="text"
              value={algoData.algorithm}
              onChange={(e) => updateField("algorithm", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              placeholder="e.g., Bubble Sort, Binary Search, Quick Sort"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Time Complexity
              </label>
              <input
                type="text"
                value={algoData.complexity?.time || ""}
                onChange={(e) => updateComplexity("time", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                placeholder="e.g., O(n²), O(log n)"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Space Complexity
              </label>
              <input
                type="text"
                value={algoData.complexity?.space || ""}
                onChange={(e) => updateComplexity("space", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                placeholder="e.g., O(1), O(n)"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Available Visualizations (comma-separated)
            </label>
            <input
              type="text"
              value={algoData.visualizations.join(", ")}
              onChange={(e) => updateVisualizations(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              placeholder="e.g., array_display, comparison_highlight, step_by_step"
            />
          </div>
        </div>
      </div>

      {/* Algorithm Steps */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">
            Algorithm Steps
          </h4>
          <button
            onClick={addStep}
            className="flex items-center space-x-2 rounded-lg bg-purple-100 px-3 py-2 text-purple-700 transition-colors hover:bg-purple-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Step</span>
          </button>
        </div>

        <div className="space-y-4">
          {algoData.steps.map((step, index) => (
            <div
              key={step.id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h5 className="font-semibold text-gray-900">
                  Step {index + 1}
                </h5>
                <button
                  onClick={() => deleteStep(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Step Title *
                  </label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateStep(index, "title", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    placeholder="e.g., Initialize Array, Compare Adjacent Elements"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    value={step.description}
                    onChange={(e) =>
                      updateStep(index, "description", e.target.value)
                    }
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Describe what happens in this step..."
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Code Example
                    </label>
                    <textarea
                      value={step.code}
                      onChange={(e) =>
                        updateStep(index, "code", e.target.value)
                      }
                      rows={4}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      placeholder="# Code for this step..."
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Visualization Type
                    </label>
                    <select
                      value={step.visualization}
                      onChange={(e) =>
                        updateStep(index, "visualization", e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    >
                      <option value="">Select visualization...</option>
                      {algoData.visualizations.map((viz) => (
                        <option key={viz} value={viz}>
                          {viz
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {algoData.steps.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <Play className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No algorithm steps yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Add steps to break down the algorithm execution.
              </p>
              <button
                onClick={addStep}
                className="mt-4 inline-flex items-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
              >
                <Plus className="h-4 w-4" />
                <span>Add Step</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Visualization Settings */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h4 className="mb-4 flex items-center space-x-2 text-lg font-semibold text-gray-900">
          <Settings className="h-5 w-5" />
          <span>Visualization Settings</span>
        </h4>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Step Delay (milliseconds)
            </label>
            <input
              type="number"
              value={algoData.settings?.stepDelay || 1000}
              onChange={(e) =>
                updateSettings("stepDelay", parseInt(e.target.value))
              }
              min="100"
              max="5000"
              step="100"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showCode"
                checked={algoData.settings?.showCode ?? true}
                onChange={(e) => updateSettings("showCode", e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="showCode" className="ml-2 text-sm text-gray-700">
                Show code examples in steps
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoPlay"
                checked={algoData.settings?.autoPlay ?? false}
                onChange={(e) => updateSettings("autoPlay", e.target.checked)}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="autoPlay" className="ml-2 text-sm text-gray-700">
                Auto-play visualization on start
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h4 className="mb-4 flex items-center space-x-2 text-lg font-semibold text-gray-900">
          <Eye className="h-5 w-5" />
          <span>Preview</span>
        </h4>

        <div className="rounded-lg bg-purple-50 p-4">
          <div className="mb-3">
            <h5 className="font-semibold text-purple-900">
              {algoData.algorithm || "Algorithm Name"}
            </h5>
            {(algoData.complexity?.time || algoData.complexity?.space) && (
              <p className="text-sm text-purple-700">
                {algoData.complexity?.time &&
                  `Time: ${algoData.complexity.time}`}
                {algoData.complexity?.time &&
                  algoData.complexity?.space &&
                  " | "}
                {algoData.complexity?.space &&
                  `Space: ${algoData.complexity.space}`}
              </p>
            )}
          </div>

          {algoData.steps.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-purple-800">
                Algorithm Steps:
              </p>
              <ol className="list-inside list-decimal space-y-1">
                {algoData.steps.map((step, index) => (
                  <li key={step.id} className="text-sm text-purple-700">
                    <span className="font-medium">
                      {step.title || `Step ${index + 1}`}
                    </span>
                    {step.description && (
                      <span className="text-purple-600">
                        {" "}
                        - {step.description}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {algoData.visualizations.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-purple-800">
                Available Visualizations:
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {algoData.visualizations.map((viz) => (
                  <span
                    key={viz}
                    className="inline-block rounded-full bg-purple-200 px-2 py-1 text-xs text-purple-800"
                  >
                    {viz.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Validation Status */}
      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex items-center space-x-2">
          {validateAlgorithm() ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          )}
          <p className="text-sm text-blue-800">
            {validateAlgorithm()
              ? `Algorithm visualization is valid with ${algoData.steps.length} steps`
              : "Please provide an algorithm name and at least one step with title and description"}
          </p>
        </div>
      </div>
    </div>
  );
}
