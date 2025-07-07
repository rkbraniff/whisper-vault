import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

describe('Dashboard', () => {
  it('renders all three panes and the FAB', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/Recent Whispers/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sigils/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Identity Key/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Send Whisper/i)).toBeInTheDocument();
  });

  it('renders a thread link and clicking it calls navigate', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText(/Midnight Pact/i)).toBeInTheDocument();
    expect(screen.getByText(/Artifact drop/i)).toBeInTheDocument();
  });
});
