import { useCallback, useMemo } from 'react';
import { useImmerReducer } from 'use-immer';
import { createDefaultPalette } from './types';
import { paletteReducer } from './state/paletteReducer';
import { PalettePanel } from './components/PalettePanel/PalettePanel';
import { ImageCanvas } from './components/ImageCanvas/ImageCanvas';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useImageLoader } from './hooks/useImageLoader';

export function App() {
  const [palette, dispatch] = useImmerReducer(paletteReducer, undefined, createDefaultPalette);
  const { image, loadImage, openImagePicker } = useImageLoader();

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
    <div className="flex h-screen bg-white">
      <PalettePanel
        palette={palette}
        dispatch={dispatch}
        hasImage={image !== null}
        onOpenExtract={() => {
          // Phase 7
        }}
        onOpenImport={() => {
          // Phase 6
        }}
        onOpenExport={() => {
          // Phase 6
        }}
        onDoubleClickColour={() => {
          // Phase 4
        }}
      />
      <ImageCanvas
        image={image}
        canPickColour={palette.selectedColourId !== null}
        onPickColour={handlePickColour}
        onLoadImage={loadImage}
        onOpenImagePicker={openImagePicker}
      />
    </div>
  );
}
