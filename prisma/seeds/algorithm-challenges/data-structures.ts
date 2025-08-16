import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * DATA STRUCTURES - Detailed Algorithm Visualization Challenges
 *
 * These challenges provide step-by-step visual explanations of fundamental data structures
 * with detailed analysis, operations, and interactive learning objectives.
 */

export const dataStructureChallenges = [
  // 1) STACK - LIFO Data Structure
  {
    id: "stack-operations-detailed-viz",
    title: "Stack Operations: LIFO in Action",
    slug: "stack-operations-step-by-step",
    description:
      "Master stack operations through detailed visualization - see push, pop, peek, and understand why LIFO (Last In, First Out) is fundamental to many algorithms.",
    content: {
      algorithm: "Stack Operations",
      description:
        "Watch how stack LIFO operations work step by step with interactive visualization",
      timeComplexity: "O(1) per operation",
      spaceComplexity: "O(n)",
      explanation:
        "Stack follows Last In, First Out (LIFO) principle. Elements are added and removed from the top only, like a stack of plates.",
      steps: [
        {
          id: 1,
          description: "Initialize empty stack - LIFO data structure",
          data: [],
          highlights: [],
          comparison: [],
          action: "Stack initialized with capacity. LIFO = Last In, First Out",
        },
        {
          id: 2,
          description: "Understanding LIFO principle before operations",
          data: [],
          highlights: [],
          comparison: [],
          action:
            "Like a stack of plates - you can only add/remove from the top",
        },
        {
          id: 3,
          description: "Push(5) - First element goes to bottom",
          data: [5],
          highlights: [0],
          comparison: [],
          action: "Bottom element: 5, Top element: 5, Size: 1",
        },
        {
          id: 4,
          description: "Push(3) - Stack grows upward",
          data: [5, 3],
          highlights: [1],
          comparison: [],
          action: "New element 3 becomes top, 5 moves down, Size: 2",
        },
        {
          id: 5,
          description: "Push(8) - Third element added to top",
          data: [5, 3, 8],
          highlights: [2],
          comparison: [],
          action: "Top: 8, Middle: 3, Bottom: 5, Size: 3",
        },
        {
          id: 6,
          description: "Push(1) - Stack continues growing",
          data: [5, 3, 8, 1],
          highlights: [3],
          comparison: [],
          action: "Stack height increases: [5,3,8,1], Top element: 1",
        },
        {
          id: 7,
          description: "Peek() - Examine top without modifying",
          data: [5, 3, 8, 1],
          highlights: [3],
          comparison: [3],
          action: "Peek operation returns 1, stack remains unchanged",
        },
        {
          id: 8,
          description: "Peek() again - Non-destructive operation",
          data: [5, 3, 8, 1],
          highlights: [3],
          comparison: [3],
          action: "Multiple peeks allowed - still returns 1, size: 4",
        },
        {
          id: 9,
          description: "Pop() - Remove top element (LIFO principle)",
          data: [5, 3, 8],
          highlights: [2],
          comparison: [],
          action: "Removed 1 (last in, first out), new top: 8",
        },
        {
          id: 10,
          description: "Push(7) - Interleave push with pops",
          data: [5, 3, 8, 7],
          highlights: [3],
          comparison: [],
          action: "Added 7 to top, demonstrating dynamic stack operations",
        },
        {
          id: 11,
          description: "Push(4) - Stack grows again",
          data: [5, 3, 8, 7, 4],
          highlights: [4],
          comparison: [],
          action: "Stack now has 5 elements, top: 4, bottom: 5",
        },
        {
          id: 12,
          description: "Pop() - Remove newest element",
          data: [5, 3, 8, 7],
          highlights: [3],
          comparison: [],
          action: "Popped 4, new top: 7, size decreases to 4",
        },
        {
          id: 13,
          description: "Pop() - Continue unwinding stack",
          data: [5, 3, 8],
          highlights: [2],
          comparison: [],
          action: "Popped 7, new top: 8, reverse order of insertion",
        },
        {
          id: 14,
          description: "Peek() on smaller stack",
          data: [5, 3, 8],
          highlights: [2],
          comparison: [2],
          action: "Current top element: 8, 3 elements remaining",
        },
        {
          id: 15,
          description: "Pop() - Remove third element",
          data: [5, 3],
          highlights: [1],
          comparison: [],
          action: "Popped 8, down to original 2 elements, top: 3",
        },
        {
          id: 16,
          description: "Pop() - Remove second element",
          data: [5],
          highlights: [0],
          comparison: [],
          action: "Popped 3, only bottom element 5 remains",
        },
        {
          id: 17,
          description: "Pop() - Remove last element",
          data: [],
          highlights: [],
          comparison: [],
          action: "Popped 5, stack is now empty - back to initial state",
        },
        {
          id: 18,
          description: "Stack underflow demonstration",
          data: [],
          highlights: [],
          comparison: [],
          action: "Attempting pop() on empty stack causes underflow error",
        },
        {
          id: 19,
          description: "LIFO principle summary",
          data: [],
          highlights: [],
          comparison: [],
          action: "Complete cycle: Last element pushed = First element popped",
        },
      ],
    },
    difficulty: 1,
    order: 1,
    duration: 18,
    category: "Algorithms",
    hasCodeExercise: true,
    starterCode: `# Implement Stack with Detailed Visualization
class StackVisualized:
    """
    Stack implementation with step-by-step tracking for visualization
    """
    
    def __init__(self):
        # TODO: Initialize the stack data structure
        # You can use a list as the underlying storage
        # Also initialize tracking variables for visualization
        pass
    
    def push(self, item):
        """
        Add item to the top of the stack
        Record the operation for visualization
        """
        # TODO: Implement push operation
        # - Add item to the top of the stack
        # - Update size counter
        # - Record this operation step
        pass
    
    def pop(self):
        """
        Remove and return the top item from the stack
        Record the operation for visualization
        """
        # TODO: Implement pop operation
        # - Check if stack is empty (raise exception if so)
        # - Remove and return top item
        # - Update size counter
        # - Record this operation step
        pass
    
    def peek(self):
        """
        Return the top item without removing it
        Record the operation for visualization
        """
        # TODO: Implement peek operation
        # - Check if stack is empty (return None or raise exception)
        # - Return top item without removing
        # - Record this operation step
        pass
    
    def is_empty(self):
        """Check if stack is empty"""
        # TODO: Return True if stack is empty, False otherwise
        pass
    
    def size(self):
        """Return number of elements in stack"""
        # TODO: Return the current size of the stack
        pass
    
    def get_visualization_steps(self):
        """Return all recorded steps for visualization"""
        # TODO: Return the list of all operations performed
        pass
    
    def __str__(self):
        """String representation of stack (top to bottom)"""
        # TODO: Return string showing stack contents
        # Format: [top] element1, element2, element3 [bottom]
        pass

# Test your stack implementation
print("🔄 STACK OPERATIONS VISUALIZATION")
print("=" * 50)

stack = StackVisualized()

# Test basic operations
operations = [
    ("push", 5),
    ("push", 3),
    ("push", 8),
    ("peek", None),
    ("pop", None),
    ("push", 1),
    ("pop", None),
    ("pop", None),
    ("is_empty", None),
    ("pop", None)  # This should handle empty stack
]

for op, value in operations:
    print(f"\\n➡️ Operation: {op}({value if value is not None else ''})")
    
    try:
        if op == "push":
            stack.push(value)
            print(f"   Pushed {value}")
        elif op == "pop":
            result = stack.pop()
            print(f"   Popped: {result}")
        elif op == "peek":
            result = stack.peek()
            print(f"   Top element: {result}")
        elif op == "is_empty":
            result = stack.is_empty()
            print(f"   Is empty: {result}")
    
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print(f"   Stack: {stack}")
    print(f"   Size: {stack.size()}")

# Show all steps
print("\\n" + "=" * 50)
print("📊 COMPLETE OPERATION HISTORY:")
steps = stack.get_visualization_steps()
for i, step in enumerate(steps, 1):
    print(f"Step {i}: {step}")`,
    solutionCode: `class StackVisualized:
    """
    Stack implementation with step-by-step tracking for visualization
    """
    
    def __init__(self):
        self.items = []  # List to store stack elements
        self.steps = []  # Track operations for visualization
        self.operation_count = 0
    
    def push(self, item):
        """Add item to the top of the stack"""
        self.items.append(item)
        self.operation_count += 1
        
        step = {
            'operation': 'push',
            'value': item,
            'stack_before': self.items[:-1].copy(),
            'stack_after': self.items.copy(),
            'size_before': len(self.items) - 1,
            'size_after': len(self.items),
            'description': f"Pushed {item} onto stack. New top: {item}"
        }
        self.steps.append(step)
    
    def pop(self):
        """Remove and return the top item from the stack"""
        if self.is_empty():
            error_step = {
                'operation': 'pop',
                'value': None,
                'stack_before': self.items.copy(),
                'stack_after': self.items.copy(),
                'size_before': len(self.items),
                'size_after': len(self.items),
                'description': "❌ Cannot pop from empty stack (Stack Underflow)"
            }
            self.steps.append(error_step)
            raise IndexError("Cannot pop from empty stack")
        
        stack_before = self.items.copy()
        popped_item = self.items.pop()
        self.operation_count += 1
        
        step = {
            'operation': 'pop',
            'value': popped_item,
            'stack_before': stack_before,
            'stack_after': self.items.copy(),
            'size_before': len(stack_before),
            'size_after': len(self.items),
            'description': f"Popped {popped_item} from stack. New top: {self.items[-1] if self.items else 'None (empty)'}"
        }
        self.steps.append(step)
        return popped_item
    
    def peek(self):
        """Return the top item without removing it"""
        if self.is_empty():
            step = {
                'operation': 'peek',
                'value': None,
                'stack_before': self.items.copy(),
                'stack_after': self.items.copy(),
                'size_before': len(self.items),
                'size_after': len(self.items),
                'description': "❌ Cannot peek empty stack"
            }
            self.steps.append(step)
            return None
        
        top_item = self.items[-1]
        step = {
            'operation': 'peek',
            'value': top_item,
            'stack_before': self.items.copy(),
            'stack_after': self.items.copy(),
            'size_before': len(self.items),
            'size_after': len(self.items),
            'description': f"Peeked at top element: {top_item} (not removed)"
        }
        self.steps.append(step)
        return top_item
    
    def is_empty(self):
        """Check if stack is empty"""
        return len(self.items) == 0
    
    def size(self):
        """Return number of elements in stack"""
        return len(self.items)
    
    def get_visualization_steps(self):
        """Return all recorded steps for visualization"""
        return self.steps.copy()
    
    def __str__(self):
        """String representation of stack (top to bottom)"""
        if self.is_empty():
            return "[] (empty stack)"
        
        # Show stack with top element first
        return f"[{' → '.join(str(item) for item in reversed(self.items))}] (top → bottom)"`,
    testCases: [
      {
        input: [["push", 5], ["push", 3], ["pop"], ["peek"]],
        expected: [null, null, 3, 5],
        description: "Basic push, pop, peek operations",
      },
      {
        input: [
          ["push", 1],
          ["push", 2],
          ["push", 3],
          ["pop"],
          ["pop"],
          ["pop"],
          ["is_empty"],
        ],
        expected: [null, null, null, 3, 2, 1, true],
        description: "Fill stack then empty it completely",
      },
      {
        input: [["pop"]],
        expected: ["error"],
        description: "Pop from empty stack should raise error",
      },
      {
        input: [["peek"]],
        expected: [null],
        description: "Peek at empty stack should return None",
      },
      {
        input: [["push", 10], ["size"], ["push", 20], ["size"]],
        expected: [null, 1, null, 2],
        description: "Size tracking during operations",
      },
    ],
    diamondReward: 45,
    experienceReward: 90,
    isPublished: true,
    tags: ["Data Structures", "Stack", "LIFO", "Linear", "O(1)", "Beginner"],
    learningObjectives: [
      "Understand LIFO (Last In, First Out) principle",
      "Master stack push, pop, and peek operations",
      "Learn stack overflow and underflow conditions",
      "Visualize stack growth and shrinkage patterns",
      "Recognize real-world stack applications",
      "Practice implementing fundamental data structures",
    ],
  },

  // 2) QUEUE - FIFO Data Structure
  {
    id: "queue-operations-detailed-viz",
    title: "Queue Operations: FIFO in Action",
    slug: "queue-operations-step-by-step",
    description:
      "Master queue operations through detailed visualization - see enqueue, dequeue, and understand why FIFO (First In, First Out) is essential for scheduling and buffering.",
    content: {
      algorithm: "Queue Operations",
      description:
        "Watch how queue FIFO operations work step by step with interactive visualization",
      timeComplexity: "O(1) per operation",
      spaceComplexity: "O(n)",
      explanation:
        "Queue follows First In, First Out (FIFO) principle. Elements are added at rear and removed from front, like a line of people waiting.",
      steps: [
        {
          id: 1,
          description: "Initialize empty queue - FIFO data structure",
          data: [],
          highlights: [],
          comparison: [],
          action: "Queue initialized. FIFO = First In, First Out",
        },
        {
          id: 2,
          description: "Understanding FIFO principle",
          data: [],
          highlights: [],
          comparison: [],
          action: "Like a line at store - first person in line served first",
        },
        {
          id: 3,
          description: "Enqueue(5) - First element becomes both front and rear",
          data: [5],
          highlights: [0],
          comparison: [],
          action: "Front pointer: 5, Rear pointer: 5, Size: 1",
        },
        {
          id: 4,
          description: "Enqueue(3) - Queue grows at rear end",
          data: [5, 3],
          highlights: [1],
          comparison: [],
          action: "Front: 5 (unchanged), Rear: 3 (moved), Size: 2",
        },
        {
          id: 5,
          description: "Enqueue(8) - Third element joins the line",
          data: [5, 3, 8],
          highlights: [2],
          comparison: [],
          action: "Front: 5, Middle: 3, Rear: 8, Size: 3",
        },
        {
          id: 6,
          description: "Enqueue(1) - Queue continues growing at rear",
          data: [5, 3, 8, 1],
          highlights: [3],
          comparison: [],
          action: "Front: 5, Rear: 1, Total elements: 4",
        },
        {
          id: 7,
          description: "Front() - Peek at first-in-line without removing",
          data: [5, 3, 8, 1],
          highlights: [0],
          comparison: [0],
          action: "Front operation returns 5, queue unchanged",
        },
        {
          id: 8,
          description: "Rear() - Check last element in line",
          data: [5, 3, 8, 1],
          highlights: [3],
          comparison: [3],
          action: "Rear operation returns 1, queue structure intact",
        },
        {
          id: 9,
          description: "Dequeue() - Remove front element (FIFO principle)",
          data: [3, 8, 1],
          highlights: [0],
          comparison: [],
          action: "Dequeued 5 (first in, first out), new front: 3",
        },
        {
          id: 10,
          description: "Enqueue(7) - Add while others are being served",
          data: [3, 8, 1, 7],
          highlights: [3],
          comparison: [],
          action: "7 joins rear of queue, front still: 3",
        },
        {
          id: 11,
          description: "Dequeue() - Serve next person in line",
          data: [8, 1, 7],
          highlights: [0],
          comparison: [],
          action: "Dequeued 3 (second in, second out), front: 8",
        },
        {
          id: 12,
          description: "Enqueue(4) - Queue grows while shrinking",
          data: [8, 1, 7, 4],
          highlights: [3],
          comparison: [],
          action: "4 joins queue at rear, demonstrating dynamic operations",
        },
        {
          id: 13,
          description: "Front() vs Rear() - Check both ends",
          data: [8, 1, 7, 4],
          highlights: [0, 3],
          comparison: [0, 3],
          action: "Front: 8 (next to serve), Rear: 4 (last to serve)",
        },
        {
          id: 14,
          description: "Dequeue() - Continue serving in order",
          data: [1, 7, 4],
          highlights: [0],
          comparison: [],
          action: "Dequeued 8 (third in, third out), front: 1",
        },
        {
          id: 15,
          description: "Dequeue() - Maintaining FIFO order",
          data: [7, 4],
          highlights: [0],
          comparison: [],
          action: "Dequeued 1 (fourth in, fourth out), front: 7",
        },
        {
          id: 16,
          description: "Enqueue(9) - Last addition to demonstrate",
          data: [7, 4, 9],
          highlights: [2],
          comparison: [],
          action: "9 joins at rear, queue now has 3 elements",
        },
        {
          id: 17,
          description: "Dequeue() - Near end of queue processing",
          data: [4, 9],
          highlights: [0],
          comparison: [],
          action: "Dequeued 7, only elements 4 and 9 remain",
        },
        {
          id: 18,
          description: "Dequeue() - Process remaining elements",
          data: [9],
          highlights: [0],
          comparison: [],
          action: "Dequeued 4, only 9 remains (last in, last out)",
        },
        {
          id: 19,
          description: "Dequeue() - Empty the queue",
          data: [],
          highlights: [],
          comparison: [],
          action: "Dequeued 9, queue is empty - back to initial state",
        },
        {
          id: 20,
          description: "Queue underflow demonstration",
          data: [],
          highlights: [],
          comparison: [],
          action: "Attempting dequeue() on empty queue causes underflow error",
        },
        {
          id: 21,
          description: "FIFO principle summary",
          data: [],
          highlights: [],
          comparison: [],
          action:
            "Complete cycle: First element enqueued = First element dequeued",
        },
      ],
    },
    difficulty: 1,
    order: 2,
    duration: 20,
    category: "Algorithms",
    hasCodeExercise: true,
    starterCode: `# Implement Queue with Detailed Visualization
class QueueVisualized:
    """
    Queue implementation with step-by-step tracking for visualization
    """
    
    def __init__(self):
        # TODO: Initialize the queue data structure
        pass
    
    def enqueue(self, item):
        """Add item to the rear of the queue"""
        # TODO: Implement enqueue operation
        pass
    
    def dequeue(self):
        """Remove and return the front item from the queue"""
        # TODO: Implement dequeue operation
        pass
    
    def front(self):
        """Return the front item without removing it"""
        # TODO: Implement front operation
        pass
    
    def rear(self):
        """Return the rear item without removing it"""
        # TODO: Implement rear operation
        pass
    
    def is_empty(self):
        """Check if queue is empty"""
        # TODO: Return True if queue is empty, False otherwise
        pass
    
    def size(self):
        """Return number of elements in queue"""
        # TODO: Return the current size of the queue
        pass
    
    def get_visualization_steps(self):
        """Return all recorded steps for visualization"""
        # TODO: Return the list of all operations performed
        pass
    
    def __str__(self):
        """String representation of queue (front to rear)"""
        # TODO: Return string showing queue contents
        pass

# Test your queue implementation
print("🔄 QUEUE OPERATIONS VISUALIZATION")
print("=" * 50)

queue = QueueVisualized()

operations = [
    ("enqueue", 5),
    ("enqueue", 3),
    ("enqueue", 8),
    ("front", None),
    ("rear", None),
    ("dequeue", None),
    ("enqueue", 1),
    ("dequeue", None),
    ("front", None),
    ("dequeue", None),
    ("is_empty", None),
    ("dequeue", None)
]

for op, value in operations:
    print(f"\\nOperation: {op}({value if value is not None else ''})")
    
    try:
        if op == "enqueue":
            queue.enqueue(value)
            print(f"   Enqueued {value}")
        elif op == "dequeue":
            result = queue.dequeue()
            print(f"   Dequeued: {result}")
        elif op == "front":
            result = queue.front()
            print(f"   Front element: {result}")
        elif op == "rear":
            result = queue.rear()
            print(f"   Rear element: {result}")
        elif op == "is_empty":
            result = queue.is_empty()
            print(f"   Is empty: {result}")
    
    except Exception as e:
        print(f"   Error: {e}")
    
    print(f"   Queue: {queue}")
    print(f"   Size: {queue.size()}")`,
    solutionCode: `class QueueVisualized:
    """
    Queue implementation with step-by-step tracking for visualization
    """
    
    def __init__(self):
        self.items = []
        self.front_index = 0
        self.steps = []
        self.operation_count = 0
    
    def enqueue(self, item):
        """Add item to the rear of the queue"""
        self.items.append(item)
        self.operation_count += 1
        
        step = {
            'operation': 'enqueue',
            'value': item,
            'queue_before': self._get_current_queue()[:-1],
            'queue_after': self._get_current_queue(),
            'front_index': self.front_index,
            'size_before': len(self._get_current_queue()) - 1,
            'size_after': len(self._get_current_queue()),
            'description': f"Enqueued {item} at rear. Queue size now: {self.size()}"
        }
        self.steps.append(step)
    
    def dequeue(self):
        """Remove and return the front item from the queue"""
        if self.is_empty():
            error_step = {
                'operation': 'dequeue',
                'value': None,
                'description': "Cannot dequeue from empty queue"
            }
            self.steps.append(error_step)
            raise IndexError("Cannot dequeue from empty queue")
        
        front_item = self.items[self.front_index]
        self.front_index += 1
        self.operation_count += 1
        
        if self.front_index >= len(self.items):
            self.items = []
            self.front_index = 0
        
        step = {
            'operation': 'dequeue',
            'value': front_item,
            'description': f"Dequeued {front_item} from front"
        }
        self.steps.append(step)
        return front_item
    
    def front(self):
        """Return the front item without removing it"""
        if self.is_empty():
            return None
        return self.items[self.front_index]
    
    def rear(self):
        """Return the rear item without removing it"""
        if self.is_empty():
            return None
        return self.items[-1]
    
    def is_empty(self):
        """Check if queue is empty"""
        return self.front_index >= len(self.items)
    
    def size(self):
        """Return number of elements in queue"""
        if self.is_empty():
            return 0
        return len(self.items) - self.front_index
    
    def _get_current_queue(self):
        """Helper method to get current queue contents"""
        if self.is_empty():
            return []
        return self.items[self.front_index:]
    
    def get_visualization_steps(self):
        """Return all recorded steps for visualization"""
        return self.steps.copy()
    
    def __str__(self):
        """String representation of queue (front to rear)"""
        if self.is_empty():
            return "[] (empty queue)"
        
        current_queue = self._get_current_queue()
        return f"Front -> [{', '.join(str(item) for item in current_queue)}] <- Rear"`,
    testCases: [
      {
        input: [["enqueue", 5], ["enqueue", 3], ["dequeue"], ["front"]],
        expected: [null, null, 5, 3],
        description: "Basic FIFO behavior - first in, first out",
      },
      {
        input: [
          ["enqueue", 1],
          ["enqueue", 2],
          ["enqueue", 3],
          ["dequeue"],
          ["dequeue"],
          ["dequeue"],
          ["is_empty"],
        ],
        expected: [null, null, null, 1, 2, 3, true],
        description: "Fill queue then empty it - maintains order",
      },
      {
        input: [["dequeue"]],
        expected: ["error"],
        description: "Dequeue from empty queue should raise error",
      },
      {
        input: [["front"], ["rear"]],
        expected: [null, null],
        description: "Front/rear of empty queue should return None",
      },
      {
        input: [["enqueue", 10], ["size"], ["enqueue", 20], ["rear"], ["size"]],
        expected: [null, 1, null, 20, 2],
        description: "Size and rear tracking during operations",
      },
    ],
    diamondReward: 50,
    experienceReward: 95,
    isPublished: true,
    tags: ["Data Structures", "Queue", "FIFO", "Linear", "O(1)", "Beginner"],
    learningObjectives: [
      "Understand FIFO (First In, First Out) principle",
      "Master queue enqueue, dequeue, front, and rear operations",
      "Learn queue overflow and underflow conditions",
      "Visualize queue growth at rear and shrinkage at front",
      "Recognize real-world queue applications and scheduling",
      "Compare and contrast queue vs stack behaviors",
    ],
  },

  // 3) LINKED LIST - Dynamic Linear Data Structure
  {
    id: "linked-list-operations-detailed-viz",
    title: "Linked List Operations: Dynamic Node Management",
    slug: "linked-list-operations-step-by-step",
    description:
      "Master linked list operations through detailed visualization - see node creation, insertion, deletion, and traversal in a dynamic data structure.",
    content: {
      algorithm: "Linked List Operations",
      description:
        "Watch how linked list operations work step by step with dynamic node management",
      timeComplexity:
        "O(1) insertion/deletion at head, O(n) at arbitrary position",
      spaceComplexity: "O(n)",
      explanation:
        "Linked List stores elements in nodes, each containing data and a pointer to the next node. Allows dynamic memory allocation and efficient insertion/deletion.",
      steps: [
        {
          id: 1,
          description: "Initialize empty linked list - Dynamic data structure",
          data: [],
          highlights: [],
          comparison: [],
          action: "Head pointer: null, Size: 0, Dynamic memory allocation",
        },
        {
          id: 2,
          description: "Understanding node structure before operations",
          data: [],
          highlights: [],
          comparison: [],
          action:
            "Each node contains: [data | next pointer] -> [data | next] -> null",
        },
        {
          id: 3,
          description: "Insert(5) at beginning - First node creation",
          data: [5],
          highlights: [0],
          comparison: [],
          action: "Created first node: [5 | null], Head points to node 5",
        },
        {
          id: 4,
          description: "Insert(3) at beginning - New head node",
          data: [3, 5],
          highlights: [0],
          comparison: [],
          action: "New node [3 | *] -> [5 | null], Head updated to node 3",
        },
        {
          id: 5,
          description: "Insert(8) at end - Traverse to find tail",
          data: [3, 5, 8],
          highlights: [2],
          comparison: [],
          action: "Traversed to end, created [8 | null], linked after node 5",
        },
        {
          id: 6,
          description: "Insert(1) at position 2 - Middle insertion",
          data: [3, 5, 1, 8],
          highlights: [2],
          comparison: [],
          action: "Traversed to position 1, inserted [1 | *] between 5 and 8",
        },
        {
          id: 7,
          description: "Search(5) - Linear traversal from head",
          data: [3, 5, 1, 8],
          highlights: [1],
          comparison: [1],
          action: "Found node 5 at position 1, returned node reference",
        },
        {
          id: 8,
          description: "Search(8) - Continue traversal to end",
          data: [3, 5, 1, 8],
          highlights: [3],
          comparison: [3],
          action: "Found node 8 at position 3, demonstrates O(n) search",
        },
        {
          id: 9,
          description: "Display() - Traverse entire list",
          data: [3, 5, 1, 8],
          highlights: [0, 1, 2, 3],
          comparison: [],
          action: "Traversed: Head->3->5->1->8->null, Size: 4 nodes",
        },
        {
          id: 10,
          description: "Delete(3) - Remove head node",
          data: [5, 1, 8],
          highlights: [0],
          comparison: [],
          action: "Deleted head node 3, updated Head to point to node 5",
        },
        {
          id: 11,
          description: "Insert(7) at beginning - New head again",
          data: [7, 5, 1, 8],
          highlights: [0],
          comparison: [],
          action: "Created [7 | *] -> [5 | *], new Head points to 7",
        },
        {
          id: 12,
          description: "Delete(1) - Remove middle node",
          data: [7, 5, 8],
          highlights: [1],
          comparison: [],
          action: "Found node 1, updated 5's pointer to skip node 1",
        },
        {
          id: 13,
          description: "Insert(4) at end - Extend list",
          data: [7, 5, 8, 4],
          highlights: [3],
          comparison: [],
          action: "Traversed to end, node 8 now points to new node [4 | null]",
        },
        {
          id: 14,
          description: "Search(5) - Verify middle node exists",
          data: [7, 5, 8, 4],
          highlights: [1],
          comparison: [1],
          action: "Linear search found node 5 at position 1",
        },
        {
          id: 15,
          description: "Delete(8) - Remove middle node again",
          data: [7, 5, 4],
          highlights: [1],
          comparison: [],
          action: "Node 5 now points directly to node 4, skipping deleted 8",
        },
        {
          id: 16,
          description: "Insert(9) at position 1 - Specific insertion",
          data: [7, 9, 5, 4],
          highlights: [1],
          comparison: [],
          action: "Inserted [9 | *] between 7 and 5, maintaining chain",
        },
        {
          id: 17,
          description: "Display() - Show current structure",
          data: [7, 9, 5, 4],
          highlights: [0, 1, 2, 3],
          comparison: [],
          action: "Current chain: Head->7->9->5->4->null",
        },
        {
          id: 18,
          description: "Delete(4) - Remove tail node",
          data: [7, 9, 5],
          highlights: [2],
          comparison: [],
          action: "Node 5 now points to null, 4 was successfully removed",
        },
        {
          id: 19,
          description: "Delete(7) - Remove head, update head pointer",
          data: [9, 5],
          highlights: [0],
          comparison: [],
          action: "Head updated to node 9, original head 7 deleted",
        },
        {
          id: 20,
          description: "Final state - Efficient dynamic structure",
          data: [9, 5],
          highlights: [0, 1],
          comparison: [],
          action:
            "Linked list: [9 | *] -> [5 | null], demonstrates flexibility",
        },
      ],
    },
    difficulty: 2,
    order: 3,
    duration: 22,
    category: "Algorithms",
    hasCodeExercise: true,
    starterCode: `# Implement Linked List with Detailed Visualization
class Node:
    """Single node in the linked list"""
    def __init__(self, data):
        # TODO: Initialize node with data and next pointer
        pass

class LinkedListVisualized:
    """
    Linked List implementation with step-by-step tracking for visualization
    """
    
    def __init__(self):
        # TODO: Initialize the linked list
        # - Head pointer
        # - Size counter
        # - Steps tracking for visualization
        pass
    
    def insert_at_beginning(self, data):
        """Insert new node at the beginning of the list"""
        # TODO: Implement insertion at head
        # - Create new node
        # - Update pointers
        # - Update head
        # - Record step for visualization
        pass
    
    def insert_at_end(self, data):
        """Insert new node at the end of the list"""
        # TODO: Implement insertion at tail
        # - Traverse to find last node
        # - Create new node
        # - Update last node's next pointer
        # - Record step for visualization
        pass
    
    def insert_at_position(self, data, position):
        """Insert new node at specific position"""
        # TODO: Implement insertion at arbitrary position
        # - Validate position
        # - Traverse to position-1
        # - Create and link new node
        # - Record step for visualization
        pass
    
    def delete_by_value(self, data):
        """Delete first node with given data"""
        # TODO: Implement deletion by value
        # - Handle empty list
        # - Handle head deletion
        # - Traverse to find node
        # - Update pointers to skip node
        # - Record step for visualization
        pass
    
    def delete_at_position(self, position):
        """Delete node at specific position"""
        # TODO: Implement deletion by position
        # - Validate position and bounds
        # - Handle head deletion (position 0)
        # - Traverse to position-1
        # - Update pointers to skip target node
        # - Record step for visualization
        pass
    
    def search(self, data):
        """Search for node with given data"""
        # TODO: Implement linear search
        # - Traverse from head
        # - Compare each node's data
        # - Return position or -1 if not found
        # - Record step for visualization
        pass
    
    def display(self):
        """Display all nodes in the list"""
        # TODO: Implement display/traversal
        # - Traverse from head to tail
        # - Collect all node values
        # - Record step for visualization
        pass
    
    def get_size(self):
        """Return number of nodes in the list"""
        # TODO: Return current size
        pass
    
    def is_empty(self):
        """Check if list is empty"""
        # TODO: Return True if empty, False otherwise
        pass
    
    def get_visualization_steps(self):
        """Return all recorded steps for visualization"""
        # TODO: Return steps list for visualization
        pass
    
    def __str__(self):
        """String representation of the linked list"""
        # TODO: Create string representation
        # Format: "Head -> 1 -> 2 -> 3 -> null"
        pass

# Test your linked list implementation
print("🔗 LINKED LIST OPERATIONS VISUALIZATION")
print("=" * 60)

linked_list = LinkedListVisualized()

# Test operations sequence
operations = [
    ("insert_beginning", 5),
    ("insert_beginning", 3),
    ("insert_end", 8),
    ("insert_position", 1, 2),  # Insert 1 at position 2
    ("display", None),
    ("search", 5),
    ("search", 8),
    ("delete_value", 3),
    ("insert_beginning", 7),
    ("delete_value", 1),
    ("insert_end", 4),
    ("delete_position", 2),  # Delete node at position 2
    ("display", None),
    ("get_size", None),
    ("is_empty", None)
]

for operation in operations:
    op_name = operation[0]
    op_value = operation[1] if len(operation) > 1 else None
    op_extra = operation[2] if len(operation) > 2 else None
    
    print(f"\\n➡️ Operation: {op_name}({op_value if op_value is not None else ''}{f', {op_extra}' if op_extra is not None else ''})")
    
    try:
        if op_name == "insert_beginning":
            linked_list.insert_at_beginning(op_value)
            print(f"   Inserted {op_value} at beginning")
        elif op_name == "insert_end":
            linked_list.insert_at_end(op_value)
            print(f"   Inserted {op_value} at end")
        elif op_name == "insert_position":
            linked_list.insert_at_position(op_value, op_extra)
            print(f"   Inserted {op_value} at position {op_extra}")
        elif op_name == "delete_value":
            result = linked_list.delete_by_value(op_value)
            print(f"   Deleted node with value {op_value}")
        elif op_name == "delete_position":
            result = linked_list.delete_at_position(op_value)
            print(f"   Deleted node at position {op_value}")
        elif op_name == "search":
            position = linked_list.search(op_value)
            print(f"   Search {op_value}: {'Found at position ' + str(position) if position != -1 else 'Not found'}")
        elif op_name == "display":
            linked_list.display()
            print(f"   Displayed entire list")
        elif op_name == "get_size":
            size = linked_list.get_size()
            print(f"   List size: {size}")
        elif op_name == "is_empty":
            empty = linked_list.is_empty()
            print(f"   Is empty: {empty}")
    
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print(f"   List: {linked_list}")
    print(f"   Size: {linked_list.get_size()}")

# Show all visualization steps
print("\\n" + "=" * 60)
print("📊 COMPLETE OPERATION HISTORY:")
steps = linked_list.get_visualization_steps()
for i, step in enumerate(steps, 1):
    print(f"Step {i}: {step}")`,
    solutionCode: `class Node:
    """Single node in the linked list"""
    def __init__(self, data):
        self.data = data
        self.next = None
    
    def __str__(self):
        return f"[{self.data}]"

class LinkedListVisualized:
    """
    Linked List implementation with step-by-step tracking for visualization
    """
    
    def __init__(self):
        self.head = None
        self.size = 0
        self.steps = []
        self.operation_count = 0
    
    def insert_at_beginning(self, data):
        """Insert new node at the beginning of the list"""
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
        self.size += 1
        self.operation_count += 1
        
        step = {
            'operation': 'insert_beginning',
            'value': data,
            'list_before': self._get_list_values()[1:] if self.size > 1 else [],
            'list_after': self._get_list_values(),
            'size_before': self.size - 1,
            'size_after': self.size,
            'description': f"Inserted {data} at beginning. New head: {data}"
        }
        self.steps.append(step)
    
    def insert_at_end(self, data):
        """Insert new node at the end of the list"""
        new_node = Node(data)
        
        if not self.head:
            self.head = new_node
        else:
            current = self.head
            while current.next:
                current = current.next
            current.next = new_node
        
        self.size += 1
        self.operation_count += 1
        
        step = {
            'operation': 'insert_end',
            'value': data,
            'list_before': self._get_list_values()[:-1] if self.size > 1 else [],
            'list_after': self._get_list_values(),
            'size_before': self.size - 1,
            'size_after': self.size,
            'description': f"Inserted {data} at end. List size: {self.size}"
        }
        self.steps.append(step)
    
    def insert_at_position(self, data, position):
        """Insert new node at specific position"""
        if position < 0 or position > self.size:
            raise IndexError(f"Position {position} out of bounds (0-{self.size})")
        
        if position == 0:
            self.insert_at_beginning(data)
            return
        
        new_node = Node(data)
        current = self.head
        
        for _ in range(position - 1):
            current = current.next
        
        new_node.next = current.next
        current.next = new_node
        self.size += 1
        self.operation_count += 1
        
        step = {
            'operation': 'insert_position',
            'value': data,
            'position': position,
            'list_before': self._get_list_without_position(position),
            'list_after': self._get_list_values(),
            'size_before': self.size - 1,
            'size_after': self.size,
            'description': f"Inserted {data} at position {position}"
        }
        self.steps.append(step)
    
    def delete_by_value(self, data):
        """Delete first node with given data"""
        if not self.head:
            step = {
                'operation': 'delete_value',
                'value': data,
                'description': "❌ Cannot delete from empty list"
            }
            self.steps.append(step)
            raise ValueError("Cannot delete from empty list")
        
        list_before = self._get_list_values()
        
        if self.head.data == data:
            self.head = self.head.next
            self.size -= 1
            self.operation_count += 1
            
            step = {
                'operation': 'delete_value',
                'value': data,
                'list_before': list_before,
                'list_after': self._get_list_values(),
                'size_before': self.size + 1,
                'size_after': self.size,
                'description': f"Deleted head node {data}. New head: {self.head.data if self.head else 'None'}"
            }
            self.steps.append(step)
            return
        
        current = self.head
        while current.next and current.next.data != data:
            current = current.next
        
        if not current.next:
            step = {
                'operation': 'delete_value',
                'value': data,
                'description': f"❌ Value {data} not found in list"
            }
            self.steps.append(step)
            raise ValueError(f"Value {data} not found in list")
        
        current.next = current.next.next
        self.size -= 1
        self.operation_count += 1
        
        step = {
            'operation': 'delete_value',
            'value': data,
            'list_before': list_before,
            'list_after': self._get_list_values(),
            'size_before': self.size + 1,
            'size_after': self.size,
            'description': f"Deleted node with value {data}"
        }
        self.steps.append(step)
    
    def delete_at_position(self, position):
        """Delete node at specific position"""
        if position < 0 or position >= self.size:
            raise IndexError(f"Position {position} out of bounds (0-{self.size-1})")
        
        list_before = self._get_list_values()
        deleted_value = None
        
        if position == 0:
            deleted_value = self.head.data
            self.head = self.head.next
        else:
            current = self.head
            for _ in range(position - 1):
                current = current.next
            deleted_value = current.next.data
            current.next = current.next.next
        
        self.size -= 1
        self.operation_count += 1
        
        step = {
            'operation': 'delete_position',
            'value': deleted_value,
            'position': position,
            'list_before': list_before,
            'list_after': self._get_list_values(),
            'size_before': self.size + 1,
            'size_after': self.size,
            'description': f"Deleted node {deleted_value} at position {position}"
        }
        self.steps.append(step)
        return deleted_value
    
    def search(self, data):
        """Search for node with given data"""
        current = self.head
        position = 0
        
        while current:
            if current.data == data:
                step = {
                    'operation': 'search',
                    'value': data,
                    'position': position,
                    'found': True,
                    'description': f"Found {data} at position {position}"
                }
                self.steps.append(step)
                return position
            current = current.next
            position += 1
        
        step = {
            'operation': 'search',
            'value': data,
            'position': -1,
            'found': False,
            'description': f"Value {data} not found in list"
        }
        self.steps.append(step)
        return -1
    
    def display(self):
        """Display all nodes in the list"""
        values = self._get_list_values()
        step = {
            'operation': 'display',
            'values': values,
            'size': self.size,
            'description': f"Displayed list: {' -> '.join(map(str, values)) if values else 'empty'}"
        }
        self.steps.append(step)
        return values
    
    def get_size(self):
        """Return number of nodes in the list"""
        return self.size
    
    def is_empty(self):
        """Check if list is empty"""
        return self.size == 0
    
    def _get_list_values(self):
        """Helper method to get all values in the list"""
        values = []
        current = self.head
        while current:
            values.append(current.data)
            current = current.next
        return values
    
    def _get_list_without_position(self, skip_position):
        """Helper method to get list values excluding a position"""
        values = []
        current = self.head
        position = 0
        while current:
            if position != skip_position:
                values.append(current.data)
            current = current.next
            position += 1
        return values
    
    def get_visualization_steps(self):
        """Return all recorded steps for visualization"""
        return self.steps.copy()
    
    def __str__(self):
        """String representation of the linked list"""
        if not self.head:
            return "Head -> null (empty list)"
        
        values = self._get_list_values()
        return f"Head -> {' -> '.join(map(str, values))} -> null"`,
    testCases: [
      {
        input: [["insert_beginning", 5], ["insert_beginning", 3], ["display"]],
        expected: [null, null, [3, 5]],
        description: "Basic insertion at beginning",
      },
      {
        input: [
          ["insert_end", 1],
          ["insert_end", 2],
          ["insert_end", 3],
          ["display"],
        ],
        expected: [null, null, null, [1, 2, 3]],
        description: "Sequential insertion at end",
      },
      {
        input: [
          ["insert_beginning", 1],
          ["insert_position", 2, 1],
          ["display"],
        ],
        expected: [null, null, [1, 2]],
        description: "Insert at specific position",
      },
      {
        input: [
          ["insert_beginning", 1],
          ["insert_beginning", 2],
          ["delete_value", 2],
          ["display"],
        ],
        expected: [null, null, true, [1]],
        description: "Delete by value from head",
      },
      {
        input: [
          ["insert_beginning", 1],
          ["insert_beginning", 2],
          ["search", 1],
          ["search", 3],
        ],
        expected: [null, null, 1, -1],
        description: "Search existing and non-existing values",
      },
      {
        input: [["insert_beginning", 1], ["delete_position", 0], ["is_empty"]],
        expected: [null, 1, true],
        description: "Delete only element and check if empty",
      },
    ],
    diamondReward: 60,
    experienceReward: 110,
    isPublished: true,
    tags: [
      "Data Structures",
      "Linked List",
      "Dynamic",
      "Pointers",
      "O(n)",
      "Intermediate",
    ],
    learningObjectives: [
      "Understand dynamic memory allocation and node structures",
      "Master linked list insertion at beginning, end, and arbitrary positions",
      "Learn efficient deletion by value and position",
      "Practice pointer manipulation and reference management",
      "Visualize node linking and unlinking operations",
      "Compare linked list vs array trade-offs (time vs space)",
    ],
  },
];

export async function seedDataStructures() {
  console.log("🔄 Seeding Data Structure Challenges...");

  try {
    for (const challenge of dataStructureChallenges) {
      const learningActivityData = {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        content:
          typeof challenge.content === "string"
            ? challenge.content
            : JSON.stringify(challenge.content),
        activityType: "algorithm_visualization",
        category: challenge.category || "Algorithms",
        difficulty: challenge.difficulty || 1,
        diamondReward: challenge.diamondReward || 40,
        experienceReward: challenge.experienceReward || 80,
        estimatedMinutes: challenge.duration || 15,
        sortOrder: challenge.order || 0,
        isActive: challenge.isPublished !== false,
        tags: JSON.stringify(challenge.tags || []),
        settings: JSON.stringify({
          slug: challenge.slug,
          hasCodeExercise: challenge.hasCodeExercise || false,
          starterCode: challenge.starterCode,
          solutionCode: challenge.solutionCode,
          testCases: JSON.stringify(challenge.testCases || []),
          learningObjectives: challenge.learningObjectives || [],
          source: "data_structure_seed",
          migrated_at: new Date().toISOString(),
        }),
      };

      await prisma.learningActivity.upsert({
        where: { id: challenge.id },
        update: learningActivityData,
        create: learningActivityData,
      });
      console.log(`✅ Created data structure challenge: ${challenge.title}`);
    }

    console.log("🎉 Data structure challenges seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding data structures:", error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    await seedDataStructures();
    console.log("✅ Data structure seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding data structures:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}
