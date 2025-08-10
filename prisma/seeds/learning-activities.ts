import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedLearningActivities() {
  console.log("🎯 Seeding Learning Activities...");

  const activities = [
    // Algorithm Visualization Activities
    {
      title: "Bubble Sort Visualization",
      description:
        "Watch how bubble sort algorithm works step by step with interactive visualization",
      activityType: "algorithm_visualization",
      category: "Algorithms",
      difficulty: 2,
      diamondReward: 30,
      experienceReward: 50,
      estimatedMinutes: 8,
      sortOrder: 1,
      isLocked: false,
      isActive: true,
      content: JSON.stringify({
        algorithm: "Bubble Sort",
        description:
          "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)",
        explanation:
          "Bubble sort gets its name because smaller elements 'bubble' to the top of the list. While not efficient for large datasets, it's great for learning sorting concepts.",
        steps: [
          {
            id: 1,
            description: "Starting with the unsorted array",
            data: [64, 34, 25, 12, 22, 11, 90],
            highlights: [],
            action: "Begin sorting process",
          },
          {
            id: 2,
            description: "Compare first two elements (64 and 34)",
            data: [64, 34, 25, 12, 22, 11, 90],
            highlights: [0, 1],
            comparison: [0, 1],
            action: "64 > 34, so we swap them",
          },
          {
            id: 3,
            description: "After swapping 64 and 34",
            data: [34, 64, 25, 12, 22, 11, 90],
            highlights: [0, 1],
            action: "Continue with next pair",
          },
          {
            id: 4,
            description: "Compare 64 and 25",
            data: [34, 64, 25, 12, 22, 11, 90],
            highlights: [1, 2],
            comparison: [1, 2],
            action: "64 > 25, so we swap them",
          },
          {
            id: 5,
            description: "After swapping 64 and 25",
            data: [34, 25, 64, 12, 22, 11, 90],
            highlights: [1, 2],
            action: "Continue through the array",
          },
          {
            id: 6,
            description:
              "First pass complete - largest element (90) is in place",
            data: [34, 25, 12, 22, 11, 64, 90],
            highlights: [6],
            action: "Start second pass",
          },
          {
            id: 7,
            description: "Final sorted array",
            data: [11, 12, 22, 25, 34, 64, 90],
            highlights: [0, 1, 2, 3, 4, 5, 6],
            action: "Sorting complete!",
          },
        ],
      }),
      tags: JSON.stringify([
        "algorithms",
        "sorting",
        "visualization",
        "beginner",
      ]),
    },

    {
      title: "Binary Search Visualization",
      description:
        "Learn how binary search efficiently finds elements in sorted arrays",
      activityType: "algorithm_visualization",
      category: "Algorithms",
      difficulty: 3,
      diamondReward: 40,
      experienceReward: 60,
      estimatedMinutes: 10,
      sortOrder: 2,
      isLocked: false,
      isActive: true,
      content: JSON.stringify({
        algorithm: "Binary Search",
        description:
          "An efficient algorithm for finding an item from a sorted list by repeatedly dividing the search interval in half.",
        timeComplexity: "O(log n)",
        spaceComplexity: "O(1)",
        explanation:
          "Binary search is much faster than linear search for sorted arrays, making it essential for efficient programming.",
        steps: [
          {
            id: 1,
            description: "Search for target value 25 in sorted array",
            data: [11, 12, 22, 25, 34, 64, 90],
            highlights: [],
            action: "Target: 25",
          },
          {
            id: 2,
            description: "Set initial boundaries: left=0, right=6, middle=3",
            data: [11, 12, 22, 25, 34, 64, 90],
            highlights: [3],
            action: "Check middle element: 25",
          },
          {
            id: 3,
            description: "Found! Target 25 equals middle element",
            data: [11, 12, 22, 25, 34, 64, 90],
            highlights: [3],
            comparison: [3],
            action: "Search successful in 1 step!",
          },
        ],
      }),
      tags: JSON.stringify([
        "algorithms",
        "search",
        "visualization",
        "efficiency",
      ]),
    },

    // Drag & Drop Activities
    {
      title: "Python Data Types Sorting",
      description:
        "Drag and drop Python values into their correct data type categories",
      activityType: "drag_drop",
      category: "Python Basics",
      difficulty: 1,
      diamondReward: 20,
      experienceReward: 30,
      estimatedMinutes: 5,
      sortOrder: 1,
      isLocked: false,
      isActive: true,
      content: JSON.stringify({
        instructions:
          "Drag each Python value to its correct data type category. Understanding data types is fundamental to Python programming.",
        items: [
          { id: 1, value: "42", type: "integer" },
          { id: 2, value: "3.14", type: "float" },
          { id: 3, value: "'Hello'", type: "string" },
          { id: 4, value: "True", type: "boolean" },
          { id: 5, value: "[1, 2, 3]", type: "list" },
          { id: 6, value: "{'key': 'value'}", type: "dictionary" },
          { id: 7, value: "False", type: "boolean" },
          { id: 8, value: '"Python"', type: "string" },
        ],
        categories: [
          {
            id: "integer",
            name: "Integer",
            description: "Whole numbers without decimal points",
          },
          {
            id: "float",
            name: "Float",
            description: "Numbers with decimal points",
          },
          {
            id: "string",
            name: "String",
            description: "Text data enclosed in quotes",
          },
          {
            id: "boolean",
            name: "Boolean",
            description: "True or False values",
          },
          {
            id: "list",
            name: "List",
            description: "Ordered collection of items",
          },
          {
            id: "dictionary",
            name: "Dictionary",
            description: "Key-value pairs",
          },
        ],
      }),
      settings: JSON.stringify({
        timeLimit: 300,
        maxAttempts: 3,
        showHints: true,
        shuffleItems: true,
      }),
      tags: JSON.stringify(["python", "data-types", "basics", "fundamentals"]),
    },

    {
      title: "Programming Concepts Categorization",
      description:
        "Sort programming concepts into Object-Oriented vs Functional programming paradigms",
      activityType: "drag_drop",
      category: "Functions & OOP",
      difficulty: 3,
      diamondReward: 35,
      experienceReward: 55,
      estimatedMinutes: 8,
      sortOrder: 1,
      isLocked: false,
      isActive: true,
      content: JSON.stringify({
        instructions:
          "Drag each programming concept to its appropriate paradigm. This will help you understand different programming approaches.",
        items: [
          { id: 1, value: "Classes", type: "oop" },
          { id: 2, value: "Pure Functions", type: "functional" },
          { id: 3, value: "Inheritance", type: "oop" },
          { id: 4, value: "Map/Filter/Reduce", type: "functional" },
          { id: 5, value: "Encapsulation", type: "oop" },
          { id: 6, value: "Immutability", type: "functional" },
          { id: 7, value: "Polymorphism", type: "oop" },
          { id: 8, value: "Higher-Order Functions", type: "functional" },
        ],
        categories: [
          {
            id: "oop",
            name: "Object-Oriented",
            description: "Programming with objects and classes",
          },
          {
            id: "functional",
            name: "Functional",
            description: "Programming with functions and immutable data",
          },
        ],
      }),
      tags: JSON.stringify(["programming", "paradigms", "oop", "functional"]),
    },

    // Matching Activities
    {
      title: "Python Built-in Functions Match",
      description:
        "Match Python functions with their descriptions and use cases",
      activityType: "matching",
      category: "Python Basics",
      difficulty: 2,
      diamondReward: 25,
      experienceReward: 40,
      estimatedMinutes: 6,
      sortOrder: 2,
      isLocked: false,
      isActive: true,
      content: JSON.stringify({
        instructions:
          "Match each Python function with its correct description. Click a function on the left, then click its matching description on the right.",
        pairs: [
          { id: "1", left: "len()", right: "Returns the length of an object" },
          { id: "2", left: "type()", right: "Returns the type of an object" },
          { id: "3", left: "str()", right: "Converts object to string" },
          { id: "4", left: "int()", right: "Converts object to integer" },
          { id: "5", left: "list()", right: "Creates a new list" },
          { id: "6", left: "range()", right: "Generates sequence of numbers" },
          { id: "7", left: "print()", right: "Displays output to console" },
          { id: "8", left: "input()", right: "Gets user input from keyboard" },
        ],
        timeLimit: 240,
        allowShuffle: true,
        showProgress: true,
      }),
      tags: JSON.stringify(["python", "functions", "built-in", "basics"]),
    },

    {
      title: "Algorithm Complexity Matching",
      description:
        "Match algorithms with their time complexity classifications",
      activityType: "matching",
      category: "Algorithms",
      difficulty: 4,
      diamondReward: 50,
      experienceReward: 80,
      estimatedMinutes: 12,
      sortOrder: 3,
      isLocked: false,
      isActive: true,
      content: JSON.stringify({
        instructions:
          "Match each algorithm with its time complexity. Understanding complexity is crucial for writing efficient code.",
        pairs: [
          { id: "1", left: "Binary Search", right: "O(log n)" },
          { id: "2", left: "Linear Search", right: "O(n)" },
          { id: "3", left: "Bubble Sort", right: "O(n²)" },
          { id: "4", left: "Quick Sort (average)", right: "O(n log n)" },
          { id: "5", left: "Hash Table Lookup", right: "O(1)" },
          { id: "6", left: "Merge Sort", right: "O(n log n)" },
          { id: "7", left: "Selection Sort", right: "O(n²)" },
          { id: "8", left: "Heap Sort", right: "O(n log n)" },
        ],
        timeLimit: 300,
        allowShuffle: true,
        showProgress: true,
      }),
      tags: JSON.stringify([
        "algorithms",
        "complexity",
        "big-o",
        "performance",
      ]),
    },

    // Memory Game Activities
    {
      title: "Python Keywords Memory Game",
      description:
        "Memorize and recall Python reserved keywords in this fun memory challenge",
      activityType: "memory_game",
      category: "Python Basics",
      difficulty: 2,
      diamondReward: 30,
      experienceReward: 45,
      estimatedMinutes: 7,
      sortOrder: 3,
      isLocked: false,
      isActive: true,
      content: JSON.stringify({
        instructions:
          "Memorize the Python keywords, then click them in the order they appeared.",
        items: [
          "def",
          "class",
          "if",
          "else",
          "for",
          "while",
          "try",
          "except",
          "import",
          "from",
          "return",
          "yield",
          "lambda",
          "with",
          "as",
          "pass",
        ],
        gridSize: 4,
        memoryTime: 10,
        recallTime: 30,
        difficulty: "medium",
      }),
      tags: JSON.stringify(["python", "keywords", "memory", "recall"]),
    },

    // Quiz Activities
    {
      title: "Python Fundamentals Quiz",
      description: "Test your knowledge of basic Python concepts and syntax",
      activityType: "quiz",
      category: "Python Basics",
      difficulty: 1,
      diamondReward: 25,
      experienceReward: 35,
      estimatedMinutes: 10,
      sortOrder: 4,
      isLocked: false,
      isActive: true,
      content: JSON.stringify({
        questions: [
          {
            id: 1,
            question: "What is the correct way to create a variable in Python?",
            type: "multiple_choice",
            options: ["var x = 5", "x = 5", "int x = 5", "declare x = 5"],
            correctAnswer: 1,
            explanation:
              "In Python, you simply assign a value to a variable name. No declaration keywords needed!",
          },
          {
            id: 2,
            question: "Which of the following is NOT a valid Python data type?",
            type: "multiple_choice",
            options: ["int", "string", "list", "dictionary"],
            correctAnswer: 1,
            explanation: "In Python, the correct type is 'str', not 'string'.",
          },
          {
            id: 3,
            question: "Python is case-sensitive",
            type: "true_false",
            correctAnswer: true,
            explanation:
              "Yes! 'Variable' and 'variable' are different in Python.",
          },
        ],
        timeLimit: 600,
        passingScore: 70,
      }),
      tags: JSON.stringify(["python", "quiz", "fundamentals", "basics"]),
    },

    // Fill Blanks Activities
    {
      title: "Complete the Python Function",
      description:
        "Fill in the missing parts of Python function definitions and calls",
      activityType: "fill_blanks",
      category: "Functions & OOP",
      difficulty: 2,
      diamondReward: 35,
      experienceReward: 50,
      estimatedMinutes: 8,
      sortOrder: 2,
      isLocked: false,
      isActive: true,
      content: JSON.stringify({
        instructions:
          "Fill in the blanks to complete the Python function definition and function call.",
        codeTemplate: `___ greet(name, greeting="Hello"):\n    ___ f"{greeting}, {name}!"\n\n# Call the function\nresult = greet(___)\nprint(result)`,
        blanks: [
          { id: 1, answer: "def", hint: "keyword to define a function" },
          { id: 2, answer: "return", hint: "keyword to return a value" },
          {
            id: 3,
            answer: '"World"',
            hint: "string argument for name parameter",
            alternatives: ["'World'"],
          },
        ],
        explanation:
          "Python functions are defined with 'def', use 'return' to send back values, and can have default parameters.",
      }),
      tags: JSON.stringify(["python", "functions", "syntax", "fill-blanks"]),
    },

    // Interactive Coding Activities
    {
      title: "Build Your First Python Function",
      description:
        "Write and test a simple Python function with live code execution",
      activityType: "interactive_coding",
      category: "Functions & OOP",
      difficulty: 2,
      diamondReward: 40,
      experienceReward: 60,
      estimatedMinutes: 15,
      sortOrder: 3,
      isLocked: false,
      isActive: true,
      content: JSON.stringify({
        instructions:
          "Write a function that takes a name and returns a personalized greeting. Test it with different inputs!",
        starterCode: `# Write a function called 'greet' that takes a name parameter\n# and returns a greeting message\n\ndef greet(name):\n    # Your code here\n    pass\n\n# Test your function\nprint(greet("Python"))`,
        expectedOutput: "Hello, Python!",
        hints: [
          "Use the 'def' keyword to define the function",
          "Don't forget to use 'return' to send back the greeting",
          "You can use f-strings: f'Hello, {name}!'",
        ],
        testCases: [
          { input: "greet('Alice')", expected: "Hello, Alice!" },
          { input: "greet('Bob')", expected: "Hello, Bob!" },
        ],
      }),
      tags: JSON.stringify(["python", "coding", "functions", "interactive"]),
    },

    // Code Builder Activities
    {
      title: "Build a Python Class",
      description:
        "Construct a complete Python class by arranging code blocks in the correct order",
      activityType: "code_builder",
      category: "Functions & OOP",
      difficulty: 4,
      diamondReward: 50,
      experienceReward: 75,
      estimatedMinutes: 12,
      sortOrder: 4,
      isLocked: false,
      isActive: true,
      content: JSON.stringify({
        instructions:
          "Arrange the code blocks to build a complete Python class for a simple calculator.",
        codeBlocks: [
          { id: 1, code: "class Calculator:", type: "class_definition" },
          { id: 2, code: "    def __init__(self):", type: "constructor" },
          { id: 3, code: "        self.history = []", type: "initialization" },
          { id: 4, code: "    def add(self, a, b):", type: "method" },
          { id: 5, code: "        result = a + b", type: "calculation" },
          {
            id: 6,
            code: "        self.history.append(f'{a} + {b} = {result}')",
            type: "logging",
          },
          { id: 7, code: "        return result", type: "return" },
        ],
        correctOrder: [1, 2, 3, 4, 5, 6, 7],
        explanation:
          "Python classes start with 'class', followed by __init__ for initialization, then methods.",
      }),
      tags: JSON.stringify(["python", "classes", "oop", "code-building"]),
    },

    // Class Builder Activities
    {
      title: "Design a Student Class",
      description:
        "Build a comprehensive Student class with properties and methods using a visual interface",
      activityType: "class_builder",
      category: "Functions & OOP",
      difficulty: 3,
      diamondReward: 45,
      experienceReward: 65,
      estimatedMinutes: 10,
      sortOrder: 5,
      isLocked: false,
      isActive: true,
      content: JSON.stringify({
        instructions:
          "Design a Student class by selecting appropriate attributes and methods.",
        classTemplate: {
          name: "Student",
          attributes: [
            { name: "name", type: "string", required: true },
            { name: "age", type: "int", required: true },
            { name: "grade", type: "float", required: false },
            { name: "courses", type: "list", required: false },
          ],
          methods: [
            { name: "__init__", required: true, params: ["name", "age"] },
            { name: "add_course", required: false, params: ["course"] },
            { name: "get_gpa", required: false, params: [] },
            { name: "__str__", required: false, params: [] },
          ],
        },
        requirements:
          "Include at least name and age attributes, plus a constructor method.",
      }),
      tags: JSON.stringify(["python", "classes", "design", "oop"]),
    },

    // Interactive Demo Activities
    {
      title: "Explore Python Lists",
      description:
        "Interactive demonstration of Python list operations and methods",
      activityType: "interactive_demo",
      category: "Data Structures",
      difficulty: 2,
      diamondReward: 30,
      experienceReward: 45,
      estimatedMinutes: 8,
      sortOrder: 1,
      isLocked: false,
      isActive: true,
      content: JSON.stringify({
        title: "Python Lists Deep Dive",
        description:
          "Learn how to create, modify, and manipulate Python lists with hands-on examples.",
        steps: [
          {
            title: "Creating Lists",
            content:
              "Lists are created using square brackets and can contain any type of data.",
            code: "fruits = ['apple', 'banana', 'orange']\nnumbers = [1, 2, 3, 4, 5]\nmixed = ['hello', 42, True, 3.14]",
            explanation:
              "Lists can hold different data types and are ordered collections.",
          },
          {
            title: "Accessing Elements",
            content:
              "Use index numbers to access list elements. Python uses zero-based indexing.",
            code: "fruits = ['apple', 'banana', 'orange']\nprint(fruits[0])  # 'apple'\nprint(fruits[-1]) # 'orange' (last item)",
            explanation: "Negative indices count from the end of the list.",
          },
          {
            title: "Adding Elements",
            content:
              "Use append() to add single items, or extend() to add multiple items.",
            code: "fruits.append('grape')\nfruits.extend(['kiwi', 'mango'])\nprint(fruits)",
            explanation:
              "append() adds one item, extend() adds multiple items from another iterable.",
          },
        ],
      }),
      tags: JSON.stringify(["python", "lists", "data-structures", "demo"]),
    },

    // Data Exploration Activities
    {
      title: "Explore Python Dataset",
      description:
        "Analyze a sample dataset using Python's data manipulation tools",
      activityType: "data_exploration",
      category: "Data Science",
      difficulty: 4,
      diamondReward: 60,
      experienceReward: 90,
      estimatedMinutes: 20,
      sortOrder: 1,
      isLocked: false,
      isActive: true,
      content: JSON.stringify({
        instructions:
          "Explore a sample dataset of student grades using Python data analysis techniques.",
        dataset: {
          name: "Student Grades",
          columns: ["student_id", "name", "subject", "grade", "semester"],
          data: [
            [1, "Alice", "Math", 95, "Fall"],
            [2, "Bob", "Math", 87, "Fall"],
            [3, "Charlie", "Math", 92, "Fall"],
            [1, "Alice", "Science", 89, "Fall"],
            [2, "Bob", "Science", 94, "Fall"],
            [3, "Charlie", "Science", 88, "Fall"],
          ],
        },
        tasks: [
          { id: 1, task: "Calculate average grade for Math", points: 20 },
          { id: 2, task: "Find the highest grade overall", points: 15 },
          {
            id: 3,
            task: "Count how many students are in the dataset",
            points: 15,
          },
          { id: 4, task: "Find Alice's average grade", points: 25 },
          { id: 5, task: "List all unique subjects", points: 25 },
        ],
        hints: [
          "Use list comprehensions to filter data",
          "The len() function counts items",
          "Use set() to find unique values",
        ],
      }),
      tags: JSON.stringify([
        "python",
        "data-science",
        "analysis",
        "exploration",
      ]),
    },
  ];

  // Insert activities
  for (const activity of activities) {
    try {
      const existing = await prisma.learningActivity.findFirst({
        where: { title: activity.title },
      });

      if (!existing) {
        await prisma.learningActivity.create({
          data: activity,
        });
        console.log(`✅ Created activity: ${activity.title}`);
      } else {
        console.log(`⏩ Activity already exists: ${activity.title}`);
      }
    } catch (error) {
      console.error(`❌ Failed to create activity: ${activity.title}`, error);
    }
  }

  console.log("✅ Learning Activities seeding completed!");
}
