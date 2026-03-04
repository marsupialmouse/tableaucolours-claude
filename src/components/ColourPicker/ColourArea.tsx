import { useRef, useEffect, useCallback } from 'react';
import { hsvToRgb } from '../../utils/colour';

interface ColourAreaProps {
  hue: number;
  saturation: number;
  value: number;
  onChange: (saturation: number, value: number) => void;
}

const AREA_WIDTH = 200;
const AREA_HEIGHT = 150;

export function ColourArea({ hue, saturation, value, onChange }: ColourAreaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const { r, g, b } = hsvToRgb({ h: hue, s: 100, v: 100 });

    // White → pure hue (horizontal)
    const hGradient = ctx.createLinearGradient(0, 0, AREA_WIDTH, 0);
    hGradient.addColorStop(0, '#FFFFFF');
    hGradient.addColorStop(1, `rgb(${String(r)},${String(g)},${String(b)})`);
    ctx.fillStyle = hGradient;
    ctx.fillRect(0, 0, AREA_WIDTH, AREA_HEIGHT);

    // Transparent → black (vertical)
    const vGradient = ctx.createLinearGradient(0, 0, 0, AREA_HEIGHT);
    vGradient.addColorStop(0, 'rgba(0,0,0,0)');
    vGradient.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = vGradient;
    ctx.fillRect(0, 0, AREA_WIDTH, AREA_HEIGHT);
  }, [hue]);

  const updateFromPointer = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
      const newSaturation = (x / rect.width) * 100;
      const newValue = 100 - (y / rect.height) * 100;
      onChange(newSaturation, newValue);
    },
    [onChange],
  );

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updateFromPointer(e);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (e.buttons === 0) return;
    updateFromPointer(e);
  }

  const indicatorX = (saturation / 100) * AREA_WIDTH;
  const indicatorY = ((100 - value) / 100) * AREA_HEIGHT;

  return (
    <div className="relative" style={{ width: AREA_WIDTH, height: AREA_HEIGHT }}>
      <canvas
        ref={canvasRef}
        width={AREA_WIDTH}
        height={AREA_HEIGHT}
        className="cursor-crosshair rounded-sm"
        aria-label="Colour area"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      />
      <div
        className="pointer-events-none absolute h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-sm"
        style={{ left: indicatorX, top: indicatorY }}
      />
    </div>
  );
}
