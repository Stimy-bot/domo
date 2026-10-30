// src/pages/Notfound.tsx
import { Link } from "@tanstack/react-router";

export default function Notfound() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden p-4">
      <main className="island-shell rise-in flex flex-col items-center justify-center max-w-200 min-h-[60vh] px-4 text-center rounded-lg">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <h1 className="text-4xl font-bold tracking-tight mb-3">404</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-medium shadow hover:opacity-90 transition-opacity"
        >
          Return Home
        </Link>
      </main>
    </div>
  );
}
