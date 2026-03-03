import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ZoomControls } from './ZoomControls';

function renderZoom(overrides?: Partial<React.ComponentProps<typeof ZoomControls>>) {
  const defaultProps: React.ComponentProps<typeof ZoomControls> = {
    zoom: 1,
    onZoomChange: vi.fn(),
  };
  const props = { ...defaultProps, ...overrides };
  render(<ZoomControls {...props} />);
  return props;
}

describe('ZoomControls', () => {
  it('displays the current zoom percentage', () => {
    renderZoom({ zoom: 1.5 });
    expect(screen.getByText('150%')).toBeInTheDocument();
  });

  it('calls onZoomChange when zoom in is clicked', async () => {
    const user = userEvent.setup();
    const props = renderZoom({ zoom: 1 });

    await user.click(screen.getByRole('button', { name: /zoom in/i }));

    expect(props.onZoomChange).toHaveBeenCalledTimes(1);
    expect(props.onZoomChange).toHaveBeenCalledWith(1.1);
  });

  it('calls onZoomChange when zoom out is clicked', async () => {
    const user = userEvent.setup();
    const props = renderZoom({ zoom: 1 });

    await user.click(screen.getByRole('button', { name: /zoom out/i }));

    expect(props.onZoomChange).toHaveBeenCalledTimes(1);
    expect(props.onZoomChange).toHaveBeenCalledWith(0.9);
  });

  it('disables zoom out at minimum zoom', () => {
    renderZoom({ zoom: 0.1 });
    expect(screen.getByRole('button', { name: /zoom out/i })).toBeDisabled();
  });

  it('disables zoom in at maximum zoom', () => {
    renderZoom({ zoom: 5 });
    expect(screen.getByRole('button', { name: /zoom in/i })).toBeDisabled();
  });

  it('renders a range slider with 100% at the midpoint', () => {
    renderZoom({ zoom: 1 });
    const slider = screen.getByRole('slider', { name: /zoom level/i });
    expect(slider).toBeInTheDocument();
    // At zoom=1, slider value should be 50 (midpoint)
    expect(slider).toHaveValue('50');
  });
});
