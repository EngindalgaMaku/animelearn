// Comprehensive Python Introduction Lesson Content
const comprehensiveLessonContent = {
  title: "Introduction to Python Programming - Complete Guide",
  description: "Master Python fundamentals from scratch! Learn variables, data types, basic operations, and write your first programs in this comprehensive introduction to Python programming.",
  
  // Introduction Section - Detailed overview
  introduction: `<h3>🌟 Welcome to Python Programming!</h3>

<p><strong>Congratulations on starting your Python journey!</strong> You're about to learn one of the world's most popular and powerful programming languages.</p>

<h4>🎯 What You'll Master in This Lesson:</h4>
<ul>
<li><strong>Python Fundamentals:</strong> What Python is and why it's so popular</li>
<li><strong>Basic Syntax:</strong> How to write clean, readable Python code</li>
<li><strong>Variables & Data Types:</strong> Storing and working with different types of data</li>
<li><strong>Input/Output:</strong> Getting user input and displaying results</li>
<li><strong>Basic Operations:</strong> Math operations, string manipulation</li>
<li><strong>Your First Programs:</strong> Write practical Python applications</li>
</ul>

<h4>🐍 Why Python?</h4>
<p>Python is used by millions of developers worldwide because it's:</p>
<ul>
<li><strong>Easy to Learn:</strong> Clear, readable syntax that's close to English</li>
<li><strong>Powerful:</strong> Used in web development, AI, data science, automation</li>
<li><strong>Versatile:</strong> From simple scripts to complex applications</li>
<li><strong>In-Demand:</strong> Top 3 most popular programming languages</li>
</ul>

<h4>🏢 Where Python is Used:</h4>
<ul>
<li><strong>Google:</strong> YouTube, Google Search algorithms</li>
<li><strong>Netflix:</strong> Recommendation systems and data analysis</li>
<li><strong>Instagram:</strong> Backend services handling millions of users</li>
<li><strong>NASA:</strong> Space mission planning and data analysis</li>
<li><strong>Spotify:</strong> Music recommendation algorithms</li>
</ul>

<h4>🕰️ Brief History of Python</h4>
<p>Python was created in 1989 by <strong>Guido van Rossum</strong> in the Netherlands. Named after the British comedy group "Monty Python," it was designed to be fun to use and easy to read.</p>

<h4>⭐ The Zen of Python - Core Philosophy:</h4>
<ul>
<li>Beautiful is better than ugly</li>
<li>Simple is better than complex</li>
<li>Readability counts</li>
<li>There should be one obvious way to do it</li>
</ul>`,

  // Syntax Section - Comprehensive syntax guide
  syntax: `<h3>📝 Python Syntax Fundamentals</h3>

<h4>🔧 Basic Python Rules</h4>
<p>Python has simple rules that make it easy to read and write:</p>

<h5>1. Indentation is Important</h5>
<p>Python uses indentation (spaces) to group code blocks:</p>

\`\`\`python
# Correct indentation
if 5 > 3:
    print("Five is greater than three!")
    print("This is also part of the if statement")

# This would cause an error - no indentation
if 5 > 3:
print("This would cause an error!")
\`\`\`

<h5>2. Case Sensitivity</h5>
<p>Python distinguishes between uppercase and lowercase:</p>

\`\`\`python
name = "Alice"
Name = "Bob"
NAME = "Charlie"
# These are three different variables!
\`\`\`

<h5>3. Comments</h5>
<p>Use # for comments to explain your code:</p>

\`\`\`python
# This is a comment
print("Hello, World!")  # This is also a comment
\`\`\`

<h4>📦 Variables and Data Types</h4>

<h5>Variables</h5>
<p>Variables are containers for storing data:</p>

\`\`\`python
# Creating variables
name = "John"
age = 25
height = 5.9
is_student = True
\`\`\`

<h5>Data Types</h5>

<p><strong>1. Strings (text):</strong></p>
\`\`\`python
first_name = "Alice"
last_name = 'Smith'  # Single or double quotes work
full_name = first_name + " " + last_name
print(full_name)  # Output: Alice Smith
\`\`\`

<p><strong>2. Numbers:</strong></p>
\`\`\`python
# Integers (whole numbers)
age = 25
year = 2024

# Floats (decimal numbers)
price = 19.99
temperature = 36.5
\`\`\`

<p><strong>3. Booleans (True/False):</strong></p>
\`\`\`python
is_sunny = True
is_raining = False
\`\`\`

<p><strong>4. Lists (collections):</strong></p>
\`\`\`python
colors = ["red", "green", "blue"]
numbers = [1, 2, 3, 4, 5]
mixed = ["Alice", 25, True, 5.9]
\`\`\`

<h4>🔤 String Operations</h4>

\`\`\`python
# String formatting
name = "Alice"
age = 25
message = f"Hello, I'm {name} and I'm {age} years old"
print(message)

# String methods
text = "python programming"
print(text.upper())      # PYTHON PROGRAMMING
print(text.capitalize()) # Python programming
print(text.replace("python", "Python"))  # Python programming
\`\`\`

<h4>🧮 Math Operations</h4>

\`\`\`python
# Basic operations
a = 10
b = 3

print(a + b)    # Addition: 13
print(a - b)    # Subtraction: 7
print(a * b)    # Multiplication: 30
print(a / b)    # Division: 3.333...
print(a // b)   # Floor division: 3
print(a % b)    # Modulus (remainder): 1
print(a ** b)   # Exponentiation: 1000
\`\`\`

<h4>📥 Input and Output</h4>

\`\`\`python
# Getting user input
name = input("What's your name? ")
print(f"Hello, {name}!")

# Converting input to numbers
age = int(input("How old are you? "))
height = float(input("How tall are you? "))
\`\`\``,

  // Examples Section - Practical examples
  examples: `<h3>💡 Practical Python Examples</h3>

<h4>🎯 Example 1: Personal Information Program</h4>

\`\`\`python
# Personal Information Collector
print("=== Personal Information ===")

# Get user input
first_name = input("Enter your first name: ")
last_name = input("Enter your last name: ")
age = int(input("Enter your age: "))
city = input("Enter your city: ")

# Process the information
full_name = first_name + " " + last_name
birth_year = 2024 - age

# Display results
print("\\n--- Your Information ---")
print(f"Full Name: {full_name}")
print(f"Age: {age} years old")
print(f"Birth Year: {birth_year}")
print(f"City: {city}")
print(f"Welcome to Python, {first_name}!")
\`\`\`

<h4>🧮 Example 2: Simple Calculator</h4>

\`\`\`python
# Simple Calculator
print("=== Python Calculator ===")

# Get numbers from user
num1 = float(input("Enter first number: "))
num2 = float(input("Enter second number: "))

# Perform calculations
addition = num1 + num2
subtraction = num1 - num2
multiplication = num1 * num2
division = num1 / num2

# Display results
print(f"\\n--- Results ---")
print(f"{num1} + {num2} = {addition}")
print(f"{num1} - {num2} = {subtraction}")
print(f"{num1} × {num2} = {multiplication}")
print(f"{num1} ÷ {num2} = {division:.2f}")
\`\`\`

<h4>🍕 Example 3: Pizza Order System</h4>

\`\`\`python
# Pizza Order Calculator
print("🍕 Welcome to Python Pizza!")

# Menu prices
small_pizza = 12.99
medium_pizza = 15.99
large_pizza = 18.99
extra_cheese = 2.50
pepperoni = 3.00

# Get order
print("\\nPizza Sizes:")
print(f"Small: ${small_pizza}")
print(f"Medium: ${medium_pizza}")
print(f"Large: ${large_pizza}")

size = input("\\nChoose size (small/medium/large): ").lower()
want_cheese = input("Extra cheese? (yes/no): ").lower()
want_pepperoni = input("Pepperoni? (yes/no): ").lower()

# Calculate price
if size == "small":
    base_price = small_pizza
elif size == "medium":
    base_price = medium_pizza
else:
    base_price = large_pizza

total = base_price
toppings = []

if want_cheese == "yes":
    total += extra_cheese
    toppings.append("Extra cheese")

if want_pepperoni == "yes":
    total += pepperoni
    toppings.append("Pepperoni")

# Display order
print(f"\\n--- Your Order ---")
print(f"Size: {size.capitalize()} pizza")
if toppings:
    print(f"Toppings: {', '.join(toppings)}")
print(f"Total: ${total:.2f}")
print("Thank you for your order! 🍕")
\`\`\`

<h4>🎮 Example 4: Number Guessing Game</h4>

\`\`\`python
# Number Guessing Game
import random

print("🎮 Number Guessing Game!")
print("I'm thinking of a number between 1 and 10")

# Generate random number
secret_number = random.randint(1, 10)
max_attempts = 3
attempts = 0

while attempts < max_attempts:
    attempts += 1
    guess = int(input(f"\\nAttempt {attempts}: Enter your guess: "))
    
    if guess == secret_number:
        print(f"🎉 Congratulations! You guessed it in {attempts} attempts!")
        break
    elif guess < secret_number:
        print("📈 Too low!")
    else:
        print("📉 Too high!")
    
    if attempts == max_attempts:
        print(f"\\n😔 Game over! The number was {secret_number}")
\`\`\`

<h4>💰 Example 5: Grade Calculator</h4>

\`\`\`python
# Student Grade Calculator
print("📚 Grade Calculator")

# Get student information
student_name = input("Enter student name: ")
subject = input("Enter subject: ")

# Get grades
print("\\nEnter your test scores:")
test1 = float(input("Test 1 score: "))
test2 = float(input("Test 2 score: "))
test3 = float(input("Test 3 score: "))
homework = float(input("Homework average: "))

# Calculate final grade
# Tests are 60%, homework is 40%
final_grade = (test1 + test2 + test3) / 3 * 0.6 + homework * 0.4

# Determine letter grade
if final_grade >= 90:
    letter_grade = "A"
elif final_grade >= 80:
    letter_grade = "B"
elif final_grade >= 70:
    letter_grade = "C"
elif final_grade >= 60:
    letter_grade = "D"
else:
    letter_grade = "F"

# Display results
print(f"\\n--- Grade Report ---")
print(f"Student: {student_name}")
print(f"Subject: {subject}")
print(f"Test Scores: {test1}, {test2}, {test3}")
print(f"Homework Average: {homework}")
print(f"Final Grade: {final_grade:.1f}% ({letter_grade})")

if letter_grade in ["A", "B"]:
    print("🎉 Excellent work!")
elif letter_grade == "C":
    print("👍 Good job!")
else:
    print("📚 Keep studying!")
\`\`\`

<h4>🏃‍♂️ Practice Exercises</h4>
<p>Try modifying these examples:</p>
<ul>
<li>Add more pizza toppings to the pizza calculator</li>
<li>Make the guessing game use numbers 1-100</li>
<li>Add more subjects to the grade calculator</li>
<li>Create a temperature converter (Celsius to Fahrenheit)</li>
<li>Build a tip calculator for restaurants</li>
</ul>`,

  // Starter code for exercises
  starterCode: `# Welcome to Python Programming!
# Let's start with the basics

# 1. Create variables for your information
name = "Your Name Here"
age = 0
city = "Your City"

# 2. Print a greeting message
print("Hello, Python World!")

# 3. Try basic math
num1 = 10
num2 = 5
result = num1 + num2
print(f"{num1} + {num2} = {result}")

# 4. Your turn! Create a simple program below:
# - Ask for user's name and age
# - Calculate birth year
# - Print a personalized message

# Write your code here:`,

  // Solution code
  solutionCode: `# Complete Python Introduction Solution
print("=== Python Programming Basics ===")

# 1. Personal Information Program
print("\\n1. Personal Information:")
name = input("Enter your name: ")
age = int(input("Enter your age: "))
city = input("Enter your city: ")

birth_year = 2024 - age
print(f"Hello {name}! You were born in {birth_year} and live in {city}.")

# 2. Simple Calculator
print("\\n2. Calculator:")
num1 = float(input("Enter first number: "))
num2 = float(input("Enter second number: "))

print(f"Addition: {num1} + {num2} = {num1 + num2}")
print(f"Subtraction: {num1} - {num2} = {num1 - num2}")
print(f"Multiplication: {num1} × {num2} = {num1 * num2}")
print(f"Division: {num1} ÷ {num2} = {num1 / num2:.2f}")

# 3. String Operations
print("\\n3. String Magic:")
text = input("Enter a sentence: ")
print(f"Uppercase: {text.upper()}")
print(f"Lowercase: {text.lower()}")
print(f"Word count: {len(text.split())} words")
print(f"Character count: {len(text)} characters")

# 4. List Operations
print("\\n4. Working with Lists:")
colors = ["red", "green", "blue", "yellow"]
print(f"Colors: {colors}")
print(f"First color: {colors[0]}")
print(f"Last color: {colors[-1]}")
colors.append("purple")
print(f"After adding purple: {colors}")

# 5. Conditional Logic
print("\\n5. Decision Making:")
score = int(input("Enter your test score (0-100): "))

if score >= 90:
    grade = "A"
    message = "Excellent!"
elif score >= 80:
    grade = "B"
    message = "Good job!"
elif score >= 70:
    grade = "C"
    message = "Average"
elif score >= 60:
    grade = "D"
    message = "Below average"
else:
    grade = "F"
    message = "Need improvement"

print(f"Your grade: {grade} - {message}")

print("\\n🎉 Congratulations! You've completed the Python basics!")`,

  hints: `💡 **Helpful Tips for Success:**

🔍 **Common Mistakes to Avoid:**
• Remember indentation is crucial in Python
• Use quotes around strings: "text" not text
• Convert input to numbers: int(input()) for whole numbers
• Check your spelling - Python is case-sensitive

🎯 **Best Practices:**
• Use descriptive variable names: age instead of a
• Add comments to explain your code
• Test your code with different inputs
• Keep your code organized and readable

📚 **Remember:**
• Variables store data: name = "Alice"
• Functions do actions: print(), input(), len()
• f-strings format text: f"Hello {name}!"
• Lists store multiple items: [1, 2, 3]

🚀 **Next Steps:**
After completing this lesson, you'll be ready to learn:
• Loops (for and while)
• Functions and modules
• File handling
• Error handling`
};

console.log("Comprehensive Python lesson content created!");
console.log("Use this content to update the lesson in Prisma Studio or admin panel.");