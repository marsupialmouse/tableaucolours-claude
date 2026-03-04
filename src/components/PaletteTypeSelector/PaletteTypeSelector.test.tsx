import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PaletteTypeSelector } from './PaletteTypeSelector';

function renderSelector(overrides?: Partial<React.ComponentProps<typeof PaletteTypeSelector>>) {
  const defaultProps: React.ComponentProps<typeof PaletteTypeSelector> = {
    selectedType: 'regular',
    onChange: vi.fn(),
  };
  const props = { ...defaultProps, ...overrides };
  render(<PaletteTypeSelector {...props} />);
  return props;
}

describe('PaletteTypeSelector', () => {
  it('renders three radio options', () => {
    renderSelector();
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
    expect(screen.getByRole('radio', { name: /regular/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /sequential/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /diverging/i })).toBeInTheDocument();
  });

  it('marks the selected type as checked', () => {
    renderSelector({ selectedType: 'ordered-sequential' });
    expect(screen.getByRole('radio', { name: /regular/i })).toHaveAttribute(
      'aria-checked',
      'false',
    );
    expect(screen.getByRole('radio', { name: /sequential/i })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('radio', { name: /diverging/i })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  it('calls onChange with the type when clicked', async () => {
    const user = userEvent.setup();
    const props = renderSelector({ selectedType: 'regular' });

    await user.click(screen.getByRole('radio', { name: /diverging/i }));

    expect(props.onChange).toHaveBeenCalledTimes(1);
    expect(props.onChange).toHaveBeenCalledWith('ordered-diverging');
  });

  it('only the selected type has tabIndex 0 (roving tabindex)', () => {
    renderSelector({ selectedType: 'ordered-diverging' });
    expect(screen.getByRole('radio', { name: /regular/i })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('radio', { name: /sequential/i })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('radio', { name: /diverging/i })).toHaveAttribute('tabindex', '0');
  });

  it('renders within a radiogroup', () => {
    renderSelector();
    expect(screen.getByRole('radiogroup', { name: /palette type/i })).toBeInTheDocument();
  });
});
