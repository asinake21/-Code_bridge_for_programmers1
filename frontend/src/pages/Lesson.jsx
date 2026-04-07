import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Lesson = () => {
  const { courseId, lessonIndex } = useParams();
  const navigate = useNavigate();
  const { language: lang } = useLanguage(); 
  
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5001';

  useEffect(() => {
    // Dynamic lesson fetch from standardized dataset
    import('../data/courses').then((module) => {
      const coursesData = module.courses;
      const course = coursesData.find(c => c.id === courseId);
      
      if (course && course.lessons && course.lessons[lessonIndex]) {
        const fetchedLesson = course.lessons[lessonIndex];
        setLesson(fetchedLesson);
        setCode(fetchedLesson.starterCode);
      } else {
        console.error(`Lesson not found for course: ${courseId}, index: ${lessonIndex}`);
      }
      setLoading(false);

      // Save progress
      const userId = localStorage.getItem("userId") || "guest_123";
      fetch(`${API_BASE}/api/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId, lessonIndex: parseInt(lessonIndex) })
      }).catch(err => console.error("Failed to save progress", err));
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [courseId, lessonIndex]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("Running...");
    try {
      const res = await axios.post(`${API_BASE}/run`, { code });
      setOutput(res.data.output);
    } catch (err) {
      setOutput(err.message || "Failed to execute code");
    } finally {
      setIsRunning(false);
    }
  };

  const checkAnswer = (quizIndex, selected, correct, explanation) => {
    const isCorrect = selected === correct;
    setQuizAnswers(prev => ({
       ...prev,
       [quizIndex]: isCorrect ? 'correct' : 'wrong'
    }));
    
    alert(isCorrect ? explanation[lang] : "❌ Wrong");
  };

  if (loading) return (
     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
       <span className="text-xl font-bold animate-pulse text-blue-600">Loading Module...</span>
     </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 min-h-[calc(100vh-4rem)] p-4 md:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> 
          {lang === 'en' ? 'Back to Course' : 'ወደ ኮርስ ተመለስ'}
        </button>
        
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
           {lesson?.title[lang]}
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* LEFT SIDE: Video + Notes */}
          <div className="space-y-6">
            {/* 1. Watch Video */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                🎥 {lang === 'en' ? '1. Watch Lesson' : '1. ትምህርቱን ይመልከቱ'}
              </h2>
              <iframe
                className="w-full h-64 md:h-80 rounded-xl shadow-sm"
                src={lesson.videoUrl}
                title="Video Lesson"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>

            {/* 2. Read Notes */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
               <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                 📘 {lang === 'en' ? '2. Review Notes' : '2. ማስታወሻውን ያንብቡ'}
               </h2>
               <div className="prose dark:prose-invert max-w-none 
                  prose-headings:text-blue-600 dark:prose-headings:text-blue-400 
                  prose-a:text-blue-500 
                  prose-pre:bg-gray-900 prose-pre:text-gray-100">
                 <ReactMarkdown>{lesson.notes[lang]}</ReactMarkdown>
               </div>
            </div>
          </div>

          {/* RIGHT SIDE: Code Editor + Quiz */}
          <div className="space-y-6">
             {/* 3. Try Code */}
             <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 h-[500px] flex flex-col">
                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center justify-between">
                  <span>💻 {lang === 'en' ? '3. Try it yourself' : '3. ኮድ ይሞክሩ'}</span>
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    ▶ {isRunning ? (lang === 'en' ? 'Running...' : 'እየሄደ ነው...') : (lang === 'en' ? 'Run Code' : 'አስኪድ')}
                  </button>
                </h2>
                <div className="flex-1 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 shadow-inner">
                  <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => setCode(val)}
                    options={{
                       minimap: { enabled: false },
                       fontSize: 14,
                       padding: { top: 16 }
                    }}
                  />
                </div>
                {/* Console Output */}
                <div className="mt-4 bg-gray-900 rounded-xl p-4 border border-gray-700 max-h-32 overflow-y-auto">
                   <p className="text-xs text-gray-400 mb-1 font-mono uppercase tracking-wider">Console Output:</p>
                   <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">{output || (lang === 'en' ? 'No output yet' : 'ምንም ውጤት የለም')}</pre>
                </div>
             </div>

             {/* 4. Take Quiz */}
             {lesson?.quiz && lesson.quiz.length > 0 && (
               <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                 <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                   🧠 {lang === 'en' ? '4. Knowledge Check' : '4. እውቀት መፈተሻ'}
                 </h2>
                 {lesson.quiz.map((q, index) => (
                   <div key={index} className="space-y-4">
                     <p className="font-semibold text-gray-800 dark:text-gray-200">{q.question[lang]}</p>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                       {q.options.map((opt, i) => {
                          const status = quizAnswers[index];
                          const isSelectedCorrect = status === 'correct' && opt === q.answer;
                          const isWrong = status === 'wrong' && opt !== q.answer;
                          
                          return (
                            <button
                              key={i}
                              onClick={() => checkAnswer(index, opt, q.answer, q.explanation)}
                              className={`text-center px-4 py-3 rounded-xl border flex flex-col items-center justify-center transition-all font-medium hover:shadow-md
                                ${isSelectedCorrect 
                                   ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:border-green-500 dark:text-green-300' 
                                   : isWrong ? 'bg-red-50 border-red-300 dark:bg-red-900/20 dark:border-red-800' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-500 text-gray-700 dark:text-gray-200'}
                              `}
                            >
                              <span>{opt}</span>
                              {isSelectedCorrect && <CheckCircle className="w-5 h-5 text-green-500 mt-2" />}
                            </button>
                          )
                       })}
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Lesson;
