import { useState, useEffect } from 'react';
import { type RgbColour } from '../../types';
import { clampByte } from '../../utils/colour';

interface RgbInputsProps {
  rgb: RgbColour;
  onChange: (rgb: RgbColour) => void;
}

function RgbField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText(String(value));
  }, [value]);

  function commit() {
    const parsed = parseInt(text, 10);
    if (!isNaN(parsed)) {
      onChange(clampByte(parsed));
    } else {
      setText(String(value));
    }
  }

  return (
    <label className="flex items-center gap-1">
      <span className="text-[10px] font-medium text-gray-400">{label}</span>
      <input
        type="text"
        inputMode="numeric"
        aria-label={label}
        className="w-full rounded border border-gray-300 px-1.5 py-0.5 text-xs"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commit();
          }
        }}
      />
    </label>
  );
}

export function RgbInputs({ rgb, onChange }: RgbInputsProps) {
  return (
    <div className="flex gap-2">
      <RgbField
        label="R"
        value={rgb.r}
        onChange={(r) => {
          onChange({ ...rgb, r });
        }}
      />
      <RgbField
        label="G"
        value={rgb.g}
        onChange={(g) => {
          onChange({ ...rgb, g });
        }}
      />
      <RgbField
        label="B"
        value={rgb.b}
        onChange={(b) => {
          onChange({ ...rgb, b });
        }}
      />
    </div>
  );
}
