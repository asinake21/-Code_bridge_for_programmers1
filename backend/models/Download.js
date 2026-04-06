const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  week: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  title: {
    type: String
  },
  downloadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Download', downloadSchema);
