require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./models/Course');
const Lesson = require('./models/Lesson');
const Quiz = require('./models/Quiz');
const Progress = require('./models/Progress');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codebridge';

const coursesData = [
  { title: 'HTML', description: 'Learn the core markup structure of the web.', level: 'Beginner', section: 'Frontend Development', duration: '1 week', modulesCount: 4, icon: 'Layout', order: 1 },
  { title: 'CSS', description: 'Design beautiful and responsive layouts.', level: 'Beginner', section: 'Frontend Development', duration: '2 weeks', modulesCount: 6, icon: 'Monitor', order: 2 },
  { title: 'JavaScript', description: 'Master the logic and interactivity of the web.', level: 'Beginner', section: 'Frontend Development', duration: '4 weeks', modulesCount: 12, icon: 'Code', order: 3 },
  { title: 'React', description: 'Build scalable Single Page Applications.', level: 'Intermediate', section: 'Frontend Development', duration: '6 weeks', modulesCount: 15, icon: 'Code', order: 4 },
  { title: 'Node.js', description: 'Server-side JavaScript environment.', level: 'Intermediate', section: 'Backend Development', duration: '3 weeks', modulesCount: 10, icon: 'Server', order: 5 },
  { title: 'MongoDB', description: 'NoSQL document-based scalable database.', level: 'Intermediate', section: 'Database', duration: '2 weeks', modulesCount: 6, icon: 'Database', order: 6 },
  { title: 'PHP', description: 'Dynamic server-side scripting language.', level: 'Intermediate', section: 'Backend Development', duration: '3 weeks', modulesCount: 8, icon: 'Globe', order: 7 },
  { title: 'Python', description: 'Versatile language for backend, AI, and scripting.', level: 'Intermediate', section: 'Programming Languages', duration: '4 weeks', modulesCount: 10, icon: 'Terminal', order: 8 },
  { title: 'Java', description: 'Object-oriented, robust backend programming.', level: 'Advanced', section: 'Programming Languages', duration: '5 weeks', modulesCount: 14, icon: 'Code', order: 9 },
  { title: 'C++', description: 'High-performance systems and application programming.', level: 'Advanced', section: 'Programming Languages', duration: '6 weeks', modulesCount: 16, icon: 'Terminal', order: 10 }
];

const mdnLessons = {
  'HTML': [
    {
      title: 'Introduction to HTML',
      content_en: 'HTML (HyperText Markup Language) is the most basic building block of the Web. It defines the meaning and structure of web content. Other technologies besides HTML are generally used to describe a web page\'s appearance/presentation (CSS) or functionality/behavior (JavaScript).\n\n"Hypertext" refers to links that connect web pages to one another, either within a single website or between websites. Links are a fundamental aspect of the Web. By uploading content to the Internet and linking it to pages created by other people, you become an active participant in the World Wide Web.',
      content_am: 'ኤችቲኤምኤል (HTML) የድረ-ገጽ መሠረታዊ መዋቅር ነው። የድረ-ገጽ ይዘትን ስም እና አወቃቀር ይገልጻል። ከኤችቲኤምኤል በተጨማሪ ሌሎች ቴክኖሎጂዎች አብዛኛውን ጊዜ የድረ-ገጽን ገጽታ (CSS) ወይም የስራ ባህሪ (JavaScript) ለመግለጽ ያገለግላሉ።\n\nበድረ-ገጾች መካከል ያለውን ግንኙነት ያሳያል። ይዘትን በመጫን እና ከሌሎች ሰዎች ጋር በማገናኘት በድረ-ገጽ አለም ላይ ንቁ ተሳታፊ መሆን ይችላሉ።',
      exampleCode: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Hello World</title>\n  </head>\n  <body>\n    <h1>Hello World</h1>\n    <p>This is a paragraph.</p>\n  </body>\n</html>',
      mdnLink: 'https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML',
      videoUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU',
      order: 1
    }
  ],
  'CSS': [
    {
      title: 'CSS Basics',
      content_en: 'CSS (Cascading Style Sheets) is the code that styles web content. CSS basics walks you through what you need to get started. We\'ll answer questions like: How do I make text red? How do I make content display at a certain location in the (webpage) layout? How do I decorate my webpage with background images and colors?',
      content_am: 'የካስኬዲንግ ስታይል ሺትስ (CSS) የድረ-ገጽ ይዘትን ለማሳመር የሚያገለግል ኮድ ነው። የ CSS መሠረታዊ ነገሮች ለመጀመር የሚያስፈልግዎትን ነገር ያሳያል። ለምሳሌ፡ ጽሑፍን እንዴት ቀይ አደርጋለሁ? ይዘትን በተወሰነ ቦታ ላይ እንዴት አሳያለሁ? አስተዳደግን እና ቀለሞችን በመጠቀም ድረ-ገጼን እንዴት አሳምራለሁ?',
      exampleCode: 'body {\n  background-color: lightblue;\n}\n\nh1 {\n  color: white;\n  text-align: center;\n}\n\np {\n  font-family: verdana;\n  font-size: 20px;\n}',
      mdnLink: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/First_steps/What_is_CSS',
      videoUrl: 'https://www.youtube.com/embed/1Rs2ND1ryYc',
      order: 1
    }
  ],
  'JavaScript': [
    {
      title: 'JavaScript First Steps',
      content_en: 'JavaScript is a robust programming language that can be applied to an HTML document and used to create dynamic interactivity on websites. It was invented by Brendan Eich, co-founder of the Mozilla project, the Mozilla Foundation, and the Mozilla Corporation.\n\nJavaScript is incredibly versatile. You can start small, with carousels, image galleries, fluctuating layouts, and responses to button clicks.',
      content_am: 'ጃቫስክሪፕት (JavaScript) በኤችቲኤምኤል ሰነድ ላይ ተግባራዊ ሊሆን የሚችል እና በድረ-ገጾች ላይ ተለዋዋጭ መስተጋብር ለመፍጠር የሚያገለግል ኃይለኛ የፕሮግራም አወጣጥ ቋንቋ ነው። ይህ ኮድ በሞዚላ ፕሮጀክት ተባባሪ መስራች በብሬንዳን ኢች ተፈጠረ።\n\nጃቫስክሪፕት በጣም ብዙ ነገሮችን መስራት ይችላል። በአዝራር ጠቅታዎች አማካኝነት ምስሎችን መቀያየር እና የድረ-ገጽ አቀማመጦችን ማስተካከል ያስችላል።',
      exampleCode: 'const myHeading = document.querySelector("h1");\nmyHeading.textContent = "Hello world!";\n\n// Add a simple click event\ndocument.querySelector("html").addEventListener("click", function () {\n  alert("Ouch! Stop poking me!");\n});',
      mdnLink: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps',
      videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
      order: 1
    }
  ],
  'React': [
    {
      title: 'Getting Started with React',
      content_en: 'React is a library for building user interfaces. React is not a framework – it\'s not even exclusive to the web. It\'s used with other libraries to render to certain environments. For instance, React Native can be used to build mobile applications.\n\nTo build for the web, developers use React in tandem with ReactDOM. React and ReactDOM are often discussed in the same spaces as — and utilized to solve the same problems as — other true web development frameworks.',
      content_am: 'React የድረ-ገጽ ገጽታዎችን ለመገንባት የሚያገለግል ቤተ-መጽሐፍት (Library) ነው። React የራሱ የሆነ ማዕቀፍ (Framework) አይደለም - ለድረ-ገጽ ብቻም የተወሰነ አይደለም። ለምሳሌ React Native የሞባይል አፕሊኬሽኖችን ለመገንባት ሊያገለግል ይችላል።\n\nበድረ-ገጽ ላይ ለመስራት፣ ገንቢዎች React እና ReactDOM ን በአንድ ላይ ይጠቀማሉ።',
      exampleCode: 'import { useState } from "react";\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Clicked {count} times\n    </button>\n  );\n}',
      mdnLink: 'https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_getting_started',
      videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8',
      order: 1
    }
  ],
  'Node.js': [
    {
      title: 'Introduction to Node.js',
      content_en: 'Node.js is an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside of a web browser. Node.js lets developers use JavaScript to write command line tools and for server-side scripting—running scripts server-side to produce dynamic web page content before the page is sent to the user\'s web browser.',
      content_am: 'Node.js ከድረ-ገጽ አሳሽ (Browser) ውጭ የጃቫስክሪፕት ኮድን የሚያስፈጽም ክፍት ምንጭ የሆነ የጃቫስክሪፕት አሂድ አካባቢ ነው። Node.js ገንቢዎች የጃቫስክሪፕት ትዕዛዝ መስጫ መሳሪያዎችን እንዲጠቀሙ እና ሰርቨር ላይ በሚሰሩ ስክሪፕቶች አማካኝነት ተለዋዋጭ የድረ-ገጽ ይዘት እንዲፈጥሩ ያስችላቸዋል።',
      exampleCode: 'const http = require("http");\n\nconst hostname = "127.0.0.1";\nconst port = 3000;\n\nconst server = http.createServer((req, res) => {\n  res.statusCode = 200;\n  res.setHeader("Content-Type", "text/plain");\n  res.end("Hello World\\n");\n});\n\nserver.listen(port, hostname, () => {\n  console.log(`Server running at http://${hostname}:${port}/`);\n});',
      mdnLink: 'https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction',
      videoUrl: 'https://www.youtube.com/embed/TlB_eWDSMt4',
      order: 1
    }
  ]
};

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    await mongoose.model('Progress').deleteMany({});

    console.log("Adding required courses with MDN integrated professional lessons...");
    for (const data of coursesData) {
      const course = await Course.create(data);
      
      const specificLessons = mdnLessons[course.title] || [];
      
      if (specificLessons.length > 0) {
        for (const lesLoc of specificLessons) {
           await Lesson.create({
             courseId: course._id,
             title: lesLoc.title,
             content_en: lesLoc.content_en,
             content_am: lesLoc.content_am,
             exampleCode: lesLoc.exampleCode,
             mdnLink: lesLoc.mdnLink,
             videoUrl: lesLoc.videoUrl,
             order: lesLoc.order
           });
        }
      } else {
        // Fallback for courses not explicitly mapped in mdnLessons
        await Lesson.create({ 
          courseId: course._id, 
          title: `Introduction to ${course.title}`, 
          content_en: `Welcome to ${course.title}! This is the core introduction into the concepts.`, 
          content_am: `እንኳን ወደ ${course.title} በደህና መጡ! ይህ መሠረታዊ መግቢያ ነው።`,
          videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", 
          order: 1 
        });
      }

      await Quiz.create({
        courseId: course._id,
        questions: [
          { question: `What is the main purpose of ${course.title}?`, options: ["To build apps", "To cook food", "To fly planes", "None"], answer: "To build apps" },
          { question: `Is ${course.title} relevant today?`, options: ["Yes", "No"], answer: "Yes" }
        ]
      });
    }

    console.log("Database seeded successfully with the exact curriculum.");
    process.exit();
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

seed();
