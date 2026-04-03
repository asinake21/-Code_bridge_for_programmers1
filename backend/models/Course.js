const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'Uncategorized'
  },
  level: {
    type: String,
    default: 'Beginner'
  },
  duration: {
    type: String,
    default: '4 weeks'
  },
  icon: {
    type: String,
    default: 'Book'
  },
  modules: [{
    title: String,
    duration: String,
    topics: [String]
  }],
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);
