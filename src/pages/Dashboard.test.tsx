import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { screen, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import { mockThreads } from '../mocks/threads';

const qc = new QueryClient();
qc.setQueryData(['threads'], mockThreads); // ← seed cache

describe('<Dashboard />', () => {
  it('renders all three panes and the FAB', () => {
    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getByLabelText(/Recent Whispers/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sigils/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Identity Key/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Send Whisper/i)).toBeInTheDocument();
  });

  it('renders thread links and calls navigate', () => {
    render(
      <QueryClientProvider client={qc}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText(/Midnight Pact/i)).toBeInTheDocument();
    expect(screen.getByText(/Artifact drop/i)).toBeInTheDocument();
  });
});
