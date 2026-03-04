import { vi } from 'vitest';

const mockGetPaletteSync = vi.fn();

vi.mock('colorthief', () => ({
  getPaletteSync: (...args: unknown[]) => mockGetPaletteSync(...args) as unknown,
}));

const { extractColours } = await import('./colourExtraction');

function makeColor(r: number, g: number, b: number) {
  return { rgb: () => ({ r, g, b }), hex: () => '', hsl: () => ({ h: 0, s: 0, l: 0 }) };
}

describe('extractColours', () => {
  const fakeImage = {} as HTMLImageElement;

  beforeEach(() => {
    mockGetPaletteSync.mockReset();
  });

  it('returns colours sorted by chromaticness (vivid first)', () => {
    mockGetPaletteSync.mockReturnValue([
      makeColor(128, 128, 128), // grey — score 0
      makeColor(255, 0, 0), // red — score 170
      makeColor(200, 180, 190), // muted pink — score ~10
      makeColor(0, 0, 255), // blue — score 170
    ]);

    const result = extractColours(fakeImage, 3);

    expect(result).toHaveLength(3);
    expect(result[0]).toBe('#FF0000');
    expect(result[1]).toBe('#0000FF');
    // 3rd should be the muted colour, not grey
    expect(result[2]).toBe('#C8B4BE');
  });

  it('returns at most `count` colours', () => {
    mockGetPaletteSync.mockReturnValue([
      makeColor(255, 0, 0),
      makeColor(0, 255, 0),
      makeColor(0, 0, 255),
      makeColor(255, 255, 0),
    ]);

    const result = extractColours(fakeImage, 2);
    expect(result).toHaveLength(2);
  });

  it('includes greys when they are needed to fill count', () => {
    mockGetPaletteSync.mockReturnValue([makeColor(128, 128, 128), makeColor(64, 64, 64)]);

    const result = extractColours(fakeImage, 2);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe('#808080');
    expect(result[1]).toBe('#404040');
  });

  it('calls getPaletteSync with double the requested count', () => {
    mockGetPaletteSync.mockReturnValue([
      makeColor(255, 0, 0),
      makeColor(0, 255, 0),
      makeColor(0, 0, 255),
      makeColor(255, 255, 0),
      makeColor(0, 255, 255),
      makeColor(255, 0, 255),
    ]);

    extractColours(fakeImage, 3);
    expect(mockGetPaletteSync).toHaveBeenCalledWith(fakeImage, {
      colorCount: 6,
      ignoreWhite: false,
    });
  });

  it('returns empty array when getPaletteSync returns null', () => {
    mockGetPaletteSync.mockReturnValue(null);

    const result = extractColours(fakeImage, 5);
    expect(result).toEqual([]);
  });
});
