import { QuizQuestion, QuizCategory } from "../types/quiz-types";

export const controlFlowCategories: QuizCategory[] = [
  {
    name: "Control Flow",
    description:
      "Managing program flow with conditional statements (if, elif, else) and loops (for, while).",
    color: "#50E3C2",
    icon: "🔄",
    sortOrder: 2,
  },
];

export const controlFlowQuestions: QuizQuestion[] = [
  // Buraya Control Flow soruları eklenecek
  {
    question:
      "Which keyword is used to create a conditional statement in Python?",
    options: ["condition", "if", "check", "when"],
    correctAnswer: 1,
    explanation:
      "The 'if' keyword is used to create conditional statements in Python.",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question:
      "What keyword is used to handle the case when the 'if' condition is false?",
    options: ["otherwise", "else", "then", "except"],
    correctAnswer: 1,
    explanation:
      "The 'else' keyword is used to execute code when the 'if' condition evaluates to False.",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question: "Which loop is used to iterate over a sequence in Python?",
    options: ["while loop", "for loop", "do-while loop", "repeat loop"],
    correctAnswer: 1,
    explanation:
      "The 'for' loop is used to iterate over sequences like lists, strings, or ranges.",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question:
      "Which keyword is used to start a conditional statement in Python?",
    options: ["when", "check", "if", "case"],
    correctAnswer: 2,
    explanation:
      "The `if` keyword is used to start a conditional block. It checks if a condition is true and executes the code inside if it is.",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question: "What is the purpose of the `else` keyword in an `if` statement?",
    options: [
      "To provide an alternative block of code to execute if the `if` condition is false.",
      "To end the `if` statement.",
      "To check for another condition.",
      "To repeat the `if` block.",
    ],
    correctAnswer: 0,
    explanation:
      "The `else` block contains code that is executed only when the preceding `if` (and any `elif`) conditions are not met (evaluate to False).",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question:
      "Which loop is used for iterating over a sequence (like a list or a string)?",
    options: ["while", "if", "for", "repeat"],
    correctAnswer: 2,
    explanation:
      "The `for` loop is ideal for iterating through the items of any sequence, such as a list, tuple, or string, one by one.",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question: "What does the `range(5)` function generate?",
    options: [
      "Numbers from 1 to 5.",
      "Numbers from 0 to 4.",
      "The single number 5.",
      "Numbers from 0 to 5.",
    ],
    correctAnswer: 1,
    explanation:
      "`range(n)` generates a sequence of numbers starting from 0 up to (but not including) `n`.",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question: "Which statement is used to exit a loop completely?",
    options: ["exit", "stop", "continue", "break"],
    correctAnswer: 3,
    explanation:
      "The `break` statement immediately terminates the innermost loop it is in, and the program continues execution at the statement following the loop.",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question: "What does the `continue` statement do inside a loop?",
    options: [
      "It stops the loop entirely.",
      "It skips the rest of the current iteration and moves to the next one.",
      "It pauses the loop indefinitely.",
      "It deletes the current item.",
    ],
    correctAnswer: 1,
    explanation:
      "The `continue` statement rejects all the remaining statements in the current iteration of the loop and moves the control back to the top of the loop for the next iteration.",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question: "Why is indentation important in Python?",
    options: [
      "It is not important; it only makes code look good.",
      "It is used to define blocks of code, such as what is inside a loop or an `if` statement.",
      "It is used for comments.",
      "It indicates the data type of a variable.",
    ],
    correctAnswer: 1,
    explanation:
      "Unlike other languages that use brackets or keywords, Python uses indentation to determine the grouping of statements. Incorrect indentation will cause errors.",
    difficulty: "beginner",
    category: "Control Flow",
  },

  // Control Flow - Intermediate
  {
    question:
      "What will be the output of this code? `x = 5; if x > 2: print('A'); if x > 4: print('B')`",
    options: ["A", "B", "A\nB", "No output"],
    correctAnswer: 2,
    explanation:
      "Both `if` conditions are true (5 is greater than 2, and 5 is greater than 4), so the code inside both blocks is executed sequentially.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question: "How do you write a `for` loop that counts from 10 down to 1?",
    options: [
      "`for i in range(10, 0):`",
      "`for i in range(10, 1, -1):`",
      "`for i in range(10, 0, -1):`",
      "`for i in range(1, 10):`",
    ],
    correctAnswer: 2,
    explanation:
      "The `range()` function can take a third argument for the step. A negative step, like -1, is used for counting down. The stop value (0) is not included in the output.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question: "What is a `while True` loop?",
    options: [
      "A loop that runs exactly once.",
      "A loop that never runs.",
      "An infinite loop that will run forever unless explicitly exited with a `break` statement.",
      "A syntax error.",
    ],
    correctAnswer: 2,
    explanation:
      "Since the condition `True` is always true, a `while True` loop will never terminate on its own. It's a common pattern for loops that wait for a specific event, which then triggers a `break`.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question: "What is the purpose of the `pass` statement?",
    options: [
      "To skip an iteration.",
      "To act as a placeholder where code is syntactically required but you have nothing to write yet.",
      "To exit a function.",
      "To pass a variable to a function.",
    ],
    correctAnswer: 1,
    explanation:
      "The `pass` statement is a null operation; nothing happens when it executes. It's useful as a placeholder in `if` blocks, function definitions, or classes that you plan to implement later.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question: "What is the output? `for char in 'Hi': print(char)`",
    options: ["H\ni", "Hi", "char", "Error"],
    correctAnswer: 0,
    explanation:
      "A `for` loop can iterate directly over a string. In each iteration, the loop variable (`char`) takes the value of the next character. The `print()` function adds a newline by default.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "What will this code print? `count = 3; while count > 0: print(count); count -= 1`",
    options: ["3\n2\n1\n0", "3\n2\n1", "2\n1\n0", "An infinite loop"],
    correctAnswer: 1,
    explanation:
      "The `while` loop continues as long as `count` is greater than 0. It prints the value of `count` and then decrements it, stopping after it prints 1 and `count` becomes 0.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "What is the Pythonic way to write a simple if-else assignment, known as the ternary operator?",
    options: [
      "`x = (condition ? value_if_true : value_if_false)`",
      "`x = if condition then value_if_true else value_if_false`",
      "`x = value_if_true if condition else value_if_false`",
      "Python does not have a ternary operator.",
    ],
    correctAnswer: 2,
    explanation:
      "Python's conditional expression (ternary operator) allows for a compact one-line if-else assignment with the syntax `value_if_true if condition else value_if_false`.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question: "What is a nested loop?",
    options: [
      "A loop that never ends.",
      "Two loops written one after the other.",
      "A loop inside another loop.",
      "A loop that iterates over a dictionary.",
    ],
    correctAnswer: 2,
    explanation:
      "A nested loop is a control flow structure where one loop is placed inside the body of another loop. The inner loop is executed fully for each iteration of the outer loop.",
    difficulty: "intermediate",
    category: "Control Flow",
  },

  // Control Flow - Advanced
  {
    question:
      "What is the output of this code? `for i in range(2): print('A'); for j in range(2): print('B')`",
    options: [
      "A\nB\nA\nB",
      "A\nB\nB\nA\nB\nB",
      "A\nB\nA\nB\nA\nB",
      "A\nA\nB\nB",
    ],
    correctAnswer: 1,
    explanation:
      "This is a nested loop. The outer loop runs twice. For each run of the outer loop, the inner loop runs twice, printing 'B' each time. So, 'A' is printed, then 'B' twice. Then 'A' is printed again, and 'B' twice again.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question: "When does the `else` block of a `for` loop execute?",
    options: [
      "Always after the loop finishes.",
      "Only when the loop is terminated by a `break` statement.",
      "Only if the loop finishes its full iteration without being terminated by a `break` statement.",
      "It executes in every iteration.",
    ],
    correctAnswer: 2,
    explanation:
      "The `for...else` construct is a unique feature. The `else` block is executed only if the loop completes normally, meaning it iterates through all its items and is not exited prematurely by a `break`.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question:
      "What will this `while...else` code output? `i = 5; while i > 0: i -= 1; if i == 2: break; else: print('Done')`",
    options: ["Done", "No output", "5\n4\n3\nDone", "An error"],
    correctAnswer: 1,
    explanation:
      "Similar to a `for...else` loop, the `else` block of a `while` loop only executes if the loop's condition becomes false. If the loop is exited by a `break`, the `else` block is skipped. Here, the loop breaks when `i` becomes 2.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question:
      "What is printed by this code? `for i in range(5): if i == 2: continue; print(i)`",
    options: ["0\n1\n3\n4", "0\n1\n2\n3\n4", "0\n1", "0\n1\n2"],
    correctAnswer: 0,
    explanation:
      "The `continue` statement skips the rest of the current iteration. When `i` is 2, the condition is met, `continue` is executed, and the `print(i)` statement is skipped for that iteration only.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question:
      "What is the value of `result`? `age = 15; result = 'kid' if age < 13 else 'teenager'`",
    options: ["'kid'", "'teenager'", "True", "An error"],
    correctAnswer: 1,
    explanation:
      "This is a ternary conditional expression. Since the condition `age < 13` (15 < 13) is false, the value after the `else` keyword is assigned to the `result` variable.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question:
      "What is the scope of a variable declared inside a `for` loop in Python?",
    options: [
      "It is only accessible inside the `for` loop.",
      "It is accessible inside the loop and in the `else` block.",
      "It 'leaks' and is accessible in the surrounding scope after the loop finishes.",
      "It is only accessible in the final iteration.",
    ],
    correctAnswer: 2,
    explanation:
      "Unlike some other languages, Python does not have a separate block scope for loops. A variable assigned in a `for` loop will exist in the parent scope and hold the value from the last iteration after the loop completes.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question: "Which of the following is equivalent to `if x and y:`?",
    options: [
      "`if x: if y:`",
      "`if x or y:`",
      "`if x: else: if y:`",
      "`if not x: if not y:`",
    ],
    correctAnswer: 0,
    explanation:
      "The `and` operator requires both operands to be truthy. This is logically equivalent to a nested `if` statement, where the inner block is only reachable if the outer condition is met.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question: "What's the output? `for x in []: print('A'); else: print('B')`",
    options: ["A", "B", "No output", "A\nB"],
    correctAnswer: 1,
    explanation:
      "The `for` loop iterates over an empty list, so it completes its 'full iteration' (of zero items) immediately without ever running the loop body. Therefore, the `else` block is executed.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question:
      "What is the primary difference between a `for` loop and a `while` loop?",
    options: [
      "There is no difference.",
      "A `for` loop is used for definite iteration (over a known sequence), while a `while` loop is for indefinite iteration (until a condition becomes false).",
      "A `while` loop is always faster.",
      "A `for` loop can't be infinite, but a `while` loop can.",
    ],
    correctAnswer: 1,
    explanation:
      "This is the fundamental conceptual difference. Use a `for` loop when you know how many times you want to loop or have a sequence to iterate over. Use a `while` loop when you need to loop as long as a certain condition holds true.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "What does the following expression evaluate to? `x = 'A' if 0 else 'B'`",
    options: ["'A'", "'B'", "True", "False"],
    correctAnswer: 1,
    explanation:
      "This uses the ternary operator with Python's 'truthiness' rules. The number 0 evaluates to False in a boolean context. Therefore, the expression after `else` is chosen.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question: "What is the output of `for i in range(2, 5): print(i)`?",
    options: ["2\n3\n4\n5", "2\n3\n4", "3\n4\n5", "2\n5"],
    correctAnswer: 1,
    explanation:
      "`range(start, stop)` generates numbers from `start` up to (but not including) `stop`. So, it produces 2, 3, and 4.",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question:
      "Which expression checks if `x` is either less than 5 or greater than 10?",
    options: [
      "`x < 5 and x > 10`",
      "`x < 5 or x > 10`",
      "`5 > x > 10`",
      "`if x < 5 or > 10:`",
    ],
    correctAnswer: 1,
    explanation:
      "The `or` logical operator is used to check if at least one of multiple conditions is true.",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question:
      "What is the output of this code? `if 'a' in 'team': print('Found') else: print('Not Found')`",
    options: ["Found", "Not Found", "True", "Error"],
    correctAnswer: 0,
    explanation:
      "The `in` operator can be used to check for membership. Since the character 'a' is present in the string 'team', the `if` block is executed.",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question:
      "What will this `while` loop do? `x = 5; while x > 5: print('Looping')`",
    options: [
      "Print 'Looping' once.",
      "Print 'Looping' five times.",
      "Result in an infinite loop.",
      "Nothing will be printed.",
    ],
    correctAnswer: 3,
    explanation:
      "The loop's condition `x > 5` is false from the beginning (since 5 is not greater than 5). Therefore, the code inside the loop will never be executed.",
    difficulty: "beginner",
    category: "Control Flow",
  },

  // Control Flow - Batch 2 - Intermediate
  {
    question:
      "How do you loop through a list and get both the index and the value of each item?",
    options: [
      "Using `for index, value in list:`",
      "Using `for item in index(list):`",
      "Using `for index, value in enumerate(list):`",
      "Using `for item in list.items():`",
    ],
    correctAnswer: 2,
    explanation:
      "The built-in `enumerate()` function is the Pythonic way to get both the index and the value of an item when iterating over a sequence.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "What is the output of `for k, v in {'a': 1, 'b': 2}.items(): print(k, v)`?",
    options: ["'a' 1\n'b' 2", "a 1\nb 2", "{'a': 1}\n{'b': 2}", "Error"],
    correctAnswer: 1,
    explanation:
      "The `.items()` method of a dictionary returns view objects containing key-value pairs (as tuples), which can be unpacked into two variables in a `for` loop.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "What does this code do? `numbers = [1, 2, 3]; while numbers: print(numbers.pop())`",
    options: [
      "Prints 1, 2, 3",
      "Prints 3, 2, 1",
      "Results in an infinite loop.",
      "Raises an error.",
    ],
    correctAnswer: 1,
    explanation:
      "An empty list evaluates to False. The loop continues as long as the list is not empty. `pop()` removes and returns the last item, so it prints the items from last to first until the list is empty and the loop terminates.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question: "How can you iterate through a list in reverse order?",
    options: [
      "Using `for item in list.reverse():`",
      "Using `for item in reversed(list):`",
      "Using `for item in list[::-1]:`",
      "Both B and C are correct.",
    ],
    correctAnswer: 3,
    explanation:
      "The `reversed()` function returns a reverse iterator, which is memory-efficient. Slicing with `[::-1]` creates a reversed copy of the list. Both are valid ways to achieve this.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question: "What is a common use for a boolean 'flag' in a `while` loop?",
    options: [
      "To count the number of iterations.",
      "To store the items from the loop.",
      "To control when the loop should stop running based on an event inside the loop.",
      "To format the output of the loop.",
    ],
    correctAnswer: 2,
    explanation:
      "A flag (e.g., `is_running = True`) can be set to `False` inside the loop when a certain condition is met, providing a clean way to terminate a `while` loop.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question: "What does the `if [False]:` statement do?",
    options: [
      "The code inside the `if` block will not execute.",
      "It will raise a TypeError.",
      "The code inside the `if` block will execute.",
      "It will raise a ValueError.",
    ],
    correctAnswer: 2,
    explanation:
      "This checks the 'truthiness' of the list `[False]`. Since the list is not empty, it evaluates to True in a boolean context, and the code inside the `if` block is executed. The value of the items inside does not matter.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "What is the output of `for key in {'a': 1, 'b': 2}: print(key)`?",
    options: ["1\n2", "('a', 1)\n('b', 2)", "a\nb", "Error"],
    correctAnswer: 2,
    explanation:
      "When you iterate directly over a dictionary, the loop variable is assigned the keys of the dictionary one by one.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question: "What is the output? `x = 'B'; result = 'A' or x`",
    options: ["'A'", "'B'", "True", "False"],
    correctAnswer: 0,
    explanation:
      "The `or` operator exhibits short-circuit behavior. It evaluates the first operand ('A'), finds that it is 'truthy' (a non-empty string), and returns its value immediately without checking the second operand.",
    difficulty: "intermediate",
    category: "Control Flow",
  },

  // Control Flow - Batch 2 - Advanced
  {
    question:
      "What is the output of this nested loop with a `break`? `for i in range(2): for j in range(2): if i == j: break; print(i, j)`",
    options: ["0 1\n1 0", "1 0", "0 1", "No output"],
    correctAnswer: 1,
    explanation:
      "The `break` only exits the inner loop. When i=0, j=0, it breaks. When i=0, j=1, it prints '0 1'. When i=1, j=0, it prints '1 0'. When i=1, j=1, it breaks. The final output is '1 0' because '0 1' was overwritten by the last print.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question: "What is the output? `result = 'A' and 'B' and 'C'`",
    options: ["True", "'A'", "'C'", "False"],
    correctAnswer: 2,
    explanation:
      "The `and` operator evaluates each operand. If all are truthy, it returns the value of the *last* operand. Since 'A' and 'B' are truthy, it evaluates 'C', finds it truthy, and returns it.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question:
      "What does this code print? `i = 0; while i < 5: print(i); i += 1; if i == 3: break; else: print('Done')`",
    options: ["0\n1\n2\nDone", "0\n1\n2", "0\n1\n2\n3", "0\n1\n2\n3\nDone"],
    correctAnswer: 1,
    explanation:
      "The `else` block of a `while` loop is skipped if the loop is terminated by a `break` statement. The loop prints 0, 1, 2, then `i` becomes 3, and the `break` is triggered, exiting the loop before 'Done' can be printed.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question: "How can you simulate a `do-while` loop in Python?",
    options: [
      "Using `do-while:` syntax.",
      "Using `for item in list.do_while():`",
      "Using a `while True:` loop with a `break` at the end of the block.",
      "It is not possible to simulate.",
    ],
    correctAnswer: 2,
    explanation:
      "Python doesn't have a built-in `do-while` loop. The common pattern to ensure the loop body runs at least once is to use an infinite `while True` loop and place the conditional `break` at the end.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question: "What is the result of `x = 0 or '' or []`?",
    options: ["0", "''", "[]", "False"],
    correctAnswer: 2,
    explanation:
      "The `or` operator returns the first truthy value it finds. If all values are falsy (like 0, empty string, and empty list), it returns the value of the *last* falsy operand.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question:
      "What is printed by this code? `my_list = [1, 2]; for i in range(len(my_list)): my_list.append(i)`",
    options: [
      "It prints nothing and runs without error.",
      "It runs for a very long time (infinite loop).",
      "It raises an IndexError.",
      "It prints 1, 2, 0, 1",
    ],
    correctAnswer: 1,
    explanation:
      "This is a classic error. Modifying a list while iterating over it (especially using an index based on its initial length) leads to unexpected behavior. `range(len(my_list))` is fixed at `range(2)`, but `my_list.append()` keeps extending the list, so the loop continues indefinitely.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question: "Which statement is true about the `elif` keyword?",
    options: [
      "It is a combination of `else` and `if`, and it checks a new condition if the previous `if` was false.",
      "It must be used at the end of an `if-else` block.",
      "It is an alternative way to write a `for` loop.",
      "It can only be used once in an `if` block.",
    ],
    correctAnswer: 0,
    explanation:
      "`elif` allows you to check multiple expressions for `True` and execute a block of code as soon as one of the conditions is met.",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question: "What will `if None:` do?",
    options: [
      "Execute the code block inside.",
      "Skip the code block inside.",
      "Raise a TypeError.",
      "Raise a SyntaxError.",
    ],
    correctAnswer: 1,
    explanation:
      "The `None` object evaluates to `False` in a boolean context. Therefore, the code inside this `if` statement will not be executed.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "How would you find all numbers in `list_a` that are also in `list_b` using a loop?",
    options: [
      "for i in list_a: if i in list_b: print(i)",
      "for i in list_a and list_b: print(i)",
      "for i in list_a: for j in list_b: if i != j: print(i)",
      "for i in list_a: if i.equals(list_b): print(i)",
    ],
    correctAnswer: 0,
    explanation:
      "This uses a `for` loop to iterate through the first list and a simple `if` statement with the `in` operator to check for membership in the second list, which is an efficient way to find common elements.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "What's the output? `n = 0; while n < 2: print('A'); n += 1 else: print('B')`",
    options: ["A\nA", "A\nA\nB", "A\nB\nA", "A"],
    correctAnswer: 1,
    explanation:
      "The `else` block of a `while` loop executes when the loop's condition becomes false. The loop prints 'A' for n=0 and n=1. When n becomes 2, the condition `n < 2` is false, the loop terminates normally, and the `else` block is executed, printing 'B'.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question: "In Python, a `for` loop is best described as a...",
    options: [
      "Conditional loop",
      "Counter-controlled loop",
      "Collection-controlled loop",
      "Pre-test loop",
    ],
    correctAnswer: 2,
    explanation:
      "Python's `for` loop is designed to iterate directly over the items of a collection/sequence (like a list, tuple, dictionary, or string), which is why it's called collection-controlled. This is different from C-style loops that manually manage a counter.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question: "What is the output? `if 1 and 0: print('A') else: print('B')`",
    options: ["'A'", "'B'", "True", "False"],
    correctAnswer: 1,
    explanation:
      "The expression `1 and 0` is evaluated. `1` is truthy, so the expression proceeds. `0` is falsy. The `and` operator requires both to be true, so the overall expression is falsy (specifically, it returns 0). This causes the `else` block to execute.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question: "Which of the following creates an infinite loop?",
    options: [
      "`for i in range(10): pass`",
      "`i = 0; while i < 10: i += 1`",
      "`i = 0; while i < 10: print(i)`",
      "`while []: pass`",
    ],
    correctAnswer: 2,
    explanation:
      "In option C, the value of `i` is never changed inside the loop. Therefore, the condition `i < 10` will always be true, and the loop will run forever. Option D will not run at all as an empty list is falsy.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "What is the output of this code? `if 'cat' not in 'category': print('Missing') else: print('Found')`",
    options: ["Missing", "Found", "True", "False"],
    correctAnswer: 1,
    explanation:
      "The `not in` operator checks for the absence of a substring. Since 'cat' is present in 'category', the condition is false, and the `else` block is executed.",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question:
      "How many times will 'X' be printed? `for i in range(10, 20, 2): print('X')`",
    options: ["10", "6", "5", "4"],
    correctAnswer: 2,
    explanation:
      "`range(10, 20, 2)` generates numbers starting from 10, with a step of 2, up to 20. The sequence is 10, 12, 14, 16, 18. This is a total of 5 numbers, so the loop runs 5 times.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "Which code block correctly prints 'Even' if a number `n` is even?",
    options: [
      "`if n / 2 == 0: print('Even')`",
      "`if n % 2 == 0: print('Even')`",
      "`if n // 2 == 1: print('Even')`",
      "`if n ** 2 == 0: print('Even')`",
    ],
    correctAnswer: 1,
    explanation:
      "The modulo operator (`%`) gives the remainder of a division. A number is even if it can be divided by 2 with no remainder.",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question: "What does the `range(5, 2)` produce?",
    options: ["5, 4, 3, 2", "5, 2", "An empty sequence", "A ValueError"],
    correctAnswer: 2,
    explanation:
      "When the `start` value in `range()` is greater than the `stop` value and the step is positive (default is 1), it produces an empty sequence. The loop will not execute.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "What is the result of this ternary expression? `x = 10; y = 'A' if x == 10 else 'B'`",
    options: ["'A'", "'B'", "True", "An error"],
    correctAnswer: 0,
    explanation:
      "The condition `x == 10` is true, so the value before the `if` keyword, which is 'A', is assigned to `y`.",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question: "What is printed? `for item in ('a', 'b'): print(item)`",
    options: ["item\nitem", "a b", "a\nb", "('a', 'b')"],
    correctAnswer: 2,
    explanation:
      "A `for` loop can iterate over any sequence, including tuples. It will print each item of the tuple on a new line.",
    difficulty: "beginner",
    category: "Control Flow",
  },

  // Control Flow - Batch 3 - Intermediate / Advanced
  {
    question:
      "What happens if you use `break` or `continue` outside of a loop?",
    options: [
      "The script exits.",
      "It acts like a `pass` statement.",
      "It raises a SyntaxError.",
      "It raises a TypeError.",
    ],
    correctAnswer: 2,
    explanation:
      "`break` and `continue` are syntactically only allowed inside `for` or `while` loops. Using them anywhere else will result in a SyntaxError.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "What is the output? `result = 'C'; if result == 'A': result = 'X'; elif result == 'B': result = 'Y'; print(result)`",
    options: ["'X'", "'Y'", "'C'", "No output"],
    correctAnswer: 2,
    explanation:
      "The code flows sequentially. The `if` condition is false. The `elif` condition is false. No new assignment happens inside the conditional block, so the original value of `result`, which is 'C', is printed.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "What will this code snippet print? `for i in range(2): pass; print(i)`",
    options: ["0", "1", "2", "It will raise a NameError."],
    correctAnswer: 1,
    explanation:
      "Variables used in a `for` loop 'leak' into the surrounding scope. After the loop `for i in range(2)` (which iterates through 0 and 1) finishes, `i` will hold the last value it was assigned, which is 1.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question:
      "What is a key feature of the assignment expression `:=` (walrus operator)?",
    options: [
      "It allows assigning and checking a value in the same expression, like `while (chunk := file.read(256)):`",
      "It creates a constant that cannot be changed.",
      "It is a more efficient way to perform `==`.",
      "It reverses the order of assignment.",
    ],
    correctAnswer: 0,
    explanation:
      "Introduced in Python 3.8, the walrus operator is useful for simplifying code where you need to get a value and then check its truthiness in a condition, common in `while` loops.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question:
      "What is the output of this complex ternary expression? `x = 5; 'A' if x > 10 else 'B' if x > 3 else 'C'`",
    options: ["'A'", "'B'", "'C'", "An error"],
    correctAnswer: 1,
    explanation:
      "This is evaluated from left to right. `x > 10` is false. The expression then evaluates the `else` part, which is another ternary: `'B' if x > 3 else 'C'`. Since `x > 3` is true, the result is 'B'.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question: "What makes an object 'iterable' in the context of a `for` loop?",
    options: [
      "It must be a list.",
      "It must have a `length` property.",
      "It must have an `__iter__()` method that returns an iterator.",
      "It must contain only numbers or strings.",
    ],
    correctAnswer: 2,
    explanation:
      "For an object to be used in a `for` loop, it must be iterable. Python's definition of iterable is any object that implements the `__iter__()` method.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question:
      "What is the output of this nested loop with `continue`? `for i in range(2): for j in range(2): if i == j: continue; print(i, j)`",
    options: ["0 1\n1 0", "1 0", "0 1", "1 1"],
    correctAnswer: 0,
    explanation:
      "`continue` skips the print statement only when `i == j`. So, it skips for (0,0) and (1,1). It prints for (0,1) and (1,0).",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question:
      "What is a potential risk of this code? `numbers = [1, 2, 3]; for n in numbers: numbers.insert(0, n)`",
    options: [
      "It will raise an IndexError.",
      "It will raise a TypeError.",
      "It will result in an infinite loop.",
      "It will run successfully and terminate.",
    ],
    correctAnswer: 2,
    explanation:
      "Modifying a list while iterating over it can lead to unexpected behavior. In this case, you are adding new items to the front of the list, so the iterator never reaches the end, causing an infinite loop.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question: "What is the output? `result = '' and 'B'`",
    options: ["True", "False", "'' (empty string)", "'B'"],
    correctAnswer: 2,
    explanation:
      "The `and` operator short-circuits. It evaluates the first operand (`''`), finds that it is 'falsy', and returns its value immediately without checking the second operand.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question: "What does this code do? `if x:` where `x` is `0`.",
    options: [
      "Executes the `if` block.",
      "Skips the `if` block and executes `else` or `elif` if present.",
      "Raises a TypeError because `x` is not a boolean.",
      "Raises a ValueError.",
    ],
    correctAnswer: 1,
    explanation:
      "This checks the 'truthiness' of `x`. The integer `0` is considered a 'falsy' value in Python, so the condition is false.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question: "How can you loop from 0 to 100, including 100?",
    options: [
      "`for i in range(100):`",
      "`for i in range(1, 100):`",
      "`for i in range(101):`",
      "`for i in range(0, 100, 1):`",
    ],
    correctAnswer: 2,
    explanation:
      "The `range(stop)` function goes up to, but does not include, the `stop` value. To include 100, the stop value must be 101.",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question: "What is the output? `i = 1; while i < 3: print('A'); i += 1`",
    options: ["A", "A\nA", "A\nA\nA", "Infinite loop"],
    correctAnswer: 1,
    explanation:
      "The loop runs for `i=1` and `i=2`. When `i` becomes 3, the condition `i < 3` is no longer true, and the loop terminates. 'A' is printed twice.",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question: "What is the output? `while False: print('A'); else: print('B')`",
    options: ["A", "B", "No output", "A\nB"],
    correctAnswer: 1,
    explanation:
      "The `while` loop's condition is immediately false, so the loop body is never entered. The loop terminates 'normally' (not via a `break`), so the `else` block is executed.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question: "What is a 'dead loop'?",
    options: [
      "A loop that has a `break` statement.",
      "A loop whose condition is false from the very beginning, so it never executes.",
      "Another name for an infinite loop.",
      "A loop that contains only a `pass` statement.",
    ],
    correctAnswer: 1,
    explanation:
      "A 'dead loop' or 'dead code' refers to code that is unreachable. For a loop, this means its controlling condition is initially false, so its body is never executed.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "Which of the following is NOT a valid conditional operator in an `if` statement?",
    options: ["`==`", "`is`", "`=`", "`!=`"],
    correctAnswer: 2,
    explanation:
      "The single equals sign `=` is the assignment operator, used for assigning values to variables. The double equals sign `==` is the equality comparison operator.",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question:
      "What does the code print? `for i in range(3): for j in range(i): print(j)`",
    options: ["0\n0\n1", "1\n2", "0\n1\n2", "0\n1"],
    correctAnswer: 3,
    explanation:
      "When i=0, `range(0)` is empty. When i=1, `range(1)` produces 0, so '0' is printed. When i=2, `range(2)` produces 0 and 1, so '0' and '1' are printed.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question:
      "What's a common way to loop a specific number of times without needing a counter variable?",
    options: ["`for _ in range(5):`", "`for i in 5:`", "`while 5:`", "`if 5:`"],
    correctAnswer: 0,
    explanation:
      "When you need to repeat an action a set number of times but don't need to use the iteration number, it's a common convention to use an underscore `_` as the loop variable to indicate it's intentionally unused.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "What's the output? `if 'a' > 'B': print('Yes') else: print('No')`",
    options: ["Yes", "No", "TypeError", "It depends on the system."],
    correctAnswer: 0,
    explanation:
      "String comparison is done based on their ordinal (ASCII/Unicode) values. Lowercase letters have higher ordinal values than uppercase letters, so 'a' is considered greater than 'B'.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question: "In `if condition1 or condition2:`, if `condition1` is `True`...",
    options: [
      "`condition2` is always checked.",
      "`condition2` is never checked.",
      "`condition2` is only checked if it's a boolean.",
      "The program raises an error.",
    ],
    correctAnswer: 1,
    explanation:
      "This is known as short-circuit evaluation. The `or` operator only needs one condition to be true. Once it finds one (`condition1`), it knows the whole expression is `True` and doesn't bother evaluating `condition2`.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "What is the primary feature of the `match-case` statement introduced in Python 3.10?",
    options: [
      "It is a more efficient way to write `for` loops.",
      "It provides a way to perform structural pattern matching, similar to a `switch` statement but more powerful.",
      "It is a new way to handle errors.",
      "It is used for multi-threading control.",
    ],
    correctAnswer: 1,
    explanation:
      "The `match-case` statement allows for complex pattern matching against values and data structures, offering a more readable and powerful alternative to complex `if-elif-else` chains.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question:
      "What happens when a `return` statement is executed inside a loop within a function?",
    options: [
      "Only the current iteration of the loop is terminated.",
      "Only the loop is terminated, and the function continues.",
      "The entire function is terminated immediately, and a value is returned.",
      "It causes a SyntaxError.",
    ],
    correctAnswer: 2,
    explanation:
      "`return` is a function-level statement. When executed, it exits the entire function immediately, regardless of how many loops it is nested inside.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question:
      "What is the output? `my_iterator = iter([1, 2]); for i in my_iterator: pass; for i in my_iterator: print('A')`",
    options: ["A", "A\nA", "No output", "An error"],
    correctAnswer: 2,
    explanation:
      "Iterators can only be consumed once. The first `for` loop exhausts the iterator. The second `for` loop has no items left to iterate over, so its body never executes.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question:
      "In a `match-case` block, what does the wildcard pattern `case _:` do?",
    options: [
      "It matches only the underscore character.",
      "It is a catch-all case that matches any subject if no other case has matched.",
      "It matches any empty sequence.",
      "It is a syntax error.",
    ],
    correctAnswer: 1,
    explanation:
      "The underscore `_` in a `match-case` statement acts as a wildcard, similar to the `else` block in an `if-elif` chain. It ensures that there is always a block to execute.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question: "What is a classic 'FizzBuzz' test designed to evaluate?",
    options: [
      "A programmer's ability to handle complex data structures.",
      "A programmer's understanding of basic loop and conditional logic (`for`, `if`, `elif`, `else`, `%`).",
      "A programmer's knowledge of object-oriented programming.",
      "A programmer's skill in writing fast algorithms.",
    ],
    correctAnswer: 1,
    explanation:
      "FizzBuzz is a common screening problem that tests for fundamental programming skills, specifically the ability to use loops and conditional logic to solve a simple problem.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "What will this code print? `for i in range(-2, -5, -1): print(i)`",
    options: ["-2\n-3\n-4", "-2\n-1\n0", "-5\n-4\n-3", "No output"],
    correctAnswer: 0,
    explanation:
      "`range()` works with negative numbers. It starts at -2 and counts down by 1 (`step=-1`) until it reaches the stop value of -5 (which is not included).",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "What is the output? `x = 5; if 1 < x < 4: print('A') else: print('B')`",
    options: ["A", "B", "True", "Error"],
    correctAnswer: 1,
    explanation:
      "Chained comparisons are equivalent to `(1 < x) and (x < 4)`. While `1 < 5` is true, `5 < 4` is false. Since `and` requires both to be true, the overall condition is false, executing the `else` block.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "What is the output? `data = [1, 2]; if (val := len(data)) > 1: print(val)`",
    options: ["True", "1", "2", "An error"],
    correctAnswer: 2,
    explanation:
      "The walrus operator `:=` assigns the result of `len(data)` (which is 2) to the variable `val` AND allows the value to be used in the comparison `val > 1`. Since 2 > 1 is true, the `print(val)` statement is executed.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question:
      "What's the output? `i=0; while i<5: i+=1; if i==2: continue; print(i, end='')`",
    options: ["1345", "12345", "01234", "134"],
    correctAnswer: 0,
    explanation:
      "The loop prints 1. When i becomes 2, `continue` skips the print. Then it prints 3, 4, and 5. `end=''` keeps them on the same line.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question: "A `for` loop in Python is best suited for which situation?",
    options: [
      "When you want a loop to run indefinitely until a user provides input.",
      "When you want to iterate over a finite sequence of items.",
      "When you need to check a complex boolean condition.",
      "When you want a loop to run at least once.",
    ],
    correctAnswer: 1,
    explanation:
      "The `for` loop is designed for definite iteration, meaning it runs for a predictable number of times based on the length of the sequence (list, string, range, etc.) it is iterating over.",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question:
      "What is the output? `if []: print('A') elif [1]: print('B') else: print('C')`",
    options: ["A", "B", "C", "No output"],
    correctAnswer: 1,
    explanation:
      "The first condition `if []` is false because an empty list is falsy. The program then checks the `elif [1]:`. A non-empty list is truthy, so this condition is true, and 'B' is printed.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "What is the state of `x` and `y` after this loop? `x=0;y=0; for i in range(5): if i%2==0: x+=1; else: y+=1`",
    options: [
      "x is 2, y is 3",
      "x is 3, y is 2",
      "x is 5, y is 0",
      "x is 2, y is 2",
    ],
    correctAnswer: 1,
    explanation:
      "The loop iterates for i = 0, 1, 2, 3, 4. The `if` block (for even numbers) runs for 0, 2, 4 (3 times). The `else` block (for odd numbers) runs for 1, 3 (2 times). So `x` becomes 3 and `y` becomes 2.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question: "What is the most accurate description of a 'jump statement'?",
    options: [
      "A statement that performs a calculation.",
      "A statement that unconditionally transfers control to another point in the program.",
      "A statement that defines a function.",
      "A statement that creates a variable.",
    ],
    correctAnswer: 1,
    explanation:
      "`break`, `continue`, and `return` are considered jump statements because they interrupt the normal sequential flow of execution and jump control to a new location.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question:
      "What is printed? `x=True; y=False; if x or y and not x: print('A') else: print('B')`",
    options: ["A", "B", "True", "An error"],
    correctAnswer: 0,
    explanation:
      "Operator precedence is `not`, then `and`, then `or`. `not x` is `False`. `y and False` is `False`. `x or False` (which is `True or False`) is `True`. So, the `if` block executes.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question:
      "How is a multi-way `if-elif-else` statement different from a series of simple `if` statements?",
    options: [
      "There is no difference.",
      "An `if-elif-else` chain is guaranteed to execute exactly one block of code.",
      "A series of `if` statements can execute multiple blocks of code.",
      "Both B and C are correct.",
    ],
    correctAnswer: 3,
    explanation:
      "In an `if-elif-else` structure, only the first true condition's block is executed. In a series of separate `if` statements, each condition is checked independently, and multiple blocks could potentially run.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question: "What is the output? `for i in range(1, 1): print(i)`",
    options: ["1", "0", "No output", "Error"],
    correctAnswer: 2,
    explanation:
      "`range(1, 1)` tries to generate numbers starting at 1 and stopping before 1. Since it's already at the stop value, the sequence is empty, and the loop body never runs.",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question: "A `while` loop is best suited for which situation?",
    options: [
      "When you need to iterate over a fixed set of items.",
      "When you want a loop to run until a condition is no longer true, and you don't know how many iterations that will take.",
      "When you need to get an index along with a value.",
      "When you want to loop in reverse.",
    ],
    correctAnswer: 1,
    explanation:
      "The `while` loop's strength is indefinite iteration. It's perfect for scenarios like waiting for user input, processing a data stream, or running a simulation until a goal is met.",
    difficulty: "beginner",
    category: "Control Flow",
  },
  {
    question:
      "What does this code print? `x='C'; y = 'A' if x=='B' else 'B' if x=='C' else 'D'`",
    options: ["'A'", "'B'", "'C'", "'D'"],
    correctAnswer: 1,
    explanation:
      "This is a chained ternary expression. `x=='B'` is false, so it evaluates the first `else`. This leads to the second ternary: `'B' if x=='C' else 'D'`. Since `x=='C'` is true, the result is 'B'.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question: "What is printed? `x = 10; while x > 5: x -= 2; print(x)`",
    options: ["8\n6\n4", "8\n6", "10\n8\n6", "8, 6, 4"],
    correctAnswer: 0,
    explanation:
      "The loop starts with x=10. First iteration: x becomes 8, prints 8. Second: x becomes 6, prints 6. Third: x becomes 4, prints 4. Now `x > 5` is false, so the loop terminates.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "What is the output? `if 'a' in {'a':1}: print('Yes') else: print('No')`",
    options: ["Yes", "No", "Error", "1"],
    correctAnswer: 0,
    explanation:
      "The `in` operator, when used on a dictionary, checks for the presence of a key. Since 'a' is a key in the dictionary, the condition is true.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "How many lines will this code print? `for i in range(2): for j in range(3): print(i, j)`",
    options: ["2", "3", "5", "6"],
    correctAnswer: 3,
    explanation:
      "This is a nested loop. The outer loop runs 2 times. The inner loop runs 3 times for each outer iteration. The total number of `print` executions is 2 * 3 = 6.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question:
      "What is the value of `count`? `count = 0; for i in 'abc': for j in 'xyz': count += 1`",
    options: ["3", "6", "9", "12"],
    correctAnswer: 2,
    explanation:
      "The outer loop runs 3 times. The inner loop runs 3 times for each of those outer iterations. The total number of times `count += 1` is executed is 3 * 3 = 9.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question: "What is the output? `if -1: print('A') else: print('B')`",
    options: ["A", "B", "Error", "No output"],
    correctAnswer: 0,
    explanation:
      "In Python's truthiness rules, the only number that is 'falsy' is 0. All other numbers, including negative numbers like -1, are 'truthy'. Therefore, the `if` block is executed.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  {
    question: "Which of these will cause a SyntaxError?",
    options: [
      "`if x == 5: pass`",
      "`if x == 5 else: pass`",
      "`x = 5 if True else 10`",
      "`for _ in range(5):`",
    ],
    correctAnswer: 1,
    explanation:
      "An `else` statement must be preceded by an `if` (or `elif`) block. An `if` block cannot be empty before an `else`, it needs at least one statement, even if it's just `pass`.",
    difficulty: "advanced",
    category: "Control Flow",
  },
  {
    question:
      "What's the output? `s=''; for i in range(3): s += str(i); print(s)`",
    options: ["012", "6", "3", "0\n01\n012"],
    correctAnswer: 3,
    explanation:
      "The `print(s)` is inside the loop. After the first iteration, s='0' and is printed. After the second, s='01' and is printed. After the third, s='012' and is printed.",
    difficulty: "intermediate",
    category: "Control Flow",
  },
  // TODO: Bu kategori için daha fazla soru ekleyin
];
