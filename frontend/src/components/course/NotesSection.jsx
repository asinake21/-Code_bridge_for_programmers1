import React from 'react';
import { BookOpen, Download } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { downloadApi } from '../../api';

const NotesSection = ({ lesson, courseId, weekTitle }) => {
  const { language } = useLanguage();
  const { user } = useAuth();

  if (!lesson.content_en && !lesson.content_am) {
    return null;
  }

  const content = language === 'am' && lesson.content_am 
    ? lesson.content_am 
    : lesson.content_en;

  const handleDownload = async () => {
    if (lesson.notesFile) {
      if (user) {
        try {
          await downloadApi.save(user._id, courseId, weekTitle, lesson.notesFile, `${weekTitle} Notes`);
        } catch (err) {
          console.error('Failed to log download:', err);
        }
      }
      
      const link = document.createElement('a');
      link.href = lesson.notesFile;
      link.setAttribute('download', true);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/40 rounded-2xl border border-gray-200 dark:border-slate-700/60 p-6 md:p-8 lg:p-10 shadow-lg transition-colors duration-300">
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 dark:border-slate-700/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-600/10 dark:bg-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100 placeholder-opacity-90 tracking-tight">Lesson Notes</h2>
        </div>
        
        {lesson.notesFile && (
          <button 
            onClick={handleDownload}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all border border-blue-500/50 shadow active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span className="font-medium text-sm">Download PDF</span>
          </button>
        )}
      </div>
      
      <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-slate-300">
        <p className="whitespace-pre-line leading-relaxed text-lg">
          {content}
        </p>
      </div>

      {lesson.mdnLink && (
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-700/50">
          <a 
            href={lesson.mdnLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
          >
            Explore Official MDN Documentation 
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
};

export default NotesSection;
