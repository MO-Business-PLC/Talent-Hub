// Database configuration
// This file will be used to configure database connections
// Currently set up for future database integration

const config = {
  development: {
    // Add your development database configuration here
    // Example for PostgreSQL:
    // host: process.env.DB_HOST || 'localhost',
    // port: process.env.DB_PORT || 5432,
    // database: process.env.DB_NAME || 'talent_hub_dev',
    // username: process.env.DB_USER || 'postgres',
    // password: process.env.DB_PASSWORD || 'password'
  },
  production: {
    // Add your production database configuration here
  },
  test: {
    // Add your test database configuration here
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
