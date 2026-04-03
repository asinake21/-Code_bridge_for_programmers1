import { useState, useRef, useEffect } from "react";
import { sendMessageToAI } from "../api";
import { Send, Bot, User, AlertCircle, Loader2 } from "lucide-react";

/** Beautiful, professional Code Bridge AI Chat UI */
const AIChat = () => {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      type: "ai",
      text: "👋 Welcome to Code Bridge AI! I am your personal tutor. Ask me anything about programming!",
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { id: Date.now(), type: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessageToAI(input);
      // The API uses `reply` in the JSON body. Check our implementation.
      const aiReply = res.data?.reply || res.data?.error || "Empty Response";

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, type: "ai", text: aiReply },
      ]);
    } catch (err) {
      console.error(err);
      
      // Determine if it was an unauthorized error due to API keys
      const errorMsg =
        err.response?.status === 401 
          ? "⚠️ Invalid API Key. Please update your OPENAI_API_KEY in the backend/.env file!"
          : "⚠️ Failed to connect to AI. Check if backend is running.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, type: "ai", text: errorMsg, isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 border-x border-gray-200 dark:border-gray-800 max-w-5xl mx-auto shadow-sm">
      
      {/* HEADER */}
      <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">Code Bridge Tutor</h2>
          <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Online
          </p>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.type === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar */}
              <div className="flex-shrink-0 mt-1">
                {msg.type === "user" ? (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User size={16} className="text-gray-600 dark:text-gray-400" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center">
                    <Bot size={18} className="text-blue-600 dark:text-blue-400" />
                  </div>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`py-3 px-5 shadow-sm rounded-2xl whitespace-pre-wrap leading-relaxed ${
                  msg.type === "user"
                    ? "bg-blue-600 text-white rounded-tr-sm"
                    : msg.isError 
                      ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-tl-sm"
                      : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700/50 rounded-tl-sm ring-1 ring-black/5"
                }`}
              >
                {msg.isError && <AlertCircle size={16} className="inline-block mr-2 mb-1" />}
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex w-full justify-start">
            <div className="flex gap-3 max-w-[85%] flex-row">
               <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center">
                    <Bot size={18} className="text-blue-600 dark:text-blue-400" />
                  </div>
               </div>
               <div className="py-3 px-5 shadow-sm rounded-2xl rounded-tl-sm bg-white dark:bg-gray-800 text-gray-500 flex items-center gap-2 border border-gray-100 dark:border-gray-700/50">
                 <Loader2 size={16} className="animate-spin text-blue-600" />
                 Processing...
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="relative flex items-end gap-2 max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Code Bridge AI... (Press Enter to send)"
            className="flex-1 max-h-32 min-h-[52px] p-4 pr-12 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:text-white resize-none transition-all"
            rows="1"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`absolute right-2 bottom-2 p-2 rounded-xl transition-all flex items-center justify-center ${
              !input.trim() || loading
                ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-95"
            }`}
          >
            <Send size={20} className={input.trim() && !loading ? "translate-x-0.5" : ""} />
          </button>
        </div>
        <p className="text-center text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-3 font-medium">
          Free AI Assistant. Press Shift + Enter for new line.
        </p>
      </div>

    </div>
  );
};

export default AIChat;