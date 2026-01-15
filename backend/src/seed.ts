import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import { connectDB } from './config/db.js';

dotenv.config();

const seedData = async () => {
  await connectDB();

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email: 'prueba@gmail.com' });
    
    if (existingUser) {
      console.log('User already exists, updating password...');
      existingUser.password = 'prueba123';
      await existingUser.save();
      console.log('User password updated');
    } else {
      const user = new User({
        email: 'prueba@gmail.com',
        password: 'prueba123'
      });
      await user.save();
      console.log('User created: prueba@gmail.com / prueba123');
    }

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
