import { useState, useRef, useEffect, useCallback } from 'react';
import { type HsvColour, type RgbColour } from '../../types';
import { hexToHsv, hsvToHex, hsvToRgb, rgbToHsv } from '../../utils/colour';
import { ColourArea } from './ColourArea';
import { HueSlider } from './HueSlider';
import { RgbInputs } from './RgbInputs';
import { HexInput } from './HexInput';

interface ColourPickerProps {
  hex: string;
  onColourChange: (hex: string) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement | null>;
}

export function ColourPicker({
  hex,
  onColourChange,
  onClose,
  anchorRef,
}: ColourPickerProps) {
  const [hsv, setHsv] = useState<HsvColour>(() => hexToHsv(hex));
  const popoverRef = useRef<HTMLDivElement>(null);

  // Position the popover relative to the anchor
  const [position, setPosition] = useState({ top: 0, left: 0 });
  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const popoverWidth = 280;
    const popoverHeight = 340;

    let top = rect.top;
    let left = rect.right + 8;

    if (top + popoverHeight > window.innerHeight) {
      top = Math.max(8, window.innerHeight - popoverHeight - 8);
    }
    if (left + popoverWidth > window.innerWidth) {
      left = rect.left - popoverWidth - 8;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosition({ top, left });
  }, [anchorRef]);

  // Focus popover on mount
  useEffect(() => {
    popoverRef.current?.focus();
  }, []);

  // Close on outside mousedown (exclude clicks on the anchor swatch)
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        !anchorRef.current?.contains(target)
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [onClose, anchorRef]);

  const updateHsv = useCallback(
    (newHsv: HsvColour) => {
      setHsv(newHsv);
      onColourChange(hsvToHex(newHsv));
    },
    [onColourChange],
  );

  const handleAreaChange = useCallback(
    (saturation: number, value: number) => {
      updateHsv({ ...hsv, s: saturation, v: value });
    },
    [hsv, updateHsv],
  );

  const handleHueChange = useCallback(
    (hue: number) => {
      updateHsv({ ...hsv, h: hue });
    },
    [hsv, updateHsv],
  );

  /** Preserve the current hue when the new colour is a grey (saturation === 0). */
  const updateWithHuePreservation = useCallback(
    (newHsv: HsvColour) => {
      updateHsv(newHsv.s === 0 ? { ...newHsv, h: hsv.h } : newHsv);
    },
    [hsv.h, updateHsv],
  );

  const handleRgbChange = useCallback(
    (rgb: RgbColour) => {
      updateWithHuePreservation(rgbToHsv(rgb));
    },
    [updateWithHuePreservation],
  );

  const handleHexChange = useCallback(
    (newHex: string) => {
      updateWithHuePreservation(hexToHsv(newHex));
    },
    [updateWithHuePreservation],
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    } else if (e.key === 'Enter' && e.target === popoverRef.current) {
      e.preventDefault();
      onClose();
    }
  }

  const currentHex = hsvToHex(hsv);
  const currentRgb = hsvToRgb(hsv);

  return (
    <div
      ref={popoverRef}
      tabIndex={-1}
      role="dialog"
      aria-label="Colour picker"
      className="fixed z-50 flex w-[232px] flex-col gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-lg outline-none"
      style={{ top: position.top, left: position.left }}
      onKeyDown={handleKeyDown}
    >
      <ColourArea
        hue={hsv.h}
        saturation={hsv.s}
        value={hsv.v}
        onChange={handleAreaChange}
      />

      <HueSlider hue={hsv.h} onChange={handleHueChange} />

      <RgbInputs rgb={currentRgb} onChange={handleRgbChange} />

      <HexInput hex={currentHex} onChange={handleHexChange} />

      <button
        type="button"
        className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
        onClick={() => {
          onClose();
        }}
      >
        Done
      </button>
    </div>
  );
}
