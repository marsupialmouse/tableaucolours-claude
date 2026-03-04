import { getPaletteSync } from 'colorthief';
import { rgbToHex } from './colour';

/**
 * Score how "chromatic" (vivid / far from grey) an RGB colour is.
 * Higher = more colourful, lower = closer to neutral grey/black/white.
 */
function chromaticness(r: number, g: number, b: number): number {
  const mean = (r + g + b) / 3;
  return Math.max(Math.abs(r - mean), Math.abs(g - mean), Math.abs(b - mean));
}

/**
 * Extract prominent colours from an image, ranked by vividness.
 *
 * Requests double the desired count from Color Thief to build a larger pool,
 * scores each by chromaticness, and returns the top `count` as `#RRGGBB` hex strings.
 */
export function extractColours(image: HTMLImageElement, count: number): string[] {
  const poolSize = count * 2;

  const palette = getPaletteSync(image, { colorCount: poolSize, ignoreWhite: false });
  if (!palette) return [];

  const scored = palette.map((color) => {
    const { r, g, b } = color.rgb();
    return {
      hex: rgbToHex({ r, g, b }),
      score: chromaticness(r, g, b),
    };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, count).map((c) => c.hex);
}
