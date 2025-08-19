import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type LessonSeed = {
  slug: string;
  title: string;
  description: string;
  category?: string;
  difficulty?: number; // 1=beginner, 2=intermediate, 3=advanced
  estimatedMinutes?: number;
  diamondReward?: number;
  experienceReward?: number;
  sortOrder: number;
  sections: {
    introduction: string;
    syntax: string;
    examples: string;
  };
};

const ALG = "Algorithms";

/**
 * 10 premium-quality Algorithm lessons, organized as two batches of five:
 * Batch A - Sorting Essentials (1..5)
 * Batch B - Core CS Algorithms (6..10)
 */
const lessons: LessonSeed[] = [
  // Batch A: Sorting Essentials
  {
    slug: "alg-bubble-sort",
    title: "Bubble Sort: Step-by-Step Foundation",
    description:
      "Learn the fundamentals of sorting through Bubble Sort, an intuitive algorithm to understand comparisons, swaps, and passes.",
    category: ALG,
    difficulty: 1,
    estimatedMinutes: 18,
    diamondReward: 20,
    experienceReward: 25,
    sortOrder: 1,
    sections: {
      introduction: `# 📊 Bubble Sort
Bubble Sort is a simple comparison-based algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they're in the wrong order.
      
- Best for learning the idea of sorting
- Easy to visualize
- Inefficient for large inputs (O(n²))`,
      syntax: `## Key Idea
1. Repeat for n-1 passes:
2. Compare adjacent items
3. Swap if left > right
4. After each pass, largest element "bubbles" to the end

### Complexity
- Time: O(n²) worst/average, O(n) best (already sorted with early stop)
- Space: O(1) in-place
- Stable: Yes`,
      examples: `### Example (Python)
\`\`\`python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False  # optimization: stop early if no swaps
        for j in range(0, n - i - 1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr

print(bubble_sort([64, 34, 25, 12, 22, 11, 90]))
\`\`\`

### When to use
- Teaching/learning basics
- Small, almost-sorted arrays (with early stop)`,
    },
  },
  {
    slug: "alg-selection-sort",
    title: "Selection Sort: Finding the Minimum",
    description:
      "Understand selection-based sorting: repeatedly selecting the minimum element and placing it at the front.",
    category: ALG,
    difficulty: 1,
    estimatedMinutes: 16,
    diamondReward: 20,
    experienceReward: 25,
    sortOrder: 2,
    sections: {
      introduction: `# 🔎 Selection Sort
Selection Sort repeatedly selects the minimum element from the unsorted portion and places it at the beginning.`,
      syntax: `## Key Idea
- Maintain a "sorted" prefix
- Find index of min in the unsorted suffix
- Swap into the current position

### Complexity
- Time: O(n²) regardless of order
- Space: O(1) in-place
- Stable: No (unless careful swapping)`,
      examples: `### Example (Python)
\`\`\`python
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        # swap minimum into position i
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

print(selection_sort([64, 25, 12, 22, 11]))
\`\`\`

### When to use
- Tight memory constraints
- Simple deterministic behavior`,
    },
  },
  {
    slug: "alg-insertion-sort",
    title: "Insertion Sort: Building a Sorted Hand",
    description:
      "Insert elements one-by-one into the correct position — efficient for small or nearly-sorted datasets.",
    category: ALG,
    difficulty: 1,
    estimatedMinutes: 16,
    diamondReward: 20,
    experienceReward: 25,
    sortOrder: 3,
    sections: {
      introduction: `# 🃏 Insertion Sort
Insertion Sort builds the final sorted array one item at a time, like sorting cards in your hand.`,
      syntax: `## Key Idea
- Assume first element is sorted
- For each element, shift larger elements right
- Insert current element into the correct position

### Complexity
- Time: O(n²) worst/average, O(n) best (nearly sorted)
- Space: O(1)
- Stable: Yes`,
      examples: `### Example (Python)
\`\`\`python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        # Shift elements greater than key
        while j >= 0 and arr[j] > key:
            arr[j+1] = arr[j]
            j -= 1
        # Insert key
        arr[j+1] = key
    return arr

print(insertion_sort([12, 11, 13, 5, 6]))
\`\`\`

### When to use
- Online/streaming insertion
- Small or nearly sorted inputs`,
    },
  },
  {
    slug: "alg-merge-sort",
    title: "Merge Sort: Divide & Conquer Reliability",
    description:
      "Stable O(n log n) sorting via divide-and-conquer; great for large datasets and linked lists.",
    category: ALG,
    difficulty: 2,
    estimatedMinutes: 22,
    diamondReward: 30,
    experienceReward: 35,
    sortOrder: 4,
    sections: {
      introduction: `# 🧩 Merge Sort
Split the array, sort halves recursively, then merge the sorted halves.`,
      syntax: `## Key Idea
- Recursively split list in halves
- Sort each half
- Merge two sorted lists in linear time

### Complexity
- Time: O(n log n) always
- Space: O(n) for merge buffers
- Stable: Yes`,
      examples: `### Example (Python)
\`\`\`python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr)//2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return _merge(left, right)

def _merge(a, b):
    i = j = 0
    out = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i]); i += 1
        else:
            out.append(b[j]); j += 1
    out.extend(a[i:]); out.extend(b[j:])
    return out

print(merge_sort([38,27,43,3,9,82,10]))
\`\`\`

### When to use
- Large arrays needing stability
- External sorting / linked lists`,
    },
  },
  {
    slug: "alg-quick-sort",
    title: "Quick Sort: Practical Speed with Partitioning",
    description:
      "Fast average-case sorting using partitions around a pivot; foundational to many real-world sort implementations.",
    category: ALG,
    difficulty: 2,
    estimatedMinutes: 22,
    diamondReward: 30,
    experienceReward: 35,
    sortOrder: 5,
    sections: {
      introduction: `# ⚡ Quick Sort
Pick a pivot, partition elements around it, and recursively sort subarrays.`,
      syntax: `## Key Idea
- Choose a pivot
- Partition into <= pivot and > pivot
- Recursively sort partitions

### Complexity
- Time: Average O(n log n), Worst O(n²) (bad pivot choices)
- Space: O(log n) (recursion)
- Stable: No (typical partitioning)`,
      examples: `### Example (Python)
\`\`\`python
def quick_sort(arr, lo=0, hi=None):
    if hi is None: hi = len(arr)-1
    if lo < hi:
        p = _partition(arr, lo, hi)
        quick_sort(arr, lo, p-1)
        quick_sort(arr, p+1, hi)
    return arr

def _partition(arr, lo, hi):
    pivot = arr[hi]
    i = lo - 1
    for j in range(lo, hi):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[hi] = arr[hi], arr[i+1]
    return i+1

print(quick_sort([10, 7, 8, 9, 1, 5]))
\`\`\`

### When to use
- General-purpose in-memory sorting
- With good pivot selection (median-of-three, random)`,
    },
  },

  // Batch B: Core CS Algorithms
  {
    slug: "alg-binary-search",
    title: "Binary Search: Logarithmic Lookup",
    description:
      "Master the classic O(log n) search algorithm on sorted arrays, iteratively and recursively.",
    category: ALG,
    difficulty: 1,
    estimatedMinutes: 15,
    diamondReward: 25,
    experienceReward: 30,
    sortOrder: 6,
    sections: {
      introduction: `# 🔍 Binary Search
Binary Search halves the search space in each step. Works only on sorted arrays.`,
      syntax: `## Key Idea
- Maintain left/right bounds
- Check middle, discard half accordingly
- Stop when found or bounds cross

### Complexity
- Time: O(log n)
- Space: O(1) iterative, O(log n) recursive`,
      examples: `### Example (Python)
\`\`\`python
def binary_search(arr, target):
    lo, hi = 0, len(arr)-1
    while lo <= hi:
        mid = (lo + hi)//2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

print(binary_search([1,3,5,7,9,11], 7))
\`\`\`

### Variants
- Lower bound / upper bound
- First/last occurrence (handling duplicates)`,
    },
  },
  {
    slug: "alg-bfs",
    title: "Breadth-First Search (BFS): Level-Order Traversal",
    description:
      "Traverse graphs level-by-level to find the shortest path in unweighted graphs and explore connectivity.",
    category: ALG,
    difficulty: 2,
    estimatedMinutes: 20,
    diamondReward: 30,
    experienceReward: 40,
    sortOrder: 7,
    sections: {
      introduction: `# 🌐 BFS
BFS explores neighbors first before moving deeper. Ideal for shortest paths in unweighted graphs.`,
      syntax: `## Key Idea
- Use a queue and a visited set
- Enqueue start, then iterate neighbors
- Track parents to reconstruct paths

### Complexity
- Time: O(V + E)
- Space: O(V)`,
      examples: `### Example (Python)
\`\`\`python
from collections import deque

def bfs(adj, start):
    visited, order = set([start]), []
    q = deque([start])
    while q:
      v = q.popleft()
      order.append(v)
      for u in adj.get(v, []):
          if u not in visited:
              visited.add(u); q.append(u)
    return order

graph = {"A":["B","C"], "B":["D"], "C":["D","E"], "D":["F"], "E":["F"], "F":[]}
print(bfs(graph, "A"))
\`\`\`

### Uses
- Shortest path (unweighted)
- Connectivity / levels / bipartite check`,
    },
  },
  {
    slug: "alg-dfs",
    title: "Depth-First Search (DFS): Explore Deeply",
    description:
      "Traverse graphs by going deep along each branch. Learn recursion vs stack implementations and key applications.",
    category: ALG,
    difficulty: 2,
    estimatedMinutes: 20,
    diamondReward: 30,
    experienceReward: 40,
    sortOrder: 8,
    sections: {
      introduction: `# 🧭 DFS
DFS explores as far as possible before backtracking. Useful for pathfinding, cycle detection, and topological sorts.`,
      syntax: `## Key Idea
- Recursive or explicit stack
- Mark visited to avoid cycles
- Post/pre-order timings for analyses

### Complexity
- Time: O(V + E)
- Space: O(V) recursion/stack`,
      examples: `### Example (Python)
\`\`\`python
def dfs(adj, start, visited=None, out=None):
    if visited is None: visited=set()
    if out is None: out=[]
    visited.add(start)
    out.append(start)
    for u in adj.get(start, []):
        if u not in visited:
            dfs(adj, u, visited, out)
    return out

graph = {"A":["B","C"], "B":["D"], "C":["D","E"], "D":["F"], "E":["F"], "F":[]}
print(dfs(graph, "A"))
\`\`\`

### Uses
- Cycle detection, components
- Topological sort (DAG), articulation points`,
    },
  },
  {
    slug: "alg-dijkstra",
    title: "Dijkstra: Shortest Paths with Non-Negative Weights",
    description:
      "Compute shortest paths in weighted graphs (no negative edges) using a priority queue for efficiency.",
    category: ALG,
    difficulty: 3,
    estimatedMinutes: 25,
    diamondReward: 35,
    experienceReward: 45,
    sortOrder: 9,
    sections: {
      introduction: `# 🗺️ Dijkstra's Algorithm
Find the minimum-cost distance from a source to all vertices in a graph with non-negative weights.`,
      syntax: `## Key Idea
- Initialize dist[source]=0, others=∞
- Use min-priority queue (heap)
- Relax edges; update distances and parents

### Complexity
- With binary heap: O((V + E) log V)
- Space: O(V)`,
      examples: `### Example (Python)
\`\`\`python
import heapq

def dijkstra(adj, start):
    dist = {v: float("inf") for v in adj}
    dist[start] = 0
    pq = [(0, start)]
    parent = {start: None}
    while pq:
        d, v = heapq.heappop(pq)
        if d != dist[v]:
            continue
        for u, w in adj[v]:
            nd = d + w
            if nd < dist.get(u, float("inf")):
                dist[u] = nd
                parent[u] = v
                heapq.heappush(pq, (nd, u))
    return dist, parent

graph = {
  "A":[("B",4),("C",2)],
  "B":[("C",5),("D",10)],
  "C":[("E",3)],
  "D":[("F",11)],
  "E":[("D",4)],
  "F":[]
}
print(dijkstra(graph, "A")[0])
\`\`\`

### Uses
- Routing, navigation, scheduling
- Any non-negative weighted shortest path`,
    },
  },
  {
    slug: "alg-dynamic-programming-intro",
    title: "Dynamic Programming: Memoization & Tabulation",
    description:
      "A practical primer on DP via Fibonacci and classic optimization patterns with memoization vs tabulation.",
    category: ALG,
    difficulty: 2,
    estimatedMinutes: 24,
    diamondReward: 35,
    experienceReward: 40,
    sortOrder: 10,
    sections: {
      introduction: `# 🧠 Dynamic Programming (DP)
DP solves complex problems by combining solutions to overlapping subproblems, leveraging optimal substructure.`,
      syntax: `## Core Patterns
- Memoization (top-down): cache recursion results
- Tabulation (bottom-up): build a table iteratively
- State design: identify variables that define subproblems

### Typical Complexity
- Often O(n) or O(n·m) depending on state space`,
      examples: `### Examples (Python)
\`\`\`python
# Fibonacci - memoization
from functools import lru_cache

@lru_cache(None)
def fib_memo(n):
    if n <= 1: return n
    return fib_memo(n-1) + fib_memo(n-2)

# Fibonacci - tabulation (O(1) space)
def fib_tab(n):
    if n <= 1: return n
    a, b = 0, 1
    for _ in range(2, n+1):
        a, b = b, a+b
    return b

print(fib_memo(20), fib_tab(20))

# 0/1 Knapsack - tabulation sketch
def knapsack(weights, values, W):
    n = len(weights)
    dp = [[0]*(W+1) for _ in range(n+1)]
    for i in range(1, n+1):
        for w in range(W+1):
            dp[i][w] = dp[i-1][w]
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w], values[i-1] + dp[i-1][w-weights[i-1]])
    return dp[n][W]
\`\`\`

### Where DP shines
- Optimization/counting problems
- Text, sequences, grids, trees`,
    },
  },
];

async function seedAlgorithmLessons() {
  console.log("🌱 Seeding Learn page lessons for category:", ALG);

  for (const lesson of lessons) {
    const content = JSON.stringify({
      sections: {
        Introduction: {
          title: "Introduction",
          content: lesson.sections.introduction,
        },
        Syntax: {
          title: "Concepts & Complexity",
          content: lesson.sections.syntax,
        },
        Examples: {
          title: "Examples & Practice",
          content: lesson.sections.examples,
        },
      },
    });

    const settings = JSON.stringify({
      slug: lesson.slug,
      hasCodeExercise: false,
    });

    const category = lesson.category || ALG;
    const difficulty =
      typeof lesson.difficulty === "number" ? lesson.difficulty : 1;
    const estimatedMinutes = lesson.estimatedMinutes ?? 20;
    const diamondReward = lesson.diamondReward ?? 25;
    const experienceReward = lesson.experienceReward ?? 25;

    await prisma.learningActivity
      .upsert({
        where: { slug: lesson.slug },
        update: {
          title: lesson.title,
          description: lesson.description,
          category,
          difficulty,
          diamondReward,
          experienceReward,
          content,
          settings,
          estimatedMinutes,
          sortOrder: lesson.sortOrder,
          isActive: true,
          isLocked: false,
          activityType: "lesson",
          tags: JSON.stringify([category, "algorithms"]),
          topicOrder: lesson.sortOrder,
        },
        create: {
          slug: lesson.slug,
          title: lesson.title,
          description: lesson.description,
          activityType: "lesson",
          category,
          difficulty,
          diamondReward,
          experienceReward,
          content,
          settings,
          isActive: true,
          isLocked: false,
          estimatedMinutes,
          tags: JSON.stringify([category, "algorithms"]),
          sortOrder: lesson.sortOrder,
          topicOrder: lesson.sortOrder,
        },
      })
      .then(() => {
        console.log(`✅ Upserted: ${lesson.slug} (${lesson.title})`);
      })
      .catch((err) => {
        console.error(`❌ Failed upserting ${lesson.slug}:`, err);
      });
  }

  console.log("✅ Algorithm lessons seeding completed");
}

if (require.main === module) {
  seedAlgorithmLessons()
    .catch((e) => {
      console.error("❌ Seed error:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

export default seedAlgorithmLessons;
