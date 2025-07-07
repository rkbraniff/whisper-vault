import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ChatBubble from './ChatBubble';
import type { Message } from '../types/types';

describe('ChatBubble', () => {
  const baseMessage: Message = {
    id: '1',
    sender: 'user',
    content: 'Test message',
    timestamp: Date.now(),
  };

  it('renders user message with correct styling', () => {
    render(<ChatBubble message={baseMessage} userId="user" />);
    expect(screen.getAllByText('Test message')[0]).toBeInTheDocument();
    expect(screen.getByLabelText('Your whisper')).toBeInTheDocument();
  });

  it('renders received message with correct styling', () => {
    render(<ChatBubble message={baseMessage} userId="other" />);
    expect(screen.getAllByText('Test message')[0]).toBeInTheDocument();
    expect(screen.getByLabelText('Whisper from user')).toBeInTheDocument();
  });

  it('shows ritual metadata tooltip on hover (accessibility)', () => {
    render(<ChatBubble message={baseMessage} userId="user" />);
    expect(screen.getAllByText(/sealed/)[0]).toBeInTheDocument();
  });
});
