import { QuizQuestion, QuizCategory } from "../types/quiz-types";

export const pythonBasicsCategories: QuizCategory[] = [
  {
    name: "Python Basics",
    description:
      "Variables, basic data types (string, integer, float, boolean), operators, and basic I/O operations.",
    color: "#4A90E2",
    icon: "📚",
    sortOrder: 1,
  },
];

export const pythonBasicsQuestions: QuizQuestion[] = [
  // Python Basics - Beginner
  {
    question: "Which symbol is used to start a single-line comment in Python?",
    options: ["//", "/*", "#", "---"],
    correctAnswer: 2,
    explanation:
      "Python uses the hash symbol (#) for single-line comments. Anything after the # on the same line is ignored by the interpreter.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "What will be the output of `print(type(15))`?",
    options: [
      "<class 'int'>",
      "<class 'str'>",
      "<class 'float'>",
      "<class 'bool'>",
    ],
    correctAnswer: 0,
    explanation:
      "The number 15 is a whole number, so its data type is an integer, which is represented as 'int' in Python.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question:
      "Which of the following is the correct way to assign the string 'hello' to a variable named 'greeting'?",
    options: [
      "greeting = 'hello'",
      "string greeting = 'hello'",
      "greeting := 'hello'",
      "'hello' -> greeting",
    ],
    correctAnswer: 0,
    explanation:
      "Python uses the equals sign (=) for variable assignment. You don't need to declare the data type.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "What is the result of the expression `2 ** 3`?",
    options: ["6", "5", "8", "1"],
    correctAnswer: 2,
    explanation:
      "The double asterisk (**) operator in Python is used for exponentiation. So, `2 ** 3` means 2 to the power of 3, which is 8.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "How do you get user input from the console in Python?",
    options: ["cin()", "read_input()", "get_input()", "input()"],
    correctAnswer: 3,
    explanation:
      "The `input()` function is used to read a line of text from the user as a string.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "What will be the output of `print('Py' + 'thon')`?",
    options: ["Py thon", "Python", "Py+thon", "An error will occur"],
    correctAnswer: 1,
    explanation:
      "The plus (+) operator is used for string concatenation, joining two strings together without any space.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "Which data type is used to store a True or False value?",
    options: ["int", "bool", "boolean", "str"],
    correctAnswer: 1,
    explanation:
      "The boolean data type, represented as 'bool' in Python, can hold one of two values: True or False.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "What is the result of `10 % 3`?",
    options: ["3", "1", "0", "3.33"],
    correctAnswer: 1,
    explanation:
      "The percent (%) operator is the modulo operator, which returns the remainder of a division. 10 divided by 3 is 3 with a remainder of 1.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "Which function is used to get the length of a string?",
    options: ["length()", "size()", "count()", "len()"],
    correctAnswer: 3,
    explanation:
      "The built-in `len()` function returns the number of items in an object, including the number of characters in a string.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "What will `print(int('123'))` output?",
    options: ["'123'", "123", "An error will occur", "None"],
    correctAnswer: 1,
    explanation:
      "The `int()` function can be used to convert a string of digits into an integer.",
    difficulty: "beginner",
    category: "Python Basics",
  },

  // Python Basics - Intermediate
  {
    question: "What is the output of `print(3 * 'A')`?",
    options: ["AAA", "3A", "A3", "An error will occur"],
    correctAnswer: 0,
    explanation:
      "The multiplication operator (*) can be used to repeat a string a specified number of times.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What is the value of the boolean expression `5 > 3 and 2 < 1`?",
    options: ["True", "False", "None", "An error will occur"],
    correctAnswer: 1,
    explanation:
      "The 'and' operator returns True only if both conditions are true. Since `2 < 1` is false, the entire expression evaluates to False.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question:
      "Which of the following is a reserved keyword in Python and cannot be used as a variable name?",
    options: ["string", "variable", "print", "class"],
    correctAnswer: 3,
    explanation:
      "`class` is a keyword used to define a new class. Keywords are reserved and cannot be used for identifiers like variable or function names.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What does the `//` operator do?",
    options: [
      "Regular division",
      "Floor division",
      "Creates a comment",
      "Logical OR",
    ],
    correctAnswer: 1,
    explanation:
      "The double slash (//) operator performs floor division, which divides and then rounds the result down to the nearest whole number.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What will be the output of `print(float(5))`?",
    options: ["5", "5.0", "An error will occur", "int"],
    correctAnswer: 1,
    explanation:
      "The `float()` function converts an integer into a floating-point number by adding a decimal point and a zero.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question:
      "In Python, variable names are case-sensitive. What does this mean?",
    options: [
      "You can use both uppercase and lowercase letters.",
      "Variable names must be in lowercase.",
      "Variable names must be in uppercase.",
      "The variables 'myVar' and 'myvar' are considered different.",
    ],
    correctAnswer: 3,
    explanation:
      "Case sensitivity means that the case of the letters matters. 'myVar', 'MyVar', and 'myvar' would be three distinct variables.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What is the output of `print('Hello'[1:4])`?",
    options: ["ell", "Hel", "ello", "H"],
    correctAnswer: 0,
    explanation:
      "This is string slicing. It extracts characters starting from index 1 up to (but not including) index 4.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "Which of the following is NOT a built-in function in Python?",
    options: ["print()", "len()", "main()", "type()"],
    correctAnswer: 2,
    explanation:
      "While `main` is a common name for a primary function in many languages and Python scripts, it is not a built-in function like `print`, `len`, or `type`.",
    difficulty: "intermediate",
    category: "Python Basics",
  },

  // Python Basics - Advanced
  {
    question:
      "What is the primary difference between the `is` and `==` operators?",
    options: [
      "They are identical.",
      "`==` checks for value equality, while `is` checks for object identity.",
      "`is` checks for value equality, while `==` checks for object identity.",
      "`is` is used for numbers, `==` is used for strings.",
    ],
    correctAnswer: 1,
    explanation:
      "`==` compares the values of two variables to see if they are equal. `is` checks if two variables point to the exact same object in memory.",
    difficulty: "advanced",
    category: "Python Basics",
  },
  {
    question:
      "What will be the output of the following code? `x = 10; y = 10; print(x is y)`",
    options: ["True", "False", "Maybe", "An error will occur"],
    correctAnswer: 0,
    explanation:
      "For small integers (usually from -5 to 256), Python pre-allocates them in memory. This means that variables `x` and `y` will point to the exact same integer object, so `is` returns True.",
    difficulty: "advanced",
    category: "Python Basics",
  },
  {
    question: "What is the output of `print(bool(''))`?",
    options: ["True", "False", "None", "An error will occur"],
    correctAnswer: 1,
    explanation:
      "In a boolean context, empty sequences (like an empty string '', empty list [], etc.) and zero numeric values evaluate to False. All other values evaluate to True.",
    difficulty: "advanced",
    category: "Python Basics",
  },
  {
    question: "What is the function of the `id()` function in Python?",
    options: [
      "It returns the data type of an object.",
      "It returns a unique identifier (memory address) for an object.",
      "It returns the number of elements in an object.",
      "It checks if a variable name is a Python keyword.",
    ],
    correctAnswer: 1,
    explanation:
      "The `id()` function returns a unique integer that represents the identity of an object for its lifetime. This is typically the object's memory address.",
    difficulty: "advanced",
    category: "Python Basics",
  },
  {
    question: "Which of the following creates a variable with a numeric value?",
    options: ["x = '5'", "x = 5", "x = five", "x = (5)"],
    correctAnswer: 1,
    explanation:
      "To create a numeric variable (an integer), you assign the number directly without quotes. '5' would be a string.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "What is the correct way to get the data type of a variable `x`?",
    options: ["datatype(x)", "x.type()", "typeof(x)", "type(x)"],
    correctAnswer: 3,
    explanation:
      "The built-in `type()` function is used to get the type of an object in Python.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "Which of the following is an illegal variable name in Python?",
    options: ["my_variable", "my-variable", "myVariable", "_my_variable"],
    correctAnswer: 1,
    explanation:
      "Variable names in Python cannot contain hyphens (-). They can contain letters, numbers (but not start with one), and underscores (_).",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question:
      "How can you convert a floating-point number `x = 7.8` to an integer?",
    options: ["integer(x)", "x.to_int()", "int(x)", "x.as_integer()"],
    correctAnswer: 2,
    explanation:
      "The `int()` function is used for type casting to an integer. It will truncate the decimal part, so `int(7.8)` results in 7.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "What does the `print()` function do?",
    options: [
      "It reads input from the user.",
      "It deletes a variable.",
      "It outputs data to the standard output device (screen).",
      "It calculates mathematical expressions.",
    ],
    correctAnswer: 2,
    explanation:
      "The `print()` function is a fundamental built-in function that displays text or other data on the console.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "What will the expression `True or False` evaluate to?",
    options: ["True", "False", "None", "Error"],
    correctAnswer: 0,
    explanation:
      "The `or` logical operator returns True if at least one of the conditions is true.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "Which string method converts all characters to uppercase?",
    options: ["uppercase()", "toUpper()", "upper()", "capitalize()"],
    correctAnswer: 2,
    explanation:
      "The `.upper()` method returns a copy of the string with all its characters converted to uppercase.",
    difficulty: "beginner",
    category: "Python Basics",
  },

  // Python Basics - Batch 2 - Intermediate
  {
    question: "What is the output of `print(10 // 3)`?",
    options: ["3.33", "3.0", "4", "3"],
    correctAnswer: 3,
    explanation:
      "The `//` operator performs floor division, which divides and rounds down to the nearest integer. 10 divided by 3 is 3.33..., which rounds down to 3.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question:
      "Which of the following correctly demonstrates an f-string for formatting?",
    options: [
      "f'My name is {name}'",
      "'My name is %s' % name",
      "'My name is {}'.format(name)",
      "All of the above are valid formatting methods",
    ],
    correctAnswer: 0,
    explanation:
      "An f-string, prefixed with 'f', allows you to embed expressions inside string literals directly, which is a modern and readable way of formatting strings.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What is the result of `bool(0)`?",
    options: ["True", "False", "0", "Error"],
    correctAnswer: 1,
    explanation:
      "In Python's boolean context, the number 0 (integer or float) is considered False. All other numbers are considered True.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What is the data type of the special value `None`?",
    options: ["None", "null", "object", "NoneType"],
    correctAnswer: 3,
    explanation:
      "`None` is a special constant in Python that represents the absence of a value. Its data type is `NoneType`.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What will happen if you try to run `int('hello')`?",
    options: [
      "It will return 0.",
      "It will return -1.",
      "It will raise a ValueError.",
      "It will return None.",
    ],
    correctAnswer: 2,
    explanation:
      "The `int()` function can only convert strings that represent a valid integer. 'hello' is not a valid integer, so a ValueError is raised.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "Which comparison operator means 'Not Equal To'?",
    options: ["<>", "!=", "!==", "~="],
    correctAnswer: 1,
    explanation:
      "The `!=` operator is used to check if two values are not equal. While `<>` was used in older Python 2 versions, `!=` is the standard in modern Python.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What is the output of `'   Hello   '.strip()`?",
    options: ["'   Hello   '", "'Hello'", "'Hello   '", "'   Hello'"],
    correctAnswer: 1,
    explanation:
      "The `.strip()` string method removes any leading and trailing whitespace (spaces, tabs, newlines) from a string.",
    difficulty: "intermediate",
    category: "Python Basics",
  },

  // Python Basics - Batch 2 - Advanced
  {
    question: "What is the result of `print(0.1 + 0.2 == 0.3)`?",
    options: ["True", "False", "Sometimes True", "SyntaxError"],
    correctAnswer: 1,
    explanation:
      "This evaluates to False due to floating-point precision issues. The internal binary representation of 0.1 and 0.2 doesn't sum up to exactly 0.3. The result is very close, but not equal.",
    difficulty: "advanced",
    category: "Python Basics",
  },
  {
    question: "What is the order of operations for `and`, `or`, and `not`?",
    options: [
      "and, or, not",
      "or, and, not",
      "not, and, or",
      "They have the same precedence.",
    ],
    correctAnswer: 2,
    explanation:
      "The order of precedence for logical operators is `not` (highest), followed by `and`, and then `or` (lowest).",
    difficulty: "advanced",
    category: "Python Basics",
  },
  {
    question:
      "How can you assign the same value to three variables (a, b, c) in a single line?",
    options: [
      "a, b, c = 10",
      "a = 10 and b = 10 and c = 10",
      "a = b = c = 10",
      "a=10; b=10; c=10;",
    ],
    correctAnswer: 2,
    explanation:
      "Python allows for chained assignment. `a = b = c = 10` makes all three variables point to the same value (10).",
    difficulty: "advanced",
    category: "Python Basics",
  },
  {
    question: "What is string interning in Python?",
    options: [
      "A way to encrypt strings.",
      "The process of storing only one copy of each distinct string value.",
      "A method for internationalizing strings.",
      "A way to embed variables in a string.",
    ],
    correctAnswer: 1,
    explanation:
      "String interning is a memory optimization where Python stores only one copy of each unique string. This is why `x = 'hello'; y = 'hello'; x is y` can be True.",
    difficulty: "advanced",
    category: "Python Basics",
  },
  {
    question: "What is the result of `5 + 2 * 3`?",
    options: ["21", "11", "13", "Error"],
    correctAnswer: 1,
    explanation:
      "Python follows the order of operations (PEMDAS/BODMAS). Multiplication (*) is performed before addition (+), so 2 * 3 is 6, and then 5 + 6 is 11.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "How do you get the character 'e' from the string `s = 'hello'`?",
    options: ["s[0]", "s.get(1)", "s(1)", "s[1]"],
    correctAnswer: 3,
    explanation:
      "String indexing starts at 0. The first character 'h' is at index 0, and the second character 'e' is at index 1.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question:
      "Which string method would you use to replace 'world' with 'Python' in `s = 'hello world'`?",
    options: [
      "s.change('world', 'Python')",
      "s.replace('world', 'Python')",
      "s.substitute('world', 'Python')",
      "s.switch('world', 'Python')",
    ],
    correctAnswer: 1,
    explanation:
      "The `.replace()` method returns a new string where specified values have been replaced with other specified values.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "What is the output of `print('hello\\nworld')`?",
    options: [
      "hello\\nworld",
      "helloworld",
      "hello\nworld (with a newline)",
      "An error",
    ],
    correctAnswer: 2,
    explanation:
      "`\\n` is an escape sequence that represents a newline character, causing the output to be split into two lines.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "Which is the correct way to get an integer input from the user?",
    options: [
      "age = input(int())",
      "age = int.input()",
      "age = int(input('Enter age: '))",
      "age = input('Enter age: ')",
    ],
    correctAnswer: 2,
    explanation:
      "The `input()` function reads data as a string. You must then pass that string to the `int()` function to convert it to an integer.",
    difficulty: "beginner",
    category: "Python Basics",
  },

  // Python Basics - Batch 3 - Intermediate
  {
    question: "How do you create a multi-line string in Python?",
    options: [
      "Using single quotes ''",
      'Using double quotes ""',
      "Using triple quotes ''' or \"\"\"",
      "Using the # symbol",
    ],
    correctAnswer: 2,
    explanation:
      "Triple quotes (either single or double) are used to create multi-line strings, which can span multiple lines of text.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What will `name = 'PYTHON'; print(name[1:4])` output?",
    options: ["YTH", "PYT", "YTHO", "PYTH"],
    correctAnswer: 0,
    explanation:
      "String slicing `[start:end]` extracts a portion of the string from the start index up to (but not including) the end index.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question:
      "Which of these expressions is guaranteed to be `True` if `x = 10`?",
    options: ["x == 10.0", "x is 10.0", "x > 10 and x < 10", "x != 10"],
    correctAnswer: 0,
    explanation:
      "`==` checks for value equality. The integer 10 has the same value as the float 10.0. `is` checks for identity, and an int and float are different objects.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What is the result of `'alpha' + str(10)`?",
    options: ["An error will occur", "'alpha10'", "'alpha 10'", "alpha10"],
    correctAnswer: 1,
    explanation:
      "You cannot concatenate a string and an integer directly. You must first convert the integer to a string using `str()`.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What is the concept of 'truthiness' in Python?",
    options: [
      "All values are either True or False.",
      "Every object can be evaluated in a boolean context (like in an if statement).",
      "Only boolean variables can be used in `if` statements.",
      "A special method for string validation.",
    ],
    correctAnswer: 1,
    explanation:
      "In Python, any object can be tested for truth value. Non-zero numbers and non-empty collections (strings, lists) are 'truthy', while 0, None, and empty collections are 'falsy'.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What is the output of `x = 5; x += 3; print(x)`?",
    options: ["5", "3", "8", "An error"],
    correctAnswer: 2,
    explanation:
      "`x += 3` is an augmented assignment operator, which is shorthand for `x = x + 3`. It adds 3 to the current value of x.",
    difficulty: "intermediate",
    category: "Python Basics",
  },

  // Python Basics - Batch 3 - Advanced
  {
    question: "What does this line of code do? `x, y = 10, 20`",
    options: [
      "It creates a list `[10, 20]`.",
      "It assigns `10` to `x` and `20` to `y` in a single statement.",
      "It's a syntax error.",
      "It assigns the tuple `(10, 20)` to `x` and raises an error for `y`.",
    ],
    correctAnswer: 1,
    explanation:
      "This is called tuple unpacking or multiple assignment. Python allows you to assign multiple variables from a sequence of values in one line.",
    difficulty: "advanced",
    category: "Python Basics",
  },
  {
    question:
      "What is the value of `z` after this code runs? `x = 10; y = 20; x, y = y, x; z = x`",
    options: ["10", "20", "None", "A tuple (10, 20)"],
    correctAnswer: 1,
    explanation:
      "The line `x, y = y, x` is a Pythonic way to swap the values of two variables without a temporary variable. `x` becomes 20 and `y` becomes 10. Therefore, `z` is assigned the new value of `x`, which is 20.",
    difficulty: "advanced",
    category: "Python Basics",
  },
  {
    question: "What does `print()` function return?",
    options: ["The string that was printed.", "True", "0", "None"],
    correctAnswer: 3,
    explanation:
      "Functions that perform an action but don't have an explicit value to return are said to have a side effect. The `print()` function's side effect is displaying text, but its return value is `None`.",
    difficulty: "advanced",
    category: "Python Basics",
  },

  // Python Basics - Batch 4 - Beginner
  {
    question: "Which function returns the absolute value of a number?",
    options: ["absolute()", "abs()", "val()", "positive()"],
    correctAnswer: 1,
    explanation:
      "The `abs()` built-in function returns the absolute value of a number (e.g., `abs(-5)` is 5).",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "How do you get the last character of a string `s = 'python'`?",
    options: ["s[last]", "s[len(s)]", "s[-1]", "s[len(s)-1]"],
    correctAnswer: 2,
    explanation:
      "Python supports negative indexing. -1 refers to the last element, -2 to the second to last, and so on. Both `s[-1]` and `s[len(s)-1]` work, but negative indexing is more common and concise for this.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "What is the result of `round(3.7)`?",
    options: ["3", "3.0", "4", "4.0"],
    correctAnswer: 2,
    explanation:
      "The `round()` function rounds a number to the nearest integer. Since 3.7 is closer to 4, it rounds up.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "What is the output of `bool(1)`?",
    options: ["1", "True", "False", "Error"],
    correctAnswer: 1,
    explanation: "In a boolean context, any non-zero number evaluates to True.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question:
      "Which string method checks if a string ends with a specific substring?",
    options: ["endswith()", "finisheswith()", "last()", "tail()"],
    correctAnswer: 0,
    explanation:
      "The `.endswith()` method returns True if the string ends with the specified value, otherwise it returns False.",
    difficulty: "beginner",
    category: "Python Basics",
  },

  // Python Basics - Batch 4 - Intermediate
  {
    question: "What is Python's stance on data types for variables?",
    options: [
      "Statically Typed: You must declare the variable's type.",
      "Dynamically Typed: The type is determined at runtime based on the assigned value.",
      "Untyped: Variables have no type.",
      "Strongly Typed: You cannot change a variable's type after assignment.",
    ],
    correctAnswer: 1,
    explanation:
      "Python is dynamically typed, meaning you don't have to declare the data type of a variable. The interpreter figures it out when the code is executed.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What will `print('A', 'B', 'C', sep='-')` output?",
    options: ["A B C", "ABC", "A-B-C", "['A', 'B', 'C']"],
    correctAnswer: 2,
    explanation:
      "The `sep` parameter of the `print` function specifies the separator to be used between the arguments. By default, it's a space.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What is the output of `print('Python'[::-1])`?",
    options: ["Python", "nohtyP", "P", "n"],
    correctAnswer: 1,
    explanation:
      "This is slice notation with a step of -1. It's a common and concise idiom for reversing a string in Python.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "Which expression checks if 'app' is a substring of 'applepie'?",
    options: [
      "'app' in 'applepie'",
      "'applepie'.contains('app')",
      "'applepie'.find('app') != -1",
      "Both A and C are correct ways",
    ],
    correctAnswer: 3,
    explanation:
      "The `in` operator is the most Pythonic way to check for substring existence. The `.find()` method is another way; it returns -1 if the substring is not found.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question:
      "What is the difference between `round(2.5)` and `round(3.5)` in Python 3?",
    options: [
      "Both round to 3.",
      "They round to 2 and 4 respectively.",
      "They round to 3 and 3 respectively.",
      "Both round to the nearest even number (2 and 4).",
    ],
    correctAnswer: 3,
    explanation:
      "Python 3 uses 'round half to even' (also known as banker's rounding). Numbers ending in .5 are rounded to the nearest even integer. Thus, 2.5 rounds to 2, and 3.5 rounds to 4.",
    difficulty: "advanced",
    category: "Python Basics",
  },

  // Python Basics - Batch 4 - Advanced
  {
    question: "Why might `a = 257; b = 257; print(a is b)` output `False`?",
    options: [
      "Because 257 is not a valid integer.",
      "It will always be True.",
      "Because Python only caches small integers (usually -5 to 256).",
      "Because `is` cannot be used on integers.",
    ],
    correctAnswer: 2,
    explanation:
      "For memory optimization, Python pre-allocates and reuses small integer objects. 257 is typically outside this cached range, so Python may create two separate objects in memory for `a` and `b`.",
    difficulty: "advanced",
    category: "Python Basics",
  },
  {
    question:
      "What is the primary purpose of using underscores in numeric literals, like `1_000_000`?",
    options: [
      "It converts the number to a string.",
      "It's a syntax error.",
      "It improves readability for large numbers.",
      "It creates a special type of number.",
    ],
    correctAnswer: 2,
    explanation:
      "Introduced in Python 3.6, underscores can be used as visual separators in numeric literals to improve readability. The interpreter simply ignores them.",
    difficulty: "advanced",
    category: "Python Basics",
  },
  {
    question: "What is the output of `not 'Hello'`?",
    options: ["True", "False", "Error", "None"],
    correctAnswer: 1,
    explanation:
      "The string 'Hello' is a non-empty sequence, so its truthiness value is True. The `not` operator negates this, resulting in False.",
    difficulty: "advanced",
    category: "Python Basics",
  },
  {
    question:
      "What is the output of `print('hello', end='')` followed by `print('world')`?",
    options: ["helloworld", "hello world", "hello\nworld", "hello"],
    correctAnswer: 0,
    explanation:
      "The `end` parameter of the `print` function specifies what to print at the end. By default, it's a newline (`\\n`). Setting it to an empty string `''` prevents the cursor from moving to the next line, so the next print statement continues on the same line.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "Which of the following variable names is invalid in Python?",
    options: ["_age", "Age", "age1", "1age"],
    correctAnswer: 3,
    explanation:
      "Variable names in Python cannot begin with a number. They must start with a letter (a-z, A-Z) or an underscore (_).",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "What does the `isinstance()` function do?",
    options: [
      "Checks if two variables are the same instance.",
      "Checks if an object is an instance of a specific class or type.",
      "Creates a new instance of a class.",
      "Returns the memory address of an instance.",
    ],
    correctAnswer: 1,
    explanation:
      "`isinstance(object, classinfo)` returns True if the object argument is an instance of the classinfo argument, or of a (direct, indirect, or virtual) subclass thereof.",
    difficulty: "beginner",
    category: "Python Basics",
  },

  // Python Basics - Final Batch - Intermediate
  {
    question:
      "What does it mean for a data type, like a string, to be 'immutable'?",
    options: [
      "It cannot be used in calculations.",
      "It cannot be deleted once created.",
      "Its value cannot be changed after it is created.",
      "It must be defined with a constant keyword.",
    ],
    correctAnswer: 2,
    explanation:
      "Immutability means that once an object is created, its state cannot be modified. For a string, you cannot change a character within it; you must create a new string instead.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What is the output of `print('Py' * -2)`?",
    options: ["yP", "PyPy", "An empty string", "A ValueError or TypeError"],
    correctAnswer: 2,
    explanation:
      "When you multiply a sequence (like a string or list) by 0 or a negative number, the result is an empty sequence of the same type.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question:
      "How can you write a single logical line of code that spans multiple physical lines?",
    options: [
      "Using a semicolon (;)",
      "Using an ampersand (&)",
      "Using a backslash (\\) at the end of the line",
      "It's not possible.",
    ],
    correctAnswer: 2,
    explanation:
      "A backslash `\\` at the end of a line acts as a line continuation character, telling the Python interpreter that the statement continues on the next line.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What is the result of `'abc' < 'abd'`?",
    options: ["True", "False", "TypeError", "It depends on the system."],
    correctAnswer: 0,
    explanation:
      "Strings are compared lexicographically (like in a dictionary). Python compares characters one by one. 'a' is the same, 'b' is the same, but 'c' comes before 'd', so the expression is True.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question:
      "What is the output of `message = 'hi'; message = message + ' there'; print(message)`?",
    options: [
      "'hi'",
      "'hi there'",
      "An error because strings are immutable",
      "None",
    ],
    correctAnswer: 1,
    explanation:
      "While strings are immutable, this code doesn't modify the original 'hi' string. Instead, it creates a new string 'hi there' and reassigns the `message` variable to point to this new string.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What is a Python 'expression'?",
    options: [
      "Any line of code.",
      "A piece of code that produces a value.",
      "A piece of code that performs an action.",
      "Only mathematical formulas.",
    ],
    correctAnswer: 1,
    explanation:
      "An expression is a combination of values, variables, and operators that evaluates to a single value (e.g., `2 + 2` or `x > 5`). A statement performs an action (e.g., `x = 5` or `print(x)`).",
    difficulty: "intermediate",
    category: "Python Basics",
  },

  // Python Basics - Final Batch - Advanced
  {
    question: "What will `x = 5; print(1 < x < 10)` output?",
    options: ["True", "False", "SyntaxError", "It will only evaluate `1 < x`."],
    correctAnswer: 0,
    explanation:
      "Python supports chained comparisons. This expression is a more readable shorthand for `(1 < x) and (x < 10)`. Since both conditions are true for x=5, the result is True.",
    difficulty: "advanced",
    category: "Python Basics",
  },
  {
    question: "What happens when you execute `print('a' * 'b')`?",
    options: ["'ab'", "'ba'", "An empty string", "A TypeError"],
    correctAnswer: 3,
    explanation:
      "The multiplication operator for strings requires an integer as the multiplier to specify the number of repetitions. You cannot multiply a string by another string, which results in a TypeError.",
    difficulty: "advanced",
    category: "Python Basics",
  },
  {
    question: "If `s = 'abcde'`, which slice produces `'ace'`?",
    options: ["s[1:5:2]", "s[0:5:2]", "s[0:4:2]", "s[1:4:2]"],
    correctAnswer: 1,
    explanation:
      "The slice notation `[start:stop:step]` allows a third argument for the step. `s[0:5:2]` means start at index 0, go up to (but not including) index 5, and take every 2nd character.",
    difficulty: "advanced",
    category: "Python Basics",
  },
  {
    question:
      "Which function takes two numbers as arguments and returns a tuple containing their quotient and remainder?",
    options: ["quotient_remainder()", "qr()", "math.divide()", "divmod()"],
    correctAnswer: 3,
    explanation:
      "`divmod(a, b)` is a built-in function that is equivalent to `(a // b, a % b)`, returning both the floor division result and the modulo result in a tuple.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question:
      "In the expression `True or some_function()`, what can be said about `some_function()`?",
    options: [
      "It will always be executed.",
      "It will never be executed.",
      "It will be executed only if it returns False.",
      "It will raise a syntax error.",
    ],
    correctAnswer: 1,
    explanation:
      "This demonstrates 'short-circuiting'. The `or` operator stops evaluating as soon as it finds a True value. Since the first operand is `True`, the second operand (`some_function()`) is never reached or executed.",
    difficulty: "advanced",
    category: "Python Basics",
  },
  {
    question:
      "What is the key difference between the string methods `.find()` and `.index()`?",
    options: [
      "There is no difference.",
      "`.find()` is faster than `.index()`.",
      "`.index()` raises a ValueError if the substring is not found, while `.find()` returns -1.",
      "`.find()` raises a ValueError if the substring is not found, while `.index()` returns -1.",
    ],
    correctAnswer: 2,
    explanation:
      "Both methods search for a substring, but they handle failure differently. `.find()` is 'safer' if you're not sure the substring exists, whereas `.index()` is used when you expect the substring to be present.",
    difficulty: "advanced",
    category: "Python Basics",
  },
  {
    question:
      "How do you represent the number 10 as a hexadecimal literal in Python?",
    options: ["10h", "hex(10)", "0x0A", "&H10"],
    correctAnswer: 2,
    explanation:
      "Hexadecimal literals in Python are prefixed with `0x`. The hexadecimal value for the decimal number 10 is A.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What is the output of `x = 5; y = x; y = 10; print(x)`?",
    options: ["10", "5", "None", "A memory address"],
    correctAnswer: 1,
    explanation:
      "This demonstrates that integers are immutable. When `y = 10` is executed, `y` is pointed to a new integer object (10). The original variable `x` is unaffected and still points to the integer object 5.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What does the string method `.isdigit()` check for?",
    options: [
      "If the string contains only numbers.",
      "If the string contains only digits (0-9).",
      "If the string can be converted to any number type, including float.",
      "If the string is a valid variable name.",
    ],
    correctAnswer: 1,
    explanation:
      "The `.isdigit()` method returns True if all characters in the string are digits and there is at least one character, False otherwise. It does not handle decimals or negative signs.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question:
      "Which of these is the PEP 8 recommended way to check if a variable `my_var` is None?",
    options: [
      "if my_var == None:",
      "if my_var is None:",
      "if not my_var:",
      "if my_var.is_none():",
    ],
    correctAnswer: 1,
    explanation:
      "PEP 8 style guide recommends using `is` or `is not` for identity checks with singletons like `None`, `True`, and `False`. `is` is faster and safer for this purpose.",
    difficulty: "advanced",
    category: "Python Basics",
  },
  {
    question: "What will `print(f'{10/3:.2f}')` output?",
    options: ["3.333", "3.3", "3.33", "3"],
    correctAnswer: 2,
    explanation:
      "This is an f-string with format specification. `:.2f` tells Python to format the number as a floating-point number with exactly two digits after the decimal point.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question:
      'What happens when you run this code? `my_string = "hello"; my_string[0] = "H"`',
    options: [
      'The string becomes "Hello".',
      "It does nothing.",
      "It raises an IndexError.",
      "It raises a TypeError.",
    ],
    correctAnswer: 3,
    explanation:
      "This demonstrates that strings are immutable. You cannot change a part of a string in-place (item assignment). This action results in a TypeError.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What is the value of `bool([])`?",
    options: ["True", "False", "None", "Error"],
    correctAnswer: 1,
    explanation:
      "In a boolean context, any empty collection or sequence (empty list, tuple, string, dictionary, etc.) evaluates to False.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "What is the purpose of the underscore `_` in `x, _ = (10, 20)`?",
    options: [
      "It's a syntax error.",
      "It's a convention for a 'throwaway' variable whose value we don't care about.",
      "It makes the variable `_` private.",
      "It converts the value to an integer.",
    ],
    correctAnswer: 1,
    explanation:
      "By convention, `_` is used as a variable name when you need to unpack a value but have no intention of using it later in the code.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question:
      "How do you represent the number 5 as a binary literal in Python?",
    options: ["0b101", "bin(5)", "0x5", "5b"],
    correctAnswer: 0,
    explanation:
      "Binary literals in Python are prefixed with `0b`. The binary representation of the decimal number 5 is 101.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "Which of the following expressions is False?",
    options: [
      "`'test'.isalpha()`",
      "`'123'.isdigit()`",
      "`'Test1'.isalnum()`",
      "`'Test 1'.isalnum()`",
    ],
    correctAnswer: 3,
    explanation:
      "`.isalnum()` returns True only if all characters are alphanumeric (letters or numbers). Since 'Test 1' contains a space, it is not purely alphanumeric.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What is the `pow(2, 3)` function equivalent to?",
    options: ["2 * 3", "2 + 3", "2 / 3", "2 ** 3"],
    correctAnswer: 3,
    explanation:
      "The built-in `pow(base, exp)` function is an alternative way to perform exponentiation, equivalent to the `**` operator.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "What does it mean that Python is a 'strongly typed' language?",
    options: [
      "You must declare a variable's type before use.",
      "An object's type cannot be changed.",
      "Operations are strict about types; you can't add a string to an integer without explicit conversion.",
      "Variables are stored in a very secure way.",
    ],
    correctAnswer: 2,
    explanation:
      "Strong typing means that the type of an object matters, and Python won't implicitly convert between unrelated types in operations (e.g., `5 + 'a'` will raise a TypeError).",
    difficulty: "advanced",
    category: "Python Basics",
  },
  {
    question: "What is the primary role of the `.capitalize()` string method?",
    options: [
      "It makes the entire string uppercase.",
      "It makes the first character of the string uppercase and the rest lowercase.",
      "It makes the first character of every word uppercase.",
      "It makes the entire string lowercase.",
    ],
    correctAnswer: 1,
    explanation:
      "`.capitalize()` is useful for formatting sentences, as it ensures the string starts with a capital letter and the remaining characters are lowercase.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question: "What is the output of `id('hello') == id('hello')`?",
    options: ["True", "False", "SyntaxError", "It varies."],
    correctAnswer: 0,
    explanation:
      "Due to string interning, Python often stores only one copy of a literal string. The `id()` function gets the memory address of this single object, so calling it on the same literal string twice will yield the same ID.",
    difficulty: "advanced",
    category: "Python Basics",
  },
  {
    question: "What does the `.isspace()` method check?",
    options: [
      "If the string contains any whitespace characters.",
      "If the string contains only whitespace characters.",
      "If the string is empty.",
      "If the string contains a space character.",
    ],
    correctAnswer: 1,
    explanation:
      "`.isspace()` returns True only if all characters in the string are whitespace (e.g., space, tab, newline) and the string is not empty.",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question:
      "Which of the following is an 'expression' and not a 'statement'?",
    options: ["`x = 5`", "`print('hello')`", "`5 + x`", "`if x == 5: pass`"],
    correctAnswer: 2,
    explanation:
      "An expression is a piece of code that evaluates to a value. `5 + x` produces a value. The others are statements that perform an action (assignment, printing, conditional logic).",
    difficulty: "intermediate",
    category: "Python Basics",
  },
  {
    question: "What will `print(1, 2, 3, sep='-')` output?",
    options: ["1 2 3 -", "1-2-3", "1, 2, 3, sep='-'", "Error"],
    correctAnswer: 1,
    explanation:
      "The `sep` argument in the `print` function defines the separator to be placed between the items. Here, it separates the numbers 1, 2, and 3 with a hyphen.",
    difficulty: "beginner",
    category: "Python Basics",
  },
  {
    question:
      "In `False and some_function()`, the function `some_function()`...",
    options: [
      "Will always be executed.",
      "Will never be executed.",
      "Will be executed only if it returns True.",
      "Will raise a syntax error.",
    ],
    correctAnswer: 1,
    explanation:
      "The `and` operator also uses short-circuiting. It stops evaluating as soon as it finds a False value. Since the first operand is `False`, the result must be False, and the second operand is never executed.",
    difficulty: "advanced",
    category: "Python Basics",
  },
];
