import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Code Builder Activities for Functions & OOP
 * 10 activities with increasing difficulty
 * Category: "Functions & OOP"
 *
 * Structure reference:
 * {
 *   activityType: "code_builder",
 *   content: {
 *     instructions: string,
 *     targetOutput: string,
 *     availableBlocks: [{ id, code, type, description }],
 *     language: "Python",
 *     solution: string[]
 *   },
 *   settings: {
 *     timeLimit: number,
 *     codeTemplate: string,
 *     runTests: boolean,
 *     showOutput: boolean
 *   }
 * }
 */

export const codeBuilderFunctionsOOPActivities = [
  // 1) Difficulty 1 — Build a simple greeting function pipeline
  {
    title: "Code Builder: Basic Greeting Function",
    description:
      "Order blocks to define greet(name) that returns 'Hello, {name}!'",
    activityType: "code_builder",
    category: "Functions & OOP",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 28,
    estimatedMinutes: 10,
    tags: ["functions", "def", "return", "code-builder"],
    content: {
      instructions:
        "Arrange blocks to define greet(name) and return a formatted greeting string.",
      targetOutput: "Hello, Ada!",
      language: "Python",
      availableBlocks: [
        {
          id: "def",
          code: "def greet(name):",
          type: "function",
          description: "Function definition",
        },
        {
          id: "ret",
          code: '    return f"Hello, {name}!"',
          type: "return",
          description: "Return formatted greeting",
        },
        {
          id: "main",
          code: "print(greet('Ada'))",
          type: "invoke",
          description: "Test call",
        },
      ],
      solution: [
        "def greet(name):",
        '    return f"Hello, {name}!"',
        "print(greet('Ada'))",
      ],
    },
    settings: {
      timeLimit: 480,
      codeTemplate: "# Arrange the blocks to define greet and call it\n",
      runTests: true,
      showOutput: true,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Difficulty 1 — Parameters and defaults
  {
    title: "Code Builder: Parameters & Defaults",
    description: "Build format_name(first, last='Doe') returning 'Last, First'",
    activityType: "code_builder",
    category: "Functions & OOP",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 28,
    estimatedMinutes: 10,
    tags: ["functions", "parameters", "defaults", "code-builder"],
    content: {
      instructions:
        "Order the blocks to define format_name with a default last name and return 'Last, First'.",
      targetOutput: "Doe, Ada",
      language: "Python",
      availableBlocks: [
        {
          id: "def",
          code: "def format_name(first, last='Doe'):",
          type: "function",
          description: "Signature with default",
        },
        {
          id: "ret",
          code: '    return f"{last}, {first}"',
          type: "return",
          description: "Return formatted",
        },
        {
          id: "main",
          code: "print(format_name('Ada'))",
          type: "invoke",
          description: "Test call",
        },
      ],
      solution: [
        "def format_name(first, last='Doe'):",
        '    return f"{last}, {first}"',
        "print(format_name('Ada'))",
      ],
    },
    settings: {
      timeLimit: 540,
      codeTemplate: "# Arrange to define format_name and call it\n",
      runTests: true,
      showOutput: true,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3) Difficulty 2 — *args and **kwargs usage
  {
    title: "Code Builder: *args and **kwargs Aggregation",
    description: "Order blocks to implement sum_args(*args) and flag(**kwargs)",
    activityType: "code_builder",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 44,
    estimatedMinutes: 12,
    tags: ["functions", "args", "kwargs", "code-builder"],
    content: {
      instructions:
        "Build two small utilities: sum_args(*args) returns the sum; flag(**kwargs) returns kwargs.get('flag', False).",
      targetOutput: "6\nTrue",
      language: "Python",
      availableBlocks: [
        {
          id: "def1",
          code: "def sum_args(*args):",
          type: "function",
          description: "Var-positional sum",
        },
        {
          id: "ret1",
          code: "    return sum(args)",
          type: "return",
          description: "Sum args",
        },
        {
          id: "def2",
          code: "def flag(**kwargs):",
          type: "function",
          description: "Var-keyword flag",
        },
        {
          id: "ret2",
          code: "    return bool(kwargs.get('flag', False))",
          type: "return",
          description: "Read flag",
        },
        {
          id: "main1",
          code: "print(sum_args(1,2,3))",
          type: "invoke",
          description: "Test sum_args",
        },
        {
          id: "main2",
          code: "print(flag(flag=True))",
          type: "invoke",
          description: "Test flag",
        },
      ],
      solution: [
        "def sum_args(*args):",
        "    return sum(args)",
        "def flag(**kwargs):",
        "    return bool(kwargs.get('flag', False))",
        "print(sum_args(1,2,3))",
        "print(flag(flag=True))",
      ],
    },
    settings: {
      timeLimit: 600,
      codeTemplate: "# Arrange functions and calls\n",
      runTests: true,
      showOutput: true,
    },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Difficulty 2 — Multiple return values
  {
    title: "Code Builder: Multiple Returns (Tuples)",
    description:
      "Create stats(a,b,c) returning (min, max, sum) and print tuple",
    activityType: "code_builder",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 46,
    estimatedMinutes: 12,
    tags: ["functions", "return", "tuple", "code-builder"],
    content: {
      instructions:
        "Order blocks to build a function returning 3 values as a tuple.",
      targetOutput: "(1, 5, 9)",
      language: "Python",
      availableBlocks: [
        {
          id: "def",
          code: "def stats(a, b, c):",
          type: "function",
          description: "Function def",
        },
        {
          id: "ret",
          code: "    return (min(a,b,c), max(a,b,c), a+b+c)",
          type: "return",
          description: "Return tuple",
        },
        {
          id: "main",
          code: "print(stats(3,1,5))",
          type: "invoke",
          description: "Test call",
        },
      ],
      solution: [
        "def stats(a, b, c):",
        "    return (min(a,b,c), max(a,b,c), a+b+c)",
        "print(stats(3,1,5))",
      ],
    },
    settings: {
      timeLimit: 600,
      codeTemplate: "# Build stats and call it\n",
      runTests: true,
      showOutput: true,
    },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Difficulty 3 — Recursion (factorial) block order
  {
    title: "Code Builder: Recursive Factorial",
    description: "Arrange blocks to implement factorial(n) with base case",
    activityType: "code_builder",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 14,
    tags: ["recursion", "base-case", "factorial", "code-builder"],
    content: {
      instructions:
        "Order the blocks to create a working recursive factorial function.",
      targetOutput: "120",
      language: "Python",
      availableBlocks: [
        {
          id: "def",
          code: "def factorial(n):",
          type: "function",
          description: "Definition",
        },
        {
          id: "base",
          code: "    if n == 0: return 1",
          type: "condition",
          description: "Base case",
        },
        {
          id: "step",
          code: "    return n * factorial(n-1)",
          type: "return",
          description: "Recursive step",
        },
        {
          id: "main",
          code: "print(factorial(5))",
          type: "invoke",
          description: "Test call",
        },
      ],
      solution: [
        "def factorial(n):",
        "    if n == 0: return 1",
        "    return n * factorial(n-1)",
        "print(factorial(5))",
      ],
    },
    settings: {
      timeLimit: 720,
      codeTemplate: "# Arrange recursive factorial\n",
      runTests: true,
      showOutput: true,
    },
    isActive: true,
    sortOrder: 5,
  },

  // 6) Difficulty 3 — Decorator structure with @wraps
  {
    title: "Code Builder: Decorator Skeleton with @wraps",
    description: "Arrange decorator parts to log 'CALL' then run function",
    activityType: "code_builder",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 15,
    tags: ["decorators", "wraps", "metadata", "code-builder"],
    content: {
      instructions:
        "Order blocks to implement a simple decorator that logs and preserves metadata.",
      targetOutput: "CALL\n5",
      language: "Python",
      availableBlocks: [
        {
          id: "import",
          code: "from functools import wraps",
          type: "import",
          description: "Import wraps",
        },
        {
          id: "outer",
          code: "def log_calls(func):",
          type: "function",
          description: "Decorator outer",
        },
        {
          id: "wraps",
          code: "    @wraps(func)",
          type: "decorator",
          description: "@wraps usage",
        },
        {
          id: "inner",
          code: "    def wrapper(*args, **kwargs):",
          type: "function",
          description: "Wrapper",
        },
        {
          id: "log",
          code: "        print('CALL')",
          type: "statement",
          description: "Log",
        },
        {
          id: "call",
          code: "        return func(*args, **kwargs)",
          type: "return",
          description: "Invoke",
        },
        {
          id: "ret",
          code: "    return wrapper",
          type: "return",
          description: "Return wrapper",
        },
        {
          id: "use",
          code: "@log_calls",
          type: "decorator",
          description: "Apply decorator",
        },
        {
          id: "sumdef",
          code: "def add(a, b):",
          type: "function",
          description: "Function to decorate",
        },
        {
          id: "sumret",
          code: "    return a + b",
          type: "return",
          description: "Return sum",
        },
        {
          id: "main",
          code: "print(add(2,3))",
          type: "invoke",
          description: "Test",
        },
      ],
      solution: [
        "from functools import wraps",
        "def log_calls(func):",
        "    @wraps(func)",
        "    def wrapper(*args, **kwargs):",
        "        print('CALL')",
        "        return func(*args, **kwargs)",
        "    return wrapper",
        "@log_calls",
        "def add(a, b):",
        "    return a + b",
        "print(add(2,3))",
      ],
    },
    settings: {
      timeLimit: 840,
      codeTemplate: "# Arrange a working decorator\n",
      runTests: true,
      showOutput: true,
    },
    isActive: true,
    sortOrder: 6,
  },

  // 7) Difficulty 3 — Class with @property
  {
    title: "Code Builder: Class with @property",
    description: "Build a Box class with read-only @property volume (w*h*d)",
    activityType: "code_builder",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 16,
    tags: ["oop", "property", "class", "code-builder"],
    content: {
      instructions:
        "Order blocks to implement a class; compute volume via @property.",
      targetOutput: "24",
      language: "Python",
      availableBlocks: [
        {
          id: "class",
          code: "class Box:",
          type: "class",
          description: "Class definition",
        },
        {
          id: "init",
          code: "    def __init__(self, w, h, d):",
          type: "method",
          description: "Constructor",
        },
        {
          id: "assign",
          code: "        self.w, self.h, self.d = w, h, d",
          type: "statement",
          description: "Store fields",
        },
        {
          id: "prop",
          code: "    @property",
          type: "decorator",
          description: "@property",
        },
        {
          id: "getter",
          code: "    def volume(self):",
          type: "method",
          description: "Getter",
        },
        {
          id: "ret",
          code: "        return self.w * self.h * self.d",
          type: "return",
          description: "Compute",
        },
        {
          id: "main",
          code: "b = Box(2,3,4); print(b.volume)",
          type: "invoke",
          description: "Test",
        },
      ],
      solution: [
        "class Box:",
        "    def __init__(self, w, h, d):",
        "        self.w, self.h, self.d = w, h, d",
        "    @property",
        "    def volume(self):",
        "        return self.w * self.h * self.d",
        "b = Box(2,3,4); print(b.volume)",
      ],
    },
    settings: {
      timeLimit: 900,
      codeTemplate: "# Arrange Box with @property volume\n",
      runTests: true,
      showOutput: true,
    },
    isActive: true,
    sortOrder: 7,
  },

  // 8) Difficulty 4 — @classmethod alternative constructor
  {
    title: "Code Builder: @classmethod From Fullname",
    description: "Order blocks to implement Person.from_fullname('First Last')",
    activityType: "code_builder",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 80,
    estimatedMinutes: 18,
    tags: ["classmethod", "constructor", "oop", "code-builder"],
    content: {
      instructions:
        "Create a @classmethod returning a new instance from a single string.",
      targetOutput: "Hopper",
      language: "Python",
      availableBlocks: [
        {
          id: "class",
          code: "class Person:",
          type: "class",
          description: "Class",
        },
        {
          id: "init",
          code: "    def __init__(self, first, last):",
          type: "method",
          description: "Init",
        },
        {
          id: "assign",
          code: "        self.first, self.last = first, last",
          type: "statement",
          description: "Assign",
        },
        {
          id: "decor",
          code: "    @classmethod",
          type: "decorator",
          description: "@classmethod",
        },
        {
          id: "alt",
          code: "    def from_fullname(cls, s):",
          type: "method",
          description: "Alt constructor",
        },
        {
          id: "split",
          code: "        f, l = s.split(' ', 1)",
          type: "statement",
          description: "Parse",
        },
        {
          id: "ret",
          code: "        return cls(f, l)",
          type: "return",
          description: "Return instance",
        },
        {
          id: "main",
          code: "print(Person.from_fullname('Grace Hopper').last)",
          type: "invoke",
          description: "Test",
        },
      ],
      solution: [
        "class Person:",
        "    def __init__(self, first, last):",
        "        self.first, self.last = first, last",
        "    @classmethod",
        "    def from_fullname(cls, s):",
        "        f, l = s.split(' ', 1)",
        "        return cls(f, l)",
        "print(Person.from_fullname('Grace Hopper').last)",
      ],
    },
    settings: {
      timeLimit: 960,
      codeTemplate: "# Arrange Person with classmethod from_fullname\n",
      runTests: true,
      showOutput: true,
    },
    isActive: true,
    sortOrder: 8,
  },

  // 9) Difficulty 4 — Inheritance with super()
  {
    title: "Code Builder: Inheritance with super()",
    description: "Order blocks so Dog.speak() extends Animal.speak()",
    activityType: "code_builder",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 82,
    estimatedMinutes: 18,
    tags: ["inheritance", "super", "override", "code-builder"],
    content: {
      instructions:
        "Arrange to implement Animal.speak() and Dog.speak() that appends ' woof'.",
      targetOutput: "sound woof",
      language: "Python",
      availableBlocks: [
        {
          id: "classA",
          code: "class Animal:",
          type: "class",
          description: "Base class",
        },
        {
          id: "speakA",
          code: "    def speak(self):",
          type: "method",
          description: "Base method",
        },
        {
          id: "retA",
          code: "        return 'sound'",
          type: "return",
          description: "Return",
        },
        {
          id: "classD",
          code: "class Dog(Animal):",
          type: "class",
          description: "Derived",
        },
        {
          id: "speakD",
          code: "    def speak(self):",
          type: "method",
          description: "Override",
        },
        {
          id: "retD",
          code: "        return super().speak() + ' woof'",
          type: "return",
          description: "Extend",
        },
        {
          id: "main",
          code: "print(Dog().speak())",
          type: "invoke",
          description: "Test",
        },
      ],
      solution: [
        "class Animal:",
        "    def speak(self):",
        "        return 'sound'",
        "class Dog(Animal):",
        "    def speak(self):",
        "        return super().speak() + ' woof'",
        "print(Dog().speak())",
      ],
    },
    settings: {
      timeLimit: 1020,
      codeTemplate: "# Arrange classes and override with super()\n",
      runTests: true,
      showOutput: true,
    },
    isActive: true,
    sortOrder: 9,
  },

  // 10) Difficulty 5 — Callable objects via __call__
  {
    title: "Code Builder: Callable Object (__call__)",
    description:
      "Arrange blocks to implement Doubler so Doubler()(x) returns x*2",
    activityType: "code_builder",
    category: "Functions & OOP",
    difficulty: 5,
    diamondReward: 48,
    experienceReward: 100,
    estimatedMinutes: 20,
    tags: ["dunder", "__call__", "callable", "oop", "code-builder"],
    content: {
      instructions:
        "Make the object callable by defining __call__(self, x) returning x*2.",
      targetOutput: "14",
      language: "Python",
      availableBlocks: [
        {
          id: "class",
          code: "class Doubler:",
          type: "class",
          description: "Class",
        },
        {
          id: "call",
          code: "    def __call__(self, x):",
          type: "method",
          description: "__call__",
        },
        {
          id: "ret",
          code: "        return x * 2",
          type: "return",
          description: "Compute",
        },
        {
          id: "main",
          code: "d = Doubler(); print(d(7))",
          type: "invoke",
          description: "Test",
        },
      ],
      solution: [
        "class Doubler:",
        "    def __call__(self, x):",
        "        return x * 2",
        "d = Doubler(); print(d(7))",
      ],
    },
    settings: {
      timeLimit: 1080,
      codeTemplate: "# Arrange a callable object\n",
      runTests: true,
      showOutput: true,
    },
    isActive: true,
    sortOrder: 10,
  },
];

export async function seedCodeBuilderFunctionsOOPActivities() {
  await seedActivitiesWithDuplicateCheck(
    codeBuilderFunctionsOOPActivities,
    "Code-Builder Functions & OOP"
  );
}

// Execute if run directly
if (require.main === module) {
  seedCodeBuilderFunctionsOOPActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Code-Builder Functions & OOP activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
