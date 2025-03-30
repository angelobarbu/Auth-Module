import { User } from '../models/index.js';
import { hashPassword } from '../utils/password.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password_hash'] } });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createUser = async (req, res) => {
  const { full_name, email, password, nationality, role } = req.body;
  try {
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ error: 'Email already in use' });

    const password_hash = await hashPassword(password);
    const newUser = await User.create({ full_name, email, password_hash, nationality, role });
    res.status(201).json({ message: 'User created', user: newUser });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { full_name, email, password, nationality, role } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (email && email !== user.email) {
      const exists = await User.findOne({ where: { email } });
      if (exists) return res.status(409).json({ error: 'Email already in use' });
    }

    if (full_name) user.full_name = full_name;
    if (email) user.email = email;
    if (password) user.password_hash = await hashPassword(password);
    if (nationality) user.nationality = nationality;
    if (role) user.role = role;

    await user.save();
    res.json({ message: 'User updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};