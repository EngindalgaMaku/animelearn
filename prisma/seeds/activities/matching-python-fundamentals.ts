import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Matching Activities for Python Fundamentals
 * 10 interactive matching exercises pairing concepts, code, and outputs
 * Difficulty levels: 1-3 (Beginner to Intermediate)
 */

export const matchingPythonFundamentalsActivities = [
  // DIFFICULTY 1 - BEGINNER (4 activities)

  // 1. Basic Syntax Matching
  {
    title: "Python Syntax Elements Matching",
    description: "Match Python syntax elements with their purposes and uses",
    activityType: "matching",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 15,
    experienceReward: 35,
    estimatedMinutes: 12,
    tags: ["syntax", "basics", "elements", "beginner"],
    content: {
      instructions:
        "Match each Python syntax element with its correct purpose or description",
      pairs: [
        {
          id: "1",
          left: "# This is a comment",
          right: "Comment Syntax",
          explanation:
            "The # symbol is used to create single-line comments in Python",
        },
        {
          id: "2",
          left: "print('Hello World')",
          right: "Output Function",
          explanation: "print() function displays output to the console",
        },
        {
          id: "3",
          left: "variable_name = 42",
          right: "Variable Assignment",
          explanation: "The = operator assigns a value to a variable",
        },
        {
          id: "4",
          left: "if condition:",
          right: "Conditional Statement",
          explanation: "if statements execute code based on a condition",
        },
        {
          id: "5",
          left: "for item in list:",
          right: "Loop Structure",
          explanation: "for loops iterate over sequences or collections",
        },
        {
          id: "6",
          left: "def function_name():",
          right: "Function Definition",
          explanation: "def keyword defines a function in Python",
        },
        {
          id: "7",
          left: "import module_name",
          right: "Module Import",
          explanation:
            "import statement brings external modules into your program",
        },
        {
          id: "8",
          left: "try: except:",
          right: "Error Handling",
          explanation: "try-except blocks handle exceptions and errors",
        },
      ],
      allowShuffle: true,
      showProgress: true,
    },
    settings: {
      showExplanations: true,
      allowMultipleAttempts: true,
      timeLimit: 400,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2. Data Types and Values
  {
    title: "Python Data Types and Examples",
    description:
      "Match Python data types with their example values and characteristics",
    activityType: "matching",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 18,
    experienceReward: 40,
    estimatedMinutes: 15,
    tags: ["data-types", "values", "examples", "classification"],
    content: {
      instructions: "Match each data type with its corresponding example value",
      pairs: [
        {
          id: "1",
          left: "Integer (int)",
          right: "42",
          explanation: "Integers are whole numbers without decimal points",
        },
        {
          id: "2",
          left: "Float",
          right: "3.14159",
          explanation: "Floats are numbers with decimal points",
        },
        {
          id: "3",
          left: "String (str)",
          right: "'Hello, World!'",
          explanation: "Strings are sequences of characters enclosed in quotes",
        },
        {
          id: "4",
          left: "Boolean (bool)",
          right: "True",
          explanation: "Booleans represent True or False values",
        },
        {
          id: "5",
          left: "List",
          right: "[1, 2, 3, 4]",
          explanation:
            "Lists are ordered, mutable collections enclosed in square brackets",
        },
        {
          id: "6",
          left: "Dictionary (dict)",
          right: "{'key': 'value'}",
          explanation:
            "Dictionaries store key-value pairs enclosed in curly braces",
        },
        {
          id: "7",
          left: "Tuple",
          right: "(10, 20, 30)",
          explanation:
            "Tuples are ordered, immutable collections enclosed in parentheses",
        },
        {
          id: "8",
          left: "Set",
          right: "{1, 2, 3}",
          explanation: "Sets are unordered collections of unique elements",
        },
        {
          id: "9",
          left: "NoneType",
          right: "None",
          explanation: "None represents the absence of a value",
        },
      ],
      allowShuffle: true,
      showProgress: true,
    },
    settings: {
      showExplanations: true,
      allowMultipleAttempts: true,
      timeLimit: 500,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3. Operators and Results
  {
    title: "Python Operators and Their Results",
    description:
      "Match Python operators with their mathematical or logical results",
    activityType: "matching",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 20,
    experienceReward: 45,
    estimatedMinutes: 18,
    tags: ["operators", "arithmetic", "results", "calculations"],
    content: {
      instructions: "Match each Python expression with its correct result",
      pairs: [
        {
          id: "1",
          left: "10 + 5",
          right: "15",
          explanation: "Addition operator (+) adds two numbers together",
        },
        {
          id: "2",
          left: "20 - 8",
          right: "12",
          explanation:
            "Subtraction operator (-) subtracts the second number from the first",
        },
        {
          id: "3",
          left: "6 * 7",
          right: "42",
          explanation: "Multiplication operator (*) multiplies two numbers",
        },
        {
          id: "4",
          left: "15 / 3",
          right: "5.0",
          explanation:
            "Division operator (/) performs true division, always returning a float",
        },
        {
          id: "5",
          left: "17 // 5",
          right: "3",
          explanation:
            "Floor division operator (//) returns the integer part of division",
        },
        {
          id: "6",
          left: "17 % 5",
          right: "2",
          explanation: "Modulus operator (%) returns the remainder of division",
        },
        {
          id: "7",
          left: "2 ** 4",
          right: "16",
          explanation:
            "Exponentiation operator (**) raises first number to the power of second",
        },
        {
          id: "8",
          left: "10 > 5",
          right: "True",
          explanation:
            "Greater than operator (>) returns True when first value is larger",
        },
        {
          id: "9",
          left: "3 == 3",
          right: "True",
          explanation:
            "Equality operator (==) returns True when values are equal",
        },
        {
          id: "10",
          left: "not False",
          right: "True",
          explanation: "not operator reverses the boolean value",
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
    isActive: true,
    sortOrder: 3,
  },

  // 4. String Methods and Outputs
  {
    title: "Python String Methods and Their Effects",
    description: "Match string methods with their outputs and transformations",
    activityType: "matching",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 22,
    experienceReward: 50,
    estimatedMinutes: 20,
    tags: ["strings", "methods", "transformations", "text-processing"],
    content: {
      instructions: "Match each string method call with its correct output",
      pairs: [
        {
          id: "1",
          left: "'hello world'.upper()",
          right: "HELLO WORLD",
          explanation: "upper() converts all characters to uppercase",
        },
        {
          id: "2",
          left: "'PYTHON'.lower()",
          right: "python",
          explanation: "lower() converts all characters to lowercase",
        },
        {
          id: "3",
          left: "'python programming'.title()",
          right: "Python Programming",
          explanation: "title() capitalizes the first letter of each word",
        },
        {
          id: "4",
          left: "'hello world'.capitalize()",
          right: "Hello world",
          explanation:
            "capitalize() makes first character uppercase, rest lowercase",
        },
        {
          id: "5",
          left: "'  spaces  '.strip()",
          right: "spaces",
          explanation:
            "strip() removes whitespace from both ends of the string",
        },
        {
          id: "6",
          left: "'a,b,c,d'.split(',')",
          right: "['a', 'b', 'c', 'd']",
          explanation:
            "split() divides string into a list based on the separator",
        },
        {
          id: "7",
          left: "'-'.join(['a', 'b', 'c'])",
          right: "a-b-c",
          explanation:
            "join() combines list elements into a string with the separator",
        },
        {
          id: "8",
          left: "'hello world'.replace('world', 'Python')",
          right: "hello Python",
          explanation:
            "replace() substitutes all occurrences of one substring with another",
        },
        {
          id: "9",
          left: "'programming'.find('gram')",
          right: "3",
          explanation:
            "find() returns the index of the first occurrence of the substring",
        },
        {
          id: "10",
          left: "len('Python')",
          right: "6",
          explanation: "len() returns the number of characters in the string",
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
    isActive: true,
    sortOrder: 4,
  },

  // DIFFICULTY 2 - BASIC (3 activities)

  // 5. Control Flow Patterns
  {
    title: "Python Control Flow Patterns and Outputs",
    description:
      "Match control flow code patterns with their execution results",
    activityType: "matching",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 25,
    experienceReward: 55,
    estimatedMinutes: 22,
    tags: ["control-flow", "if-statements", "loops", "patterns"],
    content: {
      instructions:
        "Match each control flow pattern with its correct output or behavior",
      pairs: [
        {
          id: "1",
          left: "age = 20\nif age >= 18:\n    print('Adult')\nelse:\n    print('Minor')",
          right: "Adult",
          explanation:
            "Since age (20) is >= 18, the if condition is True and 'Adult' is printed",
        },
        {
          id: "2",
          left: "for i in range(3):\n    print(i)",
          right: "0\n1\n2",
          explanation:
            "range(3) generates 0, 1, 2, so the loop prints each number",
        },
        {
          id: "3",
          left: "count = 0\nwhile count < 2:\n    print(count)\n    count += 1",
          right: "0\n1",
          explanation:
            "While loop continues until count reaches 2, printing 0 and 1",
        },
        {
          id: "4",
          left: "for i in [1, 2, 3, 4]:\n    if i == 2:\n        continue\n    print(i)",
          right: "1\n3\n4",
          explanation:
            "continue skips the rest of the iteration when i equals 2",
        },
        {
          id: "5",
          left: "for i in [1, 2, 3, 4]:\n    if i == 3:\n        break\n    print(i)",
          right: "1\n2",
          explanation: "break exits the loop entirely when i equals 3",
        },
        {
          id: "6",
          left: "x = 15\nresult = 'High' if x > 10 else 'Low'",
          right: "High",
          explanation:
            "Ternary operator: since 15 > 10 is True, result is 'High'",
        },
        {
          id: "7",
          left: "score = 85\nif score >= 90:\n    grade = 'A'\nelif score >= 80:\n    grade = 'B'\nelse:\n    grade = 'C'",
          right: "B",
          explanation:
            "Score 85 doesn't meet >= 90, but meets >= 80, so grade is 'B'",
        },
        {
          id: "8",
          left: "numbers = [1, 2, 3, 4, 5]\neven_nums = [x for x in numbers if x % 2 == 0]",
          right: "[2, 4]",
          explanation:
            "List comprehension filters for even numbers (divisible by 2)",
        },
      ],
      allowShuffle: true,
      showProgress: true,
    },
    settings: {
      showExplanations: true,
      allowMultipleAttempts: true,
      timeLimit: 800,
    },
    isActive: true,
    sortOrder: 5,
  },

  // 6. Function Concepts
  {
    title: "Python Function Components and Behaviors",
    description:
      "Match function-related concepts with their definitions and examples",
    activityType: "matching",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 28,
    experienceReward: 60,
    estimatedMinutes: 25,
    tags: ["functions", "parameters", "return-values", "scope"],
    content: {
      instructions:
        "Match function concepts with their correct descriptions or examples",
      pairs: [
        {
          id: "1",
          left: "def greet(name):",
          right: "Function Definition",
          explanation:
            "def keyword starts a function definition with parameter(s)",
        },
        {
          id: "2",
          left: "return value",
          right: "Function Output",
          explanation: "return statement sends a value back to the caller",
        },
        {
          id: "3",
          left: "greet('Alice')",
          right: "Function Call",
          explanation: "Invoking a function with arguments to execute its code",
        },
        {
          id: "4",
          left: "def add(a, b=10):",
          right: "Default Parameter",
          explanation: "b=10 sets a default value for parameter b",
        },
        {
          id: "5",
          left: "def sum_all(*args):",
          right: "Variable Arguments",
          explanation:
            "*args allows function to accept any number of positional arguments",
        },
        {
          id: "6",
          left: "def create_user(**kwargs):",
          right: "Keyword Arguments",
          explanation:
            "**kwargs allows function to accept any number of keyword arguments",
        },
        {
          id: "7",
          left: "x = 10  # Global\ndef func():\n    x = 20  # Local",
          right: "Variable Scope",
          explanation:
            "Local variables inside functions don't affect global variables",
        },
        {
          id: "8",
          left: "lambda x: x * 2",
          right: "Anonymous Function",
          explanation:
            "lambda creates a small, unnamed function for simple operations",
        },
        {
          id: "9",
          left: "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n-1)",
          right: "Recursive Function",
          explanation: "Function that calls itself to solve a problem",
        },
      ],
      allowShuffle: true,
      showProgress: true,
    },
    settings: {
      showExplanations: true,
      allowMultipleAttempts: true,
      timeLimit: 900,
    },
    isActive: true,
    sortOrder: 6,
  },

  // 7. Data Structure Operations
  {
    title: "Python Data Structure Operations and Results",
    description:
      "Match data structure operations with their effects and outputs",
    activityType: "matching",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 28,
    tags: ["data-structures", "lists", "dictionaries", "operations"],
    content: {
      instructions:
        "Match each data structure operation with its result or effect",
      pairs: [
        {
          id: "1",
          left: "my_list = [1, 2, 3]\nmy_list.append(4)",
          right: "[1, 2, 3, 4]",
          explanation: "append() adds an element to the end of the list",
        },
        {
          id: "2",
          left: "numbers = [3, 1, 4, 2]\nnumbers.sort()",
          right: "[1, 2, 3, 4]",
          explanation: "sort() arranges list elements in ascending order",
        },
        {
          id: "3",
          left: "data = [1, 2, 3, 4, 5]\ndata.pop()",
          right: "5 (and list becomes [1, 2, 3, 4])",
          explanation: "pop() removes and returns the last element",
        },
        {
          id: "4",
          left: "my_dict = {'a': 1, 'b': 2}\nmy_dict['c'] = 3",
          right: "{'a': 1, 'b': 2, 'c': 3}",
          explanation:
            "Square bracket notation adds or updates dictionary entries",
        },
        {
          id: "5",
          left: "student = {'name': 'John', 'age': 20}\nstudent.get('grade', 'N/A')",
          right: "N/A",
          explanation: "get() returns default value when key doesn't exist",
        },
        {
          id: "6",
          left: "my_set = {1, 2, 3}\nmy_set.add(4)",
          right: "{1, 2, 3, 4}",
          explanation: "add() inserts a new element into the set",
        },
        {
          id: "7",
          left: "tuple1 = (1, 2)\ntuple2 = (3, 4)\ntuple1 + tuple2",
          right: "(1, 2, 3, 4)",
          explanation: "+ operator concatenates tuples to create a new tuple",
        },
        {
          id: "8",
          left: "matrix = [[1, 2], [3, 4]]\nmatrix[1][0]",
          right: "3",
          explanation:
            "Double indexing accesses nested list elements: row 1, column 0",
        },
        {
          id: "9",
          left: "words = ['apple', 'banana', 'cherry']\nlen(words)",
          right: "3",
          explanation: "len() returns the number of elements in the collection",
        },
      ],
      allowShuffle: true,
      showProgress: true,
    },
    settings: {
      showExplanations: true,
      allowMultipleAttempts: true,
      timeLimit: 1000,
    },
    isActive: true,
    sortOrder: 7,
  },

  // DIFFICULTY 3 - INTERMEDIATE (3 activities)

  // 8. Error Types and Causes
  {
    title: "Python Error Types and Their Causes",
    description: "Match Python errors with the code that would cause them",
    activityType: "matching",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 32,
    experienceReward: 70,
    estimatedMinutes: 30,
    tags: ["errors", "exceptions", "debugging", "error-handling"],
    content: {
      instructions: "Match each error type with the code that would cause it",
      pairs: [
        {
          id: "1",
          left: "SyntaxError",
          right: "print('Hello' # Missing closing parenthesis",
          explanation:
            "SyntaxError occurs when Python code doesn't follow proper syntax rules",
        },
        {
          id: "2",
          left: "NameError",
          right: "print(undefined_variable)",
          explanation:
            "NameError occurs when trying to use a variable that hasn't been defined",
        },
        {
          id: "3",
          left: "TypeError",
          right: "'hello' + 5",
          explanation:
            "TypeError occurs when operations are performed on incompatible data types",
        },
        {
          id: "4",
          left: "IndexError",
          right: "my_list = [1, 2, 3]; my_list[5]",
          explanation:
            "IndexError occurs when trying to access a list index that doesn't exist",
        },
        {
          id: "5",
          left: "KeyError",
          right: "my_dict = {'a': 1}; my_dict['b']",
          explanation:
            "KeyError occurs when trying to access a dictionary key that doesn't exist",
        },
        {
          id: "6",
          left: "ValueError",
          right: "int('hello')",
          explanation:
            "ValueError occurs when a function receives an argument of correct type but inappropriate value",
        },
        {
          id: "7",
          left: "ZeroDivisionError",
          right: "10 / 0",
          explanation:
            "ZeroDivisionError occurs when attempting division by zero",
        },
        {
          id: "8",
          left: "AttributeError",
          right: "my_string = 'hello'; my_string.nonexistent_method()",
          explanation:
            "AttributeError occurs when trying to access a method or attribute that doesn't exist",
        },
        {
          id: "9",
          left: "IndentationError",
          right: "if True:\nprint('No indentation')",
          explanation:
            "IndentationError occurs when code blocks aren't properly indented",
        },
      ],
      allowShuffle: true,
      showProgress: true,
    },
    settings: {
      showExplanations: true,
      allowMultipleAttempts: true,
      timeLimit: 1100,
    },
    isActive: true,
    sortOrder: 8,
  },

  // 9. Advanced Concepts
  {
    title: "Python Advanced Concepts and Examples",
    description:
      "Match advanced Python concepts with their code examples and use cases",
    activityType: "matching",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 35,
    experienceReward: 75,
    estimatedMinutes: 32,
    tags: ["advanced", "comprehensions", "generators", "decorators"],
    content: {
      instructions:
        "Match advanced Python concepts with their corresponding code examples",
      pairs: [
        {
          id: "1",
          left: "List Comprehension",
          right: "[x**2 for x in range(5)]",
          explanation:
            "Concise way to create lists using a single line of code",
        },
        {
          id: "2",
          left: "Dictionary Comprehension",
          right: "{x: x**2 for x in range(3)}",
          explanation: "Creates dictionaries using comprehension syntax",
        },
        {
          id: "3",
          left: "Generator Expression",
          right: "(x**2 for x in range(5))",
          explanation:
            "Memory-efficient iterator that generates values on demand",
        },
        {
          id: "4",
          left: "Lambda Function",
          right: "lambda x, y: x + y",
          explanation: "Anonymous function for simple operations",
        },
        {
          id: "5",
          left: "Decorator",
          right: "@functools.wraps(func)\ndef wrapper(*args, **kwargs):",
          explanation: "Function that modifies or enhances another function",
        },
        {
          id: "6",
          left: "Context Manager",
          right: "with open('file.txt') as f:",
          explanation: "Ensures proper resource management and cleanup",
        },
        {
          id: "7",
          left: "Multiple Assignment",
          right: "a, b, c = 1, 2, 3",
          explanation: "Assigns multiple variables in a single statement",
        },
        {
          id: "8",
          left: "Argument Unpacking",
          right: "print(*my_list)",
          explanation: "Spreads list elements as individual arguments",
        },
        {
          id: "9",
          left: "Keyword Unpacking",
          right: "func(**my_dict)",
          explanation: "Spreads dictionary items as keyword arguments",
        },
        {
          id: "10",
          left: "Enumerate Function",
          right: "for i, value in enumerate(my_list):",
          explanation: "Provides both index and value when iterating",
        },
      ],
      allowShuffle: true,
      showProgress: true,
    },
    settings: {
      showExplanations: true,
      allowMultipleAttempts: true,
      timeLimit: 1200,
    },
    isActive: true,
    sortOrder: 9,
  },

  // 10. Code Patterns and Best Practices
  {
    title: "Python Code Patterns and Best Practices",
    description:
      "Match code patterns with their purposes and best practice principles",
    activityType: "matching",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 38,
    experienceReward: 80,
    estimatedMinutes: 35,
    tags: ["best-practices", "patterns", "pythonic", "code-quality"],
    content: {
      instructions:
        "Match each code pattern with its purpose or the principle it demonstrates",
      pairs: [
        {
          id: "1",
          left: "if __name__ == '__main__':",
          right: "Script Entry Point",
          explanation:
            "Ensures code only runs when script is executed directly, not imported",
        },
        {
          id: "2",
          left: "try:\n    # risky code\nexcept SpecificError:\n    # handle error\nfinally:\n    # cleanup",
          right: "Proper Exception Handling",
          explanation:
            "Catches specific exceptions and ensures cleanup code always runs",
        },
        {
          id: "3",
          left: "def function(arg1, arg2, *, keyword_only):",
          right: "Keyword-Only Arguments",
          explanation:
            "Forces certain parameters to be passed as keywords for clarity",
        },
        {
          id: "4",
          left: "class MyClass:\n    def __init__(self, value):\n        self._private = value\n    \n    @property\n    def value(self):\n        return self._private",
          right: "Encapsulation with Properties",
          explanation:
            "Uses properties to control access to private attributes",
        },
        {
          id: "5",
          left: "result = [process(item) for item in items if condition(item)]",
          right: "Functional Programming Style",
          explanation:
            "Combines filtering and transformation in a single comprehension",
        },
        {
          id: "6",
          left: "from collections import defaultdict\ncounter = defaultdict(int)",
          right: "Default Dictionary Pattern",
          explanation: "Automatically creates default values for missing keys",
        },
        {
          id: "7",
          left: "def fibonacci():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b",
          right: "Generator Function",
          explanation:
            "Produces infinite sequence without storing all values in memory",
        },
        {
          id: "8",
          left: "data = {'name': 'John', 'age': 30}\nformatted = f\"Name: {data['name']}, Age: {data['age']}\"",
          right: "F-string Formatting",
          explanation:
            "Modern, readable way to format strings with embedded expressions",
        },
        {
          id: "9",
          left: "items = ['apple', 'banana', 'cherry']\nfor i, item in enumerate(items, 1):\n    print(f'{i}. {item}')",
          right: "Enumeration with Start Value",
          explanation: "Creates numbered lists starting from a specific number",
        },
        {
          id: "10",
          left: "config = {\n    'debug': True,\n    'database_url': 'localhost',\n    'max_connections': 100\n}",
          right: "Configuration Dictionary",
          explanation:
            "Centralizes application settings in a clear, accessible structure",
        },
      ],
      allowShuffle: true,
      showProgress: true,
    },
    settings: {
      showExplanations: true,
      allowMultipleAttempts: true,
      timeLimit: 1400,
    },
    isActive: true,
    sortOrder: 10,
  },
];

export async function seedMatchingPythonFundamentalsActivities() {
  console.log("🔗 Seeding Matching Python Fundamentals activities...");

  if (matchingPythonFundamentalsActivities.length === 0) {
    console.log("📝 No Matching Python Fundamentals activities to seed");
    return;
  }

  for (const activity of matchingPythonFundamentalsActivities) {
    await prisma.learningActivity.create({
      data: {
        title: activity.title,
        description: activity.description,
        activityType: activity.activityType,
        category: activity.category,
        difficulty: activity.difficulty,
        diamondReward: activity.diamondReward,
        experienceReward: activity.experienceReward,
        estimatedMinutes: activity.estimatedMinutes,
        content: JSON.stringify(activity.content),
        tags: JSON.stringify(activity.tags),
        isActive: activity.isActive,
        sortOrder: activity.sortOrder,
      },
    });
  }

  console.log(
    `✅ ${matchingPythonFundamentalsActivities.length} Matching Python Fundamentals activities seeded successfully`
  );
}

// Execute the seeding function if this file is run directly
if (require.main === module) {
  seedMatchingPythonFundamentalsActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Matching Python Fundamentals activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
