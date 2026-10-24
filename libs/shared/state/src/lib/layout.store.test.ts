import { describe, expect, it } from 'vitest';
import { useLayoutStore } from './layout.store.js';

describe('Layout Store', () => {
  it('toggles sidebar', () => {
    const { toggleSidebar } = useLayoutStore.getState();

    expect(useLayoutStore.getState().sidebarOpen).toBe(false);

    toggleSidebar();
    expect(useLayoutStore.getState().sidebarOpen).toBe(true);

    toggleSidebar();
    expect(useLayoutStore.getState().sidebarOpen).toBe(false);
  });

  it('opens and closes sidebar', () => {
    const { openSidebar, closeSidebar } = useLayoutStore.getState();

    openSidebar();
    expect(useLayoutStore.getState().sidebarOpen).toBe(true);

    closeSidebar();
    expect(useLayoutStore.getState().sidebarOpen).toBe(false);
  });

  it('toggles mobile menu', () => {
    const { toggleMobileMenu } = useLayoutStore.getState();

    expect(useLayoutStore.getState().mobileMenuOpen).toBe(false);

    toggleMobileMenu();
    expect(useLayoutStore.getState().mobileMenuOpen).toBe(true);
  });
});
