import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const learningActivities = [
  // PYTHON FUNDAMENTALS - 20 High-Quality Activities

  // DIFFICULTY 1 - BEGINNER (4 activities)
  {
    title: "Python Variables & Data Types Explorer",
    description:
      "Interactive exploration of Python's fundamental data types and variable assignment",
    activityType: "drag_drop",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 10,
    experienceReward: 25,
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
        { id: 9, value: "None", type: "none" },
        { id: 10, value: "2 + 3j", type: "complex" },
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
        { id: "none", name: "NoneType", description: "Null value" },
        { id: "complex", name: "Complex", description: "Complex numbers" },
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
    title: "Python Print Statement Basics",
    description: "Learn the fundamentals of printing output in Python",
    activityType: "memory_game",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 30,
    estimatedMinutes: 10,
    tags: ["print", "output", "basic-syntax", "beginner"],
    content: {
      instructions: "Match the Python print statements with their outputs",
      pairs: [
        { id: 1, card1: "print('Hello World')", card2: "Hello World" },
        { id: 2, card1: "print(2 + 3)", card2: "5" },
        { id: 3, card1: "print('Age:', 25)", card2: "Age: 25" },
        { id: 4, card1: "print('A', 'B', 'C')", card2: "A B C" },
        { id: 5, card1: "print('Line1\\nLine2')", card2: "Line1\nLine2" },
        { id: 6, card1: "print(10 * 3)", card2: "30" },
        {
          id: 7,
          card1: "print('Result:', end='')",
          card2: "Result:(no newline)",
        },
        { id: 8, card1: "print(f'{5} + {3} = {8}')", card2: "5 + 3 = 8" },
      ],
      timeLimit: 240,
      shuffleCards: true,
    },
    settings: {
      maxFlips: 25,
      showTimer: true,
    },
  },

  {
    title: "Basic Python Operators Quiz",
    description:
      "Test your knowledge of Python arithmetic and comparison operators",
    activityType: "quiz",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 15,
    experienceReward: 35,
    estimatedMinutes: 12,
    tags: ["operators", "arithmetic", "comparison", "quiz"],
    content: {
      instructions: "Answer questions about Python operators",
      questions: [
        {
          id: 1,
          question: "What is the result of 7 // 2 in Python?",
          options: ["3.5", "3", "4", "Error"],
          correct: 1,
          explanation:
            "The // operator performs floor division, returning the integer part of the division.",
        },
        {
          id: 2,
          question: "What does the ** operator do in Python?",
          options: ["Multiplication", "Exponentiation", "Division", "Modulus"],
          correct: 1,
          explanation:
            "The ** operator is used for exponentiation (power operation).",
        },
        {
          id: 3,
          question: "What is the result of 15 % 4?",
          options: ["3", "3.75", "4", "1"],
          correct: 0,
          explanation:
            "The % operator returns the remainder of division. 15 ÷ 4 = 3 remainder 3.",
        },
        {
          id: 4,
          question: "Which operator is used for equality comparison?",
          options: ["=", "==", "!=", "==="],
          correct: 1,
          explanation:
            "== is used for equality comparison, while = is for assignment.",
        },
      ],
      timeLimit: 360,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {},
  },

  {
    title: "Python Input and Variables Workshop",
    description: "Learn to work with user input and variable assignment",
    activityType: "fill_blanks",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 18,
    experienceReward: 40,
    estimatedMinutes: 15,
    tags: ["input", "variables", "assignment", "practice"],
    content: {
      instructions:
        "Fill in the missing code to handle user input and variables",
      exercises: [
        {
          id: 1,
          description: "Get user input and store in a variable",
          template: "name = ____('Enter your name: ')\nprint('Hello,', name)",
          blanks: [{ id: "blank1", answer: "input", position: 0 }],
          expectedOutput: "Hello, [user_input]",
        },
        {
          id: 2,
          description: "Convert string input to integer",
          template:
            "age_str = input('Enter age: ')\nage = ____(age_str)\nprint('Age:', age)",
          blanks: [{ id: "blank2", answer: "int", position: 0 }],
          expectedOutput: "Age: [number]",
        },
        {
          id: 3,
          description: "Create a formatted string",
          template:
            "city = 'Paris'\ncountry = 'France'\nlocation = f'{____} is in {____}'\nprint(location)",
          blanks: [
            { id: "blank3", answer: "city", position: 0 },
            { id: "blank4", answer: "country", position: 1 },
          ],
          expectedOutput: "Paris is in France",
        },
        {
          id: 4,
          description: "Multiple variable assignment",
          template: "x, y, z = ____, ____, ____\nprint(x + y + z)",
          blanks: [
            { id: "blank5", answer: "1", position: 0 },
            { id: "blank6", answer: "2", position: 1 },
            { id: "blank7", answer: "3", position: 2 },
          ],
          expectedOutput: "6",
        },
      ],
    },
    settings: {
      timeLimit: 600,
      allowHints: true,
      caseSensitive: false,
    },
  },

  // DIFFICULTY 2 - BASIC (5 activities)
  {
    title: "String Methods Master Class",
    description:
      "Explore Python string methods and text manipulation techniques",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 45,
    estimatedMinutes: 18,
    tags: ["strings", "methods", "text-processing", "manipulation"],
    content: {
      instructions:
        "Complete string manipulation challenges using various string methods",
      problem: "Create a text processor that cleans and formats user input",
      starterCode:
        "# String processing functions\ntext = '  Hello World  '\n\n# Your code here\nprocessed = text\nprint(processed)",
      solution:
        "text = '  Hello World  '\nprocessed = text.strip().lower().replace(' ', '_')\nprint(processed)  # hello_world",
      testCases: [
        { input: "  Hello World  ", expectedOutput: "hello_world" },
        {
          input: "  Python Programming  ",
          expectedOutput: "python_programming",
        },
      ],
      language: "Python",
      hints: [
        "Use strip() to remove whitespace",
        "Use lower() to convert to lowercase",
        "Use replace() to substitute characters",
        "Chain methods together for efficient processing",
      ],
    },
    settings: {
      timeLimit: 900,
      enableCodeCompletion: true,
      showTestCases: true,
    },
  },

  {
    title: "Python Control Flow Patterns",
    description: "Master if-else statements, loops, and control structures",
    activityType: "matching",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 22,
    experienceReward: 50,
    estimatedMinutes: 16,
    tags: ["control-flow", "if-else", "loops", "patterns"],
    content: {
      instructions:
        "Match each code pattern with its correct description or output",
      pairs: [
        {
          id: "1",
          left: "if x > 0:\n    print('Positive')\nelif x < 0:\n    print('Negative')\nelse:\n    print('Zero')",
          right: "Number Classification",
          explanation:
            "This pattern classifies numbers as positive, negative, or zero",
        },
        {
          id: "2",
          left: "for i in range(5):\n    if i == 2:\n        continue\n    print(i)",
          right: "0 1 3 4",
          explanation: "Continue skips iteration when i equals 2",
        },
        {
          id: "3",
          left: "while x < 10:\n    x += 2\n    if x == 8:\n        break",
          right: "Loop with Early Exit",
          explanation: "While loop that exits when condition is met",
        },
        {
          id: "4",
          left: "result = 'Even' if n % 2 == 0 else 'Odd'",
          right: "Ternary Operator",
          explanation: "Conditional expression for concise if-else logic",
        },
        {
          id: "5",
          left: "for i in range(3):\n    for j in range(2):\n        print(f'{i},{j}')",
          right: "Nested Loop Output",
          explanation: "Produces combinations of i and j values",
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

  {
    title: "List Operations and Methods",
    description: "Comprehensive guide to Python list manipulation techniques",
    activityType: "code_builder",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 25,
    experienceReward: 55,
    estimatedMinutes: 20,
    tags: ["lists", "methods", "data-structures", "operations"],
    content: {
      instructions: "Build a complete list processing function",
      targetOutput: "Processed list with various operations",
      availableBlocks: [
        {
          id: "def_process",
          code: "def process_list(numbers):",
          type: "function",
          description: "Function definition for list processor",
        },
        {
          id: "remove_neg",
          code: "positive_nums = [x for x in numbers if x > 0]",
          type: "filter",
          description: "Filter out negative numbers using list comprehension",
        },
        {
          id: "sort_list",
          code: "positive_nums.sort()",
          type: "operation",
          description: "Sort the list in ascending order",
        },
        {
          id: "add_squared",
          code: "squared = [x**2 for x in positive_nums]",
          type: "transform",
          description: "Create list of squared values",
        },
        {
          id: "return_result",
          code: "return squared[:3]",
          type: "return",
          description: "Return first 3 elements of processed list",
        },
      ],
      language: "Python",
      solution: [
        "def process_list(numbers):",
        "    positive_nums = [x for x in numbers if x > 0]",
        "    positive_nums.sort()",
        "    squared = [x**2 for x in positive_nums]",
        "    return squared[:3]",
      ],
    },
    settings: {
      timeLimit: 800,
      codeTemplate:
        "def process_list(numbers):\n    # Your code here\n    pass",
      runTests: true,
      showOutput: true,
    },
  },

  {
    title: "Dictionary Operations Deep Dive",
    description: "Master Python dictionary methods and data manipulation",
    activityType: "interactive_demo",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 28,
    experienceReward: 60,
    estimatedMinutes: 22,
    tags: ["dictionaries", "key-value", "data-structures", "methods"],
    content: {
      title: "Python Dictionary Mastery",
      description:
        "Learn advanced dictionary operations with interactive examples",
      steps: [
        {
          id: 1,
          title: "Dictionary Creation and Access",
          description:
            "Learn multiple ways to create and access dictionary data",
          code: "student = {'name': 'Alice', 'age': 20, 'grade': 'A'}\nprint(student['name'])\nprint(student.get('age', 0))",
          explanation:
            "Dictionaries store key-value pairs. Use square brackets or get() method for access.",
          interactive: true,
          questions: [
            {
              question:
                "What's the safe way to access a dictionary key that might not exist?",
              options: ["dict[key]", "dict.get(key)", "dict.key", "dict(key)"],
              correct: 1,
            },
          ],
        },
        {
          id: 2,
          title: "Dictionary Methods",
          description:
            "Explore useful dictionary methods for data manipulation",
          code: "data = {'a': 1, 'b': 2, 'c': 3}\nkeys = list(data.keys())\nvalues = list(data.values())\nitems = list(data.items())",
          explanation:
            "Use keys(), values(), and items() to access different parts of the dictionary.",
          interactive: true,
        },
        {
          id: 3,
          title: "Dictionary Comprehensions",
          description: "Create dictionaries using comprehension syntax",
          code: "numbers = [1, 2, 3, 4, 5]\nsquared_dict = {x: x**2 for x in numbers}\nprint(squared_dict)",
          explanation:
            "Dictionary comprehensions provide a concise way to create dictionaries from iterables.",
          interactive: true,
        },
        {
          id: 4,
          title: "Merging and Updating",
          description: "Learn different ways to combine dictionaries",
          code: "dict1 = {'a': 1, 'b': 2}\ndict2 = {'c': 3, 'd': 4}\nmerged = {**dict1, **dict2}\ndict1.update(dict2)",
          explanation:
            "Use unpacking (**) or update() method to merge dictionaries.",
          interactive: true,
        },
      ],
      timeLimit: 900,
      language: "Python",
    },
    settings: {
      livePreview: true,
      showResults: true,
      allowHints: true,
    },
  },

  {
    title: "Function Fundamentals Builder",
    description: "Learn to create and use Python functions effectively",
    activityType: "drag_drop",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 24,
    experienceReward: 52,
    estimatedMinutes: 18,
    tags: ["functions", "parameters", "return", "scope"],
    content: {
      instructions:
        "Drag code blocks to create a complete function with proper structure",
      items: [
        {
          id: 1,
          value: "def calculate_area(length, width):",
          type: "definition",
        },
        { id: 2, value: '"""Calculate rectangle area"""', type: "docstring" },
        { id: 3, value: "if length <= 0 or width <= 0:", type: "validation" },
        { id: 4, value: "return None", type: "error_return" },
        { id: 5, value: "area = length * width", type: "calculation" },
        { id: 6, value: "return area", type: "return" },
        {
          id: 7,
          value: "result = calculate_area(5, 3)",
          type: "function_call",
        },
        { id: 8, value: "print(f'Area: {result}')", type: "output" },
      ],
      categories: [
        {
          id: "definition",
          name: "Function Definition",
          description: "def statement",
        },
        {
          id: "docstring",
          name: "Documentation",
          description: "Function description",
        },
        {
          id: "validation",
          name: "Input Validation",
          description: "Parameter checks",
        },
        {
          id: "error_return",
          name: "Error Handling",
          description: "Return on error",
        },
        {
          id: "calculation",
          name: "Main Logic",
          description: "Core computation",
        },
        {
          id: "return",
          name: "Return Statement",
          description: "Function output",
        },
        {
          id: "function_call",
          name: "Function Usage",
          description: "Calling the function",
        },
        { id: "output", name: "Display Result", description: "Print output" },
      ],
    },
    settings: {
      timeLimit: 700,
      showNesting: true,
      validateStructure: true,
      highlightErrors: true,
    },
  },

  // DIFFICULTY 3 - INTERMEDIATE (5 activities)
  {
    title: "List Comprehensions and Generators",
    description:
      "Master advanced Python iteration techniques for efficient data processing",
    activityType: "algorithm_visualization",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 20,
    tags: ["comprehensions", "generators", "iteration", "memory-efficiency"],
    content: {
      algorithm: "list_comprehension_vs_generator",
      description:
        "Compare memory usage and performance of different iteration methods",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n) vs O(1)",
      explanation:
        "List comprehensions create entire lists in memory, while generators produce items on-demand for better memory efficiency.",
      initialData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      steps: [
        {
          id: 1,
          description: "Traditional for loop approach",
          data: [],
          highlights: [],
          comparison: [],
          action:
            "result = []\nfor x in data:\n    if x % 2 == 0:\n        result.append(x**2)",
        },
        {
          id: 2,
          description: "List comprehension - creates full list",
          data: [4, 16, 36, 64, 100],
          highlights: [0, 1, 2, 3, 4],
          comparison: [],
          action: "result = [x**2 for x in data if x % 2 == 0]",
        },
        {
          id: 3,
          description: "Generator expression - lazy evaluation",
          data: [4],
          highlights: [0],
          comparison: [],
          action: "result = (x**2 for x in data if x % 2 == 0)",
        },
        {
          id: 4,
          description: "Generator yields values one at a time",
          data: [4, 16],
          highlights: [0, 1],
          comparison: [],
          action: "next(result) produces values on demand",
        },
      ],
      visualizations: [
        {
          operation: "List Comprehension",
          setA: ["Memory:", "All items", "stored"],
          setB: ["Speed:", "Fast access", "to all"],
          result: ["Use for:", "Small datasets", "multiple access"],
          code: "# List comprehension - all items in memory\nsquares = [x**2 for x in range(1000) if x % 2 == 0]\nprint(len(squares))  # All items created",
          explanation:
            "List comprehensions create the entire list immediately, using more memory but allowing fast repeated access.",
          visual: "memory_usage",
        },
        {
          operation: "Generator Expression",
          setA: ["Memory:", "One item", "at a time"],
          setB: ["Speed:", "Lazy", "evaluation"],
          result: ["Use for:", "Large datasets", "single pass"],
          code: "# Generator expression - lazy evaluation\nsquares = (x**2 for x in range(1000) if x % 2 == 0)\nprint(next(squares))  # Only one item created",
          explanation:
            "Generators produce items on-demand, using minimal memory but requiring regeneration for multiple passes.",
          visual: "lazy_evaluation",
        },
      ],
      code: "# Comparing approaches\ndata = range(1, 11)\n\n# List comprehension\nlist_comp = [x**2 for x in data if x % 2 == 0]\nprint('List:', list_comp)\n\n# Generator expression\ngen_exp = (x**2 for x in data if x % 2 == 0)\nprint('Generator:', list(gen_exp))\n\n# Memory usage difference is significant for large datasets",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
  },

  {
    title: "Exception Handling and Error Management",
    description: "Learn to handle errors gracefully in Python programs",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 32,
    experienceReward: 70,
    estimatedMinutes: 25,
    tags: ["exceptions", "error-handling", "try-catch", "debugging"],
    content: {
      instructions:
        "Create a robust function that handles various types of errors",
      problem:
        "Build a safe calculator that handles division by zero, invalid inputs, and other errors",
      starterCode:
        'def safe_calculator(operation, a, b):\n    """Perform calculation with error handling"""\n    try:\n        # Your code here\n        pass\n    except:\n        # Handle errors\n        pass',
      solution:
        "def safe_calculator(operation, a, b):\n    try:\n        a, b = float(a), float(b)\n        if operation == '+':\n            return a + b\n        elif operation == '-':\n            return a - b\n        elif operation == '*':\n            return a * b\n        elif operation == '/':\n            if b == 0:\n                raise ZeroDivisionError('Cannot divide by zero')\n            return a / b\n        else:\n            raise ValueError('Invalid operation')\n    except ValueError as e:\n        return f'Value Error: {e}'\n    except ZeroDivisionError as e:\n        return f'Division Error: {e}'\n    except Exception as e:\n        return f'Unexpected Error: {e}'",
      testCases: [
        {
          input: "('/', 10, 0)",
          expectedOutput: "Division Error: Cannot divide by zero",
        },
        {
          input: "('*', 'abc', 5)",
          expectedOutput: "Value Error: could not convert string to float: abc",
        },
        { input: "('+', 5, 3)", expectedOutput: "8.0" },
      ],
      language: "Python",
      hints: [
        "Use try-except blocks for error handling",
        "Handle specific exception types separately",
        "Convert inputs to appropriate types",
        "Provide meaningful error messages",
      ],
    },
    settings: {
      timeLimit: 1200,
      enableCodeCompletion: true,
      showTestCases: true,
    },
  },

  {
    title: "File Operations and Context Managers",
    description: "Master file handling and the 'with' statement in Python",
    activityType: "fill_blanks",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 28,
    experienceReward: 62,
    estimatedMinutes: 22,
    tags: ["files", "context-managers", "with-statement", "io"],
    content: {
      instructions: "Complete file operations using proper Python practices",
      exercises: [
        {
          id: 1,
          description: "Read file content safely using context manager",
          template:
            "____ open('data.txt', '____') as file:\n    content = file.____\n    print(content)",
          blanks: [
            { id: "blank1", answer: "with", position: 0 },
            { id: "blank2", answer: "r", position: 1 },
            { id: "blank3", answer: "read()", position: 2 },
          ],
          expectedOutput: "File content is read safely",
        },
        {
          id: 2,
          description: "Write multiple lines to a file",
          template:
            "lines = ['Line 1', 'Line 2', 'Line 3']\nwith open('output.txt', '____') as f:\n    for line in lines:\n        f.____(____ + '\\n')",
          blanks: [
            { id: "blank4", answer: "w", position: 0 },
            { id: "blank5", answer: "write", position: 1 },
            { id: "blank6", answer: "line", position: 2 },
          ],
          expectedOutput: "Lines written to file",
        },
        {
          id: 3,
          description: "Read file line by line and process",
          template:
            "with open('data.txt', 'r') as file:\n    for ____ in ____:\n        processed_line = line.____().upper()\n        print(processed_line)",
          blanks: [
            { id: "blank7", answer: "line", position: 0 },
            { id: "blank8", answer: "file", position: 1 },
            { id: "blank9", answer: "strip", position: 2 },
          ],
          expectedOutput: "Processed lines printed",
        },
        {
          id: 4,
          description: "Handle file errors gracefully",
          template:
            "try:\n    with open('____', 'r') as f:\n        data = f.read()\nexcept ____ as e:\n    print(f'File not found: {e}')",
          blanks: [
            { id: "blank10", answer: "nonexistent.txt", position: 0 },
            { id: "blank11", answer: "FileNotFoundError", position: 1 },
          ],
          expectedOutput: "Error handled gracefully",
        },
      ],
    },
    settings: {
      timeLimit: 900,
      allowHints: true,
      caseSensitive: false,
    },
  },

  {
    title: "Lambda Functions and Functional Programming",
    description: "Explore lambda functions, map, filter, and reduce in Python",
    activityType: "matching",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 35,
    experienceReward: 75,
    estimatedMinutes: 18,
    tags: ["lambda", "functional-programming", "map", "filter"],
    content: {
      instructions:
        "Match lambda expressions and functional programming concepts with their results",
      pairs: [
        {
          id: "1",
          left: "list(map(lambda x: x**2, [1, 2, 3, 4]))",
          right: "[1, 4, 9, 16]",
          explanation: "map() applies the lambda function to each element",
        },
        {
          id: "2",
          left: "list(filter(lambda x: x % 2 == 0, [1, 2, 3, 4, 5, 6]))",
          right: "[2, 4, 6]",
          explanation: "filter() keeps only elements where lambda returns True",
        },
        {
          id: "3",
          left: "from functools import reduce\nreduce(lambda x, y: x + y, [1, 2, 3, 4])",
          right: "10",
          explanation: "reduce() applies function cumulatively to items",
        },
        {
          id: "4",
          left: "sorted(['apple', 'pie', 'cherry'], key=lambda x: len(x))",
          right: "['pie', 'apple', 'cherry']",
          explanation:
            "sorted() uses lambda as key function for custom sorting",
        },
        {
          id: "5",
          left: "(lambda x, y: x * y)(5, 3)",
          right: "15",
          explanation: "Lambda function called immediately with arguments",
        },
        {
          id: "6",
          left: "max([('a', 3), ('b', 1), ('c', 5)], key=lambda x: x[1])",
          right: "('c', 5)",
          explanation:
            "max() uses lambda to compare by second element of tuples",
        },
      ],
      allowShuffle: true,
      showProgress: true,
    },
    settings: {
      showExplanations: true,
      allowMultipleAttempts: true,
      timeLimit: 700,
    },
  },

  {
    title: "Object-Oriented Programming Basics",
    description:
      "Introduction to classes, objects, and OOP principles in Python",
    activityType: "class_builder",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 40,
    experienceReward: 80,
    estimatedMinutes: 30,
    tags: ["oop", "classes", "objects", "inheritance"],
    content: {
      instructions:
        "Build a complete class representing a bank account with proper encapsulation",
      className: "BankAccount",
      language: "Python",
      requiredProperties: [
        { name: "account_number", type: "str", visibility: "public" },
        { name: "owner_name", type: "str", visibility: "public" },
        { name: "_balance", type: "float", visibility: "private" },
        { name: "_transaction_history", type: "list", visibility: "private" },
      ],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["account_number", "owner_name", "initial_balance"],
          visibility: "public",
        },
        {
          name: "deposit",
          returnType: "bool",
          parameters: ["amount"],
          visibility: "public",
        },
        {
          name: "withdraw",
          returnType: "bool",
          parameters: ["amount"],
          visibility: "public",
        },
        {
          name: "get_balance",
          returnType: "float",
          parameters: [],
          visibility: "public",
        },
        {
          name: "get_statement",
          returnType: "list",
          parameters: [],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "account_number",
          type: "str",
          visibility: "public",
          description: "Unique account identifier",
        },
        {
          name: "owner_name",
          type: "str",
          visibility: "public",
          description: "Account holder's name",
        },
        {
          name: "_balance",
          type: "float",
          visibility: "private",
          description: "Current account balance",
        },
        {
          name: "_transaction_history",
          type: "list",
          visibility: "private",
          description: "List of all transactions",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["account_number", "owner_name", "initial_balance"],
          visibility: "public",
          description: "Initialize bank account",
        },
        {
          name: "deposit",
          returnType: "bool",
          parameters: ["amount"],
          visibility: "public",
          description: "Add money to account",
        },
        {
          name: "withdraw",
          returnType: "bool",
          parameters: ["amount"],
          visibility: "public",
          description: "Remove money from account",
        },
        {
          name: "get_balance",
          returnType: "float",
          parameters: [],
          visibility: "public",
          description: "Return current balance",
        },
        {
          name: "get_statement",
          returnType: "list",
          parameters: [],
          visibility: "public",
          description: "Return transaction history",
        },
      ],
      allowCustom: true,
      hints: [
        "Use __init__ to initialize object state",
        "Make sensitive data private with underscore prefix",
        "Validate inputs in methods",
        "Track all transactions for audit trail",
      ],
    },
    settings: {
      timeLimit: 1800,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
  },

  // DIFFICULTY 4 - ADVANCED (4 activities)
  {
    title: "Decorators and Higher-Order Functions",
    description: "Master Python decorators and function composition techniques",
    activityType: "algorithm_visualization",
    category: "Python Fundamentals",
    difficulty: 4,
    diamondReward: 45,
    experienceReward: 90,
    estimatedMinutes: 25,
    tags: ["decorators", "higher-order", "functions", "advanced"],
    content: {
      algorithm: "decorator_pattern",
      description: "Visualize how decorators wrap and modify function behavior",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      explanation:
        "Decorators are functions that modify or extend the behavior of other functions without permanently modifying them.",
      initialData: ["function", "decorator", "wrapper"],
      steps: [
        {
          id: 1,
          description: "Define original function",
          data: ["def greet(name):", "return f'Hello, {name}'"],
          highlights: [0],
          comparison: [],
          action: "Original function defined",
        },
        {
          id: 2,
          description: "Create decorator function",
          data: [
            "def timing_decorator(func):",
            "def wrapper(*args, **kwargs):",
            "# timing logic",
            "return func(*args, **kwargs)",
          ],
          highlights: [1],
          comparison: [],
          action: "Decorator wraps the original function",
        },
        {
          id: 3,
          description: "Apply decorator using @syntax",
          data: [
            "@timing_decorator",
            "def greet(name):",
            "return f'Hello, {name}'",
          ],
          highlights: [0, 1],
          comparison: [],
          action: "Function is wrapped automatically",
        },
        {
          id: 4,
          description: "Function call with decoration",
          data: [
            "greet('Alice')",
            "# timing starts",
            "# original function executes",
            "# timing ends",
            "# return result",
          ],
          highlights: [0, 1, 2, 3, 4],
          comparison: [],
          action: "Decorated function executes with added behavior",
        },
      ],
      visualizations: [
        {
          operation: "Function Decorator",
          setA: ["Original", "Function", "Behavior"],
          setB: ["Decorator", "Adds", "Features"],
          result: ["Enhanced", "Function", "Result"],
          code: "def timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        end = time.time()\n        print(f'{func.__name__} took {end-start:.4f}s')\n        return result\n    return wrapper\n\n@timer\ndef slow_function():\n    time.sleep(1)\n    return 'Done'",
          explanation:
            "Decorators wrap functions to add functionality like timing, logging, or authentication without modifying the original code.",
          visual: "wrapper_pattern",
        },
      ],
      code: "import time\nfrom functools import wraps\n\ndef timer(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        elapsed = time.time() - start\n        print(f'{func.__name__} executed in {elapsed:.4f}s')\n        return result\n    return wrapper\n\n@timer\ndef calculate_fibonacci(n):\n    if n <= 1:\n        return n\n    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)\n\nresult = calculate_fibonacci(10)",
    },
    settings: {
      animationSpeed: "slow",
      showComplexity: true,
      allowStepByStep: true,
    },
  },

  {
    title: "Advanced Data Structures and Collections",
    description:
      "Explore Python's advanced data structures: sets, namedtuples, and collections",
    activityType: "data_exploration",
    category: "Python Fundamentals",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 85,
    estimatedMinutes: 28,
    tags: ["data-structures", "collections", "sets", "namedtuple"],
    content: {
      title: "Advanced Collections Analysis",
      instructions:
        "Analyze and manipulate data using Python's advanced collection types",
      dataset: [
        {
          id: "1",
          name: "Alice",
          skills: ["Python", "JavaScript", "SQL"],
          level: "Senior",
        },
        {
          id: "2",
          name: "Bob",
          skills: ["Java", "Python", "Docker"],
          level: "Mid",
        },
        {
          id: "3",
          name: "Charlie",
          skills: ["Python", "React", "Node.js"],
          level: "Senior",
        },
        {
          id: "4",
          name: "Diana",
          skills: ["C++", "Python", "Machine Learning"],
          level: "Senior",
        },
        {
          id: "5",
          name: "Eve",
          skills: ["Python", "Data Science", "SQL"],
          level: "Mid",
        },
      ],
      questions: [
        {
          id: "q1",
          question:
            "Find all unique skills across all developers using set operations",
          type: "analyze",
          answer:
            "{'Python', 'JavaScript', 'SQL', 'Java', 'Docker', 'React', 'Node.js', 'C++', 'Machine Learning', 'Data Science'}",
          hint: "Use set union or set comprehension to combine all skill lists",
        },
        {
          id: "q2",
          question: "Which skills are common to at least 3 developers?",
          type: "filter",
          answer: "{'Python', 'SQL'}",
          hint: "Count skill occurrences and filter by frequency",
        },
        {
          id: "q3",
          question: "Create a Counter to show skill frequency distribution",
          type: "calculate",
          answer:
            "Counter({'Python': 5, 'SQL': 2, 'JavaScript': 1, 'Java': 1, 'Docker': 1, 'React': 1, 'Node.js': 1, 'C++': 1, 'Machine Learning': 1, 'Data Science': 1})",
          hint: "Use collections.Counter to count skill occurrences",
        },
        {
          id: "q4",
          question: "Group developers by experience level using defaultdict",
          type: "analyze",
          answer:
            "{'Senior': ['Alice', 'Charlie', 'Diana'], 'Mid': ['Bob', 'Eve']}",
          hint: "Use collections.defaultdict(list) to group by level",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 1400,
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: true,
    },
  },

  {
    title: "Regular Expressions and Pattern Matching",
    description:
      "Master regex patterns for text processing and data validation",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 4,
    diamondReward: 42,
    experienceReward: 88,
    estimatedMinutes: 30,
    tags: ["regex", "patterns", "text-processing", "validation"],
    content: {
      instructions:
        "Create a comprehensive text processor using regular expressions",
      problem:
        "Build a data validator that can extract and validate emails, phone numbers, and dates from text",
      starterCode:
        "import re\n\ndef text_processor(text):\n    \"\"\"Extract and validate data patterns from text\"\"\"\n    results = {\n        'emails': [],\n        'phones': [],\n        'dates': [],\n        'valid_emails': [],\n        'valid_phones': []\n    }\n    \n    # Your regex patterns here\n    \n    return results",
      solution:
        "import re\n\ndef text_processor(text):\n    results = {\n        'emails': [],\n        'phones': [],\n        'dates': [],\n        'valid_emails': [],\n        'valid_phones': []\n    }\n    \n    # Email pattern\n    email_pattern = r'\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b'\n    results['emails'] = re.findall(email_pattern, text)\n    \n    # Phone pattern (US format)\n    phone_pattern = r'\\b(?:\\+1[-.]?)?\\(?([0-9]{3})\\)?[-.]?([0-9]{3})[-.]?([0-9]{4})\\b'\n    results['phones'] = re.findall(phone_pattern, text)\n    \n    # Date pattern (MM/DD/YYYY or MM-DD-YYYY)\n    date_pattern = r'\\b(0?[1-9]|1[0-2])[/-](0?[1-9]|[12][0-9]|3[01])[/-](19|20)\\d{2}\\b'\n    results['dates'] = re.findall(date_pattern, text)\n    \n    # Validation with more strict patterns\n    strict_email = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'\n    for email in results['emails']:\n        if re.match(strict_email, email):\n            results['valid_emails'].append(email)\n    \n    return results",
      testCases: [
        {
          input:
            "'Contact: john@example.com or call (555) 123-4567. Meeting on 12/25/2023'",
          expectedOutput: "Extracted emails, phones, and dates",
        },
      ],
      language: "Python",
      hints: [
        "Use \\b for word boundaries in patterns",
        "Group parts of patterns with parentheses",
        "Use ? for optional parts, + for one or more, * for zero or more",
        "Test patterns with different text formats",
      ],
    },
    settings: {
      timeLimit: 1500,
      enableCodeCompletion: true,
      showTestCases: true,
    },
  },

  {
    title: "Context Managers and Resource Management",
    description:
      "Advanced context manager creation and resource handling patterns",
    activityType: "code_builder",
    category: "Python Fundamentals",
    difficulty: 4,
    diamondReward: 48,
    experienceReward: 95,
    estimatedMinutes: 32,
    tags: ["context-managers", "resources", "with-statement", "cleanup"],
    content: {
      instructions:
        "Build a custom context manager for database connections with proper resource cleanup",
      targetOutput: "Context manager with setup and cleanup functionality",
      availableBlocks: [
        {
          id: "class_def",
          code: "class DatabaseConnection:",
          type: "class",
          description: "Context manager class definition",
        },
        {
          id: "init_method",
          code: "def __init__(self, host, port, database):",
          type: "method",
          description: "Initialize connection parameters",
        },
        {
          id: "enter_method",
          code: "def __enter__(self):",
          type: "context",
          description: "Context manager entry point",
        },
        {
          id: "connect_logic",
          code: "self.connection = self._connect()\nprint(f'Connected to {self.database}')\nreturn self.connection",
          type: "operation",
          description: "Establish database connection",
        },
        {
          id: "exit_method",
          code: "def __exit__(self, exc_type, exc_val, exc_tb):",
          type: "context",
          description: "Context manager exit point",
        },
        {
          id: "cleanup_logic",
          code: "if self.connection:\n    self.connection.close()\n    print('Connection closed')\nif exc_type:\n    print(f'Exception occurred: {exc_val}')\nreturn False",
          type: "cleanup",
          description: "Clean up resources and handle exceptions",
        },
        {
          id: "helper_method",
          code: "def _connect(self):\n    # Simulate connection\n    return MockConnection(self.host, self.port)",
          type: "helper",
          description: "Private helper method for connection",
        },
        {
          id: "usage_example",
          code: "with DatabaseConnection('localhost', 5432, 'mydb') as conn:\n    # Use connection\n    conn.execute('SELECT * FROM users')",
          type: "usage",
          description: "Example of using the context manager",
        },
      ],
      language: "Python",
      solution: [
        "class DatabaseConnection:",
        "    def __init__(self, host, port, database):",
        "        self.host = host",
        "        self.port = port",
        "        self.database = database",
        "        self.connection = None",
        "    ",
        "    def __enter__(self):",
        "        self.connection = self._connect()",
        "        print(f'Connected to {self.database}')",
        "        return self.connection",
        "    ",
        "    def __exit__(self, exc_type, exc_val, exc_tb):",
        "        if self.connection:",
        "            self.connection.close()",
        "            print('Connection closed')",
        "        if exc_type:",
        "            print(f'Exception occurred: {exc_val}')",
        "        return False",
        "    ",
        "    def _connect(self):",
        "        return MockConnection(self.host, self.port)",
      ],
    },
    settings: {
      timeLimit: 1200,
      codeTemplate: "class DatabaseConnection:\n    # Your code here\n    pass",
      runTests: true,
      showOutput: true,
    },
  },

  // DIFFICULTY 5 - EXPERT (2 activities)
  {
    title: "Metaclasses and Dynamic Class Creation",
    description:
      "Explore Python's metaclass system and dynamic class generation",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 5,
    diamondReward: 55,
    experienceReward: 110,
    estimatedMinutes: 35,
    tags: ["metaclasses", "dynamic", "class-creation", "expert"],
    content: {
      instructions:
        "Create a metaclass that automatically adds validation methods to classes",
      problem:
        "Build a metaclass that adds automatic property validation based on type hints",
      starterCode:
        'class ValidationMeta(type):\n    """Metaclass that adds validation methods"""\n    def __new__(mcs, name, bases, namespace, **kwargs):\n        # Your metaclass logic here\n        pass\n    \nclass Person(metaclass=ValidationMeta):\n    def __init__(self, name: str, age: int):\n        self.name = name\n        self.age = age',
      solution:
        "import inspect\nfrom typing import get_type_hints\n\nclass ValidationMeta(type):\n    def __new__(mcs, name, bases, namespace, **kwargs):\n        # Get the class\n        cls = super().__new__(mcs, name, bases, namespace)\n        \n        # Add validation if __init__ exists\n        if '__init__' in namespace:\n            original_init = namespace['__init__']\n            type_hints = get_type_hints(original_init)\n            \n            def validated_init(self, *args, **kwargs):\n                # Get parameter names from original __init__\n                sig = inspect.signature(original_init)\n                bound_args = sig.bind(self, *args, **kwargs)\n                bound_args.apply_defaults()\n                \n                # Validate each argument\n                for param_name, value in bound_args.arguments.items():\n                    if param_name != 'self' and param_name in type_hints:\n                        expected_type = type_hints[param_name]\n                        if not isinstance(value, expected_type):\n                            raise TypeError(f'{param_name} must be {expected_type.__name__}, got {type(value).__name__}')\n                \n                # Call original __init__\n                original_init(self, *args, **kwargs)\n            \n            cls.__init__ = validated_init\n        \n        return cls\n\nclass Person(metaclass=ValidationMeta):\n    def __init__(self, name: str, age: int):\n        self.name = name\n        self.age = age\n\n# Test the metaclass\ntry:\n    p1 = Person('Alice', 25)  # Valid\n    p2 = Person('Bob', '30')  # Should raise TypeError\nexcept TypeError as e:\n    print(f'Validation error: {e}')",
      testCases: [
        {
          input: "Person('Alice', 25)",
          expectedOutput: "Valid object created",
        },
        {
          input: "Person('Bob', '30')",
          expectedOutput: "TypeError: age must be int, got str",
        },
      ],
      language: "Python",
      hints: [
        "Metaclasses control class creation",
        "Use type hints to determine expected types",
        "Wrap the original __init__ method",
        "Use inspect module to get function signatures",
      ],
    },
    settings: {
      timeLimit: 1800,
      enableCodeCompletion: true,
      showTestCases: true,
    },
  },

  {
    title: "Asynchronous Programming with asyncio",
    description:
      "Master async/await patterns and concurrent programming in Python",
    activityType: "algorithm_visualization",
    category: "Python Fundamentals",
    difficulty: 5,
    diamondReward: 60,
    experienceReward: 120,
    estimatedMinutes: 40,
    tags: ["asyncio", "async-await", "concurrency", "expert"],
    content: {
      algorithm: "async_execution",
      description:
        "Visualize how async/await enables concurrent execution without threading",
      timeComplexity: "O(1) per operation",
      spaceComplexity: "O(n) for n concurrent tasks",
      explanation:
        "Asynchronous programming allows multiple operations to run concurrently in a single thread using an event loop.",
      initialData: ["Task1", "Task2", "Task3"],
      steps: [
        {
          id: 1,
          description: "Start async event loop",
          data: ["Event Loop Started"],
          highlights: [0],
          comparison: [],
          action: "asyncio.run(main()) initializes event loop",
        },
        {
          id: 2,
          description: "Schedule multiple async tasks",
          data: ["Task1: Started", "Task2: Started", "Task3: Started"],
          highlights: [0, 1, 2],
          comparison: [],
          action: "asyncio.gather() schedules tasks concurrently",
        },
        {
          id: 3,
          description: "Task1 hits await - yields control",
          data: ["Task1: Waiting", "Task2: Running", "Task3: Running"],
          highlights: [1, 2],
          comparison: [0],
          action: "await asyncio.sleep() yields control to event loop",
        },
        {
          id: 4,
          description: "All tasks running concurrently",
          data: ["Task1: Waiting", "Task2: Waiting", "Task3: Waiting"],
          highlights: [],
          comparison: [0, 1, 2],
          action: "Event loop manages all waiting tasks",
        },
        {
          id: 5,
          description: "Tasks complete as I/O finishes",
          data: ["Task1: Complete", "Task2: Complete", "Task3: Complete"],
          highlights: [0, 1, 2],
          comparison: [],
          action: "Tasks complete when async operations finish",
        },
      ],
      visualizations: [
        {
          operation: "Synchronous vs Asynchronous",
          setA: ["Sync:", "Task1 → Task2 → Task3", "Total: 3 seconds"],
          setB: ["Async:", "Task1 ∥ Task2 ∥ Task3", "Total: 1 second"],
          result: ["Benefit:", "Concurrent execution", "Better throughput"],
          code: "import asyncio\nimport time\n\n# Synchronous version\ndef sync_task(name, delay):\n    time.sleep(delay)\n    return f'{name} completed'\n\ndef sync_main():\n    start = time.time()\n    results = []\n    for i in range(3):\n        result = sync_task(f'Task{i+1}', 1)\n        results.append(result)\n    print(f'Sync total time: {time.time() - start:.2f}s')\n    return results\n\n# Asynchronous version\nasync def async_task(name, delay):\n    await asyncio.sleep(delay)\n    return f'{name} completed'\n\nasync def async_main():\n    start = time.time()\n    tasks = [async_task(f'Task{i+1}', 1) for i in range(3)]\n    results = await asyncio.gather(*tasks)\n    print(f'Async total time: {time.time() - start:.2f}s')\n    return results",
          explanation:
            "Async allows I/O-bound tasks to run concurrently, dramatically improving performance when waiting for external resources.",
          visual: "concurrent_timeline",
        },
      ],
      code: 'import asyncio\nimport aiohttp\nimport time\n\nasync def fetch_data(session, url):\n    """Fetch data from URL asynchronously"""\n    async with session.get(url) as response:\n        return await response.text()\n\nasync def process_urls(urls):\n    """Process multiple URLs concurrently"""\n    async with aiohttp.ClientSession() as session:\n        tasks = [fetch_data(session, url) for url in urls]\n        results = await asyncio.gather(*tasks)\n        return results\n\n# Usage\nurls = [\'http://httpbin.org/delay/1\' for _ in range(5)]\nstart_time = time.time()\nresults = asyncio.run(process_urls(urls))\nend_time = time.time()\n\nprint(f\'Processed {len(urls)} URLs in {end_time - start_time:.2f} seconds\')',
    },
    settings: {
      animationSpeed: "slow",
      showComplexity: true,
      allowStepByStep: true,
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
