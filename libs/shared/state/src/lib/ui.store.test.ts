import { describe, it, expect, vi } from 'vitest';
import { useUIStore } from './ui.store';

describe('UI Store - Theme Mode', () => {
  it('sets theme mode', () => {
    const { setThemeMode } = useUIStore.getState();

    setThemeMode('light');
    expect(useUIStore.getState().themeMode).toBe('light');

    setThemeMode('dark');
    expect(useUIStore.getState().themeMode).toBe('dark');

    setThemeMode('auto');
    expect(useUIStore.getState().themeMode).toBe('auto');
  });

  it('persists theme mode to localStorage', () => {
    const setItem = vi.spyOn(window.localStorage['__proto__'], 'setItem');

    useUIStore.getState().setThemeMode('dark');

    expect(setItem).toHaveBeenCalledWith('theme', 'dark');
  });
});

