import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Interactive Demo Activities for Python Fundamentals
 * 10 step-by-step interactive demonstrations with explanations
 * Difficulty levels: 1-3 (Beginner to Intermediate)
 */

export const interactiveDemoPythonFundamentalsActivities = [
  // DIFFICULTY 1 - BEGINNER (4 activities)

  // 1. Python Variables and Data Types
  {
    title: "Python Variables and Data Types Interactive Demo",
    description:
      "Learn Python variables and data types through interactive step-by-step examples",
    activityType: "interactive_demo",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 18,
    experienceReward: 40,
    estimatedMinutes: 15,
    tags: ["variables", "data-types", "basics", "interactive"],
    content: {
      title: "Variables and Data Types Mastery",
      description:
        "Explore Python's fundamental data types and variable assignment with interactive examples",
      steps: [
        {
          id: 1,
          title: "Creating Variables",
          description:
            "Learn how to create and assign values to variables in Python",
          code: "# Creating different types of variables\nname = 'Alice'\nage = 25\nheight = 5.6\nis_student = True\n\nprint(f'Name: {name}')\nprint(f'Age: {age}')\nprint(f'Height: {height}')\nprint(f'Is student: {is_student}')",
          explanation:
            "Variables in Python are created by assigning values using the = operator. Python automatically determines the data type based on the value.",
          interactive: true,
          questions: [
            {
              question:
                "What happens when you assign a value to a variable in Python?",
              options: [
                "Python creates the variable and determines its type",
                "You must declare the type first",
                "Variables are created at compile time",
                "You need to use 'var' keyword",
              ],
              correct: 0,
            },
          ],
        },
        {
          id: 2,
          title: "Checking Data Types",
          description: "Use the type() function to examine variable types",
          code: "# Checking data types\nname = 'Alice'\nage = 25\nheight = 5.6\nis_student = True\n\nprint(f'Type of name: {type(name)}')\nprint(f'Type of age: {type(age)}')\nprint(f'Type of height: {type(height)}')\nprint(f'Type of is_student: {type(is_student)}')",
          explanation:
            "The type() function returns the data type of any variable or value. This is helpful for understanding what kind of data you're working with.",
          interactive: true,
          questions: [
            {
              question: "What does type('Hello') return?",
              options: [
                "<class 'string'>",
                "<class 'str'>",
                "<class 'text'>",
                "<class 'char'>",
              ],
              correct: 1,
            },
          ],
        },
        {
          id: 3,
          title: "Type Conversion",
          description: "Convert between different data types",
          code: "# Type conversion examples\nage_str = '25'\nage_int = int(age_str)\nage_float = float(age_str)\n\nprint(f'Original: {age_str} (type: {type(age_str)})')\nprint(f'As integer: {age_int} (type: {type(age_int)})')\nprint(f'As float: {age_float} (type: {type(age_float)})')\n\n# Converting numbers to strings\nnum = 42\nnum_str = str(num)\nprint(f'Number as string: {num_str} (type: {type(num_str)})')",
          explanation:
            "Python provides built-in functions like int(), float(), str(), and bool() to convert between data types when possible.",
          interactive: true,
          questions: [
            {
              question: "What happens when you try int('hello')?",
              options: [
                "Returns 0",
                "Returns None",
                "Raises ValueError",
                "Returns 'hello'",
              ],
              correct: 2,
            },
          ],
        },
        {
          id: 4,
          title: "Variable Naming Rules",
          description:
            "Learn the rules and best practices for naming variables",
          code: "# Valid variable names\nuser_name = 'Alice'\nuser_age = 25\nUSER_ROLE = 'admin'  # Constants are usually uppercase\n_private_var = 'hidden'  # Private variables start with underscore\n\n# Invalid examples (these would cause errors):\n# 2name = 'Alice'  # Can't start with number\n# user-name = 'Alice'  # Can't use hyphens\n# for = 'Alice'  # Can't use reserved keywords\n\nprint('Valid variables created successfully!')\nprint(f'User: {user_name}, Age: {user_age}, Role: {USER_ROLE}')",
          explanation:
            "Variable names must start with a letter or underscore, can contain letters, numbers, and underscores, and cannot be Python keywords.",
          interactive: true,
        },
      ],
      timeLimit: 900,
      language: "Python",
    },
    settings: {
      livePreview: true,
      showResults: true,
      allowHints: true,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2. String Operations and Methods
  {
    title: "Python String Operations Interactive Demo",
    description:
      "Master string manipulation through hands-on interactive examples",
    activityType: "interactive_demo",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 20,
    experienceReward: 45,
    estimatedMinutes: 18,
    tags: ["strings", "methods", "text-processing", "manipulation"],
    content: {
      title: "String Operations Deep Dive",
      description:
        "Explore Python's powerful string manipulation capabilities with interactive examples",
      steps: [
        {
          id: 1,
          title: "String Creation and Indexing",
          description:
            "Learn different ways to create strings and access individual characters",
          code: "# Creating strings\nsingle_quotes = 'Hello World'\ndouble_quotes = \"Python Programming\"\ntriple_quotes = '''This is a\nmulti-line\nstring'''\n\n# String indexing\ntext = 'Python'\nprint(f'First character: {text[0]}')\nprint(f'Last character: {text[-1]}')\nprint(f'Third character: {text[2]}')\n\n# String length\nprint(f'Length of text: {len(text)}')",
          explanation:
            "Strings can be created with single, double, or triple quotes. Individual characters are accessed using square bracket notation with zero-based indexing.",
          interactive: true,
          questions: [
            {
              question: "What does 'Python'[-1] return?",
              options: ["P", "n", "o", "Error"],
              correct: 1,
            },
          ],
        },
        {
          id: 2,
          title: "String Slicing",
          description: "Extract substrings using slicing notation",
          code: "# String slicing\ntext = 'Python Programming'\n\n# Basic slicing\nprint(f'First 6 characters: {text[0:6]}')\nprint(f'Last 11 characters: {text[7:]}')\nprint(f'Middle section: {text[7:18]}')\n\n# Advanced slicing\nprint(f'Every second character: {text[::2]}')\nprint(f'Reverse string: {text[::-1]}')\nprint(f'First 10, every 2nd: {text[0:10:2]}')",
          explanation:
            "Slicing uses the syntax [start:end:step]. Start is inclusive, end is exclusive. Negative indices count from the end.",
          interactive: true,
          questions: [
            {
              question: "What does 'Hello'[1:4] return?",
              options: ["Hel", "ell", "ello", "llo"],
              correct: 1,
            },
          ],
        },
        {
          id: 3,
          title: "String Methods - Case and Whitespace",
          description:
            "Learn methods for changing case and handling whitespace",
          code: "# Case conversion methods\ntext = '  Python Programming  '\n\nprint(f'Original: \"{text}\"')\nprint(f'Upper case: {text.upper()}')\nprint(f'Lower case: {text.lower()}')\nprint(f'Title case: {text.title()}')\nprint(f'Capitalize: {text.capitalize()}')\n\n# Whitespace handling\nprint(f'Strip whitespace: \"{text.strip()}\"')\nprint(f'Left strip: \"{text.lstrip()}\"')\nprint(f'Right strip: \"{text.rstrip()}\"')",
          explanation:
            "String methods like upper(), lower(), strip() return new strings - they don't modify the original string since strings are immutable.",
          interactive: true,
          questions: [
            {
              question: "What does 'hello world'.title() return?",
              options: [
                "Hello world",
                "HELLO WORLD",
                "Hello World",
                "hello World",
              ],
              correct: 2,
            },
          ],
        },
        {
          id: 4,
          title: "String Methods - Split and Join",
          description:
            "Learn to split strings into lists and join lists into strings",
          code: "# Splitting strings\nsentence = 'Python is amazing and powerful'\nwords = sentence.split()\nprint(f'Words: {words}')\n\n# Splitting with custom delimiter\ndata = 'apple,banana,cherry,date'\nfruits = data.split(',')\nprint(f'Fruits: {fruits}')\n\n# Joining lists into strings\njoined_spaces = ' '.join(fruits)\njoined_dashes = '-'.join(fruits)\nprint(f'Joined with spaces: {joined_spaces}')\nprint(f'Joined with dashes: {joined_dashes}')",
          explanation:
            "split() breaks strings into lists, join() combines list elements into strings. These are complementary operations for text processing.",
          interactive: true,
          questions: [
            {
              question: "What does 'a,b,c'.split(',') return?",
              options: [
                "'abc'",
                "['a', 'b', 'c']",
                "('a', 'b', 'c')",
                "{'a', 'b', 'c'}",
              ],
              correct: 1,
            },
          ],
        },
        {
          id: 5,
          title: "String Formatting",
          description: "Master different string formatting techniques",
          code: "# Different formatting methods\nname = 'Alice'\nage = 25\nscore = 87.5\n\n# f-strings (recommended)\nf_string = f'Name: {name}, Age: {age}, Score: {score:.1f}'\nprint(f'F-string: {f_string}')\n\n# .format() method\nformat_string = 'Name: {}, Age: {}, Score: {:.1f}'.format(name, age, score)\nprint(f'Format method: {format_string}')\n\n# % formatting (older style)\npercent_string = 'Name: %s, Age: %d, Score: %.1f' % (name, age, score)\nprint(f'Percent formatting: {percent_string}')",
          explanation:
            "F-strings are the modern, preferred way to format strings in Python. They're readable, efficient, and support complex expressions.",
          interactive: true,
        },
      ],
      timeLimit: 1080,
      language: "Python",
    },
    settings: {
      livePreview: true,
      showResults: true,
      allowHints: true,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3. Lists and Basic Operations
  {
    title: "Python Lists Interactive Demo",
    description:
      "Explore Python lists through interactive examples and hands-on practice",
    activityType: "interactive_demo",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 22,
    experienceReward: 50,
    estimatedMinutes: 20,
    tags: ["lists", "data-structures", "operations", "indexing"],
    content: {
      title: "Python Lists Mastery",
      description:
        "Learn to work with Python lists through comprehensive interactive examples",
      steps: [
        {
          id: 1,
          title: "Creating and Accessing Lists",
          description:
            "Learn different ways to create lists and access their elements",
          code: "# Creating lists\nfruits = ['apple', 'banana', 'cherry']\nnumbers = [1, 2, 3, 4, 5]\nmixed_list = ['hello', 42, 3.14, True]\nempty_list = []\n\nprint(f'Fruits: {fruits}')\nprint(f'Numbers: {numbers}')\nprint(f'Mixed list: {mixed_list}')\n\n# Accessing elements\nprint(f'First fruit: {fruits[0]}')\nprint(f'Last fruit: {fruits[-1]}')\nprint(f'Second number: {numbers[1]}')",
          explanation:
            "Lists are created using square brackets and can contain any type of data. Elements are accessed using zero-based indexing.",
          interactive: true,
          questions: [
            {
              question: "What does [1, 2, 3][-1] return?",
              options: ["1", "2", "3", "Error"],
              correct: 2,
            },
          ],
        },
        {
          id: 2,
          title: "Adding Elements to Lists",
          description: "Learn different methods to add elements to lists",
          code: "# Starting with a list\nfruits = ['apple', 'banana']\nprint(f'Original: {fruits}')\n\n# Adding single elements\nfruits.append('cherry')\nprint(f'After append: {fruits}')\n\nfruits.insert(1, 'orange')\nprint(f'After insert: {fruits}')\n\n# Adding multiple elements\nfruits.extend(['grape', 'kiwi'])\nprint(f'After extend: {fruits}')\n\n# Using + operator\nmore_fruits = fruits + ['mango', 'peach']\nprint(f'Using + operator: {more_fruits}')",
          explanation:
            "append() adds one element to the end, insert() adds at a specific position, extend() adds multiple elements, and + creates a new list.",
          interactive: true,
          questions: [
            {
              question: "What's the difference between append() and extend()?",
              options: [
                "No difference",
                "append() adds one item, extend() adds multiple",
                "extend() is faster",
                "append() creates a new list",
              ],
              correct: 1,
            },
          ],
        },
        {
          id: 3,
          title: "Removing Elements from Lists",
          description: "Explore different ways to remove elements from lists",
          code: "# Starting with a list\nfruits = ['apple', 'banana', 'cherry', 'banana', 'date']\nprint(f'Original: {fruits}')\n\n# Removing by value (first occurrence)\nfruits.remove('banana')\nprint(f'After remove banana: {fruits}')\n\n# Removing by index\nremoved_item = fruits.pop(1)\nprint(f'Removed item: {removed_item}')\nprint(f'After pop(1): {fruits}')\n\n# Removing last item\nlast_item = fruits.pop()\nprint(f'Last item: {last_item}')\nprint(f'After pop(): {fruits}')\n\n# Clearing all elements\nfruits.clear()\nprint(f'After clear(): {fruits}')",
          explanation:
            "remove() deletes by value, pop() removes by index and returns the item, clear() removes all elements.",
          interactive: true,
          questions: [
            {
              question: "What does pop() return?",
              options: [
                "Nothing",
                "The removed element",
                "The remaining list",
                "True or False",
              ],
              correct: 1,
            },
          ],
        },
        {
          id: 4,
          title: "List Methods and Properties",
          description: "Learn useful list methods for searching and organizing",
          code: "# Working with list methods\nnumbers = [3, 1, 4, 1, 5, 9, 2, 6]\nprint(f'Original numbers: {numbers}')\n\n# Finding elements\nprint(f'Index of 4: {numbers.index(4)}')\nprint(f'Count of 1: {numbers.count(1)}')\nprint(f'Length of list: {len(numbers)}')\n\n# Sorting and reversing\nnumbers.sort()\nprint(f'After sort(): {numbers}')\n\nnumbers.reverse()\nprint(f'After reverse(): {numbers}')\n\n# Creating sorted copy (original unchanged)\noriginal = [3, 1, 4, 1, 5]\nsorted_copy = sorted(original)\nprint(f'Original: {original}')\nprint(f'Sorted copy: {sorted_copy}')",
          explanation:
            "index() finds position, count() counts occurrences, sort() modifies the list, sorted() creates a new sorted list.",
          interactive: true,
        },
        {
          id: 5,
          title: "List Slicing and Copying",
          description: "Master list slicing and understand list copying",
          code: "# List slicing\nnumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]\n\nprint(f'Original: {numbers}')\nprint(f'First 5: {numbers[:5]}')\nprint(f'Last 5: {numbers[-5:]}')\nprint(f'Middle 4: {numbers[3:7]}')\nprint(f'Every 2nd: {numbers[::2]}')\nprint(f'Reverse: {numbers[::-1]}')\n\n# List copying\noriginal = [1, 2, 3]\nshallow_copy = original.copy()\nslice_copy = original[:]\n\noriginal.append(4)\nprint(f'Original after append: {original}')\nprint(f'Shallow copy: {shallow_copy}')\nprint(f'Slice copy: {slice_copy}')",
          explanation:
            "Slicing creates new lists with selected elements. Copying creates independent lists that don't affect each other when modified.",
          interactive: true,
        },
      ],
      timeLimit: 1200,
      language: "Python",
    },
    settings: {
      livePreview: true,
      showResults: true,
      allowHints: true,
    },
    isActive: true,
    sortOrder: 3,
  },

  // 4. Conditional Statements
  {
    title: "Python Conditional Logic Interactive Demo",
    description:
      "Master if-elif-else statements through interactive decision-making examples",
    activityType: "interactive_demo",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 25,
    experienceReward: 55,
    estimatedMinutes: 22,
    tags: ["conditionals", "if-statements", "logic", "decision-making"],
    content: {
      title: "Conditional Logic Mastery",
      description:
        "Learn to make decisions in your code using conditional statements",
      steps: [
        {
          id: 1,
          title: "Basic If Statements",
          description:
            "Learn the foundation of conditional logic with simple if statements",
          code: "# Basic if statements\nage = 18\ntemperature = 25\nis_sunny = True\n\n# Simple condition\nif age >= 18:\n    print('You are an adult')\n\n# Multiple conditions\nif temperature > 20:\n    print('It\\'s a warm day')\n\nif is_sunny:\n    print('Perfect weather for a walk!')\n\n# Condition with else\nif age >= 21:\n    print('You can drink alcohol in the US')\nelse:\n    print('You cannot drink alcohol in the US yet')",
          explanation:
            "If statements execute code only when a condition is True. The else clause provides an alternative when the condition is False.",
          interactive: true,
          questions: [
            {
              question: "When does the else block execute?",
              options: [
                "Always",
                "When if condition is True",
                "When if condition is False",
                "Never",
              ],
              correct: 2,
            },
          ],
        },
        {
          id: 2,
          title: "Multiple Conditions with elif",
          description: "Handle multiple scenarios using elif statements",
          code: "# Grade classification system\nscore = 85\n\nif score >= 90:\n    grade = 'A'\n    print(f'Excellent! Grade: {grade}')\nelif score >= 80:\n    grade = 'B'\n    print(f'Good job! Grade: {grade}')\nelif score >= 70:\n    grade = 'C'\n    print(f'Average. Grade: {grade}')\nelif score >= 60:\n    grade = 'D'\n    print(f'Below average. Grade: {grade}')\nelse:\n    grade = 'F'\n    print(f'Failed. Grade: {grade}')\n\nprint(f'Final grade for score {score}: {grade}')",
          explanation:
            "elif (else if) allows you to check multiple conditions in order. Only the first True condition executes, then Python skips the rest.",
          interactive: true,
          questions: [
            {
              question:
                "In an if-elif-else chain, how many blocks can execute?",
              options: ["All of them", "None", "At most one", "At least one"],
              correct: 2,
            },
          ],
        },
        {
          id: 3,
          title: "Logical Operators",
          description:
            "Combine multiple conditions using and, or, and not operators",
          code: "# Logical operators example\nage = 25\nincome = 50000\nhas_job = True\ncredit_score = 720\n\n# AND operator - all conditions must be True\nif age >= 18 and income >= 30000 and has_job:\n    print('Qualified for loan (basic requirements)')\n\n# OR operator - at least one condition must be True\nif credit_score >= 700 or income >= 100000:\n    print('Qualified for premium loan terms')\n\n# NOT operator - reverses the condition\nif not (age < 18):\n    print('Not a minor')\n\n# Complex combinations\nif (age >= 21 and income >= 40000) or (credit_score >= 750):\n    print('Qualified for credit card')\n\n# Checking multiple conditions\nif age >= 18 and age <= 65 and has_job and income >= 25000:\n    print('Eligible for mortgage application')",
          explanation:
            "'and' requires all conditions to be True, 'or' requires at least one to be True, 'not' reverses a condition.",
          interactive: true,
          questions: [
            {
              question: "What does 'True and False or True' evaluate to?",
              options: ["True", "False", "Error", "None"],
              correct: 0,
            },
          ],
        },
        {
          id: 4,
          title: "Nested Conditions",
          description: "Learn to nest if statements for complex decision trees",
          code: "# Nested conditionals example\nweather = 'sunny'\ntemperature = 22\nhas_umbrella = False\n\nprint('Planning outdoor activity...')\n\nif weather == 'sunny':\n    print('Great! Sunny weather.')\n    if temperature >= 20:\n        print('Perfect temperature for outdoor activities!')\n        if temperature >= 30:\n            print('Remember to bring water - it\\'s hot!')\n        else:\n            print('Comfortable temperature.')\n    else:\n        print('A bit cool, but still nice for a walk.')\nelif weather == 'rainy':\n    print('Rainy weather detected.')\n    if has_umbrella:\n        print('You have an umbrella - you can still go out!')\n    else:\n        print('Better stay inside or get an umbrella.')\nelse:\n    print(f'Weather is {weather} - check conditions carefully.')",
          explanation:
            "Nested if statements allow for complex decision trees. Each level of nesting adds another layer of conditions to check.",
          interactive: true,
        },
        {
          id: 5,
          title: "Conditional Expressions (Ternary Operator)",
          description:
            "Learn compact conditional expressions for simple decisions",
          code: "# Ternary operator examples\nage = 20\nscore = 85\nis_weekend = True\n\n# Basic ternary: value_if_true if condition else value_if_false\nstatus = 'Adult' if age >= 18 else 'Minor'\nprint(f'Status: {status}')\n\n# More examples\ngrade = 'Pass' if score >= 60 else 'Fail'\nprint(f'Result: {grade}')\n\nday_type = 'Weekend' if is_weekend else 'Weekday'\nprint(f'Today is a {day_type}')\n\n# Nested ternary (use sparingly)\nmessage = 'Excellent' if score >= 90 else 'Good' if score >= 70 else 'Needs improvement'\nprint(f'Performance: {message}')\n\n# Comparison with regular if-else\n# Regular way:\nif age >= 65:\n    ticket_price = 10\nelse:\n    ticket_price = 15\n\n# Ternary way:\nticket_price_ternary = 10 if age >= 65 else 15\n\nprint(f'Ticket price: ${ticket_price_ternary}')",
          explanation:
            "Ternary operators provide a concise way to assign values based on conditions. Use them for simple conditions to keep code readable.",
          interactive: true,
        },
      ],
      timeLimit: 1320,
      language: "Python",
    },
    settings: {
      livePreview: true,
      showResults: true,
      allowHints: true,
    },
    isActive: true,
    sortOrder: 4,
  },

  // DIFFICULTY 2 - BASIC (3 activities)

  // 5. Loops and Iteration
  {
    title: "Python Loops Interactive Demo",
    description:
      "Master for and while loops through comprehensive interactive examples",
    activityType: "interactive_demo",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 28,
    experienceReward: 60,
    estimatedMinutes: 25,
    tags: ["loops", "iteration", "for-loops", "while-loops"],
    content: {
      title: "Loops and Iteration Mastery",
      description: "Learn to repeat code efficiently using for and while loops",
      steps: [
        {
          id: 1,
          title: "For Loops with Range",
          description: "Learn the most common loop pattern using range()",
          code: "# Basic for loops with range\nprint('Counting from 0 to 4:')\nfor i in range(5):\n    print(f'Count: {i}')\n\nprint('\\nCounting from 1 to 5:')\nfor i in range(1, 6):\n    print(f'Number: {i}')\n\nprint('\\nCounting by 2s:')\nfor i in range(0, 11, 2):\n    print(f'Even number: {i}')\n\nprint('\\nCountdown:')\nfor i in range(10, 0, -1):\n    print(f'Countdown: {i}')\nprint('Blast off!')",
          explanation:
            "range() generates sequences of numbers. range(n) goes 0 to n-1, range(start, stop) goes start to stop-1, range(start, stop, step) uses custom increments.",
          interactive: true,
          questions: [
            {
              question: "What does range(1, 6) generate?",
              options: [
                "1, 2, 3, 4, 5",
                "1, 2, 3, 4, 5, 6",
                "0, 1, 2, 3, 4, 5",
                "2, 3, 4, 5, 6",
              ],
              correct: 0,
            },
          ],
        },
        {
          id: 2,
          title: "For Loops with Collections",
          description: "Iterate through lists, strings, and other collections",
          code: "# Looping through different collections\nfruits = ['apple', 'banana', 'cherry', 'date']\n\nprint('Iterating through a list:')\nfor fruit in fruits:\n    print(f'I like {fruit}')\n\nprint('\\nIterating through a string:')\nfor char in 'Python':\n    print(f'Character: {char}')\n\nprint('\\nUsing enumerate for index and value:')\nfor index, fruit in enumerate(fruits):\n    print(f'{index}: {fruit}')\n\nprint('\\nUsing enumerate with start value:')\nfor index, fruit in enumerate(fruits, 1):\n    print(f'#{index}: {fruit}')",
          explanation:
            "For loops can iterate through any iterable object. enumerate() provides both index and value, which is very useful for numbered lists.",
          interactive: true,
          questions: [
            {
              question: "What does enumerate(['a', 'b']) with start=1 produce?",
              options: [
                "(0, 'a'), (1, 'b')",
                "(1, 'a'), (2, 'b')",
                "['a', 'b']",
                "Error",
              ],
              correct: 1,
            },
          ],
        },
        {
          id: 3,
          title: "While Loops",
          description:
            "Learn when and how to use while loops for conditional repetition",
          code: "# Basic while loop\ncount = 0\nprint('Basic while loop:')\nwhile count < 5:\n    print(f'Count is {count}')\n    count += 1\n\nprint('\\nGuessing game simulation:')\nimport random\ntarget = random.randint(1, 10)\nguess = 0\nattempts = 0\n\nwhile guess != target and attempts < 3:\n    attempts += 1\n    guess = random.randint(1, 10)\n    print(f'Attempt {attempts}: Guessed {guess}')\n    if guess == target:\n        print(f'Found it! Target was {target}')\n    elif attempts < 3:\n        print('Try again!')\n\nif guess != target:\n    print(f'Game over! Target was {target}')",
          explanation:
            "While loops continue as long as a condition is True. Always ensure the condition will eventually become False to avoid infinite loops.",
          interactive: true,
          questions: [
            {
              question: "What's the main risk with while loops?",
              options: [
                "They're slow",
                "They use more memory",
                "They can run forever",
                "They only work with numbers",
              ],
              correct: 2,
            },
          ],
        },
        {
          id: 4,
          title: "Loop Control: break and continue",
          description:
            "Learn to control loop execution with break and continue",
          code: "# Using break to exit loops early\nprint('Finding first even number:')\nfor num in [1, 3, 5, 4, 7, 8, 9]:\n    print(f'Checking {num}')\n    if num % 2 == 0:\n        print(f'Found first even number: {num}')\n        break\n    print(f'{num} is odd, continuing...')\n\nprint('\\nUsing continue to skip iterations:')\nfor num in range(1, 11):\n    if num % 3 == 0:\n        print(f'Skipping {num} (divisible by 3)')\n        continue\n    print(f'Processing {num}')\n\nprint('\\nCombining break and continue:')\nfor num in range(1, 20):\n    if num % 2 == 0:\n        continue  # Skip even numbers\n    if num > 15:\n        break     # Stop when we reach 15\n    print(f'Odd number: {num}')",
          explanation:
            "break exits the loop completely, continue skips the rest of the current iteration and goes to the next one.",
          interactive: true,
        },
        {
          id: 5,
          title: "Nested Loops",
          description: "Learn to work with loops inside loops",
          code: "# Nested loops example - multiplication table\nprint('Multiplication table (3x3):')\nfor i in range(1, 4):\n    for j in range(1, 4):\n        result = i * j\n        print(f'{i} x {j} = {result:2d}', end='  ')\n    print()  # New line after each row\n\nprint('\\nPattern printing:')\nfor row in range(1, 6):\n    for col in range(row):\n        print('*', end='')\n    print()  # New line after each row\n\nprint('\\nSearching in 2D structure:')\nmatrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\ntarget = 5\nfound = False\n\nfor row_idx, row in enumerate(matrix):\n    for col_idx, value in enumerate(row):\n        if value == target:\n            print(f'Found {target} at position ({row_idx}, {col_idx})')\n            found = True\n            break\n    if found:\n        break",
          explanation:
            "Nested loops allow you to work with multi-dimensional data. The inner loop completes fully for each iteration of the outer loop.",
          interactive: true,
        },
      ],
      timeLimit: 1500,
      language: "Python",
    },
    settings: {
      livePreview: true,
      showResults: true,
      allowHints: true,
    },
    isActive: true,
    sortOrder: 5,
  },

  // 6. Functions Deep Dive
  {
    title: "Python Functions Interactive Demo",
    description:
      "Master function creation, parameters, and return values through hands-on examples",
    activityType: "interactive_demo",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 28,
    tags: ["functions", "parameters", "return-values", "scope"],
    content: {
      title: "Functions Deep Dive",
      description:
        "Learn to create reusable code with functions, parameters, and return values",
      steps: [
        {
          id: 1,
          title: "Basic Function Definition and Calling",
          description: "Learn to create and call simple functions",
          code: "# Basic function definition\ndef greet():\n    print('Hello, World!')\n    print('Welcome to Python functions!')\n\n# Function with parameter\ndef greet_person(name):\n    print(f'Hello, {name}!')\n    print('Nice to meet you!')\n\n# Function with return value\ndef add_numbers(a, b):\n    result = a + b\n    return result\n\n# Calling functions\nprint('Calling greet():')\ngreet()\n\nprint('\\nCalling greet_person():')\ngreet_person('Alice')\n\nprint('\\nCalling add_numbers():')\nsum_result = add_numbers(5, 3)\nprint(f'5 + 3 = {sum_result}')",
          explanation:
            "Functions are defined with 'def', can take parameters, and can return values. They help organize code and make it reusable.",
          interactive: true,
          questions: [
            {
              question:
                "What happens if a function doesn't have a return statement?",
              options: [
                "Error occurs",
                "Returns None",
                "Returns 0",
                "Returns empty string",
              ],
              correct: 1,
            },
          ],
        },
        {
          id: 2,
          title: "Default Parameters and Keyword Arguments",
          description:
            "Learn flexible parameter handling with defaults and keywords",
          code: "# Function with default parameters\ndef create_profile(name, age=25, city='Unknown'):\n    return f'Name: {name}, Age: {age}, City: {city}'\n\n# Function with keyword arguments\ndef calculate_area(length, width, unit='square meters'):\n    area = length * width\n    return f'Area: {area} {unit}'\n\n# Different ways to call functions\nprint('Using positional arguments:')\nprofile1 = create_profile('Alice', 30, 'New York')\nprint(profile1)\n\nprint('\\nUsing default parameters:')\nprofile2 = create_profile('Bob')\nprint(profile2)\n\nprint('\\nMixing positional and keyword arguments:')\nprofile3 = create_profile('Charlie', city='London')\nprint(profile3)\n\nprint('\\nUsing keyword arguments:')\narea1 = calculate_area(length=10, width=5)\nprint(area1)\n\narea2 = calculate_area(10, 5, unit='square feet')\nprint(area2)",
          explanation:
            "Default parameters provide fallback values. Keyword arguments allow calling functions with parameter names for clarity.",
          interactive: true,
          questions: [
            {
              question: "What's the advantage of keyword arguments?",
              options: [
                "They're faster",
                "Order doesn't matter",
                "They use less memory",
                "They're required",
              ],
              correct: 1,
            },
          ],
        },
        {
          id: 3,
          title: "Variable Arguments (*args and **kwargs)",
          description: "Learn to handle variable numbers of arguments",
          code: "# Function with *args (variable positional arguments)\ndef sum_all(*numbers):\n    total = 0\n    for num in numbers:\n        total += num\n    return total\n\n# Function with **kwargs (variable keyword arguments)\ndef create_student(**details):\n    student = {}\n    for key, value in details.items():\n        student[key] = value\n    return student\n\n# Function with both *args and **kwargs\ndef flexible_function(*args, **kwargs):\n    print(f'Positional arguments: {args}')\n    print(f'Keyword arguments: {kwargs}')\n    return len(args) + len(kwargs)\n\n# Testing the functions\nprint('sum_all() with different numbers of arguments:')\nprint(f'sum_all(1, 2, 3) = {sum_all(1, 2, 3)}')\nprint(f'sum_all(1, 2, 3, 4, 5) = {sum_all(1, 2, 3, 4, 5)}')\n\nprint('\\ncreate_student() with different details:')\nstudent1 = create_student(name='Alice', age=20, major='Computer Science')\nprint(student1)\n\nprint('\\nflexible_function() with mixed arguments:')\ncount = flexible_function(1, 2, 3, name='Bob', age=25)\nprint(f'Total arguments: {count}')",
          explanation:
            "*args collects extra positional arguments into a tuple, **kwargs collects extra keyword arguments into a dictionary.",
          interactive: true,
        },
        {
          id: 4,
          title: "Variable Scope and Global vs Local",
          description:
            "Understand how variables work inside and outside functions",
          code: "# Global variables\nglobal_var = 'I am global'\ncounter = 0\n\ndef demonstrate_scope():\n    # Local variable\n    local_var = 'I am local'\n    print(f'Inside function - Global: {global_var}')\n    print(f'Inside function - Local: {local_var}')\n\ndef modify_global():\n    global counter\n    counter += 1\n    print(f'Modified global counter: {counter}')\n\ndef shadow_global():\n    global_var = 'I am a local shadow'\n    print(f'Shadowed variable: {global_var}')\n\n# Testing scope\nprint('Testing variable scope:')\nprint(f'Global variable outside: {global_var}')\nprint(f'Global counter: {counter}')\n\nprint('\\nCalling demonstrate_scope():')\ndemonstrate_scope()\n\nprint('\\nCalling modify_global():')\nmodify_global()\nmodify_global()\n\nprint('\\nCalling shadow_global():')\nshadow_global()\nprint(f'Global variable after shadow: {global_var}')\n\n# Trying to access local variable (would cause error)\n# print(local_var)  # NameError: name 'local_var' is not defined",
          explanation:
            "Variables inside functions are local by default. Use 'global' keyword to modify global variables from inside functions.",
          interactive: true,
        },
        {
          id: 5,
          title: "Lambda Functions and Higher-Order Functions",
          description:
            "Learn about anonymous functions and functions that work with other functions",
          code: "# Lambda functions (anonymous functions)\nsquare = lambda x: x ** 2\nadd = lambda x, y: x + y\n\nprint('Lambda functions:')\nprint(f'square(5) = {square(5)}')\nprint(f'add(3, 4) = {add(3, 4)}')\n\n# Using lambda with built-in functions\nnumbers = [1, 2, 3, 4, 5]\n\n# map() applies function to each element\nsquared = list(map(lambda x: x ** 2, numbers))\nprint(f'\\nSquared numbers: {squared}')\n\n# filter() keeps elements that return True\neven_numbers = list(filter(lambda x: x % 2 == 0, numbers))\nprint(f'Even numbers: {even_numbers}')\n\n# sorted() with custom key function\nstudents = [('Alice', 85), ('Bob', 90), ('Charlie', 78)]\nsorted_by_grade = sorted(students, key=lambda student: student[1])\nprint(f'\\nStudents sorted by grade: {sorted_by_grade}')\n\n# Function that returns another function\ndef create_multiplier(factor):\n    return lambda x: x * factor\n\ndouble = create_multiplier(2)\ntriple = create_multiplier(3)\n\nprint(f'\\ndouble(5) = {double(5)}')\nprint(f'triple(5) = {triple(5)}')",
          explanation:
            "Lambda functions are short anonymous functions. Higher-order functions like map(), filter(), and sorted() work with other functions.",
          interactive: true,
        },
      ],
      timeLimit: 1680,
      language: "Python",
    },
    settings: {
      livePreview: true,
      showResults: true,
      allowHints: true,
    },
    isActive: true,
    sortOrder: 6,
  },

  // 7. Dictionaries Deep Dive
  {
    title: "Python Dictionaries Interactive Demo",
    description:
      "Master Python dictionaries through comprehensive interactive examples",
    activityType: "interactive_demo",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 32,
    experienceReward: 70,
    estimatedMinutes: 30,
    tags: ["dictionaries", "key-value", "data-structures", "methods"],
    content: {
      title: "Dictionaries Deep Dive",
      description:
        "Learn advanced dictionary operations and data manipulation techniques",
      steps: [
        {
          id: 1,
          title: "Creating and Accessing Dictionaries",
          description:
            "Learn different ways to create and access dictionary data",
          code: "# Creating dictionaries\nstudent = {'name': 'Alice', 'age': 20, 'grade': 'A'}\nempty_dict = {}\ndict_from_pairs = dict([('a', 1), ('b', 2), ('c', 3)])\ndict_comprehension = {x: x**2 for x in range(5)}\n\nprint('Different dictionary creations:')\nprint(f'Student: {student}')\nprint(f'Empty dict: {empty_dict}')\nprint(f'From pairs: {dict_from_pairs}')\nprint(f'Comprehension: {dict_comprehension}')\n\n# Accessing values\nprint('\\nAccessing dictionary values:')\nprint(f'Student name: {student[\"name\"]}')\nprint(f'Student age: {student.get(\"age\")}')\nprint(f'Student major: {student.get(\"major\", \"Undeclared\")}')\n\n# Adding and modifying\nstudent['major'] = 'Computer Science'\nstudent['gpa'] = 3.8\nprint(f'\\nUpdated student: {student}')",
          explanation:
            "Dictionaries store key-value pairs. Use [] for direct access or .get() for safe access with default values.",
          interactive: true,
          questions: [
            {
              question:
                "What's the difference between dict['key'] and dict.get('key')?",
              options: [
                "No difference",
                "get() is faster",
                "get() doesn't raise KeyError for missing keys",
                "[] is deprecated",
              ],
              correct: 2,
            },
          ],
        },
        {
          id: 2,
          title: "Dictionary Methods and Operations",
          description:
            "Explore essential dictionary methods for data manipulation",
          code: "# Working with dictionary methods\ninventory = {'apples': 50, 'bananas': 30, 'oranges': 25}\n\nprint('Original inventory:')\nprint(inventory)\n\n# Getting keys, values, and items\nprint(f'\\nKeys: {list(inventory.keys())}')\nprint(f'Values: {list(inventory.values())}')\nprint(f'Items: {list(inventory.items())}')\n\n# Updating dictionaries\nnew_items = {'grapes': 40, 'apples': 60}  # apples will be updated\ninventory.update(new_items)\nprint(f'\\nAfter update: {inventory}')\n\n# Removing items\nremoved_bananas = inventory.pop('bananas')\nprint(f'Removed bananas: {removed_bananas}')\nprint(f'After removing bananas: {inventory}')\n\n# setdefault - add key only if it doesn't exist\ninventory.setdefault('pears', 15)\ninventory.setdefault('apples', 100)  # Won't change existing value\nprint(f'\\nAfter setdefault: {inventory}')",
          explanation:
            "Dictionary methods provide powerful ways to manipulate and query data. update() merges dictionaries, pop() removes and returns values.",
          interactive: true,
          questions: [
            {
              question: "What does setdefault() do if the key already exists?",
              options: [
                "Updates the value",
                "Does nothing",
                "Raises an error",
                "Deletes the key",
              ],
              correct: 1,
            },
          ],
        },
        {
          id: 3,
          title: "Iterating Through Dictionaries",
          description: "Learn different ways to loop through dictionary data",
          code: "# Different ways to iterate through dictionaries\nscores = {'Alice': 95, 'Bob': 87, 'Charlie': 92, 'Diana': 88}\n\nprint('Iterating through keys:')\nfor name in scores:\n    print(f'{name}: {scores[name]}')\n\nprint('\\nIterating through keys explicitly:')\nfor name in scores.keys():\n    print(f'Student: {name}')\n\nprint('\\nIterating through values:')\nfor score in scores.values():\n    print(f'Score: {score}')\n\nprint('\\nIterating through items (key-value pairs):')\nfor name, score in scores.items():\n    if score >= 90:\n        print(f'{name} got an A with {score}')\n    else:\n        print(f'{name} got {score}')\n\nprint('\\nDictionary comprehension with filtering:')\nhigh_scorers = {name: score for name, score in scores.items() if score >= 90}\nprint(f'High scorers: {high_scorers}')",
          explanation:
            "You can iterate through keys, values, or items. Dictionary comprehensions allow creating new dictionaries with filtering and transformation.",
          interactive: true,
        },
        {
          id: 4,
          title: "Nested Dictionaries and Complex Data",
          description:
            "Work with nested dictionaries for complex data structures",
          code: "# Nested dictionaries for complex data\ncompany = {\n    'employees': {\n        'john': {'department': 'Engineering', 'salary': 75000, 'skills': ['Python', 'SQL']},\n        'sarah': {'department': 'Marketing', 'salary': 65000, 'skills': ['Analytics', 'Design']},\n        'mike': {'department': 'Engineering', 'salary': 80000, 'skills': ['Java', 'AWS']}\n    },\n    'departments': {\n        'Engineering': {'budget': 500000, 'head': 'mike'},\n        'Marketing': {'budget': 200000, 'head': 'sarah'}\n    }\n}\n\nprint('Company structure:')\nprint(f'Employees: {list(company[\"employees\"].keys())}')\nprint(f'Departments: {list(company[\"departments\"].keys())}')\n\nprint('\\nEmployee details:')\nfor name, details in company['employees'].items():\n    dept = details['department']\n    salary = details['salary']\n    skills = ', '.join(details['skills'])\n    print(f'{name.title()}: {dept}, ${salary:,}, Skills: {skills}')\n\nprint('\\nDepartment analysis:')\nfor dept, info in company['departments'].items():\n    budget = info['budget']\n    head = info['head'].title()\n    # Count employees in department\n    emp_count = sum(1 for emp in company['employees'].values() if emp['department'] == dept)\n    print(f'{dept}: Budget ${budget:,}, Head: {head}, Employees: {emp_count}')",
          explanation:
            "Nested dictionaries allow modeling complex relationships. Access nested data using multiple bracket notations or chained get() calls.",
          interactive: true,
        },
        {
          id: 5,
          title: "Dictionary Best Practices and Advanced Techniques",
          description: "Learn advanced dictionary patterns and best practices",
          code: "# Advanced dictionary techniques\nfrom collections import defaultdict, Counter\n\n# Using defaultdict to avoid KeyError\nword_count = defaultdict(int)\ntext = 'hello world hello python world'\nfor word in text.split():\n    word_count[word] += 1\n\nprint('Word count with defaultdict:')\nprint(dict(word_count))\n\n# Using Counter for counting\ncounter = Counter(text.split())\nprint(f'\\nWord count with Counter: {dict(counter)}')\nprint(f'Most common: {counter.most_common(2)}')\n\n# Dictionary merging (Python 3.9+)\ndict1 = {'a': 1, 'b': 2}\ndict2 = {'b': 3, 'c': 4}\n\n# Method 1: using update\nmerged1 = dict1.copy()\nmerged1.update(dict2)\nprint(f'\\nMerged with update: {merged1}')\n\n# Method 2: using ** unpacking\nmerged2 = {**dict1, **dict2}\nprint(f'Merged with unpacking: {merged2}')\n\n# Dictionary as switch/case replacement\ndef get_grade_points(letter):\n    grade_map = {\n        'A': 4.0, 'B': 3.0, 'C': 2.0, 'D': 1.0, 'F': 0.0\n    }\n    return grade_map.get(letter, 0.0)\n\nprint(f'\\nGrade points for A: {get_grade_points(\"A\")}')\nprint(f'Grade points for X: {get_grade_points(\"X\")}')",
          explanation:
            "defaultdict prevents KeyErrors, Counter simplifies counting, and dictionaries can replace switch statements for cleaner code.",
          interactive: true,
        },
      ],
      timeLimit: 1800,
      language: "Python",
    },
    settings: {
      livePreview: true,
      showResults: true,
      allowHints: true,
    },
    isActive: true,
    sortOrder: 7,
  },

  // DIFFICULTY 3 - INTERMEDIATE (3 activities)

  // 8. Error Handling and Exceptions
  {
    title: "Python Error Handling Interactive Demo",
    description:
      "Master exception handling and debugging techniques through practical examples",
    activityType: "interactive_demo",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 35,
    experienceReward: 75,
    estimatedMinutes: 32,
    tags: ["error-handling", "exceptions", "debugging", "try-catch"],
    content: {
      title: "Error Handling and Exceptions Mastery",
      description:
        "Learn to handle errors gracefully and write robust Python code",
      steps: [
        {
          id: 1,
          title: "Understanding Common Exceptions",
          description:
            "Learn about different types of exceptions and when they occur",
          code: "# Common exceptions demonstration\nprint('Demonstrating common exceptions (handled):')\n\n# ValueError\ntry:\n    number = int('hello')\nexcept ValueError as e:\n    print(f'ValueError: {e}')\n\n# TypeError\ntry:\n    result = 'hello' + 5\nexcept TypeError as e:\n    print(f'TypeError: {e}')\n\n# IndexError\ntry:\n    my_list = [1, 2, 3]\n    print(my_list[10])\nexcept IndexError as e:\n    print(f'IndexError: {e}')\n\n# KeyError\ntry:\n    my_dict = {'a': 1, 'b': 2}\n    print(my_dict['c'])\nexcept KeyError as e:\n    print(f'KeyError: {e}')\n\n# ZeroDivisionError\ntry:\n    result = 10 / 0\nexcept ZeroDivisionError as e:\n    print(f'ZeroDivisionError: {e}')\n\nprint('\\nAll exceptions were handled gracefully!')",
          explanation:
            "Different exceptions occur in different situations. Understanding common exceptions helps you write better error handling code.",
          interactive: true,
          questions: [
            {
              question:
                "Which exception occurs when trying to access a non-existent dictionary key?",
              options: ["IndexError", "KeyError", "ValueError", "NameError"],
              correct: 1,
            },
          ],
        },
        {
          id: 2,
          title: "Try-Except-Else-Finally Structure",
          description: "Learn the complete exception handling structure",
          code: "# Complete try-except-else-finally structure\ndef safe_divide(a, b):\n    try:\n        print(f'Attempting to divide {a} by {b}')\n        result = a / b\n    except ZeroDivisionError:\n        print('Error: Cannot divide by zero!')\n        return None\n    except TypeError:\n        print('Error: Both arguments must be numbers!')\n        return None\n    else:\n        print('Division successful!')\n        return result\n    finally:\n        print('Division attempt completed.\\n')\n\n# Testing the function\nprint('Testing safe_divide function:')\n\n# Successful division\nresult1 = safe_divide(10, 2)\nprint(f'Result: {result1}')\n\n# Division by zero\nresult2 = safe_divide(10, 0)\nprint(f'Result: {result2}')\n\n# Type error\nresult3 = safe_divide(10, 'hello')\nprint(f'Result: {result3}')\n\n# Demonstrating finally block always runs\nprint('Demonstrating finally with return:')\ndef test_finally():\n    try:\n        return 'from try'\n    finally:\n        print('Finally block executed even with return!')\n\nresult = test_finally()\nprint(f'Function returned: {result}')",
          explanation:
            "try contains risky code, except handles errors, else runs if no errors occur, finally always runs for cleanup.",
          interactive: true,
          questions: [
            {
              question: "When does the else block in try-except execute?",
              options: [
                "Always",
                "When an exception occurs",
                "When no exception occurs",
                "Never",
              ],
              correct: 2,
            },
          ],
        },
        {
          id: 3,
          title: "Raising Custom Exceptions",
          description:
            "Learn to raise your own exceptions for better error handling",
          code: '# Creating and raising custom exceptions\nclass InvalidAgeError(Exception):\n    """Custom exception for invalid age values"""\n    def __init__(self, age, message="Age must be between 0 and 150"):\n        self.age = age\n        self.message = message\n        super().__init__(self.message)\n\nclass BankAccountError(Exception):\n    """Custom exception for bank account operations"""\n    pass\n\ndef validate_age(age):\n    """Validate age and raise custom exception if invalid"""\n    if not isinstance(age, (int, float)):\n        raise TypeError("Age must be a number")\n    if age < 0:\n        raise InvalidAgeError(age, "Age cannot be negative")\n    if age > 150:\n        raise InvalidAgeError(age, "Age seems unrealistic")\n    return True\n\ndef withdraw_money(balance, amount):\n    """Simulate money withdrawal with validation"""\n    if amount <= 0:\n        raise ValueError("Withdrawal amount must be positive")\n    if amount > balance:\n        raise BankAccountError(f"Insufficient funds: balance is ${balance}, requested ${amount}")\n    return balance - amount\n\n# Testing custom exceptions\nprint(\'Testing custom exceptions:\')\n\n# Valid age\ntry:\n    validate_age(25)\n    print(\'Age 25 is valid\')\nexcept (InvalidAgeError, TypeError) as e:\n    print(f\'Age validation error: {e}\')\n\n# Invalid age\ntry:\n    validate_age(-5)\nexcept InvalidAgeError as e:\n    print(f\'Invalid age error: {e}\')\n\n# Bank account operations\ntry:\n    new_balance = withdraw_money(100, 50)\n    print(f\'Withdrawal successful. New balance: ${new_balance}\')\nexcept (ValueError, BankAccountError) as e:\n    print(f\'Transaction error: {e}\')\n\ntry:\n    new_balance = withdraw_money(100, 150)\nexcept BankAccountError as e:\n    print(f\'Transaction failed: {e}\')',
          explanation:
            "Custom exceptions provide specific error types for your application. They can carry additional data and provide clearer error messages.",
          interactive: true,
        },
        {
          id: 4,
          title: "Exception Chaining and Context",
          description: "Learn advanced exception handling techniques",
          code: '# Exception chaining and context management\nimport traceback\n\ndef process_data(data):\n    """Process data with detailed error reporting"""\n    try:\n        # Simulate data processing\n        if not isinstance(data, list):\n            raise TypeError("Data must be a list")\n        \n        processed = []\n        for i, item in enumerate(data):\n            try:\n                # Simulate processing each item\n                if isinstance(item, str):\n                    result = len(item)\n                elif isinstance(item, (int, float)):\n                    result = item * 2\n                else:\n                    raise ValueError(f"Unsupported data type: {type(item)}")\n                processed.append(result)\n            except ValueError as e:\n                # Re-raise with additional context\n                raise ValueError(f"Error processing item {i}: {item}") from e\n        \n        return processed\n    \n    except Exception as e:\n        print(f"Data processing failed: {e}")\n        print("Full traceback:")\n        traceback.print_exc()\n        return None\n\n# Context manager example\nclass DebugContext:\n    """Custom context manager for debugging"""\n    def __init__(self, name):\n        self.name = name\n    \n    def __enter__(self):\n        print(f"Entering {self.name}")\n        return self\n    \n    def __exit__(self, exc_type, exc_value, traceback):\n        if exc_type:\n            print(f"Exception in {self.name}: {exc_type.__name__}: {exc_value}")\n            return False  # Don\'t suppress the exception\n        else:\n            print(f"Successfully completed {self.name}")\n\n# Testing advanced exception handling\nprint(\'Testing exception chaining:\')\nresult1 = process_data([1, 2, \'hello\', 3.14])\nprint(f\'Result 1: {result1}\\n\')\n\nresult2 = process_data([1, 2, {\'invalid\': \'dict\'}, 4])\nprint(f\'Result 2: {result2}\\n\')\n\n# Testing context manager\nprint(\'Testing custom context manager:\')\nwith DebugContext(\'data processing\'):\n    numbers = [1, 2, 3]\n    total = sum(numbers)\n    print(f\'Sum: {total}\')\n\nprint()  # Empty line\nwith DebugContext(\'error scenario\'):\n    result = 10 / 0  # This will cause an exception',
          explanation:
            "Exception chaining preserves the original error context. Context managers ensure cleanup code runs even when exceptions occur.",
          interactive: true,
        },
        {
          id: 5,
          title: "Best Practices for Error Handling",
          description:
            "Learn professional error handling patterns and best practices",
          code: "# Error handling best practices\nimport logging\n\n# Configure logging\nlogging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')\n\nclass DataValidator:\n    \"\"\"Demonstrates professional error handling patterns\"\"\"\n    \n    @staticmethod\n    def validate_email(email):\n        \"\"\"Validate email format\"\"\"\n        if not isinstance(email, str):\n            raise TypeError(\"Email must be a string\")\n        if '@' not in email or '.' not in email:\n            raise ValueError(f\"Invalid email format: {email}\")\n        return email.lower().strip()\n    \n    @staticmethod\n    def safe_convert_to_int(value, default=0):\n        \"\"\"Safely convert value to integer with fallback\"\"\"\n        try:\n            return int(value)\n        except (ValueError, TypeError) as e:\n            logging.warning(f\"Could not convert '{value}' to int: {e}. Using default: {default}\")\n            return default\n    \n    @staticmethod\n    def process_user_data(user_data):\n        \"\"\"Process user data with comprehensive error handling\"\"\"\n        errors = []\n        processed_data = {}\n        \n        # Validate required fields\n        required_fields = ['name', 'email', 'age']\n        for field in required_fields:\n            if field not in user_data:\n                errors.append(f\"Missing required field: {field}\")\n        \n        if errors:\n            raise ValueError(f\"Validation errors: {', '.join(errors)}\")\n        \n        # Process each field with individual error handling\n        try:\n            processed_data['name'] = user_data['name'].strip().title()\n        except AttributeError:\n            errors.append(\"Name must be a string\")\n        \n        try:\n            processed_data['email'] = DataValidator.validate_email(user_data['email'])\n        except (TypeError, ValueError) as e:\n            errors.append(str(e))\n        \n        processed_data['age'] = DataValidator.safe_convert_to_int(\n            user_data.get('age'), default=None\n        )\n        \n        if processed_data['age'] is None:\n            errors.append(\"Invalid age value\")\n        \n        if errors:\n            raise ValueError(f\"Processing errors: {', '.join(errors)}\")\n        \n        return processed_data\n\n# Testing best practices\nprint('Testing professional error handling:')\n\n# Valid data\ntry:\n    valid_user = {\n        'name': '  alice johnson  ',\n        'email': 'ALICE@EXAMPLE.COM',\n        'age': '25'\n    }\n    result = DataValidator.process_user_data(valid_user)\n    print(f'Successfully processed: {result}')\nexcept ValueError as e:\n    print(f'Validation error: {e}')\n\nprint()\n\n# Invalid data\ntry:\n    invalid_user = {\n        'name': 123,  # Wrong type\n        'email': 'invalid-email',  # Invalid format\n        'age': 'not-a-number'  # Invalid age\n    }\n    result = DataValidator.process_user_data(invalid_user)\nexcept ValueError as e:\n    print(f'Multiple validation errors: {e}')\n\n# Demonstrating safe conversion\nprint('\\nTesting safe conversion:')\nvalues = ['42', 'not-a-number', None, 3.14]\nfor value in values:\n    converted = DataValidator.safe_convert_to_int(value, default=-1)\n    print(f\"'{value}' -> {converted}\")",
          explanation:
            "Professional error handling includes logging, validation, graceful degradation, and clear error messages for better debugging and user experience.",
          interactive: true,
        },
      ],
      timeLimit: 1920,
      language: "Python",
    },
    settings: {
      livePreview: true,
      showResults: true,
      allowHints: true,
    },
    isActive: true,
    sortOrder: 8,
  },

  // 9. File Operations and I/O
  {
    title: "Python File Operations Interactive Demo",
    description:
      "Master file reading, writing, and processing through hands-on examples",
    activityType: "interactive_demo",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 38,
    experienceReward: 80,
    estimatedMinutes: 35,
    tags: ["file-operations", "io", "text-processing", "data-persistence"],
    content: {
      title: "File Operations and I/O Mastery",
      description:
        "Learn to work with files, process data, and handle I/O operations safely",
      steps: [
        {
          id: 1,
          title: "Basic File Reading and Writing",
          description:
            "Learn fundamental file operations with proper resource management",
          code: "# Basic file operations (simulated)\n\n# Simulating file content for demonstration\nsample_file_content = '''Hello, World!\nThis is a sample text file.\nIt contains multiple lines.\nPython file operations are powerful!'''\n\nprint('Simulated file content:')\nprint(sample_file_content)\nprint('-' * 40)\n\n# Reading entire file\nprint('Reading entire file:')\nlines = sample_file_content.split('\\n')\nfor line_num, line in enumerate(lines, 1):\n    print(f'{line_num}: {line}')\n\n# Reading line by line\nprint('\\nProcessing line by line:')\nfor line in lines:\n    if 'Python' in line:\n        print(f'Found Python reference: {line}')\n    word_count = len(line.split())\n    print(f'Line has {word_count} words: {line[:30]}...')\n\n# Writing to file (simulated)\nprint('\\nSimulating file writing:')\nnew_content = [\n    'This is new content',\n    'Written by Python program',\n    'Each line is added separately'\n]\n\nprint('Content to write:')\nfor line in new_content:\n    print(f'Writing: {line}')\n\n# Appending to file (simulated)\nprint('\\nSimulating file appending:')\nappend_content = 'This line is appended'\nprint(f'Appending: {append_content}')",
          explanation:
            "File operations in Python use open() function. Always use proper resource management with 'with' statements in real code.",
          interactive: true,
          questions: [
            {
              question:
                "What's the advantage of using 'with' statements for file operations?",
              options: [
                "Files are read faster",
                "Automatic resource cleanup",
                "Files take less memory",
                "Better error messages",
              ],
              correct: 1,
            },
          ],
        },
        {
          id: 2,
          title: "File Modes and Text Processing",
          description:
            "Understand different file modes and text processing techniques",
          code: "# Different file modes demonstration (conceptual)\nprint('File modes explanation:')\nfile_modes = {\n    'r': 'Read only (default)',\n    'w': 'Write only (overwrites existing)',\n    'a': 'Append only',\n    'r+': 'Read and write',\n    'w+': 'Write and read (overwrites)',\n    'a+': 'Append and read'\n}\n\nfor mode, description in file_modes.items():\n    print(f\"'{mode}': {description}\")\n\n# Text processing example\nprint('\\nText processing example:')\nsample_text = '''Python Programming Language\nPython is powerful and versatile.\nMany developers love Python for its simplicity.\nPython is used in web development, data science, and AI.'''\n\nprint('Original text:')\nprint(sample_text)\n\n# Processing statistics\nlines = sample_text.split('\\n')\nword_count = sum(len(line.split()) for line in lines)\nchar_count = len(sample_text)\npython_mentions = sample_text.lower().count('python')\n\nprint(f'\\nText statistics:')\nprint(f'Lines: {len(lines)}')\nprint(f'Words: {word_count}')\nprint(f'Characters: {char_count}')\nprint(f'Python mentions: {python_mentions}')\n\n# Text transformation\nprint('\\nText transformations:')\nuppercase_lines = [line.upper() for line in lines]\nprint('Uppercase version:')\nfor line in uppercase_lines[:2]:  # Show first 2 lines\n    print(line)\n\n# Finding longest line\nlongest_line = max(lines, key=len)\nprint(f'\\nLongest line ({len(longest_line)} chars): {longest_line}')",
          explanation:
            "Different file modes serve different purposes. Text processing often involves reading, analyzing, and transforming content.",
          interactive: true,
          questions: [
            {
              question:
                "Which file mode would you use to add content to the end of an existing file?",
              options: ["'r'", "'w'", "'a'", "'r+'"],
              correct: 2,
            },
          ],
        },
        {
          id: 3,
          title: "CSV and Structured Data Processing",
          description:
            "Learn to work with CSV files and structured data formats",
          code: "# CSV data processing simulation\nimport csv\nfrom io import StringIO\n\n# Simulated CSV data\ncsv_data = '''name,age,city,salary\nAlice,25,New York,75000\nBob,30,Los Angeles,82000\nCharlie,35,Chicago,78000\nDiana,28,Boston,71000\nEve,32,Seattle,85000'''\n\nprint('Sample CSV data:')\nprint(csv_data)\nprint('-' * 50)\n\n# Reading CSV data\nprint('Reading CSV data:')\ncsv_file = StringIO(csv_data)\nreader = csv.DictReader(csv_file)\n\nemployees = []\nfor row in reader:\n    # Convert numeric fields\n    row['age'] = int(row['age'])\n    row['salary'] = int(row['salary'])\n    employees.append(row)\n    print(f\"{row['name']}: {row['age']} years, {row['city']}, ${row['salary']:,}\")\n\n# Data analysis\nprint('\\nData analysis:')\ntotal_employees = len(employees)\naverage_age = sum(emp['age'] for emp in employees) / total_employees\naverage_salary = sum(emp['salary'] for emp in employees) / total_employees\n\nprint(f'Total employees: {total_employees}')\nprint(f'Average age: {average_age:.1f} years')\nprint(f'Average salary: ${average_salary:,.2f}')\n\n# Finding specific data\nprint('\\nSpecific queries:')\nhigh_earners = [emp for emp in employees if emp['salary'] > 80000]\nprint(f'High earners (>$80k): {[emp[\"name\"] for emp in high_earners]}')\n\nyoung_employees = [emp for emp in employees if emp['age'] < 30]\nprint(f'Young employees (<30): {[emp[\"name\"] for emp in young_employees]}')\n\n# Creating summary report\nprint('\\nGenerating summary report:')\ncity_stats = {}\nfor emp in employees:\n    city = emp['city']\n    if city not in city_stats:\n        city_stats[city] = {'count': 0, 'total_salary': 0}\n    city_stats[city]['count'] += 1\n    city_stats[city]['total_salary'] += emp['salary']\n\nprint('City-wise statistics:')\nfor city, stats in city_stats.items():\n    avg_salary = stats['total_salary'] / stats['count']\n    print(f'{city}: {stats[\"count\"]} employees, avg salary ${avg_salary:,.2f}')",
          explanation:
            "CSV files are common for data exchange. Python's csv module provides powerful tools for reading and processing structured data.",
          interactive: true,
        },
        {
          id: 4,
          title: "JSON Data Processing",
          description:
            "Learn to work with JSON files for data storage and APIs",
          code: '# JSON data processing\nimport json\n\n# Sample JSON data (as string for demonstration)\njson_data = \'\'\'\n{\n  "users": [\n    {\n      "id": 1,\n      "name": "Alice Johnson",\n      "email": "alice@example.com",\n      "profile": {\n        "age": 25,\n        "interests": ["programming", "reading", "travel"],\n        "premium": true\n      }\n    },\n    {\n      "id": 2,\n      "name": "Bob Smith",\n      "email": "bob@example.com",\n      "profile": {\n        "age": 30,\n        "interests": ["gaming", "cooking"],\n        "premium": false\n      }\n    }\n  ],\n  "metadata": {\n    "version": "1.0",\n    "last_updated": "2024-01-15"\n  }\n}\'\'\'\n\nprint(\'Sample JSON data:\')\nprint(json_data[:200] + \'...\')  # Show first 200 characters\nprint(\'-\' * 50)\n\n# Parsing JSON\ndata = json.loads(json_data)\nprint(\'Parsed JSON data:\')\nprint(f\'Users count: {len(data["users"])}\')\nprint(f\'Version: {data["metadata"]["version"]}\')\n\n# Accessing nested data\nprint(\'\\nUser information:\')\nfor user in data[\'users\']:\n    name = user[\'name\']\n    email = user[\'email\']\n    age = user[\'profile\'][\'age\']\n    interests = \', \'.join(user[\'profile\'][\'interests\'])\n    premium = \'Yes\' if user[\'profile\'][\'premium\'] else \'No\'\n    \n    print(f\'{name} ({email})\')\n    print(f\'  Age: {age}, Premium: {premium}\')\n    print(f\'  Interests: {interests}\')\n    print()\n\n# Modifying JSON data\nprint(\'Modifying data:\')\n# Add new user\nnew_user = {\n    "id": 3,\n    "name": "Charlie Brown",\n    "email": "charlie@example.com",\n    "profile": {\n        "age": 28,\n        "interests": ["music", "sports"],\n        "premium": True\n    }\n}\n\ndata[\'users\'].append(new_user)\ndata[\'metadata\'][\'last_updated\'] = \'2024-01-16\'\n\nprint(f\'Added new user: {new_user["name"]}\')\nprint(f\'Total users now: {len(data["users"])}\')\n\n# Converting back to JSON\nprint(\'\\nConverting back to JSON:\')\nupdated_json = json.dumps(data, indent=2)\nprint(\'Updated JSON (first 300 characters):\')\nprint(updated_json[:300] + \'...\')\n\n# JSON data analysis\nprint(\'\\nData analysis:\')\nall_interests = []\nfor user in data[\'users\']:\n    all_interests.extend(user[\'profile\'][\'interests\'])\n\ninterest_count = {}\nfor interest in all_interests:\n    interest_count[interest] = interest_count.get(interest, 0) + 1\n\nprint(\'Interest popularity:\')\nfor interest, count in sorted(interest_count.items(), key=lambda x: x[1], reverse=True):\n    print(f\'{interest}: {count} users\')',
          explanation:
            "JSON is perfect for structured data exchange. Python's json module makes it easy to convert between JSON strings and Python objects.",
          interactive: true,
        },
        {
          id: 5,
          title: "Error Handling in File Operations",
          description:
            "Learn robust file handling with comprehensive error management",
          code: "# Robust file operations with error handling\nimport os\nfrom pathlib import Path\n\ndef safe_file_operations():\n    \"\"\"Demonstrate safe file operations with error handling\"\"\"\n    \n    print('Safe file operations demonstration:')\n    \n    # Simulating different file operation scenarios\n    scenarios = [\n        {'file': 'existing_file.txt', 'exists': True, 'content': 'File content here'},\n        {'file': 'missing_file.txt', 'exists': False, 'content': None},\n        {'file': 'readonly_file.txt', 'exists': True, 'readonly': True, 'content': 'Read-only content'}\n    ]\n    \n    for scenario in scenarios:\n        filename = scenario['file']\n        print(f'\\nTesting with {filename}:')\n        \n        # Simulate file reading\n        try:\n            if not scenario['exists']:\n                raise FileNotFoundError(f\"File '{filename}' not found\")\n            \n            content = scenario['content']\n            print(f'Successfully read: {content}')\n            \n            # Analyze content\n            if content:\n                word_count = len(content.split())\n                char_count = len(content)\n                print(f'Analysis: {word_count} words, {char_count} characters')\n            \n        except FileNotFoundError as e:\n            print(f'File error: {e}')\n            print('Consider creating the file or checking the path')\n        \n        except PermissionError as e:\n            print(f'Permission error: {e}')\n            print('Check file permissions or run with appropriate privileges')\n        \n        except Exception as e:\n            print(f'Unexpected error: {e}')\n    \n    # Simulating safe file writing\n    print('\\nSafe file writing demonstration:')\n    \n    def safe_write_file(filename, content):\n        \"\"\"Safely write content to file with error handling\"\"\"\n        try:\n            print(f'Attempting to write to {filename}')\n            \n            # Check if directory exists (simulated)\n            directory = os.path.dirname(filename) or '.'\n            print(f'Directory check: {directory} exists')\n            \n            # Simulate writing\n            print(f'Writing {len(content)} characters')\n            print(f'Content preview: {content[:50]}...')\n            \n            # Simulate backup creation\n            if filename.endswith('.txt'):\n                backup_name = filename.replace('.txt', '_backup.txt')\n                print(f'Created backup: {backup_name}')\n            \n            print('File written successfully')\n            return True\n            \n        except PermissionError:\n            print(f'Cannot write to {filename}: Permission denied')\n            return False\n        except OSError as e:\n            print(f'OS error writing {filename}: {e}')\n            return False\n        except Exception as e:\n            print(f'Unexpected error: {e}')\n            return False\n    \n    # Test safe writing\n    test_files = [\n        ('output.txt', 'This is test content for the file.'),\n        ('/root/protected.txt', 'This should fail due to permissions'),\n        ('data/results.txt', 'Content for subdirectory file')\n    ]\n    \n    for filename, content in test_files:\n        success = safe_write_file(filename, content)\n        print(f'Write operation: {\"SUCCESS\" if success else \"FAILED\"}\\n')\n    \n    # File validation utility\n    print('File validation utility:')\n    \n    def validate_file_for_processing(filename):\n        \"\"\"Validate file before processing\"\"\"\n        checks = {\n            'exists': True,  # Simulated\n            'readable': True,  # Simulated\n            'not_empty': True,  # Simulated\n            'valid_extension': filename.endswith(('.txt', '.csv', '.json'))\n        }\n        \n        print(f'Validating {filename}:')\n        for check, passed in checks.items():\n            status = '✓' if passed else '✗'\n            print(f'  {status} {check.replace(\"_\", \" \").title()}')\n        \n        all_passed = all(checks.values())\n        print(f'Overall: {\"VALID\" if all_passed else \"INVALID\"}')\n        return all_passed\n    \n    # Test validation\n    test_validation_files = ['data.txt', 'report.csv', 'config.json', 'program.exe']\n    for test_file in test_validation_files:\n        validate_file_for_processing(test_file)\n        print()\n\n# Run the demonstration\nsafe_file_operations()",
          explanation:
            "Robust file operations require comprehensive error handling for various failure scenarios like missing files, permission issues, and disk space problems.",
          interactive: true,
        },
      ],
      timeLimit: 2100,
      language: "Python",
    },
    settings: {
      livePreview: true,
      showResults: true,
      allowHints: true,
    },
    isActive: true,
    sortOrder: 9,
  },

  // 10. Object-Oriented Programming Fundamentals
  {
    title: "Python OOP Fundamentals Interactive Demo",
    description:
      "Master object-oriented programming concepts through comprehensive examples",
    activityType: "interactive_demo",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 40,
    experienceReward: 85,
    estimatedMinutes: 38,
    tags: ["oop", "classes", "objects", "inheritance"],
    content: {
      title: "Object-Oriented Programming Mastery",
      description:
        "Learn classes, objects, inheritance, and OOP principles through hands-on examples",
      steps: [
        {
          id: 1,
          title: "Classes and Objects Basics",
          description: "Learn to create classes and instantiate objects",
          code: "# Basic class definition and object creation\nclass Student:\n    \"\"\"A simple Student class\"\"\"\n    \n    # Class variable (shared by all instances)\n    school_name = 'Python University'\n    student_count = 0\n    \n    def __init__(self, name, age, student_id):\n        \"\"\"Constructor method - initializes object\"\"\"\n        # Instance variables (unique to each object)\n        self.name = name\n        self.age = age\n        self.student_id = student_id\n        self.grades = []\n        \n        # Update class variable\n        Student.student_count += 1\n        print(f'Created student: {self.name}')\n    \n    def introduce(self):\n        \"\"\"Instance method to introduce the student\"\"\"\n        return f'Hi, I am {self.name}, {self.age} years old, student ID: {self.student_id}'\n    \n    def add_grade(self, subject, grade):\n        \"\"\"Add a grade for a subject\"\"\"\n        self.grades.append({'subject': subject, 'grade': grade})\n        print(f'Added grade {grade} for {subject} to {self.name}')\n    \n    def get_gpa(self):\n        \"\"\"Calculate and return GPA\"\"\"\n        if not self.grades:\n            return 0.0\n        total = sum(grade_info['grade'] for grade_info in self.grades)\n        return round(total / len(self.grades), 2)\n\n# Creating objects (instances)\nprint('Creating Student objects:')\nstudent1 = Student('Alice Johnson', 20, 'S001')\nstudent2 = Student('Bob Smith', 19, 'S002')\nstudent3 = Student('Charlie Brown', 21, 'S003')\n\nprint(f'\\nTotal students created: {Student.student_count}')\nprint(f'School name: {Student.school_name}')\n\n# Using object methods\nprint('\\nStudent introductions:')\nprint(student1.introduce())\nprint(student2.introduce())\n\n# Adding grades and calculating GPA\nprint('\\nAdding grades:')\nstudent1.add_grade('Math', 95)\nstudent1.add_grade('Physics', 87)\nstudent1.add_grade('Chemistry', 92)\n\nstudent2.add_grade('Math', 88)\nstudent2.add_grade('Physics', 94)\n\nprint(f'\\n{student1.name} GPA: {student1.get_gpa()}')\nprint(f'{student2.name} GPA: {student2.get_gpa()}')\nprint(f'{student3.name} GPA: {student3.get_gpa()}')",
          explanation:
            "Classes are blueprints for objects. __init__ is the constructor, instance variables are unique to each object, class variables are shared.",
          interactive: true,
          questions: [
            {
              question:
                "What's the difference between class variables and instance variables?",
              options: [
                "No difference",
                "Class variables are shared, instance variables are unique",
                "Instance variables are shared, class variables are unique",
                "Class variables are faster",
              ],
              correct: 1,
            },
          ],
        },
        {
          id: 2,
          title: "Encapsulation and Data Privacy",
          description: "Learn about private attributes and methods",
          code: "# Encapsulation and data privacy\nclass BankAccount:\n    \"\"\"Bank account with encapsulated data\"\"\"\n    \n    def __init__(self, account_holder, initial_balance=0):\n        self.account_holder = account_holder\n        self._account_number = f'ACC{id(self) % 100000:05d}'  # Protected\n        self.__balance = initial_balance  # Private\n        self.__transaction_history = []  # Private\n        \n        print(f'Account created for {account_holder}')\n        print(f'Account number: {self._account_number}')\n    \n    def deposit(self, amount):\n        \"\"\"Public method to deposit money\"\"\"\n        if amount > 0:\n            self.__balance += amount\n            self.__add_transaction('deposit', amount)\n            print(f'Deposited ${amount}. New balance: ${self.__balance}')\n            return True\n        else:\n            print('Deposit amount must be positive')\n            return False\n    \n    def withdraw(self, amount):\n        \"\"\"Public method to withdraw money\"\"\"\n        if amount > 0 and amount <= self.__balance:\n            self.__balance -= amount\n            self.__add_transaction('withdrawal', amount)\n            print(f'Withdrew ${amount}. New balance: ${self.__balance}')\n            return True\n        else:\n            print('Invalid withdrawal amount or insufficient funds')\n            return False\n    \n    def get_balance(self):\n        \"\"\"Public method to check balance\"\"\"\n        return self.__balance\n    \n    def __add_transaction(self, transaction_type, amount):\n        \"\"\"Private method to record transactions\"\"\"\n        self.__transaction_history.append({\n            'type': transaction_type,\n            'amount': amount,\n            'balance_after': self.__balance\n        })\n    \n    def get_transaction_history(self):\n        \"\"\"Public method to get transaction history\"\"\"\n        return self.__transaction_history.copy()  # Return copy for safety\n    \n    def __str__(self):\n        \"\"\"String representation\"\"\"\n        return f'BankAccount({self.account_holder}, ${self.__balance})'\n\n# Testing encapsulation\nprint('Testing encapsulation:')\naccount = BankAccount('Alice Johnson', 1000)\n\nprint('\\nAccount operations:')\naccount.deposit(500)\naccount.withdraw(200)\naccount.withdraw(2000)  # Should fail\n\nprint(f'\\nCurrent balance: ${account.get_balance()}')\n\n# Accessing public attributes\nprint(f'Account holder: {account.account_holder}')\nprint(f'Account number: {account._account_number}')  # Protected (convention)\n\n# Trying to access private attributes (this is what we're protecting against)\nprint('\\nTrying to access private data:')\ntry:\n    print(f'Direct balance access: {account.__balance}')  # This will fail\nexcept AttributeError as e:\n    print(f'Cannot access private attribute: {e}')\n\n# But Python provides name mangling access (not recommended)\nprint(f'Name mangled access: ${account._BankAccount__balance}')\nprint('Note: This breaks encapsulation and should be avoided!')\n\n# Transaction history\nprint('\\nTransaction history:')\nfor i, transaction in enumerate(account.get_transaction_history(), 1):\n    print(f'{i}. {transaction[\"type\"].title()}: ${transaction[\"amount\"]}, Balance: ${transaction[\"balance_after\"]}')",
          explanation:
            "Encapsulation hides internal data. Use single underscore for protected (convention), double underscore for private (name mangling).",
          interactive: true,
          questions: [
            {
              question:
                "What does double underscore (__) before an attribute name do?",
              options: [
                "Makes it protected",
                "Makes it private with name mangling",
                "Makes it static",
                "Nothing special",
              ],
              correct: 1,
            },
          ],
        },
        {
          id: 3,
          title: "Inheritance and Method Overriding",
          description: "Learn how classes can inherit from other classes",
          code: '# Inheritance and method overriding\nclass Animal:\n    """Base class for all animals"""\n    \n    def __init__(self, name, species):\n        self.name = name\n        self.species = species\n        self.energy = 100\n    \n    def eat(self, food_amount=10):\n        """Base eating method"""\n        self.energy += food_amount\n        print(f\'{self.name} ate and gained {food_amount} energy. Energy: {self.energy}\')\n    \n    def sleep(self, hours=8):\n        """Base sleeping method"""\n        energy_gained = hours * 5\n        self.energy += energy_gained\n        print(f\'{self.name} slept for {hours} hours and gained {energy_gained} energy\')\n    \n    def make_sound(self):\n        """Base sound method - to be overridden"""\n        print(f\'{self.name} makes a generic animal sound\')\n    \n    def __str__(self):\n        return f\'{self.name} the {self.species} (Energy: {self.energy})\'\n\nclass Dog(Animal):\n    """Dog class inheriting from Animal"""\n    \n    def __init__(self, name, breed):\n        # Call parent constructor\n        super().__init__(name, \'Dog\')\n        self.breed = breed\n        self.loyalty = 100\n    \n    def make_sound(self):\n        """Override the make_sound method"""\n        print(f\'{self.name} says: Woof! Woof!\')\n    \n    def fetch(self, item=\'ball\'):\n        """Dog-specific method"""\n        if self.energy >= 20:\n            self.energy -= 20\n            self.loyalty += 5\n            print(f\'{self.name} fetched the {item}! Loyalty increased. Energy: {self.energy}\')\n        else:\n            print(f\'{self.name} is too tired to fetch\')\n    \n    def __str__(self):\n        return f\'{self.name} the {self.breed} (Energy: {self.energy}, Loyalty: {self.loyalty})\'\n\nclass Cat(Animal):\n    """Cat class inheriting from Animal"""\n    \n    def __init__(self, name, indoor=True):\n        super().__init__(name, \'Cat\')\n        self.indoor = indoor\n        self.independence = 80\n    \n    def make_sound(self):\n        """Override the make_sound method"""\n        print(f\'{self.name} says: Meow! Purr...\')\n    \n    def hunt(self):\n        """Cat-specific method"""\n        if not self.indoor and self.energy >= 30:\n            self.energy -= 30\n            hunt_success = True  # Simplified\n            if hunt_success:\n                self.energy += 40\n                print(f\'{self.name} successfully hunted and gained energy!\')\n            else:\n                print(f\'{self.name} hunted but caught nothing\')\n        elif self.indoor:\n            print(f\'{self.name} is an indoor cat and cannot hunt\')\n        else:\n            print(f\'{self.name} is too tired to hunt\')\n    \n    def sleep(self, hours=12):  # Cats sleep more\n        """Override sleep method for cats"""\n        energy_gained = hours * 7  # Cats gain more energy from sleep\n        self.energy += energy_gained\n        print(f\'{self.name} slept for {hours} hours (cats love sleep!) and gained {energy_gained} energy\')\n\n# Testing inheritance\nprint(\'Testing inheritance:\')\n\n# Create animals\ngeneric_animal = Animal(\'Generic\', \'Unknown\')\ndog = Dog(\'Buddy\', \'Golden Retriever\')\ncat = Cat(\'Whiskers\', indoor=False)\n\nprint(\'\\nCreated animals:\')\nprint(generic_animal)\nprint(dog)\nprint(cat)\n\n# Test polymorphism - same method, different behavior\nprint(\'\\nPolymorphism - make_sound():\')\nanimals = [generic_animal, dog, cat]\nfor animal in animals:\n    animal.make_sound()\n\n# Test inherited methods\nprint(\'\\nTesting inherited methods:\')\ndog.eat(15)\ncat.eat(10)\n\n# Test overridden methods\nprint(\'\\nTesting overridden sleep:\')\ndog.sleep(8)  # Uses base Animal sleep\ncat.sleep(12)  # Uses overridden Cat sleep\n\n# Test specific methods\nprint(\'\\nTesting animal-specific methods:\')\ndog.fetch(\'stick\')\ndog.fetch(\'ball\')\ncat.hunt()\n\nprint(\'\\nFinal states:\')\nprint(dog)\nprint(cat)',
          explanation:
            "Inheritance allows classes to inherit attributes and methods from parent classes. super() calls parent methods. Method overriding changes inherited behavior.",
          interactive: true,
          questions: [
            {
              question: "What does super() do in a child class?",
              options: [
                "Creates a new instance",
                "Calls parent class methods",
                "Deletes the parent",
                "Nothing",
              ],
              correct: 1,
            },
          ],
        },
        {
          id: 4,
          title: "Class Methods and Static Methods",
          description: "Learn about different types of methods in classes",
          code: '# Class methods and static methods\nclass MathUtility:\n    """Utility class demonstrating different method types"""\n    \n    # Class variable\n    calculation_count = 0\n    \n    def __init__(self, name):\n        self.name = name\n        self.personal_calculations = 0\n    \n    def instance_method(self, x, y):\n        """Regular instance method - has access to self"""\n        result = x + y\n        self.personal_calculations += 1\n        MathUtility.calculation_count += 1\n        print(f\'{self.name} calculated: {x} + {y} = {result}\')\n        return result\n    \n    @classmethod\n    def class_method(cls, x, y):\n        """Class method - has access to class (cls), not instance"""\n        result = x * y\n        cls.calculation_count += 1\n        print(f\'Class method calculated: {x} * {y} = {result}\')\n        print(f\'Total calculations so far: {cls.calculation_count}\')\n        return result\n    \n    @staticmethod\n    def static_method(x, y):\n        """Static method - no access to class or instance"""\n        result = x ** y\n        print(f\'Static method calculated: {x} ^ {y} = {result}\')\n        return result\n    \n    @classmethod\n    def get_calculation_stats(cls):\n        """Class method to get statistics"""\n        return {\n            \'total_calculations\': cls.calculation_count,\n            \'class_name\': cls.__name__\n        }\n    \n    @staticmethod\n    def validate_numbers(*numbers):\n        """Static method to validate if all arguments are numbers"""\n        for num in numbers:\n            if not isinstance(num, (int, float)):\n                return False\n        return True\n    \n    def __str__(self):\n        return f\'{self.name} (Personal calculations: {self.personal_calculations})\'\n\nclass AdvancedMath(MathUtility):\n    """Child class to demonstrate inheritance with different method types"""\n    \n    @classmethod\n    def factorial(cls, n):\n        """Class method to calculate factorial"""\n        if not isinstance(n, int) or n < 0:\n            return None\n        \n        result = 1\n        for i in range(1, n + 1):\n            result *= i\n        \n        cls.calculation_count += 1\n        print(f\'Factorial of {n} = {result}\')\n        return result\n    \n    @staticmethod\n    def is_prime(n):\n        """Static method to check if number is prime"""\n        if n < 2:\n            return False\n        for i in range(2, int(n ** 0.5) + 1):\n            if n % i == 0:\n                return False\n        return True\n\n# Testing different method types\nprint(\'Testing different method types:\')\n\n# Create instances\nmath1 = MathUtility(\'Alice\')\nmath2 = MathUtility(\'Bob\')\nadvanced = AdvancedMath(\'Charlie\')\n\nprint(\'\\nInstance methods (require object):\')\nmath1.instance_method(5, 3)\nmath2.instance_method(10, 7)\n\nprint(\'\\nClass methods (can be called on class or instance):\')\nMathUtility.class_method(4, 6)  # Called on class\nmath1.class_method(3, 8)  # Called on instance\n\nprint(\'\\nStatic methods (independent of class/instance):\')\nMathUtility.static_method(2, 5)  # Called on class\nmath2.static_method(3, 4)  # Called on instance\n\n# Can also call static method without any class instance\nresult = MathUtility.static_method(10, 2)\n\nprint(\'\\nValidation with static method:\')\nprint(f\'Are 1, 2, 3 all numbers? {MathUtility.validate_numbers(1, 2, 3)}\')\nprint(f\'Are 1, "hello", 3 all numbers? {MathUtility.validate_numbers(1, "hello", 3)}\')\n\nprint(\'\\nClass method statistics:\')\nstats = MathUtility.get_calculation_stats()\nprint(f\'Statistics: {stats}\')\n\nprint(\'\\nAdvanced math methods:\')\nAdvancedMath.factorial(5)\nAdvancedMath.factorial(0)\n\nprint(\'\\nPrime number checking:\')\ntest_numbers = [2, 3, 4, 17, 25, 29]\nfor num in test_numbers:\n    is_prime = AdvancedMath.is_prime(num)\n    print(f\'{num} is {"prime" if is_prime else "not prime"}\')\n\nprint(\'\\nFinal object states:\')\nprint(math1)\nprint(math2)\nprint(advanced)\n\nprint(f\'\\nTotal calculations across all instances: {MathUtility.calculation_count}\')',
          explanation:
            "Instance methods need 'self', class methods need 'cls' and work with class data, static methods are independent utility functions.",
          interactive: true,
        },
        {
          id: 5,
          title: "Properties and Special Methods",
          description:
            "Learn about properties, getters, setters, and magic methods",
          code: '# Properties and special methods (magic methods)\nclass Temperature:\n    """Class demonstrating properties and special methods"""\n    \n    def __init__(self, celsius=0):\n        self._celsius = celsius  # Private attribute\n    \n    @property\n    def celsius(self):\n        """Getter for celsius"""\n        return self._celsius\n    \n    @celsius.setter\n    def celsius(self, value):\n        """Setter for celsius with validation"""\n        if value < -273.15:\n            raise ValueError("Temperature cannot be below absolute zero (-273.15°C)")\n        self._celsius = value\n    \n    @property\n    def fahrenheit(self):\n        """Calculate fahrenheit from celsius"""\n        return (self._celsius * 9/5) + 32\n    \n    @fahrenheit.setter\n    def fahrenheit(self, value):\n        """Set celsius from fahrenheit"""\n        celsius = (value - 32) * 5/9\n        self.celsius = celsius  # Uses the celsius setter for validation\n    \n    @property\n    def kelvin(self):\n        """Calculate kelvin from celsius"""\n        return self._celsius + 273.15\n    \n    # Special methods (magic methods)\n    def __str__(self):\n        """String representation for users"""\n        return f\'{self._celsius:.1f}°C\'\n    \n    def __repr__(self):\n        """String representation for developers"""\n        return f\'Temperature({self._celsius})\'\n    \n    def __eq__(self, other):\n        """Equality comparison"""\n        if isinstance(other, Temperature):\n            return abs(self._celsius - other._celsius) < 0.01\n        return False\n    \n    def __lt__(self, other):\n        """Less than comparison"""\n        if isinstance(other, Temperature):\n            return self._celsius < other._celsius\n        return NotImplemented\n    \n    def __add__(self, other):\n        """Addition operation"""\n        if isinstance(other, Temperature):\n            return Temperature(self._celsius + other._celsius)\n        elif isinstance(other, (int, float)):\n            return Temperature(self._celsius + other)\n        return NotImplemented\n    \n    def __len__(self):\n        """Length (absolute value of temperature)"""\n        return int(abs(self._celsius))\n    \n    def __bool__(self):\n        """Boolean conversion (True if above freezing)"""\n        return self._celsius > 0\n\nclass TemperatureCollection:\n    """Collection class demonstrating more special methods"""\n    \n    def __init__(self):\n        self.temperatures = []\n    \n    def add_temperature(self, temp):\n        """Add a temperature to the collection"""\n        if isinstance(temp, Temperature):\n            self.temperatures.append(temp)\n        else:\n            self.temperatures.append(Temperature(temp))\n    \n    def __len__(self):\n        """Number of temperatures"""\n        return len(self.temperatures)\n    \n    def __getitem__(self, index):\n        """Get temperature by index"""\n        return self.temperatures[index]\n    \n    def __setitem__(self, index, value):\n        """Set temperature by index"""\n        if isinstance(value, Temperature):\n            self.temperatures[index] = value\n        else:\n            self.temperatures[index] = Temperature(value)\n    \n    def __iter__(self):\n        """Make the collection iterable"""\n        return iter(self.temperatures)\n    \n    def __contains__(self, temp):\n        """Check if temperature exists in collection"""\n        return temp in self.temperatures\n\n# Testing properties and special methods\nprint(\'Testing properties and special methods:\')\n\n# Create temperature objects\ntemp1 = Temperature(25)  # 25°C\ntemp2 = Temperature()\n\nprint(f\'Initial temperatures:\')\nprint(f\'temp1: {temp1} ({temp1.fahrenheit:.1f}°F, {temp1.kelvin:.1f}K)\')\nprint(f\'temp2: {temp2}\')\n\n# Test property setters\nprint(\'\\nSetting temperatures using different scales:\')\ntemp2.fahrenheit = 68  # Should set celsius to 20\nprint(f\'Set temp2 to 68°F: {temp2} ({temp2.fahrenheit:.1f}°F)\')\n\ntemp3 = Temperature()\ntemp3.celsius = 0  # Freezing point\nprint(f\'Set temp3 to 0°C: {temp3} ({temp3.fahrenheit:.1f}°F, {temp3.kelvin:.1f}K)\')\n\n# Test validation\nprint(\'\\nTesting validation:\')\ntry:\n    temp_invalid = Temperature(-300)  # Below absolute zero\nexcept ValueError as e:\n    print(f\'Validation error: {e}\')\n\n# Test special methods\nprint(\'\\nTesting special methods:\')\nprint(f\'str(temp1): {str(temp1)}\')\nprint(f\'repr(temp1): {repr(temp1)}\')\n\n# Comparison operations\nprint(f\'\\nComparisons:\')\nprint(f\'temp1 == temp2: {temp1 == temp2}\')\nprint(f\'temp1 < temp2: {temp1 < temp2}\')\n\n# Arithmetic operations\nprint(f\'\\nArithmetic:\')\ntemp_sum = temp1 + temp2\nprint(f\'{temp1} + {temp2} = {temp_sum}\')\n\ntemp_plus_five = temp1 + 5\nprint(f\'{temp1} + 5°C = {temp_plus_five}\')\n\n# Other special methods\nprint(f\'\\nOther operations:\')\nprint(f\'len(temp1): {len(temp1)} (absolute value as int)\')\nprint(f\'bool(temp1): {bool(temp1)} (above freezing?)\')\nprint(f\'bool(temp3): {bool(temp3)} (above freezing?)\')\n\n# Testing collection class\nprint(\'\\nTesting temperature collection:\')\ncollection = TemperatureCollection()\ncollection.add_temperature(Temperature(20))\ncollection.add_temperature(25)  # Automatically converted\ncollection.add_temperature(Temperature(30))\n\nprint(f\'Collection length: {len(collection)}\')\nprint(f\'First temperature: {collection[0]}\')\n\n# Modify collection\ncollection[1] = Temperature(28)\nprint(f\'Modified second temperature: {collection[1]}\')\n\n# Iterate through collection\nprint(\'\\nAll temperatures in collection:\')\nfor i, temp in enumerate(collection):\n    print(f\'{i}: {temp} ({temp.fahrenheit:.1f}°F)\')\n\n# Test membership\ntest_temp = Temperature(20)\nprint(f\'\\nIs 20°C in collection? {test_temp in collection}\')',
          explanation:
            "Properties provide getter/setter functionality. Special methods (magic methods) define how objects behave with operators and built-in functions.",
          interactive: true,
        },
      ],
      timeLimit: 2280,
      language: "Python",
    },
    settings: {
      livePreview: true,
      showResults: true,
      allowHints: true,
    },
    isActive: true,
    sortOrder: 10,
  },
];

export async function seedInteractiveDemoPythonFundamentalsActivities() {
  console.log("🎯 Seeding Interactive Demo Python Fundamentals activities...");

  if (interactiveDemoPythonFundamentalsActivities.length === 0) {
    console.log(
      "📝 No Interactive Demo Python Fundamentals activities to seed"
    );
    return;
  }

  for (const activity of interactiveDemoPythonFundamentalsActivities) {
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
    `✅ ${interactiveDemoPythonFundamentalsActivities.length} Interactive Demo Python Fundamentals activities seeded successfully`
  );
}

// Execute the seeding function if this file is run directly
if (require.main === module) {
  seedInteractiveDemoPythonFundamentalsActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Interactive Demo Python Fundamentals activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
