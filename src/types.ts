export type PaletteType = 'regular' | 'ordered-sequential' | 'ordered-diverging';

export const PALETTE_TYPE_LABELS: Record<PaletteType, string> = {
  regular: 'Regular',
  'ordered-sequential': 'Sequential',
  'ordered-diverging': 'Diverging',
};

export interface RgbColour {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface HsvColour {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
}

export interface PaletteColour {
  id: string;
  hex: string; // "#RRGGBB" uppercase
}

export interface Palette {
  name: string;
  type: PaletteType;
  colours: PaletteColour[];
  selectedColourId: string | null;
}

export const MAX_COLOURS = 20;

export function createDefaultPalette(): Palette {
  const id = crypto.randomUUID();
  return {
    name: '',
    type: 'regular',
    colours: [{ id, hex: '#FFFFFF' }],
    selectedColourId: id,
  };
}
