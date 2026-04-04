const express = require('express');
const router = express.Router();
const axios = require('axios');
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// 🌍 ROBUST MULTI-SERVICE TRANSLATION FUNCTION
const translate = async (text, target, source = "auto") => {
  if (!text) return text;
  
  // Strict source determination for explicit fallback APIs
  const src = source === "auto" ? (target === "en" ? "am" : "en") : source;
  const tgt = target;

  try {
    // Priority 1: LibreTranslate
    const res = await axios.post("https://libretranslate.de/translate", {
      q: text,
      source: "auto",
      target: tgt,
      format: "text",
    }, { timeout: 4000 });
    
    if (res.data && res.data.translatedText) {
      return res.data.translatedText;
    }
  } catch (err) {
    console.error(`[Translation] LibreTranslate failed: ${err.message}. Attempting MyMemory fallback...`);
  }

  try {
    // Priority 2: MyMemory API
    const langpair = `${src}|${tgt}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;
    const res = await axios.get(url, { timeout: 4000 });
    
    if (res.data && res.data.responseData && res.data.responseData.translatedText) {
      const translated = res.data.responseData.translatedText;
      // MyMemory returns "NO QUERY SPECIFIED" or copies exact string if completely mismatched, but generally works
      return translated;
    }
  } catch (err) {
    console.error(`[Translation] MyMemory failed: ${err.message}. Attempting Lingva fallback...`);
  }

  try {
    // Priority 3: Lingva API
    const url = `https://lingva.ml/api/v1/${src}/${tgt}/${encodeURIComponent(text)}`;
    const res = await axios.get(url, { timeout: 5000 });
    
    if (res.data && res.data.translation) {
      return res.data.translation;
    }
  } catch (err) {
    console.error(`[Translation] Lingva failed: ${err.message}. Returning original text.`);
  }

  // Final Fallback: Return original input text
  return text;
};


router.post("/chat", async (req, res) => {
  try {
    const { message, language } = req.body;
    let inputText = message;

    // 1️⃣ Translate Amharic → English (Fallback protected)
    if (language === "am") {
      inputText = await translate(message, "en", "am");
    }

    // 2️⃣ Send to Groq
    let reply = "";
    try {
      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Explain clearly for beginners. Respond naturally and directly. Do not say phrases like 'as you see' or refer to the conversation itself." },
          { role: "user", content: inputText || "Hello" },
        ],
      });
      reply = completion.choices[0].message.content;
    } catch (groqError) {
      console.error("[Groq] AI completion failed:", groqError.message);
      // Always return a valid reply rather than crashing via 500
      return res.json({ reply: "I'm sorry, I'm currently experiencing technical difficulties processing your request." });
    }

    // 3️⃣ Translate reply back → Amharic (Fallback protected)
    if (language === "am" && reply) {
      reply = await translate(reply, "am", "en");
    }

    // 4️⃣ Return safe response
    res.json({ reply });

  } catch (error) {
    console.error("[UNEXPECTED ERROR] /api/chat route failed:", error.message);
    res.json({ reply: "An unexpected error occurred in our system. Continuing with standard services." });
  }
});

module.exports = router;