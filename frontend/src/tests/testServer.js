import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const handlers = [
  rest.post('/login', (req, res, ctx) => {
    const role = email === 'admin@test.io' ? 'admin' : 'user';
    return res(ctx.status(200), ctx.json({ token: 'jwt-mock', role }));
  }),
  rest.post('/register', (req, res, ctx) =>
    res(ctx.status(201), ctx.json({ token: 'jwt‑mock' }))
  ),
  rest.get('/protected', (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ ok: true }))
  ),
];

export const server = setupServer(...handlers);
export { rest };
