import { render, screen } from '@testing-library/react';
import PixelPost from '../src/components/PixelPost.jsx';

jest.mock('../src/components/PixelDisplay.jsx', () => () => <div data-testid="pixel-display" />);

const samplePost = {
  pattern_ID: 1,
  pattern_name: 'Test Pattern',
  pattern_info: { width: 5, height: 5, colorConfig: ['#000'] },
  description: 'Sample description',
  date: '2024-10-15T12:34:56.000Z',
  author: 'Alice',
};

test('PixelPost shows basic post info', () => {
  render(<PixelPost post={samplePost} />);

  expect(screen.getByText('Test Pattern')).toBeInTheDocument();
  expect(screen.getByText('Sample description')).toBeInTheDocument();
  expect(screen.getByText(/Alice/)).toBeInTheDocument();
  expect(screen.getByText('2024-10-15')).toBeInTheDocument();
  expect(screen.getByTestId('pixel-display')).toBeInTheDocument();
});
