import axios from 'axios';

const createPublisherAdmin = async () => {
  try {
    console.log('🔧 Creating admin user for Publisher...');
    
    const userData = {
      email: 'admin@publisher.com',
      username: 'admin',
      password: 'admin123',
      role: 'ADMIN'
    };
    
    const response = await axios.post('http://localhost:3004/api/auth/register', userData);
    
    console.log('✅ Publisher admin user created successfully!');
    console.log('📋 User details:', {
      id: response.data.user.id,
      email: response.data.user.email,
      username: response.data.user.username,
      role: response.data.user.role
    });
    console.log('🔑 Token:', response.data.token);
    
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.error?.includes('already')) {
      console.log('ℹ️  Publisher admin user already exists');
    } else {
      console.error('❌ Error creating publisher admin user:', error.response?.data || error.message);
    }
  }
};

// Run if called directly
if (require.main === module) {
  createPublisherAdmin();
}

export default createPublisherAdmin;