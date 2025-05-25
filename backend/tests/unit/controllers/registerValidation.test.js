/**
 * Covers: register controller paths that bail out *before* hitting DB
 */
import { jest } from '@jest/globals';

jest.unstable_mockModule('../../../utils/jwt.js', () => ({
  generateToken: jest.fn(),
}));

const mockUser = { findOne: jest.fn(), create: jest.fn() };

jest.mock('../../../models', () => ({ User: mockUser }));

let register;

beforeAll(async () => {
  ({ register } = await import('../../../controllers/authController.js'));
});

const build = (body) => {
  const req = { body, validationErrors: () => [] };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  return { req, res };
};

describe('register validation branches', () => {
  it('400 when passwords differ', async () => {
    const { req, res } = build({
      full_name: 'X',
      email: 'x@test.io',
      password: 'a',
      confirm_password: 'b',
    });

    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('409 on duplicate e-mail', async () => {
    mockUser.findOne.mockResolvedValue({ id: 1 });
    const { req, res } = build({
      full_name: 'Y',
      email: 'y@test.io',
      password: 'p',
      confirm_password: 'p',
    });

    await register(req, res);
    expect(res.status).toHaveBeenCalledWith(409);
  });
});
