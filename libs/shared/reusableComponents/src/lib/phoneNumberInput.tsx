// libs/shared/reusableComponents/src/lib/phoneNumberInput.tsx
import type { ChangeEvent, FocusEvent } from 'react';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneInput =
  (ReactPhoneInput as unknown as { default: typeof ReactPhoneInput }).default || ReactPhoneInput;

interface SimpleField {
  name: string;
  state: {
    value: string;
    meta: {
      errors: string[];
      isValidating: boolean;
      isTouched?: boolean;
    };
  };
  handleChange: (val: string) => void;
  handleBlur: () => void;
}

export interface PhoneNumberInputProps {
  field?: SimpleField;
  label?: string;
  placeholder?: string;
  name?: string;
  id?: string;
  value?: string;
  onChange?: (val: string | ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e?: FocusEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
}

function PhoneNumberInput({
  field,
  label = '',
  placeholder = '',
  name,
  id,
  value,
  onChange,
  onBlur,
  className = '',
  disabled = false,
  required = false,
  autoComplete,
}: PhoneNumberInputProps) {
  const inputName = name ?? field?.name ?? 'phoneNumber';
  const inputId = id ?? field?.name ?? 'phoneNumber';
  const inputValue = field ? (field.state.value ?? '') : (value ?? '');

  const errors = field?.state?.meta?.errors ?? [];
  const isTouched = field?.state?.meta?.isTouched ?? false;
  const isError = isTouched && errors.length > 0;

  const handleChange = (val: string) => {
    if (field) {
      field.handleChange(val);
    }
    if (onChange) {
      onChange(val);
    }
  };

  const handleBlur = () => {
    if (field) {
      field.handleBlur();
    }
    onBlur?.();
  };

  return (
    <div className={`text-dark-light flex flex-col  ${className}`}>
      {label && (
        <label htmlFor={inputId} className='text-dark-light mb-2 font-semibold block'>
          {label}
        </label>
      )}
      <PhoneInput
        country='us'
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        inputProps={{
          name: inputName,
          id: inputId,
          required,
          autoComplete,
        }}
        inputStyle={{
          width: '100%',
          // paddingTop: '0.75rem',
          // paddingBottom: '0.75rem',
          // marginTop: '.375rem',
          // marginBottom: '.375rem',
          // borderRadius: '.385rem',
          border: isError ? '1px solid #ef4444' : 'none',
          height: '3.5rem',
          color: '#0f172a',
        }}
      />
      {isError && <p className='text-red-500 text-xs mt-1'>{errors[0]}</p>}
    </div>
  );
}

export { PhoneNumberInput };
