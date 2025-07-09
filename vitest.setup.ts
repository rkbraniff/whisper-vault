import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import React, { ReactNode } from 'react';

const qc = new QueryClient();

declare global {
  // eslint-disable-next-line no-var
  var renderWithProviders: typeof render;
}

globalThis.renderWithProviders = ((ui, options) =>
  render(
    React.createElement(QueryClientProvider, { client: qc }, ui),
    options
  )) as typeof render;
