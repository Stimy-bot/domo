import { describe, it, expect } from 'vitest';
import { useAuthStore } from './auth.store.js';

describe('Auth Store', () => {
  it('sets user', () => {
    const user = { id: '1', fullName: 'Dominic', role: ['admin'] };

    useAuthStore.getState().setUser(user);

    expect(useAuthStore.getState().user).toEqual(user);
  });

  it('clears user', () => {
    useAuthStore.getState().clearUser();

    expect(useAuthStore.getState().user).toBe(null);
  });
});
