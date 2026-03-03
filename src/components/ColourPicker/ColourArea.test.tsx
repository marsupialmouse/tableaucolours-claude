import { render, screen } from '@testing-library/react';
import { ColourArea } from './ColourArea';

function renderColourArea(overrides?: Partial<React.ComponentProps<typeof ColourArea>>) {
  const defaultProps: React.ComponentProps<typeof ColourArea> = {
    hue: 0,
    saturation: 50,
    value: 50,
    onChange: vi.fn(),
  };
  const props = { ...defaultProps, ...overrides };
  render(<ColourArea {...props} />);
  return props;
}

describe('ColourArea', () => {
  it('renders the colour area canvas', () => {
    renderColourArea();
    expect(screen.getByLabelText('Colour area')).toBeInTheDocument();
  });

  it('calls onChange on pointer down with saturation and value', () => {
    const props = renderColourArea();
    const canvas = screen.getByLabelText('Colour area');

    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 200,
      height: 150,
      right: 200,
      bottom: 150,
      x: 0,
      y: 0,
      toJSON: vi.fn(),
    });

    canvas.dispatchEvent(
      new PointerEvent('pointerdown', { clientX: 100, clientY: 75, bubbles: true }),
    );

    expect(props.onChange).toHaveBeenCalledTimes(1);
    // x=100/200 → sat=50, y=75/150 → value=50
    expect(props.onChange).toHaveBeenCalledWith(50, 50);
  });
});
