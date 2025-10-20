import { AppDataSource } from '@/config/database';
import { User } from '@/entities';
import { AuthUtils } from '@/utils/auth';

export const createDefaultAdmin = async () => {
  const userRepository = AppDataSource.getRepository(User);
  
  const existingAdmin = await userRepository.findOne({
    where: { email: 'admin@pluginmarketplace.com' }
  });

  if (!existingAdmin) {
    const hashedPassword = await AuthUtils.hashPassword('admin123');
    
    const admin = userRepository.create({
      email: 'admin@pluginmarketplace.com',
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN'
    });

    await userRepository.save(admin);
    console.log('✅ Default admin user created');
  }
};

export const createSampleData = async () => {
  // Create sample users, plugins, etc.
  console.log('📝 Creating sample data...');
};