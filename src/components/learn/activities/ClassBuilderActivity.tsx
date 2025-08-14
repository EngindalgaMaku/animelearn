"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Trophy,
  Star,
  Gift,
  Plus,
  Trash2,
} from "lucide-react";

interface ClassAttribute {
  name: string;
  type: string;
  required: boolean;
}

interface ClassMethod {
  name: string;
  required: boolean;
  params: string[];
}

interface ClassTemplate {
  name: string;
  attributes: ClassAttribute[];
  methods: ClassMethod[];
}

interface ClassBuilderContent {
  instructions: string;
  classTemplate: ClassTemplate;
  requirements: string;
}

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
  content: ClassBuilderContent;
  settings?: any;
  tags: string[];
}

interface ClassBuilderActivityProps {
  activity: LearningActivity;
  onComplete: (score: number, maxScore: number, success: boolean) => void;
}

interface UserAttribute {
  name: string;
  type: string;
}

interface UserMethod {
  name: string;
  params: string[];
}

export default function ClassBuilderActivity({
  activity,
  onComplete,
}: ClassBuilderActivityProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<UserAttribute[]>(
    []
  );
  const [selectedMethods, setSelectedMethods] = useState<UserMethod[]>([]);
  const [customAttribute, setCustomAttribute] = useState({
    name: "",
    type: "",
  });
  const [customMethod, setCustomMethod] = useState({ name: "", params: "" });
  const [showResults, setShowResults] = useState(false);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        const session = await response.json();
        setIsAuthenticated(!!session?.user);
      } catch (error) {
        const userSession =
          localStorage.getItem("user") ||
          sessionStorage.getItem("user") ||
          localStorage.getItem("next-auth.session-token") ||
          document.cookie.includes("next-auth.session-token");
        setIsAuthenticated(!!userSession);
      }
    };
    checkAuth();
  }, []);

  const { instructions, classTemplate, requirements } = activity.content;

  const addAttribute = (attribute: ClassAttribute) => {
    const userAttr = { name: attribute.name, type: attribute.type };
    if (!selectedAttributes.find((a) => a.name === attribute.name)) {
      setSelectedAttributes([...selectedAttributes, userAttr]);
    }
  };

  const addCustomAttribute = () => {
    if (customAttribute.name && customAttribute.type) {
      if (!selectedAttributes.find((a) => a.name === customAttribute.name)) {
        setSelectedAttributes([...selectedAttributes, { ...customAttribute }]);
        setCustomAttribute({ name: "", type: "" });
      }
    }
  };

  const removeAttribute = (name: string) => {
    setSelectedAttributes(selectedAttributes.filter((a) => a.name !== name));
  };

  const addMethod = (method: ClassMethod) => {
    const userMethod = { name: method.name, params: method.params };
    if (!selectedMethods.find((m) => m.name === method.name)) {
      setSelectedMethods([...selectedMethods, userMethod]);
    }
  };

  const addCustomMethod = () => {
    if (customMethod.name) {
      const params = customMethod.params
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p);
      if (!selectedMethods.find((m) => m.name === customMethod.name)) {
        setSelectedMethods([
          ...selectedMethods,
          { name: customMethod.name, params },
        ]);
        setCustomMethod({ name: "", params: "" });
      }
    }
  };

  const removeMethod = (name: string) => {
    setSelectedMethods(selectedMethods.filter((m) => m.name !== name));
  };

  const checkClass = () => {
    setShowResults(true);

    // Check required attributes
    const requiredAttributes = classTemplate.attributes.filter(
      (a) => a.required
    );
    const hasRequiredAttrs = requiredAttributes.every((reqAttr) =>
      selectedAttributes.some((selAttr) => selAttr.name === reqAttr.name)
    );

    // Check required methods
    const requiredMethods = classTemplate.methods.filter((m) => m.required);
    const hasRequiredMethods = requiredMethods.every((reqMethod) =>
      selectedMethods.some((selMethod) => selMethod.name === reqMethod.name)
    );

    // Calculate score
    let score = 0;
    if (hasRequiredAttrs) score += 50;
    if (hasRequiredMethods) score += 50;

    // Bonus points for optional attributes/methods
    const optionalAttrs = classTemplate.attributes.filter((a) => !a.required);
    const optionalMethods = classTemplate.methods.filter((m) => !m.required);

    optionalAttrs.forEach((optAttr) => {
      if (selectedAttributes.some((selAttr) => selAttr.name === optAttr.name)) {
        score += 5;
      }
    });

    optionalMethods.forEach((optMethod) => {
      if (
        selectedMethods.some((selMethod) => selMethod.name === optMethod.name)
      ) {
        score += 5;
      }
    });

    score = Math.min(100, score);
    const success = score >= 70;

    if (success) {
      handleActivityCompletion(score);
    }
  };

  const handleActivityCompletion = async (score: number) => {
    if (!isAuthenticated) return;

    const awardedActivities = JSON.parse(
      localStorage.getItem("awardedActivities") || "[]"
    );
    const alreadyAwarded = awardedActivities.includes(activity.id);

    if (!alreadyAwarded) {
      try {
        const response = await fetch("/api/learning-activities/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activityType: "class_builder",
            activityId: activity.id,
            activityTitle: activity.title,
            score: Math.max(70, score),
            timeSpent: 500,
            success: true,
            diamondReward: activity.diamondReward || 45,
            experienceReward: activity.experienceReward || 65,
          }),
        });

        if (response.ok) {
          setShowRewardAnimation(true);
          awardedActivities.push(activity.id);
          localStorage.setItem(
            "awardedActivities",
            JSON.stringify(awardedActivities)
          );
          setTimeout(() => setShowRewardAnimation(false), 3000);
        }
      } catch (error) {
        console.error("Error awarding rewards:", error);
      }
    }
  };

  const generateClassCode = () => {
    let code = `class ${classTemplate.name}:\n`;

    if (selectedMethods.find((m) => m.name === "__init__")) {
      const initMethod = selectedMethods.find((m) => m.name === "__init__");
      code += `    def __init__(self${initMethod?.params.length ? ", " + initMethod.params.join(", ") : ""}):\n`;
      selectedAttributes.forEach((attr) => {
        code += `        self.${attr.name} = ${attr.name}\n`;
      });
      code += "\n";
    }

    selectedMethods
      .filter((m) => m.name !== "__init__")
      .forEach((method) => {
        code += `    def ${method.name}(self${method.params.length ? ", " + method.params.join(", ") : ""}):\n`;
        code += `        # TODO: Implement ${method.name}\n`;
        code += `        pass\n\n`;
      });

    return code;
  };

  if (showResults) {
    const requiredAttributes = classTemplate.attributes.filter(
      (a) => a.required
    );
    const requiredMethods = classTemplate.methods.filter((m) => m.required);

    const hasRequiredAttrs = requiredAttributes.every((reqAttr) =>
      selectedAttributes.some((selAttr) => selAttr.name === reqAttr.name)
    );
    const hasRequiredMethods = requiredMethods.every((reqMethod) =>
      selectedMethods.some((selMethod) => selMethod.name === reqMethod.name)
    );

    let score = 0;
    if (hasRequiredAttrs) score += 50;
    if (hasRequiredMethods) score += 50;
    score = Math.min(
      100,
      score +
        (selectedAttributes.length - requiredAttributes.length) * 5 +
        (selectedMethods.length - requiredMethods.length) * 5
    );

    const passed = score >= 70;

    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="text-center">
          <div
            className={`mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full ${
              passed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
            }`}
          >
            {passed ? (
              <Trophy className="h-10 w-10" />
            ) : (
              <XCircle className="h-10 w-10" />
            )}
          </div>

          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            {passed ? "Class Designed Successfully!" : "Keep Designing!"}
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Your {classTemplate.name} class is{" "}
            {passed ? "well-designed" : "missing key components"}
          </p>

          <div className="mb-8 rounded-lg bg-gray-50 p-6">
            <div className="mb-2 text-4xl font-bold text-gray-900">
              {score}%
            </div>
            <div
              className={`text-lg font-semibold ${passed ? "text-green-600" : "text-red-600"}`}
            >
              {passed ? "Great Class Design!" : "Review OOP Principles"}
            </div>
          </div>

          <div className="mb-8 space-y-6">
            <div className="text-left">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Your Class Code:
              </h3>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-left text-sm text-green-400">
                <code>{generateClassCode()}</code>
              </pre>
            </div>

            <div className="text-left">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                Requirements Check:
              </h3>
              <div className="space-y-2">
                <div
                  className={`flex items-center space-x-2 ${hasRequiredAttrs ? "text-green-600" : "text-red-600"}`}
                >
                  {hasRequiredAttrs ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  <span>
                    Required attributes:{" "}
                    {requiredAttributes.map((a) => a.name).join(", ")}
                  </span>
                </div>
                <div
                  className={`flex items-center space-x-2 ${hasRequiredMethods ? "text-green-600" : "text-red-600"}`}
                >
                  {hasRequiredMethods ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                  <span>
                    Required methods:{" "}
                    {requiredMethods.map((m) => m.name).join(", ")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onComplete(score, 100, passed)}
            className="rounded-lg bg-blue-600 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-700"
          >
            Complete Class Design
          </button>
        </div>

        {/* Reward Animation */}
        {showRewardAnimation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative rounded-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 p-8 text-center shadow-2xl">
              <h3 className="mb-4 text-3xl font-bold text-white">
                🎉 Class Designer! 🎉
              </h3>
              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-center space-x-3 rounded-lg bg-yellow-500/20 p-3">
                  <span className="text-xl font-semibold text-yellow-300">
                    +{activity.diamondReward || 45} Diamonds
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-3 rounded-lg bg-blue-500/20 p-3">
                  <Star className="h-8 w-8 text-blue-400" />
                  <span className="text-xl font-semibold text-blue-300">
                    +{activity.experienceReward || 65} Experience
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {activity.title}
        </h2>
        <p className="text-lg text-gray-600">{activity.description}</p>
      </div>

      <div className="mb-8 rounded-lg bg-purple-50 p-6">
        <h3 className="mb-4 text-xl font-semibold text-purple-900">
          Instructions
        </h3>
        <p className="mb-4 text-purple-800">{instructions}</p>
        <div className="rounded-lg bg-purple-100 p-4">
          <h4 className="mb-2 font-semibold text-purple-900">Requirements:</h4>
          <p className="text-purple-800">{requirements}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Class Components */}
        <div className="space-y-6">
          {/* Attributes Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Attributes
            </h3>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-4 space-y-2">
                {classTemplate.attributes.map((attr) => (
                  <button
                    key={attr.name}
                    onClick={() => addAttribute(attr)}
                    disabled={selectedAttributes.some(
                      (a) => a.name === attr.name
                    )}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      selectedAttributes.some((a) => a.name === attr.name)
                        ? "border-green-300 bg-green-50 text-green-800"
                        : attr.required
                          ? "border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {attr.name}: {attr.type}
                        </div>
                        <div className="text-sm opacity-75">
                          {attr.required ? "Required" : "Optional"}
                        </div>
                      </div>
                      {selectedAttributes.some((a) => a.name === attr.name) && (
                        <CheckCircle className="h-5 w-5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Attribute */}
              <div className="border-t pt-4">
                <h4 className="mb-2 text-sm font-semibold text-gray-700">
                  Add Custom Attribute:
                </h4>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Attribute name"
                    value={customAttribute.name}
                    onChange={(e) =>
                      setCustomAttribute({
                        ...customAttribute,
                        name: e.target.value,
                      })
                    }
                    className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Type"
                    value={customAttribute.type}
                    onChange={(e) =>
                      setCustomAttribute({
                        ...customAttribute,
                        type: e.target.value,
                      })
                    }
                    className="w-24 rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                  <button
                    onClick={addCustomAttribute}
                    className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Methods Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Methods
            </h3>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-4 space-y-2">
                {classTemplate.methods.map((method) => (
                  <button
                    key={method.name}
                    onClick={() => addMethod(method)}
                    disabled={selectedMethods.some(
                      (m) => m.name === method.name
                    )}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      selectedMethods.some((m) => m.name === method.name)
                        ? "border-green-300 bg-green-50 text-green-800"
                        : method.required
                          ? "border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-100"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">
                          {method.name}({method.params.join(", ")})
                        </div>
                        <div className="text-sm opacity-75">
                          {method.required ? "Required" : "Optional"}
                        </div>
                      </div>
                      {selectedMethods.some((m) => m.name === method.name) && (
                        <CheckCircle className="h-5 w-5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom Method */}
              <div className="border-t pt-4">
                <h4 className="mb-2 text-sm font-semibold text-gray-700">
                  Add Custom Method:
                </h4>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Method name"
                    value={customMethod.name}
                    onChange={(e) =>
                      setCustomMethod({ ...customMethod, name: e.target.value })
                    }
                    className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="param1, param2"
                    value={customMethod.params}
                    onChange={(e) =>
                      setCustomMethod({
                        ...customMethod,
                        params: e.target.value,
                      })
                    }
                    className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                  <button
                    onClick={addCustomMethod}
                    className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Class Preview */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Your {classTemplate.name} Class
          </h3>

          {/* Selected Attributes */}
          <div className="mb-6">
            <h4 className="text-md mb-2 font-medium text-gray-800">
              Attributes ({selectedAttributes.length})
            </h4>
            <div className="min-h-20 rounded-lg bg-gray-50 p-4">
              {selectedAttributes.length === 0 ? (
                <div className="text-gray-500">No attributes selected</div>
              ) : (
                <div className="space-y-2">
                  {selectedAttributes.map((attr) => (
                    <div
                      key={attr.name}
                      className="flex items-center justify-between rounded bg-white p-2"
                    >
                      <span className="text-sm">
                        {attr.name}: {attr.type}
                      </span>
                      <button
                        onClick={() => removeAttribute(attr.name)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Methods */}
          <div className="mb-6">
            <h4 className="text-md mb-2 font-medium text-gray-800">
              Methods ({selectedMethods.length})
            </h4>
            <div className="min-h-20 rounded-lg bg-gray-50 p-4">
              {selectedMethods.length === 0 ? (
                <div className="text-gray-500">No methods selected</div>
              ) : (
                <div className="space-y-2">
                  {selectedMethods.map((method) => (
                    <div
                      key={method.name}
                      className="flex items-center justify-between rounded bg-white p-2"
                    >
                      <span className="text-sm">
                        {method.name}({method.params.join(", ")})
                      </span>
                      <button
                        onClick={() => removeMethod(method.name)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Code Preview */}
          <div className="mb-6">
            <h4 className="text-md mb-2 font-medium text-gray-800">
              Generated Code
            </h4>
            <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-green-400">
              <code>{generateClassCode()}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={checkClass}
          disabled={
            selectedAttributes.length === 0 && selectedMethods.length === 0
          }
          className="rounded-lg bg-purple-600 px-8 py-3 text-lg font-bold text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Check Class Design
        </button>
      </div>
    </div>
  );
}
