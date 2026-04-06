const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');

dotenv.config();

const courses = [
  {
    title: "HTML Foundation",
    description: "Learn the core structure of the web. Perfect for absolute beginners starting their coding journey in Ethiopia.",
    level: "Beginner",
    section: "Frontend Development",
    duration: "4 Weeks",
    modulesCount: 4,
    icon: "Layout",
    order: 1,
    weeks: [
      {
        title: "Introduction to HTML",
        lessons: [
          { title: "What is HTML?", videoUrl: "https://www.youtube.com/embed/qz0aGYMCzl0", notes_en: "HTML stands for HyperText Markup Language.", notes_am: "HTML ማለት የድረ-ገጽ መዋቅር መገንቢያ ቋንቋ ነው።" },
          { title: "HTML Basic Tags", videoUrl: "https://www.youtube.com/embed/kUMe1FH4CHE", notes_en: "Learn about h1, p, and div tags.", notes_am: "ስለ h1፣ p እና div ታጎች ይማሩ።" }
        ]
      },
      {
        title: "Lists and Links",
        lessons: [
          { title: "Ordered & Unordered Lists", videoUrl: "https://www.youtube.com/embed/09oErCBjVns" },
          { title: "Hyperlinks (a tag)", videoUrl: "https://www.youtube.com/embed/XKoXv-R-pEY" }
        ]
      },
      {
        title: "Images and Multimedia",
        lessons: [
          { title: "Adding Images", videoUrl: "https://www.youtube.com/embed/7S8YpG_o_QU" }
        ]
      },
      {
        title: "Forms and Tables",
        lessons: [
          { title: "HTML Forms", videoUrl: "https://www.youtube.com/embed/fNcJuPIZ2WE" }
        ]
      }
    ]
  },
  {
    title: "CSS Styles Mastery",
    description: "Design beautiful, modern websites. Master CSS layouts, animations, and responsive design for every device.",
    level: "Beginner",
    section: "Frontend Development",
    duration: "5 Weeks",
    modulesCount: 4,
    icon: "Monitor",
    order: 2,
    weeks: [
      {
        title: "CSS Basics",
        lessons: [
          { title: "Selectors & Colors", videoUrl: "https://www.youtube.com/embed/wNX7OJR68fE" }
        ]
      },
      {
        title: "Box Model",
        lessons: [
          { title: "Margin, Padding, Border", videoUrl: "https://www.youtube.com/embed/nSst4-W0_mU" }
        ]
      },
      {
        title: "Flexbox Layout",
        lessons: [
          { title: "Flex Direction & Justify", videoUrl: "https://www.youtube.com/embed/fYq5PXgSsbE" }
        ]
      },
      {
        title: "CSS Grid",
        lessons: [
          { title: "Grid Template Columns", videoUrl: "https://www.youtube.com/embed/68O6eOGitqA" }
        ]
      }
    ]
  },
  {
    title: "JavaScript Essentials",
    description: "Add logic to your web applications. Learn variables, functions, and DOM manipulation basics.",
    level: "Beginner",
    section: "Programming Languages",
    duration: "6 Weeks",
    modulesCount: 4,
    icon: "Code",
    order: 3,
    weeks: [
      { title: "JS Fundamentals", lessons: [{ title: "Variables & Data Types", videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk" }] },
      { title: "Control Flow", lessons: [{ title: "If/Else & Loops", videoUrl: "https://www.youtube.com/embed/s9wW2PpJsmQ" }] },
      { title: "Functions & Objects", lessons: [{ title: "Basic Functions", videoUrl: "https://www.youtube.com/embed/xK2fGZz_Z4Y" }] },
      { title: "DOM Manipulation", lessons: [{ title: "Selecting Elements", videoUrl: "https://www.youtube.com/embed/5fb2aPlgoys" }] }
    ]
  },
  {
    title: "React Library",
    description: "Build interactive user interfaces with the most popular JavaScript framework used by top companies.",
    level: "Intermediate",
    section: "Frontend Development",
    duration: "8 Weeks",
    modulesCount: 4,
    icon: "Layout",
    order: 4,
    weeks: [
      { title: "React Basics", lessons: [{ title: "Components & Props", videoUrl: "https://www.youtube.com/embed/Ke90Tje7VS0" }] },
      { title: "State & Hooks", lessons: [{ title: "useState & useEffect", videoUrl: "https://www.youtube.com/embed/O6P86uwfdO0" }] },
      { title: "React Router", lessons: [{ title: "Navigation in React", videoUrl: "https://www.youtube.com/embed/Law7wreGuix" }] },
      { title: "APIs in React", lessons: [{ title: "Fetching Data", videoUrl: "https://www.youtube.com/embed/ZVnjOPwW4Zg" }] }
    ]
  },
  {
    title: "Node.js Backend",
    description: "Create scalable server-side applications using JavaScript. Master Express.js and server logic.",
    level: "Intermediate",
    section: "Backend Development",
    duration: "6 Weeks",
    modulesCount: 4,
    icon: "Server",
    order: 5,
    weeks: [
      { title: "Node Basics", lessons: [{ title: "Modules & NPM", videoUrl: "https://www.youtube.com/embed/fBNz5xF-Kx4" }] },
      { title: "Express.js", lessons: [{ title: "Routes & Controllers", videoUrl: "https://www.youtube.com/embed/SccSCuHhOw0" }] },
      { title: "Middleware", lessons: [{ title: "Custom Middleware", videoUrl: "https://www.youtube.com/embed/lY6icfhap2o" }] },
      { title: "Authentication", lessons: [{ title: "JWT & Bcrypt", videoUrl: "https://www.youtube.com/embed/mbsmsi7l3r4" }] }
    ]
  },
  {
    title: "Python for Data",
    description: "Start your Data Science or AI journey with Python. Clear, readable, and incredibly powerful coding.",
    level: "Beginner",
    section: "Programming Languages",
    duration: "6 Weeks",
    modulesCount: 4,
    icon: "Terminal",
    order: 6,
    weeks: [
      { title: "Python Basics", lessons: [{ title: "Syntax & Variables", videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8" }] },
      { title: "Data Structures", lessons: [{ title: "Lists & Dictionaries", videoUrl: "https://www.youtube.com/embed/mbsmsi7l3r4" }] },
      { title: "Control Flow", lessons: [{ title: "Iterating with Loops", videoUrl: "https://www.youtube.com/embed/6iF8Xh7Z3wI" }] },
      { title: "PIP & Libraries", lessons: [{ title: "Using External Packages", videoUrl: "https://www.youtube.com/embed/Z0p988C7yC4" }] }
    ]
  },
  {
    title: "Git & GitHub",
    description: "Master version control. Collaborate with developers and manage your code professionally.",
    level: "Beginner",
    section: "Programming Languages",
    duration: "3 Weeks",
    modulesCount: 4,
    icon: "Code",
    order: 7,
    weeks: [
      { title: "Git Basics", lessons: [{ title: "Commit & Push", videoUrl: "https://www.youtube.com/embed/8JJ101D3knE" }] },
      { title: "Branching", lessons: [{ title: "Conflict Resolution", videoUrl: "https://www.youtube.com/embed/oPpnCh7InLY" }] },
      { title: "GitHub Flow", lessons: [{ title: "Pull Requests", videoUrl: "https://www.youtube.com/embed/RGOj5yH7evk" }] },
      { title: "Advanced Git", lessons: [{ title: "Rebase & Stash", videoUrl: "https://www.youtube.com/embed/ZDR433b0HJY" }] }
    ]
  },
  {
    title: "SQL Databases",
    description: "Learn to manage and query relational databases. Master PostgreSQL and MySQL for real applications.",
    level: "Beginner",
    section: "Database",
    duration: "4 Weeks",
    modulesCount: 4,
    icon: "Database",
    order: 8,
    weeks: [
      { title: "SQL Basics", lessons: [{ title: "Select & Joins", videoUrl: "https://www.youtube.com/embed/HXV3zeQKqGY" }] },
      { title: "Data Modeling", lessons: [{ title: "Normal Forms", videoUrl: "https://www.youtube.com/embed/5_VnJv9fH_c" }] },
      { title: "Indexing", lessons: [{ title: "Query Performance", videoUrl: "https://www.youtube.com/embed/787Scl2i-tI" }] },
      { title: "Advanced SQL", lessons: [{ title: "Stored Procedures", videoUrl: "https://www.youtube.com/embed/9N8aHAtIrV4" }] }
    ]
  },
  {
    title: "Tailwind Styling",
    description: "Learn utility-first CSS. Build modern responsive UIs faster than ever before.",
    level: "Intermediate",
    section: "Frontend Development",
    duration: "2 Weeks",
    modulesCount: 4,
    icon: "Monitor",
    order: 9,
    weeks: [
      { title: "Utility First", lessons: [{ title: "Layout & Spacing", videoUrl: "https://www.youtube.com/embed/ft3091N858U" }] },
      { title: "Responsive", lessons: [{ title: "Mobile First Design", videoUrl: "https://www.youtube.com/embed/L_fIOfX5Ums" }] },
      { title: "Customizing", lessons: [{ title: "Tailwind Config", videoUrl: "https://www.youtube.com/embed/mSC6Gsenzfg" }] },
      { title: "Project Home", lessons: [{ title: "Building a Landing Page", videoUrl: "https://www.youtube.com/embed/ft3091N858U" }] }
    ]
  },
  {
    title: "Java Fundamentals",
    description: "The enterprise-standard language. Master Object-Oriented Programming (OOP) with Java.",
    level: "Advanced",
    section: "Programming Languages",
    duration: "10 Weeks",
    modulesCount: 4,
    icon: "Terminal",
    order: 10,
    weeks: [
      { title: "Java Syntax", lessons: [{ title: "Static vs Instance", videoUrl: "https://www.youtube.com/embed/9M5I8tOf78Y" }] },
      { title: "OOP Concepts", lessons: [{ title: "Inheritance & Polymorphism", videoUrl: "https://www.youtube.com/embed/9M5I8tOf78Y" }] },
      { title: "Collections", lessons: [{ title: "Lists, Sets, Maps", videoUrl: "https://www.youtube.com/embed/9M5I8tOf78Y" }] },
      { title: "Spring Boot", lessons: [{ title: "Introduction to Enterprise Apps", videoUrl: "https://www.youtube.com/embed/9M5I8tOf78Y" }] }
    ]
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
  await Course.deleteMany({});
  console.log("Old courses deleted");
  await Course.insertMany(courses);
  console.log(`${courses.length} courses seeded successfully!`);
  process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
