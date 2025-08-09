import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPythonTips() {
  console.log('🐍 Seeding Python Tips data...');

  // Create categories
  const categories = await Promise.all([
    prisma.pythonTipCategory.upsert({
      where: { slug: 'python-basics' },
      update: {},
      create: {
        name: 'Python Basics',
        slug: 'python-basics',
        description: 'Fundamental Python concepts for beginners',
        color: '#4CAF50',
        icon: '🟢',
        sortOrder: 1,
      },
    }),
    prisma.pythonTipCategory.upsert({
      where: { slug: 'advanced-python' },
      update: {},
      create: {
        name: 'Advanced Python',
        slug: 'advanced-python',
        description: 'Advanced Python concepts and techniques',
        color: '#F44336',
        icon: '🔴',
        sortOrder: 2,
      },
    }),
    prisma.pythonTipCategory.upsert({
      where: { slug: 'code-tricks' },
      update: {},
      create: {
        name: 'Code Tricks',
        slug: 'code-tricks',
        description: 'Python tricks and one-liners',
        color: '#FF9800',
        icon: '⚡',
        sortOrder: 3,
      },
    }),
    prisma.pythonTipCategory.upsert({
      where: { slug: 'best-practices' },
      update: {},
      create: {
        name: 'Best Practices',
        slug: 'best-practices',
        description: 'Python coding best practices',
        color: '#9C27B0',
        icon: '✨',
        sortOrder: 4,
      },
    }),
    prisma.pythonTipCategory.upsert({
      where: { slug: 'data-science' },
      update: {},
      create: {
        name: 'Data Science',
        slug: 'data-science',
        description: 'Python for data science and analytics',
        color: '#2196F3',
        icon: '📊',
        sortOrder: 5,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create sample tips
  const tips = [
    {
      title: 'Python List Comprehensions',
      content: 'List comprehensions provide a concise way to create lists. They are more readable and often faster than traditional for loops.',
      codeExample: `# Traditional way
squares = []
for i in range(10):
    squares.append(i**2)

# List comprehension - more Pythonic
squares = [i**2 for i in range(10)]

# With condition
even_squares = [i**2 for i in range(10) if i % 2 == 0]

print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]`,
      difficulty: 'beginner',
      categoryId: categories[0].id, // Python Basics
      xpReward: 15,
      estimatedMinutes: 3,
      tags: '["list-comprehension", "loops", "python-basics"]',
    },
    {
      title: 'F-Strings for String Formatting',
      content: 'F-strings (formatted string literals) are the modern and preferred way to format strings in Python 3.6+.',
      codeExample: `name = "Python"
version = 3.11
score = 95.5

# F-string formatting
message = f"Hello, {name} {version}!"
print(message)  # Hello, Python 3.11!

# With expressions
result = f"Score: {score:.1f}% ({score/100:.2%})"
print(result)  # Score: 95.5% (95.50%)

# Multi-line f-strings
info = f"""
Name: {name}
Version: {version}
Score: {score}%
"""`,
      difficulty: 'beginner',
      categoryId: categories[0].id,
      xpReward: 12,
      estimatedMinutes: 2,
      tags: '["f-strings", "string-formatting", "python-3.6"]',
    },
    {
      title: 'Dictionary Merge in Python 3.9+',
      content: 'Python 3.9 introduced the merge (|) and update (|=) operators for dictionaries.',
      codeExample: `# Python 3.9+ dictionary merge operators
dict1 = {"a": 1, "b": 2}
dict2 = {"c": 3, "d": 4}
dict3 = {"b": 20, "e": 5}

# Merge dictionaries (creates new dict)
merged = dict1 | dict2 | dict3
print(merged)  # {"a": 1, "b": 20, "c": 3, "d": 4, "e": 5}

# Update in-place
dict1 |= dict2
print(dict1)  # {"a": 1, "b": 2, "c": 3, "d": 4}

# Before Python 3.9
merged_old = {**dict1, **dict2, **dict3}`,
      difficulty: 'intermediate',
      categoryId: categories[2].id, // Code Tricks
      xpReward: 18,
      estimatedMinutes: 3,
      tags: '["dictionaries", "python-3.9", "merge", "operators"]',
    },
    {
      title: 'Context Managers and "with" Statement',
      content: 'Context managers ensure proper resource management and cleanup using the "with" statement.',
      codeExample: `# File handling with context manager
with open('example.txt', 'r') as file:
    content = file.read()
# File is automatically closed

# Custom context manager
from contextlib import contextmanager

@contextmanager
def timer():
    import time
    start = time.time()
    try:
        yield
    finally:
        end = time.time()
        print(f"Time taken: {end - start:.2f} seconds")

# Usage
with timer():
    # Some time-consuming operation
    import time
    time.sleep(1)`,
      difficulty: 'advanced',
      categoryId: categories[1].id, // Advanced Python
      xpReward: 25,
      estimatedMinutes: 5,
      tags: '["context-managers", "with-statement", "resource-management"]',
    },
    {
      title: 'Enumerate vs Range',
      content: 'Use enumerate() instead of range(len()) when you need both index and value.',
      codeExample: `fruits = ['apple', 'banana', 'cherry']

# ❌ Not Pythonic
for i in range(len(fruits)):
    print(f"{i}: {fruits[i]}")

# ✅ Pythonic way
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")

# With custom start value
for i, fruit in enumerate(fruits, start=1):
    print(f"{i}: {fruit}")

# Output:
# 1: apple
# 2: banana  
# 3: cherry`,
      difficulty: 'beginner',
      categoryId: categories[3].id, // Best Practices
      xpReward: 10,
      estimatedMinutes: 2,
      tags: '["enumerate", "loops", "best-practices", "pythonic"]',
    },
    {
      title: 'Pandas DataFrame Quick Tips',
      content: 'Essential pandas operations for data manipulation and analysis.',
      codeExample: `import pandas as pd

# Create DataFrame
data = {
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35],
    'city': ['NY', 'LA', 'Chicago']
}
df = pd.DataFrame(data)

# Quick info
print(df.info())
print(df.describe())

# Filter data
young_people = df[df['age'] < 30]

# Group and aggregate
city_stats = df.groupby('city')['age'].agg(['mean', 'count'])

# Chain operations
result = (df
    .query('age > 25')
    .sort_values('age')
    .reset_index(drop=True)
)`,
      difficulty: 'intermediate',
      categoryId: categories[4].id, // Data Science
      xpReward: 20,
      estimatedMinutes: 4,
      tags: '["pandas", "dataframe", "data-science", "analysis"]',
    },
  ];

  const createdTips = [];
  for (const tipData of tips) {
    const tip = await prisma.pythonTip.create({
      data: {
        ...tipData,
        publishDate: new Date(),
        slug: tipData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      },
    });
    createdTips.push(tip);
  }

  console.log(`✅ Created ${createdTips.length} Python tips`);

  // Set today's daily tip
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if today's tip already exists
  const existingDailyTip = await prisma.dailyPythonTip.findFirst({
    where: {
      date: today,
    },
  });

  if (!existingDailyTip) {
    await prisma.dailyPythonTip.create({
      data: {
        tipId: createdTips[0].id, // First tip as today's tip
        date: today,
      },
    });
  }

  console.log('✅ Set daily tip for today');
  console.log('🎉 Python Tips seeding completed!');
}

async function main() {
  try {
    await seedPythonTips();
  } catch (error) {
    console.error('❌ Error seeding Python Tips:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();