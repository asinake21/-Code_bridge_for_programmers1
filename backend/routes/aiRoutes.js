const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Check if the API key is the default placeholder
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return res.status(401).json({ error: "API Key Missing. Please replace 'your_openai_api_key_here' in your backend/.env with your real OpenAI Key." });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful AI assistant for students learning programming." },
        { role: "user", content: message }
      ],
    });

    res.json({
      reply: completion.choices[0].message.content
    });

  } catch (error) {
    console.error("OpenAI API Error:", error.message);
    res.status(error.status || 500).json({ error: error.message || "AI failed to respond." });
  }
});

module.exports = router;
