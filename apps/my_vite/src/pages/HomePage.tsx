import React from 'react';
import { Link } from 'react-router-dom';

 const HomePage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col justify-center items-center text-center px-4 py-12">
      <div className="max-w-3xl space-y-6">
        <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-400 rounded-full">
          Vite + React + Tailwind
        </span>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Build faster web applications with <span className="text-indigo-600 dark:text-indigo-400">Nx & Domo</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
          A high-performance workspace boilerplate designed for modern full-stack development, seamless modular architecture, and rapid UI prototyping.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/about"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors shadow-sm"
          >
            Learn More About Us
          </Link>
          <a
            href="https://vitejs.dev"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium transition-colors"
          >
            Vite Documentation
          </a>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mt-16 text-left">
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 font-bold"><span role="img" aria-label="Lightning fast">⚡</span></div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Lightning Fast</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Powered by Vite and ESBuild for instant HMR and quick builds.</p>
        </div>

        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 font-bold"><span role="img" aria-label="Package">📦</span></div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Monorepo Ready</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Modularized components imported cleanly from shared UI libraries.</p>
        </div>

        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 font-bold"><span role="img" aria-label="Artist palette">🎨</span></div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Tailwind Styling</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Utility-first CSS setup out-of-the-box for clean, responsive design.</p>
        </div>
      </div>
    </div>
  );
};

export {HomePage};