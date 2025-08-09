const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  {
    name: "Python Basics",
    slug: "python-basics",
    description: "Fundamental Python concepts for beginners",
    color: "#10B981",
    icon: "🐍"
  },
  {
    name: "Data Structures",
    slug: "data-structures", 
    description: "Lists, dictionaries, sets, and tuples",
    color: "#3B82F6",
    icon: "📊"
  },
  {
    name: "Functions & Modules",
    slug: "functions-modules",
    description: "Functions, parameters, and importing modules",
    color: "#8B5CF6",
    icon: "⚙️"
  },
  {
    name: "Object-Oriented Programming",
    slug: "oop",
    description: "Classes, objects, inheritance, and polymorphism",
    color: "#F59E0B", 
    icon: "🏗️"
  },
  {
    name: "File Operations",
    slug: "file-operations",
    description: "Reading and writing files in Python",
    color: "#EF4444",
    icon: "📁"
  },
  {
    name: "Best Practices",
    slug: "best-practices",
    description: "Python coding best practices and tips",
    color: "#06B6D4",
    icon: "✨"
  }
];

const pythonTips = [
  // Python Basics Tips
  {
    title: "Understanding Python Variables",
    content: "In Python, variables are containers for storing data values. Unlike other programming languages, Python has no command for declaring a variable. A variable is created the moment you first assign a value to it. Python is dynamically typed, which means you don't need to specify the data type.",
    codeExample: `# Creating variables
name = "Alice"
age = 25
height = 5.7
is_student = True

# Python automatically determines the type
print(type(name))    # <class 'str'>
print(type(age))     # <class 'int'>
print(type(height))  # <class 'float'>
print(type(is_student)) # <class 'bool'>`,
    difficulty: "beginner",
    categorySlug: "python-basics",
    xpReward: 10,
    estimatedMinutes: 3,
    tags: ["variables", "types", "basics"]
  },
  {
    title: "Python String Formatting Made Easy",
    content: "Python offers several ways to format strings. The most modern and readable approach is using f-strings (formatted string literals), introduced in Python 3.6. F-strings provide a concise and readable way to include expressions inside string literals.",
    codeExample: `# F-string formatting (Python 3.6+)
name = "Bob"
age = 30
score = 95.5

# Clean and readable
message = f"Hello {name}, you are {age} years old and scored {score:.1f}%"
print(message)

# You can even include expressions
print(f"Next year, {name} will be {age + 1} years old")

# Older methods (still valid but less preferred)
message_old = "Hello {}, you are {} years old".format(name, age)
message_oldest = "Hello %s, you are %d years old" % (name, age)`,
    difficulty: "beginner",
    categorySlug: "python-basics",
    xpReward: 15,
    estimatedMinutes: 4,
    tags: ["strings", "formatting", "f-strings"]
  },
  {
    title: "List Comprehensions: Pythonic Way to Create Lists",
    content: "List comprehensions provide a concise way to create lists. They're more readable and often faster than traditional for loops. The basic syntax is: [expression for item in iterable if condition]",
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
uppercase = [word.upper() for word in words if len(word) > 5]`,
    difficulty: "intermediate",
    categorySlug: "data-structures",
    xpReward: 20,
    estimatedMinutes: 5,
    tags: ["lists", "comprehensions", "loops"]
  },
  {
    title: "Dictionary Tricks and Best Practices",
    content: "Dictionaries are one of Python's most powerful data structures. Here are some advanced techniques to work with them more effectively, including the get() method, dictionary comprehensions, and merging dictionaries.",
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

# Counter for counting items
from collections import Counter
text = "hello world"
letter_count = Counter(text)
print(letter_count)  # Counter({'l': 3, 'o': 2, 'h': 1, ...})`,
    difficulty: "intermediate",
    categorySlug: "data-structures",
    xpReward: 18,
    estimatedMinutes: 6,
    tags: ["dictionaries", "collections", "data-structures"]
  },
  {
    title: "Function Parameters: *args and **kwargs Explained",
    content: "Understanding *args and **kwargs is crucial for writing flexible Python functions. *args allows a function to accept any number of positional arguments, while **kwargs allows any number of keyword arguments.",
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
print_info(**info)  # Unpacking dictionary`,
    difficulty: "advanced",
    categorySlug: "functions-modules",
    xpReward: 25,
    estimatedMinutes: 7,
    tags: ["functions", "parameters", "args", "kwargs"]
  },
  {
    title: "Class Properties and Decorators",
    content: "Python's @property decorator allows you to define methods that can be accessed like attributes. This is useful for data validation, computed properties, and maintaining backward compatibility when refactoring.",
    codeExample: `class Temperature:
    def __init__(self, celsius=0):
        self._celsius = celsius
    
    @property
    def celsius(self):
        return self._celsius
    
    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Temperature below absolute zero is not possible")
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

# Usage
temp = Temperature(25)
print(f"Celsius: {temp.celsius}°C")
print(f"Fahrenheit: {temp.fahrenheit}°F")
print(f"Kelvin: {temp.kelvin}K")

temp.fahrenheit = 100  # Sets celsius internally
print(f"New Celsius: {temp.celsius}°C")`,
    difficulty: "advanced",
    categorySlug: "oop",
    xpReward: 30,
    estimatedMinutes: 8,
    tags: ["classes", "properties", "decorators", "oop"]
  },
  {
    title: "Context Managers and File Handling",
    content: "The 'with' statement in Python is used to create context managers that automatically handle resource cleanup. This is especially useful for file operations, ensuring files are properly closed even if an error occurs.",
    codeExample: `# Proper way to handle files
with open('example.txt', 'w') as file:
    file.write('Hello, World!')
# File is automatically closed here, even if an error occurred

# Reading files safely
try:
    with open('data.txt', 'r') as file:
        content = file.read()
        print(content)
except FileNotFoundError:
    print("File not found!")

# Creating your own context manager
class DatabaseConnection:
    def __enter__(self):
        print("Connecting to database...")
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Closing database connection...")
        if exc_type:
            print(f"An error occurred: {exc_val}")
    
    def query(self, sql):
        return f"Executing: {sql}"

# Using custom context manager
with DatabaseConnection() as db:
    result = db.query("SELECT * FROM users")
    print(result)`,
    difficulty: "intermediate",
    categorySlug: "file-operations",
    xpReward: 22,
    estimatedMinutes: 6,
    tags: ["files", "context-managers", "with-statement"]
  },
  {
    title: "Python Naming Conventions and PEP 8",
    content: "Following Python's naming conventions makes your code more readable and maintainable. PEP 8 is the official style guide for Python code and provides guidelines for naming variables, functions, classes, and more.",
    codeExample: `# Variables and functions: snake_case
user_name = "alice"
total_score = 100

def calculate_average(numbers):
    return sum(numbers) / len(numbers)

# Classes: PascalCase
class UserAccount:
    def __init__(self, username):
        self.username = username
        self._private_data = []  # Single underscore for "internal use"
        self.__secret = "hidden"  # Double underscore for name mangling

# Constants: UPPER_CASE
MAX_CONNECTIONS = 100
API_BASE_URL = "https://api.example.com"

# Modules and packages: lowercase with underscores
import json_parser
from my_package import utility_functions

# Avoid these naming patterns:
# - Single character names (except for loops: i, j, k)
# - Names that are too similar: data1, data2
# - Built-in names: list, dict, str, etc.

# Good naming examples
def get_user_by_id(user_id):
    pass

class EmailValidator:
    pass

TIMEOUT_SECONDS = 30`,
    difficulty: "beginner",
    categorySlug: "best-practices",
    xpReward: 12,
    estimatedMinutes: 4,
    tags: ["pep8", "naming", "conventions", "style"]
  },
  {
    title: "Error Handling Best Practices",
    content: "Proper error handling is crucial for writing robust Python applications. Use specific exception types, avoid bare except clauses, and always clean up resources properly.",
    codeExample: `# Specific exception handling
def divide_numbers(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        print("Cannot divide by zero!")
        return None
    except TypeError:
        print("Both arguments must be numbers!")
        return None

# Multiple exceptions
def process_data(filename):
    try:
        with open(filename, 'r') as file:
            data = json.load(file)
            return data['results']
    except FileNotFoundError:
        print(f"File {filename} not found")
    except json.JSONDecodeError:
        print("Invalid JSON format")
    except KeyError as e:
        print(f"Missing key: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise  # Re-raise for debugging

# Using finally for cleanup
def risky_operation():
    resource = None
    try:
        resource = acquire_resource()
        # Do something risky
        return process(resource)
    except Exception as e:
        log_error(e)
        raise
    finally:
        if resource:
            cleanup_resource(resource)

# Custom exceptions
class ValidationError(Exception):
    """Raised when data validation fails"""
    pass

def validate_email(email):
    if '@' not in email:
        raise ValidationError(f"Invalid email format: {email}")`,
    difficulty: "intermediate",
    categorySlug: "best-practices",
    xpReward: 20,
    estimatedMinutes: 7,
    tags: ["exceptions", "error-handling", "try-except"]
  },
  {
    title: "Python Generators and Memory Efficiency",
    content: "Generators are a powerful feature for creating memory-efficient iterators. They generate values on-demand instead of storing everything in memory, making them perfect for processing large datasets.",
    codeExample: `# Generator function with yield
def fibonacci_generator(n):
    a, b = 0, 1
    count = 0
    while count < n:
        yield a
        a, b = b, a + b
        count += 1

# Using the generator
fib = fibonacci_generator(10)
for num in fib:
    print(num, end=" ")

# Generator expressions (like list comprehensions)
squares_gen = (x**2 for x in range(1000000))  # Memory efficient!
squares_list = [x**2 for x in range(1000000)]  # Uses lots of memory

# Reading large files efficiently
def read_large_file(file_path):
    with open(file_path, 'r') as file:
        for line in file:
            yield line.strip()

# Processing data in chunks
def process_data_stream(data_source):
    batch = []
    for item in data_source:
        batch.append(item)
        if len(batch) >= 100:  # Process in batches of 100
            yield batch
            batch = []
    if batch:  # Don't forget the last batch
        yield batch

# Generator vs List comparison
import sys
gen = (x for x in range(1000))
lst = [x for x in range(1000)]
print(f"Generator size: {sys.getsizeof(gen)} bytes")
print(f"List size: {sys.getsizeof(lst)} bytes")`,
    difficulty: "advanced",
    categorySlug: "best-practices",
    xpReward: 28,
    estimatedMinutes: 8,
    tags: ["generators", "yield", "memory", "efficiency"]
  }
];

async function seedPythonTips() {
  try {
    console.log('🌱 Starting Python Tips seeding...');

    // Create categories first
    console.log('📂 Creating categories...');
    const createdCategories = {};
    
    for (const category of categories) {
      const created = await prisma.pythonTipCategory.upsert({
        where: { slug: category.slug },
        update: category,
        create: category,
      });
      createdCategories[category.slug] = created.id;
      console.log(`✅ Created category: ${category.name}`);
    }

    // Create tips
    console.log('💡 Creating Python tips...');
    
    for (const tip of pythonTips) {
      const categoryId = createdCategories[tip.categorySlug];
      if (!categoryId) {
        console.log(`❌ Category not found for tip: ${tip.title}`);
        continue;
      }

      const { categorySlug, ...tipData } = tip;
      const slug = tip.title.toLowerCase()
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, '-');
      
      const created = await prisma.pythonTip.upsert({
        where: { slug },
        update: {
          ...tipData,
          categoryId,
          tags: JSON.stringify(tip.tags),
          metaDescription: tip.content.substring(0, 160) + "...",
        },
        create: {
          ...tipData,
          categoryId,
          publishDate: new Date(),
          slug,
          tags: JSON.stringify(tip.tags),
          metaDescription: tip.content.substring(0, 160) + "...",
        },
      });
      
      console.log(`✅ Upserted tip: ${tip.title}`);
    }

    // Create today's daily tip
    console.log('📅 Setting up daily tip...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get a random tip for today
    const tips = await prisma.pythonTip.findMany({
      where: { isActive: true },
    });

    if (tips.length > 0) {
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      
      // Check if daily tip already exists for today
      const existingDailyTip = await prisma.dailyPythonTip.findFirst({
        where: {
          date: today,
        },
      });

      if (!existingDailyTip) {
        await prisma.dailyPythonTip.create({
          data: {
            tipId: randomTip.id,
            date: today,
            isActive: true,
          },
        });
        console.log(`📅 Set daily tip: ${randomTip.title}`);
      } else {
        console.log(`📅 Daily tip already exists for today`);
      }
    }

    console.log('🎉 Python Tips seeding completed successfully!');
    console.log(`📊 Created ${categories.length} categories and ${pythonTips.length} tips`);
    
  } catch (error) {
    console.error('❌ Error seeding Python tips:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeder
if (require.main === module) {
  seedPythonTips()
    .then(() => {
      console.log('✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedPythonTips };