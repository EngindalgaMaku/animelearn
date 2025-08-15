import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Algorithm Visualization Activities for Python Fundamentals
 * 10 interactive algorithm visualizations with step-by-step execution
 * Difficulty levels: 1-4 (Beginner to Advanced)
 */

export const algorithmVisualizationPythonFundamentalsActivities = [
  // DIFFICULTY 1 - BEGINNER (3 activities)

  // 1. Linear Search Visualization
  {
    title: "Linear Search Algorithm Visualization",
    description:
      "Visualize how linear search finds elements in a list step by step",
    activityType: "algorithm_visualization",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 20,
    experienceReward: 45,
    estimatedMinutes: 15,
    tags: ["search", "algorithms", "lists", "visualization"],
    content: {
      title: "Linear Search Step-by-Step",
      description:
        "Watch how Python searches through a list element by element to find a target value",
      algorithm: {
        name: "Linear Search",
        complexity: {
          time: "O(n)",
          space: "O(1)",
        },
        steps: [
          {
            id: 1,
            title: "Initialize Search",
            description: "Start at the beginning of the list with index 0",
            code: "def linear_search(arr, target):\n    for i in range(len(arr)):\n        # Check current element",
            visualization: {
              type: "array",
              data: [5, 2, 8, 1, 9, 3],
              target: 8,
              currentIndex: -1,
              foundIndex: -1,
              highlight: "start",
            },
          },
          {
            id: 2,
            title: "Check First Element",
            description: "Compare the first element with our target value",
            code: "        if arr[i] == target:\n            return i  # Found it!\n        # Continue to next element",
            visualization: {
              type: "array",
              data: [5, 2, 8, 1, 9, 3],
              target: 8,
              currentIndex: 0,
              foundIndex: -1,
              highlight: "checking",
              comparison: "5 != 8",
            },
          },
          {
            id: 3,
            title: "Check Second Element",
            description: "Move to index 1 and compare with target",
            code: "        if arr[i] == target:\n            return i  # Found it!\n        # Continue to next element",
            visualization: {
              type: "array",
              data: [5, 2, 8, 1, 9, 3],
              target: 8,
              currentIndex: 1,
              foundIndex: -1,
              highlight: "checking",
              comparison: "2 != 8",
            },
          },
          {
            id: 4,
            title: "Found Target!",
            description: "Element at index 2 matches our target value",
            code: "        if arr[i] == target:\n            return i  # Found it!\n    return -1  # Not found",
            visualization: {
              type: "array",
              data: [5, 2, 8, 1, 9, 3],
              target: 8,
              currentIndex: 2,
              foundIndex: 2,
              highlight: "found",
              comparison: "8 == 8 ✓",
            },
          },
        ],
        interactiveElements: [
          {
            type: "input",
            label: "Target value to search for",
            defaultValue: 8,
            range: [1, 10],
          },
          {
            type: "array_editor",
            label: "Modify the array",
            defaultValue: [5, 2, 8, 1, 9, 3],
          },
        ],
      },
      learningObjectives: [
        "Understand linear search algorithm",
        "Learn about time complexity O(n)",
        "Practice array traversal concepts",
        "Visualize algorithm execution flow",
      ],
      quiz: [
        {
          question: "What is the worst-case time complexity of linear search?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
          correct: 2,
          explanation:
            "Linear search may need to check every element in the worst case, so it's O(n).",
        },
        {
          question: "When does linear search perform best?",
          options: [
            "When target is at the end",
            "When target is at the beginning",
            "When array is sorted",
            "When array is large",
          ],
          correct: 1,
          explanation:
            "Linear search performs best when the target is found early, ideally at the first position.",
        },
      ],
    },
    settings: {
      playbackSpeed: "normal",
      allowStepthrough: true,
      showComplexity: true,
      interactive: true,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2. Bubble Sort Visualization
  {
    title: "Bubble Sort Algorithm Visualization",
    description:
      "Watch bubble sort algorithm organize a list by swapping adjacent elements",
    activityType: "algorithm_visualization",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 25,
    experienceReward: 50,
    estimatedMinutes: 18,
    tags: ["sorting", "algorithms", "swapping", "loops"],
    content: {
      title: "Bubble Sort Step-by-Step",
      description:
        "Visualize how bubble sort moves larger elements to the end through repeated swaps",
      algorithm: {
        name: "Bubble Sort",
        complexity: {
          time: "O(n²)",
          space: "O(1)",
        },
        steps: [
          {
            id: 1,
            title: "Initial Array",
            description: "Start with an unsorted array",
            code: "def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):",
            visualization: {
              type: "array",
              data: [64, 34, 25, 12, 22, 11, 90],
              comparing: [],
              swapped: false,
              passes: 0,
              highlight: "initial",
            },
          },
          {
            id: 2,
            title: "First Pass - Compare Adjacent",
            description: "Compare first two elements: 64 and 34",
            code: "        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:",
            visualization: {
              type: "array",
              data: [64, 34, 25, 12, 22, 11, 90],
              comparing: [0, 1],
              swapped: false,
              passes: 1,
              highlight: "comparing",
            },
          },
          {
            id: 3,
            title: "Swap Elements",
            description: "64 > 34, so swap them",
            code: "                arr[j], arr[j + 1] = arr[j + 1], arr[j]",
            visualization: {
              type: "array",
              data: [34, 64, 25, 12, 22, 11, 90],
              comparing: [0, 1],
              swapped: true,
              passes: 1,
              highlight: "swapped",
            },
          },
          {
            id: 4,
            title: "Continue Comparing",
            description: "Compare next pair: 64 and 25",
            code: "            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]",
            visualization: {
              type: "array",
              data: [34, 25, 64, 12, 22, 11, 90],
              comparing: [1, 2],
              swapped: true,
              passes: 1,
              highlight: "comparing",
            },
          },
          {
            id: 5,
            title: "First Pass Complete",
            description: "Largest element (90) is now at the end",
            code: "    # After first pass, largest element is in place",
            visualization: {
              type: "array",
              data: [34, 25, 12, 22, 11, 64, 90],
              comparing: [],
              swapped: false,
              passes: 1,
              highlight: "pass_complete",
              sorted: [6],
            },
          },
          {
            id: 6,
            title: "Final Sorted Array",
            description: "After all passes, array is completely sorted",
            code: "    return arr  # Fully sorted!",
            visualization: {
              type: "array",
              data: [11, 12, 22, 25, 34, 64, 90],
              comparing: [],
              swapped: false,
              passes: 6,
              highlight: "complete",
              sorted: [0, 1, 2, 3, 4, 5, 6],
            },
          },
        ],
        interactiveElements: [
          {
            type: "array_editor",
            label: "Modify the array to sort",
            defaultValue: [64, 34, 25, 12, 22, 11, 90],
          },
          {
            type: "speed_control",
            label: "Animation speed",
            options: ["slow", "normal", "fast"],
          },
        ],
      },
      learningObjectives: [
        "Understand bubble sort algorithm",
        "Learn about nested loops",
        "Practice swapping elements",
        "Understand O(n²) complexity",
      ],
      quiz: [
        {
          question: "Why is bubble sort called 'bubble' sort?",
          options: [
            "It creates bubbles",
            "Small elements bubble to the top",
            "It's round like a bubble",
            "It pops like a bubble",
          ],
          correct: 1,
          explanation:
            "Smaller elements 'bubble' to the beginning of the array through successive swaps.",
        },
        {
          question: "How many passes does bubble sort need for n elements?",
          options: ["n", "n-1", "n²", "log n"],
          correct: 1,
          explanation:
            "Bubble sort needs at most n-1 passes to sort n elements completely.",
        },
      ],
    },
    settings: {
      playbackSpeed: "normal",
      allowStepthrough: true,
      showComplexity: true,
      interactive: true,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3. List Operations Visualization
  {
    title: "Python List Operations Visualization",
    description:
      "Visualize how Python list operations like append, insert, and remove work internally",
    activityType: "algorithm_visualization",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 22,
    experienceReward: 48,
    estimatedMinutes: 16,
    tags: ["lists", "data-structures", "operations", "memory"],
    content: {
      title: "List Operations Internals",
      description:
        "See how Python manages memory and indices during common list operations",
      algorithm: {
        name: "List Operations",
        complexity: {
          append: "O(1) amortized",
          insert: "O(n)",
          remove: "O(n)",
        },
        steps: [
          {
            id: 1,
            title: "Initial List",
            description: "Start with a list containing some elements",
            code: "my_list = [10, 20, 30]\nprint(f'Initial list: {my_list}')",
            visualization: {
              type: "list",
              data: [10, 20, 30],
              indices: [0, 1, 2],
              capacity: 4,
              operation: "initial",
              highlight: [],
            },
          },
          {
            id: 2,
            title: "Append Operation",
            description: "Add element to the end - O(1) operation",
            code: "my_list.append(40)\nprint(f'After append: {my_list}')",
            visualization: {
              type: "list",
              data: [10, 20, 30, 40],
              indices: [0, 1, 2, 3],
              capacity: 4,
              operation: "append",
              highlight: [3],
              newElement: 40,
            },
          },
          {
            id: 3,
            title: "Insert at Beginning",
            description: "Insert at index 0 - requires shifting all elements",
            code: "my_list.insert(0, 5)\nprint(f'After insert at 0: {my_list}')",
            visualization: {
              type: "list",
              data: [5, 10, 20, 30, 40],
              indices: [0, 1, 2, 3, 4],
              capacity: 8,
              operation: "insert",
              highlight: [0],
              shifted: [1, 2, 3, 4],
              newElement: 5,
            },
          },
          {
            id: 4,
            title: "Insert in Middle",
            description:
              "Insert at index 2 - shift elements from insertion point",
            code: "my_list.insert(2, 15)\nprint(f'After insert at 2: {my_list}')",
            visualization: {
              type: "list",
              data: [5, 10, 15, 20, 30, 40],
              indices: [0, 1, 2, 3, 4, 5],
              capacity: 8,
              operation: "insert",
              highlight: [2],
              shifted: [3, 4, 5],
              newElement: 15,
            },
          },
          {
            id: 5,
            title: "Remove Element",
            description:
              "Remove element at index 1 - shift remaining elements left",
            code: "removed = my_list.pop(1)\nprint(f'Removed {removed}: {my_list}')",
            visualization: {
              type: "list",
              data: [5, 15, 20, 30, 40],
              indices: [0, 1, 2, 3, 4],
              capacity: 8,
              operation: "remove",
              highlight: [1],
              shifted: [2, 3, 4],
              removedElement: 10,
            },
          },
          {
            id: 6,
            title: "Memory Efficiency",
            description: "Python may resize the internal array for efficiency",
            code: "# Python manages memory automatically\n# List capacity adjusts based on size",
            visualization: {
              type: "list",
              data: [5, 15, 20, 30, 40],
              indices: [0, 1, 2, 3, 4],
              capacity: 6,
              operation: "resize",
              highlight: [],
              memoryNote: "Capacity optimized",
            },
          },
        ],
        interactiveElements: [
          {
            type: "operation_selector",
            label: "Choose operation",
            options: ["append", "insert", "remove", "pop"],
          },
          {
            type: "value_input",
            label: "Value to add/remove",
            defaultValue: 25,
          },
          {
            type: "index_input",
            label: "Index (for insert/remove)",
            defaultValue: 0,
          },
        ],
      },
      learningObjectives: [
        "Understand list memory management",
        "Learn operation time complexities",
        "Visualize element shifting",
        "Practice list method usage",
      ],
      quiz: [
        {
          question: "Which list operation is most expensive?",
          options: ["append()", "insert(0, value)", "pop()", "len()"],
          correct: 1,
          explanation:
            "insert(0, value) requires shifting all existing elements, making it O(n).",
        },
        {
          question: "Why is append() typically O(1)?",
          options: [
            "It's the fastest operation",
            "No elements need shifting",
            "Python is optimized",
            "Lists are always sorted",
          ],
          correct: 1,
          explanation:
            "append() adds to the end, so no existing elements need to be moved.",
        },
      ],
    },
    settings: {
      playbackSpeed: "normal",
      allowStepthrough: true,
      showComplexity: true,
      interactive: true,
    },
    isActive: true,
    sortOrder: 3,
  },

  // DIFFICULTY 2 - BASIC (3 activities)

  // 4. String Manipulation Algorithm
  {
    title: "String Reversal Algorithm Visualization",
    description:
      "Visualize different approaches to reversing a string in Python",
    activityType: "algorithm_visualization",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 28,
    experienceReward: 55,
    estimatedMinutes: 20,
    tags: ["strings", "algorithms", "manipulation", "optimization"],
    content: {
      title: "String Reversal Techniques",
      description:
        "Compare different methods for reversing strings and their performance characteristics",
      algorithm: {
        name: "String Reversal",
        complexity: {
          slicing: "O(n)",
          loop: "O(n)",
          recursion: "O(n)",
        },
        steps: [
          {
            id: 1,
            title: "Original String",
            description: "Start with a string to reverse",
            code: "text = 'Python'\nprint(f'Original: {text}')",
            visualization: {
              type: "string",
              data: "Python",
              indices: [0, 1, 2, 3, 4, 5],
              method: "original",
              highlight: [],
              result: "",
            },
          },
          {
            id: 2,
            title: "Method 1: Slicing",
            description: "Use Python's slice notation with negative step",
            code: "reversed_text = text[::-1]\nprint(f'Reversed: {reversed_text}')",
            visualization: {
              type: "string",
              data: "Python",
              indices: [5, 4, 3, 2, 1, 0],
              method: "slicing",
              highlight: [5, 4, 3, 2, 1, 0],
              result: "nohtyP",
              direction: "backward",
            },
          },
          {
            id: 3,
            title: "Method 2: Loop Approach",
            description: "Build reversed string character by character",
            code: "reversed_text = ''\nfor char in text:\n    reversed_text = char + reversed_text",
            visualization: {
              type: "string",
              data: "Python",
              indices: [0, 1, 2, 3, 4, 5],
              method: "loop",
              highlight: [0],
              result: "P",
              buildingProcess: ["P", "yP", "tyP", "htyP", "ohtyP", "nohtyP"],
            },
          },
          {
            id: 4,
            title: "Loop Progress",
            description: "Continue building from right to left",
            code: "# After processing 'y'\nreversed_text = 'y' + 'P'  # 'yP'",
            visualization: {
              type: "string",
              data: "Python",
              indices: [0, 1, 2, 3, 4, 5],
              method: "loop",
              highlight: [1],
              result: "yP",
              currentChar: "y",
              step: 2,
            },
          },
          {
            id: 5,
            title: "Method 3: List Reversal",
            description: "Convert to list, reverse, then join",
            code: "char_list = list(text)\nchar_list.reverse()\nreversed_text = ''.join(char_list)",
            visualization: {
              type: "string_to_list",
              original: "Python",
              list_data: ["P", "y", "t", "h", "o", "n"],
              reversed_list: ["n", "o", "h", "t", "y", "P"],
              method: "list_reverse",
              result: "nohtyP",
            },
          },
          {
            id: 6,
            title: "Performance Comparison",
            description: "Compare the efficiency of different methods",
            code: "# Performance comparison:\n# Slicing: Fastest, most Pythonic\n# Loop: Educational, shows process\n# List reverse: Clear, readable",
            visualization: {
              type: "performance_chart",
              methods: [
                { name: "Slicing [::-1]", time: "0.1ms", pythonic: "★★★" },
                { name: "Loop building", time: "0.3ms", pythonic: "★☆☆" },
                { name: "List reverse", time: "0.2ms", pythonic: "★★☆" },
              ],
              recommendation:
                "Slicing is preferred for its simplicity and performance",
            },
          },
        ],
        interactiveElements: [
          {
            type: "text_input",
            label: "String to reverse",
            defaultValue: "Python",
          },
          {
            type: "method_selector",
            label: "Choose reversal method",
            options: ["slicing", "loop", "list_reverse", "all"],
          },
        ],
      },
      learningObjectives: [
        "Learn multiple string reversal techniques",
        "Understand Python slicing syntax",
        "Compare algorithm performance",
        "Practice string manipulation",
      ],
      quiz: [
        {
          question: "Which string reversal method is most Pythonic?",
          options: ["for loop", "while loop", "slicing [::-1]", "recursion"],
          correct: 2,
          explanation:
            "Python slicing with [::-1] is the most concise and idiomatic way to reverse a string.",
        },
        {
          question: "What does [::-1] mean in Python?",
          options: [
            "Start from end",
            "Negative indexing",
            "Reverse slice with step -1",
            "Invalid syntax",
          ],
          correct: 2,
          explanation:
            "[::-1] creates a slice from start to end with a step of -1, effectively reversing the sequence.",
        },
      ],
    },
    settings: {
      playbackSpeed: "normal",
      allowStepthrough: true,
      showComplexity: true,
      interactive: true,
    },
    isActive: true,
    sortOrder: 4,
  },

  // 5. Dictionary Operations Visualization
  {
    title: "Python Dictionary Operations Visualization",
    description:
      "Visualize how Python dictionaries handle key-value operations and hash collisions",
    activityType: "algorithm_visualization",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 30,
    experienceReward: 60,
    estimatedMinutes: 22,
    tags: ["dictionaries", "hashing", "data-structures", "operations"],
    content: {
      title: "Dictionary Internal Operations",
      description:
        "Understand how Python dictionaries use hash tables for efficient key-value storage",
      algorithm: {
        name: "Dictionary Operations",
        complexity: {
          access: "O(1) average",
          insert: "O(1) average",
          delete: "O(1) average",
        },
        steps: [
          {
            id: 1,
            title: "Empty Dictionary",
            description: "Start with an empty dictionary",
            code: "student_grades = {}\nprint('Created empty dictionary')",
            visualization: {
              type: "hash_table",
              buckets: 8,
              data: {},
              operation: "init",
              highlight: [],
            },
          },
          {
            id: 2,
            title: "Adding First Key-Value",
            description: "Add 'Alice': 95 - hash key to find bucket",
            code: "student_grades['Alice'] = 95\nprint(student_grades)",
            visualization: {
              type: "hash_table",
              buckets: 8,
              data: { Alice: 95 },
              operation: "insert",
              highlight: [2],
              hashProcess: {
                key: "Alice",
                hashValue: 12345,
                bucket: 2,
                collision: false,
              },
            },
          },
          {
            id: 3,
            title: "Adding More Entries",
            description: "Add 'Bob': 87 - different hash, different bucket",
            code: "student_grades['Bob'] = 87\nprint(student_grades)",
            visualization: {
              type: "hash_table",
              buckets: 8,
              data: { Alice: 95, Bob: 87 },
              operation: "insert",
              highlight: [5],
              hashProcess: {
                key: "Bob",
                hashValue: 67890,
                bucket: 5,
                collision: false,
              },
            },
          },
          {
            id: 4,
            title: "Hash Collision Example",
            description: "Add 'Charlie': 92 - same bucket as existing key",
            code: "student_grades['Charlie'] = 92\n# Hash collision handled internally",
            visualization: {
              type: "hash_table",
              buckets: 8,
              data: { Alice: 95, Bob: 87, Charlie: 92 },
              operation: "collision",
              highlight: [2],
              hashProcess: {
                key: "Charlie",
                hashValue: 54321,
                bucket: 2,
                collision: true,
                resolution: "chaining",
              },
            },
          },
          {
            id: 5,
            title: "Key Lookup",
            description: "Looking up 'Alice' - hash to bucket, compare keys",
            code: "grade = student_grades['Alice']\nprint(f'Alice\\'s grade: {grade}')",
            visualization: {
              type: "hash_table",
              buckets: 8,
              data: { Alice: 95, Bob: 87, Charlie: 92 },
              operation: "lookup",
              highlight: [2],
              searchProcess: {
                key: "Alice",
                bucket: 2,
                found: true,
                value: 95,
                comparisons: 1,
              },
            },
          },
          {
            id: 6,
            title: "Dictionary Resizing",
            description:
              "When load factor gets high, Python resizes the hash table",
            code: "# Adding more entries triggers resize\n# Load factor management keeps operations fast",
            visualization: {
              type: "hash_table_resize",
              oldBuckets: 8,
              newBuckets: 16,
              data: { Alice: 95, Bob: 87, Charlie: 92, Diana: 90, Eve: 88 },
              operation: "resize",
              loadFactor: "62.5% → 31.25%",
            },
          },
        ],
        interactiveElements: [
          {
            type: "key_value_input",
            label: "Add key-value pair",
            keyPlaceholder: "name",
            valuePlaceholder: "grade",
          },
          {
            type: "lookup_input",
            label: "Look up key",
            placeholder: "Alice",
          },
          {
            type: "hash_function_selector",
            label: "Hash function",
            options: ["built-in", "simple", "custom"],
          },
        ],
      },
      learningObjectives: [
        "Understand hash table fundamentals",
        "Learn about hash collisions",
        "Practice dictionary operations",
        "Understand O(1) average complexity",
      ],
      quiz: [
        {
          question: "Why are dictionary lookups typically O(1)?",
          options: [
            "Dictionaries are sorted",
            "Hash functions directly compute bucket positions",
            "Python optimizes them",
            "Keys are integers",
          ],
          correct: 1,
          explanation:
            "Hash functions allow direct computation of where to find a key, avoiding the need to search through all entries.",
        },
        {
          question: "What happens when two keys hash to the same bucket?",
          options: [
            "Error occurs",
            "One key is rejected",
            "Collision resolution strategy is used",
            "Dictionary becomes slower",
          ],
          correct: 2,
          explanation:
            "Python uses collision resolution strategies like chaining to handle multiple keys in the same bucket.",
        },
      ],
    },
    settings: {
      playbackSpeed: "normal",
      allowStepthrough: true,
      showComplexity: true,
      interactive: true,
    },
    isActive: true,
    sortOrder: 5,
  },

  // 6. Function Call Stack Visualization
  {
    title: "Function Call Stack Visualization",
    description:
      "Visualize how Python manages function calls, parameters, and return values using the call stack",
    activityType: "algorithm_visualization",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 32,
    experienceReward: 65,
    estimatedMinutes: 24,
    tags: ["functions", "call-stack", "memory", "execution"],
    content: {
      title: "Function Call Stack Mechanics",
      description:
        "See how Python tracks function calls, local variables, and return addresses",
      algorithm: {
        name: "Function Call Stack",
        complexity: {
          call: "O(1)",
          return: "O(1)",
          space: "O(d) where d is depth",
        },
        steps: [
          {
            id: 1,
            title: "Program Start",
            description: "Program begins with main execution context",
            code: "def calculate_total(a, b, c):\n    return add_two(a, b) + c\n\ndef add_two(x, y):\n    return x + y\n\n# Program starts here\nresult = calculate_total(5, 3, 2)",
            visualization: {
              type: "call_stack",
              stack: [
                {
                  function: "main",
                  variables: { result: "pending" },
                  line: "result = calculate_total(5, 3, 2)",
                },
              ],
              currentExecution: "main",
            },
          },
          {
            id: 2,
            title: "Function Call: calculate_total",
            description: "New frame pushed onto stack with parameters",
            code: "def calculate_total(a, b, c):\n    return add_two(a, b) + c  # About to call add_two",
            visualization: {
              type: "call_stack",
              stack: [
                {
                  function: "main",
                  variables: { result: "pending" },
                  line: "result = calculate_total(5, 3, 2)",
                },
                {
                  function: "calculate_total",
                  variables: { a: 5, b: 3, c: 2 },
                  line: "return add_two(a, b) + c",
                  returnAddress: "main line 6",
                },
              ],
              currentExecution: "calculate_total",
              highlight: "new_frame",
            },
          },
          {
            id: 3,
            title: "Nested Function Call: add_two",
            description: "Another frame pushed for nested function call",
            code: "def add_two(x, y):\n    return x + y  # Executing addition",
            visualization: {
              type: "call_stack",
              stack: [
                {
                  function: "main",
                  variables: { result: "pending" },
                  line: "result = calculate_total(5, 3, 2)",
                },
                {
                  function: "calculate_total",
                  variables: { a: 5, b: 3, c: 2 },
                  line: "return add_two(a, b) + c",
                  returnAddress: "main line 6",
                },
                {
                  function: "add_two",
                  variables: { x: 5, y: 3 },
                  line: "return x + y",
                  returnAddress: "calculate_total line 2",
                },
              ],
              currentExecution: "add_two",
              highlight: "deepest_frame",
            },
          },
          {
            id: 4,
            title: "Function Return: add_two",
            description: "add_two returns 8, frame is popped from stack",
            code: "# add_two(5, 3) returns 8\n# Control returns to calculate_total",
            visualization: {
              type: "call_stack",
              stack: [
                {
                  function: "main",
                  variables: { result: "pending" },
                  line: "result = calculate_total(5, 3, 2)",
                },
                {
                  function: "calculate_total",
                  variables: { a: 5, b: 3, c: 2, temp: 8 },
                  line: "return add_two(a, b) + c",
                  returnAddress: "main line 6",
                },
              ],
              currentExecution: "calculate_total",
              highlight: "return_value",
              returnValue: 8,
            },
          },
          {
            id: 5,
            title: "Complete Calculation",
            description: "calculate_total computes 8 + 2 = 10",
            code: "# return add_two(a, b) + c\n# return 8 + 2 = 10",
            visualization: {
              type: "call_stack",
              stack: [
                {
                  function: "main",
                  variables: { result: "pending" },
                  line: "result = calculate_total(5, 3, 2)",
                },
                {
                  function: "calculate_total",
                  variables: { a: 5, b: 3, c: 2 },
                  line: "return 10",
                  returnAddress: "main line 6",
                },
              ],
              currentExecution: "calculate_total",
              highlight: "final_calculation",
              calculation: "8 + 2 = 10",
            },
          },
          {
            id: 6,
            title: "Return to Main",
            description: "Final return value assigned, stack returns to main",
            code: "result = 10  # Final result\nprint(f'Total: {result}')",
            visualization: {
              type: "call_stack",
              stack: [
                {
                  function: "main",
                  variables: { result: 10 },
                  line: "print(f'Total: {result}')",
                },
              ],
              currentExecution: "main",
              highlight: "complete",
              finalResult: 10,
            },
          },
        ],
        interactiveElements: [
          {
            type: "function_editor",
            label: "Modify function code",
            defaultCode:
              "def calculate_total(a, b, c):\n    return add_two(a, b) + c",
          },
          {
            type: "parameter_input",
            label: "Function parameters",
            parameters: ["a", "b", "c"],
            defaultValues: [5, 3, 2],
          },
        ],
      },
      learningObjectives: [
        "Understand function call stack mechanics",
        "Learn about stack frames and local variables",
        "Practice function parameter passing",
        "Visualize program execution flow",
      ],
      quiz: [
        {
          question: "What happens when a function is called in Python?",
          options: [
            "New variables are created globally",
            "A new stack frame is pushed",
            "Previous functions are deleted",
            "Memory is cleared",
          ],
          correct: 1,
          explanation:
            "Each function call creates a new stack frame containing local variables and execution context.",
        },
        {
          question: "When is a stack frame removed?",
          options: [
            "When the program ends",
            "When the function returns",
            "When memory is full",
            "After 10 seconds",
          ],
          correct: 1,
          explanation:
            "Stack frames are popped (removed) when functions return, restoring the previous execution context.",
        },
      ],
    },
    settings: {
      playbackSpeed: "slow",
      allowStepthrough: true,
      showComplexity: true,
      interactive: true,
    },
    isActive: true,
    sortOrder: 6,
  },

  // DIFFICULTY 3 - INTERMEDIATE (2 activities)

  // 7. Recursion Visualization
  {
    title: "Recursion Algorithm Visualization",
    description:
      "Visualize recursive algorithms and understand the call stack for recursive functions",
    activityType: "algorithm_visualization",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 35,
    experienceReward: 70,
    estimatedMinutes: 26,
    tags: ["recursion", "algorithms", "call-stack", "factorial"],
    content: {
      title: "Recursion and Stack Visualization",
      description:
        "Watch how recursive functions call themselves and build up the call stack",
      algorithm: {
        name: "Recursive Factorial",
        complexity: {
          time: "O(n)",
          space: "O(n)",
        },
        steps: [
          {
            id: 1,
            title: "Initial Call",
            description: "Start with factorial(4) call",
            code: "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nresult = factorial(4)",
            visualization: {
              type: "recursion_stack",
              stack: [
                {
                  function: "main",
                  variables: { result: "pending" },
                  line: "result = factorial(4)",
                },
                {
                  function: "factorial(4)",
                  variables: { n: 4 },
                  line: "return 4 * factorial(3)",
                  state: "calling factorial(3)",
                },
              ],
              treeView: {
                current: "factorial(4)",
                pending: ["factorial(3)"],
              },
            },
          },
          {
            id: 2,
            title: "Recursive Call: factorial(3)",
            description: "factorial(4) calls factorial(3)",
            code: "# factorial(3) is called\n# n = 3, so return 3 * factorial(2)",
            visualization: {
              type: "recursion_stack",
              stack: [
                {
                  function: "main",
                  variables: { result: "pending" },
                  line: "result = factorial(4)",
                },
                {
                  function: "factorial(4)",
                  variables: { n: 4 },
                  line: "return 4 * factorial(3)",
                  state: "waiting for factorial(3)",
                },
                {
                  function: "factorial(3)",
                  variables: { n: 3 },
                  line: "return 3 * factorial(2)",
                  state: "calling factorial(2)",
                },
              ],
              treeView: {
                current: "factorial(3)",
                pending: ["factorial(2)"],
                waiting: ["factorial(4)"],
              },
            },
          },
          {
            id: 3,
            title: "Deeper Recursion",
            description: "Continue with factorial(2) and factorial(1)",
            code: "# factorial(2) calls factorial(1)\n# factorial(1) hits base case",
            visualization: {
              type: "recursion_stack",
              stack: [
                {
                  function: "main",
                  variables: { result: "pending" },
                  line: "result = factorial(4)",
                },
                {
                  function: "factorial(4)",
                  variables: { n: 4 },
                  line: "return 4 * factorial(3)",
                  state: "waiting",
                },
                {
                  function: "factorial(3)",
                  variables: { n: 3 },
                  line: "return 3 * factorial(2)",
                  state: "waiting",
                },
                {
                  function: "factorial(2)",
                  variables: { n: 2 },
                  line: "return 2 * factorial(1)",
                  state: "waiting",
                },
                {
                  function: "factorial(1)",
                  variables: { n: 1 },
                  line: "return 1",
                  state: "base case reached",
                },
              ],
              treeView: {
                current: "factorial(1)",
                baseCase: true,
              },
            },
          },
          {
            id: 4,
            title: "Base Case Reached",
            description: "factorial(1) returns 1, starting the unwinding",
            code: "# Base case: factorial(1) = 1\n# Now we can start calculating backwards",
            visualization: {
              type: "recursion_stack",
              stack: [
                {
                  function: "main",
                  variables: { result: "pending" },
                  line: "result = factorial(4)",
                },
                {
                  function: "factorial(4)",
                  variables: { n: 4 },
                  line: "return 4 * factorial(3)",
                  state: "waiting",
                },
                {
                  function: "factorial(3)",
                  variables: { n: 3 },
                  line: "return 3 * factorial(2)",
                  state: "waiting",
                },
                {
                  function: "factorial(2)",
                  variables: { n: 2 },
                  line: "return 2 * 1 = 2",
                  state: "calculating",
                },
              ],
              treeView: {
                current: "factorial(2)",
                returning: "2",
                completed: ["factorial(1): 1"],
              },
            },
          },
          {
            id: 5,
            title: "Unwinding the Stack",
            description: "Each function calculates its result and returns",
            code: "# factorial(2) = 2 * 1 = 2\n# factorial(3) = 3 * 2 = 6",
            visualization: {
              type: "recursion_stack",
              stack: [
                {
                  function: "main",
                  variables: { result: "pending" },
                  line: "result = factorial(4)",
                },
                {
                  function: "factorial(4)",
                  variables: { n: 4 },
                  line: "return 4 * 6 = 24",
                  state: "calculating",
                },
              ],
              treeView: {
                current: "factorial(4)",
                returning: "24",
                completed: [
                  "factorial(1): 1",
                  "factorial(2): 2",
                  "factorial(3): 6",
                ],
              },
            },
          },
          {
            id: 6,
            title: "Final Result",
            description: "factorial(4) completes and returns 24",
            code: "# factorial(4) = 4 * 6 = 24\n# result = 24",
            visualization: {
              type: "recursion_stack",
              stack: [
                {
                  function: "main",
                  variables: { result: 24 },
                  line: "print(f'4! = {result}')",
                },
              ],
              treeView: {
                completed: [
                  "factorial(1): 1",
                  "factorial(2): 2",
                  "factorial(3): 6",
                  "factorial(4): 24",
                ],
                finalResult: 24,
              },
              calculation: "4! = 4 × 3 × 2 × 1 = 24",
            },
          },
        ],
        interactiveElements: [
          {
            type: "number_input",
            label: "Calculate factorial of",
            defaultValue: 4,
            range: [1, 8],
          },
          {
            type: "recursion_type",
            label: "Choose recursive function",
            options: ["factorial", "fibonacci", "power"],
          },
        ],
      },
      learningObjectives: [
        "Understand recursive function calls",
        "Visualize call stack growth and unwinding",
        "Learn base case importance",
        "Practice recursive thinking",
      ],
      quiz: [
        {
          question: "What prevents infinite recursion?",
          options: [
            "Python's security",
            "Base case condition",
            "Stack overflow",
            "Time limits",
          ],
          correct: 1,
          explanation:
            "Base cases provide stopping conditions that prevent recursive functions from calling themselves forever.",
        },
        {
          question: "Why does recursion use O(n) space?",
          options: [
            "Variables take more space",
            "Each call creates a stack frame",
            "Python is inefficient",
            "Base cases use memory",
          ],
          correct: 1,
          explanation:
            "Each recursive call adds a new frame to the call stack, using space proportional to recursion depth.",
        },
      ],
    },
    settings: {
      playbackSpeed: "slow",
      allowStepthrough: true,
      showComplexity: true,
      interactive: true,
    },
    isActive: true,
    sortOrder: 7,
  },

  // 8. Data Structure Transformation
  {
    title: "Data Structure Transformation Visualization",
    description:
      "Visualize how data transforms between different Python data structures",
    activityType: "algorithm_visualization",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 38,
    experienceReward: 75,
    estimatedMinutes: 28,
    tags: ["data-structures", "transformation", "conversion", "optimization"],
    content: {
      title: "Data Structure Conversions",
      description:
        "Watch how data moves and transforms between lists, sets, dictionaries, and tuples",
      algorithm: {
        name: "Data Transformation Pipeline",
        complexity: {
          list_to_set: "O(n)",
          dict_operations: "O(n)",
          grouping: "O(n)",
        },
        steps: [
          {
            id: 1,
            title: "Original Data",
            description: "Start with a list of student records",
            code: "students = [\n    ('Alice', 'Math', 95),\n    ('Bob', 'Math', 87),\n    ('Alice', 'Physics', 92),\n    ('Charlie', 'Math', 78),\n    ('Bob', 'Physics', 84)\n]",
            visualization: {
              type: "data_list",
              data: [
                { name: "Alice", subject: "Math", grade: 95 },
                { name: "Bob", subject: "Math", grade: 87 },
                { name: "Alice", subject: "Physics", grade: 92 },
                { name: "Charlie", subject: "Math", grade: 78 },
                { name: "Bob", subject: "Physics", grade: 84 },
              ],
              structure: "list_of_tuples",
              highlight: [],
            },
          },
          {
            id: 2,
            title: "Extract Unique Students",
            description: "Use set to find unique student names",
            code: "student_names = set(student[0] for student in students)\nprint(f'Unique students: {student_names}')",
            visualization: {
              type: "transformation",
              source: "list_of_tuples",
              target: "set",
              data: ["Alice", "Bob", "Charlie"],
              process: "extract_unique",
              highlight: ["Alice", "Bob", "Charlie"],
              operation: "set comprehension",
            },
          },
          {
            id: 3,
            title: "Group by Student",
            description: "Transform to dictionary grouped by student name",
            code: "grades_by_student = {}\nfor name, subject, grade in students:\n    if name not in grades_by_student:\n        grades_by_student[name] = []\n    grades_by_student[name].append((subject, grade))",
            visualization: {
              type: "transformation",
              source: "list_of_tuples",
              target: "dictionary",
              data: {
                Alice: [
                  ["Math", 95],
                  ["Physics", 92],
                ],
                Bob: [
                  ["Math", 87],
                  ["Physics", 84],
                ],
                Charlie: [["Math", 78]],
              },
              process: "grouping",
              currentStep: "building_dict",
            },
          },
          {
            id: 4,
            title: "Calculate Averages",
            description:
              "Transform to student averages using dictionary comprehension",
            code: "averages = {\n    name: sum(grade for _, grade in subjects) / len(subjects)\n    for name, subjects in grades_by_student.items()\n}",
            visualization: {
              type: "transformation",
              source: "nested_dictionary",
              target: "simple_dictionary",
              data: {
                Alice: 93.5,
                Bob: 85.5,
                Charlie: 78.0,
              },
              process: "calculation",
              calculations: [
                { name: "Alice", grades: [95, 92], avg: 93.5 },
                { name: "Bob", grades: [87, 84], avg: 85.5 },
                { name: "Charlie", grades: [78], avg: 78.0 },
              ],
            },
          },
          {
            id: 5,
            title: "Sort and Rank",
            description: "Convert to sorted list of tuples for ranking",
            code: "rankings = sorted(averages.items(), key=lambda x: x[1], reverse=True)\nprint('Student rankings:', rankings)",
            visualization: {
              type: "transformation",
              source: "dictionary",
              target: "sorted_list",
              data: [
                { name: "Alice", average: 93.5, rank: 1 },
                { name: "Bob", average: 85.5, rank: 2 },
                { name: "Charlie", average: 78.0, rank: 3 },
              ],
              process: "sorting",
              sortKey: "average",
              order: "descending",
            },
          },
          {
            id: 6,
            title: "Final Report Structure",
            description: "Create final nested structure for reporting",
            code: "final_report = {\n    'summary': {\n        'total_students': len(student_names),\n        'top_student': rankings[0][0],\n        'class_average': sum(averages.values()) / len(averages)\n    },\n    'rankings': rankings,\n    'detailed_grades': grades_by_student\n}",
            visualization: {
              type: "final_structure",
              data: {
                summary: {
                  total_students: 3,
                  top_student: "Alice",
                  class_average: 85.67,
                },
                rankings: [
                  ["Alice", 93.5],
                  ["Bob", 85.5],
                  ["Charlie", 78.0],
                ],
                detailed_grades: "nested data...",
              },
              structure: "complex_nested",
              highlight: "complete_transformation",
            },
          },
        ],
        interactiveElements: [
          {
            type: "data_input",
            label: "Add student record",
            fields: ["name", "subject", "grade"],
          },
          {
            type: "transformation_selector",
            label: "Choose transformation",
            options: [
              "group_by_student",
              "group_by_subject",
              "calculate_stats",
            ],
          },
        ],
      },
      learningObjectives: [
        "Understand data structure conversions",
        "Learn transformation patterns",
        "Practice comprehensions",
        "Master data manipulation pipelines",
      ],
      quiz: [
        {
          question: "Which data structure is best for removing duplicates?",
          options: ["list", "tuple", "set", "dictionary"],
          correct: 2,
          explanation:
            "Sets automatically handle uniqueness, making them perfect for removing duplicates from data.",
        },
        {
          question: "When should you use dictionary comprehension?",
          options: [
            "Always",
            "For simple transformations",
            "Never",
            "Only with strings",
          ],
          correct: 1,
          explanation:
            "Dictionary comprehensions are ideal for simple transformations but can become unreadable for complex logic.",
        },
      ],
    },
    settings: {
      playbackSpeed: "normal",
      allowStepthrough: true,
      showComplexity: true,
      interactive: true,
    },
    isActive: true,
    sortOrder: 8,
  },

  // DIFFICULTY 4 - ADVANCED (2 activities)

  // 9. Memory Management Visualization
  {
    title: "Python Memory Management Visualization",
    description:
      "Visualize how Python manages memory allocation, garbage collection, and object references",
    activityType: "algorithm_visualization",
    category: "Python Fundamentals",
    difficulty: 4,
    diamondReward: 45,
    experienceReward: 85,
    estimatedMinutes: 30,
    tags: ["memory", "garbage-collection", "references", "optimization"],
    content: {
      title: "Memory Management and Garbage Collection",
      description:
        "Understand how Python allocates memory, tracks references, and cleans up unused objects",
      algorithm: {
        name: "Reference Counting & GC",
        complexity: {
          allocation: "O(1)",
          reference_update: "O(1)",
          cycle_detection: "O(n)",
        },
        steps: [
          {
            id: 1,
            title: "Object Creation",
            description: "Create objects and see memory allocation",
            code: "# Creating objects\na = [1, 2, 3]\nb = {'name': 'Alice'}\nc = 'Hello World'",
            visualization: {
              type: "memory_layout",
              heap: [
                {
                  id: "obj1",
                  type: "list",
                  value: [1, 2, 3],
                  address: "0x1000",
                  refs: 1,
                },
                {
                  id: "obj2",
                  type: "dict",
                  value: { name: "Alice" },
                  address: "0x2000",
                  refs: 1,
                },
                {
                  id: "obj3",
                  type: "str",
                  value: "Hello World",
                  address: "0x3000",
                  refs: 1,
                },
              ],
              variables: [
                { name: "a", points_to: "0x1000" },
                { name: "b", points_to: "0x2000" },
                { name: "c", points_to: "0x3000" },
              ],
              operation: "allocation",
            },
          },
          {
            id: 2,
            title: "Reference Counting",
            description: "Multiple variables pointing to same object",
            code: "# Creating additional references\nd = a  # d now points to same list as a\ne = b  # e now points to same dict as b\nprint(f'a is d: {a is d}')  # True",
            visualization: {
              type: "memory_layout",
              heap: [
                {
                  id: "obj1",
                  type: "list",
                  value: [1, 2, 3],
                  address: "0x1000",
                  refs: 2,
                },
                {
                  id: "obj2",
                  type: "dict",
                  value: { name: "Alice" },
                  address: "0x2000",
                  refs: 2,
                },
                {
                  id: "obj3",
                  type: "str",
                  value: "Hello World",
                  address: "0x3000",
                  refs: 1,
                },
              ],
              variables: [
                { name: "a", points_to: "0x1000" },
                { name: "b", points_to: "0x2000" },
                { name: "c", points_to: "0x3000" },
                { name: "d", points_to: "0x1000" },
                { name: "e", points_to: "0x2000" },
              ],
              operation: "reference_increase",
              highlight: ["obj1", "obj2"],
            },
          },
          {
            id: 3,
            title: "Reference Deletion",
            description: "Remove references and see count decrease",
            code: "# Removing references\ndel a  # Remove reference 'a'\ndel e  # Remove reference 'e'\n# Reference counts decrease",
            visualization: {
              type: "memory_layout",
              heap: [
                {
                  id: "obj1",
                  type: "list",
                  value: [1, 2, 3],
                  address: "0x1000",
                  refs: 1,
                },
                {
                  id: "obj2",
                  type: "dict",
                  value: { name: "Alice" },
                  address: "0x2000",
                  refs: 1,
                },
                {
                  id: "obj3",
                  type: "str",
                  value: "Hello World",
                  address: "0x3000",
                  refs: 1,
                },
              ],
              variables: [
                { name: "b", points_to: "0x2000" },
                { name: "c", points_to: "0x3000" },
                { name: "d", points_to: "0x1000" },
              ],
              operation: "reference_decrease",
              deleted_vars: ["a", "e"],
            },
          },
          {
            id: 4,
            title: "Circular References",
            description:
              "Create circular references that normal counting can't handle",
            code: "# Creating circular references\nnode1 = {'value': 1, 'next': None}\nnode2 = {'value': 2, 'next': None}\nnode1['next'] = node2\nnode2['next'] = node1  # Circular reference!",
            visualization: {
              type: "memory_layout",
              heap: [
                {
                  id: "obj1",
                  type: "list",
                  value: [1, 2, 3],
                  address: "0x1000",
                  refs: 1,
                },
                {
                  id: "obj2",
                  type: "dict",
                  value: { name: "Alice" },
                  address: "0x2000",
                  refs: 1,
                },
                {
                  id: "obj3",
                  type: "str",
                  value: "Hello World",
                  address: "0x3000",
                  refs: 1,
                },
                {
                  id: "obj4",
                  type: "dict",
                  value: { value: 1, next: "→obj5" },
                  address: "0x4000",
                  refs: 2,
                },
                {
                  id: "obj5",
                  type: "dict",
                  value: { value: 2, next: "→obj4" },
                  address: "0x5000",
                  refs: 2,
                },
              ],
              variables: [
                { name: "b", points_to: "0x2000" },
                { name: "c", points_to: "0x3000" },
                { name: "d", points_to: "0x1000" },
                { name: "node1", points_to: "0x4000" },
                { name: "node2", points_to: "0x5000" },
              ],
              operation: "circular_reference",
              circular: ["obj4", "obj5"],
            },
          },
          {
            id: 5,
            title: "Garbage Collection Trigger",
            description: "Python's garbage collector detects and cleans cycles",
            code: "# Remove direct references\ndel node1\ndel node2\n# Objects still exist due to circular refs\n# Garbage collector will detect and clean them",
            visualization: {
              type: "memory_layout",
              heap: [
                {
                  id: "obj1",
                  type: "list",
                  value: [1, 2, 3],
                  address: "0x1000",
                  refs: 1,
                },
                {
                  id: "obj2",
                  type: "dict",
                  value: { name: "Alice" },
                  address: "0x2000",
                  refs: 1,
                },
                {
                  id: "obj3",
                  type: "str",
                  value: "Hello World",
                  address: "0x3000",
                  refs: 1,
                },
                {
                  id: "obj4",
                  type: "dict",
                  value: { value: 1, next: "→obj5" },
                  address: "0x4000",
                  refs: 1,
                  status: "unreachable",
                },
                {
                  id: "obj5",
                  type: "dict",
                  value: { value: 2, next: "→obj4" },
                  address: "0x5000",
                  refs: 1,
                  status: "unreachable",
                },
              ],
              variables: [
                { name: "b", points_to: "0x2000" },
                { name: "c", points_to: "0x3000" },
                { name: "d", points_to: "0x1000" },
              ],
              operation: "gc_detection",
              unreachable: ["obj4", "obj5"],
            },
          },
          {
            id: 6,
            title: "Memory Cleanup",
            description: "Garbage collector frees unreachable cyclic objects",
            code: "# Garbage collector runs\nimport gc\ngc.collect()  # Force garbage collection\n# Circular references are cleaned up",
            visualization: {
              type: "memory_layout",
              heap: [
                {
                  id: "obj1",
                  type: "list",
                  value: [1, 2, 3],
                  address: "0x1000",
                  refs: 1,
                },
                {
                  id: "obj2",
                  type: "dict",
                  value: { name: "Alice" },
                  address: "0x2000",
                  refs: 1,
                },
                {
                  id: "obj3",
                  type: "str",
                  value: "Hello World",
                  address: "0x3000",
                  refs: 1,
                },
              ],
              variables: [
                { name: "b", points_to: "0x2000" },
                { name: "c", points_to: "0x3000" },
                { name: "d", points_to: "0x1000" },
              ],
              operation: "cleanup_complete",
              freed_objects: ["obj4", "obj5"],
              memory_saved: "2 objects freed",
            },
          },
        ],
        interactiveElements: [
          {
            type: "object_creator",
            label: "Create objects",
            types: ["list", "dict", "custom_class"],
          },
          {
            type: "reference_manager",
            label: "Manage references",
            actions: ["assign", "delete", "create_cycle"],
          },
          {
            type: "gc_trigger",
            label: "Force garbage collection",
            showStats: true,
          },
        ],
      },
      learningObjectives: [
        "Understand Python's memory model",
        "Learn about reference counting",
        "Recognize circular reference problems",
        "Practice memory optimization",
      ],
      quiz: [
        {
          question: "When does Python automatically free memory?",
          options: [
            "Every 10 seconds",
            "When reference count reaches 0",
            "Only when program ends",
            "When manually requested",
          ],
          correct: 1,
          explanation:
            "Python uses reference counting to automatically free objects when no references remain.",
        },
        {
          question: "Why do circular references need special handling?",
          options: [
            "They're invalid",
            "Reference counting can't detect them",
            "They use more memory",
            "They're faster",
          ],
          correct: 1,
          explanation:
            "Objects in cycles maintain positive reference counts even when unreachable, requiring cycle detection.",
        },
      ],
    },
    settings: {
      playbackSpeed: "normal",
      allowStepthrough: true,
      showComplexity: true,
      interactive: true,
    },
    isActive: true,
    sortOrder: 9,
  },

  // 10. Algorithm Complexity Analysis
  {
    title: "Algorithm Complexity Analysis Visualization",
    description:
      "Visualize and compare time and space complexity of different algorithms",
    activityType: "algorithm_visualization",
    category: "Python Fundamentals",
    difficulty: 4,
    diamondReward: 50,
    experienceReward: 90,
    estimatedMinutes: 32,
    tags: ["complexity", "big-o", "performance", "analysis"],
    content: {
      title: "Big-O Complexity Analysis",
      description:
        "Compare algorithm performance characteristics and understand complexity analysis",
      algorithm: {
        name: "Complexity Comparison",
        complexity: {
          demonstration: "Various O(1) to O(n²)",
        },
        steps: [
          {
            id: 1,
            title: "Constant Time - O(1)",
            description:
              "Operations that take the same time regardless of input size",
            code: "# O(1) - Dictionary lookup\ndef get_grade(student_grades, name):\n    return student_grades[name]  # Always same time\n\n# Example\ngrades = {'Alice': 95, 'Bob': 87, 'Charlie': 92}\nresult = get_grade(grades, 'Alice')",
            visualization: {
              type: "complexity_graph",
              algorithm: "dictionary_lookup",
              complexity: "O(1)",
              input_sizes: [10, 100, 1000, 10000],
              execution_times: [1, 1, 1, 1],
              graph_type: "flat_line",
              highlight: "constant_time",
            },
          },
          {
            id: 2,
            title: "Linear Time - O(n)",
            description: "Time grows proportionally with input size",
            code: "# O(n) - Linear search\ndef find_student(students, target_name):\n    for student in students:  # Must check each one\n        if student['name'] == target_name:\n            return student\n    return None\n\n# Time depends on list size",
            visualization: {
              type: "complexity_graph",
              algorithm: "linear_search",
              complexity: "O(n)",
              input_sizes: [10, 100, 1000, 10000],
              execution_times: [1, 10, 100, 1000],
              graph_type: "linear_line",
              highlight: "linear_growth",
            },
          },
          {
            id: 3,
            title: "Logarithmic Time - O(log n)",
            description: "Time grows slowly as input size increases",
            code: "# O(log n) - Binary search (on sorted list)\ndef binary_search(sorted_list, target):\n    left, right = 0, len(sorted_list) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if sorted_list[mid] == target:\n            return mid\n        elif sorted_list[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1",
            visualization: {
              type: "complexity_graph",
              algorithm: "binary_search",
              complexity: "O(log n)",
              input_sizes: [10, 100, 1000, 10000],
              execution_times: [3.3, 6.6, 10, 13.3],
              graph_type: "logarithmic_curve",
              highlight: "log_growth",
              demonstration: {
                array: [1, 3, 5, 7, 9, 11, 13, 15],
                target: 7,
                steps: ["Check middle", "Go left half", "Found!"],
              },
            },
          },
          {
            id: 4,
            title: "Quadratic Time - O(n²)",
            description: "Time grows as square of input size",
            code: "# O(n²) - Bubble sort\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):           # Outer loop: n times\n        for j in range(n - i - 1): # Inner loop: up to n times\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\n\n# Nested loops create quadratic complexity",
            visualization: {
              type: "complexity_graph",
              algorithm: "bubble_sort",
              complexity: "O(n²)",
              input_sizes: [10, 100, 1000, 10000],
              execution_times: [100, 10000, 1000000, 100000000],
              graph_type: "quadratic_curve",
              highlight: "quadratic_growth",
              warning: "Becomes very slow for large inputs",
            },
          },
          {
            id: 5,
            title: "Space Complexity Analysis",
            description: "Analyze memory usage patterns",
            code: "# Space complexity examples\n\n# O(1) space - In-place operations\ndef reverse_in_place(arr):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        arr[left], arr[right] = arr[right], arr[left]\n        left += 1\n        right -= 1\n\n# O(n) space - Creating new structure\ndef reverse_with_copy(arr):\n    return arr[::-1]  # Creates new array",
            visualization: {
              type: "space_analysis",
              algorithms: [
                {
                  name: "In-place reversal",
                  space_complexity: "O(1)",
                  memory_usage: [1, 1, 1, 1],
                  description: "Uses only a few variables",
                },
                {
                  name: "Copy reversal",
                  space_complexity: "O(n)",
                  memory_usage: [10, 100, 1000, 10000],
                  description: "Creates copy of input",
                },
              ],
              input_sizes: [10, 100, 1000, 10000],
            },
          },
          {
            id: 6,
            title: "Complexity Comparison",
            description: "Compare all complexities on the same scale",
            code: "# Performance comparison for n = 1000\n# O(1):     1 operation\n# O(log n): 10 operations\n# O(n):     1,000 operations\n# O(n²):    1,000,000 operations\n\n# Choose algorithms wisely!",
            visualization: {
              type: "complexity_comparison",
              input_size: 1000,
              algorithms: [
                {
                  name: "Dictionary lookup",
                  complexity: "O(1)",
                  operations: 1,
                  color: "green",
                },
                {
                  name: "Binary search",
                  complexity: "O(log n)",
                  operations: 10,
                  color: "blue",
                },
                {
                  name: "Linear search",
                  complexity: "O(n)",
                  operations: 1000,
                  color: "yellow",
                },
                {
                  name: "Bubble sort",
                  complexity: "O(n²)",
                  operations: 1000000,
                  color: "red",
                },
              ],
              scale: "logarithmic",
              recommendation: "Always prefer lower complexity when possible",
            },
          },
        ],
        interactiveElements: [
          {
            type: "input_size_slider",
            label: "Input size (n)",
            range: [10, 10000],
            defaultValue: 1000,
          },
          {
            type: "algorithm_selector",
            label: "Compare algorithms",
            options: ["all", "search_only", "sort_only", "custom"],
          },
          {
            type: "complexity_calculator",
            label: "Calculate operations",
            showMath: true,
          },
        ],
      },
      learningObjectives: [
        "Understand Big-O notation",
        "Compare algorithm efficiencies",
        "Recognize complexity patterns",
        "Make informed algorithm choices",
      ],
      quiz: [
        {
          question: "Which complexity is better for large datasets?",
          options: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"],
          correct: 3,
          explanation:
            "O(log n) grows the slowest and handles large datasets most efficiently.",
        },
        {
          question: "What does O(n²) typically indicate?",
          options: [
            "Very efficient",
            "Nested loops",
            "Sorted data",
            "Constant time",
          ],
          correct: 1,
          explanation:
            "O(n²) complexity often results from nested loops that process data combinations.",
        },
        {
          question: "Why is space complexity important?",
          options: [
            "It affects speed",
            "Memory is limited",
            "Python requires it",
            "It's always O(1)",
          ],
          correct: 1,
          explanation:
            "Space complexity matters because memory is a finite resource, especially for large datasets.",
        },
      ],
    },
    settings: {
      playbackSpeed: "normal",
      allowStepthrough: true,
      showComplexity: true,
      interactive: true,
    },
    isActive: true,
    sortOrder: 10,
  },
];

export async function seedAlgorithmVisualizationPythonFundamentalsActivities() {
  console.log(
    "🎯 Seeding Algorithm Visualization Python Fundamentals activities..."
  );

  if (algorithmVisualizationPythonFundamentalsActivities.length === 0) {
    console.log(
      "📝 No Algorithm Visualization Python Fundamentals activities to seed"
    );
    return;
  }

  for (const activity of algorithmVisualizationPythonFundamentalsActivities) {
    await prisma.learningActivity.create({
      data: {
        title: activity.title,
        description: activity.description,
        activityType: activity.activityType,
        category: activity.category,
        difficulty: activity.difficulty,
        diamondReward: activity.diamondReward,
        experienceReward: activity.experienceReward,
        estimatedMinutes: activity.estimatedMinutes,
        content: JSON.stringify(activity.content),
        tags: JSON.stringify(activity.tags),
        isActive: activity.isActive,
        sortOrder: activity.sortOrder,
      },
    });
  }

  console.log(
    `✅ ${algorithmVisualizationPythonFundamentalsActivities.length} Algorithm Visualization Python Fundamentals activities seeded successfully`
  );
}

// Execute the seeding function if this file is run directly
if (require.main === module) {
  seedAlgorithmVisualizationPythonFundamentalsActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Algorithm Visualization Python Fundamentals activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
