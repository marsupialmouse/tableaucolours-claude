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
});
