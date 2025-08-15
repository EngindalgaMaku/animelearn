import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Interactive Demo Activities for Functions & OOP
 * 10 guided, step-by-step demos with mini-questions
 * Category: "Functions & OOP"
 *
 * Structure reference (see ACTIVITY_STRUCTURES.md):
 * {
 *   activityType: "interactive_demo",
 *   content: {
 *     title: string,
 *     description: string,
 *     steps: [{
 *       id: number,
 *       title: string,
 *       description: string,
 *       code: string,
 *       explanation: string,
 *       interactive?: boolean,
 *       questions?: [{ question, options, correct }]
 *     }],
 *     timeLimit?: number,
 *     language: "Python"
 *   },
 *   settings: { livePreview?: boolean, showResults?: boolean, allowHints?: boolean }
 * }
 */

export const interactiveDemoFunctionsOOPActivities = [
  // 1) Difficulty 1 — Functions: Definition & Call
  {
    title: "Interactive Demo: Functions — Define and Call",
    description:
      "Learn how to define a simple function, call it, and see what it returns or prints",
    activityType: "interactive_demo",
    category: "Functions & OOP",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 28,
    estimatedMinutes: 10,
    tags: ["functions", "def", "call", "basics", "interactive-demo"],
    content: {
      title: "Function Basics",
      description:
        "Understand Python function definitions, parameters, and basic calls.",
      steps: [
        {
          id: 1,
          title: "Define a Function",
          description:
            "Functions start with def, followed by a name and parentheses.",
          code: 'def greet(name):\n    return f"Hello, {name}!"',
          explanation:
            "The def keyword declares a function. Here greet returns a formatted string.",
          interactive: true,
          questions: [
            {
              question: "Which keyword defines a function?",
              options: ["func", "def", "lambda", "call"],
              correct: 1,
            },
          ],
        },
        {
          id: 2,
          title: "Call a Function",
          description:
            "Call with parentheses, pass required arguments, and inspect the result.",
          code: "result = greet('Ada')\nprint(result)",
          explanation: "Calling greet('Ada') returns a string, which we print.",
          interactive: true,
        },
      ],
      timeLimit: 480,
      language: "Python",
    },
    settings: { livePreview: true, showResults: true, allowHints: true },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Difficulty 1 — Parameters: Positional & Keyword
  {
    title: "Interactive Demo: Parameters — Positional and Keyword",
    description:
      "Practice passing arguments by position and by name, and see output differences",
    activityType: "interactive_demo",
    category: "Functions & OOP",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 28,
    estimatedMinutes: 10,
    tags: ["parameters", "positional", "keyword", "interactive-demo"],
    content: {
      title: "Positional vs Keyword Arguments",
      description:
        "Use positional arguments for order-sensitive calls and keyword arguments for clarity.",
      steps: [
        {
          id: 1,
          title: "Function with Two Parameters",
          description: "Define a function and call with positional arguments.",
          code: 'def format_name(first, last):\n    return f"{last}, {first}"\n\nprint(format_name("Ada", "Lovelace"))',
          explanation: "Positional arguments follow order: first, then last.",
          interactive: true,
        },
        {
          id: 2,
          title: "Call with Keyword Arguments",
          description: "Swap order safely using names.",
          code: 'print(format_name(last="Hopper", first="Grace"))',
          explanation:
            "Keyword arguments allow calling in any order by naming parameters explicitly.",
          interactive: true,
          questions: [
            {
              question: "Which call is valid keyword usage?",
              options: [
                "format_name('Grace', last='Hopper', 'x')",
                "format_name(first='Grace', last='Hopper')",
                "format_name(first:'Grace', last:'Hopper')",
                "format_name = {'first':'Grace'}",
              ],
              correct: 1,
            },
          ],
        },
      ],
      timeLimit: 480,
      language: "Python",
    },
    settings: { livePreview: true, showResults: true, allowHints: true },
    isActive: true,
    sortOrder: 2,
  },

  // 3) Difficulty 2 — Defaults and Keyword-Only
  {
    title: "Interactive Demo: Default and Keyword-Only Parameters",
    description:
      "Define defaults and restrict certain parameters to keyword-only for clarity",
    activityType: "interactive_demo",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 44,
    estimatedMinutes: 12,
    tags: ["defaults", "keyword-only", "interactive-demo"],
    content: {
      title: "Defaults & Keyword-Only",
      description:
        "Use defaults for convenience and '*' to enforce keyword-only arguments.",
      steps: [
        {
          id: 1,
          title: "Defaults",
          description: "Define default values to make parameters optional.",
          code: 'def greet(name, punctuation="!"):\n    return f"Hello, {name}{punctuation}"\n\nprint(greet("Ada"))\nprint(greet("Ada", "!!!"))',
          explanation: "When punctuation isn't provided, '!' is used.",
          interactive: true,
        },
        {
          id: 2,
          title: "Keyword-Only Parameters",
          description:
            "Force clarity by requiring certain parameters be passed by name.",
          code: "def format_name(first, last, *, upper=False):\n    out = f\"{last}, {first}\"\n    return out.upper() if upper else out\n\nprint(format_name('Ada','Lovelace', upper=True))",
          explanation: "Placing parameters after '*' makes them keyword-only.",
          interactive: true,
        },
      ],
      timeLimit: 540,
      language: "Python",
    },
    settings: { livePreview: true, showResults: true, allowHints: true },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Difficulty 2 — *args and **kwargs
  {
    title: "Interactive Demo: *args and **kwargs",
    description:
      "See how to collect extra positional and keyword arguments in functions",
    activityType: "interactive_demo",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 46,
    estimatedMinutes: 12,
    tags: ["args", "kwargs", "interactive-demo"],
    content: {
      title: "*args & **kwargs",
      description:
        "Capture variable numbers of arguments to make flexible APIs.",
      steps: [
        {
          id: 1,
          title: "*args",
          description: "Collect extra positional arguments into a tuple.",
          code: "def add_all(*args):\n    return sum(args)\n\nprint(add_all(1,2,3))  # 6",
          explanation:
            "*args is a tuple of extra positionals passed to the function.",
          interactive: true,
        },
        {
          id: 2,
          title: "**kwargs",
          description: "Collect extra keyword arguments into a dict.",
          code: "def has_flag(**kwargs):\n    return bool(kwargs.get('flag', False))\n\nprint(has_flag(flag=True))",
          explanation: "**kwargs is a dict for extra keyword arguments.",
          interactive: true,
        },
      ],
      timeLimit: 540,
      language: "Python",
    },
    settings: { livePreview: true, showResults: true, allowHints: true },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Difficulty 2 — Return Values & Tuples
  {
    title: "Interactive Demo: Return Values and Tuple Unpacking",
    description:
      "Return multiple values as tuples and unpack them into variables",
    activityType: "interactive_demo",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 46,
    estimatedMinutes: 12,
    tags: ["return", "tuple", "unpacking", "interactive-demo"],
    content: {
      title: "Multiple Returns",
      description:
        "Return multiple values by creating tuples implicitly or explicitly.",
      steps: [
        {
          id: 1,
          title: "Return a Tuple",
          description: "Create a tuple of stats and return it.",
          code: "def stats(nums):\n    return min(nums), max(nums), sum(nums)\n\nm, M, s = stats([3,1,5])\nprint(m, M, s)",
          explanation:
            "Returning multiple values yields a tuple; unpack it for readability.",
          interactive: true,
          questions: [
            {
              question:
                "What is the type of the object returned by stats before unpacking?",
              options: ["list", "tuple", "dict", "set"],
              correct: 1,
            },
          ],
        },
      ],
      timeLimit: 540,
      language: "Python",
    },
    settings: { livePreview: true, showResults: true, allowHints: true },
    isActive: true,
    sortOrder: 5,
  },

  // 6) Difficulty 3 — Scope & LEGB
  {
    title: "Interactive Demo: Scope and the LEGB Rule",
    description:
      "Visualize how names are resolved across Local, Enclosing, Global, and Built-in scopes",
    activityType: "interactive_demo",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 14,
    tags: ["scope", "LEGB", "global", "nonlocal", "interactive-demo"],
    content: {
      title: "LEGB Scoping",
      description:
        "Understand name resolution and how global/nonlocal modify behavior.",
      steps: [
        {
          id: 1,
          title: "Global vs Local",
          description: "Assign creates a local unless declared global.",
          code: "COUNT = 0\n\ndef inc():\n    global COUNT\n    COUNT += 1\n\ninc()\nprint(COUNT)",
          explanation:
            "Without global, assignment inside inc would create a new local 'COUNT'.",
          interactive: true,
        },
        {
          id: 2,
          title: "nonlocal in Closures",
          description: "Modify nearest enclosing scope for nested functions.",
          code: "def outer():\n    x = 0\n    def inner():\n        nonlocal x\n        x += 1\n        return x\n    return inner\n\ninc = outer()\nprint(inc())  # 1",
          explanation: "nonlocal targets the nearest enclosing function scope.",
          interactive: true,
        },
      ],
      timeLimit: 600,
      language: "Python",
    },
    settings: { livePreview: true, showResults: true, allowHints: true },
    isActive: true,
    sortOrder: 6,
  },

  // 7) Difficulty 3 — Lambda & Higher-Order Functions
  {
    title: "Interactive Demo: Lambda and Higher-Order Functions",
    description: "Use lambdas with map/filter and as key functions for sorting",
    activityType: "interactive_demo",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 14,
    tags: ["lambda", "map", "filter", "sorted", "interactive-demo"],
    content: {
      title: "Lambda & HOFs",
      description:
        "Lambda makes tiny anonymous functions; HOFs accept/return functions.",
      steps: [
        {
          id: 1,
          title: "Map and Filter",
          description: "Transform and select items using lambda.",
          code: "data = [1,2,3,4]\nprint(list(map(lambda x: x+1, data)))\nprint(list(filter(lambda n: n%2==0, data)))",
          explanation:
            "map applies a transform; filter selects items matching a predicate.",
          interactive: true,
        },
        {
          id: 2,
          title: "Sorting with key",
          description: "Provide a key extractor lambda to sorted.",
          code: "items = [(2,'b'), (1,'a')]\nprint(sorted(items, key=lambda p: p[0]))",
          explanation:
            "key receives item and returns the value used for comparison.",
          interactive: true,
        },
      ],
      timeLimit: 600,
      language: "Python",
    },
    settings: { livePreview: true, showResults: true, allowHints: true },
    isActive: true,
    sortOrder: 7,
  },

  // 8) Difficulty 3 — Closures & Decorators with @wraps
  {
    title: "Interactive Demo: Closures and Decorators (@wraps)",
    description:
      "Build a closure capturing state and a decorator preserving metadata",
    activityType: "interactive_demo",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 15,
    tags: ["closures", "decorators", "wraps", "interactive-demo"],
    content: {
      title: "Closures & Decorators",
      description: "Closures capture variables; decorators wrap call behavior.",
      steps: [
        {
          id: 1,
          title: "Closure Counter",
          description: "Increment state across calls using nonlocal.",
          code: "def make_counter():\n    x = 0\n    def inner():\n        nonlocal x\n        x += 1\n        return x\n    return inner\n\nc = make_counter()\nprint(c()); print(c())",
          explanation: "inner holds a reference to x defined in outer scope.",
          interactive: true,
        },
        {
          id: 2,
          title: "Decorator with wraps",
          description: "Preserve metadata of the wrapped function.",
          code: 'from functools import wraps\n\ndef log_calls(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        print(\'CALL\')\n        res = func(*args, **kwargs)\n        print(\'DONE\')\n        return res\n    return wrapper\n\n@log_calls\ndef add(a,b):\n    """Add two numbers"""\n    return a+b\n\nprint(add(2,3))\nprint(add.__name__)',
          explanation:
            "Use @wraps(func) to keep __name__, __doc__ and other metadata.",
          interactive: true,
        },
      ],
      timeLimit: 720,
      language: "Python",
    },
    settings: { livePreview: true, showResults: true, allowHints: true },
    isActive: true,
    sortOrder: 8,
  },

  // 9) Difficulty 2 — OOP Basics: Class and Instance Attributes
  {
    title: "Interactive Demo: Classes — Instance vs Class Attributes",
    description:
      "Define classes, initialize instances, and compare attribute scopes",
    activityType: "interactive_demo",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 46,
    estimatedMinutes: 12,
    tags: ["oop", "class-attr", "instance-attr", "interactive-demo"],
    content: {
      title: "Class vs Instance Attributes",
      description:
        "Class attributes live on the class; instance attributes live on each object.",
      steps: [
        {
          id: 1,
          title: "Define Class and Attributes",
          description:
            "Set class attribute and per-instance attributes in __init__.",
          code: "class Counter:\n    total = 0  # class attribute\n    def __init__(self):\n        self.value = 0  # instance attribute\n\nc = Counter()\nprint(Counter.total, c.value)",
          explanation:
            "Counter.total is shared across instances; c.value belongs to c.",
          interactive: true,
          questions: [
            {
              question: "Which line sets an instance attribute?",
              options: [
                "total = 0 (on class body)",
                "def __init__(self): self.value = 0",
                "Counter.total = 1 (later)",
                "class Counter: pass",
              ],
              correct: 1,
            },
          ],
        },
      ],
      timeLimit: 540,
      language: "Python",
    },
    settings: { livePreview: true, showResults: true, allowHints: true },
    isActive: true,
    sortOrder: 9,
  },

  // 10) Difficulty 3 — @property, @classmethod, @staticmethod
  {
    title: "Interactive Demo: @property, @classmethod, @staticmethod",
    description: "Create properties and method types for idiomatic Python OOP",
    activityType: "interactive_demo",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 15,
    tags: ["property", "classmethod", "staticmethod", "interactive-demo"],
    content: {
      title: "OOP Method Types",
      description:
        "Use properties for computed attributes, classmethod for alt constructors, and staticmethod for utilities.",
      steps: [
        {
          id: 1,
          title: "Property for Computed Attribute",
          description: "Expose area without parentheses.",
          code: "class Rect:\n    def __init__(self,w,h):\n        self.w, self.h = w, h\n    @property\n    def area(self):\n        return self.w * self.h\n\nprint(Rect(3,4).area)",
          explanation: "@property runs logic when accessed like an attribute.",
          interactive: true,
        },
        {
          id: 2,
          title: "class/staticmethod",
          description: "Create from_fullname and a simple utility method.",
          code: "class Person:\n    def __init__(self,f,l):\n        self.f, self.l = f, l\n    @classmethod\n    def from_fullname(cls,s):\n        f,l = s.split(' ',1)\n        return cls(f,l)\n    @staticmethod\n    def is_even(x):\n        return x%2==0\n\np = Person.from_fullname('Grace Hopper')\nprint(p.l)\nprint(Person.is_even(4))",
          explanation:
            "@classmethod receives cls for alt constructors; @staticmethod is a namespaced utility.",
          interactive: true,
        },
      ],
      timeLimit: 780,
      language: "Python",
    },
    settings: { livePreview: true, showResults: true, allowHints: true },
    isActive: true,
    sortOrder: 10,
  },
];

export async function seedInteractiveDemoFunctionsOOPActivities() {
  await seedActivitiesWithDuplicateCheck(
    interactiveDemoFunctionsOOPActivities,
    "Interactive-Demo Functions & OOP"
  );
}

// Execute if run directly
if (require.main === module) {
  seedInteractiveDemoFunctionsOOPActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Interactive-Demo Functions & OOP activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
