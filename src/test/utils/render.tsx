import { render } from '@testing-library/react';
import { AuthProvider } from '../../context/AuthContext';

export const renderWithProviders = (ui: React.ReactElement) =>
  render(<AuthProvider>{ui}</AuthProvider>);
