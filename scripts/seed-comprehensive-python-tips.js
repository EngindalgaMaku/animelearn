const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const categories = [
  {
    name: "Python Basics",
    slug: "python-basics",
    description: "Fundamental Python concepts for beginners",
    color: "#10B981",
    icon: "🐍",
  },
  {
    name: "Data Structures",
    slug: "data-structures",
    description: "Lists, dictionaries, sets, and tuples",
    color: "#3B82F6",
    icon: "📊",
  },
  {
    name: "Functions & Modules",
    slug: "functions-modules",
    description: "Functions, parameters, and importing modules",
    color: "#8B5CF6",
    icon: "⚙️",
  },
  {
    name: "Object-Oriented Programming",
    slug: "oop",
    description: "Classes, objects, inheritance, and polymorphism",
    color: "#F59E0B",
    icon: "🏗️",
  },
  {
    name: "File Operations",
    slug: "file-operations",
    description: "Reading and writing files in Python",
    color: "#EF4444",
    icon: "📁",
  },
  {
    name: "Best Practices",
    slug: "best-practices",
    description: "Python coding best practices and tips",
    color: "#06B6D4",
    icon: "✨",
  },
  {
    name: "Web Development",
    slug: "web-development",
    description: "Python for web development and APIs",
    color: "#EC4899",
    icon: "🌐",
  },
  {
    name: "Data Science",
    slug: "data-science",
    description: "Python for data analysis and machine learning",
    color: "#14B8A6",
    icon: "📈",
  },
  {
    name: "Testing & Debugging",
    slug: "testing-debugging",
    description: "Testing, debugging, and code quality",
    color: "#F97316",
    icon: "🔧",
  },
  {
    name: "Performance & Optimization",
    slug: "performance",
    description: "Optimizing Python code for better performance",
    color: "#84CC16",
    icon: "⚡",
  },
];

const pythonTips = [
  // Python Basics Tips (8 tips)
  {
    title: "Understanding Python Variables",
    content:
      "In Python, variables are containers for storing data values. Unlike other programming languages, Python has no command for declaring a variable. A variable is created the moment you first assign a value to it. Python is dynamically typed, which means you don't need to specify the data type.",
    codeExample: `# Creating variables
name = "Alice"
age = 25
height = 5.7
is_student = True

# Python automatically determines the type
print(type(name))    # <class 'str'>
print(type(age))     # <class 'int'>
print(type(height))  # <class 'float'>
print(type(is_student)) # <class 'bool'>

# Variable reassignment
score = 100
score = "A+"  # Now it's a string!
print(type(score))  # <class 'str'>`,
    difficulty: "beginner",
    categorySlug: "python-basics",
    xpReward: 10,
    estimatedMinutes: 3,
    tags: ["variables", "types", "basics"],
  },
  {
    title: "Python String Formatting Made Easy",
    content:
      "Python offers several ways to format strings. The most modern and readable approach is using f-strings (formatted string literals), introduced in Python 3.6. F-strings provide a concise and readable way to include expressions inside string literals.",
    codeExample: `# F-string formatting (Python 3.6+)
name = "Bob"
age = 30
score = 95.5

# Clean and readable
message = f"Hello {name}, you are {age} years old and scored {score:.1f}%"
print(message)

# You can even include expressions
print(f"Next year, {name} will be {age + 1} years old")

# Formatting numbers
pi = 3.14159
print(f"Pi rounded: {pi:.2f}")
print(f"Percentage: {score:.1%}")

# Older methods (still valid but less preferred)
message_old = "Hello {}, you are {} years old".format(name, age)
message_oldest = "Hello %s, you are %d years old" % (name, age)`,
    difficulty: "beginner",
    categorySlug: "python-basics",
    xpReward: 15,
    estimatedMinutes: 4,
    tags: ["strings", "formatting", "f-strings"],
  },
  {
    title: "Python Operators and Expressions",
    content:
      "Python provides various operators for mathematical calculations, comparisons, and logical operations. Understanding operator precedence and short-circuit evaluation is crucial for writing efficient code.",
    codeExample: `# Arithmetic operators
a, b = 10, 3
print(f"Addition: {a + b}")        # 13
print(f"Subtraction: {a - b}")     # 7
print(f"Multiplication: {a * b}")  # 30
print(f"Division: {a / b}")        # 3.333...
print(f"Floor division: {a // b}") # 3
print(f"Modulo: {a % b}")          # 1
print(f"Exponentiation: {a ** b}") # 1000

# Comparison operators
print(f"Equal: {a == b}")          # False
print(f"Not equal: {a != b}")      # True
print(f"Greater than: {a > b}")    # True

# Logical operators
x, y = True, False
print(f"AND: {x and y}")           # False
print(f"OR: {x or y}")             # True
print(f"NOT: {not x}")             # False

# Short-circuit evaluation
def expensive_operation():
    print("This won't be called!")
    return True

result = False and expensive_operation()  # expensive_operation() not called`,
    difficulty: "beginner",
    categorySlug: "python-basics",
    xpReward: 12,
    estimatedMinutes: 5,
    tags: ["operators", "expressions", "arithmetic"],
  },
  {
    title: "Control Flow: if, elif, else",
    content:
      "Python's conditional statements allow you to execute different code blocks based on conditions. The 'elif' keyword is Python's way of saying 'else if'.",
    codeExample: `# Basic if statement
age = 18
if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")

# Multiple conditions with elif
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Your grade is: {grade}")

# Combining conditions
username = "admin"
password = "secret123"
if username == "admin" and password == "secret123":
    print("Access granted")
elif username == "admin":
    print("Wrong password")
else:
    print("User not found")

# Ternary operator (conditional expression)
message = "Even" if 10 % 2 == 0 else "Odd"
print(message)  # Even`,
    difficulty: "beginner",
    categorySlug: "python-basics",
    xpReward: 14,
    estimatedMinutes: 4,
    tags: ["conditionals", "if-else", "control-flow"],
  },
  {
    title: "Loops: for and while",
    content:
      "Python provides two types of loops: 'for' loops for iterating over sequences, and 'while' loops for repeated execution based on a condition.",
    codeExample: `# For loop with range
for i in range(5):
    print(f"Count: {i}")

# For loop with list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"I like {fruit}")

# For loop with enumerate (index + value)
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")

# While loop
count = 0
while count < 3:
    print(f"While count: {count}")
    count += 1

# Loop control: break and continue
for i in range(10):
    if i == 3:
        continue  # Skip this iteration
    if i == 7:
        break     # Exit the loop
    print(i)

# Nested loops
for i in range(3):
    for j in range(2):
        print(f"i={i}, j={j}")`,
    difficulty: "beginner",
    categorySlug: "python-basics",
    xpReward: 16,
    estimatedMinutes: 6,
    tags: ["loops", "for", "while", "iteration"],
  },
  {
    title: "Input and Output Operations",
    content:
      "Python provides simple ways to get user input and display output. Understanding input validation and formatting output is essential for interactive programs.",
    codeExample: `# Basic input and output
name = input("What's your name? ")
print(f"Hello, {name}!")

# Type conversion for input
age_str = input("What's your age? ")
age = int(age_str)  # Convert to integer
print(f"Next year you'll be {age + 1}")

# Input validation
while True:
    try:
        number = int(input("Enter a number: "))
        break  # Exit loop if conversion successful
    except ValueError:
        print("Please enter a valid number!")

# Multiple inputs on one line
x, y = input("Enter two numbers: ").split()
x, y = int(x), int(y)
print(f"Sum: {x + y}")

# Formatted output
print("Name:", name)
print("Age:", age)
print("Numbers:", x, y, sep=" | ")
print("Sum is", x + y, end="!\\n")

# Using print parameters
print("Loading", end="")
for i in range(3):
    print(".", end="", flush=True)
    # time.sleep(1)  # Uncomment for effect
print(" Done!")`,
    difficulty: "beginner",
    categorySlug: "python-basics",
    xpReward: 13,
    estimatedMinutes: 5,
    tags: ["input", "output", "print", "user-interaction"],
  },
  {
    title: "Python Comments and Documentation",
    content:
      "Writing clear comments and documentation is crucial for maintaining code. Python supports single-line, multi-line comments, and docstrings for documentation.",
    codeExample: `# Single-line comment
x = 5  # Inline comment

# Multi-line comments using multiple # symbols
# This is a longer explanation
# that spans multiple lines
# describing complex logic

"""
Multi-line string can serve as
block comments, though not recommended
for regular comments
"""

def calculate_area(radius):
    """
    Calculate the area of a circle.
    
    Args:
        radius (float): The radius of the circle
        
    Returns:
        float: The area of the circle
        
    Raises:
        ValueError: If radius is negative
    """
    if radius < 0:
        raise ValueError("Radius cannot be negative")
    
    import math
    return math.pi * radius ** 2

# Good commenting practices
def process_user_data(users):
    # Filter active users only
    active_users = [user for user in users if user.get('active')]
    
    # Sort by registration date (newest first)
    active_users.sort(key=lambda u: u['reg_date'], reverse=True)
    
    # Return top 10 users
    return active_users[:10]

# TODO: Add error handling
# FIXME: This function is inefficient
# NOTE: Consider using database query instead`,
    difficulty: "beginner",
    categorySlug: "python-basics",
    xpReward: 8,
    estimatedMinutes: 3,
    tags: ["comments", "documentation", "docstrings"],
  },
  {
    title: "Python Indentation and Code Structure",
    content:
      "Python uses indentation to define code blocks instead of braces. Consistent indentation is crucial for code readability and functionality.",
    codeExample: `# Correct indentation
if True:
    print("This is indented correctly")
    if True:
        print("This is nested indentation")
    print("Back to first level")

# Function with proper indentation
def greet_user(name):
    if name:
        print(f"Hello, {name}!")
        if len(name) > 10:
            print("That's a long name!")
        else:
            print("Nice name!")
    else:
        print("Hello, Anonymous!")

# Class with proper indentation
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def study(self, subject):
        print(f"{self.name} is studying {subject}")
        if subject == "Python":
            print("Great choice!")

# Good practices for long lines
very_long_variable_name = (
    "This is a very long string that "
    "spans multiple lines for better "
    "readability"
)

# Function with many parameters
def complex_function(
    parameter_one,
    parameter_two,
    parameter_three,
    parameter_four
):
    return parameter_one + parameter_two

# List spanning multiple lines
fruits = [
    "apple",
    "banana", 
    "cherry",
    "date"
]`,
    difficulty: "beginner",
    categorySlug: "python-basics",
    xpReward: 10,
    estimatedMinutes: 4,
    tags: ["indentation", "structure", "formatting"],
  },

  // Data Structures Tips (6 tips)
  {
    title: "List Comprehensions: Pythonic Way to Create Lists",
    content:
      "List comprehensions provide a concise way to create lists. They're more readable and often faster than traditional for loops. The basic syntax is: [expression for item in iterable if condition]",
    codeExample: `# Traditional way with for loop
squares = []
for x in range(10):
    squares.append(x**2)

# List comprehension - more Pythonic!
squares = [x**2 for x in range(10)]

# With condition
even_squares = [x**2 for x in range(10) if x % 2 == 0]

# Nested loops
matrix = [[i*j for j in range(3)] for i in range(3)]

# Working with strings
words = ["hello", "world", "python", "programming"]
lengths = [len(word) for word in words]
uppercase = [word.upper() for word in words if len(word) > 5]

# Flattening nested lists
nested = [[1, 2], [3, 4], [5, 6]]
flattened = [item for sublist in nested for item in sublist]

# Complex example: processing data
students = [
    {"name": "Alice", "grade": 85},
    {"name": "Bob", "grade": 92},
    {"name": "Charlie", "grade": 78}
]
honor_students = [s["name"] for s in students if s["grade"] >= 80]`,
    difficulty: "intermediate",
    categorySlug: "data-structures",
    xpReward: 20,
    estimatedMinutes: 5,
    tags: ["lists", "comprehensions", "loops"],
  },
  {
    title: "Dictionary Tricks and Best Practices",
    content:
      "Dictionaries are one of Python's most powerful data structures. Here are some advanced techniques to work with them more effectively, including the get() method, dictionary comprehensions, and merging dictionaries.",
    codeExample: `# Safe access with get() method
user = {"name": "Alice", "age": 25}
email = user.get("email", "No email provided")  # Returns default if key missing

# Dictionary comprehensions
squares_dict = {x: x**2 for x in range(5)}
filtered_dict = {k: v for k, v in user.items() if k != "age"}

# Merging dictionaries (Python 3.9+)
dict1 = {"a": 1, "b": 2}
dict2 = {"c": 3, "d": 4}
merged = dict1 | dict2  # New in Python 3.9

# For older Python versions
merged_old = {**dict1, **dict2}

# setdefault() method
counts = {}
for char in "hello":
    counts.setdefault(char, 0)
    counts[char] += 1

# defaultdict from collections
from collections import defaultdict
dd = defaultdict(list)
dd['key'].append('value')  # No KeyError!

# Counter for counting items
from collections import Counter
text = "hello world"
letter_count = Counter(text)
print(letter_count.most_common(3))  # Top 3 most common`,
    difficulty: "intermediate",
    categorySlug: "data-structures",
    xpReward: 18,
    estimatedMinutes: 6,
    tags: ["dictionaries", "collections", "data-structures"],
  },
  {
    title: "Sets: Unique Collections and Set Operations",
    content:
      "Sets are unordered collections of unique elements. They're perfect for removing duplicates and performing mathematical set operations like union, intersection, and difference.",
    codeExample: `# Creating sets
numbers = {1, 2, 3, 4, 5}
empty_set = set()  # Note: {} creates a dict, not a set!

# Converting from list (removes duplicates)
duplicates = [1, 2, 2, 3, 3, 3, 4]
unique_numbers = set(duplicates)
print(unique_numbers)  # {1, 2, 3, 4}

# Set operations
set1 = {1, 2, 3, 4}
set2 = {3, 4, 5, 6}

# Union (all elements)
union = set1 | set2  # or set1.union(set2)
print(union)  # {1, 2, 3, 4, 5, 6}

# Intersection (common elements)
intersection = set1 & set2  # or set1.intersection(set2)
print(intersection)  # {3, 4}

# Difference (elements in set1 but not set2)
difference = set1 - set2  # or set1.difference(set2)
print(difference)  # {1, 2}

# Symmetric difference (elements in either set but not both)
sym_diff = set1 ^ set2  # or set1.symmetric_difference(set2)
print(sym_diff)  # {1, 2, 5, 6}

# Practical example: finding common interests
alice_interests = {"python", "machine learning", "data science", "cooking"}
bob_interests = {"python", "web development", "cooking", "travel"}
common = alice_interests & bob_interests
print(f"Common interests: {common}")`,
    difficulty: "intermediate",
    categorySlug: "data-structures",
    xpReward: 16,
    estimatedMinutes: 5,
    tags: ["sets", "unique", "operations"],
  },
  {
    title: "Tuples: Immutable Sequences",
    content:
      "Tuples are immutable sequences, making them perfect for storing data that shouldn't change. They're also hashable, so they can be used as dictionary keys.",
    codeExample: `# Creating tuples
coordinates = (10, 20)
single_item = (42,)  # Note the comma for single-item tuple
empty_tuple = ()

# Tuple unpacking
point = (3, 4)
x, y = point
print(f"x: {x}, y: {y}")

# Multiple assignment
name, age, city = ("Alice", 25, "New York")

# Swapping variables (using tuple unpacking)
a, b = 1, 2
a, b = b, a  # Now a=2, b=1

# Named tuples for better readability
from collections import namedtuple

Person = namedtuple('Person', ['name', 'age', 'city'])
alice = Person("Alice", 25, "New York")
print(alice.name)  # More readable than alice[0]
print(alice._asdict())  # Convert to dictionary

# Tuple as dictionary key
locations = {
    (0, 0): "Origin",
    (1, 0): "East",
    (0, 1): "North"
}

# Returning multiple values from function
def get_name_age():
    return "Bob", 30

name, age = get_name_age()

# Tuple methods
numbers = (1, 2, 3, 2, 4, 2)
print(numbers.count(2))  # 3
print(numbers.index(3))  # 2`,
    difficulty: "beginner",
    categorySlug: "data-structures",
    xpReward: 14,
    estimatedMinutes: 4,
    tags: ["tuples", "immutable", "unpacking"],
  },
  {
    title: "Working with Nested Data Structures",
    content:
      "Real-world data often comes in nested formats like lists of dictionaries or dictionaries containing lists. Learning to navigate and manipulate these structures is essential.",
    codeExample: `# Complex nested structure
company = {
    "name": "Tech Corp",
    "employees": [
        {
            "name": "Alice",
            "department": "Engineering",
            "skills": ["Python", "JavaScript", "SQL"],
            "projects": [
                {"name": "Web App", "status": "active"},
                {"name": "API", "status": "completed"}
            ]
        },
        {
            "name": "Bob", 
            "department": "Data Science",
            "skills": ["Python", "R", "Machine Learning"],
            "projects": [
                {"name": "ML Model", "status": "active"}
            ]
        }
    ]
}

# Accessing nested data
first_employee = company["employees"][0]
alice_skills = first_employee["skills"]
first_project = first_employee["projects"][0]["name"]

# Safe access with get()
def safe_get_nested(data, *keys):
    for key in keys:
        if isinstance(data, dict) and key in data:
            data = data[key]
        else:
            return None
    return data

# Usage: safely get Alice's first project status
status = safe_get_nested(company, "employees", 0, "projects", 0, "status")

# Finding data in nested structures
def find_employees_by_skill(company, skill):
    employees_with_skill = []
    for employee in company["employees"]:
        if skill in employee["skills"]:
            employees_with_skill.append(employee["name"])
    return employees_with_skill

python_developers = find_employees_by_skill(company, "Python")

# Flattening nested lists
all_skills = []
for employee in company["employees"]:
    all_skills.extend(employee["skills"])

# Remove duplicates
unique_skills = list(set(all_skills))

# Using list comprehension for the same result
all_skills_comp = [skill 
                  for employee in company["employees"] 
                  for skill in employee["skills"]]`,
    difficulty: "intermediate",
    categorySlug: "data-structures",
    xpReward: 22,
    estimatedMinutes: 7,
    tags: ["nested", "data-structures", "navigation"],
  },
  {
    title: "Slicing and Indexing Mastery",
    content:
      "Python's slicing syntax is powerful and flexible. Understanding advanced slicing techniques can make your code more concise and readable.",
    codeExample: `# Basic indexing
text = "Python Programming"
print(text[0])    # 'P' (first character)
print(text[-1])   # 'g' (last character)
print(text[-2])   # 'n' (second to last)

# Basic slicing [start:end:step]
print(text[0:6])    # 'Python' (characters 0-5)
print(text[7:])     # 'Programming' (from index 7 to end)
print(text[:6])     # 'Python' (from start to index 5)
print(text[:])      # 'Python Programming' (entire string)

# Step parameter
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
print(numbers[::2])    # [0, 2, 4, 6, 8] (every 2nd element)
print(numbers[1::2])   # [1, 3, 5, 7, 9] (every 2nd, starting from index 1)
print(numbers[::-1])   # [9, 8, 7, 6, 5, 4, 3, 2, 1, 0] (reverse)

# Advanced slicing tricks
# Reverse a string
reversed_text = text[::-1]

# Get last 3 characters
last_three = text[-3:]

# Remove first and last character
middle = text[1:-1]

# Extract every 3rd character starting from index 1
pattern = text[1::3]

# Slicing with negative step
# Get every 2nd character in reverse
reverse_every_second = text[::-2]

# Matrix slicing (2D lists)
matrix = [
    [1, 2, 3, 4],
    [5, 6, 7, 8], 
    [9, 10, 11, 12]
]

# Get first two rows
first_two_rows = matrix[:2]

# Get first two columns of all rows
first_two_cols = [row[:2] for row in matrix]

# Slice assignment (modifying lists)
numbers = [0, 1, 2, 3, 4, 5]
numbers[2:4] = [20, 30]  # Replace elements 2 and 3
print(numbers)  # [0, 1, 20, 30, 4, 5]`,
    difficulty: "intermediate",
    categorySlug: "data-structures",
    xpReward: 17,
    estimatedMinutes: 6,
    tags: ["slicing", "indexing", "sequences"],
  },

  // Functions & Modules Tips (5 tips)
  {
    title: "Function Parameters: *args and **kwargs Explained",
    content:
      "Understanding *args and **kwargs is crucial for writing flexible Python functions. *args allows a function to accept any number of positional arguments, while **kwargs allows any number of keyword arguments.",
    codeExample: `# Basic function with *args
def sum_all(*args):
    return sum(args)

print(sum_all(1, 2, 3, 4, 5))  # 15

# Function with **kwargs
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="Alice", age=30, city="New York")

# Combining both
def flexible_function(required_param, *args, **kwargs):
    print(f"Required: {required_param}")
    print(f"Extra positional args: {args}")
    print(f"Keyword args: {kwargs}")

flexible_function("Hello", 1, 2, 3, name="Bob", age=25)

# Unpacking arguments
numbers = [1, 2, 3, 4, 5]
print(sum_all(*numbers))  # Unpacking list

info = {"name": "Charlie", "age": 35}
print_info(**info)  # Unpacking dictionary

# Real-world example: API wrapper
def api_request(endpoint, method="GET", *args, **kwargs):
    print(f"Making {method} request to {endpoint}")
    print(f"Additional args: {args}")
    print(f"Parameters: {kwargs}")

api_request("/users", "POST", timeout=30, auth_token="abc123")`,
    difficulty: "advanced",
    categorySlug: "functions-modules",
    xpReward: 25,
    estimatedMinutes: 7,
    tags: ["functions", "parameters", "args", "kwargs"],
  },
  {
    title: "Lambda Functions and Functional Programming",
    content:
      "Lambda functions are small, anonymous functions that can have any number of arguments but can only have one expression. They're useful for short functions used with map(), filter(), and sort().",
    codeExample: `# Basic lambda function
square = lambda x: x ** 2
print(square(5))  # 25

# Lambda with multiple arguments
add = lambda x, y: x + y
print(add(3, 5))  # 8

# Using lambda with map()
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x ** 2, numbers))
print(squared)  # [1, 4, 9, 16, 25]

# Using lambda with filter()
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
print(even_numbers)  # [2, 4]

# Using lambda with sort()
students = [("Alice", 85), ("Bob", 92), ("Charlie", 78)]
# Sort by grade (second element)
students.sort(key=lambda student: student[1])
print(students)  # [('Charlie', 78), ('Alice', 85), ('Bob', 92)]

# Lambda in list comprehensions alternative
# Instead of: [lambda x: x ** 2 for x in range(5)]
# Use: [x ** 2 for x in range(5)]

# More complex example with sorted()
people = [
    {"name": "Alice", "age": 30},
    {"name": "Bob", "age": 25},
    {"name": "Charlie", "age": 35}
]

# Sort by age
sorted_by_age = sorted(people, key=lambda person: person["age"])

# When NOT to use lambda (prefer def for clarity)
# Bad: 
process = lambda data: [item.upper().strip() for item in data if len(item) > 3]

# Good:
def process_data(data):
    return [item.upper().strip() for item in data if len(item) > 3]`,
    difficulty: "intermediate",
    categorySlug: "functions-modules",
    xpReward: 20,
    estimatedMinutes: 6,
    tags: ["lambda", "functional-programming", "map", "filter"],
  },
  {
    title: "Decorators: Enhancing Functions",
    content:
      "Decorators are a powerful feature that allows you to modify or enhance functions and classes. They're widely used in frameworks like Flask and Django.",
    codeExample: `# Simple decorator
def my_decorator(func):
    def wrapper():
        print("Something before the function")
        func()
        print("Something after the function")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

say_hello()  # Output: Something before..., Hello!, Something after...

# Decorator with arguments
def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")  # Prints "Hello, Alice!" 3 times

# Preserving function metadata
import functools

def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

@timer
def slow_function():
    """A slow function for demonstration"""
    import time
    time.sleep(1)
    return "Done"

# Class decorators
def add_str_method(cls):
    def __str__(self):
        return f"{cls.__name__} instance"
    cls.__str__ = __str__
    return cls

@add_str_method
class MyClass:
    pass`,
    difficulty: "advanced",
    categorySlug: "functions-modules",
    xpReward: 28,
    estimatedMinutes: 8,
    tags: ["decorators", "functions", "advanced"],
  },
  {
    title: "Module Import Strategies and Best Practices",
    content:
      "Understanding different import strategies helps you write cleaner, more maintainable code. Learn when to use different import styles and how to organize your modules effectively.",
    codeExample: `# Different import styles
import math
import os as operating_system
from datetime import datetime, timedelta
from collections import defaultdict, Counter
from pathlib import Path

# Importing everything (generally discouraged)
# from math import *  # Don't do this!

# Relative imports (for packages)
# from . import sibling_module
# from ..parent import parent_module
# from .subpackage import module

# Dynamic imports
import importlib

def dynamic_import(module_name):
    try:
        module = importlib.import_module(module_name)
        return module
    except ImportError:
        print(f"Module {module_name} not found")
        return None

# Conditional imports
try:
    import numpy as np
    HAS_NUMPY = True
except ImportError:
    HAS_NUMPY = False
    print("NumPy not available")

# Creating an __init__.py file for a package
"""
# __init__.py example
from .core import main_function
from .utils import helper_function
from .constants import VERSION

__all__ = ['main_function', 'helper_function', 'VERSION']
"""

# Module search path
import sys
print("Python module search paths:")
for path in sys.path:
    print(f"  {path}")

# Adding custom paths
sys.path.insert(0, '/path/to/custom/modules')

# Lazy imports for performance
def get_heavy_library():
    import heavy_computation_library
    return heavy_computation_library

# Use only when needed
# heavy_lib = get_heavy_library()

# Creating a simple package structure
"""
my_package/
    __init__.py
    core.py
    utils.py
    subpackage/
        __init__.py
        advanced.py
"""`,
    difficulty: "intermediate",
    categorySlug: "functions-modules",
    xpReward: 22,
    estimatedMinutes: 6,
    tags: ["modules", "imports", "packages"],
  },
  {
    title: "Generators: Memory-Efficient Iteration",
    content:
      "Generators are functions that return an iterator object. They're memory-efficient because they generate values on-demand rather than storing all values in memory at once.",
    codeExample: `# Simple generator function
def countdown(n):
    while n > 0:
        yield n
        n -= 1

# Using the generator
for number in countdown(5):
    print(number)  # Prints 5, 4, 3, 2, 1

# Generator expressions (like list comprehensions)
squares = (x**2 for x in range(10))
print(next(squares))  # 0
print(next(squares))  # 1

# Infinite generator
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# Take first 10 Fibonacci numbers
fib = fibonacci()
first_ten = [next(fib) for _ in range(10)]
print(first_ten)  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

# Generator for reading large files
def read_large_file(file_path):
    with open(file_path, 'r') as file:
        for line in file:
            yield line.strip()

# Memory-efficient file processing
# for line in read_large_file('huge_file.txt'):
#     process(line)

# Generator with send() method
def accumulator():
    total = 0
    while True:
        value = yield total
        if value is not None:
            total += value

acc = accumulator()
next(acc)  # Prime the generator
print(acc.send(10))  # 10
print(acc.send(5))   # 15
print(acc.send(3))   # 18

# Pipeline of generators
def numbers():
    for i in range(10):
        yield i

def squares(nums):
    for num in nums:
        yield num ** 2

def evens(nums):
    for num in nums:
        if num % 2 == 0:
            yield num

# Chain generators together
pipeline = evens(squares(numbers()))
result = list(pipeline)  # [0, 4, 16, 36, 64]

# Generator vs List - memory comparison
import sys

# List (all values in memory)
list_comp = [x**2 for x in range(1000)]
print(f"List size: {sys.getsizeof(list_comp)} bytes")

# Generator (values created on demand)
gen_comp = (x**2 for x in range(1000))
print(f"Generator size: {sys.getsizeof(gen_comp)} bytes")`,
    difficulty: "intermediate",
    categorySlug: "functions-modules",
    xpReward: 24,
    estimatedMinutes: 7,
    tags: ["generators", "memory", "iteration", "yield"],
  },
  {
    title: "Function Annotations and Type Hints",
    content:
      "Type hints make your code more readable and help catch errors early. They're especially useful in larger codebases and when working with teams.",
    codeExample: `# Basic type hints
def greet(name: str, age: int) -> str:
    return f"Hello {name}, you are {age} years old"

def add_numbers(a: int, b: int) -> int:
    return a + b

# Type hints for complex types
from typing import List, Dict, Optional, Union, Tuple, Callable

def process_items(items: List[str]) -> Dict[str, int]:
    return {item: len(item) for item in items}

def get_user_info(user_id: int) -> Optional[Dict[str, str]]:
    # Returns user info dict or None if not found
    if user_id > 0:
        return {"name": "Alice", "email": "alice@example.com"}
    return None

# Union types (multiple possible types)
def process_id(user_id: Union[int, str]) -> str:
    return str(user_id)

# Function that takes another function
def apply_operation(
    numbers: List[int],
    operation: Callable[[int], int]
) -> List[int]:
    return [operation(num) for num in numbers]

# Example usage
def square(x: int) -> int:
    return x ** 2

result = apply_operation([1, 2, 3, 4], square)

# Class annotations
class Person:
    def __init__(self, name: str, age: int) -> None:
        self.name: str = name
        self.age: int = age
    
    def get_info(self) -> Dict[str, Union[str, int]]:
        return {"name": self.name, "age": self.age}

# Variable annotations
count: int = 0
names: List[str] = []
scores: Dict[str, float] = {}

# Generic types
from typing import TypeVar, Generic

T = TypeVar('T')

class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: List[T] = []
    
    def push(self, item: T) -> None:
        self._items.append(item)
    
    def pop(self) -> T:
        return self._items.pop()

# Using generics
string_stack: Stack[str] = Stack()
number_stack: Stack[int] = Stack()

# NewType for better type safety
from typing import NewType

UserId = NewType('UserId', int)

def get_user_name(user_id: UserId) -> str:
    return f"User {user_id}"

# Must explicitly create UserId
user_id = UserId(12345)
name = get_user_name(user_id)

# Type checking with mypy
# Install: pip install mypy
# Run: mypy your_script.py`,
    difficulty: "intermediate",
    categorySlug: "functions-modules",
    xpReward: 26,
    estimatedMinutes: 8,
    tags: ["type-hints", "annotations", "typing", "mypy"],
  },

  // Object-Oriented Programming Tips (5 tips)
  {
    title: "Classes and Objects Fundamentals",
    content:
      "Classes are blueprints for creating objects. They encapsulate data (attributes) and behavior (methods) into a single unit. Understanding the basics of class creation and object instantiation is fundamental to OOP in Python.",
    codeExample: `# Basic class definition
class Dog:
    # Class attribute (shared by all instances)
    species = "Canis lupus"
    
    def __init__(self, name, age, breed):
        # Instance attributes (unique to each object)
        self.name = name
        self.age = age
        self.breed = breed
    
    # Instance method
    def bark(self):
        return f"{self.name} says Woof!"
    
    def get_info(self):
        return f"{self.name} is a {self.age}-year-old {self.breed}"
    
    # Method with parameters
    def celebrate_birthday(self):
        self.age += 1
        return f"Happy birthday {self.name}! Now {self.age} years old."

# Creating objects (instances)
dog1 = Dog("Buddy", 3, "Golden Retriever")
dog2 = Dog("Max", 5, "German Shepherd")

# Accessing attributes
print(dog1.name)  # Buddy
print(dog1.species)  # Canis lupus

# Calling methods
print(dog1.bark())  # Buddy says Woof!
print(dog1.get_info())  # Buddy is a 3-year-old Golden Retriever

# Modifying attributes
dog1.age = 4
print(dog1.celebrate_birthday())  # Happy birthday Buddy! Now 5 years old.

# Class vs instance attributes
print(Dog.species)  # Accessing class attribute via class
Dog.species = "Domestic Dog"  # Modifying class attribute
print(dog1.species)  # Both instances see the change

# Instance attribute shadows class attribute
dog1.species = "Special Dog"
print(dog1.species)  # Special Dog (instance attribute)
print(dog2.species)  # Domestic Dog (class attribute)`,
    difficulty: "beginner",
    categorySlug: "oop",
    xpReward: 18,
    estimatedMinutes: 6,
    tags: ["classes", "objects", "methods", "attributes"],
  },
  {
    title: "Inheritance and Method Overriding",
    content:
      "Inheritance allows a class to inherit attributes and methods from another class. It promotes code reuse and establishes a hierarchical relationship between classes.",
    codeExample: `# Base class (parent)
class Animal:
    def __init__(self, name, species):
        self.name = name
        self.species = species
        self.is_alive = True
    
    def speak(self):
        return f"{self.name} makes a sound"
    
    def eat(self, food):
        return f"{self.name} eats {food}"
    
    def sleep(self):
        return f"{self.name} is sleeping"

# Derived class (child) - inherits from Animal
class Dog(Animal):
    def __init__(self, name, breed):
        # Call parent constructor
        super().__init__(name, "Canine")
        self.breed = breed
    
    # Method overriding
    def speak(self):
        return f"{self.name} barks: Woof!"
    
    # Additional method specific to Dog
    def fetch(self, item):
        return f"{self.name} fetches the {item}"

class Cat(Animal):
    def __init__(self, name, color):
        super().__init__(name, "Feline")
        self.color = color
    
    # Method overriding
    def speak(self):
        return f"{self.name} meows: Meow!"
    
    def climb(self):
        return f"{self.name} climbs up high"

# Using inheritance
dog = Dog("Rex", "Labrador")
cat = Cat("Whiskers", "Orange")

# Inherited methods
print(dog.eat("kibble"))  # Rex eats kibble
print(cat.sleep())  # Whiskers is sleeping

# Overridden methods
print(dog.speak())  # Rex barks: Woof!
print(cat.speak())  # Whiskers meows: Meow!

# Child-specific methods
print(dog.fetch("ball"))  # Rex fetches the ball
print(cat.climb())  # Whiskers climbs up high

# Multiple inheritance
class FlyingMixin:
    def fly(self):
        return f"{self.name} is flying"

class Bird(Animal, FlyingMixin):
    def __init__(self, name, wingspan):
        super().__init__(name, "Avian")
        self.wingspan = wingspan
    
    def speak(self):
        return f"{self.name} chirps"

eagle = Bird("Eagle", 200)
print(eagle.fly())  # Eagle is flying
print(eagle.speak())  # Eagle chirps

# Method Resolution Order (MRO)
print(Bird.__mro__)`,
    difficulty: "intermediate",
    categorySlug: "oop",
    xpReward: 24,
    estimatedMinutes: 8,
    tags: ["inheritance", "super", "overriding", "polymorphism"],
  },
  {
    title: "Properties and Encapsulation",
    content:
      "Properties provide a way to customize access to instance attributes. They allow you to define methods that can be accessed like attributes, enabling data validation and computed properties.",
    codeExample: `# Using properties for validation and computed values
class Temperature:
    def __init__(self, celsius=0):
        self._celsius = celsius
    
    @property
    def celsius(self):
        return self._celsius
    
    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Temperature cannot be below absolute zero")
        self._celsius = value
    
    @property
    def fahrenheit(self):
        return (self._celsius * 9/5) + 32
    
    @fahrenheit.setter
    def fahrenheit(self, value):
        self.celsius = (value - 32) * 5/9
    
    @property
    def kelvin(self):
        return self._celsius + 273.15

# Using properties
temp = Temperature(25)
print(f"Celsius: {temp.celsius}")     # 25
print(f"Fahrenheit: {temp.fahrenheit}")  # 77.0
print(f"Kelvin: {temp.kelvin}")       # 298.15

# Setting through property
temp.fahrenheit = 100
print(f"Celsius: {temp.celsius}")     # 37.777...

# Validation in action
try:
    temp.celsius = -300  # Raises ValueError
except ValueError as e:
    print(f"Error: {e}")

# Private attributes and name mangling
class BankAccount:
    def __init__(self, initial_balance=0):
        self.__balance = initial_balance  # Private attribute
        self._account_number = "12345"    # Protected (convention)
    
    @property
    def balance(self):
        return self.__balance
    
    def deposit(self, amount):
        if amount > 0:
            self.__balance += amount
            return f"Deposited {amount} dollars. New balance: {self.__balance} dollars"
        return "Invalid deposit amount"
    
    def withdraw(self, amount):
        if 0 < amount <= self.__balance:
            self.__balance -= amount
            return f"Withdrew {amount} dollars. New balance: {self.__balance} dollars"
        return "Insufficient funds or invalid amount"
    
    def __str__(self):
        return f"Account balance: {self.__balance} dollars"

account = BankAccount(1000)
print(account.balance)  # 1000
print(account.deposit(500))  # Deposited $500. New balance: $1500

# Cannot access private attribute directly
# print(account.__balance)  # AttributeError

# But can access via name mangling (not recommended)
print(account._BankAccount__balance)  # 1500

# Property with getter, setter, and deleter
class Person:
    def __init__(self, first_name, last_name):
        self.first_name = first_name
        self.last_name = last_name
        self._full_name = None
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @full_name.setter
    def full_name(self, value):
        names = value.split()
        if len(names) >= 2:
            self.first_name = names[0]
            self.last_name = " ".join(names[1:])
        else:
            raise ValueError("Full name must contain at least first and last name")
    
    @full_name.deleter
    def full_name(self):
        self.first_name = ""
        self.last_name = ""

person = Person("John", "Doe")
print(person.full_name)  # John Doe
person.full_name = "Jane Smith"
print(person.first_name)  # Jane
print(person.last_name)   # Smith`,
    difficulty: "intermediate",
    categorySlug: "oop",
    xpReward: 26,
    estimatedMinutes: 9,
    tags: ["properties", "encapsulation", "getters", "setters"],
  },
  {
    title: "Special Methods (Magic Methods)",
    content:
      "Special methods (dunder methods) allow your classes to integrate with Python's built-in functions and operators. They start and end with double underscores and define how objects behave with operators, comparisons, and built-in functions.",
    codeExample: `# Comprehensive example of special methods
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    # String representations
    def __str__(self):
        return f"Vector({self.x}, {self.y})"
    
    def __repr__(self):
        return f"Vector(x={self.x}, y={self.y})"
    
    # Arithmetic operations
    def __add__(self, other):
        if isinstance(other, Vector):
            return Vector(self.x + other.x, self.y + other.y)
        return NotImplemented
    
    def __sub__(self, other):
        if isinstance(other, Vector):
            return Vector(self.x - other.x, self.y - other.y)
        return NotImplemented
    
    def __mul__(self, scalar):
        if isinstance(scalar, (int, float)):
            return Vector(self.x * scalar, self.y * scalar)
        return NotImplemented
    
    def __rmul__(self, scalar):
        return self.__mul__(scalar)
    
    # Comparison operations
    def __eq__(self, other):
        if isinstance(other, Vector):
            return self.x == other.x and self.y == other.y
        return False
    
    def __lt__(self, other):
        if isinstance(other, Vector):
            return self.magnitude() < other.magnitude()
        return NotImplemented
    
    def __le__(self, other):
        return self < other or self == other
    
    # Length and boolean conversion
    def __len__(self):
        return int((self.x**2 + self.y**2)**0.5)
    
    def __bool__(self):
        return self.x != 0 or self.y != 0
    
    def magnitude(self):
        return (self.x**2 + self.y**2)**0.5
    
    # Container-like behavior
    def __getitem__(self, index):
        if index == 0:
            return self.x
        elif index == 1:
            return self.y
        else:
            raise IndexError("Vector index out of range")
    
    def __setitem__(self, index, value):
        if index == 0:
            self.x = value
        elif index == 1:
            self.y = value
        else:
            raise IndexError("Vector index out of range")

# Using the Vector class
v1 = Vector(3, 4)
v2 = Vector(1, 2)

# String representation
print(str(v1))   # Vector(3, 4)
print(repr(v1))  # Vector(x=3, y=4)

# Arithmetic
v3 = v1 + v2     # Vector(4, 6)
v4 = v1 * 2      # Vector(6, 8)
v5 = 3 * v1      # Vector(9, 12) - uses __rmul__

# Comparisons
print(v1 == v2)  # False
print(v1 < v2)   # False (based on magnitude)

# Built-in functions
print(len(v1))   # 5 (magnitude as int)
print(bool(Vector(0, 0)))  # False
print(bool(v1))  # True

# Container-like access
print(v1[0])     # 3 (x coordinate)
print(v1[1])     # 4 (y coordinate)
v1[0] = 5        # Set x to 5

# Context manager example
class FileManager:
    def __init__(self, filename, mode):
        self.filename = filename
        self.mode = mode
        self.file = None
    
    def __enter__(self):
        print(f"Opening {self.filename}")
        self.file = open(self.filename, self.mode)
        return self.file
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print(f"Closing {self.filename}")
        if self.file:
            self.file.close()
        return False  # Don't suppress exceptions

# Usage with 'with' statement
# with FileManager('test.txt', 'w') as f:
#     f.write('Hello, World!')`,
    difficulty: "advanced",
    categorySlug: "oop",
    xpReward: 30,
    estimatedMinutes: 10,
    tags: ["magic-methods", "dunder", "operators", "special-methods"],
  },
  {
    title: "Class Methods, Static Methods, and Metaclasses",
    content:
      "Understanding different types of methods and advanced class concepts like metaclasses helps you write more flexible and powerful object-oriented code.",
    codeExample: `# Class methods and static methods
class Person:
    population = 0
    
    def __init__(self, name, age):
        self.name = name
        self.age = age
        Person.population += 1
    
    # Instance method (regular method)
    def introduce(self):
        return f"Hi, I'm {self.name} and I'm {self.age} years old"
    
    # Class method - works with the class, not instance
    @classmethod
    def get_population(cls):
        return f"Total population: {cls.population}"
    
    @classmethod
    def create_baby(cls, name):
        return cls(name, 0)  # Alternative constructor
    
    # Static method - doesn't need class or instance
    @staticmethod
    def is_adult(age):
        return age >= 18
    
    @staticmethod
    def validate_name(name):
        return isinstance(name, str) and len(name) > 0

# Usage examples
person1 = Person("Alice", 25)
person2 = Person("Bob", 30)

# Instance method
print(person1.introduce())

# Class method
print(Person.get_population())  # Total population: 2

# Alternative constructor
baby = Person.create_baby("Charlie")
print(baby.introduce())  # Hi, I'm Charlie and I'm 0 years old

# Static methods
print(Person.is_adult(25))  # True
print(Person.validate_name("Alice"))  # True

# Abstract base classes
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass
    
    @abstractmethod
    def perimeter(self):
        pass
    
    # Concrete method
    def describe(self):
        return f"This is a shape with area {self.area()}"

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height
    
    def area(self):
        return self.width * self.height
    
    def perimeter(self):
        return 2 * (self.width + self.height)

# Cannot instantiate abstract class
# shape = Shape()  # TypeError

# Can instantiate concrete implementation
rect = Rectangle(5, 3)
print(rect.area())  # 15
print(rect.describe())  # This is a shape with area 15

# Simple metaclass example
class SingletonMeta(type):
    _instances = {}
    
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Database(metaclass=SingletonMeta):
    def __init__(self):
        self.connection = "Connected to database"
    
    def query(self, sql):
        return f"Executing: {sql}"

# Singleton behavior
db1 = Database()
db2 = Database()
print(db1 is db2)  # True - same instance

# Property decorator alternative
class Circle:
    def __init__(self, radius):
        self._radius = radius
    
    @property
    def radius(self):
        return self._radius
    
    @radius.setter
    def radius(self, value):
        if value <= 0:
            raise ValueError("Radius must be positive")
        self._radius = value
    
    @property
    def area(self):
        import math
        return math.pi * self._radius ** 2
    
    @property
    def diameter(self):
        return 2 * self._radius

circle = Circle(5)
print(f"Area: {circle.area:.2f}")  # Area: 78.54
print(f"Diameter: {circle.diameter}")  # Diameter: 10`,
    difficulty: "advanced",
    categorySlug: "oop",
    xpReward: 32,
    estimatedMinutes: 12,
    tags: ["classmethod", "staticmethod", "metaclass", "abc"],
  },

  // File Operations Tips (4 tips)
  {
    title: "File Reading and Writing Best Practices",
    content:
      "Python provides several ways to work with files. Understanding the different modes and best practices for file operations helps you handle data safely and efficiently.",
    codeExample: `# Basic file operations with context manager
# Reading files
with open('data.txt', 'r') as file:
    content = file.read()  # Read entire file
    print(content)

# Reading line by line (memory efficient for large files)
with open('data.txt', 'r') as file:
    for line in file:
        print(line.strip())  # Remove newline characters

# Reading all lines into a list
with open('data.txt', 'r') as file:
    lines = file.readlines()

# Reading specific number of characters
with open('data.txt', 'r') as file:
    chunk = file.read(100)  # Read first 100 characters

# Writing files
with open('output.txt', 'w') as file:
    file.write("Hello, World!\\n")
    file.write("This is a new line.")

# Appending to files
with open('output.txt', 'a') as file:
    file.write("\\nThis line is appended.")

# Writing multiple lines
lines_to_write = ["Line 1\\n", "Line 2\\n", "Line 3\\n"]
with open('output.txt', 'w') as file:
    file.writelines(lines_to_write)

# Different file modes
# 'r' - Read (default)
# 'w' - Write (overwrites existing file)
# 'a' - Append
# 'x' - Create (fails if file exists)
# 'b' - Binary mode (e.g., 'rb', 'wb')
# 't' - Text mode (default)
# '+' - Read and write (e.g., 'r+')

# Working with CSV files
import csv

# Writing CSV
data = [
    ['Name', 'Age', 'City'],
    ['Alice', '25', 'New York'],
    ['Bob', '30', 'San Francisco']
]

with open('people.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerows(data)

# Reading CSV
with open('people.csv', 'r') as file:
    reader = csv.reader(file)
    for row in reader:
        print(row)

# CSV with dictionaries
with open('people.csv', 'r') as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(f"Name: {row['Name']}, Age: {row['Age']}")

# Error handling
try:
    with open('nonexistent.txt', 'r') as file:
        content = file.read()
except FileNotFoundError:
    print("File not found!")
except PermissionError:
    print("Permission denied!")
except IOError:
    print("I/O error occurred!")`,
    difficulty: "beginner",
    categorySlug: "file-operations",
    xpReward: 16,
    estimatedMinutes: 6,
    tags: ["files", "reading", "writing", "csv"],
  },
  {
    title: "Working with Paths and Directories",
    content:
      "The pathlib module provides an object-oriented approach to working with file paths. It's more readable and cross-platform compatible than string operations.",
    codeExample: `# Using pathlib for better path handling
from pathlib import Path
import os
import shutil

# Creating Path objects
home = Path.home()  # User's home directory
current = Path.cwd()  # Current working directory
file_path = Path('data/files/document.txt')

# Path operations
print(f"Home directory: {home}")
print(f"Current directory: {current}")
print(f"File exists: {file_path.exists()}")
print(f"Is file: {file_path.is_file()}")
print(f"Is directory: {file_path.is_dir()}")

# Path components
file_path = Path('/home/user/documents/report.pdf')
print(f"Parent: {file_path.parent}")  # /home/user/documents
print(f"Name: {file_path.name}")      # report.pdf
print(f"Stem: {file_path.stem}")      # report
print(f"Suffix: {file_path.suffix}")  # .pdf
print(f"Parts: {file_path.parts}")    # ('/', 'home', 'user', 'documents', 'report.pdf')

# Joining paths (cross-platform)
base_dir = Path('projects')
sub_dir = base_dir / 'python' / 'scripts'
file_path = sub_dir / 'main.py'
print(file_path)  # projects/python/scripts/main.py

# Creating directories
new_dir = Path('new_project/src/utils')
new_dir.mkdir(parents=True, exist_ok=True)  # Create all parent directories

# Listing directory contents
data_dir = Path('.')
for item in data_dir.iterdir():
    if item.is_file():
        print(f"File: {item.name}")
    elif item.is_dir():
        print(f"Directory: {item.name}")

# Finding files with patterns
# Find all Python files
python_files = list(Path('.').rglob('*.py'))
for py_file in python_files:
    print(py_file)

# Find files with specific name pattern
config_files = list(Path('.').rglob('*config*'))

# Working with file metadata
file_path = Path('example.txt')
if file_path.exists():
    stat = file_path.stat()
    print(f"Size: {stat.st_size} bytes")
    print(f"Modified: {stat.st_mtime}")
    
# File operations
source = Path('source.txt')
destination = Path('backup/source_backup.txt')

# Copy file
destination.parent.mkdir(exist_ok=True)
shutil.copy2(source, destination)

# Move/rename file
old_name = Path('old_file.txt')
new_name = Path('new_file.txt')
if old_name.exists():
    old_name.rename(new_name)

# Delete file
temp_file = Path('temp.txt')
if temp_file.exists():
    temp_file.unlink()  # Delete file

# Delete directory
temp_dir = Path('temp_directory')
if temp_dir.exists():
    shutil.rmtree(temp_dir)  # Delete directory and contents

# Cross-platform path handling
# Don't do this: path = 'folder\\\\file.txt'  # Windows only
# Do this instead:
path = Path('folder') / 'file.txt'  # Works on all platforms

# Working with absolute and relative paths
relative_path = Path('data/file.txt')
absolute_path = relative_path.resolve()
print(f"Absolute path: {absolute_path}")`,
    difficulty: "intermediate",
    categorySlug: "file-operations",
    xpReward: 20,
    estimatedMinutes: 7,
    tags: ["pathlib", "directories", "file-system", "cross-platform"],
  },
  {
    title: "JSON and Configuration Files",
    content:
      "Working with JSON files is common in modern applications. Python's json module makes it easy to read, write, and manipulate JSON data for configuration files, APIs, and data storage.",
    codeExample: `import json
from pathlib import Path

# Basic JSON operations
data = {
    "name": "Alice",
    "age": 30,
    "skills": ["Python", "JavaScript", "SQL"],
    "is_active": True,
    "projects": [
        {"name": "Web App", "status": "completed"},
        {"name": "API", "status": "in_progress"}
    ]
}

# Writing JSON to file
with open('user_data.json', 'w') as file:
    json.dump(data, file, indent=2)

# Reading JSON from file
with open('user_data.json', 'r') as file:
    loaded_data = json.load(file)
    print(loaded_data["name"])  # Alice

# Converting to/from JSON strings
json_string = json.dumps(data, indent=2)
parsed_data = json.loads(json_string)

# Pretty printing JSON
print(json.dumps(data, indent=2, sort_keys=True))

# Configuration file management
class ConfigManager:
    def __init__(self, config_file='config.json'):
        self.config_file = Path(config_file)
        self.config = self.load_config()
    
    def load_config(self):
        if self.config_file.exists():
            with open(self.config_file, 'r') as file:
                return json.load(file)
        else:
            # Default configuration
            return {
                "database": {
                    "host": "localhost",
                    "port": 5432,
                    "name": "myapp"
                },
                "api": {
                    "base_url": "https://api.example.com",
                    "timeout": 30
                },
                "logging": {
                    "level": "INFO",
                    "file": "app.log"
                }
            }
    
    def save_config(self):
        with open(self.config_file, 'w') as file:
            json.dump(self.config, file, indent=2)
    
    def get(self, key_path, default=None):
        """Get nested configuration value using dot notation"""
        keys = key_path.split('.')
        value = self.config
        for key in keys:
            if isinstance(value, dict) and key in value:
                value = value[key]
            else:
                return default
        return value
    
    def set(self, key_path, value):
        """Set nested configuration value using dot notation"""
        keys = key_path.split('.')
        config = self.config
        for key in keys[:-1]:
            if key not in config:
                config[key] = {}
            config = config[key]
        config[keys[-1]] = value
        self.save_config()

# Using the configuration manager
config = ConfigManager()
print(config.get('database.host'))  # localhost
config.set('database.host', 'production-server')

# Handling JSON errors
def safe_json_load(file_path):
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"File {file_path} not found")
        return None
    except json.JSONDecodeError as e:
        print(f"Invalid JSON in {file_path}: {e}")
        return None

# Working with nested JSON data
nested_data = {
    "users": [
        {
            "id": 1,
            "profile": {
                "personal": {
                    "name": "Alice",
                    "email": "alice@example.com"
                },
                "preferences": {
                    "theme": "dark",
                    "notifications": True
                }
            }
        }
    ]
}

# Safely accessing nested data
def get_nested_value(data, keys, default=None):
    for key in keys:
        if isinstance(data, dict) and key in data:
            data = data[key]
        elif isinstance(data, list) and isinstance(key, int) and 0 <= key < len(data):
            data = data[key]
        else:
            return default
    return data

# Usage
user_name = get_nested_value(nested_data, ["users", 0, "profile", "personal", "name"])
print(user_name)  # Alice

# Custom JSON encoder for special types
import datetime

class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        return super().default(obj)

# Using custom encoder
data_with_datetime = {
    "timestamp": datetime.datetime.now(),
    "message": "Hello World"
}

json_str = json.dumps(data_with_datetime, cls=DateTimeEncoder)
print(json_str)`,
    difficulty: "intermediate",
    categorySlug: "file-operations",
    xpReward: 22,
    estimatedMinutes: 8,
    tags: ["json", "configuration", "data-storage", "serialization"],
  },
  {
    title: "Binary Files and Advanced File Operations",
    content:
      "Working with binary files, handling large files efficiently, and performing advanced file operations like compression and encryption are important skills for real-world applications.",
    codeExample: `# Binary file operations
import pickle
import gzip
import zipfile
import tarfile
from pathlib import Path

# Working with binary files
# Writing binary data
binary_data = b'\\x89PNG\\r\\n\\x1a\\n'  # PNG file signature
with open('test.bin', 'wb') as file:
    file.write(binary_data)

# Reading binary data
with open('test.bin', 'rb') as file:
    data = file.read()
    print(f"Read {len(data)} bytes")

# Pickling (serializing Python objects)
data_to_pickle = {
    'numbers': [1, 2, 3, 4, 5],
    'text': 'Hello, World!',
    'nested': {'key': 'value'}
}

# Save object to file
with open('data.pickle', 'wb') as file:
    pickle.dump(data_to_pickle, file)

# Load object from file
with open('data.pickle', 'rb') as file:
    loaded_data = pickle.load(file)
    print(loaded_data)

# Working with compressed files
# Gzip compression
text_data = "This is some text that will be compressed." * 100

# Compress and save
with gzip.open('compressed.txt.gz', 'wt') as file:
    file.write(text_data)

# Read compressed file
with gzip.open('compressed.txt.gz', 'rt') as file:
    decompressed = file.read()

# ZIP file operations
# Creating a ZIP file
with zipfile.ZipFile('archive.zip', 'w') as zip_file:
    zip_file.write('file1.txt')
    zip_file.write('file2.txt')
    # Add file with different name in archive
    zip_file.write('source.txt', 'renamed_in_zip.txt')

# Reading from ZIP file
with zipfile.ZipFile('archive.zip', 'r') as zip_file:
    # List contents
    for file_info in zip_file.filelist:
        print(f"File: {file_info.filename}, Size: {file_info.file_size}")
    
    # Extract all files
    zip_file.extractall('extracted_files/')
    
    # Extract specific file
    zip_file.extract('file1.txt', 'specific_extraction/')
    
    # Read file directly from ZIP
    with zip_file.open('file1.txt') as file:
        content = file.read().decode('utf-8')

# Large file processing (memory efficient)
def process_large_file(file_path, chunk_size=1024*1024):  # 1MB chunks
    """Process large file in chunks to avoid memory issues"""
    total_size = 0
    line_count = 0
    
    with open(file_path, 'r') as file:
        while True:
            chunk = file.read(chunk_size)
            if not chunk:
                break
            
            total_size += len(chunk)
            line_count += chunk.count('\\n')
    
    return total_size, line_count

# File locking (platform dependent)
import fcntl  # Unix/Linux only
import msvcrt  # Windows only

def lock_file_unix(file_obj):
    """Lock file on Unix/Linux systems"""
    try:
        fcntl.flock(file_obj.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
        return True
    except (IOError, OSError):
        return False

def lock_file_windows(file_obj):
    """Lock file on Windows systems"""
    try:
        msvcrt.locking(file_obj.fileno(), msvcrt.LK_NBLCK, 1)
        return True
    except (IOError, OSError):
        return False

# Temporary files
import tempfile

# Create temporary file
with tempfile.NamedTemporaryFile(mode='w', delete=False) as temp_file:
    temp_file.write("Temporary data")
    temp_file_path = temp_file.name

# Use temporary directory
with tempfile.TemporaryDirectory() as temp_dir:
    temp_path = Path(temp_dir)
    (temp_path / 'temp_file.txt').write_text("Temporary file in temp directory")
    # Directory and contents automatically deleted when exiting context

# File monitoring and watching
import time
import hashlib

def file_changed(file_path, last_hash=None):
    """Check if file has changed by comparing hash"""
    try:
        with open(file_path, 'rb') as file:
            content = file.read()
            current_hash = hashlib.md5(content).hexdigest()
            return current_hash != last_hash, current_hash
    except FileNotFoundError:
        return False, None

# Memory mapping for large files
import mmap

def search_in_large_file(file_path, search_term):
    """Search in large file using memory mapping"""
    with open(file_path, 'rb') as file:
        with mmap.mmap(file.fileno(), 0, access=mmap.ACCESS_READ) as mmapped_file:
            index = mmapped_file.find(search_term.encode())
            return index if index != -1 else None

# Atomic file operations
def atomic_write(file_path, content):
    """Write file atomically to prevent corruption"""
    temp_path = f"{file_path}.tmp"
    try:
        with open(temp_path, 'w') as temp_file:
            temp_file.write(content)
        
        # Atomic rename (platform dependent)
        Path(temp_path).rename(file_path)
    except Exception:
        # Clean up temporary file if operation fails
        Path(temp_path).unlink(missing_ok=True)
        raise`,
    difficulty: "advanced",
    categorySlug: "file-operations",
    xpReward: 28,
    estimatedMinutes: 10,
    tags: ["binary", "compression", "pickle", "large-files", "advanced"],
  },

  // Best Practices Tips (5 tips)
  {
    title: "Code Style and PEP 8 Guidelines",
    content:
      "PEP 8 is the official style guide for Python code. Following these conventions makes your code more readable and consistent with the Python community standards.",
    codeExample: `# Good naming conventions
class UserManager:  # Class names: CapWords
    def __init__(self):
        self.user_count = 0  # Instance variables: lowercase_with_underscores
    
    def get_user_info(self, user_id):  # Function names: lowercase_with_underscores
        """Get user information by ID."""  # Docstrings for functions
        return f"User {user_id}"

# Constants
MAX_CONNECTIONS = 100  # Constants: UPPERCASE_WITH_UNDERSCORES
DEFAULT_TIMEOUT = 30

# Good indentation and spacing
def calculate_total(items, tax_rate=0.08, discount=0.0):
    """
    Calculate total with tax and discount.
    
    Args:
        items (list): List of item prices
        tax_rate (float): Tax rate (default 0.08)
        discount (float): Discount rate (default 0.0)
    
    Returns:
        float: Total amount after tax and discount
    """
    subtotal = sum(items)
    discounted_total = subtotal * (1 - discount)
    total_with_tax = discounted_total * (1 + tax_rate)
    return round(total_with_tax, 2)

# Line length (max 79 characters for code, 72 for comments)
def long_function_name(
    parameter_one, parameter_two, parameter_three,
    parameter_four, parameter_five
):
    return parameter_one + parameter_two

# Imports organization
# 1. Standard library imports
import os
import sys
from pathlib import Path

# 2. Related third party imports
import requests
import numpy as np

# 3. Local application/library specific imports
from myproject.utils import helper_function
from myproject.models import User

# Good use of whitespace
# Yes:
if x == 4:
    print(x, y)
    x, y = y, x

# No:
# if x == 4 : print x , y ; x , y = y , x

# List comprehensions vs traditional loops
# Good - simple and readable
squares = [x**2 for x in range(10)]

# Bad - too complex for list comprehension
# result = [complicated_function(x) for x in items if complex_condition(x)]

# Better - use regular loop for complex logic
result = []
for x in items:
    if complex_condition(x):
        result.append(complicated_function(x))

# Avoid lambda for complex operations
# Good
def is_adult(person):
    return person.age >= 18

adults = filter(is_adult, people)

# Bad
# adults = filter(lambda p: p.age >= 18 and p.status == 'active', people)

# String quotes consistency
message = "Use double quotes for strings"
char = 'a'  # Single quotes for single characters
sql_query = '''
SELECT * FROM users
WHERE name = "John"
'''  # Triple quotes for multi-line strings`,
    difficulty: "beginner",
    categorySlug: "best-practices",
    xpReward: 15,
    estimatedMinutes: 5,
    tags: ["pep8", "style", "conventions", "readability"],
  },
  {
    title: "Error Handling and Exception Management",
    content:
      "Proper error handling makes your code more robust and user-friendly. Understanding when and how to use exceptions helps prevent crashes and provides meaningful error messages.",
    codeExample: `# Basic exception handling
try:
    result = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")
except Exception as e:
    print(f"Unexpected error: {e}")
else:
    print(f"Result: {result}")  # Runs if no exception
finally:
    print("This always runs")  # Cleanup code

# Specific exception handling
def process_user_input(user_input):
    try:
        # Try to convert input to integer
        number = int(user_input)
        
        # Try to perform calculation
        result = 100 / number
        
        return result
        
    except ValueError:
        raise ValueError(f"'{user_input}' is not a valid number")
    except ZeroDivisionError:
        raise ValueError("Number cannot be zero")
    except Exception as e:
        # Log unexpected errors
        print(f"Unexpected error processing '{user_input}': {e}")
        raise

# Custom exceptions
class ValidationError(Exception):
    """Raised when data validation fails"""
    pass

class DatabaseError(Exception):
    """Raised when database operations fail"""
    def __init__(self, message, error_code=None):
        super().__init__(message)
        self.error_code = error_code

# Using custom exceptions
def validate_email(email):
    if '@' not in email:
        raise ValidationError(f"Invalid email format: {email}")
    return True

def save_user(user_data):
    try:
        validate_email(user_data['email'])
        # Simulate database save
        if not user_data.get('name'):
            raise DatabaseError("Name is required", error_code="MISSING_NAME")
        print("User saved successfully")
    except ValidationError as e:
        print(f"Validation failed: {e}")
    except DatabaseError as e:
        print(f"Database error ({e.error_code}): {e}")

# Context managers for resource management
class DatabaseConnection:
    def __enter__(self):
        print("Connecting to database...")
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Closing database connection...")
        if exc_type:
            print(f"Exception occurred: {exc_val}")
        return False  # Don't suppress exceptions

# Using context manager
try:
    with DatabaseConnection() as db:
        # Database operations here
        # Connection automatically closed even if exception occurs
        pass
except Exception as e:
    print(f"Database operation failed: {e}")

# Logging instead of print statements
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

def risky_operation():
    try:
        # Some risky operation
        logger.info("Starting risky operation")
        result = complex_calculation()
        logger.info("Operation completed successfully")
        return result
    except Exception as e:
        logger.error(f"Operation failed: {e}", exc_info=True)
        raise

# Graceful degradation
def get_user_preferences(user_id):
    try:
        # Try to get from cache first
        return cache.get(f"user_prefs_{user_id}")
    except CacheError:
        logger.warning("Cache unavailable, fetching from database")
        try:
            return database.get_user_preferences(user_id)
        except DatabaseError:
            logger.error("Database unavailable, using defaults")
            return get_default_preferences()

# Assertion for debugging (not for production error handling)
def calculate_area(width, height):
    assert width > 0, "Width must be positive"
    assert height > 0, "Height must be positive"
    return width * height

# Don't catch exceptions just to re-raise
# Bad:
# try:
#     risky_function()
# except Exception as e:
#     raise e

# Good - let it propagate or handle meaningfully:
# risky_function()  # Or handle the specific exception`,
    difficulty: "intermediate",
    categorySlug: "best-practices",
    xpReward: 22,
    estimatedMinutes: 7,
    tags: ["exceptions", "error-handling", "logging", "debugging"],
  },
  {
    title: "Code Organization and Project Structure",
    content:
      "Organizing your code into logical modules and packages makes it maintainable, testable, and reusable. Good project structure follows established conventions.",
    codeExample: `# Recommended project structure
"""
my_project/
├── README.md
├── requirements.txt
├── setup.py
├── .gitignore
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_utils.py
│   └── test_integration.py
├── docs/
│   ├── api.md
│   └── user_guide.md
├── my_project/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── product.py
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── helpers.py
│   │   └── validators.py
│   └── api/
│       ├── __init__.py
│       ├── routes.py
│       └── handlers.py
└── scripts/
    ├── setup_db.py
    └── migrate_data.py
"""

# __init__.py files for packages
# my_project/__init__.py
"""
Main package initialization.
"""
__version__ = "1.0.0"
__author__ = "Your Name"

from .main import main_function
from .config import settings

# models/__init__.py
from .user import User
from .product import Product

__all__ = ['User', 'Product']

# Configuration management
# config.py
import os
from pathlib import Path

class Config:
    """Base configuration"""
    BASE_DIR = Path(__file__).parent
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')
    DEBUG = False
    
class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    DATABASE_URL = 'sqlite:///dev.db'
    
class ProductionConfig(Config):
    """Production configuration"""
    DATABASE_URL = os.environ.get('DATABASE_URL')
    
class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DATABASE_URL = 'sqlite:///:memory:'

# Configuration factory
def get_config():
    env = os.environ.get('FLASK_ENV', 'development')
    if env == 'production':
        return ProductionConfig()
    elif env == 'testing':
        return TestingConfig()
    else:
        return DevelopmentConfig()

# Modular code organization
# models/user.py
from dataclasses import dataclass
from typing import Optional, List

@dataclass
class User:
    """User model with validation"""
    id: int
    username: str
    email: str
    is_active: bool = True
    
    def __post_init__(self):
        self.validate()
    
    def validate(self):
        if not self.username or len(self.username) < 3:
            raise ValueError("Username must be at least 3 characters")
        if '@' not in self.email:
            raise ValueError("Invalid email format")
    
    @classmethod
    def create(cls, username: str, email: str) -> 'User':
        """Factory method to create user"""
        # Generate ID (in real app, this would be from database)
        user_id = hash(username) % 10000
        return cls(id=user_id, username=username, email=email)

# utils/helpers.py
from typing import Any, Dict, List
import json

def safe_get(dictionary: Dict[str, Any], key: str, default: Any = None) -> Any:
    """Safely get value from dictionary"""
    return dictionary.get(key, default)

def load_json_file(file_path: str) -> Dict[str, Any]:
    """Load JSON file with error handling"""
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error loading {file_path}: {e}")
        return {}

def chunk_list(lst: List[Any], chunk_size: int) -> List[List[Any]]:
    """Split list into chunks of specified size"""
    return [lst[i:i + chunk_size] for i in range(0, len(lst), chunk_size)]

# main.py - entry point
import sys
from pathlib import Path

# Add project root to Python path
sys.path.insert(0, str(Path(__file__).parent.parent))

from my_project.config import get_config
from my_project.models import User
from my_project.utils.helpers import load_json_file

def main():
    """Main application entry point"""
    config = get_config()
    print(f"Starting application in {config.__class__.__name__} mode")
    
    # Application logic here
    user = User.create("alice", "alice@example.com")
    print(f"Created user: {user}")

if __name__ == "__main__":
    main()

# setup.py for package distribution
from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="my-project",
    version="1.0.0",
    author="Your Name",
    author_email="your.email@example.com",
    description="A short description of your project",
    long_description=long_description,
    long_description_content_type="text/markdown",
    packages=find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.8",
    install_requires=[
        "requests>=2.25.0",
        "click>=8.0.0",
    ],
    entry_points={
        "console_scripts": [
            "my-project=my_project.main:main",
        ],
    },
)`,
    difficulty: "intermediate",
    categorySlug: "best-practices",
    xpReward: 24,
    estimatedMinutes: 8,
    tags: ["organization", "structure", "modules", "packages"],
  },
  {
    title: "Performance Best Practices",
    content:
      "Writing efficient Python code requires understanding performance implications of different approaches. Small changes can lead to significant performance improvements.",
    codeExample: `# List comprehensions vs traditional loops
import time

# Timing decorator
def timing_decorator(func):
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

# List comprehensions are faster
@timing_decorator
def traditional_loop():
    result = []
    for i in range(100000):
        if i % 2 == 0:
            result.append(i ** 2)
    return result

@timing_decorator
def list_comprehension():
    return [i ** 2 for i in range(100000) if i % 2 == 0]

# Generator expressions for memory efficiency
@timing_decorator
def generator_expression():
    return (i ** 2 for i in range(100000) if i % 2 == 0)

# Using built-in functions (often implemented in C)
@timing_decorator
def using_map_filter():
    evens = filter(lambda x: x % 2 == 0, range(100000))
    return list(map(lambda x: x ** 2, evens))

# String concatenation optimization
# Slow - creates new string each time
@timing_decorator
def slow_string_concat():
    result = ""
    for i in range(1000):
        result += f"Number {i} "
    return result

# Fast - join is optimized for string concatenation
@timing_decorator
def fast_string_concat():
    parts = []
    for i in range(1000):
        parts.append(f"Number {i} ")
    return "".join(parts)

# Even better - direct list comprehension with join
@timing_decorator
def fastest_string_concat():
    return " ".join(f"Number {i}" for i in range(1000))

# Dictionary vs list for lookups
@timing_decorator
def list_lookup():
    items = list(range(10000))
    return 9999 in items  # O(n) operation

@timing_decorator
def dict_lookup():
    items = {i: True for i in range(10000)}
    return 9999 in items  # O(1) operation

# Set operations for unique items
@timing_decorator
def list_unique():
    items = [1, 2, 3, 4, 5] * 1000
    unique = []
    for item in items:
        if item not in unique:
            unique.append(item)
    return unique

@timing_decorator
def set_unique():
    items = [1, 2, 3, 4, 5] * 1000
    return list(set(items))

# Local variable access is faster
@timing_decorator
def global_access():
    total = 0
    for i in range(100000):
        total += len(str(i))  # Global function lookup each time
    return total

@timing_decorator
def local_access():
    str_func = str  # Local reference
    len_func = len
    total = 0
    for i in range(100000):
        total += len_func(str_func(i))
    return total

# Using collections.defaultdict vs dict.setdefault
from collections import defaultdict

@timing_decorator
def using_setdefault():
    counter = {}
    for i in range(10000):
        key = i % 100
        counter.setdefault(key, 0)
        counter[key] += 1
    return counter

@timing_decorator
def using_defaultdict():
    counter = defaultdict(int)
    for i in range(10000):
        key = i % 100
        counter[key] += 1
    return dict(counter)

# Memory-efficient iteration
def memory_efficient_processing(large_dataset):
    """Process large dataset without loading everything into memory"""
    
    # Instead of loading all data
    # data = [expensive_operation(item) for item in large_dataset]
    
    # Use generator for lazy evaluation
    processed_data = (expensive_operation(item) for item in large_dataset)
    
    # Process one item at a time
    results = []
    for item in processed_data:
        if meets_criteria(item):
            results.append(item)
        
        # Optional: limit memory usage
        if len(results) > 1000:
            yield results
            results = []
    
    if results:
        yield results

def expensive_operation(item):
    return item ** 2

def meets_criteria(item):
    return item > 100

# Caching for expensive computations
from functools import lru_cache

@lru_cache(maxsize=128)
def expensive_fibonacci(n):
    if n < 2:
        return n
    return expensive_fibonacci(n-1) + expensive_fibonacci(n-2)

# Without cache: fibonacci(30) takes long time
# With cache: subsequent calls are instant

# Profile your code
import cProfile
import pstats

def profile_function(func, *args, **kwargs):
    """Profile a function to identify bottlenecks"""
    profiler = cProfile.Profile()
    profiler.enable()
    
    result = func(*args, **kwargs)
    
    profiler.disable()
    stats = pstats.Stats(profiler)
    stats.sort_stats('cumulative')
    stats.print_stats(10)  # Show top 10 functions
    
    return result

# Memory profiling with memory_profiler
# pip install memory-profiler
# @profile
# def memory_intensive_function():
#     big_list = [i for i in range(1000000)]
#     return sum(big_list)

# Run with: python -m memory_profiler your_script.py`,
    difficulty: "advanced",
    categorySlug: "best-practices",
    xpReward: 28,
    estimatedMinutes: 10,
    tags: ["performance", "optimization", "efficiency", "profiling"],
  },
  {
    title: "Security Best Practices",
    content:
      "Writing secure Python code requires awareness of common vulnerabilities and implementing proper security measures. Security should be considered from the beginning of development.",
    codeExample: `# Input validation and sanitization
import re
import hashlib
import secrets
import hmac
from pathlib import Path

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def sanitize_filename(filename):
    """Sanitize filename to prevent directory traversal"""
    # Remove path separators and dangerous characters
    sanitized = re.sub(r'[<>:"/\\|?*]', '', filename)
    sanitized = sanitized.replace('..', '')
    return sanitized[:255]  # Limit length

def validate_user_input(user_input, max_length=1000):
    """Basic input validation"""
    if not isinstance(user_input, str):
        raise ValueError("Input must be a string")
    
    if len(user_input) > max_length:
        raise ValueError(f"Input too long (max {max_length} characters)")
    
    # Remove potentially dangerous characters
    dangerous_chars = ['<', '>', '"', "'", '&', '%', ';']
    for char in dangerous_chars:
        if char in user_input:
            raise ValueError(f"Invalid character detected: {char}")
    
    return user_input.strip()

# Password security
class PasswordManager:
    @staticmethod
    def hash_password(password: str) -> tuple:
        """Hash password with salt"""
        # Generate random salt
        salt = secrets.token_hex(16)
        
        # Hash password with salt
        password_hash = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            100000  # Number of iterations
        )
        
        return salt, password_hash.hex()
    
    @staticmethod
    def verify_password(password: str, salt: str, stored_hash: str) -> bool:
        """Verify password against stored hash"""
        password_hash = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        )
        
        return hmac.compare_digest(password_hash.hex(), stored_hash)
    
    @staticmethod
    def generate_secure_password(length=12):
        """Generate cryptographically secure password"""
        alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
        return ''.join(secrets.choice(alphabet) for _ in range(length))

# Secure file operations
def secure_file_read(file_path, allowed_extensions=None):
    """Securely read file with validation"""
    path = Path(file_path)
    
    # Validate file extension
    if allowed_extensions and path.suffix.lower() not in allowed_extensions:
        raise ValueError(f"File type not allowed: {path.suffix}")
    
    # Prevent directory traversal
    if '..' in str(path) or path.is_absolute():
        raise ValueError("Invalid file path")
    
    # Check if file exists and is a file
    if not path.exists() or not path.is_file():
        raise FileNotFoundError("File not found")
    
    # Read file safely
    try:
        with open(path, 'r', encoding='utf-8') as file:
            return file.read()
    except UnicodeDecodeError:
        raise ValueError("File contains invalid characters")

# SQL injection prevention (using parameterized queries)
import sqlite3

class SafeDatabase:
    def __init__(self, db_path):
        self.connection = sqlite3.connect(db_path)
        self.cursor = self.connection.cursor()
    
    def get_user_by_id(self, user_id):
        """Safe database query using parameterized statements"""
        # Safe - uses parameterized query
        query = "SELECT * FROM users WHERE id = ?"
        self.cursor.execute(query, (user_id,))
        return self.cursor.fetchone()
    
    def search_users(self, name_pattern):
        """Safe search with LIKE parameter"""
        # Safe - parameterized LIKE query
        query = "SELECT * FROM users WHERE name LIKE ?"
        self.cursor.execute(query, (f"%{name_pattern}%",))
        return self.cursor.fetchall()
    
    def unsafe_query(self, user_input):
        """NEVER DO THIS - vulnerable to SQL injection"""
        # Dangerous - string formatting
        # query = f"SELECT * FROM users WHERE name = '{user_input}'"
        # self.cursor.execute(query)
        
        # This would allow: user_input = "'; DROP TABLE users; --"
        raise NotImplementedError("This method demonstrates unsafe practices")

# Environment variables for sensitive data
import os

def get_secret(secret_name, default=None):
    """Get secret from environment variables"""
    secret = os.environ.get(secret_name, default)
    if secret is None:
        raise ValueError(f"Required secret '{secret_name}' not found")
    return secret

# Configuration class with security considerations
class SecureConfig:
    def __init__(self):
        # Never hardcode secrets!
        self.database_url = get_secret('DATABASE_URL')
        self.api_key = get_secret('API_KEY')
        self.secret_key = get_secret('SECRET_KEY')
        
        # Public configuration
        self.debug = os.environ.get('DEBUG', 'False').lower() == 'true'
        self.max_upload_size = int(os.environ.get('MAX_UPLOAD_SIZE', '10485760'))  # 10MB

# Secure random token generation
def generate_secure_token(length=32):
    """Generate cryptographically secure random token"""
    return secrets.token_urlsafe(length)

def generate_csrf_token():
    """Generate CSRF token"""
    return secrets.token_hex(16)

# Rate limiting helper
import time
from collections import defaultdict

class RateLimiter:
    def __init__(self, max_requests=100, window_seconds=3600):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)
    
    def is_allowed(self, identifier):
        """Check if request is within rate limit"""
        now = time.time()
        window_start = now - self.window_seconds
        
        # Clean old requests
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier]
            if req_time > window_start
        ]
        
        # Check if under limit
        if len(self.requests[identifier]) < self.max_requests:
            self.requests[identifier].append(now)
            return True
        
        return False

# Data validation with type hints
from typing import Union, Optional
import json

def safe_json_loads(data: str) -> Union[dict, list]:
    """Safely parse JSON with validation"""
    try:
        parsed = json.loads(data)
        if not isinstance(parsed, (dict, list)):
            raise ValueError("JSON must be object or array")
        return parsed
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON: {e}")

# Logging security events
import logging

security_logger = logging.getLogger('security')
security_logger.setLevel(logging.WARNING)

def log_security_event(event_type, details, user_id=None):
    """Log security-related events"""
    security_logger.warning(
        f"Security Event: {event_type} | User: {user_id} | Details: {details}"
    )

# Example usage
def login_attempt(username, password, ip_address):
    """Example secure login function"""
    rate_limiter = RateLimiter(max_requests=5, window_seconds=300)  # 5 attempts per 5 minutes
    
    if not rate_limiter.is_allowed(ip_address):
        log_security_event("RATE_LIMIT_EXCEEDED", f"IP: {ip_address}")
        raise ValueError("Too many login attempts")
    
    # Validate input
    username = validate_user_input(username, max_length=50)
    
    # Check credentials (using secure password verification)
    # ... password verification logic ...
    
    log_security_event("LOGIN_ATTEMPT", f"Username: {username}, IP: {ip_address}")`,
    difficulty: "advanced",
    categorySlug: "best-practices",
    xpReward: 30,
    estimatedMinutes: 12,
    tags: ["security", "validation", "encryption", "authentication"],
  },

  // Web Development Tips (4 tips)
  {
    title: "Flask Fundamentals for Web Development",
    content:
      "Flask is a lightweight and flexible Python web framework. Understanding Flask basics helps you build web applications and APIs quickly and efficiently.",
    codeExample: `# Basic Flask application
from flask import Flask, request, jsonify, render_template
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Basic route
@app.route('/')
def home():
    return '<h1>Welcome to Flask!</h1>'

# Route with parameters
@app.route('/user/<username>')
def user_profile(username):
    return f'<h1>User: {username}</h1>'

# Route with multiple HTTP methods
@app.route('/api/users', methods=['GET', 'POST'])
def users():
    if request.method == 'GET':
        # Return all users
        users = [
            {'id': 1, 'name': 'Alice'},
            {'id': 2, 'name': 'Bob'}
        ]
        return jsonify(users)
    
    elif request.method == 'POST':
        # Create new user
        data = request.get_json()
        new_user = {
            'id': 3,
            'name': data.get('name', 'Unknown')
        }
        return jsonify(new_user), 201

# Query parameters
@app.route('/search')
def search():
    query = request.args.get('q', '')
    category = request.args.get('category', 'all')
    
    results = {
        'query': query,
        'category': category,
        'results': ['item1', 'item2', 'item3']
    }
    return jsonify(results)

# Error handling
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# Before request middleware
@app.before_request
def before_request():
    print(f"Request: {request.method} {request.url}")

# Template rendering
@app.route('/profile/<username>')
def profile(username):
    user_data = {
        'username': username,
        'email': f'{username}@example.com',
        'joined': '2023-01-01'
    }
    return render_template('profile.html', user=user_data)

# File uploads
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file:
        filename = file.filename
        file.save(f'uploads/{filename}')
        return jsonify({'message': f'File {filename} uploaded successfully'})

# Configuration
class Config:
    SECRET_KEY = 'dev-secret-key'
    DEBUG = True
    DATABASE_URL = 'sqlite:///app.db'

app.config.from_object(Config)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)`,
    difficulty: "intermediate",
    categorySlug: "web-development",
    xpReward: 24,
    estimatedMinutes: 8,
    tags: ["flask", "web-framework", "api", "routes"],
  },
  {
    title: "Working with APIs and HTTP Requests",
    content:
      "Making HTTP requests and consuming APIs is essential for modern web development. The requests library provides an elegant interface for HTTP operations.",
    codeExample: `import requests
import json
from typing import Dict, Any, Optional

# Basic HTTP requests
def make_api_request():
    # GET request
    response = requests.get('https://api.github.com/users/octocat')
    
    if response.status_code == 200:
        user_data = response.json()
        print(f"User: {user_data['name']}")
        print(f"Public repos: {user_data['public_repos']}")
    else:
        print(f"Error: {response.status_code}")

# POST request with data
def create_user(user_data):
    url = 'https://jsonplaceholder.typicode.com/users'
    
    response = requests.post(
        url,
        json=user_data,
        headers={'Content-Type': 'application/json'}
    )
    
    if response.status_code == 201:
        return response.json()
    else:
        raise Exception(f"Failed to create user: {response.status_code}")

# API client class
class APIClient:
    def __init__(self, base_url: str, api_key: Optional[str] = None):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        
        if api_key:
            self.session.headers.update({'Authorization': f'Bearer {api_key}'})
    
    def get(self, endpoint: str, params: Optional[Dict] = None) -> Dict[str, Any]:
        """Make GET request"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        response = self.session.get(url, params=params)
        response.raise_for_status()
        return response.json()
    
    def post(self, endpoint: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Make POST request"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        response = self.session.post(url, json=data)
        response.raise_for_status()
        return response.json()
    
    def put(self, endpoint: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Make PUT request"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        response = self.session.put(url, json=data)
        response.raise_for_status()
        return response.json()
    
    def delete(self, endpoint: str) -> bool:
        """Make DELETE request"""
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        response = self.session.delete(url)
        response.raise_for_status()
        return True

# Using the API client
client = APIClient('https://jsonplaceholder.typicode.com', api_key='your-api-key')

# Get all posts
posts = client.get('/posts')
print(f"Found {len(posts)} posts")

# Get specific post
post = client.get('/posts/1')
print(f"Post title: {post['title']}")

# Create new post
new_post = {
    'title': 'My New Post',
    'body': 'This is the content of my post',
    'userId': 1
}
created_post = client.post('/posts', new_post)

# Error handling and retries
import time
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

def create_session_with_retries():
    session = requests.Session()
    
    # Configure retry strategy
    retry_strategy = Retry(
        total=3,  # Total number of retries
        backoff_factor=1,  # Wait time between retries
        status_forcelist=[429, 500, 502, 503, 504],  # HTTP status codes to retry
    )
    
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("http://", adapter)
    session.mount("https://", adapter)
    
    return session

# Rate limiting
class RateLimitedAPIClient:
    def __init__(self, base_url: str, requests_per_second: float = 1.0):
        self.base_url = base_url
        self.min_interval = 1.0 / requests_per_second
        self.last_request_time = 0
        self.session = create_session_with_retries()
    
    def _wait_if_needed(self):
        current_time = time.time()
        time_since_last_request = current_time - self.last_request_time
        
        if time_since_last_request < self.min_interval:
            sleep_time = self.min_interval - time_since_last_request
            time.sleep(sleep_time)
        
        self.last_request_time = time.time()
    
    def get(self, endpoint: str, params: Optional[Dict] = None) -> Dict[str, Any]:
        self._wait_if_needed()
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        response = self.session.get(url, params=params, timeout=30)
        response.raise_for_status()
        return response.json()

# Async requests with asyncio and aiohttp
import asyncio
import aiohttp

async def fetch_multiple_urls(urls):
    """Fetch multiple URLs concurrently"""
    async with aiohttp.ClientSession() as session:
        tasks = []
        for url in urls:
            task = asyncio.create_task(fetch_url(session, url))
            tasks.append(task)
        
        results = await asyncio.gather(*tasks)
        return results

async def fetch_url(session, url):
    """Fetch single URL"""
    try:
        async with session.get(url) as response:
            return await response.json()
    except Exception as e:
        return {'error': str(e), 'url': url}

# Usage
# urls = [
#     'https://jsonplaceholder.typicode.com/posts/1',
#     'https://jsonplaceholder.typicode.com/posts/2',
#     'https://jsonplaceholder.typicode.com/posts/3'
# ]
# results = asyncio.run(fetch_multiple_urls(urls))`,
    difficulty: "intermediate",
    categorySlug: "web-development",
    xpReward: 26,
    estimatedMinutes: 9,
    tags: ["api", "requests", "http", "client"],
  },
  {
    title: "Database Integration with SQLAlchemy",
    content:
      "SQLAlchemy is Python's most popular SQL toolkit and Object-Relational Mapping (ORM) library. It provides a high-level interface for database operations.",
    codeExample: `from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

# Database setup
Base = declarative_base()

# Model definitions
class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship to posts
    posts = relationship("Post", back_populates="author")
    
    def __repr__(self):
        return f"<User(username='{self.username}', email='{self.email}')>"

class Post(Base):
    __tablename__ = 'posts'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    content = Column(String(1000))
    user_id = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship to user
    author = relationship("User", back_populates="posts")
    
    def __repr__(self):
        return f"<Post(title='{self.title}')>"

# Database connection and session management
class DatabaseManager:
    def __init__(self, database_url='sqlite:///example.db'):
        self.engine = create_engine(database_url)
        self.SessionLocal = sessionmaker(bind=self.engine)
        
        # Create tables
        Base.metadata.create_all(bind=self.engine)
    
    def get_session(self):
        """Get database session"""
        return self.SessionLocal()
    
    def close_session(self, session):
        """Close database session"""
        session.close()

# Database operations
class UserRepository:
    def __init__(self, db_manager):
        self.db_manager = db_manager
    
    def create_user(self, username: str, email: str) -> User:
        """Create a new user"""
        session = self.db_manager.get_session()
        try:
            user = User(username=username, email=email)
            session.add(user)
            session.commit()
            session.refresh(user)
            return user
        finally:
            self.db_manager.close_session(session)
    
    def get_user_by_id(self, user_id: int) -> User:
        """Get user by ID"""
        session = self.db_manager.get_session()
        try:
            return session.query(User).filter(User.id == user_id).first()
        finally:
            self.db_manager.close_session(session)
    
    def get_user_by_username(self, username: str) -> User:
        """Get user by username"""
        session = self.db_manager.get_session()
        try:
            return session.query(User).filter(User.username == username).first()
        finally:
            self.db_manager.close_session(session)
    
    def update_user(self, user_id: int, **kwargs) -> User:
        """Update user"""
        session = self.db_manager.get_session()
        try:
            user = session.query(User).filter(User.id == user_id).first()
            if user:
                for key, value in kwargs.items():
                    setattr(user, key, value)
                session.commit()
                session.refresh(user)
            return user
        finally:
            self.db_manager.close_session(session)
    
    def delete_user(self, user_id: int) -> bool:
        """Delete user"""
        session = self.db_manager.get_session()
        try:
            user = session.query(User).filter(User.id == user_id).first()
            if user:
                session.delete(user)
                session.commit()
                return True
            return False
        finally:
            self.db_manager.close_session(session)

# Context manager for sessions
from contextlib import contextmanager

@contextmanager
def get_db_session(db_manager):
    """Context manager for database sessions"""
    session = db_manager.get_session()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

# Using context manager
def create_user_with_posts(db_manager, username, email, post_titles):
    """Create user with multiple posts in a transaction"""
    with get_db_session(db_manager) as session:
        # Create user
        user = User(username=username, email=email)
        session.add(user)
        session.flush()  # Get user.id without committing
        
        # Create posts
        for title in post_titles:
            post = Post(title=title, user_id=user.id)
            session.add(post)
        
        # Commit happens automatically if no exception

# Raw SQL queries
def execute_raw_sql(db_manager, query, params=None):
    """Execute raw SQL query"""
    with get_db_session(db_manager) as session:
        result = session.execute(query, params or {})
        return result.fetchall()

# Complex queries
def get_users_with_post_count(db_manager):
    """Get users with their post counts"""
    with get_db_session(db_manager) as session:
        from sqlalchemy import func
        
        result = session.query(
            User.username,
            User.email,
            func.count(Post.id).label('post_count')
        ).outerjoin(Post).group_by(User.id).all()
        
        return [
            {
                'username': row.username,
                'email': row.email,
                'post_count': row.post_count
            }
            for row in result
        ]

# Usage example
if __name__ == "__main__":
    # Initialize database
    db_manager = DatabaseManager()
    user_repo = UserRepository(db_manager)
    
    # Create users
    user1 = user_repo.create_user("alice", "alice@example.com")
    user2 = user_repo.create_user("bob", "bob@example.com")
    
    # Create posts
    create_user_with_posts(
        db_manager, "charlie", "charlie@example.com",
        ["First Post", "Second Post", "Third Post"]
    )
    
    # Query users
    users_with_posts = get_users_with_post_count(db_manager)
    for user_info in users_with_posts:
        print(f"{user_info['username']}: {user_info['post_count']} posts")`,
    difficulty: "advanced",
    categorySlug: "web-development",
    xpReward: 30,
    estimatedMinutes: 12,
    tags: ["sqlalchemy", "orm", "database", "sql"],
  },
  {
    title: "Authentication and Session Management",
    content:
      "Implementing secure authentication and session management is crucial for web applications. This includes user registration, login, password security, and session handling.",
    codeExample: `import hashlib
import secrets
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import Flask, request, jsonify, session

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-very-secret-key'

# User storage (in production, use a database)
users_db = {}
sessions_db = {}

class User:
    def __init__(self, username, email, password_hash, salt):
        self.id = secrets.token_hex(8)
        self.username = username
        self.email = email
        self.password_hash = password_hash
        self.salt = salt
        self.created_at = datetime.utcnow()
        self.is_active = True

class AuthManager:
    @staticmethod
    def hash_password(password):
        """Hash password with salt"""
        salt = secrets.token_hex(16)
        password_hash = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        )
        return password_hash.hex(), salt
    
    @staticmethod
    def verify_password(password, stored_hash, salt):
        """Verify password against stored hash"""
        password_hash = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        )
        return password_hash.hex() == stored_hash
    
    @staticmethod
    def generate_token(user_id, expires_in_hours=24):
        """Generate JWT token"""
        payload = {
            'user_id': user_id,
            'exp': datetime.utcnow() + timedelta(hours=expires_in_hours),
            'iat': datetime.utcnow()
        }
        return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    
    @staticmethod
    def verify_token(token):
        """Verify JWT token"""
        try:
            payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            return payload['user_id']
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

# Authentication decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        if token.startswith('Bearer '):
            token = token[7:]
        
        user_id = AuthManager.verify_token(token)
        if not user_id:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Add user to request context
        request.current_user_id = user_id
        return f(*args, **kwargs)
    
    return decorated_function

# Registration endpoint
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validate input
    username = data.get('username', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')
    
    if not username or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400
    
    if len(password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters'}), 400
    
    # Check if user already exists
    for user in users_db.values():
        if user.username == username or user.email == email:
            return jsonify({'error': 'User already exists'}), 409
    
    # Create user
    password_hash, salt = AuthManager.hash_password(password)
    user = User(username, email, password_hash, salt)
    users_db[user.id] = user
    
    # Generate token
    token = AuthManager.generate_token(user.id)
    
    return jsonify({
        'message': 'User created successfully',
        'token': token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    }), 201

# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    username = data.get('username', '').strip()
    password = data.get('password', '')
    
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    
    # Find user
    user = None
    for u in users_db.values():
        if u.username == username or u.email == username:
            user = u
            break
    
    if not user or not AuthManager.verify_password(password, user.password_hash, user.salt):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    # Generate token
    token = AuthManager.generate_token(user.id)
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email
        }
    })

# Protected endpoint
@app.route('/profile', methods=['GET'])
@login_required
def get_profile():
    user = users_db.get(request.current_user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'created_at': user.created_at.isoformat()
        }
    })

# Session-based authentication (alternative to JWT)
class SessionManager:
    @staticmethod
    def create_session(user_id):
        """Create a new session"""
        session_id = secrets.token_urlsafe(32)
        session_data = {
            'user_id': user_id,
            'created_at': datetime.utcnow(),
            'last_accessed': datetime.utcnow()
        }
        sessions_db[session_id] = session_data
        return session_id
    
    @staticmethod
    def get_session(session_id):
        """Get session data"""
        session_data = sessions_db.get(session_id)
        if not session_data:
            return None
        
        # Check if session is expired (24 hours)
        if datetime.utcnow() - session_data['created_at'] > timedelta(hours=24):
            del sessions_db[session_id]
            return None
        
        # Update last accessed
        session_data['last_accessed'] = datetime.utcnow()
        return session_data
    
    @staticmethod
    def delete_session(session_id):
        """Delete session"""
        if session_id in sessions_db:
            del sessions_db[session_id]

# Password reset functionality
reset_tokens = {}

@app.route('/reset-password-request', methods=['POST'])
def reset_password_request():
    data = request.get_json()
    email = data.get('email', '').strip()
    
    # Find user by email
    user = None
    for u in users_db.values():
        if u.email == email:
            user = u
            break
    
    if user:
        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        reset_tokens[reset_token] = {
            'user_id': user.id,
            'expires_at': datetime.utcnow() + timedelta(hours=1)
        }
        
        # In production, send email with reset link
        print(f"Reset token for {email}: {reset_token}")
    
    # Always return success for security
    return jsonify({'message': 'If account exists, reset email sent'})

@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token', '')
    new_password = data.get('password', '')
    
    if not token or not new_password:
        return jsonify({'error': 'Token and password required'}), 400
    
    if len(new_password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters'}), 400
    
    # Verify reset token
    reset_data = reset_tokens.get(token)
    if not reset_data or datetime.utcnow() > reset_data['expires_at']:
        return jsonify({'error': 'Invalid or expired token'}), 400
    
    # Update password
    user = users_db.get(reset_data['user_id'])
    if user:
        password_hash, salt = AuthManager.hash_password(new_password)
        user.password_hash = password_hash
        user.salt = salt
        
        # Remove reset token
        del reset_tokens[token]
        
        return jsonify({'message': 'Password reset successful'})
    
    return jsonify({'error': 'User not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)`,
    difficulty: "advanced",
    categorySlug: "web-development",
    xpReward: 32,
    estimatedMinutes: 14,
    tags: ["authentication", "security", "jwt", "sessions"],
  },

  // Data Science Tips (5 tips)
  {
    title: "NumPy Arrays and Vectorized Operations",
    content:
      "NumPy is the foundation of Python's scientific computing stack. Understanding arrays and vectorized operations is essential for efficient numerical computations and data manipulation.",
    codeExample: `import numpy as np
import time

# Creating NumPy arrays
arr1d = np.array([1, 2, 3, 4, 5])
arr2d = np.array([[1, 2, 3], [4, 5, 6]])
arr3d = np.array([[[1, 2], [3, 4]], [[5, 6], [7, 8]]])

print(f"1D array: {arr1d}")
print(f"2D array:\\n{arr2d}")
print(f"Shape: {arr2d.shape}, Size: {arr2d.size}, Dtype: {arr2d.dtype}")

# Array creation functions
zeros = np.zeros((3, 4))          # All zeros
ones = np.ones((2, 3))            # All ones
identity = np.eye(3)              # Identity matrix
arange = np.arange(0, 10, 2)      # Range array [0, 2, 4, 6, 8]
linspace = np.linspace(0, 1, 5)   # 5 evenly spaced values from 0 to 1
random_arr = np.random.random((3, 3))  # Random values

# Array indexing and slicing
arr = np.array([[1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12]])

print(f"Element at [1, 2]: {arr[1, 2]}")      # 7
print(f"First row: {arr[0, :]}")               # [1 2 3 4]
print(f"Last column: {arr[:, -1]}")            # [4 8 12]
print(f"Subarray:\\n{arr[1:, 1:3]}")          # [[6 7], [10 11]]

# Boolean indexing
data = np.array([1, 5, 3, 8, 2, 9])
mask = data > 5
print(f"Values > 5: {data[mask]}")             # [8 9]

# Vectorized operations (much faster than loops)
def compare_performance():
    # Create large arrays
    size = 1000000
    arr1 = np.random.random(size)
    arr2 = np.random.random(size)
    
    # Python loop (slow)
    start = time.time()
    result_loop = []
    for i in range(len(arr1)):
        result_loop.append(arr1[i] + arr2[i])
    loop_time = time.time() - start
    
    # NumPy vectorized operation (fast)
    start = time.time()
    result_vector = arr1 + arr2
    vector_time = time.time() - start
    
    print(f"Loop time: {loop_time:.4f}s")
    print(f"Vectorized time: {vector_time:.4f}s")
    print(f"Speedup: {loop_time/vector_time:.1f}x")

# Mathematical operations
arr = np.array([1, 4, 9, 16, 25])
print(f"Square root: {np.sqrt(arr)}")          # [1. 2. 3. 4. 5.]
print(f"Natural log: {np.log(arr)}")
print(f"Sin values: {np.sin(arr)}")

# Array reshaping and manipulation
original = np.arange(12)
reshaped = original.reshape(3, 4)
flattened = reshaped.flatten()
transposed = reshaped.T

print(f"Original: {original}")
print(f"Reshaped:\\n{reshaped}")
print(f"Transposed:\\n{transposed}")

# Aggregation functions
data = np.random.normal(50, 15, 1000)  # Normal distribution
print(f"Mean: {np.mean(data):.2f}")
print(f"Median: {np.median(data):.2f}")
print(f"Std deviation: {np.std(data):.2f}")
print(f"Min: {np.min(data):.2f}, Max: {np.max(data):.2f}")

# Axis-based operations
matrix = np.random.randint(1, 10, (3, 4))
print(f"Matrix:\\n{matrix}")
print(f"Sum along rows (axis=1): {np.sum(matrix, axis=1)}")
print(f"Mean along columns (axis=0): {np.mean(matrix, axis=0)}")

# Broadcasting (operations between arrays of different shapes)
arr = np.array([[1, 2, 3],
                [4, 5, 6]])
scalar = 10
vector = np.array([1, 2, 3])

print(f"Array + scalar:\\n{arr + scalar}")
print(f"Array + vector:\\n{arr + vector}")    # Vector broadcasts to match rows

# Useful array functions
arr = np.array([3, 1, 4, 1, 5, 9, 2, 6])
print(f"Sorted: {np.sort(arr)}")
print(f"Unique values: {np.unique(arr)}")
print(f"Arg max: {np.argmax(arr)}")            # Index of maximum value
print(f"Where > 4: {np.where(arr > 4)}")      # Indices where condition is true`,
    difficulty: "intermediate",
    categorySlug: "data-science",
    xpReward: 24,
    estimatedMinutes: 8,
    tags: ["numpy", "arrays", "vectorization", "scientific-computing"],
  },
  {
    title: "Pandas for Data Manipulation",
    content:
      "Pandas is the cornerstone of data analysis in Python. It provides powerful data structures (Series and DataFrame) and tools for data cleaning, transformation, and analysis.",
    codeExample: `import pandas as pd
import numpy as np

# Creating DataFrames
data = {
    'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
    'age': [25, 30, 35, 28, 32],
    'city': ['New York', 'London', 'Tokyo', 'Paris', 'Sydney'],
    'salary': [50000, 60000, 70000, 55000, 65000]
}
df = pd.DataFrame(data)
print("DataFrame:")
print(df)
print(f"\\nShape: {df.shape}")
print(f"\\nData types:\\n{df.dtypes}")

# Reading data from files
# df = pd.read_csv('data.csv')
# df = pd.read_excel('data.xlsx')
# df = pd.read_json('data.json')

# Basic DataFrame operations
print(f"\\nFirst 3 rows:\\n{df.head(3)}")
print(f"\\nLast 2 rows:\\n{df.tail(2)}")
print(f"\\nColumn names: {df.columns.tolist()}")
print(f"\\nBasic statistics:\\n{df.describe()}")

# Selecting data
print(f"\\nNames column:\\n{df['name']}")
print(f"\\nMultiple columns:\\n{df[['name', 'salary']]}")
print(f"\\nFirst 3 rows, first 2 columns:\\n{df.iloc[0:3, 0:2]}")
print(f"\\nRows where age > 30:\\n{df[df['age'] > 30]}")

# Adding and modifying columns
df['bonus'] = df['salary'] * 0.1
df['total_compensation'] = df['salary'] + df['bonus']
df['age_group'] = df['age'].apply(lambda x: 'Young' if x < 30 else 'Experienced')

print(f"\\nDataFrame with new columns:\\n{df}")

# Data cleaning and handling missing values
# Create sample data with missing values
dirty_data = {
    'product': ['A', 'B', 'C', 'D', 'E'],
    'price': [10.5, None, 15.0, 12.5, None],
    'quantity': [100, 200, None, 150, 300],
    'category': ['Electronics', 'Books', '', 'Electronics', 'Books']
}
dirty_df = pd.DataFrame(dirty_data)
print(f"\\nData with missing values:\\n{dirty_df}")

# Handle missing values
print(f"\\nMissing values count:\\n{dirty_df.isnull().sum()}")

# Fill missing values
clean_df = dirty_df.copy()
clean_df['price'].fillna(clean_df['price'].mean(), inplace=True)
clean_df['quantity'].fillna(clean_df['quantity'].median(), inplace=True)
clean_df['category'].replace('', 'Unknown', inplace=True)

print(f"\\nCleaned data:\\n{clean_df}")

# Grouping and aggregation
grouped = df.groupby('city').agg({
    'salary': ['mean', 'max', 'min'],
    'age': 'mean'
}).round(2)
print(f"\\nGrouped by city:\\n{grouped}")

# More complex grouping
city_stats = df.groupby('city').apply(
    lambda group: pd.Series({
        'avg_salary': group['salary'].mean(),
        'total_people': len(group),
        'salary_std': group['salary'].std()
    })
).round(2)
print(f"\\nCity statistics:\\n{city_stats}")

# Sorting data
sorted_df = df.sort_values(['age', 'salary'], ascending=[True, False])
print(f"\\nSorted by age (asc) then salary (desc):\\n{sorted_df}")

# Merging DataFrames
additional_info = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie'],
    'department': ['Engineering', 'Marketing', 'Sales'],
    'years_experience': [3, 5, 8]
})

merged_df = pd.merge(df, additional_info, on='name', how='left')
print(f"\\nMerged DataFrame:\\n{merged_df}")

# Pivot tables
pivot = df.pivot_table(
    values='salary',
    index='age_group',
    columns='city',
    aggfunc='mean',
    fill_value=0
)
print(f"\\nPivot table:\\n{pivot}")

# String operations
text_df = pd.DataFrame({
    'names': ['John Doe', 'jane smith', 'BOB JOHNSON', 'alice brown']
})

text_df['first_name'] = text_df['names'].str.split().str[0]
text_df['last_name'] = text_df['names'].str.split().str[1]
text_df['names_upper'] = text_df['names'].str.upper()
text_df['names_title'] = text_df['names'].str.title()

print(f"\\nString operations:\\n{text_df}")

# DateTime operations
dates_df = pd.DataFrame({
    'date_string': ['2023-01-15', '2023-02-20', '2023-03-25']
})

dates_df['date'] = pd.to_datetime(dates_df['date_string'])
dates_df['year'] = dates_df['date'].dt.year
dates_df['month'] = dates_df['date'].dt.month
dates_df['day_name'] = dates_df['date'].dt.day_name()

print(f"\\nDateTime operations:\\n{dates_df}")

# Performance tips
# Use vectorized operations instead of apply when possible
# Use categorical data type for repeated strings
# Use appropriate data types (int32 instead of int64 if possible)

# Convert to categorical for memory efficiency
df['city'] = df['city'].astype('category')
print(f"\\nMemory usage after categorical conversion:\\n{df.memory_usage(deep=True)}")`,
    difficulty: "intermediate",
    categorySlug: "data-science",
    xpReward: 26,
    estimatedMinutes: 9,
    tags: ["pandas", "dataframes", "data-manipulation", "analysis"],
  },
  {
    title: "Data Visualization with Matplotlib and Seaborn",
    content:
      "Creating effective visualizations is crucial for data analysis and communication. Matplotlib provides the foundation, while Seaborn offers higher-level statistical plotting functions.",
    codeExample: `import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd

# Set style for better-looking plots
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

# Create sample data
np.random.seed(42)
data = pd.DataFrame({
    'x': np.random.normal(0, 1, 1000),
    'y': np.random.normal(0, 1, 1000),
    'category': np.random.choice(['A', 'B', 'C'], 1000),
    'value': np.random.exponential(2, 1000)
})

# Basic Matplotlib plots
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# Line plot
x = np.linspace(0, 10, 100)
y1 = np.sin(x)
y2 = np.cos(x)

axes[0, 0].plot(x, y1, label='sin(x)', linewidth=2)
axes[0, 0].plot(x, y2, label='cos(x)', linewidth=2)
axes[0, 0].set_title('Trigonometric Functions')
axes[0, 0].set_xlabel('x')
axes[0, 0].set_ylabel('y')
axes[0, 0].legend()
axes[0, 0].grid(True, alpha=0.3)

# Scatter plot
axes[0, 1].scatter(data['x'], data['y'], alpha=0.6, c=data['value'], cmap='viridis')
axes[0, 1].set_title('Scatter Plot with Color Mapping')
axes[0, 1].set_xlabel('X values')
axes[0, 1].set_ylabel('Y values')

# Histogram
axes[1, 0].hist(data['value'], bins=30, alpha=0.7, edgecolor='black')
axes[1, 0].set_title('Distribution of Values')
axes[1, 0].set_xlabel('Value')
axes[1, 0].set_ylabel('Frequency')

# Box plot
category_data = [data[data['category'] == cat]['value'] for cat in ['A', 'B', 'C']]
axes[1, 1].boxplot(category_data, labels=['A', 'B', 'C'])
axes[1, 1].set_title('Value Distribution by Category')
axes[1, 1].set_xlabel('Category')
axes[1, 1].set_ylabel('Value')

plt.tight_layout()
plt.show()

# Seaborn statistical plots
fig, axes = plt.subplots(2, 3, figsize=(15, 10))

# Distribution plot
sns.histplot(data=data, x='value', hue='category', ax=axes[0, 0])
axes[0, 0].set_title('Distribution by Category')

# Violin plot
sns.violinplot(data=data, x='category', y='value', ax=axes[0, 1])
axes[0, 1].set_title('Violin Plot')

# Correlation heatmap
correlation_data = data.select_dtypes(include=[np.number]).corr()
sns.heatmap(correlation_data, annot=True, cmap='coolwarm', ax=axes[0, 2])
axes[0, 2].set_title('Correlation Matrix')

# Pair plot (create smaller dataset for clarity)
sample_data = data.sample(200)
sns.scatterplot(data=sample_data, x='x', y='y', hue='category', ax=axes[1, 0])
axes[1, 0].set_title('Scatter Plot by Category')

# Regression plot
sns.regplot(data=sample_data, x='x', y='value', ax=axes[1, 1])
axes[1, 1].set_title('Regression Plot')

# Count plot
sns.countplot(data=data, x='category', ax=axes[1, 2])
axes[1, 2].set_title('Count by Category')

plt.tight_layout()
plt.show()

# Advanced plotting techniques
def create_advanced_plots():
    # Create time series data
    dates = pd.date_range('2023-01-01', periods=365, freq='D')
    ts_data = pd.DataFrame({
        'date': dates,
        'temperature': 20 + 10 * np.sin(2 * np.pi * np.arange(365) / 365) + np.random.normal(0, 2, 365),
        'humidity': 50 + 20 * np.cos(2 * np.pi * np.arange(365) / 365) + np.random.normal(0, 5, 365)
    })
    
    # Multiple y-axes plot
    fig, ax1 = plt.subplots(figsize=(12, 6))
    
    color = 'tab:red'
    ax1.set_xlabel('Date')
    ax1.set_ylabel('Temperature (°C)', color=color)
    ax1.plot(ts_data['date'], ts_data['temperature'], color=color, linewidth=1)
    ax1.tick_params(axis='y', labelcolor=color)
    
    ax2 = ax1.twinx()
    color = 'tab:blue'
    ax2.set_ylabel('Humidity (%)', color=color)
    ax2.plot(ts_data['date'], ts_data['humidity'], color=color, linewidth=1)
    ax2.tick_params(axis='y', labelcolor=color)
    
    plt.title('Temperature and Humidity Over Time')
    plt.tight_layout()
    plt.show()

# Customizing plots
def create_custom_plot():
    # Create sample data
    categories = ['Product A', 'Product B', 'Product C', 'Product D']
    sales_q1 = [23, 17, 35, 29]
    sales_q2 = [25, 19, 38, 31]
    
    x = np.arange(len(categories))
    width = 0.35
    
    fig, ax = plt.subplots(figsize=(10, 6))
    
    bars1 = ax.bar(x - width/2, sales_q1, width, label='Q1', color='skyblue', edgecolor='navy')
    bars2 = ax.bar(x + width/2, sales_q2, width, label='Q2', color='lightcoral', edgecolor='darkred')
    
    # Customize the plot
    ax.set_xlabel('Products', fontsize=12, fontweight='bold')
    ax.set_ylabel('Sales (thousands)', fontsize=12, fontweight='bold')
    ax.set_title('Quarterly Sales Comparison', fontsize=14, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(categories)
    ax.legend()
    
    # Add value labels on bars
    def add_value_labels(bars):
        for bar in bars:
            height = bar.get_height()
            ax.annotate(f'{height}',
                       xy=(bar.get_x() + bar.get_width() / 2, height),
                       xytext=(0, 3),  # 3 points vertical offset
                       textcoords="offset points",
                       ha='center', va='bottom')
    
    add_value_labels(bars1)
    add_value_labels(bars2)
    
    plt.grid(axis='y', alpha=0.3)
    plt.tight_layout()
    plt.show()

# Saving plots
def save_plots():
    fig, ax = plt.subplots()
    ax.plot([1, 2, 3, 4], [1, 4, 2, 3])
    
    # Save in different formats
    plt.savefig('plot.png', dpi=300, bbox_inches='tight')
    plt.savefig('plot.pdf', bbox_inches='tight')
    plt.savefig('plot.svg', bbox_inches='tight')
    
    plt.show()

# Interactive plots with plotly (alternative)
# import plotly.express as px
# import plotly.graph_objects as go

# def create_interactive_plot():
#     fig = px.scatter(data, x='x', y='y', color='category',
#                     size='value', hover_data=['value'])
#     fig.update_layout(title='Interactive Scatter Plot')
#     fig.show()

print("Visualization examples created. Run the functions to see the plots.")`,
    difficulty: "intermediate",
    categorySlug: "data-science",
    xpReward: 28,
    estimatedMinutes: 10,
    tags: ["matplotlib", "seaborn", "visualization", "plotting"],
  },
  {
    title: "Machine Learning with Scikit-learn",
    content:
      "Scikit-learn provides simple and efficient tools for machine learning. Understanding the basic workflow of data preprocessing, model training, and evaluation is essential for ML projects.",
    codeExample: `import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report, mean_squared_error, r2_score
from sklearn.datasets import make_classification, make_regression, load_iris
import matplotlib.pyplot as plt

# Generate sample datasets
# Classification dataset
X_clf, y_clf = make_classification(n_samples=1000, n_features=20, n_informative=10,
                                  n_redundant=10, n_clusters_per_class=1, random_state=42)

# Regression dataset
X_reg, y_reg = make_regression(n_samples=1000, n_features=10, noise=0.1, random_state=42)

# Load real dataset (Iris)
iris = load_iris()
iris_df = pd.DataFrame(iris.data, columns=iris.feature_names)
iris_df['target'] = iris.target
iris_df['species'] = iris_df['target'].map({0: 'setosa', 1: 'versicolor', 2: 'virginica'})

print("Sample datasets created")
print(f"Classification dataset shape: {X_clf.shape}")
print(f"Regression dataset shape: {X_reg.shape}")
print(f"Iris dataset shape: {iris_df.shape}")

# Data preprocessing pipeline
class DataPreprocessor:
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        
    def preprocess_features(self, X_train, X_test):
        """Scale numerical features"""
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        return X_train_scaled, X_test_scaled
    
    def encode_labels(self, y_train, y_test=None):
        """Encode categorical labels"""
        y_train_encoded = self.label_encoder.fit_transform(y_train)
        if y_test is not None:
            y_test_encoded = self.label_encoder.transform(y_test)
            return y_train_encoded, y_test_encoded
        return y_train_encoded

# Classification example
def classification_example():
    print("\\n=== Classification Example ===")
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X_clf, y_clf, test_size=0.2, random_state=42, stratify=y_clf
    )
    
    # Preprocess data
    preprocessor = DataPreprocessor()
    X_train_scaled, X_test_scaled = preprocessor.preprocess_features(X_train, X_test)
    
    # Train different models
    models = {
        'Logistic Regression': LogisticRegression(random_state=42),
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
        'SVM': SVC(random_state=42)
    }
    
    results = {}
    
    for name, model in models.items():
        # Train model
        model.fit(X_train_scaled, y_train)
        
        # Make predictions
        y_pred = model.predict(X_test_scaled)
        
        # Calculate accuracy
        accuracy = accuracy_score(y_test, y_pred)
        results[name] = accuracy
        
        print(f"\\n{name}:")
        print(f"Accuracy: {accuracy:.4f}")
        print("Classification Report:")
        print(classification_report(y_test, y_pred))
    
    # Cross-validation
    print("\\n=== Cross-Validation Results ===")
    for name, model in models.items():
        cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5)
        print(f"{name}: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")

# Regression example
def regression_example():
    print("\\n=== Regression Example ===")
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X_reg, y_reg, test_size=0.2, random_state=42
    )
    
    # Preprocess data
    preprocessor = DataPreprocessor()
    X_train_scaled, X_test_scaled = preprocessor.preprocess_features(X_train, X_test)
    
    # Train different models
    models = {
        'Linear Regression': LinearRegression(),
        'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42)
    }
    
    for name, model in models.items():
        # Train model
        model.fit(X_train_scaled, y_train)
        
        # Make predictions
        y_pred = model.predict(X_test_scaled)
        
        # Calculate metrics
        mse = mean_squared_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        print(f"\\n{name}:")
        print(f"MSE: {mse:.4f}")
        print(f"R² Score: {r2:.4f}")
        
        # Plot predictions vs actual (for first model only)
        if name == 'Linear Regression':
            plt.figure(figsize=(8, 6))
            plt.scatter(y_test, y_pred, alpha=0.6)
            plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw=2)
            plt.xlabel('Actual Values')
            plt.ylabel('Predicted Values')
            plt.title('Actual vs Predicted Values (Linear Regression)')
            plt.show()

# Hyperparameter tuning
def hyperparameter_tuning_example():
    print("\\n=== Hyperparameter Tuning ===")
    
    X_train, X_test, y_train, y_test = train_test_split(
        X_clf, y_clf, test_size=0.2, random_state=42, stratify=y_clf
    )
    
    # Preprocess data
    preprocessor = DataPreprocessor()
    X_train_scaled, X_test_scaled = preprocessor.preprocess_features(X_train, X_test)
    
    # Define parameter grid for Random Forest
    param_grid = {
        'n_estimators': [50, 100, 200],
        'max_depth': [None, 10, 20],
        'min_samples_split': [2, 5, 10]
    }
    
    # Grid search with cross-validation
    rf = RandomForestClassifier(random_state=42)
    grid_search = GridSearchCV(rf, param_grid, cv=5, scoring='accuracy', n_jobs=-1)
    grid_search.fit(X_train_scaled, y_train)
    
    print(f"Best parameters: {grid_search.best_params_}")
    print(f"Best cross-validation score: {grid_search.best_score_:.4f}")
    
    # Evaluate best model on test set
    best_model = grid_search.best_estimator_
    y_pred = best_model.predict(X_test_scaled)
    test_accuracy = accuracy_score(y_test, y_pred)
    print(f"Test accuracy with best model: {test_accuracy:.4f}")

# Feature importance analysis
def feature_importance_example():
    print("\\n=== Feature Importance Analysis ===")
    
    # Use Iris dataset for interpretability
    X = iris_df.drop(['target', 'species'], axis=1)
    y = iris_df['target']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train Random Forest
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)
    
    # Get feature importances
    feature_importance = pd.DataFrame({
        'feature': X.columns,
        'importance': rf.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("Feature Importances:")
    print(feature_importance)
    
    # Plot feature importances
    plt.figure(figsize=(10, 6))
    plt.barh(feature_importance['feature'], feature_importance['importance'])
    plt.xlabel('Feature Importance')
    plt.title('Random Forest Feature Importances (Iris Dataset)')
    plt.gca().invert_yaxis()
    plt.tight_layout()
    plt.show()

# Model evaluation and validation
def model_evaluation_example():
    print("\\n=== Model Evaluation ===")
    
    # Use Iris dataset
    X = iris_df.drop(['target', 'species'], axis=1)
    y = iris_df['species']  # Use string labels
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)
    
    # Predictions
    y_pred = rf.predict(X_test)
    y_pred_proba = rf.predict_proba(X_test)
    
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    print("\\nDetailed Classification Report:")
    print(classification_report(y_test, y_pred))
    
    # Confusion matrix
    from sklearn.metrics import confusion_matrix
    import seaborn as sns
    
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=rf.classes_, yticklabels=rf.classes_)
    plt.ylabel('Actual')
    plt.xlabel('Predicted')
    plt.title('Confusion Matrix')
    plt.show()

# Pipeline example
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer

def pipeline_example():
    print("\\n=== ML Pipeline Example ===")
    
    # Create sample data with mixed types
    data = pd.DataFrame({
        'numerical_1': np.random.normal(0, 1, 1000),
        'numerical_2': np.random.normal(10, 5, 1000),
        'categorical': np.random.choice(['A', 'B', 'C'], 1000),
        'target': np.random.choice([0, 1], 1000)
    })
    
    X = data.drop('target', axis=1)
    y = data['target']
    
    # Define preprocessing for different column types
    numerical_features = ['numerical_1', 'numerical_2']
    categorical_features = ['categorical']
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(drop='first'), categorical_features)
        ]
    )
    
    # Create pipeline
    pipeline = Pipeline([
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
    ])
    
    # Split and train
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Fit pipeline
    pipeline.fit(X_train, y_train)
    
    # Evaluate
    accuracy = pipeline.score(X_test, y_test)
    print(f"Pipeline accuracy: {accuracy:.4f}")

# Run examples
classification_example()
regression_example()
hyperparameter_tuning_example()
feature_importance_example()
model_evaluation_example()
pipeline_example()`,
    difficulty: "advanced",
    categorySlug: "data-science",
    xpReward: 32,
    estimatedMinutes: 15,
    tags: ["machine-learning", "scikit-learn", "classification", "regression"],
  },
  {
    title: "Statistical Analysis with SciPy",
    content:
      "SciPy provides comprehensive statistical functions for data analysis. Understanding basic statistical tests and distributions helps you validate hypotheses and draw conclusions from data.",
    codeExample: `import numpy as np
import pandas as pd
import scipy.stats as stats
import matplotlib.pyplot as plt

# Generate sample data
np.random.seed(42)
sample_data = np.random.normal(100, 15, 1000)
group_a = np.random.normal(100, 10, 50)
group_b = np.random.normal(105, 12, 50)

# Descriptive statistics
print("Descriptive Statistics:")
print(f"Mean: {np.mean(sample_data):.2f}")
print(f"Median: {np.median(sample_data):.2f}")
print(f"Standard deviation: {np.std(sample_data):.2f}")
print(f"Variance: {np.var(sample_data):.2f}")

# Test for normality
statistic, p_value = stats.shapiro(sample_data[:100])  # Use subset for Shapiro-Wilk
print(f"\\nNormality test (Shapiro-Wilk):")
print(f"Statistic: {statistic:.4f}")
print(f"P-value: {p_value:.6f}")
print(f"Normal distribution: {p_value > 0.05}")

# One-sample t-test
t_stat, p_val = stats.ttest_1samp(sample_data, 100)
print(f"\\nOne-sample t-test (testing if mean = 100):")
print(f"T-statistic: {t_stat:.4f}")
print(f"P-value: {p_val:.6f}")

# Two-sample t-test
t_stat, p_val = stats.ttest_ind(group_a, group_b)
print(f"\\nTwo-sample t-test:")
print(f"Group A mean: {np.mean(group_a):.2f}")
print(f"Group B mean: {np.mean(group_b):.2f}")
print(f"T-statistic: {t_stat:.4f}")
print(f"P-value: {p_val:.6f}")

# Correlation analysis
x = np.random.normal(0, 1, 100)
y = 2 * x + np.random.normal(0, 0.5, 100)
correlation, p_val = stats.pearsonr(x, y)
print(f"\\nPearson correlation:")
print(f"Correlation coefficient: {correlation:.4f}")
print(f"P-value: {p_val:.6f}")

# Confidence intervals
confidence_level = 0.95
degrees_freedom = len(sample_data) - 1
sample_mean = np.mean(sample_data)
sample_se = stats.sem(sample_data)
ci = stats.t.interval(confidence_level, degrees_freedom, sample_mean, sample_se)
print(f"\\n95% Confidence interval: ({ci[0]:.2f}, {ci[1]:.2f})")

# Chi-square test
observed = [20, 15, 25, 40]
expected = [25, 25, 25, 25]
chi2_stat, p_val = stats.chisquare(observed, expected)
print(f"\\nChi-square test:")
print(f"Chi-square statistic: {chi2_stat:.4f}")
print(f"P-value: {p_val:.6f}")`,
    difficulty: "advanced",
    categorySlug: "data-science",
    xpReward: 30,
    estimatedMinutes: 12,
    tags: ["statistics", "hypothesis-testing", "scipy", "analysis"],
  },

  // Testing & Debugging Tips (4 tips)
  {
    title: "Unit Testing with unittest and pytest",
    content:
      "Writing tests ensures your code works correctly and helps prevent regressions. Python's unittest module and the popular pytest framework make testing straightforward and effective.",
    codeExample: `# Using unittest (built-in)
import unittest

def add_numbers(a, b):
    """Add two numbers together"""
    return a + b

def divide_numbers(a, b):
    """Divide two numbers"""
    if b == 0:
        raise ValueError("Cannot divide by zero")
    return a / b

class Calculator:
    def multiply(self, a, b):
        return a * b
    
    def power(self, base, exponent):
        return base ** exponent

# Test class using unittest
class TestMathFunctions(unittest.TestCase):
    
    def setUp(self):
        """Set up test fixtures before each test method."""
        self.calc = Calculator()
        self.test_data = [1, 2, 3, 4, 5]
    
    def tearDown(self):
        """Clean up after each test method."""
        pass
    
    def test_add_numbers(self):
        """Test addition function"""
        self.assertEqual(add_numbers(2, 3), 5)
        self.assertEqual(add_numbers(-1, 1), 0)
        self.assertEqual(add_numbers(0, 0), 0)
    
    def test_divide_numbers(self):
        """Test division function"""
        self.assertEqual(divide_numbers(10, 2), 5)
        self.assertAlmostEqual(divide_numbers(1, 3), 0.333, places=2)
        
        # Test exception handling
        with self.assertRaises(ValueError):
            divide_numbers(10, 0)
    
    def test_calculator_multiply(self):
        """Test calculator multiply method"""
        self.assertEqual(self.calc.multiply(3, 4), 12)
        self.assertEqual(self.calc.multiply(-2, 5), -10)
    
    def test_calculator_power(self):
        """Test calculator power method"""
        self.assertEqual(self.calc.power(2, 3), 8)
        self.assertEqual(self.calc.power(5, 0), 1)

# Running tests
if __name__ == '__main__':
    unittest.main()

# Alternative: Using pytest (install with: pip install pytest)
# pytest offers simpler syntax and better output

import pytest

def test_add_numbers_pytest():
    assert add_numbers(2, 3) == 5
    assert add_numbers(-1, 1) == 0
    assert add_numbers(0, 0) == 0

def test_divide_numbers_pytest():
    assert divide_numbers(10, 2) == 5
    assert abs(divide_numbers(1, 3) - 0.333) < 0.001
    
    with pytest.raises(ValueError):
        divide_numbers(10, 0)

# Parameterized tests with pytest
@pytest.mark.parametrize("a,b,expected", [
    (2, 3, 5),
    (-1, 1, 0),
    (0, 0, 0),
    (100, -50, 50)
])
def test_add_numbers_parametrized(a, b, expected):
    assert add_numbers(a, b) == expected

# Fixtures in pytest
@pytest.fixture
def calculator():
    return Calculator()

@pytest.fixture
def sample_data():
    return [1, 2, 3, 4, 5]

def test_with_fixtures(calculator, sample_data):
    result = calculator.multiply(sample_data[0], sample_data[1])
    assert result == 2

# Mock testing example
from unittest.mock import Mock, patch

class DatabaseUser:
    def __init__(self, db_connection):
        self.db = db_connection
    
    def get_user(self, user_id):
        result = self.db.query(f"SELECT * FROM users WHERE id = {user_id}")
        return result

def test_database_user_with_mock():
    # Create a mock database connection
    mock_db = Mock()
    mock_db.query.return_value = {"id": 1, "name": "Alice"}
    
    user_service = DatabaseUser(mock_db)
    result = user_service.get_user(1)
    
    # Verify the result
    assert result["name"] == "Alice"
    
    # Verify that query was called with correct parameters
    mock_db.query.assert_called_once_with("SELECT * FROM users WHERE id = 1")

# Testing with patches
def get_current_time():
    from datetime import datetime
    return datetime.now()

def test_with_patch():
    with patch('datetime.datetime') as mock_datetime:
        mock_datetime.now.return_value = "2023-01-01 12:00:00"
        result = get_current_time()
        assert result == "2023-01-01 12:00:00"

# Run tests:
# python -m unittest test_file.py
# or
# pytest test_file.py`,
    difficulty: "intermediate",
    categorySlug: "testing-debugging",
    xpReward: 22,
    estimatedMinutes: 8,
    tags: ["testing", "unittest", "pytest", "mocking"],
  },
  {
    title: "Debugging Techniques and Tools",
    content:
      "Effective debugging is crucial for finding and fixing bugs. Python provides several tools and techniques for debugging code, from simple print statements to powerful debuggers.",
    codeExample: `import pdb
import traceback
import logging

# 1. Print debugging (simple but effective)
def calculate_average(numbers):
    print(f"Input: {numbers}")  # Debug print
    
    if not numbers:
        print("Empty list detected")  # Debug print
        return 0
    
    total = sum(numbers)
    count = len(numbers)
    average = total / count
    
    print(f"Total: {total}, Count: {count}, Average: {average}")  # Debug print
    return average

# 2. Using assertions for debugging
def process_age(age):
    assert isinstance(age, int), f"Age must be an integer, got {type(age)}"
    assert 0 <= age <= 150, f"Age must be between 0 and 150, got {age}"
    
    if age < 18:
        return "minor"
    elif age < 65:
        return "adult"
    else:
        return "senior"

# 3. Exception handling with detailed error information
def safe_divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError as e:
        print(f"Error: {e}")
        print(f"Attempted to divide {a} by {b}")
        traceback.print_exc()  # Print full traceback
        return None
    except TypeError as e:
        print(f"Type error: {e}")
        print(f"a={a} (type: {type(a)}), b={b} (type: {type(b)})")
        return None

# 4. Using the Python debugger (pdb)
def buggy_function(data):
    result = []
    for item in data:
        # Set breakpoint here
        pdb.set_trace()  # Debugger will stop here
        
        processed = item * 2
        if processed > 10:
            result.append(processed)
    
    return result

# 5. Logging for debugging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def process_user_data(users):
    logging.info("Starting user data processing")
    logging.debug(f"Processing {len(users)} users")
    
    processed_users = []
    
    for i, user in enumerate(users):
        logging.debug(f"Processing user {i}: {user}")
        
        try:
            if 'name' not in user:
                logging.warning(f"User {i} missing name field")
                continue
            
            if 'age' not in user:
                logging.warning(f"User {i} missing age field")
                user['age'] = 0
            
            processed_user = {
                'name': user['name'].strip().title(),
                'age': int(user['age']),
                'status': 'processed'
            }
            
            processed_users.append(processed_user)
            logging.debug(f"Successfully processed user: {processed_user}")
            
        except Exception as e:
            logging.error(f"Error processing user {i}: {e}")
            logging.debug(f"User data: {user}")
    
    logging.info(f"Completed processing. {len(processed_users)} users processed successfully")
    return processed_users

# 6. Custom debugging decorator
def debug_calls(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__} with args: {args}, kwargs: {kwargs}")
        
        try:
            result = func(*args, **kwargs)
            print(f"{func.__name__} returned: {result}")
            return result
        except Exception as e:
            print(f"{func.__name__} raised exception: {e}")
            raise
    
    return wrapper

@debug_calls
def add_numbers(a, b):
    return a + b

# 7. Memory and performance debugging
import time
import tracemalloc

def memory_debug_example():
    # Start tracing memory allocations
    tracemalloc.start()
    
    # Some memory-intensive operation
    large_list = [i for i in range(1000000)]
    
    # Get memory usage
    current, peak = tracemalloc.get_traced_memory()
    print(f"Current memory usage: {current / 1024 / 1024:.2f} MB")
    print(f"Peak memory usage: {peak / 1024 / 1024:.2f} MB")
    
    tracemalloc.stop()

def timing_debug_example():
    start_time = time.time()
    
    # Some operation to time
    result = sum(i*i for i in range(100000))
    
    end_time = time.time()
    print(f"Operation took {end_time - start_time:.4f} seconds")
    
    return result

# 8. Context manager for debugging
class DebugContext:
    def __init__(self, name):
        self.name = name
    
    def __enter__(self):
        print(f"Entering {self.name}")
        self.start_time = time.time()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        end_time = time.time()
        print(f"Exiting {self.name} (took {end_time - self.start_time:.4f}s)")
        
        if exc_type:
            print(f"Exception in {self.name}: {exc_val}")
        
        return False  # Don't suppress exceptions

# Usage example
with DebugContext("data processing"):
    data = [1, 2, 3, 4, 5]
    result = [x * 2 for x in data]

# 9. Interactive debugging with IPython
# Install with: pip install ipython
# In your code, add:
# from IPython import embed
# embed()  # Drops into IPython shell

# 10. Unit test debugging
class DebuggableCalculator:
    def __init__(self, debug=False):
        self.debug = debug
    
    def _log(self, message):
        if self.debug:
            print(f"DEBUG: {message}")
    
    def divide(self, a, b):
        self._log(f"Dividing {a} by {b}")
        
        if b == 0:
            self._log("Division by zero detected")
            raise ValueError("Cannot divide by zero")
        
        result = a / b
        self._log(f"Result: {result}")
        return result

# Debugging tips:
# - Use meaningful variable names
# - Add type hints
# - Write small, testable functions
# - Use logging instead of print for production code
# - Learn your IDE's debugging features
# - Use version control to track when bugs were introduced`,
    difficulty: "intermediate",
    categorySlug: "testing-debugging",
    xpReward: 20,
    estimatedMinutes: 7,
    tags: ["debugging", "pdb", "logging", "troubleshooting"],
  },
  {
    title: "Error Handling and Exception Strategies",
    content:
      "Proper error handling makes your applications robust and user-friendly. Understanding different types of exceptions and handling strategies helps you build reliable software.",
    codeExample: `# Built-in exception types
def demonstrate_exceptions():
    # ValueError - invalid value for operation
    try:
        int("not_a_number")
    except ValueError as e:
        print(f"ValueError: {e}")
    
    # TypeError - wrong type for operation
    try:
        "string" + 5
    except TypeError as e:
        print(f"TypeError: {e}")
    
    # IndexError - list index out of range
    try:
        my_list = [1, 2, 3]
        print(my_list[10])
    except IndexError as e:
        print(f"IndexError: {e}")
    
    # KeyError - dictionary key not found
    try:
        my_dict = {"a": 1, "b": 2}
        print(my_dict["c"])
    except KeyError as e:
        print(f"KeyError: {e}")
    
    # FileNotFoundError - file doesn't exist
    try:
        with open("nonexistent_file.txt", "r") as f:
            content = f.read()
    except FileNotFoundError as e:
        print(f"FileNotFoundError: {e}")

# Custom exception classes
class ValidationError(Exception):
    """Raised when data validation fails"""
    def __init__(self, message, field_name=None):
        super().__init__(message)
        self.field_name = field_name

class BusinessLogicError(Exception):
    """Raised when business rules are violated"""
    pass

class ConfigurationError(Exception):
    """Raised when configuration is invalid"""
    def __init__(self, message, config_key=None):
        super().__init__(message)
        self.config_key = config_key

# Exception handling strategies
class UserValidator:
    @staticmethod
    def validate_email(email):
        if not email:
            raise ValidationError("Email is required", "email")
        
        if "@" not in email:
            raise ValidationError("Invalid email format", "email")
        
        return True
    
    @staticmethod
    def validate_age(age):
        if not isinstance(age, int):
            raise ValidationError("Age must be an integer", "age")
        
        if age < 0 or age > 150:
            raise ValidationError("Age must be between 0 and 150", "age")
        
        return True

# Error handling with multiple exception types
def process_user_registration(user_data):
    try:
        # Validate required fields
        UserValidator.validate_email(user_data.get("email"))
        UserValidator.validate_age(user_data.get("age"))
        
        # Simulate business logic
        if user_data.get("age", 0) < 13:
            raise BusinessLogicError("Users must be at least 13 years old")
        
        return {"status": "success", "user_id": 12345}
        
    except ValidationError as e:
        return {
            "status": "validation_error",
            "message": str(e),
            "field": e.field_name
        }
    
    except BusinessLogicError as e:
        return {
            "status": "business_error",
            "message": str(e)
        }
    
    except Exception as e:
        # Catch-all for unexpected errors
        return {
            "status": "internal_error",
            "message": "An unexpected error occurred"
        }

# Context manager for exception handling
class ErrorHandler:
    def __init__(self, operation_name):
        self.operation_name = operation_name
        self.errors = []
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            error_info = {
                "operation": self.operation_name,
                "exception_type": exc_type.__name__,
                "message": str(exc_val)
            }
            self.errors.append(error_info)
            print(f"Error in {self.operation_name}: {exc_val}")
            return True  # Suppress the exception
        return False

# Usage of error handler context manager
def process_data_with_error_handling():
    results = []
    
    with ErrorHandler("data processing") as handler:
        # Simulate some operations that might fail
        data = [1, 2, "invalid", 4, 5]
        
        for item in data:
            try:
                result = int(item) * 2
                results.append(result)
            except ValueError:
                print(f"Skipping invalid item: {item}")
    
    return results

# Retry mechanism with exponential backoff
import time
import random

def retry_with_backoff(max_retries=3, base_delay=1, max_delay=60):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_retries - 1:
                        # Last attempt, re-raise the exception
                        raise e
                    
                    # Calculate delay with exponential backoff
                    delay = min(base_delay * (2 ** attempt), max_delay)
                    jitter = random.uniform(0, 0.1) * delay
                    total_delay = delay + jitter
                    
                    print(f"Attempt {attempt + 1} failed: {e}")
                    print(f"Retrying in {total_delay:.2f} seconds...")
                    time.sleep(total_delay)
            
        return wrapper
    return decorator

@retry_with_backoff(max_retries=3)
def unreliable_network_call():
    # Simulate a network call that might fail
    if random.random() < 0.7:  # 70% chance of failure
        raise ConnectionError("Network timeout")
    
    return {"status": "success", "data": "Important data"}

# Graceful degradation
class DataService:
    def __init__(self):
        self.cache_enabled = True
        self.fallback_enabled = True
    
    def get_data(self, key):
        # Try primary data source
        try:
            return self._get_from_primary(key)
        except Exception as e:
            print(f"Primary source failed: {e}")
            
            # Try cache
            if self.cache_enabled:
                try:
                    return self._get_from_cache(key)
                except Exception as e:
                    print(f"Cache failed: {e}")
            
            # Try fallback
            if self.fallback_enabled:
                try:
                    return self._get_from_fallback(key)
                except Exception as e:
                    print(f"Fallback failed: {e}")
            
            # All options exhausted
            raise Exception("All data sources unavailable")
    
    def _get_from_primary(self, key):
        # Simulate primary data source
        if random.random() < 0.3:  # 30% failure rate
            raise Exception("Primary source unavailable")
        return f"Primary data for {key}"
    
    def _get_from_cache(self, key):
        # Simulate cache
        if random.random() < 0.1:  # 10% failure rate
            raise Exception("Cache miss")
        return f"Cached data for {key}"
    
    def _get_from_fallback(self, key):
        # Simulate fallback
        return f"Fallback data for {key}"

# Exception logging
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def logged_operation(data):
    try:
        # Some risky operation
        result = process_complex_data(data)
        logger.info(f"Operation completed successfully: {result}")
        return result
        
    except ValidationError as e:
        logger.warning(f"Validation failed: {e}")
        raise
        
    except Exception as e:
        logger.error(f"Unexpected error in logged_operation: {e}", exc_info=True)
        raise

def process_complex_data(data):
    if not data:
        raise ValidationError("Data cannot be empty")
    
    if len(data) > 1000:
        raise ValidationError("Data too large")
    
    return f"Processed {len(data)} items"

# Example usage
try:
    result = process_user_registration({
        "email": "test@example.com",
        "age": 25
    })
    print(result)
except Exception as e:
    print(f"Registration failed: {e}")`,
    difficulty: "intermediate",
    categorySlug: "testing-debugging",
    xpReward: 24,
    estimatedMinutes: 9,
    tags: ["exceptions", "error-handling", "validation", "robustness"],
  },
  {
    title: "Code Quality and Static Analysis",
    content:
      "Maintaining code quality through static analysis tools, linting, and formatting helps prevent bugs and makes code more maintainable. These tools catch issues before runtime.",
    codeExample: `# Code quality tools overview:
# 1. pylint - comprehensive code analysis
# 2. flake8 - style guide enforcement
# 3. black - automatic code formatting
# 4. mypy - static type checking
# 5. bandit - security vulnerability scanner

# Install tools:
# pip install pylint flake8 black mypy bandit

# Example code with various quality issues
import os
import sys

# Bad practices (will be caught by linters)
def badFunction(x,y):  # Bad naming, spacing
    z=x+y  # No spaces around operators
    return z

# Good practices
def calculate_sum(first_number: int, second_number: int) -> int:
    """Calculate the sum of two numbers.
    
    Args:
        first_number: The first number to add
        second_number: The second number to add
        
    Returns:
        The sum of the two numbers
    """
    result = first_number + second_number
    return result

# Type hints for better code quality
from typing import List, Dict, Optional, Union

class UserManager:
    """Manages user operations with proper type hints and documentation."""
    
    def __init__(self) -> None:
        self.users: Dict[int, Dict[str, Union[str, int]]] = {}
        self.next_id: int = 1
    
    def add_user(self, name: str, email: str, age: int) -> int:
        """Add a new user to the system.
        
        Args:
            name: User's full name
            email: User's email address
            age: User's age
            
        Returns:
            The ID of the newly created user
            
        Raises:
            ValueError: If any input is invalid
        """
        if not name or not email:
            raise ValueError("Name and email are required")
        
        if age < 0 or age > 150:
            raise ValueError("Age must be between 0 and 150")
        
        user_id = self.next_id
        self.users[user_id] = {
            "name": name,
            "email": email,
            "age": age
        }
        self.next_id += 1
        
        return user_id
    
    def get_user(self, user_id: int) -> Optional[Dict[str, Union[str, int]]]:
        """Get user by ID.
        
        Args:
            user_id: The ID of the user to retrieve
            
        Returns:
            User data if found, None otherwise
        """
        return self.users.get(user_id)
    
    def get_users_by_age_range(
        self,
        min_age: int,
        max_age: int
    ) -> List[Dict[str, Union[str, int]]]:
        """Get all users within a specific age range.
        
        Args:
            min_age: Minimum age (inclusive)
            max_age: Maximum age (inclusive)
            
        Returns:
            List of users within the age range
        """
        result = []
        for user in self.users.values():
            user_age = user["age"]
            if isinstance(user_age, int) and min_age <= user_age <= max_age:
                result.append(user)
        
        return result

# Configuration for tools (put in separate files)

# .pylintrc configuration example
PYLINT_CONFIG = """
[MASTER]
extension-pkg-whitelist=pydantic

[MESSAGES CONTROL]
disable=missing-docstring,line-too-long

[FORMAT]
max-line-length=88

[DESIGN]
max-args=7
max-locals=15
"""

# setup.cfg for flake8
FLAKE8_CONFIG = """
[flake8]
max-line-length = 88
extend-ignore = E203, W503
exclude = .git,__pycache__,docs/source/conf.py,old,build,dist
"""

# pyproject.toml for black
PYPROJECT_TOML = """
[tool.black]
line-length = 88
target-version = ['py38']
include = '\\.pyi?$'
extend-exclude = '''
/(
  # directories
  \\.eggs
  | \\.git
  | \\.hg
  | \\.mypy_cache
  | \\.tox
  | \\.venv
  | build
  | dist
)/
'''
"""

# mypy configuration in mypy.ini
MYPY_CONFIG = """
[mypy]
python_version = 3.8
warn_return_any = True
warn_unused_configs = True
disallow_untyped_defs = True

[mypy-requests.*]
ignore_missing_imports = True
"""

# Example of code analysis functions
def analyze_code_complexity():
    """Example of measuring code complexity."""
    
    # Simple function (low complexity)
    def simple_function(x):
        return x * 2
    
    # Complex function (high complexity - should be refactored)
    def complex_function(data, filters, options):
        results = []
        if data:
            for item in data:
                if filters:
                    for filter_key, filter_value in filters.items():
                        if item.get(filter_key) == filter_value:
                            if options:
                                if options.get("include_metadata"):
                                    item["metadata"] = {"processed": True}
                                if options.get("sort"):
                                    # Complex sorting logic
                                    pass
                            results.append(item)
                            break
                else:
                    results.append(item)
        return results
    
    # Better approach - split into smaller functions
    def filter_items(items, filters):
        if not filters:
            return items
        
        filtered = []
        for item in items:
            if matches_filters(item, filters):
                filtered.append(item)
        
        return filtered
    
    def matches_filters(item, filters):
        for filter_key, filter_value in filters.items():
            if item.get(filter_key) != filter_value:
                return False
        return True
    
    def add_metadata(items, options):
        if not options or not options.get("include_metadata"):
            return items
        
        for item in items:
            item["metadata"] = {"processed": True}
        
        return items
    
    def process_items_better(data, filters=None, options=None):
        if not data:
            return []
        
        results = filter_items(data, filters)
        results = add_metadata(results, options)
        
        if options and options.get("sort"):
            results = sorted(results, key=lambda x: x.get("name", ""))
        
        return results

# Pre-commit hooks configuration (.pre-commit-config.yaml)
PRE_COMMIT_CONFIG = """
repos:
  - repo: https://github.com/psf/black
    rev: 22.3.0
    hooks:
      - id: black

  - repo: https://github.com/pycqa/flake8
    rev: 4.0.1
    hooks:
      - id: flake8

  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v0.950
    hooks:
      - id: mypy

  - repo: https://github.com/pycqa/bandit
    rev: 1.7.4
    hooks:
      - id: bandit
"""

# Example of docstring standards (Google style)
def example_function(
    param1: str,
    param2: int,
    param3: Optional[bool] = None
) -> Dict[str, Union[str, int]]:
    """Example function with proper documentation.
    
    This function demonstrates proper docstring formatting
    following Google style guidelines.
    
    Args:
        param1: Description of the first parameter
        param2: Description of the second parameter
        param3: Optional description of the third parameter
        
    Returns:
        Dictionary containing processed results with string keys
        and string or integer values
        
    Raises:
        ValueError: If param1 is empty
        TypeError: If param2 is not an integer
        
    Example:
        >>> result = example_function("test", 42)
        >>> print(result["status"])
        success
    """
    if not param1:
        raise ValueError("param1 cannot be empty")
    
    if not isinstance(param2, int):
        raise TypeError("param2 must be an integer")
    
    return {
        "status": "success",
        "input_length": len(param1),
        "multiplied_value": param2 * 2
    }

# Running quality checks:
# pylint your_module.py
# flake8 your_module.py
# black your_module.py
# mypy your_module.py
# bandit -r your_project/`,
    difficulty: "intermediate",
    categorySlug: "testing-debugging",
    xpReward: 26,
    estimatedMinutes: 10,
    tags: ["code-quality", "linting", "static-analysis", "formatting"],
  },

  // Performance & Optimization Tips (4 tips)
  {
    title: "Memory Optimization and Profiling",
    content:
      "Understanding memory usage and optimizing it is crucial for building efficient applications. Python provides tools to monitor and optimize memory consumption.",
    codeExample: `import sys
import gc
import tracemalloc
from memory_profiler import profile

# Memory-efficient data structures
# Use __slots__ to reduce memory overhead
class RegularClass:
    def __init__(self, x, y):
        self.x = x
        self.y = y

class OptimizedClass:
    __slots__ = ['x', 'y']  # Reduces memory overhead
    
    def __init__(self, x, y):
        self.x = x
        self.y = y

# Compare memory usage
def compare_memory_usage():
    import pympler.asizeof as asizeof
    
    regular_obj = RegularClass(1, 2)
    optimized_obj = OptimizedClass(1, 2)
    
    print(f"Regular class size: {asizeof.asizeof(regular_obj)} bytes")
    print(f"Optimized class size: {asizeof.asizeof(optimized_obj)} bytes")

# Memory profiling with tracemalloc
def memory_profiling_example():
    tracemalloc.start()
    
    # Memory-intensive operation
    large_list = []
    for i in range(100000):
        large_list.append(f"Item {i}")
    
    # Get current memory usage
    current, peak = tracemalloc.get_traced_memory()
    print(f"Current memory: {current / 1024 / 1024:.2f} MB")
    print(f"Peak memory: {peak / 1024 / 1024:.2f} MB")
    
    # Get top memory allocations
    snapshot = tracemalloc.take_snapshot()
    top_stats = snapshot.statistics('lineno')
    
    print("Top 3 memory allocations:")
    for stat in top_stats[:3]:
        print(stat)
    
    tracemalloc.stop()

# Generator vs List - memory comparison
def memory_efficient_processing():
    # Memory-intensive (loads all data)
    def process_with_list(n):
        data = [i * i for i in range(n)]
        return sum(data)
    
    # Memory-efficient (processes one at a time)
    def process_with_generator(n):
        data = (i * i for i in range(n))
        return sum(data)
    
    # Compare memory usage
    print("List approach:")
    tracemalloc.start()
    result1 = process_with_list(100000)
    current, peak = tracemalloc.get_traced_memory()
    print(f"Peak memory: {peak / 1024:.2f} KB")
    tracemalloc.stop()
    
    print("\\nGenerator approach:")
    tracemalloc.start()
    result2 = process_with_generator(100000)
    current, peak = tracemalloc.get_traced_memory()
    print(f"Peak memory: {peak / 1024:.2f} KB")
    tracemalloc.stop()

# Object pooling for frequent allocations
class ObjectPool:
    def __init__(self, create_func, reset_func, initial_size=10):
        self.create_func = create_func
        self.reset_func = reset_func
        self.pool = [create_func() for _ in range(initial_size)]
    
    def get(self):
        if self.pool:
            return self.pool.pop()
        return self.create_func()
    
    def release(self, obj):
        self.reset_func(obj)
        self.pool.append(obj)

# Example usage of object pooling
class ExpensiveObject:
    def __init__(self):
        self.data = [0] * 1000  # Simulate expensive object
        self.processed = False
    
    def reset(self):
        self.data = [0] * 1000
        self.processed = False

def create_expensive_object():
    return ExpensiveObject()

def reset_expensive_object(obj):
    obj.reset()

# Use object pool
pool = ObjectPool(create_expensive_object, reset_expensive_object)

def use_object_pool():
    obj = pool.get()
    # Use the object
    obj.processed = True
    # Return to pool when done
    pool.release(obj)

# Weak references to avoid memory leaks
import weakref

class Observer:
    def __init__(self):
        self.observers = weakref.WeakSet()
    
    def add_observer(self, observer):
        self.observers.add(observer)
    
    def notify(self, message):
        for observer in self.observers:
            observer.handle(message)

# Manual garbage collection
def manual_gc_example():
    # Create objects that might create cycles
    class Node:
        def __init__(self, value):
            self.value = value
            self.children = []
            self.parent = None
    
    # Create a structure with potential cycles
    root = Node("root")
    child1 = Node("child1")
    child2 = Node("child2")
    
    root.children = [child1, child2]
    child1.parent = root
    child2.parent = root
    
    # Force garbage collection
    gc.collect()
    
    print(f"Garbage collector stats: {gc.get_stats()}")`,
    difficulty: "advanced",
    categorySlug: "performance",
    xpReward: 28,
    estimatedMinutes: 10,
    tags: ["memory", "profiling", "optimization", "gc"],
  },
  {
    title: "Algorithm Optimization and Big O",
    content:
      "Understanding algorithm complexity and choosing the right data structures can dramatically improve performance. Learn to analyze and optimize your algorithms.",
    codeExample: `import time
from collections import defaultdict, deque
import bisect

# Time complexity examples
def demonstrate_time_complexity():
    # O(1) - Constant time
    def constant_time_operation(data):
        return data[0] if data else None  # Always same time
    
    # O(n) - Linear time
    def linear_search(data, target):
        for i, item in enumerate(data):
            if item == target:
                return i
        return -1
    
    # O(log n) - Logarithmic time
    def binary_search(sorted_data, target):
        left, right = 0, len(sorted_data) - 1
        
        while left <= right:
            mid = (left + right) // 2
            if sorted_data[mid] == target:
                return mid
            elif sorted_data[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        return -1
    
    # O(n log n) - Efficient sorting
    def merge_sort(arr):
        if len(arr) <= 1:
            return arr
        
        mid = len(arr) // 2
        left = merge_sort(arr[:mid])
        right = merge_sort(arr[mid:])
        
        return merge(left, right)
    
    def merge(left, right):
        result = []
        i = j = 0
        
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
        
        result.extend(left[i:])
        result.extend(right[j:])
        return result
    
    # O(n²) - Quadratic time (inefficient for large datasets)
    def bubble_sort(arr):
        n = len(arr)
        for i in range(n):
            for j in range(0, n - i - 1):
                if arr[j] > arr[j + 1]:
                    arr[j], arr[j + 1] = arr[j + 1], arr[j]
        return arr

# Data structure optimization
def optimize_data_structures():
    # Wrong: Using list for frequent lookups
    def slow_membership_test(items, targets):
        results = []
        for target in targets:
            if target in items:  # O(n) for each lookup
                results.append(target)
        return results
    
    # Better: Using set for O(1) lookups
    def fast_membership_test(items, targets):
        item_set = set(items)  # Convert once
        results = []
        for target in targets:
            if target in item_set:  # O(1) for each lookup
                results.append(target)
        return results
    
    # Demonstrate performance difference
    large_list = list(range(10000))
    test_items = [100, 5000, 9999] * 1000
    
    start = time.time()
    slow_result = slow_membership_test(large_list, test_items)
    slow_time = time.time() - start
    
    start = time.time()
    fast_result = fast_membership_test(large_list, test_items)
    fast_time = time.time() - start
    
    print(f"Slow method: {slow_time:.4f} seconds")
    print(f"Fast method: {fast_time:.4f} seconds")
    print(f"Speedup: {slow_time / fast_time:.1f}x")

# Cache optimization
from functools import lru_cache

# Without caching - exponential time complexity
def fibonacci_slow(n):
    if n < 2:
        return n
    return fibonacci_slow(n - 1) + fibonacci_slow(n - 2)

# With caching - linear time complexity
@lru_cache(maxsize=None)
def fibonacci_fast(n):
    if n < 2:
        return n
    return fibonacci_fast(n - 1) + fibonacci_fast(n - 2)

def compare_fibonacci_performance():
    n = 35
    
    start = time.time()
    result_slow = fibonacci_slow(n)
    slow_time = time.time() - start
    
    start = time.time()
    result_fast = fibonacci_fast(n)
    fast_time = time.time() - start
    
    print(f"Fibonacci({n}) = {result_slow}")
    print(f"Without cache: {slow_time:.4f} seconds")
    print(f"With cache: {fast_time:.6f} seconds")
    print(f"Speedup: {slow_time / fast_time:.0f}x")

# Efficient string operations
def string_optimization():
    # Slow: String concatenation in loop
    def slow_string_building(items):
        result = ""
        for item in items:
            result += str(item) + ", "
        return result[:-2]  # Remove last comma
    
    # Fast: Using join
    def fast_string_building(items):
        return ", ".join(str(item) for item in items)
    
    # Even faster: Pre-allocate with list
    def fastest_string_building(items):
        parts = []
        for item in items:
            parts.append(str(item))
        return ", ".join(parts)
    
    test_items = list(range(10000))
    
    start = time.time()
    slow_result = slow_string_building(test_items)
    slow_time = time.time() - start
    
    start = time.time()
    fast_result = fast_string_building(test_items)
    fast_time = time.time() - start
    
    print(f"Slow concatenation: {slow_time:.4f} seconds")
    print(f"Fast join: {fast_time:.4f} seconds")
    print(f"Speedup: {slow_time / fast_time:.1f}x")

# Algorithm selection for different use cases
class OptimizedDataProcessor:
    def __init__(self):
        self.data = []
        self.sorted_data = []
        self.data_set = set()
        self.counter = defaultdict(int)
    
    def add_item(self, item):
        # Choose appropriate data structure for operations
        self.data.append(item)
        self.data_set.add(item)
        self.counter[item] += 1
        
        # Keep sorted version for binary search
        bisect.insort(self.sorted_data, item)
    
    def exists(self, item):
        # O(1) lookup using set
        return item in self.data_set
    
    def find_position(self, item):
        # O(log n) binary search on sorted data
        return bisect.bisect_left(self.sorted_data, item)
    
    def get_frequency(self, item):
        # O(1) lookup using defaultdict
        return self.counter[item]
    
    def get_top_k_frequent(self, k):
        # O(n log k) using heap for top-k
        import heapq
        return heapq.nlargest(k, self.counter.items(), key=lambda x: x[1])

# Batch processing for better performance
def batch_processing_example():
    # Inefficient: Process one at a time
    def process_individually(items):
        results = []
        for item in items:
            # Simulate expensive operation
            processed = expensive_operation(item)
            results.append(processed)
        return results
    
    # Efficient: Process in batches
    def process_in_batches(items, batch_size=100):
        results = []
        for i in range(0, len(items), batch_size):
            batch = items[i:i + batch_size]
            # Process entire batch at once
            batch_results = expensive_batch_operation(batch)
            results.extend(batch_results)
        return results

def expensive_operation(item):
    # Simulate expensive operation
    return item * 2

def expensive_batch_operation(batch):
    # Simulate batch operation (more efficient)
    return [item * 2 for item in batch]

# Memory-efficient iteration
def memory_efficient_file_processing(filename):
    # Bad: Load entire file into memory
    def process_entire_file():
        with open(filename, 'r') as f:
            lines = f.readlines()  # Loads everything
            return [line.strip().upper() for line in lines]
    
    # Good: Process line by line
    def process_line_by_line():
        results = []
        with open(filename, 'r') as f:
            for line in f:  # Generator - one line at a time
                processed = line.strip().upper()
                results.append(processed)
        return results
    
    # Best: Generator function
    def process_as_generator():
        with open(filename, 'r') as f:
            for line in f:
                yield line.strip().upper()

# Performance measurement decorator
def measure_performance(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()
        start_memory = tracemalloc.get_traced_memory()[0]
        
        result = func(*args, **kwargs)
        
        end_time = time.time()
        end_memory = tracemalloc.get_traced_memory()[0]
        
        print(f"{func.__name__}:")
        print(f"  Time: {end_time - start_time:.4f} seconds")
        print(f"  Memory: {(end_memory - start_memory) / 1024:.2f} KB")
        
        return result
    return wrapper`,
    difficulty: "advanced",
    categorySlug: "performance",
    xpReward: 30,
    estimatedMinutes: 12,
    tags: ["algorithms", "big-o", "optimization", "data-structures"],
  },
  {
    title: "Concurrency and Parallel Processing",
    content:
      "Python offers several approaches to concurrency and parallelism. Understanding when to use threading, multiprocessing, or async programming can significantly improve performance.",
    codeExample: `import threading
import multiprocessing
import asyncio
import concurrent.futures
import time
import requests

# Threading for I/O-bound tasks
def threading_example():
    def io_bound_task(task_id, duration):
        print(f"Task {task_id} starting")
        time.sleep(duration)  # Simulate I/O operation
        print(f"Task {task_id} completed")
        return f"Result from task {task_id}"
    
    # Sequential execution
    def sequential_execution():
        start_time = time.time()
        results = []
        for i in range(5):
            result = io_bound_task(i, 1)
            results.append(result)
        
        end_time = time.time()
        print(f"Sequential execution took: {end_time - start_time:.2f} seconds")
        return results
    
    # Threaded execution
    def threaded_execution():
        start_time = time.time()
        results = []
        threads = []
        
        def worker(task_id, duration, results, index):
            result = io_bound_task(task_id, duration)
            results[index] = result
        
        # Pre-allocate results list
        results = [None] * 5
        
        # Create and start threads
        for i in range(5):
            thread = threading.Thread(target=worker, args=(i, 1, results, i))
            threads.append(thread)
            thread.start()
        
        # Wait for all threads to complete
        for thread in threads:
            thread.join()
        
        end_time = time.time()
        print(f"Threaded execution took: {end_time - start_time:.2f} seconds")
        return results

# Multiprocessing for CPU-bound tasks
def multiprocessing_example():
    def cpu_bound_task(n):
        # Simulate CPU-intensive work
        total = 0
        for i in range(n * 1000000):
            total += i * i
        return total
    
    # Sequential execution
    def sequential_cpu_work():
        start_time = time.time()
        results = []
        
        for i in range(4):
            result = cpu_bound_task(100)
            results.append(result)
        
        end_time = time.time()
        print(f"Sequential CPU work took: {end_time - start_time:.2f} seconds")
        return results
    
    # Multiprocessing execution
    def parallel_cpu_work():
        start_time = time.time()
        
        with multiprocessing.Pool() as pool:
            results = pool.map(cpu_bound_task, [100] * 4)
        
        end_time = time.time()
        print(f"Parallel CPU work took: {end_time - start_time:.2f} seconds")
        return results

# AsyncIO for asynchronous programming
async def asyncio_example():
    async def async_fetch(session, url, task_id):
        print(f"Fetching {task_id}")
        try:
            async with session.get(url) as response:
                data = await response.text()
                print(f"Completed {task_id}")
                return len(data)
        except Exception as e:
            print(f"Error in {task_id}: {e}")
            return 0
    
    async def fetch_multiple_urls():
        import aiohttp
        
        urls = [
            "https://httpbin.org/delay/1",
            "https://httpbin.org/delay/1",
            "https://httpbin.org/delay/1",
            "https://httpbin.org/delay/1"
        ]
        
        start_time = time.time()
        
        async with aiohttp.ClientSession() as session:
            tasks = [async_fetch(session, url, i) for i, url in enumerate(urls)]
            results = await asyncio.gather(*tasks)
        
        end_time = time.time()
        print(f"Async execution took: {end_time - start_time:.2f} seconds")
        return results

# ThreadPoolExecutor and ProcessPoolExecutor
def executor_examples():
    def download_url(url):
        response = requests.get(url)
        return len(response.content)
    
    # Using ThreadPoolExecutor for I/O-bound tasks
    def concurrent_downloads():
        urls = [
            "https://httpbin.org/bytes/1024",
            "https://httpbin.org/bytes/2048",
            "https://httpbin.org/bytes/4096"
        ]
        
        start_time = time.time()
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
            future_to_url = {executor.submit(download_url, url): url for url in urls}
            results = []
            
            for future in concurrent.futures.as_completed(future_to_url):
                url = future_to_url[future]
                try:
                    result = future.result()
                    results.append(result)
                    print(f"Downloaded {result} bytes from {url}")
                except Exception as e:
                    print(f"Error downloading {url}: {e}")
        
        end_time = time.time()
        print(f"Concurrent downloads took: {end_time - start_time:.2f} seconds")
        return results
    
    # Using ProcessPoolExecutor for CPU-bound tasks
    def concurrent_computation():
        def fibonacci(n):
            if n < 2:
                return n
            return fibonacci(n-1) + fibonacci(n-2)
        
        numbers = [30, 31, 32, 33]
        start_time = time.time()
        
        with concurrent.futures.ProcessPoolExecutor() as executor:
            results = list(executor.map(fibonacci, numbers))
        
        end_time = time.time()
        print(f"Concurrent computation took: {end_time - start_time:.2f} seconds")
        return results

# Producer-Consumer pattern with queue
def producer_consumer_example():
    import queue
    
    def producer(q, num_items):
        for i in range(num_items):
            item = f"item_{i}"
            q.put(item)
            print(f"Produced: {item}")
            time.sleep(0.1)
        
        # Signal end of production
        q.put(None)
    
    def consumer(q, consumer_id):
        while True:
            item = q.get()
            if item is None:
                q.put(None)  # Re-queue sentinel for other consumers
                break
            
            print(f"Consumer {consumer_id} processing: {item}")
            time.sleep(0.2)  # Simulate processing
            q.task_done()
    
    # Create queue and threads
    q = queue.Queue()
    
    # Start producer
    producer_thread = threading.Thread(target=producer, args=(q, 10))
    producer_thread.start()
    
    # Start consumers
    consumers = []
    for i in range(3):
        consumer_thread = threading.Thread(target=consumer, args=(q, i))
        consumers.append(consumer_thread)
        consumer_thread.start()
    
    # Wait for completion
    producer_thread.join()
    q.join()  # Wait for all tasks to be done

# Thread-safe operations
class ThreadSafeCounter:
    def __init__(self):
        self._count = 0
        self._lock = threading.Lock()
    
    def increment(self):
        with self._lock:
            self._count += 1
    
    def get_count(self):
        with self._lock:
            return self._count

def thread_safety_example():
    counter = ThreadSafeCounter()
    
    def worker():
        for _ in range(1000):
            counter.increment()
    
    # Create multiple threads
    threads = []
    for _ in range(10):
        thread = threading.Thread(target=worker)
        threads.append(thread)
        thread.start()
    
    # Wait for all threads
    for thread in threads:
        thread.join()
    
    print(f"Final count: {counter.get_count()}")  # Should be 10,000

# Performance comparison
def compare_concurrency_approaches():
    def cpu_task(n):
        return sum(i*i for i in range(n))
    
    def io_task():
        time.sleep(0.1)
        return "completed"
    
    # Test different approaches
    tasks = [100000] * 4
    
    print("CPU-bound tasks:")
    
    # Sequential
    start = time.time()
    results = [cpu_task(n) for n in tasks]
    print(f"Sequential: {time.time() - start:.2f}s")
    
    # Multiprocessing
    start = time.time()
    with multiprocessing.Pool() as pool:
        results = pool.map(cpu_task, tasks)
    print(f"Multiprocessing: {time.time() - start:.2f}s")
    
    print("\\nI/O-bound tasks:")
    
    # Sequential
    start = time.time()
    results = [io_task() for _ in range(10)]
    print(f"Sequential: {time.time() - start:.2f}s")
    
    # Threading
    start = time.time()
    with concurrent.futures.ThreadPoolExecutor() as executor:
        results = list(executor.map(lambda _: io_task(), range(10)))
    print(f"Threading: {time.time() - start:.2f}s")`,
    difficulty: "advanced",
    categorySlug: "performance",
    xpReward: 32,
    estimatedMinutes: 14,
    tags: ["concurrency", "threading", "multiprocessing", "asyncio"],
  },
  {
    title: "Code Profiling and Performance Monitoring",
    content:
      "Identifying performance bottlenecks requires proper profiling tools. Learn to measure, analyze, and optimize your code's performance systematically.",
    codeExample: `import cProfile
import pstats
import time
import functools
from line_profiler import LineProfiler

# Basic timing decorator
def timer(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        end_time = time.perf_counter()
        print(f"{func.__name__} took {end_time - start_time:.6f} seconds")
        return result
    return wrapper

# Performance monitoring class
class PerformanceMonitor:
    def __init__(self):
        self.timings = {}
        self.call_counts = {}
    
    def time_function(self, func_name):
        def decorator(func):
            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                start_time = time.perf_counter()
                result = func(*args, **kwargs)
                end_time = time.perf_counter()
                
                execution_time = end_time - start_time
                
                if func_name not in self.timings:
                    self.timings[func_name] = []
                    self.call_counts[func_name] = 0
                
                self.timings[func_name].append(execution_time)
                self.call_counts[func_name] += 1
                
                return result
            return wrapper
        return decorator
    
    def get_stats(self):
        stats = {}
        for func_name, times in self.timings.items():
            stats[func_name] = {
                'total_time': sum(times),
                'average_time': sum(times) / len(times),
                'min_time': min(times),
                'max_time': max(times),
                'call_count': self.call_counts[func_name]
            }
        return stats
    
    def print_stats(self):
        print("\\nPerformance Statistics:")
        print("-" * 60)
        for func_name, stats in self.get_stats().items():
            print(f"Function: {func_name}")
            print(f"  Total time: {stats['total_time']:.6f}s")
            print(f"  Average time: {stats['average_time']:.6f}s")
            print(f"  Min time: {stats['min_time']:.6f}s")
            print(f"  Max time: {stats['max_time']:.6f}s")
            print(f"  Call count: {stats['call_count']}")
            print()

# Example usage of performance monitor
monitor = PerformanceMonitor()

@monitor.time_function("data_processing")
@timer
def process_data(data):
    # Simulate data processing
    result = []
    for item in data:
        result.append(item * 2 + 1)
    return result

@monitor.time_function("data_analysis")
@timer
def analyze_data(data):
    # Simulate data analysis
    return {
        'sum': sum(data),
        'avg': sum(data) / len(data),
        'max': max(data),
        'min': min(data)
    }

# cProfile usage
def profile_with_cprofile():
    def slow_function():
        # Simulate slow operations
        time.sleep(0.1)
        return sum(i*i for i in range(10000))
    
    def another_slow_function():
        time.sleep(0.05)
        return [i for i in range(5000) if i % 2 == 0]
    
    def main_function():
        result1 = slow_function()
        result2 = another_slow_function()
        return result1, len(result2)
    
    # Profile the code
    profiler = cProfile.Profile()
    profiler.enable()
    
    result = main_function()
    
    profiler.disable()
    
    # Analyze results
    stats = pstats.Stats(profiler)
    stats.sort_stats('cumulative')
    stats.print_stats(10)  # Top 10 functions
    
    return result

# Memory profiling
import tracemalloc

class MemoryProfiler:
    def __init__(self):
        self.snapshots = []
    
    def start(self):
        tracemalloc.start()
    
    def take_snapshot(self, label):
        snapshot = tracemalloc.take_snapshot()
        self.snapshots.append((label, snapshot))
    
    def compare_snapshots(self, label1, label2):
        snap1 = None
        snap2 = None
        
        for label, snapshot in self.snapshots:
            if label == label1:
                snap1 = snapshot
            elif label == label2:
                snap2 = snapshot
        
        if snap1 and snap2:
            top_stats = snap2.compare_to(snap1, 'lineno')
            print(f"\\nMemory comparison: {label1} -> {label2}")
            print("Top 10 differences:")
            for stat in top_stats[:10]:
                print(stat)
    
    def print_current_usage(self):
        current, peak = tracemalloc.get_traced_memory()
        print(f"Current memory usage: {current / 1024 / 1024:.2f} MB")
        print(f"Peak memory usage: {peak / 1024 / 1024:.2f} MB")

# Line profiling (requires line_profiler package)
def line_profiling_example():
    profiler = LineProfiler()
    
    @profiler
    def function_to_profile():
        # This function will be profiled line by line
        data = []
        for i in range(1000):
            data.append(i * 2)  # Line 1
        
        result = sum(data)  # Line 2
        
        processed = []
        for item in data:  # Line 3
            if item % 4 == 0:  # Line 4
                processed.append(item)  # Line 5
        
        return result, len(processed)
    
    # Run the function
    result = function_to_profile()
    
    # Print line-by-line profile
    profiler.print_stats()
    
    return result

# Context manager for profiling
class ProfileContext:
    def __init__(self, name, enable_memory=True):
        self.name = name
        self.enable_memory = enable_memory
        self.profiler = cProfile.Profile()
    
    def __enter__(self):
        if self.enable_memory:
            tracemalloc.start()
        
        self.start_time = time.perf_counter()
        self.profiler.enable()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.profiler.disable()
        self.end_time = time.perf_counter()
        
        print(f"\\nProfile results for: {self.name}")
        print(f"Execution time: {self.end_time - self.start_time:.6f} seconds")
        
        if self.enable_memory:
            current, peak = tracemalloc.get_traced_memory()
            print(f"Peak memory usage: {peak / 1024 / 1024:.2f} MB")
            tracemalloc.stop()
        
        # Show top functions
        stats = pstats.Stats(self.profiler)
        stats.sort_stats('cumulative')
        stats.print_stats(5)

# Example usage of profiling tools
def demonstrate_profiling():
    # Basic timing
    data = list(range(100000))
    
    processed = process_data(data)
    analysis = analyze_data(processed)
    
    # Show performance monitor stats
    monitor.print_stats()
    
    # Memory profiling example
    memory_profiler = MemoryProfiler()
    memory_profiler.start()
    
    memory_profiler.take_snapshot("start")
    
    # Create large data structure
    large_data = [i * i for i in range(100000)]
    
    memory_profiler.take_snapshot("after_creation")
    
    # Process data
    processed_data = [x for x in large_data if x % 2 == 0]
    
    memory_profiler.take_snapshot("after_processing")
    
    # Compare memory usage
    memory_profiler.compare_snapshots("start", "after_creation")
    memory_profiler.compare_snapshots("after_creation", "after_processing")
    
    # Context manager profiling
    with ProfileContext("complex_operation"):
        result = complex_operation(1000)

def complex_operation(n):
    # Simulate complex operation
    data = []
    for i in range(n):
        for j in range(100):
            data.append(i * j)
    
    return sum(data)

# Performance regression testing
class PerformanceTest:
    def __init__(self, tolerance=0.1):  # 10% tolerance
        self.tolerance = tolerance
        self.baselines = {}
    
    def set_baseline(self, test_name, func, *args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        end_time = time.perf_counter()
        
        execution_time = end_time - start_time
        self.baselines[test_name] = execution_time
        
        print(f"Baseline set for {test_name}: {execution_time:.6f}s")
        return result
    
    def test_performance(self, test_name, func, *args, **kwargs):
        if test_name not in self.baselines:
            raise ValueError(f"No baseline set for {test_name}")
        
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        end_time = time.perf_counter()
        
        execution_time = end_time - start_time
        baseline = self.baselines[test_name]
        
        ratio = execution_time / baseline
        
        if ratio > (1 + self.tolerance):
            print(f"PERFORMANCE REGRESSION in {test_name}!")
            print(f"  Current: {execution_time:.6f}s")
            print(f"  Baseline: {baseline:.6f}s")
            print(f"  Ratio: {ratio:.2f}x slower")
        else:
            print(f"Performance OK for {test_name} (ratio: {ratio:.2f})")
        
        return result

# Usage example
perf_test = PerformanceTest()

# Set baseline
test_data = list(range(50000))
perf_test.set_baseline("data_processing", process_data, test_data)

# Test performance (simulate after code changes)
perf_test.test_performance("data_processing", process_data, test_data)`,
    difficulty: "advanced",
    categorySlug: "performance",
    xpReward: 34,
    estimatedMinutes: 15,
    tags: ["profiling", "monitoring", "performance-testing", "optimization"],
  },
];

// Main seed function
async function seedPythonTips() {
  try {
    console.log("🌱 Seeding Python tip categories...");

    // First, create/update categories
    for (const category of categories) {
      await prisma.pythonTipCategory.upsert({
        where: { slug: category.slug },
        update: category,
        create: category,
      });
    }

    console.log(`✅ ${categories.length} categories created/updated`);

    console.log("🌱 Seeding Python tips...");

    // Then create tips and link to categories
    let successCount = 0;
    let errorCount = 0;

    for (const tip of pythonTips) {
      try {
        const { categorySlug, tags, ...tipData } = tip;
        await prisma.pythonTip.create({
          data: {
            ...tipData,
            tags: tags ? tags.join(", ") : null,
            category: {
              connect: { slug: categorySlug },
            },
          },
        });
        successCount++;
      } catch (error) {
        console.error(`❌ Error creating tip: ${tip.title}`, error.message);
        errorCount++;
      }
    }

    console.log(`✅ ${successCount} Python tips created successfully`);
    if (errorCount > 0) {
      console.log(`❌ ${errorCount} tips failed to create`);
    }
  } catch (error) {
    console.error("❌ Error seeding Python tips:", error);
    throw error;
  }
}

module.exports = { seedPythonTips };

// Run if called directly
if (require.main === module) {
  seedPythonTips()
    .then(() => {
      console.log("✅ Python tips seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error seeding Python tips:", error);
      process.exit(1);
    })
    .finally(() => {
      prisma.$disconnect();
    });
}
