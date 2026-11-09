// apps/my_start/src/routes/login.tsx
import { useToast } from '@domo/context';
import { EmailInput, PasswordInput } from '@domo/reusableComponents';
import { UiButton } from '@domo/ui-buttons';
import { createFileRoute, Link } from '@tanstack/react-router';
import { type SyntheticEvent, useState } from 'react';
import { signIn } from '../lib/auth-client';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
});

function RouteComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const response = await signIn.email({ email, password });
      if (response.error) {
        const message = response.error.message ?? 'Unable to sign in. Please try again.';
        setError(message);
        addToast({ message, type: 'error' });
        return;
      }

      addToast({ message: 'Signed in successfully! Redirecting...', type: 'success' });
      window.location.assign('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in. Please try again.';
      setError(message);
      addToast({ message, type: 'error' });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className='relative flex h-vh items-center justify-center overflow-hidden p-4 pb-15 mb-4'>
      <main className='island-shell rise-in flex flex-col items-center justify-center max-w-400 px-4 text-center rounded-lg'>
        <div className='pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]' />
        <div className='pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]' />
        <form className='pt-5 w-75 flex flex-col items-center' onSubmit={handleSubmit}>
          <h1 className='text-4xl font-semibold pt-5 mb-2'> Sign in to your account</h1>
          <EmailInput
            placeholder='Enter Email'
            autoComplete='email'
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isPending}
          />
          <PasswordInput
            placeholder='Enter Password'
            autoComplete='current-password'
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isPending}
          />
          {error && (
            <p role='alert' className='text-sm text-red-600 dark:text-red-400'>
              {error}
            </p>
          )}
          <p className='text-dark-hard text-sm text-center mt-4'>
            Don&apos;t have an account?{' '}
            <Link to='/register' className='font-bold text-blue-400 hover:underline'>
              Sign up
            </Link>
          </p>
          <UiButton type='submit' className='demo-button w-full m-2' disabled={isPending}>
            {isPending ? 'Signing in...' : 'Submit'}
          </UiButton>
        </form>
      </main>
    </div>
  );
}
