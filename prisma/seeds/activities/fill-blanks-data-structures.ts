import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Fill-in-the-Blanks Activities for Data Structures
 * 5 activities with increasing difficulty
 */
export const fillBlanksDataStructuresActivities = [
  // 1) Difficulty 1 - Arrays & Lists basics
  {
    title: "Fill Blanks: Arrays and Lists Basics",
    description:
      "Complete code and statements for basic array/list operations and properties",
    activityType: "fill_blanks",
    category: "Data Structures",
    difficulty: 1,
    diamondReward: 18,
    experienceReward: 40,
    estimatedMinutes: 12,
    tags: ["arrays", "lists", "basics", "fill-blanks"],
    content: {
      instructions:
        "Fill in the missing pieces focusing on basic array/list concepts and operations.",
      exercises: [
        {
          id: 1,
          description: "Array random-access complexity",
          template:
            "In a typical array (contiguous memory), random access by index has ____ time complexity.",
          blanks: [{ id: "b1", answer: "O(1)", position: 0 }],
          expectedOutput: "O(1)",
        },
        {
          id: 2,
          description: "Python dynamic array append",
          template:
            "In Python, list.append(x) is ____ on average due to amortization.",
          blanks: [{ id: "b2", answer: "O(1)", position: 0 }],
          expectedOutput: "O(1)",
        },
        {
          id: 3,
          description: "Linked list insertion at head",
          template:
            "In a singly linked list, inserting at the head is typically ____ time if you have the head reference.",
          blanks: [{ id: "b3", answer: "O(1)", position: 0 }],
          expectedOutput: "O(1)",
        },
        {
          id: 4,
          description: "Queue operations naming",
          template:
            "For queues, we typically use ____ to add and ____ to remove items.",
          blanks: [
            { id: "b4a", answer: "enqueue", position: 0 },
            { id: "b4b", answer: "dequeue", position: 1 },
          ],
          expectedOutput: "enqueue, dequeue",
        },
        {
          id: 5,
          description: "Stack ordering rule",
          template: "A stack follows the ____ principle (Last-In, First-Out).",
          blanks: [{ id: "b5", answer: "LIFO", position: 0 }],
          expectedOutput: "LIFO",
        },
      ],
    },
    settings: { timeLimit: 480, allowHints: true, caseSensitive: false },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Difficulty 2 - Linked Lists operations
  {
    title: "Fill Blanks: Linked Lists Operations",
    description: "Complete linked list operational statements and complexities",
    activityType: "fill_blanks",
    category: "Data Structures",
    difficulty: 2,
    diamondReward: 22,
    experienceReward: 50,
    estimatedMinutes: 14,
    tags: ["linked-lists", "operations", "fill-blanks"],
    content: {
      instructions:
        "Fill in the blanks about common linked list operations and complexity.",
      exercises: [
        {
          id: 1,
          description: "Singly linked list search",
          template:
            "Searching for a value in a singly linked list is ____ in the worst case.",
          blanks: [{ id: "b1", answer: "O(n)", position: 0 }],
          expectedOutput: "O(n)",
        },
        {
          id: 2,
          description: "Insert after known node",
          template:
            "Given a pointer/reference to a linked list node, inserting after it can be done in ____ time.",
          blanks: [{ id: "b2", answer: "O(1)", position: 0 }],
          expectedOutput: "O(1)",
        },
        {
          id: 3,
          description: "Doubly linked list removal",
          template:
            "In a doubly linked list, removing a known node (with reference) is ____ because you can adjust both neighbors.",
          blanks: [{ id: "b3", answer: "O(1)", position: 0 }],
          expectedOutput: "O(1)",
        },
        {
          id: 4,
          description: "Head vs tail insertion",
          template:
            "Inserting at the head of a singly linked list is typically ____, whereas inserting at the tail without a tail pointer is usually ____. (use forms O(1) / O(n))",
          blanks: [
            { id: "b4a", answer: "O(1)", position: 0 },
            { id: "b4b", answer: "O(n)", position: 1 },
          ],
          expectedOutput: "O(1), O(n)",
        },
        {
          id: 5,
          description: "Space overhead",
          template:
            "Compared to arrays, linked lists have extra ____ overhead per element due to pointers/references.",
          blanks: [{ id: "b5", answer: "memory", position: 0 }],
          expectedOutput: "memory",
        },
      ],
    },
    settings: { timeLimit: 540, allowHints: true, caseSensitive: false },
    isActive: true,
    sortOrder: 2,
  },

  // 3) Difficulty 3 - Trees & Traversals
  {
    title: "Fill Blanks: Trees and Traversals",
    description:
      "Complete statements about tree properties and traversal orders",
    activityType: "fill_blanks",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 26,
    experienceReward: 60,
    estimatedMinutes: 16,
    tags: ["trees", "traversals", "bst", "fill-blanks"],
    content: {
      instructions:
        "Fill in standard traversal orders and properties (use forms like 'inorder', 'preorder', 'postorder', 'BFS', etc).",
      exercises: [
        {
          id: 1,
          description: "Inorder traversal description",
          template:
            "In a binary search tree, ____ traversal yields keys in ascending order.",
          blanks: [{ id: "b1", answer: "inorder", position: 0 }],
          expectedOutput: "inorder",
        },
        {
          id: 2,
          description: "Preorder visit order",
          template:
            "____ traversal visits nodes in the order: Root → Left → Right.",
          blanks: [{ id: "b2", answer: "preorder", position: 0 }],
          expectedOutput: "preorder",
        },
        {
          id: 3,
          description: "Postorder use case",
          template:
            "____ traversal (Left → Right → Root) is especially useful for deleting/freeing a tree.",
          blanks: [{ id: "b3", answer: "postorder", position: 0 }],
          expectedOutput: "postorder",
        },
        {
          id: 4,
          description: "Level-order traversal",
          template:
            "____ (also known as level-order) uses a queue to visit nodes breadth-first.",
          blanks: [{ id: "b4", answer: "BFS", position: 0 }],
          expectedOutput: "BFS",
        },
        {
          id: 5,
          description: "Balanced BST search",
          template:
            "Average search time in a balanced BST is ____ (logarithmic).",
          blanks: [{ id: "b5", answer: "O(log n)", position: 0 }],
          expectedOutput: "O(log n)",
        },
      ],
    },
    settings: { timeLimit: 600, allowHints: true, caseSensitive: false },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Difficulty 3 - Graph Basics
  {
    title: "Fill Blanks: Graph Fundamentals",
    description:
      "Complete statements about graph representations and traversals",
    activityType: "fill_blanks",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 18,
    tags: ["graphs", "bfs", "dfs", "adjacency", "fill-blanks"],
    content: {
      instructions:
        "Fill the blanks using 'adjacency list', 'adjacency matrix', 'BFS', 'DFS', etc.",
      exercises: [
        {
          id: 1,
          description: "Sparse vs dense",
          template:
            "For sparse graphs, ____ is more space-efficient; for dense graphs, ____ may be simpler.",
          blanks: [
            { id: "b1a", answer: "adjacency list", position: 0 },
            { id: "b1b", answer: "adjacency matrix", position: 1 },
          ],
          expectedOutput: "adjacency list, adjacency matrix",
        },
        {
          id: 2,
          description: "Edge existence check",
          template:
            "An ____ allows O(1) edge existence check, while an ____ needs to scan neighbors.",
          blanks: [
            { id: "b2a", answer: "adjacency matrix", position: 0 },
            { id: "b2b", answer: "adjacency list", position: 1 },
          ],
          expectedOutput: "adjacency matrix, adjacency list",
        },
        {
          id: 3,
          description: "Shortest path in unweighted",
          template:
            "In an unweighted graph, ____ yields shortest path by number of edges from a source.",
          blanks: [{ id: "b3", answer: "BFS", position: 0 }],
          expectedOutput: "BFS",
        },
        {
          id: 4,
          description: "Typical DFS structure",
          template: "____ typically uses a stack (explicit or recursion).",
          blanks: [{ id: "b4", answer: "DFS", position: 0 }],
          expectedOutput: "DFS",
        },
        {
          id: 5,
          description: "Tree edge count",
          template:
            "A connected acyclic graph (tree) with n nodes has ____ edges.",
          blanks: [{ id: "b5", answer: "n - 1", position: 0 }],
          expectedOutput: "n - 1",
        },
      ],
    },
    settings: { timeLimit: 660, allowHints: true, caseSensitive: false },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Difficulty 4 - Hash Tables & Heaps
  {
    title: "Fill Blanks: Hash Tables and Heaps",
    description:
      "Complete advanced statements about hashing strategies and heaps",
    activityType: "fill_blanks",
    category: "Data Structures",
    difficulty: 4,
    diamondReward: 34,
    experienceReward: 80,
    estimatedMinutes: 20,
    tags: ["hashing", "heaps", "priority-queue", "fill-blanks"],
    content: {
      instructions:
        "Use terms like 'separate chaining', 'open addressing', 'quadratic probing', 'min-heap', etc.",
      exercises: [
        {
          id: 1,
          description: "Collision resolution families",
          template:
            "Two broad families for collision resolution are ____ (store collided items per bucket) and ____ (probe alternative slots).",
          blanks: [
            { id: "b1a", answer: "separate chaining", position: 0 },
            { id: "b1b", answer: "open addressing", position: 1 },
          ],
          expectedOutput: "separate chaining, open addressing",
        },
        {
          id: 2,
          description: "Probing method advantage",
          template:
            "____ probing helps reduce primary clustering compared to linear probing.",
          blanks: [{ id: "b2", answer: "Quadratic", position: 0 }],
          expectedOutput: "Quadratic",
        },
        {
          id: 3,
          description: "Min-heap property",
          template: "In a ____, the root is always the smallest element.",
          blanks: [{ id: "b3", answer: "min-heap", position: 0 }],
          expectedOutput: "min-heap",
        },
        {
          id: 4,
          description: "Heap operations complexity",
          template:
            "Binary heap push and pop operations are generally ____ time.",
          blanks: [{ id: "b4", answer: "O(log n)", position: 0 }],
          expectedOutput: "O(log n)",
        },
        {
          id: 5,
          description: "Good hash function characteristic",
          template: "A good hash function should distribute keys ____.",
          blanks: [{ id: "b5", answer: "uniformly", position: 0 }],
          expectedOutput: "uniformly",
        },
      ],
    },
    settings: { timeLimit: 780, allowHints: true, caseSensitive: false },
    isActive: true,
    sortOrder: 5,
  },
];

export async function seedFillBlanksDataStructuresActivities() {
  await seedActivitiesWithDuplicateCheck(
    fillBlanksDataStructuresActivities,
    "Fill Blanks Data Structures"
  );
}

// Execute if run directly
if (require.main === module) {
  seedFillBlanksDataStructuresActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Fill Blanks Data Structures activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
