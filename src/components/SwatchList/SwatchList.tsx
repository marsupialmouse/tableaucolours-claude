import { type PaletteColour } from '../../types';
import { Swatch } from '../Swatch/Swatch';

interface SwatchListProps {
  colours: PaletteColour[];
  selectedColourId: string | null;
  onSelect: (colourId: string) => void;
  onRemove: (colourId: string) => void;
  onDoubleClick: (colourId: string) => void;
  getDragHandlers?: ((index: number) => Record<string, unknown>) | undefined;
}

export function SwatchList({
  colours,
  selectedColourId,
  onSelect,
  onRemove,
  onDoubleClick,
  getDragHandlers,
}: SwatchListProps) {
  if (colours.length === 0) {
    return <p className="py-4 text-center text-sm text-gray-400">No colours in palette</p>;
  }

  return (
    <div className="grid grid-cols-4 justify-items-center gap-y-3" role="listbox" aria-label="Palette colours">
      {colours.map((colour, index) => (
        <Swatch
          key={colour.id}
          colour={colour}
          isSelected={colour.id === selectedColourId}
          onSelect={onSelect}
          onRemove={onRemove}
          onDoubleClick={onDoubleClick}
          dragHandlers={getDragHandlers?.(index)}
        />
      ))}
    </div>
  );
}
