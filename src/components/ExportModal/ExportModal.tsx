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
      <label
        className="font-heading text-text-secondary mb-1 block text-sm font-medium"
        htmlFor="export-xml"
      >
        Colour palette XML
      </label>
      <textarea
        id="export-xml"
        readOnly
        autoFocus
        className="custom-scrollbar border-border-default bg-surface-panel text-text-primary h-56 w-full rounded border p-2 font-mono text-sm"
        value={xml}
      />
      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="border-border-default text-text-secondary hover:bg-surface-overlay rounded border px-4 py-2 text-sm font-medium transition-colors"
        >
          Close
        </button>
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="bg-accent hover:bg-accent-hover rounded px-4 py-2 text-sm font-medium text-white transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </Modal>
  );
}
