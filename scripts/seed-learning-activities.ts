import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleActivities = [
  {
    title: "Python Basics Memory Game",
    description: "Match Python concepts with their definitions. Learn fundamental programming terms while having fun!",
    type: "memory",
    difficulty: 1,
    diamondReward: 25,
    experienceReward: 50,
    estimatedTime: 5,
    isActive: true,
    content: {
      pairs: [
        { id: 1, text: "Variable", match: "Container for storing data" },
        { id: 2, text: "Function", match: "Reusable block of code" },
        { id: 3, text: "Loop", match: "Repeats code multiple times" },
        { id: 4, text: "List", match: "Ordered collection of items" },
        { id: 5, text: "String", match: "Text data type" },
        { id: 6, text: "Integer", match: "Whole number data type" }
      ],
      timeLimit: 180,
      shuffleCards: true
    },
    settings: {
      maxAttempts: 3,
      showTimer: true,
      allowHints: true
    },
    tags: ["python", "basics", "programming", "beginner"]
  },
  {
    title: "Data Types Challenge",
    description: "Master Python data types by matching them with their examples. Perfect for beginners!",
    type: "memory",
    difficulty: 2,
    diamondReward: 35,
    experienceReward: 75,
    estimatedTime: 7,
    isActive: true,
    content: {
      pairs: [
        { id: 1, text: "int", match: "42" },
        { id: 2, text: "float", match: "3.14" },
        { id: 3, text: "str", match: "'Hello World'" },
        { id: 4, text: "bool", match: "True or False" },
        { id: 5, text: "list", match: "[1, 2, 3]" },
        { id: 6, text: "dict", match: "{'key': 'value'}" },
        { id: 7, text: "tuple", match: "(1, 2, 3)" },
        { id: 8, text: "set", match: "{1, 2, 3}" }
      ],
      timeLimit: 240,
      shuffleCards: true
    },
    settings: {
      maxAttempts: 3,
      showTimer: true,
      allowHints: true
    },
    tags: ["python", "data-types", "intermediate"]
  },
  {
    title: "Control Flow Mastery",
    description: "Learn Python control flow statements by matching keywords with their purposes.",
    type: "memory",
    difficulty: 3,
    diamondReward: 50,
    experienceReward: 100,
    estimatedTime: 10,
    isActive: true,
    content: {
      pairs: [
        { id: 1, text: "if", match: "Conditional execution" },
        { id: 2, text: "elif", match: "Additional condition" },
        { id: 3, text: "else", match: "Default case" },
        { id: 4, text: "for", match: "Iterate over sequence" },
        { id: 5, text: "while", match: "Loop with condition" },
        { id: 6, text: "break", match: "Exit loop early" },
        { id: 7, text: "continue", match: "Skip to next iteration" },
        { id: 8, text: "pass", match: "Do nothing placeholder" },
        { id: 9, text: "return", match: "Exit function with value" },
        { id: 10, text: "yield", match: "Generator function keyword" }
      ],
      timeLimit: 300,
      shuffleCards: true
    },
    settings: {
      maxAttempts: 5,
      showTimer: true,
      allowHints: true
    },
    tags: ["python", "control-flow", "intermediate", "advanced"]
  },
  {
    title: "Object-Oriented Programming",
    description: "Challenge yourself with OOP concepts! Match classes, methods, and inheritance terms.",
    type: "memory",
    difficulty: 4,
    diamondReward: 75,
    experienceReward: 150,
    estimatedTime: 12,
    isActive: true,
    content: {
      pairs: [
        { id: 1, text: "class", match: "Blueprint for objects" },
        { id: 2, text: "__init__", match: "Constructor method" },
        { id: 3, text: "self", match: "Reference to instance" },
        { id: 4, text: "inheritance", match: "Child class extends parent" },
        { id: 5, text: "polymorphism", match: "Multiple forms of methods" },
        { id: 6, text: "encapsulation", match: "Data hiding principle" },
        { id: 7, text: "abstraction", match: "Hide complex implementation" },
        { id: 8, text: "method", match: "Function inside a class" },
        { id: 9, text: "attribute", match: "Variable inside a class" },
        { id: 10, text: "super()", match: "Access parent class" },
        { id: 11, text: "@property", match: "Method as attribute" },
        { id: 12, text: "__str__", match: "String representation" }
      ],
      timeLimit: 360,
      shuffleCards: true
    },
    settings: {
      maxAttempts: 5,
      showTimer: true,
      allowHints: true
    },
    tags: ["python", "oop", "advanced", "classes"]
  },
  {
    title: "Python Libraries Expert",
    description: "Test your knowledge of popular Python libraries and their use cases. For advanced learners!",
    type: "memory",
    difficulty: 5,
    diamondReward: 100,
    experienceReward: 200,
    estimatedTime: 15,
    isActive: true,
    content: {
      pairs: [
        { id: 1, text: "NumPy", match: "Numerical computing" },
        { id: 2, text: "Pandas", match: "Data manipulation" },
        { id: 3, text: "Matplotlib", match: "Data visualization" },
        { id: 4, text: "Requests", match: "HTTP requests" },
        { id: 5, text: "Flask", match: "Web framework" },
        { id: 6, text: "Django", match: "Full-stack web framework" },
        { id: 7, text: "SQLAlchemy", match: "Database ORM" },
        { id: 8, text: "Pytest", match: "Testing framework" },
        { id: 9, text: "BeautifulSoup", match: "Web scraping" },
        { id: 10, text: "Scikit-learn", match: "Machine learning" },
        { id: 11, text: "TensorFlow", match: "Deep learning" },
        { id: 12, text: "OpenCV", match: "Computer vision" },
        { id: 13, text: "Asyncio", match: "Asynchronous programming" },
        { id: 14, text: "Celery", match: "Task queue" }
      ],
      timeLimit: 450,
      shuffleCards: true
    },
    settings: {
      maxAttempts: 10,
      showTimer: true,
      allowHints: true
    },
    tags: ["python", "libraries", "expert", "advanced"]
  },
  {
    title: "Anime Programming Terms",
    description: "A fun twist! Match anime characters with programming concepts they represent.",
    type: "memory",
    difficulty: 2,
    diamondReward: 40,
    experienceReward: 80,
    estimatedTime: 8,
    isActive: true,
    content: {
      pairs: [
        { id: 1, text: "Naruto", match: "Clone() Method" },
        { id: 2, text: "Goku", match: "Infinite Loop Power" },
        { id: 3, text: "Edward Elric", match: "Equivalent Exchange API" },
        { id: 4, text: "Saitama", match: "One Punch Function" },
        { id: 5, text: "Light Yagami", match: "Death Note Database" },
        { id: 6, text: "Senku Ishigami", match: "Scientific Algorithm" },
        { id: 7, text: "Lelouch", match: "Command Pattern" },
        { id: 8, text: "Rimuru", match: "Adaptive Interface" }
      ],
      timeLimit: 200,
      shuffleCards: true
    },
    settings: {
      maxAttempts: 3,
      showTimer: true,
      allowHints: true
    },
    tags: ["anime", "fun", "programming", "creative"]
  }
];

async function seedLearningActivities() {
  console.log('🌱 Seeding learning activities...');

  try {
    // Clear existing activities (optional - remove if you want to keep existing data)
    await prisma.learningActivity.deleteMany({});
    console.log('🗑️  Cleared existing learning activities');

    // Create new activities
    for (const activity of sampleActivities) {
      const created = await prisma.learningActivity.create({
        data: {
          title: activity.title,
          description: activity.description,
          activityType: activity.type,
          difficulty: activity.difficulty,
          diamondReward: activity.diamondReward,
          experienceReward: activity.experienceReward,
          estimatedMinutes: activity.estimatedTime,
          isActive: activity.isActive,
          content: JSON.stringify(activity.content),
          settings: JSON.stringify(activity.settings),
          tags: JSON.stringify(activity.tags),
        },
      });
      
      console.log(`✅ Created activity: ${created.title}`);
    }

    console.log(`🎉 Successfully seeded ${sampleActivities.length} learning activities!`);
  } catch (error) {
    console.error('❌ Error seeding learning activities:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedLearningActivities();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed if this file is executed directly
if (require.main === module) {
  main();
}

export { seedLearningActivities };