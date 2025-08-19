import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type LessonSeed = {
  slug: string;
  title: string;
  description: string;
  category?: string;
  difficulty?: number; // 1=beginner, 2=intermediate, 3=advanced
  estimatedMinutes?: number;
  diamondReward?: number;
  experienceReward?: number;
  sortOrder: number;
  sections: {
    introduction: string;
    syntax: string;
    examples: string;
  };
};

const PF = "Python Fundamentals";

const lessons: LessonSeed[] = [
  {
    slug: "python-basics-first-program",
    title: "Python Basics & Your First Program",
    description:
      "Start your Python journey: what Python is, why it’s popular, and write your first Hello World.",
    category: PF,
    difficulty: 1,
    estimatedMinutes: 20,
    diamondReward: 25,
    experienceReward: 25,
    sortOrder: 1,
    sections: {
      introduction: `# 🚀 Welcome to Python
Python is beginner-friendly and powerful. In this lesson you’ll meet Python and run your first program.`,
      syntax: `## Syntax
- print("Hello, World!")
- Comments start with #`,
      examples: `### Examples
\`\`\`python
# Classic first program
print("Hello, World!")

# A few variations
print("Hello, Python!")
message = "I'm learning Python!"
print(message)
\`\`\``,
    },
  },
  {
    slug: "variables-data-types",
    title: "Variables & Data Types Deep Dive",
    description:
      "Understand variables, strings, numbers, booleans, and dynamic typing with practical examples.",
    category: PF,
    difficulty: 1,
    estimatedMinutes: 25,
    diamondReward: 25,
    experienceReward: 25,
    sortOrder: 2,
    sections: {
      introduction: `# 📦 Variables and Data Types
Variables store values; Python has strings, integers, floats, booleans, and more.`,
      syntax: `## Syntax & Concepts
- name = "Alice"
- age = 25
- pi = 3.14
- is_student = True`,
      examples: `### Examples
\`\`\`python
first_name = "John"
age = 30
height = 1.8
is_member = False
print(f"{first_name} ({age}) member={is_member}, height={height}")
\`\`\``,
    },
  },
  {
    slug: "if-statements-decisions",
    title: "Making Decisions with If Statements",
    description:
      "Learn branching logic with if/elif/else, comparisons, and boolean operators.",
    category: PF,
    difficulty: 1,
    estimatedMinutes: 25,
    diamondReward: 25,
    experienceReward: 25,
    sortOrder: 3,
    sections: {
      introduction: `# 🤔 Decisions with If
Control program flow with conditions.`,
      syntax: `## Syntax
\`\`\`python
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
\`\`\``,
      examples: `### Examples
\`\`\`python
temperature = 28
if temperature > 30:
    print("Hot")
elif temperature >= 20:
    print("Nice")
else:
    print("Chilly")
\`\`\``,
    },
  },
  {
    slug: "loops-repetition",
    title: "Loops: Repeating Actions",
    description:
      "Use for and while loops, break/continue, and work with ranges and collections.",
    category: PF,
    difficulty: 1,
    estimatedMinutes: 25,
    diamondReward: 25,
    experienceReward: 25,
    sortOrder: 4,
    sections: {
      introduction: `# 🔄 Loops
Repeat code efficiently with for and while.`,
      syntax: `## Syntax
\`\`\`python
for i in range(5):
    print(i)

count = 3
while count > 0:
    print(count)
    count -= 1
\`\`\``,
      examples: `### Examples
\`\`\`python
fruits = ["apple", "banana", "orange"]
for f in fruits:
    print("I like", f)
\`\`\``,
    },
  },
  {
    slug: "functions-basics",
    title: "Functions: Reusable Code Blocks",
    description:
      "Define functions, parameters, return values, and write clean re-usable code.",
    category: PF,
    difficulty: 1,
    estimatedMinutes: 25,
    diamondReward: 25,
    experienceReward: 25,
    sortOrder: 5,
    sections: {
      introduction: `# 🔧 Functions
Group logic into named blocks you can call any time.`,
      syntax: `## Syntax
\`\`\`python
def add(a, b):
    return a + b
\`\`\``,
      examples: `### Examples
\`\`\`python
def greet(name="friend"):
    print(f"Hello, {name}!")
greet("Alice")
greet()
\`\`\``,
    },
  },
  {
    slug: "lists-collections",
    title: "Working with Lists & Collections",
    description:
      "Create, access, modify, and loop over lists. Learn core list methods and slicing.",
    category: PF,
    difficulty: 1,
    estimatedMinutes: 25,
    diamondReward: 25,
    experienceReward: 25,
    sortOrder: 6,
    sections: {
      introduction: `# 📋 Lists
Ordered collections with powerful operations.`,
      syntax: `## Syntax
\`\`\`python
nums = [1, 2, 3]
nums.append(4)
print(nums[0], nums[-1], nums[1:3])
\`\`\``,
      examples: `### Examples
\`\`\`python
shopping = ["milk", "bread"]
shopping.insert(0, "butter")
shopping.extend(["eggs", "cheese"])
\`\`\``,
    },
  },
  {
    slug: "dictionaries-key-value",
    title: "Dictionaries & Key-Value Data",
    description:
      "Use dicts to map keys to values; add, update, remove, and iterate over items.",
    category: PF,
    difficulty: 1,
    estimatedMinutes: 25,
    diamondReward: 25,
    experienceReward: 25,
    sortOrder: 7,
    sections: {
      introduction: `# 🗂️ Dictionaries
Key-value storage for structured data.`,
      syntax: `## Syntax
\`\`\`python
student = {"name": "Alice", "age": 20}
student["grade"] = "A"
\`\`\``,
      examples: `### Examples
\`\`\`python
for k, v in student.items():
    print(k, v)
\`\`\``,
    },
  },
  {
    slug: "file-handling",
    title: "File Handling & Data Persistence",
    description:
      "Read and write files safely with context managers and handle basic formats.",
    category: PF,
    difficulty: 1,
    estimatedMinutes: 25,
    diamondReward: 25,
    experienceReward: 25,
    sortOrder: 8,
    sections: {
      introduction: `# 📁 Files
Persist and process data using file IO.`,
      syntax: `## Syntax
\`\`\`python
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()
\`\`\``,
      examples: `### Examples
\`\`\`python
lines = ["first\\n", "second\\n"]
with open("out.txt", "w", encoding="utf-8") as f:
    f.writelines(lines)
\`\`\``,
    },
  },
  {
    slug: "error-handling-debugging",
    title: "Error Handling & Debugging",
    description:
      "Use try/except/finally, raise exceptions, and debug with prints or logging.",
    category: PF,
    difficulty: 1,
    estimatedMinutes: 25,
    diamondReward: 25,
    experienceReward: 25,
    sortOrder: 9,
    sections: {
      introduction: `# 🐛 Errors & Debugging
Handle runtime errors gracefully.`,
      syntax: `## Syntax
\`\`\`python
try:
    n = int("42")
except ValueError:
    print("Invalid number")
\`\`\``,
      examples: `### Examples
\`\`\`python
import logging
logging.basicConfig(level=logging.INFO)
logging.info("Processing...")
\`\`\``,
    },
  },
  {
    slug: "oop-basics",
    title: "Object-Oriented Programming Basics",
    description:
      "Create classes and objects, understand attributes, methods, and simple OOP principles.",
    category: PF,
    difficulty: 2,
    estimatedMinutes: 30,
    diamondReward: 25,
    experienceReward: 25,
    sortOrder: 10,
    sections: {
      introduction: `# 🏗️ OOP Basics
Model real-world entities with classes and objects.`,
      syntax: `## Syntax
\`\`\`python
class Student:
    def __init__(self, name):
        self.name = name
\`\`\``,
      examples: `### Examples
\`\`\`python
s = Student("Alice")
print(s.name)
\`\`\``,
    },
  },
  {
    slug: "modules-libraries",
    title: "Modules, Libraries & Code Organization",
    description:
      "Organize code into modules/packages and leverage third-party libraries.",
    category: PF,
    difficulty: 2,
    estimatedMinutes: 30,
    diamondReward: 25,
    experienceReward: 25,
    sortOrder: 11,
    sections: {
      introduction: `# 📦 Modules & Libraries
Split code into reusable modules and import what you need.`,
      syntax: `## Syntax
\`\`\`python
# my_utils.py
def add(a, b): return a + b

# main.py
from my_utils import add
print(add(2, 3))
\`\`\``,
      examples: `### Examples
\`\`\`python
import math
print(math.sqrt(16))
\`\`\``,
    },
  },
];

async function seedLessons() {
  console.log("🌱 Seeding Learn page lessons (activityType='lesson')...");

  for (const lesson of lessons) {
    const content = JSON.stringify({
      sections: {
        Introduction: {
          title: "Introduction",
          content: lesson.sections.introduction,
        },
        Syntax: {
          title: "Syntax & Concepts",
          content: lesson.sections.syntax,
        },
        Examples: {
          title: "Examples & Practice",
          content: lesson.sections.examples,
        },
      },
    });

    const settings = JSON.stringify({
      slug: lesson.slug,
      hasCodeExercise: false,
    });

    const category = lesson.category || PF;
    const difficulty =
      typeof lesson.difficulty === "number" ? lesson.difficulty : 1;
    const estimatedMinutes = lesson.estimatedMinutes ?? 20;
    const diamondReward = lesson.diamondReward ?? 25;
    const experienceReward = lesson.experienceReward ?? 25;

    await prisma.learningActivity
      .upsert({
        where: { slug: lesson.slug },
        update: {
          title: lesson.title,
          description: lesson.description,
          category,
          difficulty,
          diamondReward,
          experienceReward,
          content,
          settings,
          estimatedMinutes,
          sortOrder: lesson.sortOrder,
          isActive: true,
          isLocked: false,
          activityType: "lesson",
        },
        create: {
          slug: lesson.slug,
          title: lesson.title,
          description: lesson.description,
          activityType: "lesson",
          category,
          difficulty,
          diamondReward,
          experienceReward,
          content,
          settings,
          isActive: true,
          estimatedMinutes,
          tags: JSON.stringify([category, "python", "basics"]),
          sortOrder: lesson.sortOrder,
          topicOrder: lesson.sortOrder,
          isLocked: false,
        },
      })
      .then(() => {
        console.log(`✅ Upserted lesson: ${lesson.slug} (${lesson.title})`);
      })
      .catch((err) => {
        console.error(`❌ Failed upserting ${lesson.slug}:`, err);
      });
  }

  console.log("✅ Seeding completed");
}

if (require.main === module) {
  seedLessons()
    .catch((e) => {
      console.error("❌ Seed error:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export default seedLessons;
