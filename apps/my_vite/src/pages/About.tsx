import React from 'react';

 const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 space-y-12">
      <header className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white">
          About The Project
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Scaling web infrastructure through modern tooling and modular component libraries.
        </p>
      </header>

      <section className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Our Architecture
        </h2>
        <p>
          This project utilizes an Nx monorepo architecture designed to decouple domain logic from application entry points. Shared UI dependencies—such as headers, footers, and sidebars—are managed as isolated workspace libraries.
        </p>
        <p>
          By pairing Vite for local development compilation with Tailwind CSS for design constraints, we ensure low runtime overhead and fast iteration loops.
        </p>
      </section>

      {/* Tech Stack List */}
      <section className="space-y-4 pb-20">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Core Technologies
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white">React & TypeScript</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Strict type safety with component-driven architecture.</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white">Vite</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Next-generation frontend tooling for instant server starts.</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white">Nx Workspaces</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Monorepo execution graph for build caching and dependency management.</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white">Tailwind CSS</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Utility-first CSS framework for rapid UI styling.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export {About};