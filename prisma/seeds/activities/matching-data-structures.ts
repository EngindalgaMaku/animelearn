import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Matching Activities for Data Structures
 * 5 activities with increasing difficulty
 */
export const matchingDataStructuresActivities = [
  // 1) Difficulty 1 - Foundations matching
  {
    title: "Match: Data Structure to Description (Foundations)",
    description:
      "Match common data structures to their core descriptions and characteristics",
    activityType: "matching",
    category: "Data Structures",
    difficulty: 1,
    diamondReward: 18,
    experienceReward: 40,
    estimatedMinutes: 10,
    tags: ["data-structures", "matching", "basics", "terminology"],
    content: {
      instructions:
        "Match each data structure on the left with its most accurate description on the right.",
      pairs: [
        {
          id: "1",
          left: "Array",
          right: "Contiguous memory, O(1) index access",
          explanation: "Arrays provide constant-time random access by index.",
        },
        {
          id: "2",
          left: "Linked List",
          right: "Nodes linked with pointers, O(1) insert at head",
          explanation:
            "Linked lists excel at insert/removal when you have a reference to position.",
        },
        {
          id: "3",
          left: "Stack",
          right: "LIFO access pattern",
          explanation: "Last-In, First-Out operations via push/pop.",
        },
        {
          id: "4",
          left: "Queue",
          right: "FIFO access pattern",
          explanation: "First-In, First-Out operations via enqueue/dequeue.",
        },
        {
          id: "5",
          left: "Hash Table",
          right: "Average O(1) lookup with hashing",
          explanation:
            "With a good hash function and load factor control, lookups are O(1) on average.",
        },
      ],
    },
    settings: {
      allowMultipleAttempts: true,
      showExplanations: true,
      timeLimit: 300,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Difficulty 2 - Array vs Linked List trade-offs
  {
    title: "Match: Array vs Linked List Trade-offs",
    description:
      "Match operations with whether arrays or linked lists are typically more efficient",
    activityType: "matching",
    category: "Data Structures",
    difficulty: 2,
    diamondReward: 22,
    experienceReward: 50,
    estimatedMinutes: 12,
    tags: ["arrays", "linked-lists", "performance", "matching"],
    content: {
      instructions:
        "For each operation, match the structure that generally performs better (Array or Linked List).",
      pairs: [
        {
          id: "1",
          left: "Random access by index",
          right: "Array",
          explanation: "Arrays provide O(1) random access; lists are O(n).",
        },
        {
          id: "2",
          left: "Insert at head repeatedly",
          right: "Linked List",
          explanation: "Singly linked lists can insert at head in O(1).",
        },
        {
          id: "3",
          left: "Insert in middle without extra data",
          right: "Linked List",
          explanation:
            "With a node reference, linked lists can insert in O(1); arrays require shifting.",
        },
        {
          id: "4",
          left: "Cache-friendly iteration",
          right: "Array",
          explanation:
            "Arrays are contiguous in memory; better cache locality than linked lists.",
        },
        {
          id: "5",
          left: "Memory overhead per element",
          right: "Array",
          explanation:
            "Linked lists store pointers per node; arrays are compact.",
        },
      ],
    },
    settings: {
      allowMultipleAttempts: true,
      showExplanations: true,
      timeLimit: 360,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3) Difficulty 3 - Trees and BST specifics
  {
    title: "Match: Trees, BST, and Properties",
    description: "Match tree-related terms to their definitions and properties",
    activityType: "matching",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 26,
    experienceReward: 60,
    estimatedMinutes: 14,
    tags: ["trees", "bst", "properties", "matching"],
    content: {
      instructions:
        "Match each tree-related concept to the correct description.",
      pairs: [
        {
          id: "1",
          left: "Tree height",
          right: "Longest path from root to a leaf",
          explanation:
            "Assuming height of a single node is 0, height is the max depth.",
        },
        {
          id: "2",
          left: "Balanced BST average search",
          right: "O(log n)",
          explanation: "Balanced trees keep operations logarithmic on average.",
        },
        {
          id: "3",
          left: "Inorder traversal of BST",
          right: "Yields sorted keys",
          explanation: "Left, Root, Right order yields ascending keys for BST.",
        },
        {
          id: "4",
          left: "AVL Tree rotations",
          right: "Uses left/right rotations to maintain balance",
          explanation: "Rotations rebalance after insertions/deletions.",
        },
        {
          id: "5",
          left: "Leaf node",
          right: "Node with no children",
          explanation: "Terminal nodes in a tree are leaves.",
        },
      ],
    },
    settings: {
      allowMultipleAttempts: true,
      showExplanations: true,
      timeLimit: 420,
    },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Difficulty 3 - Graphs core ideas
  {
    title: "Match: Graph Fundamentals",
    description:
      "Match graph concepts such as representations, traversals, and properties",
    activityType: "matching",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 16,
    tags: ["graphs", "bfs", "dfs", "adjacency", "matching"],
    content: {
      instructions:
        "Match the graph concept on the left with its correct description on the right.",
      pairs: [
        {
          id: "1",
          left: "Adjacency list",
          right: "Space O(V + E), great for sparse graphs",
          explanation:
            "Stores only existing edges; efficient for sparse graphs.",
        },
        {
          id: "2",
          left: "Adjacency matrix",
          right: "Space O(V^2), O(1) edge existence check",
          explanation: "Useful for dense graphs; simple representation.",
        },
        {
          id: "3",
          left: "BFS shortest path (unweighted)",
          right: "Fewest edges from source",
          explanation: "BFS explores by levels using a queue.",
        },
        {
          id: "4",
          left: "DFS typical auxiliary structure",
          right: "Stack (explicit or recursion)",
          explanation: "DFS leverages call stack or explicit stack.",
        },
        {
          id: "5",
          left: "DAG",
          right: "Admits a topological ordering",
          explanation: "Directed acyclic graphs support topological sort.",
        },
      ],
    },
    settings: {
      allowMultipleAttempts: true,
      showExplanations: true,
      timeLimit: 480,
    },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Difficulty 4 - Hashing & Heaps
  {
    title: "Match: Hashing Strategies and Heap Properties",
    description:
      "Match hashing collision strategies, properties, and heap fundamentals",
    activityType: "matching",
    category: "Data Structures",
    difficulty: 4,
    diamondReward: 34,
    experienceReward: 80,
    estimatedMinutes: 18,
    tags: ["hashing", "heaps", "priority-queue", "matching"],
    content: {
      instructions:
        "Match each hashing or heap concept to the correct description or property.",
      pairs: [
        {
          id: "1",
          left: "Separate chaining",
          right: "Stores collided keys in per-bucket structures",
          explanation:
            "Linked lists or trees in buckets store multiple entries.",
        },
        {
          id: "2",
          left: "Open addressing",
          right: "Probes alternative slots in table",
          explanation: "Linear/quadratic probing or double hashing.",
        },
        {
          id: "3",
          left: "Quadratic probing",
          right: "Reduces primary clustering vs linear probing",
          explanation: "Spreads clusters better than linear probing.",
        },
        {
          id: "4",
          left: "Min-heap",
          right: "Root is always the smallest element",
          explanation: "Allows O(1) find-min, O(log n) push/pop.",
        },
        {
          id: "5",
          left: "Binary heap push/pop",
          right: "O(log n) time",
          explanation: "Percolate up/down along height ~ log n.",
        },
      ],
    },
    settings: {
      allowMultipleAttempts: true,
      showExplanations: true,
      timeLimit: 540,
    },
    isActive: true,
    sortOrder: 5,
  },
];

export async function seedMatchingDataStructuresActivities() {
  await seedActivitiesWithDuplicateCheck(
    matchingDataStructuresActivities,
    "Matching Data Structures"
  );
}

// Execute if run directly
if (require.main === module) {
  seedMatchingDataStructuresActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Matching Data Structures activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
