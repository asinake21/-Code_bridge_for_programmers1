import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Paperclip, Trash2 } from 'lucide-react';
import { useAI } from '../context/AIContext';
import { chatWithAI } from '../api';
import { useLanguage } from '../context/LanguageContext';

const AIPanel = () => {
  const { isAIPanelOpen, closeAIPanel, currentContext } = useAI();
  const { language } = useLanguage();
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  
  const messagesEndRef = useRef(null);
  const panelRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll logic
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, isAIPanelOpen]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isAIPanelOpen && panelRef.current && !panelRef.current.contains(event.target)) {
        closeAIPanel();
      }
    };
    if (isAIPanelOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAIPanelOpen, closeAIPanel]);

  if (!isAIPanelOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sendMessage = async () => {
    if ((!input.trim() && !selectedFile) || loading) return;
    
    // UI feedback for message
    let content = input;
    if (selectedFile) {
      content = `📎 [Attached: ${selectedFile.name}]\n${input}`;
    }

    const userMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    
    const promptText = input;
    const fileToSend = selectedFile;

    setInput("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setLoading(true);

    try {
      const reply = await chatWithAI(promptText, language, "Student", currentContext, fileToSend);
      setMessages(prev => [...prev, { role: 'ai', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div 
      ref={panelRef}
      className="fixed bottom-0 right-0 w-full h-[100dvh] sm:bottom-5 sm:right-5 sm:w-[400px] sm:h-auto sm:max-h-[80vh] bg-white dark:bg-gray-900 sm:rounded-2xl shadow-2xl z-[60] flex flex-col border border-gray-200 dark:border-gray-800 animate-in slide-in-from-bottom-8 fade-in duration-300 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-blue-600 text-white shrink-0 shadow-sm z-10 relative">
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <h3 className="font-semibold text-lg drop-shadow-sm leading-none m-0">AI Tutor</h3>
          </div>
          {currentContext && (
            <span className="text-[10px] text-blue-100 mt-1 font-bold uppercase tracking-wider opacity-80 line-clamp-1">
              Context: {currentContext.module}
            </span>
          )}
        </div>
        <button 
          onClick={closeAIPanel}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors border border-transparent"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-gray-900">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-12 flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-600/10 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Bot className="w-8 h-8" />
            </div>
            <p className="text-sm px-4 font-medium italic">
              {language === 'am' ? 'ሰላም! ዛሬ ምን መማር ትፈልጋለህ? ፋይል ካለህም እዚህ ጋር መላክ ትችላለህ።' : "Hi! I'm your AI Tutor. Ask me anything or upload a file for analysis!"}
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 flex flex-col ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-sm shadow-sm' 
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700/60 rounded-tl-sm shadow-sm'
            }`}>
              <span className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</span>
            </div>
          </div>
        ))}
        {loading && <div className="text-xs text-gray-400 animate-pulse">AI is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* File Preview if selected */}
      {selectedFile && (
        <div className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800/50 flex items-center justify-between">
          <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 truncate">
            <Paperclip className="w-3 h-3 mr-2 shrink-0" />
            <span className="truncate max-w-[200px]">{selectedFile.name}</span>
          </div>
          <button onClick={removeFile} className="text-red-500 hover:text-red-600 p-1">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-end gap-2 bg-slate-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 border rounded-xl p-1.5 pl-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp,.gif"
          />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={language === "am" ? "የእርስዎን ጥያቄ... ጠይቁ" : "Ask anything..."}
            className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 py-1.5 text-sm text-gray-800 dark:text-white"
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={(!input.trim() && !selectedFile) || loading}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIPanel;
