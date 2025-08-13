"use client";

import { useState, useEffect } from "react";
import { Plus, X, Play, BookOpen, MousePointer, Settings } from "lucide-react";

interface DemoSection {
  id: string;
  title: string;
  content: string;
  code?: string;
  interactive?: boolean;
  hint?: string;
}

interface InteractiveDemoContent {
  title?: string;
  description?: string;
  sections: DemoSection[];
  navigation: {
    showProgress?: boolean;
    allowSkip?: boolean;
    autoAdvance?: boolean;
  };
  interactiveElements: string[];
  settings?: {
    showHints?: boolean;
    allowRestart?: boolean;
    completionMessage?: string;
  };
}

interface InteractiveDemoEditorProps {
  content: InteractiveDemoContent;
  onChange: (content: InteractiveDemoContent) => void;
  onValidation: (isValid: boolean) => void;
}

export default function InteractiveDemoEditor({
  content,
  onChange,
  onValidation,
}: InteractiveDemoEditorProps) {
  const [data, setData] = useState<InteractiveDemoContent>(() => {
    const defaultData: InteractiveDemoContent = {
      title: "",
      description: "",
      sections: [
        {
          id: "1",
          title: "Introduction",
          content: "Welcome to this interactive demo",
          interactive: true,
        },
      ],
      navigation: {
        showProgress: true,
        allowSkip: false,
        autoAdvance: false,
      },
      interactiveElements: ["buttons", "forms"],
      settings: {
        showHints: true,
        allowRestart: true,
        completionMessage: "Demo completed successfully!",
      },
    };

    return { ...defaultData, ...content };
  });

  useEffect(() => {
    if (content && JSON.stringify(content) !== JSON.stringify(data)) {
      setData((prevData) => ({ ...prevData, ...content }));
    }
  }, [content]);

  useEffect(() => {
    const isValid =
      data.sections.length > 0 &&
      data.sections.every((s) => s.title && s.content);
    onValidation(isValid);
  }, [data, onValidation]);

  // Only call onChange when data changes from user interaction, not prop updates
  useEffect(() => {
    if (content && JSON.stringify(content) !== JSON.stringify(data)) {
      onChange(data);
    }
  }, [data]);

  const updateData = (updates: Partial<InteractiveDemoContent>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const addSection = () => {
    const newSection: DemoSection = {
      id: Date.now().toString(),
      title: "",
      content: "",
      interactive: false,
    };
    updateData({
      sections: [...data.sections, newSection],
    });
  };

  const updateSection = (index: number, updates: Partial<DemoSection>) => {
    const newSections = [...data.sections];
    newSections[index] = { ...newSections[index], ...updates };
    updateData({ sections: newSections });
  };

  const removeSection = (index: number) => {
    if (data.sections.length > 1) {
      updateData({
        sections: data.sections.filter((_, i) => i !== index),
      });
    }
  };

  const toggleInteractiveElement = (element: string) => {
    const newElements = data.interactiveElements.includes(element)
      ? data.interactiveElements.filter((e) => e !== element)
      : [...data.interactiveElements, element];
    updateData({ interactiveElements: newElements });
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center space-x-2">
          <Play className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Demo Information
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Demo Title
            </label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => updateData({ title: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              placeholder="e.g., Python Variables Introduction"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={data.description || ""}
              onChange={(e) => updateData({ description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              placeholder="Brief description of what this demo covers..."
            />
          </div>
        </div>
      </div>

      {/* Demo Sections */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Demo Sections
            </h3>
          </div>
          <button
            onClick={addSection}
            className="flex items-center space-x-2 rounded-lg bg-orange-100 px-3 py-2 text-orange-700 hover:bg-orange-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Section</span>
          </button>
        </div>

        <div className="space-y-4">
          {data.sections.map((section, index) => (
            <div
              key={section.id}
              className="rounded-lg border border-gray-200 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-medium text-gray-900">
                  Section {index + 1}
                </h4>
                {data.sections.length > 1 && (
                  <button
                    onClick={() => removeSection(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) =>
                      updateSection(index, { title: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    placeholder="e.g., Creating Variables"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <textarea
                    value={section.content}
                    onChange={(e) =>
                      updateSection(index, { content: e.target.value })
                    }
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    placeholder="Explain this step of the demo..."
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Code Example (Optional)
                  </label>
                  <textarea
                    value={section.code || ""}
                    onChange={(e) =>
                      updateSection(index, { code: e.target.value })
                    }
                    rows={4}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    placeholder="# Code example for this section"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Hint (Optional)
                  </label>
                  <input
                    type="text"
                    value={section.hint || ""}
                    onChange={(e) =>
                      updateSection(index, { hint: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    placeholder="Helpful hint for this section"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`interactive-${index}`}
                    checked={section.interactive || false}
                    onChange={(e) =>
                      updateSection(index, { interactive: e.target.checked })
                    }
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <label
                    htmlFor={`interactive-${index}`}
                    className="text-sm font-medium text-gray-700"
                  >
                    Interactive Section
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Elements */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center space-x-2">
          <MousePointer className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Interactive Elements
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            "buttons",
            "forms",
            "animations",
            "drag-drop",
            "click-events",
            "hover-effects",
          ].map((element) => (
            <div key={element} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={element}
                checked={data.interactiveElements.includes(element)}
                onChange={() => toggleInteractiveElement(element)}
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <label
                htmlFor={element}
                className="text-sm capitalize text-gray-700"
              >
                {element.replace("-", " ")}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation & Settings */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center space-x-2">
          <Settings className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Navigation & Settings
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h4 className="mb-3 font-medium text-gray-900">
              Navigation Options
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showProgress"
                  checked={data.navigation.showProgress || false}
                  onChange={(e) =>
                    updateData({
                      navigation: {
                        ...data.navigation,
                        showProgress: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="showProgress" className="text-sm text-gray-700">
                  Show Progress Bar
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowSkip"
                  checked={data.navigation.allowSkip || false}
                  onChange={(e) =>
                    updateData({
                      navigation: {
                        ...data.navigation,
                        allowSkip: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="allowSkip" className="text-sm text-gray-700">
                  Allow Skipping Sections
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoAdvance"
                  checked={data.navigation.autoAdvance || false}
                  onChange={(e) =>
                    updateData({
                      navigation: {
                        ...data.navigation,
                        autoAdvance: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="autoAdvance" className="text-sm text-gray-700">
                  Auto Advance Sections
                </label>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-3 font-medium text-gray-900">Demo Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showHints"
                  checked={data.settings?.showHints || false}
                  onChange={(e) =>
                    updateData({
                      settings: {
                        ...data.settings,
                        showHints: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="showHints" className="text-sm text-gray-700">
                  Show Hints
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowRestart"
                  checked={data.settings?.allowRestart || false}
                  onChange={(e) =>
                    updateData({
                      settings: {
                        ...data.settings,
                        allowRestart: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <label htmlFor="allowRestart" className="text-sm text-gray-700">
                  Allow Restart
                </label>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Completion Message
                </label>
                <input
                  type="text"
                  value={data.settings?.completionMessage || ""}
                  onChange={(e) =>
                    updateData({
                      settings: {
                        ...data.settings,
                        completionMessage: e.target.value,
                      },
                    })
                  }
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                  placeholder="Great job completing the demo!"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-lg bg-orange-50 p-4">
        <div className="flex items-start space-x-2">
          <Play className="mt-0.5 h-5 w-5 text-orange-600" />
          <div>
            <p className="text-sm font-medium text-orange-800">
              Interactive Demo Summary
            </p>
            <p className="mt-1 text-sm text-orange-700">
              {data.sections.length} sections configured •
              {data.interactiveElements.length} interactive elements •
              {data.sections.filter((s) => s.interactive).length} interactive
              sections
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
