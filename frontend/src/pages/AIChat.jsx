import React, { useState, useRef, useEffect } from "react";
import { chatWithAI } from "../api";
import { Send, Bot, User, Mic, Square } from "lucide-react";

/** COMPLETE AI VOICE + RECORDING CONTROL */
const AIChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const transcriptRef = useRef("");

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // 🎤 INIT SPEECH RECOGNITION
  const initRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.lang = language === "am" ? "am-ET" : "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setInput((prev) => {
        const newVal = prev + (prev ? " " : "") + transcript;
        transcriptRef.current = newVal;
        return newVal;
      });

      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        recognition.stop();
      }, 2000);
    };

    recognition.onend = () => {
      setIsListening(false);
      clearTimeout(silenceTimerRef.current);
      if (transcriptRef.current.trim()) {
        sendMessage(transcriptRef.current);
      }
    };

    return recognition;
  };

  // 🎤 START RECORDING
  const startRecording = () => {
    const recognition = initRecognition();
    if (!recognition) {
      alert("Speech Recognition not supported in your browser.");
      return;
    }

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  // ⏹ STOP RECORDING
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    clearTimeout(silenceTimerRef.current);
    setIsListening(false);
  };

  // 🔊 SPEAK TEXT
  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;
    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = language === "am" ? "am-ET" : "en-US";
    speech.rate = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const amVoice = voices.find((v) => v.lang === "am-ET");
    const enVoice = voices.find((v) => v.lang.includes("en"));

    speech.voice = language === "am" ? amVoice || enVoice : enVoice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  // ⛔ STOP SPEAKING
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  // 🧠 SEND MESSAGE
  const sendMessage = async (overrideText) => {
    const textToSend = typeof overrideText === "string" ? overrideText : input;
    if (!textToSend.trim() || loading) return;

    // Clear state early to avoid onend re-sending
    setInput("");
    transcriptRef.current = "";

    // Stop recording when sending a message
    stopRecording();

    const userMessage = { role: "user", content: textToSend };
    const userPromptText = textToSend;

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // Connect to port 5001 securely via Code Bridge API wrapper with native language support
      const aiReply = await chatWithAI(userPromptText, language);
      
      const aiMessage = { role: "ai", content: aiReply };
      setMessages((prev) => [...prev, aiMessage]);

      // ❌ NO AUTO SPEAK - Custom Request
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "ai", content: `⚠️ ${err.message || 'Failed to connect to AI API.'}` }]);
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
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto shadow-sm bg-gray-50 dark:bg-gray-900 border-x border-gray-200 dark:border-gray-800">

      {/* HEADER WITH 🌍 LANGUAGE + STOP VOICE */}
      <div className="flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
            <Bot size={24} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">AI Tutor</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 font-medium uppercase tracking-wide"
          >
            <option value="en">English (EN)</option>
            <option value="am">አማርኛ (AM)</option>
          </select>
          
          <button
            onClick={stopSpeaking}
            className="bg-red-500 hover:bg-red-600 text-white font-medium text-sm px-3 py-2 rounded-lg transition-colors shadow-sm"
          >
            Stop Voice
          </button>
        </div>
      </div>

      {/* 💬 CHAT MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center mt-10 text-gray-500 dark:text-gray-400">
             {language === 'am' ? 'ሰላም ይበሉና መወያየት ይጀምሩ!' : 'Say "Hello" or select a language to start chatting!'}
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar */}
              <div className="flex-shrink-0 mt-1">
                {msg.role === "user" ? (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User size={16} className="text-gray-600 dark:text-gray-400" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center">
                    <Bot size={18} className="text-blue-600 dark:text-blue-400" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-1 items-start">
                <div
                  className={`py-3 px-5 shadow-sm rounded-2xl whitespace-pre-wrap leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700/50 rounded-tl-sm ring-1 ring-black/5"
                  }`}
                >
                  {msg.content}
                </div>
                
                {/* 🔊 VOICE BUTTON ONLY FOR AI */}
                {msg.role === "ai" && (
                  <div className="mt-1 flex items-center gap-2">
                    <button
                      onClick={() => speakText(msg.content)}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 px-2 py-1 rounded transition-colors bg-white/50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 font-medium shadow-sm"
                      title="Read Aloud"
                    >
                      🔊 Speak
                    </button>
                    
                    <button
                      onClick={stopSpeaking}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 px-2 py-1 rounded transition-colors bg-white/50 dark:bg-gray-800/50 hover:bg-red-50 dark:hover:bg-red-900/30 font-medium shadow-sm"
                      title="Stop Audio"
                    >
                      ⛔ Stop
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && (
           <div className="flex w-full justify-start">
             <div className="flex gap-3 flex-row pl-11">
               <div className="text-gray-400 dark:text-gray-500 animate-pulse text-sm font-medium">
                  Thinking...
               </div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ✨ INPUT AREA */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
          {/* INPUT */}
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              transcriptRef.current = e.target.value;
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              language === "am"
                ? "መልእክት ይጻፉ..."
                : "Type a message..."
            }
            className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 min-w-0"
          />

          {/* 🎤 START */}
          {!isListening && (
            <button
              onClick={startRecording}
              className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors shadow-sm flex-shrink-0"
              title="Start Recording"
            >
              <Mic size={20} />
            </button>
          )}

          {/* ⏹ STOP */}
          {isListening && (
            <button
              onClick={stopRecording}
              className="p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl transition-colors shadow-sm flex-shrink-0 animate-pulse"
              title="Stop Recording"
            >
              <Square size={20} className="fill-current" />
            </button>
          )}

          {/* SEND */}
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading || isListening}
            className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md flex-shrink-0"
            title="Send Message"
          >
            <Send size={20} className="translate-x-[2px]" />
          </button>
        </div>
        {isListening && (
           <div className="flex justify-center items-center gap-2 mt-2">
             <div className="flex gap-0.5 items-end h-3">
               <div className="w-1 bg-green-500 rounded animate-[bounce_1s_infinite_100ms] h-full"></div>
               <div className="w-1 bg-green-500 rounded animate-[bounce_1s_infinite_200ms] h-1/2"></div>
               <div className="w-1 bg-green-500 rounded animate-[bounce_1s_infinite_300ms] h-3/4"></div>
               <div className="w-1 bg-green-500 rounded animate-[bounce_1s_infinite_400ms] h-full"></div>
             </div>
             <p className="text-xs text-green-600 font-medium animate-pulse">Listening...</p>
           </div>
        )}
      </div>
    </div>
  );
};

export default AIChat;