const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function fixContentStructures() {
  console.log("🔧 Fixing Code Arena content structures...");

  try {
    // Get all Python Fundamentals activities
    const activities = await prisma.codeArena.findMany({
      where: { category: "Python Fundamentals" },
    });

    console.log(`Found ${activities.length} activities to fix`);

    for (const activity of activities) {
      let newContent;
      let activityType;

      if (activity.title.includes("Quiz")) {
        activityType = "quiz";
        newContent = JSON.stringify({
          questions: [
            {
              question:
                "Which is the correct way to create a string in Python?",
              options: [
                '"Hello World"',
                "'Hello World'",
                "Both A and B",
                "<Hello World>",
              ],
              correct: 2,
              explanation:
                "Both single and double quotes create strings in Python.",
            },
            {
              question: "What data type is the result of 5/2 in Python 3?",
              options: ["int", "float", "string", "boolean"],
              correct: 1,
              explanation: "Division always returns a float in Python 3.",
            },
            {
              question: "Which of these is a mutable data type?",
              options: ["string", "tuple", "list", "int"],
              correct: 2,
              explanation:
                "Lists are mutable, meaning they can be changed after creation.",
            },
          ],
          passingScore: 70,
          timeLimit: 480,
        });
      } else if (
        activity.title.includes("Drag") ||
        activity.title.includes("drag")
      ) {
        activityType = "drag_drop";
        newContent = JSON.stringify({
          target: "Drag each Python value to its correct data type category",
          blocks: [
            { id: 1, code: "42", type: "integer" },
            { id: 2, code: "3.14", type: "float" },
            { id: 3, code: '"Hello"', type: "string" },
            { id: 4, code: "True", type: "boolean" },
            { id: 5, code: "[1, 2, 3]", type: "list" },
            { id: 6, code: "{'key': 'value'}", type: "dictionary" },
          ],
          correctOrder: [1, 2, 3, 4, 5, 6],
          hints: [
            "Integers are whole numbers without decimal points",
            "Floats have decimal points like 3.14",
            "Strings are enclosed in quotes",
            "Booleans are True or False",
            "Lists use square brackets []",
            "Dictionaries use curly braces {} with key:value pairs",
          ],
        });
      } else if (activity.title.includes("Memory")) {
        activityType = "memory_game";
        newContent = JSON.stringify({
          cards: [
            { id: 1, text: ".upper()", description: "Convert to uppercase" },
            { id: 2, text: ".lower()", description: "Convert to lowercase" },
            { id: 3, text: ".strip()", description: "Remove whitespace" },
            { id: 4, text: ".replace()", description: "Replace text" },
            { id: 5, text: ".split()", description: "Split into list" },
            { id: 6, text: ".join()", description: "Join list elements" },
          ],
          gridSize: 3,
          timeLimit: 300,
          showTime: 3,
        });
      } else if (activity.title.includes("Matching")) {
        activityType = "matching";
        newContent = JSON.stringify({
          pairs: [
            { left: "+", right: "Addition operator", explanation: "5 + 3 = 8" },
            {
              left: "-",
              right: "Subtraction operator",
              explanation: "10 - 4 = 6",
            },
            {
              left: "*",
              right: "Multiplication operator",
              explanation: "3 * 4 = 12",
            },
            {
              left: "/",
              right: "Division operator",
              explanation: "15 / 4 = 3.75",
            },
            {
              left: "//",
              right: "Floor division operator",
              explanation: "15 // 4 = 3",
            },
            { left: "%", right: "Modulus operator", explanation: "15 % 4 = 3" },
          ],
          instructions:
            "Match each Python mathematical operator with its correct description",
        });
      } else if (
        activity.title.includes("Complete") ||
        activity.title.includes("Fill")
      ) {
        activityType = "fill_blanks";
        newContent = JSON.stringify({
          codeTemplate: `# Create an empty list
fruits = ___

# Add items to the list
fruits.___("apple")
fruits.___("banana") 

# Print the final list
___(fruits)`,
          blanks: [
            {
              id: 1,
              correctAnswer: "[]",
              position: 1,
              hint: "Use [] to create empty lists",
            },
            {
              id: 2,
              correctAnswer: "append",
              position: 2,
              hint: "Use .append() to add items",
            },
            {
              id: 3,
              correctAnswer: "append",
              position: 3,
              hint: "Use .append() to add items",
            },
            {
              id: 4,
              correctAnswer: "print",
              position: 4,
              hint: "Use print() to display output",
            },
          ],
          expectedOutput: "['apple', 'banana']",
        });
      } else if (activity.title.includes("Demo")) {
        activityType = "interactive_demo";
        newContent = JSON.stringify({
          demos: [
            {
              title: "Basic if Statement",
              code: `age = 18\nif age >= 18:\n    print("You can vote!")`,
              explanation: "A simple if statement checks one condition",
              interactive: true,
              variables: { age: 18 },
            },
          ],
          instructions:
            "Step through each demonstration to understand conditional logic",
        });
      } else if (
        activity.title.includes("Build") &&
        activity.title.includes("Loop")
      ) {
        activityType = "code_builder";
        newContent = JSON.stringify({
          target: "Build a working Python loop that prints numbers 1 to 5",
          blocks: [
            { id: 1, code: "# Print numbers 1 to 5", type: "comment" },
            { id: 2, code: "for i in range(1, 6):", type: "control" },
            { id: 3, code: '    print(f"Number: {i}")', type: "output" },
            { id: 4, code: 'print("Loop completed!")', type: "output" },
          ],
          correctOrder: [1, 2, 3, 4],
          hints: [
            "Comments usually come first",
            "for loops start with 'for' keyword",
            "Indented code runs inside the loop",
          ],
        });
      } else if (activity.title.includes("Class")) {
        activityType = "class_builder";
        newContent = JSON.stringify({
          className: "Student",
          attributes: ["name", "age", "grades"],
          methods: ["__init__", "add_grade", "get_average", "__str__"],
          instructions: "Build a complete Student class",
        });
      } else if (
        activity.title.includes("Explore") ||
        activity.title.includes("Data")
      ) {
        activityType = "data_exploration";
        newContent = JSON.stringify({
          dataset: [
            { name: "Alice", math: 95, science: 87 },
            { name: "Bob", math: 78, science: 85 },
          ],
          tasks: ["Calculate averages", "Find top performers"],
          instructions: "Explore Python's data processing capabilities",
        });
      } else {
        activityType = "interactive_coding";
        // Keep existing content for coding activities
        continue;
      }

      await prisma.codeArena.update({
        where: { id: activity.id },
        data: {
          content: newContent,
          activityType: activityType,
        },
      });

      console.log(`✅ Fixed: ${activity.title} (${activityType})`);
    }

    console.log("🎉 All content structures fixed!");
  } catch (error) {
    console.error("❌ Error fixing content structures:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixContentStructures();
