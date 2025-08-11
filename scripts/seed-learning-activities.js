const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const sampleActivities = [
  // Algorithm Visualization Activities
  {
    title: "Bubble Sort Visualization",
    description:
      "Interactive visualization of the bubble sort algorithm with step-by-step execution",
    activityType: "algorithm_visualization",
    category: "algorithms",
    difficulty: 2,
    diamondReward: 15,
    experienceReward: 100,
    estimatedMinutes: 10,
    tags: ["sorting", "algorithms", "visualization", "beginner"],
    isActive: true,
    sortOrder: 1,
    content: {
      algorithmType: "bubble_sort",
      title: "Bubble Sort Algorithm",
      description:
        "Watch how bubble sort algorithm works step by step with interactive visualization. See how elements bubble up to their correct positions!",
      initialArray: [64, 34, 25, 12, 22, 11, 90],
      speed: "medium",
      showCode: true,
      showComplexity: true,
      allowUserInput: true,
      codeSnippet: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`,
      complexity: {
        time: "O(n²)",
        space: "O(1)",
      },
    },
    settings: {},
  },
  {
    title: "Quick Sort Visualization",
    description:
      "Learn the divide and conquer approach with Quick Sort algorithm visualization",
    activityType: "algorithm_visualization",
    category: "algorithms",
    difficulty: 3,
    diamondReward: 20,
    experienceReward: 150,
    estimatedMinutes: 15,
    tags: ["sorting", "algorithms", "divide-conquer", "intermediate"],
    isActive: true,
    sortOrder: 2,
    content: {
      algorithmType: "quick_sort",
      title: "Quick Sort Algorithm",
      description:
        "Master the divide and conquer strategy with Quick Sort visualization. See how partitioning works!",
      initialArray: [64, 34, 25, 12, 22, 11, 90],
      speed: "medium",
      showCode: true,
      showComplexity: true,
      allowUserInput: true,
      codeSnippet: `def quick_sort(arr, low, high):
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
      complexity: {
        time: "O(n log n)",
        space: "O(log n)",
      },
    },
    settings: {},
  },
  {
    title: "Binary Search Visualization",
    description:
      "Understand how binary search efficiently finds elements in sorted arrays",
    activityType: "algorithm_visualization",
    category: "algorithms",
    difficulty: 2,
    diamondReward: 12,
    experienceReward: 80,
    estimatedMinutes: 8,
    tags: ["search", "algorithms", "binary-search", "efficiency"],
    isActive: true,
    sortOrder: 3,
    content: {
      algorithmType: "binary_search",
      title: "Binary Search Algorithm",
      description:
        "See how binary search cuts the search space in half with each step!",
      initialArray: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
      speed: "medium",
      showCode: true,
      showComplexity: true,
      allowUserInput: true,
      codeSnippet: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`,
      complexity: {
        time: "O(log n)",
        space: "O(1)",
      },
    },
    settings: {},
  },

  // Interactive Coding Activities
  {
    title: "Python Function Basics",
    description:
      "Complete a simple Python function to calculate the sum of numbers",
    activityType: "interactive_coding",
    category: "programming",
    difficulty: 1,
    diamondReward: 10,
    experienceReward: 50,
    estimatedMinutes: 5,
    tags: ["python", "functions", "basics", "beginner"],
    isActive: true,
    sortOrder: 4,
    content: {
      exerciseType: "code_completion",
      title: "Complete the Sum Function",
      description:
        "Fill in the missing parts to create a function that calculates the sum of all numbers in a list",
      instructions:
        "Complete the function by filling in the blanks. The function should initialize a total, iterate through the numbers, and return the sum.",
      starterCode: `def calculate_sum(numbers):
    total = ___
    for num in numbers:
        total ___ num
    return ___`,
      solution: `def calculate_sum(numbers):
    total = 0
    for num in numbers:
        total += num
    return total`,
      testCases: [
        {
          input: "[1, 2, 3, 4, 5]",
          expectedOutput: "15",
          description: "Sum of 1 to 5",
        },
        {
          input: "[10, 20, 30]",
          expectedOutput: "60",
          description: "Sum of 10, 20, 30",
        },
        {
          input: "[]",
          expectedOutput: "0",
          description: "Empty list should return 0",
        },
      ],
      hints: [
        "Initialize total to 0",
        "Use += to add each number to total",
        "Return the total at the end",
      ],
    },
    settings: {},
  },
  {
    title: "Find Maximum Element",
    description: "Write a function to find the maximum element in a list",
    activityType: "interactive_coding",
    category: "programming",
    difficulty: 2,
    diamondReward: 15,
    experienceReward: 75,
    estimatedMinutes: 8,
    tags: ["python", "algorithms", "max-finding", "beginner"],
    isActive: true,
    sortOrder: 5,
    content: {
      exerciseType: "function_writing",
      title: "Find Maximum Element",
      description:
        "Write a function that finds and returns the maximum element in a list of numbers",
      instructions:
        "Implement a function that takes a list of numbers and returns the largest one. Handle edge cases like empty lists.",
      starterCode: `def find_maximum(numbers):
    # Your code here
    pass`,
      solution: `def find_maximum(numbers):
    if not numbers:
        return None
    
    max_val = numbers[0]
    for num in numbers[1:]:
        if num > max_val:
            max_val = num
    
    return max_val`,
      testCases: [
        {
          input: "[1, 5, 3, 9, 2]",
          expectedOutput: "9",
          description: "Maximum of mixed numbers",
        },
        {
          input: "[-1, -5, -3]",
          expectedOutput: "-1",
          description: "Maximum of negative numbers",
        },
        {
          input: "[42]",
          expectedOutput: "42",
          description: "Single element list",
        },
        {
          input: "[]",
          expectedOutput: "None",
          description: "Empty list should return None",
        },
      ],
      hints: [
        "Handle the empty list case first",
        "Start with the first element as the current maximum",
        "Compare each element with the current maximum",
        "Update the maximum when you find a larger element",
      ],
    },
    settings: {},
  },
  {
    title: "Palindrome Checker",
    description: "Create a function to check if a string is a palindrome",
    activityType: "interactive_coding",
    category: "programming",
    difficulty: 2,
    diamondReward: 18,
    experienceReward: 90,
    estimatedMinutes: 12,
    tags: ["python", "strings", "palindrome", "algorithms"],
    isActive: true,
    sortOrder: 6,
    content: {
      exerciseType: "function_writing",
      title: "Palindrome Checker",
      description:
        "Write a function that checks if a given string reads the same forwards and backwards",
      instructions:
        "Create a function that returns True if the input string is a palindrome, False otherwise. Ignore case and spaces.",
      starterCode: `def is_palindrome(text):
    # Your code here
    pass`,
      solution: `def is_palindrome(text):
    # Remove spaces and convert to lowercase
    cleaned = text.replace(' ', '').lower()
    
    # Compare string with its reverse
    return cleaned == cleaned[::-1]`,
      testCases: [
        {
          input: '"racecar"',
          expectedOutput: "True",
          description: "Simple palindrome",
        },
        {
          input: '"A man a plan a canal Panama"',
          expectedOutput: "True",
          description: "Palindrome with spaces",
        },
        {
          input: '"race a car"',
          expectedOutput: "False",
          description: "Not a palindrome",
        },
        {
          input: '"Madam"',
          expectedOutput: "True",
          description: "Mixed case palindrome",
        },
      ],
      hints: [
        "Remove spaces and convert to lowercase first",
        "Compare the string with its reverse",
        "You can use string slicing [::-1] to reverse",
        "The replace() method can remove spaces",
      ],
    },
    settings: {},
  },

  // Memory Game Activities
  {
    title: "Anime Characters Memory Game",
    description:
      "Match anime characters with their descriptions in this fun memory challenge",
    activityType: "memory_game",
    category: "anime",
    difficulty: 2,
    diamondReward: 12,
    experienceReward: 60,
    estimatedMinutes: 5,
    tags: ["anime", "memory", "characters", "fun"],
    isActive: true,
    sortOrder: 7,
    content: {
      pairs: [
        {
          id: 1,
          text: "Naruto Uzumaki",
          match: "🍜 Ramen-loving ninja from Hidden Leaf",
        },
        { id: 2, text: "Monkey D. Luffy", match: "🏴‍☠️ Rubber pirate captain" },
        { id: 3, text: "Son Goku", match: "⚡ Super Saiyan warrior" },
        {
          id: 4,
          text: "Ichigo Kurosaki",
          match: "⚔️ Soul Reaper with orange hair",
        },
        { id: 5, text: "Edward Elric", match: "⚗️ Fullmetal Alchemist" },
        { id: 6, text: "Natsu Dragneel", match: "🔥 Fire Dragon Slayer" },
      ],
      timeLimit: 180,
      shuffleCards: true,
    },
    settings: {},
  },
  {
    title: "Programming Concepts Memory Match",
    description:
      "Test your knowledge of programming concepts by matching terms with definitions",
    activityType: "memory_game",
    category: "programming",
    difficulty: 2,
    diamondReward: 14,
    experienceReward: 70,
    estimatedMinutes: 6,
    tags: ["programming", "concepts", "definitions", "learning"],
    isActive: true,
    sortOrder: 8,
    content: {
      pairs: [
        { id: 1, text: "Variable", match: "📦 Storage location with a name" },
        { id: 2, text: "Function", match: "🔧 Reusable block of code" },
        { id: 3, text: "Loop", match: "🔄 Repeats code multiple times" },
        { id: 4, text: "Array", match: "📚 Collection of elements" },
        { id: 5, text: "Class", match: "🏗️ Blueprint for creating objects" },
        { id: 6, text: "Algorithm", match: "📋 Step-by-step problem solution" },
      ],
      timeLimit: 200,
      shuffleCards: true,
    },
    settings: {},
  },

  // Quiz Activities
  {
    title: "Basic Algorithms Quiz",
    description:
      "Test your understanding of fundamental algorithms and their complexities",
    activityType: "quiz",
    category: "algorithms",
    difficulty: 2,
    diamondReward: 16,
    experienceReward: 80,
    estimatedMinutes: 10,
    tags: ["algorithms", "quiz", "complexity", "theory"],
    isActive: true,
    sortOrder: 9,
    content: {
      questions: [
        {
          id: 1,
          question:
            "What is the time complexity of bubble sort in the worst case?",
          options: ["O(n)", "O(n log n)", "O(n²)", "O(2^n)"],
          correctAnswer: 2,
          explanation:
            "Bubble sort has O(n²) time complexity in the worst case because it uses nested loops to compare and swap elements.",
        },
        {
          id: 2,
          question: "Which algorithm uses the divide and conquer approach?",
          options: [
            "Bubble Sort",
            "Selection Sort",
            "Quick Sort",
            "Insertion Sort",
          ],
          correctAnswer: 2,
          explanation:
            "Quick Sort uses divide and conquer by partitioning the array and recursively sorting the sub-arrays.",
        },
        {
          id: 3,
          question: "What is the space complexity of binary search?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          correctAnswer: 0,
          explanation:
            "Binary search (iterative version) uses O(1) space complexity as it only needs a few variables to track indices.",
        },
      ],
      timeLimit: 300,
      randomOrder: true,
    },
    settings: {},
  },
  {
    title: "Anime Knowledge Quiz",
    description:
      "How well do you know your favorite anime series? Test your knowledge!",
    activityType: "quiz",
    category: "anime",
    difficulty: 2,
    diamondReward: 14,
    experienceReward: 70,
    estimatedMinutes: 8,
    tags: ["anime", "trivia", "knowledge", "entertainment"],
    isActive: true,
    sortOrder: 10,
    content: {
      questions: [
        {
          id: 1,
          question: "Which anime features a protagonist named Monkey D. Luffy?",
          options: ["Naruto", "One Piece", "Bleach", "Dragon Ball"],
          correctAnswer: 1,
          explanation:
            "One Piece is the adventure story of Monkey D. Luffy and his Straw Hat Pirates crew!",
        },
        {
          id: 2,
          question: "What is the name of the notebook in Death Note?",
          options: [
            "Death Note",
            "Black Book",
            "Shinigami Notes",
            "Death Journal",
          ],
          correctAnswer: 0,
          explanation:
            'The supernatural notebook is simply called "Death Note" and belongs to the Shinigami.',
        },
        {
          id: 3,
          question:
            "In Attack on Titan, what are the giant humanoid creatures called?",
          options: ["Giants", "Titans", "Colossal Beings", "Wall Breakers"],
          correctAnswer: 1,
          explanation:
            "The giant humanoid creatures that threaten humanity are called Titans.",
        },
      ],
      timeLimit: 240,
      randomOrder: false,
    },
    settings: {},
  },
];

async function seedLearningActivities() {
  console.log("🌱 Starting to seed learning activities...");

  try {
    // Clear existing activities (optional)
    console.log("🗑️ Clearing existing learning activities...");
    await prisma.learningActivity.deleteMany({});

    // Create new activities
    console.log("📚 Creating sample learning activities...");

    for (const activity of sampleActivities) {
      const activityData = {
        ...activity,
        tags: JSON.stringify(activity.tags), // Convert tags array to JSON string
        content: JSON.stringify(activity.content), // Convert content object to JSON string
        settings: JSON.stringify(activity.settings), // Convert settings object to JSON string
      };

      await prisma.learningActivity.create({
        data: activityData,
      });
      console.log(`✅ Created: ${activity.title}`);
    }

    console.log("🎉 Successfully seeded learning activities!");
    console.log(`📊 Total activities created: ${sampleActivities.length}`);

    // Show summary by category
    const categories = {};
    sampleActivities.forEach((activity) => {
      categories[activity.category] = (categories[activity.category] || 0) + 1;
    });

    console.log("\n📈 Activities by category:");
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} activities`);
    });

    // Show summary by type
    const types = {};
    sampleActivities.forEach((activity) => {
      types[activity.activityType] = (types[activity.activityType] || 0) + 1;
    });

    console.log("\n🎯 Activities by type:");
    Object.entries(types).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} activities`);
    });
  } catch (error) {
    console.error("❌ Error seeding learning activities:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
if (require.main === module) {
  seedLearningActivities().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { seedLearningActivities };
