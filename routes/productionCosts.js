import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../db.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Validation middleware for creating production costs
const validateProductionCost = [
  body('product_name').notEmpty().withMessage('Product name is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'), // Assuming quantity should be at least 1
  body('cost_price').isNumeric().withMessage('Cost price must be a number'),
  body('selling_price').isNumeric().withMessage('Selling price must be a number'),
  body('recorded_at').isISO8601().withMessage('Recorded at must be a valid ISO 8601 date'),
];

// Route to create a new production cost record
router.post('/production-costs', authenticateToken, validateProductionCost, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { product_name, quantity, cost_price, selling_price, recorded_at } = req.body;
    const user_id = req.user.userId;

    const newCost = await pool.query(
      'INSERT INTO production_costs (user_id, product_name, quantity, cost_price, selling_price, recorded_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [user_id, product_name, quantity, cost_price, selling_price, recorded_at]
    );

    res.status(201).json(newCost.rows[0]);
  } catch (error) {
    console.error('Error creating production cost:', error);
    res.status(500).json({ message: 'Failed to create production cost' });
  }
});
// Route to get all production cost records for the authenticated user
router.get('/production-costs', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.userId;

    const allCosts = await pool.query(
      'SELECT * FROM production_costs WHERE user_id = $1',
      [user_id]
    );

    res.status(200).json(allCosts.rows);
  } catch (error) {
    console.error('Error fetching production costs:', error);
    res.status(500).json({ message: 'Failed to fetch production costs' });
  }
});

export default router;