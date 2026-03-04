import { useState, useMemo, useCallback } from 'react';
import { type Palette, MAX_COLOURS } from '../../types';
import { availableColourSlots } from '../../state/paletteHelpers';
import { Modal } from '../Modal/Modal';
import { extractColours } from '../../utils/colourExtraction';

interface ExtractColoursModalProps {
  image: HTMLImageElement;
  palette: Palette;
  onExtract: (hexValues: string[], mode: 'replace' | 'add') => void;
  onClose: () => void;
}

export function ExtractColoursModal({
  image,
  palette,
  onExtract,
  onClose,
}: ExtractColoursModalProps) {
  const availableSlots = availableColourSlots(palette);
  const [mode, setMode] = useState<'replace' | 'add'>('replace');
  const maxCount = mode === 'replace' ? MAX_COLOURS : availableSlots;
  const [count, setCount] = useState(Math.min(5, maxCount));

  const preview = useMemo(() => extractColours(image, count), [image, count]);

  const handleModeChange = useCallback(
    (newMode: 'replace' | 'add') => {
      setMode(newMode);
      const newMax = newMode === 'replace' ? MAX_COLOURS : availableSlots;
      setCount((prev) => Math.min(prev, newMax));
    },
    [availableSlots],
  );

  const handleCountChange = useCallback(
    (delta: number) => {
      setCount((prev) => Math.max(1, Math.min(prev + delta, maxCount)));
    },
    [maxCount],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val)) {
        setCount(Math.max(1, Math.min(val, maxCount)));
      }
    },
    [maxCount],
  );

  const canAdd = availableSlots > 0;

  return (
    <Modal title="Extract Colours from Image" onClose={onClose}>
      <div className="flex flex-col gap-5">
        <fieldset className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="extract-mode"
              value="replace"
              checked={mode === 'replace'}
              onChange={() => {
                handleModeChange('replace');
              }}
            />
            <span className="text-sm text-gray-800">Replace existing colours</span>
          </label>
          <label
            className={`flex items-center gap-2 ${!canAdd ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <input
              type="radio"
              name="extract-mode"
              value="add"
              checked={mode === 'add'}
              disabled={!canAdd}
              onChange={() => {
                handleModeChange('add');
              }}
            />
            <span className="text-sm text-gray-800">Add to existing colours</span>
          </label>
        </fieldset>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-800">Number of colours to extract</span>
          <div className="inline-flex items-stretch overflow-hidden rounded border border-gray-300">
            <button
              type="button"
              onClick={() => {
                handleCountChange(-1);
              }}
              disabled={count <= 1}
              aria-label="Decrease count"
              className="border-r border-gray-300 bg-gray-50 px-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              &minus;
            </button>
            <input
              type="number"
              min={1}
              max={maxCount}
              value={count}
              onChange={handleInputChange}
              aria-label="Colour count"
              className="w-12 appearance-none border-none px-1 py-1 text-center text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                handleCountChange(1);
              }}
              disabled={count >= maxCount}
              aria-label="Increase count"
              className="border-l border-gray-300 bg-gray-50 px-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-sm text-gray-800">Preview</p>
          <div className="flex gap-1" role="list" aria-label="Extracted colour preview">
            {preview.map((hex, i) => (
              <div
                key={i}
                role="listitem"
                className="h-8 w-8 rounded shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)]"
                style={{ backgroundColor: hex }}
                title={hex}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onExtract(preview, mode);
            }}
            disabled={preview.length === 0}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Extract
          </button>
        </div>
      </div>
    </Modal>
  );
}
