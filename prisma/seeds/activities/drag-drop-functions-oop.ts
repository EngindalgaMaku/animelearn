import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Drag-Drop Activities for Functions & OOP
 * 10 activities, varied difficulties, covering core subtopics
 * Category: "Functions & OOP"
 *
 * Content schema aligns with ACTIVITY_STRUCTURES.md:
 * - content.items: [{ id: number, value: string, type: string }]
 * - content.categories: [{ id: string, name: string, description: string }]
 * - All item.type values must exist in categories[].id (validated in seed-utils)
 */

export const dragDropFunctionsOOPActivities = [
  // 1) Difficulty 1 - Function Concepts: Definition vs Call vs Return vs Docstring
  {
    title: "Classify Function Concepts: Definition, Call, Docstring, Return",
    description:
      "Drag each snippet into the correct category: definition, call, docstring, or return",
    activityType: "drag_drop",
    category: "Functions & OOP",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 28,
    estimatedMinutes: 8,
    tags: [
      "functions",
      "definition",
      "call",
      "docstring",
      "return",
      "drag-drop",
    ],
    content: {
      instructions:
        "Place each snippet into the correct category: Definition, Call, Docstring, or Return.",
      items: [
        { id: 1, value: "def greet(name):", type: "definition" },
        { id: 2, value: "greet('Alice')", type: "call" },
        { id: 3, value: '"""Say hello to a user"""', type: "docstring" },
        { id: 4, value: "return f'Hello, {name}!'", type: "return" },
        { id: 5, value: "def add(a, b=0):", type: "definition" },
        { id: 6, value: "add(3, b=4)", type: "call" },
        {
          id: 7,
          value: '"""Add two numbers, with default b=0"""',
          type: "docstring",
        },
        { id: 8, value: "return a + b", type: "return" },
      ],
      categories: [
        {
          id: "definition",
          name: "Definition",
          description: "Function header (def ...)",
        },
        { id: "call", name: "Call", description: "A function being invoked" },
        {
          id: "docstring",
          name: "Docstring",
          description: "Triple-quoted documentation string",
        },
        {
          id: "return",
          name: "Return",
          description: "Returning a value from a function",
        },
      ],
    },
    settings: {
      timeLimit: 240,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Difficulty 1 - Parameters: Positional/Keyword/Varargs
  {
    title: "Parameter Kinds: Positional, Keyword, *args, **kwargs",
    description:
      "Drag parameter examples into correct categories based on how they are passed/collected",
    activityType: "drag_drop",
    category: "Functions & OOP",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 28,
    estimatedMinutes: 9,
    tags: ["functions", "parameters", "args", "kwargs", "drag-drop"],
    content: {
      instructions:
        "Classify each snippet: positional argument, keyword argument, var-positional (*args), or var-keyword (**kwargs).",
      items: [
        { id: 1, value: "sum(3, 5)", type: "positional" },
        { id: 2, value: "sum(a=3, b=5)", type: "keyword" },
        { id: 3, value: "def f(*args): ...", type: "varpositional" },
        { id: 4, value: "def g(**kwargs): ...", type: "varkeyword" },
        { id: 5, value: "print('Age:', 21)", type: "positional" },
        { id: 6, value: "print(sep=' - ')", type: "keyword" },
        { id: 7, value: "def h(x, *args): ...", type: "varpositional" },
        { id: 8, value: "def p(x, **kwargs): ...", type: "varkeyword" },
      ],
      categories: [
        {
          id: "positional",
          name: "Positional",
          description: "Passed by position",
        },
        { id: "keyword", name: "Keyword", description: "Passed as key=value" },
        {
          id: "varpositional",
          name: "Var-Positional (*args)",
          description: "Collects extra positional args",
        },
        {
          id: "varkeyword",
          name: "Var-Keyword (**kwargs)",
          description: "Collects extra keyword args",
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
    sortOrder: 2,
  },

  // 3) Difficulty 2 - Scope & LEGB
  {
    title: "LEGB Scoping: Local, Enclosing, Global, Built-in",
    description:
      "Sort names by which scope they would be found in per LEGB resolution",
    activityType: "drag_drop",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 44,
    estimatedMinutes: 10,
    tags: ["scope", "LEGB", "nonlocal", "global", "functions", "drag-drop"],
    content: {
      instructions:
        "Classify each name based on typical resolution order: Local → Enclosing → Global → Built-in.",
      items: [
        { id: 1, value: "x inside def f(): x = 1", type: "local" },
        {
          id: 2,
          value: "name referenced in nested() from outer()",
          type: "enclosing",
        },
        { id: 3, value: "MODULE_LEVEL_VAR", type: "global" },
        { id: 4, value: "len", type: "builtin" },
        {
          id: 5,
          value: "declared with 'nonlocal name' inside inner()",
          type: "enclosing",
        },
        {
          id: 6,
          value: "declared with 'global COUNT' inside f()",
          type: "global",
        },
        { id: 7, value: "value bound on function parameter", type: "local" },
        { id: 8, value: "print", type: "builtin" },
      ],
      categories: [
        {
          id: "local",
          name: "Local",
          description: "Inside current function block",
        },
        {
          id: "enclosing",
          name: "Enclosing",
          description: "In nearest outer function scope",
        },
        { id: "global", name: "Global", description: "Module-level namespace" },
        {
          id: "builtin",
          name: "Built-in",
          description: "Names provided by Python runtime",
        },
      ],
    },
    settings: {
      timeLimit: 360,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Difficulty 2 - Lambda & Higher-Order Patterns
  {
    title: "Lambda & Higher-Order: map/filter/sorted Keys",
    description:
      "Classify each snippet by its role in higher-order function pipelines",
    activityType: "drag_drop",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 44,
    estimatedMinutes: 12,
    tags: ["lambda", "map", "filter", "sorted", "higher-order", "drag-drop"],
    content: {
      instructions:
        "Place each snippet into the matching category: Lambda, Map, Filter, or Key Function.",
      items: [
        { id: 1, value: "lambda x: x * 2", type: "lambda" },
        { id: 2, value: "map(lambda s: s.strip(), data)", type: "map" },
        { id: 3, value: "filter(lambda n: n % 2 == 0, nums)", type: "filter" },
        { id: 4, value: "sorted(items, key=lambda p: p[1])", type: "keyfn" },
        { id: 5, value: "lambda s: s.lower()", type: "lambda" },
        { id: 6, value: "map(str, numbers)", type: "map" },
        { id: 7, value: "filter(None, values)", type: "filter" },
        { id: 8, value: "sorted(words, key=len)", type: "keyfn" },
      ],
      categories: [
        {
          id: "lambda",
          name: "Lambda",
          description: "Anonymous function expressions",
        },
        { id: "map", name: "Map", description: "Transform a sequence" },
        {
          id: "filter",
          name: "Filter",
          description: "Keep items passing a predicate",
        },
        {
          id: "keyfn",
          name: "Key Function",
          description: "Key extractors for sorting/grouping",
        },
      ],
    },
    settings: {
      timeLimit: 420,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Difficulty 2 - Recursion Anatomy
  {
    title: "Recursion Anatomy: Base Case vs Recursive Step",
    description: "Drag statements to base case or recursive step categories",
    activityType: "drag_drop",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 44,
    estimatedMinutes: 10,
    tags: [
      "recursion",
      "base-case",
      "recursive-step",
      "functions",
      "drag-drop",
    ],
    content: {
      instructions:
        "Classify lines as Base Case or Recursive Step. Some common pitfalls are included.",
      items: [
        { id: 1, value: "if n == 0: return 1", type: "base" },
        { id: 2, value: "return n * fact(n-1)", type: "step" },
        { id: 3, value: "if not node: return 0", type: "base" },
        { id: 4, value: "return height(node.left) + 1", type: "step" },
        { id: 5, value: "if i == len(arr): return 0", type: "base" },
        { id: 6, value: "return arr[i] + sum_from(i+1)", type: "step" },
        { id: 7, value: "if n < 0: return 0", type: "base" },
        { id: 8, value: "return ways(n-1) + ways(n-2)", type: "step" },
      ],
      categories: [
        {
          id: "base",
          name: "Base Case",
          description: "Termination conditions",
        },
        {
          id: "step",
          name: "Recursive Step",
          description: "Progress toward base case",
        },
      ],
    },
    settings: {
      timeLimit: 360,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 5,
  },

  // 6) Difficulty 3 - OOP Roles: Class vs Instance vs Method Types
  {
    title: "OOP Roles: Class Attributes, Instance Attributes, Method Types",
    description:
      "Sort examples into class attribute, instance attribute, instance method, class method, or static method",
    activityType: "drag_drop",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 14,
    tags: [
      "oop",
      "class-attr",
      "instance-attr",
      "classmethod",
      "staticmethod",
      "drag-drop",
    ],
    content: {
      instructions:
        "Drag each to its correct category. Recall: @classmethod receives cls; @staticmethod receives no implicit arg.",
      items: [
        { id: 1, value: "class A: kind = 'shape'", type: "class_attr" },
        {
          id: 2,
          value: "def __init__(self): self.name = 'circle'",
          type: "instance_attr",
        },
        {
          id: 3,
          value: "def area(self): return self.r * self.r * 3.14",
          type: "instance_method",
        },
        {
          id: 4,
          value: "@classmethod\ndef from_tuple(cls, t): return cls(*t)",
          type: "class_method",
        },
        {
          id: 5,
          value: "@staticmethod\ndef is_positive(x): return x > 0",
          type: "static_method",
        },
        { id: 6, value: "class B: count = 0", type: "class_attr" },
        {
          id: 7,
          value: "def rename(self, v): self.name = v",
          type: "instance_method",
        },
        {
          id: 8,
          value: "def __init__(self): self._id = 42",
          type: "instance_attr",
        },
      ],
      categories: [
        {
          id: "class_attr",
          name: "Class Attribute",
          description: "Defined at class level",
        },
        {
          id: "instance_attr",
          name: "Instance Attribute",
          description: "Set on self in __init__/methods",
        },
        {
          id: "instance_method",
          name: "Instance Method",
          description: "Receives self",
        },
        {
          id: "class_method",
          name: "Class Method",
          description: "Receives cls (via @classmethod)",
        },
        {
          id: "static_method",
          name: "Static Method",
          description: "No implicit self/cls (via @staticmethod)",
        },
      ],
    },
    settings: {
      timeLimit: 480,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 6,
  },

  // 7) Difficulty 3 - Decorator Components
  {
    title: "Decorator Components: Wrapper, wraps, nonlocal vs Anti-Patterns",
    description:
      "Place each snippet under the proper decorator component or anti-pattern",
    activityType: "drag_drop",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 15,
    tags: ["decorators", "functools.wraps", "nonlocal", "drag-drop"],
    content: {
      instructions:
        "Identify good decorator building blocks vs anti-patterns (like shared mutable defaults).",
      items: [
        { id: 1, value: "from functools import wraps", type: "component" },
        {
          id: 2,
          value: "@wraps(func)\ndef wrapper(*args, **kwargs): ...",
          type: "component",
        },
        {
          id: 3,
          value:
            "def outer(func):\n  def wrapper(*a, **k): return func(*a, **k)\n  return wrapper",
          type: "component",
        },
        {
          id: 4,
          value: "counter = []  # default stored at definition",
          type: "antipattern",
        },
        {
          id: 5,
          value: "nonlocal count  # inside nested function",
          type: "component",
        },
        {
          id: 6,
          value: "state = {}  # shared mutable default across calls",
          type: "antipattern",
        },
        {
          id: 7,
          value:
            "def timed(func):\n  @wraps(func)\n  def wrapper(*a, **k): ...",
          type: "component",
        },
        {
          id: 8,
          value: "def cached(func, cache={}): ...",
          type: "antipattern",
        },
      ],
      categories: [
        {
          id: "component",
          name: "Decorator Component",
          description: "Good practice building blocks",
        },
        {
          id: "antipattern",
          name: "Anti-Pattern",
          description: "Problematic shared/mutable defaults, etc.",
        },
      ],
    },
    settings: {
      timeLimit: 540,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 7,
  },

  // 8) Difficulty 4 - Inheritance vs Composition vs MRO Terms
  {
    title: "Design Relations: Inheritance, Composition, and MRO Terms",
    description:
      "Classify phrases into inheritance, composition, or MRO-related concepts",
    activityType: "drag_drop",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 80,
    estimatedMinutes: 16,
    tags: ["inheritance", "composition", "mro", "super", "drag-drop"],
    content: {
      instructions:
        "Place each statement under Inheritance, Composition, or MRO (method resolution order).",
      items: [
        { id: 1, value: "Dog extends Animal (is-a)", type: "inheritance" },
        { id: 2, value: "Car has an Engine (has-a)", type: "composition" },
        { id: 3, value: "C3 linearization", type: "mro" },
        { id: 4, value: "super() follows MRO", type: "mro" },
        { id: 5, value: "Subclass overrides method", type: "inheritance" },
        { id: 6, value: "Object contains other objects", type: "composition" },
        {
          id: 7,
          value: "Deterministic lookup order for multiple inheritance",
          type: "mro",
        },
        { id: 8, value: "Share behavior via base class", type: "inheritance" },
      ],
      categories: [
        {
          id: "inheritance",
          name: "Inheritance",
          description: "is-a relationships",
        },
        {
          id: "composition",
          name: "Composition",
          description: "has-a relationships",
        },
        {
          id: "mro",
          name: "MRO",
          description: "Method resolution order topics",
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
    sortOrder: 8,
  },

  // 9) Difficulty 4 - Dunder Methods by Responsibility
  {
    title:
      "Dunder Methods: Construction, Representation, Comparison, Callable, Iteration, Context",
    description: "Sort dunder names into their primary responsibilities",
    activityType: "drag_drop",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 82,
    estimatedMinutes: 18,
    tags: [
      "dunder",
      "magic-methods",
      "repr",
      "iter",
      "call",
      "context",
      "drag-drop",
    ],
    content: {
      instructions: "Drag each dunder to the correct responsibility group.",
      items: [
        { id: 1, value: "__init__", type: "construction" },
        { id: 2, value: "__repr__", type: "representation" },
        { id: 3, value: "__eq__", type: "comparison" },
        { id: 4, value: "__call__", type: "callable" },
        { id: 5, value: "__iter__", type: "iteration" },
        { id: 6, value: "__len__", type: "iteration" },
        { id: 7, value: "__enter__", type: "context" },
        { id: 8, value: "__exit__", type: "context" },
      ],
      categories: [
        {
          id: "construction",
          name: "Construction",
          description: "Object creation/initialization",
        },
        {
          id: "representation",
          name: "Representation",
          description: "String representations",
        },
        {
          id: "comparison",
          name: "Comparison",
          description: "Equality/ordering semantics",
        },
        {
          id: "callable",
          name: "Callable",
          description: "Invoke instances like functions",
        },
        {
          id: "iteration",
          name: "Iteration",
          description: "Iterable and related protocols",
        },
        {
          id: "context",
          name: "Context Manager",
          description: "With-statement protocol",
        },
      ],
    },
    settings: {
      timeLimit: 660,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 9,
  },

  // 10) Difficulty 5 - Properties: Getter, Setter, Deleter vs Plain Members
  {
    title: "Properties: Getter/Setter/Deleter vs Plain Attributes/Methods",
    description:
      "Classify snippets into property getter/setter/deleter vs plain attribute/method",
    activityType: "drag_drop",
    category: "Functions & OOP",
    difficulty: 5,
    diamondReward: 48,
    experienceReward: 100,
    estimatedMinutes: 20,
    tags: [
      "property",
      "getter",
      "setter",
      "deleter",
      "attributes",
      "methods",
      "drag-drop",
    ],
    content: {
      instructions: "Identify property accessors vs plain attributes/methods.",
      items: [
        {
          id: 1,
          value: "@property\ndef x(self): return self._x",
          type: "prop_get",
        },
        {
          id: 2,
          value: "@x.setter\ndef x(self, v): self._x = v",
          type: "prop_set",
        },
        {
          id: 3,
          value: "@x.deleter\ndef x(self): del self._x",
          type: "prop_del",
        },
        { id: 4, value: "self.x = 5", type: "plain_attr" },
        {
          id: 5,
          value: "def get_x(self): return self._x",
          type: "plain_method",
        },
        {
          id: 6,
          value: "def set_x(self, v): self._x = v",
          type: "plain_method",
        },
        { id: 7, value: "x = property()", type: "prop_get" },
        { id: 8, value: "self._x", type: "plain_attr" },
      ],
      categories: [
        {
          id: "prop_get",
          name: "Property Getter",
          description: "Access managed attribute",
        },
        {
          id: "prop_set",
          name: "Property Setter",
          description: "Mutate managed attribute",
        },
        {
          id: "prop_del",
          name: "Property Deleter",
          description: "Delete managed attribute",
        },
        {
          id: "plain_attr",
          name: "Plain Attribute",
          description: "Direct attribute usage",
        },
        {
          id: "plain_method",
          name: "Plain Method",
          description: "Traditional getter/setter style",
        },
      ],
    },
    settings: {
      timeLimit: 780,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 10,
  },
];

export async function seedDragDropFunctionsOOPActivities() {
  await seedActivitiesWithDuplicateCheck(
    dragDropFunctionsOOPActivities,
    "Drag-Drop Functions & OOP"
  );
}

// Execute if run directly
if (require.main === module) {
  seedDragDropFunctionsOOPActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Drag-Drop Functions & OOP activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
