import { hashPassword, verifyPassword } from '../../../utils/password.js';

describe('password utilities', () => {
  const plain = 'Sup3r‑Secret!';

  it('hashes the password and verifies correctly', async () => {
    const hash = await hashPassword(plain);
    expect(hash).not.toEqual(plain);
    const ok = await verifyPassword(plain, hash);
    expect(ok).toBe(true);
  });
});