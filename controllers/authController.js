import { hash } from 'bcrypt';
import { query } from '../db'; // Import your database connection

exports.signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // 1. Check if the username or email already exists
    const existingUser = await query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Username or email already exists' }); // 409 Conflict
    }

    // 2. Hash the password
    const hashedPassword = await hash(password, 10); // 10 is the salt rounds

    // 3. Insert the new user into the database
    const newUser = await query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING user_id, username, email',
      [username, hashedPassword, email]
    );

    // 4. Respond with the newly created user (without the password)
    res.status(201).json({ message: 'User created successfully', user: newUser.rows[0] }); // 201 Created
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Failed to create user' }); // 500 Internal Server Error
  }
}

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Find the user by username
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' }); // 401 Unauthorized
    }

    // 2. Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' }); // 401 Unauthorized
    }

    // 3. Generate a JWT (JSON Web Token)
    const token = jwt.sign(
      { userId: user.user_id }, // Payload (data to include in the token)
      process.env.JWT_SECRET || 'your-secret-key', // Secret key to sign the token (store in .env)
      { expiresIn: '1h' } // Token expiration time
    );

    // 4. Respond with the token and user information (without password)
    res.status(200).json({ message: 'Login successful', token, user: { user_id: user.user_id, username: user.username, email: user.email } }); // 200 OK
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Failed to login' }); // 500 Internal Server Error
  }
};