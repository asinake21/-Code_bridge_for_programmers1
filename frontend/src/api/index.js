import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const sendMessageToAI = async (message) => {
  return API.post("/ai/chat", { message });
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
