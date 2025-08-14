import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// JSON validation function
function validateCodeArenaActivity(activity: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Required string fields
  const requiredStringFields = [
    "title",
    "slug",
    "description",
    "content",
    "category",
  ];
  for (const field of requiredStringFields) {
    if (!activity[field] || typeof activity[field] !== "string") {
      errors.push(`Missing or invalid ${field}`);
    }
  }

  // Required number fields
  const requiredNumberFields = [
    "difficulty",
    "order",
    "duration",
    "diamondReward",
    "experienceReward",
  ];
  for (const field of requiredNumberFields) {
    if (typeof activity[field] !== "number" || activity[field] < 0) {
      errors.push(`Missing or invalid ${field} (must be positive number)`);
    }
  }

  // Required boolean fields
  const requiredBooleanFields = ["hasCodeExercise", "isPublished"];
  for (const field of requiredBooleanFields) {
    if (typeof activity[field] !== "boolean") {
      errors.push(`Missing or invalid ${field} (must be boolean)`);
    }
  }

  // Validate testCases JSON
  if (activity.testCases) {
    try {
      const testCases = JSON.parse(activity.testCases);
      if (!Array.isArray(testCases)) {
        errors.push("testCases must be an array");
      } else {
        testCases.forEach((testCase, index) => {
          if (!testCase.input || !testCase.expected) {
            errors.push(`testCase ${index} missing input or expected fields`);
          }
        });
      }
    } catch (e) {
      errors.push("testCases contains invalid JSON");
    }
  }

  // Validate tags JSON
  if (activity.tags) {
    try {
      const tags = JSON.parse(activity.tags);
      if (!Array.isArray(tags)) {
        errors.push("tags must be an array");
      }
    } catch (e) {
      errors.push("tags contains invalid JSON");
    }
  }

  // Validate learningObjectives JSON
  if (activity.learningObjectives) {
    try {
      const objectives = JSON.parse(activity.learningObjectives);
      if (!Array.isArray(objectives)) {
        errors.push("learningObjectives must be an array");
      }
    } catch (e) {
      errors.push("learningObjectives contains invalid JSON");
    }
  }

  return { isValid: errors.length === 0, errors };
}

export async function seedPythonFundamentals() {
  console.log("🐍 Seeding Python Fundamentals Code Arena Activities...");

  // First, remove existing Python fundamentals activities to avoid conflicts
  try {
    await prisma.codeArena.deleteMany({
      where: {
        OR: [
          { category: "Python Fundamentals" },
          { tags: { contains: "Python Fundamentals" } },
          { tags: { contains: "python-fundamentals" } },
        ],
      },
    });
    console.log("🗑️ Cleared existing Python fundamentals activities");
  } catch (error) {
    console.log("⚠️ No existing Python fundamentals activities to clear");
  }

  const pythonFundamentalsActivities = [
    // QUIZ ACTIVITIES
    {
      title: "Python Data Types Quiz",
      slug: "python-data-types-quiz",
      description: "Test your knowledge of Python's fundamental data types",
      content: JSON.stringify({
        questions: [
          {
            question: "Which is the correct way to create a string in Python?",
            options: [
              '"Hello World"',
              "'Hello World'",
              "Both A and B",
              "<Hello World>",
            ],
            correct: 2,
            explanation:
              "Both single and double quotes create strings in Python.",
          },
          {
            question: "What data type is the result of 5/2 in Python 3?",
            options: ["int", "float", "string", "boolean"],
            correct: 1,
            explanation: "Division always returns a float in Python 3.",
          },
          {
            question: "Which of these is a mutable data type?",
            options: ["string", "tuple", "list", "int"],
            correct: 2,
            explanation:
              "Lists are mutable, meaning they can be changed after creation.",
          },
          {
            question: "How do you create an empty dictionary?",
            options: ["[]", "()", "{}", "dict()"],
            correct: 2,
            explanation: "Empty dictionaries are created with {} or dict().",
          },
          {
            question: "What type is returned by input() function?",
            options: ["int", "float", "string", "boolean"],
            correct: 2,
            explanation: "The input() function always returns a string.",
          },
        ],
        passingScore: 70,
        timeLimit: 480,
      }),
      difficulty: 1,
      order: 1,
      duration: 8,
      category: "Python Fundamentals",
      hasCodeExercise: false,
      starterCode: "",
      solutionCode: "",
      testCases: JSON.stringify([]),
      diamondReward: 25,
      experienceReward: 40,
      isPublished: true,
      tags: JSON.stringify(["quiz", "data-types", "beginner", "python"]),
      learningObjectives: JSON.stringify([
        "Identify different Python data types",
        "Understand string creation methods",
        "Know the result types of operations",
        "Distinguish between mutable and immutable types",
      ]),
    },

    // DRAG & DROP ACTIVITIES
    {
      title: "Python Variables Drag & Sort",
      slug: "python-variables-drag-sort",
      description:
        "Drag and categorize different Python variables by their data types",
      content: JSON.stringify({
        target: "Drag each Python value to its correct data type category",
        blocks: [
          { id: 1, code: "42", type: "integer" },
          { id: 2, code: "3.14", type: "float" },
          { id: 3, code: '"Hello"', type: "string" },
          { id: 4, code: "True", type: "boolean" },
          { id: 5, code: "[1, 2, 3]", type: "list" },
          { id: 6, code: "{'key': 'value'}", type: "dictionary" },
          { id: 7, code: "False", type: "boolean" },
          { id: 8, code: "'Python'", type: "string" },
        ],
        correctOrder: [1, 2, 3, 4, 5, 6, 7, 8],
        hints: [
          "Integers are whole numbers without decimal points",
          "Floats have decimal points like 3.14",
          "Strings are enclosed in quotes",
          "Booleans are True or False",
          "Lists use square brackets []",
          "Dictionaries use curly braces {} with key:value pairs",
        ],
      }),
      difficulty: 1,
      order: 2,
      duration: 6,
      category: "Python Fundamentals",
      activityType: "drag_drop",
      hasCodeExercise: false,
      starterCode: "",
      solutionCode: "",
      testCases: JSON.stringify([]),
      diamondReward: 20,
      experienceReward: 35,
      isPublished: true,
      tags: JSON.stringify([
        "drag-drop",
        "variables",
        "data-types",
        "beginner",
      ]),
      learningObjectives: JSON.stringify([
        "Classify Python values by data type",
        "Recognize different syntax patterns",
        "Understand type categories",
        "Practice visual learning",
      ]),
    },

    // MEMORY GAME ACTIVITIES
    {
      title: "String Methods Memory Challenge",
      slug: "string-methods-memory-challenge",
      description:
        "Memorize and recall Python string methods in this interactive challenge",
      content: JSON.stringify({
        cards: [
          { id: 1, text: ".upper()", description: "Convert to uppercase" },
          { id: 2, text: ".lower()", description: "Convert to lowercase" },
          { id: 3, text: ".strip()", description: "Remove whitespace" },
          { id: 4, text: ".replace()", description: "Replace text" },
          { id: 5, text: ".split()", description: "Split into list" },
          { id: 6, text: ".join()", description: "Join list elements" },
          { id: 7, text: ".find()", description: "Find substring" },
          { id: 8, text: ".startswith()", description: "Check prefix" },
        ],
        gridSize: 4,
        timeLimit: 300,
        showTime: 3,
      }),
      difficulty: 2,
      order: 3,
      duration: 10,
      category: "Python Fundamentals",
      activityType: "memory_game",
      hasCodeExercise: false,
      starterCode: "",
      solutionCode: "",
      testCases: JSON.stringify([]),
      diamondReward: 30,
      experienceReward: 50,
      isPublished: true,
      tags: JSON.stringify([
        "memory-game",
        "strings",
        "methods",
        "intermediate",
      ]),
      learningObjectives: JSON.stringify([
        "Memorize key string methods",
        "Understand method purposes",
        "Improve recall speed",
        "Practice active learning",
      ]),
    },

    // MATCHING ACTIVITIES
    {
      title: "Math Operators Matching Game",
      slug: "math-operators-matching-game",
      description:
        "Match Python mathematical operators with their correct descriptions",
      content: JSON.stringify({
        pairs: [
          { left: "+", right: "Addition operator", explanation: "5 + 3 = 8" },
          {
            left: "-",
            right: "Subtraction operator",
            explanation: "10 - 4 = 6",
          },
          {
            left: "*",
            right: "Multiplication operator",
            explanation: "3 * 4 = 12",
          },
          {
            left: "/",
            right: "Division operator",
            explanation: "15 / 4 = 3.75",
          },
          {
            left: "//",
            right: "Floor division operator",
            explanation: "15 // 4 = 3",
          },
          { left: "%", right: "Modulus operator", explanation: "15 % 4 = 3" },
          {
            left: "**",
            right: "Exponentiation operator",
            explanation: "2 ** 3 = 8",
          },
        ],
        instructions:
          "Match each Python mathematical operator with its correct description",
      }),
      difficulty: 1,
      order: 4,
      duration: 7,
      category: "Python Fundamentals",
      activityType: "matching",
      hasCodeExercise: false,
      starterCode: "",
      solutionCode: "",
      testCases: JSON.stringify([]),
      diamondReward: 25,
      experienceReward: 40,
      isPublished: true,
      tags: JSON.stringify([
        "matching",
        "math",
        "operators",
        "arithmetic",
        "beginner",
      ]),
      learningObjectives: JSON.stringify([
        "Learn all Python math operators",
        "Understand operator symbols",
        "Know result types",
        "Practice mental math",
      ]),
    },

    // FILL BLANKS ACTIVITIES
    {
      title: "Complete the Python List Code",
      slug: "complete-python-list-code",
      description: "Fill in the missing parts of Python list manipulation code",
      content: JSON.stringify({
        codeTemplate: `# Create an empty list
fruits = ___

# Add items to the list
fruits.___("apple")
fruits.___("banana")
fruits.___("orange")

# Insert at specific position
fruits.___(1, "grape")

# Remove an item
fruits.___("banana")

# Print the final list
___(fruits)`,
        blanks: [
          {
            id: 1,
            correctAnswer: "[]",
            position: 1,
            hint: "Use [] to create empty lists",
          },
          {
            id: 2,
            correctAnswer: "append",
            position: 2,
            hint: "Use .append() to add items",
          },
          {
            id: 3,
            correctAnswer: "append",
            position: 3,
            hint: "Use .append() to add items",
          },
          {
            id: 4,
            correctAnswer: "append",
            position: 4,
            hint: "Use .append() to add items",
          },
          {
            id: 5,
            correctAnswer: "insert",
            position: 5,
            hint: "Use .insert() for specific positions",
          },
          {
            id: 6,
            correctAnswer: "remove",
            position: 6,
            hint: "Use .remove() to delete items",
          },
          {
            id: 7,
            correctAnswer: "print",
            position: 7,
            hint: "Use print() to display output",
          },
        ],
        expectedOutput: "['apple', 'grape', 'orange']",
      }),
      difficulty: 2,
      order: 5,
      duration: 8,
      category: "Python Fundamentals",
      activityType: "fill_blanks",
      hasCodeExercise: false,
      starterCode: "",
      solutionCode: "",
      testCases: JSON.stringify([]),
      diamondReward: 30,
      experienceReward: 50,
      isPublished: true,
      tags: JSON.stringify(["fill-blanks", "lists", "methods", "intermediate"]),
      learningObjectives: JSON.stringify([
        "Complete Python list code",
        "Use list methods correctly",
        "Understand method syntax",
        "Practice code completion",
      ]),
    },

    // INTERACTIVE DEMO ACTIVITIES
    {
      title: "Python Conditionals Interactive Demo",
      slug: "python-conditionals-demo",
      description:
        "Explore Python conditional statements through interactive demonstrations",
      content: `# Python Conditionals Interactive Demo

Explore how Python conditional statements work through step-by-step interactive demonstrations.

## Demo Topics:

### 1. Basic if Statement
\`\`\`python
age = 18
if age >= 18:
    print("You can vote!")
\`\`\`

### 2. if-else Statement  
\`\`\`python
temperature = 25
if temperature > 30:
    print("It's hot!")
else:
    print("It's not too hot")
\`\`\`

### 3. if-elif-else Chain
\`\`\`python
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
\`\`\`

## Interactive Features:
- Step through each condition
- See how values are compared
- Watch the flow of execution
- Try different input values

Learn decision-making in Python!`,
      difficulty: 2,
      order: 6,
      duration: 12,
      category: "Python Fundamentals",
      hasCodeExercise: false,
      starterCode: "",
      solutionCode: "",
      testCases: JSON.stringify([]),
      diamondReward: 35,
      experienceReward: 60,
      isPublished: true,
      tags: JSON.stringify([
        "demo",
        "conditionals",
        "if-else",
        "interactive",
        "intermediate",
      ]),
      learningObjectives: JSON.stringify([
        "Understand conditional logic",
        "Learn if/elif/else syntax",
        "See execution flow",
        "Practice with examples",
      ]),
    },

    // CODE BUILDER ACTIVITIES
    {
      title: "Build Python Loop Code",
      slug: "build-python-loop-code",
      description:
        "Construct working Python loops by arranging code blocks correctly",
      content: JSON.stringify({
        target: "Build a working Python loop that prints numbers 1 to 5",
        blocks: [
          { id: 1, code: "# Print numbers 1 to 5", type: "comment" },
          { id: 2, code: "for i in range(1, 6):", type: "control" },
          { id: 3, code: '    print(f"Number: {i}")', type: "output" },
          { id: 4, code: 'print("Loop completed!")', type: "output" },
        ],
        correctOrder: [1, 2, 3, 4],
        hints: [
          "Comments usually come first",
          "for loops start with 'for' keyword",
          "Indented code runs inside the loop",
          "Unindented code runs after the loop",
        ],
        expectedOutput:
          "Number: 1\nNumber: 2\nNumber: 3\nNumber: 4\nNumber: 5\nLoop completed!",
      }),
      difficulty: 2,
      order: 7,
      duration: 10,
      category: "Python Fundamentals",
      activityType: "code_builder",
      hasCodeExercise: false,
      starterCode: "",
      solutionCode: "",
      testCases: JSON.stringify([]),
      diamondReward: 35,
      experienceReward: 55,
      isPublished: true,
      tags: JSON.stringify([
        "code-builder",
        "loops",
        "for",
        "range",
        "intermediate",
      ]),
      learningObjectives: JSON.stringify([
        "Build complete loop structures",
        "Understand code block order",
        "Practice proper indentation",
        "Learn range() usage",
      ]),
    },

    // INTERACTIVE CODING ACTIVITIES
    {
      title: "Python Functions Code Lab",
      slug: "python-functions-code-lab",
      description:
        "Write and test Python functions in this interactive coding environment",
      content: `# Python Functions Code Lab

Create and test Python functions in this interactive coding environment.

## Challenge: Create a Greeting Function

Write a function that takes a name and returns a personalized greeting.

### Requirements:
1. Function name: \`greet\`
2. Parameter: \`name\`
3. Return: A greeting message
4. Example: \`greet("Alice")\` should return \`"Hello, Alice!"\`

### Bonus Challenges:
- Add a default parameter for greeting type
- Handle empty names gracefully  
- Add input validation

### Test Cases:
Your function will be tested with:
- \`greet("Bob")\` → \`"Hello, Bob!"\`
- \`greet("Charlie")\` → \`"Hello, Charlie!"\`
- \`greet("")\` → Handle appropriately

Start coding and test your solution!`,
      difficulty: 3,
      order: 8,
      duration: 15,
      category: "Python Fundamentals",
      hasCodeExercise: true,
      starterCode: `# Create a greeting function
def greet(name):
    # Your code here
    pass

# Test your function
print(greet("Alice"))
print(greet("Bob"))`,
      solutionCode: `def greet(name):
    if not name:
        return "Hello, stranger!"
    return f"Hello, {name}!"

# Test the function
print(greet("Alice"))
print(greet("Bob"))
print(greet(""))`,
      testCases: JSON.stringify([
        { input: ["Alice"], expected: "Hello, Alice!" },
        { input: ["Bob"], expected: "Hello, Bob!" },
        { input: [""], expected: "Hello, stranger!" },
      ]),
      diamondReward: 40,
      experienceReward: 70,
      isPublished: true,
      tags: JSON.stringify([
        "code-lab",
        "functions",
        "interactive",
        "intermediate",
      ]),
      learningObjectives: JSON.stringify([
        "Write Python functions",
        "Use parameters and return values",
        "Handle edge cases",
        "Test function behavior",
      ]),
    },

    // DRAG DROP ACTIVITIES
    {
      title: "Dictionary Operations Drag & Drop",
      slug: "dictionary-operations-drag-drop",
      description:
        "Drag Python dictionary operations to their correct usage scenarios",
      content: `# Dictionary Operations Challenge

Drag each dictionary operation to its correct usage scenario.

## Operations Available:
- \`dict["key"]\` - Access value
- \`dict.get("key")\` - Safe access  
- \`dict["key"] = value\` - Set value
- \`del dict["key"]\` - Delete key
- \`dict.keys()\` - Get all keys
- \`dict.values()\` - Get all values
- \`dict.items()\` - Get key-value pairs
- \`"key" in dict\` - Check if key exists

## Scenarios:
Match operations with when to use them:

1. **Getting a value that might not exist**
2. **Adding a new key-value pair**
3. **Removing a key from dictionary**
4. **Checking if a key exists**
5. **Looping through all keys**
6. **Getting a value you know exists**
7. **Looping through key-value pairs**
8. **Getting all values only**

Master dictionaries for data storage!`,
      difficulty: 3,
      order: 9,
      duration: 12,
      category: "Python Fundamentals",
      hasCodeExercise: false,
      starterCode: "",
      solutionCode: "",
      testCases: JSON.stringify([]),
      diamondReward: 40,
      experienceReward: 65,
      isPublished: true,
      tags: JSON.stringify([
        "drag-drop",
        "dictionaries",
        "operations",
        "advanced",
      ]),
      learningObjectives: JSON.stringify([
        "Match operations to scenarios",
        "Understand dictionary methods",
        "Choose appropriate access patterns",
        "Practice problem-solving",
      ]),
    },

    // QUIZ ACTIVITIES
    {
      title: "Advanced Python Concepts Quiz",
      slug: "advanced-python-concepts-quiz",
      description:
        "Test your understanding of list comprehensions, lambda functions, and advanced concepts",
      content: `# Advanced Python Concepts Quiz

Test your knowledge of advanced Python features including list comprehensions, lambda functions, and more.

## Topics Covered:
- List comprehensions
- Lambda functions  
- Map, filter, reduce
- Generators
- Decorators
- Context managers

## Sample Questions:

### Question 1: List Comprehension
What does this list comprehension create?
\`[x**2 for x in range(5) if x % 2 == 0]\`

A) [0, 4, 16]
B) [0, 1, 4, 9, 16] 
C) [1, 4, 9, 16]
D) [0, 4]

**Answer: D** - Squares of even numbers: 0², 2² = [0, 4]

### Question 2: Lambda Function
What does this code return?
\`list(map(lambda x: x * 2, [1, 2, 3]))\`

A) [1, 2, 3]
B) [2, 4, 6]
C) [1, 4, 9]
D) Error

**Answer: B** - Lambda doubles each element: [2, 4, 6]

Challenge your advanced Python knowledge!`,
      difficulty: 4,
      order: 10,
      duration: 15,
      category: "Python Fundamentals",
      hasCodeExercise: false,
      starterCode: "",
      solutionCode: "",
      testCases: JSON.stringify([]),
      diamondReward: 50,
      experienceReward: 85,
      isPublished: true,
      tags: JSON.stringify([
        "quiz",
        "advanced",
        "comprehensions",
        "lambda",
        "expert",
      ]),
      learningObjectives: JSON.stringify([
        "Test advanced Python knowledge",
        "Understand list comprehensions",
        "Master lambda functions",
        "Practice complex concepts",
      ]),
    },

    // MATCHING ACTIVITIES
    {
      title: "File Operations Matching Challenge",
      slug: "file-operations-matching-challenge",
      description:
        "Match Python file operations with their purposes and syntax",
      content: `# Python File Operations Matching

Match file operations with their correct purposes and understand file handling in Python.

## File Operations:
Connect each operation with its purpose:

### Operations:
- \`open(file, 'r')\` - Read mode
- \`open(file, 'w')\` - Write mode  
- \`open(file, 'a')\` - Append mode
- \`file.read()\` - Read entire file
- \`file.readline()\` - Read one line
- \`file.readlines()\` - Read all lines
- \`file.write(text)\` - Write text
- \`file.close()\` - Close file
- \`with open() as f:\` - Context manager

### Purposes:
- **Open for reading existing content**
- **Open for writing (overwrites)**
- **Open for adding to end**
- **Read all content at once**
- **Read line by line**
- **Read into list of lines**
- **Write string to file**
- **Properly close file**
- **Auto-close when done**

Essential for file manipulation in Python!`,
      difficulty: 4,
      order: 11,
      duration: 12,
      category: "Python Fundamentals",
      hasCodeExercise: false,
      starterCode: "",
      solutionCode: "",
      testCases: JSON.stringify([]),
      diamondReward: 45,
      experienceReward: 75,
      isPublished: true,
      tags: JSON.stringify(["matching", "files", "io", "advanced"]),
      learningObjectives: JSON.stringify([
        "Match file operations to purposes",
        "Understand file modes",
        "Learn context managers",
        "Practice file handling",
      ]),
    },

    // MEMORY GAME ACTIVITIES
    {
      title: "Python Exception Memory Game",
      slug: "python-exception-memory-game",
      description:
        "Memorize different Python exception types and their usage scenarios",
      content: `# Python Exception Types Memory Game

Memorize Python exception types and when they occur. Essential for debugging and error handling.

## Exception Types to Remember:

### Common Exceptions:
- **ValueError** - Invalid value for operation
- **TypeError** - Wrong data type used
- **IndexError** - List index out of range
- **KeyError** - Dictionary key not found
- **FileNotFoundError** - File doesn't exist
- **ZeroDivisionError** - Division by zero
- **AttributeError** - Object has no attribute
- **ImportError** - Module import failed

### Example Scenarios:
- \`int("abc")\` → ValueError
- \`"hello" + 5\` → TypeError  
- \`[1,2,3][5]\` → IndexError
- \`{"a": 1}["b"]\` → KeyError
- \`open("missing.txt")\` → FileNotFoundError
- \`10 / 0\` → ZeroDivisionError

## Memory Challenge:
Study the exceptions, then recall them when scenarios are shown!

Master exceptions for better debugging!`,
      difficulty: 4,
      order: 12,
      duration: 12,
      category: "Python Fundamentals",
      hasCodeExercise: false,
      starterCode: "",
      solutionCode: "",
      testCases: JSON.stringify([]),
      diamondReward: 45,
      experienceReward: 80,
      isPublished: true,
      tags: JSON.stringify([
        "memory-game",
        "exceptions",
        "errors",
        "debugging",
        "advanced",
      ]),
      learningObjectives: JSON.stringify([
        "Memorize exception types",
        "Link exceptions to causes",
        "Improve debugging skills",
        "Practice error recognition",
      ]),
    },

    // CLASS BUILDER ACTIVITIES
    {
      title: "Build a Python Class",
      slug: "build-python-class",
      description:
        "Construct a complete Python class using our interactive class builder",
      content: `# Python Class Builder Challenge

Build a complete Python class step by step using our interactive class builder interface.

## Challenge: Create a Student Class

Design and build a Student class with the following specifications:

### Required Attributes:
- **name** (string) - Student's name
- **age** (integer) - Student's age  
- **grades** (list) - List of grades
- **student_id** (string) - Unique identifier

### Required Methods:
- **\__init__(name, age, student_id)** - Constructor
- **add_grade(grade)** - Add a grade to list
- **get_average()** - Calculate average grade
- **get_info()** - Return formatted student info
- **\__str__()** - String representation

### Example Usage:
\`\`\`python
student = Student("Alice", 20, "S001")
student.add_grade(85)
student.add_grade(92)
print(student.get_average())  # 88.5
print(student)  # Student: Alice (ID: S001)
\`\`\`

Build object-oriented solutions!`,
      difficulty: 4,
      order: 13,
      duration: 18,
      category: "Python Fundamentals",
      hasCodeExercise: false,
      starterCode: "",
      solutionCode: "",
      testCases: JSON.stringify([]),
      diamondReward: 60,
      experienceReward: 100,
      isPublished: true,
      tags: JSON.stringify([
        "class-builder",
        "oop",
        "classes",
        "methods",
        "advanced",
      ]),
      learningObjectives: JSON.stringify([
        "Design Python classes",
        "Implement methods and attributes",
        "Understand OOP principles",
        "Practice class construction",
      ]),
    },

    // DATA EXPLORATION ACTIVITIES
    {
      title: "Explore Python Data Processing",
      slug: "explore-python-data-processing",
      description:
        "Interactive exploration of Python's data processing capabilities with real datasets",
      content: `# Python Data Processing Explorer

Explore Python's powerful data processing capabilities through interactive analysis of real datasets.

## Dataset: Student Performance Data
Analyze student performance data using Python's built-in data processing tools.

### Dataset Structure:
\`\`\`python
students = [
    {"name": "Alice", "math": 95, "science": 87, "english": 92},
    {"name": "Bob", "math": 78, "science": 85, "english": 79},
    {"name": "Charlie", "math": 92, "science": 94, "english": 89},
    {"name": "Diana", "math": 88, "science": 90, "english": 94}
]
\`\`\`

## Exploration Tasks:

### 1. Basic Statistics
- Calculate average scores per subject
- Find highest and lowest performers
- Count students by performance level

### 2. Data Filtering
- Find students with math > 90
- Get top performers overall
- Filter by multiple criteria

### 3. Data Transformation
- Convert to different formats
- Create summary reports
- Generate insights

## Interactive Features:
- Step through each analysis
- See results immediately
- Try different approaches
- Export findings

Master data analysis with Python!`,
      difficulty: 5,
      order: 14,
      duration: 25,
      category: "Python Fundamentals",
      hasCodeExercise: false,
      starterCode: "",
      solutionCode: "",
      testCases: JSON.stringify([]),
      diamondReward: 70,
      experienceReward: 120,
      isPublished: true,
      tags: JSON.stringify([
        "data-exploration",
        "analysis",
        "processing",
        "datasets",
        "expert",
      ]),
      learningObjectives: JSON.stringify([
        "Explore data processing techniques",
        "Analyze real datasets",
        "Practice data manipulation",
        "Generate insights from data",
      ]),
    },

    // INTERACTIVE CODING (FINAL PROJECT)
    {
      title: "Python Calculator Project",
      slug: "python-calculator-project",
      description:
        "Build a complete calculator application using all Python fundamentals",
      content: `# Python Calculator Project

Build a complete calculator application that demonstrates all Python fundamentals you've learned.

## Project Requirements:

Create a calculator that can:

### Basic Operations:
- Addition, subtraction, multiplication, division
- Handle decimal numbers
- Show operation history

### Advanced Features:
- Error handling for invalid input
- Memory functions (store/recall)
- Scientific operations (optional)

### Code Structure:
- Use functions for each operation
- Implement a main menu loop
- Handle user input validation
- Store calculation history

## Starter Template:
\`\`\`python
class Calculator:
    def __init__(self):
        self.history = []
    
    def add(self, a, b):
        # Implement addition
        pass
    
    def subtract(self, a, b):
        # Implement subtraction  
        pass
    
    def multiply(self, a, b):
        # Implement multiplication
        pass
    
    def divide(self, a, b):
        # Implement division with error handling
        pass
    
    def show_menu(self):
        # Display menu options
        pass
    
    def run(self):
        # Main calculator loop
        pass

# Create and run calculator
calc = Calculator()
calc.run()
\`\`\`

## Bonus Challenges:
- Add unit converter
- Save/load history to file
- Create GUI interface
- Add mathematical functions

Build a professional calculator application!`,
      difficulty: 5,
      order: 15,
      duration: 30,
      category: "Python Fundamentals",
      activityType: "interactive_coding",
      hasCodeExercise: true,
      starterCode: `class Calculator:
    def __init__(self):
        self.history = []
    
    def add(self, a, b):
        # Implement addition
        pass
    
    def subtract(self, a, b):
        # Implement subtraction
        pass
    
    def multiply(self, a, b):
        # Implement multiplication
        pass
    
    def divide(self, a, b):
        # Implement division with error handling
        pass
    
    def show_menu(self):
        # Display menu options
        pass
    
    def run(self):
        # Main calculator loop
        pass

# Create and run calculator
calc = Calculator()
calc.run()`,
      solutionCode: `class Calculator:
    def __init__(self):
        self.history = []
    
    def add(self, a, b):
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result
    
    def subtract(self, a, b):
        result = a - b
        self.history.append(f"{a} - {b} = {result}")
        return result
    
    def multiply(self, a, b):
        result = a * b
        self.history.append(f"{a} * {b} = {result}")
        return result
    
    def divide(self, a, b):
        if b == 0:
            raise ValueError("Cannot divide by zero")
        result = a / b
        self.history.append(f"{a} / {b} = {result}")
        return result
    
    def show_menu(self):
        print("\\n--- Calculator ---")
        print("1. Add")
        print("2. Subtract")
        print("3. Multiply")
        print("4. Divide")
        print("5. Show History")
        print("6. Quit")
    
    def run(self):
        while True:
            self.show_menu()
            choice = input("Enter choice: ")
            
            if choice == '6':
                break
            elif choice == '5':
                print("\\nHistory:")
                for calc in self.history:
                    print(calc)
            elif choice in ['1', '2', '3', '4']:
                try:
                    a = float(input("Enter first number: "))
                    b = float(input("Enter second number: "))
                    
                    if choice == '1':
                        result = self.add(a, b)
                    elif choice == '2':
                        result = self.subtract(a, b)
                    elif choice == '3':
                        result = self.multiply(a, b)
                    elif choice == '4':
                        result = self.divide(a, b)
                    
                    print(f"Result: {result}")
                except ValueError as e:
                    print(f"Error: {e}")
            else:
                print("Invalid choice!")

# Create and run calculator
calc = Calculator()
calc.run()`,
      testCases: JSON.stringify([
        { input: [], expected: "Calculator runs successfully" },
      ]),
      diamondReward: 100,
      experienceReward: 200,
      isPublished: true,
      tags: JSON.stringify([
        "project",
        "calculator",
        "comprehensive",
        "expert",
        "final",
      ]),
      learningObjectives: JSON.stringify([
        "Apply all Python fundamentals",
        "Build complete applications",
        "Practice project development",
        "Create professional code",
      ]),
    },
  ];

  // Validate all activities before seeding
  console.log("🔍 Validating activity data...");
  const validationErrors = [];

  for (const activity of pythonFundamentalsActivities) {
    const validation = validateCodeArenaActivity(activity);
    if (!validation.isValid) {
      validationErrors.push(
        `${activity.title}: ${validation.errors.join(", ")}`
      );
    }
  }

  if (validationErrors.length > 0) {
    console.error("❌ Validation errors found:");
    validationErrors.forEach((error) => console.error(`  - ${error}`));
    throw new Error("Activity validation failed");
  }

  console.log("✅ All activities validated successfully");

  // Insert activities
  for (const activity of pythonFundamentalsActivities) {
    try {
      await prisma.codeArena.upsert({
        where: { slug: activity.slug },
        update: activity,
        create: activity,
      });
      console.log(`✅ Created Python Fundamentals activity: ${activity.title}`);
    } catch (error) {
      console.error(`❌ Failed to create activity: ${activity.title}`, error);
    }
  }

  console.log("🎉 Python Fundamentals activities seeded successfully!");
}
