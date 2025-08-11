const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedTopicBasedActivities() {
  console.log("🎯 Creating topic-based learning structure...");

  // First, clear existing activities
  await prisma.learningActivity.deleteMany({});
  console.log("🗑️ Cleared existing activities");

  const topicActivities = [
    // ===========================================
    // PYTHON FUNDAMENTALS TOPIC (6 activities)
    // ===========================================

    // 1. Python Fundamentals - Variables Introduction
    {
      title: "Python Variables & Data Types",
      description:
        "Learn the basics of Python variables and data types with interactive examples.",
      activityType: "interactive_demo",
      difficulty: 1,
      category: "Python Fundamentals",
      sortOrder: 1,
      isLocked: false,
      diamondReward: 10,
      experienceReward: 25,
      estimatedMinutes: 4,
      isActive: true,
      tags: JSON.stringify(["python", "variables", "basics", "data-types"]),
      content: JSON.stringify({
        slides: [
          {
            id: "intro",
            title: "What are Variables?",
            content:
              "Variables are containers that store data values. In Python, you don't need to declare variable types.",
            example: "name = 'Alice'\nage = 25\nheight = 5.7",
            interactive: {
              type: "code_runner",
              code: "name = 'Alice'\nprint(f'Hello, {name}!')",
            },
          },
          {
            id: "types",
            title: "Data Types",
            content:
              "Python has several built-in data types: strings, integers, floats, and booleans.",
            example:
              "text = 'Hello'     # String\nnumber = 42       # Integer\nprice = 19.99     # Float\nis_student = True # Boolean",
            interactive: {
              type: "type_checker",
              variables: ["text", "number", "price", "is_student"],
            },
          },
        ],
      }),
      settings: JSON.stringify({
        autoProgress: false,
        showNavigation: true,
        enableInteraction: true,
      }),
    },

    // 2. Python Fundamentals - Built-in Functions
    {
      title: "Python Built-in Functions Matching",
      description:
        "Match Python built-in functions with their correct outputs and learn their usage.",
      activityType: "matching",
      difficulty: 2,
      category: "Python Fundamentals",
      sortOrder: 2,
      isLocked: false,
      diamondReward: 15,
      experienceReward: 45,
      estimatedMinutes: 3,
      isActive: true,
      tags: JSON.stringify(["python", "functions", "built-in", "matching"]),
      content: JSON.stringify({
        leftItems: [
          { id: "len", text: "len('Hello')", type: "function" },
          { id: "max", text: "max([1, 5, 3])", type: "function" },
          { id: "sum", text: "sum([1, 2, 3])", type: "function" },
          { id: "type", text: "type(42)", type: "function" },
          { id: "str", text: "str(123)", type: "function" },
        ],
        rightItems: [
          { id: "len_result", text: "5", type: "result" },
          { id: "max_result", text: "5", type: "result" },
          { id: "sum_result", text: "6", type: "result" },
          { id: "type_result", text: "<class 'int'>", type: "result" },
          { id: "str_result", text: "'123'", type: "result" },
        ],
        correctMatches: [
          { left: "len", right: "len_result" },
          { left: "max", right: "max_result" },
          { left: "sum", right: "sum_result" },
          { left: "type", right: "type_result" },
          { left: "str", right: "str_result" },
        ],
      }),
      settings: JSON.stringify({
        timeLimit: 120,
        showHints: true,
        shuffleItems: true,
      }),
    },

    // 3. Python Fundamentals - For Loops
    {
      title: "Master Python For Loops",
      description:
        "Complete the missing parts in Python for loops to master iteration.",
      activityType: "fill_blanks",
      difficulty: 2,
      category: "Python Fundamentals",
      sortOrder: 3,
      isLocked: false,
      diamondReward: 15,
      experienceReward: 40,
      estimatedMinutes: 3,
      isActive: true,
      tags: JSON.stringify(["python", "loops", "for-loop", "iteration"]),
      content: JSON.stringify({
        codeTemplate:
          "numbers = [1, 2, 3, 4, 5]\ntotal = 0\n\n___ number ___ numbers:\n    total ___ number\n\nprint(f'Total: {___}')",
        blanks: [
          {
            id: "blank1",
            position: 1,
            answer: "for",
            options: ["for", "while", "if", "def"],
            hint: "This keyword is used to iterate over a sequence",
          },
          {
            id: "blank2",
            position: 2,
            answer: "in",
            options: ["in", "of", "on", "at"],
            hint: "This keyword connects the variable to the sequence",
          },
          {
            id: "blank3",
            position: 3,
            answer: "+=",
            options: ["+=", "=", "-=", "*="],
            hint: "This operator adds the value to the existing total",
          },
          {
            id: "blank4",
            position: 4,
            answer: "total",
            options: ["total", "number", "numbers", "sum"],
            hint: "Which variable contains our final result?",
          },
        ],
        expectedOutput: "Total: 15",
      }),
      settings: JSON.stringify({
        showHints: true,
        caseSensitive: false,
        allowMultipleAttempts: true,
      }),
    },

    // 4. Python Fundamentals - Conditional Logic
    {
      title: "Python If-Else Statements",
      description:
        "Learn Python conditional logic with if-else statements and practice decision making.",
      activityType: "interactive_demo",
      difficulty: 2,
      category: "Python Fundamentals",
      sortOrder: 4,
      isLocked: false,
      diamondReward: 12,
      experienceReward: 35,
      estimatedMinutes: 5,
      isActive: true,
      tags: JSON.stringify(["python", "conditionals", "if-else", "logic"]),
      content: JSON.stringify({
        slides: [
          {
            id: "if_basic",
            title: "Basic If Statements",
            content: "Use if statements to make decisions in your code.",
            example: "age = 18\nif age >= 18:\n    print('You can vote!')",
            interactive: {
              type: "code_runner",
              code: "age = 20\nif age >= 18:\n    print('You are an adult')\nelse:\n    print('You are a minor')",
            },
          },
          {
            id: "elif_chains",
            title: "Multiple Conditions with elif",
            content:
              "Use elif for multiple conditions and create complex decision trees.",
            example:
              "score = 85\nif score >= 90:\n    grade = 'A'\nelif score >= 80:\n    grade = 'B'\nelse:\n    grade = 'C'",
            interactive: {
              type: "grade_calculator",
              minScore: 0,
              maxScore: 100,
            },
          },
        ],
      }),
      settings: JSON.stringify({
        autoProgress: false,
        showNavigation: true,
        enableInteraction: true,
      }),
    },

    // 5. Python Fundamentals - Number Guessing Game
    {
      title: "Build a Number Guessing Game",
      description:
        "Create an interactive number guessing game combining loops, conditionals, and user input.",
      activityType: "interactive_coding",
      difficulty: 3,
      category: "Python Fundamentals",
      sortOrder: 5,
      isLocked: false,
      diamondReward: 30,
      experienceReward: 85,
      estimatedMinutes: 10,
      isActive: true,
      tags: JSON.stringify([
        "python",
        "project",
        "game",
        "loops",
        "conditions",
      ]),
      content: JSON.stringify({
        taskDescription:
          "Create a number guessing game where the computer picks a random number and the user tries to guess it.",
        requirements: [
          "Import the random module",
          "Generate a random number between 1 and 100",
          "Ask the user to guess the number",
          "Provide 'too high' or 'too low' feedback",
          "Count the number of attempts",
          "Congratulate when correct",
        ],
        starterCode: "import random\n\n# Your code here\n",
        solution: `import random

secret_number = random.randint(1, 100)
attempts = 0
guessed = False

print("Welcome to the Number Guessing Game!")
print("I'm thinking of a number between 1 and 100.")

while not guessed:
    try:
        guess = int(input("Enter your guess: "))
        attempts += 1
        
        if guess == secret_number:
            print(f"Congratulations! You guessed it in {attempts} attempts!")
            guessed = True
        elif guess < secret_number:
            print("Too low! Try again.")
        else:
            print("Too high! Try again.")
    except ValueError:
        print("Please enter a valid number!")

print("Thanks for playing!")`,
        testCases: [
          {
            description: "Game should handle correct guess",
            expectedOutput: "Congratulations",
          },
          {
            description: "Game should provide feedback for wrong guesses",
            expectedOutput: "Too high|Too low",
          },
        ],
      }),
      settings: JSON.stringify({
        enableConsole: true,
        allowInput: true,
        showTests: true,
        timeLimit: 600,
      }),
    },

    // 6. Python Fundamentals - Syntax Memory Game
    {
      title: "Python Syntax Memory Challenge",
      description:
        "Test your memory of Python syntax patterns, keywords, and their usage.",
      activityType: "memory_game",
      difficulty: 2,
      category: "Python Fundamentals",
      sortOrder: 6,
      isLocked: false,
      diamondReward: 18,
      experienceReward: 50,
      estimatedMinutes: 5,
      isActive: true,
      tags: JSON.stringify(["python", "memory", "syntax", "keywords"]),
      content: JSON.stringify({
        gameType: "pattern_matching",
        cards: [
          {
            id: "for_keyword",
            type: "keyword",
            value: "for",
            pair: "for_usage",
          },
          {
            id: "for_usage",
            type: "usage",
            value: "for i in range(10):",
            pair: "for_keyword",
          },
          { id: "if_keyword", type: "keyword", value: "if", pair: "if_usage" },
          {
            id: "if_usage",
            type: "usage",
            value: "if x > 0:",
            pair: "if_keyword",
          },
          {
            id: "def_keyword",
            type: "keyword",
            value: "def",
            pair: "def_usage",
          },
          {
            id: "def_usage",
            type: "usage",
            value: "def my_function():",
            pair: "def_keyword",
          },
          {
            id: "class_keyword",
            type: "keyword",
            value: "class",
            pair: "class_usage",
          },
          {
            id: "class_usage",
            type: "usage",
            value: "class MyClass:",
            pair: "class_keyword",
          },
        ],
        levels: [
          { level: 1, pairs: 3, timeLimit: 60 },
          { level: 2, pairs: 4, timeLimit: 80 },
          { level: 3, pairs: 4, timeLimit: 100 },
        ],
      }),
      settings: JSON.stringify({
        shuffleCards: true,
        showTimer: true,
        allowRetry: true,
      }),
    },

    // ===========================================
    // DATA STRUCTURES TOPIC (4 activities)
    // ===========================================

    // 7. Data Structures - Lists vs Tuples
    {
      title: "Python Lists vs Tuples",
      description:
        "Learn the differences between lists and tuples with hands-on examples.",
      activityType: "interactive_demo",
      difficulty: 2,
      category: "Data Structures",
      sortOrder: 1,
      isLocked: false,
      diamondReward: 20,
      experienceReward: 55,
      estimatedMinutes: 6,
      isActive: true,
      tags: JSON.stringify(["python", "lists", "tuples", "data-structures"]),
      content: JSON.stringify({
        slides: [
          {
            id: "lists_intro",
            title: "Lists - Mutable Collections",
            content:
              "Lists are ordered collections that can be modified after creation.",
            example:
              "fruits = ['apple', 'banana', 'orange']\nfruits.append('grape')\nfruits[0] = 'pear'",
            interactive: {
              type: "list_editor",
              initialList: ["apple", "banana", "orange"],
            },
          },
          {
            id: "tuples_intro",
            title: "Tuples - Immutable Collections",
            content:
              "Tuples are ordered collections that cannot be modified after creation.",
            example:
              "coordinates = (10, 20)\n# coordinates[0] = 15  # This would cause an error!",
            interactive: {
              type: "tuple_demo",
              examples: ["(1, 2, 3)", "('a', 'b', 'c')", "(10, 'hello', True)"],
            },
          },
        ],
      }),
      settings: JSON.stringify({
        autoProgress: false,
        showNavigation: true,
        enableInteraction: true,
      }),
    },

    // 8. Data Structures - Dictionary Operations
    {
      title: "Python Dictionary Mastery",
      description:
        "Master Python dictionaries with key-value pair operations and common patterns.",
      activityType: "fill_blanks",
      difficulty: 3,
      category: "Data Structures",
      sortOrder: 2,
      isLocked: false,
      diamondReward: 25,
      experienceReward: 65,
      estimatedMinutes: 5,
      isActive: true,
      tags: JSON.stringify([
        "python",
        "dictionaries",
        "key-value",
        "data-structures",
      ]),
      content: JSON.stringify({
        codeTemplate:
          "student = {'name': 'Alice', 'age': 20, 'grade': 'A'}\n\n# Access value\nprint(student[___])\n\n# Add new key-value pair\nstudent[___] = 'Computer Science'\n\n# Update existing value\nstudent[___] = 21\n\n# Get all keys\nkeys = student.___()\n\nprint(student)",
        blanks: [
          {
            id: "blank1",
            position: 1,
            answer: "'name'",
            options: ["'name'", "'age'", "'grade'", "name"],
            hint: "Which key would you use to get the student's name?",
          },
          {
            id: "blank2",
            position: 2,
            answer: "'major'",
            options: ["'major'", "'course'", "'subject'", "major"],
            hint: "What would be a good key name for the student's field of study?",
          },
          {
            id: "blank3",
            position: 3,
            answer: "'age'",
            options: ["'age'", "'name'", "'grade'", "age"],
            hint: "Which existing key should be updated?",
          },
          {
            id: "blank4",
            position: 4,
            answer: "keys",
            options: ["keys", "values", "items", "get"],
            hint: "Which method returns all the keys in a dictionary?",
          },
        ],
        expectedOutput:
          "Alice\n{'name': 'Alice', 'age': 21, 'grade': 'A', 'major': 'Computer Science'}",
      }),
      settings: JSON.stringify({
        showHints: true,
        caseSensitive: true,
        allowMultipleAttempts: true,
      }),
    },

    // 9. Data Structures - List Comprehensions
    {
      title: "Python List Comprehensions",
      description:
        "Learn to create powerful one-line list operations with comprehensions.",
      activityType: "interactive_coding",
      difficulty: 3,
      category: "Data Structures",
      sortOrder: 3,
      isLocked: false,
      diamondReward: 30,
      experienceReward: 75,
      estimatedMinutes: 8,
      isActive: true,
      tags: JSON.stringify([
        "python",
        "list-comprehensions",
        "advanced",
        "functional",
      ]),
      content: JSON.stringify({
        taskDescription:
          "Create various list comprehensions to transform and filter data efficiently.",
        requirements: [
          "Create a list of squares from 1 to 10",
          "Filter even numbers from a list",
          "Convert strings to uppercase",
          "Use conditional logic in comprehensions",
        ],
        starterCode:
          "# Task 1: Create squares of numbers 1-10\nsquares = [___]\n\n# Task 2: Filter even numbers\nnumbers = [1,2,3,4,5,6,7,8,9,10]\nevens = [___]\n\n# Task 3: Convert words to uppercase\nwords = ['hello', 'world', 'python']\nuppercase = [___]\n\nprint('Squares:', squares)\nprint('Evens:', evens)\nprint('Uppercase:', uppercase)",
        solution: `# Task 1: Create squares of numbers 1-10
squares = [x**2 for x in range(1, 11)]

# Task 2: Filter even numbers
numbers = [1,2,3,4,5,6,7,8,9,10]
evens = [x for x in numbers if x % 2 == 0]

# Task 3: Convert words to uppercase
words = ['hello', 'world', 'python']
uppercase = [word.upper() for word in words]

print('Squares:', squares)
print('Evens:', evens)
print('Uppercase:', uppercase)`,
        testCases: [
          {
            description: "Should create list of squares",
            expectedOutput: "[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]",
          },
          {
            description: "Should filter even numbers",
            expectedOutput: "[2, 4, 6, 8, 10]",
          },
        ],
      }),
      settings: JSON.stringify({
        enableConsole: true,
        allowInput: false,
        showTests: true,
        timeLimit: 480,
      }),
    },

    // 10. Data Structures - Data Analysis Project
    {
      title: "Student Performance Data Analysis",
      description:
        "Analyze real student performance data using Python data structures and operations.",
      activityType: "data_exploration",
      difficulty: 4,
      category: "Data Structures",
      sortOrder: 4,
      isLocked: false,
      diamondReward: 35,
      experienceReward: 95,
      estimatedMinutes: 8,
      isActive: true,
      tags: JSON.stringify([
        "python",
        "data-analysis",
        "real-world",
        "project",
      ]),
      content: JSON.stringify({
        dataset: {
          name: "Student Performance Data",
          description: "Academic performance data for high school students",
          columns: ["Name", "Math", "Science", "English", "Grade", "Age"],
          data: [
            ["Alice", 85, 92, 78, "A", 16],
            ["Bob", 76, 68, 82, "B", 17],
            ["Charlie", 92, 88, 95, "A", 16],
            ["Diana", 68, 75, 70, "C", 17],
            ["Eve", 88, 90, 85, "A", 16],
            ["Frank", 79, 82, 88, "B", 17],
            ["Grace", 95, 94, 92, "A", 16],
          ],
        },
        tasks: [
          {
            id: "basic_stats",
            title: "Calculate Basic Statistics",
            description: "Find the mean and median of Math scores",
            expectedAnswer: "Mean: 83.3, Median: 85",
          },
          {
            id: "filter_data",
            title: "Filter High Performers",
            description: "Find students with Math scores > 80",
            expectedAnswer: ["Alice", "Charlie", "Eve", "Grace"],
          },
          {
            id: "data_grouping",
            title: "Group by Grade",
            description:
              "Create a dictionary grouping students by their letter grade",
            expectedAnswer:
              "{'A': ['Alice', 'Charlie', 'Eve', 'Grace'], 'B': ['Bob', 'Frank'], 'C': ['Diana']}",
          },
        ],
      }),
      settings: JSON.stringify({
        allowPythonCode: true,
        showDataPreview: true,
        enableVisualization: true,
      }),
    },

    // ===========================================
    // ALGORITHMS TOPIC (3 activities)
    // ===========================================

    // 11. Algorithms - Bubble Sort Visualization
    {
      title: "Bubble Sort Algorithm Visualization",
      description:
        "Watch and understand how bubble sort algorithm works step by step with interactive visualization.",
      activityType: "algorithm_visualization",
      difficulty: 3,
      category: "Algorithms",
      sortOrder: 1,
      isLocked: false,
      diamondReward: 25,
      experienceReward: 75,
      estimatedMinutes: 5,
      isActive: true,
      tags: JSON.stringify([
        "sorting",
        "algorithm",
        "visualization",
        "complexity",
      ]),
      content: JSON.stringify({
        algorithmType: "bubble_sort",
        steps: [
          {
            step: 1,
            description: "Compare adjacent elements",
            code: "if arr[i] > arr[i+1]:",
            visualization: "highlight two adjacent elements",
          },
          {
            step: 2,
            description: "Swap if they're in wrong order",
            code: "arr[i], arr[i+1] = arr[i+1], arr[i]",
            visualization: "swap animation",
          },
          {
            step: 3,
            description: "Continue until array is sorted",
            code: "repeat until no swaps needed",
            visualization: "show final sorted array",
          },
        ],
        initialArray: [64, 34, 25, 12, 22, 11, 90],
        complexity: "O(n²)",
        explanation:
          "Bubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
      }),
      settings: JSON.stringify({
        showCode: true,
        showComplexity: true,
        allowSpeedControl: true,
        showComparisons: true,
      }),
    },

    // 12. Algorithms - Binary Search Implementation
    {
      title: "Implement Binary Search Algorithm",
      description:
        "Code a binary search algorithm to find elements efficiently in sorted arrays.",
      activityType: "interactive_coding",
      difficulty: 4,
      category: "Algorithms",
      sortOrder: 2,
      isLocked: false,
      diamondReward: 40,
      experienceReward: 100,
      estimatedMinutes: 12,
      isActive: true,
      tags: JSON.stringify([
        "binary-search",
        "algorithm",
        "searching",
        "divide-conquer",
      ]),
      content: JSON.stringify({
        taskDescription:
          "Implement a binary search algorithm that finds the index of a target value in a sorted array.",
        requirements: [
          "Function should take a sorted array and target value",
          "Return the index of the target if found, -1 if not found",
          "Use the divide-and-conquer approach",
          "Handle edge cases (empty array, target not in array)",
          "Implement iteratively, not recursively",
        ],
        starterCode: `def binary_search(arr, target):
    """
    Find the index of target in sorted array arr.
    Returns index if found, -1 if not found.
    """
    # Your implementation here
    pass

# Test cases
test_array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
print(binary_search(test_array, 7))   # Should return 3
print(binary_search(test_array, 15))  # Should return 7
print(binary_search(test_array, 2))   # Should return -1`,
        solution: `def binary_search(arr, target):
    """
    Find the index of target in sorted array arr.
    Returns index if found, -1 if not found.
    """
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Test cases
test_array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
print(binary_search(test_array, 7))   # Should return 3
print(binary_search(test_array, 15))  # Should return 7
print(binary_search(test_array, 2))   # Should return -1`,
        testCases: [
          {
            description: "Should find existing element",
            expectedOutput: "3",
          },
          {
            description: "Should return -1 for non-existing element",
            expectedOutput: "-1",
          },
        ],
      }),
      settings: JSON.stringify({
        enableConsole: true,
        allowInput: false,
        showTests: true,
        timeLimit: 720,
      }),
    },

    // 13. Algorithms - Complexity Analysis Quiz
    {
      title: "Algorithm Complexity & Big O Quiz",
      description:
        "Test your understanding of Big O notation, time complexity, and algorithm analysis.",
      activityType: "quiz",
      difficulty: 4,
      category: "Algorithms",
      sortOrder: 3,
      isLocked: false,
      diamondReward: 30,
      experienceReward: 80,
      estimatedMinutes: 8,
      isActive: true,
      tags: JSON.stringify(["algorithms", "big-o", "complexity", "analysis"]),
      content: JSON.stringify({
        questions: [
          {
            id: "q1",
            type: "multiple_choice",
            question:
              "What is the time complexity of binary search on a sorted array?",
            options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
            correctAnswer: 1,
            explanation:
              "Binary search has O(log n) time complexity because it eliminates half of the remaining elements in each step.",
          },
          {
            id: "q2",
            type: "multiple_choice",
            question:
              "Which sorting algorithm has the best average-case time complexity?",
            options: [
              "Bubble Sort - O(n²)",
              "Insertion Sort - O(n²)",
              "Merge Sort - O(n log n)",
              "Selection Sort - O(n²)",
            ],
            correctAnswer: 2,
            explanation:
              "Merge sort has O(n log n) average-case time complexity, which is optimal for comparison-based sorting algorithms.",
          },
          {
            id: "q3",
            type: "code_analysis",
            question:
              "What is the time complexity of this nested loop?\n\nfor i in range(n):\n    for j in range(n):\n        print(i, j)",
            options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
            correctAnswer: 3,
            explanation:
              "This is a nested loop where both loops run n times, resulting in n × n = O(n²) time complexity.",
          },
          {
            id: "q4",
            type: "multiple_choice",
            question:
              "Which data structure provides O(1) average-case insertion and deletion?",
            options: ["Array", "Linked List", "Hash Table", "Binary Tree"],
            correctAnswer: 2,
            explanation:
              "Hash tables provide O(1) average-case insertion, deletion, and lookup operations.",
          },
          {
            id: "q5",
            type: "multiple_choice",
            question: "What is the space complexity of merge sort?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 2,
            explanation:
              "Merge sort requires O(n) extra space to store the temporary arrays during the merge process.",
          },
        ],
        timeLimit: 480,
        passingScore: 75,
        showExplanations: true,
      }),
      settings: JSON.stringify({
        randomizeQuestions: true,
        randomizeOptions: true,
        allowReview: true,
        showProgress: true,
      }),
    },

    // ===========================================
    // FUNCTIONS & OOP TOPIC (3 activities)
    // ===========================================

    // 14. Functions & OOP - Function Builder
    {
      title: "Build Python Functions with Drag & Drop",
      description:
        "Construct Python functions by dragging and dropping code blocks in the correct order.",
      activityType: "drag_drop",
      difficulty: 2,
      category: "Functions & OOP",
      sortOrder: 1,
      isLocked: false,
      diamondReward: 20,
      experienceReward: 55,
      estimatedMinutes: 4,
      isActive: true,
      tags: JSON.stringify(["python", "functions", "drag-drop", "programming"]),
      content: JSON.stringify({
        targetFunction:
          "def calculate_average(numbers):\n    total = sum(numbers)\n    count = len(numbers)\n    if count > 0:\n        return total / count\n    else:\n        return 0",
        codeBlocks: [
          {
            id: "def",
            text: "def calculate_average(numbers):",
            type: "function_def",
            order: 1,
          },
          {
            id: "total",
            text: "    total = sum(numbers)",
            type: "calculation",
            order: 2,
          },
          {
            id: "count",
            text: "    count = len(numbers)",
            type: "calculation",
            order: 3,
          },
          { id: "if", text: "    if count > 0:", type: "condition", order: 4 },
          {
            id: "return1",
            text: "        return total / count",
            type: "return",
            order: 5,
          },
          { id: "else", text: "    else:", type: "condition", order: 6 },
          { id: "return2", text: "        return 0", type: "return", order: 7 },
        ],
        distractors: [
          {
            id: "wrong1",
            text: "    total = numbers.sum()",
            type: "calculation",
          },
          { id: "wrong2", text: "    return total * count", type: "return" },
          { id: "wrong3", text: "    if count == 0:", type: "condition" },
        ],
      }),
      settings: JSON.stringify({
        showHints: true,
        validateSyntax: true,
        allowReordering: true,
      }),
    },

    // 15. Functions & OOP - Grade Calculator Project
    {
      title: "Build a Modular Grade Calculator System",
      description:
        "Create a complete grade calculator system using multiple functions and proper modular design.",
      activityType: "code_builder",
      difficulty: 4,
      category: "Functions & OOP",
      sortOrder: 2,
      isLocked: false,
      diamondReward: 40,
      experienceReward: 105,
      estimatedMinutes: 12,
      isActive: true,
      tags: JSON.stringify(["python", "functions", "modules", "project"]),
      content: JSON.stringify({
        projectDescription:
          "Build a modular grade calculator system with multiple components working together.",
        components: [
          {
            id: "input_module",
            name: "Input Module",
            description: "Handle user input for student grades",
            template:
              "def get_student_grades():\n    # Get grades from user\n    pass",
            requirements: [
              "Function should ask for student name",
              "Function should collect multiple test scores",
              "Return a dictionary with student data",
              "Handle invalid input gracefully",
            ],
          },
          {
            id: "calculation_module",
            name: "Calculation Module",
            description: "Calculate average and letter grade",
            template:
              "def calculate_grade(scores):\n    # Calculate average and letter grade\n    pass",
            requirements: [
              "Calculate average of all scores",
              "Determine letter grade (A: 90+, B: 80-89, C: 70-79, D: 60-69, F: <60)",
              "Return both average and letter grade",
              "Handle empty score lists",
            ],
          },
          {
            id: "output_module",
            name: "Output Module",
            description: "Display results in a formatted way",
            template:
              "def display_results(student_data, average, letter_grade):\n    # Display formatted results\n    pass",
            requirements: [
              "Display student name clearly",
              "Show all individual scores",
              "Display calculated average with 2 decimal places",
              "Show final letter grade prominently",
            ],
          },
        ],
        integrationTests: [
          {
            description: "Program should handle single student",
            input: "Alice, scores: [85, 90, 78]",
            expectedOutput: "Average: 84.33, Grade: B",
          },
          {
            description: "Program should handle perfect scores",
            input: "Bob, scores: [100, 95, 98]",
            expectedOutput: "Average: 97.67, Grade: A",
          },
        ],
      }),
      settings: JSON.stringify({
        allowTesting: true,
        showStructure: true,
        enableDebugging: true,
      }),
    },

    // 16. Functions & OOP - Class Design Challenge
    {
      title: "Design a Student Management System with OOP",
      description:
        "Create classes and inheritance hierarchy for a comprehensive student management system.",
      activityType: "class_builder",
      difficulty: 5,
      category: "Functions & OOP",
      sortOrder: 3,
      isLocked: false,
      diamondReward: 50,
      experienceReward: 125,
      estimatedMinutes: 15,
      isActive: true,
      tags: JSON.stringify([
        "python",
        "oop",
        "classes",
        "inheritance",
        "design-patterns",
      ]),
      content: JSON.stringify({
        projectDescription:
          "Design an object-oriented student management system with proper inheritance and encapsulation.",
        classStructure: {
          baseClass: {
            name: "Person",
            description: "Base class for all people in the system",
            attributes: ["name", "age", "email"],
            methods: ["__init__", "get_info", "update_email"],
            abstractMethods: [],
          },
          derivedClasses: [
            {
              name: "Student",
              parent: "Person",
              description: "Represents a student with grades and courses",
              additionalAttributes: ["student_id", "grades", "courses", "gpa"],
              additionalMethods: [
                "add_grade",
                "calculate_gpa",
                "enroll_course",
                "get_transcript",
              ],
              requirements: [
                "Must inherit from Person",
                "Override get_info to include student-specific data",
                "Implement grade tracking functionality",
                "Calculate GPA automatically when grades are added",
              ],
            },
            {
              name: "Teacher",
              parent: "Person",
              description: "Represents a teacher with subjects and students",
              additionalAttributes: ["teacher_id", "subjects", "students"],
              additionalMethods: [
                "add_subject",
                "assign_grade",
                "get_student_list",
                "get_class_average",
              ],
              requirements: [
                "Must inherit from Person",
                "Override get_info to include teacher-specific data",
                "Implement student management functionality",
                "Track which students are in their classes",
              ],
            },
          ],
        },
        designPatterns: [
          {
            name: "Encapsulation",
            description: "Use private attributes with getter/setter methods",
          },
          {
            name: "Inheritance",
            description:
              "Proper parent-child relationships with method overriding",
          },
          {
            name: "Polymorphism",
            description:
              "Same method names behave differently in different classes",
          },
        ],
        testScenarios: [
          {
            description: "Create student and manage grades",
            code: "student = Student('Alice', 20, 'alice@email.com', 'S001')\nstudent.add_grade('Math', 85)\nstudent.add_grade('Science', 92)\nprint(f'GPA: {student.calculate_gpa()}')",
          },
          {
            description: "Create teacher and manage students",
            code: "teacher = Teacher('Dr. Smith', 45, 'smith@school.edu', 'T001')\nteacher.add_subject('Mathematics')\nteacher.assign_grade('S001', 'Math', 85)\nprint(teacher.get_student_list())",
          },
        ],
      }),
      settings: JSON.stringify({
        showUMLDiagram: true,
        validateDesign: true,
        enableTesting: true,
      }),
    },
  ];

  try {
    for (const activity of topicActivities) {
      await prisma.learningActivity.create({
        data: activity,
      });
      console.log(`✅ Created: ${activity.title} (${activity.category})`);
    }

    console.log(
      `\n🎉 Successfully created ${topicActivities.length} topic-based activities!`
    );
    console.log("\n📊 Topic Organization Summary:");
    console.log(
      "🐍 Python Fundamentals: 6 activities (Variables, Functions, Loops, Conditionals, Projects, Memory)"
    );
    console.log(
      "📊 Data Structures: 4 activities (Lists/Tuples, Dictionaries, Comprehensions, Analysis)"
    );
    console.log(
      "🧮 Algorithms: 3 activities (Bubble Sort, Binary Search, Complexity Quiz)"
    );
    console.log(
      "🏗️ Functions & OOP: 3 activities (Function Builder, Grade Calculator, Class Design)"
    );
    console.log(
      "\n🎯 All topics are now properly organized with multiple activities each!"
    );
  } catch (error) {
    console.error("❌ Error seeding topic-based activities:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedTopicBasedActivities()
  .then(() => {
    console.log("\n✅ Topic-based seeding completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Topic-based seeding failed:", error);
    process.exit(1);
  });
