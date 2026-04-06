const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// 🧠 AI Chat Route (Supports optional file upload)
router.post('/chat', upload.single('file'), aiController.askAI);

module.exports = router;