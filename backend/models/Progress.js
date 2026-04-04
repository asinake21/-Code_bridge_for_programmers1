const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  passedQuizzes: { type: Boolean, default: false },
  codeExecutions: { type: Number, default: 0 },
  overallPercentage: { type: Number, default: 0 },
  lastAccessed: { type: Date, default: Date.now }
});

// Assuming user progress might also be tracked in localStorage if no user is signed in,
// userId could be optional (or we fall back to localStorage in frontend without hitting this DB).

module.exports = mongoose.model('Progress', progressSchema);
