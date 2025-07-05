import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Composer from './Composer';

describe('<Composer />', () => {
  it('renders textarea and send button', () => {
    render(<Composer onSend={() => {}} />);
    expect(screen.getAllByRole('textbox')[0]).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onSend with message', async () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);
    const textarea = screen.getAllByRole('textbox')[0];
    fireEvent.change(textarea, { target: { value: 'test message' } });
    fireEvent.click(screen.getByRole('button'));
    // Wait for any async animation or debounce
    await new Promise(r => setTimeout(r, 700));
    expect(onSend).toHaveBeenCalledWith('test message');
  });
});
