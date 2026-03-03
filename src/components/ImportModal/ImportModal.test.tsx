import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImportModal } from './ImportModal';

function renderImportModal(
  overrides?: Partial<React.ComponentProps<typeof ImportModal>>,
) {
  const defaultProps = {
    onImport: vi.fn(),
    onClose: vi.fn(),
  };
  const props = { ...defaultProps, ...overrides };
  render(<ImportModal {...props} />);
  return props;
}

const VALID_XML =
  '<color-palette name="Test" type="regular"><color>#FF0000</color></color-palette>';

describe('ImportModal', () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    });
  });

  it('renders with title and textarea', () => {
    renderImportModal();

    expect(screen.getByRole('dialog', { name: 'Import Palette' })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Import' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('disables the Import button when the textarea is empty', () => {
    renderImportModal();

    expect(screen.getByRole('button', { name: 'Import' })).toBeDisabled();
  });

  it('shows a validation error for invalid XML', async () => {
    const user = userEvent.setup();
    renderImportModal();

    await user.type(screen.getByRole('textbox'), '<not-valid');

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Import' })).toBeDisabled();
  });

  it('shows a validation error for wrong root element', async () => {
    const user = userEvent.setup();
    renderImportModal();

    await user.type(
      screen.getByRole('textbox'),
      '<palette type="regular"><color>#FF0000</color></palette>',
    );

    expect(screen.getByRole('alert')).toHaveTextContent('color-palette');
    expect(screen.getByRole('button', { name: 'Import' })).toBeDisabled();
  });

  it('enables the Import button for valid XML', async () => {
    const user = userEvent.setup();
    renderImportModal();

    await user.type(screen.getByRole('textbox'), VALID_XML);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Import' })).toBeEnabled();
  });

  it('calls onImport with parsed palette when Import is clicked', async () => {
    const user = userEvent.setup();
    const { onImport } = renderImportModal();

    await user.type(screen.getByRole('textbox'), VALID_XML);
    await user.click(screen.getByRole('button', { name: 'Import' }));

    expect(onImport).toHaveBeenCalledTimes(1);
    expect(onImport).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Test', type: 'regular' }) as unknown,
    );
    const palette = vi.mocked(onImport).mock.calls[0]?.[0] as
      | { colours: { id: string; hex: string }[] }
      | undefined;
    expect(palette?.colours).toHaveLength(1);
    expect(palette?.colours[0]?.hex).toBe('#FF0000');
    expect(palette?.colours[0]?.id).toBeTypeOf('string');
  });

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const { onClose } = renderImportModal();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clears validation error when XML is corrected', async () => {
    const user = userEvent.setup();
    renderImportModal();

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, '<bad');
    expect(screen.getByRole('alert')).toBeInTheDocument();

    await user.clear(textarea);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
