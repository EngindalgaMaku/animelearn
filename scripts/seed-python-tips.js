const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  {
    name: "Basics",
    slug: "basics",
    description: "Fundamental Python concepts",
    color: "#3B82F6",
    icon: "📚",
    sortOrder: 1
  },
  {
    name: "Data Structures",
    slug: "data-structures", 
    description: "Lists, dictionaries, sets, and tuples",
    color: "#10B981",
    icon: "🗂️",
    sortOrder: 2
  },
  {
    name: "Functions",
    slug: "functions",
    description: "Function definitions and best practices",
    color: "#F59E0B",
    icon: "⚡",
    sortOrder: 3
  },
  {
    name: "OOP",
    slug: "oop",
    description: "Object-oriented programming concepts",
    color: "#EF4444",
    icon: "🏗️",
    sortOrder: 4
  },
  {
    name: "Advanced",
    slug: "advanced",
    description: "Advanced Python topics",
    color: "#8B5CF6",
    icon: "🚀",
    sortOrder: 5
  }
];

const tips = [
  // Basics
  {
    title: "Python Variables and Assignment",
    content: "Variables in Python are created when you assign a value to them. Python is dynamically typed, so you don't need to declare the variable type explicitly.",
    codeExample: `# Variable assignment
name = "Alice"
age = 25
height = 5.6
is_student = True

# Multiple assignment
x, y, z = 1, 2, 3

# Check variable type
print(type(name))  # <class 'str'>`,
    difficulty: "beginner",
    categorySlug: "basics",
    xpReward: 10,
    estimatedMinutes: 3,
    tags: '["variables", "assignment", "types"]',
    publishDate: new Date()
  },
  {
    title: "Python String Methods",
    content: "Python strings have many built-in methods that make text manipulation easy and powerful.",
    codeExample: `text = "Hello, World!"

# Common string methods
print(text.upper())        # HELLO, WORLD!
print(text.lower())        # hello, world!
print(text.replace("World", "Python"))  # Hello, Python!
print(text.split(","))     # ['Hello', ' World!']
print(text.strip())        # Removes whitespace
print(len(text))           # 13`,
    difficulty: "beginner",
    categorySlug: "basics",
    xpReward: 15,
    estimatedMinutes: 4,
    tags: '["strings", "methods", "text"]',
    publishDate: new Date()
  },

  // Data Structures
  {
    title: "List Comprehensions",
    content: "List comprehensions provide a concise way to create lists. They're more readable and often faster than traditional for loops.",
    codeExample: `# Traditional way
squares = []
for x in range(10):
    squares.append(x**2)

# List comprehension
squares = [x**2 for x in range(10)]

# With condition
even_squares = [x**2 for x in range(10) if x % 2 == 0]

# Nested comprehension
matrix = [[j for j in range(3)] for i in range(3)]`,
    difficulty: "intermediate",
    categorySlug: "data-structures",
    xpReward: 20,
    estimatedMinutes: 5,
    tags: '["lists", "comprehensions", "loops"]',
    publishDate: new Date()
  },
  {
    title: "Dictionary Tips and Tricks",
    content: "Dictionaries are Python's built-in associative data type. Here are some powerful ways to work with them.",
    codeExample: `# Dictionary creation
person = {"name": "Alice", "age": 30, "city": "New York"}

# Get with default value
age = person.get("age", 0)

# Dictionary comprehension
squares = {x: x**2 for x in range(5)}

# Merge dictionaries (Python 3.9+)
dict1 = {"a": 1, "b": 2}
dict2 = {"c": 3, "d": 4}
merged = dict1 | dict2

# Check if key exists
if "name" in person:
    print(person["name"])`,
    difficulty: "intermediate",
    categorySlug: "data-structures",
    xpReward: 18,
    estimatedMinutes: 4,
    tags: '["dictionaries", "data", "structures"]',
    publishDate: new Date()
  },

  // Functions
  {
    title: "Function Arguments and Parameters",
    content: "Python functions support various types of arguments: positional, keyword, default, *args, and **kwargs.",
    codeExample: `# Default parameters
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

# *args for variable positional arguments
def sum_all(*args):
    return sum(args)

# **kwargs for variable keyword arguments
def create_profile(**kwargs):
    return {key: value for key, value in kwargs.items()}

# Usage examples
print(greet("Alice"))                    # Hello, Alice!
print(greet("Bob", "Hi"))               # Hi, Bob!
print(sum_all(1, 2, 3, 4))              # 10
print(create_profile(name="Alice", age=25))  # {'name': 'Alice', 'age': 25}`,
    difficulty: "intermediate",
    categorySlug: "functions",
    xpReward: 22,
    estimatedMinutes: 6,
    tags: '["functions", "arguments", "parameters"]',
    publishDate: new Date()
  },
  {
    title: "Lambda Functions and Map/Filter",
    content: "Lambda functions are small anonymous functions. They're often used with map(), filter(), and reduce().",
    codeExample: `# Lambda function
square = lambda x: x**2
print(square(5))  # 25

# With map()
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))
print(squared)  # [1, 4, 9, 16, 25]

# With filter()
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
print(even_numbers)  # [2, 4]

# Sorting with lambda
students = [("Alice", 85), ("Bob", 90), ("Charlie", 78)]
students.sort(key=lambda x: x[1])  # Sort by grade
print(students)  # [('Charlie', 78), ('Alice', 85), ('Bob', 90)]`,
    difficulty: "intermediate",
    categorySlug: "functions",
    xpReward: 25,
    estimatedMinutes: 5,
    tags: '["lambda", "map", "filter", "functional"]',
    publishDate: new Date()
  },

  // OOP
  {
    title: "Classes and Objects Basics",
    content: "Classes are blueprints for creating objects. Objects are instances of classes with their own data and methods.",
    codeExample: `class Dog:
    # Class variable
    species = "Canis familiaris"
    
    def __init__(self, name, age):
        # Instance variables
        self.name = name
        self.age = age
    
    def bark(self):
        return f"{self.name} says Woof!"
    
    def __str__(self):
        return f"{self.name} is {self.age} years old"

# Create objects
buddy = Dog("Buddy", 3)
max_dog = Dog("Max", 5)

print(buddy.bark())     # Buddy says Woof!
print(str(buddy))       # Buddy is 3 years old
print(buddy.species)    # Canis familiaris`,
    difficulty: "intermediate",
    categorySlug: "oop",
    xpReward: 30,
    estimatedMinutes: 7,
    tags: '["classes", "objects", "oop", "methods"]',
    publishDate: new Date()
  },

  // Advanced
  {
    title: "Context Managers and 'with' Statement",
    content: "Context managers handle resource management automatically. The 'with' statement ensures proper cleanup.",
    codeExample: `# File handling with context manager
with open('file.txt', 'r') as file:
    content = file.read()
    # File automatically closed after this block

# Custom context manager
class Timer:
    def __enter__(self):
        import time
        self.start = time.time()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        import time
        print(f"Elapsed: {time.time() - self.start:.2f}s")

# Usage
with Timer():
    # Your code here
    sum(range(1000000))

# Using contextlib
from contextlib import contextmanager

@contextmanager
def managed_resource():
    print("Acquiring resource")
    try:
        yield "resource"
    finally:
        print("Releasing resource")`,
    difficulty: "advanced",
    categorySlug: "advanced",
    xpReward: 35,
    estimatedMinutes: 8,
    tags: '["context-managers", "with", "resources"]',
    publishDate: new Date()
  },
  {
    title: "Decorators in Python",
    content: "Decorators are a powerful feature that allows you to modify or extend functions without changing their code.",
    codeExample: `# Simple decorator
def my_decorator(func):
    def wrapper():
        print("Before function call")
        func()
        print("After function call")
    return wrapper

@my_decorator
def say_hello():
    print("Hello!")

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

# Built-in decorators
class MyClass:
    @staticmethod
    def static_method():
        return "This is a static method"
    
    @classmethod
    def class_method(cls):
        return f"This is a class method of {cls.__name__}"`,
    difficulty: "advanced",
    categorySlug: "advanced",
    xpReward: 40,
    estimatedMinutes: 10,
    tags: '["decorators", "functions", "advanced"]',
    publishDate: new Date()
  }
];

async function main() {
  console.log('🌱 Seeding Python tips...');

  try {
    // Create categories
    console.log('📚 Creating categories...');
    for (const category of categories) {
      await prisma.pythonTipCategory.upsert({
        where: { slug: category.slug },
        update: category,
        create: category
      });
      console.log(`✅ Created category: ${category.name}`);
    }

    // Create tips
    console.log('💡 Creating tips...');
    for (const tip of tips) {
      const category = await prisma.pythonTipCategory.findUnique({
        where: { slug: tip.categorySlug }
      });

      if (!category) {
        console.log(`❌ Category not found: ${tip.categorySlug}`);
        continue;
      }

      const tipData = {
        ...tip,
        categoryId: category.id,
        categorySlug: undefined
      };

      await prisma.pythonTip.upsert({
        where: { slug: tip.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') },
        update: tipData,
        create: {
          ...tipData,
          slug: tip.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        }
      });
      console.log(`✅ Created tip: ${tip.title}`);
    }

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();