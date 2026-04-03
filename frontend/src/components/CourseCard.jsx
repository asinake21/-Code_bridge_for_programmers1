import { Clock, BookOpen, Play, Code } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { iconMap } from '../data/courses'
import { useLanguage } from '../context/LanguageContext'
import { translations } from '../data/translations'

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  
  const IconComponent = iconMap[course.icon] || Code; // Fallback to Code if missing

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full"
    >
      <div className="p-6 flex-1 flex flex-col">
        {/* Header: Icon & Level */}
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center border border-blue-100 dark:border-gray-600">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${
            course.level === 'Beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            course.level === 'Intermediate' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {course.level}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight line-clamp-2">
            {course.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {course.description}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{course.duration || '4 weeks'}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span>{Array.isArray(course.modules) ? course.modules.length : (course.modules || 0)} {t.modules}</span>
          </div>
        </div>

        {/* Action */}
        <button 
          onClick={() => navigate(`/courses/${course._id || course.id}`)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200 mt-auto"
        >
          <Play className="w-4 h-4" fill="currentColor" />
          <span>{t.start_learning}</span>
        </button>
      </div>
    </div>
  )
}

export default CourseCard