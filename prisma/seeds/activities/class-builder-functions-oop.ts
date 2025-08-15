import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Class Builder Activities for Functions & OOP
 * 10 activities focusing on core OOP building blocks and idiomatic Python patterns
 * Category: "Functions & OOP"
 *
 * Structure reference (see ACTIVITY_STRUCTURES.md for class_builder):
 * {
 *   activityType: "class_builder",
 *   content: {
 *     instructions: string,
 *     className: string,
 *     language: "Python",
 *     requiredProperties: [{ name, type, visibility }],
 *     requiredMethods: [{ name, returnType, parameters, visibility }],
 *     availableProperties: [{ name, type, visibility, description }],
 *     availableMethods: [{ name, returnType, parameters, visibility, description }],
 *     allowCustom?: boolean,
 *     hints?: string[]
 *   },
 *   settings: {
 *     timeLimit: number,
 *     provideSkeleton?: boolean,
 *     enableDebugging?: boolean,
 *     showDocstrings?: boolean
 *   }
 * }
 */

export const classBuilderFunctionsOOPActivities = [
  // 1) Difficulty 1 — Basic class with __init__ and repr
  {
    title: "Class Builder: Point (Basics)",
    description:
      "Build a Point class with x, y coordinates, __init__ and a __repr__ for debugging",
    activityType: "class_builder",
    category: "Functions & OOP",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 28,
    estimatedMinutes: 10,
    tags: ["oop", "class", "init", "repr", "basics", "class-builder"],
    content: {
      instructions:
        "Create a Point class with public x and y. Implement __init__(x, y) and a helpful __repr__.",
      className: "Point",
      language: "Python",
      requiredProperties: [
        { name: "x", type: "int|float", visibility: "public" },
        { name: "y", type: "int|float", visibility: "public" },
      ],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["x", "y"],
          visibility: "public",
        },
        {
          name: "__repr__",
          returnType: "str",
          parameters: [],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "x",
          type: "int|float",
          visibility: "public",
          description: "X coordinate",
        },
        {
          name: "y",
          type: "int|float",
          visibility: "public",
          description: "Y coordinate",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["x", "y"],
          visibility: "public",
          description: "Initialize coordinates",
        },
        {
          name: "__repr__",
          returnType: "str",
          parameters: [],
          visibility: "public",
          description: "Developer-friendly representation",
        },
      ],
      allowCustom: true,
      hints: [
        "Assign to self.x and self.y in __init__",
        "Return a string from __repr__ like: Point(x=..., y=...)",
      ],
    },
    settings: {
      timeLimit: 600,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Difficulty 1 — Encapsulation with private field + getter
  {
    title: "Class Builder: BankAccount (Encapsulation)",
    description:
      "Create a BankAccount with private _balance and public deposit/get_balance methods",
    activityType: "class_builder",
    category: "Functions & OOP",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 28,
    estimatedMinutes: 11,
    tags: ["oop", "encapsulation", "private", "class-builder"],
    content: {
      instructions:
        "Make _balance private, expose deposit(amount) and get_balance() with basic validation.",
      className: "BankAccount",
      language: "Python",
      requiredProperties: [
        { name: "owner", type: "str", visibility: "public" },
        { name: "_balance", type: "float", visibility: "private" },
      ],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["owner", "initial_balance"],
          visibility: "public",
        },
        {
          name: "deposit",
          returnType: "bool",
          parameters: ["amount"],
          visibility: "public",
        },
        {
          name: "get_balance",
          returnType: "float",
          parameters: [],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "owner",
          type: "str",
          visibility: "public",
          description: "Owner name",
        },
        {
          name: "_balance",
          type: "float",
          visibility: "private",
          description: "Current balance",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["owner", "initial_balance"],
          visibility: "public",
          description: "Initialize account state",
        },
        {
          name: "deposit",
          returnType: "bool",
          parameters: ["amount"],
          visibility: "public",
          description: "Add amount if positive",
        },
        {
          name: "get_balance",
          returnType: "float",
          parameters: [],
          visibility: "public",
          description: "Return current balance",
        },
      ],
      allowCustom: true,
      hints: [
        "Reject non-positive deposits",
        "Use underscore prefix for private-like fields",
      ],
    },
    settings: {
      timeLimit: 660,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3) Difficulty 2 — __eq__ and hashing consistency
  {
    title: "Class Builder: User (Equality & Hashing)",
    description:
      "Implement value-based equality and __hash__ consistency for dict/set usage",
    activityType: "class_builder",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 44,
    estimatedMinutes: 12,
    tags: ["oop", "dunder", "eq", "hash", "class-builder"],
    content: {
      instructions:
        "Create equality based on (username, email). Ensure __hash__ aligns with __eq__.",
      className: "User",
      language: "Python",
      requiredProperties: [
        { name: "username", type: "str", visibility: "public" },
        { name: "email", type: "str", visibility: "public" },
      ],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["username", "email"],
          visibility: "public",
        },
        {
          name: "__eq__",
          returnType: "bool",
          parameters: ["other"],
          visibility: "public",
        },
        {
          name: "__hash__",
          returnType: "int",
          parameters: [],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "username",
          type: "str",
          visibility: "public",
          description: "Unique handle",
        },
        {
          name: "email",
          type: "str",
          visibility: "public",
          description: "Email address",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["username", "email"],
          visibility: "public",
          description: "Initialize identity",
        },
        {
          name: "__eq__",
          returnType: "bool",
          parameters: ["other"],
          visibility: "public",
          description: "Compare by (username, email)",
        },
        {
          name: "__hash__",
          returnType: "int",
          parameters: [],
          visibility: "public",
          description: "Hash by (username, email)",
        },
      ],
      allowCustom: true,
      hints: [
        "Return NotImplemented for unknown types in __eq__",
        "Use tuple hashing: hash((self.username, self.email))",
      ],
    },
    settings: {
      timeLimit: 720,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Difficulty 2 — @property with validation
  {
    title: "Class Builder: Temperature (@property)",
    description:
      "Expose celsius with validation and computed fahrenheit read-only property",
    activityType: "class_builder",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 46,
    estimatedMinutes: 13,
    tags: ["oop", "property", "validation", "class-builder"],
    content: {
      instructions:
        "Implement celsius property with setter validation; fahrenheit as computed read-only property.",
      className: "Temperature",
      language: "Python",
      requiredProperties: [
        { name: "_celsius", type: "float", visibility: "private" },
      ],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["celsius"],
          visibility: "public",
        },
        {
          name: "celsius",
          returnType: "float",
          parameters: [],
          visibility: "public",
        },
        {
          name: "fahrenheit",
          returnType: "float",
          parameters: [],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "_celsius",
          type: "float",
          visibility: "private",
          description: "Stored temperature",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["celsius"],
          visibility: "public",
          description: "Initialize and validate",
        },
        {
          name: "celsius",
          returnType: "float",
          parameters: [],
          visibility: "public",
          description: "Getter + setter with validation",
        },
        {
          name: "fahrenheit",
          returnType: "float",
          parameters: [],
          visibility: "public",
          description: "Computed from celsius",
        },
      ],
      allowCustom: true,
      hints: [
        "Use @property and @celsius.setter",
        "fahrenheit = celsius * 9/5 + 32",
      ],
    },
    settings: {
      timeLimit: 780,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Difficulty 3 — Inheritance and super()
  {
    title: "Class Builder: Animals (Inheritance & super)",
    description:
      "Create Animal.speak() and Dog.speak() using super() to extend behavior",
    activityType: "class_builder",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 15,
    tags: ["oop", "inheritance", "super", "class-builder"],
    content: {
      instructions:
        "Base class Animal returns 'sound'; Dog appends ' woof' via super().",
      className: "Dog",
      language: "Python",
      requiredProperties: [],
      requiredMethods: [
        {
          name: "Animal.__init__",
          returnType: "None",
          parameters: [],
          visibility: "public",
        },
        {
          name: "Animal.speak",
          returnType: "str",
          parameters: [],
          visibility: "public",
        },
        {
          name: "Dog.speak",
          returnType: "str",
          parameters: [],
          visibility: "public",
        },
      ],
      availableProperties: [],
      availableMethods: [
        {
          name: "Animal.__init__",
          returnType: "None",
          parameters: [],
          visibility: "public",
          description: "Initialize base",
        },
        {
          name: "Animal.speak",
          returnType: "str",
          parameters: [],
          visibility: "public",
          description: "Return 'sound'",
        },
        {
          name: "Dog.speak",
          returnType: "str",
          parameters: [],
          visibility: "public",
          description: "Return super().speak() + ' woof'",
        },
      ],
      allowCustom: true,
      hints: ["class Dog(Animal): ...", "Use super().speak() in override"],
    },
    settings: {
      timeLimit: 840,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 5,
  },

  // 6) Difficulty 3 — Alternative constructors via @classmethod
  {
    title: "Class Builder: Person.from_fullname (@classmethod)",
    description:
      "Implement a classmethod that parses a full name into first/last and constructs an instance",
    activityType: "class_builder",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 15,
    tags: ["oop", "classmethod", "constructor", "class-builder"],
    content: {
      instructions:
        "Create Person with __init__(first, last) and @classmethod from_fullname('First Last').",
      className: "Person",
      language: "Python",
      requiredProperties: [
        { name: "first", type: "str", visibility: "public" },
        { name: "last", type: "str", visibility: "public" },
      ],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["first", "last"],
          visibility: "public",
        },
        {
          name: "from_fullname",
          returnType: "Person",
          parameters: ["s"],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "first",
          type: "str",
          visibility: "public",
          description: "First name",
        },
        {
          name: "last",
          type: "str",
          visibility: "public",
          description: "Last name",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["first", "last"],
          visibility: "public",
          description: "Initialize names",
        },
        {
          name: "from_fullname",
          returnType: "Person",
          parameters: ["s"],
          visibility: "public",
          description: "Parse 'First Last' into names and return instance",
        },
      ],
      allowCustom: true,
      hints: ["Use @classmethod", "Split by space once: s.split(' ', 1)"],
    },
    settings: {
      timeLimit: 900,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 6,
  },

  // 7) Difficulty 4 — __iter__ and __len__
  {
    title: "Class Builder: Bag (__iter__ & __len__)",
    description:
      "Implement an iterable Bag that yields items and reports length",
    activityType: "class_builder",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 80,
    estimatedMinutes: 18,
    tags: ["oop", "iterable", "dunder", "class-builder"],
    content: {
      instructions:
        "Create Bag(items) storing a list; implement __iter__ and __len__.",
      className: "Bag",
      language: "Python",
      requiredProperties: [
        { name: "_items", type: "list", visibility: "private" },
      ],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["items"],
          visibility: "public",
        },
        {
          name: "__iter__",
          returnType: "iterator",
          parameters: [],
          visibility: "public",
        },
        {
          name: "__len__",
          returnType: "int",
          parameters: [],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "_items",
          type: "list",
          visibility: "private",
          description: "Internal storage",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["items"],
          visibility: "public",
          description: "Store a shallow copy of items",
        },
        {
          name: "__iter__",
          returnType: "iterator",
          parameters: [],
          visibility: "public",
          description: "Yield from internal list",
        },
        {
          name: "__len__",
          returnType: "int",
          parameters: [],
          visibility: "public",
          description: "Return number of items",
        },
      ],
      allowCustom: true,
      hints: [
        "Return iter(self._items) in __iter__",
        "len(self._items) in __len__",
      ],
    },
    settings: {
      timeLimit: 960,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 7,
  },

  // 8) Difficulty 4 — __enter__/__exit__ context manager
  {
    title: "Class Builder: Timer (Context Manager)",
    description:
      "Implement a simple context manager with __enter__ and __exit__",
    activityType: "class_builder",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 82,
    estimatedMinutes: 18,
    tags: ["oop", "context-manager", "dunder", "class-builder"],
    content: {
      instructions:
        "Add __enter__ (start timer) and __exit__ (stop timer) methods. Use time module.",
      className: "Timer",
      language: "Python",
      requiredProperties: [
        { name: "_start", type: "float|None", visibility: "private" },
        { name: "elapsed", type: "float", visibility: "public" },
      ],
      requiredMethods: [
        {
          name: "__enter__",
          returnType: "Timer",
          parameters: [],
          visibility: "public",
        },
        {
          name: "__exit__",
          returnType: "None",
          parameters: ["exc_type", "exc", "tb"],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "_start",
          type: "float|None",
          visibility: "private",
          description: "Start timestamp",
        },
        {
          name: "elapsed",
          type: "float",
          visibility: "public",
          description: "Total duration",
        },
      ],
      availableMethods: [
        {
          name: "__enter__",
          returnType: "Timer",
          parameters: [],
          visibility: "public",
          description: "Record start time and return self",
        },
        {
          name: "__exit__",
          returnType: "None",
          parameters: ["exc_type", "exc", "tb"],
          visibility: "public",
          description: "Compute elapsed; optionally handle exceptions",
        },
      ],
      allowCustom: true,
      hints: [
        "import time; time.perf_counter() for high-res timing",
        "Return False in __exit__ to propagate exceptions",
      ],
    },
    settings: {
      timeLimit: 1020,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 8,
  },

  // 9) Difficulty 5 — Descriptor implementing @property-like behavior
  {
    title: "Class Builder: PositiveNumber Descriptor",
    description:
      "Create a data descriptor enforcing positive values (acts like validated property)",
    activityType: "class_builder",
    category: "Functions & OOP",
    difficulty: 5,
    diamondReward: 48,
    experienceReward: 100,
    estimatedMinutes: 20,
    tags: ["oop", "descriptor", "property", "advanced", "class-builder"],
    content: {
      instructions:
        "Implement __set_name__, __get__, __set__ to enforce positive numbers only.",
      className: "PositiveNumber",
      language: "Python",
      requiredProperties: [
        { name: "name", type: "str", visibility: "private" },
      ],
      requiredMethods: [
        {
          name: "__set_name__",
          returnType: "None",
          parameters: ["owner", "name"],
          visibility: "public",
        },
        {
          name: "__get__",
          returnType: "Any",
          parameters: ["instance", "owner"],
          visibility: "public",
        },
        {
          name: "__set__",
          returnType: "None",
          parameters: ["instance", "value"],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "name",
          type: "str",
          visibility: "private",
          description: "Attribute name",
        },
      ],
      availableMethods: [
        {
          name: "__set_name__",
          returnType: "None",
          parameters: ["owner", "name"],
          visibility: "public",
          description: "Capture attribute name",
        },
        {
          name: "__get__",
          returnType: "Any",
          parameters: ["instance", "owner"],
          visibility: "public",
          description: "Return instance value or self when accessed on class",
        },
        {
          name: "__set__",
          returnType: "None",
          parameters: ["instance", "value"],
          visibility: "public",
          description: "Validate value > 0; store in instance dict",
        },
      ],
      allowCustom: true,
      hints: [
        "Use instance.__dict__[self.name] to store",
        "Raise ValueError on non-positive",
      ],
    },
    settings: {
      timeLimit: 1080,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 9,
  },

  // 10) Difficulty 5 — Multiple inheritance & MRO-friendly design
  {
    title: "Class Builder: LoggerMixin + Service (MRO)",
    description:
      "Design LoggerMixin with a log method and compose with Service using cooperative super()",
    activityType: "class_builder",
    category: "Functions & OOP",
    difficulty: 5,
    diamondReward: 48,
    experienceReward: 100,
    estimatedMinutes: 20,
    tags: ["oop", "mixin", "mro", "super", "class-builder"],
    content: {
      instructions:
        "Create LoggerMixin.log(msg) and ensure Service.start() calls super().start() to be MRO-friendly.",
      className: "Service",
      language: "Python",
      requiredProperties: [],
      requiredMethods: [
        {
          name: "LoggerMixin.log",
          returnType: "None",
          parameters: ["msg"],
          visibility: "public",
        },
        {
          name: "Base.start",
          returnType: "None",
          parameters: [],
          visibility: "public",
        },
        {
          name: "Service.start",
          returnType: "None",
          parameters: [],
          visibility: "public",
        },
      ],
      availableProperties: [],
      availableMethods: [
        {
          name: "LoggerMixin.log",
          returnType: "None",
          parameters: ["msg"],
          visibility: "public",
          description: "Print or collect log messages",
        },
        {
          name: "Base.start",
          returnType: "None",
          parameters: [],
          visibility: "public",
          description: "Base start sequence",
        },
        {
          name: "Service.start",
          returnType: "None",
          parameters: [],
          visibility: "public",
          description: "Call super().start(); then log",
        },
      ],
      allowCustom: true,
      hints: [
        "class Service(LoggerMixin, Base): ...",
        "Prefer cooperative super() for extensibility",
      ],
    },
    settings: {
      timeLimit: 1140,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 10,
  },
];

export async function seedClassBuilderFunctionsOOPActivities() {
  await seedActivitiesWithDuplicateCheck(
    classBuilderFunctionsOOPActivities,
    "Class-Builder Functions & OOP"
  );
}

// Execute if run directly
if (require.main === module) {
  seedClassBuilderFunctionsOOPActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Class-Builder Functions & OOP activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
