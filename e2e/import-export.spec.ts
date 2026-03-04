import { test, expect } from './fixtures';

test.describe('import and export', () => {
  test('imports palette XML replacing the current palette', async ({
    palettePage,
  }) => {
    await palettePage.setupPalette({ name: 'Old', colours: ['#000000'] });

    const xml = [
      '<color-palette name="Branded" type="ordered-sequential">',
      '    <color>#1A2B3C</color>',
      '    <color>#4D5E6F</color>',
      '    <color>#7A8B9C</color>',
      '</color-palette>',
    ].join('\n');

    await palettePage.openImportModal();
    await palettePage.importModal.fillAndImport(xml);

    await palettePage.importModal.expectClosed();
    await palettePage.expectColours(['#1A2B3C', '#4D5E6F', '#7A8B9C']);
    await expect(palettePage.nameInput).toHaveValue('Branded');
    await palettePage.expectType('sequential');
  });

  test('exported XML matches expected format', async ({ palettePage }) => {
    await palettePage.setupPalette({
      name: 'My Palette',
      type: 'ordered-diverging',
      colours: ['#FF0000', '#00FF00'],
    });

    await palettePage.openExportModal();
    const xml = await palettePage.exportModal.getXml();

    expect(xml).toBe(
      '<color-palette name="My Palette" type="ordered-diverging">\n' +
        '    <color>#FF0000</color>\n' +
        '    <color>#00FF00</color>\n' +
        '</color-palette>',
    );
  });

  test('exported XML roundtrips back through import', async ({
    palettePage,
  }) => {
    await palettePage.setupPalette({
      name: 'Roundtrip',
      type: 'ordered-diverging',
      colours: ['#AA1122', '#33BB44'],
    });

    await palettePage.openExportModal();
    const exportedXml = await palettePage.exportModal.getXml();
    await palettePage.exportModal.close();

    // Clear and re-import
    await palettePage.setupPalette({ colours: ['#000000'] });
    await palettePage.openImportModal();
    await palettePage.importModal.fillAndImport(exportedXml);

    await expect(palettePage.nameInput).toHaveValue('Roundtrip');
    await palettePage.expectType('diverging');
    await palettePage.expectColours(['#AA1122', '#33BB44']);
  });

  test('shows validation error for invalid XML', async ({ palettePage }) => {
    await palettePage.openImportModal();
    await palettePage.importModal.textarea.fill('not xml at all');

    await expect(palettePage.importModal.errorMessage).toBeVisible();
    await expect(palettePage.importModal.importButton).toBeDisabled();
  });

  test('clears validation error when XML is corrected', async ({
    palettePage,
  }) => {
    await palettePage.openImportModal();
    await palettePage.importModal.textarea.fill('not xml');
    await expect(palettePage.importModal.importButton).toBeDisabled();

    await palettePage.importModal.textarea.fill(
      '<color-palette type="regular"><color>#FF0000</color></color-palette>',
    );

    await expect(palettePage.importModal.errorMessage).not.toBeVisible();
    await expect(palettePage.importModal.importButton).toBeEnabled();
  });

  test('closes import modal via escape', async ({ palettePage, page }) => {
    await palettePage.openImportModal();
    await page.keyboard.press('Escape');
    await palettePage.importModal.expectClosed();
  });

  test('closes import modal via cancel button', async ({ palettePage }) => {
    await palettePage.openImportModal();
    await palettePage.importModal.cancelButton.click();
    await palettePage.importModal.expectClosed();
  });

  test('closes export modal via escape', async ({ palettePage, page }) => {
    await palettePage.openExportModal();
    await page.keyboard.press('Escape');
    await palettePage.exportModal.expectClosed();
  });

  test('closes export modal via close button', async ({ palettePage }) => {
    await palettePage.openExportModal();
    await palettePage.exportModal.closeButton.click();
    await palettePage.exportModal.expectClosed();
  });
});
