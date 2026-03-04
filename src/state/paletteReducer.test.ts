import { produce } from 'immer';
import { paletteReducer, type PaletteAction } from './paletteReducer';
import { type Palette, type PaletteColour } from '../types';

function createTestPalette(overrides?: Partial<Palette>): Palette {
  const colours: PaletteColour[] = [
    { id: 'colour-1', hex: '#FF0000' },
    { id: 'colour-2', hex: '#00FF00' },
    { id: 'colour-3', hex: '#0000FF' },
  ];
  return {
    name: '',
    type: 'regular',
    colours,
    selectedColourId: 'colour-1',
    ...overrides,
  };
}

function runReducer(state: Palette, action: PaletteAction): Palette {
  return produce(state, (draft) => {
    paletteReducer(draft, action);
  });
}

describe('paletteReducer', () => {
  describe('SET_NAME', () => {
    it('updates the palette name', () => {
      const state = createTestPalette({ name: '' });
      const result = runReducer(state, { type: 'SET_NAME', name: 'Brand Colours' });

      expect(result.name).toBe('Brand Colours');
    });

    it('clears the name when set to empty string', () => {
      const state = createTestPalette({ name: 'Old Name' });
      const result = runReducer(state, { type: 'SET_NAME', name: '' });

      expect(result.name).toBe('');
    });

    it('does not modify colours or selection', () => {
      const state = createTestPalette({
        colours: [{ id: 'c1', hex: '#FF0000' }],
        selectedColourId: 'c1',
      });
      const result = runReducer(state, { type: 'SET_NAME', name: 'New' });

      expect(result.colours).toEqual(state.colours);
      expect(result.selectedColourId).toBe('c1');
    });
  });

  describe('SET_TYPE', () => {
    it('changes the palette type', () => {
      const state = createTestPalette({ type: 'regular' });
      const result = runReducer(state, { type: 'SET_TYPE', paletteType: 'ordered-sequential' });

      expect(result.type).toBe('ordered-sequential');
    });

    it('does not modify colours or name', () => {
      const state = createTestPalette({
        name: 'Test',
        colours: [{ id: 'c1', hex: '#FF0000' }],
      });
      const result = runReducer(state, { type: 'SET_TYPE', paletteType: 'ordered-diverging' });

      expect(result.name).toBe('Test');
      expect(result.colours).toEqual(state.colours);
    });
  });

  describe('SELECT_COLOUR', () => {
    it('selects the specified colour', () => {
      const state = createTestPalette({
        colours: [
          { id: 'c1', hex: '#FF0000' },
          { id: 'c2', hex: '#00FF00' },
        ],
        selectedColourId: 'c1',
      });
      const result = runReducer(state, { type: 'SELECT_COLOUR', colourId: 'c2' });

      expect(result.selectedColourId).toBe('c2');
    });

    it('does nothing when colourId does not exist', () => {
      const state = createTestPalette({ selectedColourId: 'colour-1' });
      const result = runReducer(state, { type: 'SELECT_COLOUR', colourId: 'nonexistent' });

      expect(result.selectedColourId).toBe('colour-1');
    });
  });

  describe('SELECT_NEXT_COLOUR', () => {
    it('moves selection to the next colour', () => {
      const state = createTestPalette({
        colours: [
          { id: 'c1', hex: '#FF0000' },
          { id: 'c2', hex: '#00FF00' },
          { id: 'c3', hex: '#0000FF' },
        ],
        selectedColourId: 'c1',
      });
      const result = runReducer(state, { type: 'SELECT_NEXT_COLOUR' });

      expect(result.selectedColourId).toBe('c2');
    });

    it('does not move past the last colour', () => {
      const state = createTestPalette({
        colours: [
          { id: 'c1', hex: '#FF0000' },
          { id: 'c2', hex: '#00FF00' },
        ],
        selectedColourId: 'c2',
      });
      const result = runReducer(state, { type: 'SELECT_NEXT_COLOUR' });

      expect(result.selectedColourId).toBe('c2');
    });

    it('does nothing when palette is empty', () => {
      const state = createTestPalette({ colours: [], selectedColourId: null });
      const result = runReducer(state, { type: 'SELECT_NEXT_COLOUR' });

      expect(result.selectedColourId).toBeNull();
    });
  });

  describe('SELECT_PREVIOUS_COLOUR', () => {
    it('moves selection to the previous colour', () => {
      const state = createTestPalette({
        colours: [
          { id: 'c1', hex: '#FF0000' },
          { id: 'c2', hex: '#00FF00' },
          { id: 'c3', hex: '#0000FF' },
        ],
        selectedColourId: 'c3',
      });
      const result = runReducer(state, { type: 'SELECT_PREVIOUS_COLOUR' });

      expect(result.selectedColourId).toBe('c2');
    });

    it('does not move before the first colour', () => {
      const state = createTestPalette({
        colours: [
          { id: 'c1', hex: '#FF0000' },
          { id: 'c2', hex: '#00FF00' },
        ],
        selectedColourId: 'c1',
      });
      const result = runReducer(state, { type: 'SELECT_PREVIOUS_COLOUR' });

      expect(result.selectedColourId).toBe('c1');
    });
  });

  describe('ADD_COLOUR', () => {
    it('appends a white colour to the end and selects it', () => {
      const state = createTestPalette({
        colours: [
          { id: 'c1', hex: '#FF0000' },
          { id: 'c2', hex: '#00FF00' },
        ],
        selectedColourId: 'c1',
      });
      const result = runReducer(state, { type: 'ADD_COLOUR' });

      expect(result.colours).toHaveLength(3);
      expect(result.colours[0]).toEqual({ id: 'c1', hex: '#FF0000' });
      expect(result.colours[1]).toEqual({ id: 'c2', hex: '#00FF00' });
      expect(result.colours[2]?.hex).toBe('#FFFFFF');
      expect(result.colours[2]?.id).toBeDefined();
      expect(result.selectedColourId).toBe(result.colours[2]?.id);
    });

    it('appends a colour with the specified hex value', () => {
      const state = createTestPalette({
        colours: [{ id: 'c1', hex: '#FF0000' }],
      });
      const result = runReducer(state, { type: 'ADD_COLOUR', hex: '#ABCDEF' });

      expect(result.colours).toHaveLength(2);
      expect(result.colours[1]?.hex).toBe('#ABCDEF');
    });

    it('does not add when palette already has 20 colours', () => {
      const colours = Array.from({ length: 20 }, (_, i) => ({
        id: `c-${String(i)}`,
        hex: `#${String(i).padStart(6, '0')}`,
      }));
      const state = createTestPalette({ colours, selectedColourId: 'c-0' });
      const result = runReducer(state, { type: 'ADD_COLOUR' });

      expect(result.colours).toHaveLength(20);
      expect(result).toEqual(state);
    });

    it('does not modify name, type, or existing colours', () => {
      const state = createTestPalette({
        name: 'My Palette',
        type: 'ordered-sequential',
        colours: [{ id: 'c1', hex: '#112233' }],
      });
      const result = runReducer(state, { type: 'ADD_COLOUR' });

      expect(result.name).toBe('My Palette');
      expect(result.type).toBe('ordered-sequential');
      expect(result.colours[0]).toEqual({ id: 'c1', hex: '#112233' });
    });
  });

  describe('REMOVE_COLOUR', () => {
    it('removes the specified colour and preserves others in order', () => {
      const state = createTestPalette({
        colours: [
          { id: 'c1', hex: '#FF0000' },
          { id: 'c2', hex: '#00FF00' },
          { id: 'c3', hex: '#0000FF' },
        ],
        selectedColourId: 'c1',
      });
      const result = runReducer(state, { type: 'REMOVE_COLOUR', colourId: 'c2' });

      expect(result.colours).toEqual([
        { id: 'c1', hex: '#FF0000' },
        { id: 'c3', hex: '#0000FF' },
      ]);
      expect(result.selectedColourId).toBe('c1');
    });

    it('selects the next colour when the selected colour is removed from the middle', () => {
      const state = createTestPalette({
        colours: [
          { id: 'c1', hex: '#FF0000' },
          { id: 'c2', hex: '#00FF00' },
          { id: 'c3', hex: '#0000FF' },
          { id: 'c4', hex: '#FFFF00' },
        ],
        selectedColourId: 'c2',
      });
      const result = runReducer(state, { type: 'REMOVE_COLOUR', colourId: 'c2' });

      expect(result.selectedColourId).toBe('c3');
      expect(result.colours).toHaveLength(3);
    });

    it('selects the previous colour when the last colour in the list is removed', () => {
      const state = createTestPalette({
        colours: [
          { id: 'c1', hex: '#FF0000' },
          { id: 'c2', hex: '#00FF00' },
          { id: 'c3', hex: '#0000FF' },
        ],
        selectedColourId: 'c3',
      });
      const result = runReducer(state, { type: 'REMOVE_COLOUR', colourId: 'c3' });

      expect(result.selectedColourId).toBe('c2');
    });

    it('sets selectedColourId to null when the only colour is removed', () => {
      const state = createTestPalette({
        colours: [{ id: 'only', hex: '#FF0000' }],
        selectedColourId: 'only',
      });
      const result = runReducer(state, { type: 'REMOVE_COLOUR', colourId: 'only' });

      expect(result.colours).toHaveLength(0);
      expect(result.selectedColourId).toBeNull();
    });

    it('returns unchanged state when colourId does not exist', () => {
      const state = createTestPalette();
      const result = runReducer(state, { type: 'REMOVE_COLOUR', colourId: 'nonexistent' });

      expect(result).toEqual(state);
    });
  });

  describe('CLEAR_ALL_COLOURS', () => {
    it('removes all colours and clears selection', () => {
      const state = createTestPalette({
        colours: [
          { id: 'c1', hex: '#FF0000' },
          { id: 'c2', hex: '#00FF00' },
        ],
        selectedColourId: 'c1',
      });
      const result = runReducer(state, { type: 'CLEAR_ALL_COLOURS' });

      expect(result.colours).toHaveLength(0);
      expect(result.selectedColourId).toBeNull();
    });

    it('preserves name and type', () => {
      const state = createTestPalette({
        name: 'Keep Me',
        type: 'ordered-diverging',
        colours: [{ id: 'c1', hex: '#FF0000' }],
      });
      const result = runReducer(state, { type: 'CLEAR_ALL_COLOURS' });

      expect(result.name).toBe('Keep Me');
      expect(result.type).toBe('ordered-diverging');
    });
  });

  describe('UPDATE_COLOUR', () => {
    it('updates the hex value of the specified colour', () => {
      const state = createTestPalette({
        colours: [
          { id: 'c1', hex: '#FF0000' },
          { id: 'c2', hex: '#00FF00' },
        ],
      });
      const result = runReducer(state, {
        type: 'UPDATE_COLOUR',
        colourId: 'c1',
        hex: '#ABCDEF',
      });

      expect(result.colours[0]).toEqual({ id: 'c1', hex: '#ABCDEF' });
      expect(result.colours[1]).toEqual({ id: 'c2', hex: '#00FF00' });
    });

    it('does nothing when colourId does not exist', () => {
      const state = createTestPalette({
        colours: [{ id: 'c1', hex: '#FF0000' }],
      });
      const result = runReducer(state, {
        type: 'UPDATE_COLOUR',
        colourId: 'nonexistent',
        hex: '#000000',
      });

      expect(result).toEqual(state);
    });
  });

  describe('MOVE_COLOUR', () => {
    it('moves a colour forward in the list', () => {
      const state = createTestPalette({
        colours: [
          { id: 'c1', hex: '#FF0000' },
          { id: 'c2', hex: '#00FF00' },
          { id: 'c3', hex: '#0000FF' },
        ],
        selectedColourId: 'c1',
      });
      const result = runReducer(state, { type: 'MOVE_COLOUR', fromIndex: 0, toIndex: 2 });

      expect(result.colours.map((c) => c.id)).toEqual(['c2', 'c3', 'c1']);
      expect(result.selectedColourId).toBe('c1');
    });

    it('moves a colour backward in the list', () => {
      const state = createTestPalette({
        colours: [
          { id: 'c1', hex: '#FF0000' },
          { id: 'c2', hex: '#00FF00' },
          { id: 'c3', hex: '#0000FF' },
        ],
        selectedColourId: 'c3',
      });
      const result = runReducer(state, { type: 'MOVE_COLOUR', fromIndex: 2, toIndex: 0 });

      expect(result.colours.map((c) => c.id)).toEqual(['c3', 'c1', 'c2']);
    });

    it('does nothing when from and to are the same', () => {
      const state = createTestPalette();
      const result = runReducer(state, { type: 'MOVE_COLOUR', fromIndex: 1, toIndex: 1 });

      expect(result).toEqual(state);
    });

    it('does nothing when fromIndex is out of bounds', () => {
      const state = createTestPalette({
        colours: [{ id: 'c1', hex: '#FF0000' }],
      });
      const result = runReducer(state, { type: 'MOVE_COLOUR', fromIndex: 5, toIndex: 0 });

      expect(result).toEqual(state);
    });

    it('does nothing when toIndex is out of bounds', () => {
      const state = createTestPalette({
        colours: [{ id: 'c1', hex: '#FF0000' }],
      });
      const result = runReducer(state, { type: 'MOVE_COLOUR', fromIndex: 0, toIndex: 5 });

      expect(result).toEqual(state);
    });
  });

  describe('REVERSE_COLOUR_ORDER', () => {
    it('reverses the colour order', () => {
      const state = createTestPalette({
        colours: [
          { id: 'c1', hex: '#FF0000' },
          { id: 'c2', hex: '#00FF00' },
          { id: 'c3', hex: '#0000FF' },
        ],
        selectedColourId: 'c1',
      });
      const result = runReducer(state, { type: 'REVERSE_COLOUR_ORDER' });

      expect(result.colours.map((c) => c.id)).toEqual(['c3', 'c2', 'c1']);
      expect(result.selectedColourId).toBe('c1');
    });

    it('is a no-op for a single colour', () => {
      const state = createTestPalette({
        colours: [{ id: 'c1', hex: '#FF0000' }],
      });
      const result = runReducer(state, { type: 'REVERSE_COLOUR_ORDER' });

      expect(result.colours).toEqual([{ id: 'c1', hex: '#FF0000' }]);
    });
  });

  describe('IMPORT_PALETTE', () => {
    it('replaces the entire palette state', () => {
      const state = createTestPalette({
        name: 'Old',
        type: 'regular',
        colours: [{ id: 'old-1', hex: '#000000' }],
        selectedColourId: 'old-1',
      });
      const imported: Palette = {
        name: 'New Palette',
        type: 'ordered-diverging',
        colours: [
          { id: 'new-1', hex: '#AABBCC' },
          { id: 'new-2', hex: '#DDEEFF' },
        ],
        selectedColourId: 'new-1',
      };
      const result = runReducer(state, { type: 'IMPORT_PALETTE', palette: imported });

      expect(result).toEqual(imported);
    });
  });

  describe('ADD_COLOURS', () => {
    it('appends extracted colours to the existing palette', () => {
      const state = createTestPalette({
        colours: [{ id: 'c1', hex: '#FF0000' }],
        selectedColourId: 'c1',
      });
      const result = runReducer(state, {
        type: 'ADD_COLOURS',
        hexValues: ['#00FF00', '#0000FF'],
      });

      expect(result.colours).toHaveLength(3);
      expect(result.colours[0]).toEqual({ id: 'c1', hex: '#FF0000' });
      expect(result.colours[1]?.hex).toBe('#00FF00');
      expect(result.colours[2]?.hex).toBe('#0000FF');
    });

    it('selects the last added colour', () => {
      const state = createTestPalette({
        colours: [{ id: 'c1', hex: '#FF0000' }],
        selectedColourId: 'c1',
      });
      const result = runReducer(state, {
        type: 'ADD_COLOURS',
        hexValues: ['#00FF00', '#0000FF'],
      });

      expect(result.selectedColourId).toBe(result.colours[2]?.id);
    });

    it('caps at 20 total colours', () => {
      const colours = Array.from({ length: 18 }, (_, i) => ({
        id: `c-${String(i)}`,
        hex: '#000000',
      }));
      const state = createTestPalette({ colours, selectedColourId: 'c-0' });
      const result = runReducer(state, {
        type: 'ADD_COLOURS',
        hexValues: ['#AA0000', '#BB0000', '#CC0000', '#DD0000', '#EE0000'],
      });

      expect(result.colours).toHaveLength(20);
      // Only the first 2 of the 5 extracted colours should be added
      expect(result.colours[18]?.hex).toBe('#AA0000');
      expect(result.colours[19]?.hex).toBe('#BB0000');
    });

    it('does nothing when palette is already at max', () => {
      const colours = Array.from({ length: 20 }, (_, i) => ({
        id: `c-${String(i)}`,
        hex: '#000000',
      }));
      const state = createTestPalette({ colours, selectedColourId: 'c-0' });
      const result = runReducer(state, {
        type: 'ADD_COLOURS',
        hexValues: ['#FF0000'],
      });

      expect(result.colours).toHaveLength(20);
      expect(result.selectedColourId).toBe('c-0');
    });
  });

  describe('REPLACE_COLOURS', () => {
    it('replaces all colours with extracted ones', () => {
      const state = createTestPalette({
        colours: [
          { id: 'old-1', hex: '#000000' },
          { id: 'old-2', hex: '#111111' },
        ],
        selectedColourId: 'old-1',
      });
      const result = runReducer(state, {
        type: 'REPLACE_COLOURS',
        hexValues: ['#FF0000', '#00FF00', '#0000FF'],
      });

      expect(result.colours).toHaveLength(3);
      expect(result.colours[0]?.hex).toBe('#FF0000');
      expect(result.colours[1]?.hex).toBe('#00FF00');
      expect(result.colours[2]?.hex).toBe('#0000FF');
      expect(result.selectedColourId).toBe(result.colours[0]?.id);
    });

    it('caps at 20 colours', () => {
      const state = createTestPalette();
      const hexValues = Array.from({ length: 25 }, (_, i) => `#${String(i).padStart(6, '0')}`);
      const result = runReducer(state, {
        type: 'REPLACE_COLOURS',
        hexValues,
      });

      expect(result.colours).toHaveLength(20);
    });

    it('preserves name and type', () => {
      const state = createTestPalette({
        name: 'Keep Me',
        type: 'ordered-sequential',
      });
      const result = runReducer(state, {
        type: 'REPLACE_COLOURS',
        hexValues: ['#FF0000'],
      });

      expect(result.name).toBe('Keep Me');
      expect(result.type).toBe('ordered-sequential');
    });

    it('sets selectedColourId to null when given empty array', () => {
      const state = createTestPalette();
      const result = runReducer(state, {
        type: 'REPLACE_COLOURS',
        hexValues: [],
      });

      expect(result.colours).toHaveLength(0);
      expect(result.selectedColourId).toBeNull();
    });
  });
});
