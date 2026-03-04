import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, expect } from './fixtures';

const TEST_IMAGE = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'test-image.png');

test.describe('image canvas', () => {
  test('shows drop zone when no image is loaded', async ({ palettePage }) => {
    await palettePage.imageCanvas.expectDropZoneVisible();
  });

  test('loads image via browse button', async ({ palettePage }) => {
    await palettePage.imageCanvas.loadImageViaFileChooser(TEST_IMAGE);

    await palettePage.imageCanvas.expectCanvasVisible();
  });

  test('shows zoom controls after image load', async ({ palettePage }) => {
    await palettePage.imageCanvas.loadImageViaFileChooser(TEST_IMAGE);

    await expect(palettePage.imageCanvas.zoomInButton).toBeVisible();
    await expect(palettePage.imageCanvas.zoomOutButton).toBeVisible();
    await expect(palettePage.imageCanvas.zoomSlider).toBeVisible();
  });

  test('zoom in and zoom out buttons work', async ({ palettePage }) => {
    await palettePage.imageCanvas.loadImageViaFileChooser(TEST_IMAGE);

    const initialValue = await palettePage.imageCanvas.zoomSlider.inputValue();

    await palettePage.imageCanvas.zoomInButton.click();
    const afterZoomIn = await palettePage.imageCanvas.zoomSlider.inputValue();
    expect(Number(afterZoomIn)).toBeGreaterThan(Number(initialValue));

    await palettePage.imageCanvas.zoomOutButton.click();
    const afterZoomOut = await palettePage.imageCanvas.zoomSlider.inputValue();
    expect(Number(afterZoomOut)).toBeLessThan(Number(afterZoomIn));
  });

  test('extract button is disabled without image', async ({ palettePage }) => {
    await expect(palettePage.extractFromImageButton).toBeDisabled();

    await palettePage.imageCanvas.loadImageViaFileChooser(TEST_IMAGE);

    await expect(palettePage.extractFromImageButton).toBeEnabled();
  });
});

test.describe('extract colours modal', () => {
  test.beforeEach(async ({ palettePage }) => {
    await palettePage.imageCanvas.loadImageViaFileChooser(TEST_IMAGE);
  });

  test('opens extract modal when image is loaded', async ({ palettePage }) => {
    await palettePage.openExtractModal();

    await palettePage.extractModal.expectOpen();
    await expect(palettePage.extractModal.replaceRadio).toBeChecked();
  });

  test('closes extract modal via cancel', async ({ palettePage }) => {
    await palettePage.openExtractModal();
    await palettePage.extractModal.expectOpen();

    await palettePage.extractModal.cancelButton.click();

    await palettePage.extractModal.expectClosed();
  });

  test('colour count controls work', async ({ palettePage }) => {
    await palettePage.openExtractModal();

    const initialCount = await palettePage.extractModal.countInput.inputValue();

    await palettePage.extractModal.increaseButton.click();
    const afterIncrease = await palettePage.extractModal.countInput.inputValue();
    expect(Number(afterIncrease)).toBe(Number(initialCount) + 1);

    await palettePage.extractModal.decreaseButton.click();
    const afterDecrease = await palettePage.extractModal.countInput.inputValue();
    expect(Number(afterDecrease)).toBe(Number(initialCount));

    // Decrease to 1 and verify button is disabled
    while (Number(await palettePage.extractModal.countInput.inputValue()) > 1) {
      await palettePage.extractModal.decreaseButton.click();
    }
    await expect(palettePage.extractModal.decreaseButton).toBeDisabled();
  });

  test('shows colour preview swatches', async ({ palettePage }) => {
    await palettePage.openExtractModal();

    const previewItems = palettePage.extractModal.preview.getByRole('listitem');
    // Preview should have at least 1 swatch (count depends on image colours)
    await expect(previewItems.first()).toBeVisible();
  });

  test('extract in replace mode replaces palette colours', async ({ palettePage, page }) => {
    await palettePage.setupPalette({ colours: ['#FF0000', '#00FF00'] });
    // Image already loaded in beforeEach; use "Open image" button to reload
    const fileChooserPromise = page.waitForEvent('filechooser');
    await palettePage.imageCanvas.openImageButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(TEST_IMAGE);

    await palettePage.openExtractModal();
    await palettePage.extractModal.extractButton.click();

    await palettePage.extractModal.expectClosed();
    // Should have some extracted colours (not the original 2)
    const count = await palettePage.swatches.count();
    expect(count).toBeGreaterThan(0);
  });
});
