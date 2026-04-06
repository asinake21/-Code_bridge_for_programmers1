import React from 'react';
import SidebarNavigation from '../components/learning/SidebarNavigation';
import LearningContent from '../components/learning/LearningContent';
import CodeWorkspace from '../components/learning/CodeWorkspace';
import FeedbackBar from '../components/learning/FeedbackBar';
import { LearningEngineProvider } from '../context/LearningEngineContext';

const LearningDashboard = () => {
  return (
    <LearningEngineProvider>
      <div className="h-[calc(100vh-4rem)] flex flex-col font-sans overflow-hidden bg-gray-50 dark:bg-black w-full relative">
        <div className="flex flex-1 overflow-hidden h-full">
          {/* Left Path Menu */}
          <SidebarNavigation />
          
          {/* Center Rich Content Readout */}
          <LearningContent />
          
          {/* External Right Monaco Workspace */}
          <CodeWorkspace />
        </div>
        
        {/* Global Floating Assitant Bar */}
        <FeedbackBar />
      </div>
    </LearningEngineProvider>
  )
};

export default LearningDashboard;
