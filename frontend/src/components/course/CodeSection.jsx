import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Terminal, Code2, Play } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../data/translations';

const API_URL = 'http://localhost:5001';

const CodeSection = ({ exampleCode, courseId, lessonId }) => {
  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [executing, setExecuting] = useState(false);

  // Sync state when new exampleCode arrives (e.g. user changed lesson)
  useEffect(() => {
    setCode(exampleCode || '// Write your code here\nconsole.log("Hello, World!");');
    setOutput('');
  }, [exampleCode]);

  const handleRun = async () => {
    setExecuting(true);
    try {
      const res = await axios.post(`${API_URL}/run`, { code });
      setOutput(res.data.output);
      
      // Update basic execution progress
      if (courseId) {
        await axios.post(`${API_URL}/api/progress`, { courseId, updateType: 'code', itemId: lessonId });
      }
    } catch (err) {
      setOutput(err.response?.data?.output || err.message || "Execution Failed");
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="bg-[#1e1e1e] rounded-2xl border border-slate-700/60 overflow-hidden shadow-2xl flex flex-col mt-8 lg:h-[700px]">
      
      {/* Editor Header */}
      <div className="bg-[#2d2d2d] px-6 py-4 flex items-center justify-between border-b border-[#3c3c3c]">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-md">
            <Code2 className="w-5 h-5" />
          </div>
          <span className="text-slate-200 font-bold tracking-wide">Interactive Sandbox</span>
        </div>
        
        <button 
          onClick={handleRun}
          disabled={executing}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-bold shadow-md shadow-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
        >
          <Play className="w-4 h-4" fill="currentColor" />
          <span>{executing ? t.running : "RUN CODE"}</span>
        </button>
      </div>

      {/* Editor & Console Container */}
      <div className="flex-1 flex flex-col lg:flex-row h-full">
        
        {/* Monaco Editor Wrapper */}
        <div className="flex-1 border-b lg:border-b-0 lg:border-r border-[#3c3c3c] bg-[#1e1e1e]">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val)}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
              wordWrap: 'on',
              padding: { top: 20 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              formatOnPaste: true
            }}
          />
        </div>

        {/* Console Output */}
        <div className="w-full lg:w-1/3 min-h-[250px] lg:min-h-full bg-black flex flex-col">
          <div className="bg-[#252526] px-4 py-2 border-b border-[#3c3c3c] flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Output Terminal</span>
          </div>
          <div className="flex-1 p-6 font-mono text-[15px] overflow-y-auto">
             {output ? (
               <pre className="text-green-400 whitespace-pre-wrap leading-relaxed">{output}</pre>
             ) : (
               <span className="text-slate-600 italic">Code output will appear here...</span>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CodeSection;
