// libs/shared/reusableComponents/src/lib/submitButton.tsx

import { type FormApi, useStore } from '@tanstack/react-form';
import { Button } from './button';
import { Spinner } from './spinner';

// Note: The FormApi generics must match the definition from your FormFactory (likely ending in 'never')
// Using the previous correction:
interface SubmitButtonProps<TFormValues> {
  form: FormApi<
    TFormValues,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    never // Use 'never' for consistency
  >;
  children: React.ReactNode;
  disabled?: boolean;
  submitButtonText: string; // <-- new prop
}

function SubmitButton<TValues>({
  form,
  children,
  disabled,
  submitButtonText,
}: SubmitButtonProps<TValues>) {
  // FIX APPLIED: Remove the explicit 's: typeof form.store' type declaration.
  // We allow TypeScript to infer the correct internal FormState type.
  const [isSubmitting, canSubmit] = useStore(form.store, (s) => [s.isSubmitting, s.canSubmit]);

  const isDisabled = disabled || isSubmitting || !canSubmit;

  return (
    <Button
      type='submit'
      disabled={isDisabled}
      className='bg-blue-400 text-white font-semibold text-lg w-full rounded-lg my-6  hover:opacity-75 flex items-center justify-center gap-3'
    >
      {isSubmitting && <Spinner size='sm' variant='light' />}
      {isSubmitting ? 'Submitting...' : (submitButtonText ?? children)}
    </Button>
  );
}

export { SubmitButton };
