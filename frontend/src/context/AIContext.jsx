import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const AIContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const AIProvider = ({ children }) => {
  const { user } = useAuth();
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [currentContext, setCurrentContext] = useState(null);
  
  // 🧠 History State
  const [conversations, setConversations] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // Load history on mount or user change
  const fetchHistory = async (userId = null) => {
    setIsHistoryLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/conversations`, { params: { userId } });
      setConversations(data);
    } catch (err) {
      console.error("Failed to fetch AI history:", err);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchHistory(user._id);
    } else {
      fetchHistory(); // Default / Guest
    }
  }, [user?._id]);

  const toggleAIPanel = () => setIsAIPanelOpen(prev => !prev);
  
  const openAIPanel = (ctx = null) => {
    if (ctx) setCurrentContext(ctx);
    setIsAIPanelOpen(true);
  };

  const closeAIPanel = () => {
    setIsAIPanelOpen(false);
    setCurrentContext(null);
  };

  const startNewChat = async (userId = null) => {
    try {
      const { data } = await axios.post(`${API_URL}/conversations`, {
        title: "Session Initialization",
        userId,
        messages: []
      });
      setConversations(prev => [data, ...prev]);
      setActiveChatId(data._id);
      return data;
    } catch (err) {
      console.error("Failed to create new chat:", err);
      return null;
    }
  };

  const deleteChat = async (id) => {
    try {
      await axios.delete(`${API_URL}/conversations/${id}`);
      setConversations(prev => prev.filter(c => c._id !== id));
      if (activeChatId === id) setActiveChatId(null);
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

  const renameChat = async (id, title) => {
    try {
      await axios.patch(`${API_URL}/conversations/${id}`, { title });
      setConversations(prev => prev.map(c => c._id === id ? { ...c, title } : c));
    } catch (err) {
      console.error("Failed to rename chat:", err);
    }
  };

  const resetActiveChat = () => {
    setActiveChatId(null);
  };

  // Instantly patch a conversation title in local state (no refetch needed)
  const updateConversationTitle = (id, title) => {
    setConversations(prev => prev.map(c => c._id === id ? { ...c, title } : c));
  };

  return (
    <AIContext.Provider value={{ 
      isAIPanelOpen, 
      toggleAIPanel, 
      openAIPanel, 
      closeAIPanel, 
      currentContext,
      conversations,
      activeChatId,
      setActiveChatId,
      isHistoryLoading,
      fetchHistory,
      startNewChat,
      deleteChat,
      renameChat,
      resetActiveChat,
      updateConversationTitle
    }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);
