// libs/shared/reusableComponents/src/lib/baseInput.tsx
import { formatNameToTitle } from '@domo/utils';
import type { ComponentProps } from 'react';
import { useState } from 'react';

// SVG for 'Hide password' (Eye with slash)
const EyeOffIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='h-5 w-5'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a10.05 10.05 0 011.175-4.875M3.515 3.515L20.485 20.485M10.477 10.477a2.25 2.25 0 003.045 3.045'
    />
  </svg>
);

// SVG for 'Show password' (Eye)
const EyeIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='h-5 w-5'
    fill='none'
    viewBox='0 0 24 24'
    stroke='currentColor'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
    />
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.162.607-.387 1.19-.667 1.735'
    />
  </svg>
);

// --- Component Interface ---

interface Field {
  state: {
    meta: {
      isTouched?: boolean;
      errors?: string[];
      isValidating?: boolean;
      [key: string]: any;
    };
    value: string | null;
  };
  name: string;
  handleChange: (value: string) => void;
  handleBlur: () => void;
}

export interface BaseInputProps extends Omit<ComponentProps<'input'>, 'field'> {
  field?: Field;
  label?: string;
}

// --- BaseInput Component ---

const BaseInput = ({
  field,
  label,
  type = 'text',
  className = '',
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  ...rest
}: BaseInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';

  // Determine actual HTML input type
  const inputType = isPasswordType && showPassword ? 'text' : type;

  // Resolve values whether using TanStack form `field` or standard React props
  const inputId = id ?? field?.name;
  const inputName = name ?? field?.name;
  const inputValue = field ? (field.state.value ?? '') : (value ?? '');
  const inputPlaceholder = placeholder ?? label;

  // Resolve errors from TanStack Form field meta (if present)
  const meta = field?.state?.meta;
  const errors = meta?.errors ?? [];
  const isTouched = meta?.isTouched ?? false;
  const isValidating = meta?.isValidating ?? false;
  const isError = isTouched && errors.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field) {
      field.handleChange(e.target.value);
    }
    onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (field) {
      field.handleBlur();
    }
    onBlur?.(e);
  };

  return (
    <div className={`mb-4 ${className}`}>
      {(inputName || label) && (
        <label htmlFor={inputId} className='text-dark-light block font-semibold'>
          {label ?? (inputName ? formatNameToTitle(inputName) : '')}
        </label>
      )}

      {/* Input container for positioning the toggle button */}
      <div className='relative w-full'>
        <input
          {...rest}
          id={inputId}
          name={inputName}
          value={inputValue}
          onBlur={handleBlur}
          onChange={handleChange}
          type={inputType}
          placeholder={inputPlaceholder}
          className={`
            placeholder:block w-full
            ${isPasswordType ? 'pr-12' : ''}
            ${isError ? 'border-red-500' : 'border-gray-300'}
          `}
        />

        {/* Password Toggle Button */}
        {isPasswordType && (
          <button
            type='button'
            onClick={() => setShowPassword((prev) => !prev)}
            className='absolute right-2 top-1/2 -translate-y-1/2 transform'
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>

      {isError && <em className='text-xs italic text-red-500'>{errors.join(', ')}</em>}
      {isValidating && <p className='text-xs italic text-blue-500'>Validating...</p>}
    </div>
  );
};

export { BaseInput };
