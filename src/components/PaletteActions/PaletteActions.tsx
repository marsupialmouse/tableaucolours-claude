import { type Palette } from '../../types';
import { canAddColours } from '../../state/paletteHelpers';

interface PaletteActionsProps {
  palette: Palette;
  hasImage: boolean;
  onAddColour: () => void;
  onClearAll: () => void;
  onReverse: () => void;
  onExtract: () => void;
  onImport: () => void;
  onExport: () => void;
}

interface ActionButtonProps {
  label: string;
  shortcut?: string | undefined;
  disabled?: boolean | undefined;
  onClick: () => void;
  children: React.ReactNode;
}

function ActionButton({ label, shortcut, disabled = false, onClick, children }: ActionButtonProps) {
  const tooltip = shortcut ? `${label} (${shortcut})` : label;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={tooltip}
      className="flex aspect-square items-center justify-center rounded bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function PaletteActions({
  palette,
  hasImage,
  onAddColour,
  onClearAll,
  onReverse,
  onExtract,
  onImport,
  onExport,
}: PaletteActionsProps) {
  const colourCount = palette.colours.length;

  return (
    <div className="grid grid-cols-6 gap-1.5">
      <ActionButton label="Add colour" shortcut="+" disabled={!canAddColours(palette)} onClick={onAddColour}>
        <svg className="h-5 w-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M8 3v10M3 8h10" />
        </svg>
      </ActionButton>

      <ActionButton label="Clear all" disabled={colourCount === 0} onClick={onClearAll}>
        <svg className="h-5 w-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 4h10M6 4V3h4v1M5 4v8.5a.5.5 0 00.5.5h5a.5.5 0 00.5-.5V4" />
        </svg>
      </ActionButton>

      <ActionButton label="Reverse order" disabled={colourCount < 2} onClick={onReverse}>
        <svg className="h-5 w-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 3v10M4 3L2 5.5M4 3l2 2.5M12 13V3M12 13l-2-2.5M12 13l2-2.5" />
        </svg>
      </ActionButton>

      <ActionButton label="Extract from image" disabled={!hasImage} onClick={onExtract}>
        <svg className="h-5 w-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2H3a1 1 0 00-1 1v3M10 2h3a1 1 0 011 1v3M6 14H3a1 1 0 01-1-1v-3M10 14h3a1 1 0 001-1v-3" />
          <circle cx="8" cy="8" r="2" />
        </svg>
      </ActionButton>

      <ActionButton label="Import" onClick={onImport}>
        <svg className="h-5 w-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 2v8M8 10l-2.5-2.5M8 10l2.5-2.5M3 12v1h10v-1" />
        </svg>
      </ActionButton>

      <ActionButton label="Export" onClick={onExport}>
        <svg className="h-5 w-5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 10V2M8 2L5.5 4.5M8 2l2.5 2.5M3 12v1h10v-1" />
        </svg>
      </ActionButton>
    </div>
  );
}
