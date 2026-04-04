const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  content_en: { type: String, required: true },
  content_am: { type: String, required: true },
  exampleCode: { type: String },
  mdnLink: { type: String },
  videoUrl: { type: String },
  order: { type: Number, required: true }
});

module.exports = mongoose.model('Lesson', lessonSchema);
