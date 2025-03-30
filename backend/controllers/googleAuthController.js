import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/index.js';
import { generateToken } from '../utils/jwt.js';
import config from '../config/config.js';

const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ error: 'Missing Google credential' });

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: config.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        full_name: name,
        email,
        password_hash: '',  // No password for OAuth accounts
        nationality: '',
        role: 'user'
      });
    }

    const token = generateToken(user.id);
    res.json({ token });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(401).json({ error: 'Google authentication failed' });
  }
};