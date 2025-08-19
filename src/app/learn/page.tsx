"use client";

import { useState, useEffect, type ReactNode } from "react";
import {
  BookOpen,
  Code,
  Search,
  ArrowRight,
  Clock,
  Diamond,
  Star,
  Play,
  CheckCircle,
  Lock,
  Users,
  Trophy,
  Target,
  Zap,
  Brain,
  Gamepad2,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

// Enhanced lesson interface with challenge connections
interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  difficulty: number;
  duration: number;
  category: string;
  diamondReward: number;
  experienceReward: number;
  isCompleted?: boolean;
  relatedChallenges: Challenge[];
  prerequisites?: string[];
}

interface Challenge {
  id: string;
  title: string;
  difficulty: number;
  diamondReward: number;
  experienceReward: number;
  estimatedMinutes: number;
  activityType: string;
  isCompleted?: boolean;
  userProgress?: any;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  lessons: Lesson[];
  challenges: Challenge[];
  totalLessons: number;
  completedLessons: number;
  totalChallenges: number;
  completedChallenges: number;
  overallProgress: number;
  isUnlocked: boolean;
  prerequisites?: string[];
}

// Topic configuration with enhanced lessons
const topicConfig = {
  "Python Fundamentals": {
    icon: "🐍",
    color: "from-green-500 to-emerald-600",
    gradient: "from-green-50 to-emerald-50",
    description:
      "Master Python basics: variables, conditions, loops, and functions",
    lessons: [
      {
        title: "Python Basics & Your First Program",
        slug: "python-basics-first-program",
        content: `# 🚀 Welcome to Python Programming!

Python is one of the most popular and beginner-friendly programming languages in the world. Let's start your coding journey!

## 📖 What is Python?

Python is a **high-level**, **interpreted** programming language known for:

### 🌟 Key Features:
- **Simple Syntax**: Easy to read and write - looks almost like English!
- **Versatile**: Used for web development, data science, AI, automation, games
- **Large Community**: Over 15 million developers worldwide
- **Rich Libraries**: 300,000+ packages available
- **Cross-Platform**: Runs on Windows, Mac, Linux, and more

### 🏢 Real-World Applications:
- **Instagram**: Backend services
- **Netflix**: Content recommendation algorithms
- **Spotify**: Music recommendation engine
- **NASA**: Space exploration software
- **Google**: Search algorithms and YouTube

## 🎯 Your First Python Program

The traditional first program in any language is "Hello, World!":

**Example Code:**
\`\`\`
# This is a comment - Python ignores this line
print("Hello, World!")
\`\`\`

**What happens?** When you run this code, it displays: Hello, World!

### 🔍 Let's Break It Down:
- print() is a **function** that displays text
- "Hello, World!" is a **string** (text data)
- The # symbol creates a **comment** for notes

### 🎮 Try These Variations:

**More Examples:**
\`\`\`
# Different ways to say hello
print("Hello, Python!")
print('Welcome to coding!')
print("My name is", "Alex")

# Using variables
message = "I'm learning Python!"
print(message)
\`\`\`

## 🤔 Why Start with Python?

### ✅ Beginner Advantages:
1. **Readable Syntax**: Code looks like natural language
2. **Immediate Results**: See your code work instantly
3. **Gentle Learning Curve**: Focus on logic, not syntax
4. **Great Documentation**: Excellent learning resources

### 💼 Career Benefits:
- **High Demand**: Top 3 most wanted programming language
- **Good Salary**: Average $90k+ for Python developers
- **Job Variety**: Web dev, data science, AI, automation
- **Future-Proof**: Growing rapidly in all industries

## 🎓 What You'll Master in This Course

### 📚 Foundation (Lessons 1-4):
1. **Variables & Data Types**: Store and organize information
2. **Control Flow**: Make decisions with if/else
3. **Loops**: Repeat tasks efficiently
4. **Functions**: Create reusable code blocks

### 🔧 Intermediate (Lessons 5-7):
5. **Lists & Data Structures**: Organize complex data
6. **File Handling**: Read and write files
7. **Error Handling**: Deal with problems gracefully

### 🚀 Advanced (Lessons 8-10):
8. **Object-Oriented Programming**: Build complex applications
9. **Libraries & Modules**: Use pre-built tools
10. **Real Projects**: Build actual applications

## 🎯 Learning Tips for Success

### 💡 Best Practices:
- **Practice Daily**: Even 15 minutes helps
- **Code Along**: Don't just read, write code!
- **Make Mistakes**: They're part of learning
- **Ask Questions**: Use the community

### 🛠️ Essential Tools:
- **Code Editor**: VS Code, PyCharm, or online editors
- **Python Interpreter**: Download from python.org
- **Terminal/Command Prompt**: Run your programs

Ready to write your first Python program? Let's start coding! 🎉`,
        relatedChallenges: [
          "Python Basics: Hello World",
          "Variables and Data Types",
          "Basic Math Operations",
        ],
      },
      {
        title: "Variables & Data Types Deep Dive",
        slug: "variables-data-types",
        content: `# 📦 Variables and Data Types: Your Programming Toolbox

Variables are like **labeled containers** that store different types of information in your program. Think of them as boxes with names!

## 🏷️ What are Variables?

Variables are **names** that point to **values** in memory:

**Basic Example:**
\`\`\`
# Creating variables (like labeling boxes)
name = "Alice"           # Text box
age = 25                 # Number box  
height = 5.6             # Decimal box
is_student = True        # True/False box

# Using variables
print(f"Hello, {name}!")
print(f"You are {age} years old")
\`\`\`

### 🔄 Variables Can Change:
**Example:**
\`\`\`
score = 85               # Initial value
print(score)             # Output: 85

score = 92               # Update value
print(score)             # Output: 92

score = score + 5        # Use current value
print(score)             # Output: 97
\`\`\`

## 🎯 Python's Core Data Types

### 1. 📝 Strings (Text Data)

Strings represent text and are surrounded by quotes:

**Examples:**
\`\`\`
# Different ways to create strings
single_quotes = 'Hello World'
double_quotes = "Hello World"
triple_quotes = \"\"\"This is a
multi-line string\"\"\"

# String operations
first_name = "John"
last_name = "Doe"
full_name = first_name + " " + last_name  # Concatenation
print(full_name)  # Output: John Doe

# F-strings (modern approach)
age = 30
message = f"Hi, I'm {first_name} and I'm {age} years old"
print(message)
\`\`\`

### 2. 🔢 Integers (Whole Numbers)

Integers are whole numbers without decimal points:

**Examples:**
\`\`\`
# Positive and negative integers
positive_num = 42
negative_num = -17
zero = 0

# Mathematical operations
a = 10
b = 3
print(a + b)    # Addition: 13
print(a - b)    # Subtraction: 7
print(a * b)    # Multiplication: 30
print(a // b)   # Integer division: 3
print(a % b)    # Remainder: 1
print(a ** b)   # Power: 1000
\`\`\`

### 3. 🎯 Floats (Decimal Numbers)

Floats represent numbers with decimal points:

**Examples:**
\`\`\`
# Float examples
price = 19.99
temperature = -5.2
pi = 3.14159

# Float operations
radius = 5.0
area = pi * radius ** 2
print(f"Circle area: {area:.2f}")  # Rounds to 2 decimals

# Converting between types
integer_value = int(19.99)      # Becomes 19
float_value = float(20)         # Becomes 20.0
\`\`\`

### 4. ✅❌ Booleans (True/False)

Booleans represent logical values:

**Examples:**
\`\`\`
# Boolean values
is_sunny = True
is_raining = False
has_homework = True

# Boolean operations
print(is_sunny and not is_raining)  # True
print(is_raining or has_homework)   # True

# Comparison results in booleans
age = 18
can_vote = age >= 18
print(can_vote)  # True
\`\`\`

## 🧙‍♂️ Dynamic Typing Magic

Python automatically determines data types:

**Example:**
\`\`\`
# Variable can change types
x = 42           # x is an integer
print(type(x))   # <class 'int'>

x = "hello"      # Now x is a string
print(type(x))   # <class 'str'>

x = 3.14         # Now x is a float
print(type(x))   # <class 'float'>

x = True         # Now x is a boolean
print(type(x))   # <class 'bool'>
\`\`\`

## 🎮 Practice Examples

### Example 1: Personal Information
**Complete Example:**
\`\`\`
# Store personal information
first_name = "Sarah"
last_name = "Johnson"
birth_year = 1995
current_year = 2024

# Calculate age
age = current_year - birth_year

# Create formatted message
intro = f"Hi! I'm {first_name} {last_name}, and I'm {age} years old."
print(intro)
\`\`\`

### Example 2: Shopping Calculator
**Complete Example:**
\`\`\`
# Shopping items
item_name = "Laptop"
item_price = 899.99
tax_rate = 0.08
quantity = 1

# Calculate totals
subtotal = item_price * quantity
tax_amount = subtotal * tax_rate
total_price = subtotal + tax_amount

print(f"Item: {item_name}")
print(f"Quantity: {quantity}")
print(f"Subtotal: $\{subtotal:.2f}")
print(f"Tax: $\{tax_amount:.2f}")
print(f"Total: $\{total_price:.2f}")
\`\`\`

## 📏 Variable Naming Best Practices

### ✅ Good Variable Names:
**Examples:**
\`\`\`
# Descriptive and clear
student_name = "John"
total_score = 95
is_game_over = False
max_attempts = 3

# Use snake_case for multi-word names
user_login_count = 5
database_connection_string = "localhost:5432"
\`\`\`

### ❌ Poor Variable Names:
**Avoid these:**
\`\`\`
# Avoid these!
x = "John"           # Not descriptive
n = 95               # What does 'n' mean?
flag = False         # What kind of flag?
temp = 3             # Temporary what?
\`\`\`

### 📋 Naming Rules:
- **Must start** with letter or underscore: name, _count
- **Can contain** letters, numbers, underscores: user_123
- **Case sensitive**: Name and name are different
- **Cannot use** Python keywords: def, if, for, etc.

## 🚀 What's Next?

Now that you understand variables and data types, you're ready to:
- Make decisions with **if statements**
- Repeat actions with **loops**
- Organize data with **lists and dictionaries**

Ready to practice? Try the challenges below! 🎯`,
        relatedChallenges: [
          "Variables and Data Types",
          "String Manipulation Basics",
          "Basic Math Operations",
        ],
      },
      {
        title: "Making Decisions with If Statements",
        slug: "if-statements-decisions",
        content: `# 🤔 Making Decisions with If Statements

Every program needs to make decisions! If statements let your code choose different paths based on conditions.

## 🎯 The Basic If Statement

An if statement checks a condition and runs code only if it's true:

**Example:**
\`\`\`
age = 18

if age >= 18:
    print("You can vote!")
    print("Welcome to democracy!")
\`\`\`

**Key Points:**
- The condition age >= 18 is either True or False
- Code after : runs only if condition is True
- **Indentation matters!** Use 4 spaces or 1 tab

## 🔄 If-Else: Two Choices

Handle both true and false cases:

**Example:**
\`\`\`
temperature = 75

if temperature > 80:
    print("It's hot outside! 🌡️")
    print("Stay hydrated!")
else:
    print("Nice weather today! 😊")
    print("Perfect for a walk!")
\`\`\`

### 🎮 Interactive Example:
**User Input:**
\`\`\`
password = input("Enter password: ")

if password == "secret123":
    print("✅ Access granted!")
    print("Welcome to the system!")
else:
    print("❌ Access denied!")
    print("Invalid password.")
\`\`\`

## 🎛️ If-Elif-Else: Multiple Choices

Handle multiple conditions with elif:

**Grade Calculator Example:**
\`\`\`
score = 85

if score >= 90:
    grade = "A"
    message = "Excellent work! 🏆"
elif score >= 80:
    grade = "B"
    message = "Good job! 👍"
elif score >= 70:
    grade = "C"
    message = "You passed! ✅"
elif score >= 60:
    grade = "D"
    message = "Need improvement 📚"
else:
    grade = "F"
    message = "Study harder! 💪"

print(f"Your grade is: {grade}")
print(message)
\`\`\`

### 🏪 Real-World Example: Store Discount
**Shopping Discount System:**
\`\`\`
purchase_amount = 150
is_member = True

if is_member and purchase_amount >= 100:
    discount = 0.20  # 20% discount
    print("VIP Member + Large Purchase: 20% off!")
elif is_member:
    discount = 0.10  # 10% discount
    print("Member discount: 10% off!")
elif purchase_amount >= 100:
    discount = 0.05  # 5% discount
    print("Large purchase: 5% off!")
else:
    discount = 0.0   # No discount
    print("No discount available")

final_price = purchase_amount * (1 - discount)
savings = purchase_amount * discount

print(f"Original: $\{purchase_amount:.2f}")
print(f"You save: $\{savings:.2f}")
print(f"Final price: $\{final_price:.2f}")
\`\`\`

## 🔍 Comparison Operators

### Basic Comparisons:
**Examples:**
\`\`\`
a = 10
b = 5

print(a == b)   # Equal to: False
print(a != b)   # Not equal: True
print(a > b)    # Greater than: True
print(a < b)    # Less than: False
print(a >= b)   # Greater or equal: True
print(a <= b)   # Less or equal: False
\`\`\`

### String Comparisons:
**Examples:**
\`\`\`
name1 = "Alice"
name2 = "Bob"

print(name1 == name2)           # False
print(name1.lower() == "alice") # True
print("A" < "B")                # True (alphabetical order)
\`\`\`

## 🔗 Logical Operators

Combine multiple conditions:

### AND Operator:
Both conditions must be true:
**Example:**
\`\`\`
age = 25
has_license = True

if age >= 18 and has_license:
    print("You can drive! 🚗")
else:
    print("Cannot drive")
\`\`\`

### OR Operator:
At least one condition must be true:
**Example:**
\`\`\`
day = "Saturday"
is_holiday = False

if day == "Saturday" or day == "Sunday" or is_holiday:
    print("No work today! 🎉")
else:
    print("Work day 💼")
\`\`\`

### NOT Operator:
Reverses the condition:
**Example:**
\`\`\`
is_raining = False

if not is_raining:
    print("Perfect weather for a picnic! ☀️")
else:
    print("Stay inside! 🌧️")
\`\`\`

## 🎯 Advanced Conditional Patterns

### 1. Nested If Statements:
**Weather Decision Example:**
\`\`\`
weather = "sunny"
temperature = 75

if weather == "sunny":
    if temperature > 70:
        print("Perfect beach day! 🏖️")
    else:
        print("Sunny but chilly ❄️")
else:
    print("Not ideal weather")
\`\`\`

### 2. Multiple Conditions:
**Login System Example:**
\`\`\`
username = "admin"
password = "secret"
is_active = True

if username == "admin" and password == "secret" and is_active:
    print("Admin access granted!")
elif username == "admin" and password == "secret":
    print("Account is inactive")
elif username == "admin":
    print("Wrong password")
else:
    print("User not found")
\`\`\`

### 3. Membership Testing:
**Color Validator Example:**
\`\`\`
valid_colors = ["red", "green", "blue", "yellow"]
user_color = input("Choose a color: ").lower()

if user_color in valid_colors:
    print(f"Great choice! {user_color.title()} is available.")
else:
    print("Sorry, that color is not available.")
    print(f"Choose from: {', '.join(valid_colors)}")
\`\`\`

## 🛡️ Input Validation Example

**Age Validator with Error Handling:**
\`\`\`
# Get user age with validation
user_input = input("Enter your age: ")

# Check if input is a valid number
if user_input.isdigit():
    age = int(user_input)
    
    if age < 0:
        print("Age cannot be negative!")
    elif age > 150:
        print("That's quite old! Are you sure?")
    elif age < 13:
        print("You're a kid! 🧒")
    elif age < 20:
        print("You're a teenager! 👦")
    elif age < 60:
        print("You're an adult! 👨")
    else:
        print("You're a senior! 👴")
else:
    print("Please enter a valid number!")
\`\`\`

## 💡 Tips for Writing Good Conditions

### ✅ Best Practices:
1. **Use meaningful variable names**
2. **Keep conditions simple**
3. **Handle edge cases**

### 🎮 Practice Challenge
Try creating a simple game:

**Number Guessing Game:**
\`\`\`
import random

# Number guessing game
secret_number = random.randint(1, 10)
guess = int(input("Guess a number between 1 and 10: "))

if guess == secret_number:
    print("🎉 Congratulations! You guessed it!")
elif abs(guess - secret_number) <= 1:
    print("🔥 So close! The answer was", secret_number)
else:
    print("❌ Not quite! The answer was", secret_number)
\`\`\`

Ready to practice making decisions in your code? Try the challenges below! 🚀`,
        relatedChallenges: [
          "Boolean Logic and Conditions",
          "Simple If Statements",
        ],
      },
      {
        title: "Loops: Repeating Actions",
        slug: "loops-repetition",
        content: `# 🔄 Loops: Making Python Repeat Actions

Loops are powerful tools that let you repeat code without writing it multiple times. They're essential for automation and efficiency!

## 🎯 For Loops: Counting and Iterating

For loops repeat code a specific number of times:

### Basic Counting:
**Example:**
\`\`\`
# Count from 0 to 4
for i in range(5):
    print(f"Count: {i}")

# Output: 0, 1, 2, 3, 4
\`\`\`

### Custom Range:
**Examples:**
\`\`\`
# Count from 1 to 10
for i in range(1, 11):
    print(f"Number: {i}")

# Count by 2s from 0 to 10
for i in range(0, 11, 2):
    print(f"Even: {i}")
\`\`\`

### Looping Through Collections:
**Examples:**
\`\`\`
# Loop through a list
fruits = ["apple", "banana", "orange", "grape"]
for fruit in fruits:
    print(f"I love {fruit}!")

# Loop through a string
word = "Python"
for letter in word:
    print(f"Letter: {letter}")
\`\`\`

## 🔁 While Loops: Conditional Repetition

While loops continue until a condition becomes false:

### Basic While Loop:
**Example:**
\`\`\`
count = 1
while count <= 5:
    print(f"Count: {count}")
    count += 1  # Don't forget to update!

print("Loop finished!")
\`\`\`

### User Input Loop:
**Example:**
\`\`\`
password = ""
while password != "secret":
    password = input("Enter password: ")
    if password != "secret":
        print("Wrong password, try again!")

print("Access granted!")
\`\`\`

## 🎮 Real-World Loop Examples

### 1. Shopping List Calculator:
**Complete Example:**
\`\`\`
items = ["milk", "bread", "eggs", "butter"]
prices = [3.50, 2.25, 4.00, 5.75]

total = 0
print("🛒 Shopping Receipt:")
print("-" * 25)

for i in range(len(items)):
    item = items[i]
    price = prices[i]
    total += price
    print(f"{item:12} $\{price:6.2f}")

print("-" * 25)
print(f"{'Total:':12} $\{total:6.2f}")
\`\`\`

### 2. Password Strength Checker:
**Complete Example:**
\`\`\`
password = input("Enter a password to check: ")

# Check various criteria
has_upper = False
has_lower = False
has_digit = False
length_ok = len(password) >= 8

for char in password:
    if char.isupper():
        has_upper = True
    elif char.islower():
        has_lower = True
    elif char.isdigit():
        has_digit = True

# Calculate strength
strength = 0
if length_ok: strength += 1
if has_upper: strength += 1
if has_lower: strength += 1
if has_digit: strength += 1

print(f"Password strength: {strength}/4")
if strength >= 3:
    print("✅ Strong password!")
else:
    print("❌ Weak password - needs improvement")
\`\`\`

## 🎯 Loop Control: Break and Continue

### Break: Exit the Loop Early
**Example:**
\`\`\`
# Find first even number
numbers = [1, 3, 7, 8, 9, 12, 15]

for num in numbers:
    if num % 2 == 0:
        print(f"First even number: {num}")
        break
    print(f"Checking {num}...")
\`\`\`

### Continue: Skip to Next Iteration
**Example:**
\`\`\`
# Print only positive numbers
numbers = [-2, 5, -1, 8, 0, 3, -4]

for num in numbers:
    if num <= 0:
        continue  # Skip negative and zero
    print(f"Positive: {num}")
\`\`\`

## 🔢 Nested Loops: Loops Inside Loops

### Multiplication Table:
**Example:**
\`\`\`
print("📊 Multiplication Table (1-5):")
print("   ", end="")

# Print header
for j in range(1, 6):
    print(f"{j:4}", end="")
print()

# Print rows
for i in range(1, 6):
    print(f"{i:2}:", end="")
    for j in range(1, 6):
        result = i * j
        print(f"{result:4}", end="")
    print()  # New line after each row
\`\`\`

### Pattern Drawing:
**Example:**
\`\`\`
# Draw a triangle
height = 5
for i in range(1, height + 1):
    # Print spaces
    for space in range(height - i):
        print(" ", end="")
    
    # Print stars
    for star in range(2 * i - 1):
        print("*", end="")
    
    print()  # New line
\`\`\`

## 🎲 Interactive Examples

### 1. Number Guessing Game:
**Complete Game:**
\`\`\`
import random

secret = random.randint(1, 100)
attempts = 0
max_attempts = 7

print("🎯 Guess the number between 1 and 100!")
print(f"You have {max_attempts} attempts.")

while attempts < max_attempts:
    try:
        guess = int(input(f"Attempt {attempts + 1}: "))
        attempts += 1
        
        if guess == secret:
            print(f"🎉 Congratulations! You got it in {attempts} tries!")
            break
        elif guess < secret:
            print("📈 Too low! Try higher.")
        else:
            print("📉 Too high! Try lower.")
        
        remaining = max_attempts - attempts
        if remaining > 0:
            print(f"   {remaining} attempts remaining.")
        
    except ValueError:
        print("❌ Please enter a valid number!")

if attempts >= max_attempts and guess != secret:
    print(f"😞 Game over! The number was {secret}")
\`\`\`

## 💡 Loop Best Practices

### ✅ Do:
1. **Use descriptive variable names**
2. **Avoid infinite loops**
3. **Use enumerate() for index and value**

### ❌ Avoid:
1. **Modifying lists while iterating**
2. **Too many nested loops** (hard to read)
3. **Forgetting to update while loop conditions**

## 🚀 What's Next?

Now you can repeat actions efficiently! Next, you'll learn about:
- **Functions**: Create reusable code blocks
- **Lists**: Store and organize data
- **Dictionaries**: Key-value data storage

Ready to practice loops? Try the challenges below! 🎯`,
        relatedChallenges: [
          "Python Loops and Iteration",
          "Nested Loops Practice",
        ],
      },
      {
        title: "Functions: Reusable Code Blocks",
        slug: "functions-basics",
        content: `# 🔧 Functions: Building Reusable Code Blocks

Functions are like mini-programs that perform specific tasks. They help you write cleaner, more organized code!

## 🎯 What are Functions?

Functions are **named blocks of code** that:
- Perform a specific task
- Can be used multiple times
- Accept inputs (parameters)
- Can return outputs

Think of them as **recipes** in cooking - you write the recipe once, then use it whenever needed!

## 📝 Creating Your First Function

### Basic Function Syntax:
**Example:**
\`\`\`
def greet():
    \"\"\"This function says hello\"\"\"
    print("Hello, World!")

# Call the function
greet()  # Output: Hello, World!
\`\`\`

### Function with Parameters:
**Example:**
\`\`\`
def greet_person(name):
    \"\"\"Greet a specific person\"\"\"
    print(f"Hello, {name}!")

# Call with different names
greet_person("Alice")    # Output: Hello, Alice!
greet_person("Bob")      # Output: Hello, Bob!
\`\`\`

### Function with Return Value:
**Example:**
\`\`\`
def add_numbers(a, b):
    \"\"\"Add two numbers and return the result\"\"\"
    result = a + b
    return result

# Use the returned value
sum_result = add_numbers(5, 3)
print(f"5 + 3 = {sum_result}")  # Output: 5 + 3 = 8
\`\`\`

## 🎮 Real-World Function Examples

### 1. Calculator Functions:
**Examples:**
\`\`\`
def calculate_area_rectangle(length, width):
    \"\"\"Calculate area of a rectangle\"\"\"
    area = length * width
    return area

def calculate_area_circle(radius):
    \"\"\"Calculate area of a circle\"\"\"
    import math
    area = math.pi * radius ** 2
    return area

# Using the functions
rect_area = calculate_area_rectangle(10, 5)
circle_area = calculate_area_circle(3)

print(f"Rectangle area: {rect_area}")
print(f"Circle area: {circle_area:.2f}")
\`\`\`

### 2. Text Processing Functions:
**Examples:**
\`\`\`
def clean_text(text):
    \"\"\"Clean and format text\"\"\"
    # Remove extra spaces and convert to title case
    cleaned = text.strip().title()
    return cleaned

def count_words(text):
    \"\"\"Count words in text\"\"\"
    words = text.split()
    return len(words)

def is_valid_email(email):
    \"\"\"Check if email format is valid\"\"\"
    return "@" in email and "." in email

# Test the functions
user_input = "  hello world  "
clean_input = clean_text(user_input)
word_count = count_words(clean_input)

print(f"Original: '{user_input}'")
print(f"Cleaned: '{clean_input}'")
print(f"Word count: {word_count}")
print(f"Valid email test: {is_valid_email('test@email.com')}")
\`\`\`

## 🎯 Function Parameters and Arguments

### Default Parameters:
**Example:**
\`\`\`
def greet_with_title(name, title="Mr./Ms."):
    \"\"\"Greet with optional title\"\"\"
    return f"Hello, {title} {name}!"

# Using default parameter
print(greet_with_title("Smith"))           # Hello, Mr./Ms. Smith!

# Overriding default parameter
print(greet_with_title("Smith", "Dr."))    # Hello, Dr. Smith!
\`\`\`

### Multiple Parameters:
**Example:**
\`\`\`
def create_user_profile(name, age, city="Unknown", country="Unknown"):
    \"\"\"Create a user profile with required and optional info\"\"\"
    profile = {
        "name": name,
        "age": age,
        "city": city,
        "country": country
    }
    return profile

# Different ways to call
profile1 = create_user_profile("Alice", 25)
profile2 = create_user_profile("Bob", 30, "New York")
profile3 = create_user_profile("Carol", 28, "London", "UK")

print("Profile 1:", profile1)
print("Profile 2:", profile2)
print("Profile 3:", profile3)
\`\`\`

### Variable Number of Arguments:
**Example:**
\`\`\`
def calculate_average(*numbers):
    \"\"\"Calculate average of any number of arguments\"\"\"
    if not numbers:
        return 0
    
    total = sum(numbers)
    count = len(numbers)
    return total / count

# Test with different numbers of arguments
avg1 = calculate_average(10, 20)
avg2 = calculate_average(5, 10, 15, 20, 25)
avg3 = calculate_average(100)

print(f"Average of 10, 20: {avg1}")
print(f"Average of 5, 10, 15, 20, 25: {avg2}")
print(f"Average of 100: {avg3}")
\`\`\`

## 💡 Function Best Practices

### ✅ Good Practices:
1. **Use descriptive names**
2. **Keep functions focused** (do one thing well)
3. **Use docstrings**
4. **Handle errors gracefully**

### ❌ Avoid:
- Functions that are too long (>20 lines)
- Functions that do multiple unrelated things
- Modifying global variables inside functions
- Not handling potential errors

## 🚀 What's Next?

Functions are building blocks for larger programs! Next you'll learn:
- **Lists and Data Structures**: Organize complex data
- **Object-Oriented Programming**: Create custom data types
- **File Handling**: Work with external files

Ready to build your own functions? Try the challenges below! 🎯`,
        relatedChallenges: [
          "Python Functions Practice",
          "Function Parameter Handling",
        ],
      },
      {
        title: "Working with Lists & Collections",
        slug: "lists-collections",
        content: `# 📋 Working with Lists & Collections

Lists are Python's most versatile data structure for storing multiple items. Master lists and you'll unlock powerful programming capabilities!

## 🎯 Creating and Using Lists

### Basic List Creation:
**Examples:**
\`\`\`
# Different ways to create lists
fruits = ["apple", "banana", "orange", "grape"]
numbers = [1, 2, 3, 4, 5]
mixed_data = ["John", 25, True, 3.14]
empty_list = []

# List from range
countdown = list(range(10, 0, -1))  # [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
\`\`\`

### Accessing List Elements:
**Examples:**
\`\`\`
fruits = ["apple", "banana", "orange", "grape", "kiwi"]

# Positive indexing (from start)
print(fruits[0])    # "apple" (first item)
print(fruits[2])    # "orange" (third item)

# Negative indexing (from end)
print(fruits[-1])   # "kiwi" (last item)
print(fruits[-2])   # "grape" (second to last)

# Slicing
print(fruits[1:4])  # ["banana", "orange", "grape"]
print(fruits[:3])   # ["apple", "banana", "orange"]
print(fruits[2:])   # ["orange", "grape", "kiwi"]
print(fruits[::2])  # ["apple", "orange", "kiwi"] (every 2nd)
\`\`\`

## 🔧 Essential List Methods

### Adding Items:
**Examples:**
\`\`\`
shopping_list = ["milk", "bread"]

# Add single item to end
shopping_list.append("eggs")
print(shopping_list)  # ["milk", "bread", "eggs"]

# Add item at specific position
shopping_list.insert(1, "butter")
print(shopping_list)  # ["milk", "butter", "bread", "eggs"]

# Add multiple items
shopping_list.extend(["cheese", "yogurt"])
print(shopping_list)  # ["milk", "butter", "bread", "eggs", "cheese", "yogurt"]
\`\`\`

### Removing Items:
**Examples:**
\`\`\`
numbers = [1, 2, 3, 4, 5, 3]

# Remove by value (first occurrence)
numbers.remove(3)
print(numbers)  # [1, 2, 4, 5, 3]

# Remove by index and return value
last_item = numbers.pop()
print(last_item)    # 3
print(numbers)      # [1, 2, 4, 5]

# Remove specific index
second_item = numbers.pop(1)
print(second_item)  # 2
print(numbers)      # [1, 4, 5]

# Clear all items
numbers.clear()
print(numbers)      # []
\`\`\`

## 🎮 Real-World List Examples

### 1. Student Grade Manager:
**Complete Example:**
\`\`\`
# Student grade management system
student_grades = []

# Add grades
student_grades.extend([85, 92, 78, 96, 88])

# Calculate statistics
total_grades = len(student_grades)
average_grade = sum(student_grades) / total_grades
highest_grade = max(student_grades)
lowest_grade = min(student_grades)

print(f"📊 Grade Report:")
print(f"Total tests: {total_grades}")
print(f"Average: {average_grade:.1f}")
print(f"Highest: {highest_grade}")
print(f"Lowest: {lowest_grade}")

# Grade distribution
a_grades = [grade for grade in student_grades if grade >= 90]
b_grades = [grade for grade in student_grades if 80 <= grade < 90]
c_grades = [grade for grade in student_grades if 70 <= grade < 80]

print(f"A grades: {len(a_grades)}")
print(f"B grades: {len(b_grades)}")
print(f"C grades: {len(c_grades)}")
\`\`\`

### 2. Todo List Application:
**Complete Example:**
\`\`\`
# Advanced todo list with priorities
todo_list = []

def add_task(task, priority="medium"):
    todo_item = {
        "task": task,
        "priority": priority,
        "completed": False
    }
    todo_list.append(todo_item)

def complete_task(task_name):
    for item in todo_list:
        if item["task"] == task_name:
            item["completed"] = True
            break

def show_tasks():
    print("📝 Todo List:")
    for i, item in enumerate(todo_list, 1):
        status = "✅" if item["completed"] else "⏳"
        priority = item["priority"].upper()
        print(f"{i}. {status} [{priority}] {item['task']}")

# Using the todo system
add_task("Learn Python", "high")
add_task("Buy groceries", "medium")
add_task("Call mom", "high")
add_task("Watch movie", "low")

show_tasks()
complete_task("Buy groceries")
print("\n--- After completing 'Buy groceries' ---")
show_tasks()
\`\`\`

## 🔍 List Searching and Sorting

### Finding Items:
**Examples:**
\`\`\`
colors = ["red", "green", "blue", "yellow", "red"]

# Check if item exists
print("red" in colors)      # True
print("purple" in colors)   # False

# Count occurrences
print(colors.count("red"))  # 2

# Find index of first occurrence
print(colors.index("blue")) # 2

# Safe finding with try/except
try:
    index = colors.index("purple")
except ValueError:
    print("Color not found!")
\`\`\`

### Sorting Lists:
**Examples:**
\`\`\`
numbers = [64, 34, 25, 12, 22, 11, 90]
names = ["Charlie", "Alice", "Bob", "David"]

# Sort in place (modifies original)
numbers.sort()
print(numbers)  # [11, 12, 22, 25, 34, 64, 90]

# Sort in reverse
numbers.sort(reverse=True)
print(numbers)  # [90, 64, 34, 25, 22, 12, 11]

# Create sorted copy (preserves original)
original = [5, 2, 8, 1, 9]
sorted_copy = sorted(original)
print(original)      # [5, 2, 8, 1, 9]
print(sorted_copy)   # [1, 2, 5, 8, 9]

# Sort strings alphabetically
names.sort()
print(names)  # ["Alice", "Bob", "Charlie", "David"]
\`\`\`

## 🎯 List Comprehensions (Advanced)

Create new lists efficiently:

**Examples:**
\`\`\`
# Traditional way
squares = []
for x in range(10):
    squares.append(x ** 2)

# List comprehension way
squares = [x ** 2 for x in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# With conditions
even_squares = [x ** 2 for x in range(10) if x % 2 == 0]
print(even_squares)  # [0, 4, 16, 36, 64]

# String processing
words = ["hello", "world", "python", "programming"]
lengths = [len(word) for word in words]
print(lengths)  # [5, 5, 6, 11]

# Filtering
long_words = [word for word in words if len(word) > 5]
print(long_words)  # ["python", "programming"]
\`\`\`

## 💡 Best Practices

### ✅ Good Practices:
1. **Use descriptive names**: \`student_names\` instead of \`list1\`
2. **Check bounds**: Avoid index errors with len() checks
3. **Use appropriate methods**: \`append()\` for single items, \`extend()\` for multiple
4. **Consider list comprehensions**: More Pythonic and often faster

### ❌ Common Mistakes:
1. **Modifying while iterating**: Can cause unexpected behavior
2. **Forgetting negative indexing**: \`list[-1]\` is the last item
3. **Confusing append() vs extend()**: \`append()\` adds the item itself, \`extend()\` adds each element

Ready to master Python's most important data structure? Try the challenges below! 🎯`,
        relatedChallenges: [
          "Introduction to Lists",
          "List Methods and Manipulation",
          "List Comprehensions",
        ],
      },
      {
        title: "Dictionaries & Key-Value Data",
        slug: "dictionaries-key-value",
        content: `# 🗂️ Dictionaries & Key-Value Data

Dictionaries are Python's way of storing data in key-value pairs. Think of them like a real dictionary where you look up words (keys) to find their definitions (values)!

## 🎯 Understanding Dictionaries

### What are Dictionaries?
Dictionaries store data as **key-value pairs**:
- **Keys**: Unique identifiers (like words in a dictionary)
- **Values**: The data associated with each key (like definitions)

**Basic Example:**
\`\`\`
# Creating dictionaries
student = {
    "name": "Alice",
    "age": 20,
    "grade": "A",
    "subjects": ["Math", "Science", "English"]
}

# Empty dictionary
empty_dict = {}
another_empty = dict()
\`\`\`

### Accessing Dictionary Data:
**Examples:**
\`\`\`
student = {"name": "Alice", "age": 20, "grade": "A"}

# Access values by key
print(student["name"])    # "Alice"
print(student["age"])     # 20

# Safe access with get()
print(student.get("name"))        # "Alice"
print(student.get("height"))      # None
print(student.get("height", 0))   # 0 (default value)

# Check if key exists
print("name" in student)     # True
print("height" in student)   # False
\`\`\`

## 🔧 Dictionary Operations

### Adding and Updating:
**Examples:**
\`\`\`
student = {"name": "Alice", "age": 20}

# Add new key-value pair
student["grade"] = "A"
student["subjects"] = ["Math", "Science"]

# Update existing value
student["age"] = 21

# Update multiple values
student.update({"grade": "A+", "gpa": 3.8})

print(student)
# {"name": "Alice", "age": 21, "grade": "A+", "subjects": ["Math", "Science"], "gpa": 3.8}
\`\`\`

### Removing Items:
**Examples:**
\`\`\`
student = {"name": "Alice", "age": 20, "grade": "A", "temp": "delete_me"}

# Remove by key
del student["temp"]

# Remove and return value
grade = student.pop("grade")
print(grade)  # "A"

# Remove and return last item (Python 3.7+)
last_item = student.popitem()
print(last_item)  # ("age", 20)

# Clear all items
student.clear()
print(student)  # {}
\`\`\`

## 🎮 Real-World Dictionary Examples

### 1. Contact Book:
**Complete Example:**
\`\`\`
# Contact management system
contacts = {}

def add_contact(name, phone, email):
    contacts[name] = {
        "phone": phone,
        "email": email,
        "added_date": "2024-01-15"  # In real app, use datetime
    }

def find_contact(name):
    if name in contacts:
        contact = contacts[name]
        print(f"📞 {name}")
        print(f"Phone: {contact['phone']}")
        print(f"Email: {contact['email']}")
        print(f"Added: {contact['added_date']}")
    else:
        print(f"Contact '{name}' not found!")

def list_all_contacts():
    print("📚 All Contacts:")
    for name, details in contacts.items():
        print(f"{name}: {details['phone']}")

# Using the contact book
add_contact("Alice Johnson", "555-0123", "alice@email.com")
add_contact("Bob Smith", "555-0456", "bob@email.com")
add_contact("Carol Davis", "555-0789", "carol@email.com")

list_all_contacts()
find_contact("Alice Johnson")
\`\`\`

### 2. Inventory Management:
**Complete Example:**
\`\`\`
# Store inventory system
inventory = {
    "laptops": {"quantity": 15, "price": 999.99, "category": "electronics"},
    "mice": {"quantity": 50, "price": 29.99, "category": "electronics"},
    "desks": {"quantity": 8, "price": 299.99, "category": "furniture"},
    "chairs": {"quantity": 12, "price": 159.99, "category": "furniture"}
}

def show_inventory():
    print("📦 Current Inventory:")
    print("-" * 50)
    for item, details in inventory.items():
        total_value = details["quantity"] * details["price"]
        print(f"{item.title():12} | Qty: {details['quantity']:3} | Price: $\{details['price']:7.2f} | Value: $\{total_value:8.2f}")

def update_stock(item, quantity_change):
    if item in inventory:
        inventory[item]["quantity"] += quantity_change
        print(f"Updated {item}: new quantity = {inventory[item]['quantity']}")
    else:
        print(f"Item '{item}' not found in inventory!")

def get_total_value():
    total = 0
    for item, details in inventory.items():
        total += details["quantity"] * details["price"]
    return total

# Using the inventory system
show_inventory()
print(f"\n💰 Total inventory value: $\{get_total_value():,.2f}")

update_stock("laptops", -3)  # Sold 3 laptops
update_stock("mice", 25)     # Received 25 mice
show_inventory()
\`\`\`

## 🔍 Dictionary Methods and Iteration

### Essential Methods:
**Examples:**
\`\`\`
student = {"name": "Alice", "age": 20, "grade": "A"}

# Get all keys
keys = student.keys()
print(list(keys))  # ["name", "age", "grade"]

# Get all values
values = student.values()
print(list(values))  # ["Alice", 20, "A"]

# Get all key-value pairs
items = student.items()
print(list(items))  # [("name", "Alice"), ("age", 20), ("grade", "A")]

# Copy dictionary
student_copy = student.copy()
\`\`\`

### Iterating Through Dictionaries:
**Examples:**
\`\`\`
scores = {"Alice": 95, "Bob": 87, "Carol": 92, "David": 78}

# Iterate through keys
for name in scores:
    print(f"{name}: {scores[name]}")

# Iterate through values
for score in scores.values():
    print(f"Score: {score}")

# Iterate through key-value pairs
for name, score in scores.items():
    print(f"{name} scored {score}")

# Find highest score
best_student = max(scores, key=scores.get)
highest_score = scores[best_student]
print(f"🏆 Best student: {best_student} with {highest_score}")
\`\`\`

## 🎯 Nested Dictionaries

Complex data structures:

**Examples:**
\`\`\`
# School database with nested dictionaries
school = {
    "students": {
        "alice": {"age": 20, "grade": "A", "subjects": ["Math", "Science"]},
        "bob": {"age": 19, "grade": "B", "subjects": ["English", "History"]},
        "carol": {"age": 21, "grade": "A", "subjects": ["Math", "Physics"]}
    },
    "teachers": {
        "smith": {"subject": "Math", "experience": 10},
        "jones": {"subject": "Science", "experience": 8}
    },
    "courses": {
        "math101": {"teacher": "smith", "students": ["alice", "carol"]},
        "science101": {"teacher": "jones", "students": ["alice"]}
    }
}

# Accessing nested data
print(school["students"]["alice"]["grade"])  # "A"
print(school["teachers"]["smith"]["subject"])  # "Math"

# Find all students taking Math
math_students = school["courses"]["math101"]["students"]
print(f"Math students: {math_students}")

# Get teacher info for a course
math_teacher = school["courses"]["math101"]["teacher"]
teacher_info = school["teachers"][math_teacher]
print(f"Math teacher: {math_teacher}, Experience: {teacher_info['experience']} years")
\`\`\`

## 💡 Dictionary Best Practices

### ✅ Good Practices:
1. **Use meaningful keys**: \`user_age\` instead of \`ua\`
2. **Consistent key types**: Usually strings or numbers
3. **Use get() for safety**: Prevents KeyError exceptions
4. **Consider defaultdict**: For complex default values

### ❌ Common Mistakes:
1. **Using mutable keys**: Lists can't be dictionary keys
2. **Assuming key order**: Although Python 3.7+ preserves insertion order
3. **Not handling missing keys**: Always check or use get()

### 🔄 Dictionary vs List:
- **Use Lists when**: Order matters, you need indexing, duplicates allowed
- **Use Dictionaries when**: You need key-based lookup, representing real-world objects

Ready to organize your data efficiently? Try the challenges below! 🎯`,
        relatedChallenges: [
          "Dictionary Basics and Operations",
          "Nested Data Structures",
        ],
      },
      {
        title: "File Handling & Data Persistence",
        slug: "file-handling",
        content: `# 📁 File Handling & Data Persistence

Learn to read from and write to files - essential skills for saving data, processing documents, and building real applications!

## 🎯 Understanding File Operations

### Why File Handling?
- **Save user data**: Store preferences, game saves, user profiles
- **Process documents**: Read CSV, text files, configuration files
- **Data analysis**: Work with large datasets
- **Logging**: Record application events and errors

### File Modes:
**Common Modes:**
\`\`\`
# Reading modes
'r'   # Read only (default)
'rb'  # Read binary

# Writing modes
'w'   # Write (overwrites existing file)
'a'   # Append (adds to end of file)
'wb'  # Write binary

# Read and write
'r+'  # Read and write
'w+'  # Write and read (overwrites)
'a+'  # Append and read
\`\`\`

## 📖 Reading Files

### Basic File Reading:
**Examples:**
\`\`\`
# Method 1: Using with statement (recommended)
with open('data.txt', 'r') as file:
    content = file.read()
    print(content)
# File automatically closed after with block

# Method 2: Manual file handling
file = open('data.txt', 'r')
content = file.read()
print(content)
file.close()  # Must manually close!
\`\`\`

### Reading Line by Line:
**Examples:**
\`\`\`
# Read all lines into a list
with open('data.txt', 'r') as file:
    lines = file.readlines()
    for i, line in enumerate(lines, 1):
        print(f"Line {i}: {line.strip()}")

# Read one line at a time (memory efficient)
with open('large_file.txt', 'r') as file:
    for line_number, line in enumerate(file, 1):
        print(f"{line_number}: {line.strip()}")
        if line_number >= 10:  # Only read first 10 lines
            break

# Read specific number of lines
with open('data.txt', 'r') as file:
    first_line = file.readline()
    second_line = file.readline()
    print(f"First: {first_line.strip()}")
    print(f"Second: {second_line.strip()}")
\`\`\`

## ✍️ Writing Files

### Basic File Writing:
**Examples:**
\`\`\`
# Write to file (overwrites existing content)
with open('output.txt', 'w') as file:
    file.write("Hello, World!\\n")
    file.write("This is a new line.\\n")

# Write multiple lines
lines = ["First line\\n", "Second line\\n", "Third line\\n"]
with open('output.txt', 'w') as file:
    file.writelines(lines)

# Append to file (preserves existing content)
with open('log.txt', 'a') as file:
    file.write("New log entry\\n")
\`\`\`

### Writing Formatted Data:
**Examples:**
\`\`\`
# Writing formatted data
students = [
    {"name": "Alice", "grade": 95, "subject": "Math"},
    {"name": "Bob", "grade": 87, "subject": "Science"},
    {"name": "Carol", "grade": 92, "subject": "English"}
]

with open('student_report.txt', 'w') as file:
    file.write("📊 Student Grade Report\\n")
    file.write("=" * 30 + "\\n")
    
    for student in students:
        line = f"{student['name']:10} | {student['subject']:8} | {student['grade']:3}\\n"
        file.write(line)
    
    avg_grade = sum(s['grade'] for s in students) / len(students)
    file.write(f"\\nAverage Grade: {avg_grade:.1f}\\n")
\`\`\`

## 🎮 Real-World File Examples

### 1. Configuration File Manager:
**Complete Example:**
\`\`\`
import json

class ConfigManager:
    def __init__(self, config_file='config.json'):
        self.config_file = config_file
        self.settings = self.load_config()
    
    def load_config(self):
        \"\"\"Load configuration from file\"\"\"
        try:
            with open(self.config_file, 'r') as file:
                return json.load(file)
        except FileNotFoundError:
            # Create default config if file doesn't exist
            default_config = {
                "theme": "dark",
                "language": "en",
                "auto_save": True,
                "max_recent_files": 10
            }
            self.save_config(default_config)
            return default_config
    
    def save_config(self, config=None):
        \"\"\"Save configuration to file\"\"\"
        if config is None:
            config = self.settings
        
        with open(self.config_file, 'w') as file:
            json.dump(config, file, indent=2)
    
    def get(self, key, default=None):
        \"\"\"Get configuration value\"\"\"
        return self.settings.get(key, default)
    
    def set(self, key, value):
        \"\"\"Set configuration value\"\"\"
        self.settings[key] = value
        self.save_config()

# Using the config manager
config = ConfigManager()
print(f"Current theme: {config.get('theme')}")
config.set('theme', 'light')
print(f"New theme: {config.get('theme')}")
\`\`\`

### 2. Simple Note-Taking App:
**Complete Example:**
\`\`\`
import datetime
import os

class NoteApp:
    def __init__(self, notes_dir='notes'):
        self.notes_dir = notes_dir
        self.ensure_notes_directory()
    
    def ensure_notes_directory(self):
        \"\"\"Create notes directory if it doesn't exist\"\"\"
        if not os.path.exists(self.notes_dir):
            os.makedirs(self.notes_dir)
    
    def create_note(self, title, content):
        \"\"\"Create a new note\"\"\"
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{title.replace(' ', '_')}.txt"
        filepath = os.path.join(self.notes_dir, filename)
        
        with open(filepath, 'w') as file:
            file.write(f"Title: {title}\\n")
            file.write(f"Created: {datetime.datetime.now()}\\n")
            file.write("=" * 50 + "\\n\\n")
            file.write(content)
        
        print(f"Note saved as: {filename}")
        return filename
    
    def list_notes(self):
        \"\"\"List all notes\"\"\"
        notes = []
        for filename in os.listdir(self.notes_dir):
            if filename.endswith('.txt'):
                filepath = os.path.join(self.notes_dir, filename)
                with open(filepath, 'r') as file:
                    lines = file.readlines()
                    title = lines[0].replace('Title: ', '').strip()
                    created = lines[1].replace('Created: ', '').strip()
                    notes.append((filename, title, created))
        
        print("📝 Your Notes:")
        for i, (filename, title, created) in enumerate(notes, 1):
            print(f"{i}. {title} ({created})")
        
        return notes
    
    def read_note(self, filename):
        \"\"\"Read and display a note\"\"\"
        filepath = os.path.join(self.notes_dir, filename)
        if os.path.exists(filepath):
            with open(filepath, 'r') as file:
                content = file.read()
                print(content)
        else:
            print(f"Note '{filename}' not found!")

# Using the note app
app = NoteApp()
app.create_note("Shopping List", "- Milk\\n- Bread\\n- Eggs\\n- Coffee")
app.create_note("Meeting Notes", "Project deadline: March 15\\nTeam meeting: Fridays 2 PM")
app.list_notes()
\`\`\`

## 📊 Working with CSV Files

CSV (Comma-Separated Values) files are common for data exchange:

**Examples:**
\`\`\`
import csv

# Writing CSV file
students = [
    ['Name', 'Age', 'Grade', 'Subject'],
    ['Alice', 20, 'A', 'Math'],
    ['Bob', 19, 'B', 'Science'],
    ['Carol', 21, 'A', 'English']
]

with open('students.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerows(students)

# Reading CSV file
with open('students.csv', 'r') as file:
    reader = csv.reader(file)
    headers = next(reader)  # Get header row
    print(f"Headers: {headers}")
    
    for row in reader:
        name, age, grade, subject = row
        print(f"{name} ({age}) - {grade} in {subject}")

# Using DictReader for easier access
with open('students.csv', 'r') as file:
    reader = csv.DictReader(file)
    for row in reader:
        print(f"{row['Name']} scored {row['Grade']} in {row['Subject']}")
\`\`\`

## 🛡️ Error Handling with Files

Always handle potential file errors:

**Examples:**
\`\`\`
def safe_file_read(filename):
    \"\"\"Safely read a file with error handling\"\"\"
    try:
        with open(filename, 'r') as file:
            return file.read()
    except FileNotFoundError:
        print(f"Error: File '{filename}' not found!")
        return None
    except PermissionError:
        print(f"Error: No permission to read '{filename}'!")
        return None
    except Exception as e:
        print(f"Unexpected error reading file: {e}")
        return None

def safe_file_write(filename, content):
    \"\"\"Safely write to a file with error handling\"\"\"
    try:
        with open(filename, 'w') as file:
            file.write(content)
        print(f"Successfully wrote to '{filename}'")
        return True
    except PermissionError:
        print(f"Error: No permission to write '{filename}'!")
        return False
    except Exception as e:
        print(f"Unexpected error writing file: {e}")
        return False

# Using safe file operations
content = safe_file_read('data.txt')
if content:
    processed_content = content.upper()
    safe_file_write('output.txt', processed_content)
\`\`\`

## 💡 File Handling Best Practices

### ✅ Good Practices:
1. **Always use 'with' statements**: Ensures files are properly closed
2. **Handle exceptions**: Files might not exist or be inaccessible
3. **Use appropriate modes**: Don't open for writing if you only need to read
4. **Close files explicitly**: If not using 'with' statements

### ❌ Common Mistakes:
1. **Forgetting to close files**: Can cause memory leaks
2. **Not handling encoding**: Use \`encoding='utf-8'\` for text files
3. **Overwriting important data**: Be careful with 'w' mode
4. **Not validating file paths**: Check if files exist before processing

Ready to persist your data and build real applications? Try the challenges below! 🎯`,
        relatedChallenges: ["File Reading and Writing", "CSV Data Processing"],
      },
      {
        title: "Error Handling & Debugging",
        slug: "error-handling-debugging",
        content: `# 🐛 Error Handling & Debugging

Learn to handle errors gracefully and debug your code effectively - essential skills for writing robust, professional applications!

## 🎯 Understanding Errors

### Types of Errors:
1. **Syntax Errors**: Code doesn't follow Python rules
2. **Runtime Errors**: Errors that occur while program runs
3. **Logic Errors**: Code runs but produces wrong results

**Examples:**
\`\`\`
# Syntax Error
# print("Hello World"  # Missing closing parenthesis

# Runtime Error
# print(10 / 0)  # ZeroDivisionError

# Logic Error
def calculate_average(numbers):
    return sum(numbers) / len(numbers) + 1  # Should not add 1!
\`\`\`

## 🛡️ Try-Except Blocks

Handle errors gracefully instead of crashing:

### Basic Exception Handling:
**Examples:**
\`\`\`
# Basic try-except
try:
    number = int(input("Enter a number: "))
    result = 10 / number
    print(f"10 divided by {number} = {result}")
except ZeroDivisionError:
    print("Error: Cannot divide by zero!")
except ValueError:
    print("Error: Please enter a valid number!")

# Catch multiple exceptions
try:
    age = int(input("Enter your age: "))
    if age < 0:
        raise ValueError("Age cannot be negative")
    print(f"You are {age} years old")
except (ValueError, TypeError) as e:
    print(f"Invalid input: {e}")
\`\`\`

### Complete Exception Handling:
**Examples:**
\`\`\`
def safe_division(a, b):
    \"\"\"Safely divide two numbers\"\"\"
    try:
        result = a / b
    except ZeroDivisionError:
        print("Error: Division by zero!")
        return None
    except TypeError:
        print("Error: Both arguments must be numbers!")
        return None
    else:
        # Runs only if no exception occurred
        print(f"Division successful: {a} / {b} = {result}")
        return result
    finally:
        # Always runs, regardless of exceptions
        print("Division operation completed.")

# Test the function
print(safe_division(10, 2))   # Normal case
print(safe_division(10, 0))   # Division by zero
print(safe_division(10, "2")) # Type error
\`\`\`

## 🎮 Real-World Error Handling

### 1. File Operations with Error Handling:
**Complete Example:**
\`\`\`
import json
import os

class DataManager:
    def __init__(self, filename):
        self.filename = filename
    
    def save_data(self, data):
        \"\"\"Save data to file with error handling\"\"\"
        try:
            # Create backup if file exists
            if os.path.exists(self.filename):
                backup_name = f"{self.filename}.backup"
                os.rename(self.filename, backup_name)
                print(f"Created backup: {backup_name}")
            
            with open(self.filename, 'w') as file:
                json.dump(data, file, indent=2)
            
            print(f"✅ Data saved successfully to {self.filename}")
            return True
            
        except PermissionError:
            print(f"❌ Error: No permission to write to {self.filename}")
            return False
        except json.JSONEncodeError as e:
            print(f"❌ Error: Invalid data format - {e}")
            return False
        except Exception as e:
            print(f"❌ Unexpected error while saving: {e}")
            return False
    
    def load_data(self):
        \"\"\"Load data from file with error handling\"\"\"
        try:
            with open(self.filename, 'r') as file:
                data = json.load(file)
            print(f"✅ Data loaded successfully from {self.filename}")
            return data
            
        except FileNotFoundError:
            print(f"⚠️ File {self.filename} not found. Creating new file.")
            return {}
        except json.JSONDecodeError as e:
            print(f"❌ Error: Invalid JSON format - {e}")
            # Try to load backup
            backup_name = f"{self.filename}.backup"
            if os.path.exists(backup_name):
                print(f"🔄 Attempting to restore from backup...")
                try:
                    with open(backup_name, 'r') as file:
                        data = json.load(file)
                    print("✅ Backup restored successfully!")
                    return data
                except:
                    print("❌ Backup file is also corrupted")
            return {}
        except Exception as e:
            print(f"❌ Unexpected error while loading: {e}")
            return {}

# Using the data manager
dm = DataManager("user_data.json")
user_data = {"users": [{"name": "Alice", "score": 100}]}

if dm.save_data(user_data):
    loaded_data = dm.load_data()
    print(f"Loaded: {loaded_data}")
\`\`\`

### 2. User Input Validation:
**Complete Example:**
\`\`\`
class InputValidator:
    @staticmethod
    def get_integer(prompt, min_value=None, max_value=None, max_attempts=3):
        \"\"\"Get valid integer input from user\"\"\"
        attempts = 0
        while attempts < max_attempts:
            try:
                value = int(input(prompt))
                
                if min_value is not None and value < min_value:
                    raise ValueError(f"Value must be at least {min_value}")
                if max_value is not None and value > max_value:
                    raise ValueError(f"Value must be at most {max_value}")
                
                return value
                
            except ValueError as e:
                attempts += 1
                remaining = max_attempts - attempts
                if "invalid literal" in str(e):
                    print(f"❌ Please enter a valid integer. ({remaining} attempts left)")
                else:
                    print(f"❌ {e} ({remaining} attempts left)")
                
                if attempts >= max_attempts:
                    print("❌ Maximum attempts reached!")
                    return None
    
    @staticmethod
    def get_email(prompt, max_attempts=3):
        \"\"\"Get valid email input from user\"\"\"
        attempts = 0
        while attempts < max_attempts:
            email = input(prompt).strip()
            try:
                if not email:
                    raise ValueError("Email cannot be empty")
                if "@" not in email:
                    raise ValueError("Email must contain @ symbol")
                if "." not in email.split("@")[1]:
                    raise ValueError("Email domain must contain a dot")
                
                return email
                
            except ValueError as e:
                attempts += 1
                remaining = max_attempts - attempts
                print(f"❌ {e} ({remaining} attempts left)")
                
                if attempts >= max_attempts:
                    print("❌ Maximum attempts reached!")
                    return None

# Using input validation
def create_user_account():
    \"\"\"Create user account with validation\"\"\"
    print("🔧 Creating User Account")
    print("-" * 25)
    
    name = input("Enter your name: ").strip()
    if not name:
        print("❌ Name cannot be empty!")
        return None
    
    age = InputValidator.get_integer(
        "Enter your age (13-120): ",
        min_value=13,
        max_value=120
    )
    if age is None:
        return None
    
    email = InputValidator.get_email("Enter your email: ")
    if email is None:
        return None
    
    user = {
        "name": name,
        "age": age,
        "email": email
    }
    
    print(f"✅ Account created successfully!")
    print(f"Welcome, {name}!")
    return user

# Test account creation
new_user = create_user_account()
if new_user:
    print(f"User data: {new_user}")
\`\`\`

## 🔍 Debugging Techniques

### 1. Print Debugging:
**Examples:**
\`\`\`
def calculate_grade_average(grades):
    \"\"\"Calculate average grade with debug prints\"\"\"
    print(f"DEBUG: Input grades: {grades}")  # Debug input
    
    if not grades:
        print("DEBUG: Empty grades list!")
        return 0
    
    total = sum(grades)
    count = len(grades)
    print(f"DEBUG: Total: {total}, Count: {count}")  # Debug calculation
    
    average = total / count
    print(f"DEBUG: Calculated average: {average}")  # Debug result
    
    return round(average, 2)

# Test with debug output
result = calculate_grade_average([85, 92, 78, 96])
print(f"Final result: {result}")
\`\`\`

### 2. Logging for Better Debugging:
**Examples:**
\`\`\`
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='app.log'
)

def process_user_data(user_data):
    \"\"\"Process user data with logging\"\"\"
    logging.info(f"Starting to process user data for {len(user_data)} users")
    
    processed_users = []
    
    for i, user in enumerate(user_data):
        try:
            logging.debug(f"Processing user {i}: {user.get('name', 'Unknown')}")
            
            # Validate required fields
            if 'name' not in user:
                raise ValueError("User missing name field")
            if 'age' not in user:
                raise ValueError("User missing age field")
            
            # Process user
            processed_user = {
                'name': user['name'].title(),
                'age': int(user['age']),
                'status': 'active'
            }
            
            processed_users.append(processed_user)
            logging.debug(f"Successfully processed user: {processed_user['name']}")
            
        except ValueError as e:
            logging.error(f"Error processing user {i}: {e}")
            continue
        except Exception as e:
            logging.error(f"Unexpected error processing user {i}: {e}")
            continue
    
    logging.info(f"Processing complete. {len(processed_users)} users processed successfully")
    return processed_users

# Test with logging
test_data = [
    {'name': 'alice', 'age': '25'},
    {'name': 'bob'},  # Missing age
    {'name': 'carol', 'age': 'invalid'},  # Invalid age
    {'name': 'david', 'age': '30'}
]

result = process_user_data(test_data)
print(f"Processed {len(result)} users")
\`\`\`

## 🎯 Custom Exceptions

Create your own exception types for specific errors:

**Examples:**
\`\`\`
class BankAccountError(Exception):
    \"\"\"Base exception for bank account operations\"\"\"
    pass

class InsufficientFundsError(BankAccountError):
    \"\"\"Raised when account has insufficient funds\"\"\"
    pass

class InvalidAmountError(BankAccountError):
    \"\"\"Raised when amount is invalid\"\"\"
    pass

class BankAccount:
    def __init__(self, account_number, initial_balance=0):
        self.account_number = account_number
        self.balance = initial_balance
    
    def deposit(self, amount):
        \"\"\"Deposit money to account\"\"\"
        if amount <= 0:
            raise InvalidAmountError("Deposit amount must be positive")
        
        self.balance += amount
        print(f"✅ Deposited $\{amount:.2f}. New balance: $\{self.balance:.2f}")
    
    def withdraw(self, amount):
        \"\"\"Withdraw money from account\"\"\"
        if amount <= 0:
            raise InvalidAmountError("Withdrawal amount must be positive")
        
        if amount > self.balance:
            raise InsufficientFundsError(
                f"Insufficient funds. Balance: $\{self.balance:.2f}, "
                f"Requested: $\{amount:.2f}"
            )
        
        self.balance -= amount
        print(f"✅ Withdrew $\{amount:.2f}. New balance: $\{self.balance:.2f}")

# Using custom exceptions
def bank_transaction_demo():
    account = BankAccount("12345", 100.0)
    
    try:
        account.deposit(50.0)    # Should work
        account.withdraw(200.0)  # Should raise InsufficientFundsError
    except InsufficientFundsError as e:
        print(f"❌ Transaction failed: {e}")
    except InvalidAmountError as e:
        print(f"❌ Invalid amount: {e}")
    except BankAccountError as e:
        print(f"❌ Bank account error: {e}")

bank_transaction_demo()
\`\`\`

## 💡 Error Handling Best Practices

### ✅ Good Practices:
1. **Be specific**: Catch specific exceptions rather than using bare \`except\`
2. **Fail gracefully**: Provide helpful error messages to users
3. **Log errors**: Use logging to track errors in production
4. **Clean up resources**: Use \`finally\` or \`with\` statements

### ❌ Common Mistakes:
1. **Catching all exceptions**: \`except:\` hides important errors
2. **Silent failures**: Catching exceptions without handling them
3. **Poor error messages**: Users need helpful, clear error messages
4. **Not logging errors**: Makes debugging production issues difficult

Ready to write robust, error-resistant code? Try the challenges below! 🎯`,
        relatedChallenges: [
          "Exception Handling Practice",
          "Debugging Techniques",
        ],
      },
      {
        title: "Object-Oriented Programming Basics",
        slug: "oop-basics",
        content: `# 🏗️ Object-Oriented Programming Basics

Learn to organize your code using classes and objects - the foundation of modern software development and the key to building complex applications!

## 🎯 Understanding OOP Concepts

### What is Object-Oriented Programming?
OOP is a programming paradigm that organizes code around **objects** and **classes**:

- **Class**: A blueprint or template for creating objects
- **Object**: An instance of a class with specific data and behaviors
- **Attributes**: Data stored in objects (properties)
- **Methods**: Functions that operate on objects (behaviors)

**Real-World Analogy:**
Think of a **Car** class as a blueprint, and your specific car as an **object**:
\`\`\`
# Class = Blueprint
class Car:
    pass

# Objects = Specific instances
my_car = Car()      # Your Honda Civic
friend_car = Car()  # Friend's Toyota Camry
\`\`\`

## 🚗 Creating Your First Class

### Basic Class Definition:
**Examples:**
\`\`\`
class Student:
    \"\"\"A simple Student class\"\"\"
    
    def __init__(self, name, age, grade):
        \"\"\"Constructor - called when creating new student\"\"\"
        self.name = name        # Attribute
        self.age = age          # Attribute
        self.grade = grade      # Attribute
        self.subjects = []      # Attribute
    
    def introduce(self):
        \"\"\"Method to introduce the student\"\"\"
        return f"Hi, I'm {self.name}, {self.age} years old, grade {self.grade}"
    
    def add_subject(self, subject):
        \"\"\"Method to add a subject\"\"\"
        self.subjects.append(subject)
        print(f"{self.name} enrolled in {subject}")
    
    def list_subjects(self):
        \"\"\"Method to list all subjects\"\"\"
        if self.subjects:
            return f"{self.name}'s subjects: {', '.join(self.subjects)}"
        else:
            return f"{self.name} has no subjects yet"

# Creating objects (instances)
student1 = Student("Alice", 16, "10th")
student2 = Student("Bob", 17, "11th")

# Using methods
print(student1.introduce())
student1.add_subject("Math")
student1.add_subject("Science")
print(student1.list_subjects())

print(student2.introduce())
student2.add_subject("English")
print(student2.list_subjects())
\`\`\`

### Class vs Instance Attributes:
**Examples:**
\`\`\`
class School:
    # Class attribute (shared by all instances)
    total_students = 0
    school_name = "Python High School"
    
    def __init__(self, student_name, grade):
        # Instance attributes (unique to each instance)
        self.student_name = student_name
        self.grade = grade
        self.enrollment_id = School.total_students + 1
        
        # Update class attribute
        School.total_students += 1
    
    @classmethod
    def get_school_info(cls):
        \"\"\"Class method to get school information\"\"\"
        return f"{cls.school_name} has {cls.total_students} students"
    
    def get_student_info(self):
        \"\"\"Instance method to get student information\"\"\"
        return f"Student: {self.student_name}, Grade: {self.grade}, ID: {self.enrollment_id}"

# Create students
alice = School("Alice", "10th")
bob = School("Bob", "11th")
carol = School("Carol", "9th")

# Access class and instance data
print(School.get_school_info())
print(alice.get_student_info())
print(bob.get_student_info())
print(f"Total students: {School.total_students}")
\`\`\`

## 🎮 Real-World OOP Examples

### 1. Bank Account System:
**Complete Example:**
\`\`\`
class BankAccount:
    \"\"\"A comprehensive bank account class\"\"\"
    
    # Class attributes
    bank_name = "Python Bank"
    interest_rate = 0.02
    
    def __init__(self, account_holder, account_number, initial_balance=0):
        \"\"\"Initialize bank account\"\"\"
        self.account_holder = account_holder
        self.account_number = account_number
        self.balance = initial_balance
        self.transaction_history = []
        self._add_transaction("Account opened", initial_balance)
    
    def deposit(self, amount):
        \"\"\"Deposit money to account\"\"\"
        if amount <= 0:
            print("❌ Deposit amount must be positive!")
            return False
        
        self.balance += amount
        self._add_transaction("Deposit", amount)
        print(f"✅ Deposited $\{amount:.2f}. New balance: $\{self.balance:.2f}")
        return True
    
    def withdraw(self, amount):
        \"\"\"Withdraw money from account\"\"\"
        if amount <= 0:
            print("❌ Withdrawal amount must be positive!")
            return False
        
        if amount > self.balance:
            print(f"❌ Insufficient funds! Balance: $\{self.balance:.2f}")
            return False
        
        self.balance -= amount
        self._add_transaction("Withdrawal", -amount)
        print(f"✅ Withdrew $\{amount:.2f}. New balance: $\{self.balance:.2f}")
        return True
    
    def transfer(self, other_account, amount):
        \"\"\"Transfer money to another account\"\"\"
        if self.withdraw(amount):
            other_account.deposit(amount)
            print(f"💸 Transferred $\{amount:.2f} to {other_account.account_holder}")
            return True
        return False
    
    def add_interest(self):
        \"\"\"Add interest to account\"\"\"
        interest = self.balance * self.interest_rate
        self.balance += interest
        self._add_transaction("Interest", interest)
        print(f"💰 Interest added: $\{interest:.2f}")
    
    def get_statement(self):
        \"\"\"Get account statement\"\"\"
        print(f"\\n📋 Account Statement - {self.bank_name}")
        print("=" * 40)
        print(f"Account Holder: {self.account_holder}")
        print(f"Account Number: {self.account_number}")
        print(f"Current Balance: $\{self.balance:.2f}")
        print("\\nTransaction History:")
        print("-" * 40)
        
        for transaction in self.transaction_history[-10:]:  # Last 10 transactions
            print(f"{transaction['date']} | {transaction['type']:12} | $\{transaction['amount']:8.2f}")
    
    def _add_transaction(self, transaction_type, amount):
        \"\"\"Private method to add transaction to history\"\"\"
        import datetime
        self.transaction_history.append({
            'date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
            'type': transaction_type,
            'amount': amount
        })

# Using the bank account system
print("🏦 Bank Account Demo")
print("=" * 20)

# Create accounts
alice_account = BankAccount("Alice Johnson", "ACC001", 1000)
bob_account = BankAccount("Bob Smith", "ACC002", 500)

# Perform transactions
alice_account.deposit(250)
alice_account.withdraw(100)
alice_account.transfer(bob_account, 150)
alice_account.add_interest()

# Show statements
alice_account.get_statement()
bob_account.get_statement()
\`\`\`

### 2. Library Management System:
**Complete Example:**
\`\`\`
class Book:
    \"\"\"Represents a book in the library\"\"\"
    
    def __init__(self, title, author, isbn, copies=1):
        self.title = title
        self.author = author
        self.isbn = isbn
        self.total_copies = copies
        self.available_copies = copies
        self.borrowed_by = []
    
    def is_available(self):
        \"\"\"Check if book is available for borrowing\"\"\"
        return self.available_copies > 0
    
    def borrow(self, member_name):
        \"\"\"Borrow the book\"\"\"
        if self.is_available():
            self.available_copies -= 1
            self.borrowed_by.append(member_name)
            return True
        return False
    
    def return_book(self, member_name):
        \"\"\"Return the book\"\"\"
        if member_name in self.borrowed_by:
            self.available_copies += 1
            self.borrowed_by.remove(member_name)
            return True
        return False
    
    def __str__(self):
        \"\"\"String representation of book\"\"\"
        return f"'{self.title}' by {self.author} ({self.available_copies}/{self.total_copies} available)"

class LibraryMember:
    \"\"\"Represents a library member\"\"\"
    
    def __init__(self, name, member_id):
        self.name = name
        self.member_id = member_id
        self.borrowed_books = []
        self.borrow_limit = 5
    
    def can_borrow(self):
        \"\"\"Check if member can borrow more books\"\"\"
        return len(self.borrowed_books) < self.borrow_limit
    
    def borrow_book(self, book):
        \"\"\"Borrow a book\"\"\"
        if not self.can_borrow():
            print(f"❌ {self.name} has reached borrowing limit ({self.borrow_limit} books)")
            return False
        
        if book.borrow(self.name):
            self.borrowed_books.append(book)
            print(f"✅ {self.name} borrowed '{book.title}'")
            return True
        else:
            print(f"❌ '{book.title}' is not available")
            return False
    
    def return_book(self, book):
        \"\"\"Return a book\"\"\"
        if book in self.borrowed_books and book.return_book(self.name):
            self.borrowed_books.remove(book)
            print(f"✅ {self.name} returned '{book.title}'")
            return True
        else:
            print(f"❌ {self.name} doesn't have '{book.title}' borrowed")
            return False
    
    def list_borrowed_books(self):
        \"\"\"List all borrowed books\"\"\"
        if self.borrowed_books:
            print(f"📚 {self.name}'s borrowed books:")
            for i, book in enumerate(self.borrowed_books, 1):
                print(f"  {i}. {book.title} by {book.author}")
        else:
            print(f"{self.name} has no borrowed books")

class Library:
    \"\"\"Represents the library system\"\"\"
    
    def __init__(self, name):
        self.name = name
        self.books = []
        self.members = []
    
    def add_book(self, book):
        \"\"\"Add a book to the library\"\"\"
        self.books.append(book)
        print(f"📖 Added '{book.title}' to {self.name}")
    
    def register_member(self, member):
        \"\"\"Register a new member\"\"\"
        self.members.append(member)
        print(f"👤 Registered {member.name} as member")
    
    def find_book(self, title):
        \"\"\"Find a book by title\"\"\"
        for book in self.books:
            if book.title.lower() == title.lower():
                return book
        return None
    
    def show_available_books(self):
        \"\"\"Show all available books\"\"\"
        print(f"\\n📚 Available Books at {self.name}:")
        print("-" * 50)
        available_books = [book for book in self.books if book.is_available()]
        
        if available_books:
            for book in available_books:
                print(f"  • {book}")
        else:
            print("  No books available")

# Using the library system
print("📚 Library Management Demo")
print("=" * 30)

# Create library
library = Library("City Central Library")

# Add books
books_to_add = [
    Book("Python Programming", "John Doe", "978-1234567890", 3),
    Book("Data Science Handbook", "Jane Smith", "978-0987654321", 2),
    Book("Web Development", "Mike Johnson", "978-1122334455", 1),
    Book("Machine Learning", "Sarah Wilson", "978-5566778899", 2)
]

for book in books_to_add:
    library.add_book(book)

# Register members
alice = LibraryMember("Alice Cooper", "MEM001")
bob = LibraryMember("Bob Dylan", "MEM002")

library.register_member(alice)
library.register_member(bob)

# Show available books
library.show_available_books()

# Borrow books
print("\\n📖 Borrowing Books:")
python_book = library.find_book("Python Programming")
web_book = library.find_book("Web Development")

alice.borrow_book(python_book)
bob.borrow_book(python_book)
alice.borrow_book(web_book)

# Show borrowed books
print("\\n📋 Member Status:")
alice.list_borrowed_books()
bob.list_borrowed_books()

# Show updated availability
library.show_available_books()

# Return a book
print("\\n📤 Returning Books:")
alice.return_book(web_book)
library.show_available_books()
\`\`\`

## 🔧 Special Methods (Magic Methods)

Make your objects more Pythonic:

**Examples:**
\`\`\`
class Point:
    \"\"\"Represents a 2D point with special methods\"\"\"
    
    def __init__(self, x, y):
        self.x = x
        self.y = y
    
    def __str__(self):
        \"\"\"String representation for users\"\"\"
        return f"Point({self.x}, {self.y})"
    
    def __repr__(self):
        \"\"\"String representation for developers\"\"\"
        return f"Point(x={self.x}, y={self.y})"
    
    def __add__(self, other):
        \"\"\"Add two points\"\"\"
        return Point(self.x + other.x, self.y + other.y)
    
    def __eq__(self, other):
        \"\"\"Check if two points are equal\"\"\"
        return self.x == other.x and self.y == other.y
    
    def __lt__(self, other):
        \"\"\"Compare points by distance from origin\"\"\"
        self_distance = (self.x ** 2 + self.y ** 2) ** 0.5
        other_distance = (other.x ** 2 + other.y ** 2) ** 0.5
        return self_distance < other_distance
    
    def distance_to(self, other):
        \"\"\"Calculate distance to another point\"\"\"
        return ((self.x - other.x) ** 2 + (self.y - other.y) ** 2) ** 0.5

# Using special methods
p1 = Point(3, 4)
p2 = Point(1, 2)
p3 = Point(3, 4)

print(f"Point 1: {p1}")           # Uses __str__
print(f"Point 2: {p2}")

print(f"p1 + p2 = {p1 + p2}")    # Uses __add__
print(f"p1 == p3: {p1 == p3}")   # Uses __eq__
print(f"p1 < p2: {p1 < p2}")     # Uses __lt__

print(f"Distance from p1 to p2: {p1.distance_to(p2):.2f}")
\`\`\`

## 💡 OOP Best Practices

### ✅ Good Practices:
1. **Use meaningful class names**: \`BankAccount\` not \`BA\`
2. **Keep classes focused**: One responsibility per class
3. **Use proper encapsulation**: Mark private attributes with \`_\`
4. **Write docstrings**: Document your classes and methods

### ❌ Common Mistakes:
1. **God classes**: Classes that do too much
2. **Poor naming**: \`data1\`, \`thing\`, \`stuff\`
3. **No encapsulation**: Making everything public
4. **Forgetting self**: First parameter in instance methods

### 🎯 When to Use Classes:
- **Model real-world entities**: User, Product, Order
- **Group related data and functions**: BankAccount with balance and transactions
- **Create reusable components**: UI widgets, game characters
- **Manage state**: Game state, application settings

Ready to build complex applications with clean, organized code? Try the challenges below! 🎯`,
        relatedChallenges: [
          "Object-Oriented Programming",
          "Class Design and Implementation",
        ],
      },
      {
        title: "Modules, Libraries & Code Organization",
        slug: "modules-libraries",
        content: `# 📦 Modules, Libraries & Code Organization

Learn to organize your code into reusable modules, leverage Python's vast ecosystem of libraries, and build scalable applications!

## 🎯 Understanding Modules

### What are Modules?
Modules are Python files containing code that can be imported and used in other programs:
- **Built-in modules**: Come with Python (math, random, datetime)
- **Third-party modules**: Installed via pip (requests, pandas, numpy)
- **Custom modules**: Your own Python files

**Benefits:**
- **Code reusability**: Write once, use everywhere
- **Organization**: Keep related functions together
- **Namespace management**: Avoid name conflicts
- **Collaboration**: Share code between team members

## 📚 Working with Built-in Modules

### Common Built-in Modules:
**Examples:**
\`\`\`
# Math module for mathematical operations
import math

print(f"Pi: {math.pi}")
print(f"Square root of 16: {math.sqrt(16)}")
print(f"Ceiling of 4.3: {math.ceil(4.3)}")
print(f"Floor of 4.8: {math.floor(4.8)}")
print(f"Factorial of 5: {math.factorial(5)}")

# Random module for random numbers
import random

# Random integers
print(f"Random integer 1-10: {random.randint(1, 10)}")
print(f"Random choice from list: {random.choice(['apple', 'banana', 'orange'])}")

# Random floats
print(f"Random float 0-1: {random.random()}")
print(f"Random float 1-100: {random.uniform(1, 100)}")

# Shuffle and sample
numbers = [1, 2, 3, 4, 5]
random.shuffle(numbers)
print(f"Shuffled numbers: {numbers}")
print(f"Random sample of 3: {random.sample(range(1, 11), 3)}")

# Datetime module for date and time
import datetime

now = datetime.datetime.now()
print(f"Current date and time: {now}")
print(f"Current date: {now.date()}")
print(f"Current time: {now.time()}")

# Format dates
formatted = now.strftime("%Y-%m-%d %H:%M:%S")
print(f"Formatted date: {formatted}")

# Date arithmetic
tomorrow = now + datetime.timedelta(days=1)
print(f"Tomorrow: {tomorrow.date()}")
\`\`\`

### Different Import Styles:
**Examples:**
\`\`\`
# Import entire module
import math
result1 = math.sqrt(25)

# Import specific functions
from math import sqrt, pi, ceil
result2 = sqrt(25)

# Import with alias
import datetime as dt
now = dt.datetime.now()

# Import all (not recommended for most cases)
from random import *
number = randint(1, 10)  # Can cause name conflicts!

# Import multiple items
from os import path, listdir, makedirs
\`\`\`

## 🔧 Creating Custom Modules

### 1. Simple Math Utilities Module:
**File: \`math_utils.py\`**
\`\`\`
\"\"\"
Math utility functions for common calculations
\"\"\"

def calculate_area_rectangle(length, width):
    \"\"\"Calculate area of a rectangle\"\"\"
    return length * width

def calculate_area_circle(radius):
    \"\"\"Calculate area of a circle\"\"\"
    import math
    return math.pi * radius ** 2

def calculate_distance(x1, y1, x2, y2):
    \"\"\"Calculate distance between two points\"\"\"
    import math
    return math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

def is_prime(n):
    \"\"\"Check if a number is prime\"\"\"
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

def get_prime_factors(n):
    \"\"\"Get all prime factors of a number\"\"\"
    factors = []
    d = 2
    while d * d <= n:
        while n % d == 0:
            factors.append(d)
            n //= d
        d += 1
    if n > 1:
        factors.append(n)
    return factors

# Module-level variables
PI = 3.14159265359
E = 2.71828182846

# Module-level code (runs when imported)
print(f"Math utilities module loaded!")
\`\`\`

**Using the custom module:**
\`\`\`
# Import our custom module
import math_utils

# Use functions from our module
area = math_utils.calculate_area_rectangle(10, 5)
print(f"Rectangle area: {area}")

circle_area = math_utils.calculate_area_circle(3)
print(f"Circle area: {circle_area:.2f}")

distance = math_utils.calculate_distance(0, 0, 3, 4)
print(f"Distance: {distance}")

print(f"Is 17 prime? {math_utils.is_prime(17)}")
print(f"Prime factors of 60: {math_utils.get_prime_factors(60)}")

# Use module variables
print(f"Pi from module: {math_utils.PI}")
\`\`\`

### 2. File Operations Module:
**File: \`file_ops.py\`**
\`\`\`
\"\"\"
File operation utilities for common file tasks
\"\"\"

import os
import json
from datetime import datetime

def ensure_directory(directory_path):
    \"\"\"Create directory if it doesn't exist\"\"\"
    if not os.path.exists(directory_path):
        os.makedirs(directory_path)
        print(f"Created directory: {directory_path}")
        return True
    return False

def save_json(data, filename):
    \"\"\"Save data to JSON file\"\"\"
    try:
        with open(filename, 'w') as file:
            json.dump(data, file, indent=2)
        print(f"Data saved to {filename}")
        return True
    except Exception as e:
        print(f"Error saving JSON: {e}")
        return False

def load_json(filename):
    \"\"\"Load data from JSON file\"\"\"
    try:
        with open(filename, 'r') as file:
            data = json.load(file)
        print(f"Data loaded from {filename}")
        return data
    except FileNotFoundError:
        print(f"File {filename} not found")
        return None
    except Exception as e:
        print(f"Error loading JSON: {e}")
        return None

def create_backup(filename):
    \"\"\"Create a backup copy of a file\"\"\"
    if os.path.exists(filename):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_name = f"{filename}.backup_{timestamp}"
        
        try:
            import shutil
            shutil.copy2(filename, backup_name)
            print(f"Backup created: {backup_name}")
            return backup_name
        except Exception as e:
            print(f"Error creating backup: {e}")
            return None
    else:
        print(f"File {filename} doesn't exist")
        return None

def list_files_by_extension(directory, extension):
    \"\"\"List all files with specific extension in directory\"\"\"
    files = []
    if os.path.exists(directory):
        for file in os.listdir(directory):
            if file.endswith(extension):
                files.append(os.path.join(directory, file))
    return files

def get_file_info(filename):
    \"\"\"Get detailed information about a file\"\"\"
    if os.path.exists(filename):
        stat = os.stat(filename)
        return {
            'name': os.path.basename(filename),
            'size': stat.st_size,
            'created': datetime.fromtimestamp(stat.st_ctime),
            'modified': datetime.fromtimestamp(stat.st_mtime),
            'is_file': os.path.isfile(filename),
            'is_directory': os.path.isdir(filename)
        }
    return None
\`\`\`

**Using the file operations module:**
\`\`\`
import file_ops

# Create directory and save data
file_ops.ensure_directory("data")

user_data = {
    "users": [
        {"name": "Alice", "age": 25, "city": "New York"},
        {"name": "Bob", "age": 30, "city": "San Francisco"}
    ],
    "created": "2024-01-15"
}

# Save and load JSON data
file_ops.save_json(user_data, "data/users.json")
loaded_data = file_ops.load_json("data/users.json")
print(f"Loaded data: {loaded_data}")

# Create backup
backup_file = file_ops.create_backup("data/users.json")

# Get file information
file_info = file_ops.get_file_info("data/users.json")
if file_info:
    print(f"File info: {file_info}")

# List Python files in current directory
python_files = file_ops.list_files_by_extension(".", ".py")
print(f"Python files: {python_files}")
\`\`\`

## 🎮 Real-World Package Example

### Creating a Game Package:
**Directory structure:**
\`\`\`
game_package/
    __init__.py
    player.py
    inventory.py
    game_engine.py
\`\`\`

**File: \`game_package/__init__.py\`**
\`\`\`
\"\"\"
A simple game package for RPG-style games
\"\"\"

from .player import Player
from .inventory import Inventory
from .game_engine import GameEngine

__version__ = "1.0.0"
__author__ = "Your Name"

# Package-level constants
MAX_PLAYERS = 4
DEFAULT_HEALTH = 100
DEFAULT_MANA = 50
\`\`\`

**File: \`game_package/player.py\`**
\`\`\`
\"\"\"Player class for the game\"\"\"

from .inventory import Inventory

class Player:
    \"\"\"Represents a game player\"\"\"
    
    def __init__(self, name, player_class="warrior"):
        self.name = name
        self.player_class = player_class
        self.level = 1
        self.health = 100
        self.mana = 50
        self.experience = 0
        self.inventory = Inventory()
        self._set_class_attributes()
    
    def _set_class_attributes(self):
        \"\"\"Set attributes based on player class\"\"\"
        class_attributes = {
            "warrior": {"health": 120, "mana": 30, "strength": 15},
            "mage": {"health": 80, "mana": 100, "intelligence": 15},
            "rogue": {"health": 90, "mana": 40, "agility": 15}
        }
        
        if self.player_class in class_attributes:
            attrs = class_attributes[self.player_class]
            self.health = attrs.get("health", 100)
            self.mana = attrs.get("mana", 50)
    
    def gain_experience(self, amount):
        \"\"\"Gain experience points\"\"\"
        self.experience += amount
        old_level = self.level
        self.level = 1 + (self.experience // 100)  # Level up every 100 XP
        
        if self.level > old_level:
            self.level_up()
    
    def level_up(self):
        \"\"\"Handle level up\"\"\"
        print(f"🎉 {self.name} leveled up to level {self.level}!")
        self.health += 10
        self.mana += 5
    
    def take_damage(self, amount):
        \"\"\"Take damage\"\"\"
        self.health -= amount
        if self.health <= 0:
            self.health = 0
            print(f"💀 {self.name} has been defeated!")
        else:
            print(f"⚔️ {self.name} took {amount} damage. Health: {self.health}")
    
    def heal(self, amount):
        \"\"\"Heal the player\"\"\"
        self.health = min(self.health + amount, 100 + (self.level - 1) * 10)
        print(f"💚 {self.name} healed for {amount}. Health: {self.health}")
    
    def get_status(self):
        \"\"\"Get player status\"\"\"
        return {
            "name": self.name,
            "class": self.player_class,
            "level": self.level,
            "health": self.health,
            "mana": self.mana,
            "experience": self.experience,
            "inventory_items": len(self.inventory.items)
        }
\`\`\`

**File: \`game_package/inventory.py\`**
\`\`\`
\"\"\"Inventory system for the game\"\"\"

class Item:
    \"\"\"Represents a game item\"\"\"
    
    def __init__(self, name, item_type, value=0, description=""):
        self.name = name
        self.item_type = item_type
        self.value = value
        self.description = description
    
    def __str__(self):
        return f"{self.name} ({self.item_type})"

class Inventory:
    \"\"\"Manages player inventory\"\"\"
    
    def __init__(self, max_slots=20):
        self.items = []
        self.max_slots = max_slots
    
    def add_item(self, item):
        \"\"\"Add item to inventory\"\"\"
        if len(self.items) < self.max_slots:
            self.items.append(item)
            print(f"📦 Added {item.name} to inventory")
            return True
        else:
            print("❌ Inventory is full!")
            return False
    
    def remove_item(self, item_name):
        \"\"\"Remove item from inventory\"\"\"
        for item in self.items:
            if item.name.lower() == item_name.lower():
                self.items.remove(item)
                print(f"🗑️ Removed {item.name} from inventory")
                return item
        print(f"❌ Item '{item_name}' not found in inventory")
        return None
    
    def find_item(self, item_name):
        \"\"\"Find item in inventory\"\"\"
        for item in self.items:
            if item.name.lower() == item_name.lower():
                return item
        return None
    
    def list_items(self):
        \"\"\"List all items in inventory\"\"\"
        if not self.items:
            print("📦 Inventory is empty")
            return
        
        print(f"📦 Inventory ({len(self.items)}/{self.max_slots}):")
        for i, item in enumerate(self.items, 1):
            print(f"  {i}. {item} - {item.description}")
    
    def get_total_value(self):
        \"\"\"Get total value of all items\"\"\"
        return sum(item.value for item in self.items)
\`\`\`

**Using the game package:**
\`\`\`
# Import the game package
from game_package import Player, Inventory, Item
from game_package import MAX_PLAYERS, DEFAULT_HEALTH

# Create players
alice = Player("Alice", "mage")
bob = Player("Bob", "warrior")

print(f"Max players allowed: {MAX_PLAYERS}")

# Show initial status
print(f"Alice status: {alice.get_status()}")
print(f"Bob status: {bob.get_status()}")

# Add items to inventory
sword = Item("Iron Sword", "weapon", 50, "A sturdy iron sword")
potion = Item("Health Potion", "consumable", 25, "Restores 30 health")
gem = Item("Ruby", "treasure", 100, "A valuable red gem")

alice.inventory.add_item(sword)
alice.inventory.add_item(potion)
bob.inventory.add_item(gem)

# Show inventories
alice.inventory.list_items()
bob.inventory.list_items()

# Game actions
alice.gain_experience(150)  # Level up!
alice.take_damage(30)
alice.heal(20)

print(f"Alice final status: {alice.get_status()}")
\`\`\`

## 🌐 Working with Third-Party Libraries

### Installing and Using External Libraries:

**Install libraries using pip:**
\`\`\`
# In terminal/command prompt:
pip install requests
pip install pandas
pip install matplotlib
\`\`\`

**Example using requests library:**
\`\`\`
import requests
import json

def get_weather(city):
    \"\"\"Get weather data for a city (example API)\"\"\"
    # Note: This is a simplified example
    # In reality, you'd need an API key
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Error: {response.status_code}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return None

# Example usage (would need real API key)
# weather_data = get_weather("London")
# if weather_data:
#     print(f"Weather in London: {weather_data}")
\`\`\`

## 💡 Best Practices for Code Organization

### ✅ Good Practices:
1. **Use meaningful module names**: \`math_utils.py\`, not \`helpers.py\`
2. **Keep modules focused**: One clear purpose per module
3. **Document your modules**: Include docstrings and comments
4. **Use \`__init__.py\`**: For creating packages
5. **Follow naming conventions**: lowercase with underscores

### ❌ Common Mistakes:
1. **Circular imports**: Module A imports B, B imports A
2. **Too many functions in one module**: Keep modules manageable
3. **Poor organization**: Random functions thrown together
4. **Not using virtual environments**: For managing dependencies

### 📁 Recommended Project Structure:
\`\`\`
my_project/
    main.py                 # Entry point
    config.py              # Configuration settings
    utils/                 # Utility modules
        __init__.py
        file_ops.py
        math_utils.py
    models/                # Data models
        __init__.py
        user.py
        product.py
    tests/                 # Test files
        test_utils.py
        test_models.py
    requirements.txt       # Dependencies
    README.md             # Project documentation
\`\`\`

Ready to build modular, reusable code and leverage Python's ecosystem? Try the challenges below! 🎯`,
        relatedChallenges: [
          "Module Creation and Import",
          "Package Development",
        ],
      },
    ],
  },
  "Data Structures": {
    icon: "📊",
    color: "from-blue-500 to-cyan-600",
    gradient: "from-blue-50 to-cyan-50",
    description: "Learn lists, dictionaries, and data organization techniques",
    lessons: [
      {
        title: "Introduction to Lists",
        slug: "intro-to-lists",
        content: `# 📋 Introduction to Lists

Lists are one of Python's most powerful and versatile data structures. Think of them as ordered containers that can hold multiple items.

## 🎯 What are Lists?

A list is a collection of items (elements) stored in a specific order:

**Examples:**
\`\`\`
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]
mixed = ["hello", 42, True, 3.14]
\`\`\`

## Creating Lists

**Different Ways:**
\`\`\`
# Empty list
empty_list = []

# List with items
colors = ["red", "green", "blue"]

# Using list() function
another_list = list([1, 2, 3])

# List from string
letter_list = list("Python")  # ['P', 'y', 't', 'h', 'o', 'n']
\`\`\`

## Accessing List Elements

Lists use **indexing** starting from 0:

**Examples:**
\`\`\`
fruits = ["apple", "banana", "orange"]

print(fruits[0])   # "apple" (first item)
print(fruits[1])   # "banana" (second item)
print(fruits[-1])  # "orange" (last item)
print(fruits[-2])  # "banana" (second to last)
\`\`\`

## List Slicing

Get multiple elements at once:

**Examples:**
\`\`\`
numbers = [0, 1, 2, 3, 4, 5]

print(numbers[1:4])    # [1, 2, 3]
print(numbers[:3])     # [0, 1, 2] (first 3)
print(numbers[3:])     # [3, 4, 5] (from index 3)
print(numbers[::2])    # [0, 2, 4] (every 2nd element)
\`\`\`

## Common List Operations

**Essential Methods:**
\`\`\`
shopping = ["milk", "bread"]

# Add items
shopping.append("eggs")        # Add to end
shopping.insert(0, "butter")   # Add at position

# Remove items
shopping.remove("bread")       # Remove by value
last_item = shopping.pop()     # Remove and return last

# Other useful operations
print(len(shopping))           # Length
print("milk" in shopping)      # Check if exists
shopping.sort()               # Sort alphabetically
\`\`\`

## Real-World Example: Todo List

**Complete Example:**
\`\`\`
todo_list = []

# Add tasks
todo_list.append("Learn Python")
todo_list.append("Build a project")
todo_list.append("Get a job")

# Mark task as done (remove it)
if "Learn Python" in todo_list:
    todo_list.remove("Learn Python")
    print("Task completed!")

print(f"Remaining tasks: {len(todo_list)}")
for i, task in enumerate(todo_list, 1):
    print(f"{i}. {task}")
\`\`\`

Ready to master list operations? Practice with the challenges below!`,
        relatedChallenges: [
          "Introduction to Lists",
          "List Methods and Manipulation",
        ],
      },
      {
        title: "Advanced List Operations & List Comprehensions",
        slug: "advanced-list-operations",
        content: `# 🚀 Advanced List Operations & List Comprehensions

Master advanced list techniques to write more efficient and Pythonic code!

## 🎯 List Comprehensions

List comprehensions provide a concise way to create lists:

### Basic Syntax:
**Pattern:** \`[expression for item in iterable]\`

**Examples:**
\`\`\`
# Traditional way
squares = []
for x in range(10):
    squares.append(x ** 2)

# List comprehension way
squares = [x ** 2 for x in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# More examples
even_numbers = [x for x in range(20) if x % 2 == 0]
words = ["hello", "world", "python"]
lengths = [len(word) for word in words]
uppercase = [word.upper() for word in words]
\`\`\`

### Conditional List Comprehensions:
**Pattern:** \`[expression for item in iterable if condition]\`

**Examples:**
\`\`\`
# Filter positive numbers and square them
numbers = [-2, -1, 0, 1, 2, 3, 4, 5]
positive_squares = [x ** 2 for x in numbers if x > 0]
print(positive_squares)  # [1, 4, 9, 16, 25]

# Filter and transform strings
names = ["Alice", "bob", "CHARLIE", "diana"]
title_case_long = [name.title() for name in names if len(name) > 3]
print(title_case_long)  # ['Alice', 'Charlie', 'Diana']

# Complex filtering
grades = [85, 92, 78, 96, 88, 76, 94]
high_grades = [grade for grade in grades if grade >= 90]
grade_letters = ['A' if g >= 90 else 'B' if g >= 80 else 'C' for g in grades]
\`\`\`

## 🔧 Advanced List Methods

### Sorting and Reversing:
**Examples:**
\`\`\`
numbers = [64, 34, 25, 12, 22, 11, 90]

# Sort in place (modifies original)
numbers.sort()
print(numbers)  # [11, 12, 22, 25, 34, 64, 90]

# Sort with custom key
students = ["Alice", "bob", "Charlie", "diana"]
students.sort(key=str.lower)  # Case-insensitive sort
print(students)  # ['Alice', 'bob', 'Charlie', 'diana']

# Sort by length
words = ["python", "java", "c", "javascript", "go"]
words.sort(key=len)
print(words)  # ['c', 'go', 'java', 'python', 'javascript']

# Reverse
numbers.reverse()
print(numbers)  # [90, 64, 34, 25, 22, 12, 11]

# Sorted() - creates new list
original = [5, 2, 8, 1, 9]
sorted_copy = sorted(original, reverse=True)
print(original)      # [5, 2, 8, 1, 9] (unchanged)
print(sorted_copy)   # [9, 8, 5, 2, 1]
\`\`\`

### Counting and Finding:
**Examples:**
\`\`\`
colors = ["red", "green", "blue", "red", "yellow", "red"]

# Count occurrences
red_count = colors.count("red")
print(f"Red appears {red_count} times")  # Red appears 3 times

# Find index
try:
    blue_index = colors.index("blue")
    print(f"Blue is at index {blue_index}")  # Blue is at index 2
except ValueError:
    print("Color not found")

# Check membership
print("purple" in colors)  # False
print("green" in colors)   # True
\`\`\`

## 🎮 Real-World Examples

### 1. Data Processing Pipeline:
**Complete Example:**
\`\`\`
# Raw data processing
raw_scores = ["85", "92.5", "invalid", "78", "96", "", "88.5"]

# Clean and process data
processed_scores = []
for score in raw_scores:
    if score and score.replace(".", "").isdigit():
        processed_scores.append(float(score))

# Using list comprehension (more Pythonic)
clean_scores = [float(s) for s in raw_scores
                if s and s.replace(".", "").isdigit()]

print(f"Processed scores: {clean_scores}")
print(f"Average: {sum(clean_scores) / len(clean_scores):.1f}")

# Categorize scores
grade_categories = {
    'A': [s for s in clean_scores if s >= 90],
    'B': [s for s in clean_scores if 80 <= s < 90],
    'C': [s for s in clean_scores if 70 <= s < 80]
}

for grade, scores in grade_categories.items():
    print(f"Grade {grade}: {len(scores)} students")
\`\`\`

### 2. Text Analysis Tool:
**Complete Example:**
\`\`\`
text = "The quick brown fox jumps over the lazy dog"
words = text.lower().split()

# Word analysis using list comprehensions
long_words = [word for word in words if len(word) > 4]
word_lengths = [len(word) for word in words]
unique_letters = list(set([char for word in words for char in word]))

print(f"Original text: {text}")
print(f"Total words: {len(words)}")
print(f"Long words (>4 chars): {long_words}")
print(f"Average word length: {sum(word_lengths) / len(word_lengths):.1f}")
print(f"Unique letters: {sorted(unique_letters)}")

# Find words with specific patterns
vowels = "aeiou"
words_with_vowels = [word for word in words
                     if any(vowel in word for vowel in vowels)]
words_without_vowels = [word for word in words
                        if not any(vowel in word for vowel in vowels)]

print(f"Words with vowels: {len(words_with_vowels)}")
print(f"Words without vowels: {words_without_vowels}")
\`\`\`

### 3. Shopping Cart System:
**Complete Example:**
\`\`\`
class ShoppingCart:
    def __init__(self):
        self.items = []
    
    def add_item(self, name, price, quantity=1):
        self.items.append({
            'name': name,
            'price': price,
            'quantity': quantity
        })
    
    def get_total(self):
        return sum(item['price'] * item['quantity'] for item in self.items)
    
    def get_expensive_items(self, min_price=50):
        return [item for item in self.items if item['price'] >= min_price]
    
    def get_item_summary(self):
        return [f"{item['name']} x{item['quantity']} = $\{item['price'] * item['quantity']:.2f}"
                for item in self.items]
    
    def apply_discount(self, discount_percent):
        # Apply discount using list comprehension
        self.items = [{**item, 'price': item['price'] * (1 - discount_percent/100)}
                     for item in self.items]

# Using the shopping cart
cart = ShoppingCart()
cart.add_item("Laptop", 999.99, 1)
cart.add_item("Mouse", 29.99, 2)
cart.add_item("Keyboard", 79.99, 1)
cart.add_item("Monitor", 299.99, 1)

print("Shopping Cart Summary:")
for summary in cart.get_item_summary():
    print(f"  {summary}")

print(f"\\nTotal: $\{cart.get_total():.2f}")

expensive_items = cart.get_expensive_items(100)
print(f"\\nExpensive items (>$100): {[item['name'] for item in expensive_items]}")

# Apply 10% discount
cart.apply_discount(10)
print(f"\\nAfter 10% discount: $\{cart.get_total():.2f}")
\`\`\`

## 🔍 Nested List Comprehensions

Handle complex data structures:

**Examples:**
\`\`\`
# 2D matrix operations
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]

# Flatten matrix
flattened = [item for row in matrix for item in row]
print(flattened)  # [1, 2, 3, 4, 5, 6, 7, 8, 9]

# Transpose matrix
transposed = [[row[i] for row in matrix] for i in range(len(matrix[0]))]
print(transposed)  # [[1, 4, 7], [2, 5, 8], [3, 6, 9]]

# Filter and transform nested data
students = [
    {'name': 'Alice', 'grades': [85, 92, 78]},
    {'name': 'Bob', 'grades': [90, 87, 94]},
    {'name': 'Carol', 'grades': [88, 95, 91]}
]

# Get all grades above 90
high_grades = [grade for student in students
               for grade in student['grades'] if grade >= 90]
print(f"High grades: {high_grades}")

# Student averages
averages = [{student['name']: sum(student['grades']) / len(student['grades'])}
            for student in students]
print(f"Averages: {averages}")
\`\`\`

## 💡 Performance Tips

### Memory Efficiency:
**Examples:**
\`\`\`
# Use generators for large datasets
def large_squares():
    return (x ** 2 for x in range(1000000))  # Generator, not list

# When you need a list, use list comprehension
squares_list = [x ** 2 for x in range(1000)]

# For filtering large datasets
large_numbers = range(1000000)
even_numbers = [x for x in large_numbers if x % 2 == 0]

# Use any() and all() for boolean checks
numbers = [1, 2, 3, 4, 5]
all_positive = all(num > 0 for num in numbers)
has_even = any(num % 2 == 0 for num in numbers)
\`\`\`

## 🎯 Best Practices

### ✅ Good Practices:
1. **Use list comprehensions** for simple transformations
2. **Keep comprehensions readable** - break complex ones into regular loops
3. **Use meaningful variable names** even in comprehensions
4. **Consider memory usage** for large datasets

### ❌ Common Mistakes:
1. **Overly complex comprehensions** - harder to read than regular loops
2. **Modifying lists while iterating** - use list comprehensions instead
3. **Not handling empty lists** - always check for edge cases

Ready to write more efficient Python code? Practice with the challenges below!`,
        relatedChallenges: ["List Comprehensions", "Advanced List Operations"],
      },
      {
        title: "Dictionaries: Key-Value Data Management",
        slug: "dictionaries-key-value",
        content: `# 🗂️ Dictionaries: Key-Value Data Management

Dictionaries are Python's built-in hash table implementation, perfect for storing data as key-value pairs!

## 🎯 Understanding Dictionaries

### What are Dictionaries?
Dictionaries store data as **key-value pairs** where:
- **Keys** are unique identifiers (immutable types)
- **Values** can be any Python object
- **Fast lookup** by key (O(1) average time)

**Examples:**
\`\`\`
# Creating dictionaries
student = {
    "name": "Alice",
    "age": 20,
    "grade": "A",
    "subjects": ["Math", "Science", "English"]
}

# Empty dictionary
empty_dict = {}
another_empty = dict()

# Using dict() constructor
coordinates = dict(x=10, y=20, z=5)
\`\`\`

## 🔧 Dictionary Operations

### Accessing and Modifying:
**Examples:**
\`\`\`
student = {"name": "Alice", "age": 20, "grade": "A"}

# Access values
print(student["name"])        # "Alice"
print(student.get("age"))     # 20
print(student.get("height", "Unknown"))  # "Unknown" (default)

# Modify values
student["age"] = 21
student["grade"] = "A+"

# Add new key-value pairs
student["email"] = "alice@example.com"
student.update({"phone": "555-0123", "city": "New York"})

print(student)
\`\`\`

### Removing Items:
**Examples:**
\`\`\`
data = {"a": 1, "b": 2, "c": 3, "temp": "delete_me"}

# Remove by key
del data["temp"]

# Remove and return value
value = data.pop("c", None)  # Returns None if key doesn't exist
print(f"Removed value: {value}")

# Remove and return arbitrary item
key, value = data.popitem()
print(f"Removed {key}: {value}")

# Clear all items
# data.clear()
\`\`\`

## 🎮 Real-World Examples

### 1. User Profile Management:
**Complete Example:**
\`\`\`
class UserProfile:
    def __init__(self):
        self.users = {}
    
    def create_user(self, username, email, age):
        if username in self.users:
            return False, "Username already exists"
        
        self.users[username] = {
            "email": email,
            "age": age,
            "created_at": "2024-01-15",  # In real app, use datetime
            "posts": [],
            "followers": set(),
            "following": set(),
            "settings": {
                "theme": "light",
                "notifications": True,
                "privacy": "public"
            }
        }
        return True, "User created successfully"
    
    def get_user(self, username):
        return self.users.get(username)
    
    def update_settings(self, username, **settings):
        if username in self.users:
            self.users[username]["settings"].update(settings)
            return True
        return False
    
    def add_post(self, username, post_content):
        if username in self.users:
            self.users[username]["posts"].append({
                "content": post_content,
                "timestamp": "2024-01-15 10:30:00",
                "likes": 0
            })
            return True
        return False
    
    def follow_user(self, follower, following):
        if follower in self.users and following in self.users:
            self.users[follower]["following"].add(following)
            self.users[following]["followers"].add(follower)
            return True
        return False
    
    def get_user_stats(self, username):
        if username not in self.users:
            return None
        
        user = self.users[username]
        return {
            "username": username,
            "posts_count": len(user["posts"]),
            "followers_count": len(user["followers"]),
            "following_count": len(user["following"]),
            "total_likes": sum(post["likes"] for post in user["posts"])
        }

# Using the user profile system
profile_manager = UserProfile()

# Create users
profile_manager.create_user("alice", "alice@email.com", 25)
profile_manager.create_user("bob", "bob@email.com", 30)
profile_manager.create_user("carol", "carol@email.com", 28)

# Add some posts
profile_manager.add_post("alice", "Hello, this is my first post!")
profile_manager.add_post("alice", "Learning Python is awesome!")
profile_manager.add_post("bob", "Just finished a great project")

# Follow relationships
profile_manager.follow_user("alice", "bob")
profile_manager.follow_user("carol", "alice")
profile_manager.follow_user("carol", "bob")

# Update user settings
profile_manager.update_settings("alice", theme="dark", notifications=False)

# Get user information
alice = profile_manager.get_user("alice")
alice_stats = profile_manager.get_user_stats("alice")

print("Alice's Profile:")
print(f"Email: {alice['email']}")
print(f"Settings: {alice['settings']}")
print(f"Stats: {alice_stats}")
\`\`\`

### 2. Inventory Management System:
**Complete Example:**
\`\`\`
class InventoryManager:
    def __init__(self):
        self.inventory = {}
        self.categories = {}
        self.suppliers = {}
    
    def add_product(self, product_id, name, category, price, quantity, supplier):
        self.inventory[product_id] = {
            "name": name,
            "category": category,
            "price": price,
            "quantity": quantity,
            "supplier": supplier,
            "reorder_level": 10,
            "sales_count": 0
        }
        
        # Update category tracking
        if category not in self.categories:
            self.categories[category] = []
        self.categories[category].append(product_id)
        
        # Update supplier tracking
        if supplier not in self.suppliers:
            self.suppliers[supplier] = []
        self.suppliers[supplier].append(product_id)
    
    def update_stock(self, product_id, quantity_change):
        if product_id in self.inventory:
            self.inventory[product_id]["quantity"] += quantity_change
            return True
        return False
    
    def sell_product(self, product_id, quantity):
        if product_id in self.inventory:
            product = self.inventory[product_id]
            if product["quantity"] >= quantity:
                product["quantity"] -= quantity
                product["sales_count"] += quantity
                return True, f"Sold {quantity} units"
            else:
                return False, "Insufficient stock"
        return False, "Product not found"
    
    def get_low_stock_items(self):
        return {pid: product for pid, product in self.inventory.items()
                if product["quantity"] <= product["reorder_level"]}
    
    def get_category_report(self, category):
        if category not in self.categories:
            return {}
        
        products = {pid: self.inventory[pid] for pid in self.categories[category]}
        total_value = sum(p["price"] * p["quantity"] for p in products.values())
        total_items = sum(p["quantity"] for p in products.values())
        
        return {
            "products": products,
            "total_value": total_value,
            "total_items": total_items,
            "product_count": len(products)
        }
    
    def search_products(self, **criteria):
        results = {}
        for pid, product in self.inventory.items():
            match = True
            for key, value in criteria.items():
                if key in product and product[key] != value:
                    match = False
                    break
            if match:
                results[pid] = product
        return results

# Using the inventory system
inventory = InventoryManager()

# Add products
products_data = [
    ("P001", "Laptop Pro", "Electronics", 1299.99, 15, "TechSupply Co"),
    ("P002", "Wireless Mouse", "Electronics", 29.99, 50, "TechSupply Co"),
    ("P003", "Office Chair", "Furniture", 199.99, 8, "OfficeMax"),
    ("P004", "Desk Lamp", "Furniture", 49.99, 25, "OfficeMax"),
    ("P005", "Coffee Mug", "Kitchen", 12.99, 100, "HomeGoods"),
]

for product in products_data:
    inventory.add_product(*product)

# Simulate some sales
inventory.sell_product("P001", 3)
inventory.sell_product("P002", 15)
inventory.sell_product("P003", 5)

# Check low stock
low_stock = inventory.get_low_stock_items()
print("Low Stock Alert:")
for pid, product in low_stock.items():
    print(f"  {pid}: {product['name']} - Only {product['quantity']} left!")

# Category report
electronics_report = inventory.get_category_report("Electronics")
print(f"\\nElectronics Category:")
print(f"  Total Value: $\{electronics_report['total_value']:,.2f}")
print(f"  Total Items: {electronics_report['total_items']}")

# Search products
expensive_items = inventory.search_products(category="Electronics")
furniture_items = {pid: p for pid, p in inventory.search_products(category="Furniture").items()
                   if p["price"] > 100}

print(f"\\nExpensive Furniture: {list(furniture_items.keys())}")
\`\`\`

## 🔍 Dictionary Methods and Iteration

### Essential Methods:
**Examples:**
\`\`\`
data = {"name": "Alice", "age": 25, "city": "New York"}

# Get all keys, values, items
print(list(data.keys()))    # ['name', 'age', 'city']
print(list(data.values()))  # ['Alice', 25, 'New York']
print(list(data.items()))   # [('name', 'Alice'), ('age', 25), ('city', 'New York')]

# Dictionary iteration
for key in data:
    print(f"{key}: {data[key]}")

for key, value in data.items():
    print(f"{key} -> {value}")

for value in data.values():
    print(f"Value: {value}")

# Dictionary comprehensions
squared = {x: x**2 for x in range(5)}
filtered = {k: v for k, v in data.items() if isinstance(v, str)}
\`\`\`

### Merging Dictionaries:
**Examples:**
\`\`\`
dict1 = {"a": 1, "b": 2}
dict2 = {"c": 3, "d": 4}
dict3 = {"b": 20, "e": 5}  # Note: 'b' will override

# Python 3.9+ merge operator
merged = dict1 | dict2 | dict3
print(merged)  # {'a': 1, 'b': 20, 'c': 3, 'd': 4, 'e': 5}

# Update method
result = dict1.copy()
result.update(dict2)
result.update(dict3)

# Using ** unpacking
combined = {**dict1, **dict2, **dict3}

# Conditional merging
safe_merge = {}
for d in [dict1, dict2, dict3]:
    for k, v in d.items():
        if k not in safe_merge:
            safe_merge[k] = v
        else:
            safe_merge[k] = [safe_merge[k], v] if not isinstance(safe_merge[k], list) else safe_merge[k] + [v]
\`\`\`

## 🎯 Advanced Dictionary Patterns

### 1. Nested Dictionaries:
**Examples:**
\`\`\`
company = {
    "departments": {
        "engineering": {
            "employees": ["Alice", "Bob", "Charlie"],
            "budget": 500000,
            "projects": {
                "web_app": {"status": "active", "deadline": "2024-03-01"},
                "mobile_app": {"status": "planning", "deadline": "2024-06-01"}
            }
        },
        "marketing": {
            "employees": ["David", "Eve"],
            "budget": 200000,
            "campaigns": {
                "summer_sale": {"budget": 50000, "status": "running"},
                "winter_promo": {"budget": 30000, "status": "planned"}
            }
        }
    },
    "company_info": {
        "name": "TechCorp",
        "founded": 2020,
        "employees_total": 5
    }
}

# Accessing nested data
print(company["departments"]["engineering"]["employees"])
print(company["departments"]["engineering"]["projects"]["web_app"]["status"])

# Safe nested access
def safe_get(dictionary, *keys):
    for key in keys:
        if isinstance(dictionary, dict) and key in dictionary:
            dictionary = dictionary[key]
        else:
            return None
    return dictionary

web_app_status = safe_get(company, "departments", "engineering", "projects", "web_app", "status")
print(f"Web app status: {web_app_status}")
\`\`\`

### 2. DefaultDict Pattern:
**Examples:**
\`\`\`
from collections import defaultdict

# Group items by category
items = [
    ("apple", "fruit"),
    ("carrot", "vegetable"),
    ("banana", "fruit"),
    ("broccoli", "vegetable"),
    ("orange", "fruit")
]

# Using defaultdict
grouped = defaultdict(list)
for item, category in items:
    grouped[category].append(item)

print(dict(grouped))  # {'fruit': ['apple', 'banana', 'orange'], 'vegetable': ['carrot', 'broccoli']}

# Count occurrences
text = "hello world"
char_count = defaultdict(int)
for char in text:
    char_count[char] += 1

print(dict(char_count))  # {'h': 1, 'e': 1, 'l': 3, 'o': 2, ' ': 1, 'w': 1, 'r': 1, 'd': 1}
\`\`\`

## 💡 Performance and Best Practices

### ✅ Good Practices:
1. **Use get() method** for safe key access
2. **Use dict.items()** for key-value iteration
3. **Use dictionary comprehensions** for transformations
4. **Consider defaultdict** for grouping operations

### ❌ Common Mistakes:
1. **Using mutable objects as keys** (lists, dicts)
2. **Not handling missing keys** gracefully
3. **Modifying dict while iterating** over it
4. **Using dicts when other structures might be better**

### Performance Tips:
**Examples:**
\`\`\`
# Fast membership testing
large_dict = {i: i**2 for i in range(10000)}
print(5000 in large_dict)  # O(1) average case

# Use dict for lookups instead of lists
# Bad: checking if item in list (O(n))
valid_ids = [1, 2, 3, 4, 5]
is_valid = 3 in valid_ids

# Good: checking if key in dict (O(1))
valid_ids_dict = {1: True, 2: True, 3: True, 4: True, 5: True}
is_valid = 3 in valid_ids_dict

# Or even better: use sets for membership testing
valid_ids_set = {1, 2, 3, 4, 5}
is_valid = 3 in valid_ids_set
\`\`\`

Ready to organize your data efficiently? Practice with the challenges below!`,
        relatedChallenges: [
          "Dictionary Basics and Operations",
          "Nested Data Structures",
        ],
      },
      {
        title: "Sets: Unique Collections & Set Operations",
        slug: "sets-unique-collections",
        content: `# 🎯 Sets: Unique Collections & Set Operations

Sets are unordered collections of unique elements, perfect for mathematical operations and removing duplicates!

## 🎯 Understanding Sets

### What are Sets?
Sets are collections that:
- **Contain only unique elements** (no duplicates)
- **Are unordered** (no indexing)
- **Support mathematical operations** (union, intersection, etc.)
- **Have fast membership testing** (O(1) average)

**Examples:**
\`\`\`
# Creating sets
fruits = {"apple", "banana", "orange"}
numbers = {1, 2, 3, 4, 5}
mixed = {1, "hello", 3.14, True}

# Empty set (note: {} creates a dict, not a set!)
empty_set = set()

# Set from list (removes duplicates)
numbers_list = [1, 2, 2, 3, 3, 3, 4, 5]
unique_numbers = set(numbers_list)
print(unique_numbers)  # {1, 2, 3, 4, 5}
\`\`\`

## 🔧 Set Operations

### Basic Operations:
**Examples:**
\`\`\`
fruits = {"apple", "banana", "orange"}

# Add elements
fruits.add("grape")
fruits.update(["kiwi", "mango"])  # Add multiple
print(fruits)

# Remove elements
fruits.remove("banana")        # Raises error if not found
fruits.discard("pineapple")    # No error if not found
removed = fruits.pop()         # Remove and return arbitrary element

# Check membership
print("apple" in fruits)       # True
print("banana" in fruits)      # False

# Size and other info
print(len(fruits))
print(bool(fruits))            # False if empty, True otherwise
\`\`\`

### Mathematical Set Operations:
**Examples:**
\`\`\`
set_a = {1, 2, 3, 4, 5}
set_b = {4, 5, 6, 7, 8}
set_c = {1, 2, 3}

# Union (all elements from both sets)
union = set_a | set_b
# or: union = set_a.union(set_b)
print(f"Union: {union}")  # {1, 2, 3, 4, 5, 6, 7, 8}

# Intersection (elements in both sets)
intersection = set_a & set_b
# or: intersection = set_a.intersection(set_b)
print(f"Intersection: {intersection}")  # {4, 5}

# Difference (elements in first set but not second)
difference = set_a - set_b
# or: difference = set_a.difference(set_b)
print(f"A - B: {difference}")  # {1, 2, 3}

# Symmetric difference (elements in either set, but not both)
sym_diff = set_a ^ set_b
# or: sym_diff = set_a.symmetric_difference(set_b)
print(f"Symmetric difference: {sym_diff}")  # {1, 2, 3, 6, 7, 8}

# Subset and superset checks
print(f"C is subset of A: {set_c.issubset(set_a)}")        # True
print(f"A is superset of C: {set_a.issuperset(set_c)}")    # True
print(f"A and B are disjoint: {set_a.isdisjoint(set_b)}")  # False
\`\`\`

## 🎮 Real-World Examples

### 1. User Permission System:
**Complete Example:**
\`\`\`
class PermissionSystem:
    def __init__(self):
        self.users = {}
        self.roles = {
            "admin": {"read", "write", "delete", "manage_users", "manage_roles"},
            "editor": {"read", "write", "delete"},
            "viewer": {"read"},
            "moderator": {"read", "write", "moderate"}
        }
    
    def create_user(self, username, roles=None):
        if roles is None:
            roles = set()
        self.users[username] = {
            "roles": set(roles),
            "custom_permissions": set()
        }
    
    def assign_role(self, username, role):
        if username in self.users and role in self.roles:
            self.users[username]["roles"].add(role)
            return True
        return False
    
    def revoke_role(self, username, role):
        if username in self.users:
            self.users[username]["roles"].discard(role)
            return True
        return False
    
    def grant_permission(self, username, permission):
        if username in self.users:
            self.users[username]["custom_permissions"].add(permission)
            return True
        return False
    
    def get_user_permissions(self, username):
        if username not in self.users:
            return set()
        
        user = self.users[username]
        permissions = set()
        
        # Collect permissions from all roles
        for role in user["roles"]:
            if role in self.roles:
                permissions |= self.roles[role]  # Union operation
        
        # Add custom permissions
        permissions |= user["custom_permissions"]
        
        return permissions
    
    def can_user_perform(self, username, action):
        user_permissions = self.get_user_permissions(username)
        return action in user_permissions
    
    def get_users_with_permission(self, permission):
        users_with_permission = set()
        for username in self.users:
            if permission in self.get_user_permissions(username):
                users_with_permission.add(username)
        return users_with_permission
    
    def compare_user_permissions(self, user1, user2):
        perms1 = self.get_user_permissions(user1)
        perms2 = self.get_user_permissions(user2)
        
        return {
            "common_permissions": perms1 & perms2,
            "user1_only": perms1 - perms2,
            "user2_only": perms2 - perms1,
            "all_permissions": perms1 | perms2
        }

# Using the permission system
perm_system = PermissionSystem()

# Create users with different roles
perm_system.create_user("alice", ["admin"])
perm_system.create_user("bob", ["editor", "moderator"])
perm_system.create_user("carol", ["viewer"])

# Grant custom permission
perm_system.grant_permission("carol", "special_feature")

# Check permissions
print("Alice permissions:", perm_system.get_user_permissions("alice"))
print("Bob permissions:", perm_system.get_user_permissions("bob"))
print("Carol permissions:", perm_system.get_user_permissions("carol"))

# Check specific actions
print(f"Can Alice delete? {perm_system.can_user_perform('alice', 'delete')}")
print(f"Can Carol write? {perm_system.can_user_perform('carol', 'write')}")

# Find users with specific permission
writers = perm_system.get_users_with_permission("write")
print(f"Users who can write: {writers}")

# Compare users
comparison = perm_system.compare_user_permissions("alice", "bob")
print(f"Alice & Bob comparison: {comparison}")
\`\`\`

### 2. Social Network Analysis:
**Complete Example:**
\`\`\`
class SocialNetwork:
    def __init__(self):
        self.users = {}
    
    def add_user(self, username):
        if username not in self.users:
            self.users[username] = {
                "followers": set(),
                "following": set(),
                "interests": set(),
                "blocked": set()
            }
            return True
        return False
    
    def follow(self, follower, following):
        if follower in self.users and following in self.users and follower != following:
            if following not in self.users[follower]["blocked"]:
                self.users[follower]["following"].add(following)
                self.users[following]["followers"].add(follower)
                return True
        return False
    
    def unfollow(self, follower, following):
        if follower in self.users and following in self.users:
            self.users[follower]["following"].discard(following)
            self.users[following]["followers"].discard(follower)
            return True
        return False
    
    def block_user(self, blocker, blocked):
        if blocker in self.users and blocked in self.users:
            self.users[blocker]["blocked"].add(blocked)
            # Auto-unfollow both ways
            self.unfollow(blocker, blocked)
            self.unfollow(blocked, blocker)
            return True
        return False
    
    def add_interest(self, username, interest):
        if username in self.users:
            self.users[username]["interests"].add(interest)
            return True
        return False
    
    def get_mutual_followers(self, user1, user2):
        if user1 in self.users and user2 in self.users:
            followers1 = self.users[user1]["followers"]
            followers2 = self.users[user2]["followers"]
            return followers1 & followers2  # Intersection
        return set()
    
    def get_mutual_following(self, user1, user2):
        if user1 in self.users and user2 in self.users:
            following1 = self.users[user1]["following"]
            following2 = self.users[user2]["following"]
            return following1 & following2
        return set()
    
    def suggest_friends(self, username):
        if username not in self.users:
            return set()
        
        user = self.users[username]
        suggestions = set()
        
        # Find people followed by people you follow
        for followed in user["following"]:
            if followed in self.users:
                suggestions |= self.users[followed]["following"]
        
        # Remove yourself, people you already follow, and blocked users
        suggestions -= {username}
        suggestions -= user["following"]
        suggestions -= user["blocked"]
        
        return suggestions
    
    def find_users_with_common_interests(self, username, min_common=1):
        if username not in self.users:
            return {}
        
        user_interests = self.users[username]["interests"]
        common_interest_users = {}
        
        for other_user, data in self.users.items():
            if other_user != username:
                common_interests = user_interests & data["interests"]
                if len(common_interests) >= min_common:
                    common_interest_users[other_user] = common_interests
        
        return common_interest_users
    
    def get_network_stats(self, username):
        if username not in self.users:
            return None
        
        user = self.users[username]
        following = user["following"]
        followers = user["followers"]
        
        return {
            "followers_count": len(followers),
            "following_count": len(following),
            "mutual_connections": len(following & followers),
            "interests_count": len(user["interests"]),
            "blocked_count": len(user["blocked"])
        }

# Using the social network
network = SocialNetwork()

# Add users
users = ["alice", "bob", "carol", "david", "eve"]
for user in users:
    network.add_user(user)

# Create connections
connections = [
    ("alice", "bob"), ("alice", "carol"), ("alice", "david"),
    ("bob", "carol"), ("bob", "eve"),
    ("carol", "david"), ("carol", "eve"),
    ("david", "eve")
]

for follower, following in connections:
    network.follow(follower, following)

# Add interests
interests_map = {
    "alice": ["python", "ai", "music"],
    "bob": ["python", "web_dev", "gaming"],
    "carol": ["ai", "data_science", "music"],
    "david": ["web_dev", "photography", "travel"],
    "eve": ["ai", "gaming", "photography"]
}

for user, interests in interests_map.items():
    for interest in interests:
        network.add_interest(user, interest)

# Analyze network
print("Network Analysis:")
print("-" * 30)

for user in users:
    stats = network.get_network_stats(user)
    print(f"{user.title()}: {stats}")

print("\\nMutual Connections:")
print(f"Alice & Bob mutual followers: {network.get_mutual_followers('alice', 'bob')}")
print(f"Alice & Carol mutual following: {network.get_mutual_following('alice', 'carol')}")

print("\\nFriend Suggestions:")
for user in ["alice", "eve"]:
    suggestions = network.suggest_friends(user)
    print(f"{user.title()}: {suggestions}")

print("\\nCommon Interests:")
alice_common = network.find_users_with_common_interests("alice", min_common=1)
for user, common_interests in alice_common.items():
    print(f"Alice & {user}: {common_interests}")
\`\`\`

### 3. Text Analysis & Document Comparison:
**Complete Example:**
\`\`\`
import re
from collections import Counter

class TextAnalyzer:
    def __init__(self):
        self.documents = {}
        self.stop_words = {
            "the", "a", "an", "and", "or", "but", "in", "on", "at", "to",
            "for", "of", "with", "by", "is", "are", "was", "were", "be",
            "been", "being", "have", "has", "had", "do", "does", "did",
            "will", "would", "could", "should", "may", "might", "must"
        }
    
    def add_document(self, doc_id, text):
        # Clean and tokenize text
        words = re.findall(r'\\b\\w+\\b', text.lower())
        word_set = set(words) - self.stop_words
        
        self.documents[doc_id] = {
            "text": text,
            "words": words,
            "unique_words": word_set,
            "word_count": len(words),
            "unique_count": len(word_set)
        }
    
    def get_document_similarity(self, doc1_id, doc2_id):
        if doc1_id not in self.documents or doc2_id not in self.documents:
            return None
        
        words1 = self.documents[doc1_id]["unique_words"]
        words2 = self.documents[doc2_id]["unique_words"]
        
        intersection = words1 & words2
        union = words1 | words2
        
        # Jaccard similarity
        jaccard = len(intersection) / len(union) if union else 0
        
        return {
            "common_words": intersection,
            "unique_to_doc1": words1 - words2,
            "unique_to_doc2": words2 - words1,
            "jaccard_similarity": jaccard,
            "overlap_percentage": len(intersection) / min(len(words1), len(words2)) * 100 if min(len(words1), len(words2)) > 0 else 0
        }
    
    def find_related_documents(self, doc_id, min_similarity=0.1):
        if doc_id not in self.documents:
            return {}
        
        related = {}
        for other_doc_id in self.documents:
            if other_doc_id != doc_id:
                similarity = self.get_document_similarity(doc_id, other_doc_id)
                if similarity and similarity["jaccard_similarity"] >= min_similarity:
                    related[other_doc_id] = similarity["jaccard_similarity"]
        
        return related
    
    def get_vocabulary_stats(self):
        all_words = set()
        all_documents_words = []
        
        for doc_data in self.documents.values():
            all_words |= doc_data["unique_words"]
            all_documents_words.extend(doc_data["words"])
        
        word_frequency = Counter(all_documents_words)
        
        return {
            "total_vocabulary": len(all_words),
            "total_words": len(all_documents_words),
            "most_common_words": word_frequency.most_common(10),
            "rare_words": {word for word, count in word_frequency.items() if count == 1}
        }
    
    def cluster_documents_by_similarity(self, threshold=0.3):
        clusters = []
        unclustered = set(self.documents.keys())
        
        while unclustered:
            # Start new cluster with first unclustered document
            seed = unclustered.pop()
            cluster = {seed}
            
            # Find similar documents
            to_check = [seed]
            while to_check:
                current = to_check.pop()
                for doc_id in list(unclustered):
                    similarity = self.get_document_similarity(current, doc_id)
                    if similarity and similarity["jaccard_similarity"] >= threshold:
                        cluster.add(doc_id)
                        unclustered.remove(doc_id)
                        to_check.append(doc_id)
            
            clusters.append(cluster)
        
        return clusters

# Using the text analyzer
analyzer = TextAnalyzer()

# Add sample documents
documents = {
    "tech1": "Python is a powerful programming language used for web development, data science, and artificial intelligence applications.",
    "tech2": "JavaScript is essential for web development, enabling interactive websites and modern web applications.",
    "tech3": "Machine learning and artificial intelligence are transforming data science and creating intelligent applications.",
    "cooking1": "Italian cuisine features pasta, pizza, and fresh ingredients like tomatoes, basil, and olive oil.",
    "cooking2": "Mediterranean cooking emphasizes fresh vegetables, olive oil, herbs, and healthy ingredients.",
    "travel1": "Paris offers beautiful architecture, world-class museums, and excellent French cuisine for travelers.",
    "travel2": "Tokyo combines traditional culture with modern technology, offering unique experiences for visitors."
}

for doc_id, text in documents.items():
    analyzer.add_document(doc_id, text)

# Analyze document similarities
print("Document Similarity Analysis:")
print("-" * 40)

similarity_pairs = [
    ("tech1", "tech2"),
    ("tech1", "tech3"),
    ("cooking1", "cooking2"),
    ("travel1", "travel2"),
    ("tech1", "cooking1")
]

for doc1, doc2 in similarity_pairs:
    similarity = analyzer.get_document_similarity(doc1, doc2)
    print(f"{doc1} vs {doc2}:")
    print(f"  Similarity: {similarity['jaccard_similarity']:.3f}")
    print(f"  Common words: {list(similarity['common_words'])[:5]}...")  # Show first 5
    print()

# Find related documents
print("Related Documents (similarity > 0.1):")
for doc_id in ["tech1", "cooking1"]:
    related = analyzer.find_related_documents(doc_id, 0.1)
    print(f"{doc_id}: {related}")

# Vocabulary statistics
stats = analyzer.get_vocabulary_stats()
print(f"\\nVocabulary Stats:")
print(f"Total unique words: {stats['total_vocabulary']}")
print(f"Most common words: {stats['most_common_words'][:5]}")

# Document clustering
clusters = analyzer.cluster_documents_by_similarity(0.15)
print(f"\\nDocument Clusters (threshold=0.15):")
for i, cluster in enumerate(clusters, 1):
    print(f"  Cluster {i}: {cluster}")
\`\`\`

## 💡 Set Best Practices

### ✅ Good Practices:
1. **Use sets for uniqueness** - removing duplicates from lists
2. **Use sets for fast membership testing** - O(1) average case
3. **Use set operations** instead of loops for mathematical operations
4. **Consider frozenset** for immutable sets (can be dict keys)

### ❌ Common Mistakes:
1. **Trying to index sets** - sets are unordered
2. **Using sets when order matters** - use lists instead
3. **Putting mutable objects in sets** - only hashable objects allowed
4. **Expecting consistent ordering** - set order is not guaranteed

### Performance Tips:
**Examples:**
\`\`\`
# Fast duplicate removal
large_list = list(range(10000)) * 3  # List with duplicates
unique_items = list(set(large_list))  # Fast deduplication

# Fast membership testing
large_set = set(range(10000))
print(5000 in large_set)  # O(1) average case

# Set operations are faster than loops
set1 = set(range(5000))
set2 = set(range(2500, 7500))

# Fast intersection
common = set1 & set2

# Slower equivalent with loops
common_slow = []
for item in set1:
    if item in set2:
        common_slow.append(item)
\`\`\`

Ready to work with unique collections efficiently? Practice with the challenges below!`,
        relatedChallenges: [
          "Set Operations and Mathematics",
          "Data Deduplication",
        ],
      },
      {
        title: "Tuples: Immutable Sequences & Structured Data",
        slug: "tuples-immutable-sequences",
        content: `# 📦 Tuples: Immutable Sequences & Structured Data

Tuples are ordered, immutable collections perfect for representing structured data that shouldn't change!

## 🎯 Understanding Tuples

### What are Tuples?
Tuples are collections that:
- **Are ordered** (maintain element position)
- **Are immutable** (cannot be changed after creation)
- **Allow duplicates** (same elements can appear multiple times)
- **Can contain mixed data types**
- **Are hashable** (can be used as dictionary keys)

**Examples:**
\`\`\`
# Creating tuples
coordinates = (10, 20)
rgb_color = (255, 128, 0)
person_info = ("Alice", 25, "Engineer", True)

# Single element tuple (note the comma!)
single_element = (42,)
# or
single_element = 42,

# Empty tuple
empty_tuple = ()

# Tuple without parentheses (tuple packing)
point = 3, 4, 5
print(type(point))  # <class 'tuple'>
\`\`\`

### Why Use Tuples?
1. **Data integrity** - values can't be accidentally modified
2. **Performance** - tuples are faster than lists for some operations
3. **Dictionary keys** - tuples can be used as keys (if all elements are hashable)
4. **Multiple return values** - functions can return multiple values as tuples
5. **Structured data** - represent fixed collections like coordinates, RGB values

## 🔧 Tuple Operations

### Accessing Elements:
**Examples:**
\`\`\`
person = ("Alice", 25, "Engineer", "New York")

# Indexing (same as lists)
print(person[0])    # "Alice"
print(person[-1])   # "New York"

# Slicing
print(person[1:3])  # (25, "Engineer")
print(person[:2])   # ("Alice", 25)

# Tuple unpacking
name, age, job, city = person
print(f"{name} is {age} years old")

# Partial unpacking with *
first, *middle, last = (1, 2, 3, 4, 5)
print(f"First: {first}, Middle: {middle}, Last: {last}")
\`\`\`

### Tuple Methods:
**Examples:**
\`\`\`
numbers = (1, 2, 3, 2, 4, 2, 5)

# Count occurrences
count_2 = numbers.count(2)
print(f"Number 2 appears {count_2} times")  # 3 times

# Find index of first occurrence
index_3 = numbers.index(3)
print(f"First occurrence of 3 at index {index_3}")  # index 2

# Length
print(f"Tuple length: {len(numbers)}")

# Check membership
print(4 in numbers)    # True
print(10 in numbers)   # False
\`\`\`

## 🎮 Real-World Examples

### 1. Database Record Management:
**Complete Example:**
\`\`\`
class StudentDatabase:
    def __init__(self):
        # Each student record is a tuple: (id, name, age, grade, gpa)
        self.students = []
        self.next_id = 1
    
    def add_student(self, name, age, grade, gpa):
        student_record = (self.next_id, name, age, grade, gpa)
        self.students.append(student_record)
        self.next_id += 1
        return student_record[0]  # Return the ID
    
    def get_student(self, student_id):
        for student in self.students:
            if student[0] == student_id:
                return student
        return None
    
    def get_students_by_grade(self, grade):
        return [student for student in self.students if student[3] == grade]
    
    def get_honor_students(self, min_gpa=3.5):
        return [student for student in self.students if student[4] >= min_gpa]
    
    def get_student_summary(self, student_id):
        student = self.get_student(student_id)
        if student:
            student_id, name, age, grade, gpa = student  # Tuple unpacking
            return {
                "id": student_id,
                "name": name,
                "age": age,
                "grade": grade,
                "gpa": gpa,
                "status": "Honor Student" if gpa >= 3.5 else "Regular Student"
            }
        return None
    
    def generate_report(self):
        if not self.students:
            return "No students in database"
        
        total_students = len(self.students)
        total_gpa = sum(student[4] for student in self.students)
        avg_gpa = total_gpa / total_students
        
        grade_counts = {}
        for student in self.students:
            grade = student[3]
            grade_counts[grade] = grade_counts.get(grade, 0) + 1
        
        return {
            "total_students": total_students,
            "average_gpa": round(avg_gpa, 2),
            "grade_distribution": grade_counts,
            "honor_students": len(self.get_honor_students())
        }

# Using the student database
db = StudentDatabase()

# Add students
students_data = [
    ("Alice Johnson", 20, "Sophomore", 3.8),
    ("Bob Smith", 19, "Freshman", 3.2),
    ("Carol Davis", 21, "Junior", 3.9),
    ("David Wilson", 22, "Senior", 3.1),
    ("Eve Brown", 20, "Sophomore", 3.6)
]

student_ids = []
for name, age, grade, gpa in students_data:
    student_id = db.add_student(name, age, grade, gpa)
    student_ids.append(student_id)

# Query the database
print("Student Database Report:")
print("-" * 30)

# Get specific student
alice = db.get_student_summary(1)
print(f"Student 1: {alice}")

# Get students by grade
sophomores = db.get_students_by_grade("Sophomore")
print(f"\\nSophomores: {len(sophomores)} students")
for student in sophomores:
    _, name, age, grade, gpa = student
    print(f"  {name}: GPA {gpa}")

# Honor students
honor_students = db.get_honor_students()
print(f"\\nHonor Students:")
for student in honor_students:
    _, name, _, _, gpa = student
    print(f"  {name}: GPA {gpa}")

# Generate report
report = db.generate_report()
print(f"\\nDatabase Summary: {report}")
\`\`\`

### 2. Geographic Coordinate System:
**Complete Example:**
\`\`\`
import math

class GeoPoint:
    def __init__(self, latitude, longitude, elevation=0):
        # Store as tuple for immutability
        self.coordinates = (latitude, longitude, elevation)
    
    @property
    def latitude(self):
        return self.coordinates[0]
    
    @property
    def longitude(self):
        return self.coordinates[1]
    
    @property
    def elevation(self):
        return self.coordinates[2]
    
    def distance_to(self, other_point):
        """Calculate distance using Haversine formula"""
        lat1, lon1, _ = self.coordinates
        lat2, lon2, _ = other_point.coordinates
        
        # Convert to radians
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        
        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.asin(math.sqrt(a))
        
        # Earth's radius in kilometers
        r = 6371
        return c * r
    
    def midpoint_to(self, other_point):
        """Find midpoint between two coordinates"""
        lat1, lon1, elev1 = self.coordinates
        lat2, lon2, elev2 = other_point.coordinates
        
        mid_lat = (lat1 + lat2) / 2
        mid_lon = (lon1 + lon2) / 2
        mid_elev = (elev1 + elev2) / 2
        
        return GeoPoint(mid_lat, mid_lon, mid_elev)
    
    def __str__(self):
        lat, lon, elev = self.coordinates
        return f"({lat:.4f}, {lon:.4f}, {elev}m)"
    
    def __repr__(self):
        return f"GeoPoint{self.coordinates}"

class Route:
    def __init__(self, name):
        self.name = name
        self.waypoints = []  # List of coordinate tuples
    
    def add_waypoint(self, latitude, longitude, elevation=0, name=None):
        waypoint = (latitude, longitude, elevation, name or f"Point {len(self.waypoints) + 1}")
        self.waypoints.append(waypoint)
    
    def get_total_distance(self):
        if len(self.waypoints) < 2:
            return 0
        
        total_distance = 0
        for i in range(len(self.waypoints) - 1):
            point1 = GeoPoint(*self.waypoints[i][:3])  # First 3 elements
            point2 = GeoPoint(*self.waypoints[i + 1][:3])
            total_distance += point1.distance_to(point2)
        
        return total_distance
    
    def get_elevation_profile(self):
        elevations = [waypoint[2] for waypoint in self.waypoints]
        if not elevations:
            return {}
        
        return {
            "min_elevation": min(elevations),
            "max_elevation": max(elevations),
            "elevation_gain": sum(max(0, elevations[i] - elevations[i-1])
                                 for i in range(1, len(elevations))),
            "elevation_loss": sum(max(0, elevations[i-1] - elevations[i])
                                 for i in range(1, len(elevations)))
        }
    
    def get_route_summary(self):
        if not self.waypoints:
            return "Empty route"
        
        start_point = self.waypoints[0]
        end_point = self.waypoints[-1]
        
        return {
            "name": self.name,
            "waypoint_count": len(self.waypoints),
            "start": f"{start_point[3]} {GeoPoint(*start_point[:3])}",
            "end": f"{end_point[3]} {GeoPoint(*end_point[:3])}",
            "total_distance_km": round(self.get_total_distance(), 2),
            "elevation_profile": self.get_elevation_profile()
        }

# Using the geographic system
print("Geographic Coordinate System Demo:")
print("-" * 40)

# Create individual points
seattle = GeoPoint(47.6062, -122.3321, 56)  # Seattle, WA
portland = GeoPoint(45.5152, -122.6784, 15)  # Portland, OR
san_francisco = GeoPoint(37.7749, -122.4194, 16)  # San Francisco, CA

print(f"Seattle: {seattle}")
print(f"Portland: {portland}")
print(f"San Francisco: {san_francisco}")

# Calculate distances
seattle_to_portland = seattle.distance_to(portland)
portland_to_sf = portland.distance_to(san_francisco)

print(f"\\nDistances:")
print(f"Seattle to Portland: {seattle_to_portland:.1f} km")
print(f"Portland to San Francisco: {portland_to_sf:.1f} km")

# Find midpoint
midpoint = seattle.midpoint_to(san_francisco)
print(f"Midpoint between Seattle and SF: {midpoint}")

# Create a route
west_coast_route = Route("West Coast Road Trip")

# Add waypoints with elevation data
route_points = [
    (47.6062, -122.3321, 56, "Seattle"),
    (45.5152, -122.6784, 15, "Portland"),
    (43.8041, -120.5542, 1200, "Bend, OR"),
    (39.7391, -121.8378, 250, "Chico, CA"),
    (37.7749, -122.4194, 16, "San Francisco"),
    (36.7783, -119.4179, 90, "Fresno, CA"),
    (34.0522, -118.2437, 71, "Los Angeles")
]

for lat, lon, elev, name in route_points:
    west_coast_route.add_waypoint(lat, lon, elev, name)

# Analyze the route
route_summary = west_coast_route.get_route_summary()
print(f"\\nRoute Analysis:")
print(f"Route: {route_summary['name']}")
print(f"Waypoints: {route_summary['waypoint_count']}")
print(f"Start: {route_summary['start']}")
print(f"End: {route_summary['end']}")
print(f"Total Distance: {route_summary['total_distance_km']} km")

elevation_profile = route_summary['elevation_profile']
print(f"\\nElevation Profile:")
print(f"  Min: {elevation_profile['min_elevation']}m")
print(f"  Max: {elevation_profile['max_elevation']}m")
print(f"  Gain: {elevation_profile['elevation_gain']}m")
print(f"  Loss: {elevation_profile['elevation_loss']}m")
\`\`\`

### 3. Financial Data Analysis:
**Complete Example:**
\`\`\`
from datetime import datetime, timedelta
import random

class StockPrice:
    def __init__(self):
        # Each price record: (date, symbol, open, high, low, close, volume)
        self.price_data = []
    
    def add_price_record(self, date, symbol, open_price, high, low, close, volume):
        record = (date, symbol, open_price, high, low, close, volume)
        self.price_data.append(record)
    
    def get_price_history(self, symbol, days=30):
        symbol_data = [record for record in self.price_data if record[1] == symbol]
        return sorted(symbol_data, key=lambda x: x[0])[-days:]  # Last N days
    
    def calculate_returns(self, symbol):
        history = self.get_price_history(symbol, 365)  # Last year
        if len(history) < 2:
            return []
        
        returns = []
        for i in range(1, len(history)):
            prev_close = history[i-1][5]  # Previous close price
            curr_close = history[i][5]    # Current close price
            daily_return = (curr_close - prev_close) / prev_close
            returns.append((history[i][0], daily_return))  # (date, return)
        
        return returns
    
    def get_volatility(self, symbol, days=30):
        returns = self.calculate_returns(symbol)
        if not returns:
            return 0
        
        recent_returns = [ret[1] for ret in returns[-days:]]
        if not recent_returns:
            return 0
        
        mean_return = sum(recent_returns) / len(recent_returns)
        variance = sum((ret - mean_return) ** 2 for ret in recent_returns) / len(recent_returns)
        return variance ** 0.5  # Standard deviation
    
    def get_trading_summary(self, symbol):
        history = self.get_price_history(symbol, 252)  # ~1 trading year
        if not history:
            return None
        
        prices = [record[5] for record in history]  # Close prices
        volumes = [record[6] for record in history]  # Volumes
        
        current_price = prices[-1]
        year_high = max(record[3] for record in history)  # Max high
        year_low = min(record[4] for record in history)   # Min low
        
        # Calculate moving averages
        ma_50 = sum(prices[-50:]) / min(50, len(prices))
        ma_200 = sum(prices[-200:]) / min(200, len(prices))
        
        return {
            "symbol": symbol,
            "current_price": current_price,
            "year_high": year_high,
            "year_low": year_low,
            "52_week_range": f"$\{year_low:.2f} - $\{year_high:.2f}",
            "ma_50": ma_50,
            "ma_200": ma_200,
            "avg_volume": sum(volumes) / len(volumes) if volumes else 0,
            "volatility": self.get_volatility(symbol),
            "price_trend": "Bullish" if ma_50 > ma_200 else "Bearish"
        }
    
    def find_correlated_stocks(self, symbol1, symbol2, days=60):
        returns1 = dict(self.calculate_returns(symbol1)[-days:])
        returns2 = dict(self.calculate_returns(symbol2)[-days:])
        
        # Find common dates
        common_dates = set(returns1.keys()) & set(returns2.keys())
        if len(common_dates) < 10:  # Need sufficient data
            return None
        
        # Calculate correlation
        common_returns1 = [returns1[date] for date in common_dates]
        common_returns2 = [returns2[date] for date in common_dates]
        
        n = len(common_returns1)
        sum_xy = sum(x * y for x, y in zip(common_returns1, common_returns2))
        sum_x = sum(common_returns1)
        sum_y = sum(common_returns2)
        sum_x2 = sum(x ** 2 for x in common_returns1)
        sum_y2 = sum(y ** 2 for y in common_returns2)
        
        numerator = n * sum_xy - sum_x * sum_y
        denominator = ((n * sum_x2 - sum_x ** 2) * (n * sum_y2 - sum_y ** 2)) ** 0.5
        
        correlation = numerator / denominator if denominator != 0 else 0
        return correlation

# Generate sample stock data
stock_tracker = StockPrice()

# Sample stocks
symbols = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN"]
base_prices = {"AAPL": 150, "GOOGL": 2500, "MSFT": 300, "TSLA": 800, "AMZN": 3200}

# Generate 100 days of data
start_date = datetime.now() - timedelta(days=100)
for i in range(100):
    current_date = start_date + timedelta(days=i)
    
    for symbol in symbols:
        base_price = base_prices[symbol]
        
        # Simulate price movement
        daily_change = random.uniform(-0.05, 0.05)  # ±5% daily change
        open_price = base_price * (1 + daily_change)
        
        high = open_price * random.uniform(1.0, 1.03)
        low = open_price * random.uniform(0.97, 1.0)
        close = random.uniform(low, high)
        volume = random.randint(1000000, 5000000)
        
        stock_tracker.add_price_record(
            current_date.strftime("%Y-%m-%d"),
            symbol,
            round(open_price, 2),
            round(high, 2),
            round(low, 2),
            round(close, 2),
            volume
        )
        
        # Update base price for next day
        base_prices[symbol] = close

# Analyze the data
print("Stock Market Analysis:")
print("-" * 30)

for symbol in symbols:
    summary = stock_tracker.get_trading_summary(symbol)
    if summary:
        print(f"\\n\\{symbol}:")
        print(f"  Current: $\\{summary['current_price']:.2f}")
        print(f"  52-Week Range: \\{summary['52_week_range']}")
        print(f"  MA 50: $\\{summary['ma_50']:.2f}")
        print(f"  MA 200: $\\{summary['ma_200']:.2f}")
        print(f"  Volatility: \\{summary['volatility']:.4f}")
        print(f"  Trend: \\{summary['price_trend']}")

# Check correlations
print(f"\\nStock Correlations:")
correlation_pairs = [("AAPL", "MSFT"), ("GOOGL", "AMZN"), ("TSLA", "AAPL")]

for stock1, stock2 in correlation_pairs:
    correlation = stock_tracker.find_correlated_stocks(stock1, stock2)
    if correlation is not None:
        print(f"\\{stock1} vs \\{stock2}: \\{correlation:.3f}")
\`\`\`

## 💡 Tuple Best Practices

### ✅ Good Practices:
1. **Use tuples for immutable data** - coordinates, RGB values, database records
2. **Use tuple unpacking** for cleaner code and multiple assignments
3. **Use tuples as dictionary keys** when you need composite keys
4. **Use namedtuples** for more readable code with many elements

### ❌ Common Mistakes:
1. **Trying to modify tuples** - they're immutable!
2. **Forgetting comma for single-element tuples** - \`(5)\` is not a tuple
3. **Using tuples when mutability is needed** - use lists instead
4. **Not considering namedtuples** for complex data structures

### Named Tuples for Better Code:
**Examples:**
\`\`\`
from collections import namedtuple

# Instead of regular tuple
person = ("Alice", 25, "Engineer")
name = person[0]  # Hard to remember what index 0 means

# Use namedtuple
Person = namedtuple("Person", ["name", "age", "job"])
person = Person("Alice", 25, "Engineer")
name = person.name  # Much clearer!

# Named tuples are still tuples
print(isinstance(person, tuple))  # True
print(person[0])  # "Alice" - still supports indexing
\`\`\`

Ready to work with immutable, structured data efficiently? Practice with the challenges below!`,
        relatedChallenges: [
          "Tuple Operations and Unpacking",
          "Immutable Data Structures",
        ],
      },
    ],
  },
  Algorithms: {
    icon: "🧮",
    color: "from-purple-500 to-violet-600",
    gradient: "from-purple-50 to-violet-50",
    description: "Master sorting, searching, and problem-solving algorithms",
    lessons: [
      {
        title: "Understanding Algorithms",
        slug: "understanding-algorithms",
        content: `# 🧮 Understanding Algorithms

An algorithm is a step-by-step procedure for solving a problem. Think of it as a recipe for your computer!

## What Makes a Good Algorithm?

1. **Correctness**: Produces the right answer
2. **Efficiency**: Uses time and memory wisely
3. **Clarity**: Easy to understand and implement
4. **Generality**: Works for different inputs

## Algorithm Example: Finding Maximum

Let's find the largest number in a list:

**Complete Example:**
\`\`\`
def find_maximum(numbers):
    # Step 1: Assume first number is largest
    max_num = numbers[0]
    
    # Step 2: Check each remaining number
    for num in numbers[1:]:
        # Step 3: Update if we find larger number
        if num > max_num:
            max_num = num
    
    # Step 4: Return the maximum
    return max_num

# Test it
nums = [3, 7, 2, 9, 1, 5]
result = find_maximum(nums)
print(f"Maximum: \\{result}")  # Maximum: 9
\`\`\`

## Common Algorithm Types

### 1. Search Algorithms 🔍
Find specific items in data:
- **Linear Search**: Check each item one by one
- **Binary Search**: Divide and conquer (for sorted data)

### 2. Sort Algorithms 📊
Arrange data in order:
- **Bubble Sort**: Compare adjacent elements
- **Quick Sort**: Divide and conquer
- **Merge Sort**: Split, sort, and merge

### 3. Graph Algorithms 🌐
Work with connected data:
- **Breadth-First Search**: Explore level by level
- **Depth-First Search**: Go deep, then backtrack

## Analyzing Algorithm Efficiency

We measure algorithms using **Big O notation**:

- **O(1)**: Constant time (very fast)
- **O(n)**: Linear time (reasonable)
- **O(n²)**: Quadratic time (can be slow)

**Examples:**
\`\`\`
# O(1) - Always takes same time
def get_first_item(lst):
    return lst[0]

# O(n) - Time grows with list size
def find_in_list(lst, target):
    for item in lst:
        if item == target:
            return True
    return False

# O(n²) - Nested loops
def bubble_sort(lst):
    n = len(lst)
    for i in range(n):
        for j in range(0, n - i - 1):
            if lst[j] > lst[j + 1]:
                lst[j], lst[j + 1] = lst[j + 1], lst[j]
\`\`\`

## Problem-Solving Strategy

1. **Understand**: What exactly are we solving?
2. **Plan**: Break down into smaller steps
3. **Implement**: Write the code
4. **Test**: Try different inputs
5. **Optimize**: Make it faster or cleaner

Ready to dive into algorithm implementation? Try the challenges below!`,
        relatedChallenges: ["Advanced Algorithm Challenge"],
      },
      {
        title: "Sorting Algorithms: From Bubble to Quick Sort",
        slug: "sorting-algorithms",
        content: `# 📊 Sorting Algorithms: From Bubble to Quick Sort

Sorting algorithms arrange data in a specific order. They're fundamental to computer science and used everywhere!

## 🎯 Why Learn Sorting Algorithms?

### Real-World Applications:
- **Search engines**: Sort search results by relevance
- **E-commerce**: Sort products by price, rating, popularity
- **Social media**: Sort posts by timestamp
- **Databases**: Index and query optimization
- **Data analysis**: Organize data for processing

## 🔄 Bubble Sort: The Simple Approach

Bubble Sort compares adjacent elements and swaps them if they're in wrong order:

**Complete Implementation:**
\`\`\`
def bubble_sort(arr):
    """
    Bubble Sort Algorithm
    Time Complexity: O(n²)
    Space Complexity: O(1)
    """
    n = len(arr)
    
    for i in range(n):
        # Flag to optimize - stop if no swaps needed
        swapped = False
        
        # Last i elements are already sorted
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                # Swap adjacent elements
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        # If no swapping occurred, array is sorted
        if not swapped:
            break
    
    return arr

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
print("Original array:", numbers)
sorted_numbers = bubble_sort(numbers.copy())
print("Sorted array:", sorted_numbers)
\`\`\`

### 🎮 Interactive Bubble Sort Visualizer:
\`\`\`
def bubble_sort_with_steps(arr):
    """Bubble sort with step-by-step visualization"""
    n = len(arr)
    print(f"Starting with: \\{arr}")
    
    for i in range(n):
        print(f"\\nPass \\{i + 1}:")
        swapped = False
        
        for j in range(0, n - i - 1):
            print(f"  Comparing \\{arr[j]} and \\{arr[j + 1]}")
            
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                print(f"  Swapped! Array: \\{arr}")
                swapped = True
            else:
                print(f"  No swap needed")
        
        if not swapped:
            print("  No swaps in this pass - array is sorted!")
            break
    
    return arr

# Visualize sorting
test_array = [5, 2, 8, 1, 9]
bubble_sort_with_steps(test_array)
\`\`\`

## ⚡ Quick Sort: Divide and Conquer

Quick Sort uses a "divide and conquer" strategy - it's much faster for large datasets:

**Complete Implementation:**
\`\`\`
def quick_sort(arr, low=0, high=None):
    """
    Quick Sort Algorithm
    Time Complexity: O(n log n) average, O(n²) worst case
    Space Complexity: O(log n)
    """
    if high is None:
        high = len(arr) - 1
    
    if low < high:
        # Partition the array and get pivot index
        pivot_index = partition(arr, low, high)
        
        # Recursively sort elements before and after partition
        quick_sort(arr, low, pivot_index - 1)
        quick_sort(arr, pivot_index + 1, high)
    
    return arr

def partition(arr, low, high):
    """Partition function for Quick Sort"""
    # Choose rightmost element as pivot
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
    return i + 1

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
print("Original array:", numbers)
sorted_numbers = quick_sort(numbers.copy())
print("Quick sorted:", sorted_numbers)
\`\`\`

## 🔀 Merge Sort: Stable and Reliable

Merge Sort consistently performs well and maintains relative order of equal elements:

**Complete Implementation:**
\`\`\`
def merge_sort(arr):
    """
    Merge Sort Algorithm
    Time Complexity: O(n log n) always
    Space Complexity: O(n)
    """
    if len(arr) <= 1:
        return arr
    
    # Divide the array into two halves
    mid = len(arr) // 2
    left_half = arr[:mid]
    right_half = arr[mid:]
    
    # Recursively sort both halves
    left_sorted = merge_sort(left_half)
    right_sorted = merge_sort(right_half)
    
    # Merge the sorted halves
    return merge(left_sorted, right_sorted)

def merge(left, right):
    """Merge two sorted arrays"""
    result = []
    i = j = 0
    
    # Compare elements from both arrays
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
    
    return result

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
print("Original array:", numbers)
sorted_numbers = merge_sort(numbers)
print("Merge sorted:", sorted_numbers)
\`\`\`

## 🎮 Real-World Example: Student Grade Sorter

**Complete Application:**
\`\`\`
class StudentGradeSorter:
    def __init__(self):
        self.students = []
    
    def add_student(self, name, grade, subject):
        self.students.append({
            'name': name,
            'grade': grade,
            'subject': subject
        })
    
    def sort_by_grade(self, algorithm='quick', ascending=True):
        """Sort students by grade using specified algorithm"""
        if algorithm == 'bubble':
            return self._bubble_sort_students(ascending)
        elif algorithm == 'quick':
            return self._quick_sort_students(ascending)
        elif algorithm == 'merge':
            return self._merge_sort_students(ascending)
    
    def _bubble_sort_students(self, ascending=True):
        """Sort students using bubble sort"""
        students_copy = self.students.copy()
        n = len(students_copy)
        
        for i in range(n):
            swapped = False
            for j in range(0, n - i - 1):
                condition = (students_copy[j]['grade'] > students_copy[j + 1]['grade']
                           if ascending else
                           students_copy[j]['grade'] < students_copy[j + 1]['grade'])
                
                if condition:
                    students_copy[j], students_copy[j + 1] = students_copy[j + 1], students_copy[j]
                    swapped = True
            
            if not swapped:
                break
        
        return students_copy
    
    def _quick_sort_students(self, ascending=True):
        """Sort students using quick sort"""
        students_copy = self.students.copy()
        
        def quick_sort_helper(arr, low, high):
            if low < high:
                pi = partition_students(arr, low, high, ascending)
                quick_sort_helper(arr, low, pi - 1)
                quick_sort_helper(arr, pi + 1, high)
        
        def partition_students(arr, low, high, ascending):
            pivot = arr[high]['grade']
            i = low - 1
            
            for j in range(low, high):
                condition = (arr[j]['grade'] <= pivot if ascending else arr[j]['grade'] >= pivot)
                if condition:
                    i += 1
                    arr[i], arr[j] = arr[j], arr[i]
            
            arr[i + 1], arr[high] = arr[high], arr[i + 1]
            return i + 1
        
        quick_sort_helper(students_copy, 0, len(students_copy) - 1)
        return students_copy
    
    def _merge_sort_students(self, ascending=True):
        """Sort students using merge sort"""
        def merge_sort_helper(arr):
            if len(arr) <= 1:
                return arr
            
            mid = len(arr) // 2
            left = merge_sort_helper(arr[:mid])
            right = merge_sort_helper(arr[mid:])
            
            return merge_students(left, right, ascending)
        
        def merge_students(left, right, ascending):
            result = []
            i = j = 0
            
            while i < len(left) and j < len(right):
                condition = (left[i]['grade'] <= right[j]['grade'] if ascending
                           else left[i]['grade'] >= right[j]['grade'])
                
                if condition:
                    result.append(left[i])
                    i += 1
                else:
                    result.append(right[j])
                    j += 1
            
            result.extend(left[i:])
            result.extend(right[j:])
            return result
        
        return merge_sort_helper(self.students.copy())
    
    def display_results(self, sorted_students, algorithm_name):
        """Display sorted results"""
        print(f"\\nStudents sorted by \\{algorithm_name.title()}:")
        print("-" * 50)
        for i, student in enumerate(sorted_students, 1):
            print(f"\\{i:2d}. \\{student['name']:15} | \\{student['subject']:10} | Grade: \\{student['grade']}")

# Using the Student Grade Sorter
sorter = StudentGradeSorter()

# Add sample students
students_data = [
    ("Alice Johnson", 92, "Math"),
    ("Bob Smith", 78, "Science"),
    ("Carol Davis", 95, "English"),
    ("David Wilson", 83, "Math"),
    ("Eve Brown", 88, "Science"),
    ("Frank Miller", 91, "English"),
    ("Grace Lee", 76, "Math"),
    ("Henry Chen", 94, "Science")
]

for name, grade, subject in students_data:
    sorter.add_student(name, grade, subject)

print("Original student list:")
for student in sorter.students:
    print(f"\\{student['name']:15} | \\{student['subject']:10} | Grade: \\{student['grade']}")

# Test different sorting algorithms
algorithms = ['bubble', 'quick', 'merge']

for algorithm in algorithms:
    sorted_students = sorter.sort_by_grade(algorithm, ascending=False)  # Highest grades first
    sorter.display_results(sorted_students, algorithm)
\`\`\`

## ⚖️ Algorithm Comparison

### Time Complexity Comparison:

| Algorithm | Best Case | Average Case | Worst Case | Space |
|-----------|-----------|--------------|------------|-------|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) |

### When to Use Each:

**Bubble Sort:**
- ✅ Educational purposes
- ✅ Very small datasets (< 50 items)
- ✅ Nearly sorted data
- ❌ Large datasets

**Quick Sort:**
- ✅ General purpose sorting
- ✅ Large datasets
- ✅ Memory is limited
- ❌ Worst-case performance critical

**Merge Sort:**
- ✅ Stable sorting required
- ✅ Consistent performance needed
- ✅ External sorting (large files)
- ❌ Memory is very limited

## 🎯 Performance Testing

**Benchmark Different Algorithms:**
\`\`\`
import time
import random

def benchmark_sorting_algorithms(size=1000):
    """Compare performance of different sorting algorithms"""
    
    # Generate random data
    original_data = [random.randint(1, 1000) for _ in range(size)]
    
    algorithms = {
        'Bubble Sort': bubble_sort,
        'Quick Sort': lambda arr: quick_sort(arr.copy()),
        'Merge Sort': merge_sort,
        'Python Built-in': sorted
    }
    
    results = {}
    
    for name, algorithm in algorithms.items():
        data_copy = original_data.copy()
        
        start_time = time.time()
        algorithm(data_copy)
        end_time = time.time()
        
        results[name] = end_time - start_time
    
    # Display results
    print(f"\\nSorting \\{size} elements - Performance Results:")
    print("-" * 50)
    
    for name, duration in sorted(results.items(), key=lambda x: x[1]):
        print(f"\\{name:15}: \\{duration:.6f} seconds")

# Run benchmark
benchmark_sorting_algorithms(1000)
benchmark_sorting_algorithms(5000)
\`\`\`

## 💡 Best Practices

### ✅ Good Practices:
1. **Choose the right algorithm** for your data size and requirements
2. **Consider stability** if relative order of equal elements matters
3. **Use built-in sort()** for production code (it's optimized)
4. **Understand trade-offs** between time and space complexity

### ❌ Common Mistakes:
1. **Using bubble sort** for large datasets
2. **Not considering worst-case** scenarios
3. **Ignoring memory constraints**
4. **Reinventing the wheel** when built-in solutions exist

Ready to master sorting algorithms? Practice with the challenges below!`,
        relatedChallenges: [
          "Sorting Algorithm Implementation",
          "Algorithm Performance Analysis",
        ],
      },
      {
        title: "Searching Algorithms: Linear to Binary Search",
        slug: "searching-algorithms",
        content: `# 🔍 Searching Algorithms: Linear to Binary Search

Searching algorithms help us find specific items in collections of data efficiently!

## 🎯 Why Searching Matters

### Real-World Applications:
- **Search engines**: Finding relevant web pages
- **Databases**: Locating records quickly
- **File systems**: Finding files and folders
- **Contact lists**: Finding phone numbers
- **Game development**: Finding players, items, locations

## 📝 Linear Search: The Straightforward Approach

Linear search checks each element one by one until it finds the target:

**Complete Implementation:**
\`\`\`
def linear_search(arr, target):
    """
    Linear Search Algorithm
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    for i in range(len(arr)):
        if arr[i] == target:
            return i  # Return index of found element
    return -1  # Element not found

def linear_search_with_details(arr, target):
    """Linear search with step-by-step details"""
    print(f"Searching for \\{target} in \\{arr}")
    
    for i in range(len(arr)):
        print(f"Step \\{i + 1}: Checking arr[\\{i}] = \\{arr[i]}")
        
        if arr[i] == target:
            print(f"Found \\{target} at index \\{i}!")
            return i
    
    print(f"\\{target} not found in the array")
    return -1

# Example usage
numbers = [64, 34, 25, 12, 22, 11, 90]
result = linear_search_with_details(numbers, 22)
print(f"Result: \\{result}")
\`\`\`

### 🎮 Enhanced Linear Search Variants:

**Search with Multiple Criteria:**
\`\`\`
def linear_search_multiple(arr, condition_func):
    """Search using a custom condition function"""
    results = []
    
    for i, item in enumerate(arr):
        if condition_func(item):
            results.append((i, item))
    
    return results

# Example: Find all even numbers
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_numbers = linear_search_multiple(numbers, lambda x: x % 2 == 0)
print(f"Even numbers found: \\{even_numbers}")

# Example: Find students with high grades
students = [
    {'name': 'Alice', 'grade': 92},
    {'name': 'Bob', 'grade': 78},
    {'name': 'Carol', 'grade': 95},
    {'name': 'David', 'grade': 83}
]

high_achievers = linear_search_multiple(
    students,
    lambda student: student['grade'] >= 90
)
print(f"High achievers: \\{high_achievers}")
\`\`\`

## ⚡ Binary Search: The Efficient Approach

Binary search works on sorted arrays by repeatedly dividing the search space in half:

**Complete Implementation:**
\`\`\`
def binary_search(arr, target):
    """
    Binary Search Algorithm (Iterative)
    Time Complexity: O(log n)
    Space Complexity: O(1)
    Prerequisite: Array must be sorted
    """
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1  # Search right half
        else:
            right = mid - 1  # Search left half
    
    return -1  # Element not found

def binary_search_recursive(arr, target, left=0, right=None):
    """
    Binary Search Algorithm (Recursive)
    Time Complexity: O(log n)
    Space Complexity: O(log n)
    """
    if right is None:
        right = len(arr) - 1
    
    if left > right:
        return -1  # Base case: element not found
    
    mid = (left + right) // 2
    
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, right)
    else:
        return binary_search_recursive(arr, target, left, mid - 1)

# Example usage
sorted_numbers = [11, 12, 22, 25, 34, 64, 90]
print(f"Array: \\{sorted_numbers}")

target = 25
result = binary_search(sorted_numbers, target)
print(f"Binary search for \\{target}: index \\{result}")
\`\`\`

### 🔍 Binary Search with Visualization:

\`\`\`
def binary_search_visual(arr, target):
    """Binary search with step-by-step visualization"""
    print(f"Searching for \\{target} in sorted array: \\{arr}")
    print()
    
    left = 0
    right = len(arr) - 1
    step = 1
    
    while left <= right:
        mid = (left + right) // 2
        
        print(f"Step \\{step}:")
        print(f"  Left: \\{left}, Right: \\{right}, Mid: \\{mid}")
        print(f"  Checking arr[\\{mid}] = \\{arr[mid]}")
        
        if arr[mid] == target:
            print(f"  Found \\{target} at index \\{mid}!")
            return mid
        elif arr[mid] < target:
            print(f"  \\{arr[mid]} < \\{target}, search right half")
            left = mid + 1
        else:
            print(f"  \\{arr[mid]} > \\{target}, search left half")
            right = mid - 1
        
        print()
        step += 1
    
    print(f"\\{target} not found in the array")
    return -1

# Visualize binary search
sorted_array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
binary_search_visual(sorted_array, 7)
\`\`\`

## 🎮 Real-World Application: Phone Book Search

**Complete Phone Book Implementation:**
\`\`\`
class PhoneBook:
    def __init__(self):
        self.contacts = []
        self.is_sorted = True
    
    def add_contact(self, name, phone, email=""):
        """Add a new contact"""
        contact = {
            'name': name.lower(),
            'display_name': name,
            'phone': phone,
            'email': email
        }
        self.contacts.append(contact)
        self.is_sorted = False
    
    def sort_contacts(self):
        """Sort contacts by name for binary search"""
        self.contacts.sort(key=lambda x: x['name'])
        self.is_sorted = True
    
    def linear_search_contact(self, name):
        """Search contact using linear search"""
        name_lower = name.lower()
        comparisons = 0
        
        for i, contact in enumerate(self.contacts):
            comparisons += 1
            if contact['name'] == name_lower:
                return contact, i, comparisons
        
        return None, -1, comparisons
    
    def binary_search_contact(self, name):
        """Search contact using binary search"""
        if not self.is_sorted:
            self.sort_contacts()
        
        name_lower = name.lower()
        left = 0
        right = len(self.contacts) - 1
        comparisons = 0
        
        while left <= right:
            comparisons += 1
            mid = (left + right) // 2
            
            if self.contacts[mid]['name'] == name_lower:
                return self.contacts[mid], mid, comparisons
            elif self.contacts[mid]['name'] < name_lower:
                left = mid + 1
            else:
                right = mid - 1
        
        return None, -1, comparisons
    
    def search_by_phone(self, phone):
        """Search contact by phone number"""
        for i, contact in enumerate(self.contacts):
            if contact['phone'] == phone:
                return contact, i
        return None, -1
    
    def fuzzy_search(self, partial_name):
        """Find contacts with names containing the partial string"""
        partial_lower = partial_name.lower()
        matches = []
        
        for i, contact in enumerate(self.contacts):
            if partial_lower in contact['name']:
                matches.append((contact, i))
        
        return matches
    
    def display_contact(self, contact):
        """Display contact information"""
        if contact:
            print(f"Name: \\{contact['display_name']}")
            print(f"Phone: \\{contact['phone']}")
            print(f"Email: \\{contact['email']}")
        else:
            print("Contact not found")
    
    def benchmark_search_methods(self, search_name):
        """Compare linear vs binary search performance"""
        print(f"Searching for '\\{search_name}':")
        print("-" * 40)
        
        # Linear search
        contact_linear, index_linear, comparisons_linear = self.linear_search_contact(search_name)
        print(f"Linear Search:")
        print(f"  Found: \\{'Yes' if contact_linear else 'No'}")
        print(f"  Comparisons: \\{comparisons_linear}")
        
        # Binary search
        contact_binary, index_binary, comparisons_binary = self.binary_search_contact(search_name)
        print(f"Binary Search:")
        print(f"  Found: \\{'Yes' if contact_binary else 'No'}")
        print(f"  Comparisons: \\{comparisons_binary}")
        
        if comparisons_linear > 0:
            improvement = (comparisons_linear - comparisons_binary) / comparisons_linear * 100
            print(f"  Improvement: \\{improvement:.1f}% fewer comparisons")

# Using the PhoneBook
phone_book = PhoneBook()

# Add sample contacts
contacts_data = [
    ("Alice Johnson", "555-0123", "alice@email.com"),
    ("Bob Smith", "555-0456", "bob@email.com"),
    ("Carol Davis", "555-0789", "carol@email.com"),
    ("David Wilson", "555-0012", "david@email.com"),
    ("Eve Brown", "555-0345", "eve@email.com"),
    ("Frank Miller", "555-0678", "frank@email.com"),
    ("Grace Lee", "555-0901", "grace@email.com"),
    ("Henry Chen", "555-0234", "henry@email.com"),
    ("Ivy Rodriguez", "555-0567", "ivy@email.com"),
    ("Jack Thompson", "555-0890", "jack@email.com")
]

for name, phone, email in contacts_data:
    phone_book.add_contact(name, phone, email)

print(f"Phone book loaded with \\{len(phone_book.contacts)} contacts")
print()

# Test different search methods
phone_book.benchmark_search_methods("Grace Lee")
print()

# Test fuzzy search
fuzzy_results = phone_book.fuzzy_search("john")
print(f"Fuzzy search for 'john':")
for contact, index in fuzzy_results:
    print(f"  Found: \\{contact['display_name']} at index \\{index}")
print()

# Test phone search
contact, index = phone_book.search_by_phone("555-0789")
print("Search by phone '555-0789':")
phone_book.display_contact(contact)
\`\`\`

## 🧮 Advanced Search Algorithms

### Jump Search:
\`\`\`
import math

def jump_search(arr, target):
    """
    Jump Search Algorithm
    Time Complexity: O(√n)
    Space Complexity: O(1)
    Prerequisite: Array must be sorted
    """
    n = len(arr)
    step = int(math.sqrt(n))
    prev = 0
    
    # Find block where element may be present
    while arr[min(step, n) - 1] < target:
        prev = step
        step += int(math.sqrt(n))
        if prev >= n:
            return -1
    
    # Linear search in identified block
    while arr[prev] < target:
        prev += 1
        if prev == min(step, n):
            return -1
    
    if arr[prev] == target:
        return prev
    
    return -1

# Example usage
sorted_array = list(range(0, 100, 2))  # [0, 2, 4, 6, ..., 98]
result = jump_search(sorted_array, 42)
print(f"Jump search for 42: index \\{result}")
\`\`\`

### Interpolation Search:
\`\`\`
def interpolation_search(arr, target):
    """
    Interpolation Search Algorithm
    Time Complexity: O(log log n) for uniformly distributed data
    Space Complexity: O(1)
    Prerequisite: Array must be sorted and uniformly distributed
    """
    low = 0
    high = len(arr) - 1
    
    while low <= high and target >= arr[low] and target <= arr[high]:
        # If there's only one element
        if low == high:
            if arr[low] == target:
                return low
            return -1
        
        # Calculate position using interpolation formula
        pos = low + int(((target - arr[low]) / (arr[high] - arr[low])) * (high - low))
        
        if arr[pos] == target:
            return pos
        elif arr[pos] < target:
            low = pos + 1
        else:
            high = pos - 1
    
    return -1

# Example usage - works best with uniformly distributed data
uniform_array = list(range(10, 100, 5))  # [10, 15, 20, 25, ...]
result = interpolation_search(uniform_array, 45)
print(f"Interpolation search for 45: index \\{result}")
\`\`\`

## ⚖️ Search Algorithm Comparison

### Performance Comparison:

| Algorithm | Time Complexity | Space | Prerequisite | Best For |
|-----------|----------------|--------|--------------|----------|
| Linear Search | O(n) | O(1) | None | Small/unsorted data |
| Binary Search | O(log n) | O(1) | Sorted array | General sorted data |
| Jump Search | O(√n) | O(1) | Sorted array | Large sorted arrays |
| Interpolation | O(log log n) | O(1) | Sorted + uniform | Uniform distribution |

### When to Use Each:

**Linear Search:**
- ✅ Unsorted data
- ✅ Small datasets
- ✅ Simple implementation needed
- ❌ Large datasets

**Binary Search:**
- ✅ Sorted data available
- ✅ Frequent searches
- ✅ Large datasets
- ✅ Optimal for most cases

**Jump Search:**
- ✅ Very large sorted arrays
- ✅ When binary search is still too slow
- ❌ Small datasets

**Interpolation Search:**
- ✅ Uniformly distributed sorted data
- ✅ Extremely large datasets
- ❌ Non-uniform data

## 💡 Search Optimization Tips

### ✅ Best Practices:
1. **Sort data first** if you'll search multiple times
2. **Use binary search** for sorted data
3. **Consider indexing** for frequent searches
4. **Cache search results** for repeated queries

### ❌ Common Mistakes:
1. **Using linear search** on large sorted datasets
2. **Not validating** that array is sorted for binary search
3. **Forgetting edge cases** (empty arrays, single elements)
4. **Not considering** data distribution for algorithm choice

Ready to master searching algorithms? Practice with the challenges below!`,
        relatedChallenges: [
          "Search Algorithm Implementation",
          "Binary Search Variations",
        ],
      },
      {
        title: "Graph Algorithms: BFS, DFS & Path Finding",
        slug: "graph-algorithms",
        content: `# 🌐 Graph Algorithms: BFS, DFS & Path Finding

Graph algorithms solve problems involving networks, relationships, and connections between data!

## 🎯 Understanding Graphs

### What are Graphs?
Graphs are data structures consisting of:
- **Vertices (Nodes)**: Individual entities
- **Edges**: Connections between vertices
- **Directed/Undirected**: Whether connections have direction
- **Weighted/Unweighted**: Whether connections have costs

### Real-World Applications:
- **Social networks**: Friend connections, followers
- **Maps & GPS**: Roads, routes, navigation
- **Internet**: Web pages, links between sites
- **Games**: Game states, possible moves
- **Computer networks**: Routers, connections

## 📊 Graph Representation

### Adjacency List Implementation:
\`\`\`
class Graph:
    """Graph implementation using adjacency list"""
    
    def __init__(self, directed=False):
        self.graph = {}
        self.directed = directed
    
    def add_vertex(self, vertex):
        """Add a vertex to the graph"""
        if vertex not in self.graph:
            self.graph[vertex] = []
    
    def add_edge(self, vertex1, vertex2, weight=1):
        """Add an edge between two vertices"""
        # Add vertices if they don't exist
        self.add_vertex(vertex1)
        self.add_vertex(vertex2)
        
        # Add edge
        self.graph[vertex1].append((vertex2, weight))
        
        # For undirected graphs, add reverse edge
        if not self.directed:
            self.graph[vertex2].append((vertex1, weight))
    
    def get_neighbors(self, vertex):
        """Get all neighbors of a vertex"""
        return self.graph.get(vertex, [])
    
    def get_vertices(self):
        """Get all vertices in the graph"""
        return list(self.graph.keys())
    
    def display(self):
        """Display the graph"""
        for vertex in self.graph:
            neighbors = [f"\\{neighbor}(\\{weight})" for neighbor, weight in self.graph[vertex]]
            print(f"\\{vertex}: \\{' -> '.join(neighbors) if neighbors else 'No connections'}")

# Example: Create a simple graph
g = Graph()
g.add_edge("A", "B")
g.add_edge("A", "C")
g.add_edge("B", "D")
g.add_edge("C", "D")
g.add_edge("D", "E")

print("Graph structure:")
g.display()
\`\`\`

## 🔍 Breadth-First Search (BFS)

BFS explores the graph level by level, visiting all neighbors before going deeper:

**Complete BFS Implementation:**
\`\`\`
from collections import deque

def bfs(graph, start_vertex):
    """
    Breadth-First Search Algorithm
    Time Complexity: O(V + E)
    Space Complexity: O(V)
    """
    visited = set()
    queue = deque([start_vertex])
    result = []
    
    while queue:
        vertex = queue.popleft()
        
        if vertex not in visited:
            visited.add(vertex)
            result.append(vertex)
            
            # Add all unvisited neighbors to queue
            for neighbor, _ in graph.get_neighbors(vertex):
                if neighbor not in visited:
                    queue.append(neighbor)
    
    return result

def bfs_with_levels(graph, start_vertex):
    """BFS with level tracking"""
    visited = set()
    queue = deque([(start_vertex, 0)])  # (vertex, level)
    levels = {}
    
    while queue:
        vertex, level = queue.popleft()
        
        if vertex not in visited:
            visited.add(vertex)
            levels[vertex] = level
            
            # Add neighbors with increased level
            for neighbor, _ in graph.get_neighbors(vertex):
                if neighbor not in visited:
                    queue.append((neighbor, level + 1))
    
    return levels

def bfs_shortest_path(graph, start, end):
    """Find shortest path using BFS"""
    if start == end:
        return [start]
    
    visited = set()
    queue = deque([(start, [start])])
    
    while queue:
        vertex, path = queue.popleft()
        
        if vertex not in visited:
            visited.add(vertex)
            
            for neighbor, _ in graph.get_neighbors(vertex):
                if neighbor == end:
                    return path + [neighbor]
                
                if neighbor not in visited:
                    queue.append((neighbor, path + [neighbor]))
    
    return None  # No path found

# Example usage
print("\\nBFS traversal from A:", bfs(g, "A"))
print("BFS levels from A:", bfs_with_levels(g, "A"))
print("Shortest path A to E:", bfs_shortest_path(g, "A", "E"))
\`\`\`

## 🏃‍♂️ Depth-First Search (DFS)

DFS explores as far as possible along each branch before backtracking:

**Complete DFS Implementation:**
\`\`\`
def dfs_recursive(graph, start_vertex, visited=None):
    """
    Depth-First Search (Recursive)
    Time Complexity: O(V + E)
    Space Complexity: O(V)
    """
    if visited is None:
        visited = set()
    
    result = []
    
    if start_vertex not in visited:
        visited.add(start_vertex)
        result.append(start_vertex)
        
        # Recursively visit all neighbors
        for neighbor, _ in graph.get_neighbors(start_vertex):
            result.extend(dfs_recursive(graph, neighbor, visited))
    
    return result

def dfs_iterative(graph, start_vertex):
    """Depth-First Search (Iterative)"""
    visited = set()
    stack = [start_vertex]
    result = []
    
    while stack:
        vertex = stack.pop()
        
        if vertex not in visited:
            visited.add(vertex)
            result.append(vertex)
            
            # Add neighbors to stack (in reverse order for consistent ordering)
            neighbors = [neighbor for neighbor, _ in graph.get_neighbors(vertex)]
            for neighbor in reversed(neighbors):
                if neighbor not in visited:
                    stack.append(neighbor)
    
    return result

def dfs_path_finding(graph, start, end, path=None, visited=None):
    """Find a path using DFS"""
    if path is None:
        path = []
    if visited is None:
        visited = set()
    
    path = path + [start]
    
    if start == end:
        return path
    
    if start in visited:
        return None
    
    visited.add(start)
    
    for neighbor, _ in graph.get_neighbors(start):
        if neighbor not in visited:
            new_path = dfs_path_finding(graph, neighbor, end, path, visited.copy())
            if new_path:
                return new_path
    
    return None

def dfs_all_paths(graph, start, end, path=None, all_paths=None):
    """Find all paths using DFS"""
    if path is None:
        path = []
    if all_paths is None:
        all_paths = []
    
    path = path + [start]
    
    if start == end:
        all_paths.append(path)
        return all_paths
    
    for neighbor, _ in graph.get_neighbors(start):
        if neighbor not in path:  # Avoid cycles
            dfs_all_paths(graph, neighbor, end, path, all_paths)
    
    return all_paths

# Example usage
print("\\nDFS traversal (recursive) from A:", dfs_recursive(g, "A"))
print("DFS traversal (iterative) from A:", dfs_iterative(g, "A"))
print("DFS path A to E:", dfs_path_finding(g, "A", "E"))
print("All DFS paths A to E:", dfs_all_paths(g, "A", "E"))
\`\`\`

## 🎮 Real-World Application: Social Network Analysis

**Complete Social Network Implementation:**
\`\`\`
class SocialNetwork:
    def __init__(self):
        self.network = Graph(directed=False)
        self.user_data = {}
    
    def add_user(self, username, name, interests=None):
        """Add a user to the social network"""
        self.network.add_vertex(username)
        self.user_data[username] = {
            'name': name,
            'interests': interests or [],
            'friends_count': 0
        }
    
    def add_friendship(self, user1, user2):
        """Add friendship between two users"""
        self.network.add_edge(user1, user2)
        self.user_data[user1]['friends_count'] += 1
        self.user_data[user2]['friends_count'] += 1
    
    def find_mutual_friends(self, user1, user2):
        """Find mutual friends using graph traversal"""
        friends1 = set(neighbor for neighbor, _ in self.network.get_neighbors(user1))
        friends2 = set(neighbor for neighbor, _ in self.network.get_neighbors(user2))
        return friends1.intersection(friends2)
    
    def suggest_friends(self, username, max_suggestions=5):
        """Suggest friends using BFS (friends of friends)"""
        if username not in self.network.graph:
            return []
        
        visited = set([username])
        friends = set(neighbor for neighbor, _ in self.network.get_neighbors(username))
        visited.update(friends)
        
        suggestions = {}
        
        # Look at friends of friends
        for friend in friends:
            for friend_of_friend, _ in self.network.get_neighbors(friend):
                if friend_of_friend not in visited:
                    if friend_of_friend not in suggestions:
                        suggestions[friend_of_friend] = 0
                    suggestions[friend_of_friend] += 1
        
        # Sort by number of mutual connections
        sorted_suggestions = sorted(suggestions.items(), key=lambda x: x[1], reverse=True)
        return [user for user, score in sorted_suggestions[:max_suggestions]]
    
    def find_shortest_connection(self, user1, user2):
        """Find shortest path between two users"""
        return bfs_shortest_path(self.network, user1, user2)
    
    def find_influencers(self, min_connections=3):
        """Find users with many connections using DFS"""
        influencers = []
        
        for username in self.network.get_vertices():
            if self.user_data[username]['friends_count'] >= min_connections:
                # Calculate reach using BFS
                reach = len(bfs(self.network, username)) - 1  # Exclude self
                influencers.append((username, self.user_data[username]['friends_count'], reach))
        
        return sorted(influencers, key=lambda x: x[2], reverse=True)
    
    def analyze_user_clusters(self):
        """Find connected components using DFS"""
        visited_global = set()
        clusters = []
        
        for vertex in self.network.get_vertices():
            if vertex not in visited_global:
                # Find all connected users using DFS
                cluster = dfs_recursive(self.network, vertex, set())
                clusters.append(cluster)
                visited_global.update(cluster)
        
        return clusters
    
    def get_network_stats(self):
        """Get overall network statistics"""
        total_users = len(self.user_data)
        total_connections = sum(self.user_data[user]['friends_count'] for user in self.user_data) // 2
        avg_connections = total_connections * 2 / total_users if total_users > 0 else 0
        
        clusters = self.analyze_user_clusters()
        largest_cluster = max(len(cluster) for cluster in clusters) if clusters else 0
        
        return {
            'total_users': total_users,
            'total_connections': total_connections,
            'avg_connections': round(avg_connections, 2),
            'clusters': len(clusters),
            'largest_cluster_size': largest_cluster
        }

# Using the Social Network
social_net = SocialNetwork()

# Add users
users_data = [
    ("alice", "Alice Johnson", ["coding", "music", "travel"]),
    ("bob", "Bob Smith", ["sports", "coding", "gaming"]),
    ("carol", "Carol Davis", ["art", "music", "photography"]),
    ("david", "David Wilson", ["cooking", "travel", "books"]),
    ("eve", "Eve Brown", ["gaming", "art", "coding"]),
    ("frank", "Frank Miller", ["sports", "books", "music"]),
    ("grace", "Grace Lee", ["photography", "travel", "cooking"]),
    ("henry", "Henry Chen", ["coding", "gaming", "sports"])
]

for username, name, interests in users_data:
    social_net.add_user(username, name, interests)

# Add friendships
friendships = [
    ("alice", "bob"), ("alice", "carol"), ("alice", "david"),
    ("bob", "eve"), ("bob", "frank"),
    ("carol", "grace"), ("carol", "david"),
    ("david", "grace"), ("david", "henry"),
    ("eve", "henry"), ("frank", "henry")
]

for user1, user2 in friendships:
    social_net.add_friendship(user1, user2)

# Analyze the network
print("Social Network Analysis:")
print("-" * 40)

# Network stats
stats = social_net.get_network_stats()
print(f"Network Statistics:")
for key, value in stats.items():
    print(f"  \\{key.replace('_', ' ').title()}: \\{value}")
print()

# Find mutual friends
mutual = social_net.find_mutual_friends("alice", "grace")
print(f"Mutual friends between Alice and Grace: \\{list(mutual)}")

# Friend suggestions
suggestions = social_net.suggest_friends("alice")
print(f"Friend suggestions for Alice: \\{suggestions}")

# Shortest connection
path = social_net.find_shortest_connection("alice", "henry")
print(f"Shortest path from Alice to Henry: \\{' -> '.join(path) if path else 'No connection'}")

# Find influencers
influencers = social_net.find_influencers(2)
print(f"\\nInfluencers (min 2 connections):")
for username, connections, reach in influencers:
    name = social_net.user_data[username]['name']
    print(f"  \\{name} (\\{username}): \\{connections} friends, reach: \\{reach}")

# Analyze clusters
clusters = social_net.analyze_user_clusters()
print(f"\\nNetwork Clusters:")
for i, cluster in enumerate(clusters, 1):
    cluster_names = [social_net.user_data[user]['name'] for user in cluster]
    print(f"  Cluster \\{i}: \\{', '.join(cluster_names)}")
\`\`\`

## 🗺️ Path Finding with Weights: Dijkstra's Algorithm

**Complete Dijkstra Implementation:**
\`\`\`
import heapq

def dijkstra(graph, start_vertex):
    """
    Dijkstra's Shortest Path Algorithm
    Time Complexity: O((V + E) log V)
    Space Complexity: O(V)
    """
    # Initialize distances and previous vertices
    distances = {vertex: float('infinity') for vertex in graph.get_vertices()}
    distances[start_vertex] = 0
    previous = {}
    
    # Priority queue: (distance, vertex)
    pq = [(0, start_vertex)]
    visited = set()
    
    while pq:
        current_distance, current_vertex = heapq.heappop(pq)
        
        if current_vertex in visited:
            continue
        
        visited.add(current_vertex)
        
        # Check neighbors
        for neighbor, weight in graph.get_neighbors(current_vertex):
            distance = current_distance + weight
            
            # If we found a shorter path
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                previous[neighbor] = current_vertex
                heapq.heappush(pq, (distance, neighbor))
    
    return distances, previous

def reconstruct_path(previous, start, end):
    """Reconstruct shortest path from Dijkstra's result"""
    path = []
    current = end
    
    while current is not None:
        path.append(current)
        current = previous.get(current)
    
    path.reverse()
    
    # Check if path is valid
    if path[0] == start:
        return path
    else:
        return None

# Example: Weighted graph for GPS navigation
road_network = Graph(directed=False)

# Add roads with distances (weights)
road_network.add_edge("Home", "Store", 2)
road_network.add_edge("Home", "School", 5)
road_network.add_edge("Store", "Park", 3)
road_network.add_edge("Store", "Hospital", 4)
road_network.add_edge("School", "Park", 1)
road_network.add_edge("Park", "Hospital", 2)
road_network.add_edge("Hospital", "Work", 3)

# Find shortest paths from Home
distances, previous = dijkstra(road_network, "Home")

print("\\nShortest distances from Home:")
for destination, distance in distances.items():
    if destination != "Home":
        path = reconstruct_path(previous, "Home", destination)
        path_str = " -> ".join(path) if path else "No path"
        print(f"  To \\{destination}: \\{distance}km via \\{path_str}")
\`\`\`

## ⚖️ Algorithm Comparison

### When to Use Each Algorithm:

**BFS:**
- ✅ Find shortest path (unweighted)
- ✅ Level-order traversal
- ✅ Find connected components
- ✅ Minimum spanning tree

**DFS:**
- ✅ Find any path
- ✅ Cycle detection
- ✅ Topological sorting
- ✅ Strongly connected components

**Dijkstra:**
- ✅ Shortest path (weighted graphs)
- ✅ Non-negative weights only
- ✅ Single-source shortest paths
- ❌ Negative weights

### Performance Comparison:

| Algorithm | Time Complexity | Space | Use Case |
|-----------|----------------|-------|----------|
| BFS | O(V + E) | O(V) | Unweighted shortest path |
| DFS | O(V + E) | O(V) | Path finding, cycles |
| Dijkstra | O((V + E) log V) | O(V) | Weighted shortest path |

## 💡 Graph Algorithm Tips

### ✅ Best Practices:
1. **Choose the right algorithm** for your specific problem
2. **Consider graph density** when selecting data structures
3. **Handle disconnected graphs** properly
4. **Use appropriate data structures** (adjacency list vs matrix)

### ❌ Common Mistakes:
1. **Using DFS for shortest paths** in unweighted graphs
2. **Not checking for cycles** in DFS
3. **Forgetting to handle** disconnected components
4. **Using wrong algorithm** for weighted vs unweighted graphs

Ready to master graph algorithms? Practice with the challenges below!`,
        relatedChallenges: [
          "Graph Traversal Algorithms",
          "Shortest Path Problems",
        ],
      },
      {
        title: "Dynamic Programming: Optimization & Memoization",
        slug: "dynamic-programming",
        content: `# 🧠 Dynamic Programming: Optimization & Memoization

Dynamic Programming (DP) solves complex problems by breaking them into simpler subproblems and storing results to avoid redundant calculations!

## 🎯 Understanding Dynamic Programming

### Key Concepts:
- **Optimal Substructure**: Problems can be broken into smaller optimal subproblems
- **Overlapping Subproblems**: Same subproblems are solved multiple times
- **Memoization**: Store results of expensive function calls
- **Tabulation**: Build solutions bottom-up using tables

### When to Use DP:
- **Optimization problems**: Finding minimum/maximum values
- **Counting problems**: Number of ways to do something
- **Decision problems**: Yes/No questions with optimal choices

## 🔢 Classic Example: Fibonacci Sequence

Let's see how DP transforms an inefficient recursive solution:

### Naive Recursive Approach:
\`\`\`
def fibonacci_naive(n):
    """
    Naive recursive Fibonacci
    Time Complexity: O(2^n) - Exponential!
    Space Complexity: O(n)
    """
    if n <= 1:
        return n
    return fibonacci_naive(n - 1) + fibonacci_naive(n - 2)

# This becomes extremely slow for large n
print("Naive Fibonacci:")
for i in range(10):
    print(f"F(\\{i}) = \\{fibonacci_naive(i)}")
\`\`\`

### DP with Memoization (Top-Down):
\`\`\`
def fibonacci_memo(n, memo=None):
    """
    Fibonacci with memoization
    Time Complexity: O(n)
    Space Complexity: O(n)
    """
    if memo is None:
        memo = {}
    
    if n in memo:
        return memo[n]
    
    if n <= 1:
        return n
    
    memo[n] = fibonacci_memo(n - 1, memo) + fibonacci_memo(n - 2, memo)
    return memo[n]

# Using decorator for cleaner memoization
from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci_cached(n):
    """Fibonacci with built-in memoization"""
    if n <= 1:
        return n
    return fibonacci_cached(n - 1) + fibonacci_cached(n - 2)

print("\\nMemoized Fibonacci:")
for i in range(20):
    print(f"F(\\{i}) = \\{fibonacci_memo(i)}")
\`\`\`

### DP with Tabulation (Bottom-Up):
\`\`\`
def fibonacci_tabulation(n):
    """
    Fibonacci with tabulation
    Time Complexity: O(n)
    Space Complexity: O(n)
    """
    if n <= 1:
        return n
    
    # Create table to store results
    dp = [0] * (n + 1)
    dp[0] = 0
    dp[1] = 1
    
    # Fill table bottom-up
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    
    return dp[n]

def fibonacci_optimized(n):
    """
    Space-optimized Fibonacci
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    if n <= 1:
        return n
    
    prev2 = 0
    prev1 = 1
    
    for i in range(2, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return prev1

print("\\nTabulated Fibonacci (large numbers):")
for i in [50, 100, 500]:
    print(f"F(\\{i}) = \\{fibonacci_optimized(i)}")
\`\`\`

## 🎒 Classic DP Problem: 0/1 Knapsack

The knapsack problem demonstrates DP's power in optimization:

**Complete Knapsack Implementation:**
\`\`\`
def knapsack_recursive(weights, values, capacity, n):
    """
    Naive recursive knapsack
    Time Complexity: O(2^n)
    """
    # Base case
    if n == 0 or capacity == 0:
        return 0
    
    # If weight exceeds capacity, can't include item
    if weights[n - 1] > capacity:
        return knapsack_recursive(weights, values, capacity, n - 1)
    
    # Return maximum of including or excluding current item
    include = values[n - 1] + knapsack_recursive(weights, values, capacity - weights[n - 1], n - 1)
    exclude = knapsack_recursive(weights, values, capacity, n - 1)
    
    return max(include, exclude)

def knapsack_memo(weights, values, capacity, n, memo=None):
    """
    Knapsack with memoization
    Time Complexity: O(n * capacity)
    Space Complexity: O(n * capacity)
    """
    if memo is None:
        memo = {}
    
    # Check if already computed
    if (n, capacity) in memo:
        return memo[(n, capacity)]
    
    # Base case
    if n == 0 or capacity == 0:
        return 0
    
    # If weight exceeds capacity
    if weights[n - 1] > capacity:
        result = knapsack_memo(weights, values, capacity, n - 1, memo)
    else:
        include = values[n - 1] + knapsack_memo(weights, values, capacity - weights[n - 1], n - 1, memo)
        exclude = knapsack_memo(weights, values, capacity, n - 1, memo)
        result = max(include, exclude)
    
    memo[(n, capacity)] = result
    return result

def knapsack_tabulation(weights, values, capacity):
    """
    Knapsack with tabulation
    Time Complexity: O(n * capacity)
    Space Complexity: O(n * capacity)
    """
    n = len(values)
    
    # Create DP table
    dp = [[0 for _ in range(capacity + 1)] for _ in range(n + 1)]
    
    # Fill table bottom-up
    for i in range(1, n + 1):
        for w in range(1, capacity + 1):
            # If current item's weight exceeds capacity
            if weights[i - 1] > w:
                dp[i][w] = dp[i - 1][w]
            else:
                include = values[i - 1] + dp[i - 1][w - weights[i - 1]]
                exclude = dp[i - 1][w]
                dp[i][w] = max(include, exclude)
    
    return dp[n][capacity], dp

def knapsack_with_items(weights, values, capacity):
    """Knapsack that also returns which items to take"""
    max_value, dp = knapsack_tabulation(weights, values, capacity)
    
    # Backtrack to find items
    n = len(values)
    w = capacity
    items_taken = []
    
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i - 1][w]:
            items_taken.append(i - 1)  # Item index
            w -= weights[i - 1]
    
    return max_value, items_taken[::-1]

# Example usage
weights = [10, 20, 30]
values = [60, 100, 120]
capacity = 50

print("\\nKnapsack Problem:")
print(f"Items: weights=\\{weights}, values=\\{values}")
print(f"Capacity: \\{capacity}")

max_value, items = knapsack_with_items(weights, values, capacity)
print(f"Maximum value: \\{max_value}")
print(f"Items to take (indices): \\{items}")

total_weight = sum(weights[i] for i in items)
print(f"Total weight: \\{total_weight}")
\`\`\`

## 🎮 Real-World DP Application: Text Processing

**Complete Implementation for Longest Common Subsequence:**
\`\`\`
def lcs_length(text1, text2):
    """
    Longest Common Subsequence - Length only
    Time Complexity: O(m * n)
    Space Complexity: O(m * n)
    """
    m, n = len(text1), len(text2)
    
    # Create DP table
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Fill table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    return dp[m][n]

def lcs_string(text1, text2):
    """
    Longest Common Subsequence - Return actual subsequence
    """
    m, n = len(text1), len(text2)
    
    # Create DP table
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Fill table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    
    # Backtrack to find LCS
    lcs = []
    i, j = m, n
    
    while i > 0 and j > 0:
        if text1[i - 1] == text2[j - 1]:
            lcs.append(text1[i - 1])
            i -= 1
            j -= 1
        elif dp[i - 1][j] > dp[i][j - 1]:
            i -= 1
        else:
            j -= 1
    
    return ''.join(reversed(lcs))

class TextAnalyzer:
    """Advanced text analysis using DP algorithms"""
    
    def __init__(self):
        self.memo = {}
    
    def edit_distance(self, str1, str2):
        """
        Calculate minimum edit distance (Levenshtein distance)
        Operations: insert, delete, substitute
        """
        m, n = len(str1), len(str2)
        
        # Create DP table
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        
        # Initialize base cases
        for i in range(m + 1):
            dp[i][0] = i  # Delete all characters
        for j in range(n + 1):
            dp[0][j] = j  # Insert all characters
        
        # Fill table
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if str1[i - 1] == str2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]  # No operation needed
                else:
                    dp[i][j] = 1 + min(
                        dp[i - 1][j],      # Delete
                        dp[i][j - 1],      # Insert
                        dp[i - 1][j - 1]   # Substitute
                    )
        
        return dp[m][n]
    
    def longest_palindromic_subsequence(self, s):
        """Find length of longest palindromic subsequence"""
        n = len(s)
        dp = [[0] * n for _ in range(n)]
        
        # Every single character is a palindrome of length 1
        for i in range(n):
            dp[i][i] = 1
        
        # Fill for substrings of length 2 to n
        for length in range(2, n + 1):
            for i in range(n - length + 1):
                j = i + length - 1
                
                if s[i] == s[j]:
                    if length == 2:
                        dp[i][j] = 2
                    else:
                        dp[i][j] = dp[i + 1][j - 1] + 2
                else:
                    dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])
        
        return dp[0][n - 1]
    
    def word_break(self, s, word_dict):
        """Check if string can be segmented into dictionary words"""
        word_set = set(word_dict)
        n = len(s)
        dp = [False] * (n + 1)
        dp[0] = True  # Empty string can always be segmented
        
        for i in range(1, n + 1):
            for j in range(i):
                if dp[j] and s[j:i] in word_set:
                    dp[i] = True
                    break
        
        return dp[n]
    
    def find_similar_texts(self, target, text_list, max_distance=3):
        """Find texts similar to target using edit distance"""
        similar_texts = []
        
        for text in text_list:
            distance = self.edit_distance(target, text)
            if distance <= max_distance:
                similar_texts.append((text, distance))
        
        return sorted(similar_texts, key=lambda x: x[1])

# Using the Text Analyzer
analyzer = TextAnalyzer()

print("\\nText Analysis with Dynamic Programming:")
print("-" * 50)

# LCS Example
text1 = "ABCDGH"
text2 = "AEDFHR"
print(f"Text 1: \\{text1}")
print(f"Text 2: \\{text2}")
print(f"LCS length: \\{lcs_length(text1, text2)}")
print(f"LCS string: '\\{lcs_string(text1, text2)}'")

# Edit Distance
str1 = "kitten"
str2 = "sitting"
distance = analyzer.edit_distance(str1, str2)
print(f"\\nEdit distance between '\\{str1}' and '\\{str2}': \\{distance}")

# Palindromic Subsequence
palindrome_text = "bbbab"
palindrome_length = analyzer.longest_palindromic_subsequence(palindrome_text)
print(f"\\nLongest palindromic subsequence in '\\{palindrome_text}': \\{palindrome_length}")

# Word Break
text = "leetcode"
dictionary = ["leet", "code"]
can_break = analyzer.word_break(text, dictionary)
print(f"\\nCan '\\{text}' be segmented using \\{dictionary}? \\{can_break}")

# Similar Text Finding
target_text = "hello"
text_database = ["helo", "help", "hello world", "yellow", "hall", "hill"]
similar = analyzer.find_similar_texts(target_text, text_database, max_distance=2)
print(f"\\nTexts similar to '\\{target_text}':")
for text, dist in similar:
    print(f"  '\\{text}' (distance: \\{dist})")
\`\`\`

## 💰 DP for Financial Planning

**Complete Investment Optimization:**
\`\`\`
class InvestmentOptimizer:
    """Use DP for optimal investment strategies"""
    
    def __init__(self):
        self.memo = {}
    
    def max_profit_stock_transactions(self, prices, max_transactions):
        """
        Maximum profit from at most k stock transactions
        Time Complexity: O(n * k)
        """
        if not prices or max_transactions == 0:
            return 0
        
        n = len(prices)
        
        # If we can make as many transactions as we want
        if max_transactions >= n // 2:
            return self.max_profit_unlimited_transactions(prices)
        
        # DP with limited transactions
        buy = [-prices[0]] * (max_transactions + 1)
        sell = [0] * (max_transactions + 1)
        
        for i in range(1, n):
            for j in range(max_transactions, 0, -1):
                sell[j] = max(sell[j], buy[j] + prices[i])
                buy[j] = max(buy[j], sell[j - 1] - prices[i])
        
        return sell[max_transactions]
    
    def max_profit_unlimited_transactions(self, prices):
        """Maximum profit with unlimited transactions"""
        profit = 0
        for i in range(1, len(prices)):
            if prices[i] > prices[i - 1]:
                profit += prices[i] - prices[i - 1]
        return profit
    
    def coin_change_min_coins(self, coins, amount):
        """
        Minimum number of coins to make amount
        Classic DP problem
        """
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        
        for i in range(1, amount + 1):
            for coin in coins:
                if coin <= i:
                    dp[i] = min(dp[i], dp[i - coin] + 1)
        
        return dp[amount] if dp[amount] != float('inf') else -1
    
    def coin_change_ways(self, coins, amount):
        """Number of ways to make amount using coins"""
        dp = [0] * (amount + 1)
        dp[0] = 1
        
        for coin in coins:
            for i in range(coin, amount + 1):
                dp[i] += dp[i - coin]
        
        return dp[amount]
    
    def house_robber(self, houses):
        """
        Maximum money from robbing houses
        Cannot rob two adjacent houses
        """
        if not houses:
            return 0
        if len(houses) == 1:
            return houses[0]
        
        prev2 = 0
        prev1 = houses[0]
        
        for i in range(1, len(houses)):
            current = max(prev1, prev2 + houses[i])
            prev2 = prev1
            prev1 = current
        
        return prev1
    
    def optimal_portfolio_allocation(self, investments, budget, min_returns):
        """
        Optimal investment allocation using DP
        investments: [(cost, expected_return, risk_factor), ...]
        """
        n = len(investments)
        
        # DP table: dp[i][budget] = (max_return, allocation)
        dp = {}
        
        def solve(i, remaining_budget):
            if i == n or remaining_budget <= 0:
                return 0, []
            
            if (i, remaining_budget) in dp:
                return dp[(i, remaining_budget)]
            
            cost, return_rate, risk = investments[i]
            
            # Option 1: Don't invest in current option
            max_return, allocation = solve(i + 1, remaining_budget)
            
            # Option 2: Invest in current option (if affordable)
            if cost <= remaining_budget:
                invest_return, invest_allocation = solve(i + 1, remaining_budget - cost)
                invest_return += return_rate
                
                if invest_return > max_return:
                    max_return = invest_return
                    allocation = [i] + invest_allocation
            
            dp[(i, remaining_budget)] = (max_return, allocation)
            return max_return, allocation
        
        return solve(0, budget)

# Using the Investment Optimizer
optimizer = InvestmentOptimizer()

print("\\nInvestment Optimization with Dynamic Programming:")
print("-" * 60)

# Stock trading
stock_prices = [7, 1, 5, 3, 6, 4]
max_transactions = 2
max_profit = optimizer.max_profit_stock_transactions(stock_prices, max_transactions)
print(f"Stock prices: \\{stock_prices}")
print(f"Max profit with \\{max_transactions} transactions: $\\{max_profit}")

# Coin change
coins = [1, 5, 10, 25]
amount = 67
min_coins = optimizer.coin_change_min_coins(coins, amount)
ways_to_make = optimizer.coin_change_ways(coins, amount)
print(f"\\nMaking $\\{amount} with coins \\{coins}:")
print(f"Minimum coins needed: \\{min_coins}")
print(f"Number of ways: \\{ways_to_make}")

# House robber
house_values = [2, 7, 9, 3, 1]
max_robbery = optimizer.house_robber(house_values)
print(f"\\nHouse values: \\{house_values}")
print(f"Maximum robbery amount: $\\{max_robbery}")

# Portfolio optimization
investments = [
    (1000, 120, 0.1),  # (cost, expected_return, risk)
    (2000, 300, 0.2),
    (1500, 200, 0.15),
    (3000, 500, 0.3),
    (500, 50, 0.05)
]

budget = 5000
returns, allocation = optimizer.optimal_portfolio_allocation(investments, budget, 0)
print(f"\\nPortfolio optimization with budget $\\{budget}:")
print(f"Maximum expected return: $\\{returns}")
print(f"Optimal allocation (investment indices): \\{allocation}")

total_cost = sum(investments[i][0] for i in allocation)
print(f"Total investment cost: $\\{total_cost}")
\`\`\`

## 🎯 DP Problem-Solving Strategy

### Step-by-Step Approach:

1. **Identify optimal substructure**
   - Can the problem be broken into smaller subproblems?
   - Is the optimal solution composed of optimal solutions to subproblems?

2. **Check for overlapping subproblems**
   - Are the same subproblems solved multiple times?
   - Would memoization help?

3. **Define the recurrence relation**
   - What's the relationship between subproblems?
   - What are the base cases?

4. **Choose implementation approach**
   - Top-down (memoization) or bottom-up (tabulation)?
   - Space optimization possible?

### Common DP Patterns:

**Linear DP**: One-dimensional problems
- Fibonacci, House Robber, Climbing Stairs

**Grid DP**: Two-dimensional problems
- Unique Paths, Minimum Path Sum, Edit Distance

**Interval DP**: Problems on ranges
- Longest Palindromic Subsequence, Matrix Chain Multiplication

**Tree DP**: Problems on trees
- Binary Tree Maximum Path Sum, Diameter of Binary Tree

## 💡 Dynamic Programming Best Practices

### ✅ Good Practices:
1. **Start with recursive solution** then add memoization
2. **Identify state variables** clearly
3. **Consider space optimization** after getting correct solution
4. **Use appropriate data structures** for memoization

### ❌ Common Mistakes:
1. **Trying DP on non-DP problems** (no optimal substructure)
2. **Incorrect state definition** leading to wrong recurrence
3. **Not handling base cases** properly
4. **Over-complicating** simple recursive solutions

### Performance Tips:
- **Memoization**: Good for sparse subproblem space
- **Tabulation**: Good when all subproblems are needed
- **Space optimization**: Often possible to reduce space complexity
- **Iterative solutions**: Usually faster than recursive with memoization

Ready to master dynamic programming? Practice with the challenges below!`,
        relatedChallenges: [
          "Dynamic Programming Classics",
          "Optimization Problems",
        ],
      },
    ],
  },
};

// Seed extra learning categories and lessons (non-breaking extension)
Object.assign(topicConfig, {
  "Data Science": {
    icon: "📈",
    color: "from-indigo-500 to-sky-600",
    gradient: "from-indigo-50 to-sky-50",
    description: "Intro to data analysis, NumPy, pandas, and visualization",
    lessons: [
      {
        title: "NumPy Fundamentals",
        slug: "numpy-fundamentals",
        content: `# 🔢 NumPy Fundamentals

NumPy provides fast, vectorized arrays and math for scientific computing.

## ✅ Why NumPy?
- Vectorized math
- Broadcasting rules
- Memory-efficient arrays

**Example:**
\`\`\`
import numpy as np

arr = np.array([1, 2, 3, 4], dtype=np.float32)
print(arr * 10)
print(arr.mean(), arr.std())
\`\`\`

Try vector operations and slicing to get familiar.`,
        relatedChallenges: [
          "NumPy Arrays Basics",
          "Array Operations",
          "Vectorized Math",
        ],
      },
      {
        title: "Pandas Basics",
        slug: "pandas-basics",
        content: `# 🐼 Pandas Basics

Pandas is the toolkit for tabular data (CSV, Excel, SQL, etc.).

**Example:**
\`\`\`
import pandas as pd

df = pd.DataFrame({
    "name": ["Alice", "Bob", "Carol"],
    "score": [95, 82, 89]
})
print(df.describe())
print(df[df["score"] > 85])
\`\`\`

Learn Series, DataFrame, filtering, groupby.`,
        relatedChallenges: ["DataFrame Operations", "Filtering and GroupBy"],
      },
      {
        title: "Matplotlib Visualization",
        slug: "matplotlib-visualization",
        content: `# 📊 Data Visualization with Matplotlib

Create basic charts to explore your data.

**Example:**
\`\`\`
import matplotlib.pyplot as plt

x = [1,2,3,4,5]
y = [1,4,9,16,25]
plt.plot(x, y, marker="o")
plt.title("Squares")
plt.xlabel("x")
plt.ylabel("y")
plt.show()
\`\`\`

Practice line, bar, scatter, and hist charts.`,
        relatedChallenges: ["Matplotlib Basics", "Plot Styling"],
      },
    ],
  },

  "Web Development": {
    icon: "🌐",
    color: "from-emerald-500 to-teal-600",
    gradient: "from-emerald-50 to-teal-50",
    description: "Build web APIs with Flask/FastAPI and understand HTTP/REST",
    lessons: [
      {
        title: "HTTP & REST Fundamentals",
        slug: "http-rest-fundamentals",
        content: `# 🌍 HTTP & REST Fundamentals

Learn requests, responses, methods (GET/POST), and JSON.

**A simple JSON response:**
\`\`\`
# Pseudo-response
status: 200 OK
Content-Type: application/json

{"message": "hello", "ok": true}
\`\`\`

Understand status codes, headers, and payloads.`,
        relatedChallenges: ["HTTP Methods", "REST Concepts"],
      },
      {
        title: "Flask: Your First API",
        slug: "flask-first-api",
        content: `# 🧪 Flask: Your First API

Create a minimal web API with Flask.

**Example:**
\`\`\`
from flask import Flask, jsonify, request

app = Flask(__name__)

@app.get("/hello")
def hello():
    return jsonify({"message": "Hello, Flask!"})

@app.post("/echo")
def echo():
    data = request.get_json() or {}
    return jsonify({"you_sent": data})

# app.run()  # Run locally
\`\`\`

Try GET/POST routes and JSON handling.`,
        relatedChallenges: ["Flask Routes", "JSON Handling"],
      },
      {
        title: "FastAPI Basics",
        slug: "fastapi-basics",
        content: `# ⚡ FastAPI Basics

Type-driven, fast web APIs with automatic docs.

**Example:**
\`\`\`
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Item(BaseModel):
    name: str
    price: float

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/items")
def create_item(item: Item):
    return {"created": item}
\`\`\`

Check /docs for Swagger UI.`,
        relatedChallenges: ["FastAPI Endpoints", "Request Validation"],
      },
    ],
  },

  "Automation & Scripting": {
    icon: "⚙️",
    color: "from-orange-500 to-amber-600",
    gradient: "from-orange-50 to-amber-50",
    description: "Automate tasks with Python: files, OS, and simple CLIs",
    lessons: [
      {
        title: "File Automation Toolkit",
        slug: "file-automation",
        content: `# 📁 File Automation Toolkit

Read, write, and scan files/folders.

**Example:**
\`\`\`
from pathlib import Path

root = Path(".")
txts = list(root.glob("**/*.txt"))
for p in txts:
    content = p.read_text(encoding="utf-8")
    print(p, len(content))
\`\`\`

Backup, rename, transform files.`,
        relatedChallenges: ["File Reading and Writing", "Directory Walk"],
      },
      {
        title: "Build a Tiny CLI",
        slug: "tiny-cli",
        content: `# 🧰 Build a Tiny CLI

Create simple command-line tools with argparse.

**Example:**
\`\`\`
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--name", default="world")
args = parser.parse_args()

print(f"Hello, {args.name}!")
\`\`\`

Add flags, help, and subcommands.`,
        relatedChallenges: ["Argparse Basics", "CLI Utilities"],
      },
    ],
  },

  "Testing & Best Practices": {
    icon: "🧪",
    color: "from-pink-500 to-rose-600",
    gradient: "from-pink-50 to-rose-50",
    description:
      "Write reliable tests, use type hints, and improve code quality",
    lessons: [
      {
        title: "Unit Testing with pytest",
        slug: "pytest-basics",
        content: `# ✅ Unit Testing with pytest

Write tests to validate your code automatically.

**Example:**
\`\`\`
# test_math.py
def add(a, b): return a + b

def test_add():
    assert add(2, 3) == 5
\`\`\`

Run with: \`pytest -q\`. Learn fixtures and parametrization.`,
        relatedChallenges: ["Pytest Basics", "Parametrized Tests"],
      },
      {
        title: "Type Hints & Docstrings",
        slug: "type-hints-docstrings",
        content: `# ✍️ Type Hints & Docstrings

Improve readability and tooling with types and docs.

**Example:**
\`\`\`
from typing import List

def mean(xs: List[float]) -> float:
    """Return the arithmetic mean of the given numbers."""
    return sum(xs) / len(xs)
\`\`\`

Try mypy, pydoc, and consistent docstrings.`,
        relatedChallenges: ["Type Hints", "Refactoring for Clarity"],
      },
    ],
  },
});
export default function LearnPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(
    "Python Fundamentals"
  );
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  // UI/UX: lesson search within selected topic
  const [lessonSearch, setLessonSearch] = useState("");
  // Category view mode: 'compact' pill bar or 'detailed' grid cards
  const [categoryView, setCategoryView] = useState<"compact" | "detailed">(
    "compact"
  );
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  // Lesson completion UX state
  const [lessonStartTs, setLessonStartTs] = useState<number | null>(null);
  const [finishLoading, setFinishLoading] = useState(false);
  const [finishResult, setFinishResult] = useState<{
    diamonds?: number;
    experience?: number;
    message?: string;
    success?: boolean;
  } | null>(null);

  useEffect(() => {
    loadTopicsAndProgress();
  }, []);

  // Reset pagination when search text or selected topic changes
  useEffect(() => {
    setPage(1);
  }, [lessonSearch, selectedTopic]);

  // Track reading time & reset claim result when opening a lesson
  useEffect(() => {
    if (selectedLesson) {
      setLessonStartTs(Date.now());
      setFinishResult(null);
    }
  }, [selectedLesson]);

  const loadTopicsAndProgress = async () => {
    try {
      setLoading(true);

      // Load DB lessons and code-arena challenges
      const [lessonsRes, activitiesRes] = await Promise.all([
        fetch("/api/lessons?limit=500"),
        fetch("/api/code-arena?limit=500"),
      ]);

      const lessonsPayload = lessonsRes.ok
        ? await lessonsRes.json()
        : { lessons: [] };
      const arenaPayload = activitiesRes.ok
        ? await activitiesRes.json()
        : { activities: [] };

      const lessons = Array.isArray(lessonsPayload.lessons)
        ? lessonsPayload.lessons
        : [];
      const activities = Array.isArray(arenaPayload.activities)
        ? arenaPayload.activities
        : [];

      const normalizeCategory = (s: string) =>
        (s ?? "").toString().trim().toLowerCase().replace(/\s+/g, " ");

      // Group challenges by category
      const challengesByCategory: { [key: string]: Challenge[] } = {};
      activities.forEach((activity: any) => {
        const key = activity.category || "General";
        if (!challengesByCategory[key]) {
          challengesByCategory[key] = [];
        }
        challengesByCategory[key].push({
          id: activity.id,
          title: activity.title,
          difficulty: activity.difficulty,
          diamondReward: activity.diamondReward,
          experienceReward: activity.experienceReward,
          estimatedMinutes: activity.estimatedMinutes,
          activityType: activity.activityType,
          isCompleted: activity.userProgress?.completed || false,
          userProgress: activity.userProgress,
        });
      });

      // Build base topics map from static config for visuals
      const topicsMap: Record<string, Topic> = {};
      Object.entries(topicConfig as any).forEach(([topicName, cfg]: any) => {
        topicsMap[topicName] = {
          id: topicName,
          title: topicName,
          description: cfg.description,
          icon: cfg.icon,
          color: cfg.color,
          gradient: cfg.gradient,
          lessons: [],
          challenges: challengesByCategory[topicName] || [],
          totalLessons: 0,
          completedLessons: 0,
          totalChallenges: (challengesByCategory[topicName] || []).length,
          completedChallenges: (challengesByCategory[topicName] || []).filter(
            (c) => c.isCompleted
          ).length,
          overallProgress: 0,
          isUnlocked: true,
        };
      });

      const diffMap: any = { beginner: 1, intermediate: 2, advanced: 3 };

      // Inject DB lessons grouped by category
      lessons.forEach((l: any) => {
        const category = l.category || "General";
        if (!topicsMap[category]) {
          // default visuals for unknown categories
          topicsMap[category] = {
            id: category,
            title: category,
            description: `${category} lessons`,
            icon: category.toLowerCase().includes("python") ? "🐍" : "📘",
            color: "from-indigo-500 to-blue-600",
            gradient: "from-indigo-50 to-blue-50",
            lessons: [],
            challenges: challengesByCategory[category] || [],
            totalLessons: 0,
            completedLessons: 0,
            totalChallenges: (challengesByCategory[category] || []).length,
            completedChallenges: (challengesByCategory[category] || []).filter(
              (c) => c.isCompleted
            ).length,
            overallProgress: 0,
            isUnlocked: true,
          };
        }

        const related = (challengesByCategory[category] || []).slice(0, 3);

        const lesson: Lesson = {
          id: l.id,
          title: l.title,
          slug: l.slug,
          description: l.description || `Learn ${l.title}`,
          content: "",
          difficulty:
            typeof l.difficulty === "string"
              ? diffMap[l.difficulty] || 1
              : l.difficulty || 1,
          duration: l.estimatedTime ?? l.estimatedMinutes ?? 20,
          category,
          diamondReward: l.diamondReward ?? 0,
          experienceReward: l.experienceReward ?? 0,
          isCompleted: !!l.isCompleted,
          relatedChallenges: related,
          prerequisites: [],
        };

        topicsMap[category].lessons.push(lesson);
      });

      // Finalize stats and sort
      const topicsData: Topic[] = Object.values(topicsMap)
        .map((t) => {
          const completedLessons = t.lessons.filter(
            (l) => l.isCompleted
          ).length;
          const totalLessons = t.lessons.length;
          const totalChallenges = t.totalChallenges;
          const completedChallenges = t.completedChallenges;
          const overallProgress =
            Math.round(
              ((completedLessons + completedChallenges) /
                Math.max(1, totalLessons + totalChallenges)) *
                100
            ) || 0;

          const lessonsSorted = [...t.lessons].sort(
            (a, b) =>
              (a.duration || 0) - (b.duration || 0) ||
              a.title.localeCompare(b.title)
          );

          return {
            ...t,
            lessons: lessonsSorted,
            totalLessons,
            completedLessons,
            overallProgress,
          };
        })
        .sort((a, b) => a.title.localeCompare(b.title));

      setTopics(topicsData);
    } catch (error) {
      console.error("Failed to load topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedTopicData = topics.find((t) => t.id === selectedTopic);

  // Aggregated stats for quick overview
  const totalTopics = topics.length;
  const totalLessonsAll = topics.reduce(
    (sum, t) => sum + (t.totalLessons || 0),
    0
  );
  const totalChallengesAll = topics.reduce(
    (sum, t) => sum + (t.totalChallenges || 0),
    0
  );

  // Smart "Continue Learning" - next incomplete lesson (or first)
  const continueLesson =
    selectedTopicData?.lessons.find((l) => !l.isCompleted) ||
    (selectedTopicData?.lessons.length ? selectedTopicData.lessons[0] : null);

  // Lesson filtering (title + description)
  const filteredLessons = (selectedTopicData?.lessons || []).filter((l) => {
    const q = lessonSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      l.title.toLowerCase().includes(q) ||
      (l.description || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredLessons.length / PAGE_SIZE));
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, filteredLessons.length);
  const paginatedLessons = filteredLessons.slice(startIndex, endIndex);

  // Clamp current page if filters change and reduce total pages
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleGoToChallenges = (lesson: Lesson) => {
    // Navigate to code arena with specific challenges
    const challengeIds = lesson.relatedChallenges.map((c) => c.id).join(",");
    window.open(
      `/code-arena?category=${lesson.category}&challenges=${challengeIds}`,
      "_blank"
    );
  };

  // Safe slugification to match backend fallback (slugified title)
  const slugifyTitle = (s: string) =>
    s
      .toString()
      .toLowerCase()
      .replace(/&/g, " ")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

  // Finish lesson and claim reward without requiring a "start" step
  const handleFinishLesson = async () => {
    if (!selectedLesson) return;
    if (!isAuthenticated) {
      setFinishResult({
        message: "Login required to claim rewards.",
      });
      return;
    }
    setFinishLoading(true);
    setFinishResult(null);

    const seconds =
      lessonStartTs !== null
        ? Math.max(0, Math.floor((Date.now() - lessonStartTs) / 1000))
        : 0;

    // Try slugified title first (DB fallback), then provided slug
    const candidates = Array.from(
      new Set(
        [slugifyTitle(selectedLesson.title), selectedLesson.slug].filter(
          Boolean
        )
      )
    ) as string[];

    let lastError: string | null = null;
    for (const slug of candidates) {
      try {
        const res = await fetch(`/api/lessons/${slug}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "complete", timeSpent: seconds }),
        });
        const data = await res.json();
        if (!res.ok) {
          lastError = data?.error || res.statusText;
          continue;
        }

        const diamonds = data?.rewards?.diamonds || 0;
        const experience = data?.rewards?.experience || 0;
        const message = data?.message || "Lesson completed";
        setFinishResult({ diamonds, experience, message, success: true });

        // Mark completed in topics state and recalc progress
        setTopics((prev) =>
          prev.map((t) => {
            if (t.id !== selectedLesson.category) return t;
            const lessons = t.lessons.map((l) =>
              l.slug === selectedLesson.slug || slugifyTitle(l.title) === slug
                ? { ...l, isCompleted: true }
                : l
            );
            const completedLessons = lessons.filter(
              (l) => l.isCompleted
            ).length;
            const totalLessons = lessons.length;
            const completedChallenges = t.completedChallenges;
            const totalChallenges = t.totalChallenges;
            const overallProgress =
              Math.round(
                ((completedLessons + completedChallenges) /
                  Math.max(1, totalLessons + totalChallenges)) *
                  100
              ) || 0;
            return { ...t, lessons, completedLessons, overallProgress };
          })
        );

        // Update local selected lesson state
        setSelectedLesson((prev) =>
          prev ? { ...prev, isCompleted: true } : prev
        );
        setLessonStartTs(Date.now()); // reset timer for potential revisit
        setFinishLoading(false);
        return;
      } catch (err: any) {
        lastError = err?.message || "Request failed";
      }
    }

    setFinishResult({ message: lastError || "Failed to complete lesson" });
    setFinishLoading(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
          <p className="mt-4 text-lg text-gray-600">
            Loading your learning journey...
          </p>
        </div>
      </div>
    );
  }

  if (selectedLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Lesson Header */}
          <div className="mb-8 rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
            <button
              onClick={() => setSelectedLesson(null)}
              className="mb-4 flex items-center text-blue-600 hover:text-blue-700"
            >
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              Back to Topics
            </button>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                  {selectedLesson.title}
                </h1>
                <p className="mb-4 text-gray-600">
                  {selectedLesson.description}
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {selectedLesson.duration} min
                  </div>
                  <div className="flex items-center">
                    <Diamond className="mr-1 h-4 w-4 text-yellow-500" />
                    {25}
                  </div>
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 text-purple-500" />
                    {25} XP
                  </div>
                </div>
              </div>

              <div className="ml-6">
                <div className="rounded-xl bg-gradient-to-r from-purple-100 to-blue-100 p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedLesson.relatedChallenges.length}
                  </div>
                  <div className="text-sm text-purple-600">
                    Practice Challenges
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="mb-8 rounded-2xl bg-white/80 shadow-lg backdrop-blur-sm">
            <LessonContent content={selectedLesson.content} />
          </div>

          {/* Finish Lesson & Claim Reward */}
          <div className="mb-8 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-6">
            <h2 className="mb-2 text-xl font-bold text-emerald-900">
              Finish lesson and get reward
            </h2>
            <p className="mb-4 text-emerald-800">
              Mark this lesson complete and claim your rewards.
            </p>

            {finishResult && (
              <div
                className={`mb-4 rounded-lg border p-3 ${
                  finishResult.success
                    ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                    : "border-amber-300 bg-amber-50 text-amber-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className={`h-5 w-5 ${
                      finishResult.success
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`}
                  />
                  <span>{finishResult.message || "Completed"}</span>
                </div>
                {(finishResult.diamonds || finishResult.experience) && (
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                      <Diamond className="h-4 w-4 text-yellow-500" />+
                      {finishResult.diamonds || 0}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-purple-700">
                      <Star className="h-4 w-4 text-purple-500" />+
                      {finishResult.experience || 0} XP
                    </span>
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleFinishLesson}
              disabled={finishLoading || !isAuthenticated}
              className={`inline-flex items-center rounded-xl px-6 py-3 text-white transition-all ${
                finishLoading || !isAuthenticated
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
              }`}
            >
              {finishLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-white" />
                  Finish Lesson & Claim Reward
                </span>
              )}
            </button>
            {!isAuthenticated && (
              <p className="mt-2 text-sm text-emerald-800">
                You need to log in to claim rewards.
              </p>
            )}
          </div>

          {/* Practice Challenges */}
          <div className="rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Practice What You Learned
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {selectedLesson.relatedChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {challenge.title}
                    </h3>
                    {challenge.isCompleted && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>

                  <div className="mb-4 flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {challenge.estimatedMinutes}m
                    </div>
                    <div className="flex items-center">
                      <Diamond className="mr-1 h-4 w-4 text-yellow-500" />
                      {challenge.diamondReward}
                    </div>
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4 text-purple-500" />
                      {challenge.experienceReward}
                    </div>
                  </div>

                  <Link
                    href={`/code-arena?challenge=${challenge.id}`}
                    className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white transition-all hover:from-purple-700 hover:to-blue-700"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    {challenge.isCompleted
                      ? "Practice Again"
                      : "Start Challenge"}
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => handleGoToChallenges(selectedLesson)}
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 text-white transition-all hover:from-green-600 hover:to-emerald-600"
              >
                <Gamepad2 className="mr-2 h-5 w-5" />
                Practice All Challenges
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Reusable CodeBlock with copy-to-clipboard, inferred language, and consistent styling.
   */
  function CodeBlock({
    code,
    language,
    showLineNumbers = false,
  }: {
    code: string;
    language?: string;
    showLineNumbers?: boolean;
  }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch {
        // Ignore copy failures
      }
    };

    // Prepare lines for optional line numbers
    const lines = code.replace(/\s+$/, "").split("\n");

    // Nice label for header
    const langLabel = (language || "text").toLowerCase();

    return (
      <div className="my-4 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-900 px-3 py-2">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <span className="inline-flex items-center rounded border border-slate-600 bg-slate-800 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-200">
              {langLabel}
            </span>
            <span className="hidden text-slate-400 md:inline">
              Code Example
            </span>
          </div>
          <button
            type="button"
            aria-label="Copy code to clipboard"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition ${
              copied
                ? "bg-emerald-500 text-white"
                : "bg-slate-700 text-slate-100 hover:bg-slate-600"
            }`}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="relative">
          <pre
            className="m-0 overflow-x-auto bg-slate-950 p-4 text-[13px] leading-relaxed text-slate-100"
            style={{ tabSize: 2 }}
          >
            <code className="font-mono">
              {showLineNumbers ? (
                <div className="grid grid-cols-[auto,1fr] gap-4">
                  <div className="select-none pr-2 text-right text-slate-500">
                    {lines.map((_, i) => (
                      <div key={i} className="leading-relaxed">
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <div className="min-w-0">
                    {lines.map((ln, i) => (
                      <div key={i} className="leading-relaxed">
                        {ln}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                code
              )}
            </code>
          </pre>
        </div>
      </div>
    );
  }

  /**
   * Minimal markdown renderer specialized for our lessons.
   * - Splits fenced code blocks (```[lang?] ... ```)
   * - Renders CodeBlock for code parts (with language inference)
   * - Converts headings, bold, inline code, lists, and paragraphs
   * This avoids pulling extra dependencies and greatly improves code view UX.
   */
  function LessonContent({ content }: { content: string }) {
    // Normalize line endings
    const src = content.replace(/\r\n/g, "\n");

    // Split by fenced code blocks using a capturing regex that keeps the fences and language
    const fenceRegex = /```(\w+)?\n([\s\S]*?)```/g;

    const parts: Array<{ type: "code" | "text"; lang?: string; body: string }> =
      [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = fenceRegex.exec(src)) !== null) {
      const [full, langRaw, codeBody] = match;
      const idx = match.index;

      if (idx > lastIndex) {
        parts.push({
          type: "text",
          body: src.slice(lastIndex, idx),
        });
      }
      parts.push({
        type: "code",
        lang: langRaw || inferLanguageFromCode(codeBody),
        body: codeBody.replace(/^\n+|\n+$/g, ""),
      });
      lastIndex = idx + full.length;
    }
    if (lastIndex < src.length) {
      parts.push({
        type: "text",
        body: src.slice(lastIndex),
      });
    }

    return (
      <div className="lesson-content px-4 py-6 md:px-8">
        {parts.map((p, i) =>
          p.type === "code" ? (
            <CodeBlock key={`code-${i}`} code={p.body} language={p.lang} />
          ) : (
            <MarkdownFragment key={`text-${i}`} markdown={p.body} />
          )
        )}
      </div>
    );
  }

  /**
   * Render a small subset of Markdown safely as React nodes:
   * - #, ##, ### headings
   * - **bold**, `inline code`
   * - Lists (- or *), paragraphs
   * - Preserves line breaks within paragraphs
   */
  function MarkdownFragment({ markdown }: { markdown: string }) {
    // Split into lines for block parsing
    const lines = markdown.split("\n");

    const nodes: ReactNode[] = [];
    let paragraphBuffer: string[] = [];
    let listBuffer: string[] = [];

    const flushParagraph = () => {
      if (paragraphBuffer.length) {
        nodes.push(
          <p key={`p-${nodes.length}`} className="text-gray-700">
            {renderInline(paragraphBuffer.join("\n"))}
          </p>
        );
        paragraphBuffer = [];
      }
    };

    const flushList = () => {
      if (listBuffer.length) {
        nodes.push(
          <ul
            key={`ul-${nodes.length}`}
            className="list-disc pl-6 text-gray-700"
          >
            {listBuffer.map((item, idx) => (
              <li key={`li-${idx}`}>{renderInline(item.trim())}</li>
            ))}
          </ul>
        );
        listBuffer = [];
      }
    };

    lines.forEach((line) => {
      const trimmed = line.trim();

      // Headings
      const h3 = /^### (.+)/.exec(trimmed);
      const h2 = /^## (.+)/.exec(trimmed);
      const h1 = /^# (.+)/.exec(trimmed);

      if (h1 || h2 || h3) {
        flushParagraph();
        flushList();
        if (h1) {
          nodes.push(
            <h1
              key={`h1-${nodes.length}`}
              className="mt-6 text-3xl font-bold text-gray-900"
            >
              {renderInline(h1[1])}
            </h1>
          );
        } else if (h2) {
          nodes.push(
            <h2
              key={`h2-${nodes.length}`}
              className="mt-6 text-2xl font-bold text-gray-900"
            >
              {renderInline(h2[1])}
            </h2>
          );
        } else if (h3) {
          nodes.push(
            <h3
              key={`h3-${nodes.length}`}
              className="mt-5 text-xl font-bold text-gray-800"
            >
              {renderInline(h3[1])}
            </h3>
          );
        }
        return;
      }

      // List items (- or *)
      if (/^[-*]\s+/.test(trimmed)) {
        flushParagraph();
        listBuffer.push(trimmed.replace(/^[-*]\s+/, ""));
        return;
      }

      // Blank line: separate paragraphs/lists
      if (trimmed === "") {
        flushParagraph();
        flushList();
        return;
      }

      // Accumulate paragraph lines
      paragraphBuffer.push(line);
    });

    // Flush any remaining buffers
    flushParagraph();
    flushList();

    return <>{nodes}</>;
  }

  function renderInline(text: string): ReactNode {
    // Replace **bold**
    const boldSplit = splitByRegex(text, /\*\*([^*]+)\*\*/g, (m) => (
      <strong key={`b-${m.index}`} className="font-semibold text-gray-900">
        {m.groups?.[1] ?? m[1]}
      </strong>
    ));

    // Then wrap `inline code`
    return mapInlineCode(boldSplit);
  }

  function splitByRegex(
    input: string,
    regex: RegExp,
    renderMatch: (
      m: RegExpExecArray & { groups?: Record<string, string> }
    ) => ReactNode
  ): ReactNode[] {
    const out: ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    const r = new RegExp(regex); // ensure stateful copy for safety
    r.lastIndex = 0;

    while ((match = r.exec(input)) !== null) {
      const idx = match.index;
      if (idx > lastIndex) {
        out.push(input.slice(lastIndex, idx));
      }
      out.push(renderMatch(match as any));
      lastIndex = idx + match[0].length;
    }
    if (lastIndex < input.length) {
      out.push(input.slice(lastIndex));
    }
    return out;
  }

  function mapInlineCode(nodes: ReactNode[]): ReactNode[] {
    const result: ReactNode[] = [];

    nodes.forEach((node, i) => {
      if (typeof node !== "string") {
        result.push(node);
        return;
      }

      const parts: ReactNode[] = [];
      const regex = /`([^`]+)`/g;
      let lastIndex = 0;
      let m: RegExpExecArray | null;

      while ((m = regex.exec(node)) !== null) {
        const idx = m.index;
        if (idx > lastIndex) {
          parts.push(node.slice(lastIndex, idx));
        }
        parts.push(
          <code
            key={`ic-${i}-${idx}`}
            className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[12px] text-gray-800"
          >
            {m[1]}
          </code>
        );
        lastIndex = idx + m[0].length;
      }
      if (lastIndex < node.length) {
        parts.push(node.slice(lastIndex));
      }
      result.push(...parts);
    });

    return result;
  }

  function inferLanguageFromCode(code: string | undefined): string {
    if (!code) return "text";
    const firstWord = code.trim().split(/\s+/)[0];
    // Heuristics for Python snippets in the provided lessons
    if (
      /\b(def|import|class|print|for|while|if|elif|else|try|except|with)\b/.test(
        code
      ) ||
      firstWord === "python"
    ) {
      return "python";
    }
    if (/\b(const|let|var|function|=>|console\.log)\b/.test(code)) {
      return "javascript";
    }
    if (/\b(class|public|private|void|int|string|new)\b/.test(code)) {
      return "java";
    }
    if (/^\s*#include\b/.test(code)) {
      return "cpp";
    }
    return "text";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              📚 Learn Programming
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Master programming concepts step-by-step, then practice with
              hands-on challenges in Code Arena
            </p>
          </motion.div>
        </div>

        {/* Quick Stats Strip */}
        <div className="mx-auto mb-10 max-w-5xl">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-blue-50 p-3 shadow-sm sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-700">Topics</p>
                  <p className="text-lg font-bold text-indigo-900 sm:text-2xl">
                    {totalTopics}
                  </p>
                </div>
                <BookOpen className="h-6 w-6 text-indigo-500 sm:h-8 sm:w-8" />
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-3 shadow-sm sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-700">Lessons</p>
                  <p className="text-lg font-bold text-emerald-900 sm:text-2xl">
                    {totalLessonsAll}
                  </p>
                </div>
                <Clock className="h-6 w-6 text-emerald-500 sm:h-8 sm:w-8" />
              </div>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-yellow-50 p-3 shadow-sm sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-700">Challenges</p>
                  <p className="text-lg font-bold text-amber-900 sm:text-2xl">
                    {totalChallengesAll}
                  </p>
                </div>
                <Trophy className="h-6 w-6 text-amber-500 sm:h-8 sm:w-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Topic Selection */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Topics</h2>
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 text-sm shadow-sm">
            <button
              type="button"
              onClick={() => setCategoryView("compact")}
              className={`rounded-md px-3 py-1 ${categoryView === "compact" ? "bg-purple-600 text-white" : "text-gray-700 hover:bg-gray-50"}`}
              aria-pressed={categoryView === "compact"}
            >
              Compact
            </button>
            <button
              type="button"
              onClick={() => setCategoryView("detailed")}
              className={`rounded-md px-3 py-1 ${categoryView === "detailed" ? "bg-purple-600 text-white" : "text-gray-700 hover:bg-gray-50"}`}
              aria-pressed={categoryView === "detailed"}
            >
              Detailed
            </button>
          </div>
        </div>

        {categoryView === "compact" ? (
          <div className="mb-8 overflow-x-auto pb-1">
            <div className="flex items-center gap-3">
              {topics.map((topic) => {
                const isSelected = selectedTopic === topic.id;
                const isLocked = !topic.isUnlocked;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    title={`${topic.title} • ${topic.overallProgress}%`}
                    onClick={() => {
                      if (!isLocked) setSelectedTopic(topic.id);
                    }}
                    className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${
                      isSelected
                        ? "border-purple-500 bg-purple-50 text-purple-800"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    } ${isLocked ? "cursor-not-allowed opacity-60" : ""}`}
                    aria-disabled={isLocked}
                  >
                    <span className="text-lg">{topic.icon}</span>
                    <span className="font-medium">{topic.title}</span>
                    <span className="ml-1 text-xs text-gray-500">
                      {topic.overallProgress}%
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <motion.div
                key={topic.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                className={`relative cursor-pointer rounded-2xl p-6 shadow-lg transition-all ${
                  selectedTopic === topic.id
                    ? "border-2 border-purple-500 bg-white shadow-xl"
                    : "border border-gray-200 bg-white/80 hover:shadow-xl"
                }`}
                onClick={() => setSelectedTopic(topic.id)}
              >
                {/* Locked badge */}
                {!topic.isUnlocked && (
                  <div className="absolute right-3 top-3 rounded-full bg-gray-900/80 px-2 py-1 text-xs font-semibold text-white shadow">
                    Locked
                  </div>
                )}
                <div className="mb-4 flex items-center space-x-3">
                  <div
                    className={`rounded-xl bg-gradient-to-r ${topic.color} p-3 text-white`}
                  >
                    <span className="text-2xl">{topic.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{topic.title}</h3>
                    <p className="text-sm text-gray-600">{topic.description}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-gray-800">
                      {topic.overallProgress}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${topic.color}`}
                      style={{ width: `${topic.overallProgress}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-blue-50 p-2 text-center">
                    <div className="font-bold text-blue-600">
                      {topic.completedLessons}/{topic.totalLessons}
                    </div>
                    <div className="text-blue-500">Lessons</div>
                  </div>
                  <div className="rounded-lg bg-green-50 p-2 text-center">
                    <div className="font-bold text-green-600">
                      {topic.completedChallenges}/{topic.totalChallenges}
                    </div>
                    <div className="text-green-500">Challenges</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Selected Topic Details */}
        {selectedTopicData && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-sm"
          >
            <div className="mb-8 flex items-center space-x-4">
              <div
                className={`rounded-xl bg-gradient-to-r ${selectedTopicData.color} p-4 text-white`}
              >
                <span className="text-3xl">{selectedTopicData.icon}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedTopicData.title}
                </h2>
                <p className="text-gray-600">{selectedTopicData.description}</p>
              </div>
            </div>

            {/* Lessons */}
            <div className="mb-8">
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h3 className="text-xl font-bold text-gray-900">📖 Lessons</h3>
                <div className="relative w-full md:w-80">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="text"
                    value={lessonSearch}
                    onChange={(e) => setLessonSearch(e.target.value)}
                    placeholder="Search lessons..."
                    className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Continue Learning card */}
              {continueLesson && (
                <div className="mb-6 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
                  <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
                    <div>
                      <p className="text-sm font-semibold text-indigo-700">
                        Continue Learning
                      </p>
                      <p className="text-base font-bold text-indigo-900">
                        {continueLesson.title}
                      </p>
                    </div>
                    <Link
                      href={`/learn/${continueLesson.slug}`}
                      className="inline-flex items-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-indigo-700 hover:to-purple-700"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Continue
                    </Link>
                  </div>
                </div>
              )}

              {/* Lessons List */}
              {filteredLessons.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-600">
                  No lessons match your search.
                </div>
              ) : (
                <div className="space-y-4">
                  {paginatedLessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 font-bold text-white">
                          {startIndex + index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {lesson.title}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {lesson.duration}m
                            </div>
                            <div className="flex items-center">
                              <BookOpen className="mr-1 h-3 w-3" />
                              {lesson.relatedChallenges.length} challenges
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {lesson.isCompleted && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        <Link
                          href={`/learn/${lesson.slug}`}
                          className="flex items-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white transition-all hover:from-purple-700 hover:to-blue-700"
                        >
                          <BookOpen className="mr-2 h-4 w-4" />
                          {lesson.isCompleted ? "Review" : "Start Lesson"}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {filteredLessons.length > 0 && totalPages > 1 && (
                <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1}–{endIndex} of{" "}
                    {filteredLessons.length} lessons
                  </div>
                  <nav
                    className="inline-flex items-center gap-1"
                    aria-label="Pagination"
                  >
                    <button
                      type="button"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className={`rounded-md border px-3 py-1 text-sm ${page === 1 ? "cursor-not-allowed opacity-50" : "bg-white hover:bg-gray-50"}`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPage(p)}
                          aria-current={p === page ? "page" : undefined}
                          className={`h-9 w-9 rounded-md border text-sm font-medium ${p === page ? "border-purple-600 bg-purple-600 text-white" : "bg-white hover:bg-gray-50"}`}
                        >
                          {p}
                        </button>
                      )
                    )}
                    <button
                      type="button"
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className={`rounded-md border px-3 py-1 text-sm ${page === totalPages ? "cursor-not-allowed opacity-50" : "bg-white hover:bg-gray-50"}`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </div>

            {/* Quick Access to Challenges */}
            <div className="rounded-xl bg-gradient-to-r from-green-50 to-blue-50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Ready to Practice?
                  </h3>
                  <p className="text-gray-600">
                    Jump into {selectedTopicData.totalChallenges} hands-on
                    coding challenges
                  </p>
                </div>
                <Link
                  href={`/code-arena?category=${selectedTopicData.id}`}
                  className="flex items-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 text-white transition-all hover:from-green-600 hover:to-emerald-600"
                >
                  <Code className="mr-2 h-5 w-5" />
                  Go to Code Arena
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
