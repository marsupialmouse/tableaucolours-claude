import { useRef, useEffect, useCallback } from 'react';

interface HueSliderProps {
  hue: number;
  onChange: (hue: number) => void;
}

const SLIDER_WIDTH = 200;
const SLIDER_HEIGHT = 16;

function drawHueSpectrum(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, SLIDER_WIDTH, 0);
  const stops = [
    [0, '#FF0000'],
    [1 / 6, '#FFFF00'],
    [2 / 6, '#00FF00'],
    [3 / 6, '#00FFFF'],
    [4 / 6, '#0000FF'],
    [5 / 6, '#FF00FF'],
    [1, '#FF0000'],
  ] as const;
  for (const [offset, colour] of stops) {
    gradient.addColorStop(offset, colour);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SLIDER_WIDTH, SLIDER_HEIGHT);
}

export function HueSlider({ hue, onChange }: HueSliderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      drawHueSpectrum(ctx);
    }
  }, []);

  const updateFromPointer = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const newHue = (x / rect.width) * 360;
      onChange(newHue);
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

  const indicatorX = (hue / 360) * SLIDER_WIDTH;

  return (
    <div className="relative" style={{ width: SLIDER_WIDTH, height: SLIDER_HEIGHT }}>
      <canvas
        ref={canvasRef}
        width={SLIDER_WIDTH}
        height={SLIDER_HEIGHT}
        className="cursor-crosshair rounded-sm"
        aria-label="Hue"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      />
      <div
        className="pointer-events-none absolute top-0 h-full w-0.5 -translate-x-1/2 bg-white"
        style={{ left: indicatorX }}
      >
        <div className="absolute inset-0 border border-black/30" />
      </div>
    </div>
  );
}
