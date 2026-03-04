import { render, screen } from '@testing-library/react';
import { HueSlider } from './HueSlider';

function renderHueSlider(overrides?: Partial<React.ComponentProps<typeof HueSlider>>) {
  const defaultProps: React.ComponentProps<typeof HueSlider> = {
    hue: 180,
    onChange: vi.fn(),
  };
  const props = { ...defaultProps, ...overrides };
  render(<HueSlider {...props} />);
  return props;
}

describe('HueSlider', () => {
  it('renders the hue canvas', () => {
    renderHueSlider();
    expect(screen.getByLabelText('Hue')).toBeInTheDocument();
  });

  it('calls onChange on pointer down', () => {
    const props = renderHueSlider();
    const canvas = screen.getByLabelText('Hue');

    // Mock getBoundingClientRect
    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 0,
      width: 200,
      height: 16,
      right: 200,
      bottom: 16,
      x: 0,
      y: 0,
      toJSON: vi.fn(),
    });

    canvas.dispatchEvent(
      new PointerEvent('pointerdown', { clientX: 100, clientY: 8, bubbles: true }),
    );

    expect(props.onChange).toHaveBeenCalledTimes(1);
    // Midpoint of 200px width → 180 degrees
    expect(props.onChange).toHaveBeenCalledWith(180);
  });
});
