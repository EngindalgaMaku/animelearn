const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE = 'http://localhost:3000';

// First, let's get the lesson ID by slug
async function getLessonBySlug(slug) {
  try {
    const response = await fetch(`${API_BASE}/api/lessons/${slug}`);
    if (response.ok) {
      const data = await response.json();
      return data.lesson;
    }
    return null;
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return null;
  }
}

// Update lesson via admin API
async function updateLesson(lessonId, updates) {
  try {
    const response = await fetch(`${API_BASE}/api/admin/lessons`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lessonId: lessonId,
        ...updates
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Lesson updated successfully');
      return result;
    } else {
      const error = await response.text();
      console.error('❌ Update failed:', error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error updating lesson:', error);
    return null;
  }
}

// English translation data
const englishContent = {
  title: "Introduction to Python - Comprehensive Guide",
  description: "Welcome to the world of Python! Start your programming journey by learning Python basics, one of the most popular programming languages today.",
  content: `<h3>🌟 Welcome to the World of Python!</h3><div><br/>🎉 <strong>Congratulations!</strong> You're starting your Python learning adventure. <br/><br/>Python is not just a programming language - it's one of the technology world's most powerful tools. In this lesson, you'll discover why millions of developers choose Python and learn the fundamentals you need to know.<br/><br/>🎯 <strong>What You'll Learn in This Lesson:</strong><br/>• What Python is and its history<br/>• Python's real-world usage areas<br/>• How to set up your first Python program<br/>• Future learning path<br/><br/>⚡ <strong>Interactive Features:</strong><br/>• Real-time code editor<br/>• Gamification elements with anime characters<br/>• Mini games and challenges<br/>• Progress tracking system<br/><br/><br/><h3>🐍 Python's Great History</h3><div><br/>🕰️ <strong>Python's Story</strong><br/>Python's story began in 1989 when Dutch programmer <strong>Guido van Rossum</strong> started this amazing programming language. Guido was influenced by the British comedy group "Monty Python" when naming it.<br/><br/>⭐ <strong>Timeline:</strong><br/>• <strong>1989</strong> - Guido van Rossum began creating Python<br/>• <strong>1991</strong> - Python 0.9.0 first version released<br/>• <strong>1994</strong> - Python 1.0 - First stable version<br/>• <strong>2000</strong> - Python 2.0 - Unicode support added<br/>• <strong>2008</strong> - Python 3.0 - Modern Python foundation<br/>• <strong>2024</strong> - Python 3.12+ - Current versions<br/><br/>🤔 <strong>Why "Python" Name?</strong><br/>Guido van Rossum chose this name because he explained it like this: "I needed a short, unique, and slightly mysterious name. Plus, I'm a big fan of Monty Python's Flying Circus."<br/><br/>⭐ <strong>Python Philosophy - "Zen of Python":</strong><br/>• Beautiful is better than ugly<br/>• Simple is better than complex<br/>• Complex is better than complicated<br/>• Flat is better than nested<br/>• Sparse is better than dense<br/>• Readability counts</div>`,
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
};

// Main function
async function main() {
  console.log('🔄 Starting lesson translation via API...');
  
  // Get lesson by slug
  const lesson = await getLessonBySlug('python-giris-kapsamli');
  
  if (!lesson) {
    console.error('❌ Lesson not found');
    return;
  }
  
  console.log('📝 Found lesson:', lesson.title);
  console.log('🆔 Lesson ID:', lesson.id);
  
  // Update lesson with English content
  const result = await updateLesson(lesson.id, englishContent);
  
  if (result) {
    console.log('🎉 Translation completed successfully!');
    console.log('🌐 Lesson is now in English');
  } else {
    console.log('❌ Translation failed');
  }
}

// Run the script
main().catch(console.error);