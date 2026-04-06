const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String },
  notes_en: { type: String },
  notes_am: { type: String },
  notesFile: { type: String },
  codeExample: { type: String },
  mdnLink: { type: String }
});

const weekSchema = new mongoose.Schema({
  title: { type: String, required: true },
  notes: { type: String, default: "" },
  codeChallenge: {
    templateCode: { type: String },
    language: { type: String, enum: ['html', 'css', 'js', 'react', 'nodejs', 'python', 'php', 'java', 'c++', 'mongodb', 'sql'], default: 'html' },
    description: { type: String }
  },
  lessons: [lessonSchema]
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  level: { type: String, required: true },
  section: { type: String, required: true },
  duration: { type: String, required: true },
  modulesCount: { type: Number, required: true },
  icon: { type: String, required: true },
  order: { type: Number, required: true },
  weeks: [weekSchema]
});

module.exports = mongoose.model('Course', courseSchema);
