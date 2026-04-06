const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');          // ← Only once here
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// ================== CORS CONFIGURATION FOR VERCEL ==================
const allowedOrigins = [
  'https://code-bridge-for-programmers1-5aqmne7tl-asinakes-projects.vercel.app',  // Your live Vercel URL
  'http://localhost:5173',     // Vite local development (most common)
  'http://localhost:3000'      // Alternative local port
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
// =================================================================

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection (Improved - fails fast if URI missing)
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is missing on Render!');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/lessons', require('./routes/lessonRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/downloads', require('./routes/downloadRoutes'));
app.use('/api/conversations', require('./routes/conversationRoutes'));

// Code Runner route
app.post('/run', async (req, res) => {
  const { code } = req.body;
  try {
    const result = eval(code);
    res.json({ output: String(result) });
  } catch (err) {
    res.json({ output: err.message });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Code Bridge API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});