import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../../components/LoginForm';
import { rest, server } from '../testServer'; 


it('shows error message on failed login', async () => {
  const mockLogin = jest.fn();

  // Override MSW handler to simulate failure
  server.use(
    rest.post('/login', (req, res, ctx) =>
      res(ctx.status(401), ctx.json({ error: 'Invalid email or password.' }))
    )
  );

  render(
    <MemoryRouter>
      <LoginForm onLogin={mockLogin} />
    </MemoryRouter>
  );

  await userEvent.type(screen.getByPlaceholderText(/E-mail/i), 'fail@test.io');
  await userEvent.type(screen.getByPlaceholderText(/Password/i), 'wrong');
  await userEvent.click(screen.getByRole('button', { name: /login/i }));

  expect(await screen.findByText(/Login failed/i)).toBeInTheDocument();
  expect(mockLogin).not.toHaveBeenCalled();
});
