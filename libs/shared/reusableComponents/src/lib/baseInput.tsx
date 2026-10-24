// libs/shared/reusableComponents/src/lib/baseInput.tsx
import { formatNameToTitle } from '@domo/utils';
import { useState } from 'react';

// --- Icon Definitions ---

// export const formatNameToTitle = (snakeCaseStr: string): string => {
//   return snakeCaseStr
//     .split('_')
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(' ');
// };

// SVG for 'Hide password' (Eye with slash)
const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a10.05 10.05 0 011.175-4.875M3.515 3.515L20.485 20.485M10.477 10.477a2.25 2.25 0 003.045 3.045"
    />
  </svg>
);

// SVG for 'Show password' (Eye)
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-.162.607-.387 1.19-.667 1.735"
    />
  </svg>
);

// --- Component Interface ---

interface Field {
  state: {
    meta: any;
    value: string | null;
  };
  name: string;
  handleChange: (value: string) => void;
  handleBlur: () => void;
}

// --- BaseInput Component ---

const BaseInput = ({
  field,
  label,
  type = 'text',
  className = '',
}: {
  field: Field;
  label: string;
  type?: string;
  className?: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';

  // Determine the actual HTML input type
  const inputType = isPasswordType && showPassword ? 'text' : type;

  // Determine if the field has an error for potential border color change
  const isError = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={field.name} className="text-dark-light font-semibold block">
        {formatNameToTitle(field.name)}
      </label>

      {/* Input container for positioning the toggle button */}
      <div className="relative w-full">
        <input
          id={field.name}
          name={field.name}
          value={field.state.value ?? ''}
          onBlur={field.handleBlur}
          onChange={e => field.handleChange(e.target.value)}
          // Use the determined inputType
          type={inputType}
          placeholder={label}
          className={`
            placeholder:text-dark-light bg-white text-dark-hard my-3 rounded-lg px-5 py-4  block outline-none border w-full
            ${isPasswordType ? 'pr-12' : ''} 
            ${isError ? 'border-red-500' : 'border-dark-light'}
          `}
        />

        {/* Password Toggle Button */}
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-light hover:text-dark-soft"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>

      {field.state.meta.errors.length > 0 && field.state.meta.isTouched ? (
        <em className="text-red-500 text-xs italic">{field.state.meta.errors.join(', ')}</em>
      ) : null}
      {field.state.meta.isValidating ? (
        <p className="text-blue-500 text-xs italic">Validating...</p>
      ) : null}
    </div>
  );
};

export { BaseInput };
