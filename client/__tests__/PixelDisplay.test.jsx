import { render } from '@testing-library/react';
import PixelDisplay from '../src/components/PixelDisplay.jsx';

const patternInfo = {
  width: 2,
  height: 2,
  colorConfig: ['#000000', '#ffffff', '#ff0000', '#00ff00'],
};

beforeAll(() => {
  jest.spyOn(global.HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    getImageData: () => ({ data: new Uint8ClampedArray(16) }),
    putImageData: jest.fn(),
  });
});

test('PixelDisplay renders a canvas with pixelated style', () => {
  const { container } = render(
    <PixelDisplay patternInfo={patternInfo} displayWidth={100} displayHeight={100} />
  );

  const canvas = container.querySelector('canvas');
  expect(canvas).toBeInTheDocument();
  expect(canvas.style.imageRendering).toBe('pixelated');
  expect(canvas.style.width).toBe('100px');
  expect(canvas.style.height).toBe('100px');
});
