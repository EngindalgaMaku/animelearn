import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Interactive Coding Activities for Python Fundamentals
 * 10 hands-on coding challenges with real code execution
 * Difficulty levels: 1-4 (Beginner to Advanced)
 */

export const interactiveCodingPythonFundamentalsActivities = [
  // DIFFICULTY 1 - BEGINNER (3 activities)

  // 1. Basic Calculator Functions
  {
    title: "Python Calculator Functions Challenge",
    description:
      "Create basic calculator functions and test them with real inputs",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 20,
    experienceReward: 45,
    estimatedMinutes: 20,
    tags: ["functions", "arithmetic", "calculator", "beginner"],
    content: {
      instructions:
        "Create calculator functions that perform basic arithmetic operations",
      problem:
        "Build a simple calculator with add, subtract, multiply, and divide functions",
      starterCode:
        '# Simple Calculator Functions\ndef add(a, b):\n    # Your code here\n    pass\n\ndef subtract(a, b):\n    # Your code here\n    pass\n\ndef multiply(a, b):\n    # Your code here\n    pass\n\ndef divide(a, b):\n    # Your code here\n    pass\n\n# Test your functions\nprint("Testing calculator functions:")\nprint(f"5 + 3 = {add(5, 3)}")\nprint(f"10 - 4 = {subtract(10, 4)}")\nprint(f"6 * 7 = {multiply(6, 7)}")\nprint(f"15 / 3 = {divide(15, 3)}")',
      solution:
        '# Simple Calculator Functions\ndef add(a, b):\n    return a + b\n\ndef subtract(a, b):\n    return a - b\n\ndef multiply(a, b):\n    return a * b\n\ndef divide(a, b):\n    if b != 0:\n        return a / b\n    else:\n        return "Error: Division by zero"\n\n# Test your functions\nprint("Testing calculator functions:")\nprint(f"5 + 3 = {add(5, 3)}")\nprint(f"10 - 4 = {subtract(10, 4)}")\nprint(f"6 * 7 = {multiply(6, 7)}")\nprint(f"15 / 3 = {divide(15, 3)}")',
      testCases: [
        { input: "add(5, 3)", expectedOutput: "8" },
        { input: "subtract(10, 4)", expectedOutput: "6" },
        { input: "multiply(6, 7)", expectedOutput: "42" },
        { input: "divide(15, 3)", expectedOutput: "5.0" },
        { input: "divide(10, 0)", expectedOutput: "Error: Division by zero" },
      ],
      language: "Python",
      hints: [
        "Use the basic arithmetic operators: +, -, *, /",
        "For division, check if the denominator is not zero",
        "Return the result of the calculation",
        "Handle division by zero gracefully",
      ],
    },
    settings: {
      timeLimit: 1200,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2. String Manipulation Tools
  {
    title: "Python String Processing Workshop",
    description:
      "Build a comprehensive string processing toolkit with various utilities",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 22,
    experienceReward: 50,
    estimatedMinutes: 22,
    tags: ["strings", "text-processing", "manipulation", "utilities"],
    content: {
      instructions:
        "Create string processing functions for common text operations",
      problem:
        "Build a string utility library with formatting, cleaning, and analysis functions",
      starterCode:
        '# String Processing Toolkit\ndef word_count(text):\n    """Count the number of words in a text"""\n    # Your code here\n    pass\n\ndef reverse_words(text):\n    """Reverse the order of words in a sentence"""\n    # Your code here\n    pass\n\ndef clean_text(text):\n    """Remove extra whitespace and convert to title case"""\n    # Your code here\n    pass\n\ndef is_palindrome(text):\n    """Check if text reads the same forwards and backwards (ignore spaces and case)"""\n    # Your code here\n    pass\n\n# Test your functions\nsample_text = "  hello world python programming  "\nprint(f"Original: \'{sample_text}\'")\nprint(f"Word count: {word_count(sample_text)}")\nprint(f"Reversed words: \'{reverse_words(sample_text)}\'")\nprint(f"Cleaned text: \'{clean_text(sample_text)}\'")\nprint(f"Is \'A man a plan a canal Panama\' a palindrome? {is_palindrome(\'A man a plan a canal Panama\')}")',
      solution:
        '# String Processing Toolkit\ndef word_count(text):\n    """Count the number of words in a text"""\n    return len(text.strip().split())\n\ndef reverse_words(text):\n    """Reverse the order of words in a sentence"""\n    words = text.strip().split()\n    return \' \'.join(reversed(words))\n\ndef clean_text(text):\n    """Remove extra whitespace and convert to title case"""\n    return text.strip().title()\n\ndef is_palindrome(text):\n    """Check if text reads the same forwards and backwards (ignore spaces and case)"""\n    cleaned = \'\'.join(text.lower().split())\n    return cleaned == cleaned[::-1]\n\n# Test your functions\nsample_text = "  hello world python programming  "\nprint(f"Original: \'{sample_text}\'")\nprint(f"Word count: {word_count(sample_text)}")\nprint(f"Reversed words: \'{reverse_words(sample_text)}\'")\nprint(f"Cleaned text: \'{clean_text(sample_text)}\'")\nprint(f"Is \'A man a plan a canal Panama\' a palindrome? {is_palindrome(\'A man a plan a canal Panama\')}")',
      testCases: [
        { input: "word_count('hello world python')", expectedOutput: "3" },
        {
          input: "reverse_words('hello world python')",
          expectedOutput: "python world hello",
        },
        {
          input: "clean_text('  hello world  ')",
          expectedOutput: "Hello World",
        },
        { input: "is_palindrome('racecar')", expectedOutput: "True" },
        { input: "is_palindrome('hello')", expectedOutput: "False" },
      ],
      language: "Python",
      hints: [
        "Use strip() to remove extra whitespace",
        "Use split() to break text into words",
        "Use join() to combine words back together",
        "For palindrome, remove spaces and compare with reversed string",
      ],
    },
    settings: {
      timeLimit: 1320,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3. List Operations and Analysis
  {
    title: "Python List Analysis and Processing",
    description: "Create functions to analyze and process lists of data",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 25,
    experienceReward: 55,
    estimatedMinutes: 25,
    tags: ["lists", "data-analysis", "statistics", "processing"],
    content: {
      instructions:
        "Build list processing functions for data analysis and manipulation",
      problem:
        "Create a library of functions to analyze and process numerical data in lists",
      starterCode:
        '# List Analysis and Processing\ndef find_statistics(numbers):\n    """Return min, max, and average of a list of numbers"""\n    # Your code here\n    pass\n\ndef filter_even_numbers(numbers):\n    """Return a new list containing only even numbers"""\n    # Your code here\n    pass\n\ndef remove_duplicates(items):\n    """Remove duplicate items while preserving order"""\n    # Your code here\n    pass\n\ndef find_common_elements(list1, list2):\n    """Find elements that exist in both lists"""\n    # Your code here\n    pass\n\n# Test your functions\ndata = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 2, 4, 6]\nprint(f"Original data: {data}")\nprint(f"Statistics: {find_statistics(data)}")\nprint(f"Even numbers: {filter_even_numbers(data)}")\nprint(f"Without duplicates: {remove_duplicates(data)}")\nprint(f"Common elements in [1,2,3,4] and [3,4,5,6]: {find_common_elements([1,2,3,4], [3,4,5,6])}")',
      solution:
        '# List Analysis and Processing\ndef find_statistics(numbers):\n    """Return min, max, and average of a list of numbers"""\n    if not numbers:\n        return None\n    return {\n        \'min\': min(numbers),\n        \'max\': max(numbers),\n        \'average\': sum(numbers) / len(numbers)\n    }\n\ndef filter_even_numbers(numbers):\n    """Return a new list containing only even numbers"""\n    return [num for num in numbers if num % 2 == 0]\n\ndef remove_duplicates(items):\n    """Remove duplicate items while preserving order"""\n    seen = set()\n    result = []\n    for item in items:\n        if item not in seen:\n            seen.add(item)\n            result.append(item)\n    return result\n\ndef find_common_elements(list1, list2):\n    """Find elements that exist in both lists"""\n    return list(set(list1) & set(list2))\n\n# Test your functions\ndata = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 2, 4, 6]\nprint(f"Original data: {data}")\nprint(f"Statistics: {find_statistics(data)}")\nprint(f"Even numbers: {filter_even_numbers(data)}")\nprint(f"Without duplicates: {remove_duplicates(data)}")\nprint(f"Common elements in [1,2,3,4] and [3,4,5,6]: {find_common_elements([1,2,3,4], [3,4,5,6])}")',
      testCases: [
        {
          input: "find_statistics([1, 2, 3, 4, 5])['average']",
          expectedOutput: "3.0",
        },
        {
          input: "filter_even_numbers([1, 2, 3, 4, 5, 6])",
          expectedOutput: "[2, 4, 6]",
        },
        {
          input: "remove_duplicates([1, 2, 2, 3, 3, 4])",
          expectedOutput: "[1, 2, 3, 4]",
        },
        {
          input: "find_common_elements([1, 2, 3], [2, 3, 4])",
          expectedOutput: "[2, 3]",
        },
      ],
      language: "Python",
      hints: [
        "Use min(), max(), and sum() for statistics",
        "Use list comprehension for filtering",
        "Use a set to track seen items for deduplication",
        "Use set intersection for finding common elements",
      ],
    },
    settings: {
      timeLimit: 1500,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 3,
  },

  // DIFFICULTY 2 - BASIC (3 activities)

  // 4. Dictionary Data Manager
  {
    title: "Python Dictionary Data Management System",
    description: "Build a complete data management system using dictionaries",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 28,
    experienceReward: 60,
    estimatedMinutes: 28,
    tags: [
      "dictionaries",
      "data-management",
      "crud-operations",
      "data-structures",
    ],
    content: {
      instructions:
        "Create a student management system using dictionaries and functions",
      problem: "Build a comprehensive student database with CRUD operations",
      starterCode:
        '# Student Management System\nstudents_db = {}\n\ndef add_student(student_id, name, age, grades):\n    """Add a new student to the database"""\n    # Your code here\n    pass\n\ndef get_student(student_id):\n    """Retrieve student information by ID"""\n    # Your code here\n    pass\n\ndef update_grades(student_id, new_grades):\n    """Update a student\'s grades"""\n    # Your code here\n    pass\n\ndef calculate_gpa(grades):\n    """Calculate GPA from a list of grades (0-100 scale to 4.0 scale)"""\n    # Your code here\n    pass\n\ndef get_top_students(n=3):\n    """Get top N students by GPA"""\n    # Your code here\n    pass\n\n# Test the system\nadd_student("S001", "Alice Johnson", 20, [85, 92, 78, 90])\nadd_student("S002", "Bob Smith", 19, [92, 88, 94, 89])\nadd_student("S003", "Charlie Brown", 21, [78, 82, 85, 80])\n\nprint("Student Database:")\nfor sid in students_db:\n    student = get_student(sid)\n    if student:\n        gpa = calculate_gpa(student[\'grades\'])\n        print(f"{student[\'name\']}: GPA {gpa:.2f}")\n\nprint(f"\\nTop 2 students: {get_top_students(2)}")',
      solution:
        '# Student Management System\nstudents_db = {}\n\ndef add_student(student_id, name, age, grades):\n    """Add a new student to the database"""\n    students_db[student_id] = {\n        \'name\': name,\n        \'age\': age,\n        \'grades\': grades\n    }\n    return True\n\ndef get_student(student_id):\n    """Retrieve student information by ID"""\n    return students_db.get(student_id)\n\ndef update_grades(student_id, new_grades):\n    """Update a student\'s grades"""\n    if student_id in students_db:\n        students_db[student_id][\'grades\'] = new_grades\n        return True\n    return False\n\ndef calculate_gpa(grades):\n    """Calculate GPA from a list of grades (0-100 scale to 4.0 scale)"""\n    if not grades:\n        return 0.0\n    avg = sum(grades) / len(grades)\n    if avg >= 90: return 4.0\n    elif avg >= 80: return 3.0\n    elif avg >= 70: return 2.0\n    elif avg >= 60: return 1.0\n    else: return 0.0\n\ndef get_top_students(n=3):\n    """Get top N students by GPA"""\n    student_gpas = []\n    for sid, student in students_db.items():\n        gpa = calculate_gpa(student[\'grades\'])\n        student_gpas.append((student[\'name\'], gpa))\n    \n    student_gpas.sort(key=lambda x: x[1], reverse=True)\n    return student_gpas[:n]\n\n# Test the system\nadd_student("S001", "Alice Johnson", 20, [85, 92, 78, 90])\nadd_student("S002", "Bob Smith", 19, [92, 88, 94, 89])\nadd_student("S003", "Charlie Brown", 21, [78, 82, 85, 80])\n\nprint("Student Database:")\nfor sid in students_db:\n    student = get_student(sid)\n    if student:\n        gpa = calculate_gpa(student[\'grades\'])\n        print(f"{student[\'name\']}: GPA {gpa:.2f}")\n\nprint(f"\\nTop 2 students: {get_top_students(2)}")',
      testCases: [
        {
          input: "add_student('S999', 'Test Student', 20, [95, 95, 95, 95])",
          expectedOutput: "True",
        },
        {
          input: "get_student('S999')['name']",
          expectedOutput: "Test Student",
        },
        { input: "calculate_gpa([90, 95, 92, 88])", expectedOutput: "4.0" },
        { input: "calculate_gpa([75, 78, 82, 79])", expectedOutput: "2.0" },
      ],
      language: "Python",
      hints: [
        "Store student data as nested dictionaries",
        "Use dictionary methods like get() for safe access",
        "Calculate average grade first, then convert to GPA scale",
        "Use sorting with lambda functions for top students",
      ],
    },
    settings: {
      timeLimit: 1680,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 4,
  },

  // 5. Text Analysis System
  {
    title: "Python Text Analysis and Processing System",
    description:
      "Build a comprehensive text analysis system with multiple features",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 30,
    tags: ["text-analysis", "algorithms", "data-processing", "regex"],
    content: {
      instructions: "Create a comprehensive text analysis system",
      problem:
        "Build functions to analyze text files and extract meaningful information",
      starterCode:
        '# Text Analysis System\nimport re\n\ndef analyze_text(content):\n    """Analyze text content and return statistics"""\n    # Your code here\n    pass\n\ndef find_longest_word(content):\n    """Find the longest word in the text"""\n    # Your code here\n    pass\n\ndef word_frequency(content):\n    """Count frequency of each word (case-insensitive)"""\n    # Your code here\n    pass\n\ndef extract_email_patterns(content):\n    """Extract patterns that look like email addresses"""\n    # Your code here\n    pass\n\ndef format_report(content):\n    """Generate a comprehensive analysis report"""\n    # Your code here\n    pass\n\n# Sample text for testing\nsample_text = """\nPython Programming Language\nPython is a high-level programming language. It was created by Guido van Rossum.\nPython is known for its simplicity and readability. Many developers love Python\nbecause it allows them to write programs quickly and efficiently.\nContact: python@example.com or info@python.org for more information.\n"""\n\nprint("Text Analysis Report:")\nprint("=" * 50)\nreport = format_report(sample_text)\nprint(report)',
      solution:
        '# Text Analysis System\nimport re\n\ndef analyze_text(content):\n    """Analyze text content and return statistics"""\n    lines = content.strip().split(\'\\n\')\n    words = content.split()\n    characters = len(content)\n    characters_no_spaces = len(content.replace(\' \', \'\'))\n    \n    return {\n        \'lines\': len([line for line in lines if line.strip()]),\n        \'words\': len(words),\n        \'characters\': characters,\n        \'characters_no_spaces\': characters_no_spaces\n    }\n\ndef find_longest_word(content):\n    """Find the longest word in the text"""\n    words = re.findall(r\'\\b\\w+\\b\', content.lower())\n    if not words:\n        return None\n    return max(words, key=len)\n\ndef word_frequency(content):\n    """Count frequency of each word (case-insensitive)"""\n    words = re.findall(r\'\\b\\w+\\b\', content.lower())\n    frequency = {}\n    for word in words:\n        frequency[word] = frequency.get(word, 0) + 1\n    return frequency\n\ndef extract_email_patterns(content):\n    """Extract patterns that look like email addresses"""\n    pattern = r\'\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b\'\n    return re.findall(pattern, content)\n\ndef format_report(content):\n    """Generate a comprehensive analysis report"""\n    stats = analyze_text(content)\n    longest = find_longest_word(content)\n    freq = word_frequency(content)\n    emails = extract_email_patterns(content)\n    \n    # Get top 5 most common words\n    top_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)[:5]\n    \n    report = f"""\nBasic Statistics:\n- Lines: {stats[\'lines\']}\n- Words: {stats[\'words\']}\n- Characters: {stats[\'characters\']}\n- Characters (no spaces): {stats[\'characters_no_spaces\']}\n\nLongest word: {longest}\n\nTop 5 most common words:\n{chr(10).join([f"- {word}: {count}" for word, count in top_words])}\n\nEmail addresses found: {len(emails)}\n{chr(10).join([f"- {email}" for email in emails])}\n"""\n    return report\n\n# Sample text for testing\nsample_text = """\nPython Programming Language\nPython is a high-level programming language. It was created by Guido van Rossum.\nPython is known for its simplicity and readability. Many developers love Python\nbecause it allows them to write programs quickly and efficiently.\nContact: python@example.com or info@python.org for more information.\n"""\n\nprint("Text Analysis Report:")\nprint("=" * 50)\nreport = format_report(sample_text)\nprint(report)',
      testCases: [
        {
          input: "analyze_text('Hello world test')['words']",
          expectedOutput: "3",
        },
        {
          input: "find_longest_word('short medium verylongword')",
          expectedOutput: "verylongword",
        },
        {
          input: "word_frequency('test test hello')['test']",
          expectedOutput: "2",
        },
        {
          input: "len(extract_email_patterns('Contact test@example.com'))",
          expectedOutput: "1",
        },
      ],
      language: "Python",
      hints: [
        "Use split() and len() for basic text statistics",
        "Use regular expressions for finding words and emails",
        "Use dictionaries to count word frequencies",
        "Sort items by frequency using sorted() with key parameter",
      ],
    },
    settings: {
      timeLimit: 1800,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 5,
  },

  // 6. Basic Algorithm Implementation
  {
    title: "Python Basic Algorithms Workshop",
    description: "Implement fundamental algorithms from scratch",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 32,
    experienceReward: 70,
    estimatedMinutes: 32,
    tags: ["algorithms", "sorting", "searching", "recursion"],
    content: {
      instructions: "Implement fundamental algorithms from scratch",
      problem:
        "Create implementations of classic algorithms including search and sort",
      starterCode:
        '# Basic Algorithms Workshop\ndef bubble_sort(arr):\n    """Implement bubble sort algorithm"""\n    # Your code here\n    pass\n\ndef binary_search(arr, target):\n    """Implement binary search (assume arr is sorted)"""\n    # Your code here\n    pass\n\ndef fibonacci_sequence(n):\n    """Generate first n numbers in Fibonacci sequence"""\n    # Your code here\n    pass\n\ndef is_prime(num):\n    """Check if a number is prime"""\n    # Your code here\n    pass\n\ndef factorial(n):\n    """Calculate factorial using recursion"""\n    # Your code here\n    pass\n\n# Test all algorithms\nprint("Algorithm Testing:")\nprint("=" * 30)\n\n# Test sorting\ndata = [64, 34, 25, 12, 22, 11, 90]\nprint(f"Original: {data}")\nsorted_data = bubble_sort(data.copy())\nprint(f"Bubble sorted: {sorted_data}")\n\n# Test searching\ntarget = 25\nindex = binary_search(sorted_data, target)\nprint(f"Binary search for {target}: index {index}")\n\n# Test other algorithms\nprint(f"First 10 Fibonacci numbers: {fibonacci_sequence(10)}")\nprint(f"Is 17 prime? {is_prime(17)}")\nprint(f"5! = {factorial(5)}")',
      solution:
        '# Basic Algorithms Workshop\ndef bubble_sort(arr):\n    """Implement bubble sort algorithm"""\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\n\ndef binary_search(arr, target):\n    """Implement binary search (assume arr is sorted)"""\n    left, right = 0, len(arr) - 1\n    \n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    \n    return -1  # Not found\n\ndef fibonacci_sequence(n):\n    """Generate first n numbers in Fibonacci sequence"""\n    if n <= 0:\n        return []\n    elif n == 1:\n        return [0]\n    elif n == 2:\n        return [0, 1]\n    \n    fib = [0, 1]\n    for i in range(2, n):\n        fib.append(fib[i-1] + fib[i-2])\n    \n    return fib\n\ndef is_prime(num):\n    """Check if a number is prime"""\n    if num < 2:\n        return False\n    if num == 2:\n        return True\n    if num % 2 == 0:\n        return False\n    \n    for i in range(3, int(num**0.5) + 1, 2):\n        if num % i == 0:\n            return False\n    \n    return True\n\ndef factorial(n):\n    """Calculate factorial using recursion"""\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\n# Test all algorithms\nprint("Algorithm Testing:")\nprint("=" * 30)\n\n# Test sorting\ndata = [64, 34, 25, 12, 22, 11, 90]\nprint(f"Original: {data}")\nsorted_data = bubble_sort(data.copy())\nprint(f"Bubble sorted: {sorted_data}")\n\n# Test searching\ntarget = 25\nindex = binary_search(sorted_data, target)\nprint(f"Binary search for {target}: index {index}")\n\n# Test other algorithms\nprint(f"First 10 Fibonacci numbers: {fibonacci_sequence(10)}")\nprint(f"Is 17 prime? {is_prime(17)}")\nprint(f"5! = {factorial(5)}")',
      testCases: [
        {
          input: "bubble_sort([3, 1, 4, 1, 5])",
          expectedOutput: "[1, 1, 3, 4, 5]",
        },
        { input: "binary_search([1, 2, 3, 4, 5], 3)", expectedOutput: "2" },
        { input: "fibonacci_sequence(5)", expectedOutput: "[0, 1, 1, 2, 3]" },
        { input: "is_prime(17)", expectedOutput: "True" },
        { input: "factorial(4)", expectedOutput: "24" },
      ],
      language: "Python",
      hints: [
        "Bubble sort: compare adjacent elements and swap if needed",
        "Binary search: divide search space in half each iteration",
        "Fibonacci: each number is sum of two preceding ones",
        "Prime check: test divisibility up to square root",
        "Factorial: n! = n × (n-1)!",
      ],
    },
    settings: {
      timeLimit: 1920,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 6,
  },

  // DIFFICULTY 3 - INTERMEDIATE (2 activities)

  // 7. Class-Based System Design
  {
    title: "Python Class Design Challenge",
    description: "Design a complete library management system using classes",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 35,
    experienceReward: 75,
    estimatedMinutes: 35,
    tags: ["oop", "classes", "inheritance", "design"],
    content: {
      instructions:
        "Create a library management system using object-oriented programming",
      problem:
        "Build a complete library system with books, members, and transactions",
      starterCode:
        '# Library Management System\nfrom datetime import datetime, timedelta\n\nclass Book:\n    """Represents a book in the library"""\n    \n    def __init__(self, isbn, title, author, genre):\n        # Your code here\n        pass\n    \n    def __str__(self):\n        # Your code here\n        pass\n\nclass Member:\n    """Represents a library member"""\n    \n    def __init__(self, member_id, name, email):\n        # Your code here\n        pass\n    \n    def can_borrow(self):\n        """Check if member can borrow more books"""\n        # Your code here\n        pass\n\nclass Library:\n    """Main library management system"""\n    \n    def __init__(self):\n        # Your code here\n        pass\n    \n    def add_book(self, book):\n        """Add a book to the library"""\n        # Your code here\n        pass\n    \n    def register_member(self, member):\n        """Register a new member"""\n        # Your code here\n        pass\n    \n    def borrow_book(self, member_id, isbn):\n        """Process book borrowing"""\n        # Your code here\n        pass\n    \n    def return_book(self, member_id, isbn):\n        """Process book return"""\n        # Your code here\n        pass\n    \n    def generate_report(self):\n        """Generate library status report"""\n        # Your code here\n        pass\n\n# Demo the system\nlibrary = Library()\n\n# Add books\nbook1 = Book("978-0134685991", "Effective Python", "Brett Slatkin", "Programming")\nbook2 = Book("978-1491946008", "Fluent Python", "Luciano Ramalho", "Programming")\nlibrary.add_book(book1)\nlibrary.add_book(book2)\n\n# Register members\nmember1 = Member("M001", "Alice Johnson", "alice@example.com")\nmember2 = Member("M002", "Bob Smith", "bob@example.com")\nlibrary.register_member(member1)\nlibrary.register_member(member2)\n\n# Test borrowing\nlibrary.borrow_book("M001", "978-0134685991")\nlibrary.borrow_book("M002", "978-1491946008")\n\nprint(library.generate_report())',
      solution:
        '# Library Management System\nfrom datetime import datetime, timedelta\n\nclass Book:\n    """Represents a book in the library"""\n    \n    def __init__(self, isbn, title, author, genre):\n        self.isbn = isbn\n        self.title = title\n        self.author = author\n        self.genre = genre\n        self.is_available = True\n        self.borrowed_by = None\n        self.due_date = None\n    \n    def __str__(self):\n        status = "Available" if self.is_available else f"Borrowed (due: {self.due_date})"\n        return f"{self.title} by {self.author} - {status}"\n\nclass Member:\n    """Represents a library member"""\n    \n    def __init__(self, member_id, name, email):\n        self.member_id = member_id\n        self.name = name\n        self.email = email\n        self.borrowed_books = []\n        self.max_books = 3\n    \n    def can_borrow(self):\n        """Check if member can borrow more books"""\n        return len(self.borrowed_books) < self.max_books\n\nclass Library:\n    """Main library management system"""\n    \n    def __init__(self):\n        self.books = {}\n        self.members = {}\n        self.transaction_history = []\n    \n    def add_book(self, book):\n        """Add a book to the library"""\n        self.books[book.isbn] = book\n        return True\n    \n    def register_member(self, member):\n        """Register a new member"""\n        self.members[member.member_id] = member\n        return True\n    \n    def borrow_book(self, member_id, isbn):\n        """Process book borrowing"""\n        if member_id not in self.members:\n            return "Member not found"\n        \n        if isbn not in self.books:\n            return "Book not found"\n        \n        member = self.members[member_id]\n        book = self.books[isbn]\n        \n        if not book.is_available:\n            return "Book is not available"\n        \n        if not member.can_borrow():\n            return "Member has reached borrowing limit"\n        \n        # Process borrowing\n        book.is_available = False\n        book.borrowed_by = member_id\n        book.due_date = datetime.now() + timedelta(days=14)\n        member.borrowed_books.append(isbn)\n        \n        self.transaction_history.append({\n            \'type\': \'borrow\',\n            \'member_id\': member_id,\n            \'isbn\': isbn,\n            \'date\': datetime.now()\n        })\n        \n        return "Book borrowed successfully"\n    \n    def return_book(self, member_id, isbn):\n        """Process book return"""\n        if member_id not in self.members:\n            return "Member not found"\n        \n        if isbn not in self.books:\n            return "Book not found"\n        \n        member = self.members[member_id]\n        book = self.books[isbn]\n        \n        if isbn not in member.borrowed_books:\n            return "Book was not borrowed by this member"\n        \n        # Process return\n        book.is_available = True\n        book.borrowed_by = None\n        book.due_date = None\n        member.borrowed_books.remove(isbn)\n        \n        self.transaction_history.append({\n            \'type\': \'return\',\n            \'member_id\': member_id,\n            \'isbn\': isbn,\n            \'date\': datetime.now()\n        })\n        \n        return "Book returned successfully"\n    \n    def generate_report(self):\n        """Generate library status report"""\n        total_books = len(self.books)\n        available_books = len([b for b in self.books.values() if b.is_available])\n        borrowed_books = total_books - available_books\n        total_members = len(self.members)\n        \n        report = f"""\nLibrary Status Report\n{\'=\' * 30}\n\nBooks:\n- Total: {total_books}\n- Available: {available_books}\n- Borrowed: {borrowed_books}\n\nMembers: {total_members}\n\nRecent Transactions:\n{chr(10).join([f"- {t[\'type\'].title()}: {t[\'isbn\']} by {t[\'member_id\']}" for t in self.transaction_history[-5:]])}\n"""\n        return report\n\n# Demo the system\nlibrary = Library()\n\n# Add books\nbook1 = Book("978-0134685991", "Effective Python", "Brett Slatkin", "Programming")\nbook2 = Book("978-1491946008", "Fluent Python", "Luciano Ramalho", "Programming")\nlibrary.add_book(book1)\nlibrary.add_book(book2)\n\n# Register members\nmember1 = Member("M001", "Alice Johnson", "alice@example.com")\nmember2 = Member("M002", "Bob Smith", "bob@example.com")\nlibrary.register_member(member1)\nlibrary.register_member(member2)\n\n# Test borrowing\nlibrary.borrow_book("M001", "978-0134685991")\nlibrary.borrow_book("M002", "978-1491946008")\n\nprint(library.generate_report())',
      testCases: [
        {
          input:
            "book = Book('123', 'Test', 'Author', 'Genre'); book.is_available",
          expectedOutput: "True",
        },
        {
          input:
            "member = Member('M001', 'Test', 'test@email.com'); member.can_borrow()",
          expectedOutput: "True",
        },
        { input: "lib = Library(); len(lib.books)", expectedOutput: "0" },
      ],
      language: "Python",
      hints: [
        "Use __init__ to initialize object attributes",
        "Track book availability and member borrowing limits",
        "Use datetime for due dates and transaction history",
        "Implement proper error checking in methods",
      ],
    },
    settings: {
      timeLimit: 2100,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 7,
  },

  // 8. Advanced Data Processing
  {
    title: "Python Advanced Data Processing Pipeline",
    description:
      "Build a comprehensive data processing system with error handling",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 38,
    experienceReward: 80,
    estimatedMinutes: 38,
    tags: ["data-processing", "error-handling", "validation", "advanced"],
    content: {
      instructions:
        "Create a robust data processing pipeline with validation and error handling",
      problem:
        "Build a data pipeline that processes, validates, and analyzes customer data",
      starterCode:
        '# Advanced Data Processing Pipeline\nimport re\nfrom datetime import datetime\n\nclass DataProcessor:\n    """Advanced data processing pipeline"""\n    \n    def __init__(self):\n        self.processed_data = []\n        self.errors = []\n    \n    def validate_email(self, email):\n        """Validate email format"""\n        # Your code here\n        pass\n    \n    def validate_phone(self, phone):\n        """Validate phone number format"""\n        # Your code here\n        pass\n    \n    def parse_customer_data(self, raw_data):\n        """Parse and validate customer data"""\n        # Your code here\n        pass\n    \n    def calculate_customer_value(self, customer):\n        """Calculate customer lifetime value"""\n        # Your code here\n        pass\n    \n    def generate_report(self):\n        """Generate processing report"""\n        # Your code here\n        pass\n    \n    def process_batch(self, customers_data):\n        """Process a batch of customer data"""\n        # Your code here\n        pass\n\n# Sample customer data\nraw_customers = [\n    "John Doe,john.doe@email.com,+1-555-123-4567,Premium,2500.50",\n    "Jane Smith,jane.smith@invalid,555-987-6543,Standard,1200.00",\n    "Bob Johnson,bob@example.com,+1-555-555-5555,Premium,3200.75",\n    "Alice Brown,alice.brown@email.com,invalid-phone,Basic,850.25",\n    "Charlie Wilson,charlie@test.com,+1-555-111-2222,Premium,4100.00"\n]\n\n# Process the data\nprocessor = DataProcessor()\nprocessor.process_batch(raw_customers)\n\nprint("Data Processing Report:")\nprint("=" * 50)\nreport = processor.generate_report()\nprint(report)',
      solution:
        '# Advanced Data Processing Pipeline\nimport re\nfrom datetime import datetime\n\nclass DataProcessor:\n    """Advanced data processing pipeline"""\n    \n    def __init__(self):\n        self.processed_data = []\n        self.errors = []\n    \n    def validate_email(self, email):\n        """Validate email format"""\n        pattern = r\'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$\'\n        return re.match(pattern, email) is not None\n    \n    def validate_phone(self, phone):\n        """Validate phone number format"""\n        # Remove common separators and check if it\'s a valid format\n        cleaned = re.sub(r\'[^\\d+]\', \'\', phone)\n        pattern = r\'^\\+?1?[0-9]{10,14}$\'\n        return re.match(pattern, cleaned) is not None\n    \n    def parse_customer_data(self, raw_data):\n        """Parse and validate customer data"""\n        try:\n            parts = raw_data.split(\',\')\n            if len(parts) != 5:\n                raise ValueError("Invalid data format")\n            \n            name, email, phone, tier, value = parts\n            \n            # Validate components\n            if not self.validate_email(email):\n                raise ValueError(f"Invalid email: {email}")\n            \n            if not self.validate_phone(phone):\n                raise ValueError(f"Invalid phone: {phone}")\n            \n            if tier not in [\'Basic\', \'Standard\', \'Premium\']:\n                raise ValueError(f"Invalid tier: {tier}")\n            \n            try:\n                value = float(value)\n            except ValueError:\n                raise ValueError(f"Invalid value: {value}")\n            \n            return {\n                \'name\': name.strip(),\n                \'email\': email.strip(),\n                \'phone\': phone.strip(),\n                \'tier\': tier.strip(),\n                \'value\': value,\n                \'processed_at\': datetime.now().isoformat()\n            }\n            \n        except Exception as e:\n            raise ValueError(f"Parsing error: {str(e)}")\n    \n    def calculate_customer_value(self, customer):\n        """Calculate customer lifetime value"""\n        base_value = customer[\'value\']\n        tier_multipliers = {\'Basic\': 1.0, \'Standard\': 1.2, \'Premium\': 1.5}\n        multiplier = tier_multipliers.get(customer[\'tier\'], 1.0)\n        return base_value * multiplier\n    \n    def generate_report(self):\n        """Generate processing report"""\n        total_processed = len(self.processed_data)\n        total_errors = len(self.errors)\n        \n        if total_processed > 0:\n            total_value = sum(self.calculate_customer_value(c) for c in self.processed_data)\n            avg_value = total_value / total_processed\n            \n            # Tier distribution\n            tier_counts = {}\n            for customer in self.processed_data:\n                tier = customer[\'tier\']\n                tier_counts[tier] = tier_counts.get(tier, 0) + 1\n        else:\n            total_value = avg_value = 0\n            tier_counts = {}\n        \n        success_rate = (total_processed/(total_processed+total_errors)*100) if (total_processed+total_errors) > 0 else 0\n        \n        report = f"""Processing Summary:\n- Total records processed: {total_processed}\n- Total errors: {total_errors}\n- Success rate: {success_rate:.1f}%\n\nFinancial Summary:\n- Total customer value: ${total_value:.2f}\n- Average customer value: ${avg_value:.2f}\n\nTier Distribution:\n{chr(10).join([f"- {tier}: {count}" for tier, count in tier_counts.items()])}\n\nErrors:\n{chr(10).join([f"- {error}" for error in self.errors[:5]])}"""\n        \n        return report\n    \n    def process_batch(self, customers_data):\n        """Process a batch of customer data"""\n        self.processed_data.clear()\n        self.errors.clear()\n        \n        for i, raw_data in enumerate(customers_data):\n            try:\n                customer = self.parse_customer_data(raw_data)\n                self.processed_data.append(customer)\n            except ValueError as e:\n                self.errors.append(f"Record {i+1}: {str(e)}")\n\n# Sample customer data\nraw_customers = [\n    "John Doe,john.doe@email.com,+1-555-123-4567,Premium,2500.50",\n    "Jane Smith,jane.smith@invalid,555-987-6543,Standard,1200.00",\n    "Bob Johnson,bob@example.com,+1-555-555-5555,Premium,3200.75",\n    "Alice Brown,alice.brown@email.com,invalid-phone,Basic,850.25",\n    "Charlie Wilson,charlie@test.com,+1-555-111-2222,Premium,4100.00"\n]\n\n# Process the data\nprocessor = DataProcessor()\nprocessor.process_batch(raw_customers)\n\nprint("Data Processing Report:")\nprint("=" * 50)\nreport = processor.generate_report()\nprint(report)',
      testCases: [
        {
          input:
            "proc = DataProcessor(); proc.validate_email('test@example.com')",
          expectedOutput: "True",
        },
        {
          input:
            "proc = DataProcessor(); proc.validate_phone('+1-555-123-4567')",
          expectedOutput: "True",
        },
        {
          input: "proc = DataProcessor(); proc.validate_email('invalid-email')",
          expectedOutput: "False",
        },
      ],
      language: "Python",
      hints: [
        "Use regular expressions for email and phone validation",
        "Handle exceptions gracefully and collect error messages",
        "Store processed data and errors separately",
        "Calculate metrics from successfully processed data",
      ],
    },
    settings: {
      timeLimit: 2280,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 8,
  },

  // DIFFICULTY 4 - ADVANCED (2 activities)

  // 9. Advanced Algorithm Implementation
  {
    title: "Python Advanced Algorithms and Data Structures",
    description:
      "Implement complex algorithms and data structures with optimization",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 4,
    diamondReward: 40,
    experienceReward: 85,
    estimatedMinutes: 40,
    tags: [
      "advanced-algorithms",
      "data-structures",
      "optimization",
      "complexity",
    ],
    content: {
      instructions:
        "Implement advanced algorithms and data structures with focus on efficiency",
      problem:
        "Create optimized implementations of advanced algorithms and data structures",
      starterCode:
        '# Advanced Algorithms and Data Structures\nclass AdvancedAlgorithms:\n    """Collection of advanced algorithms"""\n    \n    @staticmethod\n    def merge_sort(arr):\n        """Implement merge sort algorithm"""\n        # Your code here\n        pass\n    \n    @staticmethod\n    def quick_sort(arr, low=None, high=None):\n        """Implement quick sort algorithm"""\n        # Your code here\n        pass\n    \n    @staticmethod\n    def longest_common_subsequence(str1, str2):\n        """Find longest common subsequence using dynamic programming"""\n        # Your code here\n        pass\n    \n    @staticmethod\n    def knapsack_01(weights, values, capacity):\n        """Solve 0/1 knapsack problem using dynamic programming"""\n        # Your code here\n        pass\n\nclass TreeNode:\n    """Binary tree node"""\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nclass BinarySearchTree:\n    """Binary Search Tree implementation"""\n    \n    def __init__(self):\n        self.root = None\n    \n    def insert(self, val):\n        """Insert a value into the BST"""\n        # Your code here\n        pass\n    \n    def search(self, val):\n        """Search for a value in the BST"""\n        # Your code here\n        pass\n    \n    def inorder_traversal(self):\n        """Return inorder traversal of the tree"""\n        # Your code here\n        pass\n\n# Test the implementations\nprint("Advanced Algorithms Testing:")\nprint("=" * 40)\n\n# Test sorting algorithms\ndata = [64, 34, 25, 12, 22, 11, 90]\nprint(f"Original: {data}")\nprint(f"Merge sorted: {AdvancedAlgorithms.merge_sort(data.copy())}")\n\ndata_copy = data.copy()\nAdvancedAlgorithms.quick_sort(data_copy)\nprint(f"Quick sorted: {data_copy}")\n\n# Test dynamic programming\nstr1, str2 = "ABCDGH", "AEDFHR"\nlcs = AdvancedAlgorithms.longest_common_subsequence(str1, str2)\nprint(f"LCS of \'{str1}\' and \'{str2}\': {lcs}")\n\n# Test knapsack\nweights = [10, 20, 30]\nvalues = [60, 100, 120]\ncapacity = 50\nmax_value = AdvancedAlgorithms.knapsack_01(weights, values, capacity)\nprint(f"Knapsack maximum value: {max_value}")\n\n# Test BST\nbst = BinarySearchTree()\nfor val in [50, 30, 70, 20, 40, 60, 80]:\n    bst.insert(val)\n\nprint(f"BST inorder traversal: {bst.inorder_traversal()}")\nprint(f"Search for 40: {bst.search(40)}")\nprint(f"Search for 90: {bst.search(90)}")',
      solution:
        '# Advanced Algorithms and Data Structures\nclass AdvancedAlgorithms:\n    """Collection of advanced algorithms"""\n    \n    @staticmethod\n    def merge_sort(arr):\n        """Implement merge sort algorithm"""\n        if len(arr) <= 1:\n            return arr\n        \n        mid = len(arr) // 2\n        left = AdvancedAlgorithms.merge_sort(arr[:mid])\n        right = AdvancedAlgorithms.merge_sort(arr[mid:])\n        \n        # Merge the sorted halves\n        result = []\n        i = j = 0\n        \n        while i < len(left) and j < len(right):\n            if left[i] <= right[j]:\n                result.append(left[i])\n                i += 1\n            else:\n                result.append(right[j])\n                j += 1\n        \n        result.extend(left[i:])\n        result.extend(right[j:])\n        return result\n    \n    @staticmethod\n    def quick_sort(arr, low=None, high=None):\n        """Implement quick sort algorithm"""\n        if low is None:\n            low = 0\n        if high is None:\n            high = len(arr) - 1\n        \n        if low < high:\n            # Partition and get pivot index\n            pivot_index = AdvancedAlgorithms._partition(arr, low, high)\n            \n            # Recursively sort elements before and after partition\n            AdvancedAlgorithms.quick_sort(arr, low, pivot_index - 1)\n            AdvancedAlgorithms.quick_sort(arr, pivot_index + 1, high)\n    \n    @staticmethod\n    def _partition(arr, low, high):\n        """Partition helper for quicksort"""\n        pivot = arr[high]\n        i = low - 1\n        \n        for j in range(low, high):\n            if arr[j] <= pivot:\n                i += 1\n                arr[i], arr[j] = arr[j], arr[i]\n        \n        arr[i + 1], arr[high] = arr[high], arr[i + 1]\n        return i + 1\n    \n    @staticmethod\n    def longest_common_subsequence(str1, str2):\n        """Find longest common subsequence using dynamic programming"""\n        m, n = len(str1), len(str2)\n        dp = [[0] * (n + 1) for _ in range(m + 1)]\n        \n        # Fill the DP table\n        for i in range(1, m + 1):\n            for j in range(1, n + 1):\n                if str1[i-1] == str2[j-1]:\n                    dp[i][j] = dp[i-1][j-1] + 1\n                else:\n                    dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n        \n        # Reconstruct the LCS\n        lcs = []\n        i, j = m, n\n        while i > 0 and j > 0:\n            if str1[i-1] == str2[j-1]:\n                lcs.append(str1[i-1])\n                i -= 1\n                j -= 1\n            elif dp[i-1][j] > dp[i][j-1]:\n                i -= 1\n            else:\n                j -= 1\n        \n        return \'\'.join(reversed(lcs))\n    \n    @staticmethod\n    def knapsack_01(weights, values, capacity):\n        """Solve 0/1 knapsack problem using dynamic programming"""\n        n = len(weights)\n        dp = [[0] * (capacity + 1) for _ in range(n + 1)]\n        \n        for i in range(1, n + 1):\n            for w in range(capacity + 1):\n                if weights[i-1] <= w:\n                    dp[i][w] = max(\n                        values[i-1] + dp[i-1][w - weights[i-1]],\n                        dp[i-1][w]\n                    )\n                else:\n                    dp[i][w] = dp[i-1][w]\n        \n        return dp[n][capacity]\n\nclass TreeNode:\n    """Binary tree node"""\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nclass BinarySearchTree:\n    """Binary Search Tree implementation"""\n    \n    def __init__(self):\n        self.root = None\n    \n    def insert(self, val):\n        """Insert a value into the BST"""\n        self.root = self._insert_recursive(self.root, val)\n    \n    def _insert_recursive(self, node, val):\n        """Helper method for recursive insertion"""\n        if node is None:\n            return TreeNode(val)\n        \n        if val < node.val:\n            node.left = self._insert_recursive(node.left, val)\n        elif val > node.val:\n            node.right = self._insert_recursive(node.right, val)\n        \n        return node\n    \n    def search(self, val):\n        """Search for a value in the BST"""\n        return self._search_recursive(self.root, val)\n    \n    def _search_recursive(self, node, val):\n        """Helper method for recursive search"""\n        if node is None or node.val == val:\n            return node is not None\n        \n        if val < node.val:\n            return self._search_recursive(node.left, val)\n        else:\n            return self._search_recursive(node.right, val)\n    \n    def inorder_traversal(self):\n        """Return inorder traversal of the tree"""\n        result = []\n        self._inorder_recursive(self.root, result)\n        return result\n    \n    def _inorder_recursive(self, node, result):\n        """Helper method for inorder traversal"""\n        if node:\n            self._inorder_recursive(node.left, result)\n            result.append(node.val)\n            self._inorder_recursive(node.right, result)\n\n# Test the implementations\nprint("Advanced Algorithms Testing:")\nprint("=" * 40)\n\n# Test sorting algorithms\ndata = [64, 34, 25, 12, 22, 11, 90]\nprint(f"Original: {data}")\nprint(f"Merge sorted: {AdvancedAlgorithms.merge_sort(data.copy())}")\n\ndata_copy = data.copy()\nAdvancedAlgorithms.quick_sort(data_copy)\nprint(f"Quick sorted: {data_copy}")\n\n# Test dynamic programming\nstr1, str2 = "ABCDGH", "AEDFHR"\nlcs = AdvancedAlgorithms.longest_common_subsequence(str1, str2)\nprint(f"LCS of \'{str1}\' and \'{str2}\': {lcs}")\n\n# Test knapsack\nweights = [10, 20, 30]\nvalues = [60, 100, 120]\ncapacity = 50\nmax_value = AdvancedAlgorithms.knapsack_01(weights, values, capacity)\nprint(f"Knapsack maximum value: {max_value}")\n\n# Test BST\nbst = BinarySearchTree()\nfor val in [50, 30, 70, 20, 40, 60, 80]:\n    bst.insert(val)\n\nprint(f"BST inorder traversal: {bst.inorder_traversal()}")\nprint(f"Search for 40: {bst.search(40)}")\nprint(f"Search for 90: {bst.search(90)}")',
      testCases: [
        {
          input: "AdvancedAlgorithms.merge_sort([3, 1, 4, 1, 5])",
          expectedOutput: "[1, 1, 3, 4, 5]",
        },
        {
          input:
            "AdvancedAlgorithms.longest_common_subsequence('ABCD', 'ACBD')",
          expectedOutput: "ABD",
        },
        {
          input: "AdvancedAlgorithms.knapsack_01([1, 2, 3], [1, 4, 7], 5)",
          expectedOutput: "8",
        },
      ],
      language: "Python",
      hints: [
        "Merge sort: divide array, recursively sort halves, then merge",
        "Quick sort: choose pivot, partition, recursively sort partitions",
        "LCS: use 2D DP table, reconstruct solution by backtracking",
        "BST: maintain sorted property with recursive insertion and search",
      ],
    },
    settings: {
      timeLimit: 2400,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 9,
  },

  // 10. Complete Application Project
  {
    title: "Python Complete Application: E-commerce Inventory System",
    description: "Build a complete e-commerce inventory management application",
    activityType: "interactive_coding",
    category: "Python Fundamentals",
    difficulty: 4,
    diamondReward: 45,
    experienceReward: 90,
    estimatedMinutes: 45,
    tags: ["complete-application", "project", "integration", "real-world"],
    content: {
      instructions:
        "Create a complete e-commerce inventory system integrating all Python fundamentals",
      problem:
        "Build a comprehensive inventory management system with products, orders, and analytics",
      starterCode:
        '# E-commerce Inventory Management System\nimport json\nfrom datetime import datetime\nfrom enum import Enum\n\nclass ProductCategory(Enum):\n    ELECTRONICS = "Electronics"\n    CLOTHING = "Clothing"\n    BOOKS = "Books"\n    HOME = "Home & Garden"\n    SPORTS = "Sports"\n\nclass OrderStatus(Enum):\n    PENDING = "Pending"\n    PROCESSING = "Processing"\n    SHIPPED = "Shipped"\n    DELIVERED = "Delivered"\n    CANCELLED = "Cancelled"\n\nclass Product:\n    """Product representation"""\n    \n    def __init__(self, product_id, name, category, price, stock_quantity):\n        # Your code here\n        pass\n    \n    def update_stock(self, quantity_change):\n        """Update stock quantity (positive for restock, negative for sale)"""\n        # Your code here\n        pass\n    \n    def is_in_stock(self, quantity=1):\n        """Check if product has sufficient stock"""\n        # Your code here\n        pass\n    \n    def to_dict(self):\n        """Convert to dictionary for serialization"""\n        # Your code here\n        pass\n\nclass Order:\n    """Order representation"""\n    \n    def __init__(self, order_id, customer_name, customer_email):\n        # Your code here\n        pass\n    \n    def add_item(self, product_id, quantity, unit_price):\n        """Add item to order"""\n        # Your code here\n        pass\n    \n    def calculate_total(self):\n        """Calculate order total"""\n        # Your code here\n        pass\n    \n    def update_status(self, new_status):\n        """Update order status"""\n        # Your code here\n        pass\n\nclass InventorySystem:\n    """Main inventory management system"""\n    \n    def __init__(self):\n        # Your code here\n        pass\n    \n    def add_product(self, product):\n        """Add product to inventory"""\n        # Your code here\n        pass\n    \n    def create_order(self, customer_name, customer_email, items):\n        """Create new order and update inventory"""\n        # Your code here\n        pass\n    \n    def get_low_stock_products(self, threshold=10):\n        """Get products with low stock"""\n        # Your code here\n        pass\n    \n    def generate_sales_report(self):\n        """Generate comprehensive sales report"""\n        # Your code here\n        pass\n    \n    def search_products(self, query):\n        """Search products by name or category"""\n        # Your code here\n        pass\n\n# Demo the system\ninventory = InventorySystem()\n\n# Add sample products\nproducts = [\n    Product("P001", "Laptop Pro", ProductCategory.ELECTRONICS, 1299.99, 50),\n    Product("P002", "Wireless Headphones", ProductCategory.ELECTRONICS, 199.99, 100),\n    Product("P003", "Python Programming Book", ProductCategory.BOOKS, 49.99, 25),\n    Product("P004", "Running Shoes", ProductCategory.SPORTS, 89.99, 75)\n]\n\nfor product in products:\n    inventory.add_product(product)\n\n# Create sample orders\norder_items = [\n    ("P001", 2, 1299.99),\n    ("P002", 1, 199.99)\n]\ninventory.create_order("John Doe", "john@example.com", order_items)\n\norder_items2 = [\n    ("P003", 3, 49.99),\n    ("P004", 1, 89.99)\n]\ninventory.create_order("Jane Smith", "jane@example.com", order_items2)\n\nprint("E-commerce Inventory System Demo")\nprint("=" * 40)\nprint(inventory.generate_sales_report())',
      solution:
        '# E-commerce Inventory Management System\nimport json\nfrom datetime import datetime\nfrom enum import Enum\n\nclass ProductCategory(Enum):\n    ELECTRONICS = "Electronics"\n    CLOTHING = "Clothing"\n    BOOKS = "Books"\n    HOME = "Home & Garden"\n    SPORTS = "Sports"\n\nclass OrderStatus(Enum):\n    PENDING = "Pending"\n    PROCESSING = "Processing"\n    SHIPPED = "Shipped"\n    DELIVERED = "Delivered"\n    CANCELLED = "Cancelled"\n\nclass Product:\n    """Product representation"""\n    \n    def __init__(self, product_id, name, category, price, stock_quantity):\n        self.product_id = product_id\n        self.name = name\n        self.category = category\n        self.price = price\n        self.stock_quantity = stock_quantity\n        self.created_at = datetime.now()\n        self.total_sold = 0\n    \n    def update_stock(self, quantity_change):\n        """Update stock quantity (positive for restock, negative for sale)"""\n        self.stock_quantity += quantity_change\n        if quantity_change < 0:\n            self.total_sold += abs(quantity_change)\n        return self.stock_quantity\n    \n    def is_in_stock(self, quantity=1):\n        """Check if product has sufficient stock"""\n        return self.stock_quantity >= quantity\n    \n    def to_dict(self):\n        """Convert to dictionary for serialization"""\n        return {\n            \'product_id\': self.product_id,\n            \'name\': self.name,\n            \'category\': self.category.value,\n            \'price\': self.price,\n            \'stock_quantity\': self.stock_quantity,\n            \'total_sold\': self.total_sold\n        }\n\nclass Order:\n    """Order representation"""\n    \n    def __init__(self, order_id, customer_name, customer_email):\n        self.order_id = order_id\n        self.customer_name = customer_name\n        self.customer_email = customer_email\n        self.items = []\n        self.status = OrderStatus.PENDING\n        self.created_at = datetime.now()\n        self.total_amount = 0\n    \n    def add_item(self, product_id, quantity, unit_price):\n        """Add item to order"""\n        item = {\n            \'product_id\': product_id,\n            \'quantity\': quantity,\n            \'unit_price\': unit_price,\n            \'subtotal\': quantity * unit_price\n        }\n        self.items.append(item)\n        self.total_amount += item[\'subtotal\']\n    \n    def calculate_total(self):\n        """Calculate order total"""\n        self.total_amount = sum(item[\'subtotal\'] for item in self.items)\n        return self.total_amount\n    \n    def update_status(self, new_status):\n        """Update order status"""\n        if isinstance(new_status, str):\n            new_status = OrderStatus(new_status)\n        self.status = new_status\n\nclass InventorySystem:\n    """Main inventory management system"""\n    \n    def __init__(self):\n        self.products = {}\n        self.orders = {}\n        self.next_order_id = 1\n    \n    def add_product(self, product):\n        """Add product to inventory"""\n        self.products[product.product_id] = product\n        return True\n    \n    def create_order(self, customer_name, customer_email, items):\n        """Create new order and update inventory"""\n        order = Order(f"ORD{self.next_order_id:04d}", customer_name, customer_email)\n        \n        # Validate all items first\n        for product_id, quantity, unit_price in items:\n            if product_id not in self.products:\n                return f"Product {product_id} not found"\n            \n            product = self.products[product_id]\n            if not product.is_in_stock(quantity):\n                return f"Insufficient stock for {product.name}"\n        \n        # Process the order\n        for product_id, quantity, unit_price in items:\n            product = self.products[product_id]\n            product.update_stock(-quantity)\n            order.add_item(product_id, quantity, unit_price)\n        \n        self.orders[order.order_id] = order\n        self.next_order_id += 1\n        return order.order_id\n    \n    def get_low_stock_products(self, threshold=10):\n        """Get products with low stock"""\n        return [product for product in self.products.values() \n                if product.stock_quantity <= threshold]\n    \n    def generate_sales_report(self):\n        """Generate comprehensive sales report"""\n        total_orders = len(self.orders)\n        total_revenue = sum(order.total_amount for order in self.orders.values())\n        \n        # Category breakdown\n        category_sales = {}\n        for order in self.orders.values():\n            for item in order.items:\n                product = self.products[item[\'product_id\']]\n                category = product.category.value\n                category_sales[category] = category_sales.get(category, 0) + item[\'subtotal\']\n        \n        # Top selling products\n        product_sales = sorted(\n            [(p.name, p.total_sold) for p in self.products.values()],\n            key=lambda x: x[1], reverse=True\n        )[:5]\n        \n        # Low stock alerts\n        low_stock = self.get_low_stock_products()\n        \n        report = f"""\nInventory & Sales Report\n{\'=\' * 30}\n\nSales Summary:\n- Total Orders: {total_orders}\n- Total Revenue: ${total_revenue:.2f}\n- Average Order Value: ${total_revenue/total_orders:.2f if total_orders > 0 else 0}\n\nCategory Performance:\n{chr(10).join([f"- {cat}: ${sales:.2f}" for cat, sales in category_sales.items()])}\n\nTop Selling Products:\n{chr(10).join([f"- {name}: {sold} units" for name, sold in product_sales])}\n\nLow Stock Alerts ({len(low_stock)} products):\n{chr(10).join([f"- {p.name}: {p.stock_quantity} units" for p in low_stock[:5]])}\n"""\n        return report\n    \n    def search_products(self, query):\n        """Search products by name or category"""\n        query = query.lower()\n        results = []\n        for product in self.products.values():\n            if (query in product.name.lower() or \n                query in product.category.value.lower()):\n                results.append(product)\n        return results\n\n# Demo the system\ninventory = InventorySystem()\n\n# Add sample products\nproducts = [\n    Product("P001", "Laptop Pro", ProductCategory.ELECTRONICS, 1299.99, 50),\n    Product("P002", "Wireless Headphones", ProductCategory.ELECTRONICS, 199.99, 100),\n    Product("P003", "Python Programming Book", ProductCategory.BOOKS, 49.99, 25),\n    Product("P004", "Running Shoes", ProductCategory.SPORTS, 89.99, 75)\n]\n\nfor product in products:\n    inventory.add_product(product)\n\n# Create sample orders\norder_items = [\n    ("P001", 2, 1299.99),\n    ("P002", 1, 199.99)\n]\ninventory.create_order("John Doe", "john@example.com", order_items)\n\norder_items2 = [\n    ("P003", 3, 49.99),\n    ("P004", 1, 89.99)\n]\ninventory.create_order("Jane Smith", "jane@example.com", order_items2)\n\nprint("E-commerce Inventory System Demo")\nprint("=" * 40)\nprint(inventory.generate_sales_report())',
      testCases: [
        {
          input:
            "product = Product('P001', 'Test', ProductCategory.ELECTRONICS, 100, 50); product.is_in_stock(10)",
          expectedOutput: "True",
        },
        {
          input: "inv = InventorySystem(); len(inv.products)",
          expectedOutput: "0",
        },
        {
          input:
            "order = Order('O001', 'Test', 'test@email.com'); order.add_item('P001', 2, 50); order.total_amount",
          expectedOutput: "100",
        },
      ],
      language: "Python",
      hints: [
        "Use enums for categories and status to ensure data consistency",
        "Track inventory changes carefully to maintain accurate stock levels",
        "Implement proper validation before processing orders",
        "Use aggregation and sorting for meaningful reports",
      ],
    },
    settings: {
      timeLimit: 2700,
      enableCodeCompletion: true,
      showTestCases: true,
    },
    isActive: true,
    sortOrder: 10,
  },
];

export async function seedInteractiveCodingPythonFundamentalsActivities() {
  console.log(
    "💻 Seeding Interactive Coding Python Fundamentals activities..."
  );

  if (interactiveCodingPythonFundamentalsActivities.length === 0) {
    console.log(
      "📝 No Interactive Coding Python Fundamentals activities to seed"
    );
    return;
  }

  for (const activity of interactiveCodingPythonFundamentalsActivities) {
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
    `✅ ${interactiveCodingPythonFundamentalsActivities.length} Interactive Coding Python Fundamentals activities seeded successfully`
  );
}

// Execute the seeding function if this file is run directly
if (require.main === module) {
  seedInteractiveCodingPythonFundamentalsActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Interactive Coding Python Fundamentals activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
