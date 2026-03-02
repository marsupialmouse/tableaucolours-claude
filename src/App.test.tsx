import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

describe('App', () => {
  it('renders the palette sidebar with default state', () => {
    render(<App />);
    expect(screen.getByRole('textbox', { name: /palette name/i })).toHaveValue('');
    expect(screen.getByRole('radio', { name: /regular/i })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getAllByRole('button', { name: /#[A-F0-9]{6}/i })).toHaveLength(1);
  });

  it('renders the main content area', () => {
    render(<App />);
    expect(screen.getByText('Image canvas will go here')).toBeInTheDocument();
  });

  it('adds a colour when + key is pressed', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.keyboard('+');

    expect(screen.getAllByRole('button', { name: /#[A-F0-9]{6}/i })).toHaveLength(2);
  });
});
