import { type RgbColour, type HsvColour } from '../types';

export function hexToRgb(hex: string): RgbColour {
  const match = /^#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/.exec(hex);
  if (!match) {
    throw new Error(`Invalid hex colour: ${hex}`);
  }
  return {
    r: parseInt(match[1] ?? '', 16),
    g: parseInt(match[2] ?? '', 16),
    b: parseInt(match[3] ?? '', 16),
  };
}

export function rgbToHex(rgb: RgbColour): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function rgbToHsv(rgb: RgbColour): HsvColour {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h = h * 60;
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : (delta / max) * 100;
  const v = max * 100;

  return { h, s, v };
}

export function hsvToRgb(hsv: HsvColour): RgbColour {
  const s = hsv.s / 100;
  const v = hsv.v / 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((hsv.h / 60) % 2) - 1));
  const m = v - c;

  let r = 0;
  let g = 0;
  let b = 0;

  if (hsv.h < 60) {
    r = c;
    g = x;
  } else if (hsv.h < 120) {
    r = x;
    g = c;
  } else if (hsv.h < 180) {
    g = c;
    b = x;
  } else if (hsv.h < 240) {
    g = x;
    b = c;
  } else if (hsv.h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function hexToHsv(hex: string): HsvColour {
  return rgbToHsv(hexToRgb(hex));
}

export function hsvToHex(hsv: HsvColour): string {
  return rgbToHex(hsvToRgb(hsv));
}

export function isValidHex(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}
