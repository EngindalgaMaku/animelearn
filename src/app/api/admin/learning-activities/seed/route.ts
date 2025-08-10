import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const learningActivities = [
  // PYTHON BASICS CATEGORY
  {
    title: "Python Variables & Data Types Explorer",
    description:
      "Interactive exploration of Python's fundamental data types and how to work with variables",
    activityType: "drag_drop",
    category: "Python Basics",
    difficulty: 1,
    diamondReward: 15,
    experienceReward: 30,
    estimatedMinutes: 8,
    tags: ["variables", "data-types", "python", "beginner"],
    content: {
      instructions: "Drag each value to its correct data type category",
      items: [
        { id: 1, value: "42", type: "int" },
        { id: 2, value: "3.14", type: "float" },
        { id: 3, value: "'Hello World'", type: "str" },
        { id: 4, value: "True", type: "bool" },
        { id: 5, value: "[1, 2, 3]", type: "list" },
        { id: 6, value: "{'name': 'John'}", type: "dict" },
        { id: 7, value: "(1, 2, 3)", type: "tuple" },
        { id: 8, value: "{1, 2, 3}", type: "set" },
      ],
      categories: [
        { id: "int", name: "Integer", description: "Whole numbers" },
        { id: "float", name: "Float", description: "Decimal numbers" },
        { id: "str", name: "String", description: "Text data" },
        { id: "bool", name: "Boolean", description: "True/False values" },
        { id: "list", name: "List", description: "Ordered collection" },
        { id: "dict", name: "Dictionary", description: "Key-value pairs" },
        { id: "tuple", name: "Tuple", description: "Immutable sequence" },
        { id: "set", name: "Set", description: "Unique elements" },
      ],
    },
    settings: {
      timeLimit: 300,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
  },

  {
    title: "Python Syntax Memory Challenge",
    description:
      "Test your memory of Python syntax patterns and code structures",
    activityType: "memory_game",
    category: "Python Basics",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 40,
    estimatedMinutes: 10,
    tags: ["syntax", "memory", "patterns", "python"],
    content: {
      instructions:
        "Match the Python code snippets with their outputs or descriptions",
      pairs: [
        { id: 1, card1: "print('Hello')", card2: "Hello" },
        { id: 2, card1: "len([1,2,3])", card2: "3" },
        { id: 3, card1: "5 ** 2", card2: "25" },
        { id: 4, card1: "'abc'.upper()", card2: "ABC" },
        { id: 5, card1: "range(3)", card2: "[0, 1, 2]" },
        { id: 6, card1: "bool([])", card2: "False" },
        { id: 7, card1: "str(42)", card2: "'42'" },
        { id: 8, card1: "max([1,5,3])", card2: "5" },
      ],
      timeLimit: 240,
      shuffleCards: true,
    },
    settings: {
      maxFlips: 30,
      showTimer: true,
    },
  },

  {
    title: "Python Control Flow Quiz",
    description: "Master Python's if statements, loops, and control structures",
    activityType: "quiz",
    category: "Python Basics",
    difficulty: 2,
    diamondReward: 25,
    experienceReward: 50,
    estimatedMinutes: 12,
    tags: ["control-flow", "if-statements", "loops", "quiz"],
    content: {
      instructions: "Answer questions about Python control flow structures",
      questions: [
        {
          id: 1,
          question:
            "What will this code print?\n\nfor i in range(3):\n    if i == 1:\n        continue\n    print(i)",
          options: ["0 1 2", "0 2", "1 2", "0 1"],
          correct: 1,
          explanation:
            "The continue statement skips i=1, so only 0 and 2 are printed.",
        },
        {
          id: 2,
          question: "Which loop will execute exactly 5 times?",
          options: [
            "for i in range(5):",
            "for i in range(1, 5):",
            "for i in range(0, 6):",
            "while i < 5:",
          ],
          correct: 0,
          explanation:
            "range(5) creates [0, 1, 2, 3, 4] which has exactly 5 elements.",
        },
        {
          id: 3,
          question: "What's the output of: x = 10 if True else 20",
          options: ["10", "20", "True", "Error"],
          correct: 0,
          explanation:
            "The ternary operator returns 10 because the condition is True.",
        },
      ],
      timeLimit: 360,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {},
  },

  // DATA STRUCTURES CATEGORY
  {
    title: "List Operations Workshop",
    description: "Master Python list methods through interactive exercises",
    activityType: "fill_blanks",
    category: "Data Structures",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 45,
    estimatedMinutes: 15,
    tags: ["lists", "methods", "operations", "practice"],
    content: {
      instructions: "Fill in the missing code to complete the list operations",
      exercises: [
        {
          id: 1,
          description: "Add an item to the end of a list",
          template: "my_list = [1, 2, 3]\nmy_list.____('4')\nprint(my_list)",
          blanks: [{ id: "blank1", answer: "append", position: 0 }],
          expectedOutput: "[1, 2, 3, '4']",
        },
        {
          id: 2,
          description: "Remove the last item from a list",
          template:
            "fruits = ['apple', 'banana', 'orange']\nlast_fruit = fruits.____()\nprint(last_fruit)",
          blanks: [{ id: "blank2", answer: "pop", position: 0 }],
          expectedOutput: "orange",
        },
        {
          id: 3,
          description: "Insert an item at a specific position",
          template: "numbers = [1, 3, 4]\nnumbers.____(1, 2)\nprint(numbers)",
          blanks: [{ id: "blank3", answer: "insert", position: 0 }],
          expectedOutput: "[1, 2, 3, 4]",
        },
        {
          id: 4,
          description: "Sort a list in reverse order",
          template:
            "scores = [85, 92, 78, 96]\nscores.sort(____=True)\nprint(scores)",
          blanks: [{ id: "blank4", answer: "reverse", position: 0 }],
          expectedOutput: "[96, 92, 85, 78]",
        },
      ],
    },
    settings: {
      timeLimit: 600,
      allowHints: true,
      caseSensitive: false,
    },
  },

  {
    title: "Dictionary Deep Dive",
    description: "Explore Python dictionaries with hands-on challenges",
    activityType: "interactive_coding",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 60,
    estimatedMinutes: 18,
    tags: ["dictionaries", "key-value", "methods", "advanced"],
    content: {
      instructions: "Complete the dictionary manipulation challenges",
      problem:
        "Create a dictionary to manage student data and perform operations on it.",
      starterCode:
        "# Create a dictionary to store student grades\nstudents = {}\n\n# Your code here",
      solution:
        "students = {'Alice': 85, 'Bob': 92, 'Charlie': 78}\naverage = sum(students.values()) / len(students)\nprint(f'Average: {average}')",
      testCases: [
        { input: "", expectedOutput: "Dictionary operations completed" },
      ],
      language: "Python",
      hints: [
        "Use student names as keys and grades as values",
        "Use sum() and len() for average calculation",
        "Use max() with a key function",
      ],
    },
    settings: {
      timeLimit: 900,
      enableCodeCompletion: true,
      showTestCases: true,
    },
  },

  // ALGORITHMS CATEGORY
  {
    title: "Sorting Algorithm Visualizer",
    description:
      "Understand how different sorting algorithms work through visualization",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 4,
    diamondReward: 40,
    experienceReward: 80,
    estimatedMinutes: 25,
    tags: ["sorting", "algorithms", "visualization", "complexity"],
    content: {
      algorithm: "Bubble Sort",
      description: "Compare adjacent elements and swap if needed",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      explanation:
        "Bubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.",
      initialData: [5, 2, 8, 1, 9],
      steps: [
        {
          id: 1,
          description: "Start with the first pair of adjacent elements",
          data: [5, 2, 8, 1, 9],
          highlights: [0, 1],
          comparison: [0, 1],
          action: "Compare arr[0] = 5 and arr[1] = 2",
        },
        {
          id: 2,
          description: "Exchange positions if left element is greater",
          data: [2, 5, 8, 1, 9],
          highlights: [0, 1],
          comparison: [],
          action: "Swapped 5 and 2 (5 > 2)",
        },
        {
          id: 3,
          description: "Continue with the next adjacent pair",
          data: [2, 5, 8, 1, 9],
          highlights: [1, 2],
          comparison: [1, 2],
          action: "Compare arr[1] = 5 and arr[2] = 8",
        },
        {
          id: 4,
          description: "No swap needed, move to next pair",
          data: [2, 5, 8, 1, 9],
          highlights: [2, 3],
          comparison: [2, 3],
          action: "Compare arr[2] = 8 and arr[3] = 1",
        },
        {
          id: 5,
          description: "Swap elements since 8 > 1",
          data: [2, 5, 1, 8, 9],
          highlights: [2, 3],
          comparison: [],
          action: "Swapped 8 and 1 (8 > 1)",
        },
        {
          id: 6,
          description: "Compare last pair of elements",
          data: [2, 5, 1, 8, 9],
          highlights: [3, 4],
          comparison: [3, 4],
          action: "Compare arr[3] = 8 and arr[4] = 9",
        },
        {
          id: 7,
          description: "No swap needed - end of first pass",
          data: [2, 5, 1, 8, 9],
          highlights: [4],
          comparison: [],
          action: "9 is in correct position",
        },
        {
          id: 8,
          description: "Start second pass",
          data: [2, 5, 1, 8, 9],
          highlights: [0, 1],
          comparison: [0, 1],
          action: "Compare arr[0] = 2 and arr[1] = 5",
        },
        {
          id: 9,
          description: "Continue to next pair",
          data: [2, 5, 1, 8, 9],
          highlights: [1, 2],
          comparison: [1, 2],
          action: "Compare arr[1] = 5 and arr[2] = 1",
        },
        {
          id: 10,
          description: "Swap 5 and 1",
          data: [2, 1, 5, 8, 9],
          highlights: [1, 2],
          comparison: [],
          action: "Swapped 5 and 1 (5 > 1)",
        },
        {
          id: 11,
          description: "Continue sorting process",
          data: [2, 1, 5, 8, 9],
          highlights: [2, 3],
          comparison: [2, 3],
          action: "Compare arr[2] = 5 and arr[3] = 8",
        },
        {
          id: 12,
          description: "Final result - array is sorted",
          data: [1, 2, 5, 8, 9],
          highlights: [],
          comparison: [],
          action: "Sorting complete! All elements in order.",
        },
      ],
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
  },

  {
    title: "Big O Notation Master",
    description: "Learn to analyze time and space complexity of algorithms",
    activityType: "matching",
    category: "Algorithms",
    difficulty: 4,
    diamondReward: 35,
    experienceReward: 70,
    estimatedMinutes: 20,
    tags: ["big-o", "complexity", "analysis", "performance"],
    content: {
      instructions: "Match each code snippet with its time complexity",
      pairs: [
        {
          id: "1",
          left: "for i in range(n):\n    print(i)",
          right: "O(n)",
          explanation: "Single loop iterating n times",
        },
        {
          id: "2",
          left: "for i in range(n):\n    for j in range(n):\n        print(i, j)",
          right: "O(n²)",
          explanation: "Nested loops, each running n times",
        },
        {
          id: "3",
          left: "def binary_search(arr, target):\n    # implementation",
          right: "O(log n)",
          explanation: "Dividing search space in half each time",
        },
        {
          id: "4",
          left: "print('Hello World')",
          right: "O(1)",
          explanation: "Constant time operation",
        },
        {
          id: "5",
          left: "for i in range(n):\n    for j in range(i):\n        print(i, j)",
          right: "O(n²)",
          explanation: "Triangular pattern, still quadratic",
        },
      ],
      allowShuffle: true,
      showProgress: true,
    },
    settings: {
      showExplanations: true,
      allowMultipleAttempts: true,
      timeLimit: 600,
    },
  },

  // FUNCTIONS & OOP CATEGORY
  {
    title: "Function Factory",
    description:
      "Build and test Python functions with different parameters and return types",
    activityType: "code_builder",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 25,
    experienceReward: 55,
    estimatedMinutes: 20,
    tags: ["functions", "parameters", "return", "scope"],
    content: {
      instructions: "Create functions according to the specifications",
      targetOutput: "Function created successfully",
      availableBlocks: [
        {
          id: "def_calc",
          code: "def calculate(operation, num1, num2):",
          type: "function",
          description: "Function definition for calculator",
        },
        {
          id: "if_add",
          code: "if operation == 'add':",
          type: "condition",
          description: "Check for addition operation",
        },
        {
          id: "return_add",
          code: "return num1 + num2",
          type: "return",
          description: "Return sum of numbers",
        },
        {
          id: "elif_mult",
          code: "elif operation == 'multiply':",
          type: "condition",
          description: "Check for multiplication operation",
        },
        {
          id: "return_mult",
          code: "return num1 * num2",
          type: "return",
          description: "Return product of numbers",
        },
      ],
      language: "Python",
      solution: [
        "def calculate(operation, num1, num2):",
        "    if operation == 'add':",
        "        return num1 + num2",
        "    elif operation == 'multiply':",
        "        return num1 * num2",
      ],
    },
    settings: {
      timeLimit: 600,
      codeTemplate: "def function_name():\n    # Your code here\n    pass",
      runTests: true,
      showOutput: true,
    },
  },

  {
    title: "Class Design Challenge",
    description:
      "Design and implement Python classes with proper encapsulation",
    activityType: "class_builder",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 45,
    experienceReward: 90,
    estimatedMinutes: 30,
    tags: ["classes", "oop", "encapsulation", "methods"],
    content: {
      instructions: "Build a complete class with all required features",
      className: "Pet",
      language: "Python",
      requiredProperties: [
        { name: "name", type: "str", visibility: "public" },
        { name: "species", type: "str", visibility: "public" },
        { name: "age", type: "int", visibility: "public" },
        { name: "hunger_level", type: "int", visibility: "private" },
      ],
      requiredMethods: [
        {
          name: "feed",
          returnType: "None",
          parameters: [],
          visibility: "public",
        },
        {
          name: "play",
          returnType: "None",
          parameters: [],
          visibility: "public",
        },
        {
          name: "get_status",
          returnType: "str",
          parameters: [],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "name",
          type: "str",
          visibility: "public",
          description: "Pet's name",
        },
        {
          name: "species",
          type: "str",
          visibility: "public",
          description: "Pet species",
        },
        {
          name: "age",
          type: "int",
          visibility: "public",
          description: "Pet's age",
        },
        {
          name: "hunger_level",
          type: "int",
          visibility: "private",
          description: "Hunger level (0-100)",
        },
        {
          name: "happiness",
          type: "int",
          visibility: "public",
          description: "Happiness level",
        },
      ],
      availableMethods: [
        {
          name: "feed",
          returnType: "None",
          parameters: [],
          visibility: "public",
          description: "Feed the pet",
        },
        {
          name: "play",
          returnType: "None",
          parameters: [],
          visibility: "public",
          description: "Play with pet",
        },
        {
          name: "get_status",
          returnType: "str",
          parameters: [],
          visibility: "public",
          description: "Get pet status",
        },
        {
          name: "age_up",
          returnType: "None",
          parameters: [],
          visibility: "public",
          description: "Age the pet",
        },
      ],
      allowCustom: true,
      hints: [
        "Start with the __init__ method",
        "Use private attributes for internal state",
        "Implement methods that modify pet's state",
        "Return meaningful status information",
      ],
    },
    settings: {
      timeLimit: 1800,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
  },

  // WEB DEVELOPMENT CATEGORY
  {
    title: "HTML Structure Builder",
    description: "Learn to build proper HTML document structure",
    activityType: "drag_drop",
    category: "Web Development",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 40,
    estimatedMinutes: 15,
    tags: ["html", "structure", "elements", "web"],
    content: {
      instructions: "Drag HTML elements to create a proper webpage structure",
      items: [
        { id: 1, value: "<!DOCTYPE html>", type: "doctype" },
        { id: 2, value: "<html>", type: "html" },
        { id: 3, value: "<head>", type: "head" },
        { id: 4, value: "<title>My Page</title>", type: "title" },
        { id: 5, value: "<meta charset='UTF-8'>", type: "meta" },
        { id: 6, value: "<body>", type: "body" },
        { id: 7, value: "<header>", type: "header" },
        { id: 8, value: "<h1>Welcome</h1>", type: "h1" },
        { id: 9, value: "<main>", type: "main" },
        { id: 10, value: "<p>Content here</p>", type: "paragraph" },
        { id: 11, value: "<footer>", type: "footer" },
      ],
      categories: [
        {
          id: "doctype",
          name: "Document Type",
          description: "HTML5 declaration",
        },
        { id: "html", name: "HTML Root", description: "Root element" },
        { id: "head", name: "Head Section", description: "Metadata container" },
        { id: "title", name: "Page Title", description: "Document title" },
        { id: "meta", name: "Metadata", description: "Character encoding" },
        { id: "body", name: "Body Section", description: "Content container" },
        { id: "header", name: "Header", description: "Page header" },
        { id: "h1", name: "Main Heading", description: "Primary heading" },
        { id: "main", name: "Main Content", description: "Primary content" },
        { id: "paragraph", name: "Paragraph", description: "Text content" },
        { id: "footer", name: "Footer", description: "Page footer" },
      ],
    },
    settings: {
      timeLimit: 600,
      showNesting: true,
      validateStructure: true,
      highlightErrors: true,
    },
  },

  {
    title: "CSS Selector Challenge",
    description: "Master CSS selectors through interactive examples",
    activityType: "interactive_demo",
    category: "Web Development",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 60,
    estimatedMinutes: 22,
    tags: ["css", "selectors", "styling", "interactive"],
    content: {
      title: "CSS Selector Mastery",
      description: "Learn to write effective CSS selectors",
      steps: [
        {
          id: 1,
          title: "Element Selectors",
          description: "Target elements by their tag name",
          code: "p { color: blue; }",
          explanation:
            "This selects all <p> elements and makes their text blue",
          interactive: true,
          questions: [
            {
              question: "How do you select all div elements?",
              options: ["div", ".div", "#div", "div()"],
              correct: 0,
            },
          ],
        },
        {
          id: 2,
          title: "Class Selectors",
          description: "Target elements by their class attribute",
          code: ".highlight { background: yellow; }",
          explanation:
            "This selects all elements with class='highlight' and gives them a yellow background",
          interactive: true,
          questions: [
            {
              question: "What character is used for class selectors?",
              options: ["#", ".", "*", "@"],
              correct: 1,
            },
          ],
        },
        {
          id: 3,
          title: "ID Selectors",
          description: "Target a specific element by its ID",
          code: "#main-header { font-size: 24px; }",
          explanation:
            "This selects the element with id='main-header' and sets its font size",
          interactive: true,
        },
        {
          id: 4,
          title: "Descendant Selectors",
          description: "Target elements inside other elements",
          code: ".container p { margin: 10px; }",
          explanation:
            "This selects all <p> elements inside elements with class='container'",
          interactive: true,
        },
      ],
      timeLimit: 900,
      language: "CSS",
    },
    settings: {
      livePreview: true,
      showResults: true,
      allowHints: true,
    },
  },

  // DATA SCIENCE CATEGORY
  {
    title: "Python Data Analysis Basics",
    description:
      "Introduction to data manipulation with Python lists and dictionaries",
    activityType: "data_exploration",
    category: "Data Science",
    difficulty: 3,
    diamondReward: 35,
    experienceReward: 70,
    estimatedMinutes: 25,
    tags: ["data-analysis", "statistics", "pandas", "numpy"],
    content: {
      title: "Student Performance Analysis",
      instructions: "Analyze the given dataset and answer questions",
      dataset: [
        { id: "1", name: "Alice", math: 85, science: 92, english: 78, age: 16 },
        { id: "2", name: "Bob", math: 73, science: 81, english: 85, age: 17 },
        {
          id: "3",
          name: "Charlie",
          math: 95,
          science: 88,
          english: 91,
          age: 16,
        },
        { id: "4", name: "Diana", math: 67, science: 74, english: 82, age: 17 },
        { id: "5", name: "Eve", math: 88, science: 93, english: 87, age: 16 },
      ],
      questions: [
        {
          id: "q1",
          question: "Calculate the average math score",
          type: "calculate",
          answer: 81.6,
          hint: "Sum all math scores and divide by number of students",
        },
        {
          id: "q2",
          question: "Find the student with the highest science score",
          type: "analyze",
          answer: "Eve",
          hint: "Look for the maximum value in the science column",
        },
        {
          id: "q3",
          question: "How many students are 16 years old?",
          type: "filter",
          answer: 3,
          hint: "Count students where age equals 16",
        },
        {
          id: "q4",
          question: "What is Charlie's total score across all subjects?",
          type: "calculate",
          answer: 274,
          hint: "Add math + science + english for Charlie",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 1200,
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: true,
    },
  },
];

export async function POST(request: NextRequest) {
  try {
    console.log("🌱 Starting learning activities seeding...");

    // Clear existing activities
    await prisma.learningActivity.deleteMany({});
    console.log("🧹 Cleared existing learning activities");

    // Insert new activities
    for (const activity of learningActivities) {
      await prisma.learningActivity.create({
        data: {
          title: activity.title,
          description: activity.description,
          activityType: activity.activityType,
          category: activity.category,
          difficulty: activity.difficulty,
          diamondReward: activity.diamondReward,
          experienceReward: activity.experienceReward,
          content: JSON.stringify(activity.content),
          settings: JSON.stringify(activity.settings),
          estimatedMinutes: activity.estimatedMinutes,
          tags: JSON.stringify(activity.tags),
          isActive: true,
          isLocked: false,
          sortOrder: learningActivities.indexOf(activity),
        },
      });
    }

    console.log(
      `✅ Successfully seeded ${learningActivities.length} learning activities`
    );

    const categories = [...new Set(learningActivities.map((a) => a.category))];
    const types = [...new Set(learningActivities.map((a) => a.activityType))];

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${learningActivities.length} learning activities`,
      stats: {
        totalActivities: learningActivities.length,
        categories: categories.length,
        activityTypes: types.length,
        categoriesCreated: categories,
        typesCreated: types,
      },
    });
  } catch (error) {
    console.error("❌ Error seeding learning activities:", error);
    return NextResponse.json(
      { error: "Failed to seed learning activities", details: error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
