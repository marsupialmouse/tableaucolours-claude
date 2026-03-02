import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type PaletteColour } from '../../types';
import { SwatchList } from './SwatchList';

function renderSwatchList(overrides?: Partial<React.ComponentProps<typeof SwatchList>>) {
  const colours: PaletteColour[] = [
    { id: 'c1', hex: '#FF0000' },
    { id: 'c2', hex: '#00FF00' },
    { id: 'c3', hex: '#0000FF' },
  ];
  const defaultProps: React.ComponentProps<typeof SwatchList> = {
    colours,
    selectedColourId: 'c1',
    onSelect: vi.fn(),
    onRemove: vi.fn(),
    onDoubleClick: vi.fn(),
  };
  const props = { ...defaultProps, ...overrides };
  render(<SwatchList {...props} />);
  return props;
}

describe('SwatchList', () => {
  it('renders a swatch for each colour', () => {
    renderSwatchList();
    expect(screen.getByRole('button', { name: '#FF0000' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '#00FF00' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '#0000FF' })).toBeInTheDocument();
  });

  it('renders empty state when there are no colours', () => {
    renderSwatchList({ colours: [] });
    expect(screen.getByText('No colours in palette')).toBeInTheDocument();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('marks the selected colour with aria-pressed', () => {
    renderSwatchList({ selectedColourId: 'c2' });
    expect(screen.getByRole('button', { name: '#FF0000' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByRole('button', { name: '#00FF00' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('calls onSelect when a swatch is clicked', async () => {
    const user = userEvent.setup();
    const props = renderSwatchList();

    await user.click(screen.getByRole('button', { name: '#00FF00' }));

    expect(props.onSelect).toHaveBeenCalledWith('c2');
  });

  it('renders a listbox for accessibility', () => {
    renderSwatchList();
    expect(screen.getByRole('listbox', { name: /palette colours/i })).toBeInTheDocument();
  });
});
