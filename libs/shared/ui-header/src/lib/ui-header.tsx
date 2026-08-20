
import { Link } from 'react-router-dom';

export function UiHeader() {
  return (
    <header className="bg-dark-hard text-dark-light px-6 py-4 flex items-center justify-between">
      <div className="font-bold text-xl tracking-tight">Domo App</div>
      <nav className="flex gap-6 text-sm font-medium">
        <Link to="/" className="hover:text-indigo-400 transition-colors">
          Home
        </Link>
        <Link to="/about" className="hover:text-indigo-400 transition-colors">
          About
        </Link>
      </nav>
    </header>
  );
}

export default UiHeader;