import { Link } from 'react-router-dom';
import { useLayoutStore } from '@domo/state';
import { useUIStore } from '@domo/state';

export function UiHeader() {
  // Layout store
  const headerVisible = useLayoutStore((s) => s.headerVisible);
  const toggleMobileMenu = useLayoutStore((s) => s.toggleMobileMenu);

  // Theme store
  const themeMode = useUIStore((s) => s.themeMode);
  const setThemeMode = useUIStore((s) => s.setThemeMode);

  function toggleTheme() {
    const next =
      themeMode === 'light'
        ? 'dark'
        : themeMode === 'dark'
        ? 'auto'
        : 'light';

    setThemeMode(next);
  }

  if (!headerVisible) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-dark-hard shadow-md">
      <main className="navbar flex items-center justify-between p-4">

        {/* Brand */}
        <section className="flex items-center text-dark-light">
          <Link
            to="/"
            className="text-lg font-semibold hover:text-white transition-colors"
          >
            Domo
          </Link>
        </section>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-dark-light ml-auto pr-5">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="mr-4 rounded border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-sm font-semibold text-(--sea-ink) shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5"
          >
            {themeMode === 'auto'
              ? 'Auto'
              : themeMode === 'dark'
              ? 'Dark'
              : 'Light'}
          </button>

          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>

          <Link to="/about" className="hover:text-white transition-colors">
            About
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-dark-light px-3 py-2 rounded hover:bg-dark-soft"
        >
          ☰
        </button>
      </main>
    </header>
  );
}

export default UiHeader;
