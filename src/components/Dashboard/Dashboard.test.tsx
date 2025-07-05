import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Dashboard from './index';
import WhispersPane from './WhispersPane';
import SigilsPane from './SigilsPane';
import KeysLocksPane from './KeysLocksPane';
import SendWhisperFAB from './SendWhisperFAB';

describe('Dashboard', () => {
  it('renders all three panes and the FAB', () => {
    const { getByText, getByLabelText } = render(
      <Dashboard
        whispersPane={<WhispersPane />}
        sigilsPane={<SigilsPane />}
        keysLocksPane={<KeysLocksPane />}
        fab={<SendWhisperFAB />}
      />
    );
    expect(getByText('Whispers')).toBeInTheDocument();
    expect(getByText('Sigils')).toBeInTheDocument();
    expect(getByText('Keys & Locks')).toBeInTheDocument();
    expect(getByLabelText('Send a Whisper')).toBeInTheDocument();
  });
});
