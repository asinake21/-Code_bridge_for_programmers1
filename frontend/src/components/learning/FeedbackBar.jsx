import React from 'react';
import { useLearningEngine } from '../../context/LearningEngineContext';
import { Target, ArrowRight } from 'lucide-react';

const FeedbackBar = () => {
  const { currentStep, unlockedStep, xp, performance } = useLearningEngine();
  const progressPercent = Math.round(((Math.min(unlockedStep - 1, 7)) / 7) * 100);

  return (
    <div className="h-[90px] bg-white dark:bg-[#111111] border-t border-gray-200/80 dark:border-gray-800 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] w-full flex items-center justify-between px-6 sm:px-10 z-20 shrink-0">
      
      {/* 1. Core Platform Progress Line */}
      <div className="flex items-center space-x-6 sm:space-x-12 flex-1 relative top-px">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 hidden md:flex shrink-0">
          <Target className="w-6 h-6" />
        </div>
        
        <div className="flex flex-col flex-1 max-w-xl pr-6">
          <div className="flex justify-between items-end mb-2.5">
            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">Global Track Progress</span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
             <div 
               className="bg-blue-600 h-full rounded-full transition-all duration-700 ease-out relative" 
               style={{ width: `${progressPercent}%` }}
             >
               <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
             </div>
          </div>
        </div>

        {/* 2. Adaptive Logic Badge */}
        <div className="border-l border-gray-200 dark:border-gray-800 pl-6 sm:pl-10 hidden xl:flex flex-col">
           <h4 className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-1.5">Adaptive Status</h4>
           <div className="flex items-center gap-2">
             <span className="relative flex h-2 w-2">
               <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${performance === 'HIGH' ? 'bg-green-400' : performance === 'LOW' ? 'bg-yellow-400' : 'bg-blue-400'}`}></span>
               <span className={`relative inline-flex rounded-full h-2 w-2 ${performance === 'HIGH' ? 'bg-green-500' : performance === 'LOW' ? 'bg-yellow-500' : 'bg-blue-500'}`}></span>
             </span>
             <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
               {performance} Profiling
             </p>
           </div>
        </div>
      </div>

      {/* 3. Action / Continue Configurator */}
      <div className="flex gap-4 sm:gap-6 items-center shrink-0 border-l border-gray-200 dark:border-gray-800 pl-6 sm:pl-10">
         <div className="hidden sm:flex flex-col items-end mr-2">
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mb-0.5">Session XP</span>
            <span className="text-sm font-black text-yellow-500 drop-shadow-sm">{xp} pts</span>
         </div>
         
         <button 
           disabled={currentStep >= unlockedStep}
           className="group flex items-center justify-center gap-2 bg-blue-600 text-white min-w-[140px] px-6 py-3.5 rounded-xl hover:bg-blue-500 disabled:opacity-50 disabled:bg-blue-600 disabled:shadow-none font-bold shadow-[0_4px_14px_rgba(37,99,235,0.3)] transition-all active:scale-[0.98] text-sm uppercase tracking-wide overflow-hidden relative"
         >
           <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:block transition-transform duration-500 ease-out group-hover:translate-x-[100%] z-0"></div>
           <span className="relative z-10">Continue</span>
           <ArrowRight className="w-4 h-4 relative z-10 -mr-1 group-hover:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  )
};
export default FeedbackBar;
