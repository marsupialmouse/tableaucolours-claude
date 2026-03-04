import { type Page, type Locator, expect } from '@playwright/test';

/** Convert "#RRGGBB" to "rgb(r, g, b)" for CSS assertions */
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${String(r)}, ${String(g)}, ${String(b)})`;
}

class ImportModal {
  readonly dialog: Locator;
  readonly textarea: Locator;
  readonly importButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.dialog = page.getByRole('dialog', { name: /import/i });
    this.textarea = this.dialog.locator('#import-xml');
    this.importButton = this.dialog.getByRole('button', { name: /^import$/i });
    this.cancelButton = this.dialog.getByRole('button', { name: /cancel/i });
    this.errorMessage = this.dialog.getByRole('alert');
  }

  async fillAndImport(xml: string) {
    await this.textarea.fill(xml);
    await this.importButton.click();
  }

  async expectOpen() {
    await expect(this.dialog).toBeVisible();
  }

  async expectClosed() {
    await expect(this.dialog).not.toBeVisible();
  }
}

class ExportModal {
  readonly dialog: Locator;
  readonly textarea: Locator;
  readonly copyButton: Locator;
  readonly closeButton: Locator;

  constructor(private readonly page: Page) {
    this.dialog = page.getByRole('dialog', { name: /export/i });
    this.textarea = this.dialog.locator('#export-xml');
    this.copyButton = this.dialog.getByRole('button', { name: /copy/i });
    this.closeButton = this.dialog.getByText('Close', { exact: true });
  }

  async getXml(): Promise<string> {
    return this.textarea.inputValue();
  }

  async close() {
    await this.closeButton.click();
  }

  async expectOpen() {
    await expect(this.dialog).toBeVisible();
  }

  async expectClosed() {
    await expect(this.dialog).not.toBeVisible();
  }
}

export class PalettePage {
  readonly swatches: Locator;
  readonly nameInput: Locator;
  readonly addColourButton: Locator;
  readonly clearAllButton: Locator;
  readonly reverseButton: Locator;
  readonly importButton: Locator;
  readonly exportButton: Locator;
  readonly importModal: ImportModal;
  readonly exportModal: ExportModal;

  constructor(private readonly page: Page) {
    this.swatches = page.locator('[aria-pressed]');
    this.nameInput = page.locator('#palette-name');
    this.addColourButton = page.getByRole('button', { name: 'Add colour' });
    this.clearAllButton = page.getByRole('button', { name: 'Clear all' });
    this.reverseButton = page.getByRole('button', { name: 'Reverse order' });
    this.importButton = page.getByRole('button', { name: 'Import' });
    this.exportButton = page.getByRole('button', { name: 'Export' });
    this.importModal = new ImportModal(page);
    this.exportModal = new ExportModal(page);
  }

  async goto() {
    await this.page.goto('/');
  }

  swatch(index: number) {
    return this.swatches.nth(index);
  }

  async setType(type: 'regular' | 'sequential' | 'diverging') {
    await this.page
      .getByRole('radio', { name: new RegExp(type, 'i') })
      .click();
  }

  async expectType(type: 'regular' | 'sequential' | 'diverging') {
    await expect(
      this.page.getByRole('radio', { name: new RegExp(type, 'i') }),
    ).toHaveAttribute('aria-checked', 'true');
  }

  async addColours(count: number) {
    for (let i = 0; i < count; i++) {
      await this.addColourButton.click();
    }
  }

  /** Assert the exact colours in the palette (count + each colour value) */
  async expectColours(hexValues: string[]) {
    await expect(this.swatches).toHaveCount(hexValues.length);
    for (const [i, hex] of hexValues.entries()) {
      await expect(this.swatch(i)).toHaveCSS(
        'background-color',
        hexToRgb(hex),
      );
    }
  }

  async expectSwatchSelected(index: number) {
    await expect(this.swatch(index)).toHaveAttribute('aria-pressed', 'true');
    const count = await this.swatches.count();
    for (let i = 0; i < count; i++) {
      if (i !== index) {
        await expect(this.swatch(i)).toHaveAttribute('aria-pressed', 'false');
      }
    }
  }

  async expectSwatchNotSelected(index: number) {
    await expect(this.swatch(index)).toHaveAttribute('aria-pressed', 'false');
  }

  async openImportModal() {
    await this.importButton.click();
  }

  async openExportModal() {
    await this.exportButton.click();
  }

  /** Set up a known palette state via XML import */
  async setupPalette(options: {
    name?: string;
    type?: 'regular' | 'ordered-sequential' | 'ordered-diverging';
    colours: string[];
  }) {
    const name = options.name ? ` name="${options.name}"` : '';
    const type = options.type ?? 'regular';
    const colourElements = options.colours
      .map((hex) => `    <color>${hex}</color>`)
      .join('\n');
    const xml = `<color-palette${name} type="${type}">\n${colourElements}\n</color-palette>`;
    await this.openImportModal();
    await this.importModal.fillAndImport(xml);
  }
}
