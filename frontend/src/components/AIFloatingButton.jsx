import React from 'react';
import { Bot } from 'lucide-react';
import { useAI } from '../context/AIContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

const AIFloatingButton = () => {
  const { isAIPanelOpen, toggleAIPanel } = useAI();
  const { language } = useLanguage();
  const t = translations[language] || translations["en"];

  if (isAIPanelOpen) return null;

  return (
    <button
      onClick={toggleAIPanel}
      className="fixed bottom-6 right-6 z-[50] p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 flex items-center justify-center group border border-blue-400/20"
      aria-label="Open AI Assistant"
    >
      <Bot className="w-8 h-8 drop-shadow-md" />
      
      {/* Subtle Tooltip prompt */}
      <span className="absolute -top-12 right-0 bg-gray-900 dark:bg-black text-white text-xs px-3 py-1.5 rounded-lg opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 font-medium tracking-wide shadow-lg min-w-max border border-gray-700">
        {t.ask_ai_tutor}
        {/* Tooltip caret */}
        <span className="absolute -bottom-1 right-5 w-2 h-2 bg-gray-900 border-r border-b border-gray-700 rotate-45 transform"></span>
      </span>
    </button>
  );
};

export default AIFloatingButton;
