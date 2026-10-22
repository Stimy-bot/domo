// src/pages/Notfound.tsx
import { Link } from '@tanstack/react-router';

export default function Notfound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
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
  );
}