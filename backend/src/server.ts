import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';
import logger from './utils/logger';

// Create Express app
const app: Express = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'SecondBrain API is running',
    timestamp: new Date().toISOString(),
  });
});

// NOTE: API route mounts are added by subsequent patches:
//   PATCH-10  → app.use('/api/auth',        authRoutes)
//   PATCH-18  → app.use('/api/sources',     protect, sourceRoutes)
//   PATCH-41  → app.use('/api/concepts',    protect, conceptRoutes)
//   PATCH-56  → app.use('/api/decay',       protect, decayRoutes)
//   PATCH-60  → app.use('/api/suggestions', protect, suggestionRoutes)
//   PATCH-64  → app.use('/api/challenges',  protect, challengeRoutes)
//   PATCH-68  → Swagger UI mount
