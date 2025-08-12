"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Code, Play, RotateCcw, Trophy, Book } from "lucide-react";

interface Component {
  name: string;
  code: string;
  explanation: string;
}

interface ClassBuilderContent {
  project: string;
  description: string;
  components: Component[];
  testScenarios: string[];
}

interface LearningActivity {
  id: string;
  title: string;
  description: string;
  content: ClassBuilderContent;
}

interface ClassBuilderActivityProps {
  activity: LearningActivity;
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

export default function ClassBuilderActivity({
  activity,
  onComplete,
}: ClassBuilderActivityProps) {
  const [currentComponent, setCurrentComponent] = useState(0);
  const [completedComponents, setCompletedComponents] = useState<Set<number>>(
    new Set()
  );
  const [builtClass, setBuiltClass] = useState<string[]>([]);
  const [showOutput, setShowOutput] = useState(false);
  const [testingScenario, setTestingScenario] = useState(0);
  const [classCompleted, setClassCompleted] = useState(false);

  const { project, description, components, testScenarios } = activity.content;

  useEffect(() => {
    // Mark class as completed but don't auto-complete activity
    if (completedComponents.size === components.length && !classCompleted) {
      setClassCompleted(true);
    }
  }, [completedComponents, components.length, classCompleted]);

  const handleManualComplete = () => {
    const score = 95; // High score for completing OOP class
    onComplete(score, 100, true);
  };

  const addComponent = (componentIndex: number) => {
    const component = components[componentIndex];
    setBuiltClass((prev) => [...prev, component.code]);
    setCompletedComponents((prev) => new Set([...prev, componentIndex]));

    // Move to next component if available
    if (componentIndex < components.length - 1) {
      setCurrentComponent(componentIndex + 1);
    }
  };

  const removeComponent = (codeIndex: number) => {
    setBuiltClass((prev) => prev.filter((_, index) => index !== codeIndex));
    // Reset completed components that come after this one
    const componentIndex = codeIndex;
    const newCompleted = new Set([...completedComponents]);
    for (let i = componentIndex; i < components.length; i++) {
      newCompleted.delete(i);
    }
    setCompletedComponents(newCompleted);
  };

  const testClass = () => {
    setShowOutput(true);
    // Cycle through test scenarios
    setTimeout(() => {
      setTestingScenario((prev) => (prev + 1) % testScenarios.length);
    }, 2000);
  };

  const resetClass = () => {
    setCurrentComponent(0);
    setCompletedComponents(new Set());
    setBuiltClass([]);
    setShowOutput(false);
    setTestingScenario(0);
    setClassCompleted(false);
  };

  const getFullClassCode = () => {
    return builtClass.join("\n\n");
  };

  const simulateOutput = () => {
    const scenario = testScenarios[testingScenario];

    if (builtClass.length === components.length) {
      return `Testing Scenario: ${scenario}

# Creating student object
student1 = Student("Alice", 20, "S001")
print(student1)

# Adding grades
student1.add_grade(85)
student1.add_grade(92)
student1.add_grade(78)

# Getting average
print(f"Average grade: {student1.get_average():.2f}")

Output:
Student: Alice (ID: S001), Average: 85.00
Average grade: 85.00

✅ All tests passed! Class is working correctly.`;
    } else {
      return `❌ Class incomplete. Please add all components first.
Missing components: ${components.length - builtClass.length}`;
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {activity.title}
        </h2>
        <p className="mb-6 text-lg text-gray-600">{activity.description}</p>

        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
          <h3 className="mb-2 font-semibold text-indigo-900">
            🏗️ Project: {project}
          </h3>
          <p className="text-indigo-800">{description}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Class Construction Progress
          </span>
          <span className="text-sm text-gray-500">
            {completedComponents.size}/{components.length} components built
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-indigo-600 transition-all duration-300"
            style={{
              width: `${(completedComponents.size / components.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Panel - Component Selection */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Class Components
            </h3>

            <div className="space-y-4">
              {components.map((component, index) => (
                <div
                  key={index}
                  className={`rounded-lg border-2 p-4 transition-all ${
                    completedComponents.has(index)
                      ? "border-green-500 bg-green-50"
                      : index === currentComponent
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">
                      {component.name}
                    </h4>
                    {completedComponents.has(index) ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <button
                        onClick={() => addComponent(index)}
                        disabled={index > currentComponent}
                        className="rounded bg-indigo-600 px-3 py-1 text-sm text-white transition-colors hover:bg-indigo-700 disabled:bg-gray-400"
                      >
                        Add Component
                      </button>
                    )}
                  </div>

                  <p className="mb-3 text-sm text-gray-600">
                    {component.explanation}
                  </p>

                  <div className="rounded bg-gray-900 p-3">
                    <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-xs text-green-300">
                      {component.code}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OOP Concepts Guide */}
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <div className="mb-3 flex items-center space-x-2">
              <Book className="h-5 w-5 text-purple-600" />
              <h4 className="font-semibold text-purple-900">
                OOP Concepts in This Class
              </h4>
            </div>
            <ul className="space-y-1 text-sm text-purple-800">
              <li>
                • <strong>Encapsulation:</strong> Data and methods bundled
                together
              </li>
              <li>
                • <strong>Constructor:</strong> __init__ method to initialize
                objects
              </li>
              <li>
                • <strong>Methods:</strong> Functions that operate on object
                data
              </li>
              <li>
                • <strong>Attributes:</strong> Data stored within the object
              </li>
              <li>
                • <strong>String Representation:</strong> __str__ and __repr__
                methods
              </li>
            </ul>
          </div>
        </div>

        {/* Right Panel - Built Class */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Built Class
              </h3>
              <div className="flex space-x-2">
                {builtClass.length > 0 && (
                  <button
                    onClick={testClass}
                    className="flex items-center space-x-2 rounded bg-green-600 px-4 py-2 text-sm text-white transition-colors hover:bg-green-700"
                  >
                    <Play className="h-4 w-4" />
                    <span>Test Class</span>
                  </button>
                )}
                <button
                  onClick={resetClass}
                  className="flex items-center space-x-2 rounded bg-gray-600 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-700"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Class Editor */}
            <div className="min-h-96 overflow-hidden rounded-lg bg-gray-900">
              <div className="flex items-center space-x-2 border-b border-gray-700 p-4">
                <Code className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-400">
                  student.py
                </span>
              </div>

              <div className="p-4">
                {builtClass.length > 0 ? (
                  <div className="space-y-2">
                    {builtClass.map((code, index) => (
                      <div key={index} className="group relative">
                        <button
                          onClick={() => removeComponent(index)}
                          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                        >
                          ×
                        </button>
                        <pre className="whitespace-pre-wrap pr-6 font-mono text-sm text-green-300">
                          {code}
                        </pre>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <Code className="mx-auto mb-4 h-12 w-12 text-gray-600" />
                    <p className="text-gray-400">
                      Add components to build your class
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Start with the class definition
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Output Panel */}
          {showOutput && (
            <div className="rounded-lg bg-black p-4">
              <div className="mb-3 flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span className="text-sm font-medium text-green-400">
                  Class Testing Output
                </span>
              </div>
              <pre className="whitespace-pre-wrap font-mono text-sm text-green-300">
                {simulateOutput()}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Component Flow Diagram */}
      <div className="mt-8 rounded-lg bg-gray-50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Class Construction Steps
        </h3>
        <div className="flex items-center justify-center space-x-4 overflow-x-auto">
          {components.map((component, index) => (
            <div key={index} className="flex min-w-max items-center space-x-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  completedComponents.has(index)
                    ? "bg-green-500 text-white"
                    : index === currentComponent
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-300 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-sm font-medium ${
                  completedComponents.has(index)
                    ? "text-green-700"
                    : "text-gray-600"
                }`}
              >
                {component.name}
              </span>
              {index < components.length - 1 && (
                <div className="h-0.5 w-8 bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Test Scenarios */}
      <div className="mt-8 rounded-lg bg-blue-50 p-6">
        <h3 className="mb-4 text-lg font-semibold text-blue-900">
          Test Scenarios
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {testScenarios.map((scenario, index) => (
            <div
              key={index}
              className={`rounded border p-3 ${
                index === testingScenario && showOutput
                  ? "border-blue-500 bg-blue-100"
                  : "border-blue-200 bg-white"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span className="text-sm text-blue-800">{scenario}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completion Message */}
      {classCompleted && (
        <div className="mt-8 rounded-lg border border-green-200 bg-green-50 p-6 text-center">
          <div className="mb-4 flex items-center justify-center space-x-2">
            <Trophy className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-green-900">
              Class Complete!
            </span>
          </div>
          <p className="mb-6 text-green-800">
            Excellent! You've successfully built a complete {project} class with
            all OOP concepts implemented.
          </p>
          <div className="mb-6 rounded-lg border border-green-200 bg-white p-4">
            <h4 className="mb-2 font-semibold text-green-900">
              OOP Mastery Achieved:
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm text-green-800">
              <div>
                <div className="font-medium">✅ Class Definition</div>
                <div>✅ Constructor Method</div>
                <div>✅ Instance Methods</div>
              </div>
              <div>
                <div className="font-medium">✅ Data Encapsulation</div>
                <div>✅ String Representation</div>
                <div>✅ Error Handling</div>
              </div>
            </div>
          </div>
          <button
            onClick={handleManualComplete}
            className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-green-700"
          >
            🎉 Complete Activity & Claim Rewards
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
        <h3 className="mb-2 font-semibold text-indigo-900">
          🏛️ How to Build Your Class:
        </h3>
        <ul className="space-y-1 text-sm text-indigo-800">
          <li>• Start with the class definition and constructor</li>
          <li>• Add methods one by one in logical order</li>
          <li>• Read explanations to understand each component's purpose</li>
          <li>• Test your class after adding components to see it work</li>
          <li>• Complete all components to master OOP concepts</li>
        </ul>
      </div>
    </div>
  );
}
