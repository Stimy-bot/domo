// libs/shared/state/src/lib/auth.store.ts
import { create } from 'zustand';

export type UserRole = 'user' | 'admin' | 'superAdmin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole[];
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (payload: { user: User; accessToken: string; refreshToken: string }) => void;

  logout: () => void;

  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  login: ({ user, accessToken, refreshToken }) => {
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('auth_access', accessToken);
    localStorage.setItem('auth_refresh', refreshToken);

    set({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_access');
    localStorage.removeItem('auth_refresh');

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  hydrate: () => {
    const rawUser = localStorage.getItem('auth_user');
    const access = localStorage.getItem('auth_access');
    const refresh = localStorage.getItem('auth_refresh');

    if (!rawUser || !access || !refresh) {
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });
      return;
    }

    const parsedUser: User = JSON.parse(rawUser);

    set({
      user: parsedUser,
      accessToken: access,
      refreshToken: refresh,
      isAuthenticated: true,
    });
  },
}));

export type AuthStoreState = ReturnType<typeof useAuthStore.getState>;
