import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/talent-hub');
    console.log('📡 Connected to database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@talenhub.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:', existingAdmin.email);
      console.log('🔑 You can login with:');
      console.log('   Email: admin@talenhub.com');
      console.log('   Password: admin123');
      return;
    }

    // Create admin user
    const adminUser = await User.create({
      name: 'Super Admin',
      email: 'admin@talenhub.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('🔑 Admin login credentials:');
    console.log('   Email: admin@talenhub.com');
    console.log('   Password: admin123');
    console.log('   Role: admin');
    console.log('   User ID:', adminUser._id);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from database');
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createAdminUser();
}

export default createAdminUser;
