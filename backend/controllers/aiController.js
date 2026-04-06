const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require("groq-sdk");
const Conversation = require("../models/Conversation");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "dummy");
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Initialize Groq (Fallback)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.askAI = async (req, res) => {
  try {
    const { message, language, userName, context, conversationId } = req.body;
    const file = req.file;
    const name = userName || "Student";

    if (!message && !file) {
      return res.status(400).json({ error: "No message or file provided" });
    }

    // 🛡️ Robust parsing for context
    let parsedContext = context;
    if (typeof context === 'string' && context.startsWith('{')) {
      try {
        parsedContext = JSON.parse(context);
      } catch (e) {
        parsedContext = null;
      }
    }

    console.log(`[AI Request] (${language}) for ${name} [Context: ${parsedContext?.course || 'General'}] [File: ${file?.originalname || 'None'}]: ${message || '[File Only]'}`);

    // Dynamic Context Injection
    const contextPrompt = parsedContext 
      ? `The student is currently studying: Course "${parsedContext.course || 'Unknown'}", Module "${parsedContext.module || 'Unknown'}".`
      : "The student is exploring the platform generally.";

    // 🚀 NEW Multimodal Concise Persona Prompt
    let systemInstruction = `
      You are the Code Bridge Academic AI Tutor — a highly specialized, formal, and authoritative programming intelligence for the Ethiopian student population.
      
      CONTEXT: ${contextPrompt}

      STRICT RULES:
      1. Tone: Maintain a formal, academic, and professional demeanor at all times. Use structured explanations and industry-standard terminology. (Max 3-4 concise sentences per turn).
      2. If a file is provided, acknowledge it formally (e.g., "I have received your document 'lecture-notes.pdf'. I shall analyze its technical contents and provide a summary.").
      3. For images: Formally describe the technical architecture or visual components as they relate to development.
      4. For documents: Synthesize key learning objectives and extract primary concepts.
      5. Language Consistency: Use the requested language (${language}) exclusively. NEVER mix Amharic and English in the same sentence. 
      6. No repetition, no informal filler (avoid "Okay", "Cool", "Let's do this").
    `;

    // Gemini Config (User specific)
    const generationConfig = {
      temperature: 0.65,
      topP: 0.9,
      maxOutputTokens: 400,
    };

    // Prepare Gemini Parts
    const parts = [{ text: `${systemInstruction}\n\nStudent Name: ${name}\nUser Message: ${message || "Please analyze this file."}` }];
    
    // Add file if exists
    if (file) {
      parts.push({
        inlineData: {
          mimeType: file.mimetype,
          data: file.buffer.toString("base64")
        }
      });
    }

    try {
      // 🚀 Gemini Multimodal Call
      const result = await geminiModel.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig,
      });
      const reply = result.response.text();

      // 💾 Persistent Storage: Update conversation if ID exists
      let generatedTitle = null;
      if (conversationId) {
        try {
          const conversation = await Conversation.findById(conversationId);
          if (conversation) {
            const currentMessage = message || (file ? `File: ${file.originalname}` : "Research Session");
            
            // ✨ AI-Powered Title Generation: Only on first turn
            const needsTitle = !conversation.title || 
              conversation.title === "New Conversation" || 
              conversation.title === "Session Initialization";
            
            if (needsTitle && currentMessage) {
              try {
                const titleResult = await geminiModel.generateContent({
                  contents: [{ role: "user", parts: [{ 
                    text: `Generate a professional, concise academic title (4-6 words max) for a programming tutoring session that started with this inquiry: "${currentMessage.substring(0, 150)}". 
                    Rules:
                    - Return ONLY the title, nothing else
                    - No quotes, no punctuation at the end
                    - Format like: "React State Management Fundamentals" or "MongoDB Aggregation Pipeline Analysis"
                    - Be formal and academic`
                  }] }],
                  generationConfig: { temperature: 0.3, maxOutputTokens: 20 },
                });
                generatedTitle = titleResult.response.text().trim().replace(/["'.]/g, '');
              } catch (titleErr) {
                // Fallback to clean substring
                generatedTitle = currentMessage.replace(/[^\w\s]/gi, '').substring(0, 40).trim();
              }
              conversation.title = generatedTitle || "Technical Inquiry";
            }

            conversation.messages.push({ 
              role: 'user', 
              content: currentMessage,
              fileUrl: file ? `/uploads/${file.filename}` : undefined 
            });
            conversation.messages.push({ role: 'ai', content: reply });
            conversation.lastMessage = reply;
            await conversation.save();
          }
        } catch (saveError) {
          console.error("FAILED TO SAVE TO HISTORY:", saveError.message);
        }
      }

      return res.json({ reply, generatedTitle });
    } catch (geminiError) {
      console.error("GEMINI AI ERROR:", geminiError.message);
      
      // 🔄 Fallback to Groq for text-only if Gemini fails (Groq doesn't support files easily in this flow)
      if (file) throw geminiError; // Cannot fallback for files

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a concise programming tutor. Max 3 sentences." },
          { role: "user", content: systemInstruction + "\n\n" + (message || "") },
        ],
        temperature: 0.7,
        max_tokens: 400,
      });
      
      const reply = completion.choices[0].message.content;
      return res.json({ reply });
    }

  } catch (error) {
    console.error("TOTAL AI FAILURE:", error.message);
    res.status(500).json({
      reply: "⚠️ AI is currently unavailable or the file type is unsupported. Please try again later.",
    });
  }
};
