import { render, screen } from '@testing-library/react';
import { PalettePreview } from './PalettePreview';

describe('PalettePreview', () => {
  it('renders empty state when there are no colours', () => {
    const { container } = render(<PalettePreview colours={[]} type="regular" />);
    expect(screen.queryByTestId('palette-preview')).not.toBeInTheDocument();
    // Empty state has a dashed border placeholder
    expect(container.querySelector('.border-dashed')).toBeInTheDocument();
  });

  it('renders discrete blocks for regular type', () => {
    const colours = [
      { id: 'c1', hex: '#FF0000' },
      { id: 'c2', hex: '#00FF00' },
    ];
    render(<PalettePreview colours={colours} type="regular" />);
    const preview = screen.getByTestId('palette-preview');
    // Regular type renders child divs (flex blocks), not a gradient
    expect(preview.children).toHaveLength(2);
    expect(preview.children[0]).toHaveStyle({ backgroundColor: '#FF0000' });
    expect(preview.children[1]).toHaveStyle({ backgroundColor: '#00FF00' });
  });

  it('renders a gradient for sequential type', () => {
    const colours = [
      { id: 'c1', hex: '#C6DBEF' },
      { id: 'c2', hex: '#08519C' },
    ];
    render(<PalettePreview colours={colours} type="ordered-sequential" />);
    const preview = screen.getByTestId('palette-preview');
    // Gradient type has no children, just a background style
    expect(preview.children).toHaveLength(0);
    expect(preview.style.background).toContain('linear-gradient');
    // jsdom converts hex to rgb in computed styles
    expect(preview.style.background).toContain('rgb(198, 219, 239)');
    expect(preview.style.background).toContain('rgb(8, 81, 156)');
  });

  it('renders a gradient for diverging type', () => {
    const colours = [
      { id: 'c1', hex: '#B2182B' },
      { id: 'c2', hex: '#F7F7F7' },
      { id: 'c3', hex: '#2166AC' },
    ];
    render(<PalettePreview colours={colours} type="ordered-diverging" />);
    const preview = screen.getByTestId('palette-preview');
    expect(preview.children).toHaveLength(0);
    expect(preview.style.background).toContain('linear-gradient');
  });
});
