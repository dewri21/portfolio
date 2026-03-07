import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';
import { THEME_STORAGE_KEY } from '../src/utils/theme';

function mockMedia(options: { reduced?: boolean; dark?: boolean }): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => {
      let matches = false;
      if (query.includes('prefers-reduced-motion')) {
        matches = Boolean(options.reduced);
      }
      if (query.includes('prefers-color-scheme: dark')) {
        matches = Boolean(options.dark);
      }

      return {
        matches,
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

describe('app theme and contact behavior', () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockMedia({ dark: false, reduced: false });
  });

  it('persists theme toggle state in localStorage', async () => {
    render(<App />);

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    });

    await userEvent.click(screen.getByTestId('theme-toggle'));

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
      expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    });
  });

  it('renders only email + linkedin contact and no phone', () => {
    render(<App />);

    expect(screen.getByTestId('contact-email-link')).toBeInTheDocument();
    expect(screen.getByTestId('contact-linkedin-link')).toBeInTheDocument();
    expect(screen.queryByText(/8761868870/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /resume/i })).not.toBeInTheDocument();
  });
});
