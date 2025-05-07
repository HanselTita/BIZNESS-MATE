import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

const validateAdditionalProfit = [
  body('source').notEmpty().withMessage('Source of profit is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('date').isISO8601().withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)'),
  body('notes').optional(), // Notes are optional
];

router.post('/additional-profits', authenticateToken, validateAdditionalProfit, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { source, amount, date, notes } = req.body;
    const user_id = req.user.userId;

    const newProfit = await pool.query(
      'INSERT INTO additional_profits (user_id, source, amount, date, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, source, amount, date, notes]
    );

    res.status(201).json(newProfit.rows[0]);
  } catch (error) {
    console.error('Error creating additional profit:', error);
    res.status(500).json({ message: 'Failed to create additional profit' });
  }
});

router.get('/additional-profits', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.userId;

    const allProfits = await pool.query(
      'SELECT * FROM additional_profits WHERE user_id = $1',
      [user_id]
    );

    res.status(200).json(allProfits.rows);
  } catch (error) {
    console.error('Error fetching additional profits:', error);
    res.status(500).json({ message: 'Failed to fetch additional profits' });
  }
});

export default router;