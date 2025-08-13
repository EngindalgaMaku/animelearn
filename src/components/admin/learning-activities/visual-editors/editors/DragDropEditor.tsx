"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Target,
  Code,
  CheckCircle,
  AlertTriangle,
  Settings,
} from "lucide-react";

interface CodeBlock {
  id: number;
  code: string;
  type: string;
  order: number;
  isCorrect?: boolean;
}

interface TargetArea {
  id: string;
  label: string;
  accepts: string[];
  maxItems?: number;
}

interface DragDropContent {
  codeBlocks: CodeBlock[];
  targetAreas: TargetArea[];
  correctOrder: number[];
  instructions: string;
  feedback: {
    correct?: string;
    incorrect?: string;
    hints?: string[];
  };
  allowPartialCredit?: boolean;
  showTargetLabels?: boolean;
}

interface DragDropEditorProps {
  content: DragDropContent;
  onChange: (content: DragDropContent) => void;
  onValidation: (isValid: boolean) => void;
}

export default function DragDropEditor({
  content,
  onChange,
  onValidation,
}: DragDropEditorProps) {
  const [dragDropData, setDragDropData] = useState<DragDropContent>(() => {
    const defaultData: DragDropContent = {
      codeBlocks: [],
      targetAreas: [],
      correctOrder: [],
      instructions:
        "Drag the code blocks to the correct areas to build a working program.",
      feedback: {
        correct: "Excellent! You've arranged the code correctly.",
        incorrect: "Not quite right. Check the order and try again.",
        hints: [],
      },
      allowPartialCredit: true,
      showTargetLabels: true,
    };

    return {
      ...defaultData,
      ...content,
      feedback: { ...defaultData.feedback, ...content.feedback },
    };
  });

  useEffect(() => {
    setDragDropData((prevData) => ({
      ...prevData,
      ...content,
      feedback: { ...prevData.feedback, ...content.feedback },
    }));
  }, [content]);

  useEffect(() => {
    const isValid = validateDragDrop();
    onValidation(isValid);
    onChange(dragDropData);
  }, [dragDropData]);

  const validateDragDrop = (): boolean => {
    if (!dragDropData.instructions.trim()) return false;
    if (dragDropData.codeBlocks.length < 2) return false;
    if (dragDropData.targetAreas.length < 1) return false;
    if (dragDropData.correctOrder.length !== dragDropData.codeBlocks.length)
      return false;

    return (
      dragDropData.codeBlocks.every(
        (block) => block.code.trim() !== "" && block.type.trim() !== ""
      ) &&
      dragDropData.targetAreas.every(
        (area) => area.label.trim() !== "" && area.accepts.length > 0
      )
    );
  };

  const updateField = (field: keyof DragDropContent, value: any) => {
    setDragDropData({ ...dragDropData, [field]: value });
  };

  const addCodeBlock = () => {
    const newBlock: CodeBlock = {
      id: Date.now(),
      code: "",
      type: "",
      order: dragDropData.codeBlocks.length + 1,
    };

    setDragDropData({
      ...dragDropData,
      codeBlocks: [...dragDropData.codeBlocks, newBlock],
      correctOrder: [...dragDropData.correctOrder, newBlock.order],
    });
  };

  const updateCodeBlock = (
    index: number,
    field: keyof CodeBlock,
    value: any
  ) => {
    const updatedBlocks = [...dragDropData.codeBlocks];
    updatedBlocks[index] = { ...updatedBlocks[index], [field]: value };
    setDragDropData({ ...dragDropData, codeBlocks: updatedBlocks });
  };

  const deleteCodeBlock = (index: number) => {
    const updatedBlocks = dragDropData.codeBlocks.filter((_, i) => i !== index);
    const updatedOrder = dragDropData.correctOrder.filter(
      (order) => order !== dragDropData.codeBlocks[index].order
    );

    setDragDropData({
      ...dragDropData,
      codeBlocks: updatedBlocks,
      correctOrder: updatedOrder,
    });
  };

  const addTargetArea = () => {
    const newArea: TargetArea = {
      id: `area_${Date.now()}`,
      label: "",
      accepts: [],
      maxItems: 1,
    };

    setDragDropData({
      ...dragDropData,
      targetAreas: [...dragDropData.targetAreas, newArea],
    });
  };

  const updateTargetArea = (
    index: number,
    field: keyof TargetArea,
    value: any
  ) => {
    const updatedAreas = [...dragDropData.targetAreas];
    updatedAreas[index] = { ...updatedAreas[index], [field]: value };
    setDragDropData({ ...dragDropData, targetAreas: updatedAreas });
  };

  const deleteTargetArea = (index: number) => {
    const updatedAreas = dragDropData.targetAreas.filter((_, i) => i !== index);
    setDragDropData({ ...dragDropData, targetAreas: updatedAreas });
  };

  const updateAcceptedTypes = (areaIndex: number, types: string) => {
    const typesArray = types
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    updateTargetArea(areaIndex, "accepts", typesArray);
  };

  const updateCorrectOrder = (newOrder: string) => {
    const orderArray = newOrder
      .split(",")
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n));
    setDragDropData({ ...dragDropData, correctOrder: orderArray });
  };

  const updateFeedback = (field: string, value: string) => {
    setDragDropData({
      ...dragDropData,
      feedback: { ...dragDropData.feedback, [field]: value },
    });
  };

  const addHint = () => {
    const hints = dragDropData.feedback.hints || [];
    setDragDropData({
      ...dragDropData,
      feedback: {
        ...dragDropData.feedback,
        hints: [...hints, ""],
      },
    });
  };

  const updateHint = (index: number, value: string) => {
    const hints = dragDropData.feedback.hints || [];
    const updatedHints = [...hints];
    updatedHints[index] = value;
    setDragDropData({
      ...dragDropData,
      feedback: {
        ...dragDropData.feedback,
        hints: updatedHints,
      },
    });
  };

  const deleteHint = (index: number) => {
    const hints = dragDropData.feedback.hints || [];
    const updatedHints = hints.filter((_, i) => i !== index);
    setDragDropData({
      ...dragDropData,
      feedback: {
        ...dragDropData.feedback,
        hints: updatedHints,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Drag & Drop Code Activity
          </h3>
          <p className="text-sm text-gray-600">
            Create an interactive code organization challenge
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-900">
          Instructions
        </h4>
        <textarea
          value={dragDropData.instructions}
          onChange={(e) => updateField("instructions", e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          placeholder="Enter instructions for the drag and drop activity..."
        />
      </div>

      {/* Code Blocks */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Code Blocks</h4>
          <button
            onClick={addCodeBlock}
            className="flex items-center space-x-2 rounded-lg bg-indigo-100 px-3 py-2 text-indigo-700 transition-colors hover:bg-indigo-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Code Block</span>
          </button>
        </div>

        <div className="space-y-4">
          {dragDropData.codeBlocks.map((block, index) => (
            <div
              key={block.id}
              className="flex items-center space-x-4 rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="flex cursor-move items-center text-gray-400">
                <GripVertical className="h-5 w-5" />
              </div>

              <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Code
                  </label>
                  <textarea
                    value={block.code}
                    onChange={(e) =>
                      updateCodeBlock(index, "code", e.target.value)
                    }
                    rows={2}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="Enter code block..."
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Type/Category
                  </label>
                  <input
                    type="text"
                    value={block.type}
                    onChange={(e) =>
                      updateCodeBlock(index, "type", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g., function_def, loop, condition"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <span className="text-xs text-gray-500">Order</span>
                <input
                  type="number"
                  value={block.order}
                  onChange={(e) =>
                    updateCodeBlock(index, "order", parseInt(e.target.value))
                  }
                  className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-center focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  min="1"
                />
              </div>

              <button
                onClick={() => deleteCodeBlock(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {dragDropData.codeBlocks.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <Code className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                No code blocks yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Add code blocks that students will drag and arrange.
              </p>
              <button
                onClick={addCodeBlock}
                className="mt-4 inline-flex items-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                <span>Add Code Block</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Target Areas */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-semibold text-gray-900">Target Areas</h4>
          <button
            onClick={addTargetArea}
            className="flex items-center space-x-2 rounded-lg bg-indigo-100 px-3 py-2 text-indigo-700 transition-colors hover:bg-indigo-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Target Area</span>
          </button>
        </div>

        <div className="space-y-4">
          {dragDropData.targetAreas.map((area, index) => (
            <div
              key={area.id}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h5 className="font-semibold text-gray-900">
                  Target Area {index + 1}
                </h5>
                <button
                  onClick={() => deleteTargetArea(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Label
                  </label>
                  <input
                    type="text"
                    value={area.label}
                    onChange={(e) =>
                      updateTargetArea(index, "label", e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g., Function Definition"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Accepted Types (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={area.accepts.join(", ")}
                    onChange={(e) => updateAcceptedTypes(index, e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="e.g., function_def, class_def"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Max Items
                  </label>
                  <input
                    type="number"
                    value={area.maxItems || 1}
                    onChange={(e) =>
                      updateTargetArea(
                        index,
                        "maxItems",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    min="1"
                    max="10"
                  />
                </div>
              </div>
            </div>
          ))}

          {dragDropData.targetAreas.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-4 text-center">
              <Target className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-1 text-sm text-gray-500">
                No target areas defined
              </p>
              <button
                onClick={addTargetArea}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
              >
                Add your first target area
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Correct Order & Settings */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h4 className="mb-4 text-lg font-semibold text-gray-900">
            Correct Order
          </h4>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Correct Order (comma-separated block orders)
              </label>
              <input
                type="text"
                value={dragDropData.correctOrder.join(", ")}
                onChange={(e) => updateCorrectOrder(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="e.g., 1, 2, 3, 4"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter the correct order of code blocks by their order numbers
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h4 className="mb-4 flex items-center space-x-2 text-lg font-semibold text-gray-900">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </h4>

          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowPartialCredit"
                checked={dragDropData.allowPartialCredit ?? true}
                onChange={(e) =>
                  updateField("allowPartialCredit", e.target.checked)
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="allowPartialCredit"
                className="ml-2 text-sm text-gray-700"
              >
                Allow partial credit for partially correct answers
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showTargetLabels"
                checked={dragDropData.showTargetLabels ?? true}
                onChange={(e) =>
                  updateField("showTargetLabels", e.target.checked)
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="showTargetLabels"
                className="ml-2 text-sm text-gray-700"
              >
                Show target area labels to students
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback & Hints */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-900">
          Feedback & Hints
        </h4>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                <CheckCircle className="mr-1 inline h-4 w-4 text-green-600" />
                Correct Feedback
              </label>
              <input
                type="text"
                value={dragDropData.feedback?.correct || ""}
                onChange={(e) => updateFeedback("correct", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Message for correct arrangement..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                <AlertTriangle className="mr-1 inline h-4 w-4 text-red-600" />
                Incorrect Feedback
              </label>
              <input
                type="text"
                value={dragDropData.feedback?.incorrect || ""}
                onChange={(e) => updateFeedback("incorrect", e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Message for incorrect arrangement..."
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Hints</label>
              <button
                onClick={addHint}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                <Plus className="inline h-3 w-3" /> Add Hint
              </button>
            </div>

            <div className="space-y-2">
              {(dragDropData.feedback.hints || []).map((hint, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={hint}
                    onChange={(e) => updateHint(index, e.target.value)}
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
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
        </div>
      </div>

      {/* Validation Status */}
      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex items-center space-x-2">
          {validateDragDrop() ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          )}
          <p className="text-sm text-blue-800">
            {validateDragDrop()
              ? `Drag & drop activity is valid with ${dragDropData.codeBlocks.length} code blocks and ${dragDropData.targetAreas.length} target areas`
              : "Please complete all required fields: instructions, at least 2 code blocks, 1 target area, and correct order"}
          </p>
        </div>
      </div>
    </div>
  );
}
