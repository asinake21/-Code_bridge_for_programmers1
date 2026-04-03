const express = require('express');
const router = express.Router();
const Download = require('../models/Download');

// GET downloaded courses
router.get('/', async (req, res) => {
  try {
    const downloads = await Download.find().populate('courseId');
    res.json(downloads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST save a download
router.post('/', async (req, res) => {
  try {
    const { courseId, title } = req.body;
    
    // Check if already downloaded
    const existing = await Download.findOne({ courseId });
    if (existing) {
      return res.status(400).json({ message: 'Course already downloaded' });
    }

    const download = new Download({
      courseId,
      title
    });
    
    const newDownload = await download.save();
    res.status(201).json(newDownload);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
