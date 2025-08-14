"use client";

import { useState, useEffect } from "react";
import {
  BookOpen,
  Code,
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
print(f"Maximum: {result}")  # Maximum: 9
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
    ],
  },
};

export default function LearnPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(
    "Python Fundamentals"
  );
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    loadTopicsAndProgress();
  }, []);

  const loadTopicsAndProgress = async () => {
    try {
      setLoading(true);

      // Load challenges from code arena API
      const response = await fetch("/api/code-arena?limit=100");
      if (response.ok) {
        const data = await response.json();

        // Group challenges by category
        const challengesByCategory: { [key: string]: Challenge[] } = {};
        data.activities.forEach((activity: any) => {
          if (!challengesByCategory[activity.category]) {
            challengesByCategory[activity.category] = [];
          }
          challengesByCategory[activity.category].push({
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

        // Create topics with lessons and challenges
        const topicsData: Topic[] = Object.entries(topicConfig).map(
          ([topicName, config]) => {
            const challenges = challengesByCategory[topicName] || [];
            const completedChallenges = challenges.filter(
              (c) => c.isCompleted
            ).length;

            // Create lessons with related challenges
            const lessons: Lesson[] = config.lessons.map(
              (lessonData, index) => ({
                id: `${topicName}-lesson-${index}`,
                title: lessonData.title,
                slug: lessonData.slug,
                description: `Learn ${lessonData.title.toLowerCase()} concepts and fundamentals`,
                content: lessonData.content,
                difficulty: Math.ceil((index + 1) / 3), // 1-3 based on position
                duration: 15 + index * 5, // 15-45 minutes
                category: topicName,
                diamondReward: 20 + index * 10,
                experienceReward: 50 + index * 25,
                isCompleted: false, // TODO: Implement lesson completion tracking
                relatedChallenges: challenges.filter((c) =>
                  lessonData.relatedChallenges.some((title) =>
                    c.title.includes(title)
                  )
                ),
              })
            );

            return {
              id: topicName,
              title: topicName,
              description: config.description,
              icon: config.icon,
              color: config.color,
              gradient: config.gradient,
              lessons,
              challenges,
              totalLessons: lessons.length,
              completedLessons: lessons.filter((l) => l.isCompleted).length,
              totalChallenges: challenges.length,
              completedChallenges,
              overallProgress:
                Math.round(
                  ((lessons.filter((l) => l.isCompleted).length +
                    completedChallenges) /
                    (lessons.length + challenges.length)) *
                    100
                ) || 0,
              isUnlocked:
                topicName === "Python Fundamentals" || completedChallenges > 0,
            };
          }
        );

        setTopics(topicsData);
      }
    } catch (error) {
      console.error("Failed to load topics:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedTopicData = topics.find((t) => t.id === selectedTopic);

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
                    {selectedLesson.diamondReward}
                  </div>
                  <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 text-purple-500" />
                    {selectedLesson.experienceReward} XP
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
            <div className="prose prose-lg max-w-none p-8">
              <div
                dangerouslySetInnerHTML={{
                  __html: selectedLesson.content
                    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
                    .replace(/```[\s\S]*?```/g, (match) => {
                      const codeContent = match.slice(3, -3).trim();
                      return `<pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto my-4"><code>${codeContent}</code></pre>`;
                    })
                    .replace(
                      /`([^`]+)`/g,
                      '<code class="bg-gray-100 px-2 py-1 rounded text-sm">$1</code>'
                    )
                    .replace(
                      /^### (.*$)/gm,
                      '<h3 class="text-xl font-bold text-gray-800 mt-6 mb-3">$1</h3>'
                    )
                    .replace(
                      /^## (.*$)/gm,
                      '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h2>'
                    )
                    .replace(
                      /^# (.*$)/gm,
                      '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-6">$1</h1>'
                    )
                    .replace(/\n/g, "<br />"),
                }}
              />
            </div>
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

        {/* Topic Selection */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <motion.div
              key={topic.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.02 }}
              className={`cursor-pointer rounded-2xl p-6 shadow-lg transition-all ${
                selectedTopic === topic.id
                  ? "border-2 border-purple-500 bg-white shadow-xl"
                  : "border border-gray-200 bg-white/80 hover:shadow-xl"
              }`}
              onClick={() => setSelectedTopic(topic.id)}
            >
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
              <h3 className="mb-6 text-xl font-bold text-gray-900">
                📖 Lessons
              </h3>
              <div className="space-y-4">
                {selectedTopicData.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 font-bold text-white">
                        {index + 1}
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
                      <button
                        onClick={() => handleStartLesson(lesson)}
                        className="flex items-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-white transition-all hover:from-purple-700 hover:to-blue-700"
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        {lesson.isCompleted ? "Review" : "Start Lesson"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
