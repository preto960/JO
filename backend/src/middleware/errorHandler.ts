import { Request, Response, NextFunction } from 'express';
import config from '@/config';

export interface ValidationError {
  field: string;
  message: string;
}

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      ...(config.nodeEnv === 'development' && { stack: error.stack })
    });
  }

  // TypeORM validation errors
  if (error.name === 'QueryFailedError') {
    return res.status(400).json({
      error: 'Database operation failed',
      ...(config.nodeEnv === 'development' && { details: error.message })
    });
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' });
  }

  // Default error
  res.status(500).json({
    error: 'Internal server error',
    ...(config.nodeEnv === 'development' && { message: error.message })
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};