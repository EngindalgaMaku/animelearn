import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * 30 Core "Algorithm Visualization" activities
 * Category: "Algorithms"
 * Notes:
 * - Titles are unique within (title + activityType + category)
 * - Rewards follow recommended heuristic: diamond = difficulty * 10, xp = difficulty * 20 (rounded/tweaked slightly)
 * - Content structure aligns with ACTIVITY_STRUCTURES.md "ALGORITHM_VISUALIZATION"
 */

export const algorithmVisualizationCoreAlgorithmsActivities = [
  // 1) Linear Search
  {
    title: "Linear Search Algorithm Viz",
    description:
      "Step-by-step visualization of linear search scanning elements to find a target",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 1,
    diamondReward: 10,
    experienceReward: 20,
    estimatedMinutes: 8,
    tags: ["search", "linear", "arrays", "basics"],
    content: {
      algorithm: "linear_search",
      description:
        "Scan each element from left to right until target is found or list ends.",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      explanation:
        "Linear search checks every element in the worst case. Best when lists are short or unsorted.",
      initialData: [7, 2, 9, 4, 6, 3],
      steps: [
        {
          id: 1,
          description: "Start at index 0",
          data: [7, 2, 9, 4, 6, 3],
          highlights: [0],
          comparison: ["7 ≠ 4"],
          action:
            "def linear_search(arr, target):\n    for i, v in enumerate(arr):\n        if v == target:\n            return i\n    return -1",
        },
        {
          id: 2,
          description: "Move to next indices",
          data: [7, 2, 9, 4, 6, 3],
          highlights: [1, 2],
          comparison: ["2 ≠ 4", "9 ≠ 4"],
          action: "# keep scanning",
        },
        {
          id: 3,
          description: "Found at index 3",
          data: [7, 2, 9, 4, 6, 3],
          highlights: [3],
          comparison: ["4 == 4 ✓"],
          action: "return 3",
        },
      ],
      code: "def linear_search(arr, target):\n    for i, v in enumerate(arr):\n        if v == target:\n            return i\n    return -1",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Binary Search
  {
    title: "Binary Search Algorithm Viz",
    description:
      "Visualize halving the search space on sorted arrays to find target quickly",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 40,
    estimatedMinutes: 10,
    tags: ["search", "binary", "logarithmic", "sorted"],
    content: {
      algorithm: "binary_search",
      description:
        "Repeatedly check the middle element to halve the search interval.",
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)",
      explanation:
        "Binary search requires sorted input and achieves logarithmic time by discarding half each step.",
      initialData: [1, 3, 5, 7, 9, 11, 13],
      steps: [
        {
          id: 1,
          description: "Initialize left=0, right=6",
          data: [1, 3, 5, 7, 9, 11, 13],
          highlights: [3],
          comparison: ["mid=3 → 7"],
          action:
            "def binary_search(a, t):\n    l, r = 0, len(a)-1\n    while l <= r:\n        m = (l + r) // 2\n        if a[m] == t: return m\n        if a[m] < t: l = m + 1\n        else: r = m - 1\n    return -1",
        },
        {
          id: 2,
          description: "Target 11 > 7; search right half",
          data: [1, 3, 5, 7, 9, 11, 13],
          highlights: [4, 5, 6],
          comparison: ["mid=5 → 11"],
          action: "# found at index 5",
        },
        {
          id: 3,
          description: "Return index 5",
          data: [1, 3, 5, 7, 9, 11, 13],
          highlights: [5],
          comparison: ["11 == 11 ✓"],
          action: "return 5",
        },
      ],
      code: "def binary_search(a, t):\n    l, r = 0, len(a)-1\n    while l <= r:\n        m = (l + r) // 2\n        if a[m] == t:\n            return m\n        if a[m] < t:\n            l = m + 1\n        else:\n            r = m - 1\n    return -1",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3) Selection Sort
  {
    title: "Selection Sort Algorithm Viz",
    description:
      "Visualize selecting the minimum each pass and placing it at the front",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 1,
    diamondReward: 10,
    experienceReward: 20,
    estimatedMinutes: 9,
    tags: ["sorting", "selection", "quadratic"],
    content: {
      algorithm: "selection_sort",
      description:
        "Find the minimum in the unsorted portion and swap to front, repeat.",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      explanation:
        "Simple but inefficient for large n. Always does ~n²/2 comparisons.",
      initialData: [64, 25, 12, 22, 11],
      steps: [
        {
          id: 1,
          description: "Pass 1: find min in [64,25,12,22,11] → 11",
          data: [64, 25, 12, 22, 11],
          highlights: [0, 4],
          action: "swap index 0 and 4",
        },
        {
          id: 2,
          description: "Pass 2: find min in [25,12,22,64] → 12",
          data: [11, 25, 12, 22, 64],
          highlights: [1, 2],
          action: "swap index 1 and 2",
        },
        {
          id: 3,
          description: "Continue until sorted",
          data: [11, 12, 22, 25, 64],
          highlights: [0, 1, 2, 3, 4],
          action: "done",
        },
      ],
      code: "def selection_sort(a):\n    n = len(a)\n    for i in range(n):\n        m = i\n        for j in range(i+1, n):\n            if a[j] < a[m]: m = j\n        a[i], a[m] = a[m], a[i]\n    return a",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Insertion Sort
  {
    title: "Insertion Sort Algorithm Viz",
    description:
      "Step through building a sorted prefix by inserting current key into place",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 1,
    diamondReward: 10,
    experienceReward: 20,
    estimatedMinutes: 9,
    tags: ["sorting", "insertion", "adaptive"],
    content: {
      algorithm: "insertion_sort",
      description:
        "Maintain a sorted left side and insert each new element into correct position.",
      timeComplexity: "O(n²) worst, O(n) best on nearly sorted",
      spaceComplexity: "O(1)",
      explanation:
        "Efficient on small or nearly sorted arrays; often used as a subroutine.",
      initialData: [5, 2, 4, 6, 1, 3],
      steps: [
        {
          id: 1,
          description: "Key=2, shift 5 right",
          data: [5, 2, 4, 6, 1, 3],
          highlights: [0, 1],
          action: "place 2 at index 0",
        },
        {
          id: 2,
          description: "Key=4, insert between 2 and 5",
          data: [2, 5, 4, 6, 1, 3],
          highlights: [1, 2],
          action: "place 4 at index 1",
        },
        {
          id: 3,
          description: "Continue inserting keys",
          data: [1, 2, 3, 4, 5, 6],
          highlights: [0, 1, 2, 3, 4, 5],
          action: "sorted",
        },
      ],
      code: "def insertion_sort(a):\n    for i in range(1, len(a)):\n        key = a[i]\n        j = i - 1\n        while j >= 0 and a[j] > key:\n            a[j+1] = a[j]\n            j -= 1\n        a[j+1] = key\n    return a",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Merge Sort
  {
    title: "Merge Sort Algorithm Viz",
    description:
      "Divide-and-conquer sorting: split, sort halves, and merge in order",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 60,
    estimatedMinutes: 14,
    tags: ["sorting", "merge", "divide-and-conquer", "stable"],
    content: {
      algorithm: "merge_sort",
      description: "Recursively split array and merge sorted halves.",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
      explanation:
        "Stable and predictable O(n log n) time; commonly used baseline comparison.",
      initialData: [38, 27, 43, 3, 9, 82, 10],
      steps: [
        {
          id: 1,
          description: "Split into halves",
          data: [38, 27, 43, 3, 9, 82, 10],
          highlights: [0, 3],
          action: "left=[38,27,43], right=[3,9,82,10]",
        },
        {
          id: 2,
          description: "Recursively sort left and right",
          data: [27, 38, 43, 3, 9, 10, 82],
          highlights: [0, 6],
          action: "merge(sorted_left, sorted_right)",
        },
        {
          id: 3,
          description: "Merge step by step",
          data: [3, 9, 10, 27, 38, 43, 82],
          highlights: [0, 1, 2, 3, 4, 5, 6],
          action: "complete",
        },
      ],
      code: "def merge_sort(a):\n    if len(a) <= 1: return a\n    m = len(a)//2\n    L = merge_sort(a[:m])\n    R = merge_sort(a[m:])\n    return merge(L, R)\n\ndef merge(L, R):\n    i=j=0; out=[]\n    while i<len(L) and j<len(R):\n        if L[i] <= R[j]: out.append(L[i]); i+=1\n        else: out.append(R[j]); j+=1\n    out.extend(L[i:]); out.extend(R[j:])\n    return out",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 5,
  },

  // 6) Quick Sort
  {
    title: "Quick Sort Algorithm Viz",
    description:
      "Partition around a pivot and recursively sort subarrays efficiently",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 60,
    estimatedMinutes: 15,
    tags: ["sorting", "quick-sort", "divide-and-conquer", "in-place"],
    content: {
      algorithm: "quick_sort",
      description: "Choose a pivot, partition into <= and > sets, and recurse.",
      timeComplexity: "Average O(n log n), Worst O(n²)",
      spaceComplexity: "O(log n) recursion",
      explanation:
        "Fast in practice; careful pivot selection avoids worst cases.",
      initialData: [10, 7, 8, 9, 1, 5],
      steps: [
        {
          id: 1,
          description: "Pick pivot (last element 5)",
          data: [10, 7, 8, 9, 1, 5],
          highlights: [5],
          action: "partition around 5",
        },
        {
          id: 2,
          description: "Partition result",
          data: [1, 5, 8, 9, 10, 7],
          highlights: [1],
          action: "pivot placed at correct index",
        },
        {
          id: 3,
          description: "Recurse on left/right subarrays",
          data: [1, 5, 7, 8, 9, 10],
          highlights: [0, 5],
          action: "done",
        },
      ],
      code: "def quick_sort(a, l=0, r=None):\n    if r is None: r = len(a)-1\n    if l < r:\n        p = partition(a, l, r)\n        quick_sort(a, l, p-1)\n        quick_sort(a, p+1, r)\n    return a\n\ndef partition(a, l, r):\n    pivot = a[r]\n    i = l-1\n    for j in range(l, r):\n        if a[j] <= pivot:\n            i += 1; a[i], a[j] = a[j], a[i]\n    a[i+1], a[r] = a[r], a[i+1]\n    return i+1",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 6,
  },

  // 7) Heap Sort
  {
    title: "Heap Sort Algorithm Viz",
    description:
      "Build a heap and repeatedly extract max/min to sort the array",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 60,
    estimatedMinutes: 14,
    tags: ["sorting", "heap", "priority-queue", "in-place"],
    content: {
      algorithm: "heap_sort",
      description:
        "Turn array into a heap, then pop the root to place elements in order.",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(1)",
      explanation:
        "Heaps maintain a partial order for efficient selection of next element.",
      initialData: [4, 10, 3, 5, 1],
      steps: [
        {
          id: 1,
          description: "Heapify array",
          data: [10, 5, 3, 4, 1],
          highlights: [0],
          action: "build max-heap",
        },
        {
          id: 2,
          description: "Extract max and heapify reduced heap",
          data: [5, 4, 3, 1, 10],
          highlights: [4],
          action: "place max at end",
        },
        {
          id: 3,
          description: "Repeat until sorted",
          data: [1, 3, 4, 5, 10],
          highlights: [0, 1, 2, 3, 4],
          action: "sorted",
        },
      ],
      code: "def heap_sort(a):\n    import heapq\n    h = a[:]\n    heapq.heapify(h)\n    out = [heapq.heappop(h) for _ in range(len(h))]\n    return out  # min-heap yields ascending",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 7,
  },

  // 8) Counting Sort
  {
    title: "Counting Sort Algorithm Viz",
    description:
      "Non-comparative stable sort for small integer keys using counts",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 40,
    estimatedMinutes: 12,
    tags: ["sorting", "counting", "stable", "linear"],
    content: {
      algorithm: "counting_sort",
      description:
        "Count occurrences, compute prefix sums, and place elements accordingly.",
      timeComplexity: "O(n + k)",
      spaceComplexity: "O(n + k)",
      explanation:
        "Efficient for integers in a limited range; forms basis of radix sort.",
      initialData: [4, 2, 2, 8, 3, 3, 1],
      steps: [
        {
          id: 1,
          description: "Count frequency of each value",
          data: [0, 1, 2, 2, 1, 0, 0, 0, 1],
          highlights: [1, 2, 3, 8],
          action: "counts[1]=1, counts[2]=2, ...",
        },
        {
          id: 2,
          description: "Compute prefix sums",
          data: [0, 1, 3, 5, 6, 6, 6, 6, 7],
          highlights: [2, 3],
          action: "positions for stable placement",
        },
        {
          id: 3,
          description: "Stable placement into output",
          data: [1, 2, 2, 3, 3, 4, 8],
          highlights: [0, 6],
          action: "sorted",
        },
      ],
      code: "def counting_sort(a):\n    k = max(a) + 1\n    cnt = [0]*k\n    for x in a: cnt[x]+=1\n    for i in range(1, k): cnt[i]+=cnt[i-1]\n    out=[0]*len(a)\n    for x in reversed(a):\n        cnt[x]-=1; out[cnt[x]]=x\n    return out",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 8,
  },

  // 9) Radix Sort
  {
    title: "Radix Sort Algorithm Viz",
    description:
      "Sort integers by processing digits from least significant to most",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 60,
    estimatedMinutes: 14,
    tags: ["sorting", "radix", "digits", "stable"],
    content: {
      algorithm: "radix_sort",
      description:
        "Use a stable digit sort (e.g., counting) per position from LSD to MSD.",
      timeComplexity: "O(d·(n + k))",
      spaceComplexity: "O(n + k)",
      explanation:
        "Great for fixed-length integers; relies on stable per-digit sorting.",
      initialData: [170, 45, 75, 90, 802, 24, 2, 66],
      steps: [
        {
          id: 1,
          description: "Sort by 1s place",
          data: [170, 90, 802, 2, 24, 45, 75, 66],
          highlights: [],
          action: "counting by digit (base 10)",
        },
        {
          id: 2,
          description: "Sort by 10s place",
          data: [802, 2, 24, 45, 66, 170, 75, 90],
          highlights: [],
          action: "stable sort preserves previous order",
        },
        {
          id: 3,
          description: "Sort by 100s place",
          data: [2, 24, 45, 66, 75, 90, 170, 802],
          highlights: [],
          action: "fully sorted",
        },
      ],
      code: "def radix_sort(a):\n    exp = 1\n    m = max(a)\n    while m // exp > 0:\n        a = counting_by_digit(a, exp)\n        exp *= 10\n    return a",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 9,
  },

  // 10) Bucket Sort
  {
    title: "Bucket Sort Algorithm Viz",
    description:
      "Distribute elements into buckets, sort each bucket, and concatenate",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 40,
    estimatedMinutes: 12,
    tags: ["sorting", "bucket", "distribution"],
    content: {
      algorithm: "bucket_sort",
      description:
        "Map values to buckets (ranges), sort buckets individually, then join.",
      timeComplexity: "O(n + k) average",
      spaceComplexity: "O(n + k)",
      explanation:
        "Works well when input is uniformly distributed over a range.",
      initialData: [0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68],
      steps: [
        {
          id: 1,
          description: "Distribute into k buckets by value range",
          data: [
            ["0.12", "0.17", "0.21", "0.23", "0.26"],
            ["0.39"],
            ["0.68", "0.72", "0.78"],
            ["0.94"],
          ],
          highlights: [],
          action: "buckets[i].append(x)",
        },
        {
          id: 2,
          description: "Sort each bucket",
          data: [
            ["0.12", "0.17", "0.21", "0.23", "0.26"],
            ["0.39"],
            ["0.68", "0.72", "0.78"],
            ["0.94"],
          ],
          highlights: [],
          action: "in-bucket sorting (e.g., insertion sort)",
        },
        {
          id: 3,
          description: "Concatenate buckets",
          data: [0.12, 0.17, 0.21, 0.23, 0.26, 0.39, 0.68, 0.72, 0.78, 0.94],
          highlights: [0, 9],
          action: "sorted",
        },
      ],
      code: "def bucket_sort(a):\n    k = 10\n    buckets = [[] for _ in range(k)]\n    for x in a:\n      idx = min(int(x*k), k-1)\n      buckets[idx].append(x)\n    for b in buckets: b.sort()\n    out=[]\n    for b in buckets: out.extend(b)\n    return out",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 10,
  },

  // 11) Breadth-First Search (BFS)
  {
    title: "BFS Graph Traversal Viz",
    description:
      "Level-order graph exploration via queue; shortest paths in unweighted graphs",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 40,
    estimatedMinutes: 12,
    tags: ["graph", "bfs", "queue", "shortest-path"],
    content: {
      algorithm: "bfs_traversal",
      description:
        "Visit neighbors level-by-level using a queue; record distances and parents.",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V)",
      explanation:
        "BFS discovers nodes by increasing distance; ideal for unweighted shortest paths.",
      initialData: {
        nodes: ["A", "B", "C", "D", "E"],
        edges: [
          ["A", "B"],
          ["A", "C"],
          ["B", "D"],
          ["C", "E"],
        ],
      },
      steps: [
        {
          id: 1,
          description: "Enqueue start A",
          data: ["A"],
          highlights: ["A"],
          action: "q=[A]; dist[A]=0",
        },
        {
          id: 2,
          description: "Visit neighbors B, C",
          data: ["B", "C"],
          highlights: ["B", "C"],
          action: "q=[B,C]; dist[B]=1; dist[C]=1",
        },
        {
          id: 3,
          description: "Then D and E",
          data: ["D", "E"],
          highlights: ["D", "E"],
          action: "level 2 discovered",
        },
      ],
      code: "from collections import deque\n\ndef bfs(g, s):\n    q=deque([s]); dist={s:0}\n    while q:\n        u=q.popleft()\n        for v in g[u]:\n            if v not in dist:\n                dist[v]=dist[u]+1\n                q.append(v)\n    return dist",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 11,
  },

  // 12) Depth-First Search (DFS)
  {
    title: "DFS Graph Traversal Viz",
    description:
      "Explore along a branch as deep as possible before backtracking",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 40,
    estimatedMinutes: 12,
    tags: ["graph", "dfs", "stack", "recursion"],
    content: {
      algorithm: "dfs_traversal",
      description: "Use recursion or an explicit stack to explore depth-first.",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V) recursion/stack",
      explanation:
        "Good for connectivity, topological sorts (DAG), and path existence.",
      initialData: {
        nodes: [1, 2, 3, 4, 5],
        edges: [
          [1, 2],
          [1, 3],
          [2, 4],
          [3, 5],
        ],
      },
      steps: [
        {
          id: 1,
          description: "Start at 1",
          data: [1],
          highlights: [1],
          action: "visit 1",
        },
        {
          id: 2,
          description: "Go to 2 then 4",
          data: [2, 4],
          highlights: [2, 4],
          action: "deep branch",
        },
        {
          id: 3,
          description: "Backtrack; explore 3 then 5",
          data: [3, 5],
          highlights: [3, 5],
          action: "complete",
        },
      ],
      code: "def dfs(g, s, vis=None):\n    if vis is None: vis=set()\n    vis.add(s)\n    for v in g[s]:\n        if v not in vis:\n            dfs(g, v, vis)\n    return vis",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 12,
  },

  // 13) Dijkstra's Shortest Paths
  {
    title: "Dijkstra Shortest Path Viz",
    description:
      "Compute shortest paths from a source on non-negative weighted graphs",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 4,
    diamondReward: 40,
    experienceReward: 80,
    estimatedMinutes: 18,
    tags: ["graph", "shortest-path", "dijkstra", "priority-queue"],
    content: {
      algorithm: "dijkstra",
      description:
        "Maintain a min-priority queue of frontier distances; relax edges.",
      timeComplexity: "O((V + E) log V) with heap",
      spaceComplexity: "O(V)",
      explanation:
        "Requires non-negative weights; very common in routing and pathfinding.",
      initialData: {
        nodes: ["A", "B", "C", "D", "E"],
        edges: [
          ["A", "B", 2],
          ["A", "C", 5],
          ["B", "D", 1],
          ["C", "D", 2],
          ["D", "E", 3],
        ],
      },
      steps: [
        {
          id: 1,
          description: "Initialize dist[A]=0; push A",
          data: [],
          highlights: ["A"],
          action: "pq=[(0,A)]",
        },
        {
          id: 2,
          description: "Pop A; relax B(2), C(5)",
          data: [],
          highlights: ["B", "C"],
          action: "update distances",
        },
        {
          id: 3,
          description: "Pop B; relax D(3) → via B",
          data: [],
          highlights: ["D"],
          action: "improve path to D",
        },
      ],
      code: "import heapq\n\ndef dijkstra(g, s):\n    dist={s:0}; pq=[(0,s)]\n    while pq:\n        d,u=heapq.heappop(pq)\n        if d>dist.get(u, float('inf')): continue\n        for v,w in g[u]:\n            nd=d+w\n            if nd<dist.get(v, float('inf')):\n                dist[v]=nd\n                heapq.heappush(pq,(nd,v))\n    return dist",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 13,
  },

  // 14) Bellman-Ford
  {
    title: "Bellman-Ford Shortest Path Viz",
    description:
      "Relax edges V-1 times to handle negative weights and detect cycles",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 4,
    diamondReward: 40,
    experienceReward: 80,
    estimatedMinutes: 18,
    tags: ["graph", "shortest-path", "bellman-ford", "negative-weights"],
    content: {
      algorithm: "bellman_ford",
      description:
        "Iteratively relax all edges; if distances improve on the V-th pass, a negative cycle exists.",
      timeComplexity: "O(V·E)",
      spaceComplexity: "O(V)",
      explanation:
        "Slower than Dijkstra but supports negative edges (not negative cycles).",
      initialData: {
        nodes: ["S", "A", "B", "C"],
        edges: [
          ["S", "A", 4],
          ["S", "B", 5],
          ["A", "C", -3],
          ["B", "C", 2],
        ],
      },
      steps: [
        {
          id: 1,
          description: "Initialize dist[S]=0, others=∞",
          data: [],
          highlights: ["S"],
          action: "first pass",
        },
        {
          id: 2,
          description: "Relax all edges; update A,B,C",
          data: [],
          highlights: ["A", "B", "C"],
          action: "second pass",
        },
        {
          id: 3,
          description: "No changes on extra pass → no negative cycle",
          data: [],
          highlights: [],
          action: "done",
        },
      ],
      code: "def bellman_ford(V, E, s):\n    dist={v:float('inf') for v in V}; dist[s]=0\n    for _ in range(len(V)-1):\n        updated=False\n        for u,v,w in E:\n            if dist[u]+w < dist[v]:\n                dist[v]=dist[u]+w; updated=True\n        if not updated: break\n    # detect cycle\n    for u,v,w in E:\n        if dist[u]+w < dist[v]:\n            raise ValueError('Negative cycle')\n    return dist",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 14,
  },

  // 15) Floyd–Warshall
  {
    title: "Floyd–Warshall All-Pairs Viz",
    description:
      "Dynamic programming over intermediate nodes to compute all-pairs shortest paths",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 5,
    diamondReward: 50,
    experienceReward: 100,
    estimatedMinutes: 20,
    tags: ["graph", "all-pairs", "floyd-warshall", "dp"],
    content: {
      algorithm: "floyd_warshall",
      description:
        "For each k, try improving dist[i][j] via node k as an intermediate.",
      timeComplexity: "O(V³)",
      spaceComplexity: "O(V²)",
      explanation:
        "Simple and powerful for dense graphs; handles negative edges (not cycles).",
      initialData: {
        matrix: [
          [0, 3, Infinity, 7],
          [8, 0, 2, Infinity],
          [5, Infinity, 0, 1],
          [2, Infinity, Infinity, 0],
        ],
      },
      steps: [
        {
          id: 1,
          description: "k=0: allow node 0 as intermediate",
          data: [],
          highlights: [0],
          action: "update dist",
        },
        {
          id: 2,
          description: "k=1: allow node 1",
          data: [],
          highlights: [1],
          action: "update dist",
        },
        {
          id: 3,
          description: "k=2,3 ... compute final matrix",
          data: [],
          highlights: [2, 3],
          action: "complete",
        },
      ],
      code: "def floyd_warshall(dist):\n    n=len(dist)\n    for k in range(n):\n        for i in range(n):\n            for j in range(n):\n                if dist[i][k]+dist[k][j] < dist[i][j]:\n                    dist[i][j]=dist[i][k]+dist[k][j]\n    return dist",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 15,
  },

  // 16) Kruskal's MST
  {
    title: "Kruskal MST Viz (Disjoint Set)",
    description:
      "Sort edges by weight; add if no cycle using Union-Find to build MST",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 4,
    diamondReward: 40,
    experienceReward: 80,
    estimatedMinutes: 18,
    tags: ["graph", "mst", "kruskal", "union-find"],
    content: {
      algorithm: "kruskal_mst",
      description:
        "Add smallest edge that doesn't form a cycle; stop when V-1 edges chosen.",
      timeComplexity: "O(E log E)",
      spaceComplexity: "O(V)",
      explanation:
        "Greedy MST with cycle checks via Disjoint Set (Union-Find).",
      initialData: {
        edges: [
          ["A", "B", 1],
          ["B", "C", 4],
          ["A", "C", 3],
          ["C", "D", 2],
          ["B", "D", 5],
        ],
      },
      steps: [
        {
          id: 1,
          description: "Sort edges by weight",
          data: [],
          highlights: [],
          action: "[(A,B,1),(C,D,2),(A,C,3)...]",
        },
        {
          id: 2,
          description: "Pick (A,B), (C,D), (A,C)",
          data: [],
          highlights: ["A-B", "C-D", "A-C"],
          action: "no cycles",
        },
        {
          id: 3,
          description: "Stop at V-1 edges → MST complete",
          data: [],
          highlights: [],
          action: "MST built",
        },
      ],
      code: "def kruskal(V, E):\n    parent={v:v for v in V}\n    rank={v:0 for v in V}\n    def find(x):\n        if parent[x]!=x:\n            parent[x]=find(parent[x])\n        return parent[x]\n    def union(a,b):\n        ra,rb=find(a),find(b)\n        if ra==rb: return False\n        if rank[ra]<rank[rb]: parent[ra]=rb\n        elif rank[ra]>rank[rb]: parent[rb]=ra\n        else: parent[rb]=ra; rank[ra]+=1\n        return True\n    E=sorted(E, key=lambda e:e[2])\n    mst=[]\n    for u,v,w in E:\n        if union(u,v): mst.append((u,v,w))\n    return mst",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 16,
  },

  // 17) Prim's MST
  {
    title: "Prim MST Viz (Growing Frontier)",
    description:
      "Grow MST by adding the lowest-weight edge crossing the cut (frontier)",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 4,
    diamondReward: 40,
    experienceReward: 80,
    estimatedMinutes: 18,
    tags: ["graph", "mst", "prim", "greedy"],
    content: {
      algorithm: "prim_mst",
      description:
        "Start at any node; repeatedly add cheapest edge connecting tree to a new vertex.",
      timeComplexity: "O(E log V) with heap",
      spaceComplexity: "O(V)",
      explanation:
        "Greedy approach maintaining a cut and selecting minimum crossing edge.",
      initialData: {
        nodes: ["A", "B", "C", "D"],
        edges: [
          ["A", "B", 1],
          ["A", "C", 3],
          ["B", "C", 2],
          ["B", "D", 4],
          ["C", "D", 5],
        ],
      },
      steps: [
        {
          id: 1,
          description: "Start at A; add (A,B) weight 1",
          data: [],
          highlights: ["A-B"],
          action: "tree={A,B}",
        },
        {
          id: 2,
          description: "Next cheapest crossing: (B,C) weight 2",
          data: [],
          highlights: ["B-C"],
          action: "tree={A,B,C}",
        },
        {
          id: 3,
          description: "Add (B,D) weight 4 → done",
          data: [],
          highlights: ["B-D"],
          action: "tree={A,B,C,D}",
        },
      ],
      code: "import heapq\n\ndef prim(g, s):\n    vis={s}; pq=[]\n    for v,w in g[s]: heapq.heappush(pq,(w,s,v))\n    mst=[]\n    while pq:\n        w,u,v=heapq.heappop(pq)\n        if v in vis: continue\n        vis.add(v); mst.append((u,v,w))\n        for x,w2 in g[v]:\n            if x not in vis: heapq.heappush(pq,(w2,v,x))\n    return mst",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 17,
  },

  // 18) Topological Sort (Kahn)
  {
    title: "Topological Sort Viz (Kahn's Algorithm)",
    description:
      "Order DAG nodes with zero in-degree queue removing edges iteratively",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 60,
    estimatedMinutes: 14,
    tags: ["graph", "topological-sort", "dag", "kahn"],
    content: {
      algorithm: "topological_sort_kahn",
      description:
        "Maintain queue of in-degree 0 nodes; remove and reduce neighbors.",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V)",
      explanation:
        "Only works on DAGs; cycles will prevent ordering (queue empties early).",
      initialData: {
        edges: [
          ["A", "C"],
          ["B", "C"],
          ["C", "D"],
        ],
      },
      steps: [
        {
          id: 1,
          description: "Zero in-degree: A, B → output A",
          data: [],
          highlights: ["A", "B"],
          action: "remove A",
        },
        {
          id: 2,
          description: "Reduce in-degree of C; still B in queue",
          data: [],
          highlights: ["B", "C"],
          action: "output B",
        },
        {
          id: 3,
          description: "C in-degree becomes 0 → output C, then D",
          data: [],
          highlights: ["C", "D"],
          action: "done",
        },
      ],
      code: "from collections import deque\n\ndef topo_kahn(V, E):\n    indeg={v:0 for v in V}\n    g={v:[] for v in V}\n    for u,v in E: g[u].append(v); indeg[v]+=1\n    q=deque([v for v in V if indeg[v]==0])\n    out=[]\n    while q:\n        u=q.popleft(); out.append(u)\n        for v in g[u]:\n            indeg[v]-=1\n            if indeg[v]==0: q.append(v)\n    if len(out)!=len(V): raise ValueError('Cycle')\n    return out",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 18,
  },

  // 19) Disjoint Set Union (Union-Find)
  {
    title: "Union-Find (Disjoint Set) Viz",
    description:
      "Union by rank and path compression to manage dynamic connectivity",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 60,
    estimatedMinutes: 14,
    tags: ["union-find", "dsu", "disjoint-set", "connectivity"],
    content: {
      algorithm: "disjoint_set_union",
      description:
        "Support find and union efficiently with near-constant amortized time.",
      timeComplexity: "Amortized ~O(α(n)) per op",
      spaceComplexity: "O(n)",
      explanation:
        "Path compression flattens trees; union by rank/size keeps them shallow.",
      initialData: { sets: [[1], [2], [3], [4], [5]] },
      steps: [
        {
          id: 1,
          description: "Union(1,2) → merge trees",
          data: [],
          highlights: [1, 2],
          action: "rank update",
        },
        {
          id: 2,
          description: "Union(3,4) then Union(2,3)",
          data: [],
          highlights: [2, 3, 4],
          action: "bigger set",
        },
        {
          id: 3,
          description: "Find(4) compresses path",
          data: [],
          highlights: [4],
          action: "parent shortcuts",
        },
      ],
      code: "def make_set(n):\n    parent=list(range(n))\n    rank=[0]*n\n    def find(x):\n        if parent[x]!=x:\n            parent[x]=find(parent[x])\n        return parent[x]\n    def union(a,b):\n        ra,rb=find(a),find(b)\n        if ra==rb: return False\n        if rank[ra]<rank[rb]: parent[ra]=rb\n        elif rank[ra]>rank[rb]: parent[rb]=ra\n        else: parent[rb]=ra; rank[ra]+=1\n        return True\n    return find, union",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 19,
  },

  // 20) KMP String Matching
  {
    title: "KMP String Matching Viz",
    description:
      "Use LPS (prefix-function) to skip redundant comparisons efficiently",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 60,
    estimatedMinutes: 16,
    tags: ["strings", "kmp", "pattern-matching", "prefix-function"],
    content: {
      algorithm: "kmp_search",
      description:
        "Precompute longest proper prefix that is also suffix (LPS) to shift pattern.",
      timeComplexity: "O(n + m)",
      spaceComplexity: "O(m)",
      explanation:
        "Avoids re-checking characters by leveraging pattern structure.",
      initialData: { text: "ababcabcabababd", pattern: "ababd" },
      steps: [
        {
          id: 1,
          description: "Build LPS for 'ababd' → [0,0,1,2,0]",
          data: [0, 0, 1, 2, 0],
          highlights: [],
          action: "preprocess",
        },
        {
          id: 2,
          description: "Scan text with pattern and LPS jumps",
          data: [],
          highlights: [],
          action: "skip mismatches",
        },
        {
          id: 3,
          description: "Match ends at index 15-1=14 → start=10",
          data: [],
          highlights: [10],
          action: "found",
        },
      ],
      code: "def kmp(t, p):\n    def lps(s):\n        l=[0]*len(s); i=1; len0=0\n        while i<len(s):\n            if s[i]==s[len0]: len0+=1; l[i]=len0; i+=1\n            elif len0: len0=l[len0-1]\n            else: l[i]=0; i+=1\n        return l\n    L=lps(p)\n    i=j=0; res=[]\n    while i<len(t):\n        if t[i]==p[j]: i+=1; j+=1\n        if j==len(p): res.append(i-j); j=L[j-1]\n        elif i<len(t) and t[i]!=p[j]:\n            j=L[j-1] if j else 0; i += 0 if j else 1\n    return res",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 20,
  },

  // 21) Rabin–Karp
  {
    title: "Rabin–Karp Rolling Hash Viz",
    description:
      "Use rolling hashes to compare pattern and substring fingerprints",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 60,
    estimatedMinutes: 15,
    tags: ["strings", "rabin-karp", "rolling-hash"],
    content: {
      algorithm: "rabin_karp",
      description:
        "Compute hash of pattern and rolling hash over text; verify on hash hits.",
      timeComplexity: "Average O(n + m), Worst O(nm)",
      spaceComplexity: "O(1)",
      explanation:
        "Rolling hash allows O(1) window updates; beware collisions.",
      initialData: { text: "GEEKS FOR GEEKS", pattern: "GEEK" },
      steps: [
        {
          id: 1,
          description: "Hash pattern and first window",
          data: [],
          highlights: [],
          action: "compare hashes",
        },
        {
          id: 2,
          description: "Slide window; update hash",
          data: [],
          highlights: [],
          action: "rolling step",
        },
        {
          id: 3,
          description: "On hash match, verify characters",
          data: [],
          highlights: [],
          action: "record match",
        },
      ],
      code: "def rabin_karp(t, p, base=256, mod=10**9+7):\n    n,m=len(t),len(p)\n    if m>n: return []\n    h=pow(base,m-1,mod)\n    hp=0; ht=0\n    for i in range(m):\n        hp=(hp*base+ord(p[i]))%mod\n        ht=(ht*base+ord(t[i]))%mod\n    res=[]\n    for i in range(n-m+1):\n        if hp==ht and t[i:i+m]==p: res.append(i)\n        if i<n-m:\n            ht=( (ht-ord(t[i])*h)*base + ord(t[i+m]) )%mod\n            if ht<0: ht+=mod\n    return res",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 21,
  },

  // 22) Trie (Prefix Tree)
  {
    title: "Trie (Prefix Tree) Operations Viz",
    description:
      "Insert, search, and prefix matching with a character tree structure",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 60,
    estimatedMinutes: 14,
    tags: ["trie", "prefix", "strings", "data-structure"],
    content: {
      algorithm: "trie_operations",
      description:
        "Each node stores children by character; paths form words/prefixes.",
      timeComplexity: "O(L) per op where L is key length",
      spaceComplexity: "O(total characters)",
      explanation:
        "Excellent for autocomplete, dictionaries, and prefix queries.",
      initialData: ["cat", "car", "dog", "door"],
      steps: [
        {
          id: 1,
          description: "Insert 'car' path c→a→r",
          data: [],
          highlights: ["c", "a", "r"],
          action: "mark end",
        },
        {
          id: 2,
          description: "Insert 'cat' shares c→a; new 't'",
          data: [],
          highlights: ["t"],
          action: "branching",
        },
        {
          id: 3,
          description: "Search prefix 'do' finds subtree",
          data: [],
          highlights: ["d", "o"],
          action: "prefix match",
        },
      ],
      code: "class Trie:\n    def __init__(self): self.ch={}, self.end=False\n\ndef insert(root,w):\n    cur=root\n    for ch in w:\n        if ch not in cur.ch: cur.ch[ch]=Trie()\n        cur=cur.ch[ch]\n    cur.end=True\n\ndef search(root,w):\n    cur=root\n    for ch in w:\n        if ch not in cur.ch: return False\n        cur=cur.ch[ch]\n    return cur.end",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 22,
  },

  // 23) BST Insert/Search/Delete
  {
    title: "BST Operations Viz (Insert/Search/Delete)",
    description:
      "Binary Search Tree operations with rotations-free standard BST",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 60,
    estimatedMinutes: 15,
    tags: ["bst", "trees", "insert", "delete", "search"],
    content: {
      algorithm: "bst_ops",
      description:
        "Maintain BST property: left < node < right; delete uses successor/predecessor.",
      timeComplexity: "Average O(log n), Worst O(n)",
      spaceComplexity: "O(h)",
      explanation: "Performance depends on balance; skewed trees degrade.",
      initialData: [5, 3, 7, 2, 4, 6, 8],
      steps: [
        {
          id: 1,
          description: "Insert 4 under 5→3",
          data: [],
          highlights: [5, 3, 4],
          action: "place at leaf",
        },
        {
          id: 2,
          description: "Search 6 via 5→7",
          data: [],
          highlights: [5, 7, 6],
          action: "found",
        },
        {
          id: 3,
          description: "Delete 3: has two children; use inorder successor (4)",
          data: [],
          highlights: [3, 4],
          action: "replace then delete leaf",
        },
      ],
      code: "class Node:\n    def __init__(self,k): self.k=k; self.l=None; self.r=None\n\ndef insert(t,x):\n    if not t: return Node(x)\n    if x<t.k: t.l=insert(t.l,x)\n    elif x>t.k: t.r=insert(t.r,x)\n    return t\n\ndef search(t,x):\n    if not t or t.k==x: return t\n    return search(t.l,x) if x<t.k else search(t.r,x)",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 23,
  },

  // 24) AVL Tree Rotations
  {
    title: "AVL Balancing Rotations Viz",
    description:
      "Self-balancing BST with LL, RR, LR, and RL rotations for height-balance",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 5,
    diamondReward: 50,
    experienceReward: 100,
    estimatedMinutes: 20,
    tags: ["avl", "balanced-bst", "rotations"],
    content: {
      algorithm: "avl_rotations",
      description:
        "Track balance factors and perform rotations to keep O(log n) height.",
      timeComplexity: "O(log n) per op",
      spaceComplexity: "O(1) extra",
      explanation:
        "AVL maintains strict balance; rotations ensure performance.",
      initialData: [30, 20, 40, 10, 25, 50, 5],
      steps: [
        {
          id: 1,
          description: "Insert 5 causes LL rotation at 20",
          data: [],
          highlights: [20],
          action: "rotate right",
        },
        {
          id: 2,
          description: "Insert 25 ok; ensure balances updated",
          data: [],
          highlights: [25],
          action: "BF in [-1,0,1]",
        },
        {
          id: 3,
          description: "General LR/RL rotation demo",
          data: [],
          highlights: [],
          action: "double rotation",
        },
      ],
      code: "# Pseudocode: AVL insert with rotations\n# compute balance, if >1 or <-1 do LL/RR/LR/RL rotation",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 24,
  },

  // 25) Hash Table Operations
  {
    title: "Hash Table Ops & Collisions Viz",
    description:
      "Visualize hashing into buckets, collision handling, and resizing",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 40,
    estimatedMinutes: 12,
    tags: ["hash-table", "collision", "chaining", "resize"],
    content: {
      algorithm: "hash_table_ops",
      description:
        "Map keys to buckets; handle collisions via chaining or probing.",
      timeComplexity: "O(1) average for insert/lookup",
      spaceComplexity: "O(n)",
      explanation: "Good hash functions and resizing keep load factor low.",
      initialData: { buckets: 8, keys: ["Alice", "Bob", "Charlie"] },
      steps: [
        {
          id: 1,
          description: "Insert 'Alice' → bucket 2",
          data: [],
          highlights: [2],
          action: "no collision",
        },
        {
          id: 2,
          description: "Insert 'Charlie' collides → chaining",
          data: [],
          highlights: [2],
          action: "append to list",
        },
        {
          id: 3,
          description: "Resize when load high",
          data: [],
          highlights: [],
          action: "rehash to 16",
        },
      ],
      code: "# Python dict uses hash table with open addressing and other optimizations (implementation-specific)\n# Visualization shows conceptual chaining.",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 25,
  },

  // 26) Greedy Activity Selection
  {
    title: "Greedy Activity Selection Viz",
    description:
      "Pick maximum non-overlapping intervals by earliest finishing time",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 60,
    estimatedMinutes: 14,
    tags: ["greedy", "interval-scheduling", "optimization"],
    content: {
      algorithm: "activity_selection",
      description:
        "Sort by finish time, then greedily take first compatible activity.",
      timeComplexity: "O(n log n) for sort",
      spaceComplexity: "O(1)",
      explanation: "Greedy choice yields optimal solution for this problem.",
      initialData: [
        { s: 1, f: 3 },
        { s: 2, f: 5 },
        { s: 4, f: 7 },
        { s: 1, f: 8 },
        { s: 5, f: 9 },
      ],
      steps: [
        {
          id: 1,
          description: "Sort by finish time: (1,3),(2,5),(4,7),(5,9),(1,8)",
          data: [],
          highlights: [],
          action: "order by f",
        },
        {
          id: 2,
          description: "Pick (1,3); next compatible is (4,7)",
          data: [],
          highlights: [],
          action: "non-overlap",
        },
        {
          id: 3,
          description: "Then (5,9) overlaps (4,7) → skip → done",
          data: [],
          highlights: [],
          action: "selected {(1,3),(4,7)}",
        },
      ],
      code: "def select_activities(acts):\n    acts=sorted(acts, key=lambda x:x['f'])\n    res=[]; last_end=-float('inf')\n    for a in acts:\n        if a['s'] >= last_end:\n            res.append(a); last_end=a['f']\n    return res",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 26,
  },

  // 27) 0/1 Knapsack (DP)
  {
    title: "0/1 Knapsack DP Viz",
    description:
      "Dynamic programming table to maximize value under weight capacity",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 4,
    diamondReward: 40,
    experienceReward: 80,
    estimatedMinutes: 18,
    tags: ["dp", "knapsack", "optimization", "table"],
    content: {
      algorithm: "knapsack_01",
      description:
        "DP[i][w] is best value using first i items with capacity w.",
      timeComplexity: "O(n·W)",
      spaceComplexity: "O(n·W) or O(W)",
      explanation: "Classic DP that trades time/space for optimality.",
      initialData: { weights: [2, 3, 4, 5], values: [3, 4, 5, 6], capacity: 5 },
      steps: [
        {
          id: 1,
          description: "Initialize DP row for i=0 as zeros",
          data: [],
          highlights: [],
          action: "base case",
        },
        {
          id: 2,
          description: "Fill for items considering take/skip",
          data: [],
          highlights: [],
          action: "transition",
        },
        {
          id: 3,
          description: "Backtrack choices to recover items",
          data: [],
          highlights: [],
          action: "solution set",
        },
      ],
      code: "def knapsack(W, wt, val):\n    n=len(wt)\n    dp=[[0]*(W+1) for _ in range(n+1)]\n    for i in range(1, n+1):\n        for w in range(W+1):\n            dp[i][w]=dp[i-1][w]\n            if wt[i-1] <= w:\n                dp[i][w]=max(dp[i][w], val[i-1]+dp[i-1][w-wt[i-1]])\n    return dp[n][W]",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 27,
  },

  // 28) Coin Change (Min Coins) DP
  {
    title: "Coin Change (Min Coins) DP Viz",
    description:
      "Compute minimum coins for amount using DP; also count ways variant",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 4,
    diamondReward: 40,
    experienceReward: 80,
    estimatedMinutes: 16,
    tags: ["dp", "coin-change", "bottom-up"],
    content: {
      algorithm: "coin_change_min",
      description: "dp[x] = 1 + min(dp[x - coin]) for all coins ≤ x; dp[0]=0.",
      timeComplexity: "O(n·amount)",
      spaceComplexity: "O(amount)",
      explanation: "Straightforward DP that builds answers up to target.",
      initialData: { coins: [1, 3, 4], amount: 6 },
      steps: [
        {
          id: 1,
          description: "Initialize dp[0]=0; others=∞",
          data: [],
          highlights: [0],
          action: "base",
        },
        {
          id: 2,
          description: "Fill dp[1..6] using transitions",
          data: [],
          highlights: [],
          action: "consider coins",
        },
        {
          id: 3,
          description: "Answer dp[6]=2 (3+3 or 4+1+1)",
          data: [],
          highlights: [6],
          action: "done",
        },
      ],
      code: "def min_coins(coins, A):\n    dp=[float('inf')]*(A+1); dp[0]=0\n    for x in range(1, A+1):\n        for c in coins:\n            if c<=x: dp[x]=min(dp[x], 1+dp[x-c])\n    return dp[A] if dp[A]!=float('inf') else -1",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 28,
  },

  // 29) Longest Common Subsequence (LCS)
  {
    title: "LCS (Longest Common Subsequence) DP Viz",
    description:
      "Classic DP over two strings building a 2D table of best subsequence length",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 4,
    diamondReward: 40,
    experienceReward: 80,
    estimatedMinutes: 18,
    tags: ["dp", "lcs", "strings", "2d-table"],
    content: {
      algorithm: "lcs_dp",
      description:
        "dp[i][j] = 1 + dp[i-1][j-1] if match else max(dp[i-1][j], dp[i][j-1]).",
      timeComplexity: "O(n·m)",
      spaceComplexity: "O(n·m)",
      explanation: "Reconstruct sequence by backtracking arrows in the table.",
      initialData: { a: "ABCBDAB", b: "BDCABA" },
      steps: [
        {
          id: 1,
          description: "Initialize first row/col to 0",
          data: [],
          highlights: [],
          action: "base",
        },
        {
          id: 2,
          description: "Fill table with transitions",
          data: [],
          highlights: [],
          action: "matches/choices",
        },
        {
          id: 3,
          description: "Backtrack to get LCS (e.g., BCBA or BDAB length 4)",
          data: [],
          highlights: [],
          action: "reconstruct",
        },
      ],
      code: "def lcs(a,b):\n    n,m=len(a),len(b)\n    dp=[[0]*(m+1) for _ in range(n+1)]\n    for i in range(1,n+1):\n        for j in range(1,m+1):\n            if a[i-1]==b[j-1]: dp[i][j]=1+dp[i-1][j-1]\n            else: dp[i][j]=max(dp[i-1][j], dp[i][j-1])\n    return dp[n][m]",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 29,
  },

  // 30) Longest Increasing Subsequence (LIS)
  {
    title: "LIS (Longest Increasing Subsequence) Viz",
    description:
      "Visualize patience sorting approach with tails array and binary search",
    activityType: "algorithm_visualization",
    category: "Algorithms",
    difficulty: 4,
    diamondReward: 40,
    experienceReward: 80,
    estimatedMinutes: 16,
    tags: ["dp", "lis", "binary-search", "patience-sorting"],
    content: {
      algorithm: "lis_binary_search",
      description:
        "Maintain tails[k] = minimum possible tail of an increasing subsequence of length k+1.",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
      explanation:
        "Binary search position for each element in tails; length of tails is LIS length.",
      initialData: [10, 9, 2, 5, 3, 7, 101, 18],
      steps: [
        {
          id: 1,
          description: "Start tails=[]; place 10 → [10]",
          data: [10],
          highlights: [0],
          action: "new pile",
        },
        {
          id: 2,
          description: "Place 9 → replace 10 → [9], place 2 → [2]",
          data: [2],
          highlights: [0],
          action: "lower tails",
        },
        {
          id: 3,
          description:
            "Extend with 5,7 → [2,5,7]; 101 extends → [2,5,7,101]; 18 replaces 101 → [2,5,7,18]",
          data: [2, 5, 7, 18],
          highlights: [3],
          action: "LIS length=4",
        },
      ],
      code: "import bisect\n\ndef lis(a):\n    tails=[]\n    for x in a:\n        i=bisect.bisect_left(tails,x)\n        if i==len(tails): tails.append(x)\n        else: tails[i]=x\n    return len(tails)",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 30,
  },
];

export async function seedAlgorithmVisualizationCoreAlgorithmsActivities() {
  await seedActivitiesWithDuplicateCheck(
    algorithmVisualizationCoreAlgorithmsActivities,
    "Algorithm Visualization Core Algorithms"
  );
}

// Execute if run directly
if (require.main === module) {
  seedAlgorithmVisualizationCoreAlgorithmsActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Algorithm Visualization Core Algorithms:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
