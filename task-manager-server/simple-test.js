const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'taskmate',
    user: process.env.DB_USER || 'taskmate_user',
    password: process.env.DB_PASSWORD || 'taskmate_password',
  });

  try {
    console.log('Connecting to database...');
    console.log('Config:', {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'taskmate',
      user: process.env.DB_USER || 'taskmate_user',
      password: process.env.DB_PASSWORD ? '***' : 'undefined'
    });
    
    await client.connect();
    console.log('Connected successfully!');
    
    const result = await client.query('SELECT NOW()');
    console.log('Current time:', result.rows[0]);
    
    await client.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Connection failed:', error.message);
  }
}

testConnection(); 