import { User } from '../models/index.js';
import { hashPassword, verifyPassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { validationResult } from 'express-validator';


export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { full_name, email, password, confirm_password, nationality } = req.body;
  if (password !== confirm_password) {
    return res.status(400).json({ error: "Passwords do not match." });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(409).json({ error: 'Email already registered.' });

    const password_hash = await hashPassword(password);
    await User.create({ full_name, email, password_hash, nationality });
    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};


export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const token = generateToken(user.id);
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};


export const updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
    const { full_name, email, nationality, old_password, password, confirm_new_password } = req.body;
    const user = req.user;
  
    try {
      if (email && email !== user.email) {
        const exists = await User.findOne({ where: { email } });
        if (exists) return res.status(409).json({ error: 'Email already in use.' });
      }
  
      const wantsPasswordUpdate =
        old_password?.trim() !== '' &&
        password?.trim() !== '' &&
        confirm_new_password?.trim() !== '';
  
      if (wantsPasswordUpdate) {
        if (!await verifyPassword(old_password, user.password_hash)) {
          return res.status(403).json({ error: 'Old password is incorrect.' });
        }
        if (password !== confirm_new_password) {
          return res.status(400).json({ error: 'New passwords do not match.' });
        }
        if (await verifyPassword(password, user.password_hash)) {
          return res.status(400).json({ error: 'New password must be different from old password.' });
        }
        user.password_hash = await hashPassword(password);
      }
  
      if (full_name) user.full_name = full_name;
      if (email) user.email = email;
      if (nationality) user.nationality = nationality;
  
      await user.save();
      return res.json({ message: 'User updated successfully.', user });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error' });
    }
};


export const setPassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  
    const { password, confirm_password } = req.body;
    const user = req.user;
  
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
  
    try {
      if (user.password_hash && user.password_hash !== '') {
        return res.status(400).json({ error: 'Password already set. Use update instead.' });
      }
  
      if (password !== confirm_password) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }
  
      const hashedPassword = await hashPassword(password);
      user.password_hash = hashedPassword;
      await user.save();
  
      res.json({ message: 'Password set successfully' });
    } catch (err) {
      console.error('Set password error:', err);
      res.status(500).json({ error: 'Server error' });
    }
  };


  export const deleteOwnAccount = async (req, res) => {
    const user = req.user;
    const { password, confirm_password } = req.body;
  
    if (!password || !confirm_password) {
      return res.status(400).json({ error: 'Both password fields are required.' });
    }
  
    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Passwords do not match.' });
    }
  
    try {
      const isMatch = await verifyPassword(password, user.password_hash);
      if (!isMatch) {
        return res.status(403).json({ error: 'Incorrect password.' });
      }
  
      await user.destroy();
      res.json({ message: 'Your account has been deleted successfully.' });
    } catch (err) {
      console.error('Error deleting account:', err);
      res.status(500).json({ error: 'Server error during account deletion.' });
    }
  };

