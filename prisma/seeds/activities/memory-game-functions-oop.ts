import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Memory Game Activities for Functions & OOP
 * 10 activities with increasing difficulty
 * Category: "Functions & OOP"
 *
 * Structure reference (see ACTIVITY_STRUCTURES.md):
 * {
 *   activityType: "memory_game",
 *   content: {
 *     instructions: string,
 *     pairs: [{ id, card1, card2 }],
 *     timeLimit?: number,
 *     shuffleCards?: boolean
 *   },
 *   settings: { maxFlips?: number, showTimer?: boolean }
 * }
 */

export const memoryGameFunctionsOOPActivities = [
  // 1) Difficulty 1 — Functions: print and return basics
  {
    title: "Memory: Function Basics — Print vs Return",
    description:
      "Match simple function uses with their output or return value understanding",
    activityType: "memory_game",
    category: "Functions & OOP",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 28,
    estimatedMinutes: 8,
    tags: ["functions", "print", "return", "basics", "memory-game"],
    content: {
      instructions:
        "Match Python function calls with their printed output or returned value.",
      pairs: [
        { id: 1, card1: "print(1 + 2)", card2: "3" },
        { id: 2, card1: "def f(): pass\nprint(f())", card2: "None" },
        { id: 3, card1: "def g(): return 5\nprint(g())", card2: "5" },
        { id: 4, card1: "def h(x): return x*2\nprint(h(3))", card2: "6" },
      ],
      timeLimit: 210,
      shuffleCards: true,
    },
    settings: {
      maxFlips: 24,
      showTimer: true,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Difficulty 1 — Parameters: positional & keyword
  {
    title: "Memory: Parameters — Positional vs Keyword",
    description:
      "Match function calls to how arguments are passed and their result",
    activityType: "memory_game",
    category: "Functions & OOP",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 28,
    estimatedMinutes: 9,
    tags: ["functions", "parameters", "positional", "keyword", "memory-game"],
    content: {
      instructions:
        "Match examples of positional vs keyword arguments with their outcomes.",
      pairs: [
        {
          id: 1,
          card1: "def add(a,b): return a+b\nadd(2,3)",
          card2: "5 (positional)",
        },
        { id: 2, card1: "add(a=2,b=4)", card2: "6 (keyword)" },
        {
          id: 3,
          card1: "def shout(msg='hi'):\n  return msg.upper()",
          card2: "Default parameter",
        },
        { id: 4, card1: "shout('ok')", card2: "OK" },
      ],
      timeLimit: 240,
      shuffleCards: true,
    },
    settings: { maxFlips: 26, showTimer: true },
    isActive: true,
    sortOrder: 2,
  },

  // 3) Difficulty 2 — *args / **kwargs
  {
    title: "Memory: *args and **kwargs",
    description:
      "Match calls using var-positional and var-keyword arguments to effects",
    activityType: "memory_game",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 44,
    estimatedMinutes: 11,
    tags: ["functions", "args", "kwargs", "parameters", "memory-game"],
    content: {
      instructions:
        "Match function signatures and calls with how arguments are captured.",
      pairs: [
        {
          id: 1,
          card1: "def f(*args): return len(args)\nf(1,2,3)",
          card2: "3",
        },
        {
          id: 2,
          card1: "def g(**kw): return 'x' in kw\ng(x=10)",
          card2: "True",
        },
        {
          id: 3,
          card1: "def h(a,*b): return b\nh(1,2,3)",
          card2: "(2, 3)",
        },
        {
          id: 4,
          card1: "def p(a,**k): return k.get('y',0)\np(7,y=5)",
          card2: "5",
        },
      ],
      timeLimit: 270,
      shuffleCards: true,
    },
    settings: { maxFlips: 26, showTimer: true },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Difficulty 2 — Return tuples & unpacking
  {
    title: "Memory: Return Tuples & Unpacking",
    description:
      "Match functions returning multiple values with their tuple/unpacked results",
    activityType: "memory_game",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 44,
    estimatedMinutes: 12,
    tags: ["functions", "return", "tuple", "unpacking", "memory-game"],
    content: {
      instructions:
        "Match multiple-return examples to their tuple result or unpacked variables.",
      pairs: [
        {
          id: 1,
          card1: "def pair(): return (1,2)\nx = pair()\nprint(x)",
          card2: "(1, 2)",
        },
        {
          id: 2,
          card1: "a,b = (3,4)\nprint(a+b)",
          card2: "7",
        },
        {
          id: 3,
          card1: "def f(): return 10,20\na,b = f(); print(a)",
          card2: "10",
        },
        {
          id: 4,
          card1: "def g(): return 'x',\nprint(len(g()))",
          card2: "1",
        },
      ],
      timeLimit: 300,
      shuffleCards: true,
    },
    settings: { maxFlips: 26, showTimer: true },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Difficulty 3 — Scope & LEGB
  {
    title: "Memory: Scope & LEGB",
    description:
      "Match examples to the scope concept they demonstrate (local, enclosing, global, built-in)",
    activityType: "memory_game",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 14,
    tags: ["scope", "LEGB", "nonlocal", "global", "memory-game"],
    content: {
      instructions:
        "Match code snippets with their scope category per Python's LEGB rule.",
      pairs: [
        { id: 1, card1: "x = 1  # module level", card2: "Global" },
        {
          id: 2,
          card1: "def outer():\n  y=2\n  def inner():\n    return y",
          card2: "Enclosing",
        },
        { id: 3, card1: "def f(): z=3; return z", card2: "Local" },
        { id: 4, card1: "len, print", card2: "Built-in" },
      ],
      timeLimit: 330,
      shuffleCards: true,
    },
    settings: { maxFlips: 28, showTimer: true },
    isActive: true,
    sortOrder: 5,
  },

  // 6) Difficulty 3 — Lambdas & HOFs (map/filter/sorted)
  {
    title: "Memory: Lambdas & Higher-Order Functions",
    description:
      "Match higher-order function pipelines with their resulting output",
    activityType: "memory_game",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 15,
    tags: ["lambda", "map", "filter", "sorted", "hof", "memory-game"],
    content: {
      instructions:
        "Match HOF expressions with the output they produce (conceptual).",
      pairs: [
        {
          id: 1,
          card1: "list(map(lambda x:x+1,[1,2,3]))",
          card2: "[2, 3, 4]",
        },
        {
          id: 2,
          card1: "list(filter(lambda n:n%2==0,[1,2,3,4]))",
          card2: "[2, 4]",
        },
        {
          id: 3,
          card1: "sorted(['a','bbb','cc'], key=len)",
          card2: "['a','cc','bbb']",
        },
        {
          id: 4,
          card1: "sorted([(2,'b'),(1,'a')], key=lambda p:p[0])",
          card2: "[(1,'a'), (2,'b')]",
        },
      ],
      timeLimit: 360,
      shuffleCards: true,
    },
    settings: { maxFlips: 28, showTimer: true },
    isActive: true,
    sortOrder: 6,
  },

  // 7) Difficulty 4 — Closures & nonlocal
  {
    title: "Memory: Closures & nonlocal",
    description:
      "Match closure behaviors with outcomes and the role of nonlocal",
    activityType: "memory_game",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 80,
    estimatedMinutes: 16,
    tags: ["closures", "nonlocal", "enclosing", "decorators", "memory-game"],
    content: {
      instructions:
        "Match closure snippets with their outputs or conceptual explanation.",
      pairs: [
        {
          id: 1,
          card1:
            "def outer():\n  x=0\n  def inner():\n    nonlocal x\n    x+=1\n    return x\n  return inner",
          card2: "Inner updates x in enclosing scope",
        },
        {
          id: 2,
          card1: "inc = outer(); inc(); print(inc())",
          card2: "2",
        },
        {
          id: 3,
          card1: "Closure",
          card2: "Function capturing variables from enclosing scope",
        },
        {
          id: 4,
          card1: "Mutable default in closure",
          card2: "Risk: shared state across calls",
        },
      ],
      timeLimit: 390,
      shuffleCards: true,
    },
    settings: { maxFlips: 30, showTimer: true },
    isActive: true,
    sortOrder: 7,
  },

  // 8) Difficulty 4 — Classes & Objects
  {
    title: "Memory: Classes & Objects — Attributes and __init__",
    description:
      "Match class instantiation and attribute access with expected results",
    activityType: "memory_game",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 82,
    estimatedMinutes: 17,
    tags: ["oop", "classes", "objects", "attributes", "init", "memory-game"],
    content: {
      instructions: "Match class usage examples with their printed results.",
      pairs: [
        {
          id: 1,
          card1: "class A:\n  def __init__(self,n): self.n=n\nprint(A(5).n)",
          card2: "5",
        },
        {
          id: 2,
          card1: "class B:\n  x=10\nb=B(); print(b.x)",
          card2: "10 (class attribute)",
        },
        {
          id: 3,
          card1:
            "class C:\n  def __init__(self): self.x=1\nc=C(); c.x=7; print(c.x)",
          card2: "7 (instance attribute)",
        },
        {
          id: 4,
          card1: "class D:\n  def __repr__(self): return 'D()'\nprint(D())",
          card2: "D()",
        },
      ],
      timeLimit: 420,
      shuffleCards: true,
    },
    settings: { maxFlips: 30, showTimer: true },
    isActive: true,
    sortOrder: 8,
  },

  // 9) Difficulty 4 — Method types & @property
  {
    title: "Memory: Method Types & @property",
    description:
      "Match instance/class/static methods and properties to behavior/results",
    activityType: "memory_game",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 82,
    estimatedMinutes: 18,
    tags: ["classmethod", "staticmethod", "property", "methods", "memory-game"],
    content: {
      instructions:
        "Match method definitions with the results they produce when called.",
      pairs: [
        {
          id: 1,
          card1:
            "class X:\n  @classmethod\n  def c(cls): return cls.__name__\nprint(X.c())",
          card2: "X",
        },
        {
          id: 2,
          card1:
            "class Y:\n  @staticmethod\n  def s(x): return x*2\nprint(Y.s(3))",
          card2: "6",
        },
        {
          id: 3,
          card1:
            "class Z:\n  def __init__(self): self._v=5\n  @property\n  def v(self): return self._v\nprint(Z().v)",
          card2: "5",
        },
        {
          id: 4,
          card1: "class N:\n  def f(self): return 'ok'\nprint(N().f())",
          card2: "ok (instance method)",
        },
      ],
      timeLimit: 450,
      shuffleCards: true,
    },
    settings: { maxFlips: 32, showTimer: true },
    isActive: true,
    sortOrder: 9,
  },

  // 10) Difficulty 5 — Inheritance, MRO, Dunder
  {
    title: "Memory: Inheritance, MRO & Dunder",
    description:
      "Match inheritance/MRO/dunder examples with their behavior or concept",
    activityType: "memory_game",
    category: "Functions & OOP",
    difficulty: 5,
    diamondReward: 48,
    experienceReward: 100,
    estimatedMinutes: 20,
    tags: ["inheritance", "mro", "dunder", "super", "memory-game"],
    content: {
      instructions:
        "Match advanced OOP patterns with their outcomes or definitions.",
      pairs: [
        {
          id: 1,
          card1: "class A:\n  def __str__(self): return 'A'\nprint(str(A()))",
          card2: "A",
        },
        {
          id: 2,
          card1: "class B:\n  def __call__(self): return 7\nprint(B()())",
          card2: "7",
        },
        {
          id: 3,
          card1: "super()",
          card2: "Next class in MRO",
        },
        {
          id: 4,
          card1: "MRO (Method Resolution Order)",
          card2: "C3 linearization — deterministic lookup",
        },
      ],
      timeLimit: 540,
      shuffleCards: true,
    },
    settings: { maxFlips: 34, showTimer: true },
    isActive: true,
    sortOrder: 10,
  },
];

export async function seedMemoryGameFunctionsOOPActivities() {
  await seedActivitiesWithDuplicateCheck(
    memoryGameFunctionsOOPActivities,
    "Memory-Game Functions & OOP"
  );
}

// Execute if run directly
if (require.main === module) {
  seedMemoryGameFunctionsOOPActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Memory-Game Functions & OOP activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
