import { useState, useEffect } from 'react';
import { isValidHex } from '../../utils/colour';

interface HexInputProps {
  hex: string;
  onChange: (hex: string) => void;
}

export function HexInput({ hex, onChange }: HexInputProps) {
  const [text, setText] = useState(hex);

  useEffect(() => {
    setText(hex);
  }, [hex]);

  function commit() {
    const normalised = `#${text.replace(/^#/, '').toUpperCase()}`;
    if (isValidHex(normalised)) {
      onChange(normalised);
    } else {
      setText(hex);
    }
  }

  return (
    <input
      type="text"
      aria-label="Hex colour"
      className="border-border-default bg-surface-input text-text-primary focus:border-accent w-full rounded border px-1.5 py-0.5 font-mono text-xs transition-colors focus:outline-none"
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
  );
}
