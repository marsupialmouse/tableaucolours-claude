import { isAllowedImageType, computeInitialZoom } from './image';

describe('isAllowedImageType', () => {
  it.each([
    ['image/gif', true],
    ['image/jpeg', true],
    ['image/png', true],
    ['image/webp', true],
    ['image/svg+xml', false],
    ['image/bmp', false],
    ['application/pdf', false],
    ['text/plain', false],
  ])('returns %s for type "%s"', (type, expected) => {
    const file = new File([''], 'test', { type });
    expect(isAllowedImageType(file)).toBe(expected);
  });
});

describe('computeInitialZoom', () => {
  it('returns 1 when image fits within canvas', () => {
    expect(computeInitialZoom(400, 300, 800, 600)).toBe(1);
  });

  it('returns 1 when image exactly matches canvas', () => {
    expect(computeInitialZoom(800, 600, 800, 600)).toBe(1);
  });

  it('scales down when image is wider than canvas', () => {
    // 1600w image in 800w canvas → 0.5
    expect(computeInitialZoom(1600, 300, 800, 600)).toBe(0.5);
  });

  it('scales down when image is taller than canvas', () => {
    // 1200h image in 600h canvas → 0.5
    expect(computeInitialZoom(400, 1200, 800, 600)).toBe(0.5);
  });

  it('uses the smaller scale factor when both dimensions exceed canvas', () => {
    // width ratio: 800/1600 = 0.5, height ratio: 600/900 = 0.667 → picks 0.5
    expect(computeInitialZoom(1600, 900, 800, 600)).toBeCloseTo(0.5);
  });

  it('handles very small images without upscaling', () => {
    expect(computeInitialZoom(10, 10, 800, 600)).toBe(1);
  });
});
