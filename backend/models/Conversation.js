const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // Optional for guest history if needed later
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  messages: [
    {
      role: {
        type: String,
        enum: ['user', 'ai'],
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      fileUrl: {
        type: String,
        required: false,
      },
    }
  ],
  lastMessage: {
    type: String,
    required: false,
  },
  isPinned: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
