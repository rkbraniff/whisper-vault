import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ThreadView from './index';
import type { Message } from '../../types/types';

describe('ThreadView', () => {
  const baseMessage: Message = {
    id: '1',
    sender: 'user',
    content: 'Test glyph',
    timestamp: Date.now(),
  };

  it('renders empty state when no messages', () => {
    const { getByText } = render(<ThreadView messages={[]} userId="user" />);
    expect(getByText('No Whispers Yet')).toBeTruthy();
  });

  it('renders messages as GlyphMessage', () => {
    const { getByText } = render(<ThreadView messages={[baseMessage]} userId="user" />);
    expect(getByText('Test glyph')).toBeTruthy();
  });
});
