// libs/shared/reusableComponents/src/lib/styledDatePicker.tsx
import type { ChangeEvent, FocusEvent } from 'react';
import { CustomDatePicker } from './customDatePicker';

interface SimpleField {
  name: string;
  state: {
    value: string;
    meta: {
      errors?: string[];
      isTouched?: boolean;
    };
  };
  handleBlur: () => void;
  handleChange: (value: string | null) => void;
}

export interface StyledDatePickerProps {
  field?: SimpleField;
  label?: string;
  placeholder?: string;
  name?: string;
  id?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement> | string) => void;
  onBlur?: (e?: FocusEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
}

const StyledDatePicker = ({
  field,
  label = '',
  placeholder = 'YYYY-MM-DD',
  name,
  id,
  value,
  onChange,
  onBlur,
  className = '',
  disabled = false,
}: StyledDatePickerProps) => {
  const inputName = name ?? field?.name ?? 'birthDate';
  const inputId = id ?? field?.name ?? 'birthDate';
  const rawValue = field ? field.state.value : (value ?? '');

  const errors = field?.state?.meta?.errors ?? [];
  const isTouched = field?.state?.meta?.isTouched ?? false;
  const isError = isTouched && errors.length > 0;

  const handleDateChange = (date: Date | null) => {
    const formattedDate: string | null = date ? (date.toISOString().split('T')[0] ?? null) : null;

    if (field) {
      field.handleChange(formattedDate);
    }

    if (onChange) {
      onChange(formattedDate ?? '');
    }
  };

  const handleBlur = () => {
    if (field) {
      field.handleBlur();
    }
    onBlur?.();
  };

  return (
    <div className={`mb-4 flex flex-col ${className}`}>
      {label && (
        <label htmlFor={inputId} className='mb-1 block font-semibold'>
          {label}
        </label>
      )}
      <CustomDatePicker
        selected={rawValue ? new Date(rawValue) : null}
        onChange={handleDateChange}
        onBlur={handleBlur}
        placeholderText={placeholder}
        disabled={disabled}
        name={inputName}
        id={inputId}
      />
      {isError && <p className='mt-1 text-xs italic text-red-500'>{errors.join(', ')}</p>}
    </div>
  );
};

export { StyledDatePicker };
