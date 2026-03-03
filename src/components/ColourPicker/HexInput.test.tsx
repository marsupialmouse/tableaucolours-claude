import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HexInput } from './HexInput';

function renderHexInput(overrides?: Partial<React.ComponentProps<typeof HexInput>>) {
  const defaultProps: React.ComponentProps<typeof HexInput> = {
    hex: '#FF0000',
    onChange: vi.fn(),
  };
  const props = { ...defaultProps, ...overrides };
  render(<HexInput {...props} />);
  return props;
}

describe('HexInput', () => {
  it('displays the current hex value', () => {
    renderHexInput({ hex: '#AABBCC' });
    expect(screen.getByRole('textbox', { name: /hex/i })).toHaveValue('#AABBCC');
  });

  it('calls onChange with valid uppercase hex on blur', async () => {
    const user = userEvent.setup();
    const props = renderHexInput();
    const input = screen.getByRole('textbox', { name: /hex/i });

    await user.clear(input);
    await user.type(input, '#00ff00');
    await user.tab();

    expect(props.onChange).toHaveBeenCalledWith('#00FF00');
  });

  it('reverts to prop value on blur with invalid hex', async () => {
    const user = userEvent.setup();
    const props = renderHexInput({ hex: '#FF0000' });
    const input = screen.getByRole('textbox', { name: /hex/i });

    await user.clear(input);
    await user.type(input, 'nope');
    await user.tab();

    expect(props.onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue('#FF0000');
  });

  it('calls onChange on Enter with valid hex', async () => {
    const user = userEvent.setup();
    const props = renderHexInput();
    const input = screen.getByRole('textbox', { name: /hex/i });

    await user.clear(input);
    await user.type(input, '#0000FF{Enter}');

    expect(props.onChange).toHaveBeenCalledWith('#0000FF');
  });
});
