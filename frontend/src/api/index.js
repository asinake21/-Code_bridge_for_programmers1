import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

export const chatWithAI = async (message, language = "en") => {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, language })
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return data.reply;
  } catch (err) {
    console.error("AI Chat API Error:", err);
    throw new Error("Failed to connect to AI server");
  }
};

export const courseApi = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/courses`);
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  },
  getById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/courses/${id}`);
    if (!res.ok) throw new Error('Failed to fetch course');
    return res.json();
  }
};

export const downloadApi = {
  getAll: async () => {
    const res = await fetch(`${API_BASE_URL}/downloads`);
    if (!res.ok) throw new Error('Failed to fetch downloads');
    return res.json();
  },
  save: async (courseId, title) => {
    const res = await fetch(`${API_BASE_URL}/downloads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, title })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to trigger download');
    return data;
  }
};
