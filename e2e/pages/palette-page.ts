import { type Page, type Locator, expect } from '@playwright/test';

/** Convert "#RRGGBB" to "rgb(r, g, b)" for CSS assertions */
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${String(r)}, ${String(g)}, ${String(b)})`;
}

export class ColourPickerPopover {
  readonly dialog: Locator;
  readonly hexInput: Locator;
  readonly rInput: Locator;
  readonly gInput: Locator;
  readonly bInput: Locator;
  readonly doneButton: Locator;

  constructor(page: Page) {
    this.dialog = page.getByRole('dialog', { name: 'Colour picker' });
    this.hexInput = this.dialog.getByLabel('Hex colour');
    this.rInput = this.dialog.getByRole('textbox', { name: 'R', exact: true });
    this.gInput = this.dialog.getByRole('textbox', { name: 'G', exact: true });
    this.bInput = this.dialog.getByRole('textbox', { name: 'B', exact: true });
    this.doneButton = this.dialog.getByRole('button', { name: 'Done' });
  }

  async expectOpen() {
    await expect(this.dialog).toBeVisible();
  }

  async expectClosed() {
    await expect(this.dialog).not.toBeVisible();
  }

  async setHex(hex: string) {
    await this.hexInput.fill(hex);
    await this.hexInput.press('Enter');
  }

  async setRgb(r: number, g: number, b: number) {
    await this.rInput.fill(String(r));
    await this.rInput.press('Enter');
    await this.gInput.fill(String(g));
    await this.gInput.press('Enter');
    await this.bInput.fill(String(b));
    await this.bInput.press('Enter');
  }
}

export class ImageCanvasPanel {
  readonly dropZone: Locator;
  readonly canvas: Locator;
  readonly browseButton: Locator;
  readonly zoomInButton: Locator;
  readonly zoomOutButton: Locator;
  readonly zoomSlider: Locator;
  readonly openImageButton: Locator;

  constructor(private readonly page: Page) {
    this.dropZone = page.getByTestId('image-drop-zone');
    this.canvas = page.getByTestId('image-canvas');
    this.browseButton = page.getByRole('button', { name: /browse/i });
    this.zoomInButton = page.getByLabel('Zoom in');
    this.zoomOutButton = page.getByLabel('Zoom out');
    this.zoomSlider = page.getByLabel('Zoom level');
    this.openImageButton = page.getByLabel('Open image');
  }

  async expectDropZoneVisible() {
    await expect(this.dropZone).toBeVisible();
  }

  async expectCanvasVisible() {
    await expect(this.canvas).toBeVisible();
  }

  async loadImageViaFileChooser(filePath: string) {
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await this.browseButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);
  }
}

export class ExtractColoursModal {
  readonly dialog: Locator;
  readonly replaceRadio: Locator;
  readonly addRadio: Locator;
  readonly countInput: Locator;
  readonly decreaseButton: Locator;
  readonly increaseButton: Locator;
  readonly preview: Locator;
  readonly extractButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.dialog = page.getByRole('dialog', {
      name: /extract colours/i,
    });
    this.replaceRadio = this.dialog.getByLabel('Replace existing colours');
    this.addRadio = this.dialog.getByLabel('Add to existing colours');
    this.countInput = this.dialog.getByLabel('Colour count');
    this.decreaseButton = this.dialog.getByLabel('Decrease count');
    this.increaseButton = this.dialog.getByLabel('Increase count');
    this.preview = this.dialog.getByRole('list', {
      name: /preview/i,
    });
    this.extractButton = this.dialog.getByRole('button', {
      name: /extract/i,
    });
    this.cancelButton = this.dialog.getByRole('button', {
      name: /cancel/i,
    });
  }

  async expectOpen() {
    await expect(this.dialog).toBeVisible();
  }

  async expectClosed() {
    await expect(this.dialog).not.toBeVisible();
  }
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

  constructor(page: Page) {
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
  readonly extractFromImageButton: Locator;
  readonly importModal: ImportModal;
  readonly exportModal: ExportModal;
  readonly colourPicker: ColourPickerPopover;
  readonly imageCanvas: ImageCanvasPanel;
  readonly extractModal: ExtractColoursModal;

  constructor(private readonly page: Page) {
    this.swatches = page.locator('[aria-pressed]');
    this.nameInput = page.locator('#palette-name');
    this.addColourButton = page.getByRole('button', { name: 'Add colour' });
    this.clearAllButton = page.getByRole('button', { name: 'Clear all' });
    this.reverseButton = page.getByRole('button', { name: 'Reverse order' });
    this.importButton = page.getByRole('button', { name: 'Import' });
    this.exportButton = page.getByRole('button', { name: 'Export' });
    this.extractFromImageButton = page.getByLabel('Extract from image');
    this.importModal = new ImportModal(page);
    this.exportModal = new ExportModal(page);
    this.colourPicker = new ColourPickerPopover(page);
    this.imageCanvas = new ImageCanvasPanel(page);
    this.extractModal = new ExtractColoursModal(page);
  }

  async goto() {
    await this.page.goto('/');
  }

  swatch(index: number) {
    return this.swatches.nth(index);
  }

  async setType(type: 'regular' | 'sequential' | 'diverging') {
    await this.page.getByRole('radio', { name: new RegExp(type, 'i') }).click();
  }

  async expectType(type: 'regular' | 'sequential' | 'diverging') {
    await expect(this.page.getByRole('radio', { name: new RegExp(type, 'i') })).toHaveAttribute(
      'aria-checked',
      'true',
    );
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
      await expect(this.swatch(i)).toHaveCSS('background-color', hexToRgb(hex));
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

  async openColourPicker(index: number) {
    await this.swatch(index).dblclick();
  }

  async removeSwatchByHover(index: number) {
    await this.swatch(index).hover();
    await this.swatch(index).locator('..').getByLabel('Remove colour').click();
  }

  async dragSwatch(from: number, to: number) {
    const source = this.swatch(from);
    const target = this.swatch(to);
    await source.evaluate((el) => {
      el.dispatchEvent(
        new DragEvent('dragstart', { bubbles: true, dataTransfer: new DataTransfer() }),
      );
    });
    await target.evaluate((el) => {
      el.dispatchEvent(
        new DragEvent('dragover', {
          bubbles: true,
          cancelable: true,
          dataTransfer: new DataTransfer(),
        }),
      );
    });
    await target.evaluate((el) => {
      el.dispatchEvent(
        new DragEvent('drop', {
          bubbles: true,
          cancelable: true,
          dataTransfer: new DataTransfer(),
        }),
      );
    });
    await source.evaluate((el) => {
      el.dispatchEvent(new DragEvent('dragend', { bubbles: true }));
    });
  }

  async openImportModal() {
    await this.importButton.click();
  }

  async openExportModal() {
    await this.exportButton.click();
  }

  async openExtractModal() {
    await this.extractFromImageButton.click();
  }

  /** Set up a known palette state via XML import */
  async setupPalette(options: {
    name?: string;
    type?: 'regular' | 'ordered-sequential' | 'ordered-diverging';
    colours: string[];
  }) {
    const name = options.name ? ` name="${options.name}"` : '';
    const type = options.type ?? 'regular';
    const colourElements = options.colours.map((hex) => `    <color>${hex}</color>`).join('\n');
    const xml = `<color-palette${name} type="${type}">\n${colourElements}\n</color-palette>`;
    await this.openImportModal();
    await this.importModal.fillAndImport(xml);
  }
}
