import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedAlgorithms() {
  console.log("🔄 Seeding Algorithm Challenges...");

  // Create algorithm categories first
  const categories = [
    {
      name: "Sorting Algorithms",
      slug: "sorting",
      description:
        "Learn fundamental sorting algorithms and their complexities",
      color: "#8B5CF6",
      icon: "🔄",
    },
    {
      name: "Search Algorithms",
      slug: "search",
      description:
        "Master search techniques from linear to advanced algorithms",
      color: "#06B6D4",
      icon: "🔍",
    },
    {
      name: "Graph Algorithms",
      slug: "graph",
      description: "Explore graph traversal and shortest path algorithms",
      color: "#10B981",
      icon: "🕸️",
    },
    {
      name: "Dynamic Programming",
      slug: "dynamic-programming",
      description: "Solve complex problems with optimal substructure",
      color: "#F59E0B",
      icon: "🧩",
    },
    {
      name: "Data Structures",
      slug: "data-structures",
      description: "Understand fundamental data structures and operations",
      color: "#EF4444",
      icon: "📊",
    },
    {
      name: "Recursion & Backtracking",
      slug: "recursion",
      description: "Master recursive thinking and backtracking techniques",
      color: "#8B5CF6",
      icon: "♻️",
    },
  ];

  // Algorithm challenges in the format shown in the image
  const algorithmChallenges = [
    // SORTING ALGORITHMS
    {
      title: "Bubble Sort Visualizer",
      slug: "bubble-sort-visualizer",
      description:
        "Understand how bubble sort works through step-by-step visualization and learn its O(n²) time complexity",
      content: `# Bubble Sort Algorithm

Bubble Sort is one of the simplest sorting algorithms to understand. It repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.

## How it Works:
1. Compare adjacent elements
2. Swap if they're in wrong order  
3. Continue until no swaps needed
4. Largest element "bubbles up" to end

## Time Complexity: O(n²)
## Space Complexity: O(1)

Perfect for learning algorithm fundamentals!`,
      difficulty: 1, // Beginner
      order: 1,
      duration: 15,
      category: "algorithms",
      hasCodeExercise: true,
      starterCode: `# Implement Bubble Sort
def bubble_sort(arr):
    n = len(arr)
    
    # TODO: Implement bubble sort algorithm
    # Hint: Use nested loops to compare adjacent elements
    
    return arr

# Test your implementation
test_array = [64, 34, 25, 12, 22, 11, 90]
print("Original array:", test_array)
result = bubble_sort(test_array.copy())
print("Sorted array:", result)`,
      solutionCode: `def bubble_sort(arr):
    n = len(arr)
    
    # Traverse through all array elements
    for i in range(n):
        # Flag to optimize - if no swapping occurs, array is sorted
        swapped = False
        
        # Last i elements are already in place
        for j in range(0, n - i - 1):
            # Traverse the array from 0 to n-i-1
            # Swap if the element found is greater than the next element
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        # If no swapping occurred, array is sorted
        if not swapped:
            break
    
    return arr`,
      testCases: JSON.stringify([
        {
          input: [[64, 34, 25, 12, 22, 11, 90]],
          expected: [11, 12, 22, 25, 34, 64, 90],
        },
        { input: [[5, 2, 8, 1, 9]], expected: [1, 2, 5, 8, 9] },
        { input: [[1]], expected: [1] },
        { input: [[]], expected: [] },
      ]),
      diamondReward: 40,
      experienceReward: 80,
      isPublished: true,
      tags: JSON.stringify(["Algorithm Viz", "Sorting", "Beginner"]),
      learningObjectives: JSON.stringify([
        "Understand bubble sort algorithm",
        "Learn O(n²) time complexity",
        "Practice nested loop patterns",
        "Implement swapping logic",
      ]),
    },
    {
      title: "Quick Sort Master",
      slug: "quick-sort-master",
      description:
        "Master the divide-and-conquer approach with QuickSort and understand its O(n log n) average complexity",
      content: `# Quick Sort Algorithm

Quick Sort is a highly efficient sorting algorithm using divide-and-conquer strategy. It picks a 'pivot' element and partitions the array around it.

## How it Works:
1. Choose a pivot element
2. Partition array: smaller elements left, larger right
3. Recursively sort sub-arrays
4. Combine results

## Time Complexity: 
- Average: O(n log n)
- Worst: O(n²)
- Best: O(n log n)

## Space Complexity: O(log n)

One of the most widely used sorting algorithms!`,
      difficulty: 3, // Intermediate
      order: 2,
      duration: 25,
      category: "algorithms",
      hasCodeExercise: true,
      starterCode: `# Implement Quick Sort
def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        # TODO: Find partition index
        # TODO: Recursively sort elements before and after partition
        pass
    
    return arr

def partition(arr, low, high):
    # TODO: Implement partitioning logic
    # Choose pivot (last element)
    # Rearrange array so smaller elements are on left
    pass

# Test your implementation
test_array = [10, 7, 8, 9, 1, 5]
print("Original array:", test_array)
result = quick_sort(test_array.copy())
print("Sorted array:", result)`,
      solutionCode: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        # Partition index
        pi = partition(arr, low, high)
        
        # Recursively sort elements before and after partition
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)
    
    return arr

def partition(arr, low, high):
    # Choose the rightmost element as pivot
    pivot = arr[high]
    
    # Index of smaller element (indicates right position of pivot)
    i = low - 1
    
    for j in range(low, high):
        # If current element is smaller than or equal to pivot
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    
    # Place pivot in correct position
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
      testCases: JSON.stringify([
        { input: [[10, 7, 8, 9, 1, 5]], expected: [1, 5, 7, 8, 9, 10] },
        {
          input: [[64, 34, 25, 12, 22, 11, 90]],
          expected: [11, 12, 22, 25, 34, 64, 90],
        },
        {
          input: [[3, 1, 4, 1, 5, 9, 2, 6]],
          expected: [1, 1, 2, 3, 4, 5, 6, 9],
        },
      ]),
      diamondReward: 60,
      experienceReward: 120,
      isPublished: true,
      tags: JSON.stringify([
        "Algorithm Viz",
        "Sorting",
        "Divide & Conquer",
        "Advanced",
      ]),
      learningObjectives: JSON.stringify([
        "Master divide-and-conquer strategy",
        "Understand partitioning logic",
        "Learn recursion in algorithms",
        "Analyze time complexity trade-offs",
      ]),
    },
    {
      title: "Merge Sort Visualizer",
      slug: "merge-sort-visualizer",
      description:
        "Learn the stable O(n log n) sorting algorithm through visual divide-and-conquer demonstration",
      content: `# Merge Sort Algorithm

Merge Sort is a stable, divide-and-conquer algorithm that consistently performs in O(n log n) time regardless of input.

## How it Works:
1. Divide array into halves
2. Recursively sort both halves
3. Merge sorted halves back together
4. Maintain sorted order during merge

## Time Complexity: O(n log n) - Always!
## Space Complexity: O(n)

Perfect for large datasets and when stability is required!`,
      difficulty: 3,
      order: 3,
      duration: 20,
      category: "algorithms",
      hasCodeExercise: true,
      starterCode: `# Implement Merge Sort
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    # TODO: Divide array into halves
    # TODO: Recursively sort both halves
    # TODO: Merge sorted halves
    
    return arr

def merge(left, right):
    # TODO: Merge two sorted arrays
    result = []
    i = j = 0
    
    # Compare elements and merge
    
    return result

# Test your implementation
test_array = [38, 27, 43, 3, 9, 82, 10]
print("Original array:", test_array)
result = merge_sort(test_array.copy())
print("Sorted array:", result)`,
      solutionCode: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    # Divide array into halves
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    # Merge sorted halves
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    
    # Compare elements from both arrays and merge in order
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    # Add remaining elements
    result.extend(left[i:])
    result.extend(right[j:])
    
    return result`,
      diamondReward: 55,
      experienceReward: 110,
      isPublished: true,
      tags: JSON.stringify([
        "Algorithm Viz",
        "Sorting",
        "Stable Sort",
        "Advanced",
      ]),
      learningObjectives: JSON.stringify([
        "Understand stable sorting",
        "Master divide-and-conquer",
        "Learn array merging techniques",
        "Analyze space-time trade-offs",
      ]),
    },

    // SEARCH ALGORITHMS
    {
      title: "Binary Search Master",
      slug: "binary-search-master",
      description:
        "Master the O(log n) search algorithm and understand logarithmic time complexity through visualization",
      content: `# Binary Search Algorithm

Binary Search is an efficient search algorithm for sorted arrays, achieving O(log n) time complexity.

## How it Works:
1. Start with middle element
2. If target equals middle, found!
3. If target < middle, search left half
4. If target > middle, search right half
5. Repeat until found or exhausted

## Time Complexity: O(log n)
## Space Complexity: O(1)

Essential algorithm for efficient searching!`,
      difficulty: 2,
      order: 4,
      duration: 15,
      category: "algorithms",
      hasCodeExercise: true,
      starterCode: `# Implement Binary Search
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        # TODO: Calculate middle index
        # TODO: Compare middle element with target
        # TODO: Adjust search range based on comparison
        pass
    
    return -1  # Target not found

# Test your implementation
sorted_array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
target = 7
result = binary_search(sorted_array, target)
print(f"Target {target} found at index: {result}")`,
      solutionCode: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  # Target not found`,
      diamondReward: 45,
      experienceReward: 90,
      isPublished: true,
      tags: JSON.stringify([
        "Algorithm Viz",
        "Search",
        "Logarithmic",
        "Intermediate",
      ]),
      learningObjectives: JSON.stringify([
        "Understand logarithmic complexity",
        "Master binary search logic",
        "Learn efficient searching",
        "Practice divide-and-conquer",
      ]),
    },

    // BIG O NOTATION
    {
      title: "Big O Notation Master",
      slug: "big-o-notation-master",
      description:
        "Learn to analyze time and space complexity of algorithms and understand algorithmic efficiency",
      content: `# Big O Notation

Big O notation describes the performance characteristics of algorithms as input size grows.

## Common Complexities:
- **O(1)** - Constant time
- **O(log n)** - Logarithmic time  
- **O(n)** - Linear time
- **O(n log n)** - Linearithmic time
- **O(n²)** - Quadratic time
- **O(2ⁿ)** - Exponential time

## Why It Matters:
- Predicts algorithm performance
- Helps choose right algorithm
- Critical for large datasets
- Interview essential

Master this to write efficient code!`,
      difficulty: 4,
      order: 5,
      duration: 20,
      category: "algorithms",
      hasCodeExercise: true,
      starterCode: `# Analyze Big O Complexity

# Example 1: What's the time complexity?
def example_1(arr):
    for i in range(len(arr)):
        print(arr[i])
    # Answer: O(?)

# Example 2: What's the time complexity?
def example_2(arr):
    for i in range(len(arr)):
        for j in range(len(arr)):
            print(arr[i], arr[j])
    # Answer: O(?)

# Example 3: What's the time complexity?
def example_3(arr):
    if len(arr) == 0:
        return
    print(arr[0])
    # Answer: O(?)

# TODO: Implement a function that demonstrates O(n log n) complexity
def merge_sort_demo(arr):
    # Hint: Divide array, recursively sort, then merge
    pass`,
      solutionCode: `# Big O Analysis Solutions

# Example 1: O(n) - Linear time
def example_1(arr):
    for i in range(len(arr)):  # Loops n times
        print(arr[i])
    # Answer: O(n)

# Example 2: O(n²) - Quadratic time  
def example_2(arr):
    for i in range(len(arr)):      # Loops n times
        for j in range(len(arr)):  # Nested loop, n times each
            print(arr[i], arr[j])
    # Answer: O(n²)

# Example 3: O(1) - Constant time
def example_3(arr):
    if len(arr) == 0:
        return
    print(arr[0])  # Single operation regardless of input size
    # Answer: O(1)

# O(n log n) demonstration
def merge_sort_demo(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort_demo(arr[:mid])    # Divides log n times
    right = merge_sort_demo(arr[mid:])   # Each level processes n elements
    
    return merge(left, right)  # Total: O(n log n)`,
      diamondReward: 70,
      experienceReward: 140,
      isPublished: true,
      tags: JSON.stringify([
        "Matching",
        "Big O",
        "Complexity Analysis",
        "Advanced",
      ]),
      learningObjectives: JSON.stringify([
        "Understand Big O notation",
        "Analyze algorithm complexity",
        "Compare algorithm efficiency",
        "Make informed algorithm choices",
      ]),
    },

    // GRAPH ALGORITHMS
    {
      title: "Graph Traversal Explorer",
      slug: "graph-traversal-explorer",
      description:
        "Explore Depth-First Search (DFS) and Breadth-First Search (BFS) through interactive graph visualization",
      content: `# Graph Traversal Algorithms

Graph traversal is fundamental to many algorithms and applications.

## Depth-First Search (DFS):
- Explores as far as possible along each branch
- Uses stack (or recursion)
- Time: O(V + E), Space: O(V)

## Breadth-First Search (BFS):
- Explores neighbors before going deeper
- Uses queue
- Time: O(V + E), Space: O(V)
- Finds shortest path in unweighted graphs

Perfect for pathfinding, connectivity, and graph analysis!`,
      difficulty: 3,
      order: 6,
      duration: 30,
      category: "algorithms",
      hasCodeExercise: true,
      starterCode: `# Implement Graph Traversal
from collections import deque

class Graph:
    def __init__(self):
        self.adjacency_list = {}
    
    def add_edge(self, u, v):
        if u not in self.adjacency_list:
            self.adjacency_list[u] = []
        if v not in self.adjacency_list:
            self.adjacency_list[v] = []
        
        self.adjacency_list[u].append(v)
        self.adjacency_list[v].append(u)
    
    def dfs(self, start):
        # TODO: Implement Depth-First Search
        visited = set()
        result = []
        
        def dfs_helper(node):
            # TODO: Add DFS logic here
            pass
        
        dfs_helper(start)
        return result
    
    def bfs(self, start):
        # TODO: Implement Breadth-First Search
        visited = set()
        queue = deque([start])
        result = []
        
        while queue:
            # TODO: Add BFS logic here
            pass
        
        return result

# Test your implementation
g = Graph()
g.add_edge(0, 1)
g.add_edge(0, 2)
g.add_edge(1, 3)
g.add_edge(2, 4)

print("DFS:", g.dfs(0))
print("BFS:", g.bfs(0))`,
      solutionCode: `from collections import deque

class Graph:
    def __init__(self):
        self.adjacency_list = {}
    
    def add_edge(self, u, v):
        if u not in self.adjacency_list:
            self.adjacency_list[u] = []
        if v not in self.adjacency_list:
            self.adjacency_list[v] = []
        
        self.adjacency_list[u].append(v)
        self.adjacency_list[v].append(u)
    
    def dfs(self, start):
        visited = set()
        result = []
        
        def dfs_helper(node):
            visited.add(node)
            result.append(node)
            
            for neighbor in self.adjacency_list.get(node, []):
                if neighbor not in visited:
                    dfs_helper(neighbor)
        
        dfs_helper(start)
        return result
    
    def bfs(self, start):
        visited = set()
        queue = deque([start])
        result = []
        visited.add(start)
        
        while queue:
            node = queue.popleft()
            result.append(node)
            
            for neighbor in self.adjacency_list.get(node, []):
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        
        return result`,
      diamondReward: 65,
      experienceReward: 130,
      isPublished: true,
      tags: JSON.stringify([
        "Algorithm Viz",
        "Graph",
        "DFS",
        "BFS",
        "Advanced",
      ]),
      learningObjectives: JSON.stringify([
        "Understand graph representations",
        "Master DFS and BFS algorithms",
        "Learn queue and stack usage",
        "Apply traversal to real problems",
      ]),
    },

    // DYNAMIC PROGRAMMING
    {
      title: "Dynamic Programming Fundamentals",
      slug: "dynamic-programming-fundamentals",
      description:
        "Master the art of breaking complex problems into overlapping subproblems with memoization",
      content: `# Dynamic Programming

Dynamic Programming solves complex problems by breaking them into simpler subproblems and storing results.

## Key Concepts:
1. **Optimal Substructure** - Optimal solution contains optimal solutions to subproblems
2. **Overlapping Subproblems** - Same subproblems solved multiple times
3. **Memoization** - Store solutions to avoid recomputation

## Classic Example: Fibonacci
- Naive: O(2ⁿ)
- With DP: O(n)

Essential for optimization problems!`,
      difficulty: 4,
      order: 7,
      duration: 25,
      category: "algorithms",
      hasCodeExercise: true,
      starterCode: `# Dynamic Programming Examples

# 1. Fibonacci with memoization
def fibonacci_memo(n, memo={}):
    # TODO: Implement memoized fibonacci
    # Base cases: fib(0) = 0, fib(1) = 1
    # Use memo dictionary to store computed values
    pass

# 2. Climbing Stairs Problem
# You can climb 1 or 2 steps at a time
# How many ways to reach step n?
def climb_stairs(n):
    # TODO: Use DP to solve climbing stairs
    # Hint: dp[i] = dp[i-1] + dp[i-2]
    pass

# 3. Coin Change Problem
def coin_change(coins, amount):
    # TODO: Find minimum coins needed to make amount
    # Return -1 if impossible
    pass

# Test your implementations
print("Fibonacci(10):", fibonacci_memo(10))
print("Climb stairs(5):", climb_stairs(5))
print("Coin change([1,3,4], 6):", coin_change([1,3,4], 6))`,
      solutionCode: `# Dynamic Programming Solutions

def fibonacci_memo(n, memo={}):
    if n in memo:
        return memo[n]
    
    if n <= 1:
        return n
    
    memo[n] = fibonacci_memo(n-1, memo) + fibonacci_memo(n-2, memo)
    return memo[n]

def climb_stairs(n):
    if n <= 2:
        return n
    
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]

def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1`,
      diamondReward: 80,
      experienceReward: 160,
      isPublished: true,
      tags: JSON.stringify([
        "Algorithm Viz",
        "Dynamic Programming",
        "Optimization",
        "Expert",
      ]),
      learningObjectives: JSON.stringify([
        "Understand dynamic programming principles",
        "Master memoization techniques",
        "Solve optimization problems",
        "Identify overlapping subproblems",
      ]),
    },

    // DATA STRUCTURES
    {
      title: "Stack and Queue Fundamentals",
      slug: "stack-queue-fundamentals",
      description:
        "Master LIFO and FIFO data structures through interactive implementation and real-world applications",
      content: `# Stack and Queue Data Structures

Fundamental linear data structures with different access patterns.

## Stack (LIFO - Last In, First Out):
- **Push**: Add to top
- **Pop**: Remove from top
- **Peek**: View top element
- Applications: Function calls, undo operations, expression evaluation

## Queue (FIFO - First In, First Out):
- **Enqueue**: Add to rear
- **Dequeue**: Remove from front
- **Front**: View front element
- Applications: Task scheduling, BFS, buffering

Both essential for algorithm implementation!`,
      difficulty: 2,
      order: 8,
      duration: 20,
      category: "algorithms",
      hasCodeExercise: true,
      starterCode: `# Implement Stack and Queue

class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        # TODO: Add item to top of stack
        pass
    
    def pop(self):
        # TODO: Remove and return top item
        # Return None if empty
        pass
    
    def peek(self):
        # TODO: Return top item without removing
        pass
    
    def is_empty(self):
        # TODO: Check if stack is empty
        pass
    
    def size(self):
        # TODO: Return number of items
        pass

class Queue:
    def __init__(self):
        self.items = []
    
    def enqueue(self, item):
        # TODO: Add item to rear
        pass
    
    def dequeue(self):
        # TODO: Remove and return front item
        pass
    
    def front(self):
        # TODO: Return front item without removing
        pass
    
    def is_empty(self):
        # TODO: Check if queue is empty
        pass
    
    def size(self):
        # TODO: Return number of items
        pass

# Test implementations
stack = Stack()
queue = Queue()

# Test stack
stack.push(1)
stack.push(2)
print("Stack pop:", stack.pop())  # Should be 2

# Test queue  
queue.enqueue(1)
queue.enqueue(2)
print("Queue dequeue:", queue.dequeue())  # Should be 1`,
      solutionCode: `class Stack:
    def __init__(self):
        self.items = []
    
    def push(self, item):
        self.items.append(item)
    
    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        return None
    
    def peek(self):
        if not self.is_empty():
            return self.items[-1]
        return None
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)

class Queue:
    def __init__(self):
        self.items = []
    
    def enqueue(self, item):
        self.items.append(item)
    
    def dequeue(self):
        if not self.is_empty():
            return self.items.pop(0)
        return None
    
    def front(self):
        if not self.is_empty():
            return self.items[0]
        return None
    
    def is_empty(self):
        return len(self.items) == 0
    
    def size(self):
        return len(self.items)`,
      diamondReward: 50,
      experienceReward: 100,
      isPublished: true,
      tags: JSON.stringify([
        "Data Structures",
        "Stack",
        "Queue",
        "LIFO",
        "FIFO",
        "Intermediate",
      ]),
      learningObjectives: JSON.stringify([
        "Understand LIFO and FIFO principles",
        "Implement stack and queue operations",
        "Learn when to use each structure",
        "Practice object-oriented design",
      ]),
    },

    // RECURSION
    {
      title: "Recursion Mastery Challenge",
      slug: "recursion-mastery-challenge",
      description:
        "Master recursive thinking through classic problems and learn to identify base cases and recursive relationships",
      content: `# Recursion Fundamentals

Recursion is a powerful programming technique where a function calls itself to solve smaller instances of the same problem.

## Key Components:
1. **Base Case** - Stopping condition
2. **Recursive Case** - Function calls itself with modified input
3. **Progress** - Each call moves toward base case

## Classic Examples:
- Factorial: n! = n * (n-1)!
- Fibonacci: fib(n) = fib(n-1) + fib(n-2)
- Tree traversal, Tower of Hanoi

Essential for divide-and-conquer algorithms!`,
      difficulty: 3,
      order: 9,
      duration: 25,
      category: "algorithms",
      hasCodeExercise: true,
      starterCode: `# Recursion Practice Problems

# 1. Factorial
def factorial(n):
    # TODO: Calculate n! recursively
    # Base case: 0! = 1, 1! = 1
    # Recursive case: n! = n * (n-1)!
    pass

# 2. Sum of digits
def sum_of_digits(n):
    # TODO: Calculate sum of digits recursively
    # Example: sum_of_digits(123) = 1 + 2 + 3 = 6
    pass

# 3. Power function
def power(base, exp):
    # TODO: Calculate base^exp recursively
    # Base case: base^0 = 1
    # Recursive case: base^exp = base * base^(exp-1)
    pass

# 4. Palindrome check
def is_palindrome(s):
    # TODO: Check if string is palindrome recursively
    # Remove spaces and convert to lowercase
    s = s.replace(" ", "").lower()
    # Base case: empty string or single char is palindrome
    pass

# Test your implementations
print("Factorial(5):", factorial(5))        # Should be 120
print("Sum of digits(123):", sum_of_digits(123))  # Should be 6
print("Power(2, 3):", power(2, 3))          # Should be 8
print("Is 'racecar' palindrome?:", is_palindrome("racecar"))  # Should be True`,
      solutionCode: `def factorial(n):
    # Base case
    if n <= 1:
        return 1
    
    # Recursive case
    return n * factorial(n - 1)

def sum_of_digits(n):
    # Base case
    if n < 10:
        return n
    
    # Recursive case: last digit + sum of remaining digits
    return n % 10 + sum_of_digits(n // 10)

def power(base, exp):
    # Base case
    if exp == 0:
        return 1
    
    # Recursive case
    return base * power(base, exp - 1)

def is_palindrome(s):
    # Clean the string
    s = s.replace(" ", "").lower()
    
    # Base case: empty or single character
    if len(s) <= 1:
        return True
    
    # Check first and last characters
    if s[0] != s[-1]:
        return False
    
    # Recursive case: check middle part
    return is_palindrome(s[1:-1])`,
      diamondReward: 60,
      experienceReward: 120,
      isPublished: true,
      tags: JSON.stringify([
        "Algorithm Viz",
        "Recursion",
        "Problem Solving",
        "Advanced",
      ]),
      learningObjectives: JSON.stringify([
        "Understand recursive thinking",
        "Identify base and recursive cases",
        "Solve problems with self-reference",
        "Avoid infinite recursion",
      ]),
    },
  ];

  try {
    // Create algorithm challenges
    for (const challenge of algorithmChallenges) {
      const learningActivityData = {
        id: challenge.slug,
        title: challenge.title,
        description: challenge.description,
        content: challenge.content,
        activityType: "coding_challenge",
        category: challenge.category || "algorithms",
        difficulty: challenge.difficulty || 1,
        diamondReward: challenge.diamondReward || 40,
        experienceReward: challenge.experienceReward || 80,
        estimatedMinutes: challenge.duration || 15,
        sortOrder: challenge.order || 0,
        isActive: challenge.isPublished !== false,
        tags: JSON.stringify(challenge.tags ? JSON.parse(challenge.tags) : []),
        settings: JSON.stringify({
          slug: challenge.slug,
          hasCodeExercise: challenge.hasCodeExercise || false,
          starterCode: challenge.starterCode,
          solutionCode: challenge.solutionCode,
          testCases: challenge.testCases,
          learningObjectives: challenge.learningObjectives
            ? JSON.parse(challenge.learningObjectives)
            : [],
          source: "algorithm_seed",
          migrated_at: new Date().toISOString(),
        }),
      };

      await prisma.learningActivity.upsert({
        where: { id: challenge.slug },
        update: learningActivityData,
        create: learningActivityData,
      });
      console.log(`✅ Created algorithm challenge: ${challenge.title}`);
    }

    console.log("🎉 Algorithm challenges seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding algorithms:", error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    await seedAlgorithms();
    console.log("✅ Algorithm seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding algorithms:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}
