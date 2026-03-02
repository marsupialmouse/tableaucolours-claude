import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Swatch } from './Swatch';

function renderSwatch(overrides?: Partial<React.ComponentProps<typeof Swatch>>) {
  const defaultProps: React.ComponentProps<typeof Swatch> = {
    colour: { id: 'test-1', hex: '#FF0000' },
    isSelected: false,
    onSelect: vi.fn(),
    onRemove: vi.fn(),
    onDoubleClick: vi.fn(),
  };
  const props = { ...defaultProps, ...overrides };
  render(<Swatch {...props} />);
  return props;
}

describe('Swatch', () => {
  it('renders with the correct background colour', () => {
    renderSwatch({ colour: { id: 's1', hex: '#3A7BCD' } });
    const swatch = screen.getByRole('button', { name: '#3A7BCD' });
    expect(swatch).toHaveStyle({ backgroundColor: '#3A7BCD' });
  });

  it('calls onSelect with the colour id when clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    renderSwatch({ colour: { id: 'click-me', hex: '#000000' }, onSelect });

    await user.click(screen.getByRole('button', { name: '#000000' }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('click-me');
  });

  it('calls onDoubleClick with the colour id when double-clicked', async () => {
    const user = userEvent.setup();
    const onDoubleClick = vi.fn();
    renderSwatch({ colour: { id: 'dbl-click', hex: '#000000' }, onDoubleClick });

    await user.dblClick(screen.getByRole('button', { name: '#000000' }));

    expect(onDoubleClick).toHaveBeenCalledTimes(1);
    expect(onDoubleClick).toHaveBeenCalledWith('dbl-click');
  });

  it('shows remove button on hover', async () => {
    const user = userEvent.setup();
    renderSwatch({ colour: { id: 'rm-me', hex: '#000000' } });

    expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();

    // Hover the wrapper div (parent of the swatch button)
    const swatchButton = screen.getByRole('button', { name: '#000000' });
    await user.hover(swatchButton);

    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
  });

  it('hides remove button when not hovered', async () => {
    const user = userEvent.setup();
    renderSwatch({ colour: { id: 'rm-me', hex: '#000000' } });

    const swatchButton = screen.getByRole('button', { name: '#000000' });
    await user.hover(swatchButton);
    expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();

    await user.unhover(swatchButton);
    expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument();
  });

  it('shows selected state via aria-pressed', () => {
    renderSwatch({ isSelected: true });
    expect(screen.getByRole('button', { name: '#FF0000' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows unselected state via aria-pressed', () => {
    renderSwatch({ isSelected: false });
    expect(screen.getByRole('button', { name: '#FF0000' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});
