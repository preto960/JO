import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { Developer } from '../models/Developer';

export interface AuthRequest extends Request {
  user?: Developer;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { developerId: string };
    
    const developerRepository = AppDataSource.getRepository(Developer);
    const developer = await developerRepository.findOne({
      where: { id: decoded.developerId, isActive: true }
    });

    if (!developer) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = developer;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

