import React, { useState } from 'react';
import { Clock, BookOpen, Play, Code, Terminal, Monitor, Database, Server, Smartphone, Globe, Layout, Download, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { translations } from '../data/translations';
import { downloadApi } from '../api';

const iconMap = { Code, Terminal, Monitor, Database, Server, Smartphone, Globe, Layout, BookOpen };

const CourseCard = ({ course, progress, setSavedProgress }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const IconComponent = iconMap[course.icon] || Code;

  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleStartContinue = () => {
    let newProgress = progress;
    if (progress === 0) {
      newProgress = 1;
      const stored = JSON.parse(localStorage.getItem("progress")) || {};
      stored[course._id] = newProgress;
      localStorage.setItem("progress", JSON.stringify(stored));
      if (setSavedProgress) setSavedProgress(stored);
    }
    navigate(`/course/${course._id}`);
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    if (isDownloaded || isDownloading) return;

    try {
      setIsDownloading(true);
      await downloadApi.save(
        user._id,
        course._id,
        "1", 
        `/api/courses/${course._id}/download`,
        course.title
      );
      setIsDownloaded(true);
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col h-full cursor-pointer" onClick={handleStartContinue}>
      <div className="p-6 flex-1 flex flex-col relative group">
        
        {/* Download Button */}
        <button 
          onClick={handleDownload}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-all duration-200 z-10 ${
            isDownloaded 
              ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-blue-600 hover:text-white border border-transparent'
          }`}
          title={isDownloaded ? t.already_downloaded : t.download_course_btn}
        >
          {isDownloading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
          ) : isDownloaded ? (
            <Check className="w-4 h-4" />
          ) : (
            <Download className="w-4 h-4" />
          )}
        </button>

        <div className="flex justify-between items-start mb-4 pr-10">
          <div className="w-12 h-12 bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-300 rounded-lg flex items-center justify-center border border-blue-100 dark:border-slate-600">
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
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight">{course.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{course.description}</p>
        </div>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 pt-4 border-t border-gray-100 dark:border-slate-700">
          <div className="flex flex-1 items-center space-x-1.5"><Clock className="w-4 h-4" /><span>{course.duration}</span></div>
          <div className="flex items-center space-x-1.5"><BookOpen className="w-4 h-4" /><span>{course.modulesCount} {t.modules}</span></div>
        </div>

        <div className="mb-4">
          <div className="w-full bg-gray-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className={`h-2 rounded-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`} style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">{progress}{t.pct_completed}</p>
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