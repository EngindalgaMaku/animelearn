import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const pythonFundamentalsActivities = [
  // BEGINNER LEVEL (Difficulty 1) - 8 Activities
  {
    title: "Python Basics: Hello World",
    description:
      "Learn to write your first Python program and understand basic print statements.",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 50,
    experienceReward: 100,
    estimatedMinutes: 15,
    content: JSON.stringify({
      instructions:
        "Write a Python program that prints 'Hello, World!' to the console.",
      starterCode:
        "# Write your first Python program here\n# Use the print() function\n",
      solutionCode: "print('Hello, World!')",
      hints: ["Use the print() function", "Remember to use quotes around text"],
      testCases: [
        {
          input: "",
          expectedOutput: "Hello, World!",
          description: "Should print Hello, World!",
        },
      ],
    }),
    sortOrder: 1,
    isLocked: false,
    tags: JSON.stringify(["basics", "print", "hello-world"]),
  },
  {
    title: "Variables and Data Types",
    description:
      "Master Python variables and understand different data types like strings, integers, and floats.",
    activityType: "concept_exploration",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 60,
    experienceReward: 120,
    estimatedMinutes: 20,
    content: JSON.stringify({
      instructions:
        "Create variables of different types and learn about Python's dynamic typing.",
      concepts: [
        "Variables are containers for storing data",
        "Python has dynamic typing",
        "Common data types: str, int, float, bool",
      ],
      examples: [
        "name = 'Alice'  # String",
        "age = 25  # Integer",
        "height = 5.7  # Float",
        "is_student = True  # Boolean",
      ],
    }),
    sortOrder: 2,
    isLocked: false,
    tags: JSON.stringify(["variables", "data-types", "concepts"]),
  },
  {
    title: "Basic Math Operations",
    description:
      "Learn arithmetic operators and perform calculations in Python.",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 55,
    experienceReward: 110,
    estimatedMinutes: 18,
    content: JSON.stringify({
      instructions:
        "Create a simple calculator that performs basic math operations.",
      starterCode:
        "# Create variables for two numbers\nnum1 = 10\nnum2 = 5\n\n# Perform calculations and print results\n",
      solutionCode:
        "num1 = 10\nnum2 = 5\n\naddition = num1 + num2\nsubtraction = num1 - num2\nmultiplication = num1 * num2\ndivision = num1 / num2\n\nprint(f'Addition: {addition}')\nprint(f'Subtraction: {subtraction}')\nprint(f'Multiplication: {multiplication}')\nprint(f'Division: {division}')",
      hints: ["Use +, -, *, / operators", "Use f-strings for formatting"],
      testCases: [
        {
          input: "",
          expectedOutput:
            "Addition: 15\nSubtraction: 5\nMultiplication: 50\nDivision: 2.0",
          description: "Should perform all basic math operations",
        },
      ],
    }),
    sortOrder: 3,
    isLocked: false,
    tags: JSON.stringify(["math", "operators", "calculations"]),
  },
  {
    title: "String Manipulation Basics",
    description:
      "Learn to work with strings: concatenation, formatting, and basic methods.",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 65,
    experienceReward: 130,
    estimatedMinutes: 22,
    content: JSON.stringify({
      instructions:
        "Practice string operations and learn common string methods.",
      starterCode:
        "# Work with strings\nfirst_name = 'John'\nlast_name = 'Doe'\n\n# Create full name and manipulate strings\n",
      solutionCode:
        "first_name = 'John'\nlast_name = 'Doe'\n\nfull_name = first_name + ' ' + last_name\nprint(f'Full name: {full_name}')\nprint(f'Uppercase: {full_name.upper()}')\nprint(f'Lowercase: {full_name.lower()}')\nprint(f'Length: {len(full_name)}')",
      hints: [
        "Use + for concatenation",
        "Try .upper(), .lower(), len() methods",
      ],
      testCases: [
        {
          input: "",
          expectedOutput:
            "Full name: John Doe\nUppercase: JOHN DOE\nLowercase: john doe\nLength: 8",
          description: "Should manipulate strings correctly",
        },
      ],
    }),
    sortOrder: 4,
    isLocked: false,
    tags: JSON.stringify(["strings", "concatenation", "methods"]),
  },
  {
    title: "Input and Output",
    description:
      "Learn to get user input and display output using input() and print() functions.",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 70,
    experienceReward: 140,
    estimatedMinutes: 25,
    content: JSON.stringify({
      instructions:
        "Create an interactive program that gets user input and responds.",
      starterCode: "# Get user input and create a personalized greeting\n",
      solutionCode:
        "name = input('What is your name? ')\nage = input('How old are you? ')\n\nprint(f'Hello {name}!')\nprint(f'You are {age} years old.')\nprint('Welcome to Python programming!')",
      hints: [
        "Use input() to get user input",
        "Use print() to display output",
        "Combine with f-strings",
      ],
      testCases: [
        {
          input: "Alice\n25",
          expectedOutput:
            "Hello Alice!\nYou are 25 years old.\nWelcome to Python programming!",
          description: "Should create personalized greeting",
        },
      ],
    }),
    sortOrder: 5,
    isLocked: false,
    tags: JSON.stringify(["input", "output", "interaction"]),
  },
  {
    title: "Boolean Logic and Conditions",
    description:
      "Understand boolean values and learn basic conditional logic with if statements.",
    activityType: "quiz_challenge",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 45,
    experienceReward: 90,
    estimatedMinutes: 15,
    content: JSON.stringify({
      instructions:
        "Test your knowledge of boolean logic and conditional statements.",
      questions: [
        {
          question: "What is the result of: True and False?",
          options: ["True", "False", "None", "Error"],
          correct: 1,
          explanation:
            "The 'and' operator returns True only when both operands are True.",
        },
        {
          question: "Which operator checks if two values are equal?",
          options: ["=", "==", "!=", "is"],
          correct: 1,
          explanation: "The == operator compares values for equality.",
        },
        {
          question: "What does this code print: print(5 > 3)?",
          options: ["5", "3", "True", "False"],
          correct: 2,
          explanation: "5 is greater than 3, so the comparison returns True.",
        },
      ],
    }),
    sortOrder: 6,
    isLocked: false,
    tags: JSON.stringify(["boolean", "logic", "conditions"]),
  },
  {
    title: "Simple If Statements",
    description:
      "Learn to make decisions in your code using if, elif, and else statements.",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 75,
    experienceReward: 150,
    estimatedMinutes: 28,
    content: JSON.stringify({
      instructions:
        "Create a program that makes decisions based on user input.",
      starterCode:
        "# Create a simple grade checker\nscore = 85\n\n# Add if/elif/else logic to determine grade\n",
      solutionCode:
        "score = 85\n\nif score >= 90:\n    grade = 'A'\nelif score >= 80:\n    grade = 'B'\nelif score >= 70:\n    grade = 'C'\nelif score >= 60:\n    grade = 'D'\nelse:\n    grade = 'F'\n\nprint(f'Score: {score}')\nprint(f'Grade: {grade}')",
      hints: [
        "Use if, elif, else statements",
        "Remember proper indentation",
        "Use comparison operators",
      ],
      testCases: [
        {
          input: "",
          expectedOutput: "Score: 85\nGrade: B",
          description: "Should assign correct grade based on score",
        },
      ],
    }),
    sortOrder: 7,
    isLocked: false,
    tags: JSON.stringify(["if-statements", "conditions", "decision-making"]),
  },
  {
    title: "Introduction to Lists",
    description:
      "Learn about Python lists: creating, accessing, and basic list operations.",
    activityType: "concept_exploration",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 80,
    experienceReward: 160,
    estimatedMinutes: 30,
    content: JSON.stringify({
      instructions: "Explore Python lists and learn basic list operations.",
      concepts: [
        "Lists store multiple items in a single variable",
        "Lists are ordered and changeable",
        "List items are indexed starting from 0",
      ],
      examples: [
        "fruits = ['apple', 'banana', 'orange']",
        "print(fruits[0])  # First item",
        "fruits.append('grape')  # Add item",
        "print(len(fruits))  # List length",
      ],
    }),
    sortOrder: 8,
    isLocked: false,
    tags: JSON.stringify(["lists", "data-structures", "indexing"]),
  },

  // INTERMEDIATE LEVEL (Difficulty 2) - 8 Activities
  {
    title: "For Loops and Iteration",
    description:
      "Master for loops to iterate over sequences and repeat code efficiently.",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 90,
    experienceReward: 180,
    estimatedMinutes: 35,
    content: JSON.stringify({
      instructions: "Use for loops to iterate over lists and ranges.",
      starterCode:
        "# Create a list of numbers and iterate over it\nnumbers = [1, 2, 3, 4, 5]\n\n# Use for loop to print each number and its square\n",
      solutionCode:
        "numbers = [1, 2, 3, 4, 5]\n\nfor num in numbers:\n    square = num ** 2\n    print(f'{num} squared is {square}')\n\nprint('\\nCounting from 1 to 5:')\nfor i in range(1, 6):\n    print(f'Count: {i}')",
      hints: [
        "Use 'for item in list:' syntax",
        "Try range() for sequences",
        "Remember indentation",
      ],
      testCases: [
        {
          input: "",
          expectedOutput:
            "1 squared is 1\n2 squared is 4\n3 squared is 9\n4 squared is 16\n5 squared is 25\n\nCounting from 1 to 5:\nCount: 1\nCount: 2\nCount: 3\nCount: 4\nCount: 5",
          description: "Should iterate and calculate squares",
        },
      ],
    }),
    sortOrder: 9,
    isLocked: false,
    tags: JSON.stringify(["loops", "for-loop", "iteration"]),
  },
  {
    title: "While Loops and Control",
    description:
      "Learn while loops for conditional repetition and loop control statements.",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 95,
    experienceReward: 190,
    estimatedMinutes: 32,
    content: JSON.stringify({
      instructions:
        "Create programs using while loops with proper termination conditions.",
      starterCode:
        "# Create a number guessing game using while loop\nimport random\n\ntarget = random.randint(1, 10)\nguess = 0\nattempts = 0\n\n# Add while loop logic\n",
      solutionCode:
        "import random\n\ntarget = random.randint(1, 10)\nguess = 0\nattempts = 0\n\nprint('Guess a number between 1 and 10!')\n\nwhile guess != target and attempts < 3:\n    guess = int(input('Enter your guess: '))\n    attempts += 1\n    \n    if guess == target:\n        print(f'Correct! You found it in {attempts} attempts!')\n    elif attempts < 3:\n        if guess < target:\n            print('Too low!')\n        else:\n            print('Too high!')\n    else:\n        print(f'Game over! The number was {target}')",
      hints: [
        "Use while condition:",
        "Update variables inside loop",
        "Add termination condition",
      ],
      testCases: [
        {
          input: "5\n7\n6",
          expectedOutput: "Guess a number between 1 and 10!",
          description: "Should run guessing game logic",
        },
      ],
    }),
    sortOrder: 10,
    isLocked: false,
    tags: JSON.stringify(["while-loop", "control-flow", "games"]),
  },
  {
    title: "Functions and Parameters",
    description:
      "Learn to create reusable code with functions, parameters, and return values.",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 100,
    experienceReward: 200,
    estimatedMinutes: 40,
    content: JSON.stringify({
      instructions: "Create functions with parameters and return values.",
      starterCode:
        "# Create a function to calculate the area of a rectangle\n# Function should take length and width as parameters\n\ndef calculate_area():\n    # Add your code here\n    pass\n\n# Test the function\n",
      solutionCode:
        'def calculate_area(length, width):\n    """Calculate the area of a rectangle."""\n    area = length * width\n    return area\n\ndef greet_user(name, age=None):\n    """Greet a user with optional age."""\n    if age:\n        return f\'Hello {name}, you are {age} years old!\'\n    else:\n        return f\'Hello {name}!\'\n\n# Test the functions\narea = calculate_area(5, 3)\nprint(f\'Area: {area}\')\n\nprint(greet_user(\'Alice\', 25))\nprint(greet_user(\'Bob\'))',
      hints: [
        "Use def keyword",
        "Add parameters in parentheses",
        "Use return to send back values",
      ],
      testCases: [
        {
          input: "",
          expectedOutput:
            "Area: 15\nHello Alice, you are 25 years old!\nHello Bob!",
          description: "Should create and call functions correctly",
        },
      ],
    }),
    sortOrder: 11,
    isLocked: false,
    tags: JSON.stringify(["functions", "parameters", "return"]),
  },
  {
    title: "List Methods and Manipulation",
    description:
      "Master advanced list operations: append, remove, sort, and list comprehensions.",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 85,
    experienceReward: 170,
    estimatedMinutes: 35,
    content: JSON.stringify({
      instructions:
        "Practice advanced list operations and learn list comprehensions.",
      starterCode:
        "# Work with a list of student grades\ngrades = [85, 92, 78, 96, 88, 75]\n\n# Perform various list operations\n",
      solutionCode:
        "grades = [85, 92, 78, 96, 88, 75]\n\nprint(f'Original grades: {grades}')\n\n# Add a new grade\ngrades.append(91)\nprint(f'After adding 91: {grades}')\n\n# Remove lowest grade\ngrades.remove(min(grades))\nprint(f'After removing lowest: {grades}')\n\n# Sort grades\ngrades.sort(reverse=True)\nprint(f'Sorted (high to low): {grades}')\n\n# List comprehension - grades above 90\nhigh_grades = [g for g in grades if g > 90]\nprint(f'Grades above 90: {high_grades}')\n\n# Calculate average\naverage = sum(grades) / len(grades)\nprint(f'Average: {average:.1f}')",
      hints: [
        "Use .append(), .remove(), .sort()",
        "Try list comprehensions [x for x in list]",
        "Use min(), max(), sum()",
      ],
      testCases: [
        {
          input: "",
          expectedOutput:
            "Original grades: [85, 92, 78, 96, 88, 75]\nAfter adding 91: [85, 92, 78, 96, 88, 75, 91]\nAfter removing lowest: [85, 92, 96, 88, 91]\nSorted (high to low): [96, 92, 91, 88, 85]\nGrades above 90: [96, 92, 91]\nAverage: 90.4",
          description: "Should perform all list operations correctly",
        },
      ],
    }),
    sortOrder: 12,
    isLocked: false,
    tags: JSON.stringify(["lists", "methods", "comprehensions"]),
  },
  {
    title: "Dictionary Fundamentals",
    description:
      "Learn to work with dictionaries: key-value pairs, accessing, and updating data.",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 105,
    experienceReward: 210,
    estimatedMinutes: 38,
    content: JSON.stringify({
      instructions:
        "Create and manipulate dictionaries to store structured data.",
      starterCode:
        "# Create a student record using dictionary\nstudent = {\n    'name': 'Alice',\n    'age': 20,\n    'courses': ['Math', 'Physics']\n}\n\n# Add more operations\n",
      solutionCode:
        "student = {\n    'name': 'Alice',\n    'age': 20,\n    'courses': ['Math', 'Physics']\n}\n\nprint(f'Student: {student[\"name\"]}')\nprint(f'Age: {student[\"age\"]}')\n\n# Add new information\nstudent['grade'] = 'A'\nstudent['courses'].append('Chemistry')\n\nprint(f'Updated record: {student}')\n\n# Iterate over dictionary\nprint('\\nStudent Information:')\nfor key, value in student.items():\n    print(f'{key.title()}: {value}')\n\n# Check if key exists\nif 'email' in student:\n    print(f'Email: {student[\"email\"]}')\nelse:\n    print('Email not provided')",
      hints: [
        "Use {} to create dictionaries",
        "Access with dict[key]",
        "Use .items() to iterate",
      ],
      testCases: [
        {
          input: "",
          expectedOutput:
            "Student: Alice\nAge: 20\nUpdated record: {'name': 'Alice', 'age': 20, 'courses': ['Math', 'Physics', 'Chemistry'], 'grade': 'A'}\n\nStudent Information:\nName: Alice\nAge: 20\nCourses: ['Math', 'Physics', 'Chemistry']\nGrade: A\nEmail not provided",
          description: "Should work with dictionaries correctly",
        },
      ],
    }),
    sortOrder: 13,
    isLocked: false,
    tags: JSON.stringify(["dictionaries", "key-value", "data-structures"]),
  },
  {
    title: "Exception Handling",
    description:
      "Learn to handle errors gracefully using try, except, and finally blocks.",
    activityType: "debugging_challenge",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 110,
    experienceReward: 220,
    estimatedMinutes: 42,
    content: JSON.stringify({
      instructions: "Fix the buggy code and add proper exception handling.",
      buggyCode:
        "# This code has bugs and needs exception handling\ndef divide_numbers(a, b):\n    result = a / b\n    return result\n\nnumbers = ['10', '5', '0', 'abc']\n\nfor num in numbers:\n    result = divide_numbers(10, num)\n    print(f'10 / {num} = {result}')",
      solutionCode:
        "def divide_numbers(a, b):\n    \"\"\"Safely divide two numbers with error handling.\"\"\"\n    try:\n        result = a / b\n        return result\n    except ZeroDivisionError:\n        return 'Error: Cannot divide by zero'\n    except TypeError:\n        return 'Error: Invalid number type'\n\nnumbers = ['10', '5', '0', 'abc']\n\nfor num in numbers:\n    try:\n        # Convert string to number\n        num_value = float(num)\n        result = divide_numbers(10, num_value)\n        print(f'10 / {num} = {result}')\n    except ValueError:\n        print(f'10 / {num} = Error: Invalid number format')\n    except Exception as e:\n        print(f'10 / {num} = Unexpected error: {e}')",
      hints: [
        "Use try/except blocks",
        "Handle specific exception types",
        "Convert strings to numbers safely",
      ],
      testCases: [
        {
          input: "",
          expectedOutput:
            "10 / 10 = 1.0\n10 / 5 = 2.0\n10 / 0 = Error: Cannot divide by zero\n10 / abc = Error: Invalid number format",
          description: "Should handle all errors gracefully",
        },
      ],
    }),
    sortOrder: 14,
    isLocked: false,
    tags: JSON.stringify(["exceptions", "error-handling", "debugging"]),
  },
  {
    title: "File Operations",
    description:
      "Learn to read from and write to files using Python's file handling capabilities.",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 95,
    experienceReward: 190,
    estimatedMinutes: 36,
    content: JSON.stringify({
      instructions:
        "Practice reading and writing files with proper error handling.",
      starterCode:
        "# Work with files to store and retrieve data\nimport os\n\n# Create a simple note-taking program\n",
      solutionCode:
        "import os\n\ndef write_note(filename, content):\n    \"\"\"Write a note to a file.\"\"\"\n    try:\n        with open(filename, 'w') as file:\n            file.write(content)\n        print(f'Note saved to {filename}')\n    except Exception as e:\n        print(f'Error writing file: {e}')\n\ndef read_note(filename):\n    \"\"\"Read a note from a file.\"\"\"\n    try:\n        with open(filename, 'r') as file:\n            content = file.read()\n        return content\n    except FileNotFoundError:\n        return 'File not found'\n    except Exception as e:\n        return f'Error reading file: {e}'\n\n# Test the functions\nnote_content = 'This is my first Python note!\\nPython file handling is useful.'\nwrite_note('my_note.txt', note_content)\n\n# Read and display the note\nstored_note = read_note('my_note.txt')\nprint(f'Retrieved note:\\n{stored_note}')\n\n# Clean up\nif os.path.exists('my_note.txt'):\n    os.remove('my_note.txt')\n    print('Note file cleaned up')",
      hints: [
        "Use 'with open()' for safe file handling",
        "Handle FileNotFoundError",
        "Use 'r' for reading, 'w' for writing",
      ],
      testCases: [
        {
          input: "",
          expectedOutput:
            "Note saved to my_note.txt\nRetrieved note:\nThis is my first Python note!\nPython file handling is useful.\nNote file cleaned up",
          description: "Should handle file operations correctly",
        },
      ],
    }),
    sortOrder: 15,
    isLocked: false,
    tags: JSON.stringify(["files", "io", "file-handling"]),
  },
  {
    title: "Python Memory Game",
    description:
      "Test your knowledge of Python concepts with an interactive memory matching game.",
    activityType: "memory_game",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 75,
    experienceReward: 150,
    estimatedMinutes: 20,
    content: JSON.stringify({
      instructions: "Match Python concepts with their definitions or examples.",
      gameType: "memory_match",
      pairs: [
        { concept: "list", definition: "Ordered collection of items" },
        { concept: "dict", definition: "Key-value pair collection" },
        { concept: "for loop", definition: "Iterate over sequences" },
        { concept: "function", definition: "Reusable block of code" },
        { concept: "try/except", definition: "Handle errors gracefully" },
        { concept: "if statement", definition: "Conditional execution" },
        { concept: "variable", definition: "Container for data" },
        { concept: "string", definition: "Text data type" },
      ],
    }),
    sortOrder: 16,
    isLocked: false,
    tags: JSON.stringify(["memory-game", "review", "concepts"]),
  },

  // ADVANCED LEVEL (Difficulty 3) - 4 Activities
  {
    title: "Object-Oriented Programming Basics",
    description:
      "Learn to create classes and objects to organize code using OOP principles.",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 150,
    experienceReward: 300,
    estimatedMinutes: 50,
    content: JSON.stringify({
      instructions: "Create a class-based system to model real-world objects.",
      starterCode:
        "# Create a Student class with attributes and methods\n\nclass Student:\n    def __init__(self):\n        # Add initialization code\n        pass\n    \n    def add_grade(self):\n        # Add method to add grades\n        pass\n    \n    def get_average(self):\n        # Add method to calculate average\n        pass\n\n# Test the class\n",
      solutionCode:
        'class Student:\n    def __init__(self, name, student_id):\n        """Initialize a new student."""\n        self.name = name\n        self.student_id = student_id\n        self.grades = []\n        self.courses = []\n    \n    def add_grade(self, course, grade):\n        """Add a grade for a course."""\n        if 0 <= grade <= 100:\n            self.grades.append(grade)\n            self.courses.append(course)\n            print(f\'Added grade {grade} for {course}\')\n        else:\n            print(\'Grade must be between 0 and 100\')\n    \n    def get_average(self):\n        """Calculate average grade."""\n        if self.grades:\n            return sum(self.grades) / len(self.grades)\n        return 0\n    \n    def get_info(self):\n        """Get student information."""\n        avg = self.get_average()\n        return f\'Student: {self.name} (ID: {self.student_id})\\nAverage: {avg:.1f}\\nCourses: {len(self.courses)}\'\n\n# Test the class\nstudent = Student(\'Alice Johnson\', \'S001\')\nstudent.add_grade(\'Math\', 95)\nstudent.add_grade(\'Physics\', 88)\nstudent.add_grade(\'Chemistry\', 92)\n\nprint(student.get_info())',
      hints: [
        "Use __init__ for initialization",
        "Use self to reference instance",
        "Add methods for functionality",
      ],
      testCases: [
        {
          input: "",
          expectedOutput:
            "Added grade 95 for Math\nAdded grade 88 for Physics\nAdded grade 92 for Chemistry\nStudent: Alice Johnson (ID: S001)\nAverage: 91.7\nCourses: 3",
          description: "Should create and use class correctly",
        },
      ],
    }),
    sortOrder: 17,
    isLocked: false,
    tags: JSON.stringify(["oop", "classes", "objects"]),
  },
  {
    title: "Advanced Algorithm Challenge",
    description:
      "Implement sorting algorithms and analyze their performance characteristics.",
    activityType: "algorithm_practice",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 175,
    experienceReward: 350,
    estimatedMinutes: 60,
    content: JSON.stringify({
      instructions:
        "Implement bubble sort and binary search algorithms from scratch.",
      starterCode:
        '# Implement sorting and searching algorithms\n\ndef bubble_sort(arr):\n    """Implement bubble sort algorithm."""\n    # Your implementation here\n    pass\n\ndef binary_search(arr, target):\n    """Implement binary search algorithm."""\n    # Your implementation here\n    pass\n\n# Test the algorithms\ntest_data = [64, 34, 25, 12, 22, 11, 90]\nprint(f\'Original: {test_data}\')\n',
      solutionCode:
        'def bubble_sort(arr):\n    """Implement bubble sort algorithm."""\n    n = len(arr)\n    comparisons = 0\n    \n    for i in range(n):\n        swapped = False\n        for j in range(0, n - i - 1):\n            comparisons += 1\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        \n        if not swapped:\n            break\n    \n    return arr, comparisons\n\ndef binary_search(arr, target):\n    """Implement binary search algorithm."""\n    left, right = 0, len(arr) - 1\n    steps = 0\n    \n    while left <= right:\n        steps += 1\n        mid = (left + right) // 2\n        \n        if arr[mid] == target:\n            return mid, steps\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    \n    return -1, steps\n\n# Test the algorithms\ntest_data = [64, 34, 25, 12, 22, 11, 90]\nprint(f\'Original: {test_data}\')\n\n# Sort the data\nsorted_data, comparisons = bubble_sort(test_data.copy())\nprint(f\'Sorted: {sorted_data}\')\nprint(f\'Comparisons made: {comparisons}\')\n\n# Search for a value\ntarget = 25\nindex, steps = binary_search(sorted_data, target)\nif index != -1:\n    print(f\'Found {target} at index {index} in {steps} steps\')\nelse:\n    print(f\'{target} not found after {steps} steps\')',
      hints: [
        "Use nested loops for bubble sort",
        "Use divide and conquer for binary search",
        "Track performance metrics",
      ],
      testCases: [
        {
          input: "",
          expectedOutput:
            "Original: [64, 34, 25, 12, 22, 11, 90]\nSorted: [11, 12, 22, 25, 34, 64, 90]\nComparisons made: 21\nFound 25 at index 3 in 2 steps",
          description: "Should implement algorithms correctly",
        },
      ],
    }),
    sortOrder: 18,
    isLocked: false,
    tags: JSON.stringify(["algorithms", "sorting", "searching"]),
  },
  {
    title: "Data Analysis Project",
    description:
      "Build a complete data analysis program to process and visualize information.",
    activityType: "project_based",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 200,
    experienceReward: 400,
    estimatedMinutes: 75,
    content: JSON.stringify({
      instructions:
        "Create a comprehensive data analysis program for student performance.",
      projectRequirements: [
        "Read student data from multiple sources",
        "Calculate statistics (mean, median, mode)",
        "Identify trends and patterns",
        "Generate a formatted report",
      ],
      starterCode:
        "# Student Performance Analysis System\n\nclass StudentAnalyzer:\n    def __init__(self):\n        self.students = []\n    \n    def add_student_data(self, student_data):\n        # Implement data addition\n        pass\n    \n    def calculate_statistics(self):\n        # Implement statistical calculations\n        pass\n    \n    def generate_report(self):\n        # Implement report generation\n        pass\n\n# Sample data\nsample_data = [\n    {'name': 'Alice', 'math': 95, 'science': 88, 'english': 92},\n    {'name': 'Bob', 'math': 78, 'science': 85, 'english': 80},\n    {'name': 'Charlie', 'math': 92, 'science': 90, 'english': 95}\n]\n",
      solutionCode:
        "import statistics\nfrom collections import Counter\n\nclass StudentAnalyzer:\n    def __init__(self):\n        self.students = []\n    \n    def add_student_data(self, student_data):\n        \"\"\"Add student data to the analyzer.\"\"\"\n        self.students.extend(student_data)\n        print(f'Added {len(student_data)} student records')\n    \n    def calculate_statistics(self):\n        \"\"\"Calculate comprehensive statistics.\"\"\"\n        if not self.students:\n            return {}\n        \n        subjects = ['math', 'science', 'english']\n        stats = {}\n        \n        for subject in subjects:\n            scores = [student[subject] for student in self.students]\n            stats[subject] = {\n                'mean': statistics.mean(scores),\n                'median': statistics.median(scores),\n                'stdev': statistics.stdev(scores) if len(scores) > 1 else 0,\n                'min': min(scores),\n                'max': max(scores)\n            }\n        \n        # Calculate overall averages for each student\n        student_averages = []\n        for student in self.students:\n            avg = (student['math'] + student['science'] + student['english']) / 3\n            student_averages.append(avg)\n        \n        stats['overall'] = {\n            'mean': statistics.mean(student_averages),\n            'median': statistics.median(student_averages),\n            'stdev': statistics.stdev(student_averages) if len(student_averages) > 1 else 0\n        }\n        \n        return stats\n    \n    def find_top_performers(self, n=3):\n        \"\"\"Find top performing students.\"\"\"\n        student_avgs = []\n        for student in self.students:\n            avg = (student['math'] + student['science'] + student['english']) / 3\n            student_avgs.append((student['name'], avg))\n        \n        student_avgs.sort(key=lambda x: x[1], reverse=True)\n        return student_avgs[:n]\n    \n    def generate_report(self):\n        \"\"\"Generate a comprehensive analysis report.\"\"\"\n        if not self.students:\n            return 'No student data available'\n        \n        stats = self.calculate_statistics()\n        top_performers = self.find_top_performers()\n        \n        report = '\\n' + '='*50\n        report += '\\n    STUDENT PERFORMANCE ANALYSIS REPORT'\n        report += '\\n' + '='*50\n        report += f'\\n\\nTotal Students Analyzed: {len(self.students)}'\n        \n        report += '\\n\\nSUBJECT STATISTICS:'\n        report += '\\n' + '-'*30\n        \n        for subject in ['math', 'science', 'english']:\n            s = stats[subject]\n            report += f'\\n\\n{subject.upper()}:'\n            report += f'\\n  Mean: {s[\"mean\"]:.1f}'\n            report += f'\\n  Median: {s[\"median\"]:.1f}'\n            report += f'\\n  Std Dev: {s[\"stdev\"]:.1f}'\n            report += f'\\n  Range: {s[\"min\"]} - {s[\"max\"]}'\n        \n        report += '\\n\\nOVERALL PERFORMANCE:'\n        report += '\\n' + '-'*20\n        o = stats['overall']\n        report += f'\\n  Class Average: {o[\"mean\"]:.1f}'\n        report += f'\\n  Median: {o[\"median\"]:.1f}'\n        report += f'\\n  Standard Deviation: {o[\"stdev\"]:.1f}'\n        \n        report += '\\n\\nTOP PERFORMERS:'\n        report += '\\n' + '-'*15\n        for i, (name, avg) in enumerate(top_performers, 1):\n            report += f'\\n  {i}. {name}: {avg:.1f}'\n        \n        report += '\\n\\n' + '='*50\n        \n        return report\n\n# Sample data and analysis\nsample_data = [\n    {'name': 'Alice', 'math': 95, 'science': 88, 'english': 92},\n    {'name': 'Bob', 'math': 78, 'science': 85, 'english': 80},\n    {'name': 'Charlie', 'math': 92, 'science': 90, 'english': 95},\n    {'name': 'Diana', 'math': 87, 'science': 92, 'english': 89},\n    {'name': 'Eve', 'math': 90, 'science': 86, 'english': 94}\n]\n\n# Run the analysis\nanalyzer = StudentAnalyzer()\nanalyzer.add_student_data(sample_data)\nreport = analyzer.generate_report()\nprint(report)",
      hints: [
        "Use statistics module",
        "Create comprehensive data structures",
        "Format output professionally",
      ],
      testCases: [
        {
          input: "",
          expectedOutput: "Added 5 student records",
          description: "Should perform complete data analysis",
        },
      ],
    }),
    sortOrder: 19,
    isLocked: false,
    tags: JSON.stringify(["project", "data-analysis", "statistics"]),
  },
  {
    title: "Code Review and Optimization",
    description:
      "Review and optimize Python code for better performance and readability.",
    activityType: "code_review",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 125,
    experienceReward: 250,
    estimatedMinutes: 45,
    content: JSON.stringify({
      instructions:
        "Review the provided code and optimize it for better performance and style.",
      originalCode:
        "# Inefficient code that needs optimization\n\ndef process_data(data):\n    result = []\n    for i in range(len(data)):\n        if data[i] % 2 == 0:\n            result.append(data[i] * 2)\n    return result\n\ndef find_max(numbers):\n    max_val = numbers[0]\n    for i in range(len(numbers)):\n        if numbers[i] > max_val:\n            max_val = numbers[i]\n    return max_val\n\ndef count_words(text):\n    words = text.split()\n    word_count = {}\n    for word in words:\n        if word in word_count:\n            word_count[word] = word_count[word] + 1\n        else:\n            word_count[word] = 1\n    return word_count\n\n# Test the functions\ntest_data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\ntest_text = 'python is great python is powerful python is fun'\n\nprint(process_data(test_data))\nprint(find_max(test_data))\nprint(count_words(test_text))",
      optimizedCode:
        '# Optimized code with better performance and style\nfrom collections import Counter\n\ndef process_data(data):\n    """Process data using list comprehension for better performance."""\n    return [num * 2 for num in data if num % 2 == 0]\n\ndef find_max(numbers):\n    """Find maximum using built-in max function."""\n    if not numbers:\n        raise ValueError("Cannot find max of empty list")\n    return max(numbers)\n\ndef count_words(text):\n    """Count words using Counter for better performance."""\n    return dict(Counter(text.lower().split()))\n\n# Alternative manual implementation with get()\ndef count_words_manual(text):\n    """Count words using dict.get() method."""\n    words = text.lower().split()\n    word_count = {}\n    for word in words:\n        word_count[word] = word_count.get(word, 0) + 1\n    return word_count\n\n# Performance comparison\nimport time\n\ndef time_function(func, *args):\n    """Time function execution."""\n    start = time.time()\n    result = func(*args)\n    end = time.time()\n    return result, end - start\n\n# Test the optimized functions\ntest_data = list(range(1, 1001))  # Larger dataset\ntest_text = \'python is great python is powerful python is fun \' * 100\n\nprint(\'Optimized Results:\')\nresult, exec_time = time_function(process_data, test_data)\nprint(f\'Processed {len(result)} even numbers in {exec_time:.6f} seconds\')\n\nresult, exec_time = time_function(find_max, test_data)\nprint(f\'Maximum value: {result} (found in {exec_time:.6f} seconds)\')\n\nresult, exec_time = time_function(count_words, test_text)\nprint(f\'Word count completed in {exec_time:.6f} seconds\')\nprint(f\'Most common words: {dict(Counter(result).most_common(3))}\')',
      improvementPoints: [
        "Use list comprehensions instead of explicit loops",
        "Leverage built-in functions like max(), min()",
        "Use collections.Counter for counting operations",
        "Add proper error handling",
        "Include docstrings for documentation",
        "Consider performance implications",
      ],
    }),
    sortOrder: 20,
    isLocked: false,
    tags: JSON.stringify(["code-review", "optimization", "performance"]),
  },
];

async function createPythonFundamentalsActivities() {
  try {
    console.log("🧹 Cleaning existing Python Fundamentals activities...");

    // Delete all existing Python Fundamentals activities
    const deleteResult = await prisma.learningActivity.deleteMany({
      where: {
        category: "Python Fundamentals",
      },
    });

    console.log(
      `✅ Deleted ${deleteResult.count} existing Python Fundamentals activities`
    );

    console.log("🚀 Creating 20 new Python Fundamentals activities...");

    // Create new activities
    let created = 0;
    for (const activity of pythonFundamentalsActivities) {
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
        console.log(`✅ Created: ${activity.title}`);
      } catch (error) {
        console.error(`❌ Failed to create ${activity.title}:`, error);
      }
    }

    console.log("\n🎉 Activity Creation Summary:");
    console.log(`📚 Total activities created: ${created}/20`);

    // Distribution summary
    const difficultyCount = [0, 0, 0, 0]; // index 0 unused, 1-3 for difficulties
    const activityTypeCount: { [key: string]: number } = {};

    pythonFundamentalsActivities.forEach((activity) => {
      difficultyCount[activity.difficulty]++;
      activityTypeCount[activity.activityType] =
        (activityTypeCount[activity.activityType] || 0) + 1;
    });

    console.log("\n📊 Difficulty Distribution:");
    console.log(`   🔥 Beginner (1): ${difficultyCount[1]} activities`);
    console.log(`   ⚡ Intermediate (2): ${difficultyCount[2]} activities`);
    console.log(`   🚀 Advanced (3): ${difficultyCount[3]} activities`);

    console.log("\n🎯 Activity Type Distribution:");
    Object.entries(activityTypeCount).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} activities`);
    });

    console.log("\n💎 Reward Distribution:");
    const totalDiamonds = pythonFundamentalsActivities.reduce(
      (sum, a) => sum + a.diamondReward,
      0
    );
    const totalXP = pythonFundamentalsActivities.reduce(
      (sum, a) => sum + a.experienceReward,
      0
    );
    console.log(`   💎 Total Diamonds: ${totalDiamonds}`);
    console.log(`   ⭐ Total Experience: ${totalXP}`);
  } catch (error) {
    console.error("❌ Error in activity creation:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the creation process
if (require.main === module) {
  createPythonFundamentalsActivities();
}

export { createPythonFundamentalsActivities, pythonFundamentalsActivities };
