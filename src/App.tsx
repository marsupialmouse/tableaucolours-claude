import { useCallback, useMemo, useState } from 'react';
import { useImmerReducer } from 'use-immer';
import { createDefaultPalette } from './types';
import { paletteReducer } from './state/paletteReducer';
import { PalettePanel } from './components/PalettePanel/PalettePanel';
import { ImageCanvas } from './components/ImageCanvas/ImageCanvas';
import { ImportModal } from './components/ImportModal/ImportModal';
import { ExportModal } from './components/ExportModal/ExportModal';
import { ExtractColoursModal } from './components/ExtractColoursModal/ExtractColoursModal';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useImageLoader } from './hooks/useImageLoader';

type ActiveModal = 'none' | 'import' | 'export' | 'extract';

export function App() {
  const [palette, dispatch] = useImmerReducer(paletteReducer, undefined, createDefaultPalette);
  const { image, loadImage, openImagePicker } = useImageLoader();
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const selectedIndex = useMemo(
    () => palette.colours.findIndex((c) => c.id === palette.selectedColourId),
    [palette.colours, palette.selectedColourId],
  );

  const shortcutHandlers = useMemo(
    () => ({
      onAddColour: () => {
        dispatch({ type: 'ADD_COLOUR' });
      },
      onDeleteColour: () => {
        if (palette.selectedColourId) {
          dispatch({ type: 'REMOVE_COLOUR', colourId: palette.selectedColourId });
        }
      },
      onSelectNext: () => {
        dispatch({ type: 'SELECT_NEXT_COLOUR' });
      },
      onSelectPrevious: () => {
        dispatch({ type: 'SELECT_PREVIOUS_COLOUR' });
      },
      onMoveLeft: () => {
        if (selectedIndex > 0) {
          dispatch({ type: 'MOVE_COLOUR', fromIndex: selectedIndex, toIndex: selectedIndex - 1 });
        }
      },
      onMoveRight: () => {
        if (selectedIndex >= 0 && selectedIndex < palette.colours.length - 1) {
          dispatch({ type: 'MOVE_COLOUR', fromIndex: selectedIndex, toIndex: selectedIndex + 1 });
        }
      },
    }),
    [dispatch, palette.selectedColourId, palette.colours.length, selectedIndex],
  );

  useKeyboardShortcuts(shortcutHandlers);

  const handlePickColour = useCallback(
    (hex: string) => {
      if (palette.selectedColourId) {
        dispatch({ type: 'UPDATE_COLOUR', colourId: palette.selectedColourId, hex });
      }
    },
    [dispatch, palette.selectedColourId],
  );

  return (
    <div className="bg-surface-base font-body flex h-screen">
      <PalettePanel
        palette={palette}
        dispatch={dispatch}
        hasImage={image !== null}
        onOpenExtract={() => {
          setActiveModal('extract');
        }}
        onOpenImport={() => {
          setActiveModal('import');
        }}
        onOpenExport={() => {
          setActiveModal('export');
        }}
      />
      <main className="flex flex-1">
        <ImageCanvas
          image={image}
          canPickColour={palette.selectedColourId !== null}
          onPickColour={handlePickColour}
          onLoadImage={loadImage}
          onOpenImagePicker={openImagePicker}
        />
      </main>
      {activeModal === 'extract' && image && (
        <ExtractColoursModal
          image={image}
          palette={palette}
          onExtract={(hexValues, mode) => {
            dispatch({
              type: mode === 'replace' ? 'REPLACE_COLOURS' : 'ADD_COLOURS',
              hexValues,
            });
            setActiveModal('none');
          }}
          onClose={() => {
            setActiveModal('none');
          }}
        />
      )}
      {activeModal === 'import' && (
        <ImportModal
          onImport={(imported) => {
            dispatch({ type: 'IMPORT_PALETTE', palette: imported });
            setActiveModal('none');
          }}
          onClose={() => {
            setActiveModal('none');
          }}
        />
      )}
      {activeModal === 'export' && (
        <ExportModal
          palette={palette}
          onClose={() => {
            setActiveModal('none');
          }}
        />
      )}
    </div>
  );
}
