import { formatNameToTitle } from '@domo/utils';
import type { ComponentProps, ReactNode } from 'react';
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

export interface OptionItem {
  label: string;
  value: string | number;
}

// Field values can be primitive input values, multi-select string arrays, or FileList
export type FieldValue = string | number | string[] | FileList | null | undefined;

interface Field {
  state: {
    meta: {
      isTouched?: boolean;
      errors?: string[];
      isValidating?: boolean;
      [key: string]: unknown;
    };
    value: FieldValue;
  };
  name: string;
  handleChange: (value: FieldValue) => void;
  handleBlur: () => void;
}

export type BaseInputProps = (
  | Omit<ComponentProps<'input'>, 'type'>
  | ComponentProps<'textarea'>
  | ComponentProps<'select'>
) & {
  field?: Field;
  label?: string;
  type?:
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'date'
    | 'textarea'
    | 'select'
    | 'image'
    | 'file';
  options?: OptionItem[];
  accept?: string;
  placeholder?: string;
  children?: ReactNode;
};

// Union event types for all three elements
type FormElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type ChangeEvent = React.ChangeEvent<FormElement>;
type BlurEvent = React.FocusEvent<FormElement>;

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
  accept,
  options = [],
  children,
  ...rest
}: BaseInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';
  const isFileType = type === 'image' || type === 'file';

  const inputType = isPasswordType && showPassword ? 'text' : isFileType ? 'file' : type;

  const inputId = id ?? field?.name;
  const inputName = name ?? field?.name;
  const inputValue = field
    ? (field.state.value ?? (isFileType ? undefined : ''))
    : (value ?? '');
  const inputPlaceholder = placeholder ?? label;

  const meta = field?.state?.meta;
  const errors = meta?.errors ?? [];
  const isTouched = meta?.isTouched ?? false;
  const isValidating = meta?.isValidating ?? false;
  const isError = isTouched && errors.length > 0;

  const handleChange = (e: ChangeEvent) => {
    let val: FieldValue = e.target.value;

    if (isFileType) {
      const target = e.target as HTMLInputElement;
      val = target.files;
    }

    if (field) {
      field.handleChange(val);
    }

    onChange?.(e as React.ChangeEvent<HTMLInputElement> & React.ChangeEvent<HTMLTextAreaElement> & React.ChangeEvent<HTMLSelectElement>);
  };

  const handleBlur = (e: BlurEvent) => {
    if (field) {
      field.handleBlur();
    }

    onBlur?.(e as React.FocusEvent<HTMLInputElement> & React.FocusEvent<HTMLTextAreaElement> & React.FocusEvent<HTMLSelectElement>);
  };

  const commonClassName = `
    vite-placeholder
    vite-input
    vite-comment
    demo-input
    demo-select
    ${isError ? 'border-red-500' : 'border-gray-300'}
  `;

  return (
    <div className={`mb-4 ${className}`}>
      {(inputName || label) && (
        <label htmlFor={inputId} className='vite-label block font-semibold mb-1'>
          {label ?? (inputName ? formatNameToTitle(inputName) : '')}
        </label>
      )}

      <div className='relative w-full'>
        {type === 'date' ? (
          <input
            {...(rest as ComponentProps<'input'>)}
            id={inputId}
            name={inputName}
            type='date'
            value={inputValue as number | readonly string[] | undefined}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={inputPlaceholder}
            className={commonClassName}
          />
        ) :

        type === 'textarea' ? (
          <textarea
            {...(rest as ComponentProps<'textarea'>)}
            id={inputId}
            name={inputName}
            value={inputValue as string | number | readonly string[] | undefined}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder={inputPlaceholder}
            className={commonClassName}
          />
        ) : type === 'select' ? (
          <select
            {...(rest as ComponentProps<'select'>)}
            id={inputId}
            name={inputName}
            value={inputValue as string | number | readonly string[] | undefined}
            onBlur={handleBlur}
            onChange={handleChange}
            className={commonClassName}
          >
            <option value='' disabled>
              {inputPlaceholder || 'Select an option'}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
            {children}
          </select>
        ) : (
          <input
            {...(rest as ComponentProps<'input'>)}
            id={inputId}
            name={inputName}
            value={isFileType ? undefined : (inputValue as string | number | readonly string[] | undefined)}
            onBlur={handleBlur}
            onChange={handleChange}
            type={inputType}
            accept={type === 'image' ? 'image/*' : accept}
            placeholder={inputPlaceholder}
            className={`
              ${commonClassName}
              ${isPasswordType ? 'pr-12' : ''}
            `}
          />
        )}

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
