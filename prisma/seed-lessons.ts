import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const lessonsData = [
  // BAŞLANGIÇ SEVİYESİ (1-15 Ders)
  {
    id: "lesson_001",
    title: "Welcome to Python!",
    slug: "python-welcome",
    description:
      "Introduction to Python programming language. Learn what Python is, where it's used and why it's so popular.",
    content: {
      sections: {
        introduction: {
          title: "Welcome to the Amazing World of Python!",
          content:
            "Congratulations on starting your programming journey! Python is not just a programming language—it's your gateway to creating amazing applications, solving real-world problems, and building the future of technology.",
        },
        what_is_python: {
          title: "What is Python?",
          content:
            "Python is a high-level, interpreted programming language known for its simple, readable syntax. It was created by Guido van Rossum and released in 1991.",
        },
        why_python: {
          title: "Why Python?",
          content:
            "Python is popular for many reasons:\n- **Beginner-Friendly**: Its syntax is clean and easy to learn.\n- **Versatile**: It's used in web development, data science, AI, and more.\n- **Large Community**: A massive community provides extensive libraries and support.",
        },
      },
    },
    difficulty: 1,
    duration: 20,
    category: "basic",
    type: "theory",
    diamondReward: 20,
    experienceReward: 60,
    order: 1,
    isPublished: true,
    learningObjectives: [
      "Understanding what Python is",
      "Learning Python's usage areas",
      "Writing your first Python program",
      "Using the print function",
    ],
    practicalExercise: {
      description: "Write your first Python program",
      starterCode:
        '# Write your first Python program!\n# Print "Hello, I am [your name]! I am learning Python!"\n',
      solution: 'print("Hello, I am Ali! I am learning Python!")',
      testCases: [
        {
          description: "Output should contain 'Hello'",
          test: "assert 'Hello' in output",
        },
        {
          description: "Output should contain 'Python'",
          test: "assert 'Python' in output",
        },
      ],
    },
    hints: [
      "You can print text using the print() function",
      "Put text in double quotes (\") or single quotes ('')",
      "Don't forget to write your own name!",
    ],
  },

  {
    id: "lesson_002",
    title: "🎮 Variables - Complete Mastery Course",
    slug: "variables",
    description:
      "🎯 COMPREHENSIVE Interactive lesson! Master variables through detailed theory, mini-games, real-time simulations, best practices, and anime-themed challenges. From beginner to expert in one complete course!",
    content: {
      sections: {
        introduction: {
          title: "📦 What is a Variable? - Deep Dive",
          content:
            "Variables are named memory locations that store data values during program execution. Think of them as labeled containers in computer memory - each container has a name (identifier) and holds a value that can change during program execution.\n\n🧠 **Memory Concept**: When you create a variable, Python allocates a memory address and associates it with your variable name. This creates a mapping between human-readable names and machine memory addresses.\n\n🎮 **Interactive Mode**: Experience hands-on learning with drag-drop games and live code simulation!",
        },
        variable_lifecycle: {
          title: "🔄 Variable Lifecycle & Memory Management",
          content:
            '**Variable Lifecycle in Python:**\n\n1. **Declaration & Assignment**: `name = "Goku"` - Python creates memory space and assigns value\n2. **Memory Allocation**: Python automatically manages memory allocation\n3. **Usage**: Variable can be read and modified throughout its scope\n4. **Reassignment**: `name = "Vegeta"` - Points to new memory location\n5. **Garbage Collection**: Python automatically frees unused memory\n\n```python\n# Memory visualization\ncharacter = "Naruto"  # Memory address: 0x1001\nprint(id(character))  # Shows memory address\n\ncharacter = "Sasuke"  # New memory address: 0x1002\nprint(id(character))  # Different address!\n```\n\n⚡ **Performance Tip**: Reassigning variables to different types can impact performance in loops!',
        },
        data_types_deep: {
          title: "🎯 Data Types - Complete Guide",
          content:
            '**Python\'s Core Data Types:**\n\n**1. Numbers (Numeric Types)**\n```python\n# Integer - whole numbers\nage = 17\npower_level = 9000\ndebt = -500\n\n# Float - decimal numbers  \nspeed = 299.99\naccuracy = 0.95\ntemperature = -273.15\n\n# Complex - mathematical complex numbers\nmagic_formula = 3 + 4j\n```\n\n**2. Strings (Text Data)**\n```python\n# Single quotes\nname = \'Monkey D. Luffy\'\n\n# Double quotes\nquote = "I\'m gonna be the Pirate King!"\n\n# Triple quotes for multiline\nstory = \'\'\'Once upon a time,\nin the Grand Line,\na rubber boy started his adventure...\'\'\'\n\n# Raw strings (useful for regex)\npath = r\'C:\\Users\\Anime\\Files\'\n```\n\n**3. Boolean (True/False)**\n```python\nis_protagonist = True\nis_villain = False\nhas_special_power = True\n```\n\n**4. Advanced Types Preview**\n```python\n# List - ordered, mutable collection\nteam = ["Luffy", "Zoro", "Sanji"]\n\n# Dictionary - key-value pairs\ncharacter_info = {"name": "Goku", "power": 9001}\n\n# Tuple - ordered, immutable collection\ncoordinates = (100, 200)\n\n# Set - unordered, unique elements\nunique_abilities = {"Kamehameha", "Rasengan"}\n```',
        },
        naming_conventions: {
          title: "📝 Variable Naming - Best Practices & Rules",
          content:
            '**Mandatory Rules (Python will give errors):**\n✅ Must start with letter (a-z, A-Z) or underscore (_)\n✅ Can contain letters, numbers, underscores\n✅ Case sensitive: `name` ≠ `Name` ≠ `NAME`\n✅ No spaces, special chars (!@#$%^&*-+), or reserved keywords\n\n**Reserved Keywords (Cannot Use):**\n```python\n# These will cause SyntaxError:\nand, as, assert, break, class, continue, def, del,\nelif, else, except, finally, for, from, global,\nif, import, in, is, lambda, not, or, pass,\nraise, return, try, while, with, yield\n```\n\n**Best Practices (Python Style Guide - PEP 8):**\n\n**1. Use snake_case for variables:**\n```python\n# ✅ Good\ncharacter_name = "Goku"\nmax_power_level = 9000\nuser_input_data = "some data"\n\n# ❌ Bad\ncharacterName = "Goku"  # camelCase (use for functions)\nCharacterName = "Goku"  # PascalCase (use for classes)\ncharacter-name = "Goku"  # Invalid syntax\n```\n\n**2. Be Descriptive:**\n```python\n# ✅ Excellent - self-documenting\nmax_allowed_attempts = 3\ncurrent_user_score = 1250\nanime_character_database = {}\n\n# ✅ Good - clear meaning\nname = "Naruto"\nage = 17\n\n# ❌ Poor - unclear meaning\na = "Naruto"\nx = 17\ndata = {}\ntmp = 42\n```\n\n**3. Constants in UPPER_CASE:**\n```python\nMAX_LEVEL = 100\nPI = 3.14159\nDEFAULT_CHARACTER_HEALTH = 1000\n```',
        },
        variable_scope: {
          title: "🌐 Variable Scope - Where Variables Live",
          content:
            '**Understanding Variable Scope:**\n\n**1. Local Scope (Function Level):**\n```python\ndef create_character():\n    # Local variables - only exist inside function\n    name = "Ichigo"  \n    power = 5000\n    print(f"Inside function: {name}")\n    \ncreate_character()\n# print(name)  # ❌ NameError: name not defined\n```\n\n**2. Global Scope (Module Level):**\n```python\n# Global variable - accessible everywhere\ngame_title = "Anime Battle Arena"\nmax_players = 100\n\ndef show_game_info():\n    # Can access global variables\n    print(f"Game: {game_title}")\n    print(f"Max players: {max_players}")\n```\n\n**3. Global Keyword:**\n```python\nscore = 0  # Global variable\n\ndef increase_score(points):\n    global score  # Declare we want to modify global\n    score += points\n    \nincrease_score(100)\nprint(score)  # Output: 100\n```\n\n**4. Scope Hierarchy (LEGB Rule):**\n- **L**ocal (inside function)\n- **E**nclosing (in enclosing function)\n- **G**lobal (module level)\n- **B**uilt-in (Python built-ins)\n\n```python\nname = "Global Goku"  # Global\n\ndef outer_function():\n    name = "Enclosing Vegeta"  # Enclosing\n    \n    def inner_function():\n        name = "Local Piccolo"  # Local\n        print(name)  # Prints: Local Piccolo\n    \n    inner_function()\n    print(name)  # Prints: Enclosing Vegeta\n\nouter_function()\nprint(name)  # Prints: Global Goku\n```',
        },
        type_conversion: {
          title: "🔄 Type Conversion & Casting",
          content:
            '**Automatic Type Conversion (Implicit):**\n```python\n# Python automatically converts when safe\nage = 17        # int\nheight = 175.5  # float\ntotal = age + height  # int + float = float (192.5)\n```\n\n**Manual Type Conversion (Explicit Casting):**\n\n**1. String Conversions:**\n```python\n# To string\npower = 9000\npower_text = str(power)  # "9000"\nmessage = f"Power level: {power}"  # f-string formatting\n\n# From string\nuser_input = "25"\nage = int(user_input)  # 25 (integer)\n\nrating = "8.5"\nscore = float(rating)  # 8.5 (float)\n```\n\n**2. Number Conversions:**\n```python\n# Float to int (truncates decimal)\nspeed = 99.9\nwhole_speed = int(speed)  # 99\n\n# Int to float\nlevel = 42\nfloat_level = float(level)  # 42.0\n```\n\n**3. Boolean Conversions:**\n```python\n# To boolean\nbool("")       # False (empty string)\nbool("Naruto") # True (non-empty string)\nbool(0)        # False (zero)\nbool(42)       # True (non-zero)\nbool([])       # False (empty list)\nbool([1,2,3])  # True (non-empty list)\n\n# From boolean\nint(True)   # 1\nint(False)  # 0\nstr(True)   # "True"\n```\n\n**4. Error Handling in Conversion:**\n```python\ntry:\n    user_age = input("Enter age: ")\n    age = int(user_age)\n    print(f"Your age: {age}")\nexcept ValueError:\n    print("Please enter a valid number!")\n```',
        },
        interactive_elements: {
          title: "🎮 Interactive Features",
          content:
            "This lesson includes:\n- 🎯 **Variable Matching Game**: Drag-drop variable names with values\n- 🧩 **Code Puzzle Challenge**: Arrange code blocks in correct order\n- 🔬 **Memory Visualizer**: See variables in action with real-time simulation\n- ⚔️ **Code Arena**: Build an anime character creator with checkpoints\n- ⚡ **Lightning Quiz**: Speed challenges with leaderboard\n- 🏆 **Bonus Rewards**: Extra diamonds for creativity and speed",
        },
        common_mistakes: {
          title: "⚠️ Common Mistakes & How to Avoid Them",
          content:
            '**1. Undefined Variables:**\n```python\n# ❌ Wrong - variable not defined\nprint(character_name)  # NameError!\n\n# ✅ Correct - define before use\ncharacter_name = "Goku"\nprint(character_name)\n```\n\n**2. Case Sensitivity Errors:**\n```python\n# ❌ Wrong - different variables!\nCharacterName = "Goku"\nprint(charactername)  # NameError!\n\n# ✅ Correct - exact case match\ncharacter_name = "Goku"\nprint(character_name)\n```\n\n**3. Reserved Keyword Usage:**\n```python\n# ❌ Wrong - \'class\' is reserved\nclass = "Saiyan"  # SyntaxError!\n\n# ✅ Correct - use different name\ncharacter_class = "Saiyan"\n```\n\n**4. Type Confusion:**\n```python\n# ❌ Wrong - mixing incompatible types\nage = "17"\nnext_age = age + 1  # TypeError!\n\n# ✅ Correct - convert types\nage = int("17")\nnext_age = age + 1  # 18\n```\n\n**5. Overwriting Built-ins:**\n```python\n# ❌ Wrong - overwriting Python built-in\nlist = [1, 2, 3]  # Now list() function is broken!\n\n# ✅ Correct - use descriptive names\ncharacter_list = [1, 2, 3]\n```\n\n**6. Global vs Local Confusion:**\n```python\nscore = 100  # Global\n\ndef reset_game():\n    score = 0  # Creates new local variable!\n    print(f"Local score: {score}")\n\nreset_game()  # Prints: Local score: 0\nprint(f"Global score: {score}")  # Still 100!\n\n# ✅ Correct way to modify global\ndef reset_game_correctly():\n    global score\n    score = 0\n```',
        },
        best_practices: {
          title: "🏆 Best Practices & Professional Tips",
          content:
            '**1. Meaningful Variable Names:**\n```python\n# ✅ Professional Code\nmax_character_level = 100\ncurrent_user_experience = 1250\nis_battle_mode_active = True\ncharacter_inventory_items = []\n\n# ❌ Amateur Code\na = 100\nb = 1250\nc = True\nd = []\n```\n\n**2. Constants Configuration:**\n```python\n# ✅ Define constants at module top\nMAX_HEALTH = 1000\nDEFAULT_ATTACK_POWER = 50\nGAME_VERSION = "1.2.3"\nCONFIG_FILE_PATH = "./config/game.json"\n\ndef create_character():\n    health = MAX_HEALTH  # Use constants\n    attack = DEFAULT_ATTACK_POWER\n```\n\n**3. Initialize Variables Properly:**\n```python\n# ✅ Good - clear initialization\nplayer_score = 0\ncharacter_list = []\ngame_settings = {}\nis_game_running = False\n\n# ❌ Poor - unclear initialization\nplayer_score = None  # What does None mean?\ncharacter_list = ""  # String instead of list?\n```\n\n**4. Use Type Hints (Advanced):**\n```python\n# ✅ Professional - helps IDEs and other developers\ncharacter_name: str = "Goku"\npower_level: int = 9000\nis_saiyan: bool = True\nabilities: list[str] = ["Kamehameha", "Instant Transmission"]\n```\n\n**5. Variable Documentation:**\n```python\n# ✅ Document complex variables\n# Maximum allowed power level before character becomes overpowered\nMAX_BALANCED_POWER_LEVEL = 8500\n\n# Current player\'s position in 2D game world (x, y)\nplayer_position = (100, 250)\n\n# Dictionary mapping character IDs to their stat objects\ncharacter_database = {}\n```\n\n**6. Avoid Magic Numbers:**\n```python\n# ❌ Magic numbers - unclear meaning\nif power_level > 9000:\n    print("It\'s over 9000!")\n\n# ✅ Named constants - clear meaning\nLEGENDARY_POWER_THRESHOLD = 9000\nif power_level > LEGENDARY_POWER_THRESHOLD:\n    print("It\'s over 9000!")\n```',
        },
        real_world_examples: {
          title: "🌍 Real-World Use Cases & Applications",
          content:
            '**1. Game Development Variables:**\n```python\n# Character Management System\nplayer_id = "user_12345"\ncharacter_name = "DragonSlayer_Pro"\ncurrent_level = 67\nexperience_points = 145670\nhealth_percentage = 0.85\nis_online = True\nlast_login_timestamp = "2024-01-15T10:30:00Z"\n\n# Inventory System\nweapon_damage = 350\narmor_defense = 180\ninventory_slots_used = 42\ninventory_max_capacity = 100\ncurrency_gold = 15750\ncurrency_gems = 230\n```\n\n**2. Web Development Variables:**\n```python\n# User Management\nuser_email = "otaku_fan@anime.com"\npassword_hash = "$2b$12$xyz..."\naccount_created_date = "2024-01-01"\nis_email_verified = True\nsubscription_tier = "premium"\naccount_status = "active"\n\n# E-commerce\nproduct_name = "Naruto Figure - Sage Mode"\nproduct_price = 89.99\nstock_quantity = 15\nis_on_sale = True\ndiscount_percentage = 0.20\nshipping_weight = 0.5  # kg\n```\n\n**3. Data Analysis Variables:**\n```python\n# Anime Rating Analysis\nanime_titles = ["Attack on Titan", "Death Note", "One Piece"]\nratings = [9.0, 9.0, 9.0]\nview_counts = [1500000, 2100000, 3200000]\naverage_episode_length = 24  # minutes\ntotal_seasons = [4, 1, 20]\n\n# Statistical Variables\ntotal_anime_count = len(anime_titles)\naverage_rating = sum(ratings) / len(ratings)\nhighest_rated_anime = max(ratings)\nmost_viewed_anime_index = view_counts.index(max(view_counts))\n```\n\n**4. IoT & Hardware Control:**\n```python\n# Smart Home Anime Room\nled_strip_color = "#FF6B35"  # Orange for Naruto theme\ntemperature_celsius = 22.5\nhumidity_percentage = 45\nis_projector_on = True\nvolume_level = 75  # 0-100\ncurrent_episode = 245\n\n# Sensor Data\nmotion_detected = False\nambient_light_level = 30  # lux\nroom_occupancy_count = 2\n```\n\n**5. Machine Learning Variables:**\n```python\n# Anime Recommendation System\nuser_preference_vector = [0.8, 0.2, 0.9, 0.1]  # [action, romance, comedy, horror]\ntraining_data_size = 50000\nmodel_accuracy = 0.87\nrecommendation_confidence = 0.92\nfeature_count = 150\n\n# Model Configuration\nlearning_rate = 0.001\nbatch_size = 32\nepochs_completed = 45\nmax_epochs = 100\n```',
        },
        performance_tips: {
          title: "⚡ Performance & Memory Optimization",
          content:
            '**1. Memory Efficient Variable Usage:**\n```python\n# ✅ Reuse variables when possible\nresult = calculate_power(character1)\nprocess_result(result)\nresult = calculate_power(character2)  # Reuse same variable\n\n# ❌ Creating unnecessary variables\nresult1 = calculate_power(character1)\nresult2 = calculate_power(character2)\nresult3 = calculate_power(character3)\n# ... uses more memory\n```\n\n**2. String Operations:**\n```python\n# ✅ Efficient - use f-strings\nname = "Goku"\npower = 9000\nmessage = f"Character {name} has power {power}"\n\n# ❌ Less efficient - string concatenation\nmessage = "Character " + name + " has power " + str(power)\n```\n\n**3. Number Type Choice:**\n```python\n# ✅ Use appropriate number types\nsmall_count = 5        # int for whole numbers\nprecise_ratio = 0.95   # float for decimals\nlarge_number = 1000000 # int handles big numbers well\n\n# ❌ Unnecessary precision\nsmall_count = 5.0      # float when int would suffice\n```\n\n**4. Boolean Shortcuts:**\n```python\n# ✅ Direct boolean assignment\nhas_power = power_level > 5000\nis_valid = name and age > 0\n\n# ❌ Unnecessary if-else\nif power_level > 5000:\n    has_power = True\nelse:\n    has_power = False\n```\n\n**5. Variable Cleanup:**\n```python\n# ✅ Delete large variables when done\nlarge_data = load_huge_dataset()\nprocess_data(large_data)\ndel large_data  # Free memory immediately\n\n# ✅ Use context managers for resources\nwith open(\'data.txt\') as file:\n    content = file.read()\n# File automatically closed, variable cleaned up\n```',
        },
        debugging_variables: {
          title: "🐛 Debugging Variables Like a Pro",
          content:
            '**1. Print Debugging:**\n```python\n# ✅ Informative debug prints\ncharacter_name = "Goku"\npower_level = 9000\n\nprint(f"DEBUG: character_name = \'{character_name}\' (type: {type(character_name)})")\nprint(f"DEBUG: power_level = {power_level} (type: {type(power_level)})")\nprint(f"DEBUG: Memory address = {id(character_name)}")\n```\n\n**2. Type Checking:**\n```python\n# ✅ Verify variable types\ndef debug_variable(var, var_name):\n    print(f"{var_name}: {var} (type: {type(var).__name__})")\n    print(f"Is string: {isinstance(var, str)}")\n    print(f"Is number: {isinstance(var, (int, float))}")\n    print(f"Is boolean: {isinstance(var, bool)}")\n\ndebug_variable(character_name, "character_name")\n```\n\n**3. Variable State Tracking:**\n```python\n# ✅ Track variable changes\ndef track_variable_change(old_value, new_value, var_name):\n    print(f"CHANGE: {var_name} changed from {old_value} to {new_value}")\n\nold_power = power_level\npower_level = 10000\ntrack_variable_change(old_power, power_level, "power_level")\n```\n\n**4. Assertion Testing:**\n```python\n# ✅ Verify assumptions\ncharacter_level = 50\nassert isinstance(character_level, int), "Level must be integer"\nassert 1 <= character_level <= 100, "Level must be between 1-100"\nassert character_name.strip(), "Character name cannot be empty"\n```\n\n**5. Using Python Debugger:**\n```python\nimport pdb\n\ncharacter_name = "Naruto"\npower_level = 5000\n\npdb.set_trace()  # Debugger will pause here\n# You can inspect variables interactively\nresult = calculate_battle_result(character_name, power_level)\n```',
        },
        syntax: {
          title: "🔧 Variable Syntax - Complete Reference",
          content:
            '**Basic Variable Assignment:**\n```python\n# Simple assignment\ncharacter_name = "Naruto"\npower_level = 9500.5\nis_hokage = False\n\n# Multiple assignment\nname, age, power = "Goku", 30, 9001\nx = y = z = 0  # All get same value\n\n# Tuple unpacking\ncharacter_data = ("Luffy", 19, "Rubber")\nname, age, ability = character_data\n```\n\n**Memory Visualization:**\n```\n# 🎮 Memory Layout:\n# ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐\n# │  character_name │  │  character_level│  │   is_hokage     │\n# │     "Naruto"    │  │       99        │  │      False      │\n# │   0x7fff8b2a   │  │   0x7fff8b3b   │  │   0x7fff8b4c   │\n# └─────────────────┘  └─────────────────┘  └─────────────────┘\n```\n\n**Advanced Assignment Operators:**\n```python\n# Arithmetic assignment\npower += 100    # Same as: power = power + 100\nhealth -= 50    # Same as: health = health - 50\ndamage *= 2     # Same as: damage = damage * 2\ndefense //= 3   # Same as: defense = defense // 3\n\n# Walrus operator (Python 3.8+)\nif (user_input := input("Enter power: ")) != "quit":\n    power_level = int(user_input)\n```',
        },
        mini_games: {
          title: "🎯 Mini Games & Challenges",
          content:
            '**Game 1: Variable Matching** 🎮\nMatch anime character data with correct variable types:\n- character_name → string\n- power_level → number\n- is_saiyan → boolean\n\n**Game 2: Code Puzzle** 🧩\nArrange these code blocks:\n[A] print(f"Character: {name}")\n[B] power = 8500\n[C] name = "Vegeta"\n[D] print(f"Power: {power}")\n\n**Game 3: Memory Visualizer** 🔬\nWatch variables change in real-time as you code!\n\n**Game 4: Debug Challenge** 🐛\nFind and fix variable-related bugs in anime character code!\n\n**Game 5: Performance Race** ⚡\nOptimize variable usage for maximum performance!',
        },
        code_arena: {
          title: "⚔️ Code Challenge Arena",
          content:
            "Build your own Anime Character Creator!\n\n**Checkpoint System:**\n🎯 Checkpoint 1: Basic Info (name, anime)\n🎯 Checkpoint 2: Stats (strength, speed, intelligence)\n🎯 Checkpoint 3: Special Abilities\n🎯 Checkpoint 4: Character Card Generator\n🎯 Checkpoint 5: Data Validation & Error Handling\n🎯 Checkpoint 6: Performance Optimization\n\n**Advanced Features:**\n- Real-time syntax checking\n- Auto-completion suggestions\n- Progressive hints\n- Code quality scoring\n- Memory usage optimization\n- Instant visual feedback\n- Performance metrics",
        },
        summary: {
          title: "📚 Chapter Summary & Key Takeaways",
          content:
            '**🎓 You\'ve Mastered:**\n\n✅ **Variable Fundamentals**: Memory storage, naming, and lifecycle\n✅ **Data Types**: Numbers, strings, booleans, and conversions\n✅ **Naming Conventions**: PEP 8 standards and best practices\n✅ **Scope Understanding**: Local, global, and LEGB rule\n✅ **Error Prevention**: Common mistakes and debugging techniques\n✅ **Performance Optimization**: Memory efficiency and speed\n✅ **Real-World Applications**: Game dev, web dev, data analysis\n\n**🚀 Next Steps:**\n- Practice with complex data structures (lists, dictionaries)\n- Learn about functions and parameter passing\n- Explore object-oriented programming with classes\n- Study advanced topics like decorators and context managers\n\n**💡 Remember:**\n> "Good variable names are like good anime character names - they should be memorable, meaningful, and tell you everything you need to know at first glance!"\n\n**🏆 Professional Tip:**\nSpend extra time on naming conventions. Clean, readable variable names are the foundation of maintainable code!',
        },
      },
    },
    difficulty: 2,
    duration: 75,
    category: "comprehensive",
    type: "interactive",
    diamondReward: 150,
    experienceReward: 350,
    order: 2,
    isPublished: true,
    learningObjectives: [
      "🎯 Master variable fundamentals and memory concepts",
      "📊 Complete understanding of all Python data types",
      "📝 Professional naming conventions and best practices",
      "🌐 Variable scope mastery (local, global, LEGB rule)",
      "🔄 Type conversion and error handling expertise",
      "⚡ Performance optimization and memory efficiency",
      "🌍 Real-world application development skills",
      "🐛 Advanced debugging and troubleshooting techniques",
      "🎮 Interactive learning through hands-on challenges",
      "🏆 Complete mastery of Python variable system",
    ],
    practicalExercise: {
      description:
        "🎮 COMPREHENSIVE Variable Mastery Challenge - Anime Character Management System",
      starterCode:
        '# 🎮 COMPREHENSIVE VARIABLE MASTERY CHALLENGE\n# Build a complete Anime Character Management System!\n# This exercise covers ALL variable concepts from the lesson\n\n# ========================================\n# 🎯 CHECKPOINT 1: Variable Fundamentals\n# ========================================\n\nprint("🌟 === ANIME CHARACTER MANAGEMENT SYSTEM === 🌟")\nprint("=" * 50)\n\n# TODO 1.1: Create variables with proper naming conventions\n# Use snake_case and descriptive names\ncharacter_name = ""  # String variable for character name\ncharacter_age = 0    # Integer variable for age\npower_level = 0.0    # Float variable for power level\nis_protagonist = False  # Boolean for main character status\n\n# TODO 1.2: Demonstrate variable reassignment\noriginal_power = power_level\npower_level = 8500.75  # Reassign to new value\nprint(f"Power changed from {original_power} to {power_level}")\n\n# TODO 1.3: Show variable type checking\nprint(f"Character name type: {type(character_name)}")\nprint(f"Power level type: {type(power_level)}")\nprint(f"Is protagonist type: {type(is_protagonist)}")\n\n# ========================================\n# 🎯 CHECKPOINT 2: Data Types Mastery\n# ========================================\n\nprint("\\n📊 DATA TYPES DEMONSTRATION")\nprint("-" * 30)\n\n# TODO 2.1: Work with different number types\nbase_attack = 1000        # int\nattack_multiplier = 1.5   # float\ncomplex_formula = 3 + 4j  # complex number\n\n# Calculate final attack\nfinal_attack = base_attack * attack_multiplier\nprint(f"Final attack: {final_attack}")\n\n# TODO 2.2: String operations and formatting\nfirst_name = "Monkey D."\nlast_name = "Luffy"\nfull_name = first_name + " " + last_name  # String concatenation\nquote = f\'"{full_name} will become the Pirate King!"\'  # f-string\n\n# TODO 2.3: Boolean logic\nhas_devil_fruit = True\ncan_swim = not has_devil_fruit  # Boolean operation\nis_rubber_man = has_devil_fruit and "Rubber" in "Gomu Gomu Fruit"\n\nprint(f"Full name: {full_name}")\nprint(f"Quote: {quote}")\nprint(f"Can swim: {can_swim}")\nprint(f"Is rubber man: {is_rubber_man}")\n\n# ========================================\n# 🎯 CHECKPOINT 3: Type Conversion & Validation\n# ========================================\n\nprint("\\n🔄 TYPE CONVERSION CHALLENGE")\nprint("-" * 30)\n\n# TODO 3.1: Handle user input with type conversion\nprint("Enter character statistics:")\n\n# Simulate user input (in real scenario, use input())\nuser_strength_input = "85"\nuser_speed_input = "92.5"\nuser_level_input = "42"\n\n# TODO 3.2: Convert strings to appropriate types with error handling\ntry:\n    character_strength = int(user_strength_input)\n    character_speed = float(user_speed_input)\n    character_level = int(user_level_input)\n    \n    print(f"✅ Strength: {character_strength} (type: {type(character_strength).__name__})")\n    print(f"✅ Speed: {character_speed} (type: {type(character_speed).__name__})")\n    print(f"✅ Level: {character_level} (type: {type(character_level).__name__})")\nexcept ValueError as e:\n    print(f"❌ Error converting input: {e}")\n\n# TODO 3.3: Boolean conversion examples\nempty_string = ""\nnon_empty_string = "Naruto"\nzero_value = 0\npositive_value = 100\n\nprint(f"bool(\'\') = {bool(empty_string)}")\nprint(f"bool(\'Naruto\') = {bool(non_empty_string)}")\nprint(f"bool(0) = {bool(zero_value)}")\nprint(f"bool(100) = {bool(positive_value)}")\n\n# ========================================\n# 🎯 CHECKPOINT 4: Variable Scope Demonstration\n# ========================================\n\nprint("\\n🌐 VARIABLE SCOPE DEMONSTRATION")\nprint("-" * 30)\n\n# Global variables\ngame_title = "Anime Battle Arena"\nmax_level = 100\nplayer_count = 0\n\ndef create_character(name, initial_level):\n    """Function demonstrating local scope"""\n    # Local variables\n    character_data = {\n        "name": name,\n        "level": initial_level,\n        "experience": 0\n    }\n    \n    # Access global variable\n    global player_count\n    player_count += 1\n    \n    print(f"Created character: {character_data[\'name\']} (Local scope)")\n    print(f"Game title: {game_title} (Global scope)")\n    print(f"Total players: {player_count} (Modified global)")\n    \n    return character_data\n\n# Test scope functionality\nnew_character = create_character("Goku", 50)\nprint(f"Character created outside function: {new_character[\'name\']}")\nprint(f"Player count after function: {player_count}")\n\n# ========================================\n# 🎯 CHECKPOINT 5: Advanced Variable Techniques\n# ========================================\n\nprint("\\n⚡ ADVANCED TECHNIQUES")\nprint("-" * 30)\n\n# TODO 5.1: Multiple assignment\nchar1_name, char1_power, char1_element = "Natsu", 7500, "Fire"\nchar2_name, char2_power, char2_element = "Gray", 7200, "Ice"\n\nprint(f"Character 1: {char1_name} - {char1_power} ({char1_element})")\nprint(f"Character 2: {char2_name} - {char2_power} ({char2_element})")\n\n# TODO 5.2: Variable swapping\nprint(f"Before swap: {char1_name} vs {char2_name}")\nchar1_name, char2_name = char2_name, char1_name\nprint(f"After swap: {char1_name} vs {char2_name}")\n\n# TODO 5.3: Augmented assignment operators\nbattle_score = 1000\nbattle_score += 250    # Addition assignment\nbattle_score *= 1.2    # Multiplication assignment\nbattle_score //= 10    # Floor division assignment\n\nprint(f"Final battle score: {battle_score}")\n\n# TODO 5.4: Constants demonstration\nMAX_HEALTH = 1000\nDEFAULT_MANA = 500\nGAME_VERSION = "1.0.0"\n\nprint(f"Game constants - Health: {MAX_HEALTH}, Mana: {DEFAULT_MANA}, Version: {GAME_VERSION}")\n\n# ========================================\n# 🎯 CHECKPOINT 6: Real-World Application\n# ========================================\n\nprint("\\n🌍 REAL-WORLD APPLICATION: CHARACTER DATABASE")\nprint("-" * 45)\n\n# TODO 6.1: Create a character management system\ncharacter_database = {}  # Dictionary to store characters\ncurrent_character_id = 1\n\ndef register_character(name, anime, power, character_type):\n    """Register a new character in the database"""\n    global current_character_id\n    \n    # Generate unique ID\n    character_id = f"CHAR_{current_character_id:04d}"\n    current_character_id += 1\n    \n    # Create character record\n    character_record = {\n        "id": character_id,\n        "name": name,\n        "anime_series": anime,\n        "power_level": power,\n        "type": character_type,\n        "created_at": "2024-01-15",  # In real app, use datetime\n        "is_active": True\n    }\n    \n    # Store in database\n    character_database[character_id] = character_record\n    \n    print(f"✅ Registered: {name} (ID: {character_id})")\n    return character_id\n\n# Register some characters\ngoku_id = register_character("Son Goku", "Dragon Ball Z", 9001, "Saiyan")\nnaruto_id = register_character("Naruto Uzumaki", "Naruto", 8500, "Ninja")\nluffy_id = register_character("Monkey D. Luffy", "One Piece", 7800, "Pirate")\n\n# TODO 6.2: Database statistics\ntotal_characters = len(character_database)\naverage_power = sum(char["power_level"] for char in character_database.values()) / total_characters\nhighest_power_char = max(character_database.values(), key=lambda x: x["power_level"])\n\nprint(f"\\n📈 DATABASE STATISTICS:")\nprint(f"Total characters: {total_characters}")\nprint(f"Average power level: {average_power:.1f}")\nprint(f"Strongest character: {highest_power_char[\'name\']} ({highest_power_char[\'power_level\']})")\n\n# ========================================\n# 🎯 CHECKPOINT 7: Error Handling & Debugging\n# ========================================\n\nprint("\\n🐛 ERROR HANDLING & DEBUGGING")\nprint("-" * 30)\n\n# TODO 7.1: Demonstrate common variable errors and fixes\nprint("Common variable mistakes and fixes:")\n\n# Error 1: Undefined variable (commented to avoid crash)\n# print(undefined_variable)  # NameError\nprint("❌ Trying to use undefined variable causes NameError")\n\n# Error 2: Type mismatch\ntry:\n    age_string = "seventeen"\n    age_number = int(age_string)  # ValueError\nexcept ValueError:\n    print("❌ Cannot convert \'seventeen\' to integer")\n    age_number = 17  # Fix with proper value\n    print(f"✅ Fixed: age is now {age_number}")\n\n# Error 3: Case sensitivity\nCharacterName = "Goku"  # PascalCase\n# print(charactername)  # NameError - different variable\nprint("❌ Character_Name ≠ charactername (case sensitive)")\ncharacter_name_fixed = CharacterName.lower()\nprint(f"✅ Fixed: {character_name_fixed}")\n\n# ========================================\n# 🎯 FINAL CHALLENGE: Character Battle System\n# ========================================\n\nprint("\\n⚔️ FINAL CHALLENGE: CHARACTER BATTLE SYSTEM")\nprint("=" * 50)\n\n# TODO: Complete the battle system using all variable concepts\ndef calculate_battle_result(attacker_power, defender_power, attacker_type, defender_type):\n    """Calculate battle result using various variable types"""\n    \n    # Base damage calculation\n    base_damage = attacker_power * 0.8\n    \n    # Type advantage system\n    type_advantages = {\n        ("Fire", "Ice"): 1.5,\n        ("Ice", "Fire"): 0.5,\n        ("Electric", "Water"): 1.5,\n        ("Water", "Electric"): 0.5\n    }\n    \n    # Apply type advantage\n    advantage_key = (attacker_type, defender_type)\n    type_multiplier = type_advantages.get(advantage_key, 1.0)\n    \n    # Calculate final damage\n    final_damage = base_damage * type_multiplier\n    \n    # Determine result\n    is_critical_hit = final_damage > defender_power * 0.7\n    is_super_effective = type_multiplier > 1.0\n    \n    # Battle result\n    result = {\n        "damage_dealt": final_damage,\n        "is_critical": is_critical_hit,\n        "is_super_effective": is_super_effective,\n        "type_multiplier": type_multiplier\n    }\n    \n    return result\n\n# Test the battle system\nprint("🥊 BATTLE: Fire vs Ice")\nbattle_result = calculate_battle_result(8500, 8000, "Fire", "Ice")\n\nprint(f"Damage dealt: {battle_result[\'damage_dealt\']:.1f}")\nprint(f"Critical hit: {battle_result[\'is_critical\']}")\nprint(f"Super effective: {battle_result[\'is_super_effective\']}")\nprint(f"Type multiplier: {battle_result[\'type_multiplier\']}x")\n\nif battle_result["is_super_effective"]:\n    print("🔥 Fire type is super effective against Ice!")\n    \nif battle_result["is_critical"]:\n    print("💥 Critical hit! Massive damage!")\n\n# ========================================\n# 🎯 COMPLETION SUMMARY\n# ========================================\n\nprint("\\n🎉 CHALLENGE COMPLETED!")\nprint("=" * 30)\nprint("You have successfully demonstrated:")\nprint("✅ Variable creation and naming conventions")\nprint("✅ All data types (int, float, string, bool, complex)")\nprint("✅ Type conversion and error handling")\nprint("✅ Variable scope (local vs global)")\nprint("✅ Advanced techniques (multiple assignment, swapping)")\nprint("✅ Real-world application (database management)")\nprint("✅ Debugging and error prevention")\nprint("✅ Complex system integration")\nprint("\\n🏆 YOU ARE NOW A PYTHON VARIABLES MASTER! 🏆")\n\n# Memory usage demonstration\nimport sys\nprint(f"\\n📊 Memory usage of different variable types:")\nprint(f"Integer: {sys.getsizeof(42)} bytes")\nprint(f"Float: {sys.getsizeof(3.14)} bytes")\nprint(f"String: {sys.getsizeof(\'Hello\')} bytes")\nprint(f"Boolean: {sys.getsizeof(True)} bytes")\nprint(f"List: {sys.getsizeof([1,2,3])} bytes")',
      solution:
        '# 🎮 COMPLETE SOLUTION - COMPREHENSIVE VARIABLE MASTERY\n\nprint("🌟 === ANIME CHARACTER MANAGEMENT SYSTEM === 🌟")\nprint("=" * 50)\n\n# ========================================\n# CHECKPOINT 1: Variable Fundamentals\n# ========================================\n\ncharacter_name = "Monkey D. Luffy"\ncharacter_age = 19\npower_level = 8500.75\nis_protagonist = True\n\noriginal_power = power_level\npower_level = 8500.75\nprint(f"Power changed from {original_power} to {power_level}")\n\nprint(f"Character name type: {type(character_name)}")\nprint(f"Power level type: {type(power_level)}")\nprint(f"Is protagonist type: {type(is_protagonist)}")\n\n# ========================================\n# CHECKPOINT 2: Data Types Mastery\n# ========================================\n\nprint("\\n📊 DATA TYPES DEMONSTRATION")\nprint("-" * 30)\n\nbase_attack = 1000\nattack_multiplier = 1.5\ncomplex_formula = 3 + 4j\n\nfinal_attack = base_attack * attack_multiplier\nprint(f"Final attack: {final_attack}")\n\nfirst_name = "Monkey D."\nlast_name = "Luffy"\nfull_name = first_name + " " + last_name\nquote = f\'"{full_name} will become the Pirate King!"\'\n\nhas_devil_fruit = True\ncan_swim = not has_devil_fruit\nis_rubber_man = has_devil_fruit and "Rubber" in "Gomu Gomu Fruit"\n\nprint(f"Full name: {full_name}")\nprint(f"Quote: {quote}")\nprint(f"Can swim: {can_swim}")\nprint(f"Is rubber man: {is_rubber_man}")\n\n# ========================================\n# CHECKPOINT 3: Type Conversion & Validation\n# ========================================\n\nprint("\\n🔄 TYPE CONVERSION CHALLENGE")\nprint("-" * 30)\n\nuser_strength_input = "85"\nuser_speed_input = "92.5"\nuser_level_input = "42"\n\ntry:\n    character_strength = int(user_strength_input)\n    character_speed = float(user_speed_input)\n    character_level = int(user_level_input)\n    \n    print(f"✅ Strength: {character_strength} (type: {type(character_strength).__name__})")\n    print(f"✅ Speed: {character_speed} (type: {type(character_speed).__name__})")\n    print(f"✅ Level: {character_level} (type: {type(character_level).__name__})")\nexcept ValueError as e:\n    print(f"❌ Error converting input: {e}")\n\nempty_string = ""\nnon_empty_string = "Naruto"\nzero_value = 0\npositive_value = 100\n\nprint(f"bool(\'\') = {bool(empty_string)}")\nprint(f"bool(\'Naruto\') = {bool(non_empty_string)}")\nprint(f"bool(0) = {bool(zero_value)}")\nprint(f"bool(100) = {bool(positive_value)}")\n\n# ========================================\n# CHECKPOINT 4: Variable Scope\n# ========================================\n\nprint("\\n🌐 VARIABLE SCOPE DEMONSTRATION")\nprint("-" * 30)\n\ngame_title = "Anime Battle Arena"\nmax_level = 100\nplayer_count = 0\n\ndef create_character(name, initial_level):\n    character_data = {\n        "name": name,\n        "level": initial_level,\n        "experience": 0\n    }\n    \n    global player_count\n    player_count += 1\n    \n    print(f"Created character: {character_data[\'name\']} (Local scope)")\n    print(f"Game title: {game_title} (Global scope)")\n    print(f"Total players: {player_count} (Modified global)")\n    \n    return character_data\n\nnew_character = create_character("Goku", 50)\nprint(f"Character created outside function: {new_character[\'name\']}")\nprint(f"Player count after function: {player_count}")\n\n# ========================================\n# CHECKPOINT 5: Advanced Techniques\n# ========================================\n\nprint("\\n⚡ ADVANCED TECHNIQUES")\nprint("-" * 30)\n\nchar1_name, char1_power, char1_element = "Natsu", 7500, "Fire"\nchar2_name, char2_power, char2_element = "Gray", 7200, "Ice"\n\nprint(f"Character 1: {char1_name} - {char1_power} ({char1_element})")\nprint(f"Character 2: {char2_name} - {char2_power} ({char2_element})")\n\nprint(f"Before swap: {char1_name} vs {char2_name}")\nchar1_name, char2_name = char2_name, char1_name\nprint(f"After swap: {char1_name} vs {char2_name}")\n\nbattle_score = 1000\nbattle_score += 250\nbattle_score *= 1.2\nbattle_score //= 10\n\nprint(f"Final battle score: {battle_score}")\n\nMAX_HEALTH = 1000\nDEFAULT_MANA = 500\nGAME_VERSION = "1.0.0"\n\nprint(f"Game constants - Health: {MAX_HEALTH}, Mana: {DEFAULT_MANA}, Version: {GAME_VERSION}")\n\n# ========================================\n# CHECKPOINT 6: Real-World Application\n# ========================================\n\nprint("\\n🌍 REAL-WORLD APPLICATION: CHARACTER DATABASE")\nprint("-" * 45)\n\ncharacter_database = {}\ncurrent_character_id = 1\n\ndef register_character(name, anime, power, character_type):\n    global current_character_id\n    \n    character_id = f"CHAR_{current_character_id:04d}"\n    current_character_id += 1\n    \n    character_record = {\n        "id": character_id,\n        "name": name,\n        "anime_series": anime,\n        "power_level": power,\n        "type": character_type,\n        "created_at": "2024-01-15",\n        "is_active": True\n    }\n    \n    character_database[character_id] = character_record\n    \n    print(f"✅ Registered: {name} (ID: {character_id})")\n    return character_id\n\ngoku_id = register_character("Son Goku", "Dragon Ball Z", 9001, "Saiyan")\nnaruto_id = register_character("Naruto Uzumaki", "Naruto", 8500, "Ninja")\nluffy_id = register_character("Monkey D. Luffy", "One Piece", 7800, "Pirate")\n\ntotal_characters = len(character_database)\naverage_power = sum(char["power_level"] for char in character_database.values()) / total_characters\nhighest_power_char = max(character_database.values(), key=lambda x: x["power_level"])\n\nprint(f"\\n📈 DATABASE STATISTICS:")\nprint(f"Total characters: {total_characters}")\nprint(f"Average power level: {average_power:.1f}")\nprint(f"Strongest character: {highest_power_char[\'name\']} ({highest_power_char[\'power_level\']})")\n\n# ========================================\n# FINAL CHALLENGE: Battle System\n# ========================================\n\nprint("\\n⚔️ FINAL CHALLENGE: CHARACTER BATTLE SYSTEM")\nprint("=" * 50)\n\ndef calculate_battle_result(attacker_power, defender_power, attacker_type, defender_type):\n    base_damage = attacker_power * 0.8\n    \n    type_advantages = {\n        ("Fire", "Ice"): 1.5,\n        ("Ice", "Fire"): 0.5,\n        ("Electric", "Water"): 1.5,\n        ("Water", "Electric"): 0.5\n    }\n    \n    advantage_key = (attacker_type, defender_type)\n    type_multiplier = type_advantages.get(advantage_key, 1.0)\n    \n    final_damage = base_damage * type_multiplier\n    \n    is_critical_hit = final_damage > defender_power * 0.7\n    is_super_effective = type_multiplier > 1.0\n    \n    result = {\n        "damage_dealt": final_damage,\n        "is_critical": is_critical_hit,\n        "is_super_effective": is_super_effective,\n        "type_multiplier": type_multiplier\n    }\n    \n    return result\n\nprint("🥊 BATTLE: Fire vs Ice")\nbattle_result = calculate_battle_result(8500, 8000, "Fire", "Ice")\n\nprint(f"Damage dealt: {battle_result[\'damage_dealt\']:.1f}")\nprint(f"Critical hit: {battle_result[\'is_critical\']}")\nprint(f"Super effective: {battle_result[\'is_super_effective\']}")\nprint(f"Type multiplier: {battle_result[\'type_multiplier\']}x")\n\nif battle_result["is_super_effective"]:\n    print("🔥 Fire type is super effective against Ice!")\n    \nif battle_result["is_critical"]:\n    print("💥 Critical hit! Massive damage!")\n\nprint("\\n🎉 CHALLENGE COMPLETED!")\nprint("🏆 YOU ARE NOW A PYTHON VARIABLES MASTER! 🏆")',
      testCases: [
        {
          description: "🎯 Variable fundamentals must be demonstrated",
          test: "assert 'character_name' in locals() and 'power_level' in locals() and 'is_protagonist' in locals()",
        },
        {
          description: "🔢 All data types must be used",
          test: "assert isinstance(character_age, int) and isinstance(power_level, float) and isinstance(is_protagonist, bool)",
        },
        {
          description: "🔄 Type conversion must work",
          test: "assert 'character_strength' in locals() and isinstance(character_strength, int)",
        },
        {
          description: "🌐 Variable scope must be demonstrated",
          test: "assert 'create_character' in locals() and callable(create_character)",
        },
        {
          description: "⚡ Advanced techniques must be used",
          test: "assert 'char1_name' in locals() and 'char2_name' in locals() and 'battle_score' in locals()",
        },
        {
          description: "🌍 Real-world application must work",
          test: "assert 'character_database' in locals() and len(character_database) >= 3",
        },
        {
          description: "⚔️ Final battle system must work",
          test: "assert 'calculate_battle_result' in locals() and callable(calculate_battle_result)",
        },
        {
          description: "🎉 Completion message must be displayed",
          test: "assert 'CHALLENGE COMPLETED' in output and 'VARIABLES MASTER' in output",
        },
      ],
    },
    hints: [
      "🎮 Use the auto-completion feature for anime names",
      "🎯 Watch the real-time stat visualizer as you enter values",
      "🏆 Higher total power gives bonus diamonds!",
      "🎨 Be creative with special abilities for extra points",
      "⚡ Complete checkpoints quickly for speed bonuses",
    ],
  },

  {
    id: "lesson_003",
    title: "Numbers Magic - Mathematical Operations",
    slug: "mathematical-operations",
    description:
      "We'll learn how to work with numbers in Python. Addition, subtraction, multiplication, division and more!",
    content: {
      sections: {
        number_types: {
          title: "Number Types",
          content:
            "Python has two main number types:\n- **int**: Integers (1, 42, -17)\n- **float**: Decimal numbers (3.14, -2.5, 0.1)",
        },
        operators: {
          title: "Mathematical Operators",
          content:
            "```python\n+ # Addition\n- # Subtraction\n* # Multiplication\n/ # Division\n// # Floor division\n% # Modulo (remainder)\n** # Exponentiation\n```",
        },
        examples: {
          title: "Examples",
          content:
            '```python\n# Character stats\nattack = 100\ndefense = 50\n\n# Calculate damage\ndamage = attack * 2 - defense\nprint(f"Damage dealt: {damage}")\n```',
        },
      },
    },
    difficulty: 1,
    duration: 30,
    category: "basic",
    type: "practical",
    diamondReward: 30,
    experienceReward: 85,
    order: 3,
    isPublished: true,
    learningObjectives: [
      "Performing basic mathematical operations",
      "Understanding different number types (int, float)",
      "Learning operator precedence",
      "Using modulo and exponentiation operations",
    ],
    practicalExercise: {
      description: "Create an anime card value calculator",
      starterCode:
        "# Anime card value calculator\n# Card information\nbase_value = 100\nrarity_level = 8  # 1-10 range\ncondition_multiplier = 0.9  # 0.5-1.0 range\n\n# Formula: (base_value * rarity_level^2) * condition_multiplier\n# Calculate and print the result\n",
      solution:
        'base_value = 100\nrarity_level = 8\ncondition_multiplier = 0.9\n\ncard_value = (base_value * rarity_level ** 2) * condition_multiplier\n\nprint(f"Card value: {card_value} diamonds")\nprint(f"Rarity level: {rarity_level}/10")\nprint(f"Condition: {condition_multiplier * 100}%")',
      testCases: [
        {
          description: "Card value must be calculated correctly",
          test: "assert abs(card_value - 5760.0) < 0.01",
        },
        {
          description: "Result must be printed",
          test: "assert 'diamonds' in output.lower() or str(int(card_value)) in output",
        },
      ],
    },
    hints: [
      "Use the ** operator for exponentiation",
      "Don't forget parentheses",
      "Use f-string for nice output formatting",
    ],
  },

  {
    id: "lesson_004",
    title: "Conditions - The Art of Decision Making",
    slug: "conditions-if-else",
    description:
      "We'll make our programs behave differently based on conditions. We'll learn if, elif, else structures.",
    content: {
      sections: {
        introduction: {
          title: "Conditional Statements",
          content:
            "Our programs need to behave differently in different situations. We use conditional statements for this.",
        },
        if_syntax: {
          title: "if Structure",
          content:
            "```python\nif condition:\n    # Code to run if condition is true\n```",
        },
        examples: {
          title: "Examples",
          content:
            '```python\n# Check character level\nlevel = 75\n\nif level >= 90:\n    print("Max level!")\nelif level >= 50:\n    print("High level!")\nelse:\n    print("Low level!")\n```',
        },
      },
    },
    difficulty: 2,
    duration: 35,
    category: "basic",
    type: "practical",
    diamondReward: 35,
    experienceReward: 100,
    order: 4,
    isPublished: true,
    learningObjectives: [
      "Using if-elif-else structures",
      "Learning comparison operators",
      "Understanding Boolean logic",
      "Building conditional logic",
    ],
    practicalExercise: {
      description: "Anime character power level evaluator",
      starterCode:
        "# Anime character power level evaluator\n# Get power level from user and evaluate it\n\npower_level = 8500  # Change this value to test\n\n# 0-3000: Novice\n# 3001-7000: Intermediate\n# 7001-9000: Strong\n# 9000+: Legendary\n\n# Print the appropriate category\n",
      solution:
        'power_level = 8500\n\nif power_level <= 3000:\n    category = "Novice"\nelif power_level <= 7000:\n    category = "Intermediate"\nelif power_level <= 9000:\n    category = "Strong"\nelse:\n    category = "Legendary"\n\nprint(f"Power level: {power_level}")\nprint(f"Category: {category}")',
      testCases: [
        {
          description: "Correct category must be determined",
          test: "assert 'Strong' in output",
        },
        {
          description: "Power level must be printed",
          test: "assert '8500' in output",
        },
      ],
    },
    hints: [
      "Use elif to check multiple conditions",
      "Pay attention to operator precedence",
      "Make sure indentation is correct",
    ],
  },

  {
    id: "lesson_005",
    title: "Loops - The Power of Repetition",
    slug: "loops-for-while",
    description:
      "We'll use loops to repeat the same operation multiple times. We'll learn for and while loops.",
    content: {
      sections: {
        introduction: {
          title: "What is a Loop?",
          content:
            "Loops allow us to run the same code block multiple times. This way we avoid code repetition.",
        },
        for_loop: {
          title: "for Loop",
          content:
            "```python\n# Print numbers from 1 to 5\nfor i in range(1, 6):\n    print(i)\n```",
        },
        while_loop: {
          title: "while Loop",
          content:
            "```python\n# Countdown from 5\ncount = 5\nwhile count > 0:\n    print(count)\n    count -= 1\n```",
        },
      },
    },
    difficulty: 2,
    duration: 40,
    category: "basic",
    type: "practical",
    diamondReward: 40,
    experienceReward: 110,
    order: 5,
    isPublished: true,
    learningObjectives: [
      "Using for loops",
      "Using while loops",
      "Understanding the range() function",
      "Loop control (break, continue)",
    ],
    practicalExercise: {
      description: "Anime characters power list",
      starterCode:
        '# Anime characters power levels\ncharacters = ["Goku", "Vegeta", "Piccolo", "Gohan", "Krillin"]\npower_levels = [9001, 8500, 3000, 7000, 1500]\n\n# Print power level for each character\n# Mark those with power level higher than 5000 specially\n',
      solution:
        'characters = ["Goku", "Vegeta", "Piccolo", "Gohan", "Krillin"]\npower_levels = [9001, 8500, 3000, 7000, 1500]\n\nfor i in range(len(characters)):\n    character = characters[i]\n    power = power_levels[i]\n    \n    if power > 5000:\n        print(f"{character}: {power} ⭐ (Strong!)")\n    else:\n        print(f"{character}: {power}")',
      testCases: [
        {
          description: "All characters must be printed",
          test: "assert len(output.split('\\n')) >= 5",
        },
        {
          description: "Strong characters must be marked",
          test: "assert '⭐' in output or 'Strong' in output",
        },
      ],
    },
    hints: [
      "Use range(len(list)) for index looping",
      "Access list elements using index",
      "Use if condition to separate strong characters",
    ],
  },

  {
    id: "lesson_006",
    title: "Lists - Data Collections",
    slug: "lists",
    description:
      "We'll store multiple data in a single structure. We'll learn list creation, adding and removing elements.",
    content: {
      sections: {
        introduction: {
          title: "What is a List?",
          content:
            "Lists allow us to store multiple items in an ordered way. Square brackets [] are used.",
        },
        creation: {
          title: "Creating Lists",
          content:
            '```python\nanimes = ["Naruto", "One Piece", "Attack on Titan"]\nprint(animes[0]) # Accessing the first element\n```',
        },
        methods: {
          title: "List Methods",
          content:
            '```python\nanimes.append("Bleach") # Adding an element\nprint(animes)\n```',
        },
      },
    },
    difficulty: 2,
    duration: 35,
    category: "basic",
    type: "practical",
    diamondReward: 45,
    experienceReward: 125,
    order: 6,
    isPublished: true,
    learningObjectives: [
      "Learning to create lists",
      "Using list methods",
      "Indexing and slicing",
      "Looping over lists",
    ],
    practicalExercise: {
      description: "Anime watchlist manager",
      starterCode:
        "# Anime watchlist manager\nwatchlist = []\n\n# Add anime to your list\n# Print the list\n# Mark an anime as watched (remove it)\n# Show updated list\n",
      solution:
        'watchlist = []\n\n# Adding anime\nwatchlist.append("Death Note")\nwatchlist.append("Demon Slayer")\nwatchlist.append("Your Name")\n\nprint("Watchlist:")\nfor anime in watchlist:\n    print(f"- {anime}")\n\n# Mark an anime as watched\nwatched = watchlist.pop(0)\nprint(f"\\n\'{watched}\' watched!")\n\nprint("\\nUpdated List:")\nfor anime in watchlist:\n    print(f"- {anime}")',
      testCases: [
        {
          description: "At least 3 anime must be added",
          test: "assert len(watchlist) >= 2",
        },
        {
          description: "List must be printed",
          test: "assert 'Watchlist' in output or len(output.split('-')) >= 3",
        },
      ],
    },
    hints: [
      "Use append() to add to the end of list",
      "Use for loop to print list elements",
      "Use pop() to remove the last element",
    ],
  },

  {
    id: "lesson_007",
    title: "Functions - Code Organization",
    slug: "functions",
    description:
      "We'll use functions to organize our code. We'll learn about taking parameters and returning values.",
    content: {
      sections: {
        introduction: {
          title: "What is a Function?",
          content:
            "Functions allow us to create reusable code blocks that perform specific tasks.",
        },
        syntax: {
          title: "Defining Functions",
          content:
            '```python\ndef greet(name):\n    print(f"Hello, {name}!")\n\ngreet("Goku")\n```',
        },
        parameters: {
          title: "Parameters",
          content:
            "```python\ndef add(a, b):\n    return a + b\n\nresult = add(5, 3)\nprint(result)\n```",
        },
      },
    },
    difficulty: 3,
    duration: 40,
    category: "basic",
    type: "practical",
    diamondReward: 50,
    experienceReward: 140,
    order: 7,
    isPublished: true,
    learningObjectives: [
      "Defining and calling functions",
      "Using parameters",
      "Using return statements",
      "Default parameter values",
    ],
    practicalExercise: {
      description: "Anime character battle power calculator",
      starterCode:
        "# Anime character battle power calculator\n\n# Create card_power_calculate function\n# Parameters: base_power, level, rarity_multiplier, equipment_bonus=0\n# Formula: (base_power * level * rarity_multiplier) + equipment_bonus\n\n# Test the function\n",
      solution:
        'def card_power_calculate(base_power, level, rarity_multiplier, equipment_bonus=0):\n    total_power = (base_power * level * rarity_multiplier) + equipment_bonus\n    return total_power\n\n# Test\nnaruto_power = card_power_calculate(150, 8, 1.5, 200)\nsasuke_power = card_power_calculate(145, 8, 1.5)\n\nprint(f"Naruto\'s power: {naruto_power}")\nprint(f"Sasuke\'s power: {sasuke_power}")\nprint(f"Power difference: {abs(naruto_power - sasuke_power)}")',
      testCases: [
        {
          description: "Function must work correctly",
          test: "assert card_power_calculate(100, 5, 2) == 1000",
        },
        {
          description: "Results must be printed",
          test: "assert 'power' in output.lower()",
        },
      ],
    },
    hints: [
      "Define function with def keyword",
      "Return result with return",
      "Use = for default parameters",
    ],
  },

  {
    id: "lesson_008",
    title: "String Operations - Text Manipulation",
    slug: "string-operations",
    description:
      "We'll learn to work with text data. We'll explore string methods, formatting operations and regular expressions.",
    content: {
      sections: {
        string_methods: {
          title: "String Methods",
          content:
            '```python\ntext = "Hello, World!"\nprint(text.upper())\nprint(text.lower())\n```',
        },
        formatting: {
          title: "String Formatting",
          content:
            '```python\nname = "Goku"\nlevel = 99\nprint(f"{name} is level {level}")\n```',
        },
        slicing: {
          title: "String Slicing",
          content: '```python\ntext = "Python"\nprint(text[0:2])\n```',
        },
      },
    },
    difficulty: 2,
    duration: 35,
    category: "basic",
    type: "practical",
    diamondReward: 55,
    experienceReward: 155,
    order: 8,
    isPublished: true,
    learningObjectives: [
      "Using string methods",
      "String formatting techniques",
      "String slicing",
      "String concatenation operations",
    ],
    practicalExercise: {
      description: "Anime character info card generator",
      starterCode:
        '# Anime character info card generator\n\ncharacter_info = "NARUTO UZUMAKI|KONOHA|NINJA|17|BECOME HOKAGE"\n\n# Split the string\n# Format each piece (from uppercase to normal)\n# Print in a nice card format\n',
      solution:
        'character_info = "NARUTO UZUMAKI|KONOHA|NINJA|17|BECOME HOKAGE"\n\n# Split the information\ninfo_parts = character_info.split(\'|\')\n\nname = info_parts[0].title()\nlocation = info_parts[1].title()\njob = info_parts[2].title()\nage = info_parts[3]\ngoal = info_parts[4].title()\n\n# Print in card format\nprint("=" * 30)\nprint(f"🎌 CHARACTER CARD 🎌")\nprint("=" * 30)\nprint(f"Name: {name}")\nprint(f"Village: {location}")\nprint(f"Job: {job}")\nprint(f"Age: {age}")\nprint(f"Goal: {goal}")\nprint("=" * 30)',
      testCases: [
        {
          description: "String must be split",
          test: "assert len(info_parts) == 5",
        },
        {
          description: "Format must be adjusted",
          test: "assert 'Naruto' in output and 'NARUTO' not in output",
        },
      ],
    },
    hints: [
      "Split string with split('|')",
      "Use title() method to capitalize first letters",
      "Create nice format with f-string",
    ],
  },

  {
    id: "lesson_009",
    title: "Dictionaries - Key-Value Pairs",
    slug: "dictionaries",
    description:
      "We'll learn dictionaries with key-value structure. We'll see data storage and access operations.",
    content: {
      sections: {
        introduction: {
          title: "What is a Dictionary?",
          content:
            "Dictionaries are data structures that store key-value pairs. Curly braces {} are used.",
        },
        syntax: {
          title: "Creating Dictionaries",
          content:
            '```python\ncharacter = {"name": "Goku", "level": 99}\nprint(character["name"])\n```',
        },
        operations: {
          title: "Dictionary Operations",
          content:
            '```python\ncharacter["planet"] = "Vegeta"\nprint(character)\n```',
        },
      },
    },
    difficulty: 2,
    duration: 35,
    category: "basic",
    type: "practical",
    diamondReward: 60,
    experienceReward: 170,
    order: 9,
    isPublished: true,
    learningObjectives: [
      "Creating and using dictionaries",
      "Key-value access",
      "Dictionary methods",
      "Nested dictionaries",
    ],
    practicalExercise: {
      description: "Anime character database",
      starterCode:
        "# Anime character database\n\n# Create dictionary for 3 characters\n# Each character: name, anime, power_level, abilities (list)\n\n# Print characters\n# Find the strongest character\n",
      solution:
        "characters = {\n    'goku': {\n        'name': 'Son Goku',\n        'anime': 'Dragon Ball Z',\n        'power_level': 9001,\n        'abilities': ['Kamehameha', 'Instant Transmission']\n    },\n    'naruto': {\n        'name': 'Naruto Uzumaki',\n        'anime': 'Naruto',\n        'power_level': 8500,\n        'abilities': ['Rasengan', 'Shadow Clone']\n    },\n    'luffy': {\n        'name': 'Monkey D. Luffy',\n        'anime': 'One Piece',\n        'power_level': 7800,\n        'abilities': ['Gum-Gum Pistol', 'Gear 4']\n    }\n}\n\n# Print characters\nfor key, character in characters.items():\n    print(f\"🎌 {character['name']}\")\n    print(f\"   Anime: {character['anime']}\")\n    print(f\"   Power: {character['power_level']}\")\n    print(f\"   Abilities: {', '.join(character['abilities'])}\")\n    print()\n\n# Find strongest character\nstrongest = max(characters.values(), key=lambda x: x['power_level'])\nprint(f\"🏆 Strongest character: {strongest['name']} ({strongest['power_level']} power)\")",
      testCases: [
        {
          description: "At least 3 characters must exist",
          test: "assert len(characters) >= 3",
        },
        {
          description: "Strongest character must be found",
          test: "assert 'Strongest' in output or '🏆' in output",
        },
      ],
    },
    hints: [
      "Use nested dictionary structure",
      "Find largest value with max() function",
      "Specify comparison criteria with key parameter",
    ],
  },

  {
    id: "lesson_010",
    title: "Error Handling - Try-Except",
    slug: "error-handling",
    description:
      "We'll learn to catch and handle errors that can occur in programs. We'll use try-except structures.",
    content: {
      sections: {
        introduction: {
          title: "Why is Error Handling Important?",
          content:
            "Programs can encounter unexpected situations while running. With error handling, we prevent our program from crashing.",
        },
        try_except: {
          title: "Try-Except Structure",
          content:
            '```python\ntry:\n    x = 1 / 0\nexcept ZeroDivisionError:\n    print("Cannot divide by zero!")\n```',
        },
        examples: {
          title: "Examples",
          content:
            '```python\ntry:\n    value = int("abc")\nexcept ValueError:\n    print("Invalid number!")\n```',
        },
      },
    },
    difficulty: 3,
    duration: 40,
    category: "basic",
    type: "practical",
    diamondReward: 65,
    experienceReward: 185,
    order: 10,
    isPublished: true,
    learningObjectives: [
      "Using try-except structure",
      "Catching different error types",
      "Understanding finally block",
      "Creating custom error messages",
    ],
    practicalExercise: {
      description: "Safe anime card evaluator",
      starterCode:
        '# Safe anime card evaluator\n\ndef evaluate_card(card_info):\n    # card_info: string in "150,8,1.5" format\n    # Split and calculate: base_power * level * multiplier\n    # Catch errors and give appropriate message\n    pass\n\n# Test data\ntest_cards = [\n    "150,8,1.5",     # Valid\n    "abc,8,1.5",     # Invalid number\n    "150,8",         # Missing data\n    "150,0,1.5"      # Zero level\n]\n\n# Test each card\n',
      solution:
        'def evaluate_card(card_info):\n    try:\n        # Split the string\n        parts = card_info.split(\',\')\n        \n        if len(parts) != 3:\n            raise ValueError("Missing data: 3 values required (power,level,multiplier)")\n        \n        base_power = int(parts[0])\n        level = int(parts[1])\n        multiplier = float(parts[2])\n        \n        if level <= 0:\n            raise ValueError("Level must be greater than 0")\n        \n        value = base_power * level * multiplier\n        return f"✅ Card value: {value}"\n        \n    except ValueError as e:\n        return f"❌ Error: {e}"\n    except Exception as e:\n        return f"❌ Unexpected error: {e}"\n\n# Test data\ntest_cards = [\n    "150,8,1.5",     # Valid\n    "abc,8,1.5",     # Invalid number\n    "150,8",         # Missing data\n    "150,0,1.5"      # Zero level\n]\n\n# Test each card\nfor i, card in enumerate(test_cards, 1):\n    print(f"Test {i}: {card}")\n    print(f"Result: {evaluate_card(card)}")\n    print()',
      testCases: [
        {
          description: "Error catching must work",
          test: "assert '❌' in output",
        },
        {
          description: "Valid card must be processed",
          test: "assert '✅' in output",
        },
      ],
    },
    hints: [
      "Use try-except blocks",
      "Catch ValueError and general Exception",
      "Inform user with custom error messages",
    ],
  },

  {
    id: "lesson_011",
    title: "File Operations - Data Storage",
    slug: "file-operations",
    description:
      "We'll learn to read data from files and write data to files. We'll see persistent data storage methods.",
    content: {
      sections: {
        file_operations: {
          title: "File Operations",
          content:
            '```python\nwith open("test.txt", "w") as f:\n    f.write("Hello, World!")\n```',
        },
        modes: {
          title: "File Modes",
          content:
            "```python\n'r'  # Read mode\n'w'  # Write mode - clears file\n'a'  # Append mode - adds to end\n'r+' # Read and write\n```",
        },
        examples: {
          title: "Examples",
          content:
            '```python\nwith open("test.txt", "r") as f:\n    content = f.read()\n    print(content)\n```',
        },
      },
    },
    difficulty: 3,
    duration: 45,
    category: "intermediate",
    type: "practical",
    diamondReward: 70,
    experienceReward: 200,
    order: 11,
    isPublished: true,
    learningObjectives: [
      "File reading and writing operations",
      "Using with statement",
      "Working with JSON files",
      "File error handling",
    ],
    practicalExercise: {
      description: "Anime collection manager",
      starterCode:
        "# Anime collection manager\nimport json\n\n# Collection data\ncollection = {\n    'animes': [\n        {'name': 'Death Note', 'rating': 9.0, 'status': 'Watched'},\n        {'name': 'Attack on Titan', 'rating': 9.5, 'status': 'Watching'},\n        {'name': 'One Piece', 'rating': 8.8, 'status': 'To Watch'}\n    ],\n    'total_anime': 3,\n    'average_rating': 0\n}\n\n# 1. Calculate average rating\n# 2. Save collection to JSON file\n# 3. Read from file and verify\n",
      solution:
        "import json\n\n# Collection data\ncollection = {\n    'animes': [\n        {'name': 'Death Note', 'rating': 9.0, 'status': 'Watched'},\n        {'name': 'Attack on Titan', 'rating': 9.5, 'status': 'Watching'},\n        {'name': 'One Piece', 'rating': 8.8, 'status': 'To Watch'}\n    ],\n    'total_anime': 3,\n    'average_rating': 0\n}\n\n# 1. Calculate average rating\ntotal_rating = sum(anime['rating'] for anime in collection['animes'])\ncollection['average_rating'] = total_rating / collection['total_anime']\n\nprint(f\"Average rating: {collection['average_rating']:.2f}\")\n\n# 2. Save to JSON file\ntry:\n    with open('anime_collection.json', 'w', encoding='utf-8') as f:\n        json.dump(collection, f, indent=2, ensure_ascii=False)\n    print(\"✅ Collection saved!\")\n    \n    # 3. Read from file and verify\n    with open('anime_collection.json', 'r', encoding='utf-8') as f:\n        loaded_data = json.load(f)\n    \n    print(\"\\n📁 Data read from file:\")\n    for anime in loaded_data['animes']:\n        print(f\"- {anime['name']}: {anime['rating']}/10 ({anime['status']})\")\n        \nexcept Exception as e:\n    print(f\"❌ Error: {e}\")",
      testCases: [
        {
          description: "Average must be calculated",
          test: "assert collection['average_rating'] > 0",
        },
        {
          description: "File operations must work",
          test: "assert '✅' in output",
        },
      ],
    },
    hints: [
      "Calculate sum with sum() function",
      "Use with open() for file safety",
      "Use json.dump() and json.load() methods",
    ],
  },

  {
    id: "lesson_012",
    title: "Classes and Objects - OOP Fundamentals",
    slug: "classes-objects",
    description:
      "We'll learn the fundamentals of object-oriented programming. We'll see class creation, object creation and method usage.",
    content: {
      sections: {
        introduction: {
          title: "Object-Oriented Programming",
          content:
            "OOP uses classes and objects to model real-world entities. Every object has properties and behaviors.",
        },
        class_syntax: {
          title: "Defining Classes",
          content:
            '```python\nclass Character:\n    def __init__(self, name, level):\n        self.name = name\n        self.level = level\n\ngoku = Character("Goku", 99)\nprint(goku.name)\n```',
        },
        examples: {
          title: "Examples",
          content:
            '```python\nclass Character:\n    def __init__(self, name, level):\n        self.name = name\n        self.level = level\n\n    def level_up(self):\n        self.level += 1\n\ngoku = Character("Goku", 99)\ngoku.level_up()\nprint(goku.level)\n```',
        },
      },
    },
    difficulty: 4,
    duration: 50,
    category: "intermediate",
    type: "practical",
    diamondReward: 75,
    experienceReward: 220,
    order: 12,
    isPublished: true,
    learningObjectives: [
      "Understanding the class concept",
      "Using __init__ method",
      "Object properties and methods",
      "Understanding self parameter",
    ],
    practicalExercise: {
      description: "Anime warrior system",
      starterCode:
        "# Anime warrior system\n\nclass Warrior:\n    def __init__(self, name, health, attack_power, defense):\n        # Properties\n        pass\n    \n    def attack(self, target):\n        # Write attack method\n        pass\n    \n    def defend(self, damage):\n        # Write defense method\n        pass\n    \n    def show_info(self):\n        # Show character information\n        pass\n\n# Create two warriors and test\n",
      solution:
        'class Warrior:\n    def __init__(self, name, health, attack_power, defense):\n        self.name = name\n        self.health = health\n        self.max_health = health\n        self.attack_power = attack_power\n        self.defense = defense\n    \n    def attack(self, target):\n        damage = max(1, self.attack_power - target.defense)\n        target.take_damage(damage)\n        return f"{self.name} dealt {damage} damage to {target.name}!"\n    \n    def take_damage(self, damage):\n        self.health = max(0, self.health - damage)\n        if self.health == 0:\n            return f"{self.name} is defeated!"\n        return f"{self.name} has {self.health} health left."\n    \n    def show_info(self):\n        return f"{self.name}: {self.health}/{self.max_health} Health, {self.attack_power} Attack, {self.defense} Defense"\n\n# Warriors\ngoku = Warrior("Goku", 100, 35, 10)\nvegeta = Warrior("Vegeta", 95, 38, 8)\n\nprint("🥊 BATTLE BEGINS! 🥊")\nprint(goku.show_info())\nprint(vegeta.show_info())\nprint()\n\n# Battle\nprint(goku.attack(vegeta))\nprint(vegeta.take_damage(0))  # Show status\nprint()\nprint(vegeta.attack(goku))\nprint(goku.take_damage(0))  # Show status',
      testCases: [
        {
          description: "Class must be defined correctly",
          test: "assert hasattr(Warrior, '__init__')",
        },
        {
          description: "Objects must be created",
          test: "assert 'Goku' in output and 'Vegeta' in output",
        },
      ],
    },
    hints: [
      "Use self parameter in __init__ method",
      "Define properties with self.",
      "Don't forget self parameter in methods",
    ],
  },

  {
    id: "lesson_013",
    title: "Modules and Libraries",
    slug: "modules-libraries",
    description:
      "We'll learn Python's powerful module system. We'll see how to use ready-made libraries and create our own modules.",
    content: {
      sections: {
        import_basics: {
          title: "Importing Modules",
          content: "```python\nimport math\n\nprint(math.sqrt(16))\n```",
        },
        standard_library: {
          title: "Standard Library",
          content:
            "```python\nimport random\n\nprint(random.randint(1, 10))\n```",
        },
        examples: {
          title: "Examples",
          content:
            '```python\nfrom datetime import date\n\ntoday = date.today()\nprint(f"Today is {today}")\n```',
        },
      },
    },
    difficulty: 3,
    duration: 40,
    category: "intermediate",
    type: "practical",
    diamondReward: 80,
    experienceReward: 240,
    order: 13,
    isPublished: true,
    learningObjectives: [
      "Learning to import modules",
      "Using standard library",
      "Creating your own modules",
      "Understanding package structure",
    ],
    practicalExercise: {
      description: "Anime statistics module",
      starterCode:
        "# Anime statistics calculator\nimport random\nimport statistics\nfrom datetime import datetime\n\n# Generate random anime ratings (1-10 range, 20 items)\n# Calculate statistics: mean, median, mode\n# Report results with date\n",
      solution:
        'import random\nimport statistics\nfrom datetime import datetime\n\n# Generate random anime ratings\nprint("🎲 Generating random anime ratings...")\nratings = [random.uniform(6.0, 10.0) for _ in range(20)]\n\n# Calculate statistics\naverage = statistics.mean(ratings)\nmedian = statistics.median(ratings)\nhighest = max(ratings)\nlowest = min(ratings)\n\n# Create report\nreport_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")\n\nprint(f"\\n📊 ANIME STATISTICS REPORT")\nprint(f"📅 Date: {report_date}")\nprint(f"🎯 Total Anime: {len(ratings)}")\nprint(f"⭐ Average Rating: {average:.2f}")\nprint(f"📈 Median: {median:.2f}")\nprint(f"🏆 Highest: {highest:.2f}")\nprint(f"⬇️ Lowest: {lowest:.2f}")\n\n# Show top 5 ratings\ntop_5 = sorted(ratings, reverse=True)[:5]\nprint(f"\\n🥇 Top 5 Ratings:")\nfor i, rating in enumerate(top_5, 1):\n    print(f"   {i}. {rating:.2f}")\n\n# Rating distribution\nexcellent = len([r for r in ratings if r >= 9.0])\ngood = len([r for r in ratings if 7.0 <= r < 9.0])\naverage_count = len([r for r in ratings if r < 7.0])\n\nprint(f"\\n📈 Rating Distribution:")\nprint(f"   Excellent (9.0+): {excellent} anime")\nprint(f"   Good (7.0-8.9): {good} anime")\nprint(f"   Average (<7.0): {average_count} anime")',
      testCases: [
        {
          description: "20 ratings must be generated",
          test: "assert len(ratings) == 20",
        },
        {
          description: "Statistics must be calculated",
          test: "assert 'Average' in output and 'Median' in output",
        },
      ],
    },
    hints: [
      "Generate decimal random numbers with random.uniform()",
      "Use statistics module",
      "Filter with list comprehension",
    ],
  },

  {
    id: "lesson_014",
    title: "Practical Project - Anime Card Game",
    slug: "practical-project-card-game",
    description:
      "We'll combine what we've learned to create a fully functional anime card game. This project uses all Python fundamentals.",
    content: {
      sections: {
        project_overview: {
          title: "Project Overview",
          content:
            "In our anime card game project, players will collect cards, battle, and manage their collections.",
        },
        game_mechanics: {
          title: "Game Mechanics",
          content:
            "- Card collection management\n- Turn-based battle system\n- Score calculation\n- Save/load system",
        },
        implementation_steps: {
          title: "Implementation Steps",
          content:
            "1. Creating card class\n2. Designing player class\n3. Battle mechanics\n4. Menu system\n5. File operations",
        },
      },
    },
    difficulty: 5,
    duration: 90,
    category: "project",
    type: "project",
    diamondReward: 120,
    experienceReward: 300,
    order: 14,
    isPublished: true,
    learningObjectives: [
      "Developing large projects",
      "Inter-class interaction",
      "Game logic design",
      "Ensuring data persistence",
    ],
    practicalExercise: {
      description: "Anime card game project",
      starterCode:
        '# Anime Kart Oyunu - Tam Proje\n\nimport json\nimport random\n\nclass AnimeKart:\n    def __init__(self, isim, anime, guc, nadir_seviye, kart_tipi):\n        # Kart özelliklerini tanımlayın\n        pass\n    \n    def to_dict(self):\n        # Kartı sözlüğe çevirin (JSON için)\n        pass\n\nclass Oyuncu:\n    def __init__(self, isim):\n        # Oyuncu özelliklerini tanımlayın\n        pass\n    \n    def kart_ekle(self, kart):\n        # Koleksiyona kart ekleyin\n        pass\n    \n    def en_guclu_kart(self):\n        # En güçlü kartı bulun\n        pass\n\ndef kart_paketi_ac():\n    # Rastgele 5 kart içeren paket\n    pass\n\ndef savas(oyuncu1, oyuncu2):\n    # İki oyuncu arasında savaş\n    pass\n\ndef ana_menu():\n    # Oyun ana menüsü\n    pass\n\n# Oyunu başlat\nif __name__ == "__main__":\n    ana_menu()\n',
      solution:
        "# Anime Kart Oyunu - Tam Proje\n\nimport json\nimport random\nfrom datetime import datetime\n\nclass AnimeKart:\n    def __init__(self, isim, anime, guc, nadir_seviye, kart_tipi):\n        self.isim = isim\n        self.anime = anime\n        self.guc = guc\n        self.nadir_seviye = nadir_seviye  # 1-5\n        self.kart_tipi = kart_tipi\n        self.deger = guc * nadir_seviye\n    \n    def to_dict(self):\n        return {\n            'isim': self.isim,\n            'anime': self.anime,\n            'guc': self.guc,\n            'nadir_seviye': self.nadir_seviye,\n            'kart_tipi': self.kart_tipi\n        }\n    \n    def __str__(self):\n        yildiz = '⭐' * self.nadir_seviye\n        return f\"{self.isim} ({self.anime}) - Güç: {self.guc} {yildiz}\"\n\nclass Oyuncu:\n    def __init__(self, isim):\n        self.isim = isim\n        self.kartlar = []\n        self.puan = 0\n        self.kazanilan_savas = 0\n    \n    def kart_ekle(self, kart):\n        self.kartlar.append(kart)\n    \n    def en_guclu_kart(self):\n        if not self.kartlar:\n            return None\n        return max(self.kartlar, key=lambda k: k.deger)\n    \n    def koleksiyon_degeri(self):\n        return sum(kart.deger for kart in self.kartlar)\n    \n    def to_dict(self):\n        return {\n            'isim': self.isim,\n            'kartlar': [kart.to_dict() for kart in self.kartlar],\n            'puan': self.puan,\n            'kazanilan_savas': self.kazanilan_savas\n        }\n\n# Örnek kart havuzu\nKART_HAVUZU = [\n    ('Goku', 'Dragon Ball Z', 95, 5, 'Savaşçı'),\n    ('Naruto', 'Naruto', 88, 4, 'Ninja'),\n    ('Luffy', 'One Piece', 85, 4, 'Korsan'),\n    ('Ichigo', 'Bleach', 82, 4, 'Shinigami'),\n    ('Edward Elric', 'FMA', 78, 3, 'Simyacı'),\n    ('Natsu', 'Fairy Tail', 75, 3, 'Büyücü'),\n    ('Kirito', 'SAO', 72, 3, 'Oyuncu'),\n    ('Tanjiro', 'Demon Slayer', 70, 3, 'Avcı'),\n    ('Deku', 'My Hero Academia', 68, 3, 'Kahraman'),\n    ('Senku', 'Dr. Stone', 65, 2, 'Bilimci'),\n]\n\ndef kart_paketi_ac():\n    \"\"\"Rastgele 5 kart içeren paket aç\"\"\"\n    paket = []\n    for _ in range(5):\n        kart_bilgi = random.choice(KART_HAVUZU)\n        # Nadir seviyeyi biraz rastgele yap\n        nadir = max(1, kart_bilgi[3] + random.randint(-1, 1))\n        kart = AnimeKart(*kart_bilgi[:2], kart_bilgi[2], nadir, kart_bilgi[4])\n        paket.append(kart)\n    return paket\n\ndef savas(oyuncu1, oyuncu2):\n    \"\"\"İki oyuncu arasında savaş\"\"\"\n    kart1 = oyuncu1.en_guclu_kart()\n    kart2 = oyuncu2.en_guclu_kart()\n    \n    if not kart1 or not kart2:\n        return \"Oyunculardan birinin kartı yok!\"\n    \n    print(f\"\\n⚔️ SAVAŞ: {oyuncu1.isim} vs {oyuncu2.isim}\")\n    print(f\"{oyuncu1.isim}: {kart1}\")\n    print(f\"{oyuncu2.isim}: {kart2}\")\n    \n    if kart1.deger > kart2.deger:\n        oyuncu1.puan += 10\n        oyuncu1.kazanilan_savas += 1\n        print(f\"🏆 {oyuncu1.isim} kazandı! (+10 puan)\")\n        return oyuncu1\n    elif kart2.deger > kart1.deger:\n        oyuncu2.puan += 10\n        oyuncu2.kazanilan_savas += 1\n        print(f\"🏆 {oyuncu2.isim} kazandı! (+10 puan)\")\n        return oyuncu2\n    else:\n        print(\"🤝 Berabere!\")\n        return None\n\ndef oyuncu_kaydet(oyuncu, dosya_adi):\n    \"\"\"Oyuncuyu JSON dosyasına kaydet\"\"\"\n    try:\n        with open(dosya_adi, 'w', encoding='utf-8') as f:\n            json.dump(oyuncu.to_dict(), f, indent=2, ensure_ascii=False)\n        return True\n    except:\n        return False\n\ndef ana_menu():\n    \"\"\"Oyun ana menüsü\"\"\"\n    print(\"🎴 ANİME KART OYUNU 🎴\")\n    print(\"=\" * 30)\n    \n    oyuncu = Oyuncu(input(\"Oyuncu adınız: \"))\n    bilgisayar = Oyuncu(\"Bilgisayar\")\n    \n    # Başlangıç kartları\n    for _ in range(3):\n        oyuncu.kartlar.extend(kart_paketi_ac()[:1])\n        bilgisayar.kartlar.extend(kart_paketi_ac()[:1])\n    \n    while True:\n        print(f\"\\n📊 {oyuncu.isim}: {len(oyuncu.kartlar)} kart, {oyuncu.puan} puan\")\n        print(f\"📊 Bilgisayar: {len(bilgisayar.kartlar)} kart, {bilgisayar.puan} puan\")\n        \n        print(\"\\n1. Kart paketi aç (5 kart)\")\n        print(\"2. Koleksiyonu göster\")\n        print(\"3. Bilgisayarla savaş\")\n        print(\"4. Oyunu kaydet\")\n        print(\"5. Çıkış\")\n        \n        secim = input(\"\\nSeçiminiz: \")\n        \n        if secim == '1':\n            yeni_kartlar = kart_paketi_ac()\n            print(\"\\n🎁 Paket açıldı! Yeni kartlar:\")\n            for kart in yeni_kartlar:\n                print(f\"  • {kart}\")\n                oyuncu.kart_ekle(kart)\n        \n        elif secim == '2':\n            print(f\"\\n📚 {oyuncu.isim}'in Koleksiyonu:\")\n            for i, kart in enumerate(oyuncu.kartlar, 1):\n                print(f\"  {i}. {kart}\")\n            print(f\"\\n💎 Toplam Değer: {oyuncu.koleksiyon_degeri()}\")\n        \n        elif secim == '3':\n            # Bilgisayara rastgele kart ekle\n            bilgisayar.kartlar.extend(kart_paketi_ac()[:1])\n            savas(oyuncu, bilgisayar)\n        \n        elif secim == '4':\n            dosya_adi = f\"{oyuncu.isim}_save.json\"\n            if oyuncu_kaydet(oyuncu, dosya_adi):\n                print(f\"✅ Oyun {dosya_adi} dosyasına kaydedildi!\")\n            else:\n                print(\"❌ Kayıt hatası!\")\n        \n        elif secim == '5':\n            print(\"👋 Görüşürüz!\")\n            break\n        \n        else:\n            print(\"❌ Geçersiz seçim!\")\n\n# Oyunu başlat\nif __name__ == \"__main__\":\n    ana_menu()",
      testCases: [
        {
          description: "Sınıflar tanımlanmalı",
          test: "assert 'class AnimeKart' in open(__file__).read()",
        },
        {
          description: "Ana menü çalışmalı",
          test: "assert 'ANİME KART OYUNU' in output",
        },
      ],
    },
    hints: [
      "Sınıflar arası ilişkileri iyi tasarlayın",
      "JSON dosya işlemleri için try-except kullanın",
      "Kullanıcı deneyimini iyileştirmek için emoji kullanın",
    ],
  },

  {
    id: "lesson_015",
    title: "Python Future Journey",
    slug: "python-future-journey",
    description:
      "You've completed your Python learning journey! Learn what you can do next and which areas you can focus on.",
    content: {
      sections: {
        congratulations: {
          title: "Congratulations! 🎉",
          content:
            "You've successfully completed Python fundamentals! Now you can develop real projects and move on to more advanced topics.",
        },
        next_steps: {
          title: "Next Steps",
          content:
            "- Web development (Django, Flask)\n- Data analysis (Pandas, NumPy)\n- Artificial intelligence (TensorFlow, PyTorch)\n- Automation (Selenium, Scrapy)\n- Game development (Pygame)",
        },
        resources: {
          title: "Recommended Resources",
          content:
            "- Python.org official documentation\n- Open source projects on GitHub\n- Kaggle data science competitions\n- LeetCode algorithm problems\n- Real Python blog",
        },
      },
    },
    difficulty: 1,
    duration: 20,
    category: "motivation",
    type: "theory",
    diamondReward: 200,
    experienceReward: 500,
    order: 15,
    isPublished: true,
    learningObjectives: [
      "Evaluating your Python journey",
      "Setting future goals",
      "Creating a continuous learning plan",
      "Connecting with the community",
    ],
    practicalExercise: {
      description: "Create your personal Python roadmap",
      starterCode:
        '# Personal Python Roadmap\n\n# 1. List the topics you\'ve learned\n# 2. Identify the areas that interest you most\n# 3. Make a plan for the next 3 months\n# 4. Write your first project idea\n\nprint("🐍 WELCOME TO PYTHONIST! 🐍")\nprint("=" * 40)\n\n# Write your code here\n',
      solution:
        '# Personal Python Roadmap\n\nprint("🐍 WELCOME TO PYTHONIST! 🐍")\nprint("=" * 40)\n\n# 1. Topics learned\nlearned_topics = [\n    "✅ Variables and data types",\n    "✅ Conditions and loops",\n    "✅ Functions",\n    "✅ Lists and dictionaries",\n    "✅ Error handling",\n    "✅ File operations",\n    "✅ Classes and objects",\n    "✅ Modules and libraries",\n    "✅ Practical projects"\n]\n\nprint("📚 TOPICS I\'VE LEARNED:")\nfor topic in learned_topics:\n    print(f"  {topic}")\n\n# 2. Areas of interest\ninterest_areas = {\n    "Web Development": "Websites with Django/Flask",\n    "Data Analysis": "Data processing with Pandas",\n    "Artificial Intelligence": "Machine Learning projects",\n    "Automation": "Automating daily tasks",\n    "Game Development": "Games with Pygame"\n}\n\nprint(f"\\n🎯 MY AREAS OF INTEREST:")\nfor area, description in interest_areas.items():\n    print(f"  🔹 {area}: {description}")\n\n# 3. 3-month plan\nplan = {\n    "1st Month": "Start learning Django, create simple blog site",\n    "2nd Month": "Develop data analysis project with Pandas",\n    "3rd Month": "Web scraping data collection application"\n}\n\nprint(f"\\n📅 3-MONTH PLAN:")\nfor month, goal in plan.items():\n    print(f"  {month}: {goal}")\n\n# 4. First project idea\nproject_idea = """\n🚀 MY FIRST BIG PROJECT:\n\'Anime Recommendation System\'\n- Analyze user preferences\n- Suggest similar anime\n- Easy to use with web interface\n- Anime information in database\n"""\n\nprint(project_idea)\n\n# 5. Motivation message\nprint("\\n💪 REMEMBER:")\nprint("  • Write some code every day")\nprint("  • Don\'t fear mistakes, they\'re learning opportunities")\nprint("  • Share with community, learn together")\nprint("  • Create projects, build portfolio")\nprint("  • Be patient, mastery takes time")\n\nprint("\\n🌟 YOU ARE NOW A PYTHONIST! 🌟")\nprint("Your journey is just beginning... 🚀")',
      testCases: [
        {
          description: "Plan must be created",
          test: "assert 'PLAN' in output or 'plan' in output.lower()",
        },
        {
          description: "Motivation message must exist",
          test: "assert 'PYTHONIST' in output or 'success' in output.lower()",
        },
      ],
    },
    hints: [
      "Plan according to your own areas of interest",
      "Set realistic goals",
      "Develop a continuous learning habit",
    ],
  },
];

const quizData = [
  {
    lessonId: "lesson_001",
    questions: [
      {
        type: "multiple_choice",
        question: "Python hangi yılda geliştirilmeye başlandı?",
        options: ["1985", "1989", "1991", "1995"],
        correctAnswer: "1989",
        explanation:
          "Python, 1989 yılında Guido van Rossum tarafından geliştirilmeye başlandı.",
        points: 10,
      },
      {
        type: "multiple_choice",
        question: "Python'un yaratıcısı kimdir?",
        options: [
          "Linus Torvalds",
          "Guido van Rossum",
          "Dennis Ritchie",
          "Bjarne Stroustrup",
        ],
        correctAnswer: "Guido van Rossum",
        explanation: "Python'un yaratıcısı Guido van Rossum'dur.",
        points: 10,
      },
    ],
  },
  {
    lessonId: "lesson_002",
    questions: [
      {
        type: "multiple_choice",
        question: "Hangi değişken adı geçerlidir?",
        options: ["2karakter", "karakter_adi", "karakter-adi", "karakter adı"],
        correctAnswer: "karakter_adi",
        explanation:
          "Değişken adları sayı ile başlayamaz, tire ve boşluk içeremez. Alt tire (_) kullanabilir.",
        points: 10,
      },
      {
        type: "true_false",
        question: "Python'da değişken tipleri önceden belirtilmelidir.",
        correctAnswer: false,
        explanation:
          "Python dinamik tiplemeli bir dildir, değişken tiplerini otomatik olarak belirler.",
        points: 10,
      },
      {
        type: "multiple_choice",
        question:
          "Aşağıdaki kodda hangi değişken tanımlaması yanlıştır?\n\nname = 'Goku'\nage = 27\npower-level = 9000\nis_saiyan = True",
        options: [
          "name = 'Goku'",
          "age = 27",
          "power-level = 9000",
          "is_saiyan = True",
        ],
        correctAnswer: "power-level = 9000",
        explanation:
          "Değişken adlarında tire (-) kullanılamaz. Bunun yerine alt tire (_) kullanılmalıdır: power_level",
        points: 10,
      },
      {
        type: "multiple_choice",
        question: "Python'da değişken değeri değiştirmek için ne yapılır?",
        options: [
          "Değişken yeniden tanımlanır",
          "Değişkene yeni değer atanır",
          "Değişken silinip yeniden oluşturulur",
          "Değişken değeri değiştirilemez",
        ],
        correctAnswer: "Değişkene yeni değer atanır",
        explanation:
          "Python'da değişken değerini değiştirmek için basitçe yeni bir değer ataması yapılır: variable = new_value",
        points: 10,
      },
      {
        type: "true_false",
        question: "character_name ve CHARACTER_NAME aynı değişkendir.",
        correctAnswer: false,
        explanation:
          "Python case-sensitive bir dildir. Büyük-küçük harf farkı önemlidir, bu iki değişken farklıdır.",
        points: 10,
      },
      {
        type: "multiple_choice",
        question:
          "Aşağıdaki kodun çıktısı nedir?\n\nx = 10\ny = x\nx = 20\nprint(y)",
        options: ["10", "20", "None", "Error"],
        correctAnswer: "10",
        explanation:
          "y değişkenine x'in değeri (10) kopyalanır. x'i daha sonra değiştirmek y'yi etkilemez.",
        points: 15,
      },
      {
        type: "multiple_choice",
        question: "Hangi veri tipi sayısal hesaplamalar için uygun DEĞİLDİR?",
        options: ["int", "float", "string", "complex"],
        correctAnswer: "string",
        explanation:
          "String metin verilerini saklar, sayısal hesaplamalar için int, float veya complex kullanılır.",
        points: 10,
      },
      {
        type: "true_false",
        question:
          "Python'da bir değişkene hem sayı hem metin atanabilir (farklı zamanlarda).",
        correctAnswer: true,
        explanation:
          "Python dinamik tiplemeli olduğu için aynı değişkene farklı zamanlarda farklı tipte değerler atanabilir.",
        points: 10,
      },
      {
        type: "multiple_choice",
        question: "Aşağıdakilerden hangisi geçerli bir değişken adı DEĞİLDİR?",
        options: ["_private", "anime2023", "for", "userName"],
        correctAnswer: "for",
        explanation:
          "'for' Python'da reserved keyword (ayrılmış kelime) olduğu için değişken adı olarak kullanılamaz.",
        points: 15,
      },
      {
        type: "multiple_choice",
        question: "Değişken adlandırma için en iyi pratik hangisidir?",
        options: [
          "Kısa ve anlamsız: a, b, c",
          "Açıklayıcı ve snake_case: character_power_level",
          "Karışık: CharacterPOWERlevel",
          "Sayılarla başlayan: 1character_name",
        ],
        correctAnswer: "Açıklayıcı ve snake_case: character_power_level",
        explanation:
          "Python'da snake_case kullanılır ve değişken adları açıklayıcı olmalıdır. Bu kodu daha okunabilir yapar.",
        points: 10,
      },
    ],
  },
  {
    lessonId: "lesson_003",
    questions: [
      {
        type: "multiple_choice",
        question: "5 ** 2 işleminin sonucu nedir?",
        options: ["10", "25", "52", "7"],
        correctAnswer: "25",
        explanation: "** operatörü üs alma işlemi yapar. 5^2 = 25",
        points: 10,
      },
      {
        type: "multiple_choice",
        question: "17 % 5 işleminin sonucu nedir?",
        options: ["2", "3", "3.4", "12"],
        correctAnswer: "2",
        explanation:
          "% operatörü modulo (kalan) işlemi yapar. 17'yi 5'e böldüğümüzde kalan 2'dir.",
        points: 10,
      },
    ],
  },
  {
    lessonId: "lesson_004",
    questions: [
      {
        type: "multiple_choice",
        question: "Hangi koşullu ifade doğrudur?",
        options: ["if x = 5:", "if x == 5:", "if x := 5:", "if x equals 5:"],
        correctAnswer: "if x == 5:",
        explanation: "Karşılaştırma için == operatörü kullanılır.",
        points: 10,
      },
      {
        type: "true_false",
        question: "elif ifadesi, else'den sonra yazılabilir.",
        correctAnswer: false,
        explanation: "elif ifadesi, else'den önce yazılmalıdır.",
        points: 5,
      },
    ],
  },
  {
    lessonId: "lesson_005",
    questions: [
      {
        type: "multiple_choice",
        question: "range(5) kaç sayı üretir?",
        options: ["4", "5", "6", "Belirsiz"],
        correctAnswer: "5",
        explanation: "range(5) 0,1,2,3,4 sayılarını üretir (5 tane).",
        points: 10,
      },
      {
        type: "multiple_choice",
        question: "while döngüsü ne zaman durur?",
        options: [
          "Hiçbir zaman",
          "Koşul False olduğunda",
          "break geldiğinde",
          "B ve C doğru",
        ],
        correctAnswer: "B ve C doğru",
        explanation:
          "while döngüsü koşul False olunca veya break ile durdurulabilir.",
        points: 10,
      },
    ],
  },
  {
    lessonId: "lesson_006",
    questions: [
      {
        type: "multiple_choice",
        question: "Liste sonuna eleman eklemek için hangi metod kullanılır?",
        options: ["add()", "append()", "insert()", "push()"],
        correctAnswer: "append()",
        explanation: "append() metodu liste sonuna eleman ekler.",
        points: 10,
      },
      {
        type: "true_false",
        question: "Listeler farklı veri tiplerini içerebilir.",
        correctAnswer: true,
        explanation:
          "Python listelerinde string, int, float gibi farklı tipler bulunabilir.",
        points: 5,
      },
    ],
  },
  {
    lessonId: "lesson_007",
    questions: [
      {
        type: "multiple_choice",
        question: "Fonksiyon tanımlamak için hangi anahtar kelime kullanılır?",
        options: ["func", "def", "function", "define"],
        correctAnswer: "def",
        explanation:
          "Python'da fonksiyonlar def anahtar kelimesi ile tanımlanır.",
        points: 10,
      },
      {
        type: "multiple_choice",
        question: "return ifadesi ne yapar?",
        options: [
          "Fonksiyonu durdurur",
          "Değer döndürür",
          "Her ikisi",
          "Hiçbiri",
        ],
        correctAnswer: "Her ikisi",
        explanation: "return hem fonksiyonu durdurur hem de değer döndürür.",
        points: 10,
      },
    ],
  },
  {
    lessonId: "lesson_008",
    questions: [
      {
        type: "multiple_choice",
        question: "'Python'.upper() sonucu nedir?",
        options: ["python", "PYTHON", "Python", "PyThOn"],
        correctAnswer: "PYTHON",
        explanation: "upper() metodu tüm harfleri büyük harfe çevirir.",
        points: 10,
      },
      {
        type: "multiple_choice",
        question: "String dilimleme için hangi operatör kullanılır?",
        options: ["[]", "()", "{}", "||"],
        correctAnswer: "[]",
        explanation: "String dilimleme için köşeli parantez [] kullanılır.",
        points: 10,
      },
    ],
  },
  {
    lessonId: "lesson_009",
    questions: [
      {
        type: "multiple_choice",
        question: "Sözlük oluşturmak için hangi parantez kullanılır?",
        options: ["[]", "()", "{}", "<>"],
        correctAnswer: "{}",
        explanation: "Sözlükler süslü parantez {} ile oluşturulur.",
        points: 10,
      },
      {
        type: "true_false",
        question: "Sözlük anahtarları değiştirilebilir.",
        correctAnswer: false,
        explanation: "Sözlük anahtarları immutable (değişmez) olmalıdır.",
        points: 5,
      },
    ],
  },
  {
    lessonId: "lesson_010",
    questions: [
      {
        type: "multiple_choice",
        question: "Hata yakalamak için hangi yapı kullanılır?",
        options: ["try-catch", "try-except", "catch-error", "error-handle"],
        correctAnswer: "try-except",
        explanation: "Python'da hatalar try-except yapısı ile yakalanır.",
        points: 10,
      },
      {
        type: "multiple_choice",
        question: "ZeroDivisionError ne zaman oluşur?",
        options: [
          "Sıfıra bölme",
          "Negatif sayı",
          "Büyük sayı",
          "String hatası",
        ],
        correctAnswer: "Sıfıra bölme",
        explanation: "ZeroDivisionError sıfıra bölme işleminde oluşur.",
        points: 10,
      },
    ],
  },
  {
    lessonId: "lesson_011",
    questions: [
      {
        type: "multiple_choice",
        question: "Dosya okumak için hangi mod kullanılır?",
        options: ["'w'", "'r'", "'a'", "'x'"],
        correctAnswer: "'r'",
        explanation: "'r' modu dosya okuma için kullanılır.",
        points: 10,
      },
      {
        type: "true_false",
        question: "with statement dosyayı otomatik kapatır.",
        correctAnswer: true,
        explanation:
          "with statement dosya işlemi bitince dosyayı otomatik kapatır.",
        points: 5,
      },
    ],
  },
  {
    lessonId: "lesson_012",
    questions: [
      {
        type: "multiple_choice",
        question: "__init__ metodu ne işe yarar?",
        options: [
          "Sınıfı başlatır",
          "Objeyi başlatır",
          "Programı başlatır",
          "Hiçbiri",
        ],
        correctAnswer: "Objeyi başlatır",
        explanation:
          "__init__ metodu obje oluşturulduğunda çağrılır ve objeyi başlatır.",
        points: 10,
      },
      {
        type: "true_false",
        question: "self parametresi zorunludur.",
        correctAnswer: true,
        explanation: "Sınıf metodlarında self parametresi zorunludur.",
        points: 5,
      },
    ],
  },
  {
    lessonId: "lesson_013",
    questions: [
      {
        type: "multiple_choice",
        question: "Modül içe aktarmak için hangi kelime kullanılır?",
        options: ["include", "import", "require", "use"],
        correctAnswer: "import",
        explanation: "Python'da modüller import kelimesi ile içe aktarılır.",
        points: 10,
      },
      {
        type: "multiple_choice",
        question: "random.randint(1, 10) ne yapar?",
        options: ["1-9 arası", "1-10 arası", "0-10 arası", "0-9 arası"],
        correctAnswer: "1-10 arası",
        explanation:
          "randint(1, 10) 1 ile 10 arasında (dahil) rastgele sayı üretir.",
        points: 10,
      },
    ],
  },
  {
    lessonId: "lesson_014",
    questions: [
      {
        type: "multiple_choice",
        question: "Büyük projede en önemli olan nedir?",
        options: ["Hız", "Organizasyon", "Boyut", "Karmaşıklık"],
        correctAnswer: "Organizasyon",
        explanation: "Büyük projelerde kod organizasyonu en önemli faktördür.",
        points: 10,
      },
      {
        type: "true_false",
        question: "Sınıflar arası etkileşim OOP'nin temellerinden biridir.",
        correctAnswer: true,
        explanation:
          "Objeler arası etkileşim nesne yönelimli programlamanın temel prensiplerinden biridir.",
        points: 5,
      },
    ],
  },
  {
    lessonId: "lesson_015",
    questions: [
      {
        type: "multiple_choice",
        question: "Python öğrendikten sonra hangi alan en popülerdir?",
        options: [
          "Oyun geliştirme",
          "Web geliştirme",
          "Masaüstü uygulamaları",
          "Mobil uygulamalar",
        ],
        correctAnswer: "Web geliştirme",
        explanation:
          "Python'da web geliştirme (Django, Flask) en popüler alanlardan biridir.",
        points: 10,
      },
      {
        type: "true_false",
        question: "Sürekli öğrenme Python geliştiricisi için önemlidir.",
        correctAnswer: true,
        explanation:
          "Teknoloji sürekli gelişir, bu yüzden sürekli öğrenme çok önemlidir.",
        points: 5,
      },
    ],
  },
];

export async function seedLessons() {
  console.log("🌱 Seeding lessons...");

  try {
    // Delete existing lessons and quizzes with proper cleanup
    console.log("🗑️ Cleaning existing data...");
    await prisma.quiz.deleteMany({});
    await prisma.learningActivity.deleteMany({});
    console.log("✅ Existing data cleaned");
  } catch (error) {
    console.log("⚠️ No existing data to clean");
  }

  // Create lessons
  for (const lessonData of lessonsData) {
    await prisma.learningActivity.create({
      data: {
        id: lessonData.id,
        title: lessonData.title,
        description: lessonData.description,
        content: JSON.stringify(lessonData.content),
        activityType: lessonData.type || "theory_interactive",
        category: lessonData.category || "general",
        difficulty: lessonData.difficulty || 1,
        diamondReward: lessonData.diamondReward || 10,
        experienceReward: lessonData.experienceReward || 25,
        estimatedMinutes: lessonData.duration || 5,
        sortOrder: lessonData.order || 0,
        isActive: lessonData.isPublished || false,
        tags: JSON.stringify(lessonData.hints || []),
        settings: JSON.stringify({
          slug: lessonData.slug,
          isPublished: lessonData.isPublished,
          hasCodeExercise: !!lessonData.practicalExercise,
          starterCode: lessonData.practicalExercise?.starterCode,
          solutionCode: lessonData.practicalExercise?.solution,
          testCases: lessonData.practicalExercise?.testCases || [],
          hints: lessonData.hints || [],
          prerequisites: [],
          learningObjectives: lessonData.learningObjectives || [],
          practicalExercise: lessonData.practicalExercise || null,
          source: "legacy_seed_lessons",
          migrated_at: new Date().toISOString(),
          original_type: lessonData.type,
        }),
      },
    });
  }

  // Create quizzes (standalone - no direct relationship to learning activities in current schema)
  for (const quiz of quizData) {
    await prisma.quiz.create({
      data: {
        id: `quiz_${quiz.lessonId}`,
        title: `${quiz.lessonId} Quiz`,
        description: `Quiz for ${quiz.lessonId}`,
        questions: JSON.stringify(quiz.questions),
        timeLimit: 300,
        diamondReward: 15,
        experienceReward: 25,
        difficulty: 1,
        isActive: true,
      },
    });
  }

  console.log("✅ Lessons seeded successfully!");
}

if (require.main === module) {
  seedLessons()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
