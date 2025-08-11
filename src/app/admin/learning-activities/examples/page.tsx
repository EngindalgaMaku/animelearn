"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Copy,
  Eye,
  EyeOff,
  Code,
  BookOpen,
  Lightbulb,
  Play,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const activityExamples = {
  algorithm_visualization: {
    name: "Algorithm Visualization",
    icon: "🔄",
    color: "from-purple-500 to-violet-600",
    description: "Step-by-step algorithm learning with visual components",
    example: {
      title: "Bubble Sort Algorithm Visualization",
      description:
        "Learn how bubble sort works through interactive visualization",
      content: {
        steps: [
          {
            id: 1,
            title: "Initialize Array",
            description: "Start with an unsorted array of numbers",
            code: "arr = [64, 34, 25, 12, 22, 11, 90]",
            visualization: "array_display",
          },
          {
            id: 2,
            title: "Compare Adjacent Elements",
            description: "Compare the first two elements and swap if needed",
            code: "if arr[0] > arr[1]: swap(arr[0], arr[1])",
            visualization: "comparison_highlight",
          },
          {
            id: 3,
            title: "Continue Comparison",
            description: "Move through the array comparing adjacent pairs",
            code: "for i in range(len(arr)-1): ...",
            visualization: "step_by_step",
          },
        ],
        visualizations: [
          "array_display",
          "comparison_highlight",
          "step_by_step",
        ],
        algorithm: "bubble_sort",
        complexity: {
          time: "O(n²)",
          space: "O(1)",
        },
      },
    },
  },

  matching: {
    name: "Matching",
    icon: "🔗",
    color: "from-blue-500 to-cyan-600",
    description: "Connect concepts and build associations",
    example: {
      title: "Python Built-in Functions Matching",
      description: "Match Python functions with their descriptions",
      content: {
        pairs: [
          { left: "len()", right: "Returns the length of an object", id: 1 },
          { left: "str()", right: "Converts value to string", id: 2 },
          { left: "int()", right: "Converts value to integer", id: 3 },
          { left: "print()", right: "Displays output to console", id: 4 },
          { left: "input()", right: "Gets user input from keyboard", id: 5 },
          { left: "type()", right: "Returns the type of an object", id: 6 },
        ],
        instructions:
          "Drag the functions from the left to match with their correct descriptions on the right.",
        timeLimit: 300,
        shuffleOptions: true,
      },
    },
  },

  data_exploration: {
    name: "Data Explorer",
    icon: "🔍",
    color: "from-green-500 to-emerald-600",
    description: "Interactive data analysis activities",
    example: {
      title: "Student Performance Data Analysis",
      description: "Explore student grade data using pandas operations",
      content: {
        dataset: {
          name: "student_grades.csv",
          preview: [
            { name: "Alice", math: 85, science: 92, english: 78 },
            { name: "Bob", math: 76, science: 85, english: 88 },
            { name: "Charlie", math: 92, science: 89, english: 84 },
          ],
        },
        tasks: [
          {
            id: 1,
            task: "Find the average math score",
            code: "data['math'].mean()",
            expected: 84.33,
            hint: "Use the .mean() method on the math column",
          },
          {
            id: 2,
            task: "Create a histogram of science scores",
            code: "data['science'].hist()",
            expected: "histogram_plot",
            hint: "Use the .hist() method to create a histogram",
          },
          {
            id: 3,
            task: "Find students with math score > 80",
            code: "data[data['math'] > 80]",
            expected: "filtered_dataframe",
            hint: "Use boolean indexing with a condition",
          },
        ],
        tools: ["pandas", "matplotlib", "numpy"],
        learningGoals: [
          "Data filtering",
          "Statistical analysis",
          "Data visualization",
        ],
      },
    },
  },

  interactive_demo: {
    name: "Interactive Demo",
    icon: "🎪",
    color: "from-orange-500 to-red-600",
    description: "Guided tutorials and interactive demonstrations",
    example: {
      title: "Python Variables Interactive Tutorial",
      description: "Learn Python variable concepts through guided examples",
      content: {
        sections: [
          {
            id: 1,
            title: "What are Variables?",
            content:
              "Variables are containers that store data values. In Python, you create a variable by assigning a value to it.",
            interactive: {
              type: "code_input",
              prompt: "Try creating a variable called 'name' with your name:",
              template: "name = ",
              validation: "variable_assignment",
            },
          },
          {
            id: 2,
            title: "Variable Types",
            content:
              "Python automatically determines the type of variable based on the value you assign.",
            interactive: {
              type: "multiple_examples",
              examples: [
                {
                  code: "age = 25",
                  type: "int",
                  description: "Integer number",
                },
                {
                  code: "price = 19.99",
                  type: "float",
                  description: "Decimal number",
                },
                {
                  code: "message = 'Hello'",
                  type: "str",
                  description: "Text string",
                },
              ],
            },
          },
        ],
        navigation: { allowSkip: true, showProgress: true },
        interactiveElements: ["code_input", "multiple_choice", "drag_drop"],
      },
    },
  },

  drag_drop: {
    name: "Drag & Drop",
    icon: "🎯",
    color: "from-indigo-500 to-blue-600",
    description: "Visual code organization challenges",
    example: {
      title: "Build Python Functions with Drag & Drop",
      description: "Arrange code blocks to create a working function",
      content: {
        codeBlocks: [
          {
            id: 1,
            code: "def calculate_area(length, width):",
            type: "function_def",
            order: 1,
          },
          {
            id: 2,
            code: "    area = length * width",
            type: "calculation",
            order: 2,
          },
          { id: 3, code: "    return area", type: "return", order: 3 },
          { id: 4, code: "print(result)", type: "output", order: 5 },
          {
            id: 5,
            code: "result = calculate_area(10, 5)",
            type: "function_call",
            order: 4,
          },
        ],
        targetAreas: [
          {
            id: "function_definition",
            label: "Function Definition",
            accepts: ["function_def"],
          },
          {
            id: "function_body",
            label: "Function Body",
            accepts: ["calculation", "return"],
          },
          {
            id: "function_usage",
            label: "Using the Function",
            accepts: ["function_call", "output"],
          },
        ],
        correctOrder: [1, 2, 3, 5, 4],
        feedback: {
          correct: "Great! You've built a complete function.",
          hints: [
            "Functions start with 'def' keyword",
            "Function body should be indented",
            "Don't forget to return the result",
          ],
        },
      },
    },
  },

  fill_blanks: {
    name: "Fill Blanks",
    icon: "✏️",
    color: "from-yellow-500 to-orange-600",
    description: "Complete code with missing parts",
    example: {
      title: "Python If-Else Statements",
      description:
        "Fill in the missing parts to complete the conditional logic",
      content: {
        codeTemplate: `age = int(input("Enter your age: "))

_____ age >= 18:
    print("You are an _____")
_____ age >= 13:
    print("You are a teenager")
_____:
    print("You are a child")`,
        blanks: [
          {
            id: 1,
            answer: "if",
            position: 0,
            hint: "Keyword to start a condition",
          },
          { id: 2, answer: "adult", position: 1, hint: "Someone 18 or older" },
          {
            id: 3,
            answer: "elif",
            position: 2,
            hint: "Keyword for additional condition",
          },
          {
            id: 4,
            answer: "else",
            position: 3,
            hint: "Keyword for final fallback condition",
          },
        ],
        hints: [
          "Use 'if' to start a condition",
          "Use 'elif' for additional conditions",
          "Use 'else' for the final case",
          "Think about age categories",
        ],
        validation: {
          checkSyntax: true,
          runTests: true,
          testCases: [
            { input: "20", expected: "You are an adult" },
            { input: "15", expected: "You are a teenager" },
            { input: "10", expected: "You are a child" },
          ],
        },
      },
    },
  },

  interactive_coding: {
    name: "Code Lab",
    icon: "💻",
    color: "from-cyan-500 to-blue-600",
    description: "Full hands-on coding experience",
    example: {
      title: "Build a Number Guessing Game",
      description:
        "Create a complete number guessing game with user input and logic",
      content: {
        problem:
          "Create a number guessing game where the computer picks a random number between 1-100 and the user has to guess it.",
        requirements: [
          "Generate a random number between 1 and 100",
          "Ask the user to guess the number",
          "Provide feedback if the guess is too high or too low",
          "Count the number of attempts",
          "Congratulate the user when they guess correctly",
        ],
        starterCode: `import random

# Generate random number
secret_number = random.randint(1, 100)
attempts = 0

print("Welcome to the Number Guessing Game!")
print("I'm thinking of a number between 1 and 100")

# Your code here`,
        solution: `import random

secret_number = random.randint(1, 100)
attempts = 0

print("Welcome to the Number Guessing Game!")
print("I'm thinking of a number between 1 and 100")

while True:
    guess = int(input("Enter your guess: "))
    attempts += 1
    
    if guess == secret_number:
        print(f"Congratulations! You found it in {attempts} attempts!")
        break
    elif guess < secret_number:
        print("Too low! Try again.")
    else:
        print("Too high! Try again.")`,
        testCases: [
          {
            description: "Game should generate a number between 1-100",
            test: "1 <= secret_number <= 100",
          },
          {
            description: "Game should count attempts",
            test: "attempts variable exists",
          },
          {
            description: "Game should provide feedback",
            test: "contains feedback messages",
          },
        ],
        hints: [
          "Use a while loop to keep asking for guesses",
          "Compare the guess with the secret number",
          "Increment the attempts counter each time",
          "Use if/elif/else for different cases",
        ],
      },
    },
  },

  code_builder: {
    name: "Code Builder",
    icon: "🏗️",
    color: "from-teal-500 to-green-600",
    description: "Build complete programs step by step",
    example: {
      title: "Build a Modular Grade Calculator System",
      description:
        "Create a complete grade calculator with multiple functions and error handling",
      content: {
        project: "Grade Calculator System",
        steps: [
          {
            id: 1,
            title: "Create Input Function",
            description:
              "Build a function to safely get numeric input from user",
            code: `def get_grade_input(subject):
    while True:
        try:
            grade = float(input(f"Enter grade for {subject}: "))
            if 0 <= grade <= 100:
                return grade
            else:
                print("Grade must be between 0 and 100")
        except ValueError:
            print("Please enter a valid number")`,
            tests: [
              "Handles invalid input",
              "Validates grade range",
              "Returns float value",
            ],
          },
          {
            id: 2,
            title: "Calculate Average",
            description: "Create a function to calculate the average of grades",
            code: `def calculate_average(grades):
    if not grades:
        return 0
    return sum(grades) / len(grades)`,
            tests: ["Handles empty list", "Calculates correct average"],
          },
          {
            id: 3,
            title: "Determine Letter Grade",
            description: "Convert numeric average to letter grade",
            code: `def get_letter_grade(average):
    if average >= 90:
        return 'A'
    elif average >= 80:
        return 'B'
    elif average >= 70:
        return 'C'
    elif average >= 60:
        return 'D'
    else:
        return 'F'`,
            tests: ["Correct grade boundaries", "Returns proper letter"],
          },
        ],
        finalProject: {
          description: "Combine all functions into a main program",
          requirements: [
            "Ask for multiple subject grades",
            "Calculate overall average",
            "Display letter grade",
            "Handle errors gracefully",
          ],
        },
      },
    },
  },

  class_builder: {
    name: "Class Builder",
    icon: "🏛️",
    color: "from-purple-500 to-pink-600",
    description: "Object-oriented programming challenges",
    example: {
      title: "Design a Student Management System with OOP",
      description:
        "Create a Student class with properties and methods for managing student data",
      content: {
        className: "Student",
        attributes: [
          { name: "name", type: "str", description: "Student's full name" },
          {
            name: "student_id",
            type: "str",
            description: "Unique student identifier",
          },
          {
            name: "grades",
            type: "list",
            description: "List of student's grades",
          },
          { name: "age", type: "int", description: "Student's age" },
        ],
        methods: [
          {
            name: "__init__",
            description: "Initialize a new student",
            parameters: ["name", "student_id", "age"],
            code: `def __init__(self, name, student_id, age):
    self.name = name
    self.student_id = student_id
    self.age = age
    self.grades = []`,
          },
          {
            name: "add_grade",
            description: "Add a new grade to the student's record",
            parameters: ["grade"],
            code: `def add_grade(self, grade):
    if 0 <= grade <= 100:
        self.grades.append(grade)
    else:
        raise ValueError("Grade must be between 0 and 100")`,
          },
          {
            name: "get_average",
            description: "Calculate the student's average grade",
            parameters: [],
            code: `def get_average(self):
    if not self.grades:
        return 0
    return sum(self.grades) / len(self.grades)`,
          },
          {
            name: "display_info",
            description: "Display student information",
            parameters: [],
            code: `def display_info(self):
    avg = self.get_average()
    print(f"Student: {self.name}")
    print(f"ID: {self.student_id}")
    print(f"Age: {self.age}")
    print(f"Average Grade: {avg:.2f}")`,
          },
        ],
        inheritance: {
          parentClass: "Person",
          childClasses: ["Student", "Teacher"],
        },
        examples: [
          "student1 = Student('Alice Johnson', 'S001', 20)",
          "student1.add_grade(85)",
          "student1.add_grade(92)",
          "print(student1.get_average())",
          "student1.display_info()",
        ],
        challenges: [
          "Add a method to remove grades",
          "Implement grade validation",
          "Add support for weighted grades",
          "Create a StudentManager class",
        ],
      },
    },
  },

  memory_game: {
    name: "Memory Game",
    icon: "🧠",
    color: "from-pink-500 to-rose-600",
    description: "Pattern recognition and memory challenges",
    example: {
      title: "Python Syntax Memory Challenge",
      description: "Memorize and recall Python syntax patterns and keywords",
      content: {
        patterns: [
          {
            sequence: ["for", "in", "range"],
            category: "loops",
            description: "For loop structure",
            example: "for i in range(10):",
          },
          {
            sequence: ["if", "elif", "else"],
            category: "conditionals",
            description: "Conditional statements",
            example: "if condition: ... elif other: ... else: ...",
          },
          {
            sequence: ["try", "except", "finally"],
            category: "error_handling",
            description: "Exception handling",
            example: "try: ... except Exception: ... finally: ...",
          },
          {
            sequence: ["def", "return", "pass"],
            category: "functions",
            description: "Function definition",
            example: "def function(): return value",
          },
        ],
        gameSettings: {
          difficulty: "medium",
          rounds: 3,
          timePerPattern: 8,
          timeToRecall: 15,
        },
        scoring: {
          perfectMatch: 100,
          partialMatch: 50,
          timeBonus: 10,
          difficultyMultiplier: 1.5,
        },
        levels: [
          { name: "Beginner", patternLength: 3, timeLimit: 10 },
          { name: "Intermediate", patternLength: 4, timeLimit: 8 },
          { name: "Advanced", patternLength: 5, timeLimit: 6 },
        ],
      },
    },
  },

  quiz: {
    name: "Quiz",
    icon: "❓",
    color: "from-emerald-500 to-teal-600",
    description: "Knowledge assessment with multiple choice",
    example: {
      title: "Algorithm Complexity & Big O Quiz",
      description:
        "Test your understanding of algorithm complexity and Big O notation",
      content: {
        questions: [
          {
            id: 1,
            question: "What is the time complexity of binary search?",
            options: ["O(log n)", "O(n)", "O(n log n)", "O(n²)"],
            correct: 0,
            explanation:
              "Binary search divides the search space in half with each comparison, resulting in O(log n) time complexity.",
            difficulty: "medium",
            category: "algorithms",
          },
          {
            id: 2,
            question: "Which data structure is best for implementing a queue?",
            options: ["Array", "Linked List", "Stack", "Binary Tree"],
            correct: 1,
            explanation:
              "Linked lists allow efficient insertion at one end and removal at the other, making them ideal for queues.",
            difficulty: "easy",
            category: "data_structures",
          },
          {
            id: 3,
            question: "What is the space complexity of merge sort?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correct: 2,
            explanation:
              "Merge sort requires additional space for the temporary arrays used during merging, resulting in O(n) space complexity.",
            difficulty: "hard",
            category: "algorithms",
          },
        ],
        settings: {
          timeLimit: 300,
          passingScore: 70,
          showExplanations: true,
          randomizeQuestions: true,
          allowRetake: true,
        },
        feedback: {
          excellent:
            "Excellent! You have a strong understanding of algorithms.",
          good: "Good work! Review the explanations for missed questions.",
          needsWork: "Keep studying! Focus on the fundamental concepts.",
        },
      },
    },
  },
};

export default function ActivityExamples() {
  const { user, loading } = useAuth();
  const [selectedType, setSelectedType] = useState<string>(
    "algorithm_visualization"
  );
  const [showCode, setShowCode] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Example copied to clipboard!");
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="mt-2 text-gray-600">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  const currentExample =
    activityExamples[selectedType as keyof typeof activityExamples];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <div className="py-6 lg:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-6 shadow-xl backdrop-blur-sm lg:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link
                    href="/admin/learning-activities"
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </Link>
                  <div>
                    <h1 className="bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-3xl font-bold text-transparent lg:text-4xl">
                      🎯 Activity Examples & Templates
                    </h1>
                    <p className="text-gray-600">
                      Comprehensive examples for all 11 activity types with
                      copy-paste templates
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Activity Type Selector */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
                <h2 className="mb-6 text-xl font-bold text-gray-900">
                  🎮 Activity Types
                </h2>

                <div className="space-y-2">
                  {Object.entries(activityExamples).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedType(key)}
                      className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                        selectedType === key
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r ${config.color} text-white`}
                        >
                          <span className="text-sm">{config.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {config.name}
                          </h3>
                          <p className="line-clamp-1 text-xs text-gray-600">
                            {config.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Example Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Example Overview */}
              <div className="rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${currentExample.color} text-white shadow-lg`}
                    >
                      <span className="text-xl">{currentExample.icon}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {currentExample.name}
                      </h2>
                      <p className="text-gray-600">
                        {currentExample.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowCode(!showCode)}
                      className="flex items-center space-x-2 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200"
                    >
                      {showCode ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span>{showCode ? "Hide" : "Show"} JSON</span>
                    </button>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          JSON.stringify(
                            currentExample.example.content,
                            null,
                            2
                          )
                        )
                      }
                      className="flex items-center space-x-2 rounded-lg bg-indigo-100 px-3 py-2 text-sm text-indigo-700 transition-colors hover:bg-indigo-200"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy Template</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                      📝 Example Activity
                    </h3>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="font-semibold text-gray-900">
                        {currentExample.example.title}
                      </h4>
                      <p className="text-gray-600">
                        {currentExample.example.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* JSON Template */}
              {showCode && (
                <div className="rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      📄 JSON Template
                    </h3>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          JSON.stringify(
                            currentExample.example.content,
                            null,
                            2
                          )
                        )
                      }
                      className="flex items-center space-x-1 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <div className="rounded-lg bg-gray-900 p-4">
                    <pre className="max-h-96 overflow-auto text-sm text-green-400">
                      {JSON.stringify(currentExample.example.content, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Usage Instructions */}
              <div className="rounded-xl border border-white/60 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  💡 How to Use This Template
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Copy the Template
                      </h4>
                      <p className="text-gray-600">
                        Click "Copy Template" to copy the JSON structure to your
                        clipboard.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Customize the Content
                      </h4>
                      <p className="text-gray-600">
                        Modify the template to match your specific learning
                        objectives and content.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        Create Activity
                      </h4>
                      <p className="text-gray-600">
                        Paste the JSON into the content field when creating a
                        new activity.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center space-x-4">
                  <Link
                    href="/admin/learning-activities/create"
                    className="flex items-center space-x-2 rounded-lg bg-indigo-100 px-4 py-2 text-indigo-700 transition-colors hover:bg-indigo-200"
                  >
                    <Play className="h-4 w-4" />
                    <span>Create New Activity</span>
                  </Link>
                  <Link
                    href="/wiki"
                    className="flex items-center space-x-2 rounded-lg bg-green-100 px-4 py-2 text-green-700 transition-colors hover:bg-green-200"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>View Documentation</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
