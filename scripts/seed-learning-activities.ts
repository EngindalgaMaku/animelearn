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
      target: "Build a Python program that demonstrates different data types",
      blocks: [
        { id: 1, code: "# Integer example", type: "comment" },
        { id: 2, code: "age = 25", type: "input" },
        {
          id: 3,
          code: "print(f'Age: {age}, type: {type(age)}')",
          type: "output",
        },
        { id: 4, code: "# Float example", type: "comment" },
        { id: 5, code: "height = 5.9", type: "input" },
        {
          id: 6,
          code: "print(f'Height: {height}, type: {type(height)}')",
          type: "output",
        },
        { id: 7, code: "# String example", type: "comment" },
        { id: 8, code: "name = 'Alice'", type: "input" },
        {
          id: 9,
          code: "print(f'Name: {name}, type: {type(name)}')",
          type: "output",
        },
        { id: 10, code: "# Boolean example", type: "comment" },
        { id: 11, code: "is_student = True", type: "input" },
        {
          id: 12,
          code: "print(f'Student: {is_student}, type: {type(is_student)}')",
          type: "output",
        },
      ],
      correctOrder: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      hints: [
        "Start with comments to organize your code",
        "Group related variable assignments together",
        "Use print statements to show both value and type",
        "Follow the pattern: comment, assignment, print",
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
    },
    settings: {
      timeLimit: 240,
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
    },
    settings: {
      timeLimit: 360,
      randomizeQuestions: true,
      showExplanations: true,
    },
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
          code: "my_list = [1, 2, 3]\nmy_list.____('4')\nprint(my_list)",
          blanks: ["append"],
          expectedOutput: "[1, 2, 3, '4']",
        },
        {
          id: 2,
          description: "Remove the last item from a list",
          code: "fruits = ['apple', 'banana', 'orange']\nlast_fruit = fruits.____\nprint(last_fruit)",
          blanks: ["pop()"],
          expectedOutput: "orange",
        },
        {
          id: 3,
          description: "Insert an item at a specific position",
          code: "numbers = [1, 3, 4]\nnumbers.____(1, 2)\nprint(numbers)",
          blanks: ["insert"],
          expectedOutput: "[1, 2, 3, 4]",
        },
        {
          id: 4,
          description: "Sort a list in reverse order",
          code: "scores = [85, 92, 78, 96]\nscores.sort(____=True)\nprint(scores)",
          blanks: ["reverse"],
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
      challenges: [
        {
          id: 1,
          title: "Student Grade Manager",
          description: "Create a system to manage student grades",
          startingCode:
            "# Create a dictionary to store student grades\nstudents = {}\n\n# Your code here",
          tasks: [
            "Add three students with their grades",
            "Calculate the average grade",
            "Find the student with the highest grade",
            "Add a new subject for each student",
          ],
          hints: [
            "Use student names as keys and grades as values",
            "Use sum() and len() for average calculation",
            "Use max() with a key function",
            "You can use nested dictionaries for multiple subjects",
          ],
        },
        {
          id: 2,
          title: "Word Frequency Counter",
          description: "Count word frequency in a sentence",
          startingCode:
            "sentence = 'the quick brown fox jumps over the lazy dog'\nword_count = {}\n\n# Your code here",
          tasks: [
            "Split the sentence into words",
            "Count frequency of each word",
            "Display words sorted by frequency",
          ],
        },
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
      instructions:
        "Arrange the steps of each sorting algorithm in the correct order",
      algorithms: [
        {
          name: "Bubble Sort",
          description: "Compare adjacent elements and swap if needed",
          steps: [
            "Compare first two elements",
            "Swap if first > second",
            "Move to next pair",
            "Repeat until no swaps needed",
            "Array is sorted",
          ],
          complexity: "O(n²)",
          example: [64, 34, 25, 12, 22, 11, 90],
        },
        {
          name: "Selection Sort",
          description: "Find minimum element and place at beginning",
          steps: [
            "Find minimum element in unsorted portion",
            "Swap with first element",
            "Move boundary of sorted portion",
            "Repeat for remaining elements",
            "Array is sorted",
          ],
          complexity: "O(n²)",
          example: [64, 25, 12, 22, 11],
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
          code: "for i in range(n):\n    print(i)",
          complexity: "O(n)",
          explanation: "Single loop iterating n times",
        },
        {
          code: "for i in range(n):\n    for j in range(n):\n        print(i, j)",
          complexity: "O(n²)",
          explanation: "Nested loops, each running n times",
        },
        {
          code: "def binary_search(arr, target):\n    # implementation",
          complexity: "O(log n)",
          explanation: "Dividing search space in half each time",
        },
        {
          code: "print('Hello World')",
          complexity: "O(1)",
          explanation: "Constant time operation",
        },
        {
          code: "for i in range(n):\n    for j in range(i):\n        print(i, j)",
          complexity: "O(n²)",
          explanation: "Triangular pattern, still quadratic",
        },
      ],
    },
    settings: {
      showExplanations: true,
      allowMultipleAttempts: true,
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
      exercises: [
        {
          id: 1,
          title: "Calculator Function",
          description: "Create a function that performs basic arithmetic",
          requirements: [
            "Function name: calculate",
            "Parameters: operation, num1, num2",
            "Return appropriate result",
            "Handle division by zero",
          ],
          testCases: [
            { input: ["add", 5, 3], expected: 8 },
            { input: ["multiply", 4, 7], expected: 28 },
            { input: ["divide", 10, 2], expected: 5.0 },
            { input: ["divide", 10, 0], expected: "Error: Division by zero" },
          ],
        },
        {
          id: 2,
          title: "List Processor",
          description: "Create a function that processes lists",
          requirements: [
            "Function name: process_list",
            "Parameter: numbers (list)",
            "Return dictionary with min, max, sum, average",
            "Handle empty lists",
          ],
          testCases: [
            {
              input: [[1, 2, 3, 4, 5]],
              expected: { min: 1, max: 5, sum: 15, avg: 3.0 },
            },
            { input: [[]], expected: { error: "Empty list" } },
          ],
        },
      ],
    },
    settings: {
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
      project: {
        title: "Pet Management System",
        description: "Create a Pet class to manage virtual pets",
        requirements: [
          "Class name: Pet",
          "Attributes: name, species, age, hunger_level, happiness",
          "Methods: feed(), play(), get_status(), age_up()",
          "Implement proper getters and setters",
          "Add validation for attributes",
        ],
        specifications: {
          "feed()": "Decrease hunger_level by 20, increase happiness by 10",
          "play()": "Increase happiness by 15, increase hunger_level by 5",
          "get_status()": "Return formatted string with pet's current state",
          "age_up()": "Increase age by 1, adjust other attributes accordingly",
        },
        testScenarios: [
          "Create a pet and check initial values",
          "Feed the pet and verify changes",
          "Play with the pet multiple times",
          "Age up the pet and check effects",
        ],
      },
    },
    settings: {
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
      elements: [
        { id: "doctype", tag: "<!DOCTYPE html>", level: 0 },
        { id: "html", tag: "<html>", level: 0 },
        { id: "head", tag: "<head>", level: 1 },
        { id: "title", tag: "<title>My Page</title>", level: 2 },
        { id: "meta", tag: "<meta charset='UTF-8'>", level: 2 },
        { id: "body", tag: "<body>", level: 1 },
        { id: "header", tag: "<header>", level: 2 },
        { id: "h1", tag: "<h1>Welcome</h1>", level: 3 },
        { id: "main", tag: "<main>", level: 2 },
        { id: "p", tag: "<p>Content here</p>", level: 3 },
        { id: "footer", tag: "<footer>", level: 2 },
      ],
      targetStructure: [
        "doctype",
        "html",
        "head",
        "meta",
        "title",
        "body",
        "header",
        "h1",
        "main",
        "p",
        "footer",
      ],
    },
    settings: {
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
      instructions: "Write CSS selectors to target specific elements",
      challenges: [
        {
          id: 1,
          title: "Basic Selectors",
          html: "<div class='container'><p id='intro'>Hello</p><p class='highlight'>World</p></div>",
          tasks: [
            {
              description: "Select the paragraph with id 'intro'",
              answer: "#intro",
            },
            {
              description: "Select all paragraphs with class 'highlight'",
              answer: ".highlight",
            },
            {
              description: "Select all paragraphs inside the container",
              answer: ".container p",
            },
          ],
        },
        {
          id: 2,
          title: "Advanced Selectors",
          html: "<ul><li class='first'>Item 1</li><li>Item 2</li><li class='last'>Item 3</li></ul>",
          tasks: [
            {
              description: "Select the first list item",
              answer: "li:first-child",
            },
            {
              description: "Select every second list item",
              answer: "li:nth-child(2n)",
            },
            {
              description: "Select items with class 'first' or 'last'",
              answer: ".first, .last",
            },
          ],
        },
      ],
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
      instructions: "Analyze the given dataset and answer questions",
      dataset: {
        name: "Student Performance",
        description: "Academic performance data of students",
        data: [
          { name: "Alice", math: 85, science: 92, english: 78, age: 16 },
          { name: "Bob", math: 73, science: 81, english: 85, age: 17 },
          { name: "Charlie", math: 95, science: 88, english: 91, age: 16 },
          { name: "Diana", math: 67, science: 74, english: 82, age: 17 },
          { name: "Eve", math: 88, science: 93, english: 87, age: 16 },
        ],
      },
      tasks: [
        {
          question: "Calculate the average math score",
          type: "calculation",
          hint: "Sum all math scores and divide by number of students",
        },
        {
          question: "Find the student with the highest science score",
          type: "analysis",
          hint: "Use max() function with a key parameter",
        },
        {
          question: "Calculate each student's total score across all subjects",
          type: "transformation",
          hint: "Add math + science + english for each student",
        },
        {
          question: "Group students by age and calculate average scores",
          type: "grouping",
          hint: "Separate students by age, then calculate averages",
        },
      ],
    },
    settings: {
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: true,
    },
  },
];

async function seedLearningActivities() {
  console.log("🌱 Starting learning activities seeding...");

  try {
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
          isLocked: false, // Make all activities accessible for now
          sortOrder: learningActivities.indexOf(activity),
        },
      });
    }

    console.log(
      `✅ Successfully seeded ${learningActivities.length} learning activities`
    );
    console.log("📊 Categories created:");

    const categories = [...new Set(learningActivities.map((a) => a.category))];
    categories.forEach((category) => {
      const count = learningActivities.filter(
        (a) => a.category === category
      ).length;
      console.log(`   - ${category}: ${count} activities`);
    });

    console.log("🎯 Activity types created:");
    const types = [...new Set(learningActivities.map((a) => a.activityType))];
    types.forEach((type) => {
      const count = learningActivities.filter(
        (a) => a.activityType === type
      ).length;
      console.log(`   - ${type}: ${count} activities`);
    });
  } catch (error) {
    console.error("❌ Error seeding learning activities:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedLearningActivities()
    .then(() => {
      console.log("🎉 Learning activities seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding failed:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export { seedLearningActivities };
