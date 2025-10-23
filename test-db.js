const { Client } = require('pg');

async function testDatabase() {
  const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_hnVE2jqZSHx7@ep-patient-pond-adixypv6-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require'
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Check if plugins table exists
    const result = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'plugins'
    `);
    
    if (result.rows.length === 0) {
      console.log('❌ Plugins table does not exist');
      return;
    }
    
    console.log('✅ Plugins table exists');
    
    // Check plugins count
    const countResult = await client.query('SELECT COUNT(*) as count FROM plugins');
    console.log(`📦 Plugins count: ${countResult.rows[0].count}`);
    
    // Check plugins data
    const pluginsResult = await client.query('SELECT id, title, author_id, status FROM plugins LIMIT 5');
    console.log('📋 Plugins:');
    pluginsResult.rows.forEach((plugin, index) => {
      console.log(`  ${index + 1}. ID: ${plugin.id}, Title: ${plugin.title}, Author: ${plugin.author_id}, Status: ${plugin.status}`);
    });
    
    // Check users table
    const usersResult = await client.query('SELECT id, username FROM users LIMIT 5');
    console.log('👥 Users:');
    usersResult.rows.forEach((user, index) => {
      console.log(`  ${index + 1}. ID: ${user.id}, Username: ${user.username}`);
    });
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
  } finally {
    await client.end();
  }
}

testDatabase();