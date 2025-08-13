"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Settings,
  Code,
} from "lucide-react";

interface Blank {
  id: number;
  answer: string;
  position: number;
  hint?: string;
  alternatives?: string[];
}

interface TestCase {
  id: number;
  input: string;
  expected: string;
}

interface FillBlanksContent {
  codeTemplate: string;
  blanks: Blank[];
  hints: string[];
  validation?: {
    checkSyntax?: boolean;
    runTests?: boolean;
    testCases?: TestCase[];
  };
  language?: string;
  showHints?: boolean;
  allowPartialCredit?: boolean;
  feedback?: {
    correct?: string;
    incorrect?: string;
    completed?: string;
  };
}

interface FillBlanksEditorProps {
  content: FillBlanksContent;
  onChange: (content: FillBlanksContent) => void;
  onValidation: (isValid: boolean) => void;
}

export default function FillBlanksEditor({
  content,
  onChange,
  onValidation,
}: FillBlanksEditorProps) {
  const [fillBlanksData, setFillBlanksData] = useState<FillBlanksContent>(
    () => {
      const defaultData: FillBlanksContent = {
        codeTemplate: "",
        blanks: [],
        hints: [],
        validation: {
          checkSyntax: true,
          runTests: false,
          testCases: [],
        },
        language: "python",
        showHints: true,
        allowPartialCredit: true,
        feedback: {
          correct: "Correct! Well done.",
          incorrect: "Not quite right. Check your answer and try again.",
          completed: "Excellent! You've completed all the blanks correctly.",
        },
      };

      return {
        ...defaultData,
        ...content,
        validation: { ...defaultData.validation, ...content.validation },
        feedback: { ...defaultData.feedback, ...content.feedback },
      };
    }
  );

  useEffect(() => {
    setFillBlanksData((prevData) => ({
      ...prevData,
      ...content,
      validation: { ...prevData.validation, ...content.validation },
      feedback: { ...prevData.feedback, ...content.feedback },
    }));
  }, [content]);

  useEffect(() => {
    const isValid = validateFillBlanks();
    onValidation(isValid);
    onChange(fillBlanksData);
  }, [fillBlanksData]);

  const validateFillBlanks = (): boolean => {
    if (!fillBlanksData.codeTemplate.trim()) return false;
    if (fillBlanksData.blanks.length === 0) return false;

    // Check if template contains blank placeholders
    const blankCount = (fillBlanksData.codeTemplate.match(/_+/g) || []).length;
    if (blankCount !== fillBlanksData.blanks.length) return false;

    return fillBlanksData.blanks.every((blank) => blank.answer.trim() !== "");
  };

  const updateField = (field: keyof FillBlanksContent, value: any) => {
    setFillBlanksData({ ...fillBlanksData, [field]: value });
  };

  const updateValidation = (field: string, value: any) => {
    setFillBlanksData({
      ...fillBlanksData,
      validation: { ...fillBlanksData.validation, [field]: value },
    });
  };

  const updateFeedback = (field: string, value: string) => {
    setFillBlanksData({
      ...fillBlanksData,
      feedback: { ...fillBlanksData.feedback, [field]: value },
    });
  };

  const addBlank = () => {
    const newBlank: Blank = {
      id: Date.now(),
      answer: "",
      position: fillBlanksData.blanks.length,
      hint: "",
      alternatives: [],
    };

    setFillBlanksData({
      ...fillBlanksData,
      blanks: [...fillBlanksData.blanks, newBlank],
    });
  };

  const updateBlank = (index: number, field: keyof Blank, value: any) => {
    const updatedBlanks = [...fillBlanksData.blanks];
    updatedBlanks[index] = { ...updatedBlanks[index], [field]: value };
    setFillBlanksData({ ...fillBlanksData, blanks: updatedBlanks });
  };

  const deleteBlank = (index: number) => {
    const updatedBlanks = fillBlanksData.blanks.filter((_, i) => i !== index);
    setFillBlanksData({ ...fillBlanksData, blanks: updatedBlanks });
  };

  const updateAlternatives = (blankIndex: number, alternatives: string) => {
    const altArray = alternatives
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a);
    updateBlank(blankIndex, "alternatives", altArray);
  };

  const addTestCase = () => {
    const newTestCase: TestCase = {
      id: Date.now(),
      input: "",
      expected: "",
    };

    const testCases = fillBlanksData.validation?.testCases || [];
    updateValidation("testCases", [...testCases, newTestCase]);
  };

  const updateTestCase = (
    index: number,
    field: keyof TestCase,
    value: string
  ) => {
    const testCases = fillBlanksData.validation?.testCases || [];
    const updatedTestCases = [...testCases];
    updatedTestCases[index] = { ...updatedTestCases[index], [field]: value };
    updateValidation("testCases", updatedTestCases);
  };

  const deleteTestCase = (index: number) => {
    const testCases = fillBlanksData.validation?.testCases || [];
    const updatedTestCases = testCases.filter((_, i) => i !== index);
    updateValidation("testCases", updatedTestCases);
  };

  const addHint = () => {
    setFillBlanksData({
      ...fillBlanksData,
      hints: [...fillBlanksData.hints, ""],
    });
  };

  const updateHint = (index: number, value: string) => {
    const updatedHints = [...fillBlanksData.hints];
    updatedHints[index] = value;
    setFillBlanksData({ ...fillBlanksData, hints: updatedHints });
  };

  const deleteHint = (index: number) => {
    const updatedHints = fillBlanksData.hints.filter((_, i) => i !== index);
    setFillBlanksData({ ...fillBlanksData, hints: updatedHints });
  };

  const generateBlanksFromTemplate = () => {
    const template = fillBlanksData.codeTemplate;
    const blanks = (template.match(/_+/g) || []).map((match, index) => ({
      id: Date.now() + index,
      answer: "",
      position: index,
      hint: "",
      alternatives: [],
    }));

    setFillBlanksData({ ...fillBlanksData, blanks });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Fill in the Blanks
          </h3>
          <p className="text-sm text-gray-600">
            Create code completion exercises with missing parts
          </p>
        </div>
      </div>

      {/* Code Template */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Code Template</h4>
          <button
            onClick={generateBlanksFromTemplate}
            className="flex items-center space-x-2 rounded-lg bg-yellow-100 px-3 py-2 text-yellow-700 transition-colors hover:bg-yellow-200"
          >
            <Edit3 className="h-4 w-4" />
            <span>Generate Blanks</span>
          </button>
        </div>

        <textarea
          value={fillBlanksData.codeTemplate}
          onChange={(e) => updateField("codeTemplate", e.target.value)}
          rows={12}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
          placeholder="Enter your code template with blanks marked as underscores (_____).&#10;&#10;Example:&#10;def _____(x, y):&#10;    return x _____ y&#10;&#10;result = _____(5, 3)&#10;print(result)"
        />

        <div className="mt-2 rounded-lg bg-yellow-50 p-3">
          <p className="text-sm text-yellow-800">
            💡 Tip: Use underscores (___) to mark blanks in your code. Each
            blank should be a separate group of underscores.
          </p>
        </div>
      </div>

      {/* Blanks Configuration */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Blank Answers</h4>
          <button
            onClick={addBlank}
            className="flex items-center space-x-2 rounded-lg bg-yellow-100 px-3 py-2 text-yellow-700 transition-colors hover:bg-yellow-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Blank</span>
          </button>
        </div>

        <div className="space-y-4">
          {fillBlanksData.blanks.map((blank, index) => (
            <div
              key={blank.id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h5 className="font-semibold text-gray-900">
                  Blank {index + 1}
                </h5>
                <button
                  onClick={() => deleteBlank(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Correct Answer *
                  </label>
                  <input
                    type="text"
                    value={blank.answer}
                    onChange={(e) =>
                      updateBlank(index, "answer", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                    placeholder="Enter the correct answer..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Hint (optional)
                  </label>
                  <input
                    type="text"
                    value={blank.hint || ""}
                    onChange={(e) => updateBlank(index, "hint", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                    placeholder="Provide a helpful hint..."
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Alternative Answers (comma-separated, optional)
                </label>
                <input
                  type="text"
                  value={(blank.alternatives || []).join(", ")}
                  onChange={(e) => updateAlternatives(index, e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                  placeholder="e.g., add, +, plus"
                />
              </div>
            </div>
          ))}

          {fillBlanksData.blanks.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <Edit3 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No blanks configured yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Add your code template first, then generate or add blanks
                manually.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* General Hints */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">General Hints</h4>
          <button
            onClick={addHint}
            className="flex items-center space-x-2 rounded-lg bg-yellow-100 px-3 py-2 text-yellow-700 transition-colors hover:bg-yellow-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Hint</span>
          </button>
        </div>

        <div className="space-y-3">
          {fillBlanksData.hints.map((hint, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <input
                type="text"
                value={hint}
                onChange={(e) => updateHint(index, e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                placeholder="Enter a general hint..."
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

      {/* Validation & Testing */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-900">
          Validation & Testing
        </h4>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="checkSyntax"
                checked={fillBlanksData.validation?.checkSyntax ?? true}
                onChange={(e) =>
                  updateValidation("checkSyntax", e.target.checked)
                }
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
              />
              <label
                htmlFor="checkSyntax"
                className="ml-2 text-sm text-gray-700"
              >
                Check syntax after completion
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="runTests"
                checked={fillBlanksData.validation?.runTests ?? false}
                onChange={(e) => updateValidation("runTests", e.target.checked)}
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
              />
              <label htmlFor="runTests" className="ml-2 text-sm text-gray-700">
                Run test cases for validation
              </label>
            </div>
          </div>

          {fillBlanksData.validation?.runTests && (
            <div className="mt-4">
              <div className="mb-3 flex items-center justify-between">
                <h5 className="font-semibold text-gray-900">Test Cases</h5>
                <button
                  onClick={addTestCase}
                  className="text-sm text-yellow-600 hover:text-yellow-800"
                >
                  <Plus className="inline h-3 w-3" /> Add Test Case
                </button>
              </div>

              <div className="space-y-3">
                {(fillBlanksData.validation?.testCases || []).map(
                  (testCase, index) => (
                    <div
                      key={testCase.id}
                      className="grid grid-cols-1 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 md:grid-cols-3"
                    >
                      <div>
                        <input
                          type="text"
                          value={testCase.input}
                          onChange={(e) =>
                            updateTestCase(index, "input", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20"
                          placeholder="Input"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={testCase.expected}
                          onChange={(e) =>
                            updateTestCase(index, "expected", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20"
                          placeholder="Expected output"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => deleteTestCase(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Settings & Feedback */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h4 className="mb-4 flex items-center space-x-2 text-lg font-semibold text-gray-900">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </h4>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Programming Language
              </label>
              <select
                value={fillBlanksData.language || "python"}
                onChange={(e) => updateField("language", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showHints"
                  checked={fillBlanksData.showHints ?? true}
                  onChange={(e) => updateField("showHints", e.target.checked)}
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                />
                <label
                  htmlFor="showHints"
                  className="ml-2 text-sm text-gray-700"
                >
                  Show hints to students
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allowPartialCredit"
                  checked={fillBlanksData.allowPartialCredit ?? true}
                  onChange={(e) =>
                    updateField("allowPartialCredit", e.target.checked)
                  }
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                />
                <label
                  htmlFor="allowPartialCredit"
                  className="ml-2 text-sm text-gray-700"
                >
                  Allow partial credit for some correct answers
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h4 className="mb-4 text-lg font-semibold text-gray-900">
            Feedback Messages
          </h4>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                <CheckCircle className="mr-1 inline h-4 w-4 text-green-600" />
                Correct Answer
              </label>
              <input
                type="text"
                value={fillBlanksData.feedback?.correct || ""}
                onChange={(e) => updateFeedback("correct", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                placeholder="Message for correct answers..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                <AlertTriangle className="mr-1 inline h-4 w-4 text-red-600" />
                Incorrect Answer
              </label>
              <input
                type="text"
                value={fillBlanksData.feedback?.incorrect || ""}
                onChange={(e) => updateFeedback("incorrect", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                placeholder="Message for incorrect answers..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                <CheckCircle className="mr-1 inline h-4 w-4 text-blue-600" />
                All Completed
              </label>
              <input
                type="text"
                value={fillBlanksData.feedback?.completed || ""}
                onChange={(e) => updateFeedback("completed", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20"
                placeholder="Message when all blanks are correct..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-900">Preview</h4>

        <div className="rounded-lg bg-gray-50 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <Code className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Code Template
            </span>
          </div>
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
            {fillBlanksData.codeTemplate || "No code template added yet"}
          </pre>

          {fillBlanksData.blanks.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 text-sm font-medium text-gray-700">
                Expected Answers:
              </div>
              <div className="space-y-1">
                {fillBlanksData.blanks.map((blank, index) => (
                  <div key={blank.id} className="text-sm text-gray-600">
                    Blank {index + 1}:{" "}
                    <code className="rounded bg-white px-1">
                      {blank.answer}
                    </code>
                    {blank.hint && (
                      <span className="ml-2 text-gray-500">({blank.hint})</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Validation Status */}
      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex items-center space-x-2">
          {validateFillBlanks() ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          )}
          <p className="text-sm text-blue-800">
            {validateFillBlanks()
              ? `Fill in the blanks activity is valid with ${fillBlanksData.blanks.length} blanks`
              : "Please add a code template with blanks (___) and configure the correct answers"}
          </p>
        </div>
      </div>
    </div>
  );
}
