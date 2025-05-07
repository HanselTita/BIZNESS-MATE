import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

const validateExpenditure = [
  body('description').notEmpty().withMessage('Description is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('date').isISO8601().withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)'),
  body('category').notEmpty().withMessage('Category is required'),
];

router.post('/expenditures', authenticateToken, validateExpenditure, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { description, amount, date, category } = req.body;
    const user_id = req.user.userId;

    const newExpenditure = await pool.query(
      'INSERT INTO expenditures (user_id, description, amount, date, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, description, amount, date, category]
    );

    res.status(201).json(newExpenditure.rows[0]);
  } catch (error) {
    console.error('Error creating expenditure:', error);
    res.status(500).json({ message: 'Failed to create expenditure' });
  }
});

router.get('/expenditures', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.userId;

    const allExpenditures = await pool.query(
      'SELECT * FROM expenditures WHERE user_id = $1',
      [user_id]
    );

    res.status(200).json(allExpenditures.rows);
  } catch (error) {
    console.error('Error fetching expenditures:', error);
    res.status(500).json({ message: 'Failed to fetch expenditures' });
  }
});

export default router;