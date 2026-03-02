import { type Palette } from '../../types';
import { type PaletteAction } from '../../state/paletteReducer';
import { PaletteNameInput } from '../PaletteNameInput/PaletteNameInput';
import { PaletteTypeSelector } from '../PaletteTypeSelector/PaletteTypeSelector';
import { SwatchList } from '../SwatchList/SwatchList';
import { PaletteActions } from '../PaletteActions/PaletteActions';
import { PalettePreview } from '../PalettePreview/PalettePreview';

interface PalettePanelProps {
  palette: Palette;
  dispatch: React.Dispatch<PaletteAction>;
  hasImage: boolean;
  onOpenExtract: () => void;
  onOpenImport: () => void;
  onOpenExport: () => void;
  onDoubleClickColour: (colourId: string) => void;
  getDragHandlers?: ((index: number) => Record<string, unknown>) | undefined;
}

export function PalettePanel({
  palette,
  dispatch,
  hasImage,
  onOpenExtract,
  onOpenImport,
  onOpenExport,
  onDoubleClickColour,
  getDragHandlers,
}: PalettePanelProps) {
  return (
    <aside className="flex w-72 flex-col border-r border-gray-200 bg-gray-50 p-4">
      <div className="flex flex-col gap-4">
        <PaletteNameInput
          name={palette.name}
          onChange={(name) => {
            dispatch({ type: 'SET_NAME', name });
          }}
        />

        <PaletteTypeSelector
          selectedType={palette.type}
          onChange={(paletteType) => {
            dispatch({ type: 'SET_TYPE', paletteType });
          }}
        />
      </div>

      <div className="h-72 overflow-y-auto py-4">
        <SwatchList
          colours={palette.colours}
          selectedColourId={palette.selectedColourId}
          onSelect={(colourId) => {
            dispatch({ type: 'SELECT_COLOUR', colourId });
          }}
          onRemove={(colourId) => {
            dispatch({ type: 'REMOVE_COLOUR', colourId });
          }}
          onDoubleClick={onDoubleClickColour}
          getDragHandlers={getDragHandlers}
        />
      </div>

      <div className="flex flex-col gap-4">
        <PalettePreview colours={palette.colours} type={palette.type} />

        <PaletteActions
          colourCount={palette.colours.length}
          hasImage={hasImage}
          onAddColour={() => {
            dispatch({ type: 'ADD_COLOUR' });
          }}
          onClearAll={() => {
            dispatch({ type: 'CLEAR_ALL_COLOURS' });
          }}
          onReverse={() => {
            dispatch({ type: 'REVERSE_COLOUR_ORDER' });
          }}
          onExtract={onOpenExtract}
          onImport={onOpenImport}
          onExport={onOpenExport}
        />
      </div>
    </aside>
  );
}
