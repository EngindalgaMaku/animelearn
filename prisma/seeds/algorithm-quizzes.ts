import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type QuizSeed = {
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: number; // 1=beginner, 2=intermediate, 3=advanced
  diamondReward: number;
  experienceReward: number;
  estimatedMinutes: number;
  sortOrder: number;
  content: any; // will be JSON.stringified
  settings?: any; // optional JSON.stringified
  tags?: string[];
};

const ALG = "Algorithms";

/**
 * 10 algorithm quizzes (2×5), pairing with the 10 Algorithms lessons:
 * 1..5  Sorting (Bubble, Selection, Insertion, Merge, Quick)
 * 6..10 Core algorithms (Binary Search, BFS, DFS, Dijkstra, DP Intro)
 */
const quizzes: QuizSeed[] = [
  // 1) Bubble Sort
  {
    slug: "alg-bubble-sort-quiz",
    title: "Bubble Sort Quiz",
    description:
      "Test your understanding of Bubble Sort: comparisons, swaps, passes, and complexity.",
    category: ALG,
    difficulty: 1,
    diamondReward: 30,
    experienceReward: 45,
    estimatedMinutes: 8,
    sortOrder: 1,
    content: {
      timeLimit: 480,
      passingScore: 70,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "What is the worst-case time complexity of Bubble Sort?",
          options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
          correctAnswer: 2,
          explanation:
            "Bubble Sort compares adjacent elements in nested loops: O(n²) worst/average.",
        },
        {
          id: 2,
          type: "true_false",
          question: "Bubble Sort is a stable sorting algorithm.",
          correctAnswer: true,
          explanation:
            "Equal elements preserve relative order in Bubble Sort, so it is stable.",
        },
        {
          id: 3,
          type: "multiple_choice",
          question:
            "Which optimization allows Bubble Sort to finish early on nearly sorted arrays?",
          options: [
            "Counting sort pre-pass",
            "Stop when no swaps occur in a pass",
            "Median-of-three pivot",
            "Binary search insertion",
          ],
          correctAnswer: 1,
          explanation:
            "If a full pass makes no swaps, the array is already sorted; we can stop early.",
        },
        {
          id: 4,
          type: "multiple_choice",
          question:
            "After each outer pass in Bubble Sort, which element is guaranteed to be in its final position?",
          options: [
            "The smallest element at the beginning",
            "The median element in the middle",
            "A random element",
            "The largest element at the end",
          ],
          correctAnswer: 3,
          explanation:
            "Each pass pushes the current maximum to the right end—hence the name 'bubble'.",
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "When is Bubble Sort most appropriate?",
          options: [
            "Large datasets with tight memory limits",
            "Nearly sorted or very small datasets for simplicity",
            "Data requiring external sorting",
            "Real-time systems with strict bounds",
          ],
          correctAnswer: 1,
          explanation:
            "Use it for teaching or tiny/nearly sorted inputs; otherwise prefer O(n log n) sorts.",
        },
      ],
    },
    settings: { shuffleOptions: true, allowReview: true },
    tags: [ALG, "sorting", "bubble"],
  },

  // 2) Selection Sort
  {
    slug: "alg-selection-sort-quiz",
    title: "Selection Sort Quiz",
    description:
      "Assess your knowledge of Selection Sort, its behavior, and complexity.",
    category: ALG,
    difficulty: 1,
    diamondReward: 30,
    experienceReward: 45,
    estimatedMinutes: 8,
    sortOrder: 2,
    content: {
      timeLimit: 480,
      passingScore: 70,
      questions: [
        {
          id: 1,
          type: "true_false",
          question: "Selection Sort is stable by default.",
          correctAnswer: false,
          explanation:
            "Selection Sort generally is not stable because swapping the minimum can reorder equal elements.",
        },
        {
          id: 2,
          type: "multiple_choice",
          question:
            "What is the time complexity of Selection Sort in the best case?",
          options: ["O(n)", "O(n log n)", "O(n²)", "O(1)"],
          correctAnswer: 2,
          explanation:
            "Selection Sort always scans the unsorted portion to find the minimum: O(n²) regardless of initial order.",
        },
        {
          id: 3,
          type: "multiple_choice",
          question:
            "What does Selection Sort 'select' during each outer loop iteration?",
          options: [
            "The median element",
            "The maximum element in the sorted prefix",
            "The minimum element in the unsorted suffix",
            "A random pivot",
          ],
          correctAnswer: 2,
          explanation:
            "It selects the minimum from the unsorted portion and swaps it to the front.",
        },
        {
          id: 4,
          type: "multiple_choice",
          question:
            "How many swaps does Selection Sort perform in the worst case?",
          options: ["O(n²)", "O(n log n)", "O(log n)", "O(n)"],
          correctAnswer: 3,
          explanation:
            "Typically up to (n−1) swaps—one per outer iteration; fewer swaps than Bubble Sort.",
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "When might Selection Sort be chosen?",
          options: [
            "When stability is mandatory",
            "When swap cost is very high but comparisons are cheap",
            "For very large datasets",
            "For real-time constraints",
          ],
          correctAnswer: 1,
          explanation:
            "Selection Sort minimizes swaps vs Bubble/Insertion; use it when swaps are expensive.",
        },
      ],
    },
    settings: { shuffleOptions: true, allowReview: true },
    tags: [ALG, "sorting", "selection"],
  },

  // 3) Insertion Sort
  {
    slug: "alg-insertion-sort-quiz",
    title: "Insertion Sort Quiz",
    description:
      "Check your understanding of Insertion Sort, shifting elements, and best-case behavior.",
    category: ALG,
    difficulty: 1,
    diamondReward: 30,
    experienceReward: 45,
    estimatedMinutes: 8,
    sortOrder: 3,
    content: {
      timeLimit: 480,
      passingScore: 70,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "Insertion Sort's best-case time complexity is:",
          options: ["O(1)", "O(n)", "O(n log n)", "O(n²)"],
          correctAnswer: 1,
          explanation:
            "For nearly sorted arrays, each insertion requires minimal shifting: O(n) best-case.",
        },
        {
          id: 2,
          type: "multiple_choice",
          question:
            "Which describes Insertion Sort's core operation per element?",
          options: [
            "Swap with random element",
            "Find median and partition",
            "Shift larger elements right until correct position is found",
            "Always swap adjacent elements",
          ],
          correctAnswer: 2,
          explanation:
            "It shifts larger elements to the right to insert the 'key' in place.",
        },
        {
          id: 3,
          type: "true_false",
          question: "Insertion Sort is a stable sorting algorithm.",
          correctAnswer: true,
          explanation:
            "Equal elements preserve their relative order in Insertion Sort.",
        },
        {
          id: 4,
          type: "multiple_choice",
          question: "Insertion Sort is well-suited for:",
          options: [
            "Huge datasets",
            "Data that is nearly sorted or small arrays",
            "External sorting",
            "Highly random large arrays",
          ],
          correctAnswer: 1,
          explanation:
            "Its simplicity shines on small or nearly sorted inputs; otherwise prefer O(n log n) sorts.",
        },
        {
          id: 5,
          type: "multiple_choice",
          question:
            "Insertion Sort performs at most how many comparisons (worst case)?",
          options: ["~n", "~n log n", "~n²/2", "~log n"],
          correctAnswer: 2,
          explanation:
            "Worst case ~n²/2 comparisons due to shifting many elements per insertion.",
        },
      ],
    },
    settings: { shuffleOptions: true, allowReview: true },
    tags: [ALG, "sorting", "insertion"],
  },

  // 4) Merge Sort
  {
    slug: "alg-merge-sort-quiz",
    title: "Merge Sort Quiz",
    description:
      "Evaluate your knowledge of Merge Sort's divide & conquer approach, stability, and complexity.",
    category: ALG,
    difficulty: 2,
    diamondReward: 40,
    experienceReward: 60,
    estimatedMinutes: 10,
    sortOrder: 4,
    content: {
      timeLimit: 600,
      passingScore: 70,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "Merge Sort's time complexity is:",
          options: [
            "O(n²) in all cases",
            "O(n log n) in all cases",
            "O(n) best, O(n²) worst",
            "O(log n) average",
          ],
          correctAnswer: 1,
          explanation:
            "Divide-and-conquer yields O(n log n) consistently (best/avg/worst).",
        },
        {
          id: 2,
          type: "multiple_choice",
          question:
            "Merge Sort's extra space complexity (typical array version) is:",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          correctAnswer: 2,
          explanation: "Merging typically uses additional arrays: O(n) space.",
        },
        {
          id: 3,
          type: "true_false",
          question: "Merge Sort is stable.",
          correctAnswer: true,
          explanation: "Merging preserves equal elements' relative order.",
        },
        {
          id: 4,
          type: "multiple_choice",
          question: "Which scenario favors Merge Sort over Quick Sort?",
          options: [
            "When stability is required",
            "When memory is extremely limited",
            "When data is nearly sorted",
            "When we need in-place constant extra space",
          ],
          correctAnswer: 0,
          explanation:
            "Merge Sort is stable by nature; Quick Sort is not typically stable.",
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "Which is NOT a step of Merge Sort?",
          options: ["Divide", "Conquer", "Merge", "Pivot selection"],
          correctAnswer: 3,
          explanation:
            "Pivot selection is a Quick Sort concept, not used in Merge Sort.",
        },
      ],
    },
    settings: { shuffleOptions: true, allowReview: true },
    tags: [ALG, "sorting", "merge"],
  },

  // 5) Quick Sort
  {
    slug: "alg-quick-sort-quiz",
    title: "Quick Sort Quiz",
    description:
      "Challenge your knowledge of Quick Sort's partitioning, pivots, and performance trade-offs.",
    category: ALG,
    difficulty: 2,
    diamondReward: 40,
    experienceReward: 60,
    estimatedMinutes: 10,
    sortOrder: 5,
    content: {
      timeLimit: 600,
      passingScore: 70,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "Quick Sort's average time complexity is:",
          options: ["O(n)", "O(n log n)", "O(log n)", "O(n²)"],
          correctAnswer: 1,
          explanation:
            "With good pivots, partitioning yields O(n log n) on average.",
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "Quick Sort's worst-case time complexity occurs when:",
          options: [
            "Array is reversed with naive pivots",
            "Array is already sorted and median-of-three is used",
            "Elements are uniformly random and pivot is random",
            "All elements are equal and we use 3-way partitioning",
          ],
          correctAnswer: 0,
          explanation:
            "Naive pivot (like last element) and adversarial inputs can cause O(n²).",
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "Which technique improves Quick Sort's pivot selection?",
          options: [
            "Counting sort pre-pass",
            "Median-of-three",
            "Binary search pivot",
            "Always choose first element",
          ],
          correctAnswer: 1,
          explanation:
            "Median-of-three (first/middle/last) reduces worst-case likelihood.",
        },
        {
          id: 4,
          type: "true_false",
          question:
            "Quick Sort is typically in-place (ignoring recursion stack).",
          correctAnswer: true,
          explanation:
            "Partitioning can be done in-place; additional space is O(log n) for recursion.",
        },
        {
          id: 5,
          type: "true_false",
          question: "Quick Sort is stable.",
          correctAnswer: false,
          explanation:
            "Standard in-place partitioning reorders equal keys; Quick Sort is not stable by default.",
        },
      ],
    },
    settings: { shuffleOptions: true, allowReview: true },
    tags: [ALG, "sorting", "quick"],
  },

  // 6) Binary Search
  {
    slug: "alg-binary-search-quiz",
    title: "Binary Search Quiz",
    description:
      "Verify your understanding of Binary Search prerequisites and mechanics.",
    category: ALG,
    difficulty: 1,
    diamondReward: 35,
    experienceReward: 55,
    estimatedMinutes: 8,
    sortOrder: 6,
    content: {
      timeLimit: 480,
      passingScore: 70,
      questions: [
        {
          id: 1,
          type: "true_false",
          question: "Binary Search requires the input array to be sorted.",
          correctAnswer: true,
          explanation:
            "Binary Search relies on ordering to discard half the search space each step.",
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "What is Binary Search's time complexity?",
          options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
          correctAnswer: 1,
          explanation: "Halving the search space yields logarithmic time.",
        },
        {
          id: 3,
          type: "multiple_choice",
          question:
            "If arr[mid] < target during Binary Search, how do you update bounds?",
          options: [
            "right = mid - 1",
            "left = mid + 1",
            "left = 0",
            "right = len(arr) - 1",
          ],
          correctAnswer: 1,
          explanation: "Discard the left half by moving left bound to mid + 1.",
        },
        {
          id: 4,
          type: "multiple_choice",
          question:
            "What condition signals that Binary Search failed to find the target?",
          options: [
            "left == right",
            "mid == (left + right) // 2",
            "left > right",
            "arr[mid] == arr[left]",
          ],
          correctAnswer: 2,
          explanation:
            "Once left bound passes right bound, search space is empty.",
        },
        {
          id: 5,
          type: "multiple_choice",
          question:
            "Which variant finds the first occurrence in a sorted array with duplicates?",
          options: [
            "Binary Search without changes",
            "Jump Search",
            "Lower-bound Binary Search",
            "Interpolation Search",
          ],
          correctAnswer: 2,
          explanation:
            "Lower-bound (or first-occurrence) binary search biases to the left on equality.",
        },
      ],
    },
    settings: { shuffleOptions: true, allowReview: true },
    tags: [ALG, "search", "binary-search"],
  },

  // 7) BFS
  {
    slug: "alg-bfs-quiz",
    title: "Breadth-First Search (BFS) Quiz",
    description:
      "Confirm your BFS knowledge: queue, layers, and shortest paths in unweighted graphs.",
    category: ALG,
    difficulty: 2,
    diamondReward: 40,
    experienceReward: 60,
    estimatedMinutes: 9,
    sortOrder: 7,
    content: {
      timeLimit: 540,
      passingScore: 70,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "Which data structure is core to BFS?",
          options: ["Stack", "Queue", "Priority Queue", "Deque only"],
          correctAnswer: 1,
          explanation:
            "BFS explores neighbors level-by-level using a FIFO queue.",
        },
        {
          id: 2,
          type: "true_false",
          question: "BFS finds shortest paths in unweighted graphs.",
          correctAnswer: true,
          explanation:
            "Layered exploration guarantees minimal edge count to each reachable node.",
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "What is BFS time complexity on adjacency-list graphs?",
          options: ["O(V)", "O(E)", "O(V + E)", "O(VE)"],
          correctAnswer: 2,
          explanation:
            "Each vertex and edge is processed at most once: O(V + E).",
        },
        {
          id: 4,
          type: "multiple_choice",
          question: "BFS traversal order is best described as:",
          options: ["Depth-first", "Random", "Level-order", "Reverse"],
          correctAnswer: 2,
          explanation:
            "BFS processes nodes in layers by increasing distance from the source.",
        },
        {
          id: 5,
          type: "multiple_choice",
          question:
            "To reconstruct a shortest path with BFS, you should additionally track:",
          options: [
            "Visited time",
            "Parent/predecessor of each node",
            "Topological order",
            "Strongly connected components",
          ],
          correctAnswer: 1,
          explanation:
            "Recording each node’s parent lets you backtrack from target to source.",
        },
      ],
    },
    settings: { shuffleOptions: true, allowReview: true },
    tags: [ALG, "graphs", "bfs"],
  },

  // 8) DFS
  {
    slug: "alg-dfs-quiz",
    title: "Depth-First Search (DFS) Quiz",
    description:
      "Assess DFS concepts: recursion/stack, cycles, topological order, and complexities.",
    category: ALG,
    difficulty: 2,
    diamondReward: 40,
    experienceReward: 60,
    estimatedMinutes: 9,
    sortOrder: 8,
    content: {
      timeLimit: 540,
      passingScore: 70,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "DFS is typically implemented using:",
          options: [
            "Only a queue",
            "A stack or recursion (call stack)",
            "A priority queue",
            "A deque exclusively",
          ],
          correctAnswer: 1,
          explanation:
            "DFS explores deeply first, naturally expressed with recursion or an explicit stack.",
        },
        {
          id: 2,
          type: "true_false",
          question:
            "DFS can be used for topological sorting of DAGs and cycle detection.",
          correctAnswer: true,
          explanation:
            "DFS finishing times enable topological order; back-edges indicate cycles.",
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "What is DFS time complexity (adjacency lists)?",
          options: ["O(V)", "O(E)", "O(V + E)", "O(VE)"],
          correctAnswer: 2,
          explanation:
            "DFS visits each vertex and edge at most once: O(V + E).",
        },
        {
          id: 4,
          type: "multiple_choice",
          question:
            "DFS timestamps (pre/post numbers) are useful for identifying:",
          options: [
            "Stable matching",
            "Bipartite components",
            "Edge classifications (tree/back/cross/forward)",
            "Minimum spanning trees directly",
          ],
          correctAnswer: 2,
          explanation:
            "DFS discovers and finishes nodes; classifying edges aids many analyses.",
        },
        {
          id: 5,
          type: "multiple_choice",
          question:
            "Which algorithm for strongly connected components is based on DFS?",
          options: ["Dijkstra", "Kruskal", "Kosaraju/Tarjan", "Prim"],
          correctAnswer: 2,
          explanation:
            "Kosaraju and Tarjan algorithms use DFS properties to compute SCCs.",
        },
      ],
    },
    settings: { shuffleOptions: true, allowReview: true },
    tags: [ALG, "graphs", "dfs"],
  },

  // 9) Dijkstra
  {
    slug: "alg-dijkstra-quiz",
    title: "Dijkstra’s Algorithm Quiz",
    description:
      "Validate your understanding of Dijkstra’s PQ-based relaxation for non-negative weights.",
    category: ALG,
    difficulty: 3,
    diamondReward: 50,
    experienceReward: 70,
    estimatedMinutes: 10,
    sortOrder: 9,
    content: {
      timeLimit: 600,
      passingScore: 70,
      questions: [
        {
          id: 1,
          type: "true_false",
          question:
            "Dijkstra’s algorithm assumes there are no negative-weight edges.",
          correctAnswer: true,
          explanation:
            "Negative edges break the correctness of Dijkstra’s greedy choice.",
        },
        {
          id: 2,
          type: "multiple_choice",
          question:
            "Which data structure is typically used to pick the next closest vertex?",
          options: ["Queue", "Stack", "Binary heap (priority queue)", "Deque"],
          correctAnswer: 2,
          explanation:
            "A min-priority queue efficiently retrieves the smallest tentative distance.",
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "Asymptotic complexity with a binary heap is:",
          options: ["O(V + E)", "O(E log V)", "O(V²)", "O(V log V)"],
          correctAnswer: 1,
          explanation:
            "Decrease-key operations dominate; overall O((V + E) log V) ~ O(E log V).",
        },
        {
          id: 4,
          type: "true_false",
          question:
            "Dijkstra computes single-source shortest path distances to all reachable vertices.",
          correctAnswer: true,
          explanation:
            "From a given source, Dijkstra yields minimal distances to all vertices if weights are non-negative.",
        },
        {
          id: 5,
          type: "multiple_choice",
          question:
            "Updating distances to neighbors when a better path is found is called:",
          options: ["Compression", "Relaxation", "Reduction", "Partitioning"],
          correctAnswer: 1,
          explanation:
            "Relaxation updates the best-known distance if a shorter path is discovered.",
        },
      ],
    },
    settings: { shuffleOptions: true, allowReview: true },
    tags: [ALG, "graphs", "shortest-path", "dijkstra"],
  },

  // 10) Dynamic Programming Intro
  {
    slug: "alg-dp-intro-quiz",
    title: "Dynamic Programming (Intro) Quiz",
    description:
      "Check DP essentials: optimal substructure, overlapping subproblems, memoization vs tabulation.",
    category: ALG,
    difficulty: 2,
    diamondReward: 45,
    experienceReward: 65,
    estimatedMinutes: 10,
    sortOrder: 10,
    content: {
      timeLimit: 600,
      passingScore: 70,
      questions: [
        {
          id: 1,
          type: "true_false",
          question:
            "DP problems typically exhibit optimal substructure and overlapping subproblems.",
          correctAnswer: true,
          explanation:
            "These are the hallmark traits enabling memoization/tabulation.",
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "Memoization vs Tabulation: which statement is correct?",
          options: [
            "Memoization builds bottom-up; Tabulation uses recursion",
            "Memoization caches top-down recursion; Tabulation iterates bottom-up",
            "Both require recursion",
            "Both are identical in space needs",
          ],
          correctAnswer: 1,
          explanation:
            "Memoization = top-down with cache; Tabulation = bottom-up filling a table.",
        },
        {
          id: 3,
          type: "multiple_choice",
          question: "Which problem is a classic DP example?",
          options: [
            "Binary Search",
            "Dijkstra Shortest Path",
            "0/1 Knapsack",
            "Quick Sort",
          ],
          correctAnswer: 2,
          explanation:
            "Knapsack (and variants) are canonical DP optimization problems.",
        },
        {
          id: 4,
          type: "multiple_choice",
          question:
            "The naive recursive Fibonacci implementation runs in approximately:",
          options: ["O(n)", "O(n log n)", "O(2^n)", "O(log n)"],
          correctAnswer: 2,
          explanation:
            "Overlapping subproblems cause exponential blowup without caching.",
        },
        {
          id: 5,
          type: "multiple_choice",
          question: "A common first step when tackling a DP problem is to:",
          options: [
            "Pick a sorting algorithm",
            "Define state variables and recurrence relation",
            "Find a median pivot",
            "Apply union-find",
          ],
          correctAnswer: 1,
          explanation:
            "Clearly define state and recurrence; then select memoization or tabulation.",
        },
      ],
    },
    settings: { shuffleOptions: true, allowReview: true },
    tags: [ALG, "dp", "optimization", "memoization", "tabulation"],
  },
];

async function seedAlgorithmQuizzes() {
  console.log("🧪 Seeding Algorithm Quizzes...");

  for (const q of quizzes) {
    const content = JSON.stringify(q.content);
    const settings = q.settings ? JSON.stringify(q.settings) : undefined;
    const tags = q.tags ? JSON.stringify(q.tags) : undefined;

    await prisma.learningActivity
      .upsert({
        where: { slug: q.slug },
        update: {
          title: q.title,
          description: q.description,
          category: q.category,
          difficulty: q.difficulty,
          diamondReward: q.diamondReward,
          experienceReward: q.experienceReward,
          estimatedMinutes: q.estimatedMinutes,
          activityType: "quiz",
          content,
          settings,
          tags,
          sortOrder: q.sortOrder,
          isActive: true,
          isLocked: false,
        },
        create: {
          slug: q.slug,
          title: q.title,
          description: q.description,
          category: q.category,
          difficulty: q.difficulty,
          diamondReward: q.diamondReward,
          experienceReward: q.experienceReward,
          estimatedMinutes: q.estimatedMinutes,
          activityType: "quiz",
          content,
          settings,
          tags,
          sortOrder: q.sortOrder,
          isActive: true,
          isLocked: false,
        },
      })
      .then(() => console.log(`✅ Upserted quiz: ${q.slug} (${q.title})`))
      .catch((err) =>
        console.error(`❌ Failed upserting quiz ${q.slug}:`, err)
      );
  }

  console.log("✅ Algorithm quizzes seeding completed");
}

if (require.main === module) {
  seedAlgorithmQuizzes()
    .catch((e) => {
      console.error("❌ Seed error:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export default seedAlgorithmQuizzes;
