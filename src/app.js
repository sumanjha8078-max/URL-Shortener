import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { connectRedis } from './config/redis.js';
import urlRoutes from './routes/urlRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('src/public'));

// Routes
app.use('/', urlRoutes);

// Initialize DB and Cache, then start server
const startServer = async () => {
  await connectDB();
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
