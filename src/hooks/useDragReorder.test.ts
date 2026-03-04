import { renderHook, act } from '@testing-library/react';
import { useDragReorder } from './useDragReorder';

describe('useDragReorder', () => {
  it('returns a getDragHandlers function', () => {
    const { result } = renderHook(() => useDragReorder({ onMove: vi.fn() }));
    expect(typeof result.current.getDragHandlers).toBe('function');
  });

  it('getDragHandlers returns an object with drag props', () => {
    const { result } = renderHook(() => useDragReorder({ onMove: vi.fn() }));
    const handlers = result.current.getDragHandlers(0);

    expect(handlers.draggable).toBe(true);
    expect(typeof handlers.onDragStart).toBe('function');
    expect(typeof handlers.onDragOver).toBe('function');
    expect(typeof handlers.onDrop).toBe('function');
    expect(typeof handlers.onDragEnd).toBe('function');
  });

  it('calls onMove when dragging from one index to another', () => {
    const onMove = vi.fn();
    const { result } = renderHook(() => useDragReorder({ onMove }));

    act(() => {
      const sourceHandlers = result.current.getDragHandlers(1);
      (sourceHandlers.onDragStart as (e: React.DragEvent) => void)({
        dataTransfer: { effectAllowed: '' },
      } as unknown as React.DragEvent);
    });

    act(() => {
      const targetHandlers = result.current.getDragHandlers(3);
      (targetHandlers.onDrop as (e: React.DragEvent) => void)({
        preventDefault: vi.fn(),
      } as unknown as React.DragEvent);
    });

    expect(onMove).toHaveBeenCalledWith(1, 3);
  });

  it('does not call onMove when dropping on the same index', () => {
    const onMove = vi.fn();
    const { result } = renderHook(() => useDragReorder({ onMove }));

    act(() => {
      const handlers = result.current.getDragHandlers(2);
      (handlers.onDragStart as (e: React.DragEvent) => void)({
        dataTransfer: { effectAllowed: '' },
      } as unknown as React.DragEvent);
    });

    act(() => {
      const handlers = result.current.getDragHandlers(2);
      (handlers.onDrop as (e: React.DragEvent) => void)({
        preventDefault: vi.fn(),
      } as unknown as React.DragEvent);
    });

    expect(onMove).not.toHaveBeenCalled();
  });
});
