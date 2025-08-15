import { seedActivitiesWithDuplicateCheck, prisma } from "./seed-utils";

/**
 * Algorithm Visualization Activities for Functions & OOP
 * 10 visual, step-based activities focused on call flow, stack, closures, decorators, OOP dispatch, and MRO
 * Category: "Functions & OOP"
 *
 * Structure reference (see ACTIVITY_STRUCTURES.md):
 * {
 *   activityType: "algorithm_visualization",
 *   content: {
 *     algorithm: string,
 *     description: string,
 *     timeComplexity?: string,
 *     spaceComplexity?: string,
 *     explanation?: string,
 *     initialData?: any,
 *     steps: Array<{
 *       id: number,
 *       description: string,
 *       data?: any,
 *       highlights?: any,
 *       comparison?: any,
 *       action?: string
 *     }>,
 *     visualizations?: any[],
 *     code?: string
 *   },
 *   settings: {
 *     animationSpeed?: "slow" | "medium" | "fast",
 *     showComplexity?: boolean,
 *     allowStepByStep?: boolean
 *   }
 * }
 */

export const algorithmVisualizationFunctionsOOPActivities = [
  // 1) Difficulty 1 — Function call flow (simple)
  {
    title: "Viz: Function Call Flow — greet(name)",
    description:
      "Visualize a simple function call, parameter binding, and return flow",
    activityType: "algorithm_visualization",
    category: "Functions & OOP",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 28,
    estimatedMinutes: 8,
    tags: ["functions", "call-flow", "parameters", "return"],
    content: {
      algorithm: "function_call_flow",
      description:
        "Track entering greet(name), binding argument, executing body, returning a value.",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      explanation:
        "A basic function call pushes a frame on the call stack with parameters and locals, then pops on return.",
      initialData: { name: "Ada" },
      steps: [
        {
          id: 1,
          description: "Call greet('Ada') — push frame with name='Ada'",
          data: { stack: ["greet(name='Ada')"] },
          action: "Enter function greet",
        },
        {
          id: 2,
          description: "Compute formatted string",
          data: { locals: { name: "Ada", result: "Hello, Ada!" } },
          action: "Prepare return value",
        },
        {
          id: 3,
          description: "Return result and pop frame",
          data: { stack: [] },
          action: "Return 'Hello, Ada!'",
        },
      ],
      code: "def greet(name):\n    return f\"Hello, {name}!\"\n\nprint(greet('Ada'))",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 1,
  },

  // 2) Difficulty 1 — Print vs return execution path
  {
    title: "Viz: Print vs Return Paths",
    description:
      "Compare how print() writes output while return hands value to the caller",
    activityType: "algorithm_visualization",
    category: "Functions & OOP",
    difficulty: 1,
    diamondReward: 12,
    experienceReward: 28,
    estimatedMinutes: 9,
    tags: ["functions", "print", "return", "call-stack"],
    content: {
      algorithm: "print_vs_return",
      description:
        "Show differences between printing inside a function and returning values to be printed by the caller.",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      explanation:
        "Printing produces side-effects to stdout; returning transfers data to the caller frame.",
      initialData: { x: 3, y: 4 },
      steps: [
        {
          id: 1,
          description: "Call sum_print(3,4) — prints '7', returns None",
          data: { stdout: "7\n" },
        },
        {
          id: 2,
          description: "Call sum_return(3,4) — returns 7 to caller",
          data: { return: 7 },
        },
        {
          id: 3,
          description: "Caller prints the returned value 7",
          data: { stdout: "7\n7\n" },
        },
      ],
      code: "def sum_print(a,b):\n    print(a+b)\n\ndef sum_return(a,b):\n    return a+b\n\nsum_print(3,4)\nprint(sum_return(3,4))",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 2,
  },

  // 3) Difficulty 2 — Tuple return and unpacking
  {
    title: "Viz: Multiple Returns and Unpacking",
    description:
      "Visualize returning tuples and unpacking values at caller site",
    activityType: "algorithm_visualization",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 44,
    estimatedMinutes: 10,
    tags: ["functions", "tuple", "unpacking", "return"],
    content: {
      algorithm: "tuple_return_unpack",
      description:
        "Show how multiple return values are packaged into a tuple and then unpacked by the caller.",
      timeComplexity: "O(n) for min/max/sum",
      spaceComplexity: "O(1)",
      explanation:
        "Python returns multiple values as a tuple; unpacking binds names to each element.",
      initialData: [3, 1, 5],
      steps: [
        {
          id: 1,
          description: "Compute stats: min=1, max=5, sum=9",
          data: { min: 1, max: 5, sum: 9 },
        },
        {
          id: 2,
          description: "Pack into (1, 5, 9) and return",
          data: { return: [1, 5, 9] },
        },
        {
          id: 3,
          description: "Caller unpacks into m, M, s",
          data: { m: 1, M: 5, s: 9 },
        },
      ],
      code: "def stats(nums):\n    return min(nums), max(nums), sum(nums)\n\nm, M, s = stats([3,1,5])\nprint(m, M, s)",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 3,
  },

  // 4) Difficulty 2 — LEGB name resolution
  {
    title: "Viz: LEGB Name Resolution",
    description:
      "See how Python resolves names across Local, Enclosing, Global, and Built-in scopes",
    activityType: "algorithm_visualization",
    category: "Functions & OOP",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 46,
    estimatedMinutes: 12,
    tags: ["scope", "LEGB", "global", "nonlocal"],
    content: {
      algorithm: "legb_resolution",
      description:
        "Dynamic visualization of name lookup order with global and nonlocal modifiers.",
      timeComplexity: "O(1) per lookup",
      spaceComplexity: "O(1)",
      explanation:
        "Python searches Local → Enclosing → Global → Built-in; global/nonlocal affect assignment binding.",
      initialData: { COUNT: 0 },
      steps: [
        {
          id: 1,
          description: "inc() declares global COUNT, modifies module-level",
          data: { COUNT: 1 },
        },
        {
          id: 2,
          description:
            "outer/inner with nonlocal x modifies enclosing function variable",
          data: { x: 1 },
        },
        {
          id: 3,
          description: "len resolved from built-ins",
          data: { builtin: "len" },
        },
      ],
      code: "COUNT = 0\n\ndef inc():\n    global COUNT\n    COUNT += 1\n\ninc()\n\ndef outer():\n    x = 0\n    def inner():\n        nonlocal x\n        x += 1\n        return x\n    return inner\n\nprint(len([1,2,3]))",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 4,
  },

  // 5) Difficulty 3 — Closure state over time
  {
    title: "Viz: Closure State with nonlocal",
    description:
      "Watch how a closure captures and updates enclosing state across calls",
    activityType: "algorithm_visualization",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 62,
    estimatedMinutes: 14,
    tags: ["closures", "nonlocal", "state"],
    content: {
      algorithm: "closure_counter",
      description:
        "Track captured variable x incrementing each time the inner function is called.",
      timeComplexity: "O(1) per call",
      spaceComplexity: "O(1)",
      explanation:
        "The inner function retains access to variables from its lexical environment.",
      initialData: { x: 0 },
      steps: [
        {
          id: 1,
          description: "make_counter() creates inner() with x=0",
          data: { x: 0 },
        },
        { id: 2, description: "inner() call #1 → x becomes 1", data: { x: 1 } },
        { id: 3, description: "inner() call #2 → x becomes 2", data: { x: 2 } },
      ],
      code: "def make_counter():\n    x = 0\n    def inner():\n        nonlocal x\n        x += 1\n        return x\n    return inner\n\nc = make_counter()\nprint(c()); print(c())",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 5,
  },

  // 6) Difficulty 3 — Decorator call flow with @wraps
  {
    title: "Viz: Decorator Flow (@wraps)",
    description:
      "Visualize wrapper invocation around a target function and metadata preservation",
    activityType: "algorithm_visualization",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 15,
    tags: ["decorators", "wraps", "metadata"],
    content: {
      algorithm: "decorator_wrapper_flow",
      description:
        "Show how wrapper intercepts call, logs, calls original, then logs completion.",
      timeComplexity: "O(1) + cost(original)",
      spaceComplexity: "O(1)",
      explanation:
        "Decorators return a new callable. @wraps copies metadata like __name__.",
      initialData: { fn: "add" },
      steps: [
        {
          id: 1,
          description: "Call add(2,3) → actually calls wrapper",
          data: { step: "wrapper-enter" },
        },
        {
          id: 2,
          description: "Wrapper logs 'CALL' then invokes add",
          data: { step: "invoke-original" },
        },
        {
          id: 3,
          description: "Wrapper logs 'DONE' and returns result",
          data: { result: 5 },
        },
      ],
      code: "from functools import wraps\n\ndef log_calls(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        print('CALL')\n        try:\n            return func(*args, **kwargs)\n        finally:\n            print('DONE')\n    return wrapper\n\n@log_calls\ndef add(a,b):\n    return a+b\n\nprint(add(2,3))\nprint(add.__name__)",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 6,
  },

  // 7) Difficulty 3 — Instance vs class attribute lookup
  {
    title: "Viz: Attribute Lookup — Instance vs Class",
    description:
      "Trace Python's attribute lookup order between instance __dict__ and class attributes",
    activityType: "algorithm_visualization",
    category: "Functions & OOP",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 14,
    tags: ["oop", "attributes", "lookup"],
    content: {
      algorithm: "attribute_lookup",
      description:
        "Attribute access checks instance namespace first, then class, then base classes.",
      timeComplexity: "O(k) where k is MRO length",
      spaceComplexity: "O(1)",
      explanation:
        "Instance attribute shadows class attribute with same name for that instance.",
      initialData: {
        class: "Counter",
        classAttr: "total",
        instanceAttr: "value",
      },
      steps: [
        {
          id: 1,
          description: "Access Counter.total → found on class",
          data: { source: "class" },
        },
        {
          id: 2,
          description: "c.value → found on instance",
          data: { source: "instance" },
        },
        {
          id: 3,
          description: "If c.total set on instance, it shadows class attr",
          data: { shadow: true },
        },
      ],
      code: "class Counter:\n    total = 0\n    def __init__(self):\n        self.value = 0\n\nc = Counter()\nprint(Counter.total, c.value)",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 7,
  },

  // 8) Difficulty 4 — Method dispatch and super()
  {
    title: "Viz: Method Dispatch & super()",
    description:
      "Follow method lookup from instance to class, and cooperative calls via super()",
    activityType: "algorithm_visualization",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 80,
    estimatedMinutes: 16,
    tags: ["inheritance", "dispatch", "super", "MRO"],
    content: {
      algorithm: "method_dispatch_super",
      description:
        "See how Dog.speak() resolves via MRO and extends Animal.speak() using super().",
      timeComplexity: "O(k) for MRO traversal",
      spaceComplexity: "O(1)",
      explanation: "super() follows MRO, not simply the textual parent.",
      initialData: { classes: ["Animal", "Dog(Animal)"] },
      steps: [
        {
          id: 1,
          description: "Dog().speak() → lookup in Dog",
          data: { lookup: "Dog.speak" },
        },
        {
          id: 2,
          description: "Dog.speak calls super().speak()",
          data: { super: "Animal.speak" },
        },
        {
          id: 3,
          description: "Concatenate base result with ' woof'",
          data: { result: "sound woof" },
        },
      ],
      code: "class Animal:\n    def speak(self):\n        return 'sound'\n\nclass Dog(Animal):\n    def speak(self):\n        return super().speak() + ' woof'\n\nprint(Dog().speak())",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 8,
  },

  // 9) Difficulty 4 — MRO (C3 linearization) overview
  {
    title: "Viz: Multiple Inheritance and MRO",
    description:
      "Visualize a simple diamond inheritance and the computed MRO order",
    activityType: "algorithm_visualization",
    category: "Functions & OOP",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 82,
    estimatedMinutes: 18,
    tags: ["MRO", "multiple-inheritance", "C3"],
    content: {
      algorithm: "mro_linearization",
      description:
        "Show the MRO for a diamond shape and how attribute resolution follows it.",
      timeComplexity: "O(k) to traverse",
      spaceComplexity: "O(k)",
      explanation:
        "Python uses C3 linearization to create a deterministic MRO.",
      initialData: { classes: ["A", "B(A)", "C(A)", "D(B,C)"] },
      steps: [
        {
          id: 1,
          description: "Compute MRO(D): D → B → C → A → object",
          data: { mro: ["D", "B", "C", "A", "object"] },
        },
        {
          id: 2,
          description: "D().method() resolves along MRO",
          data: { order: ["D", "B", "C", "A"] },
        },
      ],
      code: "# Example diamond\nclass A: pass\nclass B(A): pass\nclass C(A): pass\nclass D(B, C): pass\n\nprint([c.__name__ for c in D.mro()])",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 9,
  },

  // 10) Difficulty 5 — Descriptor (@property) access lifecycle
  {
    title: "Viz: Descriptor Lifecycle — @property",
    description:
      "Trace how the descriptor protocol powers @property for computed attributes",
    activityType: "algorithm_visualization",
    category: "Functions & OOP",
    difficulty: 5,
    diamondReward: 48,
    experienceReward: 100,
    estimatedMinutes: 20,
    tags: ["descriptor", "property", "get", "protocol"],
    content: {
      algorithm: "descriptor_property_access",
      description:
        "Show how attribute access on an instance triggers the property's fget under the hood.",
      timeComplexity: "O(1)",
      spaceComplexity: "O(1)",
      explanation:
        "@property uses the descriptor protocol (__get__) to compute values on access.",
      initialData: { class: "Rect", instance: "Rect(3,4)" },
      steps: [
        {
          id: 1,
          description: "Access r.area → Python finds descriptor on class",
          data: { found: "property(area)" },
        },
        {
          id: 2,
          description: "Descriptor __get__ calls fget(self)",
          data: { call: "fget" },
        },
        {
          id: 3,
          description: "fget computes width*height and returns",
          data: { result: 12 },
        },
      ],
      code: "class Rect:\n    def __init__(self,w,h):\n        self.w,self.h = w,h\n    @property\n    def area(self):\n        return self.w*self.h\n\nr = Rect(3,4)\nprint(r.area)",
    },
    settings: {
      animationSpeed: "medium",
      showComplexity: true,
      allowStepByStep: true,
    },
    isActive: true,
    sortOrder: 10,
  },
];

export async function seedAlgorithmVisualizationFunctionsOOPActivities() {
  await seedActivitiesWithDuplicateCheck(
    algorithmVisualizationFunctionsOOPActivities,
    "Algorithm-Visualization Functions & OOP"
  );
}

// Execute if run directly
if (require.main === module) {
  seedAlgorithmVisualizationFunctionsOOPActivities()
    .catch((error) => {
      console.error(
        "❌ Error seeding Algorithm-Visualization Functions & OOP activities:",
        error
      );
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
