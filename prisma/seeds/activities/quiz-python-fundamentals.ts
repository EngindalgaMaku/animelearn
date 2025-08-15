import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Quiz Activities for Python Fundamentals
 * 10 comprehensive quiz activities covering Python concepts
 * Difficulty levels: 1-4 (Beginner to Advanced)
 */

export const quizPythonFundamentalsActivities = [
  // DIFFICULTY 1 - BEGINNER (3 activities)

  // 1. Basic Python Syntax Quiz
  {
    title: "Python Basics Syntax Quiz",
    description:
      "Test your knowledge of basic Python syntax and fundamental concepts",
    activityType: "quiz",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 15,
    experienceReward: 35,
    estimatedMinutes: 12,
    tags: ["syntax", "basics", "beginner", "fundamentals"],
    content: {
      instructions: "Answer questions about Python basic syntax and concepts",
      questions: [
        {
          id: 1,
          question: "What is the correct way to create a comment in Python?",
          options: [
            "// This is a comment",
            "/* This is a comment */",
            "# This is a comment",
            "<!-- This is a comment -->",
          ],
          correct: 2,
          explanation:
            "In Python, comments start with the # symbol. Everything after # on that line is ignored by the interpreter.",
        },
        {
          id: 2,
          question: "Which of the following is a valid Python variable name?",
          options: ["2variable", "my-variable", "my_variable", "my variable"],
          correct: 2,
          explanation:
            "Python variable names can contain letters, numbers, and underscores, but cannot start with a number or contain spaces or hyphens.",
        },
        {
          id: 3,
          question: "What is the output of: print(type(3.14))?",
          options: [
            "<class 'int'>",
            "<class 'float'>",
            "<class 'str'>",
            "<class 'number'>",
          ],
          correct: 1,
          explanation:
            "3.14 is a floating-point number, so its type is 'float'.",
        },
        {
          id: 4,
          question: "How do you create a string in Python?",
          options: [
            "'Hello World'",
            '"Hello World"',
            "'''Hello World'''",
            "All of the above",
          ],
          correct: 3,
          explanation:
            "Python accepts single quotes, double quotes, and triple quotes for creating strings.",
        },
        {
          id: 5,
          question: "What does the len() function return?",
          options: [
            "The memory size of an object",
            "The number of characters or items",
            "The data type",
            "The value of the object",
          ],
          correct: 1,
          explanation:
            "len() returns the number of items in a sequence (like characters in a string or elements in a list).",
        },
      ],
      timeLimit: 360,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 80,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2. Data Types and Variables Quiz
  {
    title: "Python Data Types Mastery Quiz",
    description: "Master Python's fundamental data types and variable concepts",
    activityType: "quiz",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 18,
    experienceReward: 40,
    estimatedMinutes: 15,
    tags: ["data-types", "variables", "types", "casting"],
    content: {
      instructions:
        "Test your understanding of Python data types and variables",
      questions: [
        {
          id: 1,
          question: "What is the result of: bool(0)?",
          options: ["True", "False", "0", "Error"],
          correct: 1,
          explanation:
            "In Python, 0 evaluates to False when converted to boolean. Only non-zero numbers are True.",
        },
        {
          id: 2,
          question: "Which data type is mutable in Python?",
          options: ["int", "str", "tuple", "list"],
          correct: 3,
          explanation:
            "Lists are mutable, meaning you can change their contents. Integers, strings, and tuples are immutable.",
        },
        {
          id: 3,
          question: "What is the output of: str(123) + str(456)?",
          options: ["579", "'579'", "'123456'", "Error"],
          correct: 2,
          explanation:
            "Converting numbers to strings and concatenating them results in '123456', not mathematical addition.",
        },
        {
          id: 4,
          question: "Which of these creates an empty dictionary?",
          options: ["[]", "{}", "()", "set()"],
          correct: 1,
          explanation:
            "{} creates an empty dictionary. [] creates an empty list, () creates an empty tuple, and set() creates an empty set.",
        },
        {
          id: 5,
          question: "What type does input() always return?",
          options: ["int", "float", "str", "It depends on the input"],
          correct: 2,
          explanation:
            "The input() function always returns a string, regardless of what the user types. You need to convert it if you want other types.",
        },
        {
          id: 6,
          question: "What is the difference between '==' and 'is' in Python?",
          options: [
            "No difference",
            "'==' compares values, 'is' compares identity",
            "'is' compares values, '==' compares identity",
            "Both compare identity",
          ],
          correct: 1,
          explanation:
            "'==' compares if two objects have the same value, while 'is' compares if they are the same object in memory.",
        },
      ],
      timeLimit: 450,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 75,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3. Python Operators Quiz
  {
    title: "Python Operators Comprehensive Quiz",
    description:
      "Test your knowledge of all Python operator types and their behaviors",
    activityType: "quiz",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 20,
    experienceReward: 45,
    estimatedMinutes: 18,
    tags: ["operators", "arithmetic", "comparison", "logical"],
    content: {
      instructions: "Answer questions about Python operators and their results",
      questions: [
        {
          id: 1,
          question: "What is the result of 17 // 5?",
          options: ["3.4", "3", "4", "2"],
          correct: 1,
          explanation:
            "The // operator performs floor division, returning the largest integer less than or equal to the result. 17 ÷ 5 = 3.4, floored to 3.",
        },
        {
          id: 2,
          question: "What does the ** operator do?",
          options: [
            "Multiplication",
            "Exponentiation",
            "Floor division",
            "Modulus",
          ],
          correct: 1,
          explanation:
            "The ** operator performs exponentiation (power operation). For example, 2**3 equals 8.",
        },
        {
          id: 3,
          question: "What is the result of: 'Hello' * 3?",
          options: [
            "'HHHeeellllllooo'",
            "'HelloHelloHello'",
            "Error",
            "'Hello3'",
          ],
          correct: 1,
          explanation:
            "The * operator with strings repeats the string. 'Hello' * 3 produces 'HelloHelloHello'.",
        },
        {
          id: 4,
          question: "What is the result of: True and False or True?",
          options: ["True", "False", "Error", "None"],
          correct: 0,
          explanation:
            "Due to operator precedence, this evaluates as (True and False) or True = False or True = True.",
        },
        {
          id: 5,
          question: "What does the 'in' operator do?",
          options: [
            "Checks if a value exists in a sequence",
            "Assigns a value",
            "Compares two values",
            "Imports a module",
          ],
          correct: 0,
          explanation:
            "The 'in' operator checks if a value exists within a sequence like a string, list, or tuple.",
        },
        {
          id: 6,
          question: "What is the result of: not (True and False)?",
          options: ["True", "False", "Error", "None"],
          correct: 0,
          explanation:
            "True and False equals False, and not False equals True.",
        },
        {
          id: 7,
          question: "What does += do with lists?",
          options: [
            "Adds numbers to the list",
            "Extends the list with another iterable",
            "Creates a new list",
            "Removes items",
          ],
          correct: 1,
          explanation:
            "+= with lists extends the original list with items from another iterable, modifying the original list.",
        },
      ],
      timeLimit: 540,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 80,
    },
    isActive: true,
    sortOrder: 3,
  },

  // DIFFICULTY 2 - BASIC (3 activities)

  // 4. Control Flow Structures Quiz
  {
    title: "Python Control Flow Mastery Quiz",
    description: "Master if-statements, loops, and control flow in Python",
    activityType: "quiz",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 22,
    experienceReward: 50,
    estimatedMinutes: 20,
    tags: ["control-flow", "if-statements", "loops", "conditions"],
    content: {
      instructions: "Test your understanding of Python control flow structures",
      questions: [
        {
          id: 1,
          question:
            "What will this code print?\n\nfor i in range(3):\n    if i == 1:\n        continue\n    print(i)",
          options: ["0 1 2", "0 2", "1 2", "0 1"],
          correct: 1,
          explanation:
            "The continue statement skips the rest of the loop iteration when i equals 1, so only 0 and 2 are printed.",
        },
        {
          id: 2,
          question: "What does range(1, 10, 2) generate?",
          options: [
            "[1, 3, 5, 7, 9]",
            "[1, 2, 3, 4, 5, 6, 7, 8, 9]",
            "[2, 4, 6, 8, 10]",
            "[1, 3, 5, 7, 9, 11]",
          ],
          correct: 0,
          explanation:
            "range(1, 10, 2) starts at 1, stops before 10, with a step of 2, generating 1, 3, 5, 7, 9.",
        },
        {
          id: 3,
          question: "What happens when you use 'break' in a nested loop?",
          options: [
            "Breaks all loops",
            "Breaks only the innermost loop",
            "Breaks the outermost loop",
            "Causes an error",
          ],
          correct: 1,
          explanation:
            "The 'break' statement only breaks out of the innermost loop that contains it.",
        },
        {
          id: 4,
          question:
            "What is the output of this code?\n\nx = 5\nif x > 10:\n    print('A')\nelif x > 3:\n    print('B')\nelse:\n    print('C')",
          options: ["A", "B", "C", "A B"],
          correct: 1,
          explanation:
            "Since x=5 is not > 10 but is > 3, the elif condition is true and 'B' is printed.",
        },
        {
          id: 5,
          question: "What does the 'else' clause do with a 'for' loop?",
          options: [
            "Executes if the loop runs at least once",
            "Executes if the loop doesn't break",
            "Always executes after the loop",
            "Executes if the loop is empty",
          ],
          correct: 1,
          explanation:
            "The 'else' clause of a for loop executes only if the loop completes normally without encountering a 'break' statement.",
        },
        {
          id: 6,
          question:
            "What will this code output?\n\nfor i in range(2):\n    for j in range(2):\n        print(f'{i},{j}', end=' ')",
          options: ["0,0 0,1 1,0 1,1", "0,0 1,1", "0,1 1,0", "Error"],
          correct: 0,
          explanation:
            "Nested loops will iterate through all combinations: (0,0), (0,1), (1,0), (1,1).",
        },
      ],
      timeLimit: 600,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 75,
    },
    isActive: true,
    sortOrder: 4,
  },

  // 5. Functions and Parameters Quiz
  {
    title: "Python Functions Deep Dive Quiz",
    description:
      "Test your understanding of Python functions, parameters, and scope",
    activityType: "quiz",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 25,
    experienceReward: 55,
    estimatedMinutes: 22,
    tags: ["functions", "parameters", "scope", "return-values"],
    content: {
      instructions:
        "Answer questions about Python functions and their behavior",
      questions: [
        {
          id: 1,
          question:
            "What happens if a function doesn't have a return statement?",
          options: [
            "Error occurs",
            "Returns None",
            "Returns 0",
            "Returns empty string",
          ],
          correct: 1,
          explanation:
            "If a function doesn't explicitly return a value, Python automatically returns None.",
        },
        {
          id: 2,
          question: "What is the difference between parameters and arguments?",
          options: [
            "No difference",
            "Parameters are in function definition, arguments are passed when calling",
            "Arguments are in function definition, parameters are passed when calling",
            "Parameters are for numbers, arguments are for strings",
          ],
          correct: 1,
          explanation:
            "Parameters are variables in the function definition, while arguments are the actual values passed to the function when called.",
        },
        {
          id: 3,
          question:
            "What will this function return?\n\ndef test(x, y=5):\n    return x + y\n\ntest(3)",
          options: ["3", "5", "8", "Error"],
          correct: 2,
          explanation:
            "When test(3) is called, x=3 and y uses the default value 5, so the result is 3+5=8.",
        },
        {
          id: 4,
          question: "What does *args allow in a function?",
          options: [
            "Multiple keyword arguments",
            "Variable number of positional arguments",
            "Only string arguments",
            "Only numeric arguments",
          ],
          correct: 1,
          explanation:
            "*args allows a function to accept any number of positional arguments, which are collected into a tuple.",
        },
        {
          id: 5,
          question: "What is variable scope in Python?",
          options: [
            "Where a variable can be accessed",
            "The type of a variable",
            "The value of a variable",
            "The name of a variable",
          ],
          correct: 0,
          explanation:
            "Variable scope determines where in the code a variable can be accessed. Python has local, global, and nonlocal scopes.",
        },
        {
          id: 6,
          question:
            "What will this code print?\n\nx = 10\ndef func():\n    x = 20\n    print(x)\nfunc()\nprint(x)",
          options: ["10 10", "20 20", "20 10", "10 20"],
          correct: 2,
          explanation:
            "The function creates a local variable x=20, but the global x remains 10. So it prints 20 then 10.",
        },
        {
          id: 7,
          question: "What does **kwargs allow?",
          options: [
            "Variable positional arguments",
            "Variable keyword arguments",
            "Multiple return values",
            "Function decorators",
          ],
          correct: 1,
          explanation:
            "**kwargs allows a function to accept any number of keyword arguments, which are collected into a dictionary.",
        },
      ],
      timeLimit: 660,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 75,
    },
    isActive: true,
    sortOrder: 5,
  },

  // 6. Data Structures Quiz
  {
    title: "Python Data Structures Comprehensive Quiz",
    description: "Master lists, dictionaries, tuples, and sets in Python",
    activityType: "quiz",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 28,
    experienceReward: 60,
    estimatedMinutes: 25,
    tags: ["data-structures", "lists", "dictionaries", "tuples", "sets"],
    content: {
      instructions: "Test your knowledge of Python's built-in data structures",
      questions: [
        {
          id: 1,
          question: "What's the main difference between a list and a tuple?",
          options: [
            "Lists are faster",
            "Tuples are mutable, lists are immutable",
            "Lists are mutable, tuples are immutable",
            "No difference",
          ],
          correct: 2,
          explanation:
            "Lists are mutable (can be changed), while tuples are immutable (cannot be changed after creation).",
        },
        {
          id: 2,
          question: "What will len({1, 2, 2, 3, 3, 3}) return?",
          options: ["6", "3", "4", "Error"],
          correct: 1,
          explanation:
            "Sets only contain unique elements, so {1, 2, 2, 3, 3, 3} becomes {1, 2, 3} with length 3.",
        },
        {
          id: 3,
          question:
            "How do you access the last element of a list named 'my_list'?",
          options: [
            "my_list[last]",
            "my_list[-1]",
            "my_list[len(my_list)]",
            "my_list.last()",
          ],
          correct: 1,
          explanation:
            "In Python, negative indexing allows you to access elements from the end. -1 refers to the last element.",
        },
        {
          id: 4,
          question: "What does list.pop() do without arguments?",
          options: [
            "Removes the first element",
            "Removes the last element",
            "Removes all elements",
            "Causes an error",
          ],
          correct: 1,
          explanation:
            "list.pop() without arguments removes and returns the last element of the list.",
        },
        {
          id: 5,
          question:
            "What will this code output?\n\nmy_dict = {'a': 1, 'b': 2}\nprint(my_dict.get('c', 'Not found'))",
          options: ["Error", "None", "'Not found'", "'c'"],
          correct: 2,
          explanation:
            "dict.get() returns the default value ('Not found') when the key doesn't exist in the dictionary.",
        },
        {
          id: 6,
          question: "What's the result of [1, 2, 3] + [4, 5, 6]?",
          options: ["[5, 7, 9]", "[1, 2, 3, 4, 5, 6]", "Error", "[15, 21]"],
          correct: 1,
          explanation:
            "The + operator concatenates lists, creating a new list with all elements from both lists.",
        },
        {
          id: 7,
          question:
            "Which data structure would you use for a collection of unique items?",
          options: ["list", "tuple", "dict", "set"],
          correct: 3,
          explanation:
            "Sets automatically ensure all elements are unique, making them perfect for collections of unique items.",
        },
        {
          id: 8,
          question: "What does dict.keys() return?",
          options: [
            "A list of keys",
            "A dict_keys view object",
            "A tuple of keys",
            "A set of keys",
          ],
          correct: 1,
          explanation:
            "dict.keys() returns a dict_keys view object, which is a dynamic view of the dictionary's keys.",
        },
      ],
      timeLimit: 750,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 80,
    },
    isActive: true,
    sortOrder: 6,
  },

  // DIFFICULTY 3 - INTERMEDIATE (2 activities)

  // 7. String Manipulation and Processing Quiz
  {
    title: "Python String Processing Expert Quiz",
    description:
      "Advanced string manipulation, formatting, and processing techniques",
    activityType: "quiz",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 28,
    tags: ["strings", "formatting", "regex", "text-processing"],
    content: {
      instructions: "Test your advanced string processing skills in Python",
      questions: [
        {
          id: 1,
          question: "What's the output of 'Hello {name}'.format(name='World')?",
          options: ["'Hello {name}'", "'Hello World'", "Error", "'Hello name'"],
          correct: 1,
          explanation:
            "The .format() method replaces {name} with the provided keyword argument value 'World'.",
        },
        {
          id: 2,
          question: "What does 'hello world'.title() return?",
          options: [
            "'Hello World'",
            "'HELLO WORLD'",
            "'Hello world'",
            "'hello world'",
          ],
          correct: 0,
          explanation:
            "The title() method capitalizes the first letter of each word in the string.",
        },
        {
          id: 3,
          question: "What's the result of 'a-b-c'.split('-', 1)?",
          options: ["['a', 'b', 'c']", "['a', 'b-c']", "['a-b-c']", "Error"],
          correct: 1,
          explanation:
            "split('-', 1) splits at most 1 time, creating ['a', 'b-c'].",
        },
        {
          id: 4,
          question: "What does f'{3.14159:.2f}' produce?",
          options: ["'3.14159'", "'3.14'", "'3.1'", "'3'"],
          correct: 1,
          explanation:
            "The :.2f format specifier rounds the float to 2 decimal places.",
        },
        {
          id: 5,
          question: "What will 'Hello\\nWorld'.split() return?",
          options: [
            "['Hello\\nWorld']",
            "['Hello', 'World']",
            "['Hello\\n', 'World']",
            "Error",
          ],
          correct: 1,
          explanation:
            "split() without arguments splits on any whitespace, including newlines, and removes empty strings.",
        },
        {
          id: 6,
          question: "What does '   text   '.strip() return?",
          options: ["'   text   '", "'text   '", "'   text'", "'text'"],
          correct: 3,
          explanation:
            "strip() removes whitespace from both the beginning and end of the string.",
        },
        {
          id: 7,
          question: "What's the result of 'abc'.replace('b', 'XYZ')?",
          options: ["'aXYZc'", "'XYZbc'", "'abXYZ'", "'XYZXYZXYZ'"],
          correct: 0,
          explanation:
            "replace() substitutes all occurrences of 'b' with 'XYZ', resulting in 'aXYZc'.",
        },
      ],
      timeLimit: 840,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 75,
    },
    isActive: true,
    sortOrder: 7,
  },

  // 8. Exception Handling and Debugging Quiz
  {
    title: "Python Exception Handling Mastery Quiz",
    description:
      "Master error handling, debugging, and exception management in Python",
    activityType: "quiz",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 32,
    experienceReward: 70,
    estimatedMinutes: 30,
    tags: ["exceptions", "error-handling", "debugging", "try-catch"],
    content: {
      instructions:
        "Test your knowledge of Python exception handling and debugging",
      questions: [
        {
          id: 1,
          question:
            "Which exception is raised when trying to access a non-existent dictionary key?",
          options: ["IndexError", "KeyError", "ValueError", "AttributeError"],
          correct: 1,
          explanation:
            "KeyError is raised when trying to access a dictionary key that doesn't exist.",
        },
        {
          id: 2,
          question:
            "What happens in a try-except-finally block if an exception occurs?",
          options: [
            "Only try runs",
            "try and except run, finally is skipped",
            "try, except, and finally all run",
            "Only except runs",
          ],
          correct: 2,
          explanation:
            "If an exception occurs, the try block stops, the appropriate except block runs, and finally always runs.",
        },
        {
          id: 3,
          question:
            "What does 'raise' do without an argument inside an except block?",
          options: [
            "Creates a new exception",
            "Re-raises the caught exception",
            "Ignores the exception",
            "Causes a syntax error",
          ],
          correct: 1,
          explanation:
            "Using 'raise' without arguments re-raises the currently handled exception.",
        },
        {
          id: 4,
          question: "When does the 'else' clause in try-except execute?",
          options: [
            "When an exception occurs",
            "When no exception occurs",
            "Always",
            "Never",
          ],
          correct: 1,
          explanation:
            "The 'else' clause executes only when no exception occurs in the try block.",
        },
        {
          id: 5,
          question: "What type of exception does int('abc') raise?",
          options: ["TypeError", "ValueError", "SyntaxError", "AttributeError"],
          correct: 1,
          explanation:
            "ValueError is raised when a function receives an argument of correct type but inappropriate value.",
        },
        {
          id: 6,
          question: "How do you catch multiple specific exceptions?",
          options: [
            "except Exception1, Exception2:",
            "except (Exception1, Exception2):",
            "except Exception1 and Exception2:",
            "except Exception1 or Exception2:",
          ],
          correct: 1,
          explanation:
            "Use a tuple to catch multiple specific exceptions: except (Exception1, Exception2):",
        },
        {
          id: 7,
          question: "What happens if you don't handle an exception?",
          options: [
            "The program continues normally",
            "The program terminates",
            "The exception is ignored",
            "Python handles it automatically",
          ],
          correct: 1,
          explanation:
            "Unhandled exceptions cause the program to terminate and display a traceback.",
        },
      ],
      timeLimit: 900,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 80,
    },
    isActive: true,
    sortOrder: 8,
  },

  // DIFFICULTY 4 - ADVANCED (2 activities)

  // 9. Advanced Python Concepts Quiz
  {
    title: "Advanced Python Programming Quiz",
    description: "Test your knowledge of advanced Python features and concepts",
    activityType: "quiz",
    category: "Python Fundamentals",
    difficulty: 4,
    diamondReward: 35,
    experienceReward: 75,
    estimatedMinutes: 32,
    tags: ["advanced", "comprehensions", "generators", "decorators", "lambda"],
    content: {
      instructions:
        "Challenge yourself with advanced Python programming concepts",
      questions: [
        {
          id: 1,
          question:
            "What's the difference between a list comprehension and a generator expression?",
          options: [
            "No difference",
            "List comprehension creates a list, generator expression creates an iterator",
            "Generator expression creates a list, list comprehension creates an iterator",
            "List comprehensions are faster",
          ],
          correct: 1,
          explanation:
            "List comprehensions [x for x in iterable] create a full list in memory, while generator expressions (x for x in iterable) create an iterator that yields values on demand.",
        },
        {
          id: 2,
          question:
            "What does this list comprehension produce: [x**2 for x in range(5) if x % 2 == 0]?",
          options: ["[0, 1, 4, 9, 16]", "[0, 4, 16]", "[0, 2, 4]", "[1, 9]"],
          correct: 1,
          explanation:
            "This comprehension squares even numbers from 0-4: 0² = 0, 2² = 4, 4² = 16, so [0, 4, 16].",
        },
        {
          id: 3,
          question: "What does the 'yield' keyword do?",
          options: [
            "Returns a value and ends the function",
            "Returns a value but preserves function state",
            "Raises an exception",
            "Imports a module",
          ],
          correct: 1,
          explanation:
            "'yield' returns a value but preserves the function's state, making it a generator function that can be resumed.",
        },
        {
          id: 4,
          question: "What is a decorator in Python?",
          options: [
            "A way to comment code",
            "A function that modifies another function",
            "A data type",
            "A loop structure",
          ],
          correct: 1,
          explanation:
            "A decorator is a function that takes another function as argument and extends or modifies its behavior without explicitly modifying it.",
        },
        {
          id: 5,
          question: "What does lambda x, y: x + y create?",
          options: [
            "A variable",
            "An anonymous function",
            "A class",
            "A module",
          ],
          correct: 1,
          explanation:
            "Lambda creates an anonymous function that takes two arguments and returns their sum.",
        },
        {
          id: 6,
          question: "What's the output of list(map(lambda x: x*2, [1, 2, 3]))?",
          options: ["[1, 2, 3]", "[2, 4, 6]", "[1, 4, 9]", "Error"],
          correct: 1,
          explanation:
            "map() applies the lambda function (multiply by 2) to each element: [1*2, 2*2, 3*2] = [2, 4, 6].",
        },
        {
          id: 7,
          question: "What is the purpose of *args and **kwargs together?",
          options: [
            "To accept any number and type of arguments",
            "To create lists and dictionaries",
            "To handle exceptions",
            "To define classes",
          ],
          correct: 0,
          explanation:
            "*args accepts any number of positional arguments, **kwargs accepts any number of keyword arguments, together they can accept any arguments.",
        },
      ],
      timeLimit: 960,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 85,
    },
    isActive: true,
    sortOrder: 9,
  },

  // 10. Python Best Practices and Optimization Quiz
  {
    title: "Python Best Practices and Performance Quiz",
    description:
      "Master Python best practices, optimization, and professional coding standards",
    activityType: "quiz",
    category: "Python Fundamentals",
    difficulty: 4,
    diamondReward: 40,
    experienceReward: 80,
    estimatedMinutes: 35,
    tags: ["best-practices", "optimization", "pep8", "performance"],
    content: {
      instructions:
        "Test your knowledge of Python best practices and optimization techniques",
      questions: [
        {
          id: 1,
          question:
            "According to PEP 8, what's the recommended maximum line length?",
          options: [
            "72 characters",
            "79 characters",
            "100 characters",
            "120 characters",
          ],
          correct: 1,
          explanation:
            "PEP 8 recommends a maximum line length of 79 characters for code and 72 for comments and docstrings.",
        },
        {
          id: 2,
          question:
            "Which is more efficient for checking membership in a large collection?",
          options: ["List", "Tuple", "Set", "Dictionary"],
          correct: 2,
          explanation:
            "Sets use hash tables for O(1) average case lookup, making them much faster than lists or tuples for membership testing.",
        },
        {
          id: 3,
          question: "What's the preferred way to check if a variable is None?",
          options: [
            "if x == None:",
            "if x is None:",
            "if not x:",
            "if x != None:",
          ],
          correct: 1,
          explanation:
            "Use 'is None' instead of '== None' because 'is' checks for identity, which is more precise and faster for None.",
        },
        {
          id: 4,
          question:
            "Which string formatting method is generally preferred in modern Python?",
          options: [
            "% formatting",
            ".format() method",
            "f-strings",
            "Template strings",
          ],
          correct: 2,
          explanation:
            "f-strings (formatted string literals) are generally preferred for their readability, performance, and convenience.",
        },
        {
          id: 5,
          question: "What's the most Pythonic way to swap two variables?",
          options: [
            "temp = a; a = b; b = temp",
            "a, b = b, a",
            "a = a + b; b = a - b; a = a - b",
            "Using a function",
          ],
          correct: 1,
          explanation:
            "Python's tuple unpacking allows elegant variable swapping with 'a, b = b, a'.",
        },
        {
          id: 6,
          question: "When should you use list comprehensions vs regular loops?",
          options: [
            "Always use list comprehensions",
            "Always use regular loops",
            "Use comprehensions for simple operations, loops for complex logic",
            "Use comprehensions for large data only",
          ],
          correct: 2,
          explanation:
            "List comprehensions are great for simple transformations and filtering, but regular loops are better for complex logic or when readability suffers.",
        },
        {
          id: 7,
          question:
            "What's the difference between 'is' and '==' for small integers?",
          options: [
            "No difference",
            "'is' works due to integer caching, but == is safer",
            "'==' doesn't work with integers",
            "'is' is always wrong for integers",
          ],
          correct: 1,
          explanation:
            "Python caches small integers (-5 to 256), so 'is' might work by coincidence, but '==' is the correct comparison for values.",
        },
        {
          id: 8,
          question: "What's the best practice for handling file operations?",
          options: [
            "Always use open() and close()",
            "Use try-finally blocks",
            "Use with statements",
            "Use global file handles",
          ],
          correct: 2,
          explanation:
            "Using 'with' statements ensures files are properly closed even if exceptions occur, following the context manager protocol.",
        },
      ],
      timeLimit: 1050,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 85,
    },
    isActive: true,
    sortOrder: 10,
  },
];

export async function seedQuizPythonFundamentalsActivities() {
  await seedActivitiesWithDuplicateCheck(
    quizPythonFundamentalsActivities,
    "Quiz Python Fundamentals"
  );
}

// Execute the seeding function if this file is run directly
if (require.main === module) {
  seedQuizPythonFundamentalsActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Quiz Python Fundamentals activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
