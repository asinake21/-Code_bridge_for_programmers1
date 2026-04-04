export const courses = [
  {
    id: "html",
    title: "HTML Fundamentals",
    level: "Beginner",
    duration: "2 weeks",
    modules: 2,
    topics: [
      {
        id: 1,
        title: "Introduction to HTML",
        notes_en:
          "HTML (HyperText Markup Language) is the most basic building block of the Web. It defines the meaning and structure of web content. Other technologies besides HTML are generally used to describe a web page's appearance/presentation (CSS) or functionality/behavior (JavaScript).",
        notes_am:
          "HTML (HyperText Markup Language) የድረ-ገጽ መሰረታዊ መዋቅር ነው። የድረ-ገጹን ይዘት ትርጉም እና ቅርፅ ይገልፃል። ከኤችቲኤምኤል በተጨማሪ ሌሎች ቴክኖሎጂዎች የድረ-ገጽን ገጽታ (CSS) ወይም ተግባር (JavaScript) ለመግለጽ ያገለግላሉ።",
        example: "<h1>Hello World!</h1>\n<p>This is a paragraph.</p>",
        reference:
          "https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML",
        video: "https://www.youtube.com/embed/qz0aGYrrlhU",
        downloadable: "/src/assets/downloads/html-intro.pdf"
      },
      {
        id: 2,
        title: "HTML Text Formatting",
        notes_en:
          "HTML provides several elements for formatting text, like <strong> for bold text, <em> for italic text, and <mark> for highlighted text. These semantic elements help search engines and screen readers understand the text's importance.",
        notes_am:
          "HTML ጽሑፍን ለመቅረጽ እንደ <strong> (ለደማቅ ጽሑፍ)፣ <em> (ለሰያፍ ጽሑፍ) እና <mark> (ለደመቀ ጽሑፍ) ያሉ በርካታ ክፍሎችን (elements) ያቀርባል። እነዚህ የትርጉም ክፍሎች የፍለጋ ሞተሮች (search engines) እና ስክሪን አንባቢዎች (screen readers) የጽሑፉን አስፈላጊነት እንዲረዱ ያግዛሉ።",
        example: "<p>This is <strong>important</strong> text.</p>\n<p>This is <em>emphasized</em>.</p>",
        reference:
          "https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML/HTML_text_fundamentals",
        video: "https://www.youtube.com/embed/salY_Sm6mv4",
        downloadable: "/src/assets/downloads/html-intro.pdf"
      },
    ],
  },
  {
    id: "css",
    title: "CSS Styling",
    level: "Beginner",
    duration: "3 weeks",
    modules: 2,
    topics: [
      {
        id: 1,
        title: "CSS Backgrounds and Borders",
        notes_en:
          "CSS backgrounds and borders are used to style the background of an element and apply borders to its edges. You can use background-color for solid colors, or background-image for patterns.",
        notes_am:
          "የ CSS የጀርባ ቀለሞች እና ጠርዞች (borders) የአንድን ክፍል (element) ጀርባ ለማሳመር እና በዳርቻው ላይ ጠርዞችን ለመተግበር ያገለግላሉ። ለጠንካራ ቀለማት background-colorን፣ ወይም ለስዕላዊ መግለጫዎች background-imageን መጠቀም ይችላሉ።",
        example:
          "body {\n  background-color: lightblue;\n  border: 1px solid black;\n}",
        reference:
          "https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Backgrounds_and_borders",
        video: "https://www.youtube.com/embed/1Rs2ND1ryYc",
        downloadable: "/src/assets/downloads/css-basics.pdf"
      },
      {
        id: 2,
        title: "CSS Flexbox",
        notes_en:
          "Flexbox is a one-dimensional layout method for arranging items in rows or columns. Items flex (expand) to fill additional space or shrink to fit into smaller spaces.",
        notes_am:
          "Flexbox ዕቃዎችን በአግድም ሆነ ወደታች ለማዘጋጀት የሚረዳ ባለ አንድ አቅጣጫ ቅርጸት (layout) ዘዴ ነው። ዕቃዎች ተጨማሪ ቦታን ለመሙላት ይለጠጣሉ ወይንም በጠባብ ቦታዎች ለመገጣጠም ያንሳሉ።",
        example: ".container {\n  display: flex;\n  justify-content: center;\n}",
        reference:
          "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Flexbox",
        video: "https://www.youtube.com/embed/fYq5PXgO2nE",
        downloadable: "/src/assets/downloads/css-basics.pdf"
      },
    ],
  },
  {
    id: "javascript",
    title: "JavaScript Basics",
    level: "Intermediate",
    duration: "4 weeks",
    modules: 2,
    topics: [
      {
        id: 1,
        title: "Variables and Data Types",
        notes_en:
          "Variables are containers for storing data values. In modern JavaScript, we use let and const to declare variables. Data types include Strings, Numbers, Booleans, Objects, and Arrays.",
        notes_am:
          "ተለዋዋጮች (Variables) መረጃን (data) ለማከማቸት የሚያገለግሉ ማጠራቀሚያዎች ናቸው። በዘመናዊ ጃቫስክሪፕት ውስጥ ተለዋዋጮችን ለመግለጽ let እና constን እንጠቀማለን። የዳታ ዓይነቶች (Data types) ጽሑፍን፣ ቁጥሮችን፣ እውነት/ሀሰትን፣ እና ነገሮችን በቡድን ያካትታሉ።",
        example: "const name = 'John';\nlet age = 25;\nconst isStudent = true;",
        reference:
          "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Variables",
        video: "https://www.youtube.com/embed/WPvGqX-TXP0",
        downloadable: "/src/assets/downloads/js-basics.pdf"
      },
      {
        id: 2,
        title: "Functions",
        notes_en:
          "Functions are one of the fundamental building blocks in JavaScript. A function is a reusable set of statements to perform a task or calculate a value. They take inputs (parameters) and can return output.",
        notes_am:
          "ፋንክሽኖች (Functions) በጃቫስክሪፕት ውስጥ ከሚገኙ መሠረታዊ መገንቢያዎች ውስጥ አንዱ ናቸው። አንድ ፋንክሽን የተወሰነ ተግባርን ለማከናወን ወይም ዋጋን ለማስላት የሚያገለግል፣ በድጋሚ ጥቅም ላይ ሊውል የሚችል የኮዶች ስብስብ ነው።",
        example:
          "function add(a, b) {\n  return a + b;\n}\nconsole.log(add(5, 3));",
        reference:
          "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Functions",
        video: "https://www.youtube.com/embed/N8ap4k_1QEQ",
        downloadable: "/src/assets/downloads/js-basics.pdf"
      },
    ],
  },
  {
    id: "react",
    title: "React Web Development",
    level: "Advanced",
    duration: "5 weeks",
    modules: 2,
    topics: [
      {
        id: 1,
        title: "Components and Props",
        notes_en:
          "Components let you split the UI into independent, reusable pieces. Props (short for properties) are used to pass data from a parent component to a child component, making components dynamic.",
        notes_am:
          "ክፍሎች (Components) ዩአይ(UI)ን ወደ ነፃ እና በድጋሚ ሊጠቀሙባቸው ወደሚችሉ ትናንሽ ቁርጥራጮች ለመከፋፈል ያስችሉዎታል። ፕሮፕስ (Props) መረጃን ከወላጅ ክፍል (parent component) ወደ ልጅ ክፍል (child component) ለማስተላለፍ ያገለግላሉ።",
        example:
          "function Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}",
        reference:
          "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_components",
        video: "https://www.youtube.com/embed/m7OWXtbiXX8",
        downloadable: "/src/assets/downloads/js-basics.pdf"
      },
      {
        id: 2,
        title: "State and useState",
        notes_en:
          "State is a component's memory. It lets a component remember information over time. The useState hook allows you to add a state variable to your functional components to perform changes across renders.",
        notes_am:
          "ስቴት (State) የአንድ ክፍል (component) ማስታወሻ ነው። ክፍሉ የቆየ መረጃን አቆይቶ እንዲያስታውስ ያስችለዋል። useState ሁክ (Hook) በኮድዎ ውስጥ ከጊዜ ወደ ጊዜ የሚለወጡ መረጃዎችን ለመጨመር ያስችልዎታል።",
        example:
          "const [count, setCount] = useState(0);\n<button onClick={() => setCount(count + 1)}>\n  Click me\n</button>",
        reference:
          "https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/React_interactivity_events_state",
        video: "https://www.youtube.com/embed/O6P86uwfdR0",
        downloadable: "/src/assets/downloads/js-basics.pdf"
      },
    ],
  },
  {
    id: "nodejs",
    title: "Node.js Backend",
    level: "Advanced",
    duration: "4 weeks",
    modules: 1,
    topics: [
      {
        id: 1,
        title: "Introduction to Node.js",
        notes_en:
          "Node.js is an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside a web browser, making it perfect for server-side APIs and scripting.",
        notes_am:
          "Node.js ክፍት ምንጭ (open-source)፣ በተለያዩ ፕላትፎርሞች ላይ የሚሰራ የጃቫስክሪፕት ማስኬጃ ነው። ጃቫስክሪፕት ኮድን ከድረ-ገጽ ማሰሻ (browser) ውጭ እንዲሰራ በማድረግ ለሰርቨር API ግንባታ ፍጹም ያደርገዋል።",
        example:
          "const http = require('http');\nconst server = http.createServer((req, res) => {\n  res.end('Hello World');\n});\nserver.listen(3000);",
        reference:
          "https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction",
        video: "https://www.youtube.com/embed/TlB_eWDSMt4",
        downloadable: "/src/assets/downloads/js-basics.pdf"
      },
    ],
  },
];