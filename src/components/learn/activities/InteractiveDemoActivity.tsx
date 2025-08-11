"use client";

import { useState } from "react";
import {
  Play,
  RotateCcw,
  Code,
  BookOpen,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface Step {
  title: string;
  explanation: string;
  code: string;
  interactive: boolean;
  hint: string;
}

interface InteractiveDemoContent {
  steps: Step[];
}

interface LearningActivity {
  id: string;
  title: string;
  description: string;
  content: InteractiveDemoContent;
}

interface InteractiveDemoActivityProps {
  activity: LearningActivity;
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function InteractiveDemoActivity({
  activity,
  onComplete,
}: InteractiveDemoActivityProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [codeOutput, setCodeOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [editableCode, setEditableCode] = useState<string>("");

  const { steps } = activity.content;
  const currentStepData = steps[currentStep];

  const simulateCodeExecution = (code: string) => {
    setIsRunning(true);
    setCodeOutput("Running code...");

    // Simulate code execution with realistic output
    setTimeout(() => {
      let output = "";

      try {
        // Simple simulation for common Python patterns
        if (code.includes("print(")) {
          const printMatches = code.match(/print\((.*?)\)/g);
          if (printMatches) {
            printMatches.forEach((match) => {
              const content = match.match(/print\((.*?)\)/)?.[1] || "";
              // Remove quotes and evaluate simple expressions
              let result = content.replace(/['"]/g, "");

              // Handle f-strings
              if (content.includes("f'") || content.includes('f"')) {
                result = content.replace(/f['"](.*)['"]/, "$1");
                // Simple variable substitution
                if (code.includes("name = ")) {
                  const nameMatch = code.match(/name = ['"](.*)['"]/);
                  if (nameMatch) {
                    result = result.replace(/{name}|{.*name.*}/g, nameMatch[1]);
                  }
                }
                if (code.includes("age = ")) {
                  const ageMatch = code.match(/age = (\d+)/);
                  if (ageMatch) {
                    result = result.replace(/{age}|{.*age.*}/g, ageMatch[1]);
                  }
                }
              }

              // Handle type() function
              if (content.includes("type(")) {
                if (content.includes("type(name)")) result = "<class 'str'>";
                else if (content.includes("type(age)"))
                  result = "<class 'int'>";
                else if (content.includes("type(height)"))
                  result = "<class 'float'>";
                else if (content.includes("type(is_student)"))
                  result = "<class 'bool'>";
              }

              output += result + "\n";
            });
          }
        }

        // Handle variable assignments and simple expressions
        if (code.includes("=") && !code.includes("print")) {
          output = "Variables assigned successfully\n";
        }

        // Handle if statements
        if (code.includes("if ") && code.includes("print")) {
          const lines = code.split("\n");
          for (const line of lines) {
            if (line.trim().startsWith("print(") && line.includes("'")) {
              const printContent = line.match(/print\(['"](.*)['"]/);
              if (printContent) {
                output += printContent[1] + "\n";
              }
            }
          }
        }

        if (!output.trim()) {
          output = "Code executed successfully (no output)";
        }
      } catch (error) {
        output = "Error executing code";
      }

      setCodeOutput(output.trim());
      setIsRunning(false);

      // Mark step as completed
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
    }, 1500);
  };

  const runCode = () => {
    const codeToRun = editableCode || currentStepData.code;
    simulateCodeExecution(codeToRun);
  };

  const resetCode = () => {
    setEditableCode(currentStepData.code);
    setCodeOutput("");
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setEditableCode(steps[currentStep + 1].code);
      setCodeOutput("");
    } else {
      // Complete the activity
      const completionPercentage = (completedSteps.size / steps.length) * 100;
      const score = Math.max(70, completionPercentage); // Minimum 70% for completion
      onComplete(score, 100, true);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setEditableCode(steps[currentStep - 1].code);
      setCodeOutput("");
    }
  };

  // Initialize editable code when component mounts or step changes
  useState(() => {
    if (currentStepData) {
      setEditableCode(currentStepData.code);
    }
  });

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {activity.title}
        </h2>
        <p className="text-lg text-gray-600">{activity.description}</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-gray-500">
            {completedSteps.size}/{steps.length} completed
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Panel - Explanation */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                {currentStepData.title}
              </h3>
            </div>
            <p className="mb-4 leading-relaxed text-gray-700">
              {currentStepData.explanation}
            </p>

            {currentStepData.hint && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                <p className="text-sm text-yellow-800">
                  💡 <strong>Hint:</strong> {currentStepData.hint}
                </p>
              </div>
            )}
          </div>

          {/* Step Navigation */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="mb-3 font-semibold text-gray-900">Learning Steps</h4>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex cursor-pointer items-center space-x-3 rounded p-2 transition-colors ${
                    index === currentStep
                      ? "bg-indigo-100 text-indigo-900"
                      : completedSteps.has(index)
                        ? "hover:bg-green-150 bg-green-100 text-green-800"
                        : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setCurrentStep(index);
                    setEditableCode(steps[index].code);
                    setCodeOutput("");
                  }}
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      index === currentStep
                        ? "bg-indigo-600 text-white"
                        : completedSteps.has(index)
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="truncate text-sm font-medium">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Code and Output */}
        <div className="space-y-6">
          {/* Code Editor */}
          <div className="overflow-hidden rounded-lg bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-700 p-4">
              <div className="flex items-center space-x-2">
                <Code className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-400">
                  Python Code
                </span>
              </div>
              <div className="flex space-x-1">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>
            </div>

            <div className="p-4">
              {currentStepData.interactive ? (
                <textarea
                  value={editableCode}
                  onChange={(e) => setEditableCode(e.target.value)}
                  className="h-40 w-full resize-none bg-transparent font-mono text-sm text-white focus:outline-none"
                  placeholder="Write your Python code here..."
                />
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-sm text-white">
                  {currentStepData.code}
                </pre>
              )}
            </div>

            <div className="flex space-x-3 border-t border-gray-700 p-4">
              <button
                onClick={runCode}
                disabled={isRunning}
                className="inline-flex items-center space-x-2 rounded bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:bg-gray-600"
              >
                <Play className="h-4 w-4" />
                <span>{isRunning ? "Running..." : "Run Code"}</span>
              </button>

              {currentStepData.interactive && (
                <button
                  onClick={resetCode}
                  className="inline-flex items-center space-x-2 rounded bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Output */}
          <div className="rounded-lg bg-black p-4">
            <div className="mb-3 flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              <span className="text-sm font-medium text-green-400">Output</span>
            </div>
            <pre className="min-h-[120px] whitespace-pre-wrap font-mono text-sm text-green-300">
              {codeOutput || "Run the code to see output..."}
            </pre>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={previousStep}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={nextStep}
              className="flex items-center space-x-2 rounded-lg bg-indigo-600 px-6 py-2 text-white transition-colors hover:bg-indigo-700"
            >
              <span>
                {currentStep === steps.length - 1 ? "Complete" : "Next Step"}
              </span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
