import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Composer from './Composer';

describe('<Composer />', () => {
  it('renders textarea and send button', () => {
    render(<Composer onSend={() => {}} />);
    expect(screen.getAllByRole('textbox')[0]).toBeInTheDocument();
    const sealBtn = screen.getAllByRole('button').find(btn => btn.getAttribute('aria-label') === 'Seal This Message');
    expect(sealBtn).toBeDefined();
    expect(sealBtn).toBeInstanceOf(HTMLElement);
    if (sealBtn) expect(sealBtn).toBeInTheDocument();
  });

  it('calls onSend with message', async () => {
    const onSend = vi.fn();
    render(<Composer onSend={onSend} />);
    const textarea = screen.getAllByRole('textbox')[0];
    const sealBtn = screen.getAllByRole('button').find(btn => btn.getAttribute('aria-label') === 'Seal This Message');
    await act(async () => {
      fireEvent.change(textarea, { target: { value: 'test message' } });
      if (sealBtn) fireEvent.click(sealBtn);
      await new Promise(r => setTimeout(r, 700));
    });
    expect(onSend).toHaveBeenCalledWith('test message');
  });
});
