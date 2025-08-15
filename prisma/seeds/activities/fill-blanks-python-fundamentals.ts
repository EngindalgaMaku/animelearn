import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Fill Blanks Activities for Python Fundamentals
 * 10 interactive fill-in-the-blank coding exercises
 * Difficulty levels: 1-3 (Beginner to Intermediate)
 */

export const fillBlanksPythonFundamentalsActivities = [
  // DIFFICULTY 1 - BEGINNER (4 activities)

  // 1. Basic Print Statements
  {
    title: "Python Print Statements Practice",
    description:
      "Learn to use print statements with different formats and outputs",
    activityType: "fill_blanks",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 15,
    experienceReward: 35,
    estimatedMinutes: 12,
    tags: ["print", "output", "formatting", "beginner"],
    content: {
      instructions: "Fill in the missing code to complete the print statements",
      exercises: [
        {
          id: 1,
          description: "Print a simple greeting message",
          template: "____('Hello, World!')",
          blanks: [{ id: "blank1", answer: "print", position: 0 }],
          expectedOutput: "Hello, World!",
        },
        {
          id: 2,
          description: "Print multiple values separated by spaces",
          template: "print('Name:', ____, 'Age:', ____)",
          blanks: [
            { id: "blank2", answer: "'Alice'", position: 0 },
            { id: "blank3", answer: "25", position: 1 },
          ],
          expectedOutput: "Name: Alice Age: 25",
        },
        {
          id: 3,
          description: "Print with custom separator",
          template: "print('A', 'B', 'C', ____='-')",
          blanks: [{ id: "blank4", answer: "sep", position: 0 }],
          expectedOutput: "A-B-C",
        },
        {
          id: 4,
          description: "Print without newline at the end",
          template: "print('Result:', ____='')\nprint('Done')",
          blanks: [{ id: "blank5", answer: "end", position: 0 }],
          expectedOutput: "Result:Done",
        },
      ],
    },
    settings: {
      timeLimit: 400,
      allowHints: true,
      caseSensitive: false,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2. Variables and Assignment
  {
    title: "Python Variables and Assignment Workshop",
    description: "Master variable creation, assignment, and basic operations",
    activityType: "fill_blanks",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 18,
    experienceReward: 40,
    estimatedMinutes: 15,
    tags: ["variables", "assignment", "data-types", "operations"],
    content: {
      instructions: "Complete the variable assignments and operations",
      exercises: [
        {
          id: 1,
          description: "Create and assign variables",
          template: "____ = 25\n____ = 'Python'\n____ = True",
          blanks: [
            { id: "blank1", answer: "age", position: 0 },
            { id: "blank2", answer: "language", position: 1 },
            { id: "blank3", answer: "is_programming", position: 2 },
          ],
          expectedOutput: "Variables created successfully",
        },
        {
          id: 2,
          description: "Perform arithmetic operations",
          template:
            "x = 10\ny = 5\nsum_result = x ____ y\nproduct = x ____ y\nprint(sum_result, product)",
          blanks: [
            { id: "blank4", answer: "+", position: 0 },
            { id: "blank5", answer: "*", position: 1 },
          ],
          expectedOutput: "15 50",
        },
        {
          id: 3,
          description: "String concatenation",
          template:
            "first_name = 'John'\nlast_name = 'Doe'\nfull_name = first_name ____ ' ' ____ last_name\nprint(full_name)",
          blanks: [
            { id: "blank6", answer: "+", position: 0 },
            { id: "blank7", answer: "+", position: 1 },
          ],
          expectedOutput: "John Doe",
        },
        {
          id: 4,
          description: "Multiple assignment",
          template: "a, b, c = ____, ____, ____\nprint(f'a={a}, b={b}, c={c}')",
          blanks: [
            { id: "blank8", answer: "1", position: 0 },
            { id: "blank9", answer: "2", position: 1 },
            { id: "blank10", answer: "3", position: 2 },
          ],
          expectedOutput: "a=1, b=2, c=3",
        },
      ],
    },
    settings: {
      timeLimit: 500,
      allowHints: true,
      caseSensitive: false,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3. Input and Type Conversion
  {
    title: "Python Input and Type Conversion Practice",
    description: "Learn to handle user input and convert between data types",
    activityType: "fill_blanks",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 20,
    experienceReward: 45,
    estimatedMinutes: 18,
    tags: ["input", "type-conversion", "casting", "user-interaction"],
    content: {
      instructions: "Complete the input handling and type conversion code",
      exercises: [
        {
          id: 1,
          description: "Get user input and display it",
          template: "name = ____('Enter your name: ')\nprint('Hello,', ____)",
          blanks: [
            { id: "blank1", answer: "input", position: 0 },
            { id: "blank2", answer: "name", position: 1 },
          ],
          expectedOutput: "Hello, [user_name]",
        },
        {
          id: 2,
          description: "Convert string input to integer",
          template:
            "age_str = input('Enter your age: ')\nage = ____(age_str)\nnext_year_age = age + ____\nprint(f'Next year you will be {next_year_age}')",
          blanks: [
            { id: "blank3", answer: "int", position: 0 },
            { id: "blank4", answer: "1", position: 1 },
          ],
          expectedOutput: "Next year you will be [age+1]",
        },
        {
          id: 3,
          description: "Convert between different types",
          template:
            "num = 42\nnum_str = ____(num)\npi = 3.14\npi_int = ____(pi)\nprint(num_str, pi_int)",
          blanks: [
            { id: "blank5", answer: "str", position: 0 },
            { id: "blank6", answer: "int", position: 1 },
          ],
          expectedOutput: "42 3",
        },
        {
          id: 4,
          description: "Boolean conversion",
          template:
            "value1 = ____(1)\nvalue2 = ____(0)\nvalue3 = ____('')\nprint(value1, value2, value3)",
          blanks: [
            { id: "blank7", answer: "bool", position: 0 },
            { id: "blank8", answer: "bool", position: 1 },
            { id: "blank9", answer: "bool", position: 2 },
          ],
          expectedOutput: "True False False",
        },
      ],
    },
    settings: {
      timeLimit: 600,
      allowHints: true,
      caseSensitive: false,
    },
    isActive: true,
    sortOrder: 3,
  },

  // 4. String Operations
  {
    title: "Python String Methods and Formatting",
    description:
      "Practice string manipulation methods and formatting techniques",
    activityType: "fill_blanks",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 22,
    experienceReward: 50,
    estimatedMinutes: 20,
    tags: ["strings", "methods", "formatting", "text-processing"],
    content: {
      instructions: "Complete the string operations and formatting code",
      exercises: [
        {
          id: 1,
          description: "String case conversion",
          template:
            "text = 'Hello World'\nuppercase = text.______()\nlowercase = text.______()\nprint(uppercase, lowercase)",
          blanks: [
            { id: "blank1", answer: "upper", position: 0 },
            { id: "blank2", answer: "lower", position: 1 },
          ],
          expectedOutput: "HELLO WORLD hello world",
        },
        {
          id: 2,
          description: "String cleaning and splitting",
          template:
            "messy_text = '  Python Programming  '\nclean = messy_text.______()\nwords = clean.______(' ')\nprint(words)",
          blanks: [
            { id: "blank3", answer: "strip", position: 0 },
            { id: "blank4", answer: "split", position: 1 },
          ],
          expectedOutput: "['Python', 'Programming']",
        },
        {
          id: 3,
          description: "String replacement and joining",
          template:
            "sentence = 'I love Java programming'\nnew_sentence = sentence.______('Java', 'Python')\nwords = ['Hello', 'World']\njoined = '-'.______(words)\nprint(new_sentence)\nprint(joined)",
          blanks: [
            { id: "blank5", answer: "replace", position: 0 },
            { id: "blank6", answer: "join", position: 1 },
          ],
          expectedOutput: "I love Python programming\nHello-World",
        },
        {
          id: 4,
          description: "F-string formatting",
          template:
            "name = 'Alice'\nage = 30\ncity = 'New York'\ninfo = f'My name is {____}, I am {____} years old and live in {____}'\nprint(info)",
          blanks: [
            { id: "blank7", answer: "name", position: 0 },
            { id: "blank8", answer: "age", position: 1 },
            { id: "blank9", answer: "city", position: 2 },
          ],
          expectedOutput:
            "My name is Alice, I am 30 years old and live in New York",
        },
      ],
    },
    settings: {
      timeLimit: 700,
      allowHints: true,
      caseSensitive: false,
    },
    isActive: true,
    sortOrder: 4,
  },

  // DIFFICULTY 2 - BASIC (3 activities)

  // 5. Conditional Statements
  {
    title: "Python Conditional Logic Workshop",
    description: "Master if-elif-else statements and conditional expressions",
    activityType: "fill_blanks",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 25,
    experienceReward: 55,
    estimatedMinutes: 22,
    tags: ["conditionals", "if-statements", "logic", "decision-making"],
    content: {
      instructions: "Complete the conditional statements and logic",
      exercises: [
        {
          id: 1,
          description: "Basic if-else statement",
          template:
            "age = 20\n____ age >= 18:\n    print('Adult')\n____:\n    print('Minor')",
          blanks: [
            { id: "blank1", answer: "if", position: 0 },
            { id: "blank2", answer: "else", position: 1 },
          ],
          expectedOutput: "Adult",
        },
        {
          id: 2,
          description: "Multiple conditions with elif",
          template:
            "score = 85\nif score >= 90:\n    grade = 'A'\n____ score >= 80:\n    grade = 'B'\n____ score >= 70:\n    grade = 'C'\nelse:\n    grade = 'F'\nprint(f'Grade: {grade}')",
          blanks: [
            { id: "blank3", answer: "elif", position: 0 },
            { id: "blank4", answer: "elif", position: 1 },
          ],
          expectedOutput: "Grade: B",
        },
        {
          id: 3,
          description: "Logical operators",
          template:
            "x = 15\ny = 25\nif x > 10 ____ y < 30:\n    print('Both conditions true')\nif x > 20 ____ y > 20:\n    print('At least one condition true')\nif ____ (x > 30):\n    print('x is not greater than 30')",
          blanks: [
            { id: "blank5", answer: "and", position: 0 },
            { id: "blank6", answer: "or", position: 1 },
            { id: "blank7", answer: "not", position: 2 },
          ],
          expectedOutput:
            "Both conditions true\nAt least one condition true\nx is not greater than 30",
        },
        {
          id: 4,
          description: "Ternary operator (conditional expression)",
          template:
            "number = 7\nresult = 'Even' ____ number % 2 == 0 ____ 'Odd'\nprint(f'{number} is {result}')",
          blanks: [
            { id: "blank8", answer: "if", position: 0 },
            { id: "blank9", answer: "else", position: 1 },
          ],
          expectedOutput: "7 is Odd",
        },
      ],
    },
    settings: {
      timeLimit: 800,
      allowHints: true,
      caseSensitive: false,
    },
    isActive: true,
    sortOrder: 5,
  },

  // 6. Loops and Iteration
  {
    title: "Python Loops and Iteration Practice",
    description: "Learn for loops, while loops, and iteration control",
    activityType: "fill_blanks",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 28,
    experienceReward: 60,
    estimatedMinutes: 25,
    tags: ["loops", "iteration", "for-loops", "while-loops", "control"],
    content: {
      instructions: "Complete the loop structures and iteration code",
      exercises: [
        {
          id: 1,
          description: "Basic for loop with range",
          template: "____ i in ______(5):\n    print(f'Number: {i}')",
          blanks: [
            { id: "blank1", answer: "for", position: 0 },
            { id: "blank2", answer: "range", position: 1 },
          ],
          expectedOutput:
            "Number: 0\nNumber: 1\nNumber: 2\nNumber: 3\nNumber: 4",
        },
        {
          id: 2,
          description: "For loop with list iteration",
          template:
            "fruits = ['apple', 'banana', 'orange']\n____ fruit ____ fruits:\n    print(f'I like {fruit}')",
          blanks: [
            { id: "blank3", answer: "for", position: 0 },
            { id: "blank4", answer: "in", position: 1 },
          ],
          expectedOutput: "I like apple\nI like banana\nI like orange",
        },
        {
          id: 3,
          description: "While loop with counter",
          template:
            "count = 0\n____ count < 3:\n    print(f'Count is {count}')\n    count ____ 1",
          blanks: [
            { id: "blank5", answer: "while", position: 0 },
            { id: "blank6", answer: "+=", position: 1 },
          ],
          expectedOutput: "Count is 0\nCount is 1\nCount is 2",
        },
        {
          id: 4,
          description: "Loop control with break and continue",
          template:
            "for i in range(10):\n    if i == 3:\n        ______\n    if i == 7:\n        ______\n    print(i)",
          blanks: [
            { id: "blank7", answer: "continue", position: 0 },
            { id: "blank8", answer: "break", position: 1 },
          ],
          expectedOutput: "0\n1\n2\n4\n5\n6",
        },
      ],
    },
    settings: {
      timeLimit: 900,
      allowHints: true,
      caseSensitive: false,
    },
    isActive: true,
    sortOrder: 6,
  },

  // 7. Lists and Basic Operations
  {
    title: "Python Lists and Operations Workshop",
    description: "Practice list creation, modification, and common operations",
    activityType: "fill_blanks",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 28,
    tags: ["lists", "data-structures", "methods", "operations"],
    content: {
      instructions: "Complete the list operations and method calls",
      exercises: [
        {
          id: 1,
          description: "List creation and access",
          template:
            "numbers = [1, 2, 3, 4, 5]\nfirst = numbers[____]\nlast = numbers[____]\nprint(f'First: {first}, Last: {last}')",
          blanks: [
            { id: "blank1", answer: "0", position: 0 },
            { id: "blank2", answer: "-1", position: 1 },
          ],
          expectedOutput: "First: 1, Last: 5",
        },
        {
          id: 2,
          description: "Adding and removing elements",
          template:
            "my_list = [1, 2, 3]\nmy_list.______(4)\nmy_list.______(0, 0)\nremoved = my_list.______()\nprint(my_list)\nprint(f'Removed: {removed}')",
          blanks: [
            { id: "blank3", answer: "append", position: 0 },
            { id: "blank4", answer: "insert", position: 1 },
            { id: "blank5", answer: "pop", position: 2 },
          ],
          expectedOutput: "[0, 1, 2, 3]\nRemoved: 3",
        },
        {
          id: 3,
          description: "List methods and properties",
          template:
            "data = [3, 1, 4, 1, 5, 9, 2, 6]\ndata.______()\nprint(f'Sorted: {data}')\nprint(f'Length: {______(data)}')\nprint(f'Count of 1: {data.______(1)}')",
          blanks: [
            { id: "blank6", answer: "sort", position: 0 },
            { id: "blank7", answer: "len", position: 1 },
            { id: "blank8", answer: "count", position: 2 },
          ],
          expectedOutput:
            "Sorted: [1, 1, 2, 3, 4, 5, 6, 9]\nLength: 8\nCount of 1: 2",
        },
        {
          id: 4,
          description: "List slicing",
          template:
            "numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]\nfirst_five = numbers[____:____]\nlast_three = numbers[____:]\nevery_second = numbers[____:____:____]\nprint(f'First five: {first_five}')\nprint(f'Last three: {last_three}')\nprint(f'Every second: {every_second}')",
          blanks: [
            { id: "blank9", answer: "0", position: 0 },
            { id: "blank10", answer: "5", position: 1 },
            { id: "blank11", answer: "-3", position: 2 },
            { id: "blank12", answer: "0", position: 3 },
            { id: "blank13", answer: "10", position: 4 },
            { id: "blank14", answer: "2", position: 5 },
          ],
          expectedOutput:
            "First five: [0, 1, 2, 3, 4]\nLast three: [7, 8, 9]\nEvery second: [0, 2, 4, 6, 8]",
        },
      ],
    },
    settings: {
      timeLimit: 1000,
      allowHints: true,
      caseSensitive: false,
    },
    isActive: true,
    sortOrder: 7,
  },

  // DIFFICULTY 3 - INTERMEDIATE (3 activities)

  // 8. Functions and Parameters
  {
    title: "Python Functions and Parameters Workshop",
    description: "Master function definition, parameters, and return values",
    activityType: "fill_blanks",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 32,
    experienceReward: 70,
    estimatedMinutes: 30,
    tags: ["functions", "parameters", "return-values", "scope"],
    content: {
      instructions: "Complete the function definitions and calls",
      exercises: [
        {
          id: 1,
          description: "Basic function definition and call",
          template:
            "____ greet(name):\n    ____ f'Hello, {name}!'\n\nresult = ____('Alice')\nprint(result)",
          blanks: [
            { id: "blank1", answer: "def", position: 0 },
            { id: "blank2", answer: "return", position: 1 },
            { id: "blank3", answer: "greet", position: 2 },
          ],
          expectedOutput: "Hello, Alice!",
        },
        {
          id: 2,
          description: "Function with default parameters",
          template:
            "def power(base, ____=2):\n    return base ____ exponent\n\nresult1 = power(5)\nresult2 = power(3, 3)\nprint(f'5^2 = {result1}, 3^3 = {result2}')",
          blanks: [
            { id: "blank4", answer: "exponent", position: 0 },
            { id: "blank5", answer: "**", position: 1 },
          ],
          expectedOutput: "5^2 = 25, 3^3 = 27",
        },
        {
          id: 3,
          description: "Function with variable arguments",
          template:
            "def calculate_sum(____args):\n    total = 0\n    ____ num ____ args:\n        total += num\n    return total\n\nresult = calculate_sum(1, 2, 3, 4, 5)\nprint(f'Sum: {result}')",
          blanks: [
            { id: "blank6", answer: "*", position: 0 },
            { id: "blank7", answer: "for", position: 1 },
            { id: "blank8", answer: "in", position: 2 },
          ],
          expectedOutput: "Sum: 15",
        },
        {
          id: 4,
          description: "Function with keyword arguments",
          template:
            "def create_profile(____kwargs):\n    profile = {}\n    ____ key, value ____ kwargs.items():\n        profile[key] = value\n    return profile\n\nuser = create_profile(name='John', age=30, city='NYC')\nprint(user)",
          blanks: [
            { id: "blank9", answer: "**", position: 0 },
            { id: "blank10", answer: "for", position: 1 },
            { id: "blank11", answer: "in", position: 2 },
          ],
          expectedOutput: "{'name': 'John', 'age': 30, 'city': 'NYC'}",
        },
      ],
    },
    settings: {
      timeLimit: 1200,
      allowHints: true,
      caseSensitive: false,
    },
    isActive: true,
    sortOrder: 8,
  },

  // 9. Dictionaries and Data Manipulation
  {
    title: "Python Dictionaries and Data Handling",
    description:
      "Advanced dictionary operations and data manipulation techniques",
    activityType: "fill_blanks",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 35,
    experienceReward: 75,
    estimatedMinutes: 32,
    tags: ["dictionaries", "key-value", "data-manipulation", "methods"],
    content: {
      instructions: "Complete the dictionary operations and data handling code",
      exercises: [
        {
          id: 1,
          description: "Dictionary creation and access",
          template:
            "student = {\n    'name': 'Alice',\n    'age': 20,\n    'grades': [85, 92, 78]\n}\nname = student[____]\nage = student.____('age')\nprint(f'{name} is {age} years old')",
          blanks: [
            { id: "blank1", answer: "'name'", position: 0 },
            { id: "blank2", answer: "get", position: 1 },
          ],
          expectedOutput: "Alice is 20 years old",
        },
        {
          id: 2,
          description: "Dictionary methods and iteration",
          template:
            "data = {'a': 1, 'b': 2, 'c': 3}\nkeys = list(data.______())\nvalues = list(data.______())\nitems = list(data.______())\nprint(f'Keys: {keys}')\nprint(f'Values: {values}')\nprint(f'Items: {items}')",
          blanks: [
            { id: "blank3", answer: "keys", position: 0 },
            { id: "blank4", answer: "values", position: 1 },
            { id: "blank5", answer: "items", position: 2 },
          ],
          expectedOutput:
            "Keys: ['a', 'b', 'c']\nValues: [1, 2, 3]\nItems: [('a', 1), ('b', 2), ('c', 3)]",
        },
        {
          id: 3,
          description: "Dictionary updates and modifications",
          template:
            "inventory = {'apples': 50, 'bananas': 30}\ninventory.______({'oranges': 25, 'grapes': 40})\nremoved = inventory.______('bananas')\ninventory['apples'] ____ 10\nprint(f'Updated inventory: {inventory}')\nprint(f'Removed: {removed}')",
          blanks: [
            { id: "blank6", answer: "update", position: 0 },
            { id: "blank7", answer: "pop", position: 1 },
            { id: "blank8", answer: "+=", position: 2 },
          ],
          expectedOutput:
            "Updated inventory: {'apples': 60, 'oranges': 25, 'grapes': 40}\nRemoved: 30",
        },
        {
          id: 4,
          description: "Dictionary comprehension",
          template:
            "numbers = [1, 2, 3, 4, 5]\nsquares = {num: num____2 ____ num ____ numbers}\neven_squares = {k: v for k, v in squares.____() ____ k % 2 == 0}\nprint(f'Squares: {squares}')\nprint(f'Even squares: {even_squares}')",
          blanks: [
            { id: "blank9", answer: "**", position: 0 },
            { id: "blank10", answer: "for", position: 1 },
            { id: "blank11", answer: "in", position: 2 },
            { id: "blank12", answer: "items", position: 3 },
            { id: "blank13", answer: "if", position: 4 },
          ],
          expectedOutput:
            "Squares: {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}\nEven squares: {2: 4, 4: 16}",
        },
      ],
    },
    settings: {
      timeLimit: 1400,
      allowHints: true,
      caseSensitive: false,
    },
    isActive: true,
    sortOrder: 9,
  },

  // 10. Exception Handling and File Operations
  {
    title: "Python Exception Handling and Error Management",
    description: "Learn to handle errors gracefully and work with exceptions",
    activityType: "fill_blanks",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 38,
    experienceReward: 80,
    estimatedMinutes: 35,
    tags: ["exceptions", "error-handling", "try-catch", "debugging"],
    content: {
      instructions: "Complete the exception handling and error management code",
      exercises: [
        {
          id: 1,
          description: "Basic try-except structure",
          template:
            "____:\n    result = 10 / 0\n____ ZeroDivisionError:\n    print('Cannot divide by zero!')\n____ Exception as e:\n    print(f'An error occurred: {e}')",
          blanks: [
            { id: "blank1", answer: "try", position: 0 },
            { id: "blank2", answer: "except", position: 1 },
            { id: "blank3", answer: "except", position: 2 },
          ],
          expectedOutput: "Cannot divide by zero!",
        },
        {
          id: 2,
          description: "Try-except-else-finally structure",
          template:
            "try:\n    number = int('42')\nexcept ValueError:\n    print('Invalid number')\n____:\n    print('Conversion successful')\n____:\n    print('This always executes')",
          blanks: [
            { id: "blank4", answer: "else", position: 0 },
            { id: "blank5", answer: "finally", position: 1 },
          ],
          expectedOutput: "Conversion successful\nThis always executes",
        },
        {
          id: 3,
          description: "Raising custom exceptions",
          template:
            "def validate_age(age):\n    if age < 0:\n        ____ ValueError('Age cannot be negative')\n    if age > 150:\n        ____ ValueError('Age seems unrealistic')\n    return True\n\ntry:\n    validate_age(-5)\nexcept ValueError as e:\n    print(f'Error: {e}')",
          blanks: [
            { id: "blank6", answer: "raise", position: 0 },
            { id: "blank7", answer: "raise", position: 1 },
          ],
          expectedOutput: "Error: Age cannot be negative",
        },
        {
          id: 4,
          description: "Multiple exception types",
          template:
            "def safe_divide(a, b):\n    try:\n        return a / b\n    except (____Error, ____Error) as e:\n        print(f'Error: {type(e).__name__}: {e}')\n        return None\n\nresult1 = safe_divide(10, 0)\nresult2 = safe_divide('10', 2)",
          blanks: [
            { id: "blank8", answer: "ZeroDivision", position: 0 },
            { id: "blank9", answer: "Type", position: 1 },
          ],
          expectedOutput:
            "Error: ZeroDivisionError: division by zero\nError: TypeError: unsupported operand type(s) for /: 'str' and 'int'",
        },
      ],
    },
    settings: {
      timeLimit: 1500,
      allowHints: true,
      caseSensitive: false,
    },
    isActive: true,
    sortOrder: 10,
  },
];

export async function seedFillBlanksPythonFundamentalsActivities() {
  console.log("📝 Seeding Fill Blanks Python Fundamentals activities...");

  if (fillBlanksPythonFundamentalsActivities.length === 0) {
    console.log("📝 No Fill Blanks Python Fundamentals activities to seed");
    return;
  }

  for (const activity of fillBlanksPythonFundamentalsActivities) {
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
    `✅ ${fillBlanksPythonFundamentalsActivities.length} Fill Blanks Python Fundamentals activities seeded successfully`
  );
}

// Execute the seeding function if this file is run directly
if (require.main === module) {
  seedFillBlanksPythonFundamentalsActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Fill Blanks Python Fundamentals activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
