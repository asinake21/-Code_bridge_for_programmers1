import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

export const chatWithAI = async (message, language = "en", userName = "Student", context = null, file = null, conversationId = null) => {
  try {
    const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      throw new Error("Missing VITE_GROQ_API_KEY in frontend .env");
    }

    let parsedContext = context;
    if (typeof context === 'string' && context.startsWith('{')) {
      try { parsedContext = JSON.parse(context); } catch (e) { parsedContext = null; }
    }
    const contextPrompt = parsedContext 
      ? `The student is currently studying: Course "${parsedContext.course || 'Unknown'}", Module "${parsedContext.module || 'Unknown'}".`
      : "The student is exploring the platform generally.";

    let systemInstruction = `
      You are the Code Bridge Academic AI Tutor — a highly specialized, formal, and authoritative programming intelligence for the Ethiopian student population.
      
      CONTEXT: ${contextPrompt}

      STRICT RULES:
      1. Tone: Maintain a formal, academic, and professional demeanor at all times. Use structured explanations and industry-standard terminology. (Max 3-4 concise sentences per turn).
      2. If a file is provided, acknowledge it formally.
      3. For images: Formally describe the technical architecture or visual components as they relate to development.
      4. For documents: Synthesize key learning objectives and extract primary concepts.
      5. Language Consistency: Use the requested language (${language}) exclusively. NEVER mix Amharic and English in the same sentence. 
      6. No repetition, no informal filler.
    `;

    if (file) {
      return { reply: "File uploads are currently unsupported when using Groq exclusively. Please ask your question using text only." };
    }

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: `Student Name: ${userName}\nUser Message: ${message || "Hello"}` }
        ],
        temperature: 0.65,
        max_tokens: 400
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Groq API error");
    
    return { reply: data.choices[0].message.content, generatedTitle: null };
  } catch (err) {
    console.error("AI Chat API Error:", err);
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
