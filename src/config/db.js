import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/url-shortener', {
      serverSelectionTimeoutMS: 5000 // Fail after 5 seconds instead of hanging Serverless
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // process.exit(1); // Removed to prevent serverless crash
  }
};

export default connectDB;
