// libs/shared/ui-header/src/lib/ui-header.tsx

import {
  type AuthStoreState,
  type LayoutStoreState,
  type UIStoreState,
  useAuthStore,
  useLayoutStore,
  useUIStore,
} from '@domo/state';
import { navbarLinks } from './navbarLinks';

function UiHeader() {
  // Layout store
  const headerVisible = useLayoutStore((s: LayoutStoreState) => s.headerVisible);
  const mobileMenuOpen = useLayoutStore((s: LayoutStoreState) => s.mobileMenuOpen);
  const toggleMobileMenu = useLayoutStore((s: LayoutStoreState) => s.toggleMobileMenu);

  // Theme store
  const themeMode = useUIStore((s: UIStoreState) => s.themeMode);
  const setThemeMode = useUIStore((s: UIStoreState) => s.setThemeMode);

  // Auth store (shared across apps)
  const user = useAuthStore((s: AuthStoreState) => s.user);

  function toggleTheme() {
    const next = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'auto' : 'light';

    setThemeMode(next);
  }

  if (!headerVisible) return null;

  // -----------------------------
  // 🔥 Role‑based navbar filtering
  // -----------------------------
  const roles = user?.role ?? [];

  const filteredLinks = navbarLinks.filter((nav) => {
    // Guest-only links (role: [])
    if (nav.role.length === 0) return !user;

    // Authenticated links
    return user && nav.role.some((r) => roles.some((role) => role === r));
  });

  return (
    <header className='fixed inset-x-0 top-0 z-50 bg-dark-hard shadow-md'>
      <main className='navbar flex items-center justify-between p-4'>
        {/* Brand */}
        <section className='flex items-center text-dark-light'>
          <a href='/' className='text-lg font-semibold hover:text-white transition-colors'>
            Domo
          </a>
        </section>
        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center space-x-6 text-dark-light ml-auto pr-5'>
          {/* Theme Toggle */}
          <button
          type='button'
            onClick={toggleTheme}
            className='mr-4 rounded border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-sm font-semibold text-(--sea-ink) shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5'
          >
            {themeMode === 'auto' ? 'Auto' : themeMode === 'dark' ? 'Dark' : 'Light'}
          </button>
          {/* Dynamic navbar links */}
          {filteredLinks.map((link) => (
            <a key={link.title} href={link.link} className='hover:text-white transition-colors'>
              {link.title}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
        type='button'
          onClick={toggleMobileMenu}
          className='md:hidden text-dark-light px-3 py-2 rounded hover:bg-dark-soft'
        >
          ☰
        </button>
      </main>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className='md:hidden absolute right-4 top-16 z-50 bg-dark-hard p-4 rounded-md shadow-lg'>
          <nav className='flex flex-col space-y-4 text-dark-light'>
            {/* Dynamic mobile links */}
            {filteredLinks.map((link) => (
              <a key={link.title} href={link.link} className='hover:text-white transition-colors'>
                {link.title}
              </a>
            ))}
            {/* Theme toggle */}
            <button
            type='button'
              onClick={toggleTheme}
              className='rounded border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-sm font-semibold text-(--sea-ink) shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5'
            >
              {themeMode === 'auto' ? 'Auto' : themeMode === 'dark' ? 'Dark' : 'Light'}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

export { UiHeader };
