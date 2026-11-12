// apps/my_start/src/routes/login.tsx

import { emailRegex, pwRegex } from '@domo/constants';
import { Captcha, EmailInput, PasswordInput } from '@domo/reusableComponents';
import { UiButton } from '@domo/ui-buttons';
import { createFileRoute, Link } from '@tanstack/react-router';
import { type ChangeEvent, type SyntheticEvent, useState } from 'react';
import { signIn } from '../lib/auth-client';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
});

function RouteComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState('');

  const validateForm = (): string | null => {
    if (!emailRegex.test(email)) return 'Please enter a valid email address.';

    if (!pwRegex.test(password))
      return 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character (@$!%*?&).';
    return null;
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setCaptchaError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!captchaVerified) {
      setCaptchaError('Please complete the CAPTCHA verification.');
      return;
    }

    setIsPending(true);

    try {
      const response = await signIn.email({ email, password });
      if (response.error) {
        setError(response.error.message ?? 'Unable to sign in. Please try again.');
        return;
      }
      window.location.assign('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className='relative flex h-vh items-center justify-center overflow-hidden p-4 pb-15 mb-4'>
      <main className='island-shell rise-in flex flex-col items-center justify-center max-w-400 px-4 text-center rounded-lg'>
        <div className='pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]' />
        <div className='pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]' />
        <form className='flex w-75 flex-col items-center' onSubmit={handleSubmit}>
          <h1 className='m-4 text-4xl font-semibold'> Sign in</h1>
          <EmailInput
            placeholder='Enter Email'
            autoComplete='email'
            required
            value={email}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
            disabled={isPending}
          />
          <PasswordInput
            placeholder='Enter Password'
            autoComplete='current-password'
            required
            value={password}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
            disabled={isPending}
          />
          {error && (
            <p role='alert' className='text-sm text-red-600 dark:text-red-400'>
              {error}
            </p>
          )}

          <Captcha
            onVerify={(isVerified: boolean) => {
              setCaptchaVerified(isVerified);
              if (isVerified) setCaptchaError('');
            }}
          />

          {captchaError && (
            <p className='p-4 text-center text-red-500 text-sm mt-2 font-semibold'>
              {captchaError}
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
