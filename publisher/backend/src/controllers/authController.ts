import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { Developer, DeveloperRole } from '../models/Developer';

interface AuthRequest extends Request {
  user?: Developer;
}

export class AuthController {
  private developerRepository = AppDataSource.getRepository(Developer);

  register = async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, role = DeveloperRole.DEVELOPER } = req.body;

      const existingDeveloper = await this.developerRepository.findOne({ where: { email } });
      if (existingDeveloper) {
        return res.status(409).json({ message: 'Developer already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const developer = this.developerRepository.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role
      });

      await this.developerRepository.save(developer);

      const accessToken = this.generateAccessToken(developer.id);
      const refreshToken = this.generateRefreshToken(developer.id);

      const { password: _, ...developerWithoutPassword } = developer;

      res.status(201).json({
        message: 'Developer created successfully',
        developer: developerWithoutPassword,
        accessToken,
        refreshToken
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const developer = await this.developerRepository.findOne({ where: { email, isActive: true } });
      if (!developer) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, developer.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      developer.lastLoginAt = new Date();
      await this.developerRepository.save(developer);

      const accessToken = this.generateAccessToken(developer.id);
      const refreshToken = this.generateRefreshToken(developer.id);

      const { password: _, ...developerWithoutPassword } = developer;

      res.json({
        message: 'Login successful',
        developer: developerWithoutPassword,
        accessToken,
        refreshToken
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  refreshToken = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token required' });
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { developerId: string };
      
      const developer = await this.developerRepository.findOne({ where: { id: decoded.developerId, isActive: true } });
      if (!developer) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }

      const accessToken = this.generateAccessToken(developer.id);
      const newRefreshToken = this.generateRefreshToken(developer.id);

      res.json({
        accessToken,
        refreshToken: newRefreshToken
      });
    } catch (error) {
      res.status(401).json({ message: 'Invalid refresh token' });
    }
  };

  getProfile = async (req: AuthRequest, res: Response) => {
    try {
      const { password: _, ...developerWithoutPassword } = req.user!;
      res.json({ developer: developerWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  updateProfile = async (req: AuthRequest, res: Response) => {
    try {
      const { firstName, lastName, bio, website, github, twitter, avatar } = req.body;
      
      const developer = req.user!;
      developer.firstName = firstName || developer.firstName;
      developer.lastName = lastName || developer.lastName;
      developer.bio = bio || developer.bio;
      developer.website = website || developer.website;
      developer.github = github || developer.github;
      developer.twitter = twitter || developer.twitter;
      developer.avatar = avatar || developer.avatar;

      await this.developerRepository.save(developer);

      const { password: _, ...developerWithoutPassword } = developer;
      res.json({
        message: 'Profile updated successfully',
        developer: developerWithoutPassword
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  private generateAccessToken(developerId: string): string {
    return jwt.sign(
      { developerId },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );
  }

  private generateRefreshToken(developerId: string): string {
    return jwt.sign(
      { developerId },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
  }
}

