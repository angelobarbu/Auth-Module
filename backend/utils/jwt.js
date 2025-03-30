import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export function generateToken(userId) {
  const expiresIn = parseInt(config.TOKEN_EXPIRATION_SECONDS, 10);
  return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn });
}

export function decodeToken(token) {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    return null;
  }
}