import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Memory Game Activities for Python Fundamentals
 * 10 high-quality memory matching activities covering Python concepts
 * Difficulty levels: 1-3 (Beginner to Intermediate)
 */

export const memoryGamePythonFundamentalsActivities = [
  // DIFFICULTY 1 - BEGINNER (4 activities)

  // 1. Basic Python Syntax Matching
  {
    title: "Python Print Statement Memory Match",
    description: "Match Python print statements with their exact outputs",
    activityType: "memory_game",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 30,
    estimatedMinutes: 10,
    tags: ["print", "output", "basic-syntax", "beginner"],
    content: {
      instructions: "Match each Python print statement with its correct output",
      pairs: [
        { id: 1, card1: "print('Hello World')", card2: "Hello World" },
        { id: 2, card1: "print(2 + 3)", card2: "5" },
        { id: 3, card1: "print('Age:', 25)", card2: "Age: 25" },
        { id: 4, card1: "print('A', 'B', 'C')", card2: "A B C" },
        { id: 5, card1: "print('Line1\\nLine2')", card2: "Line1\nLine2" },
        { id: 6, card1: "print(10 * 3)", card2: "30" },
        { id: 7, card1: "print(f'{5} + {3} = {8}')", card2: "5 + 3 = 8" },
        {
          id: 8,
          card1: "print('Result:', end='')",
          card2: "Result:(no newline)",
        },
      ],
      timeLimit: 240,
      shuffleCards: true,
    },
    settings: {
      maxFlips: 25,
      showTimer: true,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2. Variable Types and Values
  {
    title: "Python Data Types Memory Challenge",
    description: "Match Python values with their corresponding data types",
    activityType: "memory_game",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 15,
    experienceReward: 35,
    estimatedMinutes: 12,
    tags: ["data-types", "variables", "types", "classification"],
    content: {
      instructions: "Match each Python value with its correct data type",
      pairs: [
        { id: 1, card1: "42", card2: "int" },
        { id: 2, card1: "3.14", card2: "float" },
        { id: 3, card1: "'Hello'", card2: "str" },
        { id: 4, card1: "True", card2: "bool" },
        { id: 5, card1: "[1, 2, 3]", card2: "list" },
        { id: 6, card1: "{'key': 'value'}", card2: "dict" },
        { id: 7, card1: "(1, 2, 3)", card2: "tuple" },
        { id: 8, card1: "{1, 2, 3}", card2: "set" },
        { id: 9, card1: "None", card2: "NoneType" },
        { id: 10, card1: "2+3j", card2: "complex" },
      ],
      timeLimit: 300,
      shuffleCards: true,
    },
    settings: {
      maxFlips: 30,
      showTimer: true,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3. Python Operators and Results
  {
    title: "Python Arithmetic Operations Match",
    description: "Match arithmetic expressions with their calculated results",
    activityType: "memory_game",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 18,
    experienceReward: 40,
    estimatedMinutes: 15,
    tags: ["arithmetic", "operators", "calculations", "math"],
    content: {
      instructions: "Match each Python arithmetic expression with its result",
      pairs: [
        { id: 1, card1: "15 + 25", card2: "40" },
        { id: 2, card1: "50 - 23", card2: "27" },
        { id: 3, card1: "8 * 7", card2: "56" },
        { id: 4, card1: "81 / 9", card2: "9.0" },
        { id: 5, card1: "17 // 3", card2: "5" },
        { id: 6, card1: "17 % 3", card2: "2" },
        { id: 7, card1: "2 ** 4", card2: "16" },
        { id: 8, card1: "abs(-15)", card2: "15" },
        { id: 9, card1: "round(3.7)", card2: "4" },
        { id: 10, card1: "max(5, 8, 3)", card2: "8" },
      ],
      timeLimit: 360,
      shuffleCards: true,
    },
    settings: {
      maxFlips: 35,
      showTimer: true,
    },
    isActive: true,
    sortOrder: 3,
  },

  // 4. String Methods and Results
  {
    title: "Python String Methods Memory Game",
    description: "Match string method calls with their expected results",
    activityType: "memory_game",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 20,
    experienceReward: 45,
    estimatedMinutes: 18,
    tags: ["strings", "methods", "text-processing", "functions"],
    content: {
      instructions: "Match each string method with its output result",
      pairs: [
        { id: 1, card1: "'hello'.upper()", card2: "HELLO" },
        { id: 2, card1: "'WORLD'.lower()", card2: "world" },
        { id: 3, card1: "'python'.capitalize()", card2: "Python" },
        { id: 4, card1: "'hello world'.title()", card2: "Hello World" },
        { id: 5, card1: "'  space  '.strip()", card2: "space" },
        { id: 6, card1: "'a,b,c'.split(',')", card2: "['a', 'b', 'c']" },
        { id: 7, card1: "'-'.join(['a', 'b', 'c'])", card2: "a-b-c" },
        { id: 8, card1: "'hello'.replace('l', 'x')", card2: "hexxo" },
        { id: 9, card1: "'python'.find('th')", card2: "2" },
        { id: 10, card1: "len('programming')", card2: "11" },
      ],
      timeLimit: 420,
      shuffleCards: true,
    },
    settings: {
      maxFlips: 40,
      showTimer: true,
    },
    isActive: true,
    sortOrder: 4,
  },

  // DIFFICULTY 2 - BASIC (3 activities)

  // 5. List Operations Memory Match
  {
    title: "Python List Methods Memory Challenge",
    description: "Match list operations with their effects on the list",
    activityType: "memory_game",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 22,
    experienceReward: 50,
    estimatedMinutes: 20,
    tags: ["lists", "methods", "operations", "data-structures"],
    content: {
      instructions: "Match list operations with their resulting list states",
      pairs: [
        { id: 1, card1: "[1,2].append(3)", card2: "[1, 2, 3]" },
        { id: 2, card1: "[1,2,3].pop()", card2: "[1, 2] (returns 3)" },
        { id: 3, card1: "[3,1,2].sort()", card2: "[1, 2, 3]" },
        { id: 4, card1: "[1,2,3].reverse()", card2: "[3, 2, 1]" },
        { id: 5, card1: "[1,2].extend([3,4])", card2: "[1, 2, 3, 4]" },
        { id: 6, card1: "[1,2,1].count(1)", card2: "2" },
        { id: 7, card1: "[1,2,3].index(2)", card2: "1" },
        { id: 8, card1: "[1,2,3].insert(1, 'x')", card2: "[1, 'x', 2, 3]" },
        { id: 9, card1: "[1,2,3].remove(2)", card2: "[1, 3]" },
        { id: 10, card1: "len([1,2,3,4,5])", card2: "5" },
      ],
      timeLimit: 480,
      shuffleCards: true,
    },
    settings: {
      maxFlips: 45,
      showTimer: true,
    },
    isActive: true,
    sortOrder: 5,
  },

  // 6. Dictionary Operations
  {
    title: "Python Dictionary Methods Memory Game",
    description:
      "Match dictionary operations with their return values or effects",
    activityType: "memory_game",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 25,
    experienceReward: 55,
    estimatedMinutes: 22,
    tags: ["dictionaries", "key-value", "methods", "operations"],
    content: {
      instructions: "Match dictionary operations with their results",
      pairs: [
        {
          id: 1,
          card1: "{'a': 1, 'b': 2}.keys()",
          card2: "dict_keys(['a', 'b'])",
        },
        {
          id: 2,
          card1: "{'a': 1, 'b': 2}.values()",
          card2: "dict_values([1, 2])",
        },
        { id: 3, card1: "{'a': 1}.get('b', 0)", card2: "0" },
        {
          id: 4,
          card1: "{'a': 1, 'b': 2}.pop('a')",
          card2: "1 (dict becomes {'b': 2})",
        },
        {
          id: 5,
          card1: "{'a': 1}.update({'b': 2})",
          card2: "{'a': 1, 'b': 2}",
        },
        {
          id: 6,
          card1: "dict.fromkeys(['a','b'], 0)",
          card2: "{'a': 0, 'b': 0}",
        },
        {
          id: 7,
          card1: "{'a': 1, 'b': 2}.items()",
          card2: "dict_items([('a', 1), ('b', 2)])",
        },
        { id: 8, card1: "len({'a': 1, 'b': 2, 'c': 3})", card2: "3" },
        { id: 9, card1: "'a' in {'a': 1, 'b': 2}", card2: "True" },
        { id: 10, card1: "{'a': 1, 'b': 2}.clear()", card2: "{} (empty dict)" },
      ],
      timeLimit: 540,
      shuffleCards: true,
    },
    settings: {
      maxFlips: 50,
      showTimer: true,
    },
    isActive: true,
    sortOrder: 6,
  },

  // 7. Control Flow Patterns
  {
    title: "Python Control Flow Memory Match",
    description: "Match control flow code with their execution outcomes",
    activityType: "memory_game",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 28,
    experienceReward: 60,
    estimatedMinutes: 25,
    tags: ["control-flow", "if-statements", "loops", "conditions"],
    content: {
      instructions: "Match control flow patterns with their output or behavior",
      pairs: [
        { id: 1, card1: "if 5 > 3: print('Yes')", card2: "Yes" },
        { id: 2, card1: "for i in range(3): print(i)", card2: "0 1 2" },
        {
          id: 3,
          card1: "x = 0\nwhile x < 2:\n  print(x)\n  x += 1",
          card2: "0 1",
        },
        {
          id: 4,
          card1: "for i in [1,2,3]:\n  if i == 2: continue\n  print(i)",
          card2: "1 3",
        },
        {
          id: 5,
          card1: "for i in [1,2,3]:\n  if i == 2: break\n  print(i)",
          card2: "1",
        },
        {
          id: 6,
          card1: "x = 15\nprint('Adult' if x >= 18 else 'Minor')",
          card2: "Minor",
        },
        {
          id: 7,
          card1: "for i in range(2):\n  for j in range(2):\n    print(i,j)",
          card2: "0 0\n0 1\n1 0\n1 1",
        },
        {
          id: 8,
          card1: "nums = [1,2,3,4]\neven = [x for x in nums if x % 2 == 0]",
          card2: "[2, 4]",
        },
      ],
      timeLimit: 600,
      shuffleCards: true,
    },
    settings: {
      maxFlips: 55,
      showTimer: true,
    },
    isActive: true,
    sortOrder: 7,
  },

  // DIFFICULTY 3 - INTERMEDIATE (3 activities)

  // 8. Function Concepts
  {
    title: "Python Functions Memory Challenge",
    description: "Match function definitions with their behavior and outputs",
    activityType: "memory_game",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 28,
    tags: ["functions", "parameters", "return-values", "advanced"],
    content: {
      instructions:
        "Match function definitions with their call results or behaviors",
      pairs: [
        {
          id: 1,
          card1: "def add(a, b):\n  return a + b\nadd(3, 5)",
          card2: "8",
        },
        {
          id: 2,
          card1: "def greet(name='World'):\n  return f'Hello {name}'\ngreet()",
          card2: "Hello World",
        },
        {
          id: 3,
          card1:
            "def multiply(*args):\n  result = 1\n  for x in args:\n    result *= x\n  return result\nmultiply(2, 3, 4)",
          card2: "24",
        },
        {
          id: 4,
          card1:
            "def get_info(**kwargs):\n  return len(kwargs)\nget_info(name='John', age=25)",
          card2: "2",
        },
        {
          id: 5,
          card1:
            "def factorial(n):\n  return 1 if n <= 1 else n * factorial(n-1)\nfactorial(4)",
          card2: "24",
        },
        { id: 6, card1: "lambda x: x**2\n(lambda x: x**2)(5)", card2: "25" },
        {
          id: 7,
          card1:
            "def outer():\n  x = 10\n  def inner():\n    return x\n  return inner\nouter()()",
          card2: "10",
        },
        {
          id: 8,
          card1: "def generator():\n  yield 1\n  yield 2\nlist(generator())",
          card2: "[1, 2]",
        },
      ],
      timeLimit: 720,
      shuffleCards: true,
    },
    settings: {
      maxFlips: 60,
      showTimer: true,
    },
    isActive: true,
    sortOrder: 8,
  },

  // 9. Exception Handling
  {
    title: "Python Exception Handling Memory Game",
    description: "Match exception scenarios with their handling outcomes",
    activityType: "memory_game",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 32,
    experienceReward: 70,
    estimatedMinutes: 30,
    tags: ["exceptions", "error-handling", "try-catch", "debugging"],
    content: {
      instructions: "Match exception handling code with their outcomes",
      pairs: [
        { id: 1, card1: "int('abc')", card2: "ValueError" },
        {
          id: 2,
          card1: "try:\n  int('abc')\nexcept ValueError:\n  print('Error')",
          card2: "Error",
        },
        { id: 3, card1: "[1,2,3][5]", card2: "IndexError" },
        { id: 4, card1: "{'a': 1}['b']", card2: "KeyError" },
        { id: 5, card1: "10 / 0", card2: "ZeroDivisionError" },
        {
          id: 6,
          card1:
            "try:\n  10/0\nexcept:\n  print('Caught')\nfinally:\n  print('Done')",
          card2: "Caught\nDone",
        },
        {
          id: 7,
          card1:
            "try:\n  x = 5\nexcept:\n  print('Error')\nelse:\n  print('Success')",
          card2: "Success",
        },
        {
          id: 8,
          card1: "raise ValueError('Custom error')",
          card2: "ValueError: Custom error",
        },
      ],
      timeLimit: 780,
      shuffleCards: true,
    },
    settings: {
      maxFlips: 65,
      showTimer: true,
    },
    isActive: true,
    sortOrder: 9,
  },

  // 10. Advanced Python Concepts
  {
    title: "Advanced Python Features Memory Match",
    description:
      "Match advanced Python features with their behaviors and outputs",
    activityType: "memory_game",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 35,
    experienceReward: 75,
    estimatedMinutes: 32,
    tags: ["advanced", "comprehensions", "generators", "decorators"],
    content: {
      instructions: "Match advanced Python code with their results or concepts",
      pairs: [
        { id: 1, card1: "[x**2 for x in range(4)]", card2: "[0, 1, 4, 9]" },
        {
          id: 2,
          card1: "{x: x**2 for x in range(3)}",
          card2: "{0: 0, 1: 1, 2: 4}",
        },
        {
          id: 3,
          card1: "{x for x in range(5) if x % 2 == 0}",
          card2: "{0, 2, 4}",
        },
        { id: 4, card1: "list(map(str, [1,2,3]))", card2: "['1', '2', '3']" },
        {
          id: 5,
          card1: "list(filter(lambda x: x > 2, [1,2,3,4]))",
          card2: "[3, 4]",
        },
        {
          id: 6,
          card1: "@property\ndef age(self):\n  return self._age",
          card2: "Getter decorator",
        },
        {
          id: 7,
          card1: "with open('file.txt') as f:\n  content = f.read()",
          card2: "Context manager",
        },
        {
          id: 8,
          card1:
            "def decorator(func):\n  def wrapper(*args, **kwargs):\n    return func(*args, **kwargs)\n  return wrapper",
          card2: "Function decorator pattern",
        },
      ],
      timeLimit: 840,
      shuffleCards: true,
    },
    settings: {
      maxFlips: 70,
      showTimer: true,
    },
    isActive: true,
    sortOrder: 10,
  },
];

export async function seedMemoryGamePythonFundamentalsActivities() {
  console.log("🧠 Seeding Memory Game Python Fundamentals activities...");

  if (memoryGamePythonFundamentalsActivities.length === 0) {
    console.log("📝 No Memory Game Python Fundamentals activities to seed");
    return;
  }

  for (const activity of memoryGamePythonFundamentalsActivities) {
    await prisma.learningActivity.create({
      data: {
        title: activity.title,
        description: activity.description,
        activityType: activity.activityType,
        category: activity.category,
        difficulty: activity.difficulty,
        diamondReward: activity.diamondReward,
        experienceReward: activity.experienceReward,
        estimatedMinutes: activity.estimatedMinutes,
        content: JSON.stringify(activity.content),
        tags: JSON.stringify(activity.tags),
        isActive: activity.isActive,
        sortOrder: activity.sortOrder,
      },
    });
  }

  console.log(
    `✅ ${memoryGamePythonFundamentalsActivities.length} Memory Game Python Fundamentals activities seeded successfully`
  );
}

// Execute the seeding function if this file is run directly
if (require.main === module) {
  seedMemoryGamePythonFundamentalsActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Memory Game Python Fundamentals activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
