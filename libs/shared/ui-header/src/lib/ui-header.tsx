import { Link } from 'react-router-dom';
import ThemeToggle from './themeToggle.js';

export function UiHeader() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-dark-hard shadow-md">
      <main className="navbar flex justify-between p-2">
        <section className="flex items-center">
          <Link to="/">
            <img alt="Logo" className="w-16" />
          </Link>
        </section>
        <div className="relative hidden md:flex items-center text-dark-light pr-5 ml-auto">
          <span className="flex flex-col items-center mr-4">
            <div className="flex gap-4">
              <ThemeToggle />
              <Link to="/" className="hover:text-indigo-400 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="hover:text-indigo-400 transition-colors"
              >
                About
              </Link>
            </div>
          </span>
        </div>
      </main>
    </nav>
  );
}

export default UiHeader;
