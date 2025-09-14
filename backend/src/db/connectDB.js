// connectDB.js
const mongoose = require("mongoose");
const dbConfig = require("../config/database.config");

const connectDB = async () => {
  try {
    if (!dbConfig.uri) {
      throw new Error(`MongoDB URI is missing for ${process.env.NODE_ENV} environment`);
    }

    const conn = await mongoose.connect(dbConfig.uri, dbConfig.options);

    if (process.env.NODE_ENV !== "production") {
      console.log(`MongoDB connected: ${conn.connection.host}`);
    }
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
