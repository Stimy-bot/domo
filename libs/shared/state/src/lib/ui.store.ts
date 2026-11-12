// libs/shared/state/src/lib/ui.store.ts
import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'auto';

interface UIState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  initTheme: () => void;
}

function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'auto';
  }
  const stored = window.localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored;
  }
  return 'auto';
}

function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'auto') {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return 'light';
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  return mode;
}

function applyTheme(mode: ThemeMode) {
  if (typeof window === 'undefined') return;
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
  themeMode: getStoredTheme(), // Initialize directly from localStorage on load

  setThemeMode: (mode) => {
    set({ themeMode: mode });
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', mode);
    }
    applyTheme(mode);
  },

  initTheme: () => {
    const mode = getStoredTheme();
    set({ themeMode: mode });
    applyTheme(mode);
  },
}));

export type UIStoreState = ReturnType<typeof useUIStore.getState>;
