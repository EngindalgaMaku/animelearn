import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Memory Game Activities for Data Structures
 * 5 activities with increasing difficulty
 */
export const memoryGameDataStructuresActivities = [
  // 1) Difficulty 1 - Terminology Basics
  {
    title: "Memory Match: Core Data Structure Terms",
    description:
      "Match fundamental data structure terms with their correct definitions",
    activityType: "memory_game",
    category: "Data Structures",
    difficulty: 1,
    diamondReward: 18,
    experienceReward: 40,
    estimatedMinutes: 10,
    tags: ["data-structures", "memory", "terminology", "basics"],
    content: {
      instructions:
        "Match each data structure term with the correct description.",
      pairs: [
        {
          id: 1,
          card1: "Array",
          card2: "Contiguous memory; O(1) index access",
        },
        {
          id: 2,
          card1: "Linked List",
          card2: "Nodes with pointers; O(1) insert at head",
        },
        {
          id: 3,
          card1: "Stack",
          card2: "LIFO structure; push/pop at one end",
        },
        {
          id: 4,
          card1: "Queue",
          card2: "FIFO structure; enqueue/dequeue at opposite ends",
        },
        {
          id: 5,
          card1: "Hash Table",
          card2: "Average O(1) lookup via hashing",
        },
        {
          id: 6,
          card1: "Tree",
          card2: "Hierarchical structure with parent-child relationships",
        },
      ],
      timeLimit: 300,
      shuffleCards: true,
    },
    settings: {
      maxFlips: 30,
      showTimer: true,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Difficulty 2 - Complexity and Operations
  {
    title: "Memory Match: Operations & Time Complexity",
    description:
      "Match common operations with their typical time complexities in different data structures",
    activityType: "memory_game",
    category: "Data Structures",
    difficulty: 2,
    diamondReward: 22,
    experienceReward: 50,
    estimatedMinutes: 12,
    tags: ["complexity", "operations", "big-o", "memory"],
    content: {
      instructions:
        "Match each operation with its typical average time complexity for the given structure.",
      pairs: [
        {
          id: 1,
          card1: "Array index access",
          card2: "O(1)",
        },
        {
          id: 2,
          card1: "Linked list search",
          card2: "O(n)",
        },
        {
          id: 3,
          card1: "Balanced BST search",
          card2: "O(log n)",
        },
        {
          id: 4,
          card1: "Hash table successful lookup",
          card2: "O(1) average",
        },
        {
          id: 5,
          card1: "Binary heap push/pop",
          card2: "O(log n)",
        },
        {
          id: 6,
          card1: "Queue enqueue/dequeue (deque)",
          card2: "O(1)",
        },
      ],
      timeLimit: 360,
      shuffleCards: true,
    },
    settings: {
      maxFlips: 36,
      showTimer: true,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3) Difficulty 3 - Trees Focus
  {
    title: "Memory Match: Trees & Traversals",
    description:
      "Match tree traversal names with their visit orders and typical use-cases",
    activityType: "memory_game",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 26,
    experienceReward: 60,
    estimatedMinutes: 14,
    tags: ["trees", "traversals", "inorder", "preorder", "postorder", "memory"],
    content: {
      instructions: "Match traversal orders to names and typical properties.",
      pairs: [
        {
          id: 1,
          card1: "Preorder",
          card2: "Root → Left → Right",
        },
        {
          id: 2,
          card1: "Inorder",
          card2: "Left → Root → Right (sorted for BST)",
        },
        {
          id: 3,
          card1: "Postorder",
          card2: "Left → Right → Root",
        },
        {
          id: 4,
          card1: "Level-order (BFS)",
          card2: "Visit nodes per level using a queue",
        },
        {
          id: 5,
          card1: "Tree height",
          card2: "Longest path from root to a leaf",
        },
        {
          id: 6,
          card1: "BST property",
          card2: "Left < Root < Right (unique keys)",
        },
      ],
      timeLimit: 420,
      shuffleCards: true,
    },
    settings: {
      maxFlips: 40,
      showTimer: true,
    },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Difficulty 3 - Graphs Focus
  {
    title: "Memory Match: Graph Concepts",
    description:
      "Match graph concepts such as representations, traversals, and properties",
    activityType: "memory_game",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 16,
    tags: ["graphs", "bfs", "dfs", "adjacency", "memory"],
    content: {
      instructions:
        "Match each graph concept with its description or property.",
      pairs: [
        {
          id: 1,
          card1: "Adjacency list",
          card2: "Space O(V + E), ideal for sparse graphs",
        },
        {
          id: 2,
          card1: "Adjacency matrix",
          card2: "Space O(V^2), O(1) edge existence check",
        },
        {
          id: 3,
          card1: "BFS",
          card2: "Uses a queue; shortest edges path in unweighted graph",
        },
        {
          id: 4,
          card1: "DFS",
          card2: "Uses a stack or recursion; explores depth-first",
        },
        {
          id: 5,
          card1: "DAG",
          card2: "Directed acyclic graph; topological ordering exists",
        },
        {
          id: 6,
          card1: "Tree edges count",
          card2: "n - 1 edges for n nodes (connected, acyclic)",
        },
      ],
      timeLimit: 480,
      shuffleCards: true,
    },
    settings: {
      maxFlips: 42,
      showTimer: true,
    },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Difficulty 4 - Hashing & Heaps
  {
    title: "Memory Match: Hashing and Heaps",
    description:
      "Match hashing strategies, collision handling, and heap properties",
    activityType: "memory_game",
    category: "Data Structures",
    difficulty: 4,
    diamondReward: 34,
    experienceReward: 80,
    estimatedMinutes: 18,
    tags: ["hashing", "heap", "priority-queue", "collisions", "memory"],
    content: {
      instructions:
        "Match each hashing/heaps concept with its correct definition or property.",
      pairs: [
        {
          id: 1,
          card1: "Separate chaining",
          card2: "Linked structures per bucket for collisions",
        },
        {
          id: 2,
          card1: "Open addressing",
          card2: "Probe alternative slots in the table",
        },
        {
          id: 3,
          card1: "Quadratic probing",
          card2: "Reduces primary clustering vs linear probing",
        },
        {
          id: 4,
          card1: "Min-heap root",
          card2: "Always contains the smallest element",
        },
        {
          id: 5,
          card1: "Heap push/pop",
          card2: "Generally O(log n)",
        },
        {
          id: 6,
          card1: "Good hash property",
          card2: "Uniform distribution across buckets",
        },
      ],
      timeLimit: 540,
      shuffleCards: true,
    },
    settings: {
      maxFlips: 45,
      showTimer: true,
    },
    isActive: true,
    sortOrder: 5,
  },
];

export async function seedMemoryGameDataStructuresActivities() {
  await seedActivitiesWithDuplicateCheck(
    memoryGameDataStructuresActivities,
    "Memory Game Data Structures"
  );
}

// Execute if run directly
if (require.main === module) {
  seedMemoryGameDataStructuresActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Memory Game Data Structures activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
