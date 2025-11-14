import { render, screen } from '@testing-library/react';
import NavBar from '../src/components/NavBar.jsx';

test('NavBar renders site title and navigation links', () => {
  render(<NavBar />);

  expect(screen.getByRole('heading', { name: /pixel2pattern/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /faq/i })).toBeInTheDocument();
});
