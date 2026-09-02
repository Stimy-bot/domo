import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface UIState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

function resolveTheme(mode: ThemeMode): ThemeMode {
  if (mode === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }
  return mode;
}

function applyTheme(mode: ThemeMode) {
  const resolved = resolveTheme(mode);

  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(resolved);

  if (mode === 'auto') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', mode);
  }

  document.documentElement.style.colorScheme = resolved;
}

export const useUIStore = create<UIState>((set) => ({
  themeMode: 'auto',

  setThemeMode: (mode) => {
    set({ themeMode: mode });
    applyTheme(mode);
    window.localStorage.setItem('theme', mode);
  },
}));

export type UIStoreState = ReturnType<typeof useUIStore.getState>;
