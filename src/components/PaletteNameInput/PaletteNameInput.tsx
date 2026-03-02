interface PaletteNameInputProps {
  name: string;
  onChange: (name: string) => void;
}

export function PaletteNameInput({ name, onChange }: PaletteNameInputProps) {
  return (
    <div>
      <label htmlFor="palette-name" className="mb-1 block text-sm font-medium text-gray-700">
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
        className="w-full rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}
