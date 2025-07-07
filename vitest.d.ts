import '@testing-library/jest-dom';

declare global {
  var renderWithProviders: typeof import('@testing-library/react').render;
}
export {};
