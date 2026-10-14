import { describe, it, expect } from 'vitest';
import { useAuthStore, type UserRole } from './auth.store.js';

describe('Auth Store', () => {
  it('sets user', () => {
    const user = { id: '1', fullName: 'Dominic', email: 'dominic@example.com', role: ['admin' as UserRole] };

    useAuthStore.getState().login({
      user,
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });

    expect(useAuthStore.getState().user).toEqual(user);
  });

  it('clears user', () => {
    useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBe(null);
  });
});
