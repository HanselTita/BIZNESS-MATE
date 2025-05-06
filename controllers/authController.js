import bcrypt from 'bcrypt';
import pool from '../db.js';
import jwt from 'jsonwebtoken'; // Import jsonwebtoken

export const signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING user_id, username, email',
      [username, hashedPassword, email]
    );

    res.status(201).json({ message: 'User created successfully', user: newUser.rows[0] });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Failed to create user' });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token, user: { user_id: user.user_id, username: user.username, email: user.email } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Failed to login' });
  }
};