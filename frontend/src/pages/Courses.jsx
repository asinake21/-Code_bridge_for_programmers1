import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { courses as mdnCourses } from '../data/courses';
import CourseCard from '../components/CourseCard';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

const API_URL = 'http://localhost:5001/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [progressFilter, setProgressFilter] = useState('All');
  const [savedProgress, setSavedProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/courses`);
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();

    const p = JSON.parse(localStorage.getItem("progress")) || {};
    setSavedProgress(p);

    const handleStorage = () => setSavedProgress(JSON.parse(localStorage.getItem("progress")) || {});
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const sectionsList = ["Frontend Development", "Backend Development", "Programming Languages", "Database"];

  const filteredCourses = courses.filter(c => {
    const p = savedProgress[c._id] || 0;
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (levelFilter !== 'All' && c.level !== levelFilter) return false;
    if (progressFilter === 'Completed' && p !== 100) return false;
    if (progressFilter === 'In Progress' && (p === 0 || p === 100)) return false;
    if (progressFilter === 'Not Started' && p > 0) return false;
    return true;
  });

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)] pb-16">
      <div className="bg-white border-b py-12 mb-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{t.learning_dashboard}</h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">{t.dashboard_subtitle}</p>
          
          <div className="relative max-w-2xl mx-auto mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t.search_tech}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 rounded-xl text-lg focus:ring-4 focus:border-blue-600 outline-none transition-all shadow-sm"
            />
          </div>

          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 justify-center">
             <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 border rounded-lg shadow-sm">
                <Filter className="w-4 h-4 text-gray-500" />
                <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="bg-transparent border-none outline-none font-medium text-gray-700 w-full cursor-pointer">
                   <option value="All">{t.all_levels}</option>
                   <option value="Beginner">{t.beginner}</option>
                   <option value="Intermediate">{t.intermediate}</option>
                   <option value="Advanced">{t.advanced}</option>
                </select>
             </div>
             <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 border rounded-lg shadow-sm">
                <Filter className="w-4 h-4 text-gray-500" />
                <select value={progressFilter} onChange={(e) => setProgressFilter(e.target.value)} className="bg-transparent border-none outline-none font-medium text-gray-700 w-full cursor-pointer">
                   <option value="All">{t.all_progress}</option>
                   <option value="Not Started">{t.not_started}</option>
                   <option value="In Progress">{t.in_progress}</option>
                   <option value="Completed">{t.completed}</option>
                </select>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <section>
          <h2 className="text-3xl font-extrabold text-blue-900 mb-6 flex items-center border-b border-gray-200 pb-3">
            <BookOpen className="w-8 h-8 mr-3 text-blue-600" /> 
            Reference Docs Masterclass (Bilingual)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mdnCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all">
                <div>
                   <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-4 inline-block">{course.level}</span>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                   <p className="text-gray-600 text-sm mb-4 line-clamp-2">Master {course.title} concepts using official documentation, available in English and Amharic.</p>
                </div>
                <button onClick={() => navigate(`/course/${course.id}`)} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors">
                  {language === 'am' ? 'ኮርሱን ክፈት' : 'Open Masterclass'}
                </button>
              </div>
            ))}
          </div>
        </section>
        {loading ? (
          <div className="text-center text-xl font-bold p-10">{t.loading_curriculum}</div>
        ) : (
          sectionsList.map((section) => {
            const secCourses = filteredCourses.filter(c => c.section === section);
            if (secCourses.length === 0) return null;
            
            return (
              <section key={section}>
                <h2 className="text-2xl font-extrabold text-gray-900 border-b pb-2 mb-6">{section}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {secCourses.map(course => (
                    <CourseCard key={course._id} course={course} progress={savedProgress[course._id] || 0} setSavedProgress={setSavedProgress} />
                  ))}
                </div>
              </section>
            );
          })
        )}
        {!loading && filteredCourses.length === 0 && (
           <div className="text-center py-20 bg-white rounded-2xl shadow-sm border">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.no_courses_filters}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;