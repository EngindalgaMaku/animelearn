import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Interactive Demo Activities for Data Structures
 * 5 activities with increasing difficulty
 */
export const interactiveDemoDataStructuresActivities = [
  // 1) Difficulty 1 - Arrays vs Linked Lists Basics
  {
    title: "Interactive Demo: Arrays vs Linked Lists",
    description:
      "Learn the core differences between arrays and linked lists through small interactive steps",
    activityType: "interactive_demo",
    category: "Data Structures",
    difficulty: 1,
    diamondReward: 20,
    experienceReward: 45,
    estimatedMinutes: 14,
    tags: ["arrays", "linked-lists", "basics", "interactive-demo"],
    content: {
      title: "Arrays vs Linked Lists",
      description:
        "Compare memory layout, access, and insertion behavior for arrays and linked lists.",
      steps: [
        {
          id: 1,
          title: "Random Access",
          description:
            "Arrays store elements contiguously in memory, enabling O(1) index access.",
          code: "arr = [10, 20, 30, 40]\n# Access by index is O(1)\nprint(arr[2])  # 30",
          explanation:
            "Because arrays are contiguous, the element address can be computed directly from the index.",
          interactive: true,
          questions: [
            {
              question: "What is the typical time complexity of arr[i]?",
              options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
              correct: 0,
            },
          ],
        },
        {
          id: 2,
          title: "Linked List Access",
          description:
            "Linked lists require traversal from a reference node, making random access O(n).",
          code: "class Node:\n    def __init__(self, val):\n        self.val, self.next = val, None\n\n# Accessing k-th node requires k steps (worst O(n))",
          explanation:
            "Each node holds a pointer to the next; to reach index i you follow i pointers.",
          interactive: true,
        },
        {
          id: 3,
          title: "Insertions",
          description:
            "Linked lists can insert at the head in O(1); arrays may shift elements (O(n)).",
          code: "# Linked list head insertion is O(1) with head reference\n# Arrays may need to shift elements for middle insertions",
          explanation:
            "Insertion cost depends on structure: lists excel at pointer manipulation; arrays excel at random access.",
          interactive: true,
        },
      ],
      timeLimit: 720,
      language: "Python",
    },
    settings: { livePreview: true, showResults: true, allowHints: true },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Difficulty 2 - Stack and Queue Operations
  {
    title: "Interactive Demo: Stack and Queue Operations",
    description:
      "Visualize LIFO vs FIFO behaviors and typical method names through guided steps",
    activityType: "interactive_demo",
    category: "Data Structures",
    difficulty: 2,
    diamondReward: 24,
    experienceReward: 55,
    estimatedMinutes: 16,
    tags: ["stack", "queue", "operations", "interactive-demo"],
    content: {
      title: "Stack vs Queue",
      description:
        "Understand push/pop (LIFO) and enqueue/dequeue (FIFO) behaviors with examples.",
      steps: [
        {
          id: 1,
          title: "Stack (LIFO)",
          description:
            "Last-In, First-Out: the last pushed item is popped first.",
          code: "stack = []\nstack.append('A')\nstack.append('B')\nprint(stack.pop())  # 'B'",
          explanation:
            "Stacks use push/pop at one end; top is the last element.",
          interactive: true,
          questions: [
            {
              question: "Which term matches stacks?",
              options: ["FIFO", "LIFO", "Random", "Priority"],
              correct: 1,
            },
          ],
        },
        {
          id: 2,
          title: "Queue (FIFO)",
          description:
            "First-In, First-Out: the earliest enqueued item is dequeued first.",
          code: "from collections import deque\nq = deque()\nq.append('A')\nq.append('B')\nprint(q.popleft())  # 'A'",
          explanation:
            "Queues add to the rear and remove from the front using enqueue/dequeue semantics.",
          interactive: true,
        },
      ],
      timeLimit: 780,
      language: "Python",
    },
    settings: { livePreview: true, showResults: true, allowHints: true },
    isActive: true,
    sortOrder: 2,
  },

  // 3) Difficulty 3 - Trees and Traversals
  {
    title: "Interactive Demo: Trees and Traversal Orders",
    description:
      "Explore inorder, preorder, postorder and level-order traversals on trees",
    activityType: "interactive_demo",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 28,
    experienceReward: 65,
    estimatedMinutes: 18,
    tags: ["trees", "traversals", "bst", "interactive-demo"],
    content: {
      title: "Tree Traversals",
      description:
        "Understand standard traversal patterns and when they are useful.",
      steps: [
        {
          id: 1,
          title: "Inorder Traversal",
          description: "For a BST, inorder yields keys in ascending order.",
          code: "def inorder(root):\n    if not root: return\n    inorder(root.left)\n    print(root.key)\n    inorder(root.right)",
          explanation: "Left → Root → Right yields sorted keys for BST.",
          interactive: true,
        },
        {
          id: 2,
          title: "Preorder & Postorder",
          description:
            "Preorder visits Root first; Postorder visits Root last.",
          code: "def preorder(root):\n    if not root: return\n    print(root.key)\n    preorder(root.left)\n    preorder(root.right)\n\ndef postorder(root):\n    if not root: return\n    postorder(root.left)\n    postorder(root.right)\n    print(root.key)",
          explanation:
            "Preorder is useful for copying trees; Postorder is useful for deletions.",
          interactive: true,
        },
        {
          id: 3,
          title: "Level-order (BFS)",
          description: "Traverses the tree level by level using a queue.",
          code: "from collections import deque\n\ndef level_order(root):\n    if not root: return\n    q = deque([root])\n    while q:\n        node = q.popleft()\n        print(node.key)\n        if node.left: q.append(node.left)\n        if node.right: q.append(node.right)",
          explanation:
            "BFS explores nodes breadth-first and is helpful for shortest path in unweighted trees/graphs.",
          interactive: true,
        },
      ],
      timeLimit: 900,
      language: "Python",
    },
    settings: { livePreview: true, showResults: true, allowHints: true },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Difficulty 3 - Graph Representations
  {
    title: "Interactive Demo: Graph Representations",
    description:
      "Compare adjacency list vs matrix and their trade-offs through examples",
    activityType: "interactive_demo",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 70,
    estimatedMinutes: 20,
    tags: ["graphs", "adjacency-list", "adjacency-matrix", "interactive-demo"],
    content: {
      title: "Adjacency List vs Matrix",
      description:
        "Choose between sparse and dense-graph oriented representations.",
      steps: [
        {
          id: 1,
          title: "Adjacency List",
          description:
            "Space O(V + E); iterate neighbors efficiently; great for sparse graphs.",
          code: "graph = {\n  'A': ['B','C'],\n  'B': ['D'],\n  'C': ['D','E'],\n  'D': ['F'],\n  'E': [],\n  'F': []\n}\nprint(graph['A'])  # ['B', 'C']",
          explanation:
            "Only existing edges are stored. Checking edge existence can be O(deg(u)) unless extra indexing is used.",
          interactive: true,
        },
        {
          id: 2,
          title: "Adjacency Matrix",
          description:
            "Space O(V^2); O(1) edge existence check; simple structure for dense graphs.",
          code: "V = ['A','B','C','D']\nM = [[0,1,1,0],\n     [0,0,0,1],\n     [0,0,0,1],\n     [0,0,0,0]]\n# Is there an edge A->C?\nprint(M[0][2] == 1)  # True",
          explanation:
            "For dense graphs, matrix can be simpler and constant-time for checking edge presence.",
          interactive: true,
        },
      ],
      timeLimit: 960,
      language: "Python",
    },
    settings: { livePreview: true, showResults: true, allowHints: true },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Difficulty 4 - Hash Tables Internals
  {
    title: "Interactive Demo: Hash Tables and Collisions",
    description:
      "Explore hashing basics, load factor, and collision handling strategies interactively",
    activityType: "interactive_demo",
    category: "Data Structures",
    difficulty: 4,
    diamondReward: 36,
    experienceReward: 85,
    estimatedMinutes: 24,
    tags: ["hashing", "hash-table", "collisions", "interactive-demo"],
    content: {
      title: "Hashing & Collisions",
      description:
        "Understand load factor, primary clustering, and common collision strategies.",
      steps: [
        {
          id: 1,
          title: "Basics of Hashing",
          description:
            "A hash function maps keys to indices; collisions happen when multiple keys map to the same bucket.",
          code: "def simple_hash(key, size):\n    return hash(key) % size\n\nsize = 8\nbucket = simple_hash('Alice', size)\nprint(bucket)",
          explanation:
            "Good hashing aims for uniform distribution to minimize collisions.",
          interactive: true,
          questions: [
            {
              question: "Which metric reflects table fullness?",
              options: ["Depth", "Load factor", "Degree", "Height"],
              correct: 1,
            },
          ],
        },
        {
          id: 2,
          title: "Collision Strategies",
          description:
            "Separate chaining vs open addressing (linear/quadratic probing, double hashing).",
          code: "# Separate chaining stores collided entries in per-bucket lists\n# Open addressing probes alternative positions within the table",
          explanation:
            "Quadratic probing reduces primary clustering compared to linear probing.",
          interactive: true,
        },
      ],
      timeLimit: 1200,
      language: "Python",
    },
    settings: { livePreview: true, showResults: true, allowHints: true },
    isActive: true,
    sortOrder: 5,
  },
];

export async function seedInteractiveDemoDataStructuresActivities() {
  await seedActivitiesWithDuplicateCheck(
    interactiveDemoDataStructuresActivities,
    "Interactive Demo Data Structures"
  );
}

// Execute if run directly
if (require.main === module) {
  seedInteractiveDemoDataStructuresActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Interactive Demo Data Structures activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
