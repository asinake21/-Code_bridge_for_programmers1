import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

export const chatWithAI = async (message, language = "en", userName = "Student", context = null, file = null, conversationId = null) => {
  try {
    let body;
    let headers = {};

    if (file) {
      // Use FormData for file uploads
      body = new FormData();
      if (message) body.append("message", message);
      body.append("language", language);
      body.append("userName", userName);
      if (context) body.append("context", JSON.stringify(context));
      if (conversationId) body.append("conversationId", conversationId);
      body.append("file", file);
      // Let the browser set the boundary for multipart/form-data
    } else {
      // Standard JSON
      headers["Content-Type"] = "application/json";
      body = JSON.stringify({ message, language, userName, context, conversationId });
    }

    const res = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: "POST",
      headers,
      body,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.reply || data.error || "API error");
    
    return data; // returns { reply, generatedTitle }
  } catch (err) {
    console.error("AI Chat API Error:", err);
    throw err; // Preserve the actual error message
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
  getAll: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/downloads/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch downloads');
    return res.json();
  },
  save: async (userId, courseId, week, fileUrl, title) => {
    const res = await fetch(`${API_BASE_URL}/downloads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, courseId, week, fileUrl, title })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to trigger download');
    return data;
  },
  remove: async (id) => {
    const res = await fetch(`${API_BASE_URL}/downloads/${id}`, {
      method: 'DELETE'
    });
    
    // Check if the response is JSON before parsing
    const contentType = res.headers.get("content-type");
    if (res.ok && contentType && contentType.includes("application/json")) {
      return res.json();
    } else {
      const text = await res.text();
      throw new Error(text || `Server error: ${res.status}`);
    }
  }
};
