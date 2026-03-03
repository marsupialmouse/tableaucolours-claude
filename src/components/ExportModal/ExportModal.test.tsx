import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExportModal } from './ExportModal';
import { type Palette } from '../../types';

const TEST_PALETTE: Palette = {
  name: 'Test',
  type: 'regular',
  colours: [
    { id: 'c1', hex: '#FF0000' },
    { id: 'c2', hex: '#00FF00' },
  ],
  selectedColourId: 'c1',
};

function renderExportModal(
  overrides?: Partial<React.ComponentProps<typeof ExportModal>>,
) {
  const defaultProps = {
    palette: TEST_PALETTE,
    onClose: vi.fn(),
  };
  const props = { ...defaultProps, ...overrides };
  render(<ExportModal {...props} />);
  return props;
}

describe('ExportModal', () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    });
  });

  it('renders the dialog with generated XML', () => {
    renderExportModal();

    expect(screen.getByRole('dialog', { name: 'Export Palette' })).toBeInTheDocument();
    const textarea = screen.getByRole<HTMLTextAreaElement>('textbox');
    expect(textarea).toHaveAttribute('readOnly');
    expect(textarea.value).toContain('<color-palette name="Test" type="regular">');
  });

  it('includes all colours in the generated XML', () => {
    renderExportModal();

    const value = screen.getByRole<HTMLTextAreaElement>('textbox').value;
    expect(value).toContain('#FF0000');
    expect(value).toContain('#00FF00');
  });

  it('copies XML to clipboard when Copy button is clicked', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    });

    renderExportModal();
    await user.click(screen.getByRole('button', { name: 'Copy' }));

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('<color-palette'));
  });

  it('shows "Copied!" feedback after clicking Copy', async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    });

    renderExportModal();
    await user.click(screen.getByRole('button', { name: 'Copy' }));

    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
  });

  it('calls onClose when Close button is clicked', async () => {
    const user = userEvent.setup();
    const { onClose } = renderExportModal();

    await user.click(screen.getByText('Close', { selector: 'button' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
