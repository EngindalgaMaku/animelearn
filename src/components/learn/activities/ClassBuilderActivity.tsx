"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Plus,
  X,
  Clock,
  Trophy,
  Eye,
  Code,
  Settings,
  Play,
  RotateCcw,
} from "lucide-react";

interface ClassProperty {
  name: string;
  type: string;
  visibility: "public" | "private" | "protected";
  description?: string;
}

interface ClassMethod {
  name: string;
  returnType: string;
  parameters: string[];
  visibility: "public" | "private" | "protected";
  description?: string;
}

interface ClassBuilderActivityProps {
  activity: {
    content: {
      instructions?: string;
      className: string;
      language: string;
      requiredProperties: ClassProperty[];
      requiredMethods: ClassMethod[];
      availableProperties: ClassProperty[];
      availableMethods: ClassMethod[];
      timeLimit?: number;
      allowCustom?: boolean;
      hints?: string[];
    };
  };
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function ClassBuilderActivity({
  activity,
  onComplete,
}: ClassBuilderActivityProps) {
  // Validate activity data
  if (!activity?.content) {
    return (
      <div className="py-16 text-center">
        <div className="mb-4 text-lg font-semibold text-red-500">
          Invalid Activity Data
        </div>
        <p className="text-gray-600">
          This class builder activity doesn't have the required content
          configuration.
        </p>
      </div>
    );
  }

  const contentData = activity.content;
  const className = contentData.className || "MyClass";
  const language = contentData.language || "Java";
  const requiredProperties = contentData.requiredProperties || [];
  const requiredMethods = contentData.requiredMethods || [];
  const availableProperties = contentData.availableProperties || [];
  const availableMethods = contentData.availableMethods || [];

  const [selectedProperties, setSelectedProperties] = useState<ClassProperty[]>(
    []
  );
  const [selectedMethods, setSelectedMethods] = useState<ClassMethod[]>([]);
  const [customProperty, setCustomProperty] = useState({
    name: "",
    type: "",
    visibility: "public" as const,
  });
  const [customMethod, setCustomMethod] = useState({
    name: "",
    returnType: "",
    parameters: "",
    visibility: "public" as const,
  });
  const [showCode, setShowCode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(contentData.timeLimit || 900);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isCompleted) {
      handleComplete();
    }
  }, [timeLeft, isCompleted]);

  const addProperty = (property: ClassProperty) => {
    if (!selectedProperties.find((p) => p.name === property.name)) {
      setSelectedProperties([...selectedProperties, property]);
    }
  };

  const addMethod = (method: ClassMethod) => {
    if (!selectedMethods.find((m) => m.name === method.name)) {
      setSelectedMethods([...selectedMethods, method]);
    }
  };

  const removeProperty = (propertyName: string) => {
    setSelectedProperties(
      selectedProperties.filter((p) => p.name !== propertyName)
    );
  };

  const removeMethod = (methodName: string) => {
    setSelectedMethods(selectedMethods.filter((m) => m.name !== methodName));
  };

  const addCustomProperty = () => {
    if (customProperty.name && customProperty.type) {
      const newProperty: ClassProperty = {
        name: customProperty.name,
        type: customProperty.type,
        visibility: customProperty.visibility,
      };
      addProperty(newProperty);
      setCustomProperty({ name: "", type: "", visibility: "public" });
    }
  };

  const addCustomMethod = () => {
    if (customMethod.name && customMethod.returnType) {
      const newMethod: ClassMethod = {
        name: customMethod.name,
        returnType: customMethod.returnType,
        parameters: customMethod.parameters
          ? customMethod.parameters.split(",").map((p) => p.trim())
          : [],
        visibility: customMethod.visibility,
      };
      addMethod(newMethod);
      setCustomMethod({
        name: "",
        returnType: "",
        parameters: "",
        visibility: "public",
      });
    }
  };

  const checkCompletion = () => {
    try {
      const requiredPropsCount = requiredProperties.length;
      const requiredMethodsCount = requiredMethods.length;

      const hasRequiredProps = requiredProperties.every((req) =>
        selectedProperties.some(
          (sel) => sel?.name === req?.name && sel?.type === req?.type
        )
      );

      const hasRequiredMethods = requiredMethods.every((req) =>
        selectedMethods.some(
          (sel) =>
            sel?.name === req?.name && sel?.returnType === req?.returnType
        )
      );

      const totalRequired = requiredPropsCount + requiredMethodsCount;
      if (totalRequired === 0) {
        return { isComplete: true, score: 100 };
      }

      const completionRate =
        ((hasRequiredProps
          ? requiredPropsCount
          : selectedProperties.filter((sel) =>
              requiredProperties.some((req) => req?.name === sel?.name)
            ).length) +
          (hasRequiredMethods
            ? requiredMethodsCount
            : selectedMethods.filter((sel) =>
                requiredMethods.some((req) => req?.name === sel?.name)
              ).length)) /
        totalRequired;

      return {
        isComplete: hasRequiredProps && hasRequiredMethods,
        score: Math.round(completionRate * 100),
      };
    } catch (error) {
      console.error("Error checking completion:", error);
      return { isComplete: false, score: 0 };
    }
  };

  const handleComplete = () => {
    try {
      setIsCompleted(true);
      const result = checkCompletion();
      const timeBonus =
        timeLeft > 0
          ? Math.round((timeLeft / (contentData.timeLimit || 900)) * 20)
          : 0;
      const finalScore = Math.min(100, result.score + timeBonus);

      setScore(finalScore);
      onComplete(finalScore, 100, result.isComplete);
    } catch (error) {
      console.error("Error completing class builder activity:", error);
      onComplete(0, 100, false);
    }
  };

  const resetActivity = () => {
    try {
      setSelectedProperties([]);
      setSelectedMethods([]);
      setShowCode(false);
      setIsCompleted(false);
      setScore(0);
      setTimeLeft(contentData.timeLimit || 900);
      setShowHints(false);
      setCurrentHint(0);
    } catch (error) {
      console.error("Error resetting activity:", error);
    }
  };

  const generateCode = () => {
    try {
      let code = "";

      if (language === "Python") {
        code = `class ${className}:\n`;

        // Constructor
        if (selectedProperties.length > 0) {
          const publicProps = selectedProperties.filter(
            (p) => p.visibility === "public"
          );
          const params = publicProps
            .map((p) => `${p.name}: ${p.type}`)
            .join(", ");
          code += `    def __init__(self${params ? ", " + params : ""}):\n`;

          selectedProperties.forEach((prop) => {
            const prefix =
              prop.visibility === "private"
                ? "__"
                : prop.visibility === "protected"
                  ? "_"
                  : "";
            code += `        self.${prefix}${prop.name} = ${prop.name}\n`;
          });
          code += "\n";
        }

        // Methods
        selectedMethods.forEach((method) => {
          const prefix =
            method.visibility === "private"
              ? "__"
              : method.visibility === "protected"
                ? "_"
                : "";
          const params =
            method.parameters.length > 0
              ? ", " + method.parameters.join(", ")
              : "";
          code += `    def ${prefix}${method.name}(self${params}) -> ${method.returnType}:\n`;
          code += `        pass\n\n`;
        });
      } else if (language === "Java") {
        code = `public class ${className} {\n`;

        // Properties
        selectedProperties.forEach((prop) => {
          code += `    ${prop.visibility} ${prop.type} ${prop.name};\n`;
        });
        if (selectedProperties.length > 0) code += "\n";

        // Constructor
        if (selectedProperties.length > 0) {
          const params = selectedProperties
            .map((p) => `${p.type} ${p.name}`)
            .join(", ");
          code += `    public ${className}(${params}) {\n`;
          selectedProperties.forEach((prop) => {
            code += `        this.${prop.name} = ${prop.name};\n`;
          });
          code += "    }\n\n";
        }

        // Methods
        selectedMethods.forEach((method) => {
          const params =
            method.parameters.length > 0 ? method.parameters.join(", ") : "";
          code += `    ${method.visibility} ${method.returnType} ${method.name}(${params}) {\n`;
          code += `        // TODO: implement\n`;
          code += `    }\n\n`;
        });

        code += "}";
      }

      return code;
    } catch (error) {
      console.error("Error generating code:", error);
      return `// Error generating code for class ${className}`;
    }
  };

  const getVisibilityColor = (visibility: string) => {
    const colors = {
      public: "text-green-600",
      private: "text-red-600",
      protected: "text-orange-600",
    };
    return colors[visibility as keyof typeof colors] || "text-gray-600";
  };

  if (isCompleted) {
    const result = checkCompletion();

    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <div className="mb-6">
          <Trophy className="mx-auto mb-4 h-16 w-16 text-yellow-500" />
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Class Building Complete!
          </h2>
          <div className="mb-4 text-lg text-gray-600">You scored {score}%</div>

          <div
            className={`mb-6 rounded-lg p-4 font-medium ${
              result.isComplete
                ? "bg-green-100 text-green-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {result.isComplete
              ? "🎉 Perfect! Your class includes all required properties and methods!"
              : "💪 Good progress! Your class is partially complete."}
          </div>

          <div className="mb-6 rounded-lg bg-gray-50 p-6 text-left">
            <h3 className="mb-4 text-lg font-semibold">
              Your Class Structure:
            </h3>
            <pre className="overflow-x-auto rounded bg-gray-900 p-4 font-mono text-sm text-green-400">
              {generateCode()}
            </pre>
          </div>
        </div>

        <button
          onClick={resetActivity}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Build Another Class
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Box className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">
              Class Builder - {className}
            </span>
            <span className="rounded bg-gray-100 px-2 py-1 text-sm">
              {language}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>
                {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>
            <div className="text-sm">
              Progress: {selectedProperties.length + selectedMethods.length}{" "}
              items
            </div>
          </div>
        </div>

        {contentData.instructions && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-blue-800">{contentData.instructions}</p>
          </div>
        )}

        {/* Requirements */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h3 className="mb-2 font-semibold text-green-900">
              Required Properties:
            </h3>
            <div className="space-y-1">
              {requiredProperties.map((prop, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm text-green-800"
                >
                  <span
                    className={getVisibilityColor(prop?.visibility || "public")}
                  >
                    {prop?.visibility || "public"} {prop?.type || "unknown"}{" "}
                    {prop?.name || "unknown"}
                  </span>
                  {selectedProperties.some((p) => p?.name === prop?.name) && (
                    <span className="text-green-600">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <h3 className="mb-2 font-semibold text-purple-900">
              Required Methods:
            </h3>
            <div className="space-y-1">
              {requiredMethods.map((method, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm text-purple-800"
                >
                  <span
                    className={getVisibilityColor(
                      method?.visibility || "public"
                    )}
                  >
                    {method?.visibility || "public"}{" "}
                    {method?.returnType || "void"} {method?.name || "unknown"}()
                  </span>
                  {selectedMethods.some((m) => m?.name === method?.name) && (
                    <span className="text-purple-600">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Available Components */}
        <div className="space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Available Properties
            </h3>
            <div className="space-y-2">
              {availableProperties.map((prop, index) => (
                <motion.button
                  key={index}
                  onClick={() => addProperty(prop)}
                  disabled={selectedProperties.some(
                    (p) => p.name === prop.name
                  )}
                  className={`w-full rounded-lg border-2 p-3 text-left text-sm transition-all ${
                    selectedProperties.some((p) => p.name === prop.name)
                      ? "cursor-not-allowed border-green-300 bg-green-50 text-green-800"
                      : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                  whileHover={
                    !selectedProperties.some((p) => p.name === prop.name)
                      ? { scale: 1.02 }
                      : {}
                  }
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span
                        className={`font-mono ${getVisibilityColor(prop.visibility)}`}
                      >
                        {prop.visibility} {prop.type} {prop.name}
                      </span>
                      {prop.description && (
                        <div className="mt-1 text-xs text-gray-500">
                          {prop.description}
                        </div>
                      )}
                    </div>
                    <Plus className="h-4 w-4" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Available Methods
            </h3>
            <div className="space-y-2">
              {availableMethods.map((method, index) => (
                <motion.button
                  key={index}
                  onClick={() => addMethod(method)}
                  disabled={selectedMethods.some((m) => m.name === method.name)}
                  className={`w-full rounded-lg border-2 p-3 text-left text-sm transition-all ${
                    selectedMethods.some((m) => m.name === method.name)
                      ? "cursor-not-allowed border-purple-300 bg-purple-50 text-purple-800"
                      : "border-gray-300 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50"
                  }`}
                  whileHover={
                    !selectedMethods.some((m) => m.name === method.name)
                      ? { scale: 1.02 }
                      : {}
                  }
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span
                        className={`font-mono ${getVisibilityColor(method.visibility)}`}
                      >
                        {method.visibility} {method.returnType} {method.name}()
                      </span>
                      {method.description && (
                        <div className="mt-1 text-xs text-gray-500">
                          {method.description}
                        </div>
                      )}
                    </div>
                    <Plus className="h-4 w-4" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Custom Components */}
          {contentData.allowCustom && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add Custom
              </h3>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h4 className="mb-3 font-medium text-gray-900">
                  Custom Property
                </h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Property name"
                    value={customProperty.name}
                    onChange={(e) =>
                      setCustomProperty({
                        ...customProperty,
                        name: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Type (e.g., String, int)"
                    value={customProperty.type}
                    onChange={(e) =>
                      setCustomProperty({
                        ...customProperty,
                        type: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <select
                    value={customProperty.visibility}
                    onChange={(e) =>
                      setCustomProperty({
                        ...customProperty,
                        visibility: e.target.value as any,
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="public">public</option>
                    <option value="private">private</option>
                    <option value="protected">protected</option>
                  </select>
                  <button
                    onClick={addCustomProperty}
                    disabled={!customProperty.name || !customProperty.type}
                    className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    Add Property
                  </button>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h4 className="mb-3 font-medium text-gray-900">
                  Custom Method
                </h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Method name"
                    value={customMethod.name}
                    onChange={(e) =>
                      setCustomMethod({ ...customMethod, name: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Return type (e.g., void, String)"
                    value={customMethod.returnType}
                    onChange={(e) =>
                      setCustomMethod({
                        ...customMethod,
                        returnType: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Parameters (comma-separated)"
                    value={customMethod.parameters}
                    onChange={(e) =>
                      setCustomMethod({
                        ...customMethod,
                        parameters: e.target.value,
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <select
                    value={customMethod.visibility}
                    onChange={(e) =>
                      setCustomMethod({
                        ...customMethod,
                        visibility: e.target.value as any,
                      })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="public">public</option>
                    <option value="private">private</option>
                    <option value="protected">protected</option>
                  </select>
                  <button
                    onClick={addCustomMethod}
                    disabled={!customMethod.name || !customMethod.returnType}
                    className="w-full rounded-md bg-purple-600 px-3 py-2 text-sm text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    Add Method
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Hints */}
          {contentData.hints && contentData.hints.length > 0 && (
            <div>
              <button
                onClick={() => setShowHints(!showHints)}
                className="w-full rounded-lg border border-yellow-300 bg-yellow-100 p-3 font-medium text-yellow-800 transition-colors hover:bg-yellow-200"
              >
                {showHints ? "Hide Hints" : "Show Hints"} 💡
              </button>

              <AnimatePresence>
                {showHints && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3"
                  >
                    <p className="text-sm text-yellow-800">
                      {contentData.hints?.[currentHint] || "No hint available"}
                    </p>
                    {(contentData.hints?.length || 0) > 1 && (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-yellow-700">
                          Hint {currentHint + 1} of{" "}
                          {contentData.hints?.length || 0}
                        </span>
                        <div className="space-x-1">
                          <button
                            onClick={() =>
                              setCurrentHint(Math.max(0, currentHint - 1))
                            }
                            disabled={currentHint === 0}
                            className="rounded bg-yellow-200 px-2 py-1 text-xs text-yellow-800 disabled:opacity-50"
                          >
                            Prev
                          </button>
                          <button
                            onClick={() =>
                              setCurrentHint(
                                Math.min(
                                  (contentData.hints?.length || 1) - 1,
                                  currentHint + 1
                                )
                              )
                            }
                            disabled={
                              currentHint ===
                              (contentData.hints?.length || 1) - 1
                            }
                            className="rounded bg-yellow-200 px-2 py-1 text-xs text-yellow-800 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Class Builder */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Class: {className}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="inline-flex items-center space-x-1 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200"
                >
                  {showCode ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <Code className="h-4 w-4" />
                  )}
                  <span>{showCode ? "Show Structure" : "Show Code"}</span>
                </button>
                <button
                  onClick={resetActivity}
                  className="p-2 text-gray-600 transition-colors hover:text-gray-800"
                  title="Reset"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {showCode ? (
              <div className="rounded-lg bg-gray-900 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex space-x-1">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm text-gray-400">{language}</span>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-relaxed text-green-400">
                  {generateCode()}
                </pre>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Properties Section */}
                <div>
                  <h4 className="mb-3 font-semibold text-gray-900">
                    Properties
                  </h4>
                  {selectedProperties.length === 0 ? (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 py-4 text-center text-gray-500">
                      No properties added yet
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedProperties.map((prop, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3"
                        >
                          <span
                            className={`font-mono text-sm ${getVisibilityColor(prop.visibility)}`}
                          >
                            {prop.visibility} {prop.type} {prop.name}
                          </span>
                          <button
                            onClick={() => removeProperty(prop.name)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Methods Section */}
                <div>
                  <h4 className="mb-3 font-semibold text-gray-900">Methods</h4>
                  {selectedMethods.length === 0 ? (
                    <div className="rounded-lg border-2 border-dashed border-gray-300 py-4 text-center text-gray-500">
                      No methods added yet
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedMethods.map((method, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between rounded-lg border border-purple-200 bg-purple-50 p-3"
                        >
                          <div>
                            <span
                              className={`font-mono text-sm ${getVisibilityColor(method.visibility)}`}
                            >
                              {method.visibility} {method.returnType}{" "}
                              {method.name}({method.parameters.join(", ")})
                            </span>
                            {method.description && (
                              <div className="mt-1 text-xs text-gray-500">
                                {method.description}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => removeMethod(method.name)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Complete Button */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <button
                onClick={handleComplete}
                disabled={
                  selectedProperties.length === 0 &&
                  selectedMethods.length === 0
                }
                className="w-full rounded-lg bg-green-600 px-4 py-3 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                Complete Class Design
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
