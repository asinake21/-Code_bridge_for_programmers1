import React, { useState } from 'react';
import { useLearningEngine } from '../../context/LearningEngineContext';
import { Target, Youtube, BookOpen, ChevronDown, ChevronUp, Code2 } from 'lucide-react';

const LearningContent = () => {
  const { currentStep, completeStep, unlockedStep } = useLearningEngine();
  const [notesExpanded, setNotesExpanded] = useState(false);

  return (
    <div className="flex-1 bg-gray-50 dark:bg-[#0a0a0a] h-full overflow-y-auto p-6 sm:p-10 relative scroll-smooth flex flex-col space-y-8 custom-scrollbar">
      {/* 1. Learning Goals */}
      <section className="bg-white dark:bg-[#111111] p-8 rounded-3xl shadow-sm border border-gray-200/60 dark:border-gray-800 transition-all">
        <div className="flex items-center gap-3 mb-6">
           <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
             <Target className="w-6 h-6" />
           </div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Today's Objectives</h2>
        </div>
        <ul className="list-inside space-y-3 text-gray-600 dark:text-gray-400 font-medium">
          <li className="flex items-start gap-3">
            <span className="text-blue-500 mt-1">•</span> Understand advanced Array mapping and iteration methods.
          </li>
          <li className="flex items-start gap-3">
             <span className="text-blue-500 mt-1">•</span> Implement dynamic function hoisting gracefully.
          </li>
        </ul>
      </section>

      {/* 2. Video Player (Step 1) */}
      {currentStep >= 1 && (
        <section className="bg-white dark:bg-[#111111] p-8 rounded-3xl shadow-sm border border-gray-200/60 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
              <Youtube className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Video Lesson</h3>
          </div>
          <div className="aspect-video bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden relative shadow-inner w-full border border-gray-100 dark:border-gray-800">
             <iframe className="w-full h-full" src="https://www.youtube.com/embed/qz0aGYrrlhU" title="Video" allowFullScreen></iframe>
          </div>
          {currentStep === 1 && unlockedStep === 1 && (
            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => completeStep(1)} 
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                Mark Video Computed
              </button>
            </div>
          )}
        </section>
      )}

      {/* 3. Smart Notes (Step 2) */}
      {currentStep >= 2 && (
        <section className={`bg-white dark:bg-[#111111] p-8 rounded-3xl shadow-sm border border-gray-200/60 dark:border-gray-800 transition-opacity duration-500 ${currentStep === 2 ? 'opacity-100' : 'opacity-80'}`}>
          <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl">
               <BookOpen className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white">Smart Notes Summary</h3>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 font-medium pb-6 leading-relaxed">
            Arrays are list-like objects whose prototype has methods to perform traversal and mutation operations. Think of them as shelves in a library where you can retrieve items by their exact positional index.
          </p>

          <button 
            onClick={() => setNotesExpanded(!notesExpanded)} 
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-bold bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 px-5 py-2.5 rounded-xl transition-colors w-max mx-auto md:mx-0"
          >
            {notesExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {notesExpanded ? 'Hide Deep Notes' : 'Expand Deep Notes'}
          </button>
          
          {notesExpanded && (
            <div className="mt-6 p-6 bg-gray-50 dark:bg-[#0a0a0a] rounded-2xl text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap border border-gray-200/60 dark:border-gray-800 animate-in fade-in slide-in-from-top-2">
              {"Detailed Analysis:\n1. Zero-indexed: The first element is always [0].\n2. Dynamic Length: JavaScript arrays shrink and grow automatically.\n3. Mutation: Methods like push(), pop() directly alter the original array.\n4. Non-mutating: Methods like slice() return entirely new arrays safely."}
            </div>
          )}

          {currentStep === 2 && unlockedStep === 2 && (
            <div className="mt-8 flex justify-end pt-6 border-t border-gray-100 dark:border-gray-800">
              <button 
                onClick={() => completeStep(2)} 
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                Complete Reading
              </button>
            </div>
          )}
        </section>
      )}

      {/* 4. Interactive Example Intro (Step 3) */}
      {currentStep >= 3 && (
        <section className={`bg-white dark:bg-[#111111] p-8 rounded-3xl shadow-sm border border-gray-200/60 dark:border-gray-800 transition-opacity duration-500 ${currentStep === 3 ? 'opacity-100 ring-2 ring-blue-500/20' : 'opacity-80'}`}>
           <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl">
               <Code2 className="w-6 h-6" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 dark:text-white">Time to Code!</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed mb-6">
            Look to the right side of your screen. Use the Code Workspace to execute your first function printing <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-purple-500 text-sm font-mono">"Hello World!"</code> exactly to the console to proceed.
          </p>
          <div className="h-10"></div>
        </section>
      )}
      <div className="h-20" /> {/* Bottom buffer */}
    </div>
  )
};
export default LearningContent;
