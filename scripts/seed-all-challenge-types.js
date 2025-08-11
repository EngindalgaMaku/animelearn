const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedLearningActivities() {
  console.log("🎮 Seeding all 11 challenge types...");

  const learningActivities = [
    // 1. Algorithm Visualization
    {
      title: "Bubble Sort Algorithm Visualization",
      description:
        "Watch how bubble sort algorithm works step by step with interactive visualization.",
      activityType: "algorithm_visualization",
      difficulty: 3,
      category: "Algorithms",
      sortOrder: 1,
      isLocked: false,
      diamondReward: 25,
      experienceReward: 75,
      estimatedMinutes: 5,
      isActive: true,
      tags: JSON.stringify([
        "sorting",
        "algorithm",
        "visualization",
        "bubble-sort",
      ]),
      content: JSON.stringify({
        algorithmType: "bubble_sort",
        steps: [
          {
            step: 1,
            description: "Compare adjacent elements",
            code: "if arr[i] > arr[i+1]:",
            visualization: "highlight two adjacent elements",
          },
          {
            step: 2,
            description: "Swap if they're in wrong order",
            code: "arr[i], arr[i+1] = arr[i+1], arr[i]",
            visualization: "swap animation",
          },
          {
            step: 3,
            description: "Continue until array is sorted",
            code: "repeat until no swaps needed",
            visualization: "show final sorted array",
          },
        ],
        initialArray: [64, 34, 25, 12, 22, 11, 90],
        complexity: "O(n²)",
        explanation:
          "Bubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
      }),
      settings: JSON.stringify({
        showCode: true,
        showComplexity: true,
        allowSpeedControl: true,
        showComparisons: true,
      }),
    },

    // 2. Matching Challenge
    {
      title: "Python Functions Matching",
      description:
        "Match Python functions with their correct outputs and descriptions.",
      activityType: "matching",
      difficulty: 2,
      category: "Python Basics",
      sortOrder: 2,
      isLocked: false,
      diamondReward: 15,
      experienceReward: 45,
      estimatedMinutes: 3,
      isActive: true,
      tags: JSON.stringify(["python", "functions", "matching", "basics"]),
      content: JSON.stringify({
        leftItems: [
          { id: "len", text: "len('Hello')", type: "function" },
          { id: "max", text: "max([1, 5, 3])", type: "function" },
          { id: "sum", text: "sum([1, 2, 3])", type: "function" },
          { id: "type", text: "type(42)", type: "function" },
          { id: "str", text: "str(123)", type: "function" },
        ],
        rightItems: [
          { id: "len_result", text: "5", type: "result" },
          { id: "max_result", text: "5", type: "result" },
          { id: "sum_result", text: "6", type: "result" },
          { id: "type_result", text: "<class 'int'>", type: "result" },
          { id: "str_result", text: "'123'", type: "result" },
        ],
        correctMatches: [
          { left: "len", right: "len_result" },
          { left: "max", right: "max_result" },
          { left: "sum", right: "sum_result" },
          { left: "type", right: "type_result" },
          { left: "str", right: "str_result" },
        ],
      }),
      settings: JSON.stringify({
        timeLimit: 120,
        showHints: true,
        shuffleItems: true,
      }),
    },

    // 3. Data Explorer
    {
      title: "Student Data Analysis",
      description:
        "Explore and analyze student performance data using interactive tools.",
      activityType: "data_exploration",
      difficulty: 4,
      category: "Data Science",
      sortOrder: 3,
      isLocked: false,
      diamondReward: 35,
      experienceReward: 95,
      estimatedMinutes: 8,
      isActive: true,
      tags: JSON.stringify([
        "data-science",
        "analysis",
        "pandas",
        "visualization",
      ]),
      content: JSON.stringify({
        dataset: {
          name: "Student Performance Data",
          description: "Academic performance data for high school students",
          columns: ["Name", "Math", "Science", "English", "Grade", "Age"],
          data: [
            ["Alice", 85, 92, 78, "A", 16],
            ["Bob", 76, 68, 82, "B", 17],
            ["Charlie", 92, 88, 95, "A", 16],
            ["Diana", 68, 75, 70, "C", 17],
            ["Eve", 88, 90, 85, "A", 16],
          ],
        },
        tasks: [
          {
            id: "basic_stats",
            title: "Calculate Basic Statistics",
            description: "Find the mean, median, and mode of Math scores",
            expectedAnswer: "Mean: 81.8, Median: 85",
          },
          {
            id: "filter_data",
            title: "Filter High Performers",
            description: "Find students with Math scores > 80",
            expectedAnswer: ["Alice", "Charlie", "Eve"],
          },
          {
            id: "visualization",
            title: "Create Visualization",
            description: "Create a bar chart of average scores by subject",
            expectedAnswer:
              "Bar chart showing Math: 81.8, Science: 82.6, English: 82",
          },
        ],
      }),
      settings: JSON.stringify({
        allowPythonCode: true,
        showDataPreview: true,
        enableVisualization: true,
      }),
    },

    // 4. Interactive Demo
    {
      title: "Python Variables Introduction",
      description:
        "Interactive introduction to Python variables and data types.",
      activityType: "interactive_demo",
      difficulty: 1,
      category: "Python Basics",
      sortOrder: 4,
      isLocked: false,
      diamondReward: 10,
      experienceReward: 25,
      estimatedMinutes: 4,
      isActive: true,
      tags: JSON.stringify(["python", "variables", "basics", "introduction"]),
      content: JSON.stringify({
        slides: [
          {
            id: "intro",
            title: "What are Variables?",
            content:
              "Variables are containers that store data values. In Python, you don't need to declare variable types.",
            example: "name = 'Alice'\nage = 25\nheight = 5.7",
            interactive: {
              type: "code_runner",
              code: "name = 'Alice'\nprint(f'Hello, {name}!')",
            },
          },
          {
            id: "types",
            title: "Data Types",
            content:
              "Python has several built-in data types: strings, integers, floats, and booleans.",
            example:
              "text = 'Hello'     # String\nnumber = 42       # Integer\nprice = 19.99     # Float\nis_student = True # Boolean",
            interactive: {
              type: "type_checker",
              variables: ["text", "number", "price", "is_student"],
            },
          },
          {
            id: "operations",
            title: "Variable Operations",
            content:
              "You can perform operations on variables and update their values.",
            example: "x = 10\ny = 5\nresult = x + y\nprint(result)  # 15",
            interactive: {
              type: "calculator",
              operations: ["+", "-", "*", "/"],
            },
          },
        ],
      }),
      settings: JSON.stringify({
        autoProgress: false,
        showNavigation: true,
        enableInteraction: true,
      }),
    },

    // 5. Drag & Drop
    {
      title: "Build a Python Function",
      description:
        "Drag and drop code blocks to create a working Python function.",
      activityType: "drag_drop",
      difficulty: 2,
      category: "Functions & OOP",
      sortOrder: 5,
      isLocked: false,
      diamondReward: 20,
      experienceReward: 55,
      estimatedMinutes: 4,
      isActive: true,
      tags: JSON.stringify(["python", "functions", "drag-drop", "coding"]),
      content: JSON.stringify({
        targetFunction:
          "def calculate_average(numbers):\n    total = sum(numbers)\n    count = len(numbers)\n    if count > 0:\n        return total / count\n    else:\n        return 0",
        codeBlocks: [
          {
            id: "def",
            text: "def calculate_average(numbers):",
            type: "function_def",
            order: 1,
          },
          {
            id: "total",
            text: "    total = sum(numbers)",
            type: "calculation",
            order: 2,
          },
          {
            id: "count",
            text: "    count = len(numbers)",
            type: "calculation",
            order: 3,
          },
          { id: "if", text: "    if count > 0:", type: "condition", order: 4 },
          {
            id: "return1",
            text: "        return total / count",
            type: "return",
            order: 5,
          },
          { id: "else", text: "    else:", type: "condition", order: 6 },
          { id: "return2", text: "        return 0", type: "return", order: 7 },
        ],
        distractors: [
          {
            id: "wrong1",
            text: "    total = numbers.sum()",
            type: "calculation",
          },
          { id: "wrong2", text: "    return total * count", type: "return" },
          { id: "wrong3", text: "    if count == 0:", type: "condition" },
        ],
      }),
      settings: JSON.stringify({
        showHints: true,
        validateSyntax: true,
        allowReordering: true,
      }),
    },

    // 6. Fill Blanks
    {
      title: "Complete the For Loop",
      description: "Fill in the missing parts to create a working for loop.",
      activityType: "fill_blanks",
      difficulty: 2,
      category: "Python Basics",
      sortOrder: 6,
      isLocked: false,
      diamondReward: 15,
      experienceReward: 40,
      estimatedMinutes: 3,
      isActive: true,
      tags: JSON.stringify(["python", "loops", "for-loop", "fill-blanks"]),
      content: JSON.stringify({
        codeTemplate:
          "numbers = [1, 2, 3, 4, 5]\ntotal = 0\n\n___ number ___ numbers:\n    total ___ number\n\nprint(f'Total: {___}')",
        blanks: [
          {
            id: "blank1",
            position: 1,
            answer: "for",
            options: ["for", "while", "if", "def"],
            hint: "This keyword is used to iterate over a sequence",
          },
          {
            id: "blank2",
            position: 2,
            answer: "in",
            options: ["in", "of", "on", "at"],
            hint: "This keyword connects the variable to the sequence",
          },
          {
            id: "blank3",
            position: 3,
            answer: "+=",
            options: ["+=", "=", "-=", "*="],
            hint: "This operator adds the value to the existing total",
          },
          {
            id: "blank4",
            position: 4,
            answer: "total",
            options: ["total", "number", "numbers", "sum"],
            hint: "Which variable contains our final result?",
          },
        ],
        expectedOutput: "Total: 15",
      }),
      settings: JSON.stringify({
        showHints: true,
        caseSensitive: false,
        allowMultipleAttempts: true,
      }),
    },

    // 7. Code Lab
    {
      title: "Build a Number Guessing Game",
      description:
        "Write Python code to create an interactive number guessing game.",
      activityType: "interactive_coding",
      difficulty: 3,
      category: "Python Basics",
      sortOrder: 7,
      isLocked: false,
      diamondReward: 30,
      experienceReward: 85,
      estimatedMinutes: 10,
      isActive: true,
      tags: JSON.stringify(["python", "coding", "game", "loops", "conditions"]),
      content: JSON.stringify({
        taskDescription:
          "Create a number guessing game where the computer picks a random number and the user tries to guess it.",
        requirements: [
          "Import the random module",
          "Generate a random number between 1 and 100",
          "Ask the user to guess the number",
          "Provide 'too high' or 'too low' feedback",
          "Count the number of attempts",
          "Congratulate when correct",
        ],
        starterCode: "import random\n\n# Your code here\n",
        solution: `import random

secret_number = random.randint(1, 100)
attempts = 0
guessed = False

print("Welcome to the Number Guessing Game!")
print("I'm thinking of a number between 1 and 100.")

while not guessed:
    try:
        guess = int(input("Enter your guess: "))
        attempts += 1
        
        if guess == secret_number:
            print(f"Congratulations! You guessed it in {attempts} attempts!")
            guessed = True
        elif guess < secret_number:
            print("Too low! Try again.")
        else:
            print("Too high! Try again.")
    except ValueError:
        print("Please enter a valid number!")

print("Thanks for playing!")`,
        testCases: [
          {
            description: "Game should handle correct guess",
            expectedOutput: "Congratulations",
          },
          {
            description: "Game should provide feedback for wrong guesses",
            expectedOutput: "Too high|Too low",
          },
        ],
      }),
      settings: JSON.stringify({
        enableConsole: true,
        allowInput: true,
        showTests: true,
        timeLimit: 600,
      }),
    },

    // 8. Code Builder
    {
      title: "Build a Student Grade Calculator",
      description:
        "Construct a complete program to calculate student grades using modular components.",
      activityType: "code_builder",
      difficulty: 4,
      category: "Functions & OOP",
      sortOrder: 8,
      isLocked: false,
      diamondReward: 40,
      experienceReward: 105,
      estimatedMinutes: 12,
      isActive: true,
      tags: JSON.stringify([
        "python",
        "functions",
        "modules",
        "grade-calculator",
      ]),
      content: JSON.stringify({
        projectDescription:
          "Build a modular grade calculator system with multiple components.",
        components: [
          {
            id: "input_module",
            name: "Input Module",
            description: "Handle user input for student grades",
            template:
              "def get_student_grades():\n    # Get grades from user\n    pass",
            requirements: [
              "Function should ask for student name",
              "Function should collect multiple test scores",
              "Return a dictionary with student data",
            ],
          },
          {
            id: "calculation_module",
            name: "Calculation Module",
            description: "Calculate average and letter grade",
            template:
              "def calculate_grade(scores):\n    # Calculate average and letter grade\n    pass",
            requirements: [
              "Calculate average of all scores",
              "Determine letter grade (A: 90+, B: 80-89, C: 70-79, D: 60-69, F: <60)",
              "Return both average and letter grade",
            ],
          },
          {
            id: "output_module",
            name: "Output Module",
            description: "Display results in a formatted way",
            template:
              "def display_results(student_data, average, letter_grade):\n    # Display formatted results\n    pass",
            requirements: [
              "Display student name",
              "Show all individual scores",
              "Display calculated average",
              "Show final letter grade",
            ],
          },
          {
            id: "main_module",
            name: "Main Program",
            description: "Orchestrate all components",
            template: "def main():\n    # Main program logic\n    pass",
            requirements: [
              "Call input module to get data",
              "Use calculation module to process grades",
              "Use output module to display results",
              "Handle multiple students",
            ],
          },
        ],
        integrationTests: [
          {
            description: "Program should handle single student",
            input: "Alice, scores: [85, 90, 78]",
            expectedOutput: "Average: 84.33, Grade: B",
          },
        ],
      }),
      settings: JSON.stringify({
        allowTesting: true,
        showStructure: true,
        enableDebugging: true,
      }),
    },

    // 9. Class Builder
    {
      title: "Design a Student Management System",
      description:
        "Create classes and inheritance hierarchy for a student management system.",
      activityType: "class_builder",
      difficulty: 5,
      category: "Functions & OOP",
      sortOrder: 9,
      isLocked: false,
      diamondReward: 50,
      experienceReward: 125,
      estimatedMinutes: 15,
      isActive: true,
      tags: JSON.stringify([
        "python",
        "oop",
        "classes",
        "inheritance",
        "design",
      ]),
      content: JSON.stringify({
        projectDescription:
          "Design an object-oriented student management system with proper inheritance.",
        classStructure: {
          baseClass: {
            name: "Person",
            description: "Base class for all people in the system",
            attributes: ["name", "age", "email"],
            methods: ["__init__", "get_info", "update_email"],
            abstractMethods: [],
          },
          derivedClasses: [
            {
              name: "Student",
              parent: "Person",
              description: "Represents a student with grades and courses",
              additionalAttributes: ["student_id", "grades", "courses"],
              additionalMethods: [
                "add_grade",
                "calculate_gpa",
                "enroll_course",
              ],
              requirements: [
                "Must inherit from Person",
                "Override get_info to include student-specific data",
                "Implement grade tracking functionality",
              ],
            },
            {
              name: "Teacher",
              parent: "Person",
              description: "Represents a teacher with subjects and students",
              additionalAttributes: ["teacher_id", "subjects", "students"],
              additionalMethods: [
                "add_subject",
                "assign_grade",
                "get_student_list",
              ],
              requirements: [
                "Must inherit from Person",
                "Override get_info to include teacher-specific data",
                "Implement student management functionality",
              ],
            },
          ],
        },
        designPatterns: [
          {
            name: "Encapsulation",
            description: "Use private attributes with getter/setter methods",
          },
          {
            name: "Inheritance",
            description: "Proper parent-child relationships",
          },
          {
            name: "Polymorphism",
            description: "Override methods appropriately",
          },
        ],
        testScenarios: [
          {
            description: "Create student and add grades",
            code: "student = Student('Alice', 20, 'alice@email.com', 'S001')\nstudent.add_grade('Math', 85)\nprint(student.calculate_gpa())",
          },
        ],
      }),
      settings: JSON.stringify({
        showUMLDiagram: true,
        validateDesign: true,
        enableTesting: true,
      }),
    },

    // 10. Memory Game
    {
      title: "Python Syntax Memory Challenge",
      description: "Memorize and recall Python syntax patterns and keywords.",
      activityType: "memory_game",
      difficulty: 2,
      category: "Python Basics",
      sortOrder: 10,
      isLocked: false,
      diamondReward: 18,
      experienceReward: 50,
      estimatedMinutes: 5,
      isActive: true,
      tags: JSON.stringify(["python", "memory", "syntax", "keywords"]),
      content: JSON.stringify({
        gameType: "pattern_matching",
        cards: [
          {
            id: "for_keyword",
            type: "keyword",
            value: "for",
            pair: "for_usage",
          },
          {
            id: "for_usage",
            type: "usage",
            value: "for i in range(10):",
            pair: "for_keyword",
          },
          { id: "if_keyword", type: "keyword", value: "if", pair: "if_usage" },
          {
            id: "if_usage",
            type: "usage",
            value: "if x > 0:",
            pair: "if_keyword",
          },
          {
            id: "def_keyword",
            type: "keyword",
            value: "def",
            pair: "def_usage",
          },
          {
            id: "def_usage",
            type: "usage",
            value: "def my_function():",
            pair: "def_keyword",
          },
          {
            id: "class_keyword",
            type: "keyword",
            value: "class",
            pair: "class_usage",
          },
          {
            id: "class_usage",
            type: "usage",
            value: "class MyClass:",
            pair: "class_keyword",
          },
          {
            id: "import_keyword",
            type: "keyword",
            value: "import",
            pair: "import_usage",
          },
          {
            id: "import_usage",
            type: "usage",
            value: "import random",
            pair: "import_keyword",
          },
          {
            id: "try_keyword",
            type: "keyword",
            value: "try",
            pair: "try_usage",
          },
          {
            id: "try_usage",
            type: "usage",
            value: "try:\n    # code",
            pair: "try_keyword",
          },
        ],
        levels: [
          { level: 1, pairs: 3, timeLimit: 60 },
          { level: 2, pairs: 4, timeLimit: 80 },
          { level: 3, pairs: 6, timeLimit: 120 },
        ],
      }),
      settings: JSON.stringify({
        shuffleCards: true,
        showTimer: true,
        allowRetry: true,
      }),
    },

    // 11. Quiz
    {
      title: "Python Fundamentals Quiz",
      description:
        "Test your knowledge of Python basics with multiple choice questions.",
      activityType: "quiz",
      difficulty: 2,
      category: "Python Basics",
      sortOrder: 11,
      isLocked: false,
      diamondReward: 20,
      experienceReward: 60,
      estimatedMinutes: 6,
      isActive: true,
      tags: JSON.stringify(["python", "quiz", "fundamentals", "assessment"]),
      content: JSON.stringify({
        questions: [
          {
            id: "q1",
            type: "multiple_choice",
            question:
              "Which of the following is the correct way to create a list in Python?",
            options: [
              "list = (1, 2, 3)",
              "list = [1, 2, 3]",
              "list = {1, 2, 3}",
              "list = <1, 2, 3>",
            ],
            correctAnswer: 1,
            explanation:
              "Square brackets [] are used to create lists in Python. Parentheses () create tuples, and curly braces {} create sets or dictionaries.",
          },
          {
            id: "q2",
            type: "multiple_choice",
            question: "What will be the output of: print(type(5.0))?",
            options: [
              "<class 'int'>",
              "<class 'float'>",
              "<class 'str'>",
              "<class 'number'>",
            ],
            correctAnswer: 1,
            explanation:
              "5.0 is a floating-point number, so its type is 'float'.",
          },
          {
            id: "q3",
            type: "multiple_choice",
            question: "Which keyword is used to define a function in Python?",
            options: ["function", "def", "func", "define"],
            correctAnswer: 1,
            explanation:
              "The 'def' keyword is used to define functions in Python.",
          },
          {
            id: "q4",
            type: "code_output",
            question:
              "What is the output of the following code?\n\nx = 10\ny = 3\nprint(x // y)",
            options: ["3.33", "3", "4", "Error"],
            correctAnswer: 1,
            explanation:
              "The // operator performs floor division, which returns the largest integer less than or equal to the result. 10 // 3 = 3.",
          },
          {
            id: "q5",
            type: "multiple_choice",
            question: "Which of the following is NOT a Python data type?",
            options: ["list", "tuple", "array", "dictionary"],
            correctAnswer: 2,
            explanation:
              "While Python has list, tuple, and dictionary as built-in data types, 'array' is not a built-in type (though arrays can be created using the array module or NumPy).",
          },
        ],
        timeLimit: 300,
        passingScore: 60,
        showExplanations: true,
      }),
      settings: JSON.stringify({
        randomizeQuestions: true,
        randomizeOptions: true,
        allowReview: true,
        showProgress: true,
      }),
    },
  ];

  try {
    for (const activity of learningActivities) {
      await prisma.learningActivity.upsert({
        where: {
          title_activityType: {
            title: activity.title,
            activityType: activity.activityType,
          },
        },
        update: activity,
        create: activity,
      });
      console.log(
        `✅ Created/Updated: ${activity.title} (${activity.activityType})`
      );
    }

    console.log(
      `\n🎉 Successfully seeded ${learningActivities.length} learning activities!`
    );
    console.log("\n📊 Challenge Types Summary:");
    console.log("🔄 Algorithm Visualization: 1 activity");
    console.log("🔗 Matching: 1 activity");
    console.log("🔍 Data Explorer: 1 activity");
    console.log("🎪 Demo: 1 activity");
    console.log("🎯 Drag & Drop: 1 activity");
    console.log("✏️ Fill Blanks: 1 activity");
    console.log("💻 Code Lab: 1 activity");
    console.log("🏗️ Code Builder: 1 activity");
    console.log("🏛️ Class Builder: 1 activity");
    console.log("🧠 Memory Game: 1 activity");
    console.log("❓ Quiz: 1 activity");
    console.log("\n🎮 All challenge types are now available in Code Arena V2!");
    console.log("👑 Check the admin panel to manage these activities.");
  } catch (error) {
    console.error("❌ Error seeding learning activities:", error);
    throw error;
  }
}

async function main() {
  try {
    console.log("🚀 Starting challenge types seeding...\n");
    await seedLearningActivities();
    console.log("\n✅ All challenge types seeded successfully!");
  } catch (error) {
    console.error("❌ Error in main function:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
