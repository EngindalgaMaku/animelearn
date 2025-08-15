import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Class Builder Activities for Data Structures
 * 5 activities with increasing difficulty
 */
export const classBuilderDataStructuresActivities = [
  // 1) Difficulty 1 - Dynamic Array (Simple Wrapper)
  {
    title: "Class Builder: Dynamic Array Wrapper",
    description:
      "Build a simple DynamicArray class exposing append, pop, get, set operations over Python's list",
    activityType: "class_builder",
    category: "Data Structures",
    difficulty: 1,
    diamondReward: 20,
    experienceReward: 45,
    estimatedMinutes: 18,
    tags: ["arrays", "dynamic-array", "basics", "class-builder"],
    content: {
      instructions:
        "Construct a DynamicArray class that internally uses a Python list but exposes a clean interface with basic bounds checks.",
      className: "DynamicArray",
      language: "Python",
      requiredProperties: [
        { name: "_data", type: "list", visibility: "private" },
        { name: "_length", type: "int", visibility: "private" },
      ],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: [],
          visibility: "public",
        },
        {
          name: "append",
          returnType: "None",
          parameters: ["value"],
          visibility: "public",
        },
        {
          name: "pop",
          returnType: "any",
          parameters: [],
          visibility: "public",
        },
        {
          name: "get",
          returnType: "any",
          parameters: ["index"],
          visibility: "public",
        },
        {
          name: "set",
          returnType: "bool",
          parameters: ["index", "value"],
          visibility: "public",
        },
        {
          name: "length",
          returnType: "int",
          parameters: [],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "_data",
          type: "list",
          visibility: "private",
          description: "Underlying storage (Python list)",
        },
        {
          name: "_length",
          type: "int",
          visibility: "private",
          description: "Logical number of elements",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: [],
          visibility: "public",
          description: "Initialize empty array",
        },
        {
          name: "append",
          returnType: "None",
          parameters: ["value"],
          visibility: "public",
          description: "Add value to end of array",
        },
        {
          name: "pop",
          returnType: "any",
          parameters: [],
          visibility: "public",
          description: "Remove and return last element; None if empty",
        },
        {
          name: "get",
          returnType: "any",
          parameters: ["index"],
          visibility: "public",
          description: "Return element at index; None if out of bounds",
        },
        {
          name: "set",
          returnType: "bool",
          parameters: ["index", "value"],
          visibility: "public",
          description:
            "Assign at index; return True if success, False otherwise",
        },
        {
          name: "length",
          returnType: "int",
          parameters: [],
          visibility: "public",
          description: "Return current number of elements",
        },
      ],
      allowCustom: true,
      hints: [
        "Use a Python list to store items",
        "Track logical length for bounds checks",
        "Guard against pop on empty",
      ],
    },
    settings: {
      timeLimit: 1200,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Difficulty 2 - Singly Linked List
  {
    title: "Class Builder: Singly Linked List",
    description:
      "Design a singly linked list with push_front, pop_front, and find operations",
    activityType: "class_builder",
    category: "Data Structures",
    difficulty: 2,
    diamondReward: 24,
    experienceReward: 55,
    estimatedMinutes: 22,
    tags: ["linked-list", "nodes", "class-builder"],
    content: {
      instructions:
        "Implement a SinglyLinkedList that supports O(1) push_front/pop_front and a linear find operation.",
      className: "SinglyLinkedList",
      language: "Python",
      requiredProperties: [
        { name: "_head", type: "Node|None", visibility: "private" },
        { name: "_size", type: "int", visibility: "private" },
      ],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: [],
          visibility: "public",
        },
        {
          name: "push_front",
          returnType: "None",
          parameters: ["value"],
          visibility: "public",
        },
        {
          name: "pop_front",
          returnType: "any",
          parameters: [],
          visibility: "public",
        },
        {
          name: "find",
          returnType: "bool",
          parameters: ["value"],
          visibility: "public",
        },
        {
          name: "size",
          returnType: "int",
          parameters: [],
          visibility: "public",
        },
        {
          name: "is_empty",
          returnType: "bool",
          parameters: [],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "_head",
          type: "Node|None",
          visibility: "private",
          description: "Pointer to first node",
        },
        {
          name: "_size",
          type: "int",
          visibility: "private",
          description: "Count of nodes",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: [],
          visibility: "public",
          description: "Initialize empty list",
        },
        {
          name: "push_front",
          returnType: "None",
          parameters: ["value"],
          visibility: "public",
          description: "Insert new node at head",
        },
        {
          name: "pop_front",
          returnType: "any",
          parameters: [],
          visibility: "public",
          description: "Remove and return head value; None if empty",
        },
        {
          name: "find",
          returnType: "bool",
          parameters: ["value"],
          visibility: "public",
          description: "Linear scan to check if value exists",
        },
        {
          name: "size",
          returnType: "int",
          parameters: [],
          visibility: "public",
          description: "Return number of nodes",
        },
        {
          name: "is_empty",
          returnType: "bool",
          parameters: [],
          visibility: "public",
          description: "Return True if list is empty",
        },
      ],
      allowCustom: true,
      hints: [
        "Define an inner Node class with value and next pointer",
        "Update head and size correctly on push/pop",
        "Find traverses nodes sequentially",
      ],
    },
    settings: {
      timeLimit: 1400,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3) Difficulty 3 - Binary Search Tree
  {
    title: "Class Builder: Binary Search Tree (Insert/Search/Inorder)",
    description:
      "Create a BST with insert, search, and inorder traversal methods",
    activityType: "class_builder",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 28,
    experienceReward: 65,
    estimatedMinutes: 26,
    tags: ["bst", "trees", "class-builder"],
    content: {
      instructions:
        "Implement a BST class assuming unique integer keys. Provide insert(key), search(key), and inorder() methods.",
      className: "BST",
      language: "Python",
      requiredProperties: [
        { name: "_root", type: "Node|None", visibility: "private" },
        { name: "_size", type: "int", visibility: "private" },
      ],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: [],
          visibility: "public",
        },
        {
          name: "insert",
          returnType: "None",
          parameters: ["key"],
          visibility: "public",
        },
        {
          name: "search",
          returnType: "bool",
          parameters: ["key"],
          visibility: "public",
        },
        {
          name: "inorder",
          returnType: "list",
          parameters: [],
          visibility: "public",
        },
        {
          name: "size",
          returnType: "int",
          parameters: [],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "_root",
          type: "Node|None",
          visibility: "private",
          description: "BST root node",
        },
        {
          name: "_size",
          type: "int",
          visibility: "private",
          description: "Number of nodes",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: [],
          visibility: "public",
          description: "Initialize empty BST",
        },
        {
          name: "insert",
          returnType: "None",
          parameters: ["key"],
          visibility: "public",
          description: "Insert a key into the BST",
        },
        {
          name: "search",
          returnType: "bool",
          parameters: ["key"],
          visibility: "public",
          description: "Return True if key exists, else False",
        },
        {
          name: "inorder",
          returnType: "list",
          parameters: [],
          visibility: "public",
          description: "Return list of keys via inorder traversal",
        },
        {
          name: "size",
          returnType: "int",
          parameters: [],
          visibility: "public",
          description: "Return number of nodes",
        },
      ],
      allowCustom: true,
      hints: [
        "Compare key to decide left/right",
        "Inorder traversal yields sorted order",
        "Track size during insert",
      ],
    },
    settings: {
      timeLimit: 1600,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Difficulty 3 - Graph (Adjacency List)
  {
    title: "Class Builder: Graph (Adjacency List)",
    description:
      "Create a Graph class supporting add_vertex, add_edge, neighbors, and bfs_distances",
    activityType: "class_builder",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 70,
    estimatedMinutes: 28,
    tags: ["graphs", "adjacency-list", "bfs", "class-builder"],
    content: {
      instructions:
        "Implement a directed graph using adjacency lists. Provide add_vertex(v), add_edge(u, v), neighbors(u), and bfs_distances(src).",
      className: "Graph",
      language: "Python",
      requiredProperties: [
        { name: "_adj", type: "dict", visibility: "private" },
      ],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: [],
          visibility: "public",
        },
        {
          name: "add_vertex",
          returnType: "None",
          parameters: ["v"],
          visibility: "public",
        },
        {
          name: "add_edge",
          returnType: "None",
          parameters: ["u", "v"],
          visibility: "public",
        },
        {
          name: "neighbors",
          returnType: "list",
          parameters: ["u"],
          visibility: "public",
        },
        {
          name: "bfs_distances",
          returnType: "dict",
          parameters: ["src"],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "_adj",
          type: "dict",
          visibility: "private",
          description: "Adjacency list mapping vertex -> list of neighbors",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: [],
          visibility: "public",
          description: "Initialize adjacency map",
        },
        {
          name: "add_vertex",
          returnType: "None",
          parameters: ["v"],
          visibility: "public",
          description: "Add vertex if not present",
        },
        {
          name: "add_edge",
          returnType: "None",
          parameters: ["u", "v"],
          visibility: "public",
          description: "Add directed edge u -> v",
        },
        {
          name: "neighbors",
          returnType: "list",
          parameters: ["u"],
          visibility: "public",
          description: "List neighbors of u",
        },
        {
          name: "bfs_distances",
          returnType: "dict",
          parameters: ["src"],
          visibility: "public",
          description: "Compute shortest-edge distances via BFS",
        },
      ],
      allowCustom: true,
      hints: [
        "Initialize adjacency for new vertices",
        "Use a queue for BFS and a visited/dist map",
        "Neighbors(u) should safely handle missing vertices",
      ],
    },
    settings: {
      timeLimit: 1700,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Difficulty 4 - Min-Heap
  {
    title: "Class Builder: Min-Heap",
    description:
      "Design a MinHeap with push, pop_min, peek, and size using heapq or manual percolation",
    activityType: "class_builder",
    category: "Data Structures",
    difficulty: 4,
    diamondReward: 36,
    experienceReward: 85,
    estimatedMinutes: 30,
    tags: ["heap", "priority-queue", "class-builder"],
    content: {
      instructions:
        "Implement a MinHeap class that maintains the smallest element at the root. Provide push(x), pop_min(), peek(), and size().",
      className: "MinHeap",
      language: "Python",
      requiredProperties: [{ name: "_h", type: "list", visibility: "private" }],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: [],
          visibility: "public",
        },
        {
          name: "push",
          returnType: "None",
          parameters: ["x"],
          visibility: "public",
        },
        {
          name: "pop_min",
          returnType: "any",
          parameters: [],
          visibility: "public",
        },
        {
          name: "peek",
          returnType: "any",
          parameters: [],
          visibility: "public",
        },
        {
          name: "size",
          returnType: "int",
          parameters: [],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "_h",
          type: "list",
          visibility: "private",
          description: "Underlying heap container",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: [],
          visibility: "public",
          description: "Initialize empty heap",
        },
        {
          name: "push",
          returnType: "None",
          parameters: ["x"],
          visibility: "public",
          description: "Insert value maintaining heap invariant",
        },
        {
          name: "pop_min",
          returnType: "any",
          parameters: [],
          visibility: "public",
          description: "Remove and return smallest; None if empty",
        },
        {
          name: "peek",
          returnType: "any",
          parameters: [],
          visibility: "public",
          description: "Return smallest without removing; None if empty",
        },
        {
          name: "size",
          returnType: "int",
          parameters: [],
          visibility: "public",
          description: "Return number of elements",
        },
      ],
      allowCustom: true,
      hints: [
        "Using heapq is acceptable for this exercise",
        "Guard against operations on empty heap",
        "Size is len of underlying list",
      ],
    },
    settings: {
      timeLimit: 1800,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 5,
  },
];

export async function seedClassBuilderDataStructuresActivities() {
  await seedActivitiesWithDuplicateCheck(
    classBuilderDataStructuresActivities,
    "Class Builder Data Structures"
  );
}

// Execute if run directly
if (require.main === module) {
  seedClassBuilderDataStructuresActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Class Builder Data Structures activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
