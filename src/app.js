import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import { connectRedis } from './config/redis.js';
import urlRoutes from './routes/urlRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware (adds secure HTTP headers)
app.use(helmet());

// Rate Limiting (Secure against DDoS/Spam)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per 15 mins
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api', limiter); // Apply only to API routes

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
