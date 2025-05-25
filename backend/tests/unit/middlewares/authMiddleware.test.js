import { jest } from '@jest/globals';
import { authenticateToken } from '../../../middlewares/authMiddleware.js';
import { generateToken } from '../../../utils/jwt.js';

// Mock the DB layer so the middleware never touches Postgres/Sequelize in unit tests
jest.mock('../../../models/index.js', () => ({
  User: { findByPk: jest.fn() }
}));
import { User } from '../../../models/index.js';

function build(res = {}) {
  return {
    req: { headers: {}, ...res.req },
    res: {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      ...res.res,
    },
    next: jest.fn(),
  };
}

describe('authenticateToken middleware', () => {
  beforeEach(() => {
    User.findByPk.mockResolvedValue({ id: 1, email: 'stub@user.io' });
  });

  it('401s when no auth header', () => {
    const { req, res, next } = build();
    authenticateToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() when token valid', async () => {
    const token = generateToken(1); // token carries primitive userId in payload
    const { req, res, next } = build({
      req: { headers: { authorization: `Bearer ${token}` } },
    });
    await authenticateToken(req, res, next);
    expect(User.findByPk).toHaveBeenCalledWith(1);
    expect(next).toHaveBeenCalled();
  });
});