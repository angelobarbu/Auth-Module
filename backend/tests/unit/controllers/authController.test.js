import { jest } from '@jest/globals';

/* --- mock dependencies BEFORE importing module under test --- */

jest.unstable_mockModule('../../../utils/jwt.js', () => ({
  generateToken: jest.fn(() => 'fake-jwt'),
}));

// mock *before* importing the controller so it gets the stub
jest.mock('../../../models', () => ({
  User: {
    findOne: jest.fn(),
    create : jest.fn(),
  },
}));

let register, generateToken, User;

beforeAll(async () => {
  ({ register }        = await import('../../../controllers/authController.js'));
  ({ generateToken }   = await import('../../../utils/jwt.js'));
  ({ User }            = await import('../../../models/index.js'));
});

describe('register controller', () => {
  const build = () => {
    const req = {
      body: {
        full_name: 'Neo',
        email: 'neo@zion.io',
        password: 'matrix',
        confirm_password: 'matrix',
      },
      validationErrors: () => [],
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    return { req, res };
  };

  it('returns 201 & token', async () => {
    const { req, res } = build();
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ id: 1 });

    await register(req, res);

    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({ email: 'neo@zion.io' }));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({"message": "User registered successfully."}));
  });
});