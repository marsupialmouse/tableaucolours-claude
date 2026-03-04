import { type Palette, MAX_COLOURS } from '../types';

export function canAddColours(palette: Palette): boolean {
  return palette.colours.length < MAX_COLOURS;
}

export function availableColourSlots(palette: Palette): number {
  return MAX_COLOURS - palette.colours.length;
}
