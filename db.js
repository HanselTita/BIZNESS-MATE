// This file is responsible for connecting to the PostgreSQL database using the pg library.
// It exports a pool of connections that can be used throughout the application.
// It uses environment variables to configure the database connection.

const { Pool } = require('pg');
require('dotenv').config();

// The connection string is typically in the format:postgres://username:password@hostname:port/database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Only set to false if you're sure about your SSL configuration
  }
});

// Test the connection to the database
pool.connect()
  .then(() => console.log('Database connected successfully!'))
  .catch(err => console.error('Error connecting to the database:', err));



module.exports = pool; // This allows you to use the same pool of connections across your application,



// Explanation of the Pool configuration:
// connectionString: process.env.DATABASE_URL: This tells the pg library how to connect to your PostgreSQL database using the URL you defined in your .env file.
// ssl: { rejectUnauthorized: false }: This is important for secure connections.
// In production environments with properly configured SSL certificates, you should typically set rejectUnauthorized: true (or omit the ssl object entirely as it defaults to true).
//  This ensures that the server's SSL certificate is verified.
// However, in some development or testing environments, you might encounter issues with SSL certificate verification.
// Setting rejectUnauthorized: false will bypass this verification. Be cautious when using this in production as it can make your connection vulnerable to man-in-the-middle attacks if not properly secured at the network level. 
// It's best to properly configure your PostgreSQL server's SSL if possible.