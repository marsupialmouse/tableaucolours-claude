import { useRef, useState, useCallback } from 'react';
import { computeInitialZoom } from '../../utils/image';
import { useCanvasInteraction } from '../../hooks/useCanvasInteraction';
import { ZoomControls } from '../ZoomControls/ZoomControls';

interface ImageCanvasProps {
  image: HTMLImageElement | null;
  canPickColour: boolean;
  onPickColour: (hex: string) => void;
  onLoadImage: (file: File) => void;
  onOpenImagePicker: () => void;
}

interface HoverState {
  hex: string;
  x: number;
  y: number;
}

export function ImageCanvas({
  image,
  canPickColour,
  onPickColour,
  onLoadImage,
  onOpenImagePicker,
}: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [hover, setHover] = useState<HoverState | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const handlePickColour = useCallback(
    (hex: string) => {
      if (canPickColour) {
        onPickColour(hex);
      }
    },
    [canPickColour, onPickColour],
  );

  const handleHoverColour = useCallback(
    (hex: string | null, position: { x: number; y: number } | null) => {
      if (hex && position) {
        setHover({ hex, x: position.x, y: position.y });
      } else {
        setHover(null);
      }
    },
    [],
  );

  useCanvasInteraction({
    canvasRef,
    image,
    zoom,
    onZoomChange: handleZoomChange,
    onPickColour: handlePickColour,
    onHoverColour: handleHoverColour,
  });

  // Update zoom when a new image is loaded
  const prevImageRef = useRef<HTMLImageElement | null>(null);
  if (image && image !== prevImageRef.current) {
    prevImageRef.current = image;
    const container = containerRef.current;
    if (container) {
      const newZoom = computeInitialZoom(
        image.naturalWidth,
        image.naturalHeight,
        container.clientWidth,
        container.clientHeight,
      );
      setZoom(newZoom);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onLoadImage(file);
    }
  }

  if (!image) {
    return (
      <div
        className={`flex flex-1 flex-col items-center justify-center gap-3 ${
          isDragOver ? 'bg-blue-50' : 'bg-gray-100'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-testid="image-drop-zone"
      >
        <svg className="h-12 w-12 text-gray-300" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="6" width="36" height="36" rx="4" />
          <circle cx="18" cy="18" r="4" />
          <path d="M6 34l10-10 8 8 6-6 12 12" />
        </svg>
        <p className="text-sm text-gray-400">
          Drop an image here, paste from clipboard, or{' '}
          <button
            type="button"
            className="cursor-pointer text-blue-500 underline hover:text-blue-600"
            onClick={onOpenImagePicker}
          >
            browse
          </button>
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-1 flex-col bg-gray-100"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="relative flex-1 overflow-hidden">
        <canvas
          ref={canvasRef}
          className={canPickColour ? 'cursor-crosshair' : 'cursor-default'}
          data-testid="image-canvas"
        />

        {!canPickColour && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 rounded-lg bg-black/70 px-4 py-2 text-sm text-white">
            Select a swatch to pick colours from the image
          </div>
        )}

        {hover && canPickColour && (
          <div
            className="pointer-events-none absolute z-10 flex items-center gap-1.5 rounded bg-black/75 px-2 py-1"
            style={{ left: hover.x + 16, top: hover.y + 16 }}
          >
            <div
              className="h-4 w-4 rounded-sm border border-white/40"
              style={{ backgroundColor: hover.hex }}
            />
            <span className="font-mono text-xs text-white">{hover.hex}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end border-t border-gray-200 bg-gray-50 px-3 py-1.5">
        <ZoomControls zoom={zoom} onZoomChange={handleZoomChange} />

        <div className="ml-2 border-l border-gray-300 pl-2">
          <button
            type="button"
            onClick={onOpenImagePicker}
            aria-label="Open image"
            title="Open image"
            className="flex h-7 w-7 items-center justify-center rounded text-gray-500 hover:bg-gray-200 hover:text-gray-700"
          >
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
              <circle cx="5.5" cy="6" r="1.5" />
              <path d="M1.5 11l3.5-3.5 3 3 2-2 4.5 4.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
