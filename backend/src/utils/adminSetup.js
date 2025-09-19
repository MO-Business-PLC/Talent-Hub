import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const createInitialAdmin = async () => {
  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) return;

  await User.create({
    name: process.env.ADMIN_NAME || "admin",
    email: process.env.ADMIN_EMAIL || "admin@talenhub.com",
    password: process.env.ADMIN_PASSWORD || "admin123",
    role: "admin",
  });

  console.log("Initial admin account created!");
};

export default createInitialAdmin;
