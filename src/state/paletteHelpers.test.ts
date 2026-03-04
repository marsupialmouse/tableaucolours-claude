import { type Palette, MAX_COLOURS } from '../types';
import { canAddColours, availableColourSlots } from './paletteHelpers';

function makePalette(colourCount: number): Palette {
  return {
    name: 'Test',
    type: 'regular',
    colours: Array.from({ length: colourCount }, (_, i) => ({
      id: String(i),
      hex: '#000000',
    })),
    selectedColourId: null,
  };
}

describe('canAddColours', () => {
  it('returns true when palette has room', () => {
    expect(canAddColours(makePalette(0))).toBe(true);
    expect(canAddColours(makePalette(MAX_COLOURS - 1))).toBe(true);
  });

  it('returns false when palette is full', () => {
    expect(canAddColours(makePalette(MAX_COLOURS))).toBe(false);
  });
});

describe('availableColourSlots', () => {
  it('returns remaining capacity', () => {
    expect(availableColourSlots(makePalette(0))).toBe(MAX_COLOURS);
    expect(availableColourSlots(makePalette(5))).toBe(MAX_COLOURS - 5);
    expect(availableColourSlots(makePalette(MAX_COLOURS))).toBe(0);
  });
});
