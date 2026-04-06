import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { chatWithAI } from "../api";
import { useAuth } from "../context/AuthContext";
import { useAI } from "../context/AIContext";
import {
  Send, Bot, User, Mic, Square, Paperclip,
  Trash2, Menu, Sparkles, BookOpen, Code
} from "lucide-react";
import ChatSidebar from "../components/history/ChatSidebar";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../data/translations";

const API_URL = "http://localhost:5001/api";

const AIChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const { language, setLanguage } = useLanguage();
  const t = translations[language] || translations["en"];
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { user } = useAuth();
  const {
    activeChatId, setActiveChatId, conversations,
    startNewChat, fetchHistory, updateConversationTitle
  } = useAI();

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const transcriptRef = useRef("");
  const fileInputRef = useRef(null);

  // 📖 EFFECT: Load full history when activeChatId changes
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!activeChatId) {
        setMessages([]);
        return;
      }
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_URL}/conversations/${activeChatId}`);
        setMessages(data.messages || []);
      } catch (err) {
        console.error("Failed to load conversation history:", err);
      } finally {
        setLoading(false);
      }
    };
    loadChatHistory();
  }, [activeChatId]);

  // Auto-scroll logic
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 🎤 SPEECH RECOGNITION (Simplified for brevity but functional)
  const initRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = language === "am" ? "am-ET" : "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setInput((prev) => {
        const newVal = prev + (prev ? " " : "") + transcript;
        transcriptRef.current = newVal;
        return newVal;
      });
    };
    recognition.onend = () => {
      setIsListening(false);
      if (transcriptRef.current.trim()) sendMessage(transcriptRef.current);
    };
    return recognition;
  };

  const startRecording = () => {
    const recognition = initRecognition();
    if (!recognition) return;
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopRecording = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
  };

  // 🔊 SPEAK TEXT
  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = language === "am" ? "am-ET" : "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  // 🧠 SEND MESSAGE
  const sendMessage = async (overrideText) => {
    const textToSend = typeof overrideText === "string" ? overrideText : input;
    if ((!textToSend.trim() && !selectedFile) || loading) return;

    setInput("");
    transcriptRef.current = "";
    stopRecording();

    let displayContent = textToSend;
    if (selectedFile) displayContent = `📎 [Attached: ${selectedFile.name}]\n${textToSend}`;

    const userMessage = { role: "user", content: displayContent };
    const promptText = textToSend;
    const fileToSend = selectedFile;

    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      let currentId = activeChatId;

      // AUTO-CREATE CHAT if none active
      if (!currentId) {
        const newChat = await startNewChat(user?._id);
        if (newChat) currentId = newChat._id;
      }

      const userName = user?.name || "Student";
      const data = await chatWithAI(promptText, language, userName, null, fileToSend, currentId);

      const aiReply = data?.reply || data;
      const aiMessage = { role: "ai", content: aiReply };
      setMessages((prev) => [...prev, aiMessage]);

      // ✨ Instantly update sidebar title if AI generated one
      if (data?.generatedTitle && currentId) {
        updateConversationTitle(currentId, data.generatedTitle);
      } else {
        // fallback: light refetch to sync sidebar
        fetchHistory(user?._id);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "ai", content: `⚠️ ${err.message || 'Failed to connect.'}` }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300">

      {/* 📜 SIDEBAR HISTORY */}
      <ChatSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* 💬 MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col min-w-0 relative">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 md:px-8 py-4 bg-white dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-800 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-gray-500"
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <Bot size={24} />
              </div>
              <div>
                <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  {t.ai_assistant_header}
                </h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
                  {t.powered_by_gemini}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none cursor-pointer font-black uppercase"
            >
              <option value="en">English</option>
              <option value="am">አማርኛ</option>
            </select>
            <button
              onClick={() => window.speechSynthesis.cancel()}
              className="p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
            >
              {t.stop_speech}
            </button>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 custom-scrollbar">
          {messages.length === 0 && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-blue-600/10 rounded-3xl flex items-center justify-center text-blue-600 mb-6 border border-blue-600/20">
                <Sparkles size={40} />
              </div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
                {t.empty_state_title}
              </h1>
              <p className="text-gray-500 dark:text-slate-400 max-w-md font-medium leading-relaxed">
                {t.empty_state_desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 w-full max-w-lg">
                {[
                  { icon: <Code className="text-blue-500" />, text: t.analyze_concepts, color: "bg-blue-500/5" },
                  { icon: <BookOpen className="text-green-500" />, text: t.curriculum_methodology, color: "bg-green-500/5" }
                ].map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(s.text)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-slate-800 hover:border-blue-600/30 transition-all ${s.color} hover:shadow-xl`}
                  >
                    {s.icon}
                    <span className="text-xs font-black text-gray-700 dark:text-slate-300 uppercase tracking-tight">{s.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2`}>
              <div className={`flex gap-4 max-w-[90%] md:max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 shadow-sm ${msg.role === "user" ? "bg-gray-200 dark:bg-slate-800" : "bg-blue-600"}`}>
                  {msg.role === "user" ? <User size={16} className="text-gray-500" /> : <Bot size={18} className="text-white" />}
                </div>
                <div className={`flex flex-col gap-2 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`py-4 px-6 rounded-2xl shadow-sm leading-relaxed text-sm font-medium ${msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-200 border border-gray-100 dark:border-slate-800 rounded-tl-none ring-1 ring-black/5"
                    }`}>
                    {msg.content}
                  </div>
                  {msg.role === "ai" && (
                    <button onClick={() => speakText(msg.content)} className="flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest pl-2">
                      {t.listen}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-4 animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-slate-800 flex items-center justify-center"><Bot size={18} className="text-gray-400" /></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-full w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-full w-2/3"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div className="p-4 md:p-8 bg-white dark:bg-slate-900/50 border-t border-gray-200 dark:border-slate-800 backdrop-blur-md">
          {selectedFile && (
            <div className="mb-4 p-3 bg-blue-600/10 border border-blue-600/30 rounded-2xl flex items-center justify-between animate-in zoom-in">
              <div className="flex items-center gap-3 text-xs font-black text-blue-600">
                <Paperclip size={16} /> <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(0)}KB)</span>
              </div>
              <button onClick={removeFile} className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-lg">
                <Trash2 size={16} />
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-900 border-2 border-transparent focus-within:border-blue-600/30 rounded-[2rem] p-2 transition-all shadow-xl shadow-black/5">
            <button onClick={() => fileInputRef.current?.click()} className="p-4 text-gray-400 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all">
              <Paperclip size={20} />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.type_message_placeholder}
              className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm font-bold text-gray-800 dark:text-white placeholder:text-gray-400"
            />

            {!isListening ? (
              <button onClick={startRecording} className="p-4 text-gray-400 hover:text-green-600 hover:bg-white dark:hover:bg-slate-800 rounded-full transition-all">
                <Mic size={20} />
              </button>
            ) : (
              <button onClick={stopRecording} className="p-4 bg-red-500 text-white rounded-full animate-pulse shadow-lg shadow-red-500/20">
                <Square size={18} fill="white" />
              </button>
            )}

            <button
              onClick={() => sendMessage()}
              disabled={(!input.trim() && !selectedFile) || loading}
              className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-500 disabled:opacity-30 transition-all shadow-xl shadow-blue-600/30 active:scale-95"
            >
              <Send size={20} className="translate-x-[2px]" />
            </button>
          </div>
          <p className="mt-4 text-[10px] text-center text-gray-400 font-extrabold uppercase tracking-[0.2em] opacity-50">
            {t.footer_info}
          </p>
        </div>
      </main>
    </div>
  );
};

export default AIChat;
