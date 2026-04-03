import { Layout, Monitor, Code, Layers, Server, Globe, Share2, Lock, Database, Box, Table, GitMerge, Briefcase, Terminal, Network, Activity } from 'lucide-react'

// Map of string icon names to Lucide components for dynamic rendering
export const iconMap = {
  Layout: Layout,
  Monitor: Monitor,
  Code: Code,
  Layers: Layers,
  CodeSquare: Code, // Using code as fallback
  Server: Server,
  Globe: Globe,
  Share2: Share2,
  Lock: Lock,
  Database: Database,
  Box: Box,
  Table: Table,
  GitMerge: GitMerge,
  Briefcase: Briefcase,
  CloudUpload: Server, // fallback to Server
  Terminal: Terminal,
  BrainCircuit: Network, // Using network as fallback
  Network: Network,
  Activity: Activity
}

export const coursesData = [
  // Frontend Development
  {
    id: "html-fundamentals",
    title: "HTML Fundamentals",
    category: "Frontend Development",
    level: "Beginner",
    description: "Learn the core structure of the web by mastering HTML5 tags, forms, and semantics.",
    icon: "Layout",
    modules: 5,
    duration: "2 weeks"
  },
  {
    id: "css-responsive",
    title: "CSS & Responsive Design",
    category: "Frontend Development",
    level: "Beginner",
    description: "Style websites beautifully and build fully responsive layouts using Flexbox and Grid.",
    icon: "Monitor",
    modules: 8,
    duration: "3 weeks"
  },
  {
    id: "js-essentials",
    title: "JavaScript Essentials",
    category: "Frontend Development",
    level: "Beginner",
    description: "Master the language of the web. Learn variables, loops, arrays, and DOM manipulation.",
    icon: "Code",
    modules: 12,
    duration: "4 weeks"
  },
  {
    id: "react-dev",
    title: "React Development",
    category: "Frontend Development",
    level: "Intermediate",
    description: "Build modern UI with React. Understand components, state, hooks, and routing.",
    icon: "Layers",
    modules: 15,
    duration: "6 weeks"
  },
  {
    id: "ts-basics",
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
    id: "node-fundamentals",
    title: "Node.js Fundamentals",
    category: "Backend Development",
    level: "Intermediate",
    description: "Run Javascript on the server. Understand the event loop, modules, and file operations.",
    icon: "Server",
    modules: 10,
    duration: "4 weeks"
  },
  {
    id: "express-api",
    title: "Express.js API Development",
    category: "Backend Development",
    level: "Intermediate",
    description: "Build fast and scalable web servers and RESTful APIs using the Express framework.",
    icon: "Globe",
    modules: 8,
    duration: "3 weeks"
  },
  {
    id: "rest-apis",
    title: "REST APIs",
    category: "Backend Development",
    level: "Intermediate",
    description: "Master API design principles, status codes, routing, and HTTP methods.",
    icon: "Share2",
    modules: 5,
    duration: "2 weeks"
  },
  {
    id: "jwt-auth",
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
    id: "mongodb-basics",
    title: "MongoDB Basics",
    category: "Databases",
    level: "Beginner",
    description: "Learn NoSQL database concepts, CRUD operations, and document-oriented storage.",
    icon: "Database",
    modules: 7,
    duration: "3 weeks"
  },
  {
    id: "mongoose-orm",
    title: "Mongoose",
    category: "Databases",
    level: "Intermediate",
    description: "Model your application data with Mongoose schemas and relationships.",
    icon: "Box",
    modules: 8,
    duration: "3 weeks"
  },
  {
    id: "sql-fundamentals",
    title: "SQL Fundamentals",
    category: "Databases",
    level: "Beginner",
    description: "Master relational databases. Learn queries, joins, filtering, and aggregation.",
    icon: "Table",
    modules: 10,
    duration: "4 weeks"
  },
  {
    id: "db-design",
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
    id: "mern-stack",
    title: "MERN Stack",
    category: "Full Stack Development",
    level: "Advanced",
    description: "Connect MongoDB, Express, React, and Node into a cohesive full-stack application.",
    icon: "Layers",
    modules: 15,
    duration: "8 weeks"
  },
  {
    id: "fullstack-projects",
    title: "Full Stack Projects",
    category: "Full Stack Development",
    level: "Advanced",
    description: "Build and deploy 3 real-world full-stack applications from scratch.",
    icon: "Briefcase",
    modules: 12,
    duration: "6 weeks"
  },
  {
    id: "deployment",
    title: "Deployment",
    category: "Full Stack Development",
    level: "Advanced",
    description: "Deploy scalable applications to the cloud using AWS, Vercel, and continuous integration.",
    icon: "CloudUpload",
    modules: 5,
    duration: "2 weeks"
  },

  // Programming Foundations
  {
    id: "programming-basics",
    title: "Programming Basics",
    category: "Programming Foundations",
    level: "Beginner",
    description: "A universal introduction to programming concepts for absolute beginners.",
    icon: "Terminal",
    modules: 10,
    duration: "4 weeks"
  },
  {
    id: "problem-solving",
    title: "Problem Solving",
    category: "Programming Foundations",
    level: "Beginner",
    description: "Learn how to break large problems into manageable, logical pieces.",
    icon: "Network",
    modules: 8,
    duration: "3 weeks"
  },
  {
    id: "data-structures",
    title: "Data Structures",
    category: "Programming Foundations",
    level: "Intermediate",
    description: "Master arrays, linked lists, hash tables, trees, and graphs.",
    icon: "Network",
    modules: 12,
    duration: "5 weeks"
  },
  {
    id: "algorithms",
    title: "Algorithms",
    category: "Programming Foundations",
    level: "Advanced",
    description: "Study sorting, searching, recursion, and algorithm efficiency (Big O).",
    icon: "Activity",
    modules: 14,
    duration: "6 weeks"
  }
];

export const getCategories = () => {
  return [...new Set(coursesData.map(course => course.category))];
};