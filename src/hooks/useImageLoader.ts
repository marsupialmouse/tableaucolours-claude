import { useState, useCallback, useEffect } from 'react';
import { isAllowedImageType, loadImageFromFile, IMAGE_ACCEPT } from '../utils/image';

interface UseImageLoaderResult {
  image: HTMLImageElement | null;
  error: string | null;
  loadImage: (file: File) => void;
  openImagePicker: () => void;
}

export function useImageLoader(): UseImageLoaderResult {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadImage = useCallback((file: File) => {
    if (!isAllowedImageType(file)) {
      setError('Unsupported file type. Use GIF, JPEG, PNG, or WebP.');
      return;
    }

    setError(null);
    loadImageFromFile(file)
      .then((img) => {
        setImage(img);
      })
      .catch(() => {
        setError('Failed to load image.');
      });
  }, []);

  const openImagePicker = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = IMAGE_ACCEPT;
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        loadImage(file);
      }
    };
    input.click();
  }, [loadImage]);

  // Handle paste events
  useEffect(() => {
    function handlePaste(e: ClipboardEvent) {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            loadImage(file);
            return;
          }
        }
      }
    }

    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [loadImage]);

  return { image, error, loadImage, openImagePicker };
}
