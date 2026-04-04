import { useState } from 'react';
import axios from 'axios';
import { Play, Code as CodeIcon, Terminal } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../data/translations';

const API_URL = 'http://localhost:5001';

const CodeEditor = ({ courseId }) => {
  const [code, setCode] = useState('// Write your sandboxed javascript code here\nconsole.log("Hello, World!");');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const { language } = useLanguage();
  const t = translations[language] || translations.en;

  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/run`, { code });
      setOutput(res.data.output);
      
      // Update progress indicating code execution
      await axios.post(`${API_URL}/api/progress`, { courseId, updateType: 'code' });
      
    } catch (err) {
      setOutput(err.response?.data?.output || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] border rounded-2xl overflow-hidden shadow-lg bg-gray-900 text-gray-100">
      
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-gray-300">
           <CodeIcon className="w-5 h-5" />
           <span className="font-bold font-mono">{t.js_sandbox}</span>
        </div>
        <button 
          onClick={handleRun} 
          disabled={loading}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded-md font-bold transition-all disabled:opacity-50"
        >
          <Play className="w-4 h-4" />
          <span>{loading ? t.running : t.run_code}</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <textarea 
          value={code} 
          onChange={e => setCode(e.target.value)}
          className="flex-1 w-full bg-gray-900 text-blue-400 p-4 font-mono text-lg outline-none resize-none"
          spellCheck="false"
        />
        
        <div className="h-1/3 bg-black border-t border-gray-800 flex flex-col">
          <div className="bg-gray-800 px-4 py-1 text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center space-x-2">
            <Terminal className="w-3 h-3" />
            <span>{t.console_output}</span>
          </div>
          <div className="flex-1 p-4 font-mono text-green-400 overflow-y-auto whitespace-pre-wrap">
             {output || <span className="text-gray-600 italic">{t.waiting_execution}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
