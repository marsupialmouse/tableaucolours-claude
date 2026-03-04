const ALLOWED_IMAGE_TYPES = new Set(['image/gif', 'image/jpeg', 'image/png', 'image/webp']);

export const IMAGE_ACCEPT = [...ALLOWED_IMAGE_TYPES].join(',');

export function isAllowedImageType(file: File): boolean {
  return ALLOWED_IMAGE_TYPES.has(file.type);
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!isAllowedImageType(file)) {
      reject(new Error(`Unsupported image type: ${file.type}`));
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Compute the initial zoom level for an image.
 * Small images display at 100%; large images scale down to fit the canvas area.
 */
export function computeInitialZoom(
  imageW: number,
  imageH: number,
  canvasW: number,
  canvasH: number,
): number {
  if (imageW <= canvasW && imageH <= canvasH) {
    return 1;
  }
  return Math.min(canvasW / imageW, canvasH / imageH);
}

export const MIN_ZOOM = 0.1;
export const MAX_ZOOM = 5;

/** Clamp a zoom value to valid bounds and round to 2 decimal places. */
export function clampZoom(value: number): number {
  return Math.round(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value)) * 100) / 100;
}
