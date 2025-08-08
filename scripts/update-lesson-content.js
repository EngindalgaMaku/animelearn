// Update lesson content via API
const lessonUpdates = {
  "python-giris-kapsamli": {
    title: "Introduction to Python - Comprehensive Guide",
    description: "Welcome to the world of Python! Start your programming journey by learning Python basics, one of the most popular programming languages today.",
    content: `<h3>🌟 Welcome to the World of Python!</h3><div><br/>🎉 <strong>Congratulations!</strong> You're starting your Python learning adventure. <br/><br/>Python is not just a programming language - it's one of the technology world's most powerful tools. In this lesson, you'll discover why millions of developers choose Python and learn the fundamentals you need to know.<br/><br/>🎯 <strong>What You'll Learn in This Lesson:</strong><br/>• What Python is and its history<br/>• Python's real-world usage areas<br/>• How to set up your first Python program<br/>• Future learning path<br/><br/>⚡ <strong>Interactive Features:</strong><br/>• Real-time code editor<br/>• Gamification elements with anime characters<br/>• Mini games and challenges<br/>• Progress tracking system<br/><br/><br/><h3>🐍 Python's Great History</h3><div><br/>🕰️ <strong>Python's Story</strong><br/>Python's story began in 1989 when Dutch programmer <strong>Guido van Rossum</strong> started this amazing programming language. Guido was influenced by the British comedy group "Monty Python" when naming it.<br/><br/>⭐ <strong>Timeline:</strong><br/>• <strong>1989</strong> - Guido van Rossum began creating Python<br/>• <strong>1991</strong> - Python 0.9.0 first version released<br/>• <strong>1994</strong> - Python 1.0 - First stable version<br/>• <strong>2000</strong> - Python 2.0 - Unicode support added<br/>• <strong>2008</strong> - Python 3.0 - Modern Python foundation<br/>• <strong>2024</strong> - Python 3.12+ - Current versions<br/><br/>🤔 <strong>Why "Python" Name?</strong><br/>Guido van Rossum chose this name because he explained it like this: "I needed a short, unique, and slightly mysterious name. Plus, I'm a big fan of Monty Python's Flying Circus."<br/><br/>⭐ <strong>Python Philosophy - "Zen of Python":</strong><br/>• Beautiful is better than ugly<br/>• Simple is better than complex<br/>• Complex is better than complicated<br/>• Flat is better than nested<br/>• Sparse is better than dense<br/>• Readability counts`,
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

async function updateLessonContent() {
  for (const [slug, updates] of Object.entries(lessonUpdates)) {
    try {
      const response = await fetch('http://localhost:3000/api/admin/lessons', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId: slug, // Assuming we can find by slug
          ...updates
        }),
      });

      if (response.ok) {
        console.log(`✅ Successfully updated lesson: ${slug}`);
      } else {
        console.error(`❌ Failed to update lesson: ${slug}`);
      }
    } catch (error) {
      console.error(`❌ Error updating lesson ${slug}:`, error);
    }
  }
}

// For manual copy-paste into browser console
console.log('Copy and paste this into your browser console on the admin lessons page:');
console.log(JSON.stringify(lessonUpdates, null, 2));