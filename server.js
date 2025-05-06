
require('dotenv').config();

// Now you can access your environment variables using process.env
const databaseUrl = process.env.DATABASE_URL;
console.log('Database URL:', databaseUrl); // For verification (remove in production)





// This is a simple Node.js server setup using Express and dotenv for environment variables.
// It connects to a PostgreSQL database using the pg library and exports a connection pool.
// require('dotenv').config() reads your .env file and loads the key-value pairs defined within it into the process.env object in your Node.js environment.
// After this line, you can access the value of DATABASE_URL (and any other variables defined in your .env file) using process.env.DATABASE_URL.