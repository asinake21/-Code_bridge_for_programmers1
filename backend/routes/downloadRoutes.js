const express = require('express');
const router = express.Router();
const Download = require('../models/Download');

// POST /api/download - Save a download record
router.post('/', async (req, res) => {
  try {
    const { userId, courseId, week, fileUrl, title } = req.body;
    if (!userId || !courseId || !week || !fileUrl) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const downloadRecord = await Download.create({
      userId,
      courseId,
      week,
      fileUrl,
      title
    });

    res.status(201).json(downloadRecord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/downloads/:userId - Fetch all downloads for a user
router.get('/:userId', async (req, res) => {
  try {
    const downloads = await Download.find({ userId: req.params.userId })
      .populate('courseId', 'title')
      .sort({ downloadedAt: -1 });
    
    res.json(downloads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/downloads/:id - Remove a download record
router.delete('/:id', async (req, res) => {
  try {
    const download = await Download.findByIdAndDelete(req.params.id);
    if (!download) {
      return res.status(404).json({ message: "Download not found" });
    }
    res.json({ message: "Download record removed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
