import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { courses } from "../data/courses";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import DownloadButton from "../components/DownloadButton";
import axios from "axios";
import { 
  PlayCircle, ExternalLink, ArrowLeft, BookOpen, Code, 
  CheckCircle, Circle, Layout, ArrowRight, Book, FileText 
} from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth();
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);
  const [tab, setTab] = useState("notes");
  const [completedTopics, setCompletedTopics] = useState([]);

  const course = courses.find((c) => c.id === id);

  useEffect(() => {
    const fetchProgress = async () => {
      if (course) {
        if (user) {
          try {
            const { data } = await axios.get(`http://localhost:5001/api/progress/${user._id}/${course.id}`);
            setCompletedTopics(data.completedLessons || []);
          } catch (err) {
            console.error("Failed to sync progress:", err);
            // Fallback to local
            const progressKey = `progress_${course.id}`;
            setCompletedTopics(JSON.parse(localStorage.getItem(progressKey)) || []);
          }
        } else {
          // Local fallback for guests
          const progressKey = `progress_${course.id}`;
          setCompletedTopics(JSON.parse(localStorage.getItem(progressKey)) || []);
        }
      }
    };
    fetchProgress();
  }, [course, user]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Course not found</h2>
          <button 
            onClick={() => navigate('/courses')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to all courses
          </button>
        </div>
      </div>
    );
  }

  const topic = course.topics[activeTopicIndex];
  const progressKey = `progress_${course.id}`;

  const markComplete = async (topicId) => {
    if (!completedTopics.includes(topicId)) {
      const newProgress = [...completedTopics, topicId];
      setCompletedTopics(newProgress);
      
      if (user) {
        try {
          await axios.post('http://localhost:5001/api/progress', {
            userId: user._id,
            courseId: course.id,
            updateType: 'lesson',
            itemId: topicId
          });
        } catch (err) {
          console.error("Failed to update progress on server", err);
        }
      } else {
        const progressKey = `progress_${course.id}`;
        localStorage.setItem(progressKey, JSON.stringify(newProgress));
      }
    }
  };

  const isCompleted = (topicId) => completedTopics.includes(topicId);
  
  const progressPercent = Math.round((completedTopics.length / course.topics.length) * 100);

  const handleNext = () => {
    if (activeTopicIndex < course.topics.length - 1) setActiveTopicIndex(activeTopicIndex + 1);
  };
  const handlePrev = () => {
    if (activeTopicIndex > 0) setActiveTopicIndex(activeTopicIndex - 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white border-b border-indigo-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button 
            onClick={() => navigate('/courses')} 
            className="flex items-center text-indigo-200 hover:text-white mb-4 transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
                {course.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-indigo-200 font-medium my-2">
                <span className="bg-indigo-800/50 px-3 py-1 rounded-full">{course.level}</span>
                <span>{course.duration}</span>
                <span>•</span>
                <span>{course.modules} Modules</span>
                <span>•</span>
                <span>{course.topics.length} Lessons</span>
              </div>
            </div>
            
            {/* Header Progress Bar */}
            <div className="w-full md:w-64 bg-indigo-950/50 p-4 rounded-xl border border-indigo-500/30">
              <div className="flex justify-between text-sm font-bold text-indigo-100 mb-2">
                <span>Course Progress</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2.5 bg-indigo-950 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-400 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR: LESSON NAVIGATION */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 sticky top-24 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center">
                <Layout className="w-5 h-5 mr-2 text-indigo-600" />
                Course Content
              </h3>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {course.topics.map((t, index) => {
                const active = index === activeTopicIndex;
                const completed = isCompleted(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTopicIndex(index)}
                    className={`w-full text-left p-4 flex items-start border-b border-gray-100 dark:border-gray-700 last:border-0 transition-colors ${
                      active ? "bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-l-indigo-600" : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <div className="mt-0.5 mr-3 flex-shrink-0">
                      {completed ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className={`w-5 h-5 ${active ? "text-indigo-400" : "text-gray-300 dark:text-gray-600"}`} />
                      )}
                    </div>
                    <div>
                      <h4 className={`text-sm font-semibold line-clamp-2 ${active ? "text-indigo-900 dark:text-indigo-300" : "text-gray-700 dark:text-gray-300"}`}>
                        {index + 1}. {t.title}
                      </h4>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* MAIN LESSON CONTENT */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            
            {/* VIDEO FRAME */}
            <div className="aspect-w-16 aspect-h-9 bg-black relative">
              <iframe
                src={topic.video}
                className="w-full h-[400px] sm:h-[500px]"
                allowFullScreen
                title={`Lesson: ${topic.title}`}
              />
            </div>

            {/* LESSON NAVIGATION HEADER */}
            <div className="px-6 py-4 flex flex-wrap items-center justify-between border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeTopicIndex + 1}. {topic.title}
              </h2>
              
              {!isCompleted(topic.id) ? (
                <button
                  onClick={() => markComplete(topic.id)}
                  className="mt-2 sm:mt-0 flex items-center bg-gray-100 hover:bg-green-100 text-gray-700 hover:text-green-700 font-bold px-4 py-2 rounded-lg transition-colors border border-gray-200 hover:border-green-300"
                >
                  <CheckCircle className="w-5 h-5 mr-2" /> Mark as Complete
                </button>
              ) : (
                <span className="mt-2 sm:mt-0 flex items-center bg-green-100 text-green-800 font-bold px-4 py-2 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" /> Completed
                </span>
              )}
            </div>

            {/* TABBED INTERFACE */}
            <div>
              <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
                <button 
                  onClick={() => setTab("notes")}
                  className={`flex items-center px-6 py-4 font-bold text-sm tracking-wide transition-colors ${tab === "notes" ? "text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-gray-800" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Lesson Notes
                </button>
                <button 
                  onClick={() => setTab("code")}
                  className={`flex items-center px-6 py-4 font-bold text-sm tracking-wide transition-colors ${tab === "code" ? "text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-gray-800" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
                >
                  <Code className="w-4 h-4 mr-2" />
                  Code Examples
                </button>
                <button 
                  onClick={() => setTab("resources")}
                  className={`flex items-center px-6 py-4 font-bold text-sm tracking-wide transition-colors ${tab === "resources" ? "text-indigo-600 border-b-2 border-indigo-600 bg-white dark:bg-gray-800" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}
                >
                  <Book className="w-4 h-4 mr-2" />
                  Resources
                </button>
              </div>

              {/* TAB CONTENT */}
              <div className="p-6 sm:p-8 min-h-[300px]">
                
                {tab === "notes" && (
                  <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                    <p className="whitespace-pre-line text-lg leading-relaxed">
                      {language === "am" ? topic.notes_am : topic.notes_en}
                    </p>
                  </div>
                )}

                {tab === "code" && (
                  <div className="space-y-4">
                    {topic.example ? (
                      <div className="bg-gray-900 rounded-xl overflow-hidden shadow-inner border border-gray-800">
                        <div className="flex px-4 py-3 bg-gray-800 space-x-2 border-b border-gray-700">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <pre className="p-6 overflow-x-auto text-green-400 font-mono text-base selection:bg-blue-500 selection:text-white">
                          <code>{topic.example}</code>
                        </pre>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No code examples for this lesson.</p>
                    )}
                  </div>
                )}

                {tab === "resources" && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                      <h3 className="font-bold text-blue-900 dark:text-blue-100 flex items-center text-lg mb-4">
                        <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                        Explore Further Reading
                      </h3>
                      <p className="text-blue-800 dark:text-blue-200 mb-6 font-medium">
                        Deepen your understanding by reviewing the official documentation and reference material for this topic.
                      </p>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => window.open(topic.reference, "_blank")}
                          className="flex items-center justify-center bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-sm"
                        >
                          <ExternalLink className="w-5 h-5 mr-2" />
                          Open Official Docs
                        </button>

                        {topic.downloadable && (
                          <DownloadButton file={topic.downloadable} />
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* PREV / NEXT NAVIGATION */}
            <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <button 
                onClick={handlePrev}
                disabled={activeTopicIndex === 0}
                className="flex items-center px-5 py-2.5 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <ArrowLeft className="w-5 h-5 mr-2" /> Previous
              </button>

              <button 
                onClick={handleNext}
                disabled={activeTopicIndex === course.topics.length - 1}
                className="flex items-center px-5 py-2.5 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
              >
                Next Lesson <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
