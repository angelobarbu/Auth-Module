import { generateToken, decodeToken } from '../../../utils/jwt.js';

describe('jwt helpers', () => {
  it('round‑trips a simple id payload', () => {
    const userId = 7;
    const token = generateToken(userId);
    const decoded = decodeToken(token);
    expect(decoded).toMatchObject({ userId });
  });
});