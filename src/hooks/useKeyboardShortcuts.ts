import { useEffect } from 'react';

interface KeyboardShortcutHandlers {
  onAddColour: () => void;
  onDeleteColour: () => void;
  onSelectNext: () => void;
  onSelectPrevious: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.closest('[role="dialog"]')
      ) {
        return;
      }

      switch (e.key) {
        case '+':
        case '=':
          e.preventDefault();
          handlers.onAddColour();
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          handlers.onDeleteColour();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (e.shiftKey) {
            handlers.onMoveLeft();
          } else {
            handlers.onSelectPrevious();
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (e.shiftKey) {
            handlers.onMoveRight();
          } else {
            handlers.onSelectNext();
          }
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers]);
}
