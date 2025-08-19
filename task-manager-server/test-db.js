const { sequelize, User, Task, Project, Event } = require('./models');
require('dotenv').config();

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('Database connection successful');
    
    // Check if tables exist
    const tables = await sequelize.showAllSchemas();
    console.log('Available schemas:', tables);
    
    // Force sync tables
    console.log('Creating tables...');
    await sequelize.sync({ force: true });
    console.log('Tables created successfully');
    
    // Check tables again
    const tableNames = await sequelize.getQueryInterface().showAllTables();
    console.log('Tables in database:', tableNames);
    
    // Test creating a user
    console.log('Testing user creation...');
    const testUser = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('User created:', testUser.toJSON());
    
    // Test finding the user
    const foundUser = await User.findByPk(testUser.id);
    console.log('User found:', foundUser.toJSON());
    
    console.log('Database test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Database test failed:', error);
    process.exit(1);
  }
}

testDatabase(); 