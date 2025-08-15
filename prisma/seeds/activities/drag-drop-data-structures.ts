import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Drag-Drop Activities for Data Structures
 * 5 activities with increasing difficulty
 */
export const dragDropDataStructuresActivities = [
  {
    title: "Classify Data Structures: Linear, Nonlinear, Associative",
    description:
      "Drag each structure into the correct category based on organization and access model.",
    activityType: "drag_drop",
    category: "Data Structures",
    difficulty: 1,
    diamondReward: 18,
    experienceReward: 40,
    estimatedMinutes: 10,
    tags: ["data-structures", "classification", "basics", "drag-drop"],
    content: {
      instructions: "Place each data structure into the correct category.",
      items: [
        { id: 1, value: "Array", type: "linear" },
        { id: 2, value: "Linked List", type: "linear" },
        { id: 3, value: "Stack", type: "linear" },
        { id: 4, value: "Queue", type: "linear" },
        { id: 5, value: "Deque", type: "linear" },
        { id: 6, value: "Tree", type: "nonlinear" },
        { id: 7, value: "Graph", type: "nonlinear" },
        { id: 8, value: "Heap", type: "nonlinear" },
        { id: 9, value: "Hash Table", type: "associative" },
        { id: 10, value: "Dictionary/Map", type: "associative" },
        { id: 11, value: "Set", type: "associative" },
      ],
      categories: [
        {
          id: "linear",
          name: "Linear",
          description: "Sequential organization with start/end.",
        },
        {
          id: "nonlinear",
          name: "Nonlinear",
          description: "Hierarchical or network-like structure.",
        },
        {
          id: "associative",
          name: "Associative (Key-Value)",
          description: "Access by key, not index.",
        },
      ],
    },
    settings: {
      timeLimit: 300,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 1,
  },
  {
    title: "Stack vs Queue Operations",
    description:
      "Drag each operation or property to Stack (LIFO) or Queue (FIFO).",
    activityType: "drag_drop",
    category: "Data Structures",
    difficulty: 2,
    diamondReward: 22,
    experienceReward: 50,
    estimatedMinutes: 12,
    tags: ["stack", "queue", "operations", "drag-drop"],
    content: {
      instructions: "Classify each term under Stack or Queue.",
      items: [
        { id: 1, value: "push", type: "stack" },
        { id: 2, value: "pop", type: "stack" },
        { id: 3, value: "peek/top", type: "stack" },
        { id: 4, value: "LIFO", type: "stack" },
        { id: 5, value: "enqueue", type: "queue" },
        { id: 6, value: "dequeue", type: "queue" },
        { id: 7, value: "front/head", type: "queue" },
        { id: 8, value: "rear/tail", type: "queue" },
        { id: 9, value: "FIFO", type: "queue" },
      ],
      categories: [
        {
          id: "stack",
          name: "Stack",
          description: "Last-In, First-Out structure.",
        },
        {
          id: "queue",
          name: "Queue",
          description: "First-In, First-Out structure.",
        },
      ],
    },
    settings: {
      timeLimit: 360,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 2,
  },
  {
    title: "Tree Traversal Orders",
    description: "Drag definitions to the corresponding traversal order.",
    activityType: "drag_drop",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 26,
    experienceReward: 58,
    estimatedMinutes: 14,
    tags: [
      "trees",
      "traversals",
      "preorder",
      "inorder",
      "postorder",
      "drag-drop",
    ],
    content: {
      instructions: "Match each description with the correct traversal.",
      items: [
        { id: 1, value: "Visit: Root → Left → Right", type: "preorder" },
        { id: 2, value: "Visit: Left → Root → Right", type: "inorder" },
        { id: 3, value: "Visit: Left → Right → Root", type: "postorder" },
        { id: 4, value: "Uses DFS ordering", type: "preorder" },
        { id: 5, value: "Yields sorted order in BST", type: "inorder" },
        { id: 6, value: "Useful for deleting tree", type: "postorder" },
        {
          id: 7,
          value: "Visit: Level by level (Breadth-first)",
          type: "levelorder",
        },
        { id: 8, value: "Often implemented with a queue", type: "levelorder" },
      ],
      categories: [
        {
          id: "preorder",
          name: "Preorder",
          description: "Root, then subtrees.",
        },
        { id: "inorder", name: "Inorder", description: "Left, Root, Right." },
        {
          id: "postorder",
          name: "Postorder",
          description: "Subtrees, then Root.",
        },
        {
          id: "levelorder",
          name: "Level-order (BFS)",
          description: "Breadth-first across levels.",
        },
      ],
    },
    settings: {
      timeLimit: 420,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 3,
  },
  {
    title: "Graph Representations: Matrix vs List",
    description:
      "Classify properties and use-cases for adjacency matrix vs adjacency list.",
    activityType: "drag_drop",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 16,
    tags: ["graphs", "adjacency-matrix", "adjacency-list", "drag-drop"],
    content: {
      instructions:
        "Drag each statement to the most appropriate representation.",
      items: [
        { id: 1, value: "Better for dense graphs", type: "adj_matrix" },
        { id: 2, value: "Better for sparse graphs", type: "adj_list" },
        { id: 3, value: "O(1) edge existence check", type: "adj_matrix" },
        { id: 4, value: "Space ~ O(V + E)", type: "adj_list" },
        { id: 5, value: "Space ~ O(V^2)", type: "adj_matrix" },
        { id: 6, value: "Faster iteration over neighbors", type: "adj_list" },
        {
          id: 7,
          value: "Often simpler to implement for fixed-size graphs",
          type: "adj_matrix",
        },
        {
          id: 8,
          value: "Memory-efficient when edges are few",
          type: "adj_list",
        },
      ],
      categories: [
        {
          id: "adj_matrix",
          name: "Adjacency Matrix",
          description: "V×V boolean/weights table.",
        },
        {
          id: "adj_list",
          name: "Adjacency List",
          description: "Per-vertex neighbor lists.",
        },
      ],
    },
    settings: {
      timeLimit: 480,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 4,
  },
  {
    title: "Hashing: Collision Resolution",
    description:
      "Drag each technique to 'Separate Chaining' or 'Open Addressing'.",
    activityType: "drag_drop",
    category: "Data Structures",
    difficulty: 4,
    diamondReward: 34,
    experienceReward: 80,
    estimatedMinutes: 18,
    tags: ["hashing", "hash-table", "collisions", "drag-drop"],
    content: {
      instructions: "Classify collision handling strategies.",
      items: [
        { id: 1, value: "Separate chaining", type: "chaining" },
        { id: 2, value: "Linked structure per bucket", type: "chaining" },
        { id: 3, value: "Load factor can exceed 1", type: "chaining" },
        { id: 4, value: "Linear probing", type: "open_addressing" },
        { id: 5, value: "Quadratic probing", type: "open_addressing" },
        { id: 6, value: "Double hashing", type: "open_addressing" },
        {
          id: 7,
          value: "Requires tombstones for deletions",
          type: "open_addressing",
        },
      ],
      categories: [
        {
          id: "chaining",
          name: "Separate Chaining",
          description: "Store collided entries in external structures.",
        },
        {
          id: "open_addressing",
          name: "Open Addressing",
          description: "Probe alternative slots within the table.",
        },
      ],
    },
    settings: {
      timeLimit: 540,
      maxAttempts: 3,
      showHints: true,
      shuffleItems: true,
    },
    isActive: true,
    sortOrder: 5,
  },
];

export async function seedDragDropDataStructuresActivities() {
  await seedActivitiesWithDuplicateCheck(
    dragDropDataStructuresActivities,
    "Drag-Drop Data Structures"
  );
}

// Execute if run directly
if (require.main === module) {
  seedDragDropDataStructuresActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Drag-Drop Data Structures activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
