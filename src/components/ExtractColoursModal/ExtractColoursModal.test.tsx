import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { type Palette, MAX_COLOURS } from '../../types';
import { ExtractColoursModal } from './ExtractColoursModal';

vi.mock('../../utils/colourExtraction', () => ({
  extractColours: vi.fn().mockReturnValue(['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF']),
}));

function makePalette(colourCount: number): Palette {
  return {
    name: 'Test',
    type: 'regular',
    colours: Array.from({ length: colourCount }, (_, i) => ({
      id: String(i),
      hex: '#000000',
    })),
    selectedColourId: null,
  };
}

function renderModal(
  overrides?: Partial<React.ComponentProps<typeof ExtractColoursModal>>,
) {
  const defaultProps = {
    image: {} as HTMLImageElement,
    palette: makePalette(3),
    onExtract: vi.fn(),
    onClose: vi.fn(),
  };
  const props = { ...defaultProps, ...overrides };
  render(<ExtractColoursModal {...props} />);
  return props;
}

describe('ExtractColoursModal', () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
      this.removeAttribute('open');
    });
  });

  it('renders with title and controls', () => {
    renderModal();

    expect(screen.getByRole('dialog', { name: 'Extract Colours from Image' })).toBeInTheDocument();
    expect(screen.getByLabelText('Colour count')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Extract' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('shows preview swatches from extraction', () => {
    renderModal();

    const swatches = screen.getAllByRole('listitem');
    expect(swatches).toHaveLength(5);
  });

  it('calls onExtract with replace mode by default', async () => {
    const user = userEvent.setup();
    const props = renderModal();

    await user.click(screen.getByRole('button', { name: 'Extract' }));
    expect(props.onExtract).toHaveBeenCalledWith(
      ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'],
      'replace',
    );
  });

  it('calls onExtract with add mode when selected', async () => {
    const user = userEvent.setup();
    const props = renderModal();

    await user.click(screen.getByLabelText('Add to existing colours'));
    await user.click(screen.getByRole('button', { name: 'Extract' }));
    expect(props.onExtract).toHaveBeenCalledWith(expect.any(Array), 'add');
  });

  it('disables add mode when palette is full', () => {
    renderModal({ palette: makePalette(MAX_COLOURS) });

    const addRadio = screen.getByLabelText('Add to existing colours');
    expect(addRadio).toBeDisabled();
  });

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const props = renderModal();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(props.onClose).toHaveBeenCalled();
  });

  it('decrements count when minus button is clicked', async () => {
    const user = userEvent.setup();
    renderModal();

    const countInput = screen.getByLabelText('Colour count');
    expect(countInput).toHaveValue(5);

    await user.click(screen.getByRole('button', { name: 'Decrease count' }));
    expect(countInput).toHaveValue(4);
  });

  it('increments count when plus button is clicked', async () => {
    const user = userEvent.setup();
    renderModal();

    const countInput = screen.getByLabelText('Colour count');

    await user.click(screen.getByRole('button', { name: 'Increase count' }));
    expect(countInput).toHaveValue(6);
  });

  it('clamps count to available slots when switching to add mode', async () => {
    const user = userEvent.setup();
    renderModal({ palette: makePalette(MAX_COLOURS - 2) });

    const countInput = screen.getByLabelText('Colour count');
    expect(countInput).toHaveValue(5);

    await user.click(screen.getByLabelText('Add to existing colours'));
    expect(countInput).toHaveValue(2);
  });
});
