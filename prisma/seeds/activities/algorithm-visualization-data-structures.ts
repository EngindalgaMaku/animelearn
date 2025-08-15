import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Algorithm Visualization Activities for Data Structures
 * 5 activities with increasing difficulty
 */
export const algorithmVisualizationDataStructuresActivities = [
  // 1) Difficulty 1 - Dynamic Array vs Linked List
  {
    title: "Visualization: Dynamic Array vs Linked List",
    description:
      "Visualize differences in memory layout, access, and insertion behavior between arrays and linked lists",
    activityType: "algorithm_visualization",
    category: "Data Structures",
    difficulty: 1,
    diamondReward: 20,
    experienceReward: 45,
    estimatedMinutes: 14,
    tags: ["arrays", "linked-lists", "visualization", "basics"],
    content: {
      algorithm: "array_vs_list_basics",
      description:
        "Compare contiguous array access and pointer-based linked list traversal.",
      timeComplexity: "Array access: O(1); List access: O(n)",
      spaceComplexity: "Array: compact; List: pointer overhead",
      explanation:
        "Arrays allow O(1) random access via index arithmetic. Linked lists require following pointers to reach position i.",
      initialData: [10, 20, 30, 40],
      steps: [
        {
          id: 1,
          description: "Array random access by index",
          data: [10, 20, 30, 40],
          highlights: [2],
          comparison: ["arr[2] -> 30"],
          action:
            "arr = [10, 20, 30, 40]\n# Access index 2\nvalue = arr[2]  # 30",
        },
        {
          id: 2,
          description: "Linked list sequential traversal",
          data: [],
          highlights: [],
          comparison: ["head -> node1 -> node2 (value 30)"],
          action: "# To reach index 2, follow two next pointers\n# cost ~ O(n)",
        },
      ],
      visualizations: [
        {
          operation: "Array Indexing",
          setA: ["Contiguous memory", "Index arithmetic", "O(1) access"],
          setB: ["Cache-friendly", "Low overhead"],
          result: ["Use for:", "Fast random access", "Dense data"],
          code: "arr = [10, 20, 30, 40]\nprint(arr[2])  # 30",
          explanation:
            "Array index access computes memory address directly from base + offset.",
          visual: "array_cells",
        },
        {
          operation: "Linked List Traversal",
          setA: ["Nodes", "Pointers", "Sequential access"],
          setB: ["Higher overhead", "O(n) random access"],
          result: ["Use for:", "Frequent insert/delete", "Unknown size"],
          code: "class Node:\n    def __init__(self, v): self.v, self.next = v, None\n# Traverse from head to index i",
          explanation:
            "Linked list traversal requires following pointers node-by-node.",
          visual: "list_nodes",
        },
      ],
      code: "# Compare random access\narr = [10, 20, 30, 40]\nprint(arr[2])  # O(1)\n# List random access ~ O(n)",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Difficulty 2 - Stack vs Recursion (Call Stack)
  {
    title: "Visualization: Stack vs Recursion (Call Stack)",
    description:
      "See how function calls use the stack and mirror explicit stack operations",
    activityType: "algorithm_visualization",
    category: "Data Structures",
    difficulty: 2,
    diamondReward: 24,
    experienceReward: 55,
    estimatedMinutes: 16,
    tags: ["stack", "recursion", "call-stack", "visualization"],
    content: {
      algorithm: "stack_vs_recursion",
      description:
        "Contrast explicit stack push/pop with recursion frames on the call stack.",
      timeComplexity: "Both: O(n) pushes/pops for n frames",
      spaceComplexity: "O(n) call stack or explicit stack",
      explanation:
        "Recursion uses the call stack implicitly; an explicit Stack structure mimics the same LIFO behavior.",
      initialData: [1, 2, 3, 4],
      steps: [
        {
          id: 1,
          description: "Push items to stack (explicit LIFO)",
          data: [1, 2, 3, 4],
          highlights: [0, 1, 2, 3],
          comparison: ["push(1), push(2), push(3), push(4)"],
          action:
            "stack = []\nfor x in [1,2,3,4]: stack.append(x)  # 1 at bottom, 4 at top",
        },
        {
          id: 2,
          description: "Mirror with recursion depth frames",
          data: [],
          highlights: [],
          comparison: ["call f(1) -> f(2) -> f(3) -> f(4)"],
          action:
            "def f(i):\n    if i == 4: return\n    f(i+1)\n# Frames: f(1)->f(2)->f(3)->f(4)",
        },
        {
          id: 3,
          description: "Pop / unwind frames",
          data: [],
          highlights: [],
          comparison: ["pop(4), pop(3), pop(2), pop(1)", "return from f(4..1)"],
          action:
            "while stack: stack.pop()\n# Recursion returns in reverse order",
        },
      ],
      visualizations: [
        {
          operation: "Stack Frames",
          setA: ["push", "push", "push", "push"],
          setB: ["top=4", "LIFO"],
          result: ["pop -> 4", "then 3, 2, 1"],
          code: "stack = []\nfor x in [1,2,3,4]: stack.append(x)\nwhile stack: print(stack.pop())",
          explanation:
            "Pushed last is popped first; recursion returns in reverse order of calls.",
          visual: "stack_frames",
        },
      ],
      code: "# Recursion depth equals number of frames\n# Equivalent to explicit stack usage",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3) Difficulty 3 - BST Search Path
  {
    title: "Visualization: BST Search Path",
    description:
      "Visualize the path taken by binary search tree lookup depending on the target key",
    activityType: "algorithm_visualization",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 28,
    experienceReward: 65,
    estimatedMinutes: 18,
    tags: ["bst", "search", "trees", "visualization"],
    content: {
      algorithm: "bst_search",
      description:
        "Follow comparisons as search descends left or right in a balanced BST.",
      timeComplexity: "Average O(log n)",
      spaceComplexity: "O(1) iterative, O(h) recursive",
      explanation:
        "At each node, compare key; go left if smaller, right if larger, stop if equal or None.",
      initialData: [5, 3, 7, 2, 4, 6, 8],
      steps: [
        {
          id: 1,
          description: "Start at root and compare",
          data: [5],
          highlights: [5],
          comparison: ["target vs 5"],
          action: "cur = root  # key=5",
        },
        {
          id: 2,
          description: "Go left or right based on comparison",
          data: [3, 7],
          highlights: [3],
          comparison: ["target < 5 -> left (3)"],
          action: "cur = cur.left  # key=3",
        },
        {
          id: 3,
          description: "Continue until found or leaf",
          data: [2, 4],
          highlights: [4],
          comparison: ["target > 3 -> right (4) -> found"],
          action: "return True",
        },
      ],
      visualizations: [
        {
          operation: "Search Path",
          setA: ["Compare 5", "Go left to 3", "Go right to 4"],
          setB: ["Match found", "Stop"],
          result: ["Visited: 5 -> 3 -> 4"],
          code: "def search(root, key):\n    cur = root\n    while cur:\n        if key == cur.key: return True\n        cur = cur.left if key < cur.key else cur.right\n    return False",
          explanation:
            "Balanced trees minimize path length; unbalanced trees degenerate towards O(n).",
          visual: "bst_path",
        },
      ],
      code: "# Balanced BST yields O(log n) search on average\n# Track comparisons as edges traversed",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Difficulty 3 - Graph BFS Frontier
  {
    title: "Visualization: Graph BFS Frontiers",
    description:
      "See how BFS explores a graph level-by-level using a queue and builds frontiers",
    activityType: "algorithm_visualization",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 70,
    estimatedMinutes: 20,
    tags: ["graphs", "bfs", "frontier", "visualization"],
    content: {
      algorithm: "graph_bfs_frontier",
      description:
        "Visualize layered exploration and frontier expansion with a queue.",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V)",
      explanation:
        "BFS starts from the source, visits neighbors, and expands level by level, tracking distance in edges.",
      initialData: ["A", "B", "C", "D", "E", "F"],
      steps: [
        {
          id: 1,
          description: "Initialize with source",
          data: ["A"],
          highlights: [0],
          comparison: ["dist[A]=0"],
          action: "q = [A], dist[A] = 0",
        },
        {
          id: 2,
          description: "Expand frontier 1",
          data: ["B", "C"],
          highlights: [0, 1],
          comparison: ["dist[B]=1, dist[C]=1"],
          action: "enqueue neighbors of A",
        },
        {
          id: 3,
          description: "Expand frontier 2",
          data: ["D", "E"],
          highlights: [0, 1],
          comparison: ["dist[D]=2, dist[E]=2"],
          action: "enqueue neighbors of B and C",
        },
      ],
      visualizations: [
        {
          operation: "Frontiers",
          setA: ["Level 0: A"],
          setB: ["Level 1: B, C"],
          result: ["Level 2: D, E", "Distances by edges"],
          code: "from collections import deque\n\ndef bfs_dist(graph, s):\n    dist, q = {s:0}, deque([s])\n    while q:\n        u = q.popleft()\n        for v in graph[u]:\n            if v not in dist:\n                dist[v] = dist[u] + 1\n                q.append(v)\n    return dist",
          explanation:
            "Each expansion consumes a frontier and builds the next, ensuring shortest edges paths in unweighted graphs.",
          visual: "bfs_layers",
        },
      ],
      code: "# BFS produces shortest path by edges in unweighted graphs\n# frontiers = nodes with same distance",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Difficulty 4 - Heap Percolate Up/Down
  {
    title: "Visualization: Heap Insert and Remove (Percolate)",
    description:
      "Visualize min-heap operations and how elements percolate up and down",
    activityType: "algorithm_visualization",
    category: "Data Structures",
    difficulty: 4,
    diamondReward: 36,
    experienceReward: 85,
    estimatedMinutes: 24,
    tags: ["heap", "priority-queue", "percolate", "visualization"],
    content: {
      algorithm: "heap_operations",
      description:
        "Observe position swaps during heap push (up) and pop/min-remove (down).",
      timeComplexity: "O(log n) for push/pop",
      spaceComplexity: "O(1) auxiliary",
      explanation:
        "Min-heap maintains smallest at root; insertion may bubble up; removing min percolates the new root down.",
      initialData: [5, 3, 7, 1, 9],
      steps: [
        {
          id: 1,
          description: "Insert 1 and percolate up",
          data: [5, 3, 7, 1],
          highlights: [1],
          comparison: ["1 < 3 -> swap; 1 < 5 -> swap"],
          action:
            "# Insert 1; move upward while parent larger\n# Final root becomes 1",
        },
        {
          id: 2,
          description: "Pop min and percolate down",
          data: [1, 3, 7, 5, 9],
          highlights: [0],
          comparison: [
            "Swap root(1) with last(9); push 9 down by smaller child",
          ],
          action: "# Maintain heap property via percolate down",
        },
      ],
      visualizations: [
        {
          operation: "Percolate Up / Down",
          setA: ["Insert 1", "Swap with 3", "Swap with 5"],
          setB: ["Pop min", "Move 9 down", "Choose smaller child"],
          result: ["Heap property restored"],
          code: "import heapq\nh = []\nfor v in [5,3,7,1,9]: heapq.heappush(h, v)\nprint([heapq.heappop(h) for _ in range(len(h))])  # sorted output",
          explanation:
            "Binary heap is a complete tree; position swaps occur along height O(log n).",
          visual: "heap_tree",
        },
      ],
      code: "# Python heapq offers efficient push/pop while maintaining heap property",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 5,
  },
];

export async function seedAlgorithmVisualizationDataStructuresActivities() {
  await seedActivitiesWithDuplicateCheck(
    algorithmVisualizationDataStructuresActivities,
    "Algorithm Visualization Data Structures"
  );
}

// Execute if run directly
if (require.main === module) {
  seedAlgorithmVisualizationDataStructuresActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Algorithm Visualization Data Structures activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
