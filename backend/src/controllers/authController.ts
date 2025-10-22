import { Request, Response } from 'express';
import { AppDataSource } from '@/config/database';
import { User, Profile } from '@/entities';
import { AuthUtils } from '@/utils/auth';
import { asyncHandler } from '@/middleware/errorHandler';
import { registerValidation, loginValidation, validateRequest } from '@/middleware/validation';
import { AuthenticatedRequest } from '@/middleware/auth';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);
  const profileRepository = AppDataSource.getRepository(Profile);

  const { email, username, password, firstName, lastName, role = 'USER' } = req.body;

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

  // Create profile for the user
  const profile = profileRepository.create({
    firstName,
    lastName,
    user
  });

  await profileRepository.save(profile);

  // Load user with profile
  const userWithProfile = await userRepository.findOne({
    where: { id: user.id },
    relations: ['profile']
  });

  // Generate token
  const token = AuthUtils.generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  // Remove password from response
  const { password: _, ...userResponse } = userWithProfile!;

  res.status(201).json({
    message: 'User registered successfully',
    user: userResponse,
    token
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);

  const { login: loginField, password } = req.body;

  // Find user by email or username
  const user = await userRepository.findOne({
    where: [
      { email: loginField, isActive: true },
      { username: loginField, isActive: true }
    ],
    relations: ['profile']
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
  const userRepository = AppDataSource.getRepository(User);
  
  const user = await userRepository.findOne({
    where: { id: req.user!.id },
    relations: ['profile']
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password: _, ...userResponse } = user;
  res.json({ user: userResponse });
});

export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);
  const profileRepository = AppDataSource.getRepository(Profile);
  const userId = req.user!.id;

  const { username, firstName, lastName, bio, website, github, paypalEmail, phone, location, birthDate, isPublic } = req.body;

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
    username: username || req.user!.username
  });

  // Update or create profile
  let profile = await profileRepository.findOne({
    where: { user: { id: userId } }
  });

  if (!profile) {
    profile = profileRepository.create({
      firstName: firstName || req.user!.email.split('@')[0],
      lastName: lastName || 'User',
      user: { id: userId } as User
    });
  } else {
    if (firstName) profile.firstName = firstName;
    if (lastName) profile.lastName = lastName;
    if (bio !== undefined) profile.bio = bio;
    if (website !== undefined) profile.website = website;
    if (github !== undefined) profile.github = github;
    if (paypalEmail !== undefined) profile.paypalEmail = paypalEmail;
    if (phone !== undefined) profile.phone = phone;
    if (location !== undefined) profile.location = location;
    if (birthDate !== undefined) profile.birthDate = birthDate ? new Date(birthDate) : null;
    if (isPublic !== undefined) profile.isPublic = isPublic;
  }

  await profileRepository.save(profile);

  const updatedUser = await userRepository.findOne({ 
    where: { id: userId },
    relations: ['profile']
  });
  
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