import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PaletteActions } from './PaletteActions';

function renderActions(overrides?: Partial<React.ComponentProps<typeof PaletteActions>>) {
  const defaultProps: React.ComponentProps<typeof PaletteActions> = {
    colourCount: 3,
    hasImage: false,
    onAddColour: vi.fn(),
    onClearAll: vi.fn(),
    onReverse: vi.fn(),
    onExtract: vi.fn(),
    onImport: vi.fn(),
    onExport: vi.fn(),
  };
  const props = { ...defaultProps, ...overrides };
  render(<PaletteActions {...props} />);
  return props;
}

describe('PaletteActions', () => {
  it('renders all action buttons', () => {
    renderActions();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reverse/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /extract/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /import/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
  });

  it('disables Add when colour count is at maximum', () => {
    renderActions({ colourCount: 20 });
    expect(screen.getByRole('button', { name: /add/i })).toBeDisabled();
  });

  it('enables Add when colour count is below maximum', () => {
    renderActions({ colourCount: 19 });
    expect(screen.getByRole('button', { name: /add/i })).toBeEnabled();
  });

  it('disables Clear all when there are no colours', () => {
    renderActions({ colourCount: 0 });
    expect(screen.getByRole('button', { name: /clear all/i })).toBeDisabled();
  });

  it('disables Reverse when there are fewer than 2 colours', () => {
    renderActions({ colourCount: 1 });
    expect(screen.getByRole('button', { name: /reverse/i })).toBeDisabled();
  });

  it('enables Reverse when there are 2 or more colours', () => {
    renderActions({ colourCount: 2 });
    expect(screen.getByRole('button', { name: /reverse/i })).toBeEnabled();
  });

  it('disables Extract when there is no image', () => {
    renderActions({ hasImage: false });
    expect(screen.getByRole('button', { name: /extract/i })).toBeDisabled();
  });

  it('enables Extract when there is an image', () => {
    renderActions({ hasImage: true });
    expect(screen.getByRole('button', { name: /extract/i })).toBeEnabled();
  });

  it('calls onAddColour when Add is clicked', async () => {
    const user = userEvent.setup();
    const props = renderActions();

    await user.click(screen.getByRole('button', { name: /add/i }));

    expect(props.onAddColour).toHaveBeenCalledTimes(1);
  });

  it('calls onClearAll when Clear all is clicked', async () => {
    const user = userEvent.setup();
    const props = renderActions();

    await user.click(screen.getByRole('button', { name: /clear all/i }));

    expect(props.onClearAll).toHaveBeenCalledTimes(1);
  });

  it('calls onReverse when Reverse is clicked', async () => {
    const user = userEvent.setup();
    const props = renderActions();

    await user.click(screen.getByRole('button', { name: /reverse/i }));

    expect(props.onReverse).toHaveBeenCalledTimes(1);
  });
});
