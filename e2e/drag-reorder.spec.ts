import { test } from './fixtures';

test.describe('drag reorder', () => {
  test('reorders swatches via drag within a row', async ({ palettePage }) => {
    await palettePage.setupPalette({
      colours: ['#AA0000', '#BB0000', '#CC0000', '#DD0000', '#EE0000', '#FF0000'],
    });

    await palettePage.dragSwatch(1, 2);

    await palettePage.expectColours([
      '#AA0000',
      '#CC0000',
      '#BB0000',
      '#DD0000',
      '#EE0000',
      '#FF0000',
    ]);
  });

  test('reorders swatches via drag across rows', async ({ palettePage }) => {
    await palettePage.setupPalette({
      colours: ['#AA0000', '#BB0000', '#CC0000', '#DD0000', '#EE0000', '#FF0000'],
    });

    await palettePage.dragSwatch(1, 5);

    await palettePage.expectColours([
      '#AA0000',
      '#CC0000',
      '#DD0000',
      '#EE0000',
      '#FF0000',
      '#BB0000',
    ]);
  });

  test('drag to same position does not change order', async ({ palettePage }) => {
    await palettePage.setupPalette({
      colours: ['#AA0000', '#BB0000', '#CC0000', '#DD0000', '#EE0000', '#FF0000'],
    });

    await palettePage.dragSwatch(2, 2);

    await palettePage.expectColours([
      '#AA0000',
      '#BB0000',
      '#CC0000',
      '#DD0000',
      '#EE0000',
      '#FF0000',
    ]);
  });

  test('drag preserves selection', async ({ palettePage }) => {
    await palettePage.setupPalette({
      colours: ['#AA0000', '#BB0000', '#CC0000', '#DD0000', '#EE0000', '#FF0000'],
    });
    await palettePage.swatch(1).click();
    await palettePage.expectSwatchSelected(1);

    await palettePage.dragSwatch(3, 1);

    await palettePage.expectColours([
      '#AA0000',
      '#DD0000',
      '#BB0000',
      '#CC0000',
      '#EE0000',
      '#FF0000',
    ]);
  });
});
