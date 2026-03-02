import { type PaletteType, PALETTE_TYPE_LABELS } from '../../types';

interface PaletteTypeSelectorProps {
  selectedType: PaletteType;
  onChange: (type: PaletteType) => void;
}

const TYPES: PaletteType[] = ['regular', 'ordered-sequential', 'ordered-diverging'];

function TypeIcon({ type }: { type: PaletteType }) {
  switch (type) {
    case 'regular':
      return (
        <svg className="h-5 w-full" viewBox="0 0 64 20" aria-hidden="true">
          <rect x="0" y="0" width="10" height="20" rx="2" fill="#888" />
          <rect x="14" y="0" width="10" height="20" rx="2" fill="#666" />
          <rect x="28" y="0" width="10" height="20" rx="2" fill="#aaa" />
          <rect x="42" y="0" width="10" height="20" rx="2" fill="#555" />
          <rect x="54" y="0" width="10" height="20" rx="2" fill="#999" />
        </svg>
      );
    case 'ordered-sequential':
      return (
        <svg className="h-5 w-full" viewBox="0 0 64 20" aria-hidden="true">
          <defs>
            <linearGradient id="seq-grad">
              <stop offset="0%" stopColor="#ddd" />
              <stop offset="100%" stopColor="#333" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="64" height="20" rx="2" fill="url(#seq-grad)" />
        </svg>
      );
    case 'ordered-diverging':
      return (
        <svg className="h-5 w-full" viewBox="0 0 64 20" aria-hidden="true">
          <defs>
            <linearGradient id="div-grad">
              <stop offset="0%" stopColor="#333" />
              <stop offset="50%" stopColor="#eee" />
              <stop offset="100%" stopColor="#333" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="64" height="20" rx="2" fill="url(#div-grad)" />
        </svg>
      );
  }
}

export function PaletteTypeSelector({ selectedType, onChange }: PaletteTypeSelectorProps) {
  function handleKeyDown(e: React.KeyboardEvent, currentIndex: number) {
    let nextIndex: number | undefined;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % TYPES.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + TYPES.length) % TYPES.length;
    }

    if (nextIndex !== undefined) {
      const next = TYPES[nextIndex];
      if (next) {
        onChange(next);
        const nextElement = document.querySelector<HTMLElement>(
          `[data-palette-type="${next}"]`,
        );
        nextElement?.focus();
      }
    }
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-gray-700">Palette type</span>
      <div role="radiogroup" aria-label="Palette type" className="grid grid-cols-3 gap-1.5">
        {TYPES.map((type, index) => {
          const isSelected = type === selectedType;
          return (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={PALETTE_TYPE_LABELS[type]}
              data-palette-type={type}
              tabIndex={isSelected ? 0 : -1}
              className={`flex flex-col items-center gap-1 rounded-md border-2 px-2 py-1.5 transition-colors ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => {
                onChange(type);
              }}
              onKeyDown={(e) => {
                handleKeyDown(e, index);
              }}
            >
              <TypeIcon type={type} />
              <span className="text-xs text-gray-600">{PALETTE_TYPE_LABELS[type]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
