const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  level: { type: String, required: true },
  section: { type: String, required: true },
  duration: { type: String, required: true },
  modulesCount: { type: Number, required: true },
  icon: { type: String, required: true },
  order: { type: Number, required: true }
});

module.exports = mongoose.model('Course', courseSchema);
