import React from 'react';
import { PlayCircle, CheckCircle, Lock, LayoutList } from 'lucide-react';
import ProgressBar from './ProgressBar';

const SidebarWeeks = ({ weeks, activeWeekIndex, setActiveWeekIndex, completedWeeks, progressPercent }) => {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 text-gray-900 dark:text-white overflow-hidden transition-colors duration-300">
      
      {/* Course Progress Header */}
      <div className="p-6 border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50">
        <h2 className="text-xl font-bold flex items-center mb-4 text-gray-900 dark:text-slate-100">
          <LayoutList className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-500" />
          Course Plan
        </h2>
        <div className="flex justify-between items-center text-sm font-medium text-gray-500 dark:text-slate-400 mb-2">
          <span>Overall Progress</span>
          <span className="text-blue-600 dark:text-blue-400">{progressPercent}%</span>
        </div>
        <ProgressBar progressPercent={progressPercent} />
      </div>

      {/* Scrollable Lesson List */}
      <div className="flex-1 overflow-y-auto">
        <div className="py-2 pb-10">
          {weeks.map((week, index) => {
            const isActive = index === activeWeekIndex;
            const isCompleted = completedWeeks.includes(week._id);
            
            return (
              <button
                key={week._id || index}
                onClick={() => setActiveWeekIndex(index)}
                className={`w-full text-left flex items-start px-6 py-4 transition-all duration-200 border-l-4 ${
                  isActive 
                    ? 'bg-blue-50/50 dark:bg-slate-800/80 border-blue-600 dark:border-blue-500 shadow-sm' 
                    : 'border-transparent hover:bg-gray-50 dark:hover:bg-slate-800/50'
                }`}
              >
                {/* Icon wrapper */}
                <div className="mt-0.5 mr-4 flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500" />
                  ) : isActive ? (
                    <PlayCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-slate-600 flex items-center justify-center">
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0 pr-2">
                  <span className={`text-xs font-semibold tracking-wider uppercase block mb-1 ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-slate-500'
                  }`}>
                    Week {index + 1}
                  </span>
                  <h3 className={`font-bold text-sm lg:text-base line-clamp-2 leading-snug ${
                    isActive ? 'text-gray-900 dark:text-slate-100' : 'text-gray-600 dark:text-slate-300'
                  }`}>
                    {week.title}
                  </h3>
                  {week.notes && (
                    <p className={`mt-1.5 text-xs italic line-clamp-2 leading-relaxed font-medium ${
                      isActive ? 'text-blue-800/70 dark:text-slate-400' : 'text-gray-400 dark:text-slate-500'
                    }`}>
                      {week.notes}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SidebarWeeks;
