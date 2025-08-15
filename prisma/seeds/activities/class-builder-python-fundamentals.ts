// CLASS_BUILDER Activities - Python Fundamentals
// Object-oriented programming and class construction activities

export const classBuilderPythonFundamentalsActivities = [
  {
    title: "Basic Class Creation - Student Profile",
    description:
      "Build a simple Student class with basic properties and methods",
    activityType: "class_builder",
    category: "Python Fundamentals",
    difficulty: 1,
    diamondReward: 15,
    experienceReward: 30,
    estimatedMinutes: 20,
    tags: ["oop", "classes", "basic", "constructor"],
    content: {
      instructions:
        "Build a Student class that can store and display student information",
      className: "Student",
      language: "Python",
      requiredProperties: [
        { name: "name", type: "str", visibility: "public" },
        { name: "age", type: "int", visibility: "public" },
        { name: "student_id", type: "str", visibility: "public" },
      ],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["name", "age", "student_id"],
          visibility: "public",
        },
        {
          name: "display_info",
          returnType: "str",
          parameters: [],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "name",
          type: "str",
          visibility: "public",
          description: "Student's full name",
        },
        {
          name: "age",
          type: "int",
          visibility: "public",
          description: "Student's age in years",
        },
        {
          name: "student_id",
          type: "str",
          visibility: "public",
          description: "Unique student identifier",
        },
        {
          name: "grade",
          type: "str",
          visibility: "public",
          description: "Current grade level",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["name", "age", "student_id"],
          visibility: "public",
          description: "Initialize student with basic information",
        },
        {
          name: "display_info",
          returnType: "str",
          parameters: [],
          visibility: "public",
          description: "Return formatted student information",
        },
        {
          name: "update_age",
          returnType: "None",
          parameters: ["new_age"],
          visibility: "public",
          description: "Update student's age",
        },
      ],
      allowCustom: true,
      hints: [
        "Use __init__ method to initialize object properties",
        "Store passed parameters as instance variables with self",
        "Format the display_info return string nicely",
      ],
    },
    settings: {
      timeLimit: 1200,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 1,
  },

  {
    title: "Bank Account with Encapsulation",
    description:
      "Build a BankAccount class with proper data encapsulation and validation",
    activityType: "class_builder",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 25,
    experienceReward: 50,
    estimatedMinutes: 25,
    tags: ["oop", "encapsulation", "private-variables", "validation"],
    content: {
      instructions:
        "Build a secure BankAccount class with proper encapsulation",
      className: "BankAccount",
      language: "Python",
      requiredProperties: [
        { name: "account_number", type: "str", visibility: "public" },
        { name: "owner_name", type: "str", visibility: "public" },
        { name: "_balance", type: "float", visibility: "private" },
      ],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["account_number", "owner_name", "initial_balance"],
          visibility: "public",
        },
        {
          name: "deposit",
          returnType: "bool",
          parameters: ["amount"],
          visibility: "public",
        },
        {
          name: "withdraw",
          returnType: "bool",
          parameters: ["amount"],
          visibility: "public",
        },
        {
          name: "get_balance",
          returnType: "float",
          parameters: [],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "account_number",
          type: "str",
          visibility: "public",
          description: "Unique account identifier",
        },
        {
          name: "owner_name",
          type: "str",
          visibility: "public",
          description: "Account owner's name",
        },
        {
          name: "_balance",
          type: "float",
          visibility: "private",
          description: "Current account balance (private)",
        },
        {
          name: "_transaction_history",
          type: "list",
          visibility: "private",
          description: "List of transactions (optional)",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["account_number", "owner_name", "initial_balance"],
          visibility: "public",
          description: "Initialize bank account with starting balance",
        },
        {
          name: "deposit",
          returnType: "bool",
          parameters: ["amount"],
          visibility: "public",
          description: "Add money to account, return success status",
        },
        {
          name: "withdraw",
          returnType: "bool",
          parameters: ["amount"],
          visibility: "public",
          description: "Remove money from account if sufficient funds",
        },
        {
          name: "get_balance",
          returnType: "float",
          parameters: [],
          visibility: "public",
          description: "Return current balance (read-only access)",
        },
        {
          name: "_validate_amount",
          returnType: "bool",
          parameters: ["amount"],
          visibility: "private",
          description: "Private method to validate transaction amounts",
        },
      ],
      allowCustom: true,
      hints: [
        "Use underscore prefix for private attributes",
        "Validate amounts before processing transactions",
        "Return boolean values to indicate success/failure",
        "Never allow direct access to balance",
      ],
    },
    settings: {
      timeLimit: 1500,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 2,
  },

  {
    title: "Car Class with Methods and Properties",
    description:
      "Create a Car class with various methods for different operations",
    activityType: "class_builder",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 45,
    estimatedMinutes: 22,
    tags: ["oop", "methods", "state-management", "object-behavior"],
    content: {
      instructions:
        "Build a Car class that can track state and perform operations",
      className: "Car",
      language: "Python",
      requiredProperties: [
        { name: "make", type: "str", visibility: "public" },
        { name: "model", type: "str", visibility: "public" },
        { name: "year", type: "int", visibility: "public" },
        { name: "_mileage", type: "float", visibility: "private" },
        { name: "_is_running", type: "bool", visibility: "private" },
      ],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["make", "model", "year"],
          visibility: "public",
        },
        {
          name: "start_engine",
          returnType: "str",
          parameters: [],
          visibility: "public",
        },
        {
          name: "stop_engine",
          returnType: "str",
          parameters: [],
          visibility: "public",
        },
        {
          name: "drive",
          returnType: "str",
          parameters: ["miles"],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "make",
          type: "str",
          visibility: "public",
          description: "Car manufacturer",
        },
        {
          name: "model",
          type: "str",
          visibility: "public",
          description: "Car model name",
        },
        {
          name: "year",
          type: "int",
          visibility: "public",
          description: "Manufacturing year",
        },
        {
          name: "_mileage",
          type: "float",
          visibility: "private",
          description: "Total miles driven",
        },
        {
          name: "_is_running",
          type: "bool",
          visibility: "private",
          description: "Engine status",
        },
        {
          name: "_fuel_level",
          type: "float",
          visibility: "private",
          description: "Current fuel percentage",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["make", "model", "year"],
          visibility: "public",
          description: "Initialize car with basic information",
        },
        {
          name: "start_engine",
          returnType: "str",
          parameters: [],
          visibility: "public",
          description: "Start the car engine",
        },
        {
          name: "stop_engine",
          returnType: "str",
          parameters: [],
          visibility: "public",
          description: "Stop the car engine",
        },
        {
          name: "drive",
          returnType: "str",
          parameters: ["miles"],
          visibility: "public",
          description: "Drive the car for specified miles",
        },
        {
          name: "get_info",
          returnType: "str",
          parameters: [],
          visibility: "public",
          description: "Return formatted car information",
        },
      ],
      allowCustom: true,
      hints: [
        "Initialize _is_running to False and _mileage to 0.0",
        "Check engine status before allowing driving",
        "Update mileage when driving",
        "Return informative messages for each action",
      ],
    },
    settings: {
      timeLimit: 1320,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 3,
  },

  {
    title: "Library Book Management System",
    description:
      "Build a Book class with advanced features like availability tracking",
    activityType: "class_builder",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 28,
    tags: ["oop", "complex-logic", "state-tracking", "datetime"],
    content: {
      instructions: "Build a comprehensive Book class for library management",
      className: "Book",
      language: "Python",
      requiredProperties: [
        { name: "title", type: "str", visibility: "public" },
        { name: "author", type: "str", visibility: "public" },
        { name: "isbn", type: "str", visibility: "public" },
        { name: "_is_available", type: "bool", visibility: "private" },
        { name: "_borrowed_by", type: "str", visibility: "private" },
        { name: "_due_date", type: "str", visibility: "private" },
      ],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["title", "author", "isbn"],
          visibility: "public",
        },
        {
          name: "borrow_book",
          returnType: "bool",
          parameters: ["borrower_name", "days"],
          visibility: "public",
        },
        {
          name: "return_book",
          returnType: "bool",
          parameters: [],
          visibility: "public",
        },
        {
          name: "is_available",
          returnType: "bool",
          parameters: [],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "title",
          type: "str",
          visibility: "public",
          description: "Book title",
        },
        {
          name: "author",
          type: "str",
          visibility: "public",
          description: "Book author",
        },
        {
          name: "isbn",
          type: "str",
          visibility: "public",
          description: "International Standard Book Number",
        },
        {
          name: "_is_available",
          type: "bool",
          visibility: "private",
          description: "Current availability status",
        },
        {
          name: "_borrowed_by",
          type: "str",
          visibility: "private",
          description: "Name of current borrower",
        },
        {
          name: "_due_date",
          type: "str",
          visibility: "private",
          description: "Return due date",
        },
        {
          name: "_borrow_history",
          type: "list",
          visibility: "private",
          description: "History of borrowing transactions",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["title", "author", "isbn"],
          visibility: "public",
          description: "Initialize book with basic information",
        },
        {
          name: "borrow_book",
          returnType: "bool",
          parameters: ["borrower_name", "days"],
          visibility: "public",
          description: "Borrow book for specified number of days",
        },
        {
          name: "return_book",
          returnType: "bool",
          parameters: [],
          visibility: "public",
          description: "Return the book to library",
        },
        {
          name: "is_available",
          returnType: "bool",
          parameters: [],
          visibility: "public",
          description: "Check if book is available for borrowing",
        },
        {
          name: "get_book_info",
          returnType: "str",
          parameters: [],
          visibility: "public",
          description: "Get detailed book information",
        },
        {
          name: "_calculate_due_date",
          returnType: "str",
          parameters: ["days"],
          visibility: "private",
          description: "Calculate due date based on borrow period",
        },
      ],
      allowCustom: true,
      hints: [
        "Initialize _is_available to True",
        "Set _borrowed_by to None initially",
        "Only allow borrowing if book is available",
        "Clear borrower info when book is returned",
        "Use datetime for due date calculations",
      ],
    },
    settings: {
      timeLimit: 1680,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 4,
  },

  {
    title: "Temperature Converter Class",
    description:
      "Build a scientific temperature converter with multiple scales",
    activityType: "class_builder",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 22,
    experienceReward: 48,
    estimatedMinutes: 24,
    tags: ["oop", "mathematics", "conversion", "static-methods"],
    content: {
      instructions:
        "Build a TemperatureConverter class with conversion methods",
      className: "TemperatureConverter",
      language: "Python",
      requiredProperties: [
        { name: "_temperature", type: "float", visibility: "private" },
        { name: "_scale", type: "str", visibility: "private" },
      ],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["temperature", "scale"],
          visibility: "public",
        },
        {
          name: "to_celsius",
          returnType: "float",
          parameters: [],
          visibility: "public",
        },
        {
          name: "to_fahrenheit",
          returnType: "float",
          parameters: [],
          visibility: "public",
        },
        {
          name: "to_kelvin",
          returnType: "float",
          parameters: [],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "_temperature",
          type: "float",
          visibility: "private",
          description: "Temperature value",
        },
        {
          name: "_scale",
          type: "str",
          visibility: "private",
          description: "Current temperature scale (C, F, K)",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["temperature", "scale"],
          visibility: "public",
          description: "Initialize with temperature and scale",
        },
        {
          name: "to_celsius",
          returnType: "float",
          parameters: [],
          visibility: "public",
          description: "Convert to Celsius",
        },
        {
          name: "to_fahrenheit",
          returnType: "float",
          parameters: [],
          visibility: "public",
          description: "Convert to Fahrenheit",
        },
        {
          name: "to_kelvin",
          returnType: "float",
          parameters: [],
          visibility: "public",
          description: "Convert to Kelvin",
        },
        {
          name: "set_temperature",
          returnType: "None",
          parameters: ["temperature", "scale"],
          visibility: "public",
          description: "Update temperature and scale",
        },
        {
          name: "_validate_scale",
          returnType: "bool",
          parameters: ["scale"],
          visibility: "private",
          description: "Validate temperature scale input",
        },
      ],
      allowCustom: true,
      hints: [
        "Support scales: 'C' (Celsius), 'F' (Fahrenheit), 'K' (Kelvin)",
        "Conversion formulas: F = C * 9/5 + 32, K = C + 273.15",
        "Convert to Celsius first, then to target scale",
        "Validate scale parameter in constructor",
      ],
    },
    settings: {
      timeLimit: 1440,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 5,
  },

  {
    title: "Shopping Cart with Item Management",
    description:
      "Create a ShoppingCart class with advanced item management features",
    activityType: "class_builder",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 35,
    experienceReward: 70,
    estimatedMinutes: 30,
    tags: ["oop", "collections", "calculations", "data-management"],
    content: {
      instructions: "Build a comprehensive ShoppingCart class for e-commerce",
      className: "ShoppingCart",
      language: "Python",
      requiredProperties: [
        { name: "_items", type: "dict", visibility: "private" },
        { name: "_tax_rate", type: "float", visibility: "private" },
        { name: "_discount", type: "float", visibility: "private" },
      ],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["tax_rate"],
          visibility: "public",
        },
        {
          name: "add_item",
          returnType: "None",
          parameters: ["item_name", "price", "quantity"],
          visibility: "public",
        },
        {
          name: "remove_item",
          returnType: "bool",
          parameters: ["item_name"],
          visibility: "public",
        },
        {
          name: "get_total",
          returnType: "float",
          parameters: [],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "_items",
          type: "dict",
          visibility: "private",
          description: "Dictionary storing item details",
        },
        {
          name: "_tax_rate",
          type: "float",
          visibility: "private",
          description: "Tax rate as decimal (e.g., 0.08 for 8%)",
        },
        {
          name: "_discount",
          type: "float",
          visibility: "private",
          description: "Current discount amount",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["tax_rate"],
          visibility: "public",
          description: "Initialize cart with tax rate",
        },
        {
          name: "add_item",
          returnType: "None",
          parameters: ["item_name", "price", "quantity"],
          visibility: "public",
          description: "Add item to cart or update quantity",
        },
        {
          name: "remove_item",
          returnType: "bool",
          parameters: ["item_name"],
          visibility: "public",
          description: "Remove item from cart",
        },
        {
          name: "update_quantity",
          returnType: "bool",
          parameters: ["item_name", "new_quantity"],
          visibility: "public",
          description: "Update item quantity",
        },
        {
          name: "get_subtotal",
          returnType: "float",
          parameters: [],
          visibility: "public",
          description: "Calculate subtotal before tax and discount",
        },
        {
          name: "get_total",
          returnType: "float",
          parameters: [],
          visibility: "public",
          description: "Calculate final total with tax and discount",
        },
        {
          name: "apply_discount",
          returnType: "None",
          parameters: ["discount_amount"],
          visibility: "public",
          description: "Apply discount to cart",
        },
        {
          name: "get_item_count",
          returnType: "int",
          parameters: [],
          visibility: "public",
          description: "Get total number of unique items",
        },
      ],
      allowCustom: true,
      hints: [
        "Store items as: {name: {'price': float, 'quantity': int}}",
        "Initialize _items as empty dict, _discount as 0.0",
        "Handle item updates by checking if item already exists",
        "Calculate: subtotal - discount + (subtotal * tax_rate)",
      ],
    },
    settings: {
      timeLimit: 1800,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 6,
  },

  {
    title: "Employee Management System",
    description:
      "Build an Employee class with salary calculations and benefits",
    activityType: "class_builder",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 32,
    experienceReward: 68,
    estimatedMinutes: 26,
    tags: ["oop", "business-logic", "calculations", "employee-management"],
    content: {
      instructions: "Build an Employee class for HR management system",
      className: "Employee",
      language: "Python",
      requiredProperties: [
        { name: "employee_id", type: "str", visibility: "public" },
        { name: "name", type: "str", visibility: "public" },
        { name: "department", type: "str", visibility: "public" },
        { name: "_base_salary", type: "float", visibility: "private" },
        { name: "_hire_date", type: "str", visibility: "private" },
      ],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: [
            "employee_id",
            "name",
            "department",
            "base_salary",
            "hire_date",
          ],
          visibility: "public",
        },
        {
          name: "calculate_monthly_salary",
          returnType: "float",
          parameters: [],
          visibility: "public",
        },
        {
          name: "get_years_of_service",
          returnType: "int",
          parameters: [],
          visibility: "public",
        },
        {
          name: "apply_raise",
          returnType: "None",
          parameters: ["percentage"],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "employee_id",
          type: "str",
          visibility: "public",
          description: "Unique employee identifier",
        },
        {
          name: "name",
          type: "str",
          visibility: "public",
          description: "Employee full name",
        },
        {
          name: "department",
          type: "str",
          visibility: "public",
          description: "Employee department",
        },
        {
          name: "_base_salary",
          type: "float",
          visibility: "private",
          description: "Annual base salary",
        },
        {
          name: "_hire_date",
          type: "str",
          visibility: "private",
          description: "Date of hire (YYYY-MM-DD)",
        },
        {
          name: "_benefits_rate",
          type: "float",
          visibility: "private",
          description: "Benefits percentage",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: [
            "employee_id",
            "name",
            "department",
            "base_salary",
            "hire_date",
          ],
          visibility: "public",
          description: "Initialize employee with basic information",
        },
        {
          name: "calculate_monthly_salary",
          returnType: "float",
          parameters: [],
          visibility: "public",
          description: "Calculate monthly salary including benefits",
        },
        {
          name: "get_years_of_service",
          returnType: "int",
          parameters: [],
          visibility: "public",
          description: "Calculate years since hire date",
        },
        {
          name: "apply_raise",
          returnType: "None",
          parameters: ["percentage"],
          visibility: "public",
          description: "Apply percentage raise to base salary",
        },
        {
          name: "get_annual_salary",
          returnType: "float",
          parameters: [],
          visibility: "public",
          description: "Get current annual salary",
        },
        {
          name: "_calculate_benefits",
          returnType: "float",
          parameters: [],
          visibility: "private",
          description: "Calculate monthly benefits amount",
        },
      ],
      allowCustom: true,
      hints: [
        "Store hire_date as string in YYYY-MM-DD format",
        "Monthly salary = (base_salary + benefits) / 12",
        "Use datetime to calculate years of service",
        "Apply raise by multiplying base_salary by (1 + percentage/100)",
      ],
    },
    settings: {
      timeLimit: 1560,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 7,
  },

  {
    title: "Game Character with Stats",
    description:
      "Create a RPG character class with stats, leveling, and abilities",
    activityType: "class_builder",
    category: "Python Fundamentals",
    difficulty: 4,
    diamondReward: 40,
    experienceReward: 85,
    estimatedMinutes: 35,
    tags: ["oop", "gaming", "complex-state", "calculations"],
    content: {
      instructions: "Build a comprehensive GameCharacter class for RPG games",
      className: "GameCharacter",
      language: "Python",
      requiredProperties: [
        { name: "name", type: "str", visibility: "public" },
        { name: "character_class", type: "str", visibility: "public" },
        { name: "_level", type: "int", visibility: "private" },
        { name: "_experience", type: "int", visibility: "private" },
        { name: "_health", type: "int", visibility: "private" },
        { name: "_max_health", type: "int", visibility: "private" },
        { name: "_stats", type: "dict", visibility: "private" },
      ],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["name", "character_class"],
          visibility: "public",
        },
        {
          name: "gain_experience",
          returnType: "bool",
          parameters: ["exp_points"],
          visibility: "public",
        },
        {
          name: "take_damage",
          returnType: "bool",
          parameters: ["damage"],
          visibility: "public",
        },
        {
          name: "heal",
          returnType: "None",
          parameters: ["amount"],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "name",
          type: "str",
          visibility: "public",
          description: "Character name",
        },
        {
          name: "character_class",
          type: "str",
          visibility: "public",
          description: "Character class (Warrior, Mage, etc.)",
        },
        {
          name: "_level",
          type: "int",
          visibility: "private",
          description: "Current character level",
        },
        {
          name: "_experience",
          type: "int",
          visibility: "private",
          description: "Current experience points",
        },
        {
          name: "_health",
          type: "int",
          visibility: "private",
          description: "Current health points",
        },
        {
          name: "_max_health",
          type: "int",
          visibility: "private",
          description: "Maximum health points",
        },
        {
          name: "_stats",
          type: "dict",
          visibility: "private",
          description: "Character stats (strength, magic, etc.)",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["name", "character_class"],
          visibility: "public",
          description: "Initialize character with name and class",
        },
        {
          name: "gain_experience",
          returnType: "bool",
          parameters: ["exp_points"],
          visibility: "public",
          description: "Add experience points and check for level up",
        },
        {
          name: "take_damage",
          returnType: "bool",
          parameters: ["damage"],
          visibility: "public",
          description: "Reduce health by damage amount",
        },
        {
          name: "heal",
          returnType: "None",
          parameters: ["amount"],
          visibility: "public",
          description: "Restore health points",
        },
        {
          name: "is_alive",
          returnType: "bool",
          parameters: [],
          visibility: "public",
          description: "Check if character is still alive",
        },
        {
          name: "get_stats",
          returnType: "dict",
          parameters: [],
          visibility: "public",
          description: "Get character statistics",
        },
        {
          name: "_level_up",
          returnType: "None",
          parameters: [],
          visibility: "private",
          description: "Handle level up progression",
        },
        {
          name: "_initialize_stats",
          returnType: "None",
          parameters: ["character_class"],
          visibility: "private",
          description: "Set initial stats based on class",
        },
      ],
      allowCustom: true,
      hints: [
        "Initialize level=1, experience=0",
        "Set stats based on character class (Warrior=high strength, Mage=high magic)",
        "Level up when experience >= level * 100",
        "Health cannot go below 0 or above max_health",
      ],
    },
    settings: {
      timeLimit: 2100,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 8,
  },

  {
    title: "File Manager Class",
    description:
      "Build a file management class with read, write, and organization features",
    activityType: "class_builder",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 28,
    experienceReward: 62,
    estimatedMinutes: 25,
    tags: ["oop", "file-operations", "data-management", "validation"],
    content: {
      instructions:
        "Build a FileManager class for file operations and organization",
      className: "FileManager",
      language: "Python",
      requiredProperties: [
        { name: "_base_directory", type: "str", visibility: "private" },
        { name: "_file_list", type: "list", visibility: "private" },
        { name: "_file_stats", type: "dict", visibility: "private" },
      ],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["base_directory"],
          visibility: "public",
        },
        {
          name: "add_file",
          returnType: "bool",
          parameters: ["filename", "content"],
          visibility: "public",
        },
        {
          name: "read_file",
          returnType: "str",
          parameters: ["filename"],
          visibility: "public",
        },
        {
          name: "delete_file",
          returnType: "bool",
          parameters: ["filename"],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "_base_directory",
          type: "str",
          visibility: "private",
          description: "Base directory path",
        },
        {
          name: "_file_list",
          type: "list",
          visibility: "private",
          description: "List of managed files",
        },
        {
          name: "_file_stats",
          type: "dict",
          visibility: "private",
          description: "File statistics and metadata",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: ["base_directory"],
          visibility: "public",
          description: "Initialize file manager with base directory",
        },
        {
          name: "add_file",
          returnType: "bool",
          parameters: ["filename", "content"],
          visibility: "public",
          description: "Add new file with content",
        },
        {
          name: "read_file",
          returnType: "str",
          parameters: ["filename"],
          visibility: "public",
          description: "Read file content",
        },
        {
          name: "delete_file",
          returnType: "bool",
          parameters: ["filename"],
          visibility: "public",
          description: "Delete file from management",
        },
        {
          name: "list_files",
          returnType: "list",
          parameters: [],
          visibility: "public",
          description: "Get list of all managed files",
        },
        {
          name: "get_file_info",
          returnType: "dict",
          parameters: ["filename"],
          visibility: "public",
          description: "Get detailed file information",
        },
        {
          name: "_validate_filename",
          returnType: "bool",
          parameters: ["filename"],
          visibility: "private",
          description: "Validate filename format",
        },
        {
          name: "_update_stats",
          returnType: "None",
          parameters: ["filename", "operation"],
          visibility: "private",
          description: "Update file operation statistics",
        },
      ],
      allowCustom: true,
      hints: [
        "Initialize _file_list as empty list, _file_stats as empty dict",
        "Store file stats: {'created': timestamp, 'size': len(content)}",
        "Validate filename before operations",
        "Return False for operations on non-existent files",
      ],
    },
    settings: {
      timeLimit: 1500,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 9,
  },

  {
    title: "Advanced Calculator with History",
    description:
      "Create a scientific calculator class with operation history and memory",
    activityType: "class_builder",
    category: "Python Fundamentals",
    difficulty: 4,
    diamondReward: 45,
    experienceReward: 90,
    estimatedMinutes: 40,
    tags: ["oop", "mathematics", "history-tracking", "advanced-features"],
    content: {
      instructions:
        "Build an advanced Calculator class with history and memory features",
      className: "ScientificCalculator",
      language: "Python",
      requiredProperties: [
        { name: "_current_value", type: "float", visibility: "private" },
        { name: "_memory", type: "float", visibility: "private" },
        { name: "_history", type: "list", visibility: "private" },
        { name: "_last_operation", type: "str", visibility: "private" },
      ],
      requiredMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: [],
          visibility: "public",
        },
        {
          name: "add",
          returnType: "float",
          parameters: ["value"],
          visibility: "public",
        },
        {
          name: "subtract",
          returnType: "float",
          parameters: ["value"],
          visibility: "public",
        },
        {
          name: "multiply",
          returnType: "float",
          parameters: ["value"],
          visibility: "public",
        },
        {
          name: "divide",
          returnType: "float",
          parameters: ["value"],
          visibility: "public",
        },
      ],
      availableProperties: [
        {
          name: "_current_value",
          type: "float",
          visibility: "private",
          description: "Current calculator display value",
        },
        {
          name: "_memory",
          type: "float",
          visibility: "private",
          description: "Memory storage value",
        },
        {
          name: "_history",
          type: "list",
          visibility: "private",
          description: "List of calculation history",
        },
        {
          name: "_last_operation",
          type: "str",
          visibility: "private",
          description: "Last performed operation",
        },
      ],
      availableMethods: [
        {
          name: "__init__",
          returnType: "None",
          parameters: [],
          visibility: "public",
          description: "Initialize calculator with default values",
        },
        {
          name: "add",
          returnType: "float",
          parameters: ["value"],
          visibility: "public",
          description: "Add value to current result",
        },
        {
          name: "subtract",
          returnType: "float",
          parameters: ["value"],
          visibility: "public",
          description: "Subtract value from current result",
        },
        {
          name: "multiply",
          returnType: "float",
          parameters: ["value"],
          visibility: "public",
          description: "Multiply current result by value",
        },
        {
          name: "divide",
          returnType: "float",
          parameters: ["value"],
          visibility: "public",
          description: "Divide current result by value",
        },
        {
          name: "power",
          returnType: "float",
          parameters: ["exponent"],
          visibility: "public",
          description: "Raise current value to power",
        },
        {
          name: "clear",
          returnType: "None",
          parameters: [],
          visibility: "public",
          description: "Clear current value and reset",
        },
        {
          name: "memory_store",
          returnType: "None",
          parameters: [],
          visibility: "public",
          description: "Store current value in memory",
        },
        {
          name: "memory_recall",
          returnType: "float",
          parameters: [],
          visibility: "public",
          description: "Recall value from memory",
        },
        {
          name: "get_history",
          returnType: "list",
          parameters: [],
          visibility: "public",
          description: "Get calculation history",
        },
        {
          name: "_record_operation",
          returnType: "None",
          parameters: ["operation", "value", "result"],
          visibility: "private",
          description: "Record operation in history",
        },
      ],
      allowCustom: true,
      hints: [
        "Initialize all values to 0.0 and empty list for history",
        "Record each operation: {'op': operation, 'value': value, 'result': result}",
        "Handle division by zero gracefully",
        "Update _current_value after each operation",
      ],
    },
    settings: {
      timeLimit: 2400,
      provideSkeleton: true,
      enableDebugging: true,
      showDocstrings: true,
    },
    isActive: true,
    sortOrder: 10,
  },
];

// Export function to seed the activities
export async function seedClassBuilderActivities() {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  try {
    console.log("🏗️ Seeding CLASS_BUILDER activities...");

    for (const activity of classBuilderPythonFundamentalsActivities) {
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
      console.log(`✅ Created: ${activity.title}`);
    }

    console.log(
      `🎉 Successfully seeded ${classBuilderPythonFundamentalsActivities.length} CLASS_BUILDER activities!`
    );
  } catch (error) {
    console.error("❌ Error seeding CLASS_BUILDER activities:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedClassBuilderActivities()
    .then(() => {
      console.log("CLASS_BUILDER activities seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed CLASS_BUILDER activities:", error);
      process.exit(1);
    });
}
