import { create } from 'zustand';

export interface User {
  id: string;
  fullName: string;
  role: string[];
}

interface AuthState {
  user: User | null;
  setUser: (u: User | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

// ⭐ Export the state type for selectors
export type AuthStoreState = ReturnType<typeof useAuthStore.getState>;
