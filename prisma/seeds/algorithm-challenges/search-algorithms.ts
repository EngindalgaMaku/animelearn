import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * SEARCH ALGORITHMS - Detailed Algorithm Visualization Challenges
 *
 * These challenges provide step-by-step visual explanations of search algorithms
 * with detailed analysis, comparisons, and interactive learning objectives.
 */

export const searchAlgorithmChallenges = [
  // 1) LINEAR SEARCH - Sequential Search
  {
    id: "linear-search-detailed-viz",
    title: "Linear Search: Sequential Element Discovery",
    slug: "linear-search-step-by-step",
    description:
      "Master linear search through detailed visualization - see every comparison, understand O(n) complexity, and learn when sequential search is the right choice.",
    content: {
      algorithm: "Linear Search",
      description:
        "Watch how linear search algorithm works step by step with interactive visualization",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      explanation:
        "Linear Search examines each element sequentially until the target is found or the array ends. It's simple but requires checking every element in worst case.",
      steps: [
        {
          id: 1,
          description: "Initialize linear search for target = 7",
          data: [3, 1, 4, 7, 9, 2, 8],
          highlights: [],
          comparison: [],
          action: "Array length: 7, searching sequentially from left to right",
        },
        {
          id: 2,
          description: "Start at index 0 - Beginning of sequential search",
          data: [3, 1, 4, 7, 9, 2, 8],
          highlights: [0],
          comparison: [],
          action: "Initialize search pointer at first position",
        },
        {
          id: 3,
          description: "Check element at index 0: Compare 3 with target 7",
          data: [3, 1, 4, 7, 9, 2, 8],
          highlights: [0],
          comparison: [0],
          action: "Is 3 equal to 7? No, 3 ≠ 7",
        },
        {
          id: 4,
          description: "Move to next position - index 1",
          data: [3, 1, 4, 7, 9, 2, 8],
          highlights: [1],
          comparison: [],
          action: "Advance search pointer, check next element",
        },
        {
          id: 5,
          description: "Check element at index 1: Compare 1 with target 7",
          data: [3, 1, 4, 7, 9, 2, 8],
          highlights: [1],
          comparison: [1],
          action: "Is 1 equal to 7? No, 1 ≠ 7",
        },
        {
          id: 6,
          description: "Move to next position - index 2",
          data: [3, 1, 4, 7, 9, 2, 8],
          highlights: [2],
          comparison: [],
          action: "Continue sequential search, advance pointer",
        },
        {
          id: 7,
          description: "Check element at index 2: Compare 4 with target 7",
          data: [3, 1, 4, 7, 9, 2, 8],
          highlights: [2],
          comparison: [2],
          action: "Is 4 equal to 7? No, 4 ≠ 7",
        },
        {
          id: 8,
          description: "Move to next position - index 3",
          data: [3, 1, 4, 7, 9, 2, 8],
          highlights: [3],
          comparison: [],
          action: "Half way through array, continue searching",
        },
        {
          id: 9,
          description: "Check element at index 3: Compare 7 with target 7",
          data: [3, 1, 4, 7, 9, 2, 8],
          highlights: [3],
          comparison: [3],
          action: "Is 7 equal to 7? YES! 7 = 7 ✅",
        },
        {
          id: 10,
          description: "MATCH FOUND! Target located at index 3",
          data: [3, 1, 4, 7, 9, 2, 8],
          highlights: [3],
          comparison: [],
          action: "Search successful! Element 7 found at position 3",
        },
        {
          id: 11,
          description: "Search complete - Return index 3",
          data: [3, 1, 4, 7, 9, 2, 8],
          highlights: [3],
          comparison: [],
          action: "Linear search finished: found target in 4 comparisons",
        },
        {
          id: 12,
          description: "Performance analysis: Best case scenario",
          data: [3, 1, 4, 7, 9, 2, 8],
          highlights: [3],
          comparison: [],
          action: "Target found after 4/7 elements checked (57% efficiency)",
        },
        {
          id: 13,
          description: "Alternative scenario: Target not in first position",
          data: [7, 1, 4, 3, 9, 2, 8],
          highlights: [0],
          comparison: [],
          action: "If target was first: Best case O(1) - 1 comparison",
        },
        {
          id: 14,
          description: "Alternative scenario: Target at end",
          data: [3, 1, 4, 2, 9, 8, 7],
          highlights: [6],
          comparison: [],
          action: "If target was last: Worst case O(n) - 7 comparisons",
        },
        {
          id: 15,
          description: "Alternative scenario: Target not found",
          data: [3, 1, 4, 2, 9, 8, 5],
          highlights: [],
          comparison: [],
          action: "If target missing: Would check all n elements, return -1",
        },
        {
          id: 16,
          description: "Linear search complexity summary",
          data: [3, 1, 4, 7, 9, 2, 8],
          highlights: [3],
          comparison: [],
          action: "Time: O(n), Space: O(1), works on unsorted data ✅",
        },
      ],
    },
    difficulty: 1,
    order: 1,
    duration: 15,
    category: "Algorithms",
    hasCodeExercise: true,
    starterCode: `# Implement Linear Search with Detailed Visualization
def linear_search_visualized(arr, target):
    """
    Linear search with step-by-step tracking for visualization
    Returns: (index_found, steps_taken, total_comparisons)
    """
    steps = []
    comparisons = 0
    
    # TODO: Implement the linear search algorithm
    # For each index i from 0 to len(arr)-1:
    #   - Increment comparisons counter
    #   - Compare arr[i] with target
    #   - Record this step for visualization
    #   - If match found:
    #     - Record success step
    #     - Return i (the index where found)
    #   - If no match, continue to next element
    # 
    # If loop completes without finding target:
    #   - Record failure step
    #   - Return -1 (not found)
    
    # Hint: Record each step as:
    # steps.append({
    #     'index': i,
    #     'value': arr[i],
    #     'target': target,
    #     'comparison': f"{arr[i]} == {target}",
    #     'found': True/False,
    #     'description': "Clear description of what happened"
    # })
    
    return -1, steps, comparisons  # Placeholder return

# Test your implementation
test_array = [3, 1, 4, 7, 9, 2, 8]
target_value = 7

print(f"Searching for {target_value} in array: {test_array}")
index, steps, comps = linear_search_visualized(test_array, target_value)

if index != -1:
    print(f"✅ Found {target_value} at index {index}")
else:
    print(f"❌ {target_value} not found in array")

print(f"Total comparisons: {comps}")
print(f"Total steps tracked: {len(steps)}")

# Print each step for verification
for i, step in enumerate(steps):
    print(f"Step {i+1}: {step}")

# Test edge cases
print("\\n" + "="*50)
print("Testing edge cases:")

# Test not found
not_found_idx, _, comps2 = linear_search_visualized(test_array, 99)
print(f"Search for 99: index={not_found_idx}, comparisons={comps2}")

# Test first element
first_idx, _, comps3 = linear_search_visualized(test_array, 3)
print(f"Search for 3 (first): index={first_idx}, comparisons={comps3}")

# Test last element  
last_idx, _, comps4 = linear_search_visualized(test_array, 8)
print(f"Search for 8 (last): index={last_idx}, comparisons={comps4}")`,
    solutionCode: `def linear_search_visualized(arr, target):
    """
    Linear search with step-by-step tracking for visualization
    Returns: (index_found, steps_taken, total_comparisons)
    """
    steps = []
    comparisons = 0
    
    # Handle empty array edge case
    if not arr:
        steps.append({
            'index': None,
            'value': None,
            'target': target,
            'comparison': None,
            'found': False,
            'description': f"Array is empty - cannot find {target}"
        })
        return -1, steps, comparisons
    
    # Search through each element
    for i in range(len(arr)):
        comparisons += 1
        current_value = arr[i]
        
        # Record the comparison step
        step_info = {
            'index': i,
            'value': current_value,
            'target': target,
            'comparison': f"{current_value} == {target}",
            'found': False,
            'description': f"Step {i+1}: Check arr[{i}] = {current_value} vs target {target}"
        }
        
        # Check if current element matches target
        if current_value == target:
            # Found the target!
            step_info['found'] = True
            step_info['description'] += f" → MATCH! Found {target} at index {i}"
            steps.append(step_info)
            
            # Add summary step
            steps.append({
                'index': i,
                'value': current_value,
                'target': target,
                'comparison': None,
                'found': True,
                'description': f"✅ Search successful! {target} found at index {i} after {comparisons} comparisons"
            })
            
            return i, steps, comparisons
        else:
            # No match, continue searching
            step_info['description'] += f" → No match, continue searching..."
            steps.append(step_info)
    
    # Target not found after checking all elements
    steps.append({
        'index': None,
        'value': None,
        'target': target,
        'comparison': None,
        'found': False,
        'description': f"❌ Search failed! {target} not found after checking all {len(arr)} elements ({comparisons} comparisons)"
    })
    
    return -1, steps, comparisons

# Enhanced visualization function
def visualize_linear_search(arr, target):
    """Enhanced visualization with detailed analysis"""
    print(f"🔍 LINEAR SEARCH VISUALIZATION")
    print(f"Array: {arr}")
    print(f"Target: {target}")
    print(f"Array length: {len(arr)}")
    print("=" * 60)
    
    index, steps, comparisons = linear_search_visualized(arr, target)
    
    # Show each step
    for i, step in enumerate(steps):
        if step['index'] is not None:
            status = "✅ FOUND" if step['found'] else "❌ CONTINUE"
            print(f"  Step {i+1}: arr[{step['index']}] = {step['value']} | {step['comparison']} | {status}")
        else:
            print(f"  {step['description']}")
    
    print("\\n" + "=" * 60)
    print(f"🎯 RESULTS:")
    if index != -1:
        print(f"✅ SUCCESS: Found {target} at index {index}")
    else:
        print(f"❌ FAILURE: {target} not found in array")
    
    print(f"Total comparisons: {comparisons}")
    
    # Performance analysis
    n = len(arr)
    if n > 0:
        print(f"\\n📊 PERFORMANCE ANALYSIS:")
        print(f"Best case: 1 comparison (target at index 0)")
        print(f"Worst case: {n} comparisons (target at end or not found)")
        print(f"Average case: {n//2} comparisons (target in middle)")
        print(f"Actual: {comparisons} comparisons")
        
        if comparisons == 1:
            print("🏆 Best case achieved!")
        elif comparisons == n:
            print("😅 Worst case occurred")
        else:
            efficiency = (comparisons / n) * 100
            print(f"📈 Efficiency: {efficiency:.1f}% through array")
    
    return index, steps, comparisons

# Multiple search function for comprehensive testing
def test_multiple_searches(arr, targets):
    """Test linear search on multiple targets"""
    print(f"🧪 COMPREHENSIVE LINEAR SEARCH TESTING")
    print(f"Array: {arr}")
    print(f"Targets: {targets}")
    print("=" * 70)
    
    total_comparisons = 0
    results = []
    
    for target in targets:
        print(f"\\n🎯 Searching for {target}:")
        index, steps, comps = linear_search_visualized(arr, target)
        total_comparisons += comps
        
        results.append({
            'target': target,
            'index': index,
            'comparisons': comps,
            'found': index != -1
        })
        
        if index != -1:
            print(f"  ✅ Found at index {index} ({comps} comparisons)")
        else:
            print(f"  ❌ Not found ({comps} comparisons)")
    
    print(f"\\n📊 SUMMARY:")
    print(f"Total searches: {len(targets)}")
    print(f"Successful: {sum(1 for r in results if r['found'])}")
    print(f"Failed: {sum(1 for r in results if not r['found'])}")
    print(f"Total comparisons: {total_comparisons}")
    print(f"Average comparisons per search: {total_comparisons/len(targets):.1f}")
    
    return results`,
    testCases: [
      {
        input: [[3, 1, 4, 7, 9, 2, 8], 7],
        expected: 3,
        description: "Find element in middle of array",
      },
      {
        input: [[3, 1, 4, 7, 9, 2, 8], 3],
        expected: 0,
        description: "Find first element (best case)",
      },
      {
        input: [[3, 1, 4, 7, 9, 2, 8], 8],
        expected: 6,
        description: "Find last element (worst case)",
      },
      {
        input: [[3, 1, 4, 7, 9, 2, 8], 99],
        expected: -1,
        description: "Element not found",
      },
      {
        input: [[5], 5],
        expected: 0,
        description: "Single element array - found",
      },
      {
        input: [[5], 10],
        expected: -1,
        description: "Single element array - not found",
      },
      {
        input: [[], 5],
        expected: -1,
        description: "Empty array",
      },
      {
        input: [[1, 1, 1, 2, 1], 1],
        expected: 0,
        description: "Duplicate elements - returns first occurrence",
      },
    ],
    diamondReward: 35,
    experienceReward: 70,
    isPublished: true,
    tags: [
      "Algorithm Viz",
      "Search",
      "Linear",
      "Sequential",
      "O(n)",
      "Beginner",
    ],
    learningObjectives: [
      "Understand sequential search methodology",
      "Visualize element-by-element comparison process",
      "Learn best, average, and worst case scenarios",
      "Recognize when linear search is appropriate",
      "Master the concept of early termination",
      "Practice tracking algorithm performance metrics",
    ],
  },

  // 2) BINARY SEARCH - Logarithmic Search on Sorted Data
  {
    id: "binary-search-detailed-viz",
    title: "Binary Search: Divide and Conquer Search",
    slug: "binary-search-step-by-step",
    description:
      "Master binary search through detailed visualization - see how halving the search space achieves O(log n) efficiency on sorted arrays.",
    content: {
      algorithm: "Binary Search",
      description:
        "Watch how binary search algorithm works step by step with interactive visualization",
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1)",
      explanation:
        "Binary Search works on sorted arrays by repeatedly dividing the search interval in half, eliminating half of the remaining possibilities with each comparison.",
      steps: [
        {
          id: 1,
          description: "Initialize binary search on sorted array",
          data: [1, 2, 3, 4, 7, 8, 9, 11, 14],
          highlights: [],
          comparison: [],
          action: "Array length: 9, target: 7, requires sorted data ✅",
        },
        {
          id: 2,
          description: "Set initial search boundaries",
          data: [1, 2, 3, 4, 7, 8, 9, 11, 14],
          highlights: [0, 8],
          comparison: [],
          action: "left = 0, right = 8 (search space: 9 elements)",
        },
        {
          id: 3,
          description: "Iteration 1: Calculate middle index",
          data: [1, 2, 3, 4, 7, 8, 9, 11, 14],
          highlights: [0, 4, 8],
          comparison: [],
          action: "mid = (left + right) / 2 = (0 + 8) / 2 = 4",
        },
        {
          id: 4,
          description: "Access middle element at index 4",
          data: [1, 2, 3, 4, 7, 8, 9, 11, 14],
          highlights: [4],
          comparison: [],
          action: "arr[4] = 7, ready to compare with target",
        },
        {
          id: 5,
          description: "Compare middle element with target",
          data: [1, 2, 3, 4, 7, 8, 9, 11, 14],
          highlights: [4],
          comparison: [4],
          action: "arr[4] = 7, target = 7 → EXACT MATCH! ✅",
        },
        {
          id: 6,
          description: "TARGET FOUND! Binary search successful",
          data: [1, 2, 3, 4, 7, 8, 9, 11, 14],
          highlights: [4],
          comparison: [],
          action: "Found target 7 at index 4 in just 1 iteration",
        },
        {
          id: 7,
          description: "Performance analysis: Optimal case",
          data: [1, 2, 3, 4, 7, 8, 9, 11, 14],
          highlights: [4],
          comparison: [],
          action: "Lucky! Target was exactly in the middle position",
        },
        {
          id: 8,
          description: "Alternative scenario: If target was 11",
          data: [1, 2, 3, 4, 7, 8, 9, 11, 14],
          highlights: [4, 7],
          comparison: [],
          action: "7 < 11, would search right half [8,9,11,14]",
        },
        {
          id: 9,
          description: "Alternative scenario: Right half search",
          data: [1, 2, 3, 4, 7, 8, 9, 11, 14],
          highlights: [5, 6, 7, 8],
          comparison: [],
          action: "New boundaries: left=5, right=8 (4 elements)",
        },
        {
          id: 10,
          description: "Alternative scenario: New middle calculation",
          data: [1, 2, 3, 4, 7, 8, 9, 11, 14],
          highlights: [6],
          comparison: [],
          action: "mid = (5 + 8) / 2 = 6, arr[6] = 9",
        },
        {
          id: 11,
          description: "Alternative scenario: Compare 9 vs 11",
          data: [1, 2, 3, 4, 7, 8, 9, 11, 14],
          highlights: [6, 7],
          comparison: [6, 7],
          action: "9 < 11, search right: left=7, right=8",
        },
        {
          id: 12,
          description: "Alternative scenario: Final iteration",
          data: [1, 2, 3, 4, 7, 8, 9, 11, 14],
          highlights: [7],
          comparison: [],
          action: "mid = (7 + 8) / 2 = 7, arr[7] = 11 ✅",
        },
        {
          id: 13,
          description: "Alternative scenario: If target was 1",
          data: [1, 2, 3, 4, 7, 8, 9, 11, 14],
          highlights: [0, 4],
          comparison: [],
          action: "7 > 1, would search left half [1,2,3,4]",
        },
        {
          id: 14,
          description: "Alternative scenario: Left half search",
          data: [1, 2, 3, 4, 7, 8, 9, 11, 14],
          highlights: [0, 1, 2, 3],
          comparison: [],
          action: "New boundaries: left=0, right=3 (4 elements)",
        },
        {
          id: 15,
          description: "Alternative scenario: Target not found case",
          data: [1, 2, 3, 4, 7, 8, 9, 11, 14],
          highlights: [],
          comparison: [],
          action: "If target=5: would end with left > right, return -1",
        },
        {
          id: 16,
          description: "Search space elimination visualization",
          data: [1, 2, 3, 4, 7, 8, 9, 11, 14],
          highlights: [4],
          comparison: [],
          action: "Each iteration eliminates half: 9 → 4 → 2 → 1",
        },
        {
          id: 17,
          description: "Logarithmic efficiency demonstration",
          data: [1, 2, 3, 4, 7, 8, 9, 11, 14],
          highlights: [4],
          comparison: [],
          action: "Max iterations for n=9: log₂(9) ≈ 3.17 → 4 max",
        },
        {
          id: 18,
          description: "Binary search vs Linear search comparison",
          data: [1, 2, 3, 4, 7, 8, 9, 11, 14],
          highlights: [4],
          comparison: [],
          action: "Binary: 1 comparison vs Linear: up to 5 comparisons",
        },
        {
          id: 19,
          description: "Why sorted data is required",
          data: [1, 2, 3, 4, 7, 8, 9, 11, 14],
          highlights: [0, 4, 8],
          comparison: [],
          action: "Ordering allows elimination by comparison direction",
        },
        {
          id: 20,
          description: "Binary search algorithm complete!",
          data: [1, 2, 3, 4, 7, 8, 9, 11, 14],
          highlights: [4],
          comparison: [],
          action: "O(log n) time, O(1) space, requires sorted input ✅",
        },
      ],
    },
    difficulty: 2,
    order: 2,
    duration: 20,
    category: "Algorithms",
    hasCodeExercise: true,
    starterCode: `# Implement Binary Search with Detailed Visualization
def binary_search_visualized(arr, target):
    """
    Binary search with step-by-step tracking for visualization
    Returns: (index_found, steps_taken, total_comparisons)
    """
    steps = []
    comparisons = 0
    left = 0
    right = len(arr) - 1
    
    # TODO: Implement the binary search algorithm
    # While left <= right:
    #   - Calculate middle index: mid = (left + right) // 2
    #   - Increment comparisons counter
    #   - Compare arr[mid] with target
    #   - Record this step for visualization including:
    #     * Current search range [left, right]
    #     * Middle index and value
    #     * Comparison result
    #     * Next action (found/search left/search right)
    #   
    #   If arr[mid] == target:
    #     - Record success and return mid
    #   Elif arr[mid] < target:
    #     - Search right half: left = mid + 1
    #   Else:
    #     - Search left half: right = mid - 1
    #
    # If loop ends without finding target:
    #   - Record failure and return -1
    
    # Hint: Record each step as:
    # steps.append({
    #     'iteration': iteration_number,
    #     'left': left,
    #     'right': right,
    #     'mid': mid,
    #     'mid_value': arr[mid],
    #     'target': target,
    #     'comparison': f"{arr[mid]} vs {target}",
    #     'action': "found/search_left/search_right",
    #     'search_space_size': right - left + 1,
    #     'description': "Clear description of what happened"
    # })
    
    return -1, steps, comparisons  # Placeholder return

# Test your implementation
test_array = [1, 2, 3, 4, 7, 8, 9, 11, 14]  # Must be sorted!
target_value = 7

print(f"Binary searching for {target_value} in sorted array: {test_array}")
index, steps, comps = binary_search_visualized(test_array, target_value)

if index != -1:
    print(f"✅ Found {target_value} at index {index}")
else:
    print(f"❌ {target_value} not found in array")

print(f"Total comparisons: {comps}")
print(f"Total steps tracked: {len(steps)}")

# Print each step for verification
print("\\nStep-by-step breakdown:")
for i, step in enumerate(steps):
    print(f"Step {i+1}: {step}")

# Compare with linear search
print("\\n" + "="*60)
print("BINARY SEARCH vs LINEAR SEARCH COMPARISON")

def linear_search_comparison(arr, target):
    """Simple linear search for comparison"""
    for i, val in enumerate(arr):
        if val == target:
            return i, i + 1  # index, comparisons
    return -1, len(arr)

linear_idx, linear_comps = linear_search_comparison(test_array, target_value)
print(f"Linear Search: {linear_comps} comparisons")
print(f"Binary Search: {comps} comparisons")
print(f"Efficiency gain: {linear_comps/comps:.1f}x faster!")`,
    solutionCode: `def binary_search_visualized(arr, target):
    """
    Binary search with step-by-step tracking for visualization
    Returns: (index_found, steps_taken, total_comparisons)
    """
    steps = []
    comparisons = 0
    left = 0
    right = len(arr) - 1
    iteration = 0
    
    # Handle empty array edge case
    if not arr:
        steps.append({
            'iteration': 0,
            'left': None,
            'right': None,
            'mid': None,
            'mid_value': None,
            'target': target,
            'comparison': None,
            'action': 'empty_array',
            'search_space_size': 0,
            'description': f"Array is empty - cannot find {target}"
        })
        return -1, steps, comparisons
    
    # Initial state
    steps.append({
        'iteration': 0,
        'left': left,
        'right': right,
        'mid': None,
        'mid_value': None,
        'target': target,
        'comparison': None,
        'action': 'initialize',
        'search_space_size': right - left + 1,
        'description': f"Initialize: searching for {target} in range [{left}, {right}] (size: {right-left+1})"
    })
    
    # Binary search loop
    while left <= right:
        iteration += 1
        mid = (left + right) // 2
        comparisons += 1
        mid_value = arr[mid]
        
        # Record current step
        step_info = {
            'iteration': iteration,
            'left': left,
            'right': right,
            'mid': mid,
            'mid_value': mid_value,
            'target': target,
            'comparison': f"{mid_value} vs {target}",
            'search_space_size': right - left + 1,
            'description': f"Iteration {iteration}: left={left}, right={right}, mid={mid}, arr[{mid}]={mid_value}"
        }
        
        if mid_value == target:
            # Found the target!
            step_info['action'] = 'found'
            step_info['description'] += f" → MATCH! Found {target} at index {mid}"
            steps.append(step_info)
            
            # Add summary step
            steps.append({
                'iteration': iteration,
                'left': left,
                'right': right,
                'mid': mid,
                'mid_value': mid_value,
                'target': target,
                'comparison': None,
                'action': 'success',
                'search_space_size': 1,
                'description': f"✅ Search successful! Found {target} at index {mid} in {iteration} iterations ({comparisons} comparisons)"
            })
            
            return mid, steps, comparisons
            
        elif mid_value < target:
            # Target is in right half
            step_info['action'] = 'search_right'
            step_info['description'] += f" → {mid_value} < {target}, search RIGHT half"
            steps.append(step_info)
            left = mid + 1
            
        else:
            # Target is in left half
            step_info['action'] = 'search_left'
            step_info['description'] += f" → {mid_value} > {target}, search LEFT half"
            steps.append(step_info)
            right = mid - 1
        
        # Add range update step
        if left <= right:
            steps.append({
                'iteration': iteration,
                'left': left,
                'right': right,
                'mid': None,
                'mid_value': None,
                'target': target,
                'comparison': None,
                'action': 'update_range',
                'search_space_size': right - left + 1,
                'description': f"Updated search range: [{left}, {right}] (size: {right-left+1})"
            })
    
    # Target not found
    steps.append({
        'iteration': iteration,
        'left': left,
        'right': right,
        'mid': None,
        'mid_value': None,
        'target': target,
        'comparison': None,
        'action': 'not_found',
        'search_space_size': 0,
        'description': f"❌ Search failed! {target} not found. Search space exhausted after {iteration} iterations ({comparisons} comparisons)"
    })
    
    return -1, steps, comparisons

# Enhanced visualization function
def visualize_binary_search(arr, target):
    """Enhanced visualization with search space tracking"""
    print(f"🔍 BINARY SEARCH VISUALIZATION")
    print(f"Sorted Array: {arr}")
    print(f"Target: {target}")
    print(f"Array length: {len(arr)}")
    print("=" * 80)
    
    index, steps, comparisons = binary_search_visualized(arr, target)
    
    # Show each step with visual representation
    for step in steps:
        if step['action'] in ['initialize', 'update_range']:
            print(f"  📍 {step['description']}")
        elif step['iteration'] and step['mid'] is not None:
            # Create visual representation of current search space
            visual = ['.' for _ in range(len(arr))]
            if step['left'] is not None and step['right'] is not None:
                # Mark search space
                for i in range(step['left'], step['right'] + 1):
                    visual[i] = '?'
                # Mark middle element
                visual[step['mid']] = 'M'
            
            visual_str = ''.join(visual)
            action_symbol = "✅" if step['action'] == 'found' else ("⬅️" if step['action'] == 'search_left' else "➡️")
            
            print(f"  Step {step['iteration']}: [{step['left']},{step['right']}] mid={step['mid']} → {step['mid_value']} {action_symbol}")
            print(f"    Array: {visual_str}")
            print(f"    {step['description']}")
        else:
            print(f"  🎯 {step['description']}")
    
    print("\\n" + "=" * 80)
    print(f"🎯 RESULTS:")
    if index != -1:
        print(f"✅ SUCCESS: Found {target} at index {index}")
    else:
        print(f"❌ FAILURE: {target} not found in array")
    
    print(f"Total iterations: {max([s.get('iteration', 0) for s in steps])}")
    print(f"Total comparisons: {comparisons}")
    
    # Complexity analysis
    n = len(arr)
    if n > 0:
        max_possible_iterations = int(math.ceil(math.log2(n)))
        print(f"\\n📊 COMPLEXITY ANALYSIS:")
        print(f"Array size (n): {n}")
        print(f"Maximum possible iterations: {max_possible_iterations} (log₂({n}))")
        print(f"Actual iterations: {max([s.get('iteration', 0) for s in steps])}")
        print(f"Theoretical worst case: {max_possible_iterations} comparisons")
        print(f"Linear search would need: up to {n} comparisons")
        
        if n >= 2:
            efficiency = n / comparisons if comparisons > 0 else float('inf')
            print(f"🚀 Binary search is {efficiency:.1f}x more efficient than linear search!")
    
    return index, steps, comparisons

import math  # For logarithm calculations`,
    testCases: [
      {
        input: [[1, 2, 3, 4, 7, 8, 9, 11, 14], 7],
        expected: 4,
        description: "Find element in sorted array",
      },
      {
        input: [[1, 2, 3, 4, 7, 8, 9, 11, 14], 1],
        expected: 0,
        description: "Find first element",
      },
      {
        input: [[1, 2, 3, 4, 7, 8, 9, 11, 14], 14],
        expected: 8,
        description: "Find last element",
      },
      {
        input: [[1, 2, 3, 4, 7, 8, 9, 11, 14], 5],
        expected: -1,
        description: "Element not found",
      },
      {
        input: [[1, 2, 3, 4, 7, 8, 9, 11, 14], 15],
        expected: -1,
        description: "Target larger than all elements",
      },
      {
        input: [[1, 2, 3, 4, 7, 8, 9, 11, 14], 0],
        expected: -1,
        description: "Target smaller than all elements",
      },
      {
        input: [[5], 5],
        expected: 0,
        description: "Single element array - found",
      },
      {
        input: [[5], 10],
        expected: -1,
        description: "Single element array - not found",
      },
      {
        input: [[], 5],
        expected: -1,
        description: "Empty array",
      },
    ],
    diamondReward: 55,
    experienceReward: 110,
    isPublished: true,
    tags: [
      "Algorithm Viz",
      "Search",
      "Binary",
      "Divide-and-Conquer",
      "O(log n)",
      "Sorted",
    ],
    learningObjectives: [
      "Understand divide-and-conquer search strategy",
      "Visualize how search space halves each iteration",
      "Master logarithmic time complexity concepts",
      "Learn proper boundary management in binary search",
      "Recognize the importance of sorted data prerequisite",
      "Compare binary search efficiency vs linear search",
    ],
  },

  // 3) DEPTH-FIRST SEARCH (DFS) - Graph traversal algorithm
  {
    id: "dfs-detailed-viz",
    title: "Depth-First Search: Exploring Graph Depths",
    slug: "dfs-step-by-step",
    description:
      "Master depth-first search through detailed visualization - see how DFS explores as far as possible along each branch before backtracking.",
    content: {
      algorithm: "Depth-First Search (DFS)",
      description:
        "Watch how DFS traverses graphs by exploring depth-first paths",
      timeComplexity: "O(V + E) where V = vertices, E = edges",
      spaceComplexity: "O(V) for recursion stack",
      explanation:
        "DFS explores a graph by going as deep as possible down each path before backtracking. It uses a stack (recursion or explicit) to remember nodes to return to.",
      steps: [
        {
          id: 1,
          description: "Initialize graph with vertices and edges",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [],
          comparison: [],
          action: "Graph: 0-1-2, 0-3, 1-4, 2-5 (adjacency connections)",
        },
        {
          id: 2,
          description: "Choose starting vertex (0)",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [0],
          comparison: [],
          action: "Starting DFS from vertex 0, mark as visited",
        },
        {
          id: 3,
          description: "Visit neighbors of 0: [1, 3]",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [0],
          comparison: [1, 3],
          action: "Check adjacency list of 0: neighbors are 1 and 3",
        },
        {
          id: 4,
          description: "Choose first neighbor: visit vertex 1",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [0, 1],
          comparison: [],
          action: "Go deep: 0 → 1, mark vertex 1 as visited",
        },
        {
          id: 5,
          description: "Visit neighbors of 1: [0, 2, 4]",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [1],
          comparison: [0, 2, 4],
          action: "Check neighbors of 1: 0 (visited), 2, 4 (unvisited)",
        },
        {
          id: 6,
          description: "Choose first unvisited neighbor: visit vertex 2",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [0, 1, 2],
          comparison: [],
          action: "Go deeper: 0 → 1 → 2, mark vertex 2 as visited",
        },
        {
          id: 7,
          description: "Visit neighbors of 2: [1, 5]",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [2],
          comparison: [1, 5],
          action: "Check neighbors of 2: 1 (visited), 5 (unvisited)",
        },
        {
          id: 8,
          description: "Visit vertex 5 (neighbor of 2)",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [0, 1, 2, 5],
          comparison: [],
          action: "Go deeper: 0 → 1 → 2 → 5, mark vertex 5 as visited",
        },
        {
          id: 9,
          description: "Check neighbors of 5: [2]",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [5],
          comparison: [2],
          action: "Vertex 5 neighbors: 2 (already visited), dead end reached",
        },
        {
          id: 10,
          description: "Backtrack from 5 to 2",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [2],
          comparison: [],
          action: "No unvisited neighbors from 5, backtrack to vertex 2",
        },
        {
          id: 11,
          description: "Backtrack from 2 to 1",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [1],
          comparison: [],
          action: "All neighbors of 2 explored, backtrack to vertex 1",
        },
        {
          id: 12,
          description: "Continue from 1: visit vertex 4",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [0, 1, 2, 4, 5],
          comparison: [],
          action: "From 1, visit unvisited neighbor 4: 0 → 1 → 4",
        },
        {
          id: 13,
          description: "Check neighbors of 4: [1]",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [4],
          comparison: [1],
          action: "Vertex 4 neighbors: 1 (visited), dead end reached",
        },
        {
          id: 14,
          description: "Backtrack from 4 to 1",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [1],
          comparison: [],
          action: "No unvisited neighbors from 4, backtrack to vertex 1",
        },
        {
          id: 15,
          description: "Backtrack from 1 to 0",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [0],
          comparison: [],
          action: "All neighbors of 1 explored, backtrack to vertex 0",
        },
        {
          id: 16,
          description: "Continue from 0: visit vertex 3",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [0, 1, 2, 3, 4, 5],
          comparison: [],
          action: "From 0, visit unvisited neighbor 3: 0 → 3",
        },
        {
          id: 17,
          description: "Check neighbors of 3: [0]",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [3],
          comparison: [0],
          action: "Vertex 3 neighbors: 0 (visited), dead end reached",
        },
        {
          id: 18,
          description: "Backtrack from 3 to 0",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [0],
          comparison: [],
          action: "No unvisited neighbors from 3, backtrack to vertex 0",
        },
        {
          id: 19,
          description: "DFS traversal complete",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [0, 1, 2, 3, 4, 5],
          comparison: [],
          action: "All vertices visited. DFS order: 0 → 1 → 2 → 5 → 4 → 3",
        },
        {
          id: 20,
          description: "DFS properties summary",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [],
          comparison: [],
          action:
            "DFS explores depth-first, uses stack, finds paths and cycles",
        },
      ],
    },
    difficulty: 3,
    order: 3,
    duration: 25,
    category: "Algorithms",
    hasCodeExercise: true,
    starterCode: `# Implement DFS with Detailed Visualization
class GraphDFS:
    def __init__(self, vertices):
        self.vertices = vertices
        self.adjacency_list = {i: [] for i in range(vertices)}
        self.visited = set()
        self.steps = []
    
    def add_edge(self, u, v):
        """Add undirected edge between vertices u and v"""
        # TODO: Add edge to adjacency list
        pass
    
    def dfs_with_steps(self, start_vertex):
        """Perform DFS traversal with step tracking"""
        self.visited.clear()
        self.steps.clear()
        
        # TODO: Record initial step
        
        # TODO: Call recursive DFS helper
        self._dfs_recursive(start_vertex)
        
        return self.steps
    
    def _dfs_recursive(self, vertex):
        """Recursive DFS implementation"""
        # TODO: Mark current vertex as visited
        # TODO: Record visit step
        
        # TODO: Explore all unvisited neighbors
        for neighbor in self.adjacency_list[vertex]:
            # TODO: Record neighbor checking step
            
            if neighbor not in self.visited:
                # TODO: Record recursive call step
                # TODO: Recursively visit neighbor
                pass
            else:
                # TODO: Record already visited step
                pass
        
        # TODO: Record backtrack step (if not at starting vertex)`,
    solutionCode: `class GraphDFS:
    def __init__(self, vertices):
        self.vertices = vertices
        self.adjacency_list = {i: [] for i in range(vertices)}
        self.visited = set()
        self.steps = []
    
    def add_edge(self, u, v):
        """Add undirected edge between vertices u and v"""
        self.adjacency_list[u].append(v)
        self.adjacency_list[v].append(u)
    
    def dfs_with_steps(self, start_vertex):
        """Perform DFS traversal with step tracking"""
        self.visited.clear()
        self.steps.clear()
        
        self.steps.append({
            'step': 0,
            'description': f'Starting DFS from vertex {start_vertex}',
            'current_vertex': start_vertex,
            'visited_set': set(),
            'action': 'initialize'
        })
        
        self._dfs_recursive(start_vertex)
        return self.steps
    
    def _dfs_recursive(self, vertex):
        """Recursive DFS implementation"""
        self.visited.add(vertex)
        
        self.steps.append({
            'step': len(self.steps),
            'description': f'Visit vertex {vertex}',
            'current_vertex': vertex,
            'visited_set': self.visited.copy(),
            'action': 'visit'
        })
        
        for neighbor in self.adjacency_list[vertex]:
            if neighbor not in self.visited:
                self.steps.append({
                    'step': len(self.steps),
                    'description': f'Explore unvisited neighbor {neighbor}',
                    'current_vertex': vertex,
                    'next_vertex': neighbor,
                    'action': 'recursive_call'
                })
                
                self._dfs_recursive(neighbor)`,
    testCases: [
      {
        input: [
          [
            "add_edges",
            [
              [0, 1],
              [1, 2],
              [0, 3],
              [1, 4],
              [2, 5],
            ],
          ],
          ["dfs", 0],
        ],
        expected: [0, 1, 2, 5, 4, 3],
        description: "DFS traversal order from vertex 0",
      },
    ],
    diamondReward: 60,
    experienceReward: 110,
    isPublished: true,
    tags: ["Graph", "DFS", "Traversal", "Recursion", "Stack", "O(V+E)"],
    learningObjectives: [
      "Understand depth-first exploration strategy",
      "Master recursive graph traversal",
      "Learn backtracking principles",
      "Practice with adjacency list representation",
      "Recognize DFS applications (pathfinding, cycle detection)",
      "Compare DFS vs BFS trade-offs",
    ],
  },

  // 4) BREADTH-FIRST SEARCH (BFS) - Level-by-level graph traversal
  {
    id: "bfs-detailed-viz",
    title: "Breadth-First Search: Level-by-Level Exploration",
    slug: "bfs-step-by-step",
    description:
      "Master breadth-first search through detailed visualization - see how BFS explores all vertices at the current depth before moving to vertices at the next depth.",
    content: {
      algorithm: "Breadth-First Search (BFS)",
      description:
        "Watch how BFS traverses graphs level by level using a queue",
      timeComplexity: "O(V + E) where V = vertices, E = edges",
      spaceComplexity: "O(V) for queue storage",
      explanation:
        "BFS explores a graph level by level, visiting all vertices at distance k before visiting vertices at distance k+1. It uses a queue to maintain vertices to visit.",
      steps: [
        {
          id: 1,
          description: "Initialize graph with vertices and edges",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [],
          comparison: [],
          action: "Graph: 0-1-2, 0-3, 1-4, 2-5 (same as DFS example)",
        },
        {
          id: 2,
          description: "Initialize BFS: queue and visited set",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [],
          comparison: [],
          action: "Queue: [], Visited: {}, starting from vertex 0",
        },
        {
          id: 3,
          description: "Add starting vertex 0 to queue",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [0],
          comparison: [],
          action: "Queue: [0], mark vertex 0 as visited",
        },
        {
          id: 4,
          description: "Dequeue vertex 0, process its neighbors",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [0],
          comparison: [1, 3],
          action: "Process 0: neighbors are [1, 3], add to queue",
        },
        {
          id: 5,
          description: "Add neighbors 1 and 3 to queue",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [0, 1, 3],
          comparison: [],
          action: "Queue: [1, 3], both neighbors marked as visited",
        },
        {
          id: 6,
          description: "Dequeue vertex 1, process its neighbors",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [1],
          comparison: [0, 2, 4],
          action: "Process 1: neighbors [0, 2, 4], 0 already visited",
        },
        {
          id: 7,
          description: "Add unvisited neighbors 2 and 4 to queue",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [0, 1, 2, 3, 4],
          comparison: [],
          action: "Queue: [3, 2, 4], mark 2 and 4 as visited",
        },
        {
          id: 8,
          description: "Dequeue vertex 3, process its neighbors",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [3],
          comparison: [0],
          action: "Process 3: neighbors [0], already visited",
        },
        {
          id: 9,
          description: "No new neighbors from 3, continue with queue",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [0, 1, 2, 3, 4],
          comparison: [],
          action: "Queue: [2, 4], vertex 3 processing complete",
        },
        {
          id: 10,
          description: "Dequeue vertex 2, process its neighbors",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [2],
          comparison: [1, 5],
          action: "Process 2: neighbors [1, 5], 1 already visited",
        },
        {
          id: 11,
          description: "Add unvisited neighbor 5 to queue",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [0, 1, 2, 3, 4, 5],
          comparison: [],
          action: "Queue: [4, 5], mark vertex 5 as visited",
        },
        {
          id: 12,
          description: "Dequeue vertex 4, process its neighbors",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [4],
          comparison: [1],
          action: "Process 4: neighbors [1], already visited",
        },
        {
          id: 13,
          description: "No new neighbors from 4, continue with queue",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [0, 1, 2, 3, 4, 5],
          comparison: [],
          action: "Queue: [5], vertex 4 processing complete",
        },
        {
          id: 14,
          description: "Dequeue vertex 5, process its neighbors",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [5],
          comparison: [2],
          action: "Process 5: neighbors [2], already visited",
        },
        {
          id: 15,
          description: "No new neighbors from 5",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [0, 1, 2, 3, 4, 5],
          comparison: [],
          action: "Queue: [], vertex 5 processing complete",
        },
        {
          id: 16,
          description: "Queue is empty, BFS complete",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [],
          comparison: [],
          action: "All vertices visited. BFS order: 0 → 1, 3 → 2, 4 → 5",
        },
        {
          id: 17,
          description: "BFS levels visualization",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [0],
          comparison: [1, 3],
          action: "Level 0: [0], Level 1: [1, 3], Level 2: [2, 4, 5]",
        },
        {
          id: 18,
          description: "BFS properties summary",
          data: [0, 1, 2, 3, 4, 5],
          highlights: [],
          comparison: [],
          action:
            "BFS finds shortest paths, explores level-by-level, uses queue",
        },
      ],
    },
    difficulty: 3,
    order: 4,
    duration: 25,
    category: "Algorithms",
    hasCodeExercise: true,
    starterCode: `# Implement BFS with Detailed Visualization
from collections import deque

class GraphBFS:
    def __init__(self, vertices):
        self.vertices = vertices
        self.adjacency_list = {i: [] for i in range(vertices)}
        self.steps = []
    
    def add_edge(self, u, v):
        """Add undirected edge between vertices u and v"""
        # TODO: Add edge to adjacency list
        pass
    
    def bfs_with_steps(self, start_vertex):
        """Perform BFS traversal with step tracking"""
        self.steps.clear()
        
        # TODO: Initialize visited set and queue
        visited = set()
        queue = deque()
        
        # TODO: Record initial step
        
        # TODO: Add starting vertex to queue and mark as visited
        
        # TODO: BFS main loop
        while queue:
            # TODO: Dequeue vertex
            current_vertex = queue.popleft()
            
            # TODO: Record processing step
            
            # TODO: Check all neighbors
            for neighbor in self.adjacency_list[current_vertex]:
                # TODO: Record neighbor checking step
                
                if neighbor not in visited:
                    # TODO: Mark neighbor as visited
                    # TODO: Add neighbor to queue
                    # TODO: Record addition step
                else:
                    # TODO: Record already visited step
                    pass
        
        return self.steps`,
    solutionCode: `from collections import deque

class GraphBFS:
    def __init__(self, vertices):
        self.vertices = vertices
        self.adjacency_list = {i: [] for i in range(vertices)}
        self.steps = []
    
    def add_edge(self, u, v):
        """Add undirected edge between vertices u and v"""
        self.adjacency_list[u].append(v)
        self.adjacency_list[v].append(u)
    
    def bfs_with_steps(self, start_vertex):
        """Perform BFS traversal with step tracking"""
        self.steps.clear()
        
        visited = set()
        queue = deque()
        
        visited.add(start_vertex)
        queue.append(start_vertex)
        
        self.steps.append({
            'step': 0,
            'description': f'Initialize BFS from vertex {start_vertex}',
            'current_vertex': start_vertex,
            'queue': list(queue),
            'visited_set': visited.copy(),
            'action': 'initialize'
        })
        
        while queue:
            current_vertex = queue.popleft()
            
            self.steps.append({
                'step': len(self.steps),
                'description': f'Process vertex {current_vertex}',
                'current_vertex': current_vertex,
                'queue': list(queue),
                'visited_set': visited.copy(),
                'action': 'process'
            })
            
            for neighbor in self.adjacency_list[current_vertex]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
                    
                    self.steps.append({
                        'step': len(self.steps),
                        'description': f'Add neighbor {neighbor} to queue',
                        'current_vertex': current_vertex,
                        'neighbor': neighbor,
                        'queue': list(queue),
                        'visited_set': visited.copy(),
                        'action': 'enqueue'
                    })
        
        return self.steps`,
    testCases: [
      {
        input: [
          [
            "add_edges",
            [
              [0, 1],
              [1, 2],
              [0, 3],
              [1, 4],
              [2, 5],
            ],
          ],
          ["bfs", 0],
        ],
        expected: [0, 1, 3, 2, 4, 5],
        description: "BFS traversal order from vertex 0 (level-by-level)",
      },
    ],
    diamondReward: 60,
    experienceReward: 110,
    isPublished: true,
    tags: ["Graph", "BFS", "Traversal", "Queue", "Shortest Path", "O(V+E)"],
    learningObjectives: [
      "Understand breadth-first exploration strategy",
      "Master queue-based graph traversal",
      "Learn level-by-level processing",
      "Practice shortest path finding in unweighted graphs",
      "Recognize BFS applications (shortest path, minimum spanning tree)",
      "Compare BFS vs DFS characteristics and use cases",
    ],
  },
];

export async function seedSearchAlgorithms() {
  console.log("🔄 Seeding Search Algorithm Challenges...");

  try {
    for (const challenge of searchAlgorithmChallenges) {
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
          source: "search_algorithm_seed",
          migrated_at: new Date().toISOString(),
        }),
      };

      await prisma.learningActivity.upsert({
        where: { id: challenge.id },
        update: learningActivityData,
        create: learningActivityData,
      });
      console.log(`✅ Created search algorithm challenge: ${challenge.title}`);
    }

    console.log("🎉 Search algorithm challenges seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding search algorithms:", error);
    throw error;
  }
}

// Main execution
async function main() {
  try {
    await seedSearchAlgorithms();
    console.log("✅ Search algorithm seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding search algorithms:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}
