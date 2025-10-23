import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';

const createAdminUser = async () => {
  try {
    console.log('🔧 Creating admin user for Backend...');
    
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    const userRepository = AppDataSource.getRepository(User);
    
    // Check if admin user already exists
    const existingAdmin = await userRepository.findOne({ 
      where: { email: 'admin@backend.com' } 
    });
    
    if (existingAdmin) {
      console.log('ℹ️  Backend admin user already exists');
      return;
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = userRepository.create({
      email: 'admin@backend.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
      isEmailVerified: true
    });
    
    const savedUser = await userRepository.save(adminUser);
    
    console.log('✅ Backend admin user created successfully!');
    console.log('📋 User details:', {
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
      role: savedUser.role
    });
    
    // Close database connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    
  } catch (error: any) {
    console.error('❌ Error creating backend admin user:', error.message);
    // Ensure database connection is closed on error
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
};

// Run if called directly
if (require.main === module) {
  createAdminUser();
}

export default createAdminUser;