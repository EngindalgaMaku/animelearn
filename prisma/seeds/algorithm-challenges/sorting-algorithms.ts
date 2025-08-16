import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * SORTING ALGORITHMS - Detailed Algorithm Visualization Challenges
 *
 * These challenges provide step-by-step visual explanations of sorting algorithms
 * with detailed analysis, comparisons, and interactive learning objectives.
 */

export const sortingAlgorithmChallenges = [
  // 1) BUBBLE SORT - Most Basic Sorting
  {
    id: "bubble-sort-detailed-viz",
    title: "Bubble Sort: Step-by-Step Visualization",
    slug: "bubble-sort-step-by-step",
    description:
      "Master bubble sort through detailed visualization - see every comparison, swap, and optimization. Understand why it's O(n²) and when the early termination optimization kicks in.",
    content: {
      algorithm: "Bubble Sort",
      description:
        "Watch how bubble sort algorithm works step by step with interactive visualization",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      explanation:
        "Bubble Sort works by repeatedly stepping through the list, comparing adjacent elements and swapping them if they're in the wrong order. Larger elements 'bubble up' to their correct positions.",
      steps: [
        {
          id: 1,
          description: "Initial unsorted array",
          data: [64, 34, 25, 12, 22, 11, 90],
          highlights: [],
          comparison: [],
          action: "Starting bubble sort algorithm",
        },
        {
          id: 2,
          description: "Compare first two elements: 64 and 34",
          data: [64, 34, 25, 12, 22, 11, 90],
          highlights: [0, 1],
          comparison: [0, 1],
          action: "64 > 34, so we need to swap them",
        },
        {
          id: 3,
          description: "Swap 64 and 34",
          data: [34, 64, 25, 12, 22, 11, 90],
          highlights: [0, 1],
          comparison: [],
          action: "Elements swapped successfully",
        },
        {
          id: 4,
          description: "Compare 64 and 25",
          data: [34, 64, 25, 12, 22, 11, 90],
          highlights: [1, 2],
          comparison: [1, 2],
          action: "64 > 25, so we need to swap them",
        },
        {
          id: 5,
          description: "Swap 64 and 25",
          data: [34, 25, 64, 12, 22, 11, 90],
          highlights: [1, 2],
          comparison: [],
          action: "Elements swapped successfully",
        },
        {
          id: 6,
          description: "Compare 64 and 12",
          data: [34, 25, 64, 12, 22, 11, 90],
          highlights: [2, 3],
          comparison: [2, 3],
          action: "64 > 12, so we need to swap them",
        },
        {
          id: 7,
          description: "Swap 64 and 12",
          data: [34, 25, 12, 64, 22, 11, 90],
          highlights: [2, 3],
          comparison: [],
          action: "Elements swapped successfully",
        },
        {
          id: 8,
          description: "Compare 64 and 22",
          data: [34, 25, 12, 64, 22, 11, 90],
          highlights: [3, 4],
          comparison: [3, 4],
          action: "64 > 22, so we need to swap them",
        },
        {
          id: 9,
          description: "Swap 64 and 22",
          data: [34, 25, 12, 22, 64, 11, 90],
          highlights: [3, 4],
          comparison: [],
          action: "Elements swapped successfully",
        },
        {
          id: 10,
          description: "Compare 64 and 11",
          data: [34, 25, 12, 22, 64, 11, 90],
          highlights: [4, 5],
          comparison: [4, 5],
          action: "64 > 11, so we need to swap them",
        },
        {
          id: 11,
          description: "Swap 64 and 11",
          data: [34, 25, 12, 22, 11, 64, 90],
          highlights: [4, 5],
          comparison: [],
          action: "Elements swapped successfully",
        },
        {
          id: 12,
          description: "Compare 64 and 90",
          data: [34, 25, 12, 22, 11, 64, 90],
          highlights: [5, 6],
          comparison: [5, 6],
          action: "64 < 90, no swap needed",
        },
        {
          id: 13,
          description: "First pass complete - 90 is in correct position",
          data: [34, 25, 12, 22, 11, 64, 90],
          highlights: [6],
          comparison: [],
          action: "Largest element bubbled to the end",
        },
        {
          id: 14,
          description: "Second pass: Compare 34 and 25",
          data: [34, 25, 12, 22, 11, 64, 90],
          highlights: [0, 1],
          comparison: [0, 1],
          action: "34 > 25, so we need to swap them",
        },
        {
          id: 15,
          description: "Continue sorting until complete",
          data: [11, 12, 22, 25, 34, 64, 90],
          highlights: [],
          comparison: [],
          action: "Array is now completely sorted!",
        },
      ],
    },
    difficulty: 1,
    order: 1,
    duration: 20,
    category: "Algorithms",
    hasCodeExercise: true,
    starterCode: `# Implement Bubble Sort with Detailed Visualization
def bubble_sort_visualized(arr):
    """
    Bubble sort with step-by-step tracking for visualization
    Returns: (sorted_array, steps_taken, total_comparisons, total_swaps)
    """
    n = len(arr)
    steps = []
    comparisons = 0
    swaps = 0
    
    # Create a copy to avoid modifying original
    working_array = arr.copy()
    
    # TODO: Implement the bubble sort algorithm
    # For each pass i from 0 to n-1:
    #   - Set swapped flag to False
    #   - For each j from 0 to n-i-2:
    #     - Increment comparisons counter
    #     - Compare working_array[j] and working_array[j+1]
    #     - If they're in wrong order:
    #       - Swap them
    #       - Increment swaps counter  
    #       - Set swapped flag to True
    #       - Record this step for visualization
    #   - If no swaps occurred, break early (optimization)
    
    # Hint: Record each step as:
    # steps.append({
    #     'pass': pass_number,
    #     'comparison': [j, j+1],
    #     'values': [working_array[j], working_array[j+1]],
    #     'swapped': True/False,
    #     'array_state': working_array.copy(),
    #     'description': "Clear description of what happened"
    # })
    
    return working_array, steps, comparisons, swaps

# Test your implementation
test_array = [64, 34, 25, 12, 22, 11, 90]
print("Original array:", test_array)

sorted_arr, steps, comps, swaps = bubble_sort_visualized(test_array)
print(f"Sorted array: {sorted_arr}")
print(f"Total comparisons: {comps}")
print(f"Total swaps: {swaps}")
print(f"Total steps tracked: {len(steps)}")

# Print first few steps for verification
for i, step in enumerate(steps[:5]):
    print(f"Step {i+1}: {step}")`,
    solutionCode: `def bubble_sort_visualized(arr):
    """
    Bubble sort with step-by-step tracking for visualization
    Returns: (sorted_array, steps_taken, total_comparisons, total_swaps)
    """
    n = len(arr)
    steps = []
    comparisons = 0
    swaps = 0
    
    # Create a copy to avoid modifying original
    working_array = arr.copy()
    
    # Outer loop for each pass
    for i in range(n):
        swapped = False  # Optimization flag
        
        # Inner loop for comparisons in this pass
        # Note: n-i-1 because last i elements are already sorted
        for j in range(0, n - i - 1):
            comparisons += 1
            
            # Record the comparison step
            step_info = {
                'pass': i + 1,
                'comparison': [j, j + 1],
                'values': [working_array[j], working_array[j + 1]],
                'swapped': False,
                'array_state': working_array.copy(),
                'description': f"Pass {i+1}: Compare {working_array[j]} and {working_array[j+1]}"
            }
            
            # Check if swap is needed
            if working_array[j] > working_array[j + 1]:
                # Perform the swap
                working_array[j], working_array[j + 1] = working_array[j + 1], working_array[j]
                swapped = True
                swaps += 1
                
                # Update step info
                step_info['swapped'] = True
                step_info['array_state'] = working_array.copy()
                step_info['description'] += f" → SWAP! New state: {working_array}"
            else:
                step_info['description'] += " → No swap needed"
            
            steps.append(step_info)
        
        # Early termination optimization
        if not swapped:
            steps.append({
                'pass': i + 1,
                'comparison': None,
                'values': None,
                'swapped': False,
                'array_state': working_array.copy(),
                'description': f"Pass {i+1}: No swaps occurred - array is sorted! Early termination."
            })
            break
        else:
            steps.append({
                'pass': i + 1,
                'comparison': None,
                'values': None,
                'swapped': None,
                'array_state': working_array.copy(),
                'description': f"Pass {i+1} complete. Element {working_array[n-i-1]} is now in correct position."
            })
    
    return working_array, steps, comparisons, swaps`,
    testCases: [
      {
        input: [[64, 34, 25, 12, 22, 11, 90]],
        expected: [11, 12, 22, 25, 34, 64, 90],
        description: "Standard unsorted array",
      },
      {
        input: [[5, 2, 8, 1, 9]],
        expected: [1, 2, 5, 8, 9],
        description: "Small array",
      },
      {
        input: [[1, 2, 3, 4, 5]],
        expected: [1, 2, 3, 4, 5],
        description: "Already sorted (best case)",
      },
      {
        input: [[5, 4, 3, 2, 1]],
        expected: [1, 2, 3, 4, 5],
        description: "Reverse sorted (worst case)",
      },
      {
        input: [[3, 3, 3, 3]],
        expected: [3, 3, 3, 3],
        description: "All equal elements",
      },
      {
        input: [[42]],
        expected: [42],
        description: "Single element",
      },
      {
        input: [[]],
        expected: [],
        description: "Empty array",
      },
    ],
    diamondReward: 50,
    experienceReward: 100,
    isPublished: true,
    tags: [
      "Algorithm Viz",
      "Sorting",
      "Beginner",
      "O(n²)",
      "Stable",
      "In-place",
    ],
    learningObjectives: [
      "Understand the bubble sort mechanism step-by-step",
      "Visualize how larger elements 'bubble up' to correct positions",
      "Learn the early termination optimization technique",
      "Analyze time complexity through counting operations",
      "Recognize when bubble sort is appropriate vs inappropriate",
      "Master the concept of algorithm stability",
      "Practice implementing visualization and debugging techniques",
    ],
  },

  // 2) SELECTION SORT - Find Minimum and Swap
  {
    id: "selection-sort-detailed-viz",
    title: "Selection Sort: Minimum Selection Visualization",
    slug: "selection-sort-step-by-step",
    description:
      "Master selection sort by visualizing the minimum selection process. See how it maintains a sorted portion and finds the minimum from the unsorted portion each iteration.",
    content: {
      algorithm: "Selection Sort",
      description:
        "Watch how selection sort algorithm works step by step with interactive visualization",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      explanation:
        "Selection Sort works by finding the minimum element from the unsorted portion and placing it at the beginning. It maintains two regions: sorted and unsorted.",
      steps: [
        {
          id: 1,
          description: "Initial unsorted array - Selection Sort starting",
          data: [64, 25, 12, 22, 11, 90],
          highlights: [],
          comparison: [],
          action: "Starting selection sort algorithm with 6 elements",
        },
        {
          id: 2,
          description:
            "Pass 1: Set position 0 as starting point for minimum search",
          data: [64, 25, 12, 22, 11, 90],
          highlights: [0],
          comparison: [],
          action: "Assume element at index 0 (64) is minimum",
        },
        {
          id: 3,
          description:
            "Compare current minimum 64 with element at index 1 (25)",
          data: [64, 25, 12, 22, 11, 90],
          highlights: [0, 1],
          comparison: [0, 1],
          action: "64 > 25, so 25 becomes new minimum candidate",
        },
        {
          id: 4,
          description: "Update minimum index to 1, continue searching",
          data: [64, 25, 12, 22, 11, 90],
          highlights: [1],
          comparison: [],
          action: "Current minimum: 25 at index 1",
        },
        {
          id: 5,
          description:
            "Compare current minimum 25 with element at index 2 (12)",
          data: [64, 25, 12, 22, 11, 90],
          highlights: [1, 2],
          comparison: [1, 2],
          action: "25 > 12, so 12 becomes new minimum candidate",
        },
        {
          id: 6,
          description: "Update minimum index to 2, continue searching",
          data: [64, 25, 12, 22, 11, 90],
          highlights: [2],
          comparison: [],
          action: "Current minimum: 12 at index 2",
        },
        {
          id: 7,
          description:
            "Compare current minimum 12 with element at index 3 (22)",
          data: [64, 25, 12, 22, 11, 90],
          highlights: [2, 3],
          comparison: [2, 3],
          action: "12 < 22, so 12 remains minimum candidate",
        },
        {
          id: 8,
          description:
            "Compare current minimum 12 with element at index 4 (11)",
          data: [64, 25, 12, 22, 11, 90],
          highlights: [2, 4],
          comparison: [2, 4],
          action: "12 > 11, so 11 becomes new minimum candidate",
        },
        {
          id: 9,
          description: "Update minimum index to 4, continue searching",
          data: [64, 25, 12, 22, 11, 90],
          highlights: [4],
          comparison: [],
          action: "Current minimum: 11 at index 4",
        },
        {
          id: 10,
          description:
            "Compare current minimum 11 with element at index 5 (90)",
          data: [64, 25, 12, 22, 11, 90],
          highlights: [4, 5],
          comparison: [4, 5],
          action: "11 < 90, so 11 remains the final minimum",
        },
        {
          id: 11,
          description: "Pass 1 complete: Found minimum 11 at index 4",
          data: [64, 25, 12, 22, 11, 90],
          highlights: [4],
          comparison: [],
          action: "Minimum element 11 found, ready to swap",
        },
        {
          id: 12,
          description: "Swap minimum 11 with first element 64",
          data: [11, 25, 12, 22, 64, 90],
          highlights: [0, 4],
          comparison: [],
          action: "Exchange: 64 ↔ 11, first position sorted",
        },
        {
          id: 13,
          description: "Pass 2: Start searching from index 1 for next minimum",
          data: [11, 25, 12, 22, 64, 90],
          highlights: [1],
          comparison: [],
          action: "Sorted portion: [11], searching in [25,12,22,64,90]",
        },
        {
          id: 14,
          description:
            "Compare current minimum 25 with element at index 2 (12)",
          data: [11, 25, 12, 22, 64, 90],
          highlights: [1, 2],
          comparison: [1, 2],
          action: "25 > 12, so 12 becomes new minimum candidate",
        },
        {
          id: 15,
          description: "Update minimum index to 2, continue searching",
          data: [11, 25, 12, 22, 64, 90],
          highlights: [2],
          comparison: [],
          action: "Current minimum: 12 at index 2",
        },
        {
          id: 16,
          description:
            "Compare current minimum 12 with element at index 3 (22)",
          data: [11, 25, 12, 22, 64, 90],
          highlights: [2, 3],
          comparison: [2, 3],
          action: "12 < 22, so 12 remains minimum candidate",
        },
        {
          id: 17,
          description:
            "Compare current minimum 12 with element at index 4 (64)",
          data: [11, 25, 12, 22, 64, 90],
          highlights: [2, 4],
          comparison: [2, 4],
          action: "12 < 64, so 12 remains minimum candidate",
        },
        {
          id: 18,
          description:
            "Compare current minimum 12 with element at index 5 (90)",
          data: [11, 25, 12, 22, 64, 90],
          highlights: [2, 5],
          comparison: [2, 5],
          action: "12 < 90, so 12 is the final minimum",
        },
        {
          id: 19,
          description: "Swap minimum 12 with element at index 1 (25)",
          data: [11, 12, 25, 22, 64, 90],
          highlights: [1, 2],
          comparison: [],
          action: "Exchange: 25 ↔ 12, second position sorted",
        },
        {
          id: 20,
          description: "Pass 3: Start searching from index 2 for next minimum",
          data: [11, 12, 25, 22, 64, 90],
          highlights: [2],
          comparison: [],
          action: "Sorted portion: [11,12], searching in [25,22,64,90]",
        },
        {
          id: 21,
          description:
            "Compare current minimum 25 with element at index 3 (22)",
          data: [11, 12, 25, 22, 64, 90],
          highlights: [2, 3],
          comparison: [2, 3],
          action: "25 > 22, so 22 becomes new minimum candidate",
        },
        {
          id: 22,
          description: "Update minimum index to 3, continue searching",
          data: [11, 12, 25, 22, 64, 90],
          highlights: [3],
          comparison: [],
          action: "Current minimum: 22 at index 3",
        },
        {
          id: 23,
          description: "Compare current minimum 22 with remaining elements",
          data: [11, 12, 25, 22, 64, 90],
          highlights: [3, 4, 5],
          comparison: [3, 4],
          action: "22 < 64 and 22 < 90, so 22 is minimum",
        },
        {
          id: 24,
          description: "Swap minimum 22 with element at index 2 (25)",
          data: [11, 12, 22, 25, 64, 90],
          highlights: [2, 3],
          comparison: [],
          action: "Exchange: 25 ↔ 22, third position sorted",
        },
        {
          id: 25,
          description: "Pass 4: Remaining elements [25,64,90] already in order",
          data: [11, 12, 22, 25, 64, 90],
          highlights: [3, 4, 5],
          comparison: [],
          action: "25 < 64 < 90, no more swaps needed",
        },
        {
          id: 26,
          description: "Selection sort algorithm complete!",
          data: [11, 12, 22, 25, 64, 90],
          highlights: [],
          comparison: [],
          action: "Array fully sorted: [11,12,22,25,64,90] ✅",
        },
      ],
    },
    difficulty: 1,
    order: 2,
    duration: 18,
    category: "Algorithms",
    hasCodeExercise: true,
    starterCode: `# Implement Selection Sort with Detailed Visualization
def selection_sort_visualized(arr):
    """
    Selection sort with step-by-step tracking for visualization
    Returns: (sorted_array, steps_taken, total_comparisons, total_swaps)
    """
    n = len(arr)
    steps = []
    comparisons = 0
    swaps = 0
    
    # Create a copy to avoid modifying original
    working_array = arr.copy()
    
    # TODO: Implement the selection sort algorithm
    # For each position i from 0 to n-2:
    #   - Set min_index = i (assume first unsorted element is minimum)
    #   - For each j from i+1 to n-1:
    #     - Increment comparisons counter
    #     - Compare working_array[j] with working_array[min_index]
    #     - If working_array[j] < working_array[min_index]:
    #       - Update min_index = j
    #       - Record this step for visualization
    #   - If min_index != i:
    #     - Swap working_array[i] with working_array[min_index]
    #     - Increment swaps counter
    #     - Record the swap for visualization
    
    # Hint: Record each step as:
    # steps.append({
    #     'pass': pass_number,
    #     'searching_in': [start_index, end_index],
    #     'current_min': min_index,
    #     'current_min_value': working_array[min_index],
    #     'comparing_with': j,
    #     'array_state': working_array.copy(),
    #     'sorted_portion': list(range(0, i)),
    #     'description': "Clear description of what happened"
    # })
    
    return working_array, steps, comparisons, swaps

# Test your implementation
test_array = [64, 25, 12, 22, 11, 90]
print("Original array:", test_array)

sorted_arr, steps, comps, swaps = selection_sort_visualized(test_array)
print(f"Sorted array: {sorted_arr}")
print(f"Total comparisons: {comps}")
print(f"Total swaps: {swaps}")
print(f"Total steps tracked: {len(steps)}")`,
    solutionCode: `def selection_sort_visualized(arr):
    """
    Selection sort with step-by-step tracking for visualization
    Returns: (sorted_array, steps_taken, total_comparisons, total_swaps)
    """
    n = len(arr)
    steps = []
    comparisons = 0
    swaps = 0
    
    # Create a copy to avoid modifying original
    working_array = arr.copy()
    
    # Outer loop for each position to fill
    for i in range(n - 1):  # Last element will be automatically sorted
        min_index = i  # Assume first unsorted element is minimum
        
        # Record start of new pass
        steps.append({
            'pass': i + 1,
            'searching_in': [i, n - 1],
            'current_min': min_index,
            'current_min_value': working_array[min_index],
            'comparing_with': None,
            'array_state': working_array.copy(),
            'sorted_portion': list(range(0, i)),
            'description': f"Pass {i+1}: Finding minimum in unsorted portion [{i}:{n-1}]"
        })
        
        # Inner loop to find minimum in unsorted portion
        for j in range(i + 1, n):
            comparisons += 1
            
            # Record the comparison
            steps.append({
                'pass': i + 1,
                'searching_in': [i, n - 1],
                'current_min': min_index,
                'current_min_value': working_array[min_index],
                'comparing_with': j,
                'array_state': working_array.copy(),
                'sorted_portion': list(range(0, i)),
                'description': f"Compare {working_array[j]} with current min {working_array[min_index]}"
            })
            
            # Update minimum if found smaller element
            if working_array[j] < working_array[min_index]:
                min_index = j
                steps.append({
                    'pass': i + 1,
                    'searching_in': [i, n - 1],
                    'current_min': min_index,
                    'current_min_value': working_array[min_index],
                    'comparing_with': j,
                    'array_state': working_array.copy(),
                    'sorted_portion': list(range(0, i)),
                    'description': f"New minimum found! {working_array[min_index]} at index {min_index}"
                })
        
        # Perform swap if needed
        if min_index != i:
            # Record the swap
            old_value = working_array[i]
            working_array[i], working_array[min_index] = working_array[min_index], working_array[i]
            swaps += 1
            
            steps.append({
                'pass': i + 1,
                'searching_in': [i, n - 1],
                'current_min': i,  # After swap, minimum is now at position i
                'current_min_value': working_array[i],
                'comparing_with': None,
                'array_state': working_array.copy(),
                'sorted_portion': list(range(0, i + 1)),
                'description': f"Swap: {old_value} ↔ {working_array[i]} → Element {working_array[i]} now in correct position"
            })
        else:
            steps.append({
                'pass': i + 1,
                'searching_in': [i, n - 1],
                'current_min': i,
                'current_min_value': working_array[i],
                'comparing_with': None,
                'array_state': working_array.copy(),
                'sorted_portion': list(range(0, i + 1)),
                'description': f"No swap needed - {working_array[i]} already in correct position"
            })
    
    # Final step - entire array sorted
    steps.append({
        'pass': n,
        'searching_in': None,
        'current_min': None,
        'current_min_value': None,
        'comparing_with': None,
        'array_state': working_array.copy(),
        'sorted_portion': list(range(0, n)),
        'description': "Selection sort complete! Entire array is now sorted."
    })
    
    return working_array, steps, comparisons, swaps`,
    testCases: [
      {
        input: [[64, 25, 12, 22, 11, 90]],
        expected: [11, 12, 22, 25, 64, 90],
        description: "Standard unsorted array",
      },
      {
        input: [[5, 2, 8, 1, 9]],
        expected: [1, 2, 5, 8, 9],
        description: "Small array",
      },
      {
        input: [[1, 2, 3, 4, 5]],
        expected: [1, 2, 3, 4, 5],
        description: "Already sorted",
      },
      {
        input: [[5, 4, 3, 2, 1]],
        expected: [1, 2, 3, 4, 5],
        description: "Reverse sorted",
      },
      {
        input: [[3, 3, 1, 3]],
        expected: [1, 3, 3, 3],
        description: "Duplicate elements",
      },
    ],
    diamondReward: 45,
    experienceReward: 90,
    isPublished: true,
    tags: [
      "Algorithm Viz",
      "Sorting",
      "Beginner",
      "O(n²)",
      "Unstable",
      "In-place",
    ],
    learningObjectives: [
      "Understand minimum selection and placement process",
      "Visualize how sorted portion grows systematically",
      "Learn why selection sort makes fewer swaps than bubble sort",
      "Recognize the consistent O(n²) time complexity",
      "Understand algorithm instability with equal elements",
      "Compare selection sort efficiency vs other O(n²) algorithms",
    ],
  },
  // 3) INSERTION SORT - Building sorted array one element at a time
  {
    id: "insertion-sort-detailed-viz",
    title: "Insertion Sort: Building Sorted Array Incrementally",
    slug: "insertion-sort-step-by-step",
    description:
      "Master insertion sort through detailed visualization - see how elements are inserted into their correct positions one by one, like sorting cards in your hand.",
    content: {
      algorithm: "Insertion Sort",
      description:
        "Watch how insertion sort builds a sorted array by inserting each element into its correct position",
      timeComplexity: "O(n²) worst case, O(n) best case",
      spaceComplexity: "O(1)",
      explanation:
        "Insertion sort builds the final sorted array one item at a time. It's efficient for small datasets and nearly sorted arrays, working like sorting playing cards in your hand.",
      steps: [
        {
          id: 1,
          description: "Initialize with unsorted array",
          data: [5, 2, 4, 6, 1, 3],
          highlights: [],
          comparison: [],
          action: "Starting insertion sort with 6 elements",
        },
        {
          id: 2,
          description: "Consider first element (5) as sorted portion",
          data: [5, 2, 4, 6, 1, 3],
          highlights: [0],
          comparison: [],
          action: "Single element is trivially sorted, sorted portion: [5]",
        },
        {
          id: 3,
          description: "Take second element (2) for insertion",
          data: [5, 2, 4, 6, 1, 3],
          highlights: [1],
          comparison: [0, 1],
          action: "Current element: 2, compare with sorted portion",
        },
        {
          id: 4,
          description: "Compare 2 with 5: 2 < 5, shift 5 right",
          data: [5, 5, 4, 6, 1, 3],
          highlights: [0, 1],
          comparison: [0, 1],
          action: "2 is smaller, shift 5 to make space for 2",
        },
        {
          id: 5,
          description: "Insert 2 at the beginning",
          data: [2, 5, 4, 6, 1, 3],
          highlights: [0, 1],
          comparison: [],
          action: "Inserted 2, sorted portion: [2, 5]",
        },
        {
          id: 6,
          description: "Take third element (4) for insertion",
          data: [2, 5, 4, 6, 1, 3],
          highlights: [2],
          comparison: [1, 2],
          action: "Current element: 4, compare with sorted portion [2, 5]",
        },
        {
          id: 7,
          description: "Compare 4 with 5: 4 < 5, shift 5 right",
          data: [2, 5, 5, 6, 1, 3],
          highlights: [1, 2],
          comparison: [1, 2],
          action: "4 < 5, shift 5 right to make space",
        },
        {
          id: 8,
          description: "Compare 4 with 2: 4 > 2, found insertion point",
          data: [2, 5, 5, 6, 1, 3],
          highlights: [0, 2],
          comparison: [0, 2],
          action: "4 > 2, insert 4 between 2 and 5",
        },
        {
          id: 9,
          description: "Insert 4 in correct position",
          data: [2, 4, 5, 6, 1, 3],
          highlights: [0, 1, 2],
          comparison: [],
          action: "Inserted 4, sorted portion: [2, 4, 5]",
        },
        {
          id: 10,
          description: "Take fourth element (6) for insertion",
          data: [2, 4, 5, 6, 1, 3],
          highlights: [3],
          comparison: [2, 3],
          action: "Current element: 6, compare with sorted portion",
        },
        {
          id: 11,
          description: "Compare 6 with 5: 6 > 5, already in correct position",
          data: [2, 4, 5, 6, 1, 3],
          highlights: [2, 3],
          comparison: [2, 3],
          action: "6 > 5, no shifting needed, 6 stays in place",
        },
        {
          id: 12,
          description: "6 is correctly positioned",
          data: [2, 4, 5, 6, 1, 3],
          highlights: [0, 1, 2, 3],
          comparison: [],
          action: "Sorted portion: [2, 4, 5, 6]",
        },
        {
          id: 13,
          description: "Take fifth element (1) for insertion",
          data: [2, 4, 5, 6, 1, 3],
          highlights: [4],
          comparison: [3, 4],
          action: "Current element: 1, smallest so far",
        },
        {
          id: 14,
          description: "1 < 6, shift 6 right",
          data: [2, 4, 5, 6, 6, 3],
          highlights: [3, 4],
          comparison: [3, 4],
          action: "Shifting 6 right, continue comparing",
        },
        {
          id: 15,
          description: "1 < 5, shift 5 right",
          data: [2, 4, 5, 5, 6, 3],
          highlights: [2, 4],
          comparison: [2, 4],
          action: "Shifting 5 right, continue comparing",
        },
        {
          id: 16,
          description: "1 < 4, shift 4 right",
          data: [2, 4, 4, 5, 6, 3],
          highlights: [1, 4],
          comparison: [1, 4],
          action: "Shifting 4 right, continue comparing",
        },
        {
          id: 17,
          description: "1 < 2, shift 2 right",
          data: [2, 2, 4, 5, 6, 3],
          highlights: [0, 4],
          comparison: [0, 4],
          action: "Shifting 2 right, 1 goes to beginning",
        },
        {
          id: 18,
          description: "Insert 1 at the beginning",
          data: [1, 2, 4, 5, 6, 3],
          highlights: [0, 1, 2, 3, 4],
          comparison: [],
          action: "Inserted 1, sorted portion: [1, 2, 4, 5, 6]",
        },
        {
          id: 19,
          description: "Take last element (3) for insertion",
          data: [1, 2, 4, 5, 6, 3],
          highlights: [5],
          comparison: [4, 5],
          action: "Current element: 3, final insertion",
        },
        {
          id: 20,
          description: "3 < 6, shift 6 right",
          data: [1, 2, 4, 5, 6, 6],
          highlights: [4, 5],
          comparison: [4, 5],
          action: "Shifting 6 right, continue comparing",
        },
        {
          id: 21,
          description: "3 < 5, shift 5 right",
          data: [1, 2, 4, 5, 5, 6],
          highlights: [3, 5],
          comparison: [3, 5],
          action: "Shifting 5 right, continue comparing",
        },
        {
          id: 22,
          description: "3 < 4, shift 4 right",
          data: [1, 2, 4, 4, 5, 6],
          highlights: [2, 5],
          comparison: [2, 5],
          action: "Shifting 4 right, continue comparing",
        },
        {
          id: 23,
          description: "3 > 2, found insertion point",
          data: [1, 2, 4, 4, 5, 6],
          highlights: [1, 5],
          comparison: [1, 5],
          action: "3 > 2, insert 3 between 2 and 4",
        },
        {
          id: 24,
          description: "Insert 3 in correct position",
          data: [1, 2, 3, 4, 5, 6],
          highlights: [0, 1, 2, 3, 4, 5],
          comparison: [],
          action: "Final sorted array: [1, 2, 3, 4, 5, 6]",
        },
        {
          id: 25,
          description: "Insertion sort complete!",
          data: [1, 2, 3, 4, 5, 6],
          highlights: [],
          comparison: [],
          action: "Array is now fully sorted using insertion sort",
        },
      ],
    },
    difficulty: 2,
    order: 3,
    duration: 25,
    category: "Algorithms",
    hasCodeExercise: true,
    starterCode: `# Implement Insertion Sort with Detailed Visualization
def insertion_sort_with_steps(arr):
    """
    Insertion sort implementation with step-by-step tracking
    """
    steps = []
    n = len(arr)
    
    # TODO: Implement insertion sort algorithm
    # Track each step for visualization
    
    for i in range(1, n):
        # TODO: Store current element to insert
        key = arr[i]
        j = i - 1
        
        # TODO: Record step - element to be inserted
        
        # TODO: Shift elements in sorted portion that are greater than key
        while j >= 0 and arr[j] > key:
            # TODO: Shift element right
            # TODO: Record shifting step
            j -= 1
        
        # TODO: Insert key at correct position
        # TODO: Record insertion step
    
    return arr, steps

# Test your implementation
test_array = [5, 2, 4, 6, 1, 3]
print(f"Original array: {test_array}")

sorted_array, visualization_steps = insertion_sort_with_steps(test_array.copy())
print(f"Sorted array: {sorted_array}")

print("\\nVisualization steps:")
for i, step in enumerate(visualization_steps, 1):
    print(f"Step {i}: {step}")`,
    solutionCode: `def insertion_sort_with_steps(arr):
    """
    Insertion sort implementation with step-by-step tracking
    """
    steps = []
    n = len(arr)
    
    steps.append({
        'step': 0,
        'array': arr.copy(),
        'description': f'Initial array: {arr}',
        'current_element': None,
        'sorted_portion': []
    })
    
    for i in range(1, n):
        key = arr[i]
        j = i - 1
        
        steps.append({
            'step': len(steps),
            'array': arr.copy(),
            'description': f'Taking element {key} at index {i} for insertion',
            'current_element': key,
            'sorted_portion': arr[:i]
        })
        
        # Shift elements of arr[0..i-1] that are greater than key
        while j >= 0 and arr[j] > key:
            steps.append({
                'step': len(steps),
                'array': arr.copy(),
                'description': f'Comparing {key} with {arr[j]}: {key} < {arr[j]}, shifting {arr[j]} right',
                'current_element': key,
                'comparing_with': arr[j]
            })
            
            arr[j + 1] = arr[j]
            j -= 1
            
            steps.append({
                'step': len(steps),
                'array': arr.copy(),
                'description': f'Shifted {arr[j + 2]} to position {j + 2}',
                'current_element': key,
                'shifted_element': arr[j + 2]
            })
        
        # Place key at its correct position
        arr[j + 1] = key
        
        steps.append({
            'step': len(steps),
            'array': arr.copy(),
            'description': f'Inserted {key} at position {j + 1}',
            'current_element': key,
            'sorted_portion': arr[:i + 1]
        })
    
    steps.append({
        'step': len(steps),
        'array': arr.copy(),
        'description': 'Insertion sort completed!',
        'current_element': None,
        'sorted_portion': arr
    })
    
    return arr, steps`,
    testCases: [
      {
        input: [[5, 2, 4, 6, 1, 3]],
        expected: [[1, 2, 3, 4, 5, 6]],
        description: "Sort array with mixed positive numbers",
      },
      {
        input: [[1, 2, 3, 4, 5]],
        expected: [[1, 2, 3, 4, 5]],
        description: "Already sorted array (best case O(n))",
      },
      {
        input: [[5, 4, 3, 2, 1]],
        expected: [[1, 2, 3, 4, 5]],
        description: "Reverse sorted array (worst case O(n²))",
      },
      {
        input: [[1]],
        expected: [[1]],
        description: "Single element array",
      },
      {
        input: [[3, 1, 4, 1, 5, 9, 2, 6]],
        expected: [[1, 1, 2, 3, 4, 5, 6, 9]],
        description: "Array with duplicate elements",
      },
    ],
    diamondReward: 55,
    experienceReward: 100,
    isPublished: true,
    tags: [
      "Sorting",
      "Insertion Sort",
      "O(n²)",
      "Stable",
      "In-place",
      "Adaptive",
    ],
    learningObjectives: [
      "Understand how insertion sort builds sorted array incrementally",
      "Master the concept of maintaining a sorted portion",
      "Learn when insertion sort is efficient (small/nearly sorted arrays)",
      "Practice shifting elements and finding insertion points",
      "Recognize insertion sort's adaptive nature",
      "Compare with other O(n²) sorting algorithms",
    ],
  },

  // 4) MERGE SORT - Divide and Conquer sorting
  {
    id: "merge-sort-detailed-viz",
    title: "Merge Sort: Divide and Conquer Mastery",
    slug: "merge-sort-step-by-step",
    description:
      "Master merge sort through detailed visualization - see how divide-and-conquer strategy breaks down the problem and merges sorted subarrays efficiently.",
    content: {
      algorithm: "Merge Sort",
      description:
        "Watch how merge sort uses divide-and-conquer to sort arrays efficiently",
      timeComplexity: "O(n log n) in all cases",
      spaceComplexity: "O(n)",
      explanation:
        "Merge sort divides the array into two halves, recursively sorts them, and then merges the sorted halves. It's stable and has guaranteed O(n log n) performance.",
      steps: [
        {
          id: 1,
          description: "Initial unsorted array",
          data: [6, 5, 3, 1, 8, 7, 2, 4],
          highlights: [],
          comparison: [],
          action: "Starting merge sort with 8 elements",
        },
        {
          id: 2,
          description: "Divide: Split array into two halves",
          data: [6, 5, 3, 1, 8, 7, 2, 4],
          highlights: [0, 1, 2, 3],
          comparison: [4, 5, 6, 7],
          action: "Left half: [6,5,3,1], Right half: [8,7,2,4]",
        },
        {
          id: 3,
          description: "Divide left half further",
          data: [6, 5, 3, 1, 8, 7, 2, 4],
          highlights: [0, 1],
          comparison: [2, 3],
          action: "Left-left: [6,5], Left-right: [3,1]",
        },
        {
          id: 4,
          description: "Divide until single elements (base case)",
          data: [6, 5, 3, 1, 8, 7, 2, 4],
          highlights: [0],
          comparison: [1],
          action: "Base case reached: [6] and [5] are single elements",
        },
        {
          id: 5,
          description: "Merge [6] and [5]: compare and merge",
          data: [5, 6, 3, 1, 8, 7, 2, 4],
          highlights: [0, 1],
          comparison: [],
          action: "5 < 6, merged result: [5, 6]",
        },
        {
          id: 6,
          description: "Process [3] and [1]: merge to [1, 3]",
          data: [5, 6, 1, 3, 8, 7, 2, 4],
          highlights: [2, 3],
          comparison: [],
          action: "1 < 3, merged result: [1, 3]",
        },
        {
          id: 7,
          description: "Merge [5,6] and [1,3]",
          data: [5, 6, 1, 3, 8, 7, 2, 4],
          highlights: [0, 1, 2, 3],
          comparison: [],
          action: "Merging two sorted subarrays of size 2",
        },
        {
          id: 8,
          description: "Compare 5 and 1: 1 < 5",
          data: [1, 6, 5, 3, 8, 7, 2, 4],
          highlights: [0],
          comparison: [0, 2],
          action: "Take 1 first from right subarray",
        },
        {
          id: 9,
          description: "Compare 5 and 3: 3 < 5",
          data: [1, 3, 5, 6, 8, 7, 2, 4],
          highlights: [1],
          comparison: [2, 3],
          action: "Take 3 next from right subarray",
        },
        {
          id: 10,
          description: "Take remaining 5 and 6",
          data: [1, 3, 5, 6, 8, 7, 2, 4],
          highlights: [0, 1, 2, 3],
          comparison: [],
          action: "Left half sorted: [1, 3, 5, 6]",
        },
        {
          id: 11,
          description: "Process right half: divide [8,7,2,4]",
          data: [1, 3, 5, 6, 8, 7, 2, 4],
          highlights: [4, 5],
          comparison: [6, 7],
          action: "Right-left: [8,7], Right-right: [2,4]",
        },
        {
          id: 12,
          description: "Merge [8] and [7]: result [7, 8]",
          data: [1, 3, 5, 6, 7, 8, 2, 4],
          highlights: [4, 5],
          comparison: [],
          action: "7 < 8, merged result: [7, 8]",
        },
        {
          id: 13,
          description: "Merge [2] and [4]: result [2, 4]",
          data: [1, 3, 5, 6, 7, 8, 2, 4],
          highlights: [6, 7],
          comparison: [],
          action: "2 < 4, merged result: [2, 4]",
        },
        {
          id: 14,
          description: "Merge [7,8] and [2,4]",
          data: [1, 3, 5, 6, 7, 8, 2, 4],
          highlights: [4, 5, 6, 7],
          comparison: [],
          action: "Merging two sorted subarrays to complete right half",
        },
        {
          id: 15,
          description: "Compare 7 and 2: 2 < 7",
          data: [1, 3, 5, 6, 2, 8, 7, 4],
          highlights: [4],
          comparison: [4, 6],
          action: "Take 2 first from right subarray",
        },
        {
          id: 16,
          description: "Compare 7 and 4: 4 < 7",
          data: [1, 3, 5, 6, 2, 4, 7, 8],
          highlights: [5],
          comparison: [6, 7],
          action: "Take 4 next from right subarray",
        },
        {
          id: 17,
          description: "Take remaining 7 and 8",
          data: [1, 3, 5, 6, 2, 4, 7, 8],
          highlights: [4, 5, 6, 7],
          comparison: [],
          action: "Right half sorted: [2, 4, 7, 8]",
        },
        {
          id: 18,
          description: "Final merge: [1,3,5,6] and [2,4,7,8]",
          data: [1, 3, 5, 6, 2, 4, 7, 8],
          highlights: [0, 1, 2, 3],
          comparison: [4, 5, 6, 7],
          action: "Merging two sorted halves to complete sort",
        },
        {
          id: 19,
          description: "Compare 1 and 2: 1 < 2",
          data: [1, 3, 5, 6, 2, 4, 7, 8],
          highlights: [0],
          comparison: [0, 4],
          action: "Take 1 first from left half",
        },
        {
          id: 20,
          description: "Compare 3 and 2: 2 < 3",
          data: [1, 2, 5, 6, 3, 4, 7, 8],
          highlights: [1],
          comparison: [1, 4],
          action: "Take 2 next from right half",
        },
        {
          id: 21,
          description: "Compare 3 and 4: 3 < 4",
          data: [1, 2, 3, 6, 5, 4, 7, 8],
          highlights: [2],
          comparison: [2, 5],
          action: "Take 3 from left half",
        },
        {
          id: 22,
          description: "Compare 5 and 4: 4 < 5",
          data: [1, 2, 3, 4, 5, 6, 7, 8],
          highlights: [3],
          comparison: [4, 5],
          action: "Take 4 from right half",
        },
        {
          id: 23,
          description: "Continue merging remaining elements",
          data: [1, 2, 3, 4, 5, 6, 7, 8],
          highlights: [4, 5, 6, 7],
          comparison: [],
          action: "Take remaining elements in order: 5, 6, 7, 8",
        },
        {
          id: 24,
          description: "Merge sort complete!",
          data: [1, 2, 3, 4, 5, 6, 7, 8],
          highlights: [],
          comparison: [],
          action: "Array sorted using divide-and-conquer strategy",
        },
      ],
    },
    difficulty: 3,
    order: 4,
    duration: 30,
    category: "Algorithms",
    hasCodeExercise: true,
    starterCode: `# Implement Merge Sort with Detailed Visualization
def merge_sort_with_steps(arr, start=0, end=None):
    """
    Merge sort implementation with step-by-step tracking
    """
    if end is None:
        end = len(arr) - 1
    
    steps = []
    
    def merge_sort_recursive(arr, start, end, steps):
        if start >= end:
            return
        
        # TODO: Find middle point to divide array
        mid = (start + end) // 2
        
        # TODO: Record divide step
        
        # TODO: Recursively sort first and second halves
        merge_sort_recursive(arr, start, mid, steps)
        merge_sort_recursive(arr, mid + 1, end, steps)
        
        # TODO: Merge the sorted halves
        merge(arr, start, mid, end, steps)
    
    def merge(arr, start, mid, end, steps):
        """Merge two sorted subarrays"""
        # TODO: Create temporary arrays for left and right subarrays
        left = arr[start:mid + 1]
        right = arr[mid + 1:end + 1]
        
        # TODO: Record merge step
        
        # TODO: Merge the temporary arrays back into arr[start:end+1]
        i = j = 0
        k = start
        
        while i < len(left) and j < len(right):
            # TODO: Compare elements and merge in sorted order
            # TODO: Record comparison step
            
            if left[i] <= right[j]:
                arr[k] = left[i]
                i += 1
            else:
                arr[k] = right[j]
                j += 1
            k += 1
        
        # TODO: Copy remaining elements
        while i < len(left):
            arr[k] = left[i]
            i += 1
            k += 1
        
        while j < len(right):
            arr[k] = right[j]
            j += 1
            k += 1
    
    merge_sort_recursive(arr, start, end, steps)
    return arr, steps

# Test your implementation
test_array = [6, 5, 3, 1, 8, 7, 2, 4]
print(f"Original array: {test_array}")

sorted_array, visualization_steps = merge_sort_with_steps(test_array.copy())
print(f"Sorted array: {sorted_array}")`,
    solutionCode: `def merge_sort_with_steps(arr, start=0, end=None):
    if end is None:
        end = len(arr) - 1
    
    steps = []
    
    def merge_sort_recursive(arr, start, end, steps):
        if start >= end:
            return
        
        mid = (start + end) // 2
        
        steps.append({
            'step': len(steps),
            'array': arr.copy(),
            'description': f'Divide: [{start}:{end}] -> [{start}:{mid}] and [{mid+1}:{end}]',
            'left_range': (start, mid),
            'right_range': (mid + 1, end)
        })
        
        merge_sort_recursive(arr, start, mid, steps)
        merge_sort_recursive(arr, mid + 1, end, steps)
        merge(arr, start, mid, end, steps)
    
    def merge(arr, start, mid, end, steps):
        left = arr[start:mid + 1]
        right = arr[mid + 1:end + 1]
        
        steps.append({
            'step': len(steps),
            'array': arr.copy(),
            'description': f'Merge subarrays: {left} and {right}',
            'left_subarray': left,
            'right_subarray': right
        })
        
        i = j = 0
        k = start
        
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                arr[k] = left[i]
                steps.append({
                    'step': len(steps),
                    'array': arr.copy(),
                    'description': f'Take {left[i]} from left subarray',
                    'compared': (left[i], right[j])
                })
                i += 1
            else:
                arr[k] = right[j]
                steps.append({
                    'step': len(steps),
                    'array': arr.copy(),
                    'description': f'Take {right[j]} from right subarray',
                    'compared': (left[i], right[j])
                })
                j += 1
            k += 1
        
        while i < len(left):
            arr[k] = left[i]
            i += 1
            k += 1
        
        while j < len(right):
            arr[k] = right[j]
            j += 1
            k += 1
    
    merge_sort_recursive(arr, start, end, steps)
    return arr, steps`,
    testCases: [
      {
        input: [[6, 5, 3, 1, 8, 7, 2, 4]],
        expected: [[1, 2, 3, 4, 5, 6, 7, 8]],
        description: "Standard unsorted array",
      },
      {
        input: [[1, 2, 3, 4, 5]],
        expected: [[1, 2, 3, 4, 5]],
        description: "Already sorted array (still O(n log n))",
      },
      {
        input: [[5, 4, 3, 2, 1]],
        expected: [[1, 2, 3, 4, 5]],
        description: "Reverse sorted array",
      },
      {
        input: [[1]],
        expected: [[1]],
        description: "Single element",
      },
      {
        input: [[3, 1, 4, 1, 5, 9, 2, 6, 5]],
        expected: [[1, 1, 2, 3, 4, 5, 5, 6, 9]],
        description: "Array with duplicates",
      },
    ],
    diamondReward: 65,
    experienceReward: 120,
    isPublished: true,
    tags: [
      "Sorting",
      "Merge Sort",
      "Divide and Conquer",
      "O(n log n)",
      "Stable",
      "Recursive",
    ],
    learningObjectives: [
      "Master divide-and-conquer strategy",
      "Understand recursive problem decomposition",
      "Learn efficient merging of sorted arrays",
      "Appreciate guaranteed O(n log n) performance",
      "Recognize merge sort's stability property",
      "Compare space-time tradeoffs with other algorithms",
    ],
  },

  // 5) QUICK SORT - Partition-based sorting
  {
    id: "quick-sort-detailed-viz",
    title: "Quick Sort: Partition and Conquer Strategy",
    slug: "quick-sort-step-by-step",
    description:
      "Master quick sort through detailed visualization - see how partitioning around a pivot element efficiently sorts arrays with average O(n log n) performance.",
    content: {
      algorithm: "Quick Sort",
      description:
        "Watch how quick sort uses partitioning to sort arrays efficiently",
      timeComplexity: "O(n log n) average, O(n²) worst case",
      spaceComplexity: "O(log n) average",
      explanation:
        "Quick sort selects a 'pivot' element and partitions the array so all smaller elements come before the pivot and all larger elements come after. It then recursively sorts the subarrays.",
      steps: [
        {
          id: 1,
          description: "Initial unsorted array",
          data: [7, 2, 1, 6, 8, 5, 3, 4],
          highlights: [],
          comparison: [],
          action: "Starting quick sort with 8 elements",
        },
        {
          id: 2,
          description: "Choose pivot element (last element: 4)",
          data: [7, 2, 1, 6, 8, 5, 3, 4],
          highlights: [7],
          comparison: [],
          action: "Pivot selected: 4 at index 7",
        },
        {
          id: 3,
          description: "Initialize partition pointers",
          data: [7, 2, 1, 6, 8, 5, 3, 4],
          highlights: [0, 7],
          comparison: [],
          action: "Left pointer at index 0, pivot at index 7",
        },
        {
          id: 4,
          description: "Compare 7 with pivot 4: 7 > 4",
          data: [7, 2, 1, 6, 8, 5, 3, 4],
          highlights: [0],
          comparison: [0, 7],
          action: "7 is greater than pivot, stays on right side",
        },
        {
          id: 5,
          description: "Compare 2 with pivot 4: 2 < 4",
          data: [2, 7, 1, 6, 8, 5, 3, 4],
          highlights: [0, 1],
          comparison: [1, 7],
          action: "2 is smaller, swap with first greater element",
        },
        {
          id: 6,
          description: "Compare 1 with pivot 4: 1 < 4",
          data: [2, 1, 7, 6, 8, 5, 3, 4],
          highlights: [1, 2],
          comparison: [2, 7],
          action: "1 is smaller, continue partitioning",
        },
        {
          id: 7,
          description: "Compare 6 with pivot 4: 6 > 4",
          data: [2, 1, 7, 6, 8, 5, 3, 4],
          highlights: [3],
          comparison: [3, 7],
          action: "6 is greater than pivot, stays in place",
        },
        {
          id: 8,
          description: "Compare 8 with pivot 4: 8 > 4",
          data: [2, 1, 7, 6, 8, 5, 3, 4],
          highlights: [4],
          comparison: [4, 7],
          action: "8 is greater than pivot, stays in place",
        },
        {
          id: 9,
          description: "Compare 5 with pivot 4: 5 > 4",
          data: [2, 1, 7, 6, 8, 5, 3, 4],
          highlights: [5],
          comparison: [5, 7],
          action: "5 is greater than pivot, stays in place",
        },
        {
          id: 10,
          description: "Compare 3 with pivot 4: 3 < 4",
          data: [2, 1, 3, 6, 8, 5, 7, 4],
          highlights: [2, 6],
          comparison: [6, 7],
          action: "3 is smaller, swap with element at partition boundary",
        },
        {
          id: 11,
          description: "Place pivot in correct position",
          data: [2, 1, 3, 4, 8, 5, 7, 6],
          highlights: [3],
          comparison: [],
          action: "Pivot 4 placed at index 3, partitioning complete",
        },
        {
          id: 12,
          description: "Partition result: smaller | pivot | larger",
          data: [2, 1, 3, 4, 8, 5, 7, 6],
          highlights: [0, 1, 2],
          comparison: [4, 5, 6, 7],
          action: "Left: [2,1,3], Pivot: [4], Right: [8,5,7,6]",
        },
        {
          id: 13,
          description: "Recursively sort left subarray [2,1,3]",
          data: [2, 1, 3, 4, 8, 5, 7, 6],
          highlights: [0, 1, 2],
          comparison: [],
          action: "Quick sort left subarray with pivot 3",
        },
        {
          id: 14,
          description: "Left subarray: choose pivot 3",
          data: [2, 1, 3, 4, 8, 5, 7, 6],
          highlights: [2],
          comparison: [0, 1],
          action: "Partition [2,1,3] with pivot 3",
        },
        {
          id: 15,
          description: "Partition left: 2 < 3, 1 < 3",
          data: [1, 2, 3, 4, 8, 5, 7, 6],
          highlights: [0, 1, 2],
          comparison: [],
          action: "Left subarray sorted: [1, 2, 3]",
        },
        {
          id: 16,
          description: "Recursively sort right subarray [8,5,7,6]",
          data: [1, 2, 3, 4, 8, 5, 7, 6],
          highlights: [4, 5, 6, 7],
          comparison: [],
          action: "Quick sort right subarray with pivot 6",
        },
        {
          id: 17,
          description: "Right subarray: choose pivot 6",
          data: [1, 2, 3, 4, 8, 5, 7, 6],
          highlights: [7],
          comparison: [4, 5, 6],
          action: "Partition [8,5,7,6] with pivot 6",
        },
        {
          id: 18,
          description: "Partition: 8 > 6, 5 < 6, 7 > 6",
          data: [1, 2, 3, 4, 5, 8, 7, 6],
          highlights: [4, 5, 6, 7],
          comparison: [],
          action: "5 moves to left side of partition",
        },
        {
          id: 19,
          description: "Place pivot 6 in correct position",
          data: [1, 2, 3, 4, 5, 6, 7, 8],
          highlights: [5],
          comparison: [],
          action: "Pivot 6 placed correctly",
        },
        {
          id: 20,
          description: "Final partitions in place",
          data: [1, 2, 3, 4, 5, 6, 7, 8],
          highlights: [0, 1, 2, 3, 4, 5, 6, 7],
          comparison: [],
          action: "All elements in sorted positions",
        },
        {
          id: 21,
          description: "Quick sort complete!",
          data: [1, 2, 3, 4, 5, 6, 7, 8],
          highlights: [],
          comparison: [],
          action: "Array sorted using partition-based strategy",
        },
      ],
    },
    difficulty: 3,
    order: 5,
    duration: 28,
    category: "Algorithms",
    hasCodeExercise: true,
    starterCode: `# Implement Quick Sort with Detailed Visualization
def quick_sort_with_steps(arr, low=0, high=None):
    """
    Quick sort implementation with step-by-step tracking
    """
    if high is None:
        high = len(arr) - 1
    
    steps = []
    
    def quick_sort_recursive(arr, low, high, steps):
        if low < high:
            # TODO: Partition the array and get pivot index
            pivot_index = partition(arr, low, high, steps)
            
            # TODO: Recursively sort elements before and after partition
            quick_sort_recursive(arr, low, pivot_index - 1, steps)
            quick_sort_recursive(arr, pivot_index + 1, high, steps)
    
    def partition(arr, low, high, steps):
        """Partition function using last element as pivot"""
        # TODO: Choose pivot (last element)
        pivot = arr[high]
        
        # TODO: Record pivot selection step
        
        # TODO: Index of smaller element (partition boundary)
        i = low - 1
        
        for j in range(low, high):
            # TODO: Compare current element with pivot
            # TODO: Record comparison step
            
            if arr[j] <= pivot:
                # TODO: Increment index of smaller element
                i += 1
                # TODO: Swap elements
                arr[i], arr[j] = arr[j], arr[i]
                # TODO: Record swap step
        
        # TODO: Place pivot in correct position
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        # TODO: Record pivot placement step
        
        return i + 1
    
    quick_sort_recursive(arr, low, high, steps)
    return arr, steps

# Test your implementation
test_array = [7, 2, 1, 6, 8, 5, 3, 4]
print(f"Original array: {test_array}")

sorted_array, visualization_steps = quick_sort_with_steps(test_array.copy())
print(f"Sorted array: {sorted_array}")`,
    solutionCode: `def quick_sort_with_steps(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    
    steps = []
    
    def quick_sort_recursive(arr, low, high, steps):
        if low < high:
            pivot_index = partition(arr, low, high, steps)
            quick_sort_recursive(arr, low, pivot_index - 1, steps)
            quick_sort_recursive(arr, pivot_index + 1, high, steps)
    
    def partition(arr, low, high, steps):
        pivot = arr[high]
        
        steps.append({
            'step': len(steps),
            'array': arr.copy(),
            'description': f'Choose pivot: {pivot} at index {high}',
            'pivot': pivot,
            'range': (low, high)
        })
        
        i = low - 1
        
        for j in range(low, high):
            steps.append({
                'step': len(steps),
                'array': arr.copy(),
                'description': f'Compare {arr[j]} with pivot {pivot}',
                'comparing': (arr[j], pivot),
                'current_index': j
            })
            
            if arr[j] <= pivot:
                i += 1
                if i != j:
                    arr[i], arr[j] = arr[j], arr[i]
                    steps.append({
                        'step': len(steps),
                        'array': arr.copy(),
                        'description': f'Swap {arr[j]} with {arr[i]} (smaller than pivot)',
                        'swapped': (i, j)
                    })
        
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        steps.append({
            'step': len(steps),
            'array': arr.copy(),
            'description': f'Place pivot {pivot} at correct position {i + 1}',
            'pivot_position': i + 1
        })
        
        return i + 1
    
    quick_sort_recursive(arr, low, high, steps)
    return arr, steps`,
    testCases: [
      {
        input: [[7, 2, 1, 6, 8, 5, 3, 4]],
        expected: [[1, 2, 3, 4, 5, 6, 7, 8]],
        description: "Standard unsorted array",
      },
      {
        input: [[1, 2, 3, 4, 5]],
        expected: [[1, 2, 3, 4, 5]],
        description: "Already sorted array (worst case O(n²))",
      },
      {
        input: [[5, 4, 3, 2, 1]],
        expected: [[1, 2, 3, 4, 5]],
        description: "Reverse sorted array",
      },
      {
        input: [[1]],
        expected: [[1]],
        description: "Single element",
      },
      {
        input: [[3, 3, 3, 3, 3]],
        expected: [[3, 3, 3, 3, 3]],
        description: "All duplicate elements",
      },
    ],
    diamondReward: 70,
    experienceReward: 130,
    isPublished: true,
    tags: [
      "Sorting",
      "Quick Sort",
      "Divide and Conquer",
      "Partitioning",
      "O(n log n)",
      "In-place",
    ],
    learningObjectives: [
      "Master partitioning strategy around pivot elements",
      "Understand best, average, and worst-case scenarios",
      "Learn in-place sorting with minimal extra space",
      "Practice recursive problem decomposition",
      "Recognize when quick sort is most effective",
      "Compare pivot selection strategies",
    ],
  },
];

export async function seedSortingAlgorithms() {
  console.log("🔄 Seeding Sorting Algorithm Challenges...");

  try {
    for (const challenge of sortingAlgorithmChallenges) {
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
          source: "sorting_algorithm_seed",
          migrated_at: new Date().toISOString(),
        }),
      };

      await prisma.learningActivity.upsert({
        where: { id: challenge.id },
        update: learningActivityData,
        create: learningActivityData,
      });
      console.log(`✅ Created sorting algorithm challenge: ${challenge.title}`);
    }

    console.log("🎉 Sorting algorithm challenges seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding sorting algorithms:", error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    await seedSortingAlgorithms();
    console.log("✅ Sorting algorithm seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding sorting algorithms:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}
