const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

// 🔍 Create a new conversation
router.post('/', conversationController.createConversation);

// 📃 Get list of all conversations for a user
router.get('/', conversationController.getConversations);

// 📖 Get full history/messages for one conversation
router.get('/:id', conversationController.getConversationById);

// 📝 Update a conversation (Rename, Pin)
router.patch('/:id', conversationController.updateConversation);

// ✉️ Add a message to an existing conversation
router.post('/:id/messages', conversationController.addMessage);

// 🗑️ Delete a conversation
router.delete('/:id', conversationController.deleteConversation);

module.exports = router;
