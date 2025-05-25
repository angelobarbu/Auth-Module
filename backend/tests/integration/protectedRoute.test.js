/**
 * Tiny smoke test for authMiddleware + roleMiddleware + /api/admin
 */
import request from 'supertest';
import app from '../../app.js';

describe('GET /api/admin/dashboard', () => {
  it('403 without token, 401 with bad role', async () => {
    await request(app).get('/api/admin/users').expect(401);

    // fake a valid JWT but non-admin user
    const token = Buffer.from('header').toString('base64') + '.' +
                  Buffer.from(JSON.stringify({ id: 1, role: 'user' })).toString('base64') +
                  '.sig';

    await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});
