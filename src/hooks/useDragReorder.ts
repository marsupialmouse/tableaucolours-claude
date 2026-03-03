import { useRef, useCallback } from 'react';

interface UseDragReorderOptions {
  onMove: (fromIndex: number, toIndex: number) => void;
}

export function useDragReorder({ onMove }: UseDragReorderOptions) {
  const fromIndexRef = useRef<number | null>(null);

  const getDragHandlers = useCallback(
    (index: number): Record<string, unknown> => ({
      draggable: true,
      onDragStart: (e: React.DragEvent) => {
        fromIndexRef.current = index;
        e.dataTransfer.effectAllowed = 'move';
      },
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        const from = fromIndexRef.current;
        if (from !== null && from !== index) {
          onMove(from, index);
        }
        fromIndexRef.current = null;
      },
      onDragEnd: () => {
        fromIndexRef.current = null;
      },
    }),
    [onMove],
  );

  return { getDragHandlers };
}
