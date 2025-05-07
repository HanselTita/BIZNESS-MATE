import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables if your secret key is there

const jwtSecret = process.env.JWT_SECRET || 'your-secret-key'; // Replace with your actual secret key

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden (invalid token)
    }
    req.user = user; // Attach user information to the request
    next(); // Proceed to the next middleware or route handler
  });
};