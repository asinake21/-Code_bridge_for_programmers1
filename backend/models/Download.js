const mongoose = require('mongoose');

const downloadSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  downloadedAt: {
    type: Date,
    default: Date.now
  }
});

// Avoid duplicate downloads
downloadSchema.index({ courseId: 1 }, { unique: true });

module.exports = mongoose.model('Download', downloadSchema);
