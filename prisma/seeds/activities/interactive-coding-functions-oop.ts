import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Interactive Coding Activities for Functions & OOP
 * 10 activities with increasing difficulty
 * Category: "Functions & OOP"
 *
 * Structure reference:
 * {
 *   activityType: "interactive_coding",
 *   content: {
 *     instructions: string,
 *     problem: string,
 *     starterCode: string,
 *     solution: string,
 *     testCases: [
 *       {
 *         input?: string,
 *         expectedOutput?: string,
 *         code?: string,
 *         verifyContains?: string[],
 *         hidden?: boolean
 *       }
 *     ],
 *     language: "Python",
 *     hints?: string[]
 *   },
 *   settings: {
 *     timeLimit: number,
 *     enableCodeCompletion: boolean,
 *     showTestCases: boolean
 *   }
 * }
 */

export const interactiveCodingFunctionsOOPActivities = [
  // 1) Difficulty 1 - Function basics + docstring
  {
    title: "Interactive Coding: Function Basics with Docstring",
    description:
      "Define a simple function with a proper docstring and return value",
    activityType: "interactive_coding",
    category: "Functions & OOP",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 28,
    estimatedMinutes: 10,
    tags: ["functions", "docstring", "return", "interactive-coding"],
    content: {
      instructions:
        "Implement greet(name) that returns 'Hello, {name}!' and includes a meaningful docstring.",
      problem:
        "Write a function greet(name) that returns a friendly greeting. Include a docstring describing its purpose and parameters.",
      starterCode:
        'def greet(name):\n    """\n    TODO: Write a docstring that explains what the function does and its parameter.\n    """\n    # TODO: return a formatted greeting\n    pass\n\nif __name__ == "__main__":\n    print(greet("Ada"))',
      solution:
        'def greet(name):\n    """Return a friendly greeting for the given name.\n\n    Args:\n        name (str): The person\'s name.\n\n    Returns:\n        str: A greeting message like \'Hello, Ada!\'.\n    """\n    return f"Hello, {name}!"\n\nif __name__ == "__main__":\n    print(greet("Ada"))',
      testCases: [
        { input: "", expectedOutput: "Hello, Ada!" },
        {
          input: "",
          code: "print(greet('Bob'))",
          expectedOutput: "Hello, Bob!",
        },
      ],
      language: "Python",
      hints: [
        'Use f-strings for formatting: f"Hello, {name}!"',
        "Docstring should be a triple-quoted string as the first statement",
      ],
    },
    settings: {
      timeLimit: 600,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Difficulty 2 - Parameters: defaults & keyword-only
  {
    title: "Interactive Coding: Parameters with Defaults and Keyword-Only",
    description: "Implement function with default and keyword-only parameters",
    activityType: "interactive_coding",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 44,
    estimatedMinutes: 12,
    tags: ["parameters", "defaults", "keyword-only", "interactive-coding"],
    content: {
      instructions:
        "Implement format_name(first, last, *, upper=False) that returns 'Last, First' and uppercases if upper=True.",
      problem:
        "Create a function that supports a keyword-only flag to transform output.",
      starterCode:
        "def format_name(first, last, *, upper=False):\n    # TODO: return \"Last, First\"; uppercase if upper=True\n    pass\n\nif __name__ == \"__main__\":\n    print(format_name('Ada', 'Lovelace'))",
      solution:
        "def format_name(first, last, *, upper=False):\n    out = f\"{last}, {first}\"\n    return out.upper() if upper else out\n\nif __name__ == \"__main__\":\n    print(format_name('Ada', 'Lovelace'))",
      testCases: [
        { input: "", expectedOutput: "Lovelace, Ada" },
        {
          input: "",
          code: "print(format_name('Grace', 'Hopper', upper=True))",
          expectedOutput: "HOPPER, GRACE",
        },
      ],
      language: "Python",
      hints: [
        "Use a keyword-only param by placing it after '*' in the signature",
        "You can conditionally uppercase using .upper()",
      ],
    },
    settings: {
      timeLimit: 720,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3) Difficulty 2 - *args and **kwargs
  {
    title: "Interactive Coding: *args and **kwargs Utilities",
    description:
      "Implement utilities that consume extra positional and keyword arguments",
    activityType: "interactive_coding",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 44,
    estimatedMinutes: 13,
    tags: ["args", "kwargs", "parameters", "interactive-coding"],
    content: {
      instructions:
        "Implement two functions: sum_args(*args) -> int and has_flag(**kwargs) -> bool that checks kwargs['flag'].",
      problem:
        "Practice collecting extra positional and keyword arguments and returning results.",
      starterCode:
        "def sum_args(*args):\n    # TODO: return the sum of all positional arguments\n    pass\n\n\ndef has_flag(**kwargs):\n    # TODO: return True if 'flag' in kwargs and truthy, else False\n    pass\n\nif __name__ == \"__main__\":\n    print(sum_args(1,2,3))\n    print(has_flag(flag=True))",
      solution:
        "def sum_args(*args):\n    return sum(args)\n\n\ndef has_flag(**kwargs):\n    return bool(kwargs.get('flag', False))\n\nif __name__ == \"__main__\":\n    print(sum_args(1,2,3))\n    print(has_flag(flag=True))",
      testCases: [
        { input: "", verifyContains: ["6", "True"] },
        {
          input: "",
          code: "print(sum_args())\nprint(has_flag())",
          verifyContains: ["0", "False"],
        },
      ],
      language: "Python",
      hints: [
        "sum() can sum tuples directly",
        "kwargs is a dict of keyword args; use dict.get",
      ],
    },
    settings: {
      timeLimit: 780,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Difficulty 2 - Multiple return values (tuples)
  {
    title: "Interactive Coding: Multiple Returns and Unpacking",
    description: "Return multiple values and verify tuple behavior",
    activityType: "interactive_coding",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 46,
    estimatedMinutes: 12,
    tags: ["return", "tuple", "unpacking", "interactive-coding"],
    content: {
      instructions:
        "Implement min_max_sum(numbers) that returns (min, max, sum) as a tuple.",
      problem:
        "Return multiple values to practice tuple creation and unpacking.",
      starterCode:
        'def min_max_sum(numbers):\n    # TODO: return a tuple (min_value, max_value, total)\n    pass\n\nif __name__ == "__main__":\n    data = [3, 1, 5]\n    print(min_max_sum(data))',
      solution:
        'def min_max_sum(numbers):\n    return (min(numbers), max(numbers), sum(numbers))\n\nif __name__ == "__main__":\n    data = [3, 1, 5]\n    print(min_max_sum(data))',
      testCases: [
        { input: "", expectedOutput: "(1, 5, 9)" },
        {
          input: "",
          code: "m, M, s = min_max_sum([10, -1, 4])\nprint(m, M, s)",
          verifyContains: ["-1 10 13"],
        },
      ],
      language: "Python",
      hints: [
        "Use built-ins: min, max, sum",
        "Return a tuple using parentheses",
      ],
    },
    settings: {
      timeLimit: 720,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Difficulty 3 - Closures and nonlocal
  {
    title: "Interactive Coding: Closures with nonlocal Counter",
    description:
      "Create a stateful closure that increments a counter using nonlocal",
    activityType: "interactive_coding",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 15,
    tags: ["closures", "nonlocal", "enclosing", "interactive-coding"],
    content: {
      instructions:
        "Implement make_counter() returning inner() that increments and returns a count using nonlocal.",
      problem:
        "Build a closure that captures state in an enclosing scope. Use nonlocal to rebind.",
      starterCode:
        'def make_counter():\n    # TODO: set up state and return inner function\n    # Use nonlocal in inner()\n    pass\n\nif __name__ == "__main__":\n    c = make_counter()\n    print(c())  # 1\n    print(c())  # 2',
      solution:
        'def make_counter():\n    x = 0\n    def inner():\n        nonlocal x\n        x += 1\n        return x\n    return inner\n\nif __name__ == "__main__":\n    c = make_counter()\n    print(c())\n    print(c())',
      testCases: [
        { input: "", verifyContains: ["1", "2"] },
        {
          input: "",
          code: "c = make_counter()\nfor _ in range(3):\n    print(c())",
          verifyContains: ["1", "2", "3"],
        },
      ],
      language: "Python",
      hints: [
        "Define a variable in make_counter and modify it in inner()",
        "Use the nonlocal keyword in inner() to rebind",
      ],
    },
    settings: {
      timeLimit: 840,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 5,
  },

  // 6) Difficulty 4 - Decorators with functools.wraps
  {
    title: "Interactive Coding: Decorator with @wraps to Preserve Metadata",
    description:
      "Write a decorator that logs before/after and preserves function metadata using functools.wraps",
    activityType: "interactive_coding",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 80,
    estimatedMinutes: 18,
    tags: ["decorators", "wraps", "metadata", "interactive-coding"],
    content: {
      instructions:
        "Implement log_calls decorator that prints 'CALL' and 'DONE' and preserves __name__ via @wraps.",
      problem:
        "Decorators should maintain metadata. Use functools.wraps on the wrapper function.",
      starterCode:
        'from functools import wraps\n\n# TODO: implement decorator\n\ndef log_calls(func):\n    # Use @wraps(func) inside\n    pass\n\n@log_calls\ndef add(a, b):\n    """Return sum of a and b"""\n    return a + b\n\nif __name__ == "__main__":\n    print(add(2,3))\n    print(add.__name__)',
      solution:
        'from functools import wraps\n\ndef log_calls(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        print("CALL")\n        try:\n            return func(*args, **kwargs)\n        finally:\n            print("DONE")\n    return wrapper\n\n@log_calls\ndef add(a, b):\n    """Return sum of a and b"""\n    return a + b\n\nif __name__ == "__main__":\n    print(add(2,3))\n    print(add.__name__)',
      testCases: [{ input: "", verifyContains: ["CALL", "DONE", "5", "add"] }],
      language: "Python",
      hints: [
        "Import wraps from functools and decorate wrapper with @wraps(func)",
        "Print before and after calling the original function",
      ],
    },
    settings: {
      timeLimit: 1020,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 6,
  },

  // 7) Difficulty 3 - Recursion: factorial
  {
    title: "Interactive Coding: Recursive Factorial",
    description: "Implement factorial(n) with proper base case and recursion",
    activityType: "interactive_coding",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 15,
    tags: ["recursion", "base-case", "factorial", "interactive-coding"],
    content: {
      instructions: "Implement factorial(n) returning n! with base case at 0.",
      problem: "Use recursion with a base case returning 1 when n == 0.",
      starterCode:
        'def factorial(n):\n    # TODO: implement recursive factorial\n    pass\n\nif __name__ == "__main__":\n    print(factorial(5))',
      solution:
        'def factorial(n):\n    return 1 if n == 0 else n * factorial(n-1)\n\nif __name__ == "__main__":\n    print(factorial(5))',
      testCases: [
        { input: "", expectedOutput: "120" },
        { input: "", code: "print(factorial(0))", expectedOutput: "1" },
      ],
      language: "Python",
      hints: [
        "Base case n==0 should return 1",
        "Recursive step multiplies n by factorial(n-1)",
      ],
    },
    settings: {
      timeLimit: 780,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 7,
  },

  // 8) Difficulty 3 - Simple class with @property
  {
    title: "Interactive Coding: Rectangle Class with @property",
    description:
      "Implement a Rectangle with width/height and read-only area property",
    activityType: "interactive_coding",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 16,
    tags: ["oop", "property", "class", "interactive-coding"],
    content: {
      instructions:
        "Create Rectangle(width, height) with an area @property that returns width*height.",
      problem:
        "Use @property for a computed attribute and initialize fields in __init__.",
      starterCode:
        'class Rectangle:\n    # TODO: implement __init__(self, width, height)\n    # and an @property area\n    pass\n\nif __name__ == "__main__":\n    r = Rectangle(3, 4)\n    print(r.area)',
      solution:
        'class Rectangle:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    @property\n    def area(self):\n        return self.width * self.height\n\nif __name__ == "__main__":\n    r = Rectangle(3, 4)\n    print(r.area)',
      testCases: [
        { input: "", expectedOutput: "12" },
        {
          input: "",
          code: "r = Rectangle(5, 6)\nprint(r.area)",
          expectedOutput: "30",
        },
      ],
      language: "Python",
      hints: [
        "Define __init__ to set instance attributes",
        "Decorate area with @property",
      ],
    },
    settings: {
      timeLimit: 900,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 8,
  },

  // 9) Difficulty 4 - @classmethod alternative constructor
  {
    title: "Interactive Coding: @classmethod Alternative Constructor",
    description:
      "Implement Person.from_fullname('First Last') as a classmethod",
    activityType: "interactive_coding",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 80,
    estimatedMinutes: 18,
    tags: ["classmethod", "constructor", "oop", "interactive-coding"],
    content: {
      instructions:
        "Create a Person with first/last and a classmethod from_fullname for creating from 'First Last'.",
      problem:
        "Use @classmethod to return an instance by parsing a single string.",
      starterCode:
        "class Person:\n    def __init__(self, first, last):\n        self.first, self.last = first, last\n\n    # TODO: implement classmethod from_fullname(cls, s)\n\nif __name__ == \"__main__\":\n    p = Person('Ada', 'Lovelace')\n    print(p.first, p.last)",
      solution:
        "class Person:\n    def __init__(self, first, last):\n        self.first, self.last = first, last\n\n    @classmethod\n    def from_fullname(cls, s):\n        first, last = s.split(' ', 1)\n        return cls(first, last)\n\nif __name__ == \"__main__\":\n    p = Person('Ada', 'Lovelace')\n    print(p.first, p.last)",
      testCases: [
        { input: "", verifyContains: ["Ada Lovelace"] },
        {
          input: "",
          code: "p = Person.from_fullname('Grace Hopper')\nprint(p.last)",
          expectedOutput: "Hopper",
        },
      ],
      language: "Python",
      hints: [
        "Use @classmethod so first argument is cls",
        "Use str.split to parse full name",
      ],
    },
    settings: {
      timeLimit: 1020,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 9,
  },

  // 10) Difficulty 4 - Inheritance and super()
  {
    title: "Interactive Coding: Inheritance with super()",
    description:
      "Create a base class and subclass overriding a method and using super()",
    activityType: "interactive_coding",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 82,
    estimatedMinutes: 18,
    tags: ["inheritance", "super", "override", "interactive-coding"],
    content: {
      instructions:
        "Implement Animal.speak() and Dog.speak() that uses super() and adds ' woof'.",
      problem: "Use method overriding with cooperative super() call.",
      starterCode:
        "class Animal:\n    def speak(self):\n        # TODO: return base sound\n        pass\n\nclass Dog(Animal):\n    def speak(self):\n        # TODO: call super and append ' woof'\n        pass\n\nif __name__ == \"__main__\":\n    print(Dog().speak())",
      solution:
        'class Animal:\n    def speak(self):\n        return "sound"\n\nclass Dog(Animal):\n    def speak(self):\n        return super().speak() + " woof"\n\nif __name__ == "__main__":\n    print(Dog().speak())',
      testCases: [{ input: "", expectedOutput: "sound woof" }],
      language: "Python",
      hints: [
        "Override speak in Dog and call super().speak()",
        "Concatenate strings to append",
      ],
    },
    settings: {
      timeLimit: 1020,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 10,
  },
];

export async function seedInteractiveCodingFunctionsOOPActivities() {
  await seedActivitiesWithDuplicateCheck(
    interactiveCodingFunctionsOOPActivities,
    "Interactive Coding Functions & OOP"
  );
}

// Execute if run directly
if (require.main === module) {
  seedInteractiveCodingFunctionsOOPActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Interactive Coding Functions & OOP activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
