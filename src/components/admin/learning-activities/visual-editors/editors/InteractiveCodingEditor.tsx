"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Code,
  Play,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Target,
  Settings,
} from "lucide-react";

interface TestCase {
  id: number;
  input: string;
  expected: string;
  description?: string;
}

interface InteractiveCodingContent {
  problem: string;
  requirements: string[];
  starterCode: string;
  solution?: string;
  testCases: TestCase[];
  hints: string[];
  language?: string;
  difficulty?: string;
  timeLimit?: number;
  allowedAttempts?: number;
  showSolution?: boolean;
}

interface InteractiveCodingEditorProps {
  content: InteractiveCodingContent;
  onChange: (content: InteractiveCodingContent) => void;
  onValidation: (isValid: boolean) => void;
}

export default function InteractiveCodingEditor({
  content,
  onChange,
  onValidation,
}: InteractiveCodingEditorProps) {
  const [codingData, setCodingData] = useState<InteractiveCodingContent>(() => {
    const defaultData: InteractiveCodingContent = {
      problem: "",
      requirements: [],
      starterCode: "",
      solution: "",
      testCases: [],
      hints: [],
      language: "python",
      difficulty: "medium",
      timeLimit: 1800, // 30 minutes
      allowedAttempts: 0, // unlimited
      showSolution: false,
    };

    return {
      ...defaultData,
      ...content,
    };
  });

  useEffect(() => {
    setCodingData((prevData) => ({
      ...prevData,
      ...content,
    }));
  }, [content]);

  useEffect(() => {
    const isValid = validateCoding();
    onValidation(isValid);
    onChange(codingData);
  }, [codingData]);

  const validateCoding = (): boolean => {
    if (!codingData.problem.trim()) return false;
    if (codingData.requirements.length === 0) return false;
    if (!codingData.starterCode.trim()) return false;
    if (codingData.testCases.length === 0) return false;

    return codingData.testCases.every(
      (test) => test.input.trim() !== "" && test.expected.trim() !== ""
    );
  };

  const updateField = (field: keyof InteractiveCodingContent, value: any) => {
    setCodingData({ ...codingData, [field]: value });
  };

  const addRequirement = () => {
    setCodingData({
      ...codingData,
      requirements: [...codingData.requirements, ""],
    });
  };

  const updateRequirement = (index: number, value: string) => {
    const updatedRequirements = [...codingData.requirements];
    updatedRequirements[index] = value;
    setCodingData({ ...codingData, requirements: updatedRequirements });
  };

  const deleteRequirement = (index: number) => {
    const updatedRequirements = codingData.requirements.filter(
      (_, i) => i !== index
    );
    setCodingData({ ...codingData, requirements: updatedRequirements });
  };

  const addTestCase = () => {
    const newTestCase: TestCase = {
      id: Date.now(),
      input: "",
      expected: "",
      description: "",
    };

    setCodingData({
      ...codingData,
      testCases: [...codingData.testCases, newTestCase],
    });
  };

  const updateTestCase = (index: number, field: keyof TestCase, value: any) => {
    const updatedTestCases = [...codingData.testCases];
    updatedTestCases[index] = { ...updatedTestCases[index], [field]: value };
    setCodingData({ ...codingData, testCases: updatedTestCases });
  };

  const deleteTestCase = (index: number) => {
    const updatedTestCases = codingData.testCases.filter((_, i) => i !== index);
    setCodingData({ ...codingData, testCases: updatedTestCases });
  };

  const addHint = () => {
    setCodingData({
      ...codingData,
      hints: [...codingData.hints, ""],
    });
  };

  const updateHint = (index: number, value: string) => {
    const updatedHints = [...codingData.hints];
    updatedHints[index] = value;
    setCodingData({ ...codingData, hints: updatedHints });
  };

  const deleteHint = (index: number) => {
    const updatedHints = codingData.hints.filter((_, i) => i !== index);
    setCodingData({ ...codingData, hints: updatedHints });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Interactive Coding Challenge
          </h3>
          <p className="text-sm text-gray-600">
            Create a hands-on coding exercise with test cases and validation
          </p>
        </div>
      </div>

      {/* Problem Description */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-900">
          Problem Description
        </h4>
        <textarea
          value={codingData.problem}
          onChange={(e) => updateField("problem", e.target.value)}
          rows={5}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
          placeholder="Describe the coding problem that students need to solve..."
        />
      </div>

      {/* Requirements */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Requirements</h4>
          <button
            onClick={addRequirement}
            className="flex items-center space-x-2 rounded-lg bg-cyan-100 px-3 py-2 text-cyan-700 transition-colors hover:bg-cyan-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Requirement</span>
          </button>
        </div>

        <div className="space-y-3">
          {codingData.requirements.map((requirement, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Target className="h-4 w-4 text-cyan-600" />
              <input
                type="text"
                value={requirement}
                onChange={(e) => updateRequirement(index, e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="Enter a requirement..."
              />
              <button
                onClick={() => deleteRequirement(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {codingData.requirements.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center">
              <p className="text-sm text-gray-500">No requirements added yet</p>
              <button
                onClick={addRequirement}
                className="mt-2 text-sm text-cyan-600 hover:text-cyan-800"
              >
                Add your first requirement
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Code Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Starter Code */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h4 className="mb-4 text-lg font-semibold text-gray-900">
            Starter Code
          </h4>
          <textarea
            value={codingData.starterCode}
            onChange={(e) => updateField("starterCode", e.target.value)}
            rows={12}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            placeholder="# Enter the starter code that students will see..."
          />
        </div>

        {/* Solution Code */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h4 className="mb-4 text-lg font-semibold text-gray-900">
            Solution Code (Optional)
          </h4>
          <textarea
            value={codingData.solution || ""}
            onChange={(e) => updateField("solution", e.target.value)}
            rows={12}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            placeholder="# Enter the complete solution..."
          />
        </div>
      </div>

      {/* Test Cases */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Test Cases</h4>
          <button
            onClick={addTestCase}
            className="flex items-center space-x-2 rounded-lg bg-cyan-100 px-3 py-2 text-cyan-700 transition-colors hover:bg-cyan-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Test Case</span>
          </button>
        </div>

        <div className="space-y-4">
          {codingData.testCases.map((testCase, index) => (
            <div
              key={testCase.id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h5 className="font-semibold text-gray-900">
                  Test Case {index + 1}
                </h5>
                <button
                  onClick={() => deleteTestCase(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Input
                  </label>
                  <textarea
                    value={testCase.input}
                    onChange={(e) =>
                      updateTestCase(index, "input", e.target.value)
                    }
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="Input values for this test case..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Expected Output
                  </label>
                  <textarea
                    value={testCase.expected}
                    onChange={(e) =>
                      updateTestCase(index, "expected", e.target.value)
                    }
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="Expected output for this test case..."
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={testCase.description || ""}
                  onChange={(e) =>
                    updateTestCase(index, "description", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Describe what this test case validates..."
                />
              </div>
            </div>
          ))}

          {codingData.testCases.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <Play className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No test cases yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Add test cases to validate student solutions.
              </p>
              <button
                onClick={addTestCase}
                className="mt-4 inline-flex items-center space-x-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm text-white hover:bg-cyan-700"
              >
                <Plus className="h-4 w-4" />
                <span>Add Test Case</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hints */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Hints</h4>
          <button
            onClick={addHint}
            className="flex items-center space-x-2 rounded-lg bg-cyan-100 px-3 py-2 text-cyan-700 transition-colors hover:bg-cyan-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Hint</span>
          </button>
        </div>

        <div className="space-y-3">
          {codingData.hints.map((hint, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <input
                type="text"
                value={hint}
                onChange={(e) => updateHint(index, e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="Enter a helpful hint..."
              />
              <button
                onClick={() => deleteHint(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h4 className="mb-4 flex items-center space-x-2 text-lg font-semibold text-gray-900">
          <Settings className="h-5 w-5" />
          <span>Activity Settings</span>
        </h4>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Programming Language
            </label>
            <select
              value={codingData.language || "python"}
              onChange={(e) => updateField("language", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="csharp">C#</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Difficulty Level
            </label>
            <select
              value={codingData.difficulty || "medium"}
              onChange={(e) => updateField("difficulty", e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Time Limit (seconds)
            </label>
            <input
              type="number"
              value={codingData.timeLimit || 1800}
              onChange={(e) =>
                updateField("timeLimit", parseInt(e.target.value))
              }
              min="300"
              max="7200"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Allowed Attempts (0 = unlimited)
            </label>
            <input
              type="number"
              value={codingData.allowedAttempts || 0}
              onChange={(e) =>
                updateField("allowedAttempts", parseInt(e.target.value))
              }
              min="0"
              max="10"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showSolution"
              checked={codingData.showSolution ?? false}
              onChange={(e) => updateField("showSolution", e.target.checked)}
              className="h-4 w-4 text-cyan-600 focus:ring-cyan-500"
            />
            <label htmlFor="showSolution" className="text-sm text-gray-700">
              Show solution after completion
            </label>
          </div>
        </div>
      </div>

      {/* Validation Status */}
      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex items-center space-x-2">
          {validateCoding() ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          )}
          <p className="text-sm text-blue-800">
            {validateCoding()
              ? `Coding challenge is valid with ${codingData.testCases.length} test cases`
              : "Please complete all required fields: problem description, requirements, starter code, and at least one test case"}
          </p>
        </div>
      </div>
    </div>
  );
}
