import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login title', () => {
  render(<App />);
  expect(screen.getAllByText(/login/i)).toHaveLength(2);
});
