import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ColourPicker } from './ColourPicker';

function renderColourPicker(overrides?: Partial<React.ComponentProps<typeof ColourPicker>>) {
  const anchorEl = document.createElement('button');
  anchorEl.getBoundingClientRect = () => ({
    top: 100,
    left: 50,
    right: 100,
    bottom: 148,
    width: 50,
    height: 48,
    x: 50,
    y: 100,
    toJSON: vi.fn(),
  });
  document.body.appendChild(anchorEl);

  const defaultProps: React.ComponentProps<typeof ColourPicker> = {
    hex: '#FF0000',
    onColourChange: vi.fn(),
    onClose: vi.fn(),
    anchorRef: { current: anchorEl },
  };
  const props = { ...defaultProps, ...overrides };
  render(<ColourPicker {...props} />);
  return props;
}

describe('ColourPicker', () => {
  it('renders the colour picker dialog', () => {
    renderColourPicker();
    expect(screen.getByRole('dialog', { name: /colour picker/i })).toBeInTheDocument();
  });

  it('shows the hex input with current colour', () => {
    renderColourPicker({ hex: '#AABBCC' });
    expect(screen.getByRole('textbox', { name: /hex/i })).toHaveValue('#AABBCC');
  });

  it('shows RGB inputs with current colour values', () => {
    renderColourPicker({ hex: '#FF8000' });
    expect(screen.getByRole('textbox', { name: 'R' })).toHaveValue('255');
    expect(screen.getByRole('textbox', { name: 'G' })).toHaveValue('128');
    expect(screen.getByRole('textbox', { name: 'B' })).toHaveValue('0');
  });

  it('calls onClose(true) on Escape key', async () => {
    const user = userEvent.setup();
    const props = renderColourPicker();

    await user.keyboard('{Escape}');

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose(false) when Done button is clicked', async () => {
    const user = userEvent.setup();
    const props = renderColourPicker();

    await user.click(screen.getByRole('button', { name: /done/i }));

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose(false) on outside mousedown', () => {
    const props = renderColourPicker();

    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it('renders the colour area and hue slider', () => {
    renderColourPicker();
    expect(screen.getByLabelText('Colour area')).toBeInTheDocument();
    expect(screen.getByLabelText('Hue')).toBeInTheDocument();
  });
});
