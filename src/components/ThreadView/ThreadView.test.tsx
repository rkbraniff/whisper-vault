import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ThreadView from './index';
import type { Message } from '../../types/types';

describe('ThreadView', () => {
  const baseMessage: Message = {
    id: '1',
    sender: 'user-123',
    content: 'Test glyph',
    timestamp: Date.now(),
  };

  it('renders empty state when no messages', () => {
    const { getByText } = render(<ThreadView messages={[]} userId="user-123" />);
    expect(getByText('No Whispers Yet')).toBeInTheDocument();
  });

  it('renders messages as GlyphMessage', () => {
    const { getByText } = render(<ThreadView messages={[baseMessage]} userId="user-123" />);
    expect(getByText('Test glyph')).toBeInTheDocument();
  });
});
