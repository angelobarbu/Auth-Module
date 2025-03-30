import { decodeToken } from '../utils/jwt.js';
import { User } from '../models/index.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.replace('Bearer ', '');
  const decoded = decodeToken(token);
  if (!decoded) return res.status(401).json({ error: 'Invalid or expired token' });

  const user = await User.findByPk(decoded.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  req.user = user;
  next();
};