const Conversation = require('../models/Conversation');

// 🔍 Create a new conversation
exports.createConversation = async (req, res) => {
  try {
    const { title, userId, messages } = req.body;
    const conversation = new Conversation({
      userId,
      title: title || "New Conversation",
      messages: messages || [],
    });
    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📃 Get all conversations for a user
exports.getConversations = async (req, res) => {
  try {
    const { userId } = req.query;
    // If no userId, could return guest history from a specific ID if we wanted, 
    // but usually frontend handles guests via localStorage.
    const query = userId ? { userId } : {}; 
    const conversations = await Conversation.find(query)
      .sort({ updatedAt: -1 })
      .select('title lastMessage updatedAt isPinned');
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📖 Get full history for a specific conversation
exports.getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ error: "Conversation not found" });
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📝 Append a message to an existing conversation
exports.addMessage = async (req, res) => {
  try {
    const { role, content, fileUrl } = req.body;
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ error: "Conversation not found" });

    // Update title automatically on first user message if it's still "New Conversation"
    if (conversation.messages.length === 0 && role === 'user') {
      conversation.title = content.substring(0, 40) + (content.length > 40 ? '...' : '');
    }

    conversation.messages.push({ role, content, fileUrl });
    conversation.lastMessage = content;
    await conversation.save();
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📝 Update a conversation (Rename, Toggle Pin, or Append Message)
exports.updateConversation = async (req, res) => {
  try {
    const { title, isPinned, message } = req.body;
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ error: "Conversation not found" });

    // Handle Title Update (Manual or Auto on first message)
    if (title) conversation.title = title;
    if (isPinned !== undefined) conversation.isPinned = isPinned;

    // Handle Message Append (If message object provided)
    if (message && message.content) {
      // Auto-title if it's the very first user message
      if (conversation.messages.length === 0 && message.role === 'user') {
        conversation.title = message.content.substring(0, 40) + (message.content.length > 40 ? '...' : '');
      }
      conversation.messages.push(message);
      conversation.lastMessage = message.content;
    }

    await conversation.save();
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🗑️ Delete conversation
exports.deleteConversation = async (req, res) => {
  try {
    await Conversation.findByIdAndDelete(req.params.id);
    res.json({ message: "Conversation deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
