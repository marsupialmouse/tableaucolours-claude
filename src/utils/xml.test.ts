import { parsePaletteXml, generatePaletteXml } from './xml';
import { type Palette } from '../types';

describe('parsePaletteXml', () => {
  it('parses all attributes and colours from valid XML', () => {
    const xml = `<color-palette name="My Palette" type="ordered-diverging">
      <color>#FF0000</color>
      <color>#00FF00</color>
      <color>#0000FF</color>
    </color-palette>`;

    const result = parsePaletteXml(xml);

    expect(result).toEqual({
      success: true,
      palette: {
        name: 'My Palette',
        type: 'ordered-diverging',
        colours: [
          { id: expect.any(String), hex: '#FF0000' },
          { id: expect.any(String), hex: '#00FF00' },
          { id: expect.any(String), hex: '#0000FF' },
        ],
        selectedColourId: expect.any(String),
      },
    });
    // First colour should be selected
    if (result.success) {
      expect(result.palette.selectedColourId).toBe(result.palette.colours[0]?.id);
    }
  });

  it('defaults name to empty string when name attribute is missing', () => {
    const xml = '<color-palette type="regular"><color>#FF0000</color></color-palette>';
    const result = parsePaletteXml(xml);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.palette.name).toBe('');
    }
  });

  it('parses a palette with no colours', () => {
    const xml = '<color-palette name="Empty" type="regular"></color-palette>';
    const result = parsePaletteXml(xml);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.palette.colours).toHaveLength(0);
      expect(result.palette.selectedColourId).toBeNull();
    }
  });

  it('keeps only the first 20 colours when more are provided', () => {
    const colourElements = Array.from(
      { length: 25 },
      (_, i) => `<color>#${String(i).padStart(2, '0')}0000</color>`,
    ).join('');
    const xml = `<color-palette type="regular">${colourElements}</color-palette>`;
    const result = parsePaletteXml(xml);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.palette.colours).toHaveLength(20);
      expect(result.palette.colours[0]?.hex).toBe('#000000');
      expect(result.palette.colours[19]?.hex).toBe('#190000');
    }
  });

  it('uppercases hex values from XML', () => {
    const xml = '<color-palette type="regular"><color>#aabbcc</color></color-palette>';
    const result = parsePaletteXml(xml);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.palette.colours[0]?.hex).toBe('#AABBCC');
    }
  });

  it('returns error with message for malformed XML', () => {
    const result = parsePaletteXml('<not valid xml');

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining('XML'),
    });
  });

  it('returns error when root element is not color-palette', () => {
    const xml = '<palette type="regular"><color>#FF0000</color></palette>';
    const result = parsePaletteXml(xml);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('color-palette');
    }
  });

  it('expands 3-char hex shorthand to 6-char', () => {
    const xml = '<color-palette type="regular"><color>#fff</color></color-palette>';
    const result = parsePaletteXml(xml);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.palette.colours[0]?.hex).toBe('#FFFFFF');
    }
  });

  it('strips alpha from 8-char RGBA hex strings', () => {
    const xml = '<color-palette type="regular"><color>#aabbccff</color></color-palette>';
    const result = parsePaletteXml(xml);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.palette.colours[0]?.hex).toBe('#AABBCC');
    }
  });

  it('returns error for unrecognised palette type', () => {
    const xml = '<color-palette type="gradient"><color>#FF0000</color></color-palette>';
    const result = parsePaletteXml(xml);

    expect(result).toEqual({
      success: false,
      error: expect.stringMatching(/type/i),
    });
  });
});

describe('generatePaletteXml', () => {
  it('generates complete XML with name, type, and all colours', () => {
    const palette: Palette = {
      name: 'Brand Colours',
      type: 'ordered-sequential',
      colours: [
        { id: 'c1', hex: '#112233' },
        { id: 'c2', hex: '#AABBCC' },
      ],
      selectedColourId: 'c1',
    };
    const xml = generatePaletteXml(palette);

    expect(xml).toBe(
      `<color-palette name="Brand Colours" type="ordered-sequential">\n` +
        `    <color>#112233</color>\n` +
        `    <color>#AABBCC</color>\n` +
        `</color-palette>`,
    );
  });

  it('omits name attribute when name is empty', () => {
    const palette: Palette = {
      name: '',
      type: 'regular',
      colours: [{ id: 'c1', hex: '#FF0000' }],
      selectedColourId: 'c1',
    };
    const xml = generatePaletteXml(palette);

    expect(xml.startsWith('<color-palette type="regular">')).toBe(true);
    expect(xml).not.toContain('name=');
  });

  it('generates empty palette with no colour elements', () => {
    const palette: Palette = {
      name: '',
      type: 'regular',
      colours: [],
      selectedColourId: null,
    };
    const xml = generatePaletteXml(palette);

    expect(xml).toBe('<color-palette type="regular">\n</color-palette>');
  });

  it('escapes special XML characters in name', () => {
    const palette: Palette = {
      name: 'A & B <"quoted">',
      type: 'regular',
      colours: [],
      selectedColourId: null,
    };
    const xml = generatePaletteXml(palette);

    expect(xml).toContain('name="A &amp; B &lt;&quot;quoted&quot;&gt;"');
  });

  it('roundtrips through parse and generate', () => {
    const originalXml = [
      '<color-palette name="Test" type="ordered-diverging">',
      '    <color>#FF0000</color>',
      '    <color>#00FF00</color>',
      '    <color>#0000FF</color>',
      '</color-palette>',
    ].join('\n');

    const parseResult = parsePaletteXml(originalXml);
    expect(parseResult.success).toBe(true);
    if (parseResult.success) {
      const regenerated = generatePaletteXml(parseResult.palette);
      expect(regenerated).toBe(originalXml);
    }
  });
});
