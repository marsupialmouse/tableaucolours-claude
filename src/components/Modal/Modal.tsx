import { useEffect, useRef, type ReactNode } from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    const autofocusTarget = dialog.querySelector<HTMLElement>('[autofocus]');
    autofocusTarget?.focus();
    return () => {
      dialog.close();
    };
  }, []);

  function handleCancel(e: React.SyntheticEvent) {
    e.preventDefault();
    onClose();
  }

  function handleClick(e: React.MouseEvent<HTMLDialogElement>) {
    // Close when clicking the backdrop (the dialog element itself, not its children)
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      className="border-border-subtle shadow-elevated fixed top-1/2 left-1/2 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white p-6 backdrop:bg-black/50"
      onCancel={handleCancel}
      onClick={handleClick}
    >
      <div className="mb-4 flex items-start justify-between">
        <h2 className="font-heading text-text-primary text-lg font-semibold">{title}</h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-text-muted hover:bg-surface-overlay hover:text-text-secondary -mt-1 -mr-1 rounded p-1 transition-colors focus:outline-none"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>
      {children}
    </dialog>
  );
}
