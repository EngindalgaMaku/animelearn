import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Code Builder Activities for Data Structures
 * 5 activities with increasing difficulty
 */
export const codeBuilderDataStructuresActivities = [
  // 1) Difficulty 1 - Array processing pipeline
  {
    title: "Code Builder: Array Processing Pipeline",
    description:
      "Order the code blocks to filter positives, square, sort, and return the first 3 numbers",
    activityType: "code_builder",
    category: "Data Structures",
    difficulty: 1,
    diamondReward: 20,
    experienceReward: 45,
    estimatedMinutes: 15,
    tags: ["arrays", "pipeline", "processing", "code-builder"],
    content: {
      instructions:
        "Build a function that filters positive numbers, squares them, sorts ascending, and returns the first 3.",
      targetOutput:
        "A sorted list with the first 3 smallest squared positive values",
      availableBlocks: [
        {
          id: "def_func",
          code: "def process_numbers(nums):",
          type: "function",
          description: "Function definition",
        },
        {
          id: "filter_pos",
          code: "    positive = [x for x in nums if x > 0]",
          type: "filter",
          description: "Filter out non-positive numbers",
        },
        {
          id: "square_map",
          code: "    squared = [x * x for x in positive]",
          type: "map",
          description: "Square each number",
        },
        {
          id: "sort",
          code: "    squared.sort()",
          type: "operation",
          description: "Sort ascending",
        },
        {
          id: "return",
          code: "    return squared[:3]",
          type: "return",
          description: "Return first 3 values",
        },
      ],
      language: "Python",
      solution: [
        "def process_numbers(nums):",
        "    positive = [x for x in nums if x > 0]",
        "    squared = [x * x for x in positive]",
        "    squared.sort()",
        "    return squared[:3]",
      ],
    },
    settings: {
      timeLimit: 800,
      codeTemplate:
        "def process_numbers(nums):\n    # Arrange the blocks below\n    pass",
      runTests: true,
      showOutput: true,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Difficulty 2 - Stack simulation (LIFO)
  {
    title: "Code Builder: Stack Simulation (LIFO)",
    description: "Order the blocks to implement a simple LIFO stack interface",
    activityType: "code_builder",
    category: "Data Structures",
    difficulty: 2,
    diamondReward: 24,
    experienceReward: 55,
    estimatedMinutes: 18,
    tags: ["stack", "lifo", "implementation", "code-builder"],
    content: {
      instructions:
        "Build a Stack class with push, pop, and peek using a Python list.",
      targetOutput: "A working Stack class supporting LIFO operations",
      availableBlocks: [
        {
          id: "class_def",
          code: "class Stack:",
          type: "class",
          description: "Class definition",
        },
        {
          id: "init",
          code: "    def __init__(self): self._data = []",
          type: "init",
          description: "Constructor",
        },
        {
          id: "push",
          code: "    def push(self, x): self._data.append(x)",
          type: "method",
          description: "Push item",
        },
        {
          id: "pop",
          code: "    def pop(self):\n        if not self._data: return None\n        return self._data.pop()",
          type: "method",
          description: "Pop item",
        },
        {
          id: "peek",
          code: "    def peek(self):\n        if not self._data: return None\n        return self._data[-1]",
          type: "method",
          description: "Peek top item",
        },
      ],
      language: "Python",
      solution: [
        "class Stack:",
        "    def __init__(self): self._data = []",
        "    def push(self, x): self._data.append(x)",
        "    def pop(self):",
        "        if not self._data: return None",
        "        return self._data.pop()",
        "    def peek(self):",
        "        if not self._data: return None",
        "        return self._data[-1]",
      ],
    },
    settings: {
      timeLimit: 900,
      codeTemplate:
        "# Arrange the Stack class members below\ntest = Stack() if 'Stack' in globals() else None\n",
      runTests: true,
      showOutput: true,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3) Difficulty 3 - BST insertion sequence
  {
    title: "Code Builder: BST Insert (Recursive)",
    description:
      "Order the blocks to implement recursive insert for a Binary Search Tree",
    activityType: "code_builder",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 28,
    experienceReward: 65,
    estimatedMinutes: 20,
    tags: ["bst", "trees", "insert", "code-builder"],
    content: {
      instructions:
        "Implement a recursive insert(root, key) that returns the (possibly new) root.",
      targetOutput: "BST insert function honoring left < root < right",
      availableBlocks: [
        {
          id: "node_class",
          code: "class Node:\n    def __init__(self, key):\n        self.key, self.left, self.right = key, None, None",
          type: "class",
          description: "Node class",
        },
        {
          id: "def_insert",
          code: "def insert(root, key):",
          type: "function",
          description: "Function definition",
        },
        {
          id: "base",
          code: "    if root is None: return Node(key)",
          type: "condition",
          description: "Base case",
        },
        {
          id: "go_left",
          code: "    if key < root.key: root.left = insert(root.left, key)",
          type: "branch",
          description: "Insert to left",
        },
        {
          id: "go_right",
          code: "    elif key > root.key: root.right = insert(root.right, key)",
          type: "branch",
          description: "Insert to right",
        },
        {
          id: "ret",
          code: "    return root",
          type: "return",
          description: "Return root",
        },
      ],
      language: "Python",
      solution: [
        "class Node:",
        "    def __init__(self, key):",
        "        self.key, self.left, self.right = key, None, None",
        "def insert(root, key):",
        "    if root is None: return Node(key)",
        "    if key < root.key: root.left = insert(root.left, key)",
        "    elif key > root.key: root.right = insert(root.right, key)",
        "    return root",
      ],
    },
    settings: {
      timeLimit: 1100,
      codeTemplate:
        "# Build Node + insert in correct order\n# insert should return the root\n",
      runTests: true,
      showOutput: true,
    },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Difficulty 3 - BFS skeleton (adjacency list)
  {
    title: "Code Builder: Graph BFS (Adjacency List)",
    description:
      "Order the BFS blocks to compute shortest-edge distances from a source",
    activityType: "code_builder",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 70,
    estimatedMinutes: 22,
    tags: ["graphs", "bfs", "adjacency-list", "code-builder"],
    content: {
      instructions:
        "Build bfs_distances(graph, src) using a queue to explore levels.",
      targetOutput: "Dictionary mapping node -> distance from src",
      availableBlocks: [
        {
          id: "import",
          code: "from collections import deque",
          type: "import",
          description: "Import deque",
        },
        {
          id: "def_bfs",
          code: "def bfs_distances(graph, src):",
          type: "function",
          description: "Function definition",
        },
        {
          id: "init",
          code: "    dist, q = {src: 0}, deque([src])",
          type: "init",
          description: "Initialize structures",
        },
        {
          id: "loop",
          code: "    while q:",
          type: "loop",
          description: "Main loop",
        },
        {
          id: "pop",
          code: "        u = q.popleft()",
          type: "operation",
          description: "Pop front",
        },
        {
          id: "neighbors",
          code: "        for v in graph.get(u, []):",
          type: "loop",
          description: "Iterate neighbors",
        },
        {
          id: "visit",
          code: "            if v not in dist: dist[v] = dist[u] + 1; q.append(v)",
          type: "condition",
          description: "Visit neighbor",
        },
        {
          id: "ret",
          code: "    return dist",
          type: "return",
          description: "Return distances",
        },
      ],
      language: "Python",
      solution: [
        "from collections import deque",
        "def bfs_distances(graph, src):",
        "    dist, q = {src: 0}, deque([src])",
        "    while q:",
        "        u = q.popleft()",
        "        for v in graph.get(u, []):",
        "            if v not in dist: dist[v] = dist[u] + 1; q.append(v)",
        "    return dist",
      ],
    },
    settings: {
      timeLimit: 1200,
      codeTemplate:
        "# Arrange BFS to compute shortest edge distances from src\n",
      runTests: true,
      showOutput: true,
    },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Difficulty 4 - Min-heap usage with heapq
  {
    title: "Code Builder: Min-Heap with heapq",
    description:
      "Order blocks to create a function that pushes items and pops the smallest",
    activityType: "code_builder",
    category: "Data Structures",
    difficulty: 4,
    diamondReward: 36,
    experienceReward: 85,
    estimatedMinutes: 25,
    tags: ["heap", "priority-queue", "heapq", "code-builder"],
    content: {
      instructions:
        "Build min_heap_process(data) that pushes all items then pops and returns the 3 smallest in ascending order.",
      targetOutput: "List of the 3 smallest values in ascending order",
      availableBlocks: [
        {
          id: "import",
          code: "import heapq",
          type: "import",
          description: "Import heapq",
        },
        {
          id: "def_func",
          code: "def min_heap_process(data):",
          type: "function",
          description: "Function definition",
        },
        {
          id: "init",
          code: "    h = []",
          type: "init",
          description: "Initialize heap",
        },
        {
          id: "push_loop",
          code: "    for x in data: heapq.heappush(h, x)",
          type: "loop",
          description: "Push items",
        },
        {
          id: "pop_three",
          code: "    out = [heapq.heappop(h) for _ in range(min(3, len(h)))]",
          type: "operation",
          description: "Pop three smallest",
        },
        {
          id: "ret",
          code: "    return out",
          type: "return",
          description: "Return result",
        },
      ],
      language: "Python",
      solution: [
        "import heapq",
        "def min_heap_process(data):",
        "    h = []",
        "    for x in data: heapq.heappush(h, x)",
        "    out = [heapq.heappop(h) for _ in range(min(3, len(h)))]",
        "    return out",
      ],
    },
    settings: {
      timeLimit: 1400,
      codeTemplate:
        "# Arrange the heap operations to return smallest three values\n",
      runTests: true,
      showOutput: true,
    },
    isActive: true,
    sortOrder: 5,
  },
];

export async function seedCodeBuilderDataStructuresActivities() {
  await seedActivitiesWithDuplicateCheck(
    codeBuilderDataStructuresActivities,
    "Code Builder Data Structures"
  );
}

// Execute if run directly
if (require.main === module) {
  seedCodeBuilderDataStructuresActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Code Builder Data Structures activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
