# Activity Structures Guide

Bu dosya 11 farklı aktivite türünün detaylı yapılarını ve örneklerini içerir.

## 1. DRAG_DROP Activities

Kullanıcıların öğeleri sürükleyip doğru kategorilere bıraktığı aktiviteler.

```typescript
{
  title: "Python Variables & Data Types Explorer",
  description: "Interactive exploration of Python's fundamental data types",
  activityType: "drag_drop",
  category: "python_fundamentals",
  difficulty: 1,
  diamondReward: 10,
  experienceReward: 25,
  estimatedMinutes: 8,
  tags: ["variables", "data-types", "python"],
  content: {
    instructions: "Drag each value to its correct data type category",
    items: [
      { id: 1, value: "42", type: "int" },
      { id: 2, value: "3.14", type: "float" },
      { id: 3, value: "'Hello World'", type: "str" }
    ],
    categories: [
      { id: "int", name: "Integer", description: "Whole numbers" },
      { id: "float", name: "Float", description: "Decimal numbers" },
      { id: "str", name: "String", description: "Text data" }
    ]
  },
  settings: {
    timeLimit: 300,
    maxAttempts: 3,
    showHints: true,
    shuffleItems: true
  }
}
```

## 2. MEMORY_GAME Activities

Kartları eşleştirme temelli hafıza oyunları.

```typescript
{
  title: "Python Print Statement Basics",
  description: "Match Python print statements with their outputs",
  activityType: "memory_game",
  category: "python_fundamentals",
  difficulty: 1,
  diamondReward: 12,
  experienceReward: 30,
  estimatedMinutes: 10,
  tags: ["print", "output", "basic-syntax"],
  content: {
    instructions: "Match the Python print statements with their outputs",
    pairs: [
      { id: 1, card1: "print('Hello World')", card2: "Hello World" },
      { id: 2, card1: "print(2 + 3)", card2: "5" },
      { id: 3, card1: "print('Age:', 25)", card2: "Age: 25" }
    ],
    timeLimit: 240,
    shuffleCards: true
  },
  settings: {
    maxFlips: 25,
    showTimer: true
  }
}
```

## 3. QUIZ Activities

Çoktan seçmeli sorular içeren klasik testler.

```typescript
{
  title: "Basic Python Operators Quiz",
  description: "Test your knowledge of Python arithmetic operators",
  activityType: "quiz",
  category: "python_fundamentals",
  difficulty: 1,
  diamondReward: 15,
  experienceReward: 35,
  estimatedMinutes: 12,
  tags: ["operators", "arithmetic", "quiz"],
  content: {
    instructions: "Answer questions about Python operators",
    questions: [
      {
        id: 1,
        question: "What is the result of 7 // 2 in Python?",
        options: ["3.5", "3", "4", "Error"],
        correct: 1,
        explanation: "The // operator performs floor division, returning the integer part."
      },
      {
        id: 2,
        question: "What does the ** operator do in Python?",
        options: ["Multiplication", "Exponentiation", "Division", "Modulus"],
        correct: 1,
        explanation: "The ** operator is used for exponentiation (power operation)."
      }
    ],
    timeLimit: 360,
    randomizeQuestions: true,
    showExplanations: true
  },
  settings: {}
}
```

## 4. FILL_BLANKS Activities

Kullanıcıların kod boşluklarını doldurduğu alıştırmalar.

```typescript
{
  title: "Python Input and Variables Workshop",
  description: "Learn to work with user input and variable assignment",
  activityType: "fill_blanks",
  category: "python_fundamentals",
  difficulty: 1,
  diamondReward: 18,
  experienceReward: 40,
  estimatedMinutes: 15,
  tags: ["input", "variables", "assignment"],
  content: {
    instructions: "Fill in the missing code to handle user input and variables",
    exercises: [
      {
        id: 1,
        description: "Get user input and store in a variable",
        template: "name = ____('Enter your name: ')\nprint('Hello,', name)",
        blanks: [{ id: "blank1", answer: "input", position: 0 }],
        expectedOutput: "Hello, [user_input]"
      },
      {
        id: 2,
        description: "Convert string input to integer",
        template: "age_str = input('Enter age: ')\nage = ____(age_str)\nprint('Age:', age)",
        blanks: [{ id: "blank2", answer: "int", position: 0 }],
        expectedOutput: "Age: [number]"
      }
    ]
  },
  settings: {
    timeLimit: 600,
    allowHints: true,
    caseSensitive: false
  }
}
```

## 5. INTERACTIVE_CODING Activities

Gerçek kod yazma ve test etme ortamı sağlayan aktiviteler.

```typescript
{
  title: "String Methods Master Class",
  description: "Explore Python string methods and text manipulation",
  activityType: "interactive_coding",
  category: "python_fundamentals",
  difficulty: 2,
  diamondReward: 20,
  experienceReward: 45,
  estimatedMinutes: 18,
  tags: ["strings", "methods", "text-processing"],
  content: {
    instructions: "Complete string manipulation challenges",
    problem: "Create a text processor that cleans and formats user input",
    starterCode: "# String processing functions\ntext = '  Hello World  '\n\n# Your code here\nprocessed = text\nprint(processed)",
    solution: "text = '  Hello World  '\nprocessed = text.strip().lower().replace(' ', '_')\nprint(processed)  # hello_world",
    testCases: [
      { input: "  Hello World  ", expectedOutput: "hello_world" },
      { input: "  Python Programming  ", expectedOutput: "python_programming" }
    ],
    language: "Python",
    hints: [
      "Use strip() to remove whitespace",
      "Use lower() to convert to lowercase",
      "Use replace() to substitute characters"
    ]
  },
  settings: {
    timeLimit: 900,
    enableCodeCompletion: true,
    showTestCases: true
  }
}
```

## 6. MATCHING Activities

İki liste arasında eşleştirme yapılan aktiviteler.

```typescript
{
  title: "Python Control Flow Patterns",
  description: "Match code patterns with their descriptions",
  activityType: "matching",
  category: "python_fundamentals",
  difficulty: 2,
  diamondReward: 22,
  experienceReward: 50,
  estimatedMinutes: 16,
  tags: ["control-flow", "if-else", "loops"],
  content: {
    instructions: "Match each code pattern with its correct description",
    pairs: [
      {
        id: "1",
        left: "if x > 0:\n    print('Positive')\nelif x < 0:\n    print('Negative')\nelse:\n    print('Zero')",
        right: "Number Classification",
        explanation: "This pattern classifies numbers as positive, negative, or zero"
      },
      {
        id: "2",
        left: "for i in range(5):\n    if i == 2:\n        continue\n    print(i)",
        right: "0 1 3 4",
        explanation: "Continue skips iteration when i equals 2"
      }
    ],
    allowShuffle: true,
    showProgress: true
  },
  settings: {
    showExplanations: true,
    allowMultipleAttempts: true,
    timeLimit: 600
  }
}
```

## 7. CODE_BUILDER Activities

Kod bloklarını doğru sırayla dizme aktiviteleri.

```typescript
{
  title: "List Operations and Methods",
  description: "Build a complete list processing function",
  activityType: "code_builder",
  category: "python_fundamentals",
  difficulty: 2,
  diamondReward: 25,
  experienceReward: 55,
  estimatedMinutes: 20,
  tags: ["lists", "methods", "data-structures"],
  content: {
    instructions: "Build a complete list processing function",
    targetOutput: "Processed list with various operations",
    availableBlocks: [
      {
        id: "def_process",
        code: "def process_list(numbers):",
        type: "function",
        description: "Function definition for list processor"
      },
      {
        id: "remove_neg",
        code: "positive_nums = [x for x in numbers if x > 0]",
        type: "filter",
        description: "Filter out negative numbers"
      },
      {
        id: "sort_list",
        code: "positive_nums.sort()",
        type: "operation",
        description: "Sort the list in ascending order"
      },
      {
        id: "return_result",
        code: "return squared[:3]",
        type: "return",
        description: "Return first 3 elements"
      }
    ],
    language: "Python",
    solution: [
      "def process_list(numbers):",
      "    positive_nums = [x for x in numbers if x > 0]",
      "    positive_nums.sort()",
      "    return squared[:3]"
    ]
  },
  settings: {
    timeLimit: 800,
    codeTemplate: "def process_list(numbers):\n    # Your code here\n    pass",
    runTests: true,
    showOutput: true
  }
}
```

## 8. INTERACTIVE_DEMO Activities

Adım adım etkileşimli öğretim aktiviteleri.

```typescript
{
  title: "Dictionary Operations Deep Dive",
  description: "Learn advanced dictionary operations with interactive examples",
  activityType: "interactive_demo",
  category: "python_fundamentals",
  difficulty: 2,
  diamondReward: 28,
  experienceReward: 60,
  estimatedMinutes: 22,
  tags: ["dictionaries", "key-value", "methods"],
  content: {
    title: "Python Dictionary Mastery",
    description: "Learn advanced dictionary operations with interactive examples",
    steps: [
      {
        id: 1,
        title: "Dictionary Creation and Access",
        description: "Learn multiple ways to create and access dictionary data",
        code: "student = {'name': 'Alice', 'age': 20, 'grade': 'A'}\nprint(student['name'])",
        explanation: "Dictionaries store key-value pairs. Use square brackets for access.",
        interactive: true,
        questions: [
          {
            question: "What's the safe way to access a dictionary key?",
            options: ["dict[key]", "dict.get(key)", "dict.key", "dict(key)"],
            correct: 1
          }
        ]
      },
      {
        id: 2,
        title: "Dictionary Methods",
        description: "Explore useful dictionary methods",
        code: "data = {'a': 1, 'b': 2, 'c': 3}\nkeys = list(data.keys())",
        explanation: "Use keys(), values(), and items() methods.",
        interactive: true
      }
    ],
    timeLimit: 900,
    language: "Python"
  },
  settings: {
    livePreview: true,
    showResults: true,
    allowHints: true
  }
}
```

## 9. ALGORITHM_VISUALIZATION Activities

Algoritmaları görsel olarak anlatan aktiviteler.

```typescript
{
  title: "List Comprehensions and Generators",
  description: "Visualize memory usage and performance differences",
  activityType: "algorithm_visualization",
  category: "python_fundamentals",
  difficulty: 3,
  diamondReward: 30,
  experienceReward: 65,
  estimatedMinutes: 20,
  tags: ["comprehensions", "generators", "memory-efficiency"],
  content: {
    algorithm: "list_comprehension_vs_generator",
    description: "Compare memory usage of different iteration methods",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n) vs O(1)",
    explanation: "List comprehensions create entire lists in memory, generators produce items on-demand.",
    initialData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    steps: [
      {
        id: 1,
        description: "Traditional for loop approach",
        data: [],
        highlights: [],
        comparison: [],
        action: "result = []\nfor x in data:\n    if x % 2 == 0:\n        result.append(x**2)"
      },
      {
        id: 2,
        description: "List comprehension - creates full list",
        data: [4, 16, 36, 64, 100],
        highlights: [0, 1, 2, 3, 4],
        comparison: [],
        action: "result = [x**2 for x in data if x % 2 == 0]"
      }
    ],
    visualizations: [
      {
        operation: "List Comprehension",
        setA: ["Memory:", "All items", "stored"],
        setB: ["Speed:", "Fast access", "to all"],
        result: ["Use for:", "Small datasets", "multiple access"],
        code: "squares = [x**2 for x in range(1000) if x % 2 == 0]",
        explanation: "Creates entire list immediately, using more memory.",
        visual: "memory_usage"
      }
    ],
    code: "# Comparing approaches\ndata = range(1, 11)\n\n# List comprehension\nlist_comp = [x**2 for x in data if x % 2 == 0]"
  },
  settings: {
    animationSpeed: "medium",
    showComplexity: true,
    allowStepByStep: true
  }
}
```

## 10. CLASS_BUILDER Activities

Sınıf oluşturma ve OOP kavramları öğretim aktiviteleri.

```typescript
{
  title: "Object-Oriented Programming Basics",
  description: "Build a complete class with proper encapsulation",
  activityType: "class_builder",
  category: "python_fundamentals",
  difficulty: 3,
  diamondReward: 40,
  experienceReward: 80,
  estimatedMinutes: 30,
  tags: ["oop", "classes", "objects", "inheritance"],
  content: {
    instructions: "Build a complete class representing a bank account",
    className: "BankAccount",
    language: "Python",
    requiredProperties: [
      { name: "account_number", type: "str", visibility: "public" },
      { name: "owner_name", type: "str", visibility: "public" },
      { name: "_balance", type: "float", visibility: "private" }
    ],
    requiredMethods: [
      {
        name: "__init__",
        returnType: "None",
        parameters: ["account_number", "owner_name", "initial_balance"],
        visibility: "public"
      },
      {
        name: "deposit",
        returnType: "bool",
        parameters: ["amount"],
        visibility: "public"
      },
      {
        name: "get_balance",
        returnType: "float",
        parameters: [],
        visibility: "public"
      }
    ],
    availableProperties: [
      {
        name: "account_number",
        type: "str",
        visibility: "public",
        description: "Unique account identifier"
      },
      {
        name: "_balance",
        type: "float",
        visibility: "private",
        description: "Current account balance"
      }
    ],
    availableMethods: [
      {
        name: "__init__",
        returnType: "None",
        parameters: ["account_number", "owner_name", "initial_balance"],
        visibility: "public",
        description: "Initialize bank account"
      },
      {
        name: "deposit",
        returnType: "bool",
        parameters: ["amount"],
        visibility: "public",
        description: "Add money to account"
      }
    ],
    allowCustom: true,
    hints: [
      "Use __init__ to initialize object state",
      "Make sensitive data private with underscore prefix",
      "Validate inputs in methods"
    ]
  },
  settings: {
    timeLimit: 1800,
    provideSkeleton: true,
    enableDebugging: true,
    showDocstrings: true
  }
}
```

## 11. DATA_EXPLORATION Activities

Veri analizi ve keşif temelli aktiviteler.

```typescript
{
  title: "Advanced Data Structures and Collections",
  description: "Analyze data using Python's advanced collection types",
  activityType: "data_exploration",
  category: "python_fundamentals",
  difficulty: 4,
  diamondReward: 38,
  experienceReward: 85,
  estimatedMinutes: 28,
  tags: ["data-structures", "collections", "sets"],
  content: {
    title: "Advanced Collections Analysis",
    instructions: "Analyze and manipulate data using Python's advanced collection types",
    dataset: [
      {
        id: "1",
        name: "Alice",
        skills: ["Python", "JavaScript", "SQL"],
        level: "Senior"
      },
      {
        id: "2",
        name: "Bob",
        skills: ["Java", "Python", "Docker"],
        level: "Mid"
      },
      {
        id: "3",
        name: "Charlie",
        skills: ["Python", "React", "Node.js"],
        level: "Senior"
      }
    ],
    questions: [
      {
        id: "q1",
        question: "Find all unique skills across all developers using set operations",
        type: "analyze",
        answer: "{'Python', 'JavaScript', 'SQL', 'Java', 'Docker', 'React', 'Node.js'}",
        hint: "Use set union or set comprehension to combine all skill lists"
      },
      {
        id: "q2",
        question: "Which skills are common to at least 2 developers?",
        type: "filter",
        answer: "{'Python'}",
        hint: "Count skill occurrences and filter by frequency"
      },
      {
        id: "q3",
        question: "Create a Counter to show skill frequency distribution",
        type: "calculate",
        answer: "Counter({'Python': 3, 'JavaScript': 1, 'SQL': 1, 'Java': 1, 'Docker': 1, 'React': 1, 'Node.js': 1})",
        hint: "Use collections.Counter to count skill occurrences"
      }
    ],
    allowExport: true
  },
  settings: {
    timeLimit: 1400,
    allowCalculator: true,
    showDataPreview: true,
    providePseudocode: true
  }
}
```

---

## Kullanım Örnekleri

### Yeni Aktivite Oluşturma:

1. **Aktivite türünü seçin** (yukarıdaki 11 türden birini)
2. **İlgili yapıyı kopyalayın**
3. **İçeriği kendi konunuza göre düzenleyin**
4. **Seed dosyasına ekleyin**

### Zorluk Seviyeleri:

- **1**: Beginner (Yeni başlayanlar)
- **2**: Basic (Temel seviye)
- **3**: Intermediate (Orta seviye)
- **4**: Advanced (İleri seviye)
- **5**: Expert (Uzman seviye)

### Ödül Önerileri:

- **Diamond Reward**: Zorluk \* 10 (örn: seviye 3 = 30 diamonds)
- **Experience Reward**: Zorluk \* 20 (örn: seviye 3 = 60 XP)
- **Estimated Minutes**: Aktivite karmaşıklığına göre 5-40 dakika

Bu yapıları kullanarak Python fundamentals için aktivitelerinizi oluşturabilirsiniz!
