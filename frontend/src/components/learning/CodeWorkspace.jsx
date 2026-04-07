import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Lightbulb, Terminal, AlertTriangle } from 'lucide-react';
import { useLearningEngine } from '../../context/LearningEngineContext';

const CodeWorkspace = () => {
  const [code, setCode] = useState('// Write your code here to output "Hello World!"\n\nfunction start() {\n  \n}\n\nstart();');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { currentStep, attempts, registerAttempt, performance } = useLearningEngine();

  const handleRun = async () => {
    setIsLoading(true);
    setOutput("Executing remotely...");
    const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5001';
    
    try {
      // Connect to the secure node backend /run compiler endpoint mapped globally
      const res = await fetch(`${API_BASE}/run`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      
      const cleanOutput = data.output || "No output returned.";
      setOutput(cleanOutput);
      
      // Strict progress tracking: only track attempts if we are on step 3 
      if (currentStep === 3) {
        const isCorrect = cleanOutput.includes('Hello World!');
        registerAttempt(isCorrect);
      }
    } catch(err) {
      setOutput(`Error: ${err.message}`);
      if (currentStep === 3) registerAttempt(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hidden lg:flex flex-col w-[500px] xl:w-[600px] bg-[#0d0d0d] border-l border-gray-800 z-10 shrink-0 relative shadow-[-10px_0_30px_rgba(0,0,0,0.3)]">
      
      {/* Editor Header Bar */}
      <div className="bg-[#1a1a1a] p-3.5 px-6 flex justify-between items-center z-10 border-b border-gray-800/80">
        <div className="flex items-center gap-4">
          <select className="bg-[#2a2a2a] text-gray-300 rounded-lg px-3 py-1.5 text-sm font-semibold border border-transparent outline-none hover:bg-[#333] transition-colors cursor-pointer focus:ring-1 ring-blue-500">
             <option>JavaScript</option>
             <option>Python</option>
             <option>React</option>
          </select>
          {performance === 'LOW' && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
              <AlertTriangle className="w-3.5 h-3.5" /> High Attempt Count Detected
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
           {attempts >= 2 && performance === 'LOW' && (
             <button className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-lg hover:bg-yellow-500/20 text-sm font-bold transition-all border border-yellow-500/20">
               <Lightbulb className="w-4 h-4" /> Get Hint
             </button>
           )}
           <button 
             onClick={handleRun} 
             disabled={isLoading}
             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-blue-600 text-white px-5 py-1.5 rounded-lg shadow-sm text-sm font-bold transition-all active:scale-95 border border-blue-500/50"
           >
              <Play className="w-4 h-4 fill-current" /> {isLoading ? 'Running...' : 'Run Code'}
           </button>
        </div>
      </div>
      
      {/* Editor Area */}
      <div className="flex-1 relative bg-[#0a0a0a]">
         <Editor 
            height="100%" 
            defaultLanguage="javascript" 
            theme="vs-dark" 
            value={code} 
            onChange={(v) => setCode(v)} 
            options={{ 
              minimap: { enabled: false }, 
              fontSize: 16, 
              padding: { top: 24, bottom: 24 },
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              scrollbar: { vertical: 'hidden' }
            }}
         />
      </div>
      
      {/* Integrated Terminal Console */}
      <div className="h-[250px] bg-[#0a0a0a] border-t border-gray-800 flex flex-col relative shrink-0">
         <div className="bg-[#111111] p-2.5 px-6 shadow-sm flex items-center gap-2 border-b border-gray-800/50">
            <Terminal className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-bold text-gray-400 tracking-[0.1em] uppercase">Output Console</span>
         </div>
         <div className="p-6 flex-1 overflow-auto bg-[#050505]">
            <pre className={`font-mono text-[14px] leading-relaxed whitespace-pre-wrap ${output.startsWith('Error') ? 'text-red-400' : 'text-gray-300'}`}>
              {output || <span className="text-gray-600 italic">Ready to compile. Press Run Code above.</span>}
            </pre>
         </div>
      </div>
    </div>
  )
};
export default CodeWorkspace;
