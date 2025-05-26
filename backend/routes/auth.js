import express from 'express';
import { body } from 'express-validator';
import { register, login, updateUser, setPassword, deleteOwnAccount } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { googleAuth } from '../controllers/googleAuthController.js';
import { digitalIdAuth } from '../controllers/digitalIdAuthController.js';

const router = express.Router();

router.post('/register', [
  body('full_name').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('nationality').optional().isString()
], register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], login);

router.post('/auth/google', googleAuth);

router.post('/auth/did', digitalIdAuth);

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Access granted. Hello, ${req.user.full_name}!`, user: req.user });
});

router.put('/user', authenticateToken, [
  body('full_name').optional().notEmpty(),
  body('email').optional().isEmail(),
  body('nationality').optional().isString(),
  body('old_password')
    .if(body('old_password').exists().notEmpty())
    .isLength({ min: 6 }).withMessage('Old password must be at least 6 characters'),
  body('password')
    .if(body('password').exists().notEmpty())
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  body('confirm_new_password')
    .if(body('confirm_new_password').exists().notEmpty())
    .isLength({ min: 6 }).withMessage('Confirm password must be at least 6 characters'),
], updateUser);

router.post('/set-password', authenticateToken, [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirm_password').custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('Passwords do not match');
      return true;
    })
], setPassword);

router.delete('/user', authenticateToken, deleteOwnAccount);

export default router;