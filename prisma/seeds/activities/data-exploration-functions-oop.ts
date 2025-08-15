import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Data Exploration Activities for Functions & OOP
 * 10 activities with datasets and analytic questions
 * Category: "Functions & OOP"
 *
 * Structure (see ACTIVITY_STRUCTURES.md):
 * {
 *   activityType: "data_exploration",
 *   content: {
 *     title: string,
 *     instructions: string,
 *     dataset: any[],
 *     questions: [{ id, question, type, answer, hint }],
 *     allowExport?: boolean
 *   },
 *   settings: {
 *     timeLimit?: number,
 *     allowCalculator?: boolean,
 *     showDataPreview?: boolean,
 *     providePseudocode?: boolean
 *   }
 * }
 */

export const dataExplorationFunctionsOOPActivities = [
  // 1) Difficulty 1 — Functions catalog basics
  {
    title: "Explore: Functions Catalog — Names, Params, Docstrings",
    description:
      "Analyze a small catalog of functions and answer simple questions about their attributes",
    activityType: "data_exploration",
    category: "Functions & OOP",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 28,
    estimatedMinutes: 10,
    tags: ["functions", "docstring", "parameters", "catalog", "exploration"],
    content: {
      title: "Function Metadata Table",
      instructions:
        "Use the provided table to answer questions about function definitions, parameters, and docstrings.",
      dataset: [
        { name: "greet", params: ["name"], returns: "str", docstring: true },
        { name: "add", params: ["a", "b"], returns: "int", docstring: false },
        {
          name: "format_name",
          params: ["first", "last"],
          returns: "str",
          docstring: true,
        },
      ],
      questions: [
        {
          id: "q1",
          question: "How many functions in the dataset have a docstring?",
          type: "count",
          answer: "2",
          hint: "Check the docstring boolean field.",
        },
        {
          id: "q2",
          question: "Which function takes exactly one parameter?",
          type: "filter",
          answer: "greet",
          hint: "Look for params length.",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 480,
      allowCalculator: false,
      showDataPreview: true,
      providePseudocode: false,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Difficulty 1 — Positional/keyword calls log
  {
    title: "Explore: Calls Log — Positional vs Keyword",
    description:
      "Inspect a function calls log and identify usage patterns: positional or keyword arguments",
    activityType: "data_exploration",
    category: "Functions & OOP",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 28,
    estimatedMinutes: 10,
    tags: ["parameters", "positional", "keyword", "exploration"],
    content: {
      title: "Function Calls Log",
      instructions:
        "Given call entries, determine which calls used keyword arguments and which used positional.",
      dataset: [
        { fn: "format_name", call: "format_name('Ada','Lovelace')" },
        {
          fn: "format_name",
          call: "format_name(last='Hopper', first='Grace')",
        },
        { fn: "add", call: "add(3, 4)" },
        { fn: "add", call: "add(a=10, b=5)" },
      ],
      questions: [
        {
          id: "q1",
          question: "How many calls used keyword arguments?",
          type: "count",
          answer: "2",
          hint: "Look for name=value syntax in call strings.",
        },
        {
          id: "q2",
          question:
            "List the functions that were called at least once using keyword arguments.",
          type: "list",
          answer: "format_name, add",
          hint: "Aggregate by fn across call styles.",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 480,
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: false,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3) Difficulty 2 — *args / **kwargs usage metrics
  {
    title: "Explore: *args and **kwargs Usage Metrics",
    description:
      "Quantify usage patterns of variable arguments across a small codebase snapshot",
    activityType: "data_exploration",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 44,
    estimatedMinutes: 12,
    tags: ["args", "kwargs", "parameters", "analytics", "exploration"],
    content: {
      title: "Variable Arguments Inventory",
      instructions:
        "Count how many functions declare *args, **kwargs, or both, and list their names.",
      dataset: [
        { name: "sum_args", signature: "def sum_args(*args): ..." },
        { name: "has_flag", signature: "def has_flag(**kwargs): ..." },
        {
          name: "report",
          signature: "def report(title, *args, **kwargs): ...",
        },
        {
          name: "format_name",
          signature: "def format_name(first, last, *, upper=False): ...",
        },
      ],
      questions: [
        {
          id: "q1",
          question: "How many functions declare *args?",
          type: "count",
          answer: "2",
          hint: "Look for '*args' in signature.",
        },
        {
          id: "q2",
          question: "Which function(s) declare both *args and **kwargs?",
          type: "filter",
          answer: "report",
          hint: "Search for both patterns in a single signature.",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 540,
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: false,
    },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Difficulty 2 — Return values and None
  {
    title: "Explore: Return Patterns — Values vs None",
    description:
      "Analyze a set of function snippets to classify return behavior (explicit value vs implicit None)",
    activityType: "data_exploration",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 46,
    estimatedMinutes: 12,
    tags: ["return", "none", "semantics", "exploration"],
    content: {
      title: "Return Semantics Snapshot",
      instructions:
        "Classify each snippet by whether it returns a value or implicitly returns None.",
      dataset: [
        { name: "f", code: "def f():\n    pass" },
        { name: "g", code: "def g():\n    return 5" },
        { name: "h", code: "def h(x):\n    if x:\n        return True" },
        { name: "k", code: "def k(x):\n    return x, x*2" },
      ],
      questions: [
        {
          id: "q1",
          question:
            "How many functions definitely return None for some control path?",
          type: "count",
          answer: "2",
          hint: "Consider both explicit and missing return paths.",
        },
        {
          id: "q2",
          question:
            "Which function(s) always return a non-None value across all paths?",
          type: "filter",
          answer: "g, k",
          hint: "Missing legs in conditionals can imply None.",
        },
      ],
      allowExport: false,
    },
    settings: {
      timeLimit: 540,
      allowCalculator: false,
      showDataPreview: true,
      providePseudocode: false,
    },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Difficulty 3 — LEGB observations
  {
    title: "Explore: LEGB in Practice — Name Resolution Scenarios",
    description:
      "Evaluate LEGB cases from mini code contexts and answer scope questions",
    activityType: "data_exploration",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 14,
    tags: ["scope", "LEGB", "global", "nonlocal", "exploration"],
    content: {
      title: "Scope Cases",
      instructions:
        "Determine in which scope (Local, Enclosing, Global, Built-in) each reference resolves.",
      dataset: [
        { id: "case1", snippet: "x = 10\n\ndef f():\n    return x" },
        {
          id: "case2",
          snippet:
            "def outer():\n    y = 2\n    def inner():\n        return y\n    return inner()",
        },
        {
          id: "case3",
          snippet: "def g():\n    y = 5\n    return len([1,2,3])",
        },
        {
          id: "case4",
          snippet: "COUNT = 0\n\ndef inc():\n    global COUNT\n    COUNT += 1",
        },
      ],
      questions: [
        {
          id: "q1",
          question: "In case2, which scope provides the name 'y' for inner()?",
          type: "choice",
          answer: "Enclosing",
          hint: "Nested functions see outer variables.",
        },
        {
          id: "q2",
          question: "In case3, which scope is 'len' resolved from?",
          type: "choice",
          answer: "Built-in",
          hint: "Core functions live in builtins.",
        },
      ],
      allowExport: false,
    },
    settings: {
      timeLimit: 600,
      allowCalculator: false,
      showDataPreview: true,
      providePseudocode: false,
    },
    isActive: true,
    sortOrder: 5,
  },

  // 6) Difficulty 3 — Lambda & higher-order usage
  {
    title: "Explore: Lambdas and Higher-Order Functions",
    description:
      "Analyze a small code survey for lambda prevalence and typical HOFs (map, filter, sorted)",
    activityType: "data_exploration",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 15,
    tags: ["lambda", "map", "filter", "sorted", "higher-order", "exploration"],
    content: {
      title: "Lambda & HOF Survey",
      instructions:
        "From snippets, count how many use lambda and which HOF appears most often.",
      dataset: [
        { id: 1, code: "list(map(lambda x: x+1, data))" },
        { id: 2, code: "sorted(items, key=lambda p: p[1])" },
        { id: 3, code: "list(filter(lambda n: n%2==0, nums))" },
        { id: 4, code: "sum(values)" },
        { id: 5, code: "sorted(names, key=len)" },
      ],
      questions: [
        {
          id: "q1",
          question: "How many snippets use lambda?",
          type: "count",
          answer: "3",
          hint: "Search for the 'lambda' keyword.",
        },
        {
          id: "q2",
          question: "Which higher-order function appears the most?",
          type: "choice",
          answer: "sorted",
          hint: "Tally map/filter/sorted appearances.",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 660,
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: false,
    },
    isActive: true,
    sortOrder: 6,
  },

  // 7) Difficulty 4 — Decorators & metadata
  {
    title: "Explore: Decorators and Metadata Preservation",
    description:
      "Determine which decorated functions preserve original metadata (like __name__)",
    activityType: "data_exploration",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 80,
    estimatedMinutes: 16,
    tags: ["decorators", "wraps", "metadata", "exploration"],
    content: {
      title: "Decorator Review",
      instructions:
        "Inspect decorator definitions and usage to find which uses functools.wraps correctly.",
      dataset: [
        {
          name: "log_calls",
          code: "def log_calls(func):\n    def wrapper(*a, **k):\n        return func(*a, **k)\n    return wrapper",
        },
        {
          name: "trace",
          code: "from functools import wraps\n\ndef trace(func):\n    @wraps(func)\n    def wrapper(*a, **k):\n        return func(*a, **k)\n    return wrapper",
        },
        {
          name: "cached",
          code: "def cached(func):\n    cache = {}\n    def wrapper(*a, **k):\n        return func(*a, **k)\n    return wrapper",
        },
      ],
      questions: [
        {
          id: "q1",
          question:
            "Which decorator(s) preserve __name__/__doc__ of the wrapped function?",
          type: "filter",
          answer: "trace",
          hint: "Look for @wraps usage.",
        },
        {
          id: "q2",
          question: "How many decorators in the list do NOT preserve metadata?",
          type: "count",
          answer: "2",
          hint: "Count those lacking @wraps.",
        },
      ],
      allowExport: false,
    },
    settings: {
      timeLimit: 720,
      allowCalculator: false,
      showDataPreview: true,
      providePseudocode: false,
    },
    isActive: true,
    sortOrder: 7,
  },

  // 8) Difficulty 4 — OOP method types inventory
  {
    title: "Explore: Method Types — instance/class/static/property",
    description:
      "Classify methods across classes by decorator and derive distribution",
    activityType: "data_exploration",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 82,
    estimatedMinutes: 16,
    tags: [
      "classmethod",
      "staticmethod",
      "property",
      "instance",
      "exploration",
    ],
    content: {
      title: "Method Type Distribution",
      instructions:
        "Given class definitions, count instance methods, class methods, static methods, and properties.",
      dataset: [
        { class: "Rectangle", methods: ["__init__", "area@property"] },
        { class: "Math", methods: ["is_even@staticmethod"] },
        { class: "Person", methods: ["__init__", "from_fullname@classmethod"] },
        { class: "Bag", methods: ["__iter__", "__len__"] },
      ],
      questions: [
        {
          id: "q1",
          question: "How many @property methods exist in the dataset?",
          type: "count",
          answer: "1",
          hint: "Look for '@property' suffix markers.",
        },
        {
          id: "q2",
          question: "Which class defines a @classmethod?",
          type: "filter",
          answer: "Person",
          hint: "Search for '@classmethod' marker.",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 720,
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: false,
    },
    isActive: true,
    sortOrder: 8,
  },

  // 9) Difficulty 4 — Inheritance/MRO examples
  {
    title: "Explore: Inheritance Trees and MRO",
    description:
      "Given simple inheritance graphs, identify MRO or resolution outcomes",
    activityType: "data_exploration",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 82,
    estimatedMinutes: 17,
    tags: ["inheritance", "mro", "resolution", "exploration"],
    content: {
      title: "MRO Inspector",
      instructions:
        "For each class graph, provide the MRO order or the next method resolved via super().",
      dataset: [
        { classes: ["A", "B(A)", "C(A)", "D(B,C)"], query: "MRO(D)" },
        {
          classes: ["Base", "LoggerMixin", "Service(LoggerMixin, Base)"],
          query: "Service.start() super path",
        },
      ],
      questions: [
        {
          id: "q1",
          question: "For the diamond (A, B(A), C(A), D(B,C)), what is MRO(D)?",
          type: "sequence",
          answer: "D, B, C, A, object",
          hint: "Python uses C3 linearization.",
        },
        {
          id: "q2",
          question:
            "In Service(LoggerMixin, Base), super() in Service.start() calls which next start?",
          type: "choice",
          answer: "LoggerMixin.start or Base.start depending on defined chain",
          hint: "Follow the MRO left-to-right then bases.",
        },
      ],
      allowExport: false,
    },
    settings: {
      timeLimit: 900,
      allowCalculator: false,
      showDataPreview: true,
      providePseudocode: false,
    },
    isActive: true,
    sortOrder: 9,
  },

  // 10) Difficulty 5 — Descriptor/property access traces
  {
    title: "Explore: Descriptor Access — @property Traces",
    description:
      "Trace descriptor-based access for properties and compare to plain attributes",
    activityType: "data_exploration",
    category: "Functions & OOP",
    difficulty: 5,
    diamondReward: 48,
    experienceReward: 100,
    estimatedMinutes: 20,
    tags: ["descriptor", "property", "get", "protocol", "exploration"],
    content: {
      title: "Descriptor vs Plain Attribute",
      instructions:
        "Given property-based and plain attribute access logs, determine which used the descriptor protocol.",
      dataset: [
        {
          access: "Rect.area",
          type: "property",
          events: ["class lookup", "descriptor __get__", "fget call"],
        },
        {
          access: "Point.x",
          type: "plain",
          events: ["instance __dict__ lookup"],
        },
      ],
      questions: [
        {
          id: "q1",
          question: "Which access path invoked descriptor __get__?",
          type: "choice",
          answer: "Rect.area",
          hint: "Properties are descriptors on the class.",
        },
        {
          id: "q2",
          question: "Which access path performed only instance dict lookup?",
          type: "choice",
          answer: "Point.x",
          hint: "Plain attributes are stored in instance __dict__.",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 1020,
      allowCalculator: false,
      showDataPreview: true,
      providePseudocode: false,
    },
    isActive: true,
    sortOrder: 10,
  },
];

export async function seedDataExplorationFunctionsOOPActivities() {
  await seedActivitiesWithDuplicateCheck(
    dataExplorationFunctionsOOPActivities,
    "Data-Exploration Functions & OOP"
  );
}

// Execute if run directly
if (require.main === module) {
  seedDataExplorationFunctionsOOPActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Data-Exploration Functions & OOP activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
