// apps/my_start/src/components/ThemeToggle.tsx
import { useEffect } from 'react';
import { UiButton } from '@domo/ui-buttons';
import { useUIStore, type ThemeMode } from '@domo/state';


export default function ThemeToggle() {
  const { themeMode, setThemeMode, initTheme } = useUIStore();

  // Initialize theme on client mount
  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // Listen for system preference changes if mode is 'auto'
  useEffect(() => {
    if (themeMode !== 'auto') {
      return;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setThemeMode('auto'); // Re-triggers application with system preference

    media.addEventListener('change', onChange);
    return () => {
      media.removeEventListener('change', onChange);
    };
  }, [themeMode, setThemeMode]);

  function toggleMode() {
    const nextMode: ThemeMode = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'auto' : 'light';
    setThemeMode(nextMode);
  }

  const label =
    themeMode === 'auto'
      ? 'Theme mode: auto (system). Click to switch to light mode.'
      : `Theme mode: ${themeMode}. Click to switch mode.`;

  return (
    <UiButton
      type="button"
      onClick={toggleMode}
      aria-label={label}
      title={label}
      className="rounded-md border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-sm font-semibold text-(--sea-ink) shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5"
    >
      {themeMode === 'auto' ? 'Auto' : themeMode === 'dark' ? 'Dark' : 'Light'}
    </UiButton>
  );
}