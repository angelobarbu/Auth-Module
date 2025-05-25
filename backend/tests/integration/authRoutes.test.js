// Force SQLite before anything Sequelize-related loads
process.env.DATABASE_URL = 'sqlite://:memory:';

import { jest } from '@jest/globals';
import request from 'supertest';

jest.resetModules();

let app, sequelize;

beforeAll(async () => {
  ({ sequelize } = await import('../../models/index.js'));
  ({ default: app } = await import('../../app.js'));
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth routes', () => {
  it('POST /register → 201 + message', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        full_name: 'Trinity',
        email: 'trinity@zion.io',
        password: 'bullet-time',
        confirm_password: 'bullet-time',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message');
  });

  it('POST /login → 200 on success', async () => {
    await request(app)
      .post('/api/login')
      .send({ email: 'trinity@zion.io', password: 'bullet-time' })
      .expect(200);
  });

  it('POST /login → 401 on wrong pass', async () => {
    await request(app)
      .post('/api/login')
      .send({ email: 'trinity@zion.io', password: 'wrong' })
      .expect(401);
  });
});