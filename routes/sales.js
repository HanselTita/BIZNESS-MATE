// routes/sales.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

const validateSale = [
  body('item_sold').notEmpty().withMessage('Item sold is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('unit_price').isNumeric().withMessage('Unit price must be a number'),
  body('sale_date').isISO8601().withMessage('Sale date must be in ISO 8601 format (YYYY-MM-DD)'),
  body('customer_info').notEmpty().withMessage('Customer information is required'),
];

router.post('/sales', authenticateToken, validateSale, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { item_sold, quantity, unit_price, sale_date, customer_info } = req.body;
    const user_id = req.user.userId;

    // Calculate the total amount
    const amount = quantity * unit_price;

    const newSale = await pool.query(
      'INSERT INTO sales (user_id, item_sold, quantity, unit_price, sale_date, customer_info, amount) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [user_id, item_sold, quantity, unit_price, sale_date, customer_info, amount]
    );

    res.status(201).json(newSale.rows[0]);
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({ message: 'Failed to create sale' });
  }
});

router.get('/sales', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.userId;

    const allSales = await pool.query(
      'SELECT * FROM sales WHERE user_id = $1',
      [user_id]
    );

    res.status(200).json(allSales.rows);
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ message: 'Failed to fetch sales' });
  }
});

export default router;