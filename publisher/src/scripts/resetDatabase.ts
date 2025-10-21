import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { PublisherDataSource } from '../config/database';
import { PublisherUser, PublisherPlugin, PublisherSession, PublisherAnalytics } from '../entities';

// Load environment variables
dotenv.config();

const resetPublisherDatabase = async () => {
  try {
    console.log('🔄 Connecting to publisher database...');
    await PublisherDataSource.initialize();
    
    console.log('⚠️  WARNING: This will drop all publisher tables and recreate them!');
    console.log('📋 Publisher tables to be dropped:');
    console.log('   - publisher_users');
    console.log('   - publisher_plugins');
    console.log('   - publisher_sessions');
    console.log('   - publisher_analytics');
    
    // Drop all tables
    console.log('\n🗑️  Dropping all publisher tables...');
    await PublisherDataSource.dropDatabase();
    
    // Synchronize schema (create all tables)
    console.log('🏗️  Creating publisher tables from entities...');
    await PublisherDataSource.synchronize(true);
    
    console.log('\n✅ Publisher database reset completed successfully!');
    console.log('📊 New publisher tables created:');
    
    // List all tables
    const tableNames = ['publisher_users', 'publisher_plugins', 'publisher_sessions', 'publisher_analytics'];
    tableNames.forEach(table => {
      console.log(`   ✅ ${table}`);
    });
    
    console.log('\n🎯 Publisher database is ready for use!');
    
  } catch (error) {
    console.error('❌ Error resetting publisher database:', error);
    process.exit(1);
  } finally {
    if (PublisherDataSource.isInitialized) {
      await PublisherDataSource.destroy();
    }
  }
};

// Run if called directly
if (require.main === module) {
  resetPublisherDatabase();
}

export default resetPublisherDatabase;