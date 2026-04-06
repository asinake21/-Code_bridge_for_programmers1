import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Terminal, Code2, Play, Monitor } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { translations } from '../data/translations';

const API_URL = 'http://localhost:5001';

const CodeEditor = ({ challenge, courseId }) => {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const t = translations[language] || translations.en;

  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [executing, setExecuting] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (challenge) {
      setCode(challenge.templateCode || '');
      setOutput('');
      if (iframeRef.current) {
         iframeRef.current.srcdoc = '';
      }
    }
  }, [challenge]);

  if (!challenge) return null;

  const isFrontend = ['html', 'css', 'react'].includes(challenge.language?.toLowerCase());

  const handleRun = async () => {
    setExecuting(true);
    
    // Save progress hook safely
    if (courseId) {
       axios.post(`${API_URL}/api/progress`, { courseId, updateType: 'code' }).catch(console.error);
    }
    
    if (isFrontend) {
      // Local iframe evaluation (Secure and instant)
      if (iframeRef.current) {
        const htmlContent = challenge.language === 'css' 
          ? `<html><head><style>${code}</style></head><body><h1>CSS Applied Successfully</h1><p>Edit the CSS editor logic to see these styles mutate!</p></body></html>` 
          : code; // Native HTML handles full document strings
          
        iframeRef.current.srcdoc = htmlContent;
        setOutput('Code executed securely within DOM viewer.');
      }
      setExecuting(false);
    } else {
      // Backend evaluation
      try {
        const res = await axios.post(`${API_URL}/run`, { code });
        setOutput(res.data.output);
      } catch (err) {
        setOutput(err.response?.data?.output || err.message || "Execution Failed Node Instance");
      } finally {
        setExecuting(false);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl border border-gray-200 dark:border-slate-700/60 overflow-hidden shadow-2xl flex flex-col mt-4 h-[600px] xl:h-[700px] mb-8 transition-colors duration-300">
      <div className="bg-gray-50 dark:bg-[#2d2d2d] px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-[#3c3c3c]">
        <div className="flex items-center space-x-3">
          <div className="p-1.5 bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-md">
            <Code2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 dark:text-slate-200 font-bold tracking-wide">Interactive Sandbox</span>
            <span className="text-xs text-gray-500 dark:text-slate-400">{challenge.description}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Dynamic indicator pill */}
          <span className="bg-white dark:bg-[#1e1e1e] px-3 py-1 rounded-md text-[11px] font-bold text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-600 uppercase tracking-widest hidden sm:block shadow-inner">
             Engine: {isFrontend ? 'Client DOM' : 'Node V8'} | {challenge.language}
          </span>
          <button 
            onClick={handleRun}
            disabled={executing}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold shadow-md shadow-blue-600/20 dark:shadow-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 border border-blue-500 flex-shrink-0"
          >
            <Play className="w-4 h-4" fill="currentColor" />
            <span>{executing ? "RUNNING..." : "RUN CODE"}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row h-full">
        {/* Input */}
        <div className="flex-[3] border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-[#3c3c3c] bg-white dark:bg-[#1e1e1e] h-[300px] lg:h-full">
          <Editor
            height="100%"
            language={challenge.language === 'nodejs' ? 'javascript' : (challenge.language || 'javascript')}
            theme={theme === 'dark' ? "vs-dark" : "vs"}
            value={code}
            onChange={(val) => setCode(val)}
            options={{
              minimap: { enabled: false },
              fontSize: 16,
              fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
              padding: { top: 20 },
              formatOnPaste: true,
              wordWrap: 'on'
            }}
          />
        </div>

        {/* Console / WebView */}
        <div className={`flex-[2] flex flex-col h-[250px] lg:h-full ${isFrontend ? 'bg-[#f8f9fa]' : 'bg-black'}`}>
          <div className={`px-4 py-2 flex items-center space-x-2 shrink-0 border-b border-gray-200 dark:border-[#3c3c3c] ${isFrontend ? 'bg-slate-200' : 'bg-gray-100 dark:bg-[#252526]'}`}>
            {isFrontend ? <Monitor className="w-4 h-4 text-slate-600" /> : <Terminal className="w-4 h-4 text-gray-500 dark:text-slate-400" />}
            <span className={`text-[11px] font-bold uppercase tracking-widest ${isFrontend ? 'text-slate-600' : 'text-gray-500 dark:text-slate-400'}`}>
               {isFrontend ? 'Live WebView' : 'Output Terminal'}
            </span>
          </div>
          
          {isFrontend ? (
            <div className="flex-1 w-full h-full relative overflow-hidden bg-white">
              <iframe 
                ref={iframeRef} 
                title="Preview" 
                sandbox="allow-scripts" 
                className="absolute inset-0 w-full h-full border-none shadow-inner"
              />
            </div>
          ) : (
            <div className="flex-1 p-6 font-mono text-[14px] overflow-y-auto bg-white dark:bg-black transition-colors">
               {output ? (
                 <pre className="text-green-600 dark:text-green-400 whitespace-pre-wrap leading-relaxed">{output}</pre>
               ) : (
                 <span className="text-gray-400 dark:text-slate-600 italic">Output terminal awaiting execution...</span>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
