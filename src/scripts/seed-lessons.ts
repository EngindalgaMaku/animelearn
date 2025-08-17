import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const lessonsData = [
  {
    title: "Python Welcome - Complete Beginner's Journey",
    slug: "python-welcome",
    description:
      "A comprehensive introduction to Python programming language. Discover Python's history, ecosystem, applications, and master the fundamentals with hands-on examples. Perfect for absolute beginners starting their coding adventure!",
    category: "Basics",
    difficulty: 1, // beginner
    order: 1,
    duration: 60,
    diamondReward: 500,
    experienceReward: 250,
    content: {
      introduction: `
        <h3>🐍 Welcome to the Amazing World of Python!</h3>
        <p>Congratulations on starting your programming journey! Python is not just a programming language—it's your gateway to creating amazing applications, solving real-world problems, and building the future of technology.</p>
        
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h4>🚀 What Makes Python Special?</h4>
          <p>Python was created by Guido van Rossum in 1991 with a simple philosophy: <strong>"Code should be beautiful and readable"</strong>. Today, Python powers everything from Instagram to NASA's space missions!</p>
        </div>
        
        <h4>🌟 Why Choose Python? (The Real Benefits)</h4>
        <ul>
          <li><strong>🎯 Beginner-Friendly:</strong> Python reads almost like English! No confusing symbols or complex syntax</li>
          <li><strong>💼 Career Powerhouse:</strong> Python developers earn $95,000+ annually on average</li>
          <li><strong>🌍 Versatile Applications:</strong> Web development, AI/ML, data science, automation, game development</li>
          <li><strong>📚 Massive Ecosystem:</strong> 300,000+ packages available for any project you can imagine</li>
          <li><strong>🤝 Amazing Community:</strong> Millions of developers worldwide ready to help</li>
          <li><strong>🏢 Industry Adoption:</strong> Used by Google, Netflix, Spotify, Instagram, Dropbox, and more</li>
        </ul>
        
        <h4>🎮 Real-World Python Applications</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0;">
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff;">
            <strong>🤖 Artificial Intelligence & Machine Learning</strong>
            <p>TensorFlow, PyTorch, scikit-learn - Build smart applications that learn and adapt</p>
          </div>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #28a745;">
            <strong>🌐 Web Development</strong>
            <p>Django, Flask, FastAPI - Create powerful websites and APIs used by millions</p>
          </div>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <strong>📊 Data Science & Analytics</strong>
            <p>Pandas, NumPy, Matplotlib - Analyze big data and create stunning visualizations</p>
          </div>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #dc3545;">
            <strong>🔧 Automation & Scripting</strong>
            <p>Automate repetitive tasks, web scraping, system administration</p>
          </div>
        </div>
        
        <h4>🧘‍♂️ The Zen of Python (Programming Philosophy)</h4>
        <div style="background: #e3f2fd; padding: 20px; border-radius: 10px; font-family: monospace;">
          <p><em>"Beautiful is better than ugly."</em></p>
          <p><em>"Explicit is better than implicit."</em></p>
          <p><em>"Simple is better than complex."</em></p>
          <p><em>"Readability counts."</em></p>
          <p><em>"There should be one obvious way to do it."</em></p>
        </div>
        
        <h4>🎯 What You'll Master in This Lesson</h4>
        <ul>
          <li>🐍 Python's history and why it's dominating the tech world</li>
          <li>💻 Setting up your first Python environment</li>
          <li>📝 Writing your first programs that actually do something useful</li>
          <li>🎨 Python's beautiful syntax and coding best practices</li>
          <li>🚀 Interactive programming and user engagement</li>
          <li>🧪 Testing and debugging your code like a pro</li>
        </ul>
      `,
      syntax: `
        <h3>🎨 Python Syntax: Beautiful Code Made Simple</h3>
        <p>Python's syntax is designed to be intuitive and readable. Unlike other languages with lots of brackets and semicolons, Python uses <strong>indentation</strong> to structure code, making it visually clear and organized.</p>
        
        <h4>🔑 Essential Syntax Rules (Master These First!)</h4>
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 15px 0;">
          <ul>
            <li><strong>Indentation:</strong> Use exactly 4 spaces (never tabs!) to group code blocks</li>
            <li><strong>Case Sensitivity:</strong> 'Name' and 'name' are completely different variables</li>
            <li><strong>Comments:</strong> Use # for single-line comments, """ for multi-line</li>
            <li><strong>Line Endings:</strong> No semicolons needed - Python knows where statements end</li>
            <li><strong>Variables:</strong> No need to declare types - Python figures it out automatically!</li>
          </ul>
        </div>
        
        <h4>🏗️ Code Structure Fundamentals</h4>
        <pre><code># Single-line comment - explains what's happening
"""
Multi-line comment
Perfect for detailed explanations
or documentation
"""

# Variables - containers for your data
name = "Python Ninja"        # String (text)
age = 25                     # Integer (whole number)
height = 5.9                 # Float (decimal number)
is_programmer = True         # Boolean (True/False)
favorite_colors = ["blue", "green", "red"]  # List

# Functions - reusable blocks of code
def greet_user(user_name):
    """This function greets a user with their name"""
    return f"Hello, {user_name}! Welcome to Python!"

# Using the function
message = greet_user(name)
print(message)</code></pre>
        
        <h4>🎯 Indentation: Python's Superpower</h4>
        <p>While other languages use curly braces {}, Python uses indentation to group code. This makes your code naturally organized and readable!</p>
        
        <pre><code># Correct indentation ✅
if age >= 18:
    print("You're an adult!")
    print("You can vote!")
    if age >= 21:
        print("You can also drink in the US!")
else:
    print("You're still young!")
    print("Enjoy your youth!")

# Wrong indentation ❌ - This will cause an error!
if age >= 18:
print("This is wrong!")  # Missing indentation
    print("This is also wrong!")  # Inconsistent indentation</code></pre>
        
        <h4>💬 Comments: Your Code's Best Friend</h4>
        <pre><code># This is a single-line comment
print("Hello, World!")  # You can also comment at the end of lines

"""
This is a multi-line comment (docstring)
Use it for longer explanations
or function/class documentation
"""

def calculate_area(radius):
    """
    Calculate the area of a circle.
    
    Args:
        radius (float): The radius of the circle
        
    Returns:
        float: The area of the circle
    """
    import math
    return math.pi * radius ** 2</code></pre>
        
        <h4>🔤 Naming Conventions (Professional Standards)</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div style="background: #d4edda; padding: 15px; border-radius: 8px;">
            <strong>✅ Good Variable Names</strong>
            <pre><code>user_name
total_score
is_game_over
MAX_PLAYERS = 10
player_count</code></pre>
          </div>
          <div style="background: #f8d7da; padding: 15px; border-radius: 8px;">
            <strong>❌ Bad Variable Names</strong>
            <pre><code>x
data
temp
n
userName (camelCase)
TOTAL-SCORE (hyphens)</code></pre>
          </div>
        </div>
      `,
      examples: `
        <h3>🚀 Hands-On Python Examples: From Zero to Hero</h3>
        <p>Let's build some real programs! Each example teaches you practical skills you'll use in every Python project.</p>
        
        <h4>🌟 Example 1: Interactive Welcome Program</h4>
        <pre><code># A professional welcome program
print("=" * 50)
print("🐍 WELCOME TO PYTHON PROGRAMMING! 🐍")
print("=" * 50)

# Get user information
name = input("What's your name, future programmer? ")
experience = input("Are you new to programming? (yes/no): ").lower()

# Personalized responses
if experience == "yes":
    print(f"\nAwesome, {name}! You've chosen the perfect language to start with.")
    print("Python will be your friendly companion on this coding journey! 🚀")
else:
    print(f"\nGreat to have you here, {name}! You'll love Python's simplicity.")
    print("Get ready to be amazed by what you can build! 💻")

print(f"\nLet's begin your adventure, {name}! 🎮")</code></pre>
        
        <h4>🧮 Example 2: Smart Calculator with Error Handling</h4>
        <pre><code># Professional calculator with user-friendly features
print("🧮 PYTHON SMART CALCULATOR 🧮")
print("-" * 30)

try:
    # Get numbers from user
    num1 = float(input("Enter first number: "))
    operator = input("Choose operation (+, -, *, /): ")
    num2 = float(input("Enter second number: "))
    
    # Perform calculation
    if operator == "+":
        result = num1 + num2
        operation = "addition"
    elif operator == "-":
        result = num1 - num2
        operation = "subtraction"
    elif operator == "*":
        result = num1 * num2
        operation = "multiplication"
    elif operator == "/":
        if num2 != 0:
            result = num1 / num2
            operation = "division"
        else:
            print("❌ Error: Cannot divide by zero!")
            exit()
    else:
        print("❌ Error: Invalid operator!")
        exit()
    
    # Display result beautifully
    print(f"\n✨ Result of {operation}:")
    print(f"📊 {num1} {operator} {num2} = {result:.2f}")
    print("🎉 Calculation completed successfully!")
    
except ValueError:
    print("❌ Error: Please enter valid numbers!")
except Exception as e:
    print(f"❌ Unexpected error: {e}")</code></pre>
        
        <h4>🎲 Example 3: Fun Number Guessing Game</h4>
        <pre><code>import random

# Fun number guessing game
print("🎲 PYTHON NUMBER GUESSING GAME 🎲")
print("I'm thinking of a number between 1 and 100...")

# Generate random number
secret_number = random.randint(1, 100)
attempts = 0
max_attempts = 7

print(f"You have {max_attempts} attempts to guess it!")
print("💡 Hint: I'll tell you if your guess is too high or too low.")

while attempts < max_attempts:
    try:
        guess = int(input(f"\nAttempt {attempts + 1}: Enter your guess: "))
        attempts += 1
        
        if guess == secret_number:
            print(f"🎉 CONGRATULATIONS! You guessed it in {attempts} attempts!")
            print(f"🏆 The number was indeed {secret_number}!")
            break
        elif guess < secret_number:
            remaining = max_attempts - attempts
            print(f"📈 Too low! Try a higher number. ({remaining} attempts left)")
        else:
            remaining = max_attempts - attempts
            print(f"📉 Too high! Try a lower number. ({remaining} attempts left)")
            
        if attempts == max_attempts:
            print(f"\n💔 Game over! The number was {secret_number}")
            print("🔄 Don't worry, practice makes perfect!")
            
    except ValueError:
        print("❌ Please enter a valid number!")</code></pre>
        
        <h4>📊 Example 4: Personal Information Manager</h4>
        <pre><code># Professional data collection and display
print("📋 PERSONAL PROFILE CREATOR 📋")
print("Let's create your programmer profile!")

# Collect comprehensive information
profile = {}
profile['name'] = input("\n👤 Full Name: ")
profile['age'] = int(input("🎂 Age: "))
profile['city'] = input("🏙️ City: ")
profile['hobby'] = input("🎮 Favorite Hobby: ")
profile['goal'] = input("🎯 Programming Goal: ")

# Calculate some fun facts
birth_year = 2024 - profile['age']
years_to_30 = max(0, 30 - profile['age'])

# Display beautiful profile
print("\n" + "=" * 50)
print("🌟 YOUR AWESOME PROGRAMMER PROFILE 🌟")
print("=" * 50)
print(f"Name: {profile['name']}")
print(f"Age: {profile['age']} years old")
print(f"Born in: {birth_year}")
print(f"Location: {profile['city']}")
print(f"Hobby: {profile['hobby']}")
print(f"Goal: {profile['goal']}")

if years_to_30 > 0:
    print(f"Fun fact: You'll be 30 in {years_to_30} years!")
else:
    print("Fun fact: You're already 30 or older - wisdom level unlocked! 🧙‍♂️")

print("\n🚀 Ready to start your Python journey? Let's code!")
print("=" * 50)</code></pre>
        
        <h4>🎨 Example 5: ASCII Art Generator</h4>
        <pre><code># Create beautiful text art
def create_banner(text, char="="):
    """Create a beautiful banner with any text"""
    length = len(text) + 4
    border = char * length
    
    print(border)
    print(f"{char} {text} {char}")
    print(border)

def create_box(text):
    """Create a nice box around text"""
    lines = text.split('\n')
    max_length = max(len(line) for line in lines)
    
    print("┌" + "─" * (max_length + 2) + "┐")
    for line in lines:
        print(f"│ {line:<{max_length}} │")
    print("└" + "─" * (max_length + 2) + "┘")

# Demonstrate the functions
create_banner("WELCOME TO PYTHON", "🌟")
print()

message = """Python is awesome!
You're doing great!
Keep coding! 💻"""

create_box(message)

# Simple pattern generator
print("\n🎨 Pattern Generator:")
size = 5
for i in range(size):
    spaces = " " * (size - i - 1)
    stars = "⭐" * (2 * i + 1)
    print(spaces + stars)</code></pre>
      `,
    },
    starterCode: `# 🐍 Welcome to Python Programming! 🐍
# Your mission: Create an amazing interactive program

# Part 1: Display a welcoming banner
print("=" * 40)
print("🚀 MY FIRST PYTHON PROGRAM 🚀")
print("=" * 40)

# Part 2: Get user information
name = input("What's your name? ")
age = # TODO: Ask for user's age and convert to integer

# Part 3: Calculate something interesting
birth_year = 2024 - age
future_age = age + 10

# Part 4: Display personalized information
print(f"\\nHello, {name}! 👋")
print(f"You are {age} years old")
print(f"You were born in {birth_year}")
print(f"In 10 years, you'll be {future_age} years old!")

# Part 5: Add some fun facts
if age < 18:
    print("🎓 You're young and full of potential!")
elif age < 30:
    print("💪 You're in your prime learning years!")
else:
    print("🧠 Experience and wisdom are your superpowers!")

# Part 6: Encourage the user
print("\\n🌟 Fun fact: You're now a Python programmer!")
print("🎮 Ready to level up your coding skills?")

# TODO: Add a simple calculation or question for the user
# Example: Ask for their favorite number and do math with it`,
    solutionCode: `# 🐍 Welcome to Python Programming! 🐍
# Your mission: Create an amazing interactive program

# Part 1: Display a welcoming banner
print("=" * 40)
print("🚀 MY FIRST PYTHON PROGRAM 🚀")
print("=" * 40)

# Part 2: Get user information
name = input("What's your name? ")
age = int(input("How old are you? "))

# Part 3: Calculate something interesting
birth_year = 2024 - age
future_age = age + 10

# Part 4: Display personalized information
print(f"\\nHello, {name}! 👋")
print(f"You are {age} years old")
print(f"You were born in {birth_year}")
print(f"In 10 years, you'll be {future_age} years old!")

# Part 5: Add some fun facts
if age < 18:
    print("🎓 You're young and full of potential!")
elif age < 30:
    print("💪 You're in your prime learning years!")
else:
    print("🧠 Experience and wisdom are your superpowers!")

# Part 6: Encourage the user
print("\\n🌟 Fun fact: You're now a Python programmer!")
print("🎮 Ready to level up your coding skills?")

# Bonus: Interactive math
favorite_number = int(input("\\nWhat's your favorite number? "))
magic_result = (favorite_number * 2 + 10) // 2 - favorite_number
print(f"✨ Magic! Your number {favorite_number} + some magic = {magic_result + favorite_number}")
print("🎭 Actually, I just added 5 to your number! Python is fun! 😄")`,
    testCases: [
      {
        input: "Alice\\n25\\n7",
        expectedOutput:
          "Hello, Alice! 👋\\nYou are 25 years old\\nYou were born in 1999",
        description: "Create personalized greeting with age calculations",
      },
      {
        input: "Bob\\n16\\n3",
        expectedOutput: "🎓 You're young and full of potential!",
        description: "Display appropriate message for young users",
      },
      {
        input: "Carol\\n35\\n9",
        expectedOutput: "🧠 Experience and wisdom are your superpowers!",
        description: "Display appropriate message for experienced users",
      },
    ],
    hints: [
      "🎯 Use int() to convert string input to numbers: age = int(input('Age: '))",
      "🎨 Use f-strings for beautiful output: f'Hello, {name}!'",
      "🔢 Calculate birth year: current_year - age",
      "🎮 Use if/elif/else for different age categories",
      "✨ Add emojis to make your output more engaging!",
      "🧮 Try mathematical operations: +, -, *, /, // (integer division)",
      "💡 Use \\n for new lines in strings",
      "🎭 Make it interactive - ask questions and respond to answers!",
    ],
    quiz: {
      title: "Python Welcome Quiz",
      description: "Test your understanding of Python basics!",
      questions: [
        {
          id: "q1",
          question:
            "What makes Python special compared to other programming languages?",
          type: "multiple_choice",
          options: [
            "It's the fastest programming language",
            "It emphasizes code readability and simplicity",
            "It can only be used for web development",
            "It requires complex syntax",
          ],
          correctAnswer: "It emphasizes code readability and simplicity",
          explanation:
            "Python was designed with the philosophy that code should be beautiful and readable, making it perfect for beginners.",
          points: 10,
        },
        {
          id: "q2",
          question: "Python uses indentation to define code blocks.",
          type: "true_false",
          correctAnswer: "true",
          explanation:
            "Unlike many other languages that use curly braces {}, Python uses indentation (4 spaces) to group code blocks.",
          points: 10,
        },
        {
          id: "q3",
          question:
            "Which of these is the correct way to create a comment in Python?",
          type: "multiple_choice",
          options: [
            "// This is a comment",
            "# This is a comment",
            "/* This is a comment */",
            "<!-- This is a comment -->",
          ],
          correctAnswer: "# This is a comment",
          explanation: "Python uses the # symbol for single-line comments.",
          points: 10,
        },
        {
          id: "q4",
          question:
            "Python automatically detects variable types without explicit declaration.",
          type: "true_false",
          correctAnswer: "true",
          explanation:
            "Python is dynamically typed, meaning you don't need to declare variable types explicitly. Python figures it out automatically.",
          points: 10,
        },
        {
          id: "q5",
          question: "What will this code output: print('Hello, World!')",
          type: "multiple_choice",
          options: [
            "Hello, World!",
            "'Hello, World!'",
            "print('Hello, World!')",
            "Error",
          ],
          correctAnswer: "Hello, World!",
          explanation:
            "The print() function displays the text without the quotation marks.",
          points: 10,
        },
      ],
      timeLimit: 10,
      passingScore: 70,
      diamondReward: 250,
      experienceReward: 200,
    },
  },
  {
    title: "Variables and Data Types",
    slug: "variables-data-types",
    description:
      "Learn about Python variables, different data types, and how to work with them.",
    category: "Basics",
    difficulty: 1, // beginner
    order: 2,
    duration: 45,
    diamondReward: 300,
    experienceReward: 150,
    content: {
      introduction: `
        <h3>Understanding Variables</h3>
        <p>Variables are containers that store data values. In Python, you don't need to declare variable types explicitly - Python figures it out automatically!</p>
        
        <h4>What You'll Learn:</h4>
        <ul>
          <li>How to create and use variables</li>
          <li>Different data types in Python</li>
          <li>Type conversion</li>
          <li>Variable naming rules</li>
        </ul>
        
        <h4>Variable Naming Rules:</h4>
        <ul>
          <li>Must start with a letter or underscore</li>
          <li>Can contain letters, numbers, and underscores</li>
          <li>Case-sensitive (age and Age are different)</li>
          <li>Cannot use Python keywords (if, for, while, etc.)</li>
        </ul>
      `,
      syntax: `
        <h3>Data Types in Python</h3>
        
        <h4>1. Numbers</h4>
        <pre><code># Integers (whole numbers)
age = 25
year = 2024

# Floats (decimal numbers)
price = 19.99
temperature = 36.6

# Complex numbers
complex_num = 3 + 4j</code></pre>
        
        <h4>2. Strings (Text)</h4>
        <pre><code># Single or double quotes
name = "Alice"
city = 'New York'
message = "Hello, World!"

# Multi-line strings
description = """This is a
multi-line
string"""</code></pre>
        
        <h4>3. Boolean (True/False)</h4>
        <pre><code>is_active = True
is_finished = False
has_permission = True</code></pre>
        
        <h4>4. Checking Types</h4>
        <pre><code>print(type(25))        # <class 'int'>
print(type(3.14))      # <class 'float'>
print(type("Hello"))   # <class 'str'>
print(type(True))      # <class 'bool'></code></pre>
      `,
      examples: `
        <h3>Working with Variables</h3>
        
        <h4>Example 1: Different Data Types</h4>
        <pre><code># Creating variables of different types
student_name = "Emma"
student_age = 20
student_grade = 85.5
is_enrolled = True

print("Name:", student_name)
print("Age:", student_age)
print("Grade:", student_grade)
print("Enrolled:", is_enrolled)</code></pre>
        
        <h4>Example 2: Type Conversion</h4>
        <pre><code># Converting between types
age_str = "25"
age_int = int(age_str)  # Convert string to integer
print("Age as string:", age_str)
print("Age as integer:", age_int)

# More conversions
price = 29.99
price_str = str(price)  # Convert float to string
price_int = int(price)  # Convert float to integer

print("Price as float:", price)
print("Price as string:", price_str)
print("Price as integer:", price_int)</code></pre>
        
        <h4>Example 3: Variable Operations</h4>
        <pre><code># Math with variables
length = 10
width = 5
area = length * width

print(f"Rectangle: {length} x {width}")
print(f"Area: {area}")

# String operations
first_name = "John"
last_name = "Doe"
full_name = first_name + " " + last_name
print("Full name:", full_name)</code></pre>
      `,
    },
    starterCode: `# Practice with variables and data types

# Create variables for a person
name = ""
age = 0
height = 0.0
is_student = False

# Print the information
# Your code here`,
    solutionCode: `# Practice with variables and data types

# Create variables for a person
name = "Alice"
age = 22
height = 5.6
is_student = True

# Print the information
print("Name:", name)
print("Age:", age)
print("Height:", height)
print("Is student:", is_student)
print("Type of name:", type(name))
print("Type of age:", type(age))`,
    testCases: [
      {
        input: "",
        expectedOutput: "Name: Alice\nAge: 22\nHeight: 5.6\nIs student: True",
        description: "Create and display person information",
      },
    ],
    hints: [
      "Assign meaningful values to each variable",
      "Use strings for text, integers for whole numbers, floats for decimals",
      "Boolean values are True or False (with capital letters)",
    ],
  },
  {
    title: "Basic Input and Output",
    slug: "input-output",
    description:
      "Learn how to get user input and display output in Python programs.",
    category: "Basics",
    difficulty: 1, // beginner
    order: 3,
    duration: 40,
    diamondReward: 275,
    experienceReward: 135,
    content: {
      introduction: `
        <h3>Communicating with Users</h3>
        <p>Every useful program needs to interact with users - getting input and showing output. Python makes this easy with built-in functions.</p>
        
        <h4>What You'll Learn:</h4>
        <ul>
          <li>How to display output with print()</li>
          <li>How to get user input with input()</li>
          <li>Formatting output nicely</li>
          <li>Converting input to different types</li>
        </ul>
        
        <h4>Why This Matters:</h4>
        <p>Input and output are fundamental to programming. Without them, your programs can't interact with users or show results!</p>
      `,
      syntax: `
        <h3>The print() Function</h3>
        
        <h4>Basic Printing</h4>
        <pre><code># Simple printing
print("Hello, World!")
print("Python is awesome!")

# Printing variables
name = "Alice"
age = 25
print(name)
print(age)</code></pre>
        
        <h4>Advanced Printing</h4>
        <pre><code># Multiple values
print("Name:", name, "Age:", age)

# Custom separator
print("Apple", "Banana", "Cherry", sep=", ")

# Custom end character
print("Loading", end="...")
print("Done!")

# F-strings (formatted strings)
print(f"My name is {name} and I'm {age} years old")</code></pre>
        
        <h3>The input() Function</h3>
        
        <h4>Getting User Input</h4>
        <pre><code># Basic input (always returns a string)
name = input("What's your name? ")
print("Hello,", name)

# Converting input to numbers
age = int(input("How old are you? "))
height = float(input("Your height in meters: "))

print(f"You are {age} years old and {height}m tall")</code></pre>
      `,
      examples: `
        <h3>Interactive Programs</h3>
        
        <h4>Example 1: Personal Information</h4>
        <pre><code># Getting user information
print("Welcome! Please tell us about yourself:")
name = input("Your name: ")
age = int(input("Your age: "))
city = input("Your city: ")

print(f"\nNice to meet you, {name}!")
print(f"You are {age} years old and live in {city}")
print("Thanks for sharing!")</code></pre>
        
        <h4>Example 2: Simple Calculator</h4>
        <pre><code># Basic math with user input
print("Simple Calculator")
print("-" * 16)

num1 = float(input("Enter first number: "))
num2 = float(input("Enter second number: "))

# Calculations
addition = num1 + num2
subtraction = num1 - num2
multiplication = num1 * num2
division = num1 / num2

# Display results
print(f"\nResults:")
print(f"{num1} + {num2} = {addition}")
print(f"{num1} - {num2} = {subtraction}")
print(f"{num1} * {num2} = {multiplication}")
print(f"{num1} / {num2} = {division:.2f}")</code></pre>
        
        <h4>Example 3: Mad Libs Game</h4>
        <pre><code># Fun word game
print("Let's create a silly story!")
noun = input("Enter a noun: ")
adjective = input("Enter an adjective: ")
verb = input("Enter a verb: ")
place = input("Enter a place: ")

story = f"""
Once upon a time, there was a {adjective} {noun}.
Every day, it would {verb} around {place}.
The end!
"""

print("\nHere's your silly story:")
print(story)</code></pre>
      `,
    },
    starterCode: `# Create an interactive program

# Get user information
print("Welcome to our program!")

# Get name and age from user
# Your code here

# Display a personalized message
# Your code here`,
    solutionCode: `# Create an interactive program

# Get user information
print("Welcome to our program!")

# Get name and age from user
name = input("What's your name? ")
age = int(input("How old are you? "))

# Display a personalized message
print(f"Hello {name}!")
print(f"Wow, {age} years old! That's awesome!")
print("Thanks for joining us!")`,
    testCases: [
      {
        input: "Alice\n25",
        expectedOutput:
          "Welcome to our program!\nHello Alice!\nWow, 25 years old! That's awesome!\nThanks for joining us!",
        description: "Interactive greeting program",
      },
    ],
    hints: [
      "Use input() to get text from the user",
      "Remember to convert input to int() for numbers",
      "Use f-strings for nice formatting: f'Hello {name}!'",
    ],
  },
];

async function seedLessons() {
  try {
    console.log("🌱 Starting lesson seeding...");

    for (const lessonData of lessonsData) {
      const payload = {
        title: lessonData.title,
        slug: lessonData.slug,
        description: lessonData.description,
        content: JSON.stringify({
          instructions: lessonData.description,
          starterCode: lessonData.starterCode,
          solutionCode: lessonData.solutionCode,
          testCases: lessonData.testCases,
          hints: lessonData.hints,
          ...lessonData.content,
          quiz: lessonData.quiz,
        }),
        activityType: "interactive_coding",
        category: lessonData.category,
        difficulty: lessonData.difficulty,
        diamondReward: lessonData.diamondReward,
        experienceReward: lessonData.experienceReward,
        estimatedMinutes: lessonData.duration,
        isActive: true,
        isLocked: false,
        sortOrder: lessonData.order,
        tags: JSON.stringify(["python", "coding", "basics"]),
        settings: JSON.stringify({
          slug: lessonData.slug,
          hasCodeExercise: true,
          duration: lessonData.duration,
        }),
      } as const;

      // Use title-based lookup to avoid depending on slug typing in Prisma client
      const existing = await prisma.learningActivity.findFirst({
        where: { title: lessonData.title },
        select: { id: true },
      });

      if (existing) {
        await prisma.learningActivity.update({
          where: { id: existing.id },
          data: payload, // includes slug field for backfilled consistency
        });
        console.log(`✅ Updated learning activity: ${lessonData.title}`);
      } else {
        await prisma.learningActivity.create({
          data: payload,
        });
        console.log(`✅ Created learning activity: ${lessonData.title}`);
      }
    }

    console.log("🎉 Learning activity seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding code arenas:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
if (require.main === module) {
  seedLessons();
}

export { seedLessons };
