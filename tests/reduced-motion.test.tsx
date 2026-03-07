import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';

function mockReducedMotion(enabled: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => {
      const isReduceQuery = query.includes('prefers-reduced-motion');
      const isDarkQuery = query.includes('prefers-color-scheme: dark');

      return {
        matches: isReduceQuery ? enabled : isDarkQuery,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => true
      };
    }
  });
}

describe('reduced motion support', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('marks app as reduced motion when user preference is enabled', async () => {
    mockReducedMotion(true);
    render(<App />);

    await waitFor(() => {
      expect(document.querySelector('.app-shell')).toHaveAttribute('data-motion', 'reduced');
    });

    expect(screen.getByLabelText(/Years in Automation 6\+/i)).toBeInTheDocument();
  });
});
