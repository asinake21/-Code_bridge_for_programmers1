const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');          // ← Only once here
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// ================== PRODUCTION CORS CONFIGURATION ==================
const allowedOrigins = [
  process.env.FRONTEND_URL, // Your Vercel URL (set in Render environment variables)
  'http://localhost:5173',  // Vite local development
  'http://localhost:3000'   // Alternative local port
].filter(Boolean); // Remove undefined/null if variable is missing

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowedOrigins or is a Vercel preview URL
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith('.vercel.app');

    if (isAllowed) {
      callback(null, true);
    } else {
      console.error(`CORS Error: Origin ${origin} not allowed`);
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

// MongoDB Connection (Strict - fails fast for visibility)
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ CRITICAL: MONGODB_URI environment variable is missing on Render!');
  process.exit(1);
}

mongoose.set('bufferCommands', false); // Disable query buffering (no more 10s hangs)

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'CodeBridge', // Explicitly targeting a specific database
      serverSelectionTimeoutMS: 5000, 
    });
    console.log('✅ MongoDB connected successfully: Connected to CodeBridge database');
  } catch (err) {
    console.error('❌ FATAL: MongoDB connection failed!');
    console.error(`Reason: ${err.message}`);
    // EXPLAIN: Exiting forces Render to show the error in the 'Deploy' logs immediately.
    process.exit(1);
  }
};

connectDB();

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