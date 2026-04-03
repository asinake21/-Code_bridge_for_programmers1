const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

// Get all messages for a user
router.get('/:userId', async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.params.userId })
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new message
router.post('/', async (req, res) => {
  const message = new Message({
    userId: req.body.userId,
    type: req.body.type,
    content: req.body.content,
    language: req.body.language,
  });

  try {
    const newMessage = await message.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete all messages for a user
router.delete('/:userId', async (req, res) => {
  try {
    await Message.deleteMany({ userId: req.params.userId });
    res.json({ message: 'Messages deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;