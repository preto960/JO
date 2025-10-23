import { Request, Response, NextFunction } from 'express';
import config from '@/config';

export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  const expectedApiKey = config.apiKey || process.env.API_KEY;

  // Skip validation in development if no API key is set
  if (process.env.NODE_ENV === 'development' && !expectedApiKey) {
    return next();
  }

  if (!apiKey || apiKey !== expectedApiKey) {
    return res.status(401).json({ 
      error: 'Invalid or missing API key' 
    });
  }

  next();
};