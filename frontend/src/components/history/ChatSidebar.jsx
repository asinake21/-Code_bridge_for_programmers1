import React, { useState } from 'react';
import { 
  MessageSquare, Plus, Search, Trash2, Edit2, 
  ChevronLeft, ChevronRight, Clock, MoreVertical,
  Check, X
} from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../data/translations';

const ChatSidebar = ({ isOpen, setIsOpen }) => {
  const { 
    conversations, activeChatId, setActiveChatId, 
    resetActiveChat, deleteChat, renameChat, isHistoryLoading 
  } = useAI();
  const { language } = useLanguage();
  const t = translations[language] || translations["en"];
  
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const PLACEHOLDER_TITLES = ['New Conversation', 'Session Initialization', ''];

  const filteredConversations = conversations
    .filter(c => !PLACEHOLDER_TITLES.includes(c.title?.trim()))
    .filter(c => 
      (c.title || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleStartEdit = (e, conv) => {
    e.stopPropagation();
    setEditingId(conv._id);
    setEditTitle(conv.title);
  };

  const handleSaveEdit = async (e, id) => {
    e.stopPropagation();
    await renameChat(id, editTitle);
    setEditingId(null);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm(t.confirm_delete_chat)) {
      await deleteChat(id);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-80 bg-white dark:bg-[#0f172a] border-r border-gray-200 dark:border-slate-800
        transition-all duration-300 ease-in-out transform
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:w-0 lg:opacity-0'}
      `}>
        <div className="flex flex-col h-full">
          
          {/* Header & New Chat */}
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-xl text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                <Clock className="text-blue-600" /> {t.session_archives}
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <ChevronLeft size={20} />
              </button>
            </div>

            <button 
              onClick={() => {
                resetActiveChat();
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className="w-full py-4 bg-slate-900 dark:bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-600/20 active:scale-95 border border-white/10"
            >
              <Plus size={18} strokeWidth={3} /> {t.initiate_new_session}
            </button>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text"
                placeholder={t.search_conv_placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto px-2 pb-4 custom-scrollbar">
            {isHistoryLoading ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.loading_sessions}</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="text-gray-400" size={24} />
                </div>
                <p className="text-sm font-bold text-gray-500">{t.no_sessions_yet}</p>
                <p className="text-xs text-gray-400">{t.start_new_session_desc}</p>
              </div>
            ) : (
              <div className="space-y-1">
                {filteredConversations.map((conv) => (
                  <div 
                    key={conv._id}
                    onClick={() => {
                      setActiveChatId(conv._id);
                      if (window.innerWidth < 1024) setIsOpen(false);
                    }}
                    className={`
                      group relative p-4 rounded-2xl cursor-pointer transition-all border-2
                      ${activeChatId === conv._id 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-600/50' 
                        : 'border-transparent hover:bg-gray-50 dark:hover:bg-slate-900'}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <MessageSquare className={`mt-1 shrink-0 ${activeChatId === conv._id ? 'text-blue-600' : 'text-gray-400'}`} size={16} />
                      
                      <div className="flex-1 min-w-0">
                        {editingId === conv._id ? (
                          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                            <input 
                              autoFocus
                              value={editTitle}
                              onChange={e => setEditTitle(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleSaveEdit(e, conv._id)}
                              className="w-full bg-white dark:bg-slate-800 border border-blue-600 rounded px-1 text-sm font-bold h-6"
                            />
                            <Check 
                              size={14} 
                              className="text-green-600 cursor-pointer" 
                              onClick={e => handleSaveEdit(e, conv._id)} 
                            />
                            <X 
                              size={14} 
                              className="text-red-600 cursor-pointer" 
                              onClick={e => setEditingId(null)} 
                            />
                          </div>
                        ) : (
                          <>
                            <h4 className={`text-sm font-bold truncate ${activeChatId === conv._id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-200'}`}>
                              {conv.title}
                            </h4>
                            <p className="text-[10px] text-gray-500 font-medium uppercase mt-1">
                              {new Date(conv.updatedAt).toLocaleDateString()}
                            </p>
                          </>
                        )}
                      </div>

                      {/* Actions */}
                      <div className={`
                        flex items-center gap-1 transition-opacity
                        ${editingId === conv._id ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}
                      `}>
                        <button 
                          onClick={(e) => handleStartEdit(e, conv)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(e, conv._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-slate-800">
             <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-gray-100 dark:border-slate-800/50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-600/20">
                  CB
                </div>
                <div>
                   <p className="text-xs font-black text-gray-900 dark:text-white tracking-widest uppercase">{t.academic_archive_footer}</p>
                   <p className="text-[10px] text-gray-400 font-medium">{t.code_bridge_ai_platform}</p>
                </div>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ChatSidebar;
