import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { connectRedis } from './config/redis.js';
import urlRoutes from './routes/urlRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Lazy Initialization for Serverless (Vercel) MUST be before routes
let isInitialized = false;
app.use(async (req, res, next) => {
  if (!isInitialized) {
    await connectDB();
    await connectRedis();
    isInitialized = true;
  }
  next();
});

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/', urlRoutes);

// Export for Vercel Serverless
export default app;

// Only listen locally if not running in Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
