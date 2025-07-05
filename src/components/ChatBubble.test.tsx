import { render, screen } from '@testing-library/react';
import ChatBubble from './ChatBubble';
import type { Message } from '../types/types';

describe('ChatBubble', () => {
  const baseMessage: Message = {
    id: '1',
    sender: 'user-123',
    content: 'Test message',
    timestamp: Date.now(),
  };

  it('renders user message with correct styling', () => {
    render(<ChatBubble message={baseMessage} userId="user-123" />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByLabelText('Your whisper')).toBeInTheDocument();
  });

  it('renders received message with correct styling', () => {
    render(<ChatBubble message={baseMessage} userId="other-user" />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByLabelText('Whisper from user-123')).toBeInTheDocument();
  });

  it('shows ritual metadata tooltip on hover (accessibility)', () => {
    render(<ChatBubble message={baseMessage} userId="user-123" />);
    // Tooltip is present in the DOM, but hidden by default
    expect(screen.getByText(/sealed/)).toBeInTheDocument();
  });
});
