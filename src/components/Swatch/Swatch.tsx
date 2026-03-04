import { useState } from 'react';
import { type PaletteColour } from '../../types';

interface SwatchProps {
  colour: PaletteColour;
  isSelected: boolean;
  onSelect: (colourId: string) => void;
  onRemove: (colourId: string) => void;
  onDoubleClick: (colourId: string, element: HTMLElement) => void;
  dragHandlers?: Record<string, unknown> | undefined;
}

export function Swatch({
  colour,
  isSelected,
  onSelect,
  onRemove,
  onDoubleClick,
  dragHandlers = {},
}: SwatchProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <button
        type="button"
        aria-label={colour.hex}
        aria-pressed={isSelected}
        className={`h-12 w-12 rounded-md transition-all duration-150 ${
          isSelected
            ? 'ring-accent ring-offset-surface-panel scale-110 ring-2 ring-offset-2'
            : 'ring-border-default hover:ring-border-strong ring-1 hover:scale-105'
        }`}
        style={{ backgroundColor: colour.hex }}
        onClick={() => {
          onSelect(colour.id);
        }}
        onDoubleClick={(e) => {
          onDoubleClick(colour.id, e.currentTarget);
        }}
        {...dragHandlers}
      />
      {isHovered && (
        <button
          type="button"
          aria-label="Remove colour"
          className="bg-danger absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border border-white leading-none text-white shadow-sm hover:brightness-110"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(colour.id);
          }}
        >
          <svg
            className="h-3 w-3"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M3 3l6 6M9 3l-6 6" />
          </svg>
        </button>
      )}
    </div>
  );
}
