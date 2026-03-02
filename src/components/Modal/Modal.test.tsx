import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

// jsdom doesn't implement showModal/close on <dialog>
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
});

function renderModal(overrides?: Partial<React.ComponentProps<typeof Modal>>) {
  const defaultProps: React.ComponentProps<typeof Modal> = {
    title: 'Test Modal',
    onClose: vi.fn(),
    children: <p>Modal content</p>,
  };
  const props = { ...defaultProps, ...overrides };
  render(<Modal {...props} />);
  return props;
}

describe('Modal', () => {
  it('renders the title and children', () => {
    renderModal({ title: 'My Dialog' });
    expect(screen.getByRole('dialog', { name: 'My Dialog' })).toBeInTheDocument();
    expect(screen.getByText('My Dialog')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('calls showModal on mount', () => {
    renderModal();
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const props = renderModal();

    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose on cancel event (Escape key)', () => {
    const props = renderModal();
    const dialog = screen.getByRole('dialog');

    dialog.dispatchEvent(new Event('cancel', { bubbles: true }));

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    const props = renderModal();

    // Clicking the dialog element itself (not its children) simulates a backdrop click
    await user.click(screen.getByRole('dialog'));

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when dialog content is clicked', async () => {
    const user = userEvent.setup();
    const props = renderModal();

    await user.click(screen.getByText('Modal content'));

    expect(props.onClose).not.toHaveBeenCalled();
  });
});
