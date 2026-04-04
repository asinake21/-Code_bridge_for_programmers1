import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlayCircle, BookOpen, Code, FileQuestion, ArrowLeft } from 'lucide-react';
import VideoSystem from '../components/VideoSystem';
import NotesSystem from '../components/NotesSystem';
import CodeEditor from '../components/CodeEditor';
import QuizSystem from '../components/QuizSystem';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

const API_URL = 'http://localhost:5001/api';

const CoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeTab, setActiveTab] = useState('video');
  const [loading, setLoading] = useState(true);

  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/courses/${id}`);
        setCourse(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return <div className="text-center py-20 text-xl font-bold">{t.loading_course}</div>;
  if (!course) return <div className="text-center py-20">{t.course_not_found}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/courses')} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">{course.title} {t.masterclass}</h1>
                <p className="text-sm font-medium text-gray-500">{course.level} • {course.section}</p>
              </div>
            </div>
            {/* Tab navigation */}
            <div className="hidden sm:flex bg-gray-100 p-1 rounded-xl">
              {[
                { id: 'video', icon: PlayCircle, label: t.videos },
                { id: 'notes', icon: BookOpen, label: t.notes },
                { id: 'code', icon: Code, label: t.code },
                { id: 'quiz', icon: FileQuestion, label: t.quiz },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Tab nav */}
      <div className="sm:hidden bg-white border-b flex justify-around p-2 sticky top-20 z-20">
        {[
          { id: 'video', label: t.videos },
           { id: 'notes', label: t.notes },
           { id: 'code', label: t.code },
           { id: 'quiz', label: t.quiz }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-sm font-bold capitalize rounded-lg ${activeTab === tab.id ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border p-6 min-h-[60vh]">
          {activeTab === 'video' && <VideoSystem courseId={id} />}
          {activeTab === 'notes' && <NotesSystem courseId={id} />}
          {activeTab === 'code' && <CodeEditor courseId={id} />}
          {activeTab === 'quiz' && <QuizSystem courseId={id} />}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
