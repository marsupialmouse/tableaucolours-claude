import { type Draft } from 'immer';
import { type Palette, type PaletteColour, type PaletteType, MAX_COLOURS } from '../types';
import { canAddColours, availableColourSlots } from './paletteHelpers';

export type PaletteAction =
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_TYPE'; paletteType: PaletteType }
  | { type: 'SELECT_COLOUR'; colourId: string }
  | { type: 'SELECT_NEXT_COLOUR' }
  | { type: 'SELECT_PREVIOUS_COLOUR' }
  | { type: 'ADD_COLOUR'; hex?: string }
  | { type: 'REMOVE_COLOUR'; colourId: string }
  | { type: 'CLEAR_ALL_COLOURS' }
  | { type: 'UPDATE_COLOUR'; colourId: string; hex: string }
  | { type: 'MOVE_COLOUR'; fromIndex: number; toIndex: number }
  | { type: 'REVERSE_COLOUR_ORDER' }
  | { type: 'IMPORT_PALETTE'; palette: Palette }
  | { type: 'ADD_COLOURS'; hexValues: string[] }
  | { type: 'REPLACE_COLOURS'; hexValues: string[] };

function selectedIndex(draft: Draft<Palette>): number {
  return draft.colours.findIndex((c) => c.id === draft.selectedColourId);
}

function makeColour(hex: string): PaletteColour {
  return { id: crypto.randomUUID(), hex };
}

export function paletteReducer(draft: Draft<Palette>, action: PaletteAction): void {
  switch (action.type) {
    case 'SET_NAME': {
      draft.name = action.name;
      return;
    }
    case 'SET_TYPE': {
      draft.type = action.paletteType;
      return;
    }
    case 'SELECT_COLOUR': {
      if (draft.colours.some((c) => c.id === action.colourId)) {
        draft.selectedColourId = action.colourId;
      }
      return;
    }
    case 'SELECT_NEXT_COLOUR': {
      const idx = selectedIndex(draft);
      if (idx < draft.colours.length - 1) {
        const next = draft.colours[idx + 1];
        if (next) draft.selectedColourId = next.id;
      }
      return;
    }
    case 'SELECT_PREVIOUS_COLOUR': {
      const idx = selectedIndex(draft);
      if (idx > 0) {
        const prev = draft.colours[idx - 1];
        if (prev) draft.selectedColourId = prev.id;
      }
      return;
    }
    case 'ADD_COLOUR': {
      if (!canAddColours(draft)) return;
      const newColour = makeColour(action.hex ?? '#FFFFFF');
      draft.colours.push(newColour);
      draft.selectedColourId = newColour.id;
      return;
    }
    case 'REMOVE_COLOUR': {
      const idx = draft.colours.findIndex((c) => c.id === action.colourId);
      if (idx === -1) return;
      const wasSelected = draft.selectedColourId === action.colourId;
      draft.colours.splice(idx, 1);
      if (wasSelected) {
        const next = draft.colours[idx] ?? draft.colours[idx - 1];
        draft.selectedColourId = next?.id ?? null;
      }
      return;
    }
    case 'CLEAR_ALL_COLOURS': {
      draft.colours = [];
      draft.selectedColourId = null;
      return;
    }
    case 'UPDATE_COLOUR': {
      const colour = draft.colours.find((c) => c.id === action.colourId);
      if (colour) colour.hex = action.hex;
      return;
    }
    case 'MOVE_COLOUR': {
      const { fromIndex, toIndex } = action;
      if (
        fromIndex < 0 ||
        fromIndex >= draft.colours.length ||
        toIndex < 0 ||
        toIndex >= draft.colours.length ||
        fromIndex === toIndex
      ) {
        return;
      }
      const [moved] = draft.colours.splice(fromIndex, 1);
      if (moved) draft.colours.splice(toIndex, 0, moved);
      return;
    }
    case 'REVERSE_COLOUR_ORDER': {
      draft.colours.reverse();
      return;
    }
    case 'IMPORT_PALETTE': {
      draft.name = action.palette.name;
      draft.type = action.palette.type;
      draft.colours = action.palette.colours;
      draft.selectedColourId = action.palette.selectedColourId;
      return;
    }
    case 'ADD_COLOURS': {
      const toAdd = action.hexValues.slice(0, availableColourSlots(draft));
      for (const hex of toAdd) {
        draft.colours.push(makeColour(hex));
      }
      if (toAdd.length > 0 && draft.colours.length > 0) {
        const lastAdded = draft.colours[draft.colours.length - 1];
        if (lastAdded) draft.selectedColourId = lastAdded.id;
      }
      return;
    }
    case 'REPLACE_COLOURS': {
      const colours = action.hexValues.slice(0, MAX_COLOURS).map(makeColour);
      draft.colours = colours;
      draft.selectedColourId = colours[0]?.id ?? null;
      return;
    }
  }
}
