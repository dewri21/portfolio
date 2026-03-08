import type { ThemeMode } from '../utils/theme';

interface ThemeToggleProps {
  mode: ThemeMode;
  onToggle: (e: React.MouseEvent) => void;
  iconOnly?: boolean;
}

function SunIcon(): JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon(): JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function ThemeToggle({ mode, onToggle, iconOnly }: ThemeToggleProps): JSX.Element {
  // Show the target mode icon: Sun for Dark Mode, Moon for Light Mode.
  const showSun = mode === 'dark'; 
  
  return (
    <button
      className={`theme-toggle ${iconOnly ? 'icon-only' : ''}`}
      type="button"
      onClick={(e) => onToggle(e)}
      aria-label="Toggle theme"
      data-testid="theme-toggle"
    >
        <span className="theme-icon-animated" aria-hidden="true" data-mode={mode}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Minimal Sun Icon */}
            <g className={`sun-group ${!showSun ? 'hidden' : ''}`}>
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </g>
            
            {/* Minimal Outline Moon Icon */}
            <g className={`moon-group ${showSun ? 'hidden' : ''}`}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </g>
          </svg>
        </span>
      {!iconOnly && <span>{showSun ? 'Light' : 'Dark'}</span>}
    </button>
  );
}
