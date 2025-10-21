import { Request, Response } from 'express';
import { AppDataSource } from '@/config/database';
import { User } from '@/entities';
import { AuthUtils } from '@/utils/auth';
import { asyncHandler } from '@/middleware/errorHandler';
import { registerValidation, loginValidation, validateRequest } from '@/middleware/validation';
import { AuthenticatedRequest } from '@/middleware/auth';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);

  const { email, username, password, role = 'USER' } = req.body;

  // Check if user already exists
  const existingUser = await userRepository.findOne({
    where: [{ email }, { username }]
  });

  if (existingUser) {
    return res.status(400).json({
      error: existingUser.email === email ? 'Email already registered' : 'Username already taken'
    });
  }

  // Hash password
  const hashedPassword = await AuthUtils.hashPassword(password);

  // Create new user
  const user = userRepository.create({
    email,
    username,
    password: hashedPassword,
    role
  });

  await userRepository.save(user);

  // Generate token
  const token = AuthUtils.generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  // Remove password from response
  const { password: _, ...userResponse } = user;

  res.status(201).json({
    message: 'User registered successfully',
    user: userResponse,
    token
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);

  const { email, password } = req.body;

  // Find user
  const user = await userRepository.findOne({
    where: { email, isActive: true }
  });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Verify password
  const isValidPassword = await AuthUtils.comparePassword(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Update last login
  user.lastLoginAt = new Date();
  await userRepository.save(user);

  // Generate token
  const token = AuthUtils.generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  // Remove password from response
  const { password: _, ...userResponse } = user;

  res.json({
    message: 'Login successful',
    user: userResponse,
    token
  });
});

export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { password: _, ...userResponse } = req.user!;
  res.json({ user: userResponse });
});

export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);
  const userId = req.user!.id;

  const { username, bio, website, github, paypalEmail } = req.body;

  // Check if username is being changed and if it's already taken
  if (username && username !== req.user!.username) {
    const existingUser = await userRepository.findOne({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }
  }

  // Update user
  await userRepository.update(userId, {
    username: username || req.user!.username,
    bio,
    website,
    github,
    paypalEmail
  });

  const updatedUser = await userRepository.findOne({ where: { id: userId } });
  const { password: _, ...userResponse } = updatedUser!;

  res.json({
    message: 'Profile updated successfully',
    user: userResponse
  });
});

export const logout = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // In a real implementation, you might want to invalidate the token
  // For now, we'll just return a success message
  res.json({ message: 'Logout successful' });
});