const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

const seedNewAdmins = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codebridge';
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    const admins = [
      { name: 'Asinake Hailei', email: 'asinake@codebridge.com', password: '1234', role: 'admin' },
      { name: 'Belayneh Shiferaw', email: 'belayneh@codebridge.com', password: '1235', role: 'admin' },
      { name: 'Fasika Yayeh', email: 'fasika@codebridge.com', password: '1236', role: 'admin' }
    ];

    for (const adminData of admins) {
      const exists = await User.findOne({ email: adminData.email });
      if (exists) {
        console.log(`Admin ${adminData.name} already exists.`);
        continue;
      }
      const admin = new User(adminData);
      await admin.save();
      console.log(`Admin created: ${adminData.name} (${adminData.email})`);
    }

    console.log('Seeding complete.');
    process.exit();
  } catch (error) {
    console.error('Error seeding admins:', error);
    process.exit(1);
  }
};

seedNewAdmins();
