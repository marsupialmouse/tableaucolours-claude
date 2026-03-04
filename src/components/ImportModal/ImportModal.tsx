import { useState } from 'react';
import { type Palette } from '../../types';
import { parsePaletteXml } from '../../utils/xml';
import { Modal } from '../Modal/Modal';

interface ImportModalProps {
  onImport: (palette: Palette) => void;
  onClose: () => void;
}

export function ImportModal({ onImport, onClose }: ImportModalProps) {
  const [xml, setXml] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [parsedPalette, setParsedPalette] = useState<Palette | null>(null);

  function handleChange(value: string) {
    setXml(value);

    if (value.trim() === '') {
      setError(null);
      setParsedPalette(null);
      return;
    }

    const result = parsePaletteXml(value);
    if (result.success) {
      setError(null);
      setParsedPalette(result.palette);
    } else {
      setError(result.error);
      setParsedPalette(null);
    }
  }

  function handleImport() {
    if (parsedPalette) {
      onImport(parsedPalette);
    }
  }

  return (
    <Modal title="Import Palette" onClose={onClose}>
      <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="import-xml">
        Paste colour palette XML
      </label>
      <textarea
        id="import-xml"
        autoFocus
        className="h-56 w-full rounded border border-gray-300 p-2 font-mono text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        placeholder={
          '<color-palette name="My Palette" type="regular">\n    <color>#FF0000</color>\n</color-palette>'
        }
        value={xml}
        onChange={(e) => {
          handleChange(e.target.value);
        }}
      />
      {error && (
        <p role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleImport}
          disabled={parsedPalette === null}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Import
        </button>
      </div>
    </Modal>
  );
}
