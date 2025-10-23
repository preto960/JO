import { PublisherDataSource } from '../config/database';
import { PublisherUser, PublisherRole } from '../entities/PublisherUser';
import bcrypt from 'bcryptjs';

const createPublisherAdmin = async () => {
  try {
    console.log('🔧 Creating admin user for Publisher...');
    
    // Initialize database connection
    if (!PublisherDataSource.isInitialized) {
      await PublisherDataSource.initialize();
    }
    
    const userRepository = PublisherDataSource.getRepository(PublisherUser);
    
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
    
    const adminUser = new PublisherUser();
    adminUser.email = 'admin@publisher.com';
    adminUser.username = 'admin';
    adminUser.password = hashedPassword;
    adminUser.role = PublisherRole.ADMIN;
    adminUser.isActive = true;
    adminUser.isVerified = true;
    
    const savedUser = await userRepository.save(adminUser);
    
    console.log('✅ Publisher admin user created successfully!');
    console.log('📋 User details:', {
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username,
      role: savedUser.role
    });
    
    // Close database connection
    if (PublisherDataSource.isInitialized) {
      await PublisherDataSource.destroy();
    }
    
  } catch (error: any) {
    console.error('❌ Error creating publisher admin user:', error.message);
    // Ensure database connection is closed on error
    if (PublisherDataSource.isInitialized) {
      await PublisherDataSource.destroy();
    }
  }
};

// Run if called directly
if (require.main === module) {
  createPublisherAdmin();
}

export default createPublisherAdmin;