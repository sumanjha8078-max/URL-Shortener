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

// Initialize DB and Cache on cold start
connectDB();
connectRedis();

// Export for Vercel Serverless
export default app;

// Only listen locally if not running in Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
