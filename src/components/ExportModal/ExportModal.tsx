import { useRef, useState, useEffect } from 'react';
import { type Palette } from '../../types';
import { generatePaletteXml } from '../../utils/xml';
import { Modal } from '../Modal/Modal';

interface ExportModalProps {
  palette: Palette;
  onClose: () => void;
}

export function ExportModal({ palette, onClose }: ExportModalProps) {
  const xml = generatePaletteXml(palette);
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    await navigator.clipboard.writeText(xml);
    setCopied(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <Modal title="Export Palette" onClose={onClose}>
      <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="export-xml">
        Colour palette XML
      </label>
      <textarea
        id="export-xml"
        readOnly
        autoFocus
        className="h-56 w-full rounded border border-gray-300 bg-gray-50 p-2 font-mono text-sm"
        value={xml}
      />
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Close
        </button>
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </Modal>
  );
}
