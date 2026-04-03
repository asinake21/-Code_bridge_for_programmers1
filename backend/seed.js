const mongoose = require('mongoose');
const Course = require('./models/Course');
require('dotenv').config();

const coursesData = [
  // Frontend Development
  {
    title: "HTML Fundamentals",
    category: "Frontend Development",
    level: "Beginner",
    description: "Learn the core structure of the web by mastering HTML5 tags, forms, and semantics.",
    icon: "Layout",
    modules: 5,
    duration: "2 weeks"
  },
  {
    title: "CSS & Responsive Design",
    category: "Frontend Development",
    level: "Beginner",
    description: "Style websites beautifully and build fully responsive layouts using Flexbox and Grid.",
    icon: "Monitor",
    modules: 8,
    duration: "3 weeks"
  },
  {
    title: "JavaScript Essentials",
    category: "Frontend Development",
    level: "Beginner",
    description: "Master the language of the web. Learn variables, loops, arrays, and DOM manipulation.",
    icon: "Code",
    modules: 12,
    duration: "4 weeks"
  },
  {
    title: "React Development",
    category: "Frontend Development",
    level: "Intermediate",
    description: "Build modern UI with React. Understand components, state, hooks, and routing.",
    icon: "Layers",
    modules: 15,
    duration: "6 weeks"
  },
  {
    title: "TypeScript Basics",
    category: "Frontend Development",
    level: "Intermediate",
    description: "Add robust static typing to Javascript projects to prevent bugs and improve architecture.",
    icon: "Code",
    modules: 6,
    duration: "2 weeks"
  },

  // Backend Development
  {
    title: "Node.js Fundamentals",
    category: "Backend Development",
    level: "Intermediate",
    description: "Run Javascript on the server. Understand the event loop, modules, and file operations.",
    icon: "Server",
    modules: 10,
    duration: "4 weeks"
  },
  {
    title: "Express.js API Development",
    category: "Backend Development",
    level: "Intermediate",
    description: "Build fast and scalable web servers and RESTful APIs using the Express framework.",
    icon: "Globe",
    modules: 8,
    duration: "3 weeks"
  },
  {
    title: "REST APIs",
    category: "Backend Development",
    level: "Intermediate",
    description: "Master API design principles, status codes, routing, and HTTP methods.",
    icon: "Share2",
    modules: 5,
    duration: "2 weeks"
  },
  {
    title: "Authentication (JWT)",
    category: "Backend Development",
    level: "Advanced",
    description: "Secure your applications with JSON Web Tokens, hashing, and authorization middleware.",
    icon: "Lock",
    modules: 6,
    duration: "3 weeks"
  },

  // Databases
  {
    title: "MongoDB Basics",
    category: "Databases",
    level: "Beginner",
    description: "Learn NoSQL database concepts, CRUD operations, and document-oriented storage.",
    icon: "Database",
    modules: 7,
    duration: "3 weeks"
  },
  {
    title: "Mongoose",
    category: "Databases",
    level: "Intermediate",
    description: "Model your application data with Mongoose schemas and relationships.",
    icon: "Box",
    modules: 8,
    duration: "3 weeks"
  },
  {
    title: "SQL Fundamentals",
    category: "Databases",
    level: "Beginner",
    description: "Master relational databases. Learn queries, joins, filtering, and aggregation.",
    icon: "Table",
    modules: 10,
    duration: "4 weeks"
  },
  {
    title: "Database Design",
    category: "Databases",
    level: "Advanced",
    description: "Architect efficient databases, normalize data, and optimize query performance.",
    icon: "GitMerge",
    modules: 6,
    duration: "3 weeks"
  },

  // Full Stack Development
  {
    title: "MERN Stack",
    category: "Full Stack Development",
    level: "Advanced",
    description: "Connect MongoDB, Express, React, and Node into a cohesive full-stack application.",
    icon: "Layers",
    modules: 15,
    duration: "8 weeks"
  },
  {
    title: "Full Stack Projects",
    category: "Full Stack Development",
    level: "Advanced",
    description: "Build and deploy 3 real-world full-stack applications from scratch.",
    icon: "Briefcase",
    modules: 12,
    duration: "6 weeks"
  },
  {
    title: "Deployment",
    category: "Full Stack Development",
    level: "Advanced",
    description: "Deploy scalable applications to the cloud using AWS, Vercel, and continuous integration.",
    icon: "Server", // Changed from CloudUpload to Server as fallback
    modules: 5,
    duration: "2 weeks"
  },

  // Programming Foundations
  {
    title: "Programming Basics",
    category: "Programming Foundations",
    level: "Beginner",
    description: "A universal introduction to programming concepts for absolute beginners.",
    icon: "Terminal",
    modules: 10,
    duration: "4 weeks"
  },
  {
    title: "Problem Solving",
    category: "Programming Foundations",
    level: "Beginner",
    description: "Learn how to break large problems into manageable, logical pieces.",
    icon: "Network",
    modules: 8,
    duration: "3 weeks"
  },
  {
    title: "Data Structures",
    category: "Programming Foundations",
    level: "Intermediate",
    description: "Master arrays, linked lists, hash tables, trees, and graphs.",
    icon: "Network",
    modules: 12,
    duration: "5 weeks"
  },
  {
    title: "Algorithms",
    category: "Programming Foundations",
    level: "Advanced",
    description: "Study sorting, searching, recursion, and algorithm efficiency (Big O).",
    icon: "Activity",
    modules: 14,
    duration: "6 weeks"
  }
];

const seedDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codebridge';
    console.log('Connecting to MongoDB at', uri);
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB. Clearing existing courses...');
    
    await Course.deleteMany({});
    
    console.log('Inserting full courses list...');
    
    const formattedCourses = coursesData.map(course => {
      // Create a dummy array of modules based on the modules integer
      const moduleArray = Array.from({ length: course.modules || 3 }).map((_, i) => ({
        title: 'Module ' + (i + 1),
        duration: '1 hour',
        topics: ['Overview', 'Practice']
      }));
      
      return {
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        duration: course.duration,
        icon: course.icon,
        modules: moduleArray,
        notes: '# ' + course.title + '\n\nWelcome to ' + course.title + '.'
      };
    });

    await Course.insertMany(formattedCourses);
    
    console.log('Database Seeded Successfully with ' + formattedCourses.length + ' courses!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
