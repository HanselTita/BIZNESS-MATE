import express, { json } from 'express';
import cors from 'cors';
import authRoutes from './route/authRoutes.js'; // Import your auth routes
import pool from './db.js'; // Import your database connection
import dotenv from 'dotenv';

// ... rest of your imports // Load environment variables

const app = express();
dotenv.config();

app.use(cors());
app.use(json()); // Middleware to parse JSON request bodies

app.use('/api', authRoutes); // Mount the auth routes under the /api path

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// This is a simple Node.js server setup using Express and dotenv for environment variables.
// It connects to a PostgreSQL database using the pg library and exports a connection pool.
// require('dotenv').config() reads your .env file and loads the key-value pairs defined within it into the process.env object in your Node.js environment.
// After this line, you can access the value of DATABASE_URL (and any other variables defined in your .env file) using process.env.DATABASE_URL.