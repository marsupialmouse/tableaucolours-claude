import { MIN_ZOOM, MAX_ZOOM, clampZoom } from '../../utils/image';

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

// Two-segment linear mapping: slider position 0–50 maps to MIN_ZOOM–1, 50–100 maps to 1–MAX_ZOOM.
// This puts 100% zoom at the midpoint of the slider.
function zoomToSlider(zoom: number): number {
  if (zoom <= 1) {
    return ((zoom - MIN_ZOOM) / (1 - MIN_ZOOM)) * 50;
  }
  return 50 + ((zoom - 1) / (MAX_ZOOM - 1)) * 50;
}

function sliderToZoom(value: number): number {
  if (value <= 50) {
    return MIN_ZOOM + (value / 50) * (1 - MIN_ZOOM);
  }
  return 1 + ((value - 50) / 50) * (MAX_ZOOM - 1);
}

export function ZoomControls({ zoom, onZoomChange }: ZoomControlsProps) {
  const percentage = Math.round(zoom * 100);

  function stepZoom(delta: number) {
    onZoomChange(clampZoom(zoom + delta));
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => {
          stepZoom(-0.1);
        }}
        disabled={zoom <= MIN_ZOOM}
        aria-label="Zoom out"
        className="flex h-7 w-7 items-center justify-center rounded text-gray-500 hover:bg-gray-200 hover:text-gray-700 disabled:opacity-50"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M3 8h10" />
        </svg>
      </button>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(zoomToSlider(zoom))}
        onChange={(e) => {
          onZoomChange(clampZoom(sliderToZoom(Number(e.target.value))));
        }}
        aria-label="Zoom level"
        className="zoom-slider w-40"
      />

      <button
        type="button"
        onClick={() => {
          stepZoom(0.1);
        }}
        disabled={zoom >= MAX_ZOOM}
        aria-label="Zoom in"
        className="flex h-7 w-7 items-center justify-center rounded text-gray-500 hover:bg-gray-200 hover:text-gray-700 disabled:opacity-50"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M8 3v10M3 8h10" />
        </svg>
      </button>

      <span className="w-10 text-center text-xs text-gray-500">{percentage}%</span>
    </div>
  );
}
