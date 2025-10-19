import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { get } from '../database';

const JWT_SECRET = process.env.JWT_SECRET || 'publisher-secret-key';

export interface AuthRequest extends Request {
  publisher?: {
    id: string;
    email: string;
    name: string;
  };
}

export async function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ success: false, message: 'Access token required' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const publisher = await get('SELECT id, email, name FROM publishers WHERE id = ?', [decoded.id]);

    if (!publisher) {
      res.status(401).json({ success: false, message: 'Invalid token' });
      return;
    }

    req.publisher = publisher;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid token' });
  }
}

export function generateToken(publisher: { id: string; email: string; name: string }): string {
  return jwt.sign(publisher, JWT_SECRET, { expiresIn: '24h' });
}