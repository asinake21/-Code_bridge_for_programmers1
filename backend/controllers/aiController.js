const axios = require("axios");

exports.askAI = async (req, res) => {
  try {
    const { message } = req.body;

    console.log("User message:", message);

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a helpful programming tutor.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content;

    console.log("AI reply:", reply);

    res.json({ reply });

  } catch (error) {
    console.error("AI ERROR:", error.response?.data || error.message);

    res.status(500).json({
      reply: "⚠️ AI failed. Check backend logs.",
    });
  }
};
