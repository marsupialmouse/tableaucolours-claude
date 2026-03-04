import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RgbInputs } from './RgbInputs';

function renderRgbInputs(overrides?: Partial<React.ComponentProps<typeof RgbInputs>>) {
  const defaultProps: React.ComponentProps<typeof RgbInputs> = {
    rgb: { r: 255, g: 128, b: 0 },
    onChange: vi.fn(),
  };
  const props = { ...defaultProps, ...overrides };
  render(<RgbInputs {...props} />);
  return props;
}

describe('RgbInputs', () => {
  it('displays the R, G, B values', () => {
    renderRgbInputs({ rgb: { r: 10, g: 20, b: 30 } });
    expect(screen.getByRole('textbox', { name: 'R' })).toHaveValue('10');
    expect(screen.getByRole('textbox', { name: 'G' })).toHaveValue('20');
    expect(screen.getByRole('textbox', { name: 'B' })).toHaveValue('30');
  });

  it('calls onChange when R value is changed and blurred', async () => {
    const user = userEvent.setup();
    const props = renderRgbInputs({ rgb: { r: 100, g: 50, b: 25 } });
    const rInput = screen.getByRole('textbox', { name: 'R' });

    await user.clear(rInput);
    await user.type(rInput, '200');
    await user.tab();

    expect(props.onChange).toHaveBeenCalledWith({ r: 200, g: 50, b: 25 });
  });

  it('clamps values to 0-255', async () => {
    const user = userEvent.setup();
    const props = renderRgbInputs({ rgb: { r: 100, g: 100, b: 100 } });
    const rInput = screen.getByRole('textbox', { name: 'R' });

    await user.clear(rInput);
    await user.type(rInput, '300');
    await user.tab();

    expect(props.onChange).toHaveBeenCalledWith({ r: 255, g: 100, b: 100 });
  });

  it('reverts to prop value when invalid text is entered', async () => {
    const user = userEvent.setup();
    const props = renderRgbInputs({ rgb: { r: 100, g: 100, b: 100 } });
    const gInput = screen.getByRole('textbox', { name: 'G' });

    await user.clear(gInput);
    await user.type(gInput, 'abc');
    await user.tab();

    expect(props.onChange).not.toHaveBeenCalled();
    expect(gInput).toHaveValue('100');
  });
});
