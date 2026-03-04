import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PaletteNameInput } from './PaletteNameInput';

describe('PaletteNameInput', () => {
  it('renders with the current name value', () => {
    render(<PaletteNameInput name="My Palette" onChange={vi.fn()} />);
    expect(screen.getByRole('textbox', { name: /palette name/i })).toHaveValue('My Palette');
  });

  it('renders with placeholder when name is empty', () => {
    render(<PaletteNameInput name="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('Unnamed palette')).toBeInTheDocument();
  });

  it('calls onChange when the user types a character', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<PaletteNameInput name="" onChange={onChange} />);

    await user.type(screen.getByRole('textbox', { name: /palette name/i }), 'B');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('B');
  });
});
