import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const diversePythonFundamentalsActivities = [
  // 1. DRAG_DROP - Beginner (1)
  {
    title: "Python Syntax Sorting",
    description:
      "Drag and drop Python code elements to their correct categories.",
    activityType: "drag_drop",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 40,
    experienceReward: 80,
    estimatedMinutes: 15,
    content: JSON.stringify({
      target:
        "Arrange Python code elements in the correct order to create a simple program",
      blocks: [
        { id: 1, code: "# This is a comment", type: "comment" },
        { id: 2, code: "name = input('Enter name: ')", type: "input" },
        { id: 3, code: "print('Hello', name)", type: "output" },
      ],
      correctOrder: [1, 2, 3],
      hints: [
        "Comments usually come first to explain the code",
        "Input operations collect data from the user",
        "Output operations display results to the user",
      ],
    }),
    sortOrder: 1,
    isLocked: false,
    tags: JSON.stringify(["syntax", "categorization", "basics"]),
  },

  // 2. MEMORY_GAME - Beginner (1)
  {
    title: "Python Concepts Memory Match",
    description: "Match Python programming concepts with their definitions.",
    activityType: "memory_game",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 45,
    experienceReward: 90,
    estimatedMinutes: 12,
    content: JSON.stringify({
      cards: [
        { id: 1, front: "Variable", back: "Stores data values" },
        { id: 2, front: "Function", back: "Reusable block of code" },
        { id: 3, front: "Loop", back: "Repeats code execution" },
        { id: 4, front: "List", back: "Ordered collection of items" },
      ],
      rules:
        "Match Python concepts with their definitions. Click cards to flip them and find pairs!",
      timeLimit: 120,
    }),
    sortOrder: 2,
    isLocked: false,
    tags: JSON.stringify(["memory", "concepts", "definitions"]),
  },

  // 3. QUIZ - Beginner (1)
  {
    title: "Python Basics Quiz",
    description: "Test your understanding of basic Python concepts.",
    activityType: "quiz",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 50,
    experienceReward: 100,
    estimatedMinutes: 10,
    content: JSON.stringify({
      questions: [
        {
          question: "What symbol is used for comments in Python?",
          options: ["//", "#", "/*", "<!--"],
          correct: 1,
          explanation: "Python uses # for single-line comments.",
        },
        {
          question: "Which function is used to print output in Python?",
          options: ["echo()", "print()", "output()", "display()"],
          correct: 1,
          explanation: "print() is the built-in function for output in Python.",
        },
        {
          question: "What data type is 'Hello World'?",
          options: ["integer", "float", "string", "boolean"],
          correct: 2,
          explanation: "Text enclosed in quotes is a string data type.",
        },
      ],
      passingScore: 70,
      timeLimit: 300,
    }),
    sortOrder: 3,
    isLocked: false,
    tags: JSON.stringify(["quiz", "basics", "knowledge-check"]),
  },

  // 4. FILL_BLANKS - Beginner (1)
  {
    title: "Complete the Python Code",
    description: "Fill in the missing parts of Python code snippets.",
    activityType: "fill_blanks",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 55,
    experienceReward: 110,
    estimatedMinutes: 18,
    content: JSON.stringify({
      instructions: "Fill in the blanks to complete the Python code.",
      codeTemplate:
        "name = ___('What is your name? ')\nage = ___(___(input('How old are you? ')))\n___('Hello, ' + name + '!')\n___('You are', age, 'years old')",
      blanks: [
        {
          id: "1",
          position: 0,
          correctAnswer: "input",
          hint: "Function to get user input",
        },
        {
          id: "2",
          position: 1,
          correctAnswer: "int",
          hint: "Convert string to integer",
        },
        {
          id: "3",
          position: 2,
          correctAnswer: "int",
          hint: "Convert string to integer",
        },
        {
          id: "4",
          position: 3,
          correctAnswer: "print",
          hint: "Function to display output",
        },
        {
          id: "5",
          position: 4,
          correctAnswer: "print",
          hint: "Function to display output",
        },
      ],
    }),
    sortOrder: 4,
    isLocked: false,
    tags: JSON.stringify(["fill-blanks", "input-output", "coding"]),
  },

  // 5. INTERACTIVE_CODING - Beginner (1)
  {
    title: "Your First Python Program",
    description:
      "Write your first interactive Python program with variables and output.",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 60,
    experienceReward: 120,
    estimatedMinutes: 20,
    content: JSON.stringify({
      instructions:
        "Create a program that asks for a name and age, then displays a personalized message.",
      starterCode:
        "# Write a program that:\n# 1. Asks for user's name\n# 2. Asks for user's age\n# 3. Displays a greeting with both\n\n",
      solutionCode:
        "name = input('What is your name? ')\nage = input('How old are you? ')\nprint(f'Hello {name}!')\nprint(f'You are {age} years old.')\nprint('Welcome to Python programming!')",
      testCases: [
        {
          input: "Alice\n25",
          expectedOutput:
            "Hello Alice!\nYou are 25 years old.\nWelcome to Python programming!",
          description: "Should create personalized greeting",
        },
      ],
      hints: [
        "Use input() to get user input",
        "Use print() or f-strings for output",
        "Store values in variables",
      ],
    }),
    sortOrder: 5,
    isLocked: false,
    tags: JSON.stringify(["coding", "input-output", "variables"]),
  },

  // 6. ALGORITHM_VISUALIZATION - Beginner (1)
  {
    title: "How Variables Work",
    description: "Visualize how Python stores and updates variable values.",
    activityType: "algorithm_visualization",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 65,
    experienceReward: 130,
    estimatedMinutes: 15,
    content: JSON.stringify({
      instructions: "Watch how Python handles variable assignment and updates.",
      algorithm: "variable_assignment",
      steps: [
        {
          step: 1,
          code: "x = 5",
          description: "Create variable x and assign value 5",
          visualization: { variables: { x: 5 }, highlight: "x" },
        },
        {
          step: 2,
          code: "y = x",
          description: "Create variable y and copy value from x",
          visualization: { variables: { x: 5, y: 5 }, highlight: "y" },
        },
        {
          step: 3,
          code: "x = 10",
          description: "Update x to new value 10",
          visualization: { variables: { x: 10, y: 5 }, highlight: "x" },
        },
      ],
    }),
    sortOrder: 6,
    isLocked: false,
    tags: JSON.stringify(["visualization", "variables", "memory"]),
  },

  // 7. MATCHING - Beginner (1)
  {
    title: "Python Data Types Matching",
    description: "Match values with their correct Python data types.",
    activityType: "matching",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 40,
    experienceReward: 80,
    estimatedMinutes: 12,
    content: JSON.stringify({
      instructions: "Match each value with its correct Python data type.",
      pairs: [
        { id: "1", left: "42", right: "int" },
        { id: "2", left: "'Hello'", right: "str" },
        { id: "3", left: "3.14", right: "float" },
        { id: "4", left: "True", right: "bool" },
        { id: "5", left: "[1, 2, 3]", right: "list" },
        { id: "6", left: "{'name': 'Alice'}", right: "dict" },
      ],
      timeLimit: 300,
      allowShuffle: true,
      showProgress: true,
    }),
    sortOrder: 7,
    isLocked: false,
    tags: JSON.stringify(["matching", "data-types", "types"]),
  },

  // 8. CODE_BUILDER - Beginner (1)
  {
    title: "Build a Python Calculator",
    description: "Arrange code blocks to create a simple calculator program.",
    activityType: "code_builder",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 70,
    experienceReward: 140,
    estimatedMinutes: 25,
    content: JSON.stringify({
      instructions: "Arrange these code blocks to create a working calculator.",
      codeBlocks: [
        {
          id: "1",
          code: "num1 = float(input('Enter first number: '))",
          indent: 0,
        },
        {
          id: "2",
          code: "num2 = float(input('Enter second number: '))",
          indent: 0,
        },
        {
          id: "3",
          code: "operation = input('Enter operation (+, -, *, /): ')",
          indent: 0,
        },
        { id: "4", code: "if operation == '+':", indent: 0 },
        { id: "5", code: "result = num1 + num2", indent: 1 },
        { id: "6", code: "elif operation == '-':", indent: 0 },
        { id: "7", code: "result = num1 - num2", indent: 1 },
        { id: "8", code: "print(f'Result: {result}')", indent: 0 },
      ],
      correctOrder: ["1", "2", "3", "4", "5", "6", "7", "8"],
    }),
    sortOrder: 8,
    isLocked: false,
    tags: JSON.stringify(["code-builder", "calculator", "conditionals"]),
  },

  // 9. INTERACTIVE_DEMO - Intermediate (2)
  {
    title: "Understanding Python Lists",
    description: "Interactive demonstration of how Python lists work.",
    activityType: "interactive_demo",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 75,
    experienceReward: 150,
    estimatedMinutes: 20,
    content: JSON.stringify({
      instructions: "Learn how Python lists store and organize data.",
      steps: [
        {
          step: 1,
          title: "Creating a List",
          content: "Lists store multiple items in a single variable",
          code: "fruits = ['apple', 'banana', 'orange']",
          interactive: true,
        },
        {
          step: 2,
          title: "Accessing Items",
          content: "Use index numbers to access list items (starting from 0)",
          code: "print(fruits[0])  # Output: apple\nprint(fruits[1])  # Output: banana",
          interactive: true,
        },
        {
          step: 3,
          title: "Adding Items",
          content: "Use append() to add new items to the end",
          code: "fruits.append('grape')\nprint(fruits)  # ['apple', 'banana', 'orange', 'grape']",
          interactive: true,
        },
      ],
    }),
    sortOrder: 9,
    isLocked: false,
    tags: JSON.stringify(["demo", "lists", "data-structures"]),
  },

  // 10. DATA_EXPLORATION - Intermediate (2)
  {
    title: "Explore Student Grades Dataset",
    description: "Analyze a dataset of student grades using Python.",
    activityType: "data_exploration",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 90,
    experienceReward: 180,
    estimatedMinutes: 30,
    content: JSON.stringify({
      instructions:
        "Explore this student grades dataset and complete the analysis tasks.",
      dataset: {
        name: "Student Grades",
        columns: ["Name", "Math", "Python", "English"],
        data: [
          ["Alice", 95, 88, 92],
          ["Bob", 78, 85, 80],
          ["Charlie", 92, 90, 95],
          ["Diana", 87, 92, 89],
          ["Eve", 90, 86, 94],
        ],
      },
      tasks: [
        {
          id: 1,
          task: "What is Alice's Python grade?",
          points: 20,
        },
        {
          id: 2,
          task: "Who has the highest Math grade?",
          points: 25,
        },
        {
          id: 3,
          task: "What is the average Python grade? (round to 1 decimal)",
          points: 30,
        },
      ],
      hints: [
        "Look at the Python column (3rd column) to find Alice's grade",
        "Compare all Math grades (2nd column) to find the highest",
        "Add all Python grades and divide by the number of students",
      ],
    }),
    sortOrder: 10,
    isLocked: false,
    tags: JSON.stringify(["data-exploration", "analysis", "grades"]),
  },

  // 11. INTERACTIVE_CODING - Intermediate (2)
  {
    title: "Python Functions Mastery",
    description: "Create and use functions with parameters and return values.",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 85,
    experienceReward: 170,
    estimatedMinutes: 35,
    content: JSON.stringify({
      instructions: "Create functions that calculate area and greet users.",
      starterCode:
        "# Create a function that calculates rectangle area\ndef calculate_area(length, width):\n    # Your code here\n    pass\n\n# Create a greeting function\ndef greet_user(name, age=None):\n    # Your code here\n    pass\n\n# Test your functions\narea = calculate_area(5, 3)\nprint(f'Area: {area}')\nprint(greet_user('Alice', 25))",
      solutionCode:
        "def calculate_area(length, width):\n    return length * width\n\ndef greet_user(name, age=None):\n    if age:\n        return f'Hello {name}, you are {age} years old!'\n    else:\n        return f'Hello {name}!'\n\narea = calculate_area(5, 3)\nprint(f'Area: {area}')\nprint(greet_user('Alice', 25))",
      testCases: [
        {
          input: "",
          expectedOutput: "Area: 15\nHello Alice, you are 25 years old!",
          description: "Should create and call functions correctly",
        },
      ],
      hints: [
        "Use def keyword to define functions",
        "Use return to send back values",
        "Parameters can have default values",
      ],
    }),
    sortOrder: 11,
    isLocked: false,
    tags: JSON.stringify(["functions", "parameters", "return"]),
  },

  // 12. DRAG_DROP - Intermediate (2)
  {
    title: "Python Loop Components",
    description: "Organize loop components and control flow elements.",
    activityType: "drag_drop",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 60,
    experienceReward: 120,
    estimatedMinutes: 18,
    content: JSON.stringify({
      target:
        "Arrange Python loop components in the correct order to create a working loop with conditional logic",
      blocks: [
        { id: 1, code: "for i in range(5):", type: "loop" },
        { id: 2, code: "    print(i)", type: "output" },
        { id: 3, code: "    if i == 3:", type: "condition" },
        { id: 4, code: "        break", type: "control" },
      ],
      correctOrder: [1, 2, 3, 4],
      hints: [
        "Loop declaration comes first",
        "Print statement executes in each iteration",
        "Conditional check happens after printing",
        "Break statement exits the loop when condition is met",
      ],
    }),
    sortOrder: 12,
    isLocked: false,
    tags: JSON.stringify(["loops", "control-flow", "categorization"]),
  },

  // 13. MEMORY_GAME - Intermediate (2)
  {
    title: "Python Methods Memory Challenge",
    description: "Match Python methods with their functions.",
    activityType: "memory_game",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 65,
    experienceReward: 130,
    estimatedMinutes: 15,
    content: JSON.stringify({
      cards: [
        { id: 1, front: ".append()", back: "Adds item to end of list" },
        { id: 2, front: ".upper()", back: "Converts string to uppercase" },
        { id: 3, front: "len()", back: "Returns length of object" },
        { id: 4, front: ".split()", back: "Splits string into list" },
        { id: 5, front: ".pop()", back: "Removes and returns last item" },
        { id: 6, front: ".lower()", back: "Converts string to lowercase" },
      ],
      rules:
        "Match Python string and list methods with their functions. Click cards to flip them and find pairs!",
      timeLimit: 180,
    }),
    sortOrder: 13,
    isLocked: false,
    tags: JSON.stringify(["methods", "strings", "lists"]),
  },

  // 14. QUIZ - Intermediate (2)
  {
    title: "Python Data Structures Quiz",
    description: "Test your knowledge of lists, dictionaries, and tuples.",
    activityType: "quiz",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 70,
    experienceReward: 140,
    estimatedMinutes: 15,
    content: JSON.stringify({
      questions: [
        {
          question: "Which data structure is ordered and changeable?",
          options: ["tuple", "list", "set", "string"],
          correct: 1,
          explanation: "Lists are ordered (indexed) and changeable (mutable).",
        },
        {
          question: "How do you access a dictionary value?",
          options: ["dict[index]", "dict.key", "dict[key]", "dict(key)"],
          correct: 2,
          explanation: "Use square brackets with the key: dict[key].",
        },
        {
          question: "What does len([1, 2, 3, 4]) return?",
          options: ["3", "4", "5", "error"],
          correct: 1,
          explanation: "len() returns the number of items in the list: 4.",
        },
      ],
      passingScore: 70,
      timeLimit: 450,
    }),
    sortOrder: 14,
    isLocked: false,
    tags: JSON.stringify(["quiz", "data-structures", "intermediate"]),
  },

  // 15. FILL_BLANKS - Intermediate (2)
  {
    title: "Complete the Loop Code",
    description: "Fill in missing parts of Python loops and conditionals.",
    activityType: "fill_blanks",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 80,
    experienceReward: 160,
    estimatedMinutes: 25,
    content: JSON.stringify({
      instructions: "Complete the Python code for loops and conditionals.",
      codeTemplate:
        "___ i ___ range(5):\n    ___ i % 2 == 0:\n        ___('Even:', i)\n    ___:\n        ___('Odd:', i)",
      blanks: [
        { id: "1", position: 0, correctAnswer: "for", hint: "Loop keyword" },
        {
          id: "2",
          position: 1,
          correctAnswer: "in",
          hint: "Membership operator",
        },
        {
          id: "3",
          position: 2,
          correctAnswer: "if",
          hint: "Conditional keyword",
        },
        {
          id: "4",
          position: 3,
          correctAnswer: "print",
          hint: "Output function",
        },
        {
          id: "5",
          position: 4,
          correctAnswer: "else",
          hint: "Alternative condition",
        },
        {
          id: "6",
          position: 5,
          correctAnswer: "print",
          hint: "Output function",
        },
      ],
    }),
    sortOrder: 15,
    isLocked: false,
    tags: JSON.stringify(["loops", "conditionals", "fill-blanks"]),
  },

  // 16. ALGORITHM_VISUALIZATION - Intermediate (2)
  {
    title: "Bubble Sort Visualization",
    description: "See how the bubble sort algorithm works step by step.",
    activityType: "algorithm_visualization",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 95,
    experienceReward: 190,
    estimatedMinutes: 30,
    content: JSON.stringify({
      instructions: "Watch how bubble sort organizes a list of numbers.",
      algorithm: "bubble_sort",
      steps: [
        {
          step: 1,
          code: "arr = [64, 34, 25, 12]",
          description: "Starting with unsorted array",
          visualization: { array: [64, 34, 25, 12], comparing: [], sorted: [] },
        },
        {
          step: 2,
          code: "Compare 64 and 34",
          description: "64 > 34, so swap them",
          visualization: {
            array: [34, 64, 25, 12],
            comparing: [0, 1],
            sorted: [],
          },
        },
        {
          step: 3,
          code: "Compare 64 and 25",
          description: "64 > 25, so swap them",
          visualization: {
            array: [34, 25, 64, 12],
            comparing: [1, 2],
            sorted: [],
          },
        },
        {
          step: 4,
          code: "Final sorted array",
          description: "Array is now sorted",
          visualization: {
            array: [12, 25, 34, 64],
            comparing: [],
            sorted: [0, 1, 2, 3],
          },
        },
      ],
    }),
    sortOrder: 16,
    isLocked: false,
    tags: JSON.stringify(["algorithm", "sorting", "visualization"]),
  },

  // 17. MATCHING - Advanced (3)
  {
    title: "Advanced Python Concepts",
    description: "Match advanced Python features with their descriptions.",
    activityType: "matching",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 100,
    experienceReward: 200,
    estimatedMinutes: 20,
    content: JSON.stringify({
      instructions: "Match advanced Python concepts with their descriptions.",
      pairs: [
        {
          id: "1",
          left: "List Comprehension",
          right: "[x for x in range(10)]",
        },
        { id: "2", left: "Lambda Function", right: "lambda x: x * 2" },
        { id: "3", left: "Try/Except", right: "Error handling" },
        { id: "4", left: "Class", right: "Object blueprint" },
        { id: "5", left: "Import", right: "Use external modules" },
        { id: "6", left: "Generator", right: "yield keyword" },
      ],
      timeLimit: 420,
      allowShuffle: true,
      showProgress: true,
    }),
    sortOrder: 17,
    isLocked: false,
    tags: JSON.stringify(["advanced", "concepts", "matching"]),
  },

  // 18. CODE_BUILDER - Advanced (3)
  {
    title: "Build a Python Class",
    description:
      "Construct a complete Python class with methods and attributes.",
    activityType: "code_builder",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 120,
    experienceReward: 240,
    estimatedMinutes: 40,
    content: JSON.stringify({
      instructions: "Arrange code blocks to create a Student class.",
      codeBlocks: [
        { id: "1", code: "class Student:", indent: 0 },
        { id: "2", code: "def __init__(self, name, age):", indent: 1 },
        { id: "3", code: "self.name = name", indent: 2 },
        { id: "4", code: "self.age = age", indent: 2 },
        { id: "5", code: "self.grades = []", indent: 2 },
        { id: "6", code: "def add_grade(self, grade):", indent: 1 },
        { id: "7", code: "self.grades.append(grade)", indent: 2 },
        { id: "8", code: "def get_average(self):", indent: 1 },
        {
          id: "9",
          code: "return sum(self.grades) / len(self.grades)",
          indent: 2,
        },
      ],
      correctOrder: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    }),
    sortOrder: 18,
    isLocked: false,
    tags: JSON.stringify(["oop", "classes", "methods"]),
  },

  // 19. CLASS_BUILDER - Advanced (3)
  {
    title: "Design a Banking System",
    description:
      "Create a complete banking class with deposits, withdrawals, and balance checking.",
    activityType: "class_builder",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 150,
    experienceReward: 300,
    estimatedMinutes: 45,
    content: JSON.stringify({
      instructions:
        "Design a BankAccount class with proper methods and attributes.",
      classTemplate: {
        className: "BankAccount",
        attributes: [
          { name: "account_number", type: "string", required: true },
          { name: "balance", type: "float", required: true, default: "0.0" },
          { name: "owner_name", type: "string", required: true },
        ],
        methods: [
          {
            name: "__init__",
            parameters: ["self", "account_number", "owner_name"],
            description: "Initialize account with number and owner",
          },
          {
            name: "deposit",
            parameters: ["self", "amount"],
            description: "Add money to account",
          },
          {
            name: "withdraw",
            parameters: ["self", "amount"],
            description: "Remove money from account",
          },
          {
            name: "get_balance",
            parameters: ["self"],
            description: "Return current balance",
          },
        ],
      },
    }),
    sortOrder: 19,
    isLocked: false,
    tags: JSON.stringify(["class-builder", "oop", "banking"]),
  },

  // 20. INTERACTIVE_CODING - Advanced (3)
  {
    title: "Python Data Analysis Project",
    description:
      "Create a comprehensive data analysis program with file handling and statistics.",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 200,
    experienceReward: 400,
    estimatedMinutes: 60,
    content: JSON.stringify({
      instructions:
        "Build a complete data analysis program that reads data, calculates statistics, and generates reports.",
      starterCode:
        "# Data Analysis Project\nimport statistics\n\n# Sample data\nstudent_scores = [85, 92, 78, 96, 88, 75, 91, 87, 94, 82]\n\n# Task 1: Calculate basic statistics\ndef calculate_stats(scores):\n    # Your code here\n    pass\n\n# Task 2: Find outliers (scores more than 1.5 * IQR from quartiles)\ndef find_outliers(scores):\n    # Your code here\n    pass\n\n# Task 3: Generate report\ndef generate_report(scores):\n    # Your code here\n    pass\n\n# Test your functions\nstats = calculate_stats(student_scores)\noutliers = find_outliers(student_scores)\nreport = generate_report(student_scores)\nprint(report)",
      solutionCode:
        "import statistics\n\nstudent_scores = [85, 92, 78, 96, 88, 75, 91, 87, 94, 82]\n\ndef calculate_stats(scores):\n    return {\n        'mean': statistics.mean(scores),\n        'median': statistics.median(scores),\n        'stdev': statistics.stdev(scores),\n        'min': min(scores),\n        'max': max(scores)\n    }\n\ndef find_outliers(scores):\n    q1 = statistics.quantiles(scores)[0]\n    q3 = statistics.quantiles(scores)[2]\n    iqr = q3 - q1\n    lower_bound = q1 - 1.5 * iqr\n    upper_bound = q3 + 1.5 * iqr\n    return [x for x in scores if x < lower_bound or x > upper_bound]\n\ndef generate_report(scores):\n    stats = calculate_stats(scores)\n    outliers = find_outliers(scores)\n    \n    report = f'Student Scores Analysis\\n'\n    report += f'Mean: {stats[\"mean\"]:.2f}\\n'\n    report += f'Median: {stats[\"median\"]}\\n'\n    report += f'Standard Deviation: {stats[\"stdev\"]:.2f}\\n'\n    report += f'Range: {stats[\"min\"]} - {stats[\"max\"]}\\n'\n    report += f'Outliers: {outliers if outliers else \"None\"}'\n    return report\n\nstats = calculate_stats(student_scores)\noutliers = find_outliers(student_scores)\nreport = generate_report(student_scores)\nprint(report)",
      testCases: [
        {
          input: "",
          expectedOutput: "Student Scores Analysis\nMean: 86.80\nMedian: 87.0",
          description: "Should analyze data and generate report",
        },
      ],
      hints: [
        "Use statistics module for calculations",
        "Handle quartiles for outlier detection",
        "Format output professionally",
      ],
    }),
    sortOrder: 20,
    isLocked: false,
    tags: JSON.stringify(["data-analysis", "statistics", "project"]),
  },
];

async function createDiversePythonActivities() {
  try {
    console.log("🧹 Deleting existing Python Fundamentals activities...");

    // Delete all existing Python Fundamentals activities
    const deleteResult = await prisma.learningActivity.deleteMany({
      where: {
        category: "Python Fundamentals",
      },
    });

    console.log(`✅ Deleted ${deleteResult.count} existing activities`);

    console.log(
      "🚀 Creating 20 diverse Python Fundamentals activities using all 11 activity types..."
    );

    // Create new diverse activities
    let created = 0;
    for (const activity of diversePythonFundamentalsActivities) {
      try {
        await prisma.learningActivity.create({
          data: {
            ...activity,
            settings: JSON.stringify({
              allowHints: true,
              maxAttempts: 3,
              showSolution: true,
            }),
          },
        });
        created++;
        console.log(`✅ Created: ${activity.title} (${activity.activityType})`);
      } catch (error) {
        console.error(`❌ Failed to create ${activity.title}:`, error);
      }
    }

    console.log(`\n🎉 Diverse Activity Creation Complete!`);
    console.log(`📚 Total activities created: ${created}/20`);

    // Show distribution
    const difficultyCount = [0, 0, 0, 0]; // index 0 unused, 1-3 for difficulties
    const activityTypeCount: { [key: string]: number } = {};

    diversePythonFundamentalsActivities.forEach((activity) => {
      difficultyCount[activity.difficulty]++;
      activityTypeCount[activity.activityType] =
        (activityTypeCount[activity.activityType] || 0) + 1;
    });

    console.log("\n📊 Difficulty Distribution:");
    console.log(`   🔥 Beginner (1): ${difficultyCount[1]} activities`);
    console.log(`   ⚡ Intermediate (2): ${difficultyCount[2]} activities`);
    console.log(`   🚀 Advanced (3): ${difficultyCount[3]} activities`);

    console.log("\n🎭 Activity Type Distribution (All 11 Types Used):");
    Object.entries(activityTypeCount)
      .sort(([, a], [, b]) => b - a)
      .forEach(([type, count]) => {
        console.log(`   ${type}: ${count} activities`);
      });

    // Verify all 11 types are represented
    const supportedTypes = [
      "drag_drop",
      "memory_game",
      "quiz",
      "fill_blanks",
      "interactive_coding",
      "algorithm_visualization",
      "matching",
      "code_builder",
      "class_builder",
      "interactive_demo",
      "data_exploration",
    ];

    const usedTypes = Object.keys(activityTypeCount);
    const missingTypes = supportedTypes.filter(
      (type) => !usedTypes.includes(type)
    );

    if (missingTypes.length === 0) {
      console.log("\n✅ ALL 11 SUPPORTED ACTIVITY TYPES ARE USED!");
    } else {
      console.log(`\n⚠️ Missing types: ${missingTypes.join(", ")}`);
    }

    console.log("\n💎 Reward Distribution:");
    const totalDiamonds = diversePythonFundamentalsActivities.reduce(
      (sum, a) => sum + a.diamondReward,
      0
    );
    const totalXP = diversePythonFundamentalsActivities.reduce(
      (sum, a) => sum + a.experienceReward,
      0
    );
    console.log(`   💎 Total Diamonds: ${totalDiamonds}`);
    console.log(`   ⭐ Total Experience: ${totalXP}`);
  } catch (error) {
    console.error("❌ Error creating diverse activities:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the creation process
if (require.main === module) {
  createDiversePythonActivities();
}

export { createDiversePythonActivities, diversePythonFundamentalsActivities };
