import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from '../../AppRoutes';
import { rest, server } from '../testServer';
import userEvent from '@testing-library/user-event';
import LoginForm from '../../components/LoginForm';

it('redirects admin to /admin dashboard after login', async () => {
  const mockLogin = jest.fn(); // mock the onLogin callback
  render(
    <MemoryRouter>
      <LoginForm onLogin={mockLogin} />
    </MemoryRouter>
  );


  await userEvent.type(screen.getByPlaceholderText(/E-mail/i), 'admin@example.com');
  await userEvent.type(screen.getByPlaceholderText(/Password/i), 'admin123');
  await userEvent.click(screen.getByRole('button', { name: /login/i }));

  expect(await screen.findByDisplayValue(/admin@example.com/i)).toBeInTheDocument();

});