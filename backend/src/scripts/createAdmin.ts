import axios from 'axios';

const createAdminUser = async () => {
  try {
    console.log('🔧 Creating admin user for Backend...');
    
    const userData = {
      email: 'admin@backend.com',
      username: 'admin',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN'
    };
    
    const response = await axios.post('http://localhost:3000/api/auth/register', userData);
    
    console.log('✅ Backend admin user created successfully!');
    console.log('📋 User details:', {
      id: response.data.user.id,
      email: response.data.user.email,
      username: response.data.user.username,
      role: response.data.user.role
    });
    console.log('🔑 Token:', response.data.token);
    
  } catch (error: any) {
    if (error.response?.status === 400 && error.response?.data?.error?.includes('already')) {
      console.log('ℹ️  Backend admin user already exists');
    } else {
      console.error('❌ Error creating backend admin user:', error.response?.data || error.message);
    }
  }
};

// Run if called directly
if (require.main === module) {
  createAdminUser();
}

export default createAdminUser;