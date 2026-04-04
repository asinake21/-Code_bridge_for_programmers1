import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

export const chatWithAI = async (message, language = "en") => {
  try {
    const res = await axios.post("http://localhost:5001/api/ai/chat", {
      message,
      language,
    });
    return res.data.reply;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      throw new Error(err.response.data.error);
    }
    throw err;
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
