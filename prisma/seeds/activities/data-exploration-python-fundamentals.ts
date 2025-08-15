// DATA_EXPLORATION Activities - Python Fundamentals
// Data analysis and exploration activities using Python's data structures and collections

export const dataExplorationPythonFundamentalsActivities = [
  {
    title: "Student Grades Analysis",
    description:
      "Analyze student performance data using basic Python data structures",
    activityType: "data_exploration",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 20,
    experienceReward: 45,
    estimatedMinutes: 20,
    tags: ["data-analysis", "lists", "dictionaries", "statistics"],
    content: {
      title: "Student Performance Analysis",
      instructions:
        "Analyze student grades data to extract meaningful insights",
      dataset: [
        { name: "Alice", subject: "Math", grade: 85, semester: "Fall" },
        { name: "Bob", subject: "Math", grade: 78, semester: "Fall" },
        { name: "Alice", subject: "Science", grade: 92, semester: "Fall" },
        { name: "Charlie", subject: "Math", grade: 95, semester: "Fall" },
        { name: "Bob", subject: "Science", grade: 88, semester: "Fall" },
        { name: "Alice", subject: "History", grade: 79, semester: "Fall" },
        { name: "Charlie", subject: "Science", grade: 91, semester: "Fall" },
        { name: "Bob", subject: "History", grade: 82, semester: "Fall" },
      ],
      questions: [
        {
          id: "q1",
          question:
            "What is the average grade across all students and subjects?",
          type: "calculate",
          answer: "86.25",
          hint: "Sum all grades and divide by the total number of records",
        },
        {
          id: "q2",
          question: "Which student has the highest average grade?",
          type: "analyze",
          answer: "Charlie",
          hint: "Calculate each student's average and compare",
        },
        {
          id: "q3",
          question: "What subjects are being taught? (as a set)",
          type: "filter",
          answer: "{'Math', 'Science', 'History'}",
          hint: "Extract unique subjects using set comprehension",
        },
        {
          id: "q4",
          question: "How many students scored above 85?",
          type: "count",
          answer: "4",
          hint: "Count records where grade > 85",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 1200,
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: false,
    },
    isActive: true,
    sortOrder: 1,
  },

  {
    title: "E-commerce Sales Data Mining",
    description:
      "Explore online store sales data to identify trends and patterns",
    activityType: "data_exploration",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 30,
    experienceReward: 65,
    estimatedMinutes: 25,
    tags: ["data-mining", "sales-analysis", "collections", "trends"],
    content: {
      title: "Sales Data Analytics",
      instructions:
        "Analyze e-commerce sales data to discover business insights",
      dataset: [
        {
          product: "Laptop",
          category: "Electronics",
          price: 999.99,
          quantity: 2,
          customer_age: 28,
        },
        {
          product: "Mouse",
          category: "Electronics",
          price: 25.99,
          quantity: 1,
          customer_age: 28,
        },
        {
          product: "Book",
          category: "Education",
          price: 19.99,
          quantity: 3,
          customer_age: 34,
        },
        {
          product: "Headphones",
          category: "Electronics",
          price: 79.99,
          quantity: 1,
          customer_age: 22,
        },
        {
          product: "Notebook",
          category: "Education",
          price: 12.99,
          quantity: 5,
          customer_age: 19,
        },
        {
          product: "Tablet",
          category: "Electronics",
          price: 299.99,
          quantity: 1,
          customer_age: 45,
        },
        {
          product: "Pen Set",
          category: "Education",
          price: 8.99,
          quantity: 2,
          customer_age: 34,
        },
        {
          product: "Monitor",
          category: "Electronics",
          price: 199.99,
          quantity: 1,
          customer_age: 28,
        },
      ],
      questions: [
        {
          id: "q1",
          question: "What is the total revenue from all sales?",
          type: "calculate",
          answer: "2162.89",
          hint: "Multiply price by quantity for each item, then sum all revenues",
        },
        {
          id: "q2",
          question: "Which category generates the most revenue?",
          type: "analyze",
          answer: "Electronics",
          hint: "Group sales by category and sum revenues for each",
        },
        {
          id: "q3",
          question: "What is the average customer age?",
          type: "calculate",
          answer: "29.75",
          hint: "Sum all customer ages and divide by number of transactions",
        },
        {
          id: "q4",
          question: "How many unique products were sold?",
          type: "count",
          answer: "8",
          hint: "Count distinct product names in the dataset",
        },
        {
          id: "q5",
          question:
            "Which customer age group (20s, 30s, 40s) made the most purchases?",
          type: "analyze",
          answer: "20s",
          hint: "Group customers by age decades and count transactions",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 1500,
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: true,
    },
    isActive: true,
    sortOrder: 2,
  },

  {
    title: "Weather Data Pattern Recognition",
    description:
      "Analyze weather patterns and temperature trends using Python collections",
    activityType: "data_exploration",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 28,
    experienceReward: 60,
    estimatedMinutes: 22,
    tags: ["weather-analysis", "patterns", "statistics", "time-series"],
    content: {
      title: "Weather Pattern Analysis",
      instructions: "Explore weather data to identify patterns and trends",
      dataset: [
        {
          date: "2024-01-01",
          temperature: 32,
          humidity: 65,
          condition: "Sunny",
        },
        {
          date: "2024-01-02",
          temperature: 28,
          humidity: 70,
          condition: "Cloudy",
        },
        {
          date: "2024-01-03",
          temperature: 35,
          humidity: 60,
          condition: "Sunny",
        },
        {
          date: "2024-01-04",
          temperature: 29,
          humidity: 75,
          condition: "Rainy",
        },
        {
          date: "2024-01-05",
          temperature: 31,
          humidity: 68,
          condition: "Cloudy",
        },
        {
          date: "2024-01-06",
          temperature: 33,
          humidity: 62,
          condition: "Sunny",
        },
        {
          date: "2024-01-07",
          temperature: 27,
          humidity: 80,
          condition: "Rainy",
        },
        {
          date: "2024-01-08",
          temperature: 30,
          humidity: 72,
          condition: "Cloudy",
        },
        {
          date: "2024-01-09",
          temperature: 34,
          humidity: 58,
          condition: "Sunny",
        },
        {
          date: "2024-01-10",
          temperature: 26,
          humidity: 85,
          condition: "Rainy",
        },
      ],
      questions: [
        {
          id: "q1",
          question: "What is the average temperature over the 10-day period?",
          type: "calculate",
          answer: "30.5",
          hint: "Sum all temperatures and divide by number of days",
        },
        {
          id: "q2",
          question: "Which weather condition is most common?",
          type: "analyze",
          answer: "Sunny",
          hint: "Count occurrences of each condition and find the maximum",
        },
        {
          id: "q3",
          question: "What is the highest humidity recorded?",
          type: "filter",
          answer: "85",
          hint: "Find the maximum humidity value in the dataset",
        },
        {
          id: "q4",
          question: "How many days had temperature above 30 degrees?",
          type: "count",
          answer: "5",
          hint: "Count records where temperature > 30",
        },
        {
          id: "q5",
          question: "What's the average humidity on rainy days?",
          type: "calculate",
          answer: "80.0",
          hint: "Filter rainy days and calculate average humidity",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 1320,
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: true,
    },
    isActive: true,
    sortOrder: 3,
  },

  {
    title: "Library Book Circulation Analysis",
    description:
      "Analyze library book borrowing patterns and reading preferences",
    activityType: "data_exploration",
    category: "Python Fundamentals",
    difficulty: 2,
    diamondReward: 25,
    experienceReward: 50,
    estimatedMinutes: 18,
    tags: ["library-data", "patterns", "frequency-analysis", "books"],
    content: {
      title: "Library Circulation Analytics",
      instructions:
        "Explore library data to understand borrowing patterns and preferences",
      dataset: [
        {
          book_id: "B001",
          title: "Python Programming",
          genre: "Technology",
          borrowed_times: 15,
          avg_rating: 4.5,
        },
        {
          book_id: "B002",
          title: "Data Science Basics",
          genre: "Technology",
          borrowed_times: 12,
          avg_rating: 4.2,
        },
        {
          book_id: "B003",
          title: "The Great Gatsby",
          genre: "Fiction",
          borrowed_times: 8,
          avg_rating: 4.0,
        },
        {
          book_id: "B004",
          title: "1984",
          genre: "Fiction",
          borrowed_times: 10,
          avg_rating: 4.8,
        },
        {
          book_id: "B005",
          title: "World History",
          genre: "History",
          borrowed_times: 6,
          avg_rating: 3.9,
        },
        {
          book_id: "B006",
          title: "Machine Learning",
          genre: "Technology",
          borrowed_times: 18,
          avg_rating: 4.7,
        },
        {
          book_id: "B007",
          title: "Pride and Prejudice",
          genre: "Fiction",
          borrowed_times: 7,
          avg_rating: 4.3,
        },
        {
          book_id: "B008",
          title: "Ancient Civilizations",
          genre: "History",
          borrowed_times: 4,
          avg_rating: 3.8,
        },
      ],
      questions: [
        {
          id: "q1",
          question: "Which genre is most popular based on total borrowings?",
          type: "analyze",
          answer: "Technology",
          hint: "Sum borrowed_times for each genre and compare",
        },
        {
          id: "q2",
          question: "What is the average rating across all books?",
          type: "calculate",
          answer: "4.275",
          hint: "Sum all avg_rating values and divide by number of books",
        },
        {
          id: "q3",
          question: "Which book has been borrowed most frequently?",
          type: "filter",
          answer: "Machine Learning",
          hint: "Find the book with maximum borrowed_times",
        },
        {
          id: "q4",
          question: "How many books have a rating above 4.0?",
          type: "count",
          answer: "6",
          hint: "Count books where avg_rating > 4.0",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 1080,
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: false,
    },
    isActive: true,
    sortOrder: 4,
  },

  {
    title: "Social Media Engagement Analytics",
    description:
      "Analyze social media post engagement using Python data structures",
    activityType: "data_exploration",
    category: "Python Fundamentals",
    difficulty: 4,
    diamondReward: 35,
    experienceReward: 75,
    estimatedMinutes: 30,
    tags: ["social-media", "engagement", "analytics", "advanced-collections"],
    content: {
      title: "Social Media Data Analysis",
      instructions:
        "Analyze social media engagement data to understand content performance",
      dataset: [
        {
          post_id: 1,
          platform: "Instagram",
          likes: 245,
          shares: 12,
          comments: 18,
          hashtags: ["#python", "#coding", "#tech"],
        },
        {
          post_id: 2,
          platform: "Twitter",
          likes: 89,
          shares: 24,
          comments: 8,
          hashtags: ["#programming", "#python"],
        },
        {
          post_id: 3,
          platform: "Instagram",
          likes: 156,
          shares: 6,
          comments: 12,
          hashtags: ["#data", "#science", "#python"],
        },
        {
          post_id: 4,
          platform: "Facebook",
          likes: 312,
          shares: 45,
          comments: 28,
          hashtags: ["#tech", "#innovation"],
        },
        {
          post_id: 5,
          platform: "Twitter",
          likes: 67,
          shares: 15,
          comments: 5,
          hashtags: ["#coding", "#tips"],
        },
        {
          post_id: 6,
          platform: "Instagram",
          likes: 198,
          shares: 8,
          comments: 15,
          hashtags: ["#python", "#tutorial"],
        },
        {
          post_id: 7,
          platform: "Facebook",
          likes: 278,
          shares: 32,
          comments: 22,
          hashtags: ["#programming", "#education"],
        },
        {
          post_id: 8,
          platform: "Twitter",
          likes: 134,
          shares: 28,
          comments: 11,
          hashtags: ["#tech", "#python", "#data"],
        },
      ],
      questions: [
        {
          id: "q1",
          question:
            "Which platform has the highest average engagement (likes + shares + comments)?",
          type: "analyze",
          answer: "Facebook",
          hint: "Calculate total engagement per platform and find the average",
        },
        {
          id: "q2",
          question:
            "What is the most frequently used hashtag across all posts?",
          type: "filter",
          answer: "#python",
          hint: "Count occurrences of each hashtag across all posts",
        },
        {
          id: "q3",
          question: "How many unique hashtags are used across all posts?",
          type: "count",
          answer: "9",
          hint: "Create a set of all hashtags and count unique ones",
        },
        {
          id: "q4",
          question: "What is the total number of likes across all platforms?",
          type: "calculate",
          answer: "1479",
          hint: "Sum all likes from all posts",
        },
        {
          id: "q5",
          question:
            "Which post has the highest engagement rate (total interactions)?",
          type: "analyze",
          answer: "4",
          hint: "Calculate likes + shares + comments for each post",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 1800,
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: true,
    },
    isActive: true,
    sortOrder: 5,
  },

  {
    title: "Employee Skills Inventory Analysis",
    description:
      "Analyze employee skills data to identify expertise gaps and strengths",
    activityType: "data_exploration",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 32,
    experienceReward: 68,
    estimatedMinutes: 26,
    tags: ["hr-analytics", "skills-analysis", "sets", "data-management"],
    content: {
      title: "Skills Gap Analysis",
      instructions:
        "Analyze employee skills to identify team strengths and training needs",
      dataset: [
        {
          employee_id: "E001",
          name: "Alice",
          department: "Engineering",
          skills: ["Python", "JavaScript", "SQL", "React"],
          experience_years: 5,
        },
        {
          employee_id: "E002",
          name: "Bob",
          department: "Engineering",
          skills: ["Java", "Python", "Docker", "AWS"],
          experience_years: 3,
        },
        {
          employee_id: "E003",
          name: "Charlie",
          department: "Design",
          skills: ["Photoshop", "Figma", "CSS", "JavaScript"],
          experience_years: 4,
        },
        {
          employee_id: "E004",
          name: "Diana",
          department: "Engineering",
          skills: ["Python", "Django", "PostgreSQL", "Redis"],
          experience_years: 6,
        },
        {
          employee_id: "E005",
          name: "Eve",
          department: "Marketing",
          skills: ["Analytics", "Python", "Tableau", "SQL"],
          experience_years: 2,
        },
        {
          employee_id: "E006",
          name: "Frank",
          department: "Engineering",
          skills: ["Go", "Kubernetes", "Docker", "AWS"],
          experience_years: 7,
        },
        {
          employee_id: "E007",
          name: "Grace",
          department: "Design",
          skills: ["Illustrator", "Figma", "CSS", "HTML"],
          experience_years: 3,
        },
      ],
      questions: [
        {
          id: "q1",
          question: "What is the most common skill across all employees?",
          type: "analyze",
          answer: "Python",
          hint: "Count occurrences of each skill across all employees",
        },
        {
          id: "q2",
          question: "How many unique skills are represented in the company?",
          type: "count",
          answer: "16",
          hint: "Create a set of all skills and count unique ones",
        },
        {
          id: "q3",
          question:
            "Which department has the most employees with Python skills?",
          type: "filter",
          answer: "Engineering",
          hint: "Filter employees with Python skill and group by department",
        },
        {
          id: "q4",
          question:
            "What is the average years of experience across all employees?",
          type: "calculate",
          answer: "4.29",
          hint: "Sum all experience_years and divide by number of employees",
        },
        {
          id: "q5",
          question: "Which skills are shared by exactly 2 employees?",
          type: "analyze",
          answer: "{'CSS', 'SQL', 'Figma', 'Docker', 'AWS'}",
          hint: "Count skill occurrences and filter those appearing exactly twice",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 1560,
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: true,
    },
    isActive: true,
    sortOrder: 6,
  },

  {
    title: "Movie Ratings and Genres Analysis",
    description:
      "Explore movie database to understand rating patterns and genre preferences",
    activityType: "data_exploration",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 29,
    experienceReward: 62,
    estimatedMinutes: 24,
    tags: ["entertainment-data", "ratings", "genres", "statistics"],
    content: {
      title: "Movie Database Analytics",
      instructions:
        "Analyze movie data to understand rating distributions and genre trends",
      dataset: [
        {
          movie_id: 1,
          title: "The Matrix",
          year: 1999,
          rating: 8.7,
          genres: ["Action", "Sci-Fi"],
          budget_millions: 63,
        },
        {
          movie_id: 2,
          title: "Inception",
          year: 2010,
          rating: 8.8,
          genres: ["Action", "Sci-Fi", "Thriller"],
          budget_millions: 160,
        },
        {
          movie_id: 3,
          title: "The Godfather",
          year: 1972,
          rating: 9.2,
          genres: ["Crime", "Drama"],
          budget_millions: 6,
        },
        {
          movie_id: 4,
          title: "Pulp Fiction",
          year: 1994,
          rating: 8.9,
          genres: ["Crime", "Drama"],
          budget_millions: 8,
        },
        {
          movie_id: 5,
          title: "Forrest Gump",
          year: 1994,
          rating: 8.8,
          genres: ["Drama", "Romance"],
          budget_millions: 55,
        },
        {
          movie_id: 6,
          title: "The Dark Knight",
          year: 2008,
          rating: 9.0,
          genres: ["Action", "Crime", "Drama"],
          budget_millions: 185,
        },
        {
          movie_id: 7,
          title: "Shrek",
          year: 2001,
          rating: 7.9,
          genres: ["Animation", "Comedy"],
          budget_millions: 60,
        },
        {
          movie_id: 8,
          title: "Avatar",
          year: 2009,
          rating: 7.8,
          genres: ["Action", "Adventure", "Sci-Fi"],
          budget_millions: 237,
        },
      ],
      questions: [
        {
          id: "q1",
          question: "What is the average movie rating across all films?",
          type: "calculate",
          answer: "8.6375",
          hint: "Sum all ratings and divide by number of movies",
        },
        {
          id: "q2",
          question: "Which genre appears most frequently across all movies?",
          type: "analyze",
          answer: "Action",
          hint: "Count occurrences of each genre across all movies",
        },
        {
          id: "q3",
          question: "What is the highest-rated movie?",
          type: "filter",
          answer: "The Godfather",
          hint: "Find the movie with the maximum rating",
        },
        {
          id: "q4",
          question: "How many movies were made in the 1990s?",
          type: "count",
          answer: "2",
          hint: "Count movies where year is between 1990-1999",
        },
        {
          id: "q5",
          question: "What is the average budget for Action movies?",
          type: "calculate",
          answer: "161.25",
          hint: "Filter Action movies and calculate average budget",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 1440,
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: true,
    },
    isActive: true,
    sortOrder: 7,
  },

  {
    title: "Online Course Completion Analytics",
    description:
      "Analyze student progress and completion rates in online learning platform",
    activityType: "data_exploration",
    category: "Python Fundamentals",
    difficulty: 4,
    diamondReward: 38,
    experienceReward: 80,
    estimatedMinutes: 28,
    tags: [
      "education-analytics",
      "completion-rates",
      "learning-data",
      "progress-tracking",
    ],
    content: {
      title: "Learning Platform Analytics",
      instructions:
        "Analyze course completion data to understand learning patterns and success rates",
      dataset: [
        {
          student_id: "S001",
          course: "Python Basics",
          progress_percent: 100,
          time_spent_hours: 25,
          completion_date: "2024-01-15",
        },
        {
          student_id: "S002",
          course: "Python Basics",
          progress_percent: 75,
          time_spent_hours: 18,
          completion_date: null,
        },
        {
          student_id: "S003",
          course: "Data Science",
          progress_percent: 100,
          time_spent_hours: 40,
          completion_date: "2024-01-20",
        },
        {
          student_id: "S001",
          course: "Web Development",
          progress_percent: 60,
          time_spent_hours: 22,
          completion_date: null,
        },
        {
          student_id: "S004",
          course: "Python Basics",
          progress_percent: 100,
          time_spent_hours: 30,
          completion_date: "2024-01-18",
        },
        {
          student_id: "S002",
          course: "Machine Learning",
          progress_percent: 45,
          time_spent_hours: 15,
          completion_date: null,
        },
        {
          student_id: "S005",
          course: "Data Science",
          progress_percent: 100,
          time_spent_hours: 35,
          completion_date: "2024-01-25",
        },
        {
          student_id: "S003",
          course: "Web Development",
          progress_percent: 80,
          time_spent_hours: 28,
          completion_date: null,
        },
        {
          student_id: "S006",
          course: "Python Basics",
          progress_percent: 100,
          time_spent_hours: 22,
          completion_date: "2024-01-12",
        },
        {
          student_id: "S004",
          course: "Machine Learning",
          progress_percent: 90,
          time_spent_hours: 32,
          completion_date: null,
        },
      ],
      questions: [
        {
          id: "q1",
          question:
            "What is the overall completion rate (percentage of courses completed)?",
          type: "calculate",
          answer: "50.0",
          hint: "Count completed courses (progress_percent = 100) and divide by total courses",
        },
        {
          id: "q2",
          question: "Which course has the highest completion rate?",
          type: "analyze",
          answer: "Python Basics",
          hint: "Calculate completion rate for each course separately",
        },
        {
          id: "q3",
          question: "What is the average time spent on completed courses?",
          type: "calculate",
          answer: "30.4",
          hint: "Filter completed courses and calculate average time_spent_hours",
        },
        {
          id: "q4",
          question: "How many unique students are in the dataset?",
          type: "count",
          answer: "6",
          hint: "Count distinct student_id values",
        },
        {
          id: "q5",
          question: "Which student has completed the most courses?",
          type: "analyze",
          answer: "Tie between S001, S003, S004, S005 (1 each)",
          hint: "Count completed courses per student",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 1680,
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: true,
    },
    isActive: true,
    sortOrder: 8,
  },

  {
    title: "Product Inventory Management Analysis",
    description:
      "Analyze warehouse inventory data to optimize stock levels and identify trends",
    activityType: "data_exploration",
    category: "Python Fundamentals",
    difficulty: 3,
    diamondReward: 31,
    experienceReward: 66,
    estimatedMinutes: 25,
    tags: [
      "inventory-management",
      "supply-chain",
      "stock-analysis",
      "business-intelligence",
    ],
    content: {
      title: "Inventory Optimization Analytics",
      instructions:
        "Analyze inventory data to identify stock patterns and optimization opportunities",
      dataset: [
        {
          product_id: "P001",
          name: "Wireless Mouse",
          category: "Electronics",
          stock_level: 45,
          reorder_point: 20,
          unit_cost: 15.99,
          supplier: "TechCorp",
        },
        {
          product_id: "P002",
          name: "Office Chair",
          category: "Furniture",
          stock_level: 8,
          reorder_point: 15,
          unit_cost: 199.99,
          supplier: "FurniMax",
        },
        {
          product_id: "P003",
          name: "Laptop Stand",
          category: "Electronics",
          stock_level: 32,
          reorder_point: 10,
          unit_cost: 29.99,
          supplier: "TechCorp",
        },
        {
          product_id: "P004",
          name: "Desk Lamp",
          category: "Furniture",
          stock_level: 12,
          reorder_point: 8,
          unit_cost: 45.99,
          supplier: "LightPro",
        },
        {
          product_id: "P005",
          name: "USB Cable",
          category: "Electronics",
          stock_level: 150,
          reorder_point: 50,
          unit_cost: 8.99,
          supplier: "CableCo",
        },
        {
          product_id: "P006",
          name: "Bookshelf",
          category: "Furniture",
          stock_level: 5,
          reorder_point: 12,
          unit_cost: 89.99,
          supplier: "FurniMax",
        },
        {
          product_id: "P007",
          name: "Keyboard",
          category: "Electronics",
          stock_level: 28,
          reorder_point: 15,
          unit_cost: 49.99,
          supplier: "TechCorp",
        },
        {
          product_id: "P008",
          name: "Monitor",
          category: "Electronics",
          stock_level: 18,
          reorder_point: 8,
          unit_cost: 249.99,
          supplier: "DisplayTech",
        },
      ],
      questions: [
        {
          id: "q1",
          question:
            "How many products are currently below their reorder point?",
          type: "count",
          answer: "2",
          hint: "Count products where stock_level < reorder_point",
        },
        {
          id: "q2",
          question:
            "What is the total inventory value (stock_level * unit_cost) for Electronics?",
          type: "calculate",
          answer: "8521.23",
          hint: "Filter Electronics products and sum (stock_level * unit_cost)",
        },
        {
          id: "q3",
          question: "Which supplier provides the most products?",
          type: "analyze",
          answer: "TechCorp",
          hint: "Count products per supplier and find the maximum",
        },
        {
          id: "q4",
          question: "What is the average unit cost across all products?",
          type: "calculate",
          answer: "85.99",
          hint: "Sum all unit_cost values and divide by number of products",
        },
        {
          id: "q5",
          question: "Which category has the highest total stock levels?",
          type: "analyze",
          answer: "Electronics",
          hint: "Sum stock_level for each category and compare",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 1500,
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: true,
    },
    isActive: true,
    sortOrder: 9,
  },

  {
    title: "Sports Team Performance Analytics",
    description:
      "Analyze sports team statistics to understand performance patterns and player contributions",
    activityType: "data_exploration",
    category: "Python Fundamentals",
    difficulty: 4,
    diamondReward: 42,
    experienceReward: 88,
    estimatedMinutes: 32,
    tags: [
      "sports-analytics",
      "performance-metrics",
      "team-analysis",
      "statistics",
    ],
    content: {
      title: "Team Performance Analysis",
      instructions:
        "Analyze basketball team statistics to evaluate player performance and team dynamics",
      dataset: [
        {
          player_id: 1,
          name: "Alex Johnson",
          position: "Guard",
          games_played: 28,
          points_per_game: 18.5,
          assists_per_game: 6.2,
          rebounds_per_game: 4.1,
        },
        {
          player_id: 2,
          name: "Marcus Davis",
          position: "Forward",
          games_played: 30,
          points_per_game: 22.8,
          assists_per_game: 3.1,
          rebounds_per_game: 8.7,
        },
        {
          player_id: 3,
          name: "Chris Wilson",
          position: "Center",
          games_played: 25,
          points_per_game: 15.2,
          assists_per_game: 1.8,
          rebounds_per_game: 11.4,
        },
        {
          player_id: 4,
          name: "Jordan Smith",
          position: "Guard",
          games_played: 32,
          points_per_game: 14.7,
          assists_per_game: 7.8,
          rebounds_per_game: 3.2,
        },
        {
          player_id: 5,
          name: "Tyler Brown",
          position: "Forward",
          games_played: 29,
          points_per_game: 19.3,
          assists_per_game: 4.5,
          rebounds_per_game: 7.1,
        },
        {
          player_id: 6,
          name: "Ryan Miller",
          position: "Center",
          games_played: 27,
          points_per_game: 12.1,
          assists_per_game: 2.3,
          rebounds_per_game: 9.8,
        },
        {
          player_id: 7,
          name: "Kevin Lee",
          position: "Guard",
          games_played: 31,
          points_per_game: 16.9,
          assists_per_game: 5.4,
          rebounds_per_game: 3.8,
        },
        {
          player_id: 8,
          name: "David Garcia",
          position: "Forward",
          games_played: 26,
          points_per_game: 11.8,
          assists_per_game: 2.9,
          rebounds_per_game: 6.3,
        },
      ],
      questions: [
        {
          id: "q1",
          question:
            "Who is the team's leading scorer (highest points per game)?",
          type: "filter",
          answer: "Marcus Davis",
          hint: "Find the player with maximum points_per_game",
        },
        {
          id: "q2",
          question: "What is the average points per game for all Guards?",
          type: "calculate",
          answer: "16.7",
          hint: "Filter players by position = 'Guard' and calculate average points_per_game",
        },
        {
          id: "q3",
          question: "Which position has the highest average rebounds per game?",
          type: "analyze",
          answer: "Center",
          hint: "Group players by position and calculate average rebounds_per_game for each",
        },
        {
          id: "q4",
          question: "How many players have played in all 32 possible games?",
          type: "count",
          answer: "2",
          hint: "Count players where games_played = 32",
        },
        {
          id: "q5",
          question:
            "What is the total team points per game (sum of all players' points per game)?",
          type: "calculate",
          answer: "131.3",
          hint: "Sum all points_per_game values across all players",
        },
        {
          id: "q6",
          question:
            "Who has the best assist-to-turnover efficiency (highest assists per game)?",
          type: "filter",
          answer: "Jordan Smith",
          hint: "Find the player with maximum assists_per_game",
        },
      ],
      allowExport: true,
    },
    settings: {
      timeLimit: 1920,
      allowCalculator: true,
      showDataPreview: true,
      providePseudocode: true,
    },
    isActive: true,
    sortOrder: 10,
  },
];

// Export function to seed the activities
export async function seedDataExplorationActivities() {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  try {
    console.log("🔍 Seeding DATA_EXPLORATION activities...");

    for (const activity of dataExplorationPythonFundamentalsActivities) {
      await prisma.learningActivity.create({
        data: {
          title: activity.title,
          description: activity.description,
          activityType: activity.activityType,
          category: activity.category,
          difficulty: activity.difficulty,
          diamondReward: activity.diamondReward,
          experienceReward: activity.experienceReward,
          estimatedMinutes: activity.estimatedMinutes,
          content: JSON.stringify(activity.content),
          tags: JSON.stringify(activity.tags),
          isActive: activity.isActive,
          sortOrder: activity.sortOrder,
        },
      });
      console.log(`✅ Created: ${activity.title}`);
    }

    console.log(
      `🎉 Successfully seeded ${dataExplorationPythonFundamentalsActivities.length} DATA_EXPLORATION activities!`
    );
  } catch (error) {
    console.error("❌ Error seeding DATA_EXPLORATION activities:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDataExplorationActivities()
    .then(() => {
      console.log("DATA_EXPLORATION activities seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Failed to seed DATA_EXPLORATION activities:", error);
      process.exit(1);
    });
}
