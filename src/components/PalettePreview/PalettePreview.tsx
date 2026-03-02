import { type PaletteColour, type PaletteType } from '../../types';

interface PalettePreviewProps {
  colours: PaletteColour[];
  type: PaletteType;
}

export function PalettePreview({ colours, type }: PalettePreviewProps) {
  if (colours.length === 0) {
    return (
      <div className="h-8 rounded border border-dashed border-gray-300 bg-gray-50" />
    );
  }

  if (type === 'regular') {
    return (
      <div className="flex h-8 overflow-hidden rounded" data-testid="palette-preview">
        {colours.map((colour) => (
          <div
            key={colour.id}
            className="flex-1"
            style={{ backgroundColor: colour.hex }}
          />
        ))}
      </div>
    );
  }

  // Sequential and diverging: render a CSS gradient
  const stops = colours.map((colour, index) => {
    const position = colours.length === 1 ? 50 : (index / (colours.length - 1)) * 100;
    return `${colour.hex} ${String(position)}%`;
  });
  const gradient = `linear-gradient(to right, ${stops.join(', ')})`;

  return (
    <div
      className="h-8 rounded"
      style={{ background: gradient }}
      data-testid="palette-preview"
    />
  );
}
