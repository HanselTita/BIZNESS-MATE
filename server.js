// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import if you're handling CORS
import productionCostsRouter from './routes/productionCosts.js'
import investmentsRouter from './routes/investments.js';       
import salesRouter from './routes/sales.js';                
import expendituresRouter from './routes/expenditures.js';   
import additionalProfitsRouter from './routes/additionalProfits.js'; 
import reportsRouter from './routes/reports.js';    
import authRouter from './routes/authRoutes.js';         

const app = express();
dotenv.config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS if needed
app.use(express.json()); // Parse JSON request bodies

// Mount the API routers
app.use('/api', productionCostsRouter);
app.use('/api', investmentsRouter);
app.use('/api', salesRouter);
app.use('/api', expendituresRouter);
app.use('/api', additionalProfitsRouter);
app.use('/api', reportsRouter);
app.use('/api', authRouter);

app.get('/', (req, res) => {
  res.send('Bizness Mate API is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// This is a simple Node.js server setup using Express and dotenv for environment variables.
// It connects to a PostgreSQL database using the pg library and exports a connection pool.
// require('dotenv').config() reads your .env file and loads the key-value pairs defined within it into the process.env object in your Node.js environment.
// After this line, you can access the value of DATABASE_URL (and any other variables defined in your .env file) using process.env.DATABASE_URL.