import { test, expect } from './fixtures';

test.describe('colour picker', () => {
  test('opens colour picker on swatch double-click', async ({ palettePage }) => {
    await palettePage.openColourPicker(0);

    await palettePage.colourPicker.expectOpen();
  });

  test('closes colour picker via Done button', async ({ palettePage }) => {
    await palettePage.openColourPicker(0);
    await palettePage.colourPicker.expectOpen();

    await palettePage.colourPicker.doneButton.click();

    await palettePage.colourPicker.expectClosed();
  });

  test('closes colour picker via Escape key', async ({ palettePage, page }) => {
    await palettePage.openColourPicker(0);
    await palettePage.colourPicker.expectOpen();

    await page.keyboard.press('Escape');

    await palettePage.colourPicker.expectClosed();
  });

  test('closes colour picker by clicking outside', async ({ palettePage, page }) => {
    await palettePage.openColourPicker(0);
    await palettePage.colourPicker.expectOpen();

    await page.locator('body').click({ position: { x: 0, y: 0 } });

    await palettePage.colourPicker.expectClosed();
  });

  test('changes colour via hex input', async ({ palettePage }) => {
    await palettePage.setupPalette({ colours: ['#FF0000'] });
    await palettePage.openColourPicker(0);

    await palettePage.colourPicker.setHex('00FF00');
    await palettePage.colourPicker.doneButton.click();

    await palettePage.expectColours(['#00FF00']);
  });

  test('changes colour via RGB inputs', async ({ palettePage }) => {
    await palettePage.setupPalette({ colours: ['#FF0000'] });
    await palettePage.openColourPicker(0);

    await palettePage.colourPicker.setRgb(0, 0, 255);
    await palettePage.colourPicker.doneButton.click();

    await palettePage.expectColours(['#0000FF']);
  });

  test('hex input rejects invalid values', async ({ palettePage }) => {
    await palettePage.setupPalette({ colours: ['#FF0000'] });
    await palettePage.openColourPicker(0);

    await palettePage.colourPicker.hexInput.fill('ZZZZZZ');
    await palettePage.colourPicker.hexInput.blur();

    // Original colour should be preserved
    await palettePage.colourPicker.doneButton.click();
    await palettePage.expectColours(['#FF0000']);
  });

  test('hex and RGB inputs stay synchronised', async ({ palettePage }) => {
    await palettePage.setupPalette({ colours: ['#000000'] });
    await palettePage.openColourPicker(0);

    await palettePage.colourPicker.setHex('336699');

    await expect(palettePage.colourPicker.rInput).toHaveValue('51');
    await expect(palettePage.colourPicker.gInput).toHaveValue('102');
    await expect(palettePage.colourPicker.bInput).toHaveValue('153');
  });

  test('colour change persists in export', async ({ palettePage }) => {
    await palettePage.setupPalette({
      name: 'Test',
      colours: ['#FF0000'],
    });
    await palettePage.openColourPicker(0);
    await palettePage.colourPicker.setHex('00FF00');
    await palettePage.colourPicker.doneButton.click();

    await palettePage.openExportModal();
    const xml = await palettePage.exportModal.getXml();

    expect(xml).toContain('#00FF00');
    expect(xml).not.toContain('#FF0000');
  });

  test('opening picker on a different swatch selects it', async ({ palettePage }) => {
    await palettePage.setupPalette({
      colours: ['#FF0000', '#00FF00', '#0000FF'],
    });
    await palettePage.swatch(0).click();
    await palettePage.expectSwatchSelected(0);

    await palettePage.openColourPicker(2);

    await palettePage.colourPicker.expectOpen();
    await palettePage.expectSwatchSelected(2);
  });
});
