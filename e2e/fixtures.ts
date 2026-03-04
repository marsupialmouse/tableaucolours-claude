import { test as base } from '@playwright/test';
import { PalettePage } from './pages/palette-page';

export const test = base.extend<{ palettePage: PalettePage }>({
  palettePage: async ({ page }, use) => {
    const palettePage = new PalettePage(page);
    await palettePage.goto();
    await use(palettePage);
  },
});
export { expect } from '@playwright/test';
