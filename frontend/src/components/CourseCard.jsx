import { Clock, BookOpen, Play, Code, Terminal, Monitor, Database, Server, Smartphone, Globe, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

const iconMap = { Code, Terminal, Monitor, Database, Server, Smartphone, Globe, Layout, BookOpen };

const CourseCard = ({ course, progress, setSavedProgress }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const IconComponent = iconMap[course.icon] || Code;

  const handleStartContinue = () => {
    let newProgress = progress;
    if (progress === 0) {
      newProgress = 1;
      const stored = JSON.parse(localStorage.getItem("progress")) || {};
      stored[course._id] = newProgress;
      localStorage.setItem("progress", JSON.stringify(stored));
      if (setSavedProgress) setSavedProgress(stored);
    }
    navigate(`/courses/${course._id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full cursor-pointer" onClick={handleStartContinue}>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center border border-blue-100">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${
            course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
            course.level === 'Intermediate' ? 'bg-orange-100 text-orange-700' :
            'bg-red-100 text-red-700'
          }`}>
            {t[course.level.toLowerCase()] || course.level}
          </span>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{course.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>
        </div>

        <div className="flex items-center text-sm text-gray-500 mb-4 pt-4 border-t border-gray-100">
          <div className="flex flex-1 items-center space-x-1.5"><Clock className="w-4 h-4" /><span>{course.duration}</span></div>
          <div className="flex items-center space-x-1.5"><BookOpen className="w-4 h-4" /><span>{course.modulesCount} {t.modules}</span></div>
        </div>

        <div className="mb-4">
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className={`h-2 rounded-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`} style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1 font-medium">{progress}{t.pct_completed}</p>
        </div>

        <button 
          onClick={handleStartContinue}
          className={`w-full mt-auto text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-transform duration-200 active:scale-95 ${progress > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          <Play className="w-4 h-4" fill="currentColor" />
          <span>{progress > 0 ? t.continue_learning : t.start_learning}</span>
        </button>
      </div>
    </div>
  );
};

export default CourseCard;