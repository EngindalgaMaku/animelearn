import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Interactive Coding Activities for Data Structures
 * 5 activities with increasing difficulty
 */
export const interactiveCodingDataStructuresActivities = [
  // 1) Difficulty 1 - Stack implementation
  {
    title: "Interactive Coding: Implement a Simple Stack",
    description:
      "Implement a basic stack with push, pop, peek, and is_empty operations",
    activityType: "interactive_coding",
    category: "Data Structures",
    difficulty: 1,
    diamondReward: 20,
    experienceReward: 45,
    estimatedMinutes: 15,
    tags: ["stack", "lifo", "implementation", "interactive-coding"],
    content: {
      instructions:
        "Complete the Stack class to support push, pop, peek, and is_empty operations.",
      problem:
        "Stacks follow the Last-In, First-Out rule. Implement a stack using Python list as the underlying container.",
      starterCode:
        "# Implement a simple Stack\nclass Stack:\n    def __init__(self):\n        self._data = []\n\n    def push(self, x):\n        # TODO: append x to top\n        pass\n\n    def pop(self):\n        # TODO: remove and return top element\n        pass\n\n    def peek(self):\n        # TODO: return top element without removing; return None if empty\n        pass\n\n    def is_empty(self):\n        # TODO: return True if empty\n        pass\n\nif __name__ == \"__main__\":\n    s = Stack()\n    print('OK' if s.is_empty() else 'FAIL')",
      solution:
        "class Stack:\n    def __init__(self):\n        self._data = []\n\n    def push(self, x):\n        self._data.append(x)\n\n    def pop(self):\n        if not self._data:\n            return None\n        return self._data.pop()\n\n    def peek(self):\n        if not self._data:\n            return None\n        return self._data[-1]\n\n    def is_empty(self):\n        return len(self._data) == 0\n\nif __name__ == \"__main__\":\n    s = Stack()\n    print('OK' if s.is_empty() else 'FAIL')",
      testCases: [
        {
          input: "",
          expectedOutput: "OK",
          hidden: false,
        },
        {
          input: "",
          expectedOutput: "",
          code: "s = Stack()\ns.push(1)\ns.push(2)\nprint(s.peek())\nprint(s.pop())\nprint(s.pop())\nprint(s.pop())",
          verifyContains: ["2", "2", "1", "None"],
        },
      ],
      language: "Python",
      hints: [
        "Use Python list append() for push",
        "Use list pop() for pop",
        "Top element is the last element in the list",
      ],
    },
    settings: {
      timeLimit: 900,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Difficulty 2 - Queue using two stacks
  {
    title: "Interactive Coding: Queue Using Two Stacks",
    description:
      "Implement a queue (FIFO) using two stacks with amortized O(1) enqueue/dequeue",
    activityType: "interactive_coding",
    category: "Data Structures",
    difficulty: 2,
    diamondReward: 24,
    experienceReward: 55,
    estimatedMinutes: 18,
    tags: ["queue", "two-stacks", "amortized", "interactive-coding"],
    content: {
      instructions:
        "Complete MyQueue implemented with two stacks: in_stack and out_stack.",
      problem:
        "Use two stacks to implement enqueue(x), dequeue(), and peek() with amortized O(1).",
      starterCode:
        "class MyQueue:\n    def __init__(self):\n        self._in = []\n        self._out = []\n\n    def enqueue(self, x):\n        # TODO: append x to in stack\n        pass\n\n    def _shift(self):\n        # Move elements from in to out if out is empty\n        if not self._out:\n            while self._in:\n                self._out.append(self._in.pop())\n\n    def dequeue(self):\n        # TODO: ensure out has elements then pop from out\n        pass\n\n    def peek(self):\n        # TODO: return next item without removing\n        pass\n\nif __name__ == \"__main__\":\n    q = MyQueue()\n    for i in range(3):\n        q.enqueue(i)\n    print('OK' if q.peek() == 0 else 'FAIL')",
      solution:
        "class MyQueue:\n    def __init__(self):\n        self._in = []\n        self._out = []\n\n    def enqueue(self, x):\n        self._in.append(x)\n\n    def _shift(self):\n        if not self._out:\n            while self._in:\n                self._out.append(self._in.pop())\n\n    def dequeue(self):\n        self._shift()\n        if not self._out:\n            return None\n        return self._out.pop()\n\n    def peek(self):\n        self._shift()\n        if not self._out:\n            return None\n        return self._out[-1]\n\nif __name__ == \"__main__\":\n    q = MyQueue()\n    for i in range(3):\n        q.enqueue(i)\n    print('OK' if q.peek() == 0 else 'FAIL')",
      testCases: [
        {
          input: "",
          expectedOutput: "OK",
        },
        {
          input: "",
          expectedOutput: "",
          code: "q = MyQueue()\nfor i in [1,2,3]:\n    q.enqueue(i)\nprint(q.peek())\nprint(q.dequeue())\nprint(q.dequeue())\nq.enqueue(4)\nprint(q.peek())\nprint(q.dequeue())\nprint(q.dequeue())\nprint(q.dequeue())",
          verifyContains: ["1", "1", "2", "3", "3", "4", "None"],
        },
      ],
      language: "Python",
      hints: [
        "Only shift from in to out when out is empty",
        "enqueue pushes to in; dequeue pops from out",
        "peek is like dequeue without removal",
      ],
    },
    settings: {
      timeLimit: 1000,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3) Difficulty 3 - BST insert and search
  {
    title: "Interactive Coding: Binary Search Tree Insert & Search",
    description:
      "Implement insert and search for a BST; assume unique keys and integers",
    activityType: "interactive_coding",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 28,
    experienceReward: 65,
    estimatedMinutes: 22,
    tags: ["bst", "trees", "search", "insert", "interactive-coding"],
    content: {
      instructions:
        "Complete BST insert(root, key) and search(root, key). Return the (possibly new) root for insert.",
      problem:
        "BST property: left < root < right. Implement recursive or iterative versions.",
      starterCode:
        "class Node:\n    def __init__(self, key):\n        self.key = key\n        self.left = None\n        self.right = None\n\ndef insert(root, key):\n    # TODO\n    pass\n\ndef search(root, key):\n    # TODO return True/False\n    pass\n\nif __name__ == \"__main__\":\n    r = None\n    for k in [5,3,7,2,4,6,8]:\n        r = insert(r, k)\n    print('OK' if search(r, 4) else 'FAIL')",
      solution:
        "class Node:\n    def __init__(self, key):\n        self.key = key\n        self.left = None\n        self.right = None\n\ndef insert(root, key):\n    if root is None:\n        return Node(key)\n    if key < root.key:\n        root.left = insert(root.left, key)\n    elif key > root.key:\n        root.right = insert(root.right, key)\n    return root\n\ndef search(root, key):\n    cur = root\n    while cur:\n        if key == cur.key:\n            return True\n        cur = cur.left if key < cur.key else cur.right\n    return False\n\nif __name__ == \"__main__\":\n    r = None\n    for k in [5,3,7,2,4,6,8]:\n        r = insert(r, k)\n    print('OK' if search(r, 4) else 'FAIL')",
      testCases: [
        {
          input: "",
          expectedOutput: "OK",
        },
        {
          input: "",
          expectedOutput: "",
          code: "r = None\nfor k in [10,5,15,3,7,12,18]:\n    r = insert(r, k)\nprint(search(r, 7))\nprint(search(r, 13))",
          verifyContains: ["True", "False"],
        },
      ],
      language: "Python",
      hints: [
        "For insert, recurse to correct subtree until hitting None",
        "For search, compare and choose left or right",
        "Do not insert duplicates for this exercise",
      ],
    },
    settings: {
      timeLimit: 1200,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Difficulty 3 - Graph BFS
  {
    title: "Interactive Coding: BFS on Adjacency List",
    description:
      "Implement Breadth-First Search to compute shortest edges distance from a source",
    activityType: "interactive_coding",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 70,
    estimatedMinutes: 24,
    tags: [
      "graphs",
      "bfs",
      "adjacency-list",
      "shortest-path",
      "interactive-coding",
    ],
    content: {
      instructions:
        "Given an adjacency list graph, implement bfs_distances(graph, src) returning a dict of node:distance.",
      problem:
        "Use a queue to explore by levels. Unreachable nodes can be omitted or have distance -1.",
      starterCode:
        "from collections import deque\n\ndef bfs_distances(graph, src):\n    # graph: dict[node] = list[neighbors]\n    # TODO: return dict of shortest distance by edge count from src\n    pass\n\nif __name__ == \"__main__\":\n    g = {0:[1,2],1:[2],2:[0,3],3:[3]}\n    d = bfs_distances(g, 2)\n    print('OK' if d.get(3, -1) == 1 else 'FAIL')",
      solution:
        "from collections import deque\n\ndef bfs_distances(graph, src):\n    dist = {src: 0}\n    q = deque([src])\n    while q:\n        u = q.popleft()\n        for v in graph.get(u, []):\n            if v not in dist:\n                dist[v] = dist[u] + 1\n                q.append(v)\n    return dist\n\nif __name__ == \"__main__\":\n    g = {0:[1,2],1:[2],2:[0,3],3:[3]}\n    d = bfs_distances(g, 2)\n    print('OK' if d.get(3, -1) == 1 else 'FAIL')",
      testCases: [
        {
          input: "",
          expectedOutput: "OK",
        },
        {
          input: "",
          expectedOutput: "",
          code: "g = {\n  'A': ['B','C'],\n  'B': ['D'],\n  'C': ['D','E'],\n  'D': ['F'],\n  'E': [],\n  'F': []\n}\nprint(bfs_distances(g, 'A'))",
          verifyContains: ["'A': 0", "'B': 1", "'C': 1", "'D': 2"],
        },
      ],
      language: "Python",
      hints: [
        "Initialize dist[src] = 0 and queue with src",
        "When visiting a neighbor first time, set its dist and enqueue",
        "Stop condition is queue empty",
      ],
    },
    settings: {
      timeLimit: 1200,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Difficulty 4 - Min-Heap operations with heapq
  {
    title: "Interactive Coding: Priority Queue with heapq",
    description:
      "Use Python heapq to implement a simple priority queue supporting push and pop_min",
    activityType: "interactive_coding",
    category: "Data Structures",
    difficulty: 4,
    diamondReward: 36,
    experienceReward: 85,
    estimatedMinutes: 26,
    tags: ["heap", "priority-queue", "heapq", "interactive-coding"],
    content: {
      instructions:
        "Complete the PriorityQueue class to push elements and pop the minimum.",
      problem:
        "Use Python's heapq to get O(log n) push and pop of smallest element.",
      starterCode:
        "import heapq\n\nclass PriorityQueue:\n    def __init__(self):\n        self._h = []\n\n    def push(self, x):\n        # TODO: push x into heap\n        pass\n\n    def pop_min(self):\n        # TODO: pop and return smallest element; return None if empty\n        pass\n\nif __name__ == \"__main__\":\n    pq = PriorityQueue()\n    for v in [5,3,7,1]:\n        pq.push(v)\n    print('OK' if pq.pop_min() == 1 else 'FAIL')",
      solution:
        "import heapq\n\nclass PriorityQueue:\n    def __init__(self):\n        self._h = []\n\n    def push(self, x):\n        heapq.heappush(self._h, x)\n\n    def pop_min(self):\n        if not self._h:\n            return None\n        return heapq.heappop(self._h)\n\nif __name__ == \"__main__\":\n    pq = PriorityQueue()\n    for v in [5,3,7,1]:\n        pq.push(v)\n    print('OK' if pq.pop_min() == 1 else 'FAIL')",
      testCases: [
        {
          input: "",
          expectedOutput: "OK",
        },
        {
          input: "",
          expectedOutput: "",
          code: "pq = PriorityQueue()\nfor v in [10,4,6,2,8]:\n    pq.push(v)\nprint(pq.pop_min())\nprint(pq.pop_min())\nprint(pq.pop_min())\nprint(pq.pop_min())\nprint(pq.pop_min())\nprint(pq.pop_min())",
          verifyContains: ["2", "4", "6", "8", "10", "None"],
        },
      ],
      language: "Python",
      hints: [
        "Use heapq.heappush and heapq.heappop",
        "heappop on empty should be handled gracefully",
        "Python heapq is a min-heap by default",
      ],
    },
    settings: {
      timeLimit: 1400,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 5,
  },
];

export async function seedInteractiveCodingDataStructuresActivities() {
  await seedActivitiesWithDuplicateCheck(
    interactiveCodingDataStructuresActivities,
    "Interactive Coding Data Structures"
  );
}

// Execute if run directly
if (require.main === module) {
  seedInteractiveCodingDataStructuresActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Interactive Coding Data Structures activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
