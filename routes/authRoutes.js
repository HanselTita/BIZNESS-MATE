import express from 'express';
const router = express.Router();
import { signup, login } from '../controllers/authController.js'; // Import named exports

router.post('/signup', signup);
router.post('/login', login);

export default router;


