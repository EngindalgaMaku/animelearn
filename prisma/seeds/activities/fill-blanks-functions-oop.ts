import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Fill-Blanks Activities for Functions & OOP
 * 10 activities with increasing difficulty
 * Category: "Functions & OOP"
 *
 * Structure reference (see ACTIVITY_STRUCTURES.md):
 * {
 *   activityType: "fill_blanks",
 *   content: {
 *     instructions: string,
 *     exercises: [{
 *       id: number | string,
 *       description: string,
 *       template: string,         // code with placeholders (e.g., ____ or ____)
 *       blanks: [{ id: string, answer: string, position: number }],
 *       expectedOutput?: string
 *     }]
 *   },
 *   settings: { timeLimit?: number, allowHints?: boolean, caseSensitive?: boolean }
 * }
 */

export const fillBlanksFunctionsOOPActivities = [
  // 1) Difficulty 1 — Function definition & call basics
  {
    title: "Fill Blanks: Function Definition & Call Basics",
    description:
      "Complete function definitions, calls, and simple returns for basic function literacy",
    activityType: "fill_blanks",
    category: "Functions & OOP",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 28,
    estimatedMinutes: 10,
    tags: ["functions", "basics", "def", "return", "fill-blanks"],
    content: {
      instructions:
        "Fill in the blanks to define and call simple Python functions correctly.",
      exercises: [
        {
          id: 1,
          description: "Define a function hello that returns 'Hello, world!'",
          template: "____ hello():\n    ____ 'Hello, world!'\n\nprint(hello())",
          blanks: [
            { id: "b1", answer: "def", position: 0 },
            { id: "b2", answer: "return", position: 1 },
          ],
          expectedOutput: "Hello, world!",
        },
        {
          id: 2,
          description: "Define add(x, y) and return their sum; then call it",
          template: "____ add(x, y):\n    ____ x + y\n\nprint(add(2, ____))",
          blanks: [
            { id: "b1", answer: "def", position: 0 },
            { id: "b2", answer: "return", position: 1 },
            { id: "b3", answer: "3", position: 2 },
          ],
          expectedOutput: "5",
        },
        {
          id: 3,
          description: "Complete the docstring placement for a function",
          template:
            'def greet(name):\n    """____ a friendly message to the user"""\n    return f\'Hello, {name}!\'\n\nprint(greet(\'Alice\'))',
          blanks: [{ id: "b1", answer: "Return", position: 0 }],
          expectedOutput: "Hello, Alice!",
        },
      ],
    },
    settings: { timeLimit: 480, allowHints: true, caseSensitive: false },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Difficulty 1 — Parameters: positional & keyword
  {
    title: "Fill Blanks: Parameters — Positional and Keyword",
    description:
      "Practice positional and keyword arguments by completing function calls",
    activityType: "fill_blanks",
    category: "Functions & OOP",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 28,
    estimatedMinutes: 11,
    tags: ["functions", "parameters", "positional", "keyword", "fill-blanks"],
    content: {
      instructions:
        "Fill in the blanks to use positional and keyword arguments correctly.",
      exercises: [
        {
          id: 1,
          description: "Call the function with positional arguments",
          template:
            "def power(base, exp):\n    return base ** exp\n\nprint(power(____, ____))",
          blanks: [
            { id: "b1", answer: "2", position: 0 },
            { id: "b2", answer: "3", position: 1 },
          ],
          expectedOutput: "8",
        },
        {
          id: 2,
          description: "Call the function with keyword arguments",
          template:
            "def format_name(first, last):\n    return f'{last}, {first}'\n\nprint(format_name(____='Ada', ____='Lovelace'))",
          blanks: [
            { id: "b1", answer: "first", position: 0 },
            { id: "b2", answer: "last", position: 1 },
          ],
          expectedOutput: "Lovelace, Ada",
        },
        {
          id: 3,
          description: "Mix positional and keyword in a valid manner",
          template:
            "def rectangle(w, h):\n    return w * h\n\nprint(rectangle(3, ____=4))",
          blanks: [{ id: "b1", answer: "h", position: 0 }],
          expectedOutput: "12",
        },
      ],
    },
    settings: { timeLimit: 540, allowHints: true, caseSensitive: false },
    isActive: true,
    sortOrder: 2,
  },

  // 3) Difficulty 2 — Default arguments
  {
    title: "Fill Blanks: Default Arguments",
    description:
      "Use safe defaults and call functions utilizing default parameters",
    activityType: "fill_blanks",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 44,
    estimatedMinutes: 12,
    tags: ["functions", "defaults", "best-practices", "fill-blanks"],
    content: {
      instructions:
        "Fill in the blanks to define and use default parameters correctly.",
      exercises: [
        {
          id: 1,
          description: "Default greeting punctuation",
          template:
            "def greet(name, punctuation=____):\n    return f'Hello, {name}{punctuation}'\n\nprint(greet('Bob'))",
          blanks: [{ id: "b1", answer: "'!'", position: 0 }],
          expectedOutput: "Hello, Bob!",
        },
        {
          id: 2,
          description: "Safe mutable default pattern with list",
          template:
            "def add_item(x, items=____):\n    if items is None:\n        items = []\n    items.append(x)\n    return items\n\nprint(add_item(1))",
          blanks: [{ id: "b1", answer: "None", position: 0 }],
          expectedOutput: "[1]",
        },
        {
          id: 3,
          description: "Override default",
          template:
            "def multiply(a, b=____):\n    return a * b\n\nprint(multiply(6))",
          blanks: [{ id: "b1", answer: "2", position: 0 }],
          expectedOutput: "12",
        },
      ],
    },
    settings: { timeLimit: 540, allowHints: true, caseSensitive: false },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Difficulty 2 — *args and **kwargs
  {
    title: "Fill Blanks: *args and **kwargs",
    description:
      "Capture extra positional and keyword arguments using *args and **kwargs",
    activityType: "fill_blanks",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 44,
    estimatedMinutes: 13,
    tags: ["functions", "args", "kwargs", "parameters", "fill-blanks"],
    content: {
      instructions:
        "Fill in the blanks to collect extra arguments and access them.",
      exercises: [
        {
          id: 1,
          description: "Count extra positional arguments",
          template:
            "def count_extra(a, ____):\n    return len(args)\n\nprint(count_extra(1, 2, 3, 4))",
          blanks: [{ id: "b1", answer: "*args", position: 0 }],
          expectedOutput: "3",
        },
        {
          id: 2,
          description: "Read a specific keyword from kwargs",
          template:
            "def has_flag(____):\n    return kwargs.get('flag', False)\n\nprint(has_flag(flag=True))",
          blanks: [{ id: "b1", answer: "**kwargs", position: 0 }],
          expectedOutput: "True",
        },
        {
          id: 3,
          description: "Mix required, *args, and **kwargs",
          template:
            "def report(title, ____, ____):\n    return title, len(args), 'x' in kwargs\n\nprint(report('R', 1,2,3, x=10))",
          blanks: [
            { id: "b1", answer: "*args", position: 0 },
            { id: "b2", answer: "**kwargs", position: 1 },
          ],
          expectedOutput: "('R', 3, True)",
        },
      ],
    },
    settings: { timeLimit: 600, allowHints: true, caseSensitive: false },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Difficulty 3 — Return semantics & None
  {
    title: "Fill Blanks: Return Semantics & None",
    description:
      "Work with implicit None, tuple returns, and unpacking results",
    activityType: "fill_blanks",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 14,
    tags: ["functions", "return", "tuple", "none", "fill-blanks"],
    content: {
      instructions:
        "Fill in the blanks to return values properly and unpack tuples.",
      exercises: [
        {
          id: 1,
          description: "Implicit None if no return",
          template:
            "def f():\n    ____  # do nothing\n\nx = f()\nprint(x is None)",
          blanks: [{ id: "b1", answer: "pass", position: 0 }],
          expectedOutput: "True",
        },
        {
          id: 2,
          description: "Return two values as tuple and unpack",
          template:
            "def pair():\n    return ____, ____\n\na, b = pair()\nprint(a + b)",
          blanks: [
            { id: "b1", answer: "3", position: 0 },
            { id: "b2", answer: "4", position: 1 },
          ],
          expectedOutput: "7",
        },
        {
          id: 3,
          description: "Prefer 'is None' check",
          template:
            "def maybe():\n    return ____\n\nx = maybe()\nprint(x ____ None)",
          blanks: [
            { id: "b1", answer: "None", position: 0 },
            { id: "b2", answer: "is", position: 1 },
          ],
          expectedOutput: "True",
        },
      ],
    },
    settings: { timeLimit: 660, allowHints: true, caseSensitive: false },
    isActive: true,
    sortOrder: 5,
  },

  // 6) Difficulty 3 — LEGB scope, global, nonlocal
  {
    title: "Fill Blanks: Scope — LEGB, global, nonlocal",
    description:
      "Fix code to use correct scoping rules with global and nonlocal",
    activityType: "fill_blanks",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 15,
    tags: ["scope", "LEGB", "global", "nonlocal", "fill-blanks"],
    content: {
      instructions:
        "Fill in the blanks to modify variables in the appropriate scope.",
      exercises: [
        {
          id: 1,
          description: "Use global to modify a module variable",
          template:
            "COUNT = 0\n\ndef inc():\n    ____ COUNT\n    COUNT += 1\n\ninc()\nprint(COUNT)",
          blanks: [{ id: "b1", answer: "global", position: 0 }],
          expectedOutput: "1",
        },
        {
          id: 2,
          description: "Use nonlocal inside nested functions",
          template:
            "def outer():\n    x = 0\n    def inner():\n        ____ x\n        x += 1\n        return x\n    return inner\n\nf = outer()\nprint(f())",
          blanks: [{ id: "b1", answer: "nonlocal", position: 0 }],
          expectedOutput: "1",
        },
        {
          id: 3,
          description: "Name resolution order favors local first",
          template:
            "y = 10\n\ndef use_local():\n    y = ____\n    return y\n\nprint(use_local())",
          blanks: [{ id: "b1", answer: "5", position: 0 }],
          expectedOutput: "5",
        },
      ],
    },
    settings: { timeLimit: 720, allowHints: true, caseSensitive: false },
    isActive: true,
    sortOrder: 6,
  },

  // 7) Difficulty 3 — Lambda and HOFs
  {
    title: "Fill Blanks: Lambda & Higher-Order Functions",
    description: "Use lambdas as key functions and with map/filter expressions",
    activityType: "fill_blanks",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 15,
    tags: ["lambda", "map", "filter", "sorted", "fill-blanks"],
    content: {
      instructions:
        "Fill in the blanks to create lambda expressions for transformations and sorting.",
      exercises: [
        {
          id: 1,
          description: "Map increment",
          template:
            "data = [1,2,3]\nres = list(map(____ x: x+1, data))\nprint(res)",
          blanks: [{ id: "b1", answer: "lambda", position: 0 }],
          expectedOutput: "[2, 3, 4]",
        },
        {
          id: 2,
          description: "Filter even numbers",
          template:
            "nums = [1,2,3,4,5]\nevens = list(filter(lambda ____: n%2==0, nums))\nprint(evens)",
          blanks: [{ id: "b1", answer: "n", position: 0 }],
          expectedOutput: "[2, 4]",
        },
        {
          id: 3,
          description: "Sort by tuple second element",
          template:
            "items = [(2,'b'),(1,'a')]\nitems = sorted(items, key=____ p: p[0])\nprint(items)",
          blanks: [{ id: "b1", answer: "lambda", position: 0 }],
          expectedOutput: "[(1, 'a'), (2, 'b')]",
        },
      ],
    },
    settings: { timeLimit: 780, allowHints: true, caseSensitive: false },
    isActive: true,
    sortOrder: 7,
  },

  // 8) Difficulty 4 — Classes & __init__, instance vs class attributes
  {
    title: "Fill Blanks: Classes — __init__ and Attributes",
    description:
      "Initialize instance attributes and distinguish between class and instance attributes",
    activityType: "fill_blanks",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 80,
    estimatedMinutes: 16,
    tags: ["oop", "classes", "init", "attributes", "fill-blanks"],
    content: {
      instructions:
        "Fill in the blanks to construct classes with proper __init__ and attribute handling.",
      exercises: [
        {
          id: 1,
          description: "Set instance attribute in __init__",
          template:
            "class Point:\n    ____ __init__(self, x, y):\n        self.x = x\n        self.y = y\n\np = Point(2,3)\nprint(p.x + p.y)",
          blanks: [{ id: "b1", answer: "def", position: 0 }],
          expectedOutput: "5",
        },
        {
          id: 2,
          description: "Class attribute vs instance attribute",
          template:
            "class Counter:\n    total = ____\n    def __init__(self):\n        self.value = 0\n\nprint(Counter.total)",
          blanks: [{ id: "b1", answer: "0", position: 0 }],
          expectedOutput: "0",
        },
        {
          id: 3,
          description: "Readable representation via __repr__",
          template:
            "class User:\n    def __init__(self, name):\n        self.name = name\n    def ____(self):\n        return f\"User(name={self.name!r})\"\n\nprint(User('Ada'))",
          blanks: [{ id: "b1", answer: "__repr__", position: 0 }],
          expectedOutput: "User(name='Ada')",
        },
      ],
    },
    settings: { timeLimit: 840, allowHints: true, caseSensitive: false },
    isActive: true,
    sortOrder: 8,
  },

  // 9) Difficulty 4 — @property, @classmethod, @staticmethod
  {
    title: "Fill Blanks: @property, @classmethod, @staticmethod",
    description:
      "Complete method decorators and bodies for properties and class/static methods",
    activityType: "fill_blanks",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 82,
    estimatedMinutes: 18,
    tags: ["property", "classmethod", "staticmethod", "fill-blanks"],
    content: {
      instructions:
        "Fill the blanks to implement property accessors and class/static methods.",
      exercises: [
        {
          id: 1,
          description: "Create a read-only property",
          template:
            "class Box:\n    def __init__(self, n):\n        self._n = n\n    @____\n    def n(self):\n        return self._n\n\nprint(Box(5).n)",
          blanks: [{ id: "b1", answer: "property", position: 0 }],
          expectedOutput: "5",
        },
        {
          id: 2,
          description: "Class method as alternative constructor",
          template:
            "class Person:\n    def __init__(self, first, last):\n        self.first, self.last = first, last\n    @____\n    def from_fullname(cls, s):\n        f, l = s.split(' ')\n        return cls(f, l)\n\np = Person.from_fullname('Ada Lovelace')\nprint(p.last)",
          blanks: [{ id: "b1", answer: "classmethod", position: 0 }],
          expectedOutput: "Lovelace",
        },
        {
          id: 3,
          description: "Static method utility",
          template:
            "class Math:\n    @____\n    def is_even(x):\n        return x % 2 == 0\n\nprint(Math.is_even(4))",
          blanks: [{ id: "b1", answer: "staticmethod", position: 0 }],
          expectedOutput: "True",
        },
      ],
    },
    settings: { timeLimit: 900, allowHints: true, caseSensitive: false },
    isActive: true,
    sortOrder: 9,
  },

  // 10) Difficulty 5 — Inheritance, super(), __call__
  {
    title: "Fill Blanks: Inheritance, super(), and __call__",
    description:
      "Implement subclass overriding, cooperative super calls, and callable objects",
    activityType: "fill_blanks",
    category: "Functions & OOP",
    difficulty: 5,
    diamondReward: 48,
    experienceReward: 100,
    estimatedMinutes: 20,
    tags: ["inheritance", "super", "dunder", "callable", "fill-blanks"],
    content: {
      instructions: "Fill in the blanks to implement advanced OOP behaviors.",
      exercises: [
        {
          id: 1,
          description: "Subclass calls super in overridden method",
          template:
            "class Base:\n    def greet(self):\n        return 'Hello'\nclass Child(Base):\n    def greet(self):\n        return ____().greet() + ', world!'\n\nprint(Child().greet())",
          blanks: [{ id: "b1", answer: "super", position: 0 }],
          expectedOutput: "Hello, world!",
        },
        {
          id: 2,
          description: "Callable objects via __call__",
          template:
            "class Doubler:\n    def __call__(self, x):\n        return x * ____\n\nd = Doubler()\nprint(d(7))",
          blanks: [{ id: "b1", answer: "2", position: 0 }],
          expectedOutput: "14",
        },
        {
          id: 3,
          description: "MRO-friendly cooperative initialization",
          template:
            "class A:\n    def __init__(self):\n        ____().__init__()\nclass B(A):\n    def __init__(self):\n        ____().__init__()\n        self.x = 1\n\nprint(B().x)",
          blanks: [
            { id: "b1", answer: "super", position: 0 },
            { id: "b2", answer: "super", position: 1 },
          ],
          expectedOutput: "1",
        },
      ],
    },
    settings: { timeLimit: 960, allowHints: true, caseSensitive: false },
    isActive: true,
    sortOrder: 10,
  },
];

export async function seedFillBlanksFunctionsOOPActivities() {
  await seedActivitiesWithDuplicateCheck(
    fillBlanksFunctionsOOPActivities,
    "Fill-Blanks Functions & OOP"
  );
}

// Execute if run directly
if (require.main === module) {
  seedFillBlanksFunctionsOOPActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Fill-Blanks Functions & OOP activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
