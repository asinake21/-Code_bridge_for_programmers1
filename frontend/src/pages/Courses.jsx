import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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
    <div className="bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-4rem)] pb-16 transition-colors">
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 py-12 mb-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 transition-colors">{t.learning_dashboard}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto transition-colors">{t.dashboard_subtitle}</p>

          <div className="relative max-w-2xl mx-auto mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            <input
              type="text"
              placeholder={t.search_tech}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 dark:border-gray-700 rounded-xl text-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-4 focus:border-blue-600 dark:focus:border-blue-500 outline-none transition-all shadow-sm placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 justify-center">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 px-4 py-2 rounded-lg shadow-sm transition-colors">
              <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="bg-transparent border-none outline-none font-medium text-gray-700 dark:text-gray-200 w-full cursor-pointer max-w-[150px]">
                <option value="All" className="dark:bg-gray-700">{t.all_levels}</option>
                <option value="Beginner" className="dark:bg-gray-700">{t.beginner}</option>
                <option value="Intermediate" className="dark:bg-gray-700">{t.intermediate}</option>
                <option value="Advanced" className="dark:bg-gray-700">{t.advanced}</option>
              </select>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 px-4 py-2 rounded-lg shadow-sm transition-colors">
              <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <select value={progressFilter} onChange={(e) => setProgressFilter(e.target.value)} className="bg-transparent border-none outline-none font-medium text-gray-700 dark:text-gray-200 w-full cursor-pointer max-w-[150px]">
                <option value="All" className="dark:bg-gray-700">{t.all_progress}</option>
                <option value="Not Started" className="dark:bg-gray-700">{t.not_started}</option>
                <option value="In Progress" className="dark:bg-gray-700">{t.in_progress}</option>
                <option value="Completed" className="dark:bg-gray-700">{t.completed}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {loading ? (
          <div className="text-center text-xl font-bold text-gray-600 dark:text-gray-400 p-10 transition-colors">{t.loading_curriculum}</div>
        ) : (
          sectionsList.map((section) => {
            const secCourses = filteredCourses.filter(c => c.section === section);
            if (secCourses.length === 0) return null;

            return (
              <section key={section}>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white border-b dark:border-gray-700 pb-2 mb-6 transition-colors">{section}</h2>
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
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 transition-colors">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.no_courses_filters}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;