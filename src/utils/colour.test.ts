import { hexToRgb, rgbToHex, rgbToHsv, hsvToRgb, hexToHsv, hsvToHex, isValidHex } from './colour';

describe('hexToRgb', () => {
  it('converts black', () => {
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('converts white', () => {
    expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('converts primary red', () => {
    expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('converts an arbitrary colour', () => {
    expect(hexToRgb('#1A2B3C')).toEqual({ r: 26, g: 43, b: 60 });
  });

  it('handles lowercase hex', () => {
    expect(hexToRgb('#aabbcc')).toEqual({ r: 170, g: 187, b: 204 });
  });

  it('throws for invalid hex string', () => {
    expect(() => hexToRgb('not-hex')).toThrow('Invalid hex colour');
  });

  it('throws for 3-digit shorthand hex', () => {
    expect(() => hexToRgb('#FFF')).toThrow('Invalid hex colour');
  });

  it('throws for hex without # prefix', () => {
    expect(() => hexToRgb('FF0000')).toThrow('Invalid hex colour');
  });
});

describe('rgbToHex', () => {
  it('converts black', () => {
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
  });

  it('converts white', () => {
    expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#FFFFFF');
  });

  it('converts primary green', () => {
    expect(rgbToHex({ r: 0, g: 255, b: 0 })).toBe('#00FF00');
  });

  it('converts an arbitrary colour', () => {
    expect(rgbToHex({ r: 26, g: 43, b: 60 })).toBe('#1A2B3C');
  });

  it('clamps values above 255', () => {
    expect(rgbToHex({ r: 300, g: 0, b: 0 })).toBe('#FF0000');
  });

  it('clamps values below 0', () => {
    expect(rgbToHex({ r: -10, g: 0, b: 0 })).toBe('#000000');
  });

  it('rounds fractional values', () => {
    expect(rgbToHex({ r: 127.6, g: 0.4, b: 255.1 })).toBe('#8000FF');
  });
});

describe('rgbToHsv', () => {
  it('converts black to h=0, s=0, v=0', () => {
    expect(rgbToHsv({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, v: 0 });
  });

  it('converts white to h=0, s=0, v=100', () => {
    expect(rgbToHsv({ r: 255, g: 255, b: 255 })).toEqual({ h: 0, s: 0, v: 100 });
  });

  it('converts pure red to h=0, s=100, v=100', () => {
    expect(rgbToHsv({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, v: 100 });
  });

  it('converts pure green to h=120, s=100, v=100', () => {
    expect(rgbToHsv({ r: 0, g: 255, b: 0 })).toEqual({ h: 120, s: 100, v: 100 });
  });

  it('converts pure blue to h=240, s=100, v=100', () => {
    expect(rgbToHsv({ r: 0, g: 0, b: 255 })).toEqual({ h: 240, s: 100, v: 100 });
  });

  it('converts yellow (r+g) to h=60', () => {
    expect(rgbToHsv({ r: 255, g: 255, b: 0 })).toEqual({ h: 60, s: 100, v: 100 });
  });

  it('converts cyan (g+b) to h=180', () => {
    expect(rgbToHsv({ r: 0, g: 255, b: 255 })).toEqual({ h: 180, s: 100, v: 100 });
  });

  it('converts magenta (r+b) to h=300', () => {
    expect(rgbToHsv({ r: 255, g: 0, b: 255 })).toEqual({ h: 300, s: 100, v: 100 });
  });

  it('converts a mid-grey to s=0', () => {
    const result = rgbToHsv({ r: 128, g: 128, b: 128 });
    expect(result.h).toBe(0);
    expect(result.s).toBe(0);
    expect(result.v).toBeCloseTo(50.2, 0);
  });
});

describe('hsvToRgb', () => {
  it('converts black', () => {
    expect(hsvToRgb({ h: 0, s: 0, v: 0 })).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('converts white', () => {
    expect(hsvToRgb({ h: 0, s: 0, v: 100 })).toEqual({ r: 255, g: 255, b: 255 });
  });

  it('converts pure red', () => {
    expect(hsvToRgb({ h: 0, s: 100, v: 100 })).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('converts pure green', () => {
    expect(hsvToRgb({ h: 120, s: 100, v: 100 })).toEqual({ r: 0, g: 255, b: 0 });
  });

  it('converts pure blue', () => {
    expect(hsvToRgb({ h: 240, s: 100, v: 100 })).toEqual({ r: 0, g: 0, b: 255 });
  });

  it('converts h=360 the same as h=0', () => {
    expect(hsvToRgb({ h: 360, s: 100, v: 100 })).toEqual({ r: 255, g: 0, b: 0 });
  });
});

describe('roundtrip conversions', () => {
  const testCases = [
    { hex: '#000000', label: 'black' },
    { hex: '#FFFFFF', label: 'white' },
    { hex: '#FF0000', label: 'red' },
    { hex: '#00FF00', label: 'green' },
    { hex: '#0000FF', label: 'blue' },
    { hex: '#FFFF00', label: 'yellow' },
    { hex: '#FF00FF', label: 'magenta' },
    { hex: '#00FFFF', label: 'cyan' },
    { hex: '#808080', label: 'grey' },
    { hex: '#1A2B3C', label: 'arbitrary colour' },
  ];

  it.each(testCases)('hex → rgb → hex roundtrip for $label ($hex)', ({ hex }) => {
    expect(rgbToHex(hexToRgb(hex))).toBe(hex);
  });

  it.each(testCases)('hex → hsv → hex roundtrip for $label ($hex)', ({ hex }) => {
    expect(hsvToHex(hexToHsv(hex))).toBe(hex);
  });
});

describe('isValidHex', () => {
  it('accepts valid uppercase 6-digit hex with #', () => {
    expect(isValidHex('#FF00AA')).toBe(true);
  });

  it('accepts valid lowercase hex', () => {
    expect(isValidHex('#aabbcc')).toBe(true);
  });

  it('accepts valid mixed case hex', () => {
    expect(isValidHex('#AaBb01')).toBe(true);
  });

  it('rejects hex without # prefix', () => {
    expect(isValidHex('FF00AA')).toBe(false);
  });

  it('rejects 3-digit shorthand', () => {
    expect(isValidHex('#FFF')).toBe(false);
  });

  it('rejects 8-digit hex (with alpha)', () => {
    expect(isValidHex('#FF00AAFF')).toBe(false);
  });

  it('rejects non-hex characters', () => {
    expect(isValidHex('#GGHHII')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(isValidHex('')).toBe(false);
  });
});
