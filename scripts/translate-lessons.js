const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// English translations for the lesson content
const translations = {
  "python-giris-kapsamli": {
    title: "Introduction to Python - Comprehensive Guide",
    description: "Welcome to the world of Python! Start your programming journey by learning Python basics, one of the most popular programming languages today.",
    content: `<h3>🌟 Welcome to the World of Python!</h3><div><br/>🎉 **Congratulations!** You're starting your Python learning adventure. <br/><br/>Python is just a programming language - not a technology world's most powerful tool. In this lesson, you'll discover why millions of developers choose Python and learn the fundamentals you need to know.<br/><br/>🎯 **What You'll Learn in This Lesson:**<br/>• What Python is and its history<br/>• Python's real-world usage areas<br/>• How to set up your first Python program<br/>• Future learning path<br/><br/>⚡ **Interactive Features:**<br/>• Real-time code editor<br/>• Gamification elements with anime characters<br/>• Mini games and challenges<br/>• Progress tracking system<br/><br/><br/><h3>🐍 Python's Great History</h3><div><br/>🕰️ **Python's Story**<br/>Python's story began in 1989 when Dutch programmer **Guido van Rossum** started this amazing programming language. Guido was influenced by the British comedy group "Monty Python" when naming it.<br/><br/>⭐ **Timeline:**<br/>• **1989** - Guido van Rossum began creating Python<br/>• **1991** - Python 0.9.0 first version released<br/>• **1994** - Python 1.0 - First stable version<br/>• **2000** - Python 2.0 - Unicode support added<br/>• **2008** - Python 3.0 - Modern Python foundation<br/>• **2024** - Python 3.12+ - Current versions<br/><br/>🤔 **Why "Python" Name?**<br/>Guido van Rossum chose this name because he explained it like this: "I needed a short, unique, and slightly mysterious name. Plus, I'm a big fan of Monty Python's Flying Circus."<br/><br/>⭐ **Python Philosophy - "Zen of Python":**`,
    starterCode: `# Your first Python program
print("Hello, World!")

# Try writing this code!`,
    solutionCode: `# Your first Python program
print("Hello, World!")

# Variables
name = "Python Learner"
age = 25

print(f"My name is {name} and I am {age} years old.")

# Basic calculation
x = 10
y = 20
result = x + y
print(f"The sum is: {result}")`,
    hints: "Remember to use print() function to display output. Python is case-sensitive, so make sure your code matches exactly!"
  }
};

async function translateLessons() {
  try {
    console.log('🔄 Starting lesson translation...');
    
    for (const [slug, translation] of Object.entries(translations)) {
      console.log(`📝 Translating lesson: ${slug}`);
      
      await prisma.lesson.update({
        where: { slug: slug },
        data: {
          title: translation.title,
          description: translation.description,
          content: translation.content,
          starterCode: translation.starterCode,
          solutionCode: translation.solutionCode,
          hints: translation.hints
        }
      });
      
      console.log(`✅ Successfully translated: ${slug}`);
    }
    
    console.log('🎉 All lessons translated successfully!');
  } catch (error) {
    console.error('❌ Translation failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the translation
translateLessons();