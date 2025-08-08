import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Python Basics",
    description: "Variables, basic data types, operators, and basic I/O operations.",
    color: "#4A90E2",
    icon: "📚",
    sortOrder: 1,
  },
  {
    name: "Control Flow",
    description: "Managing program flow with conditional statements and loops.",
    color: "#50E3C2",
    icon: "🔄",
    sortOrder: 2,
  },
  {
    name: "Data Structures",
    description: "Operations and use cases for Lists, Tuples, Dictionaries, and Sets.",
    color: "#7ED321",
    icon: "📊",
    sortOrder: 3,
  },
  {
    name: "Functions",
    description: "Defining functions, parameters, arguments, and variable scope.",
    color: "#F5A623",
    icon: "⚡",
    sortOrder: 4,
  },
  {
    name: "Object-Oriented Programming",
    description: "Classes, objects, inheritance, encapsulation, and polymorphism.",
    color: "#BD10E0",
    icon: "🏗️",
    sortOrder: 5,
  },
];

const questions = [
  {
    question: "What is the correct way to define a function in Python?",
    options: [
      "function myFunc(): pass",
      "def myFunc(): pass",
      "func myFunc(): pass",
      "define myFunc(): pass",
    ],
    correctAnswer: 1,
    explanation: 'In Python, functions are defined using the "def" keyword followed by the function name and parentheses.',
    difficulty: "beginner",
    category: "Functions",
  },
  {
    question: "Which of the following is NOT a valid Python data type?",
    options: ["int", "float", "char", "str"],
    correctAnswer: 2,
    explanation: 'Python does not have a specific "char" data type. Individual characters are represented as strings of length 1.',
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "How do you create a comment in Python?",
    options: [
      "// This is a comment",
      "/* This is a comment */",
      "# This is a comment",
      "<!-- This is a comment -->",
    ],
    correctAnswer: 2,
    explanation: "Python uses the hash symbol (#) to create single-line comments.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "What will be the output of: print(type(5.0))",
    options: [
      "<class 'int'>",
      "<class 'float'>",
      "<class 'number'>",
      "<class 'decimal'>",
    ],
    correctAnswer: 1,
    explanation: "5.0 is a floating-point number, so its type is float.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "Which operator is used for exponentiation in Python?",
    options: ["^", "**", "exp()", "pow()"],
    correctAnswer: 1,
    explanation: "The ** operator is used for exponentiation in Python. For example, 2**3 equals 8.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "How do you create an empty list in Python?",
    options: ["list = []", "list = ()", "list = {}", "list = new List()"],
    correctAnswer: 0,
    explanation: "Empty square brackets [] create an empty list in Python.",
    difficulty: "beginner",
    category: "Data Structures",
  },
  {
    question: "What method adds an element to the end of a list?",
    options: ["add()", "append()", "insert()", "push()"],
    correctAnswer: 1,
    explanation: "The append() method adds an element to the end of a list.",
    difficulty: "beginner",
    category: "Data Structures",
  },
  {
    question: 'How do you access the value associated with key "name" in a dictionary called "person"?',
    options: [
      "person.name",
      'person["name"]',
      "person->name",
      "person.get(name)",
    ],
    correctAnswer: 1,
    explanation: "Dictionary values are accessed using square bracket notation with the key name.",
    difficulty: "intermediate",
    category: "Data Structures",
  },
  {
    question: "What is the difference between a list and a tuple in Python?",
    options: [
      "No difference",
      "Lists are mutable, tuples are immutable",
      "Tuples are faster",
      "Lists use [], tuples use ()",
    ],
    correctAnswer: 1,
    explanation: "The main difference is that lists are mutable (can be changed) while tuples are immutable (cannot be changed after creation).",
    difficulty: "intermediate",
    category: "Data Structures",
  },
  {
    question: "Which method removes and returns the last element of a list?",
    options: ["remove()", "delete()", "pop()", "clear()"],
    correctAnswer: 2,
    explanation: "The pop() method removes and returns the last element of a list.",
    difficulty: "intermediate",
    category: "Data Structures",
  },
  {
    question: "What keyword is used to exit a loop prematurely in Python?",
    options: ["exit", "break", "stop", "return"],
    correctAnswer: 1,
    explanation: 'The "break" keyword is used to exit a loop prematurely.',
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question: "Which of the following creates a range from 0 to 4?",
    options: ["range(5)", "range(0, 5)", "range(4)", "Both A and B"],
    correctAnswer: 3,
    explanation: "Both range(5) and range(0, 5) create a range from 0 to 4 (5 is excluded).",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question: 'What does the "continue" statement do in a loop?',
    options: [
      "Exits the loop",
      "Skips the rest of the current iteration",
      "Restarts the loop",
      "Pauses the loop",
    ],
    correctAnswer: 1,
    explanation: 'The "continue" statement skips the rest of the current iteration and moves to the next iteration.',
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question: "How do you define a function with default parameter values?",
    options: [
      "def func(x=5):",
      "def func(x default 5):",
      "def func(x := 5):",
      "def func(x, default=5):",
    ],
    correctAnswer: 0,
    explanation: "Default parameter values are defined using the equals sign (=) in the function definition.",
    difficulty: "intermediate",
    category: "Functions",
  },
  {
    question: 'What is the purpose of the "pass" statement?',
    options: [
      "To skip execution",
      "To act as a placeholder",
      "To pass variables",
      "To exit functions",
    ],
    correctAnswer: 1,
    explanation: 'The "pass" statement is a null operation that acts as a placeholder when syntactically correct code is required.',
    difficulty: "intermediate",
    category: "Functions",
  },
  {
    question: "How do you create a class in Python?",
    options: [
      "class MyClass:",
      "Class MyClass():",
      "create class MyClass:",
      "new class MyClass:",
    ],
    correctAnswer: 0,
    explanation: 'Classes in Python are defined using the "class" keyword followed by the class name and a colon.',
    difficulty: "intermediate",
    category: "Object-Oriented Programming",
  },
  {
    question: "What is the special method called when an object is created?",
    options: ["__create__()", "__new__()", "__init__()", "__start__()"],
    correctAnswer: 2,
    explanation: "The __init__() method is automatically called when an object is created (constructor).",
    difficulty: "intermediate",
    category: "Object-Oriented Programming",
  },
  {
    question: "How do you call a parent class method from a child class?",
    options: [
      "parent.method()",
      "super().method()",
      "base.method()",
      "inherit.method()",
    ],
    correctAnswer: 1,
    explanation: "The super() function is used to call methods from the parent class.",
    difficulty: "advanced",
    category: "Object-Oriented Programming",
  },
  {
    question: 'What does "self" represent in a Python class method?',
    options: [
      "The class itself",
      "The current instance",
      "A keyword",
      "The parent class",
    ],
    correctAnswer: 1,
    explanation: '"self" refers to the current instance of the class and is used to access instance variables and methods.',
    difficulty: "intermediate",
    category: "Object-Oriented Programming",
  },
  {
    question: "Which principle allows a child class to override parent class methods?",
    options: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"],
    correctAnswer: 2,
    explanation: "Polymorphism allows child classes to override and provide specific implementations of parent class methods.",
    difficulty: "advanced",
    category: "Object-Oriented Programming",
  },
];

async function seedQuizData() {
  try {
    console.log("🌱 Starting quiz data seeding...");

    // Create categories
    console.log("📝 Creating quiz categories...");
    for (const category of categories) {
      try {
        await (prisma as any).quizCategory.upsert({
          where: { name: category.name },
          update: category,
          create: category,
        });
        console.log(`✅ Created category: ${category.name}`);
      } catch (error) {
        console.log(`❌ Category creation failed: ${category.name}`, error);
      }
    }

    // Clear existing questions
    console.log("🗑️ Clearing existing quiz questions...");
    try {
      await (prisma as any).quizQuestion.deleteMany({});
      console.log("✅ Cleared existing questions");
    } catch (error) {
      console.log("No existing questions to clear");
    }

    // Create questions
    console.log("❓ Creating quiz questions...");
    for (const question of questions) {
      try {
        await (prisma as any).quizQuestion.create({
          data: question
        });
        console.log(`✅ Created question: ${question.question.substring(0, 50)}...`);
      } catch (error) {
        console.log(`❌ Question creation failed: ${question.question.substring(0, 50)}...`);
        console.error(error);
      }
    }

    // Update category question counts
    console.log("🔄 Updating category question counts...");
    for (const category of categories) {
      try {
        const questionCount = await (prisma as any).quizQuestion.count({
          where: {
            category: category.name,
            isActive: true,
          },
        });

        await (prisma as any).quizCategory.update({
          where: { name: category.name },
          data: { questionCount },
        });
        console.log(`✅ Updated ${category.name}: ${questionCount} questions`);
      } catch (error) {
        console.log(`❌ Count update failed for: ${category.name}`);
      }
    }

    console.log("🎉 Quiz data seeding completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Questions: ${questions.length}`);
    console.log(`   - Difficulty levels: beginner, intermediate, advanced`);
  } catch (error) {
    console.error("❌ Error seeding quiz data:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
if (require.main === module) {
  seedQuizData()
    .then(() => {
      console.log("✨ Seeding process completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding process failed:", error);
      process.exit(1);
    });
}

export { seedQuizData };