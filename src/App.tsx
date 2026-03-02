import { useMemo } from 'react';
import { useImmerReducer } from 'use-immer';
import { createDefaultPalette } from './types';
import { paletteReducer } from './state/paletteReducer';
import { PalettePanel } from './components/PalettePanel/PalettePanel';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export function App() {
  const [palette, dispatch] = useImmerReducer(paletteReducer, undefined, createDefaultPalette);

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

  return (
    <div className="flex h-screen bg-white">
      <PalettePanel
        palette={palette}
        dispatch={dispatch}
        hasImage={false}
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
      <main className="flex flex-1 items-center justify-center bg-gray-100">
        <p className="text-gray-400">Image canvas will go here</p>
      </main>
    </div>
  );
}
