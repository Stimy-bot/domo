import React, { forwardRef, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import { cn } from '@domo/utils';

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
  VariantProps<typeof inputVariants> {
  children?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ children, className, variant, customSize, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === 'password';

    let displayValue = props.value;
    if (type === 'date' && typeof displayValue === 'string' && displayValue !== '') {
      // Regex checks if it's actually YYYY-MM-DD
      const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
      if (!dateRegex.test(displayValue)) {
        displayValue = '';
      }
    }

    const inputType = isPasswordType && showPassword ? 'text' : type;

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          type={inputType}
          className={cn(inputVariants({ variant, customSize, className }))}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
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
            ) : (
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
            )}
          </button>
        )}
        {children}
      </div>
    );
  }
);

const inputVariants = cva('rounded-lg', {
  variants: {
    variant: {
      primary:
        'placeholder:text-[#959ead] text-dark-hard font-semibold border mt-2',
      secondary:
        'text-dark-light p-2 bg-dark-hard hover:text-white border-1 mb-2',
    },
    customSize: {
      sm: 'text-sm px-1 py-0',
      md: 'text-base px-2 py-1',
      lg: 'text-lg px-4 py-4',
    },
  },
  defaultVariants: {
    variant: 'primary',
    customSize: 'md',
  },
});

Input.displayName = 'Input';
export default Input;
