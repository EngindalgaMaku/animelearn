import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type PFContent = {
  introduction: string;
  objectives?: string[];
  prerequisites?: string[];
  theory?: string;
  syntax: string;
  examples: string;
  bestPractices?: string[];
  pitfalls?: string[];
  cheatsheet?: string;
  references?: { label: string; url: string }[];
  quiz?: {
    title: string;
    timeLimit: number;
    passingScore: number;
    diamondReward: number;
    experienceReward: number;
    questions: {
      id: string;
      type: "multiple_choice" | "true_false";
      question: string;
      options?: string[];
      correctAnswer: string | boolean;
      explanation: string;
      points: number;
    }[];
  };
};

type PFSeed = {
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: 1 | 2 | 3;
  estimatedMinutes: number;
  diamondReward: number;
  experienceReward: number;
  sortOrder: number;
  content: PFContent;
  exercise: {
    hasCodeExercise: boolean;
    starterCode: string;
    solutionCode: string;
    hints: string[];
    testCases: { input: any[]; expectedOutput: string; description: string }[];
  };
};

const PF = "Python Fundamentals";

// Helpers
const fenced = (lang: string, code: string) => `\`\`\`${lang}
${code}
\`\`\``;

const pfLessons: PFSeed[] = [
  // PF-01
  {
    slug: "python-basics-first-program",
    title: "Python Basics & Your First Program",
    description:
      "Run Python, print output, add comments, and understand the execution model. Write clear, readable code from day one.",
    category: PF,
    difficulty: 1,
    estimatedMinutes: 25,
    diamondReward: 30,
    experienceReward: 80,
    sortOrder: 1,
    content: {
      introduction: [
        "# 🚀 Welcome to Python",
        "In this lesson you will:",
        "- Run Python code locally or online",
        "- Use print() and comments",
        "- Understand files vs REPL",
        "- Learn how to structure simple scripts",
      ].join("\n"),
      objectives: [
        "Run Python via REPL and script files",
        "Use print() to display values",
        "Write and read comments (#)",
        "Understand basic errors and how to fix them",
      ],
      prerequisites: [
        "Basic computer usage",
        "Terminal/Command Prompt familiarity (recommended)",
      ],
      theory: [
        "Python is an interpreted, high-level language focused on readability.",
        "Execution modes:",
        "- REPL (interactive shell) for quick experiments",
        "- Script files (.py) executed by the interpreter",
        "Core ideas:",
        "- Indentation, not braces, defines blocks",
        "- Batteries-included standard library",
        "- Cross-platform runtime (Windows, macOS, Linux)",
        "PEP 8 basics:",
        "- Use snake_case for variables and functions; 4-space indentation",
        "- Keep lines under ~79 chars; meaningful names",
        "Debugging & errors:",
        "- SyntaxError vs RuntimeError vs Logic bugs",
        "- Use print() or logging for quick inspection; use a debugger for step-through",
        "I/O basics:",
        "- print(value, ..., sep=' ', end='\\n') controls separators and line endings",
        "- input(prompt) returns str; cast to int/float where needed",
      ].join("\n"),
      syntax: [
        "Printing and comments:",
        fenced(
          "python",
          [
            "# Single-line comment",
            'print("Hello, World!")',
            "",
            'name = "Alex"',
            'print("Hi,", name)',
          ].join("\n")
        ),
      ].join("\n"),
      examples: [
        "Multi-line string and simple formatting:",
        fenced(
          "python",
          [
            'title = "Welcome"',
            'user = "Alex"',
            'message = f"{title}, {user}!"',
            "print(message)  # Welcome, Alex!",
          ].join("\n")
        ),
        "print() controls (sep, end):",
        fenced(
          "python",
          [
            'print("A", "B", "C", sep="-")   # A-B-C',
            'print("line", end="")',
            'print(" continues")             # line continues',
          ].join("\n")
        ),
        "Quick error demo & handling:",
        fenced(
          "python",
          [
            "try:",
            "    result = 10 / 0",
            "except ZeroDivisionError as e:",
            '    print("Cannot divide by zero:", e)',
          ].join("\n")
        ),
        "Simple debug trace:",
        fenced(
          "python",
          [
            'print("[DEBUG] starting computation")',
            "total = 0",
            "for i in range(5):",
            "    total += i",
            "print('[DEBUG] total =', total)",
          ].join("\n")
        ),
      ].join("\n"),
      bestPractices: [
        "Keep lines short and meaningful",
        "Use comments to explain why (not what)",
        "Prefer f-strings for formatting",
      ],
      pitfalls: [
        "Forgetting quotes around strings",
        "Mis-typed function names (e.g., pritn vs print)",
      ],
      cheatsheet: [
        "print(value1, value2, ...)",
        "# comment starts with #",
        'f"{var}" for formatted strings',
      ].join("\n"),
      references: [
        {
          label: "Official Docs: Tutorial",
          url: "https://docs.python.org/3/tutorial/",
        },
        {
          label: "Real Python: Print",
          url: "https://realpython.com/python-print/",
        },
      ],
      quiz: {
        title: "PF-01 Basics Quiz",
        timeLimit: 300,
        passingScore: 70,
        diamondReward: 10,
        experienceReward: 25,
        questions: [
          {
            id: "PF01Q1",
            type: "multiple_choice",
            question: "Which prints Hello, World! in Python?",
            options: [
              'echo "Hello, World!"',
              'printf("Hello, World!")',
              'print("Hello, World!")',
              "System.out.println(...)",
            ],
            correctAnswer: 'print("Hello, World!")',
            explanation: "Use print() in Python.",
            points: 5,
          },
          {
            id: "PF01Q2",
            type: "true_false",
            question: "Python uses indentation to define code blocks.",
            correctAnswer: true,
            explanation: "Indentation is syntactically significant in Python.",
            points: 5,
          },
          {
            id: "PF01Q3",
            type: "multiple_choice",
            question: "What starts a single-line comment?",
            options: ["//", "#", "--", "/* */"],
            correctAnswer: "#",
            explanation: "Use # for single-line comments.",
            points: 10,
          },
          {
            id: "PF01Q4",
            type: "true_false",
            question: "You must compile Python manually before running.",
            correctAnswer: false,
            explanation: "Python is interpreted.",
            points: 10,
          },
          {
            id: "PF01Q5",
            type: "multiple_choice",
            question: "Which reads a line of user input in Python?",
            options: ["scan()", "gets()", "read()", "input()"],
            correctAnswer: "input()",
            explanation: "Use input() to read a line from stdin as a string.",
            points: 10,
          },
          {
            id: "PF01Q6",
            type: "true_false",
            question: "Python source files typically use the .py extension.",
            correctAnswer: true,
            explanation:
              "Conventionally .py is used for Python modules/scripts.",
            points: 5,
          },
          {
            id: "PF01Q7",
            type: "multiple_choice",
            question: "Print without a trailing newline:",
            options: [
              'print("hello", end="")',
              'puts("hello")',
              'printline("hello")',
              'print("hello", newline=False)',
            ],
            correctAnswer: 'print("hello", end="")',
            explanation:
              "The end parameter controls the line ending in print().",
            points: 10,
          },
          {
            id: "PF01Q8",
            type: "true_false",
            question:
              "You can place a comment after code on the same line using #.",
            correctAnswer: true,
            explanation:
              "Anything following # on a line is ignored by the interpreter.",
            points: 5,
          },
        ],
      },
    },
    exercise: {
      hasCodeExercise: true,
      starterCode: [
        "# Implement a function that returns a personalized greeting.",
        "",
        "def greet(name: str, city: str) -> str:",
        "    # TODO: return: Hello, <name> from <city>!",
        "    # Use f-strings and strip whitespace of inputs",
        "    # Example: greet(' Alex ', '  Paris') -> 'Hello, Alex from Paris!'",
        "    pass",
        "",
        "# You can test locally:",
        "# print(greet('Alex', 'Paris'))",
      ].join("\n"),
      solutionCode: [
        "def greet(name: str, city: str) -> str:",
        "    n = (name or '').strip()",
        "    c = (city or '').strip()",
        '    return f"Hello, {n} from {c}!"',
        "",
        "# print(greet(' Alex ', '  Paris'))  # Hello, Alex from Paris!",
      ].join("\n"),
      hints: [
        'Use f-strings: f"Hello, {var}"',
        "Clean inputs using .strip()",
        "Return the string (do not print) so tests can compare output",
      ],
      testCases: [
        {
          input: ["Alex", "Paris"],
          expectedOutput: "Hello, Alex from Paris!",
          description: "Standard case",
        },
        {
          input: ["  Mina  ", "  Tokyo "],
          expectedOutput: "Hello, Mina from Tokyo!",
          description: "Trims whitespace",
        },
        {
          input: ["", "London"],
          expectedOutput: "Hello,  from London!",
          description: "Empty name handled",
        },
      ],
    },
  },

  // PF-02
  {
    slug: "variables-data-types",
    title: "Variables & Data Types",
    description:
      "Strings, integers, floats, booleans, casting and type checks. Learn naming conventions and dynamic typing.",
    category: PF,
    difficulty: 1,
    estimatedMinutes: 30,
    diamondReward: 30,
    experienceReward: 90,
    sortOrder: 2,
    content: {
      introduction: [
        "# 📦 Variables & Data Types",
        "Variables bind names to values; Python types are dynamic and inferred.",
      ].join("\n"),
      objectives: [
        "Declare and reassign variables",
        "Use str/int/float/bool types and cast between them",
        "Follow snake_case naming",
      ],
      prerequisites: ["PF-01 Basics"],
      theory: [
        "Python is dynamically typed: a name can point to different types over its lifetime.",
        "Key types: str, int, float, bool. Use type() and isinstance().",
        "Immutability vs mutability:",
        "- str, int, float, tuple are immutable; list, dict, set are mutable",
        "Conversions & pitfalls:",
        "- int('42') works; int('42.0') raises ValueError",
        "- float('nan') yields a NaN floating-point value",
        "Truthiness:",
        "- Falsy: False, 0, 0.0, '', [], {}, set(), None",
        "- Everything else is truthy",
      ].join("\n"),
      syntax: fenced(
        "python",
        [
          'name = "Alice"    # str',
          "age = 25         # int",
          "height = 1.72    # float",
          "is_member = True # bool",
          "",
          "age_str = str(age)",
          "score = float('19.5')",
          "print(type(age_str), type(score))",
        ].join("\n")
      ),
      examples: fenced(
        "python",
        [
          "# Casting and type checks",
          "age_str = '25'",
          "age = int(age_str)",
          "height = float('1.72')",
          "print(type(age), type(height))   # <class 'int'> <class 'float'>",
          "",
          "# Truthiness demo",
          "values = [0, 1, '', 'x', [], [1], None, True]",
          "for v in values:",
          "    print(v, '=>', bool(v))",
          "",
          "# Simple function using types",
          "def profile(name: str, age: int) -> str:",
          '    return f\"{name} is {age} years old\"',
          "print(profile('Mert', 23))",
          "",
          "# isinstance for safe branching:",
          "def normalize_to_str(x):",
          "    if isinstance(x, (int, float, bool)):",
          "        return str(x)",
          "    return x if isinstance(x, str) else str(x)",
        ].join("\n")
      ),
      bestPractices: [
        "Use descriptive names: total_price, user_count",
        "Prefer snake_case",
        "Cast explicitly when needed",
      ],
      pitfalls: [
        "Confusing int division and float (// vs /)",
        "Assuming input() returns numbers (it returns str)",
      ],
      cheatsheet: [
        "int(x), float(x), str(x), bool(x)",
        "type(x), isinstance(x, T)",
        "/ float division, // floor division",
      ].join("\n"),
      references: [
        {
          label: "Built-in Types",
          url: "https://docs.python.org/3/library/stdtypes.html",
        },
      ],
      quiz: {
        title: "PF-02 Variables & Types Quiz",
        timeLimit: 360,
        passingScore: 70,
        diamondReward: 10,
        experienceReward: 25,
        questions: [
          {
            id: "PF02Q1",
            type: "multiple_choice",
            question: "Which converts '42' to an integer?",
            options: [
              "toInt('42')",
              "int('42')",
              "Number('42')",
              "cast('42', int)",
            ],
            correctAnswer: "int('42')",
            explanation: "Use int() to parse integers.",
            points: 10,
          },
          {
            id: "PF02Q2",
            type: "true_false",
            question: "input() returns a string.",
            correctAnswer: true,
            explanation: "Always returns str.",
            points: 10,
          },
          {
            id: "PF02Q3",
            type: "multiple_choice",
            question: "Which literal is a float?",
            options: ["3", "3.0", "'3.0'", "True"],
            correctAnswer: "3.0",
            explanation: "3.0 is a float literal; '3.0' is a string.",
            points: 10,
          },
          {
            id: "PF02Q4",
            type: "multiple_choice",
            question: "Which value is falsy in Python?",
            options: ["0", "'0'", "[0]", "0.0001"],
            correctAnswer: "0",
            explanation:
              "Falsy values include 0, 0.0, '', [], {}, None, False.",
            points: 10,
          },
          {
            id: "PF02Q5",
            type: "multiple_choice",
            question: "What is the result of int(19.99)?",
            options: ["20", "19", "19.99", "Error"],
            correctAnswer: "19",
            explanation: "int() truncates toward zero for positive floats.",
            points: 10,
          },
          {
            id: "PF02Q6",
            type: "true_false",
            question: "isinstance('x', str) returns True.",
            correctAnswer: true,
            explanation: "The value 'x' is an instance of str.",
            points: 5,
          },
          {
            id: "PF02Q7",
            type: "multiple_choice",
            question: "Choose a snake_case variable name:",
            options: ["totalPrice", "TotalPrice", "total_price", "total-price"],
            correctAnswer: "total_price",
            explanation:
              "Use snake_case for variables and functions in Python.",
            points: 10,
          },
          {
            id: "PF02Q8",
            type: "true_false",
            question: "float('nan') returns a float representing NaN.",
            correctAnswer: true,
            explanation: "NaN is a valid floating value.",
            points: 10,
          },
          {
            id: "PF02Q9",
            type: "multiple_choice",
            question: "Which raises ValueError?",
            options: ["int('42')", "int('42.0')", "float('42.0')", "str(42)"],
            correctAnswer: "int('42.0')",
            explanation: "int() cannot parse '42.0' (with decimal point).",
            points: 10,
          },
          {
            id: "PF02Q10",
            type: "multiple_choice",
            question: "Which operator performs floor (integer) division?",
            options: ["/", "//", "%", "**"],
            correctAnswer: "//",
            explanation: "// is floor division; / is true division.",
            points: 10,
          },
        ],
      },
    },
    exercise: {
      hasCodeExercise: true,
      starterCode: [
        "# Build a small function that returns a profile summary string.",
        "# It must accept name(str), birth_year(int), current_year(int), and return:",
        '# \"<Name> is <age> years old\" (age computed).',
        "",
        "def build_profile(name: str, birth_year: int, current_year: int) -> str:",
        "    # TODO",
        "    pass",
      ].join("\n"),
      solutionCode: [
        "def build_profile(name: str, birth_year: int, current_year: int) -> str:",
        "    age = int(current_year) - int(birth_year)",
        '    return f"{name} is {age} years old"',
      ].join("\n"),
      hints: [
        "Compute age via subtraction",
        "Return a formatted string",
        "Ensure types are handled (cast if needed)",
      ],
      testCases: [
        {
          input: ["Alice", 2000, 2024],
          expectedOutput: "Alice is 24 years old",
          description: "Simple age calc",
        },
        {
          input: ["Bob", 1990, 2020],
          expectedOutput: "Bob is 30 years old",
          description: "Another case",
        },
      ],
    },
  },

  // PF-03
  {
    slug: "if-statements-decisions",
    title: "Control Flow: If/Elif/Else",
    description:
      "Make decisions with comparisons and logical operators. Structure clear, robust branching logic.",
    category: PF,
    difficulty: 1,
    estimatedMinutes: 30,
    diamondReward: 35,
    experienceReward: 95,
    sortOrder: 3,
    content: {
      introduction: [
        "# 🤔 Control Flow",
        "Use if/elif/else to select paths based on conditions.",
      ].join("\n"),
      objectives: [
        "Compare values with ==, !=, >, <, >=, <=",
        "Combine conditions with and/or/not",
        "Implement robust input validation",
      ],
      prerequisites: ["PF-02 Variables & Data Types"],
      theory: [
        "Boolean expressions evaluate to True/False.",
        "Use and/or/not to compose conditions.",
      ].join("\n"),
      syntax: fenced(
        "python",
        [
          "score = 85",
          "if score >= 90:",
          '    grade = "A"',
          "elif score >= 80:",
          '    grade = "B"',
          "else:",
          '    grade = "C"',
        ].join("\n")
      ),
      examples: fenced(
        "python",
        [
          "def discount(amount: float, is_member: bool) -> float:",
          "    if is_member and amount >= 100:",
          "        return 0.20",
          "    elif is_member:",
          "        return 0.10",
          "    elif amount >= 100:",
          "        return 0.05",
          "    else:",
          "        return 0.0",
        ].join("\n")
      ),
      bestPractices: [
        "Keep conditions simple and readable",
        "Extract complex logic into helper functions",
      ],
      pitfalls: ["Using assignment '=' instead of '==' in comparisons"],
      cheatsheet: [
        "and, or, not",
        "if/elif/else blocks",
        "Truthiness rules",
      ].join("\n"),
      references: [
        {
          label: "if Statements",
          url: "https://docs.python.org/3/tutorial/controlflow.html#if-statements",
        },
      ],
      quiz: {
        title: "PF-03 Control Flow Quiz",
        timeLimit: 360,
        passingScore: 70,
        diamondReward: 10,
        experienceReward: 25,
        questions: [
          {
            id: "PF03Q1",
            type: "multiple_choice",
            question: "What is the result of (True and False) or True?",
            options: ["True", "False", "None", "Error"],
            correctAnswer: "True",
            explanation:
              "and has precedence; (True and False) -> False; False or True -> True.",
            points: 10,
          },
          {
            id: "PF03Q2",
            type: "true_false",
            question: "elif can only be used once per if chain.",
            correctAnswer: false,
            explanation: "You can use multiple elif branches.",
            points: 10,
          },
          {
            id: "PF03Q3",
            type: "multiple_choice",
            question: "What is the result of not (True and False)?",
            options: ["True", "False"],
            correctAnswer: "True",
            explanation: "True and False is False; not False is True.",
            points: 10,
          },
          {
            id: "PF03Q4",
            type: "true_false",
            question: "'and' has higher precedence than 'or' in Python.",
            correctAnswer: true,
            explanation: "and binds tighter than or.",
            points: 10,
          },
          {
            id: "PF03Q5",
            type: "multiple_choice",
            question: "Given x = 5, which branch executes?",
            options: [
              "if x > 10: ...",
              "elif x > 7: ...",
              "elif x >= 5: ...",
              "else: ...",
            ],
            correctAnswer: "elif x >= 5: ...",
            explanation: "First true condition in order is x >= 5.",
            points: 10,
          },
          {
            id: "PF03Q6",
            type: "true_false",
            question:
              "Chained comparisons like 0 < x < 10 are valid in Python.",
            correctAnswer: true,
            explanation: "Chaining is supported and common.",
            points: 10,
          },
          {
            id: "PF03Q7",
            type: "multiple_choice",
            question: "Which condition checks that s contains only digits?",
            options: ["s == int(s)", "s.isdigit()", "int(s) > 0", "len(s) > 0"],
            correctAnswer: "s.isdigit()",
            explanation: "str.isdigit() returns True for strings of digits.",
            points: 10,
          },
          {
            id: "PF03Q8",
            type: "multiple_choice",
            question: "What does this print? if 0: print('A') else: print('B')",
            options: ["A", "B", "Error", "None"],
            correctAnswer: "B",
            explanation: "0 is falsy; else branch runs.",
            points: 10,
          },
          {
            id: "PF03Q9",
            type: "multiple_choice",
            question: "Which operator checks value equality?",
            options: ["is", "==", ":=", "==="],
            correctAnswer: "==",
            explanation: "is checks identity; == checks value equality.",
            points: 10,
          },
          {
            id: "PF03Q10",
            type: "multiple_choice",
            question:
              "For amount=120, is_member=False, what discount does the example apply?",
            options: ["20%", "10%", "5%", "0%"],
            correctAnswer: "5%",
            explanation: "Non-member with amount>=100 => 5%.",
            points: 10,
          },
        ],
      },
    },
    exercise: {
      hasCodeExercise: true,
      starterCode: [
        "# Implement a discount calculator:",
        "# Input: subtotal (float), is_member (bool)",
        "# Returns a final price after applying:",
        "# - Member & subtotal>=100: 20% off",
        "# - Member only: 10% off",
        "# - Non-member & subtotal>=100: 5% off",
        "# - Otherwise: no discount",
        "",
        "def final_price(subtotal: float, is_member: bool) -> float:",
        "    # TODO",
        "    pass",
      ].join("\n"),
      solutionCode: [
        "def final_price(subtotal: float, is_member: bool) -> float:",
        "    if is_member and subtotal >= 100:",
        "        return round(subtotal * 0.80, 2)",
        "    elif is_member:",
        "        return round(subtotal * 0.90, 2)",
        "    elif subtotal >= 100:",
        "        return round(subtotal * 0.95, 2)",
        "    else:",
        "        return round(subtotal, 2)",
      ].join("\n"),
      hints: ["Follow the rule order", "Round to 2 decimals for consistency"],
      testCases: [
        {
          input: [120, true],
          expectedOutput: "96.0",
          description: "Member + large subtotal",
        },
        { input: [80, true], expectedOutput: "72.0", description: "Member" },
        {
          input: [150, false],
          expectedOutput: "142.5",
          description: "Non-member large subtotal",
        },
        {
          input: [50, false],
          expectedOutput: "50.0",
          description: "No discount",
        },
      ],
    },
  },

  // PF-04
  {
    slug: "loops-repetition",
    title: "Loops: Repetition with for/while",
    description:
      "Iterate over ranges and collections; control loops with break/continue; compute aggregates safely.",
    category: PF,
    difficulty: 1,
    estimatedMinutes: 35,
    diamondReward: 35,
    experienceReward: 100,
    sortOrder: 4,
    content: {
      introduction: [
        "# 🔄 Loops & Iteration",
        "Use for to iterate sequences, while for conditional repetition.",
      ].join("\n"),
      objectives: [
        "Use range(), enumerate(), and iteration over collections",
        "Break and continue wisely",
        "Compute aggregates and counters",
      ],
      prerequisites: ["PF-03 Control Flow"],
      theory:
        "for iterates over iterables; while repeats until condition is False.",
      syntax: fenced(
        "python",
        [
          "for i in range(5):",
          "    print(i)",
          "",
          "count = 3",
          "while count > 0:",
          "    count -= 1",
        ].join("\n")
      ),
      examples: fenced(
        "python",
        [
          "def count_vowels(s: str) -> int:",
          "    vowels = set('aeiouAEIOU')",
          "    total = 0",
          "    for ch in s:",
          "        if ch in vowels:",
          "            total += 1",
          "    return total",
        ].join("\n")
      ),
      bestPractices: [
        "Prefer for over while when possible",
        "Keep loop bodies small",
      ],
      pitfalls: [
        "Forgetting to update the while condition",
        "Modifying lists while iterating",
      ],
      cheatsheet: [
        "range(n), range(a,b,step)",
        "enumerate(iterable) -> (index, value)",
      ].join("\n"),
      references: [
        {
          label: "for Statements",
          url: "https://docs.python.org/3/tutorial/controlflow.html#for-statements",
        },
      ],
      quiz: {
        title: "PF-04 Loops Quiz",
        timeLimit: 360,
        passingScore: 70,
        diamondReward: 10,
        experienceReward: 25,
        questions: [
          {
            id: "PF04Q1",
            type: "true_false",
            question: "break exits the nearest enclosing loop.",
            correctAnswer: true,
            explanation: "break stops the closest loop.",
            points: 10,
          },
          {
            id: "PF04Q2",
            type: "multiple_choice",
            question: "Which produces 0,2,4?",
            options: [
              "range(3)",
              "range(0,3)",
              "range(0,5,2)",
              "range(2,0, -1)",
            ],
            correctAnswer: "range(0,5,2)",
            explanation: "Step of 2 from 0 to less than 5.",
            points: 10,
          },
          {
            id: "PF04Q3",
            type: "true_false",
            question:
              "continue skips the rest of the loop body and proceeds to the next iteration.",
            correctAnswer: true,
            explanation: "continue jumps to the next iteration of the loop.",
            points: 10,
          },
          {
            id: "PF04Q4",
            type: "multiple_choice",
            question:
              "What does enumerate(['a','b']) yield on first iteration?",
            options: ["('a', 0)", "(1, 'a')", "(0, 'a')", "('b', 0)"],
            correctAnswer: "(0, 'a')",
            explanation: "enumerate yields (index, value) starting at 0.",
            points: 10,
          },
          {
            id: "PF04Q5",
            type: "multiple_choice",
            question: "Output of: for i in range(1,4): print(i)",
            options: ["0 1 2", "1 2 3", "1 2 3 4", "2 3 4"],
            correctAnswer: "1 2 3",
            explanation: "range(1,4) yields 1,2,3.",
            points: 10,
          },
          {
            id: "PF04Q6",
            type: "multiple_choice",
            question:
              "What is sum after this loop?\n\nsum=0\nfor i in [1,2,3,4,5]: sum+=i",
            options: ["10", "12", "14", "15"],
            correctAnswer: "15",
            explanation: "Sum of 1..5 is 15.",
            points: 10,
          },
          {
            id: "PF04Q7",
            type: "true_false",
            question:
              "A while loop can run forever if its condition never becomes False.",
            correctAnswer: true,
            explanation:
              "Always ensure termination conditions move toward False.",
            points: 10,
          },
          {
            id: "PF04Q8",
            type: "multiple_choice",
            question:
              "Looping a string 'abc' with for ch in 'abc': print(ch) prints:",
            options: ["abc", "a b c", "a\\nb\\nc", "['a','b','c']"],
            correctAnswer: "a\nb\nc",
            explanation: "Strings are iterable by character.",
            points: 10,
          },
          {
            id: "PF04Q9",
            type: "true_false",
            question:
              "List comprehensions are often faster than manual for + append loops.",
            correctAnswer: true,
            explanation: "They are optimized and run in C for the iteration.",
            points: 10,
          },
          {
            id: "PF04Q10",
            type: "multiple_choice",
            question: "Which breaks out of the loop immediately?",
            options: ["pass", "stop", "continue", "break"],
            correctAnswer: "break",
            explanation:
              "continue skips to next iteration; break exits the loop.",
            points: 10,
          },
        ],
      },
    },
    exercise: {
      hasCodeExercise: true,
      starterCode: [
        "# Build a text analyzer that counts vowels, consonants, digits and spaces.",
        "",
        "def analyze(text: str) -> str:",
        "    # Return a summary: 'vowels=<v>, consonants=<c>, digits=<d>, spaces=<s>'",
        "    # Consider only ASCII letters for consonants and vowels.",
        "    pass",
      ].join("\n"),
      solutionCode: [
        "def analyze(text: str) -> str:",
        "    vowels_set = set('aeiouAEIOU')",
        "    letters = set('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')",
        "    v = c = d = s = 0",
        "    for ch in (text or ''):",
        "        if ch in vowels_set:",
        "            v += 1",
        "        elif ch in letters:",
        "            c += 1",
        "        elif ch.isdigit():",
        "            d += 1",
        "        elif ch.isspace():",
        "            s += 1",
        '    return f"vowels={v}, consonants={c}, digits={d}, spaces={s}"',
      ].join("\n"),
      hints: [
        "Use sets for fast membership tests",
        "str.isdigit() and str.isspace() are handy",
      ],
      testCases: [
        {
          input: ["Hello 2025"],
          expectedOutput: "vowels=2, consonants=3, digits=4, spaces=1",
          description: "Mixed text",
        },
        {
          input: ["a e i o u"],
          expectedOutput: "vowels=5, consonants=0, digits=0, spaces=4",
          description: "All vowels",
        },
      ],
    },
  },

  // PF-05
  {
    slug: "functions-basics",
    title: "Functions: Parameters, Returns, Scope",
    description:
      "Package logic into reusable functions, pass arguments, return values, and document behavior.",
    category: PF,
    difficulty: 1,
    estimatedMinutes: 35,
    diamondReward: 40,
    experienceReward: 110,
    sortOrder: 5,
    content: {
      introduction: [
        "# 🔧 Functions",
        "Functions are named blocks of code with inputs (parameters) and outputs (return values).",
      ].join("\n"),
      objectives: [
        "Define functions with def",
        "Use parameters (positional/default) and return values",
        "Write docstrings and simple tests",
      ],
      prerequisites: ["PF-04 Loops"],
      theory:
        "Functions encapsulate behavior and help you write DRY (Don't Repeat Yourself) code.",
      syntax: fenced(
        "python",
        [
          "def add(a, b):",
          '    """Return the sum of a and b."""',
          "    return a + b",
        ].join("\n")
      ),
      examples: fenced(
        "python",
        [
          "def mean(xs):",
          "    return sum(xs) / len(xs) if xs else 0.0",
          "",
          "print(mean([1,2,3]))",
        ].join("\n")
      ),
      bestPractices: [
        "Keep functions short and focused",
        "Use docstrings to document behavior",
        "Return values instead of printing when testing",
      ],
      pitfalls: [
        "Mutating default arguments (use None and initialize inside)",
        "Returning None implicitly when forgetting return",
      ],
      cheatsheet: [
        "def name(params): ...",
        "return value",
        '"""Docstring"""',
      ].join("\n"),
      references: [
        {
          label: "Defining Functions",
          url: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions",
        },
      ],
      quiz: {
        title: "PF-05 Functions Quiz",
        timeLimit: 420,
        passingScore: 70,
        diamondReward: 10,
        experienceReward: 30,
        questions: [
          {
            id: "PF05Q1",
            type: "multiple_choice",
            question:
              "What does a function return by default when no return is specified?",
            options: ["0", "False", "None", "''"],
            correctAnswer: "None",
            explanation: "Python functions return None implicitly.",
            points: 10,
          },
          {
            id: "PF05Q2",
            type: "true_false",
            question:
              "Default arguments should not be mutable unless you know what you're doing.",
            correctAnswer: true,
            explanation: "Mutable defaults persist across calls.",
            points: 10,
          },
          {
            id: "PF05Q3",
            type: "multiple_choice",
            question: "Which is a proper docstring?",
            options: [
              "# Adds numbers",
              "/* Adds numbers */",
              '"""Add numbers and return the sum."""',
              "// Adds numbers",
            ],
            correctAnswer: '"""Add numbers and return the sum."""',
            explanation: "Triple-quoted string immediately under def.",
            points: 10,
          },
          {
            id: "PF05Q4",
            type: "true_false",
            question:
              "A function can return multiple values by returning a tuple.",
            correctAnswer: true,
            explanation:
              "Tuple packing/unpacking supports multi-value returns.",
            points: 10,
          },
          {
            id: "PF05Q5",
            type: "multiple_choice",
            question: "Choose a function with a default parameter:",
            options: [
              "def greet(name, title): ...",
              "def greet(name, title='Mr./Ms.'): ...",
              "def greet(name='Mr./Ms.', title): ...",
              "def greet(name: str, title: str) -> None",
            ],
            correctAnswer: "def greet(name, title='Mr./Ms.'): ...",
            explanation: "Defaults must come after non-default parameters.",
            points: 10,
          },
          {
            id: "PF05Q6",
            type: "true_false",
            question: "return immediately exits the function.",
            correctAnswer: true,
            explanation: "Execution continues after the call site.",
            points: 10,
          },
          {
            id: "PF05Q7",
            type: "multiple_choice",
            question: "Which is the recommended pattern for mutable defaults?",
            options: [
              "def add_item(x, items=[]): ...",
              "def add_item(x, items=list()): ...",
              "def add_item(x, items=None):\n    if items is None:\n        items = []\n    ...",
              "def add_item(*, items=[]): ...",
            ],
            correctAnswer:
              "def add_item(x, items=None):\n    if items is None:\n        items = []\n    ...",
            explanation: "Use None sentinel and initialize inside.",
            points: 15,
          },
          {
            id: "PF05Q8",
            type: "multiple_choice",
            question: "Given def add(a,b=1): which calls are valid?",
            options: ["add()", "add(5)", "add(a=1,b=2,3)", "add(1,2,3)"],
            correctAnswer: "add(5)",
            explanation: "b has default; add() lacks a; extra args error.",
            points: 10,
          },
          {
            id: "PF05Q9",
            type: "true_false",
            question: "Functions are first-class objects in Python.",
            correctAnswer: true,
            explanation: "They can be passed, stored, and returned.",
            points: 10,
          },
          {
            id: "PF05Q10",
            type: "multiple_choice",
            question: "Where should a function docstring be placed?",
            options: [
              "Above the def line",
              "Immediately after the def line as a triple-quoted string",
              "At the end of the file",
              "Anywhere in the file",
            ],
            correctAnswer:
              "Immediately after the def line as a triple-quoted string",
            explanation:
              "PEP 257 recommends immediate placement under the def.",
            points: 10,
          },
          {
            id: "PF05Q11",
            type: "multiple_choice",
            question: "Which demonstrates keyword arguments?",
            options: [
              "area(5, 10)",
              "area(width=5, height=10)",
              "area(height width)",
              "area(5; 10)",
            ],
            correctAnswer: "area(width=5, height=10)",
            explanation:
              "Keyword args improve readability and order-independence.",
            points: 10,
          },
          {
            id: "PF05Q12",
            type: "multiple_choice",
            question:
              "What is the output?\n\ndef f():\n    x = 'inner'\n    return x\n\nx = 'outer'\nprint(f(), x)",
            options: [
              "inner inner",
              "outer outer",
              "inner outer",
              "outer inner",
            ],
            correctAnswer: "inner outer",
            explanation: "Local x shadows global inside the function.",
            points: 10,
          },
        ],
      },
    },
    exercise: {
      hasCodeExercise: true,
      starterCode: [
        "# Build a tiny utilities library with 3 functions:",
        "# 1) is_even(n) -> bool",
        "# 2) word_count(s) -> int  (number of words split by whitespace)",
        "# 3) join_csv(items) -> str (join list of values with commas as strings)",
        "",
        "def is_even(n: int) -> bool:",
        "    pass",
        "",
        "def word_count(s: str) -> int:",
        "    pass",
        "",
        "def join_csv(items) -> str:",
        "    pass",
      ].join("\n"),
      solutionCode: [
        "def is_even(n: int) -> bool:",
        "    return (n % 2) == 0",
        "",
        "def word_count(s: str) -> int:",
        "    if not s:",
        "        return 0",
        "    return len([w for w in s.split() if w])",
        "",
        "def join_csv(items) -> str:",
        '    return ",".join(str(x) for x in (items or []))',
      ].join("\n"),
      hints: [
        "Use modulo for even/odd",
        "str.split() splits on whitespace by default",
        "Convert items to str before joining",
      ],
      testCases: [
        { input: ["is_even", 10], expectedOutput: "True", description: "even" },
        { input: ["is_even", 7], expectedOutput: "False", description: "odd" },
        {
          input: ["word_count", "one two  three"],
          expectedOutput: "3",
          description: "counts words",
        },
        {
          input: ["join_csv", [1, "a", 3]],
          expectedOutput: "1,a,3",
          description: "joins values",
        },
      ],
    },
  },
  // PF-06
  {
    slug: "lists-collections",
    title: "Lists: Operations, Slicing, Comprehensions",
    description:
      "Create and manipulate lists: indexing, slicing, methods (append, extend, insert, remove, pop, sort), copying vs aliasing, and list comprehensions.",
    category: PF,
    difficulty: 1,
    estimatedMinutes: 35,
    diamondReward: 40,
    experienceReward: 120,
    sortOrder: 6,
    content: {
      introduction: [
        "# 📋 Lists & Collections",
        "Lists are ordered, mutable sequences. You’ll learn core operations and patterns for productive use.",
      ].join("\n"),
      objectives: [
        "Create lists and access elements by index and slice",
        "Add/remove items with append, extend, insert, remove, pop, clear",
        "Use list slicing and copies safely (avoid aliasing bugs)",
        "Process lists with loops and enumerate",
        "Use list comprehensions to transform/filter data",
        "Sort lists with sort() and sorted(), with keys and reverse",
      ],
      prerequisites: ["PF-05 Functions"],
      theory: [
        "Lists are dynamic arrays that keep insertion order and allow duplicates.",
        "Indexing uses 0-based indices and supports negative indices.",
        "Slicing returns a shallow copy: xs[a:b:c].",
        "append(x) adds one item; extend(iterable) concatenates many.",
        "remove(x) deletes first occurrence; pop(i) removes and returns by index.",
        "Copying matters: ys = xs creates an alias; use xs.copy() or xs[:] for a shallow copy.",
        "sort() sorts in place and returns None; sorted(xs) returns a new list.",
      ].join("\n"),
      syntax: fenced(
        "python",
        [
          "nums = [1, 3, 5]",
          "nums.append(7)          # [1, 3, 5, 7]",
          "nums.extend([9, 11])    # [1, 3, 5, 7, 9, 11]",
          "first = nums[0]         # 1",
          "tail = nums[1:]         # [3, 5, 7, 9, 11]",
          "nums.insert(1, 2)       # [1, 2, 3, 5, 7, 9, 11]",
          "nums.remove(5)          # removes first 5",
          "val = nums.pop()        # removes last element",
          "copy1 = nums[:]         # shallow copy",
          "copy2 = nums.copy()     # shallow copy",
          "nums.sort(reverse=True) # in-place sort",
          "sorted_nums = sorted(nums)  # new list",
        ].join("\n")
      ),
      examples: [
        "Enumerate for index + value:",
        fenced(
          "python",
          [
            "names = ['ada', 'grace', 'guido']",
            "for i, name in enumerate(names, start=1):",
            "    print(i, name.title())",
          ].join("\n")
        ),
        "Filtering & transforming with comprehensions:",
        fenced(
          "python",
          [
            "xs = [1, 2, 3, 4, 5, 6]",
            "evens = [x for x in xs if x % 2 == 0]",
            "squares = [x*x for x in xs]",
            "pairs = [(x, x*x) for x in xs if x % 2 == 1]",
          ].join("\n")
        ),
        "Safe copying vs aliasing:",
        fenced(
          "python",
          [
            "a = [1, 2, 3]",
            "b = a          # alias; both refer to same list",
            "c = a[:]       # copy; changes to c won't affect a",
            "b.append(4)",
            "print(a)  # [1,2,3,4]",
            "print(c)  # [1,2,3]",
          ].join("\n")
        ),
      ].join("\n"),
      bestPractices: [
        "Prefer list comprehensions for simple transforms/filters",
        "Use enumerate() instead of manual index counters",
        "Avoid mutating a list while iterating over it; iterate over a copy instead",
        "Be explicit about copying when passing lists to functions",
      ],
      pitfalls: [
        "Confusing append() vs extend()",
        "Using a mutable default argument like def f(xs=[]): ...",
        "Assuming ys = xs copies; it aliases instead",
        "Forgetting that sort() returns None",
      ],
      cheatsheet: [
        "append(x), extend(iter), insert(i, x)",
        "remove(x), pop([i]), clear()",
        "copy(), slicing [:], list(iterable)",
        "sort(key=None, reverse=False), sorted(iterable, key=None, reverse=False)",
        "enumerate(iterable, start=0)",
        "list comprehension: [expr for x in xs if cond]",
      ].join("\n"),
      references: [
        {
          label: "Official Docs: Lists",
          url: "https://docs.python.org/3/tutorial/datastructures.html#more-on-lists",
        },
      ],
      quiz: {
        title: "PF-06 Lists Quiz",
        timeLimit: 420,
        passingScore: 70,
        diamondReward: 10,
        experienceReward: 30,
        questions: [
          {
            id: "PF06Q1",
            type: "multiple_choice",
            question: "What does nums.append([4,5]) do to nums=[1,2,3]?",
            options: [
              "[1,2,3,4,5]",
              "[1,2,3,[4,5]]",
              "[[1,2,3],[4,5]]",
              "[1,2,3] (no change)",
            ],
            correctAnswer: "[1,2,3,[4,5]]",
            explanation: "append adds a single item (the list itself).",
            points: 10,
          },
          {
            id: "PF06Q2",
            type: "multiple_choice",
            question: "Which call concatenates items 4 and 5 into the list?",
            options: [
              "nums.extend([4,5])",
              "nums.append(4,5)",
              "nums.add(4,5)",
              "nums.insert([4,5])",
            ],
            correctAnswer: "nums.extend([4,5])",
            explanation:
              "extend iterates the argument and appends each element.",
            points: 10,
          },
          {
            id: "PF06Q3",
            type: "true_false",
            question: "Slicing like xs[:] returns a shallow copy.",
            correctAnswer: true,
            explanation: "xs[:] creates a new list with the same elements.",
            points: 10,
          },
          {
            id: "PF06Q4",
            type: "multiple_choice",
            question: "Given xs=[1,2,3,4,5], what is xs[1:4]?",
            options: ["[1,2,3,4]", "[2,3,4]", "[2,3,4,5]", "[1,2,3]"],
            correctAnswer: "[2,3,4]",
            explanation: "Start inclusive, end exclusive.",
            points: 10,
          },
          {
            id: "PF06Q5",
            type: "true_false",
            question: "sorted(xs) sorts xs in place and returns None.",
            correctAnswer: false,
            explanation:
              "sorted() returns a new list; list.sort() sorts in place.",
            points: 10,
          },
          {
            id: "PF06Q6",
            type: "multiple_choice",
            question: "Which removes and returns the last element?",
            options: ["remove()", "pop()", "delete()", "take()"],
            correctAnswer: "pop()",
            explanation: "pop() optionally takes an index; default is last.",
            points: 10,
          },
          {
            id: "PF06Q7",
            type: "multiple_choice",
            question:
              "Which is a correct list comprehension for squares of evens in xs?",
            options: [
              "[x*x if x%2==0 in xs]",
              "[x*x for x in xs if x%2==0]",
              "for x in xs: if x%2==0: x*x",
              "[x^2 : x in xs where x%2==0]",
            ],
            correctAnswer: "[x*x for x in xs if x%2==0]",
            explanation: "Syntax is [expr for x in xs if cond].",
            points: 10,
          },
          {
            id: "PF06Q8",
            type: "true_false",
            question: "Using enumerate(xs) yields (index, value) pairs.",
            correctAnswer: true,
            explanation: "enumerate returns tuples of (i, x).",
            points: 10,
          },
          {
            id: "PF06Q9",
            type: "multiple_choice",
            question: "Given a=[1,2], b=a, which statement is true?",
            options: [
              "a and b are independent copies",
              "b is an alias; a change to b affects a",
              "b is a deep copy of a",
              "b equals a but is not the same object",
            ],
            correctAnswer: "b is an alias; a change to b affects a",
            explanation: "Assignment copies the reference, not the list.",
            points: 10,
          },
          {
            id: "PF06Q10",
            type: "true_false",
            question: "list.sort() returns the sorted list.",
            correctAnswer: false,
            explanation: "It sorts in place and returns None.",
            points: 10,
          },
          {
            id: "PF06Q11",
            type: "multiple_choice",
            question: "How to remove the first occurrence of 3 from xs?",
            options: ["xs.pop(3)", "xs.remove(3)", "del xs(3)", "xs.delete(3)"],
            correctAnswer: "xs.remove(3)",
            explanation: "remove(value) deletes first matching value.",
            points: 10,
          },
          {
            id: "PF06Q12",
            type: "multiple_choice",
            question: "What does [0]*3 produce?",
            options: ["[0,0,0]", "[[0],[0],[0]]", "[0]*[0,0,0]", "[0,0]"],
            correctAnswer: "[0,0,0]",
            explanation: "It repeats the single element 3 times.",
            points: 10,
          },
        ],
      },
    },
    exercise: {
      hasCodeExercise: true,
      starterCode: [
        "# Compute list statistics string:",
        "# 'min=&lt;m&gt;, max=&lt;M&gt;, sum=&lt;S&gt;, avg=&lt;A&gt;' where avg has 2 decimals.",
        "# If the list is empty, return: 'min=0, max=0, sum=0, avg=0.00'",
        "",
        "def list_stats(nums) -> str:",
        '    """Return a summary string for the list numbers."""',
        "    # TODO: implement using min(), max(), sum()",
        "    # Hint: handle empty list carefully to avoid ValueError from min/max",
        "    pass",
      ].join("\n"),
      solutionCode: [
        "def list_stats(nums) -> str:",
        "    xs = list(nums or [])",
        "    if not xs:",
        '        return "min=0, max=0, sum=0, avg=0.00"',
        "    m = min(xs)",
        "    M = max(xs)",
        "    S = sum(xs)",
        "    A = S / len(xs)",
        '    return f"min={m}, max={M}, sum={S}, avg={A:.2f}"',
      ].join("\n"),
      hints: [
        "min(), max(), sum() are built-ins",
        "Watch out for empty lists: decide a reasonable default",
        "Use f-strings and format average with :.2f",
      ],
      testCases: [
        {
          input: [[1, 2, 3]],
          expectedOutput: "min=1, max=3, sum=6, avg=2.00",
          description: "Basic ascending",
        },
        {
          input: [[10, -2, 4, 4]],
          expectedOutput: "min=-2, max=10, sum=16, avg=4.00",
          description: "Mixed values with duplicate",
        },
        {
          input: [[5]],
          expectedOutput: "min=5, max=5, sum=5, avg=5.00",
          description: "Single element",
        },
        {
          input: [[]],
          expectedOutput: "min=0, max=0, sum=0, avg=0.00",
          description: "Empty list",
        },
      ],
    },
  },
  // PF-07
  {
    slug: "dictionaries-key-value",
    title: "Dictionaries & Key-Value Data",
    description:
      "Use dicts to map keys to values; add, update, remove, and iterate over items; understand common methods and best practices.",
    category: PF,
    difficulty: 1,
    estimatedMinutes: 30,
    diamondReward: 35,
    experienceReward: 100,
    sortOrder: 7,
    content: {
      introduction: [
        "# 🗂️ Dictionaries",
        "Dictionaries store mappings from keys to values. Keys are usually strings or numbers; values can be any type.",
      ].join("\n"),
      objectives: [
        "Create and manipulate dictionaries",
        "Use common methods: get, update, pop, items, keys, values",
        "Handle missing keys safely with get and default values",
      ],
      prerequisites: ["PF-06 Lists"],
      theory: [
        "A dictionary is an unordered mapping of key -> value pairs (insertion order is preserved in Python 3.7+).",
        "Common patterns include counting, grouping, and lookup tables.",
        "Use .get(key, default) to avoid KeyError for missing keys.",
      ].join("\n"),
      syntax: fenced(
        "python",
        [
          "student = {'name': 'Alice', 'age': 20}",
          "student['grade'] = 'A'",
          "age = student.get('age', 0)",
          "if 'name' in student:",
          "    print(student['name'])",
          "for k, v in student.items():",
          "    print(k, v)",
        ].join("\n")
      ),
      examples: [
        "Counting occurrences with dict:",
        fenced(
          "python",
          [
            "words = ['a', 'b', 'a', 'c', 'b']",
            "counts = {}",
            "for w in words:",
            "    counts[w] = counts.get(w, 0) + 1",
            "print(counts)  # {'a': 2, 'b': 2, 'c': 1}",
          ].join("\n")
        ),
        "Merging dictionaries safely:",
        fenced(
          "python",
          [
            "a = {'x': 1, 'y': 2}",
            "b = {'y': 99, 'z': 3}",
            "merged = {**a, **b}  # {'x':1,'y':99,'z':3}",
            "print(merged)",
          ].join("\n")
        ),
      ].join("\n"),
      bestPractices: [
        "Use .get() to avoid KeyError",
        "Use dict comprehensions for clean transforms",
        "Avoid mutating dicts while iterating; collect changes then apply",
      ],
      pitfalls: [
        "Relying on KeyError when a default value is suitable",
        "Confusing update semantics when keys overlap",
      ],
      cheatsheet: [
        "d[key] = value, d.get(key, default), key in d",
        "d.items(), d.keys(), d.values()",
        "d.pop(key, default), d.update(other)",
        "{k: f(v) for k,v in d.items()}",
      ].join("\n"),
      references: [
        {
          label: "Official Docs: dict",
          url: "https://docs.python.org/3/library/stdtypes.html#dict",
        },
      ],
      quiz: {
        title: "PF-07 Dictionaries Quiz",
        timeLimit: 360,
        passingScore: 70,
        diamondReward: 10,
        experienceReward: 25,
        questions: [
          {
            id: "PF07Q1",
            type: "multiple_choice",
            question: "Which checks if a key exists in a dict?",
            options: ["d.has(k)", "k in d", "d.contains(k)", "exists(d,k)"],
            correctAnswer: "k in d",
            explanation: "Use the 'in' operator to check key membership.",
            points: 10,
          },
          {
            id: "PF07Q2",
            type: "multiple_choice",
            question: "Which safely fetches a missing key with default?",
            options: ["d.fetch(k,0)", "d.get(k,0)", "d[k,0]", "d[k] or 0"],
            correctAnswer: "d.get(k,0)",
            explanation: "get returns default if key missing.",
            points: 10,
          },
          {
            id: "PF07Q3",
            type: "true_false",
            question: "d.items() returns key-value pairs.",
            correctAnswer: true,
            explanation: "items() yields (key, value) tuples.",
            points: 10,
          },
          {
            id: "PF07Q4",
            type: "multiple_choice",
            question: "Best way to merge dicts (Python 3.9+)?",
            options: ["d1 + d2", "d1 | d2", "merge(d1,d2)", "concat(d1,d2)"],
            correctAnswer: "d1 | d2",
            explanation: "The | operator merges dictionaries from Python 3.9.",
            points: 10,
          },
          {
            id: "PF07Q5",
            type: "true_false",
            question: "Dictionaries preserve insertion order in Python 3.7+.",
            correctAnswer: true,
            explanation: "Order is preserved as an implementation detail.",
            points: 10,
          },
          {
            id: "PF07Q6",
            type: "multiple_choice",
            question: "Which removes a key if present and returns its value?",
            options: ["d.remove(k)", "d.pop(k)", "d.take(k)", "del d(k)"],
            correctAnswer: "d.pop(k)",
            explanation: "pop removes the key and returns its value.",
            points: 10,
          },
          {
            id: "PF07Q7",
            type: "multiple_choice",
            question: "Counting occurrences uses which pattern?",
            options: [
              "d[k]++",
              "d[k]+=1 if k in d else 1",
              "d.get(k,0)+=1",
              "count(d,k)",
            ],
            correctAnswer: "d[k]+=1 if k in d else 1",
            explanation: "Or d[k] = d.get(k,0)+1 inside a loop.",
            points: 10,
          },
          {
            id: "PF07Q8",
            type: "true_false",
            question: "Keys in dict can be lists.",
            correctAnswer: false,
            explanation:
              "Keys must be hashable; lists are mutable and not hashable.",
            points: 10,
          },
        ],
      },
    },
    exercise: {
      hasCodeExercise: true,
      starterCode: [
        "# Convert pairs of [key, value] into a CSV string sorted by key:",
        "# Example: [['b',1],['a',2]] -> 'a=2,b=1'",
        "",
        "def to_csv(pairs) -> str:",
        "    # TODO:",
        "    # - Build a dictionary from pairs",
        "    # - Sort keys (as strings) and return comma-joined 'key=value'",
        "    # - Return '' for empty input",
        "    pass",
      ].join("\n"),
      solutionCode: [
        "def to_csv(pairs) -> str:",
        "    d = {}",
        "    for kv in (pairs or []):",
        "        if not isinstance(kv, (list, tuple)) or len(kv) != 2:",
        "            continue",
        "        k, v = kv",
        "        d[str(k)] = v",
        "    keys = sorted(d.keys())",
        '    return ",".join(f"{k}={d[k]}" for k in keys)',
      ].join("\n"),
      hints: [
        "Iterate pairs and build a dict",
        "Sort keys for deterministic order",
        "Join with ','. Return '' for empty",
      ],
      testCases: [
        {
          input: [
            [
              ["b", 1],
              ["a", 2],
            ],
          ],
          expectedOutput: "a=2,b=1",
          description: "basic order by key",
        },
        {
          input: [
            [
              ["x", 5],
              ["x", 3],
            ],
          ],
          expectedOutput: "x=3",
          description: "last value wins",
        },
        { input: [[]], expectedOutput: "", description: "empty input" },
      ],
    },
  },

  // PF-08
  {
    slug: "file-handling",
    title: "File Handling & Data Persistence",
    description:
      "Read and write files safely with context managers and handle basic formats. Learn robust patterns for I/O.",
    category: PF,
    difficulty: 1,
    estimatedMinutes: 30,
    diamondReward: 25,
    experienceReward: 80,
    sortOrder: 8,
    content: {
      introduction: [
        "# 📁 Files",
        "Use context managers with open(...) to read and write files safely.",
      ].join("\n"),
      objectives: [
        "Use context managers",
        "Read lines and write text",
        "Understand encoding basics",
      ],
      prerequisites: ["PF-07 Dictionaries & Key-Value Data"],
      theory: [
        "Use 'with open(path, mode, encoding=\"utf-8\") as f:' to ensure files are closed.",
        "Text vs binary modes: 'r', 'w', 'a', 'rb', etc.",
        "Always handle potential exceptions in real-world code.",
      ].join("\n"),
      syntax: fenced(
        "python",
        [
          "with open('data.txt', 'r', encoding='utf-8') as f:",
          "    text = f.read()",
          "",
          "with open('out.txt', 'w', encoding='utf-8') as f:",
          "    f.write('hello')",
        ].join("\n")
      ),
      examples: [
        "Read CSV text (simple parsing):",
        fenced(
          "python",
          [
            "csv_text = 'name,age\\nAlice,20\\nBob,25'",
            "lines = [ln for ln in csv_text.splitlines() if ln.strip()]",
            "header = lines[0].split(',')",
            "rows = [ln.split(',') for ln in lines[1:]]",
            "print('cols=', len(header), 'rows=', len(rows)+1)",
          ].join("\n")
        ),
      ].join("\n"),
      bestPractices: [
        "Use context managers for files",
        "Decide on strict vs tolerant parsing",
        "Normalize newlines when needed",
      ],
      pitfalls: [
        "Forgetting to close files (avoid by using with)",
        "Not considering encodings",
      ],
      cheatsheet: [
        "open(path, 'r'|'w'|'a', encoding='utf-8')",
        "f.read(), f.readlines(), f.write()",
        "with open(...) as f: ...",
      ].join("\n"),
      references: [
        {
          label: "File I/O",
          url: "https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files",
        },
      ],
      quiz: {
        title: "PF-08 File Handling Quiz",
        timeLimit: 360,
        passingScore: 70,
        diamondReward: 10,
        experienceReward: 25,
        questions: [
          {
            id: "PF08Q1",
            type: "multiple_choice",
            question: "Which opens a file for writing text?",
            options: [
              "open('f','r')",
              "open('f','w')",
              "open('f','rb')",
              "open('f','x')",
            ],
            correctAnswer: "open('f','w')",
            explanation: "'w' truncates and writes text by default.",
            points: 10,
          },
          {
            id: "PF08Q2",
            type: "true_false",
            question: "The 'with' statement automatically closes the file.",
            correctAnswer: true,
            explanation: "Context managers handle cleanup.",
            points: 10,
          },
          {
            id: "PF08Q3",
            type: "multiple_choice",
            question: "Which correctly reads all file contents?",
            options: ["f.get()", "f.lines()", "f.read()", "read(f)"],
            correctAnswer: "f.read()",
            explanation: "Use read() to read the entire file.",
            points: 10,
          },
          {
            id: "PF08Q4",
            type: "multiple_choice",
            question: "What does 'encoding=\"utf-8\"' control?",
            options: [
              "Line endings",
              "Whitespace",
              "Character encoding",
              "File locking",
            ],
            correctAnswer: "Character encoding",
            explanation: "It determines how bytes map to characters.",
            points: 10,
          },
          {
            id: "PF08Q5",
            type: "true_false",
            question: "Using 'a' mode appends to an existing file.",
            correctAnswer: true,
            explanation: "'a' stands for append mode.",
            points: 10,
          },
        ],
      },
    },
    exercise: {
      hasCodeExercise: true,
      starterCode: [
        "# Parse a simple CSV string and report rows/columns:",
        "# Return: 'rows=<R>, cols=<C>'",
        "# - Count rows including header (non-empty lines)",
        "# - Columns = number of comma-separated fields in the first non-empty line",
        "",
        "def csv_shape(text: str) -> str:",
        "    # TODO implement",
        "    pass",
      ].join("\n"),
      solutionCode: [
        "def csv_shape(text: str) -> str:",
        "    lines = [ln for ln in (text or '').splitlines() if ln.strip()]",
        "    if not lines:",
        "        return 'rows=0, cols=0'",
        "    cols = len(lines[0].split(','))",
        "    rows = len(lines)",
        "    return f'rows={rows}, cols={cols}'",
      ].join("\n"),
      hints: [
        "Split by lines and ignore empty lines",
        "Columns = len(first_nonempty_line.split(','))",
      ],
      testCases: [
        {
          input: ["name,age\nAlice,20\nBob,25"],
          expectedOutput: "rows=3, cols=2",
          description: "basic csv",
        },
        {
          input: ["x\ny\n"],
          expectedOutput: "rows=2, cols=1",
          description: "single column",
        },
        {
          input: [""],
          expectedOutput: "rows=0, cols=0",
          description: "empty input",
        },
      ],
    },
  },

  // PF-09
  {
    slug: "error-handling-debugging",
    title: "Error Handling & Debugging",
    description:
      "Use try/except/finally, raise exceptions, and debug with prints or logging.",
    category: PF,
    difficulty: 1,
    estimatedMinutes: 30,
    diamondReward: 25,
    experienceReward: 80,
    sortOrder: 9,
    content: {
      introduction: [
        "# 🐛 Errors & Debugging",
        "Handle runtime errors gracefully and learn to debug effectively.",
      ].join("\n"),
      objectives: [
        "Use try/except/finally blocks",
        "Catch specific exceptions",
        "Write readable error messages",
      ],
      prerequisites: ["PF-08 File Handling"],
      theory: [
        "Prefer catching specific exceptions to avoid masking bugs.",
        "Add context in error messages. Use logging for larger apps.",
      ].join("\n"),
      syntax: fenced(
        "python",
        [
          "try:",
          "    x = int('42')",
          "except ValueError:",
          "    print('Invalid integer')",
          "finally:",
          "    print('cleanup')",
        ].join("\n")
      ),
      examples: fenced(
        "python",
        [
          "def safe_div(a, b):",
          "    try:",
          "        return a / b",
          "    except ZeroDivisionError:",
          "        return None",
          "print(safe_div(4,2))  # 2.0",
          "print(safe_div(1,0))  # None",
        ].join("\n")
      ),
      bestPractices: [
        "Catch specific exceptions",
        "Avoid bare 'except:'",
        "Use finally for cleanup",
      ],
      pitfalls: [
        "Masking real errors with broad except",
        "Raising generic Exception when specific types exist",
      ],
      cheatsheet: [
        "try/except [as e], finally",
        "raise ValueError('message')",
        "Use logging for diagnostics",
      ].join("\n"),
      references: [
        {
          label: "Errors & Exceptions",
          url: "https://docs.python.org/3/tutorial/errors.html",
        },
      ],
      quiz: {
        title: "PF-09 Error Handling Quiz",
        timeLimit: 360,
        passingScore: 70,
        diamondReward: 10,
        experienceReward: 25,
        questions: [
          {
            id: "PF09Q1",
            type: "multiple_choice",
            question: "Which catches division by zero?",
            options: [
              "except IOError:",
              "except ZeroDivisionError:",
              "except ValueError:",
              "except KeyError:",
            ],
            correctAnswer: "except ZeroDivisionError:",
            explanation: "Catch the specific exception type.",
            points: 10,
          },
          {
            id: "PF09Q2",
            type: "true_false",
            question: "finally runs even if an exception occurs.",
            correctAnswer: true,
            explanation: "finally executes regardless of exceptions.",
            points: 10,
          },
          {
            id: "PF09Q3",
            type: "true_false",
            question: "Bare 'except:' is recommended in production code.",
            correctAnswer: false,
            explanation: "Catch specific exceptions instead.",
            points: 10,
          },
          {
            id: "PF09Q4",
            type: "multiple_choice",
            question: "Which raises with a message?",
            options: [
              "raise 'error'",
              "raise ValueError('bad')",
              "ValueError('bad')",
              "throw ValueError('bad')",
            ],
            correctAnswer: "raise ValueError('bad')",
            explanation: "Use raise with an exception instance.",
            points: 10,
          },
        ],
      },
    },
    exercise: {
      hasCodeExercise: true,
      starterCode: [
        "# Safe divide with formatted result:",
        "# Return 'result=<v>' with 2 decimals or 'error=division by zero'",
        "",
        "def safe_divide(a, b) -> str:",
        "    # TODO",
        "    pass",
      ].join("\n"),
      solutionCode: [
        "def safe_divide(a, b) -> str:",
        "    try:",
        "        val = float(a) / float(b)",
        "        return f'result={val:.2f}'",
        "    except ZeroDivisionError:",
        "        return 'error=division by zero'",
      ].join("\n"),
      hints: ["Use try/except catching ZeroDivisionError", "Format with :.2f"],
      testCases: [
        { input: [5, 2], expectedOutput: "result=2.50", description: "normal" },
        {
          input: [7, 0],
          expectedOutput: "error=division by zero",
          description: "zero division",
        },
        {
          input: [-3, 2],
          expectedOutput: "result=-1.50",
          description: "negative",
        },
      ],
    },
  },

  // PF-10
  {
    slug: "oop-basics",
    title: "Object-Oriented Programming Basics",
    description:
      "Create classes and objects, understand attributes, methods, and simple OOP principles.",
    category: PF,
    difficulty: 2,
    estimatedMinutes: 30,
    diamondReward: 25,
    experienceReward: 90,
    sortOrder: 10,
    content: {
      introduction: [
        "# 🏗️ OOP Basics",
        "Model real-world entities with classes and objects.",
      ].join("\n"),
      objectives: [
        "Define simple classes with attributes and methods",
        "Instantiate and use objects",
        "Understand __init__ and self",
      ],
      prerequisites: ["PF-09 Error Handling & Debugging"],
      theory: [
        "Use __init__ for initialization; methods receive 'self'.",
        "Encapsulation improves code structure.",
      ].join("\n"),
      syntax: fenced(
        "python",
        [
          "class Student:",
          "    def __init__(self, name, age):",
          "        self.name = name",
          "        self.age = age",
          "s = Student('Alice', 20)",
          "print(s.name, s.age)",
        ].join("\n")
      ),
      examples: fenced(
        "python",
        [
          "class Point:",
          "    def __init__(self, x, y):",
          "        self.x = x; self.y = y",
          "    def norm(self):",
          "        return (self.x**2 + self.y**2) ** 0.5",
          "p = Point(3,4)",
          "print(p.norm())  # 5.0",
        ].join("\n")
      ),
      bestPractices: [
        "Keep classes small and focused",
        "Prefer methods over free functions only when it improves clarity",
      ],
      pitfalls: [
        "Forgetting self parameter in methods",
        "Assuming attributes exist without initialization",
      ],
      cheatsheet: [
        "class Name: __init__(self, ...)",
        "self.attr = value",
        "def method(self, ...): ...",
      ].join("\n"),
      references: [
        {
          label: "Classes",
          url: "https://docs.python.org/3/tutorial/classes.html",
        },
      ],
      quiz: {
        title: "PF-10 OOP Basics Quiz",
        timeLimit: 420,
        passingScore: 70,
        diamondReward: 10,
        experienceReward: 25,
        questions: [
          {
            id: "PF10Q1",
            type: "multiple_choice",
            question: "What is 'self' in a method?",
            options: [
              "A keyword",
              "The class name",
              "The instance",
              "A decorator",
            ],
            correctAnswer: "The instance",
            explanation: "self refers to the instance.",
            points: 10,
          },
          {
            id: "PF10Q2",
            type: "true_false",
            question: "__init__ is a constructor-like initializer.",
            correctAnswer: true,
            explanation: "It's called on instance creation.",
            points: 10,
          },
          {
            id: "PF10Q3",
            type: "multiple_choice",
            question: "Which defines an attribute on the instance?",
            options: [
              "self.attr = v",
              "attr := v",
              "attr = v",
              "this.attr = v",
            ],
            correctAnswer: "self.attr = v",
            explanation: "Bind attributes via self.",
            points: 10,
          },
        ],
      },
    },
    exercise: {
      hasCodeExercise: true,
      starterCode: [
        "# Compute student's average as a formatted string:",
        "# Return 'name=<name>, avg=<A>' with two decimals.",
        "",
        "def describe_student(name: str, grades) -> str:",
        "    # TODO implement",
        "    pass",
      ].join("\n"),
      solutionCode: [
        "def describe_student(name: str, grades) -> str:",
        "    xs = [float(x) for x in (grades or [])]",
        "    avg = sum(xs)/len(xs) if xs else 0.0",
        "    return f'name={name}, avg={avg:.2f}'",
      ].join("\n"),
      hints: ["Convert grades to float", "Handle empty list gracefully"],
      testCases: [
        {
          input: ["Alice", [90, 80, 100]],
          expectedOutput: "name=Alice, avg=90.00",
          description: "typical",
        },
        {
          input: ["Bob", []],
          expectedOutput: "name=Bob, avg=0.00",
          description: "no grades",
        },
      ],
    },
  },

  // PF-11
  {
    slug: "modules-libraries",
    title: "Modules, Libraries & Code Organization",
    description:
      "Organize code into modules/packages and leverage built-in/third-party libraries.",
    category: PF,
    difficulty: 2,
    estimatedMinutes: 30,
    diamondReward: 25,
    experienceReward: 90,
    sortOrder: 11,
    content: {
      introduction: [
        "# 📦 Modules & Libraries",
        "Split code into reusable modules and import what you need.",
      ].join("\n"),
      objectives: [
        "Import from standard library",
        "Organize code into modules",
        "Use functions from modules",
      ],
      prerequisites: ["PF-10 OOP Basics"],
      theory: [
        "Use 'import module' or 'from module import name'.",
        "The standard library provides many utilities like math, datetime, os.",
      ].join("\n"),
      syntax: fenced(
        "python",
        [
          "# my_utils.py",
          "def add(a, b): return a + b",
          "",
          "# main.py",
          "from my_utils import add",
          "print(add(2,3))",
        ].join("\n")
      ),
      examples: fenced(
        "python",
        [
          "import math",
          "print(math.sqrt(16))  # 4.0",
          "print(math.hypot(3,4))  # 5.0",
        ].join("\n")
      ),
      bestPractices: [
        "Prefer explicit imports for clarity",
        "Group imports (stdlib, third-party, local)",
      ],
      pitfalls: ["Name collisions due to wildcard imports", "Import cycles"],
      cheatsheet: [
        "import module",
        "from module import name",
        "from module import name as alias",
      ].join("\n"),
      references: [
        {
          label: "Modules",
          url: "https://docs.python.org/3/tutorial/modules.html",
        },
      ],
      quiz: {
        title: "PF-11 Modules & Libraries Quiz",
        timeLimit: 360,
        passingScore: 70,
        diamondReward: 10,
        experienceReward: 25,
        questions: [
          {
            id: "PF11Q1",
            type: "multiple_choice",
            question: "Which imports sqrt from math?",
            options: [
              "import sqrt",
              "from math import sqrt",
              "math import sqrt",
              "use math.sqrt",
            ],
            correctAnswer: "from math import sqrt",
            explanation: "Use from module import name.",
            points: 10,
          },
          {
            id: "PF11Q2",
            type: "true_false",
            question: "Wildcard imports (from x import *) are recommended.",
            correctAnswer: false,
            explanation: "They pollute the namespace and can cause collisions.",
            points: 10,
          },
          {
            id: "PF11Q3",
            type: "multiple_choice",
            question: "Which calculates hypotenuse?",
            options: [
              "math.line(3,4)",
              "math.sqrt(3**2+4**2)",
              "math.pow2(3,4)",
              "math.norm(3,4)",
            ],
            correctAnswer: "math.sqrt(3**2+4**2)",
            explanation: "Or math.hypot(3,4).",
            points: 10,
          },
        ],
      },
    },
    exercise: {
      hasCodeExercise: true,
      starterCode: [
        "# Compute hypotenuse with 2 decimals:",
        "# Return 'hypotenuse=<v>'",
        "",
        "def hypotenuse(a, b) -> str:",
        "    # TODO implement using math or sqrt",
        "    pass",
      ].join("\n"),
      solutionCode: [
        "def hypotenuse(a, b) -> str:",
        "    a = float(a); b = float(b)",
        "    h = (a*a + b*b) ** 0.5",
        "    return f'hypotenuse={h:.2f}'",
      ].join("\n"),
      hints: ["Use sqrt(a*a + b*b) or math.hypot", "Format with :.2f"],
      testCases: [
        {
          input: [3, 4],
          expectedOutput: "hypotenuse=5.00",
          description: "3-4-5 triangle",
        },
        {
          input: [5, 12],
          expectedOutput: "hypotenuse=13.00",
          description: "5-12-13 triangle",
        },
      ],
    },
  },
];

// Convert PFSeed to LearningActivity upsert payload
function toUpsertPayload(seed: PFSeed) {
  const content = JSON.stringify(seed.content);
  const settings = JSON.stringify({
    slug: seed.slug,
    hasCodeExercise: seed.exercise.hasCodeExercise,
    starterCode: seed.exercise.starterCode,
    solutionCode: seed.exercise.solutionCode,
    hints: seed.exercise.hints,
    testCases: JSON.stringify(seed.exercise.testCases),
    learningObjectives: seed.content.objectives || [],
    prerequisites: seed.content.prerequisites || [],
    source: "pf_lessons_seed_v1",
  });

  return {
    title: seed.title,
    description: seed.description,
    activityType: "lesson",
    category: seed.category,
    difficulty: seed.difficulty,
    diamondReward: seed.diamondReward,
    experienceReward: seed.experienceReward,
    content,
    settings,
    isActive: true,
    estimatedMinutes: seed.estimatedMinutes,
    tags: JSON.stringify([seed.category, "python", "beginner"]),
    sortOrder: seed.sortOrder,
    topicOrder: seed.sortOrder,
    isLocked: false,
  };
}

export default async function seedPFLessons() {
  console.log("🌱 Seeding Python Fundamentals lessons (PF-01..PF-05) ...");

  for (const seed of pfLessons) {
    try {
      await prisma.learningActivity.upsert({
        where: { slug: seed.slug },
        update: toUpsertPayload(seed),
        create: {
          slug: seed.slug,
          ...toUpsertPayload(seed),
        },
      });
      console.log(`✅ Upserted lesson: ${seed.slug} (${seed.title})`);
    } catch (err) {
      console.error(`❌ Failed upserting ${seed.slug}:`, err);
    }
  }

  console.log("✅ PF lessons seed completed.");
}

if (require.main === module) {
  seedPFLessons()
    .catch((e) => {
      console.error("❌ Seed error:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
