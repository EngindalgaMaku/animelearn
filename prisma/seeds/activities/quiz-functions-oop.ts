import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Quiz Activities for Functions & OOP
 * 10 high-quality quizzes with increasing difficulty and full explanations
 * Category: "Functions & OOP"
 *
 * Reward guideline (from docs):
 * - Diamonds ≈ difficulty * 10 (tuned slightly)
 * - Experience ≈ difficulty * 20 (tuned slightly)
 */

export const quizFunctionsOOPActivities = [
  // 1) Difficulty 1 - Functions Basics
  {
    title: "Functions Basics: Definitions and Calls",
    description:
      "Test your understanding of Python function definitions, calls, and basics",
    activityType: "quiz",
    category: "Functions & OOP",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 28,
    estimatedMinutes: 10,
    tags: ["functions", "basics", "def", "call", "parameters"],
    content: {
      instructions:
        "Answer these questions about basic Python functions and how to define and call them.",
      questions: [
        {
          id: 1,
          question: "Which keyword is used to define a function in Python?",
          options: ["func", "def", "function", "lambda"],
          correct: 1,
          explanation:
            "Functions are defined with the def keyword followed by the function name and parameters.",
        },
        {
          id: 2,
          question:
            "What is the correct way to call a function named greet with no parameters?",
          options: ["call greet", "greet[]", "greet()", "run(greet)"],
          correct: 2,
          explanation: "You call a function by using parentheses: greet().",
        },
        {
          id: 3,
          question:
            "What is the difference between a parameter and an argument?",
          options: [
            "They are exactly the same",
            "Parameter is the value; argument is the name",
            "Parameter is the variable in the function definition; argument is the value passed during call",
            "Argument is only used for default values",
          ],
          correct: 2,
          explanation:
            "Parameters are the names listed in the function definition; arguments are the actual values supplied when calling.",
        },
        {
          id: 4,
          question:
            "What does a function return if there is no return statement?",
          options: ["0", "False", "None", "Empty string"],
          correct: 2,
          explanation:
            "If a function has no return statement, it implicitly returns None.",
        },
        {
          id: 5,
          question:
            "Which of the following is a valid function name in Python?",
          options: ["1stFunction", "my-function", "myFunction", "def"],
          correct: 2,
          explanation:
            "Identifiers must start with a letter or underscore and contain only letters, digits, and underscores.",
        },
        {
          id: 6,
          question:
            "Where do you place documentation for a function’s behavior following best practice?",
          options: [
            "As a comment before the def line",
            "In a triple-quoted string as the first statement in the function",
            "In an external README only",
            "Inside the return statement",
          ],
          correct: 1,
          explanation:
            "Use a docstring: a triple-quoted string as the first statement inside the function.",
        },
      ],
      timeLimit: 360,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 70,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Difficulty 1 - Parameters & Defaults
  {
    title: "Function Parameters and Default Values",
    description:
      "Assess your knowledge of positional, keyword, and default parameters",
    activityType: "quiz",
    category: "Functions & OOP",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 28,
    estimatedMinutes: 11,
    tags: ["functions", "parameters", "defaults", "positional", "keyword"],
    content: {
      instructions:
        "Answer questions about parameter kinds and default argument behavior.",
      questions: [
        {
          id: 1,
          question: "Which call is valid for def add(a, b=10)?",
          options: ["add()", "add(5)", "add(a=5, 3)", "add(5, b=7)"],
          correct: 3,
          explanation:
            "You need at least 'a'. 'add(5)' is valid too (uses default b=10); keyword usage add(5, b=7) also valid.",
        },
        {
          id: 2,
          question:
            "What is a recommended practice for default argument values that are mutable (like lists)?",
          options: [
            "Use a mutable default directly",
            "Use None as the default and create the list inside the function",
            "Avoid defaults entirely",
            "Use a global variable",
          ],
          correct: 1,
          explanation:
            "Use None and create a new list inside to avoid sharing the same list across calls.",
        },
        {
          id: 3,
          question: "In def f(x, y=2): what is x in terms of parameter kind?",
          options: [
            "Keyword-only",
            "Positional-only",
            "Positional-or-keyword",
            "Var-positional",
          ],
          correct: 2,
          explanation:
            "By default, x can be passed positionally or by keyword unless restricted by special syntax.",
        },
        {
          id: 4,
          question:
            "Which call is invalid for def greet(name, *, punctuation='!')?",
          options: [
            "greet('Alice')",
            "greet('Alice', punctuation='.')",
            "greet(name='Bob', punctuation='!')",
            "greet('Alice', '.')",
          ],
          correct: 3,
          explanation:
            "Parameters after * are keyword-only; 'greet('Alice', '.')' attempts to pass punctuation positionally which is invalid.",
        },
        {
          id: 5,
          question: "What does def f(*args) collect during a call?",
          options: [
            "All keyword arguments into a dict",
            "All positional arguments into a tuple",
            "Only the first positional argument",
            "All arguments into a list",
          ],
          correct: 1,
          explanation:
            "*args packs all extra positional arguments into a tuple.",
        },
        {
          id: 6,
          question: "What does def f(**kwargs) collect during a call?",
          options: [
            "All keyword arguments into a dict",
            "All positional arguments into a tuple",
            "Nothing unless defaults are provided",
            "Only positional arguments",
          ],
          correct: 0,
          explanation:
            "**kwargs packs extra keyword arguments into a dictionary.",
        },
      ],
      timeLimit: 420,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 70,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3) Difficulty 2 - Return Values & None
  {
    title: "Return Values, None, and Multiple Returns",
    description:
      "Understand return semantics, implicit None, and returning multiple values",
    activityType: "quiz",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 44,
    estimatedMinutes: 12,
    tags: ["functions", "return", "tuple", "none"],
    content: {
      instructions:
        "Answer questions about return behaviors, multiple return values, and None.",
      questions: [
        {
          id: 1,
          question:
            "What is the type of a function that ends without a return statement?",
          options: ["NoneType", "bool", "int", "str"],
          correct: 0,
          explanation:
            "A function without a return returns None, which is of type NoneType.",
        },
        {
          id: 2,
          question: "What is returned by: def f(): return 1, 2?",
          options: [
            "Two separate values that cannot be captured",
            "A list [1, 2]",
            "A tuple (1, 2)",
            "An iterator",
          ],
          correct: 2,
          explanation:
            "Multiple return values are returned as a tuple in Python.",
        },
        {
          id: 3,
          question: "Which is true about return in a function?",
          options: [
            "Only the first return encountered executes; rest is unreachable",
            "All return statements execute in sequence",
            "return only works at end of function",
            "return must return a value",
          ],
          correct: 0,
          explanation:
            "When a return executes, the function exits immediately; later code is not executed.",
        },
        {
          id: 4,
          question:
            "Given x = f() where def f(): pass, what does x == None evaluate to?",
          options: [
            "True",
            "False",
            "Raises an exception",
            "Depends on Python version",
          ],
          correct: 0,
          explanation:
            "f() returns None implicitly; x == None evaluates to True (though 'is None' is preferred).",
        },
        {
          id: 5,
          question: "Which is the most Pythonic way to check for None?",
          options: ["x == None", "x is None", "x === None", "None in x"],
          correct: 1,
          explanation:
            "Use 'is None' to test identity with the singleton None.",
        },
        {
          id: 6,
          question: "Which of the following correctly unpacks a tuple return?",
          options: [
            "a, b = func_returning_tuple()",
            "[a, b] = func_returning_tuple()",
            "a = func_returning_tuple()[2]",
            "a: b = func_returning_tuple()",
          ],
          correct: 0,
          explanation:
            "Assuming the function returns a 2-tuple, a, b = tuple is standard unpacking.",
        },
      ],
      timeLimit: 480,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 75,
    },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Difficulty 3 - Scope & LEGB
  {
    title: "Variable Scope and the LEGB Rule",
    description:
      "Evaluate your understanding of local, enclosing, global, and built-in scopes",
    activityType: "quiz",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 15,
    tags: ["functions", "scope", "LEGB", "global", "nonlocal"],
    content: {
      instructions:
        "Answer questions focusing on Python's LEGB scoping, global, and nonlocal.",
      questions: [
        {
          id: 1,
          question: "What does LEGB stand for in Python scoping?",
          options: [
            "Local, Environment, Global, Built-in",
            "Local, Enclosing, Global, Built-in",
            "Local, Enclosing, Global, Base",
            "Lexical, External, Global, Built-in",
          ],
          correct: 1,
          explanation:
            "LEGB: Local, Enclosing (in nested functions), Global, Built-in.",
        },
        {
          id: 2,
          question:
            "What is the effect of the global keyword inside a function?",
          options: [
            "Creates a new global variable unrelated to existing names",
            "Refers to a module-level variable, allowing assignment to it",
            "Converts local to built-in scope",
            "Forces the function to return global variables",
          ],
          correct: 1,
          explanation:
            "global tells Python assignments refer to a module-level name rather than creating a local.",
        },
        {
          id: 3,
          question: "What does nonlocal do in nested functions?",
          options: [
            "Binds a name to built-in scope",
            "Creates a global variable with the same name",
            "Refers to the nearest enclosing function scope (not global) for assignment",
            "Has no effect in Python 3",
          ],
          correct: 2,
          explanation:
            "nonlocal allows assignment to a variable in the nearest enclosing (non-global) scope.",
        },
        {
          id: 4,
          question:
            "Which search order is used for resolving a name inside a nested function?",
          options: [
            "Global → Local → Built-in",
            "Local → Enclosing → Global → Built-in",
            "Built-in → Global → Enclosing → Local",
            "Local → Global → Enclosing → Built-in",
          ],
          correct: 1,
          explanation:
            "Python uses Local → Enclosing → Global → Built-in (LEGB).",
        },
        {
          id: 5,
          question: "Which statement about locals() and globals() is correct?",
          options: [
            "globals() returns a dict of built-in names",
            "locals() always equals globals()",
            "globals() returns module namespace; locals() varies with context (function, class, etc.)",
            "Both always return copies that cannot change state",
          ],
          correct: 2,
          explanation:
            "globals() refers to module namespace. locals() depends on where it's called.",
        },
        {
          id: 6,
          question:
            "Inside a function, assigning to a name without global/nonlocal does what?",
          options: [
            "Creates/overwrites a global name",
            "Creates a new local variable by default",
            "Creates a built-in name",
            "Raises UnboundLocalError always",
          ],
          correct: 1,
          explanation:
            "Assignment makes the name local unless declared global/nonlocal. Accessing before assignment can cause UnboundLocalError.",
        },
      ],
      timeLimit: 540,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 75,
    },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Difficulty 3 - Lambda & Higher-Order
  {
    title: "Lambda Expressions and Higher-Order Functions",
    description:
      "Test knowledge of lambda functions, map/filter/sorted, and function objects",
    activityType: "quiz",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 15,
    tags: [
      "lambda",
      "higher-order",
      "map",
      "filter",
      "sorted",
      "functions-as-values",
    ],
    content: {
      instructions:
        "Answer questions about lambda expressions and functions that take/return functions.",
      questions: [
        {
          id: 1,
          question: "Which is a valid lambda that returns the square of x?",
          options: [
            "lambda x: x ** 2",
            "lambda: x * x",
            "lambda(x) { return x**2 }",
            "(x) => x**2",
          ],
          correct: 0,
          explanation:
            "Python's lambda syntax: lambda parameters: expression. Only simple expressions allowed.",
        },
        {
          id: 2,
          question:
            "What does map(lambda x: x+1, [1,2,3]) produce when converted to list?",
          options: ["[1,2,3]", "[2,3,4]", "[0,1,2]", "[1,3,5]"],
          correct: 1,
          explanation: "Each element is incremented by 1 → [2,3,4].",
        },
        {
          id: 3,
          question:
            "Which expression sorts a list of tuples by second element?",
          options: [
            "sorted(items, key=lambda x: x[1])",
            "sorted(items, by=1)",
            "items.sort(1)",
            "sorted(items).by(1)",
          ],
          correct: 0,
          explanation: "Use key to provide a function extracting the sort key.",
        },
        {
          id: 4,
          question: "What does filter(lambda x: x%2==0, data) do?",
          options: [
            "Removes all even numbers",
            "Keeps only even numbers",
            "Squares even numbers",
            "Sorts even numbers",
          ],
          correct: 1,
          explanation:
            "filter keeps elements for which the predicate is True; here, even numbers.",
        },
        {
          id: 5,
          question: "Which statement is true about lambda?",
          options: [
            "lambda can contain statements like return and if",
            "lambda is limited to expressions (no statements)",
            "lambda must be named",
            "lambda is faster than def by definition",
          ],
          correct: 1,
          explanation:
            "lambda can only contain expressions; no statements such as return.",
        },
        {
          id: 6,
          question: "Functions are first-class objects in Python. This means:",
          options: [
            "They cannot be passed to other functions",
            "They cannot be returned",
            "They can be assigned to variables, passed, and returned",
            "They are only defined at top-level",
          ],
          correct: 2,
          explanation:
            "First-class means functions can be stored, passed, and returned like any object.",
        },
      ],
      timeLimit: 540,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 75,
    },
    isActive: true,
    sortOrder: 5,
  },

  // 6) Difficulty 4 - Closures & Decorators (Basics)
  {
    title: "Closures and Decorators Basics",
    description:
      "Understand how closures capture state and how decorators wrap functions",
    activityType: "quiz",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 80,
    estimatedMinutes: 18,
    tags: ["closures", "decorators", "enclosing", "wrappers", "nonlocal"],
    content: {
      instructions:
        "Answer questions about closures (capturing enclosing state) and decorator basics.",
      questions: [
        {
          id: 1,
          question: "What is a closure?",
          options: [
            "Any function defined inside another function",
            "A function object that captures variables from its enclosing scope",
            "A class that defines __call__",
            "A module-level function",
          ],
          correct: 1,
          explanation:
            "A closure retains bindings to variables from its lexical enclosing context.",
        },
        {
          id: 2,
          question:
            "Which decorator preserves metadata (like __name__, __doc__) of the wrapped function?",
          options: [
            "functools.cache",
            "functools.wraps",
            "functools.lru_cache",
            "functools.partial",
          ],
          correct: 1,
          explanation:
            "functools.wraps should be used inside custom decorators to preserve metadata.",
        },
        {
          id: 3,
          question: "Which is TRUE about using nonlocal inside a closure?",
          options: [
            "It binds the name to global scope",
            "It allows reassigning a variable from the nearest enclosing scope",
            "It creates a new local variable",
            "It only works in Python 2",
          ],
          correct: 1,
          explanation:
            "nonlocal targets the nearest enclosing function scope, enabling reassignment there.",
        },
        {
          id: 4,
          question: "Which snippet applies a decorator correctly?",
          options: [
            "@my_decorator\ndef f(): pass",
            "def f(): pass\nmy_decorator(f)()",
            "f = @my_decorator(f)",
            "def f(): pass\nf = my_decorator(f)",
          ],
          correct: 0,
          explanation:
            "Using @decorator above def is the syntactic sugar; assigning f = my_decorator(f) also works but not with @ inline.",
        },
        {
          id: 5,
          question: "What does a decorator typically accept and return?",
          options: [
            "Accepts a class and returns a method",
            "Accepts a function and returns a new function (wrapper)",
            "Accepts a module and returns a function",
            "Accepts arguments only",
          ],
          correct: 1,
          explanation:
            "Decorators usually take a function and return a wrapped function with extended behavior.",
        },
        {
          id: 6,
          question:
            "What problem can arise from capturing a mutable default in a closure or decorator?",
          options: [
            "No problem; defaults are reset every call",
            "Shared state across calls/instances unexpectedly",
            "SyntaxError at runtime",
            "Decorators cannot capture defaults",
          ],
          correct: 1,
          explanation:
            "Mutable defaults are created once at definition time and can cause shared, unintended state.",
        },
      ],
      timeLimit: 660,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 80,
    },
    isActive: true,
    sortOrder: 6,
  },

  // 7) Difficulty 3 - Recursion Fundamentals
  {
    title: "Recursion Fundamentals",
    description:
      "Evaluate base cases, recursive step design, and stack behavior",
    activityType: "quiz",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 15,
    tags: ["recursion", "base-case", "call-stack", "functions"],
    content: {
      instructions:
        "Answer questions about identifying base cases and designing recursive solutions.",
      questions: [
        {
          id: 1,
          question: "Which is essential for a correct recursive function?",
          options: [
            "A default argument",
            "A base case that terminates recursion",
            "Use of global variables",
            "lambda expressions",
          ],
          correct: 1,
          explanation:
            "A base case ensures termination; without it recursion can be infinite.",
        },
        {
          id: 2,
          question: "What typically happens if a recursion lacks a base case?",
          options: [
            "The function returns None immediately",
            "A SyntaxError is raised",
            "A RecursionError may be raised due to exceeding the recursion limit",
            "Python optimizes it to a loop automatically",
          ],
          correct: 2,
          explanation:
            "Python has a recursion limit; infinite recursion eventually raises RecursionError.",
        },
        {
          id: 3,
          question:
            "Which function is a correct recursive factorial implementation?",
          options: [
            "def fact(n): return n * fact(n)",
            "def fact(n): return 1 if n == 0 else n * fact(n-1)",
            "def fact(n): return n if n == 0 else n * fact(n-1)",
            "def fact(n): return n * (n-1)",
          ],
          correct: 1,
          explanation:
            "Base case at n==0 returns 1; otherwise multiply n by fact(n-1).",
        },
        {
          id: 4,
          question: "Which is TRUE about recursion vs iteration in Python?",
          options: [
            "Recursion is always faster",
            "Iteration is always faster",
            "It depends on the problem and implementation; Python lacks tail-call optimization",
            "Python performs tail-call optimization automatically",
          ],
          correct: 2,
          explanation:
            "Performance depends. Python does not do tail-call optimization, limiting deep recursion.",
        },
        {
          id: 5,
          question: "What does the call stack track during recursion?",
          options: [
            "Only return values",
            "Function frames with parameters and local variables",
            "Only global variables",
            "Only base cases",
          ],
          correct: 1,
          explanation:
            "Each call adds a frame containing locals/parameters until unwound.",
        },
        {
          id: 6,
          question:
            "Which is generally a good strategy when converting a recursive algorithm to iterative?",
          options: [
            "Use global to store a stack",
            "Use an explicit stack/queue data structure to simulate recursion",
            "Always use while True",
            "It is impossible",
          ],
          correct: 1,
          explanation:
            "An explicit stack/queue often replicates the recursive control flow.",
        },
      ],
      timeLimit: 600,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 75,
    },
    isActive: true,
    sortOrder: 7,
  },

  // 8) Difficulty 2 - OOP Basics: Classes & Objects
  {
    title: "OOP Basics: Classes and Objects",
    description:
      "Test your understanding of class definitions, instances, and attributes",
    activityType: "quiz",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 44,
    estimatedMinutes: 12,
    tags: ["oop", "classes", "objects", "attributes", "init"],
    content: {
      instructions:
        "Answer questions about creating classes, constructing objects, and accessing attributes.",
      questions: [
        {
          id: 1,
          question:
            "Which method initializes a new object’s state when an instance is created?",
          options: ["__new__", "__init__", "__repr__", "__call__"],
          correct: 1,
          explanation:
            "__init__ initializes instance attributes after the object is created by __new__.",
        },
        {
          id: 2,
          question: "Given class A: pass, what creates an instance?",
          options: ["A()", "A.create()", "new A", "A.__call__() only"],
          correct: 0,
          explanation: "Call the class like a function: instance = A().",
        },
        {
          id: 3,
          question: "Which is a class attribute vs. an instance attribute?",
          options: [
            "self.name is class attribute",
            "A.name defined at class level (outside methods) is a class attribute",
            "Attributes inside __init__ are class attributes",
            "There is no difference",
          ],
          correct: 1,
          explanation:
            "Attributes assigned directly in the class body are class attributes; those set via self in __init__ are instance attributes.",
        },
        {
          id: 4,
          question:
            "What is the first parameter name convention for instance methods?",
          options: ["this", "self", "cls", "obj"],
          correct: 1,
          explanation: "By convention it is self, referring to the instance.",
        },
        {
          id: 5,
          question: "What does __repr__ typically return?",
          options: [
            "A user-friendly representation",
            "A developer-oriented, unambiguous string representation",
            "A JSON string",
            "Nothing; __repr__ should not return",
          ],
          correct: 1,
          explanation:
            "__repr__ should return an unambiguous string useful for debugging.",
        },
        {
          id: 6,
          question: "Which statement correctly accesses an instance attribute?",
          options: [
            "A.value",
            "self.value outside of a method",
            "obj.value",
            "value(obj)",
          ],
          correct: 2,
          explanation:
            "Use obj.value to access the attribute on an instance named obj.",
        },
      ],
      timeLimit: 480,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 70,
    },
    isActive: true,
    sortOrder: 8,
  },

  // 9) Difficulty 3 - Methods, @classmethod, @staticmethod, Properties
  {
    title: "Instance vs Class Methods, Static Methods, and Properties",
    description:
      "Differentiate instance/class/static methods and use @property effectively",
    activityType: "quiz",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 16,
    tags: ["oop", "classmethod", "staticmethod", "property", "descriptor"],
    content: {
      instructions:
        "Answer questions about method types in Python OOP and the @property descriptor.",
      questions: [
        {
          id: 1,
          question:
            "What is the first parameter of a @classmethod by convention?",
          options: ["self", "cls", "klass", "class"],
          correct: 1,
          explanation:
            "@classmethod receives the class as the first argument, commonly named cls.",
        },
        {
          id: 2,
          question:
            "Which method type does NOT receive an implicit first argument?",
          options: [
            "Instance method",
            "Class method",
            "Static method",
            "All receive one",
          ],
          correct: 2,
          explanation:
            "@staticmethod behaves like a plain function stored on the class; it receives no implicit self/cls.",
        },
        {
          id: 3,
          question:
            "Which decorator enables attribute-style access while running code on get?",
          options: ["@staticmethod", "@classmethod", "@property", "@dataclass"],
          correct: 2,
          explanation:
            "@property turns a method into a managed attribute via the descriptor protocol.",
        },
        {
          id: 4,
          question: "Which is a correct property with a setter?",
          options: [
            "class A: @property\ndef x(self): return self._x\n@x.setter\ndef x(self, v): self._x=v",
            "class A: @property\nx(self): return self._x\n@x.setter\nx(self, v): self._x=v",
            "class A: def x(self): return self._x\n@x.setter\ndef x(self, v): self._x=v",
            "class A: @property\nx = 10\n@x.setter\ndef x(self, v): self._x=v",
          ],
          correct: 0,
          explanation:
            "Use @property on the getter and @x.setter for the same name to define a setter.",
        },
        {
          id: 5,
          question: "Which is TRUE about class methods?",
          options: [
            "They cannot access class attributes",
            "They are invoked only on instances",
            "They receive the class and can construct alternative constructors",
            "They are always slower than instance methods",
          ],
          correct: 2,
          explanation:
            "Class methods receive cls and often serve as alternative constructors or class-level utilities.",
        },
        {
          id: 6,
          question:
            "What happens if an attribute with the same name exists on the instance and the class?",
          options: [
            "Class attribute always wins",
            "Instance attribute shadows the class attribute for that instance",
            "It raises AttributeError",
            "Python merges values",
          ],
          correct: 1,
          explanation:
            "Attribute lookup checks the instance __dict__ first; if found, it shadows the class attribute.",
        },
      ],
      timeLimit: 600,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 75,
    },
    isActive: true,
    sortOrder: 9,
  },

  // 10) Difficulty 5 - Inheritance, Polymorphism, Dunder, MRO
  {
    title: "Advanced OOP: Inheritance, Polymorphism, Dunder Methods, and MRO",
    description:
      "Challenge yourself with inheritance patterns, polymorphism, special methods, and method resolution order",
    activityType: "quiz",
    category: "Functions & OOP",
    difficulty: 5,
    diamondReward: 48,
    experienceReward: 100,
    estimatedMinutes: 22,
    tags: ["oop", "inheritance", "polymorphism", "dunder", "mro", "super"],
    content: {
      instructions:
        "Answer advanced questions on OOP idioms: super(), MRO, polymorphism, and special methods.",
      questions: [
        {
          id: 1,
          question: "What does super() typically refer to in a class method?",
          options: [
            "The subclass",
            "The next class in the MRO for the current type",
            "Always the immediate parent class only",
            "The global namespace",
          ],
          correct: 1,
          explanation:
            "super() follows the Method Resolution Order (MRO), not just the immediate parent.",
        },
        {
          id: 2,
          question: "Which best describes polymorphism?",
          options: [
            "Multiple inheritance with the same method name",
            "The ability for different types to be used interchangeably if they implement the same interface/behavior",
            "Only applies to abstract base classes",
            "Requires operator overloading",
          ],
          correct: 1,
          explanation:
            "Polymorphism allows code to operate on different types through a common interface/behavior.",
        },
        {
          id: 3,
          question:
            "Which dunder method customizes object string representation for end users?",
          options: ["__repr__", "__str__", "__format__", "__bytes__"],
          correct: 1,
          explanation:
            "__str__ is for a user-friendly string; __repr__ is for unambiguous developer representation.",
        },
        {
          id: 4,
          question: "In Python’s multiple inheritance, MRO is used to:",
          options: [
            "Pick a random base class method",
            "Determine unpredictable method order",
            "Provide a deterministic method lookup order (C3 linearization)",
            "Disable super() calls",
          ],
          correct: 2,
          explanation:
            "Python uses C3 linearization to compute a consistent MRO for multiple inheritance.",
        },
        {
          id: 5,
          question:
            "Which special method enables using the object like a function: obj()?",
          options: ["__call__", "__getattr__", "__iter__", "__len__"],
          correct: 0,
          explanation:
            "If a class defines __call__, its instances become callable and can be invoked like functions.",
        },
        {
          id: 6,
          question:
            "What is a good reason to implement __eq__ and __hash__ together?",
          options: [
            "They are unrelated; never implement both",
            "To ensure correct equality semantics and consistent behavior in hashed collections (sets/dicts)",
            "To make objects sortable",
            "To avoid recursion in __repr__",
          ],
          correct: 1,
          explanation:
            "If objects are hashable and compared for equality, __eq__ and __hash__ must be consistent for dict/set usage.",
        },
      ],
      timeLimit: 900,
      randomizeQuestions: true,
      showExplanations: true,
    },
    settings: {
      allowRetakes: true,
      passingScore: 80,
    },
    isActive: true,
    sortOrder: 10,
  },
];

export async function seedQuizFunctionsOOPActivities() {
  await seedActivitiesWithDuplicateCheck(
    quizFunctionsOOPActivities,
    "Quiz Functions & OOP"
  );
}

// Execute if run directly
if (require.main === module) {
  seedQuizFunctionsOOPActivities()
    .catch((error) => {
      console.error("❌ Error seeding Quiz Functions & OOP activities:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
