// apps/my_start/src/routes/register.tsx
import { dateRegex, emailRegex, phoneRegex, pwRegex } from '@domo/constants';
import {
  EmailInput,
  PasswordInput,
  PhoneNumberInput,
  StyledDatePicker,
  TextInput,
} from '@domo/reusableComponents';
import { UiButton } from '@domo/ui-buttons';
import { createFileRoute, Link } from '@tanstack/react-router';
import { type ChangeEvent, type SyntheticEvent, useState } from 'react';
import { signUp } from '../lib/auth-client';

export const Route = createFileRoute('/register')({
  component: RouteComponent,
});

function RouteComponent() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const validateForm = (): string | null => {
    if (!firstName.trim()) return 'First name is required.';
    if (!lastName.trim()) return 'Last name is required.';
    if (!emailRegex.test(email)) return 'Please enter a valid email address.';
    if (!phoneRegex.test(phoneNumber))
      return 'Please enter a valid phone number (e.g., +12025550123).';
    if (!dateRegex.test(birthDate)) return 'Please enter a valid birth date in MM-DD-YYYY format.';
    if (!pwRegex.test(password))
      return 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character (@$!%*?&).';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsPending(true);

    try {
      const response = await signUp.email({
        email,
        password,
        name: `${firstName} ${lastName}`.trim(),
        firstName,
        lastName,
        phoneNumber,
        birthDate,
      });

      if (response.error) {
        setError(response.error.message ?? 'Unable to sign up. Please try again.');
        return;
      }

      window.location.assign('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign up. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className='relative flex h-vh items-center justify-center overflow-hidden p-4 pb-15 mb-4'>
      <main className='island-shell rise-in max-w-400 flex min-h-[60vh] flex-col items-center justify-center rounded-lg px-4 text-center'>
        <div className='pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]' />
        <div className='pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]' />
        <form className='flex w-75 flex-col items-center' onSubmit={handleSubmit}>
          <h1 className='m-4 text-4xl font-semibold'>Create account</h1>

          <TextInput
            placeholder='Enter First Name'
            autoComplete='given-name'
            required
            value={firstName}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setFirstName(event.target.value)}
            disabled={isPending}
          />

          <TextInput
            placeholder='Enter Last Name'
            autoComplete='family-name'
            required
            value={lastName}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setLastName(event.target.value)}
            disabled={isPending}
          />

          <EmailInput
            placeholder='Enter Email'
            autoComplete='email'
            required
            value={email}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
            disabled={isPending}
          />

          <PhoneNumberInput
            placeholder='Enter Phone Number'
            autoComplete='tel'
            required
            value={phoneNumber}
            onChange={(val) => setPhoneNumber(typeof val === 'string' ? val : val.target.value)}
            disabled={isPending}
          />

          <StyledDatePicker
            placeholder='DD-MM-YYYY'
            required
            value={birthDate}
            onChange={(val) => setBirthDate(typeof val === 'string' ? val : val.target.value)}
            disabled={isPending}
            className='demo-select m-4'
          />

          <PasswordInput
            placeholder='Enter Password'
            required
            value={password}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
            disabled={isPending}
          />

          <PasswordInput
            placeholder='Confirm Password'
            required
            value={confirmPassword}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(event.target.value)
            }
            disabled={isPending}
          />

          {error && (
            <p role='alert' className='text-sm text-red-600 dark:text-red-400'>
              {error}
            </p>
          )}

          <p className='text-dark-hard mt-4 text-center text-sm'>
            Already have an account?{' '}
            <Link to='/login' className='font-bold text-blue-400 hover:underline'>
              Sign in
            </Link>
          </p>

          <UiButton type='submit' className='demo-button w-full m-2' disabled={isPending}>
            {isPending ? 'Signing up...' : 'Submit'}
          </UiButton>
        </form>
      </main>
    </div>
  );
}
