import { test, expect } from './fixtures';

test.describe('palette editing', () => {
  test('starts with default state', async ({ palettePage }) => {
    await palettePage.expectColours(['#FFFFFF']);
    await palettePage.expectSwatchSelected(0);
    await palettePage.expectType('regular');
    await expect(palettePage.nameInput).toHaveValue('');
  });

  test('adds a new colour via button', async ({ palettePage }) => {
    await palettePage.setupPalette({ colours: ['#FF0000'] });

    await palettePage.addColourButton.click();

    await palettePage.expectColours(['#FF0000', '#FFFFFF']);
    await palettePage.expectSwatchSelected(1);
  });

  test('appends a new colour after import', async ({ palettePage, page }) => {
    await palettePage.setupPalette({ colours: ['#FF0000', '#00FF00'] });

    await page.keyboard.press('+');

    await palettePage.expectColours(['#FF0000', '#00FF00', '#FFFFFF']);
    await palettePage.expectSwatchSelected(2);
  });

  test('removes the selected colour and selects the next one', async ({ palettePage, page }) => {
    await palettePage.setupPalette({
      colours: ['#FF0000', '#00FF00', '#0000FF'],
    });
    await palettePage.swatch(1).click();

    await page.keyboard.press('Delete');

    await palettePage.expectColours(['#FF0000', '#0000FF']);
    await palettePage.expectSwatchSelected(1);
  });

  test('navigates colours with arrow keys', async ({ palettePage, page }) => {
    await palettePage.setupPalette({
      colours: ['#FF0000', '#00FF00', '#0000FF'],
    });
    await palettePage.expectSwatchSelected(0);

    await page.keyboard.press('ArrowRight');
    await palettePage.expectSwatchSelected(1);
    await palettePage.expectSwatchNotSelected(0);

    await page.keyboard.press('ArrowLeft');
    await palettePage.expectSwatchSelected(0);
  });

  test('changes palette type', async ({ palettePage }) => {
    await palettePage.setType('sequential');
    await palettePage.expectType('sequential');

    await palettePage.setType('diverging');
    await palettePage.expectType('diverging');

    await palettePage.setType('regular');
    await palettePage.expectType('regular');
  });

  test('edits palette name', async ({ palettePage }) => {
    await palettePage.nameInput.fill('My Custom Palette');
    await expect(palettePage.nameInput).toHaveValue('My Custom Palette');
  });

  test('reverses colour order', async ({ palettePage }) => {
    await palettePage.setupPalette({
      colours: ['#FF0000', '#00FF00', '#0000FF'],
    });

    await palettePage.reverseButton.click();

    await palettePage.expectColours(['#0000FF', '#00FF00', '#FF0000']);
  });

  test('clears all colours', async ({ palettePage }) => {
    await palettePage.setupPalette({
      colours: ['#FF0000', '#00FF00', '#0000FF'],
    });

    await palettePage.clearAllButton.click();

    await expect(palettePage.swatches).toHaveCount(0);
  });

  test('does not add beyond 20 colours', async ({ palettePage }) => {
    const colours = Array.from({ length: 20 }, (_, i) => `#${String(i).padStart(2, '0')}0000`);
    await palettePage.setupPalette({ colours });

    await expect(palettePage.swatches).toHaveCount(20);
    await expect(palettePage.addColourButton).toBeDisabled();
  });

  test('moves colour left with Shift+ArrowLeft', async ({ palettePage, page }) => {
    await palettePage.setupPalette({
      colours: ['#AA0000', '#BB0000', '#CC0000', '#DD0000', '#EE0000'],
    });
    await palettePage.swatch(2).click();

    await page.keyboard.press('Shift+ArrowLeft');

    await palettePage.expectColours(['#AA0000', '#CC0000', '#BB0000', '#DD0000', '#EE0000']);
  });

  test('moves colour right with Shift+ArrowRight', async ({ palettePage, page }) => {
    await palettePage.setupPalette({
      colours: ['#AA0000', '#BB0000', '#CC0000', '#DD0000', '#EE0000'],
    });
    await palettePage.swatch(2).click();

    await page.keyboard.press('Shift+ArrowRight');

    await palettePage.expectColours(['#AA0000', '#BB0000', '#DD0000', '#CC0000', '#EE0000']);
  });

  test('moves colour across row boundary', async ({ palettePage, page }) => {
    await palettePage.setupPalette({
      colours: ['#AA0000', '#BB0000', '#CC0000', '#DD0000', '#EE0000', '#FF0000'],
    });
    await palettePage.swatch(4).click();

    await page.keyboard.press('Shift+ArrowLeft');

    await palettePage.expectColours([
      '#AA0000',
      '#BB0000',
      '#CC0000',
      '#EE0000',
      '#DD0000',
      '#FF0000',
    ]);
  });

  test('does not move first colour further left', async ({ palettePage, page }) => {
    await palettePage.setupPalette({
      colours: ['#AA0000', '#BB0000', '#CC0000'],
    });
    await palettePage.swatch(0).click();

    await page.keyboard.press('Shift+ArrowLeft');

    await palettePage.expectColours(['#AA0000', '#BB0000', '#CC0000']);
  });

  test('does not move last colour further right', async ({ palettePage, page }) => {
    await palettePage.setupPalette({
      colours: ['#AA0000', '#BB0000', '#CC0000'],
    });
    await palettePage.swatch(2).click();

    await page.keyboard.press('Shift+ArrowRight');

    await palettePage.expectColours(['#AA0000', '#BB0000', '#CC0000']);
  });

  test('removes colour via Backspace key', async ({ palettePage, page }) => {
    await palettePage.setupPalette({
      colours: ['#FF0000', '#00FF00', '#0000FF'],
    });
    await palettePage.swatch(1).click();

    await page.keyboard.press('Backspace');

    await palettePage.expectColours(['#FF0000', '#0000FF']);
  });

  test('removes colour via hover X button', async ({ palettePage }) => {
    await palettePage.setupPalette({
      colours: ['#FF0000', '#00FF00', '#0000FF'],
    });

    await palettePage.removeSwatchByHover(1);

    await palettePage.expectColours(['#FF0000', '#0000FF']);
  });

  test('shows remove button on hover and hides on leave', async ({ palettePage }) => {
    await palettePage.setupPalette({ colours: ['#FF0000', '#00FF00'] });
    const removeButton = palettePage.swatch(0).locator('..').getByLabel('Remove colour');

    await expect(removeButton).not.toBeVisible();

    await palettePage.swatch(0).hover();
    await expect(removeButton).toBeVisible();

    // Move mouse away
    await palettePage.nameInput.hover();
    await expect(removeButton).not.toBeVisible();
  });
});
