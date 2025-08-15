import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Drag & Drop Activities for Python Fundamentals
 * 10 high-quality drag-drop activities covering various Python concepts
 * Difficulty levels: 1-3 (Beginner to Intermediate)
 */

export const dragDropPythonFundamentalsActivities = [
  // DIFFICULTY 1 - BEGINNER (4 activities)

  // 1. Basic Data Types Classification
  {
    title: "Python Data Types Explorer",
    description:
      "Learn to identify and classify Python's fundamental data types",
    activityType: "drag_drop",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 10,
    experienceReward: 25,
    estimatedMinutes: 8,
    tags: ["data-types", "variables", "beginner", "classification"],
    content: {
      instructions: "Drag each Python value to its correct data type category",
      items: [
        { id: 1, value: "42", type: "int" },
        { id: 2, value: "3.14159", type: "float" },
        { id: 3, value: "'Hello Python!'", type: "str" },
        { id: 4, value: "True", type: "bool" },
        { id: 5, value: "False", type: "bool" },
        { id: 6, value: "[1, 2, 3, 4]", type: "list" },
        { id: 7, value: "{'name': 'Alice', 'age': 25}", type: "dict" },
        { id: 8, value: "(10, 20, 30)", type: "tuple" },
        { id: 9, value: "{1, 2, 3, 4}", type: "set" },
        { id: 10, value: "None", type: "none" },
        { id: 11, value: "-15", type: "int" },
        { id: 12, value: '"Welcome to Python"', type: "str" },
      ],
      categories: [
        {
          id: "int",
          name: "Integer",
          description: "Whole numbers (positive, negative, zero)",
        },
        {
          id: "float",
          name: "Float",
          description: "Decimal numbers with floating point",
        },
        {
          id: "str",
          name: "String",
          description: "Text data enclosed in quotes",
        },
        {
          id: "bool",
          name: "Boolean",
          description: "True or False logical values",
        },
        {
          id: "list",
          name: "List",
          description: "Ordered, mutable collection [...]",
        },
        {
          id: "dict",
          name: "Dictionary",
          description: "Key-value pairs {...}",
        },
        {
          id: "tuple",
          name: "Tuple",
          description: "Ordered, immutable collection (...)",
        },
        {
          id: "set",
          name: "Set",
          description: "Unordered collection of unique elements",
        },
        {
          id: "none",
          name: "NoneType",
          description: "Represents absence of value",
        },
      ],
    },
    settings: {
      timeLimit: 300,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2. Python Operators Classification
  {
    title: "Python Operators Categorizer",
    description: "Sort Python operators into their correct categories",
    activityType: "drag_drop",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 30,
    estimatedMinutes: 10,
    tags: ["operators", "arithmetic", "comparison", "logical"],
    content: {
      instructions:
        "Drag each operator to its correct category based on its function",
      items: [
        { id: 1, value: "+", type: "arithmetic" },
        { id: 2, value: "-", type: "arithmetic" },
        { id: 3, value: "*", type: "arithmetic" },
        { id: 4, value: "/", type: "arithmetic" },
        { id: 5, value: "//", type: "arithmetic" },
        { id: 6, value: "%", type: "arithmetic" },
        { id: 7, value: "**", type: "arithmetic" },
        { id: 8, value: "==", type: "comparison" },
        { id: 9, value: "!=", type: "comparison" },
        { id: 10, value: "<", type: "comparison" },
        { id: 11, value: ">", type: "comparison" },
        { id: 12, value: "<=", type: "comparison" },
        { id: 13, value: ">=", type: "comparison" },
        { id: 14, value: "and", type: "logical" },
        { id: 15, value: "or", type: "logical" },
        { id: 16, value: "not", type: "logical" },
        { id: 17, value: "=", type: "assignment" },
        { id: 18, value: "+=", type: "assignment" },
      ],
      categories: [
        {
          id: "arithmetic",
          name: "Arithmetic",
          description: "Mathematical calculations (+, -, *, /, etc.)",
        },
        {
          id: "comparison",
          name: "Comparison",
          description: "Compare values (==, !=, <, >, etc.)",
        },
        {
          id: "logical",
          name: "Logical",
          description: "Boolean logic (and, or, not)",
        },
        {
          id: "assignment",
          name: "Assignment",
          description: "Assign values to variables (=, +=, etc.)",
        },
      ],
    },
    settings: {
      timeLimit: 400,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3. Variable Naming Rules
  {
    title: "Python Variable Naming Rules",
    description: "Identify valid and invalid Python variable names",
    activityType: "drag_drop",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 15,
    experienceReward: 35,
    estimatedMinutes: 12,
    tags: ["variables", "naming", "syntax", "rules"],
    content: {
      instructions:
        "Drag each name to determine if it's a valid Python variable name",
      items: [
        { id: 1, value: "my_variable", type: "valid" },
        { id: 2, value: "variable1", type: "valid" },
        { id: 3, value: "_private_var", type: "valid" },
        { id: 4, value: "userName", type: "valid" },
        { id: 5, value: "CONSTANT_VALUE", type: "valid" },
        { id: 6, value: "student_age", type: "valid" },
        { id: 7, value: "2variable", type: "invalid" },
        { id: 8, value: "my-variable", type: "invalid" },
        { id: 9, value: "for", type: "invalid" },
        { id: 10, value: "class", type: "invalid" },
        { id: 11, value: "def", type: "invalid" },
        { id: 12, value: "my variable", type: "invalid" },
        { id: 13, value: "variable@name", type: "invalid" },
        { id: 14, value: "variable#1", type: "invalid" },
      ],
      categories: [
        {
          id: "valid",
          name: "Valid Variable Names",
          description:
            "Follow Python naming rules: letters, numbers, underscore, no spaces, no keywords",
        },
        {
          id: "invalid",
          name: "Invalid Variable Names",
          description:
            "Break Python naming rules: start with number, special chars, keywords, spaces",
        },
      ],
    },
    settings: {
      timeLimit: 450,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 3,
  },

  // 4. String Methods and Operations
  {
    title: "Python String Methods Classifier",
    description: "Categorize Python string methods by their functionality",
    activityType: "drag_drop",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 18,
    experienceReward: 40,
    estimatedMinutes: 15,
    tags: ["strings", "methods", "text-processing", "functions"],
    content: {
      instructions:
        "Drag each string method to its correct functional category",
      items: [
        { id: 1, value: "upper()", type: "case_conversion" },
        { id: 2, value: "lower()", type: "case_conversion" },
        { id: 3, value: "title()", type: "case_conversion" },
        { id: 4, value: "capitalize()", type: "case_conversion" },
        { id: 5, value: "strip()", type: "whitespace" },
        { id: 6, value: "lstrip()", type: "whitespace" },
        { id: 7, value: "rstrip()", type: "whitespace" },
        { id: 8, value: "split()", type: "splitting_joining" },
        { id: 9, value: "join()", type: "splitting_joining" },
        { id: 10, value: "replace()", type: "modification" },
        { id: 11, value: "find()", type: "searching" },
        { id: 12, value: "index()", type: "searching" },
        { id: 13, value: "count()", type: "searching" },
        { id: 14, value: "startswith()", type: "checking" },
        { id: 15, value: "endswith()", type: "checking" },
        { id: 16, value: "isdigit()", type: "checking" },
        { id: 17, value: "isalpha()", type: "checking" },
        { id: 18, value: "len()", type: "information" },
      ],
      categories: [
        {
          id: "case_conversion",
          name: "Case Conversion",
          description: "Change text case (upper, lower, title)",
        },
        {
          id: "whitespace",
          name: "Whitespace Handling",
          description: "Remove spaces and whitespace",
        },
        {
          id: "splitting_joining",
          name: "Split & Join",
          description: "Break apart or combine strings",
        },
        {
          id: "modification",
          name: "Text Modification",
          description: "Change or replace text content",
        },
        {
          id: "searching",
          name: "Search & Find",
          description: "Locate text within strings",
        },
        {
          id: "checking",
          name: "Content Checking",
          description: "Validate string properties",
        },
        {
          id: "information",
          name: "String Information",
          description: "Get information about strings",
        },
      ],
    },
    settings: {
      timeLimit: 600,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 4,
  },

  // DIFFICULTY 2 - BASIC (3 activities)

  // 5. Control Flow Structures
  {
    title: "Python Control Flow Statements",
    description: "Classify Python control flow statements and their purposes",
    activityType: "drag_drop",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 45,
    estimatedMinutes: 16,
    tags: ["control-flow", "if-statements", "loops", "conditions"],
    content: {
      instructions:
        "Drag each code snippet to its correct control flow category",
      items: [
        { id: 1, value: "if age >= 18:", type: "conditional" },
        { id: 2, value: "elif score > 80:", type: "conditional" },
        { id: 3, value: "else:", type: "conditional" },
        { id: 4, value: "for i in range(10):", type: "iteration" },
        { id: 5, value: "while count < 100:", type: "iteration" },
        { id: 6, value: "for item in my_list:", type: "iteration" },
        { id: 7, value: "break", type: "loop_control" },
        { id: 8, value: "continue", type: "loop_control" },
        { id: 9, value: "pass", type: "loop_control" },
        { id: 10, value: "try:", type: "exception" },
        { id: 11, value: "except ValueError:", type: "exception" },
        { id: 12, value: "finally:", type: "exception" },
        {
          id: 13,
          value: "with open('file.txt') as f:",
          type: "context_manager",
        },
        { id: 14, value: "def function_name():", type: "function_definition" },
        { id: 15, value: "return result", type: "function_definition" },
      ],
      categories: [
        {
          id: "conditional",
          name: "Conditional Statements",
          description: "if, elif, else - Make decisions",
        },
        {
          id: "iteration",
          name: "Loop Statements",
          description: "for, while - Repeat code",
        },
        {
          id: "loop_control",
          name: "Loop Control",
          description: "break, continue, pass - Control loop flow",
        },
        {
          id: "exception",
          name: "Exception Handling",
          description: "try, except, finally - Handle errors",
        },
        {
          id: "context_manager",
          name: "Context Managers",
          description: "with statements - Resource management",
        },
        {
          id: "function_definition",
          name: "Function Definition",
          description: "def, return - Create functions",
        },
      ],
    },
    settings: {
      timeLimit: 700,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 5,
  },

  // 6. List Methods and Operations
  {
    title: "Python List Methods Organizer",
    description:
      "Organize Python list methods by their functionality and behavior",
    activityType: "drag_drop",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 22,
    experienceReward: 50,
    estimatedMinutes: 18,
    tags: ["lists", "methods", "data-structures", "operations"],
    content: {
      instructions: "Drag each list method to its correct functional category",
      items: [
        { id: 1, value: "append(item)", type: "adding" },
        { id: 2, value: "insert(index, item)", type: "adding" },
        { id: 3, value: "extend(iterable)", type: "adding" },
        { id: 4, value: "remove(item)", type: "removing" },
        { id: 5, value: "pop(index)", type: "removing" },
        { id: 6, value: "clear()", type: "removing" },
        { id: 7, value: "del list[index]", type: "removing" },
        { id: 8, value: "sort()", type: "organizing" },
        { id: 9, value: "reverse()", type: "organizing" },
        { id: 10, value: "sorted(list)", type: "organizing" },
        { id: 11, value: "index(item)", type: "searching" },
        { id: 12, value: "count(item)", type: "searching" },
        { id: 13, value: "len(list)", type: "information" },
        { id: 14, value: "max(list)", type: "information" },
        { id: 15, value: "min(list)", type: "information" },
        { id: 16, value: "sum(list)", type: "information" },
        { id: 17, value: "copy()", type: "copying" },
        { id: 18, value: "list.copy()", type: "copying" },
        { id: 19, value: "list[:]", type: "copying" },
      ],
      categories: [
        {
          id: "adding",
          name: "Adding Elements",
          description: "Add items to the list",
        },
        {
          id: "removing",
          name: "Removing Elements",
          description: "Remove items from the list",
        },
        {
          id: "organizing",
          name: "Organizing",
          description: "Sort and arrange list elements",
        },
        {
          id: "searching",
          name: "Searching",
          description: "Find items in the list",
        },
        {
          id: "information",
          name: "Information",
          description: "Get data about the list",
        },
        {
          id: "copying",
          name: "Copying",
          description: "Create copies of the list",
        },
      ],
    },
    settings: {
      timeLimit: 800,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 6,
  },

  // 7. Function Components
  {
    title: "Python Function Components Builder",
    description:
      "Organize Python function components and understand their roles",
    activityType: "drag_drop",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 25,
    experienceReward: 55,
    estimatedMinutes: 20,
    tags: ["functions", "parameters", "arguments", "return-values"],
    content: {
      instructions:
        "Drag each function component to its correct category in function anatomy",
      items: [
        { id: 1, value: "def", type: "keyword" },
        { id: 2, value: "function_name", type: "identifier" },
        { id: 3, value: "()", type: "syntax" },
        { id: 4, value: ":", type: "syntax" },
        { id: 5, value: "parameter1", type: "parameter" },
        { id: 6, value: "parameter2=default", type: "parameter" },
        { id: 7, value: "*args", type: "parameter" },
        { id: 8, value: "**kwargs", type: "parameter" },
        { id: 9, value: "docstring", type: "documentation" },
        { id: 10, value: '"""Function description"""', type: "documentation" },
        { id: 11, value: "return value", type: "return_statement" },
        { id: 12, value: "return None", type: "return_statement" },
        { id: 13, value: "function_body", type: "implementation" },
        { id: 14, value: "local_variable = 5", type: "implementation" },
        { id: 15, value: "if condition:", type: "implementation" },
        { id: 16, value: "function_name(arg1, arg2)", type: "function_call" },
        { id: 17, value: "result = my_function()", type: "function_call" },
      ],
      categories: [
        {
          id: "keyword",
          name: "Keywords",
          description: "Reserved words that define function structure",
        },
        {
          id: "identifier",
          name: "Function Name",
          description: "The name used to identify and call the function",
        },
        {
          id: "syntax",
          name: "Syntax Elements",
          description: "Punctuation marks that structure the function",
        },
        {
          id: "parameter",
          name: "Parameters",
          description: "Variables that receive values when function is called",
        },
        {
          id: "documentation",
          name: "Documentation",
          description: "Comments and docstrings explaining the function",
        },
        {
          id: "return_statement",
          name: "Return Statements",
          description: "What the function sends back to caller",
        },
        {
          id: "implementation",
          name: "Function Body",
          description: "The actual code that does the work",
        },
        {
          id: "function_call",
          name: "Function Calls",
          description: "How to use and invoke the function",
        },
      ],
    },
    settings: {
      timeLimit: 900,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 7,
  },

  // DIFFICULTY 3 - INTERMEDIATE (3 activities)

  // 8. Dictionary Methods and Operations
  {
    title: "Advanced Dictionary Operations",
    description:
      "Master Python dictionary methods and their specific use cases",
    activityType: "drag_drop",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 28,
    experienceReward: 60,
    estimatedMinutes: 22,
    tags: ["dictionaries", "key-value", "methods", "advanced"],
    content: {
      instructions:
        "Categorize dictionary operations by their specific functionality and return behavior",
      items: [
        { id: 1, value: "dict.get(key)", type: "safe_access" },
        { id: 2, value: "dict.get(key, default)", type: "safe_access" },
        { id: 3, value: "dict.setdefault(key, default)", type: "safe_access" },
        { id: 4, value: "dict[key]", type: "direct_access" },
        { id: 5, value: "dict.keys()", type: "view_objects" },
        { id: 6, value: "dict.values()", type: "view_objects" },
        { id: 7, value: "dict.items()", type: "view_objects" },
        { id: 8, value: "dict.pop(key)", type: "removing_with_return" },
        {
          id: 9,
          value: "dict.pop(key, default)",
          type: "removing_with_return",
        },
        { id: 10, value: "dict.popitem()", type: "removing_with_return" },
        { id: 11, value: "del dict[key]", type: "removing_no_return" },
        { id: 12, value: "dict.clear()", type: "removing_no_return" },
        { id: 13, value: "dict.update(other_dict)", type: "modifying" },
        { id: 14, value: "dict[key] = value", type: "modifying" },
        { id: 15, value: "dict.copy()", type: "copying" },
        { id: 16, value: "dict.fromkeys(keys, value)", type: "creation" },
        { id: 17, value: "{k: v for k, v in items}", type: "creation" },
      ],
      categories: [
        {
          id: "safe_access",
          name: "Safe Access",
          description: "Access values without KeyError risk",
        },
        {
          id: "direct_access",
          name: "Direct Access",
          description: "Direct key access (may raise KeyError)",
        },
        {
          id: "view_objects",
          name: "View Objects",
          description: "Get dynamic views of dict contents",
        },
        {
          id: "removing_with_return",
          name: "Remove & Return",
          description: "Remove items and return their values",
        },
        {
          id: "removing_no_return",
          name: "Remove Only",
          description: "Remove items without returning values",
        },
        {
          id: "modifying",
          name: "Modifying",
          description: "Change or update dictionary contents",
        },
        {
          id: "copying",
          name: "Copying",
          description: "Create copies of dictionaries",
        },
        {
          id: "creation",
          name: "Creation Methods",
          description: "Create new dictionaries",
        },
      ],
    },
    settings: {
      timeLimit: 1000,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 8,
  },

  // 9. Exception Types and Handling
  {
    title: "Python Exception Handling Mastery",
    description: "Classify Python exceptions and error handling strategies",
    activityType: "drag_drop",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 25,
    tags: ["exceptions", "error-handling", "try-catch", "debugging"],
    content: {
      instructions:
        "Organize exception types and handling mechanisms by their categories and use cases",
      items: [
        { id: 1, value: "ValueError", type: "builtin_exceptions" },
        { id: 2, value: "TypeError", type: "builtin_exceptions" },
        { id: 3, value: "KeyError", type: "builtin_exceptions" },
        { id: 4, value: "IndexError", type: "builtin_exceptions" },
        { id: 5, value: "FileNotFoundError", type: "builtin_exceptions" },
        { id: 6, value: "ZeroDivisionError", type: "builtin_exceptions" },
        { id: 7, value: "NameError", type: "builtin_exceptions" },
        { id: 8, value: "AttributeError", type: "builtin_exceptions" },
        { id: 9, value: "try:", type: "handling_keywords" },
        { id: 10, value: "except:", type: "handling_keywords" },
        { id: 11, value: "finally:", type: "handling_keywords" },
        { id: 12, value: "else:", type: "handling_keywords" },
        { id: 13, value: "raise", type: "handling_keywords" },
        { id: 14, value: "except ValueError as e:", type: "specific_handling" },
        {
          id: 15,
          value: "except (TypeError, ValueError):",
          type: "specific_handling",
        },
        { id: 16, value: "except Exception as e:", type: "specific_handling" },
        { id: 17, value: "logging.error(str(e))", type: "error_reporting" },
        { id: 18, value: "print(f'Error: {e}')", type: "error_reporting" },
        { id: 19, value: "assert condition, 'message'", type: "prevention" },
        {
          id: 20,
          value: "if not condition: raise ValueError",
          type: "prevention",
        },
      ],
      categories: [
        {
          id: "builtin_exceptions",
          name: "Built-in Exceptions",
          description: "Standard Python exception types",
        },
        {
          id: "handling_keywords",
          name: "Handling Keywords",
          description: "Keywords for exception handling structure",
        },
        {
          id: "specific_handling",
          name: "Specific Catching",
          description: "Catch specific exception types",
        },
        {
          id: "error_reporting",
          name: "Error Reporting",
          description: "Display or log error information",
        },
        {
          id: "prevention",
          name: "Error Prevention",
          description: "Validate conditions to prevent errors",
        },
      ],
    },
    settings: {
      timeLimit: 1200,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 9,
  },

  // 10. Advanced Python Concepts
  {
    title: "Advanced Python Programming Concepts",
    description: "Classify advanced Python features and programming paradigms",
    activityType: "drag_drop",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 35,
    experienceReward: 70,
    estimatedMinutes: 28,
    tags: ["advanced", "comprehensions", "generators", "decorators", "lambda"],
    content: {
      instructions:
        "Organize advanced Python concepts by their programming paradigm and use case",
      items: [
        { id: 1, value: "[x**2 for x in range(10)]", type: "comprehensions" },
        { id: 2, value: "{x: x**2 for x in range(5)}", type: "comprehensions" },
        {
          id: 3,
          value: "{x for x in range(10) if x % 2 == 0}",
          type: "comprehensions",
        },
        { id: 4, value: "(x**2 for x in range(10))", type: "generators" },
        { id: 5, value: "yield value", type: "generators" },
        { id: 6, value: "next(generator)", type: "generators" },
        { id: 7, value: "lambda x: x**2", type: "functional" },
        { id: 8, value: "map(function, iterable)", type: "functional" },
        { id: 9, value: "filter(function, iterable)", type: "functional" },
        { id: 10, value: "reduce(function, iterable)", type: "functional" },
        { id: 11, value: "@decorator", type: "decorators" },
        { id: 12, value: "def decorator(func):", type: "decorators" },
        { id: 13, value: "functools.wraps(func)", type: "decorators" },
        { id: 14, value: "with open('file') as f:", type: "context_managers" },
        { id: 15, value: "__enter__(self)", type: "context_managers" },
        {
          id: 16,
          value: "__exit__(self, exc_type, exc_val, exc_tb)",
          type: "context_managers",
        },
        { id: 17, value: "*args", type: "unpacking" },
        { id: 18, value: "**kwargs", type: "unpacking" },
        { id: 19, value: "function(*list)", type: "unpacking" },
        { id: 20, value: "function(**dict)", type: "unpacking" },
      ],
      categories: [
        {
          id: "comprehensions",
          name: "Comprehensions",
          description: "Concise ways to create lists, dicts, sets",
        },
        {
          id: "generators",
          name: "Generators",
          description: "Memory-efficient iterators and lazy evaluation",
        },
        {
          id: "functional",
          name: "Functional Programming",
          description: "Lambda functions, map, filter, reduce",
        },
        {
          id: "decorators",
          name: "Decorators",
          description: "Modify or enhance function behavior",
        },
        {
          id: "context_managers",
          name: "Context Managers",
          description: "Resource management with 'with' statements",
        },
        {
          id: "unpacking",
          name: "Argument Unpacking",
          description: "Spread arguments from collections",
        },
      ],
    },
    settings: {
      timeLimit: 1400,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 10,
  },
];

export async function seedDragDropPythonFundamentalsActivities() {
  await seedActivitiesWithDuplicateCheck(
    dragDropPythonFundamentalsActivities,
    "Drag & Drop Python Fundamentals"
  );
}

// Execute the seeding function if this file is run directly
if (require.main === module) {
  seedDragDropPythonFundamentalsActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Drag & Drop Python Fundamentals activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
