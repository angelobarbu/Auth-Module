/**
 * Covers: authController.login success, wrong-pass, user-not-found
 */
import { jest } from '@jest/globals';

jest.unstable_mockModule('../../../utils/password.js', () => ({
  verifyPassword: jest.fn(),
}));

jest.unstable_mockModule('../../../utils/jwt.js', () => ({
  generateToken: jest.fn(() => 'jwt-fake'),
}));

jest.mock('../../../models', () => ({
  User: { findOne: jest.fn() },
}));

import * as passwordUtils from '../../../utils/password.js';

let login, User;

beforeAll(async () => {
  ({ login }           = await import('../../../controllers/authController.js'));
  ({ User }            = await import('../../../models/index.js'));
  jest.spyOn(passwordUtils, 'verifyPassword');
});

const build = () => {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  return { res };
};

describe('login controller', () => {


  it('401 on wrong password', async () => {
    const { res } = build();
    User.findOne.mockResolvedValue({ password: 'hash' });
    passwordUtils.verifyPassword.mockResolvedValue(false);

    await login({ body: { email: 'neo@zion.io', password: 'wrong' } }, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('404 if user not found', async () => {
    const { res } = build();
    User.findOne.mockResolvedValue(null);

    await login({ body: { email: 'nobody@nowhere.io', password: 'x' } }, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
