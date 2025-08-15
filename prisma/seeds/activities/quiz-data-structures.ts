import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Quiz Activities for Data Structures
 * 5 high-quality quizzes with increasing difficulty
 */
export const quizDataStructuresActivities = [
  // 1) Difficulty 1 - Foundations
  {
    title: "Data Structures Foundations Quiz",
    description:
      "Test your understanding of fundamental data structure concepts and terminology",
    activityType: "quiz",
    category: "Data Structures",
    difficulty: 1,
    diamondReward: 18,
    experienceReward: 40,
    estimatedMinutes: 12,
    tags: ["data-structures", "foundations", "terminology", "basics"],
    content: {
      instructions:
        "Answer these fundamentals covering data structure categories and basic properties",
      questions: [
        {
          id: 1,
          question: "Which of the following is a linear data structure?",
          options: ["Graph", "Tree", "Queue", "Hash Table"],
          correct: 2,
          explanation:
            "Queue is a linear data structure. Trees and graphs are nonlinear; hash tables are associative.",
        },
        {
          id: 2,
          question:
            "Which structure is BEST suited for LIFO (Last-In, First-Out) access?",
          options: ["Queue", "Stack", "Deque", "Binary Tree"],
          correct: 1,
          explanation:
            "Stack implements LIFO access: the last element pushed is the first popped.",
        },
        {
          id: 3,
          question:
            "Which structure is typically used to model hierarchical relationships?",
          options: ["Array", "Tree", "Hash Map", "Stack"],
          correct: 1,
          explanation: "Trees capture parent-child hierarchy naturally.",
        },
        {
          id: 4,
          question:
            "Which pair of operations characterize a queue’s typical interface?",
          options: [
            "push, pop",
            "enqueue, dequeue",
            "insert, delete",
            "offer, poll (Java only)",
          ],
          correct: 1,
          explanation:
            "Queues use enqueue to add at the back and dequeue to remove from the front.",
        },
        {
          id: 5,
          question:
            "Which structure is generally best for fast membership checks on average?",
          options: ["List", "Tuple", "Set/Hash Table", "Stack"],
          correct: 2,
          explanation:
            "Hash tables (sets/maps) provide O(1) average-time membership checks.",
        },
        {
          id: 6,
          question:
            "Big-O best describes which aspect of an algorithm or data structure?",
          options: [
            "Worst/best/average runtime or space growth with input size",
            "Exact number of CPU instructions",
            "Programming language performance",
            "Compiler optimization level",
          ],
          correct: 0,
          explanation:
            "Big-O abstracts growth rates for time/space as input size increases.",
        },
      ],
      timeLimit: 360,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 75,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Difficulty 2 - Linear DS
  {
    title: "Linear Data Structures Quiz",
    description:
      "Assess your knowledge of arrays/lists, stacks, queues and deques",
    activityType: "quiz",
    category: "Data Structures",
    difficulty: 2,
    diamondReward: 22,
    experienceReward: 50,
    estimatedMinutes: 15,
    tags: ["arrays", "lists", "stacks", "queues", "deques", "linear"],
    content: {
      instructions:
        "Answer questions about operations and complexities in linear data structures",
      questions: [
        {
          id: 1,
          question:
            "In a dynamic array (Python list), what is the average-case time for append?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          correct: 0,
          explanation:
            "Amortized append in a dynamic array is O(1) on average.",
        },
        {
          id: 2,
          question:
            "Which operation is typically O(1) in a singly linked list when you only have the head pointer?",
          options: [
            "Insert at tail",
            "Insert at head",
            "Delete at tail",
            "Random access by index",
          ],
          correct: 1,
          explanation:
            "Inserting at head is O(1) if you maintain a reference to head.",
        },
        {
          id: 3,
          question:
            "Which structure naturally supports both ends insertion/removal in O(1) (amortized)?",
          options: ["Stack", "Queue", "Deque", "Array"],
          correct: 2,
          explanation:
            "Deques (double-ended queues) are designed for efficient operations at both ends.",
        },
        {
          id: 4,
          question:
            "Accessing list[i] on a typical dynamic array has which time complexity?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          correct: 0,
          explanation:
            "Random access on arrays is O(1) due to contiguous memory.",
        },
        {
          id: 5,
          question:
            "Which Python type is most suitable to implement a queue with O(1) popleft?",
          options: ["list", "deque", "tuple", "set"],
          correct: 1,
          explanation:
            "collections.deque provides O(1) appends and pops from both ends.",
        },
      ],
      timeLimit: 450,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 75,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3) Difficulty 3 - Trees
  {
    title: "Trees & Binary Search Trees Quiz",
    description:
      "Evaluate your understanding of trees, BST properties, and traversals",
    activityType: "quiz",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 28,
    experienceReward: 60,
    estimatedMinutes: 18,
    tags: ["trees", "bst", "traversals", "height"],
    content: {
      instructions:
        "Answer questions on tree fundamentals, BST operations, and traversal orders",
      questions: [
        {
          id: 1,
          question: "Which traversal order visits nodes left-root-right?",
          options: ["Preorder", "Inorder", "Postorder", "Level-order"],
          correct: 1,
          explanation:
            "Inorder is left, root, right (for BST this yields sorted values).",
        },
        {
          id: 2,
          question:
            "What is the typical average time complexity for search in a balanced BST?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          correct: 1,
          explanation:
            "Balanced BST guarantees O(log n) for search, insert, and delete (on average).",
        },
        {
          id: 3,
          question:
            "What does the height of a tree represent (assuming height of single node is 0)?",
          options: [
            "Total number of nodes",
            "Number of leaves",
            "Length of the longest downward path from root",
            "Sum of depths of all nodes",
          ],
          correct: 2,
          explanation:
            "Height is the longest path length from the root to a leaf.",
        },
        {
          id: 4,
          question: "Which statement about BST is TRUE (assuming unique keys)?",
          options: [
            "All nodes in left subtree are greater than root",
            "All nodes in right subtree are less than root",
            "Inorder traversal of BST yields ascending order",
            "Level-order traversal of BST yields ascending order",
          ],
          correct: 2,
          explanation:
            "Inorder traversal of a BST yields sorted order of keys.",
        },
        {
          id: 5,
          question:
            "Which rotation(s) can a self-balancing tree (e.g., AVL) use to maintain balance?",
          options: [
            "Left rotation only",
            "Right rotation only",
            "Both left and right rotations",
            "No rotations are used",
          ],
          correct: 2,
          explanation:
            "AVL and similar trees use both left and right rotations to maintain balance.",
        },
      ],
      timeLimit: 600,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 75,
    },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Difficulty 3 - Graphs
  {
    title: "Graphs Fundamentals Quiz",
    description:
      "Assess your grasp of graph representations, traversal, and basics",
    activityType: "quiz",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 20,
    tags: ["graphs", "bfs", "dfs", "adjacency", "directed"],
    content: {
      instructions:
        "Answer questions about graphs: representations, BFS/DFS, and connectivity",
      questions: [
        {
          id: 1,
          question:
            "Which representation is more space-efficient for sparse graphs?",
          options: [
            "Adjacency matrix",
            "Adjacency list",
            "Both are identical",
            "Neither",
          ],
          correct: 1,
          explanation:
            "Adjacency lists only store existing edges, making them ideal for sparse graphs.",
        },
        {
          id: 2,
          question:
            "Which traversal guarantees shortest number of edges from a source in an unweighted graph?",
          options: ["DFS", "BFS", "Dijkstra", "Bellman-Ford"],
          correct: 1,
          explanation:
            "BFS explores level by level and yields shortest path by edge count in unweighted graphs.",
        },
        {
          id: 3,
          question: "DFS typically uses which auxiliary structure?",
          options: ["Queue", "Stack (explicit or recursion)", "Deque", "Heap"],
          correct: 1,
          explanation:
            "DFS uses a stack (explicit or via recursion) to track the path.",
        },
        {
          id: 4,
          question:
            "How many edges does a tree with n nodes have (assuming connected, acyclic)?",
          options: ["n-1", "n", "n+1", "n^2"],
          correct: 0,
          explanation: "A tree with n nodes always has n - 1 edges.",
        },
        {
          id: 5,
          question: "Which is TRUE for a directed acyclic graph (DAG)?",
          options: [
            "It must be connected",
            "It contains cycles",
            "It admits a topological ordering",
            "It cannot have multiple components",
          ],
          correct: 2,
          explanation:
            "A DAG admits at least one topological ordering; it may be disconnected.",
        },
      ],
      timeLimit: 600,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 75,
    },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Difficulty 4 - Hash Tables & Heaps
  {
    title: "Hash Tables & Heaps Quiz",
    description:
      "Advanced questions on hashing strategies, priority queues, and heaps",
    activityType: "quiz",
    category: "Data Structures",
    difficulty: 4,
    diamondReward: 35,
    experienceReward: 80,
    estimatedMinutes: 25,
    tags: ["hashing", "hash-table", "heap", "priority-queue", "collisions"],
    content: {
      instructions:
        "Answer advanced questions on hash tables and heap-based priority queues",
      questions: [
        {
          id: 1,
          question:
            "Which collision resolution strategy chains multiple collided keys in the same bucket?",
          options: [
            "Open addressing",
            "Separate chaining",
            "Cuckoo hashing",
            "Double hashing",
          ],
          correct: 1,
          explanation:
            "Separate chaining stores collided items in per-bucket structures (e.g., linked lists).",
        },
        {
          id: 2,
          question: "In a min-heap, which element is always at the root?",
          options: ["Largest key", "Median key", "Smallest key", "Random key"],
          correct: 2,
          explanation:
            "Min-heap maintains the smallest element at the root, enabling O(1) find-min.",
        },
        {
          id: 3,
          question:
            "What is the average-case time complexity of successful lookup in a well-sized hash table?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          correct: 0,
          explanation:
            "With good hashing and proper load factor, average lookup is O(1).",
        },
        {
          id: 4,
          question:
            "Binary heap push/pop operations generally have which time complexity?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          correct: 1,
          explanation:
            "Heap operations involve percolating up/down along height O(log n).",
        },
        {
          id: 5,
          question:
            "Which of the following can prevent primary clustering in open addressing?",
          options: [
            "Linear probing",
            "Quadratic probing",
            "Chaining",
            "Storing full keys in table",
          ],
          correct: 1,
          explanation:
            "Quadratic probing reduces primary clustering compared to linear probing.",
        },
      ],
      timeLimit: 780,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 80,
    },
    isActive: true,
    sortOrder: 5,
  },
];

export async function seedQuizDataStructuresActivities() {
  await seedActivitiesWithDuplicateCheck(
    quizDataStructuresActivities,
    "Quiz Data Structures"
  );
}

// Execute if run directly
if (require.main === module) {
  seedQuizDataStructuresActivities()
    .catch((error) => {
      console.error("❌ Error seeding Quiz Data Structures activities:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
