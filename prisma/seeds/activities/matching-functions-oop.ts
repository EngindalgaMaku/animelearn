import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Matching Activities for Functions & OOP
 * 10 activities with increasing difficulty
 * Category: "Functions & OOP"
 *
 * Structure aligns with ACTIVITY_STRUCTURES.md:
 * activityType: "matching"
 * content: { instructions: string, pairs: [{ id, left, right, explanation? }] }
 */

export const matchingFunctionsOOPActivities = [
  // 1) Difficulty 1 — Core concepts
  {
    title: "Match: Function Concepts — Parameter, Argument, Return, Docstring",
    description:
      "Match common function terminology to their correct definitions",
    activityType: "matching",
    category: "Functions & OOP",
    difficulty: 1,
    diamondReward: 18,
    experienceReward: 40,
    estimatedMinutes: 10,
    tags: ["functions", "terminology", "parameters", "docstring", "matching"],
    content: {
      instructions:
        "Match each function term with the most accurate description.",
      pairs: [
        {
          id: "1",
          left: "Parameter",
          right: "Variable in the function definition that receives a value",
          explanation:
            "Parameters are placeholders in the definition: def f(x): ...",
        },
        {
          id: "2",
          left: "Argument",
          right: "Actual value passed to a function during a call",
          explanation: "Arguments are concrete values at call sites: f(10).",
        },
        {
          id: "3",
          left: "Return value",
          right: "The value a function outputs to its caller",
          explanation:
            "If no return is provided, Python returns None implicitly.",
        },
        {
          id: "4",
          left: "Docstring",
          right: "A triple-quoted string documenting a function’s behavior",
          explanation:
            "Placed as the first statement inside a function for help() and tooling.",
        },
      ],
    },
    settings: {
      allowMultipleAttempts: true,
      showExplanations: true,
      timeLimit: 300,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Difficulty 1 — Print vs Return
  {
    title: "Match: Print vs Return (Basics)",
    description:
      "Distinguish between printed output and returned values in simple functions",
    activityType: "matching",
    category: "Functions & OOP",
    difficulty: 1,
    diamondReward: 18,
    experienceReward: 40,
    estimatedMinutes: 10,
    tags: ["functions", "print", "return", "matching"],
    content: {
      instructions:
        "Match each function usage with whether it prints text or returns a value.",
      pairs: [
        {
          id: "1",
          left: "print(3 + 4)",
          right: "Prints 7; returns None",
          explanation: "print writes to stdout and returns None.",
        },
        {
          id: "2",
          left: "def f(): return 5",
          right: "Returns 5; prints nothing",
          explanation: "Returning a value does not print by itself.",
        },
        {
          id: "3",
          left: "def g(x): print(x)",
          right: "Prints x; returns None",
          explanation: "No return statement → implicit None.",
        },
        {
          id: "4",
          left: "def h(): pass",
          right: "Returns None; prints nothing",
          explanation: "pass indicates no operation; no return → None.",
        },
      ],
    },
    settings: {
      allowMultipleAttempts: true,
      showExplanations: true,
      timeLimit: 300,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3) Difficulty 2 — Parameter kinds
  {
    title: "Match: Parameter Kinds — Positional, Keyword, *args, **kwargs",
    description:
      "Match examples to parameter kinds and how they are passed/collected",
    activityType: "matching",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 22,
    experienceReward: 50,
    estimatedMinutes: 12,
    tags: ["functions", "parameters", "args", "kwargs", "matching"],
    content: {
      instructions:
        "Match each snippet to its correct parameter kind in Python functions.",
      pairs: [
        {
          id: "1",
          left: "f(10, 20)",
          right: "Positional arguments",
          explanation: "Values passed by order.",
        },
        {
          id: "2",
          left: "f(a=10, b=20)",
          right: "Keyword arguments",
          explanation: "Values passed by name.",
        },
        {
          id: "3",
          left: "def g(*args): ...",
          right: "Var-positional arguments",
          explanation: "Collects extra positionals as a tuple.",
        },
        {
          id: "4",
          left: "def h(**kwargs): ...",
          right: "Var-keyword arguments",
          explanation: "Collects extra keywords into a dict.",
        },
      ],
    },
    settings: {
      allowMultipleAttempts: true,
      showExplanations: true,
      timeLimit: 360,
    },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Difficulty 2 — Default arguments best practice
  {
    title: "Match: Default Arguments — Safe vs Risky",
    description: "Identify safe default patterns and risky mutable defaults",
    activityType: "matching",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 22,
    experienceReward: 50,
    estimatedMinutes: 13,
    tags: ["functions", "defaults", "mutable", "best-practices", "matching"],
    content: {
      instructions:
        "Match each function signature or idiom to whether it is safe or risky.",
      pairs: [
        {
          id: "1",
          left: "def add_item(x, items=None):\n  if items is None: items=[]",
          right: "Safe pattern for mutable defaults",
          explanation: "Avoids sharing the same list across calls.",
        },
        {
          id: "2",
          left: "def add_item(x, items=[]): items.append(x)",
          right: "Risky — shared mutable default",
          explanation: "Same list instance reused across calls.",
        },
        {
          id: "3",
          left: "def f(flag=True): ...",
          right: "Safe immutable default",
          explanation:
            "Booleans (and numbers/strings/None) are safe as defaults.",
        },
        {
          id: "4",
          left: "def g(data={}): ...",
          right: "Risky — shared mutable default",
          explanation: "Dict default persists between calls.",
        },
      ],
    },
    settings: {
      allowMultipleAttempts: true,
      showExplanations: true,
      timeLimit: 380,
    },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Difficulty 3 — Scope & LEGB
  {
    title: "Match: Scope & LEGB — Local, Enclosing, Global, Built-in",
    description: "Match names to the scope that resolves them per LEGB rule",
    activityType: "matching",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 26,
    experienceReward: 60,
    estimatedMinutes: 14,
    tags: ["scope", "LEGB", "nonlocal", "global", "matching"],
    content: {
      instructions:
        "Match each reference with the scope it comes from in typical code.",
      pairs: [
        {
          id: "1",
          left: "x defined inside current function",
          right: "Local",
          explanation:
            "Variables assigned in a function are local unless declared otherwise.",
        },
        {
          id: "2",
          left: "name referenced from immediately outer function",
          right: "Enclosing",
          explanation:
            "Nested functions can see names in their enclosing function.",
        },
        {
          id: "3",
          left: "MODULE_CONSTANT at top of file",
          right: "Global",
          explanation: "Module-level names are globals for that module.",
        },
        {
          id: "4",
          left: "len, print, range",
          right: "Built-in",
          explanation: "Provided by Python runtime in builtins.",
        },
      ],
    },
    settings: {
      allowMultipleAttempts: true,
      showExplanations: true,
      timeLimit: 420,
    },
    isActive: true,
    sortOrder: 5,
  },

  // 6) Difficulty 3 — Lambda & HOFs
  {
    title: "Match: Lambda & Higher-Order Functions",
    description:
      "Associate higher-order expressions with their outcomes or purposes",
    activityType: "matching",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 15,
    tags: ["lambda", "map", "filter", "sorted", "higher-order", "matching"],
    content: {
      instructions:
        "Match each expression to the most accurate result or description.",
      pairs: [
        {
          id: "1",
          left: "list(map(lambda x: x+1, [1,2,3]))",
          right: "[2, 3, 4]",
          explanation: "Map applies a transform to each element.",
        },
        {
          id: "2",
          left: "list(filter(lambda n: n%2==0, [1,2,3,4]))",
          right: "[2, 4]",
          explanation: "Filter keeps items passing predicate.",
        },
        {
          id: "3",
          left: "sorted(['a','bbb','cc'], key=len)",
          right: "['a', 'cc', 'bbb']",
          explanation: "Sort using key extractor function.",
        },
        {
          id: "4",
          left: "lambda s: s.upper()",
          right: "Anonymous function turning text uppercase",
          explanation: "Lambdas are expressions producing functions.",
        },
      ],
    },
    settings: {
      allowMultipleAttempts: true,
      showExplanations: true,
      timeLimit: 450,
    },
    isActive: true,
    sortOrder: 6,
  },

  // 7) Difficulty 3 — Closures & decorators
  {
    title: "Match: Closures, nonlocal, and Decorator Components",
    description:
      "Connect closure/decorator elements to their descriptions or effects",
    activityType: "matching",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 16,
    tags: ["closures", "decorators", "nonlocal", "wraps", "matching"],
    content: {
      instructions:
        "Match each concept with the correct explanation or purpose.",
      pairs: [
        {
          id: "1",
          left: "Closure",
          right: "Function that captures variables from its enclosing scope",
          explanation: "Retains bindings after outer scope returns.",
        },
        {
          id: "2",
          left: "nonlocal",
          right:
            "Allows assignment to a name in the nearest enclosing function scope",
          explanation:
            "Used in nested functions to rebind outer-scope variables.",
        },
        {
          id: "3",
          left: "functools.wraps",
          right: "Preserves __name__/__doc__ when writing decorators",
          explanation: "Use @wraps on the wrapper to keep metadata.",
        },
        {
          id: "4",
          left: "Decorator",
          right:
            "Callable that takes a function and returns a wrapped function",
          explanation:
            "Adds behavior without changing the original function body.",
        },
      ],
    },
    settings: {
      allowMultipleAttempts: true,
      showExplanations: true,
      timeLimit: 480,
    },
    isActive: true,
    sortOrder: 7,
  },

  // 8) Difficulty 3 — OOP basics
  {
    title: "Match: OOP Basics — Class/Instance Attributes and __init__",
    description:
      "Match class vs instance attribute behaviors and initialization",
    activityType: "matching",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 16,
    tags: ["oop", "class-attr", "instance-attr", "init", "matching"],
    content: {
      instructions:
        "Match each code snippet or term to the correct OOP concept.",
      pairs: [
        {
          id: "1",
          left: "class A:\n  kind = 'shape'",
          right: "Class attribute",
          explanation:
            "Defined on the class; shared by instances unless shadowed.",
        },
        {
          id: "2",
          left: "def __init__(self, n): self.n = n",
          right: "Instance attribute initialization",
          explanation: "self.n is per-instance state.",
        },
        {
          id: "3",
          left: "obj.n vs A.kind",
          right: "Instance attribute vs class attribute access",
          explanation:
            "Instance attrs live in instance; class attrs on the class.",
        },
        {
          id: "4",
          left: "__repr__",
          right: "Unambiguous developer representation of an object",
          explanation:
            "Often helpful for debugging; __str__ for user-friendly text.",
        },
      ],
    },
    settings: {
      allowMultipleAttempts: true,
      showExplanations: true,
      timeLimit: 480,
    },
    isActive: true,
    sortOrder: 8,
  },

  // 9) Difficulty 4 — Method types & property
  {
    title: "Match: Instance/Class/Static Methods and @property",
    description: "Map method decorators and usage to their roles and behaviors",
    activityType: "matching",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 34,
    experienceReward: 80,
    estimatedMinutes: 18,
    tags: ["classmethod", "staticmethod", "property", "methods", "matching"],
    content: {
      instructions:
        "Match method definitions or decorators to the correct description.",
      pairs: [
        {
          id: "1",
          left: "@classmethod\ndef from_str(cls, s): ...",
          right: "Receives class as first argument (cls)",
          explanation: "Alternate constructors are common.",
        },
        {
          id: "2",
          left: "@staticmethod\ndef is_ok(x): return x > 0",
          right: "No implicit self/cls; utility function namespaced on class",
          explanation: "Behaves like a plain function stored on the class.",
        },
        {
          id: "3",
          left: "@property\ndef size(self): return self._n",
          right: "Attribute-style access via descriptor",
          explanation: "Allows logic to run on access without parentheses.",
        },
        {
          id: "4",
          left: "def area(self): ...",
          right: "Instance method (receives self)",
          explanation: "Default method type for operating on instance state.",
        },
      ],
    },
    settings: {
      allowMultipleAttempts: true,
      showExplanations: true,
      timeLimit: 540,
    },
    isActive: true,
    sortOrder: 9,
  },

  // 10) Difficulty 5 — Inheritance, Polymorphism, MRO, Dunder
  {
    title: "Match: Advanced OOP — Inheritance, Polymorphism, MRO, Dunder",
    description:
      "Connect advanced OOP terms and patterns to their precise definitions",
    activityType: "matching",
    category: "Functions & OOP",
    difficulty: 5,
    diamondReward: 45,
    experienceReward: 95,
    estimatedMinutes: 20,
    tags: ["inheritance", "polymorphism", "mro", "dunder", "super", "matching"],
    content: {
      instructions:
        "Match each advanced OOP concept to the correct description.",
      pairs: [
        {
          id: "1",
          left: "Polymorphism",
          right: "Different types used interchangeably via common interface",
          explanation: "Focus on shared behavior, not exact concrete types.",
        },
        {
          id: "2",
          left: "super()",
          right: "Follows Method Resolution Order to delegate to next class",
          explanation:
            "Not necessarily the immediate parent; uses C3 linearization.",
        },
        {
          id: "3",
          left: "MRO (Method Resolution Order)",
          right: "Deterministic order for attribute/method lookup",
          explanation:
            "Defined by C3 linearization to resolve multiple inheritance.",
        },
        {
          id: "4",
          left: "__call__",
          right: "Makes instances callable like functions",
          explanation: "obj() invokes obj.__call__ if defined.",
        },
      ],
    },
    settings: {
      allowMultipleAttempts: true,
      showExplanations: true,
      timeLimit: 600,
    },
    isActive: true,
    sortOrder: 10,
  },
];

export async function seedMatchingFunctionsOOPActivities() {
  await seedActivitiesWithDuplicateCheck(
    matchingFunctionsOOPActivities,
    "Matching Functions & OOP"
  );
}

// Execute if run directly
if (require.main === module) {
  seedMatchingFunctionsOOPActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Matching Functions & OOP activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
