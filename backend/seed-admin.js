const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codebridge';
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@codebridge.com' });
    if (adminExists) {
      console.log('Admin already exists. You can log in with: admin@codebridge.com');
      process.exit();
    }

    // Create admin user
    const user = new User({
      name: 'Admin User',
      email: 'admin@codebridge.com',
      password: 'password123',
      role: 'admin',
    });

    await user.save();
    console.log('Admin created successfully!');
    console.log('Login Email: admin@codebridge.com');
    console.log('Password: password123');

    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
