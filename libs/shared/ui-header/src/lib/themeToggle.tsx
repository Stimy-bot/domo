import { useEffect } from 'react';
import { useUIStore, type ThemeMode, type UIStoreState } from '@domo/state';

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'auto';

  const stored = window.localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored as ThemeMode;
  }
  return 'auto';
}

export default function ThemeToggle() {
  const mode = useUIStore((s: UIStoreState) => s.themeMode);
  const setThemeMode = useUIStore((s: UIStoreState) => s.setThemeMode);

  // Initialize theme from localStorage
  useEffect(() => {
    const initial = getInitialMode();
    setThemeMode(initial);
  }, [setThemeMode]);

  // Auto mode: listen for system theme changes
  useEffect(() => {
    if (mode !== 'auto') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setThemeMode('auto');

    // Use addEventListener/removeEventListener for modern browsers
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [mode, setThemeMode]);

  function toggleMode() {
    const next: ThemeMode =
      mode === 'light' ? 'dark' : mode === 'dark' ? 'auto' : 'light';

    setThemeMode(next);
  }

  const label =
    mode === 'auto'
      ? 'Theme mode: auto (system). Click to switch to light mode.'
      : `Theme mode: ${mode}. Click to switch mode.`;

  return (
    <button
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className="mr-4 rounded border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-sm font-semibold text-(--sea-ink) shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5"
    >
      {mode === 'auto' ? 'Auto' : mode === 'dark' ? 'Dark' : 'Light'}
    </button>
  );
}
