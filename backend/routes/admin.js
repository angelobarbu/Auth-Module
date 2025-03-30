import express from 'express';
import { body, param } from 'express-validator';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import {
  getAllUsers,
  createUser,
  updateUserById,
  deleteUserById
} from '../controllers/adminController.js';

const router = express.Router();
const adminOnly = [authenticateToken, authorizeRoles('admin')];

router.get('/users', adminOnly, getAllUsers);

router.post('/users', adminOnly, [
  body('full_name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['user', 'admin']),
], createUser);

router.put('/users/:id', adminOnly, [
  param('id').isInt(),
  body('full_name').optional(),
  body('email').optional().isEmail(),
  body('password').optional().isLength({ min: 6 }),
  body('role').optional().isIn(['user', 'admin']),
], updateUserById);

router.delete('/users/:id', adminOnly, deleteUserById);

export default router;