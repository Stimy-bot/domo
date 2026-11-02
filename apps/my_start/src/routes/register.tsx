import { createFileRoute, Link } from '@tanstack/react-router';
import { type FormEvent, useState } from 'react';
import { signUp } from '../lib/auth-client';

export const Route = createFileRoute('/register')({
  component: RouteComponent,
});

function RouteComponent() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsPending(true);
    try {
      const response = await signUp.email({
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        email,
        password,
      });
      if (response.error) {
        setError(response.error.message ?? 'Unable to register. Please try again.');
        return;
      }

      window.location.assign('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to register. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-4">
      <main className="island-shell rise-in flex flex-col items-center justify-center max-w-400 min-h-[60vh] px-4 text-center rounded-lg">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <form className="pt-5 w-75 flex flex-col items-center" onSubmit={handleSubmit}>
          <h1 className="text-4xl font-semibold pt-5 mb-2">REGISTER</h1>
          <input
            type="text"
            placeholder="Enter First Name"
            className="demo-input m-2"
            autoComplete="given-name"
            required
            value={firstName}
            onChange={event => setFirstName(event.target.value)}
            disabled={isPending}
          />
          <input
            type="text"
            placeholder="Enter Last Name"
            className="demo-input m-2"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={event => setLastName(event.target.value)}
            disabled={isPending}
          />
          <input
            type="email"
            placeholder="Enter Email"
            className="demo-input m-2"
            autoComplete="email"
            required
            value={email}
            onChange={event => setEmail(event.target.value)}
            disabled={isPending}
          />
          <input
            type="password"
            placeholder="Enter Password"
            className="demo-input m-2"
            autoComplete="new-password"
            required
            value={password}
            onChange={event => setPassword(event.target.value)}
            disabled={isPending}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="demo-input m-2"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={event => setConfirmPassword(event.target.value)}
            disabled={isPending}
          />
          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <p className="text-dark-hard text-sm text-center  dark:text-dark-light">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 font-bold hover:underline">
              Sign in
            </Link>
          </p>
          <button type="submit" className="demo-button m-2" disabled={isPending}>
            {isPending ? 'Creating account...' : 'Submit'}
          </button>
        </form>
      </main>
    </div>
  );
}
