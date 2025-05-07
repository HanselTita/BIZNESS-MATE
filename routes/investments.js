import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

const validateInvestment = [
  body('description').notEmpty().withMessage('Description is required'),
  body('capital').isNumeric().withMessage('Capital must be a number'),
  body('date').isISO8601().withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)'),
];

router.post('/investments', authenticateToken, validateInvestment, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { description, capital, date } = req.body;
    const user_id = req.user.userId;

    const newInvestment = await pool.query(
      'INSERT INTO investments (user_id, description, capital, date) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, description, capital, date]
    );

    res.status(201).json(newInvestment.rows[0]);
  } catch (error) {
    console.error('Error creating investment:', error);
    res.status(500).json({ message: 'Failed to create investment' });
  }
});

router.get('/investments', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.userId;

    const allInvestments = await pool.query(
      'SELECT * FROM investments WHERE user_id = $1',
      [user_id]
    );

    res.status(200).json(allInvestments.rows);
  } catch (error) {
    console.error('Error fetching investments:', error);
    res.status(500).json({ message: 'Failed to fetch investments' });
  }
});

export default router;