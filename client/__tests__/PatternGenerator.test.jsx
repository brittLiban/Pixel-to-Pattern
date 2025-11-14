import { render, screen } from '@testing-library/react';
import PatternGenerator from '../src/components/PatternGenerator.jsx';

const patternInfo = {
  width: 2,
  height: 2,
  colorConfig: ['#111111', '#111111', '#222222', '#222222'],
};

test('PatternGenerator lists rows derived from pattern colors', async () => {
  render(<PatternGenerator patternInfo={patternInfo} />);

  const rows = await screen.findAllByRole('listitem');
  expect(rows).toHaveLength(2);
  expect(rows[0]).toHaveTextContent('Row 1');
  expect(rows[0]).toHaveTextContent('#111111');
  expect(rows[1]).toHaveTextContent('Row 2');
  expect(rows[1]).toHaveTextContent('#222222');
});
