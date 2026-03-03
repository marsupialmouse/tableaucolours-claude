import { escape } from 'he';
import { type Palette, type PaletteType, MAX_COLOURS } from '../types';

const VALID_TYPES: ReadonlySet<string> = new Set<PaletteType>([
  'regular',
  'ordered-sequential',
  'ordered-diverging',
]);

type ParseResult =
  | { success: true; palette: Palette }
  | { success: false; error: string };

/** Normalise a hex colour string to uppercase 6-char "#RRGGBB" format. */
function normaliseHex(raw: string): string {
  const trimmed = raw.trim().toUpperCase();

  // 3-char shorthand: #RGB → #RRGGBB
  if (/^#[\dA-F]{3}$/.test(trimmed)) {
    const r = trimmed.charAt(1);
    const g = trimmed.charAt(2);
    const b = trimmed.charAt(3);
    return `#${r}${r}${g}${g}${b}${b}`;
  }

  // 8-char RGBA: #RRGGBBAA → #RRGGBB (discard alpha)
  if (/^#[\dA-F]{8}$/.test(trimmed)) {
    return trimmed.slice(0, 7);
  }

  return trimmed;
}

export function parsePaletteXml(xml: string): ParseResult {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'application/xml');

  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    return { success: false, error: 'Invalid XML: the input is not well-formed XML.' };
  }

  const root = doc.documentElement;
  if (root.tagName !== 'color-palette') {
    return {
      success: false,
      error: `Expected root element <color-palette>, got <${root.tagName}>.`,
    };
  }

  const typeAttr = root.getAttribute('type') ?? 'regular';
  if (!VALID_TYPES.has(typeAttr)) {
    return {
      success: false,
      error: `Unrecognised palette type "${typeAttr}". Expected regular, ordered-sequential, or ordered-diverging.`,
    };
  }

  const name = root.getAttribute('name') ?? '';
  const colourElements = Array.from(root.getElementsByTagName('color'));
  const colours = colourElements.slice(0, MAX_COLOURS).map((el) => ({
    id: crypto.randomUUID(),
    hex: normaliseHex(el.textContent),
  }));

  const selectedColourId = colours[0]?.id ?? null;

  return {
    success: true,
    palette: {
      name,
      type: typeAttr as PaletteType,
      colours,
      selectedColourId,
    },
  };
}

export function generatePaletteXml(palette: Palette): string {
  const nameAttr = palette.name ? ` name="${escape(palette.name)}"` : '';
  const lines = [`<color-palette${nameAttr} type="${palette.type}">`];

  for (const colour of palette.colours) {
    lines.push(`    <color>${colour.hex}</color>`);
  }

  lines.push('</color-palette>');
  return lines.join('\n');
}
