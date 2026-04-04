const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');

// Get progress for a specific user and course
router.get('/:userId/:courseId', async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.params.userId, courseId: req.params.courseId });
    if (!progress) {
       return res.json({ completedVideos: [], completedLessons: [], passedQuizzes: false, codeExecutions: 0, overallPercentage: 0 });
    }
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update progress (dynamically based on the sent data)
router.post('/', async (req, res) => {
  try {
    const { userId, courseId, updateType, itemId } = req.body;
    let progress = await Progress.findOne({ userId, courseId });
    
    if (!progress) {
      progress = new Progress({ userId, courseId });
    }

    if (updateType === 'video' && itemId) {
      if (!progress.completedVideos.includes(itemId)) progress.completedVideos.push(itemId);
    } else if (updateType === 'lesson' && itemId) {
      if (!progress.completedLessons.includes(itemId)) progress.completedLessons.push(itemId);
    } else if (updateType === 'quiz') {
      progress.passedQuizzes = true;
    } else if (updateType === 'code') {
      progress.codeExecutions += 1;
    }

    // A simple calculation for overallPercentage
    const totalVideos = 5; // Placeholder (dynamic calculation should be done realistically)
    const totalLessons = 5;
    const itemsCompleted = progress.completedVideos.length + progress.completedLessons.length + (progress.passedQuizzes ? 1 : 0);
    const totalItems = totalVideos + totalLessons + 1;
    progress.overallPercentage = Math.min(100, Math.floor((itemsCompleted / totalItems) * 100));

    progress.lastAccessed = Date.now();
    await progress.save();
    
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
