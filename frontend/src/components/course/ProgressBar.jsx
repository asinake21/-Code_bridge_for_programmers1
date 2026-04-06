import React from 'react';

const ProgressBar = ({ progressPercent }) => {
  return (
    <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden shadow-inner border border-gray-200 dark:border-slate-700/50 transition-colors duration-300">
      <div 
        className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-700 ease-out" 
        style={{ width: `${Math.max(progressPercent, 0)}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
