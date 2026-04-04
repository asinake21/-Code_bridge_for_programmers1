const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

router.get('/:courseId', async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ courseId: req.params.courseId });
    if (!quiz) return res.json({ questions: [] });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
