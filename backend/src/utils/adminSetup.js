import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const createInitialAdmin = async () => {
  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) return;
   

  await User.create({
    name: process.env.ADMIN_NAME ,
    email: process.env.ADMIN_EMAIL ,
    password:process.env.ADMIN_PASSWORD ,
    role: 'admin'
  });

  console.log('Initial admin account created!');
};

export default createInitialAdmin;
