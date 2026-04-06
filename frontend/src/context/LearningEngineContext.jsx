import React, { createContext, useContext, useState } from 'react';

const LearningEngineContext = createContext();

export const LearningEngineProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1); 
  // Step 1: Video, 2: Notes, 3: Try, 4: Practice, 5: Challenge, 6: Test, 7: Project
  const [unlockedStep, setUnlockedStep] = useState(1);
  const [attempts, setAttempts] = useState(0);
  const [xp, setXp] = useState(0);
  const [skills, setSkills] = useState({ loops: 50, arrays: 30, functions: 10 });
  const [performance, setPerformance] = useState('MEDIUM'); // HIGH, MEDIUM, LOW

  const completeStep = (stepNumber) => {
    if (stepNumber === unlockedStep) {
      setUnlockedStep(prev => Math.min(prev + 1, 7));
      setXp(prev => prev + 25);
    }
  };

  const registerAttempt = (isCorrect) => {
    if (!isCorrect) {
      setAttempts(prev => prev + 1);
      if (attempts >= 1) setPerformance('LOW');
    } else {
      if (attempts === 0) setPerformance('HIGH');
      completeStep(currentStep); // Success unlocks next automatically
      setAttempts(0);
    }
  };

  return (
    <LearningEngineContext.Provider value={{
      currentStep, setCurrentStep,
      unlockedStep, completeStep,
      attempts, registerAttempt,
      xp, skills, performance
    }}>
      {children}
    </LearningEngineContext.Provider>
  );
};
export const useLearningEngine = () => useContext(LearningEngineContext);
