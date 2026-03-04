import { render, screen } from '@testing-library/react';
import { ImageCanvas } from './ImageCanvas';

function renderImageCanvas(overrides?: Partial<React.ComponentProps<typeof ImageCanvas>>) {
  const defaultProps: React.ComponentProps<typeof ImageCanvas> = {
    image: null,
    canPickColour: false,
    onPickColour: vi.fn(),
    onLoadImage: vi.fn(),
    onOpenImagePicker: vi.fn(),
  };
  const props = { ...defaultProps, ...overrides };
  render(<ImageCanvas {...props} />);
  return props;
}

describe('ImageCanvas', () => {
  it('shows drop zone when no image is loaded', () => {
    renderImageCanvas();
    expect(screen.getByTestId('image-drop-zone')).toBeInTheDocument();
    expect(screen.getByText(/drop an image here/i)).toBeInTheDocument();
  });

  it('shows a browse button in the empty state', () => {
    renderImageCanvas();
    expect(screen.getByRole('button', { name: /browse/i })).toBeInTheDocument();
  });

  it('renders canvas when image is provided', () => {
    const img = new Image(100, 100);
    renderImageCanvas({ image: img });
    expect(screen.getByTestId('image-canvas')).toBeInTheDocument();
    expect(screen.queryByTestId('image-drop-zone')).not.toBeInTheDocument();
  });

  it('shows hint when image loaded but colour picking is disabled', () => {
    const img = new Image(100, 100);
    renderImageCanvas({ image: img, canPickColour: false });
    expect(screen.getByText(/select a swatch/i)).toBeInTheDocument();
  });

  it('does not show hint when colour picking is enabled', () => {
    const img = new Image(100, 100);
    renderImageCanvas({ image: img, canPickColour: true });
    expect(screen.queryByText(/select a swatch/i)).not.toBeInTheDocument();
  });

  it('shows zoom controls and open image button when image is loaded', () => {
    const img = new Image(100, 100);
    renderImageCanvas({ image: img });
    expect(screen.getByRole('slider', { name: /zoom level/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open image/i })).toBeInTheDocument();
  });
});
