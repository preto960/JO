import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PublisherDataSource } from '@/config/database';
import { PublisherUser } from '@/entities';

interface AuthRequest extends Request {
  user?: PublisherUser;
}

export const authenticatePublisher = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
    const userRepository = PublisherDataSource.getRepository(PublisherUser);
    const user = await userRepository.findOne({ 
      where: { id: decoded.userId, isActive: true } 
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

export const requirePublisherRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Access denied.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions.' });
    }

    next();
  };
};