import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Data Exploration Activities for Data Structures
 * 5 activities with increasing difficulty
 */
export const dataExplorationDataStructuresActivities = [
  // 1) Difficulty 1 - Operations Log Basics
  {
    title: "Data Exploration: Operations Log Basics",
    description:
      "Analyze a small operations log across arrays, lists, stacks and queues",
    activityType: "data_exploration",
    category: "Data Structures",
    difficulty: 1,
    diamondReward: 20,
    experienceReward: 45,
    estimatedMinutes: 14,
    tags: ["data-structures", "analysis", "operations", "basics"],
    content: {
      title: "Operations Log Overview",
      instructions:
        "Use the dataset to answer basic questions on operation counts and common structures. You can group by structure or operation.",
      dataset: [
        {
          id: "1",
          structure: "array",
          operation: "access",
          cost: "O(1)",
          note: "random index access",
        },
        {
          id: "2",
          structure: "linked_list",
          operation: "insert_head",
          cost: "O(1)",
          note: "push front",
        },
        {
          id: "3",
          structure: "stack",
          operation: "push",
          cost: "O(1)",
          note: "append top",
        },
        {
          id: "4",
          structure: "queue",
          operation: "dequeue",
          cost: "O(1)",
          note: "pop front",
        },
        {
          id: "5",
          structure: "array",
          operation: "insert_middle",
          cost: "O(n)",
          note: "shift elements",
        },
        {
          id: "6",
          structure: "linked_list",
          operation: "search",
          cost: "O(n)",
          note: "linear scan",
        },
        {
          id: "7",
          structure: "stack",
          operation: "pop",
          cost: "O(1)",
          note: "remove top",
        },
        {
          id: "8",
          structure: "queue",
          operation: "enqueue",
          cost: "O(1)",
          note: "append rear",
        },
      ],
      questions: [
        {
          id: "q1",
          question: "How many distinct data structures appear in the log?",
          type: "analyze",
          answer: "4",
          hint: "Look at unique values of the 'structure' field",
        },
        {
          id: "q2",
          question: "How many O(1) operations are recorded?",
          type: "calculate",
          answer: "5",
          hint: "Count rows where cost equals O(1)",
        },
        {
          id: "q3",
          question:
            "List the operations for 'array' and their typical costs in this dataset.",
          type: "analyze",
          answer: "access: O(1); insert_middle: O(n)",
          hint: "Filter structure == 'array'",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 900,
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: true,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Difficulty 2 - Arrays vs Lists Performance Snapshot
  {
    title: "Data Exploration: Arrays vs Lists Performance Snapshot",
    description:
      "Compare average access and traversal times for arrays and linked lists",
    activityType: "data_exploration",
    category: "Data Structures",
    difficulty: 2,
    diamondReward: 24,
    experienceReward: 55,
    estimatedMinutes: 16,
    tags: ["arrays", "linked-lists", "performance", "analysis"],
    content: {
      title: "Micro-benchmark Snapshot",
      instructions:
        "Given simple nano-second timings (illustrative), infer relative performance for operations.",
      dataset: [
        { n: 1_000, array_access_ns: 3, list_traverse_ns: 950 },
        { n: 5_000, array_access_ns: 3, list_traverse_ns: 4700 },
        { n: 10_000, array_access_ns: 3, list_traverse_ns: 9300 },
      ],
      questions: [
        {
          id: "q1",
          question:
            "Which is faster for random access: array or linked list? Provide one-sentence justification.",
          type: "analyze",
          answer:
            "Array is faster; random access is O(1) with constant ~3ns in snapshot, while lists need O(n) traversal.",
          hint: "Compare array_access_ns vs list_traverse_ns",
        },
        {
          id: "q2",
          question:
            "Estimate the ratio list_traverse_ns / array_access_ns for n = 10,000.",
          type: "calculate",
          answer: "≈ 9300 / 3 = ~3100x (illustrative)",
          hint: "Simple division using the provided values",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 960,
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: true,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3) Difficulty 3 - Trees Dataset
  {
    title: "Data Exploration: Trees and BST Properties",
    description:
      "Analyze basic tree metrics and recall BST traversal properties",
    activityType: "data_exploration",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 28,
    experienceReward: 65,
    estimatedMinutes: 18,
    tags: ["trees", "bst", "traversals", "analysis"],
    content: {
      title: "Trees Dataset",
      instructions:
        "Use provided nodes/heights to answer general properties; connect to BST traversals.",
      dataset: [
        { id: "T1", nodes: 7, height: 2, isBalanced: true },
        { id: "T2", nodes: 15, height: 3, isBalanced: true },
        { id: "T3", nodes: 9, height: 8, isBalanced: false },
      ],
      questions: [
        {
          id: "q1",
          question:
            "For a connected acyclic tree with n nodes, how many edges are there?",
          type: "calculate",
          answer: "n - 1",
          hint: "Fundamental tree property",
        },
        {
          id: "q2",
          question:
            "Which traversal yields ascending keys for a BST (assuming unique keys)?",
          type: "analyze",
          answer: "Inorder",
          hint: "Left → Root → Right",
        },
        {
          id: "q3",
          question:
            "Which tree above likely has worst average search performance and why?",
          type: "analyze",
          answer:
            "T3; height 8 with only 9 nodes indicates it is highly unbalanced (close to a chain).",
          hint: "Compare heights vs node counts for balance",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 1020,
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: true,
    },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Difficulty 3 - Graphs Mini Study
  {
    title: "Data Exploration: Graph Degree and Connectivity",
    description:
      "Explore degrees from an edge list and identify high-degree nodes and components",
    activityType: "data_exploration",
    category: "Data Structures",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 70,
    estimatedMinutes: 20,
    tags: ["graphs", "degrees", "components", "analysis"],
    content: {
      title: "Edge List Snapshot",
      instructions:
        "Treat edges as undirected for degree counts; estimate components by intuition from sets.",
      dataset: [
        { edge: ["A", "B"] },
        { edge: ["A", "C"] },
        { edge: ["B", "D"] },
        { edge: ["C", "D"] },
        { edge: ["E", "F"] },
      ],
      questions: [
        {
          id: "q1",
          question: "What is the degree of node A (undirected)?",
          type: "calculate",
          answer: "2",
          hint: "Count edges touching A",
        },
        {
          id: "q2",
          question:
            "Which node(s) have the highest degree in the first component {A,B,C,D}?",
          type: "analyze",
          answer:
            "B, C, and D each have degree 2; A has degree 2 as well (all four are 2).",
          hint: "Each of A,B,C,D touch two edges in this set",
        },
        {
          id: "q3",
          question: "How many connected components exist in this graph?",
          type: "calculate",
          answer: "2",
          hint: "One component {A,B,C,D}, another {E,F}",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 1080,
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: true,
    },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Difficulty 4 - Hash Tables Load Factor and Heaps
  {
    title: "Data Exploration: Hash Load Factor and Heap Outcomes",
    description:
      "Compute load factors and reason about collision risks and heap results",
    activityType: "data_exploration",
    category: "Data Structures",
    difficulty: 4,
    diamondReward: 36,
    experienceReward: 85,
    estimatedMinutes: 24,
    tags: ["hashing", "heap", "priority-queue", "analysis"],
    content: {
      title: "Hashing & Heap Mini Analysis",
      instructions:
        "Use provided table occupancy to compute load factors; for heap, reason about resulting min.",
      dataset: [
        { table: "T1", size: 8, occupied: 6, strategy: "linear_probing" },
        { table: "T2", size: 16, occupied: 8, strategy: "quadratic_probing" },
        { table: "T3", size: 10, occupied: 10, strategy: "separate_chaining" },
        { heapOps: ["push 5", "push 2", "push 9", "push 1", "pop_min"] },
      ],
      questions: [
        {
          id: "q1",
          question: "Compute load factors for T1, T2, T3 (occupied/size).",
          type: "calculate",
          answer: "T1: 0.75; T2: 0.5; T3: 1.0",
          hint: "Divide occupied by size",
        },
        {
          id: "q2",
          question:
            "Which open addressing table likely has lower primary clustering risk and why?",
          type: "analyze",
          answer:
            "T2 (quadratic probing) at load factor 0.5; quadratic probing reduces primary clustering vs linear probing and lower load helps.",
          hint: "Consider strategy and load factor magnitude",
        },
        {
          id: "q3",
          question:
            "After the given heap operations, what value was returned by pop_min?",
          type: "analyze",
          answer: "1",
          hint: "Min-heap returns smallest; pushes: 5,2,9,1",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 1200,
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: true,
    },
    isActive: true,
    sortOrder: 5,
  },
];

export async function seedDataExplorationDataStructuresActivities() {
  await seedActivitiesWithDuplicateCheck(
    dataExplorationDataStructuresActivities,
    "Data Exploration Data Structures"
  );
}

// Execute if run directly
if (require.main === module) {
  seedDataExplorationDataStructuresActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Data Exploration Data Structures activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
