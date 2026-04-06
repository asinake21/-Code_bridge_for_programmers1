import React from 'react';
import { Lock, CheckCircle } from 'lucide-react';
import { useLearningEngine } from '../../context/LearningEngineContext';

const SidebarNavigation = () => {
  const { currentStep, setCurrentStep, unlockedStep, xp } = useLearningEngine();
  const steps = [
    { id: 1, label: 'Watch Video' },
    { id: 2, label: 'Read Notes' },
    { id: 3, label: 'Try Example' },
    { id: 4, label: 'Practice' },
    { id: 5, label: 'Code Challenge' },
    { id: 6, label: 'Take Test' },
    { id: 7, label: 'Get Project' },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-full overflow-y-auto flex flex-col p-4 shrink-0 transition-colors">
      <div className="mb-6 flex justify-between items-center text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-800/80 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
        <span>Current XP:</span>
        <span className="text-yellow-500 flex items-center gap-1.5">{xp} <span className="animate-pulse">🔥</span></span>
      </div>
      
      <h3 className="font-bold mb-4 text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] text-xs px-2">Path Progression</h3>
      <div className="space-y-2">
        {steps.map(step => {
          const isUnlocked = step.id <= unlockedStep;
          const isCompleted = step.id < unlockedStep;
          const isActive = step.id === currentStep;

          return (
            <button
              key={step.id}
              disabled={!isUnlocked}
              onClick={() => setCurrentStep(step.id)}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-300 font-medium ${
                !isUnlocked ? 'opacity-40 cursor-not-allowed bg-transparent hover:bg-transparent text-gray-400 dark:text-gray-600' :
                isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-[1.02]' :
                'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700/50 shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-3">
                 {isCompleted ? <CheckCircle className={`w-5 h-5 ${isActive ? 'text-white' : 'text-green-500'}`} /> : 
                  !isUnlocked ? <Lock className="w-5 h-5 text-gray-400 dark:text-gray-600" /> :
                  <div className={`w-5 h-5 rounded-full border-[2.5px] ${isActive ? 'border-white' : 'border-blue-500'}`} />}
                 <span className="text-[13px] sm:text-sm tracking-wide">{step.label}</span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-800">
         <h4 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-3 px-2">Your Weak Skills</h4>
         <div className="flex flex-wrap gap-2 px-2">
            <span className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900 px-2.5 py-1 rounded-md text-xs font-semibold">Functions</span>
            <span className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-900 px-2.5 py-1 rounded-md text-xs font-semibold">Arrays</span>
         </div>
      </div>
    </div>
  )
};
export default SidebarNavigation;
