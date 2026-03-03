import { useEffect, useRef, useCallback } from 'react';
import { rgbToHex } from '../utils/colour';
import { MIN_ZOOM, MAX_ZOOM } from '../utils/image';

interface UseCanvasInteractionOptions {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  image: HTMLImageElement | null;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onPickColour: (hex: string) => void;
  onHoverColour: (hex: string | null, position: { x: number; y: number } | null) => void;
}

export function useCanvasInteraction({
  canvasRef,
  image,
  zoom,
  onZoomChange,
  onPickColour,
  onHoverColour,
}: UseCanvasInteractionOptions) {
  const animFrameRef = useRef<number>(0);

  // Draw image to canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaledW = image.naturalWidth * zoom;
    const scaledH = image.naturalHeight * zoom;
    const x = (canvas.width - scaledW) / 2;
    const y = (canvas.height - scaledH) / 2;

    ctx.imageSmoothingEnabled = zoom < 1;
    ctx.drawImage(image, x, y, scaledW, scaledH);
  }, [canvasRef, image, zoom]);

  // Redraw on image/zoom changes and on resize
  useEffect(() => {
    draw();

    function handleResize() {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [draw]);

  // Get the colour at a canvas pixel position
  const getColourAtPoint = useCallback(
    (clientX: number, clientY: number): string | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;

      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const pixel = ctx.getImageData(x, y, 1, 1).data;
      // Check if the pixel is transparent (outside the image)
      if (pixel[3] === 0) return null;

      return rgbToHex({ r: pixel[0]!, g: pixel[1]!, b: pixel[2]! });
    },
    [canvasRef],
  );

  // Mouse move: show colour preview under cursor
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    function handleMouseMove(e: MouseEvent) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const hex = getColourAtPoint(e.clientX, e.clientY);
      const rect = canvas.getBoundingClientRect();
      onHoverColour(hex, { x: e.clientX - rect.left, y: e.clientY - rect.top });
    }

    function handleMouseLeave() {
      onHoverColour(null, null);
    }

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [canvasRef, image, getColourAtPoint, onHoverColour]);

  // Click: pick colour
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;

    function handleClick(e: MouseEvent) {
      const hex = getColourAtPoint(e.clientX, e.clientY);
      if (hex) {
        onPickColour(hex);
      }
    }

    canvas.addEventListener('click', handleClick);
    return () => {
      canvas.removeEventListener('click', handleClick);
    };
  }, [canvasRef, image, getColourAtPoint, onPickColour]);

  // Shift+wheel: zoom
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function handleWheel(e: WheelEvent) {
      if (!e.shiftKey) return;
      e.preventDefault();

      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom + delta));
      onZoomChange(Math.round(newZoom * 100) / 100);
    }

    canvas.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [canvasRef, zoom, onZoomChange]);
}
