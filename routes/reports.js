import express from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/reports', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.userId;
    const { start_date, end_date } = req.query;

    let queryParams = [user_id];
    let whereClause = 'WHERE user_id = $1';
    let paramIndex = 2;

    if (start_date) {
      whereClause += ` AND date >= $${paramIndex++}`;
      queryParams.push(start_date);
    }

    if (end_date) {
      whereClause += ` AND date <= $${paramIndex++}`;
      queryParams.push(end_date);
    }

    // Fetch data from different tables
    const productionCosts = await pool.query(`SELECT * FROM production_costs ${whereClause}`, queryParams);
    const investments = await pool.query(`SELECT * FROM investments ${whereClause}`, queryParams);
    const sales = await pool.query(`SELECT * FROM sales WHERE user_id = $1 ${start_date ? `AND sale_date >= $2` : ''} ${end_date ? `AND sale_date <= $${start_date ? 3 : 2}` : ''}`, queryParams);
    const expenditures = await pool.query(`SELECT * FROM expenditures ${whereClause}`, queryParams);
    const additionalProfits = await pool.query(`SELECT * FROM additional_profits ${whereClause}`, queryParams);

    // Process and aggregate the data to generate the report
    const reportData = {
      report_period: { start_date, end_date },
      production_costs: productionCosts.rows,
      investments: investments.rows,
      sales: sales.rows,
      expenditures: expenditures.rows,
      additional_profits: additionalProfits.rows,
      // Add calculations and summaries as needed
    };

    res.status(200).json(reportData);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Failed to generate report' });
  }
});

export default router;