const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const defaultConfiguration = {
  name: "Default Code Arena",
  description:
    "Default configuration for the code arena with standard settings",
  isActive: true,
  isDefault: true,
  difficultyConfigs: [
    {
      level: 1,
      label: "Beginner",
      color: "from-emerald-400 to-emerald-600",
      icon: "🌱",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
      borderColor: "border-emerald-200",
      sortOrder: 1,
      isActive: true,
    },
    {
      level: 2,
      label: "Basic",
      color: "from-blue-400 to-blue-600",
      icon: "📚",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      borderColor: "border-blue-200",
      sortOrder: 2,
      isActive: true,
    },
    {
      level: 3,
      label: "Intermediate",
      color: "from-amber-400 to-amber-600",
      icon: "⚡",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      borderColor: "border-amber-200",
      sortOrder: 3,
      isActive: true,
    },
    {
      level: 4,
      label: "Advanced",
      color: "from-purple-400 to-purple-600",
      icon: "🚀",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      borderColor: "border-purple-200",
      sortOrder: 4,
      isActive: true,
    },
    {
      level: 5,
      label: "Expert",
      color: "from-red-400 to-red-600",
      icon: "👑",
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      borderColor: "border-red-200",
      sortOrder: 5,
      isActive: true,
    },
  ],
  categoryConfigs: [
    {
      key: "Python Basics",
      title: "Python Fundamentals",
      description: "Master the building blocks of Python programming",
      icon: "🐍",
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50",
      iconBg: "bg-green-500",
      sortOrder: 1,
      isActive: true,
    },
    {
      key: "Data Structures",
      title: "Data Structures",
      description: "Learn essential data organization techniques",
      icon: "📊",
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-50 to-cyan-50",
      iconBg: "bg-blue-500",
      sortOrder: 2,
      isActive: true,
    },
    {
      key: "Algorithms",
      title: "Algorithms",
      description: "Solve problems with efficient algorithms",
      icon: "🧮",
      gradient: "from-purple-500 to-violet-600",
      bgGradient: "from-purple-50 to-violet-50",
      iconBg: "bg-purple-500",
      sortOrder: 3,
      isActive: true,
    },
    {
      key: "Functions & OOP",
      title: "Functions & OOP",
      description: "Object-oriented programming concepts",
      icon: "🏗️",
      gradient: "from-indigo-500 to-blue-600",
      bgGradient: "from-indigo-50 to-blue-50",
      iconBg: "bg-indigo-500",
      sortOrder: 4,
      isActive: true,
    },
    {
      key: "Web Development",
      title: "Web Development",
      description: "Build modern web applications",
      icon: "🌐",
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-50 to-red-50",
      iconBg: "bg-orange-500",
      sortOrder: 5,
      isActive: true,
    },
    {
      key: "Data Science",
      title: "Data Science",
      description: "Analyze and visualize data",
      icon: "📈",
      gradient: "from-pink-500 to-rose-600",
      bgGradient: "from-pink-50 to-rose-50",
      iconBg: "bg-pink-500",
      sortOrder: 6,
      isActive: true,
    },
  ],
  activityTypeConfigs: [
    {
      type: "drag_drop",
      name: "Drag & Drop",
      icon: "🎯",
      color: "text-blue-600",
      description: "Interactive drag and drop exercises",
      sortOrder: 1,
      isActive: true,
    },
    {
      type: "memory_game",
      name: "Memory Game",
      icon: "🧠",
      color: "text-purple-600",
      description: "Memory and pattern recognition games",
      sortOrder: 2,
      isActive: true,
    },
    {
      type: "quiz",
      name: "Quiz",
      icon: "❓",
      color: "text-green-600",
      description: "Interactive quiz questions",
      sortOrder: 3,
      isActive: true,
    },
    {
      type: "fill_blanks",
      name: "Fill Blanks",
      icon: "✏️",
      color: "text-orange-600",
      description: "Fill in the missing code or text",
      sortOrder: 4,
      isActive: true,
    },
    {
      type: "interactive_coding",
      name: "Code Lab",
      icon: "💻",
      color: "text-indigo-600",
      description: "Interactive coding exercises",
      sortOrder: 5,
      isActive: true,
    },
    {
      type: "algorithm_visualization",
      name: "Algorithm Viz",
      icon: "🔄",
      color: "text-teal-600",
      description: "Algorithm visualization activities",
      sortOrder: 6,
      isActive: true,
    },
    {
      type: "matching",
      name: "Matching",
      icon: "🔗",
      color: "text-pink-600",
      description: "Match related concepts or code",
      sortOrder: 7,
      isActive: true,
    },
    {
      type: "code_builder",
      name: "Code Builder",
      icon: "🏗️",
      color: "text-cyan-600",
      description: "Build code step by step",
      sortOrder: 8,
      isActive: true,
    },
    {
      type: "class_builder",
      name: "Class Builder",
      icon: "🏛️",
      color: "text-violet-600",
      description: "Build classes and objects",
      sortOrder: 9,
      isActive: true,
    },
    {
      type: "interactive_demo",
      name: "Demo",
      icon: "🎪",
      color: "text-emerald-600",
      description: "Interactive demonstrations",
      sortOrder: 10,
      isActive: true,
    },
    {
      type: "data_exploration",
      name: "Data Explorer",
      icon: "🔍",
      color: "text-amber-600",
      description: "Explore and analyze data",
      sortOrder: 11,
      isActive: true,
    },
  ],
  uiConfig: {
    heroTitle: "Master Programming",
    heroSubtitle: "Through Epic Learning",
    heroDescription:
      "🎯 Embark on an epic coding adventure with interactive challenges, unlock achievements, and build world-class programming skills!",
    primaryColor: "#6366f1",
    secondaryColor: "#ec4899",
    accentColor: "#06b6d4",
    backgroundColor: "from-indigo-50 via-white to-cyan-50",
    headerGradient: "from-indigo-600 via-purple-600 to-pink-600",
    showStats: true,
    showFilters: true,
    enableAnimations: true,
  },
};

async function seedArenaConfig() {
  try {
    console.log("🌱 Seeding arena configuration...");

    // Check if default configuration already exists
    const existingConfig = await prisma.arenaConfiguration.findFirst({
      where: { isDefault: true },
    });

    if (existingConfig) {
      console.log("✅ Default arena configuration already exists");
      return;
    }

    // Create the default configuration
    const config = await prisma.arenaConfiguration.create({
      data: {
        name: defaultConfiguration.name,
        description: defaultConfiguration.description,
        isActive: defaultConfiguration.isActive,
        isDefault: defaultConfiguration.isDefault,
        difficultyConfigs: {
          create: defaultConfiguration.difficultyConfigs,
        },
        categoryConfigs: {
          create: defaultConfiguration.categoryConfigs,
        },
        activityTypeConfigs: {
          create: defaultConfiguration.activityTypeConfigs,
        },
        uiConfig: {
          create: defaultConfiguration.uiConfig,
        },
      },
      include: {
        difficultyConfigs: true,
        categoryConfigs: true,
        activityTypeConfigs: true,
        uiConfig: true,
      },
    });

    console.log("✅ Default arena configuration created successfully");
    console.log(
      `📊 Created ${config.difficultyConfigs.length} difficulty levels`
    );
    console.log(`📚 Created ${config.categoryConfigs.length} categories`);
    console.log(
      `🎮 Created ${config.activityTypeConfigs.length} activity types`
    );
    console.log(`🎨 Created UI configuration`);
  } catch (error) {
    console.error("❌ Error seeding arena configuration:", error);
    throw error;
  }
}

async function main() {
  try {
    await seedArenaConfig();
    console.log("🎉 Arena configuration seeding completed successfully!");
  } catch (error) {
    console.error("💥 Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { seedArenaConfig };
