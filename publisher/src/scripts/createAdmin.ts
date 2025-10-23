import { AppDataSource } from '../data-source';
import { PublisherUser } from '../entities/PublisherUser';
import bcrypt from 'bcrypt';

const createPublisherAdmin = async () => {
  try {
    console.log('🔧 Creating admin user for Publisher...');
    
    // Initialize database connection
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    const userRepository = AppDataSource.getRepository(PublisherUser);
    
    // Check if admin user already exists
    const existingAdmin = await userRepository.findOne({ 
      where: { email: 'admin@publisher.com' } 
    });
    
    if (existingAdmin) {
      console.log('ℹ️  Publisher admin user already exists');
      return;
    }
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = userRepository.create({
      email: 'admin@publisher.com',
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
      isEmailVerified: true
    });
    
    const savedUser = await userRepository.save(adminUser);
    
    console.log('✅ Publisher admin user created successfully!');
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
    console.error('❌ Error creating publisher admin user:', error.message);
    // Ensure database connection is closed on error
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
};

// Run if called directly
if (require.main === module) {
  createPublisherAdmin();
}

export default createPublisherAdmin;