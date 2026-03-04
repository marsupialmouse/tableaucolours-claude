interface PaletteNameInputProps {
  name: string;
  onChange: (name: string) => void;
}

export function PaletteNameInput({ name, onChange }: PaletteNameInputProps) {
  return (
    <div>
      <label
        htmlFor="palette-name"
        className="font-heading text-text-secondary mb-1 block text-sm font-medium"
      >
        Palette name
      </label>
      <input
        id="palette-name"
        type="text"
        value={name}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder="Unnamed palette"
        className="border-border-default bg-surface-input text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-accent w-full rounded border px-3 py-1.5 text-sm transition-colors focus:ring-1 focus:outline-none"
      />
    </div>
  );
}
